import { readFile, readdir, writeFile } from "node:fs/promises";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import yaml from "js-yaml";

const appRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const dataRoot = join(appRoot, "src", "data");
const contentRoot = join(appRoot, "src", "content");
const outputPath = join(dataRoot, "phase-119-deep-project-place-atlas.json");

const readJson = async (...parts) => JSON.parse(await readFile(join(...parts), "utf8"));
const readFrontmatter = async (path) => {
  const body = await readFile(path, "utf8");
  const match = body.match(/^---\r?\n([\s\S]*?)\r?\n---/);
  if (!match) throw new Error(`Missing frontmatter: ${path}`);
  return yaml.load(match[1]);
};
const unique = (values) => [...new Set(values)];

const [coverage116, projects61, events62, gates63, matrix64, program03, program031, cycle60] = await Promise.all([
  readJson(dataRoot, "phase-116-coverage-architecture.json"),
  readJson(dataRoot, "phase-61-project-conversion-registry.json"),
  readJson(dataRoot, "phase-62-conversion-event-ledgers.json"),
  readJson(dataRoot, "phase-63-conversion-gate-calendar.json"),
  readJson(dataRoot, "phase-64-conversion-stage-matrix.json"),
  readJson(dataRoot, "v03-editorial-program.json"),
  readJson(dataRoot, "v031-content-expansion.json"),
  readJson(dataRoot, "phase-60-operating-cycle.json"),
]);

const signalFiles = (await readdir(join(contentRoot, "signals"))).filter((name) => name.endsWith(".mdx"));
const sourceFiles = (await readdir(join(contentRoot, "sources"))).filter((name) => name.endsWith(".json"));
const localSystemFiles = (await readdir(join(contentRoot, "local-systems"))).filter((name) => name.endsWith(".mdx"));
const signals = await Promise.all(signalFiles.map((name) => readFrontmatter(join(contentRoot, "signals", name))));
const sources = await Promise.all(sourceFiles.map((name) => readJson(contentRoot, "sources", name)));
const localSystems = await Promise.all(localSystemFiles.map((name) => readFrontmatter(join(contentRoot, "local-systems", name))));
const signalById = new Map(signals.map((record) => [record.id, record]));
const sourceById = new Map(sources.map((record) => [record.id, record]));
const localSystemById = new Map(localSystems.map((record) => [record.id, record]));
const cycleById = new Map(cycle60.records.map((record) => [record.cycle_item_id, record]));

const sourcesForSignals = (signalIds) => unique(signalIds.flatMap((id) => {
  const signal = signalById.get(id);
  if (!signal) throw new Error(`Unknown curated signal ID: ${id}`);
  if (signal.record_status !== "Published") throw new Error(`Curated signal is not Published: ${id}`);
  return signal.source_ids;
}));

const originalProjectPlaceIds = {
  "61-PROJECT-TSMC-ARIZONA": ["119-PLACE-005"],
  "61-PROJECT-TORONTO-24-254930": ["119-PLACE-004"],
  "61-PROJECT-NOVA-LARGE-LOAD": ["119-PLACE-003"],
  "61-PROJECT-SPACE-COAST-AUTHORITY": ["119-PLACE-001"],
  "61-PROJECT-NEVADA-LITHIUM": ["119-PLACE-002"],
  "61-ADOPTION-GSA-PQC": [],
  "61-ADOPTION-NIST-ARIA": [],
  "61-ADOPTION-WAYMO-CALIFORNIA": ["119-PLACE-006"],
};

