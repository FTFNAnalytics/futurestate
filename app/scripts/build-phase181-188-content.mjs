import { readdir, readFile, writeFile } from "node:fs/promises";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const appRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const dataRoot = join(appRoot, "src", "data");
const contentRoot = join(appRoot, "src", "content");
const workPackagesRoot = resolve(appRoot, "..", "docs", "work-packages");
const effectiveDate = "2026-09-01";
const readJson = async (path) => JSON.parse(await readFile(path, "utf8"));
const writeJson = async (path, value) => writeFile(path, `${JSON.stringify(value, null, 2)}\n`, "utf8");
const unique = (items) => [...new Set(items.filter(Boolean))];

const stripQuotes = (value) => {
  const trimmed = value.trim();
  if ((trimmed.startsWith('"') && trimmed.endsWith('"')) || (trimmed.startsWith("'") && trimmed.endsWith("'"))) return trimmed.slice(1, -1);
  return trimmed;
};

const parseFrontmatter = (text) => {
  const match = text.match(/^---\r?\n([\s\S]*?)\r?\n---/);
  if (!match) return {};
  const lines = match[1].split(/\r?\n/);
  const value = (key) => {
    const line = lines.find((entry) => entry.startsWith(`${key}:`));
    return line ? stripQuotes(line.slice(key.length + 1)) : null;
  };
  const list = (key) => {
    const index = lines.findIndex((entry) => entry === `${key}:`);
    if (index < 0) return [];
    const values = [];
    for (let cursor = index + 1; cursor < lines.length; cursor += 1) {
      const item = lines[cursor].match(/^\s+-\s+(.*)$/);
      if (!item) break;
      values.push(stripQuotes(item[1]));
    }
    return values;
  };
  return {
    id: value("id"), title: value("title"), slug: value("slug"), record_status: value("record_status"),
    summary: value("summary"), primary_topic: value("primary_topic"), claim_scope: value("claim_scope"),
    editorial_notes: value("editorial_notes"), source_ids: list("source_ids")
  };
};

const loadSignals = async () => {
  const root = join(contentRoot, "signals");
  const names = (await readdir(root)).filter((name) => name.endsWith(".mdx")).sort();
  return Promise.all(names.map(async (name) => ({ ...parseFrontmatter(await readFile(join(root, name), "utf8")), file_name: name })));
};

const loadSources = async () => {
  const root = join(contentRoot, "sources");
  const names = (await readdir(root)).filter((name) => name.endsWith(".json")).sort();
  return Promise.all(names.map((name) => readJson(join(root, name))));
};

const [
  topics, signals, sources, p117, p118, p121, p128, p136, p138, p140, p142, p152, p170, p171, p180
] = await Promise.all([
  Promise.all((await readdir(join(contentRoot, "topics"))).filter((name) => name.endsWith(".json")).sort().map((name) => readJson(join(contentRoot, "topics", name)))),
  loadSignals(), loadSources(),
  readJson(join(dataRoot, "phase-117-global-authority-graph.json")),
  readJson(join(dataRoot, "phase-118-canonical-living-encyclopedia.json")),
  readJson(join(dataRoot, "phase-119-deep-project-place-atlas.json")),
  readJson(join(dataRoot, "phase-121-priority-research-missions.json")),
  readJson(join(dataRoot, "phase-128-topic-state-of-evidence-reviews.json")),
  readJson(join(dataRoot, "phase-136-named-project-chronicles.json")),
  readJson(join(dataRoot, "phase-137-place-delivery-ledgers.json")),
  readJson(join(dataRoot, "phase-138-longitudinal-evidence-eligibility.json")),
  readJson(join(dataRoot, "phase-140-living-topic-desks.json")),
  readJson(join(dataRoot, "phase-142-topic-delivery-roadmaps.json")),
  readJson(join(dataRoot, "phase-152-frontier-topic-field-guides.json")),
  readJson(join(dataRoot, "phase-170-fifteen-place-systems-atlas.json")),
  readJson(join(dataRoot, "phase-171-frontier-systems-compendium.json")),
  readJson(join(dataRoot, "phase-180-october-state-report-and-v1-promotion-gate.json"))
]);

const topicById = new Map(topics.map((topic) => [topic.id, topic]));
const topicByName = new Map(topics.map((topic) => [topic.name, topic]));
const signalById = new Map(signals.map((signal) => [signal.id, signal]));
const sourceById = new Map(sources.map((source) => [source.id, source]));
const chapterByTopic = new Map(p118.topic_chapters.map((record) => [record.topic_id, record]));
const reviewByTopic = new Map(p128.topic_reviews.map((record) => [record.topic_id, record]));
const deskByTopic = new Map(p140.topic_desks.map((record) => [record.topic_id, record]));
const roadmapByTopic = new Map(p142.topic_roadmaps.map((record) => [record.topic_id, record]));
const guideByTopic = new Map(p152.field_guides.map((record) => [record.topic_id, record]));
const missionSummaryByTopic = new Map(p121.topic_summaries.map((record) => [record.topic_id, record]));
const missionsById = new Map(p121.missions.map((record) => [record.mission_id, record]));
const chronicleById = new Map(p136.project_chronicles.map((record) => [record.chronicle_id, record]));
const railById = new Map(p117.rails.map((record) => [record.rail_id, record]));
const jurisdictionById = new Map(p117.jurisdictions.map((record) => [record.jurisdiction_id, record]));

const boundaries = [
  "This is an append-only synthesis over existing repository records; it does not rewrite an upstream source, signal, project, place, mission, or validation receipt.",
  "A mapped authority rail, candidate artifact, prepared case, or longitudinal passport does not establish implementation, acceptance, recurring operation, outcome, causation, score, or rank.",
  "No future-dated evidence check, owner disposition, publication decision, Git operation, hosted deployment, public launch, or v1 promotion is inferred.",
  "Repository-bounded absence identifies what the inspected corpus has not established; it is never a claim that qualifying evidence does not exist elsewhere."
];

