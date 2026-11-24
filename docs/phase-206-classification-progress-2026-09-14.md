# Phase 205–216 continuation — classification and archive

Date: September 14, 2026. State: **additional implementation complete; the twelve-phase programme is still in progress**. Full production validation remains pending the previously reported dependency-access issue. This report updates the counts in the [earlier same-day follow-up](phase-205-216-followup-2026-09-14.md); it does not replace any immutable validation receipt.

## Delivered

- Individually read and classified the remaining 46 Phase 57M–N records: 31 FTFN method/test notes and 15 historical research dockets. The reviewed material comprises each full body, headline, summary, publication/type/maturity/evidence/verification labels, denominator and editorial notes. This was not a keyword or phase-prefix verdict, a fresh outside-source verification or an independent review.
- Authored distinct corrected titles, summaries and reasons for all 46. Their historical zero-evidence and synthetic-test counts are attributed to FTFN. Nextlink, Starlink, Montana, Amtrak PIDS/reliability, Hanford and the three NNSA questions keep their distinct identities. Later evidence-cycle decisions are unchanged.
- All 59 completed classifications now pin the exact reviewed source-file SHA-256. Regeneration rejects an edited input even if the quoted excerpt survives. Unknown pins and missing excerpts also fail. A newly edited record requires another individual review rather than inheriting the earlier classification decision.
- Fixed an origin-cohort bug: screening provenance now remains a separate field and cannot overwrite a subsequently authored individual review reason. Regression tests cover the additional-origin records as well as the original cohort.
- Added a deliberate classification archive with search, classification/publication/topic filters, static 40-record pages and a metadata export. Unreviewed titles are explicitly prefixed “Under review”; summaries show the hold reason. None of its 621 entries is restored to the external-development feed.
- Matched shelf heading levels to their surrounding sections in initial HTML and dynamically created results. This is a source change awaiting production/browser verification, not an assistive-technology acceptance result.
- Added a dated correction update containing all 46 new IDs and the original Amtrak example whose type/maturity labels were completed. Original MDX files, original dated updates, publication states, IDs and detail URLs were preserved.

## Current inventory

| Classification state | Count |
|---|---:|
| Individually reviewed | 59 |
| Corrected current presentations | 58 |
| Reviewed FTFN method/test notes | 40 |
| Reviewed research dockets | 18 |
| Reviewed mixed issuer-claim/analysis record, awaiting outside-source review | 1 |
| Original-screen records still unreviewed | 370 |
| Additional-origin records still unreviewed | 192 |
| Total individual reviews remaining | 562 |
| Current-feed holds retained | 621 |

The one mixed record concerns physical manufacturing fixtures; it is not mislabeled as a software test. Classification remains separate from source currency, publication approval and evidence admission.

## Inspect

- [46 individual authored decisions](../app/scripts/content-205-216/claim-reviews-57mn.mjs)
- [Exact reviewed-input hashes](../app/scripts/content-205-216/claim-review-inputs.json)
- [Complete generated ledger](../app/src/data/phase-206-editorial-classification.json)
- [Dated correction update](../app/src/content/updates/2026-09-14-57mn-individual-classifications.json)
- Archive routes: `/method/editorial-review/`, `/browse/classification/1/` through `/browse/classification/16/`, and `/data/shelves/classification.json`.

Candidate expectations are now **10,318 HTML pages, 157 top-level JSON exports and 241 updates**. The four shelf families add 79 static browse pages; nested shelf JSON files do not count as top-level exports. These are independently prepared source-input expectations, not a successful production-build result.

## Validation and next action

`current:generate`, `current:test`, candidate validation, content-reference validation and source endpoint-metadata validation passed. The classification assertions check exact per-ID authored reasons, all pinned inputs, preservation of raw source hashes, current-feed exclusion, and negative edited-input cases. Production verification has been extended to check archive membership and all corrected type/evidence/verification/maturity fields, but has **not** run successfully against this new candidate.

The final regeneration completed its content/aggregate stages but encountered one `UNKNOWN` file-open error while saving the manifest. Read-only inspection confirmed valid, intact JSON with the expected 10,318 / 157 / 241 inventory. A retry of the same authorized local manifest-preparation command succeeded, and current tests passed again. No permission change or access workaround was used. Separate Phase 58, 59, 60, 60C, 61, 67 and 145–204 assertions passed. `git -c core.safecrlf=false diff --check` passed; those checks are not a substitute for the blocked full production run.

Source-currency metadata remains 833 sources, 150 overdue profiles and 24 missing cadence/owner fields. This check makes no network request and is not an outside-source refresh.

No dependency repair, npm network audit, permission change, reviewer contact, Git commit/push, deployment or launch was performed. The old `dist` remains an interrupted/mixed output and must not be published. Approval for the previously requested dependency repair/network audit remains pending; no restriction was bypassed.

Next internal work: classify the remaining 562 records; review launch-selected briefings/research documents; adjudicate the 25 prepared evidence identities against exact official artifacts; finish the remaining large shelves and substantive topic/place reviews. The [full remaining-exit table](phase-205-216-followup-2026-09-14.md#remaining-exits--no-silent-completion) and [independent-review handoff](phase-205-216-review-handoff-2026-09-14.md) still apply. Phase 216 additionally requires a real owner launch decision and thirty actual post-launch days. No future completion is represented here.
