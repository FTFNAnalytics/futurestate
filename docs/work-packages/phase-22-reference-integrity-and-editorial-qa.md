# Phase 22 Work Package: Reference Integrity and Editorial QA

## Goal

Create a lightweight content QA gate so FTFN can catch broken cross-record references before broader content expansion resumes.

This phase strengthens the local-file content model. It does not add ingestion, automation, a database, or new public claims.

## Source Of Truth

Read before continuing:

- `README.md`
- `docs/session-brief.md`
- `docs/master-roadmap.md`
- `docs/decision-log.md`
- `docs/content-model.md`
- `docs/review-checklists.md`
- `docs/content-expansion-plan.md`
- `docs/evidence-gap-register.md`
- `docs/work-packages/phase-21-evidence-gap-data-scaffold-and-research-queue.md`
- `app/package.json`
- `app/src/content.config.ts`
- `app/src/content/`

## Scope

1. Add a dependency-free content reference validator.
2. Validate duplicate IDs and duplicate slugs within collections.
3. Validate source references from signals, topics, organizations, technologies, and local systems.
4. Validate evidence-gap references from signals, local systems, briefings, and evidence-gap records.
5. Validate briefing signal references.
6. Validate evidence-gap local-system references.
7. Validate published-record guardrails.
8. Add an npm script for the content validation gate.
9. Update documentation so the gate is part of the workflow.
10. Do not add dependencies, ingestion, automation, or a database.
11. Do not promote any records to `Published`.

## Implemented

Added script:

```text
app/scripts/validate-content-references.mjs
```

Added npm script:

```text
npm run validate:content
```

The validator checks:

- duplicate IDs,
- duplicate slugs,
- `source_ids`,
- topic `featured_sources`,
- `evidence_gap_ids`,
- briefing `signal_ids`,
- evidence-gap `related_source_ids`,
- evidence-gap `related_signal_ids`,
- evidence-gap `related_local_system_ids`,
- evidence-gap `local_system` names,
- published records without `published_date`,
- published signals with `verification_status: Unreviewed`,
- evidence gaps marked `Resolved` before manual review.

## Relationship Rule

The validator enforces explicit ID relationships only. It does not infer relationships from prose, and it does not treat free-text receiving-system phrases as hard references unless they are already represented through structured IDs.

## Acceptance Criteria

- Phase 22 work package exists.
- Content reference validator exists.
- `npm run validate:content` exists.
- Validator checks source, evidence-gap, signal, and local-system references.
- Validator passes on current content.
- `npm run check` passes.
- `npm run build` passes.
- No dependencies are added.
- No records are promoted to `Published`.
- The roadmap identifies the next phase.

## Validation Results

```text
npm run validate:content: passed
npm run check: 0 errors, 0 warnings, 0 hints
npm run build: 78 pages generated
```

## Next Phase Candidate

Phase 23 should resume small, reference-gated content expansion.

Recommended focus:

- create a third reviewed content batch only where the QA gate passes,
- prioritize records that address active evidence gaps,
- consider source-backed technology records for post-quantum cryptography, eVTOL, and grid-scale energy storage,
- keep publication promotion separate from content expansion until final public launch criteria are met.
