import { readdir, readFile, writeFile } from "node:fs/promises";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { computeV1refCandidateDigest, isValidV1refValidationReceipt } from "./lib/v1ref-candidate-digest.mjs";
import { v1refEffectiveDate, v1refPhaseDefinitions, v1refProgramId, v1refVersion } from "./lib/v1ref-config.mjs";
import { canonicalRecordSlug, recordId, unique, validateRegistryInventory } from "./lib/v1ref-records.mjs";

const appRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const dataRoot = join(appRoot, "src", "data");
const updatesRoot = join(appRoot, "src", "content", "updates");
const docsRoot = resolve(appRoot, "..", "docs", "work-packages");
const receiptsRoot = join(dataRoot, "phase-204-receipts");
const readJson = async (path) => JSON.parse(await readFile(path, "utf8"));

const phases = [];
for (const definition of v1refPhaseDefinitions) {
  const registry = await readJson(join(dataRoot, definition.file));
  if (registry.phase !== definition.phase) throw new Error(`${definition.file} declares Phase ${registry.phase}; expected ${definition.phase}.`);
  if (registry.schema_version !== "1.0") throw new Error(`${definition.file} must use schema_version 1.0.`);
  const inventory = validateRegistryInventory(registry);
  if (inventory.failures.length) throw new Error(`${definition.file} inventory failed:\n- ${inventory.failures.join("\n- ")}`);
  phases.push({ definition, registry, inventory });
}

const phaseRoutes = phases.flatMap(({ inventory }) => inventory.htmlRoutes);
const phaseExports = phases.flatMap(({ inventory }) => inventory.jsonExports);
const phaseRecordIds = phases.flatMap(({ inventory }) => inventory.records.map(recordId));
if (unique(phaseRecordIds).length !== phaseRecordIds.length) throw new Error("The Phase 181–204 primary-record inventory contains duplicate IDs.");

const programHub = "/review/v1ref/";
const referenceHub = "/reference/";
const aggregateExport = "/data/v1-public-reference-edition.json";
const editionSectionRoutes = phases.map(({ definition }) => `/review/v1ref/${definition.section}/`);
const editionDetailRoutes = phases.flatMap(({ definition, registry, inventory }) => inventory.records.map((record) => `/review/v1ref/${definition.section}/${canonicalRecordSlug(record, registry)}/`));
const referenceSectionRoutes = phases.map(({ definition }) => `/reference/${definition.section}/`);
const referenceDetailRoutes = phases.flatMap(({ definition, registry, inventory }) => inventory.records.map((record) => `/reference/${definition.section}/${canonicalRecordSlug(record, registry)}/`));

for (const { definition, registry, inventory } of phases) {
  const immutableHub = `/review/v1ref/${definition.section}/`;
  const stableHub = `/reference/${definition.section}/`;
  const update = {
    id: `update-${v1refEffectiveDate}-phase-${definition.phase}`,
    effective_date: v1refEffectiveDate,
    entry_type: definition.phase === 204 ? "Publication Promotion" : "Research Collection",
    title: `Phase ${definition.phase}: ${registry.title}`,
    summary: registry.summary,
    affected_record_ids: inventory.records.map(recordId),
    related_paths: unique([
      inventory.hub,
      inventory.exportRoute,
      immutableHub,
      stableHub,
      ...inventory.records.map((record) => record.route),
      ...inventory.records.map((record) => `/review/v1ref/${definition.section}/${canonicalRecordSlug(record, registry)}/`),
      ...inventory.records.map((record) => `/reference/${definition.section}/${canonicalRecordSlug(record, registry)}/`),
    ]),
    evidence_note: "This locally built reference layer organizes inherited evidence and prepares bounded research or review records. It does not predate an evidence result, owner decision, translation approval, public release, or v1 promotion.",
    materiality: "Material record change",
    publication_effect: `Registers ${inventory.records.length} inspectable records across their declared source paths, immutable v1ref paths, stable reference aliases, and one schema-1.0 JSON export without changing inherited evidence states.`,
    work_package: `docs/work-packages/${definition.workPackage}`,
  };
  await writeFile(join(updatesRoot, `${v1refEffectiveDate}-phase-${definition.phase}.json`), `${JSON.stringify(update, null, 2)}\n`, "utf8");
  try { await readFile(join(docsRoot, definition.workPackage), "utf8"); }
  catch { throw new Error(`Missing Phase ${definition.phase} work package ${definition.workPackage}.`); }
}

