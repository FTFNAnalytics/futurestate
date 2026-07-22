# Authoritative Live Source Plan

Date: 2026-07-09

Purpose:

Identify the live, authoritative source universe FTFN should monitor to become the primary reference layer for frontier systems, dependencies, constraints, and local conversion evidence.

This plan is source-first. It does not authorize automated publishing. It defines what to pull in, how to prioritize it, and what product infrastructure is needed before FTFN can credibly say it is on top of these topics.

## Working Definition

A live source is a source that can be checked repeatedly through at least one of these mechanisms:

- API,
- RSS or feed,
- data download,
- docket search,
- public filing system,
- release calendar,
- official update page,
- official dataset portal,
- official report series.

An authoritative source is one of:

- official government or regulator source,
- official statistical or data portal,
- official standards body,
- public institutional research source,
- official docket or filing system,
- primary company filing or required disclosure,
- local government, utility, water provider, permitting, or planning record.

Company press rooms can be monitored, but they should remain Tier 3 interested-party evidence.

## Pre-Phase 39 Baseline

Before the source-registry expansion sprint, FTFN had 25 source records:

- 24 Tier 1 sources,
- 1 Tier 3 source,
- source monitor states: 3 Review due, 1 Watch soon, 21 Current,
- strongest current coverage: Energy, Water, Policy and Standards, Human Futures, Chips and Compute, Quantum, Climate, Space, Agriculture and Bioeconomy, AI for Science, Advanced Manufacturing, Aviation, Mobility, Critical Minerals.

Current gaps:

- no full source inventory for each watch lane,
- no first-class `watch_lanes` field,
- no explicit `live_access_type`,
- no source health report,
- no feed/API polling,
- no local evidence dossier source table,
- missing public topic pages for `Cybersecurity` and `Discovery Technologies`.

## Phase 39 Implementation Status

Phase 39 completed the first implementation step from this plan:

- expanded source records from 25 to 55,
- added the first 30 authoritative live-source records,
- added `watch_lanes`, `live_access_type`, endpoint URLs, `review_cadence_days`, `monitoring_status`, `coverage_role`, `jurisdiction`, `source_owner`, and `automation_notes` to the source schema,
- added source health states to `/atlas/source-monitor/`,
- added `/atlas/source-coverage/` as a generated watch-lane and topic coverage matrix,
- added `npm run source:health`,
- upgraded local system pages with dossier-style source tables generated from linked source records.

Remaining gaps:

- missing public topic pages for `Cybersecurity` and `Discovery Technologies`,
- no live polling or endpoint fetch jobs,
- no private source-change review queue,
- local dossiers still need specific utility dockets, water-provider records, permitting records, municipal infrastructure records, and project-level evidence,
- broad `In Review` records still need dated source-backed repair before publication.

## Phase 40 Implementation Status

Phase 40 completed the next source-first content step:

- added public topic records for `Cybersecurity` and `Discovery Technologies`,
- expanded source records from 55 to 66,
- added Discovery Technologies anchors for USGS 3DEP, NASA Earthdata CMR, USGS Landsat, and NOAA Ocean Exploration,
- added Arizona local dossier anchors for ACC integrated resource planning, ACC biennial transmission assessment, Phoenix planning and development, SHAPE PHX, and Phoenix water and sewer,
- added Ontario local dossier anchors for the City of Toronto Development Guide and City of Toronto Building Permits,
- linked the new local evidence anchors to the two local system profiles.

Remaining gaps after Phase 40:

- no live polling or endpoint fetch jobs,
- no private source-change review queue,
- local dossiers still need named utility dockets, water-provider records, permitting records, municipal infrastructure records, completion records, project-level evidence, and facility-level demand evidence,
- broad `In Review` records still need dated source-backed repair before publication.

## Phase 49 Implementation Status

Phase 49 completed the broad-source promotion step requested for v0.2 authority breadth:

- expanded source records from 66 to 102,
- added meta-catalog and source-of-sources rails: Data.gov, GovInfo, Government of Canada, Data.gov.uk, Eurostat, OECD, and World Bank,
- added funding and public-finance rails: USAspending, Grants.gov, BEA, FRED, Treasury Fiscal Data, and FHFA HPI,
- added research and technical rails: Crossref, OpenAlex, NCBI E-utilities, OSTI.GOV, NSF Award Search, NASA TechPort, NASA Technology Transfer, PatentsView, NIST Public Data Repository, Materials Project, and NREL Data Catalog,
- added operating sources for Bureau of Reclamation RISE, USGS Mineral Resources Data, DOE Critical Materials Collaborative, USITC DataWeb, USDA ERS, USDA APHIS Biotechnology, FAA Commercial Space Licenses, NOAA Commercial Remote Sensing Licensing, FCC Space Bureau/ICFS, MAG Open Data, and Phoenix Open Data,
- moved 18 promoted sources into the private update queue as bounded review candidates.

Remaining gaps after Phase 49:

- the private source-candidate registry is still needed before another broad source promotion batch,
- source breadth now exceeds the original v0.2 source-count target, so the next bottleneck is bounded source-item selection,
- local dossiers still need named dockets, permits, applications, provider records, servicing evidence, completion evidence, and facility-level demand evidence,
- broad `In Review` records still need dated source-backed repair before publication.

## Phase 50 Implementation Status

Phase 50B completed the bounded source-item selection step:

