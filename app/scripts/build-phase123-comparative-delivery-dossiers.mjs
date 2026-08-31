import { readFile, readdir, writeFile } from "node:fs/promises";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const appRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const workspaceRoot = resolve(appRoot, "..");
const dataRoot = join(appRoot, "src", "data");
const readJson = async (name) => JSON.parse(await readFile(join(dataRoot, name), "utf8"));
const unique = (values) => [...new Set(values.filter(Boolean))];
const date = "2026-08-30";
const frontmatter = (raw) => raw.split(/^---\s*$/m)[1] ?? "";
const scalar = (block, key) => {
  const match = block.match(new RegExp(`^${key}:\\s*(?:"([^"]*)"|'([^']*)'|([^\\r\\n]+))\\s*$`, "m"));
  return (match?.[1] ?? match?.[2] ?? match?.[3] ?? "").trim();
};

async function loadSignalState() {
  const directory = join(appRoot, "src", "content", "signals");
  const records = new Map();
  for (const name of await readdir(directory)) {
    if (!/\.mdx?$/.test(name)) continue;
    const block = frontmatter(await readFile(join(directory, name), "utf8"));
    const id = scalar(block, "id");
    if (!id) throw new Error(`Phase 123 cannot resolve a signal ID from ${name}`);
    if (records.has(id)) throw new Error(`Phase 123 found duplicate signal ID ${id}`);
    records.set(id, scalar(block, "record_status"));
  }
  return records;
}

const [v03, atlas, coverage] = await Promise.all([
  readJson("v03-editorial-program.json"),
  readJson("phase-119-deep-project-place-atlas.json"),
  readJson("phase-116-coverage-architecture.json"),
]);

const projectBySlug = new Map(atlas.projects.map((record) => [record.slug, record]));
const placeBySlug = new Map(atlas.places.map((record) => [record.slug, record]));
const topicById = new Map(coverage.coverage_matrix.map((record) => [record.topic_id, record]));
const signalStatusById = await loadSignalState();

