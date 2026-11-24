import { access, mkdir, readdir, readFile, writeFile } from "node:fs/promises";
import { createHash } from "node:crypto";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { computeV1rcDigestFromDisk, isValidV1rcValidationReceipt, v1rcPublicationDate } from "./lib/v1rc-candidate-digest.mjs";
import { isValidV1rcOwnerReceipt, v1rcOwnerReceiptArchiveName, v1rcOwnerReceiptContractVersion } from "./lib/v1rc-owner-receipt.mjs";
import {
  buildPhase151ReviewScope,
  buildPhase154PublicationInputScope,
  buildPhase154PublicationScope,
  materialIdsResolve,
  phase151ReviewScopeVersion,
  phase154PublicationInputVersion,
  phase154PublicationScopeVersion,
} from "./lib/phase151-154-scope-digest.mjs";

const appRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const workspaceRoot = resolve(appRoot, "..");
const dataRoot = join(appRoot, "src", "data");
const sourceRoot = join(appRoot, "src", "content", "sources");
const updateRoot = join(appRoot, "src", "content", "updates");
const ownerReceiptRoot = join(dataRoot, "phase-156-owner-receipts");
const docsRoot = join(workspaceRoot, "docs");
const workPackageRoot = join(docsRoot, "work-packages");
const edmontonDate = new Intl.DateTimeFormat("en-CA", {
  timeZone: "America/Edmonton",
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
}).format(new Date());
const effectiveDate = process.env.FTFN_EFFECTIVE_DATE ?? edmontonDate;
const programStartDate = v1rcPublicationDate;
const release = "v1rc";

if (!/^\d{4}-\d{2}-\d{2}$/.test(effectiveDate)) {
  throw new Error(`FTFN_EFFECTIVE_DATE must use YYYY-MM-DD; received ${effectiveDate}.`);
}
const effectiveDateTimestamp = Date.parse(`${effectiveDate}T00:00:00Z`);
if (!Number.isFinite(effectiveDateTimestamp) || new Date(effectiveDateTimestamp).toISOString().slice(0, 10) !== effectiveDate) {
  throw new Error(`FTFN_EFFECTIVE_DATE is not a valid calendar date: ${effectiveDate}.`);
}
if (effectiveDate < programStartDate) {
  throw new Error(`FTFN_EFFECTIVE_DATE ${effectiveDate} precedes the v1-RC publication date ${programStartDate}.`);
}
if (effectiveDate < edmontonDate) {
  throw new Error(`Refusing past mutation date ${effectiveDate}; mutation runs must use the current America/Edmonton date ${edmontonDate}.`);
}
if (effectiveDate > edmontonDate && process.env.FTFN_ALLOW_FUTURE_DATE !== "1") {
  throw new Error(`Refusing future effective date ${effectiveDate}; the current America/Edmonton date is ${edmontonDate}. Set FTFN_ALLOW_FUTURE_DATE=1 only inside an isolated fixture test.`);
}

const readJson = async (name) => JSON.parse(await readFile(join(dataRoot, name), "utf8"));
const readOptionalJson = async (name) => {
  try {
    return await readJson(name);
  } catch (error) {
    if (error?.code === "ENOENT") return null;
    throw error;
  }
};
const fileExists = async (path) => {
  try {
    await access(path);
    return true;
  } catch {
    return false;
  }
};
const readValidationReceipts = async () => {
  const receipts = [];
  const legacy = await readOptionalJson("phase-156-local-validation-receipt.json");
  if (legacy) receipts.push(legacy);
  try {
    for (const entry of await readdir(join(dataRoot, "phase-156-receipts"), { withFileTypes: true })) {
      if (entry.isFile() && entry.name.endsWith(".json")) receipts.push(await readJson(join("phase-156-receipts", entry.name)));
    }
  } catch (error) {
    if (error?.code !== "ENOENT") throw error;
  }
  return receipts;
};
const readOwnerReceipts = async () => {
  const receipts = [];
  const inbox = await readOptionalJson("phase-156-owner-acceptance-receipt.json");
  if (inbox) receipts.push(inbox);
  try {
    for (const entry of await readdir(ownerReceiptRoot, { withFileTypes: true })) {
      if (entry.isFile() && entry.name.endsWith(".json")) receipts.push(await readJson(join("phase-156-owner-receipts", entry.name)));
    }
  } catch (error) {
    if (error?.code !== "ENOENT") throw error;
  }
  return [...new Map(receipts.map((receipt) => [JSON.stringify(receipt), receipt])).values()];
};
const writeJson = async (path, value) => writeFile(path, `${JSON.stringify(value, null, 2)}\n`, "utf8");
const writeImmutableJsonOrVerify = async (path, value) => {
  const serialized = `${JSON.stringify(value, null, 2)}\n`;
  try {
    await writeFile(path, serialized, { encoding: "utf8", flag: "wx" });
  } catch (error) {
    if (error?.code !== "EEXIST") throw error;
    const existing = await readFile(path, "utf8");
    if (existing !== serialized) throw new Error(`Immutable JSON collision at ${path}. Existing bytes differ from the requested record.`);
  }
};
const unique = (items) => [...new Set(items.filter(Boolean))];
const slugify = (value) => String(value).toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
const byId = (items, key) => new Map(items.map((item) => [item[key], item]));
const digest = (value) => createHash("sha256").update(JSON.stringify(value)).digest("hex");
const isValidIsoDate = (date) => {
  if (typeof date !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(date)) return false;
  const timestamp = Date.parse(`${date}T00:00:00Z`);
  return Number.isFinite(timestamp) && new Date(timestamp).toISOString().slice(0, 10) === date;
};
const hasNonFutureReceipt = (date, receiptId) => isValidIsoDate(date) && date <= effectiveDate && typeof receiptId === "string" && receiptId.trim().length > 0;
await Promise.all([
  mkdir(updateRoot, { recursive: true }),
  mkdir(workPackageRoot, { recursive: true }),
]);

const [
  cycle,
  propagationContract,
  projects,
  p130,
  p125,
  p133,
  p134,
  p135,
  p136,
  p137,
  p138,
  p139,
  p140,
  p142,
  p143,
  validationReceipts,
  ownerReceiptCandidates,
  existing145,
  existing146,
  existing147,
  existing148,
  existing149,
  existing150,
  existing151,
  existing152,
  existing153,
  existing154,
  existing155,
  existing156,
  existingAggregate,
] = await Promise.all([
  readJson("phase-60-operating-cycle.json"),
  readJson("phase-60-propagation-contract.json"),
  readJson("phase-61-project-conversion-registry.json"),
  readJson("phase-130-authority-gap-closure-maps.json"),
  readJson("phase-125-evidence-annotation-ledger.json"),
  readJson("phase-133-requirement-adjudication-board.json"),
  readJson("phase-134-mission-decision-register.json"),
  readJson("phase-135-atlas-conversion-readiness-audit.json"),
  readJson("phase-136-named-project-chronicles.json"),
  readJson("phase-137-place-delivery-ledgers.json"),
  readJson("phase-138-longitudinal-evidence-eligibility.json"),
  readJson("phase-139-comparative-dossier-rereview.json"),
  readJson("phase-140-living-topic-desks.json"),
  readJson("phase-142-topic-delivery-roadmaps.json"),
  readJson("phase-143-editorial-cadence-editions.json"),
  readValidationReceipts(),
  readOwnerReceipts(),
  readOptionalJson("phase-145-evidence-gate-operations-journal.json"),
  readOptionalJson("phase-146-authority-gap-resolution-program.json"),
  readOptionalJson("phase-147-evidence-adjudication-record.json"),
  readOptionalJson("phase-148-atlas-changefeed.json"),
  readOptionalJson("phase-149-longitudinal-evidence-lab.json"),
  readOptionalJson("phase-150-comparison-passports-2-0.json"),
  readOptionalJson("phase-151-weekly-desk-review-ledger.json"),
  readOptionalJson("phase-152-frontier-topic-field-guides.json"),
  readOptionalJson("phase-153-future-state-report-series.json"),
  readOptionalJson("phase-154-september-edition-packets.json"),
  readOptionalJson("phase-155-public-method-corrections-library.json"),
  readOptionalJson("phase-156-v1-launch-decision.json"),
  readOptionalJson("v1-release-candidate.json"),
]);
let ownerReceipt = null;

const publicationSnapshotVersion = "v1rc-initial-publication-2026-08-31-v2";
const revisionMode = process.env.FTFN_ALLOW_V1RC_CONTENT_REVISION === "1";
const revisionReceiptId = process.env.FTFN_V1RC_REVISION_RECEIPT_ID ?? null;
if (revisionMode && (effectiveDate <= programStartDate || !revisionReceiptId)) {
  throw new Error("A v1-RC published-content revision requires a later effective date and FTFN_V1RC_REVISION_RECEIPT_ID.");
}
let publishedSnapshotLocked = false;
if (existing156?.local_validation_receipt && existingAggregate) {
  try {
    const existingDigest = await computeV1rcDigestFromDisk({ aggregate: existingAggregate, dataRoot, updateRoot });
    publishedSnapshotLocked = isValidV1rcValidationReceipt({ receipt: existing156.local_validation_receipt, aggregate: existingAggregate, candidateDigest: existingDigest });
  } catch {
    publishedSnapshotLocked = false;
  }
}
const preservePublishedRecords = ({ existingRegistry, key, records, idKey }) => {
  if (!publishedSnapshotLocked || existingRegistry?.publication_snapshot_version !== publicationSnapshotVersion) return records;
  const generatedById = byId(records, idKey);
  const preservedRecords = existingRegistry[key].map((prior) => {
    const preserved = structuredClone(prior);
    const generated = generatedById.get(prior[idKey]);
    // Non-detail registries omit internal routes from their public records.
    // Restore only that derived field for snapshot hashing so a locked rerun
    // hashes the same in-memory shape as the initial publication.
    if (!("route" in preserved) && typeof generated?.route === "string") preserved.route = generated.route;
    return preserved;
  });
  if (!revisionMode) return preservedRecords;
  const priorById = byId(preservedRecords, idKey);
  return records.map((record) => {
    const prior = priorById.get(record[idKey]);
    if (!prior || digest(prior) === digest(record)) return record;
    const revised = {
      ...record,
      last_revised_date: effectiveDate,
      revision_receipt_id: revisionReceiptId,
      superseded_content_digest: digest(prior),
    };
    revised.current_content_digest = digest(revised);
    return revised;
  });
};
const publicationSnapshotMetadata = (records) => ({
  publication_snapshot_version: publicationSnapshotVersion,
  publication_snapshot_digest: digest(records),
  revision_mode: revisionMode,
  revision_receipt_id: revisionMode ? revisionReceiptId : null,
});
const canonicalSourceRecords = await Promise.all((await readdir(sourceRoot, { withFileTypes: true }))
  .filter((entry) => entry.isFile() && entry.name.endsWith(".json"))
  .map(async (entry) => JSON.parse(await readFile(join(sourceRoot, entry.name), "utf8"))));
const canonicalSourceById = byId(canonicalSourceRecords, "id");

const publicationBoundaries = [
  "Alternative official-source discovery expands the review shelf; it does not by itself admit evidence or answer a mission.",
  "Calendar-bound checks remain unoperated until their lawful date, and shared-date gates retain separate identities, decisions, and receipts.",
  "No project stage, place state, longitudinal observation, comparison verdict, outcome, score, rank, causal finding, recommendation, owner decision, or public-launch authorization is inferred.",
  "A bounded repository result describes the reviewed corpus and search path; it never proves that qualifying evidence does not exist elsewhere.",
];

const phaseMeta = {
  145: ["Evidence-gate operations journal", "Bind every Phase 60 gate and companion Phase 61 recheck to its lawful date, exact artifact, independent receipt, and complete propagation contract."],
  146: ["Authority-gap resolution program", "Expand all twelve mission gaps with checked alternative official artifacts and a route-visible terminal-disposition contract without treating discovery as admission."],
  147: ["Evidence adjudication record", "Prepare complete receipt-bearing decision records for eighteen requirements and six missions while leaving owner authority explicit."],
  148: ["Atlas changefeed", "Recheck all thirty-nine Atlas identities against their governed upstream state and publish a zero-synthetic-change baseline."],
  149: ["Longitudinal evidence lab", "Re-run identity, period, measure, and denominator review, identify defensible pilots, and prepare an explicit no-series launch boundary."],
  150: ["Comparison passports 2.0", "Publish decision-grade compatibility passports for all twelve dossiers while preserving Context only where no common contract exists."],
  151: ["Weekly desk review ledger", "Give every living topic desk a dated baseline packet and four transparent September review windows."],
  152: ["Frontier topic field guides", "Publish seventeen integrated field guides that connect missions, projects, places, comparisons, affected parties, and decisive next evidence."],
  153: ["Future State report series", "Publish four flagship cross-system reports that explain the difference between commitment, delivery, operation, adoption, and outcome."],
  154: ["September edition packets", "Prepare four source-bound editorial packets without predating the scheduled September editions."],
  155: ["Public method and corrections library", "Publish durable evidence, authority, longitudinal, comparison, revision, correction, and launch-governance methods."],
  156: ["v1 launch decision", "Derive a fresh fourteen-gate release-candidate audit from governed upstream state and retain the explicit owner promotion boundary."],
};

const sectionByPhase = {
  145: "gate-journal",
  146: "authority-resolution",
  147: "adjudication",
  148: "changefeed",
  149: "longitudinal-lab",
  150: "comparison-passports",
  151: "desk-reviews",
  152: "field-guides",
  153: "reports",
  154: "edition-packets",
  155: "method-library",
  156: "launch-decision",
};

const exportNameByPhase = {
  145: "phase-145-evidence-gate-operations-journal.json",
  146: "phase-146-authority-gap-resolution-program.json",
  147: "phase-147-evidence-adjudication-record.json",
  148: "phase-148-atlas-changefeed.json",
  149: "phase-149-longitudinal-evidence-lab.json",
  150: "phase-150-comparison-passports-2-0.json",
  151: "phase-151-weekly-desk-review-ledger.json",
  152: "phase-152-frontier-topic-field-guides.json",
  153: "phase-153-future-state-report-series.json",
  154: "phase-154-september-edition-packets.json",
  155: "phase-155-public-method-corrections-library.json",
  156: "phase-156-v1-launch-decision.json",
};

const detailPhaseSet = new Set([150, 152, 153, 154, 155]);
const makeRegistry = (phase, recordsKey, records, counts, extra = {}) => {
  const hub = `/review/${release}/${sectionByPhase[phase]}/`;
  const publishedRecords = detailPhaseSet.has(phase)
    ? records
    : records.map(({ route: _route, ...record }) => record);
  const detailRoutes = publishedRecords.map((record) => record.route).filter(Boolean);
  return {
    schema_version: "1.0",
    phase,
    program_id: `FTFN-PHASE-${phase}`,
    dataset: exportNameByPhase[phase].replace(/\.json$/, "").replaceAll("-", "_"),
    title: phaseMeta[phase][0],
    effective_date: effectiveDate,
    record_status: "Published",
    build_status: phase === 156 ? "Candidate assembled — validation pending" : "Complete locally",
    summary: phaseMeta[phase][1],
    record_scope: `${phaseMeta[phase][0]} records governed by the stated publication boundaries.`,
    publication_boundaries: publicationBoundaries,
    routes: { hub, public_export: `/data/${exportNameByPhase[phase]}` },
    counts,
    [recordsKey]: publishedRecords,
    ...extra,
    public_html_routes: [hub, ...detailRoutes],
    public_json_exports: [`/data/${exportNameByPhase[phase]}`],
  };
};

