import { readFile, writeFile } from "node:fs/promises";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const appRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const workspaceRoot = resolve(appRoot, "..");
const readJson = async (...parts) => JSON.parse(await readFile(join(...parts), "utf8"));
const writeJson = (path, value) => writeFile(path, JSON.stringify(value, null, 2) + "\n", "utf8");
const slugify = (value) => value.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

const cycle = await readJson(appRoot, "src", "data", "phase-60-operating-cycle.json");
const cycleRecords = cycle.records.map((record) => ({
  ...record,
  slug: slugify(record.cycle_item_id.replace(/^60-CYCLE-/, "")),
  public_state: record.decision_date && record.receipt_id ? "Dated decision" : "Scheduled evidence gate",
}));

const regions = [
  ["california-autonomous-mobility", "California autonomous mobility", "California, United States", ["waymo", "california-av", "cpuc-av"], "Read operating authority, service exposure, accessibility, safety and accountability as one place-bound system.", "Stable service, exposure and public-accountability denominators remain decisive."],
  ["louisiana-broadband-adoption", "Louisiana broadband adoption", "Louisiana, United States", ["louisiana-starlink", "louisiana-nextlink"], "Follow service availability into observed installation, subscription and take-rate evidence without treating an award as adoption.", "The two scheduled September adoption gates must be checked independently."],
  ["montana-bead-delivery", "Montana BEAD delivery", "Montana, United States", ["montana"], "Connect project identity, deployment progress and completed-quarter reporting to a stable location denominator.", "A complete public quarterly outcome remains the next decisive artifact."],
  ["hanford-waste-treatment", "Hanford waste treatment", "Washington, United States", ["hanford", "dflaw"], "Read commissioning, regulator-confirmed operation and material-balance evidence across the waste-treatment system.", "Operation does not establish a complete reconciled material balance."],
  ["amtrak-accessibility-and-reliability", "Amtrak accessibility and reliability", "United States intercity rail system", ["amtrak", "pids"], "Bring station accessibility, passenger information deployment, closeout and named-asset reliability into a common operating frame.", "Program closeout and repeated reliability are separate evidence decisions."],
  ["nnsa-two-site-production", "NNSA two-site production", "Savannah River and Los Alamos, United States", ["nnsa", "pit-production"], "Separate facility progress, accepted capacity and recurring qualified output across a two-site production system.", "Baselines, accepted capacity and qualified recurring rate remain distinct gates."],
  ["south-australia-grid-storage", "South Australia grid storage", "South Australia, Australia", ["hornsdale", "dalrymple"], "Compare grid-service claims with asset identity, operating period, event definition and measured system role.", "Comparable recurring performance requires stable definitions across assets and periods."],
  ["victoria-grid-storage", "Victoria grid storage", "Victoria, Australia", ["victoria-big-battery", "vbb"], "Follow a named storage asset from commissioning claims into recurring, denominator-explicit operating evidence.", "A single milestone is not a longitudinal reliability or public-value series."],
  ["florida-utility-storage", "Florida utility storage", "Florida, United States", ["manatee"], "Read the Manatee storage record as an asset-level conversion case bounded by acceptance and repeated operation.", "Capacity and commissioning statements do not by themselves establish recurring system outcomes."],
  ["california-battery-safety", "California battery safety", "California, United States", ["moss-landing", "gateway-energy-storage", "gateway-capacity", "gateway-constraints", "gateway-repeat"], "Connect named battery assets to incident, safety, availability and operating evidence without collapsing different sites.", "Asset identity, incident scope and comparable operating periods must stay separate."],
].map(([slug, title, geography, signal_terms, editorial_question, unresolved], index) => ({
  portrait_id: `112-REGION-${String(index + 1).padStart(3, "0")}`,
  slug, title, geography, signal_terms, editorial_question, unresolved,
  interpretation_boundary: "This portrait organizes existing Published records for place-based reading. It creates no new source fact, causal finding, gate decision, observation, score, ranking or outcome.",
}));

