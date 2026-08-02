import { access, readFile, readdir } from "node:fs/promises";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

const appRoot = fileURLToPath(new URL("..", import.meta.url));
const dataRoot = join(appRoot, "src", "data");
const contentRoot = join(appRoot, "src", "content");
const readJson = async (path) => JSON.parse(await readFile(path, "utf8"));
const failures = [];
const check = (condition, message) => { if (!condition) failures.push(message); };

const ledger = await readJson(join(dataRoot, "phase-56y-longitudinal-delivery-outcomes.json"));
const review = await readJson(join(dataRoot, "phase-56y-publication-review.json"));
const phase56x = await readJson(join(dataRoot, "phase-56x-implementation-to-outcome-expansion.json"));
const collection = await readJson(join(contentRoot, "research-collections", "longitudinal-delivery-outcomes-2026.json"));
const documentFiles = (await readdir(join(contentRoot, "research-documents"))).filter((name) => /^(57[4-9]|58[0-8])-56y-/.test(name));
const documents = await Promise.all(documentFiles.map((name) => readJson(join(contentRoot, "research-documents", name))));
const signalFiles = (await readdir(join(contentRoot, "signals"))).filter((name) => name.startsWith("signal-56y-") && name.endsWith(".mdx"));
const sourceFiles = (await readdir(join(contentRoot, "sources"))).filter((name) => name.startsWith("source-56y-") && name.endsWith(".json"));
const sources = await Promise.all(sourceFiles.map((name) => readJson(join(contentRoot, "sources", name))));

check(ledger.phase === "56Y", "Phase 56Y ledger has the wrong phase.");
check(ledger.records.length === 15 && new Set(ledger.records.map((record) => record.record_id)).size === 15, "Phase 56Y must contain fifteen unique records.");
check(ledger.records_published === 15 && ledger.records.every((record) => record.record_status === "Published"), "Every Phase 56Y record must be Published.");
check(JSON.stringify(ledger.evidence_stage_counts) === JSON.stringify({ "Funding execution": 4, "Award-to-service contract": 2, "Sustained site operations": 3, "Cleanup delivery and outcome": 4, "Project implementation": 2 }), "Phase 56Y evidence-stage counts are incorrect.");
check(ledger.records.every((record) => record.denominator && record.evidence_limits.length >= 3 && record.next_action && record.authority_boundary), "Every Phase 56Y record needs a denominator and full boundary contract.");
check(ledger.exact_target_artifacts_acquired === 0 && ledger.exact_target_trigger_events === 0, "Phase 56Y must record zero exact-target acquisitions and triggers.");
check(ledger.public_agency_contacts_or_foia_requests === 0 && ledger.records.every((record) => !record.contact_or_foia_submitted), "Phase 56Y must record no agency contact or FOIA submission.");
check(ledger.records.every((record) => !record.directive_scope_change && !record.implementation_change && !record.closure_change), "Phase 56Y must preserve directive scope, implementation, and closure.");
check(JSON.stringify(ledger.prior_visible_scope) === JSON.stringify(ledger.post_batch_visible_scope) && JSON.stringify(ledger.post_batch_visible_scope) === JSON.stringify(phase56x.post_batch_visible_scope), "Phase 56Y must preserve visible-scope counts.");
check(ledger.post_batch_closure_counts.closed === 1 && ledger.post_batch_closure_counts.partially_closed === 21 && ledger.post_batch_closure_counts.open === 2, "Phase 56Y must preserve the 1 / 21 / 2 entity evidence ledger.");
check(sourceFiles.length === 11 && sources.every((source) => source.credibility_level === "Tier 1" && source.monitoring_status === "Active" && source.last_checked_date === "2026-08-02"), "Phase 56Y must add eleven current Tier 1 sources.");
check(documents.length === 15 && documents.every((document) => document.record_status === "Published" && document.capture_status === "Official link record"), "Phase 56Y must generate fifteen Published official-link documents.");
check(signalFiles.length === 15, "Phase 56Y must generate fifteen signals.");
check(collection.document_ids.length === 15 && review.promoted_document_ids.length === 15 && review.promoted_signal_ids.length === 15 && review.held_document_ids.length === 0, "Phase 56Y collection or publication-review counts are incorrect.");
check(ledger.records.find((record) => record.action_key === "DOT-IIJA-EXECUTION-01")?.denominator.includes("formula and discretionary"), "DOT aggregate record must preserve the formula/discretionary series break.");
check(ledger.records.find((record) => record.action_key === "NTIA-BEAD-PERFORMANCE-01")?.evidence_limits.some((item) => item.includes("required measures")), "BEAD requirements must remain separate from observed performance.");
check(ledger.records.find((record) => record.action_key === "HANFORD-TANK-PM-01")?.denominator.includes("two reported months"), "Hanford preventive maintenance must preserve the two-month period.");
check(ledger.records.find((record) => record.action_key === "DOE-EM-SRS-RISK-01")?.evidence_limits.some((item) => item.includes("different units")), "SRS curies and gallons must remain separate.");
check(ledger.records.find((record) => record.action_key === "NNSA-LAP4-DELIVERY-01")?.evidence_limits.some((item) => item.includes("awaits baselining")), "LAP4 must preserve incomplete subproject baselining.");
check(ledger.records.find((record) => record.action_key === "NNSA-SRPPF-DELIVERY-01")?.evidence_limits.some((item) => item.includes("forecasts")), "SRPPF procurement forecasts must remain separate from completed delivery.");

for (const file of ["policy-standards-to-implementation.json", "autonomy-regulation-to-service.json", "energy-grid-capacity-to-service.json"]) {
  const pathway = await readJson(join(contentRoot, "reader-pathways", file));
  check(pathway.briefing_ids.includes("briefing-research-watch-029-longitudinal-delivery-outcomes"), `${file} must link Research Watch 029.`);
  check(pathway.research_collection_ids.includes("research-collection-longitudinal-delivery-outcomes-2026"), `${file} must link the Phase 56Y collection.`);
  check(pathway.dependency_stack.some((item) => item.stage === "Phase 56Y longitudinal delivery-and-outcome follow-through"), `${file} must include the Phase 56Y dependency stage.`);
}

const map = await readJson(join(contentRoot, "dependency-maps", "comparative-outcomes-require-common-denominators.json"));
check(map.nodes.some((node) => node.id === "node-phase56y-longitudinal-delivery-outcomes"), "Dependency map must include the Phase 56Y node.");
check(map.links.filter((link) => link.from === "node-phase56y-longitudinal-delivery-outcomes").length === 3, "Dependency map must include three Phase 56Y links.");
await access(join(appRoot, "public", "downloads", "longitudinal-delivery-outcomes-2026.zip"));

if (failures.length) {
  console.error("Phase 56Y assertions failed:");
  failures.forEach((failure) => console.error(`- ${failure}`));
  process.exit(1);
}
console.log("Phase 56Y assertions passed: 15 Published records, 11 new Tier 1 sources, 4/2/3/4/2 evidence-stage split, 0 exact targets, and unchanged scope and closure ledgers.");