- selected Grants.gov opportunity ID 361773, opportunity number `DE-FOA-0003589`, for a DOE Critical Minerals and Materials Accelerator funding signal,
- selected MAG Open Data item `c1990106ce3840d6af8bc476ca31c30e` for a Phoenix-region population, housing, and employment projections signal,
- updated the U.S. Southwest Chip Corridor dossier with the selected MAG source layer,
- updated critical-minerals and chip-corridor evidence gaps to keep the new records bounded,
- kept both new records `In Review` and out of publication status.
- selected USAspending award DEMS0000003 to Talon Nickel (USA) LLC,
- selected NSF award 2433348 to Cornell University for the AI-Materials Institute,
- selected the 2026 USGS gallium material as a commodity-specific dependency record,
- selected Toronto application 24 254930 ESC 20 OZ as the Ontario dossier's first named application record,
- kept all six Phase 50 additions `In Review` and separated funding, award, research, commodity, application, and outcome evidence.

Remaining gaps after Phase 50B:

- local dossiers still need named ACC/Phoenix power and water records, Toronto decision and servicing records, workforce, supplier, completion, and facility records,
- the selected USAspending award still needs site, permit, construction, commissioning, production, and offtake follow-up,
- the gallium record still needs trade, supplier, inventory, qualification, project, substitution, and recycling follow-up.

## Phase 51 Local Evidence Status

Phases 51A and 51B added nine official records across both local dossiers. The Southwest chip-corridor trail now includes SRP implementation, the E-67 large-load tariff, Phoenix provider-water context, a project-specific TSMC wastewater agreement, the North Phoenix 3,500 PUD, and a named technician apprenticeship. The Ontario trail now follows application 24 254930 from notice through staff review and community-council recommendation and pairs it with Toronto's citywide Development Pipeline.

Remaining local gaps are downstream rather than general: customer electric service and energization; completed wastewater and industrial-reclaimed-water infrastructure; named Phoenix permits and occupancy; workforce outcomes and supplier capacity; Toronto City Council and enacted by-laws; and the named project's permit, start, completion, and occupancy trail.

## Acquisition Rule

Add sources in this order:

1. Cross-cutting official rails that cover many topics.
2. Watch-lane anchors for Power, Compute and Chips, Water, Mobility Certification, Security and Standards, Local Systems.
3. Local records that resolve high-priority evidence gaps.
4. Research and frontier-domain sources.
5. Company and trade sources only after official source anchors exist.

Each source record should answer:

- What lane does this source support?
- What can be monitored automatically?
- What must remain manual?
- What does this source prove?
- What does this source not prove?
- What review cadence is appropriate?

## Schema Upgrades Needed

Before adding dozens of sources, add or plan these fields on source records:

```text
watch_lanes
live_access_type
api_url
feed_url
data_download_url
docket_search_url
release_calendar_url
review_cadence_days
monitoring_status
coverage_role
jurisdiction
source_owner
automation_notes
```

Recommended controlled values:

```text
live_access_type:
- API
- RSS Feed
- Data Download
- Docket Search
- Filing System
- Release Page
- Report Series
- Interactive Portal
- Manual Page Check
```

```text
coverage_role:
- Primary Data
- Regulatory Change
- Docket Evidence
- Filing Evidence
- Source Freshness
- Local Conversion Evidence
- Standards Evidence
- Research Program Evidence
- Funding Evidence
- Company Claim
```

## Priority 0: Cross-Cutting Official Rails

These sources should be added first because they generate authoritative signals across multiple topics.

| Source | URL | Live Access | Use |
| --- | --- | --- | --- |
| Federal Register API | https://www.federalregister.gov/developers/documentation/api/v1 | API | Regulations, proposed rules, notices, agency actions across FAA, NHTSA, DOE, FERC, EPA, BIS, CISA, NOAA, USDA, NASA, FCC. |
| Regulations.gov API | https://open.gsa.gov/api/regulationsgov/ | API | Dockets, documents, comments, supporting materials, public rulemaking trails. |
| GovInfo API | https://api.govinfo.gov/docs/ | API | Statutes, CFR, congressional publications, public laws, official documents. |
| Data.gov Catalog | https://catalog.data.gov/ | Catalog/API | Discovery layer for U.S. government datasets. |
| SEC EDGAR APIs | https://www.sec.gov/search-filings/edgar-application-programming-interfaces | API and nightly bulk files | Company filings, capex, risks, facility commitments, financing, supply-chain disclosures. |
| USASpending API | https://api.usaspending.gov/ | API | Federal awards, grants, contracts, recipients, locations. |
| Grants.gov Search | https://www.grants.gov/search-grants | Search/API candidate | Funding opportunities and award-related program signals. |
| BLS Public Data API | https://www.bls.gov/developers/ | API | Labor, workforce, employment, wages, occupations, regional labor capacity. |
| U.S. Census APIs | https://www.census.gov/data/developers/data-sets.html | API | Building permits, trade, manufacturers, business patterns, public finance, workforce and demographic context. |
| FRED API | https://fred.stlouisfed.org/docs/api/fred/ | API | Economic series, interest rates, inflation, regional economic indicators. |
| Statistics Canada Web Data Service | https://www.statcan.gc.ca/en/developers/wds | API | Canadian statistical tables and time series. |
| Government of Canada Open Data | https://search.open.canada.ca/opendata/ | Catalog/API | Canadian official datasets and departmental records. |

