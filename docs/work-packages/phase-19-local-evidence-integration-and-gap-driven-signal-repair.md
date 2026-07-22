# Phase 19 Work Package: Local Evidence Integration and Gap-Driven Signal Repair

## Goal

Integrate the Phase 18 source layer into existing local-system and signal records without overstating what the new sources prove.

This phase is about narrowing the evidence trail. It is not a broad content batch.

## Source Of Truth

Read before continuing:

- `README.md`
- `docs/session-brief.md`
- `docs/master-roadmap.md`
- `docs/evidence-gap-register.md`
- `docs/content-expansion-plan.md`
- `docs/work-packages/phase-18-first-evidence-gap-driven-source-batch.md`
- `app/src/content/local-systems/`
- `app/src/content/signals/`
- `app/src/content/sources/`

## Scope

1. Inspect the Phase 18 sources for specific filings, tables, applications, and criteria.
2. Update local profiles only where specific evidence improves a missing-data item.
3. Create or repair one to two signals only if official source evidence supports a concrete claim.
4. Keep evidence gaps active until local conversion evidence is specific enough to support conclusions.
5. Do not add dependencies, automation, ingestion, or unsupported local claims.
6. Do not promote any records to `Published`.

## Official Sources Checked

| Source ID | What It Supports | How It Was Used |
| --- | --- | --- |
| `source-arizona-adwr-assured-water-supply` | ADWR assured and adequate water supply programs, including 100-year water-supply criteria. | Repaired the Arizona water signal and U.S. Southwest Chip Corridor profile to make the criteria layer more explicit. |
| `source-cmhc-starts-completions-under-construction` | CMHC tables for starts, completions, and units under construction. | Repaired the Statistics Canada permits signal and Ontario Real Estate profile to clarify permit-to-delivery conversion. |
| `source-arizona-corporation-commission-edocket` | ACC docket portal for future utility filings and rate-case evidence. | Checked and retained as a source layer, but no signal was created because no specific docket was selected. |
| `source-city-toronto-application-information-centre` | Toronto active planning and development applications. | Checked and retained as a source layer, but no signal was created because no specific application or approval timeline was selected. |

## Signal Repairs

Repaired `signal-arizona-water-resources-chip-corridor-constraint-map`:

- added ADWR assured and adequate water supply source,
- added 100-year water-supply criteria to the dependency stack,
- clarified that criteria evidence does not prove facility-level industrial water sufficiency.

Repaired `signal-statcan-building-permits-construction-intentions-signal`:

- added CMHC starts, completions, and units-under-construction source,
- clarified the distinction between permits, starts, completions, and active construction,
- preserved the caution that permits are not completed housing.

## Local System Updates

Updated `Ontario Real Estate`:

- added Phase 19 evidence integration note,
- explained how CMHC starts/completions improve the permit-to-delivery conversion logic,
- preserved missing-data requirements for servicing, financing, municipal timelines, and local completions.

Updated `U.S. Southwest Chip Corridor`:

- added Phase 19 evidence integration note,
- explained how ADWR 100-year water-supply criteria strengthen the governance layer,
- preserved missing-data requirements for provider records, facility demand, reuse, permits, utility filings, and ACC dockets.

## Decisions

- No new signals were created in Phase 19.
- Repairing existing signals was more useful than adding more records because the new sources strengthen already-active evidence gaps.
- ACC eDocket and Toronto AIC remain source layers until FTFN identifies specific docket or application records.
- `Source Added` remains the correct evidence-gap status for `gap-001`, `gap-002`, `gap-004`, and `gap-005`; none are resolved.

## Acceptance Criteria

- Phase 19 work package exists.
- One to two existing signals are repaired with official source evidence.
- Local profiles show what improved and what remains unproven.
- Phase 18 source checked dates are refreshed.
- Evidence gap statuses remain cautious.
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

Phase 20 should decide whether evidence-gap linking and claim-scope metadata should become first-class schema fields.

Recommended focus:

- evaluate candidate fields such as `evidence_gap_ids`, `claim_scope`, `local_evidence_level`, and `last_reviewed_date`,
- update the content model and schemas only if the fields improve editorial control,
- add lightweight UI display only where it helps readers understand evidence limits,
- avoid adding a database or automation until the manual editorial workflow is stable.
