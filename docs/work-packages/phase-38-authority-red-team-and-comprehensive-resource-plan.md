# Phase 38 Work Package: Authority Red-Team and Comprehensive Resource Plan

## Objective

Run a skeptical authority review of the current FTFN site and create a concrete plan for expanding it into a comprehensive, content-led resource.

This phase responds to the strategic question:

```text
Where would the site not be considered authoritative, and how should the content library expand if content is the main value?
```

## Generated Prompt

```text
Run a red team on FTFN as built so far.

Goal:
Find where the site would not yet be considered authoritative, then build a plan to expand the content library into a comprehensive resource for readers seeking information on these topics.

Assessment scope:
1. Review the current content model, source library, source monitor, publication policy, signals, topics, local systems, evidence gaps, briefings, and roadmap.
2. Identify authority gaps, freshness gaps, missing topic coverage, weak source coverage, overbroad records, trust gaps, and self-updating limits.
3. Keep the recommendation content-first, not technology-first.
4. Preserve the publication gate and avoid automated publishing.
5. Create a persistent project document and update the handoff docs.
```

## Deliverables

- `docs/authority-red-team-and-resource-expansion-plan.md`
- updated README/documentation links
- updated session handoff state
- updated roadmap/decision-log notes

## Audit Inputs

Files and surfaces reviewed:

- `README.md`
- `docs/session-brief.md`
- `docs/master-roadmap.md`
- `docs/source-monitoring-plan.md`
- `docs/signals-roadmap.md`
- `docs/content-expansion-plan.md`
- `docs/source-strategy.md`
- `docs/publication-policy.md`
- `app/src/content.config.ts`
- current source records
- current signal records
- current topic records
- current evidence-gap records
- current source-monitor implementation
- sitemap and publication visibility rules

Validation check:

```text
npm.cmd run validate:content
```

Result:

```text
FTFN content reference validation passed.
25 sources, 14 signals, 15 topics, 10 organizations, 5 technologies, 2 local systems, 1 briefings, 10 evidence gaps, 2 dependency maps
```

Spot-checked external source posture:

- NOAA CPC ENSO page still showed the 11 June 2026 discussion during the 2026-07-09 audit and listed 9 July 2026 as the next scheduled discussion.
- City of Toronto Application Information Centre stated that active planning application data is refreshed daily.
- ACC eDocket remained a high-priority review source because docket evidence changes continuously and the public page is not enough without a specific docket citation.

## Key Findings

### Current Authority Strengths

- FTFN has a working static Astro app.
- Content reference validation passes.
- The source library is mostly Tier 1.
- Publication states are visible.
- Source checked dates and known limitations are public.
- The Method page explains publication boundaries.
- The source monitor makes freshness visible.
- Local-system claims are deliberately cautious.
- No automated publishing or numeric scoring has been introduced.

### Current Authority Gaps

- Only three signals are Published.
- Ten signals remain In Review and one is a Draft Sample.
- Several In Review records are broad source frames rather than dated developments.
- `Cybersecurity` and `Discovery Technologies` do not yet have public topic records.
- Three high-priority sources are Review due and one is Watch soon.
- Local system profiles are constraint maps, not full evidence dossiers.
- Six evidence gaps remain Open.
- There is no public update/correction log.
- There is no explicit watch-lane schema.
- The source monitor does not fetch, verify, or compare source pages.
- Search, exports, watch-lane browsing, and data-product surfaces are not yet resource-grade.

## Decisions

### Authority Comes From Evidence Depth, Not Feature Count

Decision:

The next expansion should prioritize source depth, dated signals, evidence dossiers, and update transparency before new technical systems.

Rationale:

The site is structurally sound. The risk is not missing app scaffolding; it is the gap between a broad intelligence-platform promise and a small public evidence core.

### Broad Source Frames Need Clearer Roles

Decision:

Broad official-source records should not be treated the same as dated signal records.

Rationale:

CHIPS, FAA AAM, NHTSA AVs, NASA Artemis, and USDA plant-genomics records are useful context. They become authoritative current intelligence only when tied to a specific dated event, filing, dataset, rule, contract, milestone, or local record.

### Self-Updating Should Advance In Stages

Decision:

FTFN should move from generated freshness to source health reports, then to private review queues, before any ingestion or draft generation.

Rationale:

Self-updating authority is valuable, but automated publishing would weaken the editorial posture. The next automation should identify what needs review, not rewrite public claims.

## Recommended Next Phase

Phase 39: Authority Foundation Sprint.

Scope:

- recheck Review due and Watch soon sources,
- add missing topic records for `Cybersecurity` and `Discovery Technologies`,
- decide the public indexing posture for In Review local systems and dependency maps,
- add or plan watch-lane metadata,
- create the first source health report design,
- select the next high-authority source batch by watch lane.

## Acceptance Criteria

- Authority red-team document exists.
- Findings are grounded in current content counts, source freshness, publication states, and roadmap posture.
- The plan distinguishes immediate launch blockers from longer-term resource growth.
- The next phase is content-first and source-first.
- No app code, source records, signal records, publication states, deployment settings, automation, ingestion, scoring, CMS, analytics, DNS, or database layer are changed.

## Completion Notes

Completed in Phase 38:

- audited the current content graph and documentation,
- confirmed content validation still passes,
- identified current source freshness risks,
- identified missing topic records,
- identified broad In Review records that need dated evidence,
- documented the gap between generated source freshness and true self-updating resource behavior,
- created the comprehensive resource expansion plan,
- kept all changes documentation-only.

## Open Questions

- Should Phase 39 add topic records only, or also add watch-lane metadata fields?
- Should local system profiles and dependency maps remain indexable while still In Review?
- Should a public update/correction log ship before preview deployment?
- Should source health reporting stay as a local script first, or become a generated public report immediately?
- Which watch lanes should receive the first 12 to 18 new source records?
