import assert from 'node:assert/strict';
import {readFile,readdir} from 'node:fs/promises';
import {createHash} from 'node:crypto';
import {fileURLToPath} from 'node:url';
import {join} from 'node:path';
import pins from './content-205-216/reference-attribution-57k-inputs.json' with {type:'json'};
import ledger from '../src/data/phase-206-reference-attribution.json' with {type:'json'};
import signals from '../src/data/phase-206-editorial-classification.json' with {type:'json'};
import {signalReviews57k} from './content-205-216/reference-attribution-57k-reviews.mjs';
import {appendDatedSignalClassifications} from './lib/append-dated-signal-classifications.mjs';
import {verifyClassifiedInput} from './lib/classification-review.mjs';
import {createSignalProjection} from '../src/lib/signal-classification.mjs';
import {serializePublicSignal} from '../src/lib/public-data.ts';
import {readShelfInputs} from './lib/read-shelf-inputs.mjs';
import {createShelfData} from '../src/lib/shelf-data.mjs';
import {searchShelf} from '../src/lib/shelf-search.mjs';
const root=fileURLToPath(new URL('../',import.meta.url)),read=p=>readFile(join(root,p),'utf8');
const hash=s=>createHash('sha256').update(s).digest('hex'),json=async p=>JSON.parse(await read(p));
const counts=(rows,key)=>rows.reduce((out,r)=>(out[r[key]]=(out[r[key]]??0)+1,out),{});
const unique=(rows,key,n)=>{assert.equal(rows.length,n);assert.equal(new Set(rows.map(r=>r[key])).size,n);};
assert.equal(pins.previous_reference_count,688);assert.equal(pins.previous_signal_count,674);
assert.equal(hash(JSON.stringify(ledger.records.slice(0,688))),pins.previous_records_hash);
assert.equal(hash(JSON.stringify(signals.records.slice(0,674))),pins.previous_signal_records_hash);
assert.equal(pins.prior_input_pins.length,40);assert.equal(pins.supporting_registry_pins.length,7);
for(const p of [...pins.prior_input_pins,...pins.supporting_registry_pins,...pins.prior_signal_input_pins])assert.equal(hash(await read(p.path)),p.sha256,`Pinned historical input changed: ${p.path}`);
assert.equal(hash(await read(`src/content/research-collections/${pins.collection_slug}.json`)),pins.collection_sha256);
const docs=ledger.records.filter(r=>r.id.startsWith('research-doc-57k-'));assert.equal(docs.length,29);assert.equal(docs.filter(r=>r.content_type==='FTFN analysis').length,20);assert.equal(docs.filter(r=>r.content_type==='Research docket').length,9);
const registry=await json('src/data/phase-57k-cross-version-transition-matrices-longitudinal-panels-reopening-trigger-registry.json'),contracts=await json('src/data/phase-57k-reopening-trigger-registry.json');
assert.deepEqual(registry.post_batch_closure_counts,{closed:1,partially_closed:21,open:2});
for(const key of ['exact_target_artifacts_acquired','exact_target_trigger_events','public_agency_contacts_or_foia_requests'])assert.equal(registry[key],0);
for(const key of ['directive_scope_changes','implementation_changes','closure_changes','inherited_entity_ledger_closure_changes'])assert.deepEqual(registry[key],[]);
assert.equal(contracts.contracts.length,9);assert.equal(contracts.contracts.reduce((n,c)=>n+c.required_field_count,0),60);
assert.deepEqual(contracts.contracts.map(c=>c.required_field_count),[5,7,6,6,7,12,6,6,5]);
for(const c of contracts.contracts){assert.equal(c.required_fields.length,c.required_field_count);assert.equal(c.trigger_state,'not_fired');assert.equal(c.evidence_received,false);assert.equal(c.automated_publication_allowed,false);assert.equal(c.publication_state,'remains_in_review');}
const a=await json('src/data/phase-57k-amtrak-identity-snapshot-longitudinal-matrix.json');
unique(a.presence_matrix,'cell_id',356);unique(a.longitudinal_transitions,'transition_id',178);assert.equal(new Set(a.presence_matrix.map(r=>r.historical_station_id)).size,178);
assert.deepEqual(counts(a.presence_matrix,'snapshot_state'),{present_in_source_snapshot:178,not_observed_in_bounded_cohort_no_deletion_inference:167,bounded_cohort_observation_linked:11});assert.deepEqual(counts(a.longitudinal_transitions,'transition_classification'),a.transition_classification_counts);
assert.deepEqual(a.unresolved_identity_queue.map(r=>r.current_display_name),['Du Quoin','Granby','Hamlet','Pomona','Rocklin']);
for(const r of a.presence_matrix){assert.equal(r.structural_change,'not_asserted');assert.equal(r.operating_outcome,null);}for(const r of a.longitudinal_transitions){assert.equal(r.observed_structural_event,false);assert.equal(r.operating_outcome,null);}for(const r of a.unresolved_identity_queue){assert.equal(r.official_station_code,null);assert.equal(r.historical_station_id,null);}
const m=await json('src/data/phase-57k-montana-project-field-compatibility-matrix.json');
unique(m.compatibility_matrix,'cell_id',416);unique(m.project_envelope_requirement_checks,'check_id',224);assert.equal(new Set(m.compatibility_matrix.map(r=>r.project_id)).size,32);assert.equal(new Set(m.compatibility_matrix.map(r=>r.source_field)).size,13);
assert.deepEqual(counts(m.compatibility_matrix,'compatibility_state'),{blocked_missing_compatible_official_target_schema:352,blocked_missing_official_code_dictionary:32,blocked_missing_validated_completed_project_quarter:32});
assert.equal(new Set(m.compatibility_matrix.filter(r=>r.reporting_rail==='LEO').map(r=>r.project_id)).size,2);assert.equal(new Set(m.compatibility_matrix.filter(r=>r.reporting_rail!=='LEO').map(r=>r.project_id)).size,30);
for(const r of m.compatibility_matrix){assert.equal(r.target_field,null);assert.equal(r.accepted_value,null);assert.equal(r.migration_allowed,false);assert.equal(r.operating_outcome,null);}for(const r of m.project_envelope_requirement_checks){assert.equal(r.state,'unmet');assert.equal(r.source_value,null);assert.equal(r.accepted_observation,null);}
const h=await json('src/data/phase-57k-hanford-observation-transition-applicability-matrix.json');
unique(h.observation_transition_applicability_matrix,'cell_id',126);unique(h.transition_requirement_checks,'check_id',70);
assert.equal(new Set(h.observation_transition_applicability_matrix.map(r=>r.observation_id)).size,9);assert.equal(new Set(h.observation_transition_applicability_matrix.map(r=>r.transition_id)).size,14);
assert.deepEqual(counts(h.observation_transition_applicability_matrix,'applicability_state'),{stage_not_applicable:106,to_stage_candidate_requires_identity_and_custody:12,from_stage_candidate_requires_identity_and_custody:8});
for(const r of h.observation_transition_applicability_matrix){assert.equal(r.join_eligible,false);assert.equal(r.accepted_custody_link,false);assert.equal(r.operating_outcome,null);}for(const r of h.transition_requirement_checks){assert.equal(r.state,'unmet');assert.equal(r.evidence_value,null);assert.equal(r.custody_transfer_accepted,false);}
const n=await json('src/data/phase-57k-nnsa-object-transition-dimension-matrix.json');
assert.deepEqual(n.source_version_order,['FY2026-CJ','FY2027-CJ','GAO-26-107625','GAO-23-104661-REC1']);unique(n.object_transitions,'transition_id',54);unique(n.transition_dimension_matrix,'cell_id',648);unique(n.retained_bounded_diff_queue,'queue_id',10);
assert.equal(new Set(n.object_transitions.map(r=>r.registry_id)).size,18);assert.equal(n.classification_dimensions.length,12);
assert.deepEqual(counts(n.transition_dimension_matrix,'transition_classification'),{bounded_dimension_state_unchanged:288,authority_boundary_change_requires_review:216,bounded_dimension_state_change_requires_exact_extraction:24,source_scope_change_requires_review:120});
assert.equal(n.object_transitions.filter(r=>r.from_authority!==r.to_authority).length,18);
for(const r of n.object_transitions){assert.equal(r.dimension_count,12);assert.equal(r.promoted_operating_outcome,null);assert.equal(r.implementation_change,false);assert.equal(r.closure_change,false);assert.equal(n.transition_dimension_matrix.filter(c=>c.transition_id===r.transition_id).length,12);}
for(const r of [...n.transition_dimension_matrix,...n.retained_bounded_diff_queue]){assert.equal(r.operating_outcome,null);assert.equal(r.implementation_change,false);assert.equal(r.closure_change,false);}
assert(n.retained_bounded_diff_queue.find(r=>r.queue_id==='NNSA-DIFF-08').bounded_change.includes('not a recurring site-period rate'));assert(n.retained_bounded_diff_queue.find(r=>r.queue_id==='NNSA-DIFF-09').bounded_change.includes('not measured output'));
for(const r of docs){
 const pin=pins.docs.find(p=>p.id===r.id),d=await json(`src/content/${r.source_file}`),historical=registry.records.find(x=>x.document_id===r.id),c=pin.reopening_contract;
 assert.deepEqual(pin.historical_decision,historical);assert.equal(hash(await read(`src/content/${r.source_file}`)),pin.reviewed_source_sha256);assert.equal(hash(await read('public'+d.local_capture_path)),pin.download_sha256);
 assert.equal(d.captured_date,'2026-08-03');assert.equal(d.publication_date,'2026-08-03');assert.equal(r.review_date,'2026-09-15');assert.equal(d.record_status,c?'In Review':'Published');assert.equal(r.prior.document_type,c?'Technical Report':'Data Release');assert.equal(r.inherited_publisher_label,d.publisher);assert.equal(r.correction.publisher,'FTFN');assert(r.correction.title.startsWith('FTFN historical '));assert(r.correction.summary.includes('August 3, 2026'));
 assert(r.correction.key_findings.includes(`Historical denominator: ${historical.denominator}`));assert(r.correction.key_findings.includes(`Historical next action, not performed by this correction: ${historical.next_action}`));
 assert(r.correction.evidence_limits.some(s=>s.includes('not synthetic test results')));assert(r.correction.evidence_limits.some(s=>s.includes('not present-day external conditions')));
 if(c){assert.deepEqual(c,contracts.contracts.find(x=>x.contract_id===c.contract_id));assert.equal(c.reopening_trigger,historical.next_action);assert(r.correction.key_findings.includes(`Historical reopening request (August 3): ${c.reopening_trigger}`));assert(r.correction.key_findings.some(s=>s.includes(c.required_fields.join(', '))));}
}
const input=await readShelfInputs(root),before=JSON.stringify(input),shelves=createShelfData(input,signals).shelves,projection=createSignalProjection(signals.records);assert.equal(JSON.stringify(input),before);
const signalFiles=(await readdir(join(root,'src/content/signals'))).filter(f=>/^signal-57k-/.test(f)).sort();assert.deepEqual(signalReviews57k.map(r=>r.source_file).sort(),signalFiles);
assert.equal(signals.records.filter(r=>r.id.startsWith('signal-57k-')).length,29);assert.equal(signals.records.slice(0,703).filter(r=>r.correction).length,702);assert.equal(signals.remaining_individual_reviews,0);
for(const review of signalReviews57k){
 const r=signals.records.find(r=>r.id===review.id),doc=docs.find(d=>d.related_signal_id===r.id),pin=pins.docs.find(p=>p.signal_file===r.source_file),raw=await read(`src/content/signals/${r.source_file}`);
 verifyClassifiedInput({id:r.id,body:raw,excerpt:review.excerpt,expectedHash:pin.signal_sha256});assert.equal(r.source_sha256,pin.signal_sha256);assert.equal(r.reviewed_source_sha256,pin.signal_sha256);assert.equal(r.content_type,doc.content_type);assert.equal(r.correction.title,doc.correction.title);assert.equal(r.correction.summary,doc.correction.summary);assert.equal(r.classification_review_date,'2026-09-15');assert.equal(r.current_feed_eligible,false);assert.equal(r.prior.evidence_quality,'Official Data');assert.equal(r.prior.verification_status,'Verified Against Primary Source');
 const original={data:{...input.signals.find(s=>s.id===r.id),...r.prior,published_date:'2026-08-03'}},snapshot=JSON.stringify(original),current=projection.project(original);assert.equal(JSON.stringify(original),snapshot);assert.equal(projection.eligible(current),false);
 for(const[k,v]of Object.entries(r.correction))assert.equal(current.data[k],v);for(const k of ['id','slug','source_ids','record_status','captured_date','published_date','last_reviewed_date'])assert.deepEqual(current.data[k],original.data[k]);
 const exported=serializePublicSignal({data:{...original.data,captured_date:new Date(original.data.captured_date),published_date:new Date(original.data.published_date),last_reviewed_date:new Date(original.data.last_reviewed_date)}});for(const[k,v]of Object.entries(r.correction))assert.equal(exported[k],v);assert.equal(exported.published_date,'2026-08-03');assert.equal(exported.last_reviewed_date,'2026-08-03');
 const card=shelves.classification.find(s=>s.id===r.id);assert.equal(card.title,r.correction.title);assert.deepEqual(card.filters.type,[r.content_type]);assert(searchShelf(shelves.classification,{q:r.correction.title,type:r.content_type}).some(s=>s.id===r.id));
 for(const[kind,rows]of Object.entries(shelves))if(kind==='signals'||kind.startsWith('topic-')||kind.startsWith('local-'))assert(!rows.some(s=>s.id===r.id));
 assert.throws(()=>verifyClassifiedInput({id:r.id,body:raw+'\nNew unchecked claim',expectedHash:pin.signal_sha256}),/individual re-review required/);
}
const previous=signals.records.slice(0,674),previousText=JSON.stringify(previous),args={root,previous,pins,reviews:signalReviews57k,screeningBasis:'Complete Phase 57K linked-signal review following confirmed research-document attribution defects',reviewScope:pins.review_scope};
assert.deepEqual(await appendDatedSignalClassifications(args),signals.records.slice(0,703));assert.equal(JSON.stringify(previous),previousText);
await assert.rejects(()=>appendDatedSignalClassifications({...args,previous:previous.slice(1)}),/Earlier signal classifications changed/);
await assert.rejects(()=>appendDatedSignalClassifications({...args,pins:{...pins,review_date:'2026-08-02'}}),/cannot predate/);
await assert.rejects(()=>appendDatedSignalClassifications({...args,reviews:signalReviews57k.map((r,i)=>i?r:{...r,type:'External observation'})}),/non-internal/);
const update=await json('src/content/updates/2026-09-15-57k-individual-classifications.json');assert.deepEqual([...update.affected_record_ids].sort(),signalReviews57k.map(r=>r.id).sort());assert.equal(update.effective_date,'2026-09-15');for(const r of signalReviews57k)assert(update.related_paths.includes(`/signals/${r.id.slice(7)}/`));
const briefing=ledger.records.find(r=>r.id===`briefing-${pins.briefing_slug}`);assert(briefing.correction.top_takeaways.some(s=>s.includes('not add twenty independent datasets')));assert.equal(briefing.review_date,'2026-09-15');
const evidence=await read('src/data/phase-60-current-decisions.json');if(JSON.parse(evidence).as_of_date==='2026-09-15')assert.equal(hash(evidence),pins.current_evidence_hash);
console.log('57K passed: 29 documents, Watch 041 and 29 linked signals; twenty historical analyses / nine dockets. Earlier 688 reference reviews, 674 signal decisions, original sources/dates/downloads and later receipts unchanged. Matrix counts and exact nine contracts remain historical, non-additive and distinct from external events, synthetic tests or approvals.');
