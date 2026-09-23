# FTFN — next-stage execution plan

Prepared September 22, 2026, from the current working tree and saved validation results. Planning only: this document does not approve content, appoint reviewers, change release scope, or authorize deployment.

## Direction

Move from a substantial locally built reference site to a demonstrably useful, reviewed release. The next work should close specific content, coverage and reader-experience gaps rather than add another layer of phase documents or new product features.

This is the current execution supplement to the [six-stage roadmap](<C:/Users/justi/OneDrive/Documents/NextGen Transportation/docs/roadmap-next-stages-2026-09-22.md>). It retains Phases 205–216 and their acceptance contracts. The [completion audit](<C:/Users/justi/OneDrive/Documents/NextGen Transportation/docs/release-reviews/2026-09-22/completion-audit.md>) remains the requirement-level record.

Full v1 remains the target unless the owner explicitly chooses a separately named, smaller release. In particular, completing the 33 selected drafts does not satisfy the full-v1 project/place portfolio, annual-edition, translation or independent-review requirements.

## Starting position

| Area | What is established | What remains |
| --- | --- | --- |
| Engineering | Prior candidates passed full local validation; a locked clean-install proof and recoverable source checkpoints exist | Finish checking and preserving the latest five-answer revision; do not borrow the previous candidate's receipt |
| Selected content | 33 drafts exist; all 12 factual answers now have dated assisted source checks | Independent findings and dispositions across the selected set; Amtrak PDF visual verification remains unavailable |
| Research backlog | 25 decision packets are prepared | Zero authorized dispositions; resolve five at a time with the appropriate decision-maker |
| Reader experience | Search, archives, citations, paired English formats and bounded interface repairs are implemented | Five actual readers, assistive-technology testing and demonstrated 200% zoom; prior UI automation was stopped by the user |
| Measurements | Three pilots have precise evidence gaps and a feature hold | No admitted series or independent reproduction |
| Release | Local work and the previously inspected owner-only hosted version are distinct | Exact reviewed package, deployment authority, hosted verification and a launch/hold decision |

Snapshot boundary: Git HEAD is `4431d4b97c9ff520e2d75d13e95851bef888dcbc`, with later source changes uncommitted. The [00:42 UTC validation sequence](<C:/Users/justi/OneDrive/Documents/NextGen Transportation/outputs/validation/2026-09-23T00-42-54.739Z-TEYPla/results.json>) recorded generation exit 0 when inspected but not a terminal full-validation result. A newly minted receipt alone is not proof that its final rebuild finished. Re-read the actual results before execution; this paragraph is a planning snapshot, not a live status display.

## Delivery sequence

Effort below means focused work, not elapsed promises. Reviewer availability, source access and fixed evidence dates can extend the calendar. Roles indicate responsibility, not people already appointed.

| Stage | Priority and effort | Main output | Exit criterion |
| --- | --- | --- | --- |
| 1. Close the current technical checkpoint | P0; approximately 0.5–1 engineering day | Exact validated, recoverable source version and reconciled status | Full sequence terminates successfully; candidate, source archive, receipt and recovery proof agree |
| 2. Finish content and establish the real coverage gap | P0; 2–3 days for census/triage, then sized batches | Reviewed 33-article set, backlog decisions, accepted-portfolio census and full-v1 completion queue | Actual review dispositions; deduplicated coverage and outstanding requirements explicitly known |
| 3. Prove reader usability and accessibility | P1; 3–5 engineering days plus participant sessions | Tested journeys and resolved reader defects | At least 4/5 readers succeed unaided on each of five tasks; no unresolved critical accessibility defects on tested release routes |
| 4. Resolve measurement readiness | P1, alongside content; cap initial acquisition at 4–7 data days | Reproducible admitted series, or precise continued feature hold | Every pilot has an evidence-backed disposition; any published series is independently reproduced |
| 5. Assemble and verify the owner-only release candidate | After applicable content/QA exits; 1–2 engineering days plus decisions | Exact release package, authorized hosted version and recovery procedure | Hosted checks pass against the reviewed candidate; scope, access and rollback are recorded |
| 6. Decide launch and run the first operating month | Owner decision, then 30 actual days if launched | Launch/hold record and real maintenance evidence | Applicable release gates met; actual month reviewed before optional expansion |

Dependency: Stage 1 → Stage 2's approved release scope → Stage 3 acceptance → Stage 5 → Stage 6. Review recruitment can begin earlier when authorized. Stage 4 runs alongside Stages 2–3 and gates the measurement feature. Full-v1 coverage, required translations and the broader edition contract must also close before a full-v1 release; they are not postponed automatically to the operating month.

## 1. Close the technical checkpoint

Build maintainer:

