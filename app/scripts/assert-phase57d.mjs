import { access, readFile, readdir } from "node:fs/promises";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

const appRoot = fileURLToPath(new URL("..", import.meta.url));
const dataRoot = join(appRoot, "src", "data");
const contentRoot = join(appRoot, "src", "content");
const readJson = async (path) => JSON.parse(await readFile(path, "utf8"));
const failures = [];
const check = (condition, message) => { if (!condition) failures.push(message); };

const ledger = await readJson(join(dataRoot, "phase-57d-persistent-service-quality-compatible-time-series-replication.json"));
const review = await readJson(join(dataRoot, "phase-57d-publication-review.json"));
const phase57c = await readJson(join(dataRoot, "phase-57c-service-reliability-adoption-recurring-output-validation.json"));
const collection = await readJson(join(contentRoot, "research-collections", "persistent-service-quality-compatible-time-series-replication-2026.json"));
const documentFiles = (await readdir(join(contentRoot, "research-documents"))).filter((name) => name.includes("-57d-") && name.endsWith(".json"));
const documents = await Promise.all(documentFiles.map((name) => readJson(join(contentRoot, "research-documents", name))));
const signalFiles = (await readdir(join(contentRoot, "signals"))).filter((name) => name.startsWith("signal-57d-") && name.endsWith(".mdx"));
const sourceFiles = (await readdir(join(contentRoot, "sources"))).filter((name) => name.startsWith("source-57d-") && name.endsWith(".json"));
const sources = await Promise.all(sourceFiles.map((name) => readJson(join(contentRoot, "sources", name))));
const record = (key) => ledger.records.find((item) => item.action_key === key);

check(ledger.phase === "57D", "Phase 57D ledger has the wrong phase.");
check(ledger.records.length === 20 && new Set(ledger.records.map((item) => item.record_id)).size === 20, "Phase 57D must contain twenty unique records.");
check(ledger.records_published === 12 && ledger.records_held === 8, "Phase 57D must publish twelve records and hold eight.");
check(JSON.stringify(ledger.evidence_stage_counts) === JSON.stringify({ "Compatible service time series": 6, "Monthly material-flow series": 6, "Service quality hold": 2, "Adoption and activation hold": 3, "Recurring output and baseline hold": 3 }), "Phase 57D evidence-stage counts are incorrect.");
check(ledger.records.every((item) => item.denominator && item.evidence_limits.length >= 3 && item.next_action && item.authority_boundary), "Every Phase 57D record needs a denominator and full boundary contract.");
check(ledger.exact_target_artifacts_acquired === 0 && ledger.exact_target_trigger_events === 0, "Phase 57D must record zero exact-target acquisitions and triggers.");
check(ledger.public_agency_contacts_or_foia_requests === 0 && ledger.records.every((item) => !item.contact_or_foia_submitted), "Phase 57D must record no agency contact or FOIA submission.");
check(ledger.directive_scope_changes.length === 0 && ledger.implementation_changes.length === 0 && ledger.closure_changes.length === 0, "Phase 57D must record no directive-scope, implementation, or closure change.");
check(ledger.records.every((item) => !item.directive_scope_change && !item.implementation_change && !item.closure_change), "Phase 57D records must preserve directive scope, implementation, and closure.");
check(JSON.stringify(ledger.prior_visible_scope) === JSON.stringify(ledger.post_batch_visible_scope) && JSON.stringify(ledger.post_batch_visible_scope) === JSON.stringify(phase57c.post_batch_visible_scope), "Phase 57D must preserve visible-scope counts.");
check(ledger.post_batch_closure_counts.closed === 1 && ledger.post_batch_closure_counts.partially_closed === 21 && ledger.post_batch_closure_counts.open === 2, "Phase 57D must preserve the 1 / 21 / 2 entity evidence ledger.");
check(ledger.new_official_source_profiles === 7 && ledger.carried_official_source_profiles === 8, "Phase 57D source counts are incorrect.");
check(sourceFiles.length === 7 && sources.every((source) => source.credibility_level === "Tier 1" && source.monitoring_status === "Active" && source.last_checked_date === "2026-08-02"), "Phase 57D must add seven current Tier 1 sources.");
check(documents.length === 20 && documents.filter((item) => item.record_status === "Published").length === 12 && documents.filter((item) => item.record_status === "In Review").length === 8, "Phase 57D document counts or statuses are incorrect.");
check(documents.every((item) => item.capture_status === "Official link record"), "Every Phase 57D document must be an official-link record.");
check(signalFiles.length === 20, "Phase 57D must generate twenty signals.");
check(collection.document_ids.length === 20 && review.promoted_document_ids.length === 12 && review.promoted_signal_ids.length === 12 && review.held_document_ids.length === 8 && review.held_signal_ids.length === 8, "Phase 57D collection or publication-review counts are incorrect.");