const expandedProjectConfig = [
  {
    casebook_id: "113-CASE-001",
    aliases: ["Manatee BESS"],
    signal_ids: [
      "signal-56b-manatee-capacity-panel",
      "signal-56c-manatee-constraints",
      "signal-56d-manatee-repeat-test",
      "signal-56i-eia923-monthly-operating-rail",
      "signal-56j-manatee-monthly-operation",
    ],
    related_place_ids: ["119-PLACE-014"],
    phase_60_cycle_ids: [],
  },
  {
    casebook_id: "113-CASE-002",
    aliases: ["Moss Landing"],
    signal_ids: [
      "signal-56b-moss-landing-capacity-panel",
      "signal-56c-moss-landing-constraints",
      "signal-56d-moss-landing-repeat-test",
      "signal-56k-moss-landing-corrective-action-status",
    ],
    related_place_ids: ["119-PLACE-015"],
    phase_60_cycle_ids: [],
  },
  {
    casebook_id: "113-CASE-003",
    aliases: ["Gateway Energy Storage"],
    signal_ids: [
      "signal-56b-gateway-capacity-panel",
      "signal-56c-gateway-constraints",
      "signal-56d-gateway-repeat-test",
    ],
    related_place_ids: ["119-PLACE-015"],
    phase_60_cycle_ids: [],
  },
  {
    casebook_id: "113-CASE-004",
    aliases: ["HPR"],
    signal_ids: [
      "signal-56e-hornsdale-power-reserve-alternative-test",
      "signal-56e-hornsdale-power-reserve-dossier",
      "signal-56e-hornsdale-power-reserve-panel",
      "signal-56h-hornsdale-final-operating-record",
      "signal-56j-hornsdale-event-operation",
    ],
    related_place_ids: ["119-PLACE-012"],
    phase_60_cycle_ids: [],
  },
  {
    casebook_id: "113-CASE-005",
    aliases: ["Victorian Big Battery", "VBB"],
    signal_ids: [
      "signal-56e-victorian-big-battery-panel",
      "signal-56e-victorian-big-battery-dossier",
      "signal-56e-victorian-big-battery-alternative-test",
    ],
    related_place_ids: ["119-PLACE-013"],
    phase_60_cycle_ids: [],
  },
  {
    casebook_id: "113-CASE-006",
    aliases: ["ESCRI Dalrymple BESS", "Dalrymple BESS"],
    signal_ids: [
      "signal-56e-dalrymple-escri-bess-alternative-test",
      "signal-56e-dalrymple-escri-bess-dossier",
      "signal-56e-dalrymple-escri-bess-panel",
      "signal-56g-dalrymple-operating-record-advance",
      "signal-56h-dalrymple-constraint-event",
      "signal-56j-dalrymple-march-constraint",
    ],
    related_place_ids: ["119-PLACE-012"],
    phase_60_cycle_ids: [],
  },
  {
    casebook_id: "113-CASE-007",
    aliases: ["F-35 production readiness"],
    signal_ids: [
      "signal-56e-f35-fort-worth-line-alternative-test",
      "signal-56e-f35-fort-worth-line-dossier",
      "signal-56e-f35-fort-worth-line-panel",
      "signal-56h-f35-delivery-capability-advance",
    ],
    related_place_ids: [],
    phase_60_cycle_ids: [],
  },
  {
    casebook_id: "113-CASE-008",
    aliases: ["F-15EX"],
    signal_ids: [
      "signal-56e-f15ex-st-louis-line-alternative-test",
      "signal-56e-f15ex-st-louis-line-dossier",
      "signal-56e-f15ex-st-louis-line-panel",
      "signal-56k-f15ex-ex16-portland-receipt",
    ],
    related_place_ids: [],
    phase_60_cycle_ids: [],
  },
  {
    casebook_id: "113-CASE-009",
    aliases: ["KC-46"],
    signal_ids: [
      "signal-56e-kc46-everett-line-alternative-test",
      "signal-56e-kc46-everett-line-dossier",
      "signal-56e-kc46-everett-line-panel",
      "signal-56j-kc46-readiness-plan",
    ],
    related_place_ids: [],
    phase_60_cycle_ids: [],
  },
  {
    casebook_id: "113-CASE-010",
    aliases: ["Current Applications"],
    signal_ids: [
      "signal-56b-current-applications-output-panel",
      "signal-56c-current-applications-drivers",
    ],
    related_place_ids: [],
    phase_60_cycle_ids: [],
  },
  {
    casebook_id: "113-CASE-011",
    aliases: ["Island Components"],
    signal_ids: [
      "signal-56b-island-components-output-panel",
      "signal-56c-island-components-drivers",
      "signal-56l-island-components-certified-employment",
    ],
    related_place_ids: [],
    phase_60_cycle_ids: [],
  },
  {
    casebook_id: "113-CASE-012",
    aliases: ["Monaghan Medical"],
    signal_ids: [
      "signal-56b-monaghan-medical-output-panel",
      "signal-56c-monaghan-medical-drivers",
      "signal-56d-monaghan-medical-repeat-test",
      "signal-56i-monaghan-program-commitment",
      "signal-56l-monaghan-medical-certified-project",
    ],
    related_place_ids: [],
    phase_60_cycle_ids: [],
  },
  {
    casebook_id: "113-CASE-013",
    aliases: ["Amtrak ADA station program", "Amtrak PIDS"],
    signal_ids: [
      "signal-57a-dot-amtrak-station-accessibility-fy2025",
      "signal-57b-amtrak-eight-station-final-completion-cohort",
      "signal-57b-amtrak-eleven-station-passenger-use-cohort",
      "signal-57b-amtrak-thirteen-accessible-boarding-ramp-deployments",
      "signal-57c-amtrak-pids-deployment-inventory",
      "signal-57c-amtrak-station-portfolio-coverage",
      "signal-57d-amtrak-pids-revision-series",
      "signal-57e-amtrak-digital-accessibility-defect-remediation",
      "signal-57e-amtrak-pids-cross-report-reconciliation",
      "signal-57f-amtrak-ada-responsibility-boundary",
      "signal-57f-amtrak-historical-pids-cohort-reconciliation",
      "signal-57g-amtrak-pids-120-station-status-registry",
    ],
    related_place_ids: ["119-PLACE-010"],
    phase_60_cycle_ids: ["60-CYCLE-AMTRAK-PIDS-CLOSEOUT", "60-CYCLE-AMTRAK-NAMED-ASSET-RELIABILITY"],
  },
  {
    casebook_id: "113-CASE-014",
    aliases: ["Hanford DFLAW"],
    signal_ids: [
      "signal-56z-hanford-dflaw-accepted-operation-sequence",
      "signal-57a-hanford-idf-regulator-confirmed-acceptance",
      "signal-57a-hanford-law-facility-regulator-confirmed-operation",
      "signal-57b-hanford-ecology-50000-gallons-34-containers",
      "signal-57b-hanford-joint-minutes-66-containers-shipped",
      "signal-57c-hanford-first-ilaw-disposal-boundary",
      "signal-57d-hanford-material-flow-stage-ledger",
      "signal-57d-hanford-monthly-waste-feed-series",
      "signal-57e-hanford-acceptable-glass-milestone",
      "signal-57f-hanford-container-progression-reconciliation",
      "signal-57g-hanford-fourteen-stage-dflaw-registry",
      "signal-57g-hanford-nine-observation-stage-ledger",
    ],
    related_place_ids: ["119-PLACE-009"],
    phase_60_cycle_ids: ["60-CYCLE-HANFORD-MATERIAL-BALANCE"],
  },
  {
    casebook_id: "113-CASE-015",
    aliases: ["Montana BEAD"],
    signal_ids: [
      "signal-57e-montana-bead-active-subscriber-test-control",
      "signal-57e-montana-bead-availability-acceptance-control",
      "signal-57e-montana-bead-latency-acceptance-control",
      "signal-57e-montana-bead-speed-acceptance-control",
      "signal-57f-montana-leo-active-subscriber-count-contract",
      "signal-57f-montana-leo-cpe-shipment-contract",
      "signal-57f-montana-leo-served-location-validation-contract",
      "signal-57f-montana-leo-ten-year-reporting-window",
      "signal-57g-montana-183-cai-project-denominator",
      "signal-57g-montana-68315-bsl-project-denominator",
      "signal-57g-montana-funding-and-reporting-contract-join",
      "signal-57g-montana-nineteen-subgrantee-identity-registry",
      "signal-57g-montana-thirty-two-deployment-project-registry",
    ],
    related_place_ids: ["119-PLACE-008"],
    phase_60_cycle_ids: ["60-CYCLE-MONTANA-COMPLETED-QUARTER"],
  },
  {
    casebook_id: "113-CASE-016",
    aliases: ["NNSA pit production"],
    signal_ids: [
      "signal-56w-nnsa-pit-production-project-cost-trail",
      "signal-56x-nnsa-lap4-baseline-change-series",
      "signal-56x-nnsa-major-project-portfolio-performance",
      "signal-56x-nnsa-srppf-subproject-baseline-series",
      "signal-56y-nnsa-lap4-fy2027-delivery-plan",
      "signal-56y-nnsa-srppf-transition-delivery-inputs",
      "signal-56z-lap4-first-glovebox-delivery",
      "signal-56z-srppf-demolition-training-delivery",
      "signal-57a-nnsa-w87-1-qualified-first-production-unit",
      "signal-57c-nnsa-project-program-baseline-boundary",
      "signal-57f-nnsa-current-r-and-d-capability-state",
      "signal-57f-nnsa-first-unit-current-capability-crosswalk",
      "signal-57f-nnsa-gao-baseline-status-reconciliation",
      "signal-57f-nnsa-two-site-capacity-target-boundary",
      "signal-57g-nnsa-capacity-qualification-acceptance-crosswalk",
      "signal-57g-nnsa-two-site-site-facility-registry",
    ],
    related_place_ids: ["119-PLACE-011"],
    phase_60_cycle_ids: [
      "60-CYCLE-NNSA-GAO-BASELINE",
      "60-CYCLE-NNSA-ACCEPTED-CAPACITY",
      "60-CYCLE-NNSA-RECURRING-QUALIFIED-RATE",
    ],
  },
];

