// Read-only preparation after real inspections. --patch emits, never applies.
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {prepareBoundedCycleFollowup,receiptPayloadHash} from './lib/bounded-cycle-followup.mjs';
import {evidenceReviewDate,priorLedgerPayloadSha256,priorLedgerSnapshot,montanaFollowup} from './content-205-216/montana-november-21-review.mjs';
const read=path=>readFile(new URL('../'+path,import.meta.url),'utf8');
const raw=await read('src/data/phase-60-current-decisions.json'),ledger=JSON.parse(raw);
assert.equal(receiptPayloadHash(priorLedgerSnapshot(ledger)),priorLedgerPayloadSha256,'All thirteen previous receipts and metadata must remain intact');
const asOfDate=new Intl.DateTimeFormat('en-CA',{timeZone:'America/Edmonton',year:'numeric',month:'2-digit',day:'2-digit'}).format(new Date());
const receipt=prepareBoundedCycleFollowup(ledger,montanaFollowup,{asOfDate});
const baseline=JSON.parse(await read('src/data/phase-60-operating-cycle.json')).records.find(r=>r.cycle_item_id===receipt.cycle_item_id);
assert.equal(receipt.scheduled_check_date,baseline.scheduled_check_date);assert.equal(receipt.exact_next_artifact,baseline.exact_next_artifact);
const update={id:receipt.update_id,effective_date:evidenceReviewDate,entry_type:'Source Refresh',title:receipt.update_title,summary:receipt.bounded_finding,affected_record_ids:receipt.affected_record_ids,related_paths:receipt.affected_routes,evidence_note:receipt.evidence_boundary,receipt_id:receipt.receipt_id,source_checked_date:receipt.source_checked_date,decision_date:receipt.decision_date,scheduled_check_date:receipt.scheduled_check_date,follow_up_scheduled_date:receipt.follow_up_scheduled_date,prior_receipt_id:receipt.prior_receipt_id,receipt_type:receipt.receipt_type,materiality:'Watch posture change',publication_effect:'Local follow-up on the same Montana identity. In Review and all 32 proposal-stage dossiers are retained without project-quarter or operating admission. Production validation and Git-backed release remain held.',next_check_date:receipt.next_check_date,work_package:'docs/work-packages/phase-207-dated-evidence-operations-and-source-currency.md'};
if(process.argv.includes('--patch')){
 const patch=['*** Begin Patch'];
 if(!ledger.receipts.some(r=>r.receipt_id===receipt.receipt_id)){
  const tail=raw.trimEnd().split(/\r?\n/).slice(-5).join('\n');
  const next=tail.replace(/\n    }\n  \]\n}$/, '\n    },\n'+JSON.stringify(receipt,null,2).split('\n').map(l=>'    '+l).join('\n')+'\n  ]\n}');assert.notEqual(next,tail);
  patch.push('*** Update File: app/src/data/phase-60-current-decisions.json','@@',...tail.split('\n').map(l=>'-'+l),...next.split('\n').map(l=>'+'+l));
 }
 const updatePath='src/content/updates/'+receipt.update_id.replace(/^update-/,'')+'.json';
 let existing;try{existing=JSON.parse(await read(updatePath));}catch(error){if(error.code!=='ENOENT')throw error;}
 if(existing)assert.deepEqual(existing,update,'Refusing to replace a dated update');
 else patch.push('*** Add File: app/'+updatePath,...JSON.stringify(update,null,2).split('\n').map(l=>'+'+l));
 patch.push('*** End Patch');console.log(patch.join('\n'));
}else console.log(JSON.stringify({receipt:receipt.receipt_id,digest:receipt.artifact_digest,targets:receipt.propagation_targets.length,ids:receipt.affected_record_ids.length,routes:receipt.affected_routes.length},null,2));