const designs = {
  "compute-power-water": {
    project_slugs: ["tsmc-arizona", "northern-virginia-large-load"],
    place_slugs: ["northern-virginia-data-center-corridor", "us-southwest-chip-corridor"],
    shared_dependency: "Large-load electricity, water and site infrastructure have to be accepted at the named facility before announced compute or fabrication capacity can be read as durable operation.",
    comparable: "The files can be compared as evidence chains: named demand, public authority, infrastructure commitment, implementation milestone and the still-missing accepted-service record.",
    not_comparable: "Power demand, wafer output, water use and economic value use different entities, periods and denominators; they cannot be normalized into a project-performance comparison.",
    decisive: "Facility-specific accepted utility service, commissioning, qualification, customer acceptance and repeated output records with stable denominators.",
  },
  "permission-to-operation": {
    project_slugs: ["toronto-24-254930", "space-coast-authority-to-mission", "nevada-lithium-to-qualified-material", "tsmc-arizona"],
    place_slugs: ["ontario-real-estate", "florida-space-coast-launch-corridor", "nevada-lithium-battery-materials-corridor", "us-southwest-chip-corridor"],
    shared_dependency: "A decision, permit, tariff, loan or agreement changes what may proceed; later construction, inspection, acceptance and operation records establish what actually did.",
    comparable: "Each file exposes the boundary between permission or commitment and a later receiving-system event.",
    not_comparable: "Different legal instruments do not confer equivalent authority, and an approved land-use file cannot be compared as performance with a mine, launch site or semiconductor facility.",
    decisive: "The next case-specific enactment, condition-clearance, permit, inspection, commissioning, acceptance or recurring-operation artifact named in each Atlas file.",
  },
  "standards-to-adoption": {
    project_slugs: ["gsa-pqc-adoption", "nist-aria-assurance", "montana-bead-completed-quarter", "waymo-california-service"],
    place_slugs: ["montana-bead-delivery", "california-autonomous-mobility"],
    shared_dependency: "Published standards and program rules become adoption evidence only through named inventories, procurements, tests, accepted cutovers, users or services.",
    comparable: "The cases can be read against a common adoption chain from rule or framework to an identified receiving system and observable implementation event.",
    not_comparable: "Cryptographic migration, assurance evaluation, broadband adoption and autonomous service have incompatible units and acceptance authorities.",
    decisive: "Stable inventories, named receiving organizations, acceptance criteria, dated cutovers and repeated-use records that distinguish availability from adoption.",
  },
  "autonomous-service-accountability": {
    project_slugs: ["waymo-california-service", "amtrak-accessible-stations"],
    place_slugs: ["california-autonomous-mobility", "amtrak-accessibility-and-reliability"],
    shared_dependency: "A mobility service claim becomes publicly accountable when the operating geography, exposure, user access, service quantity, exceptions and safety denominator are all visible.",
    comparable: "Both files connect public authority to a named passenger-facing service and expose the additional records needed to evaluate access and reliability.",
    not_comparable: "Autonomous-vehicle miles and accessible-station delivery are different service units and must not be collapsed into one mobility score.",
    decisive: "Repeated service, accessibility, complaint, incident and exposure series with stable geography, fleet or station identities and revision notes.",
  },
  "research-to-assurance": {
    project_slugs: ["nist-aria-assurance", "gsa-pqc-adoption"],
    place_slugs: ["california-autonomous-mobility", "montana-bead-delivery"],
    shared_dependency: "An evaluation or technical standard matters operationally only when a named institution accepts it, implements controls and records performance and exceptions over time.",
    comparable: "The cases share a progression from technical framework to institutional use, with explicit separation between evaluation, authorization and operation.",
    not_comparable: "Test results, procurement actions, migration progress and service outcomes are distinct claim types and cannot substitute for one another.",
    decisive: "Receiving-institution acceptance, deployed configuration, monitoring, exception handling and repeated mission-use records tied to the evaluated system.",
  },
  "minerals-to-manufacturing": {
    project_slugs: ["nevada-lithium-to-qualified-material", "tsmc-arizona", "current-applications-capacity", "island-components-capacity"],
    place_slugs: ["nevada-lithium-battery-materials-corridor", "us-southwest-chip-corridor"],
    shared_dependency: "Industrial supply requires more than resource or facility announcements: permitting, construction, process qualification, customer acceptance and repeat output remain separate gates.",
    comparable: "The selected files can be compared as conversion sequences from financed or permitted capacity to qualified, receiver-visible production.",
    not_comparable: "Mineral tonnes, semiconductor wafers and component output are not compatible denominators and do not support a cross-industry productivity ranking.",
    decisive: "Named commissioning and process-qualification records, customer acceptance, repeat lots or units, yield and delivery data, and disclosed interruptions.",
  },
  "space-capacity-to-cadence": {
    project_slugs: ["space-coast-authority-to-mission", "f15ex-production-delivery", "kc46-readiness"],
    place_slugs: ["florida-space-coast-launch-corridor"],
    shared_dependency: "Authorized infrastructure and delivered assets become durable capacity only through receiving-system acceptance, available support systems and repeated mission performance.",
    comparable: "Each case distinguishes a capacity-enabling milestone from later mission or readiness evidence.",
    not_comparable: "Launch cadence, aircraft delivery and fleet availability have different assets, missions, periods and denominators.",
    decisive: "Named asset acceptance, range or base availability, repeat mission records, downtime and exception reporting for a stable cohort and period.",
  },
  "housing-infrastructure-conversion": {
    project_slugs: ["toronto-24-254930", "northern-virginia-large-load", "tsmc-arizona"],
    place_slugs: ["ontario-real-estate", "northern-virginia-data-center-corridor", "us-southwest-chip-corridor"],
    shared_dependency: "Land-use authority, servicing, finance and construction capacity have to converge before approvals become occupied homes or functioning facilities.",
    comparable: "The files reveal how local authority and infrastructure conditions create sequential delivery gates.",
    not_comparable: "Dwelling units, data-center load and fab capacity cannot be compared as equivalent outputs, and regional aggregates cannot stand in for project delivery.",
    decisive: "Enacted instruments, cleared conditions, permits, completed servicing, inspections, occupancy or accepted facility-service records at the named site.",
  },
  "climate-water-industrial-resilience": {
    project_slugs: ["tsmc-arizona", "nevada-lithium-to-qualified-material", "hanford-dflaw-operation", "moss-landing-battery-safety"],
    place_slugs: ["us-southwest-chip-corridor", "nevada-lithium-battery-materials-corridor", "hanford-waste-treatment", "california-battery-safety"],
    shared_dependency: "Climate and hazard context becomes an industrial-resilience claim only through site-level service, exposure, operating, interruption and recovery evidence.",
    comparable: "The cases can be checked for whether hazard, water, safety and operating boundaries are named at the same asset or receiving system.",
    not_comparable: "Hazard projections, water agreements, safety events and production performance describe different phenomena and cannot be blended into a resilience score.",
    decisive: "Compatible site-level resource use, hazard exposure, interruption, recovery and repeated-operation measures with asset identities and revision history.",
  },
  "workforce-to-qualified-capacity": {
    project_slugs: ["tsmc-arizona", "current-applications-capacity", "island-components-capacity", "monaghan-medical-capacity", "f35-production-readiness"],
    place_slugs: ["us-southwest-chip-corridor", "nnsa-two-site-production"],
    shared_dependency: "Training and employment become production capacity only when qualified roles, equipment, processes, accepted output and retention are linked at the named facility.",
    comparable: "The records can be compared for the presence or absence of links between workforce preparation and receiver-accepted output.",
    not_comparable: "Graduates, jobs, headcount, units delivered and availability are not interchangeable measures of capacity.",
    decisive: "Role-level qualification, placement and retention joined to line qualification, accepted output, yield and delivery cadence for the same facility and period.",
  },
  "finance-risk-and-infrastructure": {
    project_slugs: ["manatee-battery-storage", "gateway-battery-storage", "hornsdale-power-reserve", "nevada-lithium-to-qualified-material", "northern-virginia-large-load"],
    place_slugs: ["florida-utility-storage", "south-australia-grid-storage", "nevada-lithium-battery-materials-corridor", "northern-virginia-data-center-corridor"],
    shared_dependency: "Finance removes one constraint only when the funded scope reaches construction, commissioning, acceptance and service under a named allocation of risk.",
    comparable: "The cases show where financial commitment sits within a longer infrastructure-delivery chain.",
    not_comparable: "Loan values, utility investments, storage capacities and service obligations use different boundaries and cannot support a return or project-quality ranking.",
    decisive: "Financial close or obligation joined to expenditure, physical completion, acceptance, service, operating performance and disclosed risk allocation.",
  },
  "observation-to-outcome": {
    project_slugs: ["nist-aria-assurance", "amtrak-accessible-stations", "hanford-dflaw-operation", "montana-bead-completed-quarter", "nnsa-qualified-production"],
    place_slugs: ["amtrak-accessibility-and-reliability", "hanford-waste-treatment", "montana-bead-delivery", "nnsa-two-site-production"],
    shared_dependency: "An observation supports an outcome only after identity, method, period, denominator, recurrence, uncertainty and alternative explanations are explicit.",
    comparable: "The files can be compared as examples of how evidence advances—or stops—between a dated observation and an outcome claim.",
    not_comparable: "Stations, waste batches, broadband locations, production units and evaluation results are deliberately non-equivalent outcome units.",
    decisive: "Repeated compatible measures for stable entities and periods, documented revisions and uncertainty, and a bounded attribution design appropriate to the claim.",
  },
};

