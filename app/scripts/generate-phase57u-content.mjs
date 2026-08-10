import { mkdir, readFile, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { runPhase57uHarness } from "./phase57u-governed-trust-recovery-harness.mjs";

const appRoot = fileURLToPath(new URL("..", import.meta.url));
const contentRoot = join(appRoot, "src", "content");
const dataRoot = join(appRoot, "src", "data");
const capturedDate = "2026-08-09";
const collectionSlug = "governed-keys-transparency-multi-origin-incidents-recovery-objectives-2026";
const collectionId = `research-collection-${collectionSlug}`;
const briefingSlug = "research-watch-051-governed-keys-transparency-and-incident-recovery";
const briefingId = `briefing-${briefingSlug}`;
const json = (value) => `${JSON.stringify(value, null, 2)}\n`;
const writeJson = async (path, value) => writeFile(path, json(value), "utf8");
const yamlList = (name, items) => [name + ":", ...items.map((item) => `  - ${JSON.stringify(item)}`)].join("\n");
const appendUnique = (items, additions) => [...new Set([...(items ?? []), ...additions])];

for (const name of ["research-documents", "signals", "research-collections", "briefings", "updates"]) await mkdir(join(contentRoot, name), { recursive: true });

const phase57t = JSON.parse(await readFile(join(dataRoot, "phase-57t-canonical-endpoints-signed-indexes-cache-mirror-recovery.json"), "utf8"));
const endpoints57t = JSON.parse(await readFile(join(dataRoot, "phase-57t-canonical-reader-verification-endpoints.json"), "utf8"));
const indexes57t = JSON.parse(await readFile(join(dataRoot, "phase-57t-signed-release-indexes.json"), "utf8"));
const recovery57t = JSON.parse(await readFile(join(dataRoot, "phase-57t-recovery-drill-fixtures.json"), "utf8"));
if (phase57t.phase !== "57T" || phase57t.records.length !== 54) throw new Error("Phase 57U requires the complete Phase 57T baseline.");
const harness = runPhase57uHarness({ endpointSchemas: endpoints57t.schemas, indexSchemas: indexes57t.schemas, recoverySchemas: recovery57t.schemas });
if (harness.keyRegistryCases.length !== 180 || harness.lifecycleCases.length !== 198 || harness.transparencyCases.length !== 198 || harness.originCases.length !== 180 || harness.incidentCases.length !== 198 || harness.recoveryObjectiveCases.length !== 216 || harness.allCases.length !== 1170 || harness.failures.length) {
  throw new Error("Phase 57U requires 1,170 passing key, lifecycle, transparency, origin, incident, and recovery-objective cases.");
}

const authorityBoundary = "Agency assertions, regulator evidence, FTFN controls, evidence-review identity, publication-review identity, release identity, publication identity, withdrawal identity, rollback identity, restore identity, republication identity, verification identity, endpoint identity, signing identity, key-custody identity, transparency-log identity, origin identity, incident identity, recovery identity, GAO acceptance, implementation, capability, closure, attribution, and operating outcomes remain separate evidence states.";
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
const held57t = phase57t.records.filter((record) => record.record_status === "In Review");
const published57t = phase57t.records.filter((record) => record.record_status === "Published");
if (held57t.length !== 9 || published57t.length !== 45) throw new Error("Phase 57U must inherit forty-five controls and exactly nine holds.");
const incrementKey = (key) => key.replace(/-(\d{2})$/, (_, value) => `-${String(Number(value) + 1).padStart(2, "0")}`);

const controlTypes = [
  { suffix: "governed-verification-key-registry", action: "GOVERNED-VERIFICATION-KEY-REGISTRY", stage: "Governed verification-key registry controls",
    title: (label) => `${label} receives a role-separated verification-key registry`,
    finding: "A contract-specific registry identifies staged, active, rotated, expired, and revoked keys; permits exactly one active key; binds that key to the current release index; and separates signing, custody, release authorization, and incident command.",
    denominator: "One contract-specific key-registry schema, twenty adversarial cases, six bounded valid routes, fourteen explicit rejections, and zero production keys activated or signatures issued.",
    limits: ["Fixture keys are nonproduction identities and contain no production key material.", "Unknown, expired, revoked, staged, overlapping, ambiguous, downgraded, rewritten, or role-conflicted keys fail closed.", "A trusted key proves bounded signer identity and integrity, not evidence truth, acceptance, publication, or operating outcome."],
    next: (label) => `Expose a ${label} trusted-key view only after one active key and four separated authority roles verify.`, registry: "phase-57u-governed-verification-key-registries.json" },
  { suffix: "key-lifecycle-activation-rotation-expiry-revocation-receipts", action: "KEY-LIFECYCLE-RECEIPTS", stage: "Key activation, rotation, expiry, and revocation receipt controls",
    title: (label) => `${label} receives append-only key lifecycle receipts`,
    finding: "Activation, rotation, expiry, and revocation events append sequence-bound receipts linking the prior receipt, current registry digest, authorized custody actor, independent release authorizer, key identity, receipt digest, and detached fixture signature.",
    denominator: "One contract-specific lifecycle-receipt schema, twenty-two adversarial cases, seven valid or preservation routes, fifteen explicit rejections, and zero actual key lifecycle events executed.",
    limits: ["Lifecycle receipts are fixture-only and do not activate, rotate, expire, or revoke a production key.", "Sequence regression, missing lineage, role conflict, unauthorized actors, overlapping activation, revoked targets, erasure, or signature mismatch reject.", "A valid lifecycle receipt cannot publish, close a hold, create evidence, or transfer editorial authority."],
    next: (label) => `Append a ${label} lifecycle receipt only after custody, authorization, signature, registry, and prior-receipt lineage all verify.`, registry: "phase-57u-key-lifecycle-receipts.json" },
  { suffix: "transparency-log-inclusion-consistency-proofs", action: "TRANSPARENCY-LOG-PROOFS", stage: "Transparency-log inclusion and consistency proof controls",
    title: (label) => `${label} receives append-only transparency proofs`,
    finding: "Current and prior release indexes plus the governed key registry remain included in a contract-specific append-only transparency tree whose inclusion proofs, consistency proof, tree size, and root digest can be independently checked.",
    denominator: "One contract-specific transparency schema, twenty-two adversarial cases, seven valid or preservation routes, fifteen explicit rejections, and zero production log entries or proofs published.",
    limits: ["Fixture log roots and proofs are synthetic and are not a public transparency service.", "Missing leaves, root or path mismatch, tree regression, truncation, replacement, reordering, split views, or unknown logs fail closed.", "Transparency proves append-only inclusion and consistency, not claim truth, implementation, closure, attribution, or causation."],
    next: (label) => `Require independently verifiable ${label} inclusion and consistency proofs before trusting the current key registry or release index.`, registry: "phase-57u-transparency-log-proofs.json" },
  { suffix: "multi-origin-consistency-without-majority-substitution", action: "MULTI-ORIGIN-CONSISTENCY", stage: "Multi-origin consistency and no-majority-substitution controls",
    title: (label) => `${label} receives three-origin consistency enforcement`,
    finding: "Canonical, mirror, and immutable archive observations must agree exactly on release-index digest, representation digest, transparency root, trusted-key identity, and observation time; any divergence fails closed and no majority state becomes authoritative.",
    denominator: "One contract-specific multi-origin schema, twenty adversarial cases, five bounded valid routes, fifteen fail-closed rejections, and zero actual origin observations recorded.",
    limits: ["A mirror or archive cannot replace the canonical lifecycle source-of-truth.", "Missing origins, stale observations, digest, root, or key divergence, canonical override, mirror promotion, archive promotion, or majority substitution reject.", "Origin agreement is a delivery-integrity control and cannot create evidence, publish, restore, close, attribute, or establish outcomes."],
    next: (label) => `Fail ${label} reader verification closed unless canonical, mirror, and archive observations are identical without voting.`, registry: "phase-57u-multi-origin-consistency.json" },
  { suffix: "incident-declaration-containment-recovery-receipts", action: "INCIDENT-CONTAINMENT-RECEIPTS", stage: "Incident declaration, containment, and post-incident integrity controls",
    title: (label) => `${label} receives bounded incident-containment receipts`,
    finding: "A declared integrity incident requires monotonic detection and containment times, an authorized incident commander, key freeze, fail-closed reader state, cache purge, mirror quarantine, log preservation, recovery-activation disablement, and an append-only receipt before separate recovery review.",
    denominator: "One contract-specific incident schema, twenty-two adversarial cases, six bounded valid routes, sixteen explicit rejections, and zero actual incidents, containment actions, or recovery events recorded.",
    limits: ["Fixture incidents and receipts are drills, not reports of operational compromise.", "Missing declaration, time regression, unauthorized command, incomplete containment, mutable receipt, undeclared recovery, majority override, publication, closure, or evidence inflation reject.", "Containment preserves inactive reader state and cannot adjudicate evidence, publish, restore, accept, implement, close, or establish outcomes."],
    next: (label) => `Keep ${label} state inactive until every containment action and a separate post-incident integrity check verify.`, registry: "phase-57u-incident-containment-receipts.json" },
  { suffix: "recovery-point-time-objective-drill", action: "RECOVERY-POINT-TIME-OBJECTIVE-DRILL", stage: "Recovery-point and recovery-time objective controls",
    title: (label) => `${label} receives measurable RPO and RTO recovery drills`,
    finding: "A bounded drill records explicit recovery-point and recovery-time targets, complete telemetry, observed values, objective margins, immutable-source reconstruction, append-only receipts, and inactive reader state; a missed objective fails closed rather than activating degraded state.",
    denominator: "One contract-specific recovery-objective schema, twenty-four adversarial cases, seven valid or preservation routes, seventeen explicit rejections, and zero actual recovery drills or reader-state changes executed.",
    limits: ["Fixture RPO and RTO values are control targets, not production service guarantees.", "Missing, negative, backdated, substituted, exceeded, mutable, rewriting, activating, publishing, or evidence-inflating drills reject.", "Meeting a recovery objective proves bounded fixture reconstruction only and cannot create evidence, publish, restore, close, attribute, or establish operating outcomes."],
    next: (label) => `Measure ${label} RPO and RTO against immutable history while keeping every reconstructed state inactive pending separate human verification.`, registry: "phase-57u-recovery-objective-drills.json" },
];

const records = [];
let documentNumber = 1207;
for (const priorHold of held57t) {
  const [shortSlug, label, prefix] = contracts[priorHold.reopening_contract_id] ?? [];
  const meta = agencyMeta[priorHold.agency];
  const sourceRecord = published57t.find((record) => record.action_key.startsWith(prefix));
  if (!shortSlug || !meta || !sourceRecord) throw new Error(`Incomplete Phase 57U metadata for ${priorHold.reopening_contract_id}`);
  for (const control of controlTypes) {
    const slug = `57u-${shortSlug}-${control.suffix}`;
    records.push({ record_id: `record-${slug}`, document_id: `research-doc-${slug}`, signal_id: `signal-${slug}`, document_number: documentNumber++, record_status: "Published", agency: priorHold.agency,
      action_key: `${prefix}-${control.action}-2026-01`, parent_hold_key: null, reopening_contract_id: null, evidence_stage: control.stage, title: control.title(label), finding: control.finding,
      denominator: control.denominator, evidence_limits: control.limits, next_action: control.next(label), structured_registry_file: control.registry, source_id: sourceRecord.source_id,
      supporting_source_ids: sourceRecord.supporting_source_ids, official_url: sourceRecord.official_url, publication_date: capturedDate, document_type: "Data Release", authority_boundary: authorityBoundary,
      meta: { ...meta, shortSlug, label, prefix } });
  }
}
for (const priorHold of held57t) {
  const [shortSlug, label, prefix] = contracts[priorHold.reopening_contract_id];
  const meta = { ...agencyMeta[priorHold.agency], shortSlug, label, prefix };
  const slug = `57u-preserved-${shortSlug}`;
  records.push({ ...priorHold, record_id: `record-${slug}`, document_id: `research-doc-${slug}`, signal_id: `signal-${slug}`, document_number: documentNumber++, record_status: "In Review",
    action_key: incrementKey(priorHold.action_key), parent_hold_key: priorHold.action_key, evidence_stage: "Governed keys, transparency, origin consistency, incident, and recovery-objective hold",
    title: `${label} remains In Review after governed trust and incident-recovery execution`,
    finding: "One hundred thirty fixture-only cases pass, but no actual key event, signature, transparency entry, origin observation, incident, receipt, recovery drill, target packet, or evidence event exists.",
    denominator: "One inherited hold, twenty key-registry cases, twenty-two lifecycle cases, twenty-two transparency cases, twenty origin cases, twenty-two incident cases, twenty-four recovery-objective cases, and zero actual workflow or evidence events.",
    evidence_limits: ["Synthetic keys, signatures, logs, proofs, observations, incidents, receipts, replays, and drills are not publication history or evidence.", "No fixture creates a trusted production key, log entry, origin state, incident, recovered state, trigger, publication, or closure.", "The inherited hold cannot close or publish automatically."],
    next_action: `Keep ${label} In Review until the exact target evidence satisfies its unchanged reopening contract.`, structured_registry_file: "phase-57u-governed-trust-recovery-harness-results.json", publication_date: capturedDate, authority_boundary: authorityBoundary, meta });
}
if (records.length !== 63 || documentNumber !== 1270) throw new Error("Phase 57U document numbering must span 1207 through 1269.");
const published = records.filter((record) => record.record_status === "Published");
const held = records.filter((record) => record.record_status === "In Review");
const carriedSources = [...new Set(published.flatMap((record) => record.supporting_source_ids))];
if (published.length !== 54 || held.length !== 9 || carriedSources.length !== 36) throw new Error("Phase 57U requires 54 Published controls, 9 holds, and 36 carried Tier 1 sources.");

const registries = [
  ["phase-57u-governed-verification-key-registries.json", { registry_type: "Governed verification-key registries and role-separated trust roots", schema_count: 9, case_count: 180, valid_routes: 54, rejected_routes: 126, actual_key_events: 0, schemas: harness.keyRegistrySchemas, case_distribution: harness.distributions.key_registry, cases: harness.keyRegistryCases }],
  ["phase-57u-key-lifecycle-receipts.json", { registry_type: "Append-only activation, rotation, expiry, and revocation receipts", schema_count: 9, case_count: 198, valid_or_preservation_routes: 63, rejected_routes: 135, actual_key_lifecycle_events: 0, schemas: harness.lifecycleSchemas, case_distribution: harness.distributions.lifecycle, cases: harness.lifecycleCases }],
  ["phase-57u-transparency-log-proofs.json", { registry_type: "Transparency-log inclusion and consistency proofs", schema_count: 9, case_count: 198, valid_or_preservation_routes: 63, rejected_routes: 135, actual_log_entries_or_proofs: 0, schemas: harness.transparencySchemas, case_distribution: harness.distributions.transparency, cases: harness.transparencyCases }],
  ["phase-57u-multi-origin-consistency.json", { registry_type: "Canonical, mirror, and archive consistency without majority substitution", schema_count: 9, case_count: 180, valid_routes: 45, rejected_routes: 135, actual_origin_observations: 0, schemas: harness.originSchemas, case_distribution: harness.distributions.origin, cases: harness.originCases }],
  ["phase-57u-incident-containment-receipts.json", { registry_type: "Incident declaration, containment, recovery, and post-incident integrity receipts", schema_count: 9, case_count: 198, valid_routes: 54, rejected_routes: 144, actual_incidents_or_receipts: 0, schemas: harness.incidentSchemas, case_distribution: harness.distributions.incident, cases: harness.incidentCases }],
  ["phase-57u-recovery-objective-drills.json", { registry_type: "Recovery-point and recovery-time objective drills", schema_count: 9, case_count: 216, valid_or_preservation_routes: 63, rejected_routes: 153, actual_recovery_drills: 0, actual_reader_state_changes: 0, schemas: harness.recoveryObjectiveSchemas, case_distribution: harness.distributions.recovery_objective, cases: harness.recoveryObjectiveCases }],
];
for (const [file, data] of registries) await writeJson(join(dataRoot, file), { phase: "57U", captured_date: capturedDate, passed_case_count: data.case_count, failed_case_count: 0, fixture_only: true, ...data });
await writeJson(join(dataRoot, "phase-57u-governed-trust-recovery-harness-results.json"), { phase: "57U", captured_date: capturedDate, total_case_count: 1170, passed_case_count: 1170, failed_case_count: 0,
  key_registry_case_count: 180, key_lifecycle_case_count: 198, transparency_case_count: 198, multi_origin_case_count: 180, incident_case_count: 198, recovery_objective_case_count: 216,
  valid_or_preservation_routes: 342, rejected_routes: 828, test_ids: harness.allCases.map((row) => row.test_id), actual_key_events: 0, actual_signatures: 0, actual_log_entries: 0,
  actual_origin_observations: 0, actual_incidents: 0, actual_receipts: 0, actual_replays: 0, actual_recovery_drills: 0, actual_reader_state_changes: 0, evidence_records_created: 0,
  reopening_triggers_fired: 0, automated_closures_or_publications: 0, prior_artifact_rewrites: 0 });

const mainLedger = { phase: "57U", captured_date: capturedDate,
  goal: "Let readers identify the current trust root, verify append-only release history across origins, contain integrity incidents, and measure recovery objectives while every divergence fails closed and reconstructed state remains inactive.",
  publication_rule: "Publish fifty-four contract-specific governed-key, lifecycle, transparency, origin, incident, and recovery-objective controls; retain all nine inherited outcome records In Review.", authority_rule: authorityBoundary,
  records_reviewed: 63, records_published: 54, records_held: 9, evidence_stage_counts: Object.fromEntries([...controlTypes.map((control) => [control.stage, 9]), ["Governed keys, transparency, origin consistency, incident, and recovery-objective hold", 9]]),
  new_official_source_profiles: 0, carried_official_source_profiles: 36, structured_rails: 6, key_registry_schemas: 9, key_lifecycle_schemas: 9, transparency_schemas: 9, multi_origin_schemas: 9, incident_schemas: 9, recovery_objective_schemas: 9, total_contract_specific_schemas: 54,
  key_registry_cases: 180, key_lifecycle_cases: 198, transparency_cases: 198, multi_origin_cases: 180, incident_cases: 198, recovery_objective_cases: 216,
  valid_key_routes: 54, rejected_key_routes: 126, valid_lifecycle_routes: 63, rejected_lifecycle_routes: 135, valid_transparency_routes: 63, rejected_transparency_routes: 135,
  valid_origin_routes: 45, rejected_origin_routes: 135, valid_incident_routes: 54, rejected_incident_routes: 144, valid_recovery_objective_routes: 63, rejected_recovery_objective_routes: 153,
  total_workflow_cases: 1170, valid_or_preservation_routes: 342, rejected_routes: 828, workflow_test_failures: 0,
  actual_key_events: 0, actual_signatures: 0, actual_log_entries: 0, actual_origin_observations: 0, actual_incidents: 0, actual_receipts: 0, actual_replays: 0, actual_recovery_drills: 0,
  actual_reader_state_changes: 0, eligible_records_accepted: 0, exact_target_artifacts_acquired: 0, exact_target_trigger_events: 0, public_agency_contacts_or_foia_requests: 0,
  directive_scope_changes: 0, implementation_changes: 0, capability_changes: 0, closure_changes: 0, attribution_changes: 0, operating_outcome_changes: 0, inherited_entity_ledger_closure_changes: 0,
  prior_visible_scope: { sources: 715, signals: 1091, published: 849, in_review: 242, research_collections: 55, research_documents: 1207, briefings: 58, updates: 74, research_export_records: 1039 },
  post_batch_visible_scope: { sources: 715, signals: 1154, published: 903, in_review: 251, research_collections: 56, research_documents: 1270, briefings: 59, updates: 75, research_export_records: 1094 },
  post_batch_closure_counts: { Closed: 1, "Partially Closed": 21, Open: 2 }, preserved_phase57t_holds: held57t.map((record) => record.action_key), reopening_contract_ids: held57t.map((record) => record.reopening_contract_id), new_visible_holds: [],
  records: records.map(({ meta, ...record }) => record) };
await writeJson(join(dataRoot, "phase-57u-governed-keys-transparency-origins-incidents-recovery.json"), mainLedger);
await writeJson(join(dataRoot, "phase-57u-publication-review.json"), { phase: "57U", captured_date: capturedDate, promoted_document_ids: published.map((record) => record.document_id), promoted_signal_ids: published.map((record) => record.signal_id),
  held_document_ids: held.map((record) => record.document_id), held_signal_ids: held.map((record) => record.signal_id), inherited_hold_lineage: held.map((record) => ({ action_key: record.action_key, parent_hold_key: record.parent_hold_key, reopening_contract_id: record.reopening_contract_id })),
  key_registry_schemas_created: 9, key_lifecycle_schemas_created: 9, transparency_schemas_created: 9, multi_origin_schemas_created: 9, incident_schemas_created: 9, recovery_objective_schemas_created: 9,
  total_workflow_cases_executed: 1170, actual_key_events: 0, actual_signatures: 0, actual_log_entries: 0, actual_origin_observations: 0, actual_incidents: 0, actual_receipts: 0, actual_recovery_drills: 0, actual_reader_state_changes: 0,
  decision: "Fifty-four governed-key, lifecycle, transparency, origin, incident, and recovery-objective controls publish. All nine inherited holds remain In Review; every case is synthetic and no production key, signature, log, observation, incident, receipt, recovery, reader-state, evidence, trigger, publication, or closure event is recorded." });

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
${yamlList("dependencies", ["complete Phase 57T canonical delivery and immutable recovery controls", "role-separated governed key registry", "append-only key lifecycle receipt chain", "transparency inclusion and consistency proofs", "canonical, mirror, and archive agreement", "incident containment and inactive RPO/RTO reconstruction"])}
${yamlList("constraints", ["Data Quality", "Regulation", "Public Trust"])}
${yamlList("receiving_systems", ["Phase 57U governed trust, transparency, incident, and recovery-objective controls"])}
${yamlList("local_implications", ["Do not convert a synthetic key, signature, log entry, proof, origin observation, incident, receipt, replay, or recovery drill into evidence, eligibility, implementation, capability, closure, attribution, or operating outcomes."])}
${yamlList("evidence_gap_ids", record.meta.gaps)}
claim_scope: "Specific Source Update"
local_evidence_level: "General Source Layer"
last_reviewed_date: ${capturedDate}
editorial_notes: ${JSON.stringify(record.record_status === "Published" ? "Published under the Phase 57U governed-trust and fail-closed recovery contract." : `Held under ${record.reopening_contract_id}; no actual Phase 57U key, log, origin, incident, receipt, or recovery event exists.`)}
---

## Phase 57U governed trust and recovery control

${record.finding}

## Evidence stage and denominator

**${record.evidence_stage}.** ${record.denominator}

Structured registry: ${record.structured_registry_file}.
${record.reopening_contract_id ? `\nReopening contract: ${record.reopening_contract_id}. Trigger state: **not fired**.\n` : ""}
## Evidence boundaries

${record.evidence_limits.map((limit) => `- ${limit}`).join("\n")}

Actual production keys, signatures, logs, observations, incidents, receipts, recoveries, reader-state changes, triggers, publications, and closures: **Zero**. FTFN submitted no agency contact or FOIA request.

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
    why_it_matters: "The record makes key governance, release-history transparency, multi-origin agreement, incident containment, and measured recovery independently auditable without creating an editorial event or changing evidence state.",
    ftfn_relevance: ["Binds the exact Phase 57T release index to one governed active key and separated authority roles.", "Verifies current and prior indexes through append-only transparency proofs across three origins.", "Contains integrity incidents and measures RPO/RTO while reconstructed state remains inactive."],
    evidence_limits: ["Not publicly acquired does not mean nonexistent, withheld, or never submitted.", "FTFN public-source research is not agency contact or a submitted FOIA request.", ...record.evidence_limits, "The inherited 1 Closed / 21 Partially Closed / 2 Open entity ledger remains unchanged.", "No record supports a ranking, composite score, readiness score, generalized savings claim, or unsupported causal inference."],
    primary_topics: record.meta.topics, framework_layers: record.meta.layers, constraint_tags: ["Data Quality", "Regulation", "Public Trust"], source_id: record.source_id, supporting_source_ids: record.supporting_source_ids,
    supporting_official_urls: [record.official_url], official_url: record.official_url, local_capture_path: `/downloads/${collectionSlug}/official-links/${String(index + 1).padStart(2, "0")}-phase57u-record.txt`,
    archive_member: `official-links/${String(index + 1).padStart(2, "0")}-phase57u-record.txt`, capture_status: "Official link record", captured_date: capturedDate });
}

