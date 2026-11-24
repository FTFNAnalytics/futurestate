// Read-only preparation. Patch chunks go to apply_patch; this command never writes.
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {createHash} from 'node:crypto';
import {prepareBoundedTorontoProjectCheck,projectReceiptHash} from './lib/bounded-toronto-project-check.mjs';
import {torontoNovember21Review as review,priorOperationsSnapshot,priorOperationsPayloadSha256} from './content-205-216/toronto-november-21-review.mjs';
const json=async path=>JSON.parse(await readFile(new URL('../'+path,import.meta.url),'utf8'));
const operations=await json('src/data/phase-207-current-operations.json');
assert.equal(projectReceiptHash(priorOperationsSnapshot(operations)),priorOperationsPayloadSha256,'Earlier operations and metadata must remain exact');
const asOfDate=new Intl.DateTimeFormat('en-CA',{timeZone:'America/Edmonton',year:'numeric',month:'2-digit',day:'2-digit'}).format(new Date());
const receipt=prepareBoundedTorontoProjectCheck(operations,review,{asOfDate});
const file=(await json('src/data/phase-61-project-conversion-registry.json')).records.find(r=>r.file_id===review.file_id);
assert.equal(receipt.current_stage,file.current_stage);assert.equal(receipt.qualification_packet_ids.length,4);
const update={id:receipt.update_id,effective_date:receipt.checked_date,entry_type:'Source Refresh',title:receipt.update_title,summary:receipt.bounded_finding,affected_record_ids:receipt.affected_record_ids,related_paths:receipt.affected_routes,evidence_note:receipt.history_boundary,receipt_id:receipt.receipt_id,source_checked_date:receipt.checked_date,decision_date:receipt.checked_date,scheduled_check_date:receipt.scheduled_date,receipt_type:receipt.receipt_type,materiality:'Watch posture change',publication_effect:'Local dated blocker only; no project-stage change, permit, independent admission, production acceptance or publication authority',next_check_date:receipt.next_check_date,work_package:'docs/work-packages/phase-207-dated-evidence-operations-and-source-currency.md'};
const files=[['src/data/phase-207-project-checks/'+receipt.receipt_id+'.json',receipt],['src/content/updates/'+receipt.update_id.replace(/^update-/,'')+'.json',update]];
const lines=['*** Begin Patch'];
for(const [path,payload]of files){
 let existing;try{existing=await json(path);}catch(error){if(error.code!=='ENOENT')throw error;}
 if(existing)assert.deepEqual(existing,payload,'Refusing to replace a dated saved file');
 else lines.push('*** Add File: app/'+path,...JSON.stringify(payload,null,2).split('\n').map(line=>'+'+line));
}
lines.push('*** End Patch');const patch=lines.join('\n')+'\n',chunkSize=24000;
const chunk=process.argv.find(arg=>arg.startsWith('--patch-chunk='));
if(chunk){const index=Number(chunk.split('=')[1]);assert(Number.isInteger(index)&&index>=0);process.stdout.write(patch.slice(index*chunkSize,(index+1)*chunkSize));}
else console.log(JSON.stringify({receipt_id:receipt.receipt_id,receipt_sha256:receipt.sha256,targets:receipt.propagation_targets.length,routes:receipt.affected_routes.length,patch_characters:patch.length,patch_chunks:Math.ceil(patch.length/chunkSize),patch_sha256:createHash('sha256').update(patch).digest('hex'),files:files.map(([path])=>path)}));
