import { mkdir, readFile, readdir, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

const appRoot = fileURLToPath(new URL("..", import.meta.url));
const contentRoot = join(appRoot, "src", "content");
const dataRoot = join(appRoot, "src", "data");
const capturedDate = "2026-08-02";
const collectionSlug = "gao-recommendation-artifact-scope-audit-missing-document-register-2026";
const collectionId = `research-collection-${collectionSlug}`;
const briefingId = "briefing-research-watch-023-recommendation-artifact-scope-audit";
const archiveRoot = join(appRoot, "public", "downloads", collectionSlug);
const json = (value) => `${JSON.stringify(value, null, 2)}\n`;
const writeJson = async (path, value) => writeFile(path, json(value), "utf8");
const yamlList = (name, items) => [name + ":", ...items.map((item) => `  - ${JSON.stringify(item)}`)].join("\n");

for (const path of [
  join(contentRoot, "sources"),
  join(contentRoot, "research-documents"),
  join(contentRoot, "signals"),
  join(contentRoot, "research-collections"),
  join(contentRoot, "briefings"),
  join(contentRoot, "updates"),
  dataRoot,
  join(archiveRoot, "official-links"),
]) await mkdir(path, { recursive: true });

const phase56r = JSON.parse(await readFile(join(dataRoot, "phase-56r-implementation-artifact-milestone-ledger.json"), "utf8"));
const agencyMeta = {
  DOE: {
    topics: ["Energy", "Policy and Standards", "Finance and Risk"],
    layers: ["Enabling Infrastructure", "Human Systems"],
    gaps: ["gap-008", "gap-016"],
    repositories: ["DOE publication and report pages", "NNSA program and budget pages", "DOE Environmental Management and OCED resource libraries", "DOE NEPA and Inspector General repositories", "current GAO recommendation page"],
  },
  HHS: {
    topics: ["Human Futures", "Policy and Standards", "Finance and Risk"],
    layers: ["Human Systems", "Enabling Infrastructure"],
    gaps: ["gap-016"],
    repositories: ["HHS and CMS policy and report libraries", "CMS rule and program-integrity repositories", "CDC and ASPR preparedness libraries", "HHS FOIA and electronic reading-room surfaces", "current GAO recommendation page"],
  },
  DOT: {
    topics: ["Mobility", "Aviation", "Policy and Standards"],
    layers: ["Enabling Infrastructure", "Human Systems"],
    gaps: ["gap-015", "gap-016"],
    repositories: ["DOT budget, grants, and report portals", "FAA plans and technical-report libraries", "DOT and FAA policy and release pages", "DOT public data and dashboard pages", "current GAO recommendation page"],
  },
  VA: {
    topics: ["Human Futures", "Policy and Standards", "Finance and Risk"],
    layers: ["Human Systems", "Enabling Infrastructure"],
    gaps: ["gap-016"],
    repositories: ["VA Publications and inactive-publication indexes", "VHA policy and enterprise-risk libraries", "VA Digital and EHR modernization pages", "VA budget and performance reports", "current GAO recommendation page"],
  },
};

const newSources = [
  {
    id: "source-56s-doe-spr-long-term-strategic-review-2016",
    name: "DOE Long-Term Strategic Review of the Strategic Petroleum Reserve, 2016",
    url: "https://www.energy.gov/ceser/articles/doe-announces-release-long-term-strategic-review-strategic-petroleum-reserve",
    agency: "DOE",
    owner: "U.S. Department of Energy",
    access: "Release Page",
    limitation: "This is the historical 2016 review and a scope baseline. It is not the later periodic successor review GAO says remains unfinished and does not close GAO-18-477 Recommendation 2.",
  },
  {
    id: "source-56s-oced-independent-assessments-guidance-2024",
    name: "OCED Independent Assessments Guidance for Recipients, 2024",
    url: "https://www.energy.gov/sites/default/files/2024-10/OCED_IndependentAssessmentsGuidance.pdf",
    agency: "DOE",
    owner: "DOE Office of Clean Energy Demonstrations",
    access: "Data Download",
    limitation: "The guidance describes independent reviews within OCED, says it is not a requirements document, and says assessment reports are internal. It does not establish the cross-office external-review requirement GAO identified.",
  },
  {
    id: "source-56s-cms-fy2026-ipps-final-rule",
    name: "CMS Fiscal Year 2026 IPPS Final Rule and Uncompensated Care Files",
    url: "https://www.cms.gov/medicare/payment/prospective-payment-systems/acute-inpatient-pps/fy-2026-ipps-final-rule-home-page",
    agency: "HHS",
    owner: "Centers for Medicare & Medicaid Services",
    access: "Report Series",
    limitation: "The rule and supporting files publish the current Medicare uncompensated-care methodology, but they do not establish the Medicaid-payment offset adjustment required by GAO-16-568 Recommendation 2.",
  },
  {
    id: "source-56s-cms-comprehensive-medicaid-integrity-plan-2024-2028",
    name: "CMS Comprehensive Medicaid Integrity Plan for Fiscal Years 2024–2028",
    url: "https://www.cms.gov/files/document/comprehensive-medicaid-integrity-plan-fys-2024-2028.pdf",
    agency: "HHS",
    owner: "Centers for Medicare & Medicaid Services",
    access: "Data Download",
    limitation: "The plan documents risk assessments and mitigation work, but GAO still classifies the recommendation as Open – Partially Addressed and requires a national assessment tied to oversight-resource allocation.",
  },
  {
    id: "source-56s-cdc-response-readiness-framework-2024-2028",
    name: "CDC Public Health Response Readiness Framework 2024–2028",
    url: "https://www.cdc.gov/readiness/php/next-gen-phep/index.html",
    agency: "HHS",
    owner: "Centers for Disease Control and Prevention",
    access: "Release Page",
    limitation: "The framework sets ten preparedness priorities, including local support and data modernization, but it is not the recommendation-specific jurisdiction capability-gap dataset, analysis, or 180-day response.",
  },
  {
    id: "source-56s-faa-aviation-safety-workforce-plan-2026",
    name: "FAA Aviation Safety Oversight and Certification Workforce Plan 2026",
    url: "https://www.faa.gov/sites/faa.gov/files/2026-AVS-Workforce-Plan.pdf",
    agency: "DOT",
    owner: "Federal Aviation Administration",
    access: "Data Download",
    limitation: "The plan forecasts aviation-safety staffing and skills for a major component, but it is not a quantitative assessment of every mission-critical occupation and skill gap covered by GAO-21-310 Recommendation 1.",
  },
  {
    id: "source-56s-dot-fy2026-budget-discretionary-grants-centralization",
    name: "DOT Fiscal Year 2026 Budget Estimates: Discretionary Grants Systems Centralization",
    url: "https://www.transportation.gov/sites/dot.gov/files/2025-05/OST_FY_2026_Budget_Estimates_CJ.pdf",
    agency: "DOT",
    owner: "U.S. Department of Transportation",
    access: "Data Download",
    limitation: "The budget justification describes a planned single process and enterprise grants solution. It is planning evidence, not a completed directive, operating system, or documented implementation of GAO-17-20 Recommendation 1.",
  },
  {
    id: "source-56s-dot-iija-funding-status-2026",
    name: "DOT Infrastructure Investment and Jobs Act Funding Status, 2026",
    url: "https://www.transportation.gov/mission/budget/infrastructure-investment-and-jobs-act-iija-funding-status",
    agency: "DOT",
    owner: "U.S. Department of Transportation",
    access: "Interactive Portal",
    limitation: "The monthly report publishes obligations and outlays but aggregates grants announced across formula and discretionary funding, so it does not by itself provide the complete comparison requested by GAO-25-107166 Recommendation 1.",
  },
  {
    id: "source-56s-vha-enterprise-risk-management",
    name: "VHA Enterprise Risk Management",
    url: "https://www.va.gov/VHAOVERSIGHT/risk-management/index.asp",
    agency: "VA",
    owner: "Veterans Health Administration",
    access: "Release Page",
    limitation: "The page describes the VHA enterprise-risk function at a high level. It does not demonstrate that the restructured function fully incorporates every GAO leading practice or is operating across the health system.",
  },
  {
    id: "source-56s-va-fy2026-ehr-budget-submission",
    name: "VA Fiscal Year 2026 Congressional Submission, Volume V: Information Technology and EHR Modernization",
    url: "https://department.va.gov/wp-content/uploads/2025/06/2026-Volume-5-Information-Technology-Programs-and-Electronic-Health-Record-Modernization.pdf",
    agency: "VA",
    owner: "U.S. Department of Veterans Affairs",
    access: "Data Download",
    limitation: "The budget volume provides annual appropriations and program plans, not a reliable full-life-cycle estimate or a full-program integrated master schedule following GAO best practices.",
  },
  {
    id: "source-56s-va-ehr-deployment-schedule-2026-2031",
    name: "VA Federal EHR Deployment Schedule, 2026–2031",
    url: "https://digital.va.gov/ehr-modernization/ehr-deployment-schedule/",
    agency: "VA",
    owner: "U.S. Department of Veterans Affairs",
    access: "Release Page",
    limitation: "The public site schedule lists deployment dates. It is not an integrated master schedule for the full modernization program and does not expose dependencies, critical path, resources, or schedule-risk analysis.",
  },
  {
    id: "source-56s-va-acquisition-lifecycle-publication-status",
    name: "VA Inactive Publications Index: Notice 24-08 Status",
    url: "https://www.va.gov/vapubs/search_action.cfm?dType=5&viewinactive=1",
    agency: "VA",
    owner: "U.S. Department of Veterans Affairs",
    access: "Manual Page Check",
    limitation: "The official index records Notice 24-08 as expired on November 14, 2025. It does not identify a successor directive or show that the Acquisition Lifecycle Framework is fully implemented.",
  },
];

for (const source of newSources) {
  const meta = agencyMeta[source.agency];
  await writeJson(join(contentRoot, "sources", `${source.id}.json`), {
    id: source.id,
    name: source.name,
    url: source.url,
    source_type: "Government Agency",
    credibility_level: "Tier 1",
    primary_topics: meta.topics,
    framework_layers: meta.layers,
    country_or_region: "United States",
    update_frequency: "Event Driven",
    capture_priority: "High",
    known_limitations: source.limitation,
    last_checked_date: capturedDate,
    watch_lanes: ["Security and Standards", "Cross-Cutting Official Rails"],
    live_access_type: source.access,
    ...(source.access === "Data Download" ? { data_download_url: source.url } : {}),
    review_cadence_days: 45,
    monitoring_status: "Active",
    coverage_role: ["Primary Data", "Source Freshness"],
    jurisdiction: "United States federal government",
    source_owner: source.owner,
    notes: `Phase 56S official scope-audit source. Collection: ${collectionSlug}.`,
  });
}

const S = {
  support: "Supported by located public record",
  partial: "Partly supported by located public record",
  missing: "Not established by located public record",
};
const item = (requirement, status, evidence) => ({ requirement, status, evidence });
const specs = {
  "DOE-01": { items: [item("Full pit-production capability life-cycle scope", S.missing, "No complete public life-cycle estimate located."), item("GAO-aligned cost-estimating method and assumptions", S.missing, "Program pages and project estimates do not expose a conforming full-scope estimate."), item("Risk and uncertainty analysis across the production capability", S.missing, "No public recommendation-specific analysis located.")] },
  "DOE-02": { items: [item("Complex-wide inventory and disposal pathways", S.missing, "The cited April 2026 material is not separately public."), item("Comparison of disposal alternatives across sites", S.missing, "No public complex-wide alternatives analysis located."), item("Identification of an optimal strategy and basis", S.missing, "No public recommendation-specific optimization result located.")] },
  "DOE-03": { source_ids: ["source-56s-doe-spr-long-term-strategic-review-2016"], items: [item("Periodic successor review", S.missing, "The located review is the 2016 baseline, not a later periodic successor."), item("Reserve-size cost and benefit alternatives", S.partial, "The 2016 review covers costs and benefits of SPR options."), item("Timely information for current congressional decisions", S.missing, "The 2016 baseline does not establish a current periodic review.")] },
  "DOE-04": { source_ids: ["source-56s-oced-independent-assessments-guidance-2024"], items: [item("Independent assessments at key project decision points", S.partial, "OCED guidance describes risk-triggered and pre-construction assessments."), item("Coverage across all covered DOE large nuclear demonstrations", S.missing, "The public guidance applies to OCED recipients and does not establish cross-office coverage."), item("Binding external-review requirement", S.missing, "The guidance says it is informational and not a requirements document.")] },
  "DOE-05": { items: [item("Pause in covered Hanford facility work", S.missing, "No exact public pause decision located."), item("Completion of named prerequisites", S.missing, "No public prerequisite-completion package located."), item("Consideration of an independent high-level-waste alternatives analysis", S.missing, "No recommendation-specific decision record located.")] },
  "HHS-01": { source_ids: ["source-56s-cms-fy2026-ipps-final-rule"], items: [item("Hospital-level Medicare uncompensated-care methodology", S.support, "CMS publishes the current rule and hospital payment files."), item("Identification of Medicaid payments that offset uncompensated-care costs", S.missing, "The located rule does not expose the GAO-recommended offset treatment."), item("Adjustment of individual Medicare hospital payments for those offsets", S.missing, "No public exact methodology change located.")] },
  "HHS-02": { source_ids: ["source-56s-cms-comprehensive-medicaid-integrity-plan-2024-2028"], items: [item("National view of Medicaid program-integrity risks", S.partial, "The plan documents a centralized vulnerability process and named risk areas."), item("Assessment of oversight-resource capacity", S.missing, "The plan does not publish a national resource-capacity assessment."), item("Allocation of resources to highest-risk areas", S.partial, "The plan describes risk prioritization, but not the complete recommendation-specific allocation decision.")] },
  "HHS-03": { source_ids: ["source-56s-cdc-response-readiness-framework-2024-2028"], items: [item("Collection of jurisdiction capability information", S.partial, "The framework guides PHEP priorities but does not publish the requested jurisdiction-level dataset."), item("Analysis of capability gaps across jurisdictions", S.missing, "No current national capability-gap analysis located."), item("Use of results for preparedness support and decisions", S.partial, "The framework prioritizes local support and data modernization without providing the recommendation-specific analysis.")] },
  "HHS-04-R1": { items: [item("Department-wide coordination procedures", S.missing, "No separately public SOP located."), item("Use across HHS component agencies", S.missing, "No public exercise or response record demonstrates operation."), item("After-action report documenting coordination", S.missing, "No qualifying public AAR located.")] },
  "HHS-04-R2": { items: [item("Procedure for relevant external-stakeholder participation", S.missing, "No separately public SOP located."), item("Identification and inclusion of appropriate stakeholders", S.missing, "No public exercise or response record demonstrates the procedure."), item("After-action report documenting participation", S.missing, "No qualifying public AAR located.")] },
  "DOT-01": { source_ids: ["source-56s-faa-aviation-safety-workforce-plan-2026"], items: [item("Coverage of every mission-critical occupation", S.missing, "The plan covers the aviation-safety workforce, not all FAA mission-critical occupations."), item("Quantitative current-versus-required skill gaps", S.partial, "The plan includes workforce forecasting but not the complete quantitative skill-gap assessment."), item("Remediation priorities tied to measured gaps", S.partial, "The plan discusses workforce actions without publishing the full recommendation-specific assessment.")] },
  "DOT-02": { source_ids: ["source-56r-faa-flight-plan-2026", "source-56r-faa-air-traffic-controller-workforce-plan-2026-2028"], items: [item("Integrated recruiting, hiring, and training data", S.partial, "The public plans provide workforce context, not the dashboard documentation under GAO review."), item("Process-performance measures and trend analysis", S.partial, "The plans name targets but do not expose the full integrated dashboard."), item("Evidence that FAA uses results to improve processes", S.missing, "Public plans do not establish GAO acceptance of operational use.")] },
  "DOT-03": { source_ids: ["source-56s-dot-fy2026-budget-discretionary-grants-centralization"], items: [item("Department-wide discretionary-grant directive or equivalent guidance", S.missing, "The budget describes the intended common process but is not the completed directive."), item("Single lifecycle process and enterprise system", S.partial, "The budget documents a planned enterprise solution."), item("Documentation of reviews and key decisions across programs", S.missing, "No completed operating package or implementation evidence located.")] },
  "DOT-04": { source_ids: ["source-56s-dot-iija-funding-status-2026"], items: [item("Formula funding obligations and outlays", S.partial, "The monthly page publishes totals but does not consistently isolate the formula portion."), item("Discretionary funding obligations and outlays", S.partial, "The page includes grants announced and totals but aggregates formula and discretionary funding."), item("Complete comparison supplied to Congress", S.missing, "The public page does not establish the complete congressional reporting package.")] },
  "DOT-05": { items: [item("Portfolio-wide grant-agreement risk identification", S.missing, "No separately public January 2026 guidance or enterprise profile located."), item("Risk rating, monitoring, and response method", S.missing, "No complete public methodology located."), item("Coverage across operating administrations", S.missing, "No public implementation evidence for the full portfolio located.")] },
  "DOT-06": { source_ids: ["source-56r-faa-drone-normalization-strategy-update-2026"], candidate: true, items: [item("Purpose, problem definition, and integration scope", S.support, "The public strategy defines the normalization objective and operating context."), item("Goals, actions, roles, milestones, and resources", S.partial, "The strategy includes actions and milestones, but FTFN does not substitute its checklist for GAO's seven-element review."), item("Performance measures, risks, and implementation accountability", S.partial, "The public document contains relevant material; GAO acceptance is not recorded.")] },
  "DOT-07": { source_ids: ["source-56r-faa-drone-normalization-strategy-update-2026"], items: [item("Specific information-centric airspace milestones", S.partial, "The strategy describes phased integration activity."), item("Clear organizational roles and estimated costs", S.missing, "The public strategy does not establish the complete recommendation-specific package."), item("Communication and detect-and-avoid technical milestones", S.partial, "Relevant initiatives appear, but implementation and GAO acceptance are not recorded.")] },
  "DOT-08": { source_ids: ["source-56r-dot-automated-vehicle-framework-2025"], candidate: true, items: [item("One department-wide automated-vehicle plan", S.partial, "DOT publishes a framework, while GAO says it is not the comprehensive plan required."), item("Goals, priorities, and implementation steps", S.partial, "The framework identifies policy directions and initiatives."), item("Milestones and performance measures", S.missing, "GAO reports these comprehensive-plan elements remain insufficient.")] },
  "VA-01": { source_ids: ["source-56s-vha-enterprise-risk-management"], items: [item("Governance and leadership commitment", S.partial, "VHA publicly describes an enterprise-risk function."), item("Risk identification, assessment, response, and monitoring across the system", S.partial, "The public page states the function but does not demonstrate full leading-practice operation."), item("Evidence of implementation and continuous improvement", S.missing, "No recommendation-specific operating record located.")] },
  "VA-02-R1": { source_ids: ["source-56s-va-fy2026-ehr-budget-submission"], items: [item("Full modernization life-cycle scope", S.missing, "The budget is annual and does not provide a complete life-cycle estimate."), item("Reliable cost-estimating method, assumptions, and uncertainty", S.missing, "The public budget does not expose a GAO-best-practice estimate package."), item("Independent update covering the end state beyond the current contract", S.missing, "No full-life-cycle estimate located.")] },
  "VA-02-R2": { source_ids: ["source-56s-va-fy2026-ehr-budget-submission", "source-56s-va-ehr-deployment-schedule-2026-2031"], items: [item("Full-program schedule through modernization completion", S.partial, "The public deployment page extends to 2031 but is a site calendar, not a full IMS."), item("Dependencies, resources, and critical path", S.missing, "Those integrated-schedule elements are not public on the deployment page."), item("Schedule risk analysis and baseline control", S.missing, "No GAO-best-practice IMS package located.")] },
  "VA-03": { source_ids: ["source-56r-va-notice-24-08-acquisition-lifecycle-framework", "source-56s-va-acquisition-lifecycle-publication-status"], candidate: true, items: [item("Acquisition lifecycle framework and stage gates", S.support, "Notice 24-08 publicly establishes the framework."), item("Finalized governance, workforce, cost-data, alignment, and compliance mechanisms", S.partial, "The notice identifies structure but GAO says implementation risks remain."), item("Current successor authority and operating evidence", S.missing, "The official publications index marks Notice 24-08 expired and no successor was located.")] },
  "VA-04": { items: [item("Category-specific cost-avoidance and budget-savings goals", S.missing, "No public 180-day response or goal register located."), item("Baselines and methods for each goal", S.missing, "No recommendation-specific public artifact located."), item("Tracked progress and governance accountability", S.missing, "No public progress record located.")] },
  "VA-05": { items: [item("Joint VA–DOD assessment of transition support", S.missing, "The draft described to GAO is not separately public."), item("Identification of gaps, overlap, or duplication", S.missing, "No completed public assessment located."), item("Recommended changes and joint follow-through", S.missing, "No recommendation-specific public decision package located.")] },
};

const sourceById = new Map();
for (const file of await readdir(join(contentRoot, "sources"))) {
  if (!file.endsWith(".json")) continue;
  const source = JSON.parse(await readFile(join(contentRoot, "sources", file), "utf8"));
  sourceById.set(source.id, source);
}

const priorDocs = new Map();
for (const file of await readdir(join(contentRoot, "research-documents"))) {
  if (!file.endsWith(".json")) continue;
  const document = JSON.parse(await readFile(join(contentRoot, "research-documents", file), "utf8"));
  priorDocs.set(document.id, document);
}

const records = phase56r.records.map((base) => {
  const spec = specs[base.action_key];
  if (!spec || spec.items.length !== 3) throw new Error(`Missing three-element scope checklist for ${base.action_key}.`);
  const locatedSourceIds = [...new Set(spec.source_ids ?? [])];
  const availabilityClass = spec.candidate
    ? "Public candidate artifact; GAO sufficiency unresolved"
    : locatedSourceIds.length
      ? "Scope-adjacent public material located"
      : "No separately public response artifact located";
  const searchFinding = spec.candidate
    ? "A public candidate artifact was located and checked against the directive; the current GAO record does not accept it as full implementation."
    : locatedSourceIds.length
      ? "Relevant official public material was located, but it does not expose or satisfy every element of the exact response artifact."
      : "The official repository pass did not locate a separate public copy of the exact response artifact as of the capture date; this does not prove the artifact does not exist."
  const slugBase = base.signal_id.replace("signal-56r-", "");
  return {
    ...base,
    phase_56r_record_id: base.record_id,
    record_id: `record-56s-${slugBase}`,
    phase: "56S",
    scope_checklist: spec.items,
    scope_elements_total: spec.items.length,
    public_supported_elements: spec.items.filter((entry) => entry.status === S.support).length,
    public_partially_supported_elements: spec.items.filter((entry) => entry.status === S.partial).length,
    public_unestablished_elements: spec.items.filter((entry) => entry.status === S.missing).length,
    repositories_checked: agencyMeta[base.action_key.split("-")[0]].repositories,
    located_source_ids: locatedSourceIds,
    located_official_urls: locatedSourceIds.map((id) => sourceById.get(id)?.url).filter(Boolean),
    availability_class: availabilityClass,
    search_finding: searchFinding,
    ftfn_scope_finding: `FTFN public-scope check: ${spec.items.filter((entry) => entry.status === S.support).length} supported, ${spec.items.filter((entry) => entry.status === S.partial).length} partial, and ${spec.items.filter((entry) => entry.status === S.missing).length} not established across three directive elements.`,
    gao_acceptance_state: base.gao_review_state,
    implementation_change: false,
    closure_change: false,
    continuation_rule: `Continue the Phase 56R rule and recheck exact agency repositories plus the GAO product page when a named artifact or status changes. An availability result or FTFN scope check cannot substitute for GAO acceptance.`,
    document_id: `research-doc-56s-${slugBase}`,
    signal_id: `signal-56s-${slugBase}`,
  };
});

const availabilityCounts = records.reduce((counts, record) => ({ ...counts, [record.availability_class]: (counts[record.availability_class] ?? 0) + 1 }), {});
const totalScopeElements = records.reduce((sum, record) => sum + record.scope_elements_total, 0);
const supportedElements = records.reduce((sum, record) => sum + record.public_supported_elements, 0);
const partialElements = records.reduce((sum, record) => sum + record.public_partially_supported_elements, 0);
const unestablishedElements = records.reduce((sum, record) => sum + record.public_unestablished_elements, 0);
const ledger = {
  phase: "56S",
  captured_date: capturedDate,
  goal: "Audit every Phase 56R recommendation against a three-element directive checklist, acquire separately public official materials, and publish an explicit missing-document register.",
  availability_rule: "Failure to locate a public copy does not prove an artifact does not exist; public availability does not establish sufficiency, implementation, or closure.",
  scope_rule: "FTFN scope findings describe visible document coverage only and never substitute for GAO acceptance.",
  recommendation_records: records.length,
  scope_elements: totalScopeElements,
  scope_element_counts: { supported: supportedElements, partial: partialElements, not_established: unestablishedElements },
  new_public_source_profiles: newSources.length,
  availability_class_counts: availabilityCounts,
  implementation_changes: [],
  closure_changes: [],
  prior_closure_counts: phase56r.post_batch_closure_counts,
  post_batch_closure_counts: phase56r.post_batch_closure_counts,
  inherited_hold: phase56r.inherited_hold,
  records,
};
await writeJson(join(dataRoot, "phase-56s-artifact-scope-audit-missing-document-register.json"), ledger);

const documentFiles = (await readdir(join(contentRoot, "research-documents"))).filter((file) => !file.includes("-56s-") && /^\d{3}-/.test(file));
const firstNumber = Math.max(...documentFiles.map((file) => Number(file.slice(0, 3)))) + 1;
for (const [index, record] of records.entries()) {
  const meta = agencyMeta[record.action_key.split("-")[0]];
  const slug = record.signal_id.replace("signal-", "");
  const prior = priorDocs.get(record.phase_56r_record_id ? phase56r.records.find((item) => item.record_id === record.phase_56r_record_id)?.document_id : "");
  const supportingSourceIds = record.located_source_ids;
  const document = {
    id: record.document_id,
    collection_id: collectionId,
    title: `${record.action_key}: ${record.official_identity} artifact scope audit`,
    slug,
    record_status: "Published",
    publisher: "U.S. Government Accountability Office and named implementing agency",
    publication_date: prior?.publication_date ?? null,
    document_type: "Oversight Report",
    summary: `${record.official_identity} remains ${record.current_status}. Phase 56S checks three directive elements and classifies the public document result as ${record.availability_class.toLowerCase()}.`,
    key_findings: [
      `Parent crosswalk: ${record.parent_action_key}.`,
      `Official identity: ${record.official_identity}.`,
      `Availability class: ${record.availability_class}.`,
      `Repository finding: ${record.search_finding}`,
      ...record.scope_checklist.map((entry, position) => `Scope element ${position + 1}: ${entry.requirement} — ${entry.status}. ${entry.evidence}`),
      record.ftfn_scope_finding,
      `GAO acceptance state: ${record.gao_acceptance_state}.`,
      `Continuation rule: ${record.continuation_rule}`,
    ],
    why_it_matters: "Document-level scope checks show exactly what a public artifact covers, what remains unavailable, and why availability cannot be converted into implementation or closure.",
    ftfn_relevance: [
      `Preserves ${record.parent_action_key} and its exact recommendation identity.`,
      "Records an official repository search trail and explicit public-availability result.",
      "Separates FTFN's visible-scope check from GAO acceptance, implementation, closure, and operating outcomes.",
    ],
    evidence_limits: [
      "Not publicly located does not mean nonexistent or withheld.",
      "A public document may be scope-adjacent without being the exact implementation artifact.",
      "FTFN document-scope findings do not substitute for GAO's recommendation-status decision.",
      "Document evidence does not establish performance, readiness, safety, savings, value, ranking, composite score, or causation.",
    ],
    primary_topics: meta.topics,
    framework_layers: meta.layers,
    constraint_tags: ["Regulation", "Data Quality", "Public Trust"],
    source_id: record.source_id,
    supporting_source_ids: supportingSourceIds,
    supporting_official_urls: record.located_official_urls,
    official_url: record.official_url,
    local_capture_path: `/downloads/${collectionSlug}/official-links/${String(index + 1).padStart(2, "0")}-${slug.replace(/^56s-/, "")}.txt`,
    archive_member: `official-links/${String(index + 1).padStart(2, "0")}-${slug.replace(/^56s-/, "")}.txt`,
    capture_status: "Official link record",
    captured_date: capturedDate,
  };
  await writeJson(join(contentRoot, "research-documents", `${String(firstNumber + index).padStart(3, "0")}-${slug}.json`), document);
  const allSourceIds = [...new Set([record.source_id, ...supportingSourceIds])];
  const signal = `---
id: ${JSON.stringify(record.signal_id)}
title: ${JSON.stringify(`${record.action_key}: ${record.availability_class}`)}
slug: ${JSON.stringify(slug)}
record_status: "Published"
summary: ${JSON.stringify(`${record.official_identity} receives a three-element public-document scope audit with a separate GAO-acceptance boundary.`)}
${yamlList("source_ids", allSourceIds)}
published_date: ${capturedDate}
captured_date: ${capturedDate}
primary_topic: ${JSON.stringify(meta.topics[0])}
${yamlList("framework_layers", meta.layers)}
signal_type: "Research Result"
maturity_level: "Infrastructure"
time_horizon: "Now"
evidence_quality: "Audited or Verified Data"
verification_status: "Verified Against Primary Source"
why_it_matters: "The audit distinguishes exact artifacts, adjacent public material, missing public copies, visible scope, and authoritative acceptance."
${yamlList("dependencies", ["exact recommendation identity", "official repository availability", "document scope", "GAO acceptance"])}
${yamlList("constraints", ["Regulation", "Data Quality", "Public Trust"])}
${yamlList("receiving_systems", ["Phase 56S artifact scope audit and missing-document register"])}
${yamlList("local_implications", ["Do not convert public availability or an FTFN scope finding into implementation, closure, performance, or outcome."])}
${yamlList("evidence_gap_ids", meta.gaps)}
claim_scope: "Specific Source Update"
local_evidence_level: "General Source Layer"
last_reviewed_date: ${capturedDate}
---

## Availability result

${record.availability_class}. ${record.search_finding}

## Three-element scope checklist

${record.scope_checklist.map((entry) => `- **${entry.requirement}:** ${entry.status}. ${entry.evidence}`).join("\n")}

## Authority boundary

${record.ftfn_scope_finding} GAO acceptance remains: ${record.gao_acceptance_state}. An availability result or FTFN checklist is not implementation or closure.
`;
  await writeFile(join(contentRoot, "signals", `${record.signal_id}.mdx`), signal, "utf8");
  const linkRecord = [
    `FTFN Phase 56S official-link record ${String(index + 1).padStart(2, "0")}`,
    `Action key: ${record.action_key}`,
    `Official identity: ${record.official_identity}`,
    `GAO URL: ${record.official_url}`,
    `Availability class: ${record.availability_class}`,
    "Located public sources:",
    ...(record.located_official_urls.length ? record.located_official_urls.map((url) => `- ${url}`) : ["- No separately public response artifact located in the bounded search."]),
    "Repositories checked:",
    ...record.repositories_checked.map((repository) => `- ${repository}`),
    `Scope finding: ${record.ftfn_scope_finding}`,
    "Boundary: not publicly located does not mean nonexistent; FTFN scope findings do not substitute for GAO acceptance.",
  ].join("\n");
  await writeFile(join(archiveRoot, document.archive_member), `${linkRecord}\n`, "utf8");
}

await writeJson(join(dataRoot, "phase-56s-publication-review.json"), {
  phase: "56S",
  captured_date: capturedDate,
  reviewed_records: records.length,
  new_source_profiles: newSources.length,
  document_decisions: { promoted: records.map((record) => record.document_id), held: [] },
  signal_decisions: { promoted: records.map((record) => record.signal_id), held: [] },
  availability_class_counts: availabilityCounts,
  scope_element_counts: ledger.scope_element_counts,
  publication_rule: "Publish the bounded repository and scope result while preserving the GAO-acceptance, implementation, closure, and outcome boundaries.",
});

await writeJson(join(contentRoot, "research-collections", `${collectionSlug}.json`), {
  id: collectionId,
  title: "GAO Recommendation Artifact Scope Audit and Missing-Document Register, 2026",
  slug: collectionSlug,
  record_status: "Published",
  summary: "Phase 56S publishes twenty-four three-element recommendation checklists, twelve new official sources, and an explicit public-document availability register.",
  scope: "DOE, HHS, DOT, and VA recommendation-level public artifact availability, visible document scope, missing-document findings, and GAO-acceptance boundaries.",
  captured_date: capturedDate,
  document_ids: records.map((record) => record.document_id),
  download_path: `/downloads/${collectionSlug}.zip`,
  download_note: "The twenty-seven-file archive contains twenty-four recommendation-level official-link records, consolidated summaries, a README, and a checksum manifest.",
  method_note: "Every record uses a three-element directive checklist. Not publicly located does not prove nonexistence; public availability and FTFN scope findings do not establish GAO acceptance, implementation, closure, or outcome.",
});

const allSignalIds = records.map((record) => record.signal_id);
const briefing = `---
id: ${JSON.stringify(briefingId)}
title: "Research Watch 023: Recommendation Artifact Scope Audit"
slug: "research-watch-023-recommendation-artifact-scope-audit"
record_status: "Published"
summary: "Phase 56S audits 72 directive elements across 24 recommendations, adds 12 official sources, and publishes an explicit missing-document register."
published_date: ${capturedDate}
captured_date: ${capturedDate}
${yamlList("signal_ids", allSignalIds)}
${yamlList("evidence_gap_ids", ["gap-008", "gap-015", "gap-016"])}
claim_scope: "Editorial Synthesis"
local_evidence_level: "General Source Layer"
last_reviewed_date: ${capturedDate}
${yamlList("top_takeaways", [
    `The 24 records contain 72 directive elements: ${supportedElements} supported, ${partialElements} partially supported, and ${unestablishedElements} not established by located public records.`,
    "Three public candidate artifacts remain subject to unresolved GAO sufficiency; thirteen records have only scope-adjacent public material; eight have no separately public response artifact located.",
    "Twelve new official source profiles expose useful evidence without promoting any recommendation to implemented or closed.",
    "The Phase 56F entity evidence ledger remains one Closed, twenty-one Partially Closed, and two Open.",
  ])}
${yamlList("constraint_watch", ["Data Quality", "Regulation", "Public Trust"])}
${yamlList("what_to_watch_next", ["New agency response artifacts and successor directives", "GAO sufficiency decisions for public candidate artifacts", "Exact documents currently described but not separately public"])}
---

## What Phase 56S adds

Every Phase 56R recommendation now has a three-element directive checklist, a named official-repository search trail, a public-document availability classification, a visible-scope finding, and a separate GAO-acceptance state.

## Availability results

Three records have public candidate artifacts with unresolved GAO sufficiency, thirteen have scope-adjacent public material, and eight have no separately public response artifact located. The bounded search adds twelve official sources, including DOE independent-assessment guidance, CMS Medicaid integrity planning, DOT grant reporting, and VA EHR and policy records.

## Evidence boundary

Not publicly located does not mean nonexistent. A public artifact is not necessarily sufficient. An FTFN scope checklist is not a GAO decision, and none of these records establishes implementation, closure, performance, readiness, safety, savings, value, ranking, score, or causation.
`;
await writeFile(join(contentRoot, "briefings", `${briefingId}.mdx`), briefing, "utf8");

await writeJson(join(contentRoot, "updates", "2026-08-02-phase-56s-recommendation-artifact-scope-audit.json"), {
  id: "update-2026-08-02-phase-56s-recommendation-artifact-scope-audit",
  effective_date: capturedDate,
  entry_type: "Research Collection",
  title: "Phase 56S publishes recommendation artifact scope audits and a missing-document register",
  summary: `FTFN audits ${totalScopeElements} directive elements across twenty-four recommendations and adds twelve official public sources without changing implementation or closure states.`,
  affected_record_ids: [collectionId, briefingId, ...allSignalIds],
  related_paths: [`/research/${collectionSlug}/`, "/briefings/research-watch-023-recommendation-artifact-scope-audit/", ...records.map((record) => `/signals/${record.signal_id.replace("signal-", "")}/`)],
  evidence_note: "Public availability, FTFN scope findings, GAO acceptance, implementation, closure, entity evidence, and operating outcomes remain separate.",
  work_package: "docs/work-packages/phase-56s-recommendation-artifact-scope-audit-missing-document-acquisition.md",
});

console.log(`Generated Phase 56S: ${records.length} records, ${totalScopeElements} scope elements, ${newSources.length} new sources, availability ${JSON.stringify(availabilityCounts)}.`);
