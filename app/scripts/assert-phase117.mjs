import { access, readFile, readdir } from "node:fs/promises";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const appRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const workspaceRoot = resolve(appRoot, "..");
const readJson = async (...parts) => JSON.parse(await readFile(join(...parts), "utf8"));
const graph = await readJson(appRoot, "src", "data", "phase-117-global-authority-graph.json");
const failures = [];
const check = (condition, message) => { if (!condition) failures.push(message); };

check(graph.schema_version === "1.0" && graph.record_status === "Published", "Phase 117 must be a Published schema 1.0 registry.");
check(graph.effective_date === "2026-08-30", "Phase 117 must retain its actual mapping date.");
check(graph.jurisdictions.length === 20 && graph.counts.jurisdictions === 20, "Phase 117 requires twenty jurisdiction layers.");
check(graph.rails.length === 80 && graph.counts.authority_rails === 80, "Phase 117 requires eighty authority rails.");
check(new Set(graph.rails.map((item) => item.rail_id)).size === 80, "Authority rail IDs must be unique.");
check(new Set(graph.rails.map((item) => item.source_id)).size === 80, "Phase 117 source IDs must be unique.");
check(graph.jurisdictions.every((item) => item.rail_ids.length === 4), "Every jurisdiction must have four authority classes.");
check(graph.topic_coverage.length === 17 && graph.topic_coverage.every((item) => item.rail_ids.length >= 20), "All seventeen topics need broad international authority coverage.");
check(graph.stage_coverage.length >= 8, "The graph must cover the full conversion chain.");
check(graph.quality_bar.automatic_signal_creation_allowed === false && graph.quality_bar.automatic_publication_allowed === false, "Automated signal creation and publication must remain disabled.");
check(graph.rails.every((item) => item.official_url.startsWith("https://") && item.mapping_state === "Mapped candidate authority rail" && item.artifact_review_state === "Exact artifact review required"), "Every rail needs an HTTPS official entry point and explicit candidate boundary.");
check(graph.rails.every((item) => !Object.keys(item).some((key) => /receipt|outcome_value|score|rank|decision_status/.test(key))), "The authority graph must not contain decisions, receipts, outcomes, scores or rankings.");

const sourceFiles = (await readdir(join(appRoot, "src", "content", "sources"))).filter((name) => name.startsWith("source-117-global-") && name.endsWith(".json"));
check(sourceFiles.length === 80, `Expected eighty Phase 117 source files, found ${sourceFiles.length}.`);
for (const filename of sourceFiles) {
  const source = await readJson(appRoot, "src", "content", "sources", filename);
  check(source.monitoring_status === "Candidate", `${source.id} must remain Candidate until exact-artifact review.`);
  check(source.known_limitations.includes("not itself evidence"), `${source.id} lacks the portal-is-not-evidence boundary.`);
  check(graph.rails.some((rail) => rail.source_id === source.id && rail.official_url === source.url), `${source.id} is not joined to the canonical graph.`);
}

for (const path of [
  "src/pages/review/authority/index.astro",
  "src/pages/review/authority/jurisdictions/[slug].astro",
  "src/pages/review/authority/rails/[slug].astro",
  "src/pages/data/global-authority-graph.json.ts",
]) { try { await access(join(appRoot, path)); } catch { failures.push(`Missing Phase 117 route: ${path}`); } }
try { await access(join(workspaceRoot, "docs", "work-packages", "phase-117-v04-global-authority-graph.md")); } catch { failures.push("Missing Phase 117 work package."); }

if (failures.length) {
  console.error("Phase 117 assertions failed:");
  failures.forEach((failure) => console.error(`- ${failure}`));
  process.exit(1);
}
console.log("Phase 117 assertions passed: 20 jurisdiction layers, 80 Candidate authority rails, 17 topics, and no evidence-state mutation.");