await writeJson(join(contentRoot, "research-collections", `${collectionSlug}.json`), { id: collectionId, title: "Governed Keys, Transparency, Multi-Origin Integrity, Incidents, and Recovery Objectives, 2026", slug: collectionSlug, record_status: "Published",
  summary: "Phase 57U executes 1,170 synthetic governed-key, key-lifecycle, transparency, multi-origin, incident, and recovery-objective cases across nine contracts while preserving every inherited hold and failing every trust, origin, incident, or recovery divergence closed.",
  scope: "Nine schemas on each of six trust and recovery rails, 1,170 cases, fifty-four Published controls, nine preserved holds, thirty-six carried Tier 1 sources, and zero actual key, signature, log, origin, incident, receipt, recovery, or reader-state events.",
  captured_date: capturedDate, document_ids: records.map((record) => record.document_id), download_path: `/downloads/${collectionSlug}.zip`,
  download_note: "The sixty-six-file archive contains sixty-three official-link records, consolidated summaries, a README, and a checksum manifest.",
  method_note: "Every key, signature, lifecycle event, log entry, proof, origin observation, incident, receipt, replay, and recovery drill is synthetic. Unknown or revoked signers, inconsistent logs, divergent origins, incomplete containment, and missed recovery objectives fail closed; reconstructed state never activates automatically." });

