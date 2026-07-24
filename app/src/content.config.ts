import { defineCollection, z } from "astro:content";
import { glob } from "astro/loaders";

const frameworkLayer = z.enum([
  "Planetary Conditions",
  "Resource Foundations",
  "Enabling Infrastructure",
  "Frontier Domains",
  "Human Systems"
]);

const topicPillar = z.enum([
  "Mobility",
  "Aviation",
  "Space",
  "Energy",
  "Climate",
  "Critical Minerals",
  "Chips and Compute",
  "AI for Science",
  "Quantum",
  "Advanced Manufacturing",
  "Agriculture and Bioeconomy",
  "Discovery Technologies",
  "Water",
  "Cybersecurity",
  "Policy and Standards",
  "Finance and Risk",
  "Human Futures"
]);

const constraintTag = z.enum([
  "Power",
  "Materials",
  "Water",
  "Compute",
  "Manufacturing",
  "Regulation",
  "Certification",
  "Capital",
  "Insurance",
  "Cybersecurity",
  "Labor",
  "Public Trust",
  "Climate",
  "Geopolitics",
  "Unit Economics",
  "Supply Chain",
  "Standards",
  "Land Use",
  "Permitting",
  "Data Quality",
  "Safety",
  "Weather",
  "Interpretation",
  "Infrastructure"
]);

const signalType = z.enum([
  "Breakthrough",
  "Deployment",
  "Regulation",
  "Funding",
  "Partnership",
  "Failure",
  "Accident",
  "Cost Shift",
  "Supply Chain Shift",
  "Climate Signal",
  "Market Signal",
  "Research Result",
  "Policy Signal",
  "Security Signal",
  "Forecast"
]);

const maturityLevel = z.enum([
  "Theory",
  "Lab Result",
  "Prototype",
  "Field Trial",
  "Pilot Program",
  "Early Commercial",
  "Scaling",
  "Infrastructure",
  "Commodity",
  "Decline or Failure"
]);

const timeHorizon = z.enum([
  "Now",
  "2-5 Years",
  "5-15 Years",
  "15+ Years",
  "Speculative"
]);

const evidenceQuality = z.enum([
  "Official Data",
  "Primary Source",
  "Peer-Reviewed Research",
  "Regulatory Filing",
  "Audited or Verified Data",
  "Credible Reporting",
  "Credible Analysis",
  "Company Claim",
  "Expert Commentary",
  "Unverified Claim",
  "Speculative Claim"
]);

const verificationStatus = z.enum([
  "Unreviewed",
  "Reviewed",
  "Needs Follow-Up",
  "Verified Against Primary Source",
  "Disputed",
  "Withdrawn or Corrected"
]);

const recordStatus = z.enum([
  "Draft Sample",
  "Draft",
  "In Review",
  "Published",
  "Needs Update",
  "Archived"
]);

const claimScope = z.enum([
  "General Context",
  "Specific Source Update",
  "System-Level Pattern",
  "Local Constraint Map",
  "Project-Level Claim",
  "Speculative Scenario",
  "Editorial Synthesis"
]);

const localEvidenceLevel = z.enum([
  "None",
  "General Source Layer",
  "Local Source Layer",
  "Specific Local Record",
  "Project-Level Evidence"
]);

const evidenceGapStatus = z.enum([
  "Open",
  "Source Identified",
  "Source Added",
  "Signal Needed",
  "Local Profile Update Needed",
  "Schema Candidate",
  "Resolved",
  "Deferred"
]);

const evidenceGapPriority = z.enum(["High", "Medium", "Low"]);

const dependencyMapType = z.enum([
  "Dependency Stack",
  "Local Constraint Map",
  "Technology Readiness Map",
  "Evidence Gap Map"
]);

const dependencyMapNodeType = z.enum([
  "Signal",
  "Source",
  "Technology",
  "Local System",
  "Evidence Gap",
  "Topic",
  "Constraint"
]);

const dependencyMapLinkType = z.enum([
  "Depends On",
  "Constrained By",
  "Evidenced By",
  "Limited By",
  "Received By",
  "Related Signal",
  "Related Technology",
  "Related Source"
]);

const dependencyMapConfidence = z.enum([
  "Supported",
  "Partial",
  "Missing Evidence",
  "Watch"
]);

const sourceType = z.enum([
  "Government Agency",
  "Company Press Room",
  "Research Lab",
  "University",
  "Standards Body",
  "International Organization",
  "Dataset",
  "Peer-Reviewed Journal",
  "Trade Publication",
  "Credible Reporting",
  "Market Data Provider",
  "NGO or Think Tank",
  "Investor Material"
]);

