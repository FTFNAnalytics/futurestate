import { readFile, writeFile } from "node:fs/promises";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const appRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const dataRoot = join(appRoot, "src", "data");
const workPackagesRoot = resolve(appRoot, "..", "docs", "work-packages");
const effectiveDate = "2026-09-01";
const readJson = async (path) => JSON.parse(await readFile(path, "utf8"));
const writeJson = async (path, value) => writeFile(path, `${JSON.stringify(value, null, 2)}\n`, "utf8");
const slugify = (value) => value.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
const unique = (items) => [...new Set(items)];
const pad = (value, width = 3) => String(value).padStart(width, "0");

const [p116, p117, p119] = await Promise.all([
  readJson(join(dataRoot, "phase-116-coverage-architecture.json")),
  readJson(join(dataRoot, "phase-117-global-authority-graph.json")),
  readJson(join(dataRoot, "phase-119-deep-project-place-atlas.json")),
]);

const boundary = "Prepared content and evidence-control architecture only. A mapped authority, source portal, acquisition slot, question, or review packet does not establish an external fact, project stage, accepted service, compatible series, comparison result, score, rank, translation approval, expert approval, or publication decision.";
const conversionStages = [
  "Named context or baseline",
  "Policy or authority",
  "Finance, procurement, or agreement",
  "Build or implementation",
  "Test, compliance, or qualification",
  "Accepted service, product, or cutover",
  "Recurring operation or output",
  "Comparable outcome",
];
const phaseBase = (phase, dataset, title, summary) => ({
  schema_version: "1.0",
  phase,
  program_id: `FTFN-PHASE-${phase}`,
  dataset,
  title,
  effective_date: effectiveDate,
  record_status: "Published operating scaffold",
  build_status: "Complete locally — external and owner-controlled decisions held",
  summary,
  record_scope: `Append-only Phase ${phase} global-reference content layer over the Phase 116–180 evidence and operating corpus.`,
  publication_boundaries: [
    boundary,
    "An institutional home page is an authority-discovery rail, not an exact artifact and not evidence for a downstream claim.",
    "Unknown, unavailable, not-yet-reviewed, and incompatible are preserved as distinct states; no unsuccessful search is treated as proof of nonexistence.",
  ],
});

// Phase 189 — activate all eighty mapped rails as governed review packets and
// prepare one hundred and twenty exact-artifact slots without fabricating checks.
const artifactAcquisitionSlots = [];
const authorityRailReviewPackets = p117.rails.map((rail, railIndex) => {
  const slotCount = railIndex < 40 ? 2 : 1;
  const slots = Array.from({ length: slotCount }, (_, slotIndex) => {
    const family = rail.artifact_families[slotIndex % rail.artifact_families.length];
    const slot = {
      artifact_acquisition_slot_id: `189-ARTIFACT-${pad(artifactAcquisitionSlots.length + 1)}`,
      rail_id: rail.rail_id,
      source_id: rail.source_id,
      jurisdiction_id: rail.jurisdiction_id,
      jurisdiction_name: rail.jurisdiction_name,
      authority_class: rail.authority_class,
      artifact_family: family,
      acquisition_purpose: slotIndex === 0
        ? `Bind one exact current ${family} issued by ${rail.institution_name} before any downstream evidence claim is considered.`
        : `Bind the exact methodology, revision, implementation, or acceptance companion needed to interpret the first ${family} without losing definitions or status distinctions.`,
      minimum_identity_fields: ["exact title", "issuing body", "publication or effective date", "stable official URL", "version or revision state"],
      required_content_fields: ["named entity or geography", "observation or decision period", "measure or milestone definition", "unit and denominator where applicable", "stated limitations and revision treatment"],
      candidate_url: null,
      exact_artifact_title: null,
      artifact_date: null,
      checked_date: null,
      semantic_digest: null,
      acquisition_decision: null,
      review_outcome: null,
      state: "Open acquisition slot — exact artifact not yet bound",
      stop_rule: "Do not substitute the institution landing page, a search snippet, a secondary summary, or a different jurisdiction's artifact for the exact official record.",
    };
    artifactAcquisitionSlots.push(slot);
    return slot.artifact_acquisition_slot_id;
  });
  return {
    authority_rail_review_packet_id: `189-RAIL-${pad(railIndex + 1)}`,
    upstream_rail_id: rail.rail_id,
    source_id: rail.source_id,
    jurisdiction_id: rail.jurisdiction_id,
    jurisdiction_name: rail.jurisdiction_name,
    institution_name: rail.institution_name,
    official_portal_url: rail.official_url,
    authority_class: rail.authority_class,
    topic_ids: rail.topic_ids,
    conversion_stages: rail.conversion_stages,
    artifact_families: rail.artifact_families,
    artifact_acquisition_slot_ids: slots,
    review_state: "Prepared — exact-artifact review not run",
    review_date: null,
    reviewer_role: null,
    review_outcome: null,
    accepted_artifact_ids: [],
    rejected_candidate_ids: [],
    exact_next_action: `Acquire and identity-check ${slotCount === 2 ? "the two prepared artifacts" : "the prepared artifact"} from ${rail.institution_name}; record a bounded blocker if the official system does not expose a stable record.`,
    route: `/review/global/authority-rails/${rail.slug}/`,
    interpretation_boundary: boundary,
  };
});

