import { spawnSync } from "node:child_process";
import './assert-phase204-reader-completion.mjs';
import { readFile } from "node:fs/promises";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { computeV1refCandidateDigest } from "./lib/v1ref-candidate-digest.mjs";
import { v1refEffectiveDate, v1refPhaseDefinitions, v1refProgramId } from "./lib/v1ref-config.mjs";
import { canonicalRecordSlug, recordId, unique, validateRegistryInventory } from "./lib/v1ref-records.mjs";

const appRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");
for (const script of ["assert-phase181-188-content.mjs", "assert-phase189-196-content.mjs", "assert-phase197-204-content.mjs"]) {
  const run = spawnSync(process.execPath, [`./scripts/${script}`], { cwd: appRoot, stdio: "inherit", shell: false });
  if (run.error || run.status !== 0) throw new Error(`${script} failed (${run.error?.message ?? `exit ${run.status}`}).`);
}

const dataRoot = join(appRoot, "src", "data");
const updatesRoot = join(appRoot, "src", "content", "updates");
const readJson = async (path) => JSON.parse(await readFile(path, "utf8"));
const failures = [];
const check = (condition, message) => { if (!condition) failures.push(message); };
const phases = [];

for (const definition of v1refPhaseDefinitions) {
  const registry = await readJson(join(dataRoot, definition.file));
  const inventory = validateRegistryInventory(registry);
  check(registry.phase === definition.phase, `${definition.file} has the wrong phase identity.`);
  check(registry.schema_version === "1.0", `${definition.file} is not schema 1.0.`);
  check(inventory.failures.length === 0, `${definition.file}: ${inventory.failures.join("; ")}`);
  phases.push({ definition, registry, inventory });
}

const aggregate = await readJson(join(dataRoot, "v1-public-reference-edition.json"));
const allRecords = phases.flatMap(({ inventory }) => inventory.records);
const recordIds = allRecords.map(recordId);
const phaseRoutes = phases.flatMap(({ inventory }) => inventory.htmlRoutes);
const phaseExports = phases.flatMap(({ inventory }) => inventory.jsonExports);
const editionSectionRoutes = phases.map(({ definition }) => `/review/v1ref/${definition.section}/`);
const editionDetailRoutes = phases.flatMap(({ definition, registry, inventory }) => inventory.records.map((record) => `/review/v1ref/${definition.section}/${canonicalRecordSlug(record, registry)}/`));
const referenceSectionRoutes = phases.map(({ definition }) => `/reference/${definition.section}/`);
const referenceDetailRoutes = phases.flatMap(({ definition, registry, inventory }) => inventory.records.map((record) => `/reference/${definition.section}/${canonicalRecordSlug(record, registry)}/`));
check(v1refPhaseDefinitions.length === 24 && phases[0].registry.phase === 181 && phases.at(-1).registry.phase === 204, "The reference program must contain Phases 181–204 in order.");
check(unique(recordIds).length === recordIds.length, "The reference program contains duplicate primary-record IDs.");
check(aggregate.program_id === v1refProgramId && aggregate.schema_version === "1.0" && aggregate.version === "v1ref", "The aggregate identity is invalid.");
check(aggregate.counts.phases === 24 && aggregate.counts.primary_records === allRecords.length, "The aggregate phase or primary-record count is not derived from current registries.");
check(aggregate.public_html_routes.length === aggregate.counts.public_html_routes && unique(aggregate.public_html_routes).length === aggregate.public_html_routes.length, "The aggregate HTML inventory is not exact and unique.");
check(aggregate.public_json_exports.length === 25 && aggregate.counts.public_json_exports === 25 && unique(aggregate.public_json_exports).length === 25, "The aggregate must expose twenty-four phase exports and one aggregate export.");
check(phaseRoutes.every((route) => aggregate.public_html_routes.includes(route)) && phaseExports.every((route) => aggregate.public_json_exports.includes(route)), "The aggregate omits a phase route or export.");
check(editionSectionRoutes.every((route) => aggregate.public_html_routes.includes(route)) && editionDetailRoutes.every((route) => aggregate.public_html_routes.includes(route)), "The aggregate omits an immutable v1ref route.");
check(referenceSectionRoutes.every((route) => aggregate.public_html_routes.includes(route)) && referenceDetailRoutes.every((route) => aggregate.public_html_routes.includes(route)), "The aggregate omits a stable /reference/ route.");
check(unique(editionDetailRoutes).length === allRecords.length, "The immutable edition contains a duplicate canonical record slug.");
check(unique(referenceDetailRoutes).length === allRecords.length, "The stable reference layer contains a duplicate canonical record slug.");
check(aggregate.counts.detail_routes === allRecords.length, "The aggregate detail count must equal the exact primary-record inventory.");
check(aggregate.counts.immutable_edition_routes === 1 + editionSectionRoutes.length + editionDetailRoutes.length, "The immutable-edition route count is invalid.");
check(aggregate.counts.canonical_reference_routes === 1 + referenceSectionRoutes.length + referenceDetailRoutes.length, "The canonical-reference route count is invalid.");
check(Object.keys(aggregate.canonical_route_map ?? {}).length === aggregate.public_html_routes.length && aggregate.public_html_routes.every((route) => Boolean(aggregate.canonical_route_map[route])), "Every public HTML route must have one explicit canonical mapping.");
check(aggregate.canonical_html_routes?.length === 1 + referenceSectionRoutes.length + referenceDetailRoutes.length && unique(aggregate.canonical_html_routes).length === aggregate.canonical_html_routes.length, "The canonical HTML inventory must contain the stable reference root, all section hubs, and every unique record.");
check(aggregate.canonical_html_routes.every((route) => route.startsWith("/reference/")) && aggregate.counts.canonical_index_routes === aggregate.canonical_html_routes.length, "Only stable /reference/ routes may enter the canonical index inventory.");
check(aggregate.canonical_route_map["/reference/"] === "/reference/" && aggregate.canonical_route_map["/review/v1ref/"] === "/reference/", "The stable reference root must self-canonicalize and the immutable edition root must point to it.");
check(aggregate.publication_update_files.length === 24 && aggregate.counts.publication_updates === 24, "The aggregate must inventory twenty-four dated updates.");

