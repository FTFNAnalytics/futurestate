import { readFile, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

const appRoot = fileURLToPath(new URL("..", import.meta.url));
const contentRoot = join(appRoot, "src", "content");
const dataRoot = join(appRoot, "src", "data");
const capturedDate = "2026-08-10";
const collectionSlug = "dated-evidence-return-council-adoption-results-gates-hold-resolution-decisions-2026";
const collectionId = `research-collection-${collectionSlug}`;
const briefingId = "briefing-research-watch-056-dated-evidence-return-and-hold-resolution";
const readJson = async (path) => JSON.parse(await readFile(path, "utf8"));
const writeJson = async (path, value) => writeFile(path, `${JSON.stringify(value, null, 2)}\n`, "utf8");
const unique = (values) => [...new Set(values)];
const yamlList = (values, indent = 2) => values.map((value) => `${" ".repeat(indent)}- ${JSON.stringify(value)}`).join("\n");

const phase57y = await readJson(join(dataRoot, "phase-57y-federation-remediation-rotation-recusal-holdover-rollout-recovery.json"));
const inheritedHolds = phase57y.records.filter((record) => record.record_status === "In Review");
if (inheritedHolds.length !== 9) throw new Error(`Expected nine Phase 57Y holds, found ${inheritedHolds.length}.`);

const holdSpecs = [
  {
    prefix: "AMTRAK-PIDS-CLOSEOUT-HOLD",
    slug: "amtrak-pids-closeout",
    label: "Amtrak PIDS closeout",
    sourceId: "source-57b-amtrak-ada-progress-june-2026",
    publisher: "Amtrak",
    topics: ["Mobility", "Human Futures"],
    layers: ["Enabling Infrastructure", "Human Systems"],
    constraints: ["Infrastructure", "Data Quality", "Public Trust"],
    finding: "Amtrak's June 2026 ADA report records 93 PIDS deployments and marks the program period complete, but it also describes FRA closeout as pending review; it does not supply a final FRA closeout artifact.",
    missing: "A final FRA-accepted closeout record tied to the PIDS program scope and completed deployment denominator.",
  },
  {
    prefix: "AMTRAK-NAMED-RELIABILITY-HOLD",
    slug: "amtrak-named-asset-reliability",
    label: "Amtrak named-asset reliability",
    sourceId: "source-57e-amtrak-accessibility-progress-june-2026",
    publisher: "Amtrak",
    topics: ["Mobility", "Human Futures"],
    layers: ["Enabling Infrastructure", "Human Systems"],
    constraints: ["Infrastructure", "Data Quality", "Public Trust"],
    finding: "The current accessibility portfolio reporting supplies program and deployment counts but no repeated named-asset uptime, failure, repair, or service-quality series for the target PIDS assets.",
    missing: "A repeated named-asset reliability series with a stable asset identity, period, denominator, failure definition, and repair outcome.",
  },
  {
    prefix: "LA-BEAD-NEXTLINK-VALIDATION-HOLD",
    slug: "louisiana-nextlink-adoption",
    label: "Louisiana Nextlink adoption",
    sourceId: "source-57b-louisiana-nextlink-first-bead-tower",
    publisher: "Louisiana Office of Broadband Development and Connectivity",
    topics: ["Human Futures", "Mobility"],
    layers: ["Enabling Infrastructure", "Human Systems"],
    constraints: ["Infrastructure", "Public Trust", "Data Quality"],
    finding: "ConnectLA reports the first BEAD-funded Nextlink tower active and service available to 104 BEAD locations, but it does not report observed subscribers, take rate, or a fixed-cohort adoption outcome.",
    missing: "Observed subscription or take-rate evidence for a fixed eligible-location cohort after service availability.",
  },
  {
    prefix: "LA-BEAD-STARLINK-HOLD",
    slug: "louisiana-starlink-adoption",
    label: "Louisiana Starlink adoption",
    sourceId: "source-57b-louisiana-starlink-bead-agreement",
    publisher: "Louisiana Office of Broadband Development and Connectivity",
    topics: ["Human Futures", "Mobility"],
    layers: ["Enabling Infrastructure", "Human Systems"],
    constraints: ["Infrastructure", "Public Trust", "Data Quality"],
    finding: "ConnectLA's Starlink agreement describes planned access for 10,635 locations by the end of summer, but it does not report observed subscriptions, installations, or adoption outcomes.",
    missing: "Observed subscription or installation evidence for a fixed eligible-location cohort after service becomes available.",
  },
  {
    prefix: "MT-BEAD-QUARTERLY-HOLD",
    slug: "montana-bead-completed-quarter",
    label: "Montana BEAD completed quarter",
    sourceId: "source-57f-montana-bead-resource-index-august-2026",
    publisher: "Montana Department of Administration",
    topics: ["Human Futures", "Policy and Standards"],
    layers: ["Enabling Infrastructure", "Human Systems"],
    constraints: ["Infrastructure", "Regulation", "Data Quality"],
    finding: "ConnectMT publishes reporting instructions and a deployment-resource framework, but the reviewed public materials do not yet expose one completed quarterly project outcome with a stable denominator.",
    missing: "One complete public quarterly report with project identity, reporting period, locations, completion state, and outcome denominator.",
  },
  {
    prefix: "HANFORD-WTP-MASS-BALANCE-HOLD",
    slug: "hanford-complete-material-balance",
    label: "Hanford complete material balance",
    sourceId: "source-57d-hanford-wtp-consent-july-2026",
    publisher: "Washington State Department of Ecology",
    topics: ["Energy", "Human Futures"],
    layers: ["Resource Foundations", "Enabling Infrastructure"],
    constraints: ["Infrastructure", "Safety", "Data Quality"],
    finding: "The July 2026 Tri-Party Agreement report says the Waste Treatment Plant completed initial hot commissioning and progressed into extended hot commissioning, but it does not provide a complete input-to-output material balance.",
    missing: "A complete compatible material balance covering feed, immobilized glass, secondary waste, inventory change, losses, period, and reconciliation method.",
  },
  {
    prefix: "NNSA-PIT-RATE-HOLD",
    slug: "nnsa-recurring-qualified-rate",
    label: "NNSA recurring qualified rate",
    sourceId: "source-57f-nnsa-pit-production-current",
    publisher: "National Nuclear Security Administration",
    topics: ["Energy", "Advanced Manufacturing", "Policy and Standards"],
    layers: ["Resource Foundations", "Enabling Infrastructure"],
    constraints: ["Manufacturing", "Safety", "Data Quality"],
    finding: "NNSA's current pit-production materials describe program plans and capacity objectives, but they do not provide a repeated observed series of qualified pits accepted over compatible periods.",
    missing: "A recurring qualified-output series with acceptance definition, facility identity, period, denominator, and comparable rate calculation.",
  },
  {
    prefix: "NNSA-PIT-PEIS-HOLD",
    slug: "nnsa-accepted-operating-capacity",
    label: "NNSA accepted operating capacity",
    sourceId: "source-57b-nnsa-pit-production-draft-peis-2026",
    publisher: "National Nuclear Security Administration",
    topics: ["Energy", "Advanced Manufacturing", "Policy and Standards"],
    layers: ["Resource Foundations", "Enabling Infrastructure"],
    constraints: ["Manufacturing", "Safety", "Regulation"],
    finding: "The 2026 Draft PEIS evaluates programmatic alternatives and projected capacity, but a draft environmental review is not an accepted operating-capacity record and does not establish realized qualified output.",
    missing: "A final accepted operating-capacity artifact linked to operating configuration, acceptance criteria, and observed qualified output.",
  },
  {
    prefix: "NNSA-PIT-GAO-BASELINE-HOLD",
    slug: "nnsa-gao-enterprise-baseline",
    label: "NNSA GAO enterprise baseline",
    sourceId: "source-56q-gao-23-104661-recommendation-status",
    publisher: "U.S. Government Accountability Office",
    topics: ["Energy", "Finance and Risk", "Policy and Standards"],
    layers: ["Resource Foundations", "Enabling Infrastructure"],
    constraints: ["Capital", "Regulation", "Data Quality"],
    finding: "GAO's recommendation record remains the controlling exact source; the reviewed public evidence does not establish a final enterprise-wide integrated cost and schedule baseline satisfying the recommendation.",
    missing: "A final enterprise baseline and GAO closure evidence tied to the exact recommendation identity and acceptance criteria.",
  },
];

const sourceById = new Map();
for (const spec of holdSpecs) {
  const source = await readJson(join(contentRoot, "sources", `${spec.sourceId}.json`));
  sourceById.set(spec.sourceId, source);
}
for (const sourceId of ["source-toronto-2026-sc33-9-item-history", "source-darpa-lift-challenge-2026"]) {
  sourceById.set(sourceId, await readJson(join(contentRoot, "sources", `${sourceId}.json`)));
}

const records = [
  {
    decision_id: "57Z-DECISION-TORONTO-COUNCIL-ADOPTION",
    record_type: "dated_advancement",
    target: "Toronto application 24 254930",
    parent_hold_key: null,
    source_id: "source-toronto-2026-sc33-9-item-history",
    source_url: sourceById.get("source-toronto-2026-sc33-9-item-history").url,
    decision: "publish_dated_advancement",
    underlying_signal_id: "signal-toronto-24-254930-community-council-recommendation",
    underlying_signal_status: "Published",
    finding: "City Council adopted item 2026.SC33.9 without amendments and without debate on July 29-30, 2026.",
    missing: "Enacted amendment by-laws, satisfied bill-withholding conditions, a building permit, construction start, completion, and occupancy.",
  },
  {
    decision_id: "57Z-DECISION-DARPA-RESULTS-GATE",
    record_type: "dated_gate_recheck",
    target: "DARPA Lift Challenge official results",
    parent_hold_key: null,
    source_id: "source-darpa-lift-challenge-2026",
    source_url: sourceById.get("source-darpa-lift-challenge-2026").url,
    decision: "keep_signal_in_review",
    underlying_signal_id: "signal-darpa-lift-challenge-2026-scheduled-field-trial",
    underlying_signal_status: "In Review",
    finding: "Official challenge materials identify the August 2-9 event and August 9 awards ceremony, but no reviewed official artifact yet supplies final measured results, scores, winners, prizes, or transition evidence.",
    missing: "A dated DARPA final-results artifact with measured performance and prize decisions.",
  },
];

for (const spec of holdSpecs) {
  const parent = inheritedHolds.find((record) => record.action_key.startsWith(spec.prefix));
  if (!parent) throw new Error(`Missing inherited hold for ${spec.prefix}.`);
  records.push({
    decision_id: `57Z-DECISION-${spec.slug.toUpperCase().replaceAll("-", "_")}`,
    record_type: "inherited_hold_recheck",
    target: spec.label,
    parent_hold_key: parent.action_key,
    source_id: spec.sourceId,
    source_url: sourceById.get(spec.sourceId).url,
    decision: "hold_not_resolved",
    underlying_signal_id: parent.signal_id,
    underlying_signal_status: "In Review",
    finding: spec.finding,
    missing: spec.missing,
  });
}

const documentSpecs = [
  {
    number: 1522,
    slug: "57z-toronto-council-adoption",
    title: "Toronto application 24 254930 clears the City Council gate with enactment conditions retained",
    publisher: "City of Toronto",
    publicationDate: "2026-07-30",
    topics: ["Human Futures"],
    layers: ["Enabling Infrastructure", "Human Systems"],
    constraints: ["Regulation", "Permitting", "Infrastructure"],
    record: records[0],
  },
  {
    number: 1523,
    slug: "57z-darpa-official-results-gate-recheck",
    title: "DARPA Lift Challenge official-results gate remains open after the event window",
    publisher: "Defense Advanced Research Projects Agency",
    publicationDate: "2026-08-10",
    topics: ["Aviation", "Mobility", "Advanced Manufacturing"],
    layers: ["Enabling Infrastructure", "Frontier Domains"],
    constraints: ["Manufacturing", "Certification", "Data Quality"],
    record: records[1],
  },
];
holdSpecs.forEach((spec, index) => documentSpecs.push({
  number: 1524 + index,
  slug: `57z-${spec.slug}-hold-recheck`,
  title: `${spec.label} remains held after the Phase 57Z exact-evidence recheck`,
  publisher: spec.publisher,
  publicationDate: null,
  topics: spec.topics,
  layers: spec.layers,
  constraints: spec.constraints,
  record: records[index + 2],
}));

for (const [index, spec] of documentSpecs.entries()) {
  const record = spec.record;
  const documentId = `research-doc-${spec.slug}`;
  record.document_id = documentId;
  record.document_number = spec.number;
  await writeJson(join(contentRoot, "research-documents", `${spec.number}-${spec.slug}.json`), {
    id: documentId,
    collection_id: collectionId,
    title: spec.title,
    slug: spec.slug,
    record_status: "Published",
    publisher: spec.publisher,
    publication_date: spec.publicationDate,
    document_type: "Technical Report",
    summary: `${record.finding} Decision: ${record.decision.replaceAll("_", " ")}.`,
    key_findings: [
      `Evidence-return decision: ${record.decision.replaceAll("_", " ")}.`,
      `Finding: ${record.finding}`,
      `Still required: ${record.missing}`,
      `Underlying signal status after review: ${record.underlying_signal_status}.`,
    ],
    why_it_matters: "The dated recheck records what changed, what did not, and the exact next evidence needed without turning a negative search result or adjacent artifact into an outcome claim.",
    ftfn_relevance: [
      "Returns the roadmap from synthetic controls to dated primary-source evidence.",
      "Separates a publishable research decision from the status of the underlying outcome signal.",
      "Preserves explicit conversion gates and denominators for the next recheck.",
    ],
    evidence_limits: [
      "Not located in the reviewed official sources does not mean nonexistent, withheld, or never produced.",
      "A dated advancement does not satisfy later enactment, implementation, operation, adoption, reliability, or outcome gates.",
      `Still required: ${record.missing}`,
      "No agency contact or FOIA request was made in this phase.",
    ],
    primary_topics: spec.topics,
    framework_layers: spec.layers,
    constraint_tags: spec.constraints,
    source_id: record.source_id,
    official_url: record.source_url,
    local_capture_path: `/downloads/${collectionSlug}/official-links/${String(index + 1).padStart(2, "0")}-phase57z-record.txt`,
    archive_member: `official-links/${String(index + 1).padStart(2, "0")}-phase57z-record.txt`,
    capture_status: "Official link record",
    captured_date: capturedDate,
  });
}

const ledger = {
  phase: "57Z",
  captured_date: capturedDate,
  phase_mode: "dated evidence return and bounded hold-resolution review",
  reviewed_decisions: records.length,
  published_research_decisions: documentSpecs.length,
  dated_advancements: 1,
  signals_promoted: 1,
  signals_kept_in_review: 10,
  inherited_holds_reviewed: 9,
  inherited_holds_resolved: 0,
  inherited_holds_remaining: 9,
  duplicate_hold_signals_created: 0,
  new_source_profiles: 0,
  public_agency_contacts_or_foia_requests: 0,
  post_batch_closure_counts: phase57y.post_batch_closure_counts,
  records,
};
await writeJson(join(dataRoot, "phase-57z-dated-evidence-return-hold-resolution-decisions.json"), ledger);
await writeJson(join(dataRoot, "phase-57z-publication-review.json"), {
  phase: "57Z",
  captured_date: capturedDate,
  published_research_document_ids: documentSpecs.map((spec) => `research-doc-${spec.slug}`),
  promoted_signal_ids: [records[0].underlying_signal_id],
  held_signal_ids: records.slice(1).map((record) => record.underlying_signal_id),
  inherited_hold_decisions: records.slice(2).map((record) => ({ parent_hold_key: record.parent_hold_key, decision: record.decision, exact_missing_evidence: record.missing })),
  editorial_boundary: "A bounded evidence-return decision may be Published while the underlying outcome signal remains In Review. No duplicate hold signal is created.",
});

await writeJson(join(contentRoot, "research-collections", `${collectionSlug}.json`), {
  id: collectionId,
  title: "Dated Evidence Return: Council Adoption, Results Gates, and Hold-Resolution Decisions, 2026",
  slug: collectionSlug,
  record_status: "Published",
  summary: "Phase 57Z publishes eleven bounded evidence-return decisions: one Toronto Council advancement, one DARPA official-results gate recheck, and nine inherited hold reviews with zero unsupported resolutions.",
  scope: "Eleven primary-source rechecks, one signal promotion, ten signals retained In Review, zero new source profiles, zero duplicate hold signals, and an unchanged one Closed / twenty-one Partially Closed / two Open entity ledger.",
  captured_date: capturedDate,
  document_ids: documentSpecs.map((spec) => `research-doc-${spec.slug}`),
  download_path: `/downloads/${collectionSlug}.zip`,
  download_note: "The fourteen-file archive contains eleven official-link records, consolidated summaries, a README, and a checksum manifest.",
  method_note: "Each record distinguishes a publishable evidence-review decision from the maturity of its underlying signal. Negative rechecks are bounded to the official pages reviewed on August 10, 2026 and never become nonexistence claims.",
});

const briefing = `---
id: "${briefingId}"
title: "Research Watch 056: Dated Evidence Return and Hold Resolution"
slug: "research-watch-056-dated-evidence-return-and-hold-resolution"
record_status: "Published"
summary: "Phase 57Z returns the roadmap to dated primary-source evidence: Toronto clears its Council gate, DARPA's official-results gate remains open, and all nine inherited outcome holds remain unresolved after exact-source rechecks."
published_date: 2026-08-10
captured_date: 2026-08-10
signal_ids:
${yamlList([records[0].underlying_signal_id, records[1].underlying_signal_id])}
evidence_gap_ids:
  - "gap-004"
  - "gap-005"
  - "gap-008"
  - "gap-015"
  - "gap-016"
claim_scope: "Editorial Synthesis"
local_evidence_level: "Project-Level Evidence"
last_reviewed_date: 2026-08-10
top_takeaways:
  - "Toronto City Council adopted item 2026.SC33.9 without amendments and without debate on July 29-30, but the amendment bills remain subject to explicit wind, land-exchange, and laneway conditions."
  - "DARPA's event window has passed, but official measured results, scores, winners, prizes, and transition evidence were not present in the reviewed official materials."
  - "Nine inherited outcome holds were rechecked and none received the exact evidence needed for resolution."
constraint_watch:
  - "Data Quality"
  - "Regulation"
  - "Public Trust"
what_to_watch_next:
  - "Toronto enacted by-law numbers and satisfaction of the bill-withholding conditions"
  - "A dated DARPA final-results artifact with measured performance and prize decisions"
  - "The exact closeout, reliability, adoption, quarterly, material-balance, qualified-rate, accepted-capacity, or enterprise-baseline artifact for any inherited hold"
---

## What moved

Toronto's official item history now records a completed City Council decision. That advancement is Published at the Council stage and stops before by-law enactment, permit issuance, construction, completion, or occupancy.

## What stayed held

The DARPA result signal and all nine inherited outcome signals remain In Review. Phase 57Z publishes the review decisions themselves so readers can see the checked source, the bounded finding, and the exact missing artifact without mistaking research activity for outcome evidence.

## Evidence boundary

No new source profile, agency contact, FOIA request, duplicate hold signal, unsupported closure, or operating-outcome change was created. The entity ledger remains one Closed, twenty-one Partially Closed, and two Open.
`;
await writeFile(join(contentRoot, "briefings", "research-watch-056-dated-evidence-return-and-hold-resolution.mdx"), briefing, "utf8");

await writeJson(join(contentRoot, "updates", "2026-08-10-phase-57z-dated-evidence-return-hold-resolution.json"), {
  id: "update-2026-08-10-phase-57z-dated-evidence-return-hold-resolution",
  effective_date: capturedDate,
  entry_type: "Research Collection",
  title: "Phase 57Z returns the roadmap to dated evidence and bounded hold-resolution decisions",
  summary: "Eleven evidence-review records publish one dated Toronto advancement, preserve the DARPA results gate, and keep all nine inherited outcome holds unresolved without creating duplicate hold signals.",
  affected_record_ids: [collectionId, briefingId, records[0].underlying_signal_id, records[1].underlying_signal_id, ...documentSpecs.map((spec) => `research-doc-${spec.slug}`)],
  related_paths: [`/research/${collectionSlug}/`, "/briefings/research-watch-056-dated-evidence-return-and-hold-resolution/", "/signals/toronto-24-254930-scarborough-community-council-recommendation/", "/signals/darpa-lift-challenge-2026-scheduled-field-trial/"],
  evidence_note: "The Toronto promotion is limited to Council adoption. Every later Toronto gate, the DARPA results gate, and all nine inherited outcome gates remain explicit.",
  work_package: "docs/work-packages/phase-57z-dated-evidence-return-hold-resolution.md",
});

const topicQuestions = {
  "human-futures.json": "Phase 57Z: Which dated enactment, adoption, or service-outcome artifact can move a Council or broadband availability record into realized delivery?",
  "aviation.json": "Phase 57Z: Has DARPA published an official Lift Challenge results artifact with measured performance and prize decisions?",
  "mobility.json": "Phase 57Z: Which exact closeout, named-asset reliability, or official trial-result artifact is now available?",
  "policy-and-standards.json": "Phase 57Z: Does a new primary artifact satisfy the exact held recommendation, enactment, reporting, or acceptance gate?",
  "finance-and-risk.json": "Phase 57Z: Has an accepted enterprise baseline or compatible realized-outcome denominator replaced the current planning evidence?",
  "energy.json": "Phase 57Z: Is there now a complete Hanford material balance, recurring qualified pit rate, accepted capacity record, or GAO-closed enterprise baseline?",
};
for (const [file, question] of Object.entries(topicQuestions)) {
  const topic = await readJson(join(contentRoot, "topics", file));
  if (!topic.watch_questions.includes(question)) topic.watch_questions.push(question);
  await writeJson(join(contentRoot, "topics", file), topic);
}

const stage = "Phase 57Z dated evidence return and bounded hold-resolution decisions";
for (const file of ["policy-standards-to-implementation.json", "cross-corridor-authorization-to-operation.json", "energy-grid-capacity-to-service.json"]) {
  const pathway = await readJson(join(contentRoot, "reader-pathways", file));
  pathway.research_collection_ids = unique([...pathway.research_collection_ids, collectionId]);
  pathway.briefing_ids = unique([...pathway.briefing_ids, briefingId]);
  pathway.signal_ids = unique([...pathway.signal_ids.filter((id) => id !== records[1].underlying_signal_id), records[0].underlying_signal_id]);
  pathway.source_ids = unique([...pathway.source_ids, ...records.map((record) => record.source_id)]);
  if (!pathway.dependency_stack.some((item) => item.stage === stage)) pathway.dependency_stack.push({
    stage,
    current_state: "One dated Council advancement is Published; the DARPA result gate and nine inherited outcome holds remain In Review after exact-source rechecks.",
    boundary: "A publishable research decision does not resolve an outcome hold, and an event window or adjacent artifact cannot substitute for exact measured evidence.",
  });
  await writeJson(join(contentRoot, "reader-pathways", file), pathway);
}

const mapPath = join(contentRoot, "dependency-maps", "comparative-outcomes-require-common-denominators.json");
const map = await readJson(mapPath);
const nodeId = "node-phase57z-dated-evidence-return";
if (!map.nodes.some((node) => node.id === nodeId)) map.nodes.push({
  id: nodeId,
  label: "Eleven dated evidence-return decisions; one Council advancement, one official-results gate, and nine unresolved outcome holds",
  node_type: "Signal",
  note: "Phase 57Z distinguishes evidence-review completion from outcome resolution and records the exact missing artifact for every held gate.",
});
const links = [
  ["node-phase57y-remediation-long-term-recovery", "Depends On", "Supported", "The evidence-return sweep uses the preserved Phase 57Y hold lineage without creating a second hold layer."],
  ["node-gap", "Limited By", "Missing Evidence", "Ten underlying signals remain held because their exact result or outcome artifacts are still absent from the reviewed official evidence."],
  ["node-attribution", "Limited By", "Missing Evidence", "A Council action or reviewed source update does not establish realized delivery, attribution, or causation."],
];
for (const [to, relationship, confidence, note] of links) if (!map.links.some((link) => link.from === nodeId && link.to === to)) map.links.push({ from: nodeId, to, relationship, confidence, note });
map.source_ids = unique([...map.source_ids, ...records.map((record) => record.source_id)]);
map.signal_ids = unique([...map.signal_ids.filter((id) => id !== records[1].underlying_signal_id), records[0].underlying_signal_id]);
await writeJson(mapPath, map);

console.log(`Generated Phase 57Z: ${records.length} evidence-return decisions, 1 dated advancement, 1 signal promotion, 0 of 9 inherited holds resolved.`);
