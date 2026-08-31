import { readFile, readdir } from "node:fs/promises";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import yaml from "js-yaml";

const appRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const dataRoot = join(appRoot, "src", "data");
const readJson = async (name) => JSON.parse(await readFile(join(dataRoot, name), "utf8"));
const [program, p125, p126, p127, p128, p129, missions, authority, acquisition, dossiers, workbenches, cycle] = await Promise.all([
  readJson("v06-open-evidence-review.json"),
  readJson("phase-125-evidence-annotation-ledger.json"),
  readJson("phase-126-mission-evidence-audits.json"),
  readJson("phase-127-project-place-conversion-biographies.json"),
  readJson("phase-128-topic-state-of-evidence-reviews.json"),
  readJson("phase-129-cross-system-evidence-syntheses.json"),
  readJson("phase-121-priority-research-missions.json"),
  readJson("phase-117-global-authority-graph.json"),
  readJson("phase-120-evidence-acquisition-packets.json"),
  readJson("phase-123-comparative-delivery-dossiers.json"),
  readJson("phase-124-topic-research-workbenches.json"),
  readJson("phase-60-operating-cycle.json"),
]);

const failures = [];
const check = (condition, message) => { if (!condition) failures.push(message); };
const sameSet = (a, b) => a.length === b.length && new Set(a).size === a.length && a.every((item) => b.includes(item));

check(program.program_id === "FTFN-V0.6-OPEN-EVIDENCE-REVIEW" && program.version === "0.6" && program.status === "Complete locally", "v0.6 identity or status is invalid.");
check(program.counts.substantive_surfaces === 224 && program.counts.new_html_routes === 6 && program.counts.enhanced_existing_routes === 218, "v0.6 route/surface counts must be 224 / 6 / 218.");
check(program.new_html_routes.length === 6 && new Set(program.new_html_routes).size === 6, "v0.6 must own six unique new HTML routes.");
check(program.enhanced_existing_routes.length === 218 && new Set(program.enhanced_existing_routes).size === 218, "v0.6 must own 218 unique enhanced routes.");
check(program.new_html_routes.every((route) => !program.enhanced_existing_routes.includes(route)), "v0.6 new and enhanced routes overlap.");
check(program.public_html_routes.length === 224 && new Set(program.public_html_routes).size === 224, "v0.6 public surface inventory is incomplete or duplicated.");
check(program.public_json_exports.length === 6 && new Set(program.public_json_exports).size === 6, "v0.6 must publish six unique JSON exports.");

check(p125.counts?.evidence_annotations === 82 && p125.counts?.mission_signal_links === 340 && p125.counts?.source_records_resolved === 114, "Phase 125 aggregate counts are incomplete.");
check(p126.counts?.mission_audits === 68 && p126.counts?.requirement_tests === 204, "Phase 126 aggregate counts are incomplete.");
check(p127.counts?.project_biographies === 24 && p127.counts?.place_biographies === 15 && p127.counts?.project_stage_cells === 192 && p127.counts?.place_system_assessments === 90, "Phase 127 aggregate counts are incomplete.");
check(p128.counts?.topic_reviews === 17 && p128.counts?.horizon_reviews === 68, "Phase 128 aggregate counts are incomplete.");
check(p129.counts?.syntheses === 12 && p129.counts?.compatibility_determinations === 60, "Phase 129 aggregate counts are incomplete.");

check(sameSet(program.enhanced_existing_routes, [
  ...p125.enhanced_existing_routes,
  ...p126.enhanced_existing_routes,
  ...p127.enhanced_existing_routes,
  ...p128.enhanced_existing_routes,
  ...p129.enhanced_existing_routes,
]), "The aggregate enhanced-route inventory differs from Phase 125–129.");

check(authority.rails.length === 80 && acquisition.acquisition_packets.length === 80 && acquisition.counts.exact_artifacts_admitted === 0, "v0.6 mutated the Candidate acquisition baseline.");
check(missions.missions.length === 68 && missions.missions.every((mission) => mission.answer_state === "Research packet assembled — answer not adjudicated"), "v0.6 mutated a canonical mission answer state.");
check(missions.missions.filter((mission) => mission.relationships.acquisition_packet_ids.length === 0).length === 12, "v0.6 hid or closed an acquisition gap.");
check(workbenches.counts.missions_with_acquisition_packets === 56 && workbenches.counts.missions_with_acquisition_coverage_gaps === 12, "v0.6 changed the workbench acquisition split.");
check(dossiers.dossiers.length === 12 && dossiers.dossiers.every((record) => record.comparison_passport.verdict === "Context only"), "v0.6 changed a comparison verdict.");
const future = cycle.records.filter((record) => record.scheduled_check_date > "2026-08-30");
check(future.length === 11 && future.every((record) => record.decision_status === "scheduled" && record.decision_date === null && record.receipt_id === null), "v0.6 operated or predated a future Phase 60 gate.");

const sourceFiles = (await readdir(join(appRoot, "src", "content", "sources"))).filter((name) => name.endsWith(".json"));
const sourceRecords = await Promise.all(sourceFiles.map(async (name) => JSON.parse(await readFile(join(appRoot, "src", "content", "sources", name), "utf8"))));
const sourceById = new Map(sourceRecords.map((record) => [record.id, record]));
check(authority.rails.every((rail) => sourceById.get(rail.source_id)?.monitoring_status === "Candidate"), "A Phase 117 Candidate source changed state.");

const signalFiles = (await readdir(join(appRoot, "src", "content", "signals"))).filter((name) => /\.mdx?$/.test(name));
const signalState = new Map();
for (const name of signalFiles) {
  const raw = await readFile(join(appRoot, "src", "content", "signals", name), "utf8");
  const frontmatter = raw.match(/^---\r?\n([\s\S]*?)\r?\n---/);
  if (!frontmatter) continue;
  const record = yaml.load(frontmatter[1]);
  signalState.set(record.id, record.record_status);
}
const annotationRecords = p125.evidence_annotations ?? p125.annotations ?? [];
check(annotationRecords.length === 82 && annotationRecords.every((record) => signalState.get(record.signal_id) === "Published"), "A Phase 125 annotation references a missing or non-Published signal.");

const forbidden = [];
const walk = (value, path = "v06") => {
  if (Array.isArray(value)) return value.forEach((item, index) => walk(item, `${path}[${index}]`));
  if (!value || typeof value !== "object") return;
  for (const [key, child] of Object.entries(value)) {
    if (/artifact_admission|observation_value|outcome_value|mission_answer|performance_score|performance_rank|causal_finding|recommendation_text|decision_receipt_id/i.test(key) && child !== null && child !== 0 && child !== false && !(Array.isArray(child) && child.length === 0)) forbidden.push(`${path}.${key}`);
    walk(child, `${path}.${key}`);
  }
};
[p125, p126, p127, p128, p129, program].forEach((record) => walk(record));
check(forbidden.length === 0, `v0.6 contains forbidden evidence-state fields: ${forbidden.join(", ")}`);

if (failures.length) {
  console.error("FTFN v0.6 assertions failed:");
  failures.forEach((failure) => console.error(`- ${failure}`));
  process.exit(1);
}

console.log("v0.6 assertions passed: 224 surfaces (6 new + 218 enhanced), 82 annotations, 68 mission audits, 39 biographies, 17 topic reviews, 12 context-only syntheses, 12 acquisition gaps and eleven future gates preserved.");
