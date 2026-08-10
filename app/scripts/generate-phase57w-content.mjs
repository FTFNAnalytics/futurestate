
import { mkdir, readFile, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { runPhase57wHarness } from "./phase57w-ceremony-availability-fork-provenance-reissuance-harness.mjs";

const appRoot = fileURLToPath(new URL("..", import.meta.url));
const contentRoot = join(appRoot, "src", "content");
const dataRoot = join(appRoot, "src", "data");
const capturedDate = "2026-08-10";
const collectionSlug = "quorum-ceremonies-witness-availability-fork-accountability-time-failover-build-provenance-reissuance-2026";
const collectionId = `research-collection-${collectionSlug}`;
const briefingSlug = "research-watch-053-quorum-operations-and-post-compromise-reissuance";
const briefingId = `briefing-${briefingSlug}`;
const json = (value) => `${JSON.stringify(value, null, 2)}\n`;
const writeJson = async (path, value) => writeFile(path, json(value), "utf8");
const yamlList = (name, items) => [name + ":", ...items.map((item) => `  - ${JSON.stringify(item)}`)].join("\n");
const appendUnique = (items, additions) => [...new Set([...(items ?? []), ...additions])];

for (const name of ["research-documents", "signals", "research-collections", "briefings", "updates"]) await mkdir(join(contentRoot, name), { recursive: true });

const phase57v = JSON.parse(await readFile(join(dataRoot, "phase-57v-threshold-witness-gossip-time-verifiers-compromise-recovery.json"), "utf8"));
const threshold57v = JSON.parse(await readFile(join(dataRoot, "phase-57v-threshold-release-authorizations.json"), "utf8"));
const witness57v = JSON.parse(await readFile(join(dataRoot, "phase-57v-independent-witness-checkpoints.json"), "utf8"));
const gossip57v = JSON.parse(await readFile(join(dataRoot, "phase-57v-cross-log-gossip.json"), "utf8"));
const time57v = JSON.parse(await readFile(join(dataRoot, "phase-57v-trusted-time-receipts.json"), "utf8"));
const verifier57v = JSON.parse(await readFile(join(dataRoot, "phase-57v-verifier-diversity-conformance.json"), "utf8"));
const recovery57v = JSON.parse(await readFile(join(dataRoot, "phase-57v-compromise-recovery.json"), "utf8"));
if (phase57v.phase !== "57V" || phase57v.records.length !== 63) throw new Error("Phase 57W requires the complete Phase 57V baseline.");
const harness = runPhase57wHarness({ thresholdSchemas: threshold57v.schemas, witnessSchemas: witness57v.schemas, gossipSchemas: gossip57v.schemas, trustedTimeSchemas: time57v.schemas, verifierSchemas: verifier57v.schemas, compromiseRecoverySchemas: recovery57v.schemas });
if (harness.ceremonyCases.length !== 252 || harness.availabilityCases.length !== 234 || harness.forkEvidenceCases.length !== 216 || harness.timeFailoverCases.length !== 225 || harness.buildProvenanceCases.length !== 243 || harness.artifactReissuanceCases.length !== 261 || harness.allCases.length !== 1431 || harness.failures.length) {
  throw new Error("Phase 57W requires 1,431 passing ceremony, availability, fork-evidence, time-failover, build-provenance, and re-issuance cases.");
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
const held57v = phase57v.records.filter((record) => record.record_status === "In Review");
const published57v = phase57v.records.filter((record) => record.record_status === "Published");
if (held57v.length !== 9 || published57v.length !== 54) throw new Error("Phase 57W must inherit fifty-four controls and exactly nine holds.");
const incrementKey = (key) => key.replace(/-(\d{2})$/, (_, value) => `-${String(Number(value) + 1).padStart(2, "0")}`);

const controlTypes = [
  { suffix: "quorum-ceremony-member-lifecycle-receipts", action: "QUORUM-CEREMONY-MEMBER-LIFECYCLE", stage: "Quorum ceremony and member-lifecycle receipt controls",
    title: (label) => label + " receives governed quorum ceremonies and member lifecycle",
    finding: "Append-only receipts govern member admission, suspension, replacement, and emergency ceremonies under a fixed three-of-five threshold with actor and authority-domain separation; emergency procedures cannot lower the threshold or publish automatically.",
    denominator: "One ceremony schema, twenty-eight adversarial cases, eight bounded valid routes, twenty explicit rejections, and zero production ceremonies or membership events.",
    limits: ["Every ceremony and membership event is synthetic and confers no production authority.", "Unquorate, duplicated, unauthorized, unreasoned, untimed, replayed, rewritten, threshold-lowering, publishing, closing, or evidence-inflating fixtures reject.", "Member lifecycle receipts prove governance procedure only; they do not establish evidence, acceptance, implementation, closure, attribution, or outcomes."],
    next: (label) => "Operate " + label + " member changes only through a fixed-threshold, actor-separated, domain-separated, append-only ceremony.", registry: "phase-57w-quorum-ceremony-member-lifecycle.json" },
  { suffix: "witness-availability-staleness-catchup-proofs", action: "WITNESS-AVAILABILITY-CATCHUP", stage: "Witness availability, staleness, and catch-up proof controls",
    title: (label) => label + " receives bounded witness staleness and append-only catch-up",
    finding: "Availability receipts enforce a 900-second staleness budget, exclude stale witnesses from quorum, and require complete append-only consistency proofs across every missed checkpoint before a witness may rejoin.",
    denominator: "One availability schema, twenty-six adversarial cases, seven bounded valid routes, nineteen explicit rejections, and zero production availability observations or catch-up proofs.",
    limits: ["Availability observations and catch-up proofs are synthetic and do not claim production uptime.", "Stale counting, partial gaps, regressive sequences, invalid consistency, unverified rejoin, rewriting, majority substitution, publication, closure, or evidence inflation reject.", "Witness availability is an integrity precondition, not source evidence or operating performance."],
    next: (label) => "Exclude stale " + label + " witnesses until a complete append-only catch-up proof closes every missed checkpoint gap.", registry: "phase-57w-witness-availability-catchup-proofs.json" },
  { suffix: "attributable-fork-evidence-receipts", action: "ATTRIBUTABLE-FORK-EVIDENCE", stage: "Attributable fork-evidence and quarantine controls",
    title: (label) => label + " receives attributable fork evidence without automatic blame",
    finding: "Conflicting checkpoints are preserved and independently observed, technically attributed to a log key and endpoint, and quarantined; the receipt never assigns human blame, publishes, closes a hold, or creates source evidence automatically.",
    denominator: "One fork-evidence schema, twenty-four adversarial cases, six bounded valid routes, eighteen explicit rejections, and zero production fork events or attributions.",
    limits: ["Fork observations and attribution receipts are synthetic and report no operational misconduct.", "Missing conflict, observer independence, key or endpoint attribution, quarantine, preservation, or side-effect boundaries reject.", "Technical attribution identifies the presented signing surface only; it is not human blame, causation, adjudication, or publication authority."],
    next: (label) => "Quarantine any " + label + " fork, preserve both views, and route technical attribution to governed review without automatic blame.", registry: "phase-57w-attributable-fork-evidence.json" },
  { suffix: "federated-time-authority-failover", action: "FEDERATED-TIME-AUTHORITY-FAILOVER", stage: "Federated time-authority failover controls",
    title: (label) => label + " receives federated time-authority failover without rollback",
    finding: "A two-authority, two-domain failover receipt preserves sequence, counter, observation time, and prior-receipt lineage when the primary is unavailable; rollback, self-failover, majority substitution, and history rewrite fail closed.",
    denominator: "One time-failover schema, twenty-five adversarial cases, seven bounded valid routes, eighteen explicit rejections, and zero production time failovers.",
    limits: ["Time-authority attestations are synthetic and provide no production availability guarantee.", "Regressive, unquorate, dependent, unnecessary, unsigned, skewed, stale, rewritten, publishing, or evidence-inflating failovers reject.", "Failover orders integrity events only and cannot validate claim truth, acceptance, implementation, closure, or outcomes."],
    next: (label) => "Fail " + label + " time service over only with independent authority attestations and strictly monotonic lineage.", registry: "phase-57w-federated-time-authority-failover.json" },
  { suffix: "verifier-build-provenance-reproducible-attestations", action: "VERIFIER-BUILD-PROVENANCE", stage: "Verifier build-provenance and reproducible-build controls",
    title: (label) => label + " receives three-verifier reproducible build provenance",
    finding: "Three independent verifier codebases, operators, and builders bind one source commit, build recipe, SBOM, and artifact digest through reproducible-build attestations; divergence and majority substitution fail closed.",
    denominator: "One build-provenance schema, twenty-seven adversarial cases, eight bounded valid routes, nineteen explicit rejections, and zero production builds or attestations.",
    limits: ["Build and SBOM attestations are synthetic and certify no production software.", "Missing bindings, insufficient diversity, shared builders, nonreproducibility, divergence, replay, rewriting, publication, or evidence inflation reject.", "Build reproducibility establishes artifact provenance only; it cannot accept claims or activate reader state."],
    next: (label) => "Require three independently built " + label + " verifiers to reproduce one commit, recipe, SBOM, and artifact digest.", registry: "phase-57w-verifier-build-provenance.json" },
  { suffix: "post-compromise-artifact-reissuance-reader-migration", action: "POST-COMPROMISE-REISSUANCE", stage: "Post-compromise artifact re-issuance and reader-migration controls",
    title: (label) => label + " receives lineage-preserving artifact re-issuance",
    finding: "A distinct artifact is re-issued only after threshold authorization, witness catch-up, federated time, reproducible build provenance, and independent re-verification; compromised lineage remains visible and inactive while reader migration remains unactivated.",
    denominator: "One re-issuance schema, twenty-nine adversarial cases, eight bounded preservation routes, twenty-one explicit rejections, and zero production re-issuances or reader migrations.",
    limits: ["Re-issuance and reader-migration receipts are synthetic and do not report a production compromise.", "Lineage loss, artifact reuse, rewrite, retroactive trust, missing authorization or proof, activation, publication, closure, attribution, or outcome claims reject.", "The compromised artifact remains preserved as compromised history; it is never rewritten or silently re-trusted."],
    next: (label) => "Re-issue " + label + " artifacts with an explicit compromised-lineage link and migrate readers only after separately governed activation.", registry: "phase-57w-post-compromise-reissuance.json" }
];

const records = [];
let documentNumber = 1333;
for (const priorHold of held57v) {
  const [shortSlug, label, prefix] = contracts[priorHold.reopening_contract_id] ?? [];
  const meta = agencyMeta[priorHold.agency];
  const sourceRecord = published57v.find((record) => record.action_key.startsWith(prefix));
  if (!shortSlug || !meta || !sourceRecord) throw new Error(`Incomplete Phase 57W metadata for ${priorHold.reopening_contract_id}`);
  for (const control of controlTypes) {
    const slug = `57w-${shortSlug}-${control.suffix}`;
    records.push({ record_id: `record-${slug}`, document_id: `research-doc-${slug}`, signal_id: `signal-${slug}`, document_number: documentNumber++, record_status: "Published", agency: priorHold.agency,
      action_key: `${prefix}-${control.action}-2026-01`, parent_hold_key: null, reopening_contract_id: null, evidence_stage: control.stage, title: control.title(label), finding: control.finding,
      denominator: control.denominator, evidence_limits: control.limits, next_action: control.next(label), structured_registry_file: control.registry, source_id: sourceRecord.source_id,
      supporting_source_ids: sourceRecord.supporting_source_ids, official_url: sourceRecord.official_url, publication_date: capturedDate, document_type: "Data Release", authority_boundary: authorityBoundary,
      meta: { ...meta, shortSlug, label, prefix } });
  }
}
for (const priorHold of held57v) {
  const [shortSlug, label, prefix] = contracts[priorHold.reopening_contract_id];
  const meta = { ...agencyMeta[priorHold.agency], shortSlug, label, prefix };
  const slug = `57w-preserved-${shortSlug}`;
  records.push({ ...priorHold, record_id: `record-${slug}`, document_id: `research-doc-${slug}`, signal_id: `signal-${slug}`, document_number: documentNumber++, record_status: "In Review",
    action_key: incrementKey(priorHold.action_key), parent_hold_key: priorHold.action_key, evidence_stage: "Ceremony, availability, fork-evidence, time-failover, build-provenance, and re-issuance hold",
    title: `${label} remains In Review after operational trust federation and lineage-preserving re-issuance execution`,
    finding: "One hundred fifty-nine fixture-only cases pass, but no actual ceremony, membership event, availability observation, catch-up proof, fork event, fork attribution, time failover, build attestation, re-issuance, reader migration, target packet, or evidence event exists.",
    denominator: "One inherited hold, twenty-eight ceremony cases, twenty-six availability cases, twenty-four fork-evidence cases, twenty-five time-failover cases, twenty-seven build-provenance cases, twenty-nine re-issuance cases, and zero actual workflow or evidence events.",
    evidence_limits: ["Synthetic ceremonies, membership events, availability observations, catch-up proofs, fork artifacts, time-failover receipts, build attestations, re-issuances, and reader migrations are not publication history or evidence.", "No fixture creates production quorum, witness, gossip, time, verifier, compromise, recovered state, trigger, publication, or closure.", "The inherited hold cannot close or publish automatically."],
    next_action: `Keep ${label} In Review until the exact target evidence satisfies its unchanged reopening contract.`, structured_registry_file: "phase-57w-ceremony-availability-fork-provenance-reissuance-harness-results.json", publication_date: capturedDate, authority_boundary: authorityBoundary, meta });
}
if (records.length !== 63 || documentNumber !== 1396) throw new Error("Phase 57W document numbering must span 1333 through 1395.");
const published = records.filter((record) => record.record_status === "Published");
const held = records.filter((record) => record.record_status === "In Review");
const carriedSources = [...new Set(published.flatMap((record) => record.supporting_source_ids))];
if (published.length !== 54 || held.length !== 9 || carriedSources.length !== 36) throw new Error("Phase 57W requires 54 Published controls, 9 holds, and 36 carried Tier 1 sources.");

const registries = [
  ["phase-57w-quorum-ceremony-member-lifecycle.json", { registry_type: "Governed quorum ceremonies and append-only member lifecycle", schema_count: 9, case_count: 252, valid_or_preservation_routes: 72, rejected_routes: 180, actual_ceremonies_or_membership_events: 0, schemas: harness.ceremonySchemas, case_distribution: harness.distributions.ceremony, cases: harness.ceremonyCases }],
  ["phase-57w-witness-availability-catchup-proofs.json", { registry_type: "Bounded witness availability, staleness exclusion, and append-only catch-up", schema_count: 9, case_count: 234, valid_or_preservation_routes: 63, rejected_routes: 171, actual_availability_observations_or_catchup_proofs: 0, schemas: harness.availabilitySchemas, case_distribution: harness.distributions.availability, cases: harness.availabilityCases }],
  ["phase-57w-attributable-fork-evidence.json", { registry_type: "Attributable fork evidence with preservation, quarantine, and no automatic blame", schema_count: 9, case_count: 216, valid_or_preservation_routes: 54, rejected_routes: 162, actual_fork_events_or_attributions: 0, schemas: harness.forkEvidenceSchemas, case_distribution: harness.distributions.fork_evidence, cases: harness.forkEvidenceCases }],
  ["phase-57w-federated-time-authority-failover.json", { registry_type: "Federated time-authority failover without rollback", schema_count: 9, case_count: 225, valid_or_preservation_routes: 63, rejected_routes: 162, actual_time_failovers: 0, schemas: harness.timeFailoverSchemas, case_distribution: harness.distributions.time_failover, cases: harness.timeFailoverCases }],
  ["phase-57w-verifier-build-provenance.json", { registry_type: "Three-verifier source, recipe, SBOM, builder, and reproducible-build provenance", schema_count: 9, case_count: 243, valid_or_preservation_routes: 72, rejected_routes: 171, actual_build_attestations: 0, schemas: harness.buildProvenanceSchemas, case_distribution: harness.distributions.build_provenance, cases: harness.buildProvenanceCases }],
  ["phase-57w-post-compromise-reissuance.json", { registry_type: "Lineage-preserving post-compromise artifact re-issuance and inactive reader migration", schema_count: 9, case_count: 261, valid_or_preservation_routes: 72, rejected_routes: 189, actual_reissuances_or_reader_migrations: 0, schemas: harness.artifactReissuanceSchemas, case_distribution: harness.distributions.artifact_reissuance, cases: harness.artifactReissuanceCases }]
];
for (const [filename, body] of registries) await writeJson(join(dataRoot, filename), { phase: "57W", captured_date: capturedDate, ...body, passed_case_count: body.case_count, failed_case_count: 0 });
await writeJson(join(dataRoot, "phase-57w-ceremony-availability-fork-provenance-reissuance-harness-results.json"), { phase: "57W", captured_date: capturedDate, total_case_count: harness.total_case_count, passed_case_count: harness.passed_case_count, failed_case_count: harness.failed_case_count, valid_or_preservation_routes: harness.valid_or_preservation_routes, rejected_routes: harness.rejected_routes, test_ids: harness.allCases.map((row) => row.test_id),
  actual_ceremonies: 0, actual_membership_events: 0, actual_availability_observations: 0, actual_catchup_proofs: 0, actual_fork_events: 0, actual_fork_attributions: 0, actual_time_failovers: 0, actual_build_attestations: 0, actual_reissuances: 0, actual_reader_migrations: 0, actual_reader_state_changes: 0, evidence_records_created: 0, reopening_triggers_fired: 0, automated_closures_or_publications: 0, prior_artifact_rewrites: 0 });

const mainLedger = { phase: "57W", captured_date: capturedDate,
  goal: "Govern quorum ceremonies and member lifecycle, bound witness staleness and catch-up, preserve attributable fork evidence without automatic blame, fail time authority over without rollback, bind three verifiers to reproducible build provenance, and re-issue post-compromise artifacts without rewriting lineage.",
  publication_rule: "Publish fifty-four contract-specific ceremony, availability, fork-evidence, time-failover, build-provenance, and re-issuance controls; retain all nine inherited outcome records In Review.", authority_rule: authorityBoundary,
  records_reviewed: 63, records_published: 54, records_held: 9, evidence_stage_counts: Object.fromEntries([...controlTypes.map((control) => [control.stage, 9]), ["Ceremony, availability, fork-evidence, time-failover, build-provenance, and re-issuance hold", 9]]),
  new_official_source_profiles: 0, carried_official_source_profiles: 36, structured_rails: 6, ceremony_schemas: 9, availability_schemas: 9, fork_evidence_schemas: 9, time_failover_schemas: 9, build_provenance_schemas: 9, artifact_reissuance_schemas: 9, total_contract_specific_schemas: 54,
  ceremony_cases: 252, availability_cases: 234, fork_evidence_cases: 216, time_failover_cases: 225, build_provenance_cases: 243, artifact_reissuance_cases: 261,
  valid_ceremony_routes: 72, rejected_ceremony_routes: 180, valid_availability_routes: 63, rejected_availability_routes: 171, valid_fork_evidence_routes: 54, rejected_fork_evidence_routes: 162,
  valid_time_failover_routes: 63, rejected_time_failover_routes: 162, valid_build_provenance_routes: 72, rejected_build_provenance_routes: 171, valid_artifact_reissuance_routes: 72, rejected_artifact_reissuance_routes: 189,
  total_workflow_cases: 1431, valid_or_preservation_routes: 396, rejected_routes: 1035, workflow_test_failures: 0,
  actual_ceremonies: 0, actual_membership_events: 0, actual_availability_observations: 0, actual_catchup_proofs: 0, actual_fork_events: 0, actual_fork_attributions: 0, actual_time_failovers: 0, actual_build_attestations: 0, actual_reissuances: 0, actual_reader_migrations: 0,
  actual_reader_state_changes: 0, eligible_records_accepted: 0, exact_target_artifacts_acquired: 0, exact_target_trigger_events: 0, public_agency_contacts_or_foia_requests: 0,
  directive_scope_changes: 0, implementation_changes: 0, capability_changes: 0, closure_changes: 0, attribution_changes: 0, operating_outcome_changes: 0, inherited_entity_ledger_closure_changes: 0,
  prior_visible_scope: { sources: 715, signals: 1217, published: 957, in_review: 260, research_collections: 57, research_documents: 1333, briefings: 60, updates: 76, research_export_records: 1149 },
  post_batch_visible_scope: { sources: 715, signals: 1280, published: 1011, in_review: 269, research_collections: 58, research_documents: 1396, briefings: 61, updates: 77, research_export_records: 1204 },
  post_batch_closure_counts: { Closed: 1, "Partially Closed": 21, Open: 2 }, preserved_phase57v_holds: held57v.map((record) => record.action_key), reopening_contract_ids: held57v.map((record) => record.reopening_contract_id), new_visible_holds: [],
  records: records.map(({ meta, ...record }) => record) };
await writeJson(join(dataRoot, "phase-57w-quorum-ceremonies-witness-availability-fork-time-build-reissuance.json"), mainLedger);
await writeJson(join(dataRoot, "phase-57w-publication-review.json"), { phase: "57W", captured_date: capturedDate, promoted_document_ids: published.map((record) => record.document_id), promoted_signal_ids: published.map((record) => record.signal_id),
  held_document_ids: held.map((record) => record.document_id), held_signal_ids: held.map((record) => record.signal_id), inherited_hold_lineage: held.map((record) => ({ action_key: record.action_key, parent_hold_key: record.parent_hold_key, reopening_contract_id: record.reopening_contract_id })),
  ceremony_schemas_created: 9, availability_schemas_created: 9, fork_evidence_schemas_created: 9, time_failover_schemas_created: 9, build_provenance_schemas_created: 9, artifact_reissuance_schemas_created: 9,
  total_workflow_cases_executed: 1431, actual_ceremonies: 0, actual_membership_events: 0, actual_availability_observations: 0, actual_catchup_proofs: 0, actual_fork_events: 0, actual_fork_attributions: 0, actual_time_failovers: 0, actual_build_attestations: 0, actual_reissuances: 0, actual_reader_migrations: 0, actual_reader_state_changes: 0,
  decision: "Fifty-four ceremony, witness-availability, fork-evidence, time-failover, build-provenance, and re-issuance controls publish. All nine inherited holds remain In Review; every case is synthetic and no production ceremony, membership, availability, catch-up, fork, attribution, failover, build, re-issuance, migration, evidence, trigger, publication, or closure event is recorded." });

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
${yamlList("dependencies", ["complete Phase 57V threshold, witness, gossip, trusted-time, verifier-diversity, and compromise-recovery controls", "fixed-threshold quorum ceremony lineage", "bounded witness staleness and append-only catch-up", "attributable fork quarantine without automatic blame", "monotonic federated time-authority failover", "three-verifier build provenance with SBOM", "lineage-preserving post-compromise re-issuance"])}
${yamlList("constraints", ["Data Quality", "Regulation", "Public Trust"])}
${yamlList("receiving_systems", ["Phase 57W quorum operations, witness availability, fork accountability, time failover, build provenance, and re-issuance controls"])}
${yamlList("local_implications", ["Do not convert a synthetic ceremony, membership event, availability observation, catch-up proof, fork artifact, time failover, build attestation, re-issuance, or reader migration into evidence, eligibility, implementation, capability, closure, attribution, or operating outcomes."])}
${yamlList("evidence_gap_ids", record.meta.gaps)}
claim_scope: "Specific Source Update"
local_evidence_level: "General Source Layer"
last_reviewed_date: ${capturedDate}
editorial_notes: ${JSON.stringify(record.record_status === "Published" ? "Published under the Phase 57W operational-federation and lineage-preserving re-issuance contract." : `Held under ${record.reopening_contract_id}; no actual Phase 57W ceremony, membership, availability, catch-up, fork, time-failover, build, re-issuance, or reader-migration event exists.`)}
---

## Phase 57W operational trust federation and lineage-preserving re-issuance control

${record.finding}

## Evidence stage and denominator

**${record.evidence_stage}.** ${record.denominator}

Structured registry: ${record.structured_registry_file}.
${record.reopening_contract_id ? `\nReopening contract: ${record.reopening_contract_id}. Trigger state: **not fired**.\n` : ""}
## Evidence boundaries

${record.evidence_limits.map((limit) => `- ${limit}`).join("\n")}

Actual production ceremonies, membership events, availability observations, catch-up proofs, fork events, fork attributions, time failovers, build attestations, re-issuances, reader migrations, reader-state changes, triggers, publications, and closures: **Zero**. FTFN submitted no agency contact or FOIA request.

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
    why_it_matters: "The record makes quorum lifecycle, witness availability, fork handling, time failover, build provenance, and post-compromise re-issuance independently auditable without creating an editorial event or changing evidence state.",
    ftfn_relevance: ["Keeps member lifecycle and emergency ceremonies at the fixed three-of-five threshold.", "Excludes stale witnesses until append-only catch-up and quarantines attributable forks without automatic blame.", "Binds three reproducible verifier builds and preserves compromised lineage through inactive re-issuance migration."],
    evidence_limits: ["Not publicly acquired does not mean nonexistent, withheld, or never submitted.", "FTFN public-source research is not agency contact or a submitted FOIA request.", ...record.evidence_limits, "The inherited 1 Closed / 21 Partially Closed / 2 Open entity ledger remains unchanged.", "No record supports a ranking, composite score, readiness score, generalized savings claim, or unsupported causal inference."],
    primary_topics: record.meta.topics, framework_layers: record.meta.layers, constraint_tags: ["Data Quality", "Regulation", "Public Trust"], source_id: record.source_id, supporting_source_ids: record.supporting_source_ids,
    supporting_official_urls: [record.official_url], official_url: record.official_url, local_capture_path: `/downloads/${collectionSlug}/official-links/${String(index + 1).padStart(2, "0")}-phase57w-record.txt`,
    archive_member: `official-links/${String(index + 1).padStart(2, "0")}-phase57w-record.txt`, capture_status: "Official link record", captured_date: capturedDate });
}