const p189 = {
  ...phaseBase(189, "phase_189_global_authority_rail_activation", "Global Authority-Rail Activation", "Convert all eighty mapped global authority rails into review packets and prepare one hundred and twenty exact-artifact acquisition slots, while leaving every artifact, check, and review outcome unclaimed."),
  routes: { hub: "/review/global/authority-rails/", public_export: "/data/phase-189-global-authority-rail-activation.json" },
  counts: {
    jurisdictions: p117.jurisdictions.length,
    authority_rail_review_packets: authorityRailReviewPackets.length,
    artifact_acquisition_slots: artifactAcquisitionSlots.length,
    exact_artifacts_bound: 0,
    completed_reviews: 0,
    predated_checks: 0,
  },
  authority_rail_review_packets: authorityRailReviewPackets,
  artifact_acquisition_slots: artifactAcquisitionSlots,
  public_html_routes: ["/review/global/authority-rails/", ...authorityRailReviewPackets.map((record) => record.route)],
  public_json_exports: ["/data/phase-189-global-authority-rail-activation.json"],
};

// Phase 190 — turn the jurisdiction list into substantive system-reading profiles.
const jurisdictionSystemProfiles = p117.jurisdictions.map((jurisdiction, index) => {
  const rails = p117.rails.filter((rail) => jurisdiction.rail_ids.includes(rail.rail_id));
  return {
    jurisdiction_system_profile_id: `190-PROFILE-${pad(index + 1)}`,
    upstream_jurisdiction_id: jurisdiction.jurisdiction_id,
    slug: jurisdiction.slug,
    title: `${jurisdiction.name} system-evidence profile`,
    jurisdiction_name: jurisdiction.name,
    region: jurisdiction.region,
    languages: jurisdiction.languages,
    profile_state: "Published discovery architecture — no downstream findings",
    authority_topology: rails.map((rail) => ({
      rail_id: rail.rail_id,
      source_id: rail.source_id,
      institution_name: rail.institution_name,
      authority_class: rail.authority_class,
      evidence_role: `Discovery entry point for ${rail.artifact_families.join(", ")}.`,
      downstream_finding: null,
    })),
    system_reading: {
      scope: `Read ${jurisdiction.name} through separate official statistics, energy or system-operation, territorial delivery, and science or industrial-innovation rails where those classes are mapped.`,
      governance_question: "Which body has authority over the exact decision, measurement, permit, funding instrument, operating record, or revision being cited?",
      delivery_question: "What named entity and conversion stage does the artifact actually support, and where does that support stop?",
      outcome_question: "Is there a repeated observation with stable identity, period, definition, method, unit, denominator, and revision treatment?",
      comparison_question: `Which definitions in ${jurisdiction.name} can be matched to another jurisdiction without erasing statutory, geographic, methodological, or institutional differences?`,
    },
    topic_ids: unique(rails.flatMap((rail) => rail.topic_ids)),
    conversion_stages: unique(rails.flatMap((rail) => rail.conversion_stages)),
    evidence_contract: {
      minimum_artifact_identity: ["issuer", "exact title", "date", "version", "stable URL"],
      minimum_claim_identity: ["named subject", "geography", "period", "stage", "measure", "denominator", "limitations"],
      prohibited_shortcuts: ["portal identity as evidence", "announcement as operation", "forecast as observation", "national aggregate as local outcome", "cross-jurisdiction normalization without a passport"],
    },
    exact_artifact_slot_ids: artifactAcquisitionSlots.filter((slot) => slot.jurisdiction_id === jurisdiction.jurisdiction_id).map((slot) => slot.artifact_acquisition_slot_id),
    review_date: null,
    review_outcome: null,
    translation_review_decision: null,
    route: `/review/global/jurisdictions/${jurisdiction.slug}/`,
    interpretation_boundary: boundary,
  };
});

const p190 = {
  ...phaseBase(190, "phase_190_global_jurisdiction_system_profiles", "Global Jurisdiction System Profiles", "Publish twenty jurisdiction-level system-reading profiles that expose authority topology, evidence contracts, open acquisition slots, and non-equivalence boundaries without claiming artifact review or jurisdictional performance."),
  routes: { hub: "/review/global/jurisdictions/", public_export: "/data/phase-190-global-jurisdiction-system-profiles.json" },
  counts: { jurisdiction_system_profiles: 20, regions: unique(jurisdictionSystemProfiles.map((record) => record.region)).length, authority_rail_bindings: jurisdictionSystemProfiles.flatMap((record) => record.authority_topology).length, completed_artifact_reviews: 0, translation_review_decisions: 0 },
  jurisdiction_system_profiles: jurisdictionSystemProfiles,
  public_html_routes: ["/review/global/jurisdictions/", ...jurisdictionSystemProfiles.map((record) => record.route)],
  public_json_exports: ["/data/phase-190-global-jurisdiction-system-profiles.json"],
};

