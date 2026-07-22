# Sample Records

This document contains first-pass sample records for FTFN.

These records are for modeling and product testing. They are not publish-ready editorial content. Before publication, each signal needs source-specific date verification, editorial review, and source-link validation.

Source URLs were checked against official or primary pages on 2026-05-26.

## First 10 Source Records

```yaml
sources:
  - id: source-noaa-cpc-enso
    name: NOAA Climate Prediction Center ENSO Diagnostic Discussion
    url: https://www.cpc.ncep.noaa.gov/products/analysis_monitoring/enso_advisory/index.html
    source_type: Government Agency
    credibility_level: Tier 1
    primary_topics:
      - Climate
      - Water
    framework_layers:
      - Planetary Conditions
    country_or_region: United States / Global
    update_frequency: Monthly, with related weekly condition updates
    capture_priority: High
    known_limitations: Forecasts are probabilistic and need local interpretation.
    last_checked_date: 2026-05-26
    notes: Anchor source for ENSO signals.

  - id: source-usgs-mineral-commodity-summaries
    name: USGS Mineral Commodity Summaries
    url: https://pubs.usgs.gov/publication/mcs2026
    source_type: Government Agency
    credibility_level: Tier 1
    primary_topics:
      - Critical Minerals
    framework_layers:
      - Resource Foundations
    country_or_region: United States / Global
    update_frequency: Annual
    capture_priority: High
    known_limitations: Annual summaries may lag fast-moving market and policy changes.
    last_checked_date: 2026-05-26
    notes: Core source for mineral production, reserves, imports, and supply-chain context.

  - id: source-nist-chips
    name: NIST CHIPS for America
    url: https://www.nist.gov/chips
    source_type: Government Agency
    credibility_level: Tier 1
    primary_topics:
      - Chips and Compute
      - Advanced Manufacturing
    framework_layers:
      - Enabling Infrastructure
      - Human Systems
    country_or_region: United States
    update_frequency: Irregular
    capture_priority: High
    known_limitations: Program updates need to be separated from actual facility completion or production capacity.
    last_checked_date: 2026-05-26
    notes: Anchor source for U.S. semiconductor manufacturing policy, incentives, R&D, and metrology.

  - id: source-faa-aam
    name: FAA Advanced Air Mobility
    url: https://www.faa.gov/AAM
    source_type: Government Agency
    credibility_level: Tier 1
    primary_topics:
      - Aviation
      - Mobility
      - Policy and Standards
    framework_layers:
      - Frontier Domains
      - Enabling Infrastructure
      - Human Systems
    country_or_region: United States
    update_frequency: Irregular
    capture_priority: High
    known_limitations: Regulatory readiness does not equal commercial deployment.
    last_checked_date: 2026-05-26
    notes: Anchor source for advanced air mobility operations, safety, and integration.

  - id: source-nhtsa-automated-vehicles
    name: NHTSA Automated Vehicle Safety
    url: https://www.nhtsa.gov/vehicle-safety/automated-vehicles-safety
    source_type: Government Agency
    credibility_level: Tier 1
    primary_topics:
      - Mobility
      - Policy and Standards
      - Cybersecurity
    framework_layers:
      - Frontier Domains
      - Human Systems
    country_or_region: United States
    update_frequency: Irregular
    capture_priority: High
    known_limitations: Safety framework updates need operational data and local regulation context.
    last_checked_date: 2026-05-26
    notes: Anchor source for automated vehicle safety, reporting, and federal policy.

  - id: source-nasa-artemis
    name: NASA Artemis
    url: https://www.nasa.gov/humans-in-space/artemis/
    source_type: Government Agency
    credibility_level: Tier 1
    primary_topics:
      - Space
    framework_layers:
      - Frontier Domains
      - Enabling Infrastructure
    country_or_region: United States / International
    update_frequency: Irregular
    capture_priority: High
    known_limitations: Program pages mix mission updates, policy, education, and public affairs material.
    last_checked_date: 2026-05-26
    notes: Anchor source for lunar exploration, Artemis missions, and Moon-to-Mars infrastructure.

  - id: source-nist-pqc
    name: NIST Post-Quantum Cryptography Project
    url: https://csrc.nist.gov/Projects/post-quantum-cryptography
    source_type: Standards Body
    credibility_level: Tier 1
    primary_topics:
      - Quantum
      - Cybersecurity
      - Policy and Standards
    framework_layers:
      - Enabling Infrastructure
      - Human Systems
    country_or_region: United States / Global
    update_frequency: Irregular
    capture_priority: High
    known_limitations: Standards progress does not automatically mean migration progress.
    last_checked_date: 2026-05-26
    notes: Anchor source for post-quantum cryptography standards and migration context.

  - id: source-usda-nifa-plant-genomics
    name: USDA NIFA Plant Breeding, Genetics and Genomics Programs
    url: https://www.nifa.usda.gov/grants/programs/plant-breeding-genetics-genomics-programs
    source_type: Government Agency
    credibility_level: Tier 1
    primary_topics:
      - Agriculture and Bioeconomy
      - AI for Science
    framework_layers:
      - Frontier Domains
      - Planetary Conditions
      - Human Systems
    country_or_region: United States
    update_frequency: Irregular
    capture_priority: Medium
    known_limitations: Funding and program pages need links to specific research outcomes before publication.
    last_checked_date: 2026-05-26
    notes: Anchor source for plant genetics, genomics, crop resilience, and agricultural research funding.

  - id: source-iea-ai
    name: International Energy Agency Artificial Intelligence
    url: https://www.iea.org/topics/artificial-intelligence
    source_type: International Organization
    credibility_level: Tier 1
    primary_topics:
      - Energy
      - Chips and Compute
      - AI for Science
    framework_layers:
      - Enabling Infrastructure
      - Human Systems
    country_or_region: Global
    update_frequency: Irregular
    capture_priority: High
    known_limitations: Global analysis needs local grid and permitting context before local conclusions.
    last_checked_date: 2026-05-26
    notes: Anchor source for AI, data centers, and electricity demand analysis.

  - id: source-joby-press-releases
    name: Joby Aviation Press Releases
    url: https://www.jobyaviation.com/news/category/press-releases
    source_type: Company Press Room
    credibility_level: Tier 3
    primary_topics:
      - Aviation
      - Mobility
    framework_layers:
      - Frontier Domains
      - Enabling Infrastructure
    country_or_region: United States / International
    update_frequency: Irregular
    capture_priority: Medium
    known_limitations: Company claims require regulatory, operational, and independent context.
    last_checked_date: 2026-05-26
    notes: Useful interested-party source for eVTOL milestones, partnerships, and flight campaigns.
```

