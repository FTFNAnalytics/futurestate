import { access, readFile, readdir } from "node:fs/promises";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

const appRoot = fileURLToPath(new URL("..", import.meta.url));
const dataRoot = join(appRoot, "src", "data");
const contentRoot = join(appRoot, "src", "content");
const readJson = async (path) => JSON.parse(await readFile(path, "utf8"));
const failures = [];
const check = (condition, message) => { if (!condition) failures.push(message); };

const ledger = await readJson(join(dataRoot, "phase-57g-named-asset-project-cohort-registry-expansion.json"));
const review = await readJson(join(dataRoot, "phase-57g-publication-review.json"));
const phase57f = await readJson(join(dataRoot, "phase-57f-measured-reliability-observed-adoption-full-output-reconciliation.json"));
const amtrak = await readJson(join(dataRoot, "phase-57g-amtrak-named-station-registry.json"));
const montana = await readJson(join(dataRoot, "phase-57g-montana-project-cohort-registry.json"));
const hanford = await readJson(join(dataRoot, "phase-57g-hanford-batch-container-stage-registry.json"));
const nnsa = await readJson(join(dataRoot, "phase-57g-nnsa-work-breakdown-registry.json"));
const collection = await readJson(join(contentRoot, "research-collections", "named-asset-project-cohort-registry-expansion-2026.json"));
const documentFiles = (await readdir(join(contentRoot, "research-documents"))).filter((name) => name.includes("-57g-") && name.endsWith(".json"));
const documents = await Promise.all(documentFiles.map((name) => readJson(join(contentRoot, "research-documents", name))));
const signalFiles = (await readdir(join(contentRoot, "signals"))).filter((name) => name.startsWith("signal-57g-") && name.endsWith(".mdx"));
const sourceFiles = (await readdir(join(contentRoot, "sources"))).filter((name) => name.startsWith("source-57g-") && name.endsWith(".json"));
const sources = await Promise.all(sourceFiles.map((name) => readJson(join(contentRoot, "sources", name))));
const record = (key) => ledger.records.find((item) => item.action_key === key);

check(ledger.phase === "57G", "Phase 57G ledger has the wrong phase.");
check(ledger.records.length === 29 && new Set(ledger.records.map((item) => item.record_id)).size === 29, "Phase 57G must contain twenty-nine unique records.");
check(ledger.records_published === 20 && ledger.records_held === 9, "Phase 57G must publish twenty records and hold nine.");
check(ledger.evidence_stage_counts["Named-asset registry"] === 5 && ledger.evidence_stage_counts["Project-cohort registry"] === 5 && ledger.evidence_stage_counts["Batch-container-stage registry"] === 5 && ledger.evidence_stage_counts["Site-facility-program registry"] === 5, "Phase 57G must publish five panels in each registry family.");
check(ledger.records.every((item) => item.denominator && item.evidence_limits.length >= 3 && item.next_action && item.authority_boundary), "Every Phase 57G record needs a denominator and full boundary contract.");
check(ledger.exact_target_artifacts_acquired === 0 && ledger.exact_target_trigger_events === 0, "Phase 57G must record zero exact-target acquisitions and triggers.");
check(ledger.public_agency_contacts_or_foia_requests === 0 && ledger.records.every((item) => !item.contact_or_foia_submitted), "Phase 57G must record no agency contact or FOIA submission.");
check(ledger.directive_scope_changes.length === 0 && ledger.implementation_changes.length === 0 && ledger.closure_changes.length === 0 && ledger.inherited_entity_ledger_closure_changes.length === 0, "Phase 57G must preserve directive and closure state.");
check(JSON.stringify(ledger.prior_visible_scope) === JSON.stringify(ledger.post_batch_visible_scope) && JSON.stringify(ledger.post_batch_visible_scope) === JSON.stringify(phase57f.post_batch_visible_scope), "Phase 57G must preserve visible-scope counts.");
check(ledger.post_batch_closure_counts.closed === 1 && ledger.post_batch_closure_counts.partially_closed === 21 && ledger.post_batch_closure_counts.open === 2, "Phase 57G must preserve the 1 / 21 / 2 entity evidence ledger.");
check(ledger.new_official_source_profiles === 9 && ledger.carried_official_source_profiles >= 20, "Phase 57G source-profile counts are incorrect.");
check(sourceFiles.length === 9 && sources.every((source) => source.credibility_level === "Tier 1" && source.monitoring_status === "Active" && source.last_checked_date === "2026-08-03"), "Phase 57G must add nine current Tier 1 sources.");
check(documents.length === 29 && documents.filter((item) => item.record_status === "Published").length === 20 && documents.filter((item) => item.record_status === "In Review").length === 9, "Phase 57G document counts or statuses are incorrect.");
check(documents.every((item) => item.capture_status === "Official link record"), "Every Phase 57G document must be an official-link record.");
check(signalFiles.length === 29, "Phase 57G must generate twenty-nine signals.");
check(collection.document_ids.length === 29 && review.promoted_document_ids.length === 20 && review.promoted_signal_ids.length === 20 && review.held_document_ids.length === 9 && review.held_signal_ids.length === 9, "Phase 57G collection or publication-review counts are incorrect.");

