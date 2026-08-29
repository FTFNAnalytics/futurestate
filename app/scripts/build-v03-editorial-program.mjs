import { readFile, readdir, writeFile } from "node:fs/promises";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const appRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const workspaceRoot = resolve(appRoot, "..");
const readJson = async (...parts) => JSON.parse(await readFile(join(...parts), "utf8"));
const writeJson = (path, value) => writeFile(path, JSON.stringify(value, null, 2) + "\n", "utf8");

const topicDirectory = join(appRoot, "src", "content", "topics");
const localDirectory = join(appRoot, "src", "content", "local-systems");
const topics = await Promise.all(
  (await readdir(topicDirectory)).filter((name) => name.endsWith(".json")).map((name) => readJson(topicDirectory, name)),
);
topics.sort((a, b) => a.name.localeCompare(b.name));

const scalar = (text, field) => text.match(new RegExp(`^${field}:\\s*"([^"]+)"`, "m"))?.[1] ?? "";
const list = (text, field) => {
  const block = text.match(new RegExp(`^${field}:\\s*\\n((?:  - .*\\n?)*)`, "m"))?.[1] ?? "";
  return [...block.matchAll(/^  - "([^"]+)"/gm)].map((match) => match[1]);
};
const localSystems = await Promise.all(
  (await readdir(localDirectory)).filter((name) => name.endsWith(".mdx")).map(async (name) => {
    const text = await readFile(join(localDirectory, name), "utf8");
    return {
      id: scalar(text, "id"),
      name: scalar(text, "name"),
      slug: scalar(text, "slug"),
      summary: scalar(text, "summary"),
      geography: scalar(text, "geography"),
      core_constraints: list(text, "core_constraints"),
      missing_data: list(text, "missing_data"),
    };
  }),
);
localSystems.sort((a, b) => a.name.localeCompare(b.name));

const projectRegistry = await readJson(appRoot, "src", "data", "phase-61-project-conversion-registry.json");
const projectEditorial = {
  "61-PROJECT-TSMC-ARIZONA": ["tsmc-arizona", "How a semiconductor announcement becomes an accepted, serviced and repeat-producing facility."],
  "61-PROJECT-TORONTO-24-254930": ["toronto-24-254930", "How a council decision moves through enactment, conditions, permitting, construction and occupancy."],
  "61-PROJECT-NOVA-LARGE-LOAD": ["northern-virginia-large-load", "How compute demand meets tariffs, transmission, local standards and metered service."],
  "61-PROJECT-SPACE-COAST-AUTHORITY": ["space-coast-authority-to-mission", "How site authority, environmental review and capital acceptance become recurring mission capacity."],
  "61-PROJECT-NEVADA-LITHIUM": ["nevada-lithium-to-qualified-material", "How authorized and financed projects become compliant, qualified and repeatedly accepted material supply."],
  "61-ADOPTION-GSA-PQC": ["gsa-pqc-adoption", "How a procurement path becomes a validated migration and a retired vulnerable system."],
  "61-ADOPTION-NIST-ARIA": ["nist-aria-assurance", "How an evaluation pilot becomes authorization, monitoring, correction and comparable mission evidence."],
  "61-ADOPTION-WAYMO-CALIFORNIA": ["waymo-california-service", "How operating authority becomes a stable public service, safety, access and reliability series."],
};
const casebooks = projectRegistry.records.map((record) => ({
  file_id: record.file_id,
  slug: projectEditorial[record.file_id][0],
  title: record.title,
  named_entity: record.named_entity,
  kind: record.kind,
  editorial_question: projectEditorial[record.file_id][1],
  canonical_briefing_id: record.canonical_briefing_id,
  local_system_ids: record.local_system_ids,
  source_ids: record.source_ids,
  signal_ids: record.signal_ids,
}));

