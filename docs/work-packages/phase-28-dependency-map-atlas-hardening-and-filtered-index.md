# Phase 28 Work Package: Dependency-Map Atlas Hardening and Filtered Index

## Goal

Harden the dependency-map Atlas now that FTFN has multiple qualitative maps.

This phase makes `/atlas/dependency-maps/` easier to scan before creating additional maps. It keeps the surface static, qualitative, dependency-free, and evidence-aware.

## Generated Prompt

```text
Start Phase 28 for FTFN.

Read:
- README.md
- docs/session-brief.md
- docs/master-roadmap.md
- docs/decision-log.md
- docs/content-expansion-plan.md
- docs/dependency-map-format.md
- docs/work-packages/phase-27-dependency-map-selection-rules-and-second-prototype.md
- app/package.json
- app/src/content.config.ts
- app/src/pages/atlas/dependency-maps/index.astro
- app/src/pages/atlas/dependency-maps/[slug].astro
- app/src/content/dependency-maps/

Phase 28 goal:
Harden the dependency-map Atlas index now that multiple maps exist.

Implementation scope:
1. Create docs/work-packages/phase-28-dependency-map-atlas-hardening-and-filtered-index.md.
2. Run npm run validate:content before app changes.
3. Add lightweight grouping or filtering to /atlas/dependency-maps/.
4. Show map counts by map type, topic, and status.
5. Add a short public selection-rule note to the dependency-map index.
6. Keep the index static and dependency-free unless a stronger need appears.
7. Do not create additional dependency maps in this phase.
8. Do not add graph libraries, scoring, automation, ingestion, or a database.
9. Do not promote any records to Published.
10. Run npm run validate:content.
11. Run npm run check.
12. Run npm run build.
13. Smoke check /atlas/dependency-maps/.
14. Update README.md, docs/master-roadmap.md, docs/decision-log.md, docs/content-expansion-plan.md, docs/dependency-map-format.md, docs/session-brief.md, and this work package.

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
- `docs/work-packages/phase-27-dependency-map-selection-rules-and-second-prototype.md`
- `app/package.json`
- `app/src/content.config.ts`
- `app/src/pages/atlas/dependency-maps/index.astro`
- `app/src/pages/atlas/dependency-maps/[slug].astro`
- `app/src/content/dependency-maps/`

## Scope

1. Make the dependency-map index easier to scan.
2. Add counts by map type, topic, and status.
3. Add a public selection-rule note.
4. Keep the index static and dependency-free.
5. Create no new content records.
6. Promote no records to `Published`.

## App Changes

Updated:

```text
app/src/pages/atlas/dependency-maps/index.astro
```

The dependency-map index now includes:

- a count strip for total maps, map types, primary topics, and linked evidence gaps,
- a public selection-rule panel,
- count cards by type, topic, and status,
- grouped browsing sections by map type,
- grouped browsing sections by topic,
- the existing all-map card grid.

## Index Policy

The dependency-map index remains static in Phase 28.

Rationale:

- FTFN currently has only two dependency maps.
- Static grouping is enough to make the surface scannable.
- Client-side filtering would add complexity before map volume justifies it.
- Query-string filtering would not be meaningful on a static Astro page without client-side code.

Future trigger:

If dependency maps grow beyond roughly 10-12 records, revisit client-side filtering or generated filtered pages.

## Acceptance Criteria

- Phase 28 work package exists.
- `/atlas/dependency-maps/` is easier to scan.
- Map counts appear by type, topic, and status.
- A short public selection-rule note exists.
- No additional dependency maps are created.
- No graph libraries, scoring, automation, ingestion, or database work is added.
- No records are promoted to `Published`.
- `npm run validate:content` passes.
- `npm run check` passes.
- `npm run build` passes.
- Smoke check confirms the dependency-map index renders the new grouped sections.
- The roadmap identifies the next phase.

## Validation Results

```text
npm run validate:content: passed
npm run check: 0 errors, 0 warnings, 0 hints
npm run build: 87 pages generated
```

## Smoke Check

Checked the generated static HTML at:

```text
app/dist/atlas/dependency-maps/index.html
```

Confirmed the page includes:

- `Map Counts`,
- `Selection Rules`,
- `Browse By Type`,
- `Browse By Topic`,
- `Post-quantum standards are not migration`.

## Next Phase Candidate

Phase 29 should make dependency maps easier to discover from higher-traffic surfaces.

Recommended focus:

- add a restrained featured dependency-map section to the homepage,
- improve the Atlas landing page dependency-map entry point,
- keep selection rules visible where maps are introduced,
- avoid creating additional maps,
- keep the surface qualitative and dependency-free.