const originalPlaceConfig = [
  {
    local_system_id: "local-florida-space-coast-launch-corridor",
    aliases: ["Florida Space Coast", "Space Coast launch corridor"],
    signal_ids: [
      "signal-faa-part450-operator-transition",
      "signal-faa-starship-lc39a-environmental-decision",
      "signal-kennedy-multiuser-master-plan",
      "signal-ksc-active-countdown-prescribed-burn",
      "signal-ksc-causeway-bridge-operational",
      "signal-nasa-simo-planned-spaceport-services-acquisition",
      "signal-shuttle-landing-facility-license-status-watch",
      "signal-slc40-final-environmental-decision",
      "signal-space-florida-lc46-site-license-renewal",
    ],
    related_project_ids: ["119-PROJECT-004"],
    phase_60_cycle_ids: ["60-CYCLE-SPACE-COAST-SLF-LICENCE"],
  },
  {
    local_system_id: "local-nevada-lithium-processing-corridor",
    aliases: ["Nevada lithium corridor", "Nevada battery-materials corridor"],
    signal_ids: [
      "signal-rhyolite-ridge-air-permit-validity-hold",
      "signal-rhyolite-ridge-doe-nepa-loan-boundary",
      "signal-rhyolite-ridge-federal-land-authorization",
      "signal-rhyolite-ridge-water-permit-preoperation-gates",
      "signal-thacker-pass-air-permit-compliance-contract",
      "signal-thacker-pass-doe-loan-financial-close",
      "signal-thacker-pass-federal-land-authorization",
      "signal-thacker-pass-reclamation-financial-assurance",
      "signal-thacker-pass-state-environmental-permit-stack",
    ],
    related_project_ids: ["119-PROJECT-005"],
    phase_60_cycle_ids: [],
  },
  {
    local_system_id: "local-northern-virginia-data-center-corridor",
    aliases: ["Northern Virginia data-center corridor", "NoVA large-load corridor"],
    signal_ids: [
      "signal-golden-mars-transmission-conditional-approval",
      "signal-loudoun-phase2-data-center-standards-watch",
      "signal-pjm-2026-large-load-forecast-uncertainty",
      "signal-scc-morrisville-wishing-star-transmission-application",
      "signal-virginia-data-center-air-permit-trail",
      "signal-virginia-data-center-load-concentration",
      "signal-virginia-deq-apg576-data-center-generator-controls",
      "signal-virginia-gs5-large-load-rate-class",
      "signal-virginia-project-raspberry-multi-permit-trail",
    ],
    related_project_ids: ["119-PROJECT-003"],
    phase_60_cycle_ids: ["60-CYCLE-LOUDOUN-STANDARDS"],
  },
  {
    local_system_id: "local-ontario-real-estate",
    aliases: ["Ontario housing and land system"],
    signal_ids: [
      "signal-cmhc-june-2026-toronto-construction-stage-baseline",
      "signal-ieso-2026-ontario-demand-toronto-distribution-stack",
      "signal-ontario-housing-supply-progress-local-capacity-signal",
      "signal-statcan-building-permits-construction-intentions-signal",
      "signal-toronto-2025-development-pipeline-delivery-gap",
      "signal-toronto-24-254930-community-council-recommendation",
      "signal-toronto-24-254930-staff-report-servicing-review",
      "signal-toronto-application-24-254930-named-planning-record",
      "signal-toronto-water-2026-capital-delivery-constraint",
    ],
    related_project_ids: ["119-PROJECT-002"],
    phase_60_cycle_ids: [],
  },
  {
    local_system_id: "local-us-southwest-chip-corridor",
    aliases: ["Southwest chip corridor", "Arizona semiconductor corridor"],
    signal_ids: [
      "signal-acc-project-baccara-power-water-permit-gates",
      "signal-aps-tsmc-service-territory-capacity-boundary",
      "signal-arizona-electricity-profile-chip-corridor-power-constraint",
      "signal-arizona-water-resources-chip-corridor-constraint-map",
      "signal-asml-phoenix-technical-academy-operational",
      "signal-bls-maricopa-q4-2025-employment-wage-baseline",
      "signal-bls-phoenix-2025-workforce-baseline",
      "signal-chandler-intel-brine-improvements-proposed-budget",
      "signal-chandler-reclaimed-water-operating-scale",
      "signal-drive48-graduates-operating-workforce-comparator",
      "signal-intel-arizona-water-conservation-2023",
      "signal-mag-2023-projections-phoenix-region-growth-evidence-layer",
      "signal-maricopa-semiconductor-accelerator-2027-plan",
      "signal-nnme-southwest-microelectronics-workforce-node",
      "signal-phoenix-2026-2031-north-gateway-wrp-capital-program",
      "signal-phoenix-2026-water-security-provider-update",
      "signal-phoenix-tsmc-fab1-production-fab2-construction-complete",
      "signal-phoenix-tsmc-fab3-topping-out",
      "signal-phoenix-z37-20-1-tsmc-campus-planning-record",
      "signal-srp-2025-isp-actions-valley-power-buildout",
      "signal-srp-e67-large-load-service-conditions",
      "signal-srp-huckleberry-meta-mesa-online-service",
      "signal-tsmc-arizona-apprenticeship-workforce-pipeline",
      "signal-tsmc-phoenix-wastewater-infrastructure-agreement",
    ],
    related_project_ids: ["119-PROJECT-001"],
    phase_60_cycle_ids: ["60-CYCLE-ARIZONA-WASTEWATER"],
  },
];

