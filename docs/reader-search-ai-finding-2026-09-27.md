# AI technical finding: out-of-order reader search — September 27, 2026

**Disposition: confirmed defect; fix in the next application batch.** This is an AI technical assessment under the owner's existing authorization, not a human-review request. The selected-article candidate is already in its receipt-bearing second build; its inputs remain frozen for that verification.

Affected source: `app/src/pages/reference/explore/[page].astro`, whole-file SHA-256 `07d361b8898228b3467889a5a752be8d71ec4cd3d7328cca285ccb968b718b3a`.

The reader search starts a fetch whenever its catalog cache is empty. Concurrent initial searches each capture their own query, but the completion handler has no latest-request guard. An older completion can therefore overwrite newer results while the form and URL retain the newer query. The separate `PagedShelf.astro` search already uses a request token; the reader catalog does not.

## Actual reproduction

The existing inline script was extracted unchanged apart from removing its import, transpiled with the installed TypeScript compiler, and evaluated in a Node VM using the actual `searchReaders` function. Minimal DOM, form and fetch doubles allowed deterministic response ordering. This did not launch a browser, emulate a human session, exercise screen-reader behavior or verify visual rendering.

1. Submit `quantum`, then `Toronto`, before the catalog loads. Two fetches are pending.
2. Resolve the second response. The rendered result is `Toronto application`.
3. Resolve the first response. The rendered result becomes `Quantum edition`.
4. The input remains `Toronto`; the last history URL remains `/reference/explore/1/?q=Toronto&kind=`.

The reproduction exited zero with assertions verifying this mismatch. Diagnostic harness: `tmp/check-reader-search-race-20260927.mjs` (local temporary work, not part of the application candidate or recovered source bundle).

## Required implementation and tests

Guard result, status and error mutations by a monotonically increasing search request token. Preserve query history, successful catalog caching, numbered static pages, no-JavaScript fallback, language metadata and 40-result pagination. Test older-success/newer-success and older-error/newer-success completion orders, plus ordinary search and empty results. Do not report the defect as fixed until those regressions pass against the changed inline script and full application validation completes.

Other inspected markup provides a skip link with a focusable main target, native labelled search controls, status regions, static pagination, visible-focus CSS and long-link wrapping. These are code-level observations, not proof of keyboard behavior, contrast, screen-reader announcements, 200% enlargement, narrow reflow or reader comprehension. The complete AI usability/accessibility assessment remains open. The historical participant worksheet remains unchanged with zero actual participants and no invented attempt results.
