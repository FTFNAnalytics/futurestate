
import { mkdir, readFile, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { runPhase57vHarness } from "./phase57v-threshold-witness-gossip-compromise-harness.mjs";

const appRoot = fileURLToPath(new URL("..", import.meta.url));
const contentRoot = join(appRoot, "src", "content");
const dataRoot = join(appRoot, "src", "data");
const capturedDate = "2026-08-10";
const collectionSlug = "threshold-authorization-witness-gossip-trusted-time-verifier-diversity-compromise-recovery-2026";
const collectionId = `research-collection-${collectionSlug}`;
const briefingSlug = "research-watch-052-threshold-trust-and-compromise-recovery";
const briefingId = `briefing-${briefingSlug}`;
const json = (value) => `${JSON.stringify(value, null, 2)}\n`;
const writeJson = async (path, value) => writeFile(path, json(value), "utf8");
const yamlList = (name, items) => [name + ":", ...items.map((item) => `  - ${JSON.stringify(item)}`)].join("\n");
const appendUnique = (items, additions) => [...new Set([...(items ?? []), ...additions])];

for (const name of ["research-documents", "signals", "research-collections", "briefings", "updates"]) await mkdir(join(contentRoot, name), { recursive: true });

const phase57u = JSON.parse(await readFile(join(dataRoot, "phase-57u-governed-keys-transparency-origins-incidents-recovery.json"), "utf8"));
const keys57u = JSON.parse(await readFile(join(dataRoot, "phase-57u-governed-verification-key-registries.json"), "utf8"));
const lifecycle57u = JSON.parse(await readFile(join(dataRoot, "phase-57u-key-lifecycle-receipts.json"), "utf8"));
const transparency57u = JSON.parse(await readFile(join(dataRoot, "phase-57u-transparency-log-proofs.json"), "utf8"));
const origins57u = JSON.parse(await readFile(join(dataRoot, "phase-57u-multi-origin-consistency.json"), "utf8"));
const incidents57u = JSON.parse(await readFile(join(dataRoot, "phase-57u-incident-containment-receipts.json"), "utf8"));
const recovery57u = JSON.parse(await readFile(join(dataRoot, "phase-57u-recovery-objective-drills.json"), "utf8"));
if (phase57u.phase !== "57U" || phase57u.records.length !== 63) throw new Error("Phase 57V requires the complete Phase 57U baseline.");
const harness = runPhase57vHarness({ keySchemas: keys57u.schemas, lifecycleSchemas: lifecycle57u.schemas, transparencySchemas: transparency57u.schemas, originSchemas: origins57u.schemas, incidentSchemas: incidents57u.schemas, recoverySchemas: recovery57u.schemas });
if (harness.thresholdCases.length !== 225 || harness.witnessCases.length !== 216 || harness.gossipCases.length !== 198 || harness.trustedTimeCases.length !== 207 || harness.verifierCases.length !== 216 || harness.compromiseRecoveryCases.length !== 234 || harness.allCases.length !== 1296 || harness.failures.length) {
  throw new Error("Phase 57V requires 1,296 passing threshold, witness, gossip, trusted-time, verifier-diversity, and compromise-recovery cases.");
}

const authorityBoundary = "Agency assertions, regulator evidence, FTFN controls, evidence-review identity, publication-review identity, release identity, publication identity, withdrawal identity, rollback identity, restore identity, republication identity, signing identity, key-custody identity, threshold-share identity, witness identity, transparency-log identity, gossip-peer identity, time-authority identity, verifier identity, incident identity, compromise-recovery identity, GAO acceptance, implementation, capability, closure, attribution, and operating outcomes remain separate evidence states.";
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
const held57u = phase57u.records.filter((record) => record.record_status === "In Review");
const published57u = phase57u.records.filter((record) => record.record_status === "Published");
if (held57u.length !== 9 || published57u.length !== 54) throw new Error("Phase 57V must inherit fifty-four controls and exactly nine holds.");
const incrementKey = (key) => key.replace(/-(\d{2})$/, (_, value) => `-${String(Number(value) + 1).padStart(2, "0")}`);

const controlTypes = [
  { suffix: "threshold-release-authorization", action: "THRESHOLD-RELEASE-AUTHORIZATION", stage: "M-of-N threshold release-authorization controls",
    title: (label) => `${label} receives actor- and domain-separated threshold authorization`,
    finding: "A contract-specific three-of-five release policy binds each share to the exact release digest, named role, distinct actor, and independent authority domain; same-actor or same-domain quorum construction fails closed and authorization never publishes automatically.",
    denominator: "One threshold schema, twenty-five adversarial cases, seven bounded valid routes, eighteen explicit rejections, and zero production threshold shares or release authorizations issued.",
    limits: ["Fixture shares contain no production secret material and confer no production authority.", "Below-threshold, duplicated, unknown, expired, revoked, staged, mismatched, replayed, rewritten, publishing, closing, or evidence-inflating quorum fixtures reject.", "Threshold authorization proves a bounded integrity decision only; it cannot accept evidence, publish, restore, implement, close, attribute, or establish outcomes."],
    next: (label) => `Authorize a ${label} release only after three distinct actors in three independent domains bind valid shares to the exact digest.`, registry: "phase-57v-threshold-release-authorizations.json" },
  { suffix: "independent-witness-checkpoints", action: "INDEPENDENT-WITNESS-CHECKPOINTS", stage: "Independent witness-checkpoint controls",
    title: (label) => `${label} receives independently witnessed transparency checkpoints`,
    finding: "Three independent witness identities observe a sequence-bound checkpoint; at least two distinct operators on distinct infrastructure domains must validate the exact checkpoint, tree, release digest, and prior-checkpoint lineage.",
    denominator: "One witness schema, twenty-four adversarial cases, seven valid or preservation routes, seventeen explicit rejections, and zero production witness signatures or checkpoints issued.",
    limits: ["Fixture witnesses and signatures are synthetic and do not operate a public witness service.", "Insufficient, duplicated, same-operator, same-domain, invalid, regressive, unknown, revoked, rewritten, activating, publishing, closing, or evidence-inflating checkpoints reject.", "Witness consensus proves checkpoint integrity, not claim truth, publication authority, implementation, closure, attribution, or causation."],
    next: (label) => `Trust a ${label} checkpoint only after independent witness threshold, lineage, tree, and release bindings verify.`, registry: "phase-57v-independent-witness-checkpoints.json" },
  { suffix: "cross-log-gossip-split-view-detection", action: "CROSS-LOG-GOSSIP", stage: "Cross-log gossip and split-view detection controls",
    title: (label) => `${label} receives cross-log gossip split-view detection`,
    finding: "Primary and independent witness logs exchange the same checkpoint digest, tree root, and tree size; missing peers, stale observations, any split view, history rewrite, or majority substitution fails closed.",
    denominator: "One gossip schema, twenty-two adversarial cases, six bounded valid routes, sixteen explicit rejections, and zero production gossip messages exchanged.",
    limits: ["Fixture gossip messages are synthetic and do not establish continuous log availability.", "Missing logs or peers, stale messages, divergent digests, roots, sizes, unknown logs, replay, override, majority substitution, rewriting, activation, publication, closure, or evidence inflation reject.", "Log agreement is an integrity control and cannot create source evidence or an editorial decision."],
    next: (label) => `Fail ${label} verification closed on any cross-log split view without allowing two matching logs to vote a divergent log into authority.`, registry: "phase-57v-cross-log-gossip.json" },
  { suffix: "trusted-time-anti-rollback-receipts", action: "TRUSTED-TIME-ANTI-ROLLBACK", stage: "Trusted-time and anti-rollback receipt controls",
    title: (label) => `${label} receives monotonic trusted-time receipts`,
    finding: "An independent time authority binds monotonic sequence, counter, observation time, prior receipt, release digest, and checkpoint digest; time regression, counter reuse, lineage loss, authority conflict, or backdating fails closed.",
    denominator: "One trusted-time schema, twenty-three adversarial cases, six bounded valid routes, seventeen explicit rejections, and zero production time receipts issued.",
    limits: ["Fixture time receipts are synthetic and provide no production timestamping guarantee.", "Regressive, reused, missing, mismatched, conflicted, invalid, skewed, stale, rewritten, publishing, closing, or evidence-inflating time fixtures reject.", "Trusted time orders integrity events but cannot make evidence true, accepted, implemented, closed, attributable, or outcome-bearing."],
    next: (label) => `Accept a ${label} integrity event only after independent monotonic time and prior-receipt lineage verify.`, registry: "phase-57v-trusted-time-receipts.json" },
  { suffix: "three-implementation-verifier-diversity", action: "VERIFIER-DIVERSITY-CONFORMANCE", stage: "Verifier-diversity and reproducible-conformance controls",
    title: (label) => `${label} receives three-implementation verifier conformance`,
    finding: "At least three independently operated verifier implementations from distinct codebase families must reproduce the same artifact digest, integrity-only decision, and deterministic result digest; every divergence fails closed without majority substitution.",
    denominator: "One verifier-diversity schema, twenty-four adversarial cases, seven valid or preservation routes, seventeen explicit rejections, and zero production verifier runs executed.",
    limits: ["Fixture verifier identities and results are synthetic and do not certify production software.", "Insufficient diversity, shared codebases or operators, digest or decision divergence, conformance failure, nondeterminism, unknown or revoked implementations, rewriting, activation, publication, closure, or evidence inflation reject.", "Verifier agreement establishes bounded reproducibility only, not evidence acceptance, publication, implementation, closure, attribution, or outcomes."],
    next: (label) => `Require reproducible ${label} integrity results across at least three independent implementations before reader acceptance.`, registry: "phase-57v-verifier-diversity-conformance.json" },
  { suffix: "algorithm-key-compromise-recovery", action: "ALGORITHM-KEY-COMPROMISE-RECOVERY", stage: "Algorithm and key-compromise recovery controls",
    title: (label) => `${label} receives bounded algorithm and key-compromise recovery`,
    finding: "A declared compromise freezes and revokes the affected key, disables its algorithm, requires a distinct replacement key and algorithm, threshold authorization, witnessed checkpoint, trusted time, and independent historical re-verification while reconstructed state remains inactive.",
    denominator: "One compromise-recovery schema, twenty-six adversarial cases, seven valid or preservation routes, nineteen explicit rejections, and zero actual compromise events, recovery actions, algorithm migrations, or reader activations.",
    limits: ["Fixture compromise events and recovery actions are drills, not reports of an operational compromise.", "Missing containment, reused keys or algorithms, absent quorum, witness or time proof, retroactive trust, automatic re-trust, rewrite, replay, backdating, activation, publication, closure, or evidence inflation reject.", "Recovery never retroactively trusts artifacts signed by a compromised key and cannot publish or close a hold automatically."],
    next: (label) => `Recover ${label} only through clean key and algorithm replacement plus independent re-verification, with all reconstructed state inactive.`, registry: "phase-57v-compromise-recovery.json" },
];

const records = [];
let documentNumber = 1270;
for (const priorHold of held57u) {
  const [shortSlug, label, prefix] = contracts[priorHold.reopening_contract_id] ?? [];
  const meta = agencyMeta[priorHold.agency];
  const sourceRecord = published57u.find((record) => record.action_key.startsWith(prefix));
  if (!shortSlug || !meta || !sourceRecord) throw new Error(`Incomplete Phase 57V metadata for ${priorHold.reopening_contract_id}`);
  for (const control of controlTypes) {
    const slug = `57v-${shortSlug}-${control.suffix}`;
    records.push({ record_id: `record-${slug}`, document_id: `research-doc-${slug}`, signal_id: `signal-${slug}`, document_number: documentNumber++, record_status: "Published", agency: priorHold.agency,
      action_key: `${prefix}-${control.action}-2026-01`, parent_hold_key: null, reopening_contract_id: null, evidence_stage: control.stage, title: control.title(label), finding: control.finding,
      denominator: control.denominator, evidence_limits: control.limits, next_action: control.next(label), structured_registry_file: control.registry, source_id: sourceRecord.source_id,
      supporting_source_ids: sourceRecord.supporting_source_ids, official_url: sourceRecord.official_url, publication_date: capturedDate, document_type: "Data Release", authority_boundary: authorityBoundary,
      meta: { ...meta, shortSlug, label, prefix } });
  }
}
for (const priorHold of held57u) {
  const [shortSlug, label, prefix] = contracts[priorHold.reopening_contract_id];
  const meta = { ...agencyMeta[priorHold.agency], shortSlug, label, prefix };
  const slug = `57v-preserved-${shortSlug}`;
  records.push({ ...priorHold, record_id: `record-${slug}`, document_id: `research-doc-${slug}`, signal_id: `signal-${slug}`, document_number: documentNumber++, record_status: "In Review",
    action_key: incrementKey(priorHold.action_key), parent_hold_key: priorHold.action_key, evidence_stage: "Threshold, witness, gossip, trusted-time, verifier-diversity, and compromise-recovery hold",
    title: `${label} remains In Review after threshold trust and compromise-recovery execution`,
    finding: "One hundred forty-four fixture-only cases pass, but no actual threshold share, witness signature, checkpoint, gossip message, time receipt, verifier run, compromise event, recovery action, algorithm migration, target packet, or evidence event exists.",
    denominator: "One inherited hold, twenty-five threshold cases, twenty-four witness cases, twenty-two gossip cases, twenty-three trusted-time cases, twenty-four verifier cases, twenty-six compromise-recovery cases, and zero actual workflow or evidence events.",
    evidence_limits: ["Synthetic threshold shares, witness signatures, checkpoints, gossip messages, time receipts, verifier results, compromise events, recovery actions, and migrations are not publication history or evidence.", "No fixture creates production quorum, witness, gossip, time, verifier, compromise, recovered state, trigger, publication, or closure.", "The inherited hold cannot close or publish automatically."],
    next_action: `Keep ${label} In Review until the exact target evidence satisfies its unchanged reopening contract.`, structured_registry_file: "phase-57v-threshold-witness-gossip-compromise-harness-results.json", publication_date: capturedDate, authority_boundary: authorityBoundary, meta });
}
if (records.length !== 63 || documentNumber !== 1333) throw new Error("Phase 57V document numbering must span 1270 through 1332.");
const published = records.filter((record) => record.record_status === "Published");
const held = records.filter((record) => record.record_status === "In Review");
const carriedSources = [...new Set(published.flatMap((record) => record.supporting_source_ids))];
if (published.length !== 54 || held.length !== 9 || carriedSources.length !== 36) throw new Error("Phase 57V requires 54 Published controls, 9 holds, and 36 carried Tier 1 sources.");

const registries = [
  ["phase-57v-threshold-release-authorizations.json", { registry_type: "M-of-N threshold release authorization with actor and domain separation", schema_count: 9, case_count: 225, valid_or_preservation_routes: 63, rejected_routes: 162, actual_threshold_shares: 0, schemas: harness.thresholdSchemas, case_distribution: harness.distributions.threshold, cases: harness.thresholdCases }],
  ["phase-57v-independent-witness-checkpoints.json", { registry_type: "Independent witness checkpoints and append-only checkpoint lineage", schema_count: 9, case_count: 216, valid_or_preservation_routes: 63, rejected_routes: 153, actual_witness_signatures_or_checkpoints: 0, schemas: harness.witnessSchemas, case_distribution: harness.distributions.witness, cases: harness.witnessCases }],
  ["phase-57v-cross-log-gossip.json", { registry_type: "Cross-log gossip and split-view detection without majority substitution", schema_count: 9, case_count: 198, valid_or_preservation_routes: 54, rejected_routes: 144, actual_gossip_messages: 0, schemas: harness.gossipSchemas, case_distribution: harness.distributions.gossip, cases: harness.gossipCases }],
  ["phase-57v-trusted-time-receipts.json", { registry_type: "Monotonic trusted-time and anti-rollback receipts", schema_count: 9, case_count: 207, valid_or_preservation_routes: 54, rejected_routes: 153, actual_time_receipts: 0, schemas: harness.trustedTimeSchemas, case_distribution: harness.distributions.trusted_time, cases: harness.trustedTimeCases }],
  ["phase-57v-verifier-diversity-conformance.json", { registry_type: "Three-implementation verifier-diversity and reproducible conformance", schema_count: 9, case_count: 216, valid_or_preservation_routes: 63, rejected_routes: 153, actual_verifier_runs: 0, schemas: harness.verifierSchemas, case_distribution: harness.distributions.verifier, cases: harness.verifierCases }],
  ["phase-57v-compromise-recovery.json", { registry_type: "Algorithm and key-compromise containment, migration, and inactive recovery", schema_count: 9, case_count: 234, valid_or_preservation_routes: 63, rejected_routes: 171, actual_compromise_events_or_recovery_actions: 0, actual_algorithm_migrations: 0, schemas: harness.compromiseRecoverySchemas, case_distribution: harness.distributions.compromise_recovery, cases: harness.compromiseRecoveryCases }],
];
for (const [file, data] of registries) await writeJson(join(dataRoot, file), { phase: "57V", captured_date: capturedDate, passed_case_count: data.case_count, failed_case_count: 0, fixture_only: true, ...data });
await writeJson(join(dataRoot, "phase-57v-threshold-witness-gossip-compromise-harness-results.json"), { phase: "57V", captured_date: capturedDate, total_case_count: 1296, passed_case_count: 1296, failed_case_count: 0,
  threshold_case_count: 225, witness_case_count: 216, gossip_case_count: 198, trusted_time_case_count: 207, verifier_case_count: 216, compromise_recovery_case_count: 234,
  valid_or_preservation_routes: 360, rejected_routes: 936, test_ids: harness.allCases.map((row) => row.test_id), actual_threshold_shares: 0, actual_witness_signatures: 0, actual_checkpoints: 0,
  actual_gossip_messages: 0, actual_time_receipts: 0, actual_verifier_runs: 0, actual_compromise_events: 0, actual_recovery_actions: 0, actual_algorithm_migrations: 0, actual_reader_state_changes: 0, evidence_records_created: 0,
  reopening_triggers_fired: 0, automated_closures_or_publications: 0, prior_artifact_rewrites: 0 });

const mainLedger = { phase: "57V", captured_date: capturedDate,
  goal: "Require independently governed threshold authorization, witnessed checkpoints, cross-log gossip, monotonic trusted time, verifier diversity, and bounded compromise recovery while every split view, rollback, verifier divergence, or retroactive-trust attempt fails closed.",
  publication_rule: "Publish fifty-four contract-specific threshold, witness, gossip, trusted-time, verifier-diversity, and compromise-recovery controls; retain all nine inherited outcome records In Review.", authority_rule: authorityBoundary,
  records_reviewed: 63, records_published: 54, records_held: 9, evidence_stage_counts: Object.fromEntries([...controlTypes.map((control) => [control.stage, 9]), ["Threshold, witness, gossip, trusted-time, verifier-diversity, and compromise-recovery hold", 9]]),
  new_official_source_profiles: 0, carried_official_source_profiles: 36, structured_rails: 6, threshold_schemas: 9, witness_schemas: 9, gossip_schemas: 9, trusted_time_schemas: 9, verifier_schemas: 9, compromise_recovery_schemas: 9, total_contract_specific_schemas: 54,
  threshold_cases: 225, witness_cases: 216, gossip_cases: 198, trusted_time_cases: 207, verifier_cases: 216, compromise_recovery_cases: 234,
  valid_threshold_routes: 63, rejected_threshold_routes: 162, valid_witness_routes: 63, rejected_witness_routes: 153, valid_gossip_routes: 54, rejected_gossip_routes: 144,
  valid_trusted_time_routes: 54, rejected_trusted_time_routes: 153, valid_verifier_routes: 63, rejected_verifier_routes: 153, valid_compromise_recovery_routes: 63, rejected_compromise_recovery_routes: 171,
  total_workflow_cases: 1296, valid_or_preservation_routes: 360, rejected_routes: 936, workflow_test_failures: 0,
  actual_threshold_shares: 0, actual_witness_signatures: 0, actual_checkpoints: 0, actual_gossip_messages: 0, actual_time_receipts: 0, actual_verifier_runs: 0, actual_compromise_events: 0, actual_recovery_actions: 0, actual_algorithm_migrations: 0,
  actual_reader_state_changes: 0, eligible_records_accepted: 0, exact_target_artifacts_acquired: 0, exact_target_trigger_events: 0, public_agency_contacts_or_foia_requests: 0,
  directive_scope_changes: 0, implementation_changes: 0, capability_changes: 0, closure_changes: 0, attribution_changes: 0, operating_outcome_changes: 0, inherited_entity_ledger_closure_changes: 0,
  prior_visible_scope: { sources: 715, signals: 1154, published: 903, in_review: 251, research_collections: 56, research_documents: 1270, briefings: 59, updates: 75, research_export_records: 1094 },
  post_batch_visible_scope: { sources: 715, signals: 1217, published: 957, in_review: 260, research_collections: 57, research_documents: 1333, briefings: 60, updates: 76, research_export_records: 1149 },
  post_batch_closure_counts: { Closed: 1, "Partially Closed": 21, Open: 2 }, preserved_phase57u_holds: held57u.map((record) => record.action_key), reopening_contract_ids: held57u.map((record) => record.reopening_contract_id), new_visible_holds: [],
  records: records.map(({ meta, ...record }) => record) };
await writeJson(join(dataRoot, "phase-57v-threshold-witness-gossip-time-verifiers-compromise-recovery.json"), mainLedger);
await writeJson(join(dataRoot, "phase-57v-publication-review.json"), { phase: "57V", captured_date: capturedDate, promoted_document_ids: published.map((record) => record.document_id), promoted_signal_ids: published.map((record) => record.signal_id),
  held_document_ids: held.map((record) => record.document_id), held_signal_ids: held.map((record) => record.signal_id), inherited_hold_lineage: held.map((record) => ({ action_key: record.action_key, parent_hold_key: record.parent_hold_key, reopening_contract_id: record.reopening_contract_id })),
  threshold_schemas_created: 9, witness_schemas_created: 9, gossip_schemas_created: 9, trusted_time_schemas_created: 9, verifier_schemas_created: 9, compromise_recovery_schemas_created: 9,
  total_workflow_cases_executed: 1296, actual_threshold_shares: 0, actual_witness_signatures: 0, actual_checkpoints: 0, actual_gossip_messages: 0, actual_time_receipts: 0, actual_verifier_runs: 0, actual_compromise_events: 0, actual_recovery_actions: 0, actual_algorithm_migrations: 0, actual_reader_state_changes: 0,
  decision: "Fifty-four threshold, witness, gossip, trusted-time, verifier-diversity, and compromise-recovery controls publish. All nine inherited holds remain In Review; every case is synthetic and no production share, witness signature, checkpoint, gossip message, time receipt, verifier run, compromise event, recovery action, migration, reader-state, evidence, trigger, publication, or closure event is recorded." });

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
${yamlList("dependencies", ["complete Phase 57U governed key, transparency, origin, incident, and recovery-objective controls", "three-of-five threshold release policy", "independent witness checkpoint threshold", "cross-log gossip split-view detection", "monotonic trusted-time receipt chain", "three-implementation verifier conformance", "clean algorithm and key-compromise recovery"])}
${yamlList("constraints", ["Data Quality", "Regulation", "Public Trust"])}
${yamlList("receiving_systems", ["Phase 57V threshold trust, witness federation, gossip, trusted time, verifier diversity, and compromise-recovery controls"])}
${yamlList("local_implications", ["Do not convert a synthetic threshold share, witness signature, checkpoint, gossip message, time receipt, verifier result, compromise event, recovery action, or migration into evidence, eligibility, implementation, capability, closure, attribution, or operating outcomes."])}
${yamlList("evidence_gap_ids", record.meta.gaps)}
claim_scope: "Specific Source Update"
local_evidence_level: "General Source Layer"
last_reviewed_date: ${capturedDate}
editorial_notes: ${JSON.stringify(record.record_status === "Published" ? "Published under the Phase 57V threshold-trust and fail-closed compromise-recovery contract." : `Held under ${record.reopening_contract_id}; no actual Phase 57V threshold, witness, gossip, time, verifier, compromise, recovery, or migration event exists.`)}
---

## Phase 57V threshold trust and compromise-recovery control

${record.finding}

## Evidence stage and denominator

**${record.evidence_stage}.** ${record.denominator}

Structured registry: ${record.structured_registry_file}.
${record.reopening_contract_id ? `\nReopening contract: ${record.reopening_contract_id}. Trigger state: **not fired**.\n` : ""}
## Evidence boundaries

${record.evidence_limits.map((limit) => `- ${limit}`).join("\n")}

Actual production threshold shares, witness signatures, checkpoints, gossip messages, time receipts, verifier runs, compromise events, recovery actions, algorithm migrations, reader-state changes, triggers, publications, and closures: **Zero**. FTFN submitted no agency contact or FOIA request.

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
    why_it_matters: "The record makes release quorum, witness independence, split-view detection, temporal ordering, verifier reproducibility, and compromise recovery independently auditable without creating an editorial event or changing evidence state.",
    ftfn_relevance: ["Requires three-of-five release authorization without same-actor or same-domain quorum.", "Federates independently witnessed checkpoints through cross-log gossip and trusted time.", "Requires three independent verifier implementations and clean compromise recovery without retroactive trust."],
    evidence_limits: ["Not publicly acquired does not mean nonexistent, withheld, or never submitted.", "FTFN public-source research is not agency contact or a submitted FOIA request.", ...record.evidence_limits, "The inherited 1 Closed / 21 Partially Closed / 2 Open entity ledger remains unchanged.", "No record supports a ranking, composite score, readiness score, generalized savings claim, or unsupported causal inference."],
    primary_topics: record.meta.topics, framework_layers: record.meta.layers, constraint_tags: ["Data Quality", "Regulation", "Public Trust"], source_id: record.source_id, supporting_source_ids: record.supporting_source_ids,
    supporting_official_urls: [record.official_url], official_url: record.official_url, local_capture_path: `/downloads/${collectionSlug}/official-links/${String(index + 1).padStart(2, "0")}-phase57v-record.txt`,
    archive_member: `official-links/${String(index + 1).padStart(2, "0")}-phase57v-record.txt`, capture_status: "Official link record", captured_date: capturedDate });
}

