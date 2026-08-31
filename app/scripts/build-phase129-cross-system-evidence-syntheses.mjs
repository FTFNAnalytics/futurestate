import { readFile, writeFile } from "node:fs/promises";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const appRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const workspaceRoot = resolve(appRoot, "..");
const dataRoot = join(appRoot, "src", "data");
const readJson = async (name) => JSON.parse(await readFile(join(dataRoot, name), "utf8"));
const words = (value) => String(value ?? "").trim().split(/\s+/).filter(Boolean).length;
const deepWords = (value) => {
  if (typeof value === "string") return words(value);
  if (Array.isArray(value)) return value.reduce((sum, item) => sum + deepWords(item), 0);
  if (value && typeof value === "object") return Object.values(value).reduce((sum, item) => sum + deepWords(item), 0);
  return 0;
};
const deduplicatedPassageWords = (values) => {
  const seen = new Set();
  let total = 0;
  for (const value of values) {
    for (const passage of String(value).split(/(?<=[.!?])\s+/u).map((item) => item.trim()).filter(Boolean)) {
      const fingerprint = passage.toLowerCase().replace(/[^a-z0-9]+/g, " ").trim();
      if (!seen.has(fingerprint)) {
        seen.add(fingerprint);
        total += words(passage);
      }
    }
  }
  return total;
};
const ngramRepeatRatio = (values, width = 8) => {
  const counts = new Map();
  let total = 0;
  for (const value of values) {
    const tokens = String(value).toLowerCase().match(/[a-z0-9]+/g) ?? [];
    for (let index = 0; index <= tokens.length - width; index += 1) {
      const gram = tokens.slice(index, index + width).join(" ");
      counts.set(gram, (counts.get(gram) ?? 0) + 1);
      total += 1;
    }
  }
  const repeated = [...counts.values()].reduce((sum, count) => sum + Math.max(0, count - 1), 0);
  return total ? repeated / total : 0;
};
const date = "2026-08-30";

const [dossiers, biographies, topicReviews] = await Promise.all([
  readJson("phase-123-comparative-delivery-dossiers.json"),
  readJson("phase-127-project-place-conversion-biographies.json"),
  readJson("phase-128-topic-state-of-evidence-reviews.json"),
]);

const topicReviewByTopic = new Map(topicReviews.topic_reviews.map((record) => [record.topic_id, record]));
const projectBioByAtlasId = new Map(biographies.project_biographies.map((record) => [record.atlas_project_id, record]));
const placeBioByAtlasId = new Map(biographies.place_biographies.map((record) => [record.atlas_place_id, record]));

