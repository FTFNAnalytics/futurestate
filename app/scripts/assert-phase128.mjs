import { readFile } from "node:fs/promises";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const appRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const readJson = async (name) => JSON.parse(await readFile(join(appRoot, "src", "data", name), "utf8"));
const failures = [];
const check = (condition, message) => { if (!condition) failures.push(message); };
const setEqual = (left, right) => Array.isArray(left) && Array.isArray(right) && left.length === right.length && left.every((item) => new Set(right).has(item));
const orderedEqual = (left, right) => Array.isArray(left) && Array.isArray(right) && left.length === right.length && left.every((item, index) => item === right[index]);
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

const [registry, notes, audits, biographies, dossiers, workbenches, missions, packets, operatingCycle] = await Promise.all([
  readJson("phase-128-topic-state-of-evidence-reviews.json"),
  readJson("phase-125-evidence-annotation-ledger.json"),
  readJson("phase-126-mission-evidence-audits.json"),
  readJson("phase-127-project-place-conversion-biographies.json"),
  readJson("phase-123-comparative-delivery-dossiers.json"),
  readJson("phase-124-topic-research-workbenches.json"),
  readJson("phase-121-priority-research-missions.json"),
  readJson("phase-120-evidence-acquisition-packets.json"),
  readJson("phase-60-operating-cycle.json"),
]);

const noteById = new Map(notes.evidence_annotations.map((record) => [record.note_id, record]));
const auditById = new Map(audits.mission_audits.map((record) => [record.audit_id, record]));
const auditByMissionId = new Map(audits.mission_audits.map((record) => [record.mission_id, record]));
const projectBioByAtlasId = new Map(biographies.project_biographies.map((record) => [record.atlas_project_id, record]));
const placeBioByAtlasId = new Map(biographies.place_biographies.map((record) => [record.atlas_place_id, record]));
const dossierById = new Map(dossiers.dossiers.map((record) => [record.dossier_id, record]));
const workbenchById = new Map(workbenches.workbenches.map((record) => [record.workbench_id, record]));
const missionById = new Map(missions.missions.map((record) => [record.mission_id, record]));
const expectedTierOrder = ["Mission-decisive", "Bridge evidence", "Context maintenance"];

check(registry.schema_version === "1.0" && registry.program_id === "FTFN-PHASE-128-TOPIC-STATE-OF-EVIDENCE-REVIEWS" && registry.status === "Complete", "Phase 128 identity, schema or status is invalid.");
check(registry.topic_reviews.length === 17 && registry.counts.topic_reviews === 17, "Phase 128 must contain exactly seventeen topic reviews.");
check(registry.counts.horizon_reviews === 68, "Phase 128 must report exactly sixty-eight horizon reviews.");
check(orderedEqual(registry.topic_reviews.map((record) => record.workbench_id), workbenches.workbenches.map((record) => record.workbench_id)), "Phase 128 must preserve exact Phase 124 workbench order.");
check(orderedEqual(registry.topic_reviews.map((record) => record.topic_id), workbenches.workbenches.map((record) => record.topic_id)), "Phase 128 topic IDs must be set-equal and order-equal to Phase 124.");
check(registry.new_html_routes.length === 1 && registry.new_html_routes[0] === "/review/fieldbook/topic-reviews/", "Phase 128 must expose the fixed topic-review hub.");
check(orderedEqual(registry.enhanced_existing_routes, workbenches.workbenches.map((record) => record.route)), "Phase 128 enhanced routes must exactly equal the seventeen Phase 124 workbench routes.");
check(registry.public_json_exports.length === 1 && registry.public_json_exports[0] === "/data/phase-128-topic-state-of-evidence-reviews.json", "Phase 128 public export route is invalid.");
check(orderedEqual(registry.research_value_contract.tier_order, expectedTierOrder) && /not a performance/.test(registry.research_value_contract.forbidden_reading), "Phase 128 research-value ordering must be explicit and non-performance.");

