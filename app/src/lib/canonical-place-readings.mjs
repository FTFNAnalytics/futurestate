import {createHash} from 'node:crypto';
import data from '../data/canonical-place-readings.json' with {type:'json'};
import review from '../data/canonical-place-reading-reviews.json' with {type:'json'};
import atlas from '../data/phase-119-deep-project-place-atlas.json' with {type:'json'};
import portfolio from '../data/portfolio-eligibility-decisions.json' with {type:'json'};
import policy from '../data/build-review-policy.json' with {type:'json'};
import {currentEvidenceLedger} from './current-evidence.mjs';
export const placeReadingHash=value=>createHash('sha256').update(JSON.stringify(value)).digest('hex');
const requireTrue=(condition,message)=>{if(!condition)throw Error('Canonical place reading: '+message);};
const contracts=[
 {id:'119-PLACE-005',slug:'us-southwest-chip-corridor',cycle:'60-CYCLE-ARIZONA-WASTEWATER',prefix:'az-',receipts:['receipt-60-arizona-2026-11-21-watch-note'],checks:[0,1,3,4,7,8]},
 {id:'119-PLACE-009',slug:'hanford-waste-treatment',cycle:'60-CYCLE-HANFORD-MATERIAL-BALANCE',prefix:'hf-',receipts:['receipt-60-hanford-2026-11-21-watch-note'],checks:[0,1,2,3,5]},
 {id:'119-PLACE-001',slug:'florida-space-coast-launch-corridor',cycle:'60-CYCLE-SPACE-COAST-SLF-LICENCE',prefix:'slf-',receipts:['receipt-60-slf-2026-09-15-renewal-discovered','receipt-60-slf-2026-11-21-bounded-blocker'],checks:[4,0,1,2]},
 {id:'119-PLACE-003',slug:'northern-virginia-data-center-corridor',cycle:'60-CYCLE-LOUDOUN-STANDARDS',prefix:'nova-',receipts:['receipt-60-loudoun-2026-11-21-watch-note'],checks:[0,1,2,3]},
 {id:'119-PLACE-007',slug:'louisiana-broadband-adoption',cycle:'60-CYCLE-LOUISIANA-NEXTLINK-ADOPTION',additional_cycle:'60-CYCLE-LOUISIANA-STARLINK-ADOPTION',prefix:'la-',receipts:['receipt-60-nextlink-2026-11-21-watch-note','receipt-60-starlink-2026-11-21-companion-watch-note'],checks:[1,3,4,5,7,8,4,5,6,8],receipt_slots:[0,0,0,0,0,0,1,1,1,1]},
 {id:'119-PLACE-008',slug:'montana-bead-delivery',cycle:'60-CYCLE-MONTANA-COMPLETED-QUARTER',prefix:'mt-',receipts:['receipt-60-montana-2026-11-21-watch-note'],checks:[0,1,3,4,5,6,7]},
 {id:'119-PLACE-010',slug:'amtrak-accessibility-and-reliability',context:true,cycle:'60-CYCLE-AMTRAK-PIDS-CLOSEOUT',prefix:'am-',receipts:['receipt-60-pids-2026-11-21-watch-note','receipt-60-amtrak-reliability-2026-10-28-no-material-change'],checks:[1,2,3,5,6,0,2],receipt_slots:[0,0,0,0,0,1,1],assigned_contexts:[{cycle_id:'60-CYCLE-AMTRAK-NAMED-ASSET-RELIABILITY',label:'Independent named-asset reliability gate',relation:'Assigned to this context route, but independent of PIDS closeout; its October inspection and November appointment are retained.'}]},
 {id:'119-PLACE-011',slug:'nnsa-two-site-production',context:true,cycle:'60-CYCLE-NNSA-GAO-BASELINE',prefix:'nn-',receipts:['receipt-60-nnsa-baseline-2026-11-21-watch-note','receipt-60-nnsa-capacity-2026-11-21-watch-note','receipt-60-nnsa-rate-2026-10-28-no-material-change'],checks:[0,1,3,4,5,0,1,2,3,4,0,1],receipt_slots:[0,0,0,0,0,1,1,1,1,1,2,2],assigned_contexts:[{cycle_id:'60-CYCLE-NNSA-ACCEPTED-CAPACITY',label:'Independent accepted-capacity gate',relation:'Assigned to this context route, but independent of enterprise baseline closure, first-unit qualification and recurring output.'},{cycle_id:'60-CYCLE-NNSA-RECURRING-QUALIFIED-RATE',label:'Independent recurring-output gate',relation:'Assigned to this context route, but independent of accepted capacity and enterprise baseline closure; its October inspection is retained.'}]}
];
const flags=['human_review_claimed','independent_review_claimed','fresh_external_source_check','publication_authorized','launch_authorized','phase_216_complete'];
export function validatePlaceReadings(value,decision=review,{ledger=currentEvidenceLedger}={}){
 requireTrue(value.schema_version==='1.0'&&decision.schema_version==='1.0','schema');
 requireTrue(value.edition_id==='CANONICAL-PLACE-READINGS-2026-11-22'&&decision.review_id===value.edition_id,'edition identity');
 requireTrue(value.review_date==='2026-11-22'&&decision.review_date===value.review_date,'review date');
 requireTrue(policy.human_review_required===false&&decision.policy_id===policy.policy_id,'review authority');
 for(const key of flags)requireTrue(value[key]===false&&decision[key]===false,key);
 requireTrue(decision.operating_outcomes_admitted===false&&value.new_identity_count===0&&decision.new_identity_count===0,'admission/identity boundary');
 requireTrue(value.records.length===8&&decision.records.length===8&&value.sources.length===55&&value.retained_receipts.length===13,'coverage');
 requireTrue(JSON.stringify(decision.historical_inputs_retained.map(p=>p.path))===JSON.stringify(['src/data/phase-119-deep-project-place-atlas.json','src/data/portfolio-eligibility-decisions.json','src/data/build-review-policy.json']),'historical input coverage');
 requireTrue(new Set(value.sources.map(s=>s.id)).size===55&&new Set(value.retained_receipts.map(r=>r.receipt_id)).size===13,'duplicate evidence');
 const retainedIds=contracts.flatMap(c=>c.receipts);
 requireTrue(JSON.stringify([...value.retained_receipts.map(r=>r.receipt_id)].sort())===JSON.stringify([...retainedIds].sort()),'exact retained receipt identities');
 for(const pin of value.retained_receipts){
  const receipt=ledger.receipts.find(r=>r.receipt_id===pin.receipt_id);
  requireTrue(receipt&&placeReadingHash(receipt)===pin.sha256,'retained receipt changed '+pin.receipt_id);
 }
 for(let i=0;i<contracts.length;i++){
  const c=contracts[i],r=value.records[i],d=decision.records[i],a=atlas.places.find(p=>p.atlas_place_id===c.id),p=portfolio.canonical.find(p=>p.route===a.routes.atlas);
  requireTrue(r.record_id===c.id&&d.record_id===c.id&&r.canonical_id===a.canonical_id&&r.route===a.routes.atlas&&r.route==='/atlas/places/'+c.slug+'/','exact place/route');
  requireTrue(r.kind===(c.context?'Context':'Place')&&r.eligible_count===p.eligible_count&&r.eligible_count===(c.context?0:1)&&r.new_identity_count===0,'counted scope');
  for(const key of ['place_stage_established','project_stage_changed','operating_outcomes_admitted'])requireTrue(r[key]===false,key);
  requireTrue(r.prior_route===a.routes.prior_profile&&JSON.stringify(r.aliases)===JSON.stringify(a.aliases),'historical route/aliases');
  requireTrue(d.atlas_record_sha256===placeReadingHash(a)&&d.portfolio_decision_sha256===placeReadingHash(p),'historical identity drift');
  requireTrue(r.current_cycle_id===c.cycle&&JSON.stringify(r.receipt_ids)===JSON.stringify(c.receipts),'related gate identity');
  const relatedContexts=r.related_cycle_contexts??[];
  requireTrue(JSON.stringify(relatedContexts.map(x=>x.cycle_id))===JSON.stringify(c.additional_cycle?[c.additional_cycle]:[]),'separate related context identity');
  if(c.additional_cycle)requireTrue(a.relationships.phase_60_cycle_ids.includes(c.additional_cycle)&&relatedContexts[0].label==='Separate Starlink adoption companion'&&relatedContexts[0].relation==='Related through the retained Louisiana Atlas relationship, not an assigned place-page receipt or a new cycle decision.','companion scope');
  requireTrue(JSON.stringify(r.assigned_cycle_contexts??[])===JSON.stringify(c.assigned_contexts??[]),'independent assigned gate definitions');
  for(const definition of r.assigned_cycle_contexts??[])requireTrue(a.relationships.phase_60_cycle_ids.includes(definition.cycle_id),'assigned gate relationship');
  requireTrue(r.scope.length>80&&r.answer.length>100&&r.context_role.length>25&&r.next_artifacts.length===3,'substantive scope');
  requireTrue(r.sections.length===6&&new Set(r.sections.map(s=>s.heading)).size===6&&r.sections.every(s=>s.text.length>250&&['Scope and interpretation','Retained evidence','Interpretation'].includes(s.type)),'complete narrative');
  const sources=value.sources.filter(s=>s.id.startsWith(c.prefix)),sourceIds=sources.map(s=>s.id);
  requireTrue(JSON.stringify(sources.map(s=>s.check_index))===JSON.stringify(c.checks),'exact check selection');
  const slots=c.receipt_slots??(c.id==='119-PLACE-001'?[0,1,1,1]:c.checks.map(()=>0));
  requireTrue(JSON.stringify(sources.map(s=>s.receipt_id))===JSON.stringify(slots.map(slot=>c.receipts[slot])),'exact check receipt selection');
  const cited=new Set(r.sections.flatMap(s=>s.source_ids));requireTrue(sourceIds.every(id=>cited.has(id))&&[...cited].every(id=>sourceIds.includes(id)),'citation ownership/coverage');
  for(const s of sources){
   const receipt=ledger.receipts.find(x=>x.receipt_id===s.receipt_id);
   const assigned=[c.cycle,...(c.assigned_contexts??[]).map(d=>d.cycle_id)].includes(receipt?.cycle_item_id)&&receipt.affected_routes.includes(r.route);
   const relatedOnly=c.additional_cycle&&receipt?.cycle_item_id===c.additional_cycle&&a.relationships.phase_60_cycle_ids.includes(c.additional_cycle);
   requireTrue(c.receipts.includes(s.receipt_id)&&(assigned||relatedOnly),'source/gate ownership');
   requireTrue(placeReadingHash(s.check)===placeReadingHash(receipt.official_surface_checks[s.check_index]),'source check drift');
   requireTrue(s.check.accessed_date===receipt.source_checked_date&&s.check.accessed_date<value.review_date&&s.check.url.startsWith('https://'),'retained inspection date/URL');
  }
  const projects=a.relationships.related_project_ids.map(id=>atlas.projects.find(x=>x.atlas_project_id===id));
  requireTrue(r.related.length===(projects.length?1:0)&&r.related.every(link=>projects.some(p=>p.routes.atlas===link.route)),'separate project link');
  requireTrue(d.findings.length===3&&d.findings.every(f=>f.length>70)&&d.sha256===placeReadingHash(r),'exact assessed narrative');
 }
 const texts=value.records.map(r=>r.sections.map(s=>s.text).join(' '));
 requireTrue(texts[0].includes('1.331%')&&texts[0].includes('not a share of wastewater volume')&&texts[0].includes('built-plant label')&&texts[0].includes('blank project'),'Arizona financial/physical and acceptance boundary');
 requireTrue(texts[1].includes('40,575.5')&&texts[1].includes('230,900')&&texts[1].includes('9.76')&&texts[1].includes('165 containers shipped')&&texts[1].includes('timed out')&&texts[1].includes('no table numbers were adopted'),'Hanford measure/access boundaries');
 requireTrue(texts[2].includes('January 8, 2026')&&texts[2].includes('January 15, 2031')&&texts[2].includes('September 15 is the retrieval date')&&texts[2].includes('not fresh confirmation'),'SLF issuance/retrieval/access');
 requireTrue(texts[3].includes('November 18 announcement')&&texts[3].includes('November 17 Board')&&texts[3].includes('September 15 effective')&&texts[3].includes('returned 403')&&texts[3].includes('does not reset Golden-Mars'),'Loudoun policy/project dates');
 requireTrue(texts[4].includes('May 1 activation')&&texts[4].includes('104-location service area is in Bossier')&&texts[4].includes('planned 10,635-location scope')&&texts[4].includes('approximately 18,431 potentially eligible supplemental locations')&&texts[4].includes('must not replace')&&texts[4].includes('January 2, 2027')&&texts[4].includes('not measured results'),'Louisiana cohort/date boundary');
 requireTrue(texts[5].includes('period shipment flow')&&texts[5].includes('empty attachment is not evidence of zero construction')&&texts[5].includes('ConnectMT ARPA support')&&texts[5].includes('cannot serve as the required BEAD project-quarter return')&&texts[5].includes('no report exported')&&texts[5].includes('does not redate the thirty-two proposal dossiers'),'Montana measure/funding boundary');
 requireTrue(texts[6].includes('does not count the national network as a local place')&&texts[6].includes('93 and 117 counts must not be reconciled by assumption')&&texts[6].includes('not a new November declaration')&&texts[6].includes('keep their asset identities and outcome definitions separate')&&texts[6].includes('October 26 announcement')&&texts[6].includes('November 25 for named-asset reliability and December 21 for closeout'),'Amtrak scope/count/date boundary');
 requireTrue(texts[7].includes('contributes zero to the eligible-place target')&&texts[7].includes('GAO-23-104661 recommendation 1')&&texts[7].includes('GAO-20-703 recommendation 3')&&texts[7].includes('October 2, 2024')&&texts[7].includes('October 1, 2024')&&texts[7].includes('Only the cover and administrative cover sheet')&&texts[7].includes('No Phase 61 named file is assigned'),'NNSA context/decision boundary');
 requireTrue(placeReadingHash({...value,records:value.records.slice(0,4),sources:value.sources.slice(0,19),retained_receipts:value.retained_receipts.slice(0,5)})==='305c8da600c977bffaea5e85d6e225f2228f672a7b4e6a7329f1c5ef7f8534b0','initial four-reading edition preserved');
 requireTrue(placeReadingHash(decision.records.slice(0,4))==='8fcd8b65950cb3090f55f682087f1c8bee2780b6cc14832428b0357950809d13','initial four assessments preserved');
 requireTrue(placeReadingHash({...value,records:value.records.slice(0,6),sources:value.sources.slice(0,36),retained_receipts:value.retained_receipts.slice(0,8)})==='97babe4d65a59be9cf6c7ef750a1bb88df45ba84217d341c36946d70244bed4c','preceding six-reading edition preserved');
 requireTrue(placeReadingHash(decision.records.slice(0,6))==='de8f5b88a8d874529b4f1cecb29ed1abece33918b24694b4e1ef0a30e0fa3aed','preceding six assessments preserved');
 requireTrue(decision.edition_sha256===placeReadingHash(value),'exact edition');
 return value;
}
validatePlaceReadings(data);
// Preserve the imported JSON type for Astro consumers after runtime validation.
export const canonicalPlaceReadings=data;
export const canonicalPlaceReview=review;
export function placeReadingFor(place){
 const record=data.records.find(r=>r.record_id===place?.atlas_place_id);if(!record)return null;
 requireTrue(placeReadingHash(place)===review.records.find(r=>r.record_id===record.record_id).atlas_record_sha256,'runtime place drift');
 return record;
}
export function placeReadingForPriorRoute(route){return data.records.find(r=>r.prior_route===route)??null;}
export function placeReadingSources(record){
 requireTrue(data.records.includes(record),'unbound reading');
 const ids=new Set(record.sections.flatMap(s=>s.source_ids));return data.sources.filter(s=>ids.has(s.id));
}
// Later receipts are separate dated notices; they never rewrite the assessed narrative.
export function placeReadingContext(record,{ledger=currentEvidenceLedger}={}){
 requireTrue(data.records.includes(record),'unbound reading');
 return ledger.receipts.filter(r=>r.cycle_item_id===record.current_cycle_id&&r.affected_routes.includes(record.route)&&r.affected_record_ids.includes(record.record_id)&&r.decision_date<=ledger.as_of_date&&r.source_checked_date<=ledger.as_of_date)
  .sort((a,b)=>a.decision_date.localeCompare(b.decision_date)).at(-1)??null;
}
// A declared related companion is not an assigned receipt for this place route.
/** @returns {Array<{label: string, relation: string, receipt: (typeof currentEvidenceLedger.receipts)[number]}>} */
export function placeReadingRelatedContexts(record,{ledger=currentEvidenceLedger}={}){
 requireTrue(data.records.includes(record),'unbound reading');
 return (record.related_cycle_contexts??[]).flatMap(definition=>{
  const receipt=ledger.receipts.filter(r=>r.cycle_item_id===definition.cycle_id&&r.decision_date<=ledger.as_of_date&&r.source_checked_date<=ledger.as_of_date).sort((a,b)=>a.decision_date.localeCompare(b.decision_date)).at(-1);
  return receipt?[{label:definition.label,relation:definition.relation,receipt}]:[];
 });
}
// Independent gates assigned to one context never collapse into a shared decision/date.
/** @returns {Array<{label: string, relation: string, receipt: (typeof currentEvidenceLedger.receipts)[number]}>} */
export function placeReadingAssignedGateContexts(record,{ledger=currentEvidenceLedger}={}){
 requireTrue(data.records.includes(record),'unbound reading');
 return (record.assigned_cycle_contexts??[]).flatMap(definition=>{
  const receipt=ledger.receipts.filter(r=>r.cycle_item_id===definition.cycle_id&&r.affected_routes.includes(record.route)&&r.affected_record_ids.includes(record.record_id)&&r.decision_date<=ledger.as_of_date&&r.source_checked_date<=ledger.as_of_date).sort((a,b)=>a.decision_date.localeCompare(b.decision_date)).at(-1);
  return receipt?[{label:definition.label,relation:definition.relation,receipt}]:[];
 });
}
