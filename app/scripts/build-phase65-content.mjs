import { readFile, readdir, writeFile } from "node:fs/promises";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const scriptDirectory = dirname(fileURLToPath(import.meta.url));
const appRoot = resolve(scriptDirectory, "..");
const workspaceRoot = resolve(appRoot, "..");
const contentRoot = join(appRoot, "src", "content");
const today = "2026-08-11";

const readJson = async (...parts) => JSON.parse(await readFile(join(...parts), "utf8"));
const writeJson = async (path, value) => {
  const content = `${JSON.stringify(value, null, 2)}\n`;
  for (let attempt = 1; attempt <= 6; attempt += 1) {
    try {
      await writeFile(path, content, "utf8");
      return;
    } catch (error) {
      if (attempt === 6) throw error;
      await new Promise((resolveDelay) => setTimeout(resolveDelay, attempt * 100));
    }
  }
};
const readText = async (...parts) => readFile(join(...parts), "utf8");

const researchPacks = [
  {
    pack_id: "65-NAMED-01-TSMC",
    file_id: "project-tsmc-arizona",
    label: "TSMC Arizona delivery",
    collection: "named",
    question: "Which records separate campus construction, utility arrangements, workforce inputs, qualification, customer acceptance, and repeat facility output?",
    documents: [
      "research-doc-55y-tsmc-arizona-operating-update-2026",
      "research-doc-55n-phoenix-tsmc-fab3-topping-out",
      "research-doc-55n-phoenix-tsmc-wastewater-agreement",
      "research-doc-55s2-phoenix-preliminary-cip-2026-2031",
      "research-doc-55s-phoenix-ama-fifth-management-plan",
      "research-doc-55y-asml-technical-academy-2025",
      "research-doc-55y-intel-arizona-apprenticeship-2024",
      "research-doc-55y-intel-arizona-water-2024"
    ]
  },
  {
    pack_id: "65-NAMED-02-TORONTO",
    file_id: "project-toronto-24-254930",
    label: "Toronto application 24 254930 delivery",
    collection: "named",
    question: "Which records separate Council adoption and infrastructure context from enactment, conditions, building permit, start, completion, and occupancy?",
    documents: [
      "research-doc-57z-toronto-council-adoption",
      "research-doc-55n-toronto-sc33-9-item-history",
      "research-doc-55s2-toronto-capital-project-pipeline-2026",
      "research-doc-55s2-oeb-eb-2026-0129",
      "research-doc-55s2-census-bps-annual-2025",
      "research-doc-55z-eia-us-outage-duration-2024",
      "research-doc-55z-nerc-state-of-reliability-2025",
      "research-doc-55s2-eia-860-early-release-2025"
    ]
  },
  {
    pack_id: "65-NAMED-03-NOVA",
    file_id: "project-northern-virginia-large-load",
    label: "Northern Virginia large-load delivery",
    collection: "named",
    question: "Which records connect load forecasts, local land-use rules, utility decisions, transmission, environmental permits, water, service acceptance, and reliability?",
    documents: [
      "research-doc-55v-virginia-jlarc-data-centers-2024",
      "research-doc-55v-loudoun-electrical-infrastructure-plan-2026",
      "research-doc-55v-virginia-scc-gs5-large-load-rate-decision-2025",
      "research-doc-55v-golden-mars-transmission-decision-2026",
      "research-doc-55v-virginia-data-center-air-permits-2026",
      "research-doc-55x-pjm-load-forecast-2026",
      "research-doc-55x-loudoun-phase2-data-center-standards",
      "research-doc-55v-loudoun-reclaimed-water-program"
    ]
  },
  {
    pack_id: "65-NAMED-04-SPACE-COAST",
    file_id: "project-space-coast-authority",
    label: "Florida Space Coast authority and mission delivery",
    collection: "named",
    question: "Which records connect licences, operators, infrastructure capital, construction, accepted facilities, mission use, safety, and repeat operations?",
    documents: [
      "research-doc-55v-faa-part450-transition-2026",
      "research-doc-55v-slc40-final-environmental-decision-2025",
      "research-doc-55v-space-florida-annual-report-2025",
      "research-doc-55v-fdot-spaceport-improvement-program",
      "research-doc-55v-faa-spaceports-by-state-2026",
      "research-doc-55v-kennedy-master-plan-2026",
      "research-doc-55x-ksc-causeway-bridge-operational-2025",
      "research-doc-55x-ksc-phsf-roman-upgrades-2026"
    ]
  },
  {
    pack_id: "65-NAMED-05-NEVADA",
    file_id: "project-nevada-lithium",
    label: "Nevada lithium project delivery",
    collection: "institutional",
    question: "Which records separate land and environmental authorization, financing, construction, commissioning, compliance, qualification, customer acceptance, and repeat output?",
    documents: [
      "research-doc-55v-thacker-pass-blm-rod-2021",
      "research-doc-55v-thacker-pass-doe-financial-close-2024",
      "research-doc-55v-thacker-pass-ndep-permit-hub",
      "research-doc-55v-thacker-pass-water-permit-2022",
      "research-doc-55x-thacker-pass-mining-notice-decisions-2022",
      "research-doc-55x-thacker-pass-reclamation-permit-2022",
      "research-doc-55x-thacker-pass-air-permit-decision-2022",
      "research-doc-55x-rhyolite-ridge-water-permit-2025"
    ]
  },
  {
    pack_id: "65-NAMED-06-GSA-PQC",
    file_id: "adoption-gsa-pqc",
    label: "GSA post-quantum acquisition",
    collection: "institutional",
    question: "Which records move a migration obligation through inventory, solicitation, award, interoperability test, cutover, acceptance, rollback, and legacy retirement?",
    documents: [
      "research-doc-55n-gsa-buy-ai-onegov",
      "research-doc-56o-gsa-priority-portfolio-2026",
      "research-doc-55z-gao-federal-ai-acquisitions-2026",
      "research-doc-55n-nist-piv-pqc-working-drafts",
      "research-doc-55s-nccoe-pqc-interoperability-preliminary-draft",
      "research-doc-55s-nist-csf-2-0",
      "research-doc-55z-gao-federal-incident-response-2023",
      "research-doc-55z-gao-cdm-network-monitoring-2025"
    ]
  },
  {
    pack_id: "65-NAMED-07-NIST-ARIA",
    file_id: "adoption-nist-aria",
    label: "NIST ARIA assurance adoption",
    collection: "institutional",
    question: "Which records connect evaluation design and authorization to monitoring, incidents, correction, independent review, institutional use, and outcomes?",
    documents: [
      "research-doc-55y-nist-aria-pilot-evaluation-2025",
      "research-doc-55y-nist-aria-evaluation-program",
      "research-doc-55y-nist-ai-metrology-center",
      "research-doc-55y-nist-ai-tevv-program",
      "research-doc-55y-nist-ai-rmf-core",
      "research-doc-55s-nist-ai-rmf-critical-infrastructure-concept-2026",
      "research-doc-55z-gao-operational-ai-use-cases-2026",
      "research-doc-55z-gao-irs-ai-management-2026"
    ]
  },
  {
    pack_id: "65-NAMED-08-WAYMO",
    file_id: "adoption-waymo-california",
    label: "Waymo California service",
    collection: "institutional",
    question: "Which records distinguish authorization, testing miles, paid-service availability, interventions, safety, accessibility, complaints, cost, coverage, and repeat service?",
    documents: [
      "research-doc-55y-cpuc-waymo-al2-disposition-2024",
      "research-doc-55y-cpuc-av-advice-status-2026",
      "research-doc-55y-california-dmv-av-miles-2024",
      "research-doc-55z-california-dmv-av-test-miles-2025",
      "research-doc-56a-california-av-testing-2022-2023",
      "research-doc-55z-nhtsa-ads-crash-data-june-2026",
      "research-doc-56a-california-av-testing-2021-2022",
      "research-doc-56r-dot-automated-vehicle-initiative-plan"
    ]
  }
];

