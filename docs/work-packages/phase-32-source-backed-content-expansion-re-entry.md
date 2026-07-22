# Phase 32 Work Package: Source-Backed Content Expansion Re-Entry

## Goal

Resume source-backed content growth after the dependency-map reader-journey gate, focusing on underdeveloped pillars with strong official source support.

This phase adds a small official-source-backed batch. It does not create a third dependency map, add scoring, start automation, start ingestion, add dependencies, migrate to a database, or promote records to `Published`.

## Generated Prompt

```text
Start Phase 32 for FTFN.

Read:
- README.md
- docs/session-brief.md
- docs/master-roadmap.md
- docs/decision-log.md
- docs/content-expansion-plan.md
- docs/source-strategy.md
- docs/editorial-method.md
- docs/review-checklists.md
- docs/work-packages/phase-31-dependency-map-reader-journey-qa-and-third-map-decision-gate.md
- app/package.json
- app/src/content.config.ts
- app/src/content/sources/
- app/src/content/signals/
- app/src/content/topics/
- app/src/content/organizations/
- app/src/content/technologies/

Phase 32 goal:
Resume source-backed content expansion now that dependency-map expansion is paused.

Implementation scope:
1. Create docs/work-packages/phase-32-source-backed-content-expansion-re-entry.md.
2. Run npm run validate:content before content changes.
3. Select a small batch from underdeveloped pillars by source strength, not topic coverage pressure.
4. Prioritize official or primary source records before dependent signals or entities.
5. Add or repair signals, topics, organizations, or technologies only where source support is clear.
6. Repair remaining Draft Sample records only where strong source evidence supports a cautious claim.
7. Leave company-claim records in Draft Sample unless official, regulatory, local, or independent evidence supports review.
8. Do not create a third dependency map.
9. Do not add dependencies, graph libraries, scoring, automation, ingestion, or a database.
10. Do not promote records to Published.
11. Run npm run validate:content.
12. Run npm run check.
13. Run npm run build.
14. Update README.md, docs/master-roadmap.md, docs/decision-log.md, docs/content-expansion-plan.md, docs/session-brief.md, and this work package.

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
- `docs/source-strategy.md`
- `docs/editorial-method.md`
- `docs/review-checklists.md`
- `docs/work-packages/phase-31-dependency-map-reader-journey-qa-and-third-map-decision-gate.md`
- `app/package.json`
- `app/src/content.config.ts`
- `app/src/content/sources/`
- `app/src/content/signals/`
- `app/src/content/topics/`
- `app/src/content/organizations/`
- `app/src/content/technologies/`

## Scope

1. Add official source anchors for underdeveloped pillars.
2. Add missing topic records only where sources support them.
3. Add organization records only where they improve Atlas navigation.
4. Repair draft signals only where source support is clear.
5. Keep company-claim records below review until corroborated.
6. Keep dependency-map expansion paused.
7. Promote no records to `Published`.

## Batch Selection

Selected pillars:

- Space,
- Agriculture and Bioeconomy,
- AI for Science,
- Advanced Manufacturing.

Why these pillars:

- They were named in the original project scope but had thinner Atlas support than energy, water, chips, quantum, and local systems.
- NASA Artemis and USDA NIFA plant genomics already existed as source anchors, but their signals remained draft samples.
- DOE Office of Science, NIST Materials Genome Initiative, and NIST Office of Advanced Manufacturing provide official source support for AI for Science and Advanced Manufacturing.
- These records widen the platform without creating unsupported local conclusions.

## Source Checks

Official pages checked on 2026-06-13:

- NASA Artemis,
- USDA NIFA Plant Breeding, Genetics and Genomics Programs,
- DOE Office of Science,
- NIST Materials Genome Initiative,
- NIST Office of Advanced Manufacturing.

Source posture:

- all new source records are Tier 1 official government sources,
- all are source anchors rather than publication-ready claims,
- each source includes limitations that require specific program, project, dataset, funding, mission, or output evidence before stronger claims.

## Content Changes

Added source records:

- `source-doe-office-science`,
- `source-nist-materials-genome-initiative`,
- `source-nist-office-advanced-manufacturing`.

Added topic records:

- `topic-space`,
- `topic-agriculture-and-bioeconomy`,
- `topic-ai-for-science`,
- `topic-advanced-manufacturing`.

Added organization records:

- `org-nasa`,
- `org-usda-nifa`.

Updated existing records:

- refreshed `source-nasa-artemis` checked date,
- refreshed `source-usda-nifa-plant-genomics` checked date,
- expanded `org-nist` to include Materials Genome Initiative and Office of Advanced Manufacturing source anchors,
- expanded `org-us-department-energy` to include DOE Office of Science,
- repaired `signal-sample-006` into an `In Review` NASA Artemis general-context signal,
- repaired `signal-sample-008` into an `In Review` USDA plant genomics general-context signal.

Deferred:

- `signal-sample-010` remains `Draft Sample` because it is still a company-claim eVTOL demonstration record and needs FAA, local, customer, airport, or independent operational evidence before review.

## Editorial Boundary

The repaired NASA and USDA signals are not publication-ready reports.

They support general-context claims:

- Artemis is a lunar exploration and Moon-to-Mars infrastructure stack.
- Plant genomics is a biology, data, breeding, and adoption stack.

They do not prove:

- specific mission readiness,
- supplier readiness,
- lander or surface-system schedule confidence,
- crop-specific resilience,
- field-trial success,
- commercialization,
- local agricultural outcomes.

## Dependency-Map Gate

No third dependency map was created.

The new records may support future map candidates, especially:

- Artemis mission cadence and lunar infrastructure,
- agriculture genomics and local climate adaptation,
- AI for Science and materials discovery,
- advanced manufacturing as a conversion layer.

Those candidates should wait until the content base includes stronger record IDs, evidence limits, and next-record needs.

## Acceptance Criteria

- Phase 32 work package exists.
- A small source-backed batch is selected by source strength.
- Official or primary source records are added before dependent claims.
- Missing topic pillars are added only where source support is clear.
- Draft samples are repaired only where strong source evidence supports cautious claims.
- Company-claim records remain below review unless corroborated.
- No third dependency map is created.
- No dependencies, graph libraries, scoring, automation, ingestion, or database layer are added.
- No records are promoted to `Published`.
- `npm run validate:content` passes.
- `npm run check` passes.
- `npm run build` passes.
- The roadmap identifies the next phase.

## Validation Results

```text
npm run validate:content: passed
npm run check: 0 errors, 0 warnings, 0 hints
npm run build: 96 pages generated
```

## Next Phase Candidate

Phase 33 should move from content expansion into publication-readiness triage.

Recommended focus:

- audit `In Review` signals for publication readiness,
- recheck source URLs and checked dates for a small launch candidate set,
- identify which records should remain `In Review`, become `Needs Follow-Up`, or stay draft,
- triage the remaining Joby/eVTOL company-claim sample without promoting it,
- define the minimum public launch set for `ftfn.io`.
