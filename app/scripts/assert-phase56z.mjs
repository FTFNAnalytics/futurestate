import { access, readFile, readdir } from "node:fs/promises";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

const appRoot = fileURLToPath(new URL("..", import.meta.url));
const dataRoot = join(appRoot, "src", "data");
const contentRoot = join(appRoot, "src", "content");
const readJson = async (path) => JSON.parse(await readFile(path, "utf8"));
const failures = [];
const check = (condition, message) => { if (!condition) failures.push(message); };

const ledger = await readJson(join(dataRoot, "phase-56z-repeat-measurement-accepted-operation.json"));
const review = await readJson(join(dataRoot, "phase-56z-publication-review.json"));
const phase56y = await readJson(join(dataRoot, "phase-56y-longitudinal-delivery-outcomes.json"));
const collection = await readJson(join(contentRoot, "research-collections", "repeat-measurement-accepted-operation-2026.json"));
const documentFiles = (await readdir(join(contentRoot, "research-documents"))).filter((name) => name.includes("-56z-") && name.endsWith(".json"));
const documents = await Promise.all(documentFiles.map((name) => readJson(join(contentRoot, "research-documents", name))));
const signalFiles = (await readdir(join(contentRoot, "signals"))).filter((name) => name.startsWith("signal-56z-") && name.endsWith(".mdx"));
const sourceFiles = (await readdir(join(contentRoot, "sources"))).filter((name) => name.startsWith("source-56z-") && name.endsWith(".json"));
const sources = await Promise.all(sourceFiles.map((name) => readJson(join(contentRoot, "sources", name))));

check(ledger.phase === "56Z", "Phase 56Z ledger has the wrong phase.");
check(ledger.records.length === 17 && new Set(ledger.records.map((record) => record.record_id)).size === 17, "Phase 56Z must contain seventeen unique records.");
check(ledger.records_published === 13 && ledger.records_held === 4, "Phase 56Z must publish thirteen records and hold four.");
check(JSON.stringify(ledger.evidence_stage_counts) === JSON.stringify({ "Repeat funding measurement": 4, "Award progression": 2, "Award progression hold": 2, "Accepted cleanup operation": 5, "Project delivery input": 2, "Comparison hold": 2 }), "Phase 56Z evidence-stage counts are incorrect.");
check(ledger.records.every((record) => record.denominator && record.evidence_limits.length >= 3 && record.next_action && record.authority_boundary), "Every Phase 56Z record needs a denominator and full boundary contract.");
check(ledger.exact_target_artifacts_acquired === 0 && ledger.exact_target_trigger_events === 0, "Phase 56Z must record zero exact-target acquisitions and triggers.");
check(ledger.public_agency_contacts_or_foia_requests === 0 && ledger.records.every((record) => !record.contact_or_foia_submitted), "Phase 56Z must record no agency contact or FOIA submission.");
check(ledger.records.every((record) => !record.directive_scope_change && !record.implementation_change && !record.closure_change), "Phase 56Z must preserve directive scope, implementation, and closure.");
check(JSON.stringify(ledger.prior_visible_scope) === JSON.stringify(ledger.post_batch_visible_scope) && JSON.stringify(ledger.post_batch_visible_scope) === JSON.stringify(phase56y.post_batch_visible_scope), "Phase 56Z must preserve visible-scope counts.");
check(ledger.post_batch_closure_counts.closed === 1 && ledger.post_batch_closure_counts.partially_closed === 21 && ledger.post_batch_closure_counts.open === 2, "Phase 56Z must preserve the 1 / 21 / 2 entity evidence ledger.");
check(sourceFiles.length === 12 && sources.every((source) => source.credibility_level === "Tier 1" && source.monitoring_status === "Active" && source.last_checked_date === "2026-08-02"), "Phase 56Z must add twelve current Tier 1 sources.");
check(documents.length === 17 && documents.filter((document) => document.record_status === "Published").length === 13 && documents.filter((document) => document.record_status === "In Review").length === 4, "Phase 56Z document counts or statuses are incorrect.");
check(documents.every((document) => document.capture_status === "Official link record"), "Every Phase 56Z document must be an official-link record.");
check(signalFiles.length === 17, "Phase 56Z must generate seventeen signals.");
check(collection.document_ids.length === 17 && review.promoted_document_ids.length === 13 && review.promoted_signal_ids.length === 13 && review.held_document_ids.length === 4 && review.held_signal_ids.length === 4, "Phase 56Z collection or publication-review counts are incorrect.");

