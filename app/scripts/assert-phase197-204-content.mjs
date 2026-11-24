import { createHash } from "node:crypto";
import { access, readFile } from "node:fs/promises";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const appRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const workspaceRoot = resolve(appRoot, "..");
const dataRoot = join(appRoot, "src", "data");
const topicsRoot = join(appRoot, "src", "content", "topics");
const workPackagesRoot = join(workspaceRoot, "docs", "work-packages");
const readJson = async (path) => JSON.parse(await readFile(path, "utf8"));
const sha = (value) => createHash("sha256").update(typeof value === "string" ? value : JSON.stringify(value)).digest("hex");
const sameSet = (a, b) => a.length === b.length && new Set(a).size === new Set(b).size && a.every((item) => b.includes(item));
const failures = [];
const check = (condition, message) => { if (!condition) failures.push(message); };

const files = {
  197: "phase-197-underrepresented-region-topic-gap-closure.json",
  198: "phase-198-failure-delay-reversal-correction-casebooks.json",
  199: "phase-199-distribution-affordability-service-quality-observatory.json",
  200: "phase-200-cross-system-constraint-monographs.json",
  201: "phase-201-change-intelligence-correction-service.json",
  202: "phase-202-accessible-multilingual-low-bandwidth-editions.json",
  203: "phase-203-state-of-future-systems-2026.json",
  204: "phase-204-v1-public-reference-edition-promotion-gate.json",
};
const keys = {
  197: "gap_closure_packets",
  198: "casebook_packets",
  199: "outcome_panels",
  200: "monographs",
  201: "change_service_records",
  202: "edition_contracts",
  203: "report_package_records",
  204: "promotion_gates",
};

const phases = new Map(await Promise.all(Object.entries(files).map(async ([phase, name]) => [Number(phase), await readJson(join(dataRoot, name))])));
const [p197, p198, p199, p200, p201, p202, p203, p204] = [...phases.values()];
const [upstreamProjects, upstreamP161] = await Promise.all([
  readJson(join(dataRoot, "phase-136-named-project-chronicles.json")),
  readJson(join(dataRoot, "phase-161-stack-watch.json")),
]);
const topicNames = [
  "advanced-manufacturing", "agriculture-and-bioeconomy", "ai-for-science", "aviation", "chips-and-compute", "climate", "critical-minerals", "cybersecurity", "discovery-technologies", "energy", "finance-and-risk", "human-futures", "mobility", "policy-and-standards", "quantum", "space", "water",
];
const topics = new Map(await Promise.all(topicNames.map(async (slug) => {
  const topic = await readJson(join(topicsRoot, `${slug}.json`));
  return [topic.id, topic];
})));

const allIds = new Set();
for (const [phase, registry] of phases) {
  const records = registry[keys[phase]];
  check(registry.schema_version === "1.0" && registry.phase === phase && registry.program_id === `FTFN-PHASE-${phase}`, `Phase ${phase} identity is invalid.`);
  check(registry.effective_date === "2026-09-01" && registry.build_status === "Complete locally" && registry.record_status.includes("public release not authorized"), `Phase ${phase} overstates its date or publication state.`);
  check(Array.isArray(registry.publication_boundaries) && registry.publication_boundaries.length === 4, `Phase ${phase} lacks the shared four-part publication boundary.`);
  check(Array.isArray(records) && records.length > 0, `Phase ${phase} lacks its ${keys[phase]} array.`);
  check(registry.public_html_routes.length === records.length + 1 && new Set(registry.public_html_routes).size === registry.public_html_routes.length, `Phase ${phase} route inventory is not exact and unique.`);
  check(registry.public_json_exports.length === 1 && registry.public_json_exports[0] === `/data/${files[phase]}`, `Phase ${phase} export identity is invalid.`);
  for (const record of records) {
    const id = Object.entries(record).find(([key]) => key.endsWith("_id"))?.[1];
    check(Boolean(id), `Phase ${phase} record lacks a *_id identity.`);
    check(!allIds.has(id), `Duplicate Phase 197–204 primary ID ${id}.`);
    allIds.add(id);
    check(typeof record.route === "string" && record.route.startsWith("/review/v1reference/") && registry.public_html_routes.includes(record.route), `${id} lacks a declared v1reference route.`);
  }
  await access(join(workPackagesRoot, files[phase].replace(/\.json$/, ".md")));
  const workPackage = await readFile(join(workPackagesRoot, files[phase].replace(/\.json$/, ".md")), "utf8");
  check(workPackage.includes(`Phase ${phase} work package`) && workPackage.includes(`app/src/data/${files[phase]}`) && workPackage.includes("public release not authorized"), `Phase ${phase} work package is incomplete.`);
}

