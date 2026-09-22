import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {createHash} from 'node:crypto';
import tranche from './content-205-216/reference-attribution-57x-reviews.mjs';
import pins from './content-205-216/reference-attribution-57x-inputs.json' with {type:'json'};
import {projectResearchDocument,projectBriefing,referenceAttributionUpdateFor} from '../src/lib/reference-attribution.mjs';
import {currentEvidenceLedger,evidenceReceiptsForRecord} from '../src/lib/current-evidence.mjs';
const read=path=>readFile(new URL(`../${path}`,import.meta.url),'utf8');
const hash=raw=>createHash('sha256').update(raw).digest('hex');
const docs=tranche.records.filter(r=>r.record_kind==='research_document');
assert.equal(docs.length,63);assert.equal(tranche.records.length,64);
assert.equal(tranche.as_of_date,'2026-09-15');
const families=[['federation-health-budgets-partition-policy',30,8,22],['independent-witness-diversity-audits',28,7,21],['fork-adjudication-appeal-receipts',30,8,22],['cross-authority-time-corroboration',27,7,20],['verifier-vulnerability-disclosure-patch-provenance',30,8,22],['legacy-artifact-decommission-reader-rollback-notification',32,8,24]];
for(const [suffix,total,valid,rejected]of families){
 const rows=docs.filter(r=>r.id.endsWith(suffix));assert.equal(rows.length,9);
 for(const r of rows){assert.match(r.correction.summary,new RegExp(`${total} synthetic`));assert(r.correction.summary.includes(String(rejected)));assert(r.correction.summary.includes(valid===7?'seven':'eight'));assert.match(r.correction.title,/^FTFN /);assert.equal(r.content_type,'FTFN method/test note');}
}
for(const r of docs){
 const raw=await read(`src/content/${r.source_file}`),prior=JSON.parse(raw),pin=pins.docs.find(p=>p.id===r.id);
 assert.equal(hash(raw),pin.reviewed_source_sha256);assert.equal(prior.title,pin.title);assert.equal(prior.publisher,pin.publisher);assert.equal(prior.official_url,pin.official_url);
 assert.equal(hash(await read('public'+pin.download)),pin.download_sha256);
 assert.equal(referenceAttributionUpdateFor(r.id),'update-2026-09-15-reference-attribution-57x');
 const current=projectResearchDocument({data:prior}).data;
 assert.equal(current.local_capture_path,`/downloads/editorial-attribution-2026-09-15/${r.id}.txt`);
 assert.equal(current.record_status,prior.record_status);assert.equal(current.captured_date,'2026-08-10');assert.equal(current.publication_date,'2026-08-10');
 assert(current.evidence_limits.some(v=>v.includes('not newly verified')));
 assert(current.evidence_limits.some(v=>v.includes('source records, publication state and dates remain unchanged')));
 if(r.id.includes('-preserved-')){assert.equal(r.content_type,'Research docket');assert.equal(prior.record_status,'In Review');assert.match(current.summary,/177 synthetic cases/);assert.match(current.summary,/August 10/);assert.match(current.summary,/does not exist/);}
}
assert.equal(docs.filter(r=>r.content_type==='Research docket').length,9);
assert.equal(families.reduce((sum,r)=>sum+r[1],0)*9,1593);
const briefing=tranche.records.find(r=>r.record_kind==='briefing');
assert.equal(hash(await read(`src/content/${briefing.source_file}`)),briefing.reviewed_source_sha256);
const original={data:{id:briefing.id,record_status:'Published',captured_date:'2026-08-10'}},current=projectBriefing(original);
assert.equal(current.data.captured_date,original.data.captured_date);assert.equal(current.data.record_status,original.data.record_status);assert.match(current.data.summary,/1,593 synthetic cases/);
assert.match(current.data.claim_scope,/Internal FTFN/);
const la=docs.find(r=>r.id==='research-doc-57x-la-nextlink-adoption-federation-health-budgets-partition-policy');
assert.match(la.reason,/Montana planning material/);assert.match(la.reason,/not.*Louisiana subscription measurement/);
const mt=docs.find(r=>r.id==='research-doc-57x-preserved-mt-bead-quarter');
assert(!mt.correction.summary.includes('September 15'));
assert(evidenceReceiptsForRecord(mt.id).some(r=>r.receipt_id==='receipt-60-montana-2026-09-15-no-material-change'),'Later source receipt must remain separately accessible');
assert.equal(currentEvidenceLedger.receipts.filter(r=>r.decision_date<='2026-09-15').length,6);
const rawEvidence=await read('src/data/phase-60-current-decisions.json');
if(currentEvidenceLedger.as_of_date==='2026-09-15')assert.equal(hash(rawEvidence),pins.current_evidence_hash,'Attribution work changed an evidence decision');
console.log('57X attribution passed: 63 exact documents / 6 synthetic method families / 9 held dockets / 1 briefing; complete input/link pins, 1,593 historical cases, contextual-source distinctions and separate later Montana receipt. No external refresh, rerun or admission.');
