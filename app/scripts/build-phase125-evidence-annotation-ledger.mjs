import { readFile, readdir, writeFile } from "node:fs/promises";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const appRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const readJson = async (...parts) => JSON.parse(await readFile(join(...parts), "utf8"));
const writeJson = (path, value) => writeFile(path, `${JSON.stringify(value, null, 2)}\n`, "utf8");
const effectiveDate = "2026-08-30";
const annotationState = "Published context annotated — no mission answer created";
const linkState = "Context only — requirement satisfaction not adjudicated";
const pad = (value, width = 3) => String(value).padStart(width, "0");
const words = (value) => String(value).trim().split(/\s+/).filter(Boolean).length;
const unique = (values) => [...new Set(values)];
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

async function loadSignals() {
  const directory = join(appRoot, "src", "content", "signals");
  const signals = new Map();
  for (const name of (await readdir(directory)).filter((item) => /\.mdx?$/.test(item)).sort()) {
    const block = frontmatter(await readFile(join(directory, name), "utf8"));
    const id = scalar(block, "id");
    signals.set(id, {
      id,
      title: scalar(block, "title"),
      slug: scalar(block, "slug"),
      record_status: scalar(block, "record_status"),
      summary: scalar(block, "summary"),
      source_ids: list(block, "source_ids"),
      published_date: scalar(block, "published_date"),
      captured_date: scalar(block, "captured_date"),
      primary_topic: scalar(block, "primary_topic"),
      framework_layers: list(block, "framework_layers"),
      signal_type: scalar(block, "signal_type"),
      maturity_level: scalar(block, "maturity_level"),
      time_horizon: scalar(block, "time_horizon"),
      evidence_quality: scalar(block, "evidence_quality"),
      verification_status: scalar(block, "verification_status"),
      why_it_matters: scalar(block, "why_it_matters"),
      dependencies: list(block, "dependencies"),
      constraints: list(block, "constraints"),
      receiving_systems: list(block, "receiving_systems"),
      local_implications: list(block, "local_implications"),
      claim_scope: scalar(block, "claim_scope"),
      local_evidence_level: scalar(block, "local_evidence_level"),
      last_reviewed_date: scalar(block, "last_reviewed_date"),
      editorial_notes: scalar(block, "editorial_notes"),
    });
  }
  return signals;
}

const [missions, signals] = await Promise.all([
  readJson(appRoot, "src", "data", "phase-121-priority-research-missions.json"),
  loadSignals(),
]);

const sources = new Map();
for (const name of (await readdir(join(appRoot, "src", "content", "sources"))).filter((item) => item.endsWith(".json")).sort()) {
  const source = await readJson(appRoot, "src", "content", "sources", name);
  sources.set(source.id, source);
}

if (missions.missions?.length !== 68) throw new Error("Phase 125 requires the exact 68 Phase 121 missions.");

const missionById = new Map(missions.missions.map((mission) => [mission.mission_id, mission]));
const signalIds = unique(missions.missions.flatMap((mission) => mission.relationships.context_signal_ids)).sort();
if (signalIds.length !== 82) throw new Error(`Phase 125 expected 82 distinct context signals, found ${signalIds.length}.`);

