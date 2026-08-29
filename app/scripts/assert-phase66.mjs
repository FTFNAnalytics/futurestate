import { readFile, readdir } from "node:fs/promises";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

const appRoot = fileURLToPath(new URL("..", import.meta.url));
const readJson = async (...parts) => JSON.parse(await readFile(join(appRoot, ...parts), "utf8"));
const readText = async (...parts) => readFile(join(appRoot, ...parts), "utf8");
const failures = [];
const check = (condition, message) => { if (!condition) failures.push(message); };

const ledger = await readJson("src", "data", "phase-66-acceptance-repeat-operation-ledger.json");
const phase65 = await readJson("src", "data", "phase-65-content-expansion.json");
const matrix = await readJson("src", "data", "phase-64-conversion-stage-matrix.json");
const briefingFiles = (await readdir(join(appRoot, "src", "content", "briefings"))).filter((name) => name.endsWith(".mdx"));
const briefings = await Promise.all(briefingFiles.map(async (name) => {
  const text = await readText("src", "content", "briefings", name);
  return {
    id: text.match(/^id:\s*"([^"]+)"/m)?.[1],
    status: text.match(/^record_status:\s*"([^"]+)"/m)?.[1],
    signals: [...text.matchAll(/^\s+-\s+"(signal-[^"]+)"/gm)].map((match) => match[1]),
    text
  };
}));
const briefingById = new Map(briefings.map((briefing) => [briefing.id, briefing]));
const signalFiles = (await readdir(join(appRoot, "src", "content", "signals"))).filter((name) => name.endsWith(".mdx"));
const signals = await Promise.all(signalFiles.map(async (name) => {
  const text = await readText("src", "content", "signals", name);
  return {
    id: text.match(/^id:\s*"([^"]+)"/m)?.[1],
    status: text.match(/^record_status:\s*"([^"]+)"/m)?.[1]
  };
}));
const signalById = new Map(signals.map((signal) => [signal.id, signal]));

check(ledger.phase === "66" && ledger.schema_version === "1.0", "The Phase 66 ledger must preserve its stable identity and schema version.");
check(ledger.metrics.named_files === 8 && ledger.dossier_rows.length === 8, "Phase 66 must contain eight named-file dossiers.");
check(ledger.metrics.records_reviewed === 64 && ledger.record_reviews.length === 64, "Phase 66 must classify exactly sixty-four inherited records.");
check(ledger.metrics.stage_decisions === 32, "Phase 66 must make exactly thirty-two downstream decisions.");
check(ledger.dossier_rows.every((row) => row.stage_decisions.length === 4 && row.record_reviews.length === 8), "Each dossier must contain four stage decisions and eight record reviews.");

const reviews = ledger.record_reviews;
check(new Set(reviews.map((review) => review.review_id)).size === 64, "Phase 66 review IDs must be unique.");
check(new Set(reviews.map((review) => review.phase65_record_id)).size === 64, "Phase 66 must review sixty-four unique Phase 65 records.");
const inheritedIds = phase65.named_file_reporting_packs.flatMap((pack) => pack.phase65_record_ids).sort();
const reviewedIds = reviews.map((review) => review.phase65_record_id).sort();
check(inheritedIds.length === 64 && JSON.stringify(inheritedIds) === JSON.stringify(reviewedIds), "Phase 66 must classify every Phase 65 named-file record exactly once.");

const classCounts = Object.fromEntries(["Same-entity downstream evidence", "Stage-adjacent / held", "Context only"].map((value) => [value, reviews.filter((review) => review.review_class === value).length]));
check(classCounts["Same-entity downstream evidence"] === 2, "Phase 66 must identify exactly two same-entity downstream records.");
check(classCounts["Stage-adjacent / held"] === 15, "Phase 66 must retain exactly fifteen stage-adjacent or held records.");
check(classCounts["Context only"] === 47, "Phase 66 must classify exactly forty-seven records as context only.");

const decisions = ledger.dossier_rows.flatMap((row) => row.stage_decisions.map((decision) => ({ file_id: row.file_id, ...decision })));
const decisionCounts = Object.fromEntries(["Evidence Present", "Partial / Held", "Not Established"].map((value) => [value, decisions.filter((decision) => decision.decision_state === value).length]));
check(decisionCounts["Evidence Present"] === 1 && decisionCounts["Partial / Held"] === 4 && decisionCounts["Not Established"] === 27, "Phase 66 downstream decisions must remain 1 Evidence Present / 4 Partial or Held / 27 Not Established.");
check(decisions.every((decision) => decision.decision === "No Change"), "Every Phase 66 stage decision must explicitly preserve the prior state.");

const matrixByFile = new Map(matrix.file_rows.map((row) => [row.file_id, row]));
for (const decision of decisions) {
  const matrixCell = matrixByFile.get(decision.file_id)?.stage_cells.find((cell) => cell.stage_id === decision.phase64_stage_id);
  check(Boolean(matrixCell), `${decision.file_id} lacks inherited matrix cell ${decision.phase64_stage_id}.`);
  check(matrixCell?.cell_state === decision.decision_state, `${decision.file_id} ${decision.phase64_stage_id} does not match the Phase 64 matrix.`);
  check(decision.supporting_phase65_record_ids.every((id) => reviewedIds.includes(id)), `${decision.file_id} references a record outside the Phase 66 review shelf.`);
}