const allHorizonSections = [];
const analysisPassages = [];
const authoredFingerprints = new Set();
let authoredWords = 0;
for (const review of registry.topic_reviews) {
  const workbench = workbenchById.get(review.workbench_id);
  check(Boolean(workbench), `${review.review_id} references an unknown workbench.`);
  if (!workbench) continue;
  check(review.topic_id === workbench.topic_id && review.slug === workbench.slug && review.route === workbench.route, `${review.review_id} does not preserve workbench identity.`);
  check(review.review_state === "Open evidence review — missions remain unadjudicated", `${review.review_id} has an invalid review state.`);
  check(review.topic_sequence.sequence_basis === "Phase 124 canonical workbench order" && /not a topic, funding, importance or performance ranking/.test(review.topic_sequence.ordering_boundary), `${review.review_id} lacks the explicit non-ranking sequence boundary.`);
  check(review.horizon_sections.length === 4, `${review.review_id} must contain four horizon sections.`);
  const expectedMissionIds = workbench.mission_links.map((record) => record.mission_id);
  check(orderedEqual(review.horizon_sections.map((record) => record.mission_id), expectedMissionIds), `${review.review_id} horizon missions must preserve Phase 124 order.`);
  const expectedAudits = expectedMissionIds.map((id) => auditByMissionId.get(id));
  check(expectedAudits.every(Boolean), `${review.review_id} cannot resolve all four Phase 126 audits.`);
  check(orderedEqual(review.exact_joins.mission_audit_ids, expectedAudits.map((record) => record?.audit_id)), `${review.review_id} audit joins are not exact.`);
  const expectedNoteIds = [...new Set(expectedAudits.flatMap((record) => record?.evidence_note_ids ?? []))];
  check(setEqual(review.exact_joins.evidence_note_ids, expectedNoteIds), `${review.review_id} evidence-note union is not exact.`);
  check(review.exact_joins.evidence_note_ids.every((id) => noteById.has(id)), `${review.review_id} contains an unresolved Phase 125 note.`);
  const expectedProjectBios = workbench.project_links.map((record) => projectBioByAtlasId.get(record.atlas_project_id));
  const expectedPlaceBios = workbench.place_links.map((record) => placeBioByAtlasId.get(record.atlas_place_id));
  check([...expectedProjectBios, ...expectedPlaceBios].every(Boolean), `${review.review_id} cannot resolve all expected Phase 127 biographies.`);
  check(setEqual(review.exact_joins.project_biography_ids, expectedProjectBios.map((record) => record.biography_id)), `${review.review_id} project-biography joins are not exact.`);
  check(setEqual(review.exact_joins.place_biography_ids, expectedPlaceBios.map((record) => record.biography_id)), `${review.review_id} place-biography joins are not exact.`);
  check(setEqual(expectedProjectBios.map((record) => record.atlas_project_id), workbench.project_links.map((record) => record.atlas_project_id)), `${review.review_id} project biographies do not reproduce Phase 124 project membership.`);
  check(setEqual(expectedPlaceBios.map((record) => record.atlas_place_id), workbench.place_links.map((record) => record.atlas_place_id)), `${review.review_id} place biographies do not reproduce Phase 124 place membership.`);
  check(setEqual(review.exact_joins.dossier_ids, workbench.dossier_links.map((record) => record.dossier_id)), `${review.review_id} dossier joins do not reproduce Phase 124 membership.`);
  check(review.exact_joins.dossier_ids.every((id) => dossierById.has(id) && dossierById.get(id).comparison_passport.verdict === "Context only"), `${review.review_id} contains an unresolved or non-context dossier.`);
  for (const section of review.horizon_sections) {
    allHorizonSections.push(section);
    const mission = missionById.get(section.mission_id);
    const audit = auditById.get(section.audit_id);
    check(Boolean(mission) && Boolean(audit) && audit?.mission_id === section.mission_id, `${section.horizon_section_id} does not resolve its mission and audit one-to-one.`);
    if (!mission || !audit) continue;
    check(section.horizon === mission.research_horizon && section.upstream_answer_state === mission.answer_state, `${section.horizon_section_id} changed its mission horizon or answer state.`);
    check(section.upstream_answer_state === "Research packet assembled — answer not adjudicated" && section.audit_disposition === "Title/factual-nucleus screen complete — mission remains unadjudicated", `${section.horizon_section_id} must remain unadjudicated.`);
    check(orderedEqual(section.evidence_note_ids, audit.evidence_note_ids), `${section.horizon_section_id} must preserve the audit's exact ordered note IDs.`);
    check(orderedEqual(section.requirement_states.map((record) => record.test_id), audit.requirement_tests.map((record) => record.test_id)), `${section.horizon_section_id} requirement test IDs are not exact.`);
    check(orderedEqual(section.requirement_states.map((record) => record.review_state), audit.requirement_tests.map((record) => record.review_state)), `${section.horizon_section_id} must copy the audit's non-adjudicative screen states exactly.`);
    check(setEqual(section.project_biography_ids, mission.relationships.atlas_project_ids.map((id) => projectBioByAtlasId.get(id)?.biography_id)), `${section.horizon_section_id} project biographies are not exact.`);
    check(setEqual(section.place_biography_ids, mission.relationships.atlas_place_ids.map((id) => placeBioByAtlasId.get(id)?.biography_id)), `${section.horizon_section_id} place biographies are not exact.`);
    check(orderedEqual(section.next_artifact_queue.map((record) => record.tier), expectedTierOrder), `${section.horizon_section_id} research-value tiers are missing or out of order.`);
    check(/not a topic, technology, institution, project, place or performance ranking/.test(section.queue_boundary), `${section.horizon_section_id} lacks its non-performance boundary.`);
  }
  const recomputed = deepWords(review.authored_sections) + deepWords(review.horizon_sections.map((section) => section.analysis));
  check(recomputed === review.authored_word_count, `${review.review_id} authored word count does not recompute exactly.`);
  check(recomputed >= 900, `${review.review_id} has fewer than 900 authored words excluding scaffolding and boundaries.`);
  authoredWords += recomputed;
  analysisPassages.push(...Object.values(review.authored_sections), ...review.horizon_sections.map((section) => section.analysis));
  check(review.word_count_basis.includes("recurring structural sentences"), `${review.review_id} lacks an honest rendered-word basis.`);
  authoredFingerprints.add(JSON.stringify(review.authored_sections));
  const horizonCorpus = review.horizon_sections.map((section) => section.analysis).join(" ");
  check(!horizonCorpus.includes(review.authored_sections.executive_read) && !horizonCorpus.includes(review.authored_sections.research_program), `${review.review_id} repeats topic-authored passages inside horizon analysis.`);
  check(/does not admit an artifact/.test(review.interpretation_boundary) && /score or rank/.test(review.interpretation_boundary), `${review.review_id} lacks the full overlay boundary.`);
}