const crossSystemStories = [
  ["compute-power-water", "Compute, power and water", ["topic-chips-and-compute", "topic-energy", "topic-water"], ["local-northern-virginia-data-center-corridor", "local-us-southwest-chip-corridor"], "What must be accepted and measured before announced compute or fab capacity becomes durable operating capacity?"],
  ["permission-to-operation", "Permission is not operation", ["topic-policy-and-standards", "topic-finance-and-risk", "topic-human-futures"], localSystems.map((item) => item.id), "Where do permits, tariffs, finance and local legitimacy stop—and what evidence begins the operating claim?"],
  ["standards-to-adoption", "Standards to adoption", ["topic-quantum", "topic-cybersecurity", "topic-policy-and-standards"], [], "Which inventories, procurements, tests, cutovers and retirements distinguish a published standard from completed adoption?"],
  ["autonomous-service-accountability", "Autonomous service and public accountability", ["topic-mobility", "topic-policy-and-standards", "topic-human-futures"], [], "Which exposure, service, accessibility, complaint and safety denominators make an operating autonomy claim publicly legible?"],
  ["research-to-assurance", "Research to assurance", ["topic-ai-for-science", "topic-discovery-technologies", "topic-cybersecurity"], [], "What separates a successful evaluation from authorization, continuous monitoring and changed mission outcomes?"],
  ["minerals-to-manufacturing", "Minerals to manufacturing", ["topic-critical-minerals", "topic-advanced-manufacturing", "topic-energy"], ["local-nevada-lithium-processing-corridor", "local-us-southwest-chip-corridor"], "Which construction, commissioning, qualification and customer-acceptance gates connect resources to dependable industrial supply?"],
  ["space-capacity-to-cadence", "Space capacity to mission cadence", ["topic-space", "topic-aviation", "topic-energy"], ["local-florida-space-coast-launch-corridor"], "How do site authority, range capacity, utilities and accepted assets become repeated missions rather than one-off milestones?"],
  ["housing-infrastructure-conversion", "Housing and infrastructure conversion", ["topic-human-futures", "topic-finance-and-risk", "topic-policy-and-standards"], ["local-ontario-real-estate"], "Which enactment, servicing, financing, construction and occupancy records reveal the distance between approvals and delivered homes?"],
  ["climate-water-industrial-resilience", "Climate, water and industrial resilience", ["topic-climate", "topic-water", "topic-advanced-manufacturing"], ["local-us-southwest-chip-corridor", "local-nevada-lithium-processing-corridor"], "Which local hazard, service and facility measurements connect climate context to actual industrial resilience?"],
  ["workforce-to-qualified-capacity", "Workforce to qualified capacity", ["topic-advanced-manufacturing", "topic-chips-and-compute", "topic-human-futures"], ["local-us-southwest-chip-corridor"], "How do training seats, completions, placements, retention and facility qualification combine into an evidenced capacity claim?"],
  ["finance-risk-and-infrastructure", "Finance, risk and infrastructure", ["topic-finance-and-risk", "topic-policy-and-standards", "topic-energy"], ["local-northern-virginia-data-center-corridor", "local-nevada-lithium-processing-corridor"], "When does financing reduce a conversion constraint, and when does it merely move the project to a new unresolved gate?"],
  ["observation-to-outcome", "Observation to outcome", ["topic-discovery-technologies", "topic-ai-for-science", "topic-climate"], [], "What denominator, recurrence, uncertainty and attribution work is required before observations support an outcome claim?"],
].map(([slug, title, topic_ids, local_system_ids, editorial_question], index) => ({
  story_id: `105-STORY-${String(index + 1).padStart(3, "0")}`,
  slug,
  title,
  topic_ids,
  local_system_ids,
  editorial_question,
  interpretation_boundary: "This story connects existing records for comparative reading. It creates no new evidence, causal conclusion, score, ranking or operating outcome.",
}));

