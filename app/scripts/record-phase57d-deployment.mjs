import { readFile, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const appRoot = fileURLToPath(new URL("..", import.meta.url));
const workspaceRoot = dirname(appRoot);
const manifestPath = join(workspaceRoot, "deployment", "ftfn-v0.2-build.json");
const manifest = JSON.parse(await readFile(manifestPath, "utf8"));

const receipt = {
  local_content_commit: "2958965b94068a278de4cabf30b24ab7854d7f8a",
  private_runtime_commit: "c04053a70ee1e215802acc800c87c3ec1fa388d2",
  sites_version_number: 56,
  sites_version_id: "appgprj_6a614e1092d08191bf65779fc35df959~appgver_60553c4fac308191926121b0eae9dfdf",
  sites_deployment_id: "appgdep_6a70f38077b88191b373e0c573a0abcf",
  sites_runtime_archive_file_count: 2948,
  sites_runtime_archive_content_hash: "sha256:a268a2febdb3bed405cefabd915525739de8ae9616e3391802bd75edfac46b0f",
  sites_runtime_archive_size_bytes: 142755840,
  local_compressed_deployment_archive_size_bytes: 93886480,
  local_compressed_deployment_archive_sha256: "01045E3908CCED4BC6BD6206DBDED8AF25839C714A23E88AB7A144CC08FF657B",
  sites_access: "custom-owner-only-one-owner-no-groups-no-editors-zero-external-visitors",
};

manifest.private_preview = {
  ...manifest.private_preview,
  current_local_content_commit: receipt.local_content_commit,
  current_source_commit: receipt.private_runtime_commit,
  current_version_id: receipt.sites_version_id,
  current_version_number: receipt.sites_version_number,
  current_deployment_id: receipt.sites_deployment_id,
  post_deploy_qa: "passed-version-56-deployment-status-source-provenance-runtime-archive-owner-only-access; visual-route-qa-not-requested",
};
manifest.phase_57d_delta = { ...manifest.phase_57d_delta, ...receipt };
manifest.last_verified = {
  ...manifest.last_verified,
  hosted_routes_checked: 0,
  preview_qa: "passed-owner-only-version-56-deployment-status-source-provenance-runtime-archive; custom-access-one-owner-no-groups-no-editors-zero-external-visitors; visual-route-qa-not-requested",
};

await writeFile(manifestPath, `${JSON.stringify(manifest, null, 2)}\n`, "utf8");
console.log(`Recorded Phase 57D deployment receipt at ${manifestPath}`);
