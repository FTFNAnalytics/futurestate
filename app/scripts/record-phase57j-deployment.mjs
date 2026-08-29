import { readFile, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const appRoot = fileURLToPath(new URL("..", import.meta.url));
const workspaceRoot = dirname(appRoot);
const manifestPath = join(workspaceRoot, "deployment", "ftfn-v0.2-build.json");
const manifest = JSON.parse(await readFile(manifestPath, "utf8"));

const receipt = {
  local_content_commit: "072da57ec806756b6ec60a7c9f32fdd59531b09c",
  private_runtime_commit: "e106dc9c7a9d14276ced1aee755b2fa79ca0d930",
  private_runtime_parent_commit: "2b1470a666c2b3069295c46cf43d0e0fa16c2a69",
  sites_version_number: 62,
  sites_version_id: "appgprj_6a614e1092d08191bf65779fc35df959~appgver_b505fd4ff83c81918ae22b4eaefd88c8",
  sites_deployment_id: "appgdep_6a712967b444819194beb29dfe23132c",
  sites_live_url: "https://ftfn-analytics.jbumstead.chatgpt.site",
  sites_runtime_archive_file_count: 3502,
  sites_runtime_archive_content_hash: "sha256:2d50799ffe822d72cbcd9a11ca9e10c409a4c76488b746ef3f90fcc707f7e447",
  sites_runtime_archive_size_bytes: 152862720,
  local_compressed_deployment_archive_size_bytes: 94961937,
  local_compressed_deployment_archive_sha256: "B6C7A8C577C549BF4F0F17CB140EEC9E25011454BC01BCECFC618BF8A7E9AFE1",
  sites_access: "custom-owner-only-one-owner-no-groups-no-editors-zero-external-visitors",
};

manifest.private_preview = {
  ...manifest.private_preview,
  current_local_content_commit: receipt.local_content_commit,
  current_source_commit: receipt.private_runtime_commit,
  current_version_id: receipt.sites_version_id,
  current_version_number: receipt.sites_version_number,
  current_deployment_id: receipt.sites_deployment_id,
  post_deploy_qa: "passed-version-62-deployment-status-source-provenance-runtime-archive-owner-only-access; visual-route-qa-not-requested",
};
manifest.phase_57j_delta = { ...manifest.phase_57j_delta, ...receipt };
manifest.notes = "This manifest records the Phase 57J historical-backfill, rejection-taxonomy, and review-queue execution expansion. Thirty-six carried Tier 1 sources support twenty Published controls, nine preserved In Review holds, four structured evidence rails, Research Watch 040, one collection, one update, and a thirty-two-file archive. Amtrak historical identity decisions, Montana schema and envelope rejections, Hanford observation and transition rejections, and NNSA object-version classifications remain bounded control records rather than operating outcomes. The exact 2,467-page runtime is deployed as owner-only Sites version 62 with one owner, no groups, no editors, and zero external visitors. The release remains 0.2.0-dev; public access, Hostinger DNS, custom-domain attachment, public GitHub synchronization, and package freeze remain unchanged.";
manifest.last_verified = {
  ...manifest.last_verified,
  hosted_routes_checked: 0,
  preview_qa: "passed-owner-only-version-62-deployment-status-source-provenance-runtime-archive; custom-access-one-owner-no-groups-no-editors-zero-external-visitors; visual-route-qa-not-requested",
};

await writeFile(manifestPath, `${JSON.stringify(manifest, null, 2)}\n`, "utf8");
console.log(`Recorded Phase 57J deployment receipt at ${manifestPath}`);
