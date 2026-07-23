# Documentation Map

This map explains how the FTFN documentation system fits together, when each document should be updated, and how future work sessions should use it.

The goal is simple: keep a very broad project legible as it grows.

## Read Order for Future Work Sessions

Start each substantial work session in this order:

1. [v0.2 Build Summary](build-summary-v0.2.md)
2. [v0.2 Roadmap](roadmap-v0.2.md)
3. [v0.2 Session Handoff Plan](session-handoff-v0.2.md)
4. [v0.2 Build Manifest](../deployment/ftfn-v0.2-build.json)
5. [v0.2 Release QA](release-qa-v0.2.md)
6. [Launch Package](launch-package.md)
7. [README](../README.md)
8. [Session Brief](session-brief.md)
9. [Master Roadmap](master-roadmap.md)
10. [Decision Log](decision-log.md)
11. [Taxonomy](taxonomy.md)
12. [Content Model](content-model.md)
13. [Source Strategy](source-strategy.md)
14. [Source Monitoring Plan](source-monitoring-plan.md)
15. [Source Broadening And Intake Plan](source-broadening-and-intake-plan.md)
16. [Private Source-Candidate Registry](private-source-candidate-registry.md)
17. [Authoritative Live Source Plan](authoritative-live-source-plan.md)
18. [Authority Red-Team and Resource Expansion Plan](authority-red-team-and-resource-expansion-plan.md)
19. [Editorial Method](editorial-method.md)
20. [Review Checklists](review-checklists.md)
21. [Briefing Template](briefing-template.md)
22. [Evidence Gap Register](evidence-gap-register.md)
23. [Dependency Map Format](dependency-map-format.md)
24. [Information Architecture](information-architecture.md)
25. [Sample Records](sample-records.md)
26. [Content Expansion Plan](content-expansion-plan.md)
27. [Signals Roadmap](signals-roadmap.md)
28. [Publication Readiness Triage](publication-readiness-triage.md)
29. [Launch Candidate Review](launch-candidate-review.md)
30. [Publication Policy](publication-policy.md)
31. [Technical Stack Decision](technical-stack-decision.md)
32. [Content Scaffold Plan](content-scaffold-plan.md)
33. The current work package in [work-packages](work-packages/)

Use [Future Considerations](future-considerations.md) when the work touches theory, long-range ideas, or possible future features.

Use [Prompt Library](prompt-library.md) when starting a repeated workflow such as source research, signal writing, data modeling, local system analysis, or roadmap updates.

## Core Documents

### v0.2 Build Summary And Session Handoff

Purpose:

- Preserve a concise factual build and release snapshot.
- Give a new session the shortest reliable read order and exact next sequence.
- Separate repository, preview, release, DNS, and backend approvals.

Update when:

- build counts, release status, branch state, deployment state, or the next phase changes.
- a preview or production deployment is completed.
- the hosting or domain plan changes.

Do not use them for:

- replacing the versioned build manifest,
- detailed historical rationale,
- recording unverified deployment claims.

### README

Purpose:

- Explain what FTFN is.
- Link to the project documents.
- Preserve the thesis and working rule.

Update when:

- A major new document is added.
- The project positioning changes.
- The read order changes.

Do not use it for:

- Detailed schemas.
- Long strategy notes.
- Open-ended theory.

### Session Brief

Purpose:

- Provide a compact handoff for starting a new chat.
- Preserve the current project state, latest completed phase, next roadmap phase, validation baseline, and restart prompt.
- Reduce dependence on the full conversation history.

Update when:

- A phase is completed.
- The current app baseline changes.
- The next phase changes.
- A major content count or editorial rule changes.

Do not use it for:

- Full implementation details.
- Long decision rationale.
- Deep schema or source documentation.

### Master Roadmap

Purpose:

- Hold the start-to-finish plan.
- Show active phases, later phases, immediate next steps, and open decisions.
- Keep implementation sequenced.

Update when:

- A phase is completed.
- A new phase is added.
- Priorities change.
- A roadmap assumption becomes stale.

Do not use it for:

- Long glossary definitions.
- Full schema examples.
- Loose ideas that are not yet actionable.

### Decision Log

Purpose:

- Record strategic, editorial, design, and technical decisions.
- Preserve rationale so future work does not re-litigate settled choices.

Update when:

- A durable decision is made.
- A decision changes.
- A concept becomes part of the operating model.

Each entry should include:

- date,
- decision,
- rationale,
- implications.

### Future Considerations

Purpose:

- Capture ideas that matter but are not yet active implementation work.
- Preserve theoretical lenses, later-stage product ideas, and possible analytical frameworks.

Update when:

- A conversation produces an important idea that should not be lost.
- A theoretical concept might later become a feature, essay, metric, or editorial method.

Mark ideas as provisional unless they have been accepted into the roadmap.

### Prompt Library

Purpose:

- Store reusable prompts for recurring project work.
- Make future sessions faster and more consistent.

Update when:

- A new repeatable workflow emerges.
- A prompt no longer matches the project model.
- A prompt needs new fields or constraints.

## Architecture Documents

### Glossary

Purpose:

- Define core language.
- Reduce ambiguity as the project scales.

Update when:

- A term becomes important to the project.
- A term changes meaning.
- A theoretical term becomes an active product or editorial concept.

### Taxonomy

Purpose:

- Define the master framework, pillars, constraint tags, signal types, maturity levels, time horizons, and relationship rules.

Update when:

