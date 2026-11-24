import assert from 'node:assert/strict';
import {readFile,readdir} from 'node:fs/promises';
import {receiptPayloadHash as hash} from './bounded-cycle-followup.mjs';
import {evidenceReviewDate,priorLedgerSnapshot,priorLedgerSha256,louisianaReviews} from '../content-205-216/louisiana-november-21-reviews.mjs';
const root=new URL('../../',import.meta.url);
const text=path=>readFile(new URL(path,root),'utf8');
const json=async path=>JSON.parse(await text(path));
const validDate=d=>typeof d==='string'&&/^\d{4}-\d{2}-\d{2}$/.test(d)&&Number.isFinite(new Date(d+'T00:00:00Z').valueOf())&&new Date(d+'T00:00:00Z').toISOString().slice(0,10)===d;
const starlink='60-CYCLE-LOUISIANA-STARLINK-ADOPTION',nextlink='60-CYCLE-LOUISIANA-NEXTLINK-ADOPTION';
const primaryId='receipt-60-louisiana-starlink-2026-09-01-no-material-change',companionId='receipt-60-louisiana-starlink-2026-09-08-follow-up-no-material-change';
const verifyPayload=(r,digest)=>{assert(r);const {artifact_digest,...p}=r;assert.equal(hash(p),artifact_digest);assert.equal(artifact_digest,digest);};
/** Read-only preparation; never creates a research observation or applies a patch. */
export async function prepareLouisianaFollowups({asOfDate,ledger:override,reviews=louisianaReviews}={}){
 assert(validDate(asOfDate)&&asOfDate>=evidenceReviewDate,'Actual Edmonton inspection boundary required');
 const ledger=override??await json('src/data/phase-60-current-decisions.json');
 assert.equal(hash(priorLedgerSnapshot(ledger)),priorLedgerSha256,'All fourteen predecessor receipts and metadata must remain exact');
 const cycle=await json('src/data/phase-60-operating-cycle.json'),desk=await json('src/data/phase-60c-editorial-desk.json'),returns=await json('src/data/phase-67-evidence-return-envelope-ledger.json');
 const registry=await json('src/data/phase-58-change-receipts.json'),archive=await json('src/data/phase-165-receipts/'+companionId+'.json');
 const primary=registry.receipts.find(r=>r.receipt_id===primaryId),companion=registry.receipts.find(r=>r.receipt_id===companionId);
 verifyPayload(primary,'00c3779079b4d23153d7ee72da9d72060b53548b1d84eb05c9252f972582decb');
 verifyPayload(companion,'9e363402cfd28a78246b63f5732bf13a5181f01f0cfbd547aabba1c7a30d794c');assert.deepEqual(companion,archive);
 const nextPrior=ledger.receipts.find(r=>r.receipt_id==='receipt-60-nextlink-2026-09-10-no-material-change');
 verifyPayload(nextPrior,'13957edea12d34dbb019aa02cc320641ec40fcae6700a45e5d2e5993a2961e8a');
 const proof=(await json('src/data/phase-60-propagation-contract.json')).cycle_decision_proofs.find(r=>r.receipt_id===primaryId);
 const program=await json('src/data/v031-content-expansion.json'),atlas=await json('src/data/phase-119-deep-project-place-atlas.json'),backlog=await json('src/data/phase-182-evidence-source-backlog.json'),editorial=await json('src/data/phase-205-216-current-editorial.json'),places=await json('src/data/phase-162-local-system-expansion.json');
 const named=await json('src/data/phase-61-project-conversion-registry.json');
 assert(!named.records.some(r=>r.signal_ids.some(id=>['signal-57y-preserved-la-starlink-adoption','signal-57y-preserved-la-nextlink-adoption'].includes(id))),'Unexpected named-file binding requires a separate review');
 const content=[];
 for(const[folder,prefix]of [['sources','/atlas/sources/'],['signals','/signals/'],['briefings','/briefings/'],['dependency-maps','/atlas/dependency-maps/'],['local-systems','/atlas/local-systems/'],['evidence-gaps','/atlas/evidence-gaps/'],['reader-pathways','/pathways/'],['research-documents','/research/documents/']]){
  for(const name of (await readdir(new URL('src/content/'+folder+'/',root))).filter(n=>/\.(json|mdx)$/.test(n)).sort()){
   const raw=await text('src/content/'+folder+'/'+name),r=name.endsWith('.json')?JSON.parse(raw):{id:raw.match(/^id: "([^"]+)"/m)?.[1],slug:raw.match(/^slug: "([^"]+)"/m)?.[1]};
   content.push({id:r.id,route:prefix+(folder==='sources'?r.id:r.slug)+'/',raw});
  }
 }
 assert.equal(reviews.length,2);assert.deepEqual(reviews.map(r=>r.cycle_item_id),[starlink,nextlink]);
 const allowed=new Set(Object.keys(louisianaReviews[0]));
 const receipts=[];
 for(const inspected of reviews){
  assert(Object.keys(inspected).every(k=>allowed.has(k)),'Review cannot override derived identity/authority/assignments');
  assert.equal(inspected.receipt_id,louisianaReviews.find(r=>r.cycle_item_id===inspected.cycle_item_id).receipt_id);
  assert.equal(inspected.decision_date,evidenceReviewDate);assert.equal(inspected.source_checked_date,evidenceReviewDate);
  assert(validDate(inspected.next_check_date)&&inspected.next_check_date>evidenceReviewDate);assert.equal(inspected.follow_up_scheduled_date,'2026-10-09');
  assert.equal(inspected.receipt_type,'Watch Note');assert.equal(inspected.decision_status,'rescheduled_with_watch_note');assert.equal(inspected.signal_decision,'retain_in_review_watch_note');
  assert(inspected.official_surface_checks.length>=2&&inspected.official_surface_checks.every(r=>r.accessed_date===evidenceReviewDate&&new URL(r.url).protocol==='https:'));
  const isStarlink=inspected.cycle_item_id===starlink,base=cycle.records.find(r=>r.cycle_item_id===inspected.cycle_item_id),prior=isStarlink?primary:nextPrior,appointment=desk.records.find(r=>r.cycle_item_id===base.cycle_item_id),envelope=returns.envelope_records.find(r=>r.cycle_item_id===base.cycle_item_id);
  assert.equal(hash(base),isStarlink?'db9ead4ef885246d6260db9e4e683ef53ca48ce39ed41ce432e96f14dc147400':'d91c1e312f068f9eb5d5d14d600f089ce83387c1161fb5825b58db4c505a817c');
  const latest=ledger.receipts.filter(r=>r.cycle_item_id===base.cycle_item_id&&r.receipt_id!==inspected.receipt_id).at(-1);
  assert.equal(latest?.receipt_id,isStarlink?undefined:nextPrior.receipt_id,'A later operation supersedes the selected predecessor');
  assert.equal((isStarlink?companion:prior).next_check_date,inspected.follow_up_scheduled_date);
  const assignedSources=[...new Set(isStarlink?[proof.source_id,...proof.supporting_source_ids,...companion.checked_source_ids]:prior.checked_source_ids)];
  assert.deepEqual(inspected.checked_source_ids,louisianaReviews.find(r=>r.cycle_item_id===base.cycle_item_id).checked_source_ids);
  assert(inspected.checked_source_ids.every(id=>assignedSources.includes(id)));
  const canonical=isStarlink?proof.canonical_dossier_ids:prior.canonical_dossier_ids,maps=isStarlink?proof.dependency_map_ids:prior.dependency_map_ids;
  const ids=[...assignedSources,base.underlying_signal_id,...canonical,...base.reader_pathway_ids,...maps,'gap-016'];
  for(const id of ids)assert(content.some(r=>r.id===id),'Unresolved assigned content '+id);
  const matchIds=[...assignedSources,base.underlying_signal_id];
  const targets=content.filter(r=>ids.includes(r.id)||matchIds.some(id=>r.raw.includes(JSON.stringify(id)))).map(r=>({record_id:r.id,route:r.route,relation:ids.includes(r.id)?'Assigned evidence surface':'Exact source/signal reference; related context only, not provider or stage transfer'}));
  const gateRoute='/review/evidence-cycle/'+program.evidence_cycle.records.find(r=>r.cycle_item_id===base.cycle_item_id).slug+'/';
  targets.push({record_id:base.cycle_item_id,route:gateRoute,relation:isStarlink?'Companion review; original primary decision retained':'Follow-up on the same primary identity'},{record_id:envelope.envelope_id,route:'/evidence/qualification/'+envelope.slug+'/',relation:'Same-identity return context; no qualification admission'});
  for(const row of [...atlas.projects,...atlas.places,...backlog.backlog_items,...editorial.records,...places.local_system_briefs])if(matchIds.some(id=>JSON.stringify(row).includes(JSON.stringify(id)))){
   const id=row.atlas_project_id??row.local_system_brief_id??row.atlas_place_id??row.backlog_item_id??row.record_id;
   for(const route of row.routes?Object.values(row.routes):[row.route])if(typeof route==='string'&&route.startsWith('/'))targets.push({record_id:id,route,relation:'Related source context; historical identity, dates and independent outcome retained'});
  }
  const oldUpdates=isStarlink?['2026-09-01-phase-60c-louisiana-starlink-operating-decision','2026-09-08-phase-60-louisiana-starlink-companion-recheck']:['2026-09-10-phase-60-nextlink-decision'];
  const updates=await Promise.all(oldUpdates.map(id=>json('src/content/updates/'+id+'.json')));
  const affectedIds=[...new Set([...targets.map(t=>t.record_id),...updates.flatMap(u=>u.affected_record_ids),...prior.affected_record_ids])];
  const affectedRoutes=[...new Set([...targets.map(t=>t.route),...updates.flatMap(u=>u.related_paths),...(prior.affected_routes??[]),'/review/evidence-cycle/','/data/operating-cycle.json','/data/phase-60c-editorial-desk.json','/data/evidence-return-envelopes.json','/data/current-evidence-decisions.json','/data/evidence-queue.json'])];
  assert(!affectedIds.includes(undefined)&&affectedRoutes.every(r=>r.startsWith('/')&&!r.includes('undefined')));
  const payload={schema_version:'1.1',...inspected,review_kind:isStarlink?'bounded_companion_followup':'bounded_followup',counts_as_cycle_decision:!isStarlink,
   prior_receipt_id:prior.receipt_id,prior_receipt_artifact_digest:prior.artifact_digest,
   ...(isStarlink?{prior_companion_receipt_id:companion.receipt_id,prior_companion_artifact_digest:companion.artifact_digest}:{}),
   origin_record_id:base.origin_record_id,desk_item_id:appointment.desk_item_id,envelope_id:envelope.envelope_id,scheduled_check_date:base.scheduled_check_date,
   underlying_signal_id:base.underlying_signal_id,underlying_signal_status:'In Review',exact_next_artifact:base.exact_next_artifact,
   canonical_dossier_ids:canonical,reader_pathway_ids:base.reader_pathway_ids,dependency_map_ids:maps,evidence_gap_ids:['gap-016'],local_system_ids:[],named_file_ids:[],qualification_packet_ids:[],gate_route:gateRoute,
   context_only_source_ids:assignedSources.filter(id=>!inspected.checked_source_ids.includes(id)),
   watch_note:{receipt_type:'Watch Note',dated:evidenceReviewDate,prior_scheduled_date:inspected.follow_up_scheduled_date,next_check_date:inspected.next_check_date,reason:inspected.next_action},
   propagation_targets:targets,affected_record_ids:affectedIds,affected_routes:affectedRoutes,propagation_status:'complete_locally_git_held',content_propagation_status:'complete',git_backed_release_status:'held',publication_authorized:false,human_reviewer:null,independent_stage_admission:false,
   history_boundary:'Append-only November 21 review. All fourteen earlier current-ledger receipts, both September Starlink receipts, the Nextlink September decision and original baseline files remain exact. Shared program inspections are identified, not represented as independent fetches. Two provider identities remain separate; no cycle identity is added.',
   validation_boundary_at_recording:'Source assignments are locally testable. Full production/output acceptance remains unperformed while the output-delete restriction blocks the build; no publication or cycle closure is claimed.'};
  const receipt={...payload,artifact_digest:hash(payload)},existing=ledger.receipts.find(r=>r.receipt_id===receipt.receipt_id);
  if(existing)assert.deepEqual(existing,receipt,'Refusing to rewrite a dated follow-up');receipts.push(receipt);
 }
 return receipts;
}