const alternativeArtifacts = [
  {
    candidate_id: "146-ALT-GAO-F15EX-2025",
    title: "Weapon Systems Annual Assessment: F-15EX program assessment",
    publisher: "U.S. Government Accountability Office",
    artifact_date: "2025-06-11",
    checked_date: effectiveDate,
    url: "https://www.gao.gov/products/gao-25-107569",
    authority_role: "Independent federal program assessment with named F-15EX quantities, schedule, cost, production-rate, rework, and risk fields.",
    fit: "Potentially exact for a named product-and-program identity and bounded multi-period production-risk context.",
    known_limit: "The annual assessment is not a facility-level accepted-output, recurring reliability, downtime, or receiving-system outcome series.",
  },
  {
    candidate_id: "146-ALT-DOE-FY24-PERFORMANCE",
    title: "Fiscal Year 2024 Annual Performance Report",
    publisher: "U.S. Department of Energy",
    artifact_date: "2025-01-01",
    checked_date: effectiveDate,
    url: "https://www.energy.gov/sites/default/files/2025-01/fy-24-annual-performance-report.pdf",
    authority_role: "Federal performance report with source-defined user-facility availability, AI-enabled workflow, and research-object measures.",
    fit: "Alternative outcome and operating-measure shelf for AI-for-science and discovery-technology review.",
    known_limit: "Agency and program measures do not establish a stable named workflow denominator or causal effect for one accepted AI or discovery system.",
  },
  {
    candidate_id: "146-ALT-NSF-FY25-PERFORMANCE",
    title: "FY 2027 Annual Performance Plan and FY 2025 Annual Performance Report",
    publisher: "U.S. National Science Foundation",
    artifact_date: "2026-03-01",
    checked_date: effectiveDate,
    url: "https://www.nsf.gov/about/performance/annual-performance-reports/fy-27-app-and-fy-25-apr",
    authority_role: "Federal performance report with multi-year research-product counts and an explicit developing impact-framework boundary.",
    fit: "Alternative institutional outcome and denominator context for AI-for-science and discovery-technology missions.",
    known_limit: "Research-product totals are not a controlled comparison of discovery time, yield, replication, cost, or scientific quality for a named workflow.",
  },
  {
    candidate_id: "146-ALT-BTS-ASQP-2026",
    title: "Airline Service Quality Performance 234 data",
    publisher: "U.S. Bureau of Transportation Statistics",
    artifact_date: "2026-08-18",
    checked_date: effectiveDate,
    url: "https://www.bts.gov/browse-statistical-products-and-data/bts-publications/airline-service-quality-performance-234-time",
    authority_role: "Official carrier-flight service-quality data with carrier, airport, scheduled-time, actual-time, delay, and period fields.",
    fit: "Potentially exact for route, carrier, airport, current-period, and reliability requirements within the reporting universe.",
    known_limit: "Coverage thresholds and reporting changes apply; the data do not supply emissions, noise, affordability, accessibility, or a universal aviation-safety denominator.",
  },
  {
    candidate_id: "146-ALT-BTS-TD40-2026",
    title: "Technical Reporting Directive No. 40 — On-Time Performance",
    publisher: "U.S. Bureau of Transportation Statistics",
    artifact_date: "2025-11-17",
    checked_date: effectiveDate,
    url: "https://www.bts.gov/explore-topics-and-geography/modes/aviation/number-40-technical-directive-reporting-time",
    authority_role: "Controlling reporting definitions, applicability, carrier list, airport list, and data requirements for 2026 on-time records.",
    fit: "Exact method-and-denominator companion for the BTS service-quality data shelf.",
    known_limit: "A reporting directive defines the series but is not itself an operating observation or outcome finding.",
  },
  {
    candidate_id: "146-ALT-PHOENIX-TSMC-WASTEWATER-2026",
    title: "Phoenix City Council Item 73 — TSMC wastewater development agreement",
    publisher: "City of Phoenix",
    artifact_date: "2026-05-20",
    checked_date: effectiveDate,
    url: "https://www.phoenix.gov/content/dam/phoenix/cityclerksite/city-council-meeting-files/2026/5-20-26%20Formal%20Agenda-FINAL.pdf",
    authority_role: "Municipal governing record defining wastewater conveyance scope, capacity conditions, and the industrial reclaimed-water-plant dependency.",
    fit: "Exact authority and infrastructure-dependency artifact for the named TSMC Arizona campus.",
    known_limit: "The agreement does not establish completed or accepted assets, metered flow, compliant operation, fab output, or downstream public outcomes.",
  },
  {
    candidate_id: "146-ALT-USGS-MCS-2026",
    title: "Mineral Commodity Summaries 2026",
    publisher: "U.S. Geological Survey",
    artifact_date: "2026-02-06",
    checked_date: effectiveDate,
    url: "https://pubs.usgs.gov/publication/mcs2026",
    authority_role: "Official annual commodity publication with definitions, five-year statistics, production, reserves, resources, and revision history.",
    fit: "Exact commodity-level definition and period context for lithium and other critical minerals.",
    known_limit: "National and global commodity estimates do not establish the present operating or compliance state of one named mine, refinery, processor, or recycler.",
  },
  {
    candidate_id: "146-ALT-USGS-MCS-DATA-2026",
    title: "Mineral Commodity Summaries 2026 data release",
    publisher: "U.S. Geological Survey",
    artifact_date: "2026-02-06",
    checked_date: effectiveDate,
    url: "https://data.usgs.gov/datacatalog/data/USGS%3A69837e43b66b01367d7ec7c7",
    authority_role: "Machine-readable public data and metadata for the 2026 commodity chapters, covering 2021–2025.",
    fit: "Alternative multi-period commodity series with explicit metadata and public-domain status.",
    known_limit: "Commodity-level series cannot be substituted for project-level commissioning, compliance, qualification, shipment, or recurring output.",
  },
  {
    candidate_id: "146-ALT-GAO-CDM-2025",
    title: "Cybersecurity: Network Monitoring Program Needs Further Guidance and Actions",
    publisher: "U.S. Government Accountability Office",
    artifact_date: "2025-06-11",
    checked_date: effectiveDate,
    url: "https://www.gao.gov/products/gao-25-107470",
    authority_role: "Independent federal assessment of Continuous Diagnostics and Mitigation goals, agency coverage, data quality, and incident-response capability.",
    fit: "Alternative exact program-level goal and implementation evidence for a named federal cybersecurity program.",
    known_limit: "Goal attainment and agency questionnaires do not provide a stable exposure, loss, recovery, or user-harm series and may reward uneven detection or reporting.",
  },
  {
    candidate_id: "146-ALT-NSF-SE-INDICATORS-2026",
    title: "The State of U.S. Science and Engineering 2026",
    publisher: "National Center for Science and Engineering Statistics",
    artifact_date: "2026-05-04",
    checked_date: effectiveDate,
    url: "https://ncses.nsf.gov/pubs/nsbsep20261/preface",
    authority_role: "Statutorily produced indicator suite with long-run research, workforce, publication, innovation, and international-comparison data.",
    fit: "Alternative macro outcome and denominator context for discovery technologies.",
    known_limit: "National science indicators cannot establish the incremental effect of one platform or provide a comparable control for one discovery workflow.",
  },
  {
    candidate_id: "146-ALT-CPUC-AV-QUARTERLY-2026",
    title: "Autonomous Vehicle Program quarterly reporting",
    publisher: "California Public Utilities Commission",
    artifact_date: "2026-08-18",
    checked_date: effectiveDate,
    url: "https://www.cpuc.ca.gov/regulatory-services/licensing/transportation-licensing-and-analysis-branch/autonomous-vehicle-programs/quarterly-reporting",
    authority_role: "Official operator reporting shelf for passenger-service miles, trips, dwell, accessibility, incidents, complaints, and reporting revisions.",
    fit: "Potentially exact operator, service, geography, period, and exposure-denominator source for California AV service.",
    known_limit: "Public cells can be redacted or revised, operator coverage changes, and the shelf does not by itself create a comparable safety or public-outcome rate.",
  },
  {
    candidate_id: "146-ALT-NHTSA-SGO-2026",
    title: "Standing General Order on Crash Reporting",
    publisher: "National Highway Traffic Safety Administration",
    artifact_date: "2026-06-15",
    checked_date: effectiveDate,
    url: "https://www.nhtsa.gov/laws-regulations/standing-general-order-crash-reporting",
    authority_role: "Federal incident-reporting order, dashboard, data files, revisions, definitions, and stated interpretation limitations for ADS and Level 2 ADAS.",
    fit: "Exact crash-event and reporting-definition shelf for named reporting entities and current periods.",
    known_limit: "Reported crash counts lack a complete public exposure denominator and may contain unknown values, revisions, or duplicate reports; counts cannot be used as comparative safety rates alone.",
  },
  {
    candidate_id: "146-ALT-FTA-NTD-2026",
    title: "National Transit Database data products",
    publisher: "Federal Transit Administration",
    artifact_date: "2026-06-24",
    checked_date: effectiveDate,
    url: "https://www.transit.dot.gov/ntd/ntd-data",
    authority_role: "Official agency-, mode-, month-, service-, ridership-, safety-, and security-data products with reporting manuals and release schedules.",
    fit: "Alternative stable public-transit service and exposure series for broader mobility comparisons.",
    known_limit: "NTD measures do not represent autonomous ride-hail service and cannot be joined to AV records without a common entity, period, geography, and service definition.",
  },
  {
    candidate_id: "146-ALT-NIST-QC-METRICS-2024",
    title: "Performance metrics for automated quantum-dot device characterization and control",
    publisher: "National Institute of Standards and Technology",
    artifact_date: "2024-10-01",
    checked_date: effectiveDate,
    url: "https://tsapps.nist.gov/publication/get_pdf.cfm?pub_id=956794",
    authority_role: "Federal measurement research defining candidate performance metrics and standardized reference-dataset needs for a bounded quantum-device workflow.",
    fit: "Alternative method artifact for stable task and system denominators.",
    known_limit: "A proposed metric framework is not multi-period accepted-use evidence or an observed operational, scientific, cost, or security outcome.",
  },
  {
    candidate_id: "146-ALT-FAA-SPACE-LICENSES",
    title: "Commercial space licenses, permits and approvals",
    publisher: "Federal Aviation Administration",
    artifact_date: "2025-04-22",
    checked_date: effectiveDate,
    url: "https://www.faa.gov/space/licenses",
    authority_role: "Controlling federal shelf for launch, reentry, site-operator, experimental-permit, and safety-element authorizations.",
    fit: "Exact authority identity and current-license context for operators, vehicles, operations, and sites.",
    known_limit: "Authorization does not establish mission completion, utilization, reliability, cost, access, environmental performance, or community outcome.",
  },
  {
    candidate_id: "146-ALT-FAA-SPACE-NUMBERS",
    title: "Commercial Space By the Numbers",
    publisher: "Federal Aviation Administration",
    artifact_date: "Rolling/current page; publication date not shown",
    checked_date: effectiveDate,
    url: "https://www.faa.gov/node/52196",
    authority_role: "Official aggregate counts of licensed launches, reentries, spaceport licenses, permitted launches, safety approvals, and active launch licenses.",
    fit: "Alternative recurring activity context for the regulated commercial-space system.",
    known_limit: "Aggregate totals do not provide a stable vehicle-, mission-, operator-, or site-specific denominator and cannot support cost, access, environmental, or local-outcome claims.",
  },
  {
    candidate_id: "146-ALT-NIST-MEP-AMPHENOL-2025",
    title: "Amphenol Aerospace reduces scrap through Arizona MEP Lean Green Belt course",
    publisher: "National Institute of Standards and Technology Manufacturing Extension Partnership",
    artifact_date: "2025",
    checked_date: effectiveDate,
    url: "https://www.nist.gov/mep/successstories/2025/amphenol-aerospace-reduces-scrap-through-arizona-mep-lean-green-belt-course",
    authority_role: "Official MEP client success record naming a manufacturer, intervention, operational measure, and reported business effect.",
    fit: "Alternative named-firm operating-outcome artifact for testing whether a manufacturing change has a bounded observed result.",
    known_limit: "A client success story is not an independently audited facility-wide production, acceptance, reliability, or multi-period outcome series.",
  },
  {
    candidate_id: "146-ALT-NIST-MEP-FY2024-RESULTS",
    title: "About the MEP National Network — FY 2024 results",
    publisher: "National Institute of Standards and Technology Manufacturing Extension Partnership",
    artifact_date: "2025-03-20",
    checked_date: effectiveDate,
    url: "https://www.nist.gov/system/files/documents/2025/03/20/NIST%20MEP-%20About%20the%20MEPNN%20508-2.pdf",
    authority_role: "Official network results summary with source-defined client, investment, sales, cost-savings, and job measures.",
    fit: "Alternative aggregate denominator and outcome context for manufacturing-extension activity.",
    known_limit: "Network-wide client-reported results cannot establish one named facility's accepted output, recurring reliability, or causal counterfactual.",
  },
  {
    candidate_id: "146-ALT-NSF-NAIRR-TWO-YEAR",
    title: "National AI Research Resource Pilot two-year progress update",
    publisher: "U.S. National Science Foundation",
    artifact_date: "2026",
    checked_date: effectiveDate,
    url: "https://nsf-gov-resources.nsf.gov/files/NAIRR-2-Year-Progress-Update.pdf",
    authority_role: "Official program progress report covering compute and data access, participating resources, research use, and implementation milestones.",
    fit: "Alternative named-program access and adoption evidence for AI research infrastructure.",
    known_limit: "Access and participation do not by themselves establish accepted scientific workflow improvement, reproducibility, discovery yield, or downstream outcome.",
  },
  {
    candidate_id: "146-ALT-BTS-TRANSTATS-ONTIME",
    title: "TranStats on-time performance data",
    publisher: "U.S. Bureau of Transportation Statistics",
    artifact_date: "Rolling",
    checked_date: effectiveDate,
    url: "https://transtats.bts.gov/ONTIME/Index.aspx",
    authority_role: "Official query and download surface for carrier, airport, flight, delay, cancellation, diversion, and period records.",
    fit: "Alternative machine-readable operating series for route- and carrier-level reliability within the reporting universe.",
    known_limit: "The reporting universe and definitions change; the data do not supply affordability, accessibility, emissions, noise, or a universal safety denominator.",
  },
  {
    candidate_id: "146-ALT-BTS-T100",
    title: "T-100 domestic segment data",
    publisher: "U.S. Bureau of Transportation Statistics",
    artifact_date: "Rolling",
    checked_date: effectiveDate,
    url: "https://www.transtats.bts.gov/TableInfo.asp?QO_fu146_anzr=Nv4+Pn44vr45&V0s1_b0yB=D&gnoyr_VQ=FMF",
    authority_role: "Official carrier segment activity data with departures, seats, passengers, freight, aircraft, and geography fields.",
    fit: "Alternative activity and exposure denominator for compatible aviation service questions.",
    known_limit: "Segment activity cannot be joined to emerging-aircraft capability or safety outcomes without stable aircraft, operator, route, period, and incident identities.",
  },
  {
    candidate_id: "146-ALT-FAA-GA-SAFETY-2025",
    title: "2025 General Aviation Safety Fact Sheet",
    publisher: "Federal Aviation Administration",
    artifact_date: "2025",
    checked_date: effectiveDate,
    url: "https://www.faa.gov/newsroom/fact_sheet/2025_General_Aviation_Safety_Fact_Sheet.pdf",
    authority_role: "Official safety summary with source-defined activity, accident, fatality, and rate context.",
    fit: "Alternative aviation safety numerator-and-exposure context for compatible general-aviation questions.",
    known_limit: "Aggregate general-aviation rates do not establish the safety, readiness, or reliability of one aircraft, operator, route, or emerging service.",
  },
  {
    candidate_id: "146-ALT-NTSB-AVIATION-STATS",
    title: "Aviation accident data and research",
    publisher: "National Transportation Safety Board",
    artifact_date: "Rolling",
    checked_date: effectiveDate,
    url: "https://www.ntsb.gov/safety/Pages/research.aspx",
    authority_role: "Independent federal accident-investigation and research shelf with event and historical safety data.",
    fit: "Alternative independent safety-event source for compatible aircraft, operation, geography, and period review.",
    known_limit: "Investigation records are event-focused and require a separate compatible exposure denominator before comparative rate claims.",
  },
  {
    candidate_id: "146-ALT-TSMC-SEC-20F-2025",
    title: "Taiwan Semiconductor Manufacturing Company 2025 Form 20-F",
    publisher: "Taiwan Semiconductor Manufacturing Company (filed with the U.S. Securities and Exchange Commission)",
    artifact_date: "2026",
    checked_date: effectiveDate,
    url: "https://www.sec.gov/Archives/edgar/data/1046179/000162828026025362/tsm-20251231.htm",
    authority_role: "Regulated annual filing with company-defined capital, facility, production, risk, customer, water, energy, and geographic disclosures.",
    fit: "Alternative issuer-bound operating and risk context for the named TSMC enterprise and Arizona investment.",
    known_limit: "Enterprise disclosure cannot substitute for Arizona facility acceptance, qualified product, metered utility service, recurring fab output, or local public outcome.",
  },
  {
    candidate_id: "146-ALT-GAO-CYBER-METRICS-2024",
    title: "Cybersecurity: OMB Should Improve Information Security Performance Metrics",
    publisher: "U.S. Government Accountability Office",
    artifact_date: "2024-05-09",
    checked_date: effectiveDate,
    url: "https://www.gao.gov/products/gao-24-106291",
    authority_role: "Independent assessment of federal information-security measures, metric quality, and outcome visibility.",
    fit: "Alternative oversight artifact for distinguishing control activity from meaningful cybersecurity outcomes.",
    known_limit: "Metric-design findings do not create an exposure, loss, service-restoration, or user-harm series for a named system.",
  },
  {
    candidate_id: "146-ALT-GAO-INCIDENT-RESPONSE-2024",
    title: "Cybersecurity: Federal Response to Cyber Incidents Needs Better Coordination",
    publisher: "U.S. Government Accountability Office",
    artifact_date: "2024",
    checked_date: effectiveDate,
    url: "https://www.gao.gov/products/gao-24-105658",
    authority_role: "Independent federal review of incident-response roles, coordination, documentation, and operating gaps.",
    fit: "Alternative authority and process evidence for response readiness and recovery governance.",
    known_limit: "Process findings cannot establish a stable incident, exposure, loss, restoration-time, or avoided-harm outcome series.",
  },
  {
    candidate_id: "146-ALT-DARPA-QUANTUM-BENCHMARKING",
    title: "Quantum Benchmarking program",
    publisher: "Defense Advanced Research Projects Agency",
    artifact_date: "Current program page",
    checked_date: effectiveDate,
    url: "https://www.darpa.mil/research/programs/quantum-benchmarking",
    authority_role: "Official program record defining utility-scale quantum-computing benchmark and validation objectives.",
    fit: "Alternative program-authority artifact for benchmark identity, test purpose, and technical decision criteria.",
    known_limit: "Program goals and benchmark design are not an independently accepted operational capability or repeated user-value series.",
  },
  {
    candidate_id: "146-ALT-DARPA-QBI",
    title: "Quantum Benchmarking Initiative",
    publisher: "Defense Advanced Research Projects Agency",
    artifact_date: "Current program page",
    checked_date: effectiveDate,
    url: "https://www.darpa.mil/research/programs/quantum-benchmarking-initiative",
    authority_role: "Official initiative record for staged, independent verification of industrial quantum-computing approaches.",
    fit: "Alternative named evaluation process and authority rail for future capability verification artifacts.",
    known_limit: "Participation, stage selection, or a program milestone is not proof of utility-scale capability, operational value, or repeat performance.",
  },
  {
    candidate_id: "146-ALT-FAA-SPACE-FORECAST-2026",
    title: "FAA Aerospace Forecast FY 2026–2046",
    publisher: "Federal Aviation Administration",
    artifact_date: "2026",
    checked_date: effectiveDate,
    url: "https://www.faa.gov/data_research/aviation/aerospace_forecasts/FY_2026-2046_Full_Forecast_Document_Tables.pdf",
    authority_role: "Official federal forecast with commercial-space activity definitions, historical context, and forward activity estimates.",
    fit: "Alternative system-scale denominator and scenario context for regulated commercial-space activity.",
    known_limit: "Forecast values are not observations and do not establish mission, vehicle, site, cost, reliability, environmental, or community outcomes.",
  },
  {
    candidate_id: "146-ALT-GAO-NASA-MAJOR-PROJECTS-2026",
    title: "NASA: Assessments of Major Projects",
    publisher: "U.S. Government Accountability Office",
    artifact_date: "2026",
    checked_date: effectiveDate,
    url: "https://files.gao.gov/reports/GAO-26-108556/index.html",
    authority_role: "Independent portfolio assessment with named project cost, schedule, risk, and development-status evidence.",
    fit: "Alternative named-project oversight evidence for civil-space delivery and schedule-risk questions.",
    known_limit: "Cost and schedule assessment does not establish launch completion, payload delivery, recurring service, reliability, or local outcome.",
  },
];

// Preserve the actual check date for unchanged candidates. A genuinely new or
// materially revised candidate takes the current effective date; it is never
// backdated to the initial v1-RC publication event.
const existingAlternativeById = byId(existing146?.alternative_artifact_registry ?? [], "candidate_id");
for (const artifact of alternativeArtifacts) {
  const prior = existingAlternativeById.get(artifact.candidate_id);
  const semantic = ({ checked_date, access_result, access_check_receipt_id, access_check_reference_id, candidate_state, ...value }) => value;
  artifact.checked_date = prior && digest(semantic(prior)) === digest(semantic(artifact))
    ? prior.checked_date
    : effectiveDate;
  artifact.access_result = prior && digest(semantic(prior)) === digest(semantic(artifact))
    ? prior.access_result ?? "Official artifact or landing page accessed in the bounded research pass"
    : "Official artifact or landing page accessed in the bounded research pass";
  artifact.access_check_reference_id = `146-CANDIDATE-CHECK-${artifact.checked_date}-${artifact.candidate_id}`;
  artifact.candidate_state = "Candidate — checked, not admitted";
}

const alternativeArtifactById = byId(alternativeArtifacts, "candidate_id");
const candidateBinding = (candidateId) => {
  const candidate = alternativeArtifactById.get(candidateId) ?? canonicalSourceById.get(candidateId);
  if (!candidate) throw new Error(`Cannot bind candidate ${candidateId}: no Phase 146 alternative or canonical source record resolves.`);
  return {
    candidate_id: candidateId,
    candidate_kind: alternativeArtifactById.has(candidateId) ? "Phase 146 alternative" : "canonical source",
    semantic_digest: digest(candidate),
  };
};
const alternativesByMission = {
  "121-MISSION-004": ["146-ALT-GAO-F15EX-2025", "146-ALT-NIST-MEP-AMPHENOL-2025", "146-ALT-NIST-MEP-FY2024-RESULTS"],
  "121-MISSION-012": ["146-ALT-DOE-FY24-PERFORMANCE", "146-ALT-NSF-FY25-PERFORMANCE", "146-ALT-NSF-NAIRR-TWO-YEAR"],
  "121-MISSION-013": ["146-ALT-BTS-ASQP-2026", "146-ALT-BTS-TD40-2026", "146-ALT-BTS-TRANSTATS-ONTIME", "146-ALT-BTS-T100"],
  "121-MISSION-016": ["146-ALT-BTS-ASQP-2026", "146-ALT-BTS-TD40-2026", "146-ALT-BTS-TRANSTATS-ONTIME", "146-ALT-BTS-T100", "146-ALT-FAA-GA-SAFETY-2025", "146-ALT-NTSB-AVIATION-STATS"],
  "121-MISSION-020": ["146-ALT-PHOENIX-TSMC-WASTEWATER-2026", "146-ALT-TSMC-SEC-20F-2025"],
  "121-MISSION-025": ["146-ALT-USGS-MCS-2026", "146-ALT-USGS-MCS-DATA-2026"],
  "121-MISSION-032": ["146-ALT-GAO-CDM-2025", "146-ALT-GAO-CYBER-METRICS-2024", "146-ALT-GAO-INCIDENT-RESPONSE-2024"],
  "121-MISSION-036": ["146-ALT-DOE-FY24-PERFORMANCE", "146-ALT-NSF-SE-INDICATORS-2026"],
  "121-MISSION-049": ["146-ALT-CPUC-AV-QUARTERLY-2026", "146-ALT-NHTSA-SGO-2026"],
  "121-MISSION-052": ["146-ALT-CPUC-AV-QUARTERLY-2026", "146-ALT-NHTSA-SGO-2026", "146-ALT-FTA-NTD-2026"],
  "121-MISSION-060": ["146-ALT-NIST-QC-METRICS-2024", "146-ALT-DARPA-QUANTUM-BENCHMARKING", "146-ALT-DARPA-QBI"],
  "121-MISSION-064": ["146-ALT-FAA-SPACE-LICENSES", "146-ALT-FAA-SPACE-NUMBERS", "146-ALT-FAA-SPACE-FORECAST-2026", "146-ALT-GAO-NASA-MAJOR-PROJECTS-2026"],
};

// Phase 145 — the journal is complete as an operating surface. Future decisions remain time-gated.
const outcomesWatchId = "briefing-outcomes-watch-001-what-actually-changed";
const evidenceCycleDigestId = "briefing-evidence-cycle-001-operating-baseline";
const proofByCycleItem = byId(propagationContract.cycle_decision_proofs ?? [], "cycle_item_id");
const namedFilesByCycleItem = {
  "60-CYCLE-SPACE-COAST-SLF-LICENCE": ["61-PROJECT-SPACE-COAST-AUTHORITY"],
  "60-CYCLE-ARIZONA-WASTEWATER": ["61-PROJECT-TSMC-ARIZONA"],
  "60-CYCLE-LOUDOUN-STANDARDS": ["61-PROJECT-NOVA-LARGE-LOAD"],
};
const cycleOperations = cycle.records.map((record, index) => {
  const proof = proofByCycleItem.get(record.cycle_item_id);
  const canonicalDossierIds = proof?.canonical_dossier_ids ?? unique([
    ...(record.canonical_dossier_ids ?? []),
    outcomesWatchId,
    evidenceCycleDigestId,
  ]);
  const readerPathwayIds = proof?.reader_pathway_ids ?? record.reader_pathway_ids ?? [];
  const dependencyMapIds = proof?.dependency_map_ids ?? record.dependency_map_ids ?? [];
  const localSystemIds = proof?.local_system_ids ?? record.local_system_ids ?? [];
  const namedFileIds = proof?.named_file_ids ?? namedFilesByCycleItem[record.cycle_item_id] ?? [];
  return {
    operation_id: `145-GATE-${String(index + 1).padStart(3, "0")}`,
    cycle_item_id: record.cycle_item_id,
    slug: slugify(record.cycle_item_id.replace(/^60-CYCLE-/, "")),
    title: record.target,
    operation_kind: "Phase 60 evidence gate",
    lawful_date: record.scheduled_check_date,
    time_gated: record.scheduled_check_date > effectiveDate,
    decision_status: record.decision_status,
    decision_date: record.decision_date,
    receipt_id: record.receipt_id,
    source_checked_date: record.source_checked_date ?? null,
    receipt_type: record.receipt_type ?? null,
    bounded_result: proof?.bounded_result ?? null,
    next_check_date: proof?.next_check_date ?? record.next_check_date ?? null,
    exact_next_artifact: record.exact_next_artifact,
    source_ids: proof?.source_id ? [proof.source_id] : record.source_ids,
    underlying_signal_id: proof?.signal_id ?? record.underlying_signal_id,
    propagation_contract_id: propagationContract.contract_id,
    propagation_proof_id: proof?.proof_id ?? null,
    signal_decision: proof?.signal_decision ?? null,
    canonical_dossier_ids: canonicalDossierIds,
    outcomes_watch_id: outcomesWatchId,
    evidence_cycle_digest_id: evidenceCycleDigestId,
    reader_pathway_ids: readerPathwayIds,
    dependency_map_ids: dependencyMapIds,
    local_system_ids: localSystemIds,
    named_file_ids: namedFileIds,
    update_id: proof?.update_id ?? null,
    required_sequence: propagationContract.required_sequence,
    propagation_targets: unique([
      ...canonicalDossierIds,
      ...readerPathwayIds,
      ...dependencyMapIds,
      ...localSystemIds,
      ...namedFileIds,
      proof?.update_id,
    ]),
    preparation_state: record.decision_date
      ? `Completed upstream — ${proof?.propagation_status ?? record.propagation_status ?? "propagation state not recorded"}`
      : "Decision and complete typed propagation contract assembled — operation not yet lawful",
    stop_rule: record.decision_date
      ? "Preserve the dated upstream receipt and exact Phase 60 propagation proof; do not rewrite the historical decision."
      : `Do not operate, date, receipt, or populate the signal decision/update proof before ${record.scheduled_check_date}. A No Material Change, bounded blocker, or contract-compliant reschedule remains a valid result.`,
    route: `/review/${release}/${sectionByPhase[145]}/${slugify(record.cycle_item_id.replace(/^60-CYCLE-/, ""))}/`,
  };
});