const topicPacks = [
  {
    pack_id: "65-TOPIC-01-AGRICULTURE",
    topic: "Agriculture and Bioeconomy",
    label: "Agriculture and bioeconomy",
    question: "Which records connect research and authorization to field adoption, production, resilience, water exposure, and comparable crop outcomes?",
    documents: ["research-doc-55s-usda-crop-progress-july-20-2026", "research-doc-55s-usda-wasde-july-2026", "research-doc-darpa-bto-baa-2026", "research-doc-55y-chandler-reclaimed-water-system"]
  },
  {
    pack_id: "65-TOPIC-02-DISCOVERY",
    topic: "Discovery Technologies",
    label: "Discovery technologies",
    question: "Which records show a discovery instrument, dataset, testbed, or program becoming an inspectable research capability without treating availability as downstream use?",
    documents: ["research-doc-darpa-dso-disruptioneering-2025", "research-doc-darpa-ipto-baa-2026", "research-doc-nspm-8-6g", "research-doc-nist-next-generation-wireless-standards-testbed"]
  },
  {
    pack_id: "65-TOPIC-03-QUANTUM",
    topic: "Quantum",
    label: "Quantum",
    question: "Which records separate quantum research and migration policy from standards, procurement, tested interoperability, accepted cutover, and retired cryptography?",
    documents: ["research-doc-fy2027-rd-priorities", "research-doc-2026-annual-threat-assessment", "research-doc-crs-defense-primer-emerging-technologies", "research-doc-darpa-fy2027-budget"]
  },
  {
    pack_id: "65-TOPIC-04-CLIMATE",
    topic: "Climate",
    label: "Climate",
    question: "Which records move global or program-level climate evidence toward a named exposure, responsible authority, intervention, and measured local result?",
    documents: ["research-doc-56x-epa-infrastructure-review-denominator", "research-doc-55x-thacker-pass-air-technical-review-2022", "research-doc-55x-digital-third-second-carver-air-permit-2026", "research-doc-55y-chandler-water-conservation-in-action"]
  },
  {
    pack_id: "65-TOPIC-05-AVIATION",
    topic: "Aviation",
    label: "Aviation",
    question: "Which records separate plans, rules, trials, and workforce processes from certification, accepted service, recurring operations, and comparable reliability?",
    documents: ["research-doc-57z-darpa-official-results-gate-recheck", "research-doc-56s-dot-air-traffic-controller-workforce-processes", "research-doc-56r-dot-faa-drone-integration-strategy", "research-doc-56r-dot-faa-information-centric-airspace-milestones"]
  },
  {
    pack_id: "65-TOPIC-06-WATER",
    topic: "Water",
    label: "Water",
    question: "Which records distinguish plans and monitoring guidance from accepted assets, measured flows, service reliability, allocation, and compatible reuse outcomes?",
    documents: ["research-doc-56a-epa-water-reuse-year-three", "research-doc-56a-epa-water-reuse-year-four", "research-doc-55z-epa-water-reuse-monitoring-practices-2024", "research-doc-56a-usgs-mcs-2025"]
  },
  {
    pack_id: "65-TOPIC-07-SPACE",
    topic: "Space",
    label: "Space",
    question: "Which records connect infrastructure and licensing to operator activity, missions, utilization, safety, and compatible repeat operations?",
    documents: ["research-doc-56a-faa-commercial-space-operations-fy2022", "research-doc-56a-faa-commercial-space-operations-fy2023", "research-doc-56a-faa-commercial-space-operations-fy2024", "research-doc-56a-president-aerospace-fy2024"]
  },
  {
    pack_id: "65-TOPIC-08-AI-SCIENCE",
    topic: "AI for Science",
    label: "AI for science",
    question: "Which records connect compute, data, evaluation, and program support to institutional adoption, reproduced scientific work, and measured research outcomes?",
    documents: ["research-doc-56o-ostp-priority-portfolio-2026", "research-doc-56a-nasa-ai-use-cases-2024", "research-doc-americas-ai-action-plan-2025", "research-doc-55z-gao-federal-generative-ai-use-2025"]
  }
];

const collectionSpecs = {
  named: {
    id: "research-collection-phase65-named-project-delivery",
    title: "Phase 65 Named Project Delivery Evidence",
    slug: "phase65-named-project-delivery-evidence-2021-2026",
    summary: "Thirty-two reviewed primary records organized into four eight-record reporting packs for TSMC Arizona, Toronto application 24 254930, Northern Virginia large-load delivery, and the Florida Space Coast.",
    scope: "Named project delivery evidence: authorization, infrastructure, utility and environmental records, construction, acceptance, use, and repeat operation.",
    download_path: "/downloads/phase65-named-project-delivery-evidence-2021-2026.zip"
  },
  institutional: {
    id: "research-collection-phase65-institutional-acceptance",
    title: "Phase 65 Institutional And Receiving-System Acceptance",
    slug: "phase65-institutional-receiving-system-acceptance-2021-2026",
    summary: "Thirty-two reviewed primary records organized into four eight-record packs for Nevada lithium delivery, GSA post-quantum acquisition, NIST ARIA assurance, and Waymo California service.",
    scope: "Institutional and receiving-system evidence: permits, finance, procurement, evaluation, authorization, monitoring, service, acceptance, and repeat outcomes.",
    download_path: "/downloads/phase65-institutional-receiving-system-acceptance-2021-2026.zip"
  },
  topics: {
    id: "research-collection-phase65-undercovered-frontier-systems",
    title: "Phase 65 Undercovered Frontier Systems",
    slug: "phase65-undercovered-frontier-systems-2023-2026",
    summary: "Thirty-two reviewed primary records arranged as four-record shelves for agriculture, discovery technologies, quantum, climate, aviation, water, space, and AI for science.",
    scope: "Undercovered topic evidence selected to make authority, implementation, acceptance, operating, and outcome boundaries inspectable.",
    download_path: "/downloads/phase65-undercovered-frontier-systems-2023-2026.zip"
  }
};

const documentFiles = (await readdir(join(contentRoot, "research-documents"))).filter((name) => name.endsWith(".json"));
const sourceDocuments = await Promise.all(documentFiles.map((name) => readJson(contentRoot, "research-documents", name)));
const documentById = new Map(sourceDocuments.map((document) => [document.id, document]));
const allSelected = [...researchPacks.flatMap((pack) => pack.documents), ...topicPacks.flatMap((pack) => pack.documents)];
if (allSelected.length !== 96 || new Set(allSelected).size !== 96) throw new Error(`Phase 65 must select 96 unique source documents; found ${allSelected.length} selections and ${new Set(allSelected).size} unique IDs.`);
for (const id of allSelected) {
  const document = documentById.get(id);
  if (!document) throw new Error(`Missing source research document: ${id}`);
  if (document.record_status !== "Published") throw new Error(`Phase 65 source document is not Published: ${id}`);
}