const takeRoundRobin = (records, field, perRecord = 3, limit = 18) => unique(records.flatMap((record) => record.evidence_rails[field].slice(0, perRecord))).slice(0, limit);
const takePublishedSignals = (records, perRecord = 3, limit = 18) => unique(records.flatMap((record) => record.evidence_rails.signal_ids
  .filter((id) => signalStatusById.get(id) === "Published")
  .slice(0, perRecord))).slice(0, limit);

const dossiers = v03.cross_system_stories.map((story, index) => {
  const design = designs[story.slug];
  if (!design) throw new Error(`Missing Phase 123 design for ${story.slug}`);
  const projects = design.project_slugs.map((slug) => projectBySlug.get(slug));
  const places = design.place_slugs.map((slug) => placeBySlug.get(slug));
  if ([...projects, ...places].some((record) => !record)) throw new Error(`Phase 123 has an unresolved Atlas slug for ${story.slug}`);
  const records = [...projects, ...places];
  const questionIds = unique(story.topic_ids.flatMap((topicId) => topicById.get(topicId)?.priority_question_ids ?? []));
  return {
    dossier_id: `123-DOSSIER-${String(index + 1).padStart(3, "0")}`,
    legacy_story_id: story.story_id,
    slug: story.slug,
    title: story.title,
    record_status: "Published",
    comparison_state: "Context-only matched delivery dossier",
    editorial_question: story.editorial_question,
    topic_ids: story.topic_ids,
    priority_question_ids: questionIds,
    atlas_project_ids: projects.map((record) => record.atlas_project_id),
    atlas_place_ids: places.map((record) => record.atlas_place_id),
    evidence_signal_ids: takePublishedSignals(records),
    evidence_source_ids: takeRoundRobin(records, "source_ids", 2, 24),
    shared_dependency: design.shared_dependency,
    comparison_passport: {
      identity: "Every row resolves to a Phase 119 Atlas ID and its Phase 116 canonical entity; nearby organizations, regions and programs are not silently merged.",
      period: "Each underlying record retains its own dated period. The dossier does not force asynchronous events into a common observation window.",
      unit_and_denominator: "No shared performance denominator has been admitted. The dossier compares evidence structure and stopping points only.",
      authority_and_provenance: "Signal and source IDs are inherited explicitly from the selected Atlas records; the dossier creates no source fact or evidence decision.",
      method_compatibility: "Context-only comparison of conversion stages, dependencies and missing artifacts; no effect size, causal estimate or normalized performance measure.",
      verdict: "Context only",
    },
    what_is_comparable: design.comparable,
    what_must_not_be_compared: design.not_comparable,
    decisive_next_evidence: design.decisive,
    reader_checklist: [
      "Confirm every named case resolves to the displayed canonical project or place ID.",
      "Keep each event at its source-supported conversion stage.",
      "Inspect the period, unit and denominator before comparing any quantity.",
      "Treat missing or incompatible evidence as a result, not permission to estimate.",
      "Follow each decisive next artifact before revising the comparison passport.",
    ],
    route: `/review/systems/${story.slug}/`,
    interpretation_boundary: "This dossier compares evidence paths and open gates. It does not rank projects or places, normalize incompatible measures, infer causation, or create an observation, outcome or operating decision.",
  };
});