const expandedPlaceConfig = [
  {
    portrait_id: "112-REGION-001",
    aliases: ["California AV system"],
    signal_ids: [
      "signal-56a-california-av-miles",
      "signal-california-av-testing-exceeds-nine-million-miles-2025",
      "signal-california-av-testing-miles-2024",
      "signal-cpuc-waymo-fared-driverless-expansion-2024",
      "signal-nhtsa-waymo-flooded-roadway-recall-2026",
    ],
    related_project_ids: ["119-PROJECT-008"],
    phase_60_cycle_ids: [],
  },
  {
    portrait_id: "112-REGION-002",
    aliases: ["Louisiana BEAD adoption"],
    signal_ids: ["signal-57b-louisiana-nextlink-104-location-live-service"],
    related_project_ids: [],
    phase_60_cycle_ids: ["60-CYCLE-LOUISIANA-STARLINK-ADOPTION", "60-CYCLE-LOUISIANA-NEXTLINK-ADOPTION"],
  },
  {
    portrait_id: "112-REGION-003",
    aliases: ["Montana BEAD"],
    signal_ids: expandedProjectConfig[14].signal_ids,
    related_project_ids: ["119-PROJECT-023"],
    phase_60_cycle_ids: ["60-CYCLE-MONTANA-COMPLETED-QUARTER"],
  },
  {
    portrait_id: "112-REGION-004",
    aliases: ["Hanford DFLAW system"],
    signal_ids: expandedProjectConfig[13].signal_ids,
    related_project_ids: ["119-PROJECT-022"],
    phase_60_cycle_ids: ["60-CYCLE-HANFORD-MATERIAL-BALANCE"],
  },
  {
    portrait_id: "112-REGION-005",
    aliases: ["Amtrak ADA and reliability system"],
    signal_ids: expandedProjectConfig[12].signal_ids,
    related_project_ids: ["119-PROJECT-021"],
    phase_60_cycle_ids: ["60-CYCLE-AMTRAK-PIDS-CLOSEOUT", "60-CYCLE-AMTRAK-NAMED-ASSET-RELIABILITY"],
  },
  {
    portrait_id: "112-REGION-006",
    aliases: ["NNSA two-site pit-production system"],
    signal_ids: expandedProjectConfig[15].signal_ids,
    related_project_ids: ["119-PROJECT-024"],
    phase_60_cycle_ids: [
      "60-CYCLE-NNSA-GAO-BASELINE",
      "60-CYCLE-NNSA-ACCEPTED-CAPACITY",
      "60-CYCLE-NNSA-RECURRING-QUALIFIED-RATE",
    ],
  },
  {
    portrait_id: "112-REGION-007",
    aliases: ["South Australia battery system"],
    signal_ids: unique([...expandedProjectConfig[3].signal_ids, ...expandedProjectConfig[5].signal_ids]),
    related_project_ids: ["119-PROJECT-012", "119-PROJECT-014"],
    phase_60_cycle_ids: [],
  },
  {
    portrait_id: "112-REGION-008",
    aliases: ["Victoria battery system"],
    signal_ids: expandedProjectConfig[4].signal_ids,
    related_project_ids: ["119-PROJECT-013"],
    phase_60_cycle_ids: [],
  },
  {
    portrait_id: "112-REGION-009",
    aliases: ["Florida Manatee storage system"],
    signal_ids: expandedProjectConfig[0].signal_ids,
    related_project_ids: ["119-PROJECT-009"],
    phase_60_cycle_ids: [],
  },
  {
    portrait_id: "112-REGION-010",
    aliases: ["California utility-battery safety system"],
    signal_ids: unique([...expandedProjectConfig[1].signal_ids, ...expandedProjectConfig[2].signal_ids]),
    related_project_ids: ["119-PROJECT-010", "119-PROJECT-011"],
    phase_60_cycle_ids: [],
  },
];