- A topic pillar is added, merged, or renamed.
- A new controlled vocabulary is needed.
- Existing categories become too broad or ambiguous.

### Content Model

Purpose:

- Define the MVP entities and fields used by the publication and data layer.
- Keep editorial, design, and engineering aligned.

Update when:

- Fields are added or removed.
- A new entity type is introduced.
- Sample records reveal schema problems.

### Source Strategy

Purpose:

- Define how sources are selected, evaluated, categorized, and monitored.
- Keep the project from becoming a hype amplifier or press-release mirror.

Update when:

- A new source category is added.
- Credibility criteria change.
- Capture workflows change.

### Source Monitoring Plan

Purpose:

- Define how FTFN turns source records into a generated freshness and review queue.
- Preserve the boundary between self-updating reference surfaces and automated publishing.
- Track what source-monitoring work should happen before ingestion, alerts, or database migration.

Update when:

- Source freshness rules change.
- A source-monitoring route, script, or report changes.
- Source review cadence becomes an explicit schema field.
- FTFN starts checking source URLs or source metadata through automation.

Do not use it for:

- General source credibility rules.
- Record-by-record publication decisions.
- Automated ingestion implementation details before the control layer is proven.

### Source Broadening And Intake Plan

Purpose:

- Define how FTFN can draw in many more potential sources without weakening public authority.
- Separate private source candidates from active source records.
- Identify broad discovery rails, local source templates, promotion rules, and implementation phases.

Update when:

- Candidate-registry fields change.
- New source discovery rails are added.
- Candidate-to-source promotion rules change.
- v0.2 source targets change.

Do not use it for:

- Direct publication approval.
- Treating broad catalogs as evidence for claims.
- Replacing source-specific records or the private update queue.

### Private Source-Candidate Registry

Purpose:

- Document the local-only 150-record candidate contract without exposing candidate contents.
- Define validation, backup, triage states, and candidate-to-public-source promotion gates.
- Preserve the boundary between discovery metadata and claim-supporting public evidence.

Update when:

- the private registry schema, target, profiles, or workflow states change,
- candidate validation or generated-output leak checks change,
- the project moves the private registry into an approved RLS-backed backend.

Do not use it for:

- listing private candidates in public documentation,
- treating first-pass triage as evidence verification,
- bypassing public source schemas, human review, or Git publication controls.

### Authoritative Live Source Plan

Purpose:

- Identify the official live source universe FTFN should monitor.
- Prioritize source acquisition by watch lane and authority value.
- Define the first 30 source records added in Phase 39.
- Track the Phase 40 expansion to 66 source records and 17 public topic records.
- Track the Phase 49 expansion to 102 source records and the shift from source breadth to bounded source-item selection.
- Define source metadata fields needed for live monitoring, source health reports, and future private review queues.

Update when:

- New live source categories are selected.
- The first source batches are replaced or substantially revised.
- Watch-lane fields or source health reporting become active.
- A source changes access method, API status, or monitoring cadence.

Do not use it for:

- Publication approval.
- Full source credibility doctrine.
- Automated public publishing design.

### Authority Red-Team and Resource Expansion Plan

Purpose:

- Preserve a skeptical authority audit of the current site.
- Identify where FTFN is still a credible scaffold rather than a comprehensive resource.
- Define content-first expansion priorities across sources, topics, signals, local systems, briefings, and self-updating source reports.

Update when:

- A major authority gap is resolved.
- The content library expands enough to change the assessment.
- Watch lanes, source health reporting, or local evidence dossiers become active product surfaces.
- The launch posture changes because authority blockers are cleared.

Do not use it for:

- Record-by-record publication approvals.
- Full implementation details for automation.
- Launch deployment instructions.

### Editorial Method

Purpose:

- Define how FTFN turns source material into publishable future-state intelligence.
- Preserve the rules for claim handling, evidence treatment, record status, and source transparency.

Update when:

- Publication standards change.
- A new evidence category needs special handling.
- Record status rules change.
- Public method language changes.

### Review Checklists

Purpose:

- Turn the editorial method into practical checks for signals, sources, topics, organizations, technologies, local systems, and briefings.
- Keep content review consistent across work sessions.

Update when:

- A content type gains new required fields.
- A review step proves unnecessary or missing.
- The publishing workflow changes.

### Briefing Template

Purpose:

- Define the reusable structure for FTFN briefings.
- Preserve the rules for signal selection, evidence boundaries, frontmatter, body sections, and publication status.
- Keep briefings from turning into unsupported essays or volume for its own sake.

Update when:

- A briefing format changes.
- Briefing frontmatter changes.
- The publication gate changes.
- A briefing reveals a better synthesis structure.

### Evidence Gap Register

Purpose:

- Track missing evidence that blocks stronger source, signal, briefing, or local-system conclusions.
- Convert uncertainty into future source acquisition, record creation, local profile updates, or schema candidates.
- Preserve the editorial register while structured evidence-gap records live in `app/src/content/evidence-gaps/`.

Update when:

- A briefing identifies missing evidence.
- A local system profile exposes a data gap.
- A new source resolves or partially resolves a gap.
- A structured evidence-gap record is added or changed.
- Repeated gaps suggest a future data-model field or entity.

### Dependency Map Format

Purpose:

- Define how FTFN creates qualitative dependency maps.
- Preserve the rules for nodes, links, confidence labels, interpretation boundaries, and next-record needs.
- Keep maps from becoming unsupported graph visuals or premature 42/59 scores.

Update when:

