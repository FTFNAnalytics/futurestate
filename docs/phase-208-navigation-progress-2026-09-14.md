# Phase 205–216 continuation — bounded reader navigation

Date: September 14, 2026. **Implementation and source-level tests delivered; production/browser acceptance pending.** The full programme and Phase 216 remain incomplete. This updates the [classification continuation](phase-206-classification-progress-2026-09-14.md), not its immutable historical inputs or any earlier build receipt.

## What changed

- Seventeen topic pages now lead with their subject, constraints, recent records, watch questions and short pathway introductions. A mixed, searchable shelf retains all associated signals, research documents, featured sources, organizations, technologies, receiving systems and maps. The four expanded topic drafts have direct links labeled independent-review pending.
- Five local-system pages preserve their complete MDX narratives and headings while replacing repeated inventories with bounded mixed shelves. Explicitly cited sources, geography/role candidates, named receiving-system matches and explicit map IDs remain distinct. The Ontario page links its deeper draft with its pending-review label.
- All fifteen reader pathways have stable `/pathways/<existing-slug>/` pages. Each preserves the current-state account, evidence limits, dependency stages and next-record list, plus a paginated archive of every linked ID. Compact introductions retain the current evidence/operations notices on topic and local pages. The full pathway component is also bounded wherever reused.
- The source monitor now has a complete searchable queue, 40-record pages, recorded dates, cadence basis, endpoint metadata, owner gaps, next actions and separate historical/current-feed signal counts. The source-monitor group anchors are retained. Generating the page does not run probes or refresh sources.
- Updates now have a 40-record index and a dedicated complete receipt page for every existing update ID. Receipt IDs and affected record IDs are searchable. Summary, evidence note, original decision dates, prior/current state, publication effect, next check and affected identities stay on the full receipt. No original update file was removed or rewritten.
- Shared shelves display content kind, status and applicable evidence/classification/relationship labels in both initial HTML and loaded search results. Controls retain query restoration, empty/error states, static page access and the earlier narrow-width containment fix.

The previous pathway component could expand to 1,495 cards for Policy and Standards. Those references are still present in the complete relationship archive; they are no longer all inserted into each topic or place overview. This is not a claim that those historical records have received individual editorial review.

## Inventory and boundaries

There are **43 shelf families and 528 static browse-page paths**, independently enumerated from source inputs. The candidate also adds **15 dedicated pathway routes and 242 dedicated update-receipt routes**. The prepared release expectation is now **11,024 HTML pages, 157 top-level JSON exports and 242 update records**. Nested shelf JSON does not increase the top-level export count. These are candidate expectations, not a completed production build.

All 621 signal classification holds remain. Topic/local/default signal shelves exclude them. The classification archive and explicitly labeled full pathway relationship archives deliberately retain access to their history. Reviewed presentations and pending-classification prefixes travel with these entries. The classification workload is unchanged: 59 reviewed, 58 corrected presentations, 562 remaining individual reviews.

The monitor snapshot is explicitly as of September 14. Its inherited cadence algorithm yields 162 review-due, 286 watch-soon and 385 within-window profiles, including fallback windows. This differs from the separate strict declared-cadence report's 150 overdue profiles because that report does not substitute fallback windows for missing metadata. Twenty-four profiles lack declared cadence or owner information. Neither calculation checks external artifacts.

## Evidence and verification

- `current:generate` passed; the aggregate remains **Pending build**, with no new full validation receipt.
- `current:test` passed, including the new independent navigation inventory assertion: all 43 memberships, unique exact IDs, candidate-versus-cited relationships, classification holds, unchanged source dates, receipt-ID searches, and explicit failure for unresolved pathway references.
- Candidate validation, content-reference validation and source endpoint-metadata validation passed. Script syntax checks passed for the new navigation modules and amended release verifiers.
- Phase 58, 59, 60, 60C, 61, 67 and 145–204 assertions passed after the navigation changes. `git -c core.safecrlf=false diff --check` passed. These remain source-level/historical regressions, not rendered-page acceptance.
- The new production verifier checks complete static membership, matching search exports, sitemap entries, preserved pathway fields/local narrative headings, a maximum of 50 initial result cards and a 200 kB HTML limit on the selected pages. It has **not** run successfully against this candidate yet.
- Historical release checks no longer demand every update be embedded in `/updates/`. They instead require every update exactly once across static browse pages and its complete rendered receipt, including all affected IDs, evidence notes and decision dates. The all-history requirement was retained and strengthened, not replaced by a sample.

The earlier dependency-resolution/access failure still blocks the full production/browser run pending the requested repair approval. No dependency installation, npm network audit, permission change or access workaround was attempted. Existing `dist` is an interrupted/mixed historical output and must not be published.

No commit, push, deployment, public launch, reviewer contact or automated background task was performed. These implementation checks are not independent reader trials, assistive-technology acceptance or Phase 216 completion.

## Inspect and continue

- [Pure shelf projection](../app/src/lib/shelf-data.mjs) and [Astro collection adapter](../app/src/lib/shelf-catalog.ts).
- [Independent source inventory](../app/scripts/lib/read-shelf-inputs.mjs), [source-level assertions](../app/scripts/assert-current-navigation.mjs), [production navigation verifier](../app/scripts/verify-current-navigation.mjs) and [complete update-receipt verifier](../app/scripts/lib/verify-update-archive.mjs).
- [Shared shelf](../app/src/components/review/PagedShelf.astro), [compact pathway](../app/src/components/atlas/ReaderPathwaySummary.astro), [complete pathway](../app/src/components/atlas/ReaderPathway.astro) and [complete receipt renderer](../app/src/components/review/UpdateReceipt.astro).
- [Dated navigation correction](../app/src/content/updates/2026-09-14-reader-navigation-correction.json).

Next: production/type/browser verification when the dependency issue is resolved, remaining shared Atlas page budgets and real reader/assistive-technology journeys. Continue the 562 individual classifications, 25 exact-artifact evidence adjudications and substantive topic/place reviews independently. The [full remaining-exit table](phase-205-216-followup-2026-09-14.md#remaining-exits--no-silent-completion) still controls the programme. Owner launch approval and thirty actual post-launch days remain required for Phase 216.
