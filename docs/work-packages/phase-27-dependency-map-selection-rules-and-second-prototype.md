# Phase 27 Work Package: Dependency-Map Selection Rules and Second Prototype

## Goal

Define dependency-map selection rules and create one second qualitative dependency-map prototype only if existing records support it.

This phase expands dependency maps carefully without adding graph libraries, numeric scoring, automation, ingestion, or unsupported relationship inference.

## Generated Prompt

```text
Start Phase 27 for FTFN.

Read:
- README.md
- docs/session-brief.md
- docs/master-roadmap.md
- docs/decision-log.md
- docs/dependency-map-format.md
- docs/content-model.md
- docs/review-checklists.md
- docs/content-expansion-plan.md
- docs/work-packages/phase-26-dependency-map-backlinks-and-reader-journey-integration.md
- app/package.json
- app/src/content.config.ts
- app/src/content/dependency-maps/
- app/src/content/signals/
- app/src/content/sources/
- app/src/content/technologies/
- app/src/content/topics/
- app/src/content/evidence-gaps/

Phase 27 goal:
Define dependency-map selection rules, choose one second map candidate from current records, and create the second map only if explicit existing records support it.

Implementation scope:
1. Create docs/work-packages/phase-27-dependency-map-selection-rules-and-second-prototype.md.
2. Run npm run validate:content before content changes.
3. Add dependency-map selection rules to docs/dependency-map-format.md.
4. Review current records and choose one second map candidate.
5. Document why the chosen map deserves to exist.
6. Create the second dependency-map JSON record only if current records support the relationships.
7. Use explicit source, signal, technology, topic, local-system, or evidence-gap IDs only.
8. Keep the map qualitative and evidence-aware.
9. Do not add graph libraries, scoring, automation, ingestion, or a database.
10. Do not create new source, signal, technology, topic, local-system, or evidence-gap records.
11. Do not promote any records to Published.
12. Run npm run validate:content.
13. Run npm run check.
14. Run npm run build.
15. Smoke check the new dependency-map route and at least two backlink pages.
16. Update README.md, docs/master-roadmap.md, docs/decision-log.md, docs/dependency-map-format.md, docs/content-expansion-plan.md, docs/session-brief.md, and this work package.

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
- `docs/dependency-map-format.md`
- `docs/content-model.md`
- `docs/review-checklists.md`
- `docs/content-expansion-plan.md`
- `docs/work-packages/phase-26-dependency-map-backlinks-and-reader-journey-integration.md`
- `app/package.json`
- `app/src/content.config.ts`
- `app/src/content/dependency-maps/`
- `app/src/content/signals/`
- `app/src/content/sources/`
- `app/src/content/technologies/`
- `app/src/content/topics/`
- `app/src/content/evidence-gaps/`

## Scope

1. Define map selection rules.
2. Choose one second map candidate from current records.
3. Create the map only if existing records support it.
4. Avoid new records outside the dependency-map collection.
5. Keep the map qualitative.
6. Promote no records to `Published`.

## Selection Rules Added

A new dependency map should exist only when it:

- has a map question that cannot be answered well by a single record,
- uses at least three existing records across at least three record types,
- names a dependency, constraint, or conversion problem,
- states what it does not prove,
- links to records through explicit IDs,
- adds a reader journey that existing pages do not already provide,
- names actionable next records needed.

## Candidate Decision

Chosen candidate:

```text
Post-quantum standards are not migration
```

Why this map deserves to exist:

- It uses a reviewed signal, a technology profile, a Tier 1 standards source, a topic record, and a structured evidence gap.
- It clarifies an important distinction: standards progress is not the same as operational migration.
- It creates a useful journey between Quantum, post-quantum cryptography, NIST PQC, and the migration evidence gap.
- It shows a technology-readiness map that is not centered on local systems, broad infrastructure, or numeric scores.

What it does not prove:

- institution-level migration completion,
- vendor readiness,
- procurement compliance,
- cryptographic inventory completeness,
- critical-infrastructure execution,
- a 42/59 score.

## App Content Changes

Added:

```text
app/src/content/dependency-maps/post-quantum-standards-are-not-migration.json
```

No source, signal, technology, topic, local-system, briefing, or evidence-gap records were added.

## Acceptance Criteria

- Phase 27 work package exists.
- Dependency-map selection rules are documented.
- One second map candidate is selected from current records.
- The candidate rationale and evidence limits are documented.
- The second map uses explicit current record IDs only.
- No relationship is inferred from prose.
- No new records outside dependency maps are added.
- No graph libraries, scoring, automation, ingestion, or database work is added.
- No records are promoted to `Published`.
- `npm run validate:content` passes.
- `npm run check` passes.
- `npm run build` passes.
- Smoke checks confirm the new map route and related backlink pages render.
- The roadmap identifies the next phase.

## Validation Results

```text
npm run validate:content: passed
npm run check: 0 errors, 0 warnings, 0 hints
npm run build: 87 pages generated
```

## Smoke Check

The local dev server at `http://127.0.0.1:4321/` was reachable.

Checked pages:

- `/atlas/dependency-maps/post-quantum-standards-are-not-migration/`
- `/signals/nist-pqc-standards-quantum-risk-migration-work/`
- `/atlas/technologies/post-quantum-cryptography/`
- `/atlas/evidence-gaps/gap-009-post-quantum-migration-evidence/`
- `/atlas/topics/quantum/`
- `/atlas/sources/source-nist-pqc/`
- `/atlas/dependency-maps/`

Confirmed the served HTML includes the new dependency map route, the map index card, and expected backlinks on related signal, technology, evidence gap, topic, and source pages.

## Next Phase Candidate

Phase 28 should harden the dependency-map Atlas now that multiple maps exist.

Recommended focus:

- add lightweight filtering or grouping to `/atlas/dependency-maps/`,
- show map counts by type, topic, and status,
- add a short public selection-rule note,
- keep the surface dependency-free and qualitative,
- avoid creating more maps until the map index is easy to scan.
