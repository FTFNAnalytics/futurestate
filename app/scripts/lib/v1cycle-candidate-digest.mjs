import { createHash } from "node:crypto";
import { readFile, readdir } from "node:fs/promises";
import { join } from "node:path";

export const v1cyclePublicationDate = "2026-09-01";
export const v1cyclePhases = Object.freeze([165, 166, 167, 168, 169, 170, 171, 172]);
export const v1cycleValidatorContractVersion = "phase-172-local-validator-v1";
export const v1cycleValidationScope = "Local validation of the append-only Phase 165–172 September evidence-to-publication cycle. The receipt validates content, routes, exports, and release assertions only; it does not create evidence, supply an owner decision, authorize repository publication or hosting, close future calendar work, or promote v1.";

export const v1cycleExportNames = Object.freeze([
  "phase-165-live-evidence-operations-cycle-001.json",
  "phase-166-weekly-desk-closures-and-editions.json",
  "phase-167-authority-resolution-hearings.json",
  "phase-168-requirement-mission-adjudication.json",
  "phase-169-longitudinal-pilot-adjudication.json",
  "phase-170-fifteen-place-systems-atlas.json",
  "phase-171-frontier-systems-compendium.json",
  "phase-172-september-state-report.json",
  "v1-september-evidence-cycle.json",
]);

const clone = (value) => JSON.parse(JSON.stringify(value));
const unique = (values) => [...new Set(values)];

const stable = (value) => {
  if (Array.isArray(value)) return value.map(stable);
  if (value && typeof value === "object") {
    return Object.fromEntries(Object.keys(value).sort().map((key) => [key, stable(value[key])]));
  }
  return value;
};

export const canonicalJson = (value) => JSON.stringify(stable(value));
export const sha256 = (value) => createHash("sha256").update(value).digest("hex");

export function normalizeV1cycleExport(name, value) {
  const copy = clone(value);
  if (name === "phase-172-september-state-report.json") {
    copy.build_status = "Complete locally — validation pending";
    copy.local_validation_receipt = null;
    const gate = copy.state_report_gates?.find((item) => item.gate_id === "172-GATE-13-LOCAL-VALIDATION");
    if (gate) {
      gate.state = "Pending build";
      gate.evidence = "The content-addressed local validation receipt has not yet been embedded.";
      gate.receipt_id = null;
    }
    copy.counts = { ...(copy.counts ?? {}), passed: 6, held: 7, pending_build: 1, false_passes: 0 };
  }
  if (name === "v1-september-evidence-cycle.json") {
    copy.status = "Complete locally — validation pending";
    copy.local_validation_receipt = null;
    copy.local_validation_state = "Pending build";
    const phase = copy.phases?.find((item) => item.phase === 172);
    if (phase) {
      phase.status = "Complete locally — validation pending";
      phase.counts = { ...(phase.counts ?? {}), passed: 6, held: 7, pending_build: 1, false_passes: 0 };
    }
  }
  return copy;
}

export function computeV1cycleDigest({ exportsByName, updatesByName }) {
  const exportNames = [...v1cycleExportNames];
  if (unique(exportNames).length !== 9) throw new Error("The v1cycle digest requires nine unique exports.");
  const exports = exportNames.map((name) => {
    const value = exportsByName instanceof Map ? exportsByName.get(name) : exportsByName[name];
    if (!value) throw new Error(`Missing v1cycle export ${name}.`);
    return [name, normalizeV1cycleExport(name, value)];
  });
  const aggregate = exports.find(([name]) => name === "v1-september-evidence-cycle.json")[1];
  const routes = aggregate.public_html_routes ?? [];
  if (routes.length !== 90 || unique(routes).length !== 90) throw new Error(`The v1cycle digest requires 90 unique routes; received ${routes.length}/${unique(routes).length}.`);
  const updateNames = v1cyclePhases.map((phase) => `${v1cyclePublicationDate}-phase-${phase}.json`);
  const updates = updateNames.map((name) => {
    const value = updatesByName instanceof Map ? updatesByName.get(name) : updatesByName[name];
    if (!value) throw new Error(`Missing v1cycle update ${name}.`);
    return [name, value];
  });
  return sha256(canonicalJson({
    contract: v1cycleValidatorContractVersion,
    scope: v1cycleValidationScope,
    exports,
    public_html_routes: routes,
    public_json_exports: aggregate.public_json_exports,
    publication_updates: updates,
  }));
}

export function isValidV1cycleValidationReceipt({ receipt, aggregate, candidateDigest }) {
  return Boolean(
    receipt
    && receipt.receipt_id
    && receipt.receipt_type === "Local Validation"
    && receipt.validator_contract_version === v1cycleValidatorContractVersion
    && receipt.scope === v1cycleValidationScope
    && receipt.artifact_digest === candidateDigest
    && receipt.effective_date === v1cyclePublicationDate
    && receipt.public_html_routes === 90
    && receipt.public_json_exports === 9
    && receipt.publication_updates === 8
    && aggregate?.baseline_v1month?.receipt_id === "164-LOCAL-VALIDATION-2026-09-01-d2846dc22604"
    && aggregate?.baseline_v1month?.artifact_digest === "c306c3db8f861805be0482f82985df7de7fa1124b055f8e76023b5ba680c8a19"
  );
}

export async function computeV1cycleDigestFromDisk({ dataRoot, updatesRoot }) {
  const exportsByName = new Map();
  for (const name of v1cycleExportNames) exportsByName.set(name, JSON.parse(await readFile(join(dataRoot, name), "utf8")));
  const updatesByName = new Map();
  for (const phase of v1cyclePhases) {
    const name = `${v1cyclePublicationDate}-phase-${phase}.json`;
    updatesByName.set(name, JSON.parse(await readFile(join(updatesRoot, name), "utf8")));
  }
  return computeV1cycleDigest({ exportsByName, updatesByName });
}

export async function findMatchingV1cycleReceipt({ receiptRoot, aggregate, candidateDigest }) {
  let names = [];
  try { names = await readdir(receiptRoot); } catch { return null; }
  const matches = [];
  for (const name of names.filter((item) => item.endsWith(".json"))) {
    try {
      const receipt = JSON.parse(await readFile(join(receiptRoot, name), "utf8"));
      if (isValidV1cycleValidationReceipt({ receipt, aggregate, candidateDigest })) matches.push(receipt);
    } catch { /* Ignore malformed unrelated files; assertions report them separately. */ }
  }
  return matches.sort((a, b) => String(b.validated_at).localeCompare(String(a.validated_at)))[0] ?? null;
}
