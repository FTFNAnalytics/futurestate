# FTFN — next-stage execution plan

Prepared September 22, 2026; refreshed against the current working tree and terminal validation result inspected at September 23 01:59 UTC (September 22 locally). Planning only: this document does not approve content, appoint reviewers, change release scope, or authorize implementation, reviewer contact or deployment.

Execution follow-through: the [export repair and content-review continuation](<C:/Users/justi/OneDrive/Documents/NextGen Transportation/docs/release-reviews/2026-09-22/export-inventory-repair.md>) now records a terminal full pass at September 23 02:25:34 UTC, two unapproved translation samples and the six-case annual desk findings. The starting-state/first-sprint allocation below is retained as the plan, not an instruction to repeat that completed work. Source recovery is tracked separately; the next substantive edit is the identified Toronto clarification/context, followed by bounded Hornsdale/Dalrymple source context and actual review decisions.

## Direction

Move from a substantial locally built reference site to a demonstrably useful, reviewed release. The next work should close specific content, coverage and reader-experience gaps rather than add another layer of phase documents or new product features.

This is the current execution supplement to the [six-stage roadmap](<C:/Users/justi/OneDrive/Documents/NextGen Transportation/docs/roadmap-next-stages-2026-09-22.md>). It retains Phases 205–216 and their acceptance contracts. The [completion audit](<C:/Users/justi/OneDrive/Documents/NextGen Transportation/docs/release-reviews/2026-09-22/completion-audit.md>) remains the requirement-level record.

Full v1 remains the target unless the owner explicitly chooses a separately named, smaller release. In particular, completing the 33 selected drafts does not satisfy the full-v1 project/place portfolio, annual-edition, translation or independent-review requirements.

## Starting position

| Area | What is established | What remains |
| --- | --- | --- |
| Engineering | Five-answer baseline `5a568c91` is committed, fully validated and recovered byte-for-byte; an earlier locked clean-install proof also exists | The subsequent place-note revision failed release verification: expected 157 JSON exports, found 158. Reconcile the export contract, validate and checkpoint that changed candidate before using it for review |
| Selected content | 33 drafts exist; all 12 factual answers now have dated assisted source checks | Independent findings and dispositions across the selected set; Amtrak PDF visual verification remains unavailable |
| Portfolio | Census binds 24 canonical projects, 15 canonical places, 32 Montana source projects across 768 repeated rows, ten source-checked place dossiers and eighteen jurisdiction orientations; four additional editorial identities remain candidates | Resolve parent/child counting, geographic boundaries and dossier eligibility through actual decisions; accepted totals and the 100/70 gap remain unknown |
| Full edition and languages | All 58 annual records have existing reader drafts: 17 chapters, 12 findings, 24 cases and five appendices; 34 French/Spanish contracts exist | Review and correct the existing annual drafts, produce actual translations and obtain human language/subject approval; neither draft presence nor structural records establish acceptance |
| Research backlog | 25 decision packets are prepared | Zero authorized dispositions; resolve five at a time with the appropriate decision-maker |
| Reader experience | Search, archives, citations, paired English formats and bounded interface repairs are implemented | Five actual readers, assistive-technology testing and demonstrated 200% zoom; prior UI automation was stopped by the user |
| Measurements | Three pilots have precise evidence gaps and a feature hold | No admitted series or independent reproduction |
| Release | Local work and the previously inspected owner-only hosted version are distinct | Exact reviewed package, deployment authority, hosted verification and a launch/hold decision |

Verified baseline: Git HEAD is `5a568c91956364d92a63ece43d2f47de41d8eefb`. The [00:42 UTC validation sequence](<C:/Users/justi/OneDrive/Documents/NextGen Transportation/outputs/validation/2026-09-23T00-42-54.739Z-TEYPla/results.json>) finished generation and full validation with exit 0, the latter at September 23 01:05:04 UTC (September 22 locally). Candidate `65a554bf75f29f42f94bcc1d9f62603c4b0ab423e858f7e0a72d26b6f3c26aec` has receipt `204-FULL-LOCAL-VALIDATION-2026-09-22-e70bd20a6b20`. The [archive recovery verification](<C:/Users/justi/OneDrive/Documents/NextGen Transportation/outputs/release-checkpoints/2026-09-23T01-15-16.101Z-UkuZXC/git-recovery-verification.json>) recovered all 9,463 source files and the same candidate. Clean-install proof remains attached to its earlier source version, with the unchanged lockfile; no fresh install of this revision is claimed.

