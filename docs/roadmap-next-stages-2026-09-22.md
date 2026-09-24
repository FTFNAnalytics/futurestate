# FTFN next build stages — September 22, 2026

Implementation continuation, September 23 at 19:05 America/Edmonton: baseline fresh-install reproduction is complete, and the subsequent two-reading Nevada clarification has passed full changed-candidate validation. See [the implementation report](<C:/Users/justi/OneDrive/Documents/NextGen Transportation/docs/release-reviews/2026-09-22/annual-nevada-followthrough-2026-09-23.md>) for exact terminal evidence and subsequent recovery/packet status. Do not restart either completed validation run or reapply the correction. The dated planning snapshot below remains the full-scope contract; human acceptance, accepted coverage and owner/elapsed-time gates remain open.

Status: execution plan prepared from the current repository; implementation and review gates remain individually governed.

Current execution supplement, September 23 at 18:40 America/Edmonton (September 24 at 00:40 UTC): [next-stage execution plan](<C:/Users/justi/OneDrive/Documents/NextGen Transportation/docs/next-build-execution-plan-2026-09-22.md>) starts from validated application candidate `4178277f` and recovered source/preparation commit `be59f801`. Four answer worksheets, the annual battery review packet and the reader-study protocol are ready. Fresh dependency installation passed, but the existing isolated full validation is still running; end-to-end reproduction and actual review/testing remain outstanding. The next implementation sprint finishes that proof, integrates the prepared two-reading Nevada clarification with full changed-candidate checks, and pursues authorized review assignments, eligibility/backlog decisions and actual reader/evidence work. It supersedes the old sprint order and tentative scheduling below while preserving full-v1 portfolio, edition, language and release requirements. The original starting snapshot and six-stage acceptance contracts below remain dated planning history. This refresh changes planning only and does not authorize application edits, contact, UI automation or deployment.

Execution tracking: the starting-point table below is the planning baseline, not the latest build result. See the [current build progress](<C:/Users/justi/OneDrive/Documents/NextGen Transportation/docs/build-progress-2026-09-22.md>) for subsequent validated changes and the [full completion audit](<C:/Users/justi/OneDrive/Documents/NextGen Transportation/docs/release-reviews/2026-09-22/completion-audit.md>) for remaining proof at every stage. A technical checkpoint does not close the independent-review, owner or real-calendar gates.

## Objective

Turn the existing reference candidate into a reviewed, maintainable English edition that readers can navigate, verify and return to. Finish the existing Phases 205–216 through six delivery stages. Keep their record identities and acceptance contracts; no new numbered phase program is needed.

This plan supersedes the starting-state and scheduling assumptions in the September 14 roadmap. It preserves mandatory full-v1 requirements. A smaller English release remains a proposed, separately named scope choice requiring an explicit owner decision.

## Verified starting point

The September 22 operation report, saved command results and deployment manifest agree on the latest completed local validation:

| Area | Current evidence | Planning consequence |
| --- | --- | --- |
| Local build | `204-FULL-LOCAL-VALIDATION-2026-09-22-536f9d7a0614`; both logged generation and validation commands exited 0 | Preserve this baseline; the earlier failed build is historical |
| Output | 16,618 HTML pages, 157 top-level JSON exports, 319 updates, 833 sources; 694,758 local references checked with zero missing targets | Route count measures generated output, including archives; it is not the number of distinct articles |
| Source state | Branch `codex/phase51-content`, HEAD `44dacef1ff824b2a637656c1b4886dd4a09333f3`; extensive uncommitted and untracked work remains | Source-to-commit reconciliation is still required |
| Candidate identity | Digest `6a9800e2bd6ef92b4ba24fd498806e56833870c3be745805e401cbda7d8cf407`, covering 3,345 artifacts | The receipt certifies its recorded candidate; later changes need appropriate verification |
| Editorial work | 33 selected drafts: four topic editions, eight projects, four places, twelve answers, four cases and one field report; 104 earlier reader bindings are also retained | Complete and review these existing texts; the sets overlap and must not be summed as unique articles |
| Attribution | Recorded corrections cover 839 research documents and 22 briefings; 826 signal classifications, 825 corrected presentations, all existing feed holds retained | Audit the selected release and its reachable content; outside-cohort material is not automatically cleared |
| Evidence operations | Nine of thirteen primary cycle decisions recorded; four future gates remain | Run only the remaining real-date checks; retain separate Toronto and companion identities |
| Backlog and measurements | All 25 priority backlog research reviews exist; authorized dispositions remain pending. Three measurement pilots reviewed; zero admitted series | Prepare concrete decisions and resolve missing evidence; research completion does not confer admission |
| Reader interface | Search, pagination, relationship archives, citations and 34 paired English editions are implemented; production checks and selected assisted browser checks passed | Test reader comprehension and accessibility, then fix observed failures |
| Release | Independent acceptance, source commit, hosted replacement and owner launch remain open; full v1 is Held | Complete local preparation before the final release decisions |