const companionProjectIds = ["61-PROJECT-TORONTO-24-254930", "61-PROJECT-SPACE-COAST-AUTHORITY"];
const projectById = byId(projects.records, "file_id");
const existingOperationById = byId(existing145?.gate_operations ?? [], "operation_id");
const operationTerminalStates = new Set(["material_change", "no_material_change", "blocked_with_public_receipt", "rescheduled_with_watch_note"]);
const companionScopePayload = (record) => ({
  operation_id: record.operation_id,
  phase_61_file_id: record.phase_61_file_id,
  lawful_date: record.lawful_date,
  exact_next_artifact: record.exact_next_artifact,
  source_ids: [...record.source_ids].sort(),
  underlying_signal_ids: [...record.underlying_signal_ids].sort(),
  canonical_dossier_ids: [...record.canonical_dossier_ids].sort(),
  reader_pathway_ids: [...record.reader_pathway_ids].sort(),
  dependency_map_ids: [...record.dependency_map_ids].sort(),
  local_system_ids: [...record.local_system_ids].sort(),
  named_file_ids: [...record.named_file_ids].sort(),
});
const activeCompanionRechecks = companionProjectIds.map((fileId) => {
  const record = projectById.get(fileId);
  if (!record) throw new Error(`Missing Phase 61 companion file ${fileId}.`);
  const slug = slugify(fileId.replace(/^61-/, ""));
  const operationId = `145-RECHECK-${slug.toUpperCase()}-${record.next_check_date}`;
  const canonicalDossierIds = unique([...(record.canonical_dossier_ids ?? []), outcomesWatchId, evidenceCycleDigestId]);
  const readerPathwayIds = record.reader_pathway_ids ?? [];
  const dependencyMapIds = record.dependency_map_ids ?? [];
  const localSystemIds = record.local_system_ids ?? [];
  const namedFileIds = [fileId];
  const operationScopeDigest = digest(companionScopePayload({ operation_id: operationId, phase_61_file_id: fileId, lawful_date: record.next_check_date, exact_next_artifact: record.exact_next_artifact, source_ids: record.source_ids, underlying_signal_ids: record.signal_ids, canonical_dossier_ids: canonicalDossierIds, reader_pathway_ids: readerPathwayIds, dependency_map_ids: dependencyMapIds, local_system_ids: localSystemIds, named_file_ids: namedFileIds }));
  const prior = existingOperationById.get(operationId);
  const preserveDecision = operationTerminalStates.has(prior?.decision_status)
    && prior?.operation_scope_digest === operationScopeDigest
    && prior?.decision_date >= record.next_check_date
    && hasNonFutureReceipt(prior?.decision_date, prior?.receipt_id)
    && prior?.source_checked_date >= record.next_check_date
    && prior?.source_checked_date <= effectiveDate
    && Boolean(prior?.receipt_type && prior?.reviewer_role && prior?.rationale && prior?.bounded_result)
    && Boolean(prior?.propagation_proof_id && prior?.signal_decision && prior?.update_id);
  return {
    operation_id: operationId,
    cycle_item_id: null,
    phase_61_file_id: fileId,
    slug,
    title: record.title,
    operation_kind: "Independent Phase 61 project-file recheck",
    lawful_date: record.next_check_date,
    time_gated: record.next_check_date > effectiveDate,
    operation_scope_digest: operationScopeDigest,
    decision_status: preserveDecision ? prior.decision_status : "scheduled",
    decision_date: preserveDecision ? prior.decision_date : null,
    receipt_id: preserveDecision ? prior.receipt_id : null,
    source_checked_date: preserveDecision ? prior.source_checked_date : null,
    receipt_type: preserveDecision ? prior.receipt_type : null,
    reviewer_role: preserveDecision ? prior.reviewer_role : null,
    rationale: preserveDecision ? prior.rationale : null,
    bounded_result: preserveDecision ? prior.bounded_result : null,
    next_check_date: preserveDecision ? prior.next_check_date ?? null : record.next_check_date,
    exact_next_artifact: record.exact_next_artifact,
    source_ids: record.source_ids,
    underlying_signal_ids: record.signal_ids,
    propagation_contract_id: propagationContract.contract_id,
    propagation_proof_id: preserveDecision ? prior.propagation_proof_id : null,
    signal_decision: preserveDecision ? prior.signal_decision : null,
    canonical_dossier_ids: canonicalDossierIds,
    outcomes_watch_id: outcomesWatchId,
    evidence_cycle_digest_id: evidenceCycleDigestId,
    reader_pathway_ids: readerPathwayIds,
    dependency_map_ids: dependencyMapIds,
    local_system_ids: localSystemIds,
    named_file_ids: namedFileIds,
    update_id: preserveDecision ? prior.update_id : null,
    required_sequence: propagationContract.required_sequence,
    propagation_targets: unique([
      ...canonicalDossierIds,
      ...readerPathwayIds,
      ...dependencyMapIds,
      ...localSystemIds,
      fileId,
      preserveDecision ? prior.update_id : null,
    ]),
    preparation_state: preserveDecision ? "Completed — independently receipted and propagated" : "Decision and propagation contract assembled — operation not yet lawful",
    prior_terminal_state_not_preserved: operationTerminalStates.has(prior?.decision_status) && !preserveDecision,
    stop_rule: preserveDecision ? "Preserve the dated receipt and propagation proof unless the bound operation scope changes." : `${record.stop_rule} Keep this recheck independent from any same-date Phase 60 gate.`,
    route: `/review/${release}/${sectionByPhase[145]}/${slug}-${record.next_check_date}/`,
  };
});

const activeCompanionIds = new Set(activeCompanionRechecks.map((record) => record.operation_id));
const historicalCompanionCandidates = (existing145?.gate_operations ?? []).filter((record) => record.operation_kind === "Independent Phase 61 project-file recheck" && operationTerminalStates.has(record.decision_status) && !activeCompanionIds.has(record.operation_id));
const invalidHistoricalCompanions = historicalCompanionCandidates.filter((record) => (
  record.operation_scope_digest !== digest(companionScopePayload(record))
  || record.decision_date < record.lawful_date
  || record.decision_date > effectiveDate
  || record.source_checked_date < record.lawful_date
  || record.source_checked_date > effectiveDate
  || !record.receipt_id
  || !record.receipt_type
  || !record.reviewer_role
  || !record.rationale
  || !record.bounded_result
  || !record.propagation_proof_id
  || !record.signal_decision
  || !record.update_id
));
if (invalidHistoricalCompanions.length) {
  throw new Error(`Refusing to discard or rewrite ${invalidHistoricalCompanions.length} invalid historical Phase 61 recheck receipt(s): ${invalidHistoricalCompanions.map((record) => record.operation_id).join(", ")}.`);
}
const companionRechecks = [
  ...historicalCompanionCandidates.map((record) => ({ ...structuredClone(record), time_gated: false })),
  ...activeCompanionRechecks,
];

const gateOperations = [...cycleOperations, ...companionRechecks];
const operationHasCompletePropagation = (record) => {
  const expectedTargets = unique([
    ...record.canonical_dossier_ids,
    ...record.reader_pathway_ids,
    ...record.dependency_map_ids,
    ...record.local_system_ids,
    ...record.named_file_ids,
    record.update_id,
  ]);
  return Boolean(record.propagation_proof_id && record.signal_decision && record.update_id && record.bounded_result)
    && Boolean(record.outcomes_watch_id && record.evidence_cycle_digest_id)
    && record.canonical_dossier_ids.includes(record.outcomes_watch_id)
    && record.canonical_dossier_ids.includes(record.evidence_cycle_digest_id)
    && record.source_ids.length > 0
    && record.propagation_targets.length === expectedTargets.length
    && expectedTargets.every((target) => record.propagation_targets.includes(target));
};
const operationHasLawfulTerminalReceipt = (record) => (
  operationTerminalStates.has(record.decision_status)
  && record.decision_date >= record.lawful_date
  && record.decision_date <= effectiveDate
  && record.source_checked_date >= record.lawful_date
  && record.source_checked_date <= effectiveDate
  && Boolean(record.receipt_id && record.receipt_type)
  && operationHasCompletePropagation(record)
  && (record.operation_kind !== "Independent Phase 61 project-file recheck" || Boolean(record.reviewer_role && record.rationale))
);
const futureOperationIntegrityFailures = gateOperations.filter((record) => (
  record.lawful_date > effectiveDate
  && (
    record.decision_status !== "scheduled"
    || record.decision_date !== null
    || record.receipt_id !== null
    || record.source_checked_date !== null
    || record.receipt_type !== null
    || record.propagation_proof_id !== null
    || record.signal_decision !== null
    || record.update_id !== null
    || record.bounded_result !== null
  )
));
const dueOperationIntegrityFailures = gateOperations.filter((record) => (
  record.lawful_date <= effectiveDate
  && !operationHasLawfulTerminalReceipt(record)
));
const predatedOperations = gateOperations.filter((record) => (
  (record.decision_date && record.decision_date < record.lawful_date)
  || (record.source_checked_date && record.source_checked_date < record.lawful_date)
  || (record.lawful_date > effectiveDate && record.decision_date)
));
const calendarGateIntegrityPassed = futureOperationIntegrityFailures.length === 0 && dueOperationIntegrityFailures.length === 0;
const phase145 = makeRegistry(145, "gate_operations", gateOperations, {
  operating_records: gateOperations.length,
  completed_upstream_decisions: gateOperations.filter((record) => record.decision_date).length,
  future_time_gated_operations: gateOperations.filter((record) => record.time_gated).length,
  due_operations_pending: dueOperationIntegrityFailures.length,
  future_operation_integrity_failures: futureOperationIntegrityFailures.length,
  predated_operations: predatedOperations.length,
}, {
  operating_date: programStartDate,
  calendar_contract: "Operate only the due item on or after its America/Edmonton calendar date. Same-date items remain independent decisions and receipts.",
});

// Phase 146 — checked alternative artifacts are additive triage, never automatic evidence admission.
const authorityTerminalStates = new Set(["Closed — exact artifact mapped", "Carried — bounded gap", "Excluded from v1 scope"]);
const existingGapById = byId(existing146?.gap_dispositions ?? [], "disposition_id");
const gapDispositions = p130.gap_maps.map((gap, index) => {
  const candidateIds = alternativesByMission[gap.mission_id] ?? [];
  const slug = gap.slug;
  const dispositionId = `146-DISPOSITION-${String(index + 1).padStart(3, "0")}`;
  const candidateSetDigest = digest({
    gap_map_id: gap.gap_map_id,
    mission_id: gap.mission_id,
    missing_authority_role: gap.missing_authority_role,
    exact_artifact: gap.exact_artifact,
    alternative_candidates: [...candidateIds].sort().map(candidateBinding),
  });
  const prior = existingGapById.get(dispositionId);
  const priorTerminal = authorityTerminalStates.has(prior?.owner_disposition);
  const preserveTerminal = priorTerminal
    && prior?.candidate_set_digest === candidateSetDigest
    && hasNonFutureReceipt(prior?.disposition_date, prior?.disposition_receipt_id)
    && Boolean(prior?.reviewer_role && prior?.rationale);
  return {
    disposition_id: dispositionId,
    gap_map_id: gap.gap_map_id,
    mission_id: gap.mission_id,
    topic_id: gap.topic_id,
    slug,
    title: gap.title,
    priority_docket: gap.priority_docket,
    missing_authority_role: gap.missing_authority_role,
    inherited_source_ids: gap.current_source_ids,
    alternative_candidate_ids: candidateIds,
    alternative_artifacts: candidateIds.map((id) => alternativeArtifactById.get(id)),
    candidate_set_digest: candidateSetDigest,
    search_checked_date: prior?.candidate_set_digest === candidateSetDigest ? prior.search_checked_date : effectiveDate,
    search_scope: "Official federal, state, provincial, municipal, regulator, oversight, and public-data publishers plausibly holding the named artifact or an independently useful alternative.",
    disposition_state: preserveTerminal ? prior.disposition_state ?? prior.owner_disposition : "Alternative shelf complete — owner disposition pending",
    owner_disposition: preserveTerminal ? prior.owner_disposition : null,
    disposition_date: preserveTerminal ? prior.disposition_date : null,
    disposition_receipt_id: preserveTerminal ? prior.disposition_receipt_id : null,
    reviewer_role: preserveTerminal ? prior.reviewer_role ?? null : null,
    rationale: preserveTerminal ? prior.rationale ?? null : null,
    prior_terminal_state_not_preserved: priorTerminal && !preserveTerminal,
    allowed_terminal_states: ["Closed — exact artifact mapped", "Carried — bounded gap", "Excluded from v1 scope"],
    bounded_result: candidateIds.length
      ? "One or more official alternatives are mapped for exact requirement review; none is treated as mission-complete by discovery alone."
      : "No alternative artifact is mapped in this bounded pass; this is not a finding of nonexistence.",
    next_action: "An authorized reviewer must test each candidate against the mission's entity, authority, period, method, and denominator requirements, then issue a dated close, carry, or exclusion receipt.",
    route: `/review/${release}/${sectionByPhase[146]}/${slug}/`,
  };
});

const phase146 = makeRegistry(146, "gap_dispositions", gapDispositions, {
  mission_gaps: gapDispositions.length,
  priority_gaps: gapDispositions.filter((record) => record.priority_docket).length,
  unique_alternative_artifacts_checked: alternativeArtifacts.length,
  owner_dispositions_pending: gapDispositions.filter((record) => !record.owner_disposition).length,
  gaps_closed_exact_artifact_mapped: gapDispositions.filter((record) => record.owner_disposition === "Closed — exact artifact mapped").length,
  stale_terminal_dispositions_requiring_revalidation: gapDispositions.filter((record) => record.prior_terminal_state_not_preserved).length,
}, {
  alternative_artifact_registry: alternativeArtifacts,
  terminal_contract: "A gap is terminal only through a dated owner receipt recording Closed — exact artifact mapped, Carried — bounded gap, or Excluded from v1 scope.",
});

// Phase 147 — a richer live decision layer that leaves the Phase 133–134 historical snapshot unchanged.
const alternativeIdsForMission = (missionId) => alternativesByMission[missionId] ?? [];
const requirementTerminalStates = new Set(["Accepted", "Rejected", "Inadmissible", "Bounded gap"]);
const missionTerminalStates = new Set(["Answered", "Bounded conclusion", "No admissible answer", "Carried gap"]);
const existingAdjudicationById = byId(existing147?.adjudication_records ?? [], "adjudication_record_id");
const requirementPackets = p133.adjudication_items.map((item, index) => {
  const slug = `${slugify(item.mission_id)}-requirement-${String(index + 1).padStart(2, "0")}`;
  const adjudicationRecordId = `147-REQUIREMENT-${String(index + 1).padStart(3, "0")}`;
  const candidateIds = unique([...(item.candidate_source_ids ?? []), ...alternativeIdsForMission(item.mission_id)]).sort();
  const candidateSetDigest = digest({
    mission_id: item.mission_id,
    requirement: item.requirement,
    acceptance_test: item.acceptance_test,
    rejection_test: item.rejection_test,
    candidate_bindings: candidateIds.map(candidateBinding),
  });
  const prior = existingAdjudicationById.get(adjudicationRecordId);
  const priorTerminal = requirementTerminalStates.has(prior?.decision_state);
  const priorSourceSetValid = [...(prior?.accepted_source_ids ?? []), ...(prior?.rejected_source_ids ?? [])].every((id) => candidateIds.includes(id));
  const preserveTerminal = priorTerminal
    && prior?.candidate_set_digest === candidateSetDigest
    && priorSourceSetValid
    && hasNonFutureReceipt(prior?.decision_date, prior?.decision_receipt_id)
    && Boolean(prior?.reviewer_role && prior?.rationale);
  return {
    adjudication_record_id: adjudicationRecordId,
    record_kind: "requirement decision",
    upstream_adjudication_id: item.adjudication_id,
    mission_id: item.mission_id,
    slug,
    title: `${item.mission_id}: ${item.requirement}`,
    requirement: item.requirement,
    historical_candidate_source_ids: item.candidate_source_ids,
    alternative_candidate_ids: alternativeIdsForMission(item.mission_id),
    candidate_set_digest: candidateSetDigest,
    acceptance_test: item.acceptance_test,
    rejection_test: item.rejection_test,
    decision_state: preserveTerminal ? prior.decision_state : item.decision_state,
    accepted_source_ids: preserveTerminal ? prior.accepted_source_ids ?? [] : item.accepted_source_ids,
    rejected_source_ids: preserveTerminal ? prior.rejected_source_ids ?? [] : item.rejected_source_ids,
    decision_date: preserveTerminal ? prior.decision_date : item.decision_date,
    decision_receipt_id: preserveTerminal ? prior.decision_receipt_id : item.decision_receipt_id,
    reviewer_role: preserveTerminal ? prior.reviewer_role : null,
    rationale: preserveTerminal ? prior.rationale : null,
    bounded_search_scope: preserveTerminal ? prior.bounded_search_scope ?? null : null,
    limitation_statement: preserveTerminal ? prior.limitation_statement ?? null : null,
    reopen_trigger: preserveTerminal ? prior.reopen_trigger ?? null : null,
    prior_terminal_state_not_preserved: priorTerminal && !preserveTerminal,
    candidate_set_digest_required: true,
    terminal_states: ["Accepted", "Rejected", "Inadmissible", "Bounded gap"],
    next_action: item.next_action,
    route: `/review/${release}/${sectionByPhase[147]}/${slug}/`,
  };
});

const missionPackets = p134.mission_decisions.map((item, index) => {
  const slug = `mission-${item.slug}`;
  const adjudicationRecordId = `147-MISSION-${String(index + 1).padStart(3, "0")}`;
  const candidateSetDigest = digest({
    mission_id: item.mission_id,
    question: item.question,
    requirements: [...(item.requirement_adjudication_ids ?? [])].sort(),
    requirement_candidate_set_digests: requirementPackets.filter((record) => record.mission_id === item.mission_id).map((record) => record.candidate_set_digest).sort(),
    alternatives: [...alternativeIdsForMission(item.mission_id)].sort().map(candidateBinding),
  });
  const prior = existingAdjudicationById.get(adjudicationRecordId);
  const priorTerminal = missionTerminalStates.has(prior?.decision_state);
  const preserveTerminal = priorTerminal
    && prior?.candidate_set_digest === candidateSetDigest
    && hasNonFutureReceipt(prior?.decision_date, prior?.decision_receipt_id)
    && Boolean(prior?.reviewer_role && prior?.rationale);
  return {
    adjudication_record_id: adjudicationRecordId,
    record_kind: "mission decision",
    upstream_mission_decision_id: item.mission_decision_id,
    mission_id: item.mission_id,
    slug,
    title: item.title,
    question: item.question,
    requirement_adjudication_ids: item.requirement_adjudication_ids,
    requirements_total: item.requirements_total,
    requirements_decided: item.requirements_decided,
    alternative_candidate_ids: alternativeIdsForMission(item.mission_id),
    candidate_set_digest: candidateSetDigest,
    decision_state: preserveTerminal ? prior.decision_state : item.answer === null ? "Pending owner adjudication" : "Answered",
    answer: preserveTerminal ? prior.answer ?? null : item.answer,
    bounded_conclusion: preserveTerminal ? prior.bounded_conclusion ?? null : null,
    decision_date: preserveTerminal ? prior.decision_date : item.decision_date,
    decision_receipt_id: preserveTerminal ? prior.decision_receipt_id : item.decision_receipt_id,
    reviewer_role: preserveTerminal ? prior.reviewer_role : null,
    rationale: preserveTerminal ? prior.rationale : null,
    limitation_statement: preserveTerminal ? prior.limitation_statement ?? null : null,
    reopen_trigger: preserveTerminal ? prior.reopen_trigger ?? null : null,
    prior_terminal_state_not_preserved: priorTerminal && !preserveTerminal,
    terminal_states: ["Answered", "Bounded conclusion", "No admissible answer", "Carried gap"],
    next_action: item.next_action,
    route: `/review/${release}/${sectionByPhase[147]}/${slug}/`,
  };
});

const adjudicationRecords = [...requirementPackets, ...missionPackets];
const phase147 = makeRegistry(147, "adjudication_records", adjudicationRecords, {
  requirement_packets: requirementPackets.length,
  mission_packets: missionPackets.length,
  total_decision_packets: adjudicationRecords.length,
  terminal_authorized_decisions: adjudicationRecords.filter((record) => !String(record.decision_state).startsWith("Pending")).length,
  owner_decisions_pending: adjudicationRecords.filter((record) => String(record.decision_state).startsWith("Pending")).length,
  stale_terminal_decisions_requiring_revalidation: adjudicationRecords.filter((record) => record.prior_terminal_state_not_preserved).length,
}, {
  decision_contract: {
    requirement_terminal_states: ["Accepted", "Rejected", "Inadmissible", "Bounded gap"],
    mission_terminal_states: ["Answered", "Bounded conclusion", "No admissible answer", "Carried gap"],
    receipt_rule: "Every terminal state requires a real non-future decision date, reviewer role, rationale, receipt, and candidate-set integrity check.",
    null_answer_rule: "A mission may retain answer=null only when an independently stored terminal bounded state, rationale, and owner receipt are present.",
  },
});

