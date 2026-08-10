import { access, readFile, readdir, stat } from "node:fs/promises";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

const appRoot=fileURLToPath(new URL("..",import.meta.url));
const dataRoot=join(appRoot,"src","data");
const contentRoot=join(appRoot,"src","content");
const readJson=async(path)=>JSON.parse(await readFile(path,"utf8"));
const errors=[];
const check=(condition,message)=>{if(!condition)errors.push(message);};

const ledger=await readJson(join(dataRoot,"phase-57w-quorum-ceremonies-witness-availability-fork-time-build-reissuance.json"));
const ceremonies=await readJson(join(dataRoot,"phase-57w-quorum-ceremony-member-lifecycle.json"));
const availability=await readJson(join(dataRoot,"phase-57w-witness-availability-catchup-proofs.json"));
const forks=await readJson(join(dataRoot,"phase-57w-attributable-fork-evidence.json"));
const time=await readJson(join(dataRoot,"phase-57w-federated-time-authority-failover.json"));
const builds=await readJson(join(dataRoot,"phase-57w-verifier-build-provenance.json"));
const reissuance=await readJson(join(dataRoot,"phase-57w-post-compromise-reissuance.json"));
const harness=await readJson(join(dataRoot,"phase-57w-ceremony-availability-fork-provenance-reissuance-harness-results.json"));
const review=await readJson(join(dataRoot,"phase-57w-publication-review.json"));
const phase57v=await readJson(join(dataRoot,"phase-57v-threshold-witness-gossip-time-verifiers-compromise-recovery.json"));

check(ledger.phase==="57W"&&ledger.records_reviewed===63&&ledger.records.length===63,"Phase 57W must contain exactly sixty-three records.");
const published=ledger.records.filter((record)=>record.record_status==="Published");
const held=ledger.records.filter((record)=>record.record_status==="In Review");
check(published.length===54&&held.length===9,"Phase 57W must publish fifty-four controls and preserve nine holds.");
check(new Set(ledger.records.map((record)=>record.record_id)).size===63&&new Set(ledger.records.map((record)=>record.document_id)).size===63&&new Set(ledger.records.map((record)=>record.signal_id)).size===63&&new Set(ledger.records.map((record)=>record.action_key)).size===63,"Phase 57W record identities must be unique.");
check(Math.min(...ledger.records.map((record)=>record.document_number))===1333&&Math.max(...ledger.records.map((record)=>record.document_number))===1395,"Phase 57W document numbers must span 1333 through 1395.");
check(new Set(published.flatMap((record)=>record.supporting_source_ids)).size===36&&ledger.carried_official_source_profiles===36&&ledger.new_official_source_profiles===0,"Phase 57W must reuse thirty-six Tier 1 source profiles and add none.");

const rails=[[ceremonies,252,"ceremony"],[availability,234,"availability"],[forks,216,"fork-evidence"],[time,225,"time-failover"],[builds,243,"build-provenance"],[reissuance,261,"re-issuance"]];
for(const [rail,caseCount,label] of rails){
  check(rail.phase==="57W"&&rail.schemas.length===9&&rail.cases.length===caseCount&&rail.passed_case_count===caseCount&&rail.failed_case_count===0,"Phase 57W "+label+" rail totals are incorrect.");
  check(new Set(rail.schemas.map((row)=>row.contract_id)).size===9&&new Set(rail.cases.map((row)=>row.test_id)).size===caseCount,"Phase 57W "+label+" identities must be unique.");
  check(rail.cases.every((row)=>row.passed&&row.fixture_only&&!row.actual_ceremony&&!row.actual_membership_event&&!row.actual_availability_observation&&!row.actual_catchup_proof&&!row.actual_fork_event&&!row.actual_fork_attribution&&!row.actual_time_failover&&!row.actual_build_attestation&&!row.actual_reissuance&&!row.actual_reader_migration&&!row.actual_reader_state_changed&&!row.prior_artifact_rewritten&&!row.evidence_created&&!row.fires_trigger&&!row.closes_hold_automatically&&!row.publishes_automatically),"Every Phase 57W "+label+" case must remain passing, synthetic, immutable, and non-automating.");
}
check(ledger.total_contract_specific_schemas===54&&ledger.total_workflow_cases===1431&&ledger.valid_or_preservation_routes===396&&ledger.rejected_routes===1035&&ledger.workflow_test_failures===0,"Phase 57W aggregate schema or case totals are incorrect.");
check(harness.phase==="57W"&&harness.total_case_count===1431&&harness.passed_case_count===1431&&harness.failed_case_count===0&&harness.valid_or_preservation_routes===396&&harness.rejected_routes===1035&&new Set(harness.test_ids).size===1431,"Phase 57W harness totals or IDs are incorrect.");
for(const field of ["actual_ceremonies","actual_membership_events","actual_availability_observations","actual_catchup_proofs","actual_fork_events","actual_fork_attributions","actual_time_failovers","actual_build_attestations","actual_reissuances","actual_reader_migrations","actual_reader_state_changes","evidence_records_created","reopening_triggers_fired","automated_closures_or_publications","prior_artifact_rewrites"])check(harness[field]===0,"Phase 57W harness field "+field+" must remain zero.");

