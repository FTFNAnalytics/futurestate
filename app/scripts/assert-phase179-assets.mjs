import { readFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const appRoot = join(dirname(fileURLToPath(import.meta.url)), "..");
const readJson = async (path) => JSON.parse(await readFile(path, "utf8"));
const p179 = await readJson(join(appRoot, "src", "data", "phase-179-october-weekly-editions-and-month-end-synthesis.json"));
const failures = [];
const check = (condition, message) => { if (!condition) failures.push(message); };
const ids = p179.editorial_cycles.map((record) => record.editorial_cycle_id);
const routes = p179.public_html_routes;
const weekly = p179.editorial_cycles.filter((record) => record.record_type === "Weekly edition decision");
const monthEnd = p179.editorial_cycles.find((record) => record.record_type === "Month-end synthesis decision");

check(p179.schema_version === "1.0" && p179.phase === 179, "Phase 179 identity is invalid.");
check(ids.length === 5 && new Set(ids).size === 5, "Phase 179 requires five unique editorial-cycle IDs.");
check(weekly.length === 4 && weekly.every((record) => record.desk_closure_bindings?.length === 17), "Every weekly cycle must bind seventeen desks.");
check(weekly.flatMap((record) => record.desk_closure_bindings).length === 68, "Phase 179 must expose sixty-eight desk closures.");
check(weekly.every((record) => record.source_cutoff === null && record.terminal_input_digest === null && record.publication_decision === null && record.publication_receipt_id === null), "A future weekly result was predated.");
check(weekly.every((record) => record.desk_closure_bindings.every((desk) => desk.decision === null && desk.decision_date === null && desk.receipt_id === null && desk.source_cutoff === null)), "A future desk closure was predated.");
check(JSON.stringify(weekly.map((record) => record.due_evidence_operation_ids)) === JSON.stringify([
  ["60-CYCLE-LOUDOUN-STANDARDS"],
  ["60-CYCLE-AMTRAK-NAMED-ASSET-RELIABILITY", "60-CYCLE-NNSA-RECURRING-QUALIFIED-RATE"],
  [],
  [],
]), "October weekly cycles do not bind the exact due Phase 60 operations.");
check(monthEnd?.decision_date === "2026-10-31" && monthEnd.terminal_weekly_receipt_ids.length === 0 && monthEnd.synthesis_decision === null && monthEnd.publication_receipt_id === null, "The future month-end result must remain null.");
check(monthEnd?.weekly_cycle_ids.length === 4 && new Set(monthEnd.weekly_cycle_ids).size === 4, "The month-end packet must bind four unique weekly cycles.");
check(routes.length === 6 && new Set(routes).size === 6, "Phase 179 requires six unique public routes.");
check(p179.counts.scheduled_desk_closures === 68 && p179.counts.predated_decisions === 0, "Phase 179 counts are incorrect.");
if (failures.length) throw new Error(`Phase 179 assertions failed:\n- ${failures.join("\n- ")}`);
console.log("Phase 179 assertions passed: 4 weekly cycles, 68 future desk closures, 1 month-end packet, and zero predated outcomes.");
