# Phase 216 release and rollback checks

**Recorded:** November 23, 2026 locally; machine timestamps are UTC.\
**Result:** Eleven local recovery/release checks passed. Hosted rollback, domain readiness and launch remain held. No commit, push, deployment, access change, DNS change or launch occurred.

## Validated candidate and local recovery

The [full validation report](phase-216-full-local-validation-2026-11-23.md) remains applicable. The current candidate is:

`39ba66d3b6168c2507f16e0bd0d07c014e6f8c3d7a30719844bb90071d1e33c7`

Its receipt is `204-FULL-LOCAL-VALIDATION-2026-11-23-09d54992be87`, binding 4,020 artifacts. The candidate, original source and generated output did not change during the rehearsal.

The [recovery run](../outputs/phase216-release-checks-2026-11-23/run-T7Yf4V/results.json) completed at **2026-11-24T05:16:15.349Z**, exit 0, with eleven passing checks:

- Archived and restored 10,285 source/documentation files, comparing every file and byte hash.
- Archived and restored 22,259 generated files, including downloads and assets. The separate application-page count remains 16,892.
- Recomputed the candidate from restored source and validated its matching receipt.
- Deliberately corrupted only the restored copy of the home page, detected the mismatch, then restored the archive and verified the complete output again.
- Checked 735,117 local references across all 16,892 application HTML pages: zero missing targets. Structural heading/keyboard-entry checks passed.
- Passed the restored source's correction → held withdrawal → reapplication regression.
- Reran the original workspace's complete release verifier successfully.
- Confirmed the original source/output hashes and Git HEAD were unchanged.

These are exact source/output recovery and projection-level correction tests, not a new dependency installation, pristine-install build, browser trial, hosted version switch or measured recovery-time commitment. The original complete validation passed earlier; this run reused its unchanged candidate. The initial read-only archive preflight exposed a logical-path mapping error for work-package documents; the helper was corrected before the successful archive run. No failed publication or failed restoration is being concealed.

### Retained recovery artifacts

| Artifact | Files | Archive bytes | SHA-256 |
| --- | ---: | ---: | --- |
| [Source archive](../outputs/phase216-release-checks-2026-11-23/run-T7Yf4V/current-source.tar) | 10,285 | 241,746,432 | `5e9f5e01bd89acd99a5b4f39c53c0adeaf6372292dab2b6d7bda19838f9f6283` |
| [Generated-output archive](../outputs/phase216-release-checks-2026-11-23/run-T7Yf4V/validated-output.tar) | 22,259 | 1,184,051,712 | `56a1366b87bf6739db0f65c0220c66413930d3ff08bba1b7f1e574e758f2858e` |

The source manifest hashes to `324f7c351db89b16ca9611b4138354c32158e4ce488608b0c60e2ca915a67acc`; the generated-output manifest hashes to `b55539911f7fe87904584f8543dc6f33c9294be9ec610aec4a6b19aeb6fe0746`. Both manifests and the restored copies are retained beside the archives. They intentionally exclude Git internals, installed dependencies, build caches and task outputs. The source snapshot precedes this new report/handoff; it captures the candidate and earlier documentation, not this later audit.

The generated-output archive is a local recovery artifact, **not** an uploaded or source-commit-bound Sites publication package. Supported publication must still bind the final source commit, lockfile, packaged output, saved Sites version and deployment.

## Hosted baseline and domain findings

The [read-only hosting preflight](../outputs/phase216-release-checks-2026-11-23/hosting-preflight.json) records actual Sites responses and DNS observations. It supersedes older statements that version 79 is the latest hosted baseline.

