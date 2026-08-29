import { readFile, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const appRoot = fileURLToPath(new URL("..", import.meta.url));
const workspaceRoot = dirname(appRoot);
const manifestPath = join(workspaceRoot, "deployment", "ftfn-v0.2-build.json");
const manifest = JSON.parse(await readFile(manifestPath, "utf8"));

const receipt = {
  local_content_commit: "bdf4a3a45d321578b62bf6c90fc59e233e60ea79",
  private_runtime_commit: "a0139a2e104c2b282eef0601620c7af53c9757fb",
  sites_version_number: 57,
  sites_version_id: "appgprj_6a614e1092d08191bf65779fc35df959~appgver_feb6a5594b408191b84dbc1f84e79a3b",
  sites_deployment_id: "appgdep_6a70fc9dc100819192e7756b5af9d4e6",
  sites_runtime_archive_file_count: 3033,
  sites_runtime_archive_content_hash: "sha256:4c9b2e84f6877aefdf36218645c05a014698e858a5d57b44c90ddc154175be80",
  sites_runtime_archive_size_bytes: 144250880,
  local_compressed_deployment_archive_size_bytes: 94052469,
  local_compressed_deployment_archive_sha256: "25078CC8E8BA4DB177EAF11DD369FD0CE455391C7C9318812A07D6A13045FD98",
  sites_access: "custom-owner-only-one-owner-no-groups-no-editors-zero-external-visitors",
};

manifest.private_preview = {
  ...manifest.private_preview,
  current_local_content_commit: receipt.local_content_commit,
  current_source_commit: receipt.private_runtime_commit,
  current_version_id: receipt.sites_version_id,
  current_version_number: receipt.sites_version_number,
  current_deployment_id: receipt.sites_deployment_id,
  post_deploy_qa: "passed-version-57-deployment-status-source-provenance-runtime-archive-owner-only-access; visual-route-qa-not-requested",
};
manifest.phase_57e_delta = { ...manifest.phase_57e_delta, ...receipt };
manifest.last_verified = {
  ...manifest.last_verified,
  hosted_routes_checked: 0,
  preview_qa: "passed-owner-only-version-57-deployment-status-source-provenance-runtime-archive; custom-access-one-owner-no-groups-no-editors-zero-external-visitors; visual-route-qa-not-requested",
};

await writeFile(manifestPath, `${JSON.stringify(manifest, null, 2)}\n`, "utf8");
console.log(`Recorded Phase 57E deployment receipt at ${manifestPath}`);
