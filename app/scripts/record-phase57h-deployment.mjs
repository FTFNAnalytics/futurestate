import { readFile, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const appRoot = fileURLToPath(new URL("..", import.meta.url));
const workspaceRoot = dirname(appRoot);
const manifestPath = join(workspaceRoot, "deployment", "ftfn-v0.2-build.json");
const manifest = JSON.parse(await readFile(manifestPath, "utf8"));

const receipt = {
  local_content_commit: "7d7e4dcf2aad983a480d7e64c487a40438c15b88",
  private_runtime_commit: "2ff8ba6a79dbca070f73df3536604d7274b13a48",
  private_runtime_parent_commit: "aa7a53d4e60b59120a641620fcf40c7a1704ec24",
  sites_version_number: 60,
  sites_version_id: "appgprj_6a614e1092d08191bf65779fc35df959~appgver_c4697f64c2dc8191a1ab5c7956add934",
  sites_deployment_id: "appgdep_6a711a0bdc348191aceec93762957132",
  sites_live_url: "https://ftfn-analytics.jbumstead.chatgpt.site",
  sites_runtime_archive_file_count: 3316,
  sites_runtime_archive_content_hash: "sha256:379ef83160e4ca5eda4e3e362a34ce0330b12a7d3c3f72ff38f2db09af65b39f",
  sites_runtime_archive_size_bytes: 149350400,
  local_compressed_deployment_archive_size_bytes: 94612459,
  local_compressed_deployment_archive_sha256: "60C57EC7E35C41E12E46D710D68872B08A8D6CE2CA72A1912693BDFFCEBB1B13",
  sites_access: "custom-owner-only-one-owner-no-groups-no-editors-zero-external-visitors",
};

manifest.private_preview = {
  ...manifest.private_preview,
  current_local_content_commit: receipt.local_content_commit,
  current_source_commit: receipt.private_runtime_commit,
  current_version_id: receipt.sites_version_id,
  current_version_number: receipt.sites_version_number,
  current_deployment_id: receipt.sites_deployment_id,
  post_deploy_qa: "passed-version-60-deployment-status-source-provenance-runtime-archive-owner-only-access; visual-route-qa-not-requested",
};
manifest.phase_57h_delta = { ...manifest.phase_57h_delta, ...receipt };
manifest.notes = "This manifest records the Phase 57H registry-revision, provenance, and compatible-observation expansion. Thirty-six carried Tier 1 sources support twenty Published panels, nine preserved In Review holds, four structured matrices, Research Watch 038, one collection, one update, and a thirty-two-file archive. Amtrak aliases and revision states, Montana field provenance and project versions, Hanford authority and observation compatibility, and NNSA work-breakdown source history remain bounded provenance records rather than operating outcomes. The exact 2,347-page runtime is deployed as owner-only Sites version 60 with one owner, no groups, no editors, and zero external visitors. The release remains 0.2.0-dev; public access, Hostinger DNS, custom-domain attachment, public GitHub synchronization, and package freeze remain unchanged.";
manifest.last_verified = {
  ...manifest.last_verified,
  hosted_routes_checked: 0,
  preview_qa: "passed-owner-only-version-60-deployment-status-source-provenance-runtime-archive; custom-access-one-owner-no-groups-no-editors-zero-external-visitors; visual-route-qa-not-requested",
};

await writeFile(manifestPath, `${JSON.stringify(manifest, null, 2)}\n`, "utf8");
console.log(`Recorded Phase 57H deployment receipt at ${manifestPath}`);