await writeJson(join(contentRoot, "research-collections", `${collectionSlug}.json`), { id: collectionId, title: "Threshold Authorization, Witness Federation, Trusted Time, Verifier Diversity, and Compromise Recovery, 2026", slug: collectionSlug, record_status: "Published",
  summary: "Phase 57V executes 1,296 synthetic threshold, witness, gossip, trusted-time, verifier-diversity, and compromise-recovery cases across nine contracts while preserving every inherited hold and failing every split view, rollback, divergence, or retroactive-trust attempt closed.",
  scope: "Nine schemas on each of six federated-trust and recovery rails, 1,296 cases, fifty-four Published controls, nine preserved holds, thirty-six carried Tier 1 sources, and zero actual threshold-share, witness, checkpoint, gossip, time, verifier, compromise, recovery, migration, or reader-state events.",
  captured_date: capturedDate, document_ids: records.map((record) => record.document_id), download_path: `/downloads/${collectionSlug}.zip`,
  download_note: "The sixty-six-file archive contains sixty-three official-link records, consolidated summaries, a README, and a checksum manifest.",
  method_note: "Every threshold share, witness signature, checkpoint, gossip message, time receipt, verifier result, compromise event, recovery action, and migration is synthetic. Insufficient or conflicted quorum, unwitnessed checkpoints, split views, time rollback, verifier divergence, and retroactive compromised-key trust fail closed; reconstructed state never activates automatically." });

