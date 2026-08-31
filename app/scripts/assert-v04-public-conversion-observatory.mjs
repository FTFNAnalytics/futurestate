import { readFile, readdir } from "node:fs/promises";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const appRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const readJson = async (...parts) => JSON.parse(await readFile(join(...parts), "utf8"));
const [program, coverage, authority, encyclopedia, atlas, operatingCycle] = await Promise.all([
  readJson(appRoot, "src", "data", "v04-public-conversion-observatory.json"),
  readJson(appRoot, "src", "data", "phase-116-coverage-architecture.json"),
  readJson(appRoot, "src", "data", "phase-117-global-authority-graph.json"),
  readJson(appRoot, "src", "data", "phase-118-canonical-living-encyclopedia.json"),
  readJson(appRoot, "src", "data", "phase-119-deep-project-place-atlas.json"),
  readJson(appRoot, "src", "data", "phase-60-operating-cycle.json"),
]);

const failures = [];
const check = (condition, message) => { if (!condition) failures.push(message); };
const words = (value) => String(value ?? "").trim().split(/\s+/).filter(Boolean).length;

check(program.schema_version === "1.0" && program.dataset === "v04_public_conversion_observatory", "The v0.4 registry identity is invalid.");
check(program.version === "0.4" && program.record_status === "Published" && program.status === "Complete", "The v0.4 program must be a completed Published registry.");
check(program.effective_date === "2026-08-30", "The v0.4 registry must retain its actual build date.");
check(program.phases.length === 4 && program.phases.every((phase, index) => phase.phase === 116 + index && phase.status === "Complete"), "Phases 116–119 must all be complete and ordered.");
check(program.public_html_routes.length === 189 && new Set(program.public_html_routes).size === 189, "v0.4 must expose 189 unique HTML reading routes.");
check(program.public_json_exports.length === 5 && new Set(program.public_json_exports).size === 5, "v0.4 must expose five unique JSON exports.");

check(coverage.counts.topics === 17 && coverage.counts.conversion_stages === 8, "Phase 116 must define seventeen topics and the eight-stage conversion chain.");
check(coverage.counts.claim_types === 12 && coverage.counts.quality_dimensions === 10, "Phase 116 must define twelve claim types and ten quality dimensions.");
check(coverage.counts.priority_questions === 68 && coverage.priority_questions.length === 68, "Phase 116 must contain sixty-eight prioritized content questions.");
const canonicalEntities = Object.values(coverage.entity_registry).flat();
check(canonicalEntities.length === 56 && new Set(canonicalEntities.map((record) => record.canonical_id)).size === 56, "Phase 116 must contain fifty-six unique canonical entities.");

check(authority.jurisdictions.length === 20 && authority.rails.length === 80, "Phase 117 must contain twenty jurisdictions and eighty authority rails.");
check(authority.topic_coverage.length === 17 && authority.stage_coverage.length === 8, "Phase 117 must cover all topics and all eight canonical stages.");
check(authority.rails.every((rail) => rail.mapping_state === "Mapped candidate authority rail" && rail.artifact_review_state === "Exact artifact review required"), "Every authority rail must remain discovery-only pending exact-artifact review.");
const phase117SourceFiles = (await readdir(join(appRoot, "src", "content", "sources"))).filter((name) => name.startsWith("source-117-global-") && name.endsWith(".json"));
check(phase117SourceFiles.length === 80, "Phase 117 must add exactly eighty source records.");
for (const filename of phase117SourceFiles) {
  const source = await readJson(appRoot, "src", "content", "sources", filename);
  check(source.monitoring_status === "Candidate", `${source.id} advanced beyond Candidate without exact-artifact review.`);
}

const chapters = [...encyclopedia.topic_chapters, ...encyclopedia.foundation_chapters];
check(encyclopedia.topic_chapters.length === 17 && encyclopedia.foundation_chapters.length === 10 && chapters.length === 27, "Phase 118 must contain seventeen topic chapters and ten foundation chapters.");
check(new Set(chapters.map((chapter) => chapter.slug)).size === 27, "Phase 118 chapter slugs must be unique.");
for (const chapter of chapters) {
  check(chapter.executive_synthesis.length >= 2 && words(chapter.executive_synthesis.join(" ")) >= 65, `${chapter.chapter_id} needs a substantive authored synthesis.`);
  check(chapter.conversion_chain.length >= 4, `${chapter.chapter_id} needs a visible conversion chain.`);
  check(chapter.contested_interpretations.length >= 2, `${chapter.chapter_id} needs contested interpretations.`);
  check(chapter.decisive_evidence.length >= 3 && chapter.claim_boundaries.length >= 3, `${chapter.chapter_id} needs decisive-evidence and claim-boundary sections.`);
  check(chapter.evidence_signal_ids.length >= 4, `${chapter.chapter_id} needs at least four explicit evidence-signal links.`);
}

check(atlas.projects.length === 24 && atlas.places.length === 15, "Phase 119 must contain twenty-four projects and fifteen places.");
check(atlas.projects.filter((record) => record.coverage.tier_id === "Tier A").length === 8, "Phase 119 must preserve eight governed project files.");
check(atlas.places.filter((record) => record.coverage.tier_id === "Tier A").length === 5, "Phase 119 must preserve five governed place profiles.");
for (const record of [...atlas.projects, ...atlas.places]) {
  check(record.interpretation_boundary && record.evidence_rails.signal_ids.length > 0 && record.evidence_rails.source_ids.length > 0, `${record.atlas_project_id ?? record.atlas_place_id} lacks a boundary or evidence lineage.`);
  check(record.conversion.stop_rule && record.conversion.exact_next_artifact, `${record.atlas_project_id ?? record.atlas_place_id} lacks a stop rule or next-artifact statement.`);
}

const futureCycleItems = operatingCycle.records.filter((record) => record.scheduled_check_date > "2026-08-30");
check(futureCycleItems.length === 11, "The retained Phase 60 schedule must contain eleven future gates after 2026-08-30.");
check(futureCycleItems.every((record) => record.decision_status === "scheduled" && record.decision_date === null && record.receipt_id === null), "v0.4 must not predate or decide a future Phase 60 gate.");
check(program.publication_boundaries.some((boundary) => boundary.includes("No Phase 60 future evidence gate")), "The aggregate v0.4 boundary must state the future-gate non-mutation rule.");

if (failures.length) {
  console.error("FTFN v0.4 assertions failed:");
  failures.forEach((failure) => console.error(`- ${failure}`));
  process.exit(1);
}

console.log("FTFN v0.4 assertions passed: 189 routes, 80 Candidate authority rails, 27 authored chapters, 24 project files, 15 place files, and eleven untouched future gates.");