const synthesisAngles = {
  "compute-power-water": {
    focus: "This system is best read as a service-acceptance problem around large, place-bound facilities. Compute and fabrication announcements become durable capacity only when electric, water and wastewater services, process qualification and repeated output resolve to the same campus.",
    tension: "The evidence is rich in tariffs, agreements, regional load and construction context but thin in customer-specific accepted capacity and metered facility operation. Regional evidence helps locate constraints while remaining inadmissible as a substitute for campus outcomes.",
    use: "A compatibility synthesis can show which records occupy analogous positions in the delivery chain and why the last accepted-service step remains decisive. It cannot compare megawatts, gallons, wafers, employment and economic value as one performance measure.",
    failure: "The most tempting error is to treat a utility territory, development agreement or reported construction milestone as proof that the complete facility is served, qualified and producing. Another is to transfer a regional constraint to an undisclosed customer allocation.",
    next: "The next review should seek facility-specific service acceptance, commissioning, qualification and repeated output, with separate denominators for power, water, process yield and receiver acceptance.",
  },
  "permission-to-operation": {
    focus: "The cases expose the boundary between a legal or administrative permission and the later physical and receiving-system events that make use possible. The useful common object is the evidence chain, not the substantive equivalence of the permissions.",
    tension: "Land-use files, environmental decisions, licenses, loans and agreements distribute authority differently and carry different conditions. Their dates may be precise while implementation, inspection, acceptance and recurring operation remain open.",
    use: "The synthesis helps readers ask the same disciplined question across unlike systems: what did this instrument authorize, for which entity, and what exact later record is still needed? It does not turn unlike legal instruments into a readiness scale.",
    failure: "A permission may be reported as construction, a financing commitment as delivery, or a project-wide decision as clearance of every condition. Those errors collapse stages and obscure the accountable institution for the next record.",
    next: "Follow each named file to its own enactment, condition clearance, permit, inspection, commissioning, occupancy, acceptance or repeated-use artifact, preserving the authority chain and date basis.",
  },
  "standards-to-adoption": {
    focus: "Standards and program rules become operational evidence only through a named receiving institution, configured system, test, acceptance and use record. The four cases illustrate different routes from a rule or framework toward adoption.",
    tension: "Cryptographic migration, AI assurance, broadband delivery and autonomous service use different authorities, users and acceptance criteria. They share a research question about institutional uptake but no common unit of adoption or operating success.",
    use: "The synthesis can compare where an adoption chain stops and whether a stable receiving-system identity is present. It cannot infer implementation from publication or compare the pace of unlike programs.",
    failure: "The central error is substituting availability, guidance or an evaluation method for completed adoption. Counts of eligible locations, standards, pilot participants or service authority can look comparable while referring to entirely different populations.",
    next: "Seek named inventories, procurements, configurations, test results, cutovers, active users and repeated exception records, each tied to the responsible institution and a stable denominator.",
  },
  "autonomous-service-accountability": {
    focus: "Passenger-facing mobility becomes accountable when operating geography, service exposure, access, exceptions, safety events and user experience can be read together without losing fleet or station identity.",
    tension: "Autonomous-vehicle reporting emphasizes permits, miles and incident records, while rail accessibility reporting emphasizes station inventories and project completion. Both expose service questions, but their units and responsible institutions are different.",
    use: "The synthesis is valuable as a comparison of public-accountability architecture. It shows which fields a reader would need for each mode without suggesting that miles, stations, riders or recalls belong in one score.",
    failure: "A recall can be mistaken for a fleet-wide risk rate, testing miles for commercial service, or project completion for reliable accessibility in use. Aggregate reporting can also hide geography and asset-level exceptions.",
    next: "Build separate stable series for service quantity, exposure-adjusted incidents, accessibility use, uptime, complaints and remedy completion, retaining operator, fleet, station, geography and period.",
  },
  "research-to-assurance": {
    focus: "Research and technical evaluation matter operationally when a named institution accepts the method, deploys a bounded configuration and records performance, exceptions and corrective action over time.",
    tension: "Evaluation pilots, standards, procurement guidance and service programs can all be described as progress, yet they occupy different positions between research and operating assurance. Their success criteria and evidence owners are not interchangeable.",
    use: "The synthesis can compare the completeness of assurance chains and identify the missing receiving-system records. It remains context-only because no common effect size, authorization status or mission denominator exists.",
    failure: "A well-designed pilot may be generalized beyond its applications, a procurement path treated as deployment, or a policy deadline treated as a completed migration. Those substitutions erase both test scope and institutional acceptance.",
    next: "Seek system-specific evaluation, authorization, deployed configuration, continuous monitoring, incident handling, corrective action and mission-use records with explicit version and method boundaries.",
  },
  "minerals-to-manufacturing": {
    focus: "The system follows physical material and industrial capability from resource and permission through processing, qualification, receiver acceptance and repeated production. Identity must survive every handoff.",
    tension: "Mineral resources, permitted tonnes, refined product, semiconductor wafers and manufactured units use different specifications and denominators. Public records are strongest at authorization and program context and weaker at qualified output.",
    use: "The synthesis helps readers compare the location of open gates in a conversion chain. It does not compare productivity or strategic value across industries and does not infer downstream capacity from upstream resource potential.",
    failure: "Permitted or financed capacity may be reported as supply, a construction milestone as qualified production, or a customer announcement as repeated receipt. Material-specification changes can silently break the chain.",
    next: "Acquire commissioning, process-qualification, customer-acceptance and recurring lot or unit records, with specification, yield, interruption and delivery fields tied to the same asset and period.",
  },
  "space-capacity-to-cadence": {
    focus: "This system asks when authorized infrastructure and delivered assets become repeatable mission capacity. Acceptance, support availability, asset readiness and completed missions all matter, but they do not share one measure.",
    tension: "Launch sites, combat aircraft delivery and tanker readiness carry different assets, missions, oversight methods and periods. Each has evidence of enabling capacity alongside unresolved operating or availability questions.",
    use: "The synthesis compares evidence positions—authority, delivery, acceptance, support and repeat mission—while preserving the distinct mission system. It offers no cross-platform readiness judgment.",
    failure: "Delivered aircraft can be equated with available fleet capability, environmental authority with usable launch capacity, or an individual milestone with cadence. National activity counts can also be transferred improperly to one site.",
    next: "Seek named asset acceptance, support-system availability, downtime, mission completion and exception records for stable vehicle, fleet, site and reporting periods.",
  },
  "housing-infrastructure-conversion": {
    focus: "The cases show how local authority, servicing, finance and construction capacity have to converge before an approved site becomes occupied housing or a functioning industrial facility.",
    tension: "Dwelling units, data-center load and fabrication capacity are substantively different outputs. Their land-use and utility gates can be examined using a shared delivery vocabulary, but their performance and public value cannot be normalized.",
    use: "The synthesis makes sequential local gates and accountable authorities visible. It lets readers compare evidence structure without implying that approvals, investments or unit counts measure equivalent delivery.",
    failure: "An application can be mistaken for enacted authority, zoning for permit clearance, servicing plans for completed connections, or regional housing and load statistics for a named project's outcome.",
    next: "Follow each site to enacted instruments, cleared conditions, permits, completed servicing, inspections, occupancy or accepted facility service, with project identity preserved throughout.",
  },
  "climate-water-industrial-resilience": {
    focus: "Industrial resilience requires a named asset, hazard or resource exposure, operating baseline, interruption and recovery account. Plans and environmental context identify risk but do not measure resilience by themselves.",
    tension: "Water agreements, safety events, climate context and industrial operation refer to different phenomena and periods. The cases reveal how much local evidence exists without supplying a shared resilience denominator.",
    use: "The synthesis can compare whether each file exposes the evidence needed to trace exposure through interruption and recovery. It cannot blend hazards, resource use and output into a resilience score.",
    failure: "A regional hazard projection may be assigned to a facility, a mitigation condition treated as successful protection, or continued operation treated as proof that risk was low. Missing interruption data may be read incorrectly as uninterrupted service.",
    next: "Seek site-level resource use, hazard exposure, interruption, recovery, mitigation performance and repeated operation with asset identity, observation period and revision history.",
  },
  "workforce-to-qualified-capacity": {
    focus: "The system asks how training and employment connect to qualified roles, processes, receiver-accepted output and retention at a named facility. Headcount alone does not establish productive capacity.",
    tension: "Graduates, current employees, jobs created or retained, units delivered and availability use different populations and attribution rules. Existing records identify important workforce activity but rarely join it to line qualification and output.",
    use: "The synthesis compares where the workforce-to-output bridge is visible or absent. It does not rank employers, training systems or facilities and does not attribute production changes to workforce programs.",
    failure: "A training enrollment may be treated as placement, employment as qualification, or a facility output claim as evidence that a workforce intervention caused the result. Time windows are often mismatched.",
    next: "Acquire role-level qualification, placement and retention records joined to equipment or line qualification, accepted output, yield and delivery cadence for the same facility and period.",
  },
  "finance-risk-and-infrastructure": {
    focus: "Finance removes one delivery constraint only when a named commitment becomes expenditure, physical completion, acceptance and service under an explicit allocation of risk.",
    tension: "Loans, utility investments, tariffs, storage capacities and public obligations have different valuation dates, conditions and counterparties. They can be placed in delivery chains without becoming comparable returns or project-quality measures.",
    use: "The synthesis helps readers distinguish financial authority and commitment from realized infrastructure. It preserves risk-allocation questions while refusing a capital-value ranking.",
    failure: "Announced investment can be conflated with obligated or disbursed funds, financial close with construction, and installed nameplate with accepted service. Nominal values and contingent liabilities can also be compared without adjustment.",
    next: "Join each instrument to disbursement, expenditure, delivered scope, acceptance, service performance and disclosed risk allocation, preserving currency, date, term and counterparty.",
  },
  "observation-to-outcome": {
    focus: "The system examines the disciplined transition from a dated observation to an outcome claim. Identity, method, period, denominator, recurrence, uncertainty and alternative explanations all have to survive that transition.",
    tension: "Stations, waste batches, broadband locations, production units and evaluation results are deliberately non-equivalent. Each file contains observations and explicit holds, making the comparison methodologically rich but numerically incompatible.",
    use: "The synthesis shows how evidence should advance—or stop—when outcome requirements are not met. It is a teaching and review layer, not a meta-outcome or a ranking of evidence quality.",
    failure: "A single milestone can be called a trend, a deployment count a benefit, or a repeated inventory an operating-quality series. Incompatible revisions may also be spliced to create artificial direction.",
    next: "Seek repeated compatible measures for stable entities and periods, preserve revisions and uncertainty, and apply an attribution design suited to each claim rather than one universal method.",
  },
};

