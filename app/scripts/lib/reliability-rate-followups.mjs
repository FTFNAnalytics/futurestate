import assert from 'node:assert/strict';
import {readFile,readdir} from 'node:fs/promises';
import {receiptPayloadHash as hash} from './bounded-cycle-followup.mjs';
import {evidenceReviewDate,priorLedgerSnapshot,priorLedgerSha256,reliabilityRateReviews,predecessorPins} from '../content-205-216/november-26-reliability-rate-reviews.mjs';
const root=new URL('../../',import.meta.url);
const text=path=>readFile(new URL(path,root),'utf8');
const json=async path=>JSON.parse(await text(path));
const validDate=d=>typeof d==='string'&&/^\d{4}-\d{2}-\d{2}$/.test(d)&&Number.isFinite(new Date(d+'T00:00:00Z').valueOf())&&new Date(d+'T00:00:00Z').toISOString().slice(0,10)===d;
const uniq=items=>[...new Set(items)];
/** Pure preparation: pins history and derives propagation; never inspects a live source or writes. */
export async function prepareReliabilityRateFollowups({asOfDate,ledger:override,reviews=reliabilityRateReviews}={}){
 assert(validDate(asOfDate)&&asOfDate>=evidenceReviewDate,'Actual Edmonton inspection boundary required');
 const ledger=override??await json('src/data/phase-60-current-decisions.json');
 assert.equal(hash(priorLedgerSnapshot(ledger)),priorLedgerSha256,'All twenty-one predecessor receipts and metadata must remain exact');
 const cycle=await json('src/data/phase-60-operating-cycle.json'),desk=await json('src/data/phase-60c-editorial-desk.json'),returns=await json('src/data/phase-67-evidence-return-envelope-ledger.json');
 const program=await json('src/data/v031-content-expansion.json'),atlas=await json('src/data/phase-119-deep-project-place-atlas.json'),backlog=await json('src/data/phase-182-evidence-source-backlog.json'),editorial=await json('src/data/phase-205-216-current-editorial.json'),places=await json('src/data/phase-162-local-system-expansion.json');
 const content=[];
 for(const[folder,prefix]of [['sources','/atlas/sources/'],['signals','/signals/'],['briefings','/briefings/'],['dependency-maps','/atlas/dependency-maps/'],['local-systems','/atlas/local-systems/'],['evidence-gaps','/atlas/evidence-gaps/'],['reader-pathways','/pathways/'],['research-documents','/research/documents/']]){
  for(const name of (await readdir(new URL('src/content/'+folder+'/',root))).filter(n=>/\.(json|mdx)$/.test(n)).sort()){
   const raw=await text('src/content/'+folder+'/'+name),r=name.endsWith('.json')?JSON.parse(raw):{id:raw.match(/^id: "([^"]+)"/m)?.[1],slug:raw.match(/^slug: "([^"]+)"/m)?.[1]};
   content.push({id:r.id,route:prefix+(folder==='sources'?r.id:r.slug)+'/',raw});
  }
 }
 assert.equal(reviews.length,2);assert.deepEqual(reviews.map(r=>r.cycle_item_id),reliabilityRateReviews.map(r=>r.cycle_item_id));
 const receipts=[];
 for(const [i,inspected]of reviews.entries()){
  const recorded=reliabilityRateReviews[i],allowed=new Set(Object.keys(recorded));
  assert(Object.keys(inspected).every(k=>allowed.has(k)),'Review cannot override derived identity, authority or assignments');
  assert.equal(inspected.receipt_id,recorded.receipt_id);assert.equal(inspected.decision_date,evidenceReviewDate);assert.equal(inspected.source_checked_date,evidenceReviewDate);
  assert(validDate(inspected.next_check_date)&&inspected.next_check_date>evidenceReviewDate);assert.equal(inspected.follow_up_scheduled_date,'2026-11-25');
  assert.equal(inspected.receipt_type,'Watch Note');assert.equal(inspected.decision_status,'rescheduled_with_watch_note');assert.equal(inspected.signal_decision,'retain_in_review_watch_note');
  assert(inspected.official_surface_checks.length>=2&&inspected.official_surface_checks.every(r=>r.accessed_date===evidenceReviewDate&&new URL(r.url).protocol==='https:'));
  const [priorId,priorDigest,baselineHash]=predecessorPins[i],prior=ledger.receipts.find(r=>r.receipt_id===priorId),base=cycle.records.find(r=>r.cycle_item_id===inspected.cycle_item_id);
  assert(prior&&base);const {artifact_digest,...priorPayload}=prior;assert.equal(hash(priorPayload),artifact_digest);assert.equal(artifact_digest,priorDigest);assert.equal(hash(base),baselineHash);
  assert.equal(ledger.receipts.filter(r=>r.cycle_item_id===base.cycle_item_id&&r.receipt_id!==inspected.receipt_id).at(-1)?.receipt_id,priorId,'A newer operation supersedes this predecessor');
  assert.equal(prior.next_check_date,inspected.follow_up_scheduled_date);
  const isCompanion=false,appointment=desk.records.find(r=>r.desk_item_id===prior.desk_item_id),envelope=returns.envelope_records.find(r=>r.envelope_id===prior.envelope_id);
  assert(envelope);assert.equal(prior.cycle_item_id,base.cycle_item_id);
  if(isCompanion)assert.equal(appointment.item_kind,'named_file_recheck');
  const assignedSources=uniq([...base.source_ids,...prior.checked_source_ids]);
  assert.deepEqual(inspected.checked_source_ids,recorded.checked_source_ids);assert(inspected.checked_source_ids.every(id=>assignedSources.includes(id)));
  const canonical=uniq([...base.canonical_dossier_ids,...prior.canonical_dossier_ids]),pathways=uniq([...base.reader_pathway_ids,...prior.reader_pathway_ids]),maps=uniq([...base.dependency_map_ids,...prior.dependency_map_ids]),gaps=prior.evidence_gap_ids??['gap-016'];
  const ids=uniq([...assignedSources,base.underlying_signal_id,...canonical,...pathways,...maps,...gaps,...prior.local_system_ids]);
  for(const id of ids)assert(content.some(r=>r.id===id),'Unresolved assigned content '+id);
  const matchIds=[...assignedSources,base.underlying_signal_id];
  const targets=content.filter(r=>ids.includes(r.id)||matchIds.some(id=>r.raw.includes(JSON.stringify(id)))).map(r=>({record_id:r.id,route:r.route,relation:ids.includes(r.id)?'Assigned evidence surface':'Exact source/signal context; independent identity, dates and outcomes retained'}));
  targets.push(...(prior.propagation_targets??[]));
  const gateRoute='/review/evidence-cycle/'+program.evidence_cycle.records.find(r=>r.cycle_item_id===base.cycle_item_id).slug+'/';
  targets.push({record_id:base.cycle_item_id,route:gateRoute,relation:isCompanion?'Separate companion; original cycle decision retained':'Follow-up on the same primary identity'},
   {record_id:envelope.envelope_id,route:'/evidence/qualification/'+envelope.slug+'/',relation:'Same-identity return context, no qualification admission'});
  for(const row of [...atlas.projects,...atlas.places,...backlog.backlog_items,...editorial.records,...places.local_system_briefs])if(matchIds.some(id=>JSON.stringify(row).includes(JSON.stringify(id)))){
   const id=row.atlas_project_id??row.local_system_brief_id??row.atlas_place_id??row.backlog_item_id??row.record_id;
   for(const route of row.routes?Object.values(row.routes):[row.route])if(typeof route==='string'&&route.startsWith('/'))targets.push({record_id:id,route,relation:'Related source context, not an independent project or qualification decision'});
  }
  const assignedTargets=[...new Map(targets.map(t=>[t.record_id+'|'+t.route,t])).values()];
  const oldUpdate=await json('src/content/updates/'+prior.update_id.replace(/^update-/,'')+'.json');
  const affectedIds=uniq([...assignedTargets.map(t=>t.record_id),...oldUpdate.affected_record_ids,...prior.affected_record_ids]);
  const affectedRoutes=uniq([...assignedTargets.map(t=>t.route),...oldUpdate.related_paths,...prior.affected_routes,'/review/evidence-cycle/','/data/operating-cycle.json','/data/phase-60c-editorial-desk.json','/data/evidence-return-envelopes.json','/data/current-evidence-decisions.json','/data/evidence-queue.json']);
  assert(!affectedIds.includes(undefined)&&affectedRoutes.every(r=>r.startsWith('/')&&!r.includes('undefined')));
  if(!isCompanion)assert(!affectedIds.some(id=>id.startsWith('61-PROJECT-')||id.startsWith('67-QP-')),'No unrelated named-file or qualification transfer');
  const payload={schema_version:'1.1',...inspected,review_kind:isCompanion?'bounded_companion_followup':'bounded_followup',counts_as_cycle_decision:!isCompanion,
   prior_receipt_id:isCompanion?prior.prior_receipt_id:prior.receipt_id,
   ...(isCompanion?{prior_companion_receipt_id:prior.receipt_id,prior_companion_artifact_digest:prior.artifact_digest,retained_authority_receipt_id:prior.receipt_id,conversion_gate_id:prior.conversion_gate_id}:{prior_receipt_artifact_digest:prior.artifact_digest}),
   origin_record_id:prior.origin_record_id,desk_item_id:prior.desk_item_id,envelope_id:prior.envelope_id,scheduled_check_date:prior.scheduled_check_date,
   underlying_signal_id:base.underlying_signal_id,underlying_signal_status:'In Review',exact_next_artifact:prior.exact_next_artifact,
   canonical_dossier_ids:canonical,reader_pathway_ids:pathways,dependency_map_ids:maps,evidence_gap_ids:gaps,local_system_ids:prior.local_system_ids,named_file_ids:prior.named_file_ids,qualification_packet_ids:prior.qualification_packet_ids,gate_route:gateRoute,
   context_only_source_ids:assignedSources.filter(id=>!inspected.checked_source_ids.includes(id)),
   watch_note:{receipt_type:'Watch Note',dated:evidenceReviewDate,prior_scheduled_date:inspected.follow_up_scheduled_date,next_check_date:inspected.next_check_date,reason:inspected.next_action},
   propagation_targets:assignedTargets,affected_record_ids:affectedIds,affected_routes:affectedRoutes,propagation_status:'complete_locally_git_held',content_propagation_status:'complete',git_backed_release_status:'held',publication_authorized:false,human_reviewer:null,independent_stage_admission:false,
   history_boundary:'Append-only November 26 review. All twenty-one predecessor receipts and baseline registries remain exact. Two independent follow-ups update existing identities, not the thirteen-item count. No Phase 61 named-file or qualification admission applies.',
   validation_boundary_at_recording:'New source propagation requires fresh current and historical assertions, a full production build and release verification. The old candidate receipt does not cover these changed inputs. Output cleanup is authorized; no dependency or permissions blocker is asserted. Public release and cycle closure remain separate.'};
  const receipt={...payload,artifact_digest:hash(payload)},existing=ledger.receipts.find(r=>r.receipt_id===receipt.receipt_id);
  if(existing)assert.deepEqual(existing,receipt,'Refusing to rewrite a dated follow-up');receipts.push(receipt);
 }
 return receipts;
}
