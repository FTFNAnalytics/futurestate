# Phase 30 Work Package: Dependency-Map Detail Readability and Selection-Rule Audit

## Goal

Audit the current dependency maps against the Phase 27 selection rules and improve dependency-map detail page readability now that maps are easier to reach.

This phase keeps dependency maps qualitative, static, and evidence-aware. It creates no new maps, records, scoring systems, graph libraries, automation, ingestion, or database layer.

## Generated Prompt

```text
Start Phase 30 for FTFN.

Read:
- README.md
- docs/session-brief.md
- docs/master-roadmap.md
- docs/decision-log.md
- docs/content-expansion-plan.md
- docs/dependency-map-format.md
- docs/information-architecture.md
- docs/work-packages/phase-29-dependency-map-homepage-and-atlas-landing-integration.md
- app/package.json
- app/src/content.config.ts
- app/src/pages/atlas/dependency-maps/[slug].astro
- app/src/pages/atlas/dependency-maps/index.astro
- app/src/content/dependency-maps/

Phase 30 goal:
Audit and polish dependency-map detail pages now that maps are easier to reach.

Implementation scope:
1. Create docs/work-packages/phase-30-dependency-map-detail-readability-and-selection-rule-audit.md.
2. Run npm run validate:content before app changes.
3. Audit both current dependency maps against the Phase 27 selection rules.
4. Improve dependency-map detail page readability if needed.
5. Add static relationship summaries or map statistics only if they clarify evidence boundaries.
6. Use existing dependency-map records only.
7. Do not create additional dependency maps.
8. Do not add graph libraries, scoring, automation, ingestion, or a database.
9. Do not promote any records to Published.
10. Run npm run validate:content.
11. Run npm run check.
12. Run npm run build.
13. Preview both dependency-map detail pages if practical.
14. Update README.md, docs/master-roadmap.md, docs/decision-log.md, docs/content-expansion-plan.md, docs/dependency-map-format.md, docs/information-architecture.md, docs/session-brief.md, and this work package.

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
- `docs/dependency-map-format.md`
- `docs/information-architecture.md`
- `docs/work-packages/phase-29-dependency-map-homepage-and-atlas-landing-integration.md`
- `app/package.json`
- `app/src/content.config.ts`
- `app/src/pages/atlas/dependency-maps/[slug].astro`
- `app/src/pages/atlas/dependency-maps/index.astro`
- `app/src/content/dependency-maps/`

## Scope

1. Audit both current maps.
2. Improve map detail readability.
3. Keep detail improvements static.
4. Create no new content records.
5. Add no dependencies.
6. Promote no records to `Published`.

## Selection-Rule Audit

### Local constraints are where the future arrives

Audit result: passes the Phase 27 selection rules.

Why it qualifies:

- Clear question: it asks how compute and chip signals become local outcomes through receiving-system constraints.
- Multiple record types: it links sources, signals, technologies, local systems, and evidence gaps.
- Real dependency or conversion problem: it centers power, water, housing, permits, and local-system conversion.
- Evidence boundary: it says the map does not prove local readiness, project viability, facility capacity, or completed outcomes.
- Explicit IDs: relationships are tied to existing record IDs.
- Reader journey: it connects signals, local systems, technologies, and evidence gaps that would otherwise sit on separate pages.
- Next records: it names utility filings, provider water records, municipal servicing evidence, and starts/completions evidence.

Current structure:

- 8 nodes,
- 6 links,
- 8 record nodes,
- 0 concept-only nodes,
- 5 linked record types,
- confidence mix: 2 `Partial`, 3 `Missing Evidence`, 1 `Watch`.

### Post-quantum standards are not migration

Audit result: passes the Phase 27 selection rules.

Why it qualifies:

- Clear question: it asks how standards become operational migration work.
- Multiple record types: it links a standards source, a signal, a technology, a topic node, and an evidence gap.
- Real dependency or conversion problem: it separates standards progress from institution-level migration evidence.
- Evidence boundary: it says the map does not prove institution, vendor, sector, or local-system migration completion.
- Explicit IDs: source, signal, technology, topic, and evidence-gap nodes point to existing records.
- Reader journey: it connects the Quantum topic, NIST PQC, a security signal, the PQC technology record, and a migration evidence gap.
- Next records: it names sector guidance, procurement evidence, vendor readiness, and institution-level implementation plans.

Current structure:

- 7 nodes,
- 6 links,
- 5 record nodes,
- 2 concept-only nodes,
- 4 linked record types plus a topic node,
- confidence mix: 4 `Supported`, 1 `Partial`, 1 `Missing Evidence`.

## App Changes

Updated:

```text
app/src/pages/atlas/dependency-maps/[slug].astro
```

The dependency-map detail page now includes:

- a static map-structure metric strip,
- node count,
- link count,
- record-node count,
- concept-node count,
- a selection-rule check card,
- linked record type counts,
- confidence mix counts.

These additions appear before the full node and relationship sections so readers can understand map posture before reading every link.

## Boundary

The new detail-page summary is not a score. It does not rank maps, resolve evidence gaps, infer relationships, or promote records. It only makes the existing map structure easier to inspect.

## Acceptance Criteria

- Phase 30 work package exists.
- Both current maps are audited against Phase 27 selection rules.
- Dependency-map detail pages are easier to scan.
- Static relationship summaries or map statistics clarify evidence boundaries.
- No additional maps or content records are created.
- No graph libraries, scoring, automation, ingestion, or database work is added.
- No records are promoted to `Published`.
- `npm run validate:content` passes.
- `npm run check` passes.
- `npm run build` passes.
- Both dependency-map detail pages are previewed if practical.
- The roadmap identifies the next phase.

## Validation Results

```text
npm run validate:content: passed
npm run check: 0 errors, 0 warnings, 0 hints
npm run build: 87 pages generated
```

## Preview Check

Checked the local app at:

```text
http://127.0.0.1:4321/atlas/dependency-maps/local-constraints-where-the-future-arrives/
http://127.0.0.1:4321/atlas/dependency-maps/post-quantum-standards-are-not-migration/
```

Confirmed both detail pages include:

- `Map Structure`,
- `Selection Rule Check`,
- `Linked Record Types`,
- `Confidence Mix`,
- `Qualitative only`.

## Next Phase Candidate

Phase 31 should test the full dependency-map reader journey before deciding whether to create a third map.

Recommended focus:

- follow the reader path from homepage to Atlas landing to dependency-map index to both map detail pages,
- confirm related record backlinks still make sense,
- decide whether the next map should be created or whether map work should pause for broader content expansion,
- do not create a third map unless the selection rules clearly support it,
- keep maps qualitative and dependency-free.