function dimensionDeterminations({ dossier, projectBios, placeBios }) {
  const projectNames = projectBios.map((record) => record.title).join(", ") || "no named project biography";
  const placeNames = placeBios.map((record) => record.title).join(", ") || "no named place biography";
  const evidenceLabel = `${dossier.evidence_signal_ids.length} Published-signal links and ${dossier.evidence_source_ids.length} source links`;
  return [
    {
      dimension_id: "identity",
      label: "Identity compatibility",
      state: "Context only",
      determination: `The synthesis resolves ${projectBios.length} project biographies (${projectNames}) and ${placeBios.length} place biographies (${placeNames}) through exact Phase 127 and Phase 123 IDs. That makes the cases compatible for examining how evidence identity is maintained across delivery chains. It does not make the entities equivalent. Organization, asset, program, corridor and receiving-system boundaries remain attached to every inherited record, and the ${evidenceLabel} are copied without expansion.`,
      incompatibility: "Nearby organizations, regions, technologies and projects cannot be merged because they share a topic, institution or geography. A place biography does not inherit one project stage, and a project event does not establish the state of the surrounding place.",
      next_review: "Verify canonical entity, alias, asset and receiving-system identity before interpreting any new artifact; reject unresolved or silently merged identities.",
    },
    {
      dimension_id: "stage",
      label: "Stage compatibility",
      state: "Context only",
      determination: `Project biographies retain their exact inherited current-stage text, while place biographies retain a system state and never receive a synthetic conversion stage. The cases are compatible for asking where authority, commitment, implementation, validation, acceptance, recurrence or outcome evidence would sit. They are not compatible for declaring one common stage. The synthesis therefore treats an apparent stage analogy as a research aid only and does not modify a Phase 119, 121, 123, 126 or 127 record.`,
      incompatibility: "Permission cannot stand in for implementation; delivery cannot stand in for receiving-party acceptance; and a first event cannot stand in for repeated operation or outcome. Place context cannot be promoted to a project-stage decision.",
      next_review: "Follow the exact next record named by each biography and apply the stage-specific evidence contract independently before any later dated change.",
    },
    {
      dimension_id: "geography",
      label: "Geographic compatibility",
      state: "Context only",
      determination: `The named place biographies make jurisdiction, service territory, corridor and local receiving-system scope visible. Geography is compatible for locating authority and infrastructure dependencies and for identifying which public body may hold the next record. It is not a common outcome denominator. National or regional context remains context when the claim concerns a facility, route, station, fleet or customer. A project located within a place does not represent every resident, asset or institution in that place.`,
      incompatibility: "National totals, regional forecasts, provider portfolios and local project records have different coverage. They may not be transferred, averaged or normalized without a source-defined geographic crosswalk.",
      next_review: "Require every new quantity to name the geography, eligible population or service territory and document any boundary change before comparison.",
    },
    {
      dimension_id: "period",
      label: "Period compatibility",
      state: "Context only",
      determination: `Every inherited signal and source keeps its own publication, capture, observation and revision dates. The files are compatible for constructing a chronology and locating the sequence of decisions or observations. They are not automatically compatible for a trend because the periods may be asynchronous, differently revised or governed by different reporting calendars. A later event can test an earlier interpretation, but it does not silently rewrite the earlier source. Missing periods remain visible rather than being interpolated.`,
      incompatibility: "Point-in-time decisions, fiscal-year reports, monthly operations, multi-year plans and undated portal states cannot be treated as one observation window. Publication date cannot substitute for the measured period.",
      next_review: "Record observation start and end, release and capture dates, revision status and series breaks; compare direction only inside demonstrably compatible periods.",
    },
    {
      dimension_id: "denominator_and_method",
      label: "Denominator and method compatibility",
      state: "Context only",
      determination: `No shared performance denominator or common causal method has been admitted. The cases are compatible for comparing evidence architecture, missing fields and stopping rules. Their quantities remain in source-defined units with the original entity, population, method, exclusions and uncertainty. The exact ${evidenceLabel} remain the complete Phase 123 evidence shelf; this synthesis adds interpretation but no observation, normalization, effect size, causal estimate, score or rank.`,
      incompatibility: "Counts, capacity, cost, rates, service measures and qualitative states cannot be pooled merely because they describe delivery. Self-report, administrative count, audit, modeled estimate and regulatory decision are different evidence methods.",
      next_review: "Admit a comparison only after unit, denominator, method, exclusion, uncertainty and revision compatibility are decided field by field; otherwise retain Context only.",
    },
  ];
}