const briefing = `---
id: ${JSON.stringify(briefingId)}
title: "Research Watch 052: Threshold Trust and Compromise Recovery"
slug: ${JSON.stringify(briefingSlug)}
record_status: "Published"
summary: "Phase 57V passes 1,296 synthetic threshold, witness, gossip, trusted-time, verifier-diversity, and compromise-recovery cases while preserving all nine holds and keeping every production trust, recovery, trigger, and evidence-event count at zero."
published_date: ${capturedDate}
captured_date: ${capturedDate}
${yamlList("signal_ids", records.map((record) => record.signal_id))}
${yamlList("evidence_gap_ids", ["gap-008", "gap-015", "gap-016"])}
claim_scope: "Editorial Synthesis"
local_evidence_level: "General Source Layer"
last_reviewed_date: ${capturedDate}
${yamlList("top_takeaways", ["Nine three-of-five policies reject same-actor and same-domain quorum construction.", "Nine independently witnessed checkpoint systems require distinct operators and infrastructure domains.", "Cross-log gossip and monotonic trusted time fail split views and rollback attempts closed.", "Three verifier implementations must reproduce one integrity-only result; compromise recovery never retroactively trusts artifacts signed by the compromised key."])}
${yamlList("constraint_watch", ["Data Quality", "Regulation", "Public Trust"])}
${yamlList("what_to_watch_next", ["One production M-of-N policy operated by distinct actors and authority domains", "Independent witness services publishing checkpoint signatures on separate infrastructure", "Cross-log gossip and trusted-time receipts that expose split views or rollback", "Reproducible conformance across three production verifier implementations and one clean compromise-recovery exercise"])}
---

## What Phase 57V proves

Release integrity can be federated through actor- and domain-separated threshold authorization, independently witnessed checkpoints, cross-log gossip, monotonic trusted time, verifier diversity, and compromise recovery that forbids retroactive trust.

## What did not move

No synthetic threshold share, witness signature, checkpoint, gossip message, time receipt, verifier result, compromise event, recovery action, or algorithm migration is an actual editorial or infrastructure event. No reader state activates, no trigger or hold closes, and every inherited hold remains In Review.

## Evidence boundary

The entity ledger remains one Closed, twenty-one Partially Closed, and two Open. Phase 57V records no agency contact, FOIA request, directive-scope change, implementation change, capability change, closure change, attribution change, or operating-outcome change.
`;
await writeFile(join(contentRoot, "briefings", `${briefingSlug}.mdx`), briefing, "utf8");
await writeJson(join(contentRoot, "updates", "2026-08-10-phase-57v-threshold-witness-gossip-time-verifier-compromise-recovery.json"), { id: "update-2026-08-10-phase-57v-threshold-witness-gossip-time-verifier-compromise-recovery", effective_date: capturedDate, entry_type: "Research Collection",
  title: "Phase 57V federates release trust and rehearses clean compromise recovery", summary: "Thirty-six carried Tier 1 sources support fifty-four Published controls, nine preserved holds, fifty-four schemas, 1,296 executable cases, three-of-five authorization, independent witnesses, cross-log gossip, trusted time, verifier diversity, and clean compromise recovery.",
  affected_record_ids: [collectionId, briefingId, ...records.map((record) => record.signal_id)], related_paths: [`/research/${collectionSlug}/`, `/briefings/${briefingSlug}/`, ...records.map((record) => `/signals/${record.signal_id.replace(/^signal-/, "")}/`)],
  evidence_note: "Synthetic threshold shares, witness signatures, checkpoints, gossip messages, time receipts, verifier results, compromise events, recovery actions, and migrations remain separate from source evidence, reviewer identity, acceptance, implementation, capability, closure, attribution, and operating outcomes.",
  work_package: "docs/work-packages/phase-57v-threshold-authorization-witness-gossip-trusted-time-verifier-diversity-compromise-recovery.md" });

