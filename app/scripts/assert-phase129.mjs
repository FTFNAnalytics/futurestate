import { readFile } from "node:fs/promises";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const appRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const readJson = async (name) => JSON.parse(await readFile(join(appRoot, "src", "data", name), "utf8"));
const failures = [];
const check = (condition, message) => { if (!condition) failures.push(message); };
const orderedEqual = (left, right) => Array.isArray(left) && Array.isArray(right) && left.length === right.length && left.every((item, index) => item === right[index]);
const setEqual = (left, right) => left.length === right.length && new Set(left).size === new Set(right).size && left.every((item) => new Set(right).has(item));
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

const [registry, dossiers, biographies, topicReviews, missions, packets, operatingCycle] = await Promise.all([
  readJson("phase-129-cross-system-evidence-syntheses.json"),
  readJson("phase-123-comparative-delivery-dossiers.json"),
  readJson("phase-127-project-place-conversion-biographies.json"),
  readJson("phase-128-topic-state-of-evidence-reviews.json"),
  readJson("phase-121-priority-research-missions.json"),
  readJson("phase-120-evidence-acquisition-packets.json"),
  readJson("phase-60-operating-cycle.json"),
]);

const dossierById = new Map(dossiers.dossiers.map((record) => [record.dossier_id, record]));
const projectBioByAtlasId = new Map(biographies.project_biographies.map((record) => [record.atlas_project_id, record]));
const placeBioByAtlasId = new Map(biographies.place_biographies.map((record) => [record.atlas_place_id, record]));
const topicReviewByTopic = new Map(topicReviews.topic_reviews.map((record) => [record.topic_id, record]));
const dimensions = ["identity", "stage", "geography", "period", "denominator_and_method"];

check(registry.schema_version === "1.0" && registry.program_id === "FTFN-PHASE-129-CROSS-SYSTEM-EVIDENCE-SYNTHESES" && registry.status === "Complete", "Phase 129 identity, schema or status is invalid.");
check(registry.syntheses.length === 12 && registry.counts.syntheses === 12, "Phase 129 must contain exactly twelve syntheses.");
check(registry.counts.compatibility_determinations === 60, "Phase 129 must contain exactly sixty compatibility determinations.");
check(orderedEqual(registry.syntheses.map((record) => record.dossier_id), dossiers.dossiers.map((record) => record.dossier_id)), "Phase 129 must preserve exact Phase 123 dossier order.");
check(orderedEqual(registry.dimension_contract.ordered_dimensions, dimensions) && registry.dimension_contract.verdict === "Context only", "Phase 129 dimension contract is invalid.");
check(registry.new_html_routes.length === 1 && registry.new_html_routes[0] === "/review/fieldbook/system-reviews/", "Phase 129 must expose the fixed system-review hub.");
check(orderedEqual(registry.enhanced_existing_routes, dossiers.dossiers.map((record) => record.route)), "Phase 129 enhanced routes must exactly equal the twelve Phase 123 routes.");
check(registry.public_json_exports.length === 1 && registry.public_json_exports[0] === "/data/phase-129-cross-system-evidence-syntheses.json", "Phase 129 public export route is invalid.");

