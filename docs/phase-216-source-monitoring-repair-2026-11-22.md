# Phase 216 reading confirmation and source monitoring repair

**Date:** November 22, 2026, America/Edmonton.\
**Status:** Requested readings are integrated; source-level maintenance advanced. Phase 216 remains open.

## Reading integration

The eight October 28 readings—Climate, Critical Minerals, Cybersecurity and Discovery Technologies in French-Canadian and Latin-American Spanish—remain integrated with their original integration dates. The current collection contains all 34 translated readings across seventeen topics. This continuation did not translate them again, alter their assessments or redate their source checks.

The preceding [Nevada comparison and Atlas coverage work](phase-216-nevada-comparison-2026-11-22.md) remains intact: all 24 original project routes and fifteen original place routes have a dedicated current account, including excluded Context parents. There are 335 catalog readings. The 100-project/70-place eligibility totals are separate from approval of every reachable historical text and from release acceptance.

## Source monitoring repair

The remaining Phase 207/214 metadata audit found 24 older source profiles without either a publisher label or a review cadence. A [dated monitoring policy](../app/src/data/source-monitoring-policy.json) now supplies explicit editorial intervals and publisher labels without rewriting the profiles. Each policy row binds the exact retained source JSON and states its rationale.

The intervals follow the retained source frequency and priority descriptions: seven days for the Toronto portal queue, thirty days for high-priority non-annual sources, ninety days for medium-priority program/discovery sources and 365 days for annual references. The policy begins November 22; it is not a source inspection, agency publication forecast or evidence-gate reschedule. The publisher label is not an assignment of FTFN work to that agency. No unattended monitoring commitment or automation was created.

The current command now shows both the raw and effective metadata states:

| November 22 metadata state | Raw profiles | With the explicit policy |
| --- | ---: | ---: |
| Profiles | 833 | 833 |
| Missing valid metadata | 24 | 0 |
| Beyond editorial interval | 664 | 686 |
| Within editorial interval | 145 | 147 |

The increase in overdue entries exposes 22 previously unclassified profiles. It does not mean 686 endpoints failed or 686 claims became false. Later scoped receipts must be reconciled before choosing live checks; the command deliberately does not turn those receipts into blanket profile freshness or replace independent project appointments.

The [source-currency helper](../app/src/lib/source-currency.mjs) rejects invalid, stale or duplicate policy inputs. Impossible or future inspection dates, missing publisher labels, and nonpositive, noninteger or excessive cadences cannot be labeled current. Its tests cover the exact cadence boundary, leap days, historical dates before the policy took effect, unchanged inputs and 29 rejected policy mutations. Policy rows cannot add inspection dates or next-operation appointments.