const registry = {
  schema_version: "1.0",
  program_id: "FTFN-PHASE-123-COMPARATIVE-DELIVERY-DOSSIERS",
  phase: 123,
  title: "Matched delivery dossiers",
  effective_date: date,
  record_status: "Published",
  status: "Complete",
  summary: "Twelve existing cross-system stories now use explicit project, place, signal and source identities plus a comparison passport that makes compatibility and non-equivalence visible.",
  publication_boundary: "Phase 123 deepens twelve existing routes. It creates no new source fact, signal, observation, conversion decision, outcome, score, ranking or causal conclusion.",
  counts: {
    dossiers: dossiers.length,
    enhanced_existing_routes: dossiers.length,
    new_html_routes: 1,
    public_surfaces: dossiers.length + 1,
    evidence_signal_links: dossiers.reduce((sum, record) => sum + record.evidence_signal_ids.length, 0),
    evidence_source_links: dossiers.reduce((sum, record) => sum + record.evidence_source_ids.length, 0),
  },
  routes: {
    index: "/review/fieldbook/casebooks/",
    public_export: "/data/phase-123-comparative-delivery-dossiers.json",
    enhanced: dossiers.map((record) => record.route),
  },
  dossiers,
};

if (dossiers.some((record) => record.evidence_signal_ids.length < 2)) {
  throw new Error("Phase 123 requires at least two existing Published signals in every dossier.");
}
if (dossiers.some((record) => record.evidence_signal_ids.some((id) => signalStatusById.get(id) !== "Published"))) {
  throw new Error("Phase 123 refused to serialize a missing or non-Published signal.");
}