// Phase 148 — the baseline review can be completed now without claiming a governed state change.
let changefeedReviews = p135.readiness_records.map((record, index) => {
  const slug = `${record.entity_kind}-${record.slug}`;
  return {
    changefeed_id: `148-REVIEW-${String(index + 1).padStart(3, "0")}`,
    readiness_id: record.readiness_id,
    entity_kind: record.entity_kind,
    entity_id: record.entity_id,
    slug,
    title: record.title,
    review_date: programStartDate,
    inherited_state: record.inherited_state,
    signal_ids: record.signal_ids,
    source_ids: record.source_ids,
    evidence_identity: `${record.signal_ids.length} signal link(s) and ${record.source_ids.length} source link(s) remain attached to the canonical ${record.entity_kind} identity.`,
    review_result: "Baseline recheck complete — no governed state change",
    material_change: false,
    stage_change: null,
    unresolved_boundary: record.blocking_boundary,
    next_artifact: record.entity_kind === "project"
      ? p136.project_chronicles.find((item) => item.atlas_project_id === record.entity_id)?.exact_next_artifact ?? record.blocking_boundary
      : p137.place_ledgers.find((item) => item.atlas_place_id === record.entity_id)?.exact_next_artifact ?? record.blocking_boundary,
    stop_rule: "Source volume, a new candidate, or elapsed time cannot advance an entity. A change requires a dated artifact supporting the exact canonical identity and conversion stage.",
    route: `/review/${release}/${sectionByPhase[148]}/${slug}/`,
  };
});
changefeedReviews = preservePublishedRecords({ existingRegistry: existing148, key: "changefeed_reviews", records: changefeedReviews, idKey: "changefeed_id" });

const phase148 = makeRegistry(148, "changefeed_reviews", changefeedReviews, {
  atlas_reviews: changefeedReviews.length,
  project_reviews: changefeedReviews.filter((record) => record.entity_kind === "project").length,
  place_reviews: changefeedReviews.filter((record) => record.entity_kind === "place").length,
  material_changes: 0,
  synthetic_stage_changes: 0,
}, publicationSnapshotMetadata(changefeedReviews));

// Phase 149 — review every eligibility record and name the best pilots without transferring legacy values.
const pilotIds = new Set(["138-ELIGIBILITY-012", "138-ELIGIBILITY-014", "138-ELIGIBILITY-016"]);
const existingLongitudinalById = byId(existing149?.longitudinal_reviews ?? [], "lab_review_id");
const longitudinalReviews = p138.eligibility_records.map((record, index) => {
  const labReviewId = `149-REVIEW-${String(index + 1).padStart(3, "0")}`;
  const seriesDefinitionDigest = digest({
    eligibility_id: record.eligibility_id,
    governed_file_id: record.governed_file_id,
    legacy_panel_id: record.legacy_panel_id,
    measurement_specification_ids: record.measurement_specification_ids,
    series_admission_docket_id: record.series_admission_docket_id,
    tests: record.tests,
  });
  const prior = existingLongitudinalById.get(labReviewId);
  const preserveAdmission = prior?.compatibility_decision === "Admitted"
    && prior?.series_definition_digest === seriesDefinitionDigest
    && Boolean(prior?.admitted_series_id && prior?.reviewer_role && prior?.rationale)
    && Number.isInteger(prior?.observations_transferred)
    && prior.observations_transferred > 0
    && hasNonFutureReceipt(prior?.decision_date, prior?.decision_receipt_id);
  return {
    lab_review_id: labReviewId,
    eligibility_id: record.eligibility_id,
    entity_kind: record.entity_kind,
    entity_id: record.entity_id,
    slug: record.slug,
    title: record.title,
    review_date: prior?.series_definition_digest === seriesDefinitionDigest ? prior.review_date : effectiveDate,
    legacy_panel_id: record.legacy_panel_id,
    legacy_observation_count: record.legacy_observation_count,
    governed_file_id: record.governed_file_id,
    measurement_specification_ids: record.measurement_specification_ids,
    series_admission_docket_id: record.series_admission_docket_id,
    tests: record.tests,
    pilot_priority: pilotIds.has(record.eligibility_id),
    pilot_reason: pilotIds.has(record.eligibility_id)
      ? `${record.title} has ${record.legacy_observation_count} legacy observations and an exact Phase 138 identity join, making it useful for a full compatibility audit without implying transfer.`
      : null,
    series_definition_digest: seriesDefinitionDigest,
    compatibility_decision: preserveAdmission ? prior.compatibility_decision : "Not admitted",
    admitted_series_id: preserveAdmission ? prior.admitted_series_id : null,
    observations_transferred: preserveAdmission ? prior.observations_transferred : 0,
    decision_date: preserveAdmission ? prior.decision_date : null,
    decision_receipt_id: preserveAdmission ? prior.decision_receipt_id : null,
    reviewer_role: preserveAdmission ? prior.reviewer_role : null,
    rationale: preserveAdmission ? prior.rationale : null,
    prior_admission_not_preserved: prior?.compatibility_decision === "Admitted" && !preserveAdmission,
    boundary_result: record.next_record,
    next_action: preserveAdmission
      ? prior.next_action ?? "Maintain the admitted series under its revision, break, and re-review contract."
      : pilotIds.has(record.eligibility_id)
        ? "Apply the complete Phase 69–70 specification, intake, dual-review, lineage, break, and admission contract to the original artifacts; stop if any identity, period, measure, or denominator test fails."
        : "Retain the existing no-series boundary until a repeated compatible source payload is available.",
    route: `/review/${release}/${sectionByPhase[149]}/${record.slug}/`,
  };
});

const noSeriesReviewedIds = longitudinalReviews.map((record) => record.eligibility_id);
const noSeriesBoundaryDigest = digest(longitudinalReviews.map((record) => ({
  eligibility_id: record.eligibility_id,
  series_definition_digest: record.series_definition_digest,
  compatibility_decision: record.compatibility_decision,
  admitted_series_id: record.admitted_series_id,
  observations_transferred: record.observations_transferred,
})));
const priorNoSeriesBoundary = existing149?.no_series_launch_boundary;
const preserveNoSeriesBoundary = priorNoSeriesBoundary?.owner_accepted === true
  && priorNoSeriesBoundary?.boundary_scope_digest === noSeriesBoundaryDigest
  && priorNoSeriesBoundary?.decision_date >= programStartDate
  && hasNonFutureReceipt(priorNoSeriesBoundary?.decision_date, priorNoSeriesBoundary?.decision_receipt_id)
  && Boolean(priorNoSeriesBoundary?.reviewer_role && priorNoSeriesBoundary?.rationale)
  && longitudinalReviews.every((record) => record.compatibility_decision !== "Admitted");
const admittedSeriesCount = longitudinalReviews.filter((record) => record.compatibility_decision === "Admitted").length;
const transferredObservationCount = longitudinalReviews.reduce((sum, record) => sum + record.observations_transferred, 0);

const phase149 = makeRegistry(149, "longitudinal_reviews", longitudinalReviews, {
  eligibility_reviews: longitudinalReviews.length,
  pilot_reviews_ready: longitudinalReviews.filter((record) => record.pilot_priority).length,
  admitted_series: admittedSeriesCount,
  observations_transferred: transferredObservationCount,
  no_series_boundary_owner_acceptance: preserveNoSeriesBoundary ? 1 : 0,
  stale_admissions_requiring_revalidation: longitudinalReviews.filter((record) => record.prior_admission_not_preserved).length,
}, {
  no_series_launch_boundary: {
    state: preserveNoSeriesBoundary ? priorNoSeriesBoundary.state ?? "Accepted by owner" : "Prepared — owner acceptance pending",
    proposed_scope: "v1 may launch without longitudinal claims if every one of the 39 reviews is disclosed, every trend/outcome/comparison surface states zero admitted series, and a dated owner receipt accepts that boundary.",
    reviewed_eligibility_ids: noSeriesReviewedIds,
    boundary_scope_digest: noSeriesBoundaryDigest,
    owner_accepted: preserveNoSeriesBoundary,
    decision_date: preserveNoSeriesBoundary ? priorNoSeriesBoundary.decision_date : null,
    decision_receipt_id: preserveNoSeriesBoundary ? priorNoSeriesBoundary.decision_receipt_id : null,
    reviewer_role: preserveNoSeriesBoundary ? priorNoSeriesBoundary.reviewer_role ?? null : null,
    rationale: preserveNoSeriesBoundary ? priorNoSeriesBoundary.rationale ?? null : null,
    prior_acceptance_not_preserved: priorNoSeriesBoundary?.owner_accepted === true && !preserveNoSeriesBoundary,
  },
});

// Phase 150 — preserve comparison integrity while making the decision contract more useful.
let comparisonPassports = p139.comparison_reviews.map((record, index) => ({
  passport_id: `150-PASSPORT-${String(index + 1).padStart(3, "0")}`,
  upstream_rereview_id: record.rereview_id,
  dossier_id: record.dossier_id,
  synthesis_id: record.synthesis_id,
  upstream_route: record.route,
  project_chronicle_ids: record.project_chronicle_ids,
  place_ledger_ids: record.place_ledger_ids,
  longitudinal_eligibility_ids: record.longitudinal_eligibility_ids,
  slug: record.slug,
  title: record.title,
  review_date: programStartDate,
  verdict: record.rereview_verdict,
  verdict_changed: false,
  compatibility_dimensions: {
    identity: record.identity_test,
    conversion_stage: record.stage_test,
    observation_period: record.period_test,
    denominator_and_method: record.denominator_test,
    geography: "Exact place and project joins are retained; geographic adjacency is not treated as equivalence.",
  },
  comparable_claim: record.what_is_comparable,
  prohibited_comparison: record.what_must_not_be_compared,
  decisive_next_evidence: record.decisive_next_evidence,
  score: null,
  rank: null,
  route: `/review/${release}/${sectionByPhase[150]}/${record.slug}/`,
}));
comparisonPassports = preservePublishedRecords({ existingRegistry: existing150, key: "comparison_passports", records: comparisonPassports, idKey: "passport_id" });

const phase150 = makeRegistry(150, "comparison_passports", comparisonPassports, {
  comparison_passports: comparisonPassports.length,
  context_only: comparisonPassports.filter((record) => record.verdict === "Context only").length,
  verdict_changes: 0,
  scores_created: 0,
  ranks_created: 0,
}, publicationSnapshotMetadata(comparisonPassports));

// Phase 151 — complete the baseline packets now; keep the four future editorial decisions scheduled.
const septemberReviewDates = ["2026-09-06", "2026-09-13", "2026-09-20", "2026-09-27"];
const deskWindowTerminalStates = new Set(["Material change", "No material change", "Bounded blocker", "Rescheduled"]);
const existingDeskById = byId(existing151?.desk_review_ledgers ?? [], "desk_review_id");
let deskBaselines = p140.topic_desks.map((desk, index) => {
  const gapRecords = gapDispositions.filter((record) => record.topic_id === desk.topic_id);
  const missionIdSet = new Set(desk.mission_ids);
  const evidenceAnnotations = p125.evidence_annotations.filter((annotation) => annotation.mission_ids.some((missionId) => missionIdSet.has(missionId)));
  const projectChronicles = desk.project_chronicle_ids.map((id) => p136.project_chronicles.find((record) => record.chronicle_id === id)).filter(Boolean);
  const placeLedgers = desk.place_ledger_ids.map((id) => p137.place_ledgers.find((record) => record.ledger_id === id)).filter(Boolean);
  const passports = desk.comparison_rereview_ids.map((id) => comparisonPassports.find((record) => record.upstream_rereview_id === id)).filter(Boolean);
  const directEvidenceSourceIds = unique(evidenceAnnotations.flatMap((annotation) => annotation.source_ids));
  const contextSourceIds = unique([...projectChronicles.flatMap((record) => record.source_ids), ...placeLedgers.flatMap((record) => record.source_ids)]);
  const deskReviewId = `151-DESK-${String(index + 1).padStart(3, "0")}`;
  return {
    desk_review_id: deskReviewId,
    desk_id: desk.desk_id,
    topic_id: desk.topic_id,
    slug: desk.slug,
    title: desk.title.replace(/ intelligence desk$/i, " desk review ledger"),
    baseline_packet_date: programStartDate,
    baseline_packet_state: "Complete — future editorial decisions remain scheduled",
    current_read: desk.current_read,
    contested_reading: desk.contested_reading,
    mission_ids: desk.mission_ids,
    evidence_annotation_ids: evidenceAnnotations.map((annotation) => annotation.note_id),
    signal_ids: unique(evidenceAnnotations.map((annotation) => annotation.signal_id)),
    direct_evidence_source_ids: directEvidenceSourceIds,
    context_source_ids: contextSourceIds,
    source_ids: unique([...directEvidenceSourceIds, ...contextSourceIds]),
    project_chronicle_ids: projectChronicles.map((record) => record.chronicle_id),
    place_ledger_ids: placeLedgers.map((record) => record.ledger_id),
    comparison_passport_ids: passports.map((record) => record.passport_id),
    authority_gap_disposition_ids: gapRecords.map((record) => record.disposition_id),
    alternative_candidate_ids: unique(gapRecords.flatMap((record) => record.alternative_candidate_ids)),
    promotion_rule: "Promote a change only when its exact source, authority role, checked date, claim boundary, and affected records are recorded.",
    route: `/review/${release}/${sectionByPhase[151]}/${desk.slug}/`,
  };
});

if (publishedSnapshotLocked && existing151?.publication_snapshot_version === publicationSnapshotVersion) {
  const priorById = byId(existing151.desk_review_ledgers, "desk_review_id");
  deskBaselines = deskBaselines.map((generated) => {
    const prior = priorById.get(generated.desk_review_id);
    if (!prior) return generated;
    const { review_windows: priorWindows, ...priorBaseline } = prior;
    // Phase 151 has no public desk-detail routes, so `makeRegistry` removes
    // the internal route before serialization. Restore the generated route
    // while calculating/preserving the publication snapshot; otherwise the
    // first locked regeneration hashes a different shape from the initial
    // publication and makes an unchanged candidate oscillate between digests.
    const preservedBaseline = { ...structuredClone(priorBaseline), route: generated.route };
    if (!revisionMode) return preservedBaseline;
    if (digest(preservedBaseline) === digest(generated)) return generated;
    const revised = {
      ...generated,
      last_revised_date: effectiveDate,
      revision_receipt_id: revisionReceiptId,
      superseded_content_digest: digest(preservedBaseline),
    };
    revised.current_content_digest = digest(generated);
    return revised;
  });
}

const deskReviewLedgers = deskBaselines.map((desk, deskIndex) => {
  const priorWindowById = byId(existingDeskById.get(desk.desk_review_id)?.review_windows ?? [], "window_id");
  const reviewWindows = [];
  for (const [windowIndex, date] of septemberReviewDates.entries()) {
    const windowId = `151-WINDOW-${String(deskIndex + 1).padStart(2, "0")}-${String(windowIndex + 1).padStart(2, "0")}`;
    const expectedScope = date <= effectiveDate ? buildPhase151ReviewScope({
      windowId,
      scheduledDate: date,
      desk,
      phase145Operations: gateOperations,
      phase146Dispositions: gapDispositions,
      phase147Records: adjudicationRecords,
      phase149Reviews: longitudinalReviews,
      priorWindows: reviewWindows,
      canonicalSources: canonicalSourceById,
    }) : null;
    if (expectedScope?.missing_source_ids.length) {
      throw new Error(`Phase 151 window ${windowId} has unresolved canonical source bindings: ${expectedScope.missing_source_ids.join(", ")}.`);
    }
    const prior = priorWindowById.get(windowId);
    const priorMaterialChangeIds = prior?.material_change_ids ?? [];
    const priorMaterialStateIsValid = new Set(priorMaterialChangeIds).size === priorMaterialChangeIds.length
      && (prior?.state !== "Material change" || priorMaterialChangeIds.length > 0)
      && (prior?.state !== "No material change" || priorMaterialChangeIds.length === 0);
    const preserveDecision = deskWindowTerminalStates.has(prior?.state)
      && prior?.review_scope_contract_version === phase151ReviewScopeVersion
      && prior?.review_scope_cutoff_date === date
      && prior?.review_scope_digest === expectedScope?.digest
      && prior?.decision_date >= date
      && hasNonFutureReceipt(prior?.decision_date, prior?.receipt_id)
      && Boolean(prior?.decision && prior?.reviewer_role && prior?.rationale)
      && priorMaterialStateIsValid
      && materialIdsResolve(priorMaterialChangeIds, expectedScope?.material_ids ?? []);
    reviewWindows.push({
      window_id: windowId,
      scheduled_date: date,
      state: preserveDecision ? prior.state : date <= effectiveDate ? "Due — receipt pending" : "Scheduled — no future editorial decision",
      decision: preserveDecision ? prior.decision : null,
      decision_date: preserveDecision ? prior.decision_date : null,
      receipt_id: preserveDecision ? prior.receipt_id : null,
      reviewer_role: preserveDecision ? prior.reviewer_role : null,
      rationale: preserveDecision ? prior.rationale : null,
      material_change_ids: preserveDecision ? prior.material_change_ids ?? [] : [],
      review_scope_contract_version: date <= effectiveDate ? phase151ReviewScopeVersion : null,
      review_scope_cutoff_date: date <= effectiveDate ? date : null,
      review_scope_digest: date <= effectiveDate ? expectedScope.digest : null,
      prior_terminal_state_not_preserved: deskWindowTerminalStates.has(prior?.state) && !preserveDecision,
      allowed_terminal_states: [...deskWindowTerminalStates],
      rule: "Review only evidence, gates, corrections, and governed decisions available on or before this date.",
    });
  }
  return { ...desk, review_windows: reviewWindows };
});

const deskReviewWindows = deskReviewLedgers.flatMap((record) => record.review_windows);
const dueDeskWindowsPending = deskReviewWindows.filter((window) => window.scheduled_date <= effectiveDate && !deskWindowTerminalStates.has(window.state));
const phase151 = makeRegistry(151, "desk_review_ledgers", deskReviewLedgers, {
  desk_baseline_packets: deskReviewLedgers.length,
  planned_review_windows: deskReviewLedgers.length * septemberReviewDates.length,
  completed_review_windows: deskReviewWindows.filter((window) => deskWindowTerminalStates.has(window.state)).length,
  due_review_windows_pending: dueDeskWindowsPending.length,
  future_editorial_decisions: deskReviewWindows.filter((window) => window.scheduled_date > effectiveDate && window.decision === null).length,
  predated_editorial_decisions: deskReviewWindows.filter((window) => window.decision_date && window.decision_date < window.scheduled_date).length,
  stale_window_decisions_requiring_revalidation: deskReviewWindows.filter((window) => window.prior_terminal_state_not_preserved).length,
}, {
  ...publicationSnapshotMetadata(deskReviewLedgers.map(({ review_windows, ...baseline }) => baseline)),
  publication_snapshot_scope: "Desk baseline content and lineage only; dated review windows remain independently operable.",
});

