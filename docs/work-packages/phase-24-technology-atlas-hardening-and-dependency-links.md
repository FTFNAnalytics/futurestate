# Phase 24 Work Package: Technology Atlas Hardening and Dependency Links

## Goal

Harden the Technology Atlas now that Phase 23 added multiple source-backed technology records.

This phase improves how technology profiles explain dependencies, constraints, source support, and related signals without implying deployment readiness.

## Generated Prompt

```text
Start Phase 24 for FTFN.

Read:
- README.md
- docs/session-brief.md
- docs/master-roadmap.md
- docs/decision-log.md
- docs/content-model.md
- docs/source-strategy.md
- docs/review-checklists.md
- docs/content-expansion-plan.md
- docs/work-packages/phase-23-reference-gated-content-expansion.md
- app/package.json
- app/src/content.config.ts
- app/src/pages/atlas/technologies/index.astro
- app/src/pages/atlas/technologies/[slug].astro
- app/src/content/technologies/
- app/src/content/signals/
- app/src/content/sources/

Phase 24 goal:
Harden the Technology Atlas by improving technology index/detail pages, adding deterministic related-signal links, and documenting guardrails that prevent technology profiles from implying deployment readiness.

Implementation scope:
1. Create docs/work-packages/phase-24-technology-atlas-hardening-and-dependency-links.md.
2. Run npm run validate:content before app changes.
3. Improve the technology index with relationship counts and clear reference-page framing.
4. Improve technology detail pages with:
   - source support,
   - dependency and constraint framing,
   - related topics,
   - deterministic related signals,
   - explicit technology-profile guardrails.
5. Related signal links may use only:
   - shared source IDs,
   - or primary-topic overlap.
6. Label why each related signal appears.
7. Do not invent relationships from prose.
8. Do not add dependencies.
9. Do not add new source, signal, organization, technology, local-system, briefing, or evidence-gap records unless the work reveals a blocking reference issue.
10. Do not promote any records to Published.
11. Run npm run validate:content.
12. Run npm run check.
13. Run npm run build.
14. Update README.md, docs/master-roadmap.md, docs/decision-log.md, docs/content-expansion-plan.md, docs/review-checklists.md, docs/session-brief.md, and this work package.

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
- `docs/work-packages/phase-23-reference-gated-content-expansion.md`
- `app/package.json`
- `app/src/content.config.ts`
- `app/src/pages/atlas/technologies/index.astro`
- `app/src/pages/atlas/technologies/[slug].astro`
- `app/src/content/technologies/`
- `app/src/content/signals/`
- `app/src/content/sources/`

## Scope

1. Run `npm run validate:content` before app changes.
2. Improve the technology index with relationship counts and reference-page framing.
3. Improve technology detail pages with source support, dependencies, constraints, topics, related signals, and explicit guardrails.
4. Use only shared source IDs or primary-topic overlap for technology-to-signal links.
5. Label why each related signal appears.
6. Do not infer relationships from prose.
7. Do not add dependencies, ingestion, automation, or a database.
8. Do not add new records unless needed to repair a blocking reference issue.
9. Do not promote any records to `Published`.

## Relationship Rule

Technology-to-signal links can appear only when one of these is true:

- the technology and signal share at least one `source_id`,
- the signal `primary_topic` is included in the technology `primary_topics`.

If both are true, the UI should prefer the stronger source-overlap label.

## Acceptance Criteria

- Phase 24 work package exists.
- The generated prompt is captured in the work package.
- Technology index explains technology profiles as reference records.
- Technology index shows useful counts for source support and related signals.
- Technology detail pages show related signals with relationship labels.
- Technology detail pages include explicit guardrails about maturity and deployment readiness.
- No unsupported technology relationships are invented.
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
npm run build: 84 pages generated
```

## Smoke Check

The local dev server at `http://127.0.0.1:4321/` was reachable.

Checked pages:

- `/atlas/technologies/`
- `/atlas/technologies/post-quantum-cryptography/`

Confirmed the served HTML includes the new reference-record guardrails and related-signal section.

## Next Phase Candidate

Phase 25 should add a lightweight qualitative dependency-map format.

Recommended focus:

- define a reusable dependency-map model before adding graph visuals,
- decide whether dependency maps are standalone records or generated from technologies, signals, and evidence gaps,
- prototype one qualitative map using existing records only,
- avoid numeric scoring until the editorial basis is stronger.
