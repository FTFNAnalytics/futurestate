# Phase 11 Work Package: Editorial State Visibility and Citation UI

## Objective

Make editorial state, verification, evidence quality, and source context visible enough that readers can distinguish `Draft Sample`, `In Review`, and future `Published` records.

Phase 11 is a product-trust phase. It does not promote records. It makes the current editorial state legible so the prelaunch site can show work-in-progress records without pretending they are finished journalism.

## Inputs

- [README](../../README.md)
- [Documentation Map](../documentation-map.md)
- [Master Roadmap](../master-roadmap.md)
- [Decision Log](../decision-log.md)
- [Taxonomy](../taxonomy.md)
- [Content Model](../content-model.md)
- [Source Strategy](../source-strategy.md)
- [Editorial Method](../editorial-method.md)
- [Review Checklists](../review-checklists.md)
- [Content Expansion Plan](../content-expansion-plan.md)
- [Phase 10 Work Package](phase-10-first-reviewed-content-batch.md)
- `app/src/content.config.ts`
- `app/src/pages/signals/index.astro`
- `app/src/pages/signals/[slug].astro`
- `app/src/pages/atlas/sources/[id].astro`
- `app/src/components/ui/MetaPill.astro`
- `app/src/styles/global.css`

## Display Policy

Prelaunch records remain visible.

- `Draft Sample` records stay visible in indexes so the scaffold can be reviewed end to end.
- `Draft Sample` cards are visually de-emphasized with a dashed treatment.
- `In Review` records stay visible and receive a stronger status treatment.
- `Published` remains reserved for future records that pass the publication standard.
- No record is promoted to `Published` in this phase.

This is a prelaunch policy. Before public launch, FTFN should revisit whether draft samples should remain visible to general readers.

## Implementation Summary

Added:

- editorial status pills on signal index cards,
- verification status pills on signal index cards,
- status filter on the signal index,
- evidence quality on signal index cards,
- editorial status pill on signal detail pages,
- verification status pill on signal detail pages,
- a signal detail status panel for record status, verification, and source check dates,
- source cards with `last_checked_date`, source type, credibility level, and capture priority,
- related-signal status and verification pills on source detail pages,
- shared status helper functions in `app/src/lib/editorial.ts`,
- MetaPill tones for `review`, `draft`, and future `published` states.

## What Was Not Done

- No records were marked `Published`.
- No dependencies were added.
- No automation or ingestion was started.
- No content schema fields were changed.
- Draft sample records were not hidden from public indexes.

## Acceptance Criteria

- [x] Phase 11 work package exists.
- [x] Signal index shows editorial state clearly.
- [x] Signal detail pages show record status, verification status, evidence quality, and source context.
- [x] Source checked dates are visible where useful.
- [x] `Draft Sample` and `In Review` display policy is documented.
- [x] No records are incorrectly promoted to `Published`.
- [x] `npm run check` passes.
- [x] `npm run build` passes.
- [x] Roadmap identifies the next phase.

## Validation Results

```text
npm run check: 0 errors, 0 warnings, 0 hints
npm run build: 41 pages generated
```

## Preview Results

Checked in the in-app browser:

- `/signals/`
- `/signals/noaa-enso-discussion-el-nino-watch-climate-risk-clock/`
- the reviewed signal detail page at a narrow mobile viewport

Observed:

- status filter appears on the signal index,
- `In Review`, `Draft Sample`, and `Reviewed` states appear where expected,
- signal detail pages show record status, verification, source check date, evidence quality, source type, and credibility level,
- mobile detail view retains status and source date content.

Preview artifacts:

```text
docs/artifacts/phase-11-signals-index.png
docs/artifacts/phase-11-signal-detail.png
```

## Recommended Next Phase

Phase 12 should deepen the source base now that editorial state is visible. The next content work should add source records that support local-system interpretation, energy/grid context, water constraints, and the next reviewed signals.

Suggested title:

```text
Phase 12: Source Expansion and Local Evidence Foundations
```

## Open Questions

- Should `Draft Sample` records be hidden from public indexes at launch?
- Should `In Review` records remain visible to all readers or only during prelaunch?
- Should source checked dates become part of a formal citation block?
- Should the project add a dedicated Method or Source Transparency page separate from About?
