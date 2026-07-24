# Phase 08 Work Package: Atlas Completion and Entity Routes

This work package completes the MVP Atlas structure for FTFN and `ftfn.io`.

## Objective

Create a true Atlas landing page, expose organization and technology seed records through generated routes, and add deterministic cross-links supported by existing content fields.

## Inputs

Required context:

- [README](../../README.md)
- [Documentation Map](../documentation-map.md)
- [Master Roadmap](../master-roadmap.md)
- [Decision Log](../decision-log.md)
- [Taxonomy](../taxonomy.md)
- [Content Model](../content-model.md)
- [Source Strategy](../source-strategy.md)
- [Information Architecture](../information-architecture.md)
- [Content Scaffold Plan](../content-scaffold-plan.md)
- [Phase 07 Work Package](phase-07-homepage-narrative-and-visual-design.md)
- `app/package.json`
- `app/src/content.config.ts`
- `app/src/components/layout/BaseLayout.astro`
- `app/src/components/ui/MetaPill.astro`
- `app/src/styles/tokens.css`
- `app/src/styles/global.css`
- existing homepage and Atlas routes

## Deliverables

- [x] Phase 08 work package
- [x] `/atlas/` landing page
- [x] Primary navigation updated so Atlas points to `/atlas/`
- [x] Organization index route
- [x] Organization detail route
- [x] Technology index route
- [x] Technology detail route
- [x] Atlas landing links to topics, sources, organizations, technologies, and local systems
- [x] Topic detail pages show related organizations by topic match
- [x] Topic detail pages show related technologies by topic match
- [x] Source detail pages show related organizations by `source_ids`
- [x] Source detail pages show related technologies by `source_ids`
- [x] Passing `npm run check`
- [x] Passing `npm run build`
- [x] Atlas landing page preview
- [x] Updated README
- [x] Updated master roadmap
- [x] Updated decision log

## Routes Added

```text
/atlas/
/atlas/organizations/
/atlas/organizations/[slug]/
/atlas/technologies/
/atlas/technologies/[slug]/
```

Representative generated pages:

```text
/atlas/organizations/nist/
/atlas/technologies/lidar/
```

## Relationship Rules Used

Phase 08 intentionally avoids invented relationships.

Topic detail pages link to organizations and technologies when:

```text
entity.primary_topics includes topic.name
```

Source detail pages link to organizations and technologies when:

```text
entity.source_ids includes source.id
```

Organization detail pages link to signals when:

```text
signal.source_ids overlaps organization.source_ids
```

Technology detail pages link to topics and sources through explicit `primary_topics` and `source_ids`.

Signals do not yet link directly to organizations or technologies because those fields are not active in the current signal schema.

## Validation Results

`npm run check`:

```text
Result (24 files):
- 0 errors
- 0 warnings
- 0 hints
```

`npm run build`:

```text
38 page(s) built
Complete
```

## Browser Preview

Previewed `/atlas/` in the in-app browser.

Checks:

- title renders as `Atlas | FTFN`,
- page headline renders,
- Atlas landing links to all five Atlas sections,
- primary navigation points to `/atlas/`,
- no horizontal overflow at desktop width,
- no horizontal overflow at mobile width.

Mobile artifact:

```text
docs/artifacts/phase-08-atlas-mobile.png
```

## Acceptance Criteria

This phase is complete because:

- `/atlas/` exists,
- organization routes build,
- technology routes build,
- Atlas navigation is coherent,
- cross-links are useful and based on existing fields,
- no new dependencies were added,
- public page titles and metadata use FTFN,
- `ftfn.io` is preserved as the domain direction,
- `npm run check` passes,
- `npm run build` passes,
- the roadmap identifies the next phase.

## Recommended Next Phase

Phase 09 should shift from route coverage to editorial readiness:

- define a source and signal review checklist,
- decide what makes a seed record publishable,
- add an editorial method/source transparency page or expand About,
- identify the first content expansion targets,
- begin moving from `Draft Sample` records toward reviewed MVP records,
- preserve manual editorial control before any capture automation.

## Open Questions

- Should organization and technology relationships be added directly to signal frontmatter in the next content-model pass?
- Should Atlas eventually include a visual dependency map, or wait until more records exist?
- Should source transparency live under About, Atlas, or both?
- What minimum evidence threshold should separate `Draft Sample` from `Published`?

## Completion Notes

Status: complete as of 2026-05-26.

FTFN now has a complete MVP Atlas skeleton across topics, sources, organizations, technologies, and local systems.
