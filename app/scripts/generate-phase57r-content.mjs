import { mkdir, readFile, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { runPhase57rHarness } from "./phase57r-publication-status-harness.mjs";

const appRoot = fileURLToPath(new URL("..", import.meta.url));
const contentRoot = join(appRoot, "src", "content");
const dataRoot = join(appRoot, "src", "data");
const capturedDate = "2026-08-09";
const collectionSlug = "publication-status-change-notices-restore-republication-provenance-2026";
const collectionId = `research-collection-${collectionSlug}`;
const briefingSlug = "research-watch-048-publication-status-change-notices-provenance";
const briefingId = `briefing-${briefingSlug}`;
const json = (value) => `${JSON.stringify(value, null, 2)}\n`;
const writeJson = async (path, value) => writeFile(path, json(value), "utf8");
const yamlList = (name, items) => [name + ":", ...items.map((item) => `  - ${JSON.stringify(item)}`)].join("\n");
const appendUnique = (items, additions) => [...new Set([...(items ?? []), ...additions])];

for (const name of ["research-documents", "signals", "research-collections", "briefings", "updates"]) await mkdir(join(contentRoot, name), { recursive: true });

const phase57q = JSON.parse(await readFile(join(dataRoot, "phase-57q-manual-release-authorization-publication-bundles-withdrawal-rollback-receipts.json"), "utf8"));
const lifecycle57q = JSON.parse(await readFile(join(dataRoot, "phase-57q-withdrawal-rollback-receipt-fixtures.json"), "utf8"));
if (phase57q.phase !== "57Q" || phase57q.records.length !== 45 || lifecycle57q.schemas.length !== 9) throw new Error("Phase 57R requires the complete Phase 57Q baseline.");
const harness = runPhase57rHarness(lifecycle57q.schemas);
if (harness.statusCases.length !== 126 || harness.noticeCases.length !== 126 || harness.restoreCases.length !== 144 || harness.allCases.length !== 396 || harness.failures.length) throw new Error("Phase 57R requires 396 passing status, notice, restore, and provenance cases.");

const authorityBoundary = "Agency assertions, regulator evidence, FTFN controls, evidence-review identity, publication-review identity, release identity, publication identity, withdrawal identity, rollback identity, restore identity, republication identity, GAO acceptance, implementation, capability, closure, attribution, and operating outcomes remain separate evidence states.";
const labels = {
  "REOPEN-AMTRAK-PIDS": { slug: "amtrak-pids", label: "Amtrak PIDS closeout", prefix: "AMTRAK-PIDS", publisher: "National Railroad Passenger Corporation", topics: ["Mobility", "Policy and Standards", "Finance and Risk"], layers: ["Enabling Infrastructure", "Human Systems"], gaps: ["gap-015", "gap-016"] },
  "REOPEN-AMTRAK-RELIABILITY": { slug: "amtrak-reliability", label: "Amtrak named-asset reliability", prefix: "AMTRAK-RELIABILITY", publisher: "National Railroad Passenger Corporation", topics: ["Mobility", "Policy and Standards", "Finance and Risk"], layers: ["Enabling Infrastructure", "Human Systems"], gaps: ["gap-015", "gap-016"] },
  "REOPEN-LA-NEXTLINK-ADOPTION": { slug: "la-nextlink-adoption", label: "Louisiana Nextlink adoption", prefix: "LA-NEXTLINK", publisher: "National Telecommunications and Information Administration", topics: ["Chips and Compute", "Policy and Standards", "Finance and Risk"], layers: ["Enabling Infrastructure", "Human Systems"], gaps: ["gap-016"] },
  "REOPEN-LA-STARLINK-ADOPTION": { slug: "la-starlink-adoption", label: "Louisiana Starlink adoption", prefix: "LA-STARLINK", publisher: "National Telecommunications and Information Administration", topics: ["Chips and Compute", "Policy and Standards", "Finance and Risk"], layers: ["Enabling Infrastructure", "Human Systems"], gaps: ["gap-016"] },
  "REOPEN-MT-BEAD-QUARTER": { slug: "mt-bead-quarter", label: "Montana BEAD completed quarter", prefix: "MT-BEAD", publisher: "National Telecommunications and Information Administration", topics: ["Chips and Compute", "Policy and Standards", "Finance and Risk"], layers: ["Enabling Infrastructure", "Human Systems"], gaps: ["gap-016"] },
  "REOPEN-HANFORD-MASS-BALANCE": { slug: "hanford-mass-balance", label: "Hanford complete material balance", prefix: "HANFORD", publisher: "U.S. Department of Energy", topics: ["Energy", "Policy and Standards", "Finance and Risk"], layers: ["Enabling Infrastructure", "Resource Foundations"], gaps: ["gap-008", "gap-016"] },
  "REOPEN-NNSA-QUALIFIED-RATE": { slug: "nnsa-qualified-rate", label: "NNSA recurring qualified rate", prefix: "NNSA-QUALIFIED", publisher: "National Nuclear Security Administration", topics: ["Energy", "Policy and Standards", "Finance and Risk"], layers: ["Enabling Infrastructure", "Resource Foundations"], gaps: ["gap-008", "gap-016"] },
  "REOPEN-NNSA-ACCEPTED-CAPACITY": { slug: "nnsa-accepted-capacity", label: "NNSA accepted operating capacity", prefix: "NNSA-ACCEPTED", publisher: "National Nuclear Security Administration", topics: ["Energy", "Policy and Standards", "Finance and Risk"], layers: ["Enabling Infrastructure", "Resource Foundations"], gaps: ["gap-008", "gap-016"] },
  "REOPEN-NNSA-GAO-BASELINE": { slug: "nnsa-gao-baseline", label: "NNSA GAO enterprise baseline", prefix: "NNSA-GAO", publisher: "National Nuclear Security Administration", topics: ["Energy", "Policy and Standards", "Finance and Risk"], layers: ["Enabling Infrastructure", "Resource Foundations"], gaps: ["gap-008", "gap-016"] },
};
const held57q = phase57q.records.filter((record) => record.record_status === "In Review");
if (held57q.length !== 9) throw new Error("Phase 57R must inherit exactly nine Phase 57Q holds.");
const published57q = phase57q.records.filter((record) => record.record_status === "Published");
const incrementKey = (key) => key.replace(/-(\d{2})$/, (_, value) => `-${String(Number(value) + 1).padStart(2, "0")}`);

const controlTypes = [
  {
    suffix: "reader-facing-current-publication-status-registry",
    action: "CURRENT-PUBLICATION-STATUS-REGISTRY",
    stage: "Reader-facing current-publication-status derivation controls",
    title: (label) => `${label} receives a reader-facing current-publication-status registry`,
    finding: "Current availability is recomputed only from the final event in a validated append-only history while the controlling event, controlling receipt, event count, and full-history digest remain visible.",
    denominator: "One contract-specific status registry, fourteen adversarial cases, six valid derived lifecycle states, eight explicit rejections, and zero actual publication statuses created.",
    limits: ["A derived status is a view over history, not a publication event.", "A stale display cannot override the append-only event ledger.", "Truncation, mutation, chronology regression, missing receipts, automation, and evidence inflation are rejected."],
    next: (label) => `Populate the ${label} registry only after a real, separately authorized lifecycle event exists.`,
    registry: "phase-57r-reader-facing-publication-status-registries.json",
  },
  {
    suffix: "immutable-public-change-notice",
    action: "IMMUTABLE-PUBLIC-CHANGE-NOTICE",
    stage: "Immutable public change-notice controls",
    title: (label) => `${label} receives an immutable public change-notice contract`,
    finding: "Every publication, withdrawal, rollback, supersession, restoration, or republication notice binds its controlling event, receipt, event digest, and exact bundle digest; corrections append and never rewrite.",
    denominator: "One contract-specific notice schema, fourteen integrity cases, six valid notice types, eight explicit rejections, and zero actual public change notices issued.",
    limits: ["A synthetic notice is not a public editorial action.", "Notice integrity proves binding and immutability, not the truth of a claim.", "A notice cannot publish, restore, close, or change evidence state."],
    next: (label) => `Issue a ${label} notice only from a real controlling lifecycle receipt and its exact bundle digest.`,
    registry: "phase-57r-immutable-public-change-notices.json",
  },
  {
    suffix: "restore-republication-new-receipt-and-bundle",
    action: "RESTORE-REPUBLICATION-NEW-RECEIPT-BUNDLE",
    stage: "Restoration and republication receipt controls",
    title: (label) => `${label} requires a new human receipt and bundle for restoration or republication`,
    finding: "Restoration and republication each require a new named human authorization, a new exact bundle digest, an existing withdrawal or rollback target, a unique receipt, and forward chronology.",
    denominator: "One contract-specific restore schema, sixteen adversarial cases, six valid or history-preservation routes, ten explicit rejections, and zero actual restorations or republications.",
    limits: ["A withdrawn authorization or stale bundle cannot be reused.", "A new digest binds a new artifact set but does not establish evidence sufficiency.", "No restoration or republication occurs automatically."],
    next: (label) => `Require a newly named human actor and newly hashed ${label} bundle before any restoration or republication append.`,
    registry: "phase-57r-restore-republication-provenance-fixtures.json",
  },
  {
    suffix: "complete-provenance-timeline-zero-state-inflation",
    action: "PROVENANCE-TIMELINE-ZERO-STATE-INFLATION",
    stage: "Complete provenance-timeline and zero-automation controls",
    title: (label) => `${label} receives a complete provenance timeline with zero state inflation`,
    finding: "The timeline preserves every earlier release, publication, withdrawal, rollback, supersession, restoration, and republication event and identifies exactly one controlling event without changing any claim state.",
    denominator: "Forty-four fixture-only cases per contract, complete prior-history preservation, one controlling event per derived view, and zero actual actors, notices, restores, republications, triggers, or closures.",
    limits: ["Provenance visibility is not evidence acquisition or reviewer acceptance.", "No timeline changes implementation, capability, closure, attribution, or operating outcomes.", "Synthetic lifecycle events remain outside the evidence and publication ledgers."],
    next: (label) => `Render the ${label} provenance timeline only from immutable event and receipt records.`,
    registry: "phase-57r-publication-status-harness-results.json",
  },
];

const records = [];
let documentNumber = 1063;
for (const priorHold of held57q) {
  const meta = labels[priorHold.reopening_contract_id];
  if (!meta) throw new Error(`Missing Phase 57R metadata for ${priorHold.reopening_contract_id}`);
  const sourceRecord = published57q.find((record) => record.action_key.startsWith(meta.prefix));
  if (!sourceRecord) throw new Error(`Missing carried source profile for ${meta.prefix}`);
  for (const control of controlTypes) {
    const slug = `57r-${meta.slug}-${control.suffix}`;
    records.push({
      record_id: `record-${slug}`, document_id: `research-doc-${slug}`, signal_id: `signal-${slug}`, document_number: documentNumber++,
      record_status: "Published", agency: priorHold.agency, action_key: `${meta.prefix}-${control.action}-2026-01`, parent_hold_key: null, reopening_contract_id: null,
      evidence_stage: control.stage, title: control.title(meta.label), finding: control.finding, denominator: control.denominator, evidence_limits: control.limits,
      next_action: control.next(meta.label), structured_registry_file: control.registry, source_id: sourceRecord.source_id,
      supporting_source_ids: sourceRecord.supporting_source_ids, official_url: sourceRecord.official_url, publication_date: capturedDate,
      document_type: "Data Release", authority_boundary: authorityBoundary, meta,
    });
  }
}
for (const priorHold of held57q) {
  const meta = labels[priorHold.reopening_contract_id];
  const slug = `57r-preserved-${meta.slug}`;
  records.push({
    ...priorHold,
    record_id: `record-${slug}`, document_id: `research-doc-${slug}`, signal_id: `signal-${slug}`, document_number: documentNumber++,
    record_status: "In Review", action_key: incrementKey(priorHold.action_key), parent_hold_key: priorHold.action_key,
    evidence_stage: "Publication status, change-notice, restore, and provenance hold",
    title: `${meta.label} remains In Review after publication-status and provenance execution`,
    finding: "Forty-four fixture-only cases pass, but no actual target packet, status event, change notice, new human authorization, replacement bundle, restoration, or republication exists.",
    denominator: "One inherited hold, fourteen status cases, fourteen notice cases, sixteen restore and provenance cases, and zero actual lifecycle or evidence events.",
    evidence_limits: ["Synthetic status and provenance fixtures are not actual publication history.", "No fixture creates a status, notice, actor, authorization, restore, republication, trigger, or closure.", "The inherited hold cannot close or publish automatically."],
    structured_registry_file: "phase-57r-publication-status-harness-results.json", publication_date: capturedDate, authority_boundary: authorityBoundary, meta,
  });
}
if (records.length !== 45 || documentNumber !== 1108) throw new Error("Phase 57R record numbering must span 1063 through 1107.");

const published = records.filter((record) => record.record_status === "Published");
const held = records.filter((record) => record.record_status === "In Review");
const carriedSources = [...new Set(published.flatMap((record) => record.supporting_source_ids))];
if (published.length !== 36 || held.length !== 9 || carriedSources.length !== 36) throw new Error("Phase 57R requires 36 Published controls, 9 holds, and 36 carried Tier 1 sources.");

await writeJson(join(dataRoot, "phase-57r-reader-facing-publication-status-registries.json"), {
  phase: "57R", captured_date: capturedDate, registry_type: "Reader-facing current-publication-status registries derived from append-only lifecycle histories",
  status_registry_count: 9, status_case_count: 126, valid_derived_status_routes: 54, rejected_status_routes: 72, passed_case_count: 126, failed_case_count: 0,
  actual_publication_statuses_created: 0, prior_events_mutated: 0, automatic_publication_allowed: false,
  rule: "Current availability derives only from the final valid event in the complete append-only history; earlier states, the controlling receipt, and the full-history digest remain visible.",
  schemas: harness.statusSchemas, case_distribution: harness.distributions.status, cases: harness.statusCases,
});
await writeJson(join(dataRoot, "phase-57r-immutable-public-change-notices.json"), {
  phase: "57R", captured_date: capturedDate, registry_type: "Immutable public change-notice schemas bound to controlling events and receipts",
  notice_schema_count: 9, notice_case_count: 126, valid_notice_routes: 54, rejected_notice_routes: 72, passed_case_count: 126, failed_case_count: 0,
  actual_change_notices_created: 0, actual_controlling_receipts_created: 0, notices_rewritten: 0, automatic_publication_allowed: false,
  rule: "Every notice binds the controlling event, controlling receipt, event digest, and exact bundle digest; corrections append a new notice and never rewrite an earlier notice.",
  schemas: harness.noticeSchemas, case_distribution: harness.distributions.notice, cases: harness.noticeCases,
});
await writeJson(join(dataRoot, "phase-57r-restore-republication-provenance-fixtures.json"), {
  phase: "57R", captured_date: capturedDate, registry_type: "Restore and republication receipt schemas with complete provenance timelines",
  restore_schema_count: 9, restore_case_count: 144, valid_or_history_preservation_routes: 54, rejected_restore_routes: 90, passed_case_count: 144, failed_case_count: 0,
  actual_named_human_actors_created: 0, actual_new_authorizations_created: 0, actual_restorations: 0, actual_republications: 0, prior_events_mutated: 0,
  rule: "Restoration or republication requires a new named human authorization and a new exact bundle digest while preserving every earlier lifecycle event.",
  schemas: harness.restoreSchemas, case_distribution: harness.distributions.restore, cases: harness.restoreCases,
});
await writeJson(join(dataRoot, "phase-57r-publication-status-harness-results.json"), {
  phase: "57R", captured_date: capturedDate, total_case_count: 396, passed_case_count: 396, failed_case_count: 0,
  status_case_count: 126, notice_case_count: 126, restore_case_count: 144, test_ids: harness.allCases.map((row) => row.test_id),
  actual_publication_statuses: 0, actual_change_notices: 0, actual_restore_actors: 0, actual_restore_authorizations: 0, actual_restorations: 0, actual_republications: 0,
  evidence_records_created: 0, reopening_triggers_fired: 0, automated_closures_or_publications: 0, prior_history_mutations: 0,
});

const mainLedger = {
  phase: "57R", captured_date: capturedDate,
  goal: "Expose reader-facing publication status and provenance without allowing a display, notice, restoration, or republication fixture to create evidence or alter claim state.",
  publication_rule: "Publish thirty-six contract-specific status, notice, restore, and provenance controls; retain all nine inherited outcome records In Review.",
  authority_rule: authorityBoundary, records_reviewed: 45, records_published: 36, records_held: 9,
  evidence_stage_counts: { "Reader-facing current-publication-status derivation controls": 9, "Immutable public change-notice controls": 9, "Restoration and republication receipt controls": 9, "Complete provenance-timeline and zero-automation controls": 9, "Publication status, change-notice, restore, and provenance hold": 9 },
  new_official_source_profiles: 0, carried_official_source_profiles: carriedSources.length, structured_rails: 3,
  publication_status_registries: 9, immutable_change_notice_schemas: 9, restore_republication_schemas: 9,
  publication_status_cases: 126, change_notice_cases: 126, restore_republication_provenance_cases: 144,
  valid_derived_status_routes: 54, rejected_status_routes: 72, valid_change_notice_routes: 54, rejected_change_notice_routes: 72,
  valid_or_history_preservation_restore_routes: 54, rejected_restore_routes: 90, total_workflow_cases: 396, workflow_test_failures: 0,
  actual_publication_statuses: 0, actual_change_notices: 0, actual_restore_actors: 0, actual_restore_authorizations: 0, actual_restorations: 0, actual_republications: 0,
  eligible_records_accepted: 0, exact_target_artifacts_acquired: 0, exact_target_trigger_events: 0, public_agency_contacts_or_foia_requests: 0,
  directive_scope_changes: 0, implementation_changes: 0, capability_changes: 0, closure_changes: 0, operating_outcome_changes: 0, inherited_entity_ledger_closure_changes: 0,
  prior_visible_scope: { sources: 715, signals: 947, published: 732, in_review: 215, research_collections: 52, research_documents: 1063, briefings: 55, updates: 71, research_export_records: 919 },
  post_batch_visible_scope: { sources: 715, signals: 992, published: 768, in_review: 224, research_collections: 53, research_documents: 1108, briefings: 56, updates: 72, research_export_records: 956 },
  post_batch_closure_counts: { Closed: 1, "Partially Closed": 21, Open: 2 },
  preserved_phase57q_holds: held57q.map((record) => record.action_key), reopening_contract_ids: held57q.map((record) => record.reopening_contract_id), new_visible_holds: [], records: records.map(({ meta, ...record }) => record),
};
await writeJson(join(dataRoot, "phase-57r-publication-status-change-notices-restore-republication-provenance.json"), mainLedger);
await writeJson(join(dataRoot, "phase-57r-publication-review.json"), {
  phase: "57R", captured_date: capturedDate,
  promoted_document_ids: published.map((record) => record.document_id), promoted_signal_ids: published.map((record) => record.signal_id),
  held_document_ids: held.map((record) => record.document_id), held_signal_ids: held.map((record) => record.signal_id),
  inherited_hold_lineage: held.map((record) => ({ action_key: record.action_key, parent_hold_key: record.parent_hold_key, reopening_contract_id: record.reopening_contract_id })),
  status_registries_created: 9, notice_schemas_created: 9, restore_schemas_created: 9, status_cases_executed: 126, notice_cases_executed: 126, restore_cases_executed: 144, total_workflow_cases_executed: 396,
  actual_publication_statuses: 0, actual_change_notices: 0, actual_restorations: 0, actual_republications: 0,
  decision: "Thirty-six reader-facing status, immutable notice, restore, and provenance controls publish. All nine inherited holds remain In Review; every fixture is synthetic and no evidence, publication, restoration, republication, trigger, or closure event is recorded.",
});

const signalMdx = (record) => `---
id: ${JSON.stringify(record.signal_id)}
title: ${JSON.stringify(record.title)}
slug: ${JSON.stringify(record.signal_id.replace(/^signal-/, ""))}
record_status: ${JSON.stringify(record.record_status)}
summary: ${JSON.stringify(record.finding)}
${yamlList("source_ids", record.supporting_source_ids)}
published_date: ${capturedDate}
captured_date: ${capturedDate}
primary_topic: ${JSON.stringify(record.meta.topics[0])}
${yamlList("framework_layers", record.meta.layers)}
signal_type: "Research Result"
maturity_level: "Infrastructure"
time_horizon: "Now"
evidence_quality: "Official Data"
verification_status: "Verified Against Primary Source"
why_it_matters: ${JSON.stringify(`Evidence stage: ${record.evidence_stage}. Denominator: ${record.denominator}`)}
${yamlList("dependencies", ["complete append-only lifecycle history", "controlling event and receipt binding", "new human authorization for restore or republication", "new exact bundle digest", "separate evidence and publication decisions"])}
${yamlList("constraints", ["Data Quality", "Regulation", "Public Trust"])}
${yamlList("receiving_systems", ["Phase 57R publication-status, change-notice, restore, and provenance controls"])}
${yamlList("local_implications", ["Do not convert a synthetic status, notice, restoration, republication, actor, receipt, or transition into evidence, eligibility, implementation, capability, closure, attribution, or operating outcomes."])}
${yamlList("evidence_gap_ids", record.meta.gaps)}
claim_scope: "Specific Source Update"
local_evidence_level: "General Source Layer"
last_reviewed_date: ${capturedDate}
editorial_notes: ${JSON.stringify(record.record_status === "Published" ? "Published under the Phase 57R reader-facing status and provenance control contract." : `Held under ${record.reopening_contract_id}; no actual Phase 57R status, notice, restore, or republication event exists.`)}
---

## Phase 57R publication-status and provenance control

${record.finding}

## Evidence stage and denominator

**${record.evidence_stage}.** ${record.denominator}

Structured registry: ${record.structured_registry_file}.
${record.reopening_contract_id ? `\nReopening contract: ${record.reopening_contract_id}. Trigger state: **not fired**.\n` : ""}
## Evidence boundaries

${record.evidence_limits.map((limit) => `- ${limit}`).join("\n")}

Actual statuses, notices, actors, authorizations, restorations, and republications: **Zero**. Trigger and closure events: **Zero**. FTFN submitted no agency contact or FOIA request.

Next action: ${record.next_action}

## Authority boundary

${authorityBoundary}
`;

for (let index = 0; index < records.length; index += 1) {
  const record = records[index];
  const slug = record.signal_id.replace(/^signal-/, "");
  await writeFile(join(contentRoot, "signals", `${record.signal_id}.mdx`), signalMdx(record), "utf8");
  await writeJson(join(contentRoot, "research-documents", `${record.document_number}-${slug}.json`), {
    id: record.document_id, collection_id: collectionId, title: record.title, slug, record_status: record.record_status,
    publisher: record.meta.publisher, publication_date: capturedDate, document_type: record.document_type,
    summary: `${record.finding} Denominator: ${record.denominator}`,
    key_findings: [`Evidence stage: ${record.evidence_stage}.`, `Finding: ${record.finding}`, `Denominator: ${record.denominator}`, ...record.evidence_limits.map((limit) => `Boundary: ${limit}`), `Next action: ${record.next_action}`],
    why_it_matters: "The record makes reader-facing availability, change history, controlling receipts, and restoration requirements legible without creating an editorial event or changing evidence state.",
    ftfn_relevance: ["Derives current availability from complete append-only history across all nine contracts.", "Binds immutable notices to controlling events, receipts, and exact bundle digests.", "Requires new human authorization and a new exact bundle for every restoration or republication."],
    evidence_limits: ["Not publicly acquired does not mean nonexistent, withheld, or never submitted.", "FTFN public-source research is not agency contact or a submitted FOIA request.", ...record.evidence_limits, "The inherited 1 Closed / 21 Partially Closed / 2 Open entity ledger remains unchanged.", "No record supports a ranking, composite score, readiness score, generalized savings claim, or unsupported causal inference."],
    primary_topics: record.meta.topics, framework_layers: record.meta.layers, constraint_tags: ["Data Quality", "Regulation", "Public Trust"],
    source_id: record.source_id, supporting_source_ids: record.supporting_source_ids, supporting_official_urls: [record.official_url], official_url: record.official_url,
    local_capture_path: `/downloads/${collectionSlug}/official-links/${String(index + 1).padStart(2, "0")}-phase57r-record.txt`,
    archive_member: `official-links/${String(index + 1).padStart(2, "0")}-phase57r-record.txt`, capture_status: "Official link record", captured_date: capturedDate,
  });
}

await writeJson(join(contentRoot, "research-collections", `${collectionSlug}.json`), {
  id: collectionId, title: "Publication Status, Change Notices, Restore Receipts, and Provenance, 2026", slug: collectionSlug, record_status: "Published",
  summary: "Phase 57R executes 396 synthetic status-derivation, immutable-notice, restoration, republication, and provenance cases across nine contracts while preserving every inherited outcome hold and every earlier lifecycle state.",
  scope: "Nine status registries, nine change-notice schemas, nine restore/republication schemas, 126 status cases, 126 notice cases, 144 restore and provenance cases, thirty-six Published controls, nine preserved holds, and zero actual lifecycle or evidence events.",
  captured_date: capturedDate, document_ids: records.map((record) => record.document_id), download_path: `/downloads/${collectionSlug}.zip`,
  download_note: "The forty-eight-file archive contains forty-five official-link records, consolidated summaries, a README, and a checksum manifest.",
  method_note: "Every status, notice, restoration, republication, actor, authorization, receipt, bundle, and transition is synthetic. Current availability derives only from complete append-only history; new availability after withdrawal or rollback requires a new human authorization and new exact bundle digest; no display changes evidence or claim state.",
});

const briefing = `---
id: ${JSON.stringify(briefingId)}
title: "Research Watch 048: Publication Status and Provenance"
slug: ${JSON.stringify(briefingSlug)}
record_status: "Published"
summary: "Phase 57R passes 396 synthetic publication-status, change-notice, restore, republication, and provenance cases while preserving all nine holds and keeping every actual lifecycle and evidence-event count at zero."
published_date: ${capturedDate}
captured_date: ${capturedDate}
${yamlList("signal_ids", records.map((record) => record.signal_id))}
${yamlList("evidence_gap_ids", ["gap-008", "gap-015", "gap-016"])}
claim_scope: "Editorial Synthesis"
local_evidence_level: "General Source Layer"
last_reviewed_date: ${capturedDate}
${yamlList("top_takeaways", ["Nine reader-facing registries derive current availability only from complete append-only lifecycle history.", "Nine immutable notice schemas bind every notice to its controlling event, receipt, event digest, and bundle digest.", "Nine restore schemas prohibit stale authorization or stale bundle reuse and require a new named human decision.", "Thirty-six controls publish, all nine holds remain In Review, and zero actual status, notice, restore, republication, trigger, or closure events are recorded."])}
${yamlList("constraint_watch", ["Data Quality", "Regulation", "Public Trust"])}
${yamlList("what_to_watch_next", ["One real event history with a verifiable controlling receipt", "One reader-visible withdrawal notice that preserves publication history", "One separately authorized restoration with a new bundle digest", "Stale-view detection between the lifecycle ledger and reader-facing status"])}
---

## What Phase 57R proves

Reader-facing availability can be derived from append-only publication history, each public notice can identify its controlling receipt, and restoration or republication can require a new human authorization and exact bundle without hiding any earlier state.

## What did not move

No synthetic status, notice, actor, receipt, bundle, restoration, republication, or timeline is an actual editorial event. No trigger or hold closes, and every inherited hold remains In Review.

## Evidence boundary

The entity ledger remains one Closed, twenty-one Partially Closed, and two Open. Phase 57R records no agency contact, FOIA request, directive-scope change, implementation change, capability change, closure change, attribution change, or operating-outcome change.
`;
await writeFile(join(contentRoot, "briefings", `${briefingSlug}.mdx`), briefing, "utf8");

await writeJson(join(contentRoot, "updates", "2026-08-09-phase-57r-publication-status-change-notices-restore-republication.json"), {
  id: "update-2026-08-09-phase-57r-publication-status-change-notices-restore-republication", effective_date: capturedDate, entry_type: "Research Collection",
  title: "Phase 57R makes publication status derivable, notices immutable, and restoration separately authorized",
  summary: "Thirty-six carried Tier 1 sources support thirty-six Published controls, nine preserved holds, twenty-seven contract-specific schemas, 396 executable cases, immutable public histories, and mandatory new human authorization plus bundle digest for restoration or republication.",
  affected_record_ids: [collectionId, briefingId, ...records.map((record) => record.signal_id)],
  related_paths: [`/research/${collectionSlug}/`, `/briefings/${briefingSlug}/`, ...records.map((record) => `/signals/${record.signal_id.replace(/^signal-/, "")}/`)],
  evidence_note: "Synthetic statuses, notices, restores, republications, actors, receipts, bundles, and transitions remain separate from source evidence, reviewer identity, acceptance, implementation, capability, closure, attribution, and operating outcomes.",
  work_package: "docs/work-packages/phase-57r-publication-status-change-notices-restore-republication-provenance.md",
});

for (const file of ["finance-and-risk.json", "policy-and-standards.json", "mobility.json", "chips-and-compute.json", "energy.json"]) {
  const path = join(contentRoot, "topics", file);
  const topic = JSON.parse(await readFile(path, "utf8"));
  topic.watch_questions = appendUnique(topic.watch_questions, ["Which real Phase 57R lifecycle history first supports a reader-facing status, controlling-receipt notice, or separately authorized restoration without hiding earlier states or inflating evidence?"]);
  await writeJson(path, topic);
}
for (const file of ["policy-standards-to-implementation.json", "cross-corridor-authorization-to-operation.json", "energy-grid-capacity-to-service.json"]) {
  const path = join(contentRoot, "reader-pathways", file);
  const pathway = JSON.parse(await readFile(path, "utf8"));
  pathway.research_collection_ids = appendUnique(pathway.research_collection_ids, [collectionId]);
  pathway.dependency_stack = [...pathway.dependency_stack.filter((item) => item.stage !== "Phase 57R publication status, change notices, and provenance"), {
    stage: "Phase 57R publication status, change notices, and provenance",
    current_state: "Nine status registries, nine notice schemas, nine restore schemas, and 396 cases pass; zero actual statuses, notices, restores, republications, triggers, or closures are recorded.",
    boundary: "Reader-facing status and provenance are derived workflow views, not evidence, acceptance, implementation, capability, closure, attribution, or operating outcomes.",
  }];
  await writeJson(path, pathway);
}
const mapPath = join(contentRoot, "dependency-maps", "comparative-outcomes-require-common-denominators.json");
const map = JSON.parse(await readFile(mapPath, "utf8"));
map.nodes = [...map.nodes.filter((node) => node.id !== "node-phase57r-publication-status-provenance"), { id: "node-phase57r-publication-status-provenance", label: "Nine status registries; nine immutable notice contracts; nine restore schemas; zero actual events", node_type: "Signal", note: "Availability derives from append-only history; notice bindings are immutable; restoration or republication requires a new human authorization and exact bundle digest." }];
map.links = [...map.links.filter((link) => link.from !== "node-phase57r-publication-status-provenance"),
  { from: "node-phase57r-publication-status-provenance", to: "node-phase57q-manual-release-bundles", relationship: "Depends On", confidence: "Supported", note: "Phase 57R derives status only from Phase 57Q append-only release, publication, withdrawal, rollback, and supersession history." },
  { from: "node-phase57r-publication-status-provenance", to: "node-denominator-break", relationship: "Constrained By", confidence: "Partial", note: "A reader-facing status cannot cure an incompatible identity, definition, unit, method, denominator, period, privacy, authority, or acceptance boundary." },
  { from: "node-phase57r-publication-status-provenance", to: "node-causal-hold", relationship: "Limited By", confidence: "Missing Evidence", note: "Status, notices, and provenance do not establish implementation, capability, closure, operating outcomes, attribution, or causation." },
];
await writeJson(mapPath, map);

console.log(`Generated Phase 57R: ${records.length} records (${published.length} Published, ${held.length} In Review), 27 schemas, 396 cases, 36 carried Tier 1 sources, Research Watch 048, one collection, one update, and integration across five topics, three pathways, and one dependency map.`);
