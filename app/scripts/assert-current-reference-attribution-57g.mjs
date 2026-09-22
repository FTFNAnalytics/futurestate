import assert from 'node:assert/strict';
import {readFile,readdir} from 'node:fs/promises';
import {createHash} from 'node:crypto';
import {fileURLToPath} from 'node:url';
import {join} from 'node:path';
import pins from './content-205-216/reference-attribution-57g-inputs.json' with {type:'json'};
import ledger from '../src/data/phase-206-reference-attribution.json' with {type:'json'};
import signals from '../src/data/phase-206-editorial-classification.json' with {type:'json'};
import {signalReviews57g} from './content-205-216/reference-attribution-57g-reviews.mjs';
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
assert.equal(pins.previous_reference_count,808);assert.equal(pins.previous_signal_count,790);
assert.equal(hash(JSON.stringify(ledger.records.slice(0,808))),pins.previous_records_hash);
assert.equal(hash(JSON.stringify(signals.records.slice(0,790))),pins.previous_signal_records_hash);
assert.equal(pins.prior_input_pins.length,56);assert.equal(pins.supporting_registry_pins.length,8);
for(const p of [...pins.prior_input_pins,...pins.supporting_registry_pins,...pins.prior_signal_input_pins])assert.equal(hash(await read(p.path)),p.sha256,'Historical input changed: '+p.path);
assert.equal(hash(await read('src/content/research-collections/'+pins.collection_slug+'.json')),pins.collection_sha256);
assert.equal(hash(await readFile(join(root,'public'+pins.archive_path))),pins.archive_sha256);
const registry=await json('src/data/phase-57g-named-asset-project-cohort-registry-expansion.json');
assert.equal(registry.records.length,29);assert.deepEqual(registry.post_batch_closure_counts,{closed:1,partially_closed:21,open:2});
for(const k of ['exact_target_artifacts_acquired','exact_target_trigger_events','public_agency_contacts_or_foia_requests'])assert.equal(registry[k],0);
for(const k of ['directive_scope_changes','implementation_changes','closure_changes','inherited_entity_ledger_closure_changes'])assert.deepEqual(registry[k],[]);
const next=await json('src/data/phase-57h-registry-revision-provenance-compatible-observation-joins.json');
for(const r of registry.records.filter(r=>r.record_status==='In Review')){const descendant=next.records.find(x=>x.parent_hold_key===r.action_key);assert(descendant);for(const k of ['title','finding','denominator','evidence_limits','next_action','publication_date','supporting_source_ids','official_url'])assert.deepEqual(r[k],descendant[k]);}
const a=await json('src/data/phase-57g-amtrak-named-station-registry.json');
unique(a.membership_rows,'membership_id',197);unique(a.stations,'station_id',178);
assert.deepEqual(count(a.membership_rows,'cohort'),{'train-access':30,pids:120,amenity:47});
const slug=s=>s.toLowerCase().normalize('NFKD').replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'');
for(const r of a.membership_rows){assert.equal(r.station_id,'AMTRAK-STATION-'+r.state+'-'+slug(r.source_display_name));assert.equal(r.historical_snapshot_date,'2023-04-30');assert.equal(r.outcome_state,null);}
for(const r of a.stations)assert.deepEqual(r.cohorts,a.membership_rows.filter(x=>x.station_id===r.station_id).map(x=>x.membership_id));
assert.deepEqual(count(a.membership_rows.filter(r=>r.cohort==='pids'),'delivery_status'),{Complete:96,'In Progress':18,Pending:3,Cancelled:1,'On Hold':2});
assert.deepEqual(count(a.membership_rows.filter(r=>r.cohort==='train-access'),'delivery_status'),{Complete:18,'In Progress':2,Pending:10});
assert.deepEqual(a.membership_rows.filter(r=>r.cohort==='pids'&&['On Hold','Cancelled'].includes(r.delivery_status)).map(r=>[r.source_display_name,r.delivery_status]),[['Hanford','Cancelled'],['Detroit','On Hold'],['Atlanta','On Hold']]);
for(const r of a.membership_rows.filter(r=>r.cohort==='amenity')){assert.equal(r.delivery_status,'Complete');assert(/^FY\d\d$/.test(r.projected_delivery_completion));assert(Number(r.projected_delivery_completion.slice(2))<=19);}
const m=await json('src/data/phase-57g-montana-project-cohort-registry.json');
unique(m.subgrantees,'uei',19);unique(m.projects,'project_id',32);
for(const r of m.projects){assert(m.subgrantees.some(s=>s.uei===r.uei&&s.subgrantee_id===r.subgrantee_id));assert.equal(r.outcome_state,null);}
const sum=k=>m.projects.reduce((s,r)=>s+r[k],0);
assert.equal(sum('bsl_count'),68315);assert.equal(sum('cai_count'),183);assert.equal(sum('bead_support_usd'),303686528);assert.equal(sum('subgrantee_match_usd'),145190798);
assert.deepEqual(m.raw_location_classification_counts,{'0':45401,'1':22914});assert.deepEqual(m.raw_location_technology_counts,{'50':14199,'61':43662,'70':684,'71':8983,'72':787});
assert.equal(Object.values(m.raw_location_classification_counts).reduce((a,b)=>a+b),68315);assert.equal(Object.values(m.raw_location_technology_counts).reduce((a,b)=>a+b),68315);
const onlyCai=m.projects.filter(r=>r.bsl_count===0);assert.equal(onlyCai.length,1);assert.equal(onlyCai[0].project_id,'CM61-BEAD-MT-4678');assert.equal(onlyCai[0].cai_count,21);
assert.deepEqual(m.projects.filter(r=>r.reporting_contract.startsWith('LEO')).map(r=>r.uei),['PX3CHN4WCPG3','C6M7C2FLKER5']);assert.equal(m.projects.filter(r=>r.reporting_contract.startsWith('Terrestrial')).length,30);
const h=await json('src/data/phase-57g-hanford-batch-container-stage-registry.json');
unique(h.stages,'stage_id',14);unique(h.observations,'event_id',9);assert.equal(h.identity_schema.length,15);assert.deepEqual(h.public_identity_availability,{batch_ids:0,container_ids:0});assert.equal(h.nonconversion_rules.length,4);
assert.equal(h.observations.filter(r=>r.observation_date).length,5);assert.equal(h.observations.filter(r=>!r.observation_date&&r.observation_period).length,4);
assert.deepEqual(count(h.observations,'operator'),{milestone:3,'>':2,'=':3,approximately:1});
assert.deepEqual(h.stages.filter(r=>r.input_stage_id&&!h.stages.some(s=>s.stage_id===r.input_stage_id)).map(r=>r.input_stage_id),['HANFORD-LAW-MELTER-1/2']);
assert.equal(h.stages.filter(r=>r.stage_id.startsWith('HANFORD-LAW-MELTER-')).length,2);
assert.deepEqual(h.stages.slice(8).map(r=>r.stage_id),['HANFORD-LAW-CONTAINER-FILL','HANFORD-LAW-CONTAINER-HANDLING','HANFORD-LAW-EXPORT-BAY','HANFORD-IDF-TRANSPORT','HANFORD-IDF-STAGING','HANFORD-IDF-DISPOSAL']);
for(const r of h.stages){assert.equal(r.stable_public_batch_id_available,false);assert.equal(r.stable_public_container_id_available,false);}
for(const r of h.observations){assert(!Object.hasOwn(r,'public_batch_id'));assert(!Object.hasOwn(r,'public_container_id'));assert(h.stages.some(s=>s.stage_id===r.stage_id));}
const n=await json('src/data/phase-57g-nnsa-work-breakdown-registry.json');unique(n.entries,'registry_id',18);
for(const r of n.entries){assert.equal(r.operating_outcome,null);assert(!r.parent_id||n.entries.some(p=>p.registry_id===r.parent_id));}
const children=n.entries.filter(r=>r.parent_id==='NNSA-LANL-LAP4');assert.equal(children.length,6);assert.equal(children.filter(r=>r.object_type==='Subproject').length,5);assert.equal(children.find(r=>r.object_type==='Scope strategy').registry_id,'NNSA-LANL-LAP4-30D');
assert.equal(n.entries.filter(r=>r.registry_id==='NNSA-SRS'||r.registry_id==='NNSA-SRS-MOX'||r.registry_id.startsWith('NNSA-SRS-SRPPF')).length,5);
assert.equal(n.entries.find(r=>r.registry_id==='NNSA-GAO-23-104661-REC1').parent_id,'NNSA-PIT-MISSION');
const generator=await read('scripts/generate-phase57g-content.mjs');assert(generator.includes('raw_location_classification_counts: { "0": 45401, "1": 22914 }'));assert(generator.includes('const leoUeis = new Set(["PX3CHN4WCPG3", "C6M7C2FLKER5"])'));
const docs=ledger.records.filter(r=>r.id.startsWith('research-doc-57g-'));assert.equal(docs.length,29);assert.equal(docs.filter(r=>r.content_type==='FTFN analysis').length,19);assert.equal(docs.filter(r=>r.content_type==='FTFN method/test note').length,1);assert.equal(docs.filter(r=>r.content_type==='Research docket').length,9);
for(const r of docs){
 const p=pins.docs.find(p=>p.id===r.id),d=await json(`src/content/${r.source_file}`),original=registry.records.find(x=>x.document_id===r.id),h=p.historical_decision;
 assert.deepEqual(h,Object.fromEntries(Object.keys(h).map(k=>[k,original[k]])));assert.equal(hash(await read(`src/content/${r.source_file}`)),p.reviewed_source_sha256);assert.equal(hash(await read('public'+d.local_capture_path)),p.download_sha256);
 assert.equal(d.publication_date,p.publication_date);assert.equal(d.publication_date,h.publication_date);assert.equal(d.captured_date,'2026-08-03');assert.equal(r.review_date,'2026-09-15');assert.equal(d.record_status,h.record_status);assert.equal(r.inherited_publisher_label,d.publisher);assert.equal(r.correction.publisher,'FTFN');assert(r.correction.title.startsWith('FTFN historical '));assert(r.correction.summary.includes('August 3, 2026'));
 assert(r.correction.key_findings.includes(`Historical next action, not performed by this correction: ${h.next_action}`));assert(r.correction.evidence_limits.some(s=>s.includes('not present-day external conditions')));
 if(r.content_type==='Research docket'){assert.equal(d.record_status,'In Review');assert.equal(r.prior.document_type,'Technical Report');assert(r.correction.key_findings.includes(`Historical reopening request (August 3): ${h.next_action}`));assert(r.correction.key_findings.includes(`Historical hold lineage: ${h.parent_hold_key} → ${h.action_key}.`));}else{assert.equal(d.record_status,'Published');assert.equal(r.prior.document_type,'Data Release');}
 if(!r.id.endsWith('hanford-melter-container-handling-registry'))assert(r.correction.key_findings.includes(`Historical denominator: ${h.denominator}`));else assert(r.correction.key_findings.some(s=>s.startsWith('Corrected historical denominator: ')));
}
assert(docs.some(r=>pins.docs.find(p=>p.id===r.id).publication_date!=='2026-08-03'));
const input=await readShelfInputs(root),before=JSON.stringify(input),shelves=createShelfData(input,signals).shelves,projection=createSignalProjection(signals.records);assert.equal(JSON.stringify(input),before);
assert.deepEqual(signalReviews57g.map(r=>r.source_file).sort(),(await readdir(join(root,'src/content/signals'))).filter(f=>/^signal-57g-/.test(f)).sort());assert.equal(signals.records.slice(0,819).length,819);assert.equal(signals.records.slice(0,819).filter(r=>r.correction).length,818);assert.equal(signals.remaining_individual_reviews,0);
for(const review of signalReviews57g){
 const r=signals.records.find(r=>r.id===review.id),doc=docs.find(d=>d.related_signal_id===r.id),p=pins.docs.find(p=>p.signal_file===r.source_file),raw=await read(`src/content/signals/${r.source_file}`);
 verifyClassifiedInput({id:r.id,body:raw,excerpt:review.excerpt,expectedHash:p.signal_sha256});assert.equal(r.source_sha256,p.signal_sha256);assert.equal(r.reviewed_source_sha256,p.signal_sha256);assert.equal(r.content_type,doc.content_type);assert.equal(r.correction.title,doc.correction.title);assert.equal(r.correction.summary,doc.correction.summary);assert.equal(r.classification_review_date,'2026-09-15');assert.equal(r.current_feed_eligible,false);assert.equal(r.prior.evidence_quality,'Official Data');
 const original={data:{...input.signals.find(s=>s.id===r.id),...r.prior,published_date:'2026-08-03'}},snapshot=JSON.stringify(original),current=projection.project(original);assert.equal(JSON.stringify(original),snapshot);assert.equal(projection.eligible(current),false);for(const[k,v]of Object.entries(r.correction))assert.equal(current.data[k],v);for(const k of ['id','slug','source_ids','record_status','captured_date','published_date','last_reviewed_date'])assert.deepEqual(current.data[k],original.data[k]);
 const exported=serializePublicSignal({data:{...original.data,captured_date:new Date(original.data.captured_date),published_date:new Date(original.data.published_date),last_reviewed_date:new Date(original.data.last_reviewed_date)}});for(const[k,v]of Object.entries(r.correction))assert.equal(exported[k],v);assert.equal(exported.published_date,'2026-08-03');assert.equal(exported.last_reviewed_date,'2026-08-03');
 const card=shelves.classification.find(s=>s.id===r.id);assert.equal(card.title,r.correction.title);assert.deepEqual(card.filters.type,[r.content_type]);assert(searchShelf(shelves.classification,{q:r.correction.title,type:r.content_type}).some(s=>s.id===r.id));for(const[kind,rows]of Object.entries(shelves))if(kind==='signals'||kind.startsWith('topic-')||kind.startsWith('local-'))assert(!rows.some(s=>s.id===r.id));
 assert.throws(()=>verifyClassifiedInput({id:r.id,body:raw+'\nUnreviewed claim',expectedHash:p.signal_sha256}),/individual re-review required/);
}
const previous=signals.records.slice(0,790),snapshot=JSON.stringify(previous),args={root,previous,pins,reviews:signalReviews57g,screeningBasis:'Complete Phase 57G linked-signal review following confirmed research-document attribution and claim defects',reviewScope:pins.review_scope};assert.deepEqual(await appendDatedSignalClassifications(args),signals.records.slice(0,819));assert.equal(JSON.stringify(previous),snapshot);
await assert.rejects(()=>appendDatedSignalClassifications({...args,previous:previous.slice(1)}),/Earlier signal classifications changed/);await assert.rejects(()=>appendDatedSignalClassifications({...args,pins:{...pins,review_date:'2026-08-02'}}),/cannot predate/);
const update=await json('src/content/updates/2026-09-15-57g-individual-classifications.json');assert.deepEqual([...update.affected_record_ids].sort(),signalReviews57g.map(r=>r.id).sort());assert.equal(update.effective_date,'2026-09-15');for(const r of signalReviews57g)assert(update.related_paths.includes(`/signals/${r.id.slice(7)}/`));
const correction=suffix=>docs.find(r=>r.id.endsWith(suffix)).correction;
assert(correction('montana-68315-bsl-project-denominator').key_findings.some(s=>s.includes('does not itself parse or re-reconcile individual source rows')));
assert(correction('hanford-fourteen-stage-dflaw-registry').summary.includes('not a registered stage ID'));
assert(correction('hanford-null-identity-and-nonconversion-contract').key_findings.some(s=>s.includes('do not contain populated or explicit-null')));
const briefing=ledger.records.find(r=>r.id==='briefing-'+pins.briefing_slug);assert(briefing.correction.top_takeaways.some(s=>s.includes('six downstream registry nodes')));
const evidence=await read('src/data/phase-60-current-decisions.json');if(JSON.parse(evidence).as_of_date==='2026-09-15')assert.equal(hash(evidence),pins.current_evidence_hash);
console.log('57G passed: 29 documents, Watch 037 and 29 linked signals; nineteen analyses / one control / nine dockets. Embedded-aggregate boundaries, distinct denominators, unresolved process key and schema/identity distinctions verified; earlier 808 reference reviews, 790 signal decisions, original archive and actual receipts unchanged.');