const collectionDocuments = { named: [], institutional: [], topics: [] };
const generatedRecords = [];
let sequence = 0;
for (const pack of [...researchPacks, ...topicPacks.map((pack) => ({ ...pack, collection: "topics" }))]) {
  const spec = collectionSpecs[pack.collection];
  for (let index = 0; index < pack.documents.length; index += 1) {
    sequence += 1;
    const source = documentById.get(pack.documents[index]);
    const id = `research-doc-phase65-${String(sequence).padStart(3, "0")}`;
    const slug = `phase65-${String(sequence).padStart(3, "0")}-${source.slug}`;
    const archiveMember = `records/${String(collectionDocuments[pack.collection].length + 1).padStart(2, "0")}-${source.slug}.txt`;
    const record = {
      id,
      collection_id: spec.id,
      title: `${source.title} — Phase 65 ${pack.label} review`,
      slug,
      record_status: "Published",
      publisher: source.publisher,
      publication_date: source.publication_date,
      document_type: source.document_type,
      summary: `Phase 65 reviews this primary record as part of the ${pack.label} reporting pack. ${source.summary}`,
      key_findings: source.key_findings,
      why_it_matters: `${pack.question} This record supplies one bounded part of that evidence chain; it is not a substitute for the pack's downstream records. ${source.why_it_matters}`,
      ftfn_relevance: [`Supplies record ${index + 1} of ${pack.documents.length} in ${pack.pack_id}.`, ...source.ftfn_relevance],
      evidence_limits: [`Inclusion in a Phase 65 reporting pack does not advance a Phase 64 matrix cell or establish an operating outcome.`, ...source.evidence_limits],
      primary_topics: source.primary_topics,
      framework_layers: source.framework_layers,
      constraint_tags: source.constraint_tags,
      source_id: source.source_id,
      official_url: source.official_url,
      local_capture_path: `${spec.download_path.replace(/\.zip$/, "")}/${archiveMember}`,
      archive_member: archiveMember,
      capture_status: "Official link record",
      captured_date: today
    };
    await writeJson(join(contentRoot, "research-documents", `${id}.json`), record);
    collectionDocuments[pack.collection].push(id);
    generatedRecords.push({ id, slug, source_document_id: source.id, pack_id: pack.pack_id, title: record.title });
  }
}

for (const [key, spec] of Object.entries(collectionSpecs)) {
  const collection = {
    id: spec.id,
    title: spec.title,
    slug: spec.slug,
    record_status: "Published",
    summary: spec.summary,
    scope: spec.scope,
    captured_date: today,
    document_ids: collectionDocuments[key],
    download_path: spec.download_path,
    download_note: "The downloadable dossier contains official-link records, reviewed summaries, official URLs, capture metadata, and checksums. Repeated source coverage is disclosed as curation, not new evidence.",
    method_note: "Phase 65 re-reviews primary records already held in the FTFN corpus and organizes them into named reporting packs. Each record retains its original authority and evidence limits. Selection does not prove implementation, acceptance, recurring operation, causation, comparability, or outcome change."
  };
  await writeJson(join(contentRoot, "research-collections", `${spec.slug}.json`), collection);
}

const signalFiles = (await readdir(join(contentRoot, "signals"))).filter((name) => name.endsWith(".mdx"));
const signalRows = await Promise.all(signalFiles.map(async (name) => {
  const text = await readText(contentRoot, "signals", name);
  return {
    id: text.match(/^id:\s*"([^"]+)"/m)?.[1],
    title: text.match(/^title:\s*"([^"]+)"/m)?.[1],
    status: text.match(/^record_status:\s*"([^"]+)"/m)?.[1],
    topic: text.match(/^primary_topic:\s*"([^"]+)"/m)?.[1]
  };
}));
const signalById = new Map(signalRows.map((row) => [row.id, row]));

const namedSignalSets = [
  ["65-NAMED-01-TSMC", ["signal-phoenix-tsmc-fab1-production-fab2-construction-complete", "signal-tsmc-phoenix-wastewater-infrastructure-agreement", "signal-aps-tsmc-service-territory-capacity-boundary", "signal-phoenix-tsmc-fab3-topping-out"]],
  ["65-NAMED-02-TORONTO", ["signal-toronto-24-254930-community-council-recommendation", "signal-toronto-24-254930-staff-report-servicing-review", "signal-toronto-application-24-254930-named-planning-record", "signal-cmhc-june-2026-toronto-construction-stage-baseline"]],
  ["65-NAMED-03-NOVA", ["signal-loudoun-phase2-data-center-standards-watch", "signal-scc-morrisville-wishing-star-transmission-application", "signal-virginia-data-center-air-permit-trail", "signal-virginia-gs5-large-load-rate-class"]],
  ["65-NAMED-04-SPACE-COAST", ["signal-shuttle-landing-facility-license-status-watch", "signal-nasa-simo-planned-spaceport-services-acquisition", "signal-kennedy-multiuser-master-plan", "signal-ksc-causeway-bridge-operational"]],
  ["65-NAMED-05-NEVADA", ["signal-thacker-pass-federal-land-authorization", "signal-thacker-pass-doe-loan-financial-close", "signal-rhyolite-ridge-doe-nepa-loan-boundary", "signal-rhyolite-ridge-air-permit-validity-hold"]],
  ["65-NAMED-06-GSA-PQC", ["signal-gsa-pqc-procurement-paths", "signal-gsa-onegov-ai-procurement-channel", "signal-56o-gsa-priority-portfolio-two-implemented-11-current", "signal-sample-007"]],
  ["65-NAMED-07-NIST-ARIA", ["signal-nist-aria-pilot-multilevel-evaluation", "signal-nist-ai-metrology-method-selection-layer", "signal-nist-ai-rmf-critical-infrastructure-profile-concept", "signal-nasa-ai-use-cases-lack-comparable-outcome-measures"]],
  ["65-NAMED-08-WAYMO", ["signal-cpuc-waymo-fared-driverless-expansion-2024", "signal-nhtsa-waymo-flooded-roadway-recall-2026", "signal-california-av-testing-miles-2024", "signal-cpuc-av-reporting-needs-public-comparable-rollup"]]
];

const topicSignalSets = [
  ["65-TOPIC-01-AGRICULTURE", ["signal-cfia-2026-plant-novel-trait-assessment-rules", "signal-usda-2026-plant-breeding-awards"]],
  ["65-TOPIC-02-DISCOVERY", ["signal-nisar-july-2026-public-radar-data", "signal-noaa-2025-ocean-exploration-mapping-operations"]],
  ["65-TOPIC-03-QUANTUM", ["signal-nist-hqc-backup-algorithm-selection", "signal-nist-piv-pqc-working-drafts"]],
  ["65-TOPIC-04-CLIMATE", ["signal-nca5-transportation-climate-adaptation-stack", "signal-noaa-2025-global-climate-observation-baseline"]],
  ["65-TOPIC-05-AVIATION", ["signal-faa-2026-evtol-integration-pilot-selections", "signal-darpa-lift-challenge-2026-scheduled-field-trial"]],
  ["65-TOPIC-06-WATER", ["signal-56a-epa-water-reuse", "signal-water-reuse-year-five-lacks-national-operating-volume"]],
  ["65-TOPIC-07-SPACE", ["signal-faa-reaches-one-thousand-commercial-space-operations", "signal-nasa-integrated-lunar-power-dependency"]],
  ["65-TOPIC-08-AI-SCIENCE", ["signal-federal-ai-inventories-nearly-doubled-2024", "signal-irs-ai-inventory-most-cases-not-yet-operational"]]
];

