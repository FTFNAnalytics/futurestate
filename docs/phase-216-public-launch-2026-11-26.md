# FTFN Reference Beta is live

FTFN Reference Beta launched at **https://ftfn.io/** on November 26, 2026. The first verified public HTTP 200 was at **20:30:58.781417 UTC (13:30:58 MST)**. This supersedes the earlier same-day public holding state; those earlier receipts remain historical records.

The owner's final instruction was: “Go ahead and launch ftfn.io now while the www cache clears. Let me know once it’s live.” This permits residual visitor-side www caching, not bypassing certificate verification or other release checks. The earlier browser observation of Google's Coming Soon page remains a failed old-route observation, not a retrospective pass.

## What passed

- The current source was recomputed at 20:30:07 UTC and matched candidate `ceeff4952f2478e15c6c4df8325d14c4b98f44d6cdc4a0381f27290005557b7d` and receipt `204-FULL-LOCAL-VALIDATION-2026-11-26-f4fe6e6cc8f6`. The full validation finished successfully at 18:26:35.412 UTC, with the separate Phase 62–66 supplement also passed. No application inputs changed during launch.
- A fresh 20:30 prelaunch check verified all 22,261 staged files and passed 21 production-loopback checks. Trusted TLS, saved renewal settings and the active/enabled renewal timer were reconfirmed. Earlier prelaunch receipts were preserved rather than redated.
- Both authoritative nameservers and two public resolvers returned the intended apex A and www CNAME. Known Google Workspace MX/SPF and nameservers matched the prior values. Codex made no DNS changes; these selected queries are not a full-zone comparison or an email-delivery test.
- Only the dedicated FTFN host changed from its public 503 hold to the accepted static release. Nginx configuration testing and graceful reload passed; the shared master stayed active. Every unrelated loaded configuration file remained unchanged.
- All 21 normal-DNS VPS checks passed after activation, including exact HTML/JSON/assets/ZIP delivery, canonical redirects, hidden-file and missing-route 404s, range 206, conditional 304 and TLS 1.2/1.3.
- All 20 external normal-DNS checks passed at 20:31:39 UTC with normal certificate validation. HTTP apex, HTTP www and HTTPS www redirected to HTTPS apex while preserving the path and query. This verifies those client paths, not every visitor cache worldwide.
- The live apex browser rendered the actual FTFN homepage and reference catalog. Searching for “water” returned “40 of 64 matches shown.” The public homepage screenshot is retained locally with the launch logs. No security warning or DNS override was used.

The first external-suite invocation encountered a missing closing brace in the local test helper before any requests ran. The helper was repaired, its syntax check passed, and the actual external suite then exited 0. This was not a public-site failure and did not change the released application.

## Active release and recovery

The public document root is `/srv/ftfn-staging/20261126-reference-beta/site`. Its archive SHA-256 is `daed41750a0065ecb9ae2ab2a43eca5cc3114027201df7d4f92142d1c1de2aa4`. The application source is commit `d1485933daf52b1162892cd21e3a518bde7eb81c`, already merged through PR 4; PR 5 records the earlier renewal checkpoint. This launch handoff adds documentation, not a different build.

Retain the tested FTFN holding/release configurations and the previous stage. If a critical release problem occurs, compare current state and withdraw only FTFN to its tested hold, test Nginx, gracefully reload and verify the hold. Do not restore shared configuration snapshots or interrupt other sites. The actual exposure interval must remain recorded even after any withdrawal.

Automatic renewal was configured and tested before launch. **Retain** `/srv/ftfn-staging/20261126-reference-beta/production-prep/acme` and its `control/reload-ftfn-certificate.sh` hook: they are active renewal dependencies despite the staging directory name. The production certificate expires February 24, 2027 at 16:38:26 UTC. No new issuance, dependency installation or security-setting change was needed for this launch.

## What remains open

Use https://ftfn.io/ while any visitor-side www cache clears. No additional DNS change is indicated by the passing authoritative/public checks. Google's mail records were preserved, but actual mail delivery was not tested.

The approved thirty-day stewardship interval begins with the real launch above. Its earliest thirty-day checkpoint is **December 26, 2026 at 13:30:58 MST**; elapsed time alone will not establish acceptance. Record actual health, correction and recovery observations as they occur. Phase 216 completion, full-v1 promotion, independent review, unadmitted measured outcomes and Evidence Cycle 001 closure remain separate; none is declared complete by this launch. The next evidence appointment remains Toronto on November 29, followed by Loudoun December 2, the separate December 21 operations and the two December 26 follow-ups.

Machine receipt: [public launch](../deployment/phase-216-public-launch-2026-11-26.json). Raw prelaunch, launch, external-check and screenshot evidence is retained under `outputs/phase216-vps-release-2026-11-26/`; raw logs, keys and private server backups are not published to GitHub.