The current command, assertion suite and candidate fingerprint include this implementation. The [monitoring plan](source-monitoring-plan.md#november-22-current-command-metadata-policy) explains its boundaries. This is a local command improvement; the public Source Monitor's older heuristic was not silently changed.

## Remaining completion requirements

The original Phase 205–216 work packages contain dated starting-state language. Their old dependency-repair and mandatory-human-review assumptions do not override the repaired dependencies or the September 25 owner-authorized AI review policy. Neither that policy nor this audit supplies actual production, hosted, reader-study or stewardship evidence.

| Requirement | Local evidence | Remaining acceptance |
| --- | --- | --- |
| Baseline and claim integrity, Phases 205–206 | Current projections, corrections and classification regressions pass; retained history is preserved. | Exact rebuilt output, internal links and applicable security/release checks. |
| Evidence operations, Phase 207 | Thirteen primary identities, twenty-one current-ledger receipts, a separate Toronto receipt and 25 backlog determinations remain saved. | Reconcile future independent appointments and verify full output propagation before closing the cycle. Raw profile age is not a substitute for this reconciliation. |
| Reading journeys, Phase 208 | Canonical current accounts, typed search and bounded shelves have source checks. | Rendered budgets and authorized browser, keyboard and assistive-technology checks. |
| Selected content, Phases 209–212 | All 33 selected article and 58 annual AI assessments are integrated, including the selected topic, project/place, answer and case work. | Verify the selected candidate's rendered contents and scope; do not treat these assessments as blanket acceptance of linked history. |
| Measurement pilot, Phase 211 | Three documented pilot outcomes; zero governed series admissions. | The conditional measured-series feature stays unshipped until compatible inputs, reproduction and an authorized admission exist. |
| Reading formats, Phase 213 | English format work and all 34 French/Spanish readings are present. | Verify actual rebuilt pages, citations, language metadata and accessible behavior; AI review is not a human observation. |
| Maintenance, Phase 214 | Current/historical checks and correction transition tests remain; 24 metadata omissions now have exact policies. | Reconcile release-supporting source currency and perform full output/recoverability checks. |
| Delivery, Phase 215 | A new local candidate fingerprint is saved. | Normal production/post-build/full release verification, authorized source-to-hosted delivery, and verified rollback. |
| Launch and stewardship, Phase 216 | No new launch decision or operating period is claimed. | An exact owner launch decision after mandatory gates, followed by thirty actual operating days and real dated stewardship. |

November 25 Amtrak reliability and NNSA recurring-rate gates were not run early. Toronto retains November 29, Loudoun policy December 2, and the other reconciled follow-ups December 21. No receipt, gate identity, appointment or monitor instruction changed here.

## Validation

The [source run `2026-11-23T01-02-13.603Z-L5wDJa`](../outputs/validation/2026-11-23T01-02-13.603Z-L5wDJa/results.json) passed all six commands: `current:generate`, `current:test`, `validate:candidates`, `validate:content`, `source:health` and `check`. Its process exited 0 and finished 2026-11-23T01:05:43.142Z, still November 22 in Edmonton. Astro checked **1,267 files with zero errors, zero warnings and two existing hints** (`contractById` and `htmlEscape`).

The [historical run `2026-11-23T01-02-25.823Z-Aofq6O`](../outputs/validation/2026-11-23T01-02-25.823Z-Aofq6O/results.json) passed all fourteen commands: Phase 58–67 assertions including 60C, plus `test:v1rc`, `test:v1month` and `test:v1cycle` for immutable Phase 145–172 contracts. Its process exited 0 and finished 2026-11-23T01:02:41.413Z. Both processes are terminal; no intermediate result is treated as completion.

Focused metadata assertions, the actual command output, syntax, preservation hashes and `git diff --check` passed. Independent recomputation matches the 4,016-artifact candidate:

- Candidate: `bc77b77aee77c733eb37a098cd7daee7664afc03547f6f60ad1e9211826bfeab`.
- Manifest: `e16188308ed06290755fc865fda69614042f93c6977b70c793497fb108b3e71a`.
- State: **Pending build**, with no full-validation receipt.

These passes do not include production rendering, post-build/full release verification, browser observations or hosted acceptance.

## Access and preservation

Source edits succeeded. A read-only ACL check still finds inherited **Everyone / Deny / DeleteSubdirectoriesAndFiles** on `app/dist/review`. The normal production sequence remains blocked by that restriction. No cleanup retry, alternate-output bypass, permission/security change, dependency installation or stopped browser automation occurred.

Hash comparison confirmed that all 833 source files, the complete Phase 60 current ledger, Phase 61 registry, portfolio eligibility decisions, owner review policy and translated-reading collection were unchanged by this work. The preceding handoff text is retained.

No commit, push, deployment or launch occurred. Evidence Cycle 001 and Phase 216 remain open. The next local source-currency work is claim-scoped triage against saved receipts, not mass repetition of completed checks. The production-output restriction must be resolved before normal production acceptance can proceed.

Sites guidance kept the work in the existing local Astro checkout. Writing guidance kept the report and monitoring policy distinct from source findings and release claims.
