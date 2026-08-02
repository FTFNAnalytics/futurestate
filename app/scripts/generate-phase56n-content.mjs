import { mkdir, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

const appRoot = fileURLToPath(new URL("..", import.meta.url));
const contentRoot = join(appRoot, "src", "content");
const dataRoot = join(appRoot, "src", "data");
const publicRoot = join(appRoot, "public");
const capturedDate = "2026-08-01";
const collectionSlug = "verified-remediation-component-outcomes-batch-two-2026";
const collectionId = `research-collection-${collectionSlug}`;
const briefingId = "briefing-research-watch-018-verified-remediation-outcomes";

const sourceProfiles = [
  {
    id: "source-56n-gao-federal-ai-recommendation-status-2026",
    name: "Artificial Intelligence: Agencies Have Begun Implementation but Need to Complete Key Requirements",
    url: "https://www.gao.gov/products/gao-24-105980",
    publisher: "U.S. Government Accountability Office",
    topics: ["AI for Science", "Cybersecurity", "Policy and Standards"],
    limitation:
      "The recommendation updates use different agency actions, dates, and evidence packages. Closed-Implemented means GAO found the named recommendation addressed; it does not measure AI performance, safety, mission benefit, or cross-agency quality.",
  },
  {
    id: "source-56n-hhs-oig-recommendations-tracker-2026",
    name: "HHS OIG Recommendations Tracker: A-18-22-08021",
    url: "https://oig.hhs.gov/reports/recommendations/tracker/?hhs-agency=all&search=A-18-22-08021&view-mode=report-grouped",
    publisher: "Department of Health and Human Services Office of Inspector General",
    topics: ["Cybersecurity", "Policy and Standards"],
    limitation:
      "The tracker was last updated July 22, 2026 and still showed a July 29 expected update on the August 1 check. That lag is a publication-boundary observation, not evidence about unposted remediation work.",
  },
  {
    id: "source-56n-dhs-gao-priority-recommendations-2026",
    name: "Priority Open Recommendations: Department of Homeland Security",
    url: "https://www.gao.gov/products/gao-26-109077",
    publisher: "U.S. Government Accountability Office",
    topics: ["Cybersecurity", "Policy and Standards"],
    limitation:
      "The report supplies portfolio counts and priority areas. It does not make all recommendations comparable or turn implementation counts into department performance, service, safety, or readiness measures.",
  },
  {
    id: "source-56n-doe-insider-threat-recommendations-2026",
    name: "Nuclear Security: DOE Should Take Actions to Fully Implement Insider Threat Program",
    url: "https://www.gao.gov/products/gao-23-105576",
    publisher: "U.S. Government Accountability Office",
    topics: ["Cybersecurity", "Policy and Standards"],
    limitation:
      "The seven recommendations address one insider-threat program. Recommendation closure does not establish incident prevention, site-level control effectiveness, mission outcomes, or department-wide FISMA effectiveness.",
  },
  {
    id: "source-56n-va-southern-oregon-followup-2026",
    name: "Follow-Up Inspection of Information Security at the VA Southern Oregon Healthcare System",
    url: "https://www.vaoig.gov/reports/information-security-inspection/follow-inspection-information-security-va-southern-oregon",
    publisher: "Department of Veterans Affairs Office of Inspector General",
    topics: ["Cybersecurity", "Policy and Standards"],
    limitation:
      "The follow-up covers one healthcare system and selected configuration, security-management, and access controls. It is not the VA-wide FY 2025 FISMA result or closure of the separate iFAMS recommendations.",
  },
];

const common = {
  layers: ["Enabling Infrastructure", "Human Systems"],
  constraints: ["Cybersecurity", "Data Quality", "Standards", "Public Trust"],
};

const records = [
  {
    slug: "nasa-ai-recommendation-status",
    documentNumber: 399,
    coverageId: "coverage-56f-nasa",
    entityId: "agency-nasa",
    entityName: "National Aeronautics and Space Administration",
    sourceId: sourceProfiles[0].id,
    publicationDate: "2023-12-12",
    recordIdentity: "GAO-24-105980 recommendations 33 and 34",
    statusPeriod: "Recommendation 33 evidence through December 2024; recommendation 34 review in February 2026",
    finding:
      "GAO lists both NASA recommendations Open. NASA reported evaluating use cases and retiring 38, but did not provide supporting documentation for the required plan; GAO also found the 2025 AI inventory missing start dates and required high-impact-use information.",
    decision:
      "Publish the exact two-action non-closure. The record materially separates reported agency activity from GAO-verified recommendation implementation.",
    remainingGap:
      "Supporting documentation for the consistency-or-retirement plan, a complete 2025 AI inventory, recommendation closure, and system-level operating outcomes.",
    reopeningRule:
      "Reopen when GAO changes recommendation 33 or 34 status or NASA publishes documentation that GAO accepts as implementation evidence.",
    limitation:
      "Open status and retired-use-case counts do not measure NASA AI performance, safety, mission benefit, cybersecurity effectiveness, or the GAO-25-108138 cyber recommendations.",
    recordStatus: "Published",
    signal: {
      id: "signal-56n-nasa-ai-recommendations-open",
      slug: "56n-nasa-ai-recommendations-open",
      title: "NASA AI governance recommendations remain open after partial agency actions",
      summary:
        "GAO still lists NASA recommendations 33 and 34 as Open: reported use-case reviews and retirements did not include the required plan evidence, and the 2025 inventory remained incomplete.",
      body:
        "GAO records two distinct NASA AI governance gaps. Recommendation 33 remains Open because reported use-case evaluations and 38 retirements were not accompanied by documentation demonstrating the required consistency-or-retirement plan. Recommendation 34 remains Open because GAO's February 2026 review found missing system or pilot start dates and missing required high-impact AI information in NASA's 2025 inventory.",
    },
  },
  {
    slug: "doe-ai-inventory-recommendation-open",
    documentNumber: 400,
    coverageId: "coverage-56f-doe",
    entityId: "agency-doe",
    entityName: "Department of Energy",
    sourceId: sourceProfiles[0].id,
    publicationDate: "2023-12-12",
    recordIdentity: "GAO-24-105980 recommendation 13",
    statusPeriod: "GAO review of DOE's 2025 AI use-case inventory as of February 2026",
    finding:
      "GAO lists recommendation 13 Open because DOE's 2025 AI inventory omitted required operational or pilot start dates and demographic-variable information for several use cases.",
    decision:
      "Publish the exact inventory-recommendation non-closure; it adds a named data-quality rail without substituting for DOE's FY 2025 FISMA result.",
    remainingGap:
      "A corrected inventory accepted by GAO, recommendation closure, the department-wide FY 2025 FISMA result, and measured system outcomes.",
    reopeningRule:
      "Reopen when GAO changes recommendation 13 status or DOE publishes a corrected inventory that GAO accepts as implementation evidence.",
    limitation:
      "Inventory completeness is an AI governance control, not a measure of model performance, adoption, mission benefit, cybersecurity effectiveness, or DOE-wide readiness.",
    recordStatus: "Published",
    signal: {
      id: "signal-56n-doe-ai-inventory-recommendation-open",
      slug: "56n-doe-ai-inventory-recommendation-open",
      title: "DOE AI inventory recommendation remains open on missing required fields",
      summary:
        "GAO still lists DOE recommendation 13 as Open after finding missing start-date and demographic-variable fields in the department's 2025 AI inventory.",
      body:
        "GAO's February 2026 review found that several DOE AI use cases lacked required dates showing when a system became operational or a pilot began, and lacked required demographic-variable information. Recommendation 13 therefore remains Open pending a corrected inventory and accepted implementation evidence.",
    },
  },
  {
    slug: "hhs-ai-recommendation-split-status",
    documentNumber: 401,
    coverageId: "coverage-56f-hhs",
    entityId: "agency-hhs",
    entityName: "Department of Health and Human Services",
    sourceId: sourceProfiles[0].id,
    publicationDate: "2023-12-12",
    recordIdentity: "GAO-24-105980 recommendations 14 and 15",
    statusPeriod: "Recommendation 14 action in September 2025; recommendation 15 review in March 2026",
    finding:
      "GAO lists recommendation 14 Closed-Implemented after HHS published its M-25-21 compliance plan, while recommendation 15 remains Open because the 2025 AI inventory included future dates where deployment or pilot-start information was required.",
    decision:
      "Publish the split status and keep plan implementation separate from inventory completeness and from the HHS hospital-control audits.",
    remainingGap:
      "A corrected 2025 inventory accepted by GAO, recommendation 15 closure, system-level controls, and measured clinical or program outcomes.",
    reopeningRule:
      "Reopen when GAO changes recommendation 15 status or HHS publishes a corrected inventory that GAO accepts as implementation evidence.",
    limitation:
      "One closed plan recommendation and one open inventory recommendation do not establish HHS-wide AI safety, effectiveness, clinical quality, cybersecurity, or provider performance.",
    recordStatus: "Published",
    signal: {
      id: "signal-56n-hhs-ai-recommendations-split",
      slug: "56n-hhs-ai-recommendations-split",
      title: "HHS closes its AI compliance-plan action while inventory quality remains open",
      summary:
        "GAO marks HHS recommendation 14 Closed-Implemented after its M-25-21 plan, but recommendation 15 remains Open on incomplete 2025 AI inventory information.",
      body:
        "HHS's September 2025 M-25-21 compliance plan satisfied GAO recommendation 14. GAO recommendation 15 remains Open because its March 2026 review found future dates entered where deployment or pilot-start details were required. The two statuses describe different governance controls and do not resolve provider-level or clinical outcomes.",
    },
  },
  {
    slug: "dhs-ai-recommendation-split-status",
    documentNumber: 402,
    coverageId: "coverage-56f-dhs",
    entityId: "agency-dhs",
    entityName: "Department of Homeland Security",
    sourceId: sourceProfiles[0].id,
    publicationDate: "2023-12-12",
    recordIdentity: "GAO-24-105980 recommendations 16, 17, and 18",
    statusPeriod: "Compliance-plan and inventory evidence through February 2026",
    finding:
      "GAO lists recommendations 16 and 18 Closed-Implemented after DHS published its M-25-21 compliance plan and supplied a complete 2025 AI inventory. Recommendation 17 remains Open because GAO had not received documentation of the separate authorities review and M-21-06 plan.",
    decision:
      "Publish the exact two-closed, one-open split while preserving the separate legal-authority, compliance-plan, and inventory-control identities.",
    remainingGap:
      "Accepted evidence for recommendation 17, a final FY 2025 enterprise FISMA result, and system-level operating, incident, and mission outcomes.",
    reopeningRule:
      "Reopen when GAO changes recommendation 17 status or DHS provides the authorities-review and M-21-06 plan evidence GAO identifies as missing.",
    limitation:
      "Recommendation closure for plan and inventory controls does not establish AI system performance, cybersecurity effectiveness, service delivery, or enterprise FISMA closure.",
    recordStatus: "Published",
    signal: {
      id: "signal-56n-dhs-ai-recommendations-two-closed-one-open",
      slug: "56n-dhs-ai-recommendations-two-closed-one-open",
      title: "DHS closes two AI governance actions while one authorities-plan action remains open",
      summary:
        "GAO marks DHS recommendations 16 and 18 Closed-Implemented, while recommendation 17 remains Open for missing authorities-review and M-21-06 plan evidence.",
      body:
        "DHS's M-25-21 compliance plan and complete 2025 public AI inventory closed GAO recommendations 16 and 18. The separate recommendation 17 remains Open because GAO had not received documentation of DHS's AI-authorities review and M-21-06 consistency plan as of February 2026.",
    },
  },
  {
    slug: "dot-ai-recommendation-split-status",
    documentNumber: 403,
    coverageId: "coverage-56f-dot",
    entityId: "agency-dot",
    entityName: "Department of Transportation",
    sourceId: sourceProfiles[0].id,
    publicationDate: "2023-12-12",
    recordIdentity: "GAO-24-105980 recommendations 24 and 25",
    statusPeriod: "Recommendation 24 evidence assessed in May 2024; recommendation 25 status through August 2025",
    finding:
      "GAO lists recommendation 24 Closed-Implemented after DOT supplied its authorities review and M-21-06 plan. Recommendation 25 remains Open because DOT had not provided a later update on AI inventory completeness.",
    decision:
      "Publish the split governance status without treating the older open-status date as a current operating result or the FY 2026 DOT audit result.",
    remainingGap:
      "A current inventory update accepted by GAO, recommendation 25 closure, the FY 2026 DOT review result, and system-level outcomes.",
    reopeningRule:
      "Reopen when GAO changes recommendation 25 status, DOT supplies accepted inventory evidence, or DOT OIG publishes the FY 2026 review result.",
    limitation:
      "A closed authorities-plan recommendation and an open inventory action do not measure DOT AI performance, transportation safety, service quality, or department-wide cybersecurity.",
    recordStatus: "Published",
    signal: {
      id: "signal-56n-dot-ai-recommendations-split",
      slug: "56n-dot-ai-recommendations-split",
      title: "DOT closes its AI authorities-plan action while inventory completeness remains open",
      summary:
        "GAO marks DOT recommendation 24 Closed-Implemented, while recommendation 25 remains Open pending accepted evidence on AI inventory completeness.",
      body:
        "DOT's authorities review and M-21-06 plan closed GAO recommendation 24. Recommendation 25 remains Open because the agency had not provided GAO a later update on its efforts to ensure that the AI use-case inventory contains required information and aligns with instructions.",
    },
  },
  {
    slug: "va-ai-inventory-recommendation-closed",
    documentNumber: 404,
    coverageId: "coverage-56f-va",
    entityId: "agency-va",
    entityName: "Department of Veterans Affairs",
    sourceId: sourceProfiles[0].id,
    publicationDate: "2023-12-12",
    recordIdentity: "GAO-24-105980 recommendation 28",
    statusPeriod: "GAO assessment of VA's 2025 AI inventory in March 2026",
    finding:
      "GAO lists recommendation 28 Closed-Implemented after determining that VA's 2025 AI use-case inventory included the required information and aligned with instructions.",
    decision:
      "Publish the exact recommendation closure as a bounded inventory-governance result; do not substitute it for the open iFAMS access-control rail.",
    remainingGap:
      "The separate iFAMS recommendation closures, the FY 2025 FISMA result, named-system controls, and measured clinical or mission outcomes.",
    reopeningRule:
      "Reopen when VA OIG closes a named iFAMS recommendation, publishes the FY 2025 FISMA result, or GAO revises the recommendation 28 status.",
    limitation:
      "Inventory completeness does not establish model performance, clinical safety, mission benefit, cybersecurity effectiveness, or closure of unrelated VA recommendations.",
    recordStatus: "Published",
    signal: {
      id: "signal-56n-va-ai-inventory-recommendation-closed",
      slug: "56n-va-ai-inventory-recommendation-closed",
      title: "VA closes GAO's AI inventory-completeness recommendation",
      summary:
        "GAO marks recommendation 28 Closed-Implemented after its March 2026 assessment found VA's 2025 AI inventory contained the required information.",
      body:
        "GAO assessed VA's 2025 public AI use-case inventory in March 2026 and determined that it included the required information and aligned with instructions. Recommendation 28 is Closed-Implemented, but that result does not close the separate iFAMS access-control recommendations or establish system outcomes.",
    },
  },
  {
    slug: "hhs-large-hospital-post-date-recheck",
    documentNumber: 405,
    coverageId: "coverage-56f-hhs",
    entityId: "provider-hhs-oig-large-southeastern-hospital-a-18-22-08021",
    entityName: "Anonymous large southeastern hospital",
    sourceId: sourceProfiles[1].id,
    publicationDate: "2026-07-22",
    recordIdentity: "A-18-22-08021 actions 26-A-18-035.01 through .04 post-July 29 recheck",
    statusPeriod: "Tracker last updated July 22, 2026; checked August 1, 2026",
    finding:
      "The tracker still lists all four actions Open Unimplemented, Response Not Yet Due, no Last Update Received, and Next Update Expected July 29, 2026. The tracker itself had not been refreshed beyond July 22.",
    decision:
      "Hold In Review. The dated check documents that no post-July 29 public tracker outcome is yet available, but it does not add a new remediation result beyond Phase 56M.",
    remainingGap:
      "A tracker refresh after July 29, a received response, a status change, dated validation, or a compatible follow-up control test.",
    reopeningRule:
      "Reopen when the tracker displays a post-July 29 update, response, implementation state, or closure for actions 26-A-18-035.01 through .04.",
    limitation:
      "A passed expected-update date and stale public tracker do not prove that the entity or CMS missed a formal deadline or that no remediation work occurred outside the public page.",
    recordStatus: "In Review",
    signal: null,
  },
  {
    slug: "dhs-priority-recommendation-portfolio-2026",
    documentNumber: 406,
    coverageId: "coverage-56f-dhs",
    entityId: "agency-dhs",
    entityName: "Department of Homeland Security",
    sourceId: sourceProfiles[2].id,
    publicationDate: "2026-07-20",
    recordIdentity: "GAO-26-109077 DHS priority recommendation portfolio",
    statusPeriod: "May 2025 baseline through July 2026",
    finding:
      "GAO reports that DHS implemented five prior priority recommendations, two were closed as no longer valid, seven new priority recommendations were added, and the current portfolio remains 39.",
    decision:
      "Publish the exact portfolio movement as a remediation-throughput record while keeping implemented, no-longer-valid, newly added, and currently open states distinct.",
    remainingGap:
      "Action-level identities for every portfolio movement, implementation evidence for the current 39, the FY 2025 enterprise FISMA result, and measured service outcomes.",
    reopeningRule:
      "Reopen when GAO publishes the next DHS priority-recommendation letter or action-level status changes for the current portfolio.",
    limitation:
      "Portfolio counts span disaster response, cybersecurity, immigration, and border-security subjects. They do not form a performance rate, severity measure, or enterprise cybersecurity outcome.",
    recordStatus: "Published",
    signal: {
      id: "signal-56n-dhs-priority-recommendation-portfolio",
      slug: "56n-dhs-priority-recommendation-portfolio",
      title: "DHS priority portfolio records five implementations and seven new actions",
      summary:
        "GAO's July 2026 letter records five implemented DHS priority recommendations, two closed as no longer valid, seven newly added actions, and 39 current priorities.",
      body:
        "GAO's current DHS priority-recommendation letter separates four portfolio movements: five recommendations implemented since the May 2025 baseline, two closed because they were no longer valid, seven newly identified priorities, and a current total of 39. The report highlights disaster response, information technology and cybersecurity, and immigration and border-security data as focus areas.",
    },
  },
  {
    slug: "doe-insider-threat-recommendation-status",
    documentNumber: 407,
    coverageId: "coverage-56f-doe",
    entityId: "agency-doe",
    entityName: "Department of Energy",
    sourceId: sourceProfiles[3].id,
    publicationDate: "2023-03-02",
    recordIdentity: "GAO-23-105576 recommendations 1-7",
    statusPeriod: "Recommendation updates through May 2026",
    finding:
      "GAO lists recommendations 2 through 6 Closed-Implemented. Recommendations 1 and 7 remain Open-Partially Addressed while GAO monitors DOE's planned quarterly tracking mechanism and evidence of resource recommendations or allocations.",
    decision:
      "Publish the exact five-closed, two-partial remediation state while preserving the insider-threat-program scope.",
    remainingGap:
      "A completed tracking mechanism accepted by GAO, documented resource assessment and allocation actions, closure of recommendations 1 and 7, and operating incident outcomes.",
    reopeningRule:
      "Reopen when GAO changes recommendation 1 or 7 status or DOE provides accepted tracking and resource-allocation evidence.",
    limitation:
      "Insider-threat program governance and recommendation closure do not establish incident prevention, site-level effectiveness, mission performance, or DOE-wide FISMA effectiveness.",
    recordStatus: "Published",
    signal: {
      id: "signal-56n-doe-insider-threat-five-closed-two-partial",
      slug: "56n-doe-insider-threat-five-closed-two-partial",
      title: "DOE insider-threat program closes five recommendations with two still partial",
      summary:
        "GAO lists five of seven DOE insider-threat recommendations Closed-Implemented; tracking and resource-allocation actions remain Open-Partially Addressed.",
      body:
        "DOE's resumed annual reporting and revised Insider Threat Program order supported closure of recommendations 2 through 6. Recommendation 1 remains Open-Partially Addressed pending the additional quarterly tracking mechanism, while recommendation 7 remains Open-Partially Addressed pending evidence of program resource recommendations and allocations.",
    },
  },
  {
    slug: "va-southern-oregon-followup-status",
    documentNumber: 408,
    coverageId: "coverage-56f-va",
    entityId: "agency-va",
    entityName: "Department of Veterans Affairs",
    sourceId: sourceProfiles[4].id,
    publicationDate: "2026-06-25",
    recordIdentity: "VA OIG 25-02402-83 recommendations 1-8",
    statusPeriod: "Follow-up inspection issued June 25, 2026",
    finding:
      "The live VA OIG page shows recommendations 3, 4, and 8 Closed-Implemented on June 25, 2026 and recommendations 1, 2, 5, 6, and 7 Open. The follow-up found deficiencies across configuration management, security management, and access controls.",
    decision:
      "Publish the three-closed, five-open component result while keeping it separate from VA-wide FISMA and iFAMS remediation.",
    remainingGap:
      "Closure evidence for the five open Southern Oregon actions, the separate iFAMS recommendations, the FY 2025 FISMA result, and measured service or incident outcomes.",
    reopeningRule:
      "Reopen when VA OIG changes one of recommendations 1, 2, 5, 6, or 7 or publishes another compatible Southern Oregon follow-up.",
    limitation:
      "One healthcare-system inspection cannot be generalized to VA enterprise controls, other facilities, clinical outcomes, or closure of separate iFAMS recommendations.",
    recordStatus: "Published",
    signal: {
      id: "signal-56n-va-southern-oregon-three-closed-five-open",
      slug: "56n-va-southern-oregon-three-closed-five-open",
      title: "VA Southern Oregon follow-up closes three actions while five remain open",
      summary:
        "VA OIG's live follow-up record shows three recommendations Closed-Implemented and five Open across selected configuration, security-management, and access controls.",
      body:
        "The Southern Oregon follow-up records three Closed-Implemented actions covering temporary-staff access removal, separation of physical-key duties, and witnessed destruction of temporary sensitive paper files. Five recommendations remain Open across vulnerability management, baseline configuration, network-equipment security, grounding, and backup-power maintenance.",
    },
  },
].map((record) => ({ ...common, ...record }));

const json = (value) => `${JSON.stringify(value, null, 2)}\n`;
const writeJson = (path, value) => writeFile(path, json(value), "utf8");
const yamlQuote = (value) => JSON.stringify(value);
const yamlList = (items, indent = "  ") =>
  items.map((item) => `${indent}- ${yamlQuote(item)}`).join("\n");

await Promise.all([
  mkdir(join(contentRoot, "sources"), { recursive: true }),
  mkdir(join(contentRoot, "research-documents"), { recursive: true }),
  mkdir(join(contentRoot, "research-collections"), { recursive: true }),
  mkdir(join(contentRoot, "signals"), { recursive: true }),
  mkdir(join(contentRoot, "briefings"), { recursive: true }),
  mkdir(join(contentRoot, "updates"), { recursive: true }),
  mkdir(join(publicRoot, "downloads", collectionSlug, "official-links"), { recursive: true }),
  mkdir(dataRoot, { recursive: true }),
]);

for (const source of sourceProfiles) {
  await writeJson(join(contentRoot, "sources", `${source.id}.json`), {
    id: source.id,
    name: source.name,
    url: source.url,
    source_type: "Government Agency",
    credibility_level: "Tier 1",
    primary_topics: source.topics,
    framework_layers: common.layers,
    country_or_region: "United States",
    update_frequency: "Event-driven",
    capture_priority: "High",
    known_limitations: `${source.limitation} Phase 56N preserves recommendation identity, evidence state, status period, limitation, and reopening rule.`,
    last_checked_date: capturedDate,
    watch_lanes: ["Security and Standards", "Cross-Cutting Official Rails"],
    live_access_type: "Release Page",
    review_cadence_days: 30,
    monitoring_status: "Active",
    coverage_role: ["Primary Data", "Source Freshness"],
    jurisdiction: "United States federal government",
    source_owner: source.publisher,
    notes: `Phase 56N verified remediation and component outcome source. Collection: ${collectionSlug}.`,
  });
}

for (const [index, record] of records.entries()) {
  const source = sourceProfiles.find((entry) => entry.id === record.sourceId);
  const documentId = `research-doc-56n-${record.slug}`;
  const fileName = `${String(index + 1).padStart(2, "0")}-${record.slug}.txt`;
  const localCapturePath = `/downloads/${collectionSlug}/official-links/${fileName}`;
  await writeJson(
    join(contentRoot, "research-documents", `${record.documentNumber}-56n-${record.slug}.json`),
    {
      id: documentId,
      collection_id: collectionId,
      title: `${record.entityName}: Phase 56N Verified Remediation Decision`,
      slug: `56n-${record.slug}`,
      record_status: record.recordStatus,
      publisher: source.publisher,
      publication_date: record.publicationDate,
      document_type: "Oversight Report",
      summary: `${record.finding} Phase 56N decision: ${record.decision}`,
      key_findings: [
        `Phase 56F coverage ID: ${record.coverageId}.`,
        `Exact record: ${record.recordIdentity}.`,
        `Status period: ${record.statusPeriod}.`,
        "Evidence state: Partially Closed to Partially Closed.",
        `Continuation rule: ${record.reopeningRule}`,
      ],
      why_it_matters:
        "The record adds exact implementation, non-closure, component, or portfolio evidence while keeping recommendation states and operational outcomes distinct.",
      ftfn_relevance: [
        `Preserves stable entity ID ${record.entityId}.`,
        "Separates recommendation implementation from performance, service, mission, safety, and readiness outcomes.",
        "Keeps source owner, record identity, status period, limitation, and continuation rule attached.",
      ],
      evidence_limits: [
        record.limitation,
        record.remainingGap,
        "No entity ranking, composite, productivity, readiness, value, or causal claim is supported.",
      ],
      primary_topics: source.topics,
      framework_layers: record.layers,
      constraint_tags: record.constraints,
      source_id: record.sourceId,
      official_url: source.url,
      local_capture_path: localCapturePath,
      archive_member: `official-links/${fileName}`,
      capture_status: "Official link record",
      captured_date: capturedDate,
    },
  );

  await writeFile(
    join(publicRoot, "downloads", collectionSlug, "official-links", fileName),
    [
      "FTFN Phase 56N official link record",
      `Title: ${source.name}`,
      `Publisher: ${source.publisher}`,
      `Publication date: ${record.publicationDate}`,
      `Official URL: ${source.url}`,
      `Checked: ${capturedDate}`,
      `Coverage ID: ${record.coverageId}`,
      `Entity ID: ${record.entityId}`,
      `Exact record: ${record.recordIdentity}`,
      `Status period: ${record.statusPeriod}`,
      `Publication decision: ${record.recordStatus}`,
      `Decision: ${record.decision}`,
      `Limitation: ${record.limitation}`,
      "",
    ].join("\r\n"),
    "utf8",
  );

  if (record.signal) {
    await writeFile(
      join(contentRoot, "signals", `${record.signal.id}.mdx`),
      `---
id: ${yamlQuote(record.signal.id)}
title: ${yamlQuote(record.signal.title)}
slug: ${yamlQuote(record.signal.slug)}
record_status: "Published"
summary: ${yamlQuote(record.signal.summary)}
source_ids:
  - ${yamlQuote(record.sourceId)}
published_date: ${capturedDate}
captured_date: ${capturedDate}
primary_topic: "Policy and Standards"
framework_layers:
${yamlList(record.layers)}
signal_type: "Research Result"
maturity_level: "Infrastructure"
time_horizon: "Now"
evidence_quality: "Audited or Verified Data"
verification_status: "Verified Against Primary Source"
why_it_matters: "The record makes a named implementation or non-closure state inspectable without converting it into a performance claim."
dependencies:
  - "stable recommendation or report identity"
  - "declared status period"
  - "explicit agency or component scope"
constraints:
${yamlList(record.constraints)}
receiving_systems:
  - "Phase 56N verified remediation and component outcomes"
local_implications:
  - "The record cannot be converted into an agency, provider, productivity, readiness, or value score."
evidence_gap_ids:
  - "gap-003"
  - "gap-008"
  - "gap-016"
claim_scope: "Specific Source Update"
local_evidence_level: "General Source Layer"
last_reviewed_date: ${capturedDate}
---

## What changed

${record.signal.body}

## Boundary

${record.limitation}

No entity ranking, composite, productivity, readiness, value, or causal claim is supported.
`,
      "utf8",
    );
  }
}

const agencyIds = ["agency-nasa", "agency-doe", "agency-hhs", "agency-dhs", "agency-dot", "agency-va"];
const coverageDecisions = agencyIds.map((entityId) => {
  const entityRecords = records.filter(
    (record) => record.entityId === entityId || record.coverageId === records.find((item) => item.entityId === entityId)?.coverageId,
  );
  const primary = records.find((record) => record.entityId === entityId);
  return {
    coverage_id: primary.coverageId,
    entity_id: entityId,
    entity_name: primary.entityName,
    prior_closure_status: "Partially Closed",
    current_closure_status: "Partially Closed",
    result: entityRecords.map((record) => `${record.recordIdentity}: ${record.finding}`).join(" "),
    decision:
      "Retain Partially Closed. The new recommendation or component record improves remediation visibility but does not close the selected Phase 56F evidence question.",
    reopening_rule: entityRecords.map((record) => record.reopeningRule).join(" "),
  };
});

await writeJson(join(dataRoot, "phase-56n-verified-remediation-outcomes.json"), {
  phase: "56N",
  captured_date: capturedDate,
  batch_rule:
    "Publish only exact official implementation, non-closure, component, or portfolio records with stable entity, recommendation or report identity, status period, limitation, and continuation rule.",
  prior_closure_counts: { closed: 1, partially_closed: 21, open: 2 },
  post_batch_closure_counts: { closed: 1, partially_closed: 21, open: 2 },
  closure_changes: [],
  coverage_decisions: coverageDecisions,
  records: records.map((record) => ({
    record_id: `record-56n-${record.slug}`,
    coverage_id: record.coverageId,
    entity_id: record.entityId,
    entity_name: record.entityName,
    source_id: record.sourceId,
    source_url: sourceProfiles.find((entry) => entry.id === record.sourceId).url,
    exact_record: record.recordIdentity,
    status_period: record.statusPeriod,
    finding: record.finding,
    decision: record.decision,
    remaining_gap: record.remainingGap,
    reopening_rule: record.reopeningRule,
    record_status: record.recordStatus,
  })),
});

const promotedRecords = records.filter((record) => record.recordStatus === "Published");
const heldRecords = records.filter((record) => record.recordStatus === "In Review");
await writeJson(join(dataRoot, "phase-56n-publication-review.json"), {
  phase: "56N",
  reviewed_date: capturedDate,
  exact_records_checked: records.length,
  coverage_decisions: coverageDecisions.length,
  new_source_profiles: sourceProfiles.length,
  records_reusing_batch_sources: records.length - sourceProfiles.length,
  document_decisions: {
    reviewed: records.length,
    promoted: promotedRecords.map((record) => `research-doc-56n-${record.slug}`),
    held: heldRecords.map((record) => `research-doc-56n-${record.slug}`),
  },
  signal_decisions: {
    reviewed: promotedRecords.length,
    promoted: promotedRecords.map((record) => record.signal.id),
    held: [],
  },
  closure_decision:
    "No Phase 56F evidence-state changes. Nine bounded remediation or component records publish; the HHS post-date check remains In Review because no post-July 29 tracker outcome is public.",
  substitution_rule:
    "Recommendation closure is not system performance; a component result is not enterprise closure; an expected update date is not a formal deadline or evidence of unposted work.",
  comparison_rule:
    "Agency, component, portfolio, recommendation, plan, inventory, audit, and status periods remain distinct and do not support rankings or comparative performance claims.",
});

await writeJson(join(contentRoot, "research-collections", `${collectionSlug}.json`), {
  id: collectionId,
  title: "Verified Remediation and Component Outcomes - Batch Two, 2026",
  slug: collectionSlug,
  record_status: "Published",
  summary:
    "Phase 56N publishes nine exact federal remediation or component outcomes and holds one HHS post-date check, while preserving the 1 Closed / 21 Partially Closed / 2 Open evidence ledger.",
  scope:
    "GAO AI recommendation states across six agencies, DHS priority recommendations, DOE insider-threat remediation, a VA component follow-up, and the dated HHS tracker recheck.",
  captured_date: capturedDate,
  document_ids: records.map((record) => `research-doc-56n-${record.slug}`),
  download_path: `/downloads/${collectionSlug}.zip`,
  download_note:
    "The thirteen-file archive contains ten official-link records, consolidated summaries, a README, and a machine-readable manifest with checksums.",
  method_note:
    "Each decision retains stable coverage and entity identity, exact recommendation or report identity, status period, finding, evidence state, limitation, and reopening rule. Closed, open, partially addressed, no-longer-valid, and held states remain distinct.",
});

const publishedSignalIds = promotedRecords.map((record) => record.signal.id);
await writeFile(
  join(contentRoot, "briefings", `${briefingId}.mdx`),
  `---
id: ${yamlQuote(briefingId)}
title: "Research Watch 018: Verified Remediation and Component Outcomes"
slug: "research-watch-018-verified-remediation-outcomes"
record_status: "Published"
summary: "Phase 56N publishes nine exact implementation, non-closure, portfolio, and component records while holding one stale-date tracker check."
published_date: ${capturedDate}
captured_date: ${capturedDate}
signal_ids:
${yamlList(publishedSignalIds)}
evidence_gap_ids:
  - "gap-003"
  - "gap-008"
  - "gap-016"
claim_scope: "Editorial Synthesis"
local_evidence_level: "General Source Layer"
last_reviewed_date: ${capturedDate}
top_takeaways:
  - "GAO AI governance actions now resolve exact closed and open recommendation states across NASA, DOE, HHS, DHS, DOT, and VA."
  - "DHS implemented five priority recommendations, closed two as no longer valid, added seven, and retains 39 current priorities."
  - "DOE's insider-threat program has five Closed-Implemented and two Open-Partially Addressed recommendations."
  - "VA Southern Oregon has three Closed-Implemented and five Open component actions."
  - "The HHS July 29 expected-update check remains held because the public tracker was last updated July 22."
constraint_watch:
  - "Cybersecurity"
  - "Data Quality"
  - "Standards"
what_to_watch_next:
  - "A post-July 29 HHS tracker refresh for actions 26-A-18-035.01 through .04."
  - "GAO status changes for the open NASA, DOE, HHS, DHS, and DOT AI recommendations."
  - "Closure of DOE insider-threat recommendations 1 or 7 and VA Southern Oregon recommendations 1, 2, 5, 6, or 7."
  - "Any Phase 56K-56M record that meets its exact reopening rule."
---

## Batch-two result

Phase 56N resolves exact recommendation states across six agency AI-governance rails: VA has one Closed-Implemented inventory action; HHS, DHS, and DOT each have both closed and open actions; NASA has two open actions; and DOE has one open inventory action. These states describe specific governance controls, not AI system performance or agency quality.

The batch also adds a July 2026 DHS priority portfolio, DOE's seven-action insider-threat remediation state, and an eight-action VA Southern Oregon follow-up. The scheduled HHS large-hospital recheck remains held because the August 1 public page still showed a July 22 tracker update, no received response, and July 29 as the expected date.

## Current closure ledger

- Closed: 1
- Partially Closed: 21
- Open: 2

These are selected evidence states. Recommendation closure, portfolio throughput, and component remediation do not create performance, productivity, readiness, safety, quality, value, or causal measures.

## Scope controls

Plan compliance, inventory completeness, legal-authority review, priority recommendation movement, insider-threat governance, and one healthcare-system follow-up remain separate evidence types. An expected update date is not treated as a formal deadline, and a stale public tracker is not evidence that no unposted work occurred.
`,
  "utf8",
);

await writeJson(
  join(contentRoot, "updates", "2026-08-01-phase-56n-verified-remediation-outcomes.json"),
  {
    id: "update-2026-08-01-phase-56n-verified-remediation-outcomes",
    effective_date: capturedDate,
    entry_type: "Research Collection",
    title: "Phase 56N publishes verified remediation and component outcomes",
    summary:
      "FTFN publishes nine exact federal implementation, non-closure, portfolio, and component records while holding the HHS post-date tracker check.",
    affected_record_ids: [collectionId, briefingId, ...publishedSignalIds],
    related_paths: [
      `/research/${collectionSlug}/`,
      "/briefings/research-watch-018-verified-remediation-outcomes/",
      ...promotedRecords.map((record) => `/signals/${record.signal.slug}/`),
    ],
    evidence_note:
      "Closed, Open, Open-Partially Addressed, no-longer-valid, component, portfolio, and held states remain distinct from system performance and agency-wide outcomes.",
    work_package: "docs/work-packages/phase-56n-verified-remediation-component-outcomes.md",
  },
);

console.log(
  "Generated Phase 56N: five source profiles, ten research documents, nine Published signals, one collection, Research Watch 018, two ledgers, and one update.",
);