for (const { definition, inventory } of phases) {
  const name = `${v1refEffectiveDate}-phase-${definition.phase}.json`;
  const update = await readJson(join(updatesRoot, name));
  const expected = inventory.records.map(recordId);
  check(update.id === `update-${v1refEffectiveDate}-phase-${definition.phase}` && update.effective_date === v1refEffectiveDate, `Phase ${definition.phase} update identity is invalid.`);
  check(update.affected_record_ids.length === expected.length && unique(update.affected_record_ids).length === expected.length && expected.every((id) => update.affected_record_ids.includes(id)), `Phase ${definition.phase} update does not bind its exact primary-record inventory.`);
}

const phase204 = phases.at(-1).registry;
const falseAuthorities = ["owner_acceptance", "github_publication_authorized", "hosted_deployment_authorized", "public_launch_authorized"];
for (const key of falseAuthorities) {
  check(aggregate[key] === false, `The aggregate overstates ${key}.`);
  if (Object.hasOwn(phase204, key)) check(phase204[key] === false, `Phase 204 overstates ${key}.`);
}
check(aggregate.v1_promotion_state === "Held", "The aggregate must keep v1 promotion Held.");
check(phase204.v1_public_reference_promotion_state === "Held", "Phase 204 must keep public-reference promotion Held.");
check(Object.values(phase204.owner_authority ?? {}).every((value) => value === false), "Phase 204 must not claim owner authority.");
check(Boolean(aggregate.baseline_phase180?.receipt_id) && Boolean(aggregate.baseline_phase180?.artifact_digest), "The reference program must bind the immutable Phase 180 receipt and digest.");
check(aggregate.phase_204_wave_validation_receipt?.receipt_type === "Local candidate validation", "The aggregate must preserve the bounded Phase 197–203 wave receipt separately from full-program validation.");
const currentDigest = await computeV1refCandidateDigest({ appRoot, aggregate });
check(aggregate.candidate_digest?.digest === currentDigest.digest, "The aggregate candidate digest does not match the exact Phase 181–204 artifacts.");
if (aggregate.local_validation_receipt) {
  check(aggregate.local_validation_state === "Passed", "A full validation receipt requires Passed local state.");
  check(aggregate.local_validation_receipt.receipt_type === "Full local reference validation", "The aggregate embeds the wrong validation receipt type.");
  check(aggregate.local_validation_receipt.validated_phase_range === "181–204", "The full receipt does not cover Phases 181–204.");
  check(aggregate.local_validation_receipt.artifact_digest === currentDigest.digest, "The full receipt does not bind the current candidate digest.");
} else {
  check(aggregate.local_validation_state === "Pending build", "An unreceipted aggregate must remain Pending build.");
}

if (failures.length) throw new Error(`Phase 181–204 assertions failed:\n- ${failures.join("\n- ")}`);
console.log(`Phase 181–204 assertions passed: ${allRecords.length} primary records, ${aggregate.public_html_routes.length} routes, 25 exports, 24 updates, and v1 Held.`);
