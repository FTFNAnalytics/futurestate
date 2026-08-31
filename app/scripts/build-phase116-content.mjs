import { readFile, readdir, writeFile } from "node:fs/promises";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const appRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const readJson = async (...parts) => JSON.parse(await readFile(join(...parts), "utf8"));
const writeJson = (path, value) => writeFile(path, `${JSON.stringify(value, null, 2)}\n`, "utf8");
const effectiveDate = "2026-08-30";

const topicsDirectory = join(appRoot, "src", "content", "topics");
const signalsDirectory = join(appRoot, "src", "content", "signals");
const sourcesDirectory = join(appRoot, "src", "content", "sources");

const topics = await Promise.all(
  (await readdir(topicsDirectory))
    .filter((name) => name.endsWith(".json"))
    .map((name) => readJson(topicsDirectory, name)),
);
topics.sort((a, b) => a.name.localeCompare(b.name));

const v03 = await readJson(appRoot, "src", "data", "v03-editorial-program.json");
const v031 = await readJson(appRoot, "src", "data", "v031-content-expansion.json");
const phase64 = await readJson(appRoot, "src", "data", "phase-64-conversion-stage-matrix.json");

const stripYamlScalar = (value) => {
  const trimmed = value.trim();
  if (trimmed === "null") return null;
  if ((trimmed.startsWith('"') && trimmed.endsWith('"')) || (trimmed.startsWith("'") && trimmed.endsWith("'"))) {
    return trimmed.slice(1, -1);
  }
  return trimmed;
};
const frontMatterScalar = (text, field) => {
  const match = text.match(new RegExp(`^${field}:\\s*(.+)$`, "m"));
  return match ? stripYamlScalar(match[1]) : null;
};

const signalInventory = [];
for (const name of (await readdir(signalsDirectory)).filter((item) => item.endsWith(".md") || item.endsWith(".mdx"))) {
  const text = await readFile(join(signalsDirectory, name), "utf8");
  signalInventory.push({
    id: frontMatterScalar(text, "id"),
    record_status: frontMatterScalar(text, "record_status"),
    primary_topic: frontMatterScalar(text, "primary_topic"),
    maturity_level: frontMatterScalar(text, "maturity_level"),
    claim_scope: frontMatterScalar(text, "claim_scope"),
    captured_date: frontMatterScalar(text, "captured_date"),
  });
}

const sourceInventory = await Promise.all(
  (await readdir(sourcesDirectory))
    .filter((name) => name.endsWith(".json") && !name.startsWith("source-117-"))
    .map((name) => readJson(sourcesDirectory, name)),
);

const claimTypes = [
  {
    claim_type_id: "116-CLAIM-01-BASELINE",
    slug: "baseline-context",
    label: "Baseline or context",
    definition: "Describes a named starting condition, system boundary, inventory, demand, capacity or historical state.",
    conversion_stage_ids: ["64-STAGE-01-CONTEXT"],
    minimum_evidence: "A named entity or population, a dated period, a stated boundary and a source appropriate to the measure.",
    boundary: "Context does not establish a change, delivery event or outcome.",
  },
  {
    claim_type_id: "116-CLAIM-02-RESEARCH",
    slug: "research-result",
    label: "Research result",
    definition: "Reports a measured finding from a study, laboratory, model, field trial or evaluation.",
    conversion_stage_ids: ["64-STAGE-01-CONTEXT", "64-STAGE-05-VALIDATION"],
    minimum_evidence: "A citable method, study population or test article, result, uncertainty and limits on transfer beyond the studied setting.",
    boundary: "A research result does not establish authorization, adoption, accepted operation or public outcome.",
  },
  {
    claim_type_id: "116-CLAIM-03-ANNOUNCEMENT",
    slug: "announcement-or-plan",
    label: "Announcement or plan",
    definition: "Records a stated intention, target, proposal, schedule or capacity ambition.",
    conversion_stage_ids: ["64-STAGE-01-CONTEXT"],
    minimum_evidence: "A named issuer, date, object, intended scale and explicit status as a proposal, target or plan.",
    boundary: "An announcement is not authority, finance, construction, acceptance or operation.",
  },
  {
    claim_type_id: "116-CLAIM-04-AUTHORITY",
    slug: "policy-or-authority",
    label: "Policy or authority",
    definition: "Establishes a law, rule, permit, licence, approval, tariff, standard or other named authority.",
    conversion_stage_ids: ["64-STAGE-02-AUTHORITY"],
    minimum_evidence: "The authoritative instrument, issuer, effective date, scope, conditions and current disposition.",
    boundary: "Permission removes or changes a gate; it does not establish implementation or operation.",
  },
  {
    claim_type_id: "116-CLAIM-05-COMMITMENT",
    slug: "finance-procurement-or-agreement",
    label: "Finance, procurement or agreement",
    definition: "Establishes a named financial close, appropriation, award, order, contract, offtake or delivery agreement.",
    conversion_stage_ids: ["64-STAGE-03-COMMITMENT"],
    minimum_evidence: "Named parties, instrument, committed amount or quantity where public, conditions, scope and date.",
    boundary: "A commitment does not establish completed implementation, customer acceptance or outcome.",
  },
  {
    claim_type_id: "116-CLAIM-06-IMPLEMENTATION",
    slug: "build-or-implementation",
    label: "Build or implementation",
    definition: "Reports physical construction, installation, migration, organizational implementation or delivery progress.",
    conversion_stage_ids: ["64-STAGE-04-IMPLEMENTATION"],
    minimum_evidence: "Named project or cohort identity, dated milestone, scope completed, denominator and remaining work.",
    boundary: "Progress or substantial completion does not establish validation, acceptance or recurring operation.",
  },
  {
    claim_type_id: "116-CLAIM-07-VALIDATION",
    slug: "test-compliance-or-qualification",
    label: "Test, compliance or qualification",
    definition: "Establishes testing, inspection, certification, compliance, qualification or corrective action for a named object.",
    conversion_stage_ids: ["64-STAGE-05-VALIDATION"],
    minimum_evidence: "Named test article or cohort, authority or method, criteria, result, exceptions and disposition.",
    boundary: "A passed test does not by itself establish customer acceptance, scale or sustained performance.",
  },
  {
    claim_type_id: "116-CLAIM-08-ACCEPTANCE",
    slug: "accepted-service-product-or-cutover",
    label: "Accepted service, product or cutover",
    definition: "Records formal receipt, handover, authorization to use, customer acceptance or accepted transition.",
    conversion_stage_ids: ["64-STAGE-06-ACCEPTANCE"],
    minimum_evidence: "Named receiving party, accepted object, acceptance criteria, date, exceptions and operational scope.",
    boundary: "Acceptance is a gate, not proof of recurring reliability, use or public benefit.",
  },
  {
    claim_type_id: "116-CLAIM-09-OPERATION",
    slug: "recurring-operation-or-adoption",
    label: "Recurring operation or adoption",
    definition: "Establishes repeated service, output, use, adoption or operation for a stable named entity or cohort.",
    conversion_stage_ids: ["64-STAGE-07-REPEAT"],
    minimum_evidence: "Stable identity, compatible periods, repeated observations, denominator, method and treatment of outages or attrition.",
    boundary: "Operation or adoption does not alone establish causation or net public outcome.",
  },
  {
    claim_type_id: "116-CLAIM-10-OUTCOME",
    slug: "measured-outcome",
    label: "Measured outcome",
    definition: "Reports a repeated change in service, welfare, cost, resilience, safety, environment or mission performance.",
    conversion_stage_ids: ["64-STAGE-08-OUTCOME"],
    minimum_evidence: "Stable identity, period, definition and denominator; repeated observations; uncertainty; and an explicit attribution boundary.",
    boundary: "An observed outcome is not automatically caused by the intervention and cannot be compared across incompatible series.",
  },
  {
    claim_type_id: "116-CLAIM-11-FORECAST",
    slug: "forecast-or-scenario",
    label: "Forecast or scenario",
    definition: "Describes a modeled future, projection, range, target pathway or conditional scenario.",
    conversion_stage_ids: ["64-STAGE-01-CONTEXT"],
    minimum_evidence: "Model or author, base date, assumptions, range, horizon, update history and explicit separation from observation.",
    boundary: "A forecast is not a measured present state, commitment, delivery event or outcome.",
  },
  {
    claim_type_id: "116-CLAIM-12-CORRECTION",
    slug: "correction-or-withdrawal",
    label: "Correction, revision or withdrawal",
    definition: "Changes, narrows, supersedes, disputes or withdraws an earlier claim or record.",
    conversion_stage_ids: phase64.stage_taxonomy.map((stage) => stage.stage_id),
    minimum_evidence: "The prior state, corrected state, reason, decision date, responsible authority and complete propagation trail.",
    boundary: "Corrections preserve provenance; they do not silently rewrite the historical record.",
  },
];