const casebooks = [
  ["manatee-battery-storage", "Manatee Battery Energy Storage Center", ["manatee"], "What evidence moves a named storage asset from capacity announcement through acceptance to repeated operation?"],
  ["moss-landing-battery-safety", "Moss Landing battery safety and operation", ["moss-landing"], "How should incident, safety response and operating evidence be separated across a named storage site?"],
  ["gateway-battery-storage", "Gateway battery storage", ["gateway-energy-storage", "gateway-capacity", "gateway-constraints", "gateway-repeat"], "Which asset-level records distinguish installed capacity from accepted and recurring grid service?"],
  ["hornsdale-power-reserve", "Hornsdale Power Reserve", ["hornsdale"], "Which stable periods and denominators make the asset's operating contribution comparable over time?"],
  ["victoria-big-battery", "Victoria Big Battery", ["victoria-big-battery", "vbb"], "How does a commissioning milestone become a repeated and comparable operating record?"],
  ["dalrymple-grid-battery", "Dalrymple grid battery", ["dalrymple"], "How should constraint events and operating records be read without overgeneralizing from individual events?"],
  ["f35-production-readiness", "F-35 production readiness", ["f35", "f-35"], "Which delivery, readiness and sustainment measures establish accepted operational capacity?"],
  ["f15ex-production-delivery", "F-15EX production and delivery", ["f15ex", "f-15ex"], "Which accepted-aircraft and recurring-delivery records separate production progress from fleet outcome?"],
  ["kc46-readiness", "KC-46 readiness", ["kc46", "kc-46"], "How should production, remediation and readiness evidence be linked without treating delivery as mission availability?"],
  ["current-applications-capacity", "Current Applications industrial capacity", ["current-applications"], "Which facility, qualification and accepted-output records establish dependable production capacity?"],
  ["island-components-capacity", "Island Components industrial capacity", ["island-components"], "How does a named supplier move from support and expansion into qualified recurring output?"],
  ["monaghan-medical-capacity", "Monaghan Medical manufacturing capacity", ["monaghan"], "Which accepted production and delivery evidence establishes durable medical-manufacturing capacity?"],
  ["amtrak-accessible-stations", "Amtrak accessible-station delivery", ["amtrak", "accessible-boarding", "pids"], "Which station identities, acceptance records and denominators establish completed accessible service?"],
  ["hanford-dflaw-operation", "Hanford DFLAW operation", ["hanford", "dflaw"], "Which regulator, operating and material-balance records establish sustained treatment rather than a one-time milestone?"],
  ["montana-bead-completed-quarter", "Montana BEAD completed quarter", ["montana"], "What must a complete public quarter contain before deployment can be treated as an observed outcome?"],
  ["nnsa-qualified-production", "NNSA qualified production", ["nnsa", "pit-production"], "Which baseline, accepted-capacity and qualified-rate records support a recurring production claim?"],
].map(([slug, title, signal_terms, editorial_question], index) => ({
  casebook_id: `113-CASE-${String(index + 1).padStart(3, "0")}`,
  slug, title, signal_terms, editorial_question,
  established: "The casebook resolves existing Published records and preserves their individual dates, identities and evidence boundaries.",
  unresolved: "The next operating or outcome claim remains bounded by the exact artifacts and stable denominators named in the underlying records.",
  interpretation_boundary: "This casebook is an editorial chronology over existing evidence. It creates no new source fact, receipt, gate decision, observation, outcome, score or ranking.",
}));