const stakeholderNotes = {
  "advanced-manufacturing": {
    beneficiaries: ["Receiving customers when accepted output becomes dependable", "Workers when qualification pathways lead to stable employment", "Regions when supplier and utility capacity becomes reusable"],
    cost_bearers: ["Workers and suppliers absorbing schedule volatility", "Ratepayers and taxpayers funding enabling infrastructure", "Communities carrying land, water, traffic, and environmental burdens"],
    decision_use: "Test whether an announcement, factory milestone, or delivery establishes dependable accepted production—and identify the missing bridge when it does not.",
  },
  "agriculture-and-bioeconomy": {
    beneficiaries: ["Producers gaining resilient inputs and markets", "Households receiving reliable food and bio-based products", "Land and water systems when measured impacts improve"],
    cost_bearers: ["Farm workers and small producers facing transition risk", "Communities exposed to water, nutrient, odor, and land-use effects", "Public programs underwriting early deployment"],
    decision_use: "Separate biological potential and funded demonstrations from repeatable farm, processing, ecological, and household outcomes.",
  },
  "ai-for-science": {
    beneficiaries: ["Researchers gaining usable tools and shorter validated workflows", "Public research institutions sharing reproducible infrastructure", "Patients and communities when discoveries translate safely"],
    cost_bearers: ["Researchers performing data curation and validation", "Institutions carrying compute, security, and governance costs", "Affected groups exposed to poorly measured model failure or exclusion"],
    decision_use: "Distinguish access to AI infrastructure from accepted scientific use, reproducible workflow improvement, and downstream discovery impact.",
  },
  aviation: {
    beneficiaries: ["Passengers receiving safe and reliable service", "Workers and operators using qualified aircraft and infrastructure", "Communities gaining access where service is genuinely available"],
    cost_bearers: ["Communities carrying noise, emissions, land, and safety exposure", "Passengers bearing disruption and affordability costs", "Public agencies funding airspace and airport adaptation"],
    decision_use: "Join aircraft, airport, route, fleet, exposure, and reporting-period identities before making a readiness or outcome claim.",
  },
  "chips-and-compute": {
    beneficiaries: ["Customers receiving qualified semiconductor output and dependable compute", "Workers entering durable technical careers", "Regions gaining resilient supply and shared infrastructure"],
    cost_bearers: ["Water and power customers sharing large-load infrastructure costs", "Communities carrying construction, land, and environmental effects", "Public budgets supporting incentives and enabling works"],
    decision_use: "Track the full chain from subsidy and construction through utilities, qualification, customer acceptance, recurring output, and local effects.",
  },
  climate: {
    beneficiaries: ["Households and communities with reduced hazard exposure", "Public systems planning from transparent climate evidence", "Ecosystems where adaptation and mitigation measurably work"],
    cost_bearers: ["Frontline communities facing current impacts", "Workers and regions navigating transition", "Future generations inheriting delayed action and locked-in assets"],
    decision_use: "Keep observation, attribution, projection, exposure, adaptation, and realized-loss evidence in separate but connected lanes.",
  },
  "critical-minerals": {
    beneficiaries: ["Manufacturers gaining qualified and traceable supply", "Workers and regions receiving durable processing capability", "Public systems reducing concentrated supply risk"],
    cost_bearers: ["Local and Indigenous communities carrying land and water effects", "Workers exposed to mine and processing hazards", "Public lenders and customers carrying project and price risk"],
    decision_use: "Separate resource, reserve, authorization, finance, construction, commissioning, qualification, shipment, and recurring supply.",
  },
  cybersecurity: {
    beneficiaries: ["Users whose services remain available and data protected", "Operators gaining earlier detection and faster recovery", "Public institutions reducing mission disruption"],
    cost_bearers: ["Users facing breach, outage, fraud, or surveillance harms", "Workers carrying remediation and reporting burdens", "Organizations investing in controls whose effects are difficult to compare"],
    decision_use: "Avoid rewarding under-reporting by pairing incident counts with exposure, detection, reporting, loss, recovery, and mission denominators.",
  },
  "discovery-technologies": {
    beneficiaries: ["Researchers receiving reliable instruments, facilities, data, and methods", "Institutions sharing validated infrastructure", "The public when knowledge becomes reproducible and usable"],
    cost_bearers: ["Researchers competing for scarce access", "Institutions maintaining complex facilities and data", "Communities funding platforms before benefits are established"],
    decision_use: "Test whether a platform changes discovery rate, evidence quality, replication, access, or cost under a stable workflow comparison.",
  },
  energy: {
    beneficiaries: ["Customers receiving reliable and affordable service", "Communities gaining cleaner and more resilient systems", "Operators with flexible and maintainable assets"],
    cost_bearers: ["Ratepayers funding networks and stranded assets", "Workers and regions exposed to transition", "Communities carrying siting, safety, land, and environmental burdens"],
    decision_use: "Move from installed capacity to accepted interconnection, dispatch, availability, reliability, cost, and system outcome.",
  },
  "finance-and-risk": {
    beneficiaries: ["Households and firms receiving stable, fair access to finance", "Public institutions seeing risk before failure", "Long-horizon investment when incentives align with delivery"],
    cost_bearers: ["Borrowers facing exclusion or volatility", "Taxpayers absorbing poorly priced public risk", "Communities affected by capital withdrawal or speculative concentration"],
    decision_use: "Separate capital commitment from draw, expenditure, asset delivery, operating cash flow, risk transfer, and realized public value.",
  },
  "human-futures": {
    beneficiaries: ["People gaining capability, security, agency, and participation", "Communities able to shape technological change", "Future generations receiving durable institutions and options"],
    cost_bearers: ["Groups excluded from design or benefit", "Care workers and households absorbing hidden transition costs", "Future generations inheriting irreversible risks"],
    decision_use: "Make distribution, agency, care, rights, culture, intergenerational effects, and uncertainty visible beside technical capability.",
  },
  mobility: {
    beneficiaries: ["Travelers receiving safe, reliable, affordable, accessible service", "Workers connecting to opportunity", "Communities gaining useful access without excessive externalities"],
    cost_bearers: ["Users facing delay, injury, exclusion, or high cost", "Workers exposed to operational transition", "Communities carrying traffic, land, emissions, and infrastructure burdens"],
    decision_use: "Join operator, service, route, fleet, geography, passenger, exposure, reliability, accessibility, and cost definitions before comparing outcomes.",
  },
  "policy-and-standards": {
    beneficiaries: ["Users receiving interoperable and enforceable protections", "Organizations planning against stable rules", "Public bodies gaining auditable implementation paths"],
    cost_bearers: ["Small organizations facing compliance costs", "Users exposed during implementation gaps", "Public agencies carrying oversight and enforcement burdens"],
    decision_use: "Trace the path from proposal and adoption through effective date, procurement, implementation, testing, acceptance, enforcement, and retirement.",
  },
  quantum: {
    beneficiaries: ["Researchers gaining reproducible measurement and useful capability", "Institutions preparing secure transitions", "Users benefiting from validated scientific or operational applications"],
    cost_bearers: ["Organizations funding speculative hardware and scarce expertise", "Users affected by security-transition costs", "Public programs carrying forecast and portfolio risk"],
    decision_use: "Keep physical metrics, benchmark tasks, error assumptions, accepted use, operational value, and future scenarios explicitly separate.",
  },
  space: {
    beneficiaries: ["Scientific, civil, and commercial users receiving reliable access", "Communities gaining durable skilled activity", "Public missions using accepted vehicles and sites"],
    cost_bearers: ["Communities carrying noise, traffic, land, and environmental effects", "Workers and public agencies carrying safety risk", "Customers and taxpayers exposed to delay and failure"],
    decision_use: "Separate environmental review, site authority, vehicle authority, mission, payload delivery, recurring service, reliability, cost, and local outcome.",
  },
  water: {
    beneficiaries: ["Households, ecosystems, farms, and industry receiving dependable water service", "Communities gaining drought and flood resilience", "Utilities using accepted and measurable infrastructure"],
    cost_bearers: ["Ratepayers funding large capital works", "Communities and ecosystems exposed to withdrawal, discharge, or construction effects", "Future users inheriting depleted or unreliable systems"],
    decision_use: "Connect allocation, agreement, finance, construction, acceptance, metering, quality, reuse, compliance, affordability, and ecosystem outcome.",
  },
};

const chronicleById = byId(p136.project_chronicles, "chronicle_id");
const ledgerById = byId(p137.place_ledgers, "ledger_id");
const passportByUpstreamId = byId(comparisonPassports, "upstream_rereview_id");
const roadmapByDeskId = byId(p142.topic_roadmaps, "desk_id");

let fieldGuides = p140.topic_desks.map((desk, index) => {
  const roadmap = roadmapByDeskId.get(desk.desk_id);
  const projectsForDesk = desk.project_chronicle_ids.map((id) => chronicleById.get(id)).filter(Boolean);
  const placesForDesk = desk.place_ledger_ids.map((id) => ledgerById.get(id)).filter(Boolean);
  const comparisonsForDesk = desk.comparison_rereview_ids.map((id) => passportByUpstreamId.get(id)).filter(Boolean);
  const missionIdSet = new Set(desk.mission_ids);
  const annotationsForDesk = p125.evidence_annotations.filter((annotation) => annotation.mission_ids.some((missionId) => missionIdSet.has(missionId)));
  const directEvidenceSourceIds = unique(annotationsForDesk.flatMap((annotation) => annotation.source_ids));
  const contextSourceIds = unique([
    ...projectsForDesk.flatMap((record) => record.source_ids),
    ...placesForDesk.flatMap((record) => record.source_ids),
  ]);
  const stakeholders = stakeholderNotes[desk.slug];
  if (!roadmap || !stakeholders) throw new Error(`Missing field-guide inputs for ${desk.slug}.`);
  return {
    field_guide_id: `152-GUIDE-${String(index + 1).padStart(3, "0")}`,
    topic_id: desk.topic_id,
    desk_id: desk.desk_id,
    roadmap_id: roadmap.roadmap_id,
    slug: desk.slug,
    title: `${desk.title.replace(/ intelligence desk$/i, "")} field guide`,
    publication_date: programStartDate,
    guide_state: "Published — bounded synthesis",
    orientation: desk.current_read,
    strongest_current_evidence: desk.strongest_current_evidence,
    contested_reading: desk.contested_reading,
    decision_use: stakeholders.decision_use,
    evidence_chain: [
      "Define the exact subject and receiving system.",
      "Locate the controlling authority and exact artifact.",
      "Separate commitment, delivery, operation, adoption, and outcome.",
      "Require stable identity, period, measure, method, and denominator for trends.",
      "Publish the unresolved bridge and next decisive record.",
    ],
    horizon_questions: roadmap.horizon_milestones.map((milestone) => ({
      horizon: milestone.horizon,
      mission_id: milestone.mission_id,
      question: milestone.question,
      required_evidence: milestone.required_evidence,
      current_state: milestone.current_state,
    })),
    named_projects: projectsForDesk.map((record) => ({ chronicle_id: record.chronicle_id, title: record.title, inherited_stage: record.inherited_stage, unresolved_bridge: record.unresolved_bridge })),
    receiving_places: placesForDesk.map((record) => ({ ledger_id: record.ledger_id, title: record.title, inherited_state: record.inherited_state, exact_next_artifact: record.exact_next_artifact })),
    comparison_passports: comparisonsForDesk.map((record) => ({ passport_id: record.passport_id, title: record.title, verdict: record.verdict, prohibited_comparison: record.prohibited_comparison })),
    beneficiaries: stakeholders.beneficiaries,
    cost_bearers: stakeholders.cost_bearers,
    evidence_annotation_ids: annotationsForDesk.map((annotation) => annotation.note_id),
    direct_evidence_signal_ids: unique(annotationsForDesk.map((annotation) => annotation.signal_id)),
    direct_evidence_source_ids: directEvidenceSourceIds,
    context_source_ids: contextSourceIds,
    source_ids: unique([...directEvidenceSourceIds, ...contextSourceIds]),
    next_actions: roadmap.horizon_milestones.map((milestone) => milestone.next_action),
    success_definition: roadmap.success_definition,
    route: `/review/${release}/${sectionByPhase[152]}/${desk.slug}/`,
  };
});
fieldGuides = preservePublishedRecords({ existingRegistry: existing152, key: "field_guides", records: fieldGuides, idKey: "field_guide_id" });

const phase152 = makeRegistry(152, "field_guides", fieldGuides, {
  field_guides: fieldGuides.length,
  horizon_questions: fieldGuides.reduce((sum, guide) => sum + guide.horizon_questions.length, 0),
  project_links: fieldGuides.reduce((sum, guide) => sum + guide.named_projects.length, 0),
  place_links: fieldGuides.reduce((sum, guide) => sum + guide.receiving_places.length, 0),
  evidence_annotation_links: fieldGuides.reduce((sum, guide) => sum + guide.evidence_annotation_ids.length, 0),
  direct_evidence_source_links: fieldGuides.reduce((sum, guide) => sum + guide.direct_evidence_source_ids.length, 0),
  numeric_rankings: 0,
}, publicationSnapshotMetadata(fieldGuides));