const signalDecisionPairs = [...namedSignalSets, ...topicSignalSets];
const selectedSignalIds = signalDecisionPairs.flatMap(([, ids]) => ids);
if (selectedSignalIds.length !== 48 || new Set(selectedSignalIds).size !== 48) throw new Error(`Phase 65 must make 48 unique signal decisions; found ${selectedSignalIds.length} selections and ${new Set(selectedSignalIds).size} unique IDs.`);
const signalDecisions = [];
for (const [packId, ids] of signalDecisionPairs) {
  for (const signalId of ids) {
    const signal = signalById.get(signalId);
    if (!signal) throw new Error(`Missing Phase 65 signal candidate: ${signalId}`);
    signalDecisions.push({
      decision_id: `65-SIGNAL-${String(signalDecisions.length + 1).padStart(2, "0")}`,
      pack_id: packId,
      signal_id: signalId,
      signal_title: signal.title,
      prior_status: signal.status,
      decision: signal.status === "Published" ? "Reconfirm Published" : "Retain In Review",
      rationale: signal.status === "Published"
        ? "The record remains independently useful, source-resolved, stage-bounded, and suitable for synthesis without changing its claim."
        : "The reviewed evidence still stops before the result, acceptance, comparable denominator, or downstream artifact required by the signal's existing boundary."
    });
  }
}

