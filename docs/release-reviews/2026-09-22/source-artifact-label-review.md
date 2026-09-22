# Source-artifact label review — September 22, 2026

This is a bounded correction to three current document-type labels, not independent acceptance or a review of every claim in the research archive. It implements part of Stage 2's reachable-content review without altering release scope or evidence decisions.

## Exact findings and affected records

| Exact source reviewed | Current label | Affected research records |
| --- | --- | --- |
| [Current Applications home page](https://www.currentapps.com/), product/capability and engineering/manufacturing sections | Company webpage, previously Technical Report | `research-doc-56c-current-applications-drivers-1` |
| [Toronto Council item 2026.SC33.9](https://secure.toronto.ca/council/agenda-item.do?item=2026.SC33.9), Tracking Status, Council consideration and Background Information | Local Government Record, previously Technical Report | `research-doc-57z-toronto-council-adoption`; `research-doc-phase65-009` |

The company URL is a website, not an identified technical report; its performance statements remain company claims. The Toronto URL is an item-history page linking a separate staff-report PDF. This inspection does not establish enactment, permits or new project progress. No new publication date is inferred from a copyright year, and Toronto's September 28 appointment remains unchanged.

All five existing research records using these two exact URLs were checked. `research-doc-55n-toronto-sc33-9-item-history` and `research-doc-phase65-010` already use Local Government Record and remain unchanged. No other record is automatically cleared by this exact-URL cohort.

## Implementation and preserved history

The [review registry](<C:/Users/justi/OneDrive/Documents/NextGen Transportation/app/src/data/source-artifact-labels.json>) pins five original source records and three original link downloads by SHA-256. The three current projections change only document type and add an explanatory metadata field. Publishers, dates, titles, claims, status and local-capture paths are preserved. The original TXT downloads have no document-type field, so no substitute download was fabricated. ZIP archives remain historical snapshots and are labeled accordingly on the affected collections.

Current detail pages, collection cards, shelf filters and research exports share the correction. The [dated update](<C:/Users/justi/OneDrive/Documents/NextGen Transportation/app/src/content/updates/2026-09-22-source-artifact-labels.json>) binds three record IDs and eight affected routes to receipt `206-SOURCE-ARTIFACT-LABELS-2026-09-22`. The separate existing 839-document/22-briefing authorship cohort is unchanged; these corrections do not reattribute the external publishers to FTFN.

Source tests establish exact cohort membership, immutable source/download hashes, unchanged publishers and dates, all shelf occurrences, filtering, public serialization, idempotence, and rejection of drift or invented approval. Production tests additionally check built notices, current card labels, every exported shelf occurrence, research metadata and original download bytes.

## Validation and acceptance boundary

Generation and Astro checking both exited 0 in the [23:31 logged run](<C:/Users/justi/OneDrive/Documents/NextGen Transportation/outputs/validation/2026-09-22T23-31-43.955Z-ky6tNP/results.json>). The separate [23:37 full-candidate run](<C:/Users/justi/OneDrive/Documents/NextGen Transportation/outputs/validation/2026-09-22T23-37-20.819Z-2folsY/results.json>) also passed: generation exited 0 at 23:37:49 UTC and full validation exited 0 at 23:53:15 UTC. Receipt `204-FULL-LOCAL-VALIDATION-2026-09-22-dcf3eb6c7134` covers candidate `bbec06d86481f211f9d5b34851c29f4a2a7a94b8a54eff662dc2acd5bb95f484`, with 3,364 candidate artifacts. The prior candidate's receipt was not reused.

Final output: 16,624 application HTML pages, 157 top-level JSON exports, 324 update entries and 833 sources. The application-local link check passed 711,382 references with zero missing targets. Astro checking reported zero errors, zero warnings and two existing hints. All new label checks and existing attribution/navigation/evidence regressions passed. Counts include historical archives and do not establish independent acceptance. The lockfile SHA-256 remains `d5c0cf14413b5b975290875e86ea9329f0380d92ba05b32c9dc0fd9ddb53b3d8`; clean-install reproduction belongs to the earlier baseline, not a newly claimed install for this revision.

No actual reader session, assistive-technology test, independent review, backlog disposition, publication authorization or hosted replacement was supplied by this work. Full six-stage completion and the full-v1 contract remain open.

## Bounded browser check

At approximately 23:45–23:47 UTC, the first built output was served only on local loopback. In-app browser text and screenshots confirmed the Current Applications notice's current/historical labels, source explanation and preserved-history warning at the default 1,280 × 720 viewport. At 320 × 900, its two notice cells stacked in one column and the page's scroll width was exactly 320 pixels. The Toronto document also had a 320-pixel page width and the correct type/history notice. Actual clicks reached the dated update and its Toronto related-page link.

The [QA diagnostic](<C:/Users/justi/OneDrive/Documents/NextGen Transportation/outputs/validation/2026-09-22T23-37-20.819Z-2folsY/browser-label-qa.json>) pins three observed HTML files and their stylesheet. [Final rebuild verification](<C:/Users/justi/OneDrive/Documents/NextGen Transportation/outputs/validation/2026-09-22T23-37-20.819Z-2folsY/final-rebuild-label-qa.json>) confirmed all four files are byte-identical after the successful terminal run. These checks did not exercise downloads, a screen reader, real 200% browser zoom or actual participants. The temporary viewport was reset, the QA tab closed and the loopback server stopped after inspection; there is no persistent preview or hosted change.