// Phase 197: exact 4 × 6 × 2 target matrix, with no invented regional entity.
const p197Matrix = new Set(p197.gap_closure_packets.map((record) => `${record.topic_id}|${record.region_id}|${record.target_entity_kind}`));
check(p197.gap_closure_packets.length === 48 && p197Matrix.size === 48, "Phase 197 must expose forty-eight unique topic/region/entity contracts.");
check(new Set(p197.gap_closure_packets.map((record) => record.topic_id)).size === 4 && new Set(p197.gap_closure_packets.map((record) => record.region_id)).size === 6, "Phase 197 topic or region coverage is incomplete.");
check(p197.gap_closure_packets.filter((record) => record.target_entity_kind === "Named project").length === 24 && p197.gap_closure_packets.filter((record) => record.target_entity_kind === "Receiving place system").length === 24, "Phase 197 project/place target split is not 24/24.");
for (const record of p197.gap_closure_packets) {
  const topic = topics.get(record.topic_id);
  check(Boolean(topic) && record.topic_name === topic.name, `${record.gap_closure_packet_id} changed its topic identity.`);
  check(record.named_entity === null && record.jurisdiction === null && record.canonical_identity_id === null && record.admission_outcome === null && record.admission_date === null, `${record.gap_closure_packet_id} invented an entity or admission.`);
  check(record.orientation_source_ids.length === 3 && record.orientation_source_ids.every((id) => topic.featured_sources.includes(id)) && record.orientation_source_role.includes("not evidence"), `${record.gap_closure_packet_id} does not preserve orientation-only source semantics.`);
  check(record.required_artifact_chain.length === 3 && record.admission_tests.length === 7 && record.stop_rule.length > 100, `${record.gap_closure_packet_id} is not an actionable acquisition contract.`);
}
check(p197.portfolio_target_contract.project_reference_target === 100 && p197.portfolio_target_contract.place_reference_target === 70 && p197.portfolio_target_contract.project_target_achieved === false && p197.portfolio_target_contract.place_target_achieved === false, "Phase 197 falsely claims target attainment or changed the 100/70 contract.");
check(p197.counts.named_entities_created === 0 && p197.counts.admissions_created === 0, "Phase 197 created an unsupported entity or admission.");

// Phase 198: one exact research packet per upstream chronicle, all classifications and outcomes null.
const projectById = new Map(upstreamProjects.project_chronicles.map((project) => [project.chronicle_id, project]));
check(p198.casebook_packets.length === 24 && new Set(p198.casebook_packets.map((record) => record.upstream_chronicle_id)).size === 24, "Phase 198 must bind all twenty-four project chronicles once.");
for (const record of p198.casebook_packets) {
  const upstream = projectById.get(record.upstream_chronicle_id);
  check(Boolean(upstream) && record.named_entity === upstream.title && record.inherited_stage === upstream.inherited_stage && record.inherited_stage_basis === upstream.stage_basis, `${record.casebook_packet_id} changed its upstream project account.`);
  check(sameSet(record.source_ids, upstream.source_ids) && sameSet(record.signal_ids, upstream.signal_ids), `${record.casebook_packet_id} changed its upstream evidence bindings.`);
  check(record.candidate_classifications.length === 4 && record.research_sections.length === 5, `${record.casebook_packet_id} lacks its taxonomy or five-part research structure.`);
  check(record.classification_decision === null && record.classification_date === null && record.confirmed_disruption === null && record.causal_attribution === null && record.correction_status === null && record.realized_outcome === null, `${record.casebook_packet_id} invented an adverse-event decision, cause, correction, or outcome.`);
  check(record.exact_next_artifact === upstream.exact_next_artifact && record.stop_rule.includes(upstream.stop_rule), `${record.casebook_packet_id} weakened its upstream next-artifact or stop rule.`);
}
check(p198.counts.classification_decisions === 0 && p198.counts.causal_attributions === 0 && p198.counts.correction_outcomes === 0, "Phase 198 count semantics overstate completed casebook decisions.");

