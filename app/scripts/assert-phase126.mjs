import { readFile } from "node:fs/promises";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const appRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const workspaceRoot = resolve(appRoot, "..");
const readJson = async (...parts) => JSON.parse(await readFile(join(...parts), "utf8"));
const answerState = "Research packet assembled — answer not adjudicated";
const disposition = "Title/factual-nucleus screen complete — mission remains unadjudicated";
const potentialState = "Potentially relevant context — not accepted";
const noOverlapState = "No screened-term overlap in title/factual nucleus";
const words = (value) => String(value).trim().split(/\s+/).filter(Boolean).length;
const pad = (value, width = 3) => String(value).padStart(width, "0");
const unique = (values) => [...new Set(values)];
const stopWords = new Set(["about", "across", "after", "against", "along", "among", "before", "being", "between", "could", "current", "defined", "direct", "does", "evidence", "from", "have", "into", "named", "other", "record", "records", "relevant", "requirement", "required", "same", "should", "stable", "than", "that", "their", "these", "through", "under", "using", "what", "when", "where", "which", "with", "would"]);
const stem = (token) => token.replace(/(ization|ational|iveness|fulness|ousness)$/u, "").replace(/(ments|ment|ingly|edly|ation|ions|tion|ing|ers|ies|ied|ed|es|s)$/u, "").slice(0, 16);
const terms = (value) => unique(String(value).toLowerCase().match(/[a-z0-9]+/g) ?? []).filter((token) => token.length >= 4 && !stopWords.has(token)).map(stem).filter((token) => token.length >= 3);
const excerpt = (value, max = 260) => String(value).length <= max ? String(value) : `${String(value).slice(0, max).replace(/\s+\S*$/u, "")}…`;
const deduplicatedPassageWords = (values) => {
  const seen = new Set(); let total = 0;
  for (const value of values) for (const passage of String(value).split(/(?<=[.!?])\s+/u).map((item) => item.trim()).filter(Boolean)) {
    const fingerprint = passage.toLowerCase().replace(/[^a-z0-9]+/g, " ").trim();
    if (!seen.has(fingerprint)) { seen.add(fingerprint); total += words(passage); }
  }
  return total;
};
const ngramRepeatRatio = (values, width = 8) => {
  const counts = new Map(); let total = 0;
  for (const value of values) {
    const tokens = String(value).toLowerCase().match(/[a-z0-9]+/g) ?? [];
    for (let index = 0; index <= tokens.length - width; index += 1) { const gram = tokens.slice(index, index + width).join(" "); counts.set(gram, (counts.get(gram) ?? 0) + 1); total += 1; }
  }
  return total ? [...counts.values()].reduce((sum, count) => sum + Math.max(0, count - 1), 0) / total : 0;
};

const [program, missions, annotations, acquisition, operatingCycle, update] = await Promise.all([
  readJson(appRoot, "src", "data", "phase-126-mission-evidence-audits.json"),
  readJson(appRoot, "src", "data", "phase-121-priority-research-missions.json"),
  readJson(appRoot, "src", "data", "phase-125-evidence-annotation-ledger.json"),
  readJson(appRoot, "src", "data", "phase-120-evidence-acquisition-packets.json"),
  readJson(appRoot, "src", "data", "phase-60-operating-cycle.json"),
  readJson(appRoot, "src", "content", "updates", "2026-08-30-phase-126-mission-evidence-audits.json"),
]);
const failures = []; const check = (condition, message) => { if (!condition) failures.push(message); };
check(program.schema_version === "1.0" && program.phase === 126 && program.program_id === "FTFN-PHASE-126-MISSION-EVIDENCE-AUDITS", "Invalid Phase 126 identity.");
check(program.audit_disposition === disposition && program.upstream_answer_state === answerState, "Aggregate evidence boundaries changed.");
check(program.mission_audits?.length === 68 && program.counts.mission_audits === 68 && program.counts.requirement_tests === 204, "Expected 68 audits and 204 tests.");
check(program.counts.requirements_with_potentially_relevant_context === 90 && program.counts.requirements_without_screened_term_overlap === 114 && program.counts.relevant_note_references === 119, "Context-screen counters changed.");
check(!Object.hasOwn(program.counts, "requirements_with_no_direct_context") && !Object.hasOwn(program.counts, "requirements_not_established"), "Deprecated overclaiming counter remains.");
check(JSON.stringify(program.new_html_routes) === JSON.stringify(["/review/fieldbook/mission-audits/"]) && program.enhanced_existing_routes?.length === 68 && new Set(program.enhanced_existing_routes).size === 68, "Route contract changed.");
check(JSON.stringify(program.public_json_exports) === JSON.stringify(["/data/phase-126-mission-evidence-audits.json"]), "Export contract changed.");

