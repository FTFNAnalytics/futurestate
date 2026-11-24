# Phase 206 — research and briefing attribution tranche

**Date:** September 14, 2026. **State:** This attribution tranche is implemented and source-tested; Phase 206 and Phases 205–216 remain incomplete. There is no new full-build receipt, independent acceptance, GitHub publication or deployment.

## Completed work

Reviewed the complete local content of the 63-document Phase 57Y collection and its directly linked Research Watch 055 briefing. The records are reachable through existing canonical research, source, topic and briefing pages. This is a bounded production tranche, not an owner-approved launch selection or a claim that all research content has been reviewed.

The documents describe 54 FTFN method/test records and nine historical research dockets, but their publisher fields named Amtrak, NTIA or DOE. Their linked agency artifacts do not make those organizations the authors of FTFN test results. Current presentation now identifies FTFN authorship, uses explicit method/docket types, and separates contextual source links from the record's author. Headlines, summaries, findings, interpretation and evidence limits have been corrected. The companion briefing now reads as a historical FTFN method retrospective; its original body and August 10 watch list remain explicitly historical.

Each review pins the complete original input with SHA-256. The 63 original link files are also hash-pinned and retained. There are 63 new corrected FTFN link-file downloads. The original ZIP is labelled a historical archive with uncorrected labels, not silently replaced or presented as the corrected edition.

Corrections propagate through research/briefing detail pages, collections, linked cards, homepage selection, topic/pathway shelves, source pages, search metadata and public research serialization. All 48 collection-reading consumers use the shared non-mutating projection. A regression test rejects a new raw-collection bypass. Published-only exports still exclude the nine In Review documents. Historical identities, dates, source links and publication states do not change.

The historical Starlink research document is not the later mixed Starlink signal: the September 1 and 8 source-review receipts remain on that signal, with their existing hashes and dates. A link to later signal decisions does not retroactively refresh the August 10 document. No operating gate or source-review date was advanced.

## Artifacts

- [Authored attribution reviews and input pins](../app/scripts/content-205-216/reference-attribution-reviews.json)
- [Current attribution ledger, including prior values](../app/src/data/phase-206-reference-attribution.json)
- [Non-mutating projection and corrected link-file format](../app/src/lib/reference-attribution.mjs)
- [Dated public correction](../app/src/content/updates/2026-09-14-reference-attribution-57y.json)
- [Source-level assertions](../app/scripts/assert-current-reference-attribution.mjs) and [production verifier](../app/scripts/verify-current-reference-attribution.mjs)

The candidate digest binds the reviewed inputs, original and corrected downloads, projection, consumers, tests and correction. Build entry checks reject stale input pins before attempting Astro. Production verification is implemented but has not been run against the interrupted/mixed `dist` directory.

## Validation

Passed: current generation and the complete current source-test suite; 150 candidate checks against 833 active sources; content-reference validation with 260 updates; source endpoint metadata checks (603 manual / 230 probe-ready); Phase 58, 59, 60, 60C, 61, 67 and 181–204 assertions; 47 affected Astro source transforms; JavaScript syntax and new-file whitespace/conflict checks; `git -c core.safecrlf=false diff --check`. These establish local source behavior, not a fresh external-source check, production rendering, accessibility acceptance, independent review or release approval.

Source-derived candidate expectations are **11,042 HTML routes, 157 top-level JSON exports and 260 updates**. The aggregate remains `Pending build`, its current validation receipt is null, and v1 remains Held. The prior immutable receipt is not reused.

## Remaining work

The 621-signal review milestone remains complete: 620 corrected presentations, zero pending classifications in that cohort and all 621 feed holds retained. This tranche adds 63 document reviews and one briefing review, not a completion claim for the whole research corpus. Of the raw inventories, 1,566 other document records and 457 other briefings are outside this tranche; which belong in the final launch acceptance scope still needs an explicit selection, and confirmed defects cannot be hidden by that selection.

Continue the remaining editorial/source work and reader-experience checks in the [205–216 follow-up](phase-205-216-followup-2026-09-14.md). Full production validation still needs the dependency-access issue resolved. The dependency-repair/npm-audit approval request remains unanswered; no package repair, permission change or external security audit was attempted here. Independent editorial, identity, series, accessibility and hosted review gates remain distinct. Phase 216 additionally requires an authorized launch and 30 real post-launch days, which cannot be completed by preparing files today.