The earlier `EPERM` build failure was followed by a successful full run. The earlier Git error was permission to create `index.lock`; no persistent lock file was established. Stage 1 must diagnose current conditions rather than assume a stale lock needs deletion.

Evidence: [September 22 operation and validation report](</C:/Users/justi/OneDrive/Documents/NextGen Transportation/docs/phase-207-arizona-recheck-2026-09-22.md>), [saved command results](</C:/Users/justi/OneDrive/Documents/NextGen Transportation/outputs/validation/2026-09-22T16-44-29.860Z-dzI7Er/results.json>), [deployment manifest](</C:/Users/justi/OneDrive/Documents/NextGen Transportation/deployment/ftfn-v0.2-build.json>) and [review protocol](</C:/Users/justi/OneDrive/Documents/NextGen Transportation/docs/phase-205-216-review-handoff-2026-09-14.md>).

## Six delivery stages

Windows are planning targets, assuming one primary implementer and available reviewers. They are not appointments or promised completion dates. Editorial work and scheduled source checks can continue while release preparation is underway.

| Stage | Existing phases | Target window | Deliverable and exit |
| --- | --- | --- | --- |
| 1. Secure the build checkpoint | 205, 214 | Sep 22–25; about 2–3 engineering days | A recoverable, reproducible candidate whose source scope, commit, dependency lockfile, build receipt and output agree |
| 2. Finish the reviewed content set | 206, 207, 209, 210, 212 | Sep 23–Oct 9; about 8–12 focused editorial days plus review | Every selected article has exact claim support and a review disposition; the 25 backlog items have decision-ready findings and actual dispositions where authorized |
| 3. Complete reader and accessibility acceptance | 208, 213 | Sep 28–Oct 16; about 3–5 engineering days plus participant sessions | Five usable journeys, tested English formats, measured page behavior and resolved critical reader defects |
| 4. Decide the measurement feature | 211 | Sep 28–Oct 16; cap initial acquisition work at 4–7 data days | One reproducible admitted series, or an explicit feature hold with precise missing evidence |
| 5. Prepare and verify the owner-only candidate | 214, 215 | Oct 12–30, after applicable earlier exits | An exact source/build/package/hosted-version chain, tested access, review dispositions and a recoverable prior version |
| 6. Make the release decision and operate it | 216 | After Stage 5; then 30 actual days | A dated launch or hold decision, followed by real weekly maintenance receipts if launched |

The critical path is Stage 1 → reviewed release scope from Stage 2 → Stage 3 → Stage 5 → Stage 6. Stage 4 gates any measurement feature. Evidence operations run alongside this path and retain their own dates.

### Stage 1 — Secure the build checkpoint

1. Inventory the tracked diff, untracked source files, generated outputs and local-only material. Preserve existing work and the current validation logs. Identify the exact candidate inputs from the receipt rather than staging the whole working directory.
2. Reconcile source scope with the candidate digest. Group commits by coherent work where feasible; commit only reviewed source and required generated records. Exclude private candidate data, temporary files and unrelated packages. Recheck the Git index immediately before each commit so another task's staged work is not included accidentally.
3. If Git still cannot write its index, use the normal approval path for the explicitly authorized commit. Do not infer that a missing lock file needs deletion or change filesystem permissions broadly.
4. Verify a clean installation and build in an isolated scratch checkout or directory using the candidate lockfile and supported runtime. The September 15 report explicitly did not establish clean-install reproduction. Keep the live workspace and retained output available; serialize builds that share an output directory.
5. After any source change, run the existing logged validation entry point and bind the successful output to the actual candidate. Record the source tree/commit and receipt in a release note without creating self-referential commit fields.
6. Reconcile current roadmap and handoff pointers. Retain failed attempts and old receipts as dated history; remove instructions that incorrectly restart completed repairs.

Exit: the candidate can be recovered from its source checkpoint, installed from its lockfile and verified with the documented commands. A receipt for an older tree is not reused for changed content. An unrelated dirty workspace is acceptable only when the release source set is explicitly isolated and complete.

### Stage 2 — Finish the reviewed content set

Use the existing 33 drafts as the working queue. Resolve claims across title, summary, body, cards, search, exports and related briefings whenever a finding changes their meaning.