## First 3 Topic Records

```yaml
topics:
  - id: topic-climate
    name: Climate
    slug: climate
    summary: Climate systems, ENSO, extreme weather, adaptation, and climate-driven constraints on infrastructure, agriculture, water, energy, aviation, and markets.
    framework_layers:
      - Planetary Conditions
      - Human Systems
    primary_constraints:
      - Climate
      - Water
      - Insurance
      - Interpretation
    featured_sources:
      - source-noaa-cpc-enso
    watch_questions:
      - How do ENSO shifts affect food, water, insurance, aviation, and power systems?
      - Which climate signals are already changing local decision-making?

  - id: topic-chips-and-compute
    name: Chips and Compute
    slug: chips-and-compute
    summary: Semiconductor manufacturing, advanced packaging, compute infrastructure, data centers, lithography, sensors, and the physical stack behind AI and autonomy.
    framework_layers:
      - Enabling Infrastructure
      - Resource Foundations
      - Human Systems
    primary_constraints:
      - Power
      - Water
      - Materials
      - Manufacturing
      - Geopolitics
    featured_sources:
      - source-nist-chips
      - source-iea-ai
    watch_questions:
      - Can fabs and data centers secure enough power, water, labor, and capital?
      - Which chip supply-chain moves change local equilibria?

  - id: topic-aviation
    name: Aviation
    slug: aviation
    summary: Conventional aviation, sustainable aviation, advanced air mobility, eVTOL, airspace integration, certification, weather operations, and public acceptance.
    framework_layers:
      - Frontier Domains
      - Enabling Infrastructure
      - Human Systems
    primary_constraints:
      - Certification
      - Safety
      - Weather
      - Insurance
      - Public Trust
    featured_sources:
      - source-faa-aam
      - source-joby-press-releases
    watch_questions:
      - Which aircraft are moving from flight campaign to certified commercial service?
      - Which airspace, vertiport, insurance, and noise constraints are becoming binding?
```

## First 2 Local System Profile Records