for (const dossier of ledger.dossier_rows) {
  const briefing = briefingById.get(dossier.acceptance_briefing_id);
  check(Boolean(briefing), `Missing Phase 66 dossier ${dossier.acceptance_briefing_id}.`);
  check(briefing?.status === "Published", `${dossier.acceptance_briefing_id} must be Published.`);
  check((briefing?.text ?? "").includes("## Four downstream tests") && (briefing?.text ?? "").includes("## Record-level review") && (briefing?.text ?? "").includes("## Exact next artifact"), `${dossier.acceptance_briefing_id} lacks its decision, record-review, or next-artifact section.`);
  check(briefing?.signals.every((id) => signalById.get(id)?.status === "Published"), `${dossier.acceptance_briefing_id} must link only Published signals.`);
  const canonical = briefingById.get(dossier.canonical_briefing_id);
  check((canonical?.text ?? "").includes("## Phase 66 acceptance and repeat-operation test"), `${dossier.canonical_briefing_id} lacks its Phase 66 downstream section.`);
}

for (const id of ["briefing-acceptance-watch-002-eight-files-four-tests", "briefing-repeat-operation-watch-001-after-acceptance"]) {
  check(briefingById.get(id)?.status === "Published", `${id} must exist and be Published.`);
}

const map = await readJson("src", "content", "dependency-maps", "acceptance-is-not-repeat-operation.json");
check(map.id === "dependency-map-acceptance-is-not-repeat-operation" && map.record_status === "Published", "The Phase 66 dependency map must exist and be Published.");
check(map.nodes.length === 5 && map.links.length === 4, "The Phase 66 dependency map must contain five nodes and four links.");

for (const file of [
  "local-us-southwest-chip-corridor.mdx",
  "local-ontario-real-estate.mdx",
  "local-northern-virginia-data-center-corridor.mdx",
  "local-florida-space-coast-launch-corridor.mdx",
  "local-nevada-lithium-processing-corridor.mdx"
]) {
  check((await readText("src", "content", "local-systems", file)).includes("## Phase 66 downstream evidence boundary"), `${file} lacks its Phase 66 evidence boundary.`);
}

const pathwayExpectations = new Map([
  ["local-conversion-southwest-ontario.json", ["briefing-acceptance-dossier-001-tsmc-arizona", "briefing-acceptance-dossier-002-toronto-24-254930"]],
  ["chips-compute-research-to-fab.json", ["briefing-acceptance-dossier-001-tsmc-arizona"]],
  ["industrial-water-agreement-to-reuse-operation.json", ["briefing-acceptance-dossier-001-tsmc-arizona"]],
  ["northern-virginia-compute-to-service.json", ["briefing-acceptance-dossier-003-northern-virginia-large-load"]],
  ["space-coast-plan-to-mission.json", ["briefing-acceptance-dossier-004-space-coast-authority"]],
  ["nevada-lithium-authorization-to-output.json", ["briefing-acceptance-dossier-005-nevada-lithium"]],
  ["policy-standards-to-implementation.json", ["briefing-acceptance-dossier-006-gsa-pqc", "briefing-acceptance-dossier-007-nist-aria"]],
  ["ai-infrastructure-policy-to-assurance.json", ["briefing-acceptance-dossier-007-nist-aria"]],
  ["autonomy-regulation-to-service.json", ["briefing-acceptance-dossier-008-waymo-california"]],
  ["cross-corridor-authorization-to-operation.json", ledger.dossier_rows.map((row) => row.acceptance_briefing_id).concat(["briefing-acceptance-watch-002-eight-files-four-tests", "briefing-repeat-operation-watch-001-after-acceptance"])]
]);
for (const [file, briefingIds] of pathwayExpectations) {
  const pathway = await readJson("src", "content", "reader-pathways", file);
  check(briefingIds.every((id) => pathway.briefing_ids.includes(id)), `${file} lacks one or more Phase 66 briefing bindings.`);
  check(pathway.dependency_map_ids.includes(map.id), `${file} lacks the Phase 66 dependency map binding.`);
}

const allCells = matrix.file_rows.flatMap((row) => row.stage_cells);
check(allCells.filter((cell) => cell.cell_state === "Evidence Present").length === 16, "Phase 66 must preserve all sixteen Evidence Present matrix cells.");
check(allCells.filter((cell) => cell.cell_state === "Partial / Held").length === 8, "Phase 66 must preserve all eight Partial / Held matrix cells.");
check(allCells.filter((cell) => cell.cell_state === "Not Established").length === 40, "Phase 66 must preserve all forty Not Established matrix cells.");
check(matrix.file_rows.every((row) => row.stage_cells.find((cell) => cell.stage_id === "64-STAGE-08-OUTCOME")?.cell_state === "Not Established"), "All eight named-file outcome states must remain open and Not Established.");
for (const key of ["matrix_cells_advanced", "new_sources", "new_signals", "signal_promotions", "receipts_created", "public_exports_added", "scores_created", "rankings_created"]) {
  check(ledger.metrics[key] === 0, `Phase 66 boundary metric ${key} must remain zero.`);
}

if (failures.length) {
  console.error("Phase 66 assertions failed:");
  failures.forEach((failure) => console.error(`- ${failure}`));
  process.exit(1);
}

console.log("Phase 66 assertions passed: 64 inherited records classified (2 same-entity downstream / 15 stage-adjacent or held / 47 context only), 32 decisions preserved (1 Evidence Present / 4 Partial or Held / 27 Not Established), 8 Published dossiers, 2 Published reader guides, 1 Published dependency map, 10 pathway bindings, 5 local-system boundaries, 0 matrix advances, and no source, signal, receipt, export, score, rank, or outcome-state changes.");
