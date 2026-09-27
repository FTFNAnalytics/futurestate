# AI-reviewed translation integration — September 27, 2026

Four of 34 translation contracts now have complete, AI-reviewed local reading editions. The owner-authorized AI-review policy remains in effect: no human review, locale choice or source-mapping response is required to continue. This is implementation progress, not a public launch or completion of the wider build.

## Completed content and navigation

| Topic | French Canadian | Latin American Spanish | English source |
| --- | --- | --- | --- |
| Advanced Manufacturing | `202-EDITION-003` | `202-EDITION-004` | `202-EDITION-001` |
| Agriculture and Bioeconomy | `202-EDITION-007` | `202-EDITION-008` | `202-EDITION-005` |

Each edition contains its complete translated overview and six sections, five original source URLs and source-profile links, a visible AI-review notice, a contents list, language links and historical-contract provenance. The English sources were written September 10 with evidence inherited through September 1. Manufacturing fidelity was reviewed September 25; agriculture fidelity was reviewed September 27. Neither date is a new external fact-check.

The agriculture comparison preserved crop versus feedstock versus processor versus product, funding versus commercial availability, assessment versus planting/adoption, seed multiplication, one-season causal limits, participants who stopped using a practice, usable output versus yield, losses/destination and eligible-versus-actual participant denominators. The source links and dates are unchanged. [Actual agriculture findings and version hashes](release-reviews/2026-09-22/translation-pilots/agriculture-ai-review-2026-09-27.json) identify the AI author/reviewer, not an independent reviewer.

New canonical reading paths end in `advanced-manufacturing-fr-ca`, `advanced-manufacturing-es-419`, `agriculture-and-bioeconomy-fr-ca`, and `agriculture-and-bioeconomy-es-419`, under `/reference/accessible-editions/`. The historical `*-human-reviewed` contract paths remain intact, explicitly identify themselves as historical, and link to the real AI-reviewed reading editions. Their empty translated-content fields and null human receipts are not overwritten.

The reference home, accessible-editions hub, English plain/compact pages, reader catalog, sitemap and `/data/build-decisions.json` expose the new editions. The catalog has 141 bindings: the 137 existing bindings plus four translations, not 141 independently approved investigations.

Catalog search accepts the native language name, English language name or locale code. Static results and dynamically created search results mark translated titles and summaries with their language; the surrounding status and navigation remain English.

## Source context and technical assessment

Exact-source context now includes retained annual-reading source checks as well as the existing evidence and backlog checks. Paired essays with the same source-check payload are deduplicated. Checks are bounded by their actual recorded dates; no new appointment or retrieval is inferred.

This closes a specific propagation gap: the September 23 EX16 source check distinguishes its December 11, 2025 receiving-unit arrival from its February 17, 2026 publication date, neither of which establishes formal contractual acceptance. The manufacturing translations and relevant English readings carry this context separately. The full retained findings, locators and access limits remain linked to the reviewed source account. Agriculture has no matching later check in these ledgers; no check is invented.

The translated article and document metadata use `fr-CA` or `es-419`. The shared English navigation and English source-check excerpts are explicitly language-marked. Full text and all language links are ordinary HTML, with no translation-specific script. The existing layout, typography and components are preserved under the Sites workflow.

This AI-led technical/content assessment covers language metadata, heading structure, contents anchors, source/link provenance, keyboard-focus markup, complete server-rendered text and safe separation of review states. It is not browser/visual testing, an assistive-technology session, a human study or accessibility certification. Stopped browser automation remains stopped.

## Verification state

Source checks pass for all four accepted texts, exact English and historical-contract hashes, exact source-profile bytes, original links, six sections per text, language pairing, source-check deduplication and dates. Negative fixtures reject changed translations, changed English, changed historical contracts and invented human review, retrieval or publication authorization. Historical original-draft and contract checks remain intact.

The initial Astro check found six missing component parameter types; the component now declares its article type from the translation data. Subsequent checks cover 935 files with zero errors, zero warnings and two pre-existing hints.

Full generation and validation both completed with exit code 0. Final validation ended **2026-09-27 22:45:04.889 UTC**, including the receipt-bearing rebuild and final release verification. [Terminal execution results](../outputs/validation/2026-09-27T22-25-15.339Z-BIqboM/results.json) retain the exact successful commands and logs.

- Candidate: `8d37158662835d40169ddb45a2d6e9a1f8182548c0655e4c60c09a59d23e2a10`.
- Receipt: `204-FULL-LOCAL-VALIDATION-2026-09-27-c8135673859f`.
- Output: 16,658 HTML pages, 160 top-level JSON exports, 348 updates and 833 source records.
- All four translated pages passed exact rendered-text/export, source-context, language, navigation, historical-contract, catalog and sitemap checks. The existing 104 English reader bindings and all 25 backlog determinations also pass their production checks.
- Both site-wide scans checked 714,816 local references with zero missing targets.
- Final static spot checks found no scripts, duplicate IDs or unresolved in-page anchors in the four translations. HTML sizes: manufacturing fr-CA 20,905 bytes; manufacturing es-419 20,395; agriculture fr-CA 18,928; agriculture es-419 18,427. These are static checks, not browser observations.
- Dependency lockfile SHA-256 remains `d5c0cf14413b5b975290875e86ea9329f0380d92ba05b32c9dc0fd9ddb53b3d8`; no dependency installation is claimed. `git diff --check` passes.

The September 25 candidate is now historical. The exact source checkpoint and post-commit archive-recovery verification are recorded separately; a source copy does not claim a fresh dependency installation, hosted verification, human review, public launch or an elapsed operating month.

## Next build work

1. Implement the remaining 30 language texts in exact-version pairs; each needs actual AI fidelity review, not a human signature.
2. Continue the remaining 27 Montana dossiers, localized place accounts, new eligible identities and substantive whole-article reviews toward the unchanged 100-project/70-place and 33-selected/58-annual targets.
3. Continue evidence-backed measurement work without manufacturing accepted observations or treating missing evidence as a reviewer-coordination task.
4. Finish local verification and exact source recovery. Hosting, external outreach, public launch and an actual elapsed operating month remain separate.

Parallel local preparation: [five further Montana manuscripts](montana-next-five-2026-09-27.md) are authored with fifteen exact retained-record hashes and checked identity/financing values. They distinguish two LEO projects, the zero-BSL/21-anchor Hill project and two separate Ziply legal entities. They are not in application totals yet. Integrate them next, with corresponding LEO/anchor-only/relationship regression checks, while preserving the five existing dossiers.