check(amtrak.membership_count === 197 && amtrak.membership_rows.length === 197, "Amtrak registry must contain 197 cohort memberships.");
check(amtrak.cohort_counts.train_access === 30 && amtrak.cohort_counts.pids === 120 && amtrak.cohort_counts.access_and_amenity === 47, "Amtrak cohort counts must remain 30 / 120 / 47.");
check(amtrak.unique_station_count === 178 && amtrak.stations.length === 178, "Amtrak memberships must resolve to 178 normalized station keys.");
check(JSON.stringify(amtrak.delivery_status_counts.pids) === JSON.stringify({ Cancelled: 1, Complete: 96, "In Progress": 18, "On Hold": 2, Pending: 3 }), "PIDS historical deployment states are incorrect.");
check(JSON.stringify(amtrak.delivery_status_counts.train_access) === JSON.stringify({ Complete: 18, "In Progress": 2, Pending: 10 }), "Train-access historical construction states are incorrect.");
check(amtrak.membership_rows.some((row) => row.source_display_name === "Hanford" && row.delivery_status === "Cancelled") && amtrak.membership_rows.some((row) => row.source_display_name === "Detroit" && row.delivery_status === "On Hold") && amtrak.membership_rows.some((row) => row.source_display_name === "Atlanta" && row.delivery_status === "On Hold"), "PIDS exception rows must remain explicit.");
check(amtrak.membership_rows.every((row) => row.outcome_state === null && row.historical_snapshot_date === "2023-04-30"), "Amtrak rows must remain historical identities without outcome state.");

check(montana.subgrantee_count === 19 && montana.subgrantees.length === 19 && montana.project_count === 32 && montana.projects.length === 32, "Montana registry must contain 19 subgrantees and 32 projects.");
check(montana.bsl_location_rows === 68315 && montana.cai_rows === 183, "Montana BSL and CAI row totals are incorrect.");
check(montana.bead_support_total_usd === 303686528 && montana.subgrantee_match_total_usd === 145190798, "Montana funding totals are incorrect.");
check(Object.values(montana.raw_location_classification_counts).reduce((a, b) => a + b, 0) === 68315 && Object.values(montana.raw_location_technology_counts).reduce((a, b) => a + b, 0) === 68315, "Montana raw-code distributions must reconcile to all BSL rows.");
check(montana.projects.every((project) => montana.subgrantees.some((subgrantee) => subgrantee.subgrantee_id === project.subgrantee_id)), "Every Montana project must join to a named subgrantee by UEI.");
check(montana.projects.some((project) => project.project_id === "CM61-BEAD-MT-4678" && project.bsl_count === 0 && project.cai_count === 21), "The CAI-only Triangle Hill 2 project must remain visible.");
check(montana.privacy_boundary.individual_bsl_identifiers_published === 0 && montana.privacy_boundary.individual_cai_details_published === 0 && !JSON.stringify(montana).includes("location_id"), "Montana public output must exclude individual location and CAI details.");
check(montana.projects.every((project) => project.outcome_state === null), "Montana project rows must not imply operating outcomes.");

check(hanford.stage_count === 14 && hanford.stages.length === 14 && hanford.observation_count === 9 && hanford.observations.length === 9, "Hanford registry must contain fourteen stages and nine observations.");
check(hanford.public_identity_availability.batch_ids === 0 && hanford.public_identity_availability.container_ids === 0, "Hanford missing public batch and container IDs must remain explicit.");
check(hanford.stages.filter((stage) => stage.object_type === "Named production asset").map((stage) => stage.label).sort().join("|") === "Low-Activity Waste Facility Melter 1|Low-Activity Waste Facility Melter 2", "Hanford registry must retain both named melters.");
check(new Set(hanford.observations.map((item) => item.operator)).has(">") && new Set(hanford.observations.map((item) => item.operator)).has("approximately") && new Set(hanford.observations.map((item) => item.operator)).has("milestone"), "Hanford observation operators must remain distinct.");
check(hanford.nonconversion_rules.some((rule) => rule.includes("nominal seven-metric-ton")) && hanford.nonconversion_rules.some((rule) => rule.includes("gallons")), "Hanford registry must prohibit synthetic mass and unit conversion.");

