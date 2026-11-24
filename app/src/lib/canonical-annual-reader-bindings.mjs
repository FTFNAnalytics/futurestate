import {createHash} from 'node:crypto';
import data from '../data/canonical-annual-reader-bindings.json' with {type:'json'};
import initial from '../data/canonical-annual-reader-bindings-initial-2026-11-22.json' with {type:'json'};
import atlas from '../data/phase-119-deep-project-place-atlas.json' with {type:'json'};
import portfolio from '../data/portfolio-eligibility-decisions.json' with {type:'json'};
import readers from '../data/phase-204-reader-completion.json' with {type:'json'};
import {annualAiPresentation,annualAiReviewFor,annualAssessedReading} from './annual-ai-reviews.mjs';
import {annualReviewDate} from './annual-case-reviews.mjs';
import {currentEvidenceLedger} from './current-evidence.mjs';
export const canonicalAnnualHash=value=>createHash('sha256').update(JSON.stringify(value)).digest('hex');
const requireTrue=(test,message)=>{if(!test)throw Error('Canonical annual binding: '+message);};
const mappings=[
 ['119-PROJECT-003','203-CASE-03','northern-virginia-large-load',1,'60-CYCLE-LOUDOUN-STANDARDS','Related policy only','61-PROJECT-NOVA-LARGE-LOAD'],
 ['119-PROJECT-004','203-CASE-04','space-coast-authority-to-mission',0,'60-CYCLE-SPACE-COAST-SLF-LICENCE','Independent site-licence follow-up','61-PROJECT-SPACE-COAST-AUTHORITY'],
 ['119-PROJECT-021','203-CASE-21','amtrak-accessible-stations',1,null,'Independent program evidence gates',null],
 ['119-PROJECT-023','203-CASE-23','montana-bead-completed-quarter',0,null,'Independent program evidence gates',null],
 ['119-PROJECT-024','203-CASE-24','nnsa-qualified-production',1,null,'Independent program evidence gates',null],
];
export function validateCanonicalAnnualBindings(value,{atlasRegistry=atlas,portfolioRegistry=portfolio,readerRegistry=readers,ledger=currentEvidenceLedger}={}){
 requireTrue(value.schema_version==='1.0'&&value.review_id==='CANONICAL-ANNUAL-READERS-2026-11-22'&&value.integration_date==='2026-11-22'&&value.policy_id==='OWNER-AUTHORIZED-AI-REVIEW-2026-09-25','policy/date');
 for(const key of ['human_review_claimed','fresh_external_source_check','operating_outcomes_admitted','publication_authorized','launch_authorized','phase_216_complete'])requireTrue(value[key]===false,key);
 requireTrue(value.new_identity_count===0&&value.reviewer===data.reviewer&&value.boundary===data.boundary,'integration scope');
 requireTrue(canonicalAnnualHash(value.historical_inputs_retained)===canonicalAnnualHash(data.historical_inputs_retained),'historical pins');
 requireTrue(value.revision===2&&canonicalAnnualHash(value.prior_revision)===canonicalAnnualHash(data.prior_revision),'revision');
 requireTrue(canonicalAnnualHash(value.records?.slice(0,2))===canonicalAnnualHash(initial.records),'initial decisions changed');
 requireTrue(value.records?.length===mappings.length,'coverage');
 for(const [atlasId,articleId,slug,count,cycle,role,fileId] of mappings){
  const matches=value.records.filter(r=>r.atlas_record_id===atlasId);requireTrue(matches.length===1,'duplicate/missing identity');
  const r=matches[0],project=atlasRegistry.projects.find(p=>p.atlas_project_id===atlasId),decision=portfolioRegistry.canonical.find(p=>p.record_id==='casebook-'+slug),article=readerRegistry.records.find(a=>a.record_id===articleId);
  requireTrue(project&&decision&&article,'missing input');
  requireTrue(r.binding_id==='CANONICAL-ANNUAL-'+atlasId&&r.canonical_id===project.canonical_id&&r.canonical_id===decision.record_id&&r.article_record_id===articleId,'identity');
  requireTrue(r.target_route==='/atlas/projects/'+slug+'/'&&r.target_route===project.routes.atlas&&r.target_route===decision.route&&r.prior_casebook_route===project.routes.prior_casebook,'target route');
  requireTrue(r.article_route==='/reference/state-of-future-systems/case-'+slug+'/'&&r.article_route!==r.target_route,'original route');
  requireTrue(r.eligible_count===count&&decision.eligible_count===count&&r.scope===decision.scope,'counted identity boundary');
  const isProgram=role==='Independent program evidence gates';
  requireTrue(r.context_cycle_id===(isProgram?undefined:cycle)&&r.context_role===role&&r.named_file_id===fileId,'context scope');
  requireTrue(r.article_sha256===canonicalAnnualHash(article)&&r.atlas_record_sha256===canonicalAnnualHash(project)&&r.portfolio_decision_sha256===canonicalAnnualHash(decision),'input hash');
  const ai=annualAiReviewFor(article,{route:r.article_route}),view=annualAiPresentation(article,{route:r.article_route});
  requireTrue(ai&&r.article_review_sha256===canonicalAnnualHash(ai.decision)&&r.correction_review_sha256===canonicalAnnualHash(view.review),'review binding');
  requireTrue(r.presentation_sha256===canonicalAnnualHash(annualAssessedReading(article,view))&&r.article_title===view.title,'assessed presentation');
  requireTrue(r.original_review_date===ai.decision.review_date&&r.original_review_date==='2026-09-27','assessment date');
  if(isProgram)requireTrue(view.review===null&&r.correction_review_date===null&&r.prior_review_absent===true,'absent prior review');
  else requireTrue(r.correction_review_date===annualReviewDate(view.review)&&r.correction_review_date==='2026-09-22'&&r.prior_review_absent===undefined,'clarification date');
  requireTrue(r.section_count===3&&view.sections.length===3&&r.paragraph_count===3&&view.sections.reduce((n,s)=>n+s.paragraphs.length,0)===3,'complete narrative');
  const original=data.records.find(x=>x.binding_id===r.binding_id);
  for(const key of ['identity_boundary','current_status_boundary','decision'])requireTrue(r[key]===original[key],'editorial boundary');
  if(isProgram){
   requireTrue(project.relationships.phase_61_file_ids.length===0,'program is not a Phase 61 named file');
   requireTrue(canonicalAnnualHash(r.evidence_gates?.map(g=>g.cycle_id))===canonicalAnnualHash(project.relationships.phase_60_cycle_ids),'independent gate coverage');
   requireTrue(canonicalAnnualHash(r.evidence_gates)===canonicalAnnualHash(original.evidence_gates)&&canonicalAnnualHash(r.related_readings)===canonicalAnnualHash(original.related_readings),'program context mapping');
   for(const gate of r.evidence_gates){
    const receipt=ledger.receipts.find(x=>x.receipt_id===gate.retained_receipt_id);
    requireTrue(receipt&&canonicalAnnualHash(receipt)===gate.retained_receipt_sha256&&receipt.cycle_item_id===gate.cycle_id&&receipt.affected_routes.includes(r.target_route)&&receipt.affected_record_ids.includes(atlasId)&&receipt.named_file_ids.length===0,'retained program receipt');
    requireTrue(gate.inspected_date===receipt.source_checked_date&&gate.recorded_next_check===receipt.next_check_date&&receipt.source_checked_date<=value.integration_date&&receipt.decision_date<=value.integration_date,'retained receipt dates');
   }
  }
 }
 return value;
}
validateCanonicalAnnualBindings(data);
export const canonicalAnnualBindings=data;
export function canonicalAnnualForProject(project){
 const binding=data.records.find(r=>r.atlas_record_id===project?.atlas_project_id);
 if(!binding)return null;
 requireTrue(canonicalAnnualHash(project)===binding.atlas_record_sha256,'runtime Atlas drift');
 return {binding,article:readers.records.find(a=>a.record_id===binding.article_record_id)};
}
// Approval stays exact to the original annual route. This explicit second-route
// mapping is the only entry point for embedding that already assessed reading.
export function canonicalAnnualForArticle(article,{route}={}){
 const binding=data.records.find(r=>r.article_record_id===article?.record_id&&r.target_route===route);
 if(!binding)return null;
 requireTrue(canonicalAnnualHash(article)===binding.article_sha256,'runtime article drift');
 const view=annualAiPresentation(article,{route:binding.article_route});
 requireTrue(canonicalAnnualHash(annualAssessedReading(article,view))===binding.presentation_sha256,'runtime presentation drift');
 return binding;
}
export function canonicalAnnualContext(binding,{ledger=currentEvidenceLedger}={}){
 requireTrue(data.records.includes(binding),'unbound context');
 if(!binding.context_cycle_id)return null;
 return ledger.receipts.filter(r=>r.cycle_item_id===binding.context_cycle_id&&r.named_file_ids.includes(binding.named_file_id)&&r.decision_date<=ledger.as_of_date&&r.source_checked_date<=ledger.as_of_date)
  .sort((a,b)=>a.decision_date.localeCompare(b.decision_date)).at(-1)??null;
}
/** @returns {Array<{cycle_id:string,label:string,retained_receipt_id:string,retained_receipt_sha256:string,inspected_date:string,recorded_next_check:string,receipt:(typeof currentEvidenceLedger.receipts)[number]|null}>} */
export function canonicalAnnualGateContexts(binding,{ledger=currentEvidenceLedger}={}){
 requireTrue(data.records.includes(binding),'unbound program context');
 return (binding.evidence_gates??[]).map(gate=>({...gate,receipt:ledger.receipts.filter(r=>r.cycle_item_id===gate.cycle_id&&r.affected_routes.includes(binding.target_route)&&r.affected_record_ids.includes(binding.atlas_record_id)&&r.named_file_ids.length===0&&r.decision_date<=ledger.as_of_date&&r.source_checked_date<=ledger.as_of_date)
  .sort((a,b)=>a.decision_date.localeCompare(b.decision_date)).at(-1)??null}));
}
/** @returns {Array<{route:string,label:string}>} */
export const canonicalAnnualRelatedReadings=binding=>binding.related_readings??[];