const geographyScopeTypes = [
  ["116-GEO-SCOPE-GLOBAL", "global", "Global", "Evidence intended to describe worldwide conditions or a globally defined population."],
  ["116-GEO-SCOPE-MULTILATERAL", "multilateral", "Multilateral", "Evidence governed or reported across multiple jurisdictions through a named institution or agreement."],
  ["116-GEO-SCOPE-NATIONAL", "national", "National", "Evidence whose authority, population or denominator is bounded to one country."],
  ["116-GEO-SCOPE-SUBNATIONAL", "subnational", "Subnational", "Evidence bounded to a state, province, territory or comparable jurisdiction."],
  ["116-GEO-SCOPE-LOCAL", "local", "Local", "Evidence bounded to a municipality, county, district or community."],
  ["116-GEO-SCOPE-CORRIDOR", "corridor", "Corridor", "Evidence spanning a named place-based network of facilities, infrastructure and institutions."],
  ["116-GEO-SCOPE-FACILITY", "facility", "Facility", "Evidence bounded to one named physical or institutional facility."],
  ["116-GEO-SCOPE-ASSET", "asset", "Asset", "Evidence bounded to one named asset, installation or deployable unit."],
  ["116-GEO-SCOPE-SERVICE", "service-area", "Service area or cohort", "Evidence bounded to a named operator geography, customer population or eligible cohort."],
].map(([geography_scope_id, slug, label, definition]) => ({ geography_scope_id, slug, label, definition }));

const geographyAreas = [
  ["geo-us-national", "United States", "US", "116-GEO-SCOPE-NATIONAL"],
  ["geo-us-arizona", "Arizona, United States", "US", "116-GEO-SCOPE-SUBNATIONAL"],
  ["geo-ca-ontario", "Ontario, Canada", "CA", "116-GEO-SCOPE-SUBNATIONAL"],
  ["geo-us-virginia", "Virginia, United States", "US", "116-GEO-SCOPE-SUBNATIONAL"],
  ["geo-us-nevada", "Nevada, United States", "US", "116-GEO-SCOPE-SUBNATIONAL"],
  ["geo-us-florida", "Florida, United States", "US", "116-GEO-SCOPE-SUBNATIONAL"],
  ["geo-us-california", "California, United States", "US", "116-GEO-SCOPE-SUBNATIONAL"],
  ["geo-us-louisiana", "Louisiana, United States", "US", "116-GEO-SCOPE-SUBNATIONAL"],
  ["geo-us-montana", "Montana, United States", "US", "116-GEO-SCOPE-SUBNATIONAL"],
  ["geo-us-washington", "Washington, United States", "US", "116-GEO-SCOPE-SUBNATIONAL"],
  ["geo-us-texas", "Texas, United States", "US", "116-GEO-SCOPE-SUBNATIONAL"],
  ["geo-us-missouri", "Missouri, United States", "US", "116-GEO-SCOPE-SUBNATIONAL"],
  ["geo-us-new-york", "New York, United States", "US", "116-GEO-SCOPE-SUBNATIONAL"],
  ["geo-us-intercity-rail", "United States intercity rail system", "US", "116-GEO-SCOPE-SERVICE"],
  ["geo-us-nnsa-two-site", "Los Alamos and Savannah River, United States", "US", "116-GEO-SCOPE-CORRIDOR"],
  ["geo-au-south-australia", "South Australia, Australia", "AU", "116-GEO-SCOPE-SUBNATIONAL"],
  ["geo-au-victoria", "Victoria, Australia", "AU", "116-GEO-SCOPE-SUBNATIONAL"],
].map(([geography_id, label, country_code, geography_scope_id]) => ({ geography_id, label, country_code, geography_scope_id }));

const localSystemTopicMap = {
  "florida-space-coast-launch-corridor": ["topic-space", "topic-aviation", "topic-energy", "topic-policy-and-standards", "topic-human-futures"],
  "nevada-lithium-battery-materials-corridor": ["topic-critical-minerals", "topic-advanced-manufacturing", "topic-energy", "topic-water", "topic-climate"],
  "northern-virginia-data-center-corridor": ["topic-chips-and-compute", "topic-energy", "topic-water", "topic-policy-and-standards", "topic-human-futures"],
  "ontario-real-estate": ["topic-human-futures", "topic-finance-and-risk", "topic-policy-and-standards", "topic-water", "topic-energy"],
  "us-southwest-chip-corridor": ["topic-chips-and-compute", "topic-advanced-manufacturing", "topic-water", "topic-energy", "topic-policy-and-standards", "topic-human-futures"],
  "california-autonomous-mobility": ["topic-mobility", "topic-policy-and-standards", "topic-cybersecurity", "topic-human-futures"],
  "louisiana-broadband-adoption": ["topic-policy-and-standards", "topic-cybersecurity", "topic-human-futures"],
  "montana-bead-delivery": ["topic-policy-and-standards", "topic-cybersecurity", "topic-human-futures"],
  "hanford-waste-treatment": ["topic-advanced-manufacturing", "topic-water", "topic-climate", "topic-policy-and-standards", "topic-human-futures"],
  "amtrak-accessibility-and-reliability": ["topic-mobility", "topic-policy-and-standards", "topic-human-futures"],
  "nnsa-two-site-production": ["topic-advanced-manufacturing", "topic-policy-and-standards", "topic-human-futures"],
  "south-australia-grid-storage": ["topic-energy", "topic-climate", "topic-finance-and-risk"],
  "victoria-grid-storage": ["topic-energy", "topic-climate", "topic-finance-and-risk"],
  "florida-utility-storage": ["topic-energy", "topic-climate", "topic-finance-and-risk"],
  "california-battery-safety": ["topic-energy", "topic-climate", "topic-policy-and-standards", "topic-human-futures"],
};

const localSystemGeographyMap = {
  "florida-space-coast-launch-corridor": ["geo-us-florida"],
  "nevada-lithium-battery-materials-corridor": ["geo-us-nevada"],
  "northern-virginia-data-center-corridor": ["geo-us-virginia"],
  "ontario-real-estate": ["geo-ca-ontario"],
  "us-southwest-chip-corridor": ["geo-us-arizona"],
  "california-autonomous-mobility": ["geo-us-california"],
  "louisiana-broadband-adoption": ["geo-us-louisiana"],
  "montana-bead-delivery": ["geo-us-montana"],
  "hanford-waste-treatment": ["geo-us-washington"],
  "amtrak-accessibility-and-reliability": ["geo-us-intercity-rail"],
  "nnsa-two-site-production": ["geo-us-nnsa-two-site"],
  "south-australia-grid-storage": ["geo-au-south-australia"],
  "victoria-grid-storage": ["geo-au-victoria"],
  "florida-utility-storage": ["geo-us-florida"],
  "california-battery-safety": ["geo-us-california"],
};

