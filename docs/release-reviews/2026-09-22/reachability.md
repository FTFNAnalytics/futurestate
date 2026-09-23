# Reachable release material — September 22, 2026

Candidate `ad0869ee8f974aba25febbf9ae69bff056d3b1bcd3e2e0919a0e54e51ed8e6c0`; receipt `204-FULL-LOCAL-VALIDATION-2026-09-22-c6b4baa97dd0`. This is a static-link inventory, not independent claim review or an approved release scope.

The 33 selected articles lead to **16627 HTML pages** through ordinary static navigation (624619 page-to-page links). This includes 1629 research-document routes and 458 briefing routes. 826 reached signal pages retain feed exclusions, including 825 with dated corrected presentations; an exclusion from the feed does not make the detail URL unreachable.

Selecting 33 articles does not isolate the hosted site to those articles. Review the reached historical claims or obtain an explicit scope decision before release; this inventory does neither and does not waive full-v1 requirements.

[Exact route hashes, parent paths and links](<C:/Users/justi/OneDrive/Documents/NextGen Transportation/outputs/release-reviews/2026-09-22/ad0869ee8f974aba25febbf9ae69bff056d3b1bcd3e2e0919a0e54e51ed8e6c0/reachability-download-aware.json>). The full diagnostic is retained in local outputs rather than inflating the source repository. Its SHA-256 is `c651d79bfcebd1bd7dad0fec4a0dd63dfdea33379d7f2765976b9b6f066ed3e0`; [the compact tracked summary](<C:/Users/justi/OneDrive/Documents/NextGen Transportation/docs/release-reviews/2026-09-22/reachability-summary.json>) binds its size and validation run. Reproduce with `node app/scripts/build-release-reachability.mjs <terminal-results.json>` after successful validation. Each parent chain leads back to a selected article. 0 other generated HTML pages were not reached by this static traversal; that is not proof of inaccessibility.

## Scope and limits

Ordinary anchor links in the parsed HTML were included, even in navigation and collapsed details. Same-origin anchors with the download attribute are recorded as terminal downloads, including HTML files; their interiors are not traversed as site navigation. Query strings and fragments do not create separate pages. External URLs and non-HTML local files are terminal; their content and JSON-contained routes need separate review. Dynamic-only links, actual browser download completion and assistive-technology behavior were not tested. No reviewer or disposition was invented.

The ordinary-navigation set includes 16627 application pages and 0 retained HTML artifacts. A separate 25 HTML files are linked with download markup. Their saved source menus would have 435 distinct unresolved targets if served as site HTML, but the reader document template already requests a download and offers a separate original-source link. This is not an established application-navigation defect and does not require rewriting preserved source bytes. Source-content review remains pending. The earlier diagnostic counted these download links as ordinary navigation; its bytes remain saved and this report corrects that interpretation. Actual HTML base elements are honored. Edge counts are distinct source/target pairs, not repeated anchors.

All 16 repaired targets were compared against the exact broken-path list in the independent September 9 audit, not merely a count. Every current canonical target and required anchor exists; the summary pins its rendered hash. This is a local regression of that historical audit, not a new independent review or hosted rewrite test. The full validation separately checks generated application-local href/src targets, excluding downloaded third-party HTML interiors.

## Directly linked HTML outside the selected 33

209 one-hop routes are listed to start the review; the JSON retains the entire transitive set.

