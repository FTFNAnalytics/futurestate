# Phase 216 — Dalrymple Ontario and South Australia Atlas readings

**Integrated:** November 22, 2026, America/Edmonton.\
**Status:** Local source integration validated; production rendering and Phase 216 completion remain open.

## Delivered

Three existing Atlas pages now display their complete reviewed readings. They add no new project or place identities.

| Existing Atlas account | Reviewed reading | Scope retained |
| --- | --- | --- |
| Dalrymple grid battery | 191-PROJECT-005 | Construction, energisation and commercial operation are separate dates; local network service and the reported availability period are not statewide reliability. |
| Ontario real estate | 192-PLACE-001 | Provincial, metropolitan and parcel measures remain distinct. Starts, completions, annualised rates, four-quarter totals and vacancy measures retain their own periods and populations. |
| South Australia grid storage | 192-PLACE-002 | State population, generation mix and standing-offer tariffs do not establish an individual battery's performance or every household's bill. |

This batch connects **19 complete sections, 19 nested explanations and 12 dated source notes**. Together with Toronto, Hornsdale and Victorian Big Battery, there are now **six explicit integrations: four projects, two places, 37 sections and 37 nested explanations**. Original source-inspection dates and September 27 AI review decisions are preserved. November 22 is the integration date, not a new source inspection.

The place pages keep their recorded system boundaries visible. Older Atlas background remains in native expandable sections. Ontario's separate Toronto operation notices stay outside the historical background, including the November 21 receipt and November 29 appointment. No provincial outcome or project admission is inferred from those notices.

Five direct links connect accounts with different scopes: Dalrymple to South Australia; South Australia to Dalrymple and Hornsdale; Ontario to Toronto; and Toronto to Ontario. Each link is explicitly bound to the intended account. No unrelated route inherits a review decision.

The original three binding records are preserved exactly in both the current registry and the [initial snapshot](../app/src/data/canonical-reader-bindings-initial-2026-11-22.json). Its SHA-256 is `3f7a94d71a2a35a88841efb0cd753ea21bbfcad72cf5a79fcc8b063482efd508`. Six full-file historical inputs remain hash-exact. The original selected-review API remains route-exact; only the six named canonical mappings may reuse the corresponding reviewed presentation.

Eligibility remains **100 projects / 70 places**, with 91 additive accounts across 31 groups and the original baseline preserved. The reader catalog retains **304 entries**. These integrations do not count existing identities again or certify every older Atlas account.

## Validation

The [source run](../outputs/validation/2026-11-22T18-52-01.738Z-vm15j0/results.json) passed all six commands: generation, current regression checks, candidate validation, content validation, source-health metadata and Astro checking. It finished at **2026-11-22T18:57:08.622Z** with terminal exit 0. Astro checked **1,244 files: zero errors, zero warnings and two existing hints**.

The [historical run](../outputs/validation/2026-11-22T18-56-01.082Z-FkyUvc/results.json) passed all fourteen commands, covering Phase 58–67 including 60C and immutable Phase 145–172 assertions. It finished at **2026-11-22T18:56:36.749Z** with terminal exit 0.

Canonical-reader tests rejected **71 malformed mapping decisions** and runtime article/identity mutations. They checked the unchanged first three decisions, six historical pins, exact routes, five related links, complete paragraph counts, visible system/stage boundaries and retained portfolio counts. All ten directly edited or new application files matched the intended text on readback.

All **34 translated readings**, including the requested eight, pass the retained checks: seventeen topics, 204 sections and 276 source-link instances. Source-health checks validate metadata, not live endpoint availability.

The production verifier now covers both project conversion stages and place system boundaries, six- and seven-section articles, separate operation notices and the related-account links. It has not run against newly rebuilt production HTML.

## Candidate and remaining requirements

Candidate: `a517fa9d834b556ffa20c7d2a9dcf2e81956c89d9cd1e41bc83137bc66ffdf7f`.

Manifest: `7a3773aa3f0f38e79c87cb9813f35a3ba51c33e1403bd34e28f78128e94516aa`. Independent recomputation matches. The candidate binds **3,965 artifacts**, including both new files. Expected output is **16,875 HTML / 161 JSON / 409 updates**, not observed production totals. Local validation remains **Pending build**, with no matching full-validation receipt. Git diff checks pass.

Source editing works. A fresh read-only ACL check still finds inherited Everyone Deny DeleteSubdirectoriesAndFiles on `app/dist/review`. No production cleanup or build was retried. No alternate-output bypass, dependency installation, permission/security change, browser automation, commit, push, deployment or launch occurred.

Continue exact-version reconciliation of older canonical accounts, using an existing reviewed reading only when the identity and scope match. The F-15EX related casebook is a candidate for the next mapping audit, not an approved integration. Unmatched accounts require substantive content work. Production/recoverability checks, an exact owner release decision and thirty real operating days remain separate requirements.

Site and writing guidance preserved the existing Astro structure, made complete narratives accessible on their established pages and kept substantive scope limits beside their claims. No Pages creation or Sites publication occurred. No source was newly inspected, no evidence gate was rerun and no appointment was rescheduled. Evidence Cycle 001 and Phase 216 remain open. The monitor's previously blocked update was not retried.