// Phase 153 — four authored cross-system reports, all bounded to the present corpus.
const cycleByCycleItemId = byId(cycle.records, "cycle_item_id");
const sourcesForCycleItems = (...cycleItemIds) => unique(cycleItemIds.flatMap((id) => cycleByCycleItemId.get(id)?.source_ids ?? []));
const sourcesForChronicles = (...chronicleIds) => unique(chronicleIds.flatMap((id) => chronicleById.get(id)?.source_ids ?? []));
const reportSourceGroups = {
  broadband: sourcesForCycleItems(
    "60-CYCLE-LOUISIANA-STARLINK-ADOPTION",
    "60-CYCLE-LOUISIANA-NEXTLINK-ADOPTION",
    "60-CYCLE-MONTANA-COMPLETED-QUARTER",
  ),
  "authority-and-delivery": sourcesForChronicles("136-CHRONICLE-001", "136-CHRONICLE-002", "136-CHRONICLE-003", "136-CHRONICLE-004"),
  "acceptance-and-operation": sourcesForChronicles("136-CHRONICLE-021", "136-CHRONICLE-022", "136-CHRONICLE-024"),
  "chips-utilities": sourcesForChronicles("136-CHRONICLE-001", "136-CHRONICLE-003"),
  "measurement-method": sourcesForChronicles("136-CHRONICLE-001", "136-CHRONICLE-004", "136-CHRONICLE-008", "136-CHRONICLE-021", "136-CHRONICLE-022", "136-CHRONICLE-024"),
};
const authoredWordCount = (value) => (Array.isArray(value) ? value.join(" ") : String(value ?? "")).match(/[A-Za-z0-9][A-Za-z0-9'’.-]*/g)?.length ?? 0;

const flagshipReportSeeds = [
  {
    slug: "broadband-deployment-versus-real-adoption",
    title: "Broadband deployment versus real adoption",
    dek: "Why awards, towers, availability, subscriptions, sustained use, affordability, and household outcomes are different evidence states.",
    thesis: "A network can be funded, built, and technically available without being affordable, subscribed to, reliably used, or valuable to the households the program was meant to reach. The evidence chain must therefore retain a fixed eligible-location cohort and distinguish infrastructure delivery from observed adoption.",
    topic_slugs: ["policy-and-standards", "human-futures"],
    sections: [
      {
        claim_id: "153-BROADBAND-CLAIM-001",
        heading: "Treat deployment and adoption as an evidence ladder",
        narrative: "Broadband programs produce several records that are easy to collapse but answer different questions. An award identifies an authorized recipient, geography, budget, and intended service population. A construction or activation record shows that some infrastructure exists. An availability record shows that a provider is prepared to offer service under stated terms. None of those records establishes that an eligible household ordered service, completed installation, retained service, received the advertised performance, or could afford the recurring price. A responsible adoption account therefore keeps each rung visible and refuses to substitute an upstream milestone for a downstream observation. This matters most where satellite, fixed wireless, and terrestrial projects use different deployment paths: a common program label does not create a common operating denominator. The first publishable adoption result must name the cohort, observation window, event counted as adoption, and exclusions rather than infer take-up from network presence.",
        source_group: "broadband",
      },
      {
        claim_id: "153-BROADBAND-CLAIM-002",
        heading: "Fix the cohort before reading the numerator",
        narrative: "A useful adoption rate needs a denominator that survives the reporting period. Eligible locations may be revised after challenge processes, deduplication, address validation, technology changes, or new coverage determinations. Installations may be counted as orders, completed activations, active accounts, subsidized accounts, or premises capable of receiving service. Those are not interchangeable numerators. The evidence contract should preserve the location list or a digest of it, document additions and removals, and record whether one subscriber can represent several premises. It should also distinguish gross activations from active service at the end of the period. Without those controls, a percentage can look precise while combining incompatible populations. The Louisiana and Montana checks are therefore separate decisions: each must use its own authority, provider, geography, cohort, reporting method, and receipt, even when the public policy question—whether infrastructure became real use—is shared.",
        source_group: "broadband",
      },
      {
        claim_id: "153-BROADBAND-CLAIM-003",
        heading: "Measure whether connection becomes usable service",
        narrative: "Initial take-up is only one boundary. A household can subscribe and still experience unaffordable bills, installation delay, unreliable performance, equipment failure, poor support, unsuitable data limits, or service that does not meet the work, education, health, and civic uses invoked to justify the program. Durable evidence therefore follows activation with retention, price actually paid, subsidy status, speed and latency under a declared method, outage or interruption experience, complaint and repair records, and a transparent account of households that remain unserved. These measures should not be compressed into a score. A strong speed result cannot cancel an affordability failure, and a high subscription rate cannot prove that service is reliable or useful. Publishing the dimensions separately keeps program delivery legible to residents, providers, funders, and oversight bodies and makes the next missing artifact obvious.",
        source_group: "broadband",
      },
      {
        claim_id: "153-BROADBAND-CLAIM-004",
        heading: "Use the September gates as decisions, not deadlines for a positive result",
        narrative: "The scheduled September checks are commitments to look for an exact artifact and issue a dated decision; they are not commitments to find material change. A lawful result may be a measured adoption record, No Material Change, a bounded blocker, or a contract-compliant reschedule when the responsible authority has moved the reporting date. Every result still needs its own receipt and propagation through the underlying signal, Outcomes Watch, Evidence Cycle digest, relevant pathway and dependency map, public update, and any affected named file. Shared dates do not merge identities. If the evidence is missing or incompatible, the correct publication is the bounded state and the exact next action—not a zero, an estimate, or a claim that adoption did not occur. That discipline lets the site become more useful over time without sacrificing the distinction between what is observable, what is merely scheduled, and what remains unknown.",
        source_group: "broadband",
      },
    ],
    evidence_chain: [
      "Program authority and award define who and what is eligible.",
      "Construction and installation records establish delivered infrastructure, not use.",
      "Availability records establish an offer under stated terms, not a subscription.",
      "Subscriptions or installations establish initial adoption only when the cohort and period are fixed.",
      "Retention, performance, affordability, and household-use measures are required for durable outcomes.",
    ],
    current_read: "Louisiana Starlink and Nextlink and Montana BEAD are deliberately scheduled as separate evidence gates because the public record can move at different speeds across award, construction, service availability, installation, and take-up. The present corpus can explain the contract and the missing denominator; it does not yet publish a September adoption result.",
    decision_tests: ["Is the eligible-location denominator fixed?", "Does the record distinguish availability from subscription or installation?", "Are price, speed, reliability, and subsidy terms stable across periods?", "Can a household remain observable after first connection?"],
    decisive_next_evidence: "Provider- or authority-issued installation or subscription records for a fixed eligible-location cohort, followed by compatible retention, performance, affordability, and use measures.",
    boundary: "No September 1 or September 9 result is stated before its lawful check, and no lack of a public artifact is treated as proof that adoption did not occur.",
  },
  {
    slug: "project-delivery-versus-operational-capability",
    title: "Project delivery versus operational capability",
    dek: "A practical guide to the records that separate authorization, construction, acceptance, use, and dependable service.",
    thesis: "The most common frontier-infrastructure error is to collapse a visible milestone into the next stage. A council vote is not an enacted instrument; completed construction is not accepted service; initial delivery is not recurring qualified output; and a licence is not a mission.",
    topic_slugs: ["advanced-manufacturing", "mobility", "space", "policy-and-standards"],
    sections: [
      {
        claim_id: "153-DELIVERY-CLAIM-001",
        heading: "Authority defines permission, conditions, and the responsible decision maker",
        narrative: "An authorization is valuable because it identifies who may act, under what conditions, and which institution can change or revoke the permission. It is not evidence that the authorized work has begun or that its conditions have been satisfied. Planning recommendations, enacted instruments, permits, licences, funding agreements, tariffs, and environmental decisions occupy different legal and operational positions. The Toronto and Space Coast records make the distinction concrete: a recommendation must still become an enacted and operative instrument, while a site licence must still be joined to a specific authorized mission and subsequent operating record. A project chronology should therefore preserve the authority identity, effective date, conditions, appeal or expiry path, and exact asset or geography. When these fields are missing, later construction or service claims cannot inherit legitimacy merely because a broadly related approval exists.",
        source_group: "authority-and-delivery",
        source_ids: ["source-toronto-2026-sc33-9-item-history", "source-faa-shuttle-landing-facility-license", "source-faa-starship-lc39a-final-eis-rod"],
      },
      {
        claim_id: "153-DELIVERY-CLAIM-002",
        heading: "Physical progress must remain tied to the named asset",
        narrative: "Construction photographs, expenditure, equipment delivery, installation, and substantial completion can all be meaningful progress. They still need a stable asset identity and a receiving-system context. A campus may contain several fabs, utility packages, and commissioning sequences; a transmission trail may contain multiple substations, lines, rate decisions, and customer conditions. Reporting a regional total or corporate milestone against one local asset can therefore overstate what has actually arrived. The correct record names the component, location, responsible contractor or authority, dated stage, and unresolved dependency. It also preserves revisions and partial completions. This is why the project chronicles do not treat investment, spend, construction percentage, or a ribbon cutting as accepted capability. Physical delivery becomes decision-relevant when a downstream party can test the exact thing delivered against a declared requirement.",
        source_group: "authority-and-delivery",
        source_ids: ["source-phoenix-tsmc-july-2026-fab-update", "source-phoenix-tsmc-2026-wastewater-development-agreement", "source-virginia-scc-large-load-gs5-2025", "source-virginia-scc-golden-mars-2026"],
      },
      {
        claim_id: "153-DELIVERY-CLAIM-003",
        heading: "Acceptance is a receiving-party decision",
        narrative: "Acceptance is not a synonym for completion. It is a recorded decision by the party that must use, regulate, or take custody of the asset, product, or service. The record should identify the criteria applied, exceptions or punch-list items, date, configuration, and consequence of a failed or conditional result. Hanford material movement, Amtrak station and passenger-information work, and NNSA production illustrate different acceptance structures: custody and process-stage records, accessibility and closeout records, and qualification or program-baseline records cannot substitute for one another. A valid acceptance artifact can advance a bounded stage even when it does not establish performance. Conversely, a contractor statement or delivery count cannot advance the stage when the receiving authority has not recorded its disposition. Keeping the decision and its receipt visible prevents schedule pressure from becoming an evidentiary shortcut.",
        source_group: "acceptance-and-operation",
        source_ids: ["source-57b-amtrak-ada-progress-june-2026", "source-57e-amtrak-accessibility-progress-june-2026", "source-57e-doe-hanford-acceptable-glass-startup", "source-57a-nnsa-w87-1-first-production-unit"],
      },
      {
        claim_id: "153-DELIVERY-CLAIM-004",
        heading: "Operational capability requires repetition, exceptions, and repair",
        narrative: "A successful first use demonstrates possibility, not dependable capability. Operational evidence needs a stable period and denominator: missions attempted and completed, units accepted and rejected, service hours scheduled and delivered, throughput entering and leaving a process, or assets available and unavailable. It should expose downtime, defects, maintenance, workarounds, revision, and recovery rather than publish only successes. The receiving system also matters. A technically functioning asset may still fail to provide an accessible trip, compliant disposal path, reliable production rate, or community service. For this reason the roadmap keeps recurring operation separate from public outcome. A project can pass an operating gate while affordability, distribution, environmental effect, or user benefit remains unresolved. That separation produces a more demanding but more reusable account of whether infrastructure is actually working.",
        source_group: "acceptance-and-operation",
        source_ids: ["source-57e-amtrak-accessibility-progress-june-2026", "source-57e-hanford-dflaw-current-program-page", "source-57f-nnsa-pit-production-current"],
      },
    ],
    evidence_chain: [
      "Authority: the controlling body permits, funds, or requires a named action.",
      "Delivery: a named asset reaches construction, installation, or transfer under a dated record.",
      "Acceptance: the receiving party applies criteria and records a passed or bounded result.",
      "Operation: the asset performs a defined service in a stated period.",
      "Dependability: repeated performance, exceptions, downtime, and repair remain observable under stable definitions.",
    ],
    current_read: "The Toronto, Space Coast, TSMC, Amtrak, Hanford, NNSA, and industrial-production files demonstrate why each bridge needs its own artifact. The Atlas can show chronology and unresolved dependencies now, while preserving every inherited stage until the correct authority or receiving party publishes a qualifying record.",
    decision_tests: ["Who is the receiving or accepting party?", "What criteria define acceptance?", "Does the artifact identify the exact asset and period?", "Is the evidence a one-time milestone or a repeated operating measure?", "Are exceptions, downtime, revision, and repair visible?"],
    decisive_next_evidence: "A named receiving-party acceptance record followed by a repeated service or output series with stable asset, period, denominator, and exception definitions.",
    boundary: "This report compares evidence chains, not project quality, maturity, performance, or likelihood of success.",
  },
  {
    slug: "chips-compute-power-and-water",
    title: "Chips, compute, power, and water",
    dek: "How industrial ambition becomes a receiving-system problem—and why facility output cannot be inferred from utility or construction milestones.",
    thesis: "Semiconductor and compute capacity is jointly constrained by facility qualification, electric service, water and wastewater systems, workforce, supply chains, public authority, and customer acceptance. No single milestone can stand in for the system.",
    topic_slugs: ["chips-and-compute", "energy", "water", "advanced-manufacturing"],
    sections: [
      {
        claim_id: "153-CHIPS-CLAIM-001",
        heading: "Start with one facility and one demand identity",
        narrative: "Industrial-capacity narratives often mix corporate announcements, regional load forecasts, campus plans, and individual production buildings. The first analytical task is to keep those identities separate. A company-wide capital plan does not state the capacity of one fab; a utility forecast does not prove that one customer caused the entire increase; and a land-use envelope does not establish which tools, products, or operating dates will materialize. The named-project chronicle should join permits, service agreements, construction records, qualification evidence, and output only when they refer to the same facility or explicitly documented campus boundary. Where aggregation is unavoidable, the record must say so. This identity discipline prevents a visible investment number from being interpreted as accepted semiconductor output or an exact local infrastructure burden.",
        source_group: "chips-utilities",
      },
      {
        claim_id: "153-CHIPS-CLAIM-002",
        heading: "Power and water are acceptance chains, not background inputs",
        narrative: "Electric and water systems are active receiving systems with their own authorities, construction schedules, capacity rules, reliability limits, and customers. A tariff or development agreement can define obligations and dependencies without establishing that service has been built, energized, accepted, metered, or used. The Phoenix wastewater record is important precisely because it names conveyance work and a reclaimed-water-plant dependency; the Northern Virginia record is important because it names a large-load rate and transmission trail. Neither proves delivered utility performance. A stronger account follows each dependency through design, finance, construction, inspection, acceptance, operating volume, quality or reliability, exceptions, and cost allocation. It also distinguishes gross withdrawals from consumption, reclaimed supply from discharge, contracted megawatts from coincident demand, and capacity from energy actually delivered.",
        source_group: "chips-utilities",
      },
      {
        claim_id: "153-CHIPS-CLAIM-003",
        heading: "Qualification and customer acceptance define usable production",
        narrative: "A completed cleanroom or installed tool does not establish marketable output. Semiconductor production passes through equipment qualification, process qualification, yield learning, product qualification, customer acceptance, and repeated shipment under changing mixes and specifications. Public sources often report only selected milestones or corporate totals, so the site should resist constructing a facility series from incompatible disclosures. The minimum useful record names the product or bounded family, facility, period, definition of good output, acceptance authority, and treatment of rework or scrap. A repeated series then needs revision history, downtime, maintenance, and method continuity. Workforce, supplier, and utility evidence belongs beside that series as a dependency, not inside the output numerator. This lets readers see whether the industrial system is moving without pretending that every supporting milestone measures the same thing.",
        source_group: "chips-utilities",
      },
      {
        claim_id: "153-CHIPS-CLAIM-004",
        heading: "Public value remains a separate distributional question",
        narrative: "Even accepted and recurring production does not answer who benefits or who bears costs. Public incentives, grid and water upgrades, land, transport impacts, workforce programs, supplier development, environmental compliance, and tax effects occur on different timelines and may fall on different populations. A credible public-value account must identify the payer, beneficiary, geography, counterfactual, and period for each measure. Jobs announced, workers trained, positions filled, and durable career progression are different observations. Infrastructure cost allocated to a customer, socialized across ratepayers, or financed by public funds has different implications. Environmental permits define conditions but do not by themselves prove measured impact. The roadmap therefore refuses a composite score: it publishes the operating chain and the distributional ledger separately so a strong production result cannot erase an unresolved affordability, fiscal, workforce, or ecological burden.",
        source_group: "chips-utilities",
      },
    ],
    evidence_chain: [
      "Named demand and facility identity establish the subject.",
      "Land, permit, finance, and utility agreements establish authorized dependencies.",
      "Construction and interconnection records establish physical progress.",
      "Inspection, energization, water acceptance, process qualification, and customer acceptance establish usable capacity.",
      "Recurring output, resource use, reliability, workforce, and local-effect series establish operating and public outcomes.",
    ],
    current_read: "Phoenix records a TSMC wastewater development agreement with an explicit reclaimed-water-plant dependency, while Virginia records large-load tariff and transmission authority. These are high-value conversion artifacts. They do not establish accepted electric or water service, qualified wafers, stable facility output, or comparable local benefit.",
    decision_tests: ["Is demand tied to the exact facility or only to a region?", "Has the utility or regulator recorded accepted service?", "Are water withdrawals, reuse, discharge, and compliance measured under one facility identity?", "Is semiconductor output qualified and customer-accepted?", "Can public cost and local effects be assigned without double counting?"],
    decisive_next_evidence: "Facility-specific utility acceptance, process qualification, customer acceptance, and repeated production-and-resource records using stable periods and denominators.",
    boundary: "Power demand, water volume, wafer output, jobs, subsidies, and economic value remain non-equivalent measures and are not normalized into a score.",
  },
  {
    slug: "how-to-know-a-frontier-project-is-working",
    title: "How to know whether a frontier project is working",
    dek: "A reusable evidence test for public decisions under novelty, long timelines, missing denominators, and uneven disclosure.",
    thesis: "A credible answer begins by naming the promised service and affected receiving system, then follows the same identity through delivery, acceptance, operation, adoption, and outcome. The answer can legitimately be bounded, negative, or not yet measurable.",
    topic_slugs: p140.topic_desks.map((desk) => desk.slug),
    sections: [
      {
        claim_id: "153-METHOD-CLAIM-001",
        heading: "Write the decision question before collecting favorable facts",
        narrative: "A frontier project can generate thousands of true statements without producing an answer to the decision at hand. Begin by naming the promised service, exact entity, receiving system, affected population, geography, period, and decision that the evidence is meant to inform. Then state the minimum artifact that would support each transition. This order reduces confirmation bias and makes a bounded result useful: a search can locate strong authority or construction evidence while still failing the acceptance or outcome requirement. The record should preserve both. It should also name what would falsify or reopen the current reading. A question framed this way can survive changing technologies and institutions because it is anchored to observable relationships rather than promotional vocabulary.",
        source_group: "measurement-method",
        source_ids: ["source-phoenix-tsmc-july-2026-fab-update", "source-phoenix-tsmc-2026-wastewater-development-agreement", "source-faa-shuttle-landing-facility-license"],
      },
      {
        claim_id: "153-METHOD-CLAIM-002",
        heading: "Follow authority and custody through every transition",
        narrative: "Each stage has a different competent witness. Legislatures, councils, regulators, funders, contractors, operators, receiving parties, inspectors, and affected users can all publish important records, but their authority is not interchangeable. The best available source is the one authorized to establish the exact fact, not necessarily the most detailed or optimistic document. A project file should therefore record who issued the artifact, what authority it carries, which named object it covers, and which later authority must act. Custody matters in the same way: a delivered component becomes accepted only when the responsible receiver records the disposition. Mapping these handoffs reveals the true bottleneck and prevents a press release, forecast, or secondary summary from carrying more evidentiary weight than its role permits.",
        source_group: "measurement-method",
        source_ids: ["source-57d-amtrak-ada-progress-june-2025", "source-57d-amtrak-ada-progress-december-2025", "source-57e-amtrak-accessibility-progress-june-2026"],
      },
      {
        claim_id: "153-METHOD-CLAIM-003",
        heading: "Demand compatibility before publishing a trend or comparison",
        narrative: "Repeated numbers become a series only when identity, period, measure, method, and denominator remain compatible or their breaks are explicitly modeled. A renamed asset, expanded reporting universe, revised definition, missing quarter, or changed measurement system can create an apparent trend that is only a classification change. Comparisons add further requirements: the entities must occupy comparable stages, serve comparable populations or functions, and expose compatible costs, reliability, exposure, and outcome measures. When those tests fail, context can still be valuable, but a score or rank is not. The longitudinal lab and comparison passports make this boundary inspectable by retaining failed tests and the decisive next evidence. That is more informative than silently dropping difficult cases or normalizing unlike quantities into one index.",
        source_group: "measurement-method",
        source_ids: ["source-56x-hanford-first-ilaw-disposal-2026", "source-56x-hanford-vitrification-100k-2026", "source-57e-doe-hanford-acceptable-glass-startup"],
      },
      {
        claim_id: "153-METHOD-CLAIM-004",
        heading: "Publish uncertainty, no-change decisions, and corrections as results",
        narrative: "A trustworthy resource does not need every review to end in promotion. No Material Change, a bounded blocker, an incompatible series, a delayed authority record, or an unresolved owner decision can be the correct result. What makes that result useful is a dated receipt containing the artifact checked, reviewer role, decision, rationale, affected records, limitations, and exact next action. Later evidence should append a new decision and preserve the prior state rather than silently rewrite history. Corrections follow the same rule: identify the original statement, corrected statement, reason, date, and affected routes. This operating discipline turns absence of closure into a navigable research agenda and lets readers distinguish genuinely negative evidence from evidence that is unavailable, mistimed, or held behind a different authority.",
        source_group: "measurement-method",
        source_ids: ["source-56w-nnsa-fy2027-weapons-activities", "source-57a-nnsa-w87-1-first-production-unit", "source-57f-nnsa-pit-production-current"],
      },
    ],
    evidence_chain: [
      "Write the decision question before searching for supportive evidence.",
      "Define the entity, stage, geography, period, measure, method, and denominator.",
      "Map the exact authority and the receiving party for every claimed transition.",
      "Preserve revisions, failures, no-change decisions, and missing records as first-class information.",
      "Admit a repeated series only after compatibility and independent review.",
      "State who benefits, who bears costs, which alternatives remain plausible, and what would change the conclusion.",
    ],
    current_read: "FTFN now contains the structures needed to answer responsibly: source lineage, acquisition packets, mission tests, project and place identities, longitudinal gates, comparison passports, topic desks, and a corrections path. The remaining work is not to fill every blank with a claim; it is to operate those structures with dated decisions and retain the blanks that evidence has not closed.",
    decision_tests: ["What promised service is being evaluated?", "Which exact entity and receiving system carry the outcome?", "What is the counterfactual or comparison boundary?", "Are measure and denominator stable across periods?", "Which alternative explanations remain?", "Who authorized the conclusion and when must it be reopened?"],
    decisive_next_evidence: "A receipt-bearing chain from exact authority and named delivery through receiving-party acceptance and compatible repeated outcomes, with revisions and alternative explanations visible.",
    boundary: "The framework does not guarantee that a complete answer is publicly obtainable; it guarantees that uncertainty, missing bridges, and authority remain visible.",
  },
];

const deskBySlug = byId(p140.topic_desks, "slug");
const fieldGuideBySlug = byId(fieldGuides, "slug");
let flagshipReports = flagshipReportSeeds.map((seed, index) => {
  const desks = seed.topic_slugs.map((slug) => deskBySlug.get(slug)).filter(Boolean);
  const guides = seed.topic_slugs.map((slug) => fieldGuideBySlug.get(slug)).filter(Boolean);
  const claimBlocks = seed.sections.map(({ source_group: sourceGroup, ...section }) => ({
    ...section,
    source_ids: section.source_ids ?? reportSourceGroups[sourceGroup] ?? [],
  }));
  const reportNarrative = [
    seed.dek,
    seed.thesis,
    seed.current_read,
    seed.decisive_next_evidence,
    seed.boundary,
    ...seed.evidence_chain,
    ...seed.decision_tests,
    ...claimBlocks.map((section) => `${section.heading} ${section.narrative}`),
  ];
  return {
    report_id: `153-REPORT-${String(index + 1).padStart(3, "0")}`,
    slug: seed.slug,
    title: seed.title,
    publication_date: programStartDate,
    report_state: "Published — bounded synthesis",
    dek: seed.dek,
    thesis: seed.thesis,
    evidence_chain: seed.evidence_chain,
    current_read: seed.current_read,
    decision_tests: seed.decision_tests,
    claim_blocks: claimBlocks,
    affected_parties: unique(guides.flatMap((guide) => [...guide.beneficiaries, ...guide.cost_bearers])),
    decisive_next_evidence: seed.decisive_next_evidence,
    boundary: seed.boundary,
    topic_ids: desks.map((desk) => desk.topic_id),
    desk_ids: desks.map((desk) => desk.desk_id),
    field_guide_ids: guides.map((guide) => guide.field_guide_id),
    mission_ids: unique(desks.flatMap((desk) => desk.mission_ids)),
    project_chronicle_ids: unique(desks.flatMap((desk) => desk.project_chronicle_ids)),
    place_ledger_ids: unique(desks.flatMap((desk) => desk.place_ledger_ids)),
    comparison_passport_ids: unique(desks.flatMap((desk) => desk.comparison_rereview_ids).map((id) => passportByUpstreamId.get(id)?.passport_id)),
    source_ids: unique(claimBlocks.flatMap((section) => section.source_ids)),
    authored_word_count: authoredWordCount(reportNarrative),
    route: `/review/${release}/${sectionByPhase[153]}/${seed.slug}/`,
  };
});
flagshipReports = preservePublishedRecords({ existingRegistry: existing153, key: "flagship_reports", records: flagshipReports, idKey: "report_id" });

const phase153 = makeRegistry(153, "flagship_reports", flagshipReports, {
  flagship_reports: flagshipReports.length,
  topic_links: flagshipReports.reduce((sum, report) => sum + report.topic_ids.length, 0),
  mission_links: flagshipReports.reduce((sum, report) => sum + report.mission_ids.length, 0),
  claim_blocks: flagshipReports.reduce((sum, report) => sum + report.claim_blocks.length, 0),
  authored_words: flagshipReports.reduce((sum, report) => sum + report.authored_word_count, 0),
  minimum_report_words: Math.min(...flagshipReports.map((report) => report.authored_word_count)),
  scores_created: 0,
  recommendations_created: 0,
}, publicationSnapshotMetadata(flagshipReports));

// Phase 154 — source-binding templates are ready; the four editions remain time-gated.
const existingEditionById = byId(existing154?.edition_packets ?? [], "edition_packet_id");
const eligibleEditionDeskIds = new Set(deskReviewLedgers.map((record) => record.desk_id));
const eligibleEditionSourceIds = new Set([
  ...deskReviewLedgers.flatMap((record) => record.source_ids),
  ...gateOperations.flatMap((record) => record.source_ids),
]);
const editionRequiredSections = ["Material changes", "Bounded no-change decisions", "Blocked or rescheduled checks", "Affected projects, places, pathways, and desks", "Decisive next evidence", "Methods and publication boundaries"];
const editionPackets = p143.editions.filter((edition) => edition.state.startsWith("Scheduled")).map((edition, index) => {
  const dueOperations = gateOperations.filter((operation) => operation.lawful_date <= edition.publication_date);
  const dueReviewWindows = deskReviewLedgers.flatMap((desk) => desk.review_windows).filter((window) => window.scheduled_date <= edition.publication_date);
  const slug = edition.slug;
  const editionPacketId = `154-PACKET-${String(index + 1).padStart(3, "0")}`;
  const prior = existingEditionById.get(editionPacketId);
  const publicationInput = edition.publication_date <= effectiveDate ? buildPhase154PublicationInputScope({
    editionPacketId,
    upstreamEditionId: edition.edition_id,
    publicationDate: edition.publication_date,
    focus: edition.focus,
    boundary: edition.boundary,
    requiredSections: editionRequiredSections,
    phase145Operations: gateOperations,
    phase146Dispositions: gapDispositions,
    phase147Records: adjudicationRecords,
    phase149Reviews: longitudinalReviews,
    phase151Desks: deskReviewLedgers,
    canonicalSources: canonicalSourceById,
  }) : null;
  const publicationScope = prior && publicationInput ? buildPhase154PublicationScope({
    publicationInputDigest: publicationInput.digest,
    packet: prior,
    canonicalSources: canonicalSourceById,
  }) : null;
  const preservePublication = edition.publication_date <= effectiveDate
    && String(prior?.state ?? "").startsWith("Published")
    && publicationInput?.due_inputs_terminal === true
    && Boolean(prior?.draft_content)
    && (prior?.included_desk_ids?.length ?? 0) > 0
    && (prior?.included_source_ids?.length ?? 0) > 0
    && new Set(prior.included_desk_ids).size === prior.included_desk_ids.length
    && new Set(prior.included_source_ids).size === prior.included_source_ids.length
    && new Set(prior?.material_change_ids ?? []).size === (prior?.material_change_ids ?? []).length
    && prior.included_desk_ids.every((id) => eligibleEditionDeskIds.has(id))
    && prior.included_source_ids.every((id) => eligibleEditionSourceIds.has(id))
    && publicationInput?.missing_source_ids.length === 0
    && publicationScope?.missing_source_ids.length === 0
    && materialIdsResolve(prior?.material_change_ids ?? [], publicationInput?.material_ids ?? [])
    && prior?.publication_input_contract_version === phase154PublicationInputVersion
    && prior?.publication_input_digest === publicationInput?.digest
    && prior?.publication_scope_contract_version === phase154PublicationScopeVersion
    && prior?.publication_scope_digest === publicationScope?.digest
    && prior?.publication_decision_date >= edition.publication_date
    && hasNonFutureReceipt(prior?.publication_decision_date, prior?.publication_receipt_id)
    && Boolean(prior?.reviewer_role && prior?.rationale);
  return {
    edition_packet_id: editionPacketId,
    upstream_edition_id: edition.edition_id,
    slug,
    title: `${edition.title} editorial packet`,
    publication_date: edition.publication_date,
    state: preservePublication ? prior.state : edition.publication_date <= effectiveDate ? "Due — publication receipt pending" : "Prepared — publication time-gated",
    focus: edition.focus,
    source_eligibility_cutoff: edition.publication_date,
    due_operation_ids: dueOperations.map((operation) => operation.operation_id),
    due_review_window_ids: dueReviewWindows.map((window) => window.window_id),
    required_sections: editionRequiredSections,
    draft_content: preservePublication ? prior.draft_content : null,
    included_desk_ids: preservePublication ? prior.included_desk_ids ?? [] : [],
    included_source_ids: preservePublication ? prior.included_source_ids ?? [] : [],
    material_change_ids: preservePublication ? prior.material_change_ids ?? [] : [],
    publication_decision_date: preservePublication ? prior.publication_decision_date : null,
    publication_receipt_id: preservePublication ? prior.publication_receipt_id : null,
    publication_input_contract_version: edition.publication_date <= effectiveDate ? phase154PublicationInputVersion : null,
    publication_input_digest: edition.publication_date <= effectiveDate ? publicationInput.digest : null,
    due_inputs_terminal: edition.publication_date <= effectiveDate ? publicationInput.due_inputs_terminal : null,
    unresolved_due_input_ids: edition.publication_date <= effectiveDate ? publicationInput.unresolved_due_input_ids : [],
    publication_scope_contract_version: preservePublication ? phase154PublicationScopeVersion : null,
    publication_scope_digest: preservePublication ? prior.publication_scope_digest : null,
    reviewer_role: preservePublication ? prior.reviewer_role ?? null : null,
    rationale: preservePublication ? prior.rationale ?? null : null,
    prior_publication_not_preserved: String(prior?.state ?? "").startsWith("Published") && !preservePublication,
    publication_rule: "Write and publish only on or after the publication date from decisions and sources available by that date. An empty or immaterial period must remain explicit.",
    boundary: edition.boundary,
    route: `/review/${release}/${sectionByPhase[154]}/${slug}/`,
  };
});

const dueEditionsPending = editionPackets.filter((record) => record.publication_date <= effectiveDate && !String(record.state).startsWith("Published"));
const phase154 = makeRegistry(154, "edition_packets", editionPackets, {
  edition_packets: editionPackets.length,
  source_binding_templates_prepared: editionPackets.length,
  time_gated_editions: editionPackets.filter((record) => record.publication_date > effectiveDate).length,
  published_editions: editionPackets.filter((record) => String(record.state).startsWith("Published")).length,
  due_editions_pending: dueEditionsPending.length,
  future_content_prepublished: editionPackets.filter((record) => record.publication_date > effectiveDate && record.draft_content !== null).length,
  stale_publications_requiring_revalidation: editionPackets.filter((record) => record.prior_publication_not_preserved).length,
});

const methodSeeds = [
  {
    slug: "evidence-admission",
    title: "Evidence admission and adjudication",
    purpose: "Separate discovery, source checking, relevance screening, admissibility, requirement disposition, and mission conclusion.",
    rules: ["A candidate is not admitted evidence.", "Every terminal requirement state needs a dated receipt and rationale.", "Accepted sources must belong to the reviewed candidate set.", "Rejected, inadmissible, and bounded results are legitimate terminal decisions.", "A mission conclusion cannot precede all required-evidence dispositions."],
    correction_trigger: "A source identity, candidate set, decision rationale, reviewer authority, or receipt binding changes.",
  },
  {
    slug: "authority-and-alternative-sources",
    title: "Authority roles and alternative sources",
    purpose: "Use alternatives to resolve a missing role without silently lowering the evidence contract.",
    rules: ["Name the authority role before selecting the source.", "Prefer the controlling regulator, receiver, auditor, operator, or public data steward for the exact claim.", "Record an alternative's fit and known limitation.", "A portal is a discovery rail unless the exact artifact and version are bound.", "A bounded search cannot establish nonexistence."],
    correction_trigger: "A controlling artifact, version, publisher role, access path, or material limitation changes.",
  },
  {
    slug: "calendar-gates-and-receipts",
    title: "Calendar gates and receipts",
    purpose: "Operate evidence checks lawfully and preserve independent outcomes.",
    rules: ["Never predate a check or receipt.", "Create a receipt for Material Change, No Material Change, bounded blocker, or contract-compliant reschedule.", "Keep same-date gates independent.", "Propagate only the decision supported by the checked artifact.", "Record the next exact artifact and date."],
    correction_trigger: "A gate identity, scheduled date, source, decision, receipt, or propagation target is wrong or incomplete.",
  },
  {
    slug: "longitudinal-compatibility",
    title: "Longitudinal compatibility and no-series boundaries",
    purpose: "Prevent isolated observations and legacy panels from becoming false trends.",
    rules: ["Identity, period, measure, method, and denominator must all pass.", "Legacy observations never transfer automatically.", "Breaks, revisions, and acceptance states remain visible.", "Dual review precedes admission.", "A zero-series launch must be explicitly disclosed and owner accepted."],
    correction_trigger: "An observation, definition, denominator, revision, series break, admission, or launch-boundary receipt changes.",
  },
  {
    slug: "comparison-integrity",
    title: "Comparison integrity",
    purpose: "Compare evidence chains without converting non-equivalent measures into a score or rank.",
    rules: ["Test identity, stage, geography, period, measure, method, and denominator.", "State what is comparable and what is prohibited.", "Context only remains controlling until a governed re-review changes it.", "No normalization is inferred from similar language.", "Publish the decisive evidence that could change the verdict."],
    correction_trigger: "A compatibility determination, common measure, denominator, verdict, or prohibited comparison changes.",
  },
  {
    slug: "changefeed-and-revisions",
    title: "Changefeed and revision lineage",
    purpose: "Make maintenance legible without treating activity as evidence change.",
    rules: ["Every review has a date and scope.", "No change is a reportable result.", "A material change names its affected records.", "Old states and reasons remain recoverable.", "Governed decisions invalidate earlier candidate digests."],
    correction_trigger: "A review date, affected-record list, state transition, prior-state reference, or digest is incomplete.",
  },
  {
    slug: "corrections-and-retractions",
    title: "Corrections, retractions, and contested records",
    purpose: "Provide a visible path for errors, source revisions, disputes, and withdrawn claims.",
    rules: ["Do not silently overwrite a material statement.", "Describe the original state, corrected state, reason, date, and affected routes.", "Retractions remain discoverable.", "Contested evidence keeps the dispute and adjudication authority visible.", "Rebuild and revalidate after governed changes."],
    correction_trigger: "A published statement is materially wrong, misleading, unsupported, superseded, or no longer reproducible.",
  },
  {
    slug: "launch-and-deployment-authority",
    title: "Launch, repository, hosting, and deployment authority",
    purpose: "Keep technical readiness distinct from owner acceptance and public availability.",
    rules: ["A passing build is not owner acceptance.", "A GitHub push is not a hosted deployment.", "Hosting is not public-launch authorization.", "A custom domain and DNS are separate mutations.", "The owner receipt binds the exact commit, build digest, gate snapshot, limitations, and authorization."],
    correction_trigger: "The commit, digest, gate state, accepted boundary, deployment status, domain, or authorization changes.",
  },
];

let methodRecords = methodSeeds.map((method, index) => ({
  method_id: `155-METHOD-${String(index + 1).padStart(3, "0")}`,
  slug: method.slug,
  title: method.title,
  publication_date: programStartDate,
  state: "Published method",
  purpose: method.purpose,
  rules: method.rules,
  minimum_receipt_fields: ["stable record and receipt IDs", "real decision or review date", "reviewer or authority role", "exact source or artifact identity", "candidate or artifact-set digest", "state and rationale", "affected records and routes", "limitations and reopen trigger"],
  correction_trigger: method.correction_trigger,
  route: `/review/${release}/${sectionByPhase[155]}/${method.slug}/`,
}));
methodRecords = preservePublishedRecords({ existingRegistry: existing155, key: "method_records", records: methodRecords, idKey: "method_id" });

const phase155 = makeRegistry(155, "method_records", methodRecords, {
  public_method_records: methodRecords.length,
  correction_paths: methodRecords.length,
  silent_revision_paths: 0,
  owner_only_authorizations_automated: 0,
}, publicationSnapshotMetadata(methodRecords));

const requirementTerminal = requirementPackets.filter((record) => requirementTerminalStates.has(record.decision_state) && hasNonFutureReceipt(record.decision_date, record.decision_receipt_id) && record.reviewer_role && record.rationale);
const missionTerminal = missionPackets.filter((record) => missionTerminalStates.has(record.decision_state) && hasNonFutureReceipt(record.decision_date, record.decision_receipt_id) && record.reviewer_role && record.rationale);
const authorityTerminal = gapDispositions.filter((record) => authorityTerminalStates.has(record.owner_disposition) && hasNonFutureReceipt(record.disposition_date, record.disposition_receipt_id) && record.reviewer_role && record.rationale);
const noSeriesBoundaryAccepted = phase149.no_series_launch_boundary?.owner_accepted === true && Boolean(phase149.no_series_launch_boundary?.decision_date && phase149.no_series_launch_boundary?.decision_receipt_id);
const longitudinalPassed = phase149.counts.admitted_series > 0 || noSeriesBoundaryAccepted;
const fieldGuideDepthPassed = fieldGuides.length === 17 && fieldGuides.every((guide) => (
  guide.orientation.length >= 600
  && guide.strongest_current_evidence.length >= 600
  && guide.contested_reading.length >= 500
  && guide.horizon_questions.length === 4
  && guide.evidence_annotation_ids.length > 0
  && guide.direct_evidence_source_ids.length > 0
  && guide.source_ids.length > 0
));
const reportDepthPassed = flagshipReports.length === 4 && flagshipReports.every((report) => (
  report.claim_blocks.length >= 4
  && report.authored_word_count >= 700
  && report.claim_blocks.every((claim) => claim.source_ids.length > 0)
  && JSON.stringify([...report.source_ids].sort()) === JSON.stringify(unique(report.claim_blocks.flatMap((claim) => claim.source_ids)).sort())
));
const contentDepthPassed = fieldGuideDepthPassed && reportDepthPassed;
let validationReceipt = null;
let validationPassed = false;
let ownerAccepted = false;

const launchGates = [
  {
    gate_id: "156-GATE-01-EVIDENCE-ADMISSION",
    label: "evidence admission",
    state: requirementTerminal.length === 18 && missionTerminal.length === 6 ? "Pass" : "Held",
    reason: requirementTerminal.length === 18 && missionTerminal.length === 6
      ? "All eighteen requirement and six mission decisions have valid terminal receipts."
      : `${18 - requirementTerminal.length} requirement and ${6 - missionTerminal.length} mission decision(s) still lack a valid terminal owner receipt.`,
  },
  {
    gate_id: "156-GATE-02-AUTHORITY-COVERAGE",
    label: "authority coverage",
    state: authorityTerminal.length === 12 ? "Pass" : "Held",
    reason: authorityTerminal.length === 12
      ? "All twelve gaps have dated close, carry, or exclusion dispositions."
      : `${12 - authorityTerminal.length} of twelve authority gaps still require a dated owner close, carry, or exclusion disposition; alternative discovery alone does not clear the gate.`,
  },
  { gate_id: "156-GATE-03-ATLAS-IDENTITY", label: "atlas identity", state: changefeedReviews.length === 39 ? "Pass" : "Held", reason: "All thirty-nine canonical project and place identities have a Phase 148 baseline review." },
  { gate_id: "156-GATE-04-PROJECT-CHRONICLES", label: "project chronicles", state: p136.project_chronicles.length === 24 ? "Pass" : "Held", reason: "Twenty-four stage-bounded project chronicles remain published." },
  { gate_id: "156-GATE-05-PLACE-LEDGERS", label: "place ledgers", state: p137.place_ledgers.length === 15 ? "Pass" : "Held", reason: "Fifteen receiving-system ledgers remain published without synthetic place stages." },
  {
    gate_id: "156-GATE-06-LONGITUDINAL-EVIDENCE",
    label: "longitudinal evidence",
    state: longitudinalPassed ? "Pass" : "Held",
    reason: phase149.counts.admitted_series > 0
      ? `${phase149.counts.admitted_series} compatible series has passed admission.`
      : noSeriesBoundaryAccepted
        ? "A dated owner receipt accepts a zero-series v1 boundary and excludes longitudinal claims."
        : "No series is admitted and the prepared zero-series launch boundary has not received owner acceptance.",
  },
  { gate_id: "156-GATE-07-COMPARATIVE-INTEGRITY", label: "comparative integrity", state: comparisonPassports.length === 12 && comparisonPassports.every((record) => record.verdict === "Context only") ? "Pass" : "Held", reason: "All twelve passports retain explicit compatibility limits, zero scores, and zero ranks." },
  {
    gate_id: "156-GATE-08-CONTENT-DEPTH",
    label: "content depth",
    state: contentDepthPassed ? "Pass" : "Held",
    reason: contentDepthPassed
      ? `Seventeen source-linked field guides and four reports with sixteen sourced claim blocks and at least ${phase153.counts.minimum_report_words} authored words each pass the content-depth contract.`
      : "The field-guide or report corpus fails its minimum prose, provenance, horizon-question, claim-block, or source-union contract.",
  },
  {
    gate_id: "156-GATE-09-EDITORIAL-CADENCE",
    label: "editorial cadence",
    state: editionPackets.length === 4
      && phase154.counts.future_content_prepublished === 0
      && phase154.counts.stale_publications_requiring_revalidation === 0
      && dueDeskWindowsPending.length === 0
      && dueEditionsPending.length === 0 ? "Pass" : "Held",
    reason: dueDeskWindowsPending.length === 0 && dueEditionsPending.length === 0
      ? "Four source-binding edition templates are prepared, no future content is prepublished, and every due desk window and edition has a lawful terminal receipt."
      : `${dueDeskWindowsPending.length} due desk window(s) and ${dueEditionsPending.length} due edition(s) lack lawful terminal receipts.`,
  },
  {
    gate_id: "156-GATE-10-FUTURE-GATE-INTEGRITY",
    label: "calendar gate integrity",
    state: calendarGateIntegrityPassed ? "Pass" : "Held",
    reason: calendarGateIntegrityPassed
      ? `As of ${effectiveDate}, all due operations have lawful dated receipts and every later operation remains scheduled with null decision fields.`
      : `${dueOperationIntegrityFailures.length} due or overdue operation(s) lack a lawful terminal receipt and ${futureOperationIntegrityFailures.length} future operation(s) contain predated state as of ${effectiveDate}.`,
  },
  { gate_id: "156-GATE-11-MACHINE-READABLE-CONTRACT", label: "machine-readable contract", state: "Pass", reason: "Twelve phase registries and one aggregate expose the v1 release-candidate layer as schema-1.0 JSON." },
  { gate_id: "156-GATE-12-ACCESSIBLE-STRUCTURE", label: "accessible structure", state: validationPassed ? "Pass" : "Pending build", reason: validationPassed ? `The Phase 156 receipt structurally audited ${validationReceipt.metrics?.v1rc_public_html_routes ?? 0} v1-RC routes.` : "The generated routes await a fresh production accessibility-structure audit." },
  { gate_id: "156-GATE-13-RELEASE-VALIDATION", label: "release validation", state: validationPassed ? "Pass" : "Pending build", reason: validationPassed ? `Local validation receipt ${validationReceipt.receipt_id} passed.` : "The expanded build requires a new Phase 156 validation receipt; the Phase 144 receipt is historical." },
  { gate_id: "156-GATE-14-OWNER-ACCEPTANCE", label: "owner acceptance", state: ownerAccepted ? "Pass" : "Held", reason: ownerAccepted ? `Owner receipt ${ownerReceipt.receipt_id} accepts the exact candidate digest and authorizes v1 promotion.` : "No owner receipt accepts the exact expanded-build digest and authorizes v1 promotion." },
];

const launchStateCounts = {
  launch_gates: launchGates.length,
  passed: launchGates.filter((gate) => gate.state === "Pass").length,
  held: launchGates.filter((gate) => gate.state === "Held").length,
  pending_build: launchGates.filter((gate) => gate.state === "Pending build").length,
  false_passes: 0,
};
let v1PromotionState = launchGates.every((gate) => gate.state === "Pass") ? "Ready for promotion" : "Held";
const ownerBoundaryStatements = [
  `${18 - requirementTerminal.length} requirement decision(s) and ${6 - missionTerminal.length} mission decision(s) remain unterminated.`,
  `${12 - authorityTerminal.length} authority disposition(s) remain owner-gated.`,
  phase149.counts.admitted_series === 0 ? "Zero longitudinal series are admitted." : `${phase149.counts.admitted_series} longitudinal series are admitted.`,
  "Repository publication, hosted deployment, public access, custom domain, and DNS remain separate approvals.",
];

const phase156 = makeRegistry(156, "launch_gates", launchGates, launchStateCounts, {
  audit_result: v1PromotionState === "Ready for promotion"
    ? "All computed gates pass; owner promotion remains bound to the recorded receipt."
    : `v1 remains Held: ${launchGates.filter((gate) => gate.state === "Held").map((gate) => gate.label).join(", ")}${launchGates.some((gate) => gate.state === "Pending build") ? "; local build validation pending" : ""}.`,
  v1_promotion_state: v1PromotionState,
  local_validation_receipt: validationReceipt,
  owner_acceptance_receipt: null,
  owner_packet: {
    state: validationPassed ? "Prepared for owner review" : "Awaiting fresh local validation receipt",
    candidate_git_commit: null,
    candidate_artifact_digest: validationReceipt?.artifact_digest ?? null,
    launch_gate_snapshot: launchGates.map((gate) => ({ gate_id: gate.gate_id, state: gate.state })),
    boundaries_requiring_acceptance: ownerBoundaryStatements,
    owner_receipt_contract_version: v1rcOwnerReceiptContractVersion,
    owner_receipt_archive: null,
    owner_receipt_validation_state: ownerReceiptCandidates.length > 0 ? "Rejected — candidate not yet validated" : "Not supplied",
    owner_acceptance: ownerAccepted,
    github_publication_authorized: false,
    public_launch_authorized: ownerAccepted && ownerReceipt?.public_launch_authorized === true,
    hosted_deployment_authorized: ownerAccepted && ownerReceipt?.hosted_deployment_authorized === true,
  },
});

const registries = [phase145, phase146, phase147, phase148, phase149, phase150, phase151, phase152, phase153, phase154, phase155, phase156];
const recordKeyByPhase = {
  145: "gate_operations", 146: "gap_dispositions", 147: "adjudication_records", 148: "changefeed_reviews",
  149: "longitudinal_reviews", 150: "comparison_passports", 151: "desk_review_ledgers", 152: "field_guides",
  153: "flagship_reports", 154: "edition_packets", 155: "method_records", 156: "launch_gates",
};

const aggregate = {
  schema_version: "1.0",
  program_id: "FTFN-V1-RELEASE-CANDIDATE",
  version: "1.0 release candidate",
  title: "FTFN v1 Release Candidate",
  effective_date: effectiveDate,
  status: validationPassed ? "Complete locally — v1 promotion held" : "Candidate assembled — validation pending",
  summary: "A governed operating and content layer spanning evidence gates, alternative authority sources, adjudication, Atlas maintenance, longitudinal review, comparison, field guides, flagship reports, editorial packets, public methods, and a derived v1 launch decision.",
  publication_boundaries: publicationBoundaries,
  counts: {
    phases: registries.length,
    public_html_routes: 1 + registries.reduce((sum, registry) => sum + registry.public_html_routes.length, 0),
    detail_routes: registries.reduce((sum, registry) => sum + Math.max(0, registry.public_html_routes.length - 1), 0),
    public_json_exports: registries.length + 1,
  },
  evidence_state: {
    alternative_official_artifacts_checked: alternativeArtifacts.length,
    owner_decisions_pending: phase147.counts.owner_decisions_pending,
    authority_dispositions_pending: phase146.counts.owner_dispositions_pending,
    admitted_longitudinal_series: phase149.counts.admitted_series,
    v1_promotion: v1PromotionState,
  },
  phases: registries.map((registry) => ({
    phase: registry.phase,
    title: registry.title,
    status: registry.build_status,
    hub_route: registry.routes.hub,
    public_export: registry.routes.public_export,
    counts: registry.counts,
  })),
  public_html_routes: [`/review/${release}/`, ...registries.flatMap((registry) => registry.public_html_routes)],
  public_json_exports: [...registries.flatMap((registry) => registry.public_json_exports), "/data/v1-release-candidate.json"],
};

const workPackageFilename = (registry) => `phase-${registry.phase}-${slugify(registry.title)}.md`;
const countTable = (counts) => Object.entries(counts).map(([key, value]) => `| ${key.replaceAll("_", " ")} | ${value} |`).join("\n");
const makeUpdate = (registry) => {
  const records = registry[recordKeyByPhase[registry.phase]];
  const ids = records.map((record) => Object.entries(record).find(([key]) => key.endsWith("_id"))?.[1]).filter(Boolean);
  return {
    id: `update-${programStartDate}-phase-${registry.phase}`,
    effective_date: programStartDate,
    entry_type: "Publication Promotion",
    title: `Phase ${registry.phase} publishes ${registry.title.toLowerCase()}`,
    summary: registry.summary,
    affected_record_ids: [registry.program_id, ...ids],
    related_paths: [...registry.public_html_routes, registry.routes.public_export],
    evidence_note: publicationBoundaries[0],
    materiality: "No record-state change",
    publication_effect: `Adds or updates ${registry.public_html_routes.length} public HTML route(s) and one schema-1.0 JSON export.`,
    next_check_date: null,
    work_package: `docs/work-packages/${workPackageFilename(registry)}`,
  };
};

const initialUpdateNames = registries.map((registry) => `${programStartDate}-phase-${registry.phase}.json`);
const existingRegistryByPhase = new Map([
  [145, existing145], [146, existing146], [147, existing147], [148, existing148], [149, existing149], [150, existing150],
  [151, existing151], [152, existing152], [153, existing153], [154, existing154], [155, existing155], [156, existing156],
]);
const terminalReceiptIds = (phase, registry) => {
  if (!registry) return [];
  if (phase === 145) return registry.gate_operations.flatMap((record) => record.receipt_id ? [record.receipt_id] : []);
  if (phase === 146) return registry.gap_dispositions.flatMap((record) => record.disposition_receipt_id ? [record.disposition_receipt_id] : []);
  if (phase === 147) return registry.adjudication_records.flatMap((record) => record.decision_receipt_id ? [record.decision_receipt_id] : []);
  if (phase === 149) return [...registry.longitudinal_reviews.flatMap((record) => record.decision_receipt_id ? [record.decision_receipt_id] : []), ...(registry.no_series_launch_boundary?.decision_receipt_id ? [registry.no_series_launch_boundary.decision_receipt_id] : [])];
  if (phase === 151) return registry.desk_review_ledgers.flatMap((desk) => desk.review_windows.flatMap((window) => window.receipt_id ? [window.receipt_id] : []));
  if (phase === 154) return registry.edition_packets.flatMap((record) => record.publication_receipt_id ? [record.publication_receipt_id] : []);
  // Phase 156 validation/owner authorizations are receipts *about* the exact
  // candidate digest. They live in separate append-only receipt ledgers and
  // must never enter the digest-bound content-update stream they authorize.
  if (phase === 156) return [];
  return [];
};
const lifecycleUpdates = [];
if (effectiveDate > programStartDate) {
  for (const registry of registries) {
    const prior = existingRegistryByPhase.get(registry.phase);
    const priorReceiptIds = new Set(terminalReceiptIds(registry.phase, prior));
    const newReceiptIds = terminalReceiptIds(registry.phase, registry).filter((id) => !priorReceiptIds.has(id));
    const newCandidateIds = registry.phase === 146
      ? alternativeArtifacts.map((record) => record.candidate_id).filter((id) => !(prior?.alternative_artifact_registry ?? []).some((record) => record.candidate_id === id))
      : [];
    const revisionReceiptIds = revisionMode && [148, 150, 151, 152, 153, 155].includes(registry.phase) ? [revisionReceiptId] : [];
    const affectedRecordIds = unique([...newReceiptIds, ...newCandidateIds, ...revisionReceiptIds]);
    if (!affectedRecordIds.length) continue;
    const update = {
      id: `update-${effectiveDate}-phase-${registry.phase}-lifecycle`,
      effective_date: effectiveDate,
      entry_type: "Evidence Decision",
      title: `Phase ${registry.phase} records dated v1-RC lifecycle changes`,
      summary: `Records ${affectedRecordIds.length} newly receipted decision, checked candidate, or explicit content revision without rewriting the August 31 publication event.`,
      affected_record_ids: [registry.program_id, ...affectedRecordIds],
      related_paths: [...registry.public_html_routes, registry.routes.public_export],
      evidence_note: "This append-only update records the actual transition date; it does not infer an owner decision, evidence admission, stage, outcome, deployment, or launch beyond the named receipts.",
      materiality: "Governed lifecycle transition",
      publication_effect: "Updates the live v1-RC registry while preserving the immutable initial publication update.",
      next_check_date: null,
      work_package: `docs/work-packages/${workPackageFilename(registry)}`,
    };
    const updateDigest = digest(update);
    update.id = `${update.id}-${updateDigest.slice(0, 12)}`;
    lifecycleUpdates.push({ filename: `${effectiveDate}-phase-${registry.phase}-lifecycle-${updateDigest.slice(0, 12)}.json`, update });
  }
}
const existingLifecycleUpdateNames = (await readdir(updateRoot, { withFileTypes: true }))
  .filter((entry) => entry.isFile() && /^\d{4}-\d{2}-\d{2}-phase-(?:14[5-9]|15[0-6])-lifecycle-[a-f0-9]{12}\.json$/.test(entry.name))
  .map((entry) => entry.name);
aggregate.publication_update_files = [...initialUpdateNames, ...unique([...existingLifecycleUpdateNames, ...lifecycleUpdates.map((entry) => entry.filename)]).sort()];
aggregate.counts.v1rc_update_records = aggregate.publication_update_files.length;

// Write the receipt-neutral candidate first so its content digest can select an
// immutable matching validation receipt. Receipt-derived fields are normalized
// by the shared digest contract, so embedding a matching receipt is stable.
for (const registry of registries) {
  await writeJson(join(dataRoot, exportNameByPhase[registry.phase]), registry);
  const initialUpdatePath = join(updateRoot, `${programStartDate}-phase-${registry.phase}.json`);
  if (effectiveDate === programStartDate && !publishedSnapshotLocked) await writeJson(initialUpdatePath, makeUpdate(registry));
  else if (!(await fileExists(initialUpdatePath))) throw new Error(`Missing immutable initial publication update ${initialUpdatePath}.`);
}
for (const entry of lifecycleUpdates) {
  const path = join(updateRoot, entry.filename);
  await writeImmutableJsonOrVerify(path, entry.update);
}

await writeJson(join(dataRoot, "v1-release-candidate.json"), aggregate);

const candidateArtifactDigest = await computeV1rcDigestFromDisk({ aggregate, dataRoot, updateRoot });
validationReceipt = [...validationReceipts]
  .filter((receipt) => isValidV1rcValidationReceipt({ receipt, aggregate, candidateDigest: candidateArtifactDigest }))
  .sort((a, b) => String(b.validated_at).localeCompare(String(a.validated_at)))[0] ?? null;
validationPassed = Boolean(validationReceipt);

const accessibleGate = launchGates.find((gate) => gate.gate_id === "156-GATE-12-ACCESSIBLE-STRUCTURE");
const validationGate = launchGates.find((gate) => gate.gate_id === "156-GATE-13-RELEASE-VALIDATION");
const ownerGate = launchGates.find((gate) => gate.gate_id === "156-GATE-14-OWNER-ACCEPTANCE");
accessibleGate.state = validationPassed ? "Pass" : "Pending build";
accessibleGate.reason = validationPassed
  ? `The Phase 156 receipt structurally audited ${validationReceipt.metrics.v1rc_public_html_routes} v1-RC routes.`
  : "The generated routes await a fresh production accessibility-structure audit.";
validationGate.state = validationPassed ? "Pass" : "Pending build";
validationGate.reason = validationPassed
  ? `Local validation receipt ${validationReceipt.receipt_id} passed and matches candidate digest ${candidateArtifactDigest}.`
  : "The expanded build requires a digest-matching Phase 156 validation receipt; historical or stale receipts do not pass.";

const expectedOwnerGateSnapshot = launchGates.map((gate) => ({
  gate_id: gate.gate_id,
  state: gate.gate_id === ownerGate.gate_id ? "Held" : gate.state,
}));
const verifiedGitCommit = process.env.FTFN_VERIFIED_GIT_COMMIT ?? null;
ownerReceipt = validationPassed
  ? [...ownerReceiptCandidates]
    .filter((receipt) => isValidV1rcOwnerReceipt({
      receipt,
      aggregate,
      candidateDigest: candidateArtifactDigest,
      verifiedGitCommit,
      expectedGateSnapshot: expectedOwnerGateSnapshot,
      requiredLimitations: ownerBoundaryStatements,
      effectiveDate,
    }))
    .sort((left, right) => `${right.decision_date}:${right.receipt_id}`.localeCompare(`${left.decision_date}:${left.receipt_id}`))[0] ?? null
  : null;
ownerAccepted = Boolean(ownerReceipt);
if (ownerAccepted) {
  await mkdir(ownerReceiptRoot, { recursive: true });
  await writeImmutableJsonOrVerify(join(ownerReceiptRoot, v1rcOwnerReceiptArchiveName(ownerReceipt)), ownerReceipt);
}
ownerGate.state = ownerAccepted ? "Pass" : "Held";
ownerGate.reason = ownerAccepted
  ? `Owner receipt ${ownerReceipt.receipt_id} binds the exact candidate digest, commit, fourteen-gate snapshot, and accepted limitations.`
  : "No complete owner receipt binds the exact candidate digest, commit, fourteen-gate snapshot, limitations, and v1-promotion authorization.";

// `makeRegistry` strips route fields by copying records for phases without
// detail pages. Refresh that serialized snapshot after the receipt-derived
// gate mutations so the rows and their aggregate counts cannot diverge.
phase156.launch_gates = launchGates.map(({ route: _route, ...gate }) => gate);
launchStateCounts.passed = launchGates.filter((gate) => gate.state === "Pass").length;
launchStateCounts.held = launchGates.filter((gate) => gate.state === "Held").length;
launchStateCounts.pending_build = launchGates.filter((gate) => gate.state === "Pending build").length;
v1PromotionState = launchGates.every((gate) => gate.state === "Pass") ? "Ready for promotion" : "Held";
phase156.build_status = validationPassed ? "Complete locally" : "Candidate assembled — validation pending";
phase156.audit_result = v1PromotionState === "Ready for promotion"
  ? "All computed gates pass and the owner receipt binds the exact candidate digest and commit."
  : `v1 remains Held: ${launchGates.filter((gate) => gate.state === "Held").map((gate) => gate.label).join(", ")}${launchGates.some((gate) => gate.state === "Pending build") ? "; local build validation pending" : ""}.`;
phase156.v1_promotion_state = v1PromotionState;
phase156.local_validation_receipt = validationReceipt;
phase156.owner_acceptance_receipt = ownerAccepted ? ownerReceipt : null;
phase156.owner_packet.state = ownerAccepted ? "Accepted by owner" : validationPassed ? "Prepared for owner review" : "Awaiting fresh local validation receipt";
phase156.owner_packet.candidate_git_commit = ownerAccepted ? ownerReceipt.candidate_git_commit : null;
phase156.owner_packet.candidate_git_commit_verification_state = ownerAccepted ? "Verified against FTFN_VERIFIED_GIT_COMMIT" : ownerReceiptCandidates.length > 0 ? "Rejected — no exact verified commit binding" : "Not supplied";
phase156.owner_packet.candidate_artifact_digest = validationPassed ? candidateArtifactDigest : null;
phase156.owner_packet.launch_gate_snapshot = launchGates.map((gate) => ({ gate_id: gate.gate_id, state: gate.state }));
phase156.owner_packet.owner_receipt_archive = ownerAccepted ? `phase-156-owner-receipts/${v1rcOwnerReceiptArchiveName(ownerReceipt)}` : null;
phase156.owner_packet.owner_receipt_validation_state = ownerAccepted ? "Valid" : ownerReceiptCandidates.length > 0 ? "Rejected — incomplete shared contract, digest, gate snapshot, limitation set, date, or verified commit binding" : "Not supplied";
phase156.owner_packet.owner_acceptance = ownerAccepted;
phase156.owner_packet.github_publication_authorized = ownerAccepted && ownerReceipt.github_publication_authorized === true;
phase156.owner_packet.public_launch_authorized = ownerAccepted && ownerReceipt.public_launch_authorized === true;
phase156.owner_packet.hosted_deployment_authorized = ownerAccepted && ownerReceipt.hosted_deployment_authorized === true;

aggregate.status = ownerAccepted ? "Owner accepted — promotion actions remain separate" : validationPassed ? "Complete locally — v1 promotion held" : "Candidate assembled — validation pending";
aggregate.evidence_state.v1_promotion = v1PromotionState;
const aggregatePhase156 = aggregate.phases.find((phase) => phase.phase === 156);
aggregatePhase156.status = phase156.build_status;
aggregatePhase156.counts = phase156.counts;

await writeJson(join(dataRoot, exportNameByPhase[156]), phase156);
await writeJson(join(dataRoot, "v1-release-candidate.json"), aggregate);

const phaseNextActions = {
  145: `Operate only the next due journal item, search the exact artifact and official alternatives, issue one lawful receipt, and complete every typed propagation target. Remaining unreceipted operations: ${gateOperations.filter((record) => !record.receipt_id).map((record) => `${record.lawful_date} ${record.operation_id}`).join("; ")}.`,
  146: "Have an authorized reviewer test each bound candidate set against the missing authority role and issue an independent close, carry, or exclusion receipt; discovery alone never closes a gap.",
  147: "Complete the eighteen requirement packets before the six mission conclusions, binding every terminal decision to its exact candidate-set digest, reviewer, rationale, limitations, and receipt.",
  148: "Keep this August 31 baseline immutable; publish later identity or stage changes as dated, source-bound changefeed events rather than silently rewriting the baseline.",
  149: "Run the three priority compatibility pilots under the Phase 69–70 contract or obtain a dated owner receipt accepting the disclosed zero-series launch boundary; transfer no values before admission.",
  150: "Retain Context only until exact identity, stage, period, method, denominator, and geography tests support a different governed verdict; never synthesize a score or rank.",
  151: `Operate each weekly desk window on or after its scheduled date and issue a Material change, No material change, Bounded blocker, or Rescheduled receipt. Due windows currently pending: ${dueDeskWindowsPending.length}.`,
  152: "Maintain the seventeen guides against their exact annotation, signal, direct-source, project, place, and comparison lineage; any substantive revision requires an explicit later revision receipt.",
  153: "Maintain the four reports at claim-block provenance level; revise only through the explicit revision mode with a later date, receipt, and superseded/current content digests.",
  154: `Publish each edition only on or after its calendar date from eligible decisions and sources, with reviewer, rationale, and publication receipt. Due editions currently pending: ${dueEditionsPending.length}.`,
  155: "Keep methods and correction paths public and versioned; any substantive change requires a visible later revision receipt rather than a silent overwrite.",
};
for (const registry of registries) {
  const records = registry[recordKeyByPhase[registry.phase]];
  const phase156NextAction = validationPassed
    ? `Keep receipt ${validationReceipt.receipt_id} bound to digest ${candidateArtifactDigest}; present the remaining Held gates for owner action and do not rerun finalization unless the candidate digest changes.`
    : "Run the local validation finalizer to create a new immutable content-addressed receipt, regenerate to embed it, and do not promote v1 while any gate is Held or Pending build.";
  const workPackage = `# Phase ${registry.phase} — ${registry.title}\n\n**Release:** v1 release candidate  \n**Effective date:** ${effectiveDate}  \n**Status:** ${registry.build_status}\n\n## Objective\n\n${registry.summary}\n\n## Delivered contract\n\n- Program: \`${registry.program_id}\`\n- Dataset: \`${registry.dataset}\`\n- Hub: \`${registry.routes.hub}\`\n- JSON: \`${registry.routes.public_export}\`\n- Inspectable records: ${records.length}\n- Public routes: ${registry.public_html_routes.length}\n\n| Measure | Value |\n| --- | ---: |\n${countTable(registry.counts)}\n\n## Acceptance rules\n\n- Every upstream ID remains resolvable to its stated record kind.\n- Every detail route is canonical, indexable, present in the sitemap, and represented in the aggregate route inventory.\n- Every future gate or edition retains a null decision and receipt until its lawful date; every due gate requires a lawful terminal receipt.\n- Alternative official artifacts remain candidates until a dated authorized decision admits or disposes them.\n- No stage, observation, series, outcome, comparison verdict, score, rank, recommendation, owner decision, deployment, or public launch is inferred.\n\n## Publication boundaries\n\n${publicationBoundaries.map((boundary) => `- ${boundary}`).join("\n")}\n\n## Next action\n\n${registry.phase === 156 ? phase156NextAction : `Operate the Phase ${registry.phase} record set through its stated receipt, calendar, and owner boundaries.`}\n`;
  const renderedWorkPackage = registry.phase === 156
    ? workPackage
    : workPackage.replace(`Operate the Phase ${registry.phase} record set through its stated receipt, calendar, and owner boundaries.`, phaseNextActions[registry.phase]);
  await writeFile(join(workPackageRoot, workPackageFilename(registry)), renderedWorkPackage, "utf8");
}

const roadmap = `# FTFN v1 release-candidate roadmap\n\n**Effective date:** ${effectiveDate}  \n**Scope:** Phases 145–156\n\n## Outcome\n\nThe v1 release-candidate layer is assembled without rewriting the dated v0.9 snapshot. All immediately executable research, content, method, route, and audit work is complete. Calendar-bound gates, owner adjudications, the no-series boundary, and owner launch acceptance remain explicit.\n\n## Phase inventory\n\n| Phase | Program | Records | Routes | State |\n| ---: | --- | ---: | ---: | --- |\n${registries.map((registry) => `| ${registry.phase} | ${registry.title} | ${registry[recordKeyByPhase[registry.phase]].length} | ${registry.public_html_routes.length} | ${registry.build_status} |`).join("\n")}\n\n## Immediate result\n\n- ${alternativeArtifacts.length} alternative official artifacts checked and mapped across all twelve authority gaps.\n- ${adjudicationRecords.length} owner decision packets prepared without fabricating a decision.\n- ${changefeedReviews.length} Atlas baseline reviews completed with zero synthetic stage changes.\n- ${longitudinalReviews.length} longitudinal reviews completed; ${phase149.counts.pilot_reviews_ready} pilots are ready for governed compatibility testing; zero values transferred.\n- ${comparisonPassports.length} comparison passports retain Context only.\n- ${fieldGuides.length} topic field guides and ${flagshipReports.length} flagship reports published.\n- ${methodRecords.length} public method and correction records published.\n- Four future September edition packets remain empty and time-gated.\n\n## Remaining gates\n\n${launchGates.filter((gate) => gate.state !== "Pass").map((gate) => `- **${gate.label}: ${gate.state}.** ${gate.reason}`).join("\n")}\n\n## Calendar\n\n${gateOperations.filter((record) => record.time_gated).map((record) => `- ${record.lawful_date}: \`${record.operation_id}\` — ${record.title}`).join("\n")}\n\n## Promotion rule\n\nv1 may be promoted only when the derived Phase 156 audit has fourteen Pass states and an owner receipt binds the exact candidate digest. GitHub publication, hosting, public access, domain attachment, and DNS remain separate actions.\n`;
const initialCalendarRows = gateOperations.filter((record) => record.time_gated).map((record) => `- ${record.lawful_date}: \`${record.operation_id}\` — ${record.title}`).join("\n");
const phase145CalendarRows = gateOperations.filter((record) => !record.receipt_id).map((record) => `- ${record.lawful_date}: Phase 145 \`${record.operation_id}\` — ${record.title}${record.lawful_date > effectiveDate ? " (future; do not operate early)" : " (due; requires a lawful receipt)"}`);
const groupedPhase151CalendarRows = septemberReviewDates.map((date) => {
  const windows = deskReviewWindows.filter((window) => window.scheduled_date === date);
  const stateSummary = [...new Set(windows.map((window) => window.state))].sort().map((state) => `${windows.filter((window) => window.state === state).length} ${state}`).join("; ");
  return `- ${date}: Phase 151 — ${windows.length} desk review windows (${stateSummary}).`;
});
const phase154CalendarRows = editionPackets.map((packet) => `- ${packet.publication_date}: Phase 154 \`${packet.edition_packet_id}\` — ${packet.title} (${packet.state}).`);
const currentCalendarRows = [
  ...(phase145CalendarRows.length ? phase145CalendarRows : ["- Phase 145 — no unreceipted operation remains in the current journal."]),
  ...groupedPhase151CalendarRows,
  ...phase154CalendarRows,
].join("\n");
const futureEditionCount = editionPackets.filter((packet) => packet.publication_date > effectiveDate).length;
let renderedRoadmap = roadmap
  .replace(
    `- ${fieldGuides.length} topic field guides and ${flagshipReports.length} flagship reports published.`,
    `- ${fieldGuides.length} source-linked topic field guides and ${flagshipReports.length} flagship reports published with ${phase153.counts.claim_blocks} sourced claim blocks and ${phase153.counts.authored_words.toLocaleString("en-US")} authored words.`,
  )
  .replace("- Four future September edition packets remain empty and time-gated.", `- ${futureEditionCount} future September edition packet(s) remain empty and time-gated; ${phase154.counts.published_editions} have a lawful publication receipt and ${phase154.counts.due_editions_pending} are due.`);
