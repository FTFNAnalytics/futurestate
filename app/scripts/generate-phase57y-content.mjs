import { mkdir, readFile, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { runPhase57yHarness } from "./phase57y-remediation-rotation-recusal-rollout-recovery-harness.mjs";

const appRoot = fileURLToPath(new URL("..", import.meta.url));
const contentRoot = join(appRoot, "src", "content");
const dataRoot = join(appRoot, "src", "data");
const capturedDate = "2026-08-10";
const collectionSlug = "federation-remediation-witness-rotation-recusal-time-holdover-coordinated-rollout-legacy-recovery-2026";
const collectionId = `research-collection-${collectionSlug}`;
const briefingSlug = "research-watch-055-federation-remediation-and-long-term-recovery";
const briefingId = `briefing-${briefingSlug}`;
const json = (value) => `${JSON.stringify(value, null, 2)}\n`;
const writeJson = (path, value) => writeFile(path, json(value), "utf8");
const appendUnique = (items, additions) => [...new Set([...(items ?? []), ...additions])];
const yamlList = (name, items) => [name + ":", ...items.map((item) => `  - ${JSON.stringify(item)}`)].join("\n");

for (const name of ["research-documents", "signals", "research-collections", "briefings", "updates"]) await mkdir(join(contentRoot, name), { recursive: true });

const phase57x = JSON.parse(await readFile(join(dataRoot, "phase-57x-federation-health-diversity-adjudication-time-patch-decommissioning.json"), "utf8"));
if (phase57x.phase !== "57X" || phase57x.records.length !== 63) throw new Error("Phase 57Y requires the complete Phase 57X baseline.");
const published57x = phase57x.records.filter((record) => record.record_status === "Published");
const held57x = phase57x.records.filter((record) => record.record_status === "In Review");
if (published57x.length !== 54 || held57x.length !== 9) throw new Error("Phase 57Y requires fifty-four Phase 57X controls and nine holds.");

const harness = runPhase57yHarness();
if (harness.total_schema_count !== 54 || harness.total_case_count !== 1629 || harness.failures.length) throw new Error("Phase 57Y requires 54 schemas and 1,629 passing cases.");

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
const authorityBoundary = "Agency assertions, regulator evidence, FTFN controls, evidence-review identity, publication-review identity, release identity, signing identity, quorum-member identity, witness identity, auditor identity, adjudicator identity, recusal identity, precedent identity, time-authority identity, verifier identity, vulnerability identity, patch identity, rollout identity, tombstone identity, recovery identity, GAO acceptance, implementation, capability, closure, entity evidence, schema, period, unit, denominator, revision history, privacy boundary, attribution, and operating outcomes remain separate evidence states.";
const incrementKey = (key) => key.replace(/-(\d{2})$/, (_, value) => `-${String(Number(value) + 1).padStart(2, "0")}`);

const controls = [
  {
    key: "remediation", suffix: "health-breach-remediation-capacity-planning", action: "HEALTH-BREACH-REMEDIATION", registry: "phase-57y-health-breach-remediation-capacity-planning.json", stage: "Sustained health-breach remediation and capacity-planning controls",
    title: (label) => `${label} receives sustained-breach remediation and capacity-planning receipts`,
    finding: "Sustained quorum or witness health-budget failure produces an append-only breach window, a versioned capacity plan, independent review, and a bounded recovery budget while the fixed integrity threshold and stale-member exclusion remain unchanged.",
    denominator: "One remediation schema, thirty adversarial cases, eight bounded valid routes, twenty-two explicit rejections, and zero production breaches or capacity changes.",
    limits: ["Every breach, plan, and recovery receipt is synthetic.", "A single sample cannot establish sustained failure, and remediation cannot lower quorum, witness, diversity, time, verifier, notification, or publication requirements.", "Capacity planning is operational control evidence only and cannot accept, implement, close, or publish an outcome."],
    next: (label) => `Apply the ${label} remediation contract only after a sustained signed breach window and independent review, without reducing integrity requirements.`
  },
  {
    key: "rotation", suffix: "witness-rotation-jurisdiction-exit-correlated-failure", action: "WITNESS-ROTATION-FAILURE-RECOVERY", registry: "phase-57y-witness-rotation-jurisdiction-exit-correlated-failure.json", stage: "Witness rotation, jurisdiction-exit, and correlated-failure controls",
    title: (label) => `${label} receives governed witness rotation and correlated-failure recovery`,
    finding: "Rotation, jurisdiction exit, and infrastructure evacuation require explicit authorization, four-dimension diversity, append-only replacement catch-up, suspension of the outgoing witness, and a correlated-failure drill that never counts stale or unverified members.",
    denominator: "One rotation schema, thirty adversarial cases, eight bounded valid routes, twenty-two explicit rejections, and zero production rotations, exits, evacuations, or failure events.",
    limits: ["Every rotation, exit, evacuation, and drill is synthetic.", "Replacement witnesses cannot count until catch-up and all four diversity dimensions pass.", "Rotation cannot merge authority domains, lower threshold, force activation, publish, or create evidence."],
    next: (label) => `Rotate ${label} witnesses only through governed suspension, four-dimension diversity review, and complete append-only catch-up.`
  },
  {
    key: "recusal", suffix: "adjudicator-conflict-recusal-precedent-consistency", action: "ADJUDICATOR-RECUSAL-PRECEDENT", registry: "phase-57y-adjudicator-conflict-recusal-precedent-consistency.json", stage: "Adjudicator conflict, recusal, precedent-versioning, and consistency controls",
    title: (label) => `${label} receives mandatory recusal and append-only precedent controls`,
    finding: "Adjudicators disclose conflicts and recuse before voting; replacements preserve panel independence, precedent versions remain append-only and nonbinding, cross-panel consistency receives a reason-coded check, and appeal independence remains intact.",
    denominator: "One recusal schema, thirty adversarial cases, eight bounded valid routes, twenty-two explicit rejections, and zero production conflicts, recusals, precedents, adjudications, or appeals.",
    limits: ["Every disclosure, recusal, precedent, consistency check, and appeal fixture is synthetic.", "Precedent cannot rewrite prior decisions, assign blame, force an outcome, or substitute for current evidence and human review.", "A conflicted actor cannot vote or select its own replacement."],
    next: (label) => `Require conflict disclosure and recusal for ${label}, version precedent append-only, and keep it nonbinding on blame, acceptance, and publication.`
  },
  {
    key: "holdover", suffix: "time-holdover-resynchronization-leap-smear", action: "TIME-HOLDOVER-RESYNCHRONIZATION", registry: "phase-57y-time-holdover-resynchronization-leap-smear.json", stage: "Time holdover, leap-event, smear-policy, and resynchronization controls",
    title: (label) => `${label} receives bounded time holdover and rollback-safe resynchronization`,
    finding: "A bounded holdover window preserves monotonic sequence and counters, declares leap events and smear policy, appends resynchronization receipts, and quarantines post-partition convergence until independent authorities agree without importing an earlier state.",
    denominator: "One holdover schema, twenty-seven adversarial cases, seven bounded valid routes, twenty explicit rejections, and zero production holdovers, leap events, smear events, or resynchronizations.",
    limits: ["Every holdover, leap, smear, resynchronization, and convergence fixture is synthetic.", "No external authority or majority may import a regressive sequence, counter, receipt, or observation state.", "Time ordering cannot establish truth, acceptance, causation, closure, or publication."],
    next: (label) => `Keep ${label} in bounded holdover and quarantine resynchronization until monotonic lineage and independent convergence both verify.`
  },
  {
    key: "rollout", suffix: "vulnerability-embargo-canary-hotfix-rollout-rollback", action: "VULNERABILITY-COORDINATED-ROLLOUT", registry: "phase-57y-vulnerability-embargo-canary-hotfix-rollout-rollback.json", stage: "Coordinated vulnerability embargo, canary, hotfix, rollout, and rollback controls",
    title: (label) => `${label} receives reproducible coordinated rollout and rollback controls`,
    finding: "Authorized embargoes bind the affected build; canaries use distinct reproducible artifacts and bounded scope; emergency hotfixes remain reason-coded; full rollout requires separate authorization; rollback stays independently verified; and vulnerable lineage remains visible.",
    denominator: "One rollout schema, thirty-two adversarial cases, eight bounded valid routes, twenty-four explicit rejections, and zero production embargoes, canaries, hotfixes, rollouts, or rollbacks.",
    limits: ["Every embargo, canary, hotfix, rollout, and rollback fixture is synthetic and discloses no production vulnerability.", "Emergency operation cannot bypass provenance, independent verification, time, witness, notification, or publication controls.", "A canary cannot expand automatically and a hotfix cannot erase vulnerable lineage."],
    next: (label) => `Advance any ${label} fix from embargo to bounded canary, separately authorized rollout, and verified rollback while preserving all lineage.`
  },
  {
    key: "recovery", suffix: "legacy-retention-tombstone-discoverability-disaster-recovery", action: "LEGACY-RETENTION-DISASTER-RECOVERY", registry: "phase-57y-legacy-retention-tombstone-discoverability-disaster-recovery.json", stage: "Long-term legacy retention, tombstone, discoverability, and disaster-recovery controls",
    title: (label) => `${label} receives long-term retention and inactive-by-default recovery`,
    finding: "Bounded retention and append-only tombstones keep retired artifacts discoverable but inactive; authorized restore drills verify exact digests without changing reader state; and disaster recovery remains reversible with notice, grace, and rollback intact.",
    denominator: "One recovery schema, thirty-two adversarial cases, eight bounded preservation routes, twenty-four explicit rejections, and zero production tombstones, restorations, reader migrations, or disaster events.",
    limits: ["Every retention, tombstone, restore, and disaster-recovery fixture is synthetic.", "Retired artifacts cannot be deleted, hidden, silently reactivated, or restored with a mismatched digest.", "A drill cannot force reader migration, acceptance, implementation, closure, publication, or an operating outcome."],
    next: (label) => `Retain ${label} legacy artifacts behind append-only tombstones and verify recovery by exact digest without reactivating readers.`
  }
];

const records = [];
let documentNumber = 1459;
for (const priorHold of held57x) {
  const [shortSlug, label, prefix] = contracts[priorHold.reopening_contract_id] ?? [];
  const meta = agencyMeta[priorHold.agency];
  const sourceRecord = published57x.find((record) => record.action_key.startsWith(prefix));
  if (!shortSlug || !meta || !sourceRecord) throw new Error(`Incomplete Phase 57Y metadata for ${priorHold.reopening_contract_id}`);
  for (const control of controls) {
    const slug = `57y-${shortSlug}-${control.suffix}`;
    records.push({
      record_id: `record-${slug}`, document_id: `research-doc-${slug}`, signal_id: `signal-${slug}`, document_number: documentNumber++, record_status: "Published", agency: priorHold.agency,
      action_key: `${prefix}-${control.action}-2026-01`, parent_hold_key: null, reopening_contract_id: null, evidence_stage: control.stage, title: control.title(label), finding: control.finding,
      denominator: control.denominator, evidence_limits: control.limits, next_action: control.next(label), structured_registry_file: control.registry, source_id: sourceRecord.source_id,
      supporting_source_ids: sourceRecord.supporting_source_ids, official_url: sourceRecord.official_url, publication_date: capturedDate, document_type: "Technical Report", authority_boundary: authorityBoundary,
      meta: { ...meta, shortSlug, label, prefix }
    });
  }
}
for (const priorHold of held57x) {
  const [shortSlug, label, prefix] = contracts[priorHold.reopening_contract_id];
  const slug = `57y-preserved-${shortSlug}`;
  records.push({
    ...priorHold, record_id: `record-${slug}`, document_id: `research-doc-${slug}`, signal_id: `signal-${slug}`, document_number: documentNumber++, record_status: "In Review",
    action_key: incrementKey(priorHold.action_key), parent_hold_key: priorHold.action_key, evidence_stage: "Remediation, rotation, recusal, holdover, coordinated-rollout, and long-term-recovery hold",
    title: `${label} remains In Review after long-horizon federation-recovery execution`,
    finding: "One hundred eighty-one fixture-only cases pass for this contract, but no exact target evidence, production breach, rotation, recusal, precedent, holdover, rollout, tombstone, restoration, or recovery event exists.",
    denominator: "One inherited hold, thirty remediation cases, thirty rotation cases, thirty recusal cases, twenty-seven holdover cases, thirty-two rollout cases, thirty-two recovery cases, and zero actual workflow or evidence events.",
    evidence_limits: ["Synthetic breaches, plans, rotations, exits, failures, recusals, precedents, holdovers, resynchronizations, embargoes, canaries, hotfixes, rollouts, tombstones, restorations, and drills are not evidence.", "No fixture changes reader state, assigns blame, creates production authority, or fires the unchanged reopening trigger.", "The inherited hold cannot close or publish automatically."],
    next_action: `Keep ${label} In Review until exact target evidence satisfies its unchanged reopening contract.`, structured_registry_file: "phase-57y-remediation-rotation-recusal-rollout-recovery-harness-results.json", publication_date: capturedDate,
    authority_boundary: authorityBoundary, meta: { ...agencyMeta[priorHold.agency], shortSlug, label, prefix }
  });
}
if (records.length !== 63 || documentNumber !== 1522) throw new Error("Phase 57Y document numbering must span 1459 through 1521.");
const published = records.filter((record) => record.record_status === "Published");
const held = records.filter((record) => record.record_status === "In Review");
const carriedSources = [...new Set(published.flatMap((record) => record.supporting_source_ids ?? [record.source_id]))];
if (published.length !== 54 || held.length !== 9 || carriedSources.length !== 36) throw new Error(`Phase 57Y expected 54 Published, 9 held, and 36 carried sources; found ${published.length}, ${held.length}, ${carriedSources.length}.`);

const registryMeta = {
  remediation: ["phase-57y-health-breach-remediation-capacity-planning.json", "Sustained health-breach remediation and capacity planning", "actual_breaches_or_capacity_changes"],
  rotation: ["phase-57y-witness-rotation-jurisdiction-exit-correlated-failure.json", "Witness rotation, jurisdiction exit, and correlated-failure recovery", "actual_rotations_exits_or_failures"],
  recusal: ["phase-57y-adjudicator-conflict-recusal-precedent-consistency.json", "Adjudicator conflict, recusal, precedent versioning, and cross-panel consistency", "actual_conflicts_recusals_or_precedents"],
  holdover: ["phase-57y-time-holdover-resynchronization-leap-smear.json", "Time holdover, leap events, smear policy, and resynchronization", "actual_holdovers_or_resynchronizations"],
  rollout: ["phase-57y-vulnerability-embargo-canary-hotfix-rollout-rollback.json", "Coordinated vulnerability embargo, canary, hotfix, rollout, and rollback", "actual_embargoes_canaries_hotfixes_or_rollouts"],
  recovery: ["phase-57y-legacy-retention-tombstone-discoverability-disaster-recovery.json", "Long-term legacy retention, tombstones, discoverability, and disaster recovery", "actual_tombstones_restorations_or_recoveries"]
};
for (const [key, [file, registryType, actualField]] of Object.entries(registryMeta)) await writeJson(join(dataRoot, file), {
  phase: "57Y", captured_date: capturedDate, registry_type: registryType, ...harness.distributions[key], passed_case_count: harness.cases[key].length, failed_case_count: 0, [actualField]: 0,
  schemas: harness.schemas[key], cases: harness.cases[key]
});
await writeJson(join(dataRoot, "phase-57y-remediation-rotation-recusal-rollout-recovery-harness-results.json"), {
  phase: "57Y", captured_date: capturedDate, total_schema_count: harness.total_schema_count, total_case_count: harness.total_case_count, passed_case_count: harness.passed_case_count,
  failed_case_count: harness.failed_case_count, valid_or_preservation_routes: harness.valid_or_preservation_routes, rejected_routes: harness.rejected_routes,
  actual_breaches: 0, actual_capacity_changes: 0, actual_rotations: 0, actual_jurisdiction_exits: 0, actual_correlated_failures: 0, actual_recusals: 0, actual_precedents: 0,
  actual_holdovers: 0, actual_resynchronizations: 0, actual_embargoes: 0, actual_canaries: 0, actual_hotfixes: 0, actual_rollouts: 0, actual_rollbacks: 0,
  actual_tombstones: 0, actual_restorations: 0, actual_recoveries: 0, actual_reader_state_changes: 0, evidence_records_created: 0, reopening_triggers_fired: 0,
  automated_closures_or_publications: 0, human_blame_assignments: 0, history_rewrites: 0, test_ids: harness.allCases.map((row) => row.test_id)
});

const review = {
  phase: "57Y", captured_date: capturedDate, reviewed_records: records.length, records_added_published: published.length, records_held_in_review: held.length,
  promoted_document_ids: published.map((row) => row.document_id), promoted_signal_ids: published.map((row) => row.signal_id), held_document_ids: held.map((row) => row.document_id), held_signal_ids: held.map((row) => row.signal_id),
  inherited_hold_lineage: held.map((row) => ({ action_key: row.action_key, parent_hold_key: row.parent_hold_key, reopening_contract_id: row.reopening_contract_id })),
  total_contract_specific_schemas: harness.total_schema_count, total_workflow_cases_executed: harness.total_case_count, exact_target_artifacts_acquired: 0, reopening_triggers_fired: 0,
  decision: "Fifty-four remediation, rotation, recusal, holdover, coordinated-rollout, and long-term-recovery controls publish. All nine inherited holds remain In Review; every case is synthetic and no production event, evidence change, reader-state change, blame assignment, trigger, publication, or closure is recorded."
};
await writeJson(join(dataRoot, "phase-57y-publication-review.json"), review);
await writeJson(join(dataRoot, "phase-57y-federation-remediation-rotation-recusal-holdover-rollout-recovery.json"), {
  phase: "57Y", captured_date: capturedDate, records_reviewed: records.length, records_added_published: published.length, records_held_in_review: held.length,
  carried_tier1_source_ids: carriedSources, carried_tier1_source_count: carriedSources.length, preserved_phase57x_holds: held.map((row) => row.parent_hold_key), new_visible_holds: [],
  total_contract_specific_schemas: harness.total_schema_count, total_workflow_cases: harness.total_case_count, valid_or_preservation_routes: harness.valid_or_preservation_routes, rejected_routes: harness.rejected_routes,
  workflow_test_failures: 0, exact_target_artifacts_acquired: 0, eligible_records_accepted: 0, reopening_triggers_fired: 0, public_agency_contacts_or_foia_requests: 0,
  actual_production_events: 0, actual_reader_state_changes: 0, human_blame_assignments: 0, automated_closures_or_publications: 0, operating_outcome_changes: 0,
  post_batch_closure_counts: { Closed: 1, "Partially Closed": 21, Open: 2 }, records
});

const commonLimits = ["Not publicly acquired does not mean nonexistent, withheld, or never submitted.", "FTFN public-source research is not agency contact or a submitted FOIA request.", "The inherited 1 Closed / 21 Partially Closed / 2 Open entity ledger remains unchanged.", "No record supports a ranking, composite score, readiness score, generalized savings claim, or unsupported causal inference."];
for (let index = 0; index < records.length; index += 1) {
  const row = records[index];
  const archiveMember = `official-links/${String(index + 1).padStart(2, "0")}-phase57y-record.txt`;
  const supportingIds = row.supporting_source_ids ?? [row.source_id];
  const document = {
    id: row.document_id, collection_id: collectionId, title: row.title, slug: row.signal_id.replace(/^signal-/, ""), record_status: row.record_status, publisher: row.meta.publisher,
    publication_date: row.record_status === "Published" ? capturedDate : null, document_type: row.document_type ?? "Technical Report", summary: `${row.finding} Denominator: ${row.denominator}`,
    key_findings: [`Evidence stage: ${row.evidence_stage}.`, `Finding: ${row.finding}`, `Denominator: ${row.denominator}`, ...row.evidence_limits.map((limit) => `Boundary: ${limit}`), `Next action: ${row.next_action}`],
    why_it_matters: "The record makes sustained federation failure, maintenance, emergency rollout, and long-term recovery auditable without granting operational controls evidence or editorial authority.",
    ftfn_relevance: ["Preserves fixed integrity thresholds through sustained failure and emergency maintenance.", "Separates recusal and precedent from automatic blame, acceptance, and publication.", "Keeps rollout and long-term recovery reproducible, append-only, and reversible."],
    evidence_limits: [...commonLimits.slice(0, 2), ...row.evidence_limits, ...commonLimits.slice(2)], primary_topics: row.meta.topics, framework_layers: row.meta.layers,
    constraint_tags: ["Data Quality", "Regulation", "Public Trust"], source_id: row.source_id, supporting_source_ids: supportingIds, supporting_official_urls: [row.official_url], official_url: row.official_url,
    local_capture_path: `/downloads/${collectionSlug}/${archiveMember}`, archive_member: archiveMember, capture_status: "Official link record", captured_date: capturedDate
  };
  await writeJson(join(contentRoot, "research-documents", `${row.document_number}-${document.slug}.json`), document);

  const publishedDate = row.record_status === "Published" ? capturedDate : "null";
  const signal = `---\nid: ${JSON.stringify(row.signal_id)}\ntitle: ${JSON.stringify(row.title)}\nslug: ${JSON.stringify(document.slug)}\nrecord_status: ${JSON.stringify(row.record_status)}\nsummary: ${JSON.stringify(row.finding)}\n${yamlList("source_ids", supportingIds)}\npublished_date: ${publishedDate}\ncaptured_date: ${capturedDate}\nprimary_topic: ${JSON.stringify(row.meta.topics[0])}\n${yamlList("framework_layers", row.meta.layers)}\nsignal_type: "Research Result"\nmaturity_level: "Infrastructure"\ntime_horizon: "Now"\nevidence_quality: "Official Data"\nverification_status: "Verified Against Primary Source"\nwhy_it_matters: ${JSON.stringify(`Evidence stage: ${row.evidence_stage}. Denominator: ${row.denominator}`)}\n${yamlList("dependencies", ["complete Phase 57X federation-health and reversible-decommissioning controls", "fixed integrity thresholds", "independent human review", "append-only lineage", "separate publication authorization"])}\n${yamlList("constraints", ["Data Quality", "Regulation", "Public Trust"])}\n${yamlList("receiving_systems", ["Phase 57Y federation remediation and long-term recovery controls"])}\n${yamlList("local_implications", ["Do not convert a synthetic breach, plan, rotation, recusal, precedent, holdover, rollout, tombstone, restoration, or drill into evidence, acceptance, implementation, capability, closure, blame, attribution, or operating outcomes."])}\n${yamlList("evidence_gap_ids", row.meta.gaps)}\nclaim_scope: "Specific Source Update"\nlocal_evidence_level: "General Source Layer"\nlast_reviewed_date: ${capturedDate}\neditorial_notes: ${JSON.stringify(`Phase 57Y ${row.record_status === "Published" ? "bounded-control publication" : "inherited-hold preservation"}.`)}\n---\n\n## Phase 57Y federation remediation and long-term recovery\n\n${row.finding}\n\n## Evidence stage and denominator\n\n**${row.evidence_stage}.** ${row.denominator}\n\nStructured registry: ${row.structured_registry_file}.\n\n## Evidence boundaries\n\n${row.evidence_limits.map((limit) => `- ${limit}`).join("\n")}\n\nActual production breaches, plans, rotations, exits, failures, recusals, precedents, holdovers, resynchronizations, embargoes, canaries, hotfixes, rollouts, rollbacks, tombstones, restorations, reader-state changes, triggers, publications, blame assignments, and closures: **Zero**. FTFN submitted no agency contact or FOIA request.\n\nNext action: ${row.next_action}\n\n## Authority boundary\n\n${row.authority_boundary}\n`;
  await writeFile(join(contentRoot, "signals", `${row.signal_id}.mdx`), signal, "utf8");
}

await writeJson(join(contentRoot, "research-collections", `${collectionSlug}.json`), {
  id: collectionId, title: "Federation Remediation, Witness Rotation, Recusal, Time Holdover, Coordinated Rollout, and Long-Term Recovery, 2026", slug: collectionSlug, record_status: "Published",
  summary: "Phase 57Y executes 1,629 synthetic remediation, rotation, recusal, holdover, coordinated-rollout, and long-term-recovery cases across nine contracts while preserving every inherited hold and rejecting every threshold-lowering, stale-counting, conflicted, rollback-importing, lineage-rewriting, auto-rollout, silent-reactivation, or state-inflation attempt.",
  scope: "Nine schemas on each of six long-horizon federation-maintenance rails, 1,629 cases, fifty-four Published controls, nine preserved holds, thirty-six carried Tier 1 sources, and zero actual production, evidence, blame, reader-state, trigger, publication, closure, or operating-outcome events.",
  captured_date: capturedDate, document_ids: records.map((row) => row.document_id), download_path: `/downloads/${collectionSlug}.zip`,
  download_note: "The sixty-six-file archive contains sixty-three official-link records, consolidated summaries, a README, and a checksum manifest.",
  method_note: "Every breach, plan, rotation, exit, failure, recusal, precedent, holdover, resynchronization, embargo, canary, hotfix, rollout, rollback, tombstone, restoration, and drill is synthetic. Integrity thresholds remain fixed; human review stays independent; vulnerable and retired lineage remains visible; reader state never changes automatically."
});

const briefing = `---\nid: ${JSON.stringify(briefingId)}\ntitle: "Research Watch 055: Federation Remediation and Long-Term Recovery"\nslug: ${JSON.stringify(briefingSlug)}\nrecord_status: "Published"\nsummary: "Phase 57Y passes 1,629 synthetic remediation, rotation, recusal, holdover, rollout, and recovery cases while preserving all nine holds and keeping every production, evidence, blame, reader-state, trigger, and publication count at zero."\npublished_date: ${capturedDate}\ncaptured_date: ${capturedDate}\n${yamlList("signal_ids", records.map((row) => row.signal_id))}\n${yamlList("evidence_gap_ids", ["gap-008", "gap-015", "gap-016"])}\nclaim_scope: "Editorial Synthesis"\nlocal_evidence_level: "General Source Layer"\nlast_reviewed_date: ${capturedDate}\n${yamlList("top_takeaways", ["Sustained health failure produces versioned remediation and capacity plans without lowering integrity thresholds.", "Witness rotation preserves four-dimension diversity and complete catch-up; conflicted adjudicators recuse while precedent remains append-only and nonbinding.", "Time holdover and resynchronization preserve monotonic lineage.", "Embargo, canary, hotfix, rollout, rollback, tombstone, restoration, and disaster recovery remain reproducible and reversible without changing reader state."])}\n${yamlList("constraint_watch", ["Data Quality", "Regulation", "Public Trust"])}\n${yamlList("what_to_watch_next", ["Real dated evidence capable of satisfying one of the nine inherited reopening contracts", "Official DARPA Lift Challenge results after the August 9 awards ceremony", "Toronto by-law enactment after the retained wind, land-exchange, and laneway conditions", "The first complete public Montana BEAD quarter and exact Amtrak, Hanford, or NNSA target artifact"])}\n---\n\n## What Phase 57Y proves\n\nLong-horizon maintenance can respond to sustained failure, rotate authority, remove conflicts, preserve time, patch safely, and recover retired artifacts without weakening the publication or evidence boundary.\n\n## What did not move\n\nNo fixture is a production event. No reader state changes, no human blame is assigned, no trigger fires, and all nine inherited outcome holds remain In Review.\n\n## Evidence boundary\n\nThe entity ledger remains one Closed, twenty-one Partially Closed, and two Open. Phase 57Y records no agency contact, FOIA request, directive-scope change, implementation change, capability change, closure change, attribution change, or operating-outcome change.\n`;
await writeFile(join(contentRoot, "briefings", `${briefingSlug}.mdx`), briefing, "utf8");

await writeJson(join(contentRoot, "updates", "2026-08-10-phase-57y-remediation-rotation-recusal-holdover-rollout-recovery.json"), {
  id: "update-2026-08-10-phase-57y-remediation-rotation-recusal-holdover-rollout-recovery", effective_date: capturedDate, entry_type: "Research Collection",
  title: "Phase 57Y closes the federation-remediation and long-term-recovery control arc", summary: "Thirty-six carried Tier 1 sources support fifty-four Published controls, nine preserved holds, fifty-four schemas, and 1,629 executable remediation, rotation, recusal, holdover, rollout, and recovery cases.",
  affected_record_ids: [collectionId, briefingId, ...records.map((row) => row.signal_id)], related_paths: [`/research/${collectionSlug}/`, `/briefings/${briefingSlug}/`, ...records.map((row) => `/signals/${row.signal_id.replace(/^signal-/, "")}/`)],
  evidence_note: "Every Phase 57Y event is synthetic and remains separate from source evidence, reviewer identity, acceptance, implementation, capability, closure, blame, attribution, and operating outcomes.",
  work_package: "docs/work-packages/phase-57y-federation-remediation-rotation-recusal-holdover-rollout-recovery.md"
});

for (const file of ["finance-and-risk.json", "policy-and-standards.json", "mobility.json", "chips-and-compute.json", "energy.json"]) {
  const path = join(contentRoot, "topics", file);
  const topic = JSON.parse(await readFile(path, "utf8"));
  topic.watch_questions = appendUnique(topic.watch_questions, ["What real dated evidence can satisfy a Phase 57Y reopening contract after remediation, rotation, recusal, holdover, rollout, and long-term-recovery controls pass without changing the evidence ledger?"]);
  await writeJson(path, topic);
}
const stage = "Phase 57Y federation remediation, rotation, recusal, holdover, coordinated rollout, and long-term recovery";
for (const file of ["policy-standards-to-implementation.json", "cross-corridor-authorization-to-operation.json", "energy-grid-capacity-to-service.json"]) {
  const path = join(contentRoot, "reader-pathways", file);
  const pathway = JSON.parse(await readFile(path, "utf8"));
  pathway.signal_ids = appendUnique(pathway.signal_ids, published.filter((_, index) => index % 3 === ["policy-standards-to-implementation.json", "cross-corridor-authorization-to-operation.json", "energy-grid-capacity-to-service.json"].indexOf(file)).map((row) => row.signal_id));
  pathway.source_ids = appendUnique(pathway.source_ids, carriedSources);
  pathway.briefing_ids = appendUnique(pathway.briefing_ids, [briefingId]);
  pathway.research_collection_ids = appendUnique(pathway.research_collection_ids, [collectionId]);
  if (!pathway.dependency_stack.some((item) => item.stage === stage)) pathway.dependency_stack.push({ stage, current_state: "Fifty-four bounded long-horizon federation controls pass across nine contracts; all nine real-world outcome holds remain In Review.", boundary: "Synthetic remediation and recovery controls do not create evidence, assign blame, change reader state, fire triggers, publish, close, or create operating outcomes." });
  pathway.next_records = appendUnique(pathway.next_records, ["Exact dated target evidence that resolves an inherited reopening contract rather than another synthetic control layer"]);
  await writeJson(path, pathway);
}
const mapPath = join(contentRoot, "dependency-maps", "comparative-outcomes-require-common-denominators.json");
const map = JSON.parse(await readFile(mapPath, "utf8"));
const nodeId = "node-phase57y-remediation-long-term-recovery";
if (!map.nodes.some((node) => node.id === nodeId)) map.nodes.push({ id: nodeId, label: "Nine federation-recovery contracts; fixed-threshold remediation, governed rotation and recusal, monotonic holdover, coordinated rollout, and reversible long-term recovery", node_type: "Signal", note: "Phase 57Y closes the synthetic federation-maintenance arc while preserving all nine real-world evidence holds." });
for (const to of ["node-phase57x-health-adjudication-decommissioning", "node-attribution", "node-gap"]) if (!map.links.some((link) => link.from === nodeId && link.to === to)) map.links.push({ from: nodeId, to, relationship: to === "node-gap" ? "Limited By" : "Depends On", confidence: to === "node-gap" ? "Missing Evidence" : "Supported", note: to === "node-gap" ? "Control completeness cannot substitute for exact outcome evidence." : "Long-horizon recovery inherits Phase 57X integrity and keeps attribution separate." });
map.signal_ids = appendUnique(map.signal_ids, published.map((row) => row.signal_id));
map.source_ids = appendUnique(map.source_ids, carriedSources);
map.next_records_needed = appendUnique(map.next_records_needed, ["A Phase 57Z dated evidence-return pass against the nine inherited outcome contracts"]);
await writeJson(mapPath, map);

console.log(`Generated Phase 57Y: ${records.length} records, ${published.length} Published, ${held.length} held, ${harness.total_schema_count} schemas, ${harness.total_case_count} cases.`);
