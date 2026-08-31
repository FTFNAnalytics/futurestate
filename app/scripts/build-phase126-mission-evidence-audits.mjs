import { readFile, writeFile } from "node:fs/promises";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const appRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const readJson = async (...parts) => JSON.parse(await readFile(join(...parts), "utf8"));
const writeJson = (path, value) => writeFile(path, `${JSON.stringify(value, null, 2)}\n`, "utf8");
const effectiveDate = "2026-08-30";
const fixedAnswerState = "Research packet assembled — answer not adjudicated";
const auditDisposition = "Title/factual-nucleus screen complete — mission remains unadjudicated";
const potentialState = "Potentially relevant context — not accepted";
const noContextState = "No screened-term overlap in title/factual nucleus";
const pad = (value, width = 3) => String(value).padStart(width, "0");
const words = (value) => String(value).trim().split(/\s+/).filter(Boolean).length;
const unique = (values) => [...new Set(values)];
const stopWords = new Set([
  "about", "across", "after", "against", "along", "among", "before", "being", "between", "could", "current", "defined", "direct", "does", "evidence", "from", "have", "into", "named", "other", "record", "records", "relevant", "requirement", "required", "same", "should", "stable", "than", "that", "their", "these", "through", "under", "using", "what", "when", "where", "which", "with", "would",
]);
const stem = (token) => token
  .replace(/(ization|ational|iveness|fulness|ousness)$/u, "")
  .replace(/(ments|ment|ingly|edly|ation|ions|tion|ing|ers|ies|ied|ed|es|s)$/u, "")
  .slice(0, 16);
const terms = (value) => unique(String(value).toLowerCase().match(/[a-z0-9]+/g) ?? [])
  .filter((token) => token.length >= 4 && !stopWords.has(token))
  .map(stem)
  .filter((token) => token.length >= 3);
const excerpt = (value, max = 260) => String(value).length <= max ? String(value) : `${String(value).slice(0, max).replace(/\s+\S*$/u, "")}…`;
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

const [missions, annotations] = await Promise.all([
  readJson(appRoot, "src", "data", "phase-121-priority-research-missions.json"),
  readJson(appRoot, "src", "data", "phase-125-evidence-annotation-ledger.json"),
]);

if (missions.missions?.length !== 68) throw new Error("Phase 126 requires the exact 68 Phase 121 missions.");
if (annotations.evidence_annotations?.length !== 82 || annotations.mission_signal_links?.length !== 340) {
  throw new Error("Phase 126 requires the complete Phase 125 annotation overlay.");
}

const noteById = new Map(annotations.evidence_annotations.map((note) => [note.note_id, note]));
const linksByMission = new Map(missions.missions.map((mission) => [
  mission.mission_id,
  annotations.mission_signal_links.filter((link) => link.mission_id === mission.mission_id),
]));

const falsePositiveByHorizon = {
  Baseline: "Do not substitute a headline total, announcement, adjacent geography, national aggregate, forecast, or nameplate figure for a source-defined baseline with a complete identity, period, method, and denominator.",
  Conversion: "Do not infer authority, finance, implementation, validation, or acceptance from an adjacent stage. Every conversion step needs its own dated record for the same named file and scope.",
  Operation: "Do not treat a first event, single successful run, pilot, delivery, launch, enrollment, connection, or commissioning statement as repeated operation across a stable accepted denominator.",
  Outcome: "Do not convert an operating milestone, modeled benefit, association, testimonial, or before-and-after narrative into a comparable measured outcome or causal conclusion.",
};