| Route | Page title | Feed exclusion |
| --- | --- | --- |
| `/` | FTFN \| Future-State Intelligence | Not an exclusion determination |
| `/about/` | About \| FTFN | Not an exclusion determination |
| `/atlas/` | Atlas \| FTFN | Not an exclusion determination |
| `/atlas/places/hanford-waste-treatment/` | Hanford waste treatment \| FTFN Place Atlas | Not an exclusion determination |
| `/atlas/places/us-southwest-chip-corridor/` | U.S. Southwest Chip Corridor \| FTFN Place Atlas | Not an exclusion determination |
| `/atlas/projects/` | Project Atlas \| FTFN | Not an exclusion determination |
| `/atlas/sources/source-117-global-france-ademe/` | ADEME \| FTFN | Not an exclusion determination |
| `/atlas/sources/source-117-global-france-insee/` | INSEE \| FTFN | Not an exclusion determination |
| `/atlas/sources/source-117-global-france-ministry-for-ecological-transition/` | Ministry for Ecological Transition \| FTFN | Not an exclusion determination |
| `/atlas/sources/source-117-global-france-rte/` | RTE \| FTFN | Not an exclusion determination |
| `/atlas/sources/source-117-global-japan-e-stat-japan/` | e-Stat Japan \| FTFN | Not an exclusion determination |
| `/atlas/sources/source-117-global-japan-ministry-of-economy-trade-and-industry/` | Ministry of Economy, Trade and Industry \| FTFN | Not an exclusion determination |
| `/atlas/sources/source-117-global-japan-ministry-of-land-infrastructure-transport-and-tourism/` | Ministry of Land, Infrastructure, Transport and Tourism \| FTFN | Not an exclusion determination |
| `/atlas/sources/source-117-global-japan-new-energy-and-industrial-technology-development-organization/` | New Energy and Industrial Technology Development Organization \| FTFN | Not an exclusion determination |
| `/atlas/sources/source-55z-nasa-ai-use-cases-2024/` | NASA 2024 AI Use Cases \| FTFN | Not an exclusion determination |
| `/atlas/sources/source-56b-eia860-2021/` | Form EIA-860 Final Data: 2021 \| FTFN | Not an exclusion determination |
| `/atlas/sources/source-56b-eia860-2022/` | Form EIA-860 Final Data: 2022 \| FTFN | Not an exclusion determination |
| `/atlas/sources/source-56b-eia860-2023/` | Form EIA-860 Final Data: 2023 \| FTFN | Not an exclusion determination |
| `/atlas/sources/source-56c-gateway-cpuc-audit-2025/` | CPUC Audit Findings of Gateway Energy Storage \| FTFN | Not an exclusion determination |
| `/atlas/sources/source-56c-gateway-cpuc-audit-response-2025/` | Gateway Energy Storage Response to CPUC Audit Findings \| FTFN | Not an exclusion determination |
| `/atlas/sources/source-56c-manatee-psc-operating-data-2025/` | Florida PSC Staff's First Data Request: Manatee Battery Energy Storage System \| FTFN | Not an exclusion determination |
| `/atlas/sources/source-56c-manatee-psc-rate-testimony-2025/` | Florida PSC Rate Testimony on the Manatee Battery Energy Storage System \| FTFN | Not an exclusion determination |
| `/atlas/sources/source-56c-moss-landing-audit-2025/` | CPUC Generation Audit of Moss Landing Power Plant \| FTFN | Not an exclusion determination |
| `/atlas/sources/source-56c-moss-landing-audit-response-2025/` | Moss Landing Power Plant Response to CPUC Audit Findings \| FTFN | Not an exclusion determination |
| `/atlas/sources/source-56d-gateway-cpuc-resolution-e5428-2025/` | CPUC Resolution E-5428: Gateway Thermal Event and Partial Return \| FTFN | Not an exclusion determination |
| `/atlas/sources/source-56d-gateway-epa-bess-safety-2025/` | EPA Battery Energy Storage Safety and Incident-Response Considerations \| FTFN | Not an exclusion determination |
| `/atlas/sources/source-56d-manatee-fpl-data-request-2025/` | FPL Ten-Year Site Plan Staff Data Request: Manatee Energy Storage \| FTFN | Not an exclusion determination |
| `/atlas/sources/source-56d-manatee-fpl-site-plan-2025/` | Florida Power & Light 2025 Ten-Year Site Plan \| FTFN | Not an exclusion determination |
| `/atlas/sources/source-56d-moss-landing-epa-agreement-2025/` | EPA Agreement for Moss Landing Battery Removal \| FTFN | Not an exclusion determination |
| `/atlas/sources/source-56d-moss-landing-epa-response-timeline-2026/` | Moss Landing Vistra Battery Fire Response Timeline \| FTFN | Not an exclusion determination |
| `/atlas/sources/source-56e-dalrymple-aemo-minimum-demand-2020/` | South Australia Minimum Operational Demand Thresholds Review \| FTFN | Not an exclusion determination |
| `/atlas/sources/source-56e-dalrymple-arena-final-2021/` | ESCRI-SA Battery Energy Storage: Final Report \| FTFN | Not an exclusion determination |
| `/atlas/sources/source-56e-dalrymple-arena-operational-2020/` | ESCRI-SA Battery Energy Storage: Operational Report 2 \| FTFN | Not an exclusion determination |
| `/atlas/sources/source-56e-dalrymple-arena-retrospective-2021/` | Dalrymple Battery Shows the Way Forward \| FTFN | Not an exclusion determination |
| `/atlas/sources/source-56e-f15ex-first-deliveries-2021/` | Air Force Receives First F-15EX Aircraft \| FTFN | Not an exclusion determination |
| `/atlas/sources/source-56e-f15ex-four-deliveries-2023/` | Third and Fourth F-15EX Aircraft Arrive at Eglin \| FTFN | Not an exclusion determination |
| `/atlas/sources/source-56e-f15ex-gao-2025/` | Weapon Systems Annual Assessment: F-15EX \| FTFN | Not an exclusion determination |
| `/atlas/sources/source-56e-f15ex-production-resumes-2025/` | F-15EX Production Rebounds, Deliveries Continue \| FTFN | Not an exclusion determination |
| `/atlas/sources/source-56e-hornsdale-aemo-2019-preliminary/` | South Australia-Victoria Separation: Preliminary Incident Report \| FTFN | Not an exclusion determination |
| `/atlas/sources/source-56e-hornsdale-aemo-2020-final/` | Victoria and South Australia Separation Event: Final Report \| FTFN | Not an exclusion determination |
| `/atlas/sources/source-56e-hornsdale-aer-2022/` | AER v Hornsdale Power Reserve Pty Ltd \| FTFN | Not an exclusion determination |
| `/atlas/sources/source-56e-hornsdale-sa-current/` | Existing Renewable Energy Installations: Hornsdale \| FTFN | Not an exclusion determination |
| `/atlas/sources/source-56e-vbb-aemo-operational-2021/` | Victorian Big Battery Delivering Energy Reserves \| FTFN | Not an exclusion determination |
| `/atlas/sources/source-56e-vbb-aemo-registration-2021/` | Victorian Big Battery Registration Update \| FTFN | Not an exclusion determination |
| `/atlas/sources/source-56e-vbb-esv-fire-findings-2021/` | Victorian Big Battery Fire: Technical Findings \| FTFN | Not an exclusion determination |
| `/atlas/sources/source-56e-vbb-esv-investigations/` | Electrical Incident and Technical Investigation Reports \| FTFN | Not an exclusion determination |
| `/atlas/sources/source-56g-dalrymple-electranet-tapr-2026/` | ElectraNet 2026 Transmission Annual Planning Report \| FTFN | Not an exclusion determination |
| `/atlas/sources/source-56h-dalrymple-aemo-constraint-report-2026/` | AEMO February 2026 Monthly Constraint Report \| FTFN | Not an exclusion determination |
| `/atlas/sources/source-56h-hornsdale-final-project-report-2026/` | Hornsdale Power Reserve Expansion Final Project Report \| FTFN | Not an exclusion determination |
| `/atlas/sources/source-56i-eia923-may2026-release/` | Form EIA-923 Detailed Data — May 2026 Monthly Release \| FTFN | Not an exclusion determination |
| `/atlas/sources/source-56j-dalrymple-aemo-march-2026/` | AEMO March 2026 Monthly Constraint Report \| FTFN | Not an exclusion determination |
| `/atlas/sources/source-56j-hornsdale-h1-2024-operations/` | Hornsdale Power Reserve Expansion Operations Report — H1 2024 \| FTFN | Not an exclusion determination |
| `/atlas/sources/source-56j-manatee-eia923-plant-60014/` | EIA-923 May 2026 Energy Storage Rows — Plant 60014 \| FTFN | Not an exclusion determination |
| `/atlas/sources/source-56k-f15ex-ex16-portland-receipt-2026/` | 142nd Wing: EX16 Comes to Portland \| FTFN | Not an exclusion determination |
| `/atlas/sources/source-56k-moss-landing-go167-corrective-action-2025/` | Moss Landing Power Plant GO 167 Corrective Action Plan and Response \| FTFN | Not an exclusion determination |
| `/atlas/sources/source-56x-gao-iija-ira-agency-status-2026/` | GAO-26-108434 full report: agency-specific IIJA and IRA funding status \| FTFN | Not an exclusion determination |
| `/atlas/sources/source-56x-hanford-first-ilaw-disposal-2026/` | DOE EM: Hanford disposes first batch of vitrified low-activity waste \| FTFN | Not an exclusion determination |
| `/atlas/sources/source-56x-hanford-vitrification-100k-2026/` | DOE EM: Over 100,000 Gallons of Hanford Tank Waste Turned to Glass \| FTFN | Not an exclusion determination |
| `/atlas/sources/source-57a-wa-ecology-hanford-overview/` | Washington State Department of Ecology Hanford overview \| FTFN | Not an exclusion determination |
| `/atlas/sources/source-57b-ecology-wtp-byproduct-response-comments/` | Washington Ecology response to comments on WTP byproduct permit modification \| FTFN | Not an exclusion determination |
| `/atlas/sources/source-57b-hanford-wtp-project-managers-may-2026/` | Hanford WTP Tri-Party Agreement project managers meeting minutes, May 2026 \| FTFN | Not an exclusion determination |
| `/atlas/sources/source-57d-hanford-wtp-consent-july-2026/` | Hanford Field Office Consent Decree Monthly Report, July 2026 Meeting \| FTFN | Not an exclusion determination |
| `/atlas/sources/source-57d-hanford-wtp-consent-june-2026/` | Hanford Field Office Consent Decree Monthly Report, June 2026 Meeting \| FTFN | Not an exclusion determination |
| `/atlas/sources/source-57d-hanford-wtp-consent-may-2026/` | Hanford Field Office Consent Decree Monthly Report, May 2026 Meeting \| FTFN | Not an exclusion determination |
| `/atlas/sources/source-57e-doe-hanford-acceptable-glass-startup/` | DOE EM: The Hanford Site Begins Solidifying Tank Waste in Glass \| FTFN | Not an exclusion determination |
| `/atlas/sources/source-57e-hanford-dflaw-current-program-page/` | Hanford Direct-Feed Low-Activity Waste Program Page, July 2026 \| FTFN | Not an exclusion determination |
| `/atlas/sources/source-57f-doe-hanford-100k-gallons-may-2026/` | DOE EM: Over 100,000 Gallons of Hanford Tank Waste Turned to Glass \| FTFN | Not an exclusion determination |
| `/atlas/sources/source-57f-hanford-wtp-pmm-february-2026/` | Hanford Tank Waste Operations Project Managers Meeting Minutes, February 12, 2026 \| FTFN | Not an exclusion determination |
| `/atlas/sources/source-57g-hanford-dflaw-process-animation/` | DOE Hanford Direct-Feed Low-Activity Waste Process Animation \| FTFN | Not an exclusion determination |
| `/atlas/sources/source-blm-rhyolite-ridge-rod-2024/` | BLM Rhyolite Ridge Lithium-Boron Project Record Of Decision \| FTFN | Not an exclusion determination |
| `/atlas/sources/source-blm-thacker-pass-rod-2021/` | BLM Thacker Pass Lithium Mine Record Of Decision \| FTFN | Not an exclusion determination |
| `/atlas/sources/source-bls-qcew-data-files/` | BLS Quarterly Census of Employment and Wages Data Files \| FTFN | Not an exclusion determination |
| `/atlas/sources/source-census-acs-five-year-api/` | U.S. Census American Community Survey 5-Year API \| FTFN | Not an exclusion determination |
| `/atlas/sources/source-cfia-2026-directive-94-08/` | CFIA 2026 Directive 94-08 for Plants with Novel Traits \| FTFN | Not an exclusion determination |
| `/atlas/sources/source-cfia-plants-novel-traits/` | CFIA Plants with Novel Traits \| FTFN | Not an exclusion determination |
| `/atlas/sources/source-city-toronto-application-information-centre/` | City of Toronto Application Information Centre \| FTFN | Not an exclusion determination |
| `/atlas/sources/source-cmhc-housing-market-information-portal/` | CMHC Housing Market Information Portal \| FTFN | Not an exclusion determination |
| `/atlas/sources/source-cmhc-june-2026-housing-starts-construction/` | CMHC June 2026 Housing Starts And Construction Data \| FTFN | Not an exclusion determination |
| `/atlas/sources/source-cmhc-starts-completions-under-construction/` | CMHC Housing Starts, Completions and Units Under Construction Tables \| FTFN | Not an exclusion determination |
| `/atlas/sources/source-doe-critical-materials-collaborative/` | DOE Critical Materials Collaborative \| FTFN | Not an exclusion determination |
| `/atlas/sources/source-doe-critical-minerals-materials-program/` | DOE Critical Minerals and Materials Program \| FTFN | Not an exclusion determination |
| `/atlas/sources/source-doe-rhyolite-ridge-nepa-2025/` | DOE Rhyolite Ridge Loan NEPA Record Of Decision \| FTFN | Not an exclusion determination |
| `/atlas/sources/source-doe-thacker-pass-loan-2024/` | DOE Loan Programs Office Thacker Pass Financial Close \| FTFN | Not an exclusion determination |
| `/atlas/sources/source-gsa-pqc-buyers-guide-2025/` | GSA Post-Quantum Cryptography Buyer's Guide \| FTFN | Not an exclusion determination |
| `/atlas/sources/source-ieso-2026-annual-planning-outlook/` | IESO 2026 Annual Planning Outlook \| FTFN | Not an exclusion determination |
| `/atlas/sources/source-ieso-annual-planning-outlook/` | IESO Annual Planning Outlook \| FTFN | Not an exclusion determination |
| `/atlas/sources/source-nasa-earthdata-cmr-api/` | NASA Earthdata Common Metadata Repository API \| FTFN | Not an exclusion determination |
| `/atlas/sources/source-nasa-ksc-prescribed-burn-2026/` | NASA Kennedy Active-Countdown Prescribed Burn Record \| FTFN | Not an exclusion determination |
| `/atlas/sources/source-nasa-nisar-public-data-july-2026/` | NASA NISAR Public Science Data Release, July 2026 \| FTFN | Not an exclusion determination |
| `/atlas/sources/source-ndep-rhyolite-ridge-air-permit/` | NDEP Rhyolite Ridge Class II Air Quality Operating Permit File \| FTFN | Not an exclusion determination |
| `/atlas/sources/source-ndep-rhyolite-ridge-water-permit-2025/` | NDEP Rhyolite Ridge Water Pollution Control Permit NEV2020107 \| FTFN | Not an exclusion determination |
| `/atlas/sources/source-ndep-thacker-pass-permit-decisions-2022/` | Nevada DEP Thacker Pass Final Permit Decisions \| FTFN | Not an exclusion determination |
| `/atlas/sources/source-ndep-thacker-pass-project/` | Nevada DEP Thacker Pass Project Permit Hub \| FTFN | Not an exclusion determination |
| `/atlas/sources/source-ndep-thacker-pass-water-permit/` | Nevada DEP Thacker Pass Water Pollution Control Permit \| FTFN | Not an exclusion determination |
| `/atlas/sources/source-nevada-water-rights/` | Nevada Division Of Water Resources Water Rights \| FTFN | Not an exclusion determination |
| `/atlas/sources/source-nist-aria-evaluation-program/` | NIST Assessing Risks and Impacts of AI Evaluation Program \| FTFN | Not an exclusion determination |
| `/atlas/sources/source-nist-aria-pilot-evaluation-2025/` | NIST ARIA 0.1 Pilot Evaluation Report \| FTFN | Not an exclusion determination |
| `/atlas/sources/source-nist-hqc-selection-2025/` | NIST HQC Post-Quantum Algorithm Selection \| FTFN | Not an exclusion determination |
| `/atlas/sources/source-nist-metis-semiconductor-data-exchange/` | NIST METIS Semiconductor Metrology Data Exchange \| FTFN | Not an exclusion determination |
| `/atlas/sources/source-nist-piv-pqc-working-drafts-2026/` | NIST Working Drafts for PQC Updates to PIV Standards \| FTFN | Not an exclusion determination |
| `/atlas/sources/source-nist-pqc/` | NIST Post-Quantum Cryptography Project \| FTFN | Not an exclusion determination |
| `/atlas/sources/source-nist-semiconductor-metrology-program/` | NIST Semiconductor Metrology Program \| FTFN | Not an exclusion determination |
| `/atlas/sources/source-noaa-cpc-enso/` | NOAA Climate Prediction Center ENSO Diagnostic Discussion \| FTFN | Not an exclusion determination |
| `/atlas/sources/source-nsf-2026-idss-awards/` | NSF 2026 Integrated Data Systems and Services Awards \| FTFN | Not an exclusion determination |
| `/atlas/sources/source-nsf-2026-nairr-progress/` | NSF NAIRR Two-Year Progress Update \| FTFN | Not an exclusion determination |
| `/atlas/sources/source-nsf-award-search-api/` | NSF Award Search API \| FTFN | Not an exclusion determination |
| `/atlas/sources/source-oeb-applications/` | Ontario Energy Board Applications \| FTFN | Not an exclusion determination |
| `/atlas/sources/source-oeb-toronto-hydro-eb-2023-0195/` | OEB Toronto Hydro 2025-2029 Distribution Rates Proceeding EB-2023-0195 \| FTFN | Not an exclusion determination |
| `/atlas/sources/source-omb-m-26-15-pqc-migration/` | OMB M-26-15: Execution of the Migration to Post-Quantum Cryptography \| FTFN | Not an exclusion determination |
| `/atlas/sources/source-ontario-data-catalogue/` | Ontario Data Catalogue \| FTFN | Not an exclusion determination |
| `/atlas/sources/source-ontario-housing-supply-progress/` | Ontario Housing Supply Progress Tracker \| FTFN | Not an exclusion determination |
| `/atlas/sources/source-phoenix-tsmc-2026-wastewater-development-agreement/` | Phoenix City Council May 2026 TSMC Wastewater Facilities Development Agreement \| FTFN | Not an exclusion determination |
| `/atlas/sources/source-phoenix-tsmc-july-2026-fab-update/` | City of Phoenix July 2026 TSMC Arizona Fab Update \| FTFN | Not an exclusion determination |
| `/atlas/sources/source-statcan-building-permits-survey/` | Statistics Canada Building Permits Survey \| FTFN | Not an exclusion determination |
| `/atlas/sources/source-statcan-web-data-service/` | Statistics Canada Web Data Service \| FTFN | Not an exclusion determination |
| `/atlas/sources/source-toronto-2026-sc33-9-item-history/` | Toronto Agenda Item 2026.SC33.9 for Application 24 254930 \| FTFN | Not an exclusion determination |
| `/atlas/sources/source-toronto-24-254930-june-2026-decision-report/` | Toronto Decision Report For Planning Application 24 254930 ESC 20 OZ \| FTFN | Not an exclusion determination |
| `/atlas/sources/source-toronto-building-permits/` | City of Toronto Building Permit Application and Inspection Status \| FTFN | Not an exclusion determination |
| `/atlas/sources/source-toronto-capital-projects-pipeline/` | Toronto Capital Projects Pipeline \| FTFN | Not an exclusion determination |
| `/atlas/sources/source-toronto-cleared-building-permits/` | Toronto Cleared Building Permits Open Data \| FTFN | Not an exclusion determination |
| `/atlas/sources/source-toronto-development-applications-open-data/` | Toronto Development Applications Open Data \| FTFN | Not an exclusion determination |
| `/atlas/sources/source-toronto-development-guide/` | City of Toronto Development Guide \| FTFN | Not an exclusion determination |
| `/atlas/sources/source-toronto-development-pipeline-2025/` | City of Toronto Development Pipeline 2025 \| FTFN | Not an exclusion determination |
| `/atlas/sources/source-toronto-hydro-regulatory-documents/` | Toronto Hydro Regulatory Documents \| FTFN | Not an exclusion determination |
| `/atlas/sources/source-toronto-open-data/` | City of Toronto Open Data \| FTFN | Not an exclusion determination |
| `/atlas/sources/source-toronto-water-2026-capital-plan/` | Toronto Water 2026-2035 Capital Budget and Plan \| FTFN | Not an exclusion determination |
| `/atlas/sources/source-toronto-water-budget-capital-plan/` | Toronto Water Budget and Capital Plan \| FTFN | Not an exclusion determination |
| `/atlas/sources/source-usaspending-api/` | USAspending API \| FTFN | Not an exclusion determination |
| `/atlas/sources/source-usda-nifa-plant-breeding-awards-2026/` | USDA NIFA Plant Breeding Awards, March 2026 \| FTFN | Not an exclusion determination |
| `/atlas/sources/source-usda-nifa-plant-genomics/` | USDA NIFA Plant Breeding, Genetics and Genomics Programs \| FTFN | Not an exclusion determination |
| `/atlas/sources/source-usda-wasde/` | USDA World Agricultural Supply and Demand Estimates \| FTFN | Not an exclusion determination |
| `/atlas/sources/source-usgcrp-nca5-transportation/` | Fifth National Climate Assessment Chapter 13: Transportation \| FTFN | Not an exclusion determination |
| `/atlas/sources/source-usgs-earth-mri/` | USGS Earth Mapping Resources Initiative \| FTFN | Not an exclusion determination |
| `/atlas/sources/source-usgs-mineral-commodity-summaries/` | USGS Mineral Commodity Summaries \| FTFN | Not an exclusion determination |
| `/atlas/sources/source-usgs-mineral-resources-data/` | USGS Mineral Resources Data \| FTFN | Not an exclusion determination |
| `/atlas/sources/source-white-house-eo-14412-pqc-migration/` | Executive Order 14412: Securing the Nation Against Advanced Cryptographic Attacks \| FTFN | Not an exclusion determination |
| `/briefings/` | Briefings \| FTFN | Not an exclusion determination |
| `/data/` | Data Exports \| FTFN | Not an exclusion determination |
| `/method/` | Method and Publication Policy \| FTFN | Not an exclusion determination |
| `/method/editorial-review/` | Editorial classification review \| FTFN | Not an exclusion determination |
| `/reference/` | FTFN Public Reference \| Topics, places, projects, outcomes and constraints | Not an exclusion determination |
| `/reference/explore/1/` | Explore the reference \| FTFN | Not an exclusion determination |
| `/reference/failure-casebooks/` | Failure, Delay, Reversal, and Correction Casebooks \| FTFN Public Reference | Not an exclusion determination |
| `/reference/global-places-ii/` | Global Place Systems Atlas \| FTFN Public Reference | Not an exclusion determination |
| `/reference/international-projects/` | International Named-Project Conversion Cohort \| FTFN Public Reference | Not an exclusion determination |
| `/reference/questions/` | Canonical Question Library \| FTFN Public Reference | Not an exclusion determination |
| `/reference/state-of-future-systems/` | State of Future Systems 2026 \| FTFN Public Reference | Not an exclusion determination |
| `/reference/topic-canon/` | Canonical Topic Edition 2 \| FTFN Public Reference | Not an exclusion determination |
| `/reference/topics/agriculture-and-bioeconomy/edition-2/` | Genome-edited livestock: authorization is not a field-outcome series \| FTFN | Not an exclusion determination |
| `/reference/topics/climate/edition-2/` | Climate constraints: connect the regional signal to the actual asset \| FTFN | Not an exclusion determination |
| `/reference/topics/discovery-technologies/edition-2/` | From instrument to discovery: preserve the measurement and inference boundary \| FTFN | Not an exclusion determination |
| `/reference/topics/quantum/edition-2/` | Quantum progress: memory, logical operations and useful applications are different tests \| FTFN | Not an exclusion determination |
| `/research/` | Research Collections \| FTFN | Not an exclusion determination |
| `/review/` | The FTFN Review \| Public Reference Edition | Not an exclusion determination |
| `/review/casebooks/expanded/hanford-dflaw-operation/` | Hanford DFLAW operation \| FTFN casebook | Not an exclusion determination |
| `/review/casebooks/tsmc-arizona/` | TSMC Arizona campus \| FTFN casebook | Not an exclusion determination |
| `/review/evidence-cycle/arizona-wastewater/` | Phoenix and TSMC wastewater delivery and operation \| Evidence Cycle 001 | Not an exclusion determination |
| `/review/fieldbook/delivery-biographies/` | Project and Place Conversion Biographies \| FTFN | Not an exclusion determination |
| `/review/fieldbook/topics/agriculture-and-bioeconomy/` | Agriculture and Bioeconomy state of evidence \| FTFN v0.6 | Not an exclusion determination |
| `/review/fieldbook/topics/climate/` | Climate state of evidence \| FTFN v0.6 | Not an exclusion determination |
| `/review/fieldbook/topics/discovery-technologies/` | Discovery Technologies state of evidence \| FTFN v0.6 | Not an exclusion determination |
| `/review/fieldbook/topics/quantum/` | Quantum state of evidence \| FTFN v0.6 | Not an exclusion determination |
| `/review/global/places/france-place-acquisition/` | france-place-acquisition \| FTFN | Not an exclusion determination |
| `/review/global/places/japan-place-acquisition/` | japan-place-acquisition \| FTFN | Not an exclusion determination |
| `/review/global/places/ontario-real-estate/` | Ontario, Canada \| FTFN | Not an exclusion determination |
| `/review/global/places/south-australia-grid-storage/` | South Australia, Australia \| FTFN | Not an exclusion determination |
| `/review/global/projects/dalrymple-grid-battery/` | Dalrymple grid battery \| FTFN | Not an exclusion determination |
| `/review/global/projects/france-acquisition-1/` | france-acquisition-1 \| FTFN | Not an exclusion determination |
| `/review/global/projects/hornsdale-power-reserve/` | Hornsdale Power Reserve \| FTFN | Not an exclusion determination |
| `/review/global/projects/japan-acquisition-1/` | japan-acquisition-1 \| FTFN | Not an exclusion determination |
| `/review/global/projects/toronto-24-254930/` | Victoria Park Avenue and Thora Avenue application 24 254930 \| FTFN | Not an exclusion determination |
| `/review/global/projects/victoria-big-battery/` | Victoria Big Battery \| FTFN | Not an exclusion determination |
| `/review/global/questions/agriculture-and-bioeconomy/116-q-006/` | How do approvals, finance, infrastructure, processing capacity and offtake agreements move agricultural and bioeconomy innovations into field implementation? \| FTFN | Not an exclusion determination |
| `/review/global/questions/chips-and-compute/116-q-017/` | Which named fabs, data centers and compute services have defensible baselines for installed, available and qualified capacity? \| FTFN | Not an exclusion determination |
| `/review/global/questions/climate/116-q-021/` | Which hazards, exposures, vulnerabilities and adaptive capacities have stable baselines at decision-relevant geographies? \| FTFN | Not an exclusion determination |
| `/review/global/questions/critical-minerals/116-q-027/` | Which accepted shipments and recurring qualified-output records establish reliable supply into named receiving systems? \| FTFN | Not an exclusion determination |
| `/review/global/questions/discovery-technologies/116-q-033/` | Which instruments, platforms and research methods have reproducible performance baselines on named scientific tasks? \| FTFN | Not an exclusion determination |
| `/review/global/questions/energy/116-q-039/` | Which commissioning, acceptance, dispatch and recurring-service records establish dependable operating contribution? \| FTFN | Not an exclusion determination |
| `/review/global/questions/human-futures/116-q-047/` | Which accepted and repeated services establish real availability, accessibility, quality and use for defined populations? \| FTFN | Not an exclusion determination |
| `/review/global/questions/mobility/116-q-051/` | Which acceptance, availability, trip, maintenance and incident records establish sustained service? \| FTFN | Not an exclusion determination |
| `/review/global/questions/policy-and-standards/116-q-053/` | Which laws, rules, standards, permits and institutional responsibilities currently govern each priority conversion pathway? \| FTFN | Not an exclusion determination |
| `/review/global/questions/policy-and-standards/116-q-054/` | Which budgets, procurements, implementation plans, inspections and enforcement actions convert formal authority into practice? \| FTFN | Not an exclusion determination |
| `/review/global/questions/quantum/116-q-057/` | Which quantum systems and use cases have reproducible baselines for fidelity, scale, error, runtime, cost and classical alternatives? \| FTFN | Not an exclusion determination |
| `/review/global/questions/water/116-q-067/` | Which accepted-flow, quality, compliance and repeated-service records establish dependable operation? \| FTFN | Not an exclusion determination |
| `/review/v08/longitudinal/` | Longitudinal evidence eligibility \| FTFN | Not an exclusion determination |
| `/review/v08/projects/` | Named project chronicles \| FTFN | Not an exclusion determination |
| `/review/v08/projects/hanford-dflaw-operation/` | Hanford DFLAW operation \| FTFN | Not an exclusion determination |
| `/review/v08/projects/tsmc-arizona/` | TSMC Arizona campus \| FTFN | Not an exclusion determination |
| `/review/v08/readiness/` | Atlas conversion-readiness audit \| FTFN | Not an exclusion determination |
| `/review/v1reference/failure-delay-reversal-correction-casebooks/dalrymple-grid-battery/` | Dalrymple grid battery: failure, delay, reversal, and correction research packet \| FTFN | Not an exclusion determination |
| `/review/v1reference/failure-delay-reversal-correction-casebooks/f15ex-production-delivery/` | F-15EX production and delivery: failure, delay, reversal, and correction research packet \| FTFN | Not an exclusion determination |
| `/review/v1reference/failure-delay-reversal-correction-casebooks/toronto-24-254930/` | Toronto application 24 254930: failure, delay, reversal, and correction research packet \| FTFN | Not an exclusion determination |
| `/review/v1reference/failure-delay-reversal-correction-casebooks/victoria-big-battery/` | Victoria Big Battery: failure, delay, reversal, and correction research packet \| FTFN | Not an exclusion determination |
| `/signals/` | Signals \| FTFN | Not an exclusion determination |
| `/signals/56z-hanford-dflaw-accepted-operation-sequence/` | Hanford DFLAW: first permanent disposal follows hot commissioning and precedes steady-state operation \| FTFN | Not an exclusion determination |
| `/signals/57a-hanford-idf-regulator-confirmed-acceptance/` | Washington Ecology confirms IDF began accepting vitrified waste in April 2026 \| FTFN | Not an exclusion determination |
| `/signals/57a-hanford-law-facility-regulator-confirmed-operation/` | Washington Ecology confirms Hanford's Low-Activity Waste Facility is operating \| FTFN | Not an exclusion determination |
| `/signals/57b-hanford-ecology-50000-gallons-34-containers/` | Washington Ecology records about 50,000 gallons treated into 34 containers \| FTFN | Not an exclusion determination |
| `/signals/57b-hanford-joint-minutes-66-containers-shipped/` | Hanford project minutes report 66 LAW containers shipped to IDF by May 2026 \| FTFN | Not an exclusion determination |
| `/signals/57c-hanford-first-ilaw-disposal-boundary/` | Hanford establishes first ILAW disposal while exact accepted and disposed counts remain separate \| FTFN | Not an exclusion determination |
| `/signals/57d-hanford-material-flow-stage-ledger/` | Hanford's monthly reports expose the material-flow stages without collapsing them \| FTFN | Not an exclusion determination |
| `/signals/57d-hanford-monthly-waste-feed-series/` | Hanford reports compatible April and May WTP waste-feed observations \| FTFN | Not an exclusion determination |
| `/signals/57e-hanford-acceptable-glass-milestone/` | Hanford met the consent-decree milestone for acceptable-quality immobilized glass \| FTFN | Not an exclusion determination |
| `/signals/57f-hanford-container-progression-reconciliation/` | Hanford's 19 sent, 34 filled, 66 shipped, and approximately 30 staged observations form a stage ledger, not a mass balance \| FTFN | Not an exclusion determination |
| `/signals/57g-hanford-fourteen-stage-dflaw-registry/` | FTFN historical Hanford lifecycle schematic \| FTFN | Yes; still reachable |
| `/signals/57g-hanford-nine-observation-stage-ledger/` | FTFN historical Hanford bounded-observation analysis \| FTFN | Yes; still reachable |
| `/signals/phoenix-tsmc-fab1-production-fab2-construction-complete/` | Phoenix records TSMC Fab 1 in volume production and Fab 2 construction complete \| FTFN | Not an exclusion determination |
| `/signals/phoenix-tsmc-wastewater-infrastructure-reclaimed-water-milestones/` | Phoenix and TSMC define an interim wastewater path tied to reclaimed-water milestones \| FTFN | Not an exclusion determination |
| `/updates/` | Updates and Corrections \| FTFN | Not an exclusion determination |