Priority:

Add these before expanding signal volume. They become the central live rails for "what changed recently."

## Priority 1: Power Watch

Goal:

Track whether energy demand, grid capacity, reliability, interconnection, and equipment constraints are tightening or easing.

| Source | URL | Live Access | Use |
| --- | --- | --- | --- |
| EIA Open Data | https://www.eia.gov/opendata/ | API, bulk data, RSS | Electricity generation, demand, balancing authority data, retail sales, prices, energy outlooks. |
| EIA Electricity Data Browser | https://www.eia.gov/electricity/data/browser/ | Data/API adjacent | Public electricity data discovery and spot checks. |
| EIA Form 930 hourly grid data | https://www.eia.gov/electricity/gridmonitor/ | API/data browser | Actual and forecast demand, net generation, interchange by balancing authority. |
| NERC Reliability Assessments | https://www.nerc.com/our-work/assessments | Report series | Seasonal and long-term reliability risk. |
| FERC eLibrary | https://elibrary.ferc.gov/eLibrary/search | Docket search | Orders, filings, rate cases, interconnection, transmission and reliability proceedings. |
| FERC Electric Quarterly Reports | https://eqrreportviewer.ferc.gov/ | Data portal | Wholesale electricity transactions. |
| DOE Grid Deployment Office | https://www.energy.gov/gdo/grid-deployment-office | Release page | Transmission, grid resilience, deployment funding. |
| DOE Office of Electricity | https://www.energy.gov/oe/office-electricity | Release page | Storage, grid modernization, reliability programs. |
| NREL Data Catalog | https://data.nrel.gov/ | Data catalog | Renewable integration, grid, buildings, transport data. |
| OpenEI | https://openei.org/ | Data portal/API candidate | Energy datasets, utility and policy context. |
| PJM Interconnection Queue | https://www.pjm.com/planning/service-requests/interconnection-queues | Queue page/data | Project interconnection status and bottlenecks. |
| CAISO OASIS | http://oasis.caiso.com/ | Data portal/API | Market and grid operational data. |
| ERCOT Market Information System | https://www.ercot.com/mp/data-products | Data portal | Texas load, generation, interconnection, market data. |
| MISO Generator Interconnection Queue | https://www.misoenergy.org/planning/generator-interconnection/ | Queue page | Project queue and grid interconnection status. |
| SPP Generator Interconnection | https://www.spp.org/engineering/generator-interconnection/ | Queue page | Project queue and study process. |
| NYISO Interconnection Queue | https://www.nyiso.com/interconnections | Queue page | New York interconnection projects. |
| ISO New England Interconnection Queue | https://www.iso-ne.com/system-planning/interconnection-service/interconnection-request-queue | Queue page | New England grid project queue. |
| Arizona Corporation Commission eDocket | https://edocket.azcc.gov/ | Docket search | Arizona utility filings and regulatory evidence. Existing source. |
| APS Resource Planning | https://www.aps.com/en/About/Our-Company/Doing-Business-with-Us/Resource-Planning | Utility planning page | Arizona utility capacity, IRP, load-growth evidence. |
| Salt River Project Resource Planning | https://www.srpnet.com/about/energy/resource-planning | Utility planning page | Local power planning for Phoenix-area growth. |
| Tucson Electric Power Resource Planning | https://www.tep.com/resource-planning/ | Utility planning page | Arizona regional utility planning. |

First additions:

- Federal Register API with FERC, DOE, EPA, BIS agency filters.
- FERC eLibrary.
- NERC assessments.
- EIA Form 930/grid monitor.
- APS/SRP/TEP planning sources for Arizona local evidence.

## Priority 2: Compute and Chips Watch

Goal:

Track whether semiconductor and compute policy turns into fabs, packaging, equipment, workforce, water, power, yield, and local capacity.

| Source | URL | Live Access | Use |
| --- | --- | --- | --- |
| CHIPS for America | https://www.nist.gov/chips | Release page | Program-level source. Existing source. |
| CHIPS Funding Updates | https://www.nist.gov/chips/funding-updates | Release page | Award and funding updates. |
| CHIPS Award Announcements | https://www.nist.gov/chips/award-announcements | Release page | Specific award-to-facility evidence. |
| NIST Advanced Packaging | https://www.nist.gov/chips/advanced-packaging | Release page | Packaging and R&D conversion. |
| NIST Metrology | https://www.nist.gov/chips/metrology | Release page | Measurement, standards, and manufacturing R&D. |
| SEC EDGAR APIs | https://www.sec.gov/search-filings/edgar-application-programming-interfaces | API | Company filings for Intel, TSMC, Samsung, Micron, Nvidia, AMD, ASML, Applied Materials, Lam Research. |
| BIS Export Administration Regulations | https://www.bis.gov/regulations | Release page | Export controls and supply-chain constraints. |
| Federal Register API | https://www.federalregister.gov/developers/documentation/api/v1 | API | BIS, Commerce, NIST, export control, CHIPS notices. |
| U.S. Census Annual Survey of Manufactures | https://www.census.gov/data/developers/data-sets.html | API | Semiconductor manufacturing industry baselines. |
| BLS OEWS and QCEW | https://www.bls.gov/developers/ | API | Semiconductor workforce and wage constraints. |
| Arizona Commerce Authority Semiconductor | https://www.azcommerce.com/industries/semiconductors/ | Release page | Local economic-development context. |
| Local permit portals near fabs | varies | Portal | Project-level construction and permitting evidence. |