const canonicalLocalSystems = [
  ...v03.local_systems.map((record) => ({
    canonical_id: record.id,
    entity_type: "local_system",
    slug: record.slug,
    label: record.name,
    aliases: [record.slug, record.name],
    legacy_ids: [],
    geography_label: record.geography,
    geography_ids: localSystemGeographyMap[record.slug],
    topic_ids: localSystemTopicMap[record.slug],
    representation_tier: "structured_local_system",
    public_routes: [`/review/places/${record.slug}/`, `/atlas/local-systems/${record.slug}/`],
    promotion_requirement: null,
  })),
  ...v031.regions.map((record) => ({
    canonical_id: `local-${record.slug}`,
    entity_type: "local_system",
    slug: record.slug,
    label: record.title,
    aliases: [record.slug, record.title, record.portrait_id],
    legacy_ids: [record.portrait_id],
    geography_label: record.geography,
    geography_ids: localSystemGeographyMap[record.slug],
    topic_ids: localSystemTopicMap[record.slug],
    representation_tier: "editorial_portrait",
    public_routes: [`/review/regions/${record.slug}/`],
    promotion_requirement: "Create a schema-validated local-system content record with direct source IDs, authority actors, missing data, last review date and evidence-gap links.",
  })),
];
canonicalLocalSystems.sort((a, b) => a.label.localeCompare(b.label));

const casebookTopicMap = {
  "tsmc-arizona": ["topic-chips-and-compute", "topic-advanced-manufacturing", "topic-water", "topic-energy", "topic-policy-and-standards"],
  "toronto-24-254930": ["topic-human-futures", "topic-finance-and-risk", "topic-policy-and-standards", "topic-water"],
  "northern-virginia-large-load": ["topic-chips-and-compute", "topic-energy", "topic-water", "topic-policy-and-standards"],
  "space-coast-authority-to-mission": ["topic-space", "topic-aviation", "topic-energy", "topic-policy-and-standards"],
  "nevada-lithium-to-qualified-material": ["topic-critical-minerals", "topic-advanced-manufacturing", "topic-water", "topic-energy", "topic-climate"],
  "gsa-pqc-adoption": ["topic-quantum", "topic-cybersecurity", "topic-policy-and-standards"],
  "nist-aria-assurance": ["topic-ai-for-science", "topic-discovery-technologies", "topic-cybersecurity", "topic-policy-and-standards"],
  "waymo-california-service": ["topic-mobility", "topic-policy-and-standards", "topic-cybersecurity", "topic-human-futures"],
  "manatee-battery-storage": ["topic-energy", "topic-climate", "topic-finance-and-risk"],
  "moss-landing-battery-safety": ["topic-energy", "topic-climate", "topic-policy-and-standards", "topic-human-futures"],
  "gateway-battery-storage": ["topic-energy", "topic-climate", "topic-finance-and-risk"],
  "hornsdale-power-reserve": ["topic-energy", "topic-climate", "topic-finance-and-risk"],
  "victoria-big-battery": ["topic-energy", "topic-climate", "topic-finance-and-risk"],
  "dalrymple-grid-battery": ["topic-energy", "topic-climate", "topic-finance-and-risk"],
  "f35-production-readiness": ["topic-aviation", "topic-advanced-manufacturing", "topic-policy-and-standards"],
  "f15ex-production-delivery": ["topic-aviation", "topic-advanced-manufacturing", "topic-policy-and-standards"],
  "kc46-readiness": ["topic-aviation", "topic-advanced-manufacturing", "topic-policy-and-standards"],
  "current-applications-capacity": ["topic-advanced-manufacturing", "topic-human-futures"],
  "island-components-capacity": ["topic-advanced-manufacturing", "topic-human-futures"],
  "monaghan-medical-capacity": ["topic-advanced-manufacturing", "topic-human-futures"],
  "amtrak-accessible-stations": ["topic-mobility", "topic-policy-and-standards", "topic-human-futures"],
  "hanford-dflaw-operation": ["topic-advanced-manufacturing", "topic-water", "topic-climate", "topic-policy-and-standards"],
  "montana-bead-completed-quarter": ["topic-policy-and-standards", "topic-cybersecurity", "topic-human-futures"],
  "nnsa-qualified-production": ["topic-advanced-manufacturing", "topic-policy-and-standards", "topic-human-futures"],
};

const casebookGeographyMap = {
  "tsmc-arizona": ["geo-us-arizona"], "toronto-24-254930": ["geo-ca-ontario"],
  "northern-virginia-large-load": ["geo-us-virginia"], "space-coast-authority-to-mission": ["geo-us-florida"],
  "nevada-lithium-to-qualified-material": ["geo-us-nevada"], "waymo-california-service": ["geo-us-california"],
  "gsa-pqc-adoption": ["geo-us-national"], "nist-aria-assurance": ["geo-us-national"],
  "manatee-battery-storage": ["geo-us-florida"], "moss-landing-battery-safety": ["geo-us-california"],
  "gateway-battery-storage": ["geo-us-california"], "hornsdale-power-reserve": ["geo-au-south-australia"],
  "victoria-big-battery": ["geo-au-victoria"], "dalrymple-grid-battery": ["geo-au-south-australia"],
  "f35-production-readiness": ["geo-us-texas"], "f15ex-production-delivery": ["geo-us-missouri"],
  "kc46-readiness": ["geo-us-washington"], "current-applications-capacity": ["geo-us-new-york"],
  "island-components-capacity": ["geo-us-new-york"], "monaghan-medical-capacity": ["geo-us-new-york"],
  "amtrak-accessible-stations": ["geo-us-intercity-rail"], "hanford-dflaw-operation": ["geo-us-washington"],
  "montana-bead-completed-quarter": ["geo-us-montana"], "nnsa-qualified-production": ["geo-us-nnsa-two-site"],
};

const canonicalCasebooks = [
  ...v03.casebooks.map((record) => ({
    canonical_id: `casebook-${record.slug}`,
    entity_type: "casebook",
    slug: record.slug,
    label: record.title,
    aliases: [record.slug, record.title, record.file_id, record.named_entity],
    legacy_ids: [record.file_id],
    topic_ids: casebookTopicMap[record.slug],
    geography_ids: casebookGeographyMap[record.slug] ?? [],
    representation_tier: "structured_conversion_file",
    underlying_conversion_file_id: record.file_id,
    public_routes: [`/review/casebooks/${record.slug}/`, `/review/journeys/${record.slug}/`, `/review/outcomes/${record.slug}/`],
    promotion_requirement: null,
  })),
  ...v031.casebooks.map((record) => ({
    canonical_id: `casebook-${record.slug}`,
    entity_type: "casebook",
    slug: record.slug,
    label: record.title,
    aliases: [record.slug, record.title, record.casebook_id],
    legacy_ids: [record.casebook_id],
    topic_ids: casebookTopicMap[record.slug],
    geography_ids: casebookGeographyMap[record.slug] ?? [],
    representation_tier: "editorial_casebook",
    underlying_conversion_file_id: null,
    public_routes: [`/review/casebooks/expanded/${record.slug}/`],
    promotion_requirement: "Create a named project or adoption conversion file with stable entity identity, direct source and signal IDs, dated events, gate, stage cells, denominator and next decisive artifact.",
  })),
];
canonicalCasebooks.sort((a, b) => a.label.localeCompare(b.label));