renderedRoadmap = initialCalendarRows
  ? renderedRoadmap.replace(initialCalendarRows, currentCalendarRows)
  : renderedRoadmap.replace("## Calendar\n\n\n\n## Promotion rule", `## Calendar\n\n${currentCalendarRows}\n\n## Promotion rule`);
await writeFile(join(docsRoot, "roadmap-v1-release-candidate.md"), renderedRoadmap, "utf8");

const handoff = `# FTFN v1 release-candidate session handoff\n\n**Effective date:** ${effectiveDate}  \n**Current state:** ${aggregate.status}\n\n## Read first\n\n1. \`docs/roadmap-v1-release-candidate.md\`\n2. \`app/src/data/phase-145-evidence-gate-operations-journal.json\`\n3. \`app/src/data/phase-146-authority-gap-resolution-program.json\`\n4. \`app/src/data/phase-147-evidence-adjudication-record.json\`\n5. \`app/src/data/phase-149-longitudinal-evidence-lab.json\`\n6. \`app/src/data/phase-156-v1-launch-decision.json\`\n\n## Completed now\n\n- Phases 145–156 are generated as a v1 release candidate.\n- Alternative official-source shelves, field guides, reports, method records, route inventories, and derived audit contracts are complete.\n- Historical Phase 130–144 source checks, decisions, and validation receipt remain unchanged.\n\n## Do not automate\n\n- Future-dated Phase 60 or Phase 61 decisions.\n- Requirement or mission owner adjudication.\n- Authority close/carry/exclusion disposition.\n- Acceptance of the zero-series launch boundary.\n- Owner acceptance, public launch, hosting, custom domain, or DNS.\n\n## Validation sequence\n\nRun from \`app/\`:\n\n\`\`\`text\nnpm run build:v1rc-content\nnpm run validate:candidates\nnpm run validate:content\nnpm run source:health\nnpm run test:v1rc\nnpm run check\nnpm run build\nnpm run verify:v1rc\nnpm run finalize:v1rc-validation\nnpm run build:v1rc-content\nnpm run build\nnpm run verify:v1rc\nnpm run update:v1rc-manifest\nnpm run verify:release\n\`\`\`\n\n## Current launch truth\n\n${launchGates.map((gate) => `- ${gate.state}: ${gate.label} — ${gate.reason}`).join("\n")}\n`;
const legacyValidationSequence = "npm run build:v1rc-content\nnpm run validate:candidates\nnpm run validate:content\nnpm run source:health\nnpm run test:v1rc\nnpm run check\nnpm run build\nnpm run verify:v1rc\nnpm run finalize:v1rc-validation\nnpm run build:v1rc-content\nnpm run build\nnpm run verify:v1rc\nnpm run update:v1rc-manifest\nnpm run verify:release";
const currentValidationSequence = validationPassed
  ? "npm run build:v1rc-content\nnpm run validate:candidates\nnpm run validate:content\nnpm run source:health\nnpm run test:v1rc\nnpm run check\nnpm run build\nnpm run verify:v1rc\nnpm run update:v1rc-manifest\nnpm run verify:release"
  : legacyValidationSequence;
const validationGuidance = validationPassed
  ? `Receipt \`${validationReceipt.receipt_id}\` is immutable and matches the current normalized candidate digest. Do not rerun the finalizer unless that digest changes.`
  : "No immutable receipt matches the current normalized candidate digest. Run the finalizer only after the pre-receipt checks pass, then regenerate once to embed the new receipt.";
const renderedHandoff = handoff
  .replace("## Validation sequence\n\nRun from `app/`:", `## Validation sequence\n\n${validationGuidance}\n\nRun from \`app/\`:`)
  .replace(legacyValidationSequence, currentValidationSequence)
  .replace("Alternative official-source shelves, field guides, reports, method records", "Alternative official-source shelves, source-linked field guides, sourced reports, method records");
await writeFile(join(docsRoot, "session-handoff-v1-release-candidate.md"), renderedHandoff, "utf8");

console.log(`Built Phases 145–156: ${aggregate.counts.public_html_routes} v1-RC routes, ${aggregate.counts.public_json_exports} exports, ${alternativeArtifacts.length} alternative official artifacts, ${fieldGuides.length} field guides, ${flagshipReports.length} reports, and v1 ${v1PromotionState}.`);