// Phase 181 — one canonical reader contract per topic, grounded in the existing encyclopedia/review/desk/guide chain.
const canonicalTopicResources = topics.map((topic, index) => {
  const chapter = chapterByTopic.get(topic.id);
  const review = reviewByTopic.get(topic.id);
  const desk = deskByTopic.get(topic.id);
  const roadmap = roadmapByTopic.get(topic.id);
  const guide = guideByTopic.get(topic.id);
  const missionSummary = missionSummaryByTopic.get(topic.id);
  return {
    canonical_resource_id: `181-RESOURCE-${String(index + 1).padStart(3, "0")}`,
    topic_id: topic.id,
    topic_name: topic.name,
    slug: topic.slug,
    title: `${topic.name}: canonical resource map`,
    resource_state: "Built locally — canonical reader contract; upstream evidence remains authoritative",
    reader_promise: topic.summary,
    canonical_answer: chapter.executive_synthesis,
    historical_baseline: chapter.historical_baseline,
    current_evidence_state: chapter.current_evidence_state,
    conversion_chain: chapter.conversion_chain,
    decisive_evidence: chapter.decisive_evidence,
    claim_boundaries: chapter.claim_boundaries,
    upstream_record_bindings: {
      encyclopedia_chapter_id: chapter.chapter_id,
      evidence_review_id: review.review_id,
      living_desk_id: desk.desk_id,
      delivery_roadmap_id: roadmap.topic_roadmap_id,
      field_guide_id: guide.field_guide_id,
      mission_ids: missionSummary.mission_ids
    },
    direct_evidence_signal_ids: guide.direct_evidence_signal_ids,
    direct_evidence_source_ids: guide.direct_evidence_source_ids,
    named_project_ids: guide.named_projects.map((record) => record.chronicle_id),
    receiving_place_ids: guide.receiving_places.map((record) => record.ledger_id),
    canonicality_contract: "This is the preferred topic-level reader entry. It resolves to, rather than supersedes, the evidence review, living desk, field guide, project/place records, source profiles, and priority missions.",
    canonical_route: `/reference/topics/${topic.slug}/`,
    route: `/reference/topics/${topic.slug}/`
  };
});

const validatedBaselineRoutes = p180.local_validation_receipt?.metrics?.whole_site_snapshot?.html_pages_excluding_downloads ?? null;
const p181 = {
  schema_version: "1.0", phase: 181, program_id: "FTFN-PHASE-181", dataset: "phase_181_canonical_resource_map",
  title: "Canonical Resource Map", effective_date: effectiveDate, record_status: "Built locally", build_status: "Complete — route integration pending",
  summary: "Establish one canonical, evidence-bounded reader contract for each of seventeen topics and an exhaustive first-match route-family classification over the Phase 180 validated site baseline.",
  publication_boundaries: boundaries,
  baseline_binding: { phase_180_receipt_id: p180.local_validation_receipt?.receipt_id, validated_html_routes: validatedBaselineRoutes, classification_scope: "Every validated HTML route is governed by the first matching family below; individual legacy URLs remain in their existing manifests." },
  route_family_classification: [
    { family: "Canonical topic resources", first_match_rule: "/reference/topics/:slug/", disposition: "Preferred reader entry" },
    { family: "Entity and atlas records", first_match_rule: "/atlas/, /projects/, /places/, or entity-specific review paths", disposition: "Supporting canonical entity record" },
    { family: "Evidence and source records", first_match_rule: "/signals/, /sources/, evidence, gap, outcome, or comparison paths", disposition: "Supporting evidence record" },
    { family: "Method and operating records", first_match_rule: "/review/ and phase/program operating paths not matched above", disposition: "Governance, method, or dated operating record" },
    { family: "Reader navigation and synthesis", first_match_rule: "Home, topic indexes, briefs, collections, pathways, reports, and non-record explainers", disposition: "Reader navigation or synthesis" },
    { family: "Exports and utility surfaces", first_match_rule: "/data/, downloads, search, feeds, status, and machine-readable utility paths", disposition: "Export or utility surface" }
  ],
  counts: { canonical_topic_resources: 17, validated_baseline_html_routes_governed: validatedBaselineRoutes, upstream_record_kinds_per_topic: 6, numeric_rankings: 0 },
  routes: { hub: "/reference/", public_export: "/data/phase-181-canonical-resource-map.json" },
  canonical_topic_resources: canonicalTopicResources,
  public_html_routes: ["/reference/", ...canonicalTopicResources.map((record) => record.canonical_route)],
  public_json_exports: ["/data/phase-181-canonical-resource-map.json"]
};

