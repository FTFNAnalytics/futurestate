import { spawn } from "node:child_process";
import path from "node:path";
import { fileURLToPath } from "node:url";

process.env.ASTRO_TELEMETRY_DISABLED ??= "1";

const appRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const astroBin = path.join(appRoot, "node_modules", "astro", "astro.js");
const args = process.argv.slice(2);

const child = spawn(process.execPath, [astroBin, ...args], {
  cwd: appRoot,
  env: process.env,
  shell: false,
  stdio: "inherit"
});

child.on("exit", (code) => {
  process.exit(code ?? 1);
});

child.on("error", (error) => {
  console.error(error);
  process.exit(1);
});
