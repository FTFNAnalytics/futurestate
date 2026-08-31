import { access, readFile, readdir } from "node:fs/promises";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { buildPhase122 } from "./build-phase122-verification-playbooks.mjs";

const appRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const workspaceRoot = resolve(appRoot, "..");
const readJson = async (...parts) => JSON.parse(await readFile(join(...parts), "utf8"));
const failures = [];
const check = (condition, message) => { if (!condition) failures.push(message); };

const [registry, rebuilt, coverage, encyclopedia, cycle, update] = await Promise.all([
  readJson(appRoot, "src", "data", "phase-122-verification-playbook-library.json"),
  buildPhase122({ write: false }),
  readJson(appRoot, "src", "data", "phase-116-coverage-architecture.json"),
  readJson(appRoot, "src", "data", "phase-118-canonical-living-encyclopedia.json"),
  readJson(appRoot, "src", "data", "phase-60-operating-cycle.json"),
  readJson(appRoot, "src", "content", "updates", "2026-08-30-phase-122-verification-playbook-library.json"),
]);

check(JSON.stringify(registry) === JSON.stringify(rebuilt), "The checked-in registry differs from the deterministic Phase 122 builder output.");
check(registry.schema_version === "1.0" && registry.phase === 122 && registry.edition === "v0.5" && registry.record_status === "Published", "Phase 122 must be a Published v0.5 schema 1.0 registry.");
check(registry.counts.stage_playbooks === 8 && registry.stage_playbooks.length === 8, "Phase 122 must contain exactly eight conversion-stage playbooks.");
check(registry.counts.claim_review_protocols === 12 && registry.claim_review_protocols.length === 12, "Phase 122 must contain exactly twelve claim-review protocols.");
check(registry.counts.quality_audit_cards === 10 && registry.quality_audit_cards.length === 10, "Phase 122 must contain exactly ten quality-audit cards.");

const records = [...registry.stage_playbooks, ...registry.claim_review_protocols, ...registry.quality_audit_cards];
check(registry.counts.leaf_records === 30 && records.length === 30, "Phase 122 must contain exactly thirty leaf records.");
check(registry.counts.public_html_routes === 31 && registry.counts.public_json_exports === 1, "Phase 122 route and export counts must be 31 and 1.");
check(new Set(records.map((record) => record.record_id)).size === 30, "Every Phase 122 record ID must be unique.");
for (const collection of [registry.stage_playbooks, registry.claim_review_protocols, registry.quality_audit_cards]) {
  check(new Set(collection.map((record) => record.slug)).size === collection.length, "Every Phase 122 slug must be unique within its route family.");
}
check(new Set(records.map((record) => record.route)).size === 30, "Every Phase 122 leaf route must be unique.");
check(new Set(records.map((record) => record.what_it_can_establish)).size === 30, "Every Phase 122 procedure must define a distinct review decision.");
check(new Set(records.map((record) => record.stop_rule)).size === 30, "Every Phase 122 procedure must have a distinct stop rule.");

const stageById = new Map(coverage.conversion_stages.map((record) => [record.stage_id, record]));
const claimById = new Map(coverage.claim_types.map((record) => [record.claim_type_id, record]));
const qualityById = new Map(coverage.quality_dimensions.map((record) => [record.quality_dimension_id, record]));
const questionById = new Map(coverage.priority_questions.map((record) => [record.question_id, record]));
const foundationById = new Map(encyclopedia.foundation_chapters.map((record) => [record.chapter_id, record]));