const mission_audits = missions.missions.map((mission, index) => {
  if (mission.answer_state !== fixedAnswerState) throw new Error(`${mission.mission_id} changed its Phase 121 answer state.`);
  const links = linksByMission.get(mission.mission_id) ?? [];
  const notes = links.map((link) => noteById.get(link.note_id));
  if (notes.some((note) => !note)) throw new Error(`${mission.mission_id} has an unresolved Phase 125 note.`);
  const noteTitles = notes.map((note) => `${note.note_id}: ${note.evidence_identity.title}`);
  const sourceCount = unique(notes.flatMap((note) => note.source_ids)).length;
  const packetState = mission.relationships.acquisition_state;
  const packetReading = mission.relationships.acquisition_packet_ids.length
    ? `${mission.relationships.acquisition_packet_ids.length} exact topic-and-stage acquisition packets are available, but every associated artifact target remains unreviewed.`
    : "No exact Phase 120 topic-and-stage packet joins this mission, so its acquisition coverage gap remains visible and no fallback rail is supplied.";

  const requirement_tests = mission.research_contract.required_evidence.map((requirement, requirementIndex) => {
    const requirementTerms = terms(requirement);
    const scoredNotes = notes.map((note) => {
      const nucleus = `${note.evidence_identity.title} ${note.annotation.factual_nucleus}`;
      const nucleusTerms = new Set(terms(nucleus));
      const nucleusMatches = requirementTerms.filter((term) => nucleusTerms.has(term));
      return { note, matched_terms: nucleusMatches, score: nucleusMatches.length };
    }).filter((candidate) => candidate.score > 0)
      .sort((left, right) => right.score - left.score || left.note.note_id.localeCompare(right.note.note_id))
      .slice(0, 2);
    const relevant_context = scoredNotes.map(({ note, matched_terms }) => ({
      note_id: note.note_id,
      signal_id: note.signal_id,
      signal_route: note.signal_route,
      title: note.evidence_identity.title,
      factual_excerpt: excerpt(note.annotation.factual_nucleus),
      matched_terms,
      relevance_reason: `${note.note_id} matches ${matched_terms.join("/")} to “${requirement}” through ${note.signal_id}'s own wording. That is a contextual screening result for ${mission.mission_id}, not accepted support.`,
      limitation_reason: `${note.note_id}'s ${note.evidence_identity.signal_type}/${note.evidence_identity.maturity_level} classification does not resolve “${requirement}”; its excluded-inference section remains controlling for test ${requirementIndex + 1}.`,
    }));
    const hasRelevantContext = relevant_context.length > 0;
    const reviewState = hasRelevantContext ? potentialState : noContextState;
    const namedContext = hasRelevantContext
      ? relevant_context.map((item) => `${item.note_id} (“${item.title}”)`).join("; ")
      : notes.map((note) => `${note.note_id} (“${note.evidence_identity.title}”)`).join("; ");
    const firstRelevant = relevant_context[0];
    const assessmentVariants = hasRelevantContext ? [
      `Requirement “${requirement}” matched ${firstRelevant.matched_terms.join("/")} in ${namedContext}. ${firstRelevant.note_id} states: “${firstRelevant.factual_excerpt}” Disposition for ${mission.mission_id}: potentially relevant context, not accepted. Identity, scope, method, time and denominator still require a later decision.`,
      `${mission.mission_id} screening found ${namedContext} for “${requirement}”. The leading match was ${firstRelevant.matched_terms.join("/")}; its exact nucleus reads “${firstRelevant.factual_excerpt}” Phase 126 retains this as a review lead only. No requirement credit or mission answer follows.`,
      `Current-context result for “${requirement}”: ${namedContext}. In ${firstRelevant.note_id}, “${firstRelevant.factual_excerpt}” supplies the terms ${firstRelevant.matched_terms.join("/")}. That narrow overlap is inspectable, but acceptance controls and the ${mission.research_horizon.toLowerCase()} completion contract remain open for ${mission.mission_id}.`,
    ] : [
      `Requirement “${requirement}” produced no title/factual-nucleus match for ${requirementTerms.join("/") || "its distinguishing language"}. ${mission.mission_id} screened ${namedContext}. Result: no screened-term overlap in those exact fields; external availability and semantic relevance were not adjudicated.`,
      `${mission.mission_id} compared “${requirement}” with ${namedContext}. After generic research words were removed, ${requirementTerms.join("/") || "the remaining concepts"} did not occur in a current factual nucleus. Topic proximity supplies no substitute and says nothing about external nonexistence.`,
      `No annotation in ${namedContext} directly states “${requirement}” or its screened terms ${requirementTerms.join("/") || "as scoped"}. This bounded result belongs only to ${mission.mission_id}'s present corpus. Acquisition may continue without treating the gap as a finding.`,
    ];
    const reasoning = assessmentVariants[(index + requirementIndex) % assessmentVariants.length];
    const falsePositiveGuard = hasRelevantContext
      ? `False-positive risk for “${requirement}”: recasting ${firstRelevant.note_id}'s ${firstRelevant.matched_terms.join("/")} wording as complete proof. ${mission.mission_id} still lacks an accepted identity, scope, time basis and denominator for this test.`
      : `False-positive risk for “${requirement}”: using ${mission.topic_label} membership or ${notes.length} adjacent notes as a proxy. ${mission.mission_id}'s ${mission.research_horizon.toLowerCase()} review cannot fill the missing bridge with another geography, stage, aggregate or forecast.`;
    const exactMissingRecord = hasRelevantContext
      ? `Missing for ${mission.mission_id}: a dated record directly documenting ${requirement.toLowerCase()}, beyond ${relevant_context.map((item) => item.matched_terms.join("/")).join(", ")} in ${relevant_context.map((item) => item.note_id).join(" and ")}. Apply the stored ${mission.research_horizon.toLowerCase()} period and denominator controls before admissibility review.`
      : `Missing for ${mission.mission_id}: a dated source whose subject and scope directly document ${requirement.toLowerCase()}. Test any candidate under that mission's method, period and denominator controls; this corpus gap does not establish external absence.`;
    const test = {
      test_id: `126-REQ-${pad(index + 1)}-${String(requirementIndex + 1).padStart(2, "0")}`,
      requirement_index: requirementIndex + 1,
      requirement,
      review_state: reviewState,
      context_note_ids: notes.map((note) => note.note_id),
      relevant_note_ids: relevant_context.map((item) => item.note_id),
      relevant_context,
      reasoning,
      false_positive_guard: falsePositiveGuard,
      exact_missing_record: exactMissingRecord,
    };
    test.analysis_word_count = words([
      test.reasoning,
      test.false_positive_guard,
      test.exact_missing_record,
      ...test.relevant_context.flatMap((item) => [item.relevance_reason, item.limitation_reason]),
    ].join(" "));
    test.rendered_word_count = test.analysis_word_count + words(test.relevant_context.map((item) => item.factual_excerpt).join(" "));
    return test;
  });
  const potentialRequirementCount = requirement_tests.filter((test) => test.review_state === potentialState).length;
  const noContextRequirementCount = requirement_tests.length - potentialRequirementCount;

  const narrative = {
    audit_summary: `${mission.mission_id} asks: ${mission.research_contract.question} The reason for prioritizing it is specific: ${mission.research_contract.why_priority} This overlay reviews the evidence already attached to the mission, not the wider web and not the unreviewed acquisition targets. It preserves the upstream state “${mission.answer_state}” because a context shelf, however credible, is not the same as a completed evidence contract.`,
    current_context: `The inherited shelf contains ${notes.length} Phase 125 annotations linked to ${sourceCount} source records. Its named records are ${noteTitles.join("; ")}. Each note carries the original Published signal identity, exact sources, factual nucleus, excluded inference, date distinctions, and measurement limitations. Together they show what the repository currently knows around the question. They have not been ranked, merged into a composite, or treated as interchangeable observations, and none receives requirement credit merely because it shares the topic.`,
    method_and_denominator: `The required method remains: ${mission.research_design.method} The period rule remains: ${mission.research_design.period} The denominator rule remains: ${mission.research_design.denominator} These controls are applied independently. A record can be useful for identity but incomplete for period, useful for chronology but incomplete for acceptance, or useful for operation but incompatible with an outcome comparison. No number of adjacent citations repairs a missing identity, method, period, or denominator.`,
    uncertainty_and_limits: `${packetReading} The audit tested three requirements in their original order: ${mission.research_contract.required_evidence.join("; ")}. It located potentially relevant, unaccepted context for ${potentialRequirementCount} and no screened-term overlap in title/factual nucleus for ${noContextRequirementCount}. Neither state is semantic adjudication or artifact acceptance. ${falsePositiveByHorizon[mission.research_horizon]} The result describes the reviewed fields only, not external nonexistence or system failure.`,
    completion_review: `The completion rule remains unchanged: ${mission.research_contract.completion_rule} The present shelf does not meet that rule because no requirement has a dated mission-specific evidence decision, and the audit has created no observation, result, receipt, stage advance, or answer. The audit is nevertheless useful: it exposes the exact context already available, prevents those records from being repeatedly rediscovered, and makes the unresolved evidence burden visible at requirement level.`,
    next_step: `${mission.stewardship.next_action} The reviewer should begin with the first unsatisfied requirement, maintain the exact topic, named entity, geography, period, method, and denominator, and record acceptance or rejection separately for every proposed source. ${packetState}. If the search cannot reach an exact record, the next state must remain a bounded blocker or explicit repository gap, never an invented result or an undated claim that evidence does not exist.`,
  };
  const narrativeWordCount = words(Object.values(narrative).join(" "));
  if (narrativeWordCount < 350) throw new Error(`${mission.mission_id} contains only ${narrativeWordCount} substantive audit words.`);

  return {
    audit_id: `126-AUDIT-${pad(index + 1)}`,
    mission_id: mission.mission_id,
    priority_question_id: mission.priority_question_id,
    topic_id: mission.topic_id,
    topic_slug: mission.topic_slug,
    research_horizon: mission.research_horizon,
    question: mission.research_contract.question,
    upstream_answer_state: mission.answer_state,
    audit_disposition: auditDisposition,
    evidence_note_ids: notes.map((note) => note.note_id),
    requirement_tests,
    strongest_current_context: {
      selection_state: "No strongest record selected — contextual shelf only",
      note_ids: notes.map((note) => note.note_id),
      reason: "The existing records have different subjects, stages, periods, and denominators. Phase 126 preserves all exact context links instead of manufacturing a strongest-evidence ranking.",
    },
    evidence_limits: [
      ...mission.missing_decisive_evidence,
      "No Phase 125 annotation is an artifact-admission or mission-satisfaction decision.",
      "Absence from this repository is not evidence of external nonexistence.",
    ],
    completion_review: {
      completion_rule: mission.research_contract.completion_rule,
      completed: false,
      reason: "No required evidence item has received a dated mission-specific acceptance decision.",
    },
    next_acquisition_action: mission.stewardship.next_action,
    narrative,
    narrative_word_count: narrativeWordCount,
    rendered_word_count: narrativeWordCount + requirement_tests.reduce((sum, test) => sum + test.rendered_word_count, 0),
    public_route: mission.public_route,
    interpretation_boundary: "This audit evaluates the sufficiency of the current repository shelf as context. It does not change the mission answer, admit an artifact, create a receipt, alter a source or signal, advance a project or conversion stage, or produce an observation, outcome, score, ranking, recommendation, forecast, or causal finding.",
  };
});

