# Phase 26 Work Package: Dependency-Map Backlinks and Reader-Journey Integration

## Goal

Integrate dependency maps into existing FTFN reader journeys by adding deterministic backlinks from related records to maps.

This phase makes dependency maps discoverable without adding graph libraries, scoring, automation, ingestion, or inferred relationships.

## Generated Prompt

```text
Start Phase 26 for FTFN.

Read:
- README.md
- docs/session-brief.md
- docs/master-roadmap.md
- docs/decision-log.md
- docs/dependency-map-format.md
- docs/content-model.md
- docs/review-checklists.md
- docs/content-expansion-plan.md
- docs/work-packages/phase-25-qualitative-dependency-map-format.md
- app/package.json
- app/src/content.config.ts
- app/src/components/ui/MetaPill.astro
- app/src/pages/signals/[slug].astro
- app/src/pages/atlas/topics/[slug].astro
- app/src/pages/atlas/sources/[id].astro
- app/src/pages/atlas/technologies/[slug].astro
- app/src/pages/atlas/local-systems/[slug].astro
- app/src/pages/atlas/evidence-gaps/[slug].astro
- app/src/pages/briefings/[slug].astro
- app/src/content/dependency-maps/

Phase 26 goal:
Add deterministic backlinks from related records to dependency maps and decide where dependency maps should appear in MVP reader journeys.

Implementation scope:
1. Create docs/work-packages/phase-26-dependency-map-backlinks-and-reader-journey-integration.md.
2. Run npm run validate:content before app changes.
3. Add a reusable dependency-map backlink component if it keeps the UI consistent.
4. Add dependency-map backlinks to:
   - signal detail pages,
   - source detail pages,
   - technology detail pages,
   - local system detail pages,
   - evidence gap detail pages.
5. Add dependency-map sections to topic pages only when the map primary topic matches the topic page.
6. Add dependency-map sections to briefing pages only when maps share explicit signal IDs or evidence gap IDs with the briefing.
7. Label why each map appears.
8. Do not infer relationships from prose.
9. Do not add dependencies, graph libraries, scoring, automation, ingestion, or a database.
10. Do not add new content records unless needed to repair a blocking reference issue.
11. Do not promote any records to Published.
12. Run npm run validate:content.
13. Run npm run check.
14. Run npm run build.
15. Smoke check representative pages.
16. Update README.md, docs/master-roadmap.md, docs/decision-log.md, docs/dependency-map-format.md, docs/content-expansion-plan.md, docs/session-brief.md, and this work package.

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
- `docs/dependency-map-format.md`
- `docs/content-model.md`
- `docs/review-checklists.md`
- `docs/content-expansion-plan.md`
- `docs/work-packages/phase-25-qualitative-dependency-map-format.md`
- `app/package.json`
- `app/src/content.config.ts`
- `app/src/components/ui/MetaPill.astro`
- `app/src/pages/signals/[slug].astro`
- `app/src/pages/atlas/topics/[slug].astro`
- `app/src/pages/atlas/sources/[id].astro`
- `app/src/pages/atlas/technologies/[slug].astro`
- `app/src/pages/atlas/local-systems/[slug].astro`
- `app/src/pages/atlas/evidence-gaps/[slug].astro`
- `app/src/pages/briefings/[slug].astro`
- `app/src/content/dependency-maps/`

## Scope

1. Add deterministic backlinks from records to dependency maps.
2. Use only explicit IDs or controlled topic fields.
3. Add a shared UI component for map backlink cards.
4. Do not add new records.
5. Do not add graph visuals or scoring.
6. Promote no records to `Published`.

## Decisions

Dependency maps should appear in MVP reader journeys where the relationship is explicit:

- signal pages when a map includes the signal ID,
- source pages when a map includes the source ID,
- technology pages when a map includes the technology ID,
- local system pages when a map includes the local system ID,
- evidence gap pages when a map includes the evidence gap ID,
- topic pages when a map's `primary_topic` matches the topic,
- briefing pages when a map shares signal IDs or evidence gap IDs with the briefing.

Maps should not appear through prose matching, title matching, keyword matching, or implied causal relationships.

## App Changes

Added:

- `app/src/components/atlas/DependencyMapLinks.astro`

Updated:

- `app/src/pages/signals/[slug].astro`
- `app/src/pages/atlas/sources/[id].astro`
- `app/src/pages/atlas/technologies/[slug].astro`
- `app/src/pages/atlas/local-systems/[slug].astro`
- `app/src/pages/atlas/evidence-gaps/[slug].astro`
- `app/src/pages/atlas/topics/[slug].astro`
- `app/src/pages/briefings/[slug].astro`

## Acceptance Criteria

- Phase 26 work package exists.
- Dependency-map backlink rules are documented.
- Related records link back to dependency maps through explicit IDs or controlled topic fields.
- Topic pages show maps only through primary-topic match.
- Briefing pages show maps only through shared signal IDs or evidence-gap IDs.
- Backlink cards label why each map appears.
- No relationships are inferred from prose.
- No new dependencies are added.
- No graph libraries or scoring are added.
- No records are promoted to `Published`.
- `npm run validate:content` passes.
- `npm run check` passes.
- `npm run build` passes.
- Smoke checks confirm representative backlink sections render.
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

- `/signals/ai-electricity-demand-compute-grid-constraint-signal/`
- `/atlas/technologies/grid-scale-energy-storage/`
- `/atlas/evidence-gaps/gap-001-arizona-utility-power-capacity/`
- `/atlas/topics/chips-and-compute/`
- `/atlas/sources/source-iea-ai/`
- `/atlas/local-systems/us-southwest-chip-corridor/`
- `/briefings/stack-watch-001-local-constraints/`

Confirmed the served HTML includes the expected dependency-map backlink sections on each representative page.

## Next Phase Candidate

Phase 27 should expand dependency maps carefully by defining map selection rules and prototyping one second map using existing records only.

Recommended focus:

- choose a second map candidate from current records,
- document why the map deserves to exist,
- avoid content volume for its own sake,
- keep all maps qualitative,
- avoid graph libraries and numeric scoring.