const sourceWatchLane = z.enum([
  "Cross-Cutting Official Rails",
  "Power and Grid",
  "Compute and Chips",
  "Water",
  "Mobility Certification",
  "Security and Standards",
  "Critical Minerals",
  "Climate",
  "Agriculture and Bioeconomy",
  "AI and Advanced Manufacturing",
  "Space",
  "Discovery Technologies",
  "Finance and Human Futures",
  "Local Systems"
]);

const sourceLiveAccessType = z.enum([
  "API",
  "RSS Feed",
  "Data Download",
  "Docket Search",
  "Filing System",
  "Release Page",
  "Report Series",
  "Interactive Portal",
  "Manual Page Check"
]);

const sourceMonitoringStatus = z.enum([
  "Active",
  "Candidate",
  "Manual Review",
  "Paused",
  "Blocked"
]);

const sourceCoverageRole = z.enum([
  "Primary Data",
  "Regulatory Change",
  "Docket Evidence",
  "Filing Evidence",
  "Source Freshness",
  "Local Conversion Evidence",
  "Standards Evidence",
  "Research Program Evidence",
  "Funding Evidence",
  "Company Claim"
]);

const credibilityLevel = z.enum([
  "Tier 1",
  "Tier 2",
  "Tier 3",
  "Tier 4",
  "Tier 5",
  "Do Not Use"
]);

const organizationType = z.enum([
  "Company",
  "Government Agency",
  "Research Lab",
  "University",
  "Standards Body",
  "International Organization",
  "Investor",
  "Nonprofit",
  "Trade Association",
  "Regulator"
]);

const localSystemType = z.enum([
  "Place",
  "Sector",
  "Institution",
  "Market",
  "Supply Chain",
  "Infrastructure System"
]);

const updateEntryType = z.enum([
  "Correction",
  "Source Refresh",
  "Signal Repair",
  "Publication Promotion",
  "Archive",
  "Research Collection"
]);

const researchDocumentType = z.enum([
  "Budget Justification",
  "Broad Agency Announcement",
  "Agency Strategy",
  "Agency Announcement",
  "Federal Award Record",
  "Contract Announcement",
  "Program Milestone",
  "Standards and Testbed Record",
  "Oversight Report",
  "Local Government Record",
  "Regulatory Decision",
  "Procurement Channel",
  "Policy Memorandum",
  "National Strategy",
  "Threat Assessment",
  "Action Plan",
  "Presidential Memorandum",
  "Executive Order",
  "Draft Study",
  "Congressional Primer"
]);

const researchCaptureStatus = z.enum([
  "Original file captured",
  "Official page captured",
  "Official link record"
]);

const requiredStrings = z.array(z.string()).min(1);
const requiredFrameworkLayers = z.array(frameworkLayer).min(1);
const requiredTopics = z.array(topicPillar).min(1);
const requiredConstraints = z.array(constraintTag).min(1);
const readerPathwayDependency = z.object({
  stage: z.string(),
  current_state: z.string(),
  boundary: z.string()
});

const signals = defineCollection({
  loader: glob({ pattern: "**/*.{md,mdx}", base: "./src/content/signals" }),
  schema: z.object({
    id: z.string(),
    title: z.string(),
    slug: z.string(),
    record_status: recordStatus,
    summary: z.string(),
    source_ids: requiredStrings,
    published_date: z.coerce.date().nullable(),
    captured_date: z.coerce.date(),
    primary_topic: topicPillar,
    framework_layers: requiredFrameworkLayers,
    signal_type: signalType,
    maturity_level: maturityLevel,
    time_horizon: timeHorizon,
    evidence_quality: evidenceQuality,
    verification_status: verificationStatus,
    why_it_matters: z.string(),
    dependencies: requiredStrings,
    constraints: requiredConstraints,
    receiving_systems: z.array(z.string()).default([]),
    local_implications: z.array(z.string()).default([]),
    evidence_gap_ids: z.array(z.string()).default([]),
    claim_scope: claimScope.default("General Context"),
    local_evidence_level: localEvidenceLevel.default("None"),
    last_reviewed_date: z.coerce.date().optional(),
    editorial_notes: z.string().optional()
  })
});