await writeJson(join(contentRoot, "research-collections", `${collectionSlug}.json`), { id: collectionId, title: "Quorum Operations, Witness Availability, Fork Accountability, Time Failover, Build Provenance, and Re-Issuance, 2026", slug: collectionSlug, record_status: "Published",
  summary: "Phase 57W executes 1,431 synthetic ceremony, availability, fork-evidence, time-failover, build-provenance, and artifact re-issuance cases across nine contracts while preserving every inherited hold and failing every threshold-lowering, stale-witness, automatic-blame, rollback, divergent-build, rewrite, or retroactive-trust attempt closed.",
  scope: "Nine schemas on each of six operational-federation and re-issuance rails, 1,431 cases, fifty-four Published controls, nine preserved holds, thirty-six carried Tier 1 sources, and zero actual ceremony, membership, availability, catch-up, fork, attribution, failover, build, re-issuance, migration, or reader-state events.",
  captured_date: capturedDate, document_ids: records.map((record) => record.document_id), download_path: `/downloads/${collectionSlug}.zip`,
  download_note: "The sixty-six-file archive contains sixty-three official-link records, consolidated summaries, a README, and a checksum manifest.",
  method_note: "Every ceremony, membership event, availability observation, catch-up proof, fork artifact, time-failover receipt, build attestation, re-issuance, and reader migration is synthetic. Threshold lowering, stale-witness counting, incomplete catch-up, automatic blame, rollback, build divergence, lineage rewrite, and retroactive trust fail closed; reconstructed state never activates automatically." });