- **Four topic editions:** Climate, Agriculture and Bioeconomy, Quantum, and Discovery Technologies. Finish their eight existing case studies; retain exact artifact versions, observation methods and demonstrated limitations.
- **Eight project/four place dossiers:** check named identities, stage chronology, responsible authorities, contradictory evidence and the next decisive artifact. Apply the latest Toronto and Arizona context without advancing unsupported delivery stages or giving places a synthetic performance score.
- **Twelve factual answers:** lead with what can currently be established. Link central claims to exact source locations and make unresolved portions readable. Start the review sequence with TSMC, Toronto, broadband and the four thinner topics because they combine current evidence or known coverage needs with existing drafts.
- **Four case narratives and the field report:** edit the existing F-15EX, Toronto, Victorian Big Battery and Dalrymple narratives. Align the report's title, coverage date and scope with the reviewed selection. Its four cases do not satisfy the larger annual-edition contract automatically.
- **Attribution and release reachability:** verify labels on selected articles and the historical records readers can reach from them. Resolve misleading attribution through dated corrections or explicit exclusion from the approved release scope, retaining historical provenance. A lexical screen is a discovery aid, not factual clearance.
- **Twenty-five backlog items:** process in batches of five. Each decision packet should contain exact source findings, access limitations, recommended disposition, affected claims/routes and the decision still required. Record acceptance, qualification, rejection or hold only under the applicable authority.

Exit: all release-selected central claims have traceable support and real review dispositions. Unsupported claims are corrected, removed from the selected release, or explicitly held. Actual independent reviewers and their comments are recorded only when those reviews occur. The pending backlog and selected release scope remain visible; neither is reduced silently to meet a date.

### Stage 3 — Complete reader and accessibility acceptance

Keep the implemented navigation and English reading formats. Use observed failures to prioritize the next interface work:

1. Test the five journeys in the existing review protocol: topic orientation, named project stage, place constraints, claim verification, and recent changes. Refresh any dated task wording to the approved test candidate while preserving the task's intent.
2. Have five actual target readers attempt each journey without guidance; record completion, time, wrong turns, search terms and misunderstandings. Retain the existing acceptance target of at least four of five readers succeeding on **each** task.
3. Test selected release routes with keyboard and assistive technology, narrow screens, 200% zoom, visible focus, headings, citations, tables and English-format switching. Record route, candidate, method, date and resolution for every defect.
4. Verify the existing page budgets, no-JavaScript reading, searchable full archives, crawlable pagination and publication-aware indexing. Fix broken filters, oversized pages or ambiguous evidence labels found by the tests. Address the documented favicon omission as a small finishing task.
5. Extend fixes across shared templates, then repeat affected tests. Keep the 34 English editions paired and preserve source links and evidence cutoffs. Translation remains separately scoped and reviewed.

Exit: the five journeys meet the reader threshold, tested release routes have no unresolved critical accessibility defects, and performance stays within the existing budgets. Local automated or assisted tests remain useful evidence with their stated limits; they cannot supply unperformed participant reviews.

### Stage 4 — Decide the measurement feature

Continue the three existing pilots: Hornsdale Power Reserve, Dalrymple ESCRI-SA and F-15EX production/delivery. Preserve original extractions and later correction receipts.

For each pilot, resolve entity, units, reporting period, population/denominator, method and revision policy before admitting observations. Dalrymple's next acquisition should target the contractual availability definition, protocol versions and interval records already identified; repeat PDF retrieval only if it addresses a remaining evidential gap.

If a pilot qualifies, produce a source-linked table and export plus an accessible chart, with compatible periods, visible gaps/revisions and independent reproduction. If none qualifies after the bounded acquisition pass, record the exact missing artifacts and leave the measurement feature held. A separately approved English reference scope may omit it; that does not turn an unmet full-v1 measurement gate into Pass.

Exit: all three pilots have current outcomes, and any displayed series has an actual admission receipt and independent reproduction. No additional observatory structure is required merely because evidence remains unavailable.

### Stage 5 — Prepare and verify the owner-only candidate

1. Assemble a concrete release packet: selected routes and article versions, source commit, lockfile and candidate digest, full validation receipt, known limitations, dependency disposition, reviewer findings and rollback target.
2. Reuse the existing Sites project. Read its actual current version and access policy before deployment; historical references to version 79 are not a fresh hosting check. Confirm runtime and packaging compatibility with the reviewed source.
3. Present the completed packet for any still-required scope or deployment decision. Retain existing task-specific authorization, but do not treat this planning request as general publication or access authority. A wastewater no-change receipt alone remains insufficient reason to refresh the site under the earlier recheck instruction.
4. Once replacement is authorized, verify the terminal deployment result and representative hosted routes, updates, exports, downloads, indexing behavior and access. Bind that verification to the actual saved version. Keep owner-only access, the existing domain/DNS arrangement and public-GitHub boundary unless separately changed by the owner.
5. Rehearse recovery locally from the retained candidate; perform any hosted rollback exercise only within the authorized deployment scope. Record how to restore source, output and dated reader state together.

