# Phase 216 HTTPS and VPS cutover

The accepted Reference Beta is ready for the owner-coordinated website DNS cutover. Its certificate, full local validation, exact VPS package, production-port HTTPS checks and withdrawal/reapplication rehearsal passed. Website DNS remains unchanged. External VPS requests receive a deliberate 503 holding response until post-DNS renewal and public checks pass; public launch and Phase 216 completion are not claimed.

## Certificate and private checks

Both DNS-01 TXT values matched on `solar.dns-parking.com` and `lunar.dns-parking.com` before the pending Certbot request continued. Certbot exited 0. The certificate expires February 24, 2027 at 16:38:26 UTC; its two subject names, key correspondence and system-trusted chain passed. No private key was exported or displayed. The owner confirmed a DNS export was saved before the TXT changes; that export has not been independently inspected.

The complete private TLS run at `outputs/phase216-vps-production-prep-2026-11-25/tls-test-2026-11-26T17-40-26.000Z.json` passed 21 checks before and after a 503 withdrawal/reapplication. It covered exact HTML/JSON/ZIP/assets, HTTP and www redirects, hidden-file rejection, 404s, range and conditional requests, and TLS 1.2/1.3 with normal certificate validation. The earlier 17:39 attempt caught a lingering 503 during worker reload; the harness was corrected to require five consecutive expected responses, and the full repeat passed. Existing public Nginx configuration and master PID were unchanged.

The browser saved `phase65-undercovered-frontier-systems-2023-2026.zip` to the user's Downloads folder. Its 42,912 bytes and SHA-256 `cf67540043794fab205946c7de217f3cdfc5108de7a444ef1bca05aec35ab5e5` match the staged manifest. The preview and tunnel were stopped afterward. The file was not executed or removed.

Machine certificate receipt: [HTTPS verification](../deployment/phase-216-https-verified-2026-11-26.json). The earlier pending-request receipt remains historical.

## Refreshed evidence and candidate

The [two November 26 follow-ups](phase-207-reliability-rate-rechecks-2026-11-26.md) preserve twenty-one previous receipts and thirteen cycle identities. Both remain bounded In Review watches, next due December 26. The changes require a fresh candidate receipt and staging package; the November 23 candidate's passing result does not cover them.

Validation attempts remain auditable:

- `2026-11-26T17-52-48.050Z-RSNacc`: generation passed; validation failed because the translated-reader test still expected the earlier receipt list.
- `2026-11-26T17-55-14.470Z-pduifS`: deliberately interrupted during generation to finish the related historical/current assertion repair. It has no terminal acceptance receipt.
- `2026-11-26T17-56-38.673Z-syaR9m`: generation passed; validation failed because reviewed regional/dossier inputs compared a frozen whole-ledger hash against the later additive ledger.
- `2026-11-26T18-00-51.185Z-NKzt88`: generation and full validation both exited 0; terminal completion at **18:26:35.412 UTC**. Candidate/content, source-health metadata, current regressions, Phase 58–61/67, immutable Phase 145–172, both production builds, post-build and release verification passed. Separate Phase 62–66 checks passed in `2026-11-26T18-10-59.317Z-DA2jxG`. Metadata does not verify live endpoints.

The repairs retain original review files, receipt contents and historical hashes. A narrowly scoped snapshot helper reconstructs the exact November 21 input for its existing hash; changed earlier receipts or metadata still fail. New assertions independently verify November 26 state, predecessor integrity, propagation assignments and date boundaries. Translation text, assessed narratives, identities and operating-admission holds are unchanged.

Accepted candidate: `ceeff4952f2478e15c6c4df8325d14c4b98f44d6cdc4a0381f27290005557b7d`, receipt `204-FULL-LOCAL-VALIDATION-2026-11-26-f4fe6e6cc8f6`, 4,027 bound artifacts. Source commit: `d1485933daf52b1162892cd21e3a518bde7eb81c`. The build contains 16,894 application HTML pages, 161 top-level JSON exports, 427 updates and 833 canonical sources.

## Verified VPS release

The fresh package is at `/srv/ftfn-staging/20261126-reference-beta`: **22,261 static files / 1,172,696,296 expanded bytes**. Its 212,480,670-byte archive has SHA-256 `daed41750a0065ecb9ae2ab2a43eca5cc3114027201df7d4f92142d1c1de2aa4`; the exact output-manifest file has SHA-256 `aa45896b4fe0494ee0ea775bfd3b9e997a42ec316426d8156e95492bbae1021d`. All uploaded file sizes and hashes matched. Free disk after verification was 16,747,429,888 bytes. The earlier November 25 release remains intact. The browser-saved ZIP's bytes are unchanged in the refreshed package.