for (const id of unique([
  ...expandedProjectConfig.flatMap((record) => record.phase_60_cycle_ids),
  ...originalPlaceConfig.flatMap((record) => record.phase_60_cycle_ids),
  ...expandedPlaceConfig.flatMap((record) => record.phase_60_cycle_ids),
])) {
  if (!cycleById.has(id)) throw new Error(`Unknown Phase 60 cycle ID: ${id}`);
}

const governedProjects = projects61.records.map((project, index) => {
  const editorial = program03.casebooks.find((record) => record.file_id === project.file_id);
  const ledger = events62.ledgers.find((record) => record.file_id === project.file_id);
  const gate = gates63.gate_records.find((record) => record.file_id === project.file_id);
  const matrixRow = matrix64.file_rows.find((record) => record.file_id === project.file_id);
  const canonical = coverage116.entity_registry.casebooks.find((record) => record.slug === editorial?.slug);
  if (!editorial || !ledger || !gate || !matrixRow || !canonical) throw new Error(`Incomplete governed relationship set: ${project.file_id}`);
  return {
    atlas_project_id: `119-PROJECT-${String(index + 1).padStart(3, "0")}`,
    canonical_id: canonical.canonical_id,
    legacy_ids: [project.file_id],
    aliases: unique([project.named_entity, project.title]),
    slug: editorial.slug,
    title: project.title,
    named_entity: project.named_entity,
    entity_kind: project.kind,
    record_status: "Published",
    coverage: {
      tier_id: "Tier A",
      label: "Governed conversion file",
      basis: "The entity resolves to Phase 61 project state, a Phase 62 event ledger, a Phase 63 gate, and a Phase 64 matrix row.",
    },
    relationships: {
      phase_61_file_ids: [project.file_id],
      phase_62_event_ids: ledger.event_ids,
      phase_63_gate_ids: [gate.gate_id],
      phase_64_row_ids: [project.file_id],
      phase_60_cycle_ids: gate.phase_60_cycle_ids,
      local_system_ids: project.local_system_ids,
      evidence_gap_ids: project.evidence_gap_ids,
      canonical_briefing_ids: [project.canonical_briefing_id],
      reader_pathway_ids: project.reader_pathway_ids,
      dependency_map_ids: project.dependency_map_ids,
      related_place_ids: originalProjectPlaceIds[project.file_id],
    },
    conversion: {
      current_stage: project.current_stage,
      stage_basis: project.established,
      unresolved: project.unresolved,
      unresolved_gate: gate.exact_next_artifact,
      exact_next_artifact: project.exact_next_artifact,
      next_check_date: project.next_check_date,
      reopening_trigger: project.reopening_trigger,
      stop_rule: project.stop_rule,
    },
    chronology: {
      chronology_type: "Governed Phase 62 event ledger",
      event_ids: ledger.event_ids,
      signal_ids: project.signal_ids,
      boundary: "Published Phase 62 event identity and date basis remain authoritative; this Atlas record does not create or rewrite an event.",
    },
    evidence_rails: {
      signal_ids: project.signal_ids,
      source_ids: project.source_ids,
    },
    update_owner_id: "119-OWNER-CONVERSION-DESK",
    update_status: gate.receipt_state,
    last_reviewed_date: "2026-08-30",
    routes: {
      atlas: `/atlas/projects/${editorial.slug}/`,
      prior_casebook: `/review/casebooks/${editorial.slug}/`,
    },
    editorial_question: editorial.editorial_question,
    interpretation_boundary: "This Atlas entry republishes governed relationships without advancing the underlying project, event, gate, signal, source, or outcome state.",
  };
});

