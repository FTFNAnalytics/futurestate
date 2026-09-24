# FTFN — next build stages

Planning snapshot: September 24, 2026, America/Edmonton.

Implementation follow-through, September 24: the [NNSA operation and complete local validation](phase-207-nnsa-capacity-recheck-2026-09-24.md) finished successfully at 18:22:28.781 UTC as candidate `28e5ec8b`, receipt `204-FULL-LOCAL-VALIDATION-2026-09-24-a81c908440f5`. The [PDF follow-through](release-reviews/2026-09-22/nnsa-capacity-pdf-visual-followthrough-2026-09-24.md) resolves both scoped visual-access gaps without changing the earlier receipt. Do not restart that completed run. Exact source recovery and refreshed review bindings are subsequent evidence; human acceptance and release gates remain open. The starting-point and first-sprint tables below retain the planning snapshot, not instructions to repeat completed work.

## Direction

The next milestone is **a stable, reviewable candidate with genuine acceptance decisions, a verified coverage gap and observed reader outcomes**. The platform and review infrastructure already exist. Finish the remaining evidence, content and usability work before expanding the architecture.

This plan updates the execution order for the existing six stages and Phases 205–216. It preserves the full-v1 requirements in the [original roadmap](roadmap-next-stages-2026-09-22.md). It supersedes older sprint instructions, not historical records or acceptance contracts. A smaller release would require a separately named, explicit owner scope decision.

This is planning only: no application implementation, reviewer contact, resumed UI automation, commit, deployment, access/DNS change, launch or new scheduled job is authorized by this document. Responsibilities below are proposed roles, not appointments.

## Starting point

The latest completed baseline inspected for this plan is application candidate `4bfbd73f`, receipt `204-FULL-LOCAL-VALIDATION-2026-09-23-e86a599abbc0`. Its [terminal validation](../outputs/validation/2026-09-24T01-34-20.150Z-cegmww/results.json) passed generation and full validation. The [implementation report](release-reviews/2026-09-22/annual-registration-reserve-followthrough-2026-09-23.md) records 16,640 application pages, 159 top-level JSON exports and 712,249 local references with zero missing targets. These are technical output counts, not accepted-content counts.

Source/review checkpoint `39475c15` has [verified exact archive recovery](../outputs/release-checkpoints/2026-09-24T03-42-49.116Z-4QSpTx/git-recovery-verification.json). Application-source commit `50520aa5` and the later review-document checkpoints intentionally have different identities. The successful [clean-install reproduction](release-reviews/2026-09-22/clean-install-reproduction-2026-09-23.md) belongs to an earlier candidate and uses a separate private editorial prerequisite; it does not prove a clean installation of the final release.

At inspection, the working tree also contains uncommitted September 24 NNSA/evidence-operation, verification and generated-output changes. They are not included in the completed baseline above. Preserve them, establish their actual run/receipt status before further implementation, and do not overwrite their output or borrow the earlier candidate's pass. This plan does not adjudicate those changes or claim that the September 24 gate has closed.

| Workstream | Already available | Remaining acceptance |
| --- | --- | --- |
| Editorial | 33 selected drafts; all 58 annual assisted comparisons; ready subject and annual review packets | Independent selected/reachable-claim dispositions and 58 annual acceptances |
| Portfolio | 24 canonical projects and 15 places inventoried; additional entity groups reconciled | Counting/eligibility decisions, then at least 100 accepted distinct projects and 70 accepted distinct places |
| Backlog and languages | 25 researched decision packets; 34 language contracts; two draft translation samples | 25 authorized backlog decisions and 34 human-approved language contracts |
| Reader experience | Search, pagination, relationship archives, citations and paired English formats | Five actual readers × five tasks; actual accessibility testing and retesting |
| Measurements | Three researched pilots with identified missing artifacts | Evidence-backed pilot outcomes and independent reproduction of any admitted series |
| Release | Passing local baseline and recoverable source | Final-candidate clean installation, authorized owner-only hosted verification, launch/hold and an actual operating month if launched |

