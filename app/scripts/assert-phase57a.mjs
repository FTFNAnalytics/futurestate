import { access, readFile, readdir } from "node:fs/promises";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

const appRoot = fileURLToPath(new URL("..", import.meta.url));
const dataRoot = join(appRoot, "src", "data");
const contentRoot = join(appRoot, "src", "content");
const readJson = async (path) => JSON.parse(await readFile(path, "utf8"));
const failures = [];
const check = (condition, message) => { if (!condition) failures.push(message); };

const ledger = await readJson(join(dataRoot, "phase-57a-fixed-cohort-completion-realized-outcomes.json"));
const review = await readJson(join(dataRoot, "phase-57a-publication-review.json"));
const phase56z = await readJson(join(dataRoot, "phase-56z-repeat-measurement-accepted-operation.json"));
const collection = await readJson(join(contentRoot, "research-collections", "fixed-cohort-completion-realized-outcomes-2026.json"));
const documentFiles = (await readdir(join(contentRoot, "research-documents"))).filter((name) => name.includes("-57a-") && name.endsWith(".json"));
const documents = await Promise.all(documentFiles.map((name) => readJson(join(contentRoot, "research-documents", name))));
const signalFiles = (await readdir(join(contentRoot, "signals"))).filter((name) => name.startsWith("signal-57a-") && name.endsWith(".mdx"));
const sourceFiles = (await readdir(join(contentRoot, "sources"))).filter((name) => name.startsWith("source-57a-") && name.endsWith(".json"));
const sources = await Promise.all(sourceFiles.map((name) => readJson(join(contentRoot, "sources", name))));

check(ledger.phase === "57A", "Phase 57A ledger has the wrong phase.");
check(ledger.records.length === 16 && new Set(ledger.records.map((record) => record.record_id)).size === 16, "Phase 57A must contain sixteen unique records.");
check(ledger.records_published === 13 && ledger.records_held === 3, "Phase 57A must publish thirteen records and hold three.");
check(JSON.stringify(ledger.evidence_stage_counts) === JSON.stringify({ "Fixed-cohort system outcome": 9, "Independent operating acceptance": 3, "Qualified production output": 1, "Pre-completion hold": 2, "Program baseline hold": 1 }), "Phase 57A evidence-stage counts are incorrect.");
check(ledger.records.every((record) => record.denominator && record.evidence_limits.length >= 3 && record.next_action && record.authority_boundary), "Every Phase 57A record needs a denominator and full boundary contract.");
check(ledger.exact_target_artifacts_acquired === 0 && ledger.exact_target_trigger_events === 0, "Phase 57A must record zero exact-target acquisitions and triggers.");
check(ledger.public_agency_contacts_or_foia_requests === 0 && ledger.records.every((record) => !record.contact_or_foia_submitted), "Phase 57A must record no agency contact or FOIA submission.");
check(ledger.records.every((record) => !record.directive_scope_change && !record.implementation_change && !record.closure_change), "Phase 57A must preserve directive scope, implementation, and closure.");
check(JSON.stringify(ledger.prior_visible_scope) === JSON.stringify(ledger.post_batch_visible_scope) && JSON.stringify(ledger.post_batch_visible_scope) === JSON.stringify(phase56z.post_batch_visible_scope), "Phase 57A must preserve visible-scope counts.");
check(ledger.post_batch_closure_counts.closed === 1 && ledger.post_batch_closure_counts.partially_closed === 21 && ledger.post_batch_closure_counts.open === 2, "Phase 57A must preserve the 1 / 21 / 2 entity evidence ledger.");
check(sourceFiles.length === 5 && sources.every((source) => source.credibility_level === "Tier 1" && source.monitoring_status === "Active" && source.last_checked_date === "2026-08-02"), "Phase 57A must add five current Tier 1 sources.");
check(documents.length === 16 && documents.filter((document) => document.record_status === "Published").length === 13 && documents.filter((document) => document.record_status === "In Review").length === 3, "Phase 57A document counts or statuses are incorrect.");
check(documents.every((document) => document.capture_status === "Official link record"), "Every Phase 57A document must be an official-link record.");
check(signalFiles.length === 16, "Phase 57A must generate sixteen signals.");
check(collection.document_ids.length === 16 && review.promoted_document_ids.length === 13 && review.promoted_signal_ids.length === 13 && review.held_document_ids.length === 3 && review.held_signal_ids.length === 3, "Phase 57A collection or publication-review counts are incorrect.");

