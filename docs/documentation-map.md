# Documentation Map

This map explains how the FTFN documentation system fits together, when each document should be updated, and how future work sessions should use it.

The goal is simple: keep a very broad project legible as it grows.

## Read Order for Future Work Sessions

Start each substantial work session in this order:

1. [README](../README.md)
2. [Session Brief](session-brief.md)
3. [Master Roadmap](master-roadmap.md)
4. [Decision Log](decision-log.md)
5. [Taxonomy](taxonomy.md)
6. [Content Model](content-model.md)
7. [Source Strategy](source-strategy.md)
8. [Source Monitoring Plan](source-monitoring-plan.md)
9. [Source Broadening And Intake Plan](source-broadening-and-intake-plan.md)
10. [Authoritative Live Source Plan](authoritative-live-source-plan.md)
11. [Authority Red-Team and Resource Expansion Plan](authority-red-team-and-resource-expansion-plan.md)
12. [Editorial Method](editorial-method.md)
13. [Review Checklists](review-checklists.md)
14. [Briefing Template](briefing-template.md)
15. [Evidence Gap Register](evidence-gap-register.md)
16. [Dependency Map Format](dependency-map-format.md)
17. [Information Architecture](information-architecture.md)
18. [Sample Records](sample-records.md)
19. [Content Expansion Plan](content-expansion-plan.md)
20. [Signals Roadmap](signals-roadmap.md)
21. [Publication Readiness Triage](publication-readiness-triage.md)
22. [Launch Candidate Review](launch-candidate-review.md)
23. [Publication Policy](publication-policy.md)
24. [Launch Package](launch-package.md)
25. [Technical Stack Decision](technical-stack-decision.md)
26. [Content Scaffold Plan](content-scaffold-plan.md)
27. The current work package in [work-packages](work-packages/)

Use [Future Considerations](future-considerations.md) when the work touches theory, long-range ideas, or possible future features.

Use [Prompt Library](prompt-library.md) when starting a repeated workflow such as source research, signal writing, data modeling, local system analysis, or roadmap updates.

## Core Documents

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
- Point to the current v0.1.1 build manifest when deployment preparation needs a machine-readable configuration.

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