The preceding plan's snapshot at `4431d4b9` described an unfinished run. It is retained in Git history, but is no longer an instruction to repeat that completed work. This planning revision changes documentation only; it is not itself included in the preceding source archive.

**Changed working tree, not yet validated:** the subsequent [01:47 UTC sequence](<C:/Users/justi/OneDrive/Documents/NextGen Transportation/outputs/validation/2026-09-23T01-47-00.547Z-G9SyAe/results.json>) finished generation with exit 0, then full validation with exit 1 at **01:58:33 UTC**. Its [terminal log](<C:/Users/justi/OneDrive/Documents/NextGen Transportation/outputs/validation/2026-09-23T01-47-00.547Z-G9SyAe/2-current-validate.log>) reports `Expected 157 public JSON exports, found 158.` No new successful full-validation receipt was written. The place-note change adds a separate export, but the exact generated export set must be reconciled before changing the expected count; a count-only relaxation is not an adequate repair. Earlier progress notes that describe this run as active are historical observations.

The [portfolio identity review](<C:/Users/justi/OneDrive/Documents/NextGen Transportation/docs/release-reviews/2026-09-22/portfolio-identity-review.md>) already documents the Montana source join, ten bounded geographic/source-period findings and 72 authority-rail joins for the eighteen orientations. The next sprint should resolve remaining decisions and evidence gaps, not repeat these joins. All 58 annual drafts also already have exact inventory bindings; their substantive review is still outstanding.

## Delivery sequence

Effort below means focused work, not elapsed promises. Reviewer availability, source access and fixed evidence dates can extend the calendar. Roles indicate responsibility, not people already appointed.

| Stage | Priority and effort | Main output | Exit criterion |
| --- | --- | --- | --- |
| 1. Close the current validation failure | P0; budget 0.5–1 engineering day initially | Reconciled export contract and exact validated, recoverable place-note revision | Complete export identities agree with the manifest, full sequence exits 0, and candidate/archive/receipt/recovery agree; re-estimate if another defect appears |
| 2. Finish content and establish the real coverage gap | P0; initially 2–3 research days for reconciliation/triage, then sized batches and external review | Reviewed 33-article set, backlog decisions, accepted-portfolio census and full-v1 completion queue | Actual review dispositions; deduplicated coverage and outstanding requirements explicitly known |
| 3. Prove reader usability and accessibility | P1; 3–5 engineering days plus participant sessions | Tested journeys and resolved reader defects | At least 4/5 readers succeed unaided on each of five tasks; no unresolved critical accessibility defects on tested release routes |
| 4. Resolve measurement readiness | P1, alongside content; cap initial acquisition at 4–7 data days | Reproducible admitted series, or precise continued feature hold | Every pilot has an evidence-backed disposition; any published series is independently reproduced |
| 5. Assemble and verify the owner-only release candidate | After applicable content/QA exits; 1–2 engineering days plus decisions | Exact release package, authorized hosted version and recovery procedure | Hosted checks pass against the reviewed candidate; scope, access and rollback are recorded |
| 6. Decide launch and run the first operating month | Owner decision, then 30 actual days if launched | Launch/hold record and real maintenance evidence | Applicable release gates met; actual month reviewed before optional expansion |

Dependency: Stage 1 → Stage 2's approved release scope → Stage 3 acceptance → Stage 5 → Stage 6. Review recruitment can begin earlier when authorized. Stage 4 runs alongside Stages 2–3 and gates the measurement feature. Full-v1 coverage, required translations and the broader edition contract must also close before a full-v1 release; they are not postponed automatically to the operating month.

These are work estimates, not a full-v1 launch forecast. The portfolio gap is not yet known, and substantive annual-edition work and human translation review have not been sized. Re-estimate after the first completed content batch using observed research, writing and review time; do not apply the selected-article estimate to the entire v1 scope.

## 1. Close the changed-candidate validation gap

Build maintainer:

