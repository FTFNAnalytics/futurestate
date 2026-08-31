import { writeFile } from "node:fs/promises";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const appRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const workspaceRoot = resolve(appRoot, "..");
const date = "2026-08-30";
const slugify = (value) => value.toLowerCase().normalize("NFKD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
const writeJson = (path, value) => writeFile(path, JSON.stringify(value, null, 2) + "\n", "utf8");

const archetypes = {
  statistics: {
    label: "Official statistics and measurement",
    topics: ["Human Futures", "Finance and Risk", "Climate", "Energy", "Water", "Agriculture and Bioeconomy"],
    layers: ["Planetary Conditions", "Resource Foundations", "Human Systems"],
    watch_lanes: ["Cross-Cutting Official Rails", "Climate", "Finance and Human Futures"],
    coverage_role: ["Primary Data"],
    stages: ["Named context or baseline", "Recurring operation or output", "Comparable outcome"],
    artifacts: ["official statistical release", "time series", "methodology and revision note"],
    access: "Interactive Portal",
  },
  energy: {
    label: "Energy, utility and system operation",
    topics: ["Energy", "Climate", "Critical Minerals", "Water", "Finance and Risk", "Policy and Standards"],
    layers: ["Planetary Conditions", "Resource Foundations", "Enabling Infrastructure", "Human Systems"],
    watch_lanes: ["Power and Grid", "Climate", "Critical Minerals"],
    coverage_role: ["Primary Data", "Regulatory Change"],
    stages: ["Policy or authority", "Build or implementation", "Accepted service, product, or cutover", "Recurring operation or output", "Comparable outcome"],
    artifacts: ["system plan or rule", "operating data", "capacity or reliability report"],
    access: "Report Series",
  },
  infrastructure: {
    label: "Infrastructure, environment and territorial delivery",
    topics: ["Mobility", "Aviation", "Water", "Energy", "Advanced Manufacturing", "Policy and Standards", "Human Futures"],
    layers: ["Planetary Conditions", "Enabling Infrastructure", "Human Systems"],
    watch_lanes: ["Local Systems", "Mobility Certification", "Water"],
    coverage_role: ["Regulatory Change", "Local Conversion Evidence"],
    stages: ["Policy or authority", "Finance, procurement, or agreement", "Build or implementation", "Test, compliance, or qualification", "Accepted service, product, or cutover"],
    artifacts: ["project or assessment register", "permit or authorization", "delivery, completion or acceptance record"],
    access: "Interactive Portal",
  },
  innovation: {
    label: "Science, technology and industrial innovation",
    topics: ["AI for Science", "Quantum", "Chips and Compute", "Discovery Technologies", "Advanced Manufacturing", "Agriculture and Bioeconomy", "Space", "Cybersecurity", "Policy and Standards"],
    layers: ["Resource Foundations", "Enabling Infrastructure", "Frontier Domains", "Human Systems"],
    watch_lanes: ["AI and Advanced Manufacturing", "Compute and Chips", "Discovery Technologies", "Security and Standards", "Space"],
    coverage_role: ["Research Program Evidence", "Funding Evidence", "Standards Evidence"],
    stages: ["Named context or baseline", "Policy or authority", "Finance, procurement, or agreement", "Test, compliance, or qualification", "Accepted service, product, or cutover"],
    artifacts: ["research program or award", "technical report", "standard, trial or adoption record"],
    access: "Release Page",
  },
};

const jurisdictions = [
  ["canada", "Canada", "North America", ["English", "French"], [
    ["Statistics Canada", "https://www.statcan.gc.ca/en/start", "statistics"],
    ["Canada Energy Regulator", "https://www.cer-rec.gc.ca/en/", "energy"],
    ["Impact Assessment Agency of Canada", "https://iaac-aeic.gc.ca/050/evaluations/index?culture=en-CA", "infrastructure"],
    ["Innovation, Science and Economic Development Canada", "https://ised-isde.canada.ca/site/ised/en", "innovation"],
  ]],
  ["australia", "Australia", "Oceania", ["English"], [
    ["Australian Bureau of Statistics", "https://www.abs.gov.au/", "statistics"],
    ["Australian Energy Market Operator", "https://aemo.com.au/", "energy"],
    ["Infrastructure Australia", "https://www.infrastructureaustralia.gov.au/", "infrastructure"],
    ["Commonwealth Scientific and Industrial Research Organisation", "https://www.csiro.au/en/", "innovation"],
  ]],
  ["european-union", "European Union", "Europe", ["24 official EU languages"], [
    ["Eurostat", "https://ec.europa.eu/eurostat/", "statistics"],
    ["European Commission Directorate-General for Energy", "https://energy.ec.europa.eu/", "energy"],
    ["EUR-Lex", "https://eur-lex.europa.eu/", "infrastructure"],
    ["CORDIS", "https://cordis.europa.eu/", "innovation"],
  ]],
  ["united-kingdom", "United Kingdom", "Europe", ["English", "Welsh"], [
    ["Office for National Statistics", "https://www.ons.gov.uk/", "statistics"],
    ["Department for Energy Security and Net Zero", "https://www.gov.uk/government/organisations/department-for-energy-security-and-net-zero", "energy"],
    ["Planning Inspectorate", "https://www.gov.uk/government/organisations/planning-inspectorate", "infrastructure"],
    ["UK Research and Innovation", "https://www.ukri.org/", "innovation"],
  ]],
  ["germany", "Germany", "Europe", ["German", "English"], [
    ["Federal Statistical Office of Germany", "https://www.destatis.de/EN/Home/_node.html", "statistics"],
    ["Bundesnetzagentur", "https://www.bundesnetzagentur.de/EN/General/Bundesnetzagentur/About/start.html", "energy"],
    ["German Environment Agency", "https://www.umweltbundesamt.de/en", "infrastructure"],
    ["Federal Ministry of Research, Technology and Space", "https://www.bmftr.bund.de/EN/Home/home_node.html", "innovation"],
  ]],
  ["france", "France", "Europe", ["French", "English"], [
    ["INSEE", "https://www.insee.fr/en/accueil", "statistics"],
    ["RTE", "https://www.rte-france.com/en", "energy"],
    ["Ministry for Ecological Transition", "https://www.ecologie.gouv.fr/", "infrastructure"],
    ["ADEME", "https://www.ademe.fr/en/frontpage/", "innovation"],
  ]],
  ["netherlands", "Netherlands", "Europe", ["Dutch", "English"], [
    ["Statistics Netherlands", "https://www.cbs.nl/en-gb", "statistics"],
    ["Netherlands Enterprise Agency", "https://english.rvo.nl/", "energy"],
    ["Rijkswaterstaat", "https://www.rijkswaterstaat.nl/en", "infrastructure"],
    ["PBL Netherlands Environmental Assessment Agency", "https://www.pbl.nl/en", "innovation"],
  ]],
  ["norway", "Norway", "Europe", ["Norwegian", "English"], [
    ["Statistics Norway", "https://www.ssb.no/en", "statistics"],
    ["Norwegian Water Resources and Energy Directorate", "https://www.nve.no/energy-supply/", "energy"],
    ["Norwegian Environment Agency", "https://www.environmentagency.no/", "infrastructure"],
    ["Research Council of Norway", "https://www.forskningsradet.no/en/", "innovation"],
  ]],
  ["sweden", "Sweden", "Europe", ["Swedish", "English"], [
    ["Statistics Sweden", "https://www.scb.se/en/", "statistics"],
    ["Swedish Energy Agency", "https://www.energimyndigheten.se/en/", "energy"],
    ["Swedish Transport Administration", "https://bransch.trafikverket.se/en/startpage/", "infrastructure"],
    ["Vinnova", "https://www.vinnova.se/en/", "innovation"],
  ]],
  ["japan", "Japan", "Asia", ["Japanese", "English"], [
    ["e-Stat Japan", "https://www.e-stat.go.jp/en", "statistics"],
    ["Ministry of Economy, Trade and Industry", "https://www.meti.go.jp/english/", "energy"],
    ["Ministry of Land, Infrastructure, Transport and Tourism", "https://www.mlit.go.jp/en/", "infrastructure"],
    ["New Energy and Industrial Technology Development Organization", "https://www.nedo.go.jp/english/", "innovation"],
  ]],
  ["south-korea", "South Korea", "Asia", ["Korean", "English"], [
    ["Korean Statistical Information Service", "https://kosis.kr/eng/", "statistics"],
    ["Ministry of Trade, Industry and Energy", "https://english.motie.go.kr/", "energy"],
    ["Korea Power Exchange", "https://www.kpx.or.kr/eng/", "infrastructure"],
    ["Korea Institute of Science and Technology Evaluation and Planning", "https://www.kistep.re.kr/eng/", "innovation"],
  ]],
  ["singapore", "Singapore", "Asia", ["English", "Malay", "Mandarin", "Tamil"], [
    ["Singapore Department of Statistics", "https://www.singstat.gov.sg/", "statistics"],
    ["Energy Market Authority", "https://www.ema.gov.sg/", "energy"],
    ["Land Transport Authority", "https://www.lta.gov.sg/", "infrastructure"],
    ["Infocomm Media Development Authority", "https://www.imda.gov.sg/", "innovation"],
  ]],
  ["india", "India", "Asia", ["Hindi", "English", "regional languages"], [
    ["Open Government Data Platform India", "https://www.data.gov.in/", "statistics"],
    ["Ministry of Power", "https://powermin.gov.in/", "energy"],
    ["Central Electricity Authority", "https://cea.nic.in/?lang=en", "infrastructure"],
    ["Ministry of New and Renewable Energy", "https://mnre.gov.in/en/", "innovation"],
  ]],
  ["new-zealand", "New Zealand", "Oceania", ["English", "Māori", "New Zealand Sign Language"], [
    ["Stats NZ", "https://www.stats.govt.nz/", "statistics"],
    ["Electricity Authority", "https://www.ea.govt.nz/", "energy"],
    ["Ministry of Business, Innovation and Employment", "https://www.mbie.govt.nz/", "infrastructure"],
    ["Ministry for the Environment", "https://environment.govt.nz/", "innovation"],
  ]],
  ["brazil", "Brazil", "South America", ["Portuguese"], [
    ["Brazilian Institute of Geography and Statistics", "https://www.ibge.gov.br/en/home-eng.html", "statistics"],
    ["National Electric Energy Agency", "https://www.gov.br/aneel/en", "energy"],
    ["Energy Research Office", "https://www.epe.gov.br/en", "infrastructure"],
    ["Ministry of Science, Technology and Innovation", "https://www.gov.br/mcti/pt-br", "innovation"],
  ]],
  ["chile", "Chile", "South America", ["Spanish"], [
    ["National Statistics Institute of Chile", "https://www.ine.gob.cl/", "statistics"],
    ["National Energy Commission", "https://www.cne.cl/", "energy"],
    ["Environmental Assessment Service", "https://www.sea.gob.cl/", "infrastructure"],
    ["Ministry of Energy", "https://energia.gob.cl/", "innovation"],
  ]],
  ["south-africa", "South Africa", "Africa", ["11 official languages"], [
    ["Statistics South Africa", "https://www.statssa.gov.za/", "statistics"],
    ["National Energy Regulator of South Africa", "https://www.nersa.org.za/", "energy"],
    ["Department of Forestry, Fisheries and the Environment", "https://www.dffe.gov.za/", "infrastructure"],
    ["Council for Scientific and Industrial Research", "https://www.csir.co.za/", "innovation"],
  ]],
  ["mexico", "Mexico", "North America", ["Spanish"], [
    ["INEGI", "https://www.inegi.org.mx/", "statistics"],
    ["Secretariat of Energy", "https://www.gob.mx/sener", "energy"],
    ["National Center for Energy Control", "https://www.cenace.gob.mx/", "infrastructure"],
    ["Secretariat of Environment and Natural Resources", "https://www.gob.mx/semarnat", "innovation"],
  ]],
  ["united-arab-emirates", "United Arab Emirates", "Middle East", ["Arabic", "English"], [
    ["Federal Competitiveness and Statistics Centre", "https://fcsc.gov.ae/", "statistics"],
    ["Ministry of Energy and Infrastructure", "https://www.moei.gov.ae/en", "energy"],
    ["Telecommunications and Digital Government Regulatory Authority", "https://tdra.gov.ae/en/", "infrastructure"],
    ["UAE Space Agency", "https://space.gov.ae/", "innovation"],
  ]],
  ["multilateral-systems", "Multilateral systems", "Global", ["Multilingual"], [
    ["World Bank Data", "https://data.worldbank.org/", "statistics"],
    ["International Energy Agency", "https://www.iea.org/data-and-statistics", "energy"],
    ["OECD Data Explorer", "https://data-explorer.oecd.org/", "infrastructure"],
    ["International Renewable Energy Agency", "https://www.irena.org/Data", "innovation"],
  ]],
];

const railRecords = [];
const jurisdictionRecords = jurisdictions.map(([slug, name, region, languages, rails], jurisdictionIndex) => {
  const jurisdictionId = `117-JURISDICTION-${String(jurisdictionIndex + 1).padStart(3, "0")}`;
  const railIds = rails.map(([institution, url, archetype]) => {
    const profile = archetypes[archetype];
    const institutionSlug = slugify(institution);
    const railId = `117-RAIL-${String(railRecords.length + 1).padStart(3, "0")}`;
    const sourceId = `source-117-global-${slug}-${institutionSlug}`;
    railRecords.push({
      rail_id: railId,
      slug: `${slug}-${institutionSlug}`,
      source_id: sourceId,
      jurisdiction_id: jurisdictionId,
      jurisdiction_slug: slug,
      jurisdiction_name: name,
      institution_name: institution,
      official_url: url,
      authority_class: profile.label,
      topic_ids: profile.topics.map((topic) => `topic-${slugify(topic)}`),
      conversion_stages: profile.stages,
      artifact_families: profile.artifacts,
      mapping_state: "Mapped candidate authority rail",
      artifact_review_state: "Exact artifact review required",
      interpretation_boundary: "An official portal or institution identity establishes a discovery rail, not the truth, implementation, operation or outcome of any downstream claim.",
    });
    return railId;
  });
  return {
    jurisdiction_id: jurisdictionId,
    slug,
    name,
    region,
    languages,
    rail_ids: railIds,
    coverage_state: "Four authority classes mapped",
    interpretation_boundary: "Jurisdiction coverage records where FTFN can look for evidence. It is not a score, ranking, completeness declaration or equivalence finding.",
  };
});

for (const rail of railRecords) {
  const source = {
    id: rail.source_id,
    name: rail.institution_name,
    url: rail.official_url,
    source_type: rail.jurisdiction_slug === "multilateral-systems" ? "International Organization" : /Research|Scientific|CSIR|CSIRO|NEDO|Vinnova|ADEME|PBL|Environment/.test(rail.institution_name) ? "Research Lab" : "Government Agency",
    credibility_level: "Tier 1",
    primary_topics: rail.topic_ids.map((id) => id.replace(/^topic-/, "").split("-").map((part) => part[0].toUpperCase() + part.slice(1)).join(" ")).map((topic) => topic.replace("Ai ", "AI ")),
    framework_layers: archetypes[jurisdictions.find((entry) => entry[0] === rail.jurisdiction_slug)[4].find((entry) => entry[0] === rail.institution_name)[2]].layers,
    country_or_region: rail.jurisdiction_name,
    update_frequency: "Portal and document-family dependent; inspect the exact artifact before use.",
    capture_priority: "High",
    known_limitations: "Phase 117 maps this official institutional rail and its likely artifact families. The portal is not itself evidence for a project, adoption, accepted operation, comparison or outcome; every exact artifact still requires dated review.",
    last_checked_date: date,
    watch_lanes: archetypes[jurisdictions.find((entry) => entry[0] === rail.jurisdiction_slug)[4].find((entry) => entry[0] === rail.institution_name)[2]].watch_lanes,
    live_access_type: archetypes[jurisdictions.find((entry) => entry[0] === rail.jurisdiction_slug)[4].find((entry) => entry[0] === rail.institution_name)[2]].access,
    review_cadence_days: 90,
    monitoring_status: "Candidate",
    coverage_role: archetypes[jurisdictions.find((entry) => entry[0] === rail.jurisdiction_slug)[4].find((entry) => entry[0] === rail.institution_name)[2]].coverage_role,
    jurisdiction: rail.jurisdiction_name,
    source_owner: rail.institution_name,
    automation_notes: "Discovery-only mapping. Capture and review the exact official artifact before signal creation or publication use.",
    notes: `Phase 117 global authority graph rail ${rail.rail_id}; mapped ${date}.`,
  };
  // Preserve exact enum spelling for compound topic names.
  source.primary_topics = archetypes[jurisdictions.find((entry) => entry[0] === rail.jurisdiction_slug)[4].find((entry) => entry[0] === rail.institution_name)[2]].topics;
  await writeJson(join(appRoot, "src", "content", "sources", `${source.id}.json`), source);
}

const topicCoverage = [...new Set(railRecords.flatMap((rail) => rail.topic_ids))].sort().map((topicId) => ({
  topic_id: topicId,
  rail_ids: railRecords.filter((rail) => rail.topic_ids.includes(topicId)).map((rail) => rail.rail_id),
}));
const stageCoverage = [...new Set(railRecords.flatMap((rail) => rail.conversion_stages))].map((stage) => ({
  stage,
  rail_ids: railRecords.filter((rail) => rail.conversion_stages.includes(stage)).map((rail) => rail.rail_id),
}));

const program = {
  schema_version: "1.0",
  program_id: "FTFN-V0.4-PHASE-117-GLOBAL-AUTHORITY-GRAPH",
  title: "Global authority graph",
  effective_date: date,
  record_status: "Published",
  summary: "Eighty explicitly bounded official authority rails across nineteen national or supranational jurisdictions and one multilateral layer, organized for artifact-level evidence acquisition rather than automatic claim creation.",
  publication_boundary: "A mapped authority rail is a discovery and monitoring object. It does not establish a project fact, adoption, acceptance, operation, comparison, outcome, score, ranking or jurisdictional equivalence.",
  counts: {
    jurisdictions: jurisdictionRecords.length,
    authority_rails: railRecords.length,
    authority_classes: Object.keys(archetypes).length,
    topics_covered: topicCoverage.length,
    conversion_stages_covered: stageCoverage.length,
    non_us_share_of_phase117_rails: 1,
    source_records_added: railRecords.length,
  },
  quality_bar: {
    exact_artifact_required: true,
    automatic_signal_creation_allowed: false,
    automatic_publication_allowed: false,
    interested_party_or_official_identity_as_outcome_allowed: false,
    minimum_priority_non_us_share: 0.35,
    achieved_phase117_non_us_share: 1,
  },
  authority_classes: Object.entries(archetypes).map(([id, value]) => ({ authority_class_id: id, ...value })),
  jurisdictions: jurisdictionRecords,
  rails: railRecords,
  topic_coverage: topicCoverage,
  stage_coverage: stageCoverage,
};

await writeJson(join(appRoot, "src", "data", "phase-117-global-authority-graph.json"), program);
await writeJson(join(appRoot, "src", "content", "updates", "2026-08-30-phase-117-global-authority-graph.json"), {
  id: "update-2026-08-30-phase-117-global-authority-graph",
  effective_date: date,
  entry_type: "Source Refresh",
  title: "Phase 117 maps the global authority graph",
  summary: "Eighty candidate official rails across twenty jurisdiction layers expand the discovery surface while retaining artifact-level review and human-publication boundaries.",
  affected_record_ids: topicCoverage.map((item) => item.topic_id),
  related_paths: ["/review/authority/", "/data/global-authority-graph.json"],
  evidence_note: "The mapped portals identify institutions and likely artifact families only. No portal identity is treated as proof of implementation, accepted operation or outcome.",
  materiality: "No record-state change",
  publication_effect: "Adds eighty Candidate source rails and a public global authority graph without changing any existing signal, gate, receipt or outcome.",
  next_check_date: null,
  work_package: "docs/work-packages/phase-117-v04-global-authority-graph.md",
});

const workPackage = `# Phase 117 — Global Authority Graph\n\n**Status:** Complete\n**Effective date:** ${date}\n**Program:** FTFN v0.4 — The Public Conversion Observatory\n\n## Purpose\n\nExpand FTFN beyond its United States concentration by mapping primary official rails across national, supranational and multilateral systems. The graph is an acquisition and monitoring layer, not a claim or completeness layer.\n\n## Delivered\n\n- ${jurisdictionRecords.length} jurisdiction layers across ${new Set(jurisdictionRecords.map((item) => item.region)).size} world regions.\n- ${railRecords.length} Candidate authority rails and matching source records.\n- Four authority classes per jurisdiction: statistics, energy/system operation, infrastructure/territorial delivery, and science/innovation.\n- Coverage of all ${topicCoverage.length} FTFN topics and ${stageCoverage.length} conversion stages.\n- Jurisdiction, institution and rail routes plus a public JSON export.\n\n## Admission boundary\n\nA mapped portal is not an admitted artifact. Every downstream use requires the exact document, dataset, docket, filing, permit, inspection, acceptance, operating or measurement record to be checked on its real date. No source mapping creates a signal, receipt, gate result, observation, outcome, comparison, score or ranking.\n\n## Completion standard\n\nPhase 117 is complete when the registry contains twenty distinct jurisdiction layers, eighty unique official HTTPS rails, all seventeen topics, all eight conversion stages, four authority classes per jurisdiction, Candidate monitoring status on every new source, and no future Phase 60 mutation.\n`;
await writeFile(join(workspaceRoot, "docs", "work-packages", "phase-117-v04-global-authority-graph.md"), workPackage, "utf8");

console.log(`Phase 117 built: ${jurisdictionRecords.length} jurisdictions, ${railRecords.length} authority rails, ${topicCoverage.length} topics.`);