- A new map type is added.
- Node, link, or confidence vocabularies change.
- Maps move from standalone JSON records to generated views.
- A dependency map reveals a missing review rule or data-model field.

### Information Architecture

Purpose:

- Define the sitemap, navigation, page types, modules, and reader journeys.
- Keep product structure clear before implementation begins.

Update when:

- A new page type is added.
- MVP navigation changes.
- Reader journeys change.
- The product moves a section from future scope into MVP scope.

### Sample Records

Purpose:

- Test the content model, taxonomy, source strategy, and local-system model against realistic records.
- Reveal schema gaps before implementation.

Update when:

- New sample records are created.
- A record type changes.
- A sample reveals a model issue.
- Sample records are converted into real seed content.

### Content Expansion Plan

Purpose:

- Assess current seed readiness.
- Identify the next records to create or promote.
- Keep editorial growth sequenced and reviewable.

Update when:

- A content batch is completed.
- Priority topics or source areas change.
- Seed records move from sample scaffolding toward reviewed publication.

### Signals Roadmap

Purpose:

- Define high-value signal watch lanes.
- Sequence the next signal candidates after launch-critical QA.
- Preserve evidence requirements for each signal family.
- Keep signal expansion focused on dependency-stack value instead of raw volume.

Update when:

- A new watch lane is added.
- A high-priority signal candidate is created, rejected, or deferred.
- Source gaps change the signal-build sequence.
- Signal expansion priorities change after a content batch or launch review.

Do not use it for:

- Full record drafts.
- Publication approvals.
- Long source strategy rules.
- Automated ingestion design.

### Publication Readiness Triage

Purpose:

- Track which records are launch candidates, which should remain in review, which need follow-up, and which should remain draft samples.
- Keep launch-readiness decisions separate from actual `Published` promotion.
- Record small source-date checks that affect whether records are safe to show at launch.

Update when:

- A record is reviewed for launch readiness.
- A source check changes a record's readiness.
- A launch candidate set changes.
- A record moves to `Needs Update`, stays in `Draft Sample`, or is approved for a later publication gate.

Do not use it for:

- Full source strategy.
- Long record drafts.
- Final publication policy or correction policy.

### Launch Candidate Review

Purpose:

- Record the final source, copy, citation, caveat, and publish-or-hold decisions for a specific launch-candidate set.
- Preserve why a record moved to `Published` or stayed in `In Review`.
- Keep publication approval separate from broader readiness triage.

Update when:

- A launch-candidate set goes through final review.
- A record is promoted to `Published`.
- A previously published record is moved to `Needs Update` or `Archived`.
- A publication blocker is cleared or replaced by a new blocker.

Do not use it for:

- General content expansion planning.
- Full source strategy.
- Unreviewed future ideas.

### Publication Policy

Purpose:

- Define how records move from draft or review states to `Published`.
- Preserve the correction/update policy for `ftfn.io`.
- State the public source transparency rules and launch gate.
- Keep launch candidates separate from publication approval.

Update when:

- Publication states change.
- Correction or update rules change.
- Source transparency rules change.
- The public Method page changes.
- A new publication gate is added.

Do not use it for:

- Record-by-record launch triage.
- Source acquisition planning.
- Long technical implementation notes.

### Launch Package

Purpose:

- Define the first static launch package for `ftfn.io`.
- Record the hosting path, build settings, sitemap and robots policy, route checklist, and launch note outline.
- Keep deploy-readiness separate from the act of deploying.
- Point to the current v0.2 build manifest when deployment preparation needs a machine-readable configuration while preserving v0.1.1 as history.

Update when:

- Hosting or deployment assumptions change.
- Sitemap, robots, canonical, or public visibility rules change.
- A deploy preview, post-deploy check, or launch route is added.
- The launch note moves from outline to public page.

Do not use it for:

- General editorial strategy.
- Broad product-roadmap ideas.
- Source acquisition planning.

### v0.1 Session Brief

Purpose:

- Preserve the original deployment-candidate handoff as a historical Phase 40 checkpoint.
- Summarize current build status, content counts, authority posture, deployment posture, and next phase.
- Give a restart prompt for continuing from the v0.1 checkpoint.

Update when:

- A factual correction is required in the historical v0.1 checkpoint.

Do not use it for:

- Full phase history.
- Detailed source acquisition planning.
- Replacing the canonical session brief.

### v0.1 Roadmap

Purpose:

- Preserve the original shorter v0.1 execution path as a historical checkpoint.
- Separate preview deployment, authority expansion, private update queues, local evidence deepening, and public launch gates.
- Preserve what v0.1 explicitly does not include.

Update when:

- A factual correction is required in the historical v0.1 roadmap.

Do not use it for:

- Replacing the master roadmap.
- Detailed implementation work packages.
- Deployment credentials or provider-specific secrets.

### v0.1.1 Session Brief

Purpose:

- Preserve the frozen versioned handoff after the first Phase 50 content batch.
- Summarize package version, build counts, release delta, authority posture, deployment posture, and v0.2 direction.
- Give a restart prompt tied to the frozen 102-source, 18-signal v0.1.1 baseline.

Update when:

- The v0.1.1 deployment-candidate state changes.
- Build verification or preview-deployment status changes.
- A factual release count or boundary needs correction.

Do not use it for:

- Full phase history.
- Detailed source acquisition planning.
- Replacing the canonical session brief.

### v0.1.1 Roadmap

Purpose:

- Define package freeze, build verification, browser QA, preview deployment, and public launch gates for v0.1.1.
- Keep release work separate from the parallel authority-expansion track.
- Hand the current build cleanly into the v0.2 plan.

