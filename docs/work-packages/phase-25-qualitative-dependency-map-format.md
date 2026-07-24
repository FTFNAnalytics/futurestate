# Phase 25 Work Package: Qualitative Dependency-Map Format

## Goal

Define a lightweight qualitative dependency-map format for FTFN and prototype one map using existing records only.

This phase turns the dependency-stack thesis into a structured Atlas surface without adding graph libraries, automated inference, or numeric 42/59 scoring.

## Generated Prompt

```text
Start Phase 25 for FTFN.

Read:
- README.md
- docs/session-brief.md
- docs/master-roadmap.md
- docs/decision-log.md
- docs/content-model.md
- docs/source-strategy.md
- docs/review-checklists.md
- docs/content-expansion-plan.md
- docs/content-scaffold-plan.md
- docs/work-packages/phase-24-technology-atlas-hardening-and-dependency-links.md
- app/package.json
- app/src/content.config.ts
- app/scripts/validate-content-references.mjs
- app/src/pages/atlas/index.astro
- app/src/content/signals/
- app/src/content/sources/
- app/src/content/technologies/
- app/src/content/local-systems/
- app/src/content/evidence-gaps/

Phase 25 goal:
Define a lightweight qualitative dependency-map format, decide whether dependency maps should be standalone records or generated from existing records, and prototype one map using current content only.

Implementation scope:
1. Create docs/work-packages/phase-25-qualitative-dependency-map-format.md.
2. Create docs/dependency-map-format.md.
3. Decide whether dependency maps are standalone records, generated views, or a hybrid.
4. Add a dependency-map content collection only if the format is useful and reversible.
5. Prototype one dependency map using existing records only.
6. Keep dependency maps qualitative and evidence-aware.
7. Do not add numeric 42/59 scoring.
8. Do not infer relationships from prose.
9. Do not add dependencies, graph libraries, automation, ingestion, or a database.
10. Add Atlas UI only if it remains simple and dependency-free.
11. Extend reference validation for dependency maps if a collection is added.
12. Do not promote any records to Published.
13. Run npm run validate:content.
14. Run npm run check.
15. Run npm run build.
16. Update README.md, docs/documentation-map.md, docs/master-roadmap.md, docs/decision-log.md, docs/content-model.md, docs/review-checklists.md, docs/content-scaffold-plan.md, docs/content-expansion-plan.md, docs/session-brief.md, and this work package.

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
- `docs/content-model.md`
- `docs/source-strategy.md`
- `docs/review-checklists.md`
- `docs/content-expansion-plan.md`
- `docs/content-scaffold-plan.md`
- `docs/work-packages/phase-24-technology-atlas-hardening-and-dependency-links.md`
- `app/package.json`
- `app/src/content.config.ts`
- `app/scripts/validate-content-references.mjs`
- `app/src/pages/atlas/index.astro`
- `app/src/content/signals/`
- `app/src/content/sources/`
- `app/src/content/technologies/`
- `app/src/content/local-systems/`
- `app/src/content/evidence-gaps/`

## Scope

1. Create a reusable dependency-map method document.
2. Add a structured dependency-map collection if useful.
3. Prototype one dependency map using only current records.
4. Add lightweight Atlas routes for dependency maps if they improve navigation.
5. Extend content reference validation for dependency-map IDs, nodes, and links.
6. Keep all maps qualitative and evidence-aware.
7. Avoid numeric scoring, graph dependencies, automation, ingestion, and database work.
8. Promote no records to `Published`.

## Decisions

Dependency maps will begin as standalone JSON records that link to existing FTFN records.

They are not generated automatically in this phase.

Rationale:

- the content graph is still too small for responsible inference,
- standalone records require explicit editorial boundaries,
- qualitative labels avoid false precision,
- JSON records are easy to validate and migrate later.

## Prototype

Created:

```text
app/src/content/dependency-maps/local-constraints-where-the-future-arrives.json
```

Prototype title:

```text
Local constraints are where the future arrives
```

The map links existing signals, sources, technologies, local systems, and evidence gaps. It shows how AI compute, semiconductor infrastructure, grid capacity, water governance, Ontario housing, and permit-to-completion evidence relate through local receiving systems.

Boundary:

The map does not prove local readiness, project viability, facility capacity, housing completions, water sufficiency, or a 42/59 score.

## App Changes

Added:

- `dependencyMaps` content collection in `app/src/content.config.ts`,
- dependency-map reference validation in `app/scripts/validate-content-references.mjs`,
- `/atlas/dependency-maps/`,
- `/atlas/dependency-maps/[slug]/`,
- Atlas landing-page link to dependency maps.

## Acceptance Criteria

- Phase 25 work package exists.
- Dependency-map format documentation exists.
- The standalone-versus-generated decision is documented.
- A dependency-map collection exists only if it remains simple and reversible.
- One prototype dependency map exists using current records only.
- Dependency-map relationships are qualitative and evidence-aware.
- No numeric 42/59 scoring is added.
- No relationships are invented from prose.
- No new dependencies are added.
- No records are promoted to `Published`.
- `npm run validate:content` passes.
- `npm run check` passes.
- `npm run build` passes.
- The roadmap identifies the next phase.

## Validation Results

```text
npm run validate:content: passed
npm run check: 0 errors, 0 warnings, 0 hints
npm run build: 86 pages generated
```

## Smoke Check

The local dev server at `http://127.0.0.1:4321/` was reachable.

Checked pages:

- `/atlas/dependency-maps/`
- `/atlas/dependency-maps/local-constraints-where-the-future-arrives/`

Confirmed the served HTML includes the dependency-map index copy and the prototype dependency-map title.

## Next Phase Candidate

Phase 26 should integrate dependency maps into existing reader journeys.

Recommended focus:

- add deterministic backlinks from relevant signal, technology, local-system, evidence-gap, and source pages to dependency maps,
- decide where dependency maps should appear in briefings and topic pages,
- keep relationship rules explicit,
- avoid graph libraries and scoring until map usage proves valuable.