// Phase 199: context is exact, but every outcome schema remains empty until admission.
const packetById = new Map(upstreamP161.stack_watch_packets.map((packet) => [packet.stack_watch_packet_id, packet]));
const familyCounts = Object.groupBy(p199.outcome_panels, (record) => record.measure_family_id);
check(p199.outcome_panels.length === 24 && Object.keys(familyCounts).length === 3 && Object.values(familyCounts).every((records) => records.length === 8), "Phase 199 must expose eight panels in each of three measure families.");
for (const record of p199.outcome_panels) {
  const upstream = packetById.get(record.upstream_packet_id);
  const claim = upstream?.claim_blocks.find((item) => item.claim_block_id === record.source_bound_context.claim_block_id);
  check(Boolean(upstream) && sameSet(record.source_ids, upstream.source_ids), `${record.outcome_panel_id} changed its Stack Watch source identity.`);
  check(Boolean(claim) && claim.text === record.source_bound_context.text && claim.source_semantic_digest === record.source_bound_context.source_semantic_digest, `${record.outcome_panel_id} changed its source-bound context claim.`);
  check(record.source_bound_context.role.includes("not an observation"), `${record.outcome_panel_id} misrepresents context as an observation.`);
  check([record.entity, record.observation_period, record.numerator, record.denominator, record.unit, record.method, record.outcome_value, record.attribution, record.compatibility_decision].every((value) => value === null) && record.admitted_observations.length === 0, `${record.outcome_panel_id} fabricated an outcome value or compatibility decision.`);
  check(record.required_fields.length === 5 && record.exact_next_artifact.length > 120, `${record.outcome_panel_id} lacks a precise measurement contract.`);
}
check(p199.counts.admitted_observations === 0 && p199.counts.non_null_outcome_values === 0 && p199.counts.compatibility_decisions === 0, "Phase 199 count semantics overstate the outcome shelf.");

// Phase 200: every monograph uses two exact packet contexts and makes no causal or scored claim.
check(p200.monographs.length === 12 && new Set(p200.monographs.flatMap((record) => record.upstream_packet_ids)).size === 24, "Phase 200 must use all twenty-four Stack Watch packets once across twelve monographs.");
for (const record of p200.monographs) {
  const upstreamPackets = record.upstream_packet_ids.map((id) => packetById.get(id));
  check(upstreamPackets.every(Boolean) && record.source_context.length === 2 && record.sections.length === 5, `${record.monograph_id} lacks two exact contexts or five substantive sections.`);
  check(sameSet(record.source_ids, [...new Set(upstreamPackets.flatMap((packet) => packet.source_ids))]), `${record.monograph_id} source inventory does not equal its two upstream packets.`);
  check(record.source_context.every((context) => {
    const packet = packetById.get(context.packet_id);
    const claim = packet?.claim_blocks.find((item) => item.claim_block_id === context.claim_block_id);
    return claim && claim.text === context.text && claim.source_semantic_digest === context.source_semantic_digest;
  }), `${record.monograph_id} changed a source-context claim.`);
  check(record.sections.every((section) => section.text.length > 130), `${record.monograph_id} contains a thin section.`);
  check(record.causal_finding === null && record.comparative_score === null && record.outcome_claim === null, `${record.monograph_id} invented causality, a score, or an outcome.`);
}
check(p200.counts.monographs === 12 && p200.counts.chapter_sections === 60 && p200.counts.source_context_blocks === 24 && p200.counts.causal_findings === 0, "Phase 200 counts are invalid.");

