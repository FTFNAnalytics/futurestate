# Phase 49: Broad Source Promotion Batch

Date: 2026-07-21

## Goal

Promote the next 25 to 40 high-value source candidates into active source records so FTFN has a broader authoritative evidence layer for v0.2 signal repair, local dossiers, and source monitoring.

## Implemented

- added 36 active source records,
- expanded the source library from 66 to 102 records,
- prioritized official APIs, public data portals, funding and spending rails, research-program APIs, patent and technology-transfer rails, space licensing sources, critical-minerals sources, agriculture and bioeconomy sources, and Arizona local-system sources,
- kept all broad catalogs as source-discovery rails rather than direct claim evidence,
- added access metadata, limitations, review cadence, source owner, jurisdiction, watch lanes, coverage roles, and automation notes for each promoted source,
- updated the private queue with 18 promoted-source review candidates,
- validated source references, endpoint metadata, and the static build.

## Promoted Source Groups

Cross-cutting official and funding rails:

- `source-data-gov-catalog-api`
- `source-govinfo-api`
- `source-usaspending-api`
- `source-grants-gov-api`

International official and statistical rails:

- `source-government-canada-open-data-api`
- `source-data-gov-uk-api`
- `source-eurostat-api`
- `source-oecd-data-api`
- `source-world-bank-indicators-api`

Finance, housing, and hazard context:

- `source-fred-api`
- `source-bea-api`
- `source-treasury-fiscaldata-api`
- `source-fhfa-house-price-index`
- `source-fema-national-risk-index`

Research, science, patents, and technology transfer:

- `source-crossref-api`
- `source-openalex-api`
- `source-ncbi-eutilities`
- `source-osti-gov-api`
- `source-nsf-award-search-api`
- `source-nasa-techport-api`
- `source-nasa-technology-transfer-api`
- `source-uspto-patentsview`
- `source-nist-data-repository`
- `source-materials-project-api`
- `source-nrel-data-catalog`

Water, minerals, trade, agriculture, space, and local systems:

- `source-bureau-reclamation-rise-api`
- `source-usgs-mineral-resources-data`
- `source-doe-critical-materials-collaborative`
- `source-usitc-dataweb-api`
- `source-usda-ers-developer-apis`
- `source-usda-aphis-biotechnology`
- `source-faa-commercial-space-licenses`
- `source-noaa-commercial-remote-sensing-licensing`
- `source-fcc-space-bureau-icfs`
- `source-maricopa-association-governments-open-data`
- `source-phoenix-open-data-portal`

## Validation Results

```text
npm.cmd run validate:content
FTFN content reference validation passed.
102 sources, 16 signals, 17 topics, 10 organizations, 5 technologies, 2 local systems, 1 briefings, 10 evidence gaps, 2 dependency maps

npm.cmd run source:health
102 sources
Manual review: 46
Probe ready: 56
Source endpoint metadata passed.

npm.cmd run build
0 errors, 0 warnings, 0 hints
180 page(s) built
```

## Boundary

Phase 49 does not create new signals, publish any records, fetch live endpoint data, automate source polling, create a database, add scoring, deploy the site, change DNS, or claim that broad catalogs prove real-world outcomes.

The new records make the source library broader. They do not replace bounded source selection. Any signal still needs a selected document, dataset release, award, patent set, docket, filing, permit, license, application, or dated source item.

## Next

Use the new source records in this order:

1. Pull 10 to 20 promoted sources through the private update queue. Status: started with Batch 02 in `docs/private-update-queue.md`.
2. Select one bounded source item from funding, research, space licensing, agriculture biotechnology, minerals/trade, FEMA risk, or local Phoenix/MAG records.
3. Select one named local dossier record from ACC eDocket, Phoenix permitting/water, Toronto AIC, or Ontario housing evidence.
4. Create the next `In Review` signal only after a bounded source item has been selected.
5. Create the private candidate registry before another broad public source-promotion batch.