const outcomeQuestions = {
  "61-PROJECT-TSMC-ARIZONA": "Can accepted utility service, facility qualification and recurring output be measured on compatible periods?",
  "61-PROJECT-TORONTO-24-254930": "Can enactment, permits, starts, completions and occupancy be observed without treating approval as delivery?",
  "61-PROJECT-NOVA-LARGE-LOAD": "Can accepted capacity, metered service, reliability and local effects be measured for named large-load assets?",
  "61-PROJECT-SPACE-COAST-AUTHORITY": "Can accepted capital, missions, utilization and reliability be observed with operator and period denominators?",
  "61-PROJECT-NEVADA-LITHIUM": "Can qualified lots, accepted shipments, environmental compliance and recurring output form a compatible series?",
  "61-ADOPTION-GSA-PQC": "Can inventories, cutovers, validated systems and vulnerable-system retirement be measured for a named agency?",
  "61-ADOPTION-NIST-ARIA": "Can authorization, monitoring, incidents, corrective action and mission performance be linked without over-attribution?",
  "61-ADOPTION-WAYMO-CALIFORNIA": "Can service exposure, rides, interventions, safety, accessibility and complaints be reported with stable definitions?",
};
const outcomes = casebooks.map((record) => ({
  file_id: record.file_id,
  slug: record.slug,
  title: record.title,
  outcome_question: outcomeQuestions[record.file_id],
}));

const journeys = casebooks.map((record, index) => ({
  journey_id: `110-JOURNEY-${String(index + 1).padStart(3, "0")}`,
  slug: record.slug,
  title: `${record.named_entity}: follow the evidence chain`,
  file_id: record.file_id,
  entry_question: record.editorial_question,
  stops: ["canonical summary", "verified chronology", "current decision boundary", "outcome measurement contract", "next decisive artifact"],
}));

const accessibleEditions = [
  ...topics.map((topic) => ({
    edition_id: `109-PLAIN-${topic.id.replace("topic-", "").toUpperCase()}`,
    slug: `plain-language-${topic.slug}`,
    title: `${topic.name} in plain language`,
    edition_type: "plain_language_topic",
    topic_id: topic.id,
    local_system_id: null,
    review_state: "Published",
  })),
  ...localSystems.map((system) => ({
    edition_id: `109-LOW-${system.id.replace("local-", "").toUpperCase()}`,
    slug: `low-bandwidth-${system.slug}`,
    title: `${system.name}: low-bandwidth field note`,
    edition_type: "low_bandwidth_place",
    topic_id: null,
    local_system_id: system.id,
    review_state: "Published",
  })),
];

const phaseRoutes = {
  "103": ["/review/", "/review/method/", ...topics.map((item) => `/review/topics/${item.slug}/`), ...localSystems.map((item) => `/review/places/${item.slug}/`)],
  "104": casebooks.map((item) => `/review/casebooks/${item.slug}/`),
  "105": crossSystemStories.map((item) => `/review/systems/${item.slug}/`),
  "106": outcomes.map((item) => `/review/outcomes/${item.slug}/`),
  "107": topics.map((item) => `/review/uncertainty/${item.slug}/`),
  "108": topics.map((item) => `/learn/${item.slug}/`),
  "109": accessibleEditions.map((item) => `/editions/${item.slug}/`),
  "110": ["/review/state-of-frontier-systems/", "/review/corrections/", "/review/freshness/", "/review/calendar/", ...journeys.map((item) => `/review/journeys/${item.slug}/`)],
};

const phaseMetadata = [
  [103, "Canonical review", "Synthesize the existing evidence shelf into 17 topic chapters, five place portraits, a public method and a common review hub."],
  [104, "Narrative casebooks", "Turn eight named project and adoption files into source-linked histories from authorization to operation."],
  [105, "Cross-system atlas", "Publish twelve evidence-bounded stories that make dependencies visible across topics and places."],
  [106, "Outcomes observatory", "Expose the eight measurement contracts, denominators and evidence gaps without manufacturing outcome claims."],
  [107, "Uncertainty library", "Give every topic a structured counterargument, competing-explanation and decisive-evidence reading page."],
  [108, "Civic learning edition", "Create seventeen topic modules with beginner, practitioner and expert reading paths."],
  [109, "Accessible editions", "Publish seventeen plain-language topic editions and five low-bandwidth place notes; hold translations for human review."],
  [110, "Living publication", "Establish the state report, correction log, freshness board, editorial calendar and eight evidence journeys."],
].map(([phase, title, content_goal]) => ({ phase, title, content_goal, status: "Complete", routes: phaseRoutes[String(phase)] }));

