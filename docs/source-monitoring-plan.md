# Source Monitoring Plan

This document defines how FTFN should move from a static source list toward an authoritative, self-updating evidence resource.

It does not start automated ingestion. It defines the control layer that must exist before automation is safe.

## Goal

FTFN should become a primary resource for readers who want to understand frontier systems, dependencies, constraints, and evidence trails.

That requires more than publishing signals. The source layer itself needs to show:

- which sources are authoritative,
- how often they change,
- when FTFN last checked them,
- which sources are due for review,
- which topics are well supported,
- and which evidence gaps still block stronger claims.

## Phase 37 Implementation

Phase 37 adds a generated Source Monitor at:

```text
/atlas/source-monitor/
```

The monitor is generated from the existing source records at build time. It uses:

- `last_checked_date`
- `update_frequency`
- `capture_priority`
- `credibility_level`
- `primary_topics`
- related signal references

It classifies sources as:

```text
Current
Watch soon
Review due
```

This creates a practical editorial queue: before a source supports a new public claim, the monitor shows whether it should be rechecked.

## Freshness Rules

The first freshness rules are intentionally simple and conservative:

- daily sources should be rechecked quickly,
- monthly sources should be checked inside a monthly-plus-buffer window,
- ongoing sources get a shorter review window than irregular sources,
- annual sources get an annual baseline window,
- high-priority non-annual sources should not drift indefinitely.

These are not claims that the original source changed. They are review prompts.

## Public Boundary

The monitor is public because source transparency is part of FTFN's value.

It should make clear that:

- generated source freshness is not publication approval,
- review due does not mean a source is wrong,
- current does not mean a source proves every related claim,
- automated source checks are not active yet,
- no record is automatically published from this monitor.

## Why This Matters

FTFN's long-term authority will come from being able to answer:

```text
What changed?
Where did that evidence come from?
How current is it?
What does it prove?
What does it not prove?
What needs to be checked next?
```

The source monitor is the first product surface aimed directly at that loop.

## Next Improvements

Recommended next source-monitoring work:

1. Turn high-priority probe-ready sources into a private scheduled-check queue before any public automated update behavior. Status: started in Phase 47 with `docs/private-update-queue.md`; first queue items moved into content in Phase 48.
2. Create the source candidate registry described in `docs/source-broadening-and-intake-plan.md`. Status: still needed before another broad source-promotion batch.
3. Add or select named Arizona utility dockets, provider water records, Phoenix permits/applications, and Ontario municipal servicing or completion evidence. Status: Phase 51B added an SRP large-load tariff, a Phoenix-TSMC wastewater agreement, the TSMC-campus PUD, an apprenticeship record, Toronto committee follow-through, and a citywide delivery baseline; customer energization, built infrastructure, project permits, workforce outcomes, by-laws, and project completion remain.
4. Move the best promoted Phase 49 source records into bounded source checks for patents, space licensing, agriculture biotechnology, finance, and local systems. Status: funding, research, and first commodity-specific selections completed in Phase 50B.
5. Add source records for post-quantum migration guidance and procurement evidence.
6. Add source records for FAA/NHTSA dated certification or safety updates.
7. Extend `npm run source:health` from endpoint metadata checks to optional live URL checks when network/runtime policy allows it.
8. Add a private draft-update queue that records source changes without modifying public content or publishing claims.

Completed in Phase 39:

- added source fields for `watch_lanes`, `live_access_type`, endpoint URLs, `review_cadence_days`, `monitoring_status`, `coverage_role`, source owner, jurisdiction, and automation notes,
- added the first 30 authoritative live source records identified in the live source plan,
- added NERC, FERC, EIA grid monitor, DOE Grid Deployment Office, APS planning, SRP planning, CAP planning, NOAA/NCEI, USGS Water Services, NHTSA datasets, FAA DRS, NVD, CISA, USDA QuickStats, Toronto Open Data, and Ontario Data Catalogue records,
- added generated source health states to `/atlas/source-monitor/`,
- added `npm run source:health`,
- added `/atlas/source-coverage/` as a generated watch-lane and topic coverage matrix,
- upgraded local system source tables into dossier-style evidence surfaces.

