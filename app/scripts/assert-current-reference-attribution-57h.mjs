import assert from 'node:assert/strict';
import {readFile,readdir} from 'node:fs/promises';
import {createHash} from 'node:crypto';
import {fileURLToPath} from 'node:url';
import {join} from 'node:path';
import pins from './content-205-216/reference-attribution-57h-inputs.json' with {type:'json'};
import ledger from '../src/data/phase-206-reference-attribution.json' with {type:'json'};
import signals from '../src/data/phase-206-editorial-classification.json' with {type:'json'};
import {signalReviews57h} from './content-205-216/reference-attribution-57h-reviews.mjs';
import {appendDatedSignalClassifications} from './lib/append-dated-signal-classifications.mjs';
import {verifyClassifiedInput} from './lib/classification-review.mjs';
import {createSignalProjection} from '../src/lib/signal-classification.mjs';
import {serializePublicSignal} from '../src/lib/public-data.ts';
import {readShelfInputs} from './lib/read-shelf-inputs.mjs';
import {createShelfData} from '../src/lib/shelf-data.mjs';
import {searchShelf} from '../src/lib/shelf-search.mjs';
const root=fileURLToPath(new URL('../',import.meta.url)),read=p=>readFile(join(root,p),'utf8');
const hash=s=>createHash('sha256').update(s).digest('hex'),json=async p=>JSON.parse(await read(p));
const count=(rows,key)=>rows.reduce((o,r)=>(o[r[key]]=(o[r[key]]??0)+1,o),{}),unique=(rows,key,n)=>{assert.equal(rows.length,n);assert.equal(new Set(rows.map(r=>r[key])).size,n);};
assert.equal(pins.previous_reference_count,778);assert.equal(pins.previous_signal_count,761);
assert.equal(hash(JSON.stringify(ledger.records.slice(0,778))),pins.previous_records_hash);
assert.equal(hash(JSON.stringify(signals.records.slice(0,761))),pins.previous_signal_records_hash);
assert.equal(pins.prior_input_pins.length,52);assert.equal(pins.supporting_registry_pins.length,8);
for(const p of [...pins.prior_input_pins,...pins.supporting_registry_pins,...pins.prior_signal_input_pins])assert.equal(hash(await read(p.path)),p.sha256,'Historical input changed: '+p.path);
assert.equal(hash(await read('src/content/research-collections/'+pins.collection_slug+'.json')),pins.collection_sha256);
assert.equal(hash(await readFile(join(root,'public'+pins.archive_path))),pins.archive_sha256);
const registry=await json('src/data/phase-57h-registry-revision-provenance-compatible-observation-joins.json');
assert.equal(registry.records.length,29);assert.deepEqual(registry.post_batch_closure_counts,{closed:1,partially_closed:21,open:2});
for(const k of ['exact_target_artifacts_acquired','exact_target_trigger_events','public_agency_contacts_or_foia_requests'])assert.equal(registry[k],0);
for(const k of ['directive_scope_changes','implementation_changes','closure_changes','inherited_entity_ledger_closure_changes'])assert.deepEqual(registry[k],[]);
const a=await json('src/data/phase-57h-amtrak-station-alias-revision-matrix.json');
unique(a.current_station_rows,'current_display_name',16);unique(a.historical_revision_rows,'historical_station_id',178);
assert.equal(a.source_versions.length,2);assert.equal(a.current_station_rows.reduce((s,r)=>s+r.current_cohorts.length,0),19);
assert.equal(a.current_station_rows.filter(r=>r.current_cohorts.includes('substantial_completion')).length,11);
assert.equal(a.current_station_rows.filter(r=>r.current_cohorts.includes('final_completion')).length,8);
assert.deepEqual(a.current_station_rows.filter(r=>r.current_cohorts.length===2).map(r=>r.current_display_name),['Camden','Detroit Lakes','Fort Morgan']);
assert.equal(a.current_station_rows.filter(r=>r.match_method==='exact_display_name').length,10);
assert.equal(a.current_station_rows.filter(r=>r.match_method==='controlled_alias_rule_mount_to_mt').length,1);
assert.deepEqual(a.unresolved_current_names,['Du Quoin','Granby','Hamlet','Pomona','Rocklin']);
assert.equal(a.historical_revision_rows.filter(r=>r.revision_state==='not_observed_in_june_2026_completion_cohorts').length,167);
for(const r of a.historical_revision_rows){assert.equal(r.removal_state,'not_assessed');assert.equal(r.outcome_state,null);}
const m=await json('src/data/phase-57h-montana-field-provenance-version-matrix.json');
unique(m.field_dictionary,'field',13);unique(m.project_versions,'project_id',32);assert.equal(new Set(m.project_versions.map(r=>r.subgrantee_id)).size,19);
assert.deepEqual(count(m.field_dictionary,'authority'),{'Official CSV field':5,'FTFN derived field':1,'FTFN aggregate':2,'Official raw code':1,'FTFN normalized field':2,'FTFN routing decision':1,'FTFN reserved field':1});
assert.deepEqual(count(m.project_versions,'reporting_rail'),{LEO:2,terrestrial:30});assert.deepEqual(m.technology_code_values,['50','61','70','71','72']);
for(const r of m.project_versions){assert.equal(r.compatible_future_observation_key,r.project_id+'|reporting-period|field-definition-version');for(const k of ['current_completed_project_quarter','current_service_state','current_adoption_state','current_acceptance_state'])assert.equal(r[k],null);}
const h=await json('src/data/phase-57h-hanford-authority-observation-compatibility-matrix.json');
unique(h.observations,'event_id',9);unique(h.authority_rows,'source_id',9);unique(h.transitions,'transition_id',14);unique(h.observation_pairs,'pair_id',36);
assert.equal(new Set(h.transitions.flatMap(r=>[r.from_stage_id,r.to_stage_id])).size,14);
assert.deepEqual(h.compatibility_counts,{milestone_and_quantity_not_directly_comparable:21,same_unit_different_stage_not_directly_comparable:9,incompatible_measure_or_unit:5,same_stage_unit_but_terms_or_operators_require_alignment:1});
assert.deepEqual(count(h.observations,'operator'),{milestone:3,'>':2,'=':3,approximately:1});
const byObservation=new Map(h.observations.map(r=>[r.event_id,r])),pairs=new Set();
for(const r of h.observation_pairs){const a=byObservation.get(r.left_event_id),b=byObservation.get(r.right_event_id);assert(a&&b&&a!==b);pairs.add([a.event_id,b.event_id].sort().join('|'));
 const sameStage=a.stage_id===b.stage_id,sameUnit=a.unit===b.unit&&a.unit!==null;
 let label='incompatible_measure_or_unit';if(sameStage&&sameUnit&&a.measure===b.measure&&a.operator===b.operator)label='potentially_comparable_requires_same_cohort_period_and_method';else if(sameStage&&sameUnit)label='same_stage_unit_but_terms_or_operators_require_alignment';else if(sameUnit)label='same_unit_different_stage_not_directly_comparable';else if(a.unit===null||b.unit===null)label='milestone_and_quantity_not_directly_comparable';
 assert.equal(r.same_stage,sameStage);assert.equal(r.same_unit,sameUnit);assert.equal(r.compatibility,label);assert.equal(r.direct_numeric_join_allowed,false);
}
assert.equal(pairs.size,36);assert.equal(h.nonconversion_rules.length,4);
for(const r of h.transitions){assert.equal(r.stable_public_batch_join,false);assert.equal(r.stable_public_container_join,false);}
assert.equal(h.authority_rows.find(r=>r.source_id==='source-57f-hanford-wtp-pmm-february-2026').can_establish_regulator_acceptance,'no');
assert.equal(h.authority_rows.find(r=>r.source_id==='source-57b-hanford-wtp-project-managers-may-2026').can_establish_regulator_acceptance,'only_when_explicitly_stated');
const n=await json('src/data/phase-57h-nnsa-fy26-fy27-gao-change-history.json');
unique(n.object_history,'registry_id',18);unique(n.source_versions,'version_id',4);unique(n.change_events,'change_id',10);
assert.equal(n.object_history.flatMap(r=>Object.values(r.versions)).length,72);
const lap4=n.object_history.filter(r=>r.registry_id.startsWith('NNSA-LANL-LAP4')),srs=n.object_history.filter(r=>r.registry_id==='NNSA-SRS-MOX'||r.registry_id.startsWith('NNSA-SRS-SRPPF')),rec=n.object_history.find(r=>r.registry_id==='NNSA-GAO-23-104661-REC1');
assert.equal(lap4.length,7);assert.equal(srs.length,4);
for(const r of [...lap4,...srs]){assert.equal(Object.values(r.versions).filter(v=>v==='not_used_for_this_object_state').length,1);assert.equal(r.versions['GAO-23-104661-REC1'],'not_used_for_this_object_state');}
assert.deepEqual(rec.versions,{'FY2026-CJ':'not_used_for_this_object_state','FY2027-CJ':'not_used_for_this_object_state','GAO-26-107625':'not_used_for_this_object_state','GAO-23-104661-REC1':'independent_recommendation_status_joined'});
assert(Object.values(n.object_history.find(r=>r.registry_id==='NNSA-W87-1-FPU').versions).every(v=>v==='not_used_for_this_object_state'));
assert.deepEqual(n.change_events.filter(r=>!n.source_versions.some(v=>v.version_id===r.to_version)).map(r=>r.to_version),['2024-10-01-FPU','CURRENT-PLAN']);
for(const r of n.change_events)assert.equal(r.operating_outcome,null);
const profile=await json('src/content/sources/source-56x-gao-nnsa-major-projects-2026.json');
assert(profile.url.endsWith('/gao-26-107777.pdf'));assert(profile.name.includes('GAO-26-107777'));assert(n.source_versions.some(r=>r.version_id==='GAO-26-107625'&&r.source_id===profile.id));
const generator=await read('scripts/generate-phase57h-content.mjs');
assert(generator.includes('direct_numeric_join_allowed: false'));assert(generator.includes('nonconversion_rules: hanford57g.nonconversion_rules'));assert(generator.includes('candidates.length === 1 ? candidates[0] : null'));
const docs=ledger.records.filter(r=>r.id.startsWith('research-doc-57h-'));assert.equal(docs.length,29);assert.equal(docs.filter(r=>r.content_type==='FTFN analysis').length,14);assert.equal(docs.filter(r=>r.content_type==='FTFN method/test note').length,6);assert.equal(docs.filter(r=>r.content_type==='Research docket').length,9);
for(const r of docs){
 const p=pins.docs.find(p=>p.id===r.id),d=await json(`src/content/${r.source_file}`),original=registry.records.find(x=>x.document_id===r.id),h=p.historical_decision;
 assert.deepEqual(h,Object.fromEntries(Object.keys(h).map(k=>[k,original[k]])));assert.equal(hash(await read(`src/content/${r.source_file}`)),p.reviewed_source_sha256);assert.equal(hash(await read('public'+d.local_capture_path)),p.download_sha256);
 assert.equal(d.publication_date,p.publication_date);assert.equal(d.publication_date,h.publication_date);assert.equal(d.captured_date,'2026-08-03');assert.equal(r.review_date,'2026-09-15');assert.equal(d.record_status,h.record_status);assert.equal(r.inherited_publisher_label,d.publisher);assert.equal(r.correction.publisher,'FTFN');assert(r.correction.title.startsWith('FTFN historical '));assert(r.correction.summary.includes('August 3, 2026'));
 assert(r.correction.key_findings.includes(`Historical next action, not performed by this correction: ${h.next_action}`));assert(r.correction.evidence_limits.some(s=>s.includes('not present-day external conditions')));
 if(r.content_type==='Research docket'){assert.equal(d.record_status,'In Review');assert.equal(r.prior.document_type,'Technical Report');assert(r.correction.key_findings.includes(`Historical reopening request (August 3): ${h.next_action}`));assert(r.correction.key_findings.includes(`Historical hold lineage: ${h.parent_hold_key} → ${h.action_key}.`));}else{assert.equal(d.record_status,'Published');assert.equal(r.prior.document_type,'Data Release');}
 if(!['nnsa-lap4-versioned-scope-cost-matrix','nnsa-gao-independent-baseline-provenance'].some(s=>r.id.endsWith(s)))assert(r.correction.key_findings.includes(`Historical denominator: ${h.denominator}`));else assert(r.correction.key_findings.some(s=>s.startsWith('Corrected historical denominator: ')));
}
assert(docs.some(r=>pins.docs.find(p=>p.id===r.id).publication_date!=='2026-08-03'));
const input=await readShelfInputs(root),before=JSON.stringify(input),shelves=createShelfData(input,signals).shelves,projection=createSignalProjection(signals.records);assert.equal(JSON.stringify(input),before);
assert.deepEqual(signalReviews57h.map(r=>r.source_file).sort(),(await readdir(join(root,'src/content/signals'))).filter(f=>/^signal-57h-/.test(f)).sort());assert.equal(signals.records.filter(r=>r.id.startsWith('signal-57h-')).length,29);assert.equal(signals.records.slice(0,790).filter(r=>r.correction).length,789);assert.equal(signals.remaining_individual_reviews,0);
for(const review of signalReviews57h){
 const r=signals.records.find(r=>r.id===review.id),doc=docs.find(d=>d.related_signal_id===r.id),p=pins.docs.find(p=>p.signal_file===r.source_file),raw=await read(`src/content/signals/${r.source_file}`);
 verifyClassifiedInput({id:r.id,body:raw,excerpt:review.excerpt,expectedHash:p.signal_sha256});assert.equal(r.source_sha256,p.signal_sha256);assert.equal(r.reviewed_source_sha256,p.signal_sha256);assert.equal(r.content_type,doc.content_type);assert.equal(r.correction.title,doc.correction.title);assert.equal(r.correction.summary,doc.correction.summary);assert.equal(r.classification_review_date,'2026-09-15');assert.equal(r.current_feed_eligible,false);assert.equal(r.prior.evidence_quality,'Official Data');
 const original={data:{...input.signals.find(s=>s.id===r.id),...r.prior,published_date:'2026-08-03'}},snapshot=JSON.stringify(original),current=projection.project(original);assert.equal(JSON.stringify(original),snapshot);assert.equal(projection.eligible(current),false);for(const[k,v]of Object.entries(r.correction))assert.equal(current.data[k],v);for(const k of ['id','slug','source_ids','record_status','captured_date','published_date','last_reviewed_date'])assert.deepEqual(current.data[k],original.data[k]);
 const exported=serializePublicSignal({data:{...original.data,captured_date:new Date(original.data.captured_date),published_date:new Date(original.data.published_date),last_reviewed_date:new Date(original.data.last_reviewed_date)}});for(const[k,v]of Object.entries(r.correction))assert.equal(exported[k],v);assert.equal(exported.published_date,'2026-08-03');assert.equal(exported.last_reviewed_date,'2026-08-03');
 const card=shelves.classification.find(s=>s.id===r.id);assert.equal(card.title,r.correction.title);assert.deepEqual(card.filters.type,[r.content_type]);assert(searchShelf(shelves.classification,{q:r.correction.title,type:r.content_type}).some(s=>s.id===r.id));for(const[kind,rows]of Object.entries(shelves))if(kind==='signals'||kind.startsWith('topic-')||kind.startsWith('local-'))assert(!rows.some(s=>s.id===r.id));
 assert.throws(()=>verifyClassifiedInput({id:r.id,body:raw+'\nUnreviewed claim',expectedHash:p.signal_sha256}),/individual re-review required/);
}
const previous=signals.records.slice(0,761),snapshot=JSON.stringify(previous),args={root,previous,pins,reviews:signalReviews57h,screeningBasis:'Complete Phase 57H linked-signal review following confirmed research-document attribution and claim defects',reviewScope:pins.review_scope};assert.deepEqual(await appendDatedSignalClassifications(args),signals.records.slice(0,790));assert.equal(JSON.stringify(previous),snapshot);
await assert.rejects(()=>appendDatedSignalClassifications({...args,previous:previous.slice(1)}),/Earlier signal classifications changed/);await assert.rejects(()=>appendDatedSignalClassifications({...args,pins:{...pins,review_date:'2026-08-02'}}),/cannot predate/);
const update=await json('src/content/updates/2026-09-15-57h-individual-classifications.json');assert.deepEqual([...update.affected_record_ids].sort(),signalReviews57h.map(r=>r.id).sort());assert.equal(update.effective_date,'2026-09-15');for(const r of signalReviews57h)assert(update.related_paths.includes(`/signals/${r.id.slice(7)}/`));
const briefing=ledger.records.find(r=>r.id===`briefing-${pins.briefing_slug}`);assert(briefing.correction.top_takeaways.some(s=>s.includes('do not guarantee non-reidentifiability')));assert(briefing.correction.top_takeaways.some(s=>s.includes('both budget cells and the project-assessment cell are unused')));
const correction=suffix=>docs.find(r=>r.id.endsWith(suffix)).correction;
assert(!correction('montana-privacy-classification-matrix').key_findings.some(s=>s.includes('Aggregate counts cannot be reversed')));
assert(!correction('hanford-nonconversion-rejection-contract').key_findings.some(s=>s.includes('as compatibility gates rather than narrative cautions')));
assert(correction('nnsa-gao-independent-baseline-provenance').key_findings.some(s=>s.includes('GAO-26-107777')));
const evidence=await read('src/data/phase-60-current-decisions.json');if(JSON.parse(evidence).as_of_date==='2026-09-15')assert.equal(hash(evidence),pins.current_evidence_hash);
console.log('57H passed: 29 documents, Watch 038 and 29 linked signals; fourteen analyses / six controls / nine dockets. Privacy, pair-logic and source-join overclaims corrected; report-ID mismatch explicit; earlier 778 reference reviews, 761 signal decisions, archive and actual receipts retained. No external refresh or approval.');
