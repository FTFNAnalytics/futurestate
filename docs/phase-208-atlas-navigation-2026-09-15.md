# Phase 208 — complete Atlas relationship archives

September 15, 2026. Source implementation; production and reader acceptance remain pending. Phases 205–216 are not complete.

## Delivered

The source index now uses the complete source shelf rather than inserting all 833 profiles. The dependency-map index uses a complete paginated shelf rather than repeating every map in three different lists. Existing type/topic anchors and every canonical map URL remain available. The Atlas overview gives bounded map, organization and technology introductions and links to full indexes. Pathway counts now say linked records, not automatically Published external developments; pathway links lead to their full dated accounts. An obsolete hard-coded data-export count is removed.

All 833 source, 19 organization, five technology, sixteen evidence-gap and 178 dependency-map profiles now use complete mixed relationship archives with twenty initially selected records. Sources distinguish primary and supporting references. Organization and technology shared-source links do not prove involvement or deployment. Topic-only matches, forward citations and reverse evidence-gap references remain labeled separately. A record linked in two ways is displayed once with both relationships.

All 178 graphs have complete paginated node/link archives, preserving 1,243 original node rows and 1,177 original link rows, their labels, notes, directed endpoints, relationship types and historical confidence. Twenty graph rows plus twenty related-record cards are initially selected on each map page. Source-level membership and raw-field checks are independent of the display mapper. Actual rendered card/byte counts are not yet certified.

These are 1,230 new relationship/graph shelf families, not 1,230 new articles or evidence findings. Together with the original 43 shelves, there are 1,273 families. The new families account for 2,080 static browse-page paths. Full static pagination and matching search exports use existing route templates; original detail URLs and source records remain unchanged. Classified signals deliberately remain available in explicitly labeled relationship archives, without becoming eligible for the external-development feed.

Twenty-record previews now point explicitly to the complete first static page, so following Page 2 does not appear to be the only way to continue past record twenty. Historical link-confidence labels appear on individual cards in both initial and loaded results, not just in a filter menu.

## Graph integrity correction

The historical autonomy map has 14 node rows but ten distinct node IDs. Two node IDs each appear three times with identical content. It also has sixteen link rows but ten distinct complete rows: three links each occur three times. The prior Map lookup silently collapsed repeated IDs. The new presentation retains every row with a distinct presentation key, states the duplicate counts, and does not count duplicates as extra entities or evidence. If a reused node ID ever has conflicting rows, no endpoint is silently selected. Unknown linked records or missing graph endpoints fail validation.

The comparison map's 68 nodes and 166 links are also retained completely, not truncated to fit the overview. Graph presentation IDs identify preserved rows only; they are not new external record identities.

## Verification and remaining work

Targeted navigation and graph checks pass, including independent complete membership, corrected classification display, primary/supporting relationships, forward/reverse links, duplicate and conflicting-ID behavior, exact node/link fields and date preservation. Ten amended/new Astro templates parse without diagnostics using the installed parser; this is syntax checking only, not the blocked type/build/render workflow.

The production verifier is extended to require each complete archive exactly once across static pages, search-export equality, canonical sitemap membership, preserved map boundaries, preserved map-index anchors, at most fifty initial results and under 200 kB HTML on the selected Atlas routes. It has not run on this candidate: the dependency/access blocker still requires the previously requested approval, and mixed historical `dist` must not be certified or published.

`current:generate` and the full `current:test` suite passed. Candidate/content-reference and source endpoint-metadata validation passed, as did Phase 58, 59, 60, 60C, 61 and 67 assertions. Earlier attribution reviews, publication states, all 25 backlog research receipts and the actual current evidence receipts remain intact. Prepared expectations are 13,171 HTML routes / 157 top-level JSON exports / 312 updates, not a certified production inventory.

Final source-level checks passed: aggregate regeneration and `test:v1ref` (Phase 181–204 historical regressions), seven navigation JavaScript syntax checks, and `git -c core.safecrlf=false diff --check`. Five new authored artifacts also passed JSON where applicable, final-newline, conflict-marker and trailing-whitespace checks. The current evidence-decision file retains SHA-256 `a499d9fd1d00e9516adf247683e2540ba13f53aa7cd91f7606be5599601d0685`. The aggregate remains `Pending build` with a null current full-validation receipt and v1 Held. These checks do not certify rendered or hosted output.

Real five-reader and assistive-technology trials, independent acceptance, release authorization, future evidence gates and a real thirty-day operating month remain open. No dependency repair, audit permission workaround, commit, push, deployment, contact or new automation was performed.