Completed in Phase 40:

- added `Cybersecurity` and `Discovery Technologies` topic records so all source-supported taxonomy pillars have public topic pages,
- added Discovery Technologies source anchors for USGS 3DEP, NASA Earthdata CMR, USGS Landsat, and NOAA Ocean Exploration,
- added local dossier source anchors for ACC integrated resource planning, ACC biennial transmission assessment, Phoenix planning/permitting, Phoenix water and sewer, Toronto development review, and Toronto building permits,
- expanded the source library from 55 to 66 records,
- expanded the topic library from 15 to 17 records,
- kept automated ingestion and automated publishing out of scope.

Started in Phase 47:

- created `docs/private-update-queue.md` as the first human-reviewed source-change queue,
- created `docs/signal-repair-workflow.md` to define how source updates become repaired signal records,
- created `docs/v0.2-next-signal-set.md` to map the next 12 to 16 signal repairs and additions,
- kept automatic ingestion and public publishing out of scope.

Completed in Phase 48:

- repaired the NOAA CPC ENSO signal against the 9 July 2026 discussion,
- added the first CISA KEV cybersecurity operating-rail signal,
- added the first Federal Register/Regulations.gov regulatory watch-rail signal,
- refreshed source notes for the rechecked rails,
- kept local dossier conclusions pending until a named record is selected.

Completed in Phase 49:

- promoted 36 additional active source records,
- expanded the source library from 66 to 102 records,
- added cross-cutting official rails, funding and spending APIs, international statistical APIs, research and patent discovery rails, water and mineral data sources, agriculture biotechnology regulation, space licensing records, and Phoenix/MAG local-system data,
- moved 18 promoted records into the private update queue as Batch 02 candidates,
- validated the app at 102 sources and 180 built pages,
- kept all new broad catalogs as discovery rails rather than direct evidence for claims.

Completed in Phase 50B:

- selected Grants.gov opportunity ID 361773, `DE-FOA-0003589`, as a bounded funding-opportunity item,
- selected MAG Open Data item `c1990106ce3840d6af8bc476ca31c30e` as a named local-system dataset,
- added two `In Review` signals from those selected items,
- refreshed checked dates and notes for Grants.gov, DOE Critical Materials Collaborative, and MAG Open Data,
- selected USAspending award DEMS0000003, NSF award 2433348, the USGS 2026 gallium material, and Toronto application 24 254930,
- added four more `In Review` signals and updated `gap-004`, `gap-007`, and the Ontario Real Estate profile,
- validated the `0.2.0-dev` app at 102 sources, 22 signals, 17 topics, and 186 built pages.

Completed in Phase 51A:

- added SRP's 2025 ISP Actions Progress Report as a named utility implementation record,
- added Phoenix Water Services' April 2026 council update as a named provider-level water record,
- added Toronto's June 2026 decision report for application 24 254930 as a staff-recommendation and servicing-review record,
- added three `In Review` signals and strengthened four local evidence gaps,
- validated the app at 105 sources, 25 signals, 17 topics, and 193 built pages,
- kept customer-level service, final approvals, permits, starts, completions, and occupancy unresolved.

Completed in Phase 51B:

- added six official records spanning large-load power conditions, industrial wastewater infrastructure, a Phoenix planning case, facility-linked workforce training, Toronto committee follow-through, and citywide delivery stages,
- added six `In Review` signals and kept the Published export unchanged,
- advanced the source library to 111 records and the signal library to 31 records,
- advanced `gap-003` to `Source Added` while keeping all five affected gaps unresolved at their next downstream gate,
- preserved Git and the static build as the public publication gate.

## Not Yet

Do not add these until the manual monitor proves useful:

- automated publishing,
- ingestion-to-public workflows,
- numeric source freshness scores,
- generated claims,
- database migration,
- public API,
- alerts.

The near-term goal is an authoritative, generated reference layer. Automation can come later, after FTFN has enough manually reviewed records to know what is worth automating.