const sources = defineCollection({
  loader: glob({ pattern: "**/*.json", base: "./src/content/sources" }),
  schema: z.object({
    id: z.string(),
    name: z.string(),
    url: z.string().url(),
    source_type: sourceType,
    credibility_level: credibilityLevel,
    primary_topics: requiredTopics,
    framework_layers: requiredFrameworkLayers,
    country_or_region: z.string(),
    update_frequency: z.string(),
    capture_priority: z.enum(["High", "Medium", "Low"]),
    known_limitations: z.string(),
    last_checked_date: z.coerce.date(),
    watch_lanes: z.array(sourceWatchLane).default([]),
    live_access_type: sourceLiveAccessType.default("Manual Page Check"),
    api_url: z.string().url().optional(),
    feed_url: z.string().url().optional(),
    data_download_url: z.string().url().optional(),
    docket_search_url: z.string().url().optional(),
    release_calendar_url: z.string().url().optional(),
    review_cadence_days: z.number().int().positive().optional(),
    monitoring_status: sourceMonitoringStatus.default("Active"),
    coverage_role: z.array(sourceCoverageRole).default([]),
    jurisdiction: z.string().optional(),
    source_owner: z.string().optional(),
    automation_notes: z.string().optional(),
    notes: z.string().optional()
  })
});

const topics = defineCollection({
  loader: glob({ pattern: "**/*.json", base: "./src/content/topics" }),
  schema: z.object({
    id: z.string(),
    name: topicPillar,
    slug: z.string(),
    summary: z.string(),
    framework_layers: requiredFrameworkLayers,
    primary_constraints: requiredConstraints,
    featured_sources: z.array(z.string()).default([]),
    watch_questions: requiredStrings
  })
});

const organizations = defineCollection({
  loader: glob({ pattern: "**/*.json", base: "./src/content/organizations" }),
  schema: z.object({
    id: z.string(),
    name: z.string(),
    slug: z.string(),
    organization_type: organizationType,
    summary: z.string(),
    primary_topics: requiredTopics,
    framework_layers: requiredFrameworkLayers,
    source_ids: z.array(z.string()).default([])
  })
});

const technologies = defineCollection({
  loader: glob({ pattern: "**/*.json", base: "./src/content/technologies" }),
  schema: z.object({
    id: z.string(),
    name: z.string(),
    slug: z.string(),
    summary: z.string(),
    primary_topics: requiredTopics,
    framework_layers: requiredFrameworkLayers,
    maturity_level: maturityLevel,
    dependencies: requiredStrings,
    constraints: requiredConstraints,
    source_ids: z.array(z.string()).default([])
  })
});

const localSystems = defineCollection({
  loader: glob({ pattern: "**/*.{md,mdx}", base: "./src/content/local-systems" }),
  schema: z.object({
    id: z.string(),
    name: z.string(),
    slug: z.string(),
    system_type: localSystemType,
    summary: z.string(),
    geography: z.string(),
    key_industries: requiredStrings,
    core_constraints: requiredConstraints,
    current_equilibrium: z.string(),
    relevant_signal_types: z.array(signalType).min(1),
    actors_with_authority: requiredStrings,
    likely_second_order_effects: requiredStrings,
    missing_data: requiredStrings,
    evidence_gap_ids: z.array(z.string()).default([]),
    local_evidence_level: localEvidenceLevel.default("None"),
    last_reviewed_date: z.coerce.date().optional(),
    source_ids: z.array(z.string()).default([])
  })
});

const briefings = defineCollection({
  loader: glob({ pattern: "**/*.{md,mdx}", base: "./src/content/briefings" }),
  schema: z.object({
    id: z.string(),
    title: z.string(),
    slug: z.string(),
    record_status: recordStatus,
    summary: z.string(),
    published_date: z.coerce.date().nullable(),
    captured_date: z.coerce.date(),
    signal_ids: requiredStrings,
    evidence_gap_ids: z.array(z.string()).default([]),
    claim_scope: claimScope.default("Editorial Synthesis"),
    local_evidence_level: localEvidenceLevel.default("None"),
    last_reviewed_date: z.coerce.date().optional(),
    top_takeaways: requiredStrings,
    constraint_watch: requiredStrings,
    what_to_watch_next: requiredStrings
  })
});

const evidenceGaps = defineCollection({
  loader: glob({ pattern: "**/*.json", base: "./src/content/evidence-gaps" }),
  schema: z.object({
    id: z.string(),
    title: z.string(),
    slug: z.string(),
    status: evidenceGapStatus,
    priority: evidenceGapPriority,
    local_system: z.string(),
    primary_topic: topicPillar,
    framework_layers: requiredFrameworkLayers,
    constraint_tags: requiredConstraints,
    question: z.string(),
    why_it_matters: z.string(),
    current_support: z.string(),
    missing_evidence: requiredStrings,
    likely_source_types: requiredStrings,
    candidate_records: z.array(z.string()).default([]),
    next_action: z.string(),
    future_data_model_need: z.array(z.string()).default([]),
    related_source_ids: z.array(z.string()).default([]),
    related_signal_ids: z.array(z.string()).default([]),
    related_local_system_ids: z.array(z.string()).default([]),
    notes: z.string().optional()
  })
});

