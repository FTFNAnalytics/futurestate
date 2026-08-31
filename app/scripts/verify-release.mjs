import { readdir, readFile } from "node:fs/promises";
import { dirname, extname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const scriptDirectory = dirname(fileURLToPath(import.meta.url));
const appRoot = resolve(scriptDirectory, "..");
const workspaceRoot = resolve(appRoot, "..");
const distRoot = join(appRoot, "dist");
const manifestPath = join(workspaceRoot, "deployment", "ftfn-v0.2-build.json");

const failures = [];
const check = (condition, message) => {
  if (!condition) failures.push(message);
};
const sameSet = (left, right) => Array.isArray(left) && Array.isArray(right) && left.length === right.length && new Set(left).size === left.length && new Set(right).size === right.length && left.every((item) => new Set(right).has(item));

const readText = (path) => readFile(path, "utf8");
const readJson = async (path) => JSON.parse(await readText(path));

async function collectFiles(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  const nested = await Promise.all(
    entries.map((entry) => {
      const path = join(directory, entry.name);
      return entry.isDirectory() ? collectFiles(path) : [path];
    }),
  );
  return nested.flat();
}

function routeToHtml(route) {
  const cleanRoute = route.replace(/^\//, "").replace(/\/$/, "");
  return join(distRoot, cleanRoute, "index.html");
}

function hasRobots(html, expected) {
  const tag = html.match(/<meta[^>]+name=["']robots["'][^>]*>/i)?.[0] ?? "";
  const content = tag.match(/content=["']([^"']+)["']/i)?.[1] ?? "";
  return content.toLowerCase().replace(/\s+/g, " ") === expected;
}

function hasCanonical(html, expected) {
  const tag = html.match(/<link[^>]+rel=["']canonical["'][^>]*>/i)?.[0] ?? "";
  return tag.includes(`href="${expected}"`) || tag.includes(`href='${expected}'`);
}

const manifest = await readJson(manifestPath);
const signals = await readJson(join(distRoot, "data", "signals.json"));
const sources = await readJson(join(distRoot, "data", "sources.json"));
const topics = await readJson(join(distRoot, "data", "topics.json"));
const researchExport = await readJson(join(distRoot, "data", "research.json"));
const pathwaysExport = await readJson(join(distRoot, "data", "pathways.json"));
const evidenceQueueExport = await readJson(join(distRoot, "data", "evidence-queue.json"));
const operatingCycleExport = await readJson(join(distRoot, "data", "operating-cycle.json"));
const projectConversionExport = await readJson(join(distRoot, "data", "project-conversion.json"));
const conversionEventsExport = await readJson(join(distRoot, "data", "conversion-events.json"));
const conversionGatesExport = await readJson(join(distRoot, "data", "conversion-gates.json"));
const conversionStageMatrixExport = await readJson(join(distRoot, "data", "conversion-stage-matrix.json"));
const qualificationPacketsExport = await readJson(join(distRoot, "data", "qualification-packets.json"));
const evidenceReturnEnvelopesExport = await readJson(join(distRoot, "data", "evidence-return-envelopes.json"));
const phase60cDeskExport = await readJson(join(distRoot, "data", "phase-60c-editorial-desk.json"));
const outcomeCohortsExport = await readJson(join(distRoot, "data", "compatible-series-outcome-cohorts.json"));
const measurementSpecificationsExport = await readJson(join(distRoot, "data", "measurement-specifications.json"));
const observationReviewExport = await readJson(join(distRoot, "data", "observation-review-series-admission.json"));
const longitudinalOutcomeExport = await readJson(join(distRoot, "data", "longitudinal-panels-outcome-claims.json"));
const outcomeEvidenceDesignExport = await readJson(join(distRoot, "data", "outcome-evidence-counterfactual-designs.json"));
const analysisResultExport = await readJson(join(distRoot, "data", "analysis-execution-result-adjudication.json"));
const synthesisDecisionExport = await readJson(join(distRoot, "data", "evidence-synthesis-challenge-decision-translation.json"));
const accountabilityImpactExport = await readJson(join(distRoot, "data", "decision-accountability-realized-impact.json"));
const learningPortfolioExport = await readJson(join(distRoot, "data", "cross-case-learning-portfolio-policy-retirement.json"));
const publicDeliberationExport = await readJson(join(distRoot, "data", "public-deliberation-adaptive-mandate.json"));
const interjurisdictionalCompactsExport = await readJson(join(distRoot, "data", "interjurisdictional-compacts-emergency-resilience.json"));
const publicWealthStewardshipExport = await readJson(join(distRoot, "data", "public-wealth-intergenerational-stewardship.json"));
const publicInvestmentPortfolioExport = await readJson(join(distRoot, "data", "public-investment-portfolios-transition-capacity.json"));
const universalServiceExport = await readJson(join(distRoot, "data", "universal-service-essential-systems-public-options.json"));
const householdCapabilityExport = await readJson(join(distRoot, "data", "household-capability-care-everyday-security.json"));
const communityInstitutionsExport = await readJson(join(distRoot, "data", "community-institutions-social-infrastructure-collective-resilience.json"));
const foodSystemsExport = await readJson(join(distRoot, "data", "food-systems-local-provisioning-community-resource-security.json"));
const housingPlaceExport = await readJson(join(distRoot, "data", "housing-shelter-land-use-place-stability.json"));
const healthWellbeingExport = await readJson(join(distRoot, "data", "health-public-health-disability-population-wellbeing.json"));
const educationKnowledgeCultureExport = await readJson(join(distRoot, "data", "education-learning-skills-knowledge-cultural-capability.json"));
const workLaborLivelihoodsExport = await readJson(join(distRoot, "data", "work-labor-livelihoods-economic-democracy.json"));
const incomeWealthSecurityExport = await readJson(join(distRoot, "data", "income-wealth-poverty-social-protection-economic-security.json"));
const marketsFirmsGovernanceExport = await readJson(join(distRoot, "data", "markets-firms-competition-corporate-power-democratic-economic-governance.json"));
const financeBankingCreditStabilityExport = await readJson(join(distRoot, "data", "finance-banking-credit-capital-allocation-monetary-systems-financial-stability.json"));
const fiscalRevenueDebtMacroExport = await readJson(join(distRoot, "data", "fiscal-policy-public-revenue-sovereign-debt-trade-external-balance-macroeconomic-coordination.json"));
const economicDevelopmentTransformationExport = await readJson(join(distRoot, "data", "economic-development-industrial-strategy-innovation-systems-regional-convergence-productive-transformation.json"));
const physicalEconomySupplyChainExport = await readJson(join(distRoot, "data", "energy-materials-manufacturing-logistics-strategic-supply-chain-transformation.json"));
const territorialSystemsDeliveryExport = await readJson(join(distRoot, "data", "infrastructure-construction-buildings-public-works-territorial-systems-delivery.json"));
const mobilityNetworkAccessExport = await readJson(join(distRoot, "data", "mobility-transportation-freight-communications-digital-networks-territorial-access.json"));
const environmentPlanetaryStewardshipExport = await readJson(join(distRoot, "data", "environment-climate-ecosystems-pollution-waste-circularity-planetary-system-stewardship.json"));
const justiceSafetySecurityPeaceExport = await readJson(join(distRoot, "data", "law-justice-public-safety-emergency-management-security-defense-peace.json"));
const democracyGovernmentLegitimacyExport = await readJson(join(distRoot, "data", "democracy-government-public-administration-civic-information-institutional-legitimacy.json"));
const internationalOrderSharedFuturesExport = await readJson(join(distRoot, "data", "international-order-multilateral-cooperation-global-commons-cross-border-risk-shared-human-futures.json"));
const wholeSystemFuturesExport = await readJson(join(distRoot, "data", "whole-system-futures-scenario-governance-polycrisis-readiness-civilizational-resilience-future-generations.json"));
const publicKnowledgeStewardshipExport = await readJson(join(distRoot, "data", "public-knowledge-synthesis-civic-decision-literacy-reader-navigation-content-closure-evergreen-stewardship.json"));
const v03EditorialExport = await readJson(join(distRoot, "data", "v03-editorial-review.json"));
const v031ContentExpansionExport = await readJson(join(distRoot, "data", "v031-content-expansion.json"));
const phase116CoverageExport = await readJson(join(distRoot, "data", "phase-116-coverage-architecture.json"));
const phase117AuthorityExport = await readJson(join(distRoot, "data", "global-authority-graph.json"));
const phase118EncyclopediaExport = await readJson(join(distRoot, "data", "phase-118-canonical-living-encyclopedia.json"));
const phase119AtlasExport = await readJson(join(distRoot, "data", "deep-project-place-atlas.json"));
const v04PublicConversionObservatoryExport = await readJson(join(distRoot, "data", "v04-public-conversion-observatory.json"));
const phase120AcquisitionExport = await readJson(join(distRoot, "data", "phase-120-evidence-acquisition-packets.json"));
const phase121MissionsExport = await readJson(join(distRoot, "data", "phase-121-priority-research-missions.json"));
const phase122PlaybooksExport = await readJson(join(distRoot, "data", "phase-122-verification-playbook-library.json"));
const phase123DossiersExport = await readJson(join(distRoot, "data", "phase-123-comparative-delivery-dossiers.json"));
const phase124WorkbenchesExport = await readJson(join(distRoot, "data", "phase-124-topic-research-workbenches.json"));
const v05EvidenceFieldbookExport = await readJson(join(distRoot, "data", "v05-evidence-fieldbook.json"));
const phase125AnnotationsExport = await readJson(join(distRoot, "data", "phase-125-evidence-annotation-ledger.json"));
const phase126AuditsExport = await readJson(join(distRoot, "data", "phase-126-mission-evidence-audits.json"));
const phase127BiographiesExport = await readJson(join(distRoot, "data", "phase-127-project-place-conversion-biographies.json"));
const phase128TopicReviewsExport = await readJson(join(distRoot, "data", "phase-128-topic-state-of-evidence-reviews.json"));
const phase129SystemSynthesesExport = await readJson(join(distRoot, "data", "phase-129-cross-system-evidence-syntheses.json"));
const v06OpenEvidenceReviewExport = await readJson(join(distRoot, "data", "v06-open-evidence-review.json"));
const sitemap = await readText(join(distRoot, "sitemap.xml"));
const robots = await readText(join(distRoot, "robots.txt"));
const updatesHtml = await readText(join(distRoot, "updates", "index.html"));
const atlasHtml = await readText(join(distRoot, "atlas", "index.html"));
const researchCollectionDirectory = join(appRoot, "src", "content", "research-collections");
const researchDocumentDirectory = join(appRoot, "src", "content", "research-documents");
const readerPathwayDirectory = join(appRoot, "src", "content", "reader-pathways");
const evidenceGapDirectory = join(appRoot, "src", "content", "evidence-gaps");
const localSystemDirectory = join(appRoot, "src", "content", "local-systems");
const briefingDirectory = join(appRoot, "src", "content", "briefings");
const dependencyMapDirectory = join(appRoot, "src", "content", "dependency-maps");
const signalDirectory = join(appRoot, "src", "content", "signals");
const phase55WReviewPath = join(appRoot, "src", "data", "phase-55w-publication-review.json");
const phase55XReviewPath = join(appRoot, "src", "data", "phase-55x-publication-review.json");
const phase55YReviewPath = join(appRoot, "src", "data", "phase-55y-publication-review.json");
const phase55ZReviewPath = join(appRoot, "src", "data", "phase-55z-publication-review.json");
const phase56AReviewPath = join(appRoot, "src", "data", "phase-56a-publication-review.json");
const phase56BReviewPath = join(appRoot, "src", "data", "phase-56b-publication-review.json");
const phase56BPanelsPath = join(appRoot, "src", "data", "phase-56b-entity-panels.json");
const phase56CReviewPath = join(appRoot, "src", "data", "phase-56c-publication-review.json");
const phase56CDossiersPath = join(appRoot, "src", "data", "phase-56c-entity-dossiers.json");
const phase56DReviewPath = join(appRoot, "src", "data", "phase-56d-publication-review.json");
const phase56DTestsPath = join(appRoot, "src", "data", "phase-56d-alternative-tests.json");
const phase56EReviewPath = join(appRoot, "src", "data", "phase-56e-publication-review.json");
const phase56EPanelsPath = join(appRoot, "src", "data", "phase-56e-second-cohort-panels.json");
const phase56EDossiersPath = join(appRoot, "src", "data", "phase-56e-second-cohort-dossiers.json");
const phase56ETestsPath = join(appRoot, "src", "data", "phase-56e-second-cohort-tests.json");
const phase56FReviewPath = join(appRoot, "src", "data", "phase-56f-publication-review.json");
const phase56FCoveragePath = join(appRoot, "src", "data", "phase-56f-cross-cohort-coverage.json");
const phase56GReviewPath = join(appRoot, "src", "data", "phase-56g-publication-review.json");
const phase56GAcquisitionPath = join(appRoot, "src", "data", "phase-56g-operating-record-acquisition.json");
const researchCollectionFiles = (await readdir(researchCollectionDirectory)).filter((name) => name.endsWith(".json"));
const researchDocumentFiles = (await readdir(researchDocumentDirectory)).filter((name) => name.endsWith(".json"));
const readerPathwayFiles = (await readdir(readerPathwayDirectory)).filter((name) => name.endsWith(".json"));
const evidenceGapFiles = (await readdir(evidenceGapDirectory)).filter((name) => name.endsWith(".json"));
const localSystemFiles = (await readdir(localSystemDirectory)).filter(
  (name) => name.endsWith(".md") || name.endsWith(".mdx"),
);
const briefingFiles = (await readdir(briefingDirectory)).filter(
  (name) => name.endsWith(".md") || name.endsWith(".mdx"),
);
const dependencyMapFiles = (await readdir(dependencyMapDirectory)).filter((name) => name.endsWith(".json"));
const signalFiles = (await readdir(signalDirectory)).filter(
  (name) => name.endsWith(".md") || name.endsWith(".mdx"),
);
const researchCollections = await Promise.all(
  researchCollectionFiles.map((name) => readJson(join(researchCollectionDirectory, name))),
);
const researchDocuments = await Promise.all(
  researchDocumentFiles.map((name) => readJson(join(researchDocumentDirectory, name))),
);
const readerPathways = await Promise.all(
  readerPathwayFiles.map((name) => readJson(join(readerPathwayDirectory, name))),
);
const phase55WReview = await readJson(phase55WReviewPath);
const phase55XReview = await readJson(phase55XReviewPath);
const phase55YReview = await readJson(phase55YReviewPath);
const phase55ZReview = await readJson(phase55ZReviewPath);
const phase56AReview = await readJson(phase56AReviewPath);
const phase56BReview = await readJson(phase56BReviewPath);
const phase56BPanels = await readJson(phase56BPanelsPath);
const phase56CReview = await readJson(phase56CReviewPath);
const phase56CDossiers = await readJson(phase56CDossiersPath);
const phase56DReview = await readJson(phase56DReviewPath);
const phase56DTests = await readJson(phase56DTestsPath);
const phase56EReview = await readJson(phase56EReviewPath);
const phase56EPanels = await readJson(phase56EPanelsPath);
const phase56EDossiers = await readJson(phase56EDossiersPath);
const phase56ETests = await readJson(phase56ETestsPath);
const phase56FReview = await readJson(phase56FReviewPath);
const phase56FCoverage = await readJson(phase56FCoveragePath);
const phase56GReview = await readJson(phase56GReviewPath);
const phase56GAcquisition = await readJson(phase56GAcquisitionPath);
const evidenceGaps = await Promise.all(
  evidenceGapFiles.map((name) => readJson(join(evidenceGapDirectory, name))),
);
const allDistFiles = await collectFiles(distRoot);
const downloadsRoot = join(distRoot, "downloads");
const htmlCount = allDistFiles.filter(
  (path) => extname(path) === ".html" && !path.startsWith(downloadsRoot),
).length;
const publicTextExtensions = new Set([".html", ".json", ".xml", ".txt", ".js", ".css"]);
const publicTextFiles = allDistFiles.filter((path) => publicTextExtensions.has(extname(path)));
const publicBuildText = (await Promise.all(publicTextFiles.map((path) => readText(path)))).join("\n");
const signalStatusById = new Map(
  await Promise.all(
    signalFiles.map(async (name) => {
      const text = await readText(join(signalDirectory, name));
      const id = text.match(/^id:\s*"([^"]+)"/m)?.[1];
      const status = text.match(/^record_status:\s*"([^"]+)"/m)?.[1];
      return [id, status];
    }),
  ),
);
const briefingStatusById = new Map(
  await Promise.all(
    briefingFiles.map(async (name) => {
      const text = await readText(join(briefingDirectory, name));
      const id = text.match(/^id:\s*"([^"]+)"/m)?.[1];
      const status = text.match(/^record_status:\s*"([^"]+)"/m)?.[1];
      return [id, status];
    }),
  ),
);
const dependencyMapStatusById = new Map(
  await Promise.all(
    dependencyMapFiles.map(async (name) => {
      const map = await readJson(join(dependencyMapDirectory, name));
      return [map.id, map.record_status];
    }),
  ),
);

check(htmlCount === manifest.expected_build.static_pages, `Expected ${manifest.expected_build.static_pages} HTML files, found ${htmlCount}.`);
check(signals.count === manifest.expected_build.published_signals, `Expected ${manifest.expected_build.published_signals} exported signals, found ${signals.count}.`);
check(sources.count === manifest.expected_build.sources, `Expected ${manifest.expected_build.sources} exported sources, found ${sources.count}.`);
check(topics.count === manifest.expected_build.topics, `Expected ${manifest.expected_build.topics} exported topics, found ${topics.count}.`);
check(
  researchCollections.length === manifest.expected_build.research_collections,
  `Expected ${manifest.expected_build.research_collections} research collections, found ${researchCollections.length}.`,
);
check(
  researchDocuments.length === manifest.expected_build.research_documents,
  `Expected ${manifest.expected_build.research_documents} research documents, found ${researchDocuments.length}.`,
);
check(
  readerPathways.length === manifest.expected_build.reader_pathways,
  `Expected ${manifest.expected_build.reader_pathways} reader pathways, found ${readerPathways.length}.`,
);
check(
  evidenceGaps.length === manifest.expected_build.evidence_gaps,
  `Expected ${manifest.expected_build.evidence_gaps} evidence gaps, found ${evidenceGaps.length}.`,
);
check(
  localSystemFiles.length === manifest.expected_build.local_systems,
  `Expected ${manifest.expected_build.local_systems} local systems, found ${localSystemFiles.length}.`,
);
check(
  briefingFiles.length === manifest.expected_build.briefings,
  `Expected ${manifest.expected_build.briefings} briefings, found ${briefingFiles.length}.`,
);
check(
  dependencyMapFiles.length === manifest.expected_build.dependency_maps,
  `Expected ${manifest.expected_build.dependency_maps} dependency maps, found ${dependencyMapFiles.length}.`,
);
check(
  [signals, sources, topics, researchExport, pathwaysExport, evidenceQueueExport, operatingCycleExport, projectConversionExport, conversionEventsExport, conversionGatesExport, conversionStageMatrixExport, qualificationPacketsExport, evidenceReturnEnvelopesExport, phase60cDeskExport, outcomeCohortsExport, measurementSpecificationsExport, observationReviewExport, longitudinalOutcomeExport, outcomeEvidenceDesignExport, analysisResultExport, synthesisDecisionExport, accountabilityImpactExport, learningPortfolioExport, publicDeliberationExport, interjurisdictionalCompactsExport, publicWealthStewardshipExport, publicInvestmentPortfolioExport, universalServiceExport, householdCapabilityExport, communityInstitutionsExport, foodSystemsExport, housingPlaceExport, healthWellbeingExport, educationKnowledgeCultureExport, workLaborLivelihoodsExport, incomeWealthSecurityExport, marketsFirmsGovernanceExport, financeBankingCreditStabilityExport, fiscalRevenueDebtMacroExport, economicDevelopmentTransformationExport, physicalEconomySupplyChainExport, territorialSystemsDeliveryExport, mobilityNetworkAccessExport, environmentPlanetaryStewardshipExport, justiceSafetySecurityPeaceExport, democracyGovernmentLegitimacyExport, internationalOrderSharedFuturesExport, wholeSystemFuturesExport, publicKnowledgeStewardshipExport, v03EditorialExport, v031ContentExpansionExport, phase116CoverageExport, phase117AuthorityExport, phase118EncyclopediaExport, phase119AtlasExport, v04PublicConversionObservatoryExport, phase120AcquisitionExport, phase121MissionsExport, phase122PlaybooksExport, phase123DossiersExport, phase124WorkbenchesExport, v05EvidenceFieldbookExport].every((dataset) => dataset.schema_version === "1.0"),
  "All public exports must use schema version 1.0.",
);
check(
  [phase125AnnotationsExport, phase126AuditsExport, phase127BiographiesExport, phase128TopicReviewsExport, phase129SystemSynthesesExport, v06OpenEvidenceReviewExport].every((dataset) => dataset.schema_version === "1.0"),
  "All v0.6 public exports must use schema version 1.0.",
);
check(manifest.expected_build.public_json_exports === 68, "Manifest must record sixty-eight public JSON exports.");
check(
  phase60cDeskExport.count === manifest.expected_build.phase_60c_desk_records,
  `Expected ${manifest.expected_build.phase_60c_desk_records} Wave 60C desk records, found ${phase60cDeskExport.count}.`,
);
check(
  phase60cDeskExport.dataset === "phase_60c_editorial_desk" &&
  phase60cDeskExport.records.filter((record) => record.item_kind === "cycle_gate").length === 6 &&
  phase60cDeskExport.records.filter((record) => record.item_kind === "named_file_recheck").length === 2 &&
  phase60cDeskExport.records.every((record) =>
    record.desk_item_id && record.scheduled_check_date && record.source_ids?.length && record.signal_ids?.length &&
    record.exact_next_artifact && record.qualifying_evidence && record.insufficient_evidence &&
    record.required_propagation?.length >= 7 && !("decision_date" in record) && !("receipt_id" in record)
  ),
  "The Wave 60C desk must preserve six cycle gates, two companion rechecks, complete decision contracts, and no future receipt fields.",
);
check(
  outcomeCohortsExport.count === manifest.expected_build.phase_68_cohort_records,
  `Expected ${manifest.expected_build.phase_68_cohort_records} Phase 68 cohort records, found ${outcomeCohortsExport.count}.`,
);
check(
  outcomeCohortsExport.dataset === "compatible_series_outcome_cohorts" &&
  outcomeCohortsExport.records.length === 8 &&
  outcomeCohortsExport.records.every((record) =>
    record.admission_state === "Acquisition" && record.admission_decision === "Not Admitted" &&
    record.compatibility_checks?.length === 8 && record.candidate_measure_families?.length === 4 &&
    record.candidate_measure_families.every((measure) =>
      measure.current_value === null && measure.current_period === null && measure.series_points === 0
    ) &&
    record.observation_values_created === 0 && record.outcome_claim_created === false && record.phase64_cell_change === "none"
  ),
  "The Phase 68 export must preserve eight acquisition cohorts, sixty-four compatibility checks, thirty-two empty measure families, and zero outcomes.",
);
check(
  outcomeCohortsExport.records.flatMap((record) => record.compatibility_checks).length === manifest.expected_build.phase_68_compatibility_checks &&
  outcomeCohortsExport.records.flatMap((record) => record.candidate_measure_families).length === manifest.expected_build.phase_68_candidate_measure_families,
  "The Phase 68 export does not match the manifest compatibility-check or measure-family counts.",
);
const measurementRecords = measurementSpecificationsExport.records.filter((record) => record.record_kind === "measurement_specification");
const intakeRecords = measurementSpecificationsExport.records.filter((record) => record.record_kind === "observation_intake_envelope");
const breakRegisters = measurementSpecificationsExport.records.filter((record) => record.record_kind === "series_break_register");
check(
  measurementSpecificationsExport.dataset === "measurement_specifications" && measurementSpecificationsExport.count === 72 &&
  measurementRecords.length === manifest.expected_build.phase_69_measurement_specifications &&
  intakeRecords.length === manifest.expected_build.phase_69_intake_envelopes &&
  breakRegisters.length === manifest.expected_build.phase_69_series_break_registers,
  "The Phase 69 export must preserve 32 specifications, 32 envelopes, and 8 break registers.",
);
check(
  measurementRecords.every((record) =>
    record.specification_state === "Awaiting First Qualifying Observation" && record.current_observation_count === 0 &&
    record.current_series_point_count === 0 && record.current_value === null && record.current_period === null &&
    record.accepted_observation_ids?.length === 0 && record.receipt_ids?.length === 0 && record.auto_admission_allowed === false &&
    record.phase64_cell_change === "none"
  ),
  "A Phase 69 measurement specification contains premature evidence or state.",
);
check(
  intakeRecords.every((record) =>
    record.envelope_state === "Empty" && record.submitted_artifact === null && record.observation_payload === null &&
    record.attempted_source === null && record.access_result === null && record.decision_date === null &&
    record.receipt_id === null && record.observation_id === null && record.propagation_status === "not_started" &&
    record.auto_publication_allowed === false
  ),
  "A Phase 69 intake envelope contains a premature attempt, observation, decision, receipt, or propagation state.",
);
check(
  breakRegisters.every((record) =>
    record.register_state === "No Admitted Series" && record.actual_break_events?.length === 0 &&
    record.bridge_decisions?.length === 0 && record.admitted_series_ids?.length === 0 && record.observation_count === 0 &&
    record.unresolved_break_count === 0 && record.phase64_cell_change === "none"
  ),
  "A Phase 69 break register contains a premature break, bridge, observation, or admitted series.",
);
const observationReviewRecords = observationReviewExport.records.filter((record) => record.record_kind === "observation_review_docket");
const lineageRecords = observationReviewExport.records.filter((record) => record.record_kind === "observation_revision_lineage_register");
const seriesAdmissionRecords = observationReviewExport.records.filter((record) => record.record_kind === "series_admission_docket");
check(
  observationReviewExport.dataset === "observation_review_series_admission" && observationReviewExport.count === 72 &&
  observationReviewRecords.length === manifest.expected_build.phase_70_observation_review_dockets &&
  lineageRecords.length === manifest.expected_build.phase_70_revision_lineage_registers &&
  seriesAdmissionRecords.length === manifest.expected_build.phase_70_series_admission_dockets,
  "The Phase 70 export must preserve 32 review dockets, 32 lineage registers, and 8 admission dockets.",
);
check(
  observationReviewRecords.every((record) =>
    record.docket_state === "Awaiting Submission" && record.review_checks?.length === 12 &&
    record.review_checks.every((item) => item.decision_state === "Not Reviewed") &&
    record.submitted_observation_id === null && record.first_reviewer_id === null && record.second_reviewer_id === null &&
    record.decision_date === null && record.receipt_id === null && record.accepted_observation_ids?.length === 0 &&
    record.propagation_status === "not_started" && record.auto_acceptance_allowed === false &&
    record.direct_publication_allowed === false && record.phase64_cell_change === "none"
  ),
  "A Phase 70 review docket contains a premature submission, review, receipt, observation, or propagation state.",
);
check(
  lineageRecords.every((record) =>
    record.register_state === "Empty" && record.current_observation_version_id === null &&
    record.observation_versions?.length === 0 && record.correction_events?.length === 0 &&
    record.supersession_events?.length === 0 && record.withdrawal_events?.length === 0 &&
    record.published_observation_ids?.length === 0 && record.unresolved_revision_count === 0 &&
    record.phase64_cell_change === "none"
  ),
  "A Phase 70 lineage register contains a premature version, correction, supersession, withdrawal, or observation.",
);
check(
  seriesAdmissionRecords.every((record) =>
    record.admission_state === "Not Ready - No Reviewed Observations" && record.admission_decision === "Not Admitted" &&
    record.admission_checks?.length === 8 && record.admission_checks.filter((item) => item.decision_state === "Contract Present").length === 1 &&
    record.admission_checks.filter((item) => item.decision_state === "Not Ready").length === 7 &&
    record.candidate_observation_ids?.length === 0 && record.eligible_observation_ids?.length === 0 &&
    record.admitted_series_ids?.length === 0 && record.series_receipt_ids?.length === 0 &&
    record.proposed_series_definition === null && record.decision_receipt_id === null &&
    record.propagation_status === "not_started" && record.auto_admission_allowed === false &&
    record.phase64_cell_change === "none" && record.outcome_claim_created === false
  ),
  "A Phase 70 admission docket contains a premature observation, series definition, receipt, admission, or outcome.",
);
const longitudinalPanelRecords = longitudinalOutcomeExport.records.filter((record) => record.record_kind === "longitudinal_panel_shell");
const outcomeClaimRecords = longitudinalOutcomeExport.records.filter((record) => record.record_kind === "outcome_claim_docket");
const comparisonEmbargoRecords = longitudinalOutcomeExport.records.filter((record) => record.record_kind === "comparison_embargo_register");
check(
  longitudinalOutcomeExport.dataset === "longitudinal_panels_outcome_claims" && longitudinalOutcomeExport.count === 48 &&
  longitudinalPanelRecords.length === manifest.expected_build.phase_71_longitudinal_panel_shells &&
  outcomeClaimRecords.length === manifest.expected_build.phase_71_outcome_claim_dockets &&
  comparisonEmbargoRecords.length === manifest.expected_build.phase_71_comparison_embargo_registers,
  "The Phase 71 export must preserve 32 panel shells, 8 outcome-claim dockets, and 8 comparison embargo registers.",
);
check(
  longitudinalPanelRecords.every((record) =>
    record.panel_state === "Empty - No Admitted Series" && record.current_series_id === null && record.admitted === false &&
    record.accepted_observation_ids?.length === 0 && record.series_point_ids?.length === 0 && record.period_axis?.length === 0 &&
    record.values?.length === 0 && record.revisions?.length === 0 && record.breaks?.length === 0 &&
    record.first_period === null && record.last_period === null && record.current_direction === null &&
    record.current_magnitude === null && record.current_trend === null && record.automatic_trend_allowed === false &&
    record.phase64_cell_change === "none"
  ),
  "A Phase 71 panel shell contains a premature series, point, value, period, direction, magnitude, trend, or stage change.",
);
check(
  outcomeClaimRecords.every((record) =>
    record.docket_state === "Not Ready - No Admitted Series" && record.claim_decision === "Not Published" &&
    record.outcome_inference_checks?.length === 10 && record.outcome_inference_checks.every((item) => item.decision_state === "Not Ready") &&
    record.proposed_claim_text === null && record.supporting_panel_ids?.length === 0 && record.adverse_observation_ids?.length === 0 &&
    record.alternative_explanation_records?.length === 0 && record.uncertainty_statement === null && record.attribution_statement === null &&
    record.first_reviewer_id === null && record.second_reviewer_id === null && record.decision_receipt_id === null &&
    record.causal_claim_allowed === false && record.automatic_publication_allowed === false && record.score_created === false &&
    record.ranking_created === false && record.phase64_cell_change === "none"
  ),
  "A Phase 71 outcome docket contains a premature claim, inference, reviewer, receipt, score, ranking, or stage change.",
);
check(
  comparisonEmbargoRecords.every((record) =>
    record.comparison_state === "Embargoed - No Common Admitted Series" && record.comparison_checks?.length === 10 &&
    record.comparison_checks.every((item) => item.decision_state === "Not Ready") && record.comparison_candidate_ids?.length === 0 &&
    record.approved_peer_ids?.length === 0 && record.approved_measure_ids?.length === 0 && record.comparison_decision === null &&
    record.decision_receipt_id === null && record.cross_entity_transfer_allowed === false && record.automatic_comparison_allowed === false &&
    record.score_created === false && record.ranking_created === false && record.phase64_cell_change === "none"
  ),
  "A Phase 71 comparison register contains a premature comparison, receipt, transfer, score, ranking, or stage change.",
);
const outcomeEvidencePacketRecords = outcomeEvidenceDesignExport.records.filter((record) => record.record_kind === "outcome_evidence_packet");
const alternativeExplanationRecords = outcomeEvidenceDesignExport.records.filter((record) => record.record_kind === "alternative_explanation_register");
const counterfactualDesignRecords = outcomeEvidenceDesignExport.records.filter((record) => record.record_kind === "counterfactual_design_docket");
check(
  outcomeEvidenceDesignExport.dataset === "outcome_evidence_counterfactual_designs" && outcomeEvidenceDesignExport.count === 48 &&
  outcomeEvidencePacketRecords.length === manifest.expected_build.phase_72_outcome_evidence_packets &&
  alternativeExplanationRecords.length === manifest.expected_build.phase_72_alternative_explanation_registers &&
  counterfactualDesignRecords.length === manifest.expected_build.phase_72_counterfactual_design_dockets,
  "The Phase 72 export must preserve 32 outcome-evidence packets, 8 alternative-explanation registers, and 8 counterfactual-design dockets.",
);
check(
  outcomeEvidencePacketRecords.every((record) =>
    record.packet_state === "Empty - No Eligible Panel" && record.packet_checks?.length === 12 &&
    record.packet_checks.every((item) => item.decision_state === "Not Ready") &&
    record.selected_claim_class_id === null && record.outcome_question === null && record.proposed_claim_text === null &&
    record.supporting_panel_ids?.length === 0 && record.supporting_observation_ids?.length === 0 &&
    record.adverse_observation_ids?.length === 0 && record.alternative_explanation_entry_ids?.length === 0 &&
    record.first_reviewer_id === null && record.second_reviewer_id === null && record.decision_receipt_id === null &&
    record.automatic_claim_classification_allowed === false && record.automatic_publication_allowed === false &&
    record.phase64_cell_change === "none"
  ),
  "A Phase 72 outcome-evidence packet contains a premature claim, evidence, reviewer, receipt, or stage change.",
);
check(
  alternativeExplanationRecords.every((record) =>
    record.register_state === "Empty - No Eligible Claim Packet" && record.category_assessments?.length === 10 &&
    record.category_assessments.every((item) => item.assessment_state === "Not Assessed" && item.applicability_decision === null && item.evidence_for_ids?.length === 0 && item.evidence_against_ids?.length === 0 && item.disposition === null) &&
    record.selected_alternative_entry_ids?.length === 0 && record.adverse_observation_ids?.length === 0 &&
    record.decision_receipt_id === null && record.silence_means_none === false && record.automatic_none_allowed === false &&
    record.phase64_cell_change === "none"
  ),
  "A Phase 72 alternative-explanation register invents an assessment, evidence, disposition, receipt, or stage change.",
);
check(
  counterfactualDesignRecords.every((record) =>
    record.design_state === "Inactive - No Causal Claim Proposed" && record.design_decision === "Not Registered" &&
    record.design_checks?.length === 12 && record.design_checks.every((item) => item.decision_state === "Inactive") &&
    record.selected_design_family_id === null && record.causal_question === null && record.estimand === null &&
    record.comparison_unit_ids?.length === 0 && record.donor_pool_ids?.length === 0 && record.confounder_records?.length === 0 &&
    record.preregistration_artifact_id === null && record.decision_receipt_id === null && record.result_inspection_allowed === false &&
    record.automatic_design_selection_allowed === false && record.causal_publication_allowed === false &&
    record.phase64_cell_change === "none"
  ),
  "A Phase 72 design docket contains a premature design, result inspection, causal publication, receipt, or stage change.",
);
const analysisExecutionRecords = analysisResultExport.records.filter((record) => record.record_kind === "analysis_execution_docket");
const protocolDeviationRecords = analysisResultExport.records.filter((record) => record.record_kind === "protocol_deviation_register");
const resultAdjudicationRecords = analysisResultExport.records.filter((record) => record.record_kind === "result_adjudication_docket");
const correctionWithdrawalRecords = analysisResultExport.records.filter((record) => record.record_kind === "correction_withdrawal_register");
check(
  analysisResultExport.dataset === "analysis_execution_result_adjudication" && analysisResultExport.count === 56 &&
  analysisExecutionRecords.length === manifest.expected_build.phase_73_analysis_execution_dockets &&
  protocolDeviationRecords.length === manifest.expected_build.phase_73_protocol_deviation_registers &&
  resultAdjudicationRecords.length === manifest.expected_build.phase_73_result_adjudication_dockets &&
  correctionWithdrawalRecords.length === manifest.expected_build.phase_73_correction_withdrawal_registers,
  "The Phase 73 export must preserve 32 execution dockets and 8 each of deviation, adjudication, and correction registers.",
);
check(
  analysisExecutionRecords.every((record) =>
    record.execution_state === "Inactive - No Registered Design" && record.execution_decision === "Not Authorized" &&
    record.execution_checks?.length === 14 && record.execution_checks.every((item) => item.decision_state === "Inactive") &&
    record.registered_design_receipt_id === null && record.frozen_input_snapshot_id === null && record.input_manifest_ids?.length === 0 &&
    record.code_commit_sha === null && record.environment_digest === null && record.runner_identity === null &&
    record.immutable_execution_log_id === null && record.output_manifest_id === null && record.primary_result_artifact_id === null &&
    record.replication_execution_ids?.length === 0 && record.execution_receipt_id === null && record.execution_allowed === false &&
    record.result_unblinding_allowed === false && record.automatic_rerun_allowed === false &&
    record.automatic_result_publication_allowed === false && record.phase64_cell_change === "none"
  ),
  "A Phase 73 execution docket contains a premature design receipt, input, run, output, result, reviewer, receipt, or stage change.",
);
check(
  protocolDeviationRecords.every((record) =>
    record.register_state === "Empty - No Authorized Execution" && record.category_records?.length === 10 &&
    record.category_records.every((item) => item.record_state === "Not Recorded" && item.deviation_detected === null && item.discovery_stage === null && item.materiality === null && item.description === null && item.impact_on_estimand === null && item.amendment_artifact_id === null && item.reviewer_disposition === null && item.decision_receipt_id === null) &&
    record.deviation_event_ids?.length === 0 && record.protocol_amendment_ids?.length === 0 && record.decision_receipt_id === null &&
    record.silence_means_no_deviation === false && record.automatic_waiver_allowed === false && record.phase64_cell_change === "none"
  ),
  "A Phase 73 deviation register invents a deviation, amendment, disposition, receipt, or stage change.",
);
check(
  resultAdjudicationRecords.every((record) =>
    record.adjudication_state === "Inactive - No Blinded Result" && record.adjudication_decision === "Not Adjudicated" &&
    record.adjudication_checks?.length === 14 && record.adjudication_checks.every((item) => item.decision_state === "Inactive") &&
    record.blind_break_authorization_id === null && record.primary_result_artifact_id === null && record.primary_effect_record === null &&
    record.uncertainty_record === null && record.robustness_records?.length === 0 && record.falsification_records?.length === 0 &&
    record.adverse_or_null_result_ids?.length === 0 && record.deviation_record_ids?.length === 0 && record.replication_records?.length === 0 &&
    record.selected_claim_class_id === null && record.proposed_public_language === null && record.adjudication_receipt_id === null &&
    record.automatic_claim_upgrade_allowed === false && record.automatic_causal_publication_allowed === false &&
    record.automatic_scoring_allowed === false && record.automatic_ranking_allowed === false && record.phase64_cell_change === "none"
  ),
  "A Phase 73 adjudication docket contains a premature result, validation, replication, claim, receipt, score, rank, or stage change.",
);
check(
  correctionWithdrawalRecords.every((record) =>
    record.register_state === "Empty - No Published Result" && record.correction_classes?.length === 8 &&
    record.correction_classes.every((item) => item.event_state === "No Event" && item.event_ids?.length === 0) &&
    record.published_result_ids?.length === 0 && record.correction_event_ids?.length === 0 && record.withdrawal_event_ids?.length === 0 &&
    record.supersession_event_ids?.length === 0 && record.reader_notice_ids?.length === 0 && record.current_public_result_id === null &&
    record.decision_receipt_ids?.length === 0 && record.silent_correction_allowed === false && record.automatic_withdrawal_allowed === false &&
    record.phase64_cell_change === "none"
  ),
  "A Phase 73 correction register invents or hides a result, correction, supersession, withdrawal, notice, receipt, or stage change.",
);
const synthesisInputRecords = synthesisDecisionExport.records.filter((record) => record.record_kind === "result_synthesis_input_docket");
const synthesisDossierRecords = synthesisDecisionExport.records.filter((record) => record.record_kind === "synthesis_contradiction_dossier");
const challengeResponseRecords = synthesisDecisionExport.records.filter((record) => record.record_kind === "external_challenge_response_docket");
const translationReevaluationRecords = synthesisDecisionExport.records.filter((record) => record.record_kind === "decision_translation_reevaluation_register");
check(
  synthesisDecisionExport.dataset === "evidence_synthesis_challenge_decision_translation" && synthesisDecisionExport.count === 56 &&
  synthesisInputRecords.length === manifest.expected_build.phase_74_result_synthesis_input_dockets &&
  synthesisDossierRecords.length === manifest.expected_build.phase_74_synthesis_contradiction_dossiers &&
  challengeResponseRecords.length === manifest.expected_build.phase_74_external_challenge_response_dockets &&
  translationReevaluationRecords.length === manifest.expected_build.phase_74_decision_translation_reevaluation_registers,
  "The Phase 74 export must preserve 32 synthesis inputs and 8 each of synthesis, challenge, and translation records.",
);
check(
  synthesisInputRecords.every((record) =>
    record.input_state === "Inactive - No Adjudicated Result" && record.input_decision === "Not Eligible" &&
    record.eligibility_checks?.length === 14 && record.eligibility_checks.every((item) => item.decision_state === "Inactive") &&
    record.adjudicated_result_id === null && record.adjudication_receipt_id === null && record.current_public_result_id === null &&
    record.effect_record === null && record.uncertainty_record === null && record.replication_result_ids?.length === 0 &&
    record.adverse_or_null_result_ids?.length === 0 && record.provisional_evidence_grade_id === null &&
    record.eligibility_receipt_id === null && record.eligible_for_synthesis === false && record.automatic_evidence_grade_allowed === false &&
    record.automatic_pooling_allowed === false && record.automatic_claim_upgrade_allowed === false && record.phase64_cell_change === "none"
  ),
  "A Phase 74 input docket contains a premature result, synthesis admission, grade, receipt, automation, or stage change.",
);
check(
  synthesisDossierRecords.every((record) =>
    record.synthesis_state === "Inactive - No Eligible Results" && record.synthesis_decision === "Not Synthesized" &&
    record.synthesis_checks?.length === 14 && record.synthesis_checks.every((item) => item.decision_state === "Inactive") &&
    record.contradiction_register?.length === 10 && record.contradiction_register.every((item) => item.record_state === "Not Assessable" && item.contradiction_detected === null && item.affected_result_ids?.length === 0) &&
    record.eligible_result_ids?.length === 0 && record.compatibility_records?.length === 0 && record.triangulation_records?.length === 0 &&
    record.replication_portfolio_records?.length === 0 && record.selected_evidence_grade_id === null && record.proposed_synthesis_language === null &&
    record.synthesis_receipt_id === null && record.automatic_pooling_allowed === false && record.automatic_evidence_grade_allowed === false &&
    record.automatic_claim_publication_allowed === false && record.automatic_recommendation_allowed === false &&
    record.automatic_scoring_allowed === false && record.automatic_ranking_allowed === false && record.phase64_cell_change === "none"
  ),
  "A Phase 74 synthesis dossier contains a premature synthesis, contradiction, grade, claim, recommendation, receipt, score, rank, or stage change.",
);
check(
  challengeResponseRecords.every((record) =>
    record.challenge_state === "Inactive - No Synthesis Claim" && record.challenge_decision === "Not Open" &&
    record.challenge_checks?.length === 12 && record.challenge_checks.every((item) => item.decision_state === "Inactive") &&
    record.challenge_packet_ids?.length === 0 && record.response_packet_ids?.length === 0 && record.independent_adjudication_ids?.length === 0 &&
    record.challenge_receipt_ids?.length === 0 && record.anonymous_assertion_is_evidence === false &&
    record.automatic_claim_reversal_allowed === false && record.automatic_publication_allowed === false &&
    record.silent_challenge_disposition_allowed === false && record.phase64_cell_change === "none"
  ),
  "A Phase 74 challenge docket contains a premature challenge, response, adjudication, receipt, automation, or stage change.",
);
check(
  translationReevaluationRecords.every((record) =>
    record.translation_state === "Inactive - No Adjudicated Synthesis" && record.translation_decision === "No Decision Translation" &&
    record.translation_checks?.length === 14 && record.translation_checks.every((item) => item.decision_state === "Inactive") &&
    record.reevaluation_trigger_records?.length === 10 && record.reevaluation_trigger_records.every((item) => item.trigger_state === "Dormant" && item.event_ids?.length === 0) &&
    record.decision_option_records?.length === 0 && record.harm_records?.length === 0 && record.recommendation_conflict_records?.length === 0 &&
    record.proposed_recommendation === null && record.monitoring_plan_id === null && record.sunset_date === null &&
    record.translation_receipt_id === null && record.automatic_recommendation_allowed === false && record.automatic_adoption_allowed === false &&
    record.automatic_sunset_extension_allowed === false && record.automatic_scoring_allowed === false &&
    record.automatic_ranking_allowed === false && record.phase64_cell_change === "none"
  ),
  "A Phase 74 translation register contains a premature option, recommendation, reevaluation, receipt, score, rank, automation, or stage change.",
);
const decisionAccountabilityRecords = accountabilityImpactExport.records.filter((record) => record.record_kind === "decision_accountability_dossier");
const implementationRealizationRecords = accountabilityImpactExport.records.filter((record) => record.record_kind === "implementation_commitment_realization_ledger");
const auditRemediationRecords = accountabilityImpactExport.records.filter((record) => record.record_kind === "post_decision_audit_remediation_register");
check(
  accountabilityImpactExport.dataset === "decision_accountability_realized_impact" && accountabilityImpactExport.count === 48 &&
  decisionAccountabilityRecords.length === manifest.expected_build.phase_75_decision_accountability_dossiers &&
  implementationRealizationRecords.length === manifest.expected_build.phase_75_implementation_commitment_realization_ledgers &&
  auditRemediationRecords.length === manifest.expected_build.phase_75_post_decision_audit_remediation_registers,
  "The Phase 75 export must preserve 8 accountability, 32 commitment-realization, and 8 audit-remediation records.",
);
check(
  decisionAccountabilityRecords.every((record) =>
    record.accountability_state === "Inactive - No Authorized Institutional Decision" && record.accountability_decision === "Not Open" &&
    record.accountability_checks?.length === 16 && record.accountability_checks.every((item) => item.decision_state === "Inactive") &&
    record.decision_owner_records?.length === 0 && record.option_selection_rationale === null && record.conflict_disclosure_records?.length === 0 &&
    record.recusal_records?.length === 0 && record.dissent_archive_ids?.length === 0 && record.authorization_id === null &&
    record.accountability_receipt_id === null && record.automatic_authorization_allowed === false &&
    record.automatic_implementation_allowed === false && record.automatic_sunset_extension_allowed === false &&
    record.automatic_scoring_allowed === false && record.automatic_ranking_allowed === false && record.phase64_cell_change === "none"
  ),
  "A Phase 75 accountability dossier contains a premature owner, option, rationale, conflict, dissent, authorization, receipt, automation, score, rank, or stage change.",
);
check(
  implementationRealizationRecords.every((record) =>
    record.commitment_state === "Inactive - No Authorized Decision" && record.realization_state === "Inactive - No Implementation Commitment" &&
    record.implementation_realization_checks?.length === 16 && record.implementation_realization_checks.every((item) => item.decision_state === "Inactive") &&
    record.safeguard_trigger_records?.length === 12 && record.safeguard_trigger_records.every((item) => item.trigger_state === "Dormant" && item.event_ids?.length === 0) &&
    record.commitment_record_id === null && record.resource_baseline === null && record.capacity_baseline === null &&
    record.milestone_records?.length === 0 && record.safeguard_records?.length === 0 && record.delivered_output_records?.length === 0 &&
    record.benefit_realization_records?.length === 0 && record.harm_realization_records?.length === 0 &&
    record.distributional_monitoring_records?.length === 0 && record.counterfactual_decision_audit_id === null &&
    record.realization_receipt_ids?.length === 0 && record.automatic_commitment_creation_allowed === false &&
    record.automatic_benefit_attribution_allowed === false && record.automatic_net_benefit_claim_allowed === false &&
    record.automatic_stage_advance_allowed === false && record.automatic_scoring_allowed === false &&
    record.automatic_ranking_allowed === false && record.phase64_cell_change === "none"
  ),
  "A Phase 75 implementation ledger contains a premature commitment, baseline, safeguard, output, benefit, harm, distributional finding, audit, receipt, automation, score, rank, or stage change.",
);
check(
  auditRemediationRecords.every((record) =>
    record.audit_state === "Inactive - No Authorized Decision" && record.audit_decision === "Not Scheduled" &&
    record.audit_checks?.length === 12 && record.audit_checks.every((item) => item.decision_state === "Inactive") &&
    record.remediation_class_records?.length === 10 && record.remediation_class_records.every((item) => item.action_state === "Unavailable" && item.event_ids?.length === 0) &&
    record.audit_plan_id === null && record.post_decision_challenge_ids?.length === 0 && record.sunset_enforcement_record === null &&
    record.reversal_decision_id === null && record.remediation_decision_ids?.length === 0 && record.audit_receipt_ids?.length === 0 &&
    record.silent_renewal_allowed === false && record.automatic_sunset_extension_allowed === false &&
    record.automatic_remediation_closure_allowed === false && record.automatic_score_allowed === false &&
    record.automatic_rank_allowed === false && record.phase64_cell_change === "none"
  ),
  "A Phase 75 audit register contains a premature audit, challenge, sunset, reversal, remediation, receipt, automation, score, rank, or stage change.",
);
const institutionalLearningRecords = learningPortfolioExport.records.filter((record) => record.record_kind === "institutional_learning_dossier");
const crossCaseTransferRecords = learningPortfolioExport.records.filter((record) => record.record_kind === "cross_case_transfer_register");
const portfolioGovernanceRecords = learningPortfolioExport.records.filter((record) => record.record_kind === "portfolio_governance_register");
const policyRetirementRecords = learningPortfolioExport.records.filter((record) => record.record_kind === "policy_supersession_retirement_ledger");
check(
  learningPortfolioExport.dataset === "cross_case_learning_portfolio_policy_retirement" && learningPortfolioExport.count === 50 &&
  institutionalLearningRecords.length === manifest.expected_build.phase_76_institutional_learning_dossiers &&
  crossCaseTransferRecords.length === manifest.expected_build.phase_76_cross_case_transfer_registers &&
  portfolioGovernanceRecords.length === manifest.expected_build.phase_76_portfolio_governance_registers &&
  policyRetirementRecords.length === manifest.expected_build.phase_76_policy_supersession_retirement_ledgers,
  "The Phase 76 export must preserve 8 learning, 28 transfer, 6 portfolio, and 8 policy-retirement records.",
);
check(
  institutionalLearningRecords.every((record) =>
    record.learning_state === "Inactive - No Independently Audited Decision" && record.admission_decision === "Not Open" &&
    record.learning_admission_checks?.length === 14 && record.learning_admission_checks.every((item) => item.decision_state === "Inactive") &&
    record.retention_records?.length === 12 && record.retention_records.every((item) => item.retention_state === "Empty" && item.record_ids?.length === 0) &&
    record.cross_case_transfer_register_ids?.length === 7 && record.audit_receipt_ids?.length === 0 && record.learning_memo_id === null &&
    record.bounded_lesson_records?.length === 0 && record.non_transfer_finding_records?.length === 0 && record.admission_receipt_id === null &&
    record.automatic_learning_allowed === false && record.automatic_transfer_allowed === false &&
    record.automatic_policy_reuse_allowed === false && record.automatic_scoring_allowed === false &&
    record.automatic_ranking_allowed === false && record.phase64_cell_change === "none"
  ),
  "A Phase 76 learning dossier contains a premature audit, lesson, memo, transfer, receipt, automation, score, rank, or stage change.",
);
check(
  crossCaseTransferRecords.every((record) =>
    record.comparison_state === "Inactive - Fewer Than Two Independently Audited Decisions" && record.transfer_decision === "Not Open" &&
    record.comparison_checks?.length === 16 && record.comparison_checks.every((item) => item.decision_state === "Inactive") &&
    record.transfer_condition_records?.length === 12 && record.transfer_condition_records.every((item) => item.condition_state === "Not Assessable" && item.finding_ids?.length === 0) &&
    record.eligible_decision_version_ids?.length === 0 && record.transfer_condition_findings?.length === 0 &&
    record.non_transfer_findings?.length === 0 && record.bounded_reuse_decision === null && record.comparison_receipt_id === null &&
    record.automatic_comparability_allowed === false && record.automatic_transfer_allowed === false &&
    record.automatic_policy_reuse_allowed === false && record.automatic_score_allowed === false &&
    record.automatic_rank_allowed === false && record.phase64_cell_change === "none"
  ),
  "A Phase 76 pairwise register contains a premature comparison, transfer condition, reuse decision, receipt, automation, score, rank, or stage change.",
);
check(
  portfolioGovernanceRecords.every((record) =>
    record.portfolio_state === "Inactive - No Admitted Cross-Case Evidence" && record.governance_decision === "Not Open" &&
    record.portfolio_checks?.length === 14 && record.portfolio_checks.every((item) => item.decision_state === "Inactive") &&
    record.portfolio_risk_trigger_records?.length === 12 && record.portfolio_risk_trigger_records.every((item) => item.trigger_state === "Dormant" && item.event_ids?.length === 0) &&
    record.shared_dependency_records?.length === 0 && record.concentration_findings?.length === 0 && record.cumulative_burden_findings?.length === 0 &&
    record.distributional_findings?.length === 0 && record.governance_decision_record === null && record.governance_receipt_id === null &&
    record.automatic_portfolio_membership_allowed === false && record.automatic_resource_reallocation_allowed === false &&
    record.automatic_rebalance_allowed === false && record.automatic_score_allowed === false &&
    record.automatic_rank_allowed === false && record.phase64_cell_change === "none"
  ),
  "A Phase 76 portfolio register contains a premature dependency, concentration, burden, governance, rebalance, receipt, automation, score, rank, or stage change.",
);
check(
  policyRetirementRecords.every((record) =>
    record.lifecycle_state === "Inactive - No Authorized Policy Or Retirement Decision" && record.retirement_decision === "Not Open" &&
    record.lifecycle_checks?.length === 14 && record.lifecycle_checks.every((item) => item.decision_state === "Inactive") &&
    record.decommissioning_obligation_records?.length === 10 && record.decommissioning_obligation_records.every((item) => item.obligation_state === "Unavailable" && item.evidence_ids?.length === 0 && item.receipt_id === null) &&
    record.policy_record_id === null && record.successor_policy_id === null && record.supersession_decision_id === null &&
    record.transition_plan_id === null && record.decommissioning_plan_id === null && record.residual_obligation_records?.length === 0 &&
    record.unresolved_harm_records?.length === 0 && record.retirement_receipt_id === null && record.silent_renewal_allowed === false &&
    record.automatic_supersession_allowed === false && record.automatic_retirement_allowed === false &&
    record.automatic_archive_deletion_allowed === false && record.automatic_score_allowed === false &&
    record.automatic_rank_allowed === false && record.phase64_cell_change === "none"
  ),
  "A Phase 76 policy ledger contains a premature policy, successor, supersession, retirement, decommissioning, archive deletion, receipt, automation, score, rank, or stage change.",
);
const stakeholderStandingRecords = publicDeliberationExport.records.filter((record) => record.record_kind === "stakeholder_standing_notice_register");
const deliberationResponseRecords = publicDeliberationExport.records.filter((record) => record.record_kind === "deliberation_issue_response_docket");
const mandateAppealRecords = publicDeliberationExport.records.filter((record) => record.record_kind === "mandate_legitimacy_appeal_register");
const adaptiveMandateRecords = publicDeliberationExport.records.filter((record) => record.record_kind === "adaptive_mandate_review_ledger");
check(
  publicDeliberationExport.dataset === "public_deliberation_participatory_governance_adaptive_mandate" && publicDeliberationExport.count === 32 &&
  stakeholderStandingRecords.length === manifest.expected_build.phase_77_stakeholder_standing_notice_registers &&
  deliberationResponseRecords.length === manifest.expected_build.phase_77_deliberation_issue_response_dockets &&
  mandateAppealRecords.length === manifest.expected_build.phase_77_mandate_legitimacy_appeal_registers &&
  adaptiveMandateRecords.length === manifest.expected_build.phase_77_adaptive_mandate_review_ledgers,
  "The Phase 77 export must preserve 8 standing, 8 deliberation, 8 mandate-appeal, and 8 adaptive-review records.",
);
check(
  stakeholderStandingRecords.every((record) =>
    record.standing_state === "Inactive - No Admitted Cross-Case Finding" && record.opening_decision === "Not Open" &&
    record.standing_notice_checks?.length === 16 && record.standing_notice_checks.every((item) => item.decision_state === "Inactive") &&
    record.constituency_standing_records?.length === 12 && record.constituency_standing_records.every((item) => item.standing_state === "Unassessed" && item.claimant_ids?.length === 0 && item.evidence_ids?.length === 0) &&
    record.admitted_cross_case_finding_ids?.length === 0 && record.public_decision_question === null && record.notice_plan_id === null &&
    record.accessibility_plan_id === null && record.standing_decision_records?.length === 0 && record.standing_notice_receipt_id === null &&
    record.automatic_standing_allowed === false && record.automatic_exclusion_allowed === false &&
    record.participation_volume_as_legitimacy_allowed === false && record.automatic_score_allowed === false &&
    record.automatic_rank_allowed === false && record.phase64_cell_change === "none"
  ),
  "A Phase 77 standing register contains a premature finding, decision, notice, access, receipt, automation, score, rank, or stage change.",
);
check(
  deliberationResponseRecords.every((record) =>
    record.deliberation_state === "Inactive - No Authorized Participation Process" && record.process_decision === "Not Open" &&
    record.deliberation_checks?.length === 18 && record.deliberation_checks.every((item) => item.decision_state === "Inactive") &&
    record.issue_matrix_records?.length === 12 && record.issue_matrix_records.every((item) => item.issue_state === "Unopened" && item.submission_ids?.length === 0 && item.response_record_id === null) &&
    record.participation_quality_records?.length === 12 && record.participation_quality_records.every((item) => item.measurement_state === "Not Measured" && item.finding_id === null) &&
    record.consultation_records?.length === 0 && record.public_comment_records?.length === 0 && record.affected_community_hearing_records?.length === 0 &&
    record.material_issue_records?.length === 0 && record.reasoned_response_records?.length === 0 && record.deliberation_receipt_id === null &&
    record.automatic_consensus_allowed === false && record.automatic_consent_allowed === false &&
    record.comment_count_as_weight_allowed === false && record.automatic_score_allowed === false &&
    record.automatic_rank_allowed === false && record.phase64_cell_change === "none"
  ),
  "A Phase 77 deliberation docket contains a premature process, comment, hearing, response, quality finding, receipt, automation, score, rank, or stage change.",
);
check(
  mandateAppealRecords.every((record) =>
    record.mandate_state === "Inactive - No Completed Reasoned-Response Record" && record.mandate_decision === "Not Open" &&
    record.mandate_legitimacy_checks?.length === 16 && record.mandate_legitimacy_checks.every((item) => item.decision_state === "Inactive") &&
    record.appeal_ground_records?.length === 10 && record.appeal_ground_records.every((item) => item.ground_state === "Unavailable" && item.appeal_ids?.length === 0 && item.decision_ids?.length === 0) &&
    record.completed_reasoned_response_ids?.length === 0 && record.legitimacy_audit_record === null && record.appeal_records?.length === 0 &&
    record.reconsideration_records?.length === 0 && record.mandate_terms === null && record.mandate_receipt_id === null &&
    record.automatic_legitimacy_allowed === false && record.automatic_mandate_allowed === false &&
    record.automatic_appeal_disposition_allowed === false && record.automatic_score_allowed === false &&
    record.automatic_rank_allowed === false && record.phase64_cell_change === "none"
  ),
  "A Phase 77 mandate register contains a premature legitimacy finding, appeal, mandate, receipt, automation, score, rank, or stage change.",
);
check(
  adaptiveMandateRecords.every((record) =>
    record.adaptive_state === "Inactive - No Authorized Public Mandate" && record.review_decision === "Not Open" &&
    record.adaptive_review_checks?.length === 14 && record.adaptive_review_checks.every((item) => item.decision_state === "Inactive") &&
    record.adaptive_trigger_records?.length === 12 && record.adaptive_trigger_records.every((item) => item.trigger_state === "Dormant" && item.event_ids?.length === 0 && item.review_id === null) &&
    record.authorized_mandate_id === null && record.baseline_records?.length === 0 && record.monitoring_records?.length === 0 &&
    record.trigger_event_records?.length === 0 && record.adaptive_option_records?.length === 0 && record.adaptive_decision_record === null &&
    record.adaptive_review_receipt_id === null && record.silent_renewal_allowed === false &&
    record.automatic_mandate_extension_allowed === false && record.automatic_trigger_disposition_allowed === false &&
    record.automatic_score_allowed === false && record.automatic_rank_allowed === false && record.phase64_cell_change === "none"
  ),
  "A Phase 77 adaptive ledger contains a premature mandate, trigger, review, change, receipt, automation, score, rank, or stage change.",
);
const interjurisdictionalAuthorityRecords = interjurisdictionalCompactsExport.records.filter((record) => record.record_kind === "interjurisdictional_authority_externality_map");
const sharedPublicValueCompactRecords = interjurisdictionalCompactsExport.records.filter((record) => record.record_kind === "shared_public_value_contribution_compact");
const mutualAidContinuityRecords = interjurisdictionalCompactsExport.records.filter((record) => record.record_kind === "mutual_aid_continuity_dispute_register");
const emergencyNormalizationRecords = interjurisdictionalCompactsExport.records.filter((record) => record.record_kind === "emergency_authority_normalization_ledger");
check(
  interjurisdictionalCompactsExport.dataset === "interjurisdictional_compacts_shared_public_value_emergency_resilience" && interjurisdictionalCompactsExport.count === 32 &&
  interjurisdictionalAuthorityRecords.length === manifest.expected_build.phase_78_interjurisdictional_authority_externality_maps &&
  sharedPublicValueCompactRecords.length === manifest.expected_build.phase_78_shared_public_value_contribution_compacts &&
  mutualAidContinuityRecords.length === manifest.expected_build.phase_78_mutual_aid_continuity_dispute_registers &&
  emergencyNormalizationRecords.length === manifest.expected_build.phase_78_emergency_authority_normalization_ledgers,
  "The Phase 78 export must preserve 8 authority maps, 8 shared-value compacts, 8 continuity-dispute registers, and 8 emergency-normalization ledgers.",
);
check(
  interjurisdictionalAuthorityRecords.every((record) =>
    record.mapping_state === "Inactive - No Authorized Public Mandate" && record.opening_decision === "Not Open" &&
    record.authority_externality_checks?.length === 16 && record.authority_externality_checks.every((item) => item.decision_state === "Inactive") &&
    record.jurisdiction_assignment_records?.length === 12 && record.jurisdiction_assignment_records.every((item) => item.assignment_state === "Unmapped" && item.authority_ids?.length === 0) &&
    record.externality_records?.length === 12 && record.externality_records.every((item) => item.assessment_state === "Unassessed" && item.finding_id === null) &&
    record.authorized_public_mandate_ids?.length === 0 && record.authority_inventory_records?.length === 0 && record.mapping_receipt_id === null &&
    record.automatic_authority_assignment_allowed === false && record.automatic_externality_finding_allowed === false &&
    record.automatic_forum_selection_allowed === false && record.automatic_score_allowed === false &&
    record.automatic_rank_allowed === false && record.phase64_cell_change === "none"
  ),
  "A Phase 78 authority map contains a premature mandate, jurisdiction assignment, externality finding, receipt, automation, score, rank, or stage change.",
);
check(
  sharedPublicValueCompactRecords.every((record) =>
    record.compact_state === "Inactive - No Admitted Joint-Authority Question" && record.compact_decision === "Not Open" &&
    record.compact_contribution_checks?.length === 18 && record.compact_contribution_checks.every((item) => item.decision_state === "Inactive") &&
    record.public_value_records?.length === 12 && record.public_value_records.every((item) => item.value_state === "Not Valued" && item.allocation_finding_id === null) &&
    record.contribution_records?.length === 12 && record.contribution_records.every((item) => item.contribution_state === "Uncommitted" && item.contributor_ids?.length === 0) &&
    record.compact_authorization_records?.length === 0 && record.executed_compact_id === null && record.compact_receipt_id === null &&
    record.contribution_as_control_allowed === false && record.automatic_value_allocation_allowed === false &&
    record.automatic_compact_authorization_allowed === false && record.automatic_score_allowed === false &&
    record.automatic_rank_allowed === false && record.phase64_cell_change === "none"
  ),
  "A Phase 78 compact contains a premature value allocation, contribution, authorization, receipt, automation, score, rank, or stage change.",
);
check(
  mutualAidContinuityRecords.every((record) =>
    record.continuity_state === "Inactive - No Executed Compact" && record.operating_decision === "Not Open" &&
    record.continuity_dispute_checks?.length === 16 && record.continuity_dispute_checks.every((item) => item.decision_state === "Inactive") &&
    record.continuity_obligation_records?.length === 12 && record.continuity_obligation_records.every((item) => item.obligation_state === "Dormant" && item.activation_ids?.length === 0) &&
    record.dispute_ground_records?.length === 10 && record.dispute_ground_records.every((item) => item.ground_state === "Unavailable" && item.dispute_ids?.length === 0) &&
    record.mutual_aid_request_records?.length === 0 && record.dispute_records?.length === 0 && record.continuity_receipt_id === null &&
    record.automatic_mutual_aid_activation_allowed === false && record.automatic_priority_allocation_allowed === false &&
    record.automatic_dispute_disposition_allowed === false && record.automatic_score_allowed === false &&
    record.automatic_rank_allowed === false && record.phase64_cell_change === "none"
  ),
  "A Phase 78 continuity register contains a premature request, activation, dispute, receipt, automation, score, rank, or stage change.",
);
check(
  emergencyNormalizationRecords.every((record) =>
    record.emergency_state === "Inactive - No Lawfully Activated Emergency Authority" && record.emergency_decision === "Not Open" &&
    record.emergency_normalization_checks?.length === 18 && record.emergency_normalization_checks.every((item) => item.decision_state === "Inactive") &&
    record.emergency_safeguard_records?.length === 12 && record.emergency_safeguard_records.every((item) => item.safeguard_state === "Inactive" && item.breach_ids?.length === 0) &&
    record.restoration_trigger_records?.length === 12 && record.restoration_trigger_records.every((item) => item.trigger_state === "Dormant" && item.event_ids?.length === 0) &&
    record.activation_decision_record === null && record.activation_date === null && record.expiry_date === null &&
    record.restoration_records?.length === 0 && record.democratic_reauthorization_record === null && record.normalization_receipt_id === null &&
    record.silent_emergency_extension_allowed === false && record.compact_authority_laundering_allowed === false &&
    record.automatic_rights_suspension_allowed === false && record.automatic_reauthorization_allowed === false &&
    record.automatic_score_allowed === false && record.automatic_rank_allowed === false && record.phase64_cell_change === "none"
  ),
  "A Phase 78 emergency ledger contains a premature activation, extension, rights suspension, restoration, reauthorization, receipt, automation, score, rank, or stage change.",
);
const publicAssetObligationRecords = publicWealthStewardshipExport.records.filter((record) => record.record_kind === "public_asset_obligation_register");
const lifecycleMaintenanceRecords = publicWealthStewardshipExport.records.filter((record) => record.record_kind === "lifecycle_cost_maintenance_ledger");
const procurementContingentRiskRecords = publicWealthStewardshipExport.records.filter((record) => record.record_kind === "procurement_dependency_contingent_risk_register");
const intergenerationalStewardshipRecords = publicWealthStewardshipExport.records.filter((record) => record.record_kind === "intergenerational_balance_sheet_stewardship_ledger");
check(
  publicWealthStewardshipExport.dataset === "public_wealth_long_horizon_stewardship_intergenerational_balance_sheet" && publicWealthStewardshipExport.count === 32 &&
  publicAssetObligationRecords.length === manifest.expected_build.phase_79_public_asset_obligation_registers &&
  lifecycleMaintenanceRecords.length === manifest.expected_build.phase_79_lifecycle_cost_maintenance_ledgers &&
  procurementContingentRiskRecords.length === manifest.expected_build.phase_79_procurement_dependency_contingent_risk_registers &&
  intergenerationalStewardshipRecords.length === manifest.expected_build.phase_79_intergenerational_balance_sheet_stewardship_ledgers,
  "The Phase 79 export must preserve 8 asset-obligation registers, 8 lifecycle-maintenance ledgers, 8 procurement-risk registers, and 8 intergenerational balance sheets.",
);
check(
  publicAssetObligationRecords.every((record) =>
    record.register_state === "Inactive - No Executed Phase 78 Compact" && record.admission_decision === "Not Open" &&
    record.asset_obligation_checks?.length === 18 && record.asset_obligation_checks.every((item) => item.decision_state === "Inactive") &&
    record.asset_class_records?.length === 14 && record.asset_class_records.every((item) => item.asset_state === "Unregistered" && item.asset_ids?.length === 0) &&
    record.obligation_class_records?.length === 14 && record.obligation_class_records.every((item) => item.obligation_state === "Unregistered" && item.obligation_ids?.length === 0) &&
    record.executed_phase78_compact_ids?.length === 0 && record.asset_records?.length === 0 && record.obligation_records?.length === 0 && record.valuation_method_record === null && record.register_receipt_id === null &&
    record.market_value_as_public_value_allowed === false && record.asset_as_authority_allowed === false && record.automatic_valuation_allowed === false && record.automatic_obligation_recognition_allowed === false &&
    record.automatic_score_allowed === false && record.automatic_rank_allowed === false && record.phase64_cell_change === "none"
  ),
  "A Phase 79 asset register contains a premature asset, obligation, valuation, receipt, automation, score, rank, or stage change.",
);
check(
  lifecycleMaintenanceRecords.every((record) =>
    record.lifecycle_state === "Inactive - No Admitted Public Asset Or Obligation" && record.planning_decision === "Not Open" &&
    record.lifecycle_maintenance_checks?.length === 18 && record.lifecycle_maintenance_checks.every((item) => item.decision_state === "Inactive") &&
    record.lifecycle_stage_records?.length === 12 && record.lifecycle_stage_records.every((item) => item.stage_state === "Unplanned" && item.cost_records?.length === 0) &&
    record.maintenance_duty_records?.length === 12 && record.maintenance_duty_records.every((item) => item.duty_state === "Unfunded" && item.owner_ids?.length === 0) &&
    record.capital_cost_records?.length === 0 && record.maintenance_plan_records?.length === 0 && record.affordability_and_funding_record === null && record.lifecycle_receipt_id === null &&
    record.capital_cost_as_lifecycle_cost_allowed === false && record.deferred_maintenance_as_savings_allowed === false && record.automatic_discount_rate_allowed === false && record.automatic_affordability_finding_allowed === false &&
    record.automatic_score_allowed === false && record.automatic_rank_allowed === false && record.phase64_cell_change === "none"
  ),
  "A Phase 79 lifecycle ledger contains a premature plan, cost, maintenance duty, funding finding, receipt, automation, score, rank, or stage change.",
);
check(
  procurementContingentRiskRecords.every((record) =>
    record.procurement_risk_state === "Inactive - No Authorized Lifecycle Plan" && record.commitment_decision === "Not Open" &&
    record.procurement_risk_checks?.length === 20 && record.procurement_risk_checks.every((item) => item.decision_state === "Inactive") &&
    record.dependency_class_records?.length === 12 && record.dependency_class_records.every((item) => item.dependency_state === "Unassessed" && item.vendor_ids?.length === 0) &&
    record.liability_class_records?.length === 14 && record.liability_class_records.every((item) => item.liability_state === "Unrecognized" && item.obligation_ids?.length === 0) &&
    record.insurance_limit_records?.length === 10 && record.insurance_limit_records.every((item) => item.limit_state === "Unassessed" && item.gap_finding_id === null) &&
    record.vendor_identity_records?.length === 0 && record.debt_records?.length === 0 && record.guarantee_and_indemnity_records?.length === 0 && record.contingent_liability_records?.length === 0 && record.procurement_risk_receipt_id === null &&
    record.procurement_as_public_value_allowed === false && record.insurance_as_risk_elimination_allowed === false && record.automatic_vendor_selection_allowed === false && record.automatic_liability_recognition_allowed === false &&
    record.automatic_score_allowed === false && record.automatic_rank_allowed === false && record.phase64_cell_change === "none"
  ),
  "A Phase 79 procurement-risk register contains a premature procurement, vendor, debt, guarantee, liability, insurance finding, receipt, automation, score, rank, or stage change.",
);
check(
  intergenerationalStewardshipRecords.every((record) =>
    record.balance_sheet_state === "Inactive - No Verified Public Wealth Inputs" && record.stewardship_decision === "Not Open" &&
    record.intergenerational_stewardship_checks?.length === 20 && record.intergenerational_stewardship_checks.every((item) => item.decision_state === "Inactive") &&
    record.distribution_account_records?.length === 12 && record.distribution_account_records.every((item) => item.account_state === "Unmeasured" && item.benefit_records?.length === 0) &&
    record.future_user_test_records?.length === 12 && record.future_user_test_records.every((item) => item.test_state === "Not Tested" && item.finding_id === null) &&
    record.fiscal_stress_trigger_records?.length === 12 && record.fiscal_stress_trigger_records.every((item) => item.trigger_state === "Dormant" && item.event_ids?.length === 0) &&
    record.stewardship_duty_records?.length === 12 && record.stewardship_duty_records.every((item) => item.duty_state === "Unassigned" && item.owner_ids?.length === 0) &&
    record.reserve_records?.length === 0 && record.sinking_fund_records?.length === 0 && record.stress_test_records?.length === 0 && record.restructuring_records?.length === 0 && record.intergenerational_audit_record === null && record.stewardship_receipt_id === null &&
    record.present_value_as_intergenerational_fairness_allowed === false && record.reserve_as_funded_obligation_allowed === false && record.emergency_authority_as_fiscal_authority_allowed === false && record.automatic_restructuring_allowed === false &&
    record.automatic_score_allowed === false && record.automatic_rank_allowed === false && record.phase64_cell_change === "none"
  ),
  "A Phase 79 balance sheet contains a premature distribution, future-user, reserve, stress, restructuring, audit, receipt, automation, score, rank, or stage change.",
);
const investmentThesisRecords = publicInvestmentPortfolioExport.records.filter((record) => record.record_kind === "public_investment_mission_thesis_dossier");
const portfolioSequenceRecords = publicInvestmentPortfolioExport.records.filter((record) => record.record_kind === "portfolio_membership_dependency_sequence_register");
const deliveryCapacityRecords = publicInvestmentPortfolioExport.records.filter((record) => record.record_kind === "place_based_delivery_capacity_transition_ledger");
const portfolioRealizationRecords = publicInvestmentPortfolioExport.records.filter((record) => record.record_kind === "portfolio_stress_rebalancing_realization_ledger");
check(
  publicInvestmentPortfolioExport.dataset === "public_investment_portfolios_transition_pathways_place_based_capacity" && publicInvestmentPortfolioExport.count === 32 &&
  investmentThesisRecords.length === manifest.expected_build.phase_80_public_investment_mission_thesis_dossiers &&
  portfolioSequenceRecords.length === manifest.expected_build.phase_80_portfolio_membership_dependency_sequence_registers &&
  deliveryCapacityRecords.length === manifest.expected_build.phase_80_place_based_delivery_capacity_transition_ledgers &&
  portfolioRealizationRecords.length === manifest.expected_build.phase_80_portfolio_stress_rebalancing_realization_ledgers,
  "The Phase 80 export must preserve 8 investment-thesis dossiers, 8 portfolio-sequence registers, 8 place-capacity-transition ledgers, and 8 stress-rebalancing-realization ledgers.",
);
check(
  investmentThesisRecords.every((record) =>
    record.thesis_state === "Inactive - No Verified Phase 79 Stewardship Record" && record.admission_decision === "Not Open" &&
    record.investment_thesis_checks?.length === 18 && record.investment_thesis_checks.every((item) => item.decision_state === "Inactive") &&
    record.mission_class_records?.length === 12 && record.mission_class_records.every((item) => item.mission_state === "Unassigned" && item.evidence_ids?.length === 0) &&
    record.instrument_class_records?.length === 12 && record.instrument_class_records.every((item) => item.instrument_state === "Unassessed" && item.funding_ids?.length === 0 && item.financing_ids?.length === 0) &&
    record.verified_phase79_stewardship_record_ids?.length === 0 && record.investment_thesis_record === null && record.funding_records?.length === 0 && record.financing_records?.length === 0 && record.thesis_receipt_id === null &&
    record.announcement_as_investment_thesis_allowed === false && record.financing_as_funding_allowed === false && record.urgency_as_priority_allowed === false && record.automatic_project_selection_allowed === false && record.automatic_score_allowed === false && record.automatic_rank_allowed === false && record.phase64_cell_change === "none"
  ),
  "A Phase 80 thesis contains a premature mission, investment, funding, financing, priority, receipt, score, rank, or stage change.",
);
check(
  portfolioSequenceRecords.every((record) =>
    record.portfolio_state === "Inactive - No Admitted Investment Thesis" && record.membership_decision === "Not Open" &&
    record.portfolio_sequence_checks?.length === 20 && record.portfolio_sequence_checks.every((item) => item.decision_state === "Inactive") &&
    record.dependency_class_records?.length === 12 && record.dependency_class_records.every((item) => item.dependency_state === "Unmapped" && item.predecessor_ids?.length === 0) &&
    record.sequence_stage_records?.length === 12 && record.sequence_stage_records.every((item) => item.stage_state === "Unscheduled" && item.member_ids?.length === 0) &&
    record.admitted_member_records?.length === 0 && record.sequencing_records?.length === 0 && record.funding_mix_records?.length === 0 && record.financing_mix_records?.length === 0 && record.portfolio_receipt_id === null &&
    record.project_list_as_portfolio_allowed === false && record.earliest_ready_as_priority_allowed === false && record.automatic_membership_allowed === false && record.automatic_sequence_allowed === false && record.automatic_funding_allowed === false && record.automatic_score_allowed === false && record.automatic_rank_allowed === false && record.phase64_cell_change === "none"
  ),
  "A Phase 80 portfolio register contains premature membership, dependency, sequence, funding, financing, receipt, score, rank, or stage change.",
);
check(
  deliveryCapacityRecords.every((record) =>
    record.delivery_state === "Inactive - No Authorized Portfolio Sequence" && record.readiness_decision === "Not Open" &&
    record.delivery_transition_checks?.length === 20 && record.delivery_transition_checks.every((item) => item.decision_state === "Inactive") &&
    record.delivery_capacity_dimension_records?.length === 14 && record.delivery_capacity_dimension_records.every((item) => item.capacity_state === "Untested" && item.baseline_ids?.length === 0) &&
    record.workforce_supplier_readiness_records?.length === 12 && record.workforce_supplier_readiness_records.every((item) => item.readiness_state === "Unverified" && item.workforce_ids?.length === 0 && item.supplier_ids?.length === 0) &&
    record.place_based_obligation_records?.length === 12 && record.place_based_obligation_records.every((item) => item.obligation_state === "Unassigned" && item.owner_ids?.length === 0) &&
    record.just_transition_safeguard_records?.length === 12 && record.just_transition_safeguard_records.every((item) => item.safeguard_state === "Unverified" && item.receipt_ids?.length === 0) &&
    record.workforce_records?.length === 0 && record.supplier_records?.length === 0 && record.place_distribution_records?.length === 0 && record.transition_plan_records?.length === 0 && record.capacity_receipt_id === null &&
    record.local_spend_as_just_transition_allowed === false && record.procurement_as_delivery_capacity_allowed === false && record.automatic_readiness_finding_allowed === false && record.automatic_resource_allocation_allowed === false && record.automatic_score_allowed === false && record.automatic_rank_allowed === false && record.phase64_cell_change === "none"
  ),
  "A Phase 80 capacity ledger contains a premature capacity, workforce, supplier, place, transition, receipt, score, rank, or stage change.",
);
check(
  portfolioRealizationRecords.every((record) =>
    record.realization_state === "Inactive - No Verified Delivery Baseline" && record.rebalancing_decision === "Not Open" &&
    record.realization_checks?.length === 20 && record.realization_checks.every((item) => item.decision_state === "Inactive") &&
    record.portfolio_stress_trigger_records?.length === 12 && record.portfolio_stress_trigger_records.every((item) => item.trigger_state === "Dormant" && item.event_ids?.length === 0) &&
    record.rebalancing_action_records?.length === 10 && record.rebalancing_action_records.every((item) => item.action_state === "Not Considered" && item.member_ids?.length === 0) &&
    record.public_value_realization_test_records?.length === 12 && record.public_value_realization_test_records.every((item) => item.test_state === "Not Tested" && item.output_ids?.length === 0 && item.outcome_ids?.length === 0) &&
    record.stress_test_records?.length === 0 && record.off_ramp_records?.length === 0 && record.rebalancing_records?.length === 0 && record.verified_output_records?.length === 0 && record.public_value_findings?.length === 0 && record.realization_receipt_id === null &&
    record.rebalancing_as_failure_erasure_allowed === false && record.delivered_output_as_realized_value_allowed === false && record.sunk_cost_as_continuation_authority_allowed === false && record.automatic_rebalancing_allowed === false && record.automatic_outcome_finding_allowed === false && record.automatic_score_allowed === false && record.automatic_rank_allowed === false && record.phase64_cell_change === "none"
  ),
  "A Phase 80 realization ledger contains a premature stress, off-ramp, rebalancing, output, outcome, realization, receipt, score, rank, or stage change.",
);
const serviceFloorRecords = universalServiceExport.records.filter((record) => record.record_kind === "service_floor_universal_access_dossier");
const affordabilityCoverageRecords = universalServiceExport.records.filter((record) => record.record_kind === "affordability_cross_subsidy_coverage_ledger");
const providerContinuityRecords = universalServiceExport.records.filter((record) => record.record_kind === "provider_plurality_interoperability_continuity_register");
const rightsRestorationRecords = universalServiceExport.records.filter((record) => record.record_kind === "rights_quality_step_in_restoration_ledger");
check(
  universalServiceExport.dataset === "universal_service_essential_systems_public_option_delivery" && universalServiceExport.count === 32 &&
  serviceFloorRecords.length === manifest.expected_build.phase_81_service_floor_universal_access_dossiers &&
  affordabilityCoverageRecords.length === manifest.expected_build.phase_81_affordability_cross_subsidy_coverage_ledgers &&
  providerContinuityRecords.length === manifest.expected_build.phase_81_provider_plurality_interoperability_continuity_registers &&
  rightsRestorationRecords.length === manifest.expected_build.phase_81_rights_quality_step_in_restoration_ledgers,
  "The Phase 81 export must preserve 8 service-floor dossiers, 8 affordability-coverage ledgers, 8 provider-continuity registers, and 8 rights-restoration ledgers.",
);
check(
  serviceFloorRecords.every((record) =>
    record.service_floor_state === "Inactive - No Verified Phase 80 Portfolio Realization Record" && record.adoption_decision === "Not Open" &&
    record.service_floor_checks?.length === 20 && record.service_floor_checks.every((item) => item.decision_state === "Inactive") &&
    record.essential_service_class_records?.length === 14 && record.essential_service_class_records.every((item) => item.classification_state === "Unassigned" && item.evidence_ids?.length === 0) &&
    record.service_floor_dimension_records?.length === 14 && record.service_floor_dimension_records.every((item) => item.floor_state === "Not Defined" && item.standard_ids?.length === 0) &&
    record.eligibility_access_duty_records?.length === 12 && record.eligibility_access_duty_records.every((item) => item.duty_state === "Unassigned" && item.population_ids?.length === 0) &&
    record.verified_phase80_realization_record_ids?.length === 0 && record.service_floor_records?.length === 0 && record.eligibility_records?.length === 0 && record.service_floor_receipt_id === null &&
    record.infrastructure_as_access_allowed === false && record.provider_presence_as_universal_service_allowed === false && record.average_service_as_floor_allowed === false && record.automatic_floor_adoption_allowed === false && record.automatic_eligibility_allowed === false && record.automatic_score_allowed === false && record.automatic_rank_allowed === false && record.phase64_cell_change === "none"
  ),
  "A Phase 81 service-floor dossier contains a premature classification, floor, eligibility, access, receipt, score, rank, or stage change.",
);
check(
  affordabilityCoverageRecords.every((record) =>
    record.affordability_state === "Inactive - No Adopted Essential-Service Floor" && record.affordability_decision === "Not Open" &&
    record.affordability_coverage_checks?.length === 20 && record.affordability_coverage_checks.every((item) => item.decision_state === "Inactive") &&
    record.affordability_protection_records?.length === 12 && record.affordability_protection_records.every((item) => item.protection_state === "Unassessed" && item.funding_ids?.length === 0) &&
    record.cross_subsidy_mechanism_records?.length === 12 && record.cross_subsidy_mechanism_records.every((item) => item.mechanism_state === "Unassessed" && item.contributor_ids?.length === 0) &&
    record.coverage_access_dimension_records?.length === 12 && record.coverage_access_dimension_records.every((item) => item.measurement_state === "Not Measured" && item.observation_ids?.length === 0) &&
    record.burden_records?.length === 0 && record.subsidy_records?.length === 0 && record.cross_subsidy_records?.length === 0 && record.network_coverage_records?.length === 0 && record.affordability_receipt_id === null &&
    record.average_price_as_affordability_allowed === false && record.network_presence_as_access_allowed === false && record.subsidy_as_service_outcome_allowed === false && record.automatic_tariff_allowed === false && record.automatic_subsidy_allowed === false && record.automatic_expansion_allowed === false && record.automatic_score_allowed === false && record.automatic_rank_allowed === false && record.phase64_cell_change === "none"
  ),
  "A Phase 81 affordability ledger contains a premature tariff, subsidy, cross-subsidy, coverage, access, receipt, score, rank, or stage change.",
);
check(
  providerContinuityRecords.every((record) =>
    record.provider_state === "Inactive - No Verified Affordability And Coverage Record" && record.provider_decision === "Not Open" &&
    record.provider_continuity_checks?.length === 22 && record.provider_continuity_checks.every((item) => item.decision_state === "Inactive") &&
    record.provider_operating_model_records?.length === 12 && record.provider_operating_model_records.every((item) => item.model_state === "Unassessed" && item.provider_ids?.length === 0) &&
    record.interoperability_requirement_records?.length === 14 && record.interoperability_requirement_records.every((item) => item.requirement_state === "Unverified" && item.standard_ids?.length === 0) &&
    record.continuity_mutual_aid_capability_records?.length === 12 && record.continuity_mutual_aid_capability_records.every((item) => item.capability_state === "Untested" && item.exercise_ids?.length === 0) &&
    record.provider_records?.length === 0 && record.open_standard_records?.length === 0 && record.mutual_aid_records?.length === 0 && record.exercise_records?.length === 0 && record.provider_receipt_id === null &&
    record.provider_count_as_plurality_allowed === false && record.technical_interface_as_interoperability_allowed === false && record.backup_plan_as_continuity_allowed === false && record.automatic_provider_selection_allowed === false && record.automatic_standard_adoption_allowed === false && record.automatic_mutual_aid_activation_allowed === false && record.automatic_score_allowed === false && record.automatic_rank_allowed === false && record.phase64_cell_change === "none"
  ),
  "A Phase 81 provider register contains a premature provider, standard, interoperability, continuity, activation, receipt, score, rank, or stage change.",
);
check(
  rightsRestorationRecords.every((record) =>
    record.restoration_state === "Inactive - No Verified Provider Continuity Baseline" && record.intervention_decision === "Not Open" &&
    record.rights_restoration_checks?.length === 22 && record.rights_restoration_checks.every((item) => item.decision_state === "Inactive") &&
    record.user_right_remedy_records?.length === 14 && record.user_right_remedy_records.every((item) => item.right_state === "Unadopted" && item.remedy_ids?.length === 0) &&
    record.service_quality_reliability_measure_records?.length === 14 && record.service_quality_reliability_measure_records.every((item) => item.measure_state === "Not Measured" && item.observation_ids?.length === 0) &&
    record.provider_failure_step_in_trigger_records?.length === 12 && record.provider_failure_step_in_trigger_records.every((item) => item.trigger_state === "Dormant" && item.event_ids?.length === 0) &&
    record.emergency_rationing_restoration_duty_records?.length === 12 && record.emergency_rationing_restoration_duty_records.every((item) => item.duty_state === "Unassigned" && item.priority_ids?.length === 0) &&
    record.complaint_records?.length === 0 && record.remedy_records?.length === 0 && record.intervention_option_records?.length === 0 && record.rationing_records?.length === 0 && record.restoration_records?.length === 0 && record.restoration_receipt_id === null &&
    record.average_uptime_as_universal_quality_allowed === false && record.emergency_as_permanent_reduction_allowed === false && record.provider_failure_as_automatic_step_in_allowed === false && record.automatic_intervention_allowed === false && record.automatic_rationing_allowed === false && record.automatic_restoration_priority_allowed === false && record.automatic_score_allowed === false && record.automatic_rank_allowed === false && record.phase64_cell_change === "none"
  ),
  "A Phase 81 rights-restoration ledger contains a premature right, quality finding, failure trigger, intervention, rationing, restoration, remedy, receipt, score, rank, or stage change.",
);
const householdCapabilityRecords = householdCapabilityExport.records.filter((record) => record.record_kind === "household_capability_service_bundle_dossier");
const careCapacityRecords = householdCapabilityExport.records.filter((record) => record.record_kind === "care_infrastructure_workforce_capacity_ledger");
const householdBurdenRecords = householdCapabilityExport.records.filter((record) => record.record_kind === "household_affordability_time_debt_administrative_burden_register");
const neighborhoodRecoveryRecords = householdCapabilityExport.records.filter((record) => record.record_kind === "neighborhood_access_displacement_crisis_recovery_ledger");
check(
  householdCapabilityExport.dataset === "household_capability_care_infrastructure_everyday_security" && householdCapabilityExport.count === 32 &&
  householdCapabilityRecords.length === manifest.expected_build.phase_82_household_capability_service_bundle_dossiers &&
  careCapacityRecords.length === manifest.expected_build.phase_82_care_infrastructure_workforce_capacity_ledgers &&
  householdBurdenRecords.length === manifest.expected_build.phase_82_household_affordability_time_debt_administrative_burden_registers &&
  neighborhoodRecoveryRecords.length === manifest.expected_build.phase_82_neighborhood_access_displacement_crisis_recovery_ledgers,
  "The Phase 82 export must preserve 8 capability dossiers, 8 care-capacity ledgers, 8 household-burden registers, and 8 neighborhood-recovery ledgers.",
);
const noAutomaticAuthority = (record) => Object.entries(record).filter(([key]) => key.endsWith("_allowed")).every(([, value]) => value === false) && record.first_reviewer_id === null && record.second_reviewer_id === null && record.propagation_status === "not_started" && record.phase64_cell_change === "none";
check(
  householdCapabilityRecords.every((record) => record.capability_state === "Inactive - No Verified Phase 81 Universal-Service Record" && record.adoption_decision === "Not Open" && record.capability_checks?.length === 20 && record.capability_checks.every((item) => item.decision_state === "Inactive") && record.household_capability_dimension_records?.length === 14 && record.household_capability_dimension_records.every((item) => item.capability_state === "Not Assessed" && item.finding_id === null) && record.household_service_bundle_class_records?.length === 12 && record.household_service_bundle_class_records.every((item) => item.bundle_state === "Unassigned") && record.life_course_stage_records?.length === 12 && record.life_course_stage_records.every((item) => item.stage_state === "Unassessed") && record.verified_phase81_service_records?.length === 0 && record.capability_floor_records?.length === 0 && record.service_bundle_records?.length === 0 && record.capability_receipt_id === null && noAutomaticAuthority(record)),
  "A Phase 82 capability dossier contains a premature household classification, capability floor, service bundle, receipt, score, rank, or stage change.",
);
check(
  careCapacityRecords.every((record) => record.care_state === "Inactive - No Adopted Household-Capability Floor" && record.capacity_decision === "Not Open" && record.care_capacity_checks?.length === 20 && record.care_capacity_checks.every((item) => item.decision_state === "Inactive") && record.care_service_class_records?.length === 14 && record.care_service_class_records.every((item) => item.service_state === "Unassessed") && record.care_capacity_dimension_records?.length === 12 && record.care_capacity_dimension_records.every((item) => item.capacity_state === "Not Measured" && item.finding_id === null) && record.care_workforce_safeguard_records?.length === 12 && record.care_workforce_safeguard_records.every((item) => item.safeguard_state === "Unverified") && record.assessed_need_records?.length === 0 && record.capacity_records?.length === 0 && record.workforce_records?.length === 0 && record.care_capacity_receipt_id === null && noAutomaticAuthority(record)),
  "A Phase 82 care ledger contains a premature care-need, capacity, workforce, provider, receipt, score, rank, or stage change.",
);
check(
  householdBurdenRecords.every((record) => record.burden_state === "Inactive - No Verified Care-Capacity Record" && record.protection_decision === "Not Open" && record.household_burden_checks?.length === 22 && record.household_burden_checks.every((item) => item.decision_state === "Inactive") && record.household_burden_dimension_records?.length === 14 && record.household_burden_dimension_records.every((item) => item.burden_state === "Not Measured") && record.shock_arrears_pathway_records?.length === 12 && record.shock_arrears_pathway_records.every((item) => item.pathway_state === "Dormant") && record.administrative_burden_safeguard_records?.length === 12 && record.administrative_burden_safeguard_records.every((item) => item.safeguard_state === "Unverified") && record.debt_records?.length === 0 && record.arrears_records?.length === 0 && record.administrative_burden_records?.length === 0 && record.burden_receipt_id === null && noAutomaticAuthority(record)),
  "A Phase 82 burden register contains a premature affordability, time, debt, arrears, benefit-access, protection, receipt, score, rank, or stage change.",
);
check(
  neighborhoodRecoveryRecords.every((record) => record.recovery_state === "Inactive - No Verified Household-Burden Baseline" && record.recovery_decision === "Not Open" && record.neighborhood_recovery_checks?.length === 22 && record.neighborhood_recovery_checks.every((item) => item.decision_state === "Inactive") && record.neighborhood_access_test_records?.length === 12 && record.neighborhood_access_test_records.every((item) => item.test_state === "Not Tested") && record.displacement_mobility_safeguard_records?.length === 12 && record.displacement_mobility_safeguard_records.every((item) => item.safeguard_state === "Unverified") && record.crisis_stabilizer_records?.length === 12 && record.crisis_stabilizer_records.every((item) => item.stabilizer_state === "Unassigned") && record.long_horizon_household_security_test_records?.length === 12 && record.long_horizon_household_security_test_records.every((item) => item.test_state === "Not Tested") && record.displacement_records?.length === 0 && record.response_records?.length === 0 && record.recovery_records?.length === 0 && record.recovery_receipt_id === null && noAutomaticAuthority(record)),
  "A Phase 82 recovery ledger contains a premature access, displacement, relocation, crisis, recovery, remedy, receipt, score, rank, or stage change.",
);
const communityInstitutionRecords = communityInstitutionsExport.records.filter((record) => record.record_kind === "community_institution_access_trust_continuity_dossier");
const civicCapacityRecords = communityInstitutionsExport.records.filter((record) => record.record_kind === "civic_association_cooperative_mutual_aid_capacity_ledger");
const localInformationRecords = communityInstitutionsExport.records.filter((record) => record.record_kind === "local_information_media_public_knowledge_integrity_register");
const collectiveResilienceRecords = communityInstitutionsExport.records.filter((record) => record.record_kind === "collective_preparedness_trauma_recovery_resilience_ledger");
check(
  communityInstitutionsExport.dataset === "community_institutions_social_infrastructure_collective_resilience" && communityInstitutionsExport.count === 32 &&
  communityInstitutionRecords.length === manifest.expected_build.phase_83_community_institution_access_trust_continuity_dossiers &&
  civicCapacityRecords.length === manifest.expected_build.phase_83_civic_association_cooperative_mutual_aid_capacity_ledgers &&
  localInformationRecords.length === manifest.expected_build.phase_83_local_information_media_public_knowledge_integrity_registers &&
  collectiveResilienceRecords.length === manifest.expected_build.phase_83_collective_preparedness_trauma_recovery_resilience_ledgers,
  "The Phase 83 export must preserve 8 institution dossiers, 8 civic-capacity ledgers, 8 information-integrity registers, and 8 collective-resilience ledgers.",
);
check(
  communityInstitutionRecords.every((record) => record.institution_state === "Inactive - No Verified Phase 82 Household-Security Record" && record.institution_decision === "Not Open" && record.institution_checks?.length === 20 && record.institution_checks.every((item) => item.decision_state === "Inactive") && record.community_institution_class_records?.length === 14 && record.community_institution_class_records.every((item) => item.institution_state === "Unassessed") && record.institution_access_trust_dimension_records?.length === 12 && record.institution_access_trust_dimension_records.every((item) => item.dimension_state === "Not Measured") && record.institution_continuity_safeguard_records?.length === 12 && record.institution_continuity_safeguard_records.every((item) => item.safeguard_state === "Unverified") && record.verified_phase82_household_security_records?.length === 0 && record.institution_inventory_records?.length === 0 && record.institution_receipt_id === null && noAutomaticAuthority(record)),
  "A Phase 83 institution dossier contains a premature admission, access, trust, closure, funding, receipt, score, rank, or stage change.",
);
check(
  civicCapacityRecords.every((record) => record.civic_state === "Inactive - No Adopted Community-Institution Baseline" && record.capacity_decision === "Not Open" && record.civic_capacity_checks?.length === 20 && record.civic_capacity_checks.every((item) => item.decision_state === "Inactive") && record.civic_network_type_records?.length === 14 && record.civic_network_type_records.every((item) => item.network_state === "Unassessed") && record.mutual_aid_capacity_dimension_records?.length === 12 && record.mutual_aid_capacity_dimension_records.every((item) => item.capacity_state === "Not Measured") && record.volunteer_worker_safeguard_records?.length === 12 && record.volunteer_worker_safeguard_records.every((item) => item.safeguard_state === "Unverified") && record.network_inventory_records?.length === 0 && record.volunteer_records?.length === 0 && record.civic_capacity_receipt_id === null && noAutomaticAuthority(record)),
  "A Phase 83 civic ledger contains a premature network admission, capacity finding, allocation, ownership decision, receipt, score, rank, or stage change.",
);
check(
  localInformationRecords.every((record) => record.information_state === "Inactive - No Verified Civic-Network Capacity" && record.information_decision === "Not Open" && record.information_integrity_checks?.length === 22 && record.information_integrity_checks.every((item) => item.decision_state === "Inactive") && record.information_ecosystem_function_records?.length === 14 && record.information_ecosystem_function_records.every((item) => item.function_state === "Unassessed") && record.information_integrity_safeguard_records?.length === 12 && record.information_integrity_safeguard_records.every((item) => item.safeguard_state === "Unverified") && record.public_knowledge_access_mode_records?.length === 12 && record.public_knowledge_access_mode_records.every((item) => item.access_state === "Unassessed") && record.ecosystem_records?.length === 0 && record.correction_records?.length === 0 && record.information_receipt_id === null && noAutomaticAuthority(record)),
  "A Phase 83 information register contains a premature ecosystem admission, truth classification, suppression, correction, receipt, score, rank, or stage change.",
);
check(
  collectiveResilienceRecords.every((record) => record.resilience_state === "Inactive - No Verified Local-Information Baseline" && record.resilience_decision === "Not Open" && record.collective_resilience_checks?.length === 22 && record.collective_resilience_checks.every((item) => item.decision_state === "Inactive") && record.community_preparedness_capability_records?.length === 12 && record.community_preparedness_capability_records.every((item) => item.capability_state === "Not Tested") && record.collective_trauma_recovery_safeguard_records?.length === 12 && record.collective_trauma_recovery_safeguard_records.every((item) => item.safeguard_state === "Unverified") && record.institution_closure_displacement_safeguard_records?.length === 12 && record.institution_closure_displacement_safeguard_records.every((item) => item.safeguard_state === "Unverified") && record.long_horizon_collective_resilience_test_records?.length === 12 && record.long_horizon_collective_resilience_test_records.every((item) => item.test_state === "Not Tested") && record.preparedness_baseline_records?.length === 0 && record.institutional_closure_records?.length === 0 && record.resilience_receipt_id === null && noAutomaticAuthority(record)),
  "A Phase 83 resilience ledger contains a premature activation, closure, restoration, reconstruction, recovery, receipt, score, rank, or stage change.",
);
const foodProductionRecords = foodSystemsExport.records.filter((record) => record.record_kind === "food_production_land_water_sovereignty_dossier");
const localProvisioningRecords = foodSystemsExport.records.filter((record) => record.record_kind === "processing_storage_distribution_local_provisioning_ledger");
const foodAccessRecords = foodSystemsExport.records.filter((record) => record.record_kind === "food_access_affordability_nutrition_institutional_meals_register");
const resourceSecurityRecords = foodSystemsExport.records.filter((record) => record.record_kind === "reserve_contamination_circularity_community_resource_security_ledger");
check(
  foodSystemsExport.dataset === "food_systems_local_provisioning_community_resource_security" && foodSystemsExport.count === 32 &&
  foodProductionRecords.length === manifest.expected_build.phase_84_food_production_land_water_sovereignty_dossiers &&
  localProvisioningRecords.length === manifest.expected_build.phase_84_processing_storage_distribution_local_provisioning_ledgers &&
  foodAccessRecords.length === manifest.expected_build.phase_84_food_access_affordability_nutrition_institutional_meals_registers &&
  resourceSecurityRecords.length === manifest.expected_build.phase_84_reserve_contamination_circularity_community_resource_security_ledgers,
  "The Phase 84 export must preserve 8 production dossiers, 8 provisioning ledgers, 8 access registers, and 8 resource-security ledgers.",
);
check(
  foodProductionRecords.every((record) => record.production_state === "Inactive - No Verified Phase 83 Collective-Resilience Record" && record.production_decision === "Not Open" && record.production_checks?.length === 20 && record.production_checks.every((item) => item.decision_state === "Inactive") && record.food_production_system_type_records?.length === 14 && record.food_production_system_type_records.every((item) => item.production_state === "Unassessed") && record.land_access_tenure_stewardship_safeguard_records?.length === 12 && record.land_access_tenure_stewardship_safeguard_records.every((item) => item.safeguard_state === "Unverified") && record.water_energy_climate_dependency_test_records?.length === 12 && record.water_energy_climate_dependency_test_records.every((item) => item.test_state === "Not Tested") && record.verified_phase83_collective_resilience_records?.length === 0 && record.producer_inventory_records?.length === 0 && record.production_receipt_id === null && noAutomaticAuthority(record)),
  "A Phase 84 production dossier contains a premature baseline, land, water, sovereignty, capacity, receipt, score, rank, or stage change.",
);
check(
  localProvisioningRecords.every((record) => record.provisioning_state === "Inactive - No Adopted Food-Production Baseline" && record.provisioning_decision === "Not Open" && record.provisioning_checks?.length === 20 && record.provisioning_checks.every((item) => item.decision_state === "Inactive") && record.processing_storage_distribution_mode_records?.length === 14 && record.processing_storage_distribution_mode_records.every((item) => item.mode_state === "Unassessed") && record.local_procurement_community_benefit_dimension_records?.length === 12 && record.local_procurement_community_benefit_dimension_records.every((item) => item.dimension_state === "Not Measured") && record.food_workforce_logistics_safeguard_records?.length === 12 && record.food_workforce_logistics_safeguard_records.every((item) => item.safeguard_state === "Unverified") && record.processing_facility_records?.length === 0 && record.institutional_procurement_records?.length === 0 && record.provisioning_receipt_id === null && noAutomaticAuthority(record)),
  "A Phase 84 provisioning ledger contains a premature capacity, procurement, inventory, workforce, benefit, receipt, score, rank, or stage change.",
);
check(
  foodAccessRecords.every((record) => record.access_state === "Inactive - No Verified Local-Provisioning Baseline" && record.access_decision === "Not Open" && record.food_access_checks?.length === 22 && record.food_access_checks.every((item) => item.decision_state === "Inactive") && record.food_access_channel_records?.length === 14 && record.food_access_channel_records.every((item) => item.channel_state === "Unassessed") && record.affordability_nutrition_dignity_dimension_records?.length === 12 && record.affordability_nutrition_dignity_dimension_records.every((item) => item.dimension_state === "Not Measured") && record.institutional_meal_community_provisioning_safeguard_records?.length === 12 && record.institutional_meal_community_provisioning_safeguard_records.every((item) => item.safeguard_state === "Unverified") && record.food_need_records?.length === 0 && record.nutrition_records?.length === 0 && record.access_receipt_id === null && noAutomaticAuthority(record)),
  "A Phase 84 access register contains a premature food-access, affordability, nutrition, benefit, meal, remedy, receipt, score, rank, or stage change.",
);
check(
  resourceSecurityRecords.every((record) => record.security_state === "Inactive - No Verified Food-Access And Nutrition Baseline" && record.security_decision === "Not Open" && record.resource_security_checks?.length === 22 && record.resource_security_checks.every((item) => item.decision_state === "Inactive") && record.emergency_reserve_capability_records?.length === 12 && record.emergency_reserve_capability_records.every((item) => item.capability_state === "Not Tested") && record.contamination_biosecurity_safeguard_records?.length === 12 && record.contamination_biosecurity_safeguard_records.every((item) => item.safeguard_state === "Unverified") && record.food_waste_circular_flow_capability_records?.length === 12 && record.food_waste_circular_flow_capability_records.every((item) => item.capability_state === "Not Tested") && record.long_horizon_community_resource_security_test_records?.length === 12 && record.long_horizon_community_resource_security_test_records.every((item) => item.test_state === "Not Tested") && record.reserve_records?.length === 0 && record.recall_records?.length === 0 && record.security_receipt_id === null && noAutomaticAuthority(record)),
  "A Phase 84 resource-security ledger contains a premature reserve release, rationing, recall, contamination remedy, circularity or security finding, receipt, score, rank, or stage change.",
);
const housingDeliveryRecords = housingPlaceExport.records.filter((record) => record.record_kind === "housing_need_supply_delivery_habitability_dossier");
const housingTenureRecords = housingPlaceExport.records.filter((record) => record.record_kind === "tenure_affordability_public_social_community_housing_ledger");
const housingStabilityRecords = housingPlaceExport.records.filter((record) => record.record_kind === "homelessness_shelter_supportive_housing_displacement_register");
const placeStabilityRecords = housingPlaceExport.records.filter((record) => record.record_kind === "retrofit_climate_disaster_reconstruction_place_stability_ledger");
check(
  housingPlaceExport.dataset === "housing_shelter_land_use_place_stability" && housingPlaceExport.count === 32 &&
  housingDeliveryRecords.length === manifest.expected_build.phase_85_housing_need_supply_delivery_habitability_dossiers &&
  housingTenureRecords.length === manifest.expected_build.phase_85_tenure_affordability_public_social_community_housing_ledgers &&
  housingStabilityRecords.length === manifest.expected_build.phase_85_homelessness_shelter_supportive_housing_displacement_registers &&
  placeStabilityRecords.length === manifest.expected_build.phase_85_retrofit_climate_disaster_reconstruction_place_stability_ledgers,
  "The Phase 85 export must preserve 8 delivery dossiers, 8 tenure ledgers, 8 stability registers, and 8 place-stability ledgers.",
);
check(
  housingDeliveryRecords.every((record) => record.delivery_state === "Inactive - No Verified Phase 84 Community-Resource-Security Record" && record.delivery_decision === "Not Open" && record.delivery_checks?.length === 20 && record.delivery_checks.every((item) => item.decision_state === "Inactive") && record.housing_supply_delivery_type_records?.length === 14 && record.housing_supply_delivery_type_records.every((item) => item.delivery_state === "Unassessed") && record.habitability_accessibility_quality_dimension_records?.length === 12 && record.habitability_accessibility_quality_dimension_records.every((item) => item.dimension_state === "Not Measured") && record.land_use_infrastructure_delivery_safeguard_records?.length === 12 && record.land_use_infrastructure_delivery_safeguard_records.every((item) => item.safeguard_state === "Unverified") && record.verified_phase84_resource_security_records?.length === 0 && record.approval_records?.length === 0 && record.delivery_receipt_id === null && noAutomaticAuthority(record)),
  "A Phase 85 delivery dossier contains a premature approval, delivery, occupancy, habitability, accessibility, allocation, receipt, score, rank, or stage change.",
);
check(
  housingTenureRecords.every((record) => record.tenure_state === "Inactive - No Adopted Housing-Supply And Habitability Baseline" && record.tenure_decision === "Not Open" && record.tenure_checks?.length === 20 && record.tenure_checks.every((item) => item.decision_state === "Inactive") && record.housing_tenure_provider_model_records?.length === 14 && record.housing_tenure_provider_model_records.every((item) => item.model_state === "Unassessed") && record.household_housing_affordability_dimension_records?.length === 12 && record.household_housing_affordability_dimension_records.every((item) => item.dimension_state === "Not Measured") && record.public_social_community_housing_safeguard_records?.length === 12 && record.public_social_community_housing_safeguard_records.every((item) => item.safeguard_state === "Unverified") && record.affordability_records?.length === 0 && record.allocation_records?.length === 0 && record.tenure_receipt_id === null && noAutomaticAuthority(record)),
  "A Phase 85 tenure ledger contains a premature tenure, affordability, allocation, ownership, receipt, score, rank, or stage change.",
);
check(
  housingStabilityRecords.every((record) => record.stability_state === "Inactive - No Verified Tenure And Affordability Baseline" && record.stability_decision === "Not Open" && record.stability_checks?.length === 22 && record.stability_checks.every((item) => item.decision_state === "Inactive") && record.homelessness_shelter_supportive_housing_pathway_records?.length === 14 && record.homelessness_shelter_supportive_housing_pathway_records.every((item) => item.pathway_state === "Unassessed") && record.housing_stability_displacement_protection_dimension_records?.length === 12 && record.housing_stability_displacement_protection_dimension_records.every((item) => item.dimension_state === "Not Measured") && record.supportive_housing_service_dignity_safeguard_records?.length === 12 && record.supportive_housing_service_dignity_safeguard_records.every((item) => item.safeguard_state === "Unverified") && record.shelter_capacity_records?.length === 0 && record.temporary_relocation_records?.length === 0 && record.stability_receipt_id === null && noAutomaticAuthority(record)),
  "A Phase 85 stability register contains a premature shelter placement, supportive-housing outcome, stability, displacement, relocation, receipt, score, rank, or stage change.",
);
check(
  placeStabilityRecords.every((record) => record.place_state === "Inactive - No Verified Housing-Stability And Displacement Baseline" && record.place_decision === "Not Open" && record.place_checks?.length === 22 && record.place_checks.every((item) => item.decision_state === "Inactive") && record.retrofit_repair_decarbonization_capability_records?.length === 12 && record.retrofit_repair_decarbonization_capability_records.every((item) => item.capability_state === "Not Tested") && record.climate_disaster_housing_safeguard_records?.length === 12 && record.climate_disaster_housing_safeguard_records.every((item) => item.safeguard_state === "Unverified") && record.relocation_reconstruction_right_to_return_safeguard_records?.length === 12 && record.relocation_reconstruction_right_to_return_safeguard_records.every((item) => item.safeguard_state === "Unverified") && record.long_horizon_place_stability_test_records?.length === 12 && record.long_horizon_place_stability_test_records.every((item) => item.test_state === "Not Tested") && record.retrofit_records?.length === 0 && record.right_to_return_records?.length === 0 && record.place_receipt_id === null && noAutomaticAuthority(record)),
  "A Phase 85 place ledger contains a premature retrofit, relocation, return, reconstruction, recovery, receipt, score, rank, or stage change.",
);
const healthAccessRecords = healthWellbeingExport.records.filter((record) => record.record_kind === "primary_preventive_community_care_access_dossier");
const clinicalCareRecords = healthWellbeingExport.records.filter((record) => record.record_kind === "acute_emergency_specialty_behavioral_health_care_ledger");
const publicHealthRecords = healthWellbeingExport.records.filter((record) => record.record_kind === "public_health_surveillance_prevention_environmental_exposure_register");
const populationWellbeingRecords = healthWellbeingExport.records.filter((record) => record.record_kind === "disability_equity_preparedness_population_wellbeing_ledger");
check(
  healthWellbeingExport.dataset === "health_public_health_disability_population_wellbeing" && healthWellbeingExport.count === 32 &&
  healthAccessRecords.length === manifest.expected_build.phase_86_primary_preventive_community_care_access_dossiers &&
  clinicalCareRecords.length === manifest.expected_build.phase_86_acute_emergency_specialty_behavioral_health_care_ledgers &&
  publicHealthRecords.length === manifest.expected_build.phase_86_public_health_surveillance_prevention_environmental_exposure_registers &&
  populationWellbeingRecords.length === manifest.expected_build.phase_86_disability_equity_preparedness_population_wellbeing_ledgers,
  "The Phase 86 export must preserve 8 access dossiers, 8 care ledgers, 8 public-health registers, and 8 population-wellbeing ledgers.",
);
check(
  healthAccessRecords.every((record) => record.access_state === "Inactive - No Verified Phase 85 Place-Stability Record" && record.access_decision === "Not Open" && record.access_checks?.length === 20 && record.access_checks.every((item) => item.decision_state === "Inactive") && record.health_access_care_setting_records?.length === 14 && record.health_access_care_setting_records.every((item) => item.access_state === "Unassessed") && record.health_access_affordability_dimension_records?.length === 12 && record.health_access_affordability_dimension_records.every((item) => item.dimension_state === "Not Measured") && record.prevention_primary_care_safeguard_records?.length === 12 && record.prevention_primary_care_safeguard_records.every((item) => item.safeguard_state === "Unverified") && record.verified_phase85_place_stability_records?.length === 0 && record.eligibility_records?.length === 0 && record.access_receipt_id === null && noAutomaticAuthority(record)),
  "A Phase 86 access dossier contains a premature eligibility, coverage, access, prevention, affordability, remedy, receipt, score, rank, or stage change.",
);
check(
  clinicalCareRecords.every((record) => record.care_state === "Inactive - No Adopted Health-Access And Prevention Baseline" && record.care_decision === "Not Open" && record.care_checks?.length === 20 && record.care_checks.every((item) => item.decision_state === "Inactive") && record.acute_specialty_service_class_records?.length === 14 && record.acute_specialty_service_class_records.every((item) => item.service_state === "Unassessed") && record.clinical_quality_safety_dimension_records?.length === 12 && record.clinical_quality_safety_dimension_records.every((item) => item.dimension_state === "Not Measured") && record.health_workforce_continuity_safeguard_records?.length === 12 && record.health_workforce_continuity_safeguard_records.every((item) => item.safeguard_state === "Unverified") && record.capacity_records?.length === 0 && record.adverse_event_records?.length === 0 && record.care_receipt_id === null && noAutomaticAuthority(record)),
  "A Phase 86 care ledger contains a premature diagnosis, triage, treatment, capacity, quality, safety, continuity, receipt, score, rank, or stage change.",
);
check(
  publicHealthRecords.every((record) => record.public_health_state === "Inactive - No Verified Clinical-Capacity And Continuity Baseline" && record.public_health_decision === "Not Open" && record.public_health_checks?.length === 22 && record.public_health_checks.every((item) => item.decision_state === "Inactive") && record.public_health_function_records?.length === 14 && record.public_health_function_records.every((item) => item.function_state === "Unassessed") && record.surveillance_governance_safeguard_records?.length === 12 && record.surveillance_governance_safeguard_records.every((item) => item.safeguard_state === "Unverified") && record.environmental_occupational_exposure_dimension_records?.length === 12 && record.environmental_occupational_exposure_dimension_records.every((item) => item.dimension_state === "Not Measured") && record.diagnosis_records?.length === 0 && record.isolation_records?.length === 0 && record.public_health_receipt_id === null && noAutomaticAuthority(record)),
  "A Phase 86 public-health register contains a premature diagnosis, surveillance, exposure, restriction, emergency authorization, remediation, receipt, score, rank, or stage change.",
);
check(
  populationWellbeingRecords.every((record) => record.wellbeing_state === "Inactive - No Verified Public-Health And Exposure Baseline" && record.wellbeing_decision === "Not Open" && record.wellbeing_checks?.length === 22 && record.wellbeing_checks.every((item) => item.decision_state === "Inactive") && record.disability_rights_support_dimension_records?.length === 12 && record.disability_rights_support_dimension_records.every((item) => item.dimension_state === "Unassessed") && record.emergency_preparedness_capability_records?.length === 12 && record.emergency_preparedness_capability_records.every((item) => item.capability_state === "Not Tested") && record.population_wellbeing_equity_dimension_records?.length === 12 && record.population_wellbeing_equity_dimension_records.every((item) => item.dimension_state === "Not Measured") && record.long_horizon_population_health_test_records?.length === 12 && record.long_horizon_population_health_test_records.every((item) => item.test_state === "Not Tested") && record.disability_rights_records?.length === 0 && record.independent_audit_records?.length === 0 && record.wellbeing_receipt_id === null && noAutomaticAuthority(record)),
  "A Phase 86 wellbeing ledger contains a premature disability classification, equity, preparedness, recovery, wellbeing, remedy, receipt, score, rank, or stage change.",
);
const schoolAccessRecords = educationKnowledgeCultureExport.records.filter((record) => record.record_kind === "early_childhood_school_access_inclusion_learning_dossier");
const postsecondaryPathwayRecords = educationKnowledgeCultureExport.records.filter((record) => record.record_kind === "postsecondary_vocational_apprenticeship_affordability_ledger");
const learningCapabilityRecords = educationKnowledgeCultureExport.records.filter((record) => record.record_kind === "learning_capability_credential_skills_transition_register");
const publicKnowledgeCultureRecords = educationKnowledgeCultureExport.records.filter((record) => record.record_kind === "public_knowledge_culture_research_community_learning_ledger");
check(
  educationKnowledgeCultureExport.dataset === "education_learning_skills_knowledge_cultural_capability" && educationKnowledgeCultureExport.count === 32 &&
  schoolAccessRecords.length === manifest.expected_build.phase_87_early_childhood_school_access_inclusion_learning_dossiers &&
  postsecondaryPathwayRecords.length === manifest.expected_build.phase_87_postsecondary_vocational_apprenticeship_affordability_ledgers &&
  learningCapabilityRecords.length === manifest.expected_build.phase_87_learning_capability_credential_skills_transition_registers &&
  publicKnowledgeCultureRecords.length === manifest.expected_build.phase_87_public_knowledge_culture_research_community_learning_ledgers,
  "The Phase 87 export must preserve 8 school dossiers, 8 postsecondary ledgers, 8 capability registers, and 8 public-knowledge ledgers.",
);
check(schoolAccessRecords.every((record) => record.school_state === "Inactive - No Verified Phase 86 Population-Wellbeing Record" && record.school_decision === "Not Open" && record.school_checks?.length === 20 && record.school_checks.every((item) => item.decision_state === "Inactive") && record.education_access_setting_records?.length === 14 && record.education_access_setting_records.every((item) => item.setting_state === "Unassessed") && record.education_inclusion_support_dimension_records?.length === 12 && record.education_inclusion_support_dimension_records.every((item) => item.dimension_state === "Not Measured") && record.learning_condition_safeguard_records?.length === 12 && record.learning_condition_safeguard_records.every((item) => item.safeguard_state === "Unverified") && record.enrollment_records?.length === 0 && record.learning_records?.length === 0 && record.school_receipt_id === null && noAutomaticAuthority(record)), "A Phase 87 school dossier contains a premature enrollment, inclusion, learning, receipt, score, rank, or stage change.");
check(postsecondaryPathwayRecords.every((record) => record.postsecondary_state === "Inactive - No Adopted School-Access And Learning Baseline" && record.postsecondary_decision === "Not Open" && record.postsecondary_checks?.length === 20 && record.postsecondary_checks.every((item) => item.decision_state === "Inactive") && record.postsecondary_learning_pathway_records?.length === 14 && record.postsecondary_learning_pathway_records.every((item) => item.pathway_state === "Unassessed") && record.postsecondary_affordability_support_dimension_records?.length === 12 && record.postsecondary_affordability_support_dimension_records.every((item) => item.dimension_state === "Not Measured") && record.education_workforce_institution_continuity_safeguard_records?.length === 12 && record.education_workforce_institution_continuity_safeguard_records.every((item) => item.safeguard_state === "Unverified") && record.admission_records?.length === 0 && record.credential_records?.length === 0 && record.postsecondary_receipt_id === null && noAutomaticAuthority(record)), "A Phase 87 postsecondary ledger contains a premature admission, affordability, credential, job-pathway, receipt, score, rank, or stage change.");
check(learningCapabilityRecords.every((record) => record.capability_state === "Inactive - No Verified Postsecondary And Apprenticeship Baseline" && record.capability_decision === "Not Open" && record.capability_checks?.length === 22 && record.capability_checks.every((item) => item.decision_state === "Inactive") && record.learning_capability_domain_records?.length === 14 && record.learning_capability_domain_records.every((item) => item.domain_state === "Unassessed") && record.assessment_credential_safeguard_records?.length === 12 && record.assessment_credential_safeguard_records.every((item) => item.safeguard_state === "Unverified") && record.skills_work_civic_transition_dimension_records?.length === 12 && record.skills_work_civic_transition_dimension_records.every((item) => item.dimension_state === "Not Measured") && record.assessment_records?.length === 0 && record.transition_records?.length === 0 && record.capability_receipt_id === null && noAutomaticAuthority(record)), "A Phase 87 capability register contains a premature assessment, credential, capability, transition, receipt, score, rank, or stage change.");
check(publicKnowledgeCultureRecords.every((record) => record.knowledge_state === "Inactive - No Verified Learning-Capability And Transition Baseline" && record.knowledge_decision === "Not Open" && record.knowledge_checks?.length === 22 && record.knowledge_checks.every((item) => item.decision_state === "Inactive") && record.public_knowledge_institution_records?.length === 12 && record.public_knowledge_institution_records.every((item) => item.institution_state === "Unassessed") && record.research_public_knowledge_safeguard_records?.length === 12 && record.research_public_knowledge_safeguard_records.every((item) => item.safeguard_state === "Unverified") && record.cultural_capability_dimension_records?.length === 12 && record.cultural_capability_dimension_records.every((item) => item.dimension_state === "Not Measured") && record.long_horizon_human_development_test_records?.length === 12 && record.long_horizon_human_development_test_records.every((item) => item.test_state === "Not Tested") && record.research_records?.length === 0 && record.learning_recovery_records?.length === 0 && record.cultural_recovery_records?.length === 0 && record.knowledge_receipt_id === null && noAutomaticAuthority(record)), "A Phase 87 public-knowledge ledger contains a premature research, knowledge, cultural-recovery, receipt, score, rank, or stage change.");
const jobAccessRecords = workLaborLivelihoodsExport.records.filter((record) => record.record_kind === "job_access_matching_hiring_nondiscrimination_dossier");
const jobQualityRecords = workLaborLivelihoodsExport.records.filter((record) => record.record_kind === "job_quality_wages_benefits_hours_safety_ledger");
const workerVoiceRecords = workLaborLivelihoodsExport.records.filter((record) => record.record_kind === "worker_voice_organizing_collective_bargaining_economic_democracy_register");
const livelihoodSecurityRecords = workLaborLivelihoodsExport.records.filter((record) => record.record_kind === "livelihood_security_displacement_just_transition_long_horizon_ledger");
check(
  workLaborLivelihoodsExport.dataset === "work_labor_livelihoods_economic_democracy" && workLaborLivelihoodsExport.count === 32 &&
  jobAccessRecords.length === manifest.expected_build.phase_88_job_access_matching_hiring_nondiscrimination_dossiers &&
  jobQualityRecords.length === manifest.expected_build.phase_88_job_quality_wages_benefits_hours_safety_ledgers &&
  workerVoiceRecords.length === manifest.expected_build.phase_88_worker_voice_organizing_collective_bargaining_economic_democracy_registers &&
  livelihoodSecurityRecords.length === manifest.expected_build.phase_88_livelihood_security_displacement_just_transition_long_horizon_ledgers,
  "The Phase 88 export must preserve 8 job-access dossiers, 8 job-quality ledgers, 8 worker-voice registers, and 8 livelihood ledgers.",
);
check(jobAccessRecords.every((record) => record.job_access_state === "Inactive - No Verified Phase 87 Human-Development Record" && record.job_access_decision === "Not Open" && record.job_access_checks?.length === 20 && record.job_access_checks.every((item) => item.decision_state === "Inactive") && record.labor_market_access_channel_records?.length === 14 && record.labor_market_access_channel_records.every((item) => item.channel_state === "Unassessed") && record.hiring_access_equity_dimension_records?.length === 12 && record.hiring_access_equity_dimension_records.every((item) => item.dimension_state === "Not Measured") && record.job_matching_recruitment_safeguard_records?.length === 12 && record.job_matching_recruitment_safeguard_records.every((item) => item.safeguard_state === "Unverified") && record.vacancy_records?.length === 0 && record.selection_records?.length === 0 && record.job_access_receipt_id === null && noAutomaticAuthority(record)), "A Phase 88 job-access dossier contains a premature job, hiring, nondiscrimination, receipt, score, rank, or stage change.");
check(jobQualityRecords.every((record) => record.job_quality_state === "Inactive - No Adopted Job-Access And Hiring Baseline" && record.job_quality_decision === "Not Open" && record.job_quality_checks?.length === 20 && record.job_quality_checks.every((item) => item.decision_state === "Inactive") && record.employment_arrangement_class_records?.length === 14 && record.employment_arrangement_class_records.every((item) => item.arrangement_state === "Unassessed") && record.job_quality_compensation_dimension_records?.length === 12 && record.job_quality_compensation_dimension_records.every((item) => item.dimension_state === "Not Measured") && record.workplace_health_safety_continuity_safeguard_records?.length === 12 && record.workplace_health_safety_continuity_safeguard_records.every((item) => item.safeguard_state === "Unverified") && record.classification_records?.length === 0 && record.safety_records?.length === 0 && record.job_quality_receipt_id === null && noAutomaticAuthority(record)), "A Phase 88 job-quality ledger contains a premature classification, pay, hours, safety, dignity, receipt, score, rank, or stage change.");
check(workerVoiceRecords.every((record) => record.worker_voice_state === "Inactive - No Verified Job-Quality And Safety Baseline" && record.worker_voice_decision === "Not Open" && record.worker_voice_checks?.length === 22 && record.worker_voice_checks.every((item) => item.decision_state === "Inactive") && record.worker_voice_representation_model_records?.length === 14 && record.worker_voice_representation_model_records.every((item) => item.model_state === "Unassessed") && record.organizing_collective_bargaining_safeguard_records?.length === 12 && record.organizing_collective_bargaining_safeguard_records.every((item) => item.safeguard_state === "Unverified") && record.economic_democracy_ownership_dimension_records?.length === 12 && record.economic_democracy_ownership_dimension_records.every((item) => item.dimension_state === "Not Measured") && record.union_records?.length === 0 && record.bargaining_records?.length === 0 && record.worker_voice_receipt_id === null && noAutomaticAuthority(record)), "A Phase 88 worker-voice register contains a premature union, bargaining, ownership, economic-democracy, receipt, score, rank, or stage change.");
check(livelihoodSecurityRecords.every((record) => record.livelihood_state === "Inactive - No Verified Worker-Voice And Economic-Democracy Baseline" && record.livelihood_decision === "Not Open" && record.livelihood_checks?.length === 22 && record.livelihood_checks.every((item) => item.decision_state === "Inactive") && record.livelihood_security_support_system_records?.length === 12 && record.livelihood_security_support_system_records.every((item) => item.system_state === "Unassessed") && record.displacement_transition_safeguard_records?.length === 12 && record.displacement_transition_safeguard_records.every((item) => item.safeguard_state === "Unverified") && record.regional_labor_market_equity_dimension_records?.length === 12 && record.regional_labor_market_equity_dimension_records.every((item) => item.dimension_state === "Not Measured") && record.long_horizon_economic_agency_test_records?.length === 12 && record.long_horizon_economic_agency_test_records.every((item) => item.test_state === "Not Tested") && record.income_records?.length === 0 && record.just_transition_records?.length === 0 && record.livelihood_receipt_id === null && noAutomaticAuthority(record)), "A Phase 88 livelihood ledger contains a premature livelihood, displacement, transition, receipt, score, rank, or stage change.");
const householdIncomeRecords = incomeWealthSecurityExport.records.filter((record) => record.record_kind === "household_income_earnings_tax_transfer_resource_dossier");
const wealthBalanceRecords = incomeWealthSecurityExport.records.filter((record) => record.record_kind === "wealth_assets_debt_liabilities_intergenerational_balance_ledger");
const socialProtectionRecords = incomeWealthSecurityExport.records.filter((record) => record.record_kind === "poverty_deprivation_social_protection_benefit_access_register");
const economicSecurityRecords = incomeWealthSecurityExport.records.filter((record) => record.record_kind === "economic_security_distribution_shock_mobility_long_horizon_ledger");
check(incomeWealthSecurityExport.dataset === "income_wealth_poverty_social_protection_economic_security" && incomeWealthSecurityExport.count === 32 && householdIncomeRecords.length === manifest.expected_build.phase_89_household_income_earnings_tax_transfer_resource_dossiers && wealthBalanceRecords.length === manifest.expected_build.phase_89_wealth_assets_debt_liabilities_intergenerational_balance_ledgers && socialProtectionRecords.length === manifest.expected_build.phase_89_poverty_deprivation_social_protection_benefit_access_registers && economicSecurityRecords.length === manifest.expected_build.phase_89_economic_security_distribution_shock_mobility_long_horizon_ledgers, "The Phase 89 export must preserve 8 income dossiers, 8 wealth ledgers, 8 protection registers, and 8 economic-security ledgers.");
check(householdIncomeRecords.every((record) => record.income_state === "Inactive - No Verified Phase 88 Livelihood-Security Record" && record.income_decision === "Not Open" && record.income_checks?.length === 20 && record.income_checks.every((item) => item.decision_state === "Inactive") && record.income_source_class_records?.length === 14 && record.income_source_class_records.every((item) => item.source_state === "Unassessed") && record.household_resource_adequacy_dimension_records?.length === 12 && record.household_resource_adequacy_dimension_records.every((item) => item.dimension_state === "Not Measured") && record.tax_transfer_administration_safeguard_records?.length === 12 && record.tax_transfer_administration_safeguard_records.every((item) => item.safeguard_state === "Unverified") && record.household_records?.length === 0 && record.income_receipt_id === null && noAutomaticAuthority(record)), "A Phase 89 income dossier contains a premature income, tax, transfer, household, receipt, score, rank, or stage change.");
check(wealthBalanceRecords.every((record) => record.wealth_state === "Inactive - No Adopted Household-Income And Resource Baseline" && record.wealth_decision === "Not Open" && record.wealth_checks?.length === 20 && record.wealth_checks.every((item) => item.decision_state === "Inactive") && record.wealth_asset_liability_class_records?.length === 14 && record.wealth_asset_liability_class_records.every((item) => item.class_state === "Unassessed") && record.wealth_security_distribution_dimension_records?.length === 12 && record.wealth_security_distribution_dimension_records.every((item) => item.dimension_state === "Not Measured") && record.debt_insolvency_inheritance_safeguard_records?.length === 12 && record.debt_insolvency_inheritance_safeguard_records.every((item) => item.safeguard_state === "Unverified") && record.owner_records?.length === 0 && record.valuation_records?.length === 0 && record.wealth_receipt_id === null && noAutomaticAuthority(record)), "A Phase 89 wealth ledger contains a premature ownership, valuation, debt, wealth, receipt, score, rank, or stage change.");
check(socialProtectionRecords.every((record) => record.protection_state === "Inactive - No Verified Wealth And Balance-Sheet Baseline" && record.protection_decision === "Not Open" && record.protection_checks?.length === 22 && record.protection_checks.every((item) => item.decision_state === "Inactive") && record.poverty_material_deprivation_dimension_records?.length === 14 && record.poverty_material_deprivation_dimension_records.every((item) => item.dimension_state === "Unassessed") && record.social_protection_system_records?.length === 12 && record.social_protection_system_records.every((item) => item.system_state === "Unassessed") && record.benefit_access_rights_administration_safeguard_records?.length === 12 && record.benefit_access_rights_administration_safeguard_records.every((item) => item.safeguard_state === "Unverified") && record.application_records?.length === 0 && record.protection_receipt_id === null && noAutomaticAuthority(record)), "A Phase 89 protection register contains a premature poverty, eligibility, denial, sanction, benefit, receipt, score, rank, or stage change.");
check(economicSecurityRecords.every((record) => record.security_state === "Inactive - No Verified Social-Protection And Benefit-Access Baseline" && record.security_decision === "Not Open" && record.security_checks?.length === 22 && record.security_checks.every((item) => item.decision_state === "Inactive") && record.economic_security_shock_response_system_records?.length === 12 && record.economic_security_shock_response_system_records.every((item) => item.system_state === "Unassessed") && record.shared_prosperity_distribution_dimension_records?.length === 12 && record.shared_prosperity_distribution_dimension_records.every((item) => item.dimension_state === "Not Measured") && record.intergenerational_mobility_security_safeguard_records?.length === 12 && record.intergenerational_mobility_security_safeguard_records.every((item) => item.safeguard_state === "Unverified") && record.long_horizon_economic_security_test_records?.length === 12 && record.long_horizon_economic_security_test_records.every((item) => item.test_state === "Not Tested") && record.inflation_records?.length === 0 && record.mobility_records?.length === 0 && record.security_receipt_id === null && noAutomaticAuthority(record)), "A Phase 89 security ledger contains a premature distribution, mobility, shared-prosperity, security, receipt, score, rank, or stage change.");
const firmGovernanceRecords = marketsFirmsGovernanceExport.records.filter((record) => record.record_kind === "firm_formation_ownership_control_governance_dossier");
const marketCompetitionRecords = marketsFirmsGovernanceExport.records.filter((record) => record.record_kind === "market_structure_competition_pricing_conduct_ledger");
const corporatePowerRecords = marketsFirmsGovernanceExport.records.filter((record) => record.record_kind === "corporate_power_platform_supply_chain_public_support_register");
const democraticGovernanceRecords = marketsFirmsGovernanceExport.records.filter((record) => record.record_kind === "democratic_economic_governance_rights_remedy_long_horizon_ledger");
check(marketsFirmsGovernanceExport.dataset === "markets_firms_competition_corporate_power_democratic_economic_governance" && marketsFirmsGovernanceExport.count === 32 && firmGovernanceRecords.length === manifest.expected_build.phase_90_firm_formation_ownership_control_governance_dossiers && marketCompetitionRecords.length === manifest.expected_build.phase_90_market_structure_competition_pricing_conduct_ledgers && corporatePowerRecords.length === manifest.expected_build.phase_90_corporate_power_platform_supply_chain_public_support_registers && democraticGovernanceRecords.length === manifest.expected_build.phase_90_democratic_economic_governance_rights_remedy_long_horizon_ledgers, "The Phase 90 export must preserve 8 firm dossiers, 8 market ledgers, 8 corporate-power registers, and 8 governance ledgers.");
check(firmGovernanceRecords.every((record) => record.firm_state === "Inactive - No Verified Phase 89 Economic-Security Record" && record.firm_decision === "Not Open" && record.firm_checks?.length === 20 && record.firm_checks.every((item) => item.decision_state === "Inactive") && record.enterprise_legal_ownership_form_records?.length === 14 && record.enterprise_legal_ownership_form_records.every((item) => item.form_state === "Unassessed") && record.firm_governance_accountability_dimension_records?.length === 12 && record.firm_governance_accountability_dimension_records.every((item) => item.dimension_state === "Not Measured") && record.firm_lifecycle_exit_safeguard_records?.length === 12 && record.firm_lifecycle_exit_safeguard_records.every((item) => item.safeguard_state === "Unverified") && record.entity_records?.length === 0 && record.firm_receipt_id === null && noAutomaticAuthority(record)), "A Phase 90 firm dossier contains a premature firm, ownership, control, governance, receipt, score, rank, or stage change.");
check(marketCompetitionRecords.every((record) => record.market_state === "Inactive - No Adopted Firm-Identity Ownership And Governance Baseline" && record.market_decision === "Not Open" && record.market_checks?.length === 20 && record.market_checks.every((item) => item.decision_state === "Inactive") && record.market_transaction_structure_class_records?.length === 14 && record.market_transaction_structure_class_records.every((item) => item.class_state === "Unassessed") && record.competition_market_power_dimension_records?.length === 12 && record.competition_market_power_dimension_records.every((item) => item.dimension_state === "Not Measured") && record.price_quality_access_conduct_safeguard_records?.length === 12 && record.price_quality_access_conduct_safeguard_records.every((item) => item.safeguard_state === "Unverified") && record.market_definition_records?.length === 0 && record.market_receipt_id === null && noAutomaticAuthority(record)), "A Phase 90 market ledger contains a premature market, competition, price, conduct, merger, receipt, score, rank, or stage change.");
check(corporatePowerRecords.every((record) => record.power_state === "Inactive - No Verified Market-Structure Competition And Conduct Baseline" && record.power_decision === "Not Open" && record.power_checks?.length === 22 && record.power_checks.every((item) => item.decision_state === "Inactive") && record.corporate_power_influence_channel_records?.length === 14 && record.corporate_power_influence_channel_records.every((item) => item.channel_state === "Unassessed") && record.platform_supply_chain_finance_public_support_dimension_records?.length === 12 && record.platform_supply_chain_finance_public_support_dimension_records.every((item) => item.dimension_state === "Not Measured") && record.corporate_disclosure_beneficial_ownership_accountability_safeguard_records?.length === 12 && record.corporate_disclosure_beneficial_ownership_accountability_safeguard_records.every((item) => item.safeguard_state === "Unverified") && record.corporate_group_records?.length === 0 && record.power_receipt_id === null && noAutomaticAuthority(record)), "A Phase 90 corporate-power register contains a premature power, platform, supply-chain, public-support, receipt, score, rank, or stage change.");
check(democraticGovernanceRecords.every((record) => record.governance_state === "Inactive - No Verified Corporate-Power And Public-Accountability Baseline" && record.governance_decision === "Not Open" && record.governance_checks?.length === 22 && record.governance_checks.every((item) => item.decision_state === "Inactive") && record.democratic_economic_governance_institution_records?.length === 12 && record.democratic_economic_governance_institution_records.every((item) => item.institution_state === "Unassessed") && record.affected_constituency_public_value_dimension_records?.length === 12 && record.affected_constituency_public_value_dimension_records.every((item) => item.dimension_state === "Not Measured") && record.intervention_remedy_due_process_safeguard_records?.length === 12 && record.intervention_remedy_due_process_safeguard_records.every((item) => item.safeguard_state === "Unverified") && record.long_horizon_market_ecosystem_test_records?.length === 12 && record.long_horizon_market_ecosystem_test_records.every((item) => item.test_state === "Not Tested") && record.authority_records?.length === 0 && record.governance_receipt_id === null && noAutomaticAuthority(record)), "A Phase 90 governance ledger contains a premature public-interest, remedy, penalty, public-value, receipt, score, rank, or stage change.");
const moneyBankingRecords = financeBankingCreditStabilityExport.records.filter((record) => record.record_kind === "money_payments_banking_access_settlement_dossier");
const creditAllocationRecords = financeBankingCreditStabilityExport.records.filter((record) => record.record_kind === "credit_underwriting_affordability_servicing_productive_allocation_ledger");
const capitalInsuranceRecords = financeBankingCreditStabilityExport.records.filter((record) => record.record_kind === "capital_markets_institutional_investment_insurance_risk_transfer_register");
const financialStabilityRecords = financeBankingCreditStabilityExport.records.filter((record) => record.record_kind === "monetary_policy_systemic_risk_resolution_public_guarantee_democratic_finance_ledger");
check(financeBankingCreditStabilityExport.dataset === "finance_banking_credit_capital_allocation_monetary_systems_financial_stability" && financeBankingCreditStabilityExport.count === 32 && moneyBankingRecords.length === manifest.expected_build.phase_91_money_payments_banking_access_settlement_dossiers && creditAllocationRecords.length === manifest.expected_build.phase_91_credit_underwriting_affordability_servicing_productive_allocation_ledgers && capitalInsuranceRecords.length === manifest.expected_build.phase_91_capital_markets_institutional_investment_insurance_risk_transfer_registers && financialStabilityRecords.length === manifest.expected_build.phase_91_monetary_policy_systemic_risk_resolution_public_guarantee_democratic_finance_ledgers, "The Phase 91 export must preserve 8 money dossiers, 8 credit ledgers, 8 capital registers, and 8 stability ledgers.");
check(moneyBankingRecords.every((record) => record.money_state === "Inactive - No Verified Phase 90 Democratic-Economic-Governance Record" && record.money_decision === "Not Open" && record.money_checks?.length === 20 && record.money_checks.every((item) => item.decision_state === "Inactive") && record.money_payment_monetary_form_records?.length === 14 && record.money_payment_monetary_form_records.every((item) => item.form_state === "Unassessed") && record.banking_access_operational_dimension_records?.length === 12 && record.banking_access_operational_dimension_records.every((item) => item.dimension_state === "Not Measured") && record.custody_settlement_data_safeguard_records?.length === 12 && record.custody_settlement_data_safeguard_records.every((item) => item.safeguard_state === "Unverified") && record.account_records?.length === 0 && record.money_receipt_id === null && noAutomaticAuthority(record)), "A Phase 91 money dossier contains a premature monetary, account, banking-access, payment, settlement, receipt, score, rank, or stage change.");
check(creditAllocationRecords.every((record) => record.credit_state === "Inactive - No Adopted Money Payments Banking And Settlement Baseline" && record.credit_decision === "Not Open" && record.credit_checks?.length === 20 && record.credit_checks.every((item) => item.decision_state === "Inactive") && record.credit_instrument_borrower_class_records?.length === 14 && record.credit_instrument_borrower_class_records.every((item) => item.class_state === "Unassessed") && record.credit_underwriting_servicing_dimension_records?.length === 12 && record.credit_underwriting_servicing_dimension_records.every((item) => item.dimension_state === "Not Measured") && record.credit_affordability_fairness_safeguard_records?.length === 12 && record.credit_affordability_fairness_safeguard_records.every((item) => item.safeguard_state === "Unverified") && record.application_records?.length === 0 && record.credit_receipt_id === null && noAutomaticAuthority(record)), "A Phase 91 credit ledger contains a premature eligibility, underwriting, pricing, servicing, collection, allocation, receipt, score, rank, or stage change.");
check(capitalInsuranceRecords.every((record) => record.capital_state === "Inactive - No Verified Credit Underwriting Affordability And Allocation Baseline" && record.capital_decision === "Not Open" && record.capital_checks?.length === 22 && record.capital_checks.every((item) => item.decision_state === "Inactive") && record.capital_market_institution_class_records?.length === 14 && record.capital_market_institution_class_records.every((item) => item.class_state === "Unassessed") && record.allocation_valuation_liquidity_dimension_records?.length === 12 && record.allocation_valuation_liquidity_dimension_records.every((item) => item.dimension_state === "Not Measured") && record.fiduciary_insurance_risk_transfer_safeguard_records?.length === 12 && record.fiduciary_insurance_risk_transfer_safeguard_records.every((item) => item.safeguard_state === "Unverified") && record.valuation_records?.length === 0 && record.insurance_records?.length === 0 && record.capital_receipt_id === null && noAutomaticAuthority(record)), "A Phase 91 capital register contains a premature allocation, valuation, investment, insurance, risk-transfer, receipt, score, rank, or stage change.");
check(financialStabilityRecords.every((record) => record.stability_state === "Inactive - No Verified Capital-Market Insurance And Risk-Transfer Baseline" && record.stability_decision === "Not Open" && record.stability_checks?.length === 22 && record.stability_checks.every((item) => item.decision_state === "Inactive") && record.monetary_stability_institution_records?.length === 12 && record.monetary_stability_institution_records.every((item) => item.institution_state === "Unassessed") && record.transmission_systemic_risk_dimension_records?.length === 12 && record.transmission_systemic_risk_dimension_records.every((item) => item.dimension_state === "Not Measured") && record.intervention_resolution_due_process_safeguard_records?.length === 12 && record.intervention_resolution_due_process_safeguard_records.every((item) => item.safeguard_state === "Unverified") && record.long_horizon_financial_system_test_records?.length === 12 && record.long_horizon_financial_system_test_records.every((item) => item.test_state === "Not Tested") && record.authority_records?.length === 0 && record.guarantee_records?.length === 0 && record.resolution_records?.length === 0 && record.stability_receipt_id === null && noAutomaticAuthority(record)), "A Phase 91 stability ledger contains a premature monetary-policy, systemic-risk, guarantee, resolution, loss-allocation, receipt, score, rank, or stage change.");
const publicRevenueRecords = fiscalRevenueDebtMacroExport.records.filter((record) => record.record_kind === "public_revenue_tax_expenditure_distribution_compliance_dossier");
const budgetDeliveryRecords = fiscalRevenueDebtMacroExport.records.filter((record) => record.record_kind === "budget_expenditure_stabilizer_delivery_public_value_ledger");
const sovereignDebtRecords = fiscalRevenueDebtMacroExport.records.filter((record) => record.record_kind === "sovereign_debt_fiscal_rule_public_balance_sheet_resilience_register");
const tradeMacroRecords = fiscalRevenueDebtMacroExport.records.filter((record) => record.record_kind === "trade_external_balance_supply_resilience_macroeconomic_coordination_ledger");
check(fiscalRevenueDebtMacroExport.dataset === "fiscal_policy_public_revenue_sovereign_debt_trade_external_balance_macroeconomic_coordination" && fiscalRevenueDebtMacroExport.count === 32 && publicRevenueRecords.length === manifest.expected_build.phase_92_public_revenue_tax_expenditure_distribution_compliance_dossiers && budgetDeliveryRecords.length === manifest.expected_build.phase_92_budget_expenditure_stabilizer_delivery_public_value_ledgers && sovereignDebtRecords.length === manifest.expected_build.phase_92_sovereign_debt_fiscal_rule_public_balance_sheet_resilience_registers && tradeMacroRecords.length === manifest.expected_build.phase_92_trade_external_balance_supply_resilience_macroeconomic_coordination_ledgers, "The Phase 92 export must preserve 8 revenue dossiers, 8 budget ledgers, 8 debt registers, and 8 macro ledgers.");
check(publicRevenueRecords.every((record) => record.revenue_state === "Inactive - No Verified Phase 91 Democratic-Finance Record" && record.revenue_decision === "Not Open" && record.revenue_checks?.length === 20 && record.revenue_checks.every((item) => item.decision_state === "Inactive") && record.public_revenue_tax_instrument_class_records?.length === 14 && record.public_revenue_tax_instrument_class_records.every((item) => item.class_state === "Unassessed") && record.revenue_incidence_compliance_administration_dimension_records?.length === 12 && record.revenue_incidence_compliance_administration_dimension_records.every((item) => item.dimension_state === "Not Measured") && record.taxpayer_rights_transparency_distribution_safeguard_records?.length === 12 && record.taxpayer_rights_transparency_distribution_safeguard_records.every((item) => item.safeguard_state === "Unverified") && record.taxpayer_records?.length === 0 && record.revenue_receipt_id === null && noAutomaticAuthority(record)), "A Phase 92 revenue dossier contains a premature tax, revenue, incidence, compliance, distribution, receipt, score, rank, or stage change.");
check(budgetDeliveryRecords.every((record) => record.budget_state === "Inactive - No Adopted Public-Revenue Distribution And Compliance Baseline" && record.budget_decision === "Not Open" && record.budget_checks?.length === 20 && record.budget_checks.every((item) => item.decision_state === "Inactive") && record.budget_expenditure_delivery_class_records?.length === 14 && record.budget_expenditure_delivery_class_records.every((item) => item.class_state === "Unassessed") && record.budget_stabilizer_delivery_dimension_records?.length === 12 && record.budget_stabilizer_delivery_dimension_records.every((item) => item.dimension_state === "Not Measured") && record.budget_public_value_safeguard_records?.length === 12 && record.budget_public_value_safeguard_records.every((item) => item.safeguard_state === "Unverified") && record.appropriation_records?.length === 0 && record.delivery_records?.length === 0 && record.budget_receipt_id === null && noAutomaticAuthority(record)), "A Phase 92 budget ledger contains a premature budget, allocation, procurement, delivery, public-value, receipt, score, rank, or stage change.");
check(sovereignDebtRecords.every((record) => record.debt_state === "Inactive - No Verified Budget Delivery Stabilizer And Public-Value Baseline" && record.debt_decision === "Not Open" && record.debt_checks?.length === 22 && record.debt_checks.every((item) => item.decision_state === "Inactive") && record.sovereign_obligation_financing_class_records?.length === 14 && record.sovereign_obligation_financing_class_records.every((item) => item.class_state === "Unassessed") && record.debt_fiscal_rule_balance_sheet_dimension_records?.length === 12 && record.debt_fiscal_rule_balance_sheet_dimension_records.every((item) => item.dimension_state === "Not Measured") && record.debt_resilience_restructuring_intergenerational_safeguard_records?.length === 12 && record.debt_resilience_restructuring_intergenerational_safeguard_records.every((item) => item.safeguard_state === "Unverified") && record.instrument_records?.length === 0 && record.restructuring_records?.length === 0 && record.debt_receipt_id === null && noAutomaticAuthority(record)), "A Phase 92 debt register contains a premature borrowing, sustainability, fiscal-rule, restructuring, receipt, score, rank, or stage change.");
check(tradeMacroRecords.every((record) => record.macro_state === "Inactive - No Verified Sovereign-Debt Fiscal-Rule And Public-Balance-Sheet Baseline" && record.macro_decision === "Not Open" && record.macro_checks?.length === 24 && record.macro_checks.every((item) => item.decision_state === "Inactive") && record.trade_external_account_instrument_class_records?.length === 14 && record.trade_external_account_instrument_class_records.every((item) => item.class_state === "Unassessed") && record.trade_supply_external_balance_macro_dimension_records?.length === 12 && record.trade_supply_external_balance_macro_dimension_records.every((item) => item.dimension_state === "Not Measured") && record.trade_adjustment_distribution_due_process_safeguard_records?.length === 12 && record.trade_adjustment_distribution_due_process_safeguard_records.every((item) => item.safeguard_state === "Unverified") && record.long_horizon_macroeconomic_capacity_test_records?.length === 12 && record.long_horizon_macroeconomic_capacity_test_records.every((item) => item.test_state === "Not Tested") && record.trade_flow_records?.length === 0 && record.treaty_records?.length === 0 && record.macro_receipt_id === null && noAutomaticAuthority(record)), "A Phase 92 macro ledger contains a premature trade, treaty, external-balance, supply-resilience, macro-policy, receipt, score, rank, or stage change.");
const economicDevelopmentStrategyRecords = economicDevelopmentTransformationExport.records.filter((record) => record.record_kind === "economic_development_mission_sector_strategy_production_ecosystem_dossier");
const innovationSystemRecords = economicDevelopmentTransformationExport.records.filter((record) => record.record_kind === "innovation_research_diffusion_commercialization_standards_ledger");
const regionalConvergenceRecords = economicDevelopmentTransformationExport.records.filter((record) => record.record_kind === "regional_cluster_corridor_supplier_workforce_convergence_register");
const productiveTransformationRecords = economicDevelopmentTransformationExport.records.filter((record) => record.record_kind === "productive_transformation_diversification_decarbonization_shared_prosperity_ledger");
check(
  economicDevelopmentTransformationExport.dataset === "economic_development_industrial_strategy_innovation_systems_regional_convergence_productive_transformation" &&
  economicDevelopmentTransformationExport.count === 32 &&
  economicDevelopmentStrategyRecords.length === manifest.expected_build.phase_93_economic_development_mission_sector_strategy_production_ecosystem_dossiers &&
  innovationSystemRecords.length === manifest.expected_build.phase_93_innovation_research_diffusion_commercialization_standards_ledgers &&
  regionalConvergenceRecords.length === manifest.expected_build.phase_93_regional_cluster_corridor_supplier_workforce_convergence_registers &&
  productiveTransformationRecords.length === manifest.expected_build.phase_93_productive_transformation_diversification_decarbonization_shared_prosperity_ledgers,
  "The Phase 93 export must preserve 8 strategy dossiers, 8 innovation ledgers, 8 regional registers, and 8 transformation ledgers.",
);
check(economicDevelopmentStrategyRecords.every((record) =>
  record.strategy_state === "Inactive - No Verified Phase 92 Macroeconomic-Coordination Record" && record.strategy_decision === "Not Open" &&
  record.strategy_checks?.length === 20 && record.strategy_checks.every((item) => item.decision_state === "Inactive") &&
  record.development_mission_sector_strategy_class_records?.length === 14 && record.development_mission_sector_strategy_class_records.every((item) => item.class_state === "Unassessed") &&
  record.production_ecosystem_readiness_dimension_records?.length === 12 && record.production_ecosystem_readiness_dimension_records.every((item) => item.dimension_state === "Not Measured") &&
  record.industrial_strategy_additionality_governance_safeguard_records?.length === 12 && record.industrial_strategy_additionality_governance_safeguard_records.every((item) => item.safeguard_state === "Unverified") &&
  record.mission_records?.length === 0 && record.strategy_receipt_id === null && noAutomaticAuthority(record)
), "A Phase 93 strategy dossier contains a premature mission, sector, instrument, subsidy, procurement, capacity, receipt, score, rank, or stage change.");
check(innovationSystemRecords.every((record) =>
  record.innovation_state === "Inactive - No Adopted Mission Sector-Strategy And Production-Ecosystem Baseline" && record.innovation_decision === "Not Open" &&
  record.innovation_checks?.length === 20 && record.innovation_checks.every((item) => item.decision_state === "Inactive") &&
  record.innovation_research_transfer_pathway_records?.length === 14 && record.innovation_research_transfer_pathway_records.every((item) => item.pathway_state === "Unassessed") &&
  record.innovation_diffusion_commercialization_dimension_records?.length === 12 && record.innovation_diffusion_commercialization_dimension_records.every((item) => item.dimension_state === "Not Measured") &&
  record.innovation_access_public_return_safeguard_records?.length === 12 && record.innovation_access_public_return_safeguard_records.every((item) => item.safeguard_state === "Unverified") &&
  record.research_records?.length === 0 && record.innovation_receipt_id === null && noAutomaticAuthority(record)
), "A Phase 93 innovation ledger contains a premature research, readiness, standard, commercialization, adoption, receipt, score, rank, or stage change.");
check(regionalConvergenceRecords.every((record) =>
  record.region_state === "Inactive - No Verified Innovation Diffusion And Public-Return Baseline" && record.region_decision === "Not Open" &&
  record.region_checks?.length === 22 && record.region_checks.every((item) => item.decision_state === "Inactive") &&
  record.regional_cluster_corridor_network_class_records?.length === 14 && record.regional_cluster_corridor_network_class_records.every((item) => item.class_state === "Unassessed") &&
  record.regional_supplier_workforce_infrastructure_dimension_records?.length === 12 && record.regional_supplier_workforce_infrastructure_dimension_records.every((item) => item.dimension_state === "Not Measured") &&
  record.regional_equity_convergence_anchoring_safeguard_records?.length === 12 && record.regional_equity_convergence_anchoring_safeguard_records.every((item) => item.safeguard_state === "Unverified") &&
  record.region_records?.length === 0 && record.region_receipt_id === null && noAutomaticAuthority(record)
), "A Phase 93 regional register contains a premature cluster, corridor, supplier, workforce, convergence, receipt, score, rank, or stage change.");
check(productiveTransformationRecords.every((record) =>
  record.transformation_state === "Inactive - No Verified Regional Supplier Workforce And Convergence Baseline" && record.transformation_decision === "Not Open" &&
  record.transformation_checks?.length === 24 && record.transformation_checks.every((item) => item.decision_state === "Inactive") &&
  record.productive_transformation_strategy_class_records?.length === 14 && record.productive_transformation_strategy_class_records.every((item) => item.class_state === "Unassessed") &&
  record.productive_capability_distribution_dimension_records?.length === 12 && record.productive_capability_distribution_dimension_records.every((item) => item.dimension_state === "Not Measured") &&
  record.productive_transformation_democratic_safeguard_records?.length === 12 && record.productive_transformation_democratic_safeguard_records.every((item) => item.safeguard_state === "Unverified") &&
  record.long_horizon_productive_transformation_test_records?.length === 12 && record.long_horizon_productive_transformation_test_records.every((item) => item.test_state === "Not Tested") &&
  record.sector_records?.length === 0 && record.transformation_receipt_id === null && noAutomaticAuthority(record)
), "A Phase 93 transformation ledger contains a premature productivity, diversification, decarbonization, shared-prosperity, receipt, score, rank, or stage change.");
const industrialUtilityRecords = physicalEconomySupplyChainExport.records.filter((record) => record.record_kind === "energy_water_industrial_utility_reliability_dossier");
const qualifiedMaterialRecords = physicalEconomySupplyChainExport.records.filter((record) => record.record_kind === "minerals_materials_processing_circularity_qualification_ledger");
const acceptedProductionRecords = physicalEconomySupplyChainExport.records.filter((record) => record.record_kind === "manufacturing_equipment_automation_maintenance_quality_accepted_production_register");
const strategicSupplyChainRecords = physicalEconomySupplyChainExport.records.filter((record) => record.record_kind === "logistics_inventory_strategic_reserves_emergency_conversion_supply_chain_resilience_ledger");
check(
  physicalEconomySupplyChainExport.dataset === "energy_materials_manufacturing_logistics_strategic_supply_chain_transformation" &&
  physicalEconomySupplyChainExport.count === 32 &&
  industrialUtilityRecords.length === manifest.expected_build.phase_94_energy_water_industrial_utility_reliability_dossiers &&
  qualifiedMaterialRecords.length === manifest.expected_build.phase_94_minerals_materials_processing_circularity_qualification_ledgers &&
  acceptedProductionRecords.length === manifest.expected_build.phase_94_manufacturing_equipment_automation_maintenance_quality_accepted_production_registers &&
  strategicSupplyChainRecords.length === manifest.expected_build.phase_94_logistics_inventory_strategic_reserves_emergency_conversion_supply_chain_resilience_ledgers,
  "The Phase 94 export must preserve 8 utility dossiers, 8 material ledgers, 8 manufacturing registers, and 8 supply-chain ledgers.",
);
check(industrialUtilityRecords.every((record) =>
  record.energy_state === "Inactive - No Verified Phase 93 Productive-Transformation Record" && record.energy_decision === "Not Open" &&
  record.energy_checks?.length === 20 && record.energy_checks.every((item) => item.decision_state === "Inactive") &&
  record.energy_water_industrial_utility_class_records?.length === 14 && record.energy_water_industrial_utility_class_records.every((item) => item.class_state === "Unassessed") &&
  record.industrial_utility_reliability_access_dimension_records?.length === 12 && record.industrial_utility_reliability_access_dimension_records.every((item) => item.dimension_state === "Not Measured") &&
  record.energy_water_utility_rights_resilience_safeguard_records?.length === 12 && record.energy_water_utility_rights_resilience_safeguard_records.every((item) => item.safeguard_state === "Unverified") &&
  record.energy_asset_records?.length === 0 && record.energy_receipt_id === null && noAutomaticAuthority(record)
), "A Phase 94 utility dossier contains a premature allocation, capacity, reliability, service, restoration, receipt, score, rank, or stage change.");
check(qualifiedMaterialRecords.every((record) =>
  record.materials_state === "Inactive - No Adopted Industrial-Utility Reliability Baseline" && record.materials_decision === "Not Open" &&
  record.materials_checks?.length === 20 && record.materials_checks.every((item) => item.decision_state === "Inactive") &&
  record.mineral_material_processing_supply_class_records?.length === 14 && record.mineral_material_processing_supply_class_records.every((item) => item.class_state === "Unassessed") &&
  record.material_qualification_circularity_traceability_dimension_records?.length === 12 && record.material_qualification_circularity_traceability_dimension_records.every((item) => item.dimension_state === "Not Measured") &&
  record.material_rights_environment_public_value_safeguard_records?.length === 12 && record.material_rights_environment_public_value_safeguard_records.every((item) => item.safeguard_state === "Unverified") &&
  record.material_records?.length === 0 && record.materials_receipt_id === null && noAutomaticAuthority(record)
), "A Phase 94 material ledger contains a premature reserve, qualification, standard, certification, supply, receipt, score, rank, or stage change.");
check(acceptedProductionRecords.every((record) =>
  record.manufacturing_state === "Inactive - No Verified Qualified-Material And Circular-Supply Baseline" && record.manufacturing_decision === "Not Open" &&
  record.manufacturing_checks?.length === 22 && record.manufacturing_checks.every((item) => item.decision_state === "Inactive") &&
  record.manufacturing_factory_production_system_class_records?.length === 14 && record.manufacturing_factory_production_system_class_records.every((item) => item.class_state === "Unassessed") &&
  record.equipment_automation_maintenance_quality_dimension_records?.length === 12 && record.equipment_automation_maintenance_quality_dimension_records.every((item) => item.dimension_state === "Not Measured") &&
  record.worker_community_accepted_production_safeguard_records?.length === 12 && record.worker_community_accepted_production_safeguard_records.every((item) => item.safeguard_state === "Unverified") &&
  record.factory_records?.length === 0 && record.manufacturing_receipt_id === null && noAutomaticAuthority(record)
), "A Phase 94 manufacturing register contains a premature factory, equipment, production, quality, acceptance, receipt, score, rank, or stage change.");
check(strategicSupplyChainRecords.every((record) =>
  record.supply_chain_state === "Inactive - No Verified Accepted-Production And Manufacturing-System Baseline" && record.supply_chain_decision === "Not Open" &&
  record.supply_chain_checks?.length === 24 && record.supply_chain_checks.every((item) => item.decision_state === "Inactive") &&
  record.logistics_inventory_reserve_network_class_records?.length === 14 && record.logistics_inventory_reserve_network_class_records.every((item) => item.class_state === "Unassessed") &&
  record.supply_chain_visibility_access_resilience_dimension_records?.length === 12 && record.supply_chain_visibility_access_resilience_dimension_records.every((item) => item.dimension_state === "Not Measured") &&
  record.strategic_supply_chain_governance_safeguard_records?.length === 12 && record.strategic_supply_chain_governance_safeguard_records.every((item) => item.safeguard_state === "Unverified") &&
  record.long_horizon_physical_economy_test_records?.length === 12 && record.long_horizon_physical_economy_test_records.every((item) => item.test_state === "Not Tested") &&
  record.shipment_records?.length === 0 && record.supply_chain_receipt_id === null && noAutomaticAuthority(record)
), "A Phase 94 supply-chain ledger contains a premature shipment, inventory, reserve, conversion, resilience, sovereignty, transition, receipt, score, rank, or stage change.");
const territorialReadinessRecords = territorialSystemsDeliveryExport.records.filter((record) => record.record_kind === "spatial_planning_land_assembly_rights_of_way_site_readiness_dossier");
const projectDefinitionRecords = territorialSystemsDeliveryExport.records.filter((record) => record.record_kind === "project_design_engineering_cost_estimation_permitting_procurement_ledger");
const constructionDeliveryRecords = territorialSystemsDeliveryExport.records.filter((record) => record.record_kind === "construction_contractors_trades_materials_safety_inspection_register");
const assetStewardshipRecords = territorialSystemsDeliveryExport.records.filter((record) => record.record_kind === "commissioning_accessibility_asset_handover_operations_maintenance_adaptation_reconstruction_territorial_value_ledger");
check(
  territorialSystemsDeliveryExport.dataset === "infrastructure_construction_buildings_public_works_territorial_systems_delivery" &&
  territorialSystemsDeliveryExport.count === 32 &&
  territorialReadinessRecords.length === manifest.expected_build.phase_95_spatial_planning_land_assembly_rights_of_way_site_readiness_dossiers &&
  projectDefinitionRecords.length === manifest.expected_build.phase_95_project_design_engineering_cost_estimation_permitting_procurement_ledgers &&
  constructionDeliveryRecords.length === manifest.expected_build.phase_95_construction_contractors_trades_materials_safety_inspection_registers &&
  assetStewardshipRecords.length === manifest.expected_build.phase_95_commissioning_accessibility_asset_handover_operations_maintenance_adaptation_reconstruction_territorial_value_ledgers,
  "The Phase 95 export must preserve 8 territorial-readiness dossiers, 8 project ledgers, 8 construction registers, and 8 stewardship ledgers.",
);
check(territorialReadinessRecords.every((record) =>
  record.territorial_state === "Inactive - No Verified Phase 94 Physical-Economy Record" && record.territorial_decision === "Not Open" &&
  record.territorial_checks?.length === 20 && record.territorial_checks.every((item) => item.decision_state === "Inactive") &&
  record.territorial_planning_site_class_records?.length === 14 && record.territorial_planning_site_class_records.every((item) => item.class_state === "Unassessed") &&
  record.territorial_readiness_dimension_records?.length === 12 && record.territorial_readiness_dimension_records.every((item) => item.dimension_state === "Not Measured") &&
  record.territorial_rights_public_value_safeguard_records?.length === 12 && record.territorial_rights_public_value_safeguard_records.every((item) => item.safeguard_state === "Unverified") &&
  record.plan_records?.length === 0 && record.territorial_receipt_id === null && noAutomaticAuthority(record)
), "A Phase 95 territorial dossier contains a premature plan, land, right-of-way, site-readiness, receipt, score, rank, or stage change.");
check(projectDefinitionRecords.every((record) =>
  record.project_state === "Inactive - No Adopted Territorial-Readiness Baseline" && record.project_decision === "Not Open" &&
  record.project_checks?.length === 22 && record.project_checks.every((item) => item.decision_state === "Inactive") &&
  record.project_design_procurement_class_records?.length === 14 && record.project_design_procurement_class_records.every((item) => item.class_state === "Unassessed") &&
  record.project_definition_design_delivery_dimension_records?.length === 12 && record.project_definition_design_delivery_dimension_records.every((item) => item.dimension_state === "Not Measured") &&
  record.project_procurement_governance_safeguard_records?.length === 12 && record.project_procurement_governance_safeguard_records.every((item) => item.safeguard_state === "Unverified") &&
  record.project_records?.length === 0 && record.project_receipt_id === null && noAutomaticAuthority(record)
), "A Phase 95 project ledger contains a premature project, design, estimate, permit, procurement, contract, receipt, score, rank, or stage change.");
check(constructionDeliveryRecords.every((record) =>
  record.construction_state === "Inactive - No Verified Project Definition And Procurement Baseline" && record.construction_decision === "Not Open" &&
  record.construction_checks?.length === 22 && record.construction_checks.every((item) => item.decision_state === "Inactive") &&
  record.construction_work_package_class_records?.length === 14 && record.construction_work_package_class_records.every((item) => item.class_state === "Unassessed") &&
  record.construction_delivery_assurance_dimension_records?.length === 12 && record.construction_delivery_assurance_dimension_records.every((item) => item.dimension_state === "Not Measured") &&
  record.construction_worker_community_safeguard_records?.length === 12 && record.construction_worker_community_safeguard_records.every((item) => item.safeguard_state === "Unverified") &&
  record.contract_records?.length === 0 && record.construction_receipt_id === null && noAutomaticAuthority(record)
), "A Phase 95 construction register contains a premature start, progress, cost, safety, quality, inspection, completion, receipt, score, rank, or stage change.");
check(assetStewardshipRecords.every((record) =>
  record.stewardship_state === "Inactive - No Verified Construction And Inspection Baseline" && record.stewardship_decision === "Not Open" &&
  record.stewardship_checks?.length === 24 && record.stewardship_checks.every((item) => item.decision_state === "Inactive") &&
  record.asset_service_stewardship_class_records?.length === 14 && record.asset_service_stewardship_class_records.every((item) => item.class_state === "Unassessed") &&
  record.asset_service_stewardship_dimension_records?.length === 12 && record.asset_service_stewardship_dimension_records.every((item) => item.dimension_state === "Not Measured") &&
  record.territorial_service_rights_safeguard_records?.length === 12 && record.territorial_service_rights_safeguard_records.every((item) => item.safeguard_state === "Unverified") &&
  record.long_horizon_territorial_system_test_records?.length === 12 && record.long_horizon_territorial_system_test_records.every((item) => item.test_state === "Not Tested") &&
  record.asset_records?.length === 0 && record.stewardship_receipt_id === null && noAutomaticAuthority(record)
), "A Phase 95 stewardship ledger contains a premature commissioning, accessibility, service, maintenance, reconstruction, recovery, place-value, receipt, score, rank, or stage change.");
const mobilityAccessRecords = mobilityNetworkAccessExport.records.filter((record) => record.record_kind === "passenger_mobility_demand_accessibility_affordability_inclusion_dossier");
const transportationServiceRecords = mobilityNetworkAccessExport.records.filter((record) => record.record_kind === "multimodal_transportation_service_planning_operations_safety_reliability_ledger");
const freightDeliveryRecords = mobilityNetworkAccessExport.records.filter((record) => record.record_kind === "freight_goods_movement_intermodal_logistics_delivery_resilience_register");
const digitalAccessRecords = mobilityNetworkAccessExport.records.filter((record) => record.record_kind === "communications_broadband_mobile_digital_public_infrastructure_interoperability_territorial_access_ledger");
check(
  mobilityNetworkAccessExport.dataset === "mobility_transportation_freight_communications_digital_networks_territorial_access" && mobilityNetworkAccessExport.count === 32 &&
  mobilityAccessRecords.length === manifest.expected_build.phase_96_passenger_mobility_demand_accessibility_affordability_inclusion_dossiers &&
  transportationServiceRecords.length === manifest.expected_build.phase_96_multimodal_transportation_service_planning_operations_safety_reliability_ledgers &&
  freightDeliveryRecords.length === manifest.expected_build.phase_96_freight_goods_movement_intermodal_logistics_delivery_resilience_registers &&
  digitalAccessRecords.length === manifest.expected_build.phase_96_communications_broadband_mobile_digital_public_infrastructure_interoperability_territorial_access_ledgers,
  "The Phase 96 export must preserve 8 mobility-access dossiers, 8 transportation-service ledgers, 8 freight-delivery registers, and 8 digital-access ledgers.",
);
check(mobilityAccessRecords.every((record) =>
  record.mobility_state === "Inactive - No Verified Phase 95 Commissioned Territorial-System Record" && record.mobility_decision === "Not Open" &&
  record.mobility_checks?.length === 20 && record.mobility_checks.every((item) => item.decision_state === "Inactive") &&
  record.mobility_demand_access_class_records?.length === 14 && record.mobility_demand_access_class_records.every((item) => item.class_state === "Unassessed") &&
  record.mobility_access_dimension_records?.length === 12 && record.mobility_access_dimension_records.every((item) => item.dimension_state === "Not Measured") &&
  record.mobility_rights_safeguard_records?.length === 12 && record.mobility_rights_safeguard_records.every((item) => item.safeguard_state === "Unverified") &&
  record.trip_records?.length === 0 && record.mobility_receipt_id === null && noAutomaticAuthority(record)
), "A Phase 96 mobility dossier contains a premature trip, access, affordability, inclusion, receipt, score, rank, or stage change.");
check(transportationServiceRecords.every((record) =>
  record.service_state === "Inactive - No Adopted Mobility-Access Baseline" && record.service_decision === "Not Open" &&
  record.service_checks?.length === 22 && record.service_checks.every((item) => item.decision_state === "Inactive") &&
  record.transportation_service_network_class_records?.length === 14 && record.transportation_service_network_class_records.every((item) => item.class_state === "Unassessed") &&
  record.transportation_service_dimension_records?.length === 12 && record.transportation_service_dimension_records.every((item) => item.dimension_state === "Not Measured") &&
  record.transportation_governance_safeguard_records?.length === 12 && record.transportation_governance_safeguard_records.every((item) => item.safeguard_state === "Unverified") &&
  record.schedule_records?.length === 0 && record.service_receipt_id === null && noAutomaticAuthority(record)
), "A Phase 96 service ledger contains a premature trip, safety, reliability, accessibility, receipt, score, rank, or stage change.");
check(freightDeliveryRecords.every((record) =>
  record.freight_state === "Inactive - No Verified Transportation-Network Baseline" && record.freight_decision === "Not Open" &&
  record.freight_checks?.length === 22 && record.freight_checks.every((item) => item.decision_state === "Inactive") &&
  record.freight_network_class_records?.length === 14 && record.freight_network_class_records.every((item) => item.class_state === "Unassessed") &&
  record.freight_delivery_resilience_dimension_records?.length === 12 && record.freight_delivery_resilience_dimension_records.every((item) => item.dimension_state === "Not Measured") &&
  record.freight_public_value_safeguard_records?.length === 12 && record.freight_public_value_safeguard_records.every((item) => item.safeguard_state === "Unverified") &&
  record.shipment_records?.length === 0 && record.freight_receipt_id === null && noAutomaticAuthority(record)
), "A Phase 96 freight register contains a premature movement, delivery, resilience, receipt, score, rank, or stage change.");
check(digitalAccessRecords.every((record) =>
  record.digital_state === "Inactive - No Verified Commissioned Communications-Network Baseline" && record.digital_decision === "Not Open" &&
  record.digital_checks?.length === 24 && record.digital_checks.every((item) => item.decision_state === "Inactive") &&
  record.digital_network_class_records?.length === 14 && record.digital_network_class_records.every((item) => item.class_state === "Unassessed") &&
  record.digital_access_dimension_records?.length === 12 && record.digital_access_dimension_records.every((item) => item.dimension_state === "Not Measured") &&
  record.digital_rights_safeguard_records?.length === 12 && record.digital_rights_safeguard_records.every((item) => item.safeguard_state === "Unverified") &&
  record.long_horizon_access_test_records?.length === 12 && record.long_horizon_access_test_records.every((item) => item.test_state === "Not Tested") &&
  record.coverage_records?.length === 0 && record.digital_receipt_id === null && noAutomaticAuthority(record)
), "A Phase 96 digital-access ledger contains a premature coverage, connectivity, interoperability, restoration, recovery, receipt, score, rank, or stage change.");
const climateMitigationRecords = environmentPlanetaryStewardshipExport.records.filter((record) => record.record_kind === "greenhouse_gas_emissions_climate_mitigation_decarbonization_transition_dossier");
const pollutionExposureRecords = environmentPlanetaryStewardshipExport.records.filter((record) => record.record_kind === "air_water_soil_noise_chemical_pollution_exposure_environmental_justice_ledger");
const ecosystemRestorationRecords = environmentPlanetaryStewardshipExport.records.filter((record) => record.record_kind === "ecosystems_biodiversity_habitat_land_freshwater_ocean_restoration_register");
const planetaryStewardshipRecords = environmentPlanetaryStewardshipExport.records.filter((record) => record.record_kind === "waste_materials_circularity_climate_adaptation_disaster_risk_planetary_system_stewardship_ledger");
check(
  environmentPlanetaryStewardshipExport.dataset === "environment_climate_ecosystems_pollution_waste_circularity_planetary_system_stewardship" && environmentPlanetaryStewardshipExport.count === 32 &&
  climateMitigationRecords.length === manifest.expected_build.phase_97_greenhouse_gas_emissions_climate_mitigation_decarbonization_transition_dossiers &&
  pollutionExposureRecords.length === manifest.expected_build.phase_97_air_water_soil_noise_chemical_pollution_exposure_environmental_justice_ledgers &&
  ecosystemRestorationRecords.length === manifest.expected_build.phase_97_ecosystems_biodiversity_habitat_land_freshwater_ocean_restoration_registers &&
  planetaryStewardshipRecords.length === manifest.expected_build.phase_97_waste_materials_circularity_climate_adaptation_disaster_risk_planetary_system_stewardship_ledgers,
  "The Phase 97 export must preserve 8 climate-mitigation dossiers, 8 pollution-exposure ledgers, 8 ecosystem-restoration registers, and 8 planetary-stewardship ledgers.",
);
check(climateMitigationRecords.every((record) =>
  record.climate_state === "Inactive - No Verified Phase 96 Mobility And Network-Access Record" && record.climate_decision === "Not Open" &&
  record.climate_checks?.length === 20 && record.climate_checks.every((item) => item.decision_state === "Inactive") &&
  record.climate_transition_class_records?.length === 14 && record.climate_transition_class_records.every((item) => item.class_state === "Unassessed") &&
  record.climate_mitigation_dimension_records?.length === 12 && record.climate_mitigation_dimension_records.every((item) => item.dimension_state === "Not Measured") &&
  record.climate_justice_safeguard_records?.length === 12 && record.climate_justice_safeguard_records.every((item) => item.safeguard_state === "Unverified") &&
  record.inventory_records?.length === 0 && record.climate_receipt_id === null && noAutomaticAuthority(record)
), "A Phase 97 climate dossier contains a premature inventory, target, decarbonization, transition, receipt, score, rank, or stage change.");
check(pollutionExposureRecords.every((record) =>
  record.pollution_state === "Inactive - No Adopted Climate And Emissions Baseline" && record.pollution_decision === "Not Open" &&
  record.pollution_checks?.length === 22 && record.pollution_checks.every((item) => item.decision_state === "Inactive") &&
  record.pollution_exposure_class_records?.length === 14 && record.pollution_exposure_class_records.every((item) => item.class_state === "Unassessed") &&
  record.pollution_exposure_dimension_records?.length === 12 && record.pollution_exposure_dimension_records.every((item) => item.dimension_state === "Not Measured") &&
  record.environmental_justice_safeguard_records?.length === 12 && record.environmental_justice_safeguard_records.every((item) => item.safeguard_state === "Unverified") &&
  record.pollutant_records?.length === 0 && record.pollution_receipt_id === null && noAutomaticAuthority(record)
), "A Phase 97 pollution ledger contains a premature permit, exposure, health, justice, remediation, receipt, score, rank, or stage change.");
check(ecosystemRestorationRecords.every((record) =>
  record.ecosystem_state === "Inactive - No Verified Climate And Pollution Baseline" && record.ecosystem_decision === "Not Open" &&
  record.ecosystem_checks?.length === 22 && record.ecosystem_checks.every((item) => item.decision_state === "Inactive") &&
  record.ecosystem_class_records?.length === 14 && record.ecosystem_class_records.every((item) => item.class_state === "Unassessed") &&
  record.ecosystem_integrity_dimension_records?.length === 12 && record.ecosystem_integrity_dimension_records.every((item) => item.dimension_state === "Not Measured") &&
  record.biodiversity_rights_safeguard_records?.length === 12 && record.biodiversity_rights_safeguard_records.every((item) => item.safeguard_state === "Unverified") &&
  record.ecosystem_records?.length === 0 && record.ecosystem_receipt_id === null && noAutomaticAuthority(record)
), "A Phase 97 ecosystem register contains a premature designation, condition, biodiversity, restoration, receipt, score, rank, or stage change.");
check(planetaryStewardshipRecords.every((record) =>
  record.planetary_state === "Inactive - No Verified Climate, Pollution And Ecosystem Baseline" && record.planetary_decision === "Not Open" &&
  record.planetary_checks?.length === 24 && record.planetary_checks.every((item) => item.decision_state === "Inactive") &&
  record.circularity_stewardship_class_records?.length === 14 && record.circularity_stewardship_class_records.every((item) => item.class_state === "Unassessed") &&
  record.planetary_stewardship_dimension_records?.length === 12 && record.planetary_stewardship_dimension_records.every((item) => item.dimension_state === "Not Measured") &&
  record.planetary_governance_safeguard_records?.length === 12 && record.planetary_governance_safeguard_records.every((item) => item.safeguard_state === "Unverified") &&
  record.long_horizon_planetary_test_records?.length === 12 && record.long_horizon_planetary_test_records.every((item) => item.test_state === "Not Tested") &&
  record.waste_records?.length === 0 && record.planetary_receipt_id === null && noAutomaticAuthority(record)
), "A Phase 97 planetary ledger contains a premature waste, circularity, adaptation, vulnerability, recovery, receipt, score, rank, or stage change.");
const justiceAccessRecords = justiceSafetySecurityPeaceExport.records.filter((record) => record.record_kind === "rights_rule_of_law_courts_legal_aid_access_to_justice_dossier");
const publicSafetyAccountabilityRecords = justiceSafetySecurityPeaceExport.records.filter((record) => record.record_kind === "public_safety_violence_prevention_policing_fire_corrections_accountability_ledger");
const emergencyResilienceRecords = justiceSafetySecurityPeaceExport.records.filter((record) => record.record_kind === "emergency_management_civil_protection_critical_system_security_resilience_register");
const securityPeaceStewardshipRecords = justiceSafetySecurityPeaceExport.records.filter((record) => record.record_kind === "defense_intelligence_conflict_prevention_civilian_protection_peace_stewardship_ledger");
check(
  justiceSafetySecurityPeaceExport.dataset === "law_justice_public_safety_emergency_management_security_defense_peace" && justiceSafetySecurityPeaceExport.count === 32 &&
  justiceAccessRecords.length === manifest.expected_build.phase_98_rights_rule_of_law_courts_legal_aid_access_to_justice_dossiers &&
  publicSafetyAccountabilityRecords.length === manifest.expected_build.phase_98_public_safety_violence_prevention_policing_fire_corrections_accountability_ledgers &&
  emergencyResilienceRecords.length === manifest.expected_build.phase_98_emergency_management_civil_protection_critical_system_security_resilience_registers &&
  securityPeaceStewardshipRecords.length === manifest.expected_build.phase_98_defense_intelligence_conflict_prevention_civilian_protection_peace_stewardship_ledgers,
  "The Phase 98 export must preserve 8 justice-access dossiers, 8 public-safety ledgers, 8 emergency-resilience registers, and 8 security-peace ledgers.",
);
check(justiceAccessRecords.every((record) =>
  record.justice_state === "Inactive - No Verified Phase 97 Environmental And Planetary-Stewardship Record" && record.justice_decision === "Not Open" &&
  record.justice_checks?.length === 20 && record.justice_checks.every((item) => item.decision_state === "Inactive") &&
  record.justice_access_class_records?.length === 14 && record.justice_access_class_records.every((item) => item.class_state === "Unassessed") &&
  record.justice_access_dimension_records?.length === 12 && record.justice_access_dimension_records.every((item) => item.dimension_state === "Not Measured") &&
  record.justice_rights_safeguard_records?.length === 12 && record.justice_rights_safeguard_records.every((item) => item.safeguard_state === "Unverified") &&
  record.right_records?.length === 0 && record.justice_receipt_id === null && noAutomaticAuthority(record)
), "A Phase 98 justice dossier contains a premature right, standing, access, remedy, receipt, score, rank, or stage change.");
check(publicSafetyAccountabilityRecords.every((record) =>
  record.safety_state === "Inactive - No Adopted Justice-Access And Rights Baseline" && record.safety_decision === "Not Open" &&
  record.safety_checks?.length === 22 && record.safety_checks.every((item) => item.decision_state === "Inactive") &&
  record.public_safety_class_records?.length === 14 && record.public_safety_class_records.every((item) => item.class_state === "Unassessed") &&
  record.public_safety_dimension_records?.length === 12 && record.public_safety_dimension_records.every((item) => item.dimension_state === "Not Measured") &&
  record.safety_rights_safeguard_records?.length === 12 && record.safety_rights_safeguard_records.every((item) => item.safeguard_state === "Unverified") &&
  record.harm_records?.length === 0 && record.safety_receipt_id === null && noAutomaticAuthority(record)
), "A Phase 98 safety ledger contains a premature prevention, response, harm-reduction, accountability, receipt, score, rank, or stage change.");
check(emergencyResilienceRecords.every((record) =>
  record.emergency_state === "Inactive - No Verified Justice, Rights And Public-Safety Baseline" && record.emergency_decision === "Not Open" &&
  record.emergency_checks?.length === 22 && record.emergency_checks.every((item) => item.decision_state === "Inactive") &&
  record.emergency_resilience_class_records?.length === 14 && record.emergency_resilience_class_records.every((item) => item.class_state === "Unassessed") &&
  record.emergency_resilience_dimension_records?.length === 12 && record.emergency_resilience_dimension_records.every((item) => item.dimension_state === "Not Measured") &&
  record.emergency_rights_safeguard_records?.length === 12 && record.emergency_rights_safeguard_records.every((item) => item.safeguard_state === "Unverified") &&
  record.hazard_records?.length === 0 && record.emergency_receipt_id === null && noAutomaticAuthority(record)
), "A Phase 98 emergency register contains a premature preparedness, declaration, response, recovery, receipt, score, rank, or stage change.");
check(securityPeaceStewardshipRecords.every((record) =>
  record.peace_state === "Inactive - No Verified Justice, Safety And Emergency-Resilience Baseline" && record.peace_decision === "Not Open" &&
  record.peace_checks?.length === 24 && record.peace_checks.every((item) => item.decision_state === "Inactive") &&
  record.security_peace_class_records?.length === 14 && record.security_peace_class_records.every((item) => item.class_state === "Unassessed") &&
  record.security_peace_dimension_records?.length === 12 && record.security_peace_dimension_records.every((item) => item.dimension_state === "Not Measured") &&
  record.security_peace_safeguard_records?.length === 12 && record.security_peace_safeguard_records.every((item) => item.safeguard_state === "Unverified") &&
  record.long_horizon_peace_test_records?.length === 12 && record.long_horizon_peace_test_records.every((item) => item.test_state === "Not Tested") &&
  record.threat_records?.length === 0 && record.peace_receipt_id === null && noAutomaticAuthority(record)
), "A Phase 98 security-peace ledger contains a premature threat, intelligence, defense, civilian-protection, ceasefire, peace, receipt, score, rank, or stage change.");
const representativeDemocracyRecords = democracyGovernmentLegitimacyExport.records.filter((record) => record.record_kind === "elections_representation_participation_inclusion_democratic_integrity_dossier");
const governmentCapabilityRecords = democracyGovernmentLegitimacyExport.records.filter((record) => record.record_kind === "constitutional_legislative_executive_public_administration_capability_ledger");
const publicAccountabilityRecords = democracyGovernmentLegitimacyExport.records.filter((record) => record.record_kind === "public_accountability_fiscal_transparency_audit_procurement_integrity_open_government_register");
const institutionalLegitimacyRecords = democracyGovernmentLegitimacyExport.records.filter((record) => record.record_kind === "civic_information_media_pluralism_public_trust_institutional_legitimacy_democratic_resilience_ledger");
check(
  democracyGovernmentLegitimacyExport.dataset === "democracy_government_public_administration_civic_information_institutional_legitimacy" && democracyGovernmentLegitimacyExport.count === 32 &&
  representativeDemocracyRecords.length === manifest.expected_build.phase_99_elections_representation_participation_inclusion_democratic_integrity_dossiers &&
  governmentCapabilityRecords.length === manifest.expected_build.phase_99_constitutional_legislative_executive_public_administration_capability_ledgers &&
  publicAccountabilityRecords.length === manifest.expected_build.phase_99_public_accountability_fiscal_transparency_audit_procurement_integrity_open_government_registers &&
  institutionalLegitimacyRecords.length === manifest.expected_build.phase_99_civic_information_media_pluralism_public_trust_institutional_legitimacy_democratic_resilience_ledgers,
  "The Phase 99 export must preserve 8 democracy dossiers, 8 government-capability ledgers, 8 public-accountability registers, and 8 legitimacy-resilience ledgers.",
);
check(representativeDemocracyRecords.every((record) =>
  record.democracy_state === "Inactive - No Verified Phase 98 Security And Peace-Stewardship Record" && record.democracy_decision === "Not Open" &&
  record.democracy_checks?.length === 20 && record.democracy_checks.every((item) => item.decision_state === "Inactive") &&
  record.democracy_class_records?.length === 14 && record.democracy_class_records.every((item) => item.class_state === "Unassessed") &&
  record.democracy_dimension_records?.length === 12 && record.democracy_dimension_records.every((item) => item.dimension_state === "Not Measured") &&
  record.democracy_safeguard_records?.length === 12 && record.democracy_safeguard_records.every((item) => item.safeguard_state === "Unverified") &&
  record.voter_records?.length === 0 && record.democracy_receipt_id === null && noAutomaticAuthority(record)
), "A Phase 99 democracy dossier contains a premature voter, election, representation, participation, receipt, score, rank, or stage change.");
check(governmentCapabilityRecords.every((record) =>
  record.government_capacity_state === "Inactive - No Adopted Democracy And Representation Baseline" && record.government_capacity_decision === "Not Open" &&
  record.government_checks?.length === 22 && record.government_checks.every((item) => item.decision_state === "Inactive") &&
  record.government_capability_class_records?.length === 14 && record.government_capability_class_records.every((item) => item.class_state === "Unassessed") &&
  record.government_capability_dimension_records?.length === 12 && record.government_capability_dimension_records.every((item) => item.dimension_state === "Not Measured") &&
  record.government_safeguard_records?.length === 12 && record.government_safeguard_records.every((item) => item.safeguard_state === "Unverified") &&
  record.institution_records?.length === 0 && record.delivery_records?.length === 0 && record.government_capacity_receipt_id === null && noAutomaticAuthority(record)
), "A Phase 99 government ledger contains a premature mandate, capability, plan, delivery, receipt, score, rank, or stage change.");
check(publicAccountabilityRecords.every((record) =>
  record.accountability_state === "Inactive - No Verified Democracy And Government-Capability Baseline" && record.accountability_decision === "Not Open" &&
  record.accountability_checks?.length === 22 && record.accountability_checks.every((item) => item.decision_state === "Inactive") &&
  record.accountability_class_records?.length === 14 && record.accountability_class_records.every((item) => item.class_state === "Unassessed") &&
  record.accountability_dimension_records?.length === 12 && record.accountability_dimension_records.every((item) => item.dimension_state === "Not Measured") &&
  record.accountability_safeguard_records?.length === 12 && record.accountability_safeguard_records.every((item) => item.safeguard_state === "Unverified") &&
  record.audit_records?.length === 0 && record.open_data_records?.length === 0 && record.accountability_receipt_id === null && noAutomaticAuthority(record)
), "A Phase 99 accountability register contains a premature fiscal, audit, procurement, open-data, correction, receipt, score, rank, or stage change.");
check(institutionalLegitimacyRecords.every((record) =>
  record.legitimacy_state === "Inactive - No Verified Democracy, Government And Accountability Baseline" && record.legitimacy_decision === "Not Open" &&
  record.legitimacy_checks?.length === 24 && record.legitimacy_checks.every((item) => item.decision_state === "Inactive") &&
  record.legitimacy_class_records?.length === 14 && record.legitimacy_class_records.every((item) => item.class_state === "Unassessed") &&
  record.legitimacy_dimension_records?.length === 12 && record.legitimacy_dimension_records.every((item) => item.dimension_state === "Not Measured") &&
  record.legitimacy_safeguard_records?.length === 12 && record.legitimacy_safeguard_records.every((item) => item.safeguard_state === "Unverified") &&
  record.long_horizon_democratic_resilience_test_records?.length === 12 && record.long_horizon_democratic_resilience_test_records.every((item) => item.test_state === "Not Tested") &&
  record.civic_information_records?.length === 0 && record.legitimacy_records?.length === 0 && record.legitimacy_receipt_id === null && noAutomaticAuthority(record)
), "A Phase 99 legitimacy ledger contains a premature civic-information, trust, legitimacy, resilience, receipt, score, rank, or stage change.");
const internationalOrderRecords = internationalOrderSharedFuturesExport.records.filter((record) => record.record_kind === "international_order_diplomacy_treaties_international_law_peaceful_dispute_resolution_dossier");
const multilateralCooperationRecords = internationalOrderSharedFuturesExport.records.filter((record) => record.record_kind === "multilateral_institutions_representation_development_cooperation_collective_delivery_ledger");
const humanitarianResponsibilityRecords = internationalOrderSharedFuturesExport.records.filter((record) => record.record_kind === "migration_displacement_refugee_asylum_humanitarian_protection_shared_responsibility_register");
const sharedHumanFuturesRecords = internationalOrderSharedFuturesExport.records.filter((record) => record.record_kind === "global_commons_transboundary_risk_catastrophic_risk_intergenerational_shared_human_futures_ledger");
check(
  internationalOrderSharedFuturesExport.dataset === "international_order_multilateral_cooperation_global_commons_cross_border_risk_shared_human_futures" && internationalOrderSharedFuturesExport.count === 32 &&
  internationalOrderRecords.length === manifest.expected_build.phase_100_international_order_diplomacy_treaties_international_law_peaceful_dispute_resolution_dossiers &&
  multilateralCooperationRecords.length === manifest.expected_build.phase_100_multilateral_institutions_representation_development_cooperation_collective_delivery_ledgers &&
  humanitarianResponsibilityRecords.length === manifest.expected_build.phase_100_migration_displacement_refugee_asylum_humanitarian_protection_shared_responsibility_registers &&
  sharedHumanFuturesRecords.length === manifest.expected_build.phase_100_global_commons_transboundary_risk_catastrophic_risk_intergenerational_shared_human_futures_ledgers,
  "The Phase 100 export must preserve 8 international-order dossiers, 8 multilateral ledgers, 8 humanitarian registers, and 8 shared-futures ledgers.",
);
check(internationalOrderRecords.every((record) =>
  record.international_order_state === "Inactive - No Verified Phase 99 Democratic-Legitimacy And Resilience Record" && record.international_order_decision === "Not Open" &&
  record.international_order_checks?.length === 20 && record.international_order_checks.every((item) => item.decision_state === "Inactive") &&
  record.international_order_class_records?.length === 14 && record.international_order_dimension_records?.length === 12 && record.international_order_safeguard_records?.length === 12 &&
  record.treaty_records?.length === 0 && record.implementation_records?.length === 0 && record.international_order_receipt_id === null && noAutomaticAuthority(record)
), "A Phase 100 international-order dossier contains a premature treaty, implementation, cooperation, receipt, score, rank, or stage change.");
check(multilateralCooperationRecords.every((record) =>
  record.multilateral_state === "Inactive - No Adopted International-Order And Treaty Baseline" && record.multilateral_decision === "Not Open" &&
  record.multilateral_checks?.length === 22 && record.multilateral_checks.every((item) => item.decision_state === "Inactive") &&
  record.multilateral_class_records?.length === 14 && record.multilateral_dimension_records?.length === 12 && record.multilateral_safeguard_records?.length === 12 &&
  record.representation_records?.length === 0 && record.delivery_records?.length === 0 && record.multilateral_receipt_id === null && noAutomaticAuthority(record)
), "A Phase 100 multilateral ledger contains a premature representation, finance, delivery, receipt, score, rank, or stage change.");
check(humanitarianResponsibilityRecords.every((record) =>
  record.human_mobility_state === "Inactive - No Verified International-Order And Multilateral-Delivery Baseline" && record.human_mobility_decision === "Not Open" &&
  record.human_mobility_checks?.length === 22 && record.human_mobility_checks.every((item) => item.decision_state === "Inactive") &&
  record.human_mobility_class_records?.length === 14 && record.human_mobility_dimension_records?.length === 12 && record.human_mobility_safeguard_records?.length === 12 &&
  record.status_records?.length === 0 && record.asylum_records?.length === 0 && record.human_mobility_receipt_id === null && noAutomaticAuthority(record)
), "A Phase 100 humanitarian register contains a premature migration, asylum, protection, durable-solution, receipt, score, rank, or stage change.");
check(sharedHumanFuturesRecords.every((record) =>
  record.shared_futures_state === "Inactive - No Verified International-Order, Multilateral And Humanitarian Baseline" && record.shared_futures_decision === "Not Open" &&
  record.shared_futures_checks?.length === 24 && record.shared_futures_checks.every((item) => item.decision_state === "Inactive") &&
  record.global_commons_class_records?.length === 14 && record.global_futures_dimension_records?.length === 12 && record.global_futures_safeguard_records?.length === 12 &&
  record.long_horizon_shared_futures_test_records?.length === 12 && record.long_horizon_shared_futures_test_records.every((item) => item.test_state === "Not Tested") &&
  record.commons_records?.length === 0 && record.risk_records?.length === 0 && record.shared_futures_receipt_id === null && noAutomaticAuthority(record)
), "A Phase 100 shared-futures ledger contains a premature commons, risk-reduction, catastrophic-risk, intergenerational, shared-futures, receipt, score, rank, or stage change.");

function verifyGovernedTerminalExport(dataset, config) {
  check(dataset.dataset === config.dataset && dataset.count === 32, `The Phase ${config.phase} export must contain thirty-two governed records.`);
  const familyRecords = config.families.map((family) => dataset.records.filter((record) => record.record_kind === family.kind));
  familyRecords.forEach((records, index) => {
    const family = config.families[index];
    check(records.length === manifest.expected_build[family.countKey] && records.length === 8, `The Phase ${config.phase} ${family.label} family must contain eight records.`);
    check(records.every((record) =>
      record.record_status === "Published" && record.propagation_status === "not_started" &&
      record[family.decisionKey] === "Not Open" && record[family.checksKey]?.length === family.gates &&
      record[family.checksKey].every((item) => item.decision_state === "Inactive") &&
      record[family.classRecordsKey]?.length === 14 && record[family.dimensionRecordsKey]?.length === 12 && record[family.safeguardRecordsKey]?.length === 12 &&
      (!family.testRecordsKey || (record[family.testRecordsKey]?.length === 12 && record[family.testRecordsKey].every((item) => item.test_state === "Not Tested"))) &&
      Object.entries(record).filter(([key]) => key.endsWith("_records") && !/(class|dimension|safeguard|test)_records$/.test(key)).every(([, value]) => Array.isArray(value) && value.length === 0) &&
      Object.entries(record).filter(([key]) => key.endsWith("_receipt_id")).every(([, value]) => value === null) &&
      noAutomaticAuthority(record)
    ), `A Phase ${config.phase} ${family.label} record crossed its evidence, review, receipt, score, rank, or stage boundary.`);
  });
  return familyRecords;
}

const [wholeSystemScenarioRecords, polycrisisRecords, preparednessRecoveryRecords, civilizationalResilienceRecords] = verifyGovernedTerminalExport(wholeSystemFuturesExport, {
  phase: 101,
  dataset: "whole_system_futures_scenario_governance_polycrisis_readiness_civilizational_resilience_future_generations",
  families: [
    { label: "scenario dossier", kind: "whole_system_scenario_assumption_boundary_driver_uncertainty_dossier", countKey: "phase_101_whole_system_scenario_assumption_boundary_driver_uncertainty_dossiers", decisionKey: "scenario_decision", checksKey: "scenario_checks", gates: 20, classRecordsKey: "scenario_class_records", dimensionRecordsKey: "scenario_dimension_records", safeguardRecordsKey: "scenario_safeguard_records" },
    { label: "polycrisis ledger", kind: "cross_domain_dependency_cascade_compound_risk_polycrisis_stress_test_ledger", countKey: "phase_101_cross_domain_dependency_cascade_compound_risk_polycrisis_stress_test_ledgers", decisionKey: "polycrisis_decision", checksKey: "polycrisis_checks", gates: 22, classRecordsKey: "polycrisis_class_records", dimensionRecordsKey: "polycrisis_dimension_records", safeguardRecordsKey: "polycrisis_safeguard_records" },
    { label: "preparedness and recovery register", kind: "preparedness_option_portfolio_continuity_recovery_transformation_register", countKey: "phase_101_preparedness_option_portfolio_continuity_recovery_transformation_registers", decisionKey: "readiness_decision", checksKey: "readiness_checks", gates: 22, classRecordsKey: "readiness_option_class_records", dimensionRecordsKey: "readiness_dimension_records", safeguardRecordsKey: "readiness_safeguard_records" },
    { label: "civilizational-resilience ledger", kind: "civilizational_resilience_renewal_future_generations_stewardship_ledger", countKey: "phase_101_civilizational_resilience_renewal_future_generations_stewardship_ledgers", decisionKey: "civilizational_resilience_decision", checksKey: "civilizational_resilience_checks", gates: 24, classRecordsKey: "civilizational_resilience_class_records", dimensionRecordsKey: "civilizational_resilience_dimension_records", safeguardRecordsKey: "civilizational_resilience_safeguard_records", testRecordsKey: "long_horizon_civilizational_resilience_test_records" },
  ],
});

const [publicSynthesisRecords, civicDecisionLiteracyRecords, readerNavigationRecords, evergreenStewardshipRecords] = verifyGovernedTerminalExport(publicKnowledgeStewardshipExport, {
  phase: 102,
  dataset: "public_knowledge_synthesis_civic_decision_literacy_reader_navigation_content_closure_evergreen_stewardship",
  families: [
    { label: "public-synthesis dossier", kind: "canonical_public_synthesis_claim_boundary_evidence_lineage_dossier", countKey: "phase_102_canonical_public_synthesis_claim_boundary_evidence_lineage_dossiers", decisionKey: "synthesis_decision", checksKey: "synthesis_checks", gates: 20, classRecordsKey: "synthesis_class_records", dimensionRecordsKey: "synthesis_dimension_records", safeguardRecordsKey: "synthesis_safeguard_records" },
    { label: "civic decision-literacy ledger", kind: "civic_decision_literacy_uncertainty_tradeoff_public_reason_ledger", countKey: "phase_102_civic_decision_literacy_uncertainty_tradeoff_public_reason_ledgers", decisionKey: "decision_literacy_decision", checksKey: "decision_literacy_checks", gates: 22, classRecordsKey: "decision_literacy_class_records", dimensionRecordsKey: "decision_literacy_dimension_records", safeguardRecordsKey: "decision_literacy_safeguard_records" },
    { label: "reader-navigation register", kind: "reader_navigation_learning_pathway_accessibility_translation_register", countKey: "phase_102_reader_navigation_learning_pathway_accessibility_translation_registers", decisionKey: "reader_navigation_decision", checksKey: "reader_navigation_checks", gates: 22, classRecordsKey: "reader_navigation_class_records", dimensionRecordsKey: "reader_navigation_dimension_records", safeguardRecordsKey: "reader_navigation_safeguard_records" },
    { label: "evergreen-stewardship ledger", kind: "content_completeness_maintenance_correction_archive_evergreen_stewardship_ledger", countKey: "phase_102_content_completeness_maintenance_correction_archive_evergreen_stewardship_ledgers", decisionKey: "content_stewardship_decision", checksKey: "content_stewardship_checks", gates: 24, classRecordsKey: "content_stewardship_class_records", dimensionRecordsKey: "content_stewardship_dimension_records", safeguardRecordsKey: "content_stewardship_safeguard_records", testRecordsKey: "long_horizon_content_stewardship_test_records" },
  ],
});
check(
  evidenceQueueExport.count === manifest.expected_build.evidence_queue_records,
  `Expected ${manifest.expected_build.evidence_queue_records} evidence-queue records, found ${evidenceQueueExport.count}.`,
);
check(
  evidenceQueueExport.records.every((record) => ["Published", "In Review"].includes(record.underlying_signal_status) && record.exact_next_artifact && record.next_check_date) &&
  evidenceQueueExport.records.filter((record) => record.underlying_signal_status === "Published" && record.current_decision === "material_change").length === 1 &&
  evidenceQueueExport.records.filter((record) => record.underlying_signal_status === "In Review").length === 9,
  "Evidence-queue export must contain one resolved measured-result gate and nine bounded held gates.",
);
check(
  operatingCycleExport.count === manifest.expected_build.operating_cycle_records,
  `Expected ${manifest.expected_build.operating_cycle_records} operating-cycle records, found ${operatingCycleExport.count}.`,
);
check(
  operatingCycleExport.records.every((record) => record.exact_next_artifact && record.scheduled_check_date && (
    (record.decision_status === "scheduled" && record.decision_date === null && record.receipt_id === null) ||
    (["material_change", "no_material_change", "blocked_with_public_receipt", "rescheduled_with_watch_note"].includes(record.decision_status) && record.decision_date && record.receipt_id)
  )) &&
  operatingCycleExport.records.filter((record) => record.decision_status === "scheduled").length === 11 &&
  operatingCycleExport.records.filter((record) => record.decision_status !== "scheduled").length === 2,
  "Operating-cycle export must contain two complete Wave 60B decisions and eleven bounded future gates.",
);
check(
  projectConversionExport.count === manifest.expected_build.project_conversion_records,
  `Expected ${manifest.expected_build.project_conversion_records} project-conversion records, found ${projectConversionExport.count}.`,
);
check(
  projectConversionExport.records.every((record) => record.exact_next_artifact && (record.next_check_date || record.reopening_trigger) && record.stop_rule),
  "Project-conversion export contains an unbounded named file.",
);
check(
  conversionEventsExport.count === manifest.expected_build.conversion_event_records,
  `Expected ${manifest.expected_build.conversion_event_records} conversion-event records, found ${conversionEventsExport.count}.`,
);
check(
  conversionEventsExport.records.every((record) =>
    record.event_id && record.file_id && record.event_date && record.date_basis &&
    record.prior_stage && record.current_stage && record.materiality && record.evidence_artifact &&
    record.source_ids?.length && record.signal_id && record.interpretation_boundary && record.next_gate
  ),
  "Conversion-event export contains an unresolved or unbounded event.",
);
check(
  conversionEventsExport.records.every((record) => record.receipt_id === null && /^backfilled_(published|held)_evidence$/.test(record.decision_status)),
  "Conversion-event backfill invents a receipt or lacks a bounded backfill decision.",
);
check(
  conversionGatesExport.count === manifest.expected_build.conversion_gate_records,
  `Expected ${manifest.expected_build.conversion_gate_records} conversion-gate records, found ${conversionGatesExport.count}.`,
);
check(
  conversionGatesExport.records.every((record) =>
    record.gate_id && record.file_id && record.latest_event_id && record.gate_mode &&
    (record.next_check_date || record.reopening_trigger) && record.schedule_band &&
    record.exact_next_artifact && record.stop_rule && record.receipt_state && record.canonical_briefing_id
  ),
  "Conversion-gate export contains an unbounded or precompleted gate.",
);
check(
  conversionGatesExport.records.filter((record) => record.gate_mode === "Dated Check").length === 4 &&
  conversionGatesExport.records.filter((record) => record.gate_mode === "Source Trigger").length === 4,
  "Conversion-gate export must preserve four dated checks and four source-explicit triggers.",
);
check(
  conversionStageMatrixExport.count === manifest.expected_build.conversion_stage_cells,
  `Expected ${manifest.expected_build.conversion_stage_cells} conversion-stage cells, found ${conversionStageMatrixExport.count}.`,
);
check(
  conversionStageMatrixExport.records.every((record) =>
    record.file_id && record.gate_id && record.current_boundary && record.next_decisive_stage_id &&
    record.stage_id && ["Evidence Present", "Partial / Held", "Not Established"].includes(record.cell_state) && record.basis
  ),
  "Conversion-stage export contains an unresolved or unsupported cell.",
);
check(
  conversionStageMatrixExport.records.filter((record) => record.cell_state === "Evidence Present").length === 16 &&
  conversionStageMatrixExport.records.filter((record) => record.cell_state === "Partial / Held").length === 8 &&
  conversionStageMatrixExport.records.filter((record) => record.cell_state === "Not Established").length === 40,
  "Conversion-stage export does not preserve the verified 16/8/40 cell distribution.",
);
check(
  conversionStageMatrixExport.records.filter((record) => record.stage_id === "64-STAGE-08-OUTCOME").every((record) => record.cell_state === "Not Established"),
  "Conversion-stage export advances a comparable-outcome cell without evidence.",
);
check(
  qualificationPacketsExport.count === manifest.expected_build.qualification_packets,
  `Expected ${manifest.expected_build.qualification_packets} qualification packets, found ${qualificationPacketsExport.count}.`,
);
check(
  qualificationPacketsExport.records.every((record) =>
    record.packet_id && record.path && record.file_id && record.stage_id && record.phase64_stage_id &&
    record.current_decision_state && record.packet_state && record.claim_question && record.exact_qualifying_artifact &&
    record.recognized_authorities?.length && record.admissible_artifact_types?.length && record.entity_scope &&
    record.temporal_requirement && record.method_requirement && record.denominator_requirement &&
    record.exception_requirement && record.recurrence_requirement && record.disqualifiers?.length === 4 &&
    record.required_propagation?.length && record.receipt_id === null && record.decision_date === null &&
    record.phase64_cell_change === "none"
  ),
  "Qualification-packet export contains an incomplete contract, invented receipt, or matrix change.",
);
check(
  qualificationPacketsExport.records.filter((record) => record.packet_state === "Continuity Monitoring").length === 1 &&
  qualificationPacketsExport.records.filter((record) => record.packet_state === "Awaiting Completion Artifact").length === 4 &&
  qualificationPacketsExport.records.filter((record) => record.packet_state === "Awaiting Qualifying Artifact").length === 27,
  "Qualification-packet export does not preserve the verified 1/4/27 downstream distribution.",
);
check(
  evidenceReturnEnvelopesExport.count === manifest.expected_build.evidence_return_envelopes,
  `Expected ${manifest.expected_build.evidence_return_envelopes} evidence-return envelopes, found ${evidenceReturnEnvelopesExport.count}.`,
);
check(
  evidenceReturnEnvelopesExport.records.every((record) =>
    record.envelope_id && record.path && record.cycle_item_id && record.wave && record.target &&
    record.scheduled_check_date && record.exact_next_artifact && record.source_ids?.length &&
    record.underlying_signal_id && record.binding_decision && (
      (record.envelope_state === "Scheduled" && record.decision_status === "scheduled" && record.attempted_surfaces?.length === 0 &&
        record.access_result === null && record.receipt_type === null && record.receipt_id === null &&
        record.decision_date === null && record.propagation_status === "not_started" && record.next_check_date === null) ||
      (record.envelope_state === "Release Verified" && record.decision_status !== "scheduled" && record.attempted_surfaces?.length > 0 &&
        record.access_result && record.receipt_type && record.receipt_id && record.decision_date &&
        record.propagation_status === "complete" && record.next_check_date)
    )
  ) &&
  evidenceReturnEnvelopesExport.records.filter((record) => record.envelope_state === "Release Verified").length === 2 &&
  evidenceReturnEnvelopesExport.records.filter((record) => record.envelope_state === "Scheduled").length === 11,
  "Evidence-return export must contain two release-verified Wave 60B envelopes and eleven untouched future envelopes.",
);
check(
  evidenceReturnEnvelopesExport.records.filter((record) => record.named_file_ids.length > 0).length === 3 &&
  evidenceReturnEnvelopesExport.records.filter((record) => record.named_file_ids.length === 0).length === 10,
  "Evidence-return export does not preserve three named-file bindings and ten no-transfer decisions.",
);
check(
  researchExport.count === manifest.expected_build.research_export_records,
  `Expected ${manifest.expected_build.research_export_records} research export records, found ${researchExport.count}.`,
);
check(
  pathwaysExport.count === manifest.expected_build.published_reader_pathways,
  `Expected ${manifest.expected_build.published_reader_pathways} pathway export records, found ${pathwaysExport.count}.`,
);
check(signals.records.every((record) => record.record_status === "Published"), "Signal export contains a non-Published record.");
check(
  pathwaysExport.records.every((record) => record.record_status === "Published"),
  "Pathway export contains a non-Published record.",
);
check(
  researchExport.records.every((record) => record.record_status === "Published"),
  "Research export contains a non-Published record.",
);
check(!JSON.stringify(signals).includes('"editorial_notes"'), "Signal export leaked editorial_notes.");
check(!JSON.stringify(sources).includes('"automation_notes"') && !JSON.stringify(sources).includes('"notes"'), "Source export leaked private notes.");
check(!publicBuildText.includes("candidate-source-"), "Public build leaked a private source-candidate ID.");
check(!publicBuildText.includes("private-data/source-candidates"), "Public build references the private candidate registry path.");

const phase55WSignals = phase55WReview.signal_decisions;
const phase55WSignalIds = [
  ...phase55WSignals.promoted,
  ...phase55WSignals.held,
  ...phase55WSignals.published_controls_confirmed,
];
check(phase55WSignals.reviewed === 45, `Expected 45 Phase 55W signal decisions, found ${phase55WSignals.reviewed}.`);
check(phase55WSignals.promoted.length === 12, `Expected 12 Phase 55W promotions, found ${phase55WSignals.promoted.length}.`);
check(phase55WSignals.held.length === 27, `Expected 27 Phase 55W holds, found ${phase55WSignals.held.length}.`);
check(
  phase55WSignals.published_controls_confirmed.length === 6,
  `Expected six Phase 55W Published controls, found ${phase55WSignals.published_controls_confirmed.length}.`,
);
check(new Set(phase55WSignalIds).size === 45, "Phase 55W signal decision IDs must be unique.");
for (const id of phase55WSignals.promoted) {
  check(signalStatusById.get(id) === "Published", `Phase 55W promoted signal ${id} is not Published.`);
}
for (const id of phase55WSignals.held) {
  const laterPromotions = new Set([
    "signal-toronto-24-254930-community-council-recommendation",
    "signal-darpa-lift-challenge-2026-scheduled-field-trial"
  ]);
  const expectedStatus = laterPromotions.has(id) ? "Published" : "In Review";
  check(signalStatusById.get(id) === expectedStatus, `Phase 55W held signal ${id} has the wrong current status.`);
}
for (const id of phase55WSignals.published_controls_confirmed) {
  check(signalStatusById.get(id) === "Published", `Phase 55W control signal ${id} is not Published.`);
}

const phase55WSynthesis = phase55WReview.synthesis_decisions;
const phase65BriefingDispositions = new Map([
  ["briefing-local-watch-001-conversion-gates", "Archived"],
  ["briefing-local-watch-002-corridor-conversion-gates", "Archived"],
  ["briefing-research-watch-002-local-implementation-dossiers", "Archived"],
  ["briefing-stack-watch-001", "Archived"],
  ["briefing-stack-watch-002-federal-research-industrial-capacity", "Published"],
  ["briefing-stack-watch-005-industrial-capacity-local-conversion", "Published"],
  ["briefing-stack-watch-006-thin-topic-conversion", "Archived"],
]);
for (const id of phase55WSynthesis.published_briefings) {
  check(briefingStatusById.get(id) === "Published", `Phase 55W Published briefing ${id} has the wrong status.`);
}
for (const id of phase55WSynthesis.held_briefings) {
  const expectedStatus = phase65BriefingDispositions.get(id) ?? "In Review";
  check(briefingStatusById.get(id) === expectedStatus, `Phase 55W held briefing ${id} has the wrong current status after Phase 65 disposition.`);
}
for (const id of phase55WSynthesis.published_dependency_maps) {
  check(dependencyMapStatusById.get(id) === "Published", `Phase 55W Published dependency map ${id} has the wrong status.`);
}
for (const id of phase55WSynthesis.held_dependency_maps) {
  const expectedStatus = id === "dependency-map-autonomy-rules-are-not-service" ? "Published" : "In Review";
  check(dependencyMapStatusById.get(id) === expectedStatus, `Phase 55W held dependency map ${id} has the wrong current status.`);
}

const researchDocumentById = new Map(researchDocuments.map((document) => [document.id, document]));
const readerPathwayById = new Map(readerPathways.map((pathway) => [pathway.id, pathway]));
const phase55XSignals = phase55XReview.signal_decisions;
const phase55XResearch = phase55XReview.research_decisions;
const phase55XSynthesis = phase55XReview.synthesis_decisions;
const phase55XSignalIds = [...phase55XSignals.published, ...phase55XSignals.held];
check(phase55XSignals.reviewed === 12, `Expected 12 Phase 55X signal decisions, found ${phase55XSignals.reviewed}.`);
check(phase55XSignals.published.length === 8, `Expected eight Phase 55X Published signals, found ${phase55XSignals.published.length}.`);
check(phase55XSignals.held.length === 4, `Expected four Phase 55X held signals, found ${phase55XSignals.held.length}.`);
check(new Set(phase55XSignalIds).size === 12, "Phase 55X signal decision IDs must be unique.");
for (const id of phase55XSignals.published) {
  check(signalStatusById.get(id) === "Published", `Phase 55X Published signal ${id} has the wrong status.`);
}
for (const id of phase55XSignals.held) {
  check(signalStatusById.get(id) === "In Review", `Phase 55X held signal ${id} has the wrong status.`);
}
const phase55XCollection = researchCollections.find(
  (collection) => collection.id === phase55XResearch.collection_id,
);
check(Boolean(phase55XCollection), "Phase 55X local implementation research collection is missing.");
check(phase55XResearch.documents_reviewed === 24, `Expected 24 Phase 55X research decisions, found ${phase55XResearch.documents_reviewed}.`);
if (phase55XCollection) {
  check(phase55XCollection.document_ids.length === 24, `Expected 24 Phase 55X documents, found ${phase55XCollection.document_ids.length}.`);
  const phase55XDocuments = phase55XCollection.document_ids
    .map((documentId) => researchDocumentById.get(documentId))
    .filter(Boolean);
  check(
    phase55XDocuments.filter((document) => document.record_status === "Published").length === 22,
    "Phase 55X must contain twenty-two Published research documents.",
  );
  check(
    phase55XDocuments.filter((document) => document.record_status === "In Review").length === 2,
    "Phase 55X must contain two held research documents.",
  );
  check(
    phase55XDocuments.every((document) => document.capture_status === "Official link record"),
    "Phase 55X research documents must use the declared official-link capture contract.",
  );
}
for (const id of phase55XResearch.held_documents) {
  check(researchDocumentById.get(id)?.record_status === "In Review", `Phase 55X held research document ${id} has the wrong status.`);
}
for (const id of phase55XSynthesis.held_briefings) {
  const expectedStatus = phase65BriefingDispositions.get(id) ?? "In Review";
  check(briefingStatusById.get(id) === expectedStatus, `Phase 55X held briefing ${id} has the wrong current status after Phase 65 disposition.`);
}
for (const id of phase55XSynthesis.pathways_remaining_in_review) {
  check(readerPathwayById.get(id)?.record_status === "In Review", `Phase 55X pathway ${id} should remain In Review.`);
}

const phase55YSignals = phase55YReview.signal_decisions;
const phase55YSignalIds = [...phase55YSignals.promoted, ...phase55YSignals.held];
check(phase55YReview.journey_count === 4, `Expected four Phase 55Y journeys, found ${phase55YReview.journey_count}.`);
check(phase55YReview.primary_record_count === 24, `Expected 24 Phase 55Y primary records, found ${phase55YReview.primary_record_count}.`);
check(phase55YSignals.reviewed === 12, `Expected 12 Phase 55Y signal decisions, found ${phase55YSignals.reviewed}.`);
check(phase55YSignals.promoted.length === 8, `Expected eight Phase 55Y Published signals, found ${phase55YSignals.promoted.length}.`);
check(phase55YSignals.held.length === 4, `Expected four Phase 55Y held signals, found ${phase55YSignals.held.length}.`);
check(new Set(phase55YSignalIds).size === 12, "Phase 55Y signal decision IDs must be unique.");
for (const id of phase55YSignals.promoted) {
  check(signalStatusById.get(id) === "Published", `Phase 55Y Published signal ${id} has the wrong status.`);
}
for (const id of phase55YSignals.held) {
  check(signalStatusById.get(id) === "In Review", `Phase 55Y held signal ${id} has the wrong status.`);
}
const phase55YCollection = researchCollections.find(
  (collection) => collection.id === "research-collection-operational-evidence-receiving-systems-2024-2026",
);
check(Boolean(phase55YCollection), "Phase 55Y operational-evidence research collection is missing.");
if (phase55YCollection) {
  check(phase55YCollection.document_ids.length === 24, `Expected 24 Phase 55Y documents, found ${phase55YCollection.document_ids.length}.`);
  const phase55YDocuments = phase55YCollection.document_ids
    .map((documentId) => researchDocumentById.get(documentId))
    .filter(Boolean);
  check(phase55YDocuments.length === 24, `Expected all 24 Phase 55Y documents to resolve, found ${phase55YDocuments.length}.`);
  check(
    phase55YDocuments.filter((document) => document.record_status === "Published").length === 20,
    "Phase 55Y must contain twenty Published research documents.",
  );
  check(
    phase55YDocuments.filter((document) => document.record_status === "In Review").length === 4,
    "Phase 55Y must contain four held research documents.",
  );
  check(
    phase55YDocuments.every((document) => document.capture_status === "Official link record"),
    "Phase 55Y research documents must use the declared official-link capture contract.",
  );
}
check(
  readerPathwayById.get("reader-pathway-autonomy-regulation-to-service")?.record_status === "Published",
  "Phase 55Y autonomy pathway should be Published.",
);
check(
  dependencyMapStatusById.get("dependency-map-autonomy-rules-are-not-service") === "Published",
  "Phase 55Y autonomy dependency map should be Published.",
);

const phase55ZSignals = phase55ZReview.signal_decisions;
const phase55ZSignalIds = [...phase55ZSignals.promoted, ...phase55ZSignals.held];
const phase55ZDocuments = phase55ZReview.document_decisions;
const phase55ZDocumentIds = [...phase55ZDocuments.published, ...phase55ZDocuments.held];
check(phase55ZReview.portfolio_count === 4, `Expected four Phase 55Z portfolios, found ${phase55ZReview.portfolio_count}.`);
check(phase55ZReview.primary_record_count === 32, `Expected 32 Phase 55Z primary records, found ${phase55ZReview.primary_record_count}.`);
check(phase55ZSignals.reviewed === 16, `Expected 16 Phase 55Z signal decisions, found ${phase55ZSignals.reviewed}.`);
check(phase55ZSignals.promoted.length === 12, `Expected twelve Phase 55Z Published signals, found ${phase55ZSignals.promoted.length}.`);
check(phase55ZSignals.held.length === 4, `Expected four Phase 55Z held signals, found ${phase55ZSignals.held.length}.`);
check(new Set(phase55ZSignalIds).size === 16, "Phase 55Z signal decision IDs must be unique.");
for (const id of phase55ZSignals.promoted) {
  check(signalStatusById.get(id) === "Published", `Phase 55Z Published signal ${id} has the wrong status.`);
}
for (const id of phase55ZSignals.held) {
  const expectedStatus = id === "signal-darpa-lift-challenge-2026-scheduled-field-trial" ? "Published" : "In Review";
  check(signalStatusById.get(id) === expectedStatus, `Phase 55Z held signal ${id} has the wrong current status.`);
}
check(phase55ZDocuments.reviewed === 32, `Expected 32 Phase 55Z document decisions, found ${phase55ZDocuments.reviewed}.`);
check(phase55ZDocuments.published.length === 28, `Expected 28 Phase 55Z Published documents, found ${phase55ZDocuments.published.length}.`);
check(phase55ZDocuments.held.length === 4, `Expected four Phase 55Z held documents, found ${phase55ZDocuments.held.length}.`);
check(new Set(phase55ZDocumentIds).size === 32, "Phase 55Z document decision IDs must be unique.");
const phase55ZCollection = researchCollections.find(
  (collection) => collection.id === "research-collection-comparative-operating-outcomes-2023-2026",
);
check(Boolean(phase55ZCollection), "Phase 55Z comparative operating-outcomes research collection is missing.");
if (phase55ZCollection) {
  check(phase55ZCollection.document_ids.length === 32, `Expected 32 Phase 55Z documents, found ${phase55ZCollection.document_ids.length}.`);
  const resolvedPhase55ZDocuments = phase55ZCollection.document_ids
    .map((documentId) => researchDocumentById.get(documentId))
    .filter(Boolean);
  check(resolvedPhase55ZDocuments.length === 32, `Expected all 32 Phase 55Z documents to resolve, found ${resolvedPhase55ZDocuments.length}.`);
  check(
    resolvedPhase55ZDocuments.filter((document) => document.record_status === "Published").length === 28,
    "Phase 55Z must contain 28 Published research documents.",
  );
  check(
    resolvedPhase55ZDocuments.filter((document) => document.record_status === "In Review").length === 4,
    "Phase 55Z must contain four held research documents.",
  );
  check(
    resolvedPhase55ZDocuments.every((document) => document.capture_status === "Official link record"),
    "Phase 55Z research documents must use the declared official-link capture contract.",
  );
}
check(
  briefingStatusById.get("briefing-research-watch-004-comparative-operating-outcomes") === "Published",
  "Phase 55Z comparative operating-outcomes briefing should be Published.",
);
check(
  dependencyMapStatusById.get("dependency-map-comparative-outcomes-require-common-denominators") === "Published",
  "Phase 55Z comparison-protocol dependency map should be Published.",
);

const phase56ASignals = phase56AReview.signal_decisions;
const phase56ASignalIds = [...phase56ASignals.promoted, ...phase56ASignals.held];
const phase56ADocuments = phase56AReview.document_decisions;
const phase56ADocumentIds = [...phase56ADocuments.published, ...phase56ADocuments.held];
check(phase56AReview.portfolio_count === 4, `Expected four Phase 56A portfolios, found ${phase56AReview.portfolio_count}.`);
check(phase56AReview.series_count === 16, `Expected sixteen Phase 56A series, found ${phase56AReview.series_count}.`);
check(phase56AReview.primary_record_count === 48, `Expected 48 Phase 56A primary records, found ${phase56AReview.primary_record_count}.`);
check(phase56ASignals.reviewed === 20, `Expected 20 Phase 56A signal decisions, found ${phase56ASignals.reviewed}.`);
check(phase56ASignals.promoted.length === 16, `Expected sixteen Phase 56A Published signals, found ${phase56ASignals.promoted.length}.`);
check(phase56ASignals.held.length === 4, `Expected four Phase 56A held signals, found ${phase56ASignals.held.length}.`);
check(new Set(phase56ASignalIds).size === 20, "Phase 56A signal decision IDs must be unique.");
for (const id of phase56ASignals.promoted) {
  check(signalStatusById.get(id) === "Published", `Phase 56A Published signal ${id} has the wrong status.`);
}
for (const id of phase56ASignals.held) {
  check(signalStatusById.get(id) === "In Review", `Phase 56A held signal ${id} has the wrong status.`);
}
check(phase56ADocuments.reviewed === 48, `Expected 48 Phase 56A document decisions, found ${phase56ADocuments.reviewed}.`);
check(phase56ADocuments.published.length === 44, `Expected 44 Phase 56A Published documents, found ${phase56ADocuments.published.length}.`);
check(phase56ADocuments.held.length === 4, `Expected four Phase 56A held documents, found ${phase56ADocuments.held.length}.`);
check(new Set(phase56ADocumentIds).size === 48, "Phase 56A document decision IDs must be unique.");
check(
  Object.keys(phase56AReview.series_records).length === 16 &&
    Object.values(phase56AReview.series_records).every((recordIds) => recordIds.length === 3),
  "Phase 56A must contain sixteen three-observation series.",
);
const phase56ACollection = researchCollections.find(
  (collection) => collection.id === "research-collection-longitudinal-operating-series-2020-2025",
);
check(Boolean(phase56ACollection), "Phase 56A longitudinal operating-series research collection is missing.");
if (phase56ACollection) {
  check(phase56ACollection.document_ids.length === 48, `Expected 48 Phase 56A documents, found ${phase56ACollection.document_ids.length}.`);
  const resolvedPhase56ADocuments = phase56ACollection.document_ids
    .map((documentId) => researchDocumentById.get(documentId))
    .filter(Boolean);
  check(resolvedPhase56ADocuments.length === 48, `Expected all 48 Phase 56A documents to resolve, found ${resolvedPhase56ADocuments.length}.`);
  check(
    resolvedPhase56ADocuments.filter((document) => document.record_status === "Published").length === 44,
    "Phase 56A must contain 44 Published research documents.",
  );
  check(
    resolvedPhase56ADocuments.filter((document) => document.record_status === "In Review").length === 4,
    "Phase 56A must contain four held research documents.",
  );
  check(
    resolvedPhase56ADocuments.every((document) => document.capture_status === "Official link record"),
    "Phase 56A research documents must use the declared official-link capture contract.",
  );
}
check(
  briefingStatusById.get("briefing-research-watch-005-longitudinal-operating-series") === "Published",
  "Phase 56A longitudinal operating-series briefing should be Published.",
);
check(
  phase56AReview.longitudinal_rule.includes("At least two compatible time points"),
  "Phase 56A publication review is missing the two-compatible-time-point rule.",
);
check(
  phase56AReview.comparison_rule.includes("No cross-domain comparison or ranking"),
  "Phase 56A publication review is missing the cross-domain comparison stop rule.",
);

const phase56BSignals = phase56BReview.signal_decisions;
const phase56BSignalIds = [...phase56BSignals.promoted, ...phase56BSignals.held];
const phase56BDocuments = phase56BReview.document_decisions;
check(phase56BReview.portfolio_count === 4, `Expected four Phase 56B portfolios, found ${phase56BReview.portfolio_count}.`);
check(phase56BReview.panel_count === 12, `Expected twelve Phase 56B panels, found ${phase56BReview.panel_count}.`);
check(phase56BReview.primary_record_count === 17, `Expected 17 Phase 56B primary records, found ${phase56BReview.primary_record_count}.`);
check(phase56BSignals.reviewed === 16, `Expected sixteen Phase 56B signal decisions, found ${phase56BSignals.reviewed}.`);
check(phase56BSignals.promoted.length === 12, `Expected twelve Phase 56B Published signals, found ${phase56BSignals.promoted.length}.`);
check(phase56BSignals.held.length === 4, `Expected four Phase 56B held signals, found ${phase56BSignals.held.length}.`);
check(new Set(phase56BSignalIds).size === 16, "Phase 56B signal decision IDs must be unique.");
for (const id of phase56BSignals.promoted) {
  check(signalStatusById.get(id) === "Published", `Phase 56B Published signal ${id} has the wrong status.`);
}
for (const id of phase56BSignals.held) {
  check(signalStatusById.get(id) === "In Review", `Phase 56B held signal ${id} has the wrong status.`);
}
check(phase56BDocuments.reviewed === 17, `Expected 17 Phase 56B document decisions, found ${phase56BDocuments.reviewed}.`);
check(phase56BDocuments.published.length === 17, `Expected 17 Phase 56B Published documents, found ${phase56BDocuments.published.length}.`);
check(phase56BDocuments.held.length === 0, `Expected no Phase 56B held documents, found ${phase56BDocuments.held.length}.`);
check(phase56BPanels.panel_count === 12 && phase56BPanels.panels.length === 12, "Phase 56B entity-panel ledger must contain twelve panels.");
check(
  new Set(phase56BPanels.panels.map((panel) => panel.entity_id)).size === 12,
  "Phase 56B Published panels must have twelve unique stable entity IDs.",
);
for (const panel of phase56BPanels.panels) {
  check(panel.record_status === "Published", `Phase 56B panel ${panel.panel_id} should be Published.`);
  check(panel.observations.length >= 2, `Phase 56B panel ${panel.panel_id} needs at least two observations.`);
  check(
    [
      panel.entity_id,
      panel.indicator,
      panel.unit,
      panel.denominator,
      panel.period,
      panel.geography,
      panel.method,
      panel.attribution,
      panel.comparison_boundary,
    ].every(Boolean),
    `Phase 56B panel ${panel.panel_id} is missing a measurement-contract field.`,
  );
  check(
    panel.observations.every((observation) => observation.period && observation.label && observation.source_id),
    `Phase 56B panel ${panel.panel_id} has an incomplete observation.`,
  );
  check(
    panel.reporting_breaks.length > 0 && panel.missing_data.length > 0 && panel.merger_exit_notes.length > 0,
    `Phase 56B panel ${panel.panel_id} must preserve breaks, missing data, and identity-change handling.`,
  );
}
check(
  Object.keys(phase56BReview.portfolio_panels).length === 4
    && Object.values(phase56BReview.portfolio_panels).every((panelIds) => panelIds.length === 3),
  "Phase 56B must contain three named panels in each of four portfolios.",
);
const phase56BCollection = researchCollections.find(
  (collection) => collection.id === "research-collection-entity-operating-panels-2021-2026",
);
check(Boolean(phase56BCollection), "Phase 56B entity operating-panel research collection is missing.");
if (phase56BCollection) {
  check(phase56BCollection.document_ids.length === 17, `Expected 17 Phase 56B documents, found ${phase56BCollection.document_ids.length}.`);
  const resolvedPhase56BDocuments = phase56BCollection.document_ids
    .map((documentId) => researchDocumentById.get(documentId))
    .filter(Boolean);
  check(resolvedPhase56BDocuments.length === 17, `Expected all 17 Phase 56B documents to resolve, found ${resolvedPhase56BDocuments.length}.`);
  check(
    resolvedPhase56BDocuments.every((document) => document.record_status === "Published"),
    "All Phase 56B research documents should be Published.",
  );
  check(
    resolvedPhase56BDocuments.every((document) => document.capture_status === "Official link record"),
    "Phase 56B research documents must use the declared official-link capture contract.",
  );
}
check(
  briefingStatusById.get("briefing-research-watch-006-entity-operating-panels") === "Published",
  "Phase 56B entity operating-panel briefing should be Published.",
);
check(
  phase56BReview.entity_rule.includes("stable entity ID") && phase56BReview.entity_rule.includes("at least two compatible observations"),
  "Phase 56B publication review is missing the entity-panel publication rule.",
);
check(
  phase56BReview.context_rule.includes("National context and entity performance remain separate"),
  "Phase 56B publication review is missing the national-context boundary.",
);
check(
  phase56BReview.comparison_rule.includes("No cross-entity ranking"),
  "Phase 56B publication review is missing the cross-entity ranking stop rule.",
);

const phase56CSignals = phase56CReview.signal_decisions;
const phase56CSignalIds = [...phase56CSignals.promoted, ...phase56CSignals.held];
check(phase56CReview.source_count === 20, `Expected 20 Phase 56C source profiles, found ${phase56CReview.source_count}.`);
check(phase56CReview.document_count === 24, `Expected 24 Phase 56C documents, found ${phase56CReview.document_count}.`);
check(phase56CReview.dossier_count === 12, `Expected twelve Phase 56C dossiers, found ${phase56CReview.dossier_count}.`);
check(phase56CSignals.reviewed === 16, `Expected sixteen Phase 56C signal decisions, found ${phase56CSignals.reviewed}.`);
check(phase56CSignals.promoted.length === 12, `Expected twelve Phase 56C Published signals, found ${phase56CSignals.promoted.length}.`);
check(phase56CSignals.held.length === 4, `Expected four Phase 56C held signals, found ${phase56CSignals.held.length}.`);
check(new Set(phase56CSignalIds).size === 16, "Phase 56C signal decision IDs must be unique.");
for (const id of phase56CSignals.promoted) {
  check(signalStatusById.get(id) === "Published", `Phase 56C Published signal ${id} has the wrong status.`);
}
for (const id of phase56CSignals.held) {
  check(signalStatusById.get(id) === "In Review", `Phase 56C held signal ${id} has the wrong status.`);
}
check(
  phase56CDossiers.dossier_count === 12 && phase56CDossiers.dossiers.length === 12,
  "Phase 56C entity-dossier ledger must contain twelve dossiers.",
);
check(
  new Set(phase56CDossiers.dossiers.map((dossier) => dossier.entity_id)).size === 12,
  "Phase 56C Published dossiers must preserve twelve unique stable entity IDs.",
);
for (const dossier of phase56CDossiers.dossiers) {
  check(dossier.record_status === "Published", `Phase 56C dossier ${dossier.dossier_id} should be Published.`);
  check(dossier.temporal_order.length === 4, `Phase 56C dossier ${dossier.dossier_id} must have four temporal stages.`);
  check(
    dossier.temporal_order.map((record) => record.stage).join("|")
      === "Baseline condition|Named intervention or input|Constraint|Observed outcome or later boundary",
    `Phase 56C dossier ${dossier.dossier_id} has an invalid temporal order.`,
  );
  check(
    [
      dossier.parent_panel_id,
      dossier.parent_signal_id,
      dossier.entity_id,
      dossier.attribution,
      dossier.independent_validation,
      dossier.causal_boundary,
    ].every(Boolean),
    `Phase 56C dossier ${dossier.dossier_id} is missing an attribution or entity-contract field.`,
  );
  check(
    dossier.alternative_explanations.length > 0 && dossier.next_records.length > 0 && dossier.source_ids.length > 0,
    `Phase 56C dossier ${dossier.dossier_id} must preserve alternative explanations and next records.`,
  );
  check(
    dossier.causal_boundary.includes("does not establish causation"),
    `Phase 56C dossier ${dossier.dossier_id} is missing the causal-inference hold.`,
  );
}
const phase56CCollection = researchCollections.find(
  (collection) => collection.id === "research-collection-entity-driver-constraint-dossiers-2021-2026",
);
check(Boolean(phase56CCollection), "Phase 56C entity driver and constraint research collection is missing.");
if (phase56CCollection) {
  check(phase56CCollection.document_ids.length === 24, `Expected 24 Phase 56C documents, found ${phase56CCollection.document_ids.length}.`);
  const resolvedPhase56CDocuments = phase56CCollection.document_ids
    .map((documentId) => researchDocumentById.get(documentId))
    .filter(Boolean);
  check(resolvedPhase56CDocuments.length === 24, `Expected all 24 Phase 56C documents to resolve, found ${resolvedPhase56CDocuments.length}.`);
  check(
    resolvedPhase56CDocuments.every((document) => document.record_status === "Published"),
    "All Phase 56C research documents should be Published.",
  );
  check(
    resolvedPhase56CDocuments.every((document) => document.capture_status === "Official link record"),
    "Phase 56C research documents must use the declared official-link capture contract.",
  );
}
check(
  briefingStatusById.get("briefing-research-watch-007-entity-driver-constraint-dossiers") === "Published",
  "Phase 56C entity driver and constraint briefing should be Published.",
);
check(
  phase56CReview.attribution_rule.includes("who made the claim"),
  "Phase 56C publication review is missing the attribution rule.",
);
check(
  phase56CReview.temporal_rule.includes("without converting sequence into proof"),
  "Phase 56C publication review is missing the temporal-order stop rule.",
);
check(
  phase56CReview.comparison_rule.includes("No ranking, composite score, readiness score"),
  "Phase 56C publication review is missing the comparison and scoring stop rule.",
);

const phase56DSignals = phase56DReview.signal_decisions;
const phase56DSignalIds = [...phase56DSignals.promoted, ...phase56DSignals.held];
check(phase56DReview.source_count === 20, `Expected 20 Phase 56D source profiles, found ${phase56DReview.source_count}.`);
check(phase56DReview.document_count === 24, `Expected 24 Phase 56D documents, found ${phase56DReview.document_count}.`);
check(phase56DReview.entity_test_count === 12, `Expected twelve Phase 56D entity tests, found ${phase56DReview.entity_test_count}.`);
check(phase56DSignals.reviewed === 16, `Expected sixteen Phase 56D signal decisions, found ${phase56DSignals.reviewed}.`);
check(phase56DSignals.promoted.length === 10, `Expected ten Phase 56D Published signals, found ${phase56DSignals.promoted.length}.`);
check(phase56DSignals.held.length === 6, `Expected six Phase 56D held signals, found ${phase56DSignals.held.length}.`);
check(new Set(phase56DSignalIds).size === 16, "Phase 56D signal decision IDs must be unique.");
for (const id of phase56DSignals.promoted) {
  check(signalStatusById.get(id) === "Published", `Phase 56D Published signal ${id} has the wrong status.`);
}
for (const id of phase56DSignals.held) {
  check(signalStatusById.get(id) === "In Review", `Phase 56D held signal ${id} has the wrong status.`);
}
check(
  phase56DTests.test_count === 12 && phase56DTests.tests.length === 12,
  "Phase 56D alternative-explanation ledger must contain twelve entity tests.",
);
check(
  new Set(phase56DTests.tests.map((test) => test.entity_id)).size === 12,
  "Phase 56D tests must preserve twelve unique stable entity IDs.",
);
check(
  phase56DTests.tests.filter((test) => test.record_status === "Published").length === 10
    && phase56DTests.tests.filter((test) => test.record_status === "In Review").length === 2,
  "Phase 56D entity tests must contain ten Published and two In Review records.",
);
for (const test of phase56DTests.tests) {
  check(
    [
      test.parent_dossier_id,
      test.parent_panel_id,
      test.entity_id,
      test.signal_id,
      test.compatibility,
      test.result,
      test.attribution,
      test.validation_status,
      test.causal_boundary,
    ].every(Boolean),
    `Phase 56D test ${test.test_id} is missing a compatibility, attribution, validation, or parent-contract field.`,
  );
  check(
    test.source_ids.length === 2
      && test.tested_alternative_explanations.length > 0
      && test.later_observations.length === 2
      && test.next_records.length > 0,
    `Phase 56D test ${test.test_id} must preserve two records, named alternatives, two observations, and next records.`,
  );
  check(
    test.causal_boundary.includes("does not establish causation"),
    `Phase 56D test ${test.test_id} is missing the causal-inference boundary.`,
  );
}
const phase56DCollection = researchCollections.find(
  (collection) => collection.id === "research-collection-repeat-outcomes-alternative-explanation-tests-2010-2026",
);
check(Boolean(phase56DCollection), "Phase 56D repeat-outcome and alternative-test research collection is missing.");
if (phase56DCollection) {
  check(phase56DCollection.document_ids.length === 24, `Expected 24 Phase 56D documents, found ${phase56DCollection.document_ids.length}.`);
  const resolvedPhase56DDocuments = phase56DCollection.document_ids
    .map((documentId) => researchDocumentById.get(documentId))
    .filter(Boolean);
  check(resolvedPhase56DDocuments.length === 24, `Expected all 24 Phase 56D documents to resolve, found ${resolvedPhase56DDocuments.length}.`);
  check(
    resolvedPhase56DDocuments.every((document) => document.record_status === "Published"),
    "All Phase 56D research documents should be Published.",
  );
  check(
    resolvedPhase56DDocuments.every((document) => document.capture_status === "Official link record"),
    "Phase 56D research documents must use the declared official-link capture contract.",
  );
}
check(
  briefingStatusById.get("briefing-research-watch-008-repeat-outcomes-alternative-tests") === "Published",
  "Phase 56D repeat-outcome and alternative-test briefing should be Published.",
);
check(
  phase56DReview.compatibility_rule.includes("entity, unit, denominator, method, and observation window"),
  "Phase 56D publication review is missing the compatibility rule.",
);
check(
  phase56DReview.alternative_rule.includes("named Phase 56C alternative explanations"),
  "Phase 56D publication review is missing the alternative-explanation rule.",
);
check(
  phase56DReview.closure_rule.includes("Regulator-verified closure"),
  "Phase 56D publication review is missing the closure-attribution rule.",
);
check(
  phase56DReview.comparison_rule.includes("No causal effect, ranking, composite score, readiness score"),
  "Phase 56D publication review is missing the causal, comparison, and scoring stop rule.",
);

const phase56ESignals = phase56EReview.signal_decisions;
const phase56ESignalIds = [...phase56ESignals.promoted, ...phase56ESignals.held];
check(phase56EReview.source_count === 40, `Expected 40 Phase 56E source profiles, found ${phase56EReview.source_count}.`);
check(phase56EReview.document_count === 48, `Expected 48 Phase 56E documents, found ${phase56EReview.document_count}.`);
check(phase56EReview.entity_count === 12, `Expected twelve Phase 56E entities, found ${phase56EReview.entity_count}.`);
check(phase56EReview.vertical_layer_count === 36, `Expected 36 Phase 56E entity layers, found ${phase56EReview.vertical_layer_count}.`);
check(
  phase56EReview.cohort_screen.screened === 12
    && phase56EReview.cohort_screen.retained === 12
    && phase56EReview.cohort_screen.held_for_insufficient_evidence === 0,
  "Phase 56E cohort screen must retain all twelve screened entities with no insufficient-evidence holds.",
);
check(phase56ESignals.reviewed === 40, `Expected 40 Phase 56E signal decisions, found ${phase56ESignals.reviewed}.`);
check(phase56ESignals.promoted.length === 36, `Expected 36 Phase 56E Published signals, found ${phase56ESignals.promoted.length}.`);
check(phase56ESignals.held.length === 4, `Expected four Phase 56E held signals, found ${phase56ESignals.held.length}.`);
check(new Set(phase56ESignalIds).size === 40, "Phase 56E signal decision IDs must be unique.");
for (const id of phase56ESignals.promoted) {
  check(signalStatusById.get(id) === "Published", `Phase 56E Published signal ${id} has the wrong status.`);
}
for (const id of phase56ESignals.held) {
  check(signalStatusById.get(id) === "In Review", `Phase 56E held signal ${id} has the wrong status.`);
}

check(
  phase56EPanels.panel_count === 12 && phase56EPanels.panels.length === 12,
  "Phase 56E panel ledger must contain twelve entity panels.",
);
check(
  phase56EDossiers.dossier_count === 12 && phase56EDossiers.dossiers.length === 12,
  "Phase 56E dossier ledger must contain twelve entity dossiers.",
);
check(
  phase56ETests.test_count === 12 && phase56ETests.tests.length === 12,
  "Phase 56E test ledger must contain twelve alternative-explanation tests.",
);
const phase56EPanelEntityIds = new Set(phase56EPanels.panels.map((panel) => panel.entity_id));
const phase56EDossierEntityIds = new Set(phase56EDossiers.dossiers.map((dossier) => dossier.entity_id));
const phase56ETestEntityIds = new Set(phase56ETests.tests.map((test) => test.entity_id));
check(phase56EPanelEntityIds.size === 12, "Phase 56E panels must preserve twelve unique stable entity IDs.");
check(
  [...phase56EPanelEntityIds].every((id) => phase56EDossierEntityIds.has(id) && phase56ETestEntityIds.has(id)),
  "Every Phase 56E entity must resolve across the panel, dossier, and test ledgers.",
);
for (const panel of phase56EPanels.panels) {
  check(
    [
      panel.panel_id,
      panel.entity_id,
      panel.indicator,
      panel.unit,
      panel.denominator,
      panel.method,
      panel.attribution,
      panel.signal_id,
      panel.comparison_boundary,
    ].every(Boolean),
    `Phase 56E panel ${panel.panel_id} is missing a measurement or publication-contract field.`,
  );
  check(
    panel.source_ids.length >= 3
      && panel.observations.length >= 3
      && panel.reporting_breaks.length > 0
      && panel.next_records.length > 0,
    `Phase 56E panel ${panel.panel_id} is missing source, observation, break, or next-record coverage.`,
  );
}
for (const dossier of phase56EDossiers.dossiers) {
  check(
    [
      dossier.dossier_id,
      dossier.parent_panel_id,
      dossier.entity_id,
      dossier.signal_id,
      dossier.attribution,
      dossier.temporal_boundary,
    ].every(Boolean),
    `Phase 56E dossier ${dossier.dossier_id} is missing its parent, attribution, or temporal boundary.`,
  );
  check(
    dossier.source_ids.length === 4
      && dossier.driver_candidates.length > 0
      && dossier.constraints.length > 0
      && dossier.alternative_explanations.length > 0
      && dossier.next_records.length > 0,
    `Phase 56E dossier ${dossier.dossier_id} is missing its four-record or driver-and-constraint contract.`,
  );
}
for (const test of phase56ETests.tests) {
  check(
    [
      test.test_id,
      test.parent_dossier_id,
      test.parent_panel_id,
      test.entity_id,
      test.signal_id,
      test.compatibility,
      test.result,
      test.attribution,
      test.validation_status,
      test.causal_boundary,
    ].every(Boolean),
    `Phase 56E test ${test.test_id} is missing a compatibility, attribution, validation, or parent-contract field.`,
  );
  check(
    test.source_ids.length === 2
      && test.tested_alternative_explanations.length > 0
      && test.later_observations.length === 2
      && test.next_records.length > 0,
    `Phase 56E test ${test.test_id} must preserve two later records, named alternatives, two observations, and next records.`,
  );
  check(
    test.causal_boundary.includes("do not establish causation"),
    `Phase 56E test ${test.test_id} is missing the causal-inference boundary.`,
  );
}
const phase56ECollection = researchCollections.find(
  (collection) => collection.id === "research-collection-second-entity-cohort-vertical-replication-2018-2026",
);
check(Boolean(phase56ECollection), "Phase 56E second-cohort research collection is missing.");
if (phase56ECollection) {
  check(phase56ECollection.document_ids.length === 48, `Expected 48 Phase 56E documents, found ${phase56ECollection.document_ids.length}.`);
  const resolvedPhase56EDocuments = phase56ECollection.document_ids
    .map((documentId) => researchDocumentById.get(documentId))
    .filter(Boolean);
  check(resolvedPhase56EDocuments.length === 48, `Expected all 48 Phase 56E documents to resolve, found ${resolvedPhase56EDocuments.length}.`);
  check(
    resolvedPhase56EDocuments.every((document) => document.record_status === "Published"),
    "All Phase 56E research documents should be Published.",
  );
  check(
    resolvedPhase56EDocuments.every((document) => document.capture_status === "Official link record"),
    "Phase 56E research documents must use the official-link capture contract.",
  );
}
check(
  briefingStatusById.get("briefing-research-watch-009-second-cohort-vertical-replication") === "Published",
  "Phase 56E second-cohort briefing should be Published.",
);
check(
  phase56EReview.vertical_rule.includes("panel, driver-and-constraint dossier, and alternative-explanation test"),
  "Phase 56E review is missing the vertical-replication rule.",
);
check(
  phase56EReview.attribution_rule.includes("who made the claim"),
  "Phase 56E review is missing the attribution rule.",
);
check(
  phase56EReview.compatibility_rule.includes("Entity, unit, denominator, method, attribution, and observation window"),
  "Phase 56E review is missing the compatibility rule.",
);
check(
  phase56EReview.comparison_rule.includes("No causal effect, ranking, composite score, readiness score"),
  "Phase 56E review is missing the causal, comparison, and scoring stop rule.",
);

const phase56FDecisions = phase56FCoverage.coverage;
const phase56FEntityIds = new Set(phase56FDecisions.map((decision) => decision.entity_id));
const phase56FClosureCounts = phase56FDecisions.reduce(
  (counts, decision) => {
    counts[decision.closure_status] = (counts[decision.closure_status] ?? 0) + 1;
    return counts;
  },
  {},
);
const phase56FPublicationCounts = phase56FDecisions.reduce(
  (counts, decision) => {
    counts[decision.record_status] = (counts[decision.record_status] ?? 0) + 1;
    return counts;
  },
  {},
);
check(
  phase56FCoverage.entity_count === 24 && phase56FDecisions.length === 24 && phase56FEntityIds.size === 24,
  "Phase 56F must contain 24 unique entity coverage decisions.",
);
check(
  phase56FCoverage.cohort_counts.phase_56b === 12
    && phase56FCoverage.cohort_counts.phase_56e === 12
    && phase56FDecisions.filter((decision) => decision.cohort === "56B").length === 12
    && phase56FDecisions.filter((decision) => decision.cohort === "56E").length === 12,
  "Phase 56F must preserve twelve Phase 56B and twelve Phase 56E entities.",
);
check(
  phase56FClosureCounts.Closed === 1
    && phase56FClosureCounts["Partially Closed"] === 16
    && phase56FClosureCounts.Open === 7,
  "Phase 56F closure states must contain one Closed, sixteen Partially Closed, and seven Open decisions.",
);
check(
  phase56FPublicationCounts.Published === 17 && phase56FPublicationCounts["In Review"] === 7,
  "Phase 56F publication states must contain seventeen Published and seven In Review decisions.",
);
for (const decision of phase56FDecisions) {
  check(
    [
      decision.coverage_id,
      decision.entity_id,
      decision.entity_name,
      decision.highest_value_missing_record,
      decision.strongest_current_evidence,
      decision.selected_source_id,
      decision.closure_status,
      decision.record_status,
      decision.decision,
      decision.remaining_gap,
      decision.reopening_rule,
      decision.comparison_boundary,
    ].every(Boolean),
    `Phase 56F coverage decision ${decision.coverage_id} is missing a record, closure, gap, or reopening field.`,
  );
  check(
    ["Closed", "Partially Closed", "Open"].includes(decision.closure_status),
    `Phase 56F coverage decision ${decision.coverage_id} has an invalid closure status.`,
  );
  check(
    ["Published", "In Review"].includes(decision.record_status),
    `Phase 56F coverage decision ${decision.coverage_id} has an invalid publication status.`,
  );
  check(
    decision.comparison_boundary.includes("not entity performance")
      && decision.comparison_boundary.includes("cannot be ranked or scored"),
    `Phase 56F coverage decision ${decision.coverage_id} is missing the performance and scoring boundary.`,
  );
}

const phase56FSignals = phase56FReview.signal_decisions;
check(
  phase56FReview.source_profiles_added === 14 && phase56FReview.entity_count === 24,
  "Phase 56F publication review must record fourteen source profiles and 24 entities.",
);
check(
  phase56FReview.document_decisions.reviewed === 24
    && phase56FReview.document_decisions.promoted.length === 17
    && phase56FReview.document_decisions.held.length === 7,
  "Phase 56F document review must contain seventeen Published and seven held decisions.",
);
check(
  phase56FSignals.reviewed === 5
    && phase56FSignals.promoted.length === 4
    && phase56FSignals.held.length === 1,
  "Phase 56F signal review must contain four Published portfolio signals and one held comparison.",
);
for (const id of phase56FSignals.promoted) {
  check(signalStatusById.get(id) === "Published", `Phase 56F Published signal ${id} has the wrong status.`);
}
for (const id of phase56FSignals.held) {
  check(signalStatusById.get(id) === "In Review", `Phase 56F held signal ${id} has the wrong status.`);
}

const phase56FCollection = researchCollections.find(
  (collection) => collection.id === "research-collection-cross-cohort-coverage-missing-record-closure-2010-2026",
);
check(Boolean(phase56FCollection), "Phase 56F cross-cohort coverage research collection is missing.");
if (phase56FCollection) {
  check(phase56FCollection.document_ids.length === 24, `Expected 24 Phase 56F documents, found ${phase56FCollection.document_ids.length}.`);
  const resolvedPhase56FDocuments = phase56FCollection.document_ids
    .map((documentId) => researchDocumentById.get(documentId))
    .filter(Boolean);
  check(resolvedPhase56FDocuments.length === 24, `Expected all 24 Phase 56F documents to resolve, found ${resolvedPhase56FDocuments.length}.`);
  check(
    resolvedPhase56FDocuments.filter((document) => document.record_status === "Published").length === 17
      && resolvedPhase56FDocuments.filter((document) => document.record_status === "In Review").length === 7,
    "Phase 56F research documents must preserve seventeen Published and seven In Review decisions.",
  );
  check(
    resolvedPhase56FDocuments.every((document) => document.capture_status === "Official link record"),
    "Phase 56F research documents must use the official-link capture contract.",
  );
}
check(
  briefingStatusById.get("briefing-research-watch-010-cross-cohort-coverage") === "Published",
  "Phase 56F cross-cohort coverage briefing should be Published.",
);
check(
  phase56FReview.priority_rule.includes("exactly one highest-value missing"),
  "Phase 56F review is missing the one-record priority rule.",
);
check(
  phase56FReview.comparison_rule.includes("No causal effect, ranking, completeness score, composite score, readiness score"),
  "Phase 56F review is missing the comparison and scoring stop rule.",
);

check(
  phase56GAcquisition.acquisition_count === 7
    && phase56GAcquisition.phase_56f_open_queue_count === 7,
  "Phase 56G acquisition ledger must contain all seven Phase 56F Open rails.",
);
check(
  new Set(phase56GAcquisition.acquisitions.map((entry) => entry.coverage_id)).size === 7
    && new Set(phase56GAcquisition.acquisitions.map((entry) => entry.entity_id)).size === 7,
  "Phase 56G acquisitions must have seven unique coverage IDs and entity IDs.",
);
check(
  phase56GAcquisition.status_changes.open_to_partially_closed === 1
    && phase56GAcquisition.status_changes.unchanged_open === 6,
  "Phase 56G must record one Open-to-Partially-Closed change and six unchanged Open records.",
);
check(
  phase56GAcquisition.current_cross_cohort_closure_counts.closed === 1
    && phase56GAcquisition.current_cross_cohort_closure_counts.partially_closed === 17
    && phase56GAcquisition.current_cross_cohort_closure_counts.open === 6,
  "Phase 56G current cross-cohort closure counts must be one Closed, seventeen Partially Closed, and six Open.",
);
for (const acquisition of phase56GAcquisition.acquisitions) {
  check(
    phase56FCoverage.coverage.some(
      (decision) =>
        decision.coverage_id === acquisition.coverage_id
        && decision.entity_id === acquisition.entity_id
        && decision.reopening_rule === acquisition.phase_56f_reopening_rule,
    ),
    `Phase 56G acquisition ${acquisition.acquisition_id} does not retain its Phase 56F coverage ID, entity, and reopening rule.`,
  );
  check(
    acquisition.checked_date === "2026-07-24"
      && acquisition.checked_source_id
      && acquisition.acquisition_result
      && acquisition.remaining_gap,
    `Phase 56G acquisition ${acquisition.acquisition_id} is missing its dated source check or continuation fields.`,
  );
  check(
    acquisition.comparison_boundary.includes("not entity performance")
      && acquisition.comparison_boundary.includes("no ranking, score, or causal claim"),
    `Phase 56G acquisition ${acquisition.acquisition_id} is missing the performance and inference boundary.`,
  );
}

check(
  phase56GReview.source_profiles_added === 7
    && phase56GReview.acquisition_count === 7,
  "Phase 56G publication review must record seven source profiles and seven acquisitions.",
);
check(
  phase56GReview.document_decisions.reviewed === 7
    && phase56GReview.document_decisions.promoted.length === 1
    && phase56GReview.document_decisions.held.length === 6,
  "Phase 56G document review must contain one Published and six held decisions.",
);
check(
  phase56GReview.signal_decisions.reviewed === 2
    && phase56GReview.signal_decisions.promoted.length === 1
    && phase56GReview.signal_decisions.held.length === 1,
  "Phase 56G signal review must contain one Published signal and one held synthesis.",
);
for (const id of phase56GReview.signal_decisions.promoted) {
  check(signalStatusById.get(id) === "Published", `Phase 56G Published signal ${id} has the wrong status.`);
}
for (const id of phase56GReview.signal_decisions.held) {
  check(signalStatusById.get(id) === "In Review", `Phase 56G held signal ${id} has the wrong status.`);
}

const phase56GCollection = researchCollections.find(
  (collection) => collection.id === "research-collection-operating-record-acquisition-closure-batch-two-2026",
);
check(Boolean(phase56GCollection), "Phase 56G operating-record acquisition collection is missing.");
if (phase56GCollection) {
  check(phase56GCollection.document_ids.length === 7, `Expected seven Phase 56G documents, found ${phase56GCollection.document_ids.length}.`);
  const resolvedPhase56GDocuments = phase56GCollection.document_ids
    .map((documentId) => researchDocumentById.get(documentId))
    .filter(Boolean);
  check(resolvedPhase56GDocuments.length === 7, `Expected all seven Phase 56G documents to resolve, found ${resolvedPhase56GDocuments.length}.`);
  check(
    resolvedPhase56GDocuments.filter((document) => document.record_status === "Published").length === 1
      && resolvedPhase56GDocuments.filter((document) => document.record_status === "In Review").length === 6,
    "Phase 56G research documents must preserve one Published and six In Review decisions.",
  );
  check(
    resolvedPhase56GDocuments.every((document) => document.capture_status === "Official link record"),
    "Phase 56G research documents must use the official-link capture contract.",
  );
}
check(
  briefingStatusById.get("briefing-research-watch-011-operating-record-acquisition") === "Published",
  "Phase 56G operating-record acquisition briefing should be Published.",
);
check(
  phase56GReview.unavailable_record_rule.includes("dated source check")
    && phase56GReview.unavailable_record_rule.includes("not generic replacement context"),
  "Phase 56G review is missing the unavailable-record continuation rule.",
);
check(
  phase56GReview.comparison_rule.includes("No causal effect, ranking, completeness score, composite score, readiness score"),
  "Phase 56G review is missing the comparison and scoring stop rule.",
);

for (const collection of researchCollections) {
  const collectionRoute = `/research/${collection.slug}/`;
  const collectionHtml = await readText(routeToHtml(collectionRoute));
  check(hasCanonical(collectionHtml, `${manifest.canonical_site}${collectionRoute}`), `${collectionRoute} has the wrong canonical URL.`);
  for (const documentId of collection.document_ids) {
    const document = researchDocumentById.get(documentId);
    check(Boolean(document), `${collection.id} references missing research document ${documentId}.`);
    if (document) {
      check(
        collectionHtml.includes(`/research/documents/${document.slug}/`),
        `${collectionRoute} is missing research document route: ${document.slug}.`,
      );
    }
  }
}

const phase55VCollection = researchCollections.find(
  (collection) => collection.id === "research-collection-cross-corridor-infrastructure-conversion-2024-2026",
);
check(Boolean(phase55VCollection), "Phase 55V cross-corridor research collection is missing.");
if (phase55VCollection) {
  const phase55VDocuments = phase55VCollection.document_ids
    .map((documentId) => researchDocumentById.get(documentId))
    .filter(Boolean);
  check(phase55VDocuments.length === 18, `Expected 18 Phase 55V research documents, found ${phase55VDocuments.length}.`);
  check(
    phase55VDocuments.filter((document) => document.capture_status === "Original file captured").length === 4,
    "Phase 55V must contain four captured official files.",
  );
  check(
    phase55VDocuments.filter((document) => document.capture_status === "Official link record").length === 14,
    "Phase 55V must contain fourteen official-link records.",
  );
}

const expectedResearchLocations = [
  ...researchCollections
    .filter((collection) => collection.record_status === "Published")
    .map((collection) => `${manifest.canonical_site}/research/${collection.slug}/`),
  ...researchDocuments
    .filter((document) => document.record_status === "Published")
    .map((document) => `${manifest.canonical_site}/research/documents/${document.slug}/`),
].sort();
const researchLocations = [...sitemap.matchAll(/<loc>(https:\/\/ftfn\.io\/research\/[^<]+)<\/loc>/g)]
  .map((match) => match[1])
  .sort();
check(
  JSON.stringify(researchLocations) === JSON.stringify(expectedResearchLocations),
  "Sitemap research membership does not match the Published research collection.",
);

const signalsIndexHtml = await readText(join(distRoot, "signals", "index.html"));
const researchIndexHtml = await readText(join(distRoot, "research", "index.html"));
const sourceMonitorHtml = await readText(join(distRoot, "atlas", "source-monitor", "index.html"));
const dataIndexHtml = await readText(join(distRoot, "data", "index.html"));
check(
  signalsIndexHtml.includes('data-filter="evidence"')
    && signalsIndexHtml.includes('data-filter="sourceType"')
    && signalsIndexHtml.includes('data-filter="watchLane"'),
  "Signal index is missing Phase 55W evidence, source-type, or watch-lane filters.",
);
check(researchIndexHtml.includes("data-research-filter"), "Research index is missing the Phase 55W document-shelf filter.");
check(sourceMonitorHtml.includes("data-source-filter"), "Source Monitor is missing the Phase 55W corpus filter.");
check(
  dataIndexHtml.includes("/data/research.json") && dataIndexHtml.includes("/data/pathways.json"),
  "Data index is missing the Phase 55W research or pathway export.",
);

for (const requiredPath of manifest.required_output_files) {
  const absolutePath = join(appRoot, requiredPath);
  check(allDistFiles.includes(absolutePath), `Missing required output: ${requiredPath}.`);
}

check(robots.includes("User-agent: *"), "robots.txt is missing the user-agent rule.");
check(robots.includes("Allow: /"), "robots.txt is missing the allow rule.");
check(robots.includes("Sitemap: https://ftfn.io/sitemap.xml"), "robots.txt does not reference the canonical sitemap.");
check(!sitemap.includes("127.0.0.1") && !sitemap.includes("localhost"), "sitemap.xml contains a local URL.");

const signalLocations = [...sitemap.matchAll(/<loc>(https:\/\/ftfn\.io\/signals\/[^<]+)<\/loc>/g)].map((match) => match[1]);
const expectedSignalLocations = manifest.published_signal_routes.map((route) => `${manifest.canonical_site}${route}`).sort();
check(signalLocations.length === expectedSignalLocations.length, `Expected ${expectedSignalLocations.length} signal URLs in the sitemap, found ${signalLocations.length}.`);
check(JSON.stringify(signalLocations.sort()) === JSON.stringify(expectedSignalLocations), "Sitemap signal membership does not match the Published export.");

const publishedSignalIds = new Set(signals.records.map((record) => record.id));
const sourceById = new Map(sources.records.map((record) => [record.id, record]));
const publishedSourceIds = [...new Set(signals.records.flatMap((record) => record.source_ids))];
const publishedSupportMinimumDate =
  manifest.last_verified.published_support_minimum_date ?? manifest.last_verified.date;
check(
  publishedSourceIds.length === manifest.expected_build.published_support_sources,
  `Expected ${manifest.expected_build.published_support_sources} unique Published-support sources, found ${publishedSourceIds.length}.`,
);
for (const sourceId of publishedSourceIds) {
  const source = sourceById.get(sourceId);
  check(Boolean(source), `Published source ${sourceId} is missing from the source export.`);
  check(
    source?.last_checked_date >= publishedSupportMinimumDate,
    `Published source ${sourceId} was not checked on or after ${publishedSupportMinimumDate}.`,
  );
}

for (const record of signals.records) {
  const html = await readText(routeToHtml(record.path));
  check(hasRobots(html, "index, follow"), `${record.path} is missing index, follow.`);
  check(hasCanonical(html, `${manifest.canonical_site}${record.path}`), `${record.path} has the wrong canonical URL.`);
}

for (const [label, route] of Object.entries(manifest.indexing_samples)) {
  const html = await readText(routeToHtml(route));
  const expectedRobots = label.startsWith("published_") ? "index, follow" : "noindex, follow";
  check(hasRobots(html, expectedRobots), `${route} is missing ${expectedRobots}.`);
  check(hasCanonical(html, `${manifest.canonical_site}${route}`), `${route} has the wrong canonical URL.`);
  if (expectedRobots.startsWith("noindex")) {
    check(!sitemap.includes(`${manifest.canonical_site}${route}`), `${route} should not appear in the sitemap.`);
  }
}

const synthesisRouteGroups = [
  {
    label: "briefing",
    published: manifest.published_briefing_routes,
    inReview: manifest.in_review_briefing_routes,
  },
  {
    label: "dependency map",
    published: manifest.published_dependency_map_routes,
    inReview: manifest.in_review_dependency_map_routes,
  },
];

check(
  manifest.published_briefing_routes.length === manifest.expected_build.published_briefings,
  `Expected ${manifest.expected_build.published_briefings} Published briefing routes, found ${manifest.published_briefing_routes.length}.`,
);
check(
  manifest.in_review_briefing_routes.length === manifest.expected_build.in_review_briefings,
  `Expected ${manifest.expected_build.in_review_briefings} In Review briefing routes, found ${manifest.in_review_briefing_routes.length}.`,
);
check(
  manifest.published_dependency_map_routes.length === manifest.expected_build.published_dependency_maps,
  `Expected ${manifest.expected_build.published_dependency_maps} Published dependency-map routes, found ${manifest.published_dependency_map_routes.length}.`,
);
check(
  manifest.in_review_dependency_map_routes.length === manifest.expected_build.in_review_dependency_maps,
  `Expected ${manifest.expected_build.in_review_dependency_maps} In Review dependency-map routes, found ${manifest.in_review_dependency_map_routes.length}.`,
);

for (const group of synthesisRouteGroups) {
  for (const route of group.published) {
    const html = await readText(routeToHtml(route));
    check(hasRobots(html, "index, follow"), `${route} is missing index, follow.`);
    check(hasCanonical(html, `${manifest.canonical_site}${route}`), `${route} has the wrong canonical URL.`);
    check(sitemap.includes(`${manifest.canonical_site}${route}`), `Published ${group.label} ${route} is missing from the sitemap.`);
  }

  for (const route of group.inReview) {
    const html = await readText(routeToHtml(route));
    check(hasRobots(html, "noindex, follow"), `${route} is missing noindex, follow.`);
    check(hasCanonical(html, `${manifest.canonical_site}${route}`), `${route} has the wrong canonical URL.`);
    check(!sitemap.includes(`${manifest.canonical_site}${route}`), `In Review ${group.label} ${route} should not appear in the sitemap.`);
  }
}

check(
  manifest.qualification_packet_routes.length === manifest.expected_build.qualification_packets,
  `Expected ${manifest.expected_build.qualification_packets} qualification-packet routes, found ${manifest.qualification_packet_routes.length}.`,
);
check(
  manifest.evidence_return_envelope_routes.length === manifest.expected_build.evidence_return_envelopes,
  `Expected ${manifest.expected_build.evidence_return_envelopes} evidence-return routes, found ${manifest.evidence_return_envelope_routes.length}.`,
);
for (const route of manifest.qualification_packet_routes) {
  const html = await readText(routeToHtml(route));
  check(hasRobots(html, "index, follow"), `${route} is missing index, follow.`);
  check(hasCanonical(html, `${manifest.canonical_site}${route}`), `${route} has the wrong canonical URL.`);
  check(sitemap.includes(`${manifest.canonical_site}${route}`), `${route} is missing from the sitemap.`);
  check(html.includes("Admission Contract") && html.includes("Decision state") && html.includes("Required propagation"), `${route} lacks its qualification contract sections.`);
}
for (const route of manifest.evidence_return_envelope_routes) {
  const html = await readText(routeToHtml(route));
  check(hasRobots(html, "index, follow"), `${route} is missing index, follow.`);
  check(hasCanonical(html, `${manifest.canonical_site}${route}`), `${route} has the wrong canonical URL.`);
  check(sitemap.includes(`${manifest.canonical_site}${route}`), `${route} is missing from the sitemap.`);
  check(html.includes("Scheduled check") && html.includes("Future-state integrity") && html.includes("A scheduled envelope is not a completed check"), `${route} lacks its future-return boundary sections.`);
}
const qualificationIndexHtml = await readText(routeToHtml("/evidence/qualification/"));
check(qualificationIndexHtml.includes("data-qualification-registry") && qualificationIndexHtml.includes("32 qualification packets") && qualificationIndexHtml.includes("13 return envelopes"), "The qualification index is missing its registry or structural counts.");
check(hasCanonical(qualificationIndexHtml, `${manifest.canonical_site}/evidence/qualification/`), "The qualification index has the wrong canonical URL.");
check(sitemap.includes(`${manifest.canonical_site}/evidence/qualification/`), "The qualification index is missing from the sitemap.");

check(
  manifest.measurement_specification_routes.length === manifest.expected_build.phase_69_measurement_specifications,
  `Expected ${manifest.expected_build.phase_69_measurement_specifications} measurement-specification routes, found ${manifest.measurement_specification_routes.length}.`,
);
for (const route of manifest.measurement_specification_routes) {
  const html = await readText(routeToHtml(route));
  check(hasRobots(html, "index, follow"), `${route} is missing index, follow.`);
  check(hasCanonical(html, `${manifest.canonical_site}${route}`), `${route} has the wrong canonical URL.`);
  check(sitemap.includes(`${manifest.canonical_site}${route}`), `${route} is missing from the sitemap.`);
  check(html.includes("Measurement Specification") && html.includes("Eighteen fields before human review") && html.includes("A specification is not an observation"), `${route} lacks its Phase 69 measurement or zero-value boundary.`);
}
const measurementIndexHtml = await readText(routeToHtml("/evidence/measurements/"));
check(measurementIndexHtml.includes("data-measurement-registry") && measurementIndexHtml.includes("32 specifications") && measurementIndexHtml.includes("32 empty envelopes") && measurementIndexHtml.includes("8 break registers"), "The measurement index is missing its registry or structural counts.");
check(hasCanonical(measurementIndexHtml, `${manifest.canonical_site}/evidence/measurements/`), "The measurement index has the wrong canonical URL.");
check(sitemap.includes(`${manifest.canonical_site}/evidence/measurements/`), "The measurement index is missing from the sitemap.");

check(
  manifest.observation_review_routes.length === manifest.expected_build.phase_70_observation_review_dockets,
  `Expected ${manifest.expected_build.phase_70_observation_review_dockets} observation-review routes, found ${manifest.observation_review_routes.length}.`,
);
for (const route of manifest.observation_review_routes) {
  const html = await readText(routeToHtml(route));
  check(hasRobots(html, "index, follow"), `${route} is missing index, follow.`);
  check(hasCanonical(html, `${manifest.canonical_site}${route}`), `${route} has the wrong canonical URL.`);
  check(sitemap.includes(`${manifest.canonical_site}${route}`), `${route} is missing from the sitemap.`);
  check(html.includes("Observation Review Docket") && html.includes("Twelve decisions remain Not Reviewed") && html.includes("A review docket is not a reviewed observation"), `${route} lacks its Phase 70 review or empty-state boundary.`);
}
check(
  manifest.series_admission_routes.length === manifest.expected_build.phase_70_series_admission_dockets,
  `Expected ${manifest.expected_build.phase_70_series_admission_dockets} series-admission routes, found ${manifest.series_admission_routes.length}.`,
);
for (const route of manifest.series_admission_routes) {
  const html = await readText(routeToHtml(route));
  check(hasRobots(html, "index, follow"), `${route} is missing index, follow.`);
  check(hasCanonical(html, `${manifest.canonical_site}${route}`), `${route} has the wrong canonical URL.`);
  check(sitemap.includes(`${manifest.canonical_site}${route}`), `${route} is missing from the sitemap.`);
  check(html.includes("Series Admission Docket") && html.includes("Eight gates before a compatible series") && html.includes("An identity contract is not an admitted series"), `${route} lacks its Phase 70 admission or no-series boundary.`);
}
const reviewIndexHtml = await readText(routeToHtml("/evidence/review/"));
check(reviewIndexHtml.includes("data-review-registry") && reviewIndexHtml.includes("32 review dockets") && reviewIndexHtml.includes("32 empty lineage registers") && reviewIndexHtml.includes("8 admission dockets"), "The review index is missing its registry or structural counts.");
check(hasCanonical(reviewIndexHtml, `${manifest.canonical_site}/evidence/review/`), "The review index has the wrong canonical URL.");
check(sitemap.includes(`${manifest.canonical_site}/evidence/review/`), "The review index is missing from the sitemap.");

check(
  manifest.longitudinal_panel_routes.length === manifest.expected_build.phase_71_longitudinal_panel_shells,
  `Expected ${manifest.expected_build.phase_71_longitudinal_panel_shells} longitudinal-panel routes, found ${manifest.longitudinal_panel_routes.length}.`,
);
for (const route of manifest.longitudinal_panel_routes) {
  const html = await readText(routeToHtml(route));
  check(hasRobots(html, "index, follow"), `${route} is missing index, follow.`);
  check(hasCanonical(html, `${manifest.canonical_site}${route}`), `${route} has the wrong canonical URL.`);
  check(sitemap.includes(`${manifest.canonical_site}${route}`), `${route} is missing from the sitemap.`);
  check(html.includes("Longitudinal Panel Shell") && html.includes("Exact contracts before any point can appear") && html.includes("A panel shell is not an admitted series or trend"), `${route} lacks its Phase 71 panel or empty-state boundary.`);
}
check(
  manifest.outcome_claim_routes.length === manifest.expected_build.phase_71_outcome_claim_dockets,
  `Expected ${manifest.expected_build.phase_71_outcome_claim_dockets} outcome-claim routes, found ${manifest.outcome_claim_routes.length}.`,
);
for (const route of manifest.outcome_claim_routes) {
  const html = await readText(routeToHtml(route));
  check(hasRobots(html, "index, follow"), `${route} is missing index, follow.`);
  check(hasCanonical(html, `${manifest.canonical_site}${route}`), `${route} has the wrong canonical URL.`);
  check(sitemap.includes(`${manifest.canonical_site}${route}`), `${route} is missing from the sitemap.`);
  check(html.includes("Outcome Claim Docket") && html.includes("Ten outcome gates remain Not Ready") && html.includes("Ten comparison gates remain Not Ready") && html.includes("An outcome docket is not an outcome claim or causal result"), `${route} lacks its Phase 71 outcome or comparison boundary.`);
}
const outcomeIndexHtml = await readText(routeToHtml("/evidence/outcomes/"));
check(outcomeIndexHtml.includes("data-outcome-registry") && outcomeIndexHtml.includes("32 empty panels") && outcomeIndexHtml.includes("8 claim dockets") && outcomeIndexHtml.includes("8 comparison embargoes"), "The outcome index is missing its registry or structural counts.");
check(hasCanonical(outcomeIndexHtml, `${manifest.canonical_site}/evidence/outcomes/`), "The outcome index has the wrong canonical URL.");
check(sitemap.includes(`${manifest.canonical_site}/evidence/outcomes/`), "The outcome index is missing from the sitemap.");

check(
  manifest.outcome_evidence_packet_routes.length === manifest.expected_build.phase_72_outcome_evidence_packets,
  `Expected ${manifest.expected_build.phase_72_outcome_evidence_packets} outcome-evidence packet routes, found ${manifest.outcome_evidence_packet_routes.length}.`,
);
for (const route of manifest.outcome_evidence_packet_routes) {
  const html = await readText(routeToHtml(route));
  check(hasRobots(html, "index, follow"), `${route} is missing index, follow.`);
  check(hasCanonical(html, `${manifest.canonical_site}${route}`), `${route} has the wrong canonical URL.`);
  check(sitemap.includes(`${manifest.canonical_site}${route}`), `${route} is missing from the sitemap.`);
  check(html.includes("Outcome Evidence Packet") && html.includes("Twelve evidence-packet gates remain Not Ready") && html.includes("An evidence-packet contract is not a proposed or published claim"), `${route} lacks its Phase 72 evidence-packet boundary.`);
}
check(
  manifest.counterfactual_design_routes.length === manifest.expected_build.phase_72_counterfactual_design_dockets,
  `Expected ${manifest.expected_build.phase_72_counterfactual_design_dockets} counterfactual-design routes, found ${manifest.counterfactual_design_routes.length}.`,
);
for (const route of manifest.counterfactual_design_routes) {
  const html = await readText(routeToHtml(route));
  check(hasRobots(html, "index, follow"), `${route} is missing index, follow.`);
  check(hasCanonical(html, `${manifest.canonical_site}${route}`), `${route} has the wrong canonical URL.`);
  check(sitemap.includes(`${manifest.canonical_site}${route}`), `${route} is missing from the sitemap.`);
  check(html.includes("Counterfactual Design Docket") && html.includes("Ten categories remain Not Assessed") && html.includes("Twelve design gates remain Inactive") && html.includes("A design-family list is not a registered counterfactual or causal result"), `${route} lacks its Phase 72 design or alternative-explanation boundary.`);
}
const claimsIndexHtml = await readText(routeToHtml("/evidence/claims/"));
check(claimsIndexHtml.includes("data-claim-registry") && claimsIndexHtml.includes("32 empty packets") && claimsIndexHtml.includes("8 alternative registers") && claimsIndexHtml.includes("8 inactive designs"), "The claim index is missing its registry or structural counts.");
check(hasCanonical(claimsIndexHtml, `${manifest.canonical_site}/evidence/claims/`), "The claim index has the wrong canonical URL.");
check(sitemap.includes(`${manifest.canonical_site}/evidence/claims/`), "The claim index is missing from the sitemap.");

check(
  manifest.analysis_execution_routes.length === manifest.expected_build.phase_73_analysis_execution_dockets,
  `Expected ${manifest.expected_build.phase_73_analysis_execution_dockets} analysis-execution routes, found ${manifest.analysis_execution_routes.length}.`,
);
for (const route of manifest.analysis_execution_routes) {
  const html = await readText(routeToHtml(route));
  check(hasRobots(html, "index, follow"), `${route} is missing index, follow.`);
  check(hasCanonical(html, `${manifest.canonical_site}${route}`), `${route} has the wrong canonical URL.`);
  check(sitemap.includes(`${manifest.canonical_site}${route}`), `${route} is missing from the sitemap.`);
  check(html.includes("Analysis Execution Docket") && html.includes("Fourteen execution gates remain Inactive") && html.includes("A registered design is not an authorized execution or result"), `${route} lacks its Phase 73 execution boundary.`);
}
check(
  manifest.result_adjudication_routes.length === manifest.expected_build.phase_73_result_adjudication_dockets,
  `Expected ${manifest.expected_build.phase_73_result_adjudication_dockets} result-adjudication routes, found ${manifest.result_adjudication_routes.length}.`,
);
for (const route of manifest.result_adjudication_routes) {
  const html = await readText(routeToHtml(route));
  check(hasRobots(html, "index, follow"), `${route} is missing index, follow.`);
  check(hasCanonical(html, `${manifest.canonical_site}${route}`), `${route} has the wrong canonical URL.`);
  check(sitemap.includes(`${manifest.canonical_site}${route}`), `${route} is missing from the sitemap.`);
  check(html.includes("Result Adjudication Docket") && html.includes("Ten deviation categories remain Not Recorded") && html.includes("Fourteen adjudication gates remain Inactive") && html.includes("Eight correction classes remain at No Event") && html.includes("A result artifact is not a publishable claim"), `${route} lacks its Phase 73 adjudication, deviation, or correction boundary.`);
}
const analysisIndexHtml = await readText(routeToHtml("/evidence/analysis/"));
check(analysisIndexHtml.includes("data-analysis-registry") && analysisIndexHtml.includes("32 inactive executions") && analysisIndexHtml.includes("8 empty deviation registers") && analysisIndexHtml.includes("8 inactive adjudications") && analysisIndexHtml.includes("8 empty correction registers"), "The analysis index is missing its registry or structural counts.");
check(hasCanonical(analysisIndexHtml, `${manifest.canonical_site}/evidence/analysis/`), "The analysis index has the wrong canonical URL.");
check(sitemap.includes(`${manifest.canonical_site}/evidence/analysis/`), "The analysis index is missing from the sitemap.");

check(
  manifest.result_synthesis_input_routes.length === manifest.expected_build.phase_74_result_synthesis_input_dockets,
  `Expected ${manifest.expected_build.phase_74_result_synthesis_input_dockets} synthesis-input routes, found ${manifest.result_synthesis_input_routes.length}.`,
);
for (const route of manifest.result_synthesis_input_routes) {
  const html = await readText(routeToHtml(route));
  check(hasRobots(html, "index, follow"), `${route} is missing index, follow.`);
  check(hasCanonical(html, `${manifest.canonical_site}${route}`), `${route} has the wrong canonical URL.`);
  check(sitemap.includes(`${manifest.canonical_site}${route}`), `${route} is missing from the sitemap.`);
  check(html.includes("Result Synthesis Input") && html.includes("Fourteen result-input gates remain Inactive") && html.includes("An adjudicated result is not automatically eligible for synthesis"), `${route} lacks its Phase 74 input boundary.`);
}
check(
  manifest.synthesis_contradiction_routes.length === manifest.expected_build.phase_74_synthesis_contradiction_dossiers,
  `Expected ${manifest.expected_build.phase_74_synthesis_contradiction_dossiers} synthesis-dossier routes, found ${manifest.synthesis_contradiction_routes.length}.`,
);
for (const route of manifest.synthesis_contradiction_routes) {
  const html = await readText(routeToHtml(route));
  check(hasRobots(html, "index, follow"), `${route} is missing index, follow.`);
  check(hasCanonical(html, `${manifest.canonical_site}${route}`), `${route} has the wrong canonical URL.`);
  check(sitemap.includes(`${manifest.canonical_site}${route}`), `${route} is missing from the sitemap.`);
  check(html.includes("Synthesis And Decision Dossier") && html.includes("Fourteen synthesis gates remain Inactive") && html.includes("Ten contradiction categories remain Not Assessable") && html.includes("Twelve challenge gates remain Inactive") && html.includes("Fourteen translation gates remain Inactive") && html.includes("Ten reevaluation triggers remain Dormant") && html.includes("A synthesis is not a decision recommendation or authorization"), `${route} lacks its Phase 74 synthesis, challenge, translation, or reevaluation boundary.`);
}
const synthesisIndexHtml = await readText(routeToHtml("/evidence/synthesis/"));
check(synthesisIndexHtml.includes("data-synthesis-registry") && synthesisIndexHtml.includes("32 inactive inputs") && synthesisIndexHtml.includes("8 inactive syntheses") && synthesisIndexHtml.includes("8 inactive challenges") && synthesisIndexHtml.includes("8 inactive translations") && synthesisIndexHtml.includes("0 recommendations"), "The synthesis index is missing its registry or structural counts.");
check(hasCanonical(synthesisIndexHtml, `${manifest.canonical_site}/evidence/synthesis/`), "The synthesis index has the wrong canonical URL.");
check(sitemap.includes(`${manifest.canonical_site}/evidence/synthesis/`), "The synthesis index is missing from the sitemap.");

check(
  manifest.implementation_commitment_realization_routes.length === manifest.expected_build.phase_75_implementation_commitment_realization_ledgers,
  "Expected " + manifest.expected_build.phase_75_implementation_commitment_realization_ledgers + " implementation-realization routes, found " + manifest.implementation_commitment_realization_routes.length + ".",
);
for (const route of manifest.implementation_commitment_realization_routes) {
  const html = await readText(routeToHtml(route));
  check(hasRobots(html, "index, follow"), route + " is missing index, follow.");
  check(hasCanonical(html, manifest.canonical_site + route), route + " has the wrong canonical URL.");
  check(sitemap.includes(manifest.canonical_site + route), route + " is missing from the sitemap.");
  check(html.includes("Implementation And Realization Ledger") && html.includes("Sixteen gates remain Inactive") && html.includes("Twelve trigger classes remain Dormant") && html.includes("Authorization is not implementation, and output is not realized benefit"), route + " lacks its Phase 75 implementation and realization boundary.");
}
check(
  manifest.decision_accountability_routes.length === manifest.expected_build.phase_75_decision_accountability_dossiers,
  "Expected " + manifest.expected_build.phase_75_decision_accountability_dossiers + " decision-accountability routes, found " + manifest.decision_accountability_routes.length + ".",
);
for (const route of manifest.decision_accountability_routes) {
  const html = await readText(routeToHtml(route));
  check(hasRobots(html, "index, follow"), route + " is missing index, follow.");
  check(hasCanonical(html, manifest.canonical_site + route), route + " has the wrong canonical URL.");
  check(sitemap.includes(manifest.canonical_site + route), route + " is missing from the sitemap.");
  check(html.includes("Decision Accountability Dossier") && html.includes("Sixteen accountability gates remain Inactive") && html.includes("Twelve audit gates remain Inactive") && html.includes("Ten action classes remain Unavailable") && html.includes("A recommendation is not an accountable institutional decision"), route + " lacks its Phase 75 accountability, audit, or remediation boundary.");
}
const accountabilityIndexHtml = await readText(routeToHtml("/evidence/accountability/"));
check(accountabilityIndexHtml.includes("data-accountability-registry") && accountabilityIndexHtml.includes("8 inactive decisions") && accountabilityIndexHtml.includes("32 inactive ledgers") && accountabilityIndexHtml.includes("8 inactive audits") && accountabilityIndexHtml.includes("0 impacts"), "The accountability index is missing its registry or structural counts.");
check(hasCanonical(accountabilityIndexHtml, manifest.canonical_site + "/evidence/accountability/"), "The accountability index has the wrong canonical URL.");
check(sitemap.includes(manifest.canonical_site + "/evidence/accountability/"), "The accountability index is missing from the sitemap.");

check(
  manifest.institutional_learning_routes.length === manifest.expected_build.phase_76_institutional_learning_dossiers,
  "Expected " + manifest.expected_build.phase_76_institutional_learning_dossiers + " institutional-learning routes, found " + manifest.institutional_learning_routes.length + ".",
);
for (const route of manifest.institutional_learning_routes) {
  const html = await readText(routeToHtml(route));
  check(hasRobots(html, "index, follow"), route + " is missing index, follow.");
  check(hasCanonical(html, manifest.canonical_site + route), route + " has the wrong canonical URL.");
  check(sitemap.includes(manifest.canonical_site + route), route + " is missing from the sitemap.");
  check(html.includes("Institutional Learning Dossier") && html.includes("Fourteen gates remain Inactive") && html.includes("Twelve retention classes remain Empty") && html.includes("Similarity does not establish transferability"), route + " lacks its Phase 76 learning or retention boundary.");
}
check(
  manifest.cross_case_transfer_routes.length === manifest.expected_build.phase_76_cross_case_transfer_registers,
  "Expected " + manifest.expected_build.phase_76_cross_case_transfer_registers + " pairwise transfer routes, found " + manifest.cross_case_transfer_routes.length + ".",
);
for (const route of manifest.cross_case_transfer_routes) {
  const html = await readText(routeToHtml(route));
  check(hasRobots(html, "index, follow"), route + " is missing index, follow.");
  check(hasCanonical(html, manifest.canonical_site + route), route + " has the wrong canonical URL.");
  check(sitemap.includes(manifest.canonical_site + route), route + " is missing from the sitemap.");
  check(html.includes("Pairwise Transfer Register") && html.includes("Sixteen gates remain Inactive") && html.includes("Twelve condition classes remain Not Assessable") && html.includes("Similarity does not establish transferability"), route + " lacks its Phase 76 comparison or transfer-condition boundary.");
}
check(
  manifest.portfolio_governance_routes.length === manifest.expected_build.phase_76_portfolio_governance_registers,
  "Expected " + manifest.expected_build.phase_76_portfolio_governance_registers + " portfolio routes, found " + manifest.portfolio_governance_routes.length + ".",
);
for (const route of manifest.portfolio_governance_routes) {
  const html = await readText(routeToHtml(route));
  check(hasRobots(html, "index, follow"), route + " is missing index, follow.");
  check(hasCanonical(html, manifest.canonical_site + route), route + " has the wrong canonical URL.");
  check(sitemap.includes(manifest.canonical_site + route), route + " is missing from the sitemap.");
  check(html.includes("Portfolio Governance Register") && html.includes("Fourteen gates remain Inactive") && html.includes("Twelve trigger classes remain Dormant") && html.includes("Similarity does not establish transferability"), route + " lacks its Phase 76 portfolio or shared-risk boundary.");
}
check(
  manifest.policy_supersession_retirement_routes.length === manifest.expected_build.phase_76_policy_supersession_retirement_ledgers,
  "Expected " + manifest.expected_build.phase_76_policy_supersession_retirement_ledgers + " policy-retirement routes, found " + manifest.policy_supersession_retirement_routes.length + ".",
);
for (const route of manifest.policy_supersession_retirement_routes) {
  const html = await readText(routeToHtml(route));
  check(hasRobots(html, "index, follow"), route + " is missing index, follow.");
  check(hasCanonical(html, manifest.canonical_site + route), route + " has the wrong canonical URL.");
  check(sitemap.includes(manifest.canonical_site + route), route + " is missing from the sitemap.");
  check(html.includes("Policy Retirement Ledger") && html.includes("Fourteen gates remain Inactive") && html.includes("Ten obligations remain Unavailable") && html.includes("Similarity does not establish transferability"), route + " lacks its Phase 76 policy-lifecycle or decommissioning boundary.");
}
const learningIndexHtml = await readText(routeToHtml("/evidence/learning/"));
check(learningIndexHtml.includes("data-learning-registry") && learningIndexHtml.includes("8 inactive learning dossiers") && learningIndexHtml.includes("28 inactive pairwise reviews") && learningIndexHtml.includes("6 inactive portfolios") && learningIndexHtml.includes("8 inactive retirement ledgers") && learningIndexHtml.includes("0 conclusions"), "The learning index is missing its registry or structural counts.");
check(hasCanonical(learningIndexHtml, manifest.canonical_site + "/evidence/learning/"), "The learning index has the wrong canonical URL.");
check(sitemap.includes(manifest.canonical_site + "/evidence/learning/"), "The learning index is missing from the sitemap.");

check(
  manifest.stakeholder_standing_notice_routes.length === manifest.expected_build.phase_77_stakeholder_standing_notice_registers,
  "Expected " + manifest.expected_build.phase_77_stakeholder_standing_notice_registers + " stakeholder-standing routes, found " + manifest.stakeholder_standing_notice_routes.length + ".",
);
for (const route of manifest.stakeholder_standing_notice_routes) {
  const html = await readText(routeToHtml(route));
  check(hasRobots(html, "index, follow"), route + " is missing index, follow.");
  check(hasCanonical(html, manifest.canonical_site + route), route + " has the wrong canonical URL.");
  check(sitemap.includes(manifest.canonical_site + route), route + " is missing from the sitemap.");
  check(html.includes("Stakeholder Standing And Notice Register") && html.includes("Sixteen gates remain Inactive") && html.includes("Twelve constituency classes remain Unassessed") && html.includes("Participation does not establish consent"), route + " lacks its Phase 77 standing, notice, or affected-public boundary.");
}
check(
  manifest.deliberation_issue_response_routes.length === manifest.expected_build.phase_77_deliberation_issue_response_dockets,
  "Expected " + manifest.expected_build.phase_77_deliberation_issue_response_dockets + " deliberation routes, found " + manifest.deliberation_issue_response_routes.length + ".",
);
for (const route of manifest.deliberation_issue_response_routes) {
  const html = await readText(routeToHtml(route));
  check(hasRobots(html, "index, follow"), route + " is missing index, follow.");
  check(hasCanonical(html, manifest.canonical_site + route), route + " has the wrong canonical URL.");
  check(sitemap.includes(manifest.canonical_site + route), route + " is missing from the sitemap.");
  check(html.includes("Deliberation Issue And Response Docket") && html.includes("Eighteen gates remain Inactive") && html.includes("Twelve issue classes remain Unopened") && html.includes("Twelve dimensions remain Not Measured") && html.includes("Participation does not establish consent"), route + " lacks its Phase 77 deliberation, issue-response, or quality boundary.");
}
check(
  manifest.mandate_legitimacy_appeal_routes.length === manifest.expected_build.phase_77_mandate_legitimacy_appeal_registers,
  "Expected " + manifest.expected_build.phase_77_mandate_legitimacy_appeal_registers + " mandate-appeal routes, found " + manifest.mandate_legitimacy_appeal_routes.length + ".",
);
for (const route of manifest.mandate_legitimacy_appeal_routes) {
  const html = await readText(routeToHtml(route));
  check(hasRobots(html, "index, follow"), route + " is missing index, follow.");
  check(hasCanonical(html, manifest.canonical_site + route), route + " has the wrong canonical URL.");
  check(sitemap.includes(manifest.canonical_site + route), route + " is missing from the sitemap.");
  check(html.includes("Mandate Legitimacy And Appeal Register") && html.includes("Sixteen gates remain Inactive") && html.includes("Ten appeal grounds remain Unavailable") && html.includes("Participation does not establish consent"), route + " lacks its Phase 77 mandate, legitimacy, or appeal boundary.");
}
check(
  manifest.adaptive_mandate_review_routes.length === manifest.expected_build.phase_77_adaptive_mandate_review_ledgers,
  "Expected " + manifest.expected_build.phase_77_adaptive_mandate_review_ledgers + " adaptive-review routes, found " + manifest.adaptive_mandate_review_routes.length + ".",
);
for (const route of manifest.adaptive_mandate_review_routes) {
  const html = await readText(routeToHtml(route));
  check(hasRobots(html, "index, follow"), route + " is missing index, follow.");
  check(hasCanonical(html, manifest.canonical_site + route), route + " has the wrong canonical URL.");
  check(sitemap.includes(manifest.canonical_site + route), route + " is missing from the sitemap.");
  check(html.includes("Adaptive Mandate Review Ledger") && html.includes("Fourteen gates remain Inactive") && html.includes("Twelve trigger classes remain Dormant") && html.includes("Participation does not establish consent"), route + " lacks its Phase 77 adaptive-review or reopening boundary.");
}
const deliberationIndexHtml = await readText(routeToHtml("/evidence/deliberation/"));
check(deliberationIndexHtml.includes("data-deliberation-registry") && deliberationIndexHtml.includes("8 inactive standing registers") && deliberationIndexHtml.includes("8 inactive deliberation dockets") && deliberationIndexHtml.includes("8 inactive mandate registers") && deliberationIndexHtml.includes("8 inactive adaptive ledgers") && deliberationIndexHtml.includes("0 participation records"), "The deliberation index is missing its registry or structural counts.");
check(hasCanonical(deliberationIndexHtml, manifest.canonical_site + "/evidence/deliberation/"), "The deliberation index has the wrong canonical URL.");
check(sitemap.includes(manifest.canonical_site + "/evidence/deliberation/"), "The deliberation index is missing from the sitemap.");

check(
  manifest.interjurisdictional_authority_externality_routes.length === manifest.expected_build.phase_78_interjurisdictional_authority_externality_maps,
  "Expected " + manifest.expected_build.phase_78_interjurisdictional_authority_externality_maps + " authority-externality routes, found " + manifest.interjurisdictional_authority_externality_routes.length + ".",
);
for (const route of manifest.interjurisdictional_authority_externality_routes) {
  const html = await readText(routeToHtml(route));
  check(hasRobots(html, "index, follow"), route + " is missing index, follow.");
  check(hasCanonical(html, manifest.canonical_site + route), route + " has the wrong canonical URL.");
  check(sitemap.includes(manifest.canonical_site + route), route + " is missing from the sitemap.");
  check(html.includes("Interjurisdictional Authority And Externality Map") && html.includes("Sixteen gates remain Inactive") && html.includes("Twelve jurisdiction classes remain Unmapped") && html.includes("Twelve cross-boundary classes remain Unassessed") && html.includes("A public mandate is not a compact"), route + " lacks its Phase 78 authority or externality boundary.");
}
check(
  manifest.shared_public_value_contribution_routes.length === manifest.expected_build.phase_78_shared_public_value_contribution_compacts,
  "Expected " + manifest.expected_build.phase_78_shared_public_value_contribution_compacts + " shared-value routes, found " + manifest.shared_public_value_contribution_routes.length + ".",
);
for (const route of manifest.shared_public_value_contribution_routes) {
  const html = await readText(routeToHtml(route));
  check(hasRobots(html, "index, follow"), route + " is missing index, follow.");
  check(hasCanonical(html, manifest.canonical_site + route), route + " has the wrong canonical URL.");
  check(sitemap.includes(manifest.canonical_site + route), route + " is missing from the sitemap.");
  check(html.includes("Shared Public Value And Contribution Compact") && html.includes("Eighteen gates remain Inactive") && html.includes("Twelve value classes remain Not Valued") && html.includes("Twelve contribution classes remain Uncommitted") && html.includes("A public mandate is not a compact"), route + " lacks its Phase 78 shared-value or contribution boundary.");
}
check(
  manifest.mutual_aid_continuity_dispute_routes.length === manifest.expected_build.phase_78_mutual_aid_continuity_dispute_registers,
  "Expected " + manifest.expected_build.phase_78_mutual_aid_continuity_dispute_registers + " continuity-dispute routes, found " + manifest.mutual_aid_continuity_dispute_routes.length + ".",
);
for (const route of manifest.mutual_aid_continuity_dispute_routes) {
  const html = await readText(routeToHtml(route));
  check(hasRobots(html, "index, follow"), route + " is missing index, follow.");
  check(hasCanonical(html, manifest.canonical_site + route), route + " has the wrong canonical URL.");
  check(sitemap.includes(manifest.canonical_site + route), route + " is missing from the sitemap.");
  check(html.includes("Mutual Aid, Continuity And Dispute Register") && html.includes("Sixteen gates remain Inactive") && html.includes("Twelve obligation classes remain Dormant") && html.includes("Ten dispute grounds remain Unavailable") && html.includes("A public mandate is not a compact"), route + " lacks its Phase 78 continuity or dispute boundary.");
}
check(
  manifest.emergency_authority_normalization_routes.length === manifest.expected_build.phase_78_emergency_authority_normalization_ledgers,
  "Expected " + manifest.expected_build.phase_78_emergency_authority_normalization_ledgers + " emergency-normalization routes, found " + manifest.emergency_authority_normalization_routes.length + ".",
);
for (const route of manifest.emergency_authority_normalization_routes) {
  const html = await readText(routeToHtml(route));
  check(hasRobots(html, "index, follow"), route + " is missing index, follow.");
  check(hasCanonical(html, manifest.canonical_site + route), route + " has the wrong canonical URL.");
  check(sitemap.includes(manifest.canonical_site + route), route + " is missing from the sitemap.");
  check(html.includes("Emergency Authority And Normalization Ledger") && html.includes("Eighteen gates remain Inactive") && html.includes("Twelve safeguards remain Inactive") && html.includes("Twelve restoration triggers remain Dormant") && html.includes("A public mandate is not a compact"), route + " lacks its Phase 78 emergency, safeguard, or normalization boundary.");
}
const compactsIndexHtml = await readText(routeToHtml("/evidence/compacts/"));
check(compactsIndexHtml.includes("data-compacts-registry") && compactsIndexHtml.includes("8 inactive authority maps") && compactsIndexHtml.includes("8 inactive value compacts") && compactsIndexHtml.includes("8 inactive continuity registers") && compactsIndexHtml.includes("8 inactive emergency ledgers") && compactsIndexHtml.includes("0 compact records"), "The compacts index is missing its registry or structural counts.");
check(hasCanonical(compactsIndexHtml, manifest.canonical_site + "/evidence/compacts/"), "The compacts index has the wrong canonical URL.");
check(sitemap.includes(manifest.canonical_site + "/evidence/compacts/"), "The compacts index is missing from the sitemap.");

check(
  manifest.public_asset_obligation_routes.length === manifest.expected_build.phase_79_public_asset_obligation_registers,
  "Expected " + manifest.expected_build.phase_79_public_asset_obligation_registers + " asset-obligation routes, found " + manifest.public_asset_obligation_routes.length + ".",
);
for (const route of manifest.public_asset_obligation_routes) {
  const html = await readText(routeToHtml(route));
  check(hasRobots(html, "index, follow"), route + " is missing index, follow.");
  check(hasCanonical(html, manifest.canonical_site + route), route + " has the wrong canonical URL.");
  check(sitemap.includes(manifest.canonical_site + route), route + " is missing from the sitemap.");
  check(html.includes("Public Asset And Obligation Register") && html.includes("Eighteen gates remain Inactive") && html.includes("Fourteen asset classes remain Unregistered") && html.includes("Fourteen obligation classes remain Unregistered") && html.includes("An asset register is not a valuation"), route + " lacks its Phase 79 asset or obligation boundary.");
}
check(
  manifest.lifecycle_cost_maintenance_routes.length === manifest.expected_build.phase_79_lifecycle_cost_maintenance_ledgers,
  "Expected " + manifest.expected_build.phase_79_lifecycle_cost_maintenance_ledgers + " lifecycle-maintenance routes, found " + manifest.lifecycle_cost_maintenance_routes.length + ".",
);
for (const route of manifest.lifecycle_cost_maintenance_routes) {
  const html = await readText(routeToHtml(route));
  check(hasRobots(html, "index, follow"), route + " is missing index, follow.");
  check(hasCanonical(html, manifest.canonical_site + route), route + " has the wrong canonical URL.");
  check(sitemap.includes(manifest.canonical_site + route), route + " is missing from the sitemap.");
  check(html.includes("Lifecycle Cost And Maintenance Ledger") && html.includes("Eighteen gates remain Inactive") && html.includes("Twelve lifecycle stages remain Unplanned") && html.includes("Twelve maintenance duties remain Unfunded") && html.includes("An asset register is not a valuation"), route + " lacks its Phase 79 lifecycle or maintenance boundary.");
}
check(
  manifest.procurement_dependency_contingent_risk_routes.length === manifest.expected_build.phase_79_procurement_dependency_contingent_risk_registers,
  "Expected " + manifest.expected_build.phase_79_procurement_dependency_contingent_risk_registers + " procurement-risk routes, found " + manifest.procurement_dependency_contingent_risk_routes.length + ".",
);
for (const route of manifest.procurement_dependency_contingent_risk_routes) {
  const html = await readText(routeToHtml(route));
  check(hasRobots(html, "index, follow"), route + " is missing index, follow.");
  check(hasCanonical(html, manifest.canonical_site + route), route + " has the wrong canonical URL.");
  check(sitemap.includes(manifest.canonical_site + route), route + " is missing from the sitemap.");
  check(html.includes("Procurement, Dependency And Contingent-Risk Register") && html.includes("Twenty gates remain Inactive") && html.includes("Twelve dependency classes remain Unassessed") && html.includes("Fourteen liabilities remain Unrecognized") && html.includes("An asset register is not a valuation"), route + " lacks its Phase 79 procurement, dependency, or liability boundary.");
}
check(
  manifest.intergenerational_balance_sheet_stewardship_routes.length === manifest.expected_build.phase_79_intergenerational_balance_sheet_stewardship_ledgers,
  "Expected " + manifest.expected_build.phase_79_intergenerational_balance_sheet_stewardship_ledgers + " intergenerational routes, found " + manifest.intergenerational_balance_sheet_stewardship_routes.length + ".",
);
for (const route of manifest.intergenerational_balance_sheet_stewardship_routes) {
  const html = await readText(routeToHtml(route));
  check(hasRobots(html, "index, follow"), route + " is missing index, follow.");
  check(hasCanonical(html, manifest.canonical_site + route), route + " has the wrong canonical URL.");
  check(sitemap.includes(manifest.canonical_site + route), route + " is missing from the sitemap.");
  check(html.includes("Intergenerational Balance Sheet And Stewardship Ledger") && html.includes("Twenty gates remain Inactive") && html.includes("Twelve distribution accounts remain Unmeasured") && html.includes("Twelve stress triggers remain Dormant") && html.includes("An asset register is not a valuation"), route + " lacks its Phase 79 distribution, future-user, stress, or stewardship boundary.");
}
const stewardshipIndexHtml = await readText(routeToHtml("/evidence/stewardship/"));
check(stewardshipIndexHtml.includes("data-stewardship-registry") && stewardshipIndexHtml.includes("8 inactive asset registers") && stewardshipIndexHtml.includes("8 inactive lifecycle ledgers") && stewardshipIndexHtml.includes("8 inactive procurement-risk registers") && stewardshipIndexHtml.includes("8 inactive balance sheets") && stewardshipIndexHtml.includes("0 valuations"), "The stewardship index is missing its registry or structural counts.");
check(hasCanonical(stewardshipIndexHtml, manifest.canonical_site + "/evidence/stewardship/"), "The stewardship index has the wrong canonical URL.");
check(sitemap.includes(manifest.canonical_site + "/evidence/stewardship/"), "The stewardship index is missing from the sitemap.");

check(manifest.public_investment_mission_thesis_routes.length === manifest.expected_build.phase_80_public_investment_mission_thesis_dossiers, "The Phase 80 thesis-route count is invalid.");
for (const route of manifest.public_investment_mission_thesis_routes) {
  const html = await readText(routeToHtml(route));
  check(hasRobots(html, "index, follow"), route + " is missing index, follow.");
  check(hasCanonical(html, manifest.canonical_site + route), route + " has the wrong canonical URL.");
  check(sitemap.includes(manifest.canonical_site + route), route + " is missing from the sitemap.");
  check(html.includes("Public Investment Mission And Thesis Dossier") && html.includes("Eighteen gates remain Inactive") && html.includes("Twelve mission classes remain Unassigned") && html.includes("Twelve instrument classes remain Unassessed") && html.includes("A project list is not an investment portfolio"), route + " lacks its Phase 80 mission or thesis boundary.");
}
check(manifest.portfolio_membership_dependency_sequence_routes.length === manifest.expected_build.phase_80_portfolio_membership_dependency_sequence_registers, "The Phase 80 portfolio-route count is invalid.");
for (const route of manifest.portfolio_membership_dependency_sequence_routes) {
  const html = await readText(routeToHtml(route));
  check(hasRobots(html, "index, follow"), route + " is missing index, follow.");
  check(hasCanonical(html, manifest.canonical_site + route), route + " has the wrong canonical URL.");
  check(sitemap.includes(manifest.canonical_site + route), route + " is missing from the sitemap.");
  check(html.includes("Portfolio Membership, Dependency And Sequence Register") && html.includes("Twenty gates remain Inactive") && html.includes("Twelve dependency classes remain Unmapped") && html.includes("Twelve sequence stages remain Unscheduled") && html.includes("A project list is not an investment portfolio"), route + " lacks its Phase 80 portfolio or sequence boundary.");
}
check(manifest.place_based_delivery_capacity_transition_routes.length === manifest.expected_build.phase_80_place_based_delivery_capacity_transition_ledgers, "The Phase 80 capacity-route count is invalid.");
for (const route of manifest.place_based_delivery_capacity_transition_routes) {
  const html = await readText(routeToHtml(route));
  check(hasRobots(html, "index, follow"), route + " is missing index, follow.");
  check(hasCanonical(html, manifest.canonical_site + route), route + " has the wrong canonical URL.");
  check(sitemap.includes(manifest.canonical_site + route), route + " is missing from the sitemap.");
  check(html.includes("Place-Based Delivery Capacity And Just-Transition Ledger") && html.includes("Twenty gates remain Inactive") && html.includes("Fourteen capacity dimensions remain Untested") && html.includes("Twelve readiness dimensions remain Unverified") && html.includes("A project list is not an investment portfolio"), route + " lacks its Phase 80 capacity, place, or transition boundary.");
}
check(manifest.portfolio_stress_rebalancing_realization_routes.length === manifest.expected_build.phase_80_portfolio_stress_rebalancing_realization_ledgers, "The Phase 80 realization-route count is invalid.");
for (const route of manifest.portfolio_stress_rebalancing_realization_routes) {
  const html = await readText(routeToHtml(route));
  check(hasRobots(html, "index, follow"), route + " is missing index, follow.");
  check(hasCanonical(html, manifest.canonical_site + route), route + " has the wrong canonical URL.");
  check(sitemap.includes(manifest.canonical_site + route), route + " is missing from the sitemap.");
  check(html.includes("Portfolio Stress, Rebalancing And Realization Ledger") && html.includes("Twenty gates remain Inactive") && html.includes("Twelve stress triggers remain Dormant") && html.includes("Twelve realization tests remain Not Tested") && html.includes("A project list is not an investment portfolio"), route + " lacks its Phase 80 stress, rebalancing, or realization boundary.");
}
const investmentPortfolioIndexHtml = await readText(routeToHtml("/evidence/investment-portfolios/"));
check(investmentPortfolioIndexHtml.includes("data-investment-portfolio-registry") && investmentPortfolioIndexHtml.includes("8 inactive investment theses") && investmentPortfolioIndexHtml.includes("8 inactive portfolio registers") && investmentPortfolioIndexHtml.includes("8 inactive capacity ledgers") && investmentPortfolioIndexHtml.includes("8 inactive realization ledgers") && investmentPortfolioIndexHtml.includes("0 portfolio decisions"), "The Phase 80 index is missing its registry or structural counts.");
check(hasCanonical(investmentPortfolioIndexHtml, manifest.canonical_site + "/evidence/investment-portfolios/"), "The Phase 80 index has the wrong canonical URL.");
check(sitemap.includes(manifest.canonical_site + "/evidence/investment-portfolios/"), "The Phase 80 index is missing from the sitemap.");

check(manifest.service_floor_universal_access_routes.length === manifest.expected_build.phase_81_service_floor_universal_access_dossiers, "The Phase 81 service-floor route count is invalid.");
for (const route of manifest.service_floor_universal_access_routes) {
  const html = await readText(routeToHtml(route));
  check(hasRobots(html, "index, follow"), route + " is missing index, follow.");
  check(hasCanonical(html, manifest.canonical_site + route), route + " has the wrong canonical URL.");
  check(sitemap.includes(manifest.canonical_site + route), route + " is missing from the sitemap.");
  check(html.includes("Service Floor And Universal Access Dossier") && html.includes("Twenty gates remain Inactive") && html.includes("Fourteen service classes remain Unassigned") && html.includes("Twelve access duties remain Unassigned") && html.includes("Infrastructure coverage is not service access"), route + " lacks its Phase 81 service-floor or access boundary.");
}
check(manifest.affordability_cross_subsidy_coverage_routes.length === manifest.expected_build.phase_81_affordability_cross_subsidy_coverage_ledgers, "The Phase 81 affordability route count is invalid.");
for (const route of manifest.affordability_cross_subsidy_coverage_routes) {
  const html = await readText(routeToHtml(route));
  check(hasRobots(html, "index, follow"), route + " is missing index, follow.");
  check(hasCanonical(html, manifest.canonical_site + route), route + " has the wrong canonical URL.");
  check(sitemap.includes(manifest.canonical_site + route), route + " is missing from the sitemap.");
  check(html.includes("Affordability, Cross-Subsidy And Coverage Ledger") && html.includes("Twenty gates remain Inactive") && html.includes("Twelve affordability protections") && html.includes("Twelve coverage dimensions remain Not Measured") && html.includes("Infrastructure coverage is not service access"), route + " lacks its Phase 81 affordability or coverage boundary.");
}
check(manifest.provider_plurality_interoperability_continuity_routes.length === manifest.expected_build.phase_81_provider_plurality_interoperability_continuity_registers, "The Phase 81 provider route count is invalid.");
for (const route of manifest.provider_plurality_interoperability_continuity_routes) {
  const html = await readText(routeToHtml(route));
  check(hasRobots(html, "index, follow"), route + " is missing index, follow.");
  check(hasCanonical(html, manifest.canonical_site + route), route + " has the wrong canonical URL.");
  check(sitemap.includes(manifest.canonical_site + route), route + " is missing from the sitemap.");
  check(html.includes("Provider Plurality, Interoperability And Continuity Register") && html.includes("Twenty-two gates remain Inactive") && html.includes("Twelve provider models remain Unassessed") && html.includes("Twelve continuity capabilities remain Untested") && html.includes("Infrastructure coverage is not service access"), route + " lacks its Phase 81 provider or continuity boundary.");
}
check(manifest.rights_quality_step_in_restoration_routes.length === manifest.expected_build.phase_81_rights_quality_step_in_restoration_ledgers, "The Phase 81 restoration route count is invalid.");
for (const route of manifest.rights_quality_step_in_restoration_routes) {
  const html = await readText(routeToHtml(route));
  check(hasRobots(html, "index, follow"), route + " is missing index, follow.");
  check(hasCanonical(html, manifest.canonical_site + route), route + " has the wrong canonical URL.");
  check(sitemap.includes(manifest.canonical_site + route), route + " is missing from the sitemap.");
  check(html.includes("Rights, Quality, Step-In And Restoration Ledger") && html.includes("Twenty-two gates remain Inactive") && html.includes("Fourteen rights remain Unadopted") && html.includes("Twelve failure triggers remain Dormant") && html.includes("emergency rationing is not permanent authority"), route + " lacks its Phase 81 rights, failure, or restoration boundary.");
}
const essentialServiceIndexHtml = await readText(routeToHtml("/evidence/essential-services/"));
check(essentialServiceIndexHtml.includes("data-essential-service-registry") && essentialServiceIndexHtml.includes("8 inactive floor dossiers") && essentialServiceIndexHtml.includes("8 inactive affordability ledgers") && essentialServiceIndexHtml.includes("8 inactive provider registers") && essentialServiceIndexHtml.includes("8 inactive restoration ledgers") && essentialServiceIndexHtml.includes("0 service decisions"), "The Phase 81 index is missing its registry or structural counts.");
check(hasCanonical(essentialServiceIndexHtml, manifest.canonical_site + "/evidence/essential-services/"), "The Phase 81 index has the wrong canonical URL.");
check(sitemap.includes(manifest.canonical_site + "/evidence/essential-services/"), "The Phase 81 index is missing from the sitemap.");

check(manifest.household_capability_service_bundle_routes.length === manifest.expected_build.phase_82_household_capability_service_bundle_dossiers, "The Phase 82 capability-route count is invalid.");
for (const route of manifest.household_capability_service_bundle_routes) {
  const html = await readText(routeToHtml(route));
  check(hasRobots(html, "index, follow"), route + " is missing index, follow.");
  check(hasCanonical(html, manifest.canonical_site + route), route + " has the wrong canonical URL.");
  check(sitemap.includes(manifest.canonical_site + route), route + " is missing from the sitemap.");
  check(html.includes("Household Capability And Service Bundle Dossier") && html.includes("20 gates remain Inactive") && html.includes("Household capabilities remain unassigned") && html.includes("Service bundles remain unassigned") && html.includes("Service availability is not household capability"), route + " lacks its Phase 82 capability or service-bundle boundary.");
}
check(manifest.care_infrastructure_workforce_capacity_routes.length === manifest.expected_build.phase_82_care_infrastructure_workforce_capacity_ledgers, "The Phase 82 care-route count is invalid.");
for (const route of manifest.care_infrastructure_workforce_capacity_routes) {
  const html = await readText(routeToHtml(route));
  check(hasRobots(html, "index, follow"), route + " is missing index, follow.");
  check(hasCanonical(html, manifest.canonical_site + route), route + " has the wrong canonical URL.");
  check(sitemap.includes(manifest.canonical_site + route), route + " is missing from the sitemap.");
  check(html.includes("Care Infrastructure, Workforce And Capacity Ledger") && html.includes("20 gates remain Inactive") && html.includes("Care services remain unassigned") && html.includes("Workforce safeguards remain unassigned") && html.includes("Service availability is not household capability"), route + " lacks its Phase 82 care or workforce boundary.");
}
check(manifest.household_affordability_time_debt_administrative_burden_routes.length === manifest.expected_build.phase_82_household_affordability_time_debt_administrative_burden_registers, "The Phase 82 burden-route count is invalid.");
for (const route of manifest.household_affordability_time_debt_administrative_burden_routes) {
  const html = await readText(routeToHtml(route));
  check(hasRobots(html, "index, follow"), route + " is missing index, follow.");
  check(hasCanonical(html, manifest.canonical_site + route), route + " has the wrong canonical URL.");
  check(sitemap.includes(manifest.canonical_site + route), route + " is missing from the sitemap.");
  check(html.includes("Household Affordability, Time, Debt And Administrative Burden Register") && html.includes("22 gates remain Inactive") && html.includes("Household burdens remain unassigned") && html.includes("Administrative safeguards remain unassigned") && html.includes("Service availability is not household capability"), route + " lacks its Phase 82 affordability or administrative-burden boundary.");
}
check(manifest.neighborhood_access_displacement_crisis_recovery_routes.length === manifest.expected_build.phase_82_neighborhood_access_displacement_crisis_recovery_ledgers, "The Phase 82 recovery-route count is invalid.");
for (const route of manifest.neighborhood_access_displacement_crisis_recovery_routes) {
  const html = await readText(routeToHtml(route));
  check(hasRobots(html, "index, follow"), route + " is missing index, follow.");
  check(hasCanonical(html, manifest.canonical_site + route), route + " has the wrong canonical URL.");
  check(sitemap.includes(manifest.canonical_site + route), route + " is missing from the sitemap.");
  check(html.includes("Neighborhood Access, Displacement, Crisis And Recovery Ledger") && html.includes("22 gates remain Inactive") && html.includes("Neighborhood access tests remain unassigned") && html.includes("Long-horizon security tests remain unassigned") && html.includes("temporary relief is not household recovery"), route + " lacks its Phase 82 access, displacement, crisis, or recovery boundary.");
}
const householdCapabilityIndexHtml = await readText(routeToHtml("/evidence/household-capability/"));
check(householdCapabilityIndexHtml.includes("data-household-capability-registry") && householdCapabilityIndexHtml.includes("8 inactive capability dossiers") && householdCapabilityIndexHtml.includes("8 inactive care ledgers") && householdCapabilityIndexHtml.includes("8 inactive burden registers") && householdCapabilityIndexHtml.includes("8 inactive recovery ledgers") && householdCapabilityIndexHtml.includes("0 household decisions"), "The Phase 82 index is missing its registry or structural counts.");
check(hasCanonical(householdCapabilityIndexHtml, manifest.canonical_site + "/evidence/household-capability/"), "The Phase 82 index has the wrong canonical URL.");
check(sitemap.includes(manifest.canonical_site + "/evidence/household-capability/"), "The Phase 82 index is missing from the sitemap.");

check(manifest.community_institution_access_trust_continuity_routes.length === manifest.expected_build.phase_83_community_institution_access_trust_continuity_dossiers, "The Phase 83 institution-route count is invalid.");
for (const route of manifest.community_institution_access_trust_continuity_routes) {
  const html = await readText(routeToHtml(route));
  check(hasRobots(html, "index, follow"), route + " is missing index, follow.");
  check(hasCanonical(html, manifest.canonical_site + route), route + " has the wrong canonical URL.");
  check(sitemap.includes(manifest.canonical_site + route), route + " is missing from the sitemap.");
  check(html.includes("Community Institution Access, Trust And Continuity Dossier") && html.includes("20 gates remain Inactive") && html.includes("Community institution classes remain unassigned") && html.includes("Institution continuity safeguards remain unassigned") && html.includes("Institution presence is not community access"), route + " lacks its Phase 83 institution or continuity boundary.");
}
check(manifest.civic_association_cooperative_mutual_aid_capacity_routes.length === manifest.expected_build.phase_83_civic_association_cooperative_mutual_aid_capacity_ledgers, "The Phase 83 civic-route count is invalid.");
for (const route of manifest.civic_association_cooperative_mutual_aid_capacity_routes) {
  const html = await readText(routeToHtml(route));
  check(hasRobots(html, "index, follow"), route + " is missing index, follow.");
  check(hasCanonical(html, manifest.canonical_site + route), route + " has the wrong canonical URL.");
  check(sitemap.includes(manifest.canonical_site + route), route + " is missing from the sitemap.");
  check(html.includes("Civic Association, Cooperative And Mutual-Aid Capacity Ledger") && html.includes("20 gates remain Inactive") && html.includes("Civic network types remain unassigned") && html.includes("Volunteer and worker safeguards remain unassigned") && html.includes("Institution presence is not community access"), route + " lacks its Phase 83 civic or mutual-aid boundary.");
}
check(manifest.local_information_media_public_knowledge_integrity_routes.length === manifest.expected_build.phase_83_local_information_media_public_knowledge_integrity_registers, "The Phase 83 information-route count is invalid.");
for (const route of manifest.local_information_media_public_knowledge_integrity_routes) {
  const html = await readText(routeToHtml(route));
  check(hasRobots(html, "index, follow"), route + " is missing index, follow.");
  check(hasCanonical(html, manifest.canonical_site + route), route + " has the wrong canonical URL.");
  check(sitemap.includes(manifest.canonical_site + route), route + " is missing from the sitemap.");
  check(html.includes("Local Information, Media And Public-Knowledge Integrity Register") && html.includes("22 gates remain Inactive") && html.includes("Information ecosystem functions remain unassigned") && html.includes("Public-knowledge access modes remain unassigned") && html.includes("Institution presence is not community access"), route + " lacks its Phase 83 information or public-knowledge boundary.");
}
check(manifest.collective_preparedness_trauma_recovery_resilience_routes.length === manifest.expected_build.phase_83_collective_preparedness_trauma_recovery_resilience_ledgers, "The Phase 83 resilience-route count is invalid.");
for (const route of manifest.collective_preparedness_trauma_recovery_resilience_routes) {
  const html = await readText(routeToHtml(route));
  check(hasRobots(html, "index, follow"), route + " is missing index, follow.");
  check(hasCanonical(html, manifest.canonical_site + route), route + " has the wrong canonical URL.");
  check(sitemap.includes(manifest.canonical_site + route), route + " is missing from the sitemap.");
  check(html.includes("Collective Preparedness, Trauma, Recovery And Resilience Ledger") && html.includes("22 gates remain Inactive") && html.includes("Community preparedness capabilities remain unassigned") && html.includes("Long-horizon collective resilience tests remain unassigned") && html.includes("reopening is not collective recovery"), route + " lacks its Phase 83 preparedness or resilience boundary.");
}
const communityInstitutionsIndexHtml = await readText(routeToHtml("/evidence/community-institutions/"));
check(communityInstitutionsIndexHtml.includes("data-community-institutions-registry") && communityInstitutionsIndexHtml.includes("8 inactive institution dossiers") && communityInstitutionsIndexHtml.includes("8 inactive civic ledgers") && communityInstitutionsIndexHtml.includes("8 inactive information registers") && communityInstitutionsIndexHtml.includes("8 inactive resilience ledgers") && communityInstitutionsIndexHtml.includes("0 community decisions"), "The Phase 83 index is missing its registry or structural counts.");
check(hasCanonical(communityInstitutionsIndexHtml, manifest.canonical_site + "/evidence/community-institutions/"), "The Phase 83 index has the wrong canonical URL.");
check(sitemap.includes(manifest.canonical_site + "/evidence/community-institutions/"), "The Phase 83 index is missing from the sitemap.");

check(manifest.food_production_land_water_sovereignty_routes.length === manifest.expected_build.phase_84_food_production_land_water_sovereignty_dossiers, "The Phase 84 production-route count is invalid.");
for (const route of manifest.food_production_land_water_sovereignty_routes) {
  const html = await readText(routeToHtml(route));
  check(hasRobots(html, "index, follow"), route + " is missing index, follow.");
  check(hasCanonical(html, manifest.canonical_site + route), route + " has the wrong canonical URL.");
  check(sitemap.includes(manifest.canonical_site + route), route + " is missing from the sitemap.");
  check(html.includes("Food Production, Land, Water And Sovereignty Dossier") && html.includes("20 gates remain Inactive") && html.includes("Food-production system types remain unassigned") && html.includes("Water, energy, and climate dependency tests remain unassigned") && html.includes("Availability is not access"), route + " lacks its Phase 84 production or dependency boundary.");
}
check(manifest.processing_storage_distribution_local_provisioning_routes.length === manifest.expected_build.phase_84_processing_storage_distribution_local_provisioning_ledgers, "The Phase 84 provisioning-route count is invalid.");
for (const route of manifest.processing_storage_distribution_local_provisioning_routes) {
  const html = await readText(routeToHtml(route));
  check(hasRobots(html, "index, follow") && hasCanonical(html, manifest.canonical_site + route) && sitemap.includes(manifest.canonical_site + route), route + " lacks indexing coverage.");
  check(html.includes("Processing, Storage, Distribution And Local-Provisioning Ledger") && html.includes("20 gates remain Inactive") && html.includes("Processing, storage, and distribution modes remain unassigned") && html.includes("Food-workforce and logistics safeguards remain unassigned") && html.includes("inventory is not usable reserve"), route + " lacks its Phase 84 provisioning boundary.");
}
check(manifest.food_access_affordability_nutrition_institutional_meals_routes.length === manifest.expected_build.phase_84_food_access_affordability_nutrition_institutional_meals_registers, "The Phase 84 access-route count is invalid.");
for (const route of manifest.food_access_affordability_nutrition_institutional_meals_routes) {
  const html = await readText(routeToHtml(route));
  check(hasRobots(html, "index, follow") && hasCanonical(html, manifest.canonical_site + route) && sitemap.includes(manifest.canonical_site + route), route + " lacks indexing coverage.");
  check(html.includes("Food Access, Affordability, Nutrition And Institutional-Meals Register") && html.includes("22 gates remain Inactive") && html.includes("Food-access channels remain unassigned") && html.includes("Institutional-meal and community-provisioning safeguards remain unassigned") && html.includes("Availability is not access"), route + " lacks its Phase 84 access or nutrition boundary.");
}
check(manifest.reserve_contamination_circularity_community_resource_security_routes.length === manifest.expected_build.phase_84_reserve_contamination_circularity_community_resource_security_ledgers, "The Phase 84 security-route count is invalid.");
for (const route of manifest.reserve_contamination_circularity_community_resource_security_routes) {
  const html = await readText(routeToHtml(route));
  check(hasRobots(html, "index, follow") && hasCanonical(html, manifest.canonical_site + route) && sitemap.includes(manifest.canonical_site + route), route + " lacks indexing coverage.");
  check(html.includes("Reserve, Contamination, Circularity And Community-Resource-Security Ledger") && html.includes("22 gates remain Inactive") && html.includes("Emergency-reserve capabilities remain unassigned") && html.includes("Long-horizon community-resource-security tests remain unassigned") && html.includes("inventory is not usable reserve"), route + " lacks its Phase 84 reserve or security boundary.");
}
const foodSystemsIndexHtml = await readText(routeToHtml("/evidence/food-systems/"));
check(foodSystemsIndexHtml.includes("data-food-systems-registry") && foodSystemsIndexHtml.includes("8 inactive production dossiers") && foodSystemsIndexHtml.includes("8 inactive provisioning ledgers") && foodSystemsIndexHtml.includes("8 inactive access registers") && foodSystemsIndexHtml.includes("8 inactive security ledgers") && foodSystemsIndexHtml.includes("0 food-system decisions"), "The Phase 84 index is missing its registry or structural counts.");
check(hasCanonical(foodSystemsIndexHtml, manifest.canonical_site + "/evidence/food-systems/"), "The Phase 84 index has the wrong canonical URL.");
check(sitemap.includes(manifest.canonical_site + "/evidence/food-systems/"), "The Phase 84 index is missing from the sitemap.");

check(manifest.housing_need_supply_delivery_habitability_routes.length === manifest.expected_build.phase_85_housing_need_supply_delivery_habitability_dossiers, "The Phase 85 delivery-route count is invalid.");
for (const route of manifest.housing_need_supply_delivery_habitability_routes) {
  const html = await readText(routeToHtml(route));
  check(hasRobots(html, "index, follow") && hasCanonical(html, manifest.canonical_site + route) && sitemap.includes(manifest.canonical_site + route), route + " lacks indexing coverage.");
  check(html.includes("Housing Need, Supply, Delivery And Habitability Dossier") && html.includes("20 gates remain Inactive") && html.includes("Housing-supply and delivery types remain unassigned") && html.includes("Land-use, infrastructure, and delivery safeguards remain unassigned") && html.includes("Approvals are not homes"), route + " lacks its Phase 85 delivery or habitability boundary.");
}
check(manifest.tenure_affordability_public_social_community_housing_routes.length === manifest.expected_build.phase_85_tenure_affordability_public_social_community_housing_ledgers, "The Phase 85 tenure-route count is invalid.");
for (const route of manifest.tenure_affordability_public_social_community_housing_routes) {
  const html = await readText(routeToHtml(route));
  check(hasRobots(html, "index, follow") && hasCanonical(html, manifest.canonical_site + route) && sitemap.includes(manifest.canonical_site + route), route + " lacks indexing coverage.");
  check(html.includes("Tenure, Affordability, Public, Social And Community-Housing Ledger") && html.includes("20 gates remain Inactive") && html.includes("Housing-tenure and provider models remain unassigned") && html.includes("Household-housing affordability dimensions remain unassigned") && html.includes("Approvals are not homes"), route + " lacks its Phase 85 tenure or affordability boundary.");
}
check(manifest.homelessness_shelter_supportive_housing_displacement_routes.length === manifest.expected_build.phase_85_homelessness_shelter_supportive_housing_displacement_registers, "The Phase 85 stability-route count is invalid.");
for (const route of manifest.homelessness_shelter_supportive_housing_displacement_routes) {
  const html = await readText(routeToHtml(route));
  check(hasRobots(html, "index, follow") && hasCanonical(html, manifest.canonical_site + route) && sitemap.includes(manifest.canonical_site + route), route + " lacks indexing coverage.");
  check(html.includes("Homelessness, Shelter, Supportive-Housing And Displacement Register") && html.includes("22 gates remain Inactive") && html.includes("Homelessness, shelter, and supportive-housing pathways remain unassigned") && html.includes("Housing-stability and displacement-protection dimensions remain unassigned") && html.includes("Approvals are not homes"), route + " lacks its Phase 85 shelter or stability boundary.");
}
check(manifest.retrofit_climate_disaster_reconstruction_place_stability_routes.length === manifest.expected_build.phase_85_retrofit_climate_disaster_reconstruction_place_stability_ledgers, "The Phase 85 place-route count is invalid.");
for (const route of manifest.retrofit_climate_disaster_reconstruction_place_stability_routes) {
  const html = await readText(routeToHtml(route));
  check(hasRobots(html, "index, follow") && hasCanonical(html, manifest.canonical_site + route) && sitemap.includes(manifest.canonical_site + route), route + " lacks indexing coverage.");
  check(html.includes("Retrofit, Climate, Disaster, Reconstruction And Place-Stability Ledger") && html.includes("22 gates remain Inactive") && html.includes("Retrofit, repair, and decarbonization capabilities remain unassigned") && html.includes("Long-horizon place-stability tests remain unassigned") && html.includes("reconstruction is not community recovery"), route + " lacks its Phase 85 retrofit or place-stability boundary.");
}
const housingPlaceIndexHtml = await readText(routeToHtml("/evidence/housing-place-stability/"));
check(housingPlaceIndexHtml.includes("data-housing-place-stability-registry") && housingPlaceIndexHtml.includes("8 inactive delivery dossiers") && housingPlaceIndexHtml.includes("8 inactive tenure ledgers") && housingPlaceIndexHtml.includes("8 inactive stability registers") && housingPlaceIndexHtml.includes("8 inactive place ledgers") && housingPlaceIndexHtml.includes("0 housing decisions"), "The Phase 85 index is missing its registry or structural counts.");
check(hasCanonical(housingPlaceIndexHtml, manifest.canonical_site + "/evidence/housing-place-stability/"), "The Phase 85 index has the wrong canonical URL.");
check(sitemap.includes(manifest.canonical_site + "/evidence/housing-place-stability/"), "The Phase 85 index is missing from the sitemap.");

check(manifest.primary_preventive_community_care_access_routes.length === manifest.expected_build.phase_86_primary_preventive_community_care_access_dossiers, "The Phase 86 access-route count is invalid.");
for (const route of manifest.primary_preventive_community_care_access_routes) {
  const html = await readText(routeToHtml(route));
  check(hasRobots(html, "index, follow") && hasCanonical(html, manifest.canonical_site + route) && sitemap.includes(manifest.canonical_site + route), route + " lacks indexing coverage.");
  check(html.includes("Primary, Preventive And Community-Care Access Dossier") && html.includes("20 gates remain Inactive") && html.includes("Health-access care settings remain unassigned") && html.includes("Prevention and primary-care safeguards remain unassigned") && html.includes("Capacity is not access"), route + " lacks its Phase 86 access or prevention boundary.");
}
check(manifest.acute_emergency_specialty_behavioral_health_care_routes.length === manifest.expected_build.phase_86_acute_emergency_specialty_behavioral_health_care_ledgers, "The Phase 86 care-route count is invalid.");
for (const route of manifest.acute_emergency_specialty_behavioral_health_care_routes) {
  const html = await readText(routeToHtml(route));
  check(hasRobots(html, "index, follow") && hasCanonical(html, manifest.canonical_site + route) && sitemap.includes(manifest.canonical_site + route), route + " lacks indexing coverage.");
  check(html.includes("Acute, Emergency, Specialty And Behavioral-Health Care Ledger") && html.includes("20 gates remain Inactive") && html.includes("Acute and specialty service classes remain unassigned") && html.includes("Clinical quality and safety dimensions remain unassigned") && html.includes("Capacity is not access"), route + " lacks its Phase 86 clinical-care boundary.");
}
check(manifest.public_health_surveillance_prevention_environmental_exposure_routes.length === manifest.expected_build.phase_86_public_health_surveillance_prevention_environmental_exposure_registers, "The Phase 86 public-health route count is invalid.");
for (const route of manifest.public_health_surveillance_prevention_environmental_exposure_routes) {
  const html = await readText(routeToHtml(route));
  check(hasRobots(html, "index, follow") && hasCanonical(html, manifest.canonical_site + route) && sitemap.includes(manifest.canonical_site + route), route + " lacks indexing coverage.");
  check(html.includes("Public-Health Surveillance, Prevention And Environmental-Exposure Register") && html.includes("22 gates remain Inactive") && html.includes("Public-health functions remain unassigned") && html.includes("Surveillance-governance safeguards remain unassigned") && html.includes("Capacity is not access"), route + " lacks its Phase 86 public-health or exposure boundary.");
}
check(manifest.disability_equity_preparedness_population_wellbeing_routes.length === manifest.expected_build.phase_86_disability_equity_preparedness_population_wellbeing_ledgers, "The Phase 86 wellbeing-route count is invalid.");
for (const route of manifest.disability_equity_preparedness_population_wellbeing_routes) {
  const html = await readText(routeToHtml(route));
  check(hasRobots(html, "index, follow") && hasCanonical(html, manifest.canonical_site + route) && sitemap.includes(manifest.canonical_site + route), route + " lacks indexing coverage.");
  check(html.includes("Disability, Equity, Preparedness And Population-Wellbeing Ledger") && html.includes("22 gates remain Inactive") && html.includes("Disability-rights and support dimensions remain unassigned") && html.includes("Long-horizon population-health tests remain unassigned") && html.includes("service reopening is not population recovery"), route + " lacks its Phase 86 disability, preparedness, or wellbeing boundary.");
}
const healthWellbeingIndexHtml = await readText(routeToHtml("/evidence/health-population-wellbeing/"));
check(healthWellbeingIndexHtml.includes("data-health-population-wellbeing-registry") && healthWellbeingIndexHtml.includes("8 inactive access dossiers") && healthWellbeingIndexHtml.includes("8 inactive care ledgers") && healthWellbeingIndexHtml.includes("8 inactive public-health registers") && healthWellbeingIndexHtml.includes("8 inactive wellbeing ledgers") && healthWellbeingIndexHtml.includes("0 health decisions"), "The Phase 86 index is missing its registry or structural counts.");
check(hasCanonical(healthWellbeingIndexHtml, manifest.canonical_site + "/evidence/health-population-wellbeing/"), "The Phase 86 index has the wrong canonical URL.");
check(sitemap.includes(manifest.canonical_site + "/evidence/health-population-wellbeing/"), "The Phase 86 index is missing from the sitemap.");

check(manifest.early_childhood_school_access_inclusion_learning_routes.length === manifest.expected_build.phase_87_early_childhood_school_access_inclusion_learning_dossiers, "The Phase 87 school-route count is invalid.");
for (const route of manifest.early_childhood_school_access_inclusion_learning_routes) {
  const html = await readText(routeToHtml(route));
  check(hasRobots(html, "index, follow") && hasCanonical(html, manifest.canonical_site + route) && sitemap.includes(manifest.canonical_site + route), route + " lacks indexing coverage.");
  check(html.includes("Early-Childhood And School Access, Inclusion And Learning Dossier") && html.includes("20 gates remain Inactive") && html.includes("Education-access settings remain unassigned") && html.includes("Learning-condition safeguards remain unassigned") && html.includes("Enrollment is not learning"), route + " lacks its Phase 87 school-access or learning boundary.");
}
check(manifest.postsecondary_vocational_apprenticeship_affordability_routes.length === manifest.expected_build.phase_87_postsecondary_vocational_apprenticeship_affordability_ledgers, "The Phase 87 postsecondary-route count is invalid.");
for (const route of manifest.postsecondary_vocational_apprenticeship_affordability_routes) {
  const html = await readText(routeToHtml(route));
  check(hasRobots(html, "index, follow") && hasCanonical(html, manifest.canonical_site + route) && sitemap.includes(manifest.canonical_site + route), route + " lacks indexing coverage.");
  check(html.includes("Postsecondary, Vocational, Apprenticeship And Affordability Ledger") && html.includes("20 gates remain Inactive") && html.includes("Postsecondary-learning pathways remain unassigned") && html.includes("Postsecondary-affordability and support dimensions remain unassigned") && html.includes("Enrollment is not learning"), route + " lacks its Phase 87 postsecondary or affordability boundary.");
}
check(manifest.learning_capability_credential_skills_transition_routes.length === manifest.expected_build.phase_87_learning_capability_credential_skills_transition_registers, "The Phase 87 capability-route count is invalid.");
for (const route of manifest.learning_capability_credential_skills_transition_routes) {
  const html = await readText(routeToHtml(route));
  check(hasRobots(html, "index, follow") && hasCanonical(html, manifest.canonical_site + route) && sitemap.includes(manifest.canonical_site + route), route + " lacks indexing coverage.");
  check(html.includes("Learning, Capability, Credential, Skills And Transition Register") && html.includes("22 gates remain Inactive") && html.includes("Learning-capability domains remain unassigned") && html.includes("Skills, work, and civic-transition dimensions remain unassigned") && html.includes("Enrollment is not learning"), route + " lacks its Phase 87 capability or transition boundary.");
}
check(manifest.public_knowledge_culture_research_community_learning_routes.length === manifest.expected_build.phase_87_public_knowledge_culture_research_community_learning_ledgers, "The Phase 87 knowledge-route count is invalid.");
for (const route of manifest.public_knowledge_culture_research_community_learning_routes) {
  const html = await readText(routeToHtml(route));
  check(hasRobots(html, "index, follow") && hasCanonical(html, manifest.canonical_site + route) && sitemap.includes(manifest.canonical_site + route), route + " lacks indexing coverage.");
  check(html.includes("Public-Knowledge, Culture, Research And Community-Learning Ledger") && html.includes("22 gates remain Inactive") && html.includes("Public-knowledge institutions remain unassigned") && html.includes("Long-horizon human-development tests remain unassigned") && html.includes("institution reopening is not community learning recovery"), route + " lacks its Phase 87 public-knowledge or culture boundary.");
}
const educationKnowledgeCultureIndexHtml = await readText(routeToHtml("/evidence/education-knowledge-culture/"));
check(educationKnowledgeCultureIndexHtml.includes("data-education-knowledge-culture-registry") && educationKnowledgeCultureIndexHtml.includes("8 inactive school dossiers") && educationKnowledgeCultureIndexHtml.includes("8 inactive postsecondary ledgers") && educationKnowledgeCultureIndexHtml.includes("8 inactive capability registers") && educationKnowledgeCultureIndexHtml.includes("8 inactive knowledge ledgers") && educationKnowledgeCultureIndexHtml.includes("0 education decisions"), "The Phase 87 index is missing its registry or structural counts.");
check(hasCanonical(educationKnowledgeCultureIndexHtml, manifest.canonical_site + "/evidence/education-knowledge-culture/"), "The Phase 87 index has the wrong canonical URL.");
check(sitemap.includes(manifest.canonical_site + "/evidence/education-knowledge-culture/"), "The Phase 87 index is missing from the sitemap.");

check(manifest.job_access_matching_hiring_nondiscrimination_routes.length === manifest.expected_build.phase_88_job_access_matching_hiring_nondiscrimination_dossiers, "The Phase 88 job-access route count is invalid.");
for (const route of manifest.job_access_matching_hiring_nondiscrimination_routes) {
  const html = await readText(routeToHtml(route));
  check(hasRobots(html, "index, follow") && hasCanonical(html, manifest.canonical_site + route) && sitemap.includes(manifest.canonical_site + route), route + " lacks indexing coverage.");
  check(html.includes("Job Access, Matching, Hiring And Nondiscrimination Dossier") && html.includes("20 gates remain Inactive") && html.includes("Labor-market access channels remain unassigned") && html.includes("Job-matching and recruitment safeguards remain unassigned") && html.includes("A job posting is not an available job"), route + " lacks its Phase 88 job-access or hiring boundary.");
}
check(manifest.job_quality_wages_benefits_hours_safety_routes.length === manifest.expected_build.phase_88_job_quality_wages_benefits_hours_safety_ledgers, "The Phase 88 job-quality route count is invalid.");
for (const route of manifest.job_quality_wages_benefits_hours_safety_routes) {
  const html = await readText(routeToHtml(route));
  check(hasRobots(html, "index, follow") && hasCanonical(html, manifest.canonical_site + route) && sitemap.includes(manifest.canonical_site + route), route + " lacks indexing coverage.");
  check(html.includes("Job Quality, Wages, Benefits, Hours And Safety Ledger") && html.includes("20 gates remain Inactive") && html.includes("Employment-arrangement classes remain unassigned") && html.includes("Workplace health, safety, and continuity safeguards remain unassigned") && html.includes("A job posting is not an available job"), route + " lacks its Phase 88 job-quality or safety boundary.");
}
check(manifest.worker_voice_organizing_collective_bargaining_economic_democracy_routes.length === manifest.expected_build.phase_88_worker_voice_organizing_collective_bargaining_economic_democracy_registers, "The Phase 88 worker-voice route count is invalid.");
for (const route of manifest.worker_voice_organizing_collective_bargaining_economic_democracy_routes) {
  const html = await readText(routeToHtml(route));
  check(hasRobots(html, "index, follow") && hasCanonical(html, manifest.canonical_site + route) && sitemap.includes(manifest.canonical_site + route), route + " lacks indexing coverage.");
  check(html.includes("Worker Voice, Organizing, Collective Bargaining And Economic Democracy Register") && html.includes("22 gates remain Inactive") && html.includes("Worker-voice and representation models remain unassigned") && html.includes("Economic-democracy and ownership dimensions remain unassigned") && html.includes("A job posting is not an available job"), route + " lacks its Phase 88 worker-voice or economic-democracy boundary.");
}
check(manifest.livelihood_security_displacement_just_transition_long_horizon_routes.length === manifest.expected_build.phase_88_livelihood_security_displacement_just_transition_long_horizon_ledgers, "The Phase 88 livelihood route count is invalid.");
for (const route of manifest.livelihood_security_displacement_just_transition_long_horizon_routes) {
  const html = await readText(routeToHtml(route));
  check(hasRobots(html, "index, follow") && hasCanonical(html, manifest.canonical_site + route) && sitemap.includes(manifest.canonical_site + route), route + " lacks indexing coverage.");
  check(html.includes("Livelihood Security, Displacement, Just Transition And Long-Horizon Ledger") && html.includes("22 gates remain Inactive") && html.includes("Livelihood-security support systems remain unassigned") && html.includes("Long-horizon economic-agency tests remain unassigned") && html.includes("reemployment is not a just transition"), route + " lacks its Phase 88 livelihood or just-transition boundary.");
}
const workLaborLivelihoodsIndexHtml = await readText(routeToHtml("/evidence/work-labor-livelihoods/"));
check(workLaborLivelihoodsIndexHtml.includes("data-work-labor-livelihoods-registry") && workLaborLivelihoodsIndexHtml.includes("8 inactive job-access dossiers") && workLaborLivelihoodsIndexHtml.includes("8 inactive job-quality ledgers") && workLaborLivelihoodsIndexHtml.includes("8 inactive worker-voice registers") && workLaborLivelihoodsIndexHtml.includes("8 inactive livelihood ledgers") && workLaborLivelihoodsIndexHtml.includes("0 labor decisions"), "The Phase 88 index is missing its registry or structural counts.");
check(hasCanonical(workLaborLivelihoodsIndexHtml, manifest.canonical_site + "/evidence/work-labor-livelihoods/"), "The Phase 88 index has the wrong canonical URL.");
check(sitemap.includes(manifest.canonical_site + "/evidence/work-labor-livelihoods/"), "The Phase 88 index is missing from the sitemap.");

for (const [routes, expected, label, gates] of [
  [manifest.household_income_earnings_tax_transfer_resource_routes, manifest.expected_build.phase_89_household_income_earnings_tax_transfer_resource_dossiers, "Household Income, Earnings, Tax, Transfer And Resource Dossier", "20 gates remain Inactive"],
  [manifest.wealth_assets_debt_liabilities_intergenerational_balance_routes, manifest.expected_build.phase_89_wealth_assets_debt_liabilities_intergenerational_balance_ledgers, "Wealth, Assets, Debt, Liabilities And Intergenerational-Balance Ledger", "20 gates remain Inactive"],
  [manifest.poverty_deprivation_social_protection_benefit_access_routes, manifest.expected_build.phase_89_poverty_deprivation_social_protection_benefit_access_registers, "Poverty, Deprivation, Social Protection And Benefit-Access Register", "22 gates remain Inactive"],
  [manifest.economic_security_distribution_shock_mobility_long_horizon_routes, manifest.expected_build.phase_89_economic_security_distribution_shock_mobility_long_horizon_ledgers, "Economic Security, Distribution, Shock, Mobility And Long-Horizon Ledger", "22 gates remain Inactive"]
]) {
  check(routes.length === expected, `The Phase 89 ${label} route count is invalid.`);
  for (const route of routes) {
    const html = await readText(routeToHtml(route));
    check(hasRobots(html, "index, follow") && hasCanonical(html, manifest.canonical_site + route) && sitemap.includes(manifest.canonical_site + route), route + " lacks indexing coverage.");
    check(html.includes(label) && html.includes(gates) && html.includes("An income transfer is not freedom from poverty") && html.includes("poverty exit is not durable mobility"), route + " lacks its Phase 89 identity or non-substitution boundary.");
  }
}
const incomeWealthSecurityIndexHtml = await readText(routeToHtml("/evidence/income-wealth-economic-security/"));
check(incomeWealthSecurityIndexHtml.includes("data-income-wealth-economic-security-registry") && incomeWealthSecurityIndexHtml.includes("8 inactive income dossiers") && incomeWealthSecurityIndexHtml.includes("8 inactive wealth ledgers") && incomeWealthSecurityIndexHtml.includes("8 inactive protection registers") && incomeWealthSecurityIndexHtml.includes("8 inactive security ledgers") && incomeWealthSecurityIndexHtml.includes("0 economic-security decisions"), "The Phase 89 index is missing its registry or structural counts.");
check(hasCanonical(incomeWealthSecurityIndexHtml, manifest.canonical_site + "/evidence/income-wealth-economic-security/"), "The Phase 89 index has the wrong canonical URL.");
check(sitemap.includes(manifest.canonical_site + "/evidence/income-wealth-economic-security/"), "The Phase 89 index is missing from the sitemap.");

for (const [routes, expected, label, gates] of [
  [manifest.firm_formation_ownership_control_governance_routes, manifest.expected_build.phase_90_firm_formation_ownership_control_governance_dossiers, "Firm Formation, Ownership, Control And Governance Dossier", "20 gates remain Inactive"],
  [manifest.market_structure_competition_pricing_conduct_routes, manifest.expected_build.phase_90_market_structure_competition_pricing_conduct_ledgers, "Market Structure, Competition, Pricing And Conduct Ledger", "20 gates remain Inactive"],
  [manifest.corporate_power_platform_supply_chain_public_support_routes, manifest.expected_build.phase_90_corporate_power_platform_supply_chain_public_support_registers, "Corporate Power, Platform, Supply Chain And Public Support Register", "22 gates remain Inactive"],
  [manifest.democratic_economic_governance_rights_remedy_long_horizon_routes, manifest.expected_build.phase_90_democratic_economic_governance_rights_remedy_long_horizon_ledgers, "Democratic Economic Governance, Rights, Remedy And Long-Horizon Ledger", "22 gates remain Inactive"]
]) {
  check(routes.length === expected, `The Phase 90 ${label} route count is invalid.`);
  for (const route of routes) {
    const html = await readText(routeToHtml(route));
    check(hasRobots(html, "index, follow") && hasCanonical(html, manifest.canonical_site + route) && sitemap.includes(manifest.canonical_site + route), route + " lacks indexing coverage.");
    check(html.includes(label) && html.includes(gates) && html.includes("A firm count is not a competitive market") && html.includes("corporate disclosure is not democratic accountability"), route + " lacks its Phase 90 identity or non-substitution boundary.");
  }
}
const marketsFirmsGovernanceIndexHtml = await readText(routeToHtml("/evidence/markets-firms-economic-governance/"));
check(marketsFirmsGovernanceIndexHtml.includes("data-markets-firms-economic-governance-registry") && marketsFirmsGovernanceIndexHtml.includes("8 inactive firm dossiers") && marketsFirmsGovernanceIndexHtml.includes("8 inactive market ledgers") && marketsFirmsGovernanceIndexHtml.includes("8 inactive power registers") && marketsFirmsGovernanceIndexHtml.includes("8 inactive governance ledgers") && marketsFirmsGovernanceIndexHtml.includes("0 market-governance decisions"), "The Phase 90 index is missing its registry or structural counts.");
check(hasCanonical(marketsFirmsGovernanceIndexHtml, manifest.canonical_site + "/evidence/markets-firms-economic-governance/"), "The Phase 90 index has the wrong canonical URL.");
check(sitemap.includes(manifest.canonical_site + "/evidence/markets-firms-economic-governance/"), "The Phase 90 index is missing from the sitemap.");

for (const [routes, expected, label, gates] of [
  [manifest.money_payments_banking_access_settlement_routes, manifest.expected_build.phase_91_money_payments_banking_access_settlement_dossiers, "Money, Payments, Banking Access And Settlement Dossier", "20 gates remain Inactive"],
  [manifest.credit_underwriting_affordability_servicing_productive_allocation_routes, manifest.expected_build.phase_91_credit_underwriting_affordability_servicing_productive_allocation_ledgers, "Credit, Underwriting, Affordability, Servicing And Productive-Allocation Ledger", "20 gates remain Inactive"],
  [manifest.capital_markets_institutional_investment_insurance_risk_transfer_routes, manifest.expected_build.phase_91_capital_markets_institutional_investment_insurance_risk_transfer_registers, "Capital Markets, Institutional Investment, Insurance And Risk-Transfer Register", "22 gates remain Inactive"],
  [manifest.monetary_policy_systemic_risk_resolution_public_guarantee_democratic_finance_routes, manifest.expected_build.phase_91_monetary_policy_systemic_risk_resolution_public_guarantee_democratic_finance_ledgers, "Monetary Policy, Systemic Risk, Resolution, Public Guarantee And Democratic-Finance Ledger", "22 gates remain Inactive"]
]) {
  check(routes.length === expected, `The Phase 91 ${label} route count is invalid.`);
  for (const route of routes) {
    const html = await readText(routeToHtml(route));
    check(hasRobots(html, "index, follow") && hasCanonical(html, manifest.canonical_site + route) && sitemap.includes(manifest.canonical_site + route), route + " lacks indexing coverage.");
    check(html.includes(label) && html.includes(gates) && html.includes("Account access is not financial inclusion") && html.includes("financial innovation is not financial stability"), route + " lacks its Phase 91 identity or non-substitution boundary.");
  }
}
const financeBankingCreditStabilityIndexHtml = await readText(routeToHtml("/evidence/finance-banking-credit-financial-stability/"));
check(financeBankingCreditStabilityIndexHtml.includes("data-finance-banking-credit-financial-stability-registry") && financeBankingCreditStabilityIndexHtml.includes("8 inactive money dossiers") && financeBankingCreditStabilityIndexHtml.includes("8 inactive credit ledgers") && financeBankingCreditStabilityIndexHtml.includes("8 inactive capital registers") && financeBankingCreditStabilityIndexHtml.includes("8 inactive stability ledgers") && financeBankingCreditStabilityIndexHtml.includes("0 financial-system decisions"), "The Phase 91 index is missing its registry or structural counts.");
check(hasCanonical(financeBankingCreditStabilityIndexHtml, manifest.canonical_site + "/evidence/finance-banking-credit-financial-stability/"), "The Phase 91 index has the wrong canonical URL.");
check(sitemap.includes(manifest.canonical_site + "/evidence/finance-banking-credit-financial-stability/"), "The Phase 91 index is missing from the sitemap.");

for (const [routes, expected, label, gates] of [
  [manifest.public_revenue_tax_expenditure_distribution_compliance_routes, manifest.expected_build.phase_92_public_revenue_tax_expenditure_distribution_compliance_dossiers, "Public Revenue, Tax Expenditure, Distribution And Compliance Dossier", "20 gates remain Inactive"],
  [manifest.budget_expenditure_stabilizer_delivery_public_value_routes, manifest.expected_build.phase_92_budget_expenditure_stabilizer_delivery_public_value_ledgers, "Budget, Expenditure, Stabilizer, Delivery And Public-Value Ledger", "20 gates remain Inactive"],
  [manifest.sovereign_debt_fiscal_rule_public_balance_sheet_resilience_routes, manifest.expected_build.phase_92_sovereign_debt_fiscal_rule_public_balance_sheet_resilience_registers, "Sovereign Debt, Fiscal Rule, Public Balance Sheet And Resilience Register", "22 gates remain Inactive"],
  [manifest.trade_external_balance_supply_resilience_macroeconomic_coordination_routes, manifest.expected_build.phase_92_trade_external_balance_supply_resilience_macroeconomic_coordination_ledgers, "Trade, External Balance, Supply Resilience And Macroeconomic-Coordination Ledger", "24 gates remain Inactive"]
]) {
  check(routes.length === expected, `The Phase 92 ${label} route count is invalid.`);
  for (const route of routes) {
    const html = await readText(routeToHtml(route));
    check(hasRobots(html, "index, follow") && hasCanonical(html, manifest.canonical_site + route) && sitemap.includes(manifest.canonical_site + route), route + " lacks indexing coverage.");
    check(html.includes(label) && html.includes(gates) && html.includes("Revenue is not justice") && html.includes("aggregate stabilization is not democratic legitimacy"), route + " lacks its Phase 92 identity or non-substitution boundary.");
  }
}
const fiscalRevenueDebtMacroIndexHtml = await readText(routeToHtml("/evidence/fiscal-revenue-debt-trade-macro-coordination/"));
check(fiscalRevenueDebtMacroIndexHtml.includes("data-fiscal-revenue-debt-trade-macro-registry") && fiscalRevenueDebtMacroIndexHtml.includes("8 inactive revenue dossiers") && fiscalRevenueDebtMacroIndexHtml.includes("8 inactive budget ledgers") && fiscalRevenueDebtMacroIndexHtml.includes("8 inactive debt registers") && fiscalRevenueDebtMacroIndexHtml.includes("8 inactive macro ledgers") && fiscalRevenueDebtMacroIndexHtml.includes("0 fiscal or macro decisions"), "The Phase 92 index is missing its registry or structural counts.");
check(hasCanonical(fiscalRevenueDebtMacroIndexHtml, manifest.canonical_site + "/evidence/fiscal-revenue-debt-trade-macro-coordination/"), "The Phase 92 index has the wrong canonical URL.");
check(sitemap.includes(manifest.canonical_site + "/evidence/fiscal-revenue-debt-trade-macro-coordination/"), "The Phase 92 index is missing from the sitemap.");

for (const [routes, expected, label, gates] of [
  [manifest.economic_development_mission_sector_strategy_production_ecosystem_routes, manifest.expected_build.phase_93_economic_development_mission_sector_strategy_production_ecosystem_dossiers, "Economic Development Mission, Sector Strategy And Production-Ecosystem Dossier", "20 gates remain Inactive"],
  [manifest.innovation_research_diffusion_commercialization_standards_routes, manifest.expected_build.phase_93_innovation_research_diffusion_commercialization_standards_ledgers, "Innovation, Research, Diffusion, Commercialization And Standards Ledger", "20 gates remain Inactive"],
  [manifest.regional_cluster_corridor_supplier_workforce_convergence_routes, manifest.expected_build.phase_93_regional_cluster_corridor_supplier_workforce_convergence_registers, "Regional Cluster, Corridor, Supplier, Workforce And Convergence Register", "22 gates remain Inactive"],
  [manifest.productive_transformation_diversification_decarbonization_shared_prosperity_routes, manifest.expected_build.phase_93_productive_transformation_diversification_decarbonization_shared_prosperity_ledgers, "Productive Transformation, Diversification, Decarbonization And Shared-Prosperity Ledger", "24 gates remain Inactive"]
]) {
  check(routes.length === expected, `The Phase 93 ${label} route count is invalid.`);
  for (const route of routes) {
    const html = await readText(routeToHtml(route));
    check(hasRobots(html, "index, follow") && hasCanonical(html, manifest.canonical_site + route) && sitemap.includes(manifest.canonical_site + route), route + " lacks indexing coverage.");
    check(html.includes(label) && html.includes(gates) && html.includes("Subsidies are not productive capacity") && html.includes("output growth is not just transformation"), route + " lacks its Phase 93 identity or non-substitution boundary.");
  }
}
const economicDevelopmentTransformationIndexHtml = await readText(routeToHtml("/evidence/economic-development-industrial-strategy-productive-transformation/"));
check(economicDevelopmentTransformationIndexHtml.includes("data-economic-development-industrial-strategy-registry") && economicDevelopmentTransformationIndexHtml.includes("8 inactive strategy dossiers") && economicDevelopmentTransformationIndexHtml.includes("8 inactive innovation ledgers") && economicDevelopmentTransformationIndexHtml.includes("8 inactive region registers") && economicDevelopmentTransformationIndexHtml.includes("8 inactive transformation ledgers") && economicDevelopmentTransformationIndexHtml.includes("0 development decisions"), "The Phase 93 index is missing its registry or structural counts.");
check(hasCanonical(economicDevelopmentTransformationIndexHtml, manifest.canonical_site + "/evidence/economic-development-industrial-strategy-productive-transformation/"), "The Phase 93 index has the wrong canonical URL.");
check(sitemap.includes(manifest.canonical_site + "/evidence/economic-development-industrial-strategy-productive-transformation/"), "The Phase 93 index is missing from the sitemap.");

for (const [routes, expected, label, gates] of [
  [manifest.energy_water_industrial_utility_reliability_routes, manifest.expected_build.phase_94_energy_water_industrial_utility_reliability_dossiers, "Energy, Water And Industrial-Utility Reliability Dossier", "20 gates remain Inactive"],
  [manifest.minerals_materials_processing_circularity_qualification_routes, manifest.expected_build.phase_94_minerals_materials_processing_circularity_qualification_ledgers, "Minerals, Materials, Processing, Circularity And Qualification Ledger", "20 gates remain Inactive"],
  [manifest.manufacturing_equipment_automation_maintenance_quality_accepted_production_routes, manifest.expected_build.phase_94_manufacturing_equipment_automation_maintenance_quality_accepted_production_registers, "Manufacturing, Equipment, Automation, Maintenance, Quality And Accepted-Production Register", "22 gates remain Inactive"],
  [manifest.logistics_inventory_strategic_reserves_emergency_conversion_supply_chain_resilience_routes, manifest.expected_build.phase_94_logistics_inventory_strategic_reserves_emergency_conversion_supply_chain_resilience_ledgers, "Logistics, Inventory, Strategic Reserves, Emergency Conversion And Supply-Chain Resilience Ledger", "24 gates remain Inactive"]
]) {
  check(routes.length === expected, `The Phase 94 ${label} route count is invalid.`);
  for (const route of routes) {
    const html = await readText(routeToHtml(route));
    check(hasRobots(html, "index, follow") && hasCanonical(html, manifest.canonical_site + route) && sitemap.includes(manifest.canonical_site + route), route + " lacks indexing coverage.");
    check(html.includes(label) && html.includes(gates) && html.includes("Installed capacity is not delivered reliable energy") && html.includes("factory announcement is not accepted production"), route + " lacks its Phase 94 identity or non-substitution boundary.");
  }
}
const physicalEconomySupplyChainIndexHtml = await readText(routeToHtml("/evidence/energy-materials-manufacturing-supply-chains/"));
check(physicalEconomySupplyChainIndexHtml.includes("data-energy-materials-manufacturing-supply-chain-registry") && physicalEconomySupplyChainIndexHtml.includes("8 inactive utility dossiers") && physicalEconomySupplyChainIndexHtml.includes("8 inactive material ledgers") && physicalEconomySupplyChainIndexHtml.includes("8 inactive manufacturing registers") && physicalEconomySupplyChainIndexHtml.includes("8 inactive supply-chain ledgers") && physicalEconomySupplyChainIndexHtml.includes("0 physical-economy decisions"), "The Phase 94 index is missing its registry or structural counts.");
check(hasCanonical(physicalEconomySupplyChainIndexHtml, manifest.canonical_site + "/evidence/energy-materials-manufacturing-supply-chains/"), "The Phase 94 index has the wrong canonical URL.");
check(sitemap.includes(manifest.canonical_site + "/evidence/energy-materials-manufacturing-supply-chains/"), "The Phase 94 index is missing from the sitemap.");

for (const [routes, expected, label, gates] of [
  [manifest.spatial_planning_land_assembly_rights_of_way_site_readiness_routes, manifest.expected_build.phase_95_spatial_planning_land_assembly_rights_of_way_site_readiness_dossiers, "Spatial Planning, Land Assembly, Rights Of Way And Site-Readiness Dossier", "20 gates remain Inactive"],
  [manifest.project_design_engineering_cost_estimation_permitting_procurement_routes, manifest.expected_build.phase_95_project_design_engineering_cost_estimation_permitting_procurement_ledgers, "Project Design, Engineering, Cost Estimation, Permitting And Procurement Ledger", "22 gates remain Inactive"],
  [manifest.construction_contractors_trades_materials_safety_inspection_routes, manifest.expected_build.phase_95_construction_contractors_trades_materials_safety_inspection_registers, "Construction, Contractors, Trades, Materials, Safety And Inspection Register", "22 gates remain Inactive"],
  [manifest.commissioning_accessibility_asset_handover_operations_maintenance_adaptation_reconstruction_territorial_value_routes, manifest.expected_build.phase_95_commissioning_accessibility_asset_handover_operations_maintenance_adaptation_reconstruction_territorial_value_ledgers, "Commissioning, Accessibility, Asset Handover, Operations, Maintenance, Adaptation, Reconstruction And Territorial-Value Ledger", "24 gates remain Inactive"]
]) {
  check(routes.length === expected, `The Phase 95 ${label} route count is invalid.`);
  for (const route of routes) {
    const html = await readText(routeToHtml(route));
    check(hasRobots(html, "index, follow") && hasCanonical(html, manifest.canonical_site + route) && sitemap.includes(manifest.canonical_site + route), route + " lacks indexing coverage.");
    check(html.includes(label) && html.includes(gates) && html.includes("capital plan is not an executable project") && html.includes("substantial completion is not safe accessible service"), route + " lacks its Phase 95 identity or non-substitution boundary.");
  }
}
const territorialSystemsDeliveryIndexHtml = await readText(routeToHtml("/evidence/infrastructure-construction-buildings-public-works-territorial-systems/"));
check(territorialSystemsDeliveryIndexHtml.includes("data-infrastructure-construction-territorial-systems-registry") && territorialSystemsDeliveryIndexHtml.includes("8 inactive territorial dossiers") && territorialSystemsDeliveryIndexHtml.includes("8 inactive project ledgers") && territorialSystemsDeliveryIndexHtml.includes("8 inactive construction registers") && territorialSystemsDeliveryIndexHtml.includes("8 inactive stewardship ledgers") && territorialSystemsDeliveryIndexHtml.includes("0 territorial-delivery decisions"), "The Phase 95 index is missing its registry or structural counts.");
check(hasCanonical(territorialSystemsDeliveryIndexHtml, manifest.canonical_site + "/evidence/infrastructure-construction-buildings-public-works-territorial-systems/"), "The Phase 95 index has the wrong canonical URL.");
check(sitemap.includes(manifest.canonical_site + "/evidence/infrastructure-construction-buildings-public-works-territorial-systems/"), "The Phase 95 index is missing from the sitemap.");

for (const [routes, expected, label, gates] of [
  [manifest.passenger_mobility_demand_accessibility_affordability_inclusion_routes, manifest.expected_build.phase_96_passenger_mobility_demand_accessibility_affordability_inclusion_dossiers, "Passenger Mobility Demand, Accessibility, Affordability And Inclusion Dossier", "20 gates remain Inactive"],
  [manifest.multimodal_transportation_service_planning_operations_safety_reliability_routes, manifest.expected_build.phase_96_multimodal_transportation_service_planning_operations_safety_reliability_ledgers, "Multimodal Transportation Service Planning, Operations, Safety And Reliability Ledger", "22 gates remain Inactive"],
  [manifest.freight_goods_movement_intermodal_logistics_delivery_resilience_routes, manifest.expected_build.phase_96_freight_goods_movement_intermodal_logistics_delivery_resilience_registers, "Freight, Goods Movement, Intermodal Logistics And Delivery-Resilience Register", "22 gates remain Inactive"],
  [manifest.communications_broadband_mobile_digital_public_infrastructure_interoperability_territorial_access_routes, manifest.expected_build.phase_96_communications_broadband_mobile_digital_public_infrastructure_interoperability_territorial_access_ledgers, "Communications, Broadband, Mobile, Digital Public Infrastructure, Interoperability And Territorial-Access Ledger", "24 gates remain Inactive"]
]) {
  check(routes.length === expected, `The Phase 96 ${label} route count is invalid.`);
  for (const route of routes) {
    const html = await readText(routeToHtml(route));
    check(hasRobots(html, "index, follow") && hasCanonical(html, manifest.canonical_site + route) && sitemap.includes(manifest.canonical_site + route), route + " lacks indexing coverage.");
    check(html.includes(label) && html.includes(gates) && html.includes("Infrastructure availability is not usable access") && html.includes("network coverage is not affordable reliable connectivity"), route + " lacks its Phase 96 identity or non-substitution boundary.");
  }
}
const mobilityNetworkAccessIndexHtml = await readText(routeToHtml("/evidence/mobility-transportation-freight-communications-digital-networks/"));
check(mobilityNetworkAccessIndexHtml.includes("data-mobility-transportation-freight-digital-access-registry") && mobilityNetworkAccessIndexHtml.includes("8 inactive mobility dossiers") && mobilityNetworkAccessIndexHtml.includes("8 inactive service ledgers") && mobilityNetworkAccessIndexHtml.includes("8 inactive freight registers") && mobilityNetworkAccessIndexHtml.includes("8 inactive digital ledgers") && mobilityNetworkAccessIndexHtml.includes("0 mobility or access decisions"), "The Phase 96 index is missing its registry or structural counts.");
check(hasCanonical(mobilityNetworkAccessIndexHtml, manifest.canonical_site + "/evidence/mobility-transportation-freight-communications-digital-networks/"), "The Phase 96 index has the wrong canonical URL.");
check(sitemap.includes(manifest.canonical_site + "/evidence/mobility-transportation-freight-communications-digital-networks/"), "The Phase 96 index is missing from the sitemap.");

for (const [routes, expected, label, gates] of [
  [manifest.greenhouse_gas_emissions_climate_mitigation_decarbonization_transition_routes, manifest.expected_build.phase_97_greenhouse_gas_emissions_climate_mitigation_decarbonization_transition_dossiers, "Greenhouse-Gas Emissions, Climate Mitigation, Decarbonization And Transition Dossier", "20 gates remain Inactive"],
  [manifest.air_water_soil_noise_chemical_pollution_exposure_environmental_justice_routes, manifest.expected_build.phase_97_air_water_soil_noise_chemical_pollution_exposure_environmental_justice_ledgers, "Air, Water, Soil, Noise, Chemical Pollution, Exposure And Environmental-Justice Ledger", "22 gates remain Inactive"],
  [manifest.ecosystems_biodiversity_habitat_land_freshwater_ocean_restoration_routes, manifest.expected_build.phase_97_ecosystems_biodiversity_habitat_land_freshwater_ocean_restoration_registers, "Ecosystems, Biodiversity, Habitat, Land, Freshwater, Ocean And Restoration Register", "22 gates remain Inactive"],
  [manifest.waste_materials_circularity_climate_adaptation_disaster_risk_planetary_system_stewardship_routes, manifest.expected_build.phase_97_waste_materials_circularity_climate_adaptation_disaster_risk_planetary_system_stewardship_ledgers, "Waste, Materials, Circularity, Climate Adaptation, Disaster Risk And Planetary-System Stewardship Ledger", "24 gates remain Inactive"]
]) {
  check(routes.length === expected, `The Phase 97 ${label} route count is invalid.`);
  for (const route of routes) {
    const html = await readText(routeToHtml(route));
    check(hasRobots(html, "index, follow") && hasCanonical(html, manifest.canonical_site + route) && sitemap.includes(manifest.canonical_site + route), route + " lacks indexing coverage.");
    check(html.includes(label) && html.includes(gates) && html.includes("An emissions target is not delivered decarbonization") && html.includes("protected-area designation is not ecosystem recovery"), route + " lacks its Phase 97 identity or non-substitution boundary.");
  }
}
const environmentPlanetaryStewardshipIndexHtml = await readText(routeToHtml("/evidence/environment-climate-ecosystems-pollution-waste-circularity/"));
check(environmentPlanetaryStewardshipIndexHtml.includes("data-environment-climate-ecosystem-planetary-registry") && environmentPlanetaryStewardshipIndexHtml.includes("8 inactive climate dossiers") && environmentPlanetaryStewardshipIndexHtml.includes("8 inactive pollution ledgers") && environmentPlanetaryStewardshipIndexHtml.includes("8 inactive ecosystem registers") && environmentPlanetaryStewardshipIndexHtml.includes("8 inactive planetary ledgers") && environmentPlanetaryStewardshipIndexHtml.includes("0 environmental decisions"), "The Phase 97 index is missing its registry or structural counts.");
check(hasCanonical(environmentPlanetaryStewardshipIndexHtml, manifest.canonical_site + "/evidence/environment-climate-ecosystems-pollution-waste-circularity/"), "The Phase 97 index has the wrong canonical URL.");
check(sitemap.includes(manifest.canonical_site + "/evidence/environment-climate-ecosystems-pollution-waste-circularity/"), "The Phase 97 index is missing from the sitemap.");

for (const [routes, expected, label, gates] of [
  [manifest.rights_rule_of_law_courts_legal_aid_access_to_justice_routes, manifest.expected_build.phase_98_rights_rule_of_law_courts_legal_aid_access_to_justice_dossiers, "Rights, Rule Of Law, Courts, Legal Aid And Access-To-Justice Dossier", "20 gates remain Inactive"],
  [manifest.public_safety_violence_prevention_policing_fire_corrections_accountability_routes, manifest.expected_build.phase_98_public_safety_violence_prevention_policing_fire_corrections_accountability_ledgers, "Public Safety, Violence Prevention, Policing, Fire, Corrections And Accountability Ledger", "22 gates remain Inactive"],
  [manifest.emergency_management_civil_protection_critical_system_security_resilience_routes, manifest.expected_build.phase_98_emergency_management_civil_protection_critical_system_security_resilience_registers, "Emergency Management, Civil Protection, Critical-System Security And Resilience Register", "22 gates remain Inactive"],
  [manifest.defense_intelligence_conflict_prevention_civilian_protection_peace_stewardship_routes, manifest.expected_build.phase_98_defense_intelligence_conflict_prevention_civilian_protection_peace_stewardship_ledgers, "Defense, Intelligence, Conflict Prevention, Civilian Protection And Peace-Stewardship Ledger", "24 gates remain Inactive"]
]) {
  check(routes.length === expected, `The Phase 98 ${label} route count is invalid.`);
  for (const route of routes) {
    const html = await readText(routeToHtml(route));
    check(hasRobots(html, "index, follow") && hasCanonical(html, manifest.canonical_site + route) && sitemap.includes(manifest.canonical_site + route), route + " lacks indexing coverage.");
    check(html.includes(label) && html.includes(gates) && html.includes("A law on the books is not access to justice") && html.includes("a ceasefire is not durable peace"), route + " lacks its Phase 98 identity or non-substitution boundary.");
  }
}
const justiceSafetySecurityPeaceIndexHtml = await readText(routeToHtml("/evidence/law-justice-public-safety-emergency-security-defense-peace/"));
check(justiceSafetySecurityPeaceIndexHtml.includes("data-law-justice-safety-emergency-security-peace-registry") && justiceSafetySecurityPeaceIndexHtml.includes("8 inactive justice dossiers") && justiceSafetySecurityPeaceIndexHtml.includes("8 inactive safety ledgers") && justiceSafetySecurityPeaceIndexHtml.includes("8 inactive emergency registers") && justiceSafetySecurityPeaceIndexHtml.includes("8 inactive peace ledgers") && justiceSafetySecurityPeaceIndexHtml.includes("0 justice or security decisions"), "The Phase 98 index is missing its registry or structural counts.");
check(hasCanonical(justiceSafetySecurityPeaceIndexHtml, manifest.canonical_site + "/evidence/law-justice-public-safety-emergency-security-defense-peace/"), "The Phase 98 index has the wrong canonical URL.");
check(sitemap.includes(manifest.canonical_site + "/evidence/law-justice-public-safety-emergency-security-defense-peace/"), "The Phase 98 index is missing from the sitemap.");

for (const [routes, expected, label, gates] of [
  [manifest.elections_representation_participation_inclusion_democratic_integrity_routes, manifest.expected_build.phase_99_elections_representation_participation_inclusion_democratic_integrity_dossiers, "Elections, Representation, Participation, Inclusion And Democratic-Integrity Dossier", "20 gates remain Inactive"],
  [manifest.constitutional_legislative_executive_public_administration_capability_routes, manifest.expected_build.phase_99_constitutional_legislative_executive_public_administration_capability_ledgers, "Constitutional, Legislative, Executive And Public-Administration Capability Ledger", "22 gates remain Inactive"],
  [manifest.public_accountability_fiscal_transparency_audit_procurement_integrity_open_government_routes, manifest.expected_build.phase_99_public_accountability_fiscal_transparency_audit_procurement_integrity_open_government_registers, "Public Accountability, Fiscal Transparency, Audit, Procurement Integrity And Open-Government Register", "22 gates remain Inactive"],
  [manifest.civic_information_media_pluralism_public_trust_institutional_legitimacy_democratic_resilience_routes, manifest.expected_build.phase_99_civic_information_media_pluralism_public_trust_institutional_legitimacy_democratic_resilience_ledgers, "Civic Information, Media Pluralism, Public Trust, Institutional Legitimacy And Democratic-Resilience Ledger", "24 gates remain Inactive"]
]) {
  check(routes.length === expected, "The Phase 99 " + label + " route count is invalid.");
  for (const route of routes) {
    const html = await readText(routeToHtml(route));
    check(hasRobots(html, "index, follow") && hasCanonical(html, manifest.canonical_site + route) && sitemap.includes(manifest.canonical_site + route), route + " lacks indexing coverage.");
    check(html.includes(label) && html.includes(gates) && html.includes("An election held is not representative democracy") && html.includes("continuity is not democratic resilience"), route + " lacks its Phase 99 identity or non-substitution boundary.");
  }
}
const democracyGovernmentLegitimacyIndexHtml = await readText(routeToHtml("/evidence/democracy-government-public-administration-civic-information-institutional-legitimacy/"));
check(democracyGovernmentLegitimacyIndexHtml.includes("data-democracy-government-civic-information-legitimacy-registry") && democracyGovernmentLegitimacyIndexHtml.includes("8 inactive democracy dossiers") && democracyGovernmentLegitimacyIndexHtml.includes("8 inactive government ledgers") && democracyGovernmentLegitimacyIndexHtml.includes("8 inactive accountability registers") && democracyGovernmentLegitimacyIndexHtml.includes("8 inactive legitimacy ledgers") && democracyGovernmentLegitimacyIndexHtml.includes("0 democracy or legitimacy decisions"), "The Phase 99 index is missing its registry or structural counts.");
check(hasCanonical(democracyGovernmentLegitimacyIndexHtml, manifest.canonical_site + "/evidence/democracy-government-public-administration-civic-information-institutional-legitimacy/"), "The Phase 99 index has the wrong canonical URL.");
check(sitemap.includes(manifest.canonical_site + "/evidence/democracy-government-public-administration-civic-information-institutional-legitimacy/"), "The Phase 99 index is missing from the sitemap.");

for (const [routes, expected, label, gates] of [
  [manifest.international_order_diplomacy_treaties_international_law_peaceful_dispute_resolution_routes, manifest.expected_build.phase_100_international_order_diplomacy_treaties_international_law_peaceful_dispute_resolution_dossiers, "International Order, Diplomacy, Treaties, International Law And Peaceful-Dispute-Resolution Dossier", "20 gates remain Inactive"],
  [manifest.multilateral_institutions_representation_development_cooperation_collective_delivery_routes, manifest.expected_build.phase_100_multilateral_institutions_representation_development_cooperation_collective_delivery_ledgers, "Multilateral Institutions, Representation, Development Cooperation And Collective-Delivery Ledger", "22 gates remain Inactive"],
  [manifest.migration_displacement_refugee_asylum_humanitarian_protection_shared_responsibility_routes, manifest.expected_build.phase_100_migration_displacement_refugee_asylum_humanitarian_protection_shared_responsibility_registers, "Migration, Displacement, Refugee, Asylum, Humanitarian Protection And Shared-Responsibility Register", "22 gates remain Inactive"],
  [manifest.global_commons_transboundary_risk_catastrophic_risk_intergenerational_shared_human_futures_routes, manifest.expected_build.phase_100_global_commons_transboundary_risk_catastrophic_risk_intergenerational_shared_human_futures_ledgers, "Global Commons, Transboundary Risk, Catastrophic Risk, Intergenerational And Shared-Human-Futures Ledger", "24 gates remain Inactive"]
]) {
  check(routes.length === expected, "The Phase 100 " + label + " route count is invalid.");
  for (const route of routes) {
    const html = await readText(routeToHtml(route));
    check(hasRobots(html, "index, follow") && hasCanonical(html, manifest.canonical_site + route) && sitemap.includes(manifest.canonical_site + route), route + " lacks indexing coverage.");
    check(html.includes(label) && html.includes(gates) && html.includes("A treaty signed is not effective cooperation") && html.includes("global goal is not a secured shared future"), route + " lacks its Phase 100 identity or non-substitution boundary.");
  }
}
const internationalOrderSharedFuturesIndexHtml = await readText(routeToHtml("/evidence/international-order-multilateral-cooperation-global-commons-cross-border-risk-shared-human-futures/"));
check(internationalOrderSharedFuturesIndexHtml.includes("data-international-order-multilateral-global-commons-shared-futures-registry") && internationalOrderSharedFuturesIndexHtml.includes("8 inactive international-order dossiers") && internationalOrderSharedFuturesIndexHtml.includes("8 inactive multilateral ledgers") && internationalOrderSharedFuturesIndexHtml.includes("8 inactive humanitarian registers") && internationalOrderSharedFuturesIndexHtml.includes("8 inactive shared-futures ledgers") && internationalOrderSharedFuturesIndexHtml.includes("0 treaty or shared-futures decisions"), "The Phase 100 index is missing its registry or structural counts.");
check(hasCanonical(internationalOrderSharedFuturesIndexHtml, manifest.canonical_site + "/evidence/international-order-multilateral-cooperation-global-commons-cross-border-risk-shared-human-futures/"), "The Phase 100 index has the wrong canonical URL.");
check(sitemap.includes(manifest.canonical_site + "/evidence/international-order-multilateral-cooperation-global-commons-cross-border-risk-shared-human-futures/"), "The Phase 100 index is missing from the sitemap.");

async function verifyTerminalPhaseRoutes(config) {
  const routes = config.routeKeys.flatMap((key) => manifest[key] ?? []);
  check(routes.length === 32, `The Phase ${config.phase} manifest must contain thirty-two detail routes.`);
  for (const route of routes) {
    const html = await readText(routeToHtml(route));
    check(html.includes("gates remain Inactive") && html.includes(config.boundaryStart) && html.includes(config.boundaryEnd), `${route} lacks its Phase ${config.phase} gate or non-substitution boundary.`);
    check(hasCanonical(html, manifest.canonical_site + route), `${route} has the wrong canonical URL.`);
    check(sitemap.includes(manifest.canonical_site + route), `${route} is missing from the sitemap.`);
  }
  const indexRoute = `/evidence/${config.routeBase}/`;
  const indexHtml = await readText(routeToHtml(indexRoute));
  check(indexHtml.includes(config.indexMarker) && config.indexCounts.every((label) => indexHtml.includes(label)) && indexHtml.includes(config.zeroLabel), `The Phase ${config.phase} index is missing its registry or structural counts.`);
  check(hasCanonical(indexHtml, manifest.canonical_site + indexRoute), `The Phase ${config.phase} index has the wrong canonical URL.`);
  check(sitemap.includes(manifest.canonical_site + indexRoute), `The Phase ${config.phase} index is missing from the sitemap.`);
}

await verifyTerminalPhaseRoutes({
  phase: 101,
  routeBase: "whole-system-futures-scenario-governance-polycrisis-readiness-civilizational-resilience-future-generations",
  routeKeys: ["whole_system_scenario_assumption_boundary_driver_uncertainty_routes", "cross_domain_dependency_cascade_compound_risk_polycrisis_stress_test_routes", "preparedness_option_portfolio_continuity_recovery_transformation_routes", "civilizational_resilience_renewal_future_generations_stewardship_routes"],
  boundaryStart: "A scenario is not a forecast",
  boundaryEnd: "continuity is not renewal",
  indexMarker: "data-whole-system-futures-polycrisis-civilizational-resilience-registry",
  indexCounts: ["8 inactive scenario dossiers", "8 inactive polycrisis ledgers", "8 inactive readiness registers", "8 inactive resilience ledgers"],
  zeroLabel: "0 scenario or resilience decisions",
});

await verifyTerminalPhaseRoutes({
  phase: 102,
  routeBase: "public-knowledge-synthesis-civic-decision-literacy-reader-navigation-content-closure-evergreen-stewardship",
  routeKeys: ["canonical_public_synthesis_claim_boundary_evidence_lineage_routes", "civic_decision_literacy_uncertainty_tradeoff_public_reason_routes", "reader_navigation_learning_pathway_accessibility_translation_routes", "content_completeness_maintenance_correction_archive_evergreen_stewardship_routes"],
  boundaryStart: "A synthesis is not new evidence",
  boundaryEnd: "stable page is not evergreen truth",
  indexMarker: "data-public-knowledge-decision-literacy-content-stewardship-registry",
  indexCounts: ["8 inactive synthesis dossiers", "8 inactive literacy ledgers", "8 inactive navigation registers", "8 inactive stewardship ledgers"],
  zeroLabel: "0 content-closure decisions",
});

check(
  manifest.reader_pathway_routes.length === manifest.expected_build.reader_pathway_surfaces,
  `Expected ${manifest.expected_build.reader_pathway_surfaces} reader-pathway surfaces, found ${manifest.reader_pathway_routes.length}.`,
);
check(
  atlasHtml.includes("data-reader-pathway-index"),
  "Atlas index is missing the reader-pathway index.",
);
for (const pathway of readerPathways) {
  check(atlasHtml.includes(pathway.title), `Atlas index is missing reader pathway: ${pathway.title}.`);
}
for (const route of manifest.reader_pathway_routes) {
  const html = await readText(routeToHtml(route));
  check(html.includes("data-reader-pathway="), `${route} is missing a reader pathway.`);
  check(html.includes("Current State"), `${route} is missing the Current State section.`);
  check(html.includes("Dependency Stack"), `${route} is missing the Dependency Stack section.`);
  check(html.includes("Evidence Limits"), `${route} is missing the Evidence Limits section.`);
  check(html.includes("Published Evidence"), `${route} is missing the Published Evidence section.`);
  check(html.includes("What To Watch Next"), `${route} is missing the What To Watch Next section.`);
  check(hasCanonical(html, `${manifest.canonical_site}${route}`), `${route} has the wrong canonical URL.`);
  check(sitemap.includes(`${manifest.canonical_site}${route}`), `${route} is missing from the sitemap.`);
}

const phase55QDecisions = evidenceGaps.filter((gap) => gap.latest_review?.phase === "Phase 55Q");
check(
  phase55QDecisions.length === manifest.expected_build.phase_55q_gap_decisions,
  `Expected ${manifest.expected_build.phase_55q_gap_decisions} Phase 55Q evidence decisions, found ${phase55QDecisions.length}.`,
);
const expectedPhase55QRoutes = phase55QDecisions
  .map((gap) => `/atlas/evidence-gaps/${gap.slug}/`)
  .sort();
check(
  JSON.stringify(expectedPhase55QRoutes) === JSON.stringify([...manifest.phase_55q_gap_routes].sort()),
  "Phase 55Q evidence-gap route membership does not match the manifest.",
);
for (const gap of phase55QDecisions) {
  const route = `/atlas/evidence-gaps/${gap.slug}/`;
  const html = await readText(routeToHtml(route));
  check(html.includes('data-evidence-decision="Phase 55Q"'), `${route} is missing the Phase 55Q decision marker.`);
  check(html.includes("Named Authoritative Records"), `${route} is missing named authoritative records.`);
  check(html.includes("Stage Result"), `${route} is missing the stage result.`);
  check(html.includes("Stop Rule"), `${route} is missing the stop rule.`);
  check(hasCanonical(html, `${manifest.canonical_site}${route}`), `${route} has the wrong canonical URL.`);
  check(sitemap.includes(`${manifest.canonical_site}${route}`), `${route} is missing from the sitemap.`);
}

check(
  v03EditorialExport.dataset === "v03_editorial_review" &&
  v03EditorialExport.count === manifest.expected_build.v03_editorial_routes &&
  v03EditorialExport.program?.record_status === "Published" &&
  v03EditorialExport.program?.translation_pilots?.every((pilot) => pilot.status === "In Review" && pilot.publication_route === null),
  "The v0.3 public export must preserve 120 editorial routes and unrouteable In Review translation pilots.",
);
check(
  manifest.v03_editorial_routes.length === 120 && new Set(manifest.v03_editorial_routes).size === 120,
  "The manifest must contain exactly 120 unique v0.3 editorial routes.",
);
for (const route of manifest.v03_editorial_routes) {
  const html = await readText(routeToHtml(route));
  check(hasRobots(html, "index, follow"), `${route} must be indexable.`);
  check(hasCanonical(html, `${manifest.canonical_site}${route}`), `${route} has the wrong canonical URL.`);
  check(sitemap.includes(`${manifest.canonical_site}${route}`), `${route} is missing from the sitemap.`);
}

check(
  v031ContentExpansionExport.dataset === "v031_content_expansion" &&
  v031ContentExpansionExport.count === manifest.expected_build.v031_content_routes &&
  v031ContentExpansionExport.program?.record_status === "Published" &&
  v031ContentExpansionExport.program?.translation_pilots?.every((pilot) => pilot.status === "In Review" && pilot.publication_route === null),
  "The v0.3.1 public export must preserve 54 content-expansion routes and unrouteable In Review translation pilots.",
);
check(
  manifest.v031_content_routes.length === 54 && new Set(manifest.v031_content_routes).size === 54,
  "The manifest must contain exactly 54 unique v0.3.1 content routes.",
);
for (const route of manifest.v031_content_routes) {
  const html = await readText(routeToHtml(route));
  check(hasRobots(html, "index, follow"), `${route} must be indexable.`);
  check(hasCanonical(html, `${manifest.canonical_site}${route}`), `${route} has the wrong canonical URL.`);
  check(sitemap.includes(`${manifest.canonical_site}${route}`), `${route} is missing from the sitemap.`);
}

check(
  phase116CoverageExport.dataset === "phase_116_coverage_architecture" &&
  phase116CoverageExport.count === manifest.expected_build.phase_116_canonical_entities &&
  phase116CoverageExport.program?.conversion_stages?.length === 8,
  "The Phase 116 export must preserve the canonical entity registry and eight conversion stages.",
);
check(
  phase117AuthorityExport.dataset === "global_authority_graph" &&
  phase117AuthorityExport.count === manifest.expected_build.phase_117_authority_rails &&
  phase117AuthorityExport.graph?.rails?.every((rail) => rail.artifact_review_state === "Exact artifact review required"),
  "The Phase 117 export must preserve eighty discovery-only authority rails.",
);
check(
  phase118EncyclopediaExport.program_id === "FTFN-PHASE-118-CANONICAL-LIVING-ENCYCLOPEDIA" &&
  phase118EncyclopediaExport.counts?.chapters === manifest.expected_build.phase_118_encyclopedia_chapters,
  "The Phase 118 export must preserve all twenty-seven canonical living chapters.",
);
check(
  phase119AtlasExport.dataset === "deep_project_place_atlas" &&
  phase119AtlasExport.counts?.projects_total === manifest.expected_build.phase_119_projects &&
  phase119AtlasExport.counts?.places_total === manifest.expected_build.phase_119_places,
  "The Phase 119 export must preserve all project and place files.",
);
check(
  v04PublicConversionObservatoryExport.dataset === "v04_public_conversion_observatory" &&
  v04PublicConversionObservatoryExport.counts?.public_html_routes === manifest.expected_build.v04_content_routes &&
  v04PublicConversionObservatoryExport.publication_boundaries?.some((boundary) => boundary.includes("No Phase 60 future evidence gate")),
  "The v0.4 export must preserve the route inventory and future-gate boundary.",
);
check(
  manifest.v04_content_routes.length === manifest.expected_build.v04_content_routes &&
  new Set(manifest.v04_content_routes).size === manifest.expected_build.v04_content_routes,
  "The manifest must contain the complete unique v0.4 route inventory.",
);
for (const route of manifest.v04_content_routes) {
  const html = await readText(routeToHtml(route));
  check(hasRobots(html, "index, follow"), `${route} must be indexable.`);
  check(hasCanonical(html, `${manifest.canonical_site}${route}`), `${route} has the wrong canonical URL.`);
  check(sitemap.includes(`${manifest.canonical_site}${route}`), `${route} is missing from the sitemap.`);
}

check(
  phase120AcquisitionExport.dataset === "phase_120_evidence_acquisition_packets" &&
  phase120AcquisitionExport.count === 80 &&
  phase120AcquisitionExport.target_count === 320 &&
  phase120AcquisitionExport.fieldbook?.acquisition_packets?.every((packet) => packet.disposition.status === "Prepared — no exact artifact admitted"),
  "The Phase 120 export must preserve eighty prepared packets, 320 targets and zero admitted artifacts.",
);
check(
  phase121MissionsExport.dataset === "phase_121_priority_research_missions" &&
  phase121MissionsExport.count === 68 &&
  phase121MissionsExport.program?.missions?.every((mission) => mission.answer_state === "Research packet assembled — answer not adjudicated"),
  "The Phase 121 export must preserve sixty-eight unadjudicated research missions.",
);
check(
  phase122PlaybooksExport.program_id === "FTFN-PHASE-122-VERIFICATION-PLAYBOOK-LIBRARY" &&
  phase122PlaybooksExport.counts?.leaf_records === 30,
  "The Phase 122 export must preserve all thirty verification playbooks.",
);
check(
  phase123DossiersExport.program_id === "FTFN-PHASE-123-COMPARATIVE-DELIVERY-DOSSIERS" &&
  phase123DossiersExport.counts?.dossiers === 12 &&
  phase123DossiersExport.dossiers?.every((dossier) => dossier.comparison_passport.verdict === "Context only"),
  "The Phase 123 export must preserve twelve context-only matched delivery dossiers.",
);
for (const dossier of phase123DossiersExport.dossiers ?? []) {
  for (const signalId of dossier.evidence_signal_ids ?? []) {
    check(publishedSignalIds.has(signalId), `${dossier.dossier_id} references ${signalId}, which is absent from the Published signals export.`);
  }
  const systemHtml = await readText(routeToHtml(dossier.route));
  for (const sourceId of dossier.evidence_source_ids ?? []) {
    check(sourceById.has(sourceId), `${dossier.dossier_id} references missing public source ${sourceId}.`);
    check(systemHtml.includes(`/atlas/sources/${sourceId}/`), `${dossier.route} does not expose declared source ${sourceId}.`);
  }
}
check(
  phase124WorkbenchesExport.program_id === "FTFN-PHASE-124-TOPIC-RESEARCH-WORKBENCHES" &&
  phase124WorkbenchesExport.counts?.workbenches === 17 &&
  phase124WorkbenchesExport.workbenches?.every((workbench) => workbench.quality_audit.every((dimension) => dimension.state === "Not adjudicated independently")),
  "The Phase 124 export must preserve seventeen workbenches and independent unadjudicated quality dimensions.",
);
const phase124AcquisitionCoveredState = "Exact topic-and-stage packet joins available — artifacts remain unreviewed";
const phase124AcquisitionGapState = "No exact Phase 120 topic-and-stage packet join — acquisition coverage gap";
const phase124MissionLinks = (phase124WorkbenchesExport.workbenches ?? []).flatMap((workbench) => (workbench.mission_links ?? []).map((link) => ({ ...link, workbench_topic_id: workbench.topic_id })));
check(phase124MissionLinks.length === 68 && new Set(phase124MissionLinks.map((link) => link.mission_id)).size === 68, "The Phase 124 export must expose each of the 68 Phase 121 missions exactly once.");
for (const mission of phase121MissionsExport.program?.missions ?? []) {
  const links = phase124MissionLinks.filter((link) => link.mission_id === mission.mission_id);
  check(links.length === 1, `${mission.mission_id} must resolve to exactly one Phase 124 workbench mission link.`);
  const link = links[0];
  if (!link) continue;
  check(link.workbench_topic_id === mission.topic_id, `${mission.mission_id} is linked from the wrong Phase 124 topic workbench.`);
  check(link.acquisition_state === mission.relationships.acquisition_state, `${mission.mission_id} Phase 124 acquisition state differs from Phase 121.`);
  check(sameSet(link.acquisition_packet_ids, mission.relationships.acquisition_packet_ids), `${mission.mission_id} Phase 124 acquisition packet IDs differ from Phase 121.`);
}
const phase124CoveredMissions = phase124MissionLinks.filter((link) => link.acquisition_state === phase124AcquisitionCoveredState && Array.isArray(link.acquisition_packet_ids) && link.acquisition_packet_ids.length > 0);
const phase124GapMissions = phase124MissionLinks.filter((link) => link.acquisition_state === phase124AcquisitionGapState && Array.isArray(link.acquisition_packet_ids) && link.acquisition_packet_ids.length === 0);
check(phase124CoveredMissions.length === 56 && phase124GapMissions.length === 12, "The Phase 124 export must preserve the exact Phase 121 acquisition split of 56 covered missions and 12 coverage gaps.");
check(phase124WorkbenchesExport.counts?.missions_with_acquisition_packets === 56 && phase124WorkbenchesExport.counts?.missions_with_acquisition_coverage_gaps === 12, "The Phase 124 export must report 56 acquisition-covered missions and 12 acquisition coverage gaps.");
const v05Fieldbook = v05EvidenceFieldbookExport.fieldbook;
check(
  v05Fieldbook?.program_id === "FTFN-V0.5-EVIDENCE-FIELDBOOK" &&
  v05EvidenceFieldbookExport.version === "0.5" &&
  v05Fieldbook?.counts?.substantive_surfaces === 213 &&
  v05Fieldbook?.counts?.new_html_routes === 121 &&
  v05Fieldbook?.counts?.enhanced_existing_routes === 92 &&
  v05Fieldbook?.publication_boundaries?.some((boundary) => boundary.includes("Phase 60")),
  "The v0.5 export must preserve the 213-surface inventory and future-gate boundary.",
);
check(
  manifest.v05_new_html_routes.length === manifest.expected_build.v05_new_html_routes &&
  new Set(manifest.v05_new_html_routes).size === manifest.expected_build.v05_new_html_routes,
  "The manifest must contain the complete unique v0.5 new-route inventory.",
);
for (const route of manifest.v05_new_html_routes) {
  const html = await readText(routeToHtml(route));
  check(hasRobots(html, "index, follow"), `${route} must be indexable.`);
  check(hasCanonical(html, `${manifest.canonical_site}${route}`), `${route} has the wrong canonical URL.`);
  check(sitemap.includes(`${manifest.canonical_site}${route}`), `${route} is missing from the sitemap.`);
}

check(
  phase125AnnotationsExport.program_id === "FTFN-PHASE-125-EVIDENCE-ANNOTATION-LEDGER" &&
  phase125AnnotationsExport.counts?.evidence_annotations === 82 &&
  phase125AnnotationsExport.counts?.mission_signal_links === 340 &&
  phase125AnnotationsExport.counts?.source_records_resolved === 114,
  "The Phase 125 export must preserve 82 annotations, 340 mission-signal links and 114 exact sources.",
);
for (const note of phase125AnnotationsExport.evidence_annotations ?? []) {
  check(publishedSignalIds.has(note.signal_id), `${note.note_id} references a signal absent from the Published export.`);
  for (const sourceId of note.source_ids ?? []) check(sourceById.has(sourceId), `${note.note_id} references missing source ${sourceId}.`);
}
check(
  phase126AuditsExport.program_id === "FTFN-PHASE-126-MISSION-EVIDENCE-AUDITS" &&
  phase126AuditsExport.counts?.mission_audits === 68 &&
  phase126AuditsExport.counts?.requirement_tests === 204,
  "The Phase 126 export must preserve 68 mission audits and 204 requirement tests.",
);
check(
  phase127BiographiesExport.program_id === "FTFN-PHASE-127-PROJECT-PLACE-CONVERSION-BIOGRAPHIES" &&
  phase127BiographiesExport.counts?.project_biographies === 24 &&
  phase127BiographiesExport.counts?.place_biographies === 15 &&
  phase127BiographiesExport.counts?.project_stage_cells === 192 &&
  phase127BiographiesExport.counts?.place_system_assessments === 90,
  "The Phase 127 export must preserve 39 biographies, 192 project-stage cells and 90 place-system assessments.",
);
check(
  phase128TopicReviewsExport.program_id === "FTFN-PHASE-128-TOPIC-STATE-OF-EVIDENCE-REVIEWS" &&
  phase128TopicReviewsExport.counts?.topic_reviews === 17 &&
  phase128TopicReviewsExport.counts?.horizon_reviews === 68,
  "The Phase 128 export must preserve 17 topic reviews and 68 horizon reviews.",
);
check(
  phase129SystemSynthesesExport.program_id === "FTFN-PHASE-129-CROSS-SYSTEM-EVIDENCE-SYNTHESES" &&
  phase129SystemSynthesesExport.counts?.syntheses === 12 &&
  phase129SystemSynthesesExport.counts?.compatibility_determinations === 60,
  "The Phase 129 export must preserve 12 syntheses and 60 compatibility determinations.",
);
check(
  v06OpenEvidenceReviewExport.program_id === "FTFN-V0.6-OPEN-EVIDENCE-REVIEW" &&
  v06OpenEvidenceReviewExport.version === "0.6" &&
  v06OpenEvidenceReviewExport.counts?.substantive_surfaces === 224 &&
  v06OpenEvidenceReviewExport.counts?.new_html_routes === 6 &&
  v06OpenEvidenceReviewExport.counts?.enhanced_existing_routes === 218 &&
  v06OpenEvidenceReviewExport.counts?.acquisition_gaps_preserved === 12 &&
  v06OpenEvidenceReviewExport.counts?.future_phase_60_gates_preserved === 11,
  "The v0.6 export must preserve the 224-surface inventory, twelve gaps and eleven future gates.",
);
check(
  manifest.v06_new_html_routes.length === manifest.expected_build.v06_new_html_routes &&
  new Set(manifest.v06_new_html_routes).size === manifest.expected_build.v06_new_html_routes &&
  manifest.v06_enhanced_existing_routes.length === manifest.expected_build.v06_enhanced_existing_routes &&
  new Set(manifest.v06_enhanced_existing_routes).size === manifest.expected_build.v06_enhanced_existing_routes,
  "The manifest must contain the complete unique v0.6 new and enhanced route inventories.",
);
for (const route of manifest.v06_new_html_routes) {
  const html = await readText(routeToHtml(route));
  check(hasRobots(html, "index, follow"), `${route} must be indexable.`);
  check(hasCanonical(html, `${manifest.canonical_site}${route}`), `${route} has the wrong canonical URL.`);
  check(sitemap.includes(`${manifest.canonical_site}${route}`), `${route} is missing from the sitemap.`);
}

const updateDirectory = join(appRoot, "src", "content", "updates");
const updateFiles = (await readdir(updateDirectory)).filter((name) => name.endsWith(".json"));
check(updateFiles.length === manifest.expected_build.updates, `Expected ${manifest.expected_build.updates} update records, found ${updateFiles.length}.`);
for (const filename of updateFiles) {
  const update = await readJson(join(updateDirectory, filename));
  check(updatesHtml.includes(update.title), `Update page is missing: ${update.title}.`);
}

if (failures.length > 0) {
  console.error("FTFN v0.2 release verification failed:");
  failures.forEach((failure) => console.error(`- ${failure}`));
  process.exit(1);
}

console.log("FTFN v0.2 release verification passed.");
console.log(`${htmlCount} HTML pages; ${signals.count} Published signals; ${sources.count} sources; ${topics.count} topics; ${updateFiles.length} updates.`);
console.log(
  `${publishedSourceIds.length} Published-support sources checked on or after ${publishedSupportMinimumDate}.`,
);
console.log(`${researchCollections.length} research collection; ${researchDocuments.length} research documents; downloadable archive present.`);
console.log(
  `${manifest.published_briefing_routes.length} Published briefings; ${manifest.published_dependency_map_routes.length} Published dependency maps.`,
);
console.log(
  `${readerPathways.length} reader pathways across ${manifest.reader_pathway_routes.length} existing Atlas surfaces.`,
);
console.log(`${localSystemFiles.length} local systems; ${phase55QDecisions.length} Phase 55Q evidence-gap decisions passed.`);
console.log(`${measurementRecords.length} measurement specifications; ${intakeRecords.length} empty intake envelopes; ${breakRegisters.length} prospective break registers; 0 observations or values.`);
console.log(`${observationReviewRecords.length} empty review dockets; ${lineageRecords.length} empty lineage registers; ${seriesAdmissionRecords.length} not-ready admission dockets; 0 submissions, reviews, receipts, or series.`);
console.log(`${longitudinalPanelRecords.length} empty longitudinal panels; ${outcomeClaimRecords.length} not-ready outcome dockets; ${comparisonEmbargoRecords.length} comparison embargoes; 0 values, trends, claims, comparisons, scores, or rankings.`);
console.log(`${outcomeEvidencePacketRecords.length} empty outcome-evidence packets; ${alternativeExplanationRecords.length} empty alternative registers; ${counterfactualDesignRecords.length} inactive counterfactual dockets; 0 eligible panels, claims, assessments, designs, results, receipts, scores, or rankings.`);
console.log(`${analysisExecutionRecords.length} inactive analysis executions; ${protocolDeviationRecords.length} empty deviation registers; ${resultAdjudicationRecords.length} inactive result adjudications; ${correctionWithdrawalRecords.length} empty correction registers; 0 executions, deviations, results, replications, claims, corrections, withdrawals, receipts, scores, or rankings.`);
console.log(`${synthesisInputRecords.length} inactive synthesis inputs; ${synthesisDossierRecords.length} inactive synthesis dossiers; ${challengeResponseRecords.length} inactive challenge dockets; ${translationReevaluationRecords.length} inactive translation registers; 0 syntheses, grades, challenges, recommendations, authorizations, reevaluations, receipts, scores, or rankings.`);
console.log(decisionAccountabilityRecords.length + " inactive accountability dossiers; " + implementationRealizationRecords.length + " inactive implementation-realization ledgers; " + auditRemediationRecords.length + " inactive audit-remediation registers; 0 authorizations, commitments, baselines, safeguards, outputs, benefits, harms, audits, reversals, remediations, receipts, scores, or rankings.");
console.log(institutionalLearningRecords.length + " inactive learning dossiers; " + crossCaseTransferRecords.length + " inactive pairwise transfer registers; " + portfolioGovernanceRecords.length + " inactive portfolio registers; " + policyRetirementRecords.length + " inactive policy-retirement ledgers; 0 lessons, comparisons, transfer findings, portfolio conclusions, supersessions, retirements, decommissioning closures, archive deletions, receipts, scores, or rankings.");
console.log(stakeholderStandingRecords.length + " inactive standing registers; " + deliberationResponseRecords.length + " inactive deliberation dockets; " + mandateAppealRecords.length + " inactive mandate-appeal registers; " + adaptiveMandateRecords.length + " inactive adaptive-review ledgers; 0 participation, consent, responses, legitimacy findings, appeals, mandates, reviews, receipts, scores, or rankings.");
console.log(interjurisdictionalAuthorityRecords.length + " inactive authority maps; " + sharedPublicValueCompactRecords.length + " inactive shared-value compacts; " + mutualAidContinuityRecords.length + " inactive continuity-dispute registers; " + emergencyNormalizationRecords.length + " inactive emergency-normalization ledgers; 0 compacts, contributions, mutual-aid activations, disputes, emergencies, extensions, rights suspensions, normalizations, reauthorizations, receipts, scores, or rankings.");
console.log(publicAssetObligationRecords.length + " inactive asset-obligation registers; " + lifecycleMaintenanceRecords.length + " inactive lifecycle-maintenance ledgers; " + procurementContingentRiskRecords.length + " inactive procurement-risk registers; " + intergenerationalStewardshipRecords.length + " inactive intergenerational balance sheets; 0 valuations, lifecycle plans, procurements, vendors, debts, guarantees, liabilities, insurance findings, reserves, stress responses, audits, receipts, scores, or rankings.");
console.log(investmentThesisRecords.length + " inactive investment theses; " + portfolioSequenceRecords.length + " inactive portfolio-sequence registers; " + deliveryCapacityRecords.length + " inactive place-capacity-transition ledgers; " + portfolioRealizationRecords.length + " inactive stress-rebalancing-realization ledgers; 0 selections, priorities, funding, financing, allocations, readiness findings, rebalancing decisions, realization findings, receipts, scores, or rankings.");
console.log(serviceFloorRecords.length + " inactive service-floor dossiers; " + affordabilityCoverageRecords.length + " inactive affordability-coverage ledgers; " + providerContinuityRecords.length + " inactive provider-continuity registers; " + rightsRestorationRecords.length + " inactive rights-restoration ledgers; 0 floors, eligibility decisions, tariffs, subsidies, coverage findings, provider decisions, standards, interventions, restoration priorities, remedies, receipts, scores, or rankings.");
console.log(householdCapabilityRecords.length + " inactive household-capability dossiers; " + careCapacityRecords.length + " inactive care-capacity ledgers; " + householdBurdenRecords.length + " inactive household-burden registers; " + neighborhoodRecoveryRecords.length + " inactive neighborhood-recovery ledgers; 0 household classifications, floors, service bundles, care findings, allocations, protections, debt actions, displacement decisions, recoveries, receipts, scores, or rankings.");
console.log(communityInstitutionRecords.length + " inactive community-institution dossiers; " + civicCapacityRecords.length + " inactive civic-capacity ledgers; " + localInformationRecords.length + " inactive information-integrity registers; " + collectiveResilienceRecords.length + " inactive collective-resilience ledgers; 0 admissions, allocations, truth classifications, suppressions, activations, closures, restorations, reconstructions, recoveries, receipts, scores, or rankings.");
console.log(foodProductionRecords.length + " inactive food-production dossiers; " + localProvisioningRecords.length + " inactive provisioning ledgers; " + foodAccessRecords.length + " inactive food-access registers; " + resourceSecurityRecords.length + " inactive resource-security ledgers; 0 land or water allocations, procurement decisions, nutrition findings, reserve releases, recalls, remedies, receipts, scores, or rankings.");
console.log(housingDeliveryRecords.length + " inactive housing-delivery dossiers; " + housingTenureRecords.length + " inactive tenure-affordability ledgers; " + housingStabilityRecords.length + " inactive housing-stability registers; " + placeStabilityRecords.length + " inactive place-stability ledgers; 0 approvals, allocations, placements, housing findings, relocations, returns, recoveries, receipts, scores, or rankings.");
console.log(healthAccessRecords.length + " inactive health-access dossiers; " + clinicalCareRecords.length + " inactive clinical-care ledgers; " + publicHealthRecords.length + " inactive public-health registers; " + populationWellbeingRecords.length + " inactive population-wellbeing ledgers; 0 eligibility, coverage, diagnosis, triage, restriction, classification, health findings, recoveries, receipts, scores, or rankings.");
console.log(schoolAccessRecords.length + " inactive school-access dossiers; " + postsecondaryPathwayRecords.length + " inactive postsecondary ledgers; " + learningCapabilityRecords.length + " inactive capability registers; " + publicKnowledgeCultureRecords.length + " inactive public-knowledge and culture ledgers; 0 enrollment, admission, learning, credential, capability, transition, knowledge, cultural-recovery, receipts, scores, or rankings.");
console.log(jobAccessRecords.length + " inactive job-access dossiers; " + jobQualityRecords.length + " inactive job-quality ledgers; " + workerVoiceRecords.length + " inactive worker-voice registers; " + livelihoodSecurityRecords.length + " inactive livelihood ledgers; 0 jobs, hiring, classifications, quality findings, bargaining findings, ownership findings, livelihood findings, transition decisions, receipts, scores, or rankings.");
console.log(householdIncomeRecords.length + " inactive household-income dossiers; " + wealthBalanceRecords.length + " inactive wealth ledgers; " + socialProtectionRecords.length + " inactive protection registers; " + economicSecurityRecords.length + " inactive economic-security ledgers; 0 tax, transfer, wealth, poverty, benefit, distribution, mobility, security, receipt, score, or ranking decisions.");
console.log(firmGovernanceRecords.length + " inactive firm dossiers; " + marketCompetitionRecords.length + " inactive market ledgers; " + corporatePowerRecords.length + " inactive corporate-power registers; " + democraticGovernanceRecords.length + " inactive governance ledgers; 0 firm, ownership, market, competition, price, conduct, power, platform, supply-chain, public-support, merger, remedy, public-value, receipt, score, or ranking decisions.");
console.log(moneyBankingRecords.length + " inactive money dossiers; " + creditAllocationRecords.length + " inactive credit ledgers; " + capitalInsuranceRecords.length + " inactive capital registers; " + financialStabilityRecords.length + " inactive stability ledgers; 0 monetary, banking-access, payment, settlement, credit, underwriting, servicing, collection, allocation, valuation, investment, insurance, intervention, guarantee, resolution, loss-allocation, receipt, score, or ranking decisions.");
console.log(publicRevenueRecords.length + " inactive revenue dossiers; " + budgetDeliveryRecords.length + " inactive budget ledgers; " + sovereignDebtRecords.length + " inactive debt registers; " + tradeMacroRecords.length + " inactive macro ledgers; 0 tax, revenue, distribution, budget, delivery, debt, restructuring, customs, trade, treaty, supply-resilience, macro-policy, receipt, score, or ranking decisions.");
console.log(economicDevelopmentStrategyRecords.length + " inactive strategy dossiers; " + innovationSystemRecords.length + " inactive innovation ledgers; " + regionalConvergenceRecords.length + " inactive regional registers; " + productiveTransformationRecords.length + " inactive transformation ledgers; 0 mission, sector, subsidy, procurement, capacity, innovation, commercialization, adoption, cluster, supplier, workforce, convergence, productive-transformation, shared-prosperity, receipt, score, or ranking decisions.");
console.log(industrialUtilityRecords.length + " inactive utility dossiers; " + qualifiedMaterialRecords.length + " inactive material ledgers; " + acceptedProductionRecords.length + " inactive manufacturing registers; " + strategicSupplyChainRecords.length + " inactive supply-chain ledgers; 0 allocation, reliability, qualification, certification, production, acceptance, logistics, reserve, conversion, resilience, sovereignty, transition, receipt, score, or ranking decisions.");
console.log(territorialReadinessRecords.length + " inactive territorial-readiness dossiers; " + projectDefinitionRecords.length + " inactive project ledgers; " + constructionDeliveryRecords.length + " inactive construction registers; " + assetStewardshipRecords.length + " inactive stewardship ledgers; 0 land, project, permit, procurement, construction, commissioning, service, recovery, place-value, receipt, score, or ranking decisions.");
console.log(mobilityAccessRecords.length + " inactive mobility-access dossiers; " + transportationServiceRecords.length + " inactive service ledgers; " + freightDeliveryRecords.length + " inactive freight registers; " + digitalAccessRecords.length + " inactive digital-access ledgers; 0 trip, access, safety, service, delivery, connectivity, restoration, recovery, receipt, score, or ranking decisions.");
console.log(climateMitigationRecords.length + " inactive climate-mitigation dossiers; " + pollutionExposureRecords.length + " inactive pollution-exposure ledgers; " + ecosystemRestorationRecords.length + " inactive ecosystem-restoration registers; " + planetaryStewardshipRecords.length + " inactive planetary-stewardship ledgers; 0 emissions, decarbonization, exposure, biodiversity, restoration, circularity, adaptation, recovery, receipt, score, or ranking decisions.");
console.log(justiceAccessRecords.length + " inactive justice-access dossiers; " + publicSafetyAccountabilityRecords.length + " inactive public-safety ledgers; " + emergencyResilienceRecords.length + " inactive emergency-resilience registers; " + securityPeaceStewardshipRecords.length + " inactive security-peace ledgers; 0 justice, safety, preparedness, recovery, security, defense, civilian-protection, peace, receipt, score, or ranking decisions.");
console.log(representativeDemocracyRecords.length + " inactive democracy dossiers; " + governmentCapabilityRecords.length + " inactive government-capability ledgers; " + publicAccountabilityRecords.length + " inactive accountability registers; " + institutionalLegitimacyRecords.length + " inactive legitimacy-resilience ledgers; 0 elections, representation, participation, government delivery, accountability, civic information, trust, legitimacy, resilience, receipt, score, or ranking decisions.");
console.log(internationalOrderRecords.length + " inactive international-order dossiers; " + multilateralCooperationRecords.length + " inactive multilateral ledgers; " + humanitarianResponsibilityRecords.length + " inactive humanitarian registers; " + sharedHumanFuturesRecords.length + " inactive shared-futures ledgers; 0 treaties, international-order, representation, delivery, migration, humanitarian-protection, global-commons, risk-reduction, shared-futures, receipt, score, or ranking decisions.");
console.log(wholeSystemScenarioRecords.length + " inactive scenario dossiers; " + polycrisisRecords.length + " inactive polycrisis ledgers; " + preparednessRecoveryRecords.length + " inactive preparedness-recovery registers; " + civilizationalResilienceRecords.length + " inactive civilizational-resilience ledgers; 0 forecasts, readiness, recovery, resilience, renewal, future-generations, receipt, score, or ranking decisions.");
console.log(publicSynthesisRecords.length + " inactive public-synthesis dossiers; " + civicDecisionLiteracyRecords.length + " inactive civic-literacy ledgers; " + readerNavigationRecords.length + " inactive reader-navigation registers; " + evergreenStewardshipRecords.length + " inactive evergreen-stewardship ledgers; 0 synthesis, recommendation, comprehension, completeness, archive, evergreen-truth, receipt, score, or ranking decisions.");
console.log("Robots, sitemap, canonical, indexing, reader pathways, evidence decisions, required outputs, private-registry exclusion, and public export boundaries passed.");