1. Inspect the existing validation run's terminal result. If still active, follow that run rather than starting a competing build. Diagnose an actual failure before rerunning.
2. After success, regenerate the candidate-bound reachability inventory and review packet. Confirm the five revised answers and 28 unchanged article records; retain Amtrak's text-only limitation.
3. Preserve a scoped source checkpoint and verify its archive/recovery against the exact candidate. Exclude unrelated packages, private fixtures and temporary output. A future local commit must include only reviewed, intended files.
4. Reconcile current status pointers while preserving dated history. Retain the previous clean-install proof with its actual version; do not relabel it as a fresh install of the latest tree. Reproduce the final release package from the lockfile before shipping.

Do not rerun an unchanged full build merely to produce another receipt. Repeat relevant checks when source changes; require the full documented release sequence for a changed release candidate.

## 2. Finish content and make full-v1 scope measurable

Research/editorial lead, independent reviewers and owner:

1. Build a deduplicated census of actual named projects and places. Record canonical identity, aliases, source support, article state, acceptance state and unmet requirements. Keep acquisition dockets and target contracts separate from accepted entities. Compute the remaining gap against **100 projects and 70 places** only after this census; do not subtract overlapping historical inventories.
2. Reuse the existing selection sheet for the 33 drafts: four topics, eight projects, four places, twelve answers, four cases and one field report. Add exact review assignments, candidate/article versions, findings, correction status and the next decision required. Recheck what changed; do not repeat all completed source work without cause.
3. Prioritize unresolved high-impact claims: reporting periods and denominators, project/permit stage, issuer versus independent claims, historical versus current observations, and reachable historical material that could mislead a reader. Preserve corrections across title, summary, body, search, cards and exports.
4. Obtain actual independent reviews. Process the 25 prepared backlog packets in five batches, recording authorized acceptance, qualification, rejection or hold with rationale. A prepared packet or assisted pass is not an approval.
5. Turn the verified portfolio gap into small source-acquisition and editorial batches. Each added dossier needs a distinct identity, exact evidence, chronology, limitations and the next decisive artifact, followed by real review. Estimate total effort after the first batch establishes throughput.
6. Audit the selected four-case field report against the separate full annual-edition contract. Plan the missing substantive coverage; do not count the selected report as the full edition.
7. Inventory the French and Spanish requirements, then schedule translation and human subject/language review against stable source text. English reading-format variants do not count as translations. Store reviewer findings and approved version identities.

Exit: the release scope is explicit, unsupported claims are corrected or held, required reviews exist, and full-v1 coverage/edition/translation shortfalls have been closed or remain visibly blocking full v1. No smaller release is assumed.

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
| Day 1 | Close the latest validation/checkpoint; refresh candidate-bound review material | One reliable candidate and recovery record, with explicit remaining gates |
| Days 1–3 | Deduplicate the project/place inventory and audit annual-edition/translation scope | Honest full-v1 gap list, prioritized first content batch and effort estimate |
| Days 2–3 | Prepare candidate-specific assignments for the 33 drafts and first five backlog decisions | Review-ready material; owner supplies reviewers and decision authority |
| Days 3–4 | Triage high-impact remaining claims and prepare reader sessions | Corrected claims where supported, ready-to-run tasks and defect log |
| Days 4–5 | Execute available authorized reviews/tests and one targeted measurement acquisition pass | Actual findings or precise external dependencies, never manufactured acceptance |

These days can overlap in activity, but are not instructions to spawn agents, contact reviewers or create scheduled jobs. If external review is unavailable, continue the census, source acquisition, content work and CLI checks; do not declare review complete.

## Existing evidence calendar

Preserve the current record identities and operate on actual dates: September 24 NNSA capacity; September 28 Toronto; October 1 Loudoun; October 9 separate Amtrak and NNSA decisions plus the cycle audit and applicable follow-ups; November 21 the separate Arizona appointment. Inspect any September 23 operating items before execution. A later obligation need not block an earlier release automatically, but its status and applicable release dependency must remain explicit. This plan creates no new monitor.

## Decisions and non-goals

The immediate owner dependency is access to independent subject/accessibility reviewers, five real readers and the applicable backlog decision-maker. UI automation also needs explicit permission to resume. Release scope and deployment/launch authority are later decisions; no external action is authorized by this plan.

Track reviewed articles, authorized dispositions, deduplicated accepted projects/places, approved translations, successful reader tasks and resolved defects. Keep source-checked, independently accepted, locally validated, committed, hosted and launched states separate. Generated page counts are not a completion metric.

Do not add accounts, payments, a backend migration, broad automatic publishing or another phase framework to this completion effort. Optional expansion follows the actual operating-month findings; mandatory full-v1 gaps remain in scope now.
