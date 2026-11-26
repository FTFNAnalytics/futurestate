import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import ledger from '../src/data/phase-60-current-decisions.json' with {type:'json'};
import cycle from '../src/data/phase-60-operating-cycle.json' with {type:'json'};
import named from '../src/data/phase-61-project-conversion-registry.json' with {type:'json'};
import {prepareReliabilityRateFollowups} from './lib/reliability-rate-followups.mjs';
import {receiptPayloadHash as hash} from './lib/bounded-cycle-followup.mjs';
import {evidenceReviewDate,priorLedgerSnapshot,priorLedgerSha256,reliabilityRateReviews,predecessorPins} from './content-205-216/november-26-reliability-rate-reviews.mjs';
import {currentDecisionFor,projectEvidenceRecord,evidenceReceiptsForRecord,evidenceReceiptsForRoute,projectNamedFile} from '../src/lib/current-evidence.mjs';
import {computeV1refCandidateDigest} from './lib/v1ref-candidate-digest.mjs';
import {retainedNovemberLedgerInput} from './lib/retained-november-ledger-input.mjs';
const before=JSON.stringify({ledger,cycle,named});
const historicalPin={path:'src/data/phase-60-current-decisions.json',sha256:'3d39efa26c08b1964c13f212849569e00504ac2b191ccc256b5ad9fcab634b63'};
const retained=retainedNovemberLedgerInput(historicalPin,JSON.stringify(ledger));
assert.equal(JSON.parse(retained).receipts.length,21);assert.equal(JSON.parse(retained).as_of_date,'2026-11-21');
for(const mutate of [l=>l.receipts[0].next_check_date='2027-01-01',l=>l.receipts.splice(0,1),l=>l.publication_boundary='changed']){const l=structuredClone(ledger);mutate(l);assert.throws(()=>retainedNovemberLedgerInput(historicalPin,JSON.stringify(l)));}
assert.equal(retainedNovemberLedgerInput({...historicalPin,path:'unrelated'},'exact raw text'),'exact raw text');
assert.equal(retainedNovemberLedgerInput({...historicalPin,sha256:'unrecognized'},'exact raw text'),'exact raw text');
const bound=await computeV1refCandidateDigest();
for(const path of ['scripts/content-205-216/november-26-reliability-rate-reviews.mjs','scripts/lib/reliability-rate-followups.mjs','scripts/prepare-november-26-reliability-rate-followups.mjs','scripts/assert-november-26-reliability-rate-followups.mjs',...reliabilityRateReviews.map(r=>'src/content/updates/'+r.update_id.replace(/^update-/,'')+'.json')])assert(bound.artifact_paths.includes(path),'Unbound follow-up artifact '+path);
assert.equal(hash(priorLedgerSnapshot(ledger)),priorLedgerSha256);
const receipts=await prepareReliabilityRateFollowups({asOfDate:evidenceReviewDate});
for(const [i,r]of receipts.entries()){
 assert.deepEqual(ledger.receipts.find(p=>p.receipt_id===r.receipt_id),r);
 assert.deepEqual([r.propagation_targets.length,r.affected_record_ids.length,r.affected_routes.length],i===0?[396,394,402]:[572,570,578]);
 assert.equal(r.scheduled_check_date,'2026-10-09');assert.equal(r.follow_up_scheduled_date,'2026-11-25');assert.equal(r.source_checked_date,evidenceReviewDate);assert.equal(r.next_check_date,'2026-12-26');
 assert.equal(r.prior_receipt_id,predecessorPins[i][0]);assert.equal(r.prior_receipt_artifact_digest,predecessorPins[i][1]);
 assert.equal(r.counts_as_cycle_decision,true);assert.equal(r.underlying_signal_status,'In Review');assert.equal(r.publication_authorized,false);assert.equal(r.independent_stage_admission,false);
 assert.deepEqual(r.named_file_ids,[]);assert.deepEqual(r.qualification_packet_ids,[]);
 assert.equal(currentDecisionFor({cycle_item_id:r.cycle_item_id},'2026-11-25').receipt_id,r.prior_receipt_id);
 assert.equal(currentDecisionFor({cycle_item_id:r.cycle_item_id}).receipt_id,r.receipt_id);
 for(const id of r.affected_record_ids)assert(evidenceReceiptsForRecord(id).some(p=>p.receipt_id===r.receipt_id));
 for(const route of r.affected_routes)assert(evidenceReceiptsForRoute(route).some(p=>p.receipt_id===r.receipt_id));
 for(const file of named.records)assert(!JSON.stringify(projectNamedFile(file)).includes(r.receipt_id));
 const update=JSON.parse(await readFile(new URL('../src/content/updates/'+r.update_id.replace(/^update-/,'')+'.json',import.meta.url),'utf8'));
 assert.equal(update.receipt_id,r.receipt_id);assert.deepEqual(update.affected_record_ids,r.affected_record_ids);assert.deepEqual(update.related_paths,r.affected_routes);
 const base=cycle.records.find(p=>p.cycle_item_id===r.cycle_item_id);assert.equal(projectEvidenceRecord(base).scheduled_check_date,base.scheduled_check_date);
}
assert.equal(new Set(receipts.map(r=>r.cycle_item_id)).size,2);assert.equal(new Set(receipts.map(r=>r.envelope_id)).size,2);
assert.equal(cycle.records.length,13);assert.equal(cycle.records.map(r=>projectEvidenceRecord(r)).filter(r=>r.receipt_id&&r.decision_date).length,13);
await assert.rejects(()=>prepareReliabilityRateFollowups({asOfDate:'2026-11-25'}));
await assert.rejects(()=>prepareReliabilityRateFollowups({asOfDate:evidenceReviewDate,ledger:{...ledger,receipts:ledger.receipts.map((r,i)=>i===0?{...r,next_check_date:'2027-01-01'}:r)}}));
for(const mutation of [{named_file_ids:['invented']},{decision_date:'2026-11-25'},{follow_up_scheduled_date:'2026-10-09'},{decision_status:'material_change'}]){const reviews=structuredClone(reliabilityRateReviews);Object.assign(reviews[0],mutation);await assert.rejects(()=>prepareReliabilityRateFollowups({asOfDate:evidenceReviewDate,reviews}));}
assert.equal(JSON.stringify({ledger,cycle,named}),before);
console.log('Two November 26 follow-ups passed: twenty-one predecessor receipts exact; thirteen identities; separate reliability/rate watches due December 26; no named-file or qualification transfer.');