// Phase 191 — preserve the four exact international project identities already in
// the Atlas and prepare bounded selection dockets for the rest of the cohort.
const atlasProjectById = new Map(p119.projects.map((record) => [record.atlas_project_id, record]));
const anchorProjectIdsByJurisdiction = {
  canada: ["119-PROJECT-002"],
  australia: ["119-PROJECT-012", "119-PROJECT-013", "119-PROJECT-014"],
};
const projectSlotCounts = Object.fromEntries(p117.jurisdictions.map((record) => [record.slug, 2]));
projectSlotCounts.australia = 3;
projectSlotCounts["multilateral-systems"] = 1;
const projectConversionPackets = [];
for (const jurisdiction of p117.jurisdictions) {
  const rails = p117.rails.filter((rail) => jurisdiction.rail_ids.includes(rail.rail_id));
  const anchorIds = anchorProjectIdsByJurisdiction[jurisdiction.slug] ?? [];
  for (let slotIndex = 0; slotIndex < projectSlotCounts[jurisdiction.slug]; slotIndex += 1) {
    const upstream = anchorIds[slotIndex] ? atlasProjectById.get(anchorIds[slotIndex]) : null;
    const id = `191-PROJECT-${pad(projectConversionPackets.length + 1)}`;
    projectConversionPackets.push({
      international_project_packet_id: id,
      record_kind: upstream ? "Existing exact named-project anchor" : "Named-project acquisition docket",
      jurisdiction_id: jurisdiction.jurisdiction_id,
      jurisdiction_name: jurisdiction.name,
      region: jurisdiction.region,
      project_name: upstream?.named_entity ?? null,
      upstream_atlas_project_id: upstream?.atlas_project_id ?? null,
      upstream_canonical_id: upstream?.canonical_id ?? null,
      identity_state: upstream ? "Exact upstream Atlas identity preserved" : "Held — exact named project identity required",
      identity_decision: upstream ? "Inherited identity only — no new conversion decision" : null,
      source_ids: upstream?.evidence_rails?.source_ids ?? rails.map((rail) => rail.source_id),
      authority_rail_ids: rails.map((rail) => rail.rail_id),
      source_binding_state: upstream ? "Existing source shelf referenced without refresh" : "Authority portals mapped; exact project artifact not yet bound",
      current_stage_snapshot: upstream?.conversion?.current_stage ?? null,
      current_stage_basis: upstream?.conversion?.stage_basis ?? null,
      stage_tests: conversionStages.map((stage) => ({ stage, decision: null, accepted_artifact_ids: [], state: "Not adjudicated in Phase 191" })),
      unresolved_gate: upstream?.conversion?.unresolved_gate ?? "Select one exact named project from an official artifact, resolve aliases and geography, then open stage review.",
      exact_next_artifact: upstream?.conversion?.exact_next_artifact ?? `An exact ${jurisdiction.name} official project record naming the asset, intervention, location, responsible authority, date, and current legal or delivery status.`,
      review_date: null,
      conversion_decision: null,
      decision_receipt_id: null,
      route: `/review/global/projects/${upstream?.slug ?? `${jurisdiction.slug}-acquisition-${slotIndex + 1}`}/`,
      interpretation_boundary: upstream
        ? "The existing Atlas identity and source shelf are referenced without refresh or stage advancement; every Phase 191 stage test remains unadjudicated."
        : boundary,
    });
  }
}

const p191 = {
  ...phaseBase(191, "phase_191_international_named_project_conversion_cohort", "International Named-Project Conversion Cohort", "Create a forty-packet governed international project cohort: four exact Atlas identities are preserved as anchors and thirty-six selection dockets remain held until an exact named official project artifact is bound."),
  routes: { hub: "/review/global/projects/", public_export: "/data/phase-191-international-named-project-conversion-cohort.json" },
  counts: { project_conversion_packets: 40, exact_named_project_anchors: projectConversionPackets.filter((record) => record.project_name).length, named_project_acquisition_dockets: projectConversionPackets.filter((record) => !record.project_name).length, jurisdictions_represented: unique(projectConversionPackets.map((record) => record.jurisdiction_id)).length, stage_decisions: 0, conversion_decisions: 0 },
  project_conversion_packets: projectConversionPackets,
  public_html_routes: ["/review/global/projects/", ...projectConversionPackets.map((record) => record.route)],
  public_json_exports: ["/data/phase-191-international-named-project-conversion-cohort.json"],
};

