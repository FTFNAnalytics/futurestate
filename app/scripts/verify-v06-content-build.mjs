import { readFile } from "node:fs/promises";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const appRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const distRoot = join(appRoot, "dist");
const readJson = async (...parts) => JSON.parse(await readFile(join(...parts), "utf8"));
const failures = [];
const check = (condition, message) => { if (!condition) failures.push(message); };
const routeFile = (route) => join(distRoot, route.replace(/^\//, ""), "index.html");

const [program, phase117, p125, p126, p127, p128, p129, sourcesExport, signalsExport] = await Promise.all([
  readJson(appRoot, "src", "data", "v06-open-evidence-review.json"),
  readJson(appRoot, "src", "data", "phase-117-global-authority-graph.json"),
  readJson(appRoot, "src", "data", "phase-125-evidence-annotation-ledger.json"),
  readJson(appRoot, "src", "data", "phase-126-mission-evidence-audits.json"),
  readJson(appRoot, "src", "data", "phase-127-project-place-conversion-biographies.json"),
  readJson(appRoot, "src", "data", "phase-128-topic-state-of-evidence-reviews.json"),
  readJson(appRoot, "src", "data", "phase-129-cross-system-evidence-syntheses.json"),
  readJson(distRoot, "data", "sources.json"),
  readJson(distRoot, "data", "signals.json"),
]);
const sitemap = await readFile(join(distRoot, "sitemap.xml"), "utf8");

check(program.program_id === "FTFN-V0.6-OPEN-EVIDENCE-REVIEW" && program.version === "0.6", "v0.6 identity is invalid.");
check(program.counts?.substantive_surfaces === 224 && program.new_html_routes?.length === 6 && program.enhanced_existing_routes?.length === 218, "v0.6 must expose 224 surfaces split 6 / 218.");
check(new Set(program.new_html_routes).size === 6 && new Set(program.enhanced_existing_routes).size === 218, "v0.6 route inventories contain duplicates.");
check(program.new_html_routes.every((route) => !program.enhanced_existing_routes.includes(route)), "v0.6 new and enhanced route inventories overlap.");
check(program.public_json_exports?.length === 6 && new Set(program.public_json_exports).size === 6, "v0.6 must publish six unique JSON exports.");

const readRoute = async (route, label) => {
  try {
    const html = await readFile(routeFile(route), "utf8");
    check(html.includes(`<link rel="canonical" href="https://ftfn.io${route}"`), `${route} has the wrong canonical URL.`);
    check(html.includes('<meta name="robots" content="index, follow"'), `${route} is not indexable.`);
    check(sitemap.includes(`https://ftfn.io${route}`), `${route} is missing from the sitemap.`);
    return html;
  } catch {
    failures.push(`Missing generated ${label}: ${route}`);
    return "";
  }
};

for (const route of program.new_html_routes) await readRoute(route, "v0.6 route");

for (const exportRoute of program.public_json_exports) {
  try {
    const value = await readJson(distRoot, exportRoute.replace(/^\//, ""));
    check(value?.schema_version === "1.0", `${exportRoute} must be a direct schema-1.0 export.`);
  } catch {
    failures.push(`Missing or invalid v0.6 export: ${exportRoute}`);
  }
}

const markerChecks = [
  [p125.evidence_annotations, (record) => record.signal_route, (record) => record.note_id, "Phase 125", "evidence annotation"],
  [p126.mission_audits, (record) => record.public_route, (record) => record.audit_id, "Phase 126", "mission audit"],
  [[...p127.project_biographies, ...p127.place_biographies], (record) => record.public_route, (record) => record.biography_id, "Phase 127", "delivery biography"],
  [p128.topic_reviews, (record) => record.public_route ?? record.route, (record) => record.review_id, "Phase 128", "topic review"],
  [p129.syntheses, (record) => record.public_route ?? record.route, (record) => record.synthesis_id, "Phase 129", "system synthesis"],
];
for (const [records, routeOf, idOf, marker, label] of markerChecks) {
  for (const record of records) {
    const route = routeOf(record);
    check(program.enhanced_existing_routes.includes(route), `${idOf(record)} is absent from the enhanced-route inventory.`);
    const html = await readRoute(route, label);
    check(html.includes(idOf(record)), `${route} does not expose ${idOf(record)}.`);
    check(html.includes(marker), `${route} does not expose its ${marker} marker.`);
  }
}

const publishedSignalIds = new Set((signalsExport.records ?? []).map((record) => record.id));
check(p125.evidence_annotations.every((record) => publishedSignalIds.has(record.signal_id)), "A Phase 125 annotation references a signal absent from the Published export.");
const sourceById = new Map((sourcesExport.records ?? []).map((record) => [record.id, record]));
check(phase117.rails.every((rail) => sourceById.get(rail.source_id)?.monitoring_status === "Candidate"), "A Phase 117 source advanced beyond Candidate.");

const hub = await readRoute("/review/v06/", "v0.6 hub");
const reviewIndex = await readRoute("/review/", "Review index");
const dataIndex = await readRoute("/data/", "data index");
check(/Open Evidence Review/i.test(hub) && /v0\.6/i.test(hub), "The v0.6 hub lacks its edition identity.");
check(reviewIndex.includes("/review/v06/") && /Open Evidence Review/i.test(reviewIndex), "The Review index does not surface v0.6.");
check(dataIndex.includes("/data/v06-open-evidence-review.json") && /v0\.6/i.test(dataIndex), "The data index does not surface the v0.6 export.");

if (failures.length) {
  console.error("FTFN v0.6 build verification failed:");
  failures.forEach((failure) => console.error(`- ${failure}`));
  process.exit(1);
}

console.log("FTFN v0.6 build verification passed: 6 new hubs, 218 enhanced canonical routes, six exports, exact record markers, Published-signal lineage, Candidate-source preservation, sitemap coverage, and edition discovery.");
