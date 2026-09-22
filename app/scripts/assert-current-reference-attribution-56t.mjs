import assert from 'node:assert/strict';
import {readFile,readdir} from 'node:fs/promises';
import {createHash} from 'node:crypto';
import {fileURLToPath} from 'node:url';
import {join} from 'node:path';
import pins from './content-205-216/reference-attribution-56t-inputs.json' with {type:'json'};
import ledger from '../src/data/phase-206-reference-attribution.json' with {type:'json'};
import signals from '../src/data/phase-206-editorial-classification.json' with {type:'json'};
import {signalReviews56t} from './content-205-216/reference-attribution-56t-reviews.mjs';
import {appendDatedSignalClassifications} from './lib/append-dated-signal-classifications.mjs';
import {verifyClassifiedInput} from './lib/classification-review.mjs';
import {createSignalProjection} from '../src/lib/signal-classification.mjs';
import {serializePublicSignal} from '../src/lib/public-data.ts';
import {readShelfInputs} from './lib/read-shelf-inputs.mjs';
import {createShelfData} from '../src/lib/shelf-data.mjs';
import {searchShelf} from '../src/lib/shelf-search.mjs';
const root=fileURLToPath(new URL('../',import.meta.url)),read=p=>readFile(join(root,p),'utf8');
const hash=s=>createHash('sha256').update(s).digest('hex'),json=async p=>JSON.parse(await read(p));
assert.equal(pins.previous_reference_count,663);assert.equal(pins.previous_signal_count,650);
assert.equal(hash(JSON.stringify(ledger.records.slice(0,663))),pins.previous_records_hash,'Earlier attribution reviews changed');
assert.equal(hash(JSON.stringify(signals.records.slice(0,650))),pins.previous_signal_records_hash,'Earlier signal decisions changed');
assert.equal(pins.prior_input_pins.length,36);assert.equal(pins.supporting_registry_pins.length,2);
for(const p of [...pins.prior_input_pins,...pins.supporting_registry_pins,...pins.prior_signal_input_pins])assert.equal(hash(await read(p.path)),p.sha256,`Pinned input changed: ${p.path}`);
assert.equal(hash(await read(`src/content/research-collections/${pins.collection_slug}.json`)),pins.collection_sha256);
const docs=ledger.records.filter(r=>r.id.startsWith('research-doc-56t-'));
assert.equal(docs.length,24);assert.equal(docs.filter(r=>r.content_type==='Research docket').length,8);assert.equal(docs.filter(r=>r.content_type==='FTFN analysis').length,16);
const registry=await json('src/data/phase-56t-official-response-acquisition-artifact-sufficiency-queue.json');
assert.equal(registry.records.length,24);assert.deepEqual(registry.decision_class_counts,{'Missing-document acquisition ticket':8,'Adjacent-source directive matrix':13,'Public-candidate sufficiency matrix':3});
assert.deepEqual(registry.scope_element_counts,{supported:3,partial:23,not_established:46});
assert.deepEqual(registry.prior_closure_counts,{closed:1,partially_closed:21,open:2});assert.deepEqual(registry.post_batch_closure_counts,registry.prior_closure_counts);assert.deepEqual(registry.implementation_changes,[]);assert.deepEqual(registry.closure_changes,[]);
assert.equal(registry.inherited_hold.record_id,'record-56n-hhs-large-hospital-post-date-recheck');assert.equal(registry.inherited_hold.status,'In Review');
const supported=registry.records.flatMap(r=>r.directive_matrix);assert.equal(supported.length,72);assert.equal(supported.filter(m=>m.matrix_decision==='Supported by located public record').length,3);assert.equal(supported.filter(m=>m.matrix_decision==='Partly supported by located public record').length,23);assert.equal(supported.filter(m=>m.matrix_decision==='Not established by located public record').length,46);
const expectedIdentities={
 'DOE-01':['GAO-23-104661',1],'DOE-02':['GAO-25-107109',3],'DOE-03':['GAO-18-477',2],'DOE-04':['GAO-22-105394',1],'DOE-05':['GAO-24-106989',3],
 'HHS-01':['GAO-16-568',2],'HHS-02':['GAO-18-564',1],'HHS-03':['GAO-26-107507',4],'HHS-04-R1':['GAO-24-106276',1],'HHS-04-R2':['GAO-24-106276',2],
 'DOT-01':['GAO-21-310',1],'DOT-02':['GAO-26-107320',3],'DOT-03':['GAO-17-20',1],'DOT-04':['GAO-25-107166',1],'DOT-05':['GAO-25-107166',2],'DOT-06':['GAO-23-105189',1],'DOT-07':['GAO-26-107648',1],'DOT-08':['GAO-18-132',1],
 'VA-01':['GAO-25-106969',2],'VA-02-R1':['GAO-25-106874',1],'VA-02-R2':['GAO-25-106874',2],'VA-03':['GAO-22-105195',1],'VA-04':['GAO-25-107398',4],'VA-05':['GAO-24-106189',5],
};
for(const r of docs){
 const pin=pins.docs.find(p=>p.id===r.id),d=await json(`src/content/${r.source_file}`),original=registry.records.find(x=>x.document_id===r.id),h=pin.historical_decision;
 assert.equal(hash(await read(`src/content/${r.source_file}`)),pin.reviewed_source_sha256);assert.equal(d.publication_date,null);assert.equal(d.captured_date,'2026-08-02');assert.equal(d.record_status,'Published');assert.equal(r.review_date,'2026-09-15');assert.equal(r.prior.document_type,'Oversight Report');assert.equal(r.inherited_publisher_label,'U.S. Government Accountability Office and named implementing agency');
 assert.deepEqual(h,Object.fromEntries(Object.keys(h).map(k=>[k,original[k]])),'Frozen reviewed matrix differs from historical registry');
 const[report,number]=expectedIdentities[h.action_key];assert.equal(h.official_identity,`${report} Recommendation ${number}`);assert.equal(d.official_url,`https://www.gao.gov/products/${report.toLowerCase()}`);
 assert.equal(r.content_type,h.decision_class==='Missing-document acquisition ticket'?'Research docket':'FTFN analysis');
 assert(r.correction.summary.includes('August 2, 2026'));assert(r.correction.summary.includes(h.official_identity));assert(r.correction.title.startsWith('FTFN historical '));
 for(const m of h.directive_matrix){assert.equal(m.authority_boundary,'FTFN records visible public coverage only; GAO retains recommendation-sufficiency and closure authority.');const finding=r.correction.key_findings.find(f=>f.startsWith(`Historical FTFN matrix element ${m.directive_element} (August 2):`));for(const value of [m.requirement,m.matrix_decision,m.evidence,m.locator])assert(finding.includes(value));}
 for(const text of [`Historical stop rule: ${h.stop_rule}`,`Historical reopening trigger: ${h.reopening_trigger}`,`Historical next action, not performed by this correction: ${h.next_action}`,`Acceptance language recorded by FTFN on August 2, not rechecked: ${h.gao_acceptance_state}.`])assert(r.correction.key_findings.includes(text));
 assert(r.correction.evidence_limits.some(s=>s.includes('not newly verified')));assert(r.correction.evidence_limits.some(s=>s.includes('not synthetic test results')));
 const expected=[`Title: ${d.title}`,`Publisher: ${d.publisher}`,'Publication date: Not stated',`Official URL: ${d.official_url}`,`Capture status: ${d.capture_status}`,`Record status: ${d.record_status}`,`Captured by FTFN: ${d.captured_date}`,'',`Boundary: ${d.evidence_limits.join(' ')}`,'','Supporting public artifacts:',...d.supporting_official_urls.map(u=>'- '+u)].join('\n');
 assert.equal((await read('public'+d.local_capture_path)).replace(/^\uFEFF/,'').replace(/\r\n/g,'\n').trimEnd(),expected);assert.equal(hash(await read('public'+d.local_capture_path)),pin.download_sha256);
}
// Same report or source does not mean the same recommendation or disposition.
const byKey=k=>registry.records.find(r=>r.action_key===k);
for(const[a,b]of [['HHS-04-R1','HHS-04-R2'],['DOT-04','DOT-05'],['VA-02-R1','VA-02-R2']]){assert.equal(byKey(a).report_id,byKey(b).report_id);assert.notEqual(byKey(a).recommendation_number,byKey(b).recommendation_number);assert.notEqual(byKey(a).document_id,byKey(b).document_id);}
assert.equal(byKey('DOT-06').located_official_urls[0],byKey('DOT-07').located_official_urls[0]);assert.notEqual(byKey('DOT-06').decision_class,byKey('DOT-07').decision_class);assert.notEqual(byKey('DOT-06').official_identity,byKey('DOT-07').official_identity);
const va=docs.find(d=>d.id===byKey('VA-03').document_id);assert(va.correction.key_findings.some(s=>s.includes('expired November 14, 2025')));assert.match(va.correction.summary,/not a new confirmation of present authority/);
assert.equal(byKey('DOE-02').gao_acceptance_state,'GAO says submitted material is incomplete');assert.equal(byKey('DOE-02').acquisition_status,'Exact artifact not acquired from a public repository');
const input=await readShelfInputs(root),beforeInput=JSON.stringify(input),shelves=createShelfData(input,signals).shelves,projection=createSignalProjection(signals.records);
assert.equal(JSON.stringify(input),beforeInput);
const signalFiles=(await readdir(join(root,'src/content/signals'))).filter(f=>/^signal-56t-/.test(f)).sort();assert.deepEqual(signalReviews56t.map(r=>r.source_file).sort(),signalFiles);
assert.equal(signals.records.filter(r=>r.id.startsWith('signal-56t-')).length,24);assert.equal(signals.records.slice(0,674).filter(r=>r.correction).length,673);assert.equal(signals.remaining_individual_reviews,0);
for(const review of signalReviews56t){
 const r=signals.records.find(r=>r.id===review.id),doc=docs.find(d=>d.related_signal_id===r.id),pin=pins.docs.find(p=>p.signal_file===r.source_file),raw=await read(`src/content/signals/${r.source_file}`);
 verifyClassifiedInput({id:r.id,body:raw,excerpt:review.excerpt,expectedHash:pin.signal_sha256});assert.equal(r.reviewed_source_sha256,pin.signal_sha256);assert.equal(r.source_sha256,pin.signal_sha256);
 assert.equal(r.content_type,doc.content_type);assert.equal(r.correction.title,doc.correction.title);assert.equal(r.correction.summary,doc.correction.summary);assert.equal(r.reason,review.reason);assert.equal(r.action_date,'2026-09-15');assert.equal(r.classification_review_date,'2026-09-15');assert.equal(r.current_feed_eligible,false);
 assert.equal(r.prior.record_status,'Published');assert.equal(r.prior.evidence_quality,'Audited or Verified Data');assert.equal(r.prior.verification_status,'Verified Against Primary Source');assert(raw.includes('last_reviewed_date: 2026-08-02'));
 const original={data:{...input.signals.find(s=>s.id===r.id),...r.prior,published_date:raw.match(/^published_date: (\d{4}-\d{2}-\d{2})/m)?.[1]}},snapshot=JSON.stringify(original),current=projection.project(original);
 assert.equal(JSON.stringify(original),snapshot);assert.equal(projection.eligible(current),false);for(const[k,v]of Object.entries(r.correction))assert.equal(current.data[k],v);
 for(const k of ['id','slug','source_ids','record_status','captured_date','published_date','last_reviewed_date'])assert.deepEqual(current.data[k],original.data[k]);
 const exported=serializePublicSignal({data:{...original.data,captured_date:new Date(original.data.captured_date),published_date:new Date(original.data.published_date),last_reviewed_date:new Date(original.data.last_reviewed_date)}});
 for(const k of Object.keys(r.correction))assert.equal(exported[k],r.correction[k]);assert.equal(exported.published_date,'2026-08-02');assert.equal(exported.last_reviewed_date,'2026-08-02');
 const card=shelves.classification.find(s=>s.id===r.id);assert.equal(card.title,r.correction.title);assert.deepEqual(card.filters.type,[r.content_type]);assert(searchShelf(shelves.classification,{q:r.correction.title,type:r.content_type}).some(s=>s.id===r.id));
 for(const[kind,rows]of Object.entries(shelves))if(kind==='signals'||kind.startsWith('topic-')||kind.startsWith('local-'))assert(!rows.some(s=>s.id===r.id),`${kind}: acquisition or analysis record leaked into default development feed`);
 assert.throws(()=>verifyClassifiedInput({id:r.id,body:raw+'\nUnreviewed new claim',expectedHash:pin.signal_sha256}),/individual re-review required/);
}
const previous=signals.records.slice(0,650),before=JSON.stringify(previous),args={root,previous,pins,reviews:signalReviews56t,screeningBasis:'Complete Phase 56T linked-signal review following confirmed research-document attribution defects',reviewScope:'Individual headline, metadata and complete body attribution with exact historical recommendation matrices; not a fresh external verification, GAO decision or independent approval'};
assert.deepEqual(await appendDatedSignalClassifications(args),signals.records.slice(0,674));assert.equal(JSON.stringify(previous),before);
await assert.rejects(()=>appendDatedSignalClassifications({...args,previous:previous.slice(1)}),/Earlier signal classifications changed/);
await assert.rejects(()=>appendDatedSignalClassifications({...args,pins:{...pins,review_date:'2026-08-01'}}),/cannot predate/);
await assert.rejects(()=>appendDatedSignalClassifications({...args,reviews:[...signalReviews56t.slice(1),signalReviews56t[1]]}),/duplicate/);
await assert.rejects(()=>appendDatedSignalClassifications({...args,reviews:signalReviews56t.map((r,i)=>i? r:{...r,type:'External observation'})}),/non-internal/);
await assert.rejects(()=>appendDatedSignalClassifications({...args,reviews:signalReviews56t.map((r,i)=>i?r:{...r,reviewed_source_sha256:'0'.repeat(64)})}),/pin or identity mismatch/);
const update=await json('src/content/updates/2026-09-15-56t-individual-classifications.json');assert.deepEqual([...update.affected_record_ids].sort(),signalReviews56t.map(r=>r.id).sort());assert.equal(update.effective_date,'2026-09-15');
for(const r of signalReviews56t)assert(update.related_paths.includes(`/signals/${r.id.slice(7)}/`));
const briefing=ledger.records.find(r=>r.id===`briefing-${pins.briefing_slug}`);assert(briefing.correction.summary.includes('72 directive-element assessments'));assert(briefing.correction.top_takeaways.some(t=>t.includes('not mean three satisfied recommendations')));assert.equal(briefing.review_date,'2026-09-15');
const evidence=await read('src/data/phase-60-current-decisions.json');if(JSON.parse(evidence).as_of_date==='2026-09-15')assert.equal(hash(evidence),pins.current_evidence_hash);
console.log('56T passed: 24 documents, Watch 024 and 24 linked signals; eight acquisition dockets / sixteen analyses; 663 earlier reference reviews and 650 signal decisions unchanged. Exact 24 recommendation identities, 72 historical directive assessments, original null publication dates, downloads and later receipts retained. No new search, submission, synthetic test, GAO acceptance or release approval.');
