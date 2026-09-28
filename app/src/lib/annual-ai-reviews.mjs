import {createHash} from 'node:crypto';
import data from '../data/annual-ai-reviews.json' with {type:'json'};
import originals from '../data/phase-204-reader-completion.json' with {type:'json'};
import policy from '../data/build-review-policy.json' with {type:'json'};
import evidence from '../data/phase-60-current-decisions.json' with {type:'json'};
import {applyAnnualCaseReview} from './annual-case-reviews.mjs';
const hash=value=>createHash('sha256').update(JSON.stringify(value)).digest('hex');
const validDate=value=>typeof value==='string'&&/^\d{4}-\d{2}-\d{2}$/.test(value)&&Number.isFinite(new Date(value+'T00:00:00Z').valueOf())&&new Date(value+'T00:00:00Z').toISOString().slice(0,10)===value;
export const annualAiReviewData=data;
export const annualAiReviewStatus='AI editorial review accepted with stated limits';
export const annualAiReviewDate=data.review_date;
export const annualAiInputReceipts=new Map(evidence.receipts.map(r=>[r.receipt_id,r]));
/** The assessed reading is the exact dated clarification view, not a rewritten original.
 * @param {any} article @param {any} current
 */
export const annualAssessedReading=(article,current)=>({record_id:article.record_id,title:current.title,overview:current.overview,sections:current.sections,source_ids:article.source_ids,related_paths:article.related_paths??[]});
/** @param {any} decision @param {any[]} articles @param {Map<string,any>} receipts */
export function validateAnnualAiDecision(decision,articles=originals.records,receipts=annualAiInputReceipts){
  const {review_payload_sha256,...body}=decision;
  if(hash(body)!==review_payload_sha256||!validDate(decision.review_date))throw Error('Annual AI decision payload drift');
  if(!decision.record_id.startsWith('203-')||!decision.rationale||!decision.disposition||decision.independent_human_review!==false||decision.new_operating_observation!==false||decision.new_safety_classification!==false||decision.new_series_admission!==false)throw Error('Annual AI decision boundary drift');
  if(!decision.readings?.length||decision.readings[0].record_id!==decision.record_id||new Set(decision.readings.map(r=>r.record_id)).size!==decision.readings.length||new Set(decision.claim_findings.map(r=>r.claim_id)).size!==decision.claim_findings.length)throw Error('Annual AI decision coverage drift');
  for(const reading of decision.readings){
    const article=articles.find(r=>r.record_id===reading.record_id);
    if(!article||hash(article)!==reading.original_payload_sha256)throw Error('Annual AI original drift');
    const current=applyAnnualCaseReview(article,{route:reading.route});
    if(!current.review||hash(current.review)!==reading.existing_review_payload_sha256||hash(annualAssessedReading(article,current))!==reading.current_reading_sha256)throw Error('Annual AI assessed view drift');
    if(reading.sections_reviewed!==current.sections.length||reading.paragraphs_reviewed!==current.sections.reduce((n,s)=>n+s.paragraphs.length,0)||reading.overview_reviewed!==true)throw Error('Annual AI reading coverage drift');
    if(JSON.stringify(reading.source_profiles.map(r=>r.source_id))!==JSON.stringify(article.source_ids)||reading.source_profiles.some(r=>r.path!==`app/src/content/sources/${r.source_id}.json`||!/^[a-f0-9]{64}$/.test(r.whole_file_sha256)))throw Error('Annual AI profile binding drift');
    for(const binding of reading.retained_contexts){
      const receipt=receipts.get(binding.id);
      if(binding.collection!=='evidence_receipts'||!receipt||hash(receipt)!==binding.payload_sha256||binding.checked_date!==receipt.source_checked_date||binding.checked_date>decision.review_date)throw Error('Annual AI receipt drift');
    }
    const seen=new Set();
    for(const change of reading.required_presentation_changes){
      const p=change.path,key=JSON.stringify(p);
      if(!Array.isArray(p)||p.length!==4||p[0]!=='sections'||p[2]!=='paragraphs'||!Number.isInteger(p[1])||p[1]<0||!Number.isInteger(p[3])||p[3]<0||seen.has(key)||current.sections[p[1]]?.paragraphs[p[3]]!==change.prior||typeof change.replacement!=='string'||!change.replacement.trim()||change.prior===change.replacement)throw Error('Annual AI edit target drift');
      seen.add(key);
    }
  }
  return decision;
}
if(data.policy_id!==policy.policy_id||policy.human_review_required!==false||data.human_review_claimed!==false||data.application_projection_integrated!==true||!validDate(data.review_date))throw Error('Annual AI policy mismatch');
if(hash(data.source_checks)!==data.source_checks_sha256||new Set(data.source_checks.map(r=>r.id)).size!==data.source_checks.length||data.source_checks.some(r=>!validDate(r.checked_date)||r.checked_date>data.review_date||!/^https:\/\//.test(r.url)||!r.finding||!r.locator||!r.access||r.independent_statistical_reconstruction!==false))throw Error('Annual AI source-check drift');
export const annualAiDecisions=data.records.map(r=>validateAnnualAiDecision(r));
export const annualAiReadings=annualAiDecisions.flatMap(decision=>decision.readings.map(reading=>({decision,reading})));
if(new Set(annualAiDecisions.map(r=>r.record_id)).size!==annualAiDecisions.length||new Set(annualAiReadings.map(r=>r.reading.record_id)).size!==annualAiReadings.length||new Set(annualAiReadings.map(r=>r.reading.route)).size!==annualAiReadings.length||data.reviewed_annual_records!==annualAiDecisions.length||data.remaining_annual_records!==data.annual_target-annualAiDecisions.length)throw Error('Annual AI total coverage drift');
/** @param {any} article @param {{route?:string,asOfDate?:string}} options */
export function annualAiReviewFor(article,{route,asOfDate=data.review_date}={}){
  if(!validDate(asOfDate))throw Error('Annual AI requires an ISO calendar date');
  const found=annualAiReadings.find(r=>r.reading.record_id===article?.record_id);
  if(!found||route!==found.reading.route||asOfDate<found.decision.review_date||hash(article)!==found.reading.original_payload_sha256)return null;
  const current=applyAnnualCaseReview(article,{route,asOfDate});
  if(hash(current.review)!==found.reading.existing_review_payload_sha256||hash(annualAssessedReading(article,current))!==found.reading.current_reading_sha256)throw Error('Annual AI current input drift');
  return found;
}
/** @param {any} article @param {{route?:string,asOfDate?:string}} options */
export function annualAiPresentation(article,options={}){
  const baseline=applyAnnualCaseReview(article,options),found=annualAiReviewFor(article,options);
  if(!found)return {...baseline,aiReview:null,aiReading:null,aiChanges:[],aiSourceChecks:[]};
  const sections=baseline.sections.map(s=>({...s,paragraphs:[...s.paragraphs]}));
  const changes=found.reading.required_presentation_changes.map(c=>({...c,heading:sections[c.path[1]].heading}));
  for(const change of changes)sections[change.path[1]].paragraphs[change.path[3]]=change.replacement;
  const ids=new Set(article.source_ids);
  return {...baseline,sections,aiReview:found.decision,aiReading:found.reading,aiChanges:changes,aiSourceChecks:data.source_checks.filter(c=>ids.has(c.source_id))};
}