let determinationCount = 0;
let signalLinks = 0;
let sourceLinks = 0;
let authoredWords = 0;
const analysisPassages = [];
const fingerprints = new Set();
for (const synthesis of registry.syntheses) {
  const dossier = dossierById.get(synthesis.dossier_id);
  check(Boolean(dossier), `${synthesis.synthesis_id} references an unknown Phase 123 dossier.`);
  if (!dossier) continue;
  check(synthesis.legacy_story_id === dossier.legacy_story_id && synthesis.slug === dossier.slug && synthesis.route === dossier.route, `${synthesis.synthesis_id} does not preserve dossier identity.`);
  check(synthesis.verdict === "Context only" && synthesis.verdict === dossier.comparison_passport.verdict, `${synthesis.synthesis_id} must retain the exact Context only verdict.`);
  check(orderedEqual(synthesis.topic_ids, dossier.topic_ids), `${synthesis.synthesis_id} topic IDs are not exact.`);
  check(orderedEqual(synthesis.evidence_signal_ids, dossier.evidence_signal_ids), `${synthesis.synthesis_id} Published-signal links are not byte-order equal to Phase 123.`);
  check(orderedEqual(synthesis.evidence_source_ids, dossier.evidence_source_ids), `${synthesis.synthesis_id} source links are not byte-order equal to Phase 123.`);
  signalLinks += synthesis.evidence_signal_ids.length;
  sourceLinks += synthesis.evidence_source_ids.length;
  const expectedTopicReviews = dossier.topic_ids.map((id) => topicReviewByTopic.get(id)?.review_id);
  const expectedProjectBios = dossier.atlas_project_ids.map((id) => projectBioByAtlasId.get(id)?.biography_id);
  const expectedPlaceBios = dossier.atlas_place_ids.map((id) => placeBioByAtlasId.get(id)?.biography_id);
  check(expectedTopicReviews.every(Boolean) && expectedProjectBios.every(Boolean) && expectedPlaceBios.every(Boolean), `${synthesis.synthesis_id} cannot resolve all exact joins.`);
  check(orderedEqual(synthesis.exact_joins.topic_review_ids, expectedTopicReviews), `${synthesis.synthesis_id} topic-review joins are not exact.`);
  check(orderedEqual(synthesis.exact_joins.project_biography_ids, expectedProjectBios), `${synthesis.synthesis_id} project-biography joins are not exact.`);
  check(orderedEqual(synthesis.exact_joins.place_biography_ids, expectedPlaceBios), `${synthesis.synthesis_id} place-biography joins are not exact.`);
  check(synthesis.compatibility_determinations.length === 5, `${synthesis.synthesis_id} must have five determinations.`);
  check(orderedEqual(synthesis.compatibility_determinations.map((record) => record.dimension_id), dimensions), `${synthesis.synthesis_id} dimensions are missing or out of order.`);
  check(synthesis.compatibility_determinations.every((record) => record.state === "Context only"), `${synthesis.synthesis_id} contains a non-context determination.`);
  determinationCount += synthesis.compatibility_determinations.length;
  const recomputed = deepWords(synthesis.authored_sections) + deepWords(synthesis.compatibility_determinations.map(({ determination, incompatibility, next_review }) => ({ determination, incompatibility, next_review })));
  check(recomputed === synthesis.authored_word_count, `${synthesis.synthesis_id} authored word count does not recompute exactly.`);
  check(recomputed >= 800, `${synthesis.synthesis_id} has fewer than 800 authored words excluding scaffolding and repeated boundaries.`);
  authoredWords += recomputed;
  analysisPassages.push(
    ...Object.values(synthesis.authored_sections),
    ...synthesis.compatibility_determinations.flatMap(({ determination, incompatibility, next_review }) => [determination, incompatibility, next_review]),
  );
  check(synthesis.word_count_basis.includes("recurring structural sentences"), `${synthesis.synthesis_id} lacks an honest rendered-word basis.`);
  fingerprints.add(JSON.stringify(synthesis.authored_sections));
  const determinationCorpus = synthesis.compatibility_determinations.map((record) => record.determination).join(" ");
  check(!Object.values(synthesis.authored_sections).some((passage) => determinationCorpus.includes(passage)), `${synthesis.synthesis_id} repeats a synthesis-authored passage inside its determinations.`);
  check(/retains the exact Context only verdict/.test(synthesis.interpretation_boundary) && /score or rank/.test(synthesis.interpretation_boundary), `${synthesis.synthesis_id} lacks the full non-decision boundary.`);
}