// Phase 182 — enumerate the exact current In Review shelf and select a coverage-balanced, non-ranked first-pass cohort.
const inReviewSignals = signals.filter((signal) => signal.record_status === "In Review");
const publishedSignals = signals.filter((signal) => signal.record_status === "Published");
const groupedInReview = new Map(topics.map((topic) => [topic.id, []]));
for (const signal of inReviewSignals) {
  const topic = topicByName.get(signal.primary_topic);
  if (topic) groupedInReview.get(topic.id).push(signal);
}
for (const records of groupedInReview.values()) records.sort((a, b) => a.id.localeCompare(b.id));
const roundRobin = [];
let cursor = 0;
while (roundRobin.length < 100) {
  let moved = false;
  for (const topic of topics) {
    const signal = groupedInReview.get(topic.id)[cursor];
    if (signal && roundRobin.length < 100) { roundRobin.push(signal.id); moved = true; }
  }
  if (!moved) break;
  cursor += 1;
}
const firstPassIds = new Set(roundRobin);
const sourceAuditFields = ["id", "name", "url", "source_owner", "last_checked_date"];
const structuralFieldMissingCounts = Object.fromEntries(sourceAuditFields.map((field) => [field, sources.filter((source) => !source[field]).length]));
const profilesWithStructuralGaps = sources.filter((source) => sourceAuditFields.some((field) => !source[field])).length;
const backlogItems = inReviewSignals.sort((a, b) => a.id.localeCompare(b.id)).map((signal, index) => {
  const topic = topicByName.get(signal.primary_topic);
  const presentSourceIds = signal.source_ids.filter((id) => sourceById.has(id));
  return {
    backlog_item_id: `182-BACKLOG-${String(index + 1).padStart(3, "0")}`,
    signal_id: signal.id,
    slug: signal.slug,
    title: signal.title,
    topic_id: topic?.id ?? null,
    topic_name: signal.primary_topic,
    inherited_summary: signal.summary,
    inherited_claim_scope: signal.claim_scope,
    source_ids: signal.source_ids,
    source_profiles_present: presentSourceIds.length,
    source_binding_state: presentSourceIds.length === signal.source_ids.length ? "Complete structural binding" : "Missing source-profile binding",
    first_pass_cohort: firstPassIds.has(signal.id),
    triage_state: "Queued — no admissibility or publication decision made",
    review_contract: "Verify entity, issuer, artifact date, factual nucleus, claim scope, excluded inference, and exact receiving record before any status change.",
    route: `/reference/evidence-backlog/${signal.slug}/`
  };
});
const p182 = {
  schema_version: "1.0", phase: 182, program_id: "FTFN-PHASE-182", dataset: "phase_182_evidence_source_backlog",
  title: "Evidence and Source Backlog", effective_date: effectiveDate, record_status: "Built locally", build_status: "Complete — adjudications remain open",
  summary: "Enumerate all 285 current In Review signals, bind their declared source profiles, and identify a one-hundred-record coverage-balanced first-pass cohort without assigning value scores or making review decisions.",
  publication_boundaries: boundaries,
  selection_contract: "The first-pass cohort is a deterministic round-robin across the seventeen topic shelves. It is an operating batch, not a value judgment, score, rank, admissibility decision, or publication queue.",
  source_registry_audit: { source_profiles_parsed: sources.length, structural_fields_checked: sourceAuditFields, structural_field_missing_counts: structuralFieldMissingCounts, profiles_with_any_structural_gap: profilesWithStructuralGaps, network_currency_checks_run: 0, boundary: "Parsing and cross-reference validation are not live URL or current-artifact checks. Missing-field counts are exposed rather than silently treated as passes." },
  counts: { signals_total: signals.length, published_signals: publishedSignals.length, in_review_signals: inReviewSignals.length, backlog_items: backlogItems.length, first_pass_cohort: firstPassIds.size, source_profiles_structurally_parsed: sources.length, source_profiles_with_structural_gaps: profilesWithStructuralGaps, admissibility_decisions: 0 },
  routes: { hub: "/reference/evidence-backlog/", public_export: "/data/phase-182-evidence-source-backlog.json" },
  backlog_items: backlogItems,
  public_html_routes: ["/reference/evidence-backlog/", ...backlogItems.map((record) => record.route)],
  public_json_exports: ["/data/phase-182-evidence-source-backlog.json"]
};

// Phase 183 — deepen the four topics previously missing a local-system representation.
const thinTopicIds = ["topic-agriculture-and-bioeconomy", "topic-ai-for-science", "topic-discovery-technologies", "topic-quantum"];
const missionPortfolios = thinTopicIds.map((topicId, index) => {
  const topic = topicById.get(topicId);
  const guide = guideByTopic.get(topicId);
  const missionIds = missionSummaryByTopic.get(topicId).mission_ids;
  return {
    mission_portfolio_id: `183-MISSION-${String(index + 1).padStart(2, "0")}`,
    topic_id: topicId, slug: topic.slug, title: `${topic.name}: missing-system mission`,
    mission_state: "Built — research and local-system evidence still open",
    problem_definition: topic.summary,
    priority_mission_ids: missionIds,
    priority_questions: missionIds.map((id) => missionsById.get(id).title),
    evidence_starting_point: guide.strongest_current_evidence,
    local_system_contract: "Resolve a named receiving place, governing authority, implementation chain, affected parties, operating denominator, and outcome measure before asserting a local-system result.",
    decisive_next_evidence: guide.next_actions,
    source_ids: guide.source_ids,
    route: `/reference/missing-systems/${topic.slug}/`
  };
});
const namedCaseFiles = thinTopicIds.flatMap((topicId, topicIndex) => {
  const topic = topicById.get(topicId);
  const guide = guideByTopic.get(topicId);
  return guide.direct_evidence_signal_ids.slice(0, 2).map((signalId, caseIndex) => {
    const signal = signalById.get(signalId);
    const sourceIds = unique(signal?.source_ids ?? []);
    return {
      named_case_file_id: `183-CASE-${String(topicIndex * 2 + caseIndex + 1).padStart(2, "0")}`,
      mission_portfolio_id: missionPortfolios[topicIndex].mission_portfolio_id,
      topic_id: topicId,
      signal_id: signalId,
      slug: `${topic.slug}-${signal?.slug ?? caseIndex + 1}`,
      title: signal?.title ?? `${topic.name} evidence case ${caseIndex + 1}`,
      case_kind: "Existing published evidence case; project status not inferred",
      current_read: signal?.summary ?? "The upstream signal remains the controlling account.",
      source_ids: sourceIds,
      boundary: signal?.editorial_notes ?? "Retain the upstream claim scope and do not infer a downstream operating or outcome state.",
      exact_next_action: "Bind the named evidence to a specific receiving place and test authority, implementation, acceptance, operation, and outcome as separate stages.",
      route: `/reference/missing-systems/${topic.slug}/cases/${signal?.slug ?? caseIndex + 1}/`
    };
  });
});
const p183 = {
  schema_version: "1.0", phase: 183, program_id: "FTFN-PHASE-183", dataset: "phase_183_missing_system_topic_missions",
  title: "Missing-System Topic Missions", effective_date: effectiveDate, record_status: "Built locally", build_status: "Complete — evidence missions remain open",
  summary: "Create four deep research portfolios and eight source-bound named case files for Agriculture and Bioeconomy, AI for Science, Discovery Technologies, and Quantum.",
  publication_boundaries: boundaries,
  counts: { mission_portfolios: 4, named_case_files: 8, priority_missions_bound: 16, local_system_outcomes_created: 0 },
  routes: { hub: "/reference/missing-systems/", public_export: "/data/phase-183-missing-system-topic-missions.json" },
  mission_portfolios: missionPortfolios,
  named_case_files: namedCaseFiles,
  public_html_routes: ["/reference/missing-systems/", ...missionPortfolios.map((record) => record.route), ...namedCaseFiles.map((record) => record.route)],
  public_json_exports: ["/data/phase-183-missing-system-topic-missions.json"]
};

