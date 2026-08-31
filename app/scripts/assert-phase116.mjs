import { access, readFile } from "node:fs/promises";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const appRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const workspaceRoot = resolve(appRoot, "..");
const readJson = async (...parts) => JSON.parse(await readFile(join(...parts), "utf8"));
const program = await readJson(appRoot, "src", "data", "phase-116-coverage-architecture.json");
const v03 = await readJson(appRoot, "src", "data", "v03-editorial-program.json");
const v031 = await readJson(appRoot, "src", "data", "v031-content-expansion.json");
const phase60 = await readJson(appRoot, "src", "data", "phase-60-operating-cycle.json");
const phase64 = await readJson(appRoot, "src", "data", "phase-64-conversion-stage-matrix.json");

const failures = [];
const check = (condition, message) => { if (!condition) failures.push(message); };
const unique = (values) => new Set(values).size === values.length;

check(program.schema_version === "1.0" && program.phase === 116 && program.record_status === "Published", "Phase 116 must remain a Published schema 1.0 program.");
check(program.effective_date === "2026-08-30", "Phase 116 must retain its actual effective date.");
check(program.counts.topics === 17 && program.entity_registry.topics.length === 17, "The canonical topic registry must contain all seventeen topics.");
check(program.counts.editorial_local_systems === 15 && program.entity_registry.local_systems.length === 15, "The canonical local-system registry must contain all fifteen editorial place systems.");
check(program.counts.casebooks === 24 && program.entity_registry.casebooks.length === 24, "The canonical casebook registry must contain all twenty-four casebooks.");
check(program.counts.canonical_entities === 56, "The canonical registry must contain exactly fifty-six topic, local-system and casebook entities.");
check(program.counts.structured_local_systems === 5 && program.counts.editorial_portraits_requiring_promotion === 10, "The five structured and ten editorial local-system tiers must remain explicit.");
check(program.counts.structured_conversion_casebooks === 8 && program.counts.editorial_casebooks_requiring_promotion === 16, "The eight structured and sixteen editorial casebook tiers must remain explicit.");

const canonicalIds = Object.values(program.entity_registry).flat().map((record) => record.canonical_id);
check(unique(canonicalIds), "Canonical entity IDs must be globally unique.");
for (const [entityType, records] of Object.entries(program.entity_registry)) {
  const aliasOwners = new Map();
  let ambiguousAlias = false;
  records.forEach((record) => record.aliases.forEach((alias) => {
    const normalized = alias.trim().toLowerCase();
    if (aliasOwners.has(normalized) && aliasOwners.get(normalized) !== record.canonical_id) ambiguousAlias = true;
    aliasOwners.set(normalized, record.canonical_id);
  }));
  check(!ambiguousAlias, `Aliases must resolve to only one canonical entity within ${entityType}.`);
  check(records.every((record) => record.aliases.length >= 2 && record.public_routes.length >= 1), `${entityType} records require aliases and a public route.`);
}

const canonicalTopicIds = new Set(program.entity_registry.topics.map((record) => record.canonical_id));
check(v03.topics.every((record) => canonicalTopicIds.has(record.id)), "Every v0.3 topic must resolve to one canonical topic ID.");
const localLegacyIds = program.entity_registry.local_systems.flatMap((record) => record.legacy_ids);
check(v03.local_systems.every((record) => program.entity_registry.local_systems.some((item) => item.canonical_id === record.id)), "Every structured v0.3 local system must retain its canonical ID.");
check(v031.regions.every((record) => localLegacyIds.includes(record.portrait_id)), "Every Phase 112 portrait ID must resolve as a canonical local-system alias.");
const caseLegacyIds = program.entity_registry.casebooks.flatMap((record) => record.legacy_ids);
check(v03.casebooks.every((record) => caseLegacyIds.includes(record.file_id)), "Every Phase 61 conversion file must resolve from the canonical casebook registry.");
check(v031.casebooks.every((record) => caseLegacyIds.includes(record.casebook_id)), "Every Phase 113 casebook ID must resolve from the canonical casebook registry.");

