# Phase 216 private VPS staging

Recorded November 25, 2026. Authority: the owner's instruction, “Proceed with VPS staging.”

The approved FTFN Reference Beta candidate is staged on the existing VPS and passed exact-file verification, private HTTP checks, selected browser checks, and a private stop/restart rehearsal. **It is not publicly launched.** The temporary preview and SSH tunnel are stopped; the staging files remain available for the next deployment step.

## Scope and isolation

Host: `168.231.74.70` (`srv810445`), Ubuntu 24.04.4 LTS. Staging root: `/srv/ftfn-staging/20261125T231220Z`.

The preview used a separate Nginx process/configuration listening only on `127.0.0.1:18761`, accessed through a temporary SSH tunnel at local port 18762. It used a staging-only noindex header. No public listener, public Nginx virtual host, existing website, DNS record, certificate, firewall rule, dependency or system service was changed. No server reboot, public Nginx reload, Git commit or push occurred. SSH used the dedicated FTFN key with strict matching against the existing trusted host key; no private-key contents were recorded.

The before/after public Nginx configuration digest remained `1399bc2f8b407165d63314285362d0011d1993358d7544a195c448a4492394dc`, and its master PID remained `3560039`, active. There was no FTFN server-name entry. This verifies configuration/process isolation, not a complete functional audit of every other hosted application.

Final available disk space was 18,612,502,528 bytes (about 17.3 GiB). No cleanup was performed. The static copy and compressed transfer archive are both retained.

## Exact release

| Item | Verified value |
| --- | --- |
| Candidate digest | `39ba66d3b6168c2507f16e0bd0d07c014e6f8c3d7a30719844bb90071d1e33c7` |
| Existing full-validation receipt | `204-FULL-LOCAL-VALIDATION-2026-11-23-09d54992be87` |
| Static file count | 22,259 |
| Expanded static bytes | 1,167,056,089 |
| Archive SHA-256 | `4b33aac4d54878956277d10175baf9fdd8e13a20aae064387748f04ac01babae` |
| Manifest file SHA-256 | `f6ebdab5cb8c123a2f597568b47fedd4a04e7c4000eb0db0ee9d95228520b871` |
| Web root | `/srv/ftfn-staging/20261125T231220Z/site` |
| Control files and archive | `/srv/ftfn-staging/20261125T231220Z/control` |

Every extracted file matched the approved manifest's size and SHA-256. Extraction was restricted to `dist/client/`; the Sites Worker and hosting metadata were excluded from the web root. Archive paths and membership were validated before extraction, and extraction refused a nonempty destination. Source and static release bytes were not modified.

The original full logged validation, `outputs/validation/2026-11-24T05-52-36.202Z-X7Iiru/results.json`, records generation and validation exit 0, finishing at 2026-11-24T06:20:17.771Z. The Phase 62–66 supplement also passed. Staging reused this exact candidate; it did not create a new full-build or evidence-validation receipt.

## Actual checks

All timestamps below are UTC on November 25, 2026; log filenames can differ by a millisecond from their contained `checked_at` timestamp.

| Operation | Time | Result |
| --- | --- | --- |
| Local candidate/manifest check | 23:16:19.146 | Passed |
| Read-only VPS preflight | 23:16:32.580 | Passed |
| Isolated directory preparation | 23:16:51.505 | Passed |
| Archive/control upload | 23:18:13.710 | Exit 0 |
| Extraction and all-file hash verification | 23:19:00.513 | Passed |
| First private start | 23:19:05.662 | PID 1381936 |
| First HTTP suite | 23:19:10.579 | 16 checks passed |
| Private stop | 23:22:30.475 | Preview listener absent; public configuration unchanged |
| Private restart | 23:22:35.136 | PID 1383418 |
| Repeated HTTP suite | 23:22:39.898 | 16 checks passed |
| Final private stop | 23:23:23.975 | Preview listener absent; public configuration unchanged |

Each HTTP suite checked ten 200 responses against exact manifest bytes: homepage, catalog, Spanish water edition, Arizona evidence-cycle page, current-decision JSON, research JSON, robots, sitemap, social image and an evidence ZIP. It also checked four expected 404 responses (missing page, `.git/config`, `.env`, and `.openai/hosting.json`), a 206 ZIP byte-range response and a 304 conditional homepage response. The staging noindex header and canonical production URL were checked.

Selected browser checks observed:

- Keyboard skip-to-content behavior reached the main content.
- The catalog showed 335 readers; Hanford search returned the four expected results; the translation filter showed 34 entries.
- Spanish and French water editions loaded with the expected headings. The Spanish edition retained its November 21 integration date and September 1 evidence cutoff.
- Arizona displayed the real November 21 current receipt, earlier September 22 history and December 21 next checkpoint; the agreement remained Published without an operating-admission claim.
- Inspected views reported no console errors or warnings. DOM measurements showed no horizontal overflow at 390- and 1280-pixel requested widths. Screenshot capture was bounded by the app pane; this is not a complete desktop visual or accessibility certification.

**Browser-managed ZIP save remains unverified.** The browser session disappeared during the download-event check. No successful save is claimed. Full ZIP bytes, content type, hash and byte-range delivery passed independently over HTTP. The later Arizona browser check completed in a fresh temporary tab.

The SSH tunnel was closed and local port 18762 was confirmed no longer listening. This rehearsal proves withdrawal/restart of the same isolated candidate, not restoration of a previous public VPS release. Existing owner-only Sites version 80 was not changed or used as a VPS rollback.

## Logs and safe resumption

Machine record: [deployment receipt](../deployment/phase-216-vps-staging-2026-11-25.json).

Local execution evidence and helpers are under `outputs/phase216-vps-staging-2026-11-25/`, including timestamped local-check, preflight, prepare, upload, verify, start, probe and stop JSON records, `run.mjs`, `remote.py` and the isolated `nginx.conf`.

Do not blindly repeat preparation, upload or extraction into this completed directory. The start/stop helpers deliberately require the recorded public Nginx baseline to match; reconcile any subsequent legitimate server change rather than bypassing those guards. No preview server is currently running.

## Remaining public-launch work

1. Complete the browser-managed download-save check and remaining Reference Beta presentation/acceptance checks.
2. Reconcile the independent November 25 Amtrak named-asset reliability and NNSA recurring-rate evidence appointments. This staging turn performed no new primary-source inspections or evidence receipts. The frozen candidate contains 21 current-ledger receipts, thirteen primary identities, four Toronto receipts and 34 translations. Changed release content requires fresh applicable validation and staging verification.
3. Prepare a dedicated production FTFN virtual host, HTTPS/canonical-host configuration and a non-disruptive public activation/withdrawal plan. Test configuration before any reload and preserve all existing sites. Private stop/restart is not a substitute for these production checks.
4. Capture the authoritative DNS zone and preserve email, verification, CAA and other unrelated records; resolve any conflicting A/AAAA/www configuration. Bounded resolver observations still showed apex A `198.49.23.145` and www CNAME `ghs.googlehosted.com`. These observations are not a complete authoritative-zone backup. Earlier Hostinger connector sign-in trouble does not block the now-working SSH path.
5. Coordinate DNS cutover only once production configuration, certificate issuance/verification and the rollback sequence are ready. **Keep DNS unchanged for now.** Public HTTPS, redirects, downloads and release markers must then be verified on the real domain.

The earlier conditional Reference Beta approval remains recorded, but staging alone does not satisfy its remaining gates or authorize unrelated infrastructure changes. Phase 60 closure and Phase 216 completion remain separate and open. No public launch timestamp or real thirty-day stewardship period has started.
