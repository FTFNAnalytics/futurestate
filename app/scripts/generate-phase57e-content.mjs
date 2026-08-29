import { mkdir, readFile, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

const appRoot = fileURLToPath(new URL("..", import.meta.url));
const contentRoot = join(appRoot, "src", "content");
const dataRoot = join(appRoot, "src", "data");
const capturedDate = "2026-08-03";
const collectionSlug = "asset-reliability-cohort-adoption-accepted-output-closure-2026";
const collectionId = "research-collection-" + collectionSlug;
const briefingId = "briefing-research-watch-035-asset-reliability-cohort-adoption-accepted-output-closure";
const json = (value) => JSON.stringify(value, null, 2) + "\n";
const writeJson = async (path, value) => writeFile(path, json(value), "utf8");
const yamlList = (name, items) => [name + ":", ...items.map((item) => "  - " + JSON.stringify(item))].join("\n");
const appendUnique = (items, additions) => [...new Set([...(items ?? []), ...additions])];

for (const name of ["sources", "research-documents", "signals", "research-collections", "briefings", "updates"]) {
  await mkdir(join(contentRoot, name), { recursive: true });
}

const phase57d = JSON.parse(await readFile(join(dataRoot, "phase-57d-persistent-service-quality-compatible-time-series-replication.json"), "utf8"));
if (phase57d.phase !== "57D" || phase57d.records.length !== 20) throw new Error("Phase 57E requires the complete Phase 57D ledger.");

const agencyMeta = {
  DOT: { entity: "agency-dot", topics: ["Mobility", "Policy and Standards", "Finance and Risk"], layers: ["Enabling Infrastructure", "Human Systems"], gaps: ["gap-015", "gap-016"] },
  NTIA: { entity: "agency-ntia", topics: ["Chips and Compute", "Policy and Standards", "Finance and Risk"], layers: ["Enabling Infrastructure", "Human Systems"], gaps: ["gap-016"] },
  DOE: { entity: "agency-doe", topics: ["Energy", "Policy and Standards", "Finance and Risk"], layers: ["Enabling Infrastructure", "Resource Foundations"], gaps: ["gap-008", "gap-016"] },
};

const sources = [
  {
    id: "source-57e-amtrak-accessibility-progress-june-2026",
    name: "Amtrak Accessibility Progress Report under the Accessible Canada Act, June 2026",
    url: "https://www.amtrak.com/content/dam/projects/dotcom/english/public/documents/corporate/foia/amtrak-accessibility-plan-feedback-process-canada-act-0626.pdf",
    owner: "National Railroad Passenger Corporation",
    agency: "DOT",
    frequency: "Annual",
    access: "Report Series",
    limitation: "The report gives aggregate accessibility inventories, remediation statements, and engagement activity, but it does not publish station- or equipment-level uptime, outages, maintenance, actual use, complaints, resolution time, boarding time, or rider outcomes.",
  },
  {
    id: "source-57e-montana-bead-faq-july-2026",
    name: "ConnectMT BEAD Frequently Asked Questions, July 2026",
    url: "https://doa.mt.gov/ConnectMT/iija/iija-faq",
    owner: "Montana Department of Administration",
    agency: "NTIA",
    frequency: "Event Driven",
    access: "Manual Page Check",
    limitation: "The FAQ defines performance thresholds, subscriber sampling, connected-location, closeout, and reporting rules. It does not publish a completed awardee result, subscriber list, test table, or accepted closeout.",
  },
  {
    id: "source-57e-montana-quarterly-report-instructions-june-2026",
    name: "ConnectMT BEAD Quarterly Report Instructions for Terrestrial Projects, June 2026",
    url: "https://doa.mt.gov/_docs/connectmt/Quarterly-Report-Instructions-Terrestrial-6.1.26.pdf",
    owner: "Montana Department of Administration",
    agency: "NTIA",
    frequency: "Quarterly",
    access: "Report Series",
    limitation: "The instructions define required served-location and reporting templates but do not contain completed quarterly results for an awardee.",
  },
  {
    id: "source-57e-montana-project-monitoring-guide-june-2026",
    name: "ConnectMT BEAD Project Monitoring Guide, June 2026",
    url: "https://doa.mt.gov/_docs/connectmt/BEAD-Project-Subgrantee-Monitoring-Guide-6.1.26.pdf",
    owner: "Montana Department of Administration",
    agency: "NTIA",
    frequency: "Event Driven",
    access: "Report Series",
    limitation: "The guide specifies active-subscriber, performance-test, desk-review, and field-validation evidence but does not publish an awardee's measured outcomes.",
  },
  {
    id: "source-57e-gao-nnsa-production-modernization-integration",
    name: "GAO-24-106342: NNSA Production Modernization Integration",
    url: "https://www.gao.gov/products/gao-24-106342",
    owner: "U.S. Government Accountability Office",
    agency: "DOE",
    frequency: "Event Driven",
    access: "Report Series",
    limitation: "GAO closes four requirements-and-governance recommendations as implemented. Those closures do not establish that a complete plutonium-modernization enterprise schedule or lifecycle-cost estimate is public, sufficient under GAO-23-104661, or paired with recurring qualified output.",
  },
  {
    id: "source-57e-doe-hanford-acceptable-glass-startup",
    name: "DOE EM: The Hanford Site Begins Solidifying Tank Waste in Glass",
    url: "https://www.energy.gov/em/articles/hanford-site-begins-solidifying-tank-waste-glass",
    owner: "U.S. Department of Energy, Office of Environmental Management",
    agency: "DOE",
    frequency: "Event Driven",
    access: "Release Page",
    limitation: "DOE reports that the October 2025 acceptable-quality glass consent-decree milestone was met. The release does not provide a complete monthly mass balance, exact quality yield, rejects, rework, downtime, compliance table, unit cost, or residual inventory.",
  },
  {
    id: "source-57e-hanford-dflaw-current-program-page",
    name: "Hanford Direct-Feed Low-Activity Waste Program Page, July 2026",
    url: "https://www.hanford.gov/page.cfm/DFLAW",
    owner: "U.S. Department of Energy Hanford Field Office",
    agency: "DOE",
    frequency: "Event Driven",
    access: "Manual Page Check",
    limitation: "The current program page describes the integrated DFLAW operating chain but does not publish a reconciled monthly table spanning feed, glass, containers, quality release, shipment, acceptance, disposal, effluent, rejects, rework, downtime, compliance, cost, and residual inventory.",
  },
];

for (const source of sources) {
  const meta = agencyMeta[source.agency];
  await writeJson(join(contentRoot, "sources", source.id + ".json"), {
    id: source.id,
    name: source.name,
    url: source.url,
    source_type: "Government Agency",
    credibility_level: "Tier 1",
    primary_topics: meta.topics,
    framework_layers: meta.layers,
    country_or_region: "United States",
    update_frequency: source.frequency,
    capture_priority: "High",
    known_limitations: source.limitation,
    last_checked_date: capturedDate,
    watch_lanes: ["Security and Standards", "Cross-Cutting Official Rails"],
    live_access_type: source.access,
    review_cadence_days: source.frequency === "Quarterly" ? 92 : source.frequency === "Annual" ? 365 : 45,
    monitoring_status: "Active",
    coverage_role: ["Primary Data", "Source Freshness"],
    jurisdiction: "United States public-sector program",
    source_owner: source.owner,
    notes: "Phase 57E asset reliability, cohort adoption, and accepted-output closure source. Collection: " + collectionSlug + ".",
  });
}

const specs = [
  {
    slug: "amtrak-pids-cross-report-reconciliation",
    agency: "DOT",
    actionKey: "AMTRAK-PIDS-CROSS-REPORT-RECONCILIATION-2026-01",
    stage: "Asset-quality reconciliation",
    status: "Published",
    publicationDate: "2026-06-01",
    sourceIds: ["source-57e-amtrak-accessibility-progress-june-2026", "source-57b-amtrak-ada-progress-june-2026"],
    title: "Amtrak's June 2026 reports publish incompatible PIDS completion inventories",
    finding: "Amtrak's ADA report lists 93 completed PIDS deployments while its Accessible Canada Act report lists 117 completed PIDS installations for the same April 2026 reporting horizon.",
    denominator: "Two Amtrak accessibility reports dated June 2026, preserving the 93-deployment and 117-installation labels as separate unresolved inventories rather than merging them.",
    limits: ["The reports do not define whether deployments and installations cover different scopes, stations, devices, or closeout states.", "Neither count establishes accepted FRA closeout, operating availability, uptime, actual use, or rider benefit.", "The 24-record difference prevents a single PIDS completion denominator without a published crosswalk."],
    next: "Publish a station- and device-level crosswalk explaining scope, revision, closeout, operational status, uptime, defects, maintenance, actual use, complaints, and rider outcomes.",
  },
  {
    slug: "amtrak-induction-loop-cohort-boundary",
    agency: "DOT",
    actionKey: "AMTRAK-INDUCTION-LOOP-COHORT-2026-01",
    stage: "Asset-quality reconciliation",
    status: "Published",
    publicationDate: "2026-06-01",
    sourceIds: ["source-57e-amtrak-accessibility-progress-june-2026"],
    title: "Amtrak defines a 118-station induction-loop target without a current operating denominator",
    finding: "Amtrak plans twenty additional induction-loop installations in fiscal 2026, which it says would bring the total to 118 stations, with remaining staffed stations planned for fiscal 2027.",
    denominator: "The stated 20-addition and 118-total planning cohort; the report does not separately state the current installed, accepted, available, or used count.",
    limits: ["The implied prior inventory is not treated as an exact reported observation.", "A planned installation cohort is not accepted service or operating availability.", "No staffed-station denominator, uptime, maintenance, use, complaint, or hearing-access outcome is disclosed."],
    next: "Publish the named staffed-station cohort with installed, accepted, available, maintained, used, complained, and remediated status by period.",
  },
  {
    slug: "amtrak-digital-accessibility-defect-remediation",
    agency: "DOT",
    actionKey: "AMTRAK-DIGITAL-ACCESSIBILITY-REMEDIATION-2026-01",
    stage: "Asset-quality reconciliation",
    status: "Published",
    publicationDate: "2026-06-01",
    sourceIds: ["source-57e-amtrak-accessibility-progress-june-2026"],
    title: "Amtrak reports core booking-flow accessibility defects remediated with one mobile exception",
    finding: "Amtrak reports that all core booking-flow accessibility issues were remediated after audits and that all outstanding digital accessibility defects were closed except the mobile-app landscape requirement.",
    denominator: "The operator's current digital accessibility defect inventory as described in the June 2026 progress report, with one named exception and no defect-level table.",
    limits: ["The report does not publish defect IDs, discovery dates, closure dates, severity, recurrence, or independent test results.", "Operator-reported remediation is not a station-asset reliability measure.", "The remaining mobile landscape requirement prevents a claim of complete digital accessibility closure."],
    next: "Publish the defect register, independent verification method, recurrence rate, time to repair, affected journeys, and user outcome measures.",
  },
  {
    slug: "amtrak-pids-closeout-quality-hold",
    agency: "DOT",
    actionKey: "AMTRAK-PIDS-CLOSEOUT-HOLD-2026-04",
    parentHold: "AMTRAK-PIDS-CLOSEOUT-HOLD-2026-03",
    stage: "Asset reliability hold",
    status: "In Review",
    publicationDate: "2026-06-01",
    sourceIds: ["source-57e-amtrak-accessibility-progress-june-2026", "source-57b-amtrak-ada-progress-june-2026"],
    title: "Amtrak PIDS closeout hold: two completion counts and no accepted asset register remain",
    finding: "Both June reports still describe PIDS closeout as pending while publishing incompatible completion counts and no accepted station-asset register.",
    denominator: "The unresolved 93-deployment and 117-installation inventories plus the pending FRA or financial closeout state.",
    limits: ["A target closeout date is not accepted closeout.", "Conflicting aggregate inventories do not identify the accepted asset cohort.", "No uptime, outage, defect, maintenance, use, complaint, or rider-experience series is public."],
    next: "Reopen only with accepted closeout, a reconciled station-device register, and compatible operating-quality observations.",
  },
  {
    slug: "amtrak-named-asset-reliability-hold",
    agency: "DOT",
    actionKey: "AMTRAK-NAMED-RELIABILITY-HOLD-2026-03",
    parentHold: "AMTRAK-NAMED-RELIABILITY-HOLD-2026-02",
    stage: "Asset reliability hold",
    status: "In Review",
    publicationDate: "2026-06-01",
    sourceIds: ["source-57e-amtrak-accessibility-progress-june-2026", "source-57b-amtrak-ada-progress-june-2026"],
    title: "Amtrak named-asset reliability hold: complaint processes remain aggregate",
    finding: "Amtrak describes continuous audits, defect remediation, complaint resolution, and stakeholder meetings but does not link outcomes to named stations, PIDS devices, bridge plates, ramps, or induction loops.",
    denominator: "The exact named accessibility assets in the Phase 57D cohorts, requiring asset-period uptime, outage, maintenance, actual-use, complaint, resolution, boarding-time, and rider-experience fields.",
    limits: ["A process description is not a measured reliability outcome.", "Aggregate meetings do not disclose complaint volume, resolution time, recurrence, or asset identity.", "Digital defect remediation does not establish physical-asset service quality."],
    next: "Reopen with stable asset identifiers and compatible asset-period reliability, use, complaint, and rider-outcome tables.",
  },
  {
    slug: "montana-bead-speed-acceptance-control",
    agency: "NTIA",
    actionKey: "MT-BEAD-SPEED-ACCEPTANCE-CONTROL-2026-01",
    stage: "Adoption and retention acceptance control",
    status: "Published",
    publicationDate: "2026-07-01",
    sourceIds: ["source-57e-montana-bead-faq-july-2026", "source-57e-montana-project-monitoring-guide-june-2026"],
    title: "Montana BEAD defines an 80-by-80 speed acceptance threshold",
    finding: "ConnectMT states that 80 percent of download and upload measurements must reach at least 80 percent of the required speed tier, with upload and download assessed separately.",
    denominator: "The tested active-subscriber sample for each speed tier and technology type under the BEAD performance-monitoring method.",
    limits: ["The threshold is an acceptance control, not a published awardee result.", "No project-specific sample, measurement distribution, failure count, or remediation result is public.", "Passing speed does not establish adoption, retention, affordability, complaints, or availability."],
    next: "Publish project-level sample selection, measurements, pass-fail results, exceptions, corrective actions, and retest outcomes.",
  },
  {
    slug: "montana-bead-latency-acceptance-control",
    agency: "NTIA",
    actionKey: "MT-BEAD-LATENCY-ACCEPTANCE-CONTROL-2026-01",
    stage: "Adoption and retention acceptance control",
    status: "Published",
    publicationDate: "2026-07-01",
    sourceIds: ["source-57e-montana-bead-faq-july-2026", "source-57e-montana-project-monitoring-guide-june-2026"],
    title: "Montana BEAD defines a 95-percent latency acceptance threshold",
    finding: "ConnectMT requires 95 percent of measured latency observations to be at or below 100 milliseconds.",
    denominator: "The compliant active-subscriber performance-test sample for each relevant speed tier and technology.",
    limits: ["The standard is not an observed project result.", "No awardee latency distribution, exception, retest, or corrective-action record is public.", "Latency compliance alone does not establish adoption, retention, price, complaints, or service availability."],
    next: "Publish project-level latency samples, measurement periods, pass-fail decisions, exceptions, corrective actions, and retests.",
  },
  {
    slug: "montana-bead-availability-acceptance-control",
    agency: "NTIA",
    actionKey: "MT-BEAD-AVAILABILITY-ACCEPTANCE-CONTROL-2026-01",
    stage: "Adoption and retention acceptance control",
    status: "Published",
    publicationDate: "2026-07-01",
    sourceIds: ["source-57e-montana-bead-faq-july-2026", "source-57e-montana-project-monitoring-guide-june-2026"],
    title: "Montana BEAD defines an annual outage acceptance threshold below 48 hours",
    finding: "ConnectMT requires a provider to show average outage time across its locations below 48 hours per calendar year.",
    denominator: "The provider's tested BEAD locations over a calendar year under the required availability method.",
    limits: ["The requirement is not a disclosed provider result.", "An average can conceal location-level outage concentration without the underlying distribution.", "Availability compliance does not establish subscription, retention, affordability, speed, latency, complaints, or accepted closeout."],
    next: "Publish location-level outage periods, exclusions, averages, distributions, corrective actions, and acceptance decisions.",
  },
  {
    slug: "montana-bead-active-subscriber-test-control",
    agency: "NTIA",
    actionKey: "MT-BEAD-ACTIVE-SUBSCRIBER-TEST-CONTROL-2026-01",
    stage: "Adoption and retention acceptance control",
    status: "Published",
    publicationDate: "2026-07-01",
    sourceIds: ["source-57e-montana-bead-faq-july-2026", "source-57e-montana-quarterly-report-instructions-june-2026", "source-57e-montana-project-monitoring-guide-june-2026"],
    title: "Montana BEAD requires active-subscriber sampling and subscriber evidence at closeout",
    finding: "ConnectMT requires random active-subscriber performance samples at least annually and expects the closeout package to include a subscriber-location list, performance data, final buildout map, and as-built documentation.",
    denominator: "The complete active-subscriber population for each project area, speed tier, and technology, from which a compliant random test sample is selected.",
    limits: ["The rules do not disclose a current subscriber population or adoption rate.", "A subscriber list submitted privately is not automatically a public dataset.", "Sampling and closeout requirements are not evidence that a project has passed."],
    next: "Publish privacy-safe project totals for eligible, serviceable, installed, subscribed, tested, retained, failed, remediated, and accepted locations.",
  },
  {
    slug: "louisiana-nextlink-adoption-hold",
    agency: "NTIA",
    actionKey: "LA-BEAD-NEXTLINK-VALIDATION-HOLD-2026-04",
    parentHold: "LA-BEAD-NEXTLINK-VALIDATION-HOLD-2026-03",
    stage: "Adoption and retention result hold",
    status: "In Review",
    publicationDate: "2026-05-13",
    sourceIds: ["source-57b-louisiana-nextlink-first-bead-tower", "source-57e-montana-bead-faq-july-2026"],
    title: "Louisiana 104-location adoption hold: serviceability still lacks subscriber outcomes",
    finding: "The Nextlink tower makes service available to 104 BEAD locations, but no compatible installed, subscribed, tested, retained, priced, complained, or accepted-closeout results are public for that cohort.",
    denominator: "The same 104 Bossier Parish BEAD locations, followed from serviceability through installation, subscription, performance testing, retention, price, complaint, remediation, and accepted closeout.",
    limits: ["Service availability is not installation or subscription.", "Montana's acceptance controls clarify needed fields but are not Louisiana results.", "No stable public subscriber or retention denominator is available."],
    next: "Reopen with privacy-safe counts for all 104 locations at each adoption and acceptance stage.",
  },
  {
    slug: "louisiana-starlink-adoption-hold",
    agency: "NTIA",
    actionKey: "LA-BEAD-STARLINK-HOLD-2026-04",
    parentHold: "LA-BEAD-STARLINK-HOLD-2026-03",
    stage: "Adoption and retention result hold",
    status: "In Review",
    publicationDate: "2026-07-17",
    sourceIds: ["source-57b-louisiana-starlink-bead-agreement", "source-57e-montana-bead-faq-july-2026"],
    title: "Louisiana Starlink adoption hold: 10,635 planned locations remain a forward cohort",
    finding: "Louisiana's agreement identifies 10,635 planned locations and an end-of-summer availability target, but no activated, installed, subscribed, tested, retained, priced, complained, or accepted-closeout results are public.",
    denominator: "The same 10,635 agreement locations, reconciled to eligible, activated, installed, subscribed, tested, retained, complained, remediated, and accepted-closeout states.",
    limits: ["An agreement and target date are not operating results.", "Availability is not adoption or retention.", "No location-level activation or privacy-safe subscriber table is public."],
    next: "Reopen after location activation with stable denominators, subscriber outcomes, performance tests, retention, price, complaints, and accepted closeout.",
  },
  {
    slug: "montana-quarterly-results-hold",
    agency: "NTIA",
    actionKey: "MT-BEAD-QUARTERLY-HOLD-2026-04",
    parentHold: "MT-BEAD-QUARTERLY-HOLD-2026-03",
    stage: "Adoption and retention result hold",
    status: "In Review",
    publicationDate: "2026-07-01",
    sourceIds: ["source-57e-montana-bead-faq-july-2026", "source-57e-montana-quarterly-report-instructions-june-2026", "source-57e-montana-project-monitoring-guide-june-2026", "source-57b-montana-bead-quarterly-report-june-2026"],
    title: "Montana BEAD results hold: controls are public but completed awardee tables are not",
    finding: "Montana publishes reporting instructions, acceptance thresholds, subscriber-test requirements, and closeout evidence rules, but no completed awardee quarterly or closeout result table is public.",
    denominator: "Each stable awardee project and its approved BSL cohort, with served, subscribed, tested, retained, failed, remediated, and accepted counts by period.",
    limits: ["Instructions and FAQs are not submitted results.", "A blank served-location template cannot establish zero or nonzero delivery.", "No project-specific performance, subscriber, complaint, or acceptance outcome is public."],
    next: "Reopen with completed privacy-safe quarterly and closeout tables plus state acceptance and corrective-action decisions.",
  },
  {
    slug: "hanford-acceptable-glass-milestone",
    agency: "DOE",
    actionKey: "HANFORD-WTP-ACCEPTABLE-GLASS-MILESTONE-2026-01",
    stage: "Accepted-output closure",
    status: "Published",
    publicationDate: "2025-10-15",
    sourceIds: ["source-57e-doe-hanford-acceptable-glass-startup", "source-57e-hanford-dflaw-current-program-page"],
    title: "Hanford met the consent-decree milestone for acceptable-quality immobilized glass",
    finding: "DOE states that the Low-Activity Waste Facility met the October 15, 2025 consent-decree milestone demonstrating its ability to produce immobilized glass of acceptable quality.",
    denominator: "The specific consent-decree startup milestone for acceptable-quality LAW glass, kept separate from recurring monthly quality yield, production rate, shipment, disposal, and environmental outcomes.",
    limits: ["A demonstrated ability is not a sustained production rate.", "The release does not publish exact accepted containers, rejects, rework, or quality yield.", "DOE's milestone statement is not a complete monthly regulator-verified mass balance."],
    next: "Publish acceptance authority, test method, accepted and rejected container counts, quality yield, rework, downtime, and recurring monthly performance.",
  },
  {
    slug: "hanford-regulator-filled-container-snapshot",
    agency: "DOE",
    actionKey: "HANFORD-WTP-REGULATOR-FILLED-CONTAINER-2026-01",
    stage: "Accepted-output closure",
    status: "Published",
    publicationDate: "2026-05-01",
    sourceIds: ["source-57b-ecology-wtp-byproduct-response-comments", "source-57e-doe-hanford-acceptable-glass-startup"],
    title: "Washington Ecology anchors 50,000 treated gallons to 34 filled containers",
    finding: "Washington Ecology's final permit-response record states that about 50,000 gallons had been treated and 34 containers filled as of February 2026.",
    denominator: "A regulator-published dated operating snapshot linking approximate treated feed volume to a filled-container count, without inferring quality acceptance or disposal.",
    limits: ["Filled containers are not necessarily quality-released, shipped, accepted, or disposed.", "The approximate gallon threshold prevents an exact conversion yield.", "No reject, rework, downtime, compliance, cost, or residual inventory table is supplied."],
    next: "Add exact monthly feed, glass mass, filled, quality-released, rejected, reworked, shipped, accepted, and disposed quantities.",
  },
  {
    slug: "hanford-filled-shipped-disposed-stage-crosswalk",
    agency: "DOE",
    actionKey: "HANFORD-WTP-CONTAINER-STAGE-CROSSWALK-2026-01",
    stage: "Accepted-output closure",
    status: "Published",
    publicationDate: "2026-07-10",
    sourceIds: ["source-57b-ecology-wtp-byproduct-response-comments", "source-57b-hanford-wtp-project-managers-may-2026", "source-56x-hanford-first-ilaw-disposal-2026"],
    title: "Hanford's 34 filled, 66 shipped, and first-disposal observations remain distinct cohorts",
    finding: "Official records report 34 containers filled by February, 66 shipped to IDF by the May meeting, and the first permanent disposal event with about 30 containers staged, but they do not publish a one-to-one container identity reconciliation.",
    denominator: "Three dated container-stage observations under different authorities and reporting dates, preserved as filled, shipped, staged, and disposed rather than collapsed into a single throughput count.",
    limits: ["The observations do not prove that the same containers appear in every stage.", "Shipment to IDF is not identical to acceptance or permanent disposal.", "The first-disposal release does not publish an exact disposed total."],
    next: "Publish stable container IDs and monthly counts for fill, quality release, reject, rework, shipment, receipt, acceptance, and disposal.",
  },
  {
    slug: "hanford-emf-concentrate-permit-closure",
    agency: "DOE",
    actionKey: "HANFORD-EMF-CONCENTRATE-PERMIT-CLOSURE-2026-01",
    stage: "Accepted-output closure",
    status: "Published",
    publicationDate: "2026-06-25",
    sourceIds: ["source-57b-ecology-wtp-byproduct-response-comments", "source-57e-hanford-dflaw-current-program-page"],
    title: "Washington Ecology's EMF concentrate permit modification became effective June 25",
    finding: "Washington Ecology's final response records a June 25, 2026 effective date for the WTP permit modification enabling EMF concentrate to be grouted and shipped out of state for commercial disposal.",
    denominator: "The final regulatory authorization for the EMF concentrate route, kept separate from actual batches grouted, shipped, accepted, and disposed.",
    limits: ["Permit effectiveness is not proof that a concentrate batch completed the new route.", "The record does not quantify actual grouted, shipped, accepted, or disposed volume.", "A process change does not establish cost savings or environmental outcomes."],
    next: "Publish batch IDs, volumes, sampling results, grout acceptance, shipment, commercial receipt, disposal, compliance, cost, and residual inventory.",
  },
  {
    slug: "hanford-complete-monthly-mass-balance-hold",
    agency: "DOE",
    actionKey: "HANFORD-WTP-MASS-BALANCE-HOLD-2026-01",
    stage: "Accepted-output mass-balance hold",
    status: "In Review",
    publicationDate: "2026-07-10",
    sourceIds: ["source-57d-hanford-wtp-consent-may-2026", "source-57d-hanford-wtp-consent-june-2026", "source-57d-hanford-wtp-consent-july-2026", "source-57e-hanford-dflaw-current-program-page"],
    title: "Hanford mass-balance hold: no single monthly table reconciles every operating stage",
    finding: "Current official records still do not reconcile monthly feed, glass mass, containers by stage, quality yield, rejects, rework, downtime, effluent, compliance, cost, and residual inventory in one compatible table.",
    denominator: "The complete DFLAW monthly material balance from TSCR feed through LAW output, EMF streams, container acceptance and disposal, secondary waste, and ending inventory.",
    limits: ["Cumulative lower bounds cannot replace exact monthly flows.", "Qualitative quality and shipment statements cannot supply missing stage quantities.", "Separate documents and dates cannot be assumed to describe the same material cohort."],
    next: "Reopen with a regulator-verifiable monthly mass balance and stable batch and container identities across all stages.",
  },
  {
    slug: "nnsa-schedule-requirements-closure",
    agency: "DOE",
    actionKey: "GAO-24-106342-REC-1-CLOSURE-2026-01",
    stage: "Independent program-governance closure",
    status: "Published",
    publicationDate: "2026-02-01",
    sourceIds: ["source-57e-gao-nnsa-production-modernization-integration"],
    title: "GAO closes NNSA production-modernization schedule-requirement Recommendation 1",
    finding: "GAO records Recommendation 1 Closed-Implemented after NNSA revised its Program Execution Instruction to require applicable Production Modernization programs to follow all ten GAO schedule best practices.",
    denominator: "GAO-24-106342 Recommendation 1 and GAO's documented closure rationale, not the underlying program schedules or their operating results.",
    limits: ["A closed governance recommendation does not prove every schedule is reliable in practice.", "The underlying program schedules are not published in this record.", "The closure does not establish qualified pit output, accepted rate, readiness, cost, or schedule performance."],
    next: "Track program-level schedules, schedule assessments, variances, corrective actions, qualified output, and acceptance decisions.",
    implementationChange: true,
    closureChange: true,
  },
  {
    slug: "nnsa-integrated-master-schedule-governance-closure",
    agency: "DOE",
    actionKey: "GAO-24-106342-REC-2-CLOSURE-2026-01",
    stage: "Independent program-governance closure",
    status: "Published",
    publicationDate: "2026-02-01",
    sourceIds: ["source-57e-gao-nnsa-production-modernization-integration"],
    title: "GAO closes NNSA resource-loaded integrated-master-schedule Recommendation 2",
    finding: "GAO records Recommendation 2 Closed-Implemented after fiscal 2026 program plans required reliable resource-loaded integrated master schedules or senior-approved rationale for an exception.",
    denominator: "GAO-24-106342 Recommendation 2 across the eight Production Modernization programs, evaluated against the requirement and approved-exception contract.",
    limits: ["A requirement or approved exception is not a published integrated schedule.", "GAO closure of this recommendation does not close GAO-23-104661's plutonium enterprise-baseline recommendation.", "No recurring qualified site-period output or accepted production rate is established."],
    next: "Publish the plutonium-modernization integrated schedule, exception scope, resource loading, schedule risk, variance, and independent sufficiency assessment.",
    implementationChange: true,
    closureChange: true,
  },
  {
    slug: "nnsa-cost-estimating-requirements-closure",
    agency: "DOE",
    actionKey: "GAO-24-106342-REC-3-CLOSURE-2026-01",
    stage: "Independent program-governance closure",
    status: "Published",
    publicationDate: "2026-02-01",
    sourceIds: ["source-57e-gao-nnsa-production-modernization-integration"],
    title: "GAO closes NNSA production-modernization cost-requirement Recommendation 3",
    finding: "GAO records Recommendation 3 Closed-Implemented after NNSA revised applicable requirements to follow the twelve GAO steps for reliable program cost estimates.",
    denominator: "GAO-24-106342 Recommendation 3 and its requirements-level closure rationale, separate from any program's completed lifecycle-cost estimate.",
    limits: ["A revised cost-estimating requirement is not a completed estimate.", "The record does not publish program costs, uncertainty, sensitivity, or independent estimate quality.", "The closure does not establish production performance or realized cost outcomes."],
    next: "Publish complete program estimates, assumptions, uncertainty, sensitivity, updates, variances, and independent assessments.",
    implementationChange: true,
    closureChange: true,
  },
  {
    slug: "nnsa-lifecycle-cost-governance-closure",
    agency: "DOE",
    actionKey: "GAO-24-106342-REC-4-CLOSURE-2026-01",
    stage: "Independent program-governance closure",
    status: "Published",
    publicationDate: "2026-02-01",
    sourceIds: ["source-57e-gao-nnsa-production-modernization-integration"],
    title: "GAO closes NNSA lifecycle-cost-governance Recommendation 4",
    finding: "GAO records Recommendation 4 Closed-Implemented after NNSA directed Production Modernization programs to maintain reliable lifecycle-cost estimates or document a senior-approved exception.",
    denominator: "GAO-24-106342 Recommendation 4 across the Production Modernization portfolio, preserving the distinction between governance requirements and a complete public plutonium-program estimate.",
    limits: ["The closure does not publish a complete plutonium-modernization lifecycle-cost estimate.", "A senior-approved exception is not equivalent to a reliable estimate.", "The separate GAO-23-104661 enterprise-baseline recommendation remains open."],
    next: "Publish the full plutonium-modernization lifecycle-cost estimate, schedule integration, assumptions, uncertainty, updates, and GAO sufficiency decision.",
    implementationChange: true,
    closureChange: true,
  },
  {
    slug: "nnsa-recurring-qualified-output-hold",
    agency: "DOE",
    actionKey: "NNSA-PIT-RATE-HOLD-2026-04",
    parentHold: "NNSA-PIT-RATE-HOLD-2026-03",
    stage: "Recurring output and baseline hold",
    status: "In Review",
    publicationDate: "2026-05-20",
    sourceIds: ["source-57b-nnsa-sasc-testimony-may-2026", "source-57e-gao-nnsa-production-modernization-integration"],
    title: "NNSA qualified-output hold: governance closure does not supply site-period production",
    finding: "NNSA and GAO records still do not publish compatible produced, qualified, rejected, reworked, and accepted pit counts by named site and period.",
    denominator: "Each named production site and reporting period, with produced, qualified, rejected, reworked, accepted, and acceptance-authority fields under a stable method.",
    limits: ["Governance requirements are not production results.", "Capacity and construction milestones are not qualified output.", "No recurring accepted-rate series is public."],
    next: "Reopen with site-period output, rejection, rework, acceptance, method, revision, and authority records.",
  },
  {
    slug: "nnsa-peis-capacity-hold",
    agency: "DOE",
    actionKey: "NNSA-PIT-PEIS-HOLD-2026-04",
    parentHold: "NNSA-PIT-PEIS-HOLD-2026-03",
    stage: "Recurring output and baseline hold",
    status: "In Review",
    publicationDate: "2026-04-01",
    sourceIds: ["source-57b-nnsa-pit-production-draft-peis-2026", "source-57e-gao-nnsa-production-modernization-integration"],
    title: "NNSA capacity hold: draft PEIS alternatives remain analytical despite governance closure",
    finding: "The draft PEIS still evaluates production alternatives rather than recording a final decision, installed accepted capacity, qualified output, rejects, rework, or recurring accepted rate.",
    denominator: "The draft capacity alternatives, final decision, installed equipment, readiness authorization, and site-period output kept as separate stages.",
    limits: ["A draft environmental analysis is not a final decision.", "Analyzed capacity is not installed or accepted capacity.", "GAO governance closure does not establish operating output."],
    next: "Reopen with a final decision, installed and accepted capacity, readiness authorization, and recurring qualified output.",
  },
  {
    slug: "nnsa-plutonium-enterprise-baseline-hold",
    agency: "DOE",
    actionKey: "NNSA-PIT-GAO-BASELINE-HOLD-2026-05",
    parentHold: "NNSA-PIT-GAO-BASELINE-HOLD-2026-04",
    stage: "Recurring output and baseline hold",
    status: "In Review",
    publicationDate: "2026-04-01",
    sourceIds: ["source-56q-gao-23-104661-recommendation-status", "source-57e-gao-nnsa-production-modernization-integration", "source-56x-gao-nnsa-major-projects-2026"],
    title: "NNSA enterprise-baseline hold: portfolio governance closures do not close the plutonium recommendation",
    finding: "GAO-24-106342 closes four portfolio-governance recommendations, but GAO-23-104661 still records the plutonium-modernization lifecycle-cost recommendation open and the complete enterprise baseline remains unpublished.",
    denominator: "The complete plutonium-modernization program across production and support sites, evaluated against the exact GAO-23-104661 integrated-schedule and lifecycle-cost recommendation.",
    limits: ["Different GAO recommendations cannot be substituted for one another.", "Requirements-level closure is not a complete public enterprise baseline.", "A forecast December 2026 estimate is not a completed or GAO-sufficient artifact."],
    next: "Reopen only when the complete plutonium integrated schedule and lifecycle-cost estimate is published and GAO records the exact recommendation sufficient or closed.",
  },
];

const sourceById = new Map(sources.map((source) => [source.id, source]));
const carriedIds = [...new Set(specs.flatMap((spec) => spec.sourceIds).filter((id) => !sourceById.has(id)))];
for (const id of carriedIds) {
  const source = JSON.parse(await readFile(join(contentRoot, "sources", id + ".json"), "utf8"));
  sourceById.set(id, { id, url: source.url, owner: source.source_owner ?? source.name });
}

const authorityBoundary = "Asset identity, inventory, installation, availability, uptime, use, adoption, performance testing, retention, feed, glass, containers, quality release, shipment, acceptance, disposal, capacity, program requirements, completed estimates, qualified output, closeout, implementation, and independent closure remain separate. Operator, regulator, state, federal, contractor, and independent evidence retain distinct attribution. No record supports a cross-system ranking, composite score, readiness score, generalized savings claim, or causal attribution.";
const records = specs.map((spec, index) => {
  const meta = agencyMeta[spec.agency];
  return {
    record_id: "record-57e-" + spec.slug,
    document_id: "research-doc-57e-" + spec.slug,
    signal_id: "signal-57e-" + spec.slug,
    document_number: 679 + index,
    phase: "57E",
    action_key: spec.actionKey,
    parent_hold_key: spec.parentHold ?? null,
    agency: spec.agency,
    entity_id: meta.entity,
    record_type: "Asset reliability, cohort adoption, and accepted-output closure panel",
    evidence_stage: spec.stage,
    title: spec.title,
    record_status: spec.status,
    source_id: spec.sourceIds[0],
    supporting_source_ids: spec.sourceIds,
    official_url: sourceById.get(spec.sourceIds[0])?.url,
    publication_date: spec.publicationDate,
    document_type: spec.status === "In Review" ? "Technical Report" : "Program Milestone",
    finding: spec.finding,
    denominator: spec.denominator,
    evidence_limits: spec.limits,
    next_action: spec.next,
    exact_target_artifact_acquired: false,
    directive_scope_change: false,
    implementation_change: Boolean(spec.implementationChange),
    closure_change: Boolean(spec.closureChange),
    contact_or_foia_submitted: false,
    authority_boundary: authorityBoundary,
    captured_date: capturedDate,
  };
});

const published = records.filter((record) => record.record_status === "Published");
const held = records.filter((record) => record.record_status === "In Review");
const evidenceStageCounts = Object.fromEntries([...new Set(records.map((record) => record.evidence_stage))].map((stage) => [stage, records.filter((record) => record.evidence_stage === stage).length]));
const priorHoldKeys = phase57d.records.filter((record) => record.record_status === "In Review").map((record) => record.action_key);
const closureRecords = records.filter((record) => record.closure_change);

await writeJson(join(dataRoot, "phase-57e-asset-reliability-cohort-adoption-accepted-output-closure.json"), {
  phase: "57E",
  captured_date: capturedDate,
  goal: "Follow the exact Phase 57D cohorts into named-asset quality, adoption and retention acceptance, complete material-flow closure, recurring qualified output, and independent program-governance closure without substituting requirements for results.",
  publication_rule: "Publish a requirement, reconciliation, accepted-output, or independent-closure record only with exact entity, cohort, stage, period, unit, denominator, method, and authority; preserve every inherited hold until its named operating-result condition is met.",
  authority_rule: "Requirements are not results, aggregate inventories are not asset reliability, serviceability is not adoption, filled is not accepted or disposed, and portfolio-governance closure is not a complete plutonium enterprise baseline.",
  records_reviewed: records.length,
  records_published: published.length,
  records_held: held.length,
  evidence_stage_counts: evidenceStageCounts,
  new_official_source_profiles: sources.length,
  carried_official_source_profiles: carriedIds.length,
  exact_target_artifacts_acquired: 0,
  exact_target_trigger_events: 0,
  public_agency_contacts_or_foia_requests: 0,
  directive_scope_changes: [],
  implementation_changes: closureRecords.map((record) => record.action_key),
  closure_changes: closureRecords.map((record) => record.action_key),
  inherited_entity_ledger_closure_changes: [],
  independent_recommendation_closures: closureRecords.length,
  prior_visible_scope: phase57d.post_batch_visible_scope,
  post_batch_visible_scope: phase57d.post_batch_visible_scope,
  post_batch_closure_counts: phase57d.post_batch_closure_counts,
  preserved_phase57d_holds: priorHoldKeys,
  new_visible_holds: ["HANFORD-WTP-MASS-BALANCE-HOLD-2026-01"],
  records,
});

await writeJson(join(dataRoot, "phase-57e-publication-review.json"), {
  phase: "57E",
  captured_date: capturedDate,
  promoted_document_ids: published.map((record) => record.document_id),
  promoted_signal_ids: published.map((record) => record.signal_id),
  held_document_ids: held.map((record) => record.document_id),
  held_signal_ids: held.map((record) => record.signal_id),
  inherited_hold_lineage: held.filter((record) => record.parent_hold_key).map((record) => ({ action_key: record.action_key, parent_hold_key: record.parent_hold_key })),
  independent_recommendation_closures: closureRecords.map((record) => record.action_key),
  exact_target_artifacts_acquired: 0,
  decision: "Fifteen records publish as asset-quality reconciliations, adoption acceptance controls, accepted-output closures, or independently closed NNSA governance recommendations. All eight Phase 57D holds remain visible and one complete Hanford mass-balance hold is added.",
});

for (const record of records) {
  const meta = agencyMeta[record.agency];
  const archiveName = String(record.document_number - 678).padStart(2, "0") + "-" + record.record_id.replace(/^record-57e-/, "") + ".txt";
  const sourceUrls = record.supporting_source_ids.map((id) => sourceById.get(id)?.url).filter(Boolean);
  const firstSource = sourceById.get(record.source_id);
  await writeJson(join(contentRoot, "research-documents", record.document_number + "-57e-" + record.record_id.replace(/^record-57e-/, "") + ".json"), {
    id: record.document_id,
    collection_id: collectionId,
    title: record.title,
    slug: record.document_id.replace(/^research-doc-/, ""),
    record_status: record.record_status,
    publisher: firstSource?.owner ?? "U.S. public-sector authority",
    publication_date: record.publication_date,
    document_type: record.document_type,
    summary: record.finding + " Denominator: " + record.denominator,
    key_findings: ["Evidence stage: " + record.evidence_stage + ".", "Finding: " + record.finding, "Denominator: " + record.denominator, ...record.evidence_limits.map((limit) => "Boundary: " + limit), "Next action: " + record.next_action],
    why_it_matters: record.record_status === "Published" ? "The record makes an asset, acceptance, output, or independent-closure boundary explicit without treating requirements as operating results." : "The visible hold keeps missing reliability, adoption, accepted-output, recurring-production, capacity, or enterprise-baseline fields outside the Published outcome layer.",
    ftfn_relevance: ["Preserves exact entity, cohort, lifecycle stage, period, unit, threshold, denominator, method, revision, and authority.", "Separates requirements, operating results, acceptance, and independent closure.", "Keeps dated checks and exact-artifact retrieval non-blocking."],
    evidence_limits: ["Not publicly acquired does not mean nonexistent, withheld, or never submitted.", "FTFN public-source research is not agency contact or a submitted FOIA request.", ...record.evidence_limits, "The inherited 1 Closed / 21 Partially Closed / 2 Open entity ledger remains separate from the four new GAO-24-106342 closures.", "No record supports a ranking, composite score, readiness score, generalized savings claim, or unsupported causal inference."],
    primary_topics: meta.topics,
    framework_layers: meta.layers,
    constraint_tags: ["Data Quality", "Regulation", "Public Trust"],
    source_id: record.source_id,
    supporting_source_ids: record.supporting_source_ids,
    supporting_official_urls: sourceUrls,
    official_url: record.official_url,
    local_capture_path: "/downloads/" + collectionSlug + "/official-links/" + archiveName,
    archive_member: "official-links/" + archiveName,
    capture_status: "Official link record",
    captured_date: capturedDate,
  });

  const signal = [
    "---",
    "id: " + JSON.stringify(record.signal_id),
    "title: " + JSON.stringify(record.title),
    "slug: " + JSON.stringify(record.signal_id.replace(/^signal-/, "")),
    "record_status: " + JSON.stringify(record.record_status),
    "summary: " + JSON.stringify(record.finding),
    yamlList("source_ids", record.supporting_source_ids),
    "published_date: " + capturedDate,
    "captured_date: " + capturedDate,
    "primary_topic: " + JSON.stringify(meta.topics[0]),
    yamlList("framework_layers", meta.layers),
    'signal_type: "Research Result"',
    'maturity_level: "Infrastructure"',
    'time_horizon: "Now"',
    'evidence_quality: "Official Data"',
    'verification_status: "Verified Against Primary Source"',
    "why_it_matters: " + JSON.stringify("Evidence stage: " + record.evidence_stage + ". Denominator: " + record.denominator),
    yamlList("dependencies", ["stable named entity and cohort", "explicit lifecycle stage and acceptance authority", "compatible period, unit, denominator, and method", "separate operating result and independent closure evidence"]),
    yamlList("constraints", ["Data Quality", "Regulation", "Public Trust"]),
    yamlList("receiving_systems", ["Phase 57E asset reliability, cohort adoption, and accepted-output closure panels"]),
    yamlList("local_implications", ["Do not collapse requirements, inventory, reliability, adoption, performance testing, retention, feed, glass, containers, quality, shipment, acceptance, disposal, capacity, estimates, qualified output, implementation, and closure."]),
    yamlList("evidence_gap_ids", meta.gaps),
    'claim_scope: "Specific Source Update"',
    'local_evidence_level: "General Source Layer"',
    "last_reviewed_date: " + capturedDate,
    "editorial_notes: " + JSON.stringify(record.record_status === "Published" ? "Published under the Phase 57E asset, acceptance-control, accepted-output, or independent-closure contract." : "Held until the exact Phase 57E operating-result reopening condition is public."),
    "---",
    "",
    "## Phase 57E panel",
    "",
    record.finding,
    "",
    "## Evidence stage and denominator",
    "",
    "**" + record.evidence_stage + ".** " + record.denominator,
    "",
    "## Evidence boundaries",
    "",
    ...record.evidence_limits.map((limit) => "- " + limit),
    "",
    "Exact target artifact acquired: **No**. FTFN submitted no agency contact or FOIA request.",
    "",
    "Next action: " + record.next_action,
    "",
    "## Authority boundary",
    "",
    record.authority_boundary,
    "",
  ].join("\n");
  await writeFile(join(contentRoot, "signals", record.signal_id + ".mdx"), signal, "utf8");
}

await writeJson(join(contentRoot, "research-collections", collectionSlug + ".json"), {
  id: collectionId,
  title: "Asset Reliability, Cohort Adoption, and Accepted-Output Closure, 2026",
  slug: collectionSlug,
  record_status: "Published",
  summary: "Phase 57E reviews twenty-four Amtrak, broadband, Hanford, and NNSA records, publishing fifteen bounded reconciliations, controls, accepted-output closures, or independent governance closures while retaining nine explicit holds.",
  scope: "Three Amtrak asset-quality records; four Montana adoption and retention acceptance controls; four Hanford accepted-output closure records; four GAO-closed NNSA program-governance recommendations; two Amtrak reliability holds; three broadband result holds; one Hanford mass-balance hold; and three NNSA output, capacity, or baseline holds.",
  captured_date: capturedDate,
  document_ids: records.map((record) => record.document_id),
  download_path: "/downloads/" + collectionSlug + ".zip",
  download_note: "The twenty-seven-file archive contains twenty-four official-link records, consolidated summaries, a README, and a checksum manifest.",
  method_note: "Requirements are not outcomes. Exact asset, location, batch, container, site, period, denominator, method, and authority identities remain explicit across reconciliation, acceptance, and closure decisions.",
});

const signalIds = records.map((record) => record.signal_id);
const publishedSignalIds = published.map((record) => record.signal_id);
const briefing = [
  "---",
  "id: " + JSON.stringify(briefingId),
  'title: "Research Watch 035: Asset Reliability, Cohort Adoption, and Accepted-Output Closure"',
  'slug: "research-watch-035-asset-reliability-cohort-adoption-accepted-output-closure"',
  'record_status: "Published"',
  'summary: "Phase 57E publishes fifteen asset-reconciliation, adoption-control, accepted-output, or independent-closure records while retaining every inherited reliability, adoption, activation, recurring-output, capacity, and baseline hold."',
  "published_date: " + capturedDate,
  "captured_date: " + capturedDate,
  yamlList("signal_ids", signalIds),
  yamlList("evidence_gap_ids", ["gap-008", "gap-015", "gap-016"]),
  'claim_scope: "Editorial Synthesis"',
  'local_evidence_level: "General Source Layer"',
  "last_reviewed_date: " + capturedDate,
  yamlList("top_takeaways", [
    "Amtrak's two June reports conflict at 93 versus 117 PIDS completions, while its digital report supports a bounded booking-flow remediation result.",
    "Montana defines speed, latency, availability, subscriber-sampling, and closeout controls but still publishes no awardee result table.",
    "Hanford now has an acceptable-quality glass milestone and a bounded filled-shipped-disposed crosswalk, while the complete monthly mass balance remains absent.",
    "GAO closes four NNSA production-modernization schedule and cost-governance recommendations without closing the separate plutonium enterprise-baseline or qualified-output holds.",
  ]),
  yamlList("constraint_watch", ["Data Quality", "Regulation", "Public Trust"]),
  yamlList("what_to_watch_next", [
    "Named Amtrak asset-period uptime, use, complaint, resolution, and rider-outcome tables",
    "Privacy-safe BEAD subscriber, retention, performance, complaint, remediation, and accepted-closeout results",
    "A complete regulator-verifiable Hanford monthly mass balance with stable batch and container identities",
    "Qualified NNSA output by site and period plus the complete plutonium integrated schedule and lifecycle-cost estimate",
  ]),
  "---",
  "",
  "## What Phase 57E adds",
  "",
  "The batch moves from compatible aggregate series into explicit asset reconciliation, acceptance controls, accepted-output boundaries, and independent recommendation closure. It publishes requirements only as controls, not as evidence that an operator or project passed.",
  "",
  "## Reliability and adoption remain outcome holds",
  "",
  "Amtrak's cross-report PIDS conflict blocks a single accepted asset register. Montana's controls identify the exact measurements and active-subscriber evidence required at closeout, but Louisiana and Montana still lack public cohort adoption and retention results.",
  "",
  "## Hanford and NNSA add real closure evidence",
  "",
  "Hanford's acceptable-quality glass milestone and container-stage observations advance the accepted-output chain without inventing a monthly mass balance. GAO closes four NNSA portfolio-governance recommendations, while the separate plutonium enterprise-baseline and recurring qualified-output holds remain open.",
  "",
  "## Evidence boundary",
  "",
  "All eight Phase 57D holds remain visible and one complete Hanford mass-balance hold is added. The inherited entity ledger remains one Closed, twenty-one Partially Closed, and two Open; the four new GAO closures are separate recommendation identities. No ranking, composite, readiness score, generalized savings claim, or unsupported causal inference is supported.",
  "",
].join("\n");
await writeFile(join(contentRoot, "briefings", "research-watch-035-asset-reliability-cohort-adoption-accepted-output-closure.mdx"), briefing, "utf8");

await writeJson(join(contentRoot, "updates", "2026-08-03-phase-57e-asset-reliability-cohort-adoption-accepted-output-closure.json"), {
  id: "update-2026-08-03-phase-57e-asset-reliability-cohort-adoption-accepted-output-closure",
  effective_date: capturedDate,
  entry_type: "Research Collection",
  title: "Phase 57E publishes fifteen asset, acceptance-control, accepted-output, and independent-closure records",
  summary: "Seven new Tier 1 sources and carried official records support fifteen Published panels, eight preserved holds, and one new Hanford mass-balance hold.",
  affected_record_ids: [collectionId, briefingId, ...signalIds],
  related_paths: ["/research/" + collectionSlug + "/", "/briefings/research-watch-035-asset-reliability-cohort-adoption-accepted-output-closure/", ...signalIds.map((id) => "/signals/" + id.replace(/^signal-/, "") + "/")],
  evidence_note: "The four GAO-24-106342 closures are exact independent recommendation identities and do not close the separate plutonium enterprise-baseline or qualified-output holds. Requirements, results, acceptance, implementation, and closure remain separate.",
  work_package: "docs/work-packages/phase-57e-asset-reliability-cohort-adoption-accepted-output-closure.md",
});

const updateJson = async (path, mutate) => {
  const value = JSON.parse(await readFile(path, "utf8"));
  mutate(value);
  await writeJson(path, value);
};
const newSourceIds = sources.map((source) => source.id);
const amtrakSourceIds = sources.filter((source) => source.agency === "DOT").map((source) => source.id);
const broadbandSourceIds = sources.filter((source) => source.agency === "NTIA").map((source) => source.id);
const energySourceIds = sources.filter((source) => source.agency === "DOE").map((source) => source.id);

await updateJson(join(contentRoot, "organizations", "org-us-department-energy.json"), (value) => {
  value.source_ids = appendUnique(value.source_ids, energySourceIds);
});
await updateJson(join(contentRoot, "organizations", "org-government-accountability-office.json"), (value) => {
  value.source_ids = appendUnique(value.source_ids, ["source-57e-gao-nnsa-production-modernization-integration"]);
});

for (const [file, selected, question] of [
  ["finance-and-risk.json", newSourceIds, "Which Phase 57E cohort next publishes accepted cost, reliability, adoption, retention, yield, or recurring-output results under a stable denominator?"],
  ["policy-and-standards.json", newSourceIds, "Which Phase 57E control next produces a public operator or awardee result and independent acceptance decision?"],
  ["mobility.json", amtrakSourceIds, "Which named Amtrak asset cohort next publishes compatible uptime, use, complaint, resolution, boarding-time, and rider-outcome observations?"],
  ["chips-and-compute.json", broadbandSourceIds, "Which BEAD project next publishes privacy-safe installed, subscribed, tested, retained, failed, remediated, and accepted counts?"],
  ["energy.json", energySourceIds, "Which Hanford or NNSA record next supplies a complete monthly mass balance, qualified site-period output, or sufficient enterprise baseline?"],
]) {
  await updateJson(join(contentRoot, "topics", file), (value) => {
    value.featured_sources = appendUnique(value.featured_sources, selected);
    value.watch_questions = appendUnique(value.watch_questions, [question]);
  });
}

const publishedByAgency = (agency) => published.filter((record) => record.agency === agency).map((record) => record.signal_id);
for (const [file, selectedSignals, selectedSources] of [
  ["policy-standards-to-implementation.json", publishedSignalIds, newSourceIds],
  ["cross-corridor-authorization-to-operation.json", [...publishedByAgency("DOT"), ...publishedByAgency("NTIA")], [...amtrakSourceIds, ...broadbandSourceIds]],
  ["energy-grid-capacity-to-service.json", publishedByAgency("DOE"), energySourceIds],
]) {
  await updateJson(join(contentRoot, "reader-pathways", file), (value) => {
    value.signal_ids = appendUnique(value.signal_ids.filter((id) => !id.startsWith("signal-57e-")), selectedSignals);
    value.source_ids = appendUnique(value.source_ids, selectedSources);
    value.briefing_ids = appendUnique(value.briefing_ids, [briefingId]);
    value.research_collection_ids = appendUnique(value.research_collection_ids, [collectionId]);
    value.dependency_stack = value.dependency_stack.filter((item) => item.stage !== "Phase 57E asset reliability, cohort adoption, and accepted-output closure panels");
    value.dependency_stack.push({
      stage: "Phase 57E asset reliability, cohort adoption, and accepted-output closure panels",
      current_state: "Fifteen Published reconciliations, controls, accepted-output closures, or independent recommendation closures and nine visible holds.",
      boundary: "Requirements are not results, inventory is not reliability, serviceability is not adoption, filled is not disposed, and portfolio-governance closure is not a complete plutonium baseline.",
    });
    value.evidence_limits = appendUnique(value.evidence_limits, ["Phase 57E prohibits cross-report count merging, control-to-outcome inflation, stage-to-acceptance collapse, recommendation substitution, rankings, composite scores, readiness scores, generalized savings, and unsupported causal inference."]);
    value.next_records = appendUnique(value.next_records, ["Named-asset reliability, privacy-safe cohort adoption and retention, complete monthly material balances, qualified site-period output, and exact independent baseline sufficiency."]);
  });
}

await updateJson(join(contentRoot, "dependency-maps", "comparative-outcomes-require-common-denominators.json"), (value) => {
  value.summary = "A comparison and inference protocol: Phase 57E adds fifteen bounded asset, control, accepted-output, or independent-closure records while preserving nine operating-result holds.";
  value.source_ids = appendUnique(value.source_ids, newSourceIds);
  value.signal_ids = appendUnique(value.signal_ids.filter((id) => !id.startsWith("signal-57e-")), publishedSignalIds);
  value.nodes = value.nodes.filter((node) => node.id !== "node-phase57e-asset-adoption-accepted-output");
  value.links = value.links.filter((link) => link.from !== "node-phase57e-asset-adoption-accepted-output");
  value.nodes.push({
    id: "node-phase57e-asset-adoption-accepted-output",
    label: "Fifteen asset, acceptance-control, accepted-output, or closure records; nine holds",
    node_type: "Signal",
    note: "Requirements, results, acceptance, implementation, and independent closure advance only under exact entity, cohort, stage, denominator, method, and authority identities.",
  });
  value.links.push(
    { from: "node-phase57e-asset-adoption-accepted-output", to: "node-phase57d-persistent-service-quality-time-series", relationship: "Depends On", confidence: "Supported", note: "Phase 57E preserves the compatible Phase 57D cohorts and all inherited holds." },
    { from: "node-phase57e-asset-adoption-accepted-output", to: "node-denominator-break", relationship: "Constrained By", confidence: "Partial", note: "PIDS counts, subscriber cohorts, container stages, recommendation identities, and production sites remain non-interchangeable denominators." },
    { from: "node-phase57e-asset-adoption-accepted-output", to: "node-causal-hold", relationship: "Limited By", confidence: "Missing Evidence", note: "Controls and closure decisions do not establish operating reliability, adoption, sustained output, readiness, savings, or causation." },
  );
  value.what_this_map_supports = appendUnique(value.what_this_map_supports, ["Fifteen bounded Phase 57E asset, control, accepted-output, or independent-closure records plus nine visible operating-result holds."]);
  value.next_records_needed = appendUnique(value.next_records_needed, ["Named-asset reliability, privacy-safe cohort adoption and retention, complete monthly material balances, qualified site-period output, and exact enterprise-baseline sufficiency."]);
});

console.log("Generated Phase 57E: " + published.length + " Published records, " + held.length + " In Review holds, " + sources.length + " new Tier 1 sources, and Research Watch 035.");