First additions:

- CHIPS award announcements.
- SEC EDGAR APIs.
- BLS/Census workforce and manufacturing datasets.
- BIS/Federal Register export-control filters.
- Arizona local project and permit sources.

## Priority 3: Water Watch

Goal:

Track water as a binding constraint on housing, agriculture, chips, data centers, energy, and industrial growth.

| Source | URL | Live Access | Use |
| --- | --- | --- | --- |
| NOAA/NIDIS Drought.gov Data Catalog | https://www.drought.gov/data-maps-tools | Data catalog/downloads | Drought, water supply, outlooks, current conditions. |
| NOAA CPC ENSO | https://www.cpc.ncep.noaa.gov/products/analysis_monitoring/enso_advisory/ensodisc.shtml | Monthly page | ENSO climate driver. Existing source. |
| NOAA NCEI Access | https://www.ncei.noaa.gov/access | APIs, data access | Climate and environmental data. |
| NOAA Climate Data Online API | https://www.ncdc.noaa.gov/cdo-web/webservices/v2 | API | Station, daily, monthly climate records. |
| U.S. Drought Monitor Data | https://droughtmonitor.unl.edu/DmData/DataDownload.aspx | Data download | Weekly drought classifications. |
| USGS Water Services | https://waterservices.usgs.gov/ | API | Streamflow, groundwater, water quality, site data. |
| Bureau of Reclamation Water Operations | https://www.usbr.gov/rsvrWater/ | Data portal | Reservoir and basin operations. |
| Arizona Department of Water Resources | https://www.azwater.gov/ | Official page | Arizona water governance. Existing source. |
| Arizona Assured and Adequate Water Supply | https://www.azwater.gov/aaws | Official page | Local growth and water adequacy. Existing source. |
| Central Arizona Project | https://www.cap-az.com/departments/planning/ | Official page | CAP supply planning and operations. |
| Phoenix Water Services | https://www.phoenix.gov/waterservices | Local official page | Municipal water planning and service evidence. |
| Salt River Project Water | https://www.srpnet.com/grid-water-management/water-management | Utility/water provider | Phoenix-area water and power provider context. |

First additions:

- NOAA NCEI/CDO.
- Drought.gov/NIDIS.
- U.S. Drought Monitor data.
- USGS Water Services.
- CAP and Phoenix/SRP water planning sources.

## Priority 4: Mobility Certification Watch

Goal:

Track mobility through certification, safety, operating limits, infrastructure, public trust, and regulation.

| Source | URL | Live Access | Use |
| --- | --- | --- | --- |
| FAA Advanced Air Mobility | https://www.faa.gov/air-taxis | Official page | AAM frame. Existing source. |
| FAA Dynamic Regulatory System | https://drs.faa.gov/ | Search portal | Airworthiness directives, guidance, type certificate data, regulatory docs. |
| FAA Type Certificate Data Sheets | https://drs.faa.gov/ | Search portal | Certification status and aircraft evidence. |
| FAA Aviation Safety Draft Documents | https://www.faa.gov/aircraft/draft_docs | Release page | Open certification and safety documents. |
| FAA UAS Advanced Operations | https://www.faa.gov/uas/advanced_operations | Official page | Drones, BVLOS, advanced operations. |
| FAA Commercial Space Data | https://www.faa.gov/data_research/commercial_space_data | Data page | Launch and commercial space references. |
| NHTSA Datasets and APIs | https://www.nhtsa.gov/nhtsa-datasets-and-apis | API and data downloads | Recalls, investigations, complaints, daily data. |
| NHTSA Automated Vehicles | https://www.nhtsa.gov/vehicle-safety/automated-vehicles-safety | Official page | AV safety framing. Existing source. |
| NHTSA Standing General Order crash data | https://www.nhtsa.gov/laws-regulations/standing-general-order-crash-reporting | Data/report page | AV and ADAS crash reporting. |
| Bureau of Transportation Statistics | https://www.transtats.bts.gov/ | Data portal | Transportation operations and aviation datasets. |
| Federal Register API | https://www.federalregister.gov/developers/documentation/api/v1 | API | FAA and NHTSA rules/notices. |
| Regulations.gov API | https://open.gsa.gov/api/regulationsgov/ | API | FAA/NHTSA dockets and comments. |

First additions:

- FAA DRS.
- FAA aircraft certification/TCDS search path.
- NHTSA Datasets and APIs.
- NHTSA SGO crash reporting.
- FAA/NHTSA Federal Register filters.

## Priority 5: Security and Standards Watch

Goal:

Track standards, cybersecurity risk, post-quantum migration, AI governance, and critical infrastructure security.