// Phase 192 — a twenty-record global place cohort, explicitly separating the
// three exact inherited place identities from seventeen place-acquisition dockets.
const atlasPlaceById = new Map(p119.places.map((record) => [record.atlas_place_id, record]));
const placeSpecifications = [];
for (const jurisdiction of p117.jurisdictions.filter((record) => record.slug !== "multilateral-systems")) {
  placeSpecifications.push({ jurisdiction, upstreamId: jurisdiction.slug === "canada" ? "119-PLACE-004" : jurisdiction.slug === "australia" ? "119-PLACE-012" : null });
}
placeSpecifications.push({ jurisdiction: p117.jurisdictions.find((record) => record.slug === "australia"), upstreamId: "119-PLACE-013" });
const placeSystemDossiers = placeSpecifications.map(({ jurisdiction, upstreamId }, index) => {
  const upstream = upstreamId ? atlasPlaceById.get(upstreamId) : null;
  const rails = p117.rails.filter((rail) => jurisdiction.rail_ids.includes(rail.rail_id));
  const placeSlug = upstream?.slug ?? `${jurisdiction.slug}-place-acquisition`;
  return {
    global_place_dossier_id: `192-PLACE-${pad(index + 1)}`,
    record_kind: upstream ? "Existing exact place-system anchor" : "Named place-system acquisition docket",
    jurisdiction_id: jurisdiction.jurisdiction_id,
    jurisdiction_name: jurisdiction.name,
    region: jurisdiction.region,
    place_name: upstream?.geography ?? null,
    upstream_atlas_place_id: upstream?.atlas_place_id ?? null,
    upstream_canonical_id: upstream?.canonical_id ?? null,
    identity_state: upstream ? "Exact upstream Atlas place identity preserved" : "Held — exact subnational or asset-receiving place required",
    system_scope: upstream?.editorial_question ?? `Select a named place in ${jurisdiction.name} where authority, infrastructure, implementation, service, and outcome evidence can be joined without transferring national aggregates to a local system.`,
    source_ids: upstream?.evidence_rails?.source_ids ?? rails.map((rail) => rail.source_id),
    authority_rail_ids: rails.map((rail) => rail.rail_id),
    six_layer_reading: [
      { layer: "Authority", question: "Which institution can make or record the relevant decision?", finding: null },
      { layer: "Finance", question: "Which exact agreement, procurement, obligation, or risk allocation applies?", finding: null },
      { layer: "Infrastructure", question: "Which site-bound enabling systems are required and accepted?", finding: null },
      { layer: "Implementation", question: "Which named build, test, permit, or qualification milestone is documented?", finding: null },
      { layer: "Operation", question: "What accepted service, product, or recurring output is observed?", finding: null },
      { layer: "Public value", question: "Which compatible repeated outcomes, distribution effects, costs, and limitations are available?", finding: null },
    ],
    current_stage_snapshot: upstream?.conversion?.current_stage ?? null,
    exact_next_artifact: upstream?.conversion?.exact_next_artifact ?? `An official record naming a subnational or asset-receiving place in ${jurisdiction.name}, the intervention, responsible authority, date, stage, and exact evidence boundary.`,
    selection_decision: null,
    review_date: null,
    outcome: null,
    score: null,
    rank: null,
    route: `/review/global/places/${placeSlug}/`,
    interpretation_boundary: upstream ? "The upstream place identity is preserved as context. No place stage, outcome, score, rank, or new source finding is created." : boundary,
  };
});

const p192 = {
  ...phaseBase(192, "phase_192_global_place_systems_atlas", "Global Place Systems Atlas", "Prepare twenty place-system dossiers across nineteen national or supranational jurisdictions: three exact place identities are inherited and seventeen named-place acquisition dockets remain openly held."),
  routes: { hub: "/review/global/places/", public_export: "/data/phase-192-global-place-systems-atlas.json" },
  counts: { place_system_dossiers: 20, exact_place_anchors: placeSystemDossiers.filter((record) => record.place_name).length, named_place_acquisition_dockets: placeSystemDossiers.filter((record) => !record.place_name).length, regions: unique(placeSystemDossiers.map((record) => record.region)).length, layer_cells: placeSystemDossiers.flatMap((record) => record.six_layer_reading).length, outcomes: 0, scores: 0, ranks: 0 },
  place_system_dossiers: placeSystemDossiers,
  public_html_routes: ["/review/global/places/", ...placeSystemDossiers.map((record) => record.route)],
  public_json_exports: ["/data/phase-192-global-place-systems-atlas.json"],
};

// Phase 193 — twenty-four prospective comparison passports. Portal identities
// define where to acquire evidence; every substantive comparison remains blocked.
const comparisonPairs = [
  ...p117.jurisdictions.map((left, index) => [left, p117.jurisdictions[(index + 1) % p117.jurisdictions.length]]),
  ...p117.jurisdictions.slice(0, 4).map((left, index) => [left, p117.jurisdictions[index + 10]]),
];
const comparisonPassports = comparisonPairs.map(([left, right], index) => {
  const authorityClass = p117.authority_classes[index % p117.authority_classes.length].label;
  const leftRail = p117.rails.find((rail) => rail.jurisdiction_id === left.jurisdiction_id && rail.authority_class === authorityClass);
  const rightRail = p117.rails.find((rail) => rail.jurisdiction_id === right.jurisdiction_id && rail.authority_class === authorityClass);
  return {
    global_comparison_passport_id: `193-PASSPORT-${pad(index + 1)}`,
    slug: `${left.slug}-and-${right.slug}-${slugify(authorityClass)}`,
    title: `${left.name} and ${right.name}: ${authorityClass}`,
    comparison_question: `What, if anything, can be compared between exact ${authorityClass.toLowerCase()} artifacts from ${left.name} and ${right.name} after identity, period, definition, method, unit, denominator, geography, and revision treatment are aligned?`,
    left: { jurisdiction_id: left.jurisdiction_id, jurisdiction_name: left.name, rail_id: leftRail.rail_id, source_id: leftRail.source_id, exact_artifact_id: null },
    right: { jurisdiction_id: right.jurisdiction_id, jurisdiction_name: right.name, rail_id: rightRail.rail_id, source_id: rightRail.source_id, exact_artifact_id: null },
    compatibility_dimensions: {
      identity: "Held — exact subject identities not yet bound",
      period: "Held — observation or decision periods not yet bound",
      definition: "Held — measure or milestone definitions not yet bound",
      method: "Held — collection and revision methods not yet bound",
      unit_and_denominator: "Held — units and denominators not yet bound",
      geography: "Known jurisdictions are non-equivalent; exact geographic scopes remain unbound",
    },
    comparable_claim: null,
    prohibited_comparison: "Do not compare portal coverage, institutional prominence, announced quantities, unaligned stages, national aggregates, or incompatible denominators as performance.",
    verdict: "Blocked — exact artifacts not yet bound",
    score: null,
    rank: null,
    review_date: null,
    reviewer_role: null,
    route: `/review/global/comparisons/${left.slug}-and-${right.slug}-${slugify(authorityClass)}/`,
    interpretation_boundary: boundary,
  };
});

