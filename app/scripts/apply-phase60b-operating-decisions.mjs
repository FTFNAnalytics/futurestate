import { readFile, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

const appRoot = fileURLToPath(new URL("..", import.meta.url));
const pathFor = (...parts) => join(appRoot, ...parts);
const readJson = async (...parts) => JSON.parse(await readFile(pathFor(...parts), "utf8"));
const writeJson = async (record, ...parts) => writeFile(pathFor(...parts), `${JSON.stringify(record, null, 2)}\n`, "utf8");
const readText = async (...parts) => readFile(pathFor(...parts), "utf8");
const writeText = async (text, ...parts) => writeFile(pathFor(...parts), text, "utf8");
const expect = (condition, message) => { if (!condition) throw new Error(message); };
const appendUnique = (records, value) => { if (!records.includes(value)) records.push(value); };

async function updateText(parts, replacements, heading, body) {
  let text = await readText(...parts);
  for (const [before, after] of replacements) {
    if (text.includes(before)) text = text.replace(before, after);
  }
  if (!text.includes(`## ${heading}`)) text = `${text.trimEnd()}\n\n## ${heading}\n\n${body.trim()}\n`;
  await writeText(text, ...parts);
}

const darpaReceiptId = "receipt-60-darpa-2026-08-23-results";
const slfReceiptId = "receipt-60-slf-2026-08-15-no-material-change";
const updateId = "update-2026-08-23-phase-60b-evidence-decisions";

const receipts = await readJson("src", "data", "phase-58-change-receipts.json");
receipts.captured_date = "2026-08-23";
receipts.receipts = receipts.receipts.filter((record) => ![darpaReceiptId, slfReceiptId].includes(record.receipt_id));
receipts.receipts.push(
  {
    receipt_id: darpaReceiptId,
    receipt_type: "Change Note",
    source_checked_date: "2026-08-23",
    decision_date: "2026-08-23",
    affected_record_ids: [
      "source-darpa-lift-challenge-2026",
      "signal-darpa-lift-challenge-2026-scheduled-field-trial"
    ],
    prior_state: "The DARPA Lift Challenge signal was In Review at the named-performer and dated-field-trial stage pending an official measured-results artifact.",
    current_state: "The signal is Published at the official measured competition-result and prize-decision stage.",
    bounded_finding: "DARPA's August 11 official results identify AVIDrone at 3.84:1, MTech Operations at 3.64:1, and Xtreme Aerial Concepts at 3.45:1 in the objective category and publish the objective and subjective prize decisions.",
    evidence_boundary: "The result establishes official competition measurements, winners, and prizes. It does not establish achievement of the 4:1 objective, certified service, production scale, recurring operation, military or commercial deployment, or a comparable operating outcome; it cannot transfer to the Waymo California named file.",
    publication_effect: "Promote the existing DARPA signal to Published at the measured-result stage and propagate the bounded result through its assigned reader surfaces without creating a new source, signal, named-file event, score, ranking, or operating-outcome claim.",
    next_check_date: "2026-09-23"
  },
  {
    receipt_id: slfReceiptId,
    receipt_type: "No Material Change",
    source_checked_date: "2026-08-15",
    decision_date: "2026-08-15",
    affected_record_ids: [
      "source-faa-shuttle-landing-facility-license",
      "signal-shuttle-landing-facility-license-status-watch",
      "gap-013",
      "61-PROJECT-SPACE-COAST-AUTHORITY"
    ],
    prior_state: "The Shuttle Landing Facility licence signal was In Review because the public FAA record displayed January 15, 2026 as the expiration date without a later formal disposition.",
    current_state: "The signal and Space Coast named file remain In Review and unchanged; the August 15 source check is recorded as a bounded dated hold.",
    bounded_finding: "The FAA Shuttle Landing Facility page, June 15 spaceport inventory, and linked LRSO 18-018 licence reviewed on August 15 still display the January 15, 2026 expiration or the 2021 revision and do not supply a later formal renewal, replacement, lapse, surrender, or other disposition.",
    evidence_boundary: "The checked FAA surfaces do not establish that a disposition does not exist. NASA facility management, infrastructure, environmental review, operator applications, missions, and utilization cannot substitute for the formal site-licence disposition.",
    publication_effect: "Publish the dated no-material-change receipt, retain the signal and named file at their prior stages, and set a bounded recheck without inferring renewal, lapse, current authorization, operation, closure, or utilization.",
    next_check_date: "2026-09-15"
  }
);
await writeJson(receipts, "src", "data", "phase-58-change-receipts.json");

const queue = await readJson("src", "data", "phase-58-dated-evidence-queue.json");
const darpaQueue = queue.records.find((record) => record.queue_id === "58-QUEUE-DARPA-RESULTS");
expect(darpaQueue, "The Phase 58 DARPA queue record is missing.");
Object.assign(darpaQueue, {
  underlying_signal_status: "Published",
  source_url: "https://www.darpa.mil/news/2026/lift-challenge-awards",
  last_checked_date: "2026-08-23",
  next_check_date: "2026-09-23",
  review_cadence_days: 30,
  current_decision: "material_change",
  latest_receipt_id: darpaReceiptId,
  bounded_finding: "DARPA's official results publish measured objective-category ratios, winners, and prize decisions; no official score reached the 4:1 target.",
  stop_rule: "Do not extend the measured competition result into certification, production, procurement, service, recurring operation, operating outcomes, or the unrelated Waymo California named file without separate exact evidence."
});
queue.last_operated_date = "2026-08-23";
await writeJson(queue, "src", "data", "phase-58-dated-evidence-queue.json");

const cycle = await readJson("src", "data", "phase-60-operating-cycle.json");
const cycleById = new Map(cycle.records.map((record) => [record.cycle_item_id, record]));
const darpaCycle = cycleById.get("60-CYCLE-DARPA-RESULTS");
const slfCycle = cycleById.get("60-CYCLE-SPACE-COAST-SLF-LICENCE");
expect(darpaCycle && slfCycle, "Phase 60 Wave 60B records are missing.");
Object.assign(darpaCycle, {
  decision_status: "material_change",
  decision_date: "2026-08-23",
  source_checked_date: "2026-08-23",
  receipt_type: "Change Note",
  receipt_id: darpaReceiptId,
  propagation_status: "complete",
  next_check_date: "2026-09-23"
});
Object.assign(slfCycle, {
  decision_status: "no_material_change",
  decision_date: "2026-08-15",
  source_checked_date: "2026-08-15",
  receipt_type: "No Material Change",
  receipt_id: slfReceiptId,
  propagation_status: "complete",
  next_check_date: "2026-09-15"
});
cycle.cycle_status = "wave_60b_complete_wave_60c_scheduled";
cycle.operating_measures.completed_cycle_decisions = 2;
cycle.operating_measures.underlying_signal_promotions = 1;
cycle.operating_measures.silent_overdue_count = 0;
cycle.last_operated_date = "2026-08-23";
await writeJson(cycle, "src", "data", "phase-60-operating-cycle.json");

const propagation = await readJson("src", "data", "phase-60-propagation-contract.json");
propagation.last_operated_date = "2026-08-23";
propagation.cycle_decision_proofs = [
  {
    proof_id: "60-PROP-DARPA-2026-08-23",
    cycle_item_id: "60-CYCLE-DARPA-RESULTS",
    receipt_id: darpaReceiptId,
    source_id: "source-darpa-lift-challenge-2026",
    signal_id: "signal-darpa-lift-challenge-2026-scheduled-field-trial",
    signal_decision: "promote_to_published_measured_result",
    canonical_dossier_ids: [
      "briefing-adoption-003-autonomy-evtol",
      "briefing-outcomes-watch-001-what-actually-changed",
      "briefing-evidence-cycle-001-operating-baseline"
    ],
    reader_pathway_ids: ["reader-pathway-autonomy-regulation-to-service"],
    dependency_map_ids: ["dependency-map-technology-adoption-is-not-operating-outcome"],
    local_system_ids: [],
    named_file_ids: [],
    update_id: updateId,
    next_check_date: "2026-09-23",
    propagation_status: "complete",
    bounded_result: "Official measured competition results and prize decisions publish; no evidence transfers to Waymo or to an operating-outcome stage."
  },
  {
    proof_id: "60-PROP-SLF-2026-08-15",
    cycle_item_id: "60-CYCLE-SPACE-COAST-SLF-LICENCE",
    receipt_id: slfReceiptId,
    source_id: "source-faa-shuttle-landing-facility-license",
    signal_id: "signal-shuttle-landing-facility-license-status-watch",
    signal_decision: "retain_in_review_no_material_change",
    canonical_dossier_ids: [
      "briefing-local-conversion-004-space-coast",
      "briefing-project-conversion-004-space-coast-authority",
      "briefing-outcomes-watch-001-what-actually-changed",
      "briefing-evidence-cycle-001-operating-baseline"
    ],
    reader_pathway_ids: ["reader-pathway-space-coast-plan-to-mission"],
    dependency_map_ids: ["dependency-map-local-authorization-is-not-operation"],
    local_system_ids: ["local-florida-space-coast-launch-corridor"],
    named_file_ids: ["61-PROJECT-SPACE-COAST-AUTHORITY"],
    update_id: updateId,
    next_check_date: "2026-09-15",
    propagation_status: "complete",
    bounded_result: "The formal site-licence disposition remains unresolved; no named-file stage, matrix cell, mission, operation, or utilization state changes."
  }
];
await writeJson(propagation, "src", "data", "phase-60-propagation-contract.json");

const registry = await readJson("src", "data", "phase-61-project-conversion-registry.json");
const spaceCoast = registry.records.find((record) => record.file_id === "61-PROJECT-SPACE-COAST-AUTHORITY");
expect(spaceCoast, "The Phase 61 Space Coast named file is missing.");
spaceCoast.established = "LC-39A and SLC-40 have final environmental decisions; the August 15 FAA check leaves the Shuttle Landing Facility public licence disposition unresolved under a bounded No Material Change receipt.";
spaceCoast.next_check_date = "2026-09-15";
spaceCoast.latest_decision_date = "2026-08-15";
spaceCoast.latest_receipt_id = slfReceiptId;
spaceCoast.latest_decision_status = "no_material_change";
registry.last_operated_date = "2026-08-23";
await writeJson(registry, "src", "data", "phase-61-project-conversion-registry.json");

const gap = await readJson("src", "content", "evidence-gaps", "gap-013.json");
gap.latest_review.receipt_id = slfReceiptId;
gap.latest_review.next_check_date = "2026-09-15";
await writeJson(gap, "src", "content", "evidence-gaps", "gap-013.json");

const returns = await readJson("src", "data", "phase-67-evidence-return-envelope-ledger.json");
const returnByCycle = new Map(returns.envelope_records.map((record) => [record.cycle_item_id, record]));
const darpaReturn = returnByCycle.get("60-CYCLE-DARPA-RESULTS");
const slfReturn = returnByCycle.get("60-CYCLE-SPACE-COAST-SLF-LICENCE");
expect(darpaReturn && slfReturn, "Phase 67 Wave 60B return envelopes are missing.");
Object.assign(darpaReturn, {
  envelope_state: "Release Verified",
  attempted_surfaces: [
    "https://www.darpa.mil/news/2026/lift-challenge-awards",
    "https://www.darpa.mil/research/programs/lift"
  ],
  access_result: "Exact official results artifact found with measured objective-category ratios, winners, and prize decisions.",
  receipt_type: "Change Note",
  receipt_id: darpaReceiptId,
  decision_date: "2026-08-23",
  decision_status: "material_change",
  propagation_status: "complete",
  next_check_date: "2026-09-23"
});
Object.assign(slfReturn, {
  envelope_state: "Release Verified",
  attempted_surfaces: [
    "https://www.faa.gov/space/stakeholder_engagement/shuttle_landing_facility",
    "https://www.faa.gov/space/spaceports_by_state",
    "https://www.faa.gov/media/69216"
  ],
  access_result: "Official FAA surfaces remained accessible but supplied no later formal disposition beyond the displayed January 15, 2026 expiration or the 2021 licence revision.",
  receipt_type: "No Material Change",
  receipt_id: slfReceiptId,
  decision_date: "2026-08-15",
  decision_status: "no_material_change",
  propagation_status: "complete",
  next_check_date: "2026-09-15"
});
returns.as_of_date = "2026-08-23";
returns.operational_status = "Wave 60B Complete; Wave 60C Scheduled";
returns.metrics.receipts_created = 2;
returns.metrics.decisions_completed = 2;
returns.metrics.propagation_completed = 2;
await writeJson(returns, "src", "data", "phase-67-evidence-return-envelope-ledger.json");

const packets = await readJson("src", "data", "phase-67-qualification-packet-registry.json");
packets.as_of_date = "2026-08-23";
packets.operational_status = "Wave 60B Receipts Recorded; Qualification Packets Awaiting File Evidence";
packets.last_operated_date = "2026-08-23";
for (const packet of packets.packet_records.filter((record) => record.file_id === "61-PROJECT-SPACE-COAST-AUTHORITY")) {
  packet.next_check_date = "2026-09-15";
}
await writeJson(packets, "src", "data", "phase-67-qualification-packet-registry.json");

const autonomyPathway = await readJson("src", "content", "reader-pathways", "autonomy-regulation-to-service.json");
appendUnique(autonomyPathway.current_state, `Phase 60B Change Note ${darpaReceiptId} publishes DARPA's measured Lift Challenge results and prize decisions while preserving the boundary to certification, production, service, recurring operation, outcomes, and the unrelated Waymo named file.`);
autonomyPathway.next_records = autonomyPathway.next_records.filter((item) => !item.startsWith("DARPA's dated final-results artifact"));
appendUnique(autonomyPathway.next_records, "Official DARPA maturation, transition, production, certification, procurement, or operational records after the bounded Lift Challenge result.");
await writeJson(autonomyPathway, "src", "content", "reader-pathways", "autonomy-regulation-to-service.json");

const spacePathway = await readJson("src", "content", "reader-pathways", "space-coast-plan-to-mission.json");
appendUnique(spacePathway.current_state, `Phase 60B No Material Change receipt ${slfReceiptId} records the August 15 FAA recheck without assigning renewal, lapse, current authorization, mission, operation, or utilization.`);
spacePathway.next_records = spacePathway.next_records.filter((item) => item !== "Formal FAA disposition of the Shuttle Landing Facility license.");
spacePathway.next_records.unshift("Formal FAA disposition of the Shuttle Landing Facility licence after the bounded August 15 hold.");
await writeJson(spacePathway, "src", "content", "reader-pathways", "space-coast-plan-to-mission.json");

const adoptionMap = await readJson("src", "content", "dependency-maps", "technology-adoption-is-not-operating-outcome.json");
appendUnique(adoptionMap.what_this_map_supports, `Phase 60B receipt ${darpaReceiptId} closes the measured competition-result gate while leaving maturation, certification, production, service, recurring operation, and outcomes open.`);
await writeJson(adoptionMap, "src", "content", "dependency-maps", "technology-adoption-is-not-operating-outcome.json");

const authorizationMap = await readJson("src", "content", "dependency-maps", "local-authorization-is-not-operation.json");
appendUnique(authorizationMap.what_this_map_supports, `Phase 60B receipt ${slfReceiptId} records a completed formal-source check without converting an unchanged licence display into renewal, lapse, current authority, mission, operation, or utilization.`);
await writeJson(authorizationMap, "src", "content", "dependency-maps", "local-authorization-is-not-operation.json");

await updateText(
  ["src", "content", "briefings", "briefing-evidence-cycle-001-operating-baseline.mdx"],
  [
    ['summary: "The first recurring evidence-cycle digest establishes thirteen dated gates, the no-silent-overdue rule, the evidence-to-decision propagation contract, and the bounded August 11 DARPA proof without claiming future results."', 'summary: "Evidence Cycle 001 now records two complete Wave 60B decisions: DARPA measured results under a bounded Change Note and the unresolved Shuttle Landing Facility disposition under a bounded No Material Change receipt."'],
    ["last_reviewed_date: 2026-08-11", "last_reviewed_date: 2026-08-23"],
    ['  - "The August 11 DARPA No Material Change receipt is the first complete propagation proof across source, signal decision, adoption dossier, pathway, dependency map, Outcomes Watch, digest, and update log."', '  - "Wave 60B closes with two fully propagated receipts: one bounded DARPA result promotion and one unchanged Shuttle Landing Facility licence hold."'],
    ['  - "DARPA measured results on August 14 and the Shuttle Landing Facility licence disposition on August 15"', '  - "Louisiana Starlink adoption on September 1; the Shuttle Landing Facility formal disposition recheck on September 15"'],
    ["Every future item remains scheduled. Phase 60 does not claim an August 14 result, an August 15 licence disposition, September adoption or acceptance, or October reliability and recurring-output evidence before those dated checks occur. It creates no new source, signal, promotion, gap resolution, score, ranking, or operating-outcome conclusion.", "Wave 60B now has two dated decisions and complete propagation. The eleven Wave 60C-60D items remain scheduled; Phase 60 does not claim September adoption or acceptance, October reliability, or recurring-output evidence before those checks occur. The DARPA result changes one existing signal at the measured competition-result stage; the Shuttle Landing Facility decision changes no signal or named-file stage. Neither receipt creates a score, ranking, or operating-outcome conclusion."]
  ],
  "Wave 60B decisions",
  `- **DARPA Lift Challenge — Change Note ${darpaReceiptId}.** DARPA's official August 11 release supplies measured objective-category ratios, winners, and prize decisions. The existing signal advances to Published at that exact stage. The result does not establish the 4:1 objective was achieved, certification, production, service, repeat operation, or outcomes, and it does not transfer to Waymo.\n- **Shuttle Landing Facility — No Material Change ${slfReceiptId}.** The August 15 FAA check supplied no later formal disposition beyond the displayed January 15, 2026 expiration or the 2021 licence revision. The signal and Space Coast named file remain unchanged; the next bounded recheck is September 15.\n\nBoth decisions propagate through their assigned source, signal decision, dossiers, pathways, maps, Outcomes Watch, this digest, update log, and applicable gap, local system, and named file. The remaining eleven cycle items stay scheduled.`
);

await updateText(
  ["src", "content", "briefings", "briefing-outcomes-watch-001-what-actually-changed.mdx"],
  [
    ['summary: "The canonical reader guide to the ten Phase 58 result gates, the four receipt types, the first bounded no-change decision, and the dated artifacts that can change the public record."', 'summary: "The canonical reader guide now records the first material result return: DARPA measured performance and prizes, plus the separate bounded Shuttle Landing Facility licence hold."'],
    ["last_reviewed_date: 2026-08-11", "last_reviewed_date: 2026-08-23"],
    ['  - "The first DARPA check changed source freshness and produced a No Material Change receipt without promoting the held result signal."', '  - "DARPA now has an official measured result and prize decisions; the Shuttle Landing Facility formal licence disposition remains unresolved under a separate bounded receipt."'],
    ['  - "DARPA measured results on the August 14 check"', '  - "DARPA maturation and transition evidence after the measured result"'],
    ["All ten underlying outcome signals remain In Review. The August 11 DARPA check is the only completed Phase 58 receipt at this checkpoint. It found no official measured-results artifact on the reviewed canonical surfaces, advanced source freshness, and retained the signal. That bounded finding does not say that results do not exist.", "Nine of the ten inherited outcome signals remain In Review. DARPA's official result now supports a Published measured competition result and prize decision, while remaining upstream of certification, production, service, recurring operation, and operating outcomes. The Shuttle Landing Facility licence signal also remains In Review after its separate August 15 bounded source check."],
    ["Every future gate remains scheduled until its dated check occurs.", "Wave 60B has two complete decisions; the eleven Wave 60C-60D gates remain scheduled until their dated checks occur."]
  ],
  "Wave 60B result and hold",
  `Receipt ${darpaReceiptId} closes the exact DARPA results gate using the official measured ratios, winners, and prize decisions. Receipt ${slfReceiptId} records a completed FAA source check but retains the Shuttle Landing Facility licence hold because no later formal disposition was supplied on the reviewed surfaces. These decisions are independent: the DARPA result cannot move Waymo, and the unchanged site-licence record cannot move the Space Coast file, its matrix cells, or any operating-outcome claim.`
);

await updateText(
  ["src", "content", "briefings", "briefing-adoption-003-autonomy-evtol.mdx"],
  [
    ["last_reviewed_date: 2026-08-11", "last_reviewed_date: 2026-08-23"],
    ['  - "DARPA\'s August 11 no-change receipt demonstrates that a completed field event remains upstream of an official measured-results artifact."', '  - "DARPA\'s official measured result closes the competition gate while remaining upstream of certification, production, service, recurring operation, and outcomes."'],
    ['  - "DARPA\'s dated final results, measured team performance, winners, and prize decisions on the August 14 gate"', '  - "DARPA maturation, transition, manufacturing, certification, and operational evidence after the official measured result"']
  ],
  "Phase 60B measured-result decision",
  `Change Note ${darpaReceiptId} publishes the official competition result at its exact scope: AVIDrone 3.84:1, MTech Operations 3.64:1, Xtreme Aerial Concepts 3.45:1, and the named objective and subjective prize decisions. DARPA states that no official score reached 4:1. This closes the measured-result gate but does not establish certification, manufacturing scale, procurement, service, recurring operation, or an operating outcome. The result has no identity or stage transfer to the Waymo California file.`
);

await updateText(
  ["src", "content", "briefings", "briefing-local-conversion-004-space-coast.mdx"],
  [
    ["last_reviewed_date: 2026-08-11", "last_reviewed_date: 2026-08-23"],
    ['  - "Formal Shuttle Landing Facility licence disposition and operator-specific Part 450 actions"', '  - "Formal Shuttle Landing Facility licence disposition after the August 15 bounded hold, plus operator-specific Part 450 actions"']
  ],
  "Phase 60B Shuttle Landing Facility receipt",
  `No Material Change receipt ${slfReceiptId} records the August 15 FAA page, inventory, and linked LRSO 18-018 licence check. The reviewed surfaces still supplied the January 15, 2026 displayed expiration or the 2021 revision, not a later formal renewal, replacement, lapse, surrender, or other disposition. The source check is complete; the licence conclusion is not. No site, operator, mission, infrastructure, operation, utilization, or outcome stage advances.`
);

await updateText(
  ["src", "content", "briefings", "briefing-project-conversion-004-space-coast-authority.mdx"],
  [
    ["last_reviewed_date: 2026-08-11", "last_reviewed_date: 2026-08-23"],
    ['  - "The Shuttle Landing Facility needs a formal current licence disposition."', '  - "The August 15 bounded FAA recheck leaves the Shuttle Landing Facility formal licence disposition unresolved."'],
    ['what_to_watch_next: ["August 15 licence disposition", "Operator-specific authority and accepted assets", "Mission use, utilization, delays, safety, and repeat performance"]', 'what_to_watch_next: ["September 15 formal licence-disposition recheck", "Operator-specific authority and accepted assets", "Mission use, utilization, delays, safety, and repeat performance"]'],
    ["LC-39A and SLC-40 have final environmental decisions. The public Shuttle Landing Facility licence display remains unresolved. These records belong to separate sites and authority layers; they do not create a single readiness state.", "LC-39A and SLC-40 have final environmental decisions. The August 15 FAA check leaves the public Shuttle Landing Facility licence disposition unresolved under No Material Change receipt receipt-60-slf-2026-08-15-no-material-change. These records belong to separate sites and authority layers; they do not create a single readiness state."],
    ["The first dated gate is the August 15 Shuttle Landing Facility check. Later evidence should name operator authority, accepted construction, service start, completed missions, range use, delay and safety definitions, and repeat performance.", "The August 15 Shuttle Landing Facility gate has a completed bounded receipt but no formal disposition. The next recheck is September 15. Later evidence should name operator authority, accepted construction, service start, completed missions, range use, delay and safety definitions, and repeat performance."]
  ],
  "Phase 60B named-file decision",
  `Receipt ${slfReceiptId} appends a completed no-material-change decision to this file without changing its stage. The formal FAA site-licence disposition remains the exact next artifact. Adjacent infrastructure, operator applications, environmental records, missions, or utilization cannot answer that gate, and none of the four Phase 64 downstream cells advances.`
);

await updateText(
  ["src", "content", "local-systems", "local-florida-space-coast-launch-corridor.mdx"],
  [["last_reviewed_date: 2026-08-11", "last_reviewed_date: 2026-08-23"]],
  "Phase 60B licence decision",
  `No Material Change receipt ${slfReceiptId} records the August 15 FAA recheck. The official pages and linked licence still did not supply a later formal disposition. The local system therefore retains the same missing-data item and all site-licence, operator, mission, infrastructure, operation, utilization, and outcome boundaries. The next bounded formal-disposition recheck is September 15.`
);

await updateText(
  ["src", "content", "briefings", "briefing-evidence-return-control-room-001.mdx"],
  [],
  "Wave 60B operating result",
  `Wave 60B is complete under two independent receipts. ${darpaReceiptId} records the official DARPA measured result and prize decisions with no Waymo transfer. ${slfReceiptId} records a bounded FAA no-material-change check, retains the Space Coast named-file stage, and schedules the next formal-disposition recheck for September 15. Eleven return envelopes remain scheduled.`
);

console.log(`Phase 60B operating decisions applied: ${darpaReceiptId} and ${slfReceiptId}; two receipts complete, one bounded signal promotion, one unchanged named-file hold, and zero operating-outcome advances.`);