const noteById = new Map(annotations.evidence_annotations.map((note) => [note.note_id, note]));
const requirementNarratives = []; let relevantRefs = 0; let renderedWords = 0; let authoredWords = 0; let minimum = Infinity;
for (const [missionIndex, audit] of program.mission_audits.entries()) {
  const mission = missions.missions[missionIndex];
  check(audit.audit_id === `126-AUDIT-${pad(missionIndex + 1)}` && audit.mission_id === mission.mission_id && audit.priority_question_id === mission.priority_question_id, `${audit.audit_id} breaks Phase 121 ordering.`);
  check(audit.public_route === mission.public_route && audit.question === mission.research_contract.question && audit.upstream_answer_state === mission.answer_state && audit.upstream_answer_state === answerState, `${audit.audit_id} changed upstream mission content.`);
  const expectedIds = annotations.mission_signal_links.filter((link) => link.mission_id === mission.mission_id).map((link) => link.note_id);
  check(JSON.stringify(audit.evidence_note_ids) === JSON.stringify(expectedIds), `${audit.audit_id} changed Phase 125 joins.`);
  check(audit.requirement_tests?.length === 3, `${audit.audit_id} must contain three requirements.`);
  for (const [requirementIndex, test] of audit.requirement_tests.entries()) {
    const requirement = mission.research_contract.required_evidence[requirementIndex];
    check(test.test_id === `126-REQ-${pad(missionIndex + 1)}-${pad(requirementIndex + 1, 2)}` && test.requirement_index === requirementIndex + 1 && test.requirement === requirement, `${test.test_id} changed requirement identity/order.`);
    check(JSON.stringify(test.context_note_ids) === JSON.stringify(expectedIds), `${test.test_id} changed its context shelf.`);
    const requirementTerms = terms(requirement);
    const expected = expectedIds.map((id) => noteById.get(id)).map((note) => {
      const nucleusTerms = new Set(terms(`${note.evidence_identity.title} ${note.annotation.factual_nucleus}`));
      const matched_terms = requirementTerms.filter((term) => nucleusTerms.has(term)); return { note, matched_terms, score: matched_terms.length };
    }).filter((item) => item.score > 0).sort((a, b) => b.score - a.score || a.note.note_id.localeCompare(b.note.note_id)).slice(0, 2);
    check(test.review_state === (expected.length ? potentialState : noOverlapState), `${test.test_id} has an inaccurate lexical-screen state.`);
    check(JSON.stringify(test.relevant_note_ids) === JSON.stringify(expected.map((item) => item.note.note_id)), `${test.test_id} selected the wrong notes.`);
    check(test.relevant_context.length === expected.length, `${test.test_id} has the wrong context-detail count.`);
    for (const [contextIndex, context] of test.relevant_context.entries()) {
      const item = expected[contextIndex];
      check(context.note_id === item.note.note_id && context.signal_id === item.note.signal_id && context.title === item.note.evidence_identity.title, `${test.test_id} context identity drifted.`);
      check(JSON.stringify(context.matched_terms) === JSON.stringify(item.matched_terms) && context.factual_excerpt === excerpt(item.note.annotation.factual_nucleus), `${test.test_id} context excerpt or terms drifted.`);
      check(context.relevance_reason.includes(requirement) && context.limitation_reason.includes(requirement), `${test.test_id} lacks requirement-specific context analysis.`);
    }
    const analysis = [test.reasoning, test.false_positive_guard, test.exact_missing_record, ...test.relevant_context.flatMap((item) => [item.relevance_reason, item.limitation_reason])];
    const analysisCount = words(analysis.join(" "));
    check(analysisCount === test.analysis_word_count && analysisCount >= 120, `${test.test_id} fails its authored-analysis floor.`);
    check(test.reasoning.includes(mission.mission_id) && test.false_positive_guard.includes(requirement) && test.exact_missing_record.includes(mission.mission_id), `${test.test_id} lacks mission/requirement-specific prose.`);
    requirementNarratives.push(...analysis); authoredWords += analysisCount; relevantRefs += test.relevant_note_ids.length; minimum = Math.min(minimum, analysisCount);
  }
  const narrativeCount = words(Object.values(audit.narrative).join(" "));
  check(narrativeCount === audit.narrative_word_count && narrativeCount >= 350, `${audit.audit_id} fails its narrative floor.`);
  const expectedRendered = narrativeCount + audit.requirement_tests.reduce((sum, test) => sum + test.rendered_word_count, 0);
  check(audit.rendered_word_count === expectedRendered, `${audit.audit_id} has an invalid rendered word count.`); renderedWords += expectedRendered;
  check(audit.completion_review.completed === false && audit.completion_review.completion_rule === mission.research_contract.completion_rule && audit.next_acquisition_action === mission.stewardship.next_action, `${audit.audit_id} changed completion/acquisition state.`);
}
check(relevantRefs === 119 && relevantRefs === program.counts.relevant_note_references, "Relevant-note aggregate is invalid.");
check(authoredWords === program.counts.authored_requirement_words && authoredWords === 34104, "Authored-word aggregate is invalid.");
check(renderedWords === program.counts.rendered_audit_words && renderedWords === 79500, "Rendered-word aggregate is invalid.");
check(minimum === program.counts.minimum_requirement_analysis_words && minimum === 137, "Minimum analysis count is invalid.");
check(deduplicatedPassageWords(requirementNarratives) === program.counts.deduplicated_substantive_words && program.counts.deduplicated_substantive_words === 26902, "Deduplicated substantive count is invalid.");
check(Number(ngramRepeatRatio(requirementNarratives).toFixed(4)) === program.counts.contextual_relevance_8gram_repeat_ratio && program.counts.contextual_relevance_8gram_repeat_ratio === 0.5157 && program.counts.contextual_relevance_8gram_repeat_ratio < 0.55, "Eight-gram repetition contract failed.");
check(program.counts.phase_125_notes_referenced === 82 && program.counts.phase_125_links_consumed === 340 && program.counts.missions_with_acquisition_packets === 56 && program.counts.missions_with_acquisition_coverage_gaps === 12 && program.counts.mission_answers_changed === 0, "Upstream count invariants changed.");
check(acquisition.acquisition_packets.length === 80 && acquisition.acquisition_packets.every((packet) => packet.disposition.status === "Prepared — no exact artifact admitted"), "Phase 120 state changed.");
check(missions.missions.every((mission) => mission.answer_state === answerState) && missions.missions.filter((mission) => mission.relationships.acquisition_packet_ids.length === 0).length === 12, "Phase 121 state or gaps changed.");
check(operatingCycle.records.filter((record) => record.scheduled_check_date > "2026-08-30").length === 11, "Future-gate inventory changed.");
const expectedPaths = [...program.new_html_routes, ...program.public_json_exports, ...program.enhanced_existing_routes];
check(update.materiality === "No record-state change" && JSON.stringify(update.affected_record_ids) === JSON.stringify(program.mission_audits.map((audit) => audit.mission_id)) && JSON.stringify(update.related_paths) === JSON.stringify(expectedPaths), "Dated update inventory is not exact.");
const [hub, template, component, endpoint, workPackage] = await Promise.all([
  readFile(join(appRoot, "src", "pages", "review", "fieldbook", "mission-audits", "index.astro"), "utf8"), readFile(join(appRoot, "src", "pages", "review", "fieldbook", "missions", "[slug].astro"), "utf8"), readFile(join(appRoot, "src", "components", "review", "MissionEvidenceAudit.astro"), "utf8"), readFile(join(appRoot, "src", "pages", "data", "phase-126-mission-evidence-audits.json.ts"), "utf8"), readFile(join(workspaceRoot, "docs", "work-packages", "phase-126-v06-mission-evidence-audits.md"), "utf8"),
]);
check(hub.includes("requirements_without_screened_term_overlap") && hub.includes("Phase 126"), "Hub does not use honest counters.");
check(template.includes("MissionEvidenceAudit") && component.includes("audit.audit_id") && component.includes("Phase 126"), "Enhanced route lacks exact audit marker.");
check(endpoint.includes("JSON.stringify(registry") && workPackage.includes("34,104") && workPackage.includes("26,902") && workPackage.includes("titles and factual nuclei") && workPackage.includes(disposition) && workPackage.includes("integrated into v0.6"), "Export/work-package contract is incomplete.");
if (failures.length) { console.error("Phase 126 assertions failed:"); failures.forEach((failure) => console.error(`- ${failure}`)); process.exit(1); }
console.log(`Phase 126 assertions passed: 90 potential-context / 114 no-term-overlap tests, 119 grounded note references, ${renderedWords} rendered / ${authoredWords} substantive / ${program.counts.deduplicated_substantive_words} deduplicated words.`);