check(allHorizonSections.length === 68 && new Set(allHorizonSections.map((record) => record.horizon_section_id)).size === 68, "Phase 128 must contain exactly sixty-eight unique horizon sections.");
check(setEqual(allHorizonSections.map((record) => record.mission_id), missions.missions.map((record) => record.mission_id)), "Phase 128 must cover every Phase 121 mission exactly once.");
check(authoredFingerprints.size === 17, "Phase 128 requires a unique authored fingerprint for every topic review.");
check(authoredWords === registry.counts.authored_words && Math.min(...registry.topic_reviews.map((record) => record.authored_word_count)) === registry.counts.minimum_authored_words_per_review, "Phase 128 authored-word metrics are inconsistent.");
check(registry.counts.deduplicated_authored_words === deduplicatedPassageWords(analysisPassages), "Phase 128 exact-passage-deduplicated word metric is inconsistent.");
check(registry.counts.authored_8gram_repeat_ratio === Number(ngramRepeatRatio(analysisPassages).toFixed(4)), "Phase 128 eight-gram repeat ratio is inconsistent.");
check(registry.counts.evidence_notes_linked === notes.evidence_annotations.length, "Phase 128 must link the full Phase 125 annotation set through exact audits.");
check(registry.counts.mission_audits_linked === audits.mission_audits.length && registry.counts.mission_audits_linked === 68, "Phase 128 must link all sixty-eight Phase 126 audits.");
check(registry.counts.project_biographies_linked === biographies.project_biographies.length && registry.counts.place_biographies_linked === biographies.place_biographies.length, "Phase 128 must link all Phase 127 biographies.");
check(registry.counts.dossiers_linked === dossiers.dossiers.length && registry.counts.dossiers_linked === 12, "Phase 128 must link all twelve Phase 123 dossiers.");
check(packets.acquisition_packets.every((record) => record.disposition.artifacts_admitted === 0 && record.disposition.status === "Prepared — no exact artifact admitted"), "Phase 128 must preserve all Phase 120 packets without artifact admission.");
check(missions.missions.every((record) => record.answer_state === "Research packet assembled — answer not adjudicated"), "Phase 128 must preserve all Phase 121 mission answer states.");
check(dossiers.dossiers.every((record) => record.comparison_passport.verdict === "Context only"), "Phase 128 must preserve every Phase 123 verdict as Context only.");
const future = operatingCycle.records.filter((record) => record.scheduled_check_date > "2026-08-30");
check(future.length === 11 && future.every((record) => record.decision_status === "scheduled" && record.decision_date === null && record.receipt_id === null), "Phase 128 must preserve all eleven future Phase 60 gates.");
const septemberGate = operatingCycle.records.find((record) => record.cycle_item_id === "60-CYCLE-LOUISIANA-STARLINK-ADOPTION");
check(septemberGate?.scheduled_check_date === "2026-09-01" && septemberGate?.decision_status === "scheduled" && septemberGate?.decision_date === null && septemberGate?.receipt_id === null, "Phase 128 must not operate or predate the September 1 Starlink gate.");

