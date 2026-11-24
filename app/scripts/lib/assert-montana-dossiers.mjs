import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
const hash=v=>createHash('sha256').update(JSON.stringify(v)).digest('hex');
export function assertMontanaDossiers(dossiers,baseline,reconciliation,initialIds){
 assert.equal(dossiers.records.length,32);assert.equal(new Set(dossiers.records.map(r=>r.route)).size,32);
 assert.deepEqual(dossiers.records.map(r=>r.record_id).sort(),baseline.projects.map(r=>r.project_id).sort());
 assert.deepEqual(dossiers.records.slice(0,5).map(r=>r.record_id),initialIds);
 assert.equal(hash(dossiers.records.slice(0,5)),'2359424b053785e19762982e5af12d529ee6bd41f783a73e437eee7e2f19863d','Initial five dossier records must remain exact');
 assert.equal(dossiers.completion.initial_batch_sha256,hash(dossiers.records.slice(0,5)));
 assert.deepEqual(dossiers.completion.initial_batch_ids,initialIds);assert.deepEqual(dossiers.completion.new_dossier_ids,dossiers.records.slice(5).map(r=>r.record_id));
 assert.equal(dossiers.completion.completed_proposal_dossiers,32);assert.equal(dossiers.completion.operating_outcomes_admitted,0);
 assert.equal(dossiers.completion.human_review_claimed,false);assert.equal(dossiers.completion.source_retrieval_performed,false);
 assert.equal(dossiers.deployment_source.sha256,reconciliation.source_sha256);
 assert.equal(dossiers.reporting_contexts.length,32);assert.equal(new Set(dossiers.reporting_contexts.map(r=>r.record_id)).size,32);
 for(const d of dossiers.records){
  const p=baseline.projects.find(p=>p.project_id===d.record_id),s=reconciliation.records.find(s=>s.project_id===d.record_id),g=baseline.subgrantees.find(g=>g.subgrantee_id===p.subgrantee_id),context=dossiers.reporting_contexts.find(r=>r.record_id===d.record_id);
  const {sha256,...payload}=d;assert.equal(sha256,hash(payload));
  assert.equal(d.source_identity.project_record_sha256,hash(p));assert.equal(d.source_identity.reconciliation_record_sha256,hash(s));assert.equal(d.source_identity.subgrantee_record_sha256,hash(g));
  assert.equal(d.source_identity.project_id,d.record_id);assert.equal(d.source_identity.uei,p.uei);assert.equal(d.source_identity.legal_name,g.legal_name);assert.equal(d.source_identity.csv_row,s.csv_row);assert.equal(d.source_name,s.name);assert.equal(d.source_identity.source_sha256,reconciliation.source_sha256);
  for(const key of ['bead_support_usd','subgrantee_match_usd','raw_technology_codes','intersects_tribal_land'])assert.deepEqual(d.proposal[key],p[key]);
  assert.equal(d.proposal.broadband_serviceable_location_rows,p.bsl_count);assert.equal(d.proposal.community_anchor_institution_rows,p.cai_count);assert.equal(d.proposal.tribal_consent_field,p.tribal_consent_name);
  for(const key of ['estimated_subaward_date','estimated_performance_start','estimated_performance_end'])assert.equal(d.proposal[key],s[key]);
  assert.deepEqual(d.operating_observations,[]);assert.equal(p.outcome_state,null);
  assert.equal(d.sections.length,3);assert(d.sections.every(s=>s.text.length>200));assert.equal(new Set(d.sections.map(s=>s.heading)).size,3);
  assert(d.next_artifacts[0].includes(d.record_id));assert(d.next_artifacts[1].includes(d.record_id));
  for(const id of d.related_project_ids)assert(dossiers.records.some(r=>r.record_id===id&&r.source_identity.uei===d.source_identity.uei));
  assert.equal(context.reporting_contract,p.reporting_contract);assert.equal(context.raw_deployment_project_type,s.project_type);
  assert.equal(context.cohort_kind,p.bsl_count===0&&p.cai_count>0?'Anchor institutions only':p.cai_count>0?'Separate location and anchor-institution cohorts':'Location cohort');
  if(p.reporting_contract.startsWith('LEO'))assert(d.next_artifacts[1].includes('LEO quarterly'));
  else assert(d.next_artifacts[1].includes('terrestrial quarterly'));
 }
 assert.equal(dossiers.reporting_contexts.filter(r=>r.reporting_contract.startsWith('LEO')).length,2);
 const anchor=dossiers.records.find(r=>r.record_id==='CM61-BEAD-MT-4678');assert.equal(anchor.proposal.broadband_serviceable_location_rows,0);assert.equal(anchor.proposal.community_anchor_institution_rows,21);assert.deepEqual(anchor.proposal.raw_technology_codes,[]);
 assert.deepEqual(dossiers.distinct_entity_comparisons.map(r=>r.project_ids),[['CM61-BEAD-MT-4218','CM61-BEAD-MT-4206']]);
 for(const c of dossiers.distinct_entity_comparisons)assert.equal(new Set(c.project_ids.map(id=>dossiers.records.find(r=>r.record_id===id).source_identity.uei)).size,c.project_ids.length);
}