const topicQuestionSets = {
  "advanced-manufacturing": [
    ["Which named facilities and production systems have defensible baselines for installed, qualified and available capacity?", "Separate announced nameplate capacity from qualified equipment, workforce, inputs and available production time.", ["Facility and line identity", "Installed and qualified capacity definitions", "Operating calendar and workforce baseline"]],
    ["Where do finance, permits, equipment, materials, utilities and workforce constrain the path from facility commitment to qualification?", "Expose the dependency stack and the stage at which each named project is actually held.", ["Dated project chronology", "Authority and procurement instruments", "Equipment, utility and workforce milestones"]],
    ["Which customer-acceptance and recurring-output records establish dependable production rather than a successful trial or first article?", "Make qualified recurring supply visible without treating one milestone as durable capacity.", ["Acceptance criteria and receiving party", "Lot or unit identity", "Repeated yield, delivery and exception records"]],
    ["Which compatible yield, quality, cost, schedule, safety and reliability series show whether advanced manufacturing improved receiving-system outcomes?", "Connect production to outcomes while preserving attribution and product differences.", ["Stable product and facility denominator", "Multi-period operating series", "Revision, downtime and attribution notes"]],
  ],
  "agriculture-and-bioeconomy": [
    ["Which crops, biological processes, farms and regional systems have comparable starting baselines for yield, inputs, risk and resource use?", "Anchor technology claims to named production systems and ecological conditions.", ["Crop or process identity", "Season and geography", "Yield, input and resource-use baseline"]],
    ["How do approvals, finance, infrastructure, processing capacity and offtake agreements move agricultural and bioeconomy innovations into field implementation?", "Reveal the non-technical gates between a promising result and adoption at production scale.", ["Regulatory disposition", "Named financing or offtake", "Field, processing and logistics milestones"]],
    ["Which repeated seasonal or batch records establish sustained adoption, production quality and farmer or processor use?", "Distinguish a pilot season from resilient recurring practice.", ["Stable participant or facility cohort", "Repeated seasons or batches", "Adoption, attrition and quality definitions"]],
    ["What happens to yields, water, soil, emissions, biodiversity, income, labor and food security after adoption, and which changes can be attributed?", "Test whether production advances create durable public and ecological value.", ["Compatible pre/post measures", "Weather and market context", "Uncertainty and alternative explanations"]],
  ],
  "ai-for-science": [
    ["Which named scientific workflows have measurable baselines for time, cost, reproducibility, data quality and expert effort?", "Define the actual work against which an AI-enabled claim can be judged.", ["Workflow and institution identity", "Task and dataset definition", "Pre-deployment performance baseline"]],
    ["How do data rights, compute, evaluation, procurement, assurance and institutional authority govern movement from demonstration to scientific use?", "Expose the operational and governance gates hidden behind model-performance claims.", ["Evaluation protocol", "Compute and data provenance", "Authorization and implementation record"]],
    ["Which accepted and repeated uses show that AI systems remain reliable, reproducible and useful across scientific cycles?", "Separate benchmark performance from sustained use in a receiving scientific institution.", ["Named receiving workflow", "Acceptance and override criteria", "Repeated use and failure records"]],
    ["Do accepted systems change discovery time, experimental yield, replication, cost or scientific quality without introducing unmeasured harms?", "Measure mission effects without attributing every downstream result to the model.", ["Stable workflow denominator", "Multi-period outcome measures", "Human, data and institutional confounders"]],
  ],
  "aviation": [
    ["Which named aircraft, airports, propulsion systems and service networks have current baselines for capacity, readiness, safety and use?", "Keep fleet, asset, facility and route identities from being collapsed into generic aviation progress.", ["Tail, fleet, airport or route identity", "Capacity and readiness definitions", "Current operating period"]],
    ["How do certification, manufacturing, infrastructure, workforce, finance and operating authority combine before entry into service?", "Show which approvals and delivery systems must align for aviation capability to convert.", ["Certification basis and disposition", "Production and infrastructure milestones", "Operator and service authority"]],
    ["Which acceptance, dispatch, utilization and maintenance records establish repeated service rather than delivery or a demonstration flight?", "Separate delivered equipment from dependable operational capacity.", ["Operator acceptance", "Dispatch and utilization denominator", "Repeated maintenance and service records"]],
    ["Which compatible safety, reliability, cost, emissions, noise and access measures show public and system outcomes?", "Support useful comparison without mixing aircraft classes, service types or exposure definitions.", ["Exposure-compatible safety measures", "Route or fleet operating periods", "Environmental and access denominators"]],
  ],
  "chips-and-compute": [
    ["Which named fabs, data centers and compute services have defensible baselines for installed, available and qualified capacity?", "Separate announced capacity from energizable, customer-ready and actually available capacity.", ["Facility and service identity", "Power, tool and compute capacity definitions", "Current utilization boundary"]],
    ["Where do power, water, land, permits, interconnection, tooling, workforce and customer commitments constrain delivery?", "Make the physical and institutional dependency stack legible at named sites.", ["Utility and permitting instruments", "Construction and tool-install milestones", "Named customer or service commitments"]],
    ["Which qualification, customer-acceptance, uptime and recurring-output records establish dependable semiconductor or compute service?", "Distinguish construction completion and equipment installation from accepted service.", ["Qualification or service-acceptance criteria", "Yield, uptime or delivered-compute denominator", "Repeated operating periods"]],
    ["What do compatible series show about productivity, reliability, water, energy, workforce, supply resilience and local public effects?", "Connect scarce-resource use to actual receiving-system and community outcomes.", ["Facility-level resource and output series", "Stable local and service denominators", "Revision and attribution boundaries"]],
  ],
  "climate": [
    ["Which hazards, exposures, vulnerabilities and adaptive capacities have stable baselines at decision-relevant geographies?", "Ground climate interpretation in named places, periods, populations and physical conditions.", ["Hazard and geography definition", "Exposure and vulnerability denominator", "Baseline period and uncertainty"]],
    ["Which policies, finance commitments and projects move from climate ambition into completed and validated adaptation or mitigation?", "Trace the difference between targets, funded action and accepted implementation.", ["Policy and finance instruments", "Named intervention chronology", "Completion and validation evidence"]],
    ["Which repeated operating records show that climate interventions remain available and effective under real conditions?", "Move beyond commissioning to sustained resilience or emissions performance.", ["Intervention and service identity", "Repeated stress or operating periods", "Maintenance, failure and recovery records"]],
    ["What changes in loss, exposure, service continuity, emissions, ecosystems and welfare can be measured, and what attribution remains unresolved?", "Support outcome learning while respecting weather variability, long horizons and counterfactual limits.", ["Comparable multi-period series", "Hazard and socioeconomic controls", "Uncertainty and counterfactual design"]],
  ],
  "critical-minerals": [
    ["Which named deposits, mines, refineries, processors and recycling systems have current resource, capacity and compliance baselines?", "Tie supply claims to specific assets, products, jurisdictions and definitions.", ["Asset and material identity", "Resource, reserve and capacity definitions", "Current environmental and operating state"]],
    ["How do permitting, finance, water, energy, community consent, construction and qualification govern conversion into usable supply?", "Show why resource presence or project approval is not delivered material.", ["Authority and consultation record", "Financial and construction milestones", "Processing and customer-qualification path"]],
    ["Which accepted shipments and recurring qualified-output records establish reliable supply into named receiving systems?", "Separate first production and nameplate claims from repeat customer-accepted material.", ["Product specification", "Customer receipt or acceptance", "Repeated shipment and output series"]],
    ["Which compatible cost, reliability, environmental, labor, community and supply-security outcomes follow, and at what boundary?", "Make benefits and burdens visible without aggregating unlike minerals or communities.", ["Material- and asset-specific denominator", "Compliance and community measures", "Multi-period supply and market context"]],
  ],
  "cybersecurity": [
    ["Which named systems, assets and organizations have current inventories, threat baselines and control boundaries?", "A security claim requires a defined attack surface and accountable operator.", ["System and asset inventory", "Threat and exposure period", "Control ownership and boundary"]],
    ["How do standards, procurement, migration, testing and authorization move a security requirement into implemented controls?", "Trace policy and guidance through the institutional conversion chain.", ["Applicable standard or authority", "Named implementation cohort", "Test and authorization disposition"]],
    ["Which cutover, monitoring, incident, correction and retirement records establish sustained control operation?", "Separate deployment from continuously effective protection and completed legacy retirement.", ["Accepted cutover criteria", "Recurring monitoring and incident records", "Exception and retirement ledger"]],
    ["Which compatible exposure, loss, recovery, mission and user-harm measures show security outcomes without rewarding under-reporting?", "Make security performance comparable while preserving uncertainty and reporting bias.", ["Stable system and event denominator", "Detection and reporting definitions", "Loss, recovery and mission series"]],
  ],
  "discovery-technologies": [
    ["Which instruments, platforms and research methods have reproducible performance baselines on named scientific tasks?", "Prevent novelty claims from floating free of test conditions and receiving workflows.", ["Instrument or platform identity", "Task, specimen or dataset definition", "Baseline accuracy, time and cost"]],
    ["How do funding, facilities, data, standards, validation and institutional adoption move a discovery platform beyond demonstration?", "Reveal the conversion system surrounding a technical result.", ["Funding and facility record", "Validation and interoperability method", "Receiving-institution implementation"]],
    ["Which accepted and repeated uses establish dependable operation across laboratories, sites or research cycles?", "Distinguish a single result from a maintained scientific capability.", ["Acceptance criteria", "Repeated run and maintenance records", "Cross-site or cross-cycle reproducibility"]],
    ["Do these platforms improve discovery rate, evidence quality, replication, access or cost, and which effects remain unproven?", "Connect capability to scientific value without overstating causality.", ["Stable workflow outcome measures", "Comparable control or prior method", "Uncertainty and publication-bias assessment"]],
  ],
  "energy": [
    ["Which named grids, plants, storage assets and customer classes have compatible capacity, demand, reliability and cost baselines?", "Anchor energy claims to assets, balancing areas, customers and defined periods.", ["Asset or system identity", "Capacity, demand and reliability definitions", "Current operating-period baseline"]],
    ["How do planning, authority, finance, interconnection, construction, fuel and supply-chain gates govern delivery?", "Show where an authorized or financed resource remains constrained before service.", ["Planning and regulatory disposition", "Interconnection and procurement record", "Construction and supply milestones"]],
    ["Which commissioning, acceptance, dispatch and recurring-service records establish dependable operating contribution?", "Separate installed nameplate capacity from accepted and available system service.", ["Receiving-system acceptance", "Dispatch, availability and outage denominator", "Repeated seasonal operating periods"]],
    ["Which compatible reliability, affordability, emissions, resilience and local-impact series show net system outcomes?", "Enable comparison without mixing regions, resource classes or accounting boundaries.", ["System-compatible period and denominator", "Cost and reliability series", "Emissions, resilience and burden measures"]],
  ],
  "finance-and-risk": [
    ["Which markets, institutions, projects and public balance sheets have current exposure, cost and risk baselines?", "Define who bears risk, over what period, and under which accounting boundary.", ["Instrument, institution or project identity", "Exposure and valuation date", "Risk, cost and liability definitions"]],
    ["When do appropriations, guarantees, insurance, credit and private finance remove a conversion constraint, and when do they create a contingent one?", "Trace financial instruments to the projects and obligations they actually change.", ["Instrument terms and parties", "Conditions and contingent liabilities", "Linked project milestone"]],
    ["Which drawdown, payment, covenant, loss and operating records show that financed activity reached sustained delivery?", "Separate announced financing and financial close from deployed and performing capital.", ["Disbursement and use-of-funds record", "Covenant and performance period", "Default, restructuring and exception history"]],
    ["Which compatible affordability, fiscal, resilience, distributional and real-economy outcomes follow, and who ultimately bears the downside?", "Make risk transfer and public value visible without reducing them to one score.", ["Stable fiscal and beneficiary denominator", "Cash-flow and loss series", "Distributional and counterfactual analysis"]],
  ],
  "human-futures": [
    ["Which populations and places have current baselines for access, affordability, safety, capability, trust and lived conditions?", "Keep system progress connected to people, institutions and unequal starting conditions.", ["Population and place identity", "Access and welfare definitions", "Baseline period and distribution"]],
    ["How do public authority, finance, infrastructure, workforce and legitimacy shape whether frontier systems reach people?", "Expose the receiving systems that convert technical capability into—or away from—public value.", ["Authority and delivery institutions", "Infrastructure and workforce milestones", "Participation and legitimacy record"]],
    ["Which accepted and repeated services establish real availability, accessibility, quality and use for defined populations?", "Distinguish infrastructure presence from usable and dependable service.", ["Service and eligible-population denominator", "Availability, uptake and quality records", "Barrier, complaint and exclusion evidence"]],
    ["What changes in capability, health, security, time, income, participation and trust can be measured, for whom, and with what alternatives?", "Evaluate distributional outcomes without claiming a single technological cause.", ["Disaggregated repeated measures", "Comparable pre/post or cohort evidence", "Confounders and lived-experience evidence"]],
  ],
  "mobility": [
    ["Which named networks, fleets, routes and services have current baselines for capacity, access, reliability, safety and use?", "Define the operating system before describing transformation.", ["Operator, route, fleet or service identity", "Exposure and service denominator", "Current reliability and access baseline"]],
    ["How do authority, infrastructure, procurement, certification, workforce and local rules govern movement from pilot to public service?", "Trace every non-technical gate required for a mobility capability to land.", ["Operating and local authority", "Procurement and infrastructure milestone", "Certification and workforce record"]],
    ["Which acceptance, availability, trip, maintenance and incident records establish sustained service?", "Separate permission and fleet delivery from dependable service experienced by users.", ["Service acceptance", "Trip, mileage or service-hour denominator", "Repeated availability and maintenance periods"]],
    ["Which compatible safety, travel-time, affordability, accessibility, emissions and land-use outcomes follow?", "Measure public value without mixing exposure, geography or service mode.", ["Exposure-compatible safety series", "User and geography denominator", "Multi-period service and externality measures"]],
  ],
  "policy-and-standards": [
    ["Which laws, rules, standards, permits and institutional responsibilities currently govern each priority conversion pathway?", "Create a dated authority baseline instead of treating policy as undifferentiated context.", ["Instrument and issuer identity", "Effective date and jurisdiction", "Scope, conditions and supersession status"]],
    ["Which budgets, procurements, implementation plans, inspections and enforcement actions convert formal authority into practice?", "Reveal whether institutions have capacity and instruments to act on adopted policy.", ["Implementation responsibility", "Funding and procurement record", "Inspection, enforcement and exception evidence"]],
    ["Which verified cutovers, compliance records and repeated practices establish adoption rather than publication?", "Separate a standard or rule on paper from sustained implementation by named entities.", ["Named adopter cohort", "Compliance and acceptance criteria", "Repeated audit or operating record"]],
    ["Which service, safety, access, cost, legitimacy and distributional outcomes change after implementation, and what else could explain them?", "Connect governance to results without presuming policy effectiveness.", ["Stable affected-population denominator", "Pre/post and implementation timing", "Alternative explanations and enforcement variation"]],
  ],
  "quantum": [
    ["Which quantum systems and use cases have reproducible baselines for fidelity, scale, error, runtime, cost and classical alternatives?", "Keep performance claims tied to a named device, workload and comparison method.", ["Device and workload identity", "Metric and test protocol", "Classical baseline and uncertainty"]],
    ["How do standards, supply chains, facilities, security requirements, procurement and validation govern movement beyond the laboratory?", "Expose the conversion stack surrounding scientific and engineering progress.", ["Standard and security authority", "Component and facility evidence", "Procurement and validation record"]],
    ["Which accepted deployments and repeated workloads establish reliable institutional use or completed cryptographic migration?", "Separate demonstrations and standards from dependable use and retired vulnerable systems.", ["Receiving organization and acceptance", "Repeated workload or migration cohort", "Failure, rollback and retirement records"]],
    ["Which compatible scientific, operational, security, cost and capability outcomes are observable, and which remain scenarios?", "Prevent projected advantage from being represented as realized value.", ["Stable task and system denominator", "Multi-period accepted-use evidence", "Explicit forecast-versus-observation boundary"]],
  ],
  "space": [
    ["Which launch sites, vehicles, spacecraft and mission services have current baselines for authority, capacity, cadence, reliability and use?", "Keep site, operator, vehicle and mission identities distinct.", ["Site, vehicle and operator identity", "Mission and capacity definitions", "Current licence and operating baseline"]],
    ["How do environmental review, licensing, range capacity, infrastructure, manufacturing, finance and customer commitments govern mission delivery?", "Trace the full path from site or vehicle plan to an executable mission.", ["Site and operator authority", "Infrastructure and production milestones", "Manifest or customer commitment"]],
    ["Which asset acceptance, mission, turnaround and recurring-service records establish dependable capacity?", "Separate a single successful mission from repeatable service and maintained infrastructure.", ["Accepted asset or mission disposition", "Cadence and turnaround denominator", "Repeated reliability and anomaly records"]],
    ["Which compatible reliability, cost, access, scientific, environmental and local outcomes follow from sustained activity?", "Connect mission cadence to system and public value without collapsing unlike missions.", ["Vehicle-, mission- or site-specific series", "Cost and access denominator", "Environmental and community measures"]],
  ],
  "water": [
    ["Which basins, utilities, facilities and user classes have current baselines for supply, demand, quality, reliability and ecological condition?", "Define the hydrologic and service system before attaching a project claim.", ["Basin, utility, facility and user identity", "Flow, quality and demand definitions", "Baseline period and climate context"]],
    ["How do rights, permits, finance, treatment, conveyance, energy and governance constrain delivery of new water service or reuse?", "Show where an agreement or allocation remains short of accepted infrastructure and service.", ["Rights and permit disposition", "Infrastructure chronology", "Treatment, conveyance and utility acceptance criteria"]],
    ["Which accepted-flow, quality, compliance and repeated-service records establish dependable operation?", "Separate construction completion from reliable water delivery and compliant discharge.", ["Receiving utility or regulator acceptance", "Metered flow and quality denominator", "Repeated compliance and outage periods"]],
    ["Which compatible affordability, reliability, ecosystem, health and industrial-resource outcomes follow, and how are drought and demand changes handled?", "Evaluate value and burden across users without erasing basin conditions.", ["Stable user and hydrologic denominator", "Multi-period service and ecosystem series", "Climate, demand and attribution controls"]],
  ],
};

