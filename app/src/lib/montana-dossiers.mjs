import registry from '../data/montana-project-dossiers.json' with {type:'json'};
import {evidenceReceiptsForRecord} from './current-evidence.mjs';
export const montanaDossiers=registry;
/** Additive program context; never rewrite a source-pinned proposal or its dates. */
export function montanaDossierEvidenceContext(asOfDate){
  return registry.records.map(record=>({record_id:record.record_id,route:record.route,
    context_scope:'Related program reporting review only; not a project inspection or operating-outcome admission',
    dated_review_receipts:evidenceReceiptsForRecord(record.record_id,asOfDate)}));
}
/** Reporting labels come from the retained project designation, never by decoding raw L/C. */
export function montanaContextFor(record, data=registry){
  const rows=data.reporting_contexts.filter(r=>r.record_id===record.record_id);
  if(rows.length!==1)throw Error(`Missing or duplicate Montana reporting context: ${record.record_id}`);
  return rows[0];
}
/** Exact UEI equality identifies operator siblings, not duplicate projects. */
export function montanaConnections(record, data=registry){
  const same_operator=data.records.filter(r=>r.record_id!==record.record_id&&r.source_identity.uei===record.source_identity.uei);
  const distinct_entity=data.distinct_entity_comparisons.filter(c=>c.project_ids.includes(record.record_id)).flatMap(c=>c.project_ids.filter(id=>id!==record.record_id).map(id=>{
    const target=data.records.find(r=>r.record_id===id);
    if(!target||target.source_identity.uei===record.source_identity.uei)throw Error(`Invalid distinct-entity comparison: ${record.record_id}/${id}`);
    return {record:target,relation:c.relation};
  }));
  return {same_operator,distinct_entity};
}