const requirementTests = mission_audits.flatMap((audit) => audit.requirement_tests);
if (requirementTests.length !== 204) throw new Error(`Phase 126 expected 204 ordered requirement tests, found ${requirementTests.length}.`);
const requirementNarratives = requirementTests.flatMap((test) => [
  test.reasoning,
  test.false_positive_guard,
  test.exact_missing_record,
  ...test.relevant_context.flatMap((item) => [item.relevance_reason, item.limitation_reason]),
]);
const repeatedEightGramRatio = ngramRepeatRatio(requirementNarratives);
if (repeatedEightGramRatio >= 0.55) throw new Error(`Phase 126 requirement prose repeats ${(repeatedEightGramRatio * 100).toFixed(1)}% of eight-gram occurrences.`);
const fingerprints = new Set(mission_audits.map((audit) => Object.values(audit.narrative).join(" ").toLowerCase().replace(/\s+/g, " ")));
if (fingerprints.size !== mission_audits.length) throw new Error("Phase 126 generated duplicate normalized audit narratives.");
const newHtmlRoutes = ["/review/fieldbook/mission-audits/"];
const enhancedRoutes = mission_audits.map((audit) => audit.public_route);
const gapCount = missions.missions.filter((mission) => mission.relationships.acquisition_packet_ids.length === 0).length;
if (gapCount !== 12) throw new Error(`Phase 126 must preserve 12 acquisition coverage gaps, found ${gapCount}.`);