Update when:

- v0.1.1 verification or preview status changes.
- Release gates change.
- Browser QA reveals a release blocker.

Do not use it for:

- Replacing the master roadmap.
- Detailed Phase 50 content implementation.
- Approving deployment or DNS changes.

### v0.1.1 Release QA

Purpose:

- Record the exact frozen commit and artifact tested for `v0.1.1`.
- Preserve desktop, mobile, route, canonical, robots, sitemap, and publication-state indexing results.
- Separate passed local QA from preview deployment and public-launch approval.

Update when:

- A frozen-release QA result needs factual correction.
- Approved preview deployment adds post-deploy evidence.
- A release blocker is discovered against the exact `v0.1.1` artifact.

Do not use it for:

- Current v0.2 implementation status.
- Approving hosting, DNS, analytics, or public launch.
- Replacing Phase 54 v0.2 release QA.

### v0.2 Roadmap

Purpose:

- Scope v0.2 as the first authority-loop release.
- Define the v0.2 build plan after v0.1.1: completed bounded evidence conversion, local evidence dossiers, public trust and data surfaces, publication review, and release QA.
- Preserve the boundary between human-reviewed update workflow and automated publishing.

Update when:

- v0.2 workstreams change.
- Source, signal, or local evidence targets change materially.
- v0.2 moves from scope to active implementation.

Do not use it for:

- Replacing the master roadmap.
- Public launch approval.
- Provider-specific deployment secrets.

### v0.2 Release QA

Purpose:

- Record the Phase 54 automated, source-currentness, desktop/mobile, accessibility, indexing, update-log, and export evidence.
- Distinguish passed local QA from deferred preview/post-deploy verification.
- Preserve the exact defect repaired during the release pass.

Update when:

- the verified v0.2 artifact changes,
- a release assertion fails or is expanded,
- approved preview deployment adds post-deploy evidence.

Do not use it for:

- authorizing preview deployment,
- approving DNS or public launch,
- claiming a complete WCAG or assistive-technology audit.

### v0.2 Launch Note

Purpose:

- Provide the concise public-facing explanation of the first authority-loop candidate.
- State the current Published set, product value, evidence posture, and limitations without overstating readiness.

Update when:

- the Published set or public feature list changes,
- preview QA exposes a material limitation,
- the user approves a final public release message.

Do not use it for:

- recording internal QA evidence,
- approving a release,
- promising live automation, API uptime, or local readiness.

### Signal Scale Scenarios

Purpose:

- Map what the signal library should look like at 25 to 35 signals and at 70 signals.
- Define candidate mixes, topic distribution, watch-lane distribution, status mix, and product implications.
- Keep signal growth tied to authority and editorial operations rather than content volume alone.

Update when:

- Signal-count targets change.
- Candidate-promotion rules change.
- Topic or watch-lane coverage targets change.
- The project moves beyond the 70-signal scenario.

Do not use it for:

- Individual signal publication approval.
- Live source verification.
- Replacing the v0.2 roadmap.

### Private Update Queue

Purpose:

- Track private source-review candidates before signal creation.
- Preserve the human next action for source checks, manual portal review, local record selection, and signal repair.
- Keep source-change operations separate from automated public publishing.

Update when:

- New source-review candidates are added.
- Queue statuses change.
- A queue item becomes a repaired signal, local dossier record, blocked item, or archived item.

Do not use it for:

- Public publication approval.
- Automated ingestion output.
- Long-form analysis that belongs in a signal or local system profile.

### Signal Repair Workflow

Purpose:

- Define how broad `In Review` records become dated, source-backed signals.
- Preserve repair states, evidence selection rules, metadata gates, and publication-candidate rules.
- Prevent source frames from being promoted as current intelligence.

Update when:

- Signal statuses or metadata rules change.
- Publication candidate rules change.
- The repair workflow becomes app-supported.

Do not use it for:

- Choosing sources.
- Replacing publication review.
- Replacing source-specific evidence notes.

### v0.2 Next Signal Set

Purpose:

- Map the first signal repairs and additions for v0.2 and the remaining 6-to-12-record path after Phase 50B.
- Show which source paths and topic gaps each candidate supports.
- Keep the next signal batch tied to the private update queue.

Update when:

- Candidate priorities change.
- Evidence is selected for a candidate.
- Signal records are created, repaired, archived, or promoted.

Do not use it for:

- Final publication approval.
- Live source verification.
- Volume targets without source support.

### Phase 48 Work Package

Purpose:

- Record the first v0.2 signal repair batch.
- Track which private-queue items became repaired or new signal records.
- Preserve source-check caveats and validation results for the first authority-loop content update.

Update when:

- The first repair batch receives follow-up source checks.
- A CISA KEV entry, Federal Register action, Regulations.gov docket, or local dossier record is selected for publication-candidate review.
- The next local dossier signal is created.

Do not use it for:

- Public launch approval.
- Automated ingestion design.
- Replacing the private update queue or signal repair workflow.

### Phase 49 Work Package

Purpose:

- Record the 36-source promotion batch that expanded the active source library from 66 to 102 records.
- Preserve which source groups were added and why they matter for v0.2 authority breadth.
- Track validation results and the boundary that broad catalogs are discovery rails, not direct claim evidence.

Update when:

- A promoted source is corrected, downgraded, paused, blocked, or split into a more specific source record.
- Batch 02 queue items become signals, local dossier inputs, evidence-gap updates, or archived queue items.
- Another broad source-promotion batch is planned or completed.

