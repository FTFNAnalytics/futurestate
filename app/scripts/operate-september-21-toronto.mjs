// Explicit operation following actual research. Not part of current:generate.
import {createHash} from 'node:crypto';
import {readFile,readdir,mkdir,writeFile} from 'node:fs/promises';
import {join} from 'node:path';
import {fileURLToPath} from 'node:url';
import {torontoSeptember21Review as review} from './content-205-216/toronto-september-21-review.mjs';
const root=fileURLToPath(new URL('../',import.meta.url));
const read=async path=>JSON.parse(await readFile(join(root,path),'utf8'));
const hash=value=>createHash('sha256').update(JSON.stringify(value)).digest('hex');
const ops=await read('src/data/phase-207-current-operations.json');
const prior=ops.receipts.find(r=>r.receipt_id===review.prior_receipt_id);
if(prior?.sha256!=='c1dd2323581bf7d38d0e336a16a3fc04a0bfcf5a99320b154f633d6aad9566f7')throw new Error('Original Toronto receipt changed');
const {sha256:priorHash,...priorPayload}=prior;
if(hash(priorPayload)!==priorHash||prior.next_check_date!==review.scheduled_date)throw new Error('Receipt or due appointment mismatch');
const now=new Intl.DateTimeFormat('en-CA',{timeZone:'America/Edmonton',year:'numeric',month:'2-digit',day:'2-digit'}).format(new Date());
if(review.checked_date>now||review.next_check_date<=review.checked_date)throw new Error('Invalid actual inspection/follow-up date');
const registry=await read('src/data/phase-61-project-conversion-registry.json');
const file=registry.records.find(r=>r.file_id===review.file_id);
const packets=(await read('src/data/phase-67-qualification-packet-registry.json')).packet_records.filter(r=>r.file_id===file.file_id);
const returns=(await read('src/data/phase-67-evidence-return-envelope-ledger.json')).envelope_records;
if(returns.some(r=>r.named_file_id===file.file_id||r.file_id===file.file_id))throw new Error('Review unexpected same-file return binding');
const ids=new Set([...prior.affected_record_ids,review.desk_item_id,review.conversion_gate_id,
  'briefing-outcomes-watch-001-what-actually-changed','briefing-evidence-cycle-001-operating-baseline',
  ...packets.flatMap(p=>[p.packet_id,p.acceptance_briefing_id,p.qualification_playbook_id,...p.dependency_map_ids])]);
const matches=[...file.source_ids,...file.signal_ids];
const targets=[];
const folders=[['sources','/atlas/sources/'],['signals','/signals/'],['briefings','/briefings/'],['dependency-maps','/atlas/dependency-maps/'],['local-systems','/atlas/local-systems/'],['evidence-gaps','/atlas/evidence-gaps/'],['reader-pathways','/pathways/'],['research-documents','/research/documents/']];
for(const [folder,prefix]of folders)for(const name of (await readdir(join(root,'src/content',folder))).filter(n=>/\.(json|mdx)$/.test(n)).sort()){
  const raw=await readFile(join(root,'src/content',folder,name),'utf8');
  const row=name.endsWith('.json')?JSON.parse(raw):{id:raw.match(/^id: "([^"]+)"/m)?.[1],slug:raw.match(/^slug: "([^"]+)"/m)?.[1]};
  if(!ids.has(row.id)&&!matches.some(id=>raw.includes(JSON.stringify(id))))continue;
  if(!row.id||(folder!=='sources'&&!row.slug))throw new Error(`Unresolved target ${name}`);
  targets.push({record_id:row.id,route:`${prefix}${folder==='sources'?row.id:row.slug}/`,relation:ids.has(row.id)?'Assigned same-file context; original decisions retained':'Exact source/signal reference; contextual notice only'});
}
for(const row of (await read('src/data/phase-205-216-current-editorial.json')).records)if(ids.has(row.record_id)||matches.some(id=>JSON.stringify(row).includes(JSON.stringify(id))))targets.push({record_id:row.record_id,route:row.route,relation:'Related reader account; independent acceptance unchanged'});
for(const packet of packets)targets.push({record_id:packet.packet_id,route:`/evidence/qualification/${packet.slug}/`,relation:'Same-file context only; qualification decision unchanged'});
const affectedIds=[...new Set([...ids,...targets.map(t=>t.record_id)])];
const affectedRoutes=[...new Set([...prior.affected_routes,...targets.map(t=>t.route),'/data/current-operations.json','/data/phase-60c-editorial-desk.json','/data/conversion-gates.json','/data/conversion-stage-matrix.json','/data/conversion-events.json','/data/qualification-packets.json'])];
const payload={...review,source_ids:file.source_ids,checked_source_ids:['source-toronto-2026-sc33-9-item-history'],context_only_source_ids:['source-toronto-development-pipeline-2025'],qualification_packet_ids:packets.map(p=>p.packet_id),propagation_targets:targets,affected_record_ids:affectedIds,affected_routes:affectedRoutes,git_backed_release_status:'held',history_boundary:'September 14 receipt and all baseline event, stage, packet, source-profile and signal decisions retained. This separate dated recheck neither adds to the thirteen-item cycle nor admits a qualification stage.'};
const receipt={...payload,sha256:hash(payload)};
const dir=join(root,'src/data/phase-207-project-checks');
await mkdir(dir,{recursive:true});
const path=join(dir,`${receipt.receipt_id}.json`);
try{const existing=JSON.parse(await readFile(path,'utf8'));if(hash(existing)!==hash(receipt))throw new Error('Refusing to rewrite a dated Toronto receipt');}
catch(error){if(error.code!=='ENOENT')throw error;await writeFile(path,JSON.stringify(receipt,null,2)+'\n');}
const update={id:receipt.update_id,effective_date:receipt.checked_date,entry_type:'Source Refresh',title:'Toronto 24 254930: September 21 bounded project-file recheck',summary:receipt.bounded_finding,affected_record_ids:receipt.affected_record_ids,related_paths:receipt.affected_routes,evidence_note:receipt.history_boundary,receipt_id:receipt.receipt_id,source_checked_date:receipt.checked_date,decision_date:receipt.checked_date,scheduled_check_date:receipt.scheduled_date,receipt_type:receipt.receipt_type,materiality:'No record-state change',publication_effect:'Local candidate evidence note only; no Git publication, permit, independent admission or launch approval',next_check_date:receipt.next_check_date,work_package:'docs/work-packages/phase-207-dated-evidence-operations-and-source-currency.md'};
await writeFile(join(root,`src/content/updates/${receipt.update_id.replace(/^update-/,'')}.json`),JSON.stringify(update,null,2)+'\n');
console.log(`Preserved additive Toronto receipt ${receipt.sha256}; ${targets.length} contextual targets; no new cycle gate or qualification admission.`);
