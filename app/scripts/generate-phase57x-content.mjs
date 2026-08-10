import { mkdir, readFile, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { runPhase57xHarness } from "./phase57x-health-diversity-adjudication-patch-decommission-harness.mjs";

const appRoot = fileURLToPath(new URL("..", import.meta.url));
const contentRoot = join(appRoot, "src", "content");
const dataRoot = join(appRoot, "src", "data");
const capturedDate = "2026-08-10";
const collectionSlug = "federation-health-witness-diversity-fork-adjudication-time-corroboration-patch-provenance-legacy-decommissioning-2026";
const collectionId = `research-collection-${collectionSlug}`;
const briefingSlug = "research-watch-054-federation-health-and-reversible-decommissioning";
const briefingId = `briefing-${briefingSlug}`;
const json = (value) => `${JSON.stringify(value, null, 2)}\n`;
const writeJson = async (path, value) => writeFile(path, json(value), "utf8");
const yamlList = (name, items) => [name + ":", ...items.map((item) => `  - ${JSON.stringify(item)}`)].join("\n");
const appendUnique = (items, additions) => [...new Set([...(items ?? []), ...additions])];

for (const name of ["research-documents", "signals", "research-collections", "briefings", "updates"]) await mkdir(join(contentRoot, name), { recursive: true });

const readData = async (name) => JSON.parse(await readFile(join(dataRoot, name), "utf8"));
const phase57w = await readData("phase-57w-quorum-ceremonies-witness-availability-fork-time-build-reissuance.json");
const [ceremony, availability, fork, time, build, reissuance] = await Promise.all([
  "phase-57w-quorum-ceremony-member-lifecycle.json",
  "phase-57w-witness-availability-catchup-proofs.json",
  "phase-57w-attributable-fork-evidence.json",
  "phase-57w-federated-time-authority-failover.json",
  "phase-57w-verifier-build-provenance.json",
  "phase-57w-post-compromise-reissuance.json"
].map(readData));
if (phase57w.phase !== "57W" || phase57w.records.length !== 63) throw new Error("Phase 57X requires the complete Phase 57W baseline.");
const harness = runPhase57xHarness({ ceremonySchemas: ceremony.schemas, availabilitySchemas: availability.schemas, forkEvidenceSchemas: fork.schemas, timeFailoverSchemas: time.schemas, buildProvenanceSchemas: build.schemas, artifactReissuanceSchemas: reissuance.schemas });
if (harness.allCases.length !== 1593 || harness.failures.length) throw new Error("Phase 57X requires 1,593 passing cases.");

const authorityBoundary = "Agency assertions, regulator evidence, FTFN controls, evidence-review identity, publication-review identity, release identity, publication identity, signing identity, key-custody identity, quorum-member identity, witness identity, fork-observer identity, adjudicator identity, appeal identity, time-authority identity, verifier identity, vulnerability identity, patch identity, decommissioning identity, recovery identity, GAO acceptance, implementation, capability, closure, entity evidence, schema, period, unit, denominator, revision history, privacy boundary, attribution, and operating outcomes remain separate evidence states.";
const agencyMeta = {
  DOT: { publisher: "National Railroad Passenger Corporation", topics: ["Mobility", "Policy and Standards", "Finance and Risk"], layers: ["Enabling Infrastructure", "Human Systems"], gaps: ["gap-015", "gap-016"] },
  NTIA: { publisher: "National Telecommunications and Information Administration", topics: ["Chips and Compute", "Policy and Standards", "Finance and Risk"], layers: ["Enabling Infrastructure", "Human Systems"], gaps: ["gap-016"] },
  DOE: { publisher: "U.S. Department of Energy", topics: ["Energy", "Policy and Standards", "Finance and Risk"], layers: ["Enabling Infrastructure", "Resource Foundations"], gaps: ["gap-008", "gap-016"] }
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
  "REOPEN-NNSA-GAO-BASELINE": ["nnsa-gao-baseline", "NNSA GAO enterprise baseline", "NNSA-GAO"]
};

const held57w = phase57w.records.filter((record) => record.record_status === "In Review");
const published57w = phase57w.records.filter((record) => record.record_status === "Published");
if (held57w.length !== 9 || published57w.length !== 54) throw new Error("Phase 57X must inherit fifty-four controls and nine holds.");
const incrementKey = (key) => key.replace(/-(\d{2})$/, (_, value) => `-${String(Number(value) + 1).padStart(2, "0")}`);

const controlTypes = [
  {
    suffix: "federation-health-budgets-partition-policy", action: "FEDERATION-HEALTH-PARTITION-POLICY", stage: "Federation health-budget and partition-policy controls", registry: "phase-57x-federation-health-budgets-partition-policy.json",
    title: (label) => `${label} receives measurable federation health budgets and fail-closed partition policy`,
    finding: "Append-only one-hour health receipts measure quorum and witness availability, exclude stale members, declare partitions, and preserve the fixed three-of-five integrity threshold even when service enters a degraded or unavailable state.",
    denominator: "One health schema, thirty adversarial cases, eight bounded valid routes, twenty-two explicit rejections, and zero production health events or partitions.",
    limits: ["Every health observation and partition is synthetic and makes no production availability claim.", "Threshold lowering, stale-witness counting, unbounded automation, history rewrite, publication, closure, blame, and evidence inflation reject.", "A missed health budget may reduce availability; it never reduces integrity requirements or becomes operating-outcome evidence."],
    next: (label) => `Measure ${label} quorum and witness health in append-only windows and fail partitions closed without changing the three-of-five threshold.`
  },
  {
    suffix: "independent-witness-diversity-audits", action: "WITNESS-DIVERSITY-AUDIT", stage: "Independent witness-diversity audit controls", registry: "phase-57x-independent-witness-diversity-audits.json",
    title: (label) => `${label} receives independent four-dimension witness-diversity audits`,
    finding: "Independent audits require at least three witnesses separated across ownership, codebase, infrastructure, and jurisdiction, with append-only inventory lineage and an auditor outside every witnessed ownership domain.",
    denominator: "One diversity schema, twenty-eight adversarial cases, seven bounded valid routes, twenty-one explicit rejections, and zero production diversity audits.",
    limits: ["All witness inventories and audits are synthetic and establish no production independence claim.", "Missing, shared, stale, unsigned, self-audited, conflicted, replayed, rewritten, publication, closure, evidence-inflation, and readiness-score fixtures reject.", "Diversity is audited dimension by dimension; a numerical composite or matching majority cannot substitute for a failed dimension."],
    next: (label) => `Audit ${label} witness ownership, codebase, infrastructure, and jurisdiction independently before counting the federation as diverse.`
  },
  {
    suffix: "fork-adjudication-appeal-receipts", action: "FORK-ADJUDICATION-APPEAL", stage: "Fork adjudication and appeal receipt controls", registry: "phase-57x-fork-adjudication-appeal-receipts.json",
    title: (label) => `${label} receives independent fork adjudication and appeal receipts`,
    finding: "A three-actor, three-domain panel adjudicates preserved technical fork evidence with reason-coded receipts, an open appeal window, a distinct appeal panel, and uninterrupted quarantine; neither technical attribution nor adjudication automatically assigns human blame.",
    denominator: "One adjudication schema, thirty adversarial cases, eight bounded valid routes, twenty-two explicit rejections, and zero production adjudications or appeals.",
    limits: ["Fork adjudications and appeals are synthetic and report no real misconduct or responsibility.", "Evidence rewrite, self-review, conflicted panels, missing reasons, backdating, early quarantine release, automatic blame, publication, closure, causation, and outcomes reject.", "Technical attribution, human adjudication, appeal, editorial review, and public accusation remain separate decisions."],
    next: (label) => `Route any ${label} fork from preserved technical evidence to an independent adjudication panel and a distinct appeal panel while quarantine remains active.`
  },
  {
    suffix: "cross-authority-time-corroboration", action: "CROSS-AUTHORITY-TIME-CORROBORATION", stage: "Cross-authority time-corroboration controls", registry: "phase-57x-cross-authority-time-corroboration.json",
    title: (label) => `${label} receives three-domain time corroboration without imported rollback`,
    finding: "Append-only comparisons require three independent time authorities, bound skew, preserve monotonic sequence and counters, and quarantine disagreement; no external majority may import an earlier time, counter, or receipt state.",
    denominator: "One time-corroboration schema, twenty-seven adversarial cases, seven bounded valid routes, twenty explicit rejections, and zero production time comparisons.",
    limits: ["Time comparisons are synthetic and offer no production clock-accuracy guarantee.", "Insufficient, dependent, unsigned, skewed, regressive, rollback-importing, disagreement-ignoring, rewritten, publishing, accepting, closing, causal, or outcome fixtures reject.", "Corroborated time orders integrity events; it does not establish the truth or acceptance of a claim."],
    next: (label) => `Corroborate ${label} integrity time across three independent domains and quarantine any comparison that would import rollback or excess skew.`
  },
  {
    suffix: "verifier-vulnerability-disclosure-patch-provenance", action: "VERIFIER-VULNERABILITY-PATCH-PROVENANCE", stage: "Verifier vulnerability-disclosure and patch-provenance controls", registry: "phase-57x-verifier-vulnerability-patch-provenance.json",
    title: (label) => `${label} receives lineage-preserving vulnerability disclosure and patch provenance`,
    finding: "Advisories bind the affected verifier build, preserved vulnerable lineage, patch commit, build recipe, SBOM, distinct patched artifact, and reproduction by three independent verifier codebases and operators while rollout remains inactive pending separate authorization.",
    denominator: "One patch-provenance schema, thirty adversarial cases, eight bounded valid routes, twenty-two explicit rejections, and zero production advisories or patches.",
    limits: ["Advisories, vulnerable builds, patched builds, and attestations are synthetic and disclose no production vulnerability.", "Missing lineage, rewritten or re-trusted vulnerable builds, shared verifiers, nonreproducible patches, reused artifacts, divergence, backdating, automatic rollout, publication, closure, and evidence inflation reject.", "Patch provenance establishes software lineage only; it does not prove claim quality or authorize deployment."],
    next: (label) => `Bind any ${label} advisory to its vulnerable build and require a distinct, three-verifier reproduced patch before a separately governed rollout.`
  },
  {
    suffix: "legacy-artifact-decommission-reader-rollback-notification", action: "LEGACY-DECOMMISSION-ROLLBACK-NOTIFICATION", stage: "Legacy-artifact decommissioning, reader rollback, and notification controls", registry: "phase-57x-legacy-artifact-decommissioning-reader-rollback-notification.json",
    title: (label) => `${label} receives reversible, notified legacy-artifact decommissioning`,
    finding: "Legacy artifacts are frozen rather than deleted, replacements are independently verified, readers receive complete notification and a bounded grace period, rollback targets and append-only receipts remain available, and post-decommission state is independently rechecked.",
    denominator: "One decommissioning schema, thirty-two adversarial cases, eight bounded preservation routes, twenty-four explicit rejections, and zero production decommissionings, rollbacks, or notifications.",
    limits: ["Every decommissioning, reader receipt, notification, rollback, and drill is synthetic and changes no production reader state.", "Deletion, rewrite, forced migration, missing notice or grace, disabled rollback, backdating, irreversibility, publication, closure, causation, outcomes, and evidence inflation reject.", "Decommissioning preserves discoverable legacy lineage and never treats notification as reader acceptance."],
    next: (label) => `Decommission ${label} legacy artifacts only after verified replacement, complete notice, a bounded grace period, and preservation of a tested rollback target.`
  }
];

const records = [];
let documentNumber = 1396;
for (const priorHold of held57w) {
  const [shortSlug, label, prefix] = contracts[priorHold.reopening_contract_id] ?? [];
  const meta = agencyMeta[priorHold.agency];
  const sourceRecord = published57w.find((record) => record.action_key.startsWith(prefix));
  if (!shortSlug || !meta || !sourceRecord) throw new Error(`Incomplete Phase 57X metadata for ${priorHold.reopening_contract_id}`);
  for (const control of controlTypes) {
    const slug = `57x-${shortSlug}-${control.suffix}`;
    records.push({
      record_id: `record-${slug}`, document_id: `research-doc-${slug}`, signal_id: `signal-${slug}`, document_number: documentNumber++, record_status: "Published", agency: priorHold.agency,
      action_key: `${prefix}-${control.action}-2026-01`, parent_hold_key: null, reopening_contract_id: null, evidence_stage: control.stage, title: control.title(label), finding: control.finding,
      denominator: control.denominator, evidence_limits: control.limits, next_action: control.next(label), structured_registry_file: control.registry, source_id: sourceRecord.source_id,
      supporting_source_ids: sourceRecord.supporting_source_ids, official_url: sourceRecord.official_url, publication_date: capturedDate, document_type: "Technical Report", authority_boundary: authorityBoundary,
      meta: { ...meta, shortSlug, label, prefix }
    });
  }
}
for (const priorHold of held57w) {
  const [shortSlug, label, prefix] = contracts[priorHold.reopening_contract_id];
  const meta = { ...agencyMeta[priorHold.agency], shortSlug, label, prefix };
  const slug = `57x-preserved-${shortSlug}`;
  records.push({
    ...priorHold, record_id: `record-${slug}`, document_id: `research-doc-${slug}`, signal_id: `signal-${slug}`, document_number: documentNumber++, record_status: "In Review",
    action_key: incrementKey(priorHold.action_key), parent_hold_key: priorHold.action_key, evidence_stage: "Federation-health, diversity-audit, fork-adjudication, time-corroboration, patch-provenance, and decommissioning hold",
    title: `${label} remains In Review after federation-health and reversible-decommissioning execution`,
    finding: "One hundred seventy-seven fixture-only cases pass, but no actual health event, partition, diversity audit, adjudication, appeal, time comparison, advisory, patch, decommissioning, rollback, notification, target packet, or evidence event exists.",
    denominator: "One inherited hold, thirty health cases, twenty-eight diversity cases, thirty adjudication cases, twenty-seven time-corroboration cases, thirty patch-provenance cases, thirty-two decommissioning cases, and zero actual workflow or evidence events.",
    evidence_limits: ["Synthetic health events, partitions, audits, adjudications, appeals, comparisons, advisories, patches, decommissionings, rollbacks, and notifications are not publication history or evidence.", "No fixture assigns human blame, changes reader state, creates production authority, or fires the unchanged reopening trigger.", "The inherited hold cannot close or publish automatically."],
    next_action: `Keep ${label} In Review until the exact target evidence satisfies its unchanged reopening contract.`, structured_registry_file: "phase-57x-health-diversity-adjudication-patch-decommission-harness-results.json", publication_date: capturedDate, authority_boundary: authorityBoundary, meta
  });
}
if (records.length !== 63 || documentNumber !== 1459) throw new Error("Phase 57X document numbering must span 1396 through 1458.");
const published = records.filter((record) => record.record_status === "Published");
const held = records.filter((record) => record.record_status === "In Review");
const carriedSources = [...new Set(published.flatMap((record) => record.supporting_source_ids))];
if (published.length !== 54 || held.length !== 9 || carriedSources.length !== 36) throw new Error("Phase 57X requires 54 Published controls, 9 holds, and 36 carried Tier 1 sources.");

const registrySpecs = [
  ["phase-57x-federation-health-budgets-partition-policy.json", "Federation health budgets and fail-closed partition policy", harness.healthSchemas, harness.healthCases, harness.distributions.health, "actual_health_events_or_partitions"],
  ["phase-57x-independent-witness-diversity-audits.json", "Independent witness diversity across ownership, codebase, infrastructure, and jurisdiction", harness.diversitySchemas, harness.diversityCases, harness.distributions.diversity, "actual_diversity_audits"],
  ["phase-57x-fork-adjudication-appeal-receipts.json", "Fork adjudication and independent appeal with preserved technical evidence", harness.adjudicationSchemas, harness.adjudicationCases, harness.distributions.adjudication, "actual_adjudications_or_appeals"],
  ["phase-57x-cross-authority-time-corroboration.json", "Cross-authority time corroboration without imported rollback", harness.timeCorroborationSchemas, harness.timeCorroborationCases, harness.distributions.time_corroboration, "actual_time_comparisons"],
  ["phase-57x-verifier-vulnerability-patch-provenance.json", "Verifier vulnerability disclosure and reproducible patch provenance", harness.patchProvenanceSchemas, harness.patchProvenanceCases, harness.distributions.patch_provenance, "actual_advisories_or_patches"],
  ["phase-57x-legacy-artifact-decommissioning-reader-rollback-notification.json", "Reversible legacy-artifact decommissioning with reader rollback and notification", harness.decommissionSchemas, harness.decommissionCases, harness.distributions.decommissioning, "actual_decommissionings_rollbacks_or_notifications"]
];
for (const [name, registryType, schemas, cases, distribution, actualField] of registrySpecs) await writeJson(join(dataRoot, name), {
  phase: "57X", captured_date: capturedDate, registry_type: registryType, ...distribution, passed_case_count: cases.length, failed_case_count: 0, [actualField]: 0, schemas, cases
});
await writeJson(join(dataRoot, "phase-57x-health-diversity-adjudication-patch-decommission-harness-results.json"), {
  phase: "57X", captured_date: capturedDate, total_case_count: harness.total_case_count, passed_case_count: harness.passed_case_count, failed_case_count: harness.failed_case_count,
  valid_or_preservation_routes: harness.valid_or_preservation_routes, rejected_routes: harness.rejected_routes,
  actual_health_events: 0, actual_partitions: 0, actual_diversity_audits: 0, actual_adjudications: 0, actual_appeals: 0, actual_time_comparisons: 0, actual_vulnerability_advisories: 0, actual_patches: 0, actual_decommissionings: 0, actual_reader_rollbacks: 0, actual_notifications: 0, actual_reader_state_changes: 0, evidence_records_created: 0, reopening_triggers_fired: 0, automated_closures_or_publications: 0, human_blame_assignments: 0, history_rewrites: 0,
  distributions: harness.distributions, test_ids: harness.allCases.map((row) => row.test_id)
});

const mainLedger = {
  phase: "57X", captured_date: capturedDate, status: "complete and locally release-validated", objective: "Make federation health, diversity, adjudication, time corroboration, patching, and legacy decommissioning measurable, appealable, lineage-preserving, reversible, and non-publishing across all nine reopening contracts.",
  records_reviewed: 63, records_added_published: 54, records_held_in_review: 9, publication_counts: { Published: 54, "In Review": 9 },
  control_type_counts: Object.fromEntries([...controlTypes.map((control) => [control.stage, 9]), ["Federation-health, diversity-audit, adjudication, time-corroboration, patch-provenance, and decommissioning hold", 9]]),
  new_official_source_profiles: 0, carried_official_source_profiles: 36, structured_rails: 6, health_schemas: 9, diversity_schemas: 9, adjudication_schemas: 9, time_corroboration_schemas: 9, patch_provenance_schemas: 9, decommissioning_schemas: 9, total_contract_specific_schemas: 54,
  health_cases: 270, diversity_cases: 252, adjudication_cases: 270, time_corroboration_cases: 243, patch_provenance_cases: 270, decommissioning_cases: 288,
  valid_health_routes: 72, rejected_health_routes: 198, valid_diversity_routes: 63, rejected_diversity_routes: 189, valid_adjudication_routes: 72, rejected_adjudication_routes: 198, valid_time_corroboration_routes: 63, rejected_time_corroboration_routes: 180, valid_patch_provenance_routes: 72, rejected_patch_provenance_routes: 198, valid_decommissioning_routes: 72, rejected_decommissioning_routes: 216,
  total_workflow_cases: 1593, valid_or_preservation_routes: 414, rejected_routes: 1179, workflow_test_failures: 0,
  actual_health_events: 0, actual_partitions: 0, actual_diversity_audits: 0, actual_adjudications: 0, actual_appeals: 0, actual_time_comparisons: 0, actual_vulnerability_advisories: 0, actual_patches: 0, actual_decommissionings: 0, actual_reader_rollbacks: 0, actual_notifications: 0, actual_reader_state_changes: 0,
  eligible_records_accepted: 0, exact_target_artifacts_acquired: 0, exact_target_trigger_events: 0, public_agency_contacts_or_foia_requests: 0, directive_scope_changes: 0, implementation_changes: 0, capability_changes: 0, closure_changes: 0, attribution_changes: 0, operating_outcome_changes: 0, inherited_entity_ledger_closure_changes: 0,
  prior_visible_scope: { sources: 715, signals: 1280, published: 1011, in_review: 269, research_collections: 58, research_documents: 1396, briefings: 61, updates: 77, research_export_records: 1204 },
  post_batch_visible_scope: { sources: 715, signals: 1343, published: 1065, in_review: 278, research_collections: 59, research_documents: 1459, briefings: 62, updates: 78, research_export_records: 1259 },
  post_batch_closure_counts: { Closed: 1, "Partially Closed": 21, Open: 2 }, preserved_phase57w_holds: held57w.map((record) => record.action_key), reopening_contract_ids: held57w.map((record) => record.reopening_contract_id), new_visible_holds: [], records: records.map(({ meta, ...record }) => record)
};
await writeJson(join(dataRoot, "phase-57x-federation-health-diversity-adjudication-time-patch-decommissioning.json"), mainLedger);
await writeJson(join(dataRoot, "phase-57x-publication-review.json"), {
  phase: "57X", captured_date: capturedDate, promoted_document_ids: published.map((record) => record.document_id), promoted_signal_ids: published.map((record) => record.signal_id), held_document_ids: held.map((record) => record.document_id), held_signal_ids: held.map((record) => record.signal_id),
  inherited_hold_lineage: held.map((record) => ({ action_key: record.action_key, parent_hold_key: record.parent_hold_key, reopening_contract_id: record.reopening_contract_id })), health_schemas_created: 9, diversity_schemas_created: 9, adjudication_schemas_created: 9, time_corroboration_schemas_created: 9, patch_provenance_schemas_created: 9, decommissioning_schemas_created: 9, total_workflow_cases_executed: 1593,
  actual_health_events: 0, actual_partitions: 0, actual_diversity_audits: 0, actual_adjudications: 0, actual_appeals: 0, actual_time_comparisons: 0, actual_vulnerability_advisories: 0, actual_patches: 0, actual_decommissionings: 0, actual_reader_rollbacks: 0, actual_notifications: 0, actual_reader_state_changes: 0,
  decision: "Fifty-four health, diversity, adjudication, time-corroboration, patch-provenance, and reversible-decommissioning controls publish. All nine inherited holds remain In Review; every case is synthetic and no production event, evidence change, blame assignment, trigger, publication, or closure is recorded."
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
${yamlList("dependencies", ["complete Phase 57W ceremony, availability, fork-evidence, time-failover, build-provenance, and re-issuance controls", "fixed-threshold federation-health budgets and fail-closed partition policy", "independent four-dimension witness-diversity audits", "fork adjudication separated from technical attribution and independent appeal", "three-authority time corroboration without imported rollback", "lineage-preserving vulnerability disclosure and patch provenance", "reversible notified legacy-artifact decommissioning"])}
${yamlList("constraints", ["Data Quality", "Regulation", "Public Trust"])}
${yamlList("receiving_systems", ["Phase 57X federation health, diversity, adjudication, time corroboration, patch provenance, and legacy decommissioning controls"])}
${yamlList("local_implications", ["Do not convert a synthetic health event, partition, audit, adjudication, appeal, time comparison, advisory, patch, decommissioning, rollback, notification, or drill into evidence, acceptance, implementation, capability, closure, blame, attribution, or operating outcomes."])}
${yamlList("evidence_gap_ids", record.meta.gaps)}
claim_scope: "Specific Source Update"
local_evidence_level: "General Source Layer"
last_reviewed_date: ${capturedDate}
editorial_notes: ${JSON.stringify(record.record_status === "Published" ? "Published under the Phase 57X federation-health and reversible-decommissioning contract." : `Held under ${record.reopening_contract_id}; no actual Phase 57X event or target evidence exists.`)}
---

## Phase 57X federation health and reversible-decommissioning control

${record.finding}

## Evidence stage and denominator

**${record.evidence_stage}.** ${record.denominator}

Structured registry: ${record.structured_registry_file}.
${record.reopening_contract_id ? `\nReopening contract: ${record.reopening_contract_id}. Trigger state: **not fired**.\n` : ""}
## Evidence boundaries

${record.evidence_limits.map((limit) => `- ${limit}`).join("\n")}

Actual production health events, partitions, diversity audits, adjudications, appeals, time comparisons, vulnerability advisories, patches, decommissionings, reader rollbacks, notifications, reader-state changes, triggers, publications, blame assignments, and closures: **Zero**. FTFN submitted no agency contact or FOIA request.

Next action: ${record.next_action}

## Authority boundary

${authorityBoundary}
`;

for (let index = 0; index < records.length; index += 1) {
  const record = records[index];
  const slug = record.signal_id.replace(/^signal-/, "");
  await writeFile(join(contentRoot, "signals", `${record.signal_id}.mdx`), signalMdx(record), "utf8");
  await writeJson(join(contentRoot, "research-documents", `${record.document_number}-${slug}.json`), {
    id: record.document_id, collection_id: collectionId, title: record.title, slug, record_status: record.record_status, publisher: record.meta.publisher, publication_date: capturedDate, document_type: record.document_type,
    summary: `${record.finding} Denominator: ${record.denominator}`, key_findings: [`Evidence stage: ${record.evidence_stage}.`, `Finding: ${record.finding}`, `Denominator: ${record.denominator}`, ...record.evidence_limits.map((limit) => `Boundary: ${limit}`), `Next action: ${record.next_action}`],
    why_it_matters: "The record makes federation health, witness diversity, adjudication, time corroboration, verifier patching, and legacy decommissioning independently auditable without creating an editorial event or changing evidence state.",
    ftfn_relevance: ["Keeps health and partition response measurable without lowering integrity thresholds.", "Separates witness diversity and technical fork evidence from adjudication, appeal, blame, and publication.", "Preserves vulnerable and legacy lineage through reproducible patching, notified decommissioning, and tested rollback."],
    evidence_limits: ["Not publicly acquired does not mean nonexistent, withheld, or never submitted.", "FTFN public-source research is not agency contact or a submitted FOIA request.", ...record.evidence_limits, "The inherited 1 Closed / 21 Partially Closed / 2 Open entity ledger remains unchanged.", "No record supports a ranking, composite score, readiness score, generalized savings claim, or unsupported causal inference."],
    primary_topics: record.meta.topics, framework_layers: record.meta.layers, constraint_tags: ["Data Quality", "Regulation", "Public Trust"], source_id: record.source_id, supporting_source_ids: record.supporting_source_ids, supporting_official_urls: [record.official_url], official_url: record.official_url,
    local_capture_path: `/downloads/${collectionSlug}/official-links/${String(index + 1).padStart(2, "0")}-phase57x-record.txt`, archive_member: `official-links/${String(index + 1).padStart(2, "0")}-phase57x-record.txt`, capture_status: "Official link record", captured_date: capturedDate
  });
}

await writeJson(join(contentRoot, "research-collections", `${collectionSlug}.json`), {
  id: collectionId, title: "Federation Health, Witness Diversity, Fork Adjudication, Time Corroboration, Patch Provenance, and Legacy Decommissioning, 2026", slug: collectionSlug, record_status: "Published",
  summary: "Phase 57X executes 1,593 synthetic federation-health, diversity-audit, fork-adjudication, time-corroboration, patch-provenance, and legacy-decommissioning cases across nine contracts while preserving every inherited hold and rejecting every threshold-lowering, diversity-substituting, automatic-blame, rollback-importing, vulnerable-lineage-rewriting, forced-migration, or irreversible-decommissioning attempt.",
  scope: "Nine schemas on each of six federation-operations rails, 1,593 cases, fifty-four Published controls, nine preserved holds, thirty-six carried Tier 1 sources, and zero actual health, partition, audit, adjudication, appeal, time-comparison, advisory, patch, decommissioning, rollback, notification, or reader-state events.",
  captured_date: capturedDate, document_ids: records.map((record) => record.document_id), download_path: `/downloads/${collectionSlug}.zip`, download_note: "The sixty-six-file archive contains sixty-three official-link records, consolidated summaries, a README, and a checksum manifest.",
  method_note: "Every health event, partition, audit, adjudication, appeal, time comparison, advisory, patch, decommissioning, rollback, notification, and drill is synthetic. Integrity thresholds never fall; technical evidence remains separate from blame; vulnerable and legacy lineage remains visible; reader state never changes automatically."
});

const briefing = `---
id: ${JSON.stringify(briefingId)}
title: "Research Watch 054: Federation Health and Reversible Decommissioning"
slug: ${JSON.stringify(briefingSlug)}
record_status: "Published"
summary: "Phase 57X passes 1,593 synthetic health, diversity, adjudication, time, patch, and decommissioning cases while preserving all nine holds and keeping every production, evidence, blame, reader-state, trigger, and publication count at zero."
published_date: ${capturedDate}
captured_date: ${capturedDate}
${yamlList("signal_ids", records.map((record) => record.signal_id))}
${yamlList("evidence_gap_ids", ["gap-008", "gap-015", "gap-016"])}
claim_scope: "Editorial Synthesis"
local_evidence_level: "General Source Layer"
last_reviewed_date: ${capturedDate}
${yamlList("top_takeaways", ["Federation health budgets measure quorum and witness availability without ever lowering the fixed integrity threshold.", "Witness diversity is audited independently across ownership, codebase, infrastructure, and jurisdiction.", "Fork evidence remains technical and quarantined while independent adjudication and appeal remain separate from human blame and publication.", "Time corroboration rejects imported rollback; patching preserves vulnerable lineage; legacy decommissioning preserves notice, grace, rollback, and independent verification."])}
${yamlList("constraint_watch", ["Data Quality", "Regulation", "Public Trust"])}
${yamlList("what_to_watch_next", ["Production health-window and partition receipts that preserve the fixed threshold", "Independent diversity audits across four dimensions", "A governed fork adjudication and separate appeal that preserve quarantine", "A disclosed verifier patch and a notified, reversible legacy-artifact decommissioning exercise"])}
---

## What Phase 57X proves

Federated trust can make availability, diversity, dispute resolution, time comparison, patching, and retirement operationally measurable without merging integrity control with evidence or publication authority.

## What did not move

No fixture is a production event. No reader state changes, no human blame is assigned, no trigger fires, and all nine inherited outcome holds remain In Review.

## Evidence boundary

The entity ledger remains one Closed, twenty-one Partially Closed, and two Open. Phase 57X records no agency contact, FOIA request, directive-scope change, implementation change, capability change, closure change, attribution change, or operating-outcome change.
`;
await writeFile(join(contentRoot, "briefings", `${briefingSlug}.mdx`), briefing, "utf8");
await writeJson(join(contentRoot, "updates", "2026-08-10-phase-57x-health-diversity-adjudication-time-patch-decommissioning.json"), {
  id: "update-2026-08-10-phase-57x-health-diversity-adjudication-time-patch-decommissioning", effective_date: capturedDate, entry_type: "Research Collection", title: "Phase 57X operationalizes federation health and reversible legacy decommissioning",
  summary: "Thirty-six carried Tier 1 sources support fifty-four Published controls, nine preserved holds, fifty-four schemas, 1,593 executable cases, fixed-threshold health budgets, four-dimension diversity audits, independent adjudication and appeal, time corroboration, patch provenance, and reversible notified decommissioning.",
  affected_record_ids: [collectionId, briefingId, ...records.map((record) => record.signal_id)], related_paths: [`/research/${collectionSlug}/`, `/briefings/${briefingSlug}/`, ...records.map((record) => `/signals/${record.signal_id.replace(/^signal-/, "")}/`)],
  evidence_note: "Synthetic health events, partitions, audits, adjudications, appeals, comparisons, advisories, patches, decommissionings, rollbacks, notifications, and drills remain separate from source evidence, reviewer identity, acceptance, implementation, capability, closure, blame, attribution, and operating outcomes.",
  work_package: "docs/work-packages/phase-57x-federation-health-diversity-adjudication-time-patch-decommissioning.md"
});

for (const file of ["finance-and-risk.json", "policy-and-standards.json", "mobility.json", "chips-and-compute.json", "energy.json"]) {
  const path = join(contentRoot, "topics", file);
  const topic = JSON.parse(await readFile(path, "utf8"));
  topic.watch_questions = appendUnique(topic.watch_questions, ["Which real Phase 57X release first reports fixed-threshold federation health, four-dimension witness diversity, independent fork adjudication and appeal, rollback-safe time corroboration, lineage-preserving patch provenance, and reversible notified decommissioning?"]);
  await writeJson(path, topic);
}
const stage = "Phase 57X federation health, diversity, adjudication, time corroboration, patch provenance, and reversible decommissioning";
for (const file of ["policy-standards-to-implementation.json", "cross-corridor-authorization-to-operation.json", "energy-grid-capacity-to-service.json"]) {
  const path = join(contentRoot, "reader-pathways", file);
  const pathway = JSON.parse(await readFile(path, "utf8"));
  pathway.research_collection_ids = appendUnique(pathway.research_collection_ids, [collectionId]);
  pathway.dependency_stack = [...pathway.dependency_stack.filter((item) => item.stage !== stage), { stage, current_state: "Nine schemas on each of six rails pass 1,593 cases; zero production health events, partitions, audits, adjudications, appeals, time comparisons, advisories, patches, decommissionings, rollbacks, notifications, reader-state changes, triggers, publications, blame assignments, or closures are recorded.", boundary: "Federation health, diversity, adjudication, time comparison, patching, and decommissioning are integrity controls, not evidence, human blame, acceptance, implementation, capability, closure, causal attribution, or operating outcomes." }];
  await writeJson(path, pathway);
}
const mapPath = join(contentRoot, "dependency-maps", "comparative-outcomes-require-common-denominators.json");
const map = JSON.parse(await readFile(mapPath, "utf8"));
map.nodes = [...map.nodes.filter((node) => node.id !== "node-phase57x-health-adjudication-decommissioning"), { id: "node-phase57x-health-adjudication-decommissioning", label: "Nine federation operations; fixed-threshold health, four-dimension diversity, independent adjudication and appeal, time corroboration, patch provenance, and reversible decommissioning", node_type: "Signal", note: "Threshold lowering, diversity substitution, automatic blame, imported rollback, vulnerable-lineage rewrite, forced migration, or irreversible decommissioning fail closed." }];
map.links = [...map.links.filter((link) => link.from !== "node-phase57x-health-adjudication-decommissioning"),
  { from: "node-phase57x-health-adjudication-decommissioning", to: "node-phase57w-operational-federation-reissuance", relationship: "Depends On", confidence: "Supported", note: "Phase 57X measures, disputes, patches, and retires the operational federation established by Phase 57W." },
  { from: "node-phase57x-health-adjudication-decommissioning", to: "node-denominator-break", relationship: "Constrained By", confidence: "Partial", note: "Operational trust controls cannot cure an incompatible identity, definition, unit, method, denominator, period, privacy, authority, or acceptance boundary." },
  { from: "node-phase57x-health-adjudication-decommissioning", to: "node-causal-hold", relationship: "Limited By", confidence: "Missing Evidence", note: "Federation health, adjudication, time corroboration, patching, and decommissioning do not establish implementation, capability, closure, operating outcomes, attribution, or causation." }
];
await writeJson(mapPath, map);

console.log("Generated Phase 57X: 63 records (54 Published, 9 In Review), 54 schemas, 1,593 cases, 36 carried Tier 1 sources, Research Watch 054, one collection, one update, and integration across five topics, three pathways, and one dependency map.");
