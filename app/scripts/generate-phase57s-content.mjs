import { mkdir, readFile, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { runPhase57sHarness } from "./phase57s-reader-verification-harness.mjs";

const appRoot = fileURLToPath(new URL("..", import.meta.url));
const contentRoot = join(appRoot, "src", "content");
const dataRoot = join(appRoot, "src", "data");
const capturedDate = "2026-08-09";
const collectionSlug = "reader-verifiable-lifecycle-manifests-stale-view-provenance-exports-2026";
const collectionId = `research-collection-${collectionSlug}`;
const briefingSlug = "research-watch-049-reader-verification-status-freshness-provenance-exports";
const briefingId = `briefing-${briefingSlug}`;
const json = (value) => `${JSON.stringify(value, null, 2)}\n`;
const writeJson = async (path, value) => writeFile(path, json(value), "utf8");
const yamlList = (name, items) => [name + ":", ...items.map((item) => `  - ${JSON.stringify(item)}`)].join("\n");
const appendUnique = (items, additions) => [...new Set([...(items ?? []), ...additions])];

for (const name of ["research-documents", "signals", "research-collections", "briefings", "updates"]) await mkdir(join(contentRoot, name), { recursive: true });

const phase57r = JSON.parse(await readFile(join(dataRoot, "phase-57r-publication-status-change-notices-restore-republication-provenance.json"), "utf8"));
const statuses57r = JSON.parse(await readFile(join(dataRoot, "phase-57r-reader-facing-publication-status-registries.json"), "utf8"));
const notices57r = JSON.parse(await readFile(join(dataRoot, "phase-57r-immutable-public-change-notices.json"), "utf8"));
const restores57r = JSON.parse(await readFile(join(dataRoot, "phase-57r-restore-republication-provenance-fixtures.json"), "utf8"));
if (phase57r.phase !== "57R" || phase57r.records.length !== 45) throw new Error("Phase 57S requires the complete Phase 57R baseline.");
const harness = runPhase57sHarness({ statusSchemas: statuses57r.schemas, noticeSchemas: notices57r.schemas, restoreSchemas: restores57r.schemas });
if (harness.manifestCases.length !== 144 || harness.freshnessCases.length !== 144 || harness.exportCases.length !== 162 || harness.allCases.length !== 450 || harness.failures.length) throw new Error("Phase 57S requires 450 passing verification, freshness, export, and reconciliation cases.");

const authorityBoundary = "Agency assertions, regulator evidence, FTFN controls, evidence-review identity, publication-review identity, release identity, publication identity, withdrawal identity, rollback identity, restore identity, republication identity, verification identity, reconciliation identity, GAO acceptance, implementation, capability, closure, attribution, and operating outcomes remain separate evidence states.";
const agencyMeta = {
  DOT: { publisher: "National Railroad Passenger Corporation", topics: ["Mobility", "Policy and Standards", "Finance and Risk"], layers: ["Enabling Infrastructure", "Human Systems"], gaps: ["gap-015", "gap-016"] },
  NTIA: { publisher: "National Telecommunications and Information Administration", topics: ["Chips and Compute", "Policy and Standards", "Finance and Risk"], layers: ["Enabling Infrastructure", "Human Systems"], gaps: ["gap-016"] },
  DOE: { publisher: "U.S. Department of Energy", topics: ["Energy", "Policy and Standards", "Finance and Risk"], layers: ["Enabling Infrastructure", "Resource Foundations"], gaps: ["gap-008", "gap-016"] },
};
const contracts = {
  "REOPEN-AMTRAK-PIDS": ["amtrak-pids", "Amtrak PIDS closeout", "AMTRAK-PIDS"],
  "REOPEN-AMTRAK-RELIABILITY": ["amtrak-reliability", "Amtrak named-asset reliability", "AMTRAK-RELIABILITY"],
  "REOPEN-LA-NEXTLINK-ADOPTION": ["la-nextlink-adoption", "Louisiana Nextlink adoption", "LA-NEXTLINK"],
  "REOPEN-LA-STARLINK-ADOPTION": ["la-starlink-adoption", "Louisiana Starlink adoption", "LA-STARLINK"],
  "REOPEN-MT-BEAD-QUARTER": ["mt-bead-quarter", "Montana BEAD completed quarter", "MT-BEAD"],
  "REOPEN-HANFORD-MASS-BALANCE": ["hanford-mass-balance", "Hanford complete material balance", "HANFORD"],
  "REOPEN-NNSA-QUALIFIED-RATE": ["nnsa-qualified-rate", "NNSA recurring qualified rate", "NNSA-QUALIFIED"],
  "REOPEN-NNSA-ACCEPTED-CAPACITY": ["nnsa-accepted-capacity", "NNSA accepted operating capacity", "NNSA-ACCEPTED"],
  "REOPEN-NNSA-GAO-BASELINE": ["nnsa-gao-baseline", "NNSA GAO enterprise baseline", "NNSA-GAO"],
};
const held57r = phase57r.records.filter((record) => record.record_status === "In Review");
const published57r = phase57r.records.filter((record) => record.record_status === "Published");
if (held57r.length !== 9) throw new Error("Phase 57S must inherit exactly nine Phase 57R holds.");
const incrementKey = (key) => key.replace(/-(\d{2})$/, (_, value) => `-${String(Number(value) + 1).padStart(2, "0")}`);

const controlTypes = [
  {
    suffix: "reader-verifiable-complete-lifecycle-manifest", action: "READER-VERIFIABLE-LIFECYCLE-MANIFEST", stage: "Reader-verifiable complete lifecycle-manifest controls",
    title: (label) => `${label} receives a reader-verifiable complete lifecycle manifest`,
    finding: "The manifest enumerates every lifecycle event and immutable notice, chains event digests, and exposes the controlling event, receipt, bundle, event count, notice count, and manifest digest for independent reconciliation.",
    denominator: "One contract-specific manifest schema, sixteen adversarial cases, five bounded valid verification routes, eleven explicit rejections, and zero actual lifecycle manifests issued.",
    limits: ["A verified manifest proves completeness and digest consistency, not claim truth.", "The manifest cannot replace or rewrite the lifecycle ledger.", "Missing identifiers, incomplete bindings, broken chains, notice drift, chronology regression, and state inflation reject."],
    next: (label) => `Publish a ${label} verification manifest only from the complete immutable lifecycle and notice set.`, registry: "phase-57s-reader-verifiable-lifecycle-manifests.json",
  },
  {
    suffix: "status-freshness-partial-view-fail-closed", action: "STATUS-FRESHNESS-PARTIAL-VIEW-FAIL-CLOSED", stage: "Status-freshness and partial-view fail-closed controls",
    title: (label) => `${label} receives stale-view and partial-history fail-closed detection`,
    finding: "A displayed status is usable only when its manifest digest, full event and notice counts, controlling event, controlling receipt, source revision, and verification time match the current manifest.",
    denominator: "One contract-specific freshness schema, sixteen adversarial cases, four bounded valid comparison routes, twelve fail-closed rejections, and zero actual status verifications.",
    limits: ["A warning-only response is not sufficient for a failed verification.", "A stale or partial view cannot replace the current manifest.", "Verification cannot publish, restore, create evidence, or change claim state."],
    next: (label) => `Fail the ${label} display closed whenever any freshness or completeness comparison diverges.`, registry: "phase-57s-status-freshness-stale-view-detection.json",
  },
  {
    suffix: "complete-provenance-export-snapshot", action: "COMPLETE-PROVENANCE-EXPORT-SNAPSHOT", stage: "Complete provenance-export snapshot controls",
    title: (label) => `${label} receives a complete digest-bound provenance export`,
    finding: "Each export snapshot retains complete history, every immutable notice, the controlling event and receipt, manifest binding, verification metadata, and its own canonical export digest.",
    denominator: "One contract-specific export schema, eighteen export and reconciliation cases, six valid or preservation routes, twelve explicit rejections, and zero actual public exports created.",
    limits: ["An export snapshot is a verification artifact, not a new evidence record.", "Prior exports remain immutable even after a later lifecycle event.", "Scope, digest, count, controlling-binding, and history-preservation mismatches reject."],
    next: (label) => `Create a ${label} provenance export only when every lifecycle event and immutable notice reconciles to the current manifest.`, registry: "phase-57s-provenance-export-digest-reconciliation-fixtures.json",
  },
  {
    suffix: "digest-chain-reconciliation-zero-rewrite", action: "DIGEST-CHAIN-RECONCILIATION-ZERO-REWRITE", stage: "Digest-chain reconciliation and zero-rewrite controls",
    title: (label) => `${label} receives append-only digest-chain reconciliation with zero rewrite`,
    finding: "Reconciliation either verifies the complete chain or appends a bounded mismatch receipt identifying the exact divergence; it never rewrites events, notices, receipts, bundles, exports, evidence, or claim state.",
    denominator: "Fifty fixture-only cases per contract across three verification rails, append-only mismatch findings, zero history rewrites, and zero actual manifests, exports, reconciliation receipts, triggers, or closures.",
    limits: ["A mismatch receipt reports inconsistency but does not correct evidence automatically.", "Reconciliation cannot accept, implement, restore, close, attribute, or establish operating outcomes.", "Every synthetic verifier, export, mismatch, and receipt remains outside the evidence ledger."],
    next: (label) => `Append a ${label} mismatch receipt without mutating any prior artifact whenever reconciliation fails.`, registry: "phase-57s-verification-harness-results.json",
  },
];

const records = [];
let documentNumber = 1108;
for (const priorHold of held57r) {
  const [shortSlug, label, prefix] = contracts[priorHold.reopening_contract_id] ?? [];
  const meta = agencyMeta[priorHold.agency];
  const sourceRecord = published57r.find((record) => record.action_key.startsWith(prefix));
  if (!shortSlug || !meta || !sourceRecord) throw new Error(`Incomplete Phase 57S metadata for ${priorHold.reopening_contract_id}`);
  for (const control of controlTypes) {
    const slug = `57s-${shortSlug}-${control.suffix}`;
    records.push({ record_id: `record-${slug}`, document_id: `research-doc-${slug}`, signal_id: `signal-${slug}`, document_number: documentNumber++, record_status: "Published", agency: priorHold.agency,
      action_key: `${prefix}-${control.action}-2026-01`, parent_hold_key: null, reopening_contract_id: null, evidence_stage: control.stage, title: control.title(label), finding: control.finding,
      denominator: control.denominator, evidence_limits: control.limits, next_action: control.next(label), structured_registry_file: control.registry, source_id: sourceRecord.source_id,
      supporting_source_ids: sourceRecord.supporting_source_ids, official_url: sourceRecord.official_url, publication_date: capturedDate, document_type: "Data Release", authority_boundary: authorityBoundary,
      meta: { ...meta, shortSlug, label, prefix } });
  }
}
for (const priorHold of held57r) {
  const [shortSlug, label, prefix] = contracts[priorHold.reopening_contract_id];
  const meta = { ...agencyMeta[priorHold.agency], shortSlug, label, prefix };
  const slug = `57s-preserved-${shortSlug}`;
  records.push({ ...priorHold, record_id: `record-${slug}`, document_id: `research-doc-${slug}`, signal_id: `signal-${slug}`, document_number: documentNumber++, record_status: "In Review",
    action_key: incrementKey(priorHold.action_key), parent_hold_key: priorHold.action_key, evidence_stage: "Reader verification, freshness, provenance export, and reconciliation hold",
    title: `${label} remains In Review after reader-verification and stale-view execution`,
    finding: "Fifty fixture-only cases pass, but no actual target packet, lifecycle manifest, status verification, provenance export, reconciliation receipt, or evidence event exists.",
    denominator: "One inherited hold, sixteen manifest cases, sixteen freshness cases, eighteen export and reconciliation cases, and zero actual workflow or evidence events.",
    evidence_limits: ["Synthetic verifiers, manifests, exports, and mismatch receipts are not actual publication history.", "No fixture creates a manifest, verification, export, reconciliation receipt, trigger, or closure.", "The inherited hold cannot close or publish automatically."],
    structured_registry_file: "phase-57s-verification-harness-results.json", publication_date: capturedDate, authority_boundary: authorityBoundary, meta });
}
if (records.length !== 45 || documentNumber !== 1153) throw new Error("Phase 57S document numbering must span 1108 through 1152.");
const published = records.filter((record) => record.record_status === "Published");
const held = records.filter((record) => record.record_status === "In Review");
const carriedSources = [...new Set(published.flatMap((record) => record.supporting_source_ids))];
if (published.length !== 36 || held.length !== 9 || carriedSources.length !== 36) throw new Error("Phase 57S requires 36 Published controls, 9 holds, and 36 carried Tier 1 sources.");

await writeJson(join(dataRoot, "phase-57s-reader-verifiable-lifecycle-manifests.json"), { phase: "57S", captured_date: capturedDate, registry_type: "Reader-verifiable complete lifecycle manifests and digest-chain cases",
  lifecycle_manifest_schema_count: 9, manifest_case_count: 144, valid_manifest_routes: 45, rejected_manifest_routes: 99, passed_case_count: 144, failed_case_count: 0,
  actual_lifecycle_manifests_created: 0, actual_verifiers_created: 0, prior_events_or_notices_mutated: 0,
  rule: "A verification manifest enumerates every lifecycle event and immutable notice, chains their digests, and exposes the currently controlling event and receipt without replacing the source ledger.", schemas: harness.manifestSchemas, case_distribution: harness.distributions.manifest, cases: harness.manifestCases });
await writeJson(join(dataRoot, "phase-57s-status-freshness-stale-view-detection.json"), { phase: "57S", captured_date: capturedDate, registry_type: "Status freshness, partial-history detection, and fail-closed verification cases",
  freshness_schema_count: 9, freshness_case_count: 144, valid_freshness_routes: 36, rejected_stale_or_partial_routes: 108, passed_case_count: 144, failed_case_count: 0,
  actual_status_verifications_created: 0, warning_only_failures_allowed: false, automatic_publication_allowed: false,
  rule: "A status view is usable only when digest, event count, notice count, controlling event, controlling receipt, source revision, and verification time match; every divergence fails closed.", schemas: harness.freshnessSchemas, case_distribution: harness.distributions.freshness, cases: harness.freshnessCases });
await writeJson(join(dataRoot, "phase-57s-provenance-export-digest-reconciliation-fixtures.json"), { phase: "57S", captured_date: capturedDate, registry_type: "Complete provenance exports, digest-chain reconciliation, and append-only mismatch receipts",
  export_schema_count: 9, export_case_count: 162, valid_or_preservation_routes: 54, rejected_export_or_reconciliation_routes: 108, passed_case_count: 162, failed_case_count: 0,
  actual_provenance_exports_created: 0, actual_reconciliation_receipts_created: 0, prior_exports_rewritten: 0, evidence_records_created: 0,
  rule: "Exports preserve complete history and notices; reconciliation either verifies the digest chain or appends a mismatch receipt without rewriting any prior artifact.", schemas: harness.exportSchemas, case_distribution: harness.distributions.export, cases: harness.exportCases });
await writeJson(join(dataRoot, "phase-57s-verification-harness-results.json"), { phase: "57S", captured_date: capturedDate, total_case_count: 450, passed_case_count: 450, failed_case_count: 0,
  manifest_case_count: 144, freshness_case_count: 144, export_case_count: 162, test_ids: harness.allCases.map((row) => row.test_id), actual_lifecycle_manifests: 0, actual_status_verifications: 0,
  actual_provenance_exports: 0, actual_reconciliation_receipts: 0, evidence_records_created: 0, reopening_triggers_fired: 0, automated_closures_or_publications: 0, prior_history_mutations: 0 });

const mainLedger = { phase: "57S", captured_date: capturedDate,
  goal: "Let readers independently verify displayed publication status against complete immutable lifecycle history while stale, partial, or digest-inconsistent views fail closed.",
  publication_rule: "Publish thirty-six contract-specific verification, freshness, export, and reconciliation controls; retain all nine inherited outcome records In Review.", authority_rule: authorityBoundary,
  records_reviewed: 45, records_published: 36, records_held: 9,
  evidence_stage_counts: { "Reader-verifiable complete lifecycle-manifest controls": 9, "Status-freshness and partial-view fail-closed controls": 9, "Complete provenance-export snapshot controls": 9, "Digest-chain reconciliation and zero-rewrite controls": 9, "Reader verification, freshness, provenance export, and reconciliation hold": 9 },
  new_official_source_profiles: 0, carried_official_source_profiles: 36, structured_rails: 3, lifecycle_manifest_schemas: 9, status_freshness_schemas: 9, provenance_export_reconciliation_schemas: 9,
  lifecycle_manifest_cases: 144, status_freshness_cases: 144, provenance_export_reconciliation_cases: 162, valid_manifest_routes: 45, rejected_manifest_routes: 99,
  valid_freshness_routes: 36, rejected_stale_or_partial_routes: 108, valid_or_preservation_export_routes: 54, rejected_export_or_reconciliation_routes: 108, total_workflow_cases: 450, workflow_test_failures: 0,
  actual_lifecycle_manifests: 0, actual_status_verifications: 0, actual_provenance_exports: 0, actual_reconciliation_receipts: 0, eligible_records_accepted: 0, exact_target_artifacts_acquired: 0,
  exact_target_trigger_events: 0, public_agency_contacts_or_foia_requests: 0, directive_scope_changes: 0, implementation_changes: 0, capability_changes: 0, closure_changes: 0, attribution_changes: 0,
  operating_outcome_changes: 0, inherited_entity_ledger_closure_changes: 0, prior_visible_scope: { sources: 715, signals: 992, published: 768, in_review: 224, research_collections: 53, research_documents: 1108, briefings: 56, updates: 72, research_export_records: 956 },
  post_batch_visible_scope: { sources: 715, signals: 1037, published: 804, in_review: 233, research_collections: 54, research_documents: 1153, briefings: 57, updates: 73, research_export_records: 993 },
  post_batch_closure_counts: { Closed: 1, "Partially Closed": 21, Open: 2 }, preserved_phase57r_holds: held57r.map((record) => record.action_key), reopening_contract_ids: held57r.map((record) => record.reopening_contract_id), new_visible_holds: [], records: records.map(({ meta, ...record }) => record) };
await writeJson(join(dataRoot, "phase-57s-reader-verification-freshness-provenance-exports-digest-reconciliation.json"), mainLedger);
await writeJson(join(dataRoot, "phase-57s-publication-review.json"), { phase: "57S", captured_date: capturedDate, promoted_document_ids: published.map((record) => record.document_id), promoted_signal_ids: published.map((record) => record.signal_id),
  held_document_ids: held.map((record) => record.document_id), held_signal_ids: held.map((record) => record.signal_id), inherited_hold_lineage: held.map((record) => ({ action_key: record.action_key, parent_hold_key: record.parent_hold_key, reopening_contract_id: record.reopening_contract_id })),
  lifecycle_manifest_schemas_created: 9, freshness_schemas_created: 9, export_schemas_created: 9, manifest_cases_executed: 144, freshness_cases_executed: 144, export_cases_executed: 162, total_workflow_cases_executed: 450,
  actual_lifecycle_manifests: 0, actual_status_verifications: 0, actual_provenance_exports: 0, actual_reconciliation_receipts: 0,
  decision: "Thirty-six reader-verification, freshness, provenance-export, reconciliation, and zero-rewrite controls publish. All nine inherited holds remain In Review; every fixture is synthetic and no evidence, publication, restore, verification, export, reconciliation, trigger, or closure event is recorded." });

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
${yamlList("dependencies", ["complete append-only lifecycle history", "complete immutable change-notice set", "controlling event and receipt digests", "freshness and completeness comparison", "append-only mismatch reconciliation"])}
${yamlList("constraints", ["Data Quality", "Regulation", "Public Trust"])}
${yamlList("receiving_systems", ["Phase 57S reader-verification, freshness, provenance-export, and reconciliation controls"])}
${yamlList("local_implications", ["Do not convert a synthetic verifier, manifest, export, mismatch, receipt, or reconciliation into evidence, eligibility, implementation, capability, closure, attribution, or operating outcomes."])}
${yamlList("evidence_gap_ids", record.meta.gaps)}
claim_scope: "Specific Source Update"
local_evidence_level: "General Source Layer"
last_reviewed_date: ${capturedDate}
editorial_notes: ${JSON.stringify(record.record_status === "Published" ? "Published under the Phase 57S reader-verification and fail-closed freshness contract." : `Held under ${record.reopening_contract_id}; no actual Phase 57S manifest, verification, export, or reconciliation event exists.`)}
---

## Phase 57S reader-verification control

${record.finding}

## Evidence stage and denominator

**${record.evidence_stage}.** ${record.denominator}

Structured registry: ${record.structured_registry_file}.
${record.reopening_contract_id ? `\nReopening contract: ${record.reopening_contract_id}. Trigger state: **not fired**.\n` : ""}
## Evidence boundaries

${record.evidence_limits.map((limit) => `- ${limit}`).join("\n")}

Actual manifests, verifications, exports, reconciliation receipts, triggers, and closures: **Zero**. FTFN submitted no agency contact or FOIA request.

Next action: ${record.next_action}

## Authority boundary

${authorityBoundary}
`;

for (let index = 0; index < records.length; index += 1) {
  const record = records[index];
  const slug = record.signal_id.replace(/^signal-/, "");
  await writeFile(join(contentRoot, "signals", `${record.signal_id}.mdx`), signalMdx(record), "utf8");
  await writeJson(join(contentRoot, "research-documents", `${record.document_number}-${slug}.json`), { id: record.document_id, collection_id: collectionId, title: record.title, slug, record_status: record.record_status,
    publisher: record.meta.publisher, publication_date: capturedDate, document_type: record.document_type, summary: `${record.finding} Denominator: ${record.denominator}`,
    key_findings: [`Evidence stage: ${record.evidence_stage}.`, `Finding: ${record.finding}`, `Denominator: ${record.denominator}`, ...record.evidence_limits.map((limit) => `Boundary: ${limit}`), `Next action: ${record.next_action}`],
    why_it_matters: "The record makes lifecycle completeness, displayed-status freshness, provenance export integrity, and exact mismatch reconciliation independently verifiable without creating an editorial event or changing evidence state.",
    ftfn_relevance: ["Lets readers reconcile current status to complete immutable lifecycle history across all nine contracts.", "Fails stale, partial, or digest-inconsistent status views closed.", "Preserves complete event and notice histories in digest-bound exports and append-only mismatch receipts."],
    evidence_limits: ["Not publicly acquired does not mean nonexistent, withheld, or never submitted.", "FTFN public-source research is not agency contact or a submitted FOIA request.", ...record.evidence_limits, "The inherited 1 Closed / 21 Partially Closed / 2 Open entity ledger remains unchanged.", "No record supports a ranking, composite score, readiness score, generalized savings claim, or unsupported causal inference."],
    primary_topics: record.meta.topics, framework_layers: record.meta.layers, constraint_tags: ["Data Quality", "Regulation", "Public Trust"], source_id: record.source_id, supporting_source_ids: record.supporting_source_ids,
    supporting_official_urls: [record.official_url], official_url: record.official_url, local_capture_path: `/downloads/${collectionSlug}/official-links/${String(index + 1).padStart(2, "0")}-phase57s-record.txt`,
    archive_member: `official-links/${String(index + 1).padStart(2, "0")}-phase57s-record.txt`, capture_status: "Official link record", captured_date: capturedDate });
}

await writeJson(join(contentRoot, "research-collections", `${collectionSlug}.json`), { id: collectionId, title: "Reader-Verifiable Lifecycle Manifests, Stale-View Detection, and Provenance Exports, 2026", slug: collectionSlug, record_status: "Published",
  summary: "Phase 57S executes 450 synthetic lifecycle-manifest, status-freshness, provenance-export, and digest-reconciliation cases across nine contracts while preserving every inherited hold and requiring stale, partial, or inconsistent views to fail closed.",
  scope: "Nine lifecycle-manifest schemas, nine freshness schemas, nine export and reconciliation schemas, 144 manifest cases, 144 freshness cases, 162 export and reconciliation cases, thirty-six Published controls, nine preserved holds, and zero actual verification or evidence events.",
  captured_date: capturedDate, document_ids: records.map((record) => record.document_id), download_path: `/downloads/${collectionSlug}.zip`,
  download_note: "The forty-eight-file archive contains forty-five official-link records, consolidated summaries, a README, and a checksum manifest.",
  method_note: "Every verifier, manifest, display, export, mismatch, receipt, and reconciliation event is synthetic. Complete history and immutable notices remain source-of-truth; stale or partial views fail closed; reconciliation appends findings and never rewrites evidence, lifecycle history, or claim state." });

const briefing = `---
id: ${JSON.stringify(briefingId)}
title: "Research Watch 049: Reader Verification and Status Freshness"
slug: ${JSON.stringify(briefingSlug)}
record_status: "Published"
summary: "Phase 57S passes 450 synthetic lifecycle-manifest, stale-view, provenance-export, and reconciliation cases while preserving all nine holds and keeping every actual verification, export, trigger, and evidence-event count at zero."
published_date: ${capturedDate}
captured_date: ${capturedDate}
${yamlList("signal_ids", records.map((record) => record.signal_id))}
${yamlList("evidence_gap_ids", ["gap-008", "gap-015", "gap-016"])}
claim_scope: "Editorial Synthesis"
local_evidence_level: "General Source Layer"
last_reviewed_date: ${capturedDate}
${yamlList("top_takeaways", ["Nine lifecycle manifests expose complete event and notice histories, controlling receipts, and canonical digests.", "Nine freshness schemas require seven exact comparisons and fail every stale or partial view closed.", "Nine provenance-export schemas preserve history and append mismatch receipts without rewriting earlier artifacts.", "Thirty-six controls publish, all nine holds remain In Review, and zero actual verification, export, trigger, or closure events are recorded."])}
${yamlList("constraint_watch", ["Data Quality", "Regulation", "Public Trust"])}
${yamlList("what_to_watch_next", ["One real complete lifecycle manifest with public verification metadata", "One production stale-view mismatch that fails closed", "One immutable provenance export spanning a later lifecycle event", "One append-only reconciliation receipt naming an exact digest divergence"])}
---

## What Phase 57S proves

Readers can be given a deterministic path from displayed status to complete lifecycle history, controlling receipts, immutable notices, export snapshots, and exact digest reconciliation while stale or partial views fail closed.

## What did not move

No synthetic verifier, manifest, display, export, mismatch, receipt, or reconciliation is an actual editorial event. No trigger or hold closes, and every inherited hold remains In Review.

## Evidence boundary

The entity ledger remains one Closed, twenty-one Partially Closed, and two Open. Phase 57S records no agency contact, FOIA request, directive-scope change, implementation change, capability change, closure change, attribution change, or operating-outcome change.
`;
await writeFile(join(contentRoot, "briefings", `${briefingSlug}.mdx`), briefing, "utf8");
await writeJson(join(contentRoot, "updates", "2026-08-09-phase-57s-reader-verification-freshness-provenance-exports.json"), { id: "update-2026-08-09-phase-57s-reader-verification-freshness-provenance-exports", effective_date: capturedDate, entry_type: "Research Collection",
  title: "Phase 57S makes publication status independently verifiable and stale views fail closed", summary: "Thirty-six carried Tier 1 sources support thirty-six Published controls, nine preserved holds, twenty-seven schemas, 450 executable cases, complete lifecycle manifests, strict freshness detection, immutable provenance exports, and append-only digest mismatch receipts.",
  affected_record_ids: [collectionId, briefingId, ...records.map((record) => record.signal_id)], related_paths: [`/research/${collectionSlug}/`, `/briefings/${briefingSlug}/`, ...records.map((record) => `/signals/${record.signal_id.replace(/^signal-/, "")}/`)],
  evidence_note: "Synthetic verifiers, manifests, displays, exports, mismatches, and reconciliation receipts remain separate from source evidence, reviewer identity, acceptance, implementation, capability, closure, attribution, and operating outcomes.",
  work_package: "docs/work-packages/phase-57s-reader-verification-freshness-provenance-exports-digest-reconciliation.md" });

for (const file of ["finance-and-risk.json", "policy-and-standards.json", "mobility.json", "chips-and-compute.json", "energy.json"]) {
  const path = join(contentRoot, "topics", file); const topic = JSON.parse(await readFile(path, "utf8"));
  topic.watch_questions = appendUnique(topic.watch_questions, ["Which real Phase 57S lifecycle manifest first lets a reader verify current status, detect a stale or partial view, export complete provenance, and reconcile an exact digest mismatch without changing evidence state?"]);
  await writeJson(path, topic);
}
for (const file of ["policy-standards-to-implementation.json", "cross-corridor-authorization-to-operation.json", "energy-grid-capacity-to-service.json"]) {
  const path = join(contentRoot, "reader-pathways", file); const pathway = JSON.parse(await readFile(path, "utf8"));
  pathway.research_collection_ids = appendUnique(pathway.research_collection_ids, [collectionId]);
  pathway.dependency_stack = [...pathway.dependency_stack.filter((item) => item.stage !== "Phase 57S reader verification, freshness, and provenance exports"), { stage: "Phase 57S reader verification, freshness, and provenance exports",
    current_state: "Nine lifecycle manifests, nine freshness schemas, nine export schemas, and 450 cases pass; zero actual manifests, verifications, exports, reconciliation receipts, triggers, or closures are recorded.",
    boundary: "Verification, freshness, exports, and reconciliation are integrity controls, not evidence, acceptance, implementation, capability, closure, attribution, or operating outcomes." }];
  await writeJson(path, pathway);
}
const mapPath = join(contentRoot, "dependency-maps", "comparative-outcomes-require-common-denominators.json");
const map = JSON.parse(await readFile(mapPath, "utf8"));
map.nodes = [...map.nodes.filter((node) => node.id !== "node-phase57s-reader-verification-freshness"), { id: "node-phase57s-reader-verification-freshness", label: "Nine lifecycle manifests; nine freshness detectors; nine provenance exports; zero actual events", node_type: "Signal", note: "Complete histories and notices are digest-bound, stale or partial views fail closed, and reconciliation appends findings without rewrite." }];
map.links = [...map.links.filter((link) => link.from !== "node-phase57s-reader-verification-freshness"),
  { from: "node-phase57s-reader-verification-freshness", to: "node-phase57r-publication-status-provenance", relationship: "Depends On", confidence: "Supported", note: "Phase 57S verifies the complete status, notice, restore, republication, and provenance histories produced by Phase 57R." },
  { from: "node-phase57s-reader-verification-freshness", to: "node-denominator-break", relationship: "Constrained By", confidence: "Partial", note: "A valid digest chain cannot cure an incompatible identity, definition, unit, method, denominator, period, privacy, authority, or acceptance boundary." },
  { from: "node-phase57s-reader-verification-freshness", to: "node-causal-hold", relationship: "Limited By", confidence: "Missing Evidence", note: "Verification and provenance integrity do not establish implementation, capability, closure, operating outcomes, attribution, or causation." }];
await writeJson(mapPath, map);

console.log(`Generated Phase 57S: ${records.length} records (${published.length} Published, ${held.length} In Review), 27 schemas, 450 cases, 36 carried Tier 1 sources, Research Watch 049, one collection, one update, and integration across five topics, three pathways, and one dependency map.`);