Do not repeat the completed Nevada, battery, registration/reserve or history corrections, USGS/DOE acquisition, Montana row reconciliation, or baseline installation. Use their existing findings. Prepared packets and assisted checks are not human approval.

## Delivery sequence

Engineering keeps the candidate stable. Editorial and independent reviewers resolve content, coverage and language acceptance. The owner supplies assignments, decision authority and release choices. Content review, participant recruitment and measurement acquisition can proceed alongside one another; final acceptance remains version-specific.

| Stage | Next delivery | Lead responsibility | Completion criterion |
| --- | --- | --- | --- |
| 1. Stabilize and preserve | Finish or accurately hand off the current September 24 batch; validate changed inputs and preserve exact source | Engineering; evidence decision-maker for governed outcomes | Source, candidate, validation receipt and recovery agree; no unfinished run represented as passing |
| 2. Complete accepted content and coverage | Review existing material, decide entity eligibility, then build only the established coverage gaps | Editorial, subject/language reviewers and owner | 33 selected articles and reachable claims addressed; 58 annual acceptances; 25 backlog decisions; 34 language approvals; accepted 100-project/70-place minimums |
| 3. Improve and prove reader experience | Run the five journeys and accessibility checks; fix failures in shared templates | Reader-study lead, accessibility reviewer and engineering | At least 4/5 readers succeed unaided on each task; actual assistive-technology and 200% zoom checks; no unresolved critical tested defects |
| 4. Resolve measurement readiness | Obtain exact missing definitions and records for all three pilots | Evidence/data lead and independent reproducer | Evidence-backed outcome for each pilot; any admitted/displayed series independently reproduced; unresolved mandatory requirements stay open |
| 5. Verify the exact release candidate | Final isolated clean install, recovery, release packet and authorized owner-only hosting verification | Engineering, owner and release reviewer | Reviewed source/build/package/hosted version agree; access, routes, downloads, exports, indexing and recovery verified |
| 6. Launch decision and operating month | Obtain explicit launch/hold; maintain the launched edition for 30 actual days | Owner and operations/editorial lead | Dated decision; if launched, actual weekly reviews and day-30 assessment |

Critical path: accepted scope/content → final reader acceptance → final reproduction and hosted verification → owner launch decision → actual operating month. Stage 1 is maintained throughout; measurement and language requirements cannot be silently removed from full v1. Early reader sessions can use stable material, with affected journeys retested after changes.

## First sprint: five working days

These are proposed work allocations beginning with the next authorized implementation session, not promises that human responses will arrive within five days.

| Allocation | Concrete work | Handoff |
| --- | --- | --- |
| Day 1 — establish the current candidate | Inspect the in-progress September 24 batch and any active validation; distinguish source inspection from authorized evidence decisions; finish applicable verification without restarting a live run | Exact completed candidate or precise remaining failure/authority requirement; preserved prior history |
| Day 2 — start real review | Reuse the first-four-answer and annual battery packets; refresh only bindings invalidated by changed inputs; owner assigns reviewers and permits contact | Actual assignment state and versioned material ready for review; no invented returns |
| Day 3 — unlock targeted expansion | Obtain portfolio counting/eligibility decisions, backlog 001–005 dispositions and language sample mapping/locale decisions | Accepted totals where established, remaining gap, and a selected batch of up to five projects/five places |
| Day 4 — gather user/evidence findings | Run actual reader/accessibility sessions when participants and permissions are available; pursue precise missing pilot artifacts | Recorded observations, located evidence and explicit unresolved holds |
| Day 5 — integrate and forecast | Correct returned findings, validate changed content, refresh affected review bindings and size the next batch from observed throughput | Recoverable candidate, actual acceptance counts, re-review list and next sprint |

If a human dependency is unavailable, continue unaffected, bounded source research and correction work. Do not create duplicate review packets, speculative features or fictitious approvals to fill the sprint. Keep at most two implementation changes active and three deep editorial reviews in progress; this does not authorize agents or external contacts.

## Stage 2 work packages

