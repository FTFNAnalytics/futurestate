import { readFile, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const appRoot = fileURLToPath(new URL("..", import.meta.url));
const workspaceRoot = dirname(appRoot);
const manifestPath = join(workspaceRoot, "deployment", "ftfn-v0.2-build.json");
const manifest = JSON.parse(await readFile(manifestPath, "utf8"));

const receipt = {
  local_content_commit: "8e247466e1e95c032a0e14c455e42ed5d1790416",
  private_runtime_commit: "928dcf828052b5e71208f838264fef5d73c057ad",
  sites_version_number: 55,
  sites_version_id: "appgprj_6a614e1092d08191bf65779fc35df959~appgver_52f0943adcdc8191a2764e07de4715d5",
  sites_deployment_id: "appgdep_6a6fccf316908191b69b2541e9e6c79d",
  sites_runtime_archive_file_count: 2875,
  sites_runtime_archive_content_hash: "sha256:2a06f0eba5215390010de8f3342894cc71d2a553709b91b9939c10bf1e6c41b4",
  sites_runtime_archive_size_bytes: 141434880,
  local_compressed_deployment_archive_size_bytes: 93738296,
  local_compressed_deployment_archive_sha256: "87A2F4EDB1E3906FBEE761EEF9564324A9F8A836FA3F2513A86DBEDEE6997449",
  sites_access: "custom-owner-only-one-owner-no-groups-no-editors-zero-external-visitors",
};

manifest.private_preview = {
  ...manifest.private_preview,
  current_local_content_commit: receipt.local_content_commit,
  current_source_commit: receipt.private_runtime_commit,
  current_version_id: receipt.sites_version_id,
  current_version_number: receipt.sites_version_number,
  current_deployment_id: receipt.sites_deployment_id,
  post_deploy_qa: "passed-version-55-deployment-status-source-provenance-runtime-archive-owner-only-access; visual-route-qa-not-requested",
};
manifest.phase_57c_delta = { ...manifest.phase_57c_delta, ...receipt };
manifest.last_verified = {
  ...manifest.last_verified,
  hosted_routes_checked: 0,
  preview_qa: "passed-owner-only-version-55-deployment-status-source-provenance-runtime-archive; custom-access-one-owner-no-groups-no-editors-zero-external-visitors; visual-route-qa-not-requested",
};

await writeFile(manifestPath, `${JSON.stringify(manifest, null, 2)}\n`, "utf8");
console.log(`Recorded Phase 57C deployment receipt at ${manifestPath}`);
