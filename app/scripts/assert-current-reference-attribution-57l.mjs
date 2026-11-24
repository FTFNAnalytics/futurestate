import assert from 'node:assert/strict';
import {readFile,readdir} from 'node:fs/promises';
import {createHash} from 'node:crypto';
import {fileURLToPath} from 'node:url';
import {join} from 'node:path';
import pins from './content-205-216/reference-attribution-57l-inputs.json' with {type:'json'};
import ledger from '../src/data/phase-206-reference-attribution.json' with {type:'json'};
import signals from '../src/data/phase-206-editorial-classification.json' with {type:'json'};
import {signalReviews57l} from './content-205-216/reference-attribution-57l-reviews.mjs';
import {append57lClassifications} from './lib/classification-57l.mjs';
import {verifyClassifiedInput} from './lib/classification-review.mjs';
import {createSignalProjection} from '../src/lib/signal-classification.mjs';
import {serializePublicSignal} from '../src/lib/public-data.ts';
import {readShelfInputs} from './lib/read-shelf-inputs.mjs';
import {createShelfData} from '../src/lib/shelf-data.mjs';
import {searchShelf} from '../src/lib/shelf-search.mjs';
const root=fileURLToPath(new URL('../',import.meta.url)),read=p=>readFile(join(root,p),'utf8');
const hash=s=>createHash('sha256').update(s).digest('hex'),json=async p=>JSON.parse(await read(p));
assert.equal(hash(JSON.stringify(ledger.records.slice(0,633))),pins.previous_records_hash,'Earlier reference reviews changed');
assert.equal(hash(JSON.stringify(signals.records.slice(0,621))),pins.previous_signal_records_hash,'Earlier signal reviews changed');
assert.equal(pins.prior_input_pins.length,32);assert.equal(pins.supporting_definition_pins.length,3);
for(const pin of [...pins.prior_input_pins,...pins.supporting_definition_pins,pins.prior_signal_input_pin])assert.equal(hash(await read(pin.path)),pin.sha256,`Pinned input changed: ${pin.path}`);
assert.equal(hash(await read(`src/content/research-collections/${pins.collection_slug}.json`)),pins.collection_sha256);
const documents=ledger.records.filter(r=>r.id.startsWith('research-doc-57l-'));
assert.equal(documents.length,29);
for(const[type,n]of [['FTFN analysis',8],['FTFN method/test note',12],['Research docket',9]])assert.equal(documents.filter(r=>r.content_type===type).length,n);
const matrix=await json('src/data/phase-57l-contract-field-coverage-matrix.json');
const queue=await json('src/data/phase-57l-first-eligible-record-intake-queue.json');
const playbooks=await json('src/data/phase-57l-exception-resolution-playbooks.json');
assert.deepEqual(matrix.coverage_state_counts,{absent:28,incompatible:5,period_mismatched:6,present:15,privacy_gated:3,authority_mismatched:2,not_yet_evaluated:1});
assert.equal(matrix.fields.length,60);assert.equal(matrix.contracts.length,9);assert.equal(matrix.fully_covered_contracts,0);
assert(matrix.fields.every(f=>f.candidate_value===null&&!f.value_publication_allowed&&!f.partial_match_can_fire_trigger&&f.human_review_required));
assert.equal(queue.queues.length,9);assert.equal(queue.eligible_records_accepted,0);assert.equal(queue.triggers_fired,0);
assert.equal(playbooks.playbooks.length,9);assert.equal(playbooks.field_action_count,60);assert.equal(playbooks.automated_closure_actions,0);
for(const c of matrix.contracts){
 const fields=matrix.fields.filter(f=>f.contract_id===c.contract_id),q=queue.queues.find(q=>q.contract_id===c.contract_id),p=playbooks.playbooks.find(p=>p.contract_id===c.contract_id);
 assert.equal(fields.length,c.required_field_count);assert.deepEqual([...q.required_fields].sort(),fields.map(f=>f.field_name).sort());assert.equal(p.actions.length,fields.length);
 assert.equal(fields.filter(f=>f.coverage_state==='present').length,c.present_field_count);assert.equal(c.blocking_field_count,fields.length-c.present_field_count);assert.equal(c.trigger_state,'not_fired');assert.equal(c.complete_contract_coverage,false);
 assert.equal(q.present_field_count,c.present_field_count);assert.equal(q.blocking_field_count,c.blocking_field_count);assert.equal(q.candidate_record_state,'no_complete_eligible_record_accepted');assert.equal(q.automated_publication_allowed,false);
 for(const a of p.actions){const f=fields.find(f=>f.field_name===a.field_name);assert.equal(a.current_coverage_state,f.coverage_state);assert.equal(a.evidence_needed,q.candidate_record_type);assert(a.human_review_required&&!a.close_field_automatically&&!a.carry_value_from_other_record);}
 const docket=documents.find(d=>d.id===`research-doc-57l-preserved-${c.contract_id.slice(7).toLowerCase()}`);assert(docket);
 assert(docket.correction.summary.includes(`${c.present_field_count} of ${c.required_field_count} fields present and ${c.blocking_field_count} blocked`));
 assert(docket.correction.key_findings.includes(`Historical reopening request (August 8): ${q.candidate_record_type}.`));
}
for(const[cohort,label,fields,present,contracts]of [['amtrak','Amtrak',12,1,2],['broadband','Broadband',19,6,3],['hanford','Hanford',12,3,1],['nnsa','NNSA',17,5,3]]){
 const rows=documents.filter(r=>r.id.startsWith(`research-doc-57l-${cohort}-`));assert.equal(rows.length,5);
 assert.equal(matrix.fields.filter(f=>f.evidence_rail===label).length,fields);assert.equal(matrix.fields.filter(f=>f.evidence_rail===label&&f.coverage_state==='present').length,present);assert.equal(queue.queues.filter(q=>q.evidence_rail===label).length,contracts);
 for(const suffix of [`${fields}-contract-fields-classified`,'coverage-state-distribution'])assert.equal(rows.find(r=>r.id.endsWith(suffix)).content_type,'FTFN analysis');
 assert(rows.find(r=>r.id.endsWith('coverage-state-distribution')).correction.summary.includes(`${present} present and ${fields-present} blocking assessments`));
}
for(const r of documents){
 const d=await json(`src/content/${r.source_file}`);assert.equal(d.publication_date,'2026-08-08');assert.equal(d.captured_date,'2026-08-08');assert.equal(r.review_date,'2026-09-15');assert.match(r.correction.summary,/August 8/);assert.equal(r.inherited_publisher_label,d.publisher);
 const expected=[`Title: ${d.title}`,`Publisher: ${d.publisher}`,`Publication date: ${d.publication_date}`,`Official URL: ${d.official_url}`,`Capture status: ${d.capture_status}`,`Record status: ${d.record_status}`,`Captured by FTFN: ${d.captured_date}`,'',`Boundary: ${d.evidence_limits.join(' ')}`,'','Supporting public artifacts:',...d.supporting_official_urls.map(u=>'- '+u)].join('\n');
 assert.equal((await read('public'+d.local_capture_path)).replace(/^\uFEFF/,'').replace(/\r\n/g,'\n').trimEnd(),expected);
 assert.equal(d.record_status,r.content_type==='Research docket'?'In Review':'Published');assert.equal(d.document_type,r.content_type==='Research docket'?'Technical Report':'Data Release');
 assert(r.correction.key_findings.some(s=>s.includes('not agency declarations or synthetic test results')));assert(r.correction.evidence_limits.some(s=>s.includes('not revalidate')));
}
const input=await readShelfInputs(root),snapshot=JSON.stringify(input),shelves=createShelfData(input,signals).shelves,projection=createSignalProjection(signals.records);
assert.equal(JSON.stringify(input),snapshot);
const files=(await readdir(join(root,'src/content/signals'))).filter(f=>/^signal-57l-/.test(f));
assert.deepEqual(signalReviews57l.map(r=>r.source_file).sort(),files.sort());
assert.equal(signals.records.filter(r=>r.id.startsWith('signal-57l-')).length,29);assert.equal(signals.as_of_date,'2026-09-15');assert.equal(signals.records.slice(0,650).length,650);assert.equal(signals.records.slice(0,650).filter(r=>r.correction).length,649);
for(const review of signalReviews57l){
 const r=signals.records.find(r=>r.id===review.id),pin=pins.docs.find(p=>p.signal_file===review.source_file),doc=documents.find(d=>d.related_signal_id===r.id),raw=await read(`src/content/signals/${r.source_file}`);
 verifyClassifiedInput({id:r.id,body:raw,excerpt:review.excerpt,expectedHash:pin.signal_sha256});
 assert.equal(r.source_sha256,pin.signal_sha256);assert.equal(r.reviewed_source_sha256,pin.signal_sha256);assert.equal(r.classification_review_date,'2026-09-15');assert.equal(r.action_date,'2026-09-15');assert.equal(r.claim_review_complete,true);assert.equal(r.current_feed_eligible,false);assert.equal(r.content_type,doc.content_type);
 assert.equal(r.correction.title,doc.correction.title);assert.equal(r.correction.summary,doc.correction.summary);assert.equal(r.reason,review.reason);assert.equal(r.review_excerpt,review.excerpt);
 assert.equal(r.prior.evidence_quality,'Official Data');assert.equal(r.prior.verification_status,'Verified Against Primary Source');assert.equal(r.prior.record_status,doc.content_type==='Research docket'?'In Review':'Published');
 assert(raw.includes('published_date: 2026-08-08'));assert(raw.includes('last_reviewed_date: 2026-08-08'));
 const original={data:{...input.signals.find(s=>s.id===r.id),...r.prior,published_date:raw.match(/^published_date: (\d{4}-\d{2}-\d{2})/m)?.[1]}},before=JSON.stringify(original),current=projection.project(original);
 assert.equal(JSON.stringify(original),before);assert.equal(projection.eligible(current),false);
 for(const[key,value]of Object.entries(r.correction))assert.deepEqual(current.data[key],value);
 for(const key of ['id','slug','source_ids','record_status','captured_date','published_date','last_reviewed_date'])assert.deepEqual(current.data[key],original.data[key]);
 const serialized=serializePublicSignal({data:{...original.data,captured_date:new Date(original.data.captured_date),published_date:new Date(original.data.published_date),last_reviewed_date:new Date(original.data.last_reviewed_date)}});
 for(const key of ['title','summary','signal_type','evidence_quality','verification_status','maturity_level','claim_scope','local_evidence_level'])assert.deepEqual(serialized[key],r.correction[key]);
 const archive=shelves.classification.find(s=>s.id===r.id);assert.equal(archive.title,r.correction.title);assert.deepEqual(archive.filters.type,[r.content_type]);assert(searchShelf(shelves.classification,{q:r.correction.title,type:r.content_type}).some(s=>s.id===r.id));
 for(const[kind,rows]of Object.entries(shelves))if(kind==='signals'||kind.startsWith('topic-')||kind.startsWith('local-'))assert(!rows.some(s=>s.id===r.id),`${kind}: 57L record leaked into a development feed`);
 assert.throws(()=>verifyClassifiedInput({id:r.id,body:raw+'\nUnreviewed source change',expectedHash:pin.signal_sha256}),/individual re-review required/);
 if(review.reopening_contract)assert(raw.includes(`Reopening contract: ${review.reopening_contract}. Trigger state: **not fired**.`));
}
const originalSignals=signals.records.slice(0,621),snapshotSignals=JSON.stringify(originalSignals);
assert.deepEqual(await append57lClassifications(root,originalSignals),signals.records.slice(0,650));assert.equal(JSON.stringify(originalSignals),snapshotSignals);
await assert.rejects(()=>append57lClassifications(root,[...originalSignals.slice(0,620),{...originalSignals[620],action_date:'2026-09-15'}]),/Earlier signal classifications changed/);
const update=await json('src/content/updates/2026-09-15-57l-individual-classifications.json');
assert.deepEqual([...update.affected_record_ids].sort(),signalReviews57l.map(r=>r.id).sort());assert.equal(update.effective_date,'2026-09-15');
for(const r of signalReviews57l)assert(update.related_paths.includes(`/signals/${r.id.slice(7)}/`));
const briefing=ledger.records.find(r=>r.id===`briefing-${pins.briefing_slug}`);assert(briefing.correction.summary.includes('15 present and 45 blocking'));assert(briefing.correction.summary.includes('not agency results, completed reviewer actions or synthetic test counts'));
const evidence=await read('src/data/phase-60-current-decisions.json');if(JSON.parse(evidence).as_of_date==='2026-09-15')assert.equal(hash(evidence),pins.current_evidence_hash);
console.log('57L passed: 29 research records, one briefing and 29 linked signals; eight analyses / twelve method notes / nine dockets; 633 earlier reference reviews and 621 earlier signal decisions unchanged. Historical 60-field matrix, nine queues, 60 prescribed actions, dates, original downloads and current evidence receipts preserved; no evidence admission or synthetic execution claimed.');