### A. Turn existing drafts into accepted material

Start with the [four subject-review worksheets](release-reviews/2026-09-22/subject-review-first-four/README.md): TSMC Arizona, Toronto file 24 254930, Louisiana broadband adoption and demonstrated quantum capability. In parallel, use the [annual battery packet](release-reviews/2026-09-22/annual-battery-review-packet/README.md) for its four annual assignments and two paired presentations. Do not count those six presentations as six annual acceptances.

Continue in small batches through all 33 selected articles and 58 annual records. Record actual reviewer identity, expertise/conflicts, date, exact version, located findings, disposition and re-review triggers. Fix meaning-changing findings consistently across body, title/summary, cards, search, metadata, exports and related presentations; preserve earlier reviews and original sources.

The [reachability inventory](release-reviews/2026-09-22/reachability.md) shows that the 33 selected articles link onward to all 16,640 application pages, with 25 saved HTML downloads separate. The selected set is not an isolated release. Material reachable claims need actual review/correction or an expressly approved release boundary; feed exclusion alone does not remove a page. Retain known source-access/visual gaps, including Amtrak, until actually resolved.

### B. Establish the coverage gap, then expand

Use the [portfolio census](release-reviews/2026-09-22/portfolio-census.md) and [identity findings](release-reviews/2026-09-22/portfolio-identity-review.md), not a new inventory.

1. Decide parent/child counting and dossier eligibility for the 32 Montana source IDs.
2. Decide eligibility and geographic scope for ten place notes, eighteen jurisdiction orientations and four editorial candidates.
3. Record accepted distinct entities. Accepted totals remain unknown until these decisions occur; the 24/15 inventory is not an accepted count.
4. Calculate the actual gaps: `max(0, 100 - accepted projects)` and `max(0, 70 - accepted places)`.
5. Add batches of up to five projects and five places, each with a named identity, chronology, responsible authority, source-located evidence, limitations and next decisive artifact. Obtain acceptance before counting a batch.

Prioritize substantive, source-supported dossiers over route growth. Repeated pages, source rows and unnamed acquisition targets do not add accepted entities.

### C. Close backlog and language decisions

Process [all 25 backlog items](release-reviews/2026-09-22/backlog-all-25.md) in five-item batches with an authorized decision-maker. An accept/qualify/reject/hold disposition needs actual rationale and affected routes; research completion alone is insufficient.

Resolve the [French and Spanish sample](release-reviews/2026-09-22/translation-pilots/review-guide.md) source-to-contract mapping, locales and terminology before scaling translation. Translate stable accepted English versions in small batches, obtain human language and subject approval for all 34 contracts, and retest translated layouts. Paired English reading formats are not translations. Unapproved language drafts remain unpublished.

## Stage 3: let observed failures determine interface work

Reuse the [reader session protocol](release-reviews/2026-09-22/reader-session-sheet.md). Five target readers each attempt topic orientation, project stage, place constraints, claim verification and recent changes. Capture 25 actual unaided attempts, including completion, time, wrong turns and misunderstandings; require at least four successful readers on every task, not a pooled average.

Test keyboard navigation, actual assistive technology, 200% zoom, narrow reflow, focus, headings, tables, citation use and English-format switching. Record route, candidate, method, date and retest outcome. Obtain appropriate consent before recording or collecting identifying information.

Fix critical blockers first, repeated comprehension/navigation failures second, and visual polish third. Apply validated improvements to shared templates while preserving no-JavaScript reading, complete archives, crawlable pagination, source history and existing page budgets. CLI checks cannot substitute for actual readers or assistive technology. Previously stopped browser/desktop automation requires separate explicit permission before resuming.

## Stage 4: a bounded measurement-evidence pass

Reuse the [measurement acquisition record](release-reviews/2026-09-22/measurement-acquisition.md).

| Pilot | Evidence that would unblock the next decision |
| --- | --- |
| Hornsdale | Availability definition, configuration/service scope, eligible intervals, exclusions/revisions and the recorded date correction |
| Dalrymple | Applicable Schedule 7 calculation, Operating Protocol versions, interval ledger and telemetry/revision rules |
| F-15EX | Aircraft identities, formal acceptance dates, reporting coverage, exclusions/rework and revision history |

