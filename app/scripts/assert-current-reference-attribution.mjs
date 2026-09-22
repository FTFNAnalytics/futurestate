import assert from 'node:assert/strict';
import './assert-source-artifact-labels.mjs';
import {readFile,readdir} from 'node:fs/promises';
import {createHash} from 'node:crypto';
import {fileURLToPath} from 'node:url';
import {join} from 'node:path';
import reviews,{attributionTranches} from './content-205-216/reference-attribution-inputs.mjs';
import pins57x from './content-205-216/reference-attribution-57x-inputs.json' with {type:'json'};
import pins57w from './content-205-216/reference-attribution-57w-inputs.json' with {type:'json'};
import pins57v from './content-205-216/reference-attribution-57v-inputs.json' with {type:'json'};
import pins57u from './content-205-216/reference-attribution-57u-inputs.json' with {type:'json'};
import pins57t from './content-205-216/reference-attribution-57t-inputs.json' with {type:'json'};
import pins57rs from './content-205-216/reference-attribution-57rs-inputs.json' with {type:'json'};
import pins57pq from './content-205-216/reference-attribution-57pq-inputs.json' with {type:'json'};
import ledger from '../src/data/phase-206-reference-attribution.json' with {type:'json'};
import {createReferenceAttribution,projectResearchDocument,projectBriefing,attributionLinkText,referenceAttributionUpdateFor} from '../src/lib/reference-attribution.mjs';
import {serializePublicResearchDocument} from '../src/lib/public-data.ts';
import {readShelfInputs} from './lib/read-shelf-inputs.mjs';
import {createShelfData} from '../src/lib/shelf-data.mjs';
import {searchShelf} from '../src/lib/shelf-search.mjs';
const root=fileURLToPath(new URL('../',import.meta.url));
const read=p=>readFile(join(root,p),'utf8'),hash=s=>createHash('sha256').update(s).digest('hex');
assert.equal(ledger.records.length,861);assert.equal(reviews.records.length,861);
assert.equal(hash(await read('scripts/content-205-216/reference-attribution-reviews.json')),pins57x.previous_reviews_hash);
assert.equal(hash(JSON.stringify(ledger.records.slice(0,64))),pins57x.previous_records_hash,'Earlier dated review records changed');
assert.equal(hash(JSON.stringify(ledger.records.slice(0,128))),pins57w.previous_records_hash,'Either earlier attribution tranche changed');
for(const pin of pins57w.prior_input_pins)assert.equal(hash(await read(pin.path)),pin.sha256,`Earlier input/update changed: ${pin.path}`);
assert.equal(hash(JSON.stringify(ledger.records.slice(0,192))),pins57v.previous_records_hash,'One of the three earlier attribution tranches changed');
for(const pin of pins57v.prior_input_pins)assert.equal(hash(await read(pin.path)),pin.sha256,`Earlier input/update changed: ${pin.path}`);
assert.equal(hash(JSON.stringify(ledger.records.slice(0,256))),pins57u.previous_records_hash,'One of the four earlier attribution tranches changed');
for(const pin of pins57u.prior_input_pins)assert.equal(hash(await read(pin.path)),pin.sha256,`Earlier input/update changed: ${pin.path}`);
assert.equal(hash(JSON.stringify(ledger.records.slice(0,320))),pins57t.previous_records_hash,'One of the five earlier attribution tranches changed');
for(const pin of pins57t.prior_input_pins)assert.equal(hash(await read(pin.path)),pin.sha256,`Earlier input/update changed: ${pin.path}`);
assert.equal(hash(JSON.stringify(ledger.records.slice(0,375))),pins57rs.previous_records_hash,'One of the six earlier attribution tranches changed');
for(const pin of pins57rs.prior_input_pins)assert.equal(hash(await read(pin.path)),pin.sha256,`Earlier input/update changed: ${pin.path}`);
assert.equal(hash(JSON.stringify(ledger.records.slice(0,467))),pins57pq.previous_records_hash,'One of the eight earlier attribution tranches changed');
for(const pin of pins57pq.prior_input_pins)assert.equal(hash(await read(pin.path)),pin.sha256,`Earlier input/update changed: ${pin.path}`);
assert.equal(ledger.phase_state,'In progress — not complete');
const documents=ledger.records.filter(r=>r.record_kind==='research_document');
assert.equal(documents.length,839);assert.equal(documents.filter(r=>r.content_type==='FTFN method/test note').length,536);
assert.equal(documents.filter(r=>r.content_type==='Research docket').length,191);assert.equal(documents.filter(r=>r.content_type==='FTFN analysis').length,112);
const files=(await readdir(join(root,'src/content/research-documents'))).filter(f=>/-57[ghijklmnopqrstuvwxy]-|-56[ght]-/.test(f)).sort();
assert.deepEqual(documents.map(r=>r.source_file.split('/').at(-1)).sort(),files);
const input=await readShelfInputs(root),signals=JSON.parse(await read('src/data/phase-206-editorial-classification.json'));
const sourceBefore=JSON.stringify(input),shelves=createShelfData(input,signals).shelves;
assert.equal(JSON.stringify(input),sourceBefore);
for(const review of ledger.records){
  const author=reviews.records.find(r=>r.id===review.id);
  assert.deepEqual(Object.fromEntries(Object.keys(author).map(k=>[k,review[k]])),author);
  const raw=await read(`src/content/${review.source_file}`);assert.equal(hash(raw),review.reviewed_source_sha256);
  assert.equal(review.review_date,author.review_date);assert(review.reason.length>100);
  const tranche=attributionTranches.find(t=>t.reviews.records.some(r=>r.id===review.id));
  assert.equal(referenceAttributionUpdateFor(review.id),tranche.update_id);
  assert.notEqual(hash(raw+'\nNew unchecked claim'),review.reviewed_source_sha256);
  if(review.record_kind==='briefing'){
    const entry={data:input.briefings.find(b=>b.id===review.id)};
    const before=JSON.stringify(entry),current=projectBriefing(entry);
    assert.equal(current.data.captured_date,['56g','56h'].includes(tranche.key)?'2026-07-24':['57g','57h','57i','57j','57k'].includes(tranche.key)?'2026-08-03':tranche.key==='56t'?'2026-08-02':['57l','57m'].includes(tranche.key)?'2026-08-08':['57n','57o','57p','57q','57r','57s','57t','57u'].includes(tranche.key)?'2026-08-09':'2026-08-10');assert.equal(current.data.record_status,'Published');
    assert.equal(current.data.claim_scope,'Internal FTFN record');assert(raw.includes(`## ${tranche.historical_heading}`));
    if(tranche.key==='57y')assert(raw.includes('Official DARPA Lift Challenge results after the August 9 awards ceremony'));
    else if(tranche.key==='57x')assert(raw.includes('Production health-window and partition receipts that preserve the fixed threshold'));
    else if(tranche.key==='57w')assert(raw.includes('One production fixed-threshold member admission, suspension, replacement, or emergency ceremony'));
    else if(tranche.key==='57v')assert(raw.includes('One production M-of-N policy operated by distinct actors and authority domains'));
    else if(tranche.key==='57u')assert(raw.includes('One production key registry with independently governed custody and release authorization'));
    else if(tranche.key==='57t')assert(raw.includes('One production canonical verification URI with externally governed signing-key custody'));
    else if(tranche.key==='57s')assert(raw.includes('One real complete lifecycle manifest with public verification metadata'));
    else if(tranche.key==='57r')assert(raw.includes('One separately authorized restoration with a new bundle digest'));
    else if(tranche.key==='57q')assert(raw.includes('One cited Amtrak asset-period bundle'));
    else if(tranche.key==='57p')assert(raw.includes('One cited Amtrak asset-period packet'));
    else if(tranche.key==='57o')assert(raw.includes('One cited Amtrak asset-period packet'));
    else if(tranche.key==='57n')assert(raw.includes('One cited Amtrak asset-period packet'));
    else if(tranche.key==='57m')assert(raw.includes('One cited Amtrak asset-period packet'));
    else if(tranche.key==='57l')assert(raw.includes('One complete Amtrak asset-period record'));
    else if(tranche.key==='56t')assert(raw.includes('Explicit GAO acceptance or remaining-deficiency language'));
    else if(tranche.key==='57k')assert(raw.includes('Later code-bearing Amtrak snapshots'));
    else if(['57i','57j'].includes(tranche.key))assert(raw.includes('Official code-bearing Amtrak station registry'));
    else if(tranche.key==='57h')assert(raw.includes('Official Amtrak station-code revisions'));
    else if(tranche.key==='57g')assert(raw.includes('Amtrak current station-device revision register'));
    else if(tranche.key==='56g')assert(raw.includes('Dalrymple activation counts and operating denominators.'));
    else if(tranche.key==='56h')assert(raw.includes('Monthly production and acceptance denominators for F-35, KC-46A, and F-15EX.'));
    else assert.fail(`Missing independent historical-briefing expectation: ${tranche.key}`);
    assert.equal(JSON.stringify(entry),before);continue;
  }
  const original=JSON.parse(raw),before=JSON.stringify(original),current=projectResearchDocument({data:original}).data;
  for(const[key,value]of Object.entries(review.correction))assert.deepEqual(current[key],value);
  for(const key of ['id','slug','collection_id','source_id','supporting_source_ids','official_url','supporting_official_urls','record_status','publication_date','captured_date','primary_topics','framework_layers','constraint_tags'])assert.deepEqual(current[key],original[key],`${review.id}/${key}: history must not change`);
  assert.equal(hash(await read('public'+review.historical_download.path)),review.historical_download.sha256);
  const link=await read('public'+current.local_capture_path);assert.equal(link,attributionLinkText(current));
  assert(link.includes('Record author: FTFN'));assert(link.includes(original.official_url));assert(link.includes('not a capture'));
  assert.equal(current.publisher,'FTFN');assert(current.evidence_limits.some(v=>v.includes('not newly verified')));
  const card=shelves.documents.find(d=>d.id===review.id);assert.equal(card.title,current.title);assert.equal(card.summary,current.summary);
  assert.deepEqual(card.filters.publisher,['FTFN']);assert.deepEqual(card.filters.documentType,[review.content_type]);
  assert(searchShelf(shelves.documents,{q:current.title}).some(d=>d.id===review.id));
  for(const topic of original.primary_topics){const topicRecord=input.topics.find(t=>t.name===topic);const card=shelves[`topic-${topicRecord.slug}`].find(r=>r.id===review.id);assert(card,`Missing topic card: ${review.id}/${topic}`);assert.equal(card.title,current.title);assert.deepEqual(card.filters.publisher,['FTFN']);}
  const exported=serializePublicResearchDocument({data:{...original,publication_date:original.publication_date?new Date(original.publication_date):null,captured_date:new Date(original.captured_date)}});
  for(const key of ['title','publisher','document_type','summary','key_findings','why_it_matters','ftfn_relevance','evidence_limits','capture_status','local_capture_path'])assert.deepEqual(exported[key],current[key]);
  assert.deepEqual(exported.editorial_attribution,review);assert.equal(JSON.stringify(original),before);
  assert.deepEqual(projectResearchDocument({data:current}).data,current,'Idempotent projection');
  assert(signals.records.some(r=>r.id===review.related_signal_id));
}
const starlink=documents.find(r=>r.id==='research-doc-57y-preserved-la-starlink-adoption');
assert(!JSON.stringify(starlink.correction).includes('September 8'));assert(starlink.correction.summary.includes('August 10'));
const signal=signals.records.find(r=>r.id===starlink.related_signal_id);assert.equal(signal.retained_source_reviews.length,2);
assert.equal(signals.individually_reviewed,826);assert.equal(signals.remaining_individual_reviews,0);
assert(signals.records.every(r=>r.current_feed_eligible===false));
const untouched={data:input.documents.find(d=>!documents.some(r=>r.id===d.id))};assert.equal(projectResearchDocument(untouched),untouched);
const first=ledger.records[0];
assert.throws(()=>createReferenceAttribution([first,first]),/Duplicate/);
assert.throws(()=>createReferenceAttribution([{...first,correction:{...first.correction,record_status:'Published'}}]),/cannot override/);
assert.throws(()=>createReferenceAttribution([{...first,correction:{...first.correction,publication_date:'2026-09-14'}}]),/cannot override/);
assert.throws(()=>createReferenceAttribution([{...first,correction:{...first.correction,source_id:'invented'}}]),/cannot override/);
assert.throws(()=>createReferenceAttribution([{...first,correction:{...first.correction,key_findings:'not an array'}}]),/Invalid attribution/);
assert.throws(()=>createReferenceAttribution([{...first,reviewed_source_sha256:'missing'}]),/Missing dated/);
assert.throws(()=>createReferenceAttribution([first]).project({data:{id:first.id}},'briefing'),/kind mismatch/);
const independent=createReferenceAttribution([first]),copy=independent.review(first.id);copy.correction.title='mutated';assert.notEqual(independent.review(first.id).correction.title,'mutated');
for(const tranche of attributionTranches){
 const update=JSON.parse(await read(`src/content/updates/${tranche.update_id.replace(/^update-/,'')}.json`));
 assert.deepEqual([...update.affected_record_ids].sort(),tranche.reviews.records.map(r=>r.id).sort());
 assert(searchShelf(shelves.updates,{q:update.receipt_id}).some(r=>r.id===update.id));
 const collection=input.collections.find(r=>r.slug===tranche.collection_slug);
 assert.deepEqual([...collection.document_ids].sort(),tranche.reviews.records.filter(r=>r.record_kind==='research_document').map(r=>r.id).sort());
}
async function checkConsumers(directory){
  for(const entry of await readdir(join(root,directory),{withFileTypes:true})){
    const file=`${directory}/${entry.name}`;
    if(entry.isDirectory()){await checkConsumers(file);continue;}
    if(!/\.(astro|ts)$/.test(file))continue;
    const body=await read(file);
    for(const[kind,fn]of [['researchDocuments','projectResearchDocument'],['briefings','projectBriefing']]){
      const matches=[...body.matchAll(new RegExp(`getCollection\\((["'])${kind}\\1\\)`, 'g'))];
      for(const match of matches)assert(body.slice(match.index+match[0].length).startsWith(`.then(records => records.map(${fn}))`),`${file}: raw ${kind} bypasses current attribution`);
    }
  }
}
await checkConsumers('src');
const wDocs=documents.filter(r=>r.id.startsWith('research-doc-57w-'));
const wFamilies=[['quorum-ceremony-member-lifecycle-receipts',28,8,20],['witness-availability-staleness-catchup-proofs',26,7,19],['attributable-fork-evidence-receipts',24,6,18],['federated-time-authority-failover',25,7,18],['verifier-build-provenance-reproducible-attestations',27,8,19],['post-compromise-artifact-reissuance-reader-migration',29,8,21]];
for(const [suffix,total,valid,rejected]of wFamilies){
 const rows=wDocs.filter(r=>r.id.endsWith(suffix));assert.equal(rows.length,9);
 for(const r of rows){assert.match(r.correction.summary,new RegExp(`${total} synthetic`));assert(r.correction.summary.includes(String(rejected)));assert(r.correction.summary.includes({6:'six',7:'seven',8:'eight'}[valid]));assert.equal(r.prior.document_type,'Data Release');assert.equal(r.correction.publisher,'FTFN');}
}
assert.equal(wFamilies.reduce((sum,r)=>sum+r[1],0)*9,1431);
assert.equal(wDocs.filter(r=>r.content_type==='Research docket').length,9);
for(const r of wDocs.filter(r=>r.content_type==='Research docket')){assert.match(r.correction.summary,/159 synthetic cases/);assert.match(r.correction.summary,/August 10/);assert.match(r.correction.summary,/does not exist/);assert.equal(r.prior.document_type,'Technical Report');}
const timeW=wDocs.find(r=>r.id==='research-doc-57w-amtrak-pids-federated-time-authority-failover');
assert.match(timeW.correction.title,/two-authority/);assert(timeW.correction.key_findings.some(v=>v.includes('distinct from the later three-domain')));
const availabilityW=wDocs.find(r=>r.id==='research-doc-57w-amtrak-pids-witness-availability-staleness-catchup-proofs');
assert(availabilityW.correction.key_findings.some(v=>v.includes('900-second')));
const evidenceText=await read('src/data/phase-60-current-decisions.json');
if(JSON.parse(evidenceText).as_of_date==='2026-09-15')assert.equal(hash(evidenceText),pins57w.current_evidence_hash,'Attribution review changed actual evidence decisions');
const vDocs=documents.filter(r=>r.id.startsWith('research-doc-57v-'));
const vFamilies=[['threshold-release-authorization',25,7,18],['independent-witness-checkpoints',24,7,17],['cross-log-gossip-split-view-detection',22,6,16],['trusted-time-anti-rollback-receipts',23,6,17],['three-implementation-verifier-diversity',24,7,17],['algorithm-key-compromise-recovery',26,7,19]];
assert.equal(vDocs.length,63);
for(const [suffix,total,valid,rejected]of vFamilies){
 const rows=vDocs.filter(r=>r.id.endsWith(suffix));assert.equal(rows.length,9);
 for(const r of rows){assert.match(r.correction.summary,new RegExp(`${total} synthetic`));assert(r.correction.summary.includes(String(rejected)));assert(r.correction.summary.includes({6:'six',7:'seven'}[valid]));assert.equal(r.prior.document_type,'Data Release');assert.equal(r.correction.publisher,'FTFN');}
}
assert.equal(vFamilies.reduce((sum,r)=>sum+r[1],0)*9,1296);
assert.equal(vDocs.filter(r=>r.content_type==='Research docket').length,9);
for(const r of vDocs.filter(r=>r.content_type==='Research docket')){assert.match(r.correction.summary,/144 synthetic cases/);assert.match(r.correction.summary,/August 10/);assert.match(r.correction.summary,/does not exist/);assert.equal(r.prior.document_type,'Technical Report');}
const vFindings=suffix=>vDocs.find(r=>r.id===`research-doc-57v-amtrak-pids-${suffix}`).correction.key_findings.join(' ');
assert.match(vFindings('threshold-release-authorization'),/three-of-five/);assert.match(vFindings('threshold-release-authorization'),/no production secret/);
assert.match(vFindings('independent-witness-checkpoints'),/at least two distinct operators/);assert.match(vFindings('independent-witness-checkpoints'),/separate from the three-of-five/);
assert.match(vFindings('cross-log-gossip-split-view-detection'),/cannot vote a divergent log into authority/);
assert.match(vFindings('trusted-time-anti-rollback-receipts'),/distinct from later two-authority failover and three-domain corroboration/);
assert.match(vFindings('three-implementation-verifier-diversity'),/divergence rejects without majority substitution/);
assert.match(vFindings('algorithm-key-compromise-recovery'),/remains inactive/);assert.match(vFindings('algorithm-key-compromise-recovery'),/never receive retroactive trust/);
if(JSON.parse(evidenceText).as_of_date==='2026-09-15')assert.equal(hash(evidenceText),pins57v.current_evidence_hash,'57V attribution changed actual evidence decisions');
const uDocs=documents.filter(r=>r.id.startsWith('research-doc-57u-'));
const uFamilies=[['governed-verification-key-registry',20,6,14],['key-lifecycle-activation-rotation-expiry-revocation-receipts',22,7,15],['transparency-log-inclusion-consistency-proofs',22,7,15],['multi-origin-consistency-without-majority-substitution',20,5,15],['incident-declaration-containment-recovery-receipts',22,6,16],['recovery-point-time-objective-drill',24,7,17]];
assert.equal(uDocs.length,63);
for(const[suffix,total,valid,rejected]of uFamilies){
 const rows=uDocs.filter(r=>r.id.endsWith(suffix));assert.equal(rows.length,9);
 for(const r of rows){assert.match(r.correction.summary,new RegExp(`${total} synthetic`));assert(r.correction.summary.includes(String(rejected)));assert(r.correction.summary.includes({5:'five',6:'six',7:'seven'}[valid]));assert.equal(r.prior.document_type,'Data Release');assert.equal(r.correction.publisher,'FTFN');}
}
assert.equal(uFamilies.reduce((sum,r)=>sum+r[1],0)*9,1170);
assert.equal(uDocs.filter(r=>r.content_type==='Research docket').length,9);
for(const r of uDocs){
 const original=JSON.parse(await read(`src/content/${r.source_file}`));assert.equal(original.publication_date,'2026-08-09');assert.equal(original.captured_date,'2026-08-09');assert.match(r.correction.summary,/August 9/);assert(!r.correction.summary.includes('August 10'));
 if(r.content_type==='Research docket'){assert.match(r.correction.summary,/130 synthetic cases/);assert.match(r.correction.summary,/does not exist/);assert.equal(r.prior.document_type,'Technical Report');}
}
const uFindings=suffix=>uDocs.find(r=>r.id===`research-doc-57u-amtrak-pids-${suffix}`).correction.key_findings.join(' ');
assert.match(uFindings('governed-verification-key-registry'),/exactly one active key/);assert.match(uFindings('governed-verification-key-registry'),/signing, custody, release authorization and incident command/);
assert.match(uFindings('key-lifecycle-activation-rotation-expiry-revocation-receipts'),/Earlier events cannot be rewritten/);
assert.match(uFindings('transparency-log-inclusion-consistency-proofs'),/not the truth of a source claim/);
assert.match(uFindings('multi-origin-consistency-without-majority-substitution'),/neither mirror nor archive replaces canonical lifecycle authority/);
assert.match(uFindings('incident-declaration-containment-recovery-receipts'),/Separate recovery review remains required/);
assert.match(uFindings('recovery-point-time-objective-drill'),/missed objective rejects/);assert.match(uFindings('recovery-point-time-objective-drill'),/not production service guarantees/);
if(JSON.parse(evidenceText).as_of_date==='2026-09-15')assert.equal(hash(evidenceText),pins57u.current_evidence_hash,'57U attribution changed actual evidence decisions');
const tDocs=documents.filter(r=>r.id.startsWith('research-doc-57t-'));
const tFamilies=[['canonical-reader-verification-endpoint',18,6,12],['signed-release-index-chain',18,6,12],['cache-coherence-receipt-fail-closed',18,5,13],['mirror-redirect-integrity-control',18,5,13],['immutable-history-recovery-drill',20,6,14]];
assert.equal(tDocs.length,54);
for(const[suffix,total,valid,rejected]of tFamilies){
 const rows=tDocs.filter(r=>r.id.endsWith(suffix));assert.equal(rows.length,9);
 for(const r of rows){assert.match(r.correction.summary,new RegExp(`${total} synthetic`));assert(r.correction.summary.includes(String(rejected)));assert(r.correction.summary.includes({5:'five',6:'six'}[valid]));assert.equal(r.prior.document_type,'Data Release');assert.equal(r.correction.publisher,'FTFN');}
}
assert.equal(tFamilies.reduce((sum,r)=>sum+r[1],0)*9,828);
const reopeningTargets={
 'amtrak-pids':'Code-bearing official current asset register or closeout table',
 'amtrak-reliability':'Named-asset-period reliability table',
 'la-nextlink-adoption':'Privacy-safe official completed-period adoption table',
 'la-starlink-adoption':'Privacy-safe official completed-period LEO adoption table',
 'mt-bead-quarter':'Completed public project-quarter table',
 'hanford-mass-balance':'Stable-identity transfer, receipt, and disposition evidence chain',
 'nnsa-qualified-rate':'Official site-period recurring qualified-output table',
 'nnsa-accepted-capacity':'Official site-period installed, qualified, and accepted capacity table',
 'nnsa-gao-baseline':'GAO recommendation-status record with responsive agency evidence',
};
assert.equal(tDocs.filter(r=>r.content_type==='Research docket').length,9);
for(const r of tDocs){
 const original=JSON.parse(await read(`src/content/${r.source_file}`));assert.equal(original.publication_date,'2026-08-09');assert.equal(original.captured_date,'2026-08-09');assert.match(r.correction.summary,/August 9/);
 if(r.content_type==='Research docket'){
  assert.match(r.correction.summary,/92 synthetic cases/);assert.match(r.correction.summary,/does not exist/);assert.equal(r.prior.document_type,'Technical Report');
  const target=reopeningTargets[r.id.replace('research-doc-57t-preserved-','')];assert(target);assert(r.prior.key_findings.includes('Next action: '+target));assert(r.correction.key_findings.includes(`Historical reopening request (August 9): ${target}.`));
 }
}
const tFindings=suffix=>tDocs.find(r=>r.id===`research-doc-57t-amtrak-pids-${suffix}`).correction.key_findings.join(' ');
assert.match(tFindings('canonical-reader-verification-endpoint'),/matching entity tag/);
assert.match(tFindings('signed-release-index-chain'),/without erasing earlier indexes/);
assert.match(tFindings('cache-coherence-receipt-fail-closed'),/Serve-stale-on-error and warning-only mismatch responses are prohibited/);
assert.match(tFindings('mirror-redirect-integrity-control'),/single permanent redirect/);assert.match(tFindings('mirror-redirect-integrity-control'),/never becomes lifecycle authority/);
assert.match(tFindings('immutable-history-recovery-drill'),/state remains inactive until separate human verification/);
if(JSON.parse(evidenceText).as_of_date==='2026-09-15')assert.equal(hash(evidenceText),pins57t.current_evidence_hash,'57T attribution changed actual evidence decisions');
const rsExpectations=[
 {key:'57s',total:50,overall:450,groups:[['reader-verifiable-complete-lifecycle-manifest',16,5,11],['status-freshness-partial-view-fail-closed',16,4,12],['complete-provenance-export-snapshot',18,6,12]],overview:'digest-chain-reconciliation-zero-rewrite'},
 {key:'57r',total:44,overall:396,groups:[['reader-facing-current-publication-status-registry',14,6,8],['immutable-public-change-notice',14,6,8],['restore-republication-new-receipt-and-bundle',16,6,10]],overview:'complete-provenance-timeline-zero-state-inflation'},
];
for(const e of rsExpectations){
 const rows=documents.filter(r=>r.id.startsWith(`research-doc-${e.key}-`));assert.equal(rows.length,45);assert.equal(rows.filter(r=>r.content_type==='FTFN method/test note').length,36);
 assert.equal(e.groups.reduce((sum,r)=>sum+r[1],0),e.total);assert.equal(e.total*9,e.overall);
 for(const[suffix,total,valid,rejected]of e.groups){const group=rows.filter(r=>r.id.endsWith(suffix));assert.equal(group.length,9);for(const r of group){assert.match(r.correction.summary,new RegExp(`${total} synthetic`));assert(r.correction.summary.includes({4:'four',5:'five',6:'six'}[valid]));assert(r.correction.summary.includes(String(rejected)));assert.equal(r.prior.document_type,'Data Release');}}
 const overview=rows.filter(r=>r.id.endsWith(e.overview));assert.equal(overview.length,9);
 for(const r of overview){assert(r.correction.summary.includes(`not ${e.total} additional cases`));assert(r.correction.key_findings.some(s=>s.includes('not a fourth additive test group')));assert.equal(r.prior.document_type,'Data Release');}
 for(const r of rows){
  const original=JSON.parse(await read(`src/content/${r.source_file}`));assert.equal(original.publication_date,'2026-08-09');assert.equal(original.captured_date,'2026-08-09');assert.match(r.correction.summary,/August 9/);
  if(r.content_type==='Research docket'){const target=reopeningTargets[r.id.replace(`research-doc-${e.key}-preserved-`,'')];assert(target);assert.equal(r.prior.document_type,'Technical Report');assert(r.prior.key_findings.includes('Next action: '+target));assert(r.correction.key_findings.includes(`Historical reopening request (August 9): ${target}.`));assert(r.correction.summary.includes(`${e.total} synthetic cases`));assert(r.correction.summary.includes('does not exist'));}
 }
 const findings=suffix=>rows.find(r=>r.id===`research-doc-${e.key}-amtrak-pids-${suffix}`).correction.key_findings.join(' ');
 if(e.key==='57s'){assert.match(findings(e.groups[1][0]),/warning-only response is insufficient/);assert.match(findings(e.groups[2][0]),/Prior exports remain immutable/);assert.match(findings(e.overview),/does not automatically correct evidence/);}
 else {assert.match(findings(e.groups[0][0]),/view over history, not a publication event/);assert.match(findings(e.groups[2][0]),/Withdrawn authorization and stale bundles cannot be reused/);assert.match(findings(e.overview),/not evidence acquisition or reviewer acceptance/);}
 const briefing=ledger.records.find(r=>r.id===`briefing-${attributionTranches.find(t=>t.key===e.key).briefing_slug}`);assert(briefing.correction.summary.includes(String(e.overall)));assert(briefing.correction.top_takeaways.some(s=>s.includes('not a fourth additive test group')));
}
const rNnsa=documents.filter(r=>/^research-doc-57r-(preserved-)?nnsa-/.test(r.id));assert.equal(rNnsa.length,15);for(const r of rNnsa){assert.equal(r.prior.publisher,'National Nuclear Security Administration');assert.equal(r.inherited_publisher_label,r.prior.publisher);assert.equal(r.correction.publisher,'FTFN');}
if(JSON.parse(evidenceText).as_of_date==='2026-09-15')assert.equal(hash(evidenceText),pins57rs.current_evidence_hash,'57R/S attribution changed actual evidence decisions');
for(const[key,count,total]of [['57q',45,44],['57p',29,37]]){
 const rows=documents.filter(r=>r.id.startsWith(`research-doc-${key}-`));assert.equal(rows.length,count);
 assert.equal(rows.filter(r=>r.content_type==='Research docket').length,9);
 for(const r of rows){
  const d=JSON.parse(await read(`src/content/${r.source_file}`));
  assert.equal(d.publication_date,'2026-08-09');assert.equal(d.captured_date,'2026-08-09');assert.equal(r.inherited_publisher_label,d.publisher);assert.match(r.correction.summary,/August 9/);
  const expected=[`Title: ${d.title}`,`Publisher: ${d.publisher}`,`Publication date: ${d.publication_date}`,`Official URL: ${d.official_url}`,`Capture status: ${d.capture_status}`,`Record status: ${d.record_status}`,`Captured by FTFN: ${d.captured_date}`,'',`Boundary: ${d.evidence_limits.join(' ')}`,'','Supporting public artifacts:',...d.supporting_official_urls.map(u=>'- '+u)].join('\n');
  assert.equal((await read('public'+d.local_capture_path)).replace(/^\uFEFF/,'').replace(/\r\n/g,'\n').trimEnd(),expected);
  assert(d.evidence_limits.join(' ').includes('1 Closed / 21 Partially Closed / 2 Open'));
  if(r.content_type==='Research docket'){
   const target=reopeningTargets[r.id.replace(`research-doc-${key}-preserved-`,'')];assert(target);assert.equal(d.record_status,'In Review');assert.equal(r.prior.document_type,'Technical Report');
   assert(r.prior.key_findings.includes('Next action: '+target));assert(r.correction.key_findings.includes(`Historical reopening request (August 9): ${target}.`));assert(r.correction.summary.includes(`${total} synthetic cases`));assert(r.correction.summary.includes('does not exist'));
  }else{assert.equal(d.record_status,'Published');assert.equal(r.prior.document_type,'Data Release');}
 }
}
const qDocs=documents.filter(r=>r.id.startsWith('research-doc-57q-'));
for(const[suffix,total,valid,rejected]of [['twelve-item-manual-release-authorization-checklist',14,'one',13],['immutable-publication-bundle-manifest',14,'one',13],['withdrawal-rollback-and-supersession-receipts',16,'six',10]]){
 const rows=qDocs.filter(r=>r.id.endsWith(suffix));assert.equal(rows.length,9);
 for(const r of rows){assert(r.correction.summary.includes(`${total} synthetic`));assert(r.correction.summary.includes(valid));assert(r.correction.summary.includes(String(rejected)));}
}
assert.equal((14+14+16)*9,396);
for(const r of qDocs.filter(r=>r.id.endsWith('zero-actual-release-publication-withdrawal-or-rollback-events')))assert(r.correction.summary.includes('not 44 additional cases'));
const qFind=s=>qDocs.find(r=>r.id===`research-doc-57q-amtrak-pids-${s}`).correction.key_findings.join(' ');
assert.match(qFind('twelve-item-manual-release-authorization-checklist'),/distinct from both evidence and publication reviewers/);
assert.match(qFind('twelve-item-manual-release-authorization-checklist'),/cannot publish automatically/);
assert.match(qFind('immutable-publication-bundle-manifest'),/Hash integrity does not establish claim truth/);
assert.match(qFind('withdrawal-rollback-and-supersession-receipts'),/Only current availability may change/);
const pDocs=documents.filter(r=>r.id.startsWith('research-doc-57p-'));assert.equal(pDocs.filter(r=>r.content_type==='FTFN method/test note').length,20);
let pTotal=0;
for(const[cohort,n]of [['amtrak',2],['broadband',3],['hanford',1],['nnsa',3]]){
 const rows=pDocs.filter(r=>r.id.startsWith(`research-doc-57p-${cohort}-`));assert.equal(rows.length,5);
 const bySuffix=s=>rows.find(r=>r.id.endsWith(s));
 const schema=bySuffix(`${n}-append-only-dual-review-audit-chain-schemas`);assert(schema.correction.summary.includes('not an additional case group'));
 const audit=bySuffix(`${9*n}-audit-chain-integrity-cases`);assert(audit.correction.summary.includes(`${9*n} synthetic`));assert(audit.correction.summary.includes('No unreported valid/rejected split is inferred'));
 const pub=bySuffix(`${18*n}-publication-review-decision-receipt-cases`);assert(pub.correction.summary.includes(`${6*n} valid`));assert(pub.correction.summary.includes(`${12*n} incompatible-reason`));assert.match(pub.correction.key_findings.join(' '),/Publication-review attribution remains distinct/);
 const adjudication=bySuffix(`${10*n}-cross-role-adjudication-cases`),text=adjudication.correction.key_findings.join(' ');
 assert(adjudication.correction.summary.includes(`${10*n} synthetic`));assert(text.includes(`${n} concordant accept`));assert(text.includes(`${5*n} disagreements`));assert(text.includes(`${n} later decisions`));assert(text.includes('not an exhaustive case partition'));assert(text.includes('third human escalation owner'));assert(text.includes('Even dual accept requires separate manual release authorization'));
 const overview=bySuffix('zero-actual-audit-adjudication-release-or-publication-events');assert(overview.correction.summary.includes(`not ${37*n} additional cases`));pTotal+=37*n;
}
assert.equal(pTotal,333);
for(const[key,count,overall]of [['57q',45,396],['57p',29,333]]){
 const t=attributionTranches.find(t=>t.key===key),b=ledger.records.find(r=>r.id===`briefing-${t.briefing_slug}`);assert.equal(t.reviews.records.length,count+1);assert(b.correction.summary.includes(String(overall)));assert(b.correction.top_takeaways.some(s=>s.includes('do not add test cases')));
}
assert(ledger.records.find(r=>r.id==='briefing-research-watch-046-dual-review-audit-chains-adjudication-publication-receipts').correction.summary.includes('two Amtrak, three broadband, one Hanford and three NNSA'));
// The original method profiles carry full cohort links; do not replace them with
// later single-source profiles or homogenize agency publisher labels.
for(const[key,cohort,suffix,n]of [['57q','amtrak-pids','immutable-publication-bundle-manifest',3],['57p','broadband','3-append-only-dual-review-audit-chain-schemas',11],['57p','hanford','1-append-only-dual-review-audit-chain-schemas',12],['57p','nnsa','3-append-only-dual-review-audit-chain-schemas',10]]){
 const r=documents.find(r=>r.id===`research-doc-${key}-${cohort}-${suffix}`),d=JSON.parse(await read(`src/content/${r.source_file}`));assert.equal(d.supporting_official_urls.length,n);assert.equal(d.supporting_source_ids.length,n);
}
for(const key of ['57p','57q']){const r=documents.find(r=>r.id===`research-doc-${key}-preserved-nnsa-gao-baseline`);assert.equal(r.prior.publisher,'U.S. Government Accountability Office');assert.equal(r.inherited_publisher_label,r.prior.publisher);}
if(JSON.parse(evidenceText).as_of_date==='2026-09-15')assert.equal(hash(evidenceText),pins57pq.current_evidence_hash,'57Q/P attribution changed actual evidence decisions');
await import('./assert-current-reference-attribution-57no.mjs');
await import('./assert-current-reference-attribution-57m.mjs');
await import('./assert-current-reference-attribution-57l.mjs');
await import('./assert-current-reference-attribution-56t.mjs');
await import('./assert-current-reference-attribution-57k.mjs');
await import('./assert-current-reference-attribution-57j.mjs');
await import('./assert-current-reference-attribution-57i.mjs');
await import('./assert-current-reference-attribution-57h.mjs');
await import('./assert-current-reference-attribution-57g.mjs');
await import('./assert-current-reference-attribution-56gh.mjs');
console.log('Reference attribution passed: 839 documents + 22 briefings; 838 unchanged earlier reviews; exact raw/download hashes; 536 method notes + 191 historical dockets + 112 analyses; FTFN assessments are not synthetic tests, agency outcomes or GAO acceptance. Linked signals, dates and real evidence receipts preserved. No full production acceptance.');
