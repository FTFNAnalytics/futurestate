# Phase 50: Bounded Source Recheck And Content Expansion

Date: 2026-07-22

## Goal

Move from Phase 49 source breadth into Phase 50 content authority by selecting bounded source items, creating source-specific `In Review` signals, and updating local dossiers and evidence gaps without making premature publication or readiness claims.

## Implemented

- added `signal-doe-critical-minerals-materials-accelerator-nofo`,
- added `signal-mag-2023-projections-phoenix-region-growth-evidence-layer`,
- refreshed `source-grants-gov-api`, `source-doe-critical-materials-collaborative`, and `source-maricopa-association-governments-open-data`,
- updated the U.S. Southwest Chip Corridor profile with the selected MAG regional projections dataset,
- updated `gap-003` for chip-corridor workforce and supplier scaling evidence,
- updated `gap-007` for critical-minerals processing and commodity-specific evidence,
- moved `uq-023` and `uq-037` in the private update queue to `Signal Draft Created`,
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

## Validation Results

```text
npm.cmd run validate:content
FTFN content reference validation passed.
102 sources, 18 signals, 17 topics, 10 organizations, 5 technologies, 2 local systems, 1 briefings, 10 evidence gaps, 2 dependency maps

npm.cmd run source:health
102 sources
Manual review: 46
Probe ready: 56
Source endpoint metadata passed.

npm.cmd run check
0 errors, 0 warnings, 0 hints

npm.cmd run build
0 errors, 0 warnings, 0 hints
182 page(s) built
```

## Boundary

Phase 50 does not publish the new signals, approve public launch, deploy the site, start automated ingestion, add source scoring, add a database, or claim that source-item selection proves outcomes.

The DOE/Grants.gov signal is a funding-opportunity signal. It is not an award signal.

The MAG signal is a local planning-evidence signal. It is not a local readiness signal.

## Next

Continue Phase 50 with two to five more bounded source items before moving to the next product capability layer:

1. Select a USAspending award or contract record and pair it with recipient, agency, location, and obligation-period limits.
2. Select an NSF Award Search or OSTI record for AI for Science or Advanced Manufacturing.
3. Select a commodity-specific critical-minerals record from USGS, USITC, DOE, or trade data.
4. Select a named ACC, Phoenix, Toronto, water-provider, permit, application, or servicing record for local dossier deepening.
5. Keep every new record `In Review` until a separate publication-candidate review is run.
