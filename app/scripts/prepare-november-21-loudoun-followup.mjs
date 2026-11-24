// Read-only one-off preparation after actual inspection. --patch emits, never applies.
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {fileURLToPath} from 'node:url';
import {join} from 'node:path';
import {prepareBoundedCycleFollowup,receiptPayloadHash} from './lib/bounded-cycle-followup.mjs';
import {evidenceReviewDate,priorLedgerPayloadSha256,priorLedgerSnapshot,loudounFollowup} from './content-205-216/loudoun-november-21-review.mjs';
const root=fileURLToPath(new URL('../',import.meta.url));
const raw=await readFile(join(root,'src/data/phase-60-current-decisions.json'),'utf8'),ledger=JSON.parse(raw);
assert.equal(receiptPayloadHash(priorLedgerSnapshot(ledger)),priorLedgerPayloadSha256,'All eleven previous receipts and metadata must remain intact');
const asOfDate=new Intl.DateTimeFormat('en-CA',{timeZone:'America/Edmonton',year:'numeric',month:'2-digit',day:'2-digit'}).format(new Date());
const receipt=prepareBoundedCycleFollowup(ledger,loudounFollowup,{asOfDate});
const baseline=JSON.parse(await readFile(join(root,'src/data/phase-60-operating-cycle.json'),'utf8')).records.find(r=>r.cycle_item_id===receipt.cycle_item_id);
assert.equal(receipt.scheduled_check_date,baseline.scheduled_check_date);assert.equal(receipt.exact_next_artifact,baseline.exact_next_artifact);
const update={id:receipt.update_id,effective_date:evidenceReviewDate,entry_type:'Source Refresh',title:receipt.update_title,summary:receipt.bounded_finding,affected_record_ids:receipt.affected_record_ids,related_paths:receipt.affected_routes,evidence_note:receipt.evidence_boundary,receipt_id:receipt.receipt_id,source_checked_date:receipt.source_checked_date,decision_date:receipt.decision_date,scheduled_check_date:receipt.scheduled_check_date,follow_up_scheduled_date:receipt.follow_up_scheduled_date,prior_receipt_id:receipt.prior_receipt_id,receipt_type:receipt.receipt_type,materiality:'Watch posture change',publication_effect:'Local dated follow-up on the existing Loudoun identity. The signal remains In Review; named-project and qualification states are unchanged. Production validation and Git-backed release remain held.',next_check_date:receipt.next_check_date,work_package:'docs/work-packages/phase-207-dated-evidence-operations-and-source-currency.md'};
if(process.argv.includes('--json'))console.log(JSON.stringify({receipt,update}));
else if(process.argv.includes('--patch')){
 const patch=['*** Begin Patch'];
 if(!ledger.receipts.some(r=>r.receipt_id===receipt.receipt_id)){
  const old=raw.trimEnd().split(/\r?\n/),tail=old.slice(-5).join('\n');
  const next=tail.replace(/\n    }\n  \]\n}$/, '\n    },\n'+JSON.stringify(receipt,null,2).split('\n').map(l=>'    '+l).join('\n')+'\n  ]\n}');assert.notEqual(next,tail);
  patch.push('*** Update File: app/src/data/phase-60-current-decisions.json','@@','-  "as_of_date": '+JSON.stringify(ledger.as_of_date)+',','+  "as_of_date": '+JSON.stringify(evidenceReviewDate)+',','@@',...tail.split('\n').map(l=>'-'+l),...next.split('\n').map(l=>'+'+l));
 }
 const updatePath='src/content/updates/'+receipt.update_id.replace(/^update-/,'')+'.json';
 let existing;try{existing=JSON.parse(await readFile(join(root,updatePath),'utf8'));}catch(error){if(error.code!=='ENOENT')throw error;}
 if(existing)assert.deepEqual(existing,update,'Refusing to replace a dated update');
 else patch.push('*** Add File: app/'+updatePath,...JSON.stringify(update,null,2).split('\n').map(l=>'+'+l));
 patch.push('*** End Patch');console.log(patch.join('\n'));
}else console.log(JSON.stringify({receipt:receipt.receipt_id,original_schedule:receipt.scheduled_check_date,follow_up:receipt.follow_up_scheduled_date,inspection:evidenceReviewDate,next:receipt.next_check_date,assigned_targets:receipt.propagation_targets.length,routes:receipt.affected_routes.length,files:['src/data/phase-60-current-decisions.json','src/content/updates/'+receipt.update_id.replace(/^update-/,'')+'.json']},null,2));
