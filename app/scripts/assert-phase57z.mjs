import { access, readFile, readdir, stat } from "node:fs/promises";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

const appRoot = fileURLToPath(new URL("..", import.meta.url));
const dataRoot = join(appRoot, "src", "data");
const contentRoot = join(appRoot, "src", "content");
const readJson = async (path) => JSON.parse(await readFile(path, "utf8"));
const errors = [];
const check = (condition, message) => { if (!condition) errors.push(message); };

const ledger = await readJson(join(dataRoot, "phase-57z-dated-evidence-return-hold-resolution-decisions.json"));
const review = await readJson(join(dataRoot, "phase-57z-publication-review.json"));
const phase57y = await readJson(join(dataRoot, "phase-57y-federation-remediation-rotation-recusal-holdover-rollout-recovery.json"));
const collectionSlug = "dated-evidence-return-council-adoption-results-gates-hold-resolution-decisions-2026";
const collectionId = `research-collection-${collectionSlug}`;

check(ledger.phase === "57Z" && ledger.reviewed_decisions === 11 && ledger.records.length === 11, "Phase 57Z must contain eleven evidence-return decisions.");
check(ledger.published_research_decisions === 11 && ledger.dated_advancements === 1 && ledger.signals_promoted === 1, "Phase 57Z must publish eleven bounded decisions and one dated signal advancement.");
check(ledger.inherited_holds_reviewed === 9 && ledger.inherited_holds_resolved === 0 && ledger.inherited_holds_remaining === 9, "Phase 57Z must recheck nine inherited holds and resolve none without exact evidence.");
check(ledger.duplicate_hold_signals_created === 0 && ledger.new_source_profiles === 0 && ledger.public_agency_contacts_or_foia_requests === 0, "Phase 57Z must create no duplicate holds, new source profiles, or external contacts.");
check(new Set(ledger.records.map((record) => record.decision_id)).size === 11 && new Set(ledger.records.map((record) => record.document_id)).size === 11, "Phase 57Z decision and document identities must be unique.");
check(Math.min(...ledger.records.map((record) => record.document_number)) === 1522 && Math.max(...ledger.records.map((record) => record.document_number)) === 1532, "Phase 57Z document numbers must span 1522 through 1532.");
check(ledger.records.filter((record) => record.decision === "publish_dated_advancement").length === 1, "Exactly one Phase 57Z decision may publish a dated advancement.");
check(ledger.records.filter((record) => record.decision === "keep_signal_in_review").length === 1, "Exactly one Phase 57Z decision must preserve the DARPA results gate.");
check(ledger.records.filter((record) => record.decision === "hold_not_resolved").length === 9, "Exactly nine Phase 57Z decisions must preserve inherited holds.");

const phase57yHolds = phase57y.records.filter((record) => record.record_status === "In Review");
const reviewedHoldKeys = ledger.records.filter((record) => record.record_type === "inherited_hold_recheck").map((record) => record.parent_hold_key).sort();
check(JSON.stringify(reviewedHoldKeys) === JSON.stringify(phase57yHolds.map((record) => record.action_key).sort()), "Phase 57Z must review every Phase 57Y hold exactly once.");
check(review.promoted_signal_ids.length === 1 && review.promoted_signal_ids[0] === "signal-toronto-24-254930-community-council-recommendation", "The Toronto Council signal must be the sole Phase 57Z promotion.");
check(review.held_signal_ids.length === 10 && new Set(review.held_signal_ids).size === 10 && review.inherited_hold_decisions.length === 9, "Phase 57Z must retain ten unique signals In Review and record nine inherited-hold decisions.");
check(ledger.post_batch_closure_counts.Closed === 1 && ledger.post_batch_closure_counts["Partially Closed"] === 21 && ledger.post_batch_closure_counts.Open === 2, "Phase 57Z must preserve the entity closure ledger.");

