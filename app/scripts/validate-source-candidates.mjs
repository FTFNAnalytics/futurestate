import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const scriptDirectory = path.dirname(fileURLToPath(import.meta.url));
const workspaceRoot = path.resolve(scriptDirectory, "../..");
const registryPath = path.join(workspaceRoot, "private-data", "source-candidates.json");
const activeSourceDirectory = path.join(workspaceRoot, "app", "src", "content", "sources");

const allowedStatuses = new Set([
  "Discovered",
  "Needs Triage",
  "Candidate",
  "Approved For Source Record",
  "Active Source Record",
  "Watchlist Only",
  "Duplicate",
  "Rejected",
  "Blocked"
]);
const allowedPriorities = new Set(["High", "Medium", "Low"]);
const allowedCredibility = new Set(["Tier 1", "Tier 2", "Tier 3", "Tier 4", "Tier 5", "Do Not Use"]);
const allowedAccessTypes = new Set([
  "API",
  "RSS Feed",
  "Data Download",
  "Docket Search",
  "Filing System",
  "Release Page",
  "Report Series",
  "Interactive Portal",
  "Manual Page Check"
]);
const requiredCandidateFields = [
  "candidate_id",
  "name",
  "url",
  "discovery_source",
  "source_owner",
  "jurisdiction",
  "source_type",
  "credibility_guess",
  "profile",
  "live_access_type",
  "requires_key",
  "what_it_can_prove",
  "candidate_status",
  "priority",
  "human_next_action",
  "last_discovered_date",
  "last_triaged_date"
];
const requiredProfileFields = [
  "topic_pillars",
  "watch_lanes",
  "what_it_cannot_prove",
  "likely_signal_use",
  "local_system_relevance"
];

function normalized(value) {
  return value.trim().toLowerCase().replace(/\/$/, "");
}

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, "utf8"));
}

if (!fs.existsSync(registryPath)) {
  throw new Error(`Private candidate registry not found at ${registryPath}`);
}

const registry = readJson(registryPath);
const errors = [];

if (registry.schema_version !== "1.0") errors.push("schema_version must be 1.0");
if (registry.visibility !== "local-only") errors.push("visibility must be local-only");
if (registry.target_count !== 150) errors.push("target_count must be 150");
if (!registry.profiles || typeof registry.profiles !== "object") errors.push("profiles object is required");
if (!Array.isArray(registry.candidates)) errors.push("candidates array is required");

const profiles = registry.profiles ?? {};
for (const [profileId, profile] of Object.entries(profiles)) {
  for (const field of requiredProfileFields) {
    if (!(field in profile)) errors.push(`profile ${profileId} is missing ${field}`);
  }
  if (!Array.isArray(profile.topic_pillars) || profile.topic_pillars.length === 0) {
    errors.push(`profile ${profileId} must have at least one topic_pillar`);
  }
  if (!Array.isArray(profile.watch_lanes) || profile.watch_lanes.length === 0) {
    errors.push(`profile ${profileId} must have at least one watch_lane`);
  }
}

const candidates = registry.candidates ?? [];
if (candidates.length !== registry.target_count) {
  errors.push(`expected ${registry.target_count} candidates, found ${candidates.length}`);
}

const ids = new Set();
const names = new Set();
const urls = new Set();
const profileCounts = new Map();
const statusCounts = new Map();

for (const [index, candidate] of candidates.entries()) {
  const label = candidate.candidate_id ?? `candidate at index ${index}`;
  for (const field of requiredCandidateFields) {
    if (!(field in candidate)) errors.push(`${label} is missing ${field}`);
  }
  if (!/^candidate-source-\d{3}$/.test(candidate.candidate_id ?? "")) {
    errors.push(`${label} must use candidate-source-### format`);
  }
  if (!profiles[candidate.profile]) errors.push(`${label} references unknown profile ${candidate.profile}`);
  if (!allowedStatuses.has(candidate.candidate_status)) errors.push(`${label} has invalid candidate_status`);
  if (!allowedPriorities.has(candidate.priority)) errors.push(`${label} has invalid priority`);
  if (!allowedCredibility.has(candidate.credibility_guess)) errors.push(`${label} has invalid credibility_guess`);
  if (!allowedAccessTypes.has(candidate.live_access_type)) errors.push(`${label} has invalid live_access_type`);
  if (typeof candidate.requires_key !== "boolean") errors.push(`${label} requires_key must be boolean`);
  try {
    new URL(candidate.url);
  } catch {
    errors.push(`${label} has an invalid URL`);
  }
  if (candidate.candidate_status === "Candidate" && !candidate.last_triaged_date) {
    errors.push(`${label} is Candidate but has no last_triaged_date`);
  }

  const idKey = normalized(candidate.candidate_id ?? "");
  const nameKey = normalized(candidate.name ?? "");
  const urlKey = normalized(candidate.url ?? "");
  if (ids.has(idKey)) errors.push(`duplicate candidate_id ${candidate.candidate_id}`);
  if (names.has(nameKey)) errors.push(`duplicate candidate name ${candidate.name}`);
  if (urls.has(urlKey)) errors.push(`duplicate candidate URL ${candidate.url}`);
  ids.add(idKey);
  names.add(nameKey);
  urls.add(urlKey);

  profileCounts.set(candidate.profile, (profileCounts.get(candidate.profile) ?? 0) + 1);
  statusCounts.set(candidate.candidate_status, (statusCounts.get(candidate.candidate_status) ?? 0) + 1);
}

const activeSources = fs.readdirSync(activeSourceDirectory)
  .filter((fileName) => fileName.endsWith(".json"))
  .map((fileName) => readJson(path.join(activeSourceDirectory, fileName)));
const activeNames = new Set(activeSources.map((source) => normalized(source.name)));
const activeUrls = new Set(activeSources.map((source) => normalized(source.url)));

for (const candidate of candidates) {
  if (candidate.candidate_status === "Active Source Record") {
    if (!activeNames.has(normalized(candidate.name)) && !activeUrls.has(normalized(candidate.url))) {
      errors.push(`${candidate.candidate_id} is marked Active Source Record but has no matching active source name or URL`);
    }
    continue;
  }
  if (activeNames.has(normalized(candidate.name))) {
    errors.push(`${candidate.candidate_id} duplicates active source name ${candidate.name}`);
  }
  if (activeUrls.has(normalized(candidate.url))) {
    errors.push(`${candidate.candidate_id} duplicates an active source URL: ${candidate.url}`);
  }
}

const expectedProfileCount = Object.keys(profiles).length;
if (profileCounts.size !== expectedProfileCount) {
  errors.push(`expected candidates in ${expectedProfileCount} profiles, found ${profileCounts.size}`);
}
for (const profileId of Object.keys(profiles)) {
  if ((profileCounts.get(profileId) ?? 0) !== 10) {
    errors.push(`profile ${profileId} must contain exactly 10 candidates`);
  }
}

if (errors.length > 0) {
  console.error("Private source-candidate validation failed:");
  for (const error of errors) console.error(`- ${error}`);
  process.exit(1);
}

console.log(`Private source-candidate validation passed: ${candidates.length} candidates.`);
console.log(`Active-source duplicate check passed against ${activeSources.length} public sources.`);
console.log(`Profiles: ${[...profileCounts.entries()].map(([key, value]) => `${key} ${value}`).join(", ")}`);
console.log(`Statuses: ${[...statusCounts.entries()].map(([key, value]) => `${key} ${value}`).join(", ")}`);