const briefing = `---
id: ${JSON.stringify(briefingId)}
title: "Research Watch 051: Governed Keys, Transparency, and Incident Recovery"
slug: ${JSON.stringify(briefingSlug)}
record_status: "Published"
summary: "Phase 57U passes 1,170 synthetic key, lifecycle, transparency, origin, incident, and recovery-objective cases while preserving all nine holds and keeping every production trust, incident, recovery, trigger, and evidence-event count at zero."
published_date: ${capturedDate}
captured_date: ${capturedDate}
${yamlList("signal_ids", records.map((record) => record.signal_id))}
${yamlList("evidence_gap_ids", ["gap-008", "gap-015", "gap-016"])}
claim_scope: "Editorial Synthesis"
local_evidence_level: "General Source Layer"
last_reviewed_date: ${capturedDate}
${yamlList("top_takeaways", ["Nine role-separated registries permit one current trusted key and reject unknown, expired, revoked, staged, ambiguous, or conflicted signers.", "Nine lifecycle chains preserve activation, rotation, expiry, and revocation receipts without rewriting prior events.", "Current and prior indexes plus key registries remain included in append-only transparency trees whose inclusion and consistency proofs can be checked across canonical, mirror, and archive observations.", "Incident containment and RPO/RTO drills keep reader state inactive; fifty-four controls publish and all nine holds remain In Review."])}
${yamlList("constraint_watch", ["Data Quality", "Regulation", "Public Trust"])}
${yamlList("what_to_watch_next", ["One production key registry with independently governed custody and release authorization", "One external transparency service carrying current and prior release-index proofs", "One real three-origin observation receipt that fails divergence closed without majority substitution", "One scheduled incident and recovery-objective drill with post-incident verification and inactive reconstructed state"])}
---

## What Phase 57U proves

Reader-verification trust roots and release histories can be made independently checkable through role-separated key governance, append-only lifecycle receipts, transparency proofs, exact multi-origin agreement, bounded incident containment, and measurable recovery objectives.

## What did not move

No synthetic key, signature, log entry, proof, origin observation, incident, receipt, replay, or recovery drill is an actual editorial or infrastructure event. No reader state activates, no trigger or hold closes, and every inherited hold remains In Review.

## Evidence boundary

The entity ledger remains one Closed, twenty-one Partially Closed, and two Open. Phase 57U records no agency contact, FOIA request, directive-scope change, implementation change, capability change, closure change, attribution change, or operating-outcome change.
`;
await writeFile(join(contentRoot, "briefings", `${briefingSlug}.mdx`), briefing, "utf8");
await writeJson(join(contentRoot, "updates", "2026-08-09-phase-57u-governed-keys-transparency-incident-recovery.json"), { id: "update-2026-08-09-phase-57u-governed-keys-transparency-incident-recovery", effective_date: capturedDate, entry_type: "Research Collection",
  title: "Phase 57U governs verification keys, proves append-only history, contains incidents, and measures recovery", summary: "Thirty-six carried Tier 1 sources support fifty-four Published controls, nine preserved holds, fifty-four schemas, 1,170 executable cases, governed key registries, append-only lifecycle receipts, transparency proofs, exact three-origin consistency, incident containment, and RPO/RTO drills.",
  affected_record_ids: [collectionId, briefingId, ...records.map((record) => record.signal_id)], related_paths: [`/research/${collectionSlug}/`, `/briefings/${briefingSlug}/`, ...records.map((record) => `/signals/${record.signal_id.replace(/^signal-/, "")}/`)],
  evidence_note: "Synthetic keys, signatures, lifecycle events, logs, proofs, origin observations, incidents, receipts, replays, and recovery drills remain separate from source evidence, reviewer identity, acceptance, implementation, capability, closure, attribution, and operating outcomes.",
  work_package: "docs/work-packages/phase-57u-governed-keys-transparency-multi-origin-incidents-recovery-objectives.md" });