const questionArchetypes = [
  {
    research_horizon: "Baseline",
    target_stage_ids: ["64-STAGE-01-CONTEXT"],
    claim_type_ids: ["116-CLAIM-01-BASELINE", "116-CLAIM-02-RESEARCH"],
    geographic_target: "At least one global or national baseline plus named subnational or asset-level denominators where the system is place-bound.",
    completion_rule: "Publish a bounded answer or an explicit evidence gap with named entities, periods, definitions, denominators, sources and uncertainty; do not substitute a forecast for an observation.",
  },
  {
    research_horizon: "Conversion",
    target_stage_ids: ["64-STAGE-02-AUTHORITY", "64-STAGE-03-COMMITMENT", "64-STAGE-04-IMPLEMENTATION", "64-STAGE-05-VALIDATION"],
    claim_type_ids: ["116-CLAIM-04-AUTHORITY", "116-CLAIM-05-COMMITMENT", "116-CLAIM-06-IMPLEMENTATION", "116-CLAIM-07-VALIDATION"],
    geographic_target: "At least two named jurisdictional pathways, including one outside the current dominant United States evidence rail when authoritative records are available.",
    completion_rule: "Resolve each named pathway to dated authority, commitment, implementation and validation records or a bounded missing-artifact state; stages may not be inferred from one another.",
  },
  {
    research_horizon: "Operation",
    target_stage_ids: ["64-STAGE-06-ACCEPTANCE", "64-STAGE-07-REPEAT"],
    claim_type_ids: ["116-CLAIM-08-ACCEPTANCE", "116-CLAIM-09-OPERATION"],
    geographic_target: "At least two named receiving systems, projects, services or cohorts with stable identities and operating periods.",
    completion_rule: "Require receiving-party acceptance plus repeated compatible observations; otherwise publish the exact next artifact and leave recurring operation unestablished.",
  },
  {
    research_horizon: "Outcome",
    target_stage_ids: ["64-STAGE-08-OUTCOME"],
    claim_type_ids: ["116-CLAIM-10-OUTCOME", "116-CLAIM-12-CORRECTION"],
    geographic_target: "Comparable named cohorts or jurisdictions only where identity, period, definition and denominator compatibility is established.",
    completion_rule: "Admit an outcome only with repeated compatible measures, uncertainty and attribution limits; a bounded blocker or inadmissibility decision is a valid completion state.",
  },
];

