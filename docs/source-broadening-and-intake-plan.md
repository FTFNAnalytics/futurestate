# Source Broadening And Intake Plan

Date: 2026-07-21

## Purpose

FTFN should draw in as many potential sources as possible without weakening the authority of the public library. The right model is a broad private intake funnel with strict public promotion rules.

In practical terms:

```text
Source universe -> candidate registry -> active source record -> private update queue -> signal/local dossier
```

Not every source candidate becomes an active source. Not every active source becomes a signal. Not every source update becomes public content.

## Target Shape

Near-term v0.2 target:

```text
100 to 125 active source records
250 to 400 private source candidates
25 to 35 signal records
8 to 12 Published or publication-ready signal candidates
```

Next authority-system target:

```text
200 to 300 active source records
750 to 1,200 private source candidates
70 signal records
24 Published or publication-ready signal candidates
```

The candidate pool should be much larger than the active source library. That lets FTFN scan widely while keeping public evidence curated.

## Source Intake Fields

Before adding hundreds of sources as public records, create a private candidate registry with fields like:

```text
candidate_id
name
url
discovery_source
source_owner
jurisdiction
source_type
credibility_guess
topic_pillars
watch_lanes
live_access_type
access_url
requires_key
rate_limit_notes
what_it_can_prove
what_it_cannot_prove
likely_signal_use
local_system_relevance
candidate_status
priority
human_next_action
last_discovered_date
last_triaged_date
```

Recommended statuses:

```text
Discovered
Needs Triage
Candidate
Approved For Source Record
Active Source Record
Watchlist Only
Duplicate
Rejected
Blocked
```

## Promotion Rules

Promote a candidate to an active source record only when it has:

- a stable URL or endpoint,
- a named source owner,
- a clear update cadence or review trigger,
- a source type and credibility tier,
- at least one watch lane,
- a known limitation statement,
- a clear answer to what the source can and cannot prove.

High-volume discovery is useful. High-volume public promotion is not.

## Broadest Intake Lanes

### 1. Meta-Catalogs And Source-Of-Sources

These should become the widest discovery funnels because they point to many official datasets and data owners.

| Source | Use |
| --- | --- |
| Data.gov Catalog API | U.S. federal, state, local, county, university, tribal, and nonprofit dataset discovery. |
| Data.gov public catalog | Dataset count and organization discovery. |
| GovInfo API | Official U.S. federal documents, collections, packages, and metadata. |
| USAspending API | Federal awards, recipients, agencies, locations, contracts, and grants. |
| Grants.gov API | Funding-opportunity search and program discovery. |
| Government of Canada Open Data | Canadian federal dataset discovery. |
| Data.gov.uk API | U.K. dataset and publisher discovery. |
| Eurostat APIs | EU statistical datasets, metadata, and catalogue discovery. |
| OECD data API | OECD data-series discovery and cross-country comparisons. |
| World Bank Indicators API | Global development, economy, climate, energy, population, and infrastructure indicators. |

First use:

- run keyword searches by watch lane,
- discover source owners and dataset URLs,
- record candidates privately,
- promote only the datasets with high relevance and stable access.

### 2. Cross-Cutting U.S. Official Rails

These are the backbone for "what changed" across many topics.

| Source Class | Examples |
| --- | --- |
| Federal law and rulemaking | Federal Register, Regulations.gov, GovInfo, agency rule pages. |
| Public spending and funding | USAspending, Grants.gov, agency award pages, procurement portals. |
| Company-required disclosures | SEC EDGAR submissions, companyfacts, 10-K/10-Q/8-K filings. |
| Economic and labor data | BLS, Census, BEA, FRED, Treasury FiscalData. |
| Standards and security | NIST, CISA, NVD, CVE, OMB, CIO.gov, NSA advisories. |

First use:

- filter by agencies and keywords tied to FTFN watch lanes,
- create candidate records for repeatable queries,
- promote the best query rails as source records.

### 3. Research, Science, And Technical Evidence