| Source | URL | Live Access | Use |
| --- | --- | --- | --- |
| NIST Post-Quantum Cryptography | https://csrc.nist.gov/projects/post-quantum-cryptography | Official page | PQC standards. Existing source. |
| NIST CSRC News and Projects | https://csrc.nist.gov/ | Release page/feed candidate | Cybersecurity standards and guidance. |
| NIST National Vulnerability Database | https://nvd.nist.gov/developers/start-here | API | Vulnerability data, CVEs, CPEs, JSON API. |
| CISA Known Exploited Vulnerabilities Catalog | https://www.cisa.gov/known-exploited-vulnerabilities-catalog | Catalog/JSON | Exploited vulnerability evidence and deadlines. |
| CISA Cybersecurity Advisories | https://www.cisa.gov/news-events/cybersecurity-advisories | Feed/page | Alerts and advisories. |
| CISA Binding Operational Directives | https://www.cisa.gov/news-events/directives | Release page | Federal cybersecurity requirements. |
| OMB Memoranda | https://www.whitehouse.gov/omb/information-for-agencies/memoranda/ | Release page | Federal agency implementation rules. |
| CIO.gov | https://www.cio.gov/ | Release page | Federal technology and cybersecurity implementation. |
| NSA Cybersecurity Advisories | https://www.nsa.gov/Press-Room/Cybersecurity-Advisories-Guidance/ | Release page | National security guidance. |
| CVE Program API | https://cveawg.mitre.org/api-docs/ | API | CVE records and vulnerability identifiers. |
| FIRST EPSS Data | https://www.first.org/epss/data_stats | CSV/API-like | Exploit probability context. |
| FedRAMP Marketplace | https://marketplace.fedramp.gov/ | Data portal | Cloud service authorization and federal adoption context. |

First additions:

- NVD API.
- CISA KEV catalog.
- CISA advisories/directives.
- OMB/CIO.gov implementation guidance.
- CVE and EPSS for context, with clear limitations.

## Priority 6: Critical Minerals and Materials Watch

Goal:

Track whether materials availability, mining, processing, refining, trade, recycling, and substitution can support future systems.

| Source | URL | Live Access | Use |
| --- | --- | --- | --- |
| USGS Mineral Commodity Summaries | https://www.usgs.gov/centers/national-minerals-information-center/mineral-commodity-summaries | Annual report series | Commodity baselines. Existing source. |
| USGS National Minerals Information Center | https://www.usgs.gov/centers/national-minerals-information-center | Release page/data | Mineral statistics, publications, commodity reports. |
| USGS Mineral Resources Data System | https://mrdata.usgs.gov/mrds/ | Data portal | Deposits and mineral occurrence data. |
| USGS Earth MRI | https://www.usgs.gov/special-topics/earth-mri | Data/release page | Mapping critical mineral potential. |
| DOE Critical Materials | https://www.energy.gov/cmm/critical-materials | Release page | Critical materials strategy and programs. |
| IEA Critical Minerals Data Explorer | https://www.iea.org/data-and-statistics/data-tools/critical-minerals-data-explorer | Data tool | Global critical-minerals demand and supply context. |
| USITC DataWeb | https://dataweb.usitc.gov/ | Data portal | Trade and import/export evidence. |
| UN Comtrade API | https://comtradeapi.un.org/ | API | Global trade flows. |
| SEC EDGAR APIs | https://www.sec.gov/search-filings/edgar-application-programming-interfaces | API | Mining and processing company filings. |

First additions:

- USGS NMIC center page.
- USGS MRDS.
- DOE Critical Materials.
- USITC DataWeb or UN Comtrade.

## Priority 7: Climate Conversion Watch

Goal:

Track climate signals and whether institutions convert them into operational decisions.

| Source | URL | Live Access | Use |
| --- | --- | --- | --- |
| NOAA CPC ENSO | https://www.cpc.ncep.noaa.gov/products/analysis_monitoring/enso_advisory/ensodisc.shtml | Monthly page | ENSO source. Existing source. |
| NOAA CPC Outlooks | https://www.cpc.ncep.noaa.gov/products/predictions/ | Release pages | Seasonal outlooks and climate risk. |
| NOAA NCEI Access | https://www.ncei.noaa.gov/access | APIs | Historical climate, current data access, metadata. |
| NOAA Climate Data Online API | https://www.ncdc.noaa.gov/cdo-web/webservices/v2 | API | Station-level climate data. |
| Drought.gov/NIDIS | https://www.drought.gov/data-maps-tools | Data catalog | Drought, water, agriculture, wildfire impacts. |
| U.S. Drought Monitor | https://droughtmonitor.unl.edu/ | Weekly data | Drought classifications and weekly change. |
| National Weather Service Drought Statements | https://www.weather.gov/drought/ | Statements | Local climate interpretation. |
| FEMA National Risk Index | https://hazards.fema.gov/nri/ | Data portal | Local hazard and risk context. |

First additions:

- NOAA NCEI/CDO.
- Drought.gov.
- U.S. Drought Monitor.
- FEMA National Risk Index for local-system hazard evidence.

## Priority 8: Agriculture and Bioeconomy Watch

Goal:

Track climate-resilient agriculture, plant genomics, gene editing, regulatory status, production data, and public research programs.

| Source | URL | Live Access | Use |
| --- | --- | --- | --- |
| USDA NIFA Plant Breeding, Genetics and Genomics | https://www.nifa.usda.gov/grants/programs/plant-breeding-genetics-genomics-programs | Official page | Existing source. |
| USDA NIFA Programs | https://www.nifa.usda.gov/grants/programs | Release page | Funding and program changes. |
| USDA NASS QuickStats API | https://quickstats.nass.usda.gov/api | API | Agricultural production and survey statistics. |
| USDA ERS Data Products | https://www.ers.usda.gov/data-products | Data portal | Food, farm, market, land-use, productivity context. |
| USDA APHIS Biotechnology Regulatory Services | https://www.aphis.usda.gov/biotechnology | Regulatory page | Biotechnology permits, regulatory status, gene-edited crop evidence. |
| USDA Crop Progress and Condition | https://www.nass.usda.gov/Publications/National_Crop_Progress/ | Weekly report | Crop progress and climate/agricultural stress. |
| USDA FAS Production, Supply and Distribution | https://apps.fas.usda.gov/psdonline/ | Data portal | Global agricultural production and trade. |
| PubMed | https://pubmed.ncbi.nlm.nih.gov/ | API/search | Peer-reviewed biology and agriculture research context. |