const briefing = `---
id: ${JSON.stringify(briefingId)}
title: "Research Watch 053: Quorum Operations and Post-Compromise Re-Issuance"
slug: ${JSON.stringify(briefingSlug)}
record_status: "Published"
summary: "Phase 57W passes 1,431 synthetic ceremony, availability, fork-evidence, time-failover, build-provenance, and re-issuance cases while preserving all nine holds and keeping every production trust, migration, trigger, and evidence-event count at zero."
published_date: ${capturedDate}
captured_date: ${capturedDate}
${yamlList("signal_ids", records.map((record) => record.signal_id))}
${yamlList("evidence_gap_ids", ["gap-008", "gap-015", "gap-016"])}
claim_scope: "Editorial Synthesis"
local_evidence_level: "General Source Layer"
last_reviewed_date: ${capturedDate}
${yamlList("top_takeaways", ["Nine member-lifecycle systems require append-only, actor-separated, domain-separated three-of-five ceremonies without an emergency threshold reduction.", "Stale witnesses are excluded until complete append-only catch-up; attributable forks remain quarantined without automatic human blame.", "Federated time failover preserves monotonic lineage and rejects rollback or self-failover.", "Three independent verifier builds bind source, recipe, SBOM, and artifact digests; re-issuance preserves compromised lineage and keeps reader migration inactive."])}
${yamlList("constraint_watch", ["Data Quality", "Regulation", "Public Trust"])}
${yamlList("what_to_watch_next", ["One production fixed-threshold member admission, suspension, replacement, or emergency ceremony", "Witness availability receipts and append-only catch-up proofs across independently operated services", "A governed fork quarantine with technical attribution separated from human adjudication", "Reproducible build attestations from three verifiers and one lineage-preserving post-compromise re-issuance exercise"])}
---

## What Phase 57W proves

Release integrity can remain governed through fixed-threshold member lifecycle, bounded witness catch-up, attributable fork quarantine, monotonic time failover, three reproducible verifier builds, and artifact re-issuance that preserves compromised lineage.

## What did not move

No synthetic ceremony, membership event, availability observation, catch-up proof, fork artifact, time failover, build attestation, re-issuance, or reader migration is an actual editorial or infrastructure event. No reader state activates, no trigger or hold closes, and every inherited hold remains In Review.

## Evidence boundary

The entity ledger remains one Closed, twenty-one Partially Closed, and two Open. Phase 57W records no agency contact, FOIA request, directive-scope change, implementation change, capability change, closure change, attribution change, or operating-outcome change.
`;
await writeFile(join(contentRoot, "briefings", `${briefingSlug}.mdx`), briefing, "utf8");
await writeJson(join(contentRoot, "updates", "2026-08-10-phase-57w-ceremony-availability-fork-time-build-reissuance.json"), { id: "update-2026-08-10-phase-57w-ceremony-availability-fork-time-build-reissuance", effective_date: capturedDate, entry_type: "Research Collection",
  title: "Phase 57W operationalizes quorum continuity and lineage-preserving re-issuance", summary: "Thirty-six carried Tier 1 sources support fifty-four Published controls, nine preserved holds, fifty-four schemas, 1,431 executable cases, fixed-threshold ceremonies, bounded witness catch-up, attributable fork quarantine, time failover, reproducible build provenance, and lineage-preserving re-issuance.",
  affected_record_ids: [collectionId, briefingId, ...records.map((record) => record.signal_id)], related_paths: [`/research/${collectionSlug}/`, `/briefings/${briefingSlug}/`, ...records.map((record) => `/signals/${record.signal_id.replace(/^signal-/, "")}/`)],
  evidence_note: "Synthetic ceremonies, membership events, availability observations, catch-up proofs, fork artifacts, time-failover receipts, build attestations, re-issuances, and reader migrations remain separate from source evidence, reviewer identity, acceptance, implementation, capability, closure, attribution, and operating outcomes.",
  work_package: "docs/work-packages/phase-57w-quorum-ceremonies-witness-availability-fork-time-build-reissuance.md" });