Use these to detect emerging work, but do not treat them as deployment proof.

| Source | Use |
| --- | --- |
| Crossref API | Scholarly metadata, funders, DOI records, journals, licenses, and updates. |
| OpenAlex API | Open scholarly works, authors, institutions, funders, publishers, topics, and sources. |
| PubMed / NCBI E-utilities | Biomedical, genomics, agriculture, and bioeconomy research discovery. |
| OSTI.GOV API | DOE-funded research publications and technical reports. |
| NSF Award Search API | U.S. NSF award, project, recipient, and outcome discovery. |
| NASA TechPort API | NASA active and completed technology project data. |
| NASA Technology Transfer API | NASA patent, software, and spinoff discovery. |
| PatentsView | USPTO research-grade patent and pre-grant publication data. |

First use:

- build topic-specific saved searches,
- separate "research result" from "field deployment,"
- pair research signals with funding, standards, or local records before publication.

### 4. Domain-Specific Operating Sources

These make FTFN useful as an analytical tool rather than a general news digest.

| Watch Lane | Source Expansion Pattern |
| --- | --- |
| Power and Grid | EIA, FERC, NERC, DOE, ISO/RTO queues, utility IRPs, transmission plans, interconnection queues. |
| Compute and Chips | CHIPS awards, NIST CHIPS pages, SEC filings, BIS export controls, local permits, workforce data. |
| Water | NOAA/NIDIS, USGS Water Services, Bureau of Reclamation, ADWR, CAP, municipal utilities, drought datasets. |
| Mobility Certification | FAA DRS, FAA certificates, NHTSA datasets, NHTSA SGO crash data, Federal Register, Regulations.gov. |
| Security and Standards | CISA KEV, NVD, CVE, CISA advisories, OMB, CIO.gov, FedRAMP, NIST CSRC. |
| Critical Minerals | USGS NMIC, USGS MRDS, DOE Critical Materials, USITC DataWeb, UN Comtrade, IEA mineral data. |
| Climate | NOAA CPC, NOAA NCEI, NOAA CDO, U.S. Drought Monitor, FEMA NRI, NWS local statements. |
| Agriculture and Bioeconomy | USDA NASS, USDA ERS, USDA APHIS, USDA NIFA, crop progress, PubMed/NCBI. |
| AI and Advanced Manufacturing | DOE Office of Science, OSTI, NSF awards, NIST OAM, NIST Data, Materials Project. |
| Space | NASA TechPort, NASA NTRS, FAA commercial space, FCC Space Bureau, NOAA remote sensing licensing. |
| Discovery Technologies | USGS 3DEP, National Map APIs, NASA Earthdata CMR, OpenTopography, NOAA Ocean Exploration. |
| Finance and Human Futures | StatCan, CMHC, Census BPS, BLS, FHFA, Treasury, municipal permit and application systems. |

### 5. Local System Source Templates

Local authority comes from record-level evidence. Each local system should have a source template that can be reused for every new place.

For a city or region:

```text
open data portal
planning application portal
building permit portal
inspection/status portal
zoning and land-use records
council agenda/minutes
infrastructure capital plan
water utility planning
electric utility planning
transportation agency plans
regional planning organization
property assessment records
procurement records
environmental permits
local hazard/climate records
workforce/labor data
major project pages
```

For the current two local systems, prioritize:

- ACC eDocket named records,
- APS/SRP/TEP utility planning documents,
- Phoenix SHAPE PHX records,
- Phoenix water and sewer records,
- Maricopa Association of Governments records,
- Toronto AIC named application files,
- Toronto permit/open-data records,
- Ontario data catalogue housing and infrastructure records,
- CMHC/StatCan geography-specific releases.

## Discovery Workflow

### Step 1: Build Keyword Packs

Create watch-lane keyword packs for broad catalog searches.

Examples:

