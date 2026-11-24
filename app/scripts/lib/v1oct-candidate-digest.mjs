import { createHash } from "node:crypto";
import { readFile, readdir } from "node:fs/promises";
import { join } from "node:path";

export const v1octPublicationDate = "2026-09-01";
export const v1octPhases = Object.freeze([173, 174, 175, 176, 177, 178, 179, 180]);
export const v1octValidatorContractVersion = "phase-180-local-validator-v1";
export const v1octValidationScope = "Local validation of the accelerated append-only Phase 173–180 operating and content layer. The receipt validates prepared content, route/export/update contracts, source bindings, and future/owner stop rules only; it does not create a future-dated evidence result, owner disposition, repository publication, hosted deployment, public launch, or v1 promotion.";

export const v1octExportNames = Object.freeze([
  "phase-173-september-closeout-october-opening-ledger.json",
  "phase-174-evidence-cycle-closure-intake.json",
  "phase-175-owner-disposition-sprint-ii.json",
  "phase-176-longitudinal-admission-and-zero-series-decision.json",
  "phase-177-october-stack-watch-and-source-currency-sweep.json",
  "phase-178-systems-atlas-and-compendium-depth-expansion.json",
  "phase-179-october-weekly-editions-and-month-end-synthesis.json",
  "phase-180-october-state-report-and-v1-promotion-gate.json",
  "v1-october-operating-program.json",
]);

export const v1octSourceNames = Object.freeze([
  "source-177-doe-critical-minerals-battery-projects-august-2026.json",
  "source-177-eia-steo-august-2026.json",
  "source-177-faa-hybrid-electric-demonstration-august-2026.json",
  "source-177-nasa-dss23-goldstone-august-2026.json",
  "source-177-nist-chips-rd-awards-august-2026.json",
  "source-177-nist-tevv-athlon-august-2026.json",
  "source-177-noaa-us-climate-july-2026.json",
  "source-177-usbr-yakima-water-forecast-august-2026.json",
  "source-178-nist-bosch-roseville-sic-july-2026.json",
  "source-178-nist-chips-program-office-awards-august-2026.json",
]);

const clone = (value) => JSON.parse(JSON.stringify(value));
const unique = (values) => [...new Set(values)];
const stable = (value) => {
  if (Array.isArray(value)) return value.map(stable);
  if (value && typeof value === "object") return Object.fromEntries(Object.keys(value).sort().map((key) => [key, stable(value[key])]));
  return value;
};
export const canonicalJson = (value) => JSON.stringify(stable(value));
export const sha256 = (value) => createHash("sha256").update(value).digest("hex");

export function normalizeV1octExport(name, value) {
  const copy = clone(value);
  if (name === "phase-180-october-state-report-and-v1-promotion-gate.json") {
    copy.build_status = "Complete locally — validation pending; future and owner gates held";
    copy.local_validation_receipt = null;
    const gate = copy.state_report_gates?.find((item) => item.gate_id === "180-GATE-15-LOCAL-VALIDATION");
    if (gate) {
      gate.state = "Pending build";
      gate.evidence = "The content-addressed Phase 180 local-validation receipt has not yet been embedded.";
      gate.receipt_id = null;
    }
    copy.counts = { ...(copy.counts ?? {}), passed: 7, held: 8, pending_build: 1, false_passes: 0 };
  }
  if (name === "v1-october-operating-program.json") {
    copy.status = "Complete locally — validation pending; calendar and owner gates held";
    copy.local_validation_state = "Pending build";
    copy.local_validation_receipt = null;
    const phase = copy.phases?.find((item) => item.phase === 180);
    if (phase) {
      phase.status = "Complete locally — validation pending; future and owner gates held";
      phase.counts = { ...(phase.counts ?? {}), passed: 7, held: 8, pending_build: 1, false_passes: 0 };
    }
  }
  return copy;
}