const program = {
  schema_version: "1.0",
  program_id: "FTFN-PHASE-126-MISSION-EVIDENCE-AUDITS",
  phase: 126,
  title: "Mission Evidence Audits",
  effective_date: effectiveDate,
  record_status: "Published",
  status: "Complete",
  audit_disposition: auditDisposition,
  upstream_answer_state: fixedAnswerState,
  summary: "A requirement-by-requirement lexical screen of all sixty-eight Fieldbook missions, identifying exact potentially relevant notes and exact no-overlap findings without accepting evidence or changing any mission answer.",
  publication_boundaries: [
    "Phase 126 screens requirement terms against exact Phase 125 title and factual-nucleus fields. No screened-term overlap is not a semantic-relevance decision and never means that qualifying evidence does not exist outside the repository.",
    "Every Phase 121 answer state remains byte-for-byte unchanged and every requirement remains unadjudicated until a later dated evidence review.",
    "An annotation, context signal, source profile, or Candidate acquisition packet is not an admitted artifact or a requirement-satisfaction decision.",
    "Phase 126 creates no receipt, source fact, signal, project event, stage advance, observation, outcome, score, ranking, recommendation, forecast, or causal finding.",
  ],
  counts: {
    mission_audits: mission_audits.length,
    requirement_tests: requirementTests.length,
    requirements_with_potentially_relevant_context: requirementTests.filter((test) => test.review_state === potentialState).length,
    requirements_without_screened_term_overlap: requirementTests.filter((test) => test.review_state === noContextState).length,
    relevant_note_references: requirementTests.reduce((sum, test) => sum + test.relevant_note_ids.length, 0),
    contextual_relevance_8gram_repeat_ratio: Number(repeatedEightGramRatio.toFixed(4)),
    authored_requirement_words: requirementTests.reduce((sum, test) => sum + test.analysis_word_count, 0),
    rendered_audit_words: mission_audits.reduce((sum, audit) => sum + audit.rendered_word_count, 0),
    deduplicated_substantive_words: deduplicatedPassageWords(requirementNarratives),
    minimum_requirement_analysis_words: Math.min(...requirementTests.map((test) => test.analysis_word_count)),
    phase_125_notes_referenced: unique(mission_audits.flatMap((audit) => audit.evidence_note_ids)).length,
    phase_125_links_consumed: mission_audits.reduce((sum, audit) => sum + audit.evidence_note_ids.length, 0),
    missions_with_acquisition_packets: missions.missions.length - gapCount,
    missions_with_acquisition_coverage_gaps: gapCount,
    mission_answers_changed: 0,
    new_html_routes: newHtmlRoutes.length,
    enhanced_existing_routes: enhancedRoutes.length,
    substantive_surfaces: newHtmlRoutes.length + enhancedRoutes.length,
    public_json_exports: 1,
  },
  routes: { hub: newHtmlRoutes[0], new: newHtmlRoutes, enhanced: enhancedRoutes },
  mission_audits,
  new_html_routes: newHtmlRoutes,
  enhanced_existing_routes: enhancedRoutes,
  public_html_routes: [...newHtmlRoutes, ...enhancedRoutes],
  public_json_exports: ["/data/phase-126-mission-evidence-audits.json"],
};

