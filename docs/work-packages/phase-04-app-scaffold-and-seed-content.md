# Phase 04 Work Package: App Scaffold and Seed Content

This work package turns the FTFN documentation architecture into the first executable Astro scaffold.

## Objective

Create a small, reversible Astro + TypeScript app in `app/`, configure content collections and validation, convert Phase 02 sample records into seed content files, and add minimal generated page skeletons.

This phase does not complete the visual design or create a full public website.

## Inputs

Required context:

- [README](../../README.md)
- [Documentation Map](../documentation-map.md)
- [Master Roadmap](../master-roadmap.md)
- [Decision Log](../decision-log.md)
- [Taxonomy](../taxonomy.md)
- [Content Model](../content-model.md)
- [Information Architecture](../information-architecture.md)
- [Sample Records](../sample-records.md)
- [Technical Stack Decision](../technical-stack-decision.md)
- [Content Scaffold Plan](../content-scaffold-plan.md)
- [Phase 03 Work Package](phase-03-technical-stack-and-content-scaffold.md)

## Deliverables

- [x] Phase 04 work package
- [x] Astro app scaffold in `app/`
- [x] TypeScript configuration
- [x] Astro configuration with MDX integration
- [x] Content collection schemas in `app/src/content.config.ts`
- [x] Content directories for signals, sources, topics, organizations, technologies, local systems, and briefings
- [x] 10 source seed records as JSON
- [x] 3 topic seed records as JSON
- [x] 10 signal seed records as MDX
- [x] 2 local system seed records as MDX
- [x] Minimal organization and technology seed records
- [x] Minimal briefing seed record
- [x] Homepage skeleton
- [x] Signal index and signal detail skeletons
- [x] Topic index and topic detail skeletons
- [x] About page skeleton
- [x] Minimal global styles and design tokens
- [x] Updated README
- [x] Updated master roadmap
- [x] Updated decision log

## Checklist

### App Scaffold

- [x] Create `app/package.json`.
- [x] Create `app/astro.config.mjs`.
- [x] Create `app/tsconfig.json`.
- [x] Create `app/src/env.d.ts`.
- [x] Add MDX dependency configuration.
- [x] Keep the scaffold static-first.

### Content Collections

- [x] Define `signals`.
- [x] Define `sources`.
- [x] Define `topics`.
- [x] Define `organizations`.
- [x] Define `technologies`.
- [x] Define `localSystems`.
- [x] Define `briefings`.
- [x] Encode MVP taxonomy values as Zod enums.
- [x] Allow draft samples to use `published_date: null`.

### Seed Content

- [x] Convert first 10 source records into JSON files.
- [x] Convert first 3 topic records into JSON files.
- [x] Convert first 10 signal records into MDX files.
- [x] Convert first 2 local system profiles into MDX files.
- [x] Add one briefing placeholder to test the briefing schema.
- [x] Add minimal organization and technology records so those collections are not empty.

### Page Skeletons

- [x] Add homepage skeleton.
- [x] Add signal index.
- [x] Add signal detail route.
- [x] Add topic index.
- [x] Add topic detail route.
- [x] Add about page.
- [x] Use content collections instead of hard-coded sample data in pages.

### Styles

- [x] Add CSS design tokens.
- [x] Add minimal global layout styles.
- [x] Avoid final visual polish until the first build is verified.

## Acceptance Criteria

This phase is complete when:

- the `app/` directory contains a recognizable Astro project,
- content collections exist for the MVP record types,
- sample records have been converted into real seed files,
- generated page skeletons read from content collections,
- README and roadmap point to the app scaffold,
- the decision log records the Phase 04 implementation choices,
- dependency installation remains explicit and requires approval.

## Validation Notes

Dependencies were not installed during this phase because package installation requires approval. The next implementation step should install dependencies, run `npm run check`, and run `npm run build` from `app/`.

Local validation for this phase should include:

- JSON parse checks for seed records,
- file inventory checks,
- schema/build validation after dependencies are installed.

## Open Questions

- Should Phase 05 install dependencies and fix any real Astro schema issues before visual work begins?
- Should local system pages become public in the MVP or stay internal until stronger local sources exist?
- Should `Infrastructure` remain a general constraint tag or become a local-system-only constraint?
- Should source and local system index/detail pages be added before homepage visual design?
- Should MVP filtering start on the signal index or wait until more publishable records exist?

## Completion Notes

Status: first pass complete as of 2026-05-26.

The scaffold now exists, but it has not been dependency-installed or build-verified. The next phase should treat the first successful Astro build as the gate before deeper design or feature work.
