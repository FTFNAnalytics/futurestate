# Phase 09 Work Package: Editorial Readiness and Content Expansion

## Objective

Move FTFN from a working route scaffold into editorial readiness for `ftfn.io` by defining how records become publishable, how sources are treated, and which content should be expanded first.

Phase 09 is about operating discipline. The site has routes and seed records; now the project needs publication rules before it grows.

## Inputs

- [README](../../README.md)
- [Documentation Map](../documentation-map.md)
- [Master Roadmap](../master-roadmap.md)
- [Decision Log](../decision-log.md)
- [Taxonomy](../taxonomy.md)
- [Content Model](../content-model.md)
- [Source Strategy](../source-strategy.md)
- [Information Architecture](../information-architecture.md)
- [Content Scaffold Plan](../content-scaffold-plan.md)
- [Phase 08 Work Package](phase-08-atlas-completion-and-entity-routes.md)
- `app/src/content.config.ts`
- current source, signal, topic, organization, technology, local-system, and briefing seed records

## Deliverables

- [x] [Editorial Method](../editorial-method.md)
- [x] [Review Checklists](../review-checklists.md)
- [x] [Content Expansion Plan](../content-expansion-plan.md)
- [x] Public About page expansion for editorial method and source transparency
- [x] README update
- [x] Master roadmap update
- [x] Decision log update

## Implementation Checklist

- [x] Define the FTFN editorial method.
- [x] Define the source transparency posture for `ftfn.io`.
- [x] Create review checklists for signals, sources, topics, organizations, technologies, local systems, and briefings.
- [x] Define publishability criteria for `Draft Sample`, `Draft`, `In Review`, `Published`, `Needs Update`, and `Archived`.
- [x] Define minimum evidence requirements for published signals.
- [x] Define how to treat company claims, government data, research findings, credible reporting, and speculative claims.
- [x] Identify which current seed records are closest to publishable.
- [x] Identify which current seed records need more work.
- [x] Create the first content expansion plan.
- [x] Recommend the first 20-30 records to create next.
- [x] Avoid automation, ingestion, and dependency additions.
- [x] Run `npm run check` if app files changed.
- [x] Run `npm run build` if app files changed.

## Seed Readiness Summary

Closest to publication after review:

- ENSO outlook signal
- USGS mineral commodity signal
- CHIPS program signal
- FAA advanced air mobility signal
- NHTSA automated vehicle safety signal
- NIST post-quantum cryptography signal

Needs more specificity or supporting evidence:

- Artemis signal
- plant genomics signal
- AI electricity demand signal
- Joby eVTOL company-claim signal

Not yet public-ready:

- local system profiles with no local source IDs,
- briefing sample built from unreviewed sample signals,
- technology records with no source IDs.

## Acceptance Criteria

- Editorial method is documented.
- Source transparency posture is documented.
- Review checklists exist.
- Publishability criteria are clear.
- First content expansion plan exists.
- Current seed records are assessed.
- No unsupported source claims are elevated.
- Roadmap identifies the next phase.

## Open Questions

- Should FTFN expose record status labels on public pages before launch?
- Should source credibility tier be visible on every signal page or only on source profiles?
- Should the first public launch include only `Published` records, or can `In Review` records be visible in a clearly labeled preview?
- Should the About page become a dedicated Method page before launch?

## Recommended Next Phase

Phase 10 should create the first reviewed content batch. It should promote or repair a small number of high-quality seed signals, add the missing source records that make them reviewable, and keep all new content small enough to inspect manually.

Suggested title:

```text
Phase 10: First Reviewed Content Batch
```

## Validation Results

```text
npm run check: 0 errors, 0 warnings, 0 hints
npm run build: 38 pages generated
```
