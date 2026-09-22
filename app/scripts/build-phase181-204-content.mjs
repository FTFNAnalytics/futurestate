import { spawnSync } from "node:child_process";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const appRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const scripts = [
  "build-phase181-188-content.mjs",
  "build-phase189-196-content.mjs",
  "build-phase197-204-content.mjs",
  "build-v1-public-reference-edition.mjs",
];

for (const script of scripts) {
  const run = spawnSync(process.execPath, [`./scripts/${script}`], { cwd: appRoot, stdio: "inherit", shell: false });
  if (run.error || run.status !== 0) throw new Error(`${script} failed (${run.error?.message ?? `exit ${run.status}`}).`);
}

console.log("Built the complete Phase 181–204 public-reference layer.");