First additions:

- NASS QuickStats API.
- ERS data products.
- APHIS Biotechnology.
- Crop Progress.

## Priority 9: AI for Science and Advanced Manufacturing

Goal:

Track research-to-manufacturing conversion: datasets, validation, standards, lab programs, materials discovery, automation, and pilots.

| Source | URL | Live Access | Use |
| --- | --- | --- | --- |
| DOE Office of Science | https://www.energy.gov/science/office-science | Release page | Existing source. |
| NIST Materials Genome Initiative | https://www.nist.gov/mgi | Official page | Existing source. |
| NIST Office of Advanced Manufacturing | https://www.nist.gov/oam | Official page | Existing source. |
| Materials Project | https://next-gen.materialsproject.org/api | API | Materials data and computational materials science. |
| DOE National Labs News | https://www.energy.gov/national-labs | Release page | Lab-level research programs. |
| OSTI.GOV | https://www.osti.gov/ | Search/API candidate | DOE-funded publications and technical reports. |
| NSF Award Search | https://www.nsf.gov/awardsearch/ | Search/API candidate | Research funding and program signals. |
| NIST Data Repository | https://data.nist.gov/ | Data portal | NIST datasets and research outputs. |
| Federal Register API | https://www.federalregister.gov/developers/documentation/api/v1 | API | AI, standards, R&D, manufacturing rulemaking. |

First additions:

- OSTI.GOV.
- NIST Data Repository.
- Materials Project API.
- NSF Award Search.

## Priority 10: Space Infrastructure Watch

Goal:

Track space as infrastructure: launch, licensing, Artemis, satellites, spaceports, communications, regulatory approvals, and public mission evidence.

| Source | URL | Live Access | Use |
| --- | --- | --- | --- |
| NASA Artemis | https://www.nasa.gov/specials/artemis/ | Official page | Existing source. |
| NASA Open APIs | https://api.nasa.gov/ | API | NASA public API gateway. |
| NASA TechPort | https://techport.nasa.gov/ | API/search candidate | NASA technology projects. |
| NASA NTRS | https://ntrs.nasa.gov/ | Search/API candidate | Technical reports and mission research. |
| FAA Commercial Space Data | https://www.faa.gov/data_research/commercial_space_data | Data page | Commercial space data entry point. |
| FAA Licenses, Permits and Approvals | https://www.faa.gov/space/licenses | Official page | Launch and reentry licensing. |
| FCC Space Bureau | https://www.fcc.gov/space | Release/filing page | Satellite licensing and spectrum policy. |
| NOAA Commercial Remote Sensing Regulatory Affairs | https://www.nesdis.noaa.gov/commercial-space/regulatory-affairs | Official page | Remote sensing licenses. |
| Federal Register API | https://www.federalregister.gov/developers/documentation/api/v1 | API | NASA, FAA, FCC, NOAA rules and notices. |

First additions:

- FAA licenses/permits/approvals.
- FCC Space Bureau.
- NASA TechPort or NTRS.
- NOAA commercial remote sensing.

## Priority 11: Discovery Technologies Watch

Goal:

Support public topic coverage for sensing, LiDAR, remote sensing, archaeology, ocean discovery, Earth observation, and data-to-discovery workflows.

| Source | URL | Live Access | Use |
| --- | --- | --- | --- |
| USGS 3D Elevation Program | https://www.usgs.gov/3d-elevation-program | Data portal | LiDAR/elevation coverage and data releases. |
| The National Map APIs | https://apps.nationalmap.gov/services/ | APIs | USGS map, elevation, hydrography data services. |
| USGS Landsat Missions | https://www.usgs.gov/landsat-missions | Data/release page | Earth observation source. |
| NASA Earthdata Search | https://search.earthdata.nasa.gov/ | Data portal | Earth observation data. |
| NASA CMR API | https://cmr.earthdata.nasa.gov/search/site/docs/search/api.html | API | NASA Earthdata metadata and granules. |
| NOAA NCEI Access | https://www.ncei.noaa.gov/access | APIs | Environmental and geophysical datasets. |
| OpenTopography | https://opentopography.org/ | Data portal/API | LiDAR and terrain data; not government, but high-value academic infrastructure. |
| NOAA Ocean Exploration | https://oceanexplorer.noaa.gov/ | Release page | Ocean exploration missions and discoveries. |

First additions:

- USGS 3DEP.
- The National Map APIs.
- NASA Earthdata/CMR.
- NOAA Ocean Exploration.

## Priority 12: Finance, Insurance, Workforce, and Human Futures

Goal:

Track whether future systems can be financed, insured, staffed, permitted, built, housed, and absorbed by human systems.