const expectedStageIds = coverage.conversion_stages.map((record) => record.stage_id).sort();
const expectedClaimIds = coverage.claim_types.map((record) => record.claim_type_id).sort();
const expectedQualityIds = coverage.quality_dimensions.map((record) => record.quality_dimension_id).sort();
check(JSON.stringify(registry.stage_playbooks.map((record) => record.source_contract_id).sort()) === JSON.stringify(expectedStageIds), "Stage playbooks must cover every Phase 116 conversion stage exactly once.");
check(JSON.stringify(registry.claim_review_protocols.map((record) => record.source_contract_id).sort()) === JSON.stringify(expectedClaimIds), "Claim protocols must cover every Phase 116 claim type exactly once.");
check(JSON.stringify(registry.quality_audit_cards.map((record) => record.source_contract_id).sort()) === JSON.stringify(expectedQualityIds), "Quality cards must cover every Phase 116 quality dimension exactly once.");

for (const record of records) {
  const sourceContract = record.record_kind === "stage_playbook" ? stageById.get(record.source_contract_id)
    : record.record_kind === "claim_review_protocol" ? claimById.get(record.source_contract_id)
      : qualityById.get(record.source_contract_id);
  check(Boolean(sourceContract), record.record_id + " does not resolve to its Phase 116 source contract.");
  check(record.minimum_direct_evidence.length >= 3, record.record_id + " needs at least three direct-evidence requirements.");
  check(record.false_positives.length >= 3 && new Set(record.false_positives).size === record.false_positives.length, record.record_id + " needs at least three distinct false positives.");
  check(record.inadmissible_substitutions.length >= 3 && new Set(record.inadmissible_substitutions).size === record.inadmissible_substitutions.length, record.record_id + " needs at least three distinct inadmissible substitutions.");
  check(record.reviewer_checklist.length >= 5 && new Set(record.reviewer_checklist).size === record.reviewer_checklist.length, record.record_id + " needs at least five distinct review steps.");
  check(record.worked_example.signal_ids.length > 0 && record.counterexample.signal_ids.length > 0, record.record_id + " needs explicit worked and counterexample signal IDs.");
  check(record.worked_example.signal_ids.every((id) => !record.counterexample.signal_ids.includes(id)), record.record_id + " reuses one signal as both example and counterexample.");
  check(record.worked_example.interpretation.length >= 45 && record.counterexample.interpretation.length >= 45, record.record_id + " example interpretations are too thin.");
  check(record.correction_and_propagation_requirements.length >= 4, record.record_id + " lacks a complete correction and propagation path.");
  check(record.related_foundations.length >= 2 && record.related_missions.length >= 2, record.record_id + " needs at least two foundation and mission links.");
  check(record.related_foundations.every((item) => foundationById.get(item.chapter_id)?.title === item.label && item.route.startsWith("/review/encyclopedia/foundations/")), record.record_id + " has an invalid foundation link.");
  for (const mission of record.related_missions) {
    const question = questionById.get(mission.question_id);
    const expectedMissionId = "121-MISSION-" + mission.question_id.split("-").at(-1);
    const expectedRoute = "/review/fieldbook/missions/" + question?.topic_slug + "-" + question?.research_horizon.toLowerCase() + "/";
    check(Boolean(question) && mission.mission_id === expectedMissionId && mission.route === expectedRoute, record.record_id + " has an invalid mission link for " + mission.question_id + ".");
  }
  const group = record.record_kind === "stage_playbook" ? "stages" : record.record_kind === "claim_review_protocol" ? "claims" : "quality";
  check(record.route === "/review/fieldbook/method/" + group + "/" + record.slug + "/", record.record_id + " has a non-canonical route.");
}

const htmlRoutes = ["/review/fieldbook/method/", ...records.map((record) => record.route)];
check(registry.public_routes.length === 32 && new Set(registry.public_routes).size === 32, "The Phase 122 public route inventory must contain 31 HTML routes and one export.");
check(htmlRoutes.every((route) => registry.public_routes.includes(route)) && registry.public_routes.includes("/data/phase-122-verification-playbook-library.json"), "The Phase 122 route inventory is incomplete.");

