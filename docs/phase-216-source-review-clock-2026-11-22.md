# Phase 216 source review queue clock correction

**Date:** November 22, 2026, America/Edmonton.\
**Status:** Source calculation corrected locally; production and Phase 216 acceptance remain open.

## Defect and correction

The public source queue used the Phase 206 classification ledger's September 15 date to calculate age. That editorial-classification date is unrelated to when the queue is built. Two retained profile dates were later than that clock; the old helper clamped their age to zero. Invalid dates could also fall through to “Current.”

The queue now uses an explicit Edmonton calculation date, shared with Atlas summaries, source coverage and individual source pages. The calculation date is separately exposed in shelf JSON and visible page metadata. It never replaces a source inspection date or a dated evidence decision. Historical replays take an explicit calculation date instead of changing the classification ledger.

The helper treats invalid or future inspection dates and invalid declared cadences as Review due with unresolved age, rather than a current-source status. It also distinguishes “irregular” from “regular”; the former previously matched the latter's substring and received the wrong fallback interval.

| Public metadata queue | Before, frozen September 15 clock | Corrected November 22 calculation |
| --- | ---: | ---: |
| Within window | 375 | 61 |
| Approaching review | 296 | 87 |
| Review due | 162 | 685 |
| Profiles | 833 | 833 |

These counts are age-based prompts, not 685 failed endpoints or factual findings. The queue's next-action text now calls for reconciling later exact-artifact receipts and independent appointments before selecting a new check. No completed source review was repeated.

The preceding [command-only metadata policy](phase-216-source-monitoring-repair-2026-11-22.md) remains distinct. That policy explicitly supplies 24 publisher/cadence resolutions while the public queue retains its labeled raw-profile fallback windows. Its 686-overdue result differs by one source: NIST post-quantum cryptography uses the policy's 30-day interval in the command and the retained 90-day high-priority fallback in the public queue. Its August 30 inspection date remains unchanged in both. This is a disclosed policy-view difference, not an additional evidence decision or a claim that the source was freshly checked.

## Implementation and safeguards

The [source helper](../app/src/lib/sourceFreshness.ts) supplies the shared clock, calendar-day comparisons and conservative invalid-metadata states. The shelf projection preserves original record dates, membership, classification holds and source ordering rules. Atlas summaries, source coverage, source profile pages, queue pages and shelf exports use the same date contract.

A [dated correction entry](../app/src/content/updates/2026-11-22-source-review-queue-clock.json) explains the prior and corrected meanings. The three listed sources are representative examples; the calculation applies across all 833 profiles. The inventory now has 425 update records; no additional portfolio identity, reading or evidence-cycle receipt was created.

The [clock regression suite](../app/scripts/assert-source-review-clock.mjs) covers Edmonton winter and summer midnight boundaries, valid leap days, invalid/impossible/future dates, cadence limits, the exact review boundary, fallback matching, a classification-independent replay and unchanged inspection dates. Invalid card metadata displays “Unresolved metadata,” never “null days” or a fabricated zero-day age.

Production navigation checks are prepared to compare the exported calculation date with all source profiles and the Atlas/source summary pages, then replay every shelf against that date. They also retain membership, search, pagination, route, byte-budget and historical-content checks. These prepared checks have not been run against rebuilt production output.

## Validation

The [source run `2026-11-23T01-16-20.829Z-1iVBFu`](../outputs/validation/2026-11-23T01-16-20.829Z-1iVBFu/results.json) passed all six commands: `current:generate`, `current:test`, `validate:candidates`, `validate:content`, `source:health` and `check`. Its process exited 0 and finished 2026-11-23T01:19:44.345Z, still November 22 in Edmonton. Astro checked **1,268 files with zero errors, zero warnings and two existing hints** (`contractById` and `htmlEscape`).

The [historical run `2026-11-23T01-16-33.297Z-ziSpYc`](../outputs/validation/2026-11-23T01-16-33.297Z-ziSpYc/results.json) passed all fourteen commands: Phase 58–67 assertions including 60C, plus `test:v1rc`, `test:v1month` and `test:v1cycle` for immutable Phase 145–172 contracts. Its process exited 0 and finished 2026-11-23T01:16:48.475Z. Both validation processes and the separate focused navigation run are terminal.

Focused clock/navigation tests, verifier syntax, exact input preservation and `git diff --check` passed. Independent recomputation matches the 4,019-artifact candidate:

- Candidate: `7ad5fc2501cb7e6f33e0b781bcf33b6bf8962eab129a7c0fd4d24d8b25dc22bb`.
- Manifest: `f495a670f8fbf018b33ce65683b36b8f9dbbdacf12ca90572bd7d15350757fc4`.
- State: **Pending build**, with no full-validation receipt.

Source-health checks are metadata checks, not live retrievals. No production-rendering, post-build, full release, browser or hosted pass is claimed.

## Preserved state and remaining work

All 833 source files, the entire current evidence ledger, Phase 61 registry, classification ledger, eligibility decisions, owner review policy, translated readings and the preceding monitoring policy retained their hashes. The eight requested readings and all 34 translations remain integrated. The catalog stays at 335 readings, eligibility at 100 projects/70 places, and the evidence cycle at thirteen primary identities with twenty-one current-ledger receipts.

Source editing works. Read-only permission inspection again confirmed inherited **Everyone / Deny / DeleteSubdirectoriesAndFiles** on `app/dist/review`. No production cleanup retry, alternate-output bypass, permission/security change, dependency installation or stopped browser automation occurred. No commit, push, deployment or launch occurred.

The source-currency work is not a full exact-claim audit of every reachable historical text. Release-supporting claims still need their own dated evidence or visible holds; raw metadata age must not override later scoped receipts. Applicable security, full production/post-build/release and recovery acceptance remain separate, followed by an exact owner launch decision and thirty real operating days. Phase 216 and Evidence Cycle 001 remain open.

Evidence appointments remain November 25 for separate Amtrak reliability and NNSA recurring-rate gates, November 29 for Toronto, December 2 for Loudoun policy and December 21 for the other reconciled follow-ups. No appointment or monitor changed.

Sites guidance kept this in the existing local Astro checkout. Writing guidance kept the public correction and this handoff explicit about calculation dates, inspection dates and unperformed release checks.