Do not use it for:

- Public launch approval.
- Automated ingestion design.
- Replacing the private source-candidate registry.
- Treating broad source records as bounded signal evidence.

### Phase 50 Work Package

Purpose:

- Record the completed six-item bounded source conversion batch.
- Preserve which selected official records became `In Review` signals.
- Track evidence boundaries for the DOE/Grants.gov, MAG, USAspending, NSF, USGS gallium, and Toronto application signals.
- Preserve validation, source health, check, and build results for the content batch.

Update when:

- More Phase 50 source items become signals or local dossier inputs.
- DOE selections, USAspending records, MAG dataset metadata, or local dossier evidence changes.
- A Phase 50 record becomes a publication candidate, is archived, or needs repair.

Do not use it for:

- Public launch approval.
- Automated ingestion design.
- Treating funding opportunities as awards.
- Treating regional projections as local readiness proof.

### Phase 51A Work Package

Purpose:

- Record the first named utility, provider-water, and application-servicing batch.
- Preserve the claim boundaries for SRP system planning, Phoenix provider planning, and Toronto application-stage review.
- Track the four strengthened local evidence gaps and the remaining project-service and delivery questions.

Update when:

- a selected record is corrected or superseded,
- later utility, water, Council, by-law, permit, start, completion, or occupancy evidence is added,
- a Phase 51 signal enters publication review.

Do not use it for:

- treating system planning as a customer service commitment,
- treating a staff recommendation as final approval,
- treating servicing review as a building permit or completed delivery.

### Phase 51B Work Package

Purpose:

- Record the large-load service, industrial wastewater, Phoenix planning, workforce, Toronto committee, and delivery-baseline batch.
- Preserve the claim boundaries between tariffs and customer service, agreements and completed infrastructure, planning and permits, cohorts and workforce sufficiency, committee recommendations and enacted by-laws, and pipeline potential and completed housing.
- Track the six selected official records, five strengthened evidence gaps, and next downstream gates.

Update when:

- an E-67 revision or named electric-service record is selected,
- TSMC wastewater or industrial reclaimed-water infrastructure reaches a construction or operating milestone,
- named Phoenix permits, inspections, or certificates of occupancy are added,
- apprenticeship outcome data becomes available,
- Toronto application 24 254930 reaches City Council, by-law, permit, start, completion, or occupancy.

Do not use it for:

- treating tariff applicability as proof of available site capacity,
- treating agreement authorization as completed infrastructure or long-term water sufficiency,
- treating a PUD as a building permit,
- treating a planned apprenticeship cohort as workforce sufficiency,
- treating a committee recommendation or citywide pipeline as completed housing.

### Phase 51C Work Package

Purpose:

- Record the named Meta electric-service project, current TSMC fab milestones, and active apprenticeship-cohort evidence.
- Preserve the boundaries between one customer project and corridor capacity, City-relayed company claims and audited operations, and active cohorts and completed workforce outcomes.
- Track the deliberate no-add decisions for reclaimed-water operation, Phoenix occupancy, apprenticeship completion, and Toronto enactment.

Update when:

- Project Huckleberry load, commercial, or operating records change,
- a TSMC-specific power, permit, occupancy, production, water, or workforce record is added,
- apprenticeship completion, credential, retention, or placement evidence becomes available,
- Toronto application 24 254930 reaches City Council, by-law, permit, start, completion, or occupancy.

Do not use it for:

- transferring Meta service evidence to TSMC or the broader corridor,
- treating a City economic-development release as audited production evidence,
- treating active cohorts as completed outcomes,
- claiming an unresolved downstream gate was completed because no new record was found.

### Phase 53 Work Package

Purpose:

- Record the full-library publication review and the six records promoted on 2026-07-22.
- Preserve the evidence boundary attached to every promotion and hold.
- Track the nine-record Published mix, current primary-source checks, public update entry, export membership, and indexing results.

Update when:

- a Published source changes materially,
- a documented hold clears or becomes stale,
- a record moves to `Needs Update` or `Archived`,
- Phase 54 finds a publication, export, robots, sitemap, canonical, accessibility, or browser issue.

Do not use it for:

- treating a count target as publication approval,
- promoting company claims or unresolved local outcomes,
- replacing the publication policy or correction path,
- authorizing preview deployment, DNS, or public launch.

### Phase 54 Work Package

Purpose:

- Record the complete v0.2 local release gate and the preview-decision boundary.
- Preserve the current-source audit, 44-pixel header repair, browser matrix, reproducible assertions, manifest, and documentation outputs.
- Make the next step an explicit private-preview decision rather than an implied deployment.

Update when:

- a local release assertion changes,
- approved preview deployment adds post-deploy results,
- a blocker is found against the exact v0.2 candidate.

Do not use it for:

- authorizing hosting, DNS, or public launch,
- replacing the release QA evidence,
- expanding the content scope after the release gate.

### Phase 52B Work Package

Purpose:

- Record the completed 150-source private candidate shelf and its validation/privacy boundary.
- Record Source Monitor review-state/next-action improvements and Source Coverage strength summaries.
- Preserve the fact that public source, signal, and page counts did not change.

Update when:

- a factual correction is required in the Phase 52B result,
- the registry is migrated into an approved private backend,
- a later verification changes the recorded privacy or candidate-link status.

Do not use it for:

- publishing candidate names or URLs,
- authorizing automatic candidate promotion,
- replacing the ongoing private registry workflow.

### Phase 55A Work Package