check(nnsa.entry_count === 18 && nnsa.entries.length === 18, "NNSA registry must contain eighteen work-breakdown objects.");
for (const id of ["NNSA-LANL", "NNSA-LANL-PF4", "NNSA-LANL-LAP4", "NNSA-LANL-LAP4-30B", "NNSA-LANL-LAP4-30R", "NNSA-LANL-LAP4-30D", "NNSA-SRS", "NNSA-SRS-MOX", "NNSA-SRS-SRPPF", "NNSA-SRS-SRPPF-MPB", "NNSA-SRS-SRPPF-HFTOC", "NNSA-W87-1-FPU", "NNSA-GAO-23-104661-REC1", "NNSA-CAPACITY-30-50-80"]) {
  check(nnsa.entries.some((entry) => entry.registry_id === id), `NNSA registry is missing ${id}.`);
}
check(nnsa.entries.find((entry) => entry.registry_id === "NNSA-LANL-LAP4-30D")?.object_type === "Scope strategy", "30 Diamond must remain a scope strategy rather than a facility.");
check(nnsa.entries.every((entry) => entry.operating_outcome === null), "NNSA registry objects must not imply operating outcomes.");

const phase57fHolds = phase57f.records.filter((item) => item.record_status === "In Review").map((item) => item.action_key).sort();
const inheritedParents = ledger.records.filter((item) => item.parent_hold_key).map((item) => item.parent_hold_key).sort();
check(JSON.stringify([...ledger.preserved_phase57f_holds].sort()) === JSON.stringify(phase57fHolds) && JSON.stringify(inheritedParents) === JSON.stringify(phase57fHolds) && phase57fHolds.length === 9, "All nine Phase 57F holds must remain explicitly preserved exactly once.");
check(ledger.new_visible_holds.length === 0, "Phase 57G must add no new visible hold.");
for (const key of Object.values({
  amtrakPids: "AMTRAK-PIDS-CLOSEOUT-HOLD-2026-06", amtrakAsset: "AMTRAK-NAMED-RELIABILITY-HOLD-2026-05",
  nextlink: "LA-BEAD-NEXTLINK-VALIDATION-HOLD-2026-06", starlink: "LA-BEAD-STARLINK-HOLD-2026-06", montana: "MT-BEAD-QUARTERLY-HOLD-2026-06",
  hanford: "HANFORD-WTP-MASS-BALANCE-HOLD-2026-03", nnsaRate: "NNSA-PIT-RATE-HOLD-2026-06", nnsaCapacity: "NNSA-PIT-PEIS-HOLD-2026-06", nnsaBaseline: "NNSA-PIT-GAO-BASELINE-HOLD-2026-07",
})) check(record(key)?.record_status === "In Review", `${key} must remain In Review.`);

for (const file of ["policy-standards-to-implementation.json", "cross-corridor-authorization-to-operation.json", "energy-grid-capacity-to-service.json"]) {
  const pathway = await readJson(join(contentRoot, "reader-pathways", file));
  check(pathway.briefing_ids.includes("briefing-research-watch-037-named-asset-project-cohort-registry-expansion"), `${file} must link Research Watch 037.`);
  check(pathway.research_collection_ids.includes("research-collection-named-asset-project-cohort-registry-expansion-2026"), `${file} must link the Phase 57G collection.`);
  check(pathway.dependency_stack.some((item) => item.stage === "Phase 57G named-asset and project-cohort registry panels"), `${file} must include the Phase 57G dependency stage.`);
}

const map = await readJson(join(contentRoot, "dependency-maps", "comparative-outcomes-require-common-denominators.json"));
check(map.nodes.some((node) => node.id === "node-phase57g-identity-registries"), "Dependency map must include the Phase 57G node.");
check(map.links.filter((link) => link.from === "node-phase57g-identity-registries").length === 3, "Dependency map must include three Phase 57G links.");
await access(join(appRoot, "public", "downloads", "named-asset-project-cohort-registry-expansion-2026.zip"));

if (failures.length) {
  console.error("Phase 57G assertions failed:");
  failures.forEach((failure) => console.error(`- ${failure}`));
  process.exit(1);
}
console.log("Phase 57G assertions passed: 20 Published, 9 In Review, 9 new Tier 1 sources, four structured registries, all 9 Phase 57F holds preserved, no new hold, and unchanged scope and closure ledgers.");
