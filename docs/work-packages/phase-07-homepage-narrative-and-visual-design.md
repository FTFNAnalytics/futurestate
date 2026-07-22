# Phase 07 Work Package: Homepage Narrative and Visual Design

This work package turns the verified MVP route skeleton into the first real FTFN homepage experience.

## Objective

Create a homepage that explains the FTFN thesis, uses real seed content from the content collections, and establishes a restrained editorial visual direction without turning the project into a generic landing page.

## Inputs

Required context:

- [README](../../README.md)
- [Documentation Map](../documentation-map.md)
- [Master Roadmap](../master-roadmap.md)
- [Decision Log](../decision-log.md)
- [Taxonomy](../taxonomy.md)
- [Content Model](../content-model.md)
- [Information Architecture](../information-architecture.md)
- [Phase 06 Work Package](phase-06-route-completion-and-light-filtering.md)
- `app/package.json`
- `app/src/pages/index.astro`
- `app/src/components/layout/BaseLayout.astro`
- `app/src/components/ui/MetaPill.astro`
- `app/src/styles/tokens.css`
- `app/src/styles/global.css`

## Deliverables

- [x] Phase 07 work package
- [x] Homepage narrative pass
- [x] Homepage sections using real seed collections
- [x] Dependency stack visual section
- [x] Latest signals section
- [x] Topic atlas entry points
- [x] Source transparency section
- [x] Local systems section
- [x] Featured briefing section
- [x] Light visual system refinement
- [x] Desktop homepage preview
- [x] Mobile homepage preview
- [x] Passing `npm run check`
- [x] Passing `npm run build`
- [x] Updated README
- [x] Updated master roadmap
- [x] Updated decision log

## Implementation Notes

The homepage now pulls from these content collections:

- `signals`
- `sources`
- `topics`
- `localSystems`
- `briefings`

The opening frame preserves the core FTFN language:

```text
42 is possibility.
59 is urgency.
Civilization is a choice.
The future is not a list of inventions. It is a stack of dependencies.
```

The dependency stack is represented as five visible framework layers:

```text
Planetary Conditions
Resource Foundations
Enabling Infrastructure
Frontier Domains
Human Systems
```

This is a visual and structural orientation tool, not yet a full data visualization. It can later become a dynamic dependency map or intelligence-layer feature.

## Visual Direction

Phase 07 keeps the design:

- editorial,
- systems-oriented,
- restrained,
- legible,
- grounded in real records,
- lightly alive through hierarchy, spacing, and mixed accent colors.

The visual pass intentionally avoids:

- a generic SaaS hero,
- decorative marketing sections,
- new dependencies,
- a full brand system,
- false precision around the 42/59 Index.

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

## Browser Preview

Previewed at:

```text
Desktop: 1280 x 900
Mobile: 390 x 844
```

Checks:

- no horizontal overflow at desktop width,
- no horizontal overflow at mobile width,
- homepage renders the FTFN headline,
- dependency stack renders five layers,
- metrics render from live collection counts,
- latest signals section is visible after the opening frame,
- mobile hero leaves a hint of the next section visible.

Artifacts:

```text
docs/artifacts/phase-07-homepage-desktop.png
docs/artifacts/phase-07-homepage-mobile.png
```

## Acceptance Criteria

This phase is complete because:

- homepage narrative is clearer and uses real content,
- the 42/59 framing is visible on the homepage,
- the dependency-stack thesis is visible on the homepage,
- latest signals, framework layers, topics, sources, local systems, and briefings are represented,
- visual design is improved but still small and reversible,
- no new dependencies were added,
- existing routes still build,
- `npm run check` passes,
- `npm run build` passes,
- the roadmap identifies the next phase.

## Recommended Next Phase

Phase 08 should complete the Atlas structure and entity routes:

- create an Atlas landing page,
- move the primary Atlas nav link to `/atlas/`,
- expose organization and technology seed records through index/detail pages,
- add cross-links between signals, sources, organizations, technologies, and topics where simple,
- keep styling consistent with the Phase 07 homepage,
- run validation and build after route expansion.

## Open Questions

- Should the homepage eventually show a qualitative 42/59 label per signal?
- Should source transparency become its own public methodology page before launch?
- Should the dependency stack become an interactive diagram in the intelligence layer?
- How much of local system analysis should be public before the first launch?

## Completion Notes

Status: complete as of 2026-05-26.

FTFN now has a first real homepage narrative and visual direction on top of the existing MVP route skeleton.
