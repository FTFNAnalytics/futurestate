# Phase 29 Work Package: Dependency-Map Homepage and Atlas Landing Integration

## Goal

Make existing dependency maps easier to discover from higher-traffic FTFN surfaces.

This phase connects the Phase 28 dependency-map index back into the homepage and Atlas landing page without creating additional maps, adding scoring, or introducing graph tooling.

## Generated Prompt

```text
Start Phase 29 for FTFN.

Read:
- README.md
- docs/session-brief.md
- docs/master-roadmap.md
- docs/decision-log.md
- docs/content-expansion-plan.md
- docs/dependency-map-format.md
- docs/information-architecture.md
- docs/work-packages/phase-28-dependency-map-atlas-hardening-and-filtered-index.md
- app/package.json
- app/src/content.config.ts
- app/src/pages/index.astro
- app/src/pages/atlas/index.astro
- app/src/pages/atlas/dependency-maps/index.astro
- app/src/content/dependency-maps/

Phase 29 goal:
Make dependency maps easier to discover from the homepage and Atlas landing page.

Implementation scope:
1. Create docs/work-packages/phase-29-dependency-map-homepage-and-atlas-landing-integration.md.
2. Run npm run validate:content before app changes.
3. Add a restrained featured dependency-map section to the homepage if it improves reader orientation.
4. Improve the Atlas landing page dependency-map entry point with current map counts or selection-rule context.
5. Use existing dependency-map records only.
6. Do not create additional dependency maps.
7. Do not add graph libraries, scoring, automation, ingestion, or a database.
8. Do not promote any records to Published.
9. Run npm run validate:content.
10. Run npm run check.
11. Run npm run build.
12. Preview the homepage and Atlas landing page if practical.
13. Update README.md, docs/master-roadmap.md, docs/decision-log.md, docs/content-expansion-plan.md, docs/dependency-map-format.md, docs/information-architecture.md, docs/session-brief.md, and this work package.

Preserve:
- FTFN public brand,
- ftfn.io domain direction,
- 42/59 framing,
- "Civilization is a choice,"
- the thesis: "The future is not a list of inventions. It is a stack of dependencies."
```

## Source Of Truth

Read before continuing:

- `README.md`
- `docs/session-brief.md`
- `docs/master-roadmap.md`
- `docs/decision-log.md`
- `docs/content-expansion-plan.md`
- `docs/dependency-map-format.md`
- `docs/information-architecture.md`
- `docs/work-packages/phase-28-dependency-map-atlas-hardening-and-filtered-index.md`
- `app/package.json`
- `app/src/content.config.ts`
- `app/src/pages/index.astro`
- `app/src/pages/atlas/index.astro`
- `app/src/pages/atlas/dependency-maps/index.astro`
- `app/src/content/dependency-maps/`

## Scope

1. Improve dependency-map discovery from high-traffic routes.
2. Use existing dependency-map records only.
3. Keep dependency-map language qualitative and evidence-aware.
4. Add no dependencies.
5. Create no new records.
6. Promote no records to `Published`.

## App Changes

Updated:

```text
app/src/pages/index.astro
app/src/pages/atlas/index.astro
```

Homepage changes:

- Added a compact dependency-map band after the dependency-stack framework section.
- Shows current map count, map-type count, and linked evidence-gap count.
- Lists existing dependency maps with status and map-type labels.
- Links to `/atlas/dependency-maps/`.

Atlas landing changes:

- Added a dedicated dependency-map entry section.
- Shows qualitative selection-rule context.
- Shows current map counts, map-type count, and evidence-gap count.
- Lists current map topics, map types, and map links.

## Boundary

Phase 29 improves discovery. It does not create new map relationships, resolve evidence gaps, introduce map scoring, or imply that dependency maps are generated automatically.

## Acceptance Criteria

- Phase 29 work package exists.
- Homepage exposes dependency maps without becoming a generic landing page.
- Atlas landing page gives dependency maps a clearer entry point.
- Existing dependency-map records drive the UI.
- No additional maps or content records are created.
- No graph libraries, scoring, automation, ingestion, or database work is added.
- No records are promoted to `Published`.
- `npm run validate:content` passes.
- `npm run check` passes.
- `npm run build` passes.
- Homepage and Atlas landing page are previewed if practical.
- The roadmap identifies the next phase.

## Validation Results

```text
npm run validate:content: passed
npm run check: 0 errors, 0 warnings, 0 hints
npm run build: 87 pages generated
```

## Preview Check

Checked the local app at:

```text
http://127.0.0.1:4321/
http://127.0.0.1:4321/atlas/
```

Confirmed the homepage includes:

- `Dependency Maps`,
- `When one signal is not enough`,
- `Local constraints are where the future arrives`,
- `Post-quantum standards are not migration`.

Confirmed the Atlas landing page includes:

- `Dependency Maps`,
- `Where records become a stack`,
- `Current Map Surface`,
- `Post-quantum standards are not migration`.

## Next Phase Candidate

Phase 30 should audit and polish dependency-map detail pages now that maps are easier to reach.

Recommended focus:

- improve dependency-map detail readability if needed,
- add a compact relationship summary or map-stat surface if it stays static,
- audit both current maps against the selection rules,
- keep maps qualitative,
- avoid creating new maps, scoring, graph libraries, automation, ingestion, or a database.