const priorityQuestions = [];
topics.forEach((topic) => {
  const entries = topicQuestionSets[topic.slug];
  entries.forEach(([question, why_priority, required_evidence], offset) => {
    const archetype = questionArchetypes[offset];
    priorityQuestions.push({
      question_id: `116-Q-${String(priorityQuestions.length + 1).padStart(3, "0")}`,
      topic_id: topic.id,
      topic_slug: topic.slug,
      research_horizon: archetype.research_horizon,
      question,
      why_priority,
      required_evidence,
      target_stage_ids: archetype.target_stage_ids,
      claim_type_ids: archetype.claim_type_ids,
      geographic_target: archetype.geographic_target,
      completion_rule: archetype.completion_rule,
      current_state: "Queued for evidence audit",
      interpretation_boundary: "This is a research question and completion contract, not a finding, prediction, score, ranking or assertion that the required evidence exists.",
    });
  });
});

const canonicalTopics = topics.map((topic) => ({
  canonical_id: topic.id,
  entity_type: "topic",
  slug: topic.slug,
  label: topic.name,
  aliases: [topic.slug, topic.name],
  legacy_ids: [],
  framework_layers: topic.framework_layers,
  primary_constraints: topic.primary_constraints,
  public_routes: [`/atlas/topics/${topic.slug}/`, `/review/topics/${topic.slug}/`, `/learn/${topic.slug}/`, `/review/coverage/${topic.slug}/`],
}));

