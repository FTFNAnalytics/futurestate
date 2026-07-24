# Phase 06 Starter Prompt: Route Completion and Light Filtering

Use this to complete the first MVP route skeleton before visual design.

```text
Start Phase 06 for FTFN.

Read:
- README.md
- docs/documentation-map.md
- docs/master-roadmap.md
- docs/decision-log.md
- docs/taxonomy.md
- docs/content-model.md
- docs/content-scaffold-plan.md
- docs/information-architecture.md
- docs/work-packages/phase-05-build-validation-and-scaffold-repair.md
- app/package.json
- app/src/content.config.ts
- app/src/pages/index.astro
- app/src/pages/signals/index.astro
- app/src/pages/signals/[slug].astro
- app/src/pages/atlas/topics/index.astro
- app/src/pages/atlas/topics/[slug].astro
- app/src/components/layout/BaseLayout.astro
- app/src/components/ui/MetaPill.astro
- app/src/styles/global.css

Create:
- docs/work-packages/phase-06-route-completion-and-light-filtering.md

Phase 06 goal:
Complete the MVP route skeleton by adding generated pages for sources, local systems, and briefings, plus a small signal filtering pass if it stays simple.

Implementation scope:
1. Create source pages:
   - app/src/pages/atlas/sources/index.astro
   - app/src/pages/atlas/sources/[slug].astro or [id].astro
2. Create local system pages:
   - app/src/pages/atlas/local-systems/index.astro
   - app/src/pages/atlas/local-systems/[slug].astro
3. Create briefing pages:
   - app/src/pages/briefings/index.astro
   - app/src/pages/briefings/[slug].astro
4. Add minimal cross-links where useful:
   - topic pages to featured sources,
   - signal detail pages to source records,
   - local system pages to related signals when possible,
   - briefing pages to referenced signals.
5. Add a light signal filtering affordance only if it can be done without a heavy client-side framework or new dependency.
6. Keep styling minimal and consistent with the existing scaffold.
7. Do not complete the visual design yet.
8. Run npm run check.
9. Run npm run build.
10. Verify generated pages exist for:
   - source index,
   - source detail,
   - local system index,
   - local system detail,
   - briefing index,
   - briefing detail.
11. Update README.md, docs/master-roadmap.md, docs/decision-log.md, and the Phase 06 work package.

Preserve:
- FTFN shorthand,
- 42/59 framing,
- the thesis: "The future is not a list of inventions. It is a stack of dependencies."

Acceptance criteria:
- source routes build,
- local system routes build,
- briefing routes build,
- signal filtering is either implemented simply or explicitly deferred,
- npm run check passes,
- npm run build passes,
- the roadmap identifies the next phase, likely homepage narrative and visual design.
```