const record = (key) => ledger.records.find((item) => item.action_key === key);
check(record("DOT-NEC-SGR-OUTCOME-01")?.denominator.includes("16 major backlog structures"), "The NEC panel must preserve its structure and infrastructure backlog cohort.");
check(record("DOT-TRANSIT-STATION-ADA-01")?.evidence_limits.some((item) => item.includes("method change")), "The transit-station panel must preserve the FY 2025 reporting break.");
check(record("DOT-TTTR-01")?.denominator.includes("95th-to-50th percentile"), "The truck-reliability panel must preserve its ratio method.");
check(record("HANFORD-LAW-OPERATION-03")?.evidence_limits.some((item) => item.includes("steady-state")), "Hanford LAW operation must remain separate from steady-state acceptance.");
check(record("HANFORD-GROUNDWATER-OUTCOME-01")?.evidence_limits.some((item) => item.includes("not contaminant mass removed")), "Hanford groundwater volume must remain separate from contaminant removal.");
check(record("NNSA-W87-1-FPU-01")?.denominator.startsWith("One W87-1 First Production Unit"), "The W87-1 record must retain the single-unit denominator.");
check(record("LA-BEAD-SERVICE-HOLD-01")?.record_status === "In Review", "Louisiana NEPA authorization must remain In Review before construction.");
check(record("MT-BEAD-TEST-HOLD-01")?.evidence_limits.some((item) => item.includes("protocol")), "Montana's BEAD guide must remain a protocol, not a result.");
check(record("NNSA-PIT-BASELINE-HOLD-01")?.record_status === "In Review" && record("NNSA-PIT-BASELINE-HOLD-01")?.evidence_limits.some((item) => item.includes("not recurring output")), "The NNSA program baseline must remain an explicit hold separate from the FPU.");

for (const file of ["policy-standards-to-implementation.json", "autonomy-regulation-to-service.json", "energy-grid-capacity-to-service.json"]) {
  const pathway = await readJson(join(contentRoot, "reader-pathways", file));
  check(pathway.briefing_ids.includes("briefing-research-watch-031-fixed-cohort-completion-realized-outcomes"), `${file} must link Research Watch 031.`);
  check(pathway.research_collection_ids.includes("research-collection-fixed-cohort-completion-realized-outcomes-2026"), `${file} must link the Phase 57A collection.`);
  check(pathway.dependency_stack.some((item) => item.stage === "Phase 57A fixed-cohort completion and realized-outcome panels"), `${file} must include the Phase 57A dependency stage.`);
}

const map = await readJson(join(contentRoot, "dependency-maps", "comparative-outcomes-require-common-denominators.json"));
check(map.nodes.some((node) => node.id === "node-phase57a-fixed-cohort-completion-realized-outcomes"), "Dependency map must include the Phase 57A node.");
check(map.links.filter((link) => link.from === "node-phase57a-fixed-cohort-completion-realized-outcomes").length === 3, "Dependency map must include three Phase 57A links.");
await access(join(appRoot, "public", "downloads", "fixed-cohort-completion-realized-outcomes-2026.zip"));

if (failures.length) {
  console.error("Phase 57A assertions failed:");
  failures.forEach((failure) => console.error(`- ${failure}`));
  process.exit(1);
}
console.log("Phase 57A assertions passed: 13 Published, 3 In Review, 5 new Tier 1 sources, explicit fixed-cohort and accepted-outcome contracts, 0 exact targets, and unchanged scope and closure ledgers.");
