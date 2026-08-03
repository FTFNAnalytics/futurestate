import { readFile, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const appRoot = fileURLToPath(new URL("..", import.meta.url));
const workspaceRoot = dirname(appRoot);
const manifestPath = join(workspaceRoot, "deployment", "ftfn-v0.2-build.json");
const manifest = JSON.parse(await readFile(manifestPath, "utf8"));

const receipt = {
  local_content_commit: "2071278ff7244c6cef3bb6428d2913209bc0d963",
  private_runtime_commit: "63921ba8da76c7496a974bb572dbdd2436ecabfe",
  sites_version_number: 58,
  sites_version_id: "appgprj_6a614e1092d08191bf65779fc35df959~appgver_0933ec64326c81918c7a5ddbe27007ae",
  sites_deployment_id: "appgdep_6a7105d5cea48191aae1577dec4deff4",
  sites_runtime_archive_file_count: 3121,
  sites_runtime_archive_content_hash: "sha256:f560a89075f2e7be2c3a43f3d7e52380d1c6d9dea1be8c856c357c5a6523e38a",
  sites_runtime_archive_size_bytes: 145827840,
  local_compressed_deployment_archive_size_bytes: 94234368,
  local_compressed_deployment_archive_sha256: "78503CB09CE31F37CC290C418874F6416D24DE660547A078DD15C8DF4F3F6539",
  sites_access: "custom-owner-only-one-owner-no-groups-no-editors-zero-external-visitors",
};

manifest.private_preview = {
  ...manifest.private_preview,
  current_local_content_commit: receipt.local_content_commit,
  current_source_commit: receipt.private_runtime_commit,
  current_version_id: receipt.sites_version_id,
  current_version_number: receipt.sites_version_number,
  current_deployment_id: receipt.sites_deployment_id,
  post_deploy_qa: "passed-version-58-deployment-status-source-provenance-runtime-archive-owner-only-access; visual-route-qa-not-requested",
};
manifest.phase_57f_delta = { ...manifest.phase_57f_delta, ...receipt };
manifest.last_verified = {
  ...manifest.last_verified,
  hosted_routes_checked: 0,
  preview_qa: "passed-owner-only-version-58-deployment-status-source-provenance-runtime-archive; custom-access-one-owner-no-groups-no-editors-zero-external-visitors; visual-route-qa-not-requested",
};

await writeFile(manifestPath, `${JSON.stringify(manifest, null, 2)}\n`, "utf8");
console.log(`Recorded Phase 57F deployment receipt at ${manifestPath}`);
