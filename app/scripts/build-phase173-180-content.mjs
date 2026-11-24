import { spawnSync } from "node:child_process";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const appRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const scripts = [
  "build-phase173-174-control-plane.mjs",
  "build-phase175-176-assets.mjs",
  "build-phase177-178-assets.mjs",
  "build-phase179-assets.mjs",
  "build-phase180-state-report.mjs"
];
for (const script of scripts) {
  const run = spawnSync(process.execPath, [`./scripts/${script}`], { cwd: appRoot, stdio: "inherit", shell: false });
  if (run.error || run.status !== 0) throw new Error(`${script} failed (${run.error?.message ?? `exit ${run.status}`}).`);
}
console.log("Built the complete accelerated Phase 173–180 layer.");