// Phase 184 — edition two resolves the strongest existing authored layers into a single topic object.
const topicEditions = canonicalTopicResources.map((resource, index) => {
  const guide = guideByTopic.get(resource.topic_id);
  const review = reviewByTopic.get(resource.topic_id);
  return {
    topic_edition_id: `184-TOPIC-${String(index + 1).padStart(3, "0")}`,
    canonical_resource_id: resource.canonical_resource_id,
    topic_id: resource.topic_id, slug: resource.slug,
    title: `${resource.topic_name}: canonical topic edition 2`,
    edition_state: "Built locally from published upstream records",
    orientation: guide.orientation,
    canonical_synthesis: resource.canonical_answer,
    strongest_current_evidence: guide.strongest_current_evidence,
    contested_reading: guide.contested_reading,
    evidence_chain: guide.evidence_chain,
    horizon_questions: guide.horizon_questions,
    named_projects: guide.named_projects,
    receiving_places: guide.receiving_places,
    decision_use: guide.decision_use,
    success_definition: guide.success_definition,
    source_ids: guide.source_ids,
    authored_review_binding: { review_id: review.review_id, authored_word_count: review.authored_word_count, route: review.route },
    interpretation_boundary: "Edition 2 composes existing authored accounts and exact IDs. It changes no source fact, evidence status, project or place stage, comparison verdict, outcome, or owner decision.",
    route: `/reference/topics/${resource.slug}/edition-2/`
  };
});
const p184 = {
  schema_version: "1.0", phase: 184, program_id: "FTFN-PHASE-184", dataset: "phase_184_canonical_topic_edition_2",
  title: "Canonical Topic Edition 2", effective_date: effectiveDate, record_status: "Built locally", build_status: "Complete — route integration pending",
  summary: "Resolve the encyclopedia, state-of-evidence review, living desk, delivery roadmap, field guide, missions, projects, places, and sources into seventeen definitive topic editions.",
  publication_boundaries: boundaries,
  counts: { topic_editions: 17, mission_questions_bound: 68, topics_with_named_project_or_explicit_empty_state: 17, outcome_claims_created: 0 },
  routes: { hub: "/reference/topics/", public_export: "/data/phase-184-canonical-topic-edition-2.json" },
  topic_editions: topicEditions,
  public_html_routes: ["/reference/topics/", ...topicEditions.map((record) => record.route)],
  public_json_exports: ["/data/phase-184-canonical-topic-edition-2.json"]
};