const phase57vHolds=phase57v.records.filter((record)=>record.record_status==="In Review");
check(JSON.stringify([...ledger.preserved_phase57v_holds].sort())===JSON.stringify(phase57vHolds.map((record)=>record.action_key).sort()),"Phase 57W must preserve all Phase 57V holds exactly once.");
check(ledger.new_visible_holds.length===0&&new Set(review.inherited_hold_lineage.map((row)=>row.parent_hold_key)).size===9&&new Set(review.inherited_hold_lineage.map((row)=>row.reopening_contract_id)).size===9,"Phase 57W must add no hold and preserve nine unique hold lineages.");
check(review.promoted_signal_ids.length===54&&review.held_signal_ids.length===9&&review.total_workflow_cases_executed===1431,"Phase 57W publication-review totals are incorrect.");
check(ledger.post_batch_closure_counts.Closed===1&&ledger.post_batch_closure_counts["Partially Closed"]===21&&ledger.post_batch_closure_counts.Open===2,"Phase 57W must preserve the entity closure ledger.");

const collectionSlug="quorum-ceremonies-witness-availability-fork-accountability-time-failover-build-provenance-reissuance-2026";
const collectionId="research-collection-"+collectionSlug;
const collection=await readJson(join(contentRoot,"research-collections",collectionSlug+".json"));
check(collection.document_ids.length===63&&new Set(collection.document_ids).size===63&&/sixty-six-file/.test(collection.download_note),"Phase 57W collection must include sixty-three documents and declare a sixty-six-file archive.");
const documentFiles=await readdir(join(contentRoot,"research-documents"));
const signalFiles=await readdir(join(contentRoot,"signals"));
check(ledger.records.every((record)=>documentFiles.some((file)=>file.startsWith(record.document_number+"-")&&file.endsWith(record.signal_id.replace(/^signal-/,"")+".json"))),"Every Phase 57W research document must exist.");
check(ledger.records.every((record)=>signalFiles.includes(record.signal_id+".mdx")),"Every Phase 57W signal must exist.");
const archivePath=join(appRoot,"public","downloads",collectionSlug+".zip");
await access(archivePath);
check((await stat(archivePath)).size>0,"Phase 57W archive must be nonempty.");

for(const file of ["finance-and-risk.json","policy-and-standards.json","mobility.json","chips-and-compute.json","energy.json"]){
  const topic=await readJson(join(contentRoot,"topics",file));
  check(topic.watch_questions.some((question)=>question.includes("Phase 57W")),file+" must include a Phase 57W watch question.");
}
const stage="Phase 57W quorum operations, witness availability, fork accountability, time failover, build provenance, and re-issuance";
for(const file of ["policy-standards-to-implementation.json","cross-corridor-authorization-to-operation.json","energy-grid-capacity-to-service.json"]){
  const pathway=await readJson(join(contentRoot,"reader-pathways",file));
  check(pathway.research_collection_ids.includes(collectionId),file+" must link the Phase 57W collection.");
  check(pathway.dependency_stack.some((item)=>item.stage===stage),file+" must include the Phase 57W dependency stage.");
}
const map=await readJson(join(contentRoot,"dependency-maps","comparative-outcomes-require-common-denominators.json"));
check(map.nodes.some((node)=>node.id==="node-phase57w-operational-federation-reissuance"),"Dependency map must include the Phase 57W node.");
check(map.links.filter((link)=>link.from==="node-phase57w-operational-federation-reissuance").length===3,"Dependency map must include three Phase 57W links.");

if(errors.length){
  console.error("Phase 57W assertions failed:");
  for(const error of errors)console.error("- "+error);
  process.exit(1);
}
console.log("Phase 57W assertions passed: 54 Published controls, 9 preserved In Review holds, 36 carried Tier 1 sources, 54 schemas, 1,431 cases, governed quorum lifecycle, bounded witness catch-up, attributable fork quarantine, monotonic time failover, three-verifier reproducible build provenance, inactive lineage-preserving re-issuance, zero actual events, zero triggers, and unchanged scope, outcome, and closure ledgers.");