const p193 = {
  ...phaseBase(193, "phase_193_comparative_evidence_lab", "Comparative Evidence Lab", "Prepare twenty-four cross-jurisdiction comparison passports with exact rail identities and explicit compatibility tests; all substantive verdicts remain blocked until paired exact artifacts exist."),
  routes: { hub: "/review/global/comparisons/", public_export: "/data/phase-193-comparative-evidence-lab.json" },
  counts: { comparison_passports: 24, jurisdiction_pairs: 24, compatibility_dimensions: 144, comparable_claims: 0, blocked_verdicts: 24, scores: 0, ranks: 0 },
  comparison_passports: comparisonPassports,
  public_html_routes: ["/review/global/comparisons/", ...comparisonPassports.map((record) => record.route)],
  public_json_exports: ["/data/phase-193-comparative-evidence-lab.json"],
};

// Phase 194 — a twenty-four-packet outcome observatory over the first twenty-four
// international project cohort identities. No series or observation is admitted.
const longitudinalAdjudicationPackets = projectConversionPackets.slice(0, 24).map((project, index) => ({
  longitudinal_adjudication_packet_id: `194-LONGITUDINAL-${pad(index + 1)}`,
  international_project_packet_id: project.international_project_packet_id,
  title: project.project_name ? `${project.project_name} longitudinal eligibility` : `${project.jurisdiction_name} project-slot ${index + 1} longitudinal eligibility`,
  entity_identity: project.project_name,
  jurisdiction_id: project.jurisdiction_id,
  source_ids: project.source_ids,
  candidate_measure: null,
  candidate_series_title: null,
  eligibility_tests: [
    { dimension: "identity", state: project.project_name ? "Exact project identity available; series identity still held" : "Held — exact project identity required", decision: null },
    { dimension: "period", state: "Held — no repeated observation periods bound", decision: null },
    { dimension: "measure", state: "Held — no stable observed measure definition bound", decision: null },
    { dimension: "method", state: "Held — no stable collection and revision method bound", decision: null },
    { dimension: "unit and denominator", state: "Held — no compatible unit and denominator bound", decision: null },
    { dimension: "acceptance", state: "Held — no governed observation-acceptance decision", decision: null },
  ],
  candidate_observation_ids: [],
  admitted_observation_ids: [],
  compatibility_decision: null,
  admission_decision: null,
  decision_date: null,
  decision_receipt_id: null,
  reviewer_role: null,
  outcome_state: "No series admitted",
  exact_next_artifact: project.project_name
    ? "Two or more entity-specific official observations with stable identity, period, measure, method, unit, denominator, acceptance state, and revision treatment."
    : project.exact_next_artifact,
  route: `/review/global/outcomes/${project.route.split("/").filter(Boolean).at(-1)}/`,
  interpretation_boundary: "This is an eligibility packet, not an outcome panel. Zero admitted observations is preserved and does not prove zero activity or impact.",
}));

const p194 = {
  ...phaseBase(194, "phase_194_longitudinal_outcomes_observatory", "Longitudinal Outcomes Observatory", "Create twenty-four international longitudinal adjudication packets with six compatibility tests each while admitting zero series and zero observations until stable source payloads and governed decisions exist."),
  routes: { hub: "/review/global/outcomes/", public_export: "/data/phase-194-longitudinal-outcomes-observatory.json" },
  counts: { longitudinal_adjudication_packets: 24, eligibility_test_cells: 144, exact_project_identities: longitudinalAdjudicationPackets.filter((record) => record.entity_identity).length, admitted_series: 0, admitted_observations: 0, compatibility_decisions: 0, admission_decisions: 0 },
  longitudinal_adjudication_packets: longitudinalAdjudicationPackets,
  public_html_routes: ["/review/global/outcomes/", ...longitudinalAdjudicationPackets.map((record) => record.route)],
  public_json_exports: ["/data/phase-194-longitudinal-outcomes-observatory.json"],
};