const torontoSignal = await readFile(join(contentRoot, "signals", "signal-toronto-24-254930-community-council-recommendation.mdx"), "utf8");
const darpaSignal = await readFile(join(contentRoot, "signals", "signal-darpa-lift-challenge-2026-scheduled-field-trial.mdx"), "utf8");
check(/record_status: "Published"/.test(torontoSignal) && /adopted item 2026\.SC33\.9 without amendments and without debate/.test(torontoSignal), "Toronto signal must be Published at the bounded Council-adoption stage.");
check(/record_status: "In Review"/.test(darpaSignal) && /no reviewed official artifact yet provides final measured results/.test(darpaSignal), "DARPA signal must remain In Review pending official measured results.");
const torontoSource = await readJson(join(contentRoot, "sources", "source-toronto-2026-sc33-9-item-history.json"));
const darpaSource = await readJson(join(contentRoot, "sources", "source-darpa-lift-challenge-2026.json"));
check(torontoSource.last_checked_date === "2026-08-10" && /City Council adoption/.test(torontoSource.known_limitations), "Toronto source profile must record the August 10 post-Council check.");
check(darpaSource.last_checked_date === "2026-08-10" && /final results table/.test(darpaSource.known_limitations), "DARPA source profile must record the August 10 official-results recheck.");

const collection = await readJson(join(contentRoot, "research-collections", `${collectionSlug}.json`));
check(collection.id === collectionId && collection.document_ids.length === 11 && new Set(collection.document_ids).size === 11 && /fourteen-file/.test(collection.download_note), "Phase 57Z collection must include eleven documents and declare a fourteen-file archive.");
const documentFiles = await readdir(join(contentRoot, "research-documents"));
check(ledger.records.every((record) => documentFiles.includes(`${record.document_number}-${record.document_id.replace(/^research-doc-/, "")}.json`)), "Every Phase 57Z research document must exist.");
for (const record of ledger.records) {
  const doc = await readJson(join(contentRoot, "research-documents", `${record.document_number}-${record.document_id.replace(/^research-doc-/, "")}.json`));
  check(doc.record_status === "Published" && doc.source_id === record.source_id && doc.evidence_limits.some((item) => item.includes(record.missing)), `${record.document_id} must publish the bounded decision and exact missing evidence.`);
}
const archivePath = join(appRoot, "public", "downloads", `${collectionSlug}.zip`);
await access(archivePath);
check((await stat(archivePath)).size > 0, "Phase 57Z archive must be nonempty.");

for (const file of ["human-futures.json", "aviation.json", "mobility.json", "policy-and-standards.json", "finance-and-risk.json", "energy.json"]) {
  const topic = await readJson(join(contentRoot, "topics", file));
  check(topic.watch_questions.some((question) => question.includes("Phase 57Z")), `${file} must include a Phase 57Z watch question.`);
}
const stage = "Phase 57Z dated evidence return and bounded hold-resolution decisions";
for (const file of ["policy-standards-to-implementation.json", "cross-corridor-authorization-to-operation.json", "energy-grid-capacity-to-service.json"]) {
  const pathway = await readJson(join(contentRoot, "reader-pathways", file));
  check(pathway.research_collection_ids.includes(collectionId), `${file} must link the Phase 57Z collection.`);
  check(pathway.briefing_ids.includes("briefing-research-watch-056-dated-evidence-return-and-hold-resolution"), `${file} must link Research Watch 056.`);
  check(pathway.dependency_stack.some((item) => item.stage === stage), `${file} must include the Phase 57Z dependency stage.`);
}
const map = await readJson(join(contentRoot, "dependency-maps", "comparative-outcomes-require-common-denominators.json"));
check(map.nodes.some((node) => node.id === "node-phase57z-dated-evidence-return"), "Dependency map must include the Phase 57Z node.");
check(map.links.filter((link) => link.from === "node-phase57z-dated-evidence-return").length === 3, "Dependency map must include three Phase 57Z links.");

if (errors.length) {
  console.error("Phase 57Z assertions failed:");
  for (const error of errors) console.error(`- ${error}`);
  process.exit(1);
}
console.log("Phase 57Z assertions passed: 11 Published evidence-return decisions, 1 bounded Toronto signal promotion, DARPA held for official results, 9 of 9 inherited holds reviewed with 0 resolved, 0 duplicate holds, and unchanged outcome and closure ledgers.");
