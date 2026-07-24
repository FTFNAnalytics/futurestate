# Phase 21 Work Package: Evidence Gap Data Scaffold and Research Queue

## Goal

Turn the evidence gap register into a structured content layer while keeping the Markdown register as the editorial control document.

This phase makes evidence gaps navigable and referenceable in the app. It does not resolve the gaps or start automation.

## Source Of Truth

Read before continuing:

- `README.md`
- `docs/session-brief.md`
- `docs/master-roadmap.md`
- `docs/evidence-gap-register.md`
- `docs/content-model.md`
- `docs/work-packages/phase-20-evidence-gap-linking-and-claim-scope-metadata.md`
- `app/src/content.config.ts`
- `app/src/content/signals/`
- `app/src/content/local-systems/`
- `app/src/content/briefings/`

## Scope

1. Decide whether evidence gaps should become a structured content collection.
2. Add an `evidenceGaps` Astro content collection.
3. Seed structured records for `gap-001` through `gap-010`.
4. Add a lightweight Atlas evidence-gap index.
5. Add generated evidence-gap detail pages.
6. Link signal, local system, and briefing detail pages to evidence-gap records.
7. Update docs and roadmap.
8. Do not add dependencies, ingestion, automation, or a database.
9. Do not promote any records to `Published`.

## Decision

Evidence gaps should become a structured app collection because Phase 20 made signals, local systems, and briefings reference them directly. The Markdown register remains useful as the editorial narrative and operating guide, but the app needs structured gap records for validation, navigation, and future research queues.

## Implemented

Added collection:

```text
app/src/content/evidence-gaps/
```

Added records:

- `gap-001`
- `gap-002`
- `gap-003`
- `gap-004`
- `gap-005`
- `gap-006`
- `gap-007`
- `gap-008`
- `gap-009`
- `gap-010`

Added routes:

- `/atlas/evidence-gaps/`
- `/atlas/evidence-gaps/[slug]/`

Updated routes:

- `/atlas/`
- `/signals/[slug]/`
- `/atlas/local-systems/[slug]/`
- `/briefings/[slug]/`

## Relationship Rule

Evidence-gap relationships can come from:

- `evidence_gap_ids` on signals, local systems, and briefings,
- related IDs stored on the evidence gap record,
- explicit source IDs on the evidence gap record.

Do not infer a relationship from prose alone.

## Acceptance Criteria

- Phase 21 work package exists.
- `evidenceGaps` content collection exists.
- Ten structured evidence-gap records exist.
- Evidence-gap index route exists.
- Evidence-gap detail routes exist.
- Signals, local systems, and briefings link to evidence-gap records.
- Atlas landing page includes evidence gaps.
- No evidence gap is marked `Resolved`.
- No records are promoted to `Published`.
- `npm run check` passes.
- `npm run build` passes.
- The roadmap identifies the next phase.

## Validation Results

```text
npm run check: 0 errors, 0 warnings, 0 hints
npm run build: 78 pages generated
```

## Next Phase Candidate

Phase 22 should create a reference-integrity and editorial QA gate.

Recommended focus:

- add a lightweight content validation script,
- verify `source_ids`, `evidence_gap_ids`, `signal_ids`, and local system references,
- add an npm script for content validation,
- document the validation gate before broad content expansion resumes.