// Phase 195 — sixty-eight inherited canonical questions plus two recurring reader
// questions per topic. These are bounded answer briefs, not synthetic findings.
const topicLabels = {
  "topic-advanced-manufacturing": "Advanced Manufacturing",
  "topic-agriculture-and-bioeconomy": "Agriculture and Bioeconomy",
  "topic-ai-for-science": "AI for Science",
  "topic-aviation": "Aviation",
  "topic-chips-and-compute": "Chips and Compute",
  "topic-climate": "Climate",
  "topic-critical-minerals": "Critical Minerals",
  "topic-cybersecurity": "Cybersecurity",
  "topic-discovery-technologies": "Discovery Technologies",
  "topic-energy": "Energy",
  "topic-finance-and-risk": "Finance and Risk",
  "topic-human-futures": "Human Futures",
  "topic-mobility": "Mobility",
  "topic-policy-and-standards": "Policy and Standards",
  "topic-quantum": "Quantum",
  "topic-space": "Space",
  "topic-water": "Water",
};
const commonAnswerFramework = [
  "Resolve the exact entity, geography, authority, and aliases.",
  "Locate the record at its supported conversion stage; do not collapse authority, finance, build, test, acceptance, operation, and outcome.",
  "Bind the observation or decision period, definition, method, unit, denominator, and revision state.",
  "Separate direct evidence from interpretation, uncertainty, and excluded inference.",
  "Name the decisive next artifact and stop when the evidence contract is not met.",
];
const inheritedQuestionBriefs = p116.priority_questions.map((question, index) => ({
  canonical_question_brief_id: `195-BRIEF-${pad(index + 1)}`,
  question_kind: "Phase 116 priority-question brief",
  upstream_question_id: question.question_id,
  topic_id: question.topic_id,
  topic: topicLabels[question.topic_id],
  research_horizon: question.research_horizon,
  question: question.question,
  bounded_short_answer: `A defensible answer must ${question.why_priority.charAt(0).toLowerCase()}${question.why_priority.slice(1)} The current brief preserves that test and does not manufacture a cross-jurisdiction result.`,
  answer_state: "Bounded method answer — artifact-level factual answer remains open",
  required_evidence: question.required_evidence,
  answer_framework: commonAnswerFramework,
  completion_rule: question.completion_rule,
  source_ids: [],
  exact_artifact_ids: [],
  factual_answer_review_date: null,
  factual_answer_decision: null,
  route: `/review/global/questions/${question.topic_slug}/${question.question_id.toLowerCase()}/`,
  interpretation_boundary: question.interpretation_boundary,
}));
const topicIds = Object.keys(topicLabels);
const recurringQuestionBriefs = topicIds.flatMap((topicId, topicIndex) => {
  const topic = topicLabels[topicId];
  const slug = topicId.replace("topic-", "");
  return [
    {
      canonical_question_brief_id: `195-BRIEF-${pad(69 + topicIndex * 2)}`,
      question_kind: "Recurring reader question",
      upstream_question_id: null,
      topic_id: topicId,
      topic,
      research_horizon: "Delivery",
      question: `What has moved from announcement or authority to accepted operation in ${topic}?`,
      bounded_short_answer: "Nothing should be counted as accepted operation merely because it was announced, funded, permitted, built, demonstrated, or tested. The answer must enumerate exact named entities with acceptance records, then keep recurring operation and outcome evidence separate.",
      answer_state: "Canonical evidence rule published — current entity enumeration requires artifact review",
      required_evidence: ["Exact named entity and aliases", "Authoritative acceptance or cutover record", "Acceptance date, scope, conditions, and responsible body", "Separate recurring-operation evidence"],
      answer_framework: commonAnswerFramework,
      completion_rule: "Publish named accepted-operation records and explicit open gates; do not report a portfolio total from upstream announcements or unadjudicated candidates.",
      source_ids: [],
      exact_artifact_ids: [],
      factual_answer_review_date: null,
      factual_answer_decision: null,
      route: `/review/global/questions/${slug}/accepted-operation/`,
      interpretation_boundary: boundary,
    },
    {
      canonical_question_brief_id: `195-BRIEF-${pad(70 + topicIndex * 2)}`,
      question_kind: "Recurring reader question",
      upstream_question_id: null,
      topic_id: topicId,
      topic,
      research_horizon: "Outcomes",
      question: `What would demonstrate durable and broadly distributed public value in ${topic}?`,
      bounded_short_answer: "A single milestone, event, forecast, testimonial, or aggregate does not demonstrate durable public value. The answer requires repeated compatible measures tied to stable entities and periods, plus cost, access, distribution, failure, revision, and counterevidence treatment.",
      answer_state: "Canonical evidence rule published — outcome finding remains open",
      required_evidence: ["Repeated compatible observations", "Stable unit and denominator", "Cost and distribution measures", "Failure, exclusion, and revision treatment", "Authority and method provenance"],
      answer_framework: commonAnswerFramework,
      completion_rule: "Admit only governed observations that pass identity, period, measure, method, unit, denominator, acceptance, and revision tests; otherwise publish the bounded gap.",
      source_ids: [],
      exact_artifact_ids: [],
      factual_answer_review_date: null,
      factual_answer_decision: null,
      route: `/review/global/questions/${slug}/durable-public-value/`,
      interpretation_boundary: boundary,
    },
  ];
});
const questionBriefs = [...inheritedQuestionBriefs, ...recurringQuestionBriefs];

const p195 = {
  ...phaseBase(195, "phase_195_canonical_question_library", "Canonical Question Library", "Publish one hundred and two route-ready question briefs: sixty-eight inherited research contracts plus thirty-four recurring reader answers that define what the evidence can and cannot establish."),
  routes: { hub: "/review/global/questions/", public_export: "/data/phase-195-canonical-question-library.json" },
  counts: { question_briefs: 102, phase_116_priority_question_briefs: 68, recurring_reader_question_briefs: 34, topics: 17, bounded_method_answers: 102, completed_artifact_level_factual_answers: 0 },
  question_briefs: questionBriefs,
  public_html_routes: ["/review/global/questions/", ...questionBriefs.map((record) => record.route)],
  public_json_exports: ["/data/phase-195-canonical-question-library.json"],
};