Purpose:

- Record the local Phase 52B checkpoint and the first post-checkpoint authority refresh.
- Summarize the bounded 15-record private triage batch without exposing candidate contents.
- Record the three active-source rechecks, resulting coverage/monitor state, verification evidence, and non-public stop point.

Update when:

- a factual correction is required in the Phase 55A result,
- the identified Toronto, Arizona, post-quantum, or overdue-source follow-up is completed,
- an external Phase 55 action is separately approved and recorded in its own work package.

Do not use it for:

- publishing private candidate names or registry contents,
- authorizing a push, preview deployment, DNS change, or public launch,
- treating coverage strength as proof that every source is current.

### Phase 55B Work Package

Purpose:

- Record the bounded federal post-quantum migration and Project Baccara evidence additions.
- Preserve the Toronto, Ontario, and ACC monitoring-rail rechecks and their evidence limits.
- Record the 117-source, 35-signal, 215-page verification state and non-public stop point.

Update when:

- a factual correction is required in the Phase 55B result,
- a public agency PQC plan, Project Baccara downstream permit, or Toronto Council/by-law/permit record advances a named trail,
- an external Phase 55 action is separately approved and recorded.

Do not use it for:

- treating mandates as completed implementation,
- treating a certificate as constructed or operational capacity,
- treating a negative portal query as proof that no permit exists,
- authorizing a push, preview deployment, DNS change, or public launch.

### v0.1 Build Manifest

Purpose:

- Preserve the historical machine-readable Phase 40 build and deployment-prep manifest at `deployment/ftfn-v0.1-build.json`.
- Capture app root, build command, output directory, expected counts, launch-critical routes, release gates, and out-of-scope items.
- Make preview deployment setup less ambiguous.

Update when:

- A factual correction is required in the historical manifest.

Do not use it for:

- Storing secrets.
- Approving DNS attachment.
- Replacing browser QA or launch review.

### v0.1.1 Build Manifest

Purpose:

- Provide the current machine-readable build and deployment-prep manifest at `deployment/ftfn-v0.1.1-build.json`.
- Capture app version 0.1.1, current content counts, release delta, required outputs, launch-critical routes, release gates, and deployment boundaries.
- Make preview configuration verifiable against the 182-page build.

Update when:

- v0.1.1 build verification changes.
- Required outputs, route checks, or deployment assumptions change.
- v0.1.1 moves from preview candidate to preview deployed.

Do not use it for:

- Storing secrets.
- Approving deployment or DNS attachment.
- Replacing browser QA or launch review.

### Phase 55C Work Package

Purpose:

- Record the Project Baccara county-condition, proposed-air-permit, and vote-corroboration follow-through.
- Preserve the distinction between a reported vote, an official agenda, a proposed permit, and executed or completed outcomes.
- Record the 120-source, 35-signal, 218-page verification state and non-public stop point.

Update when:

- a factual correction is required in the Phase 55C result,
- the executed MCP, final air permit, service/POD, military, construction, occupancy, or operating record advances the trail,
- an external Phase 55 action is separately approved and recorded.

Do not use it for:

- treating the County agenda as fully executed minutes,
- treating the proposed air permit as issued or operational approval,
- treating a permit stage as construction, occupancy, or operation,
- authorizing a push, preview deployment, DNS change, or public launch.

### Phase 55D Owner-Only Sites Preview

Purpose:

- Record the owner-only Sites provider URL, source checkpoint, packaging adapter, access boundary, and hosted verification evidence.
- Separate a successful private preview from public access, `ftfn.io` attachment, Hostinger DNS changes, and release freeze.
- Preserve the Google Workspace DNS guardrail for any later domain work.

Update when:

- the Sites deployment version or access policy changes,
- a custom domain is approved or attached,
- hosted verification needs to be repeated after an application change.

Do not use it for:

- Publishing private credentials or bypass tokens.
- Treating owner-only hosting as public launch approval.
- Authorizing Hostinger DNS changes or a package-version freeze.

### Phase 55E Bounded Content Expansion

Purpose:

- Record the 17-source freshness recheck, 15-record private triage batch, eight dated signal updates, and current build counts.
- Preserve the evidence limits that keep every new or changed record in `In Review`.
- Separate content expansion and an owner-only preview refresh from public access, DNS, or package freeze.

Update when:

- a factual correction is required in the Phase 55E result,
- Phase 55F changes the publication status of one of the eight reviewed records,
- the owner-only Sites version is refreshed or its hosted verification result changes.

Do not use it for:

- Treating an award, prize, hardware milestone, permit, or company claim as a deployment outcome.
- Authorizing a Published promotion without a separate publication review.
- Authorizing public access, custom-domain attachment, or Hostinger DNS changes.

### Phase 55F Publication-Readiness Review

Purpose:

- Record the publish-or-hold decision for all eight Phase 55E records.
- Preserve the evidence boundary on seven promotions and the independent-confirmation blocker on the held Joby record.
- Record the resulting Published export, sitemap, update-log, source-currency, and owner-only preview checks.

Update when:

- a material factual correction changes one of the eight decisions,
- a held source gains independent confirmation,
- a promoted record moves to `Needs Update` or `Archived`,
- the exact owner-only deployment checkpoint or hosted QA result changes.

Do not use it for:

- Treating publication as proof of a later conversion stage.
- Approving another record without a new publication review.
- Authorizing public access, custom-domain attachment, package freeze, or Hostinger DNS changes.

### Phase 55G Project Baccara Authority Conversion

Purpose:

