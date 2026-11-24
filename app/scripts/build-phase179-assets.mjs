import { readFile, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const scriptRoot = dirname(fileURLToPath(import.meta.url));
const appRoot = join(scriptRoot, "..");
const workspaceRoot = join(appRoot, "..");
const dataRoot = join(appRoot, "src", "data");
const updatesRoot = join(appRoot, "src", "content", "updates");
const workPackagesRoot = join(workspaceRoot, "docs", "work-packages");
const readJson = async (name) => JSON.parse(await readFile(join(dataRoot, name), "utf8"));
const writeJson = async (path, value) => writeFile(path, `${JSON.stringify(value, null, 2)}\n`, "utf8");

const p151 = await readJson("phase-151-weekly-desk-review-ledger.json");
const p154 = await readJson("phase-154-september-edition-packets.json");
if (p151.desk_review_ledgers?.length !== 17 || p154.edition_packets?.length !== 4) {
  throw new Error("Phase 179 requires the exact seventeen-desk and four-edition September baselines.");
}

const boundaries = [
  "This is an accelerated operating scaffold prepared on 2026-09-01; it does not claim that an October review, source cutoff, decision, receipt, or publication has occurred.",
  "Every weekly scope remains empty until all seventeen same-date desk closures and every due evidence operation are terminal.",
  "A visible no-publication receipt is a valid terminal result; materiality is never manufactured to fill an edition.",
  "The month-end synthesis remains null until all four weekly decisions are terminal and its 2026-10-31 decision date is lawful.",
  "No evidence admission, owner disposition, project or place stage, score, rank, causal result, repository publication, hosted deployment, or v1 promotion is inferred."
];

const weeklyDates = ["2026-10-04", "2026-10-11", "2026-10-18", "2026-10-25"];
const weeklyNames = ["October opening", "Cycle 001 close", "Evidence adjudication", "Systems depth"];
const dueEvidenceOperationsByDate = {
  "2026-10-04": ["60-CYCLE-LOUDOUN-STANDARDS"],
  "2026-10-11": ["60-CYCLE-AMTRAK-NAMED-ASSET-RELIABILITY", "60-CYCLE-NNSA-RECURRING-QUALIFIED-RATE"],
  "2026-10-18": [],
  "2026-10-25": [],
};
const weeklyCycles = weeklyDates.map((decisionDate, index) => ({
  editorial_cycle_id: `179-WEEKLY-${String(index + 1).padStart(2, "0")}`,
  record_type: "Weekly edition decision",
  slug: `october-${String(index + 1).padStart(2, "0")}-${weeklyNames[index].toLowerCase().replaceAll(" ", "-")}`,
  title: `${weeklyNames[index]} weekly edition`,
  state: "Scheduled — future decision and content remain null",
  decision_date: decisionDate,
  decision_lawful_as_of_effective_date: false,
  inherited_september_template_id: p154.edition_packets[index].edition_packet_id,
  desk_closure_bindings: p151.desk_review_ledgers.map((desk) => ({
    desk_closure_id: `179-CLOSE-${String(index + 1).padStart(2, "0")}-${desk.desk_review_id.split("-").at(-1)}`,
    upstream_desk_review_id: desk.desk_review_id,
    desk_id: desk.desk_id,
    topic_id: desk.topic_id,
    title: desk.title,
    state: "Scheduled — future closure remains null",
    source_cutoff: null,
    decision: null,
    decision_date: null,
    receipt_id: null,
    material_change_ids: [],
    excluded_candidate_ids: [],
    stop_rule: "Close this desk only from evidence and governed decisions available on or before the weekly decision date; never infer nonexistence from an unsuccessful search."
  })),
  due_evidence_operation_ids: dueEvidenceOperationsByDate[decisionDate],
  source_cutoff: null,
  terminal_input_digest: null,
  selected_record_ids: [],
  excluded_candidate_ids: [],
  publication_decision: null,
  publication_receipt_id: null,
  correction_trigger: "Reopen only for a dated source revision, a corrected identity or denominator, or a receipt whose affected-record set includes this edition.",
  exact_next_action: `On ${decisionDate}, close all seventeen desks, bind every due evidence operation, compute the terminal-input digest, and issue either a publication or explicit no-publication receipt.`,
  route: `/review/v1oct/october-editions/october-${String(index + 1).padStart(2, "0")}-${weeklyNames[index].toLowerCase().replaceAll(" ", "-")}/`
}));

const monthEnd = {
  editorial_cycle_id: "179-MONTH-END-01",
  record_type: "Month-end synthesis decision",
  slug: "october-2026-month-end-synthesis",
  title: "October 2026 month-end synthesis",
  state: "Scheduled — future decision and content remain null",
  decision_date: "2026-10-31",
  decision_lawful_as_of_effective_date: false,
  weekly_cycle_ids: weeklyCycles.map((record) => record.editorial_cycle_id),
  terminal_weekly_receipt_ids: [],
  terminal_input_digest: null,
  selected_record_ids: [],
  excluded_candidate_ids: [],
  synthesis_decision: null,
  publication_receipt_id: null,
  correction_trigger: "Reopen only when a bound weekly receipt changes through a dated correction with a new digest.",
  exact_next_action: "On 2026-10-31, confirm all four weekly decisions are terminal, bind their receipts and exact digests, then issue a month-end publication or explicit no-publication receipt.",
  route: "/review/v1oct/october-editions/october-2026-month-end-synthesis/"
};

const editorialCycles = [...weeklyCycles, monthEnd];
const p179 = {
  schema_version: "1.0",
  phase: 179,
  program_id: "FTFN-PHASE-179",
  dataset: "phase_179_october_weekly_editions_and_month_end_synthesis",
  title: "October Weekly Editions and Month-End Synthesis",
  effective_date: "2026-09-01",
  record_status: "Published operating scaffold",
  build_status: "Complete locally — five calendar decisions held",
  summary: "Prebuild four seventeen-desk October editorial cycles and one month-end synthesis without predating a source cutoff, decision, receipt, or publication.",
  record_scope: "Append-only Phase 179 operating scaffold over immutable Phase 156, 164, and 172 receipts.",
  publication_boundaries: boundaries,
  routes: { hub: "/review/v1oct/october-editions/", public_export: "/data/phase-179-october-weekly-editions-and-month-end-synthesis.json" },
  counts: {
    editorial_cycles: 5,
    weekly_cycles: 4,
    month_end_synthesis_cycles: 1,
    unique_topic_desks: 17,
    scheduled_desk_closures: 68,
    terminal_desk_closures: 0,
    publication_decisions: 0,
    explicit_no_publication_decisions: 0,
    future_decisions_with_null_outcomes: 5,
    predated_decisions: 0
  },
  operating_contract: {
    weekly_sequence: ["close_seventeen_desks", "bind_due_evidence_operations", "compute_terminal_input_digest", "derive_scope", "decide_publish_or_no_publication", "archive_receipt"],
    month_end_sequence: ["verify_four_terminal_weekly_receipts", "bind_receipt_digests", "derive_synthesis_scope", "decide_publish_or_no_publication", "archive_receipt"],
    minimum_weekly_terminal_inputs: 17,
    empty_scope_result: "Explicit no-publication receipt",
    future_content_allowed: false
  },
  editorial_cycles: editorialCycles,
  next_lawful_action: "Retain all October result fields as null until the first weekly decision date, 2026-10-04.",
  public_html_routes: ["/review/v1oct/october-editions/", ...editorialCycles.map((record) => record.route)],
  public_json_exports: ["/data/phase-179-october-weekly-editions-and-month-end-synthesis.json"]
};

const update = {
  id: "update-2026-09-01-phase-179",
  effective_date: "2026-09-01",
  entry_type: "Publication Promotion",
  title: "Phase 179 prebuilds October weekly and month-end edition controls",
  summary: "Adds four seventeen-desk weekly decision packets and one month-end synthesis packet while leaving every future cutoff, outcome, receipt, and publication field null.",
  affected_record_ids: editorialCycles.map((record) => record.editorial_cycle_id),
  related_paths: ["/review/v1oct/october-editions/"],
  evidence_note: boundaries[0],
  materiality: "Material record change",
  publication_effect: "Adds six local review routes and one schema-1.0 JSON export; it does not publish a future October edition.",
  work_package: "docs/work-packages/phase-179-october-weekly-editions-and-month-end-synthesis.md"
};

const workPackage = `# Phase 179 work package — October Weekly Editions and Month-End Synthesis

**State:** Complete locally — calendar decisions held  
**Build date:** 2026-09-01  
**Decision dates:** 2026-10-04, 2026-10-11, 2026-10-18, 2026-10-25, and 2026-10-31

## Objective

Operate a weekly editorial cadence that publishes only from terminal evidence inputs and culminates in a receipted month-end synthesis.

## Delivered now

- Four weekly packets with all sixty-eight desk-closure identities bound across seventeen desks.
- One month-end synthesis packet bound to the four weekly identities.
- A deterministic six-step weekly closure contract and five-step month-end contract.
- Null future source cutoffs, decisions, content, digests, and receipts with explicit stop rules.
- Public review routes, schema-1.0 export, dated update, and assertions.

## Calendar-held work

- The four weekly decisions and their publication or explicit no-publication receipts.
- The October 31 synthesis decision, which cannot run until all four weekly receipts are terminal.

## Acceptance

- All seventeen desks close before a weekly scope is derived.
- Every due evidence operation is terminal before publication.
- No finding or headline is prewritten into a future packet.
- A no-publication week is a valid, visible result.
- The month-end synthesis cannot publish before all four weekly decisions are terminal.
`;

await writeJson(join(dataRoot, "phase-179-october-weekly-editions-and-month-end-synthesis.json"), p179);
await writeJson(join(updatesRoot, "2026-09-01-phase-179.json"), update);
await writeFile(join(workPackagesRoot, "phase-179-october-weekly-editions-and-month-end-synthesis.md"), workPackage, "utf8");
console.log("Built Phase 179: 4 weekly cycles, 68 desk closures, and 1 month-end synthesis packet; all five future outcomes remain null.");