check(determinationCount === 60 && determinationCount === registry.counts.compatibility_determinations, "Phase 129 determination totals are inconsistent.");
check(signalLinks === dossiers.counts.evidence_signal_links && signalLinks === 149 && registry.counts.evidence_signal_links === signalLinks, "Phase 129 must retain exact equality with all 149 Phase 123 Published-signal links.");
check(sourceLinks === dossiers.counts.evidence_source_links && sourceLinks === 124 && registry.counts.evidence_source_links === sourceLinks, "Phase 129 must retain exact equality with all 124 Phase 123 source links.");
check(fingerprints.size === 12, "Phase 129 requires a unique authored fingerprint for every synthesis.");
check(authoredWords === registry.counts.authored_words && Math.min(...registry.syntheses.map((record) => record.authored_word_count)) === registry.counts.minimum_authored_words_per_synthesis, "Phase 129 authored-word metrics are inconsistent.");
check(registry.counts.deduplicated_authored_words === deduplicatedPassageWords(analysisPassages), "Phase 129 exact-passage-deduplicated word metric is inconsistent.");
check(registry.counts.authored_8gram_repeat_ratio === Number(ngramRepeatRatio(analysisPassages).toFixed(4)), "Phase 129 eight-gram repeat ratio is inconsistent.");
check(registry.counts.topic_reviews_linked === new Set(dossiers.dossiers.flatMap((record) => record.topic_ids)).size, "Phase 129 topic-review count must equal exact Phase 123 topic membership.");
check(registry.counts.project_biographies_linked === new Set(dossiers.dossiers.flatMap((record) => record.atlas_project_ids)).size && registry.counts.place_biographies_linked === new Set(dossiers.dossiers.flatMap((record) => record.atlas_place_ids)).size, "Phase 129 biography counts must equal exact Phase 123 project and place membership.");
check(dossiers.dossiers.every((record) => record.comparison_passport.verdict === "Context only"), "Phase 129 must preserve every Phase 123 verdict.");
check(packets.acquisition_packets.every((record) => record.disposition.artifacts_admitted === 0 && record.disposition.status === "Prepared — no exact artifact admitted"), "Phase 129 must preserve all Phase 120 packet states.");
check(missions.missions.every((record) => record.answer_state === "Research packet assembled — answer not adjudicated"), "Phase 129 must preserve all Phase 121 mission states.");
const future = operatingCycle.records.filter((record) => record.scheduled_check_date > "2026-08-30");
check(future.length === 11 && future.every((record) => record.decision_status === "scheduled" && record.decision_date === null && record.receipt_id === null), "Phase 129 must preserve all eleven future Phase 60 gates.");
const septemberGate = operatingCycle.records.find((record) => record.cycle_item_id === "60-CYCLE-LOUISIANA-STARLINK-ADOPTION");
check(septemberGate?.scheduled_check_date === "2026-09-01" && septemberGate?.decision_status === "scheduled" && septemberGate?.decision_date === null && septemberGate?.receipt_id === null, "Phase 129 must not operate or predate the September 1 Starlink gate.");

const [systemRoute, hubRoute, endpoint] = await Promise.all([
  readFile(join(appRoot, "src", "pages", "review", "systems", "[slug].astro"), "utf8"),
  readFile(join(appRoot, "src", "pages", "review", "fieldbook", "system-reviews", "index.astro"), "utf8"),
  readFile(join(appRoot, "src", "pages", "data", "phase-129-cross-system-evidence-syntheses.json.ts"), "utf8"),
]);
const update = await readJson("../content/updates/2026-08-30-phase-129-cross-system-evidence-syntheses.json");
const workPackage = await readFile(join(appRoot, "..", "docs", "work-packages", "phase-129-v06-cross-system-evidence-syntheses.md"), "utf8");
check(orderedEqual(update.affected_record_ids, registry.syntheses.map((record) => record.dossier_id)), "Phase 129 update affected IDs must exactly equal the twelve dossier identities.");
check(setEqual(update.related_paths, [...registry.new_html_routes, ...registry.enhanced_existing_routes, ...registry.public_json_exports]), "Phase 129 update paths must cover hub, export and all enhanced routes exactly.");
check(workPackage.includes("Phase 129") && workPackage.includes("Open Evidence Review") && workPackage.includes("exact-passage-deduplicated") && workPackage.includes(String(registry.counts.authored_8gram_repeat_ratio)), "Phase 129 work package identity or honest word-accounting disclosure is missing.");
check(systemRoute.includes("Phase 129") && systemRoute.includes("synthesis.synthesis_id") && systemRoute.includes("compatibility_determinations"), "Every enhanced system route must visibly render its Phase 129 marker, synthesis ID and determinations.");
check(hubRoute.includes("registry.syntheses") && hubRoute.includes("compatibility_determinations"), "The Phase 129 hub must render all syntheses and the determination count.");
check(endpoint.includes("phase-129-cross-system-evidence-syntheses.json") && endpoint.includes("JSON.stringify(registry"), "The Phase 129 endpoint must directly serialize the schema-1.0 registry.");

if (failures.length) {
  console.error("Phase 129 assertions failed:");
  failures.forEach((failure) => console.error(`- ${failure}`));
  process.exit(1);
}

console.log(`Phase 129 assertions passed: ${registry.counts.syntheses} syntheses, ${registry.counts.compatibility_determinations} determinations, ${registry.counts.evidence_signal_links} signal links, ${registry.counts.evidence_source_links} source links, ${registry.counts.authored_words} rendered / ${registry.counts.deduplicated_authored_words} deduplicated analysis words; minimum ${registry.counts.minimum_authored_words_per_synthesis}.`);