// Phase 185 — jurisdiction-scale receiving-system dossiers over exact Phase 117 authority rails.
const selectedJurisdictions = p117.jurisdictions.filter((record) => !["canada", "multilateral-systems"].includes(record.slug));
const placeSystemDossiers = selectedJurisdictions.map((jurisdiction, index) => {
  const rails = jurisdiction.rail_ids.map((id) => railById.get(id));
  return {
    place_system_dossier_id: `185-DOSSIER-${String(index + 1).padStart(3, "0")}`,
    jurisdiction_id: jurisdiction.jurisdiction_id,
    slug: jurisdiction.slug,
    title: `${jurisdiction.name}: global receiving-system orientation`,
    geographic_unit_kind: jurisdiction.slug === "european-union" ? "Supranational jurisdiction" : "National jurisdiction",
    region: jurisdiction.region,
    languages: jurisdiction.languages,
    dossier_state: "Built — authority routes mapped; place-wide stage not established",
    reader_narrative: `${jurisdiction.name} enters the global atlas as a bounded receiving-system orientation. Its ${rails.map((rail) => rail.institution_name).join(", ")} rails identify where authoritative records may be found across policy, implementation, statistics, and oversight. The map does not claim that every relevant institution or local delivery system is represented.`,
    authority_rail_ids: jurisdiction.rail_ids,
    source_ids: rails.map((rail) => rail.source_id),
    topic_ids: unique(rails.flatMap((rail) => rail.topic_ids)),
    system_layers: rails.map((rail, layerIndex) => ({
      layer_id: `185-LAYER-${String(index + 1).padStart(2, "0")}-${String(layerIndex + 1).padStart(2, "0")}`,
      authority_class: rail.authority_class,
      institution_name: rail.institution_name,
      source_id: rail.source_id,
      official_url: rail.official_url,
      artifact_families: rail.artifact_families,
      current_read: `Phase 117 maps ${rail.institution_name} as an official ${rail.authority_class.toLowerCase()} entry point for ${jurisdiction.name}; artifact review remains ${rail.artifact_review_state.toLowerCase()}.`,
      decisive_next_action: "Retrieve an exact dated artifact, preserve language and jurisdiction scope, and test the supported conversion stage before creating a claim."
    })),
    place_stage: null,
    causal_conclusion: null,
    score: null,
    rank: null,
    interpretation_boundary: jurisdiction.interpretation_boundary,
    route: `/reference/global-places/${jurisdiction.slug}/`
  };
});
const p185 = {
  schema_version: "1.0", phase: 185, program_id: "FTFN-PHASE-185", dataset: "phase_185_global_place_systems_atlas_i",
  title: "Global Place Systems Atlas I", effective_date: effectiveDate, record_status: "Built locally", build_status: "Complete — exact artifact acquisition remains open",
  summary: "Publish eighteen jurisdiction-scale orientation dossiers spanning Europe, Asia, Oceania, Latin America, Africa, North America, and the Middle East, each bound to four existing official authority rails.",
  publication_boundaries: boundaries,
  counts: { place_system_dossiers: 18, regions: unique(selectedJurisdictions.map((record) => record.region)).length, authority_layers: placeSystemDossiers.flatMap((record) => record.system_layers).length, exact_source_bindings: placeSystemDossiers.flatMap((record) => record.source_ids).length, place_stages_created: 0, scores_or_ranks: 0 },
  routes: { hub: "/reference/global-places/", public_export: "/data/phase-185-global-place-systems-atlas-i.json" },
  place_system_dossiers: placeSystemDossiers,
  public_html_routes: ["/reference/global-places/", ...placeSystemDossiers.map((record) => record.route)],
  public_json_exports: ["/data/phase-185-global-place-systems-atlas-i.json"]
};

// Phase 186 — exactly two cases per topic: one international authority-to-delivery research case and one repository-bound named case.
const topicCoverageById = new Map(p117.topic_coverage.map((record) => [record.topic_id, record.rail_ids]));
const usedInternationalJurisdictions = new Set();
const deliveryCaseFiles = [];
for (const [topicIndex, topic] of topics.entries()) {
  const candidateRails = (topicCoverageById.get(topic.id) ?? []).map((id) => railById.get(id)).filter((rail) => !["117-JURISDICTION-001", "117-JURISDICTION-020"].includes(rail.jurisdiction_id));
  const internationalRail = candidateRails.find((rail) => !usedInternationalJurisdictions.has(rail.jurisdiction_id)) ?? candidateRails[topicIndex % candidateRails.length];
  usedInternationalJurisdictions.add(internationalRail.jurisdiction_id);
  const jurisdiction = jurisdictionById.get(internationalRail.jurisdiction_id);
  deliveryCaseFiles.push({
    delivery_case_id: `186-CASE-${String(topicIndex * 2 + 1).padStart(3, "0")}`,
    topic_id: topic.id, case_slot: "International authority-to-delivery case", slug: `${topic.slug}-${jurisdiction.slug}-authority-case`,
    title: `${topic.name} in ${jurisdiction.name}: authority-to-delivery research case`,
    entity_identity: `${internationalRail.institution_name} / ${jurisdiction.name} / ${internationalRail.authority_class}`,
    jurisdiction_id: jurisdiction.jurisdiction_id, jurisdiction_name: jurisdiction.name, region: jurisdiction.region,
    upstream_rail_id: internationalRail.rail_id, source_ids: [internationalRail.source_id], signal_ids: [],
    current_stage: null,
    current_read: `The repository maps ${internationalRail.institution_name} as an official ${internationalRail.authority_class.toLowerCase()} rail relevant to ${topic.name}. The case is ready for exact-artifact research but does not yet establish a named implementation or delivery stage.`,
    unresolved_bridge: "An exact artifact must identify the entity, authority, implementation, receiving system, period, method, denominator, and excluded inference.",
    boundary: "An authority entry point is not a named delivered project or an outcome.",
    route: `/reference/delivery-cases/${topic.slug}/${jurisdiction.slug}-authority-case/`
  });

  const guide = guideByTopic.get(topic.id);
  const projectJoin = guide.named_projects[0];
  const chronicle = projectJoin ? chronicleById.get(projectJoin.chronicle_id) : null;
  const fallbackSignal = signalById.get(guide.direct_evidence_signal_ids[0]);
  const caseSlug = chronicle?.slug ?? fallbackSignal.slug;
  deliveryCaseFiles.push({
    delivery_case_id: `186-CASE-${String(topicIndex * 2 + 2).padStart(3, "0")}`,
    topic_id: topic.id, case_slot: "Repository-bound named case", slug: `${topic.slug}-${caseSlug}`,
    title: chronicle?.title ?? fallbackSignal.title,
    entity_identity: chronicle?.atlas_project_id ?? fallbackSignal.id,
    jurisdiction_id: null, jurisdiction_name: null, region: null,
    upstream_chronicle_id: chronicle?.chronicle_id ?? null,
    source_ids: chronicle?.source_ids ?? fallbackSignal.source_ids,
    signal_ids: chronicle?.signal_ids ?? [fallbackSignal.id],
    current_stage: chronicle?.inherited_stage ?? null,
    current_read: chronicle?.current_account ?? fallbackSignal.summary,
    unresolved_bridge: chronicle?.unresolved_bridge ?? "Named local implementation, acceptance, operation, and outcome evidence remain separate downstream tests.",
    boundary: chronicle?.stop_rule ?? fallbackSignal.editorial_notes,
    route: `/reference/delivery-cases/${topic.slug}/${caseSlug}/`
  });
}
const p186 = {
  schema_version: "1.0", phase: 186, program_id: "FTFN-PHASE-186", dataset: "phase_186_named_delivery_case_atlas_ii",
  title: "Named Delivery Case Atlas II", effective_date: effectiveDate, record_status: "Built locally", build_status: "Complete — international artifact research remains open",
  summary: "Create thirty-four topic-balanced case files: one international official-authority research case and one repository-bound named evidence or project case for each topic.",
  publication_boundaries: boundaries,
  counts: { delivery_case_files: 34, topic_case_pairs: 17, international_authority_cases: 17, repository_bound_cases: 17, new_stage_decisions: 0 },
  routes: { hub: "/reference/delivery-cases/", public_export: "/data/phase-186-named-delivery-case-atlas-ii.json" },
  delivery_case_files: deliveryCaseFiles,
  public_html_routes: ["/reference/delivery-cases/", ...deliveryCaseFiles.map((record) => record.route)],
  public_json_exports: ["/data/phase-186-named-delivery-case-atlas-ii.json"]
};