export function computeV1octDigest({ exportsByName, updatesByName, sourcesByName }) {
  if (unique(v1octExportNames).length !== 9) throw new Error("The v1oct digest requires nine unique exports.");
  if (unique(v1octSourceNames).length !== 10) throw new Error("The v1oct digest requires ten unique source profiles.");
  const exports = v1octExportNames.map((name) => {
    const value = exportsByName instanceof Map ? exportsByName.get(name) : exportsByName[name];
    if (!value) throw new Error(`Missing v1oct export ${name}.`);
    return [name, normalizeV1octExport(name, value)];
  });
  const aggregate = exports.find(([name]) => name === "v1-october-operating-program.json")[1];
  const routes = aggregate.public_html_routes ?? [];
  if (routes.length < 9 || unique(routes).length !== routes.length) throw new Error(`The v1oct digest requires a unique route inventory; received ${routes.length}/${unique(routes).length}.`);
  if ((aggregate.public_json_exports ?? []).length !== 9 || unique(aggregate.public_json_exports).length !== 9) throw new Error("The v1oct digest requires nine unique public JSON exports.");
  const updates = v1octPhases.map((phase) => {
    const name = `${v1octPublicationDate}-phase-${phase}.json`;
    const value = updatesByName instanceof Map ? updatesByName.get(name) : updatesByName[name];
    if (!value) throw new Error(`Missing v1oct update ${name}.`);
    return [name, value];
  });
  const sources = v1octSourceNames.map((name) => {
    const value = sourcesByName instanceof Map ? sourcesByName.get(name) : sourcesByName[name];
    if (!value) throw new Error(`Missing v1oct source ${name}.`);
    return [name, value];
  });
  return sha256(canonicalJson({
    contract: v1octValidatorContractVersion,
    scope: v1octValidationScope,
    exports,
    sources,
    public_html_routes: routes,
    public_json_exports: aggregate.public_json_exports,
    publication_updates: updates,
  }));
}

export function isValidV1octValidationReceipt({ receipt, aggregate, candidateDigest }) {
  return Boolean(
    receipt
    && receipt.receipt_id
    && receipt.receipt_type === "Local Validation"
    && receipt.validator_contract_version === v1octValidatorContractVersion
    && receipt.scope === v1octValidationScope
    && receipt.artifact_digest === candidateDigest
    && receipt.effective_date === v1octPublicationDate
    && receipt.public_html_routes === aggregate?.counts?.public_html_routes
    && receipt.public_json_exports === 9
    && receipt.publication_updates === 8
    && receipt.source_profiles_bound === 10
    && aggregate?.baseline_v1cycle?.receipt_id === "172-LOCAL-VALIDATION-2026-09-01-65326aad9d30"
    && aggregate?.baseline_v1cycle?.artifact_digest === "cdf822b6451e02523dbdcadfc0f21470011285033de55c919718785aaffd9b34"
  );
}

export async function computeV1octDigestFromDisk({ dataRoot, updatesRoot, sourcesRoot }) {
  const exportsByName = new Map();
  for (const name of v1octExportNames) exportsByName.set(name, JSON.parse(await readFile(join(dataRoot, name), "utf8")));
  const updatesByName = new Map();
  for (const phase of v1octPhases) {
    const name = `${v1octPublicationDate}-phase-${phase}.json`;
    updatesByName.set(name, JSON.parse(await readFile(join(updatesRoot, name), "utf8")));
  }
  const sourcesByName = new Map();
  for (const name of v1octSourceNames) sourcesByName.set(name, JSON.parse(await readFile(join(sourcesRoot, name), "utf8")));
  return computeV1octDigest({ exportsByName, updatesByName, sourcesByName });
}

export async function findMatchingV1octReceipt({ receiptRoot, aggregate, candidateDigest }) {
  let names = [];
  try { names = await readdir(receiptRoot); } catch { return null; }
  const matches = [];
  for (const name of names.filter((item) => item.endsWith(".json"))) {
    try {
      const receipt = JSON.parse(await readFile(join(receiptRoot, name), "utf8"));
      if (isValidV1octValidationReceipt({ receipt, aggregate, candidateDigest })) matches.push(receipt);
    } catch { /* Assertions report malformed artifacts separately. */ }
  }
  return matches.sort((a, b) => String(b.validated_at).localeCompare(String(a.validated_at)))[0] ?? null;
}
