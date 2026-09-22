import { access, readdir, readFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const appRoot = join(dirname(fileURLToPath(import.meta.url)), "..");
const dataRoot = join(appRoot, "src", "data");
const contentRoot = join(appRoot, "src", "content");
const workPackagesRoot = join(appRoot, "..", "docs", "work-packages");
const readJson = async (path) => JSON.parse(await readFile(path, "utf8"));
const failures = [];
const check = (condition, message) => { if (!condition) failures.push(message); };
const unique = (items) => [...new Set(items)];

const names = {
  181: "phase-181-canonical-resource-map.json",
  182: "phase-182-evidence-source-backlog.json",
  183: "phase-183-missing-system-topic-missions.json",
  184: "phase-184-canonical-topic-edition-2.json",
  185: "phase-185-global-place-systems-atlas-i.json",
  186: "phase-186-named-delivery-case-atlas-ii.json",
  187: "phase-187-outcomes-longitudinal-observatory.json",
  188: "phase-188-state-of-frontier-systems-edition.json"
};
const phases = await Promise.all(Object.values(names).map((name) => readJson(join(dataRoot, name))));
const [p181, p182, p183, p184, p185, p186, p187, p188] = phases;
check(phases.every((phase, index) => phase.phase === 181 + index && phase.program_id === `FTFN-PHASE-${181 + index}` && phase.schema_version === "1.0"), "Phase identity, order, or schema is invalid.");

const sourceNames = (await readdir(join(contentRoot, "sources"))).filter((name) => name.endsWith(".json"));
const sources = new Set((await Promise.all(sourceNames.map((name) => readJson(join(contentRoot, "sources", name))))).map((record) => record.id));
const signalNames = (await readdir(join(contentRoot, "signals"))).filter((name) => name.endsWith(".mdx"));
const signalTexts = await Promise.all(signalNames.map((name) => readFile(join(contentRoot, "signals", name), "utf8")));
const signalIds = new Set(signalTexts.map((text) => text.match(/^id:\s*["']?([^\r\n"']+)/m)?.[1]).filter(Boolean));

check(p181.canonical_topic_resources.length === 17 && unique(p181.canonical_topic_resources.map((record) => record.topic_id)).length === 17, "Phase 181 must have seventeen unique canonical topic resources.");
check(p181.counts.validated_baseline_html_routes_governed === 7014 && p181.baseline_binding.phase_180_receipt_id?.startsWith("180-LOCAL-VALIDATION-"), "Phase 181 must preserve the Phase 180 7,014-route validated baseline binding.");
check(p181.canonical_topic_resources.every((record) => record.canonical_answer.length >= 2 && record.decisive_evidence.length >= 3 && record.claim_boundaries.length >= 3), "Phase 181 canonical records are not substantively populated.");

check(p182.counts.signals_total === 1406 && p182.counts.published_signals === 1121 && p182.counts.in_review_signals === 285, "Phase 182 must preserve the exact 1,406 = 1,121 + 285 signal split.");
check(p182.backlog_items.length === 285 && p182.backlog_items.filter((record) => record.first_pass_cohort).length === 100, "Phase 182 requires 285 backlog records and a 100-record first-pass cohort.");
check(p182.counts.source_profiles_structurally_parsed === 830 && p182.source_registry_audit.network_currency_checks_run === 0, "Phase 182 source structural/network boundary is invalid.");
check(p182.counts.source_profiles_with_structural_gaps === 24 && p182.source_registry_audit.structural_field_missing_counts.source_owner === 24, "Phase 182 must expose the current twenty-four missing source-owner fields as structural gaps.");
check(p182.backlog_items.every((record) => signalIds.has(record.signal_id) && record.source_ids.every((id) => sources.has(id))), "A Phase 182 signal or source binding is missing.");

check(p183.mission_portfolios.length === 4 && p183.named_case_files.length === 8, "Phase 183 requires four portfolios and eight named cases.");
check(p183.mission_portfolios.every((record) => record.priority_mission_ids.length === 4), "Each Phase 183 portfolio must bind four missions.");
check(p183.named_case_files.every((record) => signalIds.has(record.signal_id) && record.source_ids.every((id) => sources.has(id))), "A Phase 183 case has an invalid signal or source binding.");

check(p184.topic_editions.length === 17 && unique(p184.topic_editions.map((record) => record.topic_id)).length === 17, "Phase 184 requires seventeen unique topic editions.");
check(p184.topic_editions.every((record) => record.canonical_synthesis.length >= 2 && record.evidence_chain.length > 0 && record.horizon_questions.length === 4), "A Phase 184 topic edition lacks required substantive sections.");

check(p185.place_system_dossiers.length === 18 && unique(p185.place_system_dossiers.map((record) => record.jurisdiction_id)).length === 18, "Phase 185 requires eighteen unique jurisdiction dossiers.");
check(p185.place_system_dossiers.every((record) => record.system_layers.length === 4 && record.source_ids.length === 4 && record.source_ids.every((id) => sources.has(id))), "Every Phase 185 dossier must bind four valid authority/source layers.");
check(p185.place_system_dossiers.every((record) => record.place_stage === null && record.causal_conclusion === null && record.score === null && record.rank === null), "Phase 185 inferred a place stage, cause, score, or rank.");

const casesByTopic = Object.groupBy(p186.delivery_case_files, (record) => record.topic_id);
check(p186.delivery_case_files.length === 34 && Object.keys(casesByTopic).length === 17 && Object.values(casesByTopic).every((records) => records.length === 2), "Phase 186 requires two cases for each of seventeen topics.");
check(p186.delivery_case_files.filter((record) => record.case_slot === "International authority-to-delivery case").length === 17, "Phase 186 requires seventeen international authority cases.");
check(p186.delivery_case_files.every((record) => record.source_ids.every((id) => sources.has(id))), "A Phase 186 case references an unknown source.");
check(p186.delivery_case_files.filter((record) => record.case_slot === "International authority-to-delivery case").every((record) => record.current_stage === null), "Phase 186 inferred an international delivery stage.");

const passportsByTopic = Object.groupBy(p187.candidate_passports, (record) => record.topic_id);
check(p187.candidate_passports.length === 34 && Object.keys(passportsByTopic).length === 17 && Object.values(passportsByTopic).every((records) => records.length === 2), "Phase 187 requires two passports for each of seventeen topics.");
check(p187.candidate_passports.every((record) => record.compatibility_tests.length === 6 && record.compatibility_tests.every((test) => test.outcome === null) && record.observation_values.length === 0 && record.admission_outcome === null && record.admitted_series_id === null), "Phase 187 prefilled an observation or decision or has an incomplete test matrix.");
check(p187.candidate_passports.every((record) => signalIds.has(record.signal_id) && record.source_ids.every((id) => sources.has(id))), "A Phase 187 passport has an invalid upstream binding.");

const kinds = Object.groupBy(p188.edition_records, (record) => record.record_kind);
check(p188.edition_records.length === 36 && kinds["Flagship synthesis"]?.length === 1 && kinds["Executive topic summary"]?.length === 17 && kinds["Regional orientation brief"]?.length === 6 && kinds["Bounded cross-system comparison"]?.length === 12, "Phase 188 must contain 1 flagship + 17 topic + 6 region + 12 comparison records.");
check(kinds["Bounded cross-system comparison"].every((record) => record.comparison_verdict.includes("Context only")), "A Phase 188 comparison lacks its context-only verdict.");

const recordArrays = [
  p181.canonical_topic_resources, p182.backlog_items, p183.mission_portfolios, p183.named_case_files,
  p184.topic_editions, p185.place_system_dossiers, p186.delivery_case_files, p187.candidate_passports, p188.edition_records
];
const records = recordArrays.flat();
const ids = records.map((record) => Object.entries(record).find(([key]) => key.endsWith("_id"))?.[1]);
check(ids.every(Boolean) && unique(ids).length === ids.length, "Phase 181–188 primary record identities are missing or duplicated.");
const routes = records.map((record) => record.route ?? record.canonical_route);
check(routes.every((route) => route?.startsWith("/")) && unique(routes).length === routes.length, "Phase 181–188 detail routes are missing or duplicated.");

for (const [phase, name] of Object.entries(names)) {
  const slug = name.replace(`phase-${phase}-`, "").replace(".json", "");
  try { await access(join(workPackagesRoot, `phase-${phase}-${slug}.md`)); } catch { failures.push(`Phase ${phase} work package is missing.`); }
}

if (failures.length) throw new Error(`Phase 181–188 assertions failed:\n- ${failures.join("\n- ")}`);
console.log(`Phase 181–188 assertions passed: ${records.length} primary records, ${routes.length} unique detail routes, 8 exports, 285 evidence-backlog items, 18 global dossiers, 34 delivery cases, 34 longitudinal passports, and 36 edition records.`);
