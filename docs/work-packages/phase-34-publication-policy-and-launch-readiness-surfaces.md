# Phase 34 Work Package: Publication Policy and Launch-Readiness Surfaces

## Goal

Create the publication policy and public method surface needed before FTFN promotes any records to `Published`.

This phase turns Phase 33's triage into a visible trust layer. It does not publish records.

## Generated Prompt

```text
Start Phase 34 for FTFN.

Read:
- README.md
- docs/session-brief.md
- docs/master-roadmap.md
- docs/decision-log.md
- docs/content-expansion-plan.md
- docs/publication-readiness-triage.md
- docs/review-checklists.md
- docs/editorial-method.md
- docs/source-strategy.md
- docs/work-packages/phase-33-publication-readiness-triage-and-remaining-draft-review.md
- app/package.json
- app/src/content.config.ts
- app/src/content/sources/source-noaa-cpc-enso.json
- app/src/content/signals/signal-sample-001.mdx
- app/src/pages/about/index.astro
- app/src/components/layout/BaseLayout.astro
- app/src/styles/global.css

Phase 34 goal:
Create publication policy and launch-readiness surfaces before any records become Published.

Implementation scope:
1. Create docs/work-packages/phase-34-publication-policy-and-launch-readiness-surfaces.md.
2. Create docs/publication-policy.md.
3. Decide whether source transparency belongs on a dedicated public page or remains in About for MVP.
4. Add the public surface if useful and small.
5. Repair the NOAA ENSO signal against the current NOAA CPC discussion or explicitly exclude it from launch candidates.
6. Add metadata/social preview basics if small and dependency-free.
7. Update About and navigation only as needed.
8. Do not promote any records to Published.
9. Do not add dependencies, automation, ingestion, scoring, graph libraries, or a database.
10. Run npm run validate:content.
11. Run npm run check.
12. Run npm run build.
13. Preview the public method surface if practical.
14. Update README.md, docs/master-roadmap.md, docs/decision-log.md, docs/content-expansion-plan.md, docs/session-brief.md, docs/documentation-map.md, docs/information-architecture.md, docs/publication-readiness-triage.md, and this work package.

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
- `docs/publication-readiness-triage.md`
- `docs/review-checklists.md`
- `docs/editorial-method.md`
- `docs/source-strategy.md`
- `docs/work-packages/phase-33-publication-readiness-triage-and-remaining-draft-review.md`
- `app/src/content/signals/signal-sample-001.mdx`
- `app/src/pages/about/index.astro`
- `app/src/components/layout/BaseLayout.astro`

## Scope

1. Create publication policy documentation.
2. Add a compact public Method page at `/method/`.
3. Link Method from navigation, footer, About, and homepage source-transparency copy.
4. Repair the NOAA ENSO signal against the current official source.
5. Add sitewide metadata basics.
6. Keep all records out of `Published`.

## Decisions

### Source Transparency Surface

Decision:

Create a dedicated `/method/` page for publication policy and source transparency.

Rationale:

About should explain what FTFN is. Method should explain how FTFN works, how it treats sources, and what has to happen before a record becomes public intelligence.

### NOAA ENSO Signal

Decision:

Repair the NOAA ENSO signal rather than exclude it from launch candidates.

Rationale:

The current NOAA CPC source is clear, official, and dated 11 June 2026. Updating the signal keeps the climate pillar alive for launch review while preserving regional caveats.

## Implementation Notes

Added:

- `docs/publication-policy.md`
- `docs/work-packages/phase-34-publication-policy-and-launch-readiness-surfaces.md`
- `/method/` public page

Updated:

- Base layout metadata and navigation,
- About page,
- homepage source-transparency link,
- NOAA ENSO signal,
- NOAA ENSO source notes.

No records were promoted to `Published`.

## Acceptance Criteria

- Phase 34 work package exists.
- Publication policy exists.
- Public Method page exists.
- Source transparency surface decision is documented.
- NOAA ENSO signal is repaired or explicitly excluded from launch candidates.
- Site metadata basics are improved without dependencies.
- No records are promoted to `Published`.
- No dependencies, automation, ingestion, scoring, graph libraries, or database work are added.
- `npm run validate:content` passes.
- `npm run check` passes.
- `npm run build` passes.
- The roadmap identifies the next phase.

## Validation Results

```text
npm run validate:content: passed
npm run check: 0 errors, 0 warnings, 0 hints
npm run build: 97 pages generated
```

Preview:

```text
http://127.0.0.1:4321/method/
status: 200
title: Method and Publication Policy | FTFN
```

## Next Phase Candidate

Phase 35 should perform final launch-candidate copy and citation review.

Recommended focus:

- review the six launch-candidate signals after the ENSO repair,
- check source cards and citation display for each,
- decide whether any records can move to `Published`,
- if still prelaunch, keep them `In Review` and document blockers,
- run mobile/accessibility QA on Method, signal detail, source detail, and homepage.