Establish entity, period, unit, denominator, method and revision policy before admission. Independently reproduce any admitted series, then provide a source-linked table/export and accessible chart with visible gaps. If evidence remains unavailable, record the exact missing artifact, hold and reopening condition. Do not repeat unchanged failed retrievals without a new reason. A hold is not a waiver of mandatory full-v1 requirements.

## Engineering and release discipline

For an authorized application batch, keep inputs stable and serialize runs sharing output. Use the existing entry point from the application directory:

    npm.cmd run validation:logged -- current:generate current:validate

Require terminal success, inspect rendered/output regressions, then refresh affected review bindings, census and reachability. Preserve failed attempts. Capture/recover exact source and make scoped commits only when authorized; exclude unrelated root packages, private inputs, outputs and temporary material. Do not stage the workspace wholesale or relabel an older receipt as current.

After content and reader acceptance, reproduce the final candidate in an isolated clean installation with its lockfile and declared private prerequisite. Assemble actual approvals, remaining limitations, source identity, build receipt, dependency disposition and recovery target.

Before authorized hosting, inspect the existing Sites project's actual version/access state; historical owner-only version 79 is not a fresh check. Verify terminal deployment success and the exact saved owner-only version, representative routes, downloads/exports, indexing and recovery. Preserve existing domain/DNS and repository boundaries. Public launch remains a separate explicit owner decision.

If launched, count 30 real days, review weekly, and record source checks, corrections, reader/search failures and maintenance effort. Use the day-30 assessment to choose further expansion. Do not prewrite future operations as completed results.

## Calendar and effort

Keep calendar work distinct from sprint allocations and acceptance counts:

| Actual date | Existing source obligation |
| --- | --- |
| September 24 | NNSA accepted capacity; in-progress working-tree changes require their own status/authority verification |
| September 28 | Toronto project-file follow-up |
| October 1 | Loudoun standards |
| October 9 | Separate Amtrak/NNSA primary decisions, cycle audit and applicable follow-ups |
| November 21 | Separate Arizona appointment |

Future obligations retain separate identities and occur on their real dates; not every future check automatically blocks an earlier release. This plan does not perform these checks or create/update a monitor.

Initial planning allowances: five working days for the first sprint; 3–5 engineering days for reader-driven fixes plus actual sessions; 4–7 data days for the initial pilot evidence pass; 0.5–1 engineering day for final reproduction and 1–2 for authorized release verification. These are provisional effort budgets, not elapsed-time commitments or a total release estimate. Content/portfolio/language effort depends on the accepted gap, reviewer capacity and rework. Forecast after the first returned batches rather than adding incomparable counts or promising an unsupported launch date.

## Decisions that unlock progress

The owner should first designate the independent subject/editorial, language and accessibility reviewers and five readers, with an agreed contact process; assign portfolio/backlog decision authority; and resolve language mapping/locales. UI automation permission is a separate choice. Exact release scope, deployment and launch authority come later.

At each completed batch report: exact candidate; genuine selected and annual acceptances; authorized backlog decisions; approved language contracts; accepted distinct projects/places and gaps; reader success per task; unresolved accessibility defects; and pilot outcomes. Keep these separate, not one blended completion percentage.

Starting human-acceptance state in the inspected materials: selected/reachable-claim approval not established; 0/58 independent annual acceptances, 0/25 authorized backlog dispositions, 0/34 approved language contracts, no completed participant/accessibility study and 0/3 admitted series. Accepted portfolio totals are unknown. The [completion audit](release-reviews/2026-09-22/completion-audit.md) retains the full obligation set.

Stop release progression for unresolved material claims, source/output mismatches, failed mandatory acceptance, critical tested accessibility defects or missing authority. Continue unaffected authorized work. The next success criterion is real accepted progress against these requirements, not another increase in generated page count.