const countBy = (values) => Object.fromEntries(
  [...new Set(values.filter(Boolean))].sort().map((value) => [value, values.filter((item) => item === value).length]),
);
const publishedSignals = signalInventory.filter((record) => record.record_status === "Published");
const coverageMatrix = topics.map((topic) => {
  const topicSignals = publishedSignals.filter((record) => record.primary_topic === topic.name);
  const topicSources = sourceInventory.filter((source) => source.primary_topics.includes(topic.name));
  const localSystems = canonicalLocalSystems.filter((record) => record.topic_ids.includes(topic.id));
  const casebooks = canonicalCasebooks.filter((record) => record.topic_ids.includes(topic.id));
  const questions = priorityQuestions.filter((record) => record.topic_id === topic.id);
  const latestCapture = topicSignals.map((record) => record.captured_date).filter(Boolean).sort().at(-1) ?? null;
  let nextAction = "Audit every conversion-stage question against named evidence and record the first bounded answer or gap.";
  if (!localSystems.length && !casebooks.length) nextAction = "Create the first named local-system portrait and casebook before attempting cross-jurisdiction comparison.";
  else if (!localSystems.length) nextAction = "Create the first place-bound local-system portrait and connect it to authoritative local records.";
  else if (!casebooks.length) nextAction = "Create the first named project or adoption casebook with a conversion-stage chronology.";
  return {
    topic_id: topic.id,
    slug: topic.slug,
    label: topic.name,
    current_inventory: {
      published_signals: topicSignals.length,
      registered_sources: topicSources.length,
      tier_1_or_2_sources: topicSources.filter((source) => ["Tier 1", "Tier 2"].includes(source.credibility_level)).length,
      source_geographies: [...new Set(topicSources.map((source) => source.country_or_region))].sort(),
      latest_published_signal_capture_date: latestCapture,
      maturity_distribution: countBy(topicSignals.map((record) => record.maturity_level)),
      claim_scope_distribution: countBy(topicSignals.map((record) => record.claim_scope)),
    },
    local_system_ids: localSystems.map((record) => record.canonical_id),
    casebook_ids: casebooks.map((record) => record.canonical_id),
    priority_question_ids: questions.map((record) => record.question_id),
    stage_question_map: phase64.stage_taxonomy.map((stage) => ({
      stage_id: stage.stage_id,
      question_ids: questions.filter((question) => question.target_stage_ids.includes(stage.stage_id)).map((question) => question.question_id),
    })),
    baseline_state: "Inventory established; evidence adequacy has not been inferred from record volume.",
    next_action: nextAction,
  };
});

const qualityDimensions = [
  ["116-QUALITY-01-IDENTITY", "Canonical identity", "Is the topic, place, institution, project, asset, service or cohort unambiguously named?", "One canonical ID, type-scoped aliases, route resolution and an explicit non-equivalence rule for nearby entities.", "Identity collision, unnamed population, mixed facility or silent aliasing."],
  ["116-QUALITY-02-CLAIM", "Claim bounding", "Does each material sentence state actor, object, action, date, scope and status?", "A claim type, named subject, bounded predicate, date or period, and a statement of what the evidence does not establish.", "Announcement, permission, implementation, operation and outcome language collapsed into one claim."],
  ["116-QUALITY-03-AUTHORITY", "Authority and provenance", "Is the source authoritative for the specific claim and can the evidence trail be followed?", "Direct source ID, publisher authority, document date, capture date, locator and any supersession or correction history.", "Secondary summary used where primary authority is required, or provenance cannot be reconstructed."],
  ["116-QUALITY-04-STAGE", "Conversion-stage clarity", "Which of the eight evidence stages is established, held or not established?", "A stage-specific decision with direct artifacts and an exact next-artifact boundary.", "Technology maturity or elapsed time used as a proxy for conversion evidence."],
  ["116-QUALITY-05-PLACE", "Geographic and local specificity", "Where does the claim apply and which receiving institutions or infrastructures matter?", "Jurisdiction, place or service-area identity, authority actors, local dependencies and transfer limits.", "National or global evidence presented as proof of local delivery."],
  ["116-QUALITY-06-FRESHNESS", "Time and freshness", "Is the record current enough for its purpose and is staleness visible?", "Event date, source date, capture date, last review date, expected cadence and next check where applicable.", "Undated present-tense claim or silent reliance on a superseded artifact."],
  ["116-QUALITY-07-MEASURE", "Measurement and denominator", "Can a reader reconstruct what was measured, for whom, over what period and against which denominator?", "Measure definition, unit, entity or cohort, period, denominator, exclusions, uncertainty and revision policy.", "Numerator without denominator, incompatible periods or an unstable entity definition."],
  ["116-QUALITY-08-COMPARABILITY", "Comparability", "Are identities, definitions, periods and denominators compatible enough for comparison?", "A declared compatibility decision, harmonization method, series-break treatment and explicit exclusions.", "Ranking or causal comparison across incompatible records."],
  ["116-QUALITY-09-UNCERTAINTY", "Uncertainty and alternatives", "What remains unknown, disputed or explainable by other causes?", "Evidence limits, competing explanations, disconfirming evidence and the artifact that would change the conclusion.", "Confidence implied by tone or record volume rather than evidence."],
  ["116-QUALITY-10-REPRODUCIBILITY", "Reproducibility and correction", "Can another reader reproduce the conclusion and see later changes?", "Machine-readable record, public method, stable identifiers, dated update, prior/current state and complete propagation path.", "Silent overwrite, non-reproducible synthesis or correction missing from downstream surfaces."],
].map(([quality_dimension_id, label, audit_question, minimum_publishable_state, failure_state]) => ({
  quality_dimension_id, label, audit_question, minimum_publishable_state, failure_state,
}));

const completionRubric = {
  rule: "Evaluate each required dimension independently. FTFN does not sum, average or rank dimension states.",
  states: [
    { state_id: "116-RUBRIC-UNMAPPED", label: "Unmapped", definition: "The required entity, claim, stage, geography or measure has not been identified." },
    { state_id: "116-RUBRIC-IDENTIFIED", label: "Identified", definition: "The object and expected artifact are named, but sufficient direct evidence is not yet captured." },
    { state_id: "116-RUBRIC-BOUNDED", label: "Bounded", definition: "Available evidence and its stopping point are explicit; the next artifact or blocker is named." },
    { state_id: "116-RUBRIC-EVIDENCED", label: "Evidenced", definition: "Direct artifacts satisfy the claim-specific minimum without inference across conversion stages." },
    { state_id: "116-RUBRIC-REVIEWED", label: "Reviewed", definition: "A human review has checked identity, claim, provenance, stage, geography, time, measure, uncertainty and propagation." },
    { state_id: "116-RUBRIC-MAINTAINED", label: "Maintained", definition: "Freshness cadence, correction path, machine-readable release and next review are active." },
  ],
  publication_requirements: {
    topic_chapter: ["All material claims are bounded and cited.", "At least one baseline, conversion, operation and outcome question has a dated answer or explicit evidence gap.", "Geographic transfer limits and next decisive artifacts are visible."],
    local_system: ["Canonical place or service-area identity and accountable authority actors are recorded.", "Direct local sources support the conversion trail.", "Missing local data and last review date are public."],
    casebook: ["Named entity identity is stable across events.", "Chronology distinguishes all applicable conversion stages.", "Acceptance, recurring operation and outcome remain separate decisions with explicit denominators."],
    comparison: ["Entity, period, definition and denominator compatibility is affirmatively established.", "Excluded cases and series breaks are visible.", "No aggregate score or ranking substitutes for the evidence."],
  },
};