- Record the official 4-1 Maricopa County action and active final MCAQD Permit `P0013417`.
- Preserve the distinction between approval/permit issuance and executed conditions, construction, testing, occupancy, or operation.
- Record the exact owner-only Sites version 5 deployment and unchanged access/DNS boundary.

Update when:

- a fully executed `MCP250007` record becomes available,
- condition compliance, service, military, construction, testing, occupancy, or operation advances,
- a material factual correction changes the County action or final-permit record,
- the exact owner-only deployment checkpoint or hosted verification changes.

Do not use it for:

- Treating County approval or an active air permit as project completion or operating performance.
- Authorizing a Published promotion without a separate publication review.
- Authorizing public access, custom-domain attachment, package freeze, or Hostinger DNS changes.

### Phase 55H Toronto Pre-Decision Authority Gate

Purpose:

- Record Toronto application `24 254930`'s dated July 29-31 Council gate.
- Preserve the wind-study, land-exchange, and laneway conditions that precede amendment enactment.
- Record bounded negative Building Permit searches across all eight project addresses without treating absence as proof.
- Record the exact owner-only Sites version 6 deployment and unchanged access/DNS boundary.

Update when:

- City Council publishes its disposition or vote,
- recommendations, bills, or enacted by-law numbers become available,
- a wind, land-exchange, laneway, or permit condition advances,
- a confirmed Building Permit application number, start, completion, or occupancy record becomes available,
- the exact owner-only deployment checkpoint or hosted verification changes.

Do not use it for:

- Treating a scheduled meeting or negative address search as a final outcome.
- Treating Council adoption as enacted amendments or project delivery.
- Authorizing public access, custom-domain attachment, package freeze, or Hostinger DNS changes.

### Phase 55I Remaining-Candidate Review And Content Expansion

Purpose:

- Record the completed first-pass triage of all 150 local-only candidates without exposing candidate IDs or private notes.
- Document the ten converted monitoring rails, 12 dated public source records, nine new `In Review` signals, and local-system evidence repairs.
- Record the exact owner-only Sites version 7 deployment and unchanged access/DNS boundary.
- Preserve the separate publication-review, owner-only access, DNS, and package-freeze gates.

Update when:

- a Phase 55I signal passes or fails a separate publication-readiness review,
- one of the new monitoring rails produces a dated gap-closing record,
- candidate status counts or public-source mappings materially change,
- the exact owner-only deployment checkpoint or hosted verification changes.

Do not use it for:

- Publishing the private candidate registry or candidate-level notes.
- Treating source selection as proof of the claims found through that source.
- Authorizing a Published promotion, public access, custom-domain attachment, package freeze, or Hostinger DNS changes.

### Phase 55J Publication-Readiness Review

Purpose:

- Record the independent publication decision for all nine Phase 55I signals.
- Preserve the OMB M-26-04 current-policy repair and the evidence boundary for each promoted record.
- Record the resulting 25-Published / 20-In-Review release contract.
- Preserve owner-only access, DNS, public-GitHub, and package-freeze boundaries.

Update when:

- a promoted source is amended, rescinded, corrected, or superseded,
- a material claim or evidence boundary changes,
- a later implementation, adoption, facility, connection, or outcome record advances one of the open conversion stages,
- the exact owner-only deployment checkpoint or hosted verification changes.

Do not use it for:

- Treating publication as proof of implementation or outcomes.
- Publishing private candidate material.
- Authorizing public access, custom-domain attachment, package freeze, public GitHub synchronization, or Hostinger DNS changes.

### Phase 55K DARPA And U.S. Government Research Collection

Purpose:

- Record the 23-document research collection, source captures, per-document summaries, and evidence limits.
- Document the Research routes, cross-site integration, five `In Review` synthesis signals, briefing, dependency map, organization records, and topic/technology source updates.
- Record the reproducible 26-file archive with 22 local captures, one official-link record, consolidated summaries, README, and checksum manifest.
- Define Phase 55L as an implementation-evidence conversion pass while preserving the separate publication gate.

Update when:

- an official source is amended, superseded, moved, or becomes unavailable,
- the link-only Defense Department record can be replaced with a clean official capture,
- a research direction gains a named award, contract, facility, field trial, production milestone, transmission action, or standards artifact,
- collection membership, capture status, summaries, archive contents, or owner-only deployment state changes.

Do not use it for:

- Treating a strategy, budget request, or solicitation as proof of appropriations, awards, delivery, production, or operating outcomes.
- Promoting the five synthesis signals without a separate publication review.
- Authorizing public access, DNS changes, package freeze, public GitHub synchronization, or public launch.

### Phase 55L Implementation-Evidence Conversion

Purpose:

- Record the eight named implementation trails selected from the Phase 55K research agenda.
- Preserve the evidence-stage boundaries across awards, obligations, agreements, scheduled trials, delivered material, transmission finance, and standards artifacts.
- Document seven new source profiles, seven new `In Review` signals, the repaired USAspending signal, Stack Watch 003, the expanded dependency map, and cross-site topic, organization, technology, and evidence-gap integration.
- Record the reproducible 11-file archive with five local captures, three official-link records, consolidated summaries, README, and a SHA-256 manifest.
- Preserve exact owner-only Sites version 10 provenance and define the Phase 55M review gate.

Update when:

- an award, obligation, outlay, loan, agreement, or capacity contract changes,
- a named facility, trial, reactor, prototype, or testbed crosses a later evidence stage,
- DARPA publishes Lift Challenge results after August 9, 2026,
- a blocked official-link record can be replaced with a clean official capture,
- publication state, archive contents, source provenance, or deployment state changes.