const program = {
  schema_version: "1.0",
  program_id: "FTFN-V0.3-EDITORIAL-PROGRAM",
  title: "FTFN v0.3 — The public knowledge edition",
  effective_date: "2026-08-29",
  record_status: "Published",
  summary: "An evidence-linked editorial layer that turns the existing signal, source, briefing, project, measurement and stewardship corpus into canonical reviews, narrative casebooks, cross-system stories, outcome observatories, uncertainty pages, learning modules, accessible editions and a living publication.",
  publication_boundaries: [
    "Every public page resolves existing evidence and preserves the status of its upstream records.",
    "No page creates a future receipt, advances a Phase 60 or Phase 61 gate, or converts a missing observation into an outcome.",
    "Cross-system stories are editorial reading frames, not causal findings, forecasts, recommendations, scores or rankings.",
    "French and Spanish translation briefs remain In Review until a qualified human reviewer signs off; no machine output is represented as reviewed translation.",
  ],
  counts: {
    phases_complete: 8,
    public_routes: Object.values(phaseRoutes).flat().length,
    canonical_topic_chapters: topics.length,
    local_system_portraits: localSystems.length,
    casebooks: casebooks.length,
    cross_system_stories: crossSystemStories.length,
    outcome_observatories: outcomes.length,
    uncertainty_pages: topics.length,
    learning_modules: topics.length,
    accessible_editions: accessibleEditions.length,
    living_publication_routes: phaseRoutes["110"].length,
  },
  phases: phaseMetadata,
  topics: topics.map((topic) => ({ id: topic.id, name: topic.name, slug: topic.slug })),
  local_systems: localSystems,
  casebooks,
  cross_system_stories: crossSystemStories,
  outcomes,
  journeys,
  accessible_editions: accessibleEditions,
  translation_pilots: [
    { pilot_id: "109-TRANSLATION-FR", language: "French", status: "In Review", publication_route: null, next_action: "Qualified human review of terminology, claims and links." },
    { pilot_id: "109-TRANSLATION-ES", language: "Spanish", status: "In Review", publication_route: null, next_action: "Qualified human review of terminology, claims and links." },
  ],
  editorial_calendar: [
    { cadence: "monthly", deliverable: "Freshness and correction review", next_due: "2026-09-30" },
    { cadence: "quarterly", deliverable: "Outcomes and casebook review", next_due: "2026-10-09" },
    { cadence: "annual", deliverable: "State of frontier systems edition", next_due: "2027-08-29" },
  ],
};

await writeJson(join(appRoot, "src", "data", "v03-editorial-program.json"), program);

