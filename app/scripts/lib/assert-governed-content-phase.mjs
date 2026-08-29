import { access, readFile } from "node:fs/promises";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const appRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..", "..");
const workspaceRoot = resolve(appRoot, "..");
const readJson = async (...parts) => JSON.parse(await readFile(join(...parts), "utf8"));
const readText = (...parts) => readFile(join(...parts), "utf8");
const exists = async (...parts) => { try { await access(join(...parts)); return true; } catch { return false; } };

export async function assertGovernedContentPhase(config) {
  const registry = await readJson(appRoot, "src", "data", config.registryFilename);
  const upstreamRegistry = await readJson(appRoot, "src", "data", config.upstreamRegistryFilename);
  const upstream = upstreamRegistry[config.upstreamFamilyKey];
  const manifest = await readJson(workspaceRoot, "deployment", "ftfn-v0.2-build.json");
  const failures = [];
  const check = (condition, message) => { if (!condition) failures.push(message); };
  const families = config.families.map((family) => registry[family.recordsKey]);

  check(registry.phase === String(config.phase) && registry.schema_version === "1.0" && registry.record_status === "Published" && registry.operating_state === "governed_empty_state", "Phase " + config.phase + " registry metadata is invalid.");
  check(registry.effective_date === config.date, "Phase " + config.phase + " has the wrong Edmonton calendar date.");
  check(families.every((records) => records.length === 8), "Phase " + config.phase + " must preserve four eight-record families.");
  check(config.families.map((family) => registry[family.gatesKey].length).join(",") === "20,22,22,24", "Phase " + config.phase + " must preserve an 88-gate chain.");
  for (const family of config.families) {
    check(registry[family.classesKey].length === 14 && registry[family.dimensionsKey].length === 12 && registry[family.safeguardsKey].length === 12, "Phase " + config.phase + " " + family.label + " taxonomies are incomplete.");
    if (family.testsKey) check(registry[family.testsKey].length === 12, "Phase " + config.phase + " long-horizon tests are incomplete.");
  }
  for (let index = 0; index < 8; index += 1) {
    for (let familyIndex = 0; familyIndex < config.families.length; familyIndex += 1) {
      const family = config.families[familyIndex];
      const record = families[familyIndex][index];
      const predecessor = familyIndex === 0 ? upstream[index] : families[familyIndex - 1][index];
      check(record.cohort_id === upstream[index].cohort_id && record.file_id === upstream[index].file_id && record.named_entity === upstream[index].named_entity, "Phase " + config.phase + " cohort identity drift at " + family.label + " index " + index + ".");
      check(record[family.predecessorLinkKey] === predecessor[family.predecessorIdKey], "Phase " + config.phase + " predecessor link drift at " + family.label + " index " + index + ".");
      check(record.record_status === "Published" && record.propagation_status === "not_started" && record.first_reviewer_id === null && record.second_reviewer_id === null && !record.automatic_score_allowed && !record.automatic_rank_allowed && record.phase64_cell_change === "none", "A Phase " + config.phase + " record crossed its review boundary.");
      check(record[family.stateKey].startsWith("Inactive") && record[family.decisionKey] === "Not Open", "A Phase " + config.phase + " decision opened prematurely.");
      check(record[family.checksKey].length === registry[family.gatesKey].length && record[family.checksKey].every((gate) => gate.decision_state === "Inactive"), "A Phase " + config.phase + " gate advanced prematurely.");
      check(record[family.classRecordsKey].length === 14 && record[family.dimensionRecordsKey].length === 12 && record[family.safeguardRecordsKey].length === 12, "A Phase " + config.phase + " record lost its taxonomy.");
      if (family.testRecordsKey) check(record[family.testRecordsKey].length === 12, "A Phase " + config.phase + " record lost its long-horizon tests.");
      for (const [key, value] of Object.entries(record)) {
        if (key.endsWith("_records") && !/(class|dimension|safeguard|test)_records$/.test(key)) check(Array.isArray(value) && value.length === 0, "Premature Phase " + config.phase + " evidence exists in " + key + ".");
        if (key.endsWith("_receipt_id")) check(value === null, "A premature Phase " + config.phase + " receipt exists in " + key + ".");
        if ((key.startsWith("automatic_") || key.endsWith("_allowed")) && typeof value === "boolean") check(value === false, "A Phase " + config.phase + " automation boundary is enabled in " + key + ".");
      }
    }
  }

  for (const slug of config.guides) check(await exists(appRoot, "src", "content", "briefings", "briefing-" + slug + ".mdx"), "Phase " + config.phase + " guide " + slug + " is missing.");
  for (const slug of config.maps) check(await exists(appRoot, "src", "content", "dependency-maps", slug + ".json"), "Phase " + config.phase + " map " + slug + " is missing.");
  const guideIds = config.guides.map((slug) => "briefing-" + slug);
  const mapIds = config.maps.map((slug) => "dependency-map-" + slug);
  for (const pathwayId of new Set(families[0].flatMap((record) => record.reader_pathway_ids))) {
    const pathway = await readJson(appRoot, "src", "content", "reader-pathways", pathwayId.replace("reader-pathway-", "") + ".json");
    check(guideIds.every((id) => pathway.briefing_ids.includes(id)) && mapIds.every((id) => pathway.dependency_map_ids.includes(id)), pathwayId + " omits Phase " + config.phase + " content.");
  }
  for (const id of new Set(families[0].map((record) => record.canonical_briefing_id))) check((await readText(appRoot, "src", "content", "briefings", id + ".mdx")).includes(config.canonicalHeading), id + " omits Phase " + config.phase + ".");
  for (const file of ["local-us-southwest-chip-corridor.mdx", "local-ontario-real-estate.mdx", "local-northern-virginia-data-center-corridor.mdx", "local-florida-space-coast-launch-corridor.mdx", "local-nevada-lithium-processing-corridor.mdx"]) check((await readText(appRoot, "src", "content", "local-systems", file)).includes(config.localHeading), file + " omits Phase " + config.phase + ".");
  for (const file of ["briefing-outcomes-watch-001-what-actually-changed.mdx", "briefing-decision-accountability-desk-001.mdx", "briefing-public-investment-doctrine-001.mdx", "briefing-procurement-vendor-lockin-public-options-001.mdx", "briefing-public-wealth-balance-sheet-001.mdx", "briefing-cooperatives-employee-ownership-public-employment-001.mdx", "briefing-worker-voice-organizing-collective-bargaining-001.mdx", "briefing-platform-gig-informal-contingent-work-001.mdx", "briefing-distributional-public-balance-sheets-001.mdx", "briefing-community-wealth-universal-supports-public-options-001.mdx", "briefing-cross-case-public-authority-001.mdx", "briefing-shared-public-value-allocation-001.mdx"]) check((await readText(appRoot, "src", "content", "briefings", file)).includes(config.operatingHeading), file + " omits Phase " + config.phase + " control.");

  check(await exists(appRoot, "src", "pages", "evidence", config.routeBase, "index.astro") && await exists(appRoot, "src", "pages", "evidence", config.routeBase, "[id].astro") && await exists(appRoot, "src", "pages", "data", config.routeBase + ".json.ts"), "Phase " + config.phase + " routes or export are missing.");
  const dataIndex = await readText(appRoot, "src", "pages", "data", "index.astro");
  check(dataIndex.includes(config.title) && dataIndex.includes(config.contractCountText), "The data index omits Phase " + config.phase + ".");
  const sitemap = await readText(appRoot, "src", "pages", "sitemap.xml.ts");
  check(sitemap.includes(config.sitemapVariable) && sitemap.includes("/evidence/" + config.routeBase + "/"), "The sitemap omits Phase " + config.phase + ".");
  const upstreamDetail = await readText(appRoot, "src", "pages", "evidence", config.upstreamRouteBase, "[id].astro");
  check(upstreamDetail.includes("Phase " + config.phase + " Destination") && upstreamDetail.includes("/evidence/" + config.routeBase + "/"), "The upstream detail routes omit the Phase " + config.phase + " handoff.");
  check(manifest.expected_build.static_pages >= config.minimumPages && manifest.expected_build.public_json_exports >= config.minimumExports && manifest.expected_build[config.syntheticManifestKey] === 2560, "The release manifest omits Phase " + config.phase + " totals.");
  for (const family of config.families) {
    check(manifest.expected_build[family.manifestCountKey] === 8 && manifest[family.manifestRoutesKey]?.length === 8, "The release manifest omits Phase " + config.phase + " " + family.label + " routes.");
  }
  check(await exists(workspaceRoot, "docs", "work-packages", config.workPackageFilename), "The Phase " + config.phase + " work package is missing.");
  if (failures.length) {
    console.error("Phase " + config.phase + " assertions failed with " + failures.length + " issue(s):");
    failures.forEach((failure) => console.error("- " + failure));
    process.exit(1);
  }
  console.log("Phase " + config.phase + " assertions passed: four eight-record inactive families, 88 gates per chain, exact taxonomies, 10 pathways, and 0 " + config.zeroLabel + ", score, ranking, or Phase 64 decisions.");
}