function authoredSections({ dossier, projectBios, placeBios, topicReviewRecords, angle }) {
  return {
    synthesis_read: `${angle.focus} Phase 129 begins from the Phase 123 dossier rather than from a fresh search. Its exact ${dossier.evidence_signal_ids.length} Published-signal links and ${dossier.evidence_source_ids.length} source links remain the full evidence shelf. The new layer reads that shelf beside ${projectBios.length} project and ${placeBios.length} place biographies and ${topicReviewRecords.length} topic reviews. These joins improve navigation and interpretation but do not add evidence. The controlling verdict remains exactly “Context only.” ${dossier.shared_dependency} That shared dependency is an editorial statement about the structure of delivery, not a common performance result or causal explanation.`,
    compatible_reading: `${dossier.what_is_comparable} ${angle.use} Compatibility here means that readers can ask parallel questions about identity, authority, stage, geography, time and measurement. It does not mean that the answers share units. Exact IDs matter because they prevent a nearby organization, jurisdiction or aggregate from standing in for the named asset or receiving system. The five determinations therefore describe what can be learned together and where the comparison must stop. None advances a mission, project or place. None changes a biography's inherited stage or state.`,
    incompatible_reading: `${dossier.what_must_not_be_compared} ${angle.tension} Incompatibility is a substantive result and should remain visible. It may arise because cases refer to different entities, stages, geographies, periods, denominators or methods. It may also arise because a record is an authority, plan, self-report, administrative count or audit rather than an operating observation. The synthesis never repairs these differences with an estimated conversion, composite index or qualitative score. It does not infer that missing evidence is unavailable outside the current corpus, and it does not turn the strength of an evidence trail into a judgment about project performance.`,
    failure_modes: `${angle.failure} A second failure mode is temporal: later information can be attached to the wrong observation period or used to erase an earlier boundary. A third is causal: a shared dependency may be mistaken for an explanation of an outcome. Phase 129 retains all three protections. Every case keeps its identity, every stage keeps its own evidence contract, every geography and period remains named, and every quantity retains its method and denominator. If one of those fields cannot be reconciled, the comparison stays Context only. That stopping rule is more informative than a forced ranking because it names the record that would change the review.`,
    next_research: `${dossier.decisive_next_evidence} ${angle.next} That work should proceed through the existing topic-review research tiers: mission-decisive records first, bridge evidence second and context maintenance third. The sequence is editorial and non-numeric. It does not estimate which system will succeed or prescribe investment or policy. A future update may revise a compatibility determination only after the exact artifact is reviewed, its provenance and measurement contract are recorded, and the underlying mission or conversion state changes through its own authorized process. Until then, this synthesis provides a transparent reading path across unlike systems while retaining the original evidence sets and verdict.`,
  };
}