const phaseUpdateDetails = {
  103: ["Canonical review turns the evidence shelf into a public reading layer", "Adds a common review hub, method, seventeen topic chapters and five place portraits; each chapter points back to existing sources and preserves unresolved questions."],
  104: ["Eight narrative casebooks follow named files from authority to operation", "Adds source-linked chronology, current-stage, unresolved-boundary and next-artifact views for five local projects and three adoption cases."],
  105: ["Twelve cross-system stories expose the dependency stack", "Adds comparative stories across compute, power, water, standards, mobility, assurance, minerals, space, housing, climate, workforce, finance and outcome evidence."],
  106: ["The outcomes observatory makes denominators and missing observations visible", "Adds eight file-level observatories that resolve existing cohort, specification and panel contracts without creating outcome claims or rankings."],
  107: ["The uncertainty library gives all seventeen topics a challenge surface", "Adds competing explanations, disconfirming-evidence prompts and decision-boundary guidance derived from each topic's constraints and watch questions."],
  108: ["Seventeen civic learning modules open three levels of entry", "Adds beginner, practitioner and expert reading paths, exercises and direct links to the canonical topic evidence."],
  109: ["Accessible editions add plain-language and low-bandwidth routes", "Publishes seventeen plain-language topic editions and five low-bandwidth place notes while keeping French and Spanish pilots unrouteable pending human review."],
  110: ["FTFN becomes a living publication with visible maintenance", "Adds the state report, correction log, freshness board, editorial calendar and eight evidence journeys with explicit monthly, quarterly and annual cadences."],
};
const phaseAffectedRecords = {
  103: [...topics.map((item) => item.id), ...localSystems.map((item) => item.id)],
  104: casebooks.map((item) => item.canonical_briefing_id),
  105: topics.map((item) => item.id),
  106: casebooks.map((item) => item.canonical_briefing_id),
  107: topics.map((item) => item.id),
  108: topics.map((item) => item.id),
  109: [...topics.map((item) => item.id), ...localSystems.map((item) => item.id)],
  110: casebooks.map((item) => item.canonical_briefing_id),
};
for (const phase of phaseMetadata) {
  const [title, summary] = phaseUpdateDetails[phase.phase];
  const update = {
    id: `update-2026-08-29-phase-${phase.phase}-v03-editorial-program`,
    effective_date: "2026-08-29",
    entry_type: "Source Refresh",
    title,
    summary,
    affected_record_ids: phaseAffectedRecords[phase.phase],
    related_paths: phase.routes,
    evidence_note: "This editorial release resolves existing Published evidence and bounded operating contracts. It creates no new source fact, future gate decision, receipt, observation, outcome, score or ranking.",
    materiality: "No record-state change",
    publication_effect: `Publishes ${phase.routes.length} Phase ${phase.phase} routes in the v0.3 editorial program.`,
    next_check_date: phase.phase === 110 ? "2026-09-30" : null,
    work_package: `docs/work-packages/phase-${phase.phase}-v03-${phase.title.toLowerCase().replaceAll(" ", "-")}.md`,
  };
  await writeJson(join(appRoot, "src", "content", "updates", `2026-08-29-phase-${phase.phase}-v03-${phase.title.toLowerCase().replaceAll(" ", "-")}.json`), update);
}

for (const phase of phaseMetadata) {
  const routeLines = phase.routes.map((route) => `- \`${route}\``).join("\n");
  const document = `# Phase ${phase.phase}: ${phase.title}\n\nStatus: Complete  \nCompleted: 2026-08-29  \nProgram: FTFN v0.3 — The public knowledge edition\n\n## Content goal\n\n${phase.content_goal}\n\n## Delivered\n\n- ${phase.routes.length} public routes backed by the shared v0.3 editorial registry.\n- Direct resolution to existing topic, local-system, project, event, gate, measurement, source and signal records where relevant.\n- Explicit evidence boundaries that prevent editorial synthesis from being mistaken for a new fact, decision, receipt, outcome, score or ranking.\n- A dated public update and inclusion in the release-verification contract.\n\n## Public routes\n\n${routeLines}\n\n## Acceptance boundary\n\nThis phase changes explanation, navigation and public utility. It does not operate a future evidence gate, predate an artifact, alter an upstream record status, create an observation, approve a translation, or manufacture a causal outcome.\n\n## Verification\n\n- \`npm run test:v03-editorial\`\n- \`npm run verify:v03-editorial\`\n- \`npm run check\`\n- \`npm run build\`\n- \`npm run verify:release\`\n`;
  await writeFile(join(workspaceRoot, "docs", "work-packages", `phase-${phase.phase}-v03-${phase.title.toLowerCase().replaceAll(" ", "-")}.md`), document, "utf8");
}

console.log(`Built FTFN v0.3 editorial program: ${program.counts.public_routes} public routes across Phases 103-110.`);