const freshnessDays = (date) => Math.floor((Date.parse(effectiveDate) - Date.parse(date)) / 86_400_000);
const sourceFreshnessBands = {
  "0_to_30_days": sourceInventory.filter((source) => freshnessDays(source.last_checked_date) <= 30).length,
  "31_to_90_days": sourceInventory.filter((source) => freshnessDays(source.last_checked_date) > 30 && freshnessDays(source.last_checked_date) <= 90).length,
  "91_to_180_days": sourceInventory.filter((source) => freshnessDays(source.last_checked_date) > 90 && freshnessDays(source.last_checked_date) <= 180).length,
  "over_180_days": sourceInventory.filter((source) => freshnessDays(source.last_checked_date) > 180).length,
};
const aliases = [...canonicalTopics, ...canonicalLocalSystems, ...canonicalCasebooks].flatMap((record) => record.aliases);
const phaseRoutes = ["/review/coverage/", ...topics.map((topic) => `/review/coverage/${topic.slug}/`)];

const program = {
  schema_version: "1.0",
  program_id: "FTFN-V0.4-COVERAGE-ARCHITECTURE",
  phase: 116,
  title: "FTFN v0.4 — Coverage architecture and quality baseline",
  effective_date: effectiveDate,
  record_status: "Published",
  summary: "A canonical, public coverage architecture that reconciles topics, places, casebooks, conversion stages, claim types, geographies, research questions and quality requirements without changing any upstream evidence decision.",
  publication_boundaries: [
    "This registry describes coverage, identity, research priorities and completion contracts. It creates no source fact, gate decision, receipt, observation, outcome, score or ranking.",
    "Technology maturity and conversion evidence remain distinct. A topic's record volume never advances a project, adoption case or outcome stage.",
    "Canonical aliases support discovery only within an entity type; they do not merge nearby facilities, projects, operators, services or cohorts.",
    "Future Phase 60 evidence gates remain scheduled until their due dates and official-source checks.",
    "A bounded evidence gap or inadmissibility decision is a valid research result; quotas never manufacture evidence.",
  ],
  canonical_rules: {
    identifier_pattern: "Stable lowercase semantic IDs for editorial entities; governed upstream IDs remain aliases or linked file IDs rather than being rewritten.",
    alias_scope: "Aliases resolve only within topic, local_system or casebook type. Cross-type matches require an explicit relationship, never implicit equivalence.",
    identity_change_rule: "A split, merge or renamed entity requires a dated change record retaining every prior ID and route.",
    stage_rule: "Conversion stages are evidence questions, not technology-readiness levels, probability estimates or value judgments.",
    comparison_rule: "No cross-entity comparison is admissible until identity, period, definition and denominator compatibility are explicitly established.",
  },
  counts: {
    topics: canonicalTopics.length,
    editorial_local_systems: canonicalLocalSystems.length,
    structured_local_systems: canonicalLocalSystems.filter((record) => record.representation_tier === "structured_local_system").length,
    editorial_portraits_requiring_promotion: canonicalLocalSystems.filter((record) => record.representation_tier === "editorial_portrait").length,
    casebooks: canonicalCasebooks.length,
    structured_conversion_casebooks: canonicalCasebooks.filter((record) => record.representation_tier === "structured_conversion_file").length,
    editorial_casebooks_requiring_promotion: canonicalCasebooks.filter((record) => record.representation_tier === "editorial_casebook").length,
    canonical_entities: canonicalTopics.length + canonicalLocalSystems.length + canonicalCasebooks.length,
    aliases: aliases.length,
    conversion_stages: phase64.stage_taxonomy.length,
    claim_types: claimTypes.length,
    geography_scope_types: geographyScopeTypes.length,
    current_geography_areas: geographyAreas.length,
    quality_dimensions: qualityDimensions.length,
    priority_questions: priorityQuestions.length,
    public_routes: phaseRoutes.length,
  },
  conversion_stages: phase64.stage_taxonomy,
  claim_types: claimTypes,
  geography_scope_types: geographyScopeTypes,
  geography_areas: geographyAreas,
  expansion_geography_priorities: [
    { priority_id: "116-GEO-PRIORITY-EUROPE", label: "Europe", completion_target: "At least two jurisdictions and one multilateral authority rail across five priority topics." },
    { priority_id: "116-GEO-PRIORITY-EAST-SOUTH-ASIA", label: "East and South Asia", completion_target: "At least three jurisdictions with official industrial, infrastructure and outcome rails." },
    { priority_id: "116-GEO-PRIORITY-AFRICA", label: "Africa", completion_target: "At least three regionally diverse place systems built with local and multilateral primary sources." },
    { priority_id: "116-GEO-PRIORITY-LATAM-CARIBBEAN", label: "Latin America and the Caribbean", completion_target: "At least three place systems spanning infrastructure, climate and industrial conversion." },
    { priority_id: "116-GEO-PRIORITY-MENA", label: "Middle East and North Africa", completion_target: "At least two place systems with water, energy, industry and climate authority rails." },
    { priority_id: "116-GEO-PRIORITY-PACIFIC", label: "Pacific states and territories", completion_target: "At least two place systems centered on access, resilience, energy and climate delivery." },
  ],
  quality_dimensions: qualityDimensions,
  completion_rubric: completionRubric,
  entity_registry: {
    topics: canonicalTopics,
    local_systems: canonicalLocalSystems,
    casebooks: canonicalCasebooks,
  },
  coverage_matrix: coverageMatrix,
  priority_questions: priorityQuestions,
  baseline: {
    baseline_cutoff: "The inventory freezes the corpus handed forward by Phase 115 and intentionally excludes Phase 117 source additions so that v0.4 progress remains measurable against a stable starting point.",
    published_signals: publishedSignals.length,
    registered_sources: sourceInventory.length,
    source_freshness_as_of: effectiveDate,
    source_freshness_bands: sourceFreshnessBands,
    source_geography_distribution: countBy(sourceInventory.map((source) => source.country_or_region)),
    topics_without_local_systems: coverageMatrix.filter((row) => row.local_system_ids.length === 0).map((row) => row.topic_id),
    topics_without_casebooks: coverageMatrix.filter((row) => row.casebook_ids.length === 0).map((row) => row.topic_id),
    interpretation_boundary: "Counts describe the current corpus inventory. They are not evidence-quality scores, topic rankings, maturity judgments or claims of completeness.",
  },
  phase_routes: phaseRoutes,
};

await writeJson(join(appRoot, "src", "data", "phase-116-coverage-architecture.json"), program);

await writeJson(join(appRoot, "src", "content", "updates", "2026-08-30-phase-116-v04-coverage-architecture.json"), {
  id: "update-2026-08-30-phase-116-v04-coverage-architecture",
  effective_date: effectiveDate,
  entry_type: "Source Refresh",
  title: "Phase 116 establishes the v0.4 coverage architecture",
  summary: "Publishes canonical identity, coverage inventory, 68 priority questions and dimension-by-dimension completion requirements for all 17 topics, 15 place systems and 24 casebooks.",
  affected_record_ids: canonicalTopics.map((record) => record.canonical_id),
  related_paths: phaseRoutes,
  evidence_note: "This is a content-architecture and navigation release. It changes no source fact, evidence gate, receipt, observation, outcome, score, ranking or future scheduled state.",
  materiality: "No record-state change",
  publication_effect: `Publishes ${phaseRoutes.length} coverage routes and one machine-readable coverage registry.`,
  next_check_date: "2026-09-30",
  work_package: "docs/work-packages/phase-116-v04-coverage-architecture-canonical-identity-quality-baseline.md",
});

console.log(`Phase 116 built: ${program.counts.canonical_entities} canonical entities, ${program.counts.priority_questions} priority questions and ${program.counts.public_routes} public routes.`);
