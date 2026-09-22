import { spawn } from "node:child_process";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { readFileSync } from "node:fs";

process.env.ASTRO_TELEMETRY_DISABLED ??= "1";

const appRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const astroPackagePath = fileURLToPath(import.meta.resolve("astro/package.json"));
const astroPackage = JSON.parse(readFileSync(astroPackagePath, "utf8"));
const astroBin = path.resolve(path.dirname(astroPackagePath), astroPackage.bin.astro);
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