const evidence_annotations = signalIds.map((signalId, index) => {
  const signal = signals.get(signalId);
  if (!signal) throw new Error(`Phase 125 cannot resolve signal ${signalId}.`);
  if (signal.record_status !== "Published") throw new Error(`Phase 125 signal ${signalId} is not Published.`);
  const linkedMissions = missions.missions.filter((mission) => mission.relationships.context_signal_ids.includes(signalId));
  const sourceProfiles = signal.source_ids.map((sourceId) => {
    const source = sources.get(sourceId);
    if (!source) throw new Error(`Phase 125 signal ${signalId} references missing source ${sourceId}.`);
    return {
      source_id: source.id,
      name: source.name,
      source_type: source.source_type,
      credibility_level: source.credibility_level,
      country_or_region: source.country_or_region,
      last_checked_date: source.last_checked_date,
    };
  });
  const horizons = unique(linkedMissions.map((mission) => mission.research_horizon)).join(", ");
  const missionNames = linkedMissions.map((mission) => `${mission.mission_id} (${mission.research_horizon})`).join(", ");
  const missionQuestions = linkedMissions.map((mission) => `${mission.mission_id}: ${mission.research_contract.question}`).join("; ");
  const missionRequirements = unique(linkedMissions.flatMap((mission) => mission.research_contract.required_evidence)).join("; ");
  const sourceNames = sourceProfiles.map((source) => source.name).join(", ");
  const dependencies = signal.dependencies.length ? signal.dependencies.join(", ") : "no structured dependencies named";
  const constraints = signal.constraints.length ? signal.constraints.join(", ") : "no structured constraints named";
  const systems = signal.receiving_systems.length ? signal.receiving_systems.join(", ") : "no named receiving system";
  const editorialBoundary = signal.editorial_notes || "Retain the signal's existing summary and do not extend it beyond the cited source record.";

  const annotation = {
    factual_nucleus: signal.summary,
    bounded_support: `${signal.title} retains this narrower relevance: ${signal.why_it_matters} It is context for ${missionNames}, spanning ${horizons}. The annotation links that specific relevance to the mission shelf without awarding requirement credit.`,
    excluded_inference: `${editorialBoundary} For ${signal.id}, do not transfer the stated subject to another facility, population, geography, period, denominator or receiving system. Baseline, conversion, repeated operation and comparable outcome remain separate questions on the linked missions.`,
    provenance_reading: `${signal.id} resolves to ${sourceProfiles.length} source record${sourceProfiles.length === 1 ? "" : "s"}: ${sourceNames}. Its dates are publication ${signal.published_date || "not supplied"}, capture ${signal.captured_date}, and review ${signal.last_reviewed_date || "not separately supplied"}; each retains its own role. The recorded verification is ${signal.verification_status} with ${signal.evidence_quality} evidence quality.`,
    measurement_reading: `${signal.title} is classified ${signal.signal_type}/${signal.maturity_level}, scope ${signal.claim_scope || "not separately supplied"}, local level ${signal.local_evidence_level || "not separately supplied"}. Dependencies: ${dependencies}. Constraints: ${constraints}. Receiving system: ${systems}. Missing denominators, compatible periods, acceptance tests or attribution controls are not supplied by those labels.`,
    research_use: `Questions reached by this exact signal join are ${missionQuestions} Their distinct required records include ${missionRequirements}. A later reviewer can use ${signal.id} to screen those questions, then must test the exact source, subject, period, method and denominator under each mission's acceptance and rejection rules.`,
  };
  const renderedWordCount = words(Object.values(annotation).join(" "));
  const substantiveWordCount = words([
    annotation.bounded_support,
    annotation.excluded_inference,
    annotation.provenance_reading,
    annotation.measurement_reading,
    annotation.research_use,
  ].join(" "));
  if (substantiveWordCount < 120) throw new Error(`Phase 125 annotation ${signalId} contains only ${substantiveWordCount} substantive annotation words after its factual nucleus is excluded.`);

  return {
    note_id: `125-NOTE-${pad(index + 1)}`,
    signal_id: signal.id,
    signal_slug: signal.slug,
    signal_route: `/signals/${signal.slug}/`,
    topic_label: signal.primary_topic,
    source_ids: [...signal.source_ids],
    source_profiles: sourceProfiles,
    mission_ids: linkedMissions.map((mission) => mission.mission_id),
    evidence_identity: {
      title: signal.title,
      record_status: signal.record_status,
      published_date: signal.published_date || null,
      captured_date: signal.captured_date,
      last_reviewed_date: signal.last_reviewed_date || null,
      signal_type: signal.signal_type,
      maturity_level: signal.maturity_level,
      time_horizon: signal.time_horizon,
      evidence_quality: signal.evidence_quality,
      verification_status: signal.verification_status,
    },
    annotation,
    annotation_state: annotationState,
    rendered_word_count: renderedWordCount,
    substantive_word_count: substantiveWordCount,
    interpretation_boundary: "This annotation restates and bounds an existing Published signal. It creates no source fact, artifact decision, evidence admission, receipt, mission answer, conversion-stage advance, observation, outcome, score, ranking, recommendation, forecast, or causal finding.",
  };
});

const noteBySignalId = new Map(evidence_annotations.map((note) => [note.signal_id, note]));
const rawLinks = missions.missions.flatMap((mission) => mission.relationships.context_signal_ids.map((signalId) => ({ mission, signalId })))
  .sort((left, right) => left.mission.mission_id.localeCompare(right.mission.mission_id) || left.signalId.localeCompare(right.signalId));
if (rawLinks.length !== 340) throw new Error(`Phase 125 expected 340 mission-signal links, found ${rawLinks.length}.`);

const mission_signal_links = rawLinks.map(({ mission, signalId }, index) => {
  const note = noteBySignalId.get(signalId);
  if (!note || !missionById.has(mission.mission_id)) throw new Error(`Phase 125 cannot resolve mission-signal link ${mission.mission_id}/${signalId}.`);
  return {
    link_id: `125-LINK-${pad(index + 1)}`,
    mission_id: mission.mission_id,
    note_id: note.note_id,
    signal_id: signalId,
    topic_id: mission.topic_id,
    research_horizon: mission.research_horizon,
    use_state: linkState,
    reasoning: `${note.evidence_identity.title} is part of the exact Published context shelf inherited by ${mission.mission_id}. It can frame the ${mission.research_horizon.toLowerCase()} question, but it has not been tested against the mission's three required evidence items and cannot satisfy them by association.`,
  };
});