const reports = [
  ["compute-power-water", "Compute, power and water", ["chips", "data-center", "water", "tsmc", "large-load"], "Announcements become durable capacity only when utilities, water, facilities and accepted service can be read on compatible project and operating periods."],
  ["permission-is-not-operation", "Permission is not operation", ["permit", "licence", "authority", "acceptance", "operation"], "Approval, finance and authority remove constraints; accepted operation and repeated service require different evidence."],
  ["standards-to-adoption", "Standards to adoption", ["pqc", "aria", "standard", "adoption", "migration"], "A published standard becomes adoption through inventory, procurement, validation, cutover, monitoring and retirement evidence."],
  ["infrastructure-delivery-in-practice", "Infrastructure delivery in practice", ["amtrak", "hanford", "montana", "gateway", "construction"], "Named assets reveal where construction, commissioning, acceptance, handover and recurring service diverge."],
].map(([slug, title, signal_terms, thesis], index) => ({
  report_id: `114-REPORT-${String(index + 1).padStart(3, "0")}`,
  slug, title, signal_terms, thesis,
  sections: ["The public claim", "The conversion chain", "Where evidence breaks", "What would change the conclusion"],
  interpretation_boundary: "This comparative report synthesizes existing Published records. It is not a causal evaluation, forecast, recommendation, score, ranking or new operating outcome.",
}));

const lenses = [
  ["us-federal-delivery", "United States federal delivery", "Read appropriations, standards and program authority separately from asset acceptance, service and public outcomes."],
  ["state-and-local-conversion", "State and local conversion", "Read local authority, utilities, permits, public process and operating evidence as distinct gates."],
  ["canada-and-ontario", "Canada and Ontario", "Read council, provincial, servicing, construction and occupancy records without converting approval into delivery."],
  ["public-infrastructure-operators", "Public infrastructure operators", "Read handover, closeout, maintenance, accessibility and reliability through named assets and stable denominators."],
  ["international-comparative-reading", "International comparative reading", "Compare evidence structures and conversion stages without ranking jurisdictions or erasing institutional context."],
].map(([slug, title, reading_rule], index) => ({ lens_id: `115-LENS-${String(index + 1).padStart(3, "0")}`, slug, title, reading_rule }));

const phaseRoutes = {
  "111": ["/review/evidence-cycle/", ...cycleRecords.map((item) => `/review/evidence-cycle/${item.slug}/`)],
  "112": regions.map((item) => `/review/regions/${item.slug}/`),
  "113": casebooks.map((item) => `/review/casebooks/expanded/${item.slug}/`),
  "114": reports.map((item) => `/review/reports/${item.slug}/`),
  "115": ["/review/accessibility/", ...reports.map((item) => `/review/accessibility/reports/${item.slug}/`), ...lenses.map((item) => `/review/lenses/${item.slug}/`)],
};

const phaseMetadata = [
  [111, "Evidence-to-publication activation", "Publish a reader-facing evidence-cycle desk while preserving every dated decision and future scheduled gate."],
  [112, "Local-system expansion", "Add ten place-bound system portraits, expanding editorial local-system coverage from five to fifteen."],
  [113, "Casebook expansion", "Add sixteen named-asset and delivery casebooks, expanding the casebook shelf from eight to twenty-four."],
  [114, "Comparative public reports", "Publish four flagship reports that connect evidence across systems without creating causal findings or rankings."],
  [115, "Accessible and international reading", "Publish linear reading editions and five jurisdiction lenses while holding French and Spanish translations for qualified human review."],
].map(([phase, title, content_goal]) => ({ phase, title, content_goal, status: "Complete", routes: phaseRoutes[String(phase)] }));

