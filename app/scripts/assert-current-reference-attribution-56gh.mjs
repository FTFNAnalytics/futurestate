import assert from 'node:assert/strict';
import {readFile,readdir} from 'node:fs/promises';
import {createHash} from 'node:crypto';
import {fileURLToPath} from 'node:url';
import {join} from 'node:path';
import pins from './content-205-216/reference-attribution-56gh-inputs.json' with {type:'json'};
import ledger from '../src/data/phase-206-reference-attribution.json' with {type:'json'};
import signals from '../src/data/phase-206-editorial-classification.json' with {type:'json'};
import {signalReviews56gh,screeningBasis56gh} from './content-205-216/reference-attribution-56gh-reviews.mjs';
import {appendDatedSignalClassifications} from './lib/append-dated-signal-classifications.mjs';
import {createSignalProjection} from '../src/lib/signal-classification.mjs';
import {serializePublicSignal} from '../src/lib/public-data.ts';
import {readShelfInputs} from './lib/read-shelf-inputs.mjs';
import {createShelfData} from '../src/lib/shelf-data.mjs';
import {searchShelf} from '../src/lib/shelf-search.mjs';
import screenDispositions from './content-205-216/reference-attribution-screen-dispositions.json' with {type:'json'};
import {attributionScreenDisposition} from './lib/attribution-screen-disposition.mjs';
const root=fileURLToPath(new URL('../',import.meta.url)),read=p=>readFile(join(root,p),'utf8'),json=async p=>JSON.parse(await read(p)),hash=s=>createHash('sha256').update(s).digest('hex');
const count=(rows,key)=>rows.reduce((o,r)=>(o[r[key]]=(o[r[key]]??0)+1,o),{});
assert.equal(pins.previous_reference_count,838);assert.equal(pins.previous_signal_count,819);
assert.equal(hash(JSON.stringify(ledger.records.slice(0,838))),pins.previous_records_hash);
assert.equal(hash(JSON.stringify(signals.records.slice(0,819))),pins.previous_signal_records_hash);
for(const p of pins.supporting_registry_pins)assert.equal(hash(await read(p.path)),p.sha256);
const acquisitions={};
for(const g of pins.groups){
 assert.equal(hash(await read(`src/content/research-collections/${g.collection_slug}.json`)),g.collection_sha256);
 assert.equal(hash(await readFile(join(root,'public'+g.archive_path))),g.archive_sha256);
 assert.equal(hash(await read('src/content/'+g.briefing.source_file)),g.briefing.reviewed_source_sha256);
 const reg=await json(g.registry_path),rows=reg.acquisitions;acquisitions[g.key]=rows;
 const publication=await json(`src/data/phase-${g.key}-publication-review.json`),docs=ledger.records.filter(r=>r.id.startsWith(`research-doc-${g.key}-`));
 assert.equal(rows.length,g.key==='56g'?7:14);assert.equal(docs.length,rows.length);
 assert.deepEqual(count(docs,'content_type'),g.key==='56g'?{'Research docket':6,'FTFN analysis':1}:{'Research docket':6,'FTFN analysis':8});
 assert.equal(publication.document_decisions.promoted.length,g.key==='56g'?1:8);
 for(const r of docs){
  const p=pins.docs.find(p=>p.id===r.id),d=await json('src/content/'+r.source_file),h=rows.find(a=>a.acquisition_id===r.id.replace('research-doc-','acquisition-'));
  assert.deepEqual(h,p.historical_decision);assert.equal(hash(await read('src/content/'+r.source_file)),p.reviewed_source_sha256);assert.equal(hash(await read('public'+p.download)),p.download_sha256);
  assert.equal(d.source_id,h.checked_source_id);assert.equal(d.official_url,h.checked_source_url);assert.equal(d.record_status,h.record_status);assert.equal(d.publication_date,p.publication_date);assert.equal(d.captured_date,'2026-07-24');assert.equal(r.review_date,'2026-09-15');
  assert.equal(r.inherited_publisher_label,d.publisher);assert.equal(r.correction.publisher,'FTFN');assert(r.correction.summary.includes('July 24, 2026'));
  assert(r.correction.key_findings.includes(`Original Phase 56F reopening rule: ${h.phase_56f_reopening_rule}`));assert(r.correction.key_findings.includes(`Historical continuation rule (July 24): ${h.reopening_rule}`));
  assert(r.correction.key_findings.includes(`Historical FTFN evidence state: ${h.prior_closure_status} to ${h.current_closure_status}.`));
  assert(publication.document_decisions[d.record_status==='Published'?'promoted':'held'].includes(r.id));
 }
}
const g=acquisitions['56g'],h=acquisitions['56h'];
assert.equal(g.filter(r=>r.prior_closure_status!==r.current_closure_status).length,1);
assert.deepEqual(count(h,'prior_closure_status'),{Open:6,'Partially Closed':8});assert.deepEqual(count(h,'current_closure_status'),{Open:3,'Partially Closed':11});
assert.deepEqual(h.filter(r=>r.prior_closure_status!==r.current_closure_status).map(r=>r.entity_id),['agency-doe','manufacturer-lockheed-f35-fort-worth','battery-hornsdale-power-reserve']);
const unchanged=h.filter(r=>r.prior_closure_status===r.current_closure_status);assert.equal(unchanged.length,11);assert.deepEqual(count(unchanged,'current_closure_status'),{Open:3,'Partially Closed':8});
const ids=[...new Set(unchanged.map(r=>r.checked_source_id))];assert.equal(ids.length,10);
const aggregateId='signal-56h-three-open-rails-six-partial-continuations',aggregateRaw=await read(`src/content/signals/${aggregateId}.mdx`);
const sourceBlock=aggregateRaw.match(/^source_ids:\r?\n((?:  - "[^\r\n]+"\r?\n)+)/m)[1];assert.deepEqual([...sourceBlock.matchAll(/  - "(.*)"/g)].map(m=>m[1]),ids);
assert.equal(unchanged.filter(r=>r.checked_source_id==='source-56h-gao-weapon-systems-2026').length,2);assert(unchanged.some(r=>r.entity_id==='battery-dalrymple-escri-sa'));
const generator=await read('scripts/generate-phase56h-content.mjs');assert(generator.includes('.filter((record) => record.currentStatus === record.priorStatus)'));
for(const suffix of ['f35-delivery-capability-denominator','hornsdale-final-project-operation']){
 const row=h.find(r=>r.acquisition_id===`acquisition-56h-${suffix}`),review=ledger.records.find(r=>r.id===`research-doc-56h-${suffix}`);
 assert.match(row.phase_56f_reopening_rule,suffix.startsWith('f35')?/month-level/:/annual operating series/);
 assert.match(review.correction.summary,suffix.startsWith('f35')?/not satisfied/:/unestablished/);
}
const input=await readShelfInputs(root),snapshot=JSON.stringify(input),shelves=createShelfData(input,signals).shelves,projection=createSignalProjection(signals.records);assert.equal(JSON.stringify(input),snapshot);
assert.deepEqual(signalReviews56gh.map(r=>r.source_file).sort(),(await readdir(join(root,'src/content/signals'))).filter(f=>/^signal-56[gh]-/.test(f)).sort());
assert.equal(signals.records.length,826);assert.equal(signals.corrected_presentations,825);assert.equal(signals.additional_attribution_reviewed_records,205);
for(const review of signalReviews56gh){
 const r=signals.records.find(r=>r.id===review.id),p=pins.signal_pins.find(p=>p.signal_id===r.id),raw=await read('src/content/signals/'+p.signal_file);
 const dateField=raw.match(/^published_date: (null|\d{4}-\d{2}-\d{2})\r?$/m)?.[1];assert(dateField);
 const source={...input.signals.find(s=>s.id===r.id),...r.prior,published_date:dateField==='null'?null:dateField};
 assert.equal(hash(raw),p.signal_sha256);assert(raw.includes(review.excerpt));assert.equal(r.content_type,review.type);assert.equal(r.correction.title,review.title);assert.equal(r.correction.summary,review.summary);assert.equal(r.current_feed_eligible,false);
 const entry={data:source},before=JSON.stringify(entry),current=projection.project(entry);assert.equal(JSON.stringify(entry),before);assert.equal(projection.eligible(current),false);
 for(const key of ['id','slug','source_ids','record_status','captured_date','published_date','last_reviewed_date'])assert.deepEqual(current.data[key],source[key]);
 const exported=serializePublicSignal({data:{...source,captured_date:new Date(source.captured_date),published_date:source.published_date?new Date(source.published_date):null,last_reviewed_date:new Date(source.last_reviewed_date)}});
 for(const [k,v]of Object.entries(r.correction)){assert.deepEqual(current.data[k],v);assert.deepEqual(exported[k],v);}
 assert.equal(exported.published_date,source.record_status==='Published'?'2026-07-24':null);
 const card=shelves.classification.find(s=>s.id===r.id);assert.equal(card.title,r.correction.title);assert(searchShelf(shelves.classification,{q:r.correction.title}).some(s=>s.id===r.id));
 for(const [kind,rows]of Object.entries(shelves))if(kind==='signals'||kind.startsWith('topic-')||kind.startsWith('local-'))assert(!rows.some(s=>s.id===r.id));
}
const aggregate=signals.records.find(r=>r.id===aggregateId);assert.deepEqual(aggregate.prior.receiving_systems,['Nine named Phase 56H entities']);assert.match(aggregate.correction.receiving_systems[0],/Eleven.*three.*eight/);
const previous=signals.records.slice(0,819),before=JSON.stringify(previous),args={root,previous,pins,reviews:signalReviews56gh,screeningBasis:screeningBasis56gh,reviewScope:pins.review_scope};
assert.deepEqual(await appendDatedSignalClassifications(args),signals.records);assert.equal(JSON.stringify(previous),before);
await assert.rejects(()=>appendDatedSignalClassifications({...args,previous:previous.slice(1)}),/Earlier signal classifications changed/);
await assert.rejects(()=>appendDatedSignalClassifications({...args,reviews:signalReviews56gh.slice(1)}),/Incomplete or duplicate/);
await assert.rejects(()=>appendDatedSignalClassifications({...args,pins:{...pins,signal_pins:pins.signal_pins.map((p,i)=>i===1?pins.signal_pins[0]:p)}}),/Incomplete or duplicate/);
await assert.rejects(()=>appendDatedSignalClassifications({...args,pins:{...pins,review_date:'2026-07-23'}}),/cannot predate/);
await assert.rejects(()=>appendDatedSignalClassifications({...args,reviews:signalReviews56gh.map((r,i)=>i===0?{...r,reviewed_source_sha256:'0'.repeat(64)}:r)}),/pin or identity mismatch/);
await assert.rejects(()=>appendDatedSignalClassifications({...args,reviews:signalReviews56gh.map(r=>r.id===aggregateId?{...r,receiving_systems:['']}:r)}),/Invalid receiving-system/);
const update=await json('src/content/updates/2026-09-15-56gh-individual-classifications.json');assert.deepEqual(update.affected_record_ids.sort(),signalReviews56gh.map(r=>r.id).sort());
const evidence=await read('src/data/phase-60-current-decisions.json');if(JSON.parse(evidence).as_of_date==='2026-09-15')assert.equal(hash(evidence),pins.current_evidence_hash);
assert.equal(screenDispositions.records.length,2);
for(const r of screenDispositions.records){
 const candidate={id:r.id,source_file:r.source_file,source_sha256:hash(await read('src/content/'+r.source_file))};
 assert.deepEqual(attributionScreenDisposition(candidate,screenDispositions.records,'2026-09-15'),r);
 assert.equal(attributionScreenDisposition({...candidate,source_sha256:'0'.repeat(64)},screenDispositions.records,'2026-09-15'),null);
 assert.equal(attributionScreenDisposition(candidate,screenDispositions.records,'2026-09-14'),null);
 assert(!ledger.records.some(x=>x.id===r.id),'Narrow lexical disposition is not a reference-attribution correction');
}
console.log('56G/56H attribution passed: 21 documents, two briefings, seven actual shared signals; nine analyses / twelve dockets; eleven unchanged records / ten source IDs / explicit Dalrymple overlap; original monthly/annual trigger gaps; 838 prior references, 819 signals, archives and real receipts unchanged.');