for (const file of ["finance-and-risk.json", "policy-and-standards.json", "mobility.json", "chips-and-compute.json", "energy.json"]) {
  const path = join(contentRoot, "topics", file); const topic = JSON.parse(await readFile(path, "utf8"));
  topic.watch_questions = appendUnique(topic.watch_questions, ["Which real Phase 57W release first operates governed quorum lifecycle, bounded witness catch-up, attributable fork quarantine, monotonic time failover, three reproducible verifier builds, and lineage-preserving re-issuance without automatic blame or publication?"]);
  await writeJson(path, topic);
}
for (const file of ["policy-standards-to-implementation.json", "cross-corridor-authorization-to-operation.json", "energy-grid-capacity-to-service.json"]) {
  const path = join(contentRoot, "reader-pathways", file); const pathway = JSON.parse(await readFile(path, "utf8"));
  pathway.research_collection_ids = appendUnique(pathway.research_collection_ids, [collectionId]);
  pathway.dependency_stack = [...pathway.dependency_stack.filter((item) => item.stage !== "Phase 57W quorum operations, witness availability, fork accountability, time failover, build provenance, and re-issuance"), { stage: "Phase 57W quorum operations, witness availability, fork accountability, time failover, build provenance, and re-issuance",
    current_state: "Nine schemas on each of six rails pass 1,431 cases; zero production ceremonies, membership events, availability observations, catch-up proofs, fork events, fork attributions, time failovers, build attestations, re-issuances, reader migrations, triggers, publications, or closures are recorded.",
    boundary: "Ceremonies, witness availability, fork attribution, time failover, build provenance, and re-issuance are integrity controls, not evidence, human blame, acceptance, implementation, capability, closure, causal attribution, or operating outcomes." }];
  await writeJson(path, pathway);
}
const mapPath = join(contentRoot, "dependency-maps", "comparative-outcomes-require-common-denominators.json");
const map = JSON.parse(await readFile(mapPath, "utf8"));
map.nodes = [...map.nodes.filter((node) => node.id !== "node-phase57w-operational-federation-reissuance"), { id: "node-phase57w-operational-federation-reissuance", label: "Nine operational trust federations; governed ceremonies, witness catch-up, fork quarantine, time failover, reproducible builds, and lineage-preserving re-issuance", node_type: "Signal", note: "Threshold lowering, stale-witness counting, incomplete catch-up, automatic blame, rollback, divergent provenance, lineage rewrite, or retroactive trust fail closed while reader migration remains inactive." }];
map.links = [...map.links.filter((link) => link.from !== "node-phase57w-operational-federation-reissuance"),
  { from: "node-phase57w-operational-federation-reissuance", to: "node-phase57v-threshold-federation-compromise-recovery", relationship: "Depends On", confidence: "Supported", note: "Phase 57W operationalizes the threshold authorization, witnessed transparency, cross-log gossip, trusted time, verifier diversity, and compromise-recovery state established by Phase 57V." },
  { from: "node-phase57w-operational-federation-reissuance", to: "node-denominator-break", relationship: "Constrained By", confidence: "Partial", note: "Federated cryptographic integrity cannot cure an incompatible identity, definition, unit, method, denominator, period, privacy, authority, or acceptance boundary." },
  { from: "node-phase57w-operational-federation-reissuance", to: "node-causal-hold", relationship: "Limited By", confidence: "Missing Evidence", note: "Quorum, witnesses, gossip, trusted time, verifier agreement, and recovery do not establish implementation, capability, closure, operating outcomes, attribution, or causation." }];
await writeJson(mapPath, map);

console.log(`Generated Phase 57W: ${records.length} records (${published.length} Published, ${held.length} In Review), 54 schemas, 1,431 cases, 36 carried Tier 1 sources, Research Watch 053, one collection, one update, and integration across five topics, three pathways, and one dependency map.`);