const update = {
  id: "update-2026-08-30-phase-123-comparative-delivery-dossiers",
  effective_date: date,
  entry_type: "Source Refresh",
  title: "Phase 123 makes twelve cross-system comparisons explicit",
  summary: `The twelve cross-system stories now resolve through declared project and place IDs, ${registry.counts.evidence_signal_links} Published signal links, and ${registry.counts.evidence_source_links} source links while retaining a non-ranking comparison passport.`,
  affected_record_ids: unique(dossiers.flatMap((record) => record.topic_ids)),
  related_paths: [registry.routes.index, registry.routes.public_export, ...registry.routes.enhanced],
  evidence_note: registry.publication_boundary,
  materiality: "No record-state change",
  publication_effect: `Adds one Fieldbook hub and materially deepens twelve existing cross-system routes with ${registry.counts.evidence_signal_links} Published signal links and ${registry.counts.evidence_source_links} resolved source links, without adding evidence or changing any upstream state.`,
  next_check_date: null,
  work_package: "docs/work-packages/phase-123-v05-comparative-delivery-dossiers.md",
};

const workPackage = `# Phase 123 — Matched Delivery Dossiers\n\n**Status:** Complete  \n**Effective date:** ${date}  \n**Program:** FTFN v0.5 — The Evidence Fieldbook\n\n## Purpose\n\nTurn the twelve existing cross-system stories into stable comparative reading files. The phase compares evidence structures and stopping points, not project performance.\n\n## Delivered\n\n- ${registry.counts.dossiers} explicit dossier records on the existing Phase 105 routes.\n- ${registry.counts.evidence_signal_links} existing Published signal links and ${registry.counts.evidence_source_links} inherited, resolved source links.\n- Every enhanced route exposes the exact source provenance rail; no non-Published signal is promoted or counted as Published context.\n- A comparison passport for identity, period, unit, denominator, provenance, method and verdict.\n- One Fieldbook index and one public JSON export.\n\n## Comparison boundary\n\nEvery dossier is fixed at \`Context only\`. No shared performance denominator, normalized measure, effect size, causal estimate, score or ranking is created. A dossier may reveal that evidence is incompatible or missing; it may not repair that gap by inference.\n\n## Completion standard\n\nPhase 123 is complete when all twelve Phase 105 story IDs resolve one-to-one, all selected projects and places resolve through Phase 119, every selected signal exists and is already Published, every source ID resolves and is exposed on the enhanced route, every passport preserves incompatible periods and denominators, and future evidence gates remain unchanged.\n`;

await Promise.all([
  writeFile(join(dataRoot, "phase-123-comparative-delivery-dossiers.json"), `${JSON.stringify(registry, null, 2)}\n`, "utf8"),
  writeFile(join(appRoot, "src", "content", "updates", "2026-08-30-phase-123-comparative-delivery-dossiers.json"), `${JSON.stringify(update, null, 2)}\n`, "utf8"),
  writeFile(join(workspaceRoot, "docs", "work-packages", "phase-123-v05-comparative-delivery-dossiers.md"), workPackage, "utf8"),
]);

console.log(`Phase 123 built: ${registry.counts.dossiers} dossiers, ${registry.counts.evidence_signal_links} signal links and ${registry.counts.evidence_source_links} source links.`);
