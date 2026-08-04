import { access, cp, mkdir, readFile, rm, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const appRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const sourceDist = path.join(appRoot, "dist");
const hostingPath = path.join(appRoot, ".openai", "hosting.json");
const stageRoot = path.join(appRoot, ".sites-stage");
const stageDist = path.join(stageRoot, "dist");
const clientDir = path.join(stageDist, "client");
const serverDir = path.join(stageDist, "server");

if (path.dirname(stageRoot) !== appRoot || path.basename(stageRoot) !== ".sites-stage") {
  throw new Error("Refusing to prepare a Sites stage outside the app workspace.");
}

await access(path.join(sourceDist, "index.html"));
const hosting = JSON.parse(await readFile(hostingPath, "utf8"));

if (typeof hosting.project_id !== "string" || hosting.project_id.length === 0) {
  throw new Error("app/.openai/hosting.json must contain the Sites project_id.");
}

await rm(stageRoot, {
  recursive: true,
  force: true,
  maxRetries: 5,
  retryDelay: 200
});
await mkdir(clientDir, { recursive: true });
await mkdir(serverDir, { recursive: true });
await mkdir(path.join(stageRoot, ".openai"), { recursive: true });

await cp(sourceDist, clientDir, { recursive: true });
await cp(hostingPath, path.join(stageRoot, ".openai", "hosting.json"));

const worker = `const worker = {
  async fetch(request, env) {
    return env.ASSETS.fetch(request);
  },
};

export default worker;
`;

const wrangler = {
  topLevelName: "ftfn-app",
  name: "ftfn-app",
  compatibility_date: "2026-07-22",
  compatibility_flags: ["no_nodejs_compat"],
  main: "index.js",
  no_bundle: true,
  rules: [{ type: "ESModule", globs: ["**/*.js", "**/*.mjs"] }],
  assets: {
    directory: "../client",
    binding: "ASSETS",
    html_handling: "auto-trailing-slash",
    not_found_handling: "404-page"
  }
};

await writeFile(path.join(serverDir, "index.js"), worker, "utf8");
await writeFile(
  path.join(serverDir, "wrangler.json"),
  `${JSON.stringify(wrangler, null, 2)}\n`,
  "utf8"
);

console.log(`Prepared Sites package stage at ${stageRoot}`);
