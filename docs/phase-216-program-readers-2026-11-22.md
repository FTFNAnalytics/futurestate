# Phase 216 Amtrak Montana and NNSA readings

**Integrated:** November 22, 2026, America/Edmonton.\
**Status:** Local source validation passed. Production verification and Phase 216 completion remain open.

## Delivered content

Amtrak accessible stations, Montana BEAD and NNSA qualified production now display their exact assessed annual narratives on the existing Atlas pages. These three additions contain nine full sections and nine paragraphs, including seven wording corrections from the September 27 AI assessments. Their original records contain no earlier clarification review; the integration preserves that absence instead of assigning a September 22 date.

The [canonical mapping](../app/src/data/canonical-annual-reader-bindings.json) now covers five annual readings and fifteen sections. Its [initial two-reading snapshot](../app/src/data/canonical-annual-reader-bindings-initial-2026-11-22.json) is retained exactly. Nine historical input files are pinned, including the unchanged Montana proposal dossiers and Phase 61 registry.

The new pages separate six saved evidence questions and link to each full dated receipt. These are retained editorial appointments, not agency publication forecasts or new inspections:

| Program account | Counted scope | Independent saved follow-ups |
| --- | --- | --- |
| Amtrak | One defined delivery program; no additional station children | PIDS closeout: December 21. Named-asset reliability: November 25. |
| Montana BEAD | Zero for the parent; 32 separately identified proposal dossiers remain the counting units | Completed project quarter: December 21. |
| NNSA | One specifically scoped two-site program; no additional facility children | GAO baseline and accepted capacity: separate December 21 checks. Recurring qualified output: November 25. |

All dates above are in 2026. The November 25 checks were not run early. Same-day NNSA decisions remain separate, and none of these program accounts acquires a Phase 61 named file.

Original readings and earlier casebooks link back to the Atlas. Montana's parent links to its 32 dossiers; the dossier index now displays the actual eligible inventory instead of the outdated statement that the identity-count targets remain unfinished. Catalog, search, decision export, portfolio-method page and sitemap are integrated. Operating outcomes and release approval are not inferred from those totals.

## Preserved evidence and counts

The catalog contains **321 readings**, with **34 translations**, including the requested eight. Eligibility remains **100 projects and 70 places**. All 32 Montana dossier payloads, the Phase 61 registry and the current evidence ledger retain their exact pre-batch file hashes. The ledger still has thirteen primary identities and twenty-one receipts; no evidence operation, appointment or monitor changed.

The earlier twelve refreshed accounts, six selected-reader mappings and first two annual mappings remain intact. A read-only routing audit finds a current reading or child-dossier path for all 24 original Atlas accounts. That is routing coverage, not proof that every page is fully reconciled or production-verified.

## Actual validation

The [first attempt](../outputs/validation/2026-11-22T22-24-13.167Z-wU1E2F/results.json) passed generation, regressions, candidates, content and source-health metadata, then failed Astro on two implicit-any parameters in the new program-context and dossier-link rendering. Explicit helper return types repaired those errors. No dependency, narrative or evidence receipt changed in that repair.

The [source run](../outputs/validation/2026-11-22T22-33-24.628Z-N1xHbX/results.json) passed all six commands and exited 0, finishing **2026-11-22T22:38:14.300Z**. It covered generation, current regressions, candidates, content, source-health metadata and Astro. Astro checked **1,253 files: zero errors, zero warnings and two existing hints**.

The [historical run](../outputs/validation/2026-11-22T22-33-37.506Z-Qfn5ag/results.json) passed all fourteen commands and exited 0, finishing **2026-11-22T22:33:58.383Z**. Phase 58–67, including 60C, and immutable Phase 145–172 assertions passed. Both logged runs have finished.

The annual integration suite rejects **157 malformed mappings**, plus runtime and retained-receipt mutations. It checks seven assessed corrections, three absent earlier reviews, six independent follow-ups, future-date and wrong-identity exclusions, preserved original routes and unchanged eligibility. Three authored data files match their saved text, three search queries resolve at the expected identities, and the production verifier passes syntax checking. Source-health metadata covers 833 registered sources; it is not live endpoint verification. Git diff checks pass.

Candidate: `1f404ca66f589d93ee0e192733e8afcabef8004ea94b77a92546ac702f2dd1fa`.\
Manifest: `888ca9b2d42e8926c219ecfec924a2de54b56eadb89f2a8690246877ec65c17d`.

Independent recomputation matches **3,990 artifacts**. The candidate remains **Pending build**, with no matching full-validation receipt. The expanded production verifier has not run against rebuilt output.

## Remaining work

Source editing works. A read-only permission check still finds inherited Everyone Deny DeleteSubdirectoriesAndFiles on `app/dist/review`. No cleanup retry, alternate-output bypass, permission change, dependency installation, browser automation, commit, push, deployment or launch occurred.

Next, reconcile the shared historical-account presentation for TSMC and Hanford. Both have six-section exact-route AI-reviewed articles, but the Atlas historical/current flag currently recognizes mapped readings and refreshed accounts rather than these two direct articles. Then audit the full Phase 216 completion contract against authoritative current evidence. Do not treat routing coverage or source-level checks as full release readiness.

Production and recoverability checks, the exact owner launch decision and thirty actual operating days remain separate requirements. Phase 216 and Evidence Cycle 001 stay open.

Sites guidance kept the changes in the existing local Astro site. Writing guidance kept assessment, inspection and integration dates distinct and retained the explicit boundary between eligible identities and operating results.
