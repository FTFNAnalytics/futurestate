import { readFile, readdir } from "node:fs/promises";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const appRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const workspaceRoot = resolve(appRoot, "..");
const readJson = async (...parts) => JSON.parse(await readFile(join(...parts), "utf8"));
const fixedState = "Published context annotated — no mission answer created";
const fixedLinkState = "Context only — requirement satisfaction not adjudicated";
const words = (value) => String(value).trim().split(/\s+/).filter(Boolean).length;
const sorted = (values) => [...values].sort();
const equalMembers = (left, right) => JSON.stringify(sorted(left)) === JSON.stringify(sorted(right));
const pad = (value) => String(value).padStart(3, "0");
const deduplicatedPassageWords = (values) => {
  const seen = new Set();
  let total = 0;
  for (const value of values) {
    for (const passage of String(value).split(/(?<=[.!?])\s+/u).map((item) => item.trim()).filter(Boolean)) {
      const fingerprint = passage.toLowerCase().replace(/[^a-z0-9]+/g, " ").trim();
      if (!seen.has(fingerprint)) { seen.add(fingerprint); total += words(passage); }
    }
  }
  return total;
};
const ngramRepeatRatio = (values, width = 8) => {
  const counts = new Map(); let total = 0;
  for (const value of values) {
    const tokens = String(value).toLowerCase().match(/[a-z0-9]+/g) ?? [];
    for (let index = 0; index <= tokens.length - width; index += 1) {
      const gram = tokens.slice(index, index + width).join(" "); counts.set(gram, (counts.get(gram) ?? 0) + 1); total += 1;
    }
  }
  const repeated = [...counts.values()].reduce((sum, count) => sum + Math.max(0, count - 1), 0);
  return total ? repeated / total : 0;
};