for (const file of ["finance-and-risk.json", "policy-and-standards.json", "mobility.json", "chips-and-compute.json", "energy.json"]) {
  const path = join(contentRoot, "topics", file); const topic = JSON.parse(await readFile(path, "utf8"));
  topic.watch_questions = appendUnique(topic.watch_questions, ["Which real Phase 57V release first combines actor-separated threshold authorization, independent witnesses, cross-log gossip, monotonic trusted time, three verifier implementations, and compromise recovery without retroactive trust or automatic publication?"]);
  await writeJson(path, topic);
}
for (const file of ["policy-standards-to-implementation.json", "cross-corridor-authorization-to-operation.json", "energy-grid-capacity-to-service.json"]) {
  const path = join(contentRoot, "reader-pathways", file); const pathway = JSON.parse(await readFile(path, "utf8"));
  pathway.research_collection_ids = appendUnique(pathway.research_collection_ids, [collectionId]);
  pathway.dependency_stack = [...pathway.dependency_stack.filter((item) => item.stage !== "Phase 57V threshold trust, witness federation, trusted time, verifier diversity, and compromise recovery"), { stage: "Phase 57V threshold trust, witness federation, trusted time, verifier diversity, and compromise recovery",
    current_state: "Nine schemas on each of six rails pass 1,296 cases; zero production shares, witness signatures, checkpoints, gossip messages, time receipts, verifier runs, compromise events, recovery actions, migrations, reader-state changes, triggers, publications, or closures are recorded.",
    boundary: "Threshold authorization, witnesses, gossip, trusted time, verifier agreement, and compromise recovery are integrity controls, not evidence, acceptance, implementation, capability, closure, attribution, or operating outcomes." }];
  await writeJson(path, pathway);
}
const mapPath = join(contentRoot, "dependency-maps", "comparative-outcomes-require-common-denominators.json");
const map = JSON.parse(await readFile(mapPath, "utf8"));
map.nodes = [...map.nodes.filter((node) => node.id !== "node-phase57v-threshold-federation-compromise-recovery"), { id: "node-phase57v-threshold-federation-compromise-recovery", label: "Nine threshold trust federations; witnessed gossip and trusted time; three verifiers; clean compromise recovery; zero actual events", node_type: "Signal", note: "Conflicted quorum, unwitnessed checkpoints, split views, rollback, verifier divergence, or retroactive compromised-key trust fail closed while reconstructed state remains inactive." }];
map.links = [...map.links.filter((link) => link.from !== "node-phase57v-threshold-federation-compromise-recovery"),
  { from: "node-phase57v-threshold-federation-compromise-recovery", to: "node-phase57u-governed-trust-recovery", relationship: "Depends On", confidence: "Supported", note: "Phase 57V federates the governed keys, append-only transparency, exact-origin integrity, containment, and inactive recovery state established by Phase 57U." },
  { from: "node-phase57v-threshold-federation-compromise-recovery", to: "node-denominator-break", relationship: "Constrained By", confidence: "Partial", note: "Federated cryptographic integrity cannot cure an incompatible identity, definition, unit, method, denominator, period, privacy, authority, or acceptance boundary." },
  { from: "node-phase57v-threshold-federation-compromise-recovery", to: "node-causal-hold", relationship: "Limited By", confidence: "Missing Evidence", note: "Quorum, witnesses, gossip, trusted time, verifier agreement, and recovery do not establish implementation, capability, closure, operating outcomes, attribution, or causation." }];
await writeJson(mapPath, map);

console.log(`Generated Phase 57V: ${records.length} records (${published.length} Published, ${held.length} In Review), 54 schemas, 1,296 cases, 36 carried Tier 1 sources, Research Watch 052, one collection, one update, and integration across five topics, three pathways, and one dependency map.`);
