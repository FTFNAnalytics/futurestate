# FTFN build and content audit — September 9, 2026

FTFN has a substantial, functioning static publishing and evidence-management foundation. Its next investment should turn that foundation into a clear, current reference publication. The main constraint is now the conversion of records, review structures, and source links into useful reader answers with defensible evidence. Increasing phase, route, or packet counts alone will not resolve that constraint.

This audit covers the current working tree through Phase 204, including the September 8 Louisiana Starlink companion update. It reviews the implementation, content inventory, release documentation, operating calendar, and existing Sites deployment. It does not supply an evidence-admission decision, independent expert review, translation approval, or launch authorization.

The execution plan is the [Phase 205–216 roadmap](../roadmap-next-phases-205-216.md). Phases 181–204 remain the historical reference-edition baseline.

## Assessment

| Area | Assessment | Implication |
| --- | --- | --- |
| Build and content integrity | Extensive checks; fresh audit results below | Preserve the architecture and establish a reproducible release baseline |
| Editorial trust | Strong evidence boundaries, but internal software-test records also carry public evidence labels | Correct classification and headlines before broad promotion |
| Reference depth | Broad structures; many newer records still specify research to be done | Fund source acquisition, factual answers, and substantive editing |
| Coverage | Seventeen topics, highly uneven signal distribution | Strengthen thin topics before widening the taxonomy |
| Global coverage | Useful authority map; many project/place records are acquisition dockets | Count resolved identities separately from targets |
| Outcomes | Later observatories explicitly admit no observations | Complete a small real measurement pilot before expanding dashboards |
| Reader experience | Stable reference routes exist, but the interface still exposes development phases and schema fields | Organize around reader questions, entities, and evidence |
| Release | Historical hosted version verified; current checkout is substantially ahead | Bind a new release to its exact source and output |

## What is already valuable

The five-layer dependency framework gives FTFN a coherent editorial purpose. The project connects signals, sources, dependency maps, places, projects, briefings, and reader pathways instead of treating every announcement as a standalone article. Published and In Review states exist, citation references are validated, canonical routes are mapped, and public exports provide inspectable data.

The evidence rules also preserve meaningful distinctions: an announcement is not accepted operation; a place does not inherit a project's stage; missing evidence does not establish nonexistence; and a synthetic test is not an observed result. Those distinctions should remain in the next build.

Phase 119 already provides 24 project profiles and 15 place profiles, including eight governed projects and five governed places. They are a stronger starting point for deeper reporting than another large set of unnamed acquisition slots. The operating cycle also has actual dated decisions: DARPA results, the Shuttle Landing Facility recheck, and Louisiana Starlink, plus the September 8 companion receipt.

## Inventory and provenance

Inventory was recomputed from the local content files, rather than copied from the roadmap. “Published” below is a repository editorial state; it does not certify current hosted availability or independently verified truth.

| Collection | Current count | Editorial state where modeled |
| --- | ---: | --- |
| Signals | 1,406 | 1,121 Published; 285 In Review |
| Sources | 833 | Source metadata uses monitoring fields |
| Topics | 17 | Canonical topic collection |
| Briefings | 458 | 453 Published; 5 Archived |
| Research collections | 64 | 64 Published |
| Research documents | 1,629 | 1,361 Published; 268 In Review |
| Dependency maps | 178 | 177 Published; 1 In Review |
| Reader pathways | 15 | 11 Published; 4 In Review |
| Core local systems | 5 | Distinct from the larger place registries |
| Organizations / technologies | 19 / 5 | Core collections, not all named entities throughout the site |
| Evidence gaps | 16 | Distinct from later mission/backlog structures |
| Updates | 231 | Includes September 8 companion update |

Phase 181–204 contributes 1,048 primary records and 3,216 generated HTML routes. Those routes include native routes, immutable edition routes, and stable reference routes; they are not 3,216 distinct articles. The aggregate declares 1,073 canonical reference routes.