const dependencyMaps = defineCollection({
  loader: glob({ pattern: "**/*.json", base: "./src/content/dependency-maps" }),
  schema: z.object({
    id: z.string(),
    title: z.string(),
    slug: z.string(),
    summary: z.string(),
    map_type: dependencyMapType,
    record_status: recordStatus.default("Draft"),
    primary_topic: topicPillar,
    framework_layers: requiredFrameworkLayers,
    constraint_tags: requiredConstraints,
    map_question: z.string(),
    interpretation_boundary: z.string(),
    source_ids: z.array(z.string()).default([]),
    signal_ids: z.array(z.string()).default([]),
    technology_ids: z.array(z.string()).default([]),
    local_system_ids: z.array(z.string()).default([]),
    evidence_gap_ids: z.array(z.string()).default([]),
    nodes: z.array(z.object({
      id: z.string(),
      label: z.string(),
      node_type: dependencyMapNodeType,
      record_id: z.string().optional(),
      note: z.string()
    })).min(1),
    links: z.array(z.object({
      from: z.string(),
      to: z.string(),
      relationship: dependencyMapLinkType,
      confidence: dependencyMapConfidence,
      note: z.string()
    })).min(1),
    what_this_map_supports: requiredStrings,
    what_this_map_does_not_prove: requiredStrings,
    next_records_needed: requiredStrings
  })
});

const updates = defineCollection({
  loader: glob({ pattern: "**/*.json", base: "./src/content/updates" }),
  schema: z.object({
    id: z.string(),
    effective_date: z.coerce.date(),
    entry_type: updateEntryType,
    title: z.string(),
    summary: z.string(),
    affected_record_ids: requiredStrings,
    related_paths: z.array(z.string()).default([]),
    evidence_note: z.string(),
    work_package: z.string().optional()
  })
});

const researchCollections = defineCollection({
  loader: glob({ pattern: "**/*.json", base: "./src/content/research-collections" }),
  schema: z.object({
    id: z.string(),
    title: z.string(),
    slug: z.string(),
    record_status: recordStatus,
    summary: z.string(),
    scope: z.string(),
    captured_date: z.coerce.date(),
    document_ids: requiredStrings,
    download_path: z.string(),
    download_note: z.string(),
    method_note: z.string()
  })
});

const researchDocuments = defineCollection({
  loader: glob({ pattern: "**/*.json", base: "./src/content/research-documents" }),
  schema: z.object({
    id: z.string(),
    collection_id: z.string(),
    title: z.string(),
    slug: z.string(),
    record_status: recordStatus,
    publisher: z.string(),
    publication_date: z.coerce.date().nullable(),
    document_type: researchDocumentType,
    summary: z.string(),
    key_findings: requiredStrings,
    why_it_matters: z.string(),
    ftfn_relevance: requiredStrings,
    evidence_limits: requiredStrings,
    primary_topics: requiredTopics,
    framework_layers: requiredFrameworkLayers,
    constraint_tags: requiredConstraints,
    source_id: z.string(),
    official_url: z.string().url(),
    local_capture_path: z.string(),
    archive_member: z.string(),
    capture_status: researchCaptureStatus,
    captured_date: z.coerce.date()
  })
});

const readerPathways = defineCollection({
  loader: glob({ pattern: "**/*.json", base: "./src/content/reader-pathways" }),
  schema: z.object({
    id: z.string(),
    title: z.string(),
    slug: z.string(),
    record_status: recordStatus.default("Published"),
    summary: z.string(),
    current_state_summary: z.string(),
    current_state: requiredStrings,
    primary_topics: requiredTopics,
    topic_ids: z.array(z.string()).default([]),
    local_system_ids: z.array(z.string()).default([]),
    signal_ids: requiredStrings,
    source_ids: requiredStrings,
    organization_ids: z.array(z.string()).default([]),
    technology_ids: z.array(z.string()).default([]),
    briefing_ids: requiredStrings,
    dependency_map_ids: requiredStrings,
    research_collection_ids: requiredStrings,
    evidence_gap_ids: requiredStrings,
    dependency_stack: z.array(readerPathwayDependency).min(1),
    evidence_limits: requiredStrings,
    next_records: requiredStrings
  })
});

export const collections = {
  signals,
  sources,
  topics,
  organizations,
  technologies,
  localSystems,
  briefings,
  evidenceGaps,
  dependencyMaps,
  updates,
  researchCollections,
  researchDocuments,
  readerPathways
};
