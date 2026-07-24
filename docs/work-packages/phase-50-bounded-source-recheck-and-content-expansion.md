# Phase 50: Bounded Source Recheck And Content Expansion

Date: 2026-07-22

## Goal

Move from Phase 49 source breadth into Phase 50 content authority by selecting bounded source items, creating source-specific `In Review` signals, and updating local dossiers and evidence gaps without making premature publication or readiness claims.

## Implemented

- added `signal-doe-critical-minerals-materials-accelerator-nofo`,
- added `signal-mag-2023-projections-phoenix-region-growth-evidence-layer`,
- added `signal-usaspending-talon-nickel-battery-minerals-processing-award`,
- added `signal-nsf-ai-materials-institute-award-2433348`,
- added `signal-usgs-2026-gallium-import-supplied-semiconductor-constraint`,
- added `signal-toronto-application-24-254930-named-planning-record`,
- refreshed `source-grants-gov-api`, `source-doe-critical-materials-collaborative`, and `source-maricopa-association-governments-open-data`,
- updated the U.S. Southwest Chip Corridor profile with the selected MAG regional projections dataset,
- updated `gap-003` for chip-corridor workforce and supplier scaling evidence,
- updated `gap-007` for critical-minerals processing and commodity-specific evidence,
- moved `uq-023` and `uq-037` in the private update queue to `Signal Draft Created`,
- moved `uq-003`, `uq-022`, and `uq-028` to `Signal Draft Created` and added direct-selection item `uq-039`,
- updated the Ontario Real Estate profile and `gap-004` with the first named Toronto application record,
- deepened `gap-007` by separating a funding opportunity, an award trail, and a commodity-specific gallium baseline,
- preserved the 182-page v0.1.1 candidate in Git commit `4845597` and moved current work to `codex/v0.2-phase50b`,
- advanced app metadata to `0.2.0-dev`,
- updated roadmap, source-monitoring, source-broadening, authoritative-source, red-team, session, README, documentation-map, and decision-log docs.

## Selected Source Items

### Grants.gov And DOE

Selected item:

```text
Grants.gov opportunity ID: 361773
Opportunity number: DE-FOA-0003589
Title: Critical Minerals and Materials Accelerator Notice of Funding Opportunity
Posting date: 2026-04-07
Grants.gov revision metadata checked: 2026-07-22
```

Why selected:

- it is a dated official funding-opportunity record,
- it supports the Critical Minerals watch lane,
- it links processing scale-up, semiconductor materials, direct lithium extraction, validation, and commercialization pathways,
- it gives FTFN a funding signal without treating funding intent as award or deployment proof.

Boundary:

The selected record does not prove award outcomes, project success, production capacity, domestic supply-chain resilience, local economic development, or commodity-specific constraint resolution.

### MAG Open Data

Selected item:

```text
MAG item ID: c1990106ce3840d6af8bc476ca31c30e
Title: Projections of Population, Housing, & Employment for Maricopa and Pinal Counties, AZ, 2023
Selected service: MAG_Projections_2023 FeatureServer
Layers: municipal planning area, regional analysis zone, traffic analysis zone
Checked date: 2026-07-22
```

Why selected:

- it is a named local source item rather than a broad portal page,
- it improves the U.S. Southwest Chip Corridor dossier with regional population, housing, and employment context,
- it is exposed through query and extract capable ArcGIS service metadata,
- it gives future local-dossier work a concrete geography and dataset layer.

Boundary:

The selected record does not prove semiconductor workforce sufficiency, housing affordability, utility service readiness, water capacity, permitting clearance, supplier maturity, or project-level feasibility.

### USAspending Talon Nickel Award

Selected item:

```text
USAspending award: ASST_NON_DEMS0000003_089
FAIN: DEMS0000003
Recipient: Talon Nickel (USA) LLC
Start date: 2023-11-01
Current end date: 2026-10-31
Checked obligations: $114,846,344
Checked outlays: $954,321.45
Checked date: 2026-07-22
```

Boundary:

The record proves a named federal award and transaction trail. It does not prove a permitted, constructed, commissioned, or operating processing facility, and the amounts can change with later transactions.

### NSF AI-Materials Institute Award

Selected item:

```text
NSF award ID: 2433348
Recipient: Cornell University
Award type: Cooperative Agreement
Award date: 2025-07-28
Performance period: 2025-10-01 to 2030-09-30
Checked obligations: $6,000,000
Estimated total: $20,000,000
```

Boundary:

The award establishes funding and proposed research scope. It does not prove delivery of the planned AI Materials Science Ecosystem, validated discoveries, reduced discovery cycles, or manufacturing readiness.

### USGS Gallium 2026

Selected item:

```text
Publication: Mineral Commodity Summaries 2026, version 1.3
Commodity: Gallium
Companion source: USGS Gallium Statistics and Information
Checked date: 2026-07-22
```

Boundary:

USGS supports the national import-supplied baseline and gallium-use structure. It does not prove a current shortage, a named facility disruption, or that every gallium-dependent application has the same exposure.

### Toronto Application 24 254930

Selected item:

```text
Application: 24 254930 ESC 20 OZ
Addresses: 507-513 Victoria Park Avenue and 4, 6 and 14 Thora Avenue
Application types: Official Plan and Zoning By-law amendments
Proposed residential units: 578
Public notice date: 2025-08-29
```

Boundary:

The City notice proves receipt and public notice of the described applications. It does not prove current status, approval, servicing, permits, financing, construction, completion, occupancy, or delivery of the proposed units.

## Validation Results

```text
npm.cmd run validate:content
FTFN content reference validation passed.
102 sources, 22 signals, 17 topics, 10 organizations, 5 technologies, 2 local systems, 1 briefings, 10 evidence gaps, 2 dependency maps

npm.cmd run source:health
102 sources
Manual review: 46
Probe ready: 56
Source endpoint metadata passed.

npm.cmd run check
0 errors, 0 warnings, 0 hints

npm.cmd run build
0 errors, 0 warnings, 0 hints
186 page(s) built
```

## Boundary

Phase 50 does not publish the new signals, approve public launch, deploy the site, start automated ingestion, add source scoring, add a database, or claim that source-item selection proves outcomes.

The DOE/Grants.gov signal is a funding-opportunity signal. It is not an award signal.

The MAG signal is a local planning-evidence signal. It is not a local readiness signal.

The Talon Nickel signal is an award-administration signal. It is not facility-progress evidence.

The NSF AI-MI signal is a research-funding signal. It is not a research-result signal.

The gallium signal is a national commodity-dependency signal. It is not a shortage or facility-disruption claim.

The Toronto signal is a planning-application signal. It is not approval, permitting, construction, or completion evidence.

## Next

Phase 50B is complete at six bounded additions across the two Phase 50 batches. Move into Phase 51 local dossier deepening:

1. Select a named Arizona utility docket, resource-planning filing, or transmission record.
2. Select a provider-level Arizona water, service-area, allocation, conservation, or infrastructure record.
3. Track Toronto application 24 254930 through a staff report or decision and add a servicing or permit-status record.
4. Add workforce, construction-labor, or completion evidence to the two dossiers.
5. Keep all current Phase 50 additions `In Review` until the separate Phase 53 publication review.
