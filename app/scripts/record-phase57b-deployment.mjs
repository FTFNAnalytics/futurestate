import { readFile, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const appRoot = fileURLToPath(new URL("..", import.meta.url));
const workspaceRoot = dirname(appRoot);
const manifestPath = join(workspaceRoot, "deployment", "ftfn-v0.2-build.json");
const manifest = JSON.parse(await readFile(manifestPath, "utf8"));

const receipt = {
  local_content_commit: "35a34fd9e57ea3e96df24a717bf21630098814ee",
  private_runtime_commit: "93f62742251f40c79f99d2c0c4df63cb32fbecc3",
  sites_version_number: 54,
  sites_version_id: "appgprj_6a614e1092d08191bf65779fc35df959~appgver_f80d834f867c8191acba7e258fa5cef0",
  sites_deployment_id: "appgdep_6a6fc63ce3408191ae44dcd4ea8acae7",
  sites_runtime_archive_file_count: 2807,
  sites_runtime_archive_content_hash: "sha256:a19ae21ba620506ff2984d2ba0325161dc1c9ac3e47d814ef749ac377749d244",
  sites_runtime_archive_size_bytes: 140277760,
  local_compressed_deployment_archive_size_bytes: 93605290,
  local_compressed_deployment_archive_sha256: "7CA3A1CE056CAFAEE3DF4EAB60F4233A06A4C4AD5E3DFC12E5463B0EE9FC94D8",
  sites_access: "custom-owner-only-one-owner-no-groups-no-editors-zero-external-visitors",
};

manifest.private_preview = {
  ...manifest.private_preview,
  current_local_content_commit: receipt.local_content_commit,
  current_source_commit: receipt.private_runtime_commit,
  current_version_id: receipt.sites_version_id,
  current_version_number: receipt.sites_version_number,
  current_deployment_id: receipt.sites_deployment_id,
  post_deploy_qa: "passed-version-54-deployment-status-source-provenance-runtime-archive-owner-only-access-and-hosted-phase57b-routes",
};
manifest.phase_57b_delta = { ...manifest.phase_57b_delta, ...receipt };
manifest.last_verified = {
  ...manifest.last_verified,
  hosted_routes_checked: 5,
  preview_qa: "passed-owner-only-version-54-deployment-status-source-provenance-runtime-archive-and-five-hosted-route-checks; custom-access-one-owner-no-groups-no-editors-zero-external-visitors",
};

await writeFile(manifestPath, `${JSON.stringify(manifest, null, 2)}\n`, "utf8");
console.log(`Recorded Phase 57B deployment receipt at ${manifestPath}`);
