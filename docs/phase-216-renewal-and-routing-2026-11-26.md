# Phase 216 certificate renewal and launch hold

Automatic certificate renewal is configured and tested. Launch remains held because the visitor-side `www.ftfn.io` check still reaches the old Google site. The owner authorized launch only after all checks pass; the VPS therefore continues serving its deliberate 503 holding response to external visitors.

## Completed checks

Both authoritative nameservers and Cloudflare/Google public DNS return apex A `168.231.74.70` and www CNAME `ftfn.io`, with authoritative TTL 300. Checked answers contain no competing IPv6 route. All five Google Workspace MX records, SPF and the nameservers match the prior values. These selected public queries are not a complete zone comparison or an email-delivery test. Codex made no DNS edits in this turn.

Certbot 2.9.0 reconfiguration and a separate dry-run using the saved configuration both exited 0. Renewal now uses the FTFN HTTP webroot and a reload hook restricted to `/etc/letsencrypt/live/ftfn-io`. The hook successfully tested Nginx and reloaded it at 19:05:25 and 19:05:56 UTC. The renewal timer is active and enabled. The existing production certificate is unchanged and expires February 24, 2027 at 16:38:26 UTC. Other Nginx configuration bytes were unchanged; existing nonfatal name-hash optimization warnings were not treated as certificate failures or a reason for global tuning. This follows the [Certbot renewal reconfiguration workflow](https://eff-certbot.readthedocs.io/en/stable/using.html#modifying-the-renewal-configuration) and [HTTP webroot validation](https://letsencrypt.org/docs/challenge-types/).

At 19:09 UTC all **22,261** staged files again matched their hashes and sizes, and all **21** production-loopback route checks passed, including exact HTML/JSON/assets/ZIP delivery, redirects, hidden-file exclusion, 404s, conditional/range requests and TLS 1.2/1.3. The normal-DNS apex returns the expected VPS hold. At 19:10:28 UTC the local candidate was recomputed and still matched its accepted full-validation receipt. No application inputs or evidence receipts changed; the earlier terminal full build remains applicable.

## Remaining visitor routing check

The owner's computer initially reached the old address for www and correctly rejected its certificate-name mismatch. A later normal-DNS request reached Google's IPv6 address and returned HTTP 200, not the required canonical 301. The browser independently showed the old Google Sites **Coming Soon** page at `https://www.ftfn.io/`; the apex browser showed the expected VPS holding response. No security warning was bypassed.

A separate request using Cloudflare DNS-over-HTTPS reached `168.231.74.70` and passed normal certificate validation, returning 301 to the apex. This confirms the intended route works through updated DNS; it does not turn the failed normal visitor-path check into a pass. No FTFN hosts-file override was found, and no local DNS, browser security or network settings were changed. The original 14,400-second DNS TTL can outlive the newly lowered TTL in existing caches. Further DNS edits are not indicated by these observations.

## Resume and recovery

Recheck normal-DNS apex/www HTTPS and the browser after cached routing converges. Do not rerun the successful certificate reconfiguration. The prepared public-launch guard requires a fresh passing four-request normal-DNS record and a prelaunch file/route receipt less than thirty minutes old. If those expire, create a new dated precheck rather than editing the earlier successful record. Then enable only the recorded FTFN release configuration, verify the real public candidate and browser flows, and record the actual launch time. On a release failure, return only FTFN to the tested holding configuration; do not restore or overwrite shared Nginx files or unrelated sites.

The renewal webroot and hook live under `/srv/ftfn-staging/20261126-reference-beta/production-prep/`. **Retain those active paths** even though the parent directory contains the word staging. Removing them would break renewal. Private renewal configuration backups and certificate keys stay on the VPS and outside the web root and repository.

The thirty-day stewardship period has not started. Phase 216 completion, full-v1 promotion and Evidence Cycle 001 closure remain separate. This is a routing hold, not a dependency, editing-access, evidence-review or certificate-renewal failure.

Machine receipt: [renewal and routing checkpoint](../deployment/phase-216-renewal-and-routing-2026-11-26.json). Source/main remains the validated release from [PR 4](https://github.com/FTFNAnalytics/futurestate/pull/4); this checkpoint adds documentation only.