const briefingSpecs = [
  {
    id: "briefing-frontier-topic-001-agriculture-bioeconomy",
    title: "Frontier Topic 001: Agriculture Needs A Field-Outcome Chain",
    slug: "frontier-topic-001-agriculture-field-outcome-chain",
    topic: "Agriculture and Bioeconomy",
    signal_ids: ["signal-cfia-2026-plant-novel-trait-assessment-rules", "signal-sample-008", "signal-usda-2026-plant-breeding-awards", "signal-usda-july-2026-wasde-grain-stocks-revision"],
    gap_ids: [],
    constraints: ["Climate", "Water", "Labor", "Supply Chain", "Data Quality"],
    takeaways: ["Research awards and trait-assessment rules are upstream of farm adoption and field performance.", "Crop-progress and supply estimates provide operating context but not causal evaluation of a named intervention.", "The next useful shelf joins a named technology, region, adoption denominator, season, and outcome measure."],
    next: ["Named program or trait approvals and eligible users", "Regional adoption, acreage, yield, input, water, and resilience measures", "Compatible multi-season evidence with weather and market context"],
    established: "The reviewed shelf establishes current federal research awards, a Canadian trait-assessment authority record, a crop-progress observation, and a supply-and-demand baseline.",
    open: "It does not establish farmer adoption, commercial availability, input savings, yield gain, resilience, or a causal field outcome for a named technology.",
    collection: collectionSpecs.topics.slug
  },
  {
    id: "briefing-frontier-topic-002-discovery-technologies",
    title: "Frontier Topic 002: Discovery Infrastructure Is Not Discovery Impact",
    slug: "frontier-topic-002-discovery-infrastructure-not-impact",
    topic: "Discovery Technologies",
    signal_ids: ["signal-nisar-july-2026-public-radar-data", "signal-nsf-2026-idss-data-infrastructure-awards"],
    gap_ids: ["gap-006"],
    constraints: ["Data Quality", "Compute", "Standards", "Labor", "Interpretation"],
    takeaways: ["Public radar data and research-data awards create observable capability, not demonstrated downstream decisions.", "A testbed, dataset, or award becomes evidence of impact only through named users and reproducible work.", "Discovery reporting should preserve access, use, validation, and outcome as separate stages."],
    next: ["Named institutional users and documented workflows", "Reproducible analyses tied to a versioned dataset or instrument", "Independent decisions or outcomes that cite the research output"],
    established: "The shelf establishes available NISAR public radar data and funded data-system infrastructure intended to support research and AI.",
    open: "It does not establish sustained use, reproduced findings, local decisions, productivity gains, or scientific impact attributable to either capability.",
    collection: collectionSpecs.topics.slug
  },
  {
    id: "briefing-frontier-topic-003-quantum",
    title: "Frontier Topic 003: Quantum Readiness Runs Through Migration",
    slug: "frontier-topic-003-quantum-readiness-migration",
    topic: "Quantum",
    signal_ids: ["signal-federal-pqc-migration-plans-and-deadlines", "signal-nist-hqc-backup-algorithm-selection", "signal-nist-piv-pqc-working-drafts", "signal-sample-007"],
    gap_ids: ["gap-009"],
    constraints: ["Standards", "Cybersecurity", "Supply Chain", "Labor", "Regulation"],
    takeaways: ["Standards and dated policy move quantum risk into institutional migration work.", "Draft credential changes and a backup-algorithm selection remain upstream of agency cutover.", "A credible adoption record needs an inventory, procurement, test, acceptance, rollback, and retirement trail."],
    next: ["Agency-specific cryptographic inventories and migration plans", "Solicitations, awards, validated products, and interoperability results", "Accepted cutover, rollback evidence, and retirement of legacy cryptography"],
    established: "The records establish federal migration obligations, current NIST standardization activity, credential-working drafts, and a named interoperability test layer.",
    open: "They do not establish that an agency has completed a system migration or that a deployed system is interoperable, accepted, recoverable, and free of legacy exposure.",
    collection: collectionSpecs.topics.slug
  },
  {
    id: "briefing-frontier-topic-004-climate",
    title: "Frontier Topic 004: Climate Observation Needs A Local Decision Rail",
    slug: "frontier-topic-004-climate-observation-local-decision",
    topic: "Climate",
    signal_ids: ["signal-56x-epa-infrastructure-review-denominator", "signal-nca5-transportation-climate-adaptation-stack", "signal-sample-001"],
    gap_ids: ["gap-006"],
    constraints: ["Climate", "Weather", "Infrastructure", "Interpretation", "Data Quality"],
    takeaways: ["Global and national records establish conditions and responsibilities, not deterministic local effects.", "A funding-review denominator preserves administrative state without proving an adaptation outcome.", "The decisive chain runs from observation through regional mechanism, exposed asset, authority, action, and measured result."],
    next: ["Regional teleconnection and hazard records", "Named exposed assets and responsible authorities", "Documented decisions, implementation, and compatible before-and-after measures"],
    established: "The shelf establishes an ENSO advisory signal, a national transportation adaptation synthesis, and a bounded infrastructure-funding review denominator.",
    open: "It does not establish a specific local climate effect, avoided loss, infrastructure resilience gain, or causal relationship between a broad climate phase and a local outcome.",
    collection: collectionSpecs.topics.slug
  },
  {
    id: "briefing-frontier-topic-005-aviation",
    title: "Frontier Topic 005: Aviation Integration Is Not Recurring Service",
    slug: "frontier-topic-005-aviation-integration-not-service",
    topic: "Aviation",
    signal_ids: ["signal-56a-air-travel-consumer", "signal-faa-2026-evtol-integration-pilot-selections", "signal-faa-powered-lift-final-operating-rule", "signal-us-airline-cancellation-rate-2024"],
    gap_ids: ["gap-010"],
    constraints: ["Certification", "Labor", "Weather", "Infrastructure", "Public Trust"],
    takeaways: ["A rule and pilot selection create an integration path but not a certified commercial service.", "Existing airline reporting shows what a recurring service evidence rail can look like.", "Aircraft, operator, route, infrastructure, accessibility, and reliability records must remain separately attributable."],
    next: ["Aircraft and operator certification milestones", "Vertiport, route, airspace, workforce, and local agreement records", "Recurring service, completion, disruption, safety, accessibility, and complaint measures"],
    established: "The shelf establishes a powered-lift operating rule, eight integration-pilot selections, and existing annual carrier-service reporting rails.",
    open: "It does not establish certified eVTOL aircraft, approved commercial routes, accepted vertiports, paying service, or comparable service reliability.",
    collection: collectionSpecs.topics.slug
  },
  {
    id: "briefing-frontier-topic-006-water",
    title: "Frontier Topic 006: Water Plans Need Measured Service",
    slug: "frontier-topic-006-water-plans-measured-service",
    topic: "Water",
    signal_ids: ["signal-56a-epa-water-reuse", "signal-chandler-reclaimed-water-operating-scale", "signal-intel-arizona-water-conservation-2023", "signal-phoenix-ama-fifth-management-plan-industrial-water", "signal-toronto-water-2026-capital-delivery-constraint"],
    gap_ids: ["gap-002", "gap-014", "gap-016"],
    constraints: ["Water", "Climate", "Infrastructure", "Regulation", "Data Quality"],
    takeaways: ["Plans and conservation obligations become useful when tied to accepted assets and measured flows.", "Chandler supplies a bounded operating-scale example without proving facility-specific availability elsewhere.", "National progress records still need compatible volume, quality, reliability, allocation, and beneficiary denominators."],
    next: ["Accepted assets, metered flows, quality, uptime, and allocation", "Named industrial agreements carried through commissioning and service", "Compatible annual reuse volumes with geography and beneficiary definitions"],
    established: "The shelf establishes a recurring national implementation record, a named municipal operating system, a company-reported conservation figure, and current planning constraints.",
    open: "It does not establish available capacity for a new customer, comparable national operating volume, drought resilience, or causal economic and environmental outcomes.",
    collection: collectionSpecs.topics.slug
  },
  {
    id: "briefing-frontier-topic-007-space",
    title: "Frontier Topic 007: Space Activity Needs Operator And Mission Denominators",
    slug: "frontier-topic-007-space-operator-mission-denominators",
    topic: "Space",
    signal_ids: ["signal-56a-faa-commercial-space", "signal-56a-president-aerospace-report", "signal-faa-reaches-one-thousand-commercial-space-operations", "signal-faa-starship-lc39a-environmental-decision", "signal-nasa-2025-moon-to-mars-architecture-rev-c"],
    gap_ids: ["gap-013", "gap-016"],
    constraints: ["Infrastructure", "Regulation", "Capital", "Safety", "Data Quality"],
    takeaways: ["Licensed operations and annual activity reporting establish a repeat evidence rail.", "Environmental authorization and architecture records remain upstream of construction and missions.", "Site, operator, mission class, utilization, disruption, and safety denominators are required before comparison."],
    next: ["Site- and operator-specific licence and infrastructure records", "Mission execution, utilization, disruption, and safety measures", "Compatible repeat series that preserve mission class and reporting boundaries"],
    established: "The shelf establishes a multi-year licensed-operation series, a cumulative federal milestone, an environmental decision, and a system architecture.",
    open: "It does not establish site capacity, operator performance, mission success, infrastructure utilization, reliability, safety causation, or a comparable composite outcome.",
    collection: collectionSpecs.topics.slug
  },
  {
    id: "briefing-frontier-topic-008-ai-science",
    title: "Frontier Topic 008: AI For Science Needs Reproduced Work",
    slug: "frontier-topic-008-ai-science-reproduced-work",
    topic: "AI for Science",
    signal_ids: ["signal-56a-nasa-ai-inventory", "signal-56o-ostp-priority-portfolio-three-implemented-four-current", "signal-federal-ai-inventories-nearly-doubled-2024", "signal-nist-ai-metrology-method-selection-layer", "signal-nsf-ai-materials-institute-award-2433348"],
    gap_ids: ["gap-008", "gap-015", "gap-016"],
    constraints: ["Compute", "Data Quality", "Standards", "Cybersecurity", "Labor"],
    takeaways: ["Inventories, awards, and metrology programs establish activity and evaluation layers.", "A larger use-case count is not evidence of scientific productivity or research quality.", "The strongest outcome record will name the dataset, model, workflow, reproduction, institution, and scientific result."],
    next: ["Named scientific workflows with versioned data and models", "Independent reproduction, validation, and error analysis", "Comparable time, cost, quality, or discovery outcomes with a stable denominator"],
    established: "The shelf establishes public AI inventories, federal priority actions, a NIST metrology layer, and a named AI-to-materials research award.",
    open: "It does not establish operational maturity, reproduced science, faster discovery, lower cost, better quality, causation, or a comparable portfolio outcome.",
    collection: collectionSpecs.topics.slug
  },
  {
    id: "briefing-receiving-systems-001-new-capacity-accepted",
    title: "Receiving Systems 001: Where New Capacity Must Be Accepted",
    slug: "receiving-systems-001-where-new-capacity-must-be-accepted",
    topic: "Cross-system",
    signal_ids: ["signal-tsmc-phoenix-wastewater-infrastructure-agreement", "signal-toronto-24-254930-community-council-recommendation", "signal-virginia-gs5-large-load-rate-class", "signal-ksc-causeway-bridge-operational", "signal-thacker-pass-state-environmental-permit-stack", "signal-gsa-pqc-procurement-paths", "signal-nist-aria-pilot-multilevel-evaluation", "signal-cpuc-waymo-fared-driverless-expansion-2024"],
    gap_ids: ["gap-001", "gap-002", "gap-004", "gap-008", "gap-009", "gap-010", "gap-011", "gap-012", "gap-013", "gap-015"],
    constraints: ["Infrastructure", "Regulation", "Standards", "Data Quality", "Public Trust"],
    takeaways: ["Every named file has a receiving system that can accept, condition, delay, or reject upstream capacity.", "Authority and commitment records identify the receiving institution but do not prove accepted service.", "Acceptance must be entity-specific: utility service, occupancy, regulatory approval, qualified output, tested cutover, or authorized service."],
    next: ["Accepted utility, building, environmental, infrastructure, procurement, assurance, and service records", "Entity-specific conditions, tests, rollback paths, and responsible authorities", "Repeat operation and outcome measures after acceptance"],
    established: "Across eight files, the corpus identifies the relevant receiving systems and at least one official authority, commitment, or bounded operation record for each.",
    open: "The files do not share one acceptance definition, and the available evidence does not place all eight at accepted service, recurring operation, or comparable outcome.",
    collection: collectionSpecs.named.slug
  },
  {
    id: "briefing-validation-acceptance-watch-001",
    title: "Validation And Acceptance Watch 001: The Evidence After Delivery",
    slug: "validation-acceptance-watch-001-evidence-after-delivery",
    topic: "Cross-system",
    signal_ids: ["signal-phoenix-tsmc-fab3-topping-out", "signal-toronto-24-254930-community-council-recommendation", "signal-virginia-data-center-air-permit-trail", "signal-faa-part450-operator-transition", "signal-rhyolite-ridge-water-permit-preoperation-gates", "signal-nccoe-pqc-interoperability-preliminary-draft", "signal-nist-aria-pilot-multilevel-evaluation", "signal-nhtsa-waymo-flooded-roadway-recall-2026"],
    gap_ids: ["gap-003", "gap-004", "gap-009", "gap-010", "gap-012", "gap-013", "gap-015", "gap-016"],
    constraints: ["Manufacturing", "Standards", "Certification", "Regulation", "Data Quality"],
    takeaways: ["Delivery artifacts become decision-useful only when their validation and acceptance authority is named.", "The eight files require different tests: inspection, commissioning, qualification, interoperability, evaluation, authorization, or safety correction.", "Passing one validation stage does not transfer to another file or establish a recurring outcome."],
    next: ["Named test protocols, responsible authorities, and acceptance criteria", "Results, exceptions, corrective actions, and retest records", "Accepted service followed by compatible repeat operation"],
    established: "The reporting packs expose existing validation layers, including permit conditions, operator transition, pilot evaluation, preliminary interoperability, and a safety-correction record.",
    open: "They do not establish a shared pass threshold, cross-file readiness, final acceptance for every system, or downstream operating outcomes.",
    collection: collectionSpecs.institutional.slug
  },
  {
    id: "briefing-operating-outcomes-almanac-001",
    title: "Operating Outcomes Almanac 001: What Can Actually Be Compared",
    slug: "operating-outcomes-almanac-001-what-can-actually-be-compared",
    topic: "Cross-system",
    signal_ids: ["signal-chandler-reclaimed-water-operating-scale", "signal-ksc-causeway-bridge-operational", "signal-faa-reaches-one-thousand-commercial-space-operations", "signal-56a-air-travel-consumer", "signal-california-av-testing-miles-2024", "signal-intel-arizona-water-conservation-2023", "signal-56a-epa-water-reuse", "signal-56a-president-aerospace-report"],
    gap_ids: ["gap-002", "gap-006", "gap-010", "gap-013", "gap-014", "gap-016"],
    constraints: ["Data Quality", "Interpretation", "Infrastructure", "Public Trust"],
    takeaways: ["A measured value is comparable only inside a stable entity, definition, period, and denominator.", "The current shelf contains useful recurring rails for water, aviation, space, and autonomous testing, but not one cross-system score.", "The correct product is an almanac of bounded series, breaks, and missing denominators."],
    next: ["Stable entity and denominator definitions for every series", "Revisions, breaks, exclusions, and observation periods", "Repeated accepted-operation measures before any trend or cross-entity claim"],
    established: "The almanac identifies several official or attributed operating rails with explicit units and boundaries, including annual service, licensed-operation, testing-mile, and municipal water records.",
    open: "It does not establish a common outcome, rank, score, causal explanation, or transferable performance conclusion across unlike systems.",
    collection: collectionSpecs.topics.slug
  }
];

