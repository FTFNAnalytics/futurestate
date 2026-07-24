# Phase 31 Work Package: Dependency-Map Reader-Journey QA and Third-Map Decision Gate

## Goal

Test whether the current dependency-map reader journey works well enough to pause map polishing and return to broader source-backed content expansion.

This phase creates no new maps, records, scoring systems, graph libraries, automation, ingestion, or database layer. It treats dependency maps as qualitative editorial records.

## Generated Prompt

```text
Start Phase 31 for FTFN.

Read:
- README.md
- docs/session-brief.md
- docs/master-roadmap.md
- docs/decision-log.md
- docs/content-expansion-plan.md
- docs/dependency-map-format.md
- docs/information-architecture.md
- docs/work-packages/phase-30-dependency-map-detail-readability-and-selection-rule-audit.md
- app/package.json
- app/src/content.config.ts
- app/src/pages/index.astro
- app/src/pages/atlas/index.astro
- app/src/pages/atlas/dependency-maps/index.astro
- app/src/pages/atlas/dependency-maps/[slug].astro
- app/src/content/dependency-maps/

Phase 31 goal:
Test the dependency-map reader journey and decide whether the roadmap should create a third map or pause map work for broader content expansion.

Implementation scope:
1. Create docs/work-packages/phase-31-dependency-map-reader-journey-qa-and-third-map-decision-gate.md.
2. Run npm run validate:content before the QA pass.
3. Test the reader path from homepage to Atlas landing to dependency-map index to both dependency-map detail pages.
4. Confirm representative backlinks from signals, sources, technologies, local systems, topics, briefings, and evidence gaps.
5. Treat wording mismatches separately from broken links.
6. Decide whether a third map is justified by current selection rules.
7. Do not create a third map unless the selection rules clearly support it.
8. Do not add dependencies, graph libraries, scoring, automation, ingestion, or a database.
9. Do not promote any records to Published.
10. Run npm run validate:content.
11. Run npm run check.
12. Run npm run build.
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
- `docs/work-packages/phase-30-dependency-map-detail-readability-and-selection-rule-audit.md`
- `app/package.json`
- `app/src/content.config.ts`
- `app/src/pages/index.astro`
- `app/src/pages/atlas/index.astro`
- `app/src/pages/atlas/dependency-maps/index.astro`
- `app/src/pages/atlas/dependency-maps/[slug].astro`
- `app/src/content/dependency-maps/`

## Scope

1. Test the dependency-map reader journey.
2. Confirm backlink surfaces still make sense.
3. Decide whether current records justify a third map.
4. Create no new content records.
5. Add no dependencies.
6. Promote no records to `Published`.

## Reader-Journey QA

The generated site was checked for this path:

```text
Homepage -> Atlas landing -> Dependency-map index -> Map detail pages
```

Result: pass.

Checked pages:

- `/`
- `/atlas/`
- `/atlas/dependency-maps/`
- `/atlas/dependency-maps/local-constraints-where-the-future-arrives/`
- `/atlas/dependency-maps/post-quantum-standards-are-not-migration/`

Confirmed:

- the homepage links to the dependency-map index,
- the Atlas landing page links to the dependency-map index,
- the dependency-map index links to both current maps,
- both map detail pages show `Map Structure`,
- both map detail pages show `Selection Rule Check`,
- both map detail pages show `Evidence Trail`,
- both map detail pages show `What This Does Not Prove`.

## Backlink QA

Representative backlink pages were checked from the generated site.

Result: pass.

Checked backlink surfaces:

- signal to local-constraints map,
- signal to post-quantum map,
- technology to local-constraints map,
- technology to post-quantum map,
- local system to local-constraints map,
- evidence gap to post-quantum map,
- source to post-quantum map,
- topic to post-quantum map,
- briefing to local-constraints map.

The first QA pass used the expected label `Related Dependency Maps`, but the app uses the public section label `Dependency Maps`. The links were then rechecked against the actual public label and hrefs. This was a wording mismatch, not a broken relationship.

## Decision Gate

Decision: pause dependency-map expansion and return to broader source-backed content growth.

Rationale:

- The current reader journey works.
- Representative backlinks work.
- The two current maps are useful and discoverable.
- A third map would be more valuable after FTFN adds more source-backed records in underdeveloped pillars.
- The current content base is still narrow, no records are `Published`, and several evidence gaps remain unresolved.
- More maps now would risk turning map count into roadmap momentum rather than editorial need.

## Third-Map Candidate Assessment

No third map was created.

Possible future candidates remain:

- eVTOL certification and service readiness,
- ENSO and local climate-risk translation,
- AI electricity demand and local planning capacity,
- critical minerals to advanced manufacturing conversion,
- agriculture, bioinformatics, and climate adaptation.

These should stay candidates until source-backed records make the map question, record IDs, evidence boundaries, and next-record needs clear.

## Boundary

Phase 31 does not change the app, add content records, create dependency maps, promote records, add scoring, or begin automation.

Dependency maps remain qualitative. They should be created only when they clarify dependencies, constraints, and missing evidence better than ordinary record backlinks.

## Acceptance Criteria

- Phase 31 work package exists.
- Reader path from homepage to Atlas landing to dependency-map index to both map detail pages is tested.
- Representative backlinks are tested.
- Wording mismatches are separated from broken links.
- Third-map decision is documented.
- No third map is created unless selection rules clearly support it.
- No dependencies, graph libraries, scoring, automation, ingestion, or database layer are added.
- No records are promoted to `Published`.
- `npm run validate:content` passes.
- `npm run check` passes.
- `npm run build` passes.
- The roadmap identifies the next phase.

## Validation Results

```text
npm run validate:content: passed
npm run check: 0 errors, 0 warnings, 0 hints
npm run build: 87 pages generated
```

## Preview Check

The in-app browser could not load the local dev URL because the dev server was not reachable. The generated `app/dist` site was checked instead.

Confirmed generated pages include the expected labels and links for:

- homepage dependency-map entry,
- Atlas dependency-map entry,
- dependency-map index,
- both dependency-map detail pages,
- signal, source, technology, local-system, evidence-gap, topic, and briefing backlinks.

## Next Phase Candidate

Phase 32 should resume source-backed content expansion now that the dependency-map layer has passed its reader-journey gate.

Recommended focus:

- choose a small source-backed batch across underdeveloped pillars,
- prioritize official or primary sources,
- add or repair records only where evidence support is strong,
- keep all records below `Published`,
- keep dependency-map creation paused unless the new content clearly satisfies the selection rules.