const sourceUnion = unique(evidence_annotations.flatMap((note) => note.source_ids)).sort();
if (sourceUnion.length !== 114) throw new Error(`Phase 125 expected an exact 114-source union, found ${sourceUnion.length}.`);
const newHtmlRoutes = ["/review/fieldbook/evidence-notes/"];
const enhancedRoutes = evidence_annotations.map((note) => note.signal_route);
const fingerprints = new Set(evidence_annotations.map((note) => Object.values(note.annotation).join(" ").toLowerCase().replace(/\s+/g, " ")));
if (fingerprints.size !== evidence_annotations.length) throw new Error("Phase 125 generated duplicate normalized annotation narratives.");
const substantivePassages = evidence_annotations.flatMap((note) => [
  note.annotation.bounded_support,
  note.annotation.excluded_inference,
  note.annotation.provenance_reading,
  note.annotation.measurement_reading,
  note.annotation.research_use,
]);
const repeatedEightGramRatio = ngramRepeatRatio(substantivePassages);

const program = {
  schema_version: "1.0",
  program_id: "FTFN-PHASE-125-EVIDENCE-ANNOTATION-LEDGER",
  phase: 125,
  title: "Source-linked Evidence Annotation Ledger",
  effective_date: effectiveDate,
  record_status: "Published",
  status: "Complete",
  annotation_state: annotationState,
  summary: "An in-place annotation of the exact Published evidence shelf already connected to the sixty-eight Fieldbook missions, showing what each record supports, what it cannot support, and how it may be used without adjudicating a mission.",
  publication_boundaries: [
    "Phase 125 annotates existing Published signals and exact source relationships; it does not create or admit an artifact, source fact, signal, receipt, observation, outcome, score, ranking, recommendation, forecast, or causal finding.",
    "Mission applicability is a context join, not requirement satisfaction. Every Phase 121 answer state and every Phase 120 acquisition disposition remains unchanged.",
    "Not established inside the current corpus never means that evidence does not exist outside the repository.",
    "The eleven Phase 60 gates after August 30 remain scheduled, undecided, and without receipts.",
  ],
  counts: {
    evidence_annotations: evidence_annotations.length,
    published_signals_annotated: evidence_annotations.length,
    source_records_resolved: sourceUnion.length,
    mission_signal_links: mission_signal_links.length,
    missions_reached: unique(mission_signal_links.map((link) => link.mission_id)).length,
    new_html_routes: newHtmlRoutes.length,
    enhanced_existing_routes: enhancedRoutes.length,
    substantive_surfaces: newHtmlRoutes.length + enhancedRoutes.length,
    public_json_exports: 1,
    rendered_annotation_words: evidence_annotations.reduce((sum, note) => sum + note.rendered_word_count, 0),
    substantive_annotation_words: evidence_annotations.reduce((sum, note) => sum + note.substantive_word_count, 0),
    deduplicated_substantive_words: deduplicatedPassageWords(substantivePassages),
    minimum_substantive_note_words: Math.min(...evidence_annotations.map((note) => note.substantive_word_count)),
    substantive_8gram_repeat_ratio: Number(repeatedEightGramRatio.toFixed(4)),
  },
  routes: { hub: newHtmlRoutes[0], new: newHtmlRoutes, enhanced: enhancedRoutes },
  source_union_ids: sourceUnion,
  evidence_annotations,
  mission_signal_links,
  new_html_routes: newHtmlRoutes,
  enhanced_existing_routes: enhancedRoutes,
  public_html_routes: [...newHtmlRoutes, ...enhancedRoutes],
  public_json_exports: ["/data/phase-125-evidence-annotation-ledger.json"],
};

await writeJson(join(appRoot, "src", "data", "phase-125-evidence-annotation-ledger.json"), program);
await writeJson(join(appRoot, "src", "content", "updates", "2026-08-30-phase-125-evidence-annotation-ledger.json"), {
  id: "update-2026-08-30-phase-125-evidence-annotation-ledger",
  effective_date: effectiveDate,
  entry_type: "Source Refresh",
  title: "Phase 125 annotates the mission evidence shelf in place",
  summary: "Eighty-two existing Published signals now expose source-linked factual nuclei, bounded support, excluded inferences, measurement limits and exact context relationships across all 340 mission-signal joins.",
  affected_record_ids: evidence_annotations.map((note) => note.signal_id),
  related_paths: [...newHtmlRoutes, ...program.public_json_exports, ...enhancedRoutes],
  evidence_note: "Phase 125 annotates only existing Published context. It creates no artifact admission, source fact, signal, receipt, mission answer, evidence decision, observation, stage advance, outcome, score or ranking.",
  materiality: "No record-state change",
  publication_effect: "Adds one Fieldbook hub and one public JSON export while substantively enhancing exactly 82 existing signal routes.",
  next_check_date: null,
  work_package: "docs/work-packages/phase-125-v06-evidence-annotation-ledger.md",
});
console.log(`Phase 125 built: ${program.counts.evidence_annotations} annotations, ${program.counts.source_records_resolved} sources, ${program.counts.mission_signal_links} mission joins, ${program.counts.substantive_annotation_words} substantive words.`);