// Phase 187 — two source-bound candidate passports per topic; all observation and admission results remain open.
const testLabels = ["Stable entity identity", "Compatible observation period", "Stable denominator", "Compatible method", "Revision treatment", "Acceptance definition"];
const candidatePassports = topics.flatMap((topic, topicIndex) => {
  const guide = guideByTopic.get(topic.id);
  return guide.direct_evidence_signal_ids.slice(0, 2).map((signalId, signalIndex) => {
    const signal = signalById.get(signalId);
    const passportNo = topicIndex * 2 + signalIndex + 1;
    return {
      candidate_passport_id: `187-PASSPORT-${String(passportNo).padStart(3, "0")}`,
      topic_id: topic.id, signal_id: signalId, slug: `${topic.slug}-${signal.slug}`,
      title: `${signal.title}: longitudinal candidate passport`,
      candidate_state: "Prepared — compatibility not adjudicated",
      inherited_evidence_read: signal.summary,
      source_ids: signal.source_ids,
      measurement_contract: { entity: null, observation_period: null, denominator: null, method: null, revision_policy: null, acceptance_definition: null },
      compatibility_tests: testLabels.map((label, testIndex) => ({ test_id: `187-TEST-${String(passportNo).padStart(3, "0")}-${String(testIndex + 1).padStart(2, "0")}`, label, outcome: null, rationale: null })),
      observation_values: [],
      admission_outcome: null,
      admitted_series_id: null,
      decision_date: null,
      decision_receipt_id: null,
      exact_next_action: "Retrieve at least two compatible dated observations and adjudicate every identity, period, denominator, method, revision, and acceptance test before admission.",
      boundary: "A published point observation or milestone does not create a longitudinal series, trend, comparison, outcome, or causal result.",
      route: `/reference/outcomes-observatory/${topic.slug}/${signal.slug}/`
    };
  });
});
const p187 = {
  schema_version: "1.0", phase: 187, program_id: "FTFN-PHASE-187", dataset: "phase_187_outcomes_longitudinal_observatory",
  title: "Outcomes and Longitudinal Observatory", effective_date: effectiveDate, record_status: "Built locally", build_status: "Complete — all admissions open",
  summary: "Prepare thirty-four source-bound candidate passports, two per topic, with explicit six-part compatibility tests and zero preloaded observations or admission outcomes.",
  publication_boundaries: boundaries,
  upstream_zero_series_binding: { phase_138_eligibility_reviews: p138.counts.eligibility_reviews, phase_138_admitted_series: p138.counts.admitted_series, preserved: true },
  counts: { candidate_passports: 34, topics: 17, compatibility_test_cells: candidatePassports.flatMap((record) => record.compatibility_tests).length, observation_values: 0, admission_decisions: 0, admitted_series: 0 },
  routes: { hub: "/reference/outcomes-observatory/", public_export: "/data/phase-187-outcomes-longitudinal-observatory.json" },
  candidate_passports: candidatePassports,
  public_html_routes: ["/reference/outcomes-observatory/", ...candidatePassports.map((record) => record.route)],
  public_json_exports: ["/data/phase-187-outcomes-longitudinal-observatory.json"]
};

// Phase 188 — flagship, topic, region, and context-only comparison records in one route-ready array.
const editionRecords = [];
editionRecords.push({
  edition_record_id: "188-RECORD-001", record_kind: "Flagship synthesis", slug: "state-of-frontier-systems-2026-reference-edition",
  title: "State of Frontier Systems 2026: reference edition",
  topic_ids: topics.map((topic) => topic.id), source_ids: unique(topicEditions.flatMap((record) => record.source_ids)),
  current_read: "The repository now supports a seventeen-topic reference spine, a governed project/place conversion layer, international authority orientations, an explicit evidence backlog, and a zero-presumption outcomes observatory. Its strongest contribution is not a universal verdict: it is the ability to distinguish commitment, authority, implementation, acceptance, repeated operation, and measured outcome without collapsing them.",
  decision_use: "Start with the cross-system conversion boundary, then move to a topic, named case, place system, exact source, and open evidence mission.",
  section_bindings: { canonical_resource_ids: canonicalTopicResources.map((record) => record.canonical_resource_id), topic_edition_ids: topicEditions.map((record) => record.topic_edition_id), compendium_record_ids: p171.compendium_records.map((record) => record.compendium_record_id), atlas_dossier_ids: p170.place_system_dossiers.map((record) => record.place_system_dossier_id) },
  boundary: boundaries[1], route: "/reference/state-of-frontier-systems/"
});

