# Phase 13 Work Package: Local System Profile Hardening and Constraint Notes

## Objective

Turn the current local system profiles into stronger, source-backed analytical pages that explain constraints, evidence limits, missing data, and receiving-system dynamics without overstating local conclusions.

Phase 13 builds on the official source foundations added in Phase 12. It keeps local profiles public during prelaunch, but makes the evidence limits more visible.

## Inputs

- [README](../../README.md)
- [Documentation Map](../documentation-map.md)
- [Master Roadmap](../master-roadmap.md)
- [Decision Log](../decision-log.md)
- [Taxonomy](../taxonomy.md)
- [Content Model](../content-model.md)
- [Source Strategy](../source-strategy.md)
- [Editorial Method](../editorial-method.md)
- [Review Checklists](../review-checklists.md)
- [Content Expansion Plan](../content-expansion-plan.md)
- [Phase 12 Work Package](phase-12-source-expansion-and-local-evidence-foundations.md)
- `app/src/content.config.ts`
- `app/src/content/sources/`
- `app/src/content/local-systems/`
- `app/src/pages/atlas/local-systems/index.astro`
- `app/src/pages/atlas/local-systems/[slug].astro`
- `app/src/styles/global.css`

## Profiles Reviewed

- `local-ontario-real-estate`
- `local-us-southwest-chip-corridor`

Both profiles remain prelaunch analytical records. They are clearer and more useful, but they are not treated as fully publishable local intelligence yet.

## Implementation Summary

Updated each local system profile to include:

- system context,
- transduction question,
- key constraint notes,
- source-backed evidence,
- what the evidence does not prove,
- missing-data matrix,
- actors with authority,
- likely second-order effects,
- signals to watch next,
- existing Phase 12 evidence foundation notes.

Updated the local system detail route to show:

- linked source records,
- source type,
- credibility tier,
- source checked date,
- source limitations.

Updated global prose styling so local-profile tables render clearly.

## Public MVP Field Decision

The following local-system fields and caveats should be public at MVP:

- summary,
- geography,
- system type,
- key industries,
- current equilibrium,
- core constraints,
- actors with authority,
- likely second-order effects,
- missing data,
- source IDs and source cards,
- evidence limitations,
- signals to watch next.

Rationale:

Local system profiles are useful only if readers can see both the interpretation and the limits of the evidence. Hiding missing data would make the pages look more certain than they are.

Do not expose future facility-level, permit-level, lender-level, or utility-service records until the project has a stronger data model for those entities.

## Profile-Specific Notes

### Ontario Real Estate

The profile now frames Ontario real estate as a receiving system for financing, housing supply, planning, infrastructure, labor, and trust signals.

Constraint notes added for:

- Capital,
- Regulation,
- Labor,
- Infrastructure,
- Public Trust.

Evidence limits remain explicit:

- no municipality-specific infrastructure conclusions,
- no project-viability conclusions,
- no lender-exposure conclusions,
- no replacement for municipal development application, servicing, planning, or utility records.

### U.S. Southwest Chip Corridor

The profile now frames the U.S. Southwest chip corridor as a receiving system for semiconductor policy, power, water, labor, supplier, land-use, and public legitimacy signals.

Constraint notes added for:

- Water,
- Power,
- Labor,
- Manufacturing,
- Supply Chain,
- Public Trust.

Evidence limits remain explicit:

- no facility-level power or water conclusion,
- no interconnection timeline conclusion,
- no workforce sufficiency conclusion,
- no supplier-network maturity conclusion,
- no claim that any specific municipality can or cannot absorb new demand.

## What Was Not Done

- No records were promoted to `Published`.
- No new source records were added.
- No new signals were created.
- No automation or ingestion was started.
- No dependencies were added.
- No unsupported local conclusions were added.
- No schema fields were changed.

## Acceptance Criteria

- [x] Phase 13 work package exists.
- [x] Local system profiles are clearer and more analytical.
- [x] Evidence limits are visible.
- [x] Missing data is explicit.
- [x] Local conclusions remain cautious.
- [x] No records are promoted to `Published`.
- [x] `npm run check` passes.
- [x] `npm run build` passes.
- [x] Roadmap identifies the next phase.

## Validation Results

```text
npm run check: 0 errors, 0 warnings, 0 hints
npm run build: 48 pages generated
```

## Preview Results

Checked in the in-app browser:

- `/atlas/local-systems/us-southwest-chip-corridor/`
- `/atlas/local-systems/ontario-real-estate/`

Observed:

- local system page titles render correctly,
- evidence-base sections appear,
- linked source cards appear,
- missing-data matrix tables render,
- no horizontal overflow was detected on the checked viewport.

## Recommended Next Phase

Phase 14 should improve Atlas coverage and relationship coherence now that source-backed local profiles exist.

Suggested title:

```text
Phase 14: Atlas Topic Coverage and Local Relationship Backlinks
```

Focus:

- add missing priority topic records for Energy, Water, Policy and Standards, Finance and Risk, and Human Futures,
- add organization records for key official sources where useful,
- improve source detail pages so linked local system profiles appear as related records,
- keep relationships deterministic and based on existing source IDs, topic matches, or explicit fields,
- avoid broad content expansion until the Atlas can represent the current evidence base cleanly.

## Open Questions

- Should local system profiles have a formal `record_status` field before public launch?
- Should local profiles move to `In Review` and `Published` states like signals and briefings?
- Should FTFN add first-class `evidence_limits` and `missing_data_matrix` fields instead of writing those sections in MDX?
- Should local systems show source recency warnings when source checked dates become stale?
