# Phase 208 — complete briefing references and signal backlinks

September 15, 2026. Implementation continuation; Phases 205–216 and production acceptance remain incomplete.

## Finding and correction

Independent inspection of the current source records and templates found 454 briefings and 24 signal pages above fifty related cards. Five historical research briefings each selected 63 signals, three evidence gaps and 175 related maps: 241 cards before the reader reached the end of the references. These are source/template cardinalities, not measurements of a successfully rendered production candidate.

All 458 briefings now use a complete archive of direct signal references, direct evidence-gap references and maps connected through shared IDs, with twenty initial cards. Direct references precede shared-ID maps, so a long list of gap-related maps does not displace the cited records from the first page. All 744 signals with explicit map backlinks use the same bounded archive interface for those maps. The other 662 signals have no map archive because no map cites their signal ID. Existing signal source cards, direct original-source links, evidence gaps, receiving-system links and both templates' full historical narratives remain.

The shared-ID lists and counts distinguish a map connected to a briefing from a map explicitly citing a signal. Duplicate IDs do not inflate overlap counts; a map connected in two ways appears once with both exact shared-ID lists. Map cards retain graph-row counts, with distinct node-ID and complete-link counts shown separately. Classified signals in briefing references use corrected titles, classification reasons and visible feed holds, not an implied external-development promotion.

The change adds 1,202 archive families and 3,428 static browse-page paths. Together with the prior Atlas work, there are 2,475 shelf families. These paths are alternate ways to read existing records, not additional articles, verified claims or evidence decisions. Twenty-record previews link to the complete first page; forty-record static pages preserve no-JavaScript access and full search exports share the same projected membership.

The production page-budget verifier now counts legacy `record-card` elements as well as newly marked shelf/overview elements, once per element. Previously, unmarked legacy lists could evade the card count. Fixtures check attribute quoting, overlapping markers, comments, script/style text, quoted attribute text and the fifty-one-card failure boundary. This is a generated-markup check, not a browser-visibility or accessibility assessment.

The prepared verifier also respects the existing indexing policy: Published signal, briefing and map detail pages belong in the sitemap; In Review pages remain readable but retain `noindex, follow` and are absent from the sitemap. The source sitemap and robots policy were not changed to make a test pass. This corrects the earlier verifier's overly broad demand for every map-detail URL in the sitemap.

## Verification and remaining acceptance

`current:generate` and the complete `current:test` suite passed. Candidate/content-reference and source endpoint-metadata validation passed, as did Phase 58, 59, 60, 60C, 61 and 67 assertions. Three changed Astro templates parsed without diagnostics and eight JavaScript modules passed syntax checks. After the final direct-reference ordering and verifier adjustments, the complete navigation assertions passed again for all 2,475 families. Prepared expectations are 16,600 HTML routes / 157 top-level JSON exports / 313 updates, not a production inventory.

Aggregate regeneration, `test:v1ref` (Phase 181–204 historical regressions), and `git -c core.safecrlf=false diff --check` passed. Five new authored files passed JSON where applicable, final-newline, conflict-marker and trailing-whitespace checks. The current evidence-decision file retains SHA-256 `a499d9fd1d00e9516adf247683e2540ba13f53aa7cd91f7606be5599601d0685`. The aggregate remains `Pending build`, its current full-validation receipt is null, and v1 is Held.

Production/type/browser checks remain blocked by the existing dependency/access issue and the outstanding repair/audit approval. The mixed `dist` is not a valid candidate and must not be certified, packaged or deployed.

Independent editorial and subject review, real five-reader and assistive-technology trials, rendered byte budgets, future evidence gates, owner release approval and thirty actual post-launch days remain open. No historical evidence receipt, raw narrative, source date, qualification state or release approval was changed. No dependency repair, security workaround, Git write, deployment or external contact was performed.
