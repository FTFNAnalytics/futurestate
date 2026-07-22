# Phase 37 Work Package: Source Authority and Freshness Monitor

## Objective

Move FTFN toward becoming an authoritative, self-updating reference resource by adding a generated source freshness monitor.

This phase adapts the next roadmap step toward the user's current priority: content authority, evidence freshness, and a path toward self-updating source-aware surfaces. It does not deploy, automate ingestion, change DNS, add analytics, or publish new records.

## Generated Prompt

```text
Start Phase 37 for FTFN.

Goal:
Build toward an authoritative, self-updating primary resource by making source freshness, authority, update cadence, and review priority visible from the current content library.

Implementation scope:
1. Add a generated source monitor to the Atlas.
2. Classify source records as Current, Watch soon, or Review due from existing source metadata.
3. Link the monitor from Atlas, Sources, Method, and sitemap.
4. Keep the boundary clear: generated freshness is not automated publishing.
5. Preserve publication gates and do not promote any records to Published.
6. Document the source-monitoring strategy and update project handoff docs.
7. Run npm run validate:content, npm run check, and npm run build.

Preserve:
- FTFN public brand,
- ftfn.io domain direction,
- 42/59 framing,
- "Civilization is a choice,"
- the thesis: "The future is not a list of inventions. It is a stack of dependencies."
```

## Deliverables

- `app/src/lib/sourceFreshness.ts`
- `app/src/pages/atlas/source-monitor/index.astro`
- Atlas source-monitor entry point
- Source Atlas freshness labels
- Source profile freshness labels
- Method page explanation of the source-monitoring boundary
- Sitemap entry for `/atlas/source-monitor/`
- `docs/source-monitoring-plan.md`
- updated roadmap and handoff docs

## Checklist

- [x] Confirm Phase 36 as the latest completed phase.
- [x] Reinterpret Phase 37 around source authority and self-updating direction.
- [x] Add source freshness rules.
- [x] Add generated source monitor route.
- [x] Link monitor from Atlas.
- [x] Link monitor from Sources.
- [x] Add freshness labels to source profiles.
- [x] Link monitor from Method.
- [x] Add monitor to sitemap.
- [x] Document the source-monitoring plan.
- [x] Keep automated ingestion, automated publishing, DNS, deploy, analytics, scoring, CMS, and database work out of scope.
- [x] Run `npm run validate:content`.
- [x] Run `npm run check`.
- [x] Run `npm run build`.

## Decisions

### Source Monitor Before Ingestion

Decision:

Add a generated source monitor before building any ingestion or automation workflow.

Rationale:

FTFN's credibility depends on source currency, source authority, and clear evidence limits. A monitor generated from existing source records gives the project a self-updating review queue on every build, while preserving human review before any public claim changes.

### Freshness Labels

Decision:

Use simple qualitative freshness labels:

```text
Current
Watch soon
Review due
```

Rationale:

The source library is still small. Qualitative labels are more honest than numeric scores and easier to revise as source cadence rules mature.

### Public Boundary

Decision:

Make the monitor public, but state clearly that it is not automated publishing.

Rationale:

Source transparency is part of FTFN's public value. A reader should be able to see which source records are actively maintained and which need rechecking before supporting new claims.

## Acceptance Criteria

- `/atlas/source-monitor/` exists and builds.
- The source monitor groups sources by generated freshness state.
- The monitor shows checked dates, update cadence, review window, age, authority, priority, and related signal counts.
- Atlas, Sources, and Method link to the monitor.
- Source detail pages show freshness status.
- Sitemap includes `/atlas/source-monitor/`.
- Validation, check, and build pass.
- No records are promoted to `Published`.
- No automated ingestion or publishing path is added.

## Validation Results

Commands run from `app/`:

```text
npm.cmd run validate:content
npm.cmd run check
npm.cmd run build
```

Results:

```text
validate:content: passed
check: 0 errors, 0 warnings, 0 hints
build: passed, 98 pages generated
```

## Open Questions

- Should future source records include an explicit `review_cadence_days` field instead of deriving cadence from text?
- Should watch lanes become a first-class schema field on sources and signals?
- Should Phase 38 add missing topic records for `Cybersecurity` and `Discovery Technologies`?
- Should the next content batch add NERC, FERC, regional grid operator, utility filing, and local provider sources before repairing Power Watch signals?
- Should a future script check source URLs and output a local report without modifying content records?

## Next Phase

The next phase should use the source monitor to guide a focused source-backed content expansion:

- add missing high-authority sources for Power Watch, Compute and Chips Watch, Water Watch, Mobility Certification Watch, Security and Standards Watch, and Local Systems Watch,
- add missing topic records for active taxonomy pillars,
- repair existing broad `In Review` signals into narrower dated records,
- keep publication promotion separate from content expansion.