for (const file of ["finance-and-risk.json", "policy-and-standards.json", "mobility.json", "chips-and-compute.json", "energy.json"]) {
  const path = join(contentRoot, "topics", file); const topic = JSON.parse(await readFile(path, "utf8"));
  topic.watch_questions = appendUnique(topic.watch_questions, ["Which real Phase 57U trust root first proves current and prior release indexes through governed keys, append-only transparency, exact three-origin agreement, incident containment, and measured recovery objectives without activating reconstructed state?"]);
  await writeJson(path, topic);
}
for (const file of ["policy-standards-to-implementation.json", "cross-corridor-authorization-to-operation.json", "energy-grid-capacity-to-service.json"]) {
  const path = join(contentRoot, "reader-pathways", file); const pathway = JSON.parse(await readFile(path, "utf8"));
  pathway.research_collection_ids = appendUnique(pathway.research_collection_ids, [collectionId]);
  pathway.dependency_stack = [...pathway.dependency_stack.filter((item) => item.stage !== "Phase 57U governed trust, transparency, incident, and recovery objectives"), { stage: "Phase 57U governed trust, transparency, incident, and recovery objectives",
    current_state: "Nine schemas on each of six rails pass 1,170 cases; zero production keys, signatures, log entries, origin observations, incidents, receipts, recoveries, reader-state changes, triggers, publications, or closures are recorded.",
    boundary: "Key governance, transparency, origin agreement, incident containment, and recovery objectives are integrity controls, not evidence, acceptance, implementation, capability, closure, attribution, or operating outcomes." }];
  await writeJson(path, pathway);
}
const mapPath = join(contentRoot, "dependency-maps", "comparative-outcomes-require-common-denominators.json");
const map = JSON.parse(await readFile(mapPath, "utf8"));
map.nodes = [...map.nodes.filter((node) => node.id !== "node-phase57u-governed-trust-recovery"), { id: "node-phase57u-governed-trust-recovery", label: "Nine governed trust roots; transparency and three-origin integrity; incident and recovery objectives; zero actual events", node_type: "Signal", note: "Unknown or revoked keys, inconsistent logs, divergent origins, incomplete containment, or missed recovery objectives fail closed while reconstructed state remains inactive." }];
map.links = [...map.links.filter((link) => link.from !== "node-phase57u-governed-trust-recovery"),
  { from: "node-phase57u-governed-trust-recovery", to: "node-phase57t-canonical-delivery-recovery", relationship: "Depends On", confidence: "Supported", note: "Phase 57U governs and observes only the exact canonical release indexes, representations, mirrors, archives, and immutable recovery state established by Phase 57T." },
  { from: "node-phase57u-governed-trust-recovery", to: "node-denominator-break", relationship: "Constrained By", confidence: "Partial", note: "Cryptographic and operational integrity cannot cure an incompatible identity, definition, unit, method, denominator, period, privacy, authority, or acceptance boundary." },
  { from: "node-phase57u-governed-trust-recovery", to: "node-causal-hold", relationship: "Limited By", confidence: "Missing Evidence", note: "Keys, proofs, origin agreement, incident receipts, and recovery objectives do not establish implementation, capability, closure, operating outcomes, attribution, or causation." }];
await writeJson(mapPath, map);

console.log(`Generated Phase 57U: ${records.length} records (${published.length} Published, ${held.length} In Review), 54 schemas, 1,170 cases, 36 carried Tier 1 sources, Research Watch 051, one collection, one update, and integration across five topics, three pathways, and one dependency map.`);
