import { access, readFile, readdir } from "node:fs/promises";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

const appRoot = fileURLToPath(new URL("..", import.meta.url));
const dataRoot = join(appRoot, "src", "data");
const contentRoot = join(appRoot, "src", "content");
const readJson = async (path) => JSON.parse(await readFile(path, "utf8"));
const failures = [];
const check = (condition, message) => { if (!condition) failures.push(message); };

const ledger = await readJson(join(dataRoot, "phase-56x-implementation-to-outcome-expansion.json"));
const review = await readJson(join(dataRoot, "phase-56x-publication-review.json"));
const phase56w = await readJson(join(dataRoot, "phase-56w-named-record-retrieval-cross-lane-expansion.json"));
const collection = await readJson(join(contentRoot, "research-collections", "implementation-to-outcome-evidence-2026.json"));
const documentFiles = (await readdir(join(contentRoot, "research-documents"))).filter((name) => /^(56[1-9]|57[0-3])-56x-/.test(name));
const documents = await Promise.all(documentFiles.map((name) => readJson(join(contentRoot, "research-documents", name))));
const signalFiles = (await readdir(join(contentRoot, "signals"))).filter((name) => name.startsWith("signal-56x-") && name.endsWith(".mdx"));
const sourceFiles = (await readdir(join(contentRoot, "sources"))).filter((name) => name.startsWith("source-56x-") && name.endsWith(".json"));
const sources = await Promise.all(sourceFiles.map((name) => readJson(join(contentRoot, "sources", name))));

check(ledger.phase === "56X", "Phase 56X ledger has the wrong phase.");
check(ledger.records.length === 13 && new Set(ledger.records.map((record) => record.record_id)).size === 13, "Phase 56X must contain thirteen unique records.");
check(ledger.records_published === 13 && ledger.records.every((record) => record.record_status === "Published"), "Every Phase 56X record must be Published.");
check(JSON.stringify(ledger.evidence_stage_counts) === JSON.stringify({ "Award review": 4, "Operating output": 3, "Site denominator": 3, "Project baseline": 3 }), "Phase 56X evidence-stage counts are incorrect.");
check(ledger.records.every((record) => record.denominator && record.evidence_limits.length >= 3 && record.next_action && record.authority_boundary), "Every Phase 56X record needs a denominator and full boundary contract.");
check(ledger.exact_target_artifacts_acquired === 0 && ledger.exact_target_trigger_events === 0, "Phase 56X must record zero exact-target acquisitions and triggers.");
check(ledger.public_agency_contacts_or_foia_requests === 0 && ledger.records.every((record) => !record.contact_or_foia_submitted), "Phase 56X must record no agency contact or FOIA submission.");
check(ledger.records.every((record) => !record.directive_scope_change && !record.implementation_change && !record.closure_change), "Phase 56X must preserve directive scope, implementation, and closure.");
check(JSON.stringify(ledger.prior_visible_scope) === JSON.stringify(ledger.post_batch_visible_scope) && JSON.stringify(ledger.post_batch_visible_scope) === JSON.stringify(phase56w.post_batch_visible_scope), "Phase 56X must preserve visible-scope counts.");
check(ledger.post_batch_closure_counts.closed === 1 && ledger.post_batch_closure_counts.partially_closed === 21 && ledger.post_batch_closure_counts.open === 2, "Phase 56X must preserve the 1 / 21 / 2 entity evidence ledger.");
check(sourceFiles.length === 6 && sources.every((source) => source.credibility_level === "Tier 1" && source.monitoring_status === "Active" && source.last_checked_date === "2026-08-02"), "Phase 56X must add six current Tier 1 sources.");
check(documents.length === 13 && documents.every((document) => document.record_status === "Published" && document.capture_status === "Official link record"), "Phase 56X must generate thirteen Published official-link documents.");
check(signalFiles.length === 13, "Phase 56X must generate thirteen signals.");
check(collection.document_ids.length === 13 && review.promoted_document_ids.length === 13 && review.promoted_signal_ids.length === 13 && review.held_document_ids.length === 0, "Phase 56X collection or publication-review counts are incorrect.");
check(ledger.records.find((record) => record.action_key === "IIJA-IRA-DOT-01")?.denominator.includes("formula funds were outside"), "DOT record must preserve the formula-fund exclusion.");
check(ledger.records.find((record) => record.action_key === "HANFORD-EMF-GROUT-01")?.evidence_limits.some((item) => item.includes("not the 22-tank")), "EMF concentrate must remain separate from the 22-tank grout plan.");
check(ledger.records.find((record) => record.action_key === "NNSA-SRPPF-SERIES-01")?.evidence_limits.some((item) => item.includes("budgetary placeholder")), "SRPPF must preserve the placeholder boundary.");
check(ledger.records.find((record) => record.action_key === "NNSA-PORTFOLIO-01")?.denominator.includes("Sixteen execution-phase"), "NNSA portfolio must preserve the execution-phase denominator.");

for (const file of ["policy-standards-to-implementation.json", "autonomy-regulation-to-service.json", "energy-grid-capacity-to-service.json"]) {
  const pathway = await readJson(join(contentRoot, "reader-pathways", file));
  check(pathway.briefing_ids.includes("briefing-research-watch-028-implementation-to-outcome"), `${file} must link Research Watch 028.`);
  check(pathway.research_collection_ids.includes("research-collection-implementation-to-outcome-evidence-2026"), `${file} must link the Phase 56X collection.`);
  check(pathway.dependency_stack.some((item) => item.stage === "Phase 56X implementation-to-outcome expansion"), `${file} must include the Phase 56X dependency stage.`);
}

const map = await readJson(join(contentRoot, "dependency-maps", "comparative-outcomes-require-common-denominators.json"));
check(map.nodes.some((node) => node.id === "node-phase56x-implementation-to-outcome"), "Dependency map must include the Phase 56X node.");
check(map.links.filter((link) => link.from === "node-phase56x-implementation-to-outcome").length === 3, "Dependency map must include three Phase 56X links.");
await access(join(appRoot, "public", "downloads", "implementation-to-outcome-evidence-2026.zip"));

if (failures.length) {
  console.error("Phase 56X assertions failed:");
  failures.forEach((failure) => console.error(`- ${failure}`));
  process.exit(1);
}
console.log("Phase 56X assertions passed: 13 Published records, 6 Tier 1 sources, 4/3/3/3 evidence-stage split, 0 exact targets, and unchanged scope and closure ledgers.");
