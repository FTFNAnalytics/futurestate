// Explicit operation after real research; never called by ordinary generation.
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import {readFile,readdir,writeFile} from 'node:fs/promises';
import {join} from 'node:path';
import {fileURLToPath} from 'node:url';
import {torontoSeptember28Review as review} from './content-205-216/toronto-september-28-review.mjs';
const root=fileURLToPath(new URL('../',import.meta.url));
const read=async path=>JSON.parse(await readFile(join(root,path),'utf8'));
const hash=value=>createHash('sha256').update(JSON.stringify(value)).digest('hex');
const ops=await read('src/data/phase-207-current-operations.json');
const prior=ops.receipts.find(r=>r.receipt_id===review.prior_receipt_id);
assert.equal(prior?.sha256,'5ba881ceb03e744a896558e2eb1a51f149845e56c51327ed85c587f95cc2a6ef');
const {sha256:priorHash,...priorPayload}=prior;
assert.equal(hash(priorPayload),priorHash);assert.equal(prior.next_check_date,review.scheduled_date);
const now=new Intl.DateTimeFormat('en-CA',{timeZone:'America/Edmonton',year:'numeric',month:'2-digit',day:'2-digit'}).format(new Date());
assert(review.checked_date<=now&&review.next_check_date>review.checked_date);
const file=(await read('src/data/phase-61-project-conversion-registry.json')).records.find(r=>r.file_id===review.file_id);
assert.equal(file.current_stage,review.current_stage);
const packets=(await read('src/data/phase-67-qualification-packet-registry.json')).packet_records.filter(r=>r.file_id===file.file_id);
const returns=(await read('src/data/phase-67-evidence-return-envelope-ledger.json')).envelope_records;
assert(!returns.some(r=>r.named_file_id===file.file_id||r.file_id===file.file_id));
const ids=new Set([...prior.affected_record_ids,...packets.flatMap(p=>[p.packet_id,p.acceptance_briefing_id,p.qualification_playbook_id,...p.dependency_map_ids])]);
const matches=[...file.source_ids,...file.signal_ids];
const targets=[];
const folders=[['sources','/atlas/sources/'],['signals','/signals/'],['briefings','/briefings/'],['dependency-maps','/atlas/dependency-maps/'],['local-systems','/atlas/local-systems/'],['evidence-gaps','/atlas/evidence-gaps/'],['reader-pathways','/pathways/'],['research-documents','/research/documents/']];
for(const [folder,prefix]of folders)for(const name of (await readdir(join(root,'src/content',folder))).filter(n=>/\.(json|mdx)$/.test(n)).sort()){
  const raw=await readFile(join(root,'src/content',folder,name),'utf8');
  const row=name.endsWith('.json')?JSON.parse(raw):{id:raw.match(/^id: "([^"]+)"/m)?.[1],slug:raw.match(/^slug: "([^"]+)"/m)?.[1]};
  if(!ids.has(row.id)&&!matches.some(id=>raw.includes(JSON.stringify(id))))continue;
  assert(row.id&&(folder==='sources'||row.slug),`Unresolved target ${name}`);
  targets.push({record_id:row.id,route:`${prefix}${folder==='sources'?row.id:row.slug}/`,relation:'Same-file/source context only; historical decision retained'});
}
for(const row of (await read('src/data/phase-205-216-current-editorial.json')).records)if(ids.has(row.record_id)||matches.some(id=>JSON.stringify(row).includes(JSON.stringify(id))))targets.push({record_id:row.record_id,route:row.route,relation:'Related reader account; no stage advancement'});
for(const packet of packets)targets.push({record_id:packet.packet_id,route:`/evidence/qualification/${packet.slug}/`,relation:'Same-file context; qualification unchanged'});
const payload={...review,source_ids:file.source_ids,checked_source_ids:['source-toronto-2026-sc33-9-item-history'],context_only_source_ids:['source-toronto-development-pipeline-2025'],qualification_packet_ids:packets.map(p=>p.packet_id),propagation_targets:targets,affected_record_ids:[...new Set([...ids,...targets.map(t=>t.record_id)])],affected_routes:[...new Set([...prior.affected_routes,...targets.map(t=>t.route)])],git_backed_release_status:'held',history_boundary:'September 14 and September 21 receipts remain intact. Their portal and permit observations are historical, not September 28 findings. This separate blocked recheck does not add a cycle gate, satisfy a condition or admit a qualification stage.'};
const receipt={...payload,sha256:hash(payload)};
const path=join(root,`src/data/phase-207-project-checks/${receipt.receipt_id}.json`);
try{assert.deepEqual(JSON.parse(await readFile(path,'utf8')),receipt,'Refusing to rewrite a dated receipt');}
catch(error){if(error.code!=='ENOENT')throw error;await writeFile(path,JSON.stringify(receipt,null,2)+'\n');}
const update={id:receipt.update_id,effective_date:receipt.checked_date,entry_type:'Source Refresh',title:'Toronto 24 254930: September 28 bounded access blocker',summary:receipt.bounded_finding,affected_record_ids:receipt.affected_record_ids,related_paths:receipt.affected_routes,evidence_note:receipt.history_boundary,receipt_id:receipt.receipt_id,source_checked_date:receipt.checked_date,decision_date:receipt.checked_date,scheduled_check_date:receipt.scheduled_date,receipt_type:receipt.receipt_type,materiality:'Watch posture change',publication_effect:'Local candidate blocker only; no Git publication, permit, independent admission or launch approval',next_check_date:receipt.next_check_date,work_package:'docs/work-packages/phase-207-dated-evidence-operations-and-source-currency.md'};
await writeFile(join(root,`src/content/updates/${receipt.update_id.replace(/^update-/,'')}.json`),JSON.stringify(update,null,2)+'\n');
console.log(`Saved ${receipt.receipt_id}: ${receipt.sha256}; ${receipt.affected_routes.length} routes; no cycle or qualification admission.`);