// Phase 201: complete 17-topic service coverage and ordered correction workflow, no invented current decision.
check(p201.change_service_records.length === 17 && new Set(p201.change_service_records.map((record) => record.topic_id)).size === 17, "Phase 201 must provide one desk for every topic.");
check(p201.workflow_stages.length === 8 && p201.workflow_stages.every((stage, index) => stage.sequence === index + 1 && stage.workflow_stage_id === `201-WORKFLOW-${String(index + 1).padStart(2, "0")}`), "Phase 201 workflow order is invalid.");
for (const record of p201.change_service_records) {
  const topic = topics.get(record.topic_id);
  check(Boolean(topic) && sameSet(record.source_ids, topic.featured_sources), `${record.change_service_record_id} changed its topic source shelf.`);
  check(record.workflow_stage_ids.length === 8 && record.intake_triggers.length === 5, `${record.change_service_record_id} lacks complete workflow or triggers.`);
  check(record.current_change === null && record.current_correction_decision === null && record.decision_date === null && record.receipt_id === null && record.open_correction_count === 0, `${record.change_service_record_id} invented a correction.`);
}
check(p201.counts.open_corrections === 0 && p201.counts.correction_decisions === 0 && p201.correction_decisions.length === 0, "Phase 201 overstates active corrections.");

// Phase 202: four specification modes per topic, no rendered or machine-passed-off translation.
const modesByTopic = Object.groupBy(p202.edition_contracts, (record) => record.topic_id);
const translations = p202.edition_contracts.filter((record) => record.is_translation);
check(p202.edition_contracts.length === 68 && Object.keys(modesByTopic).length === 17 && Object.values(modesByTopic).every((records) => records.length === 4), "Phase 202 must expose four edition contracts for each of seventeen topics.");
check(translations.length === 34 && translations.filter((record) => record.target_language === "French").length === 17 && translations.filter((record) => record.target_language === "Spanish").length === 17, "Phase 202 French/Spanish contract split is invalid.");
for (const record of p202.edition_contracts) {
  const topic = topics.get(record.topic_id);
  check(Boolean(topic) && record.source_ids.every((id) => topic.featured_sources.includes(id)) && record.source_ids.length === 3, `${record.edition_contract_id} lacks exact topic-source bindings.`);
  check(record.requirements.length === 5 && record.accessibility_baseline.length === 8, `${record.edition_contract_id} lacks its edition or accessibility contract.`);
  check(record.rendered_content === null && record.translated_content === null && record.human_editor === null && record.subject_reviewer === null && record.review_date === null && record.approval_receipt_id === null && record.publication_state === "Held", `${record.edition_contract_id} overstates a rendered, reviewed, or published edition.`);
  if (record.is_translation) check(record.state.startsWith("Held — qualified human translation"), `${record.edition_contract_id} does not hold translation for human review.`);
}
check(p202.counts.translation_contracts_held === 34 && p202.counts.rendered_editions === 0 && p202.counts.approved_translations === 0, "Phase 202 counts overstate edition completion.");