const syntheses = dossiers.dossiers.map((dossier, index) => {
  const angle = synthesisAngles[dossier.slug];
  if (!angle) throw new Error(`Phase 129 lacks authored synthesis angle ${dossier.slug}`);
  const projectBios = dossier.atlas_project_ids.map((id) => projectBioByAtlasId.get(id));
  const placeBios = dossier.atlas_place_ids.map((id) => placeBioByAtlasId.get(id));
  if ([...projectBios, ...placeBios].some((record) => !record)) throw new Error(`Phase 129 cannot resolve Phase 127 biographies for ${dossier.dossier_id}`);
  const topicReviewRecords = dossier.topic_ids.map((id) => topicReviewByTopic.get(id));
  if (topicReviewRecords.some((record) => !record)) throw new Error(`Phase 129 cannot resolve topic reviews for ${dossier.dossier_id}`);
  const sections = authoredSections({ dossier, projectBios, placeBios, topicReviewRecords, angle });
  const determinations = dimensionDeterminations({ dossier, projectBios, placeBios });
  const authoredWordCount = deepWords(sections) + deepWords(determinations.map(({ determination, incompatibility, next_review }) => ({ determination, incompatibility, next_review })));
  if (authoredWordCount < 800) throw new Error(`${dossier.dossier_id} has only ${authoredWordCount} authored Phase 129 words.`);
  return {
    synthesis_id: `129-SYNTHESIS-${String(index + 1).padStart(3, "0")}`,
    dossier_id: dossier.dossier_id,
    legacy_story_id: dossier.legacy_story_id,
    slug: dossier.slug,
    title: `${dossier.title} evidence compatibility synthesis`,
    record_status: "Published",
    synthesis_state: "Compatibility interpreted — upstream evidence and decisions unchanged",
    verdict: dossier.comparison_passport.verdict,
    topic_ids: [...dossier.topic_ids],
    exact_joins: {
      topic_review_ids: topicReviewRecords.map((record) => record.review_id),
      project_biography_ids: projectBios.map((record) => record.biography_id),
      place_biography_ids: placeBios.map((record) => record.biography_id),
    },
    evidence_signal_ids: [...dossier.evidence_signal_ids],
    evidence_source_ids: [...dossier.evidence_source_ids],
    authored_sections: sections,
    compatibility_determinations: determinations,
    authored_word_count: authoredWordCount,
    word_count_basis: "Rendered authored-layer analysis only; excludes route shell, identity and boundary fields, but includes recurring structural sentences disclosed in aggregate repetition metrics.",
    route: dossier.route,
    interpretation_boundary: "This synthesis retains the exact Context only verdict and evidence sets. It does not change a mission, audit, biography, project, place or conversion stage; normalize performance; infer causation; or create an observation, outcome, recommendation, score or rank.",
  };
});

