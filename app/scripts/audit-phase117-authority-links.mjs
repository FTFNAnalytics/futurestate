import { readFile } from "node:fs/promises";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const appRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const graph = JSON.parse(await readFile(join(appRoot, "src", "data", "phase-117-global-authority-graph.json"), "utf8"));
const timeoutMs = 15000;
const concurrency = 8;
let cursor = 0;
const results = [];

async function checkUrl(rail) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const response = await fetch(rail.official_url, {
      method: "GET",
      redirect: "follow",
      signal: controller.signal,
      headers: { "User-Agent": "FTFN-Authority-Health/1.0 (+https://ftfn.io/method/)" },
    });
    return { rail_id: rail.rail_id, url: rail.official_url, status: response.status, ok: response.ok || [401, 403, 405, 429].includes(response.status), final_url: response.url };
  } catch (error) {
    return { rail_id: rail.rail_id, url: rail.official_url, status: null, ok: false, error: error instanceof Error ? error.message : String(error) };
  } finally {
    clearTimeout(timeout);
  }
}

async function worker() {
  while (cursor < graph.rails.length) {
    const index = cursor++;
    results[index] = await checkUrl(graph.rails[index]);
  }
}

await Promise.all(Array.from({ length: concurrency }, worker));
const failures = results.filter((item) => !item.ok);
console.log(JSON.stringify({ checked: results.length, reachable_or_bounded: results.length - failures.length, failures }, null, 2));
process.exit(failures.length ? 1 : 0);
