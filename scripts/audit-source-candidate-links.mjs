import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const scriptDirectory = path.dirname(fileURLToPath(import.meta.url));
const workspaceRoot = path.resolve(scriptDirectory, "../..");
const registryPath = path.join(workspaceRoot, "private-data", "source-candidates.json");
const registry = JSON.parse(fs.readFileSync(registryPath, "utf8"));
const candidates = registry.candidates ?? [];
const concurrency = 8;
const timeoutMs = 12000;
const results = [];

async function request(candidate) {
  const headers = {
    "User-Agent": "FTFN-source-candidate-audit/0.2 (link validation; no content capture)",
    Accept: "text/html,application/json,application/xml;q=0.9,*/*;q=0.8"
  };

  const runFetch = async (method) => {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), timeoutMs);
    try {
      return await fetch(candidate.url, {
        method,
        headers,
        redirect: "follow",
        signal: controller.signal
      });
    } finally {
      clearTimeout(timeout);
    }
  };

  try {
    let response = await runFetch("HEAD");
    if ([405, 501].includes(response.status)) response = await runFetch("GET");
    const state =
      response.status >= 200 && response.status < 400
        ? "reachable"
        : [401, 403, 429].includes(response.status)
          ? "restricted"
          : [404, 410].includes(response.status)
            ? "broken"
            : "unverified";
    return {
      candidate_id: candidate.candidate_id,
      name: candidate.name,
      url: candidate.url,
      state,
      status: response.status,
      final_url: response.url
    };
  } catch (error) {
    return {
      candidate_id: candidate.candidate_id,
      name: candidate.name,
      url: candidate.url,
      state: "unverified",
      status: "network",
      final_url: "",
      error: error instanceof Error ? error.message : String(error)
    };
  }
}

let nextIndex = 0;
async function worker() {
  while (nextIndex < candidates.length) {
    const index = nextIndex;
    nextIndex += 1;
    results[index] = await request(candidates[index]);
  }
}

await Promise.all(Array.from({ length: concurrency }, () => worker()));

const reachable = results.filter((result) => result.state === "reachable");
const restricted = results.filter((result) => result.state === "restricted");
const broken = results.filter((result) => result.state === "broken");
const unverified = results.filter((result) => result.state === "unverified");

console.log(
  `Candidate link audit: ${reachable.length} reachable, ${restricted.length} access-restricted, ${broken.length} broken, ${unverified.length} unverified.`
);
for (const result of restricted) {
  console.log(`RESTRICTED ${result.status} ${result.candidate_id} ${result.url}`);
}
for (const result of broken) {
  console.log(`BROKEN ${result.status} ${result.candidate_id} ${result.url}`);
}
for (const result of unverified) {
  console.log(`UNVERIFIED ${result.status} ${result.candidate_id} ${result.url}${result.error ? ` (${result.error})` : ""}`);
}

if (unverified.length === results.length) {
  console.error("No candidate could be reached from this environment. Treat the run as a network-layer failure, not as evidence that the URLs are broken.");
  process.exit(2);
}

if (broken.length > 0) process.exit(1);