const frontmatter = (raw) => raw.split(/^---\s*$/m)[1] ?? "";
const scalar = (block, key) => {
  const match = block.match(new RegExp(`^${key}:\\s*(?:"([^"]*)"|'([^']*)'|([^\\r\\n]+))\\s*$`, "m"));
  return (match?.[1] ?? match?.[2] ?? match?.[3] ?? "").trim();
};
const list = (block, key) => {
  const match = block.match(new RegExp(`^${key}:\\s*\\r?\\n((?:[ \\t]+-[^\\r\\n]*(?:\\r?\\n|$))+)`, "m"));
  return [...(match?.[1] ?? "").matchAll(/^\s*-\s*(?:"([^"]*)"|'([^']*)'|([^\r\n]+))\s*$/gm)]
    .map((item) => (item[1] ?? item[2] ?? item[3] ?? "").trim());
};

const [program, missions, acquisition, operatingCycle, update] = await Promise.all([
  readJson(appRoot, "src", "data", "phase-125-evidence-annotation-ledger.json"),
  readJson(appRoot, "src", "data", "phase-121-priority-research-missions.json"),
  readJson(appRoot, "src", "data", "phase-120-evidence-acquisition-packets.json"),
  readJson(appRoot, "src", "data", "phase-60-operating-cycle.json"),
  readJson(appRoot, "src", "content", "updates", "2026-08-30-phase-125-evidence-annotation-ledger.json"),
]);

const failures = [];
const check = (condition, message) => { if (!condition) failures.push(message); };
const signalById = new Map();
for (const name of (await readdir(join(appRoot, "src", "content", "signals"))).filter((item) => /\.mdx?$/.test(item))) {
  const block = frontmatter(await readFile(join(appRoot, "src", "content", "signals", name), "utf8"));
  const id = scalar(block, "id");
  signalById.set(id, {
    id,
    title: scalar(block, "title"),
    slug: scalar(block, "slug"),
    status: scalar(block, "record_status"),
    summary: scalar(block, "summary"),
    source_ids: list(block, "source_ids"),
  });
}
const sourceById = new Map();
for (const name of (await readdir(join(appRoot, "src", "content", "sources"))).filter((item) => item.endsWith(".json"))) {
  const source = await readJson(appRoot, "src", "content", "sources", name);
  sourceById.set(source.id, source);
}

check(signalById.size === 1406, `Phase 125 changed the signal corpus: ${signalById.size}.`);
check(sourceById.size === 795, `Phase 125 changed the source corpus: ${sourceById.size}.`);
check(program.schema_version === "1.0" && program.phase === 125, "Phase 125 schema or phase identity is invalid.");
check(program.program_id === "FTFN-PHASE-125-EVIDENCE-ANNOTATION-LEDGER", "Phase 125 program ID is invalid.");
check(program.effective_date === "2026-08-30" && program.record_status === "Published" && program.status === "Complete", "Phase 125 publication state is invalid.");
check(program.annotation_state === fixedState, "Phase 125 aggregate annotation state changed.");
check(program.evidence_annotations?.length === 82 && program.counts.evidence_annotations === 82, "Phase 125 must contain 82 evidence annotations.");
check(program.mission_signal_links?.length === 340 && program.counts.mission_signal_links === 340, "Phase 125 must contain 340 mission-signal links.");
check(program.source_union_ids?.length === 114 && program.counts.source_records_resolved === 114, "Phase 125 must resolve exactly 114 sources.");
check(program.new_html_routes?.length === 1 && program.new_html_routes[0] === "/review/fieldbook/evidence-notes/", "Phase 125 new route contract is invalid.");
check(program.enhanced_existing_routes?.length === 82 && new Set(program.enhanced_existing_routes).size === 82, "Phase 125 must enhance 82 unique existing routes.");
check(program.public_html_routes?.length === 83 && program.counts.substantive_surfaces === 83, "Phase 125 substantive surface count is invalid.");
check(program.public_json_exports?.length === 1 && program.public_json_exports[0] === "/data/phase-125-evidence-annotation-ledger.json", "Phase 125 export contract is invalid.");

const expectedSignalIds = sorted([...new Set(missions.missions.flatMap((mission) => mission.relationships.context_signal_ids))]);
const expectedRawLinks = missions.missions.flatMap((mission) => mission.relationships.context_signal_ids.map((signalId) => ({ mission, signalId })))
  .sort((left, right) => left.mission.mission_id.localeCompare(right.mission.mission_id) || left.signalId.localeCompare(right.signalId));
check(expectedSignalIds.length === 82, "The Phase 121 context union no longer contains 82 signals.");
check(expectedRawLinks.length === 340, "The Phase 121 mission-signal relation no longer contains 340 links.");
check(JSON.stringify(program.evidence_annotations.map((note) => note.signal_id)) === JSON.stringify(expectedSignalIds), "Phase 125 annotation membership/order differs from the exact Phase 121 union.");

const noteBySignalId = new Map();
const fingerprints = new Set();
const substantivePassages = [];
for (const [index, note] of program.evidence_annotations.entries()) {
  const signal = signalById.get(note.signal_id);
  check(note.note_id === `125-NOTE-${pad(index + 1)}`, `${note.signal_id} has the wrong stable note ID.`);
  check(Boolean(signal), `${note.note_id} references missing signal ${note.signal_id}.`);
  if (!signal) continue;
  check(signal.status === "Published", `${note.note_id} does not annotate a Published signal.`);
  check(note.signal_slug === signal.slug && note.signal_route === `/signals/${signal.slug}/`, `${note.note_id} has the wrong canonical signal route.`);
  check(note.evidence_identity.title === signal.title && note.annotation.factual_nucleus === signal.summary, `${note.note_id} changed the inherited signal identity or factual nucleus.`);
  check(equalMembers(note.source_ids, signal.source_ids), `${note.note_id} changed exact signal source membership.`);
  check(note.source_profiles.length === note.source_ids.length && note.source_profiles.every((source) => sourceById.has(source.source_id)), `${note.note_id} has an unresolved or duplicate source profile.`);
  const expectedMissionIds = missions.missions.filter((mission) => mission.relationships.context_signal_ids.includes(note.signal_id)).map((mission) => mission.mission_id);
  check(equalMembers(note.mission_ids, expectedMissionIds), `${note.note_id} changed exact mission membership.`);
  check(note.annotation_state === fixedState, `${note.note_id} changed its non-adjudicative state.`);
  const rendered = Object.values(note.annotation).join(" ");
  check(!/[?!]\./.test(rendered), `${note.note_id} contains a duplicated terminal-punctuation artifact.`);
  const substantive = [note.annotation.bounded_support, note.annotation.excluded_inference, note.annotation.provenance_reading, note.annotation.measurement_reading, note.annotation.research_use];
  const renderedCount = words(rendered);
  const substantiveCount = words(substantive.join(" "));
  check(renderedCount === note.rendered_word_count, `${note.note_id} has the wrong rendered word count.`);
  check(substantiveCount === note.substantive_word_count && substantiveCount >= 120, `${note.note_id} fails its nucleus-excluded substantive floor (${substantiveCount}).`);
  check(!note.annotation.bounded_support.includes(note.annotation.factual_nucleus), `${note.note_id} duplicates its factual nucleus inside bounded support.`);
  substantivePassages.push(...substantive);
  const fingerprint = rendered.toLowerCase().replace(/\s+/g, " ").trim();
  check(!fingerprints.has(fingerprint), `${note.note_id} duplicates another normalized annotation narrative.`);
  fingerprints.add(fingerprint);
  check(note.interpretation_boundary.includes("creates no source fact") && note.interpretation_boundary.includes("mission answer"), `${note.note_id} lacks the evidence boundary.`);
  noteBySignalId.set(note.signal_id, note);
}

for (const [index, link] of program.mission_signal_links.entries()) {
  const expected = expectedRawLinks[index];
  const note = noteBySignalId.get(expected.signalId);
  check(link.link_id === `125-LINK-${pad(index + 1)}`, `${link.link_id} is out of stable sequence.`);
  check(link.mission_id === expected.mission.mission_id && link.signal_id === expected.signalId && link.note_id === note?.note_id, `${link.link_id} differs from its exact Phase 121 mission-signal join.`);
  check(link.topic_id === expected.mission.topic_id && link.research_horizon === expected.mission.research_horizon, `${link.link_id} changed topic or horizon.`);
  check(link.use_state === fixedLinkState && link.reasoning.includes("cannot satisfy"), `${link.link_id} overstates context use.`);
}

const expectedSourceUnion = sorted([...new Set(expectedSignalIds.flatMap((signalId) => signalById.get(signalId)?.source_ids ?? []))]);
check(expectedSourceUnion.length === 114 && JSON.stringify(program.source_union_ids) === JSON.stringify(expectedSourceUnion), "Phase 125 source union differs from exact signal provenance.");
check(program.counts.rendered_annotation_words === program.evidence_annotations.reduce((sum, note) => sum + note.rendered_word_count, 0), "Phase 125 rendered-word aggregate is wrong.");
check(program.counts.substantive_annotation_words === program.evidence_annotations.reduce((sum, note) => sum + note.substantive_word_count, 0), "Phase 125 substantive-word aggregate is wrong.");
check(program.counts.deduplicated_substantive_words === deduplicatedPassageWords(substantivePassages), "Phase 125 deduplicated substantive count is wrong.");
check(program.counts.minimum_substantive_note_words === Math.min(...program.evidence_annotations.map((note) => note.substantive_word_count)), "Phase 125 minimum substantive note count is wrong.");
check(program.counts.minimum_substantive_note_words >= 120, "Phase 125 has a note below the honest substantive floor.");
check(program.counts.substantive_8gram_repeat_ratio === Number(ngramRepeatRatio(substantivePassages).toFixed(4)), "Phase 125 recurring eight-word metric is wrong.");

const forbiddenKeys = new Set(["artifact_id", "artifact_url", "receipt_id", "decision_date", "decision_status", "answer_state", "mission_answer", "outcome_score", "ranking", "causal_finding"]);
const inspectKeys = (value, path = "program") => {
  if (!value || typeof value !== "object") return;
  for (const [key, child] of Object.entries(value)) {
    check(!forbiddenKeys.has(key), `Phase 125 exposes prohibited evidence-state field ${path}.${key}.`);
    inspectKeys(child, `${path}.${key}`);
  }
};
inspectKeys(program);

check(acquisition.acquisition_packets.length === 80 && acquisition.acquisition_packets.every((packet) => packet.disposition.status === "Prepared — no exact artifact admitted"), "Phase 125 changed a Phase 120 acquisition disposition.");
check(missions.missions.length === 68 && missions.missions.every((mission) => mission.answer_state === "Research packet assembled — answer not adjudicated"), "Phase 125 changed a Phase 121 answer state.");
check(missions.missions.filter((mission) => mission.relationships.acquisition_packet_ids.length === 0).length === 12, "Phase 125 changed the twelve acquisition coverage gaps.");
const futureGates = operatingCycle.records.filter((record) => record.scheduled_check_date > "2026-08-30");
check(futureGates.length === 11 && futureGates.every((record) => record.decision_status === "scheduled" && record.decision_date === null && record.receipt_id === null), "Phase 125 changed a future Phase 60 gate.");

const [hub, signalTemplate, component, endpoint, workPackage] = await Promise.all([
  readFile(join(appRoot, "src", "pages", "review", "fieldbook", "evidence-notes", "index.astro"), "utf8"),
  readFile(join(appRoot, "src", "pages", "signals", "[slug].astro"), "utf8"),
  readFile(join(appRoot, "src", "components", "review", "EvidenceAnnotation.astro"), "utf8"),
  readFile(join(appRoot, "src", "pages", "data", "phase-125-evidence-annotation-ledger.json.ts"), "utf8"),
  readFile(join(workspaceRoot, "docs", "work-packages", "phase-125-v06-evidence-annotation-ledger.md"), "utf8"),
]);
check(hub.includes("Source-linked evidence annotations") && hub.includes("Phase 125") && hub.includes("No evidence state changed"), "Phase 125 hub lacks identity or boundary markers.");
check(signalTemplate.includes("EvidenceAnnotation") && signalTemplate.includes("evidenceAnnotation") && signalTemplate.includes("phase-125-evidence-annotation-ledger.json"), "Signal routes do not conditionally join the Phase 125 overlay.");
check(component.includes("Phase 125") && component.includes("note.note_id") && component.includes("What this record supports"), "Phase 125 component lacks visible phase/note markers.");
check(endpoint.includes("JSON.stringify(registry") && !endpoint.includes("dataset:"), "Phase 125 endpoint is not the direct schema-1.0 registry export.");
check(workPackage.includes("82") && workPackage.includes("114") && workPackage.includes("340") && workPackage.includes("deduplicated_substantive_words"), "Phase 125 work package lacks the exact contract or honest word accounting.");
check(update.materiality === "No record-state change" && update.publication_effect.includes("82"), "Phase 125 update overstates materiality.");
check(JSON.stringify(update.affected_record_ids) === JSON.stringify(expectedSignalIds), "Phase 125 update must inventory the exact 82 enhanced signal IDs.");
check(JSON.stringify(update.related_paths) === JSON.stringify([...program.new_html_routes, ...program.public_json_exports, ...program.enhanced_existing_routes]), "Phase 125 update must inventory hub, export and all 82 enhanced routes.");

if (failures.length) {
  console.error("Phase 125 assertions failed:");
  failures.forEach((failure) => console.error(`- ${failure}`));
  process.exit(1);
}

console.log(`Phase 125 assertions passed: 82 annotations, 114 sources, 340 joins, ${program.counts.rendered_annotation_words} rendered / ${program.counts.substantive_annotation_words} substantive / ${program.counts.deduplicated_substantive_words} deduplicated words, and exact update inventory.`);