```yaml
local_systems:
  - id: local-ontario-real-estate
    name: Ontario Real Estate
    system_type: Market
    summary: A housing and land market shaped by interest rates, migration, construction costs, zoning, infrastructure capacity, investor behavior, and household affordability.
    geography: Ontario, Canada
    key_industries:
      - residential real estate
      - construction
      - finance
      - municipal infrastructure
    core_constraints:
      - Capital
      - Regulation
      - Labor
      - Infrastructure
      - Public Trust
    current_equilibrium: Sensitive to financing costs, migration flows, municipal approvals, infrastructure capacity, and local employment conditions.
    relevant_signal_types:
      - Market Signal
      - Policy Signal
      - Forecast
      - Funding
    actors_with_authority:
      - municipal governments
      - provincial government
      - lenders
      - developers
      - regulators
    likely_second_order_effects:
      - shifts in development timing
      - changes in land value
      - infrastructure pressure
      - affordability stress
      - political conflict over density and growth
    missing_data:
      - local inventory by submarket
      - permit timelines
      - infrastructure capacity by municipality
      - financing exposure by project type

  - id: local-us-southwest-chip-corridor
    name: U.S. Southwest Chip Corridor
    system_type: Place
    summary: A semiconductor manufacturing region shaped by fab investment, industrial water demand, grid reliability, skilled labor, land use, supplier networks, and public incentives.
    geography: Arizona and adjacent U.S. Southwest industrial regions
    key_industries:
      - semiconductor manufacturing
      - advanced manufacturing
      - power utilities
      - water infrastructure
      - construction
    core_constraints:
      - Water
      - Power
      - Labor
      - Manufacturing
      - Supply Chain
      - Public Trust
    current_equilibrium: Growth-oriented industrial strategy colliding with water stress, grid capacity, construction labor limits, and geopolitical pressure to localize chip supply.
    relevant_signal_types:
      - Funding
      - Deployment
      - Policy Signal
      - Supply Chain Shift
    actors_with_authority:
      - state governments
      - municipal governments
      - utilities
      - water authorities
      - semiconductor firms
      - federal agencies
    likely_second_order_effects:
      - regional power demand growth
      - water reuse investment
      - supplier clustering
      - housing pressure
      - workforce training expansion
      - scrutiny of public incentives
    missing_data:
      - facility-level water demand
      - interconnection queues
      - workforce pipeline capacity
      - supplier network maturity
```

## First 10 Sample Signal Records

