# Phase 12 Work Package: Source Expansion and Local Evidence Foundations

## Objective

Deepen the FTFN source base so future reviewed signals and local system profiles can be supported by stronger evidence, especially around energy/grid, water, local planning, local utility capacity, semiconductor industrial constraints, and Ontario housing context.

Phase 12 is an evidence-foundation phase. It adds a small number of official source records and cautiously links them to local system profiles. It does not publish records, start ingestion, or create broad local conclusions.

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
- [Phase 11 Work Package](phase-11-editorial-state-visibility-and-citation-ui.md)
- `app/src/content.config.ts`
- `app/src/content/sources/`
- `app/src/content/local-systems/`
- `app/src/pages/signals/index.astro`
- `app/src/pages/signals/[slug].astro`
- `app/src/pages/atlas/sources/[id].astro`

## Evidence Gaps Found

The existing source base was strong for frontier domains and national-level policy, but weak for local-system interpretation.

Missing or thin evidence areas:

- energy/grid baseline data for interpreting compute, chips, electrification, and local infrastructure constraints,
- Arizona-specific electricity context for the U.S. Southwest chip corridor,
- Arizona water governance and water-resource context,
- Arizona utility-regulation context,
- Ontario housing market and housing-supply context,
- Canadian building-permit context as an early construction signal,
- municipal-level infrastructure capacity, permitting timelines, and project-level financing evidence.

## Source Records Added

Added official or primary institutional sources only:

- `source-eia-electricity-data`
- `source-eia-arizona-electricity-profile`
- `source-arizona-department-water-resources`
- `source-arizona-corporation-commission-utilities`
- `source-cmhc-housing-market-information-portal`
- `source-ontario-housing-supply-progress`
- `source-statcan-building-permits-survey`

These records deliberately stay at the source layer. They improve the evidence base without creating new conclusions.

## Source Choice Notes

Energy and grid:

- The U.S. EIA electricity data hub is the national official anchor for electricity data.
- The EIA Arizona Electricity Profile adds state-specific context for the U.S. Southwest chip corridor.

Water and utility regulation:

- Arizona Department of Water Resources is the official state water-agency source for water programs, planning, drought, supply and demand, and water-related data tools.
- Arizona Corporation Commission Utilities Division is the official state regulator source for investor-owned and privately owned utility jurisdiction, tariffs, annual reports, and public utility context.

Ontario housing and construction:

- CMHC Housing Market Information Portal is the official Canadian housing market data portal.
- Ontario Housing Supply Progress Tracker is the official provincial tracker for municipal housing target progress.
- Statistics Canada Building Permits Survey is the official monthly source for Canadian building-permit data and construction-intention context.

## Local System Updates

Updated:

- `local-ontario-real-estate`
- `local-us-southwest-chip-corridor`

The updates add source IDs and short evidence-foundation sections. They do not assert local outcomes that the new sources cannot support.

Ontario real estate now has source support for:

- Canadian housing market data,
- provincial housing-supply progress,
- building-permit and construction-intention context.

It still needs:

- municipal infrastructure capacity,
- permit timelines by municipality,
- project-level financing exposure,
- submarket inventory,
- local utility and servicing evidence.

U.S. Southwest chip corridor now has source support for:

- semiconductor policy context,
- U.S. and Arizona electricity baseline context,
- Arizona water governance,
- Arizona utility-regulation context.

It still needs:

- facility-level water demand,
- utility interconnection and service-territory evidence,
- water-provider evidence,
- permit records,
- workforce pipeline data,
- supplier network evidence.

## What Was Not Done

- No records were promoted to `Published`.
- No new signals were created.
- No company claims were elevated.
- No automation or ingestion was started.
- No dependencies were added.
- No unsupported local conclusions were added.

## Acceptance Criteria

- [x] Phase 12 work package exists.
- [x] Source evidence gaps are documented.
- [x] A focused set of new source records exists.
- [x] New source records validate against the content schema.
- [x] Local system profiles are updated only where evidence supports them.
- [x] No unsupported local claims are added.
- [x] No records are promoted to `Published`.
- [x] `npm run check` passes.
- [x] `npm run build` passes.
- [x] Roadmap identifies the next phase.

## Validation Results

```text
npm run check: 0 errors, 0 warnings, 0 hints
npm run build: 48 pages generated
```

## Recommended Next Phase

Phase 13 should harden local system profiles now that their first official evidence layer exists.

Suggested title:

```text
Phase 13: Local System Profile Hardening and Constraint Notes
```

Focus:

- turn the two local system profiles into source-backed analytical pages,
- add explicit constraint notes and missing-data tables,
- decide which local-system fields should be public at MVP,
- add only the next official sources needed for local profile quality,
- keep profiles cautious until municipal, utility, permitting, and facility-level evidence exists.

## Open Questions

- Should FTFN add dedicated local-system source categories for municipal data, utility filings, permits, and planning documents?
- Should local-system profiles remain public during prelaunch or be hidden until they meet a stricter evidence threshold?
- Should source checked dates become required in a formal citation block?
- Should facility-level infrastructure data become a later database-backed collection?