for (const [index, record] of topicEditions.entries()) editionRecords.push({
  edition_record_id: `188-RECORD-${String(index + 2).padStart(3, "0")}`, record_kind: "Executive topic summary", slug: record.slug,
  title: `${topicById.get(record.topic_id).name}: executive state summary`, topic_ids: [record.topic_id], source_ids: record.source_ids,
  current_read: record.canonical_synthesis.join(" "), decision_use: record.decision_use,
  upstream_topic_edition_id: record.topic_edition_id,
  boundary: record.interpretation_boundary, route: `/reference/state-of-frontier-systems/topics/${record.slug}/`
});

const regionGroups = [
  { slug: "europe", title: "Europe", regions: ["Europe"] },
  { slug: "asia", title: "Asia", regions: ["Asia"] },
  { slug: "africa-middle-east", title: "Africa and the Middle East", regions: ["Africa", "Middle East"] },
  { slug: "latin-america", title: "Latin America", regions: ["South America"] },
  { slug: "oceania", title: "Oceania", regions: ["Oceania"] },
  { slug: "north-america", title: "North America", regions: ["North America"] }
];
for (const [index, group] of regionGroups.entries()) {
  const dossiers = placeSystemDossiers.filter((record) => group.regions.includes(record.region));
  editionRecords.push({
    edition_record_id: `188-RECORD-${String(19 + index).padStart(3, "0")}`, record_kind: "Regional orientation brief", slug: group.slug,
    title: `${group.title}: authority and receiving-system orientation`, topic_ids: unique(dossiers.flatMap((record) => record.topic_ids)), source_ids: unique(dossiers.flatMap((record) => record.source_ids)),
    current_read: `${group.title} is represented by ${dossiers.length} jurisdiction-scale dossier${dossiers.length === 1 ? "" : "s"}. The mapped official rails locate policy, implementation, statistics, and oversight entry points while leaving exact artifact review and subnational delivery findings open.`,
    decision_use: "Use the brief to locate official entry points and bounded jurisdictions; do not compare jurisdiction performance from rail presence.",
    place_system_dossier_ids: dossiers.map((record) => record.place_system_dossier_id),
    boundary: "Rail coverage is not completeness, equivalence, performance, or rank.", route: `/reference/state-of-frontier-systems/regions/${group.slug}/`
  });
}

const comparisonPairs = [
  ["energy", "chips-and-compute"], ["water", "agriculture-and-bioeconomy"], ["critical-minerals", "advanced-manufacturing"],
  ["aviation", "mobility"], ["space", "discovery-technologies"], ["ai-for-science", "cybersecurity"],
  ["quantum", "policy-and-standards"], ["climate", "finance-and-risk"], ["human-futures", "mobility"],
  ["water", "chips-and-compute"], ["energy", "climate"], ["advanced-manufacturing", "human-futures"]
];
for (const [index, [leftSlug, rightSlug]] of comparisonPairs.entries()) {
  const left = topicEditions.find((record) => record.slug === leftSlug);
  const right = topicEditions.find((record) => record.slug === rightSlug);
  editionRecords.push({
    edition_record_id: `188-RECORD-${String(25 + index).padStart(3, "0")}`, record_kind: "Bounded cross-system comparison", slug: `${leftSlug}-and-${rightSlug}`,
    title: `${topicById.get(left.topic_id).name} and ${topicById.get(right.topic_id).name}: conversion-boundary comparison`,
    topic_ids: [left.topic_id, right.topic_id], source_ids: unique([...left.source_ids, ...right.source_ids]),
    current_read: `The comparison aligns the two topics only at the shared questions of authority, implementation, acceptance, repeat operation, and outcome. Each topic retains its own entity, period, method, denominator, and evidence gaps.`,
    decision_use: "Identify where the two systems interact, then return to each underlying topic and named record before making a decision.",
    comparison_verdict: "Context only — no equivalence, causal finding, score, or rank",
    upstream_topic_edition_ids: [left.topic_edition_id, right.topic_edition_id],
    boundary: "A shared conversion vocabulary does not make different technologies, jurisdictions, projects, or outcomes directly comparable.",
    route: `/reference/state-of-frontier-systems/comparisons/${leftSlug}-and-${rightSlug}/`
  });
}

const p188 = {
  schema_version: "1.0", phase: 188, program_id: "FTFN-PHASE-188", dataset: "phase_188_state_of_frontier_systems_edition",
  title: "State of Frontier Systems Edition", effective_date: effectiveDate, record_status: "Built locally", build_status: "Complete — publication authority not exercised",
  summary: "Assemble a flagship synthesis, seventeen executive topic summaries, six regional orientations, and twelve bounded cross-system comparisons as a thirty-six-record reference edition.",
  publication_boundaries: boundaries,
  counts: { edition_records: 36, flagship_syntheses: 1, executive_topic_summaries: 17, regional_orientation_briefs: 6, bounded_comparisons: 12, causal_findings: 0, scores_or_ranks: 0 },
  routes: { hub: "/reference/state-of-frontier-systems/", public_export: "/data/phase-188-state-of-frontier-systems-edition.json" },
  edition_records: editionRecords,
  public_html_routes: unique(editionRecords.map((record) => record.route)),
  public_json_exports: ["/data/phase-188-state-of-frontier-systems-edition.json"]
};

const outputs = [
  ["phase-181-canonical-resource-map.json", p181],
  ["phase-182-evidence-source-backlog.json", p182],
  ["phase-183-missing-system-topic-missions.json", p183],
  ["phase-184-canonical-topic-edition-2.json", p184],
  ["phase-185-global-place-systems-atlas-i.json", p185],
  ["phase-186-named-delivery-case-atlas-ii.json", p186],
  ["phase-187-outcomes-longitudinal-observatory.json", p187],
  ["phase-188-state-of-frontier-systems-edition.json", p188]
];
for (const [name, value] of outputs) await writeJson(join(dataRoot, name), value);