The September 1 immutable receipt records 10,230 HTML pages, 151 top-level JSON exports, 230 updates, and 830 sources. The current manifest expects 10,233 pages, 151 exports, 231 updates, and 833 sources. Keep both snapshots dated; do not rewrite the earlier receipt to make it match the living corpus.

The audit started at Git HEAD `44dacef1` (August 31, “feat: publish FTFN v0.7 through v0.9”), with 48 modified tracked paths and 306 untracked status entries. Untracked directories can contain multiple files. This is a substantial unpublished working-tree delta, not evidence that work is missing or should be discarded. Unrelated Fawcett materials are also present and need exclusion from any FTFN publication bundle.

Read-only Sites checks confirmed saved version 79 at source commit `00be8bbd39173a2f726e9cea100a803b02a398c8`, with a succeeded deployment dated August 10 and custom access. The live address is [the existing FTFN Sites publication](https://ftfn-analytics.jbumstead.chatgpt.site). That saved version is not the current Phase 204 working tree. This audit did not change access, deploy, or validate a custom-domain attachment.

## Findings and priorities

### A01 — P1: Internal software tests are presented as frontier signals

A reproducible text screen finds `fixture` or `harness` in 405 signal bodies; 288 of those signals are marked Published. This is a review cohort, not a determination that all 405 are misclassified.

One confirmed example is [the Amtrak conformance signal](../../app/src/content/signals/signal-57n-amtrak-24-accepted-label-conformance-tests.mdx). Its headline says “Amtrak passes 24 accepted-label conformance tests”; metadata calls it “Official Data” and “Verified Against Primary Source.” Its body says the result concerns FTFN adapter-label matching and reports zero actual candidate packets and reviewer receipts. The card can therefore imply an Amtrak result that the article's own caveats do not establish.

Separate externally observed developments, source-reported claims, FTFN research/synthesis, FTFN method/test notes, and open research dockets. Review the 405-record cohort by claim, correct confirmed cases, and carry corrections into cards, topic totals, search, exports, and indexing. Preserve historical records with explicit correction lineage. **Phase 206; before release.**

### A02 — P1: Structural completion exceeds substantive reference completion

The machine contracts are candid, but collection names can overpromise what a reader receives:

| Phase | Built structure | Substantive result currently recorded |
| --- | --- | --- |
| 189 | 80 authority packets; 120 exact-artifact slots | 0 exact artifacts bound; 0 completed reviews |
| 191 | 40 international project packets | 4 exact named anchors; 36 acquisition dockets |
| 192 | 20 place dossiers | 3 exact place anchors; 17 acquisition dockets |
| 193 | 24 comparison passports | 24 Blocked verdicts; 0 comparable claims |
| 194 | 24 longitudinal packets | 0 admitted series or observations |
| 195 | 102 question briefs | 102 method answers; 0 completed artifact-level factual answers |
| 198 | 24 failure/delay/correction packets | 0 classification decisions or confirmed disruptions |
| 199 | 24 public-value panels | 0 admitted observations or outcome values |
| 202 | 68 accessible/language edition contracts | 0 rendered editions; 0 approved translations |

These are not invalid structures. They establish an actionable backlog. However, they should not be counted as completed investigations, measured outcomes, finished translations, or established global project coverage. Display an accurate content type and a short useful answer before procedural details. **Phases 208–213.**

### A03 — P1: Live operation needs an update model that preserves immutable snapshots

The Phase 189–196 assertions require reviews and observations to remain null or empty; Phase 197–204 assertions similarly require zero rendered editions and a fixed set of Held gates. These are appropriate historical-baseline checks. They cannot serve unchanged as the acceptance contract for a living edition that starts admitting evidence.

Add a dated current-state projection over immutable baseline records and genuine later decisions. Keep old receipts and snapshot assertions intact. Validate authorized transitions, authority, date, evidence, revision lineage, and public propagation on the current projection. A valid new observation or completed edition should not require weakening a historical assertion or creating another duplicate reader route. **Phase 205 design; Phase 207 first operation; Phase 214 consolidation.**

### A04 — P1: Current release provenance and status documents disagree

The manifest has September 8-era counts inside a `last_verified.date` of September 1. The README accurately describes the older receipt snapshot but lacks a clear latest-corpus overlay. The master roadmap still opens with v0.9 as the current milestone. The documentation map says the full local suite is complete and later says the edition is not fully validated. Hosted version 79 is a third, older state.

Establish one current status pointer that separately records historical receipt, current corpus, current validation, source commit, hosted version, domain/access, and promotion state. Treat versions and counts as dated facts, not general labels. This audit adds planning pointers but leaves certified historical artifacts untouched. **Phase 205.**

### A05 — P1: Source freshness is not being measured by the “source health” pass

`source:health` checks endpoint metadata. It reports 603 Manual review and 230 Probe ready sources; it does not fetch those endpoints or establish current factual validity. The Phase 182 source audit explicitly records zero network currency checks.

As of September 9, 149 sources exceed their own declared `review_cadence_days`, computed as elapsed UTC calendar days since `last_checked_date` strictly greater than the cadence. Of these, 128 have Active monitoring status and 21 Manual Review. Another 24 sources lack both source-owner and cadence metadata and are excluded from that overdue calculation. Overdue metadata is not proof that the underlying statement is wrong.

Run a risk-based currency queue: scheduled evidence gates first, then sources supporting current headlines and selected launch content. Record success, moved URL, inaccessible artifact, changed meaning, or bounded no-change separately. Refresh metadata only after a real check. **Phases 207 and 214.**

### A06 — P1: Security review must precede the next deployment

Installed versions are Astro 5.18.2, MDX 4.3.14, Astro Check 0.9.9, TypeScript 5.9.3, and Sharp 0.34.5. The lockfile contains 500 package entries. A full npm dependency audit did not complete: the initial registry call failed, and automatic approval review rejected the network-enabled retry because it sends dependency metadata externally. No clean security bill is asserted.

The fallback checked primary maintainer advisories. Astro's [AVIF optimization advisory](https://github.com/withastro/astro/security/advisories/GHSA-26w7-cxv4-gfx2) lists versions below 7.2.8 as affected and states that exploitation requires processing an attacker-controlled AVIF; its fix requires Sharp 0.35.4. Installed versions therefore need explicit applicability review. The local source search found no `astro:assets` image component or AVIF-processing use, so this audit has not demonstrated that exploit path in FTFN.

The [base-path authorization advisory](https://github.com/withastro/astro/security/advisories/GHSA-376h-93r7-7g6f) and [View Transition advisory](https://github.com/withastro/astro/security/advisories/GHSA-4g3v-8h47-v7g6) have application-specific preconditions not observed in the inspected static configuration. Record the analysis, review the remaining dependencies with an approved method, and test a compatible upgrade before release. A framework upgrade is a controlled migration, not an automatic package bump. **Phase 205.**

### A07 — P2: Reader navigation still follows the build history

`/reference/` groups content into phase ranges and leads with registry counts. Its detail routes reuse `RegistryDetail.astro`, which iterates scalar, object, and list fields, exposing internal IDs and sometimes serialized nested JSON. This supports inspection but makes the reader work to extract the answer. The registry hub has no general search or pagination control; Signals has client-side filtering.

Give readers routes organized around topics, questions, projects, places, and recent changes. Keep the full evidence/workflow record available as secondary detail. Prioritize five journeys: understand a topic, assess a named project, inspect place constraints, verify a claim, and find what changed. Retain existing canonical identities and map legacy links. **Phase 208.**

### A08 — P2: Coverage counts mask concentration

Energy, Mobility, and Chips and Compute contain 1,141 of 1,406 signals (81.2%). This may partly reflect repeated method records and must be recalculated after Phase 206. Current raw counts:

| Topic | All signals | Published |
| --- | ---: | ---: |
| Energy | 538 | 432 |
| Mobility | 310 | 255 |
| Chips and Compute | 293 | 215 |
| Human Futures | 69 | 64 |
| Advanced Manufacturing | 45 | 36 |
| Cybersecurity | 39 | 32 |
| Policy and Standards | 24 | 16 |
| Critical Minerals | 16 | 15 |
| Space | 14 | 11 |
| Water | 12 | 9 |
| AI for Science | 11 | 10 |
| Aviation | 9 | 5 |
| Finance and Risk | 9 | 8 |
| Climate | 5 | 3 |
| Agriculture and Bioeconomy | 4 | 4 |
| Quantum | 4 | 4 |
| Discovery Technologies | 4 | 2 |

Source metadata also classifies 690 of 833 profiles as Government Agency. Government sources are useful for policy and public delivery, but research-heavy topics need stronger primary research, university/lab, standards, and measured operating evidence. Only one signal currently uses the Peer-Reviewed Research evidence-quality label; that is a metadata observation, not a complete count of all underlying research papers. **Phase 209.**

### A09 — P2: Accessibility and delivery quality need direct acceptance checks

The shared layout has language, navigation, and main landmarks, but no explicit skip-to-content link. The code and historical receipt do not establish current keyboard, zoom, contrast, screen-reader, or mobile usability. Phase 202 contains contracts with null rendered text. Treat these as open product work, not certification.

Measure representative pages and the largest indexes; provide keyboard/focus behavior, progressive disclosure, pagination, meaningful headings, and accessible tables. Produce actual plain-language and low-bandwidth content. Test French/Spanish with language and subject reviewers if those editions enter the release scope. **Phases 208, 213, and 215.**

### A10 — P2: The build program needs a smaller reusable operating core

`package.json` has 344 scripts; `app/scripts` contains 461 top-level `.mjs` files. Many repeat phase-specific generation, assertions, manifest updates, and verification. This is a maintenance signal, not evidence that every script is unnecessary. The static Astro approach remains suitable; no stack rewrite is justified by this audit.

Introduce a small named command set for current validation, current content generation, source checks, build, and release verification; retain historical command aliases. Derive repeated inventory contracts from one registry, without removing meaningful checks. The fresh Astro production build took 441.54 seconds (7.36 minutes), excluding the preceding type-check stage; use that as a measured local baseline. **Phase 214.**

### A11 — P2: Release checks miss broken historical update links

An independent scan of generated `href` and `src` paths checked 522,324 local references across all 10,233 site pages. It found 16 distinct absent targets, appearing 26 times, all on `/updates/`. Examples include `/sources/`, `/atlas/pathways/`, `/local-systems/ontario-real-estate/`, `/briefings/evidence-return-control-room-001/`, and several unprefixed `/pathways/` and `/dependency-maps/` URLs. The full target list is preserved in the audit evidence JSON.

These are confirmed missing generated targets; hosted rewrite behavior was not tested. Repair canonical mappings or add historical aliases and check every generated internal path as part of release validation. Avoid editing immutable update narratives where an alias resolves the link correctly. **Phase 205; regression coverage in Phase 214.**

### A12 — P2: Large shelves impose substantial document weight

The generated site contains 285,194,556 bytes of page HTML, excluding downloaded research HTML. Several reader pages contain large amounts of material in one document:

| Route | Raw HTML bytes | Locally gzip-compressed bytes |
| --- | ---: | ---: |
| `/atlas/topics/policy-and-standards/` | 3,738,904 | 493,074 |
| `/research/` | 3,723,951 | 333,143 |
| `/signals/` | 2,395,300 | 135,549 |
| `/atlas/source-monitor/` | 2,001,590 | 141,954 |
| `/atlas/topics/finance-and-risk/` | 1,947,509 | 244,937 |
| `/updates/` | 1,607,039 | 162,097 |

These are actual file-size measurements, not network timings or Core Web Vitals. Compression reduces transfer size but does not reduce the number of elements a browser must parse and manage. Paginate the shelves, shorten repeated excerpts, and load secondary review detail on demand. Preserve ordinary links and basic no-JavaScript navigation. **Phase 208.**

## Near-term operating obligations

These dates come from the current Phase 60 operating cycle; no decision was manufactured during the audit.

| Date | Required review |
| --- | --- |
| September 9 | Louisiana Nextlink observed adoption — due on the audit date, decision and receipt null |
| September 10 | Amtrak PIDS final closeout; Hanford complete material balance; NNSA GAO baseline |
| September 15 | Montana BEAD completed quarterly outcome |
| September 22 | Phoenix/TSMC wastewater delivery and operation |
| September 24 | NNSA accepted operating capacity |
| October 1 | Loudoun Phase 2 data-center standards |
| October 9 | Amtrak named-asset reliability; NNSA recurring qualified rate; existing cycle-final audit and Starlink hold reconciliation |

The three earlier cycle decisions remain recorded, with the September 8 Starlink check as a companion receipt rather than a fourteenth gate. A due date is not permission to claim an outcome; a bounded blocker or No Material Change is a valid dated review result.

## Verification and limits

The fresh audit ran 22 npm-script checks successfully: fourteen content/operating checks, `build`, and seven production/release verifiers. `build` includes Astro type checking and static generation. The type checker reported 0 errors, 0 warnings, and 1 unused-variable hint across 726 files. Static generation produced 10,233 pages; the output inventory found 151 top-level JSON exports. No new immutable validation receipt was minted.

| Check group | Commands | Result |
| --- | --- | --- |
| Content and metadata | `validate:candidates`, `validate:content`, `source:health` | Passed; health is metadata-only |
| Edition contracts | `test:v1rc`, `test:v1month`, `test:v1cycle`, `test:v1oct`, `test:v1ref` | Passed |
| Evidence operations | `test:phase58`, `verify:phase58`, `verify:phase60`, `verify:phase60c`, `test:phase67`, `verify:phase67` | Passed |
| Build | `build` | Passed; 10,233 pages |
| Production verification | `verify:v1rc`, `verify:v1month`, `verify:v1cycle`, `verify:v1oct`, `verify:v1ref`, `verify:release`, `verify:v09` | Passed |
| Independent output inspection | All generated site HTML; local target existence, H1 count, canonical presence, sizes | 16 missing targets; all pages have one H1 and a canonical tag |
| Live deployment metadata | Sites saved version and deployment status | Historical version 79 verified; no current-candidate deployment asserted |

The passing reference verifier confirms the existing Phase 181–204 receipt still matches its declared artifact scope. It does not turn the receipt's September 1 whole-site snapshot into a September 9 snapshot. Raw command logs and inspection scripts are in `.qa/audit-2026-09-09/`; the portable [audit evidence JSON](2026-09-09-audit-evidence.json) preserves inventory, command outcomes, link findings, sizes, and release provenance.

Three deliberately selected live source spot checks were readable and consistent with the narrow local source descriptions: [NIST's TSMC investment announcement](https://www.nist.gov/news-events/news/2026/07/trump-administration-secures-additional-100-billion-us-semiconductor), [NASA/JPL's DSS-23 operating milestone](https://www.jpl.nasa.gov/news/new-next-gen-dish-adds-muscle-to-nasas-deep-space-network/), and [EIA's 2025 wind/solar generation article](https://www.eia.gov/todayinenergy/detail.php/detail.php?id=67367). The unusual duplicated `detail.php` in the stored EIA URL resolved in this check; it was not classified as broken merely from its shape. This three-source sample is not a statistical or exhaustive factual audit of 833 sources.

This was a repository, generated-output, metadata, and targeted-source audit. It did not conduct browser interaction, screen-reader testing, independent subject review, an exhaustive external-link crawl, legal reuse review of every download, or a successful full registry vulnerability scan. Those limits are carried into the roadmap. No application content, historical receipt, evidence decision, or deployment was changed by this audit.

## Recommended decision

Proceed with Phases 205–216 as an evidence-and-reader completion program. Measure verified answers, resolved identities, useful case studies, review timeliness, successful reader journeys, and release reproducibility. Preserve FTFN's ambition while making every public claim and product label match what the reader can actually inspect.