const newHtmlRoutes = ["/review/fieldbook/system-reviews/"];
const enhancedExistingRoutes = dossiers.dossiers.map((record) => record.route);
const publicJsonExports = ["/data/phase-129-cross-system-evidence-syntheses.json"];
const analysisPassages = syntheses.flatMap((record) => [
  ...Object.values(record.authored_sections),
  ...record.compatibility_determinations.flatMap(({ determination, incompatibility, next_review }) => [determination, incompatibility, next_review]),
]);
const registry = {
  schema_version: "1.0",
  program_id: "FTFN-PHASE-129-CROSS-SYSTEM-EVIDENCE-SYNTHESES",
  phase: 129,
  title: "Cross-system evidence compatibility syntheses",
  effective_date: date,
  record_status: "Published",
  status: "Complete",
  summary: "Twelve cross-system syntheses publish sixty explicit identity, stage, geography, period, and denominator-and-method determinations while preserving Phase 123's exact evidence sets and Context only verdicts.",
  publication_boundary: "Phase 129 is an overlay-only compatibility reading. It adds no evidence, common denominator, stage decision, mission answer, outcome, causal finding, recommendation, score or rank.",
  counts: {
    syntheses: syntheses.length,
    compatibility_determinations: syntheses.reduce((sum, record) => sum + record.compatibility_determinations.length, 0),
    evidence_signal_links: syntheses.reduce((sum, record) => sum + record.evidence_signal_ids.length, 0),
    evidence_source_links: syntheses.reduce((sum, record) => sum + record.evidence_source_ids.length, 0),
    topic_reviews_linked: new Set(syntheses.flatMap((record) => record.exact_joins.topic_review_ids)).size,
    project_biographies_linked: new Set(syntheses.flatMap((record) => record.exact_joins.project_biography_ids)).size,
    place_biographies_linked: new Set(syntheses.flatMap((record) => record.exact_joins.place_biography_ids)).size,
    authored_words: syntheses.reduce((sum, record) => sum + record.authored_word_count, 0),
    deduplicated_authored_words: deduplicatedPassageWords(analysisPassages),
    authored_8gram_repeat_ratio: Number(ngramRepeatRatio(analysisPassages).toFixed(4)),
    minimum_authored_words_per_synthesis: Math.min(...syntheses.map((record) => record.authored_word_count)),
    new_html_routes: newHtmlRoutes.length,
    enhanced_existing_routes: enhancedExistingRoutes.length,
    public_surfaces: newHtmlRoutes.length + enhancedExistingRoutes.length,
    public_json_exports: publicJsonExports.length,
  },
  dimension_contract: {
    ordered_dimensions: ["identity", "stage", "geography", "period", "denominator_and_method"],
    verdict: "Context only",
    boundary: "Determinations describe compatibility for interpretation; they never normalize, score, rank, recommend or infer causation or performance.",
  },
  routes: { index: newHtmlRoutes[0], public_export: publicJsonExports[0] },
  new_html_routes: newHtmlRoutes,
  enhanced_existing_routes: enhancedExistingRoutes,
  public_json_exports: publicJsonExports,
  syntheses,
};