const [topicRoute, hubRoute, endpoint] = await Promise.all([
  readFile(join(appRoot, "src", "pages", "review", "fieldbook", "topics", "[slug].astro"), "utf8"),
  readFile(join(appRoot, "src", "pages", "review", "fieldbook", "topic-reviews", "index.astro"), "utf8"),
  readFile(join(appRoot, "src", "pages", "data", "phase-128-topic-state-of-evidence-reviews.json.ts"), "utf8"),
]);
const update = await readJson("../content/updates/2026-08-30-phase-128-topic-state-of-evidence-reviews.json");
const workPackage = await readFile(join(appRoot, "..", "docs", "work-packages", "phase-128-v06-topic-state-of-evidence-reviews.md"), "utf8");
check(orderedEqual(update.affected_record_ids, registry.topic_reviews.map((record) => record.topic_id)), "Phase 128 update affected IDs must exactly equal the seventeen topic IDs.");
check(setEqual(update.related_paths, [...registry.new_html_routes, ...registry.enhanced_existing_routes, ...registry.public_json_exports]), "Phase 128 update paths must cover hub, export and all enhanced routes exactly.");
check(workPackage.includes("Phase 128") && workPackage.includes("Open Evidence Review") && workPackage.includes("exact-passage-deduplicated") && workPackage.includes(String(registry.counts.authored_8gram_repeat_ratio)), "Phase 128 work package identity or honest word-accounting disclosure is missing.");
check(topicRoute.includes("Phase 128") && topicRoute.includes("review.review_id") && topicRoute.includes("next_artifact_queue"), "Every enhanced topic route must visibly render its Phase 128 marker, review ID and research queue.");
check(hubRoute.includes("registry.topic_reviews") && hubRoute.includes("horizon_reviews"), "The Phase 128 hub must render all topic reviews and the horizon count.");
check(endpoint.includes("phase-128-topic-state-of-evidence-reviews.json") && endpoint.includes("JSON.stringify(registry"), "The Phase 128 endpoint must directly serialize the schema-1.0 registry.");

if (failures.length) {
  console.error("Phase 128 assertions failed:");
  failures.forEach((failure) => console.error(`- ${failure}`));
  process.exit(1);
}

console.log(`Phase 128 assertions passed: ${registry.counts.topic_reviews} reviews, ${registry.counts.horizon_reviews} horizons, ${registry.counts.authored_words} rendered / ${registry.counts.deduplicated_authored_words} deduplicated analysis words; minimum ${registry.counts.minimum_authored_words_per_review}.`);