```text
Power and Grid: interconnection, transmission, reliability, load growth, resource plan, data center, demand response
Compute and Chips: semiconductor, fab, advanced packaging, CHIPS, export controls, lithography, cleanroom
Water: assured water supply, groundwater, drought, reservoir, allocation, reuse, industrial water
Housing: permit, starts, completions, servicing, development application, zoning, occupancy
Cybersecurity: known exploited vulnerability, post-quantum, advisory, directive, vulnerability, patch
```

### Step 2: Search Meta-Catalogs

Use Data.gov, Government of Canada, Data.gov.uk, Eurostat, World Bank, OECD, and local open-data portals as source discovery engines. Save candidate sources before deciding whether they belong in the active source library.

### Step 3: Promote By Watch-Lane Gaps

Promote candidates where the source coverage matrix is weak:

```text
fewer than 4 Tier 1 sources
no API or feed source
no local conversion evidence
no dated source-update path
no source with record-level specificity
```

### Step 4: Feed The Private Queue

Once promoted, sources should enter the private update queue only when they have a clear review action:

```text
select a named docket
pull a bounded dataset release
select a grant or award
select a filing
select a permit/application record
select a standards update
select a dated advisory
```

### Step 5: Create Signals Only From Bounded Evidence

Signals should come from a selected item, not from a broad catalog.

Good:

```text
NOAA CPC 9 July 2026 ENSO Diagnostic Discussion
CISA KEV entry or bounded update window
Federal Register document number plus docket ID
Toronto AIC application file with status and date
ACC eDocket record with docket number and filing date
```

Weak:

```text
Data.gov has many datasets
Federal Register has many documents
Toronto has a planning portal
CISA has a vulnerability catalog
```

## Implementation Plan

### Phase A: Candidate Registry

- Add a private source-candidate registry in docs or a new non-public content collection.
- Seed it with 150 to 250 candidates from the meta-catalog and domain lanes.
- Keep candidate records out of public source pages until triaged.

### Phase B: Source Discovery Scripts

- Add no-write scripts that query selected public catalogs and output candidate JSON reports.
- Start with no-key or demo-key-compatible endpoints.
- Do not modify public source records automatically.

### Phase C: Promotion Batch

- Promote 25 to 40 candidates into active source records.
- Prioritize local dossier evidence, funding/procurement, research APIs, patents/IP, and missing official rails.
- Run validation and build.

Status:

Complete in Phase 49. FTFN promoted 36 active source records and expanded the source library from 66 to 102 records.

### Phase D: Queue And Signal Batch

- Move the best 10 to 20 promoted records into the private update queue.
- Create 4 to 6 new `In Review` signals from selected bounded evidence.
- Keep final publication review separate.

Status:

Started in Phase 49 and advanced in Phase 50. The private update queue includes 18 promoted-source review candidates; Phase 50 moved two of them into `In Review` signals: one Grants.gov/DOE critical-minerals funding opportunity and one MAG regional projections local-dossier signal.

## What To Avoid

- Do not add hundreds of public source records without triage.
- Do not let broad catalogs become direct evidence for claims.
- Do not mix company claims with official records without credibility labels.
- Do not create signals from search-result counts.
- Do not treat a research paper, patent, grant, or press release as proof of deployment.
- Do not make local readiness claims without named local records.

## Best Next Move

Create the candidate registry and seed it with the first 150 to 250 source candidates before another broad public promotion batch. The first 36-source promotion batch and six-item Phase 50 bounded conversion batch are complete, so the near-term emphasis should shift to Phase 51 named local evidence before the Phase 52 registry work.

For v0.2, the highest-value expansion order is:

1. Move 10 to 20 promoted sources through the private queue and select bounded source items.
2. Local evidence records for Arizona and Ontario.
3. Federal funding/procurement records from USAspending, Grants.gov, and GovInfo.
4. Research and technical records from OSTI, NSF Awards, NASA TechPort, Crossref, OpenAlex, and NCBI.
5. Patent, technology-transfer, and regulatory records from PatentsView, NASA Technology Transfer, FAA Commercial Space, FCC ICFS, NOAA remote sensing licensing, and USDA APHIS.
