# Phase 06 Work Package: Route Completion and Light Filtering

This work package completes the first MVP route skeleton for FTFN before visual design.

## Objective

Expose the remaining MVP content collections through simple generated pages, connect related records where useful, and add a small dependency-free filtering pass on the signal index.

## Inputs

Required context:

- [README](../../README.md)
- [Documentation Map](../documentation-map.md)
- [Master Roadmap](../master-roadmap.md)
- [Decision Log](../decision-log.md)
- [Taxonomy](../taxonomy.md)
- [Content Model](../content-model.md)
- [Content Scaffold Plan](../content-scaffold-plan.md)
- [Information Architecture](../information-architecture.md)
- [Phase 05 Work Package](phase-05-build-validation-and-scaffold-repair.md)
- `app/package.json`
- `app/src/content.config.ts`
- existing app pages, layout, UI component, and global styles

## Deliverables

- [x] Phase 06 work package
- [x] Source index route
- [x] Source detail route
- [x] Local system index route
- [x] Local system detail route
- [x] Briefing index route
- [x] Briefing detail route
- [x] Signal index light filtering
- [x] Topic-to-source cross-links
- [x] Signal-to-source cross-links
- [x] Signal-to-local-system cross-links
- [x] Briefing-to-signal cross-links
- [x] Updated navigation
- [x] Passing `npm run check`
- [x] Passing `npm run build`
- [x] Updated README
- [x] Updated master roadmap
- [x] Updated decision log

## Checklist

### Source Routes

- [x] Add `app/src/pages/atlas/sources/index.astro`.
- [x] Add `app/src/pages/atlas/sources/[id].astro`.
- [x] List source records with source type, credibility, and capture priority.
- [x] Show original source URL, update frequency, known limitations, and related signals.

### Local System Routes

- [x] Add `app/src/pages/atlas/local-systems/index.astro`.
- [x] Add `app/src/pages/atlas/local-systems/[slug].astro`.
- [x] Show current equilibrium, key industries, constraints, actors with authority, likely second-order effects, and missing data.
- [x] Show related signals when a signal names the local system as a receiving system.

### Briefing Routes

- [x] Add `app/src/pages/briefings/index.astro`.
- [x] Add `app/src/pages/briefings/[slug].astro`.
- [x] Show top takeaways, constraint watch, what to watch next, MDX body content, and referenced signals.

### Cross-Links

- [x] Add internal source profile links from signal detail pages.
- [x] Preserve original source URL links from signal detail pages.
- [x] Add featured source cards on topic detail pages.
- [x] Add receiving system cards on signal detail pages where exact local system matches exist.
- [x] Add referenced signal cards on briefing detail pages.
- [x] Add Briefings to the primary navigation.

### Light Filtering

- [x] Add dependency-free filtering on the signal index.
- [x] Filter by topic.
- [x] Filter by signal type.
- [x] Filter by time horizon.
- [x] Keep filtering as inline vanilla JavaScript.
- [x] Do not add a client framework or new dependency.

## Validation Results

`npm run check`:

```text
Result (19 files):
- 0 errors
- 0 warnings
- 0 hints
```

`npm run build`:

```text
33 page(s) built
Complete
```

Representative generated pages verified:

```text
dist/atlas/sources/index.html
dist/atlas/sources/source-noaa-cpc-enso/index.html
dist/atlas/sources/source-nist-chips/index.html
dist/atlas/local-systems/index.html
dist/atlas/local-systems/ontario-real-estate/index.html
dist/atlas/local-systems/us-southwest-chip-corridor/index.html
dist/briefings/index.html
dist/briefings/first-stack-watch/index.html
```

Additional checks:

- the built signal index contains the filter controls,
- a built signal detail page links to its source profile,
- a built signal detail page links to its matching local system profile.

## Acceptance Criteria

This phase is complete because:

- source routes build,
- local system routes build,
- briefing routes build,
- signal filtering was implemented without new dependencies,
- `npm run check` passes,
- `npm run build` passes,
- the roadmap identifies homepage narrative and visual design as the next phase.

## Recommended Next Phase

Phase 07 should create the first real narrative and visual pass:

- homepage narrative structure,
- visual hierarchy,
- richer but still restrained design tokens,
- homepage sections using real seed content,
- mobile and desktop layout verification,
- source/local-system/briefing navigation refinement if needed.

## Completion Notes

Status: complete as of 2026-05-26.

FTFN now has a build-verified MVP route skeleton across signals, topics, sources, local systems, briefings, and about.