1. Preserve the completed `5a568c91` source/archive/receipt as the recovery baseline and the failed changed-candidate run as diagnostic evidence. The current failure does not invalidate that earlier candidate, and its earlier pass does not validate the changed output.
2. Compare the actual top-level export identities with the authoritative source inventory and manifest generator. Confirm whether the new `/data/place-identity-reviews.json` accounts for the difference and exclude stale-output or unintended-export explanations. Correct the source of the expectation, not just a generated number or the verifier's strictness. Add a focused regression for exact export membership and count.
3. Run focused source/output checks, then `npm.cmd run validation:logged -- current:generate current:validate` from the application directory. Retain terminal results. Do not edit candidate inputs during the sequence or run competing builds into the same output directory. Diagnose any further failure before describing the candidate as valid.
4. Only after a full pass, refresh the candidate-bound reachability inventory and selection packet, regenerate/check census freshness, and preserve the exact source checkpoint/recovery. Verify all 33 selected article payloads and original Phase 178 records remain unchanged where the intended change is presentation-only. Exclude unrelated packages, private fixtures and temporary output. Any separately authorized local commit must contain only intended files.
5. Update the progress/audit pointers to the actual result. Keep the earlier clean-install proof attached to its actual source version; reproduce the exact final release package from its lockfile before shipping. Retain Amtrak's text-only limitation and all independent-review holds.

Do not rerun an unchanged full build merely to produce another receipt. Repeat relevant checks when source changes; require the full documented release sequence for a changed release candidate.

## 2. Finish content and make full-v1 scope measurable

Research/editorial lead, independent reviewers and owner:

1. Extend the [existing source-pinned census](<C:/Users/justi/OneDrive/Documents/NextGen Transportation/docs/release-reviews/2026-09-22/portfolio-census.md>), rather than restarting it. The 32 Montana IDs already reconcile across the retained source and 768 registry/control rows: obtain the parent/child counting and substantive-dossier eligibility decisions next. Use the ten completed place-source notes to target missing boundary artifacts; resolve the four editorial identity candidates and the eighteen jurisdiction orientations against canonical identity/place-dossier eligibility. Keep acquisition dockets and target contracts separate. Compute the remaining gap against **100 projects and 70 places** only after identity/eligibility reconciliation and the required acceptance decisions; do not subtract overlapping historical inventories.
2. Reuse the existing selection sheet for the 33 drafts: four topics, eight projects, four places, twelve answers, four cases and one field report. Add exact review assignments, candidate/article versions, findings, correction status and the next decision required. Recheck what changed; do not repeat all completed source work without cause.
3. Prioritize unresolved high-impact claims: reporting periods and denominators, project/permit stage, issuer versus independent claims, historical versus current observations, and reachable historical material that could mislead a reader. Preserve corrections across title, summary, body, search, cards and exports.
4. Obtain actual independent reviews. Process the 25 prepared backlog packets in five batches, recording authorized acceptance, qualification, rejection or hold with rationale. A prepared packet or assisted pass is not an approval.
5. Turn the verified portfolio gap into small source-acquisition and editorial batches. Each added dossier needs a distinct identity, exact evidence, chronology, limitations and the next decisive artifact, followed by real review. Estimate total effort after the first batch establishes throughput.
6. Review the annual edition's 17 topic chapters, twelve cross-system findings, 24 named cases and five appendices for substantive completeness, source support and acceptance. Turn deficiencies into concrete writing/review assignments. The selected four-case field report does not replace this contract.
7. Schedule the 34 existing translation contracts—seventeen per language—against stable source text. Their translated-content and approval fields are currently null. Begin with one French and one Spanish reviewable sample to establish terminology and human review throughput, then size the remainder. English reading-format variants do not count as translations. Store reviewer findings and approved version identities.

Exit: the release scope is explicit, unsupported claims are corrected or held, required reviews exist, and full-v1 coverage/edition/translation shortfalls have been closed or remain visibly blocking full v1. No smaller release is assumed.

### First substantive work queue

Use the existing census and review packet as the working records; do not create a new phase or approval framework. The following order puts identity errors before expansion and source stability before translation.

| Order / responsible role | Bounded work item | Required handoff |
| --- | --- | --- |
| A — research lead and applicable decision-maker | Review the completed 32-ID Montana crosswalk; settle aggregate/child counting and which records qualify as substantive project dossiers | Explicit counting/eligibility decisions or unresolved decision requests; no award estimate treated as accepted service |
| B — research lead | Target the specific missing geographic evidence in the ten place notes and resolve the four editorial identity proposals | Geographic-unit and alias decisions/proposals with sources; municipality, postal/site label, facility, county and basin kept distinct; unresolved boundaries remain visible |
| C — editorial lead | Assess eligibility of the eighteen already joined jurisdiction orientations and remaining discoveries; review a six-case annual sample and two language samples | Known versus unknown accepted coverage, substantive annual findings, draft French/Spanish samples and measured review effort; draft samples are not approved translations |
| D — editorial lead and authorized reviewers | Bind all 33 drafts to exact review versions; process the first five of the 25 prepared decisions | Actual findings and authorized dispositions when available; otherwise a named dependency, not an invented approval |
| E — product/accessibility lead | Prepare sessions against the stable test candidate and prioritize defects from actual tests | Five-reader task matrix, route/device/assistive-technology coverage, severity and retest evidence; user permission before resuming stopped UI automation |