await writeJson(join(appRoot, "src", "data", "phase-126-mission-evidence-audits.json"), program);
await writeJson(join(appRoot, "src", "content", "updates", "2026-08-30-phase-126-mission-evidence-audits.json"), {
  id: "update-2026-08-30-phase-126-mission-evidence-audits",
  effective_date: effectiveDate,
  entry_type: "Source Refresh",
  title: "Phase 126 audits contextual relevance for every Fieldbook requirement",
  summary: `${program.counts.requirement_tests} ordered requirements were screened against exact Phase 125 title and factual-nucleus fields: ${program.counts.requirements_with_potentially_relevant_context} retain potentially relevant, unaccepted context and ${program.counts.requirements_without_screened_term_overlap} have no screened-term overlap in those fields.`,
  affected_record_ids: mission_audits.map((audit) => audit.mission_id),
  related_paths: [...newHtmlRoutes, ...program.public_json_exports, ...enhancedRoutes],
  evidence_note: "Phase 126 records a bounded title/factual-nucleus lexical screen, not semantic or evidentiary adjudication. It changes no mission answer, admits no artifact, creates no receipt and advances no evidence or project state.",
  materiality: "No record-state change",
  publication_effect: "Adds one Fieldbook hub and one public JSON export while substantively enhancing exactly 68 existing mission routes.",
  next_check_date: null,
  work_package: "docs/work-packages/phase-126-v06-mission-evidence-audits.md",
});
console.log(`Phase 126 built: ${program.counts.mission_audits} audits, ${program.counts.requirement_tests} ordered tests, ${program.counts.authored_requirement_words} requirement-analysis words, ${gapCount} preserved gaps.`);