const requiredFiles = [
  "scripts/build-phase122-verification-playbooks.mjs",
  "scripts/assert-phase122.mjs",
  "src/data/phase-122-verification-playbook-library.json",
  "src/components/review/VerificationPlaybook.astro",
  "src/pages/review/fieldbook/method/index.astro",
  "src/pages/review/fieldbook/method/stages/[slug].astro",
  "src/pages/review/fieldbook/method/claims/[slug].astro",
  "src/pages/review/fieldbook/method/quality/[slug].astro",
  "src/pages/data/phase-122-verification-playbook-library.json.ts",
  "src/content/updates/2026-08-30-phase-122-verification-playbook-library.json",
];
for (const path of requiredFiles) {
  try { await access(join(appRoot, path)); }
  catch { failures.push("Missing Phase 122 file: " + path); }
}
try { await access(join(workspaceRoot, "docs", "work-packages", "phase-122-verification-playbook-library.md")); }
catch { failures.push("Missing Phase 122 work package."); }

const component = await readFile(join(appRoot, "src", "components", "review", "VerificationPlaybook.astro"), "utf8");
for (const heading of ["Minimum direct evidence", "False positives", "Inadmissible substitutions", "Reviewer checklist", "Worked example", "Counterexample", "Stop rule", "Correction and propagation", "Related foundations", "Related research missions", "Publication boundary"]) {
  check(component.includes(heading), "The playbook component omits: " + heading + ".");
}
const hub = await readFile(join(appRoot, "src", "pages", "review", "fieldbook", "method", "index.astro"), "utf8");
check(hub.includes("Conversion-stage playbooks") && hub.includes("Claim-review protocols") && hub.includes("Quality-audit cards"), "The method hub omits a Phase 122 collection.");

const sourceFiles = (await readdir(join(appRoot, "src", "content", "sources"))).filter((name) => name.endsWith(".json"));
const signalFiles = (await readdir(join(appRoot, "src", "content", "signals"))).filter((name) => name.endsWith(".mdx"));
check(sourceFiles.length === 795 && signalFiles.length === 1406, "Phase 122 must not add or remove source or signal records.");
check(!sourceFiles.some((name) => name.includes("122")) && !signalFiles.some((name) => name.includes("122")), "Phase 122 created a source or signal file.");
const futureCycleRecords = cycle.records.filter((record) => record.scheduled_check_date > "2026-08-30");
check(futureCycleRecords.length === 11 && futureCycleRecords.every((record) => record.decision_status === "scheduled" && record.decision_date === null && record.receipt_id === null), "Phase 122 operated or predated a future evidence gate.");

check(update.materiality === "No record-state change" && !("receipt_id" in update) && !("decision_date" in update), "The Phase 122 update creates a receipt, decision, or record-state change.");
const topicIds = coverage.entity_registry.topics.map((record) => record.canonical_id).sort();
check(JSON.stringify([...update.affected_record_ids].sort()) === JSON.stringify(topicIds), "The Phase 122 update must use the seventeen recognized canonical topic IDs as its affected public records.");
const forbiddenKeys = [];
const inspectKeys = (value, path = "registry") => {
  if (!value || typeof value !== "object") return;
  for (const [key, child] of Object.entries(value)) {
    if (/score|rank|observation_value|outcome_value|receipt_id|decision_date/i.test(key)) forbiddenKeys.push(path + "." + key);
    inspectKeys(child, path + "." + key);
  }
};
inspectKeys(registry);
check(forbiddenKeys.length === 0, "Phase 122 introduces forbidden decision or measurement fields: " + forbiddenKeys.join(", "));

if (failures.length) {
  console.error("Phase 122 assertions failed:");
  failures.forEach((failure) => console.error("- " + failure));
  process.exit(1);
}

const exampleIds = new Set(records.flatMap((record) => [...record.worked_example.signal_ids, ...record.counterexample.signal_ids]));
console.log("Phase 122 assertions passed: 8 stage playbooks, 12 claim protocols, 10 quality cards, 30 procedural leaf records, " + exampleIds.size + " Published example signals, 31 HTML routes, one JSON export, and no source, signal, gate, observation, outcome, score, or ranking change.");