// Phase 203: exact report architecture and source-bound editorial records.
const reportKinds = Object.groupBy(p203.report_package_records, (record) => record.record_kind);
check(p203.report_package_records.length === 58 && reportKinds["Topic chapter"]?.length === 17 && reportKinds["Cross-system finding"]?.length === 12 && reportKinds["Named case profile"]?.length === 24 && reportKinds["Method appendix"]?.length === 5, "Phase 203 report architecture is not 17 + 12 + 24 + 5.");
check(p203.report_package_records.every((record) => Array.isArray(record.source_ids) && record.source_ids.length > 0), "A Phase 203 report record is not source-bound.");
for (const chapter of reportKinds["Topic chapter"]) {
  const topic = topics.get(chapter.topic_id);
  check(Boolean(topic) && sameSet(chapter.source_ids, topic.featured_sources) && chapter.sections.length === 4 && chapter.sections[0].text === topic.summary, `${chapter.report_record_id} changed its canonical topic account.`);
  check(chapter.outcome_claim === null && chapter.score_or_rank === null, `${chapter.report_record_id} invented an outcome or rank.`);
}
for (const finding of reportKinds["Cross-system finding"]) {
  const monograph = p200.monographs.find((record) => record.monograph_id === finding.upstream_monograph_id);
  check(Boolean(monograph) && sameSet(finding.source_ids, monograph.source_ids) && finding.sections.length === 5 && finding.causal_finding === null && finding.comparative_score === null, `${finding.report_record_id} changed or overstated its monograph.`);
}
for (const profile of reportKinds["Named case profile"]) {
  const casebook = p198.casebook_packets.find((record) => record.casebook_packet_id === profile.upstream_casebook_packet_id);
  check(Boolean(casebook) && sameSet(profile.source_ids, casebook.source_ids) && profile.inherited_stage === casebook.inherited_stage && profile.classification_decision === null && profile.realized_outcome === null, `${profile.report_record_id} changed or overstated its named case.`);
}
check(p203.report_state.includes("expert review") && p203.report_state.includes("public release held") && p203.counts.causal_findings === 0 && p203.counts.scores_or_ranks === 0, "Phase 203 overstates review or findings.");

// Phase 204: candidate digest is exact and all mandatory external authorities remain held.
const expectedDigest = sha({ 197: p197, 198: p198, 199: p199, 200: p200, 201: p201, 202: p202, 203: p203 });
check(p204.candidate_digest === expectedDigest && p204.local_validation_receipt.artifact_digest === expectedDigest && p204.local_validation_receipt.receipt_id === `204-LOCAL-VALIDATION-2026-09-01-${expectedDigest.slice(0, 12)}`, "Phase 204 validation receipt does not bind the exact Phase 197–203 candidate.");
const passGates = p204.promotion_gates.filter((gate) => gate.state === "Pass");
const heldGates = p204.promotion_gates.filter((gate) => gate.state === "Held");
check(p204.promotion_gates.length === 16 && passGates.length === 9 && heldGates.length === 7 && p204.counts.passed === 9 && p204.counts.held === 7 && p204.counts.false_passes === 0, "Phase 204 gate counts are not 9 Pass / 7 Held / 0 false passes.");
check(passGates.every((gate) => gate.derived_pass === true) && heldGates.every((gate) => gate.derived_pass === false && gate.next_action), "Phase 204 has a false pass or an unbounded hold.");
check(p204.v1_public_reference_promotion_state === "Held" && Object.values(p204.owner_authority).every((value) => value === false), "Phase 204 invents v1 promotion or owner authority.");
check(heldGates.some((gate) => gate.promotion_gate_id.endsWith("PORTFOLIO-TARGETS")) && heldGates.some((gate) => gate.promotion_gate_id.endsWith("TRANSLATION-REVIEW")) && heldGates.some((gate) => gate.promotion_gate_id.endsWith("GIT-HOSTING-DNS")) && heldGates.some((gate) => gate.promotion_gate_id.endsWith("V1-PROMOTION")), "Phase 204 is missing a mandatory target, translation, delivery, or promotion hold.");

check(allIds.size === 267, `Expected 267 unique primary records across Phases 197–204; found ${allIds.size}.`);

if (failures.length) throw new Error(`Phase 197–204 assertions failed:\n- ${failures.join("\n- ")}`);
console.log(`Phase 197–204 assertions passed: 267 unique primary records, 48 gap contracts, 24 casebooks, 24 null-outcome panels, 12 monographs, 17 correction desks, 68 held edition contracts, 58 report records, and 9 Pass / 7 Held with v1 Held.`);