Every new or revised dossier should identify its subject, evidence cutoff, source-supported chronology, current stage, contradictory or missing evidence, and next decisive artifact. A source-count or word-count target is not a substitute for these elements. Findings that change meaning must propagate to titles, summaries, search, cards and exports, with historical provenance preserved.

After queue C, distinguish two milestones: **the gap is measured** and **the required portfolio is accepted**. The former permits a defensible schedule; only the latter satisfies the coverage gate. If decisions are still unavailable, report the bounded candidate inventory and unresolved decisions instead of announcing a numerical accepted gap.

### Concrete content batches after the technical repair

- **Annual-edition sample:** review the existing TSMC, Toronto, Hornsdale, Dalrymple, Montana and NNSA cases. Check every central claim, source period and later correction/context against exact source identities. Record supported text, needed corrections and missing evidence separately. The six-case sample sizes the remaining work; it does not approve the other 52 annual records or duplicate overlapping selected-article counts.
- **Translation pilot:** prepare one French and one Spanish draft from a version-pinned existing English Advanced Manufacturing text. Retain its source links, September 1 evidence cutoff and September 10 authorship date. Keep terminology notes and reviewer fields separate; both samples remain unpublished and explicitly unapproved until actual language/subject review. Use observed effort to size the other 32 contracts.
- **Independent article review:** start with TSMC, Toronto, broadband and the highest-risk remaining claims. Hand reviewers the existing source notes plus exact article versions; do not ask them to reconstruct the research packet. Keep the 25 backlog dispositions as a separate decision queue even where sources overlap.
- **Coverage expansion:** only after eligibility/counting decisions, select an initial batch of up to five distinct projects and five distinct places from the actual gaps. Require source-supported identity, chronology, limits and the next decisive artifact before proposing admission. Choose the following batch from observed research yield and reviewer capacity, not a raw page target.

Do not begin bulk translation or large-scale expansion while the source text or entity rules are still changing. Annual assessment, bounded missing-source acquisition and review preparation can proceed alongside decision waits without pretending those decisions have occurred.

## 3. Test how people actually use the site

Product/build maintainer and independent accessibility reviewer:

- Reuse the five tasks: topic orientation, named-project stage, place constraints, claim verification and recent changes. Refresh dated wording to the test candidate without changing the intent.
- Have five actual target readers attempt every task unaided. Record all 25 attempts, time, wrong turns, search terms and misunderstandings. The threshold applies to each task, not an overall average.
- Test keyboard navigation, a real assistive-technology setup, 200% zoom, narrow reflow, focus, headings, source links, tables and English-format switching. Keep automated and assisted findings distinct from participant acceptance.
- Fix observed blockers in shared templates, then retest the affected journeys. Preserve no-JavaScript reading, complete archives, crawlable pagination and the existing page budgets.
- UI automation remains stopped unless the user explicitly authorizes resuming it. CLI/static checks can continue within their limits; they cannot stand in for the unperformed zoom or assistive-technology checks.

Avoid speculative redesign work until the sessions identify the real navigation and comprehension problems.

## 4. Make a bounded measurement decision

Data/research lead and independent reproducer:

Target the already identified missing artifacts for Hornsdale, Dalrymple and F-15EX. For Dalrymple, prioritize the availability contract definition, protocol versions and eligible interval records, rather than retrieving the same report again without a new evidential purpose.

Admit a series only after entity, period, unit, denominator, method and revision policy are established. Reproduce it independently, then implement the source-linked table, export and accessible chart with visible gaps and revisions. Otherwise retain a precise hold and reopening condition. Do not create a chart from incompatible periods or invent observations to finish the feature. A feature hold is not a waiver of any mandatory full-v1 condition.

## 5–6. Release and operate

Build maintainer and release owner:

