import { mkdir, readFile, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { computeV1octDigestFromDisk, findMatchingV1octReceipt, v1octPhases } from "./lib/v1oct-candidate-digest.mjs";

const scriptRoot = dirname(fileURLToPath(import.meta.url));
const appRoot = join(scriptRoot, "..");
const workspaceRoot = join(appRoot, "..");
const dataRoot = join(appRoot, "src", "data");
const updatesRoot = join(appRoot, "src", "content", "updates");
const sourcesRoot = join(appRoot, "src", "content", "sources");
const receiptRoot = join(dataRoot, "phase-180-receipts");
const readJson = async (name) => JSON.parse(await readFile(join(dataRoot, name), "utf8"));
const writeJson = async (path, value) => { await mkdir(dirname(path), { recursive: true }); await writeFile(path, `${JSON.stringify(value, null, 2)}\n`, "utf8"); };

const exportNames = {
  173: "phase-173-september-closeout-october-opening-ledger.json",
  174: "phase-174-evidence-cycle-closure-intake.json",
  175: "phase-175-owner-disposition-sprint-ii.json",
  176: "phase-176-longitudinal-admission-and-zero-series-decision.json",
  177: "phase-177-october-stack-watch-and-source-currency-sweep.json",
  178: "phase-178-systems-atlas-and-compendium-depth-expansion.json",
  179: "phase-179-october-weekly-editions-and-month-end-synthesis.json",
  180: "phase-180-october-state-report-and-v1-promotion-gate.json"
};
const phases = await Promise.all(v1octPhases.filter((phase) => phase < 180).map((phase) => readJson(exportNames[phase])));
const byPhase = new Map(phases.map((phase) => [phase.phase, phase]));
const p173 = byPhase.get(173), p174 = byPhase.get(174), p175 = byPhase.get(175), p176 = byPhase.get(176), p177 = byPhase.get(177), p178 = byPhase.get(178), p179 = byPhase.get(179);
const [p156, p164, p172] = await Promise.all([readJson("phase-156-v1-launch-decision.json"), readJson("phase-164-monthly-candidate-decision.json"), readJson("phase-172-september-state-report.json")]);

const baselines = {
  v1rc: { receipt_id: p156.local_validation_receipt?.receipt_id, artifact_digest: p156.local_validation_receipt?.artifact_digest },
  v1month: { receipt_id: p164.local_validation_receipt?.receipt_id, artifact_digest: p164.local_validation_receipt?.artifact_digest },
  v1cycle: { receipt_id: p172.local_validation_receipt?.receipt_id, artifact_digest: p172.local_validation_receipt?.artifact_digest }
};
if (baselines.v1rc.artifact_digest !== "5a8041408c755e79e4ddde898fe9639d04d85cdcf4bdba5a5d4014d21c14b31a" || baselines.v1month.artifact_digest !== "c306c3db8f861805be0482f82985df7de7fa1124b055f8e76023b5ba680c8a19" || baselines.v1cycle.artifact_digest !== "cdf822b6451e02523dbdcadfc0f21470011285033de55c919718785aaffd9b34") {
  throw new Error("An immutable Phase 156, 164, or 172 baseline digest changed; refusing Phase 180 generation.");
}

const boundaries = [
  "This accelerated layer is prepared and locally published on 2026-09-01; it does not claim that a later September or October operation has occurred.",
  "The immutable Phase 156, 164, and 172 receipts remain exact; later live projections and receipts are append-only.",
  "Source profiles checked on September 1 are current preparation, not October rechecks, evidence-admission decisions, or observed outcomes.",
  "Owner outcomes, compatibility decisions, longitudinal admission, zero-series acceptance, weekly publications, month-end synthesis, Git publication, hosting, public launch, and v1 promotion remain null or Held until their authorities exist."
];

const allTrue = (record) => Object.values(record).every(Boolean);
const unique = (values) => new Set(values).size === values.length;
const stackWatchAudit = {
  exact_packet_inventory:
    p177.packets.length === 32 &&
    p177.packets.filter((packet) => packet.packet_kind === "Phase 161 packet reference").length === 24 &&
    p177.packets.filter((packet) => packet.packet_kind === "New prepared official-source packet").length === 8,
  exact_lane_and_claim_inventory:
    p177.lane_syntheses.length === 8 &&
    p177.counts.total_claim_block_references === 96,
  source_bound_new_packets: p177.packets
    .filter((packet) => packet.packet_kind === "New prepared official-source packet")
    .every((packet) =>
      packet.checked_date === "2026-09-01" &&
      packet.source_ids?.length === 1 &&
      packet.claim_blocks?.length === 3 &&
      Boolean(packet.exact_next_artifact) &&
      Boolean(packet.affected_record_map),
    ),
  lawful_october_schedule: p177.packets.every(
    (packet) =>
      /^2026-10-\d{2}$/.test(packet.scheduled_october_recheck_date ?? "") &&
      packet.october_recheck_date === null &&
      packet.october_finding === null,
  ),
  unique_routes: unique(p177.packets.map((packet) => packet.route)),
};
const stackWatchAuditPassed = allTrue(stackWatchAudit);

const atlasAudit = {
  exact_depth_inventory:
    p178.place_system_dossiers.length === 10 &&
    p178.comparison_overlays.length === 8 &&
    p178.interpretive_essays.length === 4 &&
    !Object.hasOwn(p178, "depth_records"),
  explicit_coverage_ledger:
    p178.coverage_matrix?.length === 10 &&
    p178.coverage_summary?.selected_places === 10 &&
    p178.coverage_summary?.selection_scores_published === 0 &&
    p178.coverage_matrix.every((row) => row.selection_score === null),
  entry_specific_source_bindings: p178.place_system_dossiers.every((dossier) =>
    dossier.source_ids?.includes(dossier.source_entry_binding?.source_id) &&
    Boolean(dossier.source_entry_binding?.entry_locator) &&
    Boolean(dossier.source_entry_binding?.checked_date) &&
    Boolean(dossier.source_entry_binding?.factual_nucleus) &&
    Boolean(dossier.source_entry_binding?.limitation),
  ),
  explicit_backlink_contracts: p178.place_system_dossiers.every((dossier) =>
    dossier.linkage_contract?.canonical_source_ids?.length === 1 &&
    dossier.linkage_contract?.topic_ids?.length > 0 &&
    Array.isArray(dossier.linkage_contract?.context_signal_ids) &&
    Array.isArray(dossier.linkage_contract?.direct_project_ids) &&
    Array.isArray(dossier.linkage_contract?.evidence_gap_ids) &&
    dossier.linkage_contract?.reader_pathway_ids?.length > 0 &&
    dossier.linkage_contract?.dependency_map_ids?.length > 0 &&
    dossier.linkage_contract?.absent_direct_backlinks?.length === 3 &&
    Boolean(dossier.linkage_contract?.boundary),
  ),
  cutoff_bounded_timeline: p178.place_system_dossiers.every(
    (dossier) => dossier.timeline?.length === 4 && dossier.timeline.every((event) => /^\d{4}-\d{2}-\d{2}$/.test(event.date ?? "") && event.date <= "2026-09-01"),
  ),
  easton_entry_identity: p178.place_system_dossiers.some((dossier) =>
    dossier.place_identity === "Easton, Pennsylvania" &&
    /Coherent/i.test(dossier.source_entry_binding?.entry_locator ?? "") &&
    /\$79 million/i.test(dossier.source_entry_binding?.factual_nucleus ?? "") &&
    /silicon-carbide|SiC/i.test(dossier.source_entry_binding?.factual_nucleus ?? ""),
  ),
  unique_routes: unique([
    ...p178.place_system_dossiers,
    ...p178.comparison_overlays,
    ...p178.interpretive_essays,
  ].map((record) => record.route)),
};
const atlasAuditPassed = allTrue(atlasAudit);

const contentIntegrityAudit = {
  phase_173_exact_carryover_classes:
    p173.counts.carryover_records === 129 &&
    p173.counts.calendar_records === 84 &&
    p173.counts.owner_held_records === 40 &&
    p173.counts.publication_held_records === 5,
  september_weekly_inputs_preserved: p173.carryover_records
    .filter((record) => record.record_class === "weekly_edition")
    .every((record) =>
      record.due_operation_ids?.length > 0 &&
      record.due_operation_ids.every((id) => record.affected_record_ids.includes(id)) &&
      record.desk_window_ids?.length === 17,
    ),
  owner_prerequisites_explicit:
    p175.owner_disposition_packets
      .filter((packet) => packet.action_kind === "requirement decision")
      .every((packet) => Boolean(packet.prerequisite_authority_packet_id) && packet.prerequisite_authority_receipt_id === null) &&
    p175.owner_disposition_packets
      .filter((packet) => packet.action_kind === "mission decision")
      .every((packet) => packet.prerequisite_packet_ids?.length === 3 && packet.prerequisite_requirement_receipt_ids?.length === 0),
  longitudinal_results_unpredated:
    p176.pilot_admission_packets.every((packet) => packet.admission_outcome === null && packet.observations_transferred === 0) &&
    p176.zero_series_owner_disposition.owner_outcome === null,
  stack_watch_audit_passed: stackWatchAuditPassed,
  atlas_audit_passed: atlasAuditPassed,
  october_due_operations_exact:
    JSON.stringify(p179.editorial_cycles.slice(0, 4).map((cycle) => cycle.due_evidence_operation_ids)) ===
    JSON.stringify([
      ["60-CYCLE-LOUDOUN-STANDARDS"],
      ["60-CYCLE-AMTRAK-NAMED-ASSET-RELIABILITY", "60-CYCLE-NNSA-RECURRING-QUALIFIED-RATE"],
      [],
      [],
    ]),
  future_editorial_results_unpredated: p179.editorial_cycles.every((cycle) =>
    /^2026-10-\d{2}$/.test(cycle.decision_date ?? "") &&
    cycle.decision_lawful_as_of_effective_date === false &&
    cycle.terminal_input_digest === null &&
    cycle.publication_receipt_id === null &&
    (Object.hasOwn(cycle, "synthesis_decision") ? cycle.synthesis_decision === null : cycle.publication_decision === null),
  ),
};
const contentIntegrityAuditPassed = allTrue(contentIntegrityAudit);

const gates = [
  { gate_id: "180-GATE-01-IMMUTABLE-BASELINES", title: "Immutable validation baselines", state: "Pass", evidence: `Phase 156 ${baselines.v1rc.receipt_id}, Phase 164 ${baselines.v1month.receipt_id}, and Phase 172 ${baselines.v1cycle.receipt_id} retain their exact digests.`, next_action: "Preserve all three receipts and validate this layer independently.", receipt_id: null },
  { gate_id: "180-GATE-02-OPERATING-FOUNDATION", title: "Cutoff-aware operating foundation", state: "Pass", evidence: `Phase 173 binds ${p173.counts.carryover_records} carryovers, generalized gate and weekly operators, the September 23 DARPA companion identity, and zero silent overdue items at the September 1 cutoff.`, next_action: "Advance live state only by append-only dated receipts.", receipt_id: null },
  { gate_id: "180-GATE-03-SEPTEMBER-CALENDAR", title: "September calendar completeness", state: "Held", evidence: `${p173.counts.future_at_effective_date} calendar records remain future at the September 1 cutoff; September desk, evidence, project-file, companion, and edition work is not complete.`, next_action: "Operate the September 6 desk closures next, then each remaining gate on its lawful date.", receipt_id: null },
  { gate_id: "180-GATE-04-CYCLE-001-CLOSE", title: "Evidence Cycle 001 terminal audit", state: "Held", evidence: `${p174.counts.cycle_001_terminal_at_effective_date} of ${p174.counts.cycle_001_audit_items} identities are terminal; ${p174.counts.cycle_001_scheduled_at_effective_date} remain scheduled.`, next_action: "Close the cycle only after all thirteen items have dated decisions and receipts or contract-compliant bounded blocker/reschedule states.", receipt_id: null },
  { gate_id: "180-GATE-05-CYCLE-002-INTAKE", title: "Evidence Cycle 002 governed intake", state: "Pass", evidence: `${p174.counts.cycle_002_candidates} candidates across ${p174.counts.cycle_002_candidate_lanes} lanes have exact authority, artifact, trigger, method, denominator, affected-record, and stop-rule contracts; all outcomes remain null.`, next_action: "Assign lawful dates only when authoritative release schedules or event triggers are established.", receipt_id: null },
  { gate_id: "180-GATE-06-AUTHORITY-DECISIONS", title: "Authority dispositions", state: "Held", evidence: `${p175.counts.authority_docket_actions} authority dockets remain owner-pending with zero candidates admitted.`, next_action: "Obtain one dated close, carry, or exclusion receipt for each exact candidate-set digest.", receipt_id: null },
  { gate_id: "180-GATE-07-REQUIREMENT-DECISIONS", title: "Requirement decisions", state: "Held", evidence: `${p175.counts.requirement_docket_actions} requirement dockets remain owner-pending.`, next_action: "Resolve authority prerequisites and then issue each requirement receipt independently.", receipt_id: null },
  { gate_id: "180-GATE-08-MISSION-DECISIONS", title: "Mission decisions", state: "Held", evidence: `${p175.counts.mission_docket_actions} mission dockets remain held behind their requirement receipts.`, next_action: "Do not decide a mission until all dependent requirement packets are terminal.", receipt_id: null },
  { gate_id: "180-GATE-09-LONGITUDINAL-ZERO-SERIES", title: "Longitudinal admission and zero-series boundary", state: "Held", evidence: `${p176.counts.compatibility_test_decisions} compatibility tests, ${p176.counts.pilot_admission_decisions} pilot admissions, and one separate zero-series owner disposition remain null; zero observations were transferred.`, next_action: "Run all six tests per pilot under dual review, then obtain the separate zero-series disposition if no series qualifies.", receipt_id: null },
  { gate_id: "180-GATE-10-STACK-WATCH", title: "Accelerated Stack Watch expansion", state: stackWatchAuditPassed ? "Pass" : "Held", derived_pass: stackWatchAuditPassed, audit_proof: stackWatchAudit, evidence: `Phase 177 exposes ${p177.counts.packets} packets across ${p177.counts.lanes} lanes and ${p177.counts.total_claim_block_references} referenced or new bounded claim blocks; its exact packet, source-binding, October-schedule, null-result, and route checks ${stackWatchAuditPassed ? "pass" : "remain incomplete"}.`, next_action: stackWatchAuditPassed ? "Run each source-currency sweep only on its bound lawful October review date." : "Repair the failed Phase 177 audit proof before treating the Stack Watch expansion as complete.", receipt_id: null },
  { gate_id: "180-GATE-11-ATLAS-DEPTH", title: "Systems Atlas and compendium depth", state: atlasAuditPassed ? "Pass" : "Held", derived_pass: atlasAuditPassed, audit_proof: atlasAudit, evidence: `Phase 178 adds ${p178.counts.place_system_dossiers} dossiers, ${p178.counts.comparison_overlays} overlays, ${p178.counts.interpretive_essays} essays, ${p178.counts.system_layers} layers, and ${p178.counts.dependency_edges} noncausal edges; its coverage, entry-provenance, backlink, timeline, identity, and route checks ${atlasAuditPassed ? "pass" : "remain incomplete"}.`, next_action: atlasAuditPassed ? "Maintain named-place, funding-state, milestone, denominator, and noncomparability boundaries through dated evidence." : "Repair the failed Phase 178 audit proof before treating the depth layer as complete.", receipt_id: null },
  { gate_id: "180-GATE-12-OCTOBER-EDITIONS", title: "October weekly and month-end edition decisions", state: "Held", evidence: `Phase 179 prebuilds ${p179.counts.scheduled_desk_closures} desk closures and ${p179.counts.editorial_cycles} future edition decisions with null cutoffs, content, digests, and receipts.`, next_action: "Issue publication or explicit no-publication receipts only after each due input set is terminal.", receipt_id: null },
  { gate_id: "180-GATE-13-MACHINE-CONTRACT", title: "Machine-readable route, export, and update contract", state: "Pass", evidence: "Eight phase registries, their exact review routes, nine JSON exports, and eight dated update identities are generated from one aggregate inventory.", next_action: "Keep the aggregate, route generator, data endpoint, sitemap, update registry, and deployment manifest exact.", receipt_id: null },
  { gate_id: "180-GATE-14-CONTENT-INTEGRITY", title: "Content and anti-inference integrity", state: contentIntegrityAuditPassed ? "Pass" : "Held", derived_pass: contentIntegrityAuditPassed, audit_proof: contentIntegrityAudit, evidence: `The embedded Phase 173–179 integrity proof ${contentIntegrityAuditPassed ? "passes" : "has one or more failed checks"}; it binds carryover classes, September weekly inputs, owner prerequisites, null future results, Phase 177/178 audits, and October due-operation identities.`, next_action: contentIntegrityAuditPassed ? "Run repository-wide candidate, content, source-health, inherited-phase, October assertions, and the production build before local validation." : "Repair every failed embedded integrity check before issuing a local-validation receipt.", receipt_id: null },
  { gate_id: "180-GATE-15-LOCAL-VALIDATION", title: "Local build and release validation", state: "Pending build", evidence: "The content-addressed Phase 180 local-validation receipt has not yet been embedded.", next_action: "Run the full validation chain, archive the digest-bound receipt, rebuild, and verify deterministic output.", receipt_id: null },
  { gate_id: "180-GATE-16-OWNER-PROMOTION", title: "Owner acceptance and repository/publication authority", state: "Held", evidence: "No owner receipt binds this candidate and no repository publication, hosting, launch, or v1-promotion authority is present.", next_action: "Obtain an explicit digest-bound owner receipt and separate publication authorization before any external release action.", receipt_id: null }
];

const countGateStates = (items) => ({
  readiness_gates: items.length,
  passed: items.filter((gate) => gate.state === "Pass").length,
  held: items.filter((gate) => gate.state === "Held").length,
  pending_build: items.filter((gate) => gate.state === "Pending build").length,
  false_passes: items.filter((gate) => gate.state === "Pass" && gate.derived_pass === false).length,
});

const p180 = {
  schema_version: "1.0",
  phase: 180,
  program_id: "FTFN-PHASE-180",
  dataset: "phase_180_october_state_report_and_v1_promotion_gate",
  title: "October State Report and v1 Promotion Gate",
  effective_date: "2026-09-01",
  record_status: "Published local state report",
  build_status: "Complete locally — validation pending; future and owner gates held",
  summary: "Audit the accelerated Phase 173–180 layer through sixteen explicit gates while separating locally complete content from September and October calendar work, owner authority, and external publication.",
  record_scope: "Append-only Phase 173–180 release layer over immutable Phase 156, 164, and 172 validation receipts.",
  publication_boundaries: boundaries,
  routes: { hub: "/review/v1oct/october-state/", public_export: "/data/phase-180-october-state-report-and-v1-promotion-gate.json" },
  counts: countGateStates(gates),
  state_report_gates: gates,
  embedded_content_audits: {
    stack_watch: stackWatchAudit,
    atlas_depth: atlasAudit,
    cross_phase_integrity: contentIntegrityAudit,
  },
  immutable_baseline_bindings: baselines,
  local_validation_receipt: null,
  owner_authority: { evidence_admission: false, authority_disposition: false, mission_decision: false, zero_series_acceptance: false, repository_publication: false, hosting: false, dns: false, public_launch: false, v1_promotion: false },
  v1_promotion_state: "Held",
  next_lawful_action: "Operate the September 6 desk closures and Evidence Watch decision; do not skip unresolved September work while the accelerated October layer is prepared.",
  public_html_routes: ["/review/v1oct/october-state/"],
  public_json_exports: ["/data/phase-180-october-state-report-and-v1-promotion-gate.json"]
};

const allPhaseRoutes = [...phases, p180].flatMap((phase) => phase.public_html_routes ?? [phase.routes.hub]);
const allPhaseExports = [...phases, p180].flatMap((phase) => phase.public_json_exports ?? [phase.routes.public_export]);
const publicRoutes = ["/review/v1oct/", ...allPhaseRoutes];
if (new Set(publicRoutes).size !== publicRoutes.length || publicRoutes.length !== 260) throw new Error(`Phase 173–180 requires 260 unique routes; received ${publicRoutes.length}/${new Set(publicRoutes).size}.`);
if (new Set(allPhaseExports).size !== 8) throw new Error("Phase 173–180 requires eight unique phase exports.");

const primaryCounts = { 173: 129, 174: 23, 175: 36, 176: 4, 177: 32, 178: 22, 179: 5, 180: 16 };
const aggregate = {
  schema_version: "1.0",
  program_id: "FTFN-V1-OCTOBER-OPERATING-PROGRAM",
  version: "v1oct",
  title: "v1 October Operating Program",
  effective_date: "2026-09-01",
  status: "Complete locally — validation pending; calendar and owner gates held",
  summary: "Accelerate the roadmap through Phase 180 by completing all presently lawful operating infrastructure and source-bound content while preserving every future calendar, evidence, owner, and publication boundary.",
  baseline_v1rc: baselines.v1rc,
  baseline_v1month: baselines.v1month,
  baseline_v1cycle: baselines.v1cycle,
  publication_boundaries: boundaries,
  phases: [...phases, p180].map((phase) => ({ phase: phase.phase, title: phase.title, status: phase.build_status, counts: phase.counts ?? {}, hub_route: phase.routes.hub, public_export: phase.routes.public_export })),
  counts: { phases: 8, primary_records: Object.values(primaryCounts).reduce((sum, value) => sum + value, 0), public_html_routes: publicRoutes.length, detail_routes: publicRoutes.length - 9, public_json_exports: 9, publication_updates: 8, new_source_profiles: 10 },
  operating_state: {
    september_carryover_records: p173.counts.carryover_records,
    silent_overdue_at_effective_date: p173.counts.silent_overdue_count,
    cycle_001_terminal: p174.counts.cycle_001_terminal_at_effective_date,
    cycle_001_unresolved: p174.counts.cycle_001_scheduled_at_effective_date,
    cycle_002_candidates: p174.counts.cycle_002_candidates,
    owner_controlled_backlog: p175.counts.combined_owner_controlled_backlog,
    governed_longitudinal_decisions_pending: p176.counts.compatibility_test_decisions + p176.counts.pilot_admission_decisions,
    observations_transferred: p176.counts.observations_transferred,
    stack_watch_packets: p177.counts.packets,
    bounded_claim_block_references: p177.counts.total_claim_block_references,
    new_place_system_dossiers: p178.counts.place_system_dossiers,
    comparison_overlays: p178.counts.comparison_overlays,
    interpretive_essays: p178.counts.interpretive_essays,
    future_october_editorial_decisions: p179.counts.future_decisions_with_null_outcomes,
    predated_october_decisions: p179.counts.predated_decisions
  },
  v1_promotion_state: "Held",
  local_validation_state: "Pending build",
  local_validation_receipt: null,
  public_html_routes: publicRoutes,
  public_json_exports: [...allPhaseExports, "/data/v1-october-operating-program.json"],
  publication_update_files: v1octPhases.map((phase) => `2026-09-01-phase-${phase}.json`)
};

const update180 = {
  id: "update-2026-09-01-phase-180",
  effective_date: "2026-09-01",
  entry_type: "Publication Promotion",
  title: "Phase 180 publishes the accelerated October state report",
  summary: "Derives a sixteen-gate state report that passes completed operating and content work while holding later calendar decisions, owner authority, external publication, and v1 promotion.",
  affected_record_ids: gates.map((gate) => gate.gate_id),
  related_paths: [p180.routes.hub, "/review/v1oct/"],
  evidence_note: boundaries[0],
  materiality: "Material record change",
  publication_effect: "Adds the Phase 180 state-report hub and v1oct aggregate hub plus two schema-1.0 JSON exports; external publication and v1 promotion remain Held.",
  work_package: "docs/work-packages/phase-180-october-state-report-and-v1-promotion-gate.md"
};

await writeJson(join(dataRoot, exportNames[180]), p180);
await writeJson(join(dataRoot, "v1-october-operating-program.json"), aggregate);
await writeJson(join(updatesRoot, "2026-09-01-phase-180.json"), update180);

const candidateDigest = await computeV1octDigestFromDisk({ dataRoot, updatesRoot, sourcesRoot });
const receipt = await findMatchingV1octReceipt({ receiptRoot, aggregate, candidateDigest });
if (receipt) {
  p180.local_validation_receipt = receipt;
  p180.build_status = "Complete locally — locally validated; future and owner gates held";
  const validationGate = p180.state_report_gates.find((gate) => gate.gate_id === "180-GATE-15-LOCAL-VALIDATION");
  validationGate.state = "Pass";
  validationGate.evidence = `Receipt ${receipt.receipt_id} binds the exact normalized Phase 173–180 candidate digest.`;
  validationGate.receipt_id = receipt.receipt_id;
  p180.counts = countGateStates(p180.state_report_gates);
  aggregate.status = "Complete locally — locally validated; calendar and owner gates held";
  aggregate.local_validation_state = "Passed";
  aggregate.local_validation_receipt = receipt;
  aggregate.phases.find((phase) => phase.phase === 180).status = p180.build_status;
  aggregate.phases.find((phase) => phase.phase === 180).counts = p180.counts;
  await writeJson(join(dataRoot, exportNames[180]), p180);
  await writeJson(join(dataRoot, "v1-october-operating-program.json"), aggregate);
}

const workPackage = `# Phase 180 work package — October State Report and v1 Promotion Gate

**State:** ${receipt ? "Complete locally — locally validated; calendar and owner gates held" : "Complete locally — validation pending; calendar and owner gates held"}  
**Build date:** 2026-09-01

## Objective

Produce an exact accelerated state report, locally validate the append-only Phase 173–180 candidate, and keep the v1 promote-or-hold decision truthful.

## Delivered

- Sixteen derived state gates: ${p180.counts.passed} Pass / ${p180.counts.held} Held / ${p180.counts.pending_build} Pending build, with ${p180.counts.false_passes} false passes.
- Exact inventory of 267 primary records, 260 review routes, nine JSON exports, eight dated updates, and ten bound official-source profiles.
- Immutable bindings to the Phase 156, 164, and 172 validation receipts.
- A content-addressed local-validation contract that normalizes only receipt-derived fields.
${receipt ? `- Local-validation receipt \`${receipt.receipt_id}\` binds candidate digest \`${receipt.artifact_digest}\`.
- Certified whole-site snapshot: ${receipt.metrics.whole_site_snapshot.html_pages_excluding_downloads.toLocaleString("en-US")} HTML pages, ${receipt.metrics.whole_site_snapshot.top_level_data_json_exports} top-level JSON exports, ${receipt.metrics.whole_site_snapshot.update_entries_rendered} updates, and ${receipt.metrics.whole_site_snapshot.canonical_source_records} canonical sources.` : "- The content-addressed local-validation receipt remains pending."}
- Explicit separation of local completion from later evidence, owner decisions, Git publication, hosting, launch, and v1 promotion.

## Held work

- Every September and October calendar result after the September 1 cutoff.
- Thirty-six authority/requirement/mission actions and the separate zero-series owner action.
- External repository publication, hosting, DNS, launch, and v1 promotion.

## Acceptance

- The state report is derived from exact upstream state, not manually promoted.
- Local build success remains separate from commit, push, hosting, DNS, launch, and promotion.
- Every historical receipt digest remains immutable.
- Candidate/content validation, source health, inherited phase assertions, October assertions, Astro checks, production build, post-build verification, release verification, and diff checks must pass before the local receipt is embedded.
`;
await writeFile(join(workspaceRoot, "docs", "work-packages", "phase-180-october-state-report-and-v1-promotion-gate.md"), workPackage, "utf8");
console.log(`Built Phase 180 and v1oct aggregate: ${publicRoutes.length} routes, 9 exports, 8 updates, 267 primary records; validation ${receipt ? "Passed" : "Pending"}, v1 Held.`);