The separate `civicballot` host changed independently during validation at 18:14 UTC. Its actual current configuration was reconciled and preserved; the old shared-config hash was not restored. The new baseline before FTFN activation was `9e7dfe2f06c55aafab39084d6a3dd6d6cdb53498c44532da5fe4c02e7c125779`.

Private TLS verification of the refreshed package passed at 18:31:28 UTC. Only the dedicated `/etc/nginx/sites-available/ftfn.io.conf` and its enable symlink were then added. The first immediate post-reload request at 18:34:18 reached an old worker's self-signed default certificate and correctly failed validation; no TLS bypass was used. A read-only recheck confirmed the correct trusted FTFN certificate. The bounded harness now requires stable verified responses, resumes only its exact recorded preview, and preserves the failed log. The complete production-port rehearsal passed at **18:35:11.406 UTC**: 21 checks before and after the 503 withdrawal, public-address hold, and both HTTP ACME challenge paths. The temporary challenge probe was removed; it contained no credentials. Every previously loaded configuration file remained byte-identical, the shared master PID remained 3560039, and Nginx stayed active through graceful reloads. Existing nonfatal name-hash optimization warnings remain; no global tuning or unrelated host edits were performed.

External checks from the owner's computer passed at **18:35:32.671 UTC** using forced-address DNS overrides and normal certificate validation: apex HTTPS returned the intended 503; HTTPS www and both HTTP names redirected to `https://ftfn.io/`. DNS itself was not changed. Private test listeners and the browser tunnel are stopped; only the main server's VPS-loopback candidate preview and external hold remain.

Machine record: [pre-cutover release verification](../deployment/phase-216-vps-precutover-2026-11-26.json). Detailed run logs remain under `outputs/phase216-vps-release-2026-11-26/`; no private certificate key or SSH credential is included in repository records.

## Cutover and renewal boundary

The final website switch is only apex A `198.49.23.145` to `168.231.74.70`, and www CNAME `ghs.googlehosted.com` to `ftfn.io`. Google Workspace MX/SPF, all DKIM/DMARC/verification records, other subdomains and the nameservers must remain intact. Save a fresh zone export before that switch and preserve the former values/TTLs for rollback. Do not reset the zone or remove unexpected conflicting records without review.

The certificate was issued through manual DNS validation and is **not yet automatically renewable**. The installed Certbot 2.9.0 supports `reconfigure`. Once public DNS reaches the VPS, test a certificate-specific webroot renewal and reload hook; confirm the saved renewal settings and timer. Existing crosscurrents renewal hooks were inspected and each is restricted to its own certificate lineage. No hook or configuration for those sites was changed. [Certbot documents the reconfiguration workflow](https://eff-certbot.readthedocs.io/en/stable/using.html#modifying-the-renewal-configuration); [HTTP-01 validation uses the domain's port-80 challenge route](https://letsencrypt.org/docs/challenge-types/).

The dedicated FTFN host and pre-cutover checks are now complete. The owner can apply the website-only DNS prompt below. DNS and renewal verification are post-cutover conditions: keep the holding response until they pass, then activate the approved Reference Beta and record the real launch time. This avoids treating a manual certificate or private-stage success as completed public launch.

### Hostinger DNS-agent prompt

> Update only website routing for ftfn.io. First save a fresh complete DNS-zone export and retain the current values and TTLs for rollback. Verify the existing apex A is 198.49.23.145 and www CNAME is ghs.googlehosted.com. Change that existing apex A (@) to 168.231.74.70 with TTL 300; change that existing www CNAME to ftfn.io with TTL 300. Do not create duplicates. Preserve all Google Workspace MX, SPF, DKIM, DMARC, verification TXT and other records, including both _acme-challenge TXT records. Keep lunar.dns-parking.com and solar.dns-parking.com as nameservers. Do not reset the zone, change email settings or buy/provision anything. If the existing values differ, or additional A/AAAA/CNAME records conflict at @ or www, stop and report them without deleting anything. Show the before/after changes and verify both authoritative nameservers, confirming all other records are unchanged.

After the owner reports completion: independently verify apex/www resolution and preserved mail records; configure and dry-run only the `ftfn-io` webroot renewal, verify persisted settings/timer/reload hook, then complete public checks and remove the holding restriction only if all conditions pass. The previous 14,400-second routing TTL can remain cached for about four hours. DNS rollback restores only the captured A/www values; it is not instantaneous. No post-cutover renewal or public activation is represented as already performed.

The thirty-day operating period starts at actual launch. Full-v1 promotion, unadmitted measurement series and Evidence Cycle 001 closure remain separate decisions.