const aggregate = ledger.records.find((record) => record.action_key === "DOT-IIJA-REPEAT-02");
check(aggregate?.denominator.includes("adjusted authority changed"), "DOT aggregate panel must preserve the changing authority denominator.");
check(ledger.records.find((record) => record.action_key === "DOT-IIJA-FRA-02")?.evidence_limits.some((item) => item.includes("denominator effect")), "FRA panel must explain the denominator-driven obligation-share movement.");
check(ledger.records.find((record) => record.action_key === "NTIA-BEAD-AGREEMENTS-02")?.denominator.includes("same 56"), "BEAD repeat panel must preserve the eligible-entity denominator.");
check(ledger.records.find((record) => record.action_key === "HANFORD-DFLAW-OPERATION-02")?.evidence_limits.some((item) => item.includes("steady-state")), "Hanford DFLAW panel must preserve the commissioning boundary.");
check(ledger.records.find((record) => record.action_key === "IDAHO-IWTU-REPEAT-02")?.evidence_limits.some((item) => item.includes("exact five-month delta")), "Idaho panel must reject an exact delta from approximate observations.");
check(ledger.records.find((record) => record.action_key === "SRS-THROUGHPUT-HOLD-01")?.record_status === "In Review", "Incompatible SRS throughput universes must remain In Review.");
check(ledger.records.find((record) => record.action_key === "SRS-CANISTER-FORECAST-HOLD-01")?.record_status === "In Review", "Forecast SRS canister reduction must remain In Review.");
check(ledger.records.find((record) => record.action_key === "NNSA-LAP4-DELIVERY-02")?.evidence_limits.some((item) => item.includes("CD-4")), "LAP4 installed input must remain separate from acceptance.");
check(ledger.records.find((record) => record.action_key === "NNSA-SRPPF-DELIVERY-02")?.evidence_limits.some((item) => item.includes("not construction percent complete")), "SRPPF demolition input must remain separate from construction progress.");

for (const file of ["policy-standards-to-implementation.json", "autonomy-regulation-to-service.json", "energy-grid-capacity-to-service.json"]) {
  const pathway = await readJson(join(contentRoot, "reader-pathways", file));
  check(pathway.briefing_ids.includes("briefing-research-watch-030-repeat-measurement-accepted-operation"), `${file} must link Research Watch 030.`);
  check(pathway.research_collection_ids.includes("research-collection-repeat-measurement-accepted-operation-2026"), `${file} must link the Phase 56Z collection.`);
  check(pathway.dependency_stack.some((item) => item.stage === "Phase 56Z repeat-measurement and accepted-operation panels"), `${file} must include the Phase 56Z dependency stage.`);
}

const map = await readJson(join(contentRoot, "dependency-maps", "comparative-outcomes-require-common-denominators.json"));
check(map.nodes.some((node) => node.id === "node-phase56z-repeat-measurement-accepted-operation"), "Dependency map must include the Phase 56Z node.");
check(map.links.filter((link) => link.from === "node-phase56z-repeat-measurement-accepted-operation").length === 3, "Dependency map must include three Phase 56Z links.");
await access(join(appRoot, "public", "downloads", "repeat-measurement-accepted-operation-2026.zip"));

if (failures.length) {
  console.error("Phase 56Z assertions failed:");
  failures.forEach((failure) => console.error(`- ${failure}`));
  process.exit(1);
}
console.log("Phase 56Z assertions passed: 13 Published, 4 In Review, 12 new Tier 1 sources, explicit repeat and accepted-operation contracts, 0 exact targets, and unchanged scope and closure ledgers.");