Exit: the owner can inspect the exact reviewed candidate, provenance and recovery procedure. Public launch and full-v1 promotion remain distinct decisions.

### Stage 6 — Release decision and first operating month

Present an explicit launch/hold choice for the fully prepared candidate. If the owner chooses a bounded English release, name it and document its scope separately from full v1. If full v1 is required, finish its mandatory coverage, evidence, translation and review conditions before promotion.

After an actual launch, count thirty real days. Review source currency, due evidence checks, corrections, search failures and reader-task results weekly. For every content change, preserve the previous receipt and validate affected reader surfaces; run the full release checks before shipping a new candidate. At day 30, assess maintenance effort, review throughput and reader needs before expanding scope.

Exit: a real launch or hold decision exists; a launched edition has thirty days of actual operating evidence. Future maintenance reports are not prewritten as results.

## Evidence calendar alongside the build

| Date | Existing obligation | Required handling |
| --- | --- | --- |
| Sep 22, completed | Arizona wastewater Phase 60 decision | Reuse the No Material Change receipt; nine primary decisions are recorded |
| Sep 24 | NNSA accepted operating capacity | Require the named acceptance artifact; preserve a bounded hold if unavailable |
| Sep 28 | Toronto application `24 254930` | Separate project follow-up for enactment, conditions and permits; do not add a primary cycle identity |
| Oct 1 | Loudoun standards | Record the actual dated source result and affected content |
| Oct 9 | Amtrak named-asset reliability; NNSA recurring qualified rate | Separate final primary decisions, plus the thirteen-item cycle audit |
| Oct 9 | Existing follow-ups, including Arizona and the other receipted lanes | Respect each receipt's identity, evidence requirement and earlier-artifact trigger |
| Nov 21 | Phase 55Q Arizona appointment | Retain separately from the earlier October 9 cycle checkpoint; reconcile only through an explicit later decision |

The repository also records a September 23 next-lawful-calendar date for broader operating work. Inspect the actual applicable calendar items when executing; that metadata is not permission to run the September 24 or later source gates early. This plan creates no new automation and does not duplicate the existing monitor.

## First implementation sprint — September 22–29

| Order | Concrete task | Completion evidence |
| --- | --- | --- |
| 1 | Reconcile the validated source set and preserve a reviewable commit/checkpoint | Exact changed-file scope, source identity and recoverable candidate |
| 2 | Reproduce installation/build from the lockfile in an isolated directory | Saved commands and exit codes tied to that candidate |
| 3 | Complete a release-selection sheet for the existing 33 drafts and linked historical material | Every article has a scope disposition, claim-review state and exact next action |
| 4 | Prepare the first five backlog dispositions and review the first four factual answers | Concrete source findings, proposed wording and required decisions |
| 5 | Operate September 24 NNSA and September 28 Toronto on their real dates | Separate receipts with consistent current views and no unsupported stage advance |
| 6 | Prepare five reader tasks and test representative pages locally | Usable review packet, route list and prioritized defect list; no fabricated participants |

Keep no more than two engineering changes and three deep editorial reviews active at once. This is a work-in-progress limit, not an instruction to create tasks, appoint reviewers or use parallel agents.

## Roles and completion tracking

- **Build maintainer:** source checkpoint, reproducibility, validation, packaging and recovery.
- **Research/editorial lead:** source acquisition, claim revisions, evidence dates and current-state propagation.
- **Independent subject and accessibility reviewers:** actual findings on the selected candidate; reviewer availability is an external dependency, not an assumed approval.
- **Owner:** release scope and audience, applicable evidence admission/disposition authority, deployment and launch decisions.

Track progress through completed reviews, resolved defects, overdue checks with explicit dispositions, reproducible candidates and successful reader tasks. Report drafted, source-checked, independently reviewed, locally validated, committed, hosted and launched states separately. Page and packet counts are inventory checks rather than release success measures.

The next expansion should follow the operating-month findings: stronger source coverage for unanswered questions, deeper selected dossiers, additional admitted series or reviewed translations. Accounts, backend migration, paid features and broad automated publishing remain outside this completion plan unless separately commissioned.

## Validation for implementation

Use the existing entry point from `app/`:

```powershell
npm.cmd run validation:logged -- current:generate current:validate
```

Retain required historical regressions and run separately required phase checks where the current wrapper does not include them. Preserve actual logs and exit codes; never accept mixed or partially rebuilt output. Reuse valid results while source is unchanged, and repeat relevant checks after corrections.

This planning change edits documentation only. It does not run source gates, rerun a build, commit another task's work, update automation, contact reviewers, deploy, change access/DNS or freeze a release.