check(record("AMTRAK-ADA-DENOMINATOR-SERIES-2026-01")?.denominator.includes("internal 2024 and 2025 conflicts") && record("AMTRAK-ADA-DENOMINATOR-SERIES-2026-01")?.evidence_limits.some((item) => item.includes("simple longitudinal completion percentage")), "The Amtrak portfolio series must preserve denominator changes and conflicts.");
check(record("AMTRAK-CONSTRUCTION-SERIES-2026-01")?.finding.includes("210") && record("AMTRAK-CONSTRUCTION-SERIES-2026-01")?.finding.includes("240"), "The Amtrak construction series must retain all four observations.");
check(record("AMTRAK-DESIGN-SERIES-2026-01")?.finding.includes("260") && record("AMTRAK-DESIGN-SERIES-2026-01")?.finding.includes("302"), "The Amtrak design series must retain all four observations.");
check(record("AMTRAK-PIDS-REVISION-SERIES-2026-01")?.finding.includes("91 and 90") && record("AMTRAK-PIDS-REVISION-SERIES-2026-01")?.evidence_limits.some((item) => item.includes("silent single-value baseline")), "The PIDS panel must preserve its same-document revision break.");
check(record("AMTRAK-BRIDGE-PLATE-SERIES-2026-01")?.finding.includes("345") && record("AMTRAK-BRIDGE-PLATE-SERIES-2026-01")?.finding.includes("364"), "The bridge-plate series must retain all four observations.");
check(record("AMTRAK-RAMP-METHOD-SERIES-2026-01")?.denominator.includes("corrected unique-car") && record("AMTRAK-RAMP-METHOD-SERIES-2026-01")?.finding.includes("149"), "The ramp series must preserve corrected methodology and its conflicting narrative value.");
check(record("HANFORD-WTP-MONTHLY-FEED-SERIES-2026-01")?.finding.includes("18,550") && record("HANFORD-WTP-MONTHLY-FEED-SERIES-2026-01")?.finding.includes("29,757"), "The Hanford monthly feed panel must retain April and May observations.");
check(record("HANFORD-WTP-CUMULATIVE-FEED-SERIES-2026-01")?.evidence_limits.some((item) => item.includes("independently exact reconciliation")), "The Hanford cumulative feed panel must preserve the lower-bound reconciliation limit.");
check(record("HANFORD-WTP-EFFLUENT-SERIES-2026-01")?.finding.includes("1.55 million") && record("HANFORD-WTP-EFFLUENT-SERIES-2026-01")?.finding.includes("2.26 million"), "The Hanford effluent panel must retain three cumulative thresholds.");
check(record("HANFORD-TSCR-FEED-SPACE-SERIES-2026-01")?.finding.includes("100,000 gallons") && record("HANFORD-TSCR-FEED-SPACE-SERIES-2026-01")?.evidence_limits.some((item) => item.includes("not a completed TSCR batch")), "The TSCR panel must preserve the tank-space dependency boundary.");
check(record("HANFORD-WTP-STAGE-LEDGER-2026-01")?.denominator.includes("only feed and effluent contain recurring quantities"), "The Hanford stage ledger must distinguish quantified and qualitative stages.");
check(record("HANFORD-WTP-MAY-RECORD-2026-01")?.evidence_limits.some((item) => item.includes("not a sustained rate")), "The Hanford May record must not become a sustained-rate claim.");

const phase57cHolds = phase57c.records.filter((item) => item.record_status === "In Review").map((item) => item.action_key).sort();
check(JSON.stringify([...ledger.preserved_phase57c_holds].sort()) === JSON.stringify(phase57cHolds) && phase57cHolds.length === 8, "All eight Phase 57C holds must remain explicitly preserved.");
check(record("AMTRAK-PIDS-CLOSEOUT-HOLD-2026-03")?.record_status === "In Review" && record("AMTRAK-NAMED-RELIABILITY-HOLD-2026-02")?.record_status === "In Review", "Both Amtrak service-quality holds must remain In Review.");
check(record("LA-BEAD-NEXTLINK-VALIDATION-HOLD-2026-03")?.denominator.includes("same 104 BEAD locations") && record("LA-BEAD-NEXTLINK-VALIDATION-HOLD-2026-03")?.record_status === "In Review", "The Louisiana adoption hold must retain the 104-location denominator.");
check(record("NNSA-PIT-RATE-HOLD-2026-03")?.record_status === "In Review" && record("NNSA-PIT-PEIS-HOLD-2026-03")?.record_status === "In Review" && record("NNSA-PIT-GAO-BASELINE-HOLD-2026-04")?.record_status === "In Review", "All three NNSA holds must remain In Review.");

for (const file of ["policy-standards-to-implementation.json", "cross-corridor-authorization-to-operation.json", "energy-grid-capacity-to-service.json"]) {
  const pathway = await readJson(join(contentRoot, "reader-pathways", file));
  check(pathway.briefing_ids.includes("briefing-research-watch-034-persistent-service-quality-compatible-time-series-replication"), `${file} must link Research Watch 034.`);
  check(pathway.research_collection_ids.includes("research-collection-persistent-service-quality-compatible-time-series-replication-2026"), `${file} must link the Phase 57D collection.`);
  check(pathway.dependency_stack.some((item) => item.stage === "Phase 57D persistent service quality and compatible time-series replication panels"), `${file} must include the Phase 57D dependency stage.`);
}

const map = await readJson(join(contentRoot, "dependency-maps", "comparative-outcomes-require-common-denominators.json"));
check(map.nodes.some((node) => node.id === "node-phase57d-persistent-service-quality-time-series"), "Dependency map must include the Phase 57D node.");
check(map.links.filter((link) => link.from === "node-phase57d-persistent-service-quality-time-series").length === 3, "Dependency map must include three Phase 57D links.");
await access(join(appRoot, "public", "downloads", "persistent-service-quality-compatible-time-series-replication-2026.zip"));

if (failures.length) {
  console.error("Phase 57D assertions failed:");
  failures.forEach((failure) => console.error(`- ${failure}`));
  process.exit(1);
}
console.log("Phase 57D assertions passed: 12 Published, 8 In Review, 7 new Tier 1 sources, all 8 Phase 57C holds preserved, 0 exact targets, and unchanged scope and closure ledgers.");