const program = {
  schema_version: "1.0",
  program_id: "FTFN-V0.3.1-CONTENT-EXPANSION",
  title: "FTFN v0.3.1 — Evidence in public context",
  effective_date: "2026-08-29",
  record_status: "Published",
  summary: "A 54-route expansion that turns the operating cycle, additional place systems, named cases and cross-system analysis into bounded public reading surfaces.",
  publication_boundaries: [
    "No future Phase 60 gate is operated before its scheduled date, and no missing receipt or outcome is inferred.",
    "Every new page resolves existing Published evidence or an explicit scheduled operating contract; it creates no source fact, receipt, observation, outcome, score or ranking.",
    "French and Spanish editions remain In Review and unrouteable until a qualified human reviewer approves terminology, claims and links.",
  ],
  counts: {
    phases_complete: 5,
    public_routes: Object.values(phaseRoutes).flat().length,
    evidence_cycle_routes: phaseRoutes["111"].length,
    editorial_local_systems_added: regions.length,
    editorial_local_systems_total: 5 + regions.length,
    casebooks_added: casebooks.length,
    casebooks_total: 8 + casebooks.length,
    comparative_reports: reports.length,
    accessible_and_lens_routes: phaseRoutes["115"].length,
  },
  phases: phaseMetadata,
  evidence_cycle: {
    cycle_id: cycle.cycle_id,
    cycle_status: cycle.cycle_status,
    cycle_end_date: cycle.cycle_end_date,
    publication_boundary: cycle.publication_boundary,
    records: cycleRecords,
  },
  regions,
  casebooks,
  reports,
  lenses,
  translation_pilots: [
    { pilot_id: "115-TRANSLATION-FR", language: "French", status: "In Review", publication_route: null, next_action: "Qualified human review of terminology, claims and links." },
    { pilot_id: "115-TRANSLATION-ES", language: "Spanish", status: "In Review", publication_route: null, next_action: "Qualified human review of terminology, claims and links." },
  ],
};

await writeJson(join(appRoot, "src", "data", "v031-content-expansion.json"), program);

for (const phase of phaseMetadata) {
  const update = {
    id: `update-2026-08-29-phase-${phase.phase}-v031-content-expansion`,
    effective_date: "2026-08-29",
    entry_type: "Source Refresh",
    title: `Phase ${phase.phase}: ${phase.title}`,
    summary: phase.content_goal,
    affected_record_ids: phase.phase === 111 ? cycleRecords.map((item) => item.underlying_signal_id)
      : phase.phase === 112 ? ["topic-mobility", "topic-policy-and-standards", "topic-energy", "topic-water"]
        : phase.phase === 113 ? ["topic-energy", "topic-advanced-manufacturing", "topic-aviation"]
          : phase.phase === 114 ? ["topic-chips-and-compute", "topic-water", "topic-policy-and-standards", "topic-human-futures"]
            : ["topic-human-futures", "topic-policy-and-standards"],
    related_paths: phase.routes,
    evidence_note: "This content expansion resolves existing Published records and scheduled operating contracts. It creates no new source fact, future receipt, gate decision, observation, outcome, score, ranking or reviewed translation.",
    materiality: "No record-state change",
    publication_effect: `Publishes ${phase.routes.length} bounded Phase ${phase.phase} routes.`,
    next_check_date: phase.phase === 111 ? "2026-09-01" : null,
    work_package: `docs/work-packages/phase-${phase.phase}-v031-${slugify(phase.title)}.md`,
  };
  await writeJson(join(appRoot, "src", "content", "updates", `2026-08-29-phase-${phase.phase}-v031-${slugify(phase.title)}.json`), update);

  const workPackage = `# Phase ${phase.phase} — ${phase.title}\n\n**Status:** Complete  \n**Effective date:** 2026-08-29  \n**Program:** FTFN v0.3.1 — Evidence in public context\n\n## Content goal\n\n${phase.content_goal}\n\n## Delivered\n\n- ${phase.routes.length} public, source-linked reading routes.\n- One registry-backed route inventory and public JSON contract.\n- Explicit interpretation boundaries that preserve upstream record status.\n- Sitemap, release-manifest and build-verification coverage.\n\n## Publication boundary\n\nThis phase creates no new source fact, future receipt, gate decision, observation, outcome, score, ranking or reviewed translation. Future evidence gates remain scheduled until their due dates and source checks. French and Spanish pilots remain In Review and have no publication routes.\n\n## Routes\n\n${phase.routes.map((route) => `- \`${route}\``).join("\n")}\n`;
  await writeFile(join(workspaceRoot, "docs", "work-packages", `phase-${phase.phase}-v031-${slugify(phase.title)}.md`), workPackage, "utf8");
}

console.log(`FTFN v0.3.1 expansion built: ${program.counts.public_routes} routes across Phases 111-115.`);