const stageIds = program.conversion_stages.map((stage) => stage.stage_id);
check(stageIds.length === 8 && JSON.stringify(stageIds) === JSON.stringify(phase64.stage_taxonomy.map((stage) => stage.stage_id)), "Phase 116 must preserve the complete Phase 64 conversion-stage taxonomy in order.");
check(program.counts.claim_types === 12 && unique(program.claim_types.map((claim) => claim.claim_type_id)), "The claim taxonomy must contain twelve unique types.");
check(program.claim_types.every((claim) => claim.conversion_stage_ids.every((id) => stageIds.includes(id)) && claim.minimum_evidence && claim.boundary), "Every claim type must resolve to valid stages, minimum evidence and a boundary.");
check(program.counts.geography_scope_types === 9 && program.counts.current_geography_areas === 17, "Geography must expose nine scope types and seventeen current evidence areas.");
const geographyIds = new Set(program.geography_areas.map((area) => area.geography_id));
check(program.entity_registry.local_systems.every((record) => record.geography_ids.length >= 1 && record.geography_ids.every((id) => geographyIds.has(id))), "Every local system must resolve to a canonical geography area.");
check(program.entity_registry.casebooks.every((record) => record.geography_ids.length >= 1 && record.geography_ids.every((id) => geographyIds.has(id))), "Every casebook must resolve to at least one canonical geography area.");

check(program.counts.priority_questions === 68 && program.priority_questions.length === 68, "Phase 116 must publish sixty-eight priority questions.");
check(unique(program.priority_questions.map((question) => question.question_id)), "Priority question IDs must be unique.");
for (const topic of program.entity_registry.topics) {
  const questions = program.priority_questions.filter((question) => question.topic_id === topic.canonical_id);
  check(questions.length === 4, `${topic.label} must have exactly four priority questions.`);
  check(new Set(questions.map((question) => question.research_horizon)).size === 4, `${topic.label} must cover baseline, conversion, operation and outcome horizons.`);
  check(stageIds.every((stageId) => questions.some((question) => question.target_stage_ids.includes(stageId))), `${topic.label} must assign every conversion stage to a priority question.`);
  check(questions.every((question) => question.required_evidence.length >= 3 && question.completion_rule && question.interpretation_boundary), `${topic.label} questions need evidence, completion and interpretation contracts.`);
}

check(program.coverage_matrix.length === 17 && unique(program.coverage_matrix.map((row) => row.topic_id)), "The coverage matrix must contain one row per topic.");
check(program.coverage_matrix.every((row) => canonicalTopicIds.has(row.topic_id) && row.priority_question_ids.length === 4 && row.stage_question_map.length === 8), "Every matrix row must resolve a topic, four questions and eight stages.");
check(program.baseline.published_signals === 1121 && program.baseline.registered_sources === 715, "The baseline must freeze the Phase 115 corpus at 1,121 Published signals and 715 sources.");
check(program.counts.quality_dimensions === 10 && program.quality_dimensions.length === 10, "The quality baseline must contain ten independent dimensions.");
check(program.completion_rubric.states.length === 6 && program.completion_rubric.rule.includes("does not sum"), "The completion rubric must expose six non-aggregated states.");
check(program.publication_boundaries.some((item) => item.includes("Technology maturity and conversion evidence remain distinct")), "The maturity-versus-conversion boundary is required.");
check(program.publication_boundaries.some((item) => item.includes("Future Phase 60 evidence gates remain scheduled")), "The future-gate boundary is required.");

const futureCycleRecords = phase60.records.filter((record) => record.scheduled_check_date > program.effective_date);
check(futureCycleRecords.every((record) => record.decision_status === "scheduled" && !record.decision_date && !record.receipt_id), "A future Phase 60 gate was operated, decided or predated.");

check(program.phase_routes.length === 18 && unique(program.phase_routes), "Phase 116 must expose eighteen unique public routes.");
for (const path of [
  "src/pages/review/coverage/index.astro",
  "src/pages/review/coverage/[slug].astro",
  "src/pages/data/phase-116-coverage-architecture.json.ts",
  "src/content/updates/2026-08-30-phase-116-v04-coverage-architecture.json",
]) {
  try { await access(join(appRoot, path)); } catch { failures.push(`Missing Phase 116 file: ${path}`); }
}
try {
  await access(join(workspaceRoot, "docs", "work-packages", "phase-116-v04-coverage-architecture-canonical-identity-quality-baseline.md"));
} catch {
  failures.push("Missing Phase 116 work package.");
}

if (failures.length) {
  console.error("Phase 116 assertions failed:");
  failures.forEach((failure) => console.error(`- ${failure}`));
  process.exit(1);
}

console.log("Phase 116 assertions passed: 56 canonical entities, 68 priority questions, 8 preserved stages, 10 quality dimensions and 0 future-gate mutations.");