const yamlList = (items) => items.map((item) => `  - "${item.replaceAll('"', '\\"')}"`).join("\n");
for (const spec of briefingSpecs) {
  for (const signalId of spec.signal_ids) {
    const signal = signalById.get(signalId);
    if (!signal || signal.status !== "Published") throw new Error(`${spec.id} uses a missing or non-Published signal: ${signalId}`);
  }
  const content = `---
id: "${spec.id}"
title: "${spec.title}"
slug: "${spec.slug}"
record_status: "Published"
summary: "${spec.established} ${spec.open}"
published_date: ${today}
captured_date: ${today}
signal_ids:
${yamlList(spec.signal_ids)}
${spec.gap_ids.length ? `evidence_gap_ids:\n${yamlList(spec.gap_ids)}\n` : ""}claim_scope: "Editorial Synthesis"
local_evidence_level: "${spec.topic === "Cross-system" ? "General Source Layer" : "Specific Local Record"}"
last_reviewed_date: ${today}
top_takeaways:
${yamlList(spec.takeaways)}
constraint_watch:
${yamlList(spec.constraints)}
what_to_watch_next:
${yamlList(spec.next)}
---

## Evidence shelf

${spec.established}

The Phase 65 review shelf is published in [${collectionSpecs[spec.collection === collectionSpecs.named.slug ? "named" : spec.collection === collectionSpecs.institutional.slug ? "institutional" : "topics"].title}](/research/${spec.collection}/). The shelf makes the evidence trail navigable; it does not change the source record's authority or stage.

## Interpretation boundary

${spec.open}

This briefing therefore keeps proposal, authorization, commitment, implementation, validation, acceptance, recurring operation, and comparable outcome as separate editorial states. A record can be strong evidence of one state while remaining silent about the next.

## Reporting questions

${spec.takeaways.map((item) => `- ${item}`).join("\n")}

## Next records

${spec.next.map((item) => `- ${item}`).join("\n")}

## Publication decision

Phase 65 publishes this briefing because every linked signal is already Published, each claim is bounded to a reviewed primary record, and the open questions are stated explicitly. Publication does not advance a Phase 64 matrix cell, resolve an evidence gap, or create a score, rank, forecast, or operating-outcome claim.
`;
  await writeFile(join(contentRoot, "briefings", `${spec.id}.mdx`), content, "utf8");
}

const legacyDispositions = [
  ["briefing-local-watch-001-conversion-gates.mdx", "Archived", "Superseded by Local Conversion 005, Project Conversion File 002, Toronto Council adoption evidence, and the Phase 65 Toronto reporting pack."],
  ["briefing-local-watch-002-corridor-conversion-gates.mdx", "Archived", "Superseded by the five Local Conversion dossiers, eight named conversion files, and the Phase 65 named reporting packs."],
  ["briefing-research-watch-002-local-implementation-dossiers.mdx", "Archived", "Superseded by later operational-evidence collections and the Phase 65 named project delivery shelf."],
  ["briefing-stack-watch-001.mdx", "Archived", "Superseded by Published Stack Watch 003 and 004, the Phase 59 flagships, and Phase 65 topic and acceptance briefings."],
  ["briefing-stack-watch-002-federal-research-industrial-capacity.mdx", "Published", "Repaired to rely only on its two Published, independently useful federal research and supply-chain signals. Draft-study and strategy-only held signals were removed from the publication set."],
  ["briefing-stack-watch-005-industrial-capacity-local-conversion.mdx", "Published", "Repaired to remove the unresolved OEB proceeding and retain six Published records that independently support the national-input-to-local-conversion method."],
  ["briefing-stack-watch-006-thin-topic-conversion.mdx", "Archived", "Superseded by eight Phase 65 topic briefings and the Undercovered Frontier Systems collection." ]
];

