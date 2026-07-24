# Phase 14 Work Package: Atlas Topic Coverage and Local Relationship Backlinks

## Objective

Improve Atlas coverage and relationship coherence now that FTFN has stronger source-backed local system profiles.

Phase 14 makes the Atlas more useful as a reference layer. It adds missing topic records, adds official organization records only where source-backed, and exposes source-to-local-system relationships without inventing unsupported links.

## Inputs

- [README](../../README.md)
- [Session Brief](../session-brief.md)
- [Documentation Map](../documentation-map.md)
- [Master Roadmap](../master-roadmap.md)
- [Decision Log](../decision-log.md)
- [Taxonomy](../taxonomy.md)
- [Content Model](../content-model.md)
- [Source Strategy](../source-strategy.md)
- [Editorial Method](../editorial-method.md)
- [Review Checklists](../review-checklists.md)
- [Content Expansion Plan](../content-expansion-plan.md)
- [Phase 13 Work Package](phase-13-local-system-profile-hardening-and-constraint-notes.md)
- `app/src/content.config.ts`
- `app/src/content/sources/`
- `app/src/content/topics/`
- `app/src/content/organizations/`
- `app/src/content/local-systems/`
- `app/src/pages/atlas/sources/[id].astro`
- `app/src/pages/atlas/topics/[slug].astro`

## Confirmed Starting Point

Latest completed phase:

```text
Phase 13: Local System Profile Hardening and Constraint Notes
```

Next phase:

```text
Phase 14: Atlas Topic Coverage and Local Relationship Backlinks
```

Intended scope:

- add missing priority topic records,
- add useful official organization records backed by existing source IDs,
- add deterministic source-to-local-system backlinks,
- improve topic pages only where relationships can be derived from existing fields,
- avoid broad content expansion, automation, dependencies, or publication promotion.

## Topic Records Added

Added five topic records:

- `topic-energy`
- `topic-water`
- `topic-policy-and-standards`
- `topic-finance-and-risk`
- `topic-human-futures`

Each topic uses existing source IDs only. Featured sources were selected when the existing source record directly supports the topic.

## Organization Records Added

Added six official organization records:

- `org-us-energy-information-administration`
- `org-arizona-department-water-resources`
- `org-arizona-corporation-commission`
- `org-cmhc`
- `org-government-of-ontario`
- `org-statistics-canada`

These records are backed by existing source IDs and improve Atlas navigation. No organization records were added merely to fill space.

## Relationship Rules Implemented

Source detail pages now show related local systems when:

```text
localSystem.source_ids includes source.id
```

Topic detail pages now show related local systems when:

```text
localSystem.source_ids includes source.id
and source.primary_topics includes topic.name
```

These relationships are deterministic. They are derived from existing source IDs and topic assignments, not inferred from prose.

## What Was Not Done

- No records were promoted to `Published`.
- No new signals were created.
- No new source records were added.
- No dependencies were added.
- No automation or ingestion was started.
- No unsupported relationships were created.
- No schema fields were changed.

## Acceptance Criteria

- [x] Phase 14 work package exists.
- [x] Missing priority topic records exist and validate.
- [x] New organization records are useful and source-supported.
- [x] Source detail pages show related local systems where supported.
- [x] Atlas relationships are deterministic and not fabricated.
- [x] No records are promoted to `Published`.
- [x] `npm run check` passes.
- [x] `npm run build` passes.
- [x] Roadmap identifies the next phase.

## Validation Results

```text
npm run check: 0 errors, 0 warnings, 0 hints
npm run build: 59 pages generated
```

## Preview Results

Checked in the in-app browser:

- `/atlas/`
- `/atlas/topics/energy/`
- `/atlas/sources/source-eia-electricity-data/`
- `/atlas/local-systems/us-southwest-chip-corridor/`

Observed:

- Atlas loads with updated record counts.
- Energy topic page shows featured source links and local-system backlinks through source-topic overlap.
- EIA electricity source page shows a related organization and local system profile.
- U.S. Southwest Chip Corridor still renders linked source cards.
- No horizontal overflow was detected on the checked pages.

## Recommended Next Phase

Phase 15 should return to editorial content now that the Atlas reference layer better represents the current evidence base.

Suggested title:

```text
Phase 15: Second Reviewed Content Batch and Signal Specificity
```

Focus:

- create or repair a small batch of official-source-backed signals from the expanded source base,
- prioritize energy/grid, water, Ontario housing, building permits, and local constraint signals,
- make signal claims more specific and dated,
- keep records in `Draft` or `In Review` unless they meet publication criteria,
- update or keep briefings in draft depending on signal readiness.

## Open Questions

- Should source-to-local-system backlinks become more prominent on source index pages?
- Should topic pages show relationship provenance labels, such as `source overlap` or `primary topic`?
- Should organizations have an explicit website field before launch?
- Should local system profiles gain formal record statuses before publication review?