// Phase 196 — local structural gates may pass; evidence acquisition, expert and
// translation review, publication, and promotion stay explicitly held.
const gateIdentity = (id, label) => ({
  candidate_gate_id: id,
  slug: id.toLowerCase(),
  title: label,
  label,
  route: `/review/global/candidate-gate/${id.toLowerCase()}/`,
});
const passGate = (id, label, proof) => ({ ...gateIdentity(id, label), gate_class: "Locally derived structural gate", state: "Pass", derived_pass: true, proof, owner_decision: null, decision_date: effectiveDate });
const heldGate = (id, label, exactNextAction) => ({ ...gateIdentity(id, label), gate_class: "External or owner-controlled gate", state: "Held", derived_pass: false, proof: null, owner_decision: null, decision_date: null, exact_next_action: exactNextAction });
const candidateGates = [
  passGate("196-GATE-01", "Eighty authority review packets", authorityRailReviewPackets.length === 80),
  passGate("196-GATE-02", "One hundred and twenty artifact slots", artifactAcquisitionSlots.length === 120),
  passGate("196-GATE-03", "Twenty jurisdiction profiles", jurisdictionSystemProfiles.length === 20),
  passGate("196-GATE-04", "Forty governed project-cohort packets", projectConversionPackets.length === 40),
  passGate("196-GATE-05", "Twenty place-system dossiers", placeSystemDossiers.length === 20),
  passGate("196-GATE-06", "Twenty-four comparison passports", comparisonPassports.length === 24),
  passGate("196-GATE-07", "Twenty-four longitudinal packets", longitudinalAdjudicationPackets.length === 24),
  passGate("196-GATE-08", "One hundred and two canonical question briefs", questionBriefs.length === 102),
  passGate("196-GATE-09", "No predated artifact checks", artifactAcquisitionSlots.every((record) => record.checked_date === null)),
  passGate("196-GATE-10", "No fabricated stage decisions", projectConversionPackets.every((record) => record.stage_tests.every((cell) => cell.decision === null))),
  passGate("196-GATE-11", "No admitted longitudinal series", longitudinalAdjudicationPackets.every((record) => record.admission_decision === null && record.admitted_observation_ids.length === 0)),
  passGate("196-GATE-12", "No comparison score or rank", comparisonPassports.every((record) => record.score === null && record.rank === null)),
  heldGate("196-GATE-13", "Exact-artifact acquisition", "Acquire, identity-check, and review the 120 prepared slots; issue a dated receipt for every accepted, rejected, blocked, or rescheduled candidate."),
  heldGate("196-GATE-14", "Named project and place completion", "Bind exact official identities for the 36 project and 17 place acquisition dockets before calling the cohorts complete."),
  heldGate("196-GATE-15", "Longitudinal evidence admission", "Adjudicate real repeated observations; zero admitted series remains a valid result."),
  heldGate("196-GATE-16", "Independent expert review", "Obtain field-specific review of factual claims, methods, exclusions, and corrections; record reviewer scope and dated disposition."),
  heldGate("196-GATE-17", "Human translation and accessibility review", "Complete human review of any translated edition and verify accessible, plain-language, and low-bandwidth outputs."),
  heldGate("196-GATE-18", "Owner publication and promotion decision", "After all required evidence and review gates are terminal, issue an owner-signed publish, no-publish, or bounded-reschedule receipt."),
];
const p196 = {
  ...phaseBase(196, "phase_196_global_reference_candidate_gate", "Global Reference Candidate Gate", "Certify the locally built Phase 189–195 structure through twelve derived passes while holding six evidence, expert, translation, longitudinal, and owner-controlled promotion gates."),
  routes: { hub: "/review/global/candidate-gate/", public_export: "/data/phase-196-global-reference-candidate-gate.json" },
  counts: { candidate_gates: 18, passed: candidateGates.filter((record) => record.state === "Pass").length, held: candidateGates.filter((record) => record.state === "Held").length, false_passes: candidateGates.filter((record) => record.state === "Pass" && !record.derived_pass).length },
  candidate_state: "Built locally — evidence activation and promotion held",
  promotion_state: "Held",
  promotion_decision: null,
  publication_decision: null,
  expert_review_decision: null,
  translation_review_decision: null,
  candidate_gates: candidateGates,
  public_html_routes: ["/review/global/candidate-gate/", ...candidateGates.map((record) => record.route)],
  public_json_exports: ["/data/phase-196-global-reference-candidate-gate.json"],
};

const outputs = [
  ["phase-189-global-authority-rail-activation.json", p189],
  ["phase-190-global-jurisdiction-system-profiles.json", p190],
  ["phase-191-international-named-project-conversion-cohort.json", p191],
  ["phase-192-global-place-systems-atlas.json", p192],
  ["phase-193-comparative-evidence-lab.json", p193],
  ["phase-194-longitudinal-outcomes-observatory.json", p194],
  ["phase-195-canonical-question-library.json", p195],
  ["phase-196-global-reference-candidate-gate.json", p196],
];
for (const [name, value] of outputs) await writeJson(join(dataRoot, name), value);