| Source | URL | Live Access | Use |
| --- | --- | --- | --- |
| Statistics Canada WDS | https://www.statcan.gc.ca/en/developers/wds | API | Canadian economic, permits, labor, population data. |
| Statistics Canada Building Permits | https://www150.statcan.gc.ca/n1/en/type/data?text=building%20permits | Data page | Existing source family. |
| CMHC Housing Market Information Portal | https://www03.cmhc-schl.gc.ca/hmip-pimh/en | Data portal | Existing source. |
| CMHC Starts/Completions | https://www.cmhc-schl.gc.ca/professionals/housing-markets-data-and-research/housing-data/data-tables/housing-market-data/housing-starts-completions-under-construction | Data tables | Existing source. |
| Ontario Housing Supply Progress | https://www.ontario.ca/page/tracking-housing-supply-progress | Monthly page | Existing source. |
| U.S. Census Building Permits Survey | https://www.census.gov/construction/bps/ | API/data | Housing intent and construction pipeline. |
| U.S. Census Economic Indicators APIs | https://www.census.gov/data/developers/data-sets/economic-indicators.html | API | Construction, trade, manufacturing, housing indicators. |
| BLS Public Data API | https://www.bls.gov/developers/ | API | Workforce, wages, occupations, employment. |
| FHFA House Price Index | https://www.fhfa.gov/data/hpi | Data download | Housing price and finance context. |
| Treasury FiscalData API | https://fiscaldata.treasury.gov/api-documentation/ | API | Federal finance and public debt data. |
| FEMA National Risk Index | https://hazards.fema.gov/nri/ | Data portal | Insurance and hazard exposure context. |

First additions:

- Statistics Canada WDS.
- Census BPS and Economic Indicators.
- BLS API.
- FHFA HPI.
- FEMA National Risk Index.

## Priority 13: Local Systems Watch

Goal:

Build local evidence dossiers for places where global signals become real constraints.

### Ontario Real Estate

| Source | URL | Live Access | Use |
| --- | --- | --- | --- |
| City of Toronto AIC | https://www.toronto.ca/city-government/planning-development/application-information-centre/ | Daily portal | Existing source. |
| Toronto Open Data | https://open.toronto.ca/ | API/catalog | Building permits, development, infrastructure, local records. |
| Toronto Building Permits Open Data | https://open.toronto.ca/dataset/building-permits-cleared-permits/ | API/data | Permit clearance and local construction evidence. |
| Ontario Data Catalogue | https://data.ontario.ca/ | API/catalog | Provincial data, housing, infrastructure, economy. |
| Ontario Housing Supply Progress | https://www.ontario.ca/page/tracking-housing-supply-progress | Monthly page | Existing source. |
| CMHC data tables | https://www.cmhc-schl.gc.ca/professionals/housing-markets-data-and-research/housing-data/data-tables | Data portal | Starts, completions, under construction. |
| Statistics Canada WDS | https://www.statcan.gc.ca/en/developers/wds | API | Permits, completions, population, labor. |

### U.S. Southwest Chip Corridor

| Source | URL | Live Access | Use |
| --- | --- | --- | --- |
| ACC eDocket | https://edocket.azcc.gov/ | Docket search | Existing source. |
| Arizona Corporation Commission Utilities Division | https://www.azcc.gov/utilities | Official page | Existing source. |
| APS Resource Planning | https://www.aps.com/en/About/Our-Company/Doing-Business-with-Us/Resource-Planning | Utility page | Power planning. |
| SRP Resource Planning | https://www.srpnet.com/about/energy/resource-planning | Utility page | Power planning. |
| SRP Water Management | https://www.srpnet.com/grid-water-management/water-management | Provider page | Water and power provider evidence. |
| Arizona Department of Water Resources | https://www.azwater.gov/ | Official page | Existing source. |
| Central Arizona Project | https://www.cap-az.com/departments/planning/ | Provider planning page | Water supply planning. |
| City of Phoenix Planning and Development | https://www.phoenix.gov/pdd | Local official page | Permits, planning, local development. |
| City of Phoenix Open Data | https://www.phoenixopendata.com/ | API/catalog | Local data source inventory. |
| Maricopa Association of Governments | https://azmag.gov/ | Regional data/planning | Regional growth, infrastructure, transportation. |
| Arizona Commerce Authority Semiconductors | https://www.azcommerce.com/industries/semiconductors/ | Release page | Industrial corridor context. |

First additions:

- Toronto Open Data and building permits.
- Ontario Data Catalogue.
- APS/SRP/TEP planning.
- CAP and Phoenix planning/open data.
- Maricopa Association of Governments.

## First 30 Sources To Add

These are the best next 30 source records for authority and coverage.

1. Federal Register API.
2. Regulations.gov API.
3. SEC EDGAR APIs.
4. BLS Public Data API.
5. U.S. Census APIs.
6. Statistics Canada Web Data Service.
7. EIA Form 930/Grid Monitor.
8. NERC Reliability Assessments.
9. FERC eLibrary.
10. DOE Grid Deployment Office.
11. APS Resource Planning.
12. SRP Resource Planning.
13. NOAA NCEI Access.
14. NOAA Climate Data Online API.
15. Drought.gov/NIDIS Data Catalog.
16. U.S. Drought Monitor data.
17. USGS Water Services.
18. Central Arizona Project planning.
19. CHIPS Award Announcements.
20. SEC EDGAR company filing coverage for chip/data-center companies.
21. NHTSA Datasets and APIs.
22. FAA Dynamic Regulatory System.
23. NHTSA Standing General Order crash reporting.
24. NIST NVD API.
25. CISA Known Exploited Vulnerabilities catalog.
26. CISA Cybersecurity Advisories.
27. USGS National Minerals Information Center.
28. USDA NASS QuickStats API.
29. Toronto Open Data.
30. Ontario Data Catalogue.