1. Assemble the exact source commit, lockfile, build receipt, selected route/article versions, review outcomes, open limitations and recovery target.
2. Resolve release scope and deployment authority. Inspect the existing site's current access/version afresh; do not treat the previously inspected version as today's hosting state.
3. Deploy only when authorized, retaining owner-only access and existing domain/DNS boundaries unless separately changed. Verify the terminal deployment result, representative routes, exports, downloads, indexing and access against the saved version.
4. Record an explicit launch or hold decision. A separately named bounded English release needs an owner scope decision; it must not be presented as full v1.
5. If launched, collect 30 real days of source-currency, corrections, reader/search failures and maintenance effort. Review weekly, then choose optional expansion based on that evidence.

## First five working days

| Order | Work | Concrete handoff |
| --- | --- | --- |
| Day 1 | Reconcile the export mismatch, run the changed-candidate validation and capture recovery if it passes | Exact export inventory, terminal result and candidate-bound packet/checkpoint; if it fails, retain the specific blocker and do not claim a pass |
| Day 2 | A/B: use completed source joins to prepare counting/eligibility decisions and target missing geographic artifacts | Explicit unresolved decisions, acquired evidence or precise access gaps; no repeated 768-row reconciliation without a changed input |
| Day 3 | C: review the six-case annual sample and prepare one French/one Spanish draft sample | Claim findings, terminology notes, version bindings and review-ready drafts; no translation approval inferred |
| Day 4 | D: hand off highest-risk selected articles and first five backlog packets through the owner-authorized process | Real review returns where available; otherwise a clear reviewer/decision dependency and supported correction proposals |
| Day 5 | E: prepare stable-candidate reader sessions, review sprint findings and size the next bounded batch | Five-task session materials, QA coverage plan, actual throughput and revised estimates; no fabricated sessions or resumed UI automation |

This is a five-day work allocation, not a promise to resolve all remaining identities, review six cases to final acceptance, obtain every decision, or finish full v1 in one sprint. Repair overruns or missing reviewers shift later work; record that explicitly. Carry unresolved cases forward and adjust effort from observed throughput. Keep at most two engineering changes and three deep editorial reviews active at once. No subagents, reviewer contact or scheduled jobs are authorized by the allocation. If external review is unavailable, continue the in-scope census, acquisition, writing and CLI checks after implementation is requested; do not declare review complete.

## Milestone decision checks

| Checkpoint | Evidence needed | If not ready |
| --- | --- | --- |
| End of first sprint | Exact reconciliations completed, unresolved identities, first review findings or dependencies, and measured effort | Continue a bounded content batch; do not infer a release date from generated page counts |
| Before expanding the portfolio | Explicit identity/counting rules and source-supported dossier eligibility | Hold ambiguous admissions and preserve their candidate status |
| Before full-v1 release packaging | Required 100/70 accepted portfolio, edition and translation work, claim/backlog decisions, reader/accessibility acceptance and applicable evidence gates | Full v1 remains held; a smaller named edition requires an explicit owner scope decision and its own honest review boundary |
| Before deployment | Exact validated package, final lockfile reproduction, review outcomes, recovery target and deployment authority | Keep the local candidate; do not replace the hosted version or change access |
| After 30 actual operating days | Real corrections, source-check outcomes, reader failures and maintenance effort | Choose further work from observed needs, not a prewritten success report |

A smaller article selection is not automatically an isolated smaller site: the saved reachability audit found that navigation from the 33 articles reaches all 16,626 application pages. Any reduced release proposal must explicitly address reachable historical material and its review boundaries before it is treated as a practical shortcut.

## Existing evidence calendar

Preserve the current record identities and operate on actual dates: September 24 NNSA capacity; September 28 Toronto; October 1 Loudoun; October 9 separate Amtrak and NNSA decisions plus the cycle audit and applicable follow-ups; November 21 the separate Arizona appointment. Inspect any September 23 operating items before execution. A later obligation need not block an earlier release automatically, but its status and applicable release dependency must remain explicit. This plan creates no new monitor.

## Decisions and non-goals

The immediate owner dependency is access to independent subject/accessibility reviewers, five real readers and the applicable backlog decision-maker. UI automation also needs explicit permission to resume. Release scope and deployment/launch authority are later decisions; no external action is authorized by this plan.

Track reviewed articles, authorized dispositions, deduplicated accepted projects/places, approved translations, successful reader tasks and resolved defects. Keep source-checked, independently accepted, locally validated, committed, hosted and launched states separate. Generated page counts are not a completion metric.

Do not add accounts, payments, a backend migration, broad automatic publishing or another phase framework to this completion effort. Optional expansion follows the actual operating-month findings; mandatory full-v1 gaps remain in scope now.
