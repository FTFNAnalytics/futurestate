# Phase 20 Work Package: Evidence-Gap Linking and Claim-Scope Metadata

## Goal

Promote evidence-gap and claim-scope metadata into the MVP content schema so FTFN can track what a record is claiming, what local evidence supports it, and which unresolved gaps still limit interpretation.

This phase is metadata and review infrastructure, not content expansion.

## Source Of Truth

Read before continuing:

- `README.md`
- `docs/session-brief.md`
- `docs/master-roadmap.md`
- `docs/evidence-gap-register.md`
- `docs/content-model.md`
- `docs/review-checklists.md`
- `docs/work-packages/phase-19-local-evidence-integration-and-gap-driven-signal-repair.md`
- `app/src/content.config.ts`
- `app/src/pages/signals/[slug].astro`
- `app/src/pages/atlas/local-systems/[slug].astro`
- `app/src/pages/briefings/[slug].astro`

## Scope

1. Decide whether evidence-gap links and claim-scope metadata should become schema fields.
2. Add fields only if they improve editorial control and reader clarity.
3. Update selected records where Phase 17-19 work already identified active evidence gaps.
4. Add lightweight UI display for signal, local system, and briefing detail pages.
5. Update content model, review checklists, roadmap, decision log, and session brief.
6. Do not add a database, ingestion, automation, or dependencies.
7. Do not promote any records to `Published`.

## Schema Decision

Phase 20 adds these fields to signals, local systems, and briefings:

- `evidence_gap_ids`
- `local_evidence_level`
- `last_reviewed_date`

Signals and briefings also receive:

- `claim_scope`

These fields are defaulted so existing records still validate, but they can now be used intentionally where evidence limits matter.

## Controlled Values

Claim scope:

```text
General Context
Specific Source Update
System-Level Pattern
Local Constraint Map
Project-Level Claim
Speculative Scenario
Editorial Synthesis
```

Local evidence level:

```text
None
General Source Layer
Local Source Layer
Specific Local Record
Project-Level Evidence
```

## Records Updated

Signals:

- `signal-arizona-electricity-profile-chip-corridor-power-constraint`
- `signal-arizona-water-resources-chip-corridor-constraint-map`
- `signal-ontario-housing-supply-progress-local-capacity-signal`
- `signal-statcan-building-permits-construction-intentions-signal`

Local systems:

- `local-ontario-real-estate`
- `local-us-southwest-chip-corridor`

Briefings:

- `briefing-stack-watch-001`

## UI Updates

Signal detail pages now show:

- claim scope,
- local evidence level,
- evidence gap IDs,
- last reviewed date.

Local system detail pages now show:

- local evidence level,
- last reviewed date,
- evidence gap IDs.

Briefing detail pages now show:

- claim scope,
- local evidence level,
- evidence gap IDs,
- last reviewed date.

## Decisions

- Evidence gaps should become first-class schema links before they become a public data product.
- Claim scope should be visible because it helps prevent readers from treating a constraint map as a project-level claim.
- Local evidence level should be visible because local-system analysis is central to FTFN's thesis and easy to overstate.
- `last_reviewed_date` should be available for reviewed records even before records are `Published`.
- Source-specific fields such as `source_scope`, `jurisdiction`, and `data_granularity` remain future candidates.

## Acceptance Criteria

- Phase 20 work package exists.
- Schema supports evidence-gap and claim-scope metadata.
- Selected records use the new fields.
- Signal, local system, and briefing detail pages display the fields without clutter.
- Content model and review checklists document the fields.
- No records are promoted to `Published`.
- `npm run check` passes.
- `npm run build` passes.
- The roadmap identifies the next phase.

## Validation Results

```text
npm run check: 0 errors, 0 warnings, 0 hints
npm run build: 67 pages generated
```

## Next Phase Candidate

Phase 21 should decide whether the evidence gap register should remain a Markdown control document or become a structured content collection.

Recommended focus:

- evaluate an `evidence-gaps` content collection,
- seed records for `gap-001` through `gap-010`,
- validate references from signals, local systems, and briefings,
- add a simple internal-facing or prelaunch evidence-gap index only if it clarifies the research queue.