const curatedProjects = expandedProjectConfig.map((config, index) => {
  const editorial = program031.casebooks.find((record) => record.casebook_id === config.casebook_id);
  const canonical = coverage116.entity_registry.casebooks.find((record) => record.slug === editorial?.slug);
  if (!editorial || !canonical) throw new Error(`Missing Phase 113 or Phase 116 casebook: ${config.casebook_id}`);
  return {
    atlas_project_id: `119-PROJECT-${String(index + 9).padStart(3, "0")}`,
    canonical_id: canonical.canonical_id,
    legacy_ids: [config.casebook_id],
    aliases: unique([editorial.title, ...config.aliases]),
    slug: editorial.slug,
    title: editorial.title,
    named_entity: editorial.title,
    entity_kind: "named_delivery_case",
    record_status: "Published",
    coverage: {
      tier_id: "Tier B",
      label: "Curated evidence case",
      basis: "The entity has an explicit Published signal and source shelf, but no governed Phase 61 file, Phase 62 event ledger, Phase 63 gate, or Phase 64 matrix row.",
    },
    relationships: {
      phase_61_file_ids: [],
      phase_62_event_ids: [],
      phase_63_gate_ids: [],
      phase_64_row_ids: [],
      phase_60_cycle_ids: config.phase_60_cycle_ids,
      local_system_ids: [],
      evidence_gap_ids: [],
      canonical_briefing_ids: [],
      reader_pathway_ids: [],
      dependency_map_ids: [],
      related_place_ids: config.related_place_ids,
    },
    conversion: {
      current_stage: "Not established in the governed Phase 61–64 conversion layer",
      stage_basis: "Phase 113 created an editorial casebook, not a governed project-stage decision.",
      unresolved: editorial.unresolved,
      unresolved_gate: "No governed Phase 63 gate is established for this case.",
      exact_next_artifact: "A governed entity-specific review that establishes current stage, event chronology, exact next artifact, source trigger, and stop rule.",
      next_check_date: null,
      reopening_trigger: "Manual promotion review after an entity-specific identity and source audit.",
      stop_rule: editorial.interpretation_boundary,
    },
    chronology: {
      chronology_type: "Curated Published-signal chronology",
      event_ids: [],
      signal_ids: config.signal_ids,
      boundary: "Signal capture order is an editorial reading sequence, not a Phase 62 event ledger or project-stage history.",
    },
    evidence_rails: {
      signal_ids: config.signal_ids,
      source_ids: sourcesForSignals(config.signal_ids),
    },
    update_owner_id: "119-OWNER-CASEBOOK-DESK",
    update_status: "Baseline captured — governed conversion file not established",
    last_reviewed_date: "2026-08-30",
    routes: {
      atlas: `/atlas/projects/${editorial.slug}/`,
      prior_casebook: `/review/casebooks/expanded/${editorial.slug}/`,
    },
    editorial_question: editorial.editorial_question,
    interpretation_boundary: editorial.interpretation_boundary,
  };
});