const workPackages = [
  { phase: 181, slug: "canonical-resource-map", title: "Canonical Resource Map", objective: "Give every topic one preferred reader entry while preserving the exact authority of every upstream record.", delivered: ["Seventeen canonical topic resource contracts.", `An exhaustive first-match classification contract over the ${validatedBaselineRoutes} HTML routes in the validated Phase 180 baseline.`, "Exact joins to the encyclopedia, evidence review, living desk, roadmap, field guide, missions, projects, places, signals, and sources."], acceptance: ["Exactly one canonical entry exists per topic.", "No upstream evidence state or record identity changes.", "Every canonical entry exposes decisive evidence and claim boundaries."] },
  { phase: 182, slug: "evidence-source-backlog", title: "Evidence and Source Backlog", objective: "Make the entire open evidence shelf inspectable and assign a deterministic first operating batch without pretending to have adjudicated it.", delivered: ["All 285 In Review signals represented as route-ready backlog records.", "One hundred-record coverage-balanced first-pass cohort.", "Structural parsing of all 830 source profiles with zero network-currency claims."], acceptance: ["The 285 + 1,121 status split equals the 1,406-signal inventory.", "All declared source IDs resolve or are visibly flagged.", "Every decision field remains open."] },
  { phase: 183, slug: "missing-system-topic-missions", title: "Missing-System Topic Missions", objective: "Create serious receiving-system research programs for the four topics previously lacking local-system depth.", delivered: ["Four topic mission portfolios bound to sixteen priority missions.", "Eight named evidence cases bound to existing published signals and sources.", "A common local-system acceptance contract."], acceptance: ["Each topic has one portfolio and two cases.", "Every case retains its upstream claim boundary.", "No project, place, or outcome state is inferred."] },
  { phase: 184, slug: "canonical-topic-edition-2", title: "Canonical Topic Edition 2", objective: "Consolidate the strongest existing authored topic layers into seventeen definitive, evidence-bounded editions.", delivered: ["Seventeen topic editions.", "Sixty-eight horizon questions bound through the mission system.", "Project, place, source, comparison, and decision-use joins retained."], acceptance: ["All seventeen topics are unique and complete.", "Every edition binds its canonical resource and evidence review.", "No outcome or causal claim is introduced by synthesis."] },
  { phase: 185, slug: "global-place-systems-atlas-i", title: "Global Place Systems Atlas I", objective: "Build a globally distributed receiving-system orientation layer from official jurisdictional authority rails.", delivered: ["Eighteen jurisdiction-scale dossiers across seven regions.", "Seventy-two authority layers and exact source bindings.", "Explicit null place-stage, cause, score, and rank fields."], acceptance: ["Each dossier contains exactly four Phase 117 rails.", "Every source ID resolves to an existing profile.", "Rail presence is never presented as performance or completeness."] },
  { phase: 186, slug: "named-delivery-case-atlas-ii", title: "Named Delivery Case Atlas II", objective: "Create two transparent case-entry paths per topic: one international official rail and one existing named repository case.", delivered: ["Thirty-four case files, exactly two per topic.", "Seventeen international authority-to-delivery research cases.", "Seventeen repository-bound project or evidence cases."], acceptance: ["International cases assert no implementation stage.", "Existing project language is inherited without promotion.", "Every case declares its unresolved bridge and stop boundary."] },
  { phase: 187, slug: "outcomes-longitudinal-observatory", title: "Outcomes and Longitudinal Observatory", objective: "Prepare a broad measurement candidate shelf without fabricating the longitudinal series the repository does not yet possess.", delivered: ["Thirty-four candidate passports, two per topic.", "Two hundred and four explicit compatibility test cells.", "Zero observation values, admission decisions, or series IDs prefilled."], acceptance: ["Every passport is source and signal bound.", "All compatibility outcomes remain null pending real review.", "The Phase 138 zero-series state is preserved."] },
  { phase: 188, slug: "state-of-frontier-systems-edition", title: "State of Frontier Systems Edition", objective: "Turn the first seven phases into a coherent flagship reader edition without overstating what the evidence proves.", delivered: ["One flagship synthesis.", "Seventeen executive topic summaries and six regional orientations.", "Twelve context-only cross-system comparisons."], acceptance: ["The edition contains exactly thirty-six unique records and routes.", "Every comparison says context only.", "Publication and promotion authority remain separate and unexercised."] }
];

for (const wp of workPackages) {
  const markdown = `# Phase ${wp.phase} work package — ${wp.title}\n\n**State:** Complete locally — integration and publication remain separate  \n**Build date:** ${effectiveDate}\n\n## Objective\n\n${wp.objective}\n\n## Delivered\n\n${wp.delivered.map((item) => `- ${item}`).join("\n")}\n\n## Evidence boundaries\n\n${boundaries.map((item) => `- ${item}`).join("\n")}\n\n## Acceptance\n\n${wp.acceptance.map((item) => `- ${item}`).join("\n")}\n`;
  await writeFile(join(workPackagesRoot, `phase-${wp.phase}-${wp.slug}.md`), markdown, "utf8");
}

console.log(`Built Phase 181–188: ${canonicalTopicResources.length} canonical resources, ${backlogItems.length} backlog items, ${missionPortfolios.length}+${namedCaseFiles.length} missing-system records, ${topicEditions.length} topic editions, ${placeSystemDossiers.length} global dossiers, ${deliveryCaseFiles.length} delivery cases, ${candidatePassports.length} longitudinal passports, and ${editionRecords.length} edition records.`);