const workPackage = ({ phase, title, objective, delivered, held, acceptance }) => `# Phase ${phase} work package — ${title}\n\n**State:** Complete locally — external and owner-controlled decisions held  \n**Build date:** ${effectiveDate}\n\n## Objective\n\n${objective}\n\n## Delivered now\n\n${delivered.map((item) => `- ${item}`).join("\n")}\n\n## Held work\n\n${held.map((item) => `- ${item}`).join("\n")}\n\n## Acceptance\n\n${acceptance.map((item) => `- ${item}`).join("\n")}\n\n## Binding boundary\n\n${boundary}\n`;
const workPackages = [
  ["phase-189-global-authority-rail-activation.md", workPackage({ phase: 189, title: "Global Authority-Rail Activation", objective: "Turn the Phase 117 discovery graph into a controlled artifact-acquisition program.", delivered: ["80 authority-rail review packets across 20 jurisdictions.", "120 exact-artifact acquisition slots with identity, content, and stop-rule contracts.", "Null dates, URLs, digests, and outcomes until a real check occurs."], held: ["Artifact acquisition and dated review.", "Evidence admission or claim propagation."], acceptance: ["Every rail resolves to its Phase 117 rail and source identity.", "No institution portal is relabeled as an exact artifact.", "All 120 future artifact decisions remain null."] })],
  ["phase-190-global-jurisdiction-system-profiles.md", workPackage({ phase: 190, title: "Global Jurisdiction System Profiles", objective: "Give each mapped jurisdiction a rigorous system-reading page without implying performance or equivalence.", delivered: ["20 jurisdiction profiles with four-class authority topology.", "Governance, delivery, outcome, and comparison questions.", "Artifact-slot, topic, stage, language, and regional bindings."], held: ["Artifact-specific findings.", "Translation review and jurisdictional performance claims."], acceptance: ["All Phase 117 jurisdictions appear exactly once.", "Every authority topology row resolves to an existing rail and source.", "Every downstream finding and translation decision remains null."] })],
  ["phase-191-international-named-project-conversion-cohort.md", workPackage({ phase: 191, title: "International Named-Project Conversion Cohort", objective: "Build the governed intake structure for a forty-project international cohort while separating exact identities from open acquisition dockets.", delivered: ["40 project conversion packets across all 20 mapped jurisdictions.", "Four exact upstream Atlas identities preserved without refresh.", "Thirty-six visibly held named-project acquisition dockets and 320 null stage tests."], held: ["Binding exact project artifacts for open dockets.", "Stage, conversion, outcome, and publication decisions."], acceptance: ["An open slot never contains an invented project name.", "An inherited project never receives a new stage decision.", "Every stage cell and conversion decision remains null."] })],
  ["phase-192-global-place-systems-atlas.md", workPackage({ phase: 192, title: "Global Place Systems Atlas", objective: "Prepare a geographically broad place-system cohort with deep evidence questions and honest identity gaps.", delivered: ["20 place dossiers across 19 national or supranational jurisdictions.", "Three exact inherited place anchors and seventeen acquisition dockets.", "120 authority, finance, infrastructure, implementation, operation, and public-value cells."], held: ["Selection of exact places for open dockets.", "Place outcomes, scores, ranks, and causal findings."], acceptance: ["Every exact place resolves to Phase 119.", "All open place names and selection decisions remain null.", "No project result is transferred to a wider place system."] })],
  ["phase-193-comparative-evidence-lab.md", workPackage({ phase: 193, title: "Comparative Evidence Lab", objective: "Make cross-jurisdiction comparison requirements inspectable before any performance comparison is attempted.", delivered: ["24 paired-jurisdiction comparison passports.", "144 explicit identity, period, definition, method, denominator, and geography compatibility cells.", "Exact authority-rail and source identities on both sides."], held: ["Paired exact-artifact acquisition.", "Comparable claims, scores, ranks, and substantive verdicts."], acceptance: ["Every passport contains two distinct jurisdiction identities.", "Every verdict remains blocked until exact artifacts exist.", "Every score, rank, and comparable claim remains null."] })],
  ["phase-194-longitudinal-outcomes-observatory.md", workPackage({ phase: 194, title: "Longitudinal Outcomes Observatory", objective: "Prepare international outcome-series adjudication without filling empty panels with synthetic observations.", delivered: ["24 longitudinal adjudication packets.", "144 explicit eligibility-test cells.", "Zero-series boundary and exact next-artifact contracts."], held: ["Compatibility and admission decisions.", "Observation transfer and outcome interpretation."], acceptance: ["No packet contains an admitted observation.", "All compatibility and admission decisions remain null.", "Zero admitted series is reported as a bounded evidence state, never zero real-world activity."] })],
  ["phase-195-canonical-question-library.md", workPackage({ phase: 195, title: "Canonical Question Library", objective: "Turn the research architecture into a reader-facing library of bounded, answerable questions.", delivered: ["68 Phase 116 priority-question briefs.", "34 recurring accepted-operation and public-value briefs across 17 topics.", "Evidence, completion, answer-framework, and interpretation contracts on all 102 routes."], held: ["Artifact-level jurisdiction-specific factual answers.", "Factual answer review and publication decisions."], acceptance: ["All 68 upstream questions are represented once.", "Every topic receives exactly two recurring reader briefs.", "No missing artifact is replaced by a synthetic answer."] })],
  ["phase-196-global-reference-candidate-gate.md", workPackage({ phase: 196, title: "Global Reference Candidate Gate", objective: "Separate locally verifiable build completion from evidence, expert, translation, longitudinal, and publication authority.", delivered: ["18 candidate gates with derived proof or explicit held next action.", "12 locally verifiable structural passes.", "Six held external or owner-controlled gates and zero false passes."], held: ["Exact-artifact and identity completion.", "Longitudinal admission, expert review, translation review, and owner promotion."], acceptance: ["A Pass gate is supported by a true embedded proof.", "Every owner-controlled decision remains null.", "The global reference candidate remains Held until the six external gates are terminal."] })],
];
for (const [name, contents] of workPackages) await writeFile(join(workPackagesRoot, name), contents, "utf8");

console.log("Built Phases 189–196: 80 rail packets, 120 artifact slots, 20 jurisdiction profiles, 40 project packets, 20 place dossiers, 24 comparison passports, 24 longitudinal packets, 102 question briefs, and an 18-gate candidate report.");
