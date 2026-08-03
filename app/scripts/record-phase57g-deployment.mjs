import { readFile, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const appRoot = fileURLToPath(new URL("..", import.meta.url));
const workspaceRoot = dirname(appRoot);
const manifestPath = join(workspaceRoot, "deployment", "ftfn-v0.2-build.json");
const manifest = JSON.parse(await readFile(manifestPath, "utf8"));

const receipt = {
  local_content_commit: "c4410e56f5dd8e569deee100241e683fb3aaf937",
  private_runtime_commit: "aa7a53d4e60b59120a641620fcf40c7a1704ec24",
  sites_version_number: 59,
  sites_version_id: "appgprj_6a614e1092d08191bf65779fc35df959~appgver_cc8170184dfc819186ca73b587c6d005",
  sites_deployment_id: "appgdep_6a71116f01f48191b22ec5f4709f8409",
  sites_runtime_archive_file_count: 3223,
  sites_runtime_archive_content_hash: "sha256:7e05704395383861a00c9ba3b877a32bf754eab76e9ea5287e73f4f9c8e3c01d",
  sites_runtime_archive_size_bytes: 147701760,
  local_compressed_deployment_archive_size_bytes: 94441185,
  local_compressed_deployment_archive_sha256: "A4AC7BFB55D4636992222BC1E85A8C4061EC790BB4B1AE9FB5B3CB021D265C98",
  sites_access: "custom-owner-only-one-owner-no-groups-no-editors-zero-external-visitors",
};

manifest.private_preview = {
  ...manifest.private_preview,
  current_local_content_commit: receipt.local_content_commit,
  current_source_commit: receipt.private_runtime_commit,
  current_version_id: receipt.sites_version_id,
  current_version_number: receipt.sites_version_number,
  current_deployment_id: receipt.sites_deployment_id,
  post_deploy_qa: "passed-version-59-deployment-status-source-provenance-runtime-archive-owner-only-access; visual-route-qa-not-requested",
};
manifest.phase_57g_delta = { ...manifest.phase_57g_delta, ...receipt };
manifest.last_verified = {
  ...manifest.last_verified,
  hosted_routes_checked: 0,
  preview_qa: "passed-owner-only-version-59-deployment-status-source-provenance-runtime-archive; custom-access-one-owner-no-groups-no-editors-zero-external-visitors; visual-route-qa-not-requested",
};

await writeFile(manifestPath, `${JSON.stringify(manifest, null, 2)}\n`, "utf8");
console.log(`Recorded Phase 57G deployment receipt at ${manifestPath}`);
