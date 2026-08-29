import { readFile, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const appRoot = fileURLToPath(new URL("..", import.meta.url));
const workspaceRoot = dirname(appRoot);
const manifestPath = join(workspaceRoot, "deployment", "ftfn-v0.2-build.json");
const manifest = JSON.parse(await readFile(manifestPath, "utf8"));

const receipt = {
  local_content_commit: "eacabc093596da563d4f2e1c9f728420c0847cca",
  private_runtime_commit: "2b1470a666c2b3069295c46cf43d0e0fa16c2a69",
  private_runtime_parent_commit: "2ff8ba6a79dbca070f73df3536604d7274b13a48",
  sites_version_number: 61,
  sites_version_id: "appgprj_6a614e1092d08191bf65779fc35df959~appgver_a7116e2613d4819190855ebe64ae4af8",
  sites_deployment_id: "appgdep_6a7121a3c66081919439713d92b3b7ba",
  sites_live_url: "https://ftfn-analytics.jbumstead.chatgpt.site",
  sites_runtime_archive_file_count: 3409,
  sites_runtime_archive_content_hash: "sha256:9580e794a7f081b77c15fdb03caa0dc43dc6ca188bb59921dc85279478dbdf7c",
  sites_runtime_archive_size_bytes: 151070720,
  local_compressed_deployment_archive_size_bytes: 94780439,
  local_compressed_deployment_archive_sha256: "D3107860EAC661F1C0ABD2AB02925A4EDB3DFB186D2FDDFC2FFD03CF5AD8F24F",
  sites_access: "custom-owner-only-one-owner-no-groups-no-editors-zero-external-visitors",
};

manifest.private_preview = {
  ...manifest.private_preview,
  current_local_content_commit: receipt.local_content_commit,
  current_source_commit: receipt.private_runtime_commit,
  current_version_id: receipt.sites_version_id,
  current_version_number: receipt.sites_version_number,
  current_deployment_id: receipt.sites_deployment_id,
  post_deploy_qa: "passed-version-61-deployment-status-source-provenance-runtime-archive-owner-only-access; visual-route-qa-not-requested",
};
manifest.phase_57i_delta = { ...manifest.phase_57i_delta, ...receipt };
manifest.notes = "This manifest records the Phase 57I versioned registry change-detection and bounded-observation ingestion expansion. Thirty-six carried Tier 1 sources support twenty Published control panels, nine preserved In Review holds, four structured rails, Research Watch 039, one collection, one update, and a thirty-two-file archive. Amtrak identity diffs, Montana field migrations and project-quarter envelopes, Hanford standalone observations and pair-validator decisions, and NNSA object-level source diffs remain control records rather than operating outcomes. The exact 2,407-page runtime is deployed as owner-only Sites version 61 with one owner, no groups, no editors, and zero external visitors. The release remains 0.2.0-dev; public access, Hostinger DNS, custom-domain attachment, public GitHub synchronization, and package freeze remain unchanged.";
manifest.last_verified = {
  ...manifest.last_verified,
  hosted_routes_checked: 0,
  preview_qa: "passed-owner-only-version-61-deployment-status-source-provenance-runtime-archive; custom-access-one-owner-no-groups-no-editors-zero-external-visitors; visual-route-qa-not-requested",
};

await writeFile(manifestPath, `${JSON.stringify(manifest, null, 2)}\n`, "utf8");
console.log(`Recorded Phase 57I deployment receipt at ${manifestPath}`);
