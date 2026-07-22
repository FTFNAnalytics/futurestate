import { readFileSync, readdirSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const appRoot = path.resolve(scriptDir, "..");
const sourcesDir = path.join(appRoot, "src", "content", "sources");

const endpointFieldsByAccessType = new Map([
  ["API", "api_url"],
  ["RSS Feed", "feed_url"],
  ["Data Download", "data_download_url"],
  ["Docket Search", "docket_search_url"],
  ["Filing System", "api_url"]
]);

const sourceFiles = readdirSync(sourcesDir)
  .filter((fileName) => fileName.endsWith(".json"))
  .sort();

const rows = sourceFiles.map((fileName) => {
  const filePath = path.join(sourcesDir, fileName);
  const data = JSON.parse(readFileSync(filePath, "utf8"));
  const accessType = data.live_access_type ?? "Manual Page Check";
  const monitoringStatus = data.monitoring_status ?? "Active";
  const expectedEndpointField = endpointFieldsByAccessType.get(accessType);
  const hasExpectedEndpoint = expectedEndpointField
    ? Boolean(data[expectedEndpointField] || (accessType === "Filing System" && data.docket_search_url))
    : false;
  const endpointCount = [
    data.api_url,
    data.feed_url,
    data.data_download_url,
    data.docket_search_url,
    data.release_calendar_url
  ].filter(Boolean).length;

  let health = "Manual review";

  if (monitoringStatus === "Blocked") {
    health = "Blocked";
  } else if (monitoringStatus === "Paused") {
    health = "Paused";
  } else if (hasExpectedEndpoint) {
    health = "Probe ready";
  } else if (expectedEndpointField) {
    health = "Needs endpoint";
  }

  return {
    fileName,
    id: data.id,
    name: data.name,
    accessType,
    monitoringStatus,
    expectedEndpointField,
    endpointCount,
    health
  };
});

const counts = new Map();
for (const row of rows) {
  counts.set(row.health, (counts.get(row.health) ?? 0) + 1);
}

const problems = rows.filter((row) => row.health === "Needs endpoint");

console.log("FTFN source health report");
console.log(`${rows.length} sources`);
for (const [health, count] of [...counts.entries()].sort()) {
  console.log(`${health}: ${count}`);
}

if (problems.length > 0) {
  console.error("Source endpoint metadata is incomplete:");
  for (const problem of problems) {
    console.error(
      `- ${problem.fileName}: ${problem.name} declares ${problem.accessType} but is missing ${problem.expectedEndpointField}.`
    );
  }
  process.exit(1);
}

console.log("Source endpoint metadata passed.");
