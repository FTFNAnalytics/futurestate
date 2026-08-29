import { readFile, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

const appRoot = fileURLToPath(new URL("..", import.meta.url));
const contentRoot = join(appRoot, "src", "content");
const collectionId = "research-collection-repeat-outcomes-alternative-explanation-tests-2010-2026";
const briefingId = "briefing-research-watch-008-repeat-outcomes-alternative-tests";
const mapId = "dependency-map-comparative-outcomes-require-common-denominators";
const testLedgerPath = join(appRoot, "src", "data", "phase-56d-alternative-tests.json");
const dossierLedgerPath = join(appRoot, "src", "data", "phase-56c-entity-dossiers.json");
const panelLedgerPath = join(appRoot, "src", "data", "phase-56b-entity-panels.json");
const testLedger = JSON.parse(await readFile(testLedgerPath, "utf8"));
const addUnique = (items = [], additions = []) => [...new Set([...items, ...additions])];
const readJson = async (collection, file) => JSON.parse(await readFile(join(contentRoot, collection, file), "utf8"));
const writeJson = async (value, collection, file) =>
  writeFile(join(contentRoot, collection, file), `${JSON.stringify(value, null, 2)}\n`, "utf8");

const testsByPortfolio = Object.fromEntries(
  ["ai_cyber", "manufacturing", "infrastructure", "mobility"].map((portfolio) => [
    portfolio,
    testLedger.tests.filter((test) => test.portfolio === portfolio),
  ]),
);
const portfolioRecords = (portfolio) => ({
  sources: [...new Set(testsByPortfolio[portfolio].flatMap((test) => test.source_ids))],
  signals: testsByPortfolio[portfolio]
    .filter((test) => test.record_status === "Published")
    .map((test) => test.signal_id),
});
const portfolios = Object.fromEntries(
  Object.keys(testsByPortfolio).map((portfolio) => [portfolio, portfolioRecords(portfolio)]),
);
const heldEntitySignalIds = new Set(
  testLedger.tests.filter((test) => test.record_status !== "Published").map((test) => test.signal_id),
);

const pathwayUpdates = {
  "ai-infrastructure-policy-to-assurance.json": "ai_cyber",
  "policy-standards-to-implementation.json": "ai_cyber",
  "advanced-manufacturing-workforce-to-operating-capacity.json": "manufacturing",
  "advanced-manufacturing-research-to-production.json": "manufacturing",
  "energy-grid-capacity-to-service.json": "infrastructure",
  "cross-corridor-authorization-to-operation.json": "mobility",
};

for (const [file, portfolio] of Object.entries(pathwayUpdates)) {
  const pathway = await readJson("reader-pathways", file);
  const records = portfolios[portfolio];
  pathway.source_ids = addUnique(pathway.source_ids, records.sources);
  pathway.signal_ids = addUnique(
    pathway.signal_ids.filter((signalId) => !heldEntitySignalIds.has(signalId)),
    records.signals,
  );
  pathway.briefing_ids = addUnique(pathway.briefing_ids, [briefingId]);
  pathway.dependency_map_ids = addUnique(pathway.dependency_map_ids, [mapId]);
  pathway.research_collection_ids = addUnique(pathway.research_collection_ids, [collectionId]);
  pathway.current_state = addUnique(pathway.current_state, [
    "Phase 56D adds later observations and explicit tests of named Phase 56C alternative explanations for the same twelve entities.",
    "Compatibility, attribution, validation status, missing denominators, and series breaks remain visible before any interpretation.",
  ]);
  pathway.evidence_limits = addUnique(pathway.evidence_limits, [
    "A recommendation status, certification, supplier clause, incident response, monthly cause mix, or complaint count does not create a common performance measure.",
    "Different units, methods, identities, observation windows, and attribution levels remain split.",
  ]);
  pathway.next_records = addUnique(pathway.next_records, [
    "Later observations using the same entity, unit, denominator, method, and observation window.",
    "Independent control-operation, closure, line-performance, availability, dispatch, and service-delivery evidence.",
  ]);
  pathway.dependency_stack = [
    ...(pathway.dependency_stack ?? []),
    ...((pathway.dependency_stack ?? []).some((stage) => stage.stage === "Alternative-explanation test")
      ? []
      : [{
          stage: "Alternative-explanation test",
          current_state: "Twelve entity tests map later records to named competing explanations.",
          boundary: "A test may narrow an explanation without isolating cause or producing a score.",
        }]),
  ];
  await writeJson(pathway, "reader-pathways", file);
}

const topicUpdates = {
  "cybersecurity.json": "ai_cyber",
  "ai-for-science.json": "ai_cyber",
  "policy-and-standards.json": "ai_cyber",
  "advanced-manufacturing.json": "manufacturing",
  "human-futures.json": "manufacturing",
  "energy.json": "infrastructure",
  "mobility.json": "mobility",
  "aviation.json": "mobility",
};

for (const [file, portfolio] of Object.entries(topicUpdates)) {
  const topic = await readJson("topics", file);
  topic.featured_sources = addUnique(topic.featured_sources, portfolios[portfolio].sources);
  topic.watch_questions = addUnique(topic.watch_questions, [
    "Which later record tests a named alternative explanation using a compatible entity, unit, denominator, method, and observation window?",
    "Is the result independently verified, regulator-attributed, operator-attributed, company-attributed, pending, partial, or unresolved?",
    "Which denominator or method break prevents the record from becoming a causal, ranking, composite, or readiness claim?",
  ]);
  await writeJson(topic, "topics", file);
}

const map = await readJson("dependency-maps", "comparative-outcomes-require-common-denominators.json");
const allSources = [...new Set(Object.values(portfolios).flatMap((portfolio) => portfolio.sources))];
const allSignals = Object.values(portfolios).flatMap((portfolio) => portfolio.signals);
map.summary = "A comparison and inference protocol: entity dossiers can accept later outcomes and alternative-explanation tests only when stable identity, compatibility, attribution, validation status, and denominator breaks remain attached.";
map.source_ids = addUnique(map.source_ids, allSources);
map.signal_ids = addUnique(
  map.signal_ids.filter((signalId) => !heldEntitySignalIds.has(signalId)),
  allSignals,
);
if (!map.nodes.some((node) => node.id === "node-alternative-test")) {
  map.nodes.push(
    {
      id: "node-alternative-test",
      label: "Repeat outcome or alternative-explanation test",
      node_type: "Signal",
      record_id: "signal-56d-gateway-repeat-test",
      note: "A later record maps to named alternatives and declares compatibility, attribution, and validation status.",
    },
    {
      id: "node-denominator-break",
      label: "Denominator or method break",
      node_type: "Constraint",
      note: "Different units, methods, identities, windows, and attribution levels stop silent series extension.",
    },
  );
  map.links.push(
    {
      from: "node-alternative-test",
      to: "node-entity-dossier",
      relationship: "Depends On",
      confidence: "Supported",
      note: "Every test inherits the Phase 56C entity, dossier, and named alternatives.",
    },
    {
      from: "node-alternative-test",
      to: "node-denominator-break",
      relationship: "Constrained By",
      confidence: "Supported",
      note: "Compatibility is declared before interpreting the later record.",
    },
    {
      from: "node-denominator-break",
      to: "node-causal-hold",
      relationship: "Limited By",
      confidence: "Missing Evidence",
      note: "A broken or missing denominator prevents causal or performance interpretation.",
    },
  );
}
map.what_this_map_supports = addUnique(map.what_this_map_supports, [
  "A later record may narrow, support, challenge, or leave unresolved a named alternative explanation.",
  "Regulator-verified obligations, partial progress, company claims, operator filings, and independent outcomes can remain distinct.",
]);
map.what_this_map_does_not_prove = addUnique(map.what_this_map_does_not_prove, [
  "It does not prove that one tested alternative caused the observed outcome.",
  "It does not authorize denominator mixing, causal effects, rankings, composites, or readiness scores.",
]);
map.next_records_needed = addUnique(map.next_records_needed, [
  "Repeated compatible outcomes with the same unit, denominator, method, entity, and observation window.",
  "Independent closure, control-operation, same-line performance, availability, dispatch, and service-delivery records.",
]);
await writeJson(map, "dependency-maps", "comparative-outcomes-require-common-denominators.json");

const dossierLedger = JSON.parse(await readFile(dossierLedgerPath, "utf8"));
for (const dossier of dossierLedger.dossiers) {
  const test = testLedger.tests.find((candidate) => candidate.parent_dossier_id === dossier.dossier_id);
  if (!test) continue;
  dossier.phase_56d_test_id = test.test_id;
  dossier.phase_56d_signal_id = test.signal_id;
  dossier.phase_56d_record_status = test.record_status;
  dossier.phase_56d_source_ids = test.source_ids;
  dossier.tested_alternative_explanations = test.tested_alternative_explanations;
  dossier.later_observations = test.later_observations;
  dossier.compatibility = test.compatibility;
  dossier.phase_56d_result = test.result;
  dossier.phase_56d_attribution = test.attribution;
  dossier.phase_56d_validation_status = test.validation_status;
  dossier.phase_56d_causal_boundary = test.causal_boundary;
  dossier.next_records = addUnique(dossier.next_records, test.next_records);
}
dossierLedger.phase_56d_deepened_date = "2026-07-24";
dossierLedger.phase_56d_test_count = testLedger.test_count;
await writeFile(dossierLedgerPath, `${JSON.stringify(dossierLedger, null, 2)}\n`, "utf8");

const panelLedger = JSON.parse(await readFile(panelLedgerPath, "utf8"));
for (const panel of panelLedger.panels) {
  const test = testLedger.tests.find((candidate) => candidate.parent_panel_id === panel.panel_id);
  if (!test) continue;
  panel.phase_56d_test_id = test.test_id;
  panel.phase_56d_signal_id = test.signal_id;
  panel.phase_56d_record_status = test.record_status;
  panel.phase_56d_source_ids = test.source_ids;
  panel.tested_alternative_explanations = test.tested_alternative_explanations;
  panel.phase_56d_later_observations = test.later_observations;
  panel.phase_56d_compatibility = test.compatibility;
  panel.phase_56d_result = test.result;
  panel.phase_56d_validation_status = test.validation_status;
  panel.next_records = addUnique(panel.next_records, test.next_records);
}
panelLedger.phase_56d_deepened_date = "2026-07-24";
panelLedger.phase_56d_test_count = testLedger.test_count;
await writeFile(panelLedgerPath, `${JSON.stringify(panelLedger, null, 2)}\n`, "utf8");

const watch007Path = join(contentRoot, "briefings", "briefing-research-watch-007-entity-driver-constraint-dossiers.mdx");
let watch007 = await readFile(watch007Path, "utf8");
if (!watch007.includes("## Phase 56D handoff")) {
  watch007 += `

## Phase 56D handoff

The same twelve dossiers now carry repeat-outcome and alternative-explanation tests. Compatibility, attribution, validation status, missing denominators, and series breaks remain visible. Research Watch 008 carries the full synthesis.
`;
  await writeFile(watch007Path, watch007, "utf8");
}

console.log("Integrated Phase 56D into the Phase 56B and 56C ledgers, six pathways, eight topics, the comparison protocol, and Research Watch 007.");
