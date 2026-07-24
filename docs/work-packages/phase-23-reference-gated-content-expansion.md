# Phase 23 Work Package: Reference-Gated Content Expansion

## Goal

Resume content expansion only after the Phase 22 reference-integrity gate passes.

This phase adds a small source-backed technology batch to strengthen the Atlas without creating new event claims, unsupported local conclusions, or publication promotions.

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
- `docs/evidence-gap-register.md`
- `docs/work-packages/phase-22-reference-integrity-and-editorial-qa.md`
- `app/package.json`
- `app/src/content.config.ts`
- `app/src/content/`

## Scope

1. Run `npm run validate:content` before selecting records.
2. Add a small third content batch only where source support is strong.
3. Prioritize technology reference records that improve Atlas coverage.
4. Add only source records needed to support the batch.
5. Keep company claims clearly separated from official evidence.
6. Do not create new signals unless a specific official source event supports them.
7. Do not promote any records to `Published`.
8. Do not add dependencies, ingestion, automation, or a database.
9. Run `npm run validate:content`, `npm run check`, and `npm run build`.
10. Update README, roadmap, decision log, session brief, content expansion plan, and this work package.

## Preflight

The Phase 22 gate was run before content selection.

```text
npm run validate:content: passed
```

## Content Batch

Added source:

- `source-doe-office-electricity-energy-storage`

Added organization:

- `org-us-department-energy`

Added technology records:

- `technology-post-quantum-cryptography`
- `technology-evtol-aircraft`
- `technology-grid-scale-energy-storage`
- `technology-advanced-semiconductor-packaging`

Refreshed official source checked dates:

- `source-nist-pqc`
- `source-faa-aam`
- `source-nist-chips`

Updated topic records:

- `topic-energy` now includes DOE Office of Electricity Energy Storage as a featured source.

## Source Choices

Official source anchors used in this phase:

- NIST Post-Quantum Cryptography Project for post-quantum cryptography.
- FAA Advanced Air Mobility for eVTOL and advanced air mobility.
- NIST CHIPS for America for semiconductor manufacturing and advanced packaging context.
- DOE Office of Electricity Energy Storage for grid-scale and long-duration storage context.

## Editorial Boundary

The Phase 23 batch is a reference-record batch, not a publication batch. It adds source-backed technology anchors so future signals, dependency maps, and briefings have better Atlas context.

No new signal claims were created. No evidence gaps were marked `Resolved`. No records were promoted to `Published`.

## Acceptance Criteria

- Phase 23 work package exists.
- Preflight `npm run validate:content` passes before content selection.
- A small source-backed content batch exists.
- New technology records validate and have source IDs.
- Any new source or organization records validate.
- No unsupported local conclusions are added.
- No company claims are elevated into official evidence.
- No records are promoted to `Published`.
- `npm run validate:content` passes after content changes.
- `npm run check` passes.
- `npm run build` passes.
- The roadmap identifies the next phase.

## Validation Results

```text
npm run validate:content: passed
npm run check: 0 errors, 0 warnings, 0 hints
npm run build: 84 pages generated
```

## Next Phase Candidate

Phase 24 should harden the Technology Atlas now that more technology records exist.

Recommended focus:

- improve technology index/detail pages if the new records reveal missing modules,
- add deterministic technology-to-signal links where source IDs or topic matches support them,
- add relationship guardrails so technology profiles remain reference pages, not hype pages,
- keep dependency mapping qualitative until enough records exist for a stronger data model.
