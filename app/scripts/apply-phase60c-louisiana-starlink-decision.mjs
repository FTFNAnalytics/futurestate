import { readFile, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

const appRoot = fileURLToPath(new URL("..", import.meta.url));
const workspaceRoot = fileURLToPath(new URL("../..", import.meta.url));
const pathFor = (...parts) => join(appRoot, ...parts);
const workspacePath = (...parts) => join(workspaceRoot, ...parts);
const readJson = async (...parts) => JSON.parse(await readFile(pathFor(...parts), "utf8"));
const writeJson = async (record, ...parts) => writeFile(pathFor(...parts), `${JSON.stringify(record, null, 2)}\n`, "utf8");
const readText = async (...parts) => readFile(pathFor(...parts), "utf8");
const writeText = async (text, ...parts) => writeFile(pathFor(...parts), text, "utf8");
const expect = (condition, message) => { if (!condition) throw new Error(message); };
const appendUnique = (records, value) => { if (!records.includes(value)) records.push(value); };

const decisionDate = "2026-09-01";
const receiptId = "receipt-60-louisiana-starlink-2026-09-01-no-material-change";
const cycleItemId = "60-CYCLE-LOUISIANA-STARLINK-ADOPTION";
const queueId = "58-QUEUE-LOUISIANA-STARLINK-ADOPTION";
const envelopeId = "67-RETURN-003";
const updateId = "update-2026-09-01-phase-60c-louisiana-starlink-operating-decision";
const primarySourceId = "source-57b-louisiana-starlink-bead-agreement";
const supportingSourceIds = [
  "source-165-led-spacex-louisiana-campus-starlink-offer",
  "source-165-starlink-louisiana-community-discount",
  "source-165-louisiana-broadband-reporting-law",
  "source-165-connectla-resource-library",
];
const checkedSourceIds = [primarySourceId, ...supportingSourceIds];
const attemptedSurfaces = [
  "https://connect.la.gov/press-releases/louisiana-signs-bead-grant-agreement-with-spacexs-starlink-continuing-push-for-statewide-broadband-access",
  "https://connect.la.gov/press-releases",
  "https://connect.la.gov/resource-library",
  "https://www.opportunitylouisiana.gov/news/spacex-launches-new-era-of-commercial-spaceflight-with-100-billion-louisiana-campus",
  "https://starlink.com/support/article/5a00b427-520c-faa3-2de2-f74c1ddaa6cc",
  "https://legis.la.gov/legis/Law.aspx?d=1337853",
  "https://connect.la.gov/media/gvrfqkff/draft-subrecipient-agreement-final-10-11-24.pdf",
  "https://broadbandusa.ntia.gov/sites/default/files/2026-01/BEAD_FP_Overview_LA.pdf",
  "https://help.bdc.fcc.gov/hc/en-us/articles/10476040597787-How-to-Submit-an-Availability-Challenge",
];

const receipt = await readJson("src", "data", "phase-165-receipts", `${receiptId}.json`);
expect(receipt.receipt_id === receiptId, "The immutable September 1 receipt is missing or has the wrong identity.");
expect(receipt.decision_date === decisionDate && receipt.source_checked_date === decisionDate, "The September 1 receipt has the wrong date.");
expect(receipt.decision_status === "no_material_change" && receipt.signal_decision === "retain_in_review_no_material_change", "The September 1 receipt has the wrong bounded decision.");
expect(receipt.next_check_date === "2026-09-08" && receipt.official_surface_checks?.length === 9, "The September 1 receipt has a stale next action or source inventory.");

const receipts = await readJson("src", "data", "phase-58-change-receipts.json");
receipts.captured_date = decisionDate;
receipts.receipts = receipts.receipts.filter((record) => record.receipt_id !== receiptId);
receipts.receipts.push(structuredClone(receipt));
await writeJson(receipts, "src", "data", "phase-58-change-receipts.json");

const queue = await readJson("src", "data", "phase-58-dated-evidence-queue.json");
const queueRecord = queue.records.find((record) => record.queue_id === queueId);
expect(queueRecord?.underlying_signal_id === "signal-57y-preserved-la-starlink-adoption", "The Phase 58 Louisiana Starlink queue identity changed.");
Object.assign(queueRecord, {
  underlying_signal_status: "In Review",
  exact_next_artifact: receipt.exact_next_artifact,
  last_checked_date: decisionDate,
  next_check_date: "2026-09-08",
  review_cadence_days: 7,
  current_decision: "no_material_change",
  latest_receipt_id: receiptId,
  bounded_finding: receipt.bounded_finding,
  stop_rule: "Do not infer nonexistence, zero adoption, availability, program success, or program failure. Planned locations, offer terms, statutory reporting duties, and provider-wide totals do not substitute for a fixed-cohort observed installation or subscription return.",
  supporting_source_ids: supportingSourceIds,
});
queue.last_operated_date = decisionDate;
await writeJson(queue, "src", "data", "phase-58-dated-evidence-queue.json");

const cycle = await readJson("src", "data", "phase-60-operating-cycle.json");
const cycleRecord = cycle.records.find((record) => record.cycle_item_id === cycleItemId);
expect(cycleRecord?.origin_record_id === queueId && cycleRecord?.source_ids?.[0] === primarySourceId, "The Phase 60 Louisiana Starlink cycle identity changed.");
Object.assign(cycleRecord, {
  exact_next_artifact: receipt.exact_next_artifact,
  decision_status: "no_material_change",
  decision_date: decisionDate,
  receipt_id: receiptId,
  source_checked_date: decisionDate,
  receipt_type: "No Material Change",
  propagation_status: "complete_locally_git_held",
  content_propagation_status: "complete",
  git_backed_release_status: "held",
  next_check_date: "2026-09-08",
  supporting_source_ids: supportingSourceIds,
  official_surface_count: attemptedSurfaces.length,
});
cycle.cycle_status = "wave_60c_in_progress_one_decision_complete";
cycle.operating_measures.completed_cycle_decisions = 3;
cycle.operating_measures.underlying_signal_promotions = 1;
cycle.operating_measures.silent_overdue_count = 0;
cycle.operating_measures.content_propagation_complete = 3;
cycle.operating_measures.git_backed_release_verified = 2;
cycle.operating_measures.git_backed_release_held = 1;
cycle.last_operated_date = decisionDate;
await writeJson(cycle, "src", "data", "phase-60-operating-cycle.json");

const propagation = await readJson("src", "data", "phase-60-propagation-contract.json");
propagation.last_operated_date = decisionDate;
propagation.cycle_decision_proofs = propagation.cycle_decision_proofs.filter((proof) => proof.cycle_item_id !== cycleItemId);
propagation.cycle_decision_proofs.push({
  proof_id: "60-PROP-LOUISIANA-STARLINK-2026-09-01",
  cycle_item_id: cycleItemId,
  receipt_id: receiptId,
  source_id: primarySourceId,
  supporting_source_ids: supportingSourceIds,
  signal_id: "signal-57y-preserved-la-starlink-adoption",
  signal_decision: "retain_in_review_no_material_change",
  canonical_dossier_ids: [
    "briefing-outcomes-watch-001-what-actually-changed",
    "briefing-evidence-cycle-001-operating-baseline",
    "briefing-evidence-cycle-001-wave-60c-field-guide",
    "briefing-evidence-return-control-room-001",
  ],
  reader_pathway_ids: ["reader-pathway-policy-standards-to-implementation"],
  dependency_map_ids: [
    "dependency-map-comparative-outcomes-require-common-denominators",
    "dependency-map-artifact-return-to-reader-state",
  ],
  local_system_ids: [],
  named_file_ids: [],
  referenced_place_context_ids: ["162-BRIEF-004"],
  referenced_operation_overlay_id: "165-OPERATION-001",
  update_id: updateId,
  next_check_date: "2026-09-08",
  propagation_status: "complete_locally_git_held",
  content_propagation_status: "complete",
  git_backed_release_status: "held",
  bounded_result: "The September 1 official-source review preserves the Louisiana Starlink signal In Review. Planned locations, offer terms, reporting duties, and program-document availability do not establish observed adoption for a fixed eligible-location cohort; no Phase 61 named file shares this provider identity.",
});
await writeJson(propagation, "src", "data", "phase-60-propagation-contract.json");

const desk = await readJson("src", "data", "phase-60c-editorial-desk.json");
const deskRecord = desk.records.find((record) => record.cycle_item_id === cycleItemId);
expect(deskRecord?.desk_item_id === "60C-DESK-001" && deskRecord?.return_envelope_id === envelopeId, "The Wave 60C desk identity changed.");
expect(["2026-08-23", decisionDate].includes(desk.captured_date), "The Wave 60C preflight capture provenance changed.");
desk.captured_date = "2026-08-23";
desk.as_of_date = decisionDate;
desk.last_operated_date = decisionDate;
desk.desk_status = "operating_one_cycle_gate_complete";
desk.publication_boundary = "This desk preserves its August 23 preflight provenance and records one real September 1 No Material Change decision. Five later cycle gates and two companion rechecks remain future-safe; Git-backed release for the September 1 content propagation remains Held.";
desk.decision_contract.future_field_rule = "Decision dates, receipt IDs, attempted surfaces, access results, and propagation results remain absent for future desk items. A due item may receive them only from its real dated receipt and completed propagation proof.";
desk.current_operating_result = {
  completed_cycle_gate_id: cycleItemId,
  receipt_id: receiptId,
  decision_status: "no_material_change",
  completed_date: decisionDate,
  remaining_cycle_gates: 5,
  remaining_companion_rechecks: 2,
  next_public_surface_recheck: "2026-09-08",
  next_scheduled_desk_date: "2026-09-09",
  content_propagation_status: "complete",
  git_backed_release_status: "held",
};
Object.assign(deskRecord, {
  exact_next_artifact: receipt.exact_next_artifact,
  checked_source_ids: checkedSourceIds,
  source_checked_date: decisionDate,
  attempted_surfaces: attemptedSurfaces,
  access_result: "The official surfaces establish planned access, adjacent offer terms, reporting duties, and available program documents, but no compatible observed installation, subscription, or service-taken result for a fixed Louisiana BEAD cohort.",
  receipt_type: "No Material Change",
  receipt_id: receiptId,
  decision_date: decisionDate,
  decision_status: "no_material_change",
  propagation_status: "complete_locally_git_held",
  content_propagation_status: "complete",
  git_backed_release_status: "held",
  next_check_date: "2026-09-08",
  publication_boundary: "This desk item records a dated No Material Change decision and complete content propagation. Git-backed release remains Held; the result does not establish nonexistence, zero adoption, availability, success, or failure and does not authorize any named-file or matrix advance.",
});
await writeJson(desk, "src", "data", "phase-60c-editorial-desk.json");

const returns = await readJson("src", "data", "phase-67-evidence-return-envelope-ledger.json");
const envelope = returns.envelope_records.find((record) => record.envelope_id === envelopeId);
expect(envelope?.cycle_item_id === cycleItemId && envelope?.named_file_ids?.length === 0, "The Phase 67 Louisiana Starlink no-transfer identity changed.");
Object.assign(envelope, {
  envelope_state: "Propagation Complete — Git Held",
  exact_next_artifact: receipt.exact_next_artifact,
  checked_source_ids: checkedSourceIds,
  attempted_surfaces: attemptedSurfaces,
  access_result: "Nine official public surfaces were reviewed. They support planned access and adjacent offer/reporting context, but not a compatible fixed-cohort observed adoption result; this is not a nonexistence or zero-adoption finding.",
  receipt_type: "No Material Change",
  receipt_id: receiptId,
  decision_date: decisionDate,
  decision_status: "no_material_change",
  propagation_status: "complete_locally_git_held",
  content_propagation_status: "complete",
  git_backed_release_status: "held",
  next_check_date: "2026-09-08",
  publication_boundary: "This envelope records a dated No Material Change decision and complete content propagation. Git-backed release remains Held; the result does not establish nonexistence, zero adoption, availability, success, or failure and does not authorize any named-file or matrix advance.",
});
returns.as_of_date = decisionDate;
returns.operational_status = "Wave 60B Complete; Wave 60C In Progress — September 1 Decision Propagated; Git Held";
returns.metrics.receipts_created = 3;
returns.metrics.decisions_completed = 3;
returns.metrics.propagation_completed = 3;
returns.metrics.content_propagation_completed = 3;
returns.metrics.git_backed_release_verified = 2;
returns.metrics.git_backed_release_held = 1;
await writeJson(returns, "src", "data", "phase-67-evidence-return-envelope-ledger.json");

const packets = await readJson("src", "data", "phase-67-qualification-packet-registry.json");
packets.as_of_date = decisionDate;
packets.last_operated_date = decisionDate;
packets.operational_status = "Three Cycle Receipts Recorded; Qualification Packets Awaiting File Evidence";
await writeJson(packets, "src", "data", "phase-67-qualification-packet-registry.json");

const artifactMap = await readJson("src", "content", "dependency-maps", "artifact-return-to-reader-state.json");
for (const sourceId of checkedSourceIds) appendUnique(artifactMap.source_ids, sourceId);
appendUnique(artifactMap.what_this_map_supports, `Receipt ${receiptId} demonstrates a completed bounded return: an official-source check may be terminal even when the requested observed cohort artifact is not supplied and the underlying signal remains In Review.`);
appendUnique(artifactMap.what_this_map_does_not_prove, "The September 1 Louisiana Starlink return does not prove nonexistence, zero adoption, service availability, success, failure, or any Phase 61 named-file change.");
appendUnique(artifactMap.next_records_needed, "A ConnectLA- or SpaceX-issued Louisiana BEAD return with a fixed eligible-location cohort, actual installations or subscriptions, observation period, and method.");
await writeJson(artifactMap, "src", "content", "dependency-maps", "artifact-return-to-reader-state.json");

async function appendSection(parts, heading, body, replacements = []) {
  let text = await readText(...parts);
  for (const [before, after] of replacements) if (text.includes(before)) text = text.replace(before, after);
  if (!text.includes(`## ${heading}`)) text = `${text.trimEnd()}\n\n## ${heading}\n\n${body.trim()}\n`;
  await writeText(text, ...parts);
}

await appendSection(
  ["src", "content", "briefings", "briefing-evidence-cycle-001-wave-60c-field-guide.mdx"],
  "September 1 operating result",
  `The Louisiana Starlink gate is complete under No Material Change receipt \`${receiptId}\`. Nine official public surfaces establish planned access, adjacent affordability terms, reporting duties, and current program-document availability, but not observed installations, subscriptions, or service taken for a fixed eligible-location cohort with a dated period and disclosed method. The signal remains In Review. No Phase 61 named file shares the provider identity, so there is no file-stage transfer. The next bounded public-surface recheck is September 8; the remaining seven Wave 60C desk items retain empty future outcome fields.`,
  [["last_reviewed_date: 2026-08-23", "last_reviewed_date: 2026-09-01"]],
);

await appendSection(
  ["src", "content", "briefings", "briefing-evidence-return-control-room-001.mdx"],
  "September 1 Wave 60C return",
  `Envelope \`${envelopeId}\` has complete evidence propagation under receipt \`${receiptId}\`, while Git-backed release remains Held. The return is a bounded No Material Change decision, not evidence of nonexistence or zero adoption. It changes no Phase 61 named file, qualification packet, Phase 64 cell, score, rank, or operating outcome. Three of thirteen Evidence Cycle 001 decisions are now complete; ten envelopes remain scheduled.`,
  [
    ["last_reviewed_date: 2026-08-23", "last_reviewed_date: 2026-09-01"],
    ["Envelope `67-RETURN-003` is Release Verified under receipt `receipt-60-louisiana-starlink-2026-09-01-no-material-change`. The return is a bounded No Material Change decision, not evidence of nonexistence or zero adoption. It changes no Phase 61 named file, qualification packet, Phase 64 cell, score, rank, or operating outcome. Three of thirteen Evidence Cycle 001 envelopes are now complete; ten remain scheduled.", "Envelope `67-RETURN-003` has complete evidence propagation under receipt `receipt-60-louisiana-starlink-2026-09-01-no-material-change`, while Git-backed release remains Held. The return is a bounded No Material Change decision, not evidence of nonexistence or zero adoption. It changes no Phase 61 named file, qualification packet, Phase 64 cell, score, rank, or operating outcome. Three of thirteen Evidence Cycle 001 decisions are now complete; ten envelopes remain scheduled."],
  ],
);

const update = {
  id: updateId,
  effective_date: decisionDate,
  entry_type: "Source Refresh",
  title: "Evidence Cycle 001 completes the Louisiana Starlink adoption gate under No Material Change",
  summary: "Nine official public surfaces preserve the planned 10,635-location baseline and add adjacent offer and reporting context, but do not supply observed installation or subscription evidence for a fixed Louisiana BEAD cohort.",
  operating_control_ids: [
    queueId,
    cycleItemId,
    "60-PROP-LOUISIANA-STARLINK-2026-09-01",
    "60C-DESK-001",
    envelopeId,
    "qualification-packet-registry-001",
  ],
  affected_record_ids: [
    "165-OPERATION-001",
    ...checkedSourceIds,
    "signal-57y-preserved-la-starlink-adoption",
    "briefing-outcomes-watch-001-what-actually-changed",
    "briefing-evidence-cycle-001-operating-baseline",
    "briefing-evidence-cycle-001-wave-60c-field-guide",
    "briefing-evidence-return-control-room-001",
    "reader-pathway-policy-standards-to-implementation",
    "dependency-map-comparative-outcomes-require-common-denominators",
    "dependency-map-artifact-return-to-reader-state",
    "162-BRIEF-004",
  ],
  related_paths: [
    "/review/evidence-cycle/louisiana-starlink-adoption/",
    "/review/v1cycle/live-operations/louisiana-starlink-adoption/",
    "/signals/57y-preserved-la-starlink-adoption/",
    "/briefings/outcomes-watch-001-what-actually-changed/",
    "/briefings/evidence-cycle-001-operating-baseline/",
    "/briefings/evidence-cycle-001-wave-60c-field-guide/",
    "/briefings/evidence-return-control-room-001/",
    "/data/operating-cycle.json",
    "/data/phase-60c-editorial-desk.json",
    "/data/evidence-return-envelopes.json",
  ],
  evidence_note: receipt.evidence_boundary,
  receipt_id: receiptId,
  receipt_type: "No Material Change",
  source_checked_date: decisionDate,
  decision_date: decisionDate,
  materiality: "No record-state change",
  publication_effect: "Adds the dated Phase 60/67 operating state and complete local content-propagation proof while retaining the signal In Review and advancing no named-file, matrix, score, ranking, or operating-outcome state. Git-backed release remains Held.",
  next_check_date: "2026-09-08",
  work_package: "docs/work-packages/phase-60-evidence-to-decision-operating-cycle.md",
};
await writeJson(update, "src", "content", "updates", "2026-09-01-phase-60c-louisiana-starlink-operating-decision.json");

async function updateWorkspaceDoc(parts, heading, body, replacements = []) {
  const path = workspacePath(...parts);
  let text = await readFile(path, "utf8");
  for (const [before, after] of replacements) if (text.includes(before)) text = text.replace(before, after);
  if (!text.includes(`## ${heading}`)) text = `${text.trimEnd()}\n\n## ${heading}\n\n${body.trim()}\n`;
  await writeFile(path, text, "utf8");
}

await updateWorkspaceDoc(
  ["docs", "work-packages", "phase-60-evidence-to-decision-operating-cycle.md"],
  "Wave 60C September 1 Result",
  `Receipt \`${receiptId}\` closes the Louisiana Starlink observed-adoption gate as a bounded **No Material Change** decision. The official review preserves the 10,635-location planned-access baseline and records adjacent Pecan Island offer and reporting context, but no compatible fixed-cohort installation, subscription, or service-taken return. The signal remains In Review. No Phase 61 named file shares the Louisiana Starlink provider identity, and no file stage, Phase 64 cell, score, rank, or operating outcome advances.\n\nThe receipt now resolves through the Phase 58 receipt and queue registries, Phase 60 cycle and local content-propagation proof, Phase 60C desk, Phase 67 return envelope, the signal, Outcomes Watch, Evidence Cycle digest and field guide, policy pathway, both assigned dependency maps, a referenced immutable Louisiana place context, and a dedicated public update. Evidence Cycle 001 now has three complete decisions and ten scheduled gates. Content propagation is complete while Git-backed release remains Held. The next bounded Starlink public-surface recheck is September 8; the next scheduled cycle gate and separate Toronto project-file recheck remain September 9.`,
  [
    ["Status: operating; Wave 60B complete and locally release-validated; Waves 60C-60D, content commit, and owner-only deployment pending", "Status: operating; Wave 60B and the September 1 Wave 60C gate complete and locally release-validated; later Waves 60C-60D, content commit, and owner-only deployment pending"],
    ["Status: operating; Wave 60B and the September 1 Wave 60C gate complete and locally release-validated; later Waves 60C-60D, content commit, and owner-only deployment pending", "Status: operating; three evidence decisions complete, September 1 content propagation complete with Git-backed release Held; ten gates, content commit, and owner-only deployment pending"],
    ["At the August 23 checkpoint, two gates have complete decisions and receipts, eleven gates remain future scheduled work, and the silent-overdue count is zero.", "At the September 1 checkpoint, three gates have complete decisions and receipts, ten gates remain scheduled work, and the silent-overdue count is zero."],
    ["Run the September 1 Louisiana Starlink observed-adoption gate. On September 9, keep the Louisiana Nextlink gate", "Recheck the Louisiana Starlink public surfaces on September 8 under the bounded receipt. On September 9, keep the Louisiana Nextlink gate"],
    ["The receipt now resolves through the Phase 58 receipt and queue registries, Phase 60 cycle and propagation contract, Phase 60C desk, Phase 67 return envelope, the signal, Outcomes Watch, Evidence Cycle digest and field guide, policy pathway, both assigned dependency maps, the append-only Louisiana place overlay, and a dedicated public update. Evidence Cycle 001 now has three complete decisions and ten scheduled gates. The next bounded Starlink public-surface recheck is September 8; the next scheduled cycle gate and separate Toronto project-file recheck remain September 9.", "The receipt now resolves through the Phase 58 receipt and queue registries, Phase 60 cycle and local content-propagation proof, Phase 60C desk, Phase 67 return envelope, the signal, Outcomes Watch, Evidence Cycle digest and field guide, policy pathway, both assigned dependency maps, a referenced immutable Louisiana place context, and a dedicated public update. Evidence Cycle 001 now has three complete decisions and ten scheduled gates. Content propagation is complete while Git-backed release remains Held. The next bounded Starlink public-surface recheck is September 8; the next scheduled cycle gate and separate Toronto project-file recheck remain September 9."],
  ],
);

const operationalCheck = `# Phase 60C operational check — Louisiana Starlink observed adoption\n\n**Decision date:** 2026-09-01  \n**Receipt:** \`${receiptId}\`  \n**Decision:** No Material Change  \n**Signal state:** In Review\n\n## Result\n\nThe due gate is complete. ConnectLA's June 11 agreement continues to establish planned access for 10,635 locations in more than 50 parishes. Current official Louisiana, Starlink, statutory, program-library, NTIA, and FCC surfaces add adjacent offer, reporting, allocation, and availability context, but do not supply observed installations, subscriptions, or service taken for a fixed Louisiana BEAD eligible-location cohort with a dated period and disclosed method.\n\nThis is not a finding that a qualifying artifact does not exist or that adoption is zero. It does not establish service availability, retention, household benefit, success, or failure.\n\n## Official surfaces checked\n\n${receipt.official_surface_checks.map((surface) => `- ${surface.publisher}: [${surface.artifact}](${surface.url}) — ${surface.result}`).join("\n")}\n\n## Propagation\n\n- Phase 58 receipt registry and dated queue\n- Phase 60 operating cycle and propagation proof\n- Phase 60C editorial desk\n- Phase 67 return envelope \`${envelopeId}\`\n- Underlying In Review signal\n- Outcomes Watch and Evidence Cycle digest/field guide\n- Policy-and-standards reader pathway\n- Comparative-outcomes and artifact-return dependency maps\n- Append-only Louisiana place-system overlay\n- Public update \`${updateId}\`\n\nNo Phase 61 named file shares this provider identity, so no named-file transfer occurs.\n\n## Next action\n\nRun a bounded official public-surface recheck on 2026-09-08 for a ConnectLA- or SpaceX-issued return that fixes the eligible-location cohort and reports actual installations, subscriptions, or service taken with observation period and method. Keep the September 9 Louisiana Nextlink gate and Toronto project-file recheck independent.\n`;
const finalizedOperationalCheck = operationalCheck
  .replace("**Signal state:** In Review", "**Signal state:** In Review  \n**Release boundary:** Content propagation complete; Git-backed release Held")
  .replace("- Append-only Louisiana place-system overlay", "- Referenced immutable Louisiana place-system context")
  .replace("\n## Next action", "\nContent propagation steps are complete. Git-backed release validation remains Held because this operation did not commit or publish the working tree.\n\n## Next action");
await writeFile(workspacePath("docs", "operational-checks", "2026-09-01-phase-60c-louisiana-starlink-adoption.md"), finalizedOperationalCheck, "utf8");

await updateWorkspaceDoc(
  ["docs", "work-packages", "phase-60c-evidence-return-publication-preflight.md"],
  "September 1 Operating Result",
  `The first Wave 60C cycle gate is now a real dated decision. Receipt \`${receiptId}\` records **No Material Change** after nine official public-surface checks: planned access, adjacent offer terms, reporting duties, and current program documents do not supply a compatible observed installation, subscription, or service-taken result for a fixed Louisiana BEAD cohort. The underlying signal remains In Review, the next bounded recheck is September 8, and no Phase 61 named file shares the provider identity. Five later Wave 60C cycle gates and both companion rechecks remain scheduled with empty future outcome fields. Evidence propagation is complete; Git-backed release remains Held.`,
  [
    ["Status: complete and locally release-validated; dated decisions, content commit, and owner-only deployment pending", "Status: operating; September 1 decision propagated locally; five cycle gates, two companion rechecks, content commit, Git-backed release, and owner-only deployment pending"],
    ["- six future Wave 60C return envelopes with empty decision fields;", "- one dated Wave 60C decision with complete evidence propagation and Git-backed release Held;\n- five future Wave 60C cycle envelopes and two companion rechecks with empty outcome fields;"],
  ],
);

await updateWorkspaceDoc(
  ["docs", "work-packages", "phase-67-qualification-packet-evidence-return-control-plane.md"],
  "September 1 Wave 60C Return",
  `Return envelope \`${envelopeId}\` now records the Louisiana Starlink No Material Change decision under receipt \`${receiptId}\`. Its evidence propagation is complete, while Git-backed release remains Held. The decision keeps the signal In Review, creates no named-file transfer, advances no Phase 64 cell or qualification packet, and preserves all score, rank, and operating-outcome prohibitions. The return ledger therefore contains two Git-backed Release Verified Wave 60B envelopes, one fully propagated Git-held Wave 60C envelope, and ten scheduled envelopes.`,
  [
    ["Status: Wave 60B operating receipts complete and locally release-validated; eleven Evidence Cycle gates, content commit, private-runtime mapping, and owner-only deployment pending", "Status: Wave 60B release-verified; September 1 Wave 60C decision fully propagated with Git-backed release Held; ten Evidence Cycle gates, content commit, private-runtime mapping, and owner-only deployment pending"],
    ["Two return envelopes are now Release Verified and eleven remain scheduled. The operational gate stays open through the September and October dates.", "Two Wave 60B return envelopes are Release Verified, the September 1 Wave 60C envelope is fully propagated with Git-backed release Held, and ten remain scheduled. The operational gate stays open through the September and October dates."],
    ["Two envelopes are Release Verified, eleven remain future scheduled, and no Phase 64 cell or operating-outcome state advanced.", "Two envelopes are Release Verified, one September 1 envelope is fully propagated with Git-backed release Held, ten remain future scheduled, and no Phase 64 cell or operating-outcome state advanced."],
    ["All thirteen envelopes are `Scheduled`. Attempted surfaces are empty; access result, receipt type, receipt ID, decision date, and next check are null; propagation is `not_started`.", "At the Phase 67 preflight snapshot, all thirteen envelopes were `Scheduled`; later dated result sections supersede that historical operating count while preserving empty fields for future envelopes."],
    ["`Evidence Return Control Room 001` explains the complete forty-five-record work state. Its two Wave 60B envelopes are now Release Verified and its eleven September-October envelopes remain future work.", "`Evidence Return Control Room 001` explains the complete forty-five-record work state. After Wave 60B, two envelopes were Release Verified and eleven September-October envelopes remained future work; the September 1 result below advances one decision while keeping Git-backed release Held."],
    ["Continue Evidence Cycle 001 with the September 1 Louisiana Starlink observed-adoption gate. Phase 68 should build", "Continue Evidence Cycle 001 with the bounded September 8 Louisiana Starlink public-surface recheck and the independent September 9 Louisiana Nextlink and Toronto project-file gates. Phase 68 should build"],
  ],
);

console.log(`${receiptId} applied to the canonical Phase 58/60/60C/67 control plane: 3 decisions complete, 10 gates scheduled, signal In Review, no Phase 61 transfer, next public-surface check 2026-09-08.`);
