# Phase 39: Authoritative Source Registry And Coverage Matrix

Date: 2026-07-09

## Goal

Execute the first authority-foundation step from the live source plan:

- add source metadata needed for watch-lane monitoring,
- add the first 30 authoritative live-source records,
- expose source health and coverage gaps through generated pages,
- make local system profiles use source records as dossier tables,
- keep automated ingestion and publishing out of scope.

## Implemented

- Expanded the source schema with:
  - `watch_lanes`,
  - `live_access_type`,
  - `api_url`,
  - `feed_url`,
  - `data_download_url`,
  - `docket_search_url`,
  - `release_calendar_url`,
  - `review_cadence_days`,
  - `monitoring_status`,
  - `coverage_role`,
  - `jurisdiction`,
  - `source_owner`,
  - `automation_notes`.
- Added 30 authoritative source records from `docs/authoritative-live-source-plan.md`.
- Increased the source library from 25 to 55 records.
- Added source health classification in `app/src/lib/sourceFreshness.ts`.
- Updated `/atlas/source-monitor/` with:
  - probe readiness,
  - manual review counts,
  - endpoint gaps,
  - watch lanes,
  - access-type counts,
  - coverage roles.
- Added `/atlas/source-coverage/` as a generated watch-lane and topic coverage matrix.
- Added `npm run source:health` for endpoint metadata checks.
- Added `/atlas/source-coverage/` to the Atlas landing page and sitemap.
- Upgraded local system pages into dossier-style evidence tables generated from linked source records.
- Linked new Arizona and Ontario source records to the two existing local system profiles.
- Updated README, roadmap, source-monitoring plan, content model, session brief, and decision log.

## Source Batch Added

The first 30 records include:

- Federal Register API,
- Regulations.gov API,
- SEC EDGAR APIs,
- BLS Public Data API,
- U.S. Census APIs,
- Statistics Canada Web Data Service,
- EIA Grid Monitor,
- NERC Reliability Assessments,
- FERC eLibrary,
- DOE Grid Deployment Office,
- Arizona Public Service resource planning,
- Salt River Project integrated system planning,
- NOAA NCEI data access,
- NOAA Climate Data Online API,
- Drought.gov data catalog,
- U.S. Drought Monitor data downloads,
- USGS Water Services,
- Central Arizona Project planning and processes,
- CHIPS for America awards,
- SEC EDGAR Companyfacts API,
- NHTSA datasets and APIs,
- FAA Dynamic Regulatory System,
- NHTSA Standing General Order crash reporting,
- NIST National Vulnerability Database API,
- CISA Known Exploited Vulnerabilities catalog,
- CISA cybersecurity advisories,
- USGS National Minerals Information Center,
- USDA NASS QuickStats API,
- City of Toronto Open Data,
- Ontario Data Catalogue.

## Validation

Commands run:

```text
npm.cmd run validate:content
npm.cmd run source:health
npm.cmd run check
```

Results:

```text
FTFN content reference validation passed.
55 sources, 14 signals, 15 topics, 10 organizations, 5 technologies, 2 local systems, 1 briefings, 10 evidence gaps, 2 dependency maps

FTFN source health report
55 sources
Manual review: 34
Probe ready: 21
Source endpoint metadata passed.

Astro check: 0 errors, 0 warnings, 0 hints.
```

## Boundary

This phase does not:

- fetch source content,
- poll endpoints,
- update records from live sources,
- generate claims,
- publish records,
- score sources,
- add a database,
- deploy the site,
- attach DNS,
- add analytics.

The new health report checks endpoint metadata readiness only. It is a bridge toward future live checks, not live ingestion.

## Next

Recommended next work:

1. Add public topic records for `Cybersecurity` and `Discovery Technologies`.
2. Use `/atlas/source-coverage/` to identify the weakest watch lanes.
3. Add specific utility dockets, water-provider records, permitting records, and municipal infrastructure sources to the two local dossiers.
4. Build a private update queue for high-priority probe-ready sources.
5. Repair broad `In Review` records into dated source-backed signals only where the expanded evidence base supports a specific update.