const p180 = await readJson(join(dataRoot, "phase-180-october-state-report-and-v1-promotion-gate.json"));
const p204 = phases.at(-1).registry;
const publicHtmlRoutes = unique([
  programHub,
  referenceHub,
  ...phaseRoutes,
  ...editionSectionRoutes,
  ...editionDetailRoutes,
  ...referenceSectionRoutes,
  ...referenceDetailRoutes,
]);
const canonicalRouteMap = { [programHub]: referenceHub, [referenceHub]: referenceHub };
for (const { definition, registry, inventory } of phases) {
  const immutableHub = `/review/v1ref/${definition.section}/`;
  const stableHub = `/reference/${definition.section}/`;
  canonicalRouteMap[stableHub] = stableHub;
  canonicalRouteMap[immutableHub] = stableHub;
  if (inventory.hub !== referenceHub) canonicalRouteMap[inventory.hub] = stableHub;
  for (const record of inventory.records) {
    const slug = canonicalRecordSlug(record, registry);
    const stableRoute = `/reference/${definition.section}/${slug}/`;
    canonicalRouteMap[stableRoute] = stableRoute;
    canonicalRouteMap[`/review/v1ref/${definition.section}/${slug}/`] = stableRoute;
    if (record.route !== inventory.hub) canonicalRouteMap[record.route] = stableRoute;
  }
}
for (const route of publicHtmlRoutes) {
  if (!canonicalRouteMap[route]) throw new Error(`Missing canonical-route mapping for ${route}.`);
}
const canonicalHtmlRoutes = unique(Object.values(canonicalRouteMap));
const publicJsonExports = unique([...phaseExports, aggregateExport]);
const publicationUpdateFiles = v1refPhaseDefinitions.map(({ phase }) => `${v1refEffectiveDate}-phase-${phase}.json`);
const primaryRecords = phaseRecordIds.length;