| Item | Observed state |
| --- | --- |
| Existing Sites project | `appgprj_6a614e1092d08191bf65779fc35df959`, titled FTFN, active |
| Current audience | Custom access with the owner as the sole allowed user and no groups |
| Latest saved version | **80**; its publication deployment reports **succeeded**, updated October 31 UTC |
| Platform address | [Existing FTFN Site](https://ftfn-analytics.jbumstead.chatgpt.site), owner-only |
| Version 80 source commit | `8e1a06156fc1968915e497d84189bb022355afd0` |
| Version 80 archive metadata | 5,198 files, 189,624,320 bytes; SHA-256 `fc53a26e0b58b62e2a0e6cac9070a3a1885564f09e66d2a1950b5b24a89ef1c7` |
| Prior version | 79 also retained with a successful historical deployment; not the current candidate |
| Custom domains | Sites returns Pending / pending_validation for both `ftfn.io` and `www.ftfn.io`; these server status timestamps are from July, not new November failure dates |
| Local DNS resolver | Apex A: `198.49.23.145`; `www` CNAME: `ghs.googlehosted.com`; nameservers: `solar.dns-parking.com` and `lunar.dns-parking.com` |
| Canonical build origin | `https://ftfn.io`; robots allows crawling and names that sitemap |

Version 80's exact saved ID is `appgprj_6a614e1092d08191bf65779fc35df959~appgver_fe03a9c307548191b4a535c664dd8edf`; its deployment ID is `appgdep_6ae53c77565081918fb870d1ef7ea20f`. These are proposed rollback identifiers, not a claim that a rollback was executed or that the older version is approved for a new public audience. The retained archive is confirmed by control-plane metadata; it was not downloaded or re-executed locally.

Neither observed web-routing value matches Sites' returned routing requirements. Changing them could replace existing website destinations. Obtain explicit approval, capture the complete authoritative zone, and preserve mail, verification, transfer, CAA and unrelated records. Do not change nameservers or replace the zone. The bounded resolver queries are not a zone backup or proof that the earlier domain-transfer hold has ended.

Both public web-reader opens were inaccessible; that is neither proof of nonexistence nor a TLS diagnosis. No authenticated hosted browser, mobile, keyboard, download, 404/redirect or access-control test was performed because browser automation remains stopped and this candidate is not deployed.

## Source and release scope

Git remote `origin` is `https://github.com/FTFNAnalytics/futurestate.git`; its recorded default branch is `main`. The working branch is `codex/phase51-content`, HEAD `589467a497976fafed483f25ea8245264b7ee8a7`, with substantial uncommitted work. That HEAD does not identify this candidate. The recovery archives preserve the actual working files without pretending they are a pushed source commit.

The current inventory includes 100 eligible project identities, 70 eligible place identities, a 335-reading catalog, 34 integrated French-Canadian/Latin-American Spanish readings, 33 selected-article assessments and 58 annual assessments. These counts are not a blanket approval of every historical route. The September 25 owner policy authorizes actual AI editorial/language decisions and AI-led usability assessment; a new human-review signature is not being imposed as a build prerequisite. Actual human studies are not claimed.

Source-currency metadata on November 23 still marks 686 of 833 profiles beyond the configured cadence, with zero missing cadence metadata. This is **not** 686 failed endpoints or 686 unsupported claims: additive scoped receipts are deliberately separate from old profile dates. Before publication, reconcile the exact release-supporting current claims and any then-due operations with their saved receipts; do not mass-recheck completed gates or relabel old source dates.

Three measurement pilots remain unadmitted; no operating series or measured-outcomes product may be advertised as delivered. Evidence Cycle 001 is still separately open. New content, future evidence, full-v1 promotion and the thirty-day operating period cannot be supplied by a launch approval.

**Recommended release decision:** a clearly named **FTFN Reference Beta**, comprising the validated reference site, its reviewed reading/translation surfaces and explicitly labelled historical/research material. Keep unsupported outcome features and full-v1 promotion held. This is a proposed scope decision, not an accepted revision of the historical full-v1 contract. The owner may instead retain full-v1 scope and keep launch held until its remaining conditions are satisfied.

## What the owner needs to approve

The owner can approve the following conditional release plan in one explicit response, or change any choice before execution:

1. **Scope and audience:** Approve FTFN Reference Beta for public access, anchored to the exact candidate above. Retain evidence limitations, historical/research labels, AI-review attribution and the hold on unadmitted measurements/full-v1 promotion.
2. **Repository and private release preparation:** Authorize a scoped commit and push to a new `codex/phase216-release` branch in `FTFNAnalytics/futurestate`, PR/merge into `main`, and required source synchronization to the existing Sites project. Preserve unrelated work. Before publishing a branch, check actual repository automation and stop if it would trigger an unapproved deployment. Preserve version 80, then authorize a private deployment and hosted rollback rehearsal. No new project, subscription or billable resource is included.
3. **Browser QA:** Explicitly resume browser automation only for the local/hosted FTFN release checks: desktop/mobile layout, keyboard navigation, search, downloads, representative current/historical/translated routes, 404s/redirects and access behavior. No human-study or independent-review claim follows from those tests.
4. **Domain cutover:** Confirm that `ftfn.io` is the intended canonical domain, `www` should redirect to the apex, and the current apex/Google-hosted web routes may be replaced. Authorize inspection of the DNS account and only the necessary website-routing/validation changes, preserving email and unrelated records. Confirm the domain transfer is complete, or authorize checking that prerequisite in the connected account. No password needs to be pasted into chat.
5. **Launch and stewardship authority:** Keep you as accountable release owner and authorize public access only after the checks below pass. Authorize emergency return to owner-only access, restoration of saved version 80, and restoration of captured pre-change website DNS when needed. Approve the first thirty days of checks/corrections under the existing evidence boundaries; substantive new content, costs or scope changes still require separate authority.

Suggested reply:

> I approve the conditional FTFN Reference Beta release plan in the November 23 Phase 216 release/rollback report, anchored to candidate 39ba66d3b6168c2507f16e0bd0d07c014e6f8c3d7a30719844bb90071d1e33c7. Approve the scoped futurestate commit/push/PR merge, existing-Sites private deployment and rollback test, FTFN-only browser QA, and ftfn.io/www website-only DNS cutover with email preserved. Check transfer/DNS authority first. Make the site public only after every applicable preflight passes. I remain release owner and authorize the stated emergency rollback and thirty-day stewardship plan. Full-v1 promotion and unadmitted measurements remain held.

This wording is an approval request, not a saved owner decision. If the domain, publication scope, repository destination or rollback permissions differ, specify those changes instead. Required connector sign-in/tool approvals, if prompted, remain separate from conversational authorization.

## Execution after approval

1. Freeze the approved content candidate. Record the source commit, lockfile, source/output digests and receipt. Authorization/packaging/routing changes that alter bound inputs require a new candidate receipt; material content/scope changes return for approval. Never attach the current receipt to changed bytes.
2. Prepare the supported Sites package from the pushed source. Preserve and re-read version 80's saved archive, source and access metadata immediately before any deployment.
3. Deploy the new version privately. Verify terminal success and the actual rendered candidate, routes, canonical origin, robots/sitemap, JSON exports, downloads, social assets, redirects/404, and signed-in/signed-out access. Complete the authorized browser checks.
4. While owner-only, exercise the hosted version switch to 80, verify it, then redeploy the approved new version and verify it again. Record exact IDs and observed results. An archived ID alone is not a passing rollback rehearsal.
5. Capture the full authoritative DNS zone and perform the approved website-only cutover. Verify apex/www resolution, TLS and canonical redirect before public access. Reconcile release-supporting source cutoffs and any genuinely due evidence operations. If any mandatory check fails, keep the release private/held and report the blocker.
6. Record the real public-launch decision/time only after success. Start thirty actual operating days then: initial access/route/export checks; weekly source/correction review and release verification after changes; visible incidents/blocked obligations; final day-30 review. Do not prewrite future findings or mark Phase 216 complete at launch.

The historical work packages, candidate authority flags and evidence receipts remain unchanged. This report, retained local diagnostics and a leading handoff checkpoint are the only authored additions in this turn. The existing evidence monitor retains its schedule and due operations.