const governedPlaces = originalPlaceConfig.map((config, index) => {
  const system = localSystemById.get(config.local_system_id);
  const canonical = coverage116.entity_registry.local_systems.find((record) => record.slug === system?.slug);
  if (!system || !canonical) throw new Error(`Missing local system or Phase 116 identity: ${config.local_system_id}`);
  return {
    atlas_place_id: `119-PLACE-${String(index + 1).padStart(3, "0")}`,
    canonical_id: canonical.canonical_id,
    legacy_ids: [system.id],
    aliases: unique([system.name, ...config.aliases]),
    slug: system.slug,
    title: system.name,
    geography: system.geography,
    system_type: system.system_type,
    record_status: "Published",
    coverage: {
      tier_id: "Tier A",
      label: "Governed local-system profile",
      basis: "The place resolves to a canonical local-system content record with explicit source rails, evidence gaps, constraints, and a reviewed evidence level.",
    },
    relationships: {
      local_system_ids: [system.id],
      phase_112_portrait_ids: [],
      related_project_ids: config.related_project_ids,
      phase_60_cycle_ids: config.phase_60_cycle_ids,
      phase_62_event_ids: config.related_project_ids.flatMap((id) => governedProjects.find((record) => record.atlas_project_id === id)?.relationships.phase_62_event_ids ?? []),
      phase_63_gate_ids: config.related_project_ids.flatMap((id) => governedProjects.find((record) => record.atlas_project_id === id)?.relationships.phase_63_gate_ids ?? []),
      evidence_gap_ids: system.evidence_gap_ids,
    },
    conversion: {
      current_stage: "System context — no single place-level conversion stage",
      stage_basis: "A receiving system can contain projects at different stages; linked project files retain their own conversion decisions.",
      unresolved: system.missing_data.join(" "),
      unresolved_gate: "No single place-level gate is established; linked project files and evidence gaps govern advancement.",
      exact_next_artifact: `A governed place review resolving the first stated missing-data need: ${system.missing_data[0]}.`,
      next_check_dates: config.phase_60_cycle_ids.map((id) => cycleById.get(id)?.next_check_date ?? cycleById.get(id)?.scheduled_check_date).filter(Boolean),
      reopening_triggers: config.phase_60_cycle_ids.map((id) => cycleById.get(id)?.exact_next_artifact).filter(Boolean),
      stop_rule: "Do not transfer a linked project's stage or outcome to the wider place system.",
    },
    chronology: {
      chronology_type: "Curated place evidence shelf",
      event_ids: config.related_project_ids.flatMap((id) => governedProjects.find((record) => record.atlas_project_id === id)?.chronology.event_ids ?? []),
      signal_ids: config.signal_ids,
      boundary: "The shelf connects place evidence; it is not a single project chronology and does not collapse distinct entities.",
    },
    evidence_rails: {
      signal_ids: config.signal_ids,
      source_ids: system.source_ids,
    },
    update_owner_id: "119-OWNER-PLACE-DESK",
    update_status: "Canonical local profile active",
    last_reviewed_date: "2026-08-30",
    routes: {
      atlas: `/atlas/places/${system.slug}/`,
      prior_profile: `/atlas/local-systems/${system.slug}/`,
    },
    editorial_question: system.summary,
    interpretation_boundary: "This place entry organizes receiving-system evidence without creating a place-level readiness, performance, risk, or outcome score.",
  };
});

const curatedPlaces = expandedPlaceConfig.map((config, index) => {
  const portrait = program031.regions.find((record) => record.portrait_id === config.portrait_id);
  const canonical = coverage116.entity_registry.local_systems.find((record) => record.slug === portrait?.slug);
  if (!portrait || !canonical) throw new Error(`Missing Phase 112 portrait or Phase 116 identity: ${config.portrait_id}`);
  return {
    atlas_place_id: `119-PLACE-${String(index + 6).padStart(3, "0")}`,
    canonical_id: canonical.canonical_id,
    legacy_ids: [portrait.portrait_id],
    aliases: unique([portrait.title, ...config.aliases]),
    slug: portrait.slug,
    title: portrait.title,
    geography: portrait.geography,
    system_type: "Place-bound editorial system",
    record_status: "Published",
    coverage: {
      tier_id: "Tier B",
      label: "Curated place portrait",
      basis: "The place has an explicit Published signal and source shelf, but no canonical local-system content record or place-level conversion gate.",
    },
    relationships: {
      local_system_ids: [],
      phase_112_portrait_ids: [portrait.portrait_id],
      related_project_ids: config.related_project_ids,
      phase_60_cycle_ids: config.phase_60_cycle_ids,
      phase_62_event_ids: [],
      phase_63_gate_ids: [],
      evidence_gap_ids: [],
    },
    conversion: {
      current_stage: "Place-level conversion stage not established",
      stage_basis: "Phase 112 created a place-bound editorial portrait, not a governed place-stage decision.",
      unresolved: portrait.unresolved,
      unresolved_gate: config.phase_60_cycle_ids.length > 0
        ? "One or more linked Evidence Cycle 001 gates remain separate dated decisions."
        : "No governed place-level gate is established for this portrait.",
      exact_next_artifact: config.phase_60_cycle_ids.length > 0
        ? config.phase_60_cycle_ids.map((id) => cycleById.get(id).exact_next_artifact).join(" | ")
        : "A governed place review that defines stable entity scope, evidence gaps, current boundaries, and the next exact artifact.",
      next_check_dates: config.phase_60_cycle_ids.map((id) => cycleById.get(id)?.next_check_date ?? cycleById.get(id)?.scheduled_check_date).filter(Boolean),
      reopening_triggers: [],
      stop_rule: portrait.interpretation_boundary,
    },
    chronology: {
      chronology_type: "Curated Published-signal place shelf",
      event_ids: [],
      signal_ids: config.signal_ids,
      boundary: "Signal capture order is a reading sequence, not a governed place or project event ledger.",
    },
    evidence_rails: {
      signal_ids: config.signal_ids,
      source_ids: sourcesForSignals(config.signal_ids),
    },
    update_owner_id: "119-OWNER-PLACE-DESK",
    update_status: "Baseline captured — canonical local-system profile not established",
    last_reviewed_date: "2026-08-30",
    routes: {
      atlas: `/atlas/places/${portrait.slug}/`,
      prior_profile: `/review/regions/${portrait.slug}/`,
    },
    editorial_question: portrait.editorial_question,
    interpretation_boundary: portrait.interpretation_boundary,
  };
});