const update = {
  id: "update-2026-08-30-phase-129-cross-system-evidence-syntheses",
  effective_date: date,
  entry_type: "Source Refresh",
  title: "Phase 129 publishes twelve cross-system compatibility syntheses",
  summary: `The Open Evidence Review adds ${registry.counts.syntheses} long-form system syntheses and ${registry.counts.compatibility_determinations} determinations across the exact ${registry.counts.evidence_signal_links} Published-signal and ${registry.counts.evidence_source_links} source links inherited from Phase 123.`,
  affected_record_ids: syntheses.map((record) => record.dossier_id),
  related_paths: [...newHtmlRoutes, ...enhancedExistingRoutes, ...publicJsonExports],
  evidence_note: registry.publication_boundary,
  materiality: "No record-state change",
  publication_effect: "Adds one system-review hub, enhances twelve existing system routes and exposes one direct schema-1.0 JSON export.",
  next_check_date: null,
  work_package: "docs/work-packages/phase-129-v06-cross-system-evidence-syntheses.md",
};

const workPackage = `# Phase 129 — Cross-System Evidence Compatibility Syntheses\n\n**Status:** Complete  \n**Effective date:** ${date}  \n**Program:** FTFN v0.6 — Open Evidence Review\n\n## Purpose\n\nAdd a long-form compatibility reading to every Phase 123 dossier while preserving the evidence shelf and the exact Context only verdict.\n\n## Delivered\n\n- ${registry.counts.syntheses} syntheses, one for every Phase 123 dossier.\n- Exactly ${registry.counts.compatibility_determinations} determinations: identity, stage, geography, period, and denominator and method for every system.\n- Exact per-dossier and aggregate equality with Phase 123's ${registry.counts.evidence_signal_links} Published-signal links and ${registry.counts.evidence_source_links} source links.\n- Exact joins to ${registry.counts.topic_reviews_linked} Phase 128 topic reviews, ${registry.counts.project_biographies_linked} project biographies and ${registry.counts.place_biographies_linked} place biographies.\n- ${registry.counts.authored_words.toLocaleString("en-US")} rendered authored-layer words and ${registry.counts.deduplicated_authored_words.toLocaleString("en-US")} exact-passage-deduplicated words; the smallest rendered synthesis contains ${registry.counts.minimum_authored_words_per_synthesis.toLocaleString("en-US")} words. Route shells, identity and boundary fields are excluded; recurring structural sentences remain in the rendered count and are disclosed by an eight-gram repeat ratio of ${registry.counts.authored_8gram_repeat_ratio}.\n- One new hub, twelve enhanced existing system routes and one direct schema-1.0 JSON export.\n\n## Compatibility boundary\n\nEvery verdict remains exactly Context only. The five determinations identify where evidence can be interpreted in parallel and where entity, stage, geography, period, denominator or method differences require the comparison to stop. They do not create a common measure, causal conclusion, outcome, score or performance rank.\n\n## Completion standard\n\nPhase 129 is complete when all twelve dossiers resolve one-to-one, every synthesis contains the five ordered dimensions, signal and source arrays are exact copies of the corresponding Phase 123 arrays, all sixty determinations retain Context only, biography and topic-review joins are exact, every synthesis exceeds 800 rendered authored-layer words outside route and boundary scaffolding, rendered, exact-passage-deduplicated and repeat-ratio metrics are reproducible, and no upstream or future-gate state changes.\n`;

await Promise.all([
  writeFile(join(dataRoot, "phase-129-cross-system-evidence-syntheses.json"), `${JSON.stringify(registry, null, 2)}\n`, "utf8"),
  writeFile(join(appRoot, "src", "content", "updates", "2026-08-30-phase-129-cross-system-evidence-syntheses.json"), `${JSON.stringify(update, null, 2)}\n`, "utf8"),
  writeFile(join(workspaceRoot, "docs", "work-packages", "phase-129-v06-cross-system-evidence-syntheses.md"), workPackage, "utf8"),
]);

console.log(`Phase 129 built: ${registry.counts.syntheses} syntheses, ${registry.counts.compatibility_determinations} determinations, ${registry.counts.evidence_signal_links} signal links, ${registry.counts.evidence_source_links} source links, ${registry.counts.authored_words} rendered / ${registry.counts.deduplicated_authored_words} deduplicated analysis words; minimum ${registry.counts.minimum_authored_words_per_synthesis}.`);