Do not use it for:

- Treating instrument value as obligation or spending.
- Treating a scheduled trial as a result.
- Treating delivered fuel as an operating reactor.
- Treating standards contributions as a completed 6G network.
- Authorizing public access, DNS changes, package freeze, public GitHub synchronization, or public launch.

### v0.2 Build Manifest

Purpose:

- Provide the machine-readable contract for the locally verified v0.2 candidate at `deployment/ftfn-v0.2-build.json`.
- Capture the 380-page build, 38 Published signals, 189 sources, 16 updates, 47 research documents, three required archives, three exports, route samples, release assertions, browser evidence, and deployment boundaries.
- Capture the 150-record local-only authority layer and its generated-output exclusion gate without including private candidate content.
- Drive `npm run verify:release` while keeping local and hosted verification states distinct.

Update when:

- the exact v0.2 candidate changes,
- required outputs, counts, route checks, or release assertions change,
- the owner-only preview or later production deployment changes verification state.

Do not use it for:

- Storing secrets.
- Approving public access, DNS attachment, or public launch.
- Replacing the human release decision.

### Technical Stack Decision

Purpose:

- Record the chosen MVP stack and why it fits FTFN.
- Preserve tradeoffs and future migration logic.

Update when:

- The stack decision changes.
- A major dependency is added.
- The project moves from static content to CMS, database, or ingestion workflows.

### Content Scaffold Plan

Purpose:

- Define how content records should be stored before implementation.
- Keep content files, schemas, validation, and public/internal fields aligned.

Update when:

- A new collection is added.
- A storage format changes.
- Validation rules change.
- Sample records are converted into seed files.
- The content reference validation gate changes.

## Work Packages

Work packages translate the roadmap into executable chunks.

Each work package should include:

- objective,
- deliverables,
- checklist,
- acceptance criteria,
- open questions,
- dependencies,
- completion notes.

Create a new work package when:

- a roadmap phase becomes active,
- a task is large enough to need acceptance criteria,
- multiple future sessions will contribute to the same effort.

## Documentation Hygiene

Use these rules when updating docs:

- Keep strategy in the roadmap.
- Keep definitions in the glossary.
- Keep controlled vocabularies in the taxonomy.
- Keep fields and examples in the content model.
- Keep speculative ideas in future considerations.
- Keep reusable instructions in the prompt library.
- Keep durable choices in the decision log.
- Run `npm run validate:content` before broad content expansion or after changing relationship fields.

When in doubt, add a short note to the decision log and link the deeper document.

## Backend And Public Data Contracts

### Public Data Exports

Purpose:

- Define the versioned public JSON contract for sources, topics, and Published signals.
- Record the field allowlist, private-field exclusions, cadence, and versioning rule.

Update when:

- An exported field or dataset changes.
- Signal export scope changes.
- Supabase becomes the public data source.

### Supabase Activation Plan

Purpose:

- Define the minimum activation gate and first private backend slice.
- Keep Auth, RLS, secrets, review workflow, and publication boundaries explicit.

Update when:

- The development project is created.
- The first migration changes.
- Public content starts reading from Supabase.

### Phase 55N Implementation Outcomes And Local Conversion

Purpose:

- Record the 16-document implementation-outcomes and local-conversion collection.
- Document the six new source and signal records, two briefings, four organizations, and cross-site integrations.
- Preserve evidence boundaries for governance discontinuities, oversight findings, versioned software, construction milestones, procurement channels, and preliminary standards.
- Inventory the 19-file downloadable archive and its checksum.
- Define the combined Phase 55M publication-readiness gate and preserve the dated Phase 55H Toronto recheck.

Primary file:

- `docs/work-packages/phase-55n-implementation-outcomes-local-conversion.md`

Update when:

- the owner-only deployment version or exact commit changes,
- any Phase 55N signal passes or fails publication review,
- recipient-level NSTC or NAPMP status changes,
- a Phoenix facility crosses occupancy, qualification, or production,
- a PIV working draft becomes a formal or final standard,
- the Toronto Council record advances after July 31.

Boundary:

A later program action does not automatically cancel every earlier award. A department-wide oversight gap is not evidence that a named prototype failed. A versioned tool, topped-out building, purchasing channel, or preliminary draft is not an operational outcome.

### Phase 55M Publication-Readiness Review

Purpose:

- Record the separate publication decision for each of the fourteen Phase 55L and Phase 55N implementation signals.
- Document thirteen promotions and the DARPA Lift Challenge scheduled-trial hold.
- Preserve the NAPMP / NSTC chronology without inferring recipient-level cancellation or continuity.
- Record the 38 Published / 25 In Review release contract and 66-source Published support set.
- Keep the correction triggers, dated Toronto recheck, post-August 9 DARPA recheck, and owner-only boundary explicit.

Primary file:

- `docs/work-packages/phase-55m-publication-readiness-review.md`

Update when:

- a reviewed record receives materially different official evidence,
- the DARPA Lift Challenge publishes results,
- NAPMP or NSTC recipient-level disposition becomes available,
- a promoted record crosses into construction, acceptance, adoption, operation, or scale,
- the exact Phase 55M deployment commit or Sites version changes.

Boundary:

Publication confirms a useful bounded claim, not completion of the implementation ladder. Public access, package freeze, custom-domain attachment, DNS changes, public GitHub synchronization, and public launch remain separate decisions.