const projects = [...governedProjects, ...curatedProjects];
const places = [...governedPlaces, ...curatedPlaces];

for (const record of [...projects, ...places]) {
  for (const id of record.evidence_rails.signal_ids) if (!signalById.has(id)) throw new Error(`Missing signal relationship: ${id}`);
  for (const id of record.evidence_rails.source_ids) if (!sourceById.has(id)) throw new Error(`Missing source relationship: ${id}`);
}
for (const project of projects) {
  for (const placeId of project.relationships.related_place_ids) {
    if (!places.some((place) => place.atlas_place_id === placeId)) throw new Error(`Missing project-to-place relationship: ${placeId}`);
  }
}
for (const place of places) {
  for (const projectId of place.relationships.related_project_ids) {
    if (!projects.some((project) => project.atlas_project_id === projectId)) throw new Error(`Missing place-to-project relationship: ${projectId}`);
  }
}

const registry = {
  schema_version: "1.0",
  phase: 119,
  registry_id: "phase-119-deep-project-place-atlas",
  title: "FTFN Deep Project and Place Atlas",
  effective_date: "2026-08-30",
  record_status: "Published",
  program: "FTFN v0.4 — Canonical authority and depth",
  summary: "A canonical relationship layer for all twenty-four public casebooks and fifteen place portraits, preserving governed and editorial-only coverage as visibly different tiers.",
  interpretation_boundary: "The Atlas makes existing relationships explicit. It creates no new source fact, event, receipt, conversion-stage advancement, gate decision, observation, outcome, score, ranking, cost, or schedule claim.",
  publication_boundaries: [
    "Tier A means a governed upstream identity exists; it does not mean the project or place is complete, successful, ready, safe, or high performing.",
    "Tier B means a manually curated Published evidence shelf exists, while the governed stage, event ledger, or gate remains not established.",
    "Not established describes this reviewed corpus and never proves that an external artifact or real-world condition does not exist.",
    "Phase 60 gates retain their actual scheduled dates and decision states; this registry does not operate or predate them.",
  ],
  identity_contract: {
    canonical_identity_registry: "phase-116-coverage-architecture",
    canonical_id_role: "Semantic entity identity shared across v0.4.",
    atlas_project_id_role: "Phase 119 project-record identity; it is not a competing canonical entity ID.",
    atlas_place_id_role: "Phase 119 place-record identity; it is not a competing canonical entity ID.",
  },
  coverage_tiers: [
    {
      tier_id: "Tier A",
      project_definition: "Governed Phase 61–64 conversion file with explicit event and gate relationships.",
      place_definition: "Canonical local-system content profile with explicit sources and evidence gaps.",
    },
    {
      tier_id: "Tier B",
      project_definition: "Curated Published evidence case without a governed Phase 61–64 conversion file.",
      place_definition: "Curated place portrait without a canonical local-system content profile or place-level gate.",
    },
  ],
  update_owners: [
    { owner_id: "119-OWNER-CONVERSION-DESK", role: "Governed conversion-file review" },
    { owner_id: "119-OWNER-CASEBOOK-DESK", role: "Curated casebook identity and promotion review" },
    { owner_id: "119-OWNER-PLACE-DESK", role: "Place-system evidence and promotion review" },
  ],
  counts: {
    projects_total: projects.length,
    governed_projects: governedProjects.length,
    curated_projects: curatedProjects.length,
    places_total: places.length,
    governed_places: governedPlaces.length,
    curated_places: curatedPlaces.length,
    project_signal_links: projects.reduce((sum, record) => sum + record.evidence_rails.signal_ids.length, 0),
    project_source_links: projects.reduce((sum, record) => sum + record.evidence_rails.source_ids.length, 0),
    place_signal_links: places.reduce((sum, record) => sum + record.evidence_rails.signal_ids.length, 0),
    place_source_links: places.reduce((sum, record) => sum + record.evidence_rails.source_ids.length, 0),
    public_html_routes: projects.length + places.length + 2,
    public_json_exports: 1,
  },
  routes: {
    project_index: "/atlas/projects/",
    place_index: "/atlas/places/",
    public_export: "/data/deep-project-place-atlas.json",
  },
  projects,
  places,
};

if (projects.length !== 24 || places.length !== 15) throw new Error("Phase 119 record counts are incomplete.");
if (governedProjects.length !== 8 || curatedProjects.length !== 16) throw new Error("Project coverage tiers are incomplete.");
if (governedPlaces.length !== 5 || curatedPlaces.length !== 10) throw new Error("Place coverage tiers are incomplete.");

await writeFile(outputPath, `${JSON.stringify(registry, null, 2)}\n`, "utf8");
console.log(`Built ${outputPath}`);
console.log(`Projects: ${projects.length} (${governedProjects.length} Tier A, ${curatedProjects.length} Tier B)`);
console.log(`Places: ${places.length} (${governedPlaces.length} Tier A, ${curatedPlaces.length} Tier B)`);
console.log(`Explicit links: ${registry.counts.project_signal_links + registry.counts.place_signal_links} signals and ${registry.counts.project_source_links + registry.counts.place_source_links} sources`);
