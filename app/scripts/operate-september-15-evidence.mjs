// Explicit, one-off operation after actual source inspection; never part of current:generate.
import {createHash} from 'node:crypto';
import {readFile,readdir,writeFile} from 'node:fs/promises';
import {fileURLToPath} from 'node:url';
import {join} from 'node:path';
import {evidenceReviewDate,priorEvidenceReceiptPins,september15Reviews} from './content-205-216/september-15-evidence-reviews.mjs';
const root=fileURLToPath(new URL('../',import.meta.url));
const read=async path=>JSON.parse(await readFile(join(root,path),'utf8'));
const hash=value=>createHash('sha256').update(JSON.stringify(value)).digest('hex');
const now=new Intl.DateTimeFormat('en-CA',{timeZone:'America/Edmonton',year:'numeric',month:'2-digit',day:'2-digit'}).format(new Date());
if(now<evidenceReviewDate)throw new Error('Cannot record a future source inspection');
const ledger=await read('src/data/phase-60-current-decisions.json');
for(const [id,pin]of Object.entries(priorEvidenceReceiptPins))if(hash(ledger.receipts.find(r=>r.receipt_id===id))!==pin)throw new Error(`Historical receipt changed: ${id}`);
const cycle=await read('src/data/phase-60-operating-cycle.json');
const desk=await read('src/data/phase-60c-editorial-desk.json');
const program=await read('src/data/v031-content-expansion.json');
const returns=await read('src/data/phase-67-evidence-return-envelope-ledger.json');
const packets=await read('src/data/phase-67-qualification-packet-registry.json');
const atlas=await read('src/data/phase-119-deep-project-place-atlas.json');
const backlog=await read('src/data/phase-182-evidence-source-backlog.json');
const editorial=await read('src/data/phase-205-216-current-editorial.json');
const folders=[['sources','/atlas/sources/'],['signals','/signals/'],['briefings','/briefings/'],['dependency-maps','/atlas/dependency-maps/'],['local-systems','/atlas/local-systems/'],['evidence-gaps','/atlas/evidence-gaps/'],['reader-pathways','/pathways/'],['research-documents','/research/documents/']];
const content=[];
for(const [folder,prefix]of folders)for(const name of (await readdir(join(root,'src/content',folder))).filter(n=>/\.(json|mdx)$/.test(n)).sort()){
  const raw=await readFile(join(root,'src/content',folder,name),'utf8');
  const row=name.endsWith('.json')?JSON.parse(raw):{id:raw.match(/^id: "([^"]+)"/m)?.[1],slug:raw.match(/^slug: "([^"]+)"/m)?.[1]};
  content.push({id:row.id,route:`${prefix}${folder==='sources'?row.id:row.slug}/`,raw});
}
const receipts=[];
for(const review of september15Reviews){
  const prior=cycle.records.find(r=>r.cycle_item_id===review.cycle_item_id);
  const appointment=desk.records.find(r=>r.desk_item_id===review.desk_item_id);
  const route=program.evidence_cycle.records.find(r=>r.cycle_item_id===review.cycle_item_id);
  if(!prior||!appointment||!route||appointment.scheduled_check_date!==review.scheduled_check_date||appointment.exact_next_artifact!==review.exact_next_artifact)throw new Error(`Gate identity mismatch: ${review.receipt_id}`);
  if(review.gate_route!==`/review/evidence-cycle/${route.slug}/`)throw new Error('Unknown gate route');
  if(!review.counts_as_cycle_decision&&prior.receipt_id!==review.prior_receipt_id)throw new Error('Companion must retain the original cycle decision');
  const ids=[...review.checked_source_ids,review.underlying_signal_id,...review.canonical_dossier_ids,...review.reader_pathway_ids,...review.dependency_map_ids,...review.local_system_ids,...review.evidence_gap_ids];
  for(const id of ids)if(!content.some(r=>r.id===id))throw new Error(`Unknown content assignment: ${id}`);
  const matchIds=[...review.checked_source_ids,review.underlying_signal_id];
  const targets=content.filter(r=>ids.includes(r.id)||matchIds.some(id=>r.raw.includes(JSON.stringify(id)))).map(r=>({record_id:r.id,route:r.route,relation:ids.includes(r.id)?'Assigned evidence surface':'Exact source/signal reference; contextual notice, not downstream admission'}));
  targets.push({record_id:review.cycle_item_id,route:review.gate_route,relation:review.counts_as_cycle_decision?'Independent cycle gate':'Companion correction; original cycle receipt retained'});
  const envelope=returns.envelope_records.find(r=>r.envelope_id===review.envelope_id);
  if(envelope?.cycle_item_id!==review.cycle_item_id)throw new Error('Return-envelope mismatch');
  targets.push({record_id:envelope.envelope_id,route:`/evidence/qualification/${envelope.slug}/`,relation:'Same-identity return context'});
  for(const id of review.qualification_packet_ids){
    const packet=packets.packet_records.find(r=>r.packet_id===id);
    if(!packet||!review.named_file_ids.includes(packet.file_id))throw new Error('Qualification identity mismatch');
    targets.push({record_id:id,route:`/evidence/qualification/${packet.slug}/`,relation:'Site-authority correction context; qualification decision unchanged'});
  }
  for(const row of [...atlas.projects,...atlas.places,...backlog.backlog_items,...editorial.records])if(matchIds.some(id=>JSON.stringify(row).includes(JSON.stringify(id)))){
    const id=row.atlas_project_id??row.atlas_place_id??row.backlog_item_id??row.record_id;
    for(const path of row.routes?Object.values(row.routes):[row.route])if(typeof path==='string'&&path.startsWith('/'))targets.push({record_id:id,route:path,relation:'Exact source/signal reference; historical record and independent admission retained'});
  }
  const affectedIds=[...new Set([...targets.map(t=>t.record_id),review.desk_item_id,...review.named_file_ids,...(review.conversion_gate_id?[review.conversion_gate_id]:[])])];
  const affectedRoutes=[...new Set([...targets.map(t=>t.route),'/review/evidence-cycle/','/data/operating-cycle.json','/data/evidence-return-envelopes.json','/data/phase-60c-editorial-desk.json','/data/current-evidence-decisions.json',...(review.named_file_ids.length?['/data/project-conversion.json','/data/conversion-gates.json','/data/conversion-stage-matrix.json','/data/qualification-packets.json']:['/data/evidence-queue.json'])])];
  if(affectedIds.some(id=>!id)||affectedRoutes.some(path=>path.includes('undefined')))throw new Error('Unresolved propagation target');
  const payload={schema_version:'1.1',...review,propagation_targets:targets,affected_record_ids:affectedIds,affected_routes:affectedRoutes,propagation_status:'complete_locally_git_held',content_propagation_status:'complete',git_backed_release_status:'held',publication_authorized:false,human_reviewer:null,independent_stage_admission:false,history_boundary:'Actual September 15 inspection appended. Earlier receipts, source-profile dates, baseline registries and qualification decisions remain historical inputs; current site-authority correction is separately identified.'};
  receipts.push({...payload,artifact_digest:hash(payload)});
}
// Validate every new payload before touching either the ledger or derived updates.
for(const receipt of receipts){
  const existing=ledger.receipts.find(r=>r.receipt_id===receipt.receipt_id);
  if(existing&&hash(existing)!==hash(receipt))throw new Error(`Refusing to overwrite a dated receipt: ${receipt.receipt_id}`);
}
for(const receipt of receipts)if(!ledger.receipts.some(r=>r.receipt_id===receipt.receipt_id))ledger.receipts.push(receipt);
ledger.as_of_date=[ledger.as_of_date,evidenceReviewDate].sort().at(-1);
await writeFile(join(root,'src/data/phase-60-current-decisions.json'),JSON.stringify(ledger,null,2)+'\n');
for(const receipt of receipts){
  const update={id:receipt.update_id,effective_date:evidenceReviewDate,entry_type:'Source Refresh',title:receipt.counts_as_cycle_decision?'Montana completed-quarter gate: bounded September 15 decision':'Shuttle Landing Facility: formal renewal retrieved; current site-authority correction',summary:receipt.bounded_finding,affected_record_ids:receipt.affected_record_ids,related_paths:receipt.affected_routes,evidence_note:receipt.evidence_boundary,receipt_id:receipt.receipt_id,source_checked_date:receipt.source_checked_date,decision_date:receipt.decision_date,scheduled_check_date:receipt.scheduled_check_date,receipt_type:receipt.receipt_type,materiality:receipt.counts_as_cycle_decision?'No record-state change':'Correction',publication_effect:'Candidate dated evidence update; signal remains In Review, independent admission and Git-backed release held. Earlier cycle decision and source dates are not rewritten.',next_check_date:receipt.next_check_date,work_package:'docs/work-packages/phase-207-dated-evidence-operations-and-source-currency.md'};
  await writeFile(join(root,`src/content/updates/${receipt.update_id.replace(/^update-/,'')}.json`),JSON.stringify(update,null,2)+'\n');
}
console.log('Recorded two independent September 15 reviews: Montana primary NMC and SLF material companion. Four prior receipt hashes preserved; no historical registry or qualification state rewritten.');