```yaml
signals:
  - id: signal-sample-001
    record_status: Draft Sample
    title: ENSO outlook update changes climate risk posture
    slug: enso-outlook-update-climate-risk-posture
    summary: NOAA CPC's ENSO diagnostic updates can change expectations for rainfall, temperature, drought, crop risk, water management, commodity markets, and disaster preparation.
    source_ids:
      - source-noaa-cpc-enso
    published_date: null
    captured_date: 2026-05-26
    primary_topic: Climate
    framework_layers:
      - Planetary Conditions
      - Human Systems
    signal_type: Forecast
    maturity_level: Infrastructure
    time_horizon: Now
    evidence_quality: Official Data
    verification_status: Unreviewed
    why_it_matters: ENSO is a climate signal that can alter local planning across agriculture, water, energy, aviation, insurance, and logistics.
    dependencies:
      - climate observations
      - forecast models
      - local planning institutions
      - sector-specific interpretation
    constraints:
      - Climate
      - Water
      - Interpretation
      - Insurance
    receiving_systems:
      - Ontario Real Estate
    local_implications:
      - Local effects depend on regional climate teleconnections, municipal infrastructure, insurance exposure, and market interpretation.
    editorial_notes: Replace null published_date with the source-specific issue date before publishing.

  - id: signal-sample-002
    record_status: Draft Sample
    title: Mineral commodity data updates critical material assumptions
    slug: mineral-commodity-data-critical-material-assumptions
    summary: USGS mineral commodity summaries provide updated production, reserves, import reliance, and market context for materials used in batteries, chips, grid infrastructure, defense systems, and advanced manufacturing.
    source_ids:
      - source-usgs-mineral-commodity-summaries
    published_date: null
    captured_date: 2026-05-26
    primary_topic: Critical Minerals
    framework_layers:
      - Resource Foundations
      - Enabling Infrastructure
    signal_type: Market Signal
    maturity_level: Infrastructure
    time_horizon: Now
    evidence_quality: Official Data
    verification_status: Unreviewed
    why_it_matters: Mineral data changes assumptions about supply risk, substitution, recycling, refining, geopolitics, and industrial policy.
    dependencies:
      - geological surveys
      - mining capacity
      - refining capacity
      - trade data
    constraints:
      - Materials
      - Supply Chain
      - Geopolitics
      - Permitting
    receiving_systems:
      - U.S. Southwest Chip Corridor
    local_implications:
      - Semiconductor and battery regions may need to reassess sourcing, recycling, and supplier resilience.
    editorial_notes: Convert into specific mineral signals once the first dataset is selected.

  - id: signal-sample-003
    record_status: Draft Sample
    title: CHIPS program update shifts semiconductor infrastructure outlook
    slug: chips-program-update-semiconductor-infrastructure-outlook
    summary: NIST CHIPS for America updates can signal changes in funding, R&D direction, metrology, manufacturing incentives, workforce programs, or facility investments.
    source_ids:
      - source-nist-chips
    published_date: null
    captured_date: 2026-05-26
    primary_topic: Chips and Compute
    framework_layers:
      - Enabling Infrastructure
      - Human Systems
    signal_type: Policy Signal
    maturity_level: Infrastructure
    time_horizon: 2-5 Years
    evidence_quality: Primary Source
    verification_status: Unreviewed
    why_it_matters: Semiconductor policy can reshape local power demand, water demand, labor pipelines, supplier networks, and geopolitical resilience.
    dependencies:
      - federal funding
      - private capital
      - skilled labor
      - fab equipment
      - power and water infrastructure
    constraints:
      - Power
      - Water
      - Manufacturing
      - Labor
      - Geopolitics
    receiving_systems:
      - U.S. Southwest Chip Corridor
    local_implications:
      - New funding or R&D direction may affect facility siting, supplier clustering, workforce demand, and public infrastructure pressure.
    editorial_notes: Before publishing, tie to a specific CHIPS announcement and affected region.

  - id: signal-sample-004
    record_status: Draft Sample
    title: FAA advanced air mobility guidance clarifies path for eVTOL deployment
    slug: faa-aam-guidance-evtol-deployment
    summary: FAA advanced air mobility updates can clarify operational, certification, airspace, safety, or infrastructure requirements for eVTOL and related aircraft.
    source_ids:
      - source-faa-aam
    published_date: null
    captured_date: 2026-05-26
    primary_topic: Aviation
    framework_layers:
      - Frontier Domains
      - Enabling Infrastructure
      - Human Systems
    signal_type: Regulation
    maturity_level: Pilot Program
    time_horizon: 2-5 Years
    evidence_quality: Primary Source
    verification_status: Unreviewed
    why_it_matters: AAM cannot scale on aircraft alone. Certification, airspace integration, vertiports, weather operations, insurance, and public acceptance are all gating systems.
    dependencies:
      - aircraft certification
      - pilot or automation rules
      - vertiport infrastructure
      - air traffic integration
      - local permitting
    constraints:
      - Certification
      - Safety
      - Weather
      - Insurance
      - Public Trust
    receiving_systems:
      - urban aviation markets
    local_implications:
      - Cities with airport congestion, high-income routes, and permissive local policy may interpret the signal differently from cities with noise or land-use resistance.
    editorial_notes: Pair FAA source with company, city, and airport sources for a publish-ready brief.

  - id: signal-sample-005
    record_status: Draft Sample
    title: Automated vehicle safety framework changes deployment assumptions
    slug: automated-vehicle-safety-framework-deployment-assumptions
    summary: NHTSA automated vehicle safety updates can affect reporting, exemptions, safety expectations, public trust, and the operational path for robotaxis, delivery vehicles, and autonomous trucking.
    source_ids:
      - source-nhtsa-automated-vehicles
    published_date: null
    captured_date: 2026-05-26
    primary_topic: Mobility
    framework_layers:
      - Frontier Domains
      - Human Systems
    signal_type: Policy Signal
    maturity_level: Early Commercial
    time_horizon: Now
    evidence_quality: Primary Source
    verification_status: Unreviewed
    why_it_matters: Safety reporting and federal policy can change deployment pace, liability, insurance, public acceptance, and local permission structures.
    dependencies:
      - safety data
      - reporting rules
      - local road operations
      - insurance and liability frameworks
    constraints:
      - Safety
      - Regulation
      - Insurance
      - Public Trust
      - Data Quality
    receiving_systems:
      - U.S. autonomous mobility markets
    local_implications:
      - The same federal signal may affect permissive and restrictive cities differently.
    editorial_notes: Needs specific policy update or report before publication.

  - id: signal-sample-006
    record_status: Draft Sample
    title: Artemis update shifts lunar infrastructure roadmap
    slug: artemis-update-lunar-infrastructure-roadmap
    summary: NASA Artemis updates can affect expectations for lunar missions, surface systems, commercial partnerships, launch demand, international coordination, and Moon-to-Mars infrastructure.
    source_ids:
      - source-nasa-artemis
    published_date: null
    captured_date: 2026-05-26
    primary_topic: Space
    framework_layers:
      - Frontier Domains
      - Enabling Infrastructure
    signal_type: Deployment
    maturity_level: Field Trial
    time_horizon: 5-15 Years
    evidence_quality: Primary Source
    verification_status: Unreviewed
    why_it_matters: Space infrastructure depends on launch cadence, life support, surface power, communications, robotics, funding, and international policy.
    dependencies:
      - launch systems
      - lunar landers
      - surface power
      - communications
      - budget and procurement
    constraints:
      - Capital
      - Manufacturing
      - Supply Chain
      - Geopolitics
      - Safety
    receiving_systems:
      - lunar exploration supply chain
    local_implications:
      - Signals may affect aerospace suppliers, launch providers, research institutions, and regional space economies.
    editorial_notes: Tie to a specific Artemis mission or procurement event before publication.

  - id: signal-sample-007
    record_status: Draft Sample
    title: Post-quantum cryptography standards change security migration clock
    slug: post-quantum-cryptography-standards-security-migration-clock
    summary: NIST post-quantum cryptography updates can change how governments, financial institutions, software vendors, vehicle platforms, satellites, and critical infrastructure plan cryptographic migration.
    source_ids:
      - source-nist-pqc
    published_date: null
    captured_date: 2026-05-26
    primary_topic: Quantum
    framework_layers:
      - Enabling Infrastructure
      - Human Systems
    signal_type: Security Signal
    maturity_level: Infrastructure
    time_horizon: Now
    evidence_quality: Primary Source
    verification_status: Unreviewed
    why_it_matters: Quantum risk affects systems long before cryptographically relevant quantum computers exist because migration takes time and stored encrypted data may be vulnerable later.
    dependencies:
      - standards adoption
      - software updates
      - hardware support
      - procurement rules
      - cryptographic inventory
    constraints:
      - Cybersecurity
      - Standards
      - Labor
      - Unit Economics
    receiving_systems:
      - critical infrastructure security
    local_implications:
      - Migration capacity depends on institutional competence, vendor readiness, procurement cycles, and risk tolerance.
    editorial_notes: Needs specific NIST standard or migration guidance event before publication.

  - id: signal-sample-008
    record_status: Draft Sample
    title: Plant genomics program points toward climate-resilient agriculture
    slug: plant-genomics-program-climate-resilient-agriculture
    summary: USDA NIFA plant breeding, genetics, and genomics programs indicate research pathways for crop resilience, yield, sustainability, and adaptation under changing climate conditions.
    source_ids:
      - source-usda-nifa-plant-genomics
    published_date: null
    captured_date: 2026-05-26
    primary_topic: Agriculture and Bioeconomy
    framework_layers:
      - Frontier Domains
      - Planetary Conditions
      - Human Systems
    signal_type: Research Result
    maturity_level: Lab Result
    time_horizon: 5-15 Years
    evidence_quality: Primary Source
    verification_status: Unreviewed
    why_it_matters: Agriculture's future depends on genetics, data, bioinformatics, water, soil, markets, regulation, and farmer adoption.
    dependencies:
      - genomics research
      - field trials
      - extension systems
      - seed commercialization
      - farmer adoption
    constraints:
      - Climate
      - Water
      - Regulation
      - Public Trust
      - Interpretation
    receiving_systems:
      - climate-stressed agricultural regions
    local_implications:
      - A trait or breeding approach matters differently depending on local climate, crop mix, water rights, pests, and market access.
    editorial_notes: Replace with a specific grant, study, or program announcement before publication.

  - id: signal-sample-009
    record_status: Draft Sample
    title: AI electricity demand analysis reframes data center constraints
    slug: ai-electricity-demand-data-center-constraints
    summary: IEA analysis of AI and electricity demand can change assumptions about grid stress, data center siting, power procurement, cooling, emissions, and local industrial strategy.
    source_ids:
      - source-iea-ai
    published_date: null
    captured_date: 2026-05-26
    primary_topic: Energy
    framework_layers:
      - Enabling Infrastructure
      - Human Systems
    signal_type: Forecast
    maturity_level: Scaling
    time_horizon: 2-5 Years
    evidence_quality: Credible Analysis
    verification_status: Unreviewed
    why_it_matters: AI does not scale only through chips and models. It also needs power, cooling, grid interconnection, water, land, permitting, and local legitimacy.
    dependencies:
      - electricity supply
      - grid interconnection
      - data center construction
      - cooling systems
      - chip supply
    constraints:
      - Power
      - Water
      - Land Use
      - Permitting
      - Public Trust
    receiving_systems:
      - U.S. Southwest Chip Corridor
    local_implications:
      - Regions competing for fabs and AI data centers may face overlapping pressure on power, water, labor, and land use.
    editorial_notes: Use Official Data instead if a specific data table or dataset is the cited source.

  - id: signal-sample-010
    record_status: Draft Sample
    title: eVTOL flight campaign illustrates gap between demonstration and deployment
    slug: evtol-flight-campaign-demonstration-deployment-gap
    summary: Joby press releases can document eVTOL flight campaigns, partnerships, and vertiport demonstrations, but FTFN should distinguish demonstration value from certified commercial deployment.
    source_ids:
      - source-joby-press-releases
    published_date: null
    captured_date: 2026-05-26
    primary_topic: Aviation
    framework_layers:
      - Frontier Domains
      - Enabling Infrastructure
      - Human Systems
    signal_type: Deployment
    maturity_level: Pilot Program
    time_horizon: 2-5 Years
    evidence_quality: Company Claim
    verification_status: Unreviewed
    why_it_matters: Flight demonstrations can build public familiarity and partner momentum, but commercial service depends on certification, operations, vertiports, insurance, weather, and unit economics.
    dependencies:
      - FAA certification
      - aircraft production
      - vertiports
      - airspace integration
      - charging infrastructure
    constraints:
      - Certification
      - Manufacturing
      - Weather
      - Insurance
      - Public Trust
    receiving_systems:
      - urban aviation markets
    local_implications:
      - Demonstrations may shift local policy and investor expectations before the operational system is ready.
    editorial_notes: Pair company source with FAA and local city/airport sources before publishing.
```