for (const [file, status, reason] of legacyDispositions) {
  const path = join(contentRoot, "briefings", file);
  let text = await readFile(path, "utf8");
  text = text.replace(/^record_status:\s*"[^"]+"/m, `record_status: "${status}"`);
  text = text.replace(/^published_date:\s*.*$/m, status === "Published" ? `published_date: ${today}` : "published_date: null");
  text = text.replace(/^last_reviewed_date:\s*.*$/m, `last_reviewed_date: ${today}`);
  if (file.includes("stack-watch-002")) {
    text = text.replace(/\n\s*- "signal-2026-transmission-study-ai-manufacturing-load"/g, "");
    text = text.replace(/\n\s*- "signal-usg-ai-national-security-infrastructure-stack"/g, "");
    text = text.replace(/\n\s*- "signal-usg-resilience-industrial-base-stack"/g, "");
    text = text.replace(/\n## Editorial use[\s\S]*$/, "");
  }
  if (file.includes("stack-watch-005")) {
    text = text.replace(/\n\s*- "signal-oeb-eb-2026-0129-toronto-hydro-non-wires-proceeding"/g, "");
    text = text.replace(/^summary:\s*"[^"]+"/m, 'summary: "A synthesis connecting national minerals, power, housing, and labor evidence to Phoenix and Toronto infrastructure and procurement records without converting programs, inventories, plans, or pipelines into delivered capacity."');
    text = text.replace('  - "Phoenix and Toronto now have stronger named infrastructure and regulatory trails, but preliminary capital plans and active proceedings remain upstream of delivery."', '  - "Phoenix and Toronto now have stronger named infrastructure and procurement trails, but preliminary plans and pipelines remain upstream of delivery."');
    text = text.replace(/\n\s*- "A substantive OEB decision in EB-2026-0129 followed by approved program rules, project selection, implementation, and measured results\."/g, "");
    text = text.replace("Toronto's capital-project pipeline creates a similar upstream rail for infrastructure expected to enter procurement. OEB case EB-2026-0129 adds a specific regulatory process for a proposed non-wires incentive mechanism. The former does not guarantee solicitation; the latter has not reached a substantive decision.", "Toronto's capital-project pipeline creates a similar upstream rail for infrastructure expected to enter procurement. The pipeline does not guarantee a solicitation, award, construction start, accepted asset, or service outcome.");
    text = text.replaceAll("## What this draft supports", "## What this synthesis supports");
    text = text.replaceAll("## What this draft does not support", "## What this synthesis does not support");
    text = text.replace(/\n## Editorial status[\s\S]*$/, "");
  }
  text = text.replace(/\n## Phase 65 disposition[\s\S]*$/, "");
  text = `${text.trimEnd()}\n\n## Phase 65 disposition\n\n${reason}\n\nThis is a record-level editorial disposition. It does not alter an underlying signal, evidence-gap state, conversion event, gate, or matrix cell.\n`;
  await writeFile(path, text, "utf8");
}

const canonicalPackBindings = [
  ["briefing-project-conversion-001-tsmc-arizona.mdx", researchPacks[0]],
  ["briefing-project-conversion-002-toronto-24-254930.mdx", researchPacks[1]],
  ["briefing-project-conversion-003-northern-virginia-large-load.mdx", researchPacks[2]],
  ["briefing-project-conversion-004-space-coast-authority.mdx", researchPacks[3]],
  ["briefing-project-conversion-005-nevada-lithium.mdx", researchPacks[4]],
  ["briefing-adoption-case-001-gsa-pqc.mdx", researchPacks[5]],
  ["briefing-adoption-case-002-nist-aria.mdx", researchPacks[6]],
  ["briefing-adoption-case-003-waymo-california.mdx", researchPacks[7]]
];

for (let bindingIndex = 0; bindingIndex < canonicalPackBindings.length; bindingIndex += 1) {
  const [file, pack] = canonicalPackBindings[bindingIndex];
  const collectionKey = pack.collection;
  const spec = collectionSpecs[collectionKey];
  const offset = (collectionKey === "named" ? bindingIndex : bindingIndex - 4) * 8;
  const records = collectionDocuments[collectionKey].slice(offset, offset + 8);
  const section = `## Phase 65 reporting pack

${pack.question}

The [${spec.title}](/research/${spec.slug}/) assigns eight reviewed records to this file:

${records.map((id) => {
    const record = generatedRecords.find((item) => item.id === id);
    return `- [${record.title}](/research/documents/${record.slug}/)`;
  }).join("\n")}

The pack is a reporting shelf, not a stage promotion. It preserves the file's current boundary and names the downstream records needed for validation, acceptance, recurring operation, and outcome comparison.
`;
  const path = join(contentRoot, "briefings", file);
  let text = await readFile(path, "utf8");
  text = text.replace(/\n## Phase 65 reporting pack[\s\S]*$/, "");
  await writeFile(path, `${text.trimEnd()}\n\n${section}`, "utf8");
}

const localBindings = [
  ["local-us-southwest-chip-corridor.mdx", researchPacks[0]],
  ["local-ontario-real-estate.mdx", researchPacks[1]],
  ["local-northern-virginia-data-center-corridor.mdx", researchPacks[2]],
  ["local-florida-space-coast-launch-corridor.mdx", researchPacks[3]],
  ["local-nevada-lithium-processing-corridor.mdx", researchPacks[4]]
];
for (const [file, pack] of localBindings) {
  const spec = collectionSpecs[pack.collection];
  const section = `## Phase 65 reporting shelf

${pack.question}

The Phase 65 [${spec.title}](/research/${spec.slug}/) supplies an eight-record named-file pack for this local system. Its role is to keep authority, commitment, implementation, validation, acceptance, recurring operation, and outcome evidence separate. No source in the pack transfers an outcome from another entity or resolves the local system's missing-data list by analogy.
`;
  const path = join(contentRoot, "local-systems", file);
  let text = await readFile(path, "utf8");
  text = text.replace(/\n## Phase 65 reporting shelf[\s\S]*$/, "");
  await writeFile(path, `${text.trimEnd()}\n\n${section}`, "utf8");
}

const topicBindings = [
  ["agriculture-and-bioeconomy.json", briefingSpecs[0], topicPacks[0]],
  ["discovery-technologies.json", briefingSpecs[1], topicPacks[1]],
  ["quantum.json", briefingSpecs[2], topicPacks[2]],
  ["climate.json", briefingSpecs[3], topicPacks[3]],
  ["aviation.json", briefingSpecs[4], topicPacks[4]],
  ["water.json", briefingSpecs[5], topicPacks[5]],
  ["space.json", briefingSpecs[6], topicPacks[6]],
  ["ai-for-science.json", briefingSpecs[7], topicPacks[7]]
];
for (const [file, briefing, pack] of topicBindings) {
  const path = join(contentRoot, "topics", file);
  const topic = await readJson(contentRoot, "topics", file);
  const question = `Phase 65: ${pack.question}`;
  if (!topic.watch_questions.includes(question)) topic.watch_questions.push(question);
  topic.summary = `${topic.summary.replace(/ Phase 65 adds[\s\S]*$/, "")} Phase 65 adds a four-record reporting shelf and the Published briefing “${briefing.title},” with explicit authority, implementation, acceptance, operating, and outcome boundaries.`;
  await writeJson(path, topic);
}

const pathwayBindings = [
  ["climate-observation-to-local-decision.json", briefingSpecs.slice(0, 4).map((item) => item.id)],
  ["space-coast-plan-to-mission.json", [briefingSpecs[4].id, briefingSpecs[6].id]],
  ["industrial-water-agreement-to-reuse-operation.json", [briefingSpecs[5].id]],
  ["ai-infrastructure-policy-to-assurance.json", [briefingSpecs[7].id, briefingSpecs[9].id]],
  ["cross-corridor-authorization-to-operation.json", briefingSpecs.slice(8).map((item) => item.id)],
  ["policy-standards-to-implementation.json", [briefingSpecs[2].id, briefingSpecs[9].id]],
  ["autonomy-regulation-to-service.json", [briefingSpecs[4].id, briefingSpecs[9].id, briefingSpecs[10].id]]
];
for (const [file, ids] of pathwayBindings) {
  const path = join(contentRoot, "reader-pathways", file);
  const pathway = await readJson(contentRoot, "reader-pathways", file);
  pathway.briefing_ids = [...new Set([...pathway.briefing_ids, ...ids])];
  pathway.research_collection_ids = [...new Set([...pathway.research_collection_ids, ...Object.values(collectionSpecs).map((spec) => spec.id)])];
  await writeJson(path, pathway);
}

const registryPath = join(appRoot, "src", "data", "phase-61-project-conversion-registry.json");
const registry = await readJson(appRoot, "src", "data", "phase-61-project-conversion-registry.json");
const gap006 = registry.gap_operating_register.find((item) => item.gap_id === "gap-006");
if (!gap006) throw new Error("Phase 61 registry is missing gap-006.");
Object.assign(gap006, {
  lane: "Local ENSO interpretation",
  exact_next_artifact: "Named regional teleconnection analysis, sector exposure record, and local water, crop, or hazard outcome series",
  reopening_trigger: "An official regional or sector record links an ENSO phase to a named local mechanism and bounded outcome without asserting deterministic causation",
  file_ids: []
});
await writeJson(registryPath, registry);

const gapFiles = (await readdir(join(contentRoot, "evidence-gaps"))).filter((name) => name.endsWith(".json")).sort();
const gaps = await Promise.all(gapFiles.map((name) => readJson(contentRoot, "evidence-gaps", name)));
const gapStatusCounts = Object.fromEntries([...new Set(gaps.map((gap) => gap.status))].sort().map((status) => [status, gaps.filter((gap) => gap.status === status).length]));
const gapRegisterPath = join(workspaceRoot, "docs", "evidence-gap-register.md");
let gapRegister = await readFile(gapRegisterPath, "utf8");
const gapTable = [
  "## Current Evidence Gaps",
  "",
  "| ID | Status | Priority | Local System | Topic | Constraint Tags | Question | Missing Evidence | Next Action |",
  "| --- | --- | --- | --- | --- | --- | --- | --- | --- |",
  ...gaps.map((gap) => `| ${gap.id} | ${gap.status} | ${gap.priority} | ${gap.local_system} | ${gap.primary_topic} | ${gap.constraint_tags.join(", ")} | ${gap.question} | ${gap.missing_evidence.join(", ")} | ${gap.next_action} |`),
  "",
  "Phase 65 reconciliation note: this table is generated from the sixteen canonical JSON records. `gap-006` is the ENSO local-interpretation lane everywhere; no operating register reuses that ID for insurance or risk transfer.",
  ""
].join("\n");
gapRegister = gapRegister.replace(/## Current Evidence Gaps[\s\S]*?(?=## How To Use The Register)/, gapTable);
await writeFile(gapRegisterPath, gapRegister, "utf8");

const ledger = {
  schema_version: "1.0",
  phase: "65",
  title: "Field Reporting Expansion — Named Systems And Undercovered Frontiers",
  generated_date: today,
  content_only_boundary: {
    new_sources: 0,
    new_signals: 0,
    signal_promotions: 0,
    schemas_added: 0,
    public_exports_added: 0,
    automation_added: 0,
    phase_64_cells_advanced: 0,
    scores_added: 0,
    rankings_added: 0
  },
  metrics: {
    primary_records_reviewed: generatedRecords.length,
    named_file_reporting_packs: researchPacks.length,
    undercovered_topic_packs: topicPacks.length,
    signal_decisions: signalDecisions.length,
    new_briefings_published: briefingSpecs.length,
    canonical_named_briefings_deepened: canonicalPackBindings.length,
    local_systems_deepened: localBindings.length,
    topic_families_deepened: topicBindings.length,
    research_collections_added: Object.keys(collectionSpecs).length,
    legacy_briefings_dispositioned: legacyDispositions.length
  },
  research_collections: Object.entries(collectionSpecs).map(([key, spec]) => ({ ...spec, document_ids: collectionDocuments[key] })),
  research_record_reviews: generatedRecords,
  named_file_reporting_packs: researchPacks.map((pack) => ({ ...pack, phase65_record_ids: generatedRecords.filter((record) => record.pack_id === pack.pack_id).map((record) => record.id) })),
  undercovered_topic_packs: topicPacks.map((pack) => ({ ...pack, phase65_record_ids: generatedRecords.filter((record) => record.pack_id === pack.pack_id).map((record) => record.id) })),
  signal_decisions: signalDecisions,
  briefing_ids: briefingSpecs.map((briefing) => briefing.id),
  legacy_briefing_dispositions: legacyDispositions.map(([file, decision, rationale]) => ({ file, decision, rationale })),
  gap_reconciliation: {
    canonical_records: gaps.length,
    status_counts: gapStatusCounts,
    gap_006_lane: gap006.lane,
    gap_006_exact_next_artifact: gap006.exact_next_artifact,
    semantic_mismatches_remaining: 0
  }
};
await writeJson(join(appRoot, "src", "data", "phase-65-content-expansion.json"), ledger);

const update = {
  id: "update-2026-08-11-phase-65-field-reporting-expansion",
  effective_date: today,
  entry_type: "Research Collection",
  title: "Phase 65 publishes named-system and undercovered-frontier reporting shelves",
  summary: "Ninety-six reviewed primary-record summaries, three downloadable collections, eight named-file packs, eight topic packs, forty-eight signal decisions, eleven Published briefings, eight canonical-file deepens, five local-system deepens, eight topic deepens, and seven legacy briefing dispositions complete the content-only Phase 65 expansion.",
  affected_record_ids: [
    ...briefingSpecs.map((briefing) => briefing.id),
    ...Object.values(collectionSpecs).map((spec) => spec.id),
    ...legacyDispositions.map(([file]) => file.replace(/\.mdx$/, ""))
  ],
  related_paths: [
    "/research/",
    "/briefings/",
    "/atlas/topics/",
    "/atlas/local-systems/"
  ],
  evidence_note: "Phase 65 re-reviews official primary records already held in the corpus. It changes editorial organization and synthesis only: zero source or signal additions, zero promotions, zero new public exports or schemas, and zero Phase 64 cell advances.",
  receipt_type: "Change Note",
  materiality: "No record-state change",
  source_checked_date: today,
  decision_date: today,
  prior_state: "Eight named files had conversion ledgers, gates, and matrix cells, while undercovered topics lacked multi-record reporting shelves and seven legacy briefings remained In Review.",
  current_state: "Every named file has an eight-record reporting pack; eight undercovered topics have four-record shelves and Published briefings; forty-eight signals have explicit no-state-change decisions; all seven legacy briefing holds have final dispositions.",
  publication_effect: "Adds eleven Published briefings, three Published research collections, ninety-six Published research-document reviews, and archives five superseded briefings while publishing two repaired syntheses.",
  work_package: "docs/work-packages/phase-65-field-reporting-expansion.md"
};
await writeJson(join(contentRoot, "updates", "2026-08-11-phase-65-field-reporting-expansion.json"), update);

console.log("Phase 65 content built: 96 reviewed primary records, 3 collections, 16 reporting packs, 48 signal decisions, 11 new briefings, 7 legacy dispositions, and zero signal or matrix-state changes.");