Why these first:

- They strengthen the weakest current authority gaps.
- They are mostly official and machine-checkable.
- They support multiple watch lanes.
- They can feed the source monitor before they feed public claims.
- They create the evidence base for dated signals and local dossiers.

## Monitoring Plan

### Step 1: Source Records

Add the first 30 as source records with:

- `watch_lanes`,
- `live_access_type`,
- `review_cadence_days`,
- `known_limitations`,
- specific `coverage_role`.

Do not create signals until source records exist.

### Step 2: Source Health Report

Add a local script that:

- reads source records,
- checks URL status,
- records redirect status,
- records content type,
- records last successful fetch time,
- flags dead or changed URLs,
- writes `app/src/generated/source-health.json` or `docs/generated/source-health-report.json`.

The script should not modify content records automatically.

### Step 3: API and Feed Probes

For API/feed sources, add a probe config:

```text
source_id
probe_type
probe_url
method
expected_status
expected_content_type
sample_fields
rate_limit_notes
requires_key
```

Start with no-key or low-friction APIs:

- Federal Register,
- SEC EDGAR,
- Census,
- BLS v1,
- NHTSA,
- EIA if API key is available,
- NVD with rate-limit caution,
- Regulations.gov with DEMO_KEY for low-volume tests.

### Step 4: Generated Coverage Matrix

Generate a public or internal matrix:

```text
watch_lane
source_count
tier_1_count
api_count
feed_count
docket_count
review_due_count
local_evidence_count
next_source_needed
```

This should become the product view that tells readers and maintainers whether FTFN is on top of a topic.

### Step 5: Private Draft Queue

Only after source health works:

- compare source snapshots,
- detect changed pages/feed entries/docket items,
- write private review candidates,
- never publish automatically.

Candidate output:

```text
source_id
change_detected_at
change_type
source_url
candidate_watch_lane
candidate_signal_title
review_reason
human_next_action
```

## Product Surfaces To Build

### Source Coverage Matrix

Public route candidate:

```text
/atlas/source-coverage/
```

Shows:

- watch lanes,
- source count,
- current/review-due status,
- strongest sources,
- missing source types,
- evidence gaps linked to each lane.

### Watch Lane Pages

Public route candidate:

```text
/atlas/watch-lanes/power/
/atlas/watch-lanes/compute-and-chips/
/atlas/watch-lanes/water/
```

Each lane should show:

- latest Published signals,
- In Review research shelf,
- authoritative sources,
- review-due sources,
- unresolved evidence gaps,
- local systems affected,
- "what would change our view."

### Local Evidence Dossiers

Public or research route candidate:

```text
/atlas/local-systems/us-southwest-chip-corridor/evidence/
/atlas/local-systems/ontario-real-estate/evidence/
```

Each dossier should include:

- source inventory,
- record table,
- what each source supports,
- what each source does not prove,
- last checked,
- next local record needed.

## Implementation Timeline

### Week 1: Authority Source Registry

- Add schema fields or prepare source metadata extension plan.
- Add first 30 source records.
- Add Cybersecurity and Discovery Technologies topic records.
- Recheck Review due and Watch soon sources.
- Run validation and build.

Status: complete through Phase 40 except for the recurring source recheck step, which remains required before new claims.

### Week 2: Source Health and Coverage Matrix

- Add source health report script.
- Generate source health JSON.
- Add coverage matrix route.
- Add watch-lane grouping on source monitor.

### Week 3: Dated Signal Repair

- Repair broad In Review records into dated source-backed signals.
- Prioritize CHIPS, FAA, NHTSA, NASA, USDA, Arizona power, Arizona water, Ontario conversion.
- Keep records In Review until publication gate.

### Week 4: Local Evidence Dossiers

- Build Arizona power dossier.
- Build Arizona water dossier.
- Build Ontario housing conversion dossier.
- Update evidence gaps based on specific records.

### 30-Day Target

- 100 to 125 active source records. Status: initial lower bound reached in Phase 49 with 102 source records.
- 17 public topic records.
- Source coverage matrix route.
- Source health report.
- Watch lanes visible in source monitor.
- 20 to 30 signal records.
- 8 to 12 publication candidates.
- 3 local evidence dossiers.

## What Not To Do Yet

Do not:

- auto-publish from feeds,
- generate public claims from source changes,
- add numeric scores,
- add an API before static exports prove useful,
- migrate to a database before source fields stabilize,
- treat company press releases as independent evidence,
- create local readiness claims without local records.

## Best Next Build Step

Continue from the completed topic-and-dossier evidence sprint:

1. Use `/atlas/source-coverage/` to identify weak watch lanes and the strongest source-supported signal candidates.
2. Select high-priority probe-ready sources for the first private source-change review queue.
3. Add named Arizona utility dockets, Phoenix permit/application records, water-provider records, Ontario municipal servicing records, and Ontario application/permitting records.
4. Repair broad `In Review` records into dated source-backed signals where the expanded evidence base supports a specific update.
5. Keep public publishing, scoring, ingestion, database migration, and DNS changes behind explicit approval.

That turns the new source-intelligence system into a more complete public resource without skipping the human review gate.