## What The Sample Records Reveal

### 1. Signals Need Record Status

The content model needs a `record_status` field because sample records, draft records, reviewed records, and published records have different validation needs.

Suggested values:

```text
Draft Sample
Draft
In Review
Published
Needs Update
Archived
```

### 2. Published Date Should Be Required For Publication, Not Drafts

The current content model treats `published_date` as required. That is correct for publication, but drafts and evergreen source pages may need null values until the exact source item is selected.

Rule:

```text
published_date is required for published signals, nullable for draft samples.
```

### 3. Aviation And Discovery Technologies Should Be Public Topic Pillars

The earlier taxonomy included aviation and discovery technologies inside framework layers but not in public topic pillars. Phase 02 makes clear that they should be explicit public pillars.

### 4. Local System Profiles Need Source Support

Local profiles need their own source records, not just global frontier sources.

Examples:

- utilities,
- water authorities,
- planning documents,
- labor data,
- local permitting records,
- regional economic development agencies,
- credible local reporting.

### 5. Source Credibility Is Contextual

The same source can be strong for one claim and weak for another.

Example:

Joby is a primary source for what Joby claims or announces, but not independent evidence that an eVTOL market is ready to scale.

### 6. Evidence Quality Needs Careful Labels

`Official Data`, `Primary Source`, `Company Claim`, and `Credible Analysis` should not be collapsed.

Phase 02 added `Credible Analysis` for analytical reports from credible institutional sources such as IEA analysis pages.

### 7. MVP Can Start Static-First

The records are structured enough for Markdown/frontmatter or YAML files, but relationship links will matter quickly.

Technical stack implication:

```text
Use a stack that supports content collections, validation, tags, relations, and later database migration.
```
