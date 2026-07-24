# Phase 18 Work Package: First Evidence-Gap-Driven Source Batch

## Goal

Add a small, high-priority source batch from the evidence gap register so FTFN can move local-system analysis toward stronger conversion evidence without overstating local conclusions.

This phase is source acquisition, not broad content expansion.

## Source Of Truth

Read before continuing:

- `README.md`
- `docs/session-brief.md`
- `docs/master-roadmap.md`
- `docs/decision-log.md`
- `docs/content-expansion-plan.md`
- `docs/evidence-gap-register.md`
- `docs/work-packages/phase-17-briefing-template-and-evidence-gap-register.md`

## Scope

1. Add a focused source batch from the highest-priority evidence gaps.
2. Prioritize:
   - Arizona utility planning, rate-case, and docket evidence.
   - Arizona water supply, provider, permit, or reuse evidence.
   - Ontario municipal planning and development application evidence.
   - Housing starts, completions, and units-under-construction evidence.
3. Update local system profiles only when the new source directly supports the relationship.
4. Create or revise signals only if official sources support a specific claim.
5. Keep all records out of `Published`.
6. Do not add dependencies, automation, ingestion, or speculative conclusions.

## Source Records Added

| Source ID | Purpose | Evidence Gap |
| --- | --- | --- |
| `source-arizona-corporation-commission-edocket` | Official Arizona regulator docket source for utility filings, rate cases, orders, and related local conversion evidence. | `gap-001` |
| `source-arizona-adwr-assured-water-supply` | Official Arizona water-supply governance source for assured and adequate water supply criteria. | `gap-002` |
| `source-city-toronto-application-information-centre` | Official City of Toronto planning application source for active development applications. | `gap-004` |
| `source-cmhc-starts-completions-under-construction` | Official CMHC table source to distinguish starts, completions, and units under construction. | `gap-005` |

## Local System Updates

Updated `Ontario Real Estate`:

- added CMHC starts/completions source,
- added City of Toronto Application Information Centre source,
- added cautious Phase 18 evidence note,
- preserved missing-data caveats around servicing, financing, and province-wide inference.

Updated `U.S. Southwest Chip Corridor`:

- added ACC eDocket source,
- added ADWR assured and adequate water supply source,
- added cautious Phase 18 evidence note,
- preserved caveats around facility-level power, water demand, provider capacity, interconnection, and workforce evidence.

## Decisions

- Phase 18 adds source records only; it does not create new signals.
- Evidence gaps can move from `Open` to `Source Added` when a general source layer exists, even if the gap remains analytically unresolved.
- A `Source Added` status means FTFN has a stronger place to look next. It does not mean the local conclusion is proven.
- Local profiles can cite source records when the source supports the evidence environment, but strong local claims still require specific filings, tables, permits, provider records, or municipal records.

## Acceptance Criteria

- Phase 18 work package exists.
- A focused set of new official source records exists.
- New source records validate against the content schema.
- Local system profiles are updated only where evidence supports them.
- Evidence gap statuses are updated without falsely resolving local conclusions.
- No records are promoted to `Published`.
- `npm run check` passes.
- `npm run build` passes.
- The roadmap identifies the next phase.

## Validation Results

```text
npm run check: 0 errors, 0 warnings, 0 hints
npm run build: 67 pages generated
```

## Next Phase Candidate

Phase 19 should integrate the new source layer into local-system analysis and signal specificity.

Recommended focus:

- inspect the new Phase 18 sources for specific dockets, tables, applications, and criteria that can support narrower claims,
- update local profiles only where specific source evidence improves a missing-data item,
- create or repair one to two signals only if they can cite a concrete official source event, table, filing, or local record,
- keep evidence gaps active until specific local conversion evidence exists.