const aggregate = {
  schema_version: "1.0",
  program_id: v1refProgramId,
  version: v1refVersion,
  title: "FTFN Public Reference Edition",
  effective_date: v1refEffectiveDate,
  status: "Complete locally — validation pending; external release and v1 promotion held",
  summary: "A twenty-four-phase reference-grade expansion that reconciles the existing corpus, strengthens canonical topic and place coverage, prepares global authority and measurement reviews, documents failure and distribution questions, and packages the State of Future Systems without inventing future evidence or owner decisions.",
  counts: {
    phases: v1refPhaseDefinitions.length,
    primary_records: primaryRecords,
    public_html_routes: publicHtmlRoutes.length,
    detail_routes: primaryRecords,
    native_declared_routes: unique(phaseRoutes).length,
    immutable_edition_routes: 1 + editionSectionRoutes.length + editionDetailRoutes.length,
    canonical_reference_routes: 1 + referenceSectionRoutes.length + referenceDetailRoutes.length,
    canonical_index_routes: canonicalHtmlRoutes.length,
    public_json_exports: publicJsonExports.length,
    publication_updates: publicationUpdateFiles.length,
    canonical_topic_editions: phases.find(({ definition }) => definition.phase === 184)?.inventory.records.length ?? 0,
    question_briefs: phases.find(({ definition }) => definition.phase === 195)?.inventory.records.length ?? 0,
  },
  release_design: {
    operating_lane: "September and October evidence, desk, owner, and longitudinal decisions continue only on their lawful dates under Phases 165–180.",
    build_lane: "Phases 181–204 may publish bounded reference content, research contracts, comparison tests, and future edition structures without upgrading inherited evidence state.",
    canonical_navigation: referenceHub,
    immutable_edition: programHub,
    native_phase_routes: "Preserved and rendered as declared by each phase registry.",
  },
  baseline_phase180: {
    receipt_id: p180.local_validation_receipt?.receipt_id ?? null,
    artifact_digest: p180.local_validation_receipt?.artifact_digest ?? null,
    v1_promotion_state: p180.v1_promotion_state,
  },
  phases: phases.map(({ definition, registry, inventory }) => ({
    phase: definition.phase,
    title: registry.title,
    status: registry.build_status ?? registry.record_status ?? "Complete locally",
    primary_records: inventory.records.length,
    hub_route: `/review/v1ref/${definition.section}/`,
    reference_hub_route: `/reference/${definition.section}/`,
    declared_source_hub_route: inventory.hub,
    public_export: inventory.exportRoute,
    work_package: `docs/work-packages/${definition.workPackage}`,
  })),
  publication_boundaries: [
    "No future source check, outcome value, trend, causal conclusion, score, rank, owner disposition, translation approval, repository publication, hosted deployment, public launch, or v1 promotion is created by this accelerated build.",
    "Candidate authority rails and exact-artifact acquisition slots are research contracts until a dated source review binds the actual official artifact.",
    "Longitudinal candidates remain candidates unless identity, period, measure, denominator, method, revision, and acceptance compatibility all pass against real observations.",
    "Historical /review routes remain immutable editions; /reference/ provides a stable reader entry point without rewriting prior receipts.",
  ],
  candidate_digest: null,
  phase_204_wave_validation_receipt: p204.local_validation_receipt ?? null,
  local_validation_state: "Pending build",
  local_validation_receipt: null,
  owner_acceptance: false,
  github_publication_authorized: false,
  hosted_deployment_authorized: false,
  public_launch_authorized: false,
  v1_promotion_state: "Held",
  next_lawful_action: "Run the complete local validation sequence, then continue the dated September operating calendar without treating reference preparation as a returned evidence result.",
  canonical_route_map: canonicalRouteMap,
  canonical_html_routes: canonicalHtmlRoutes,
  public_html_routes: publicHtmlRoutes,
  public_json_exports: publicJsonExports,
  publication_update_files: publicationUpdateFiles,
};

const digest = await computeV1refCandidateDigest({ appRoot, aggregate });
aggregate.candidate_digest = digest;

let matchingReceipt = null;
try {
  const receiptFiles = (await readdir(receiptsRoot)).filter((name) => name.endsWith(".json")).sort().reverse();
  for (const name of receiptFiles) {
    const receipt = await readJson(join(receiptsRoot, name));
    if (isValidV1refValidationReceipt({ receipt, aggregate, candidateDigest: digest })) {
      matchingReceipt = receipt;
      break;
    }
  }
} catch (error) {
  if (error?.code !== "ENOENT") throw error;
}

if (matchingReceipt) {
  aggregate.status = "Complete locally — validation passed; external release and v1 promotion held";
  aggregate.local_validation_state = "Passed";
  aggregate.local_validation_receipt = matchingReceipt;
  aggregate.next_lawful_action = "Preserve the validated local candidate, continue only due evidence and owner gates on their lawful dates, and keep repository publication, hosting, public launch, and v1 promotion Held until explicitly authorized.";
}

await writeFile(join(dataRoot, "v1-public-reference-edition.json"), `${JSON.stringify(aggregate, null, 2)}\n`, "utf8");
console.log(`Built v1 reference aggregate: ${primaryRecords} primary records, ${publicHtmlRoutes.length} HTML routes, ${publicJsonExports.length} exports, and ${publicationUpdateFiles.length} updates (${aggregate.local_validation_state}).`);
