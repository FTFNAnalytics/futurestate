# Content Model

This document defines the MVP data and content models for Forty Two Fifty Nine.

The MVP should be simple enough to maintain manually, but structured enough to grow into a data platform.

## Modeling Principles

- Start with editorial usefulness.
- Keep fields explicit.
- Separate claims from evidence.
- Separate global signals from local implications.
- Avoid false precision.
- Prefer controlled vocabularies where consistency matters.
- Allow free-text notes where interpretation matters.

## Entity Overview

MVP entities:

- Signal
- Source
- Topic
- Organization
- Project
- Technology
- Local System Profile
- Briefing
- Evidence Gap
- Dependency Map

Later entities:

- Material
- Policy
- Facility
- Dataset
- Person
- Event
- Regulation
- Forecast

## Signal

Purpose:

A structured summary of a development that may affect future-state systems.

Required fields:

```text
id
title
slug
record_status
summary
source_ids
published_date
captured_date
primary_topic
framework_layers
signal_type
maturity_level
time_horizon
evidence_quality
verification_status
why_it_matters
dependencies
constraints
```

Optional fields:

```text
subtitle
organizations
technologies
projects
location
receiving_systems
local_implications
evidence_gap_ids
claim_scope
local_evidence_level
last_reviewed_date
second_order_effects
externalities
editorial_notes
related_signals
author
```

Example:

```yaml
id: signal-0001
title: "Battery recycler announces new North American processing capacity"
slug: battery-recycler-north-american-processing-capacity
record_status: Published
summary: "A battery recycling company announced added processing capacity intended to recover lithium, nickel, cobalt, and other materials from end-of-life batteries and manufacturing scrap."
source_ids:
  - source-example-company
published_date: 2026-05-26
captured_date: 2026-05-26
primary_topic: Critical Minerals
framework_layers:
  - Resource Foundations
  - Enabling Infrastructure
signal_type: Deployment
maturity_level: Early Commercial
time_horizon: 2-5 Years
evidence_quality: Company Claim
verification_status: Reviewed
why_it_matters: "Battery recycling could reduce mineral supply pressure, but impact depends on collection networks, processing yields, permitting, power costs, and buyer demand."
dependencies:
  - battery collection
  - processing facilities
  - refining partners
  - offtake agreements
constraints:
  - Materials
  - Permitting
  - Unit Economics
  - Supply Chain
receiving_systems:
  - North American battery supply chain
local_implications:
  - "May affect regional demand for industrial power, skilled labor, hazardous material handling, and transport infrastructure."
editorial_notes: "Verify actual commissioned capacity before treating as operational."
```

Record status values:

```text
Draft Sample
Draft
In Review
Published
Needs Update
Archived
```

Date rule:

```text
published_date is required for published signals, nullable for draft samples.
```

Claim scope values:

```text
General Context
Specific Source Update
System-Level Pattern
Local Constraint Map
Project-Level Claim
Speculative Scenario
Editorial Synthesis
```

Local evidence level values:

```text
None
General Source Layer
Local Source Layer
Specific Local Record
Project-Level Evidence
```

Use `evidence_gap_ids` when a signal is limited by a named gap in the evidence gap register. Use `claim_scope` to prevent a context record or constraint map from being read as a project-level claim. Use `local_evidence_level` to show whether local interpretation is supported by no local evidence, broad source layers, local source layers, specific local records, or project-level evidence.

## Source

Purpose:

An origin point for information used by signals, briefings, and reports.

Required fields:

```text
id
name
url
source_type
credibility_level
primary_topics
framework_layers
country_or_region
update_frequency
capture_priority
known_limitations
last_checked_date
```

Optional fields:

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
organization_id
notes
automation_notes
```

Example:

```yaml
id: source-noaa-cpc
name: "NOAA Climate Prediction Center"
url: "https://www.cpc.ncep.noaa.gov/"
source_type: Government Agency
credibility_level: Tier 1
primary_topics:
  - Climate
  - Water
capture_priority: High
update_frequency: Weekly to monthly
known_limitations: "Official forecasts still require interpretation for local economic and infrastructure impacts."
```

Source watch-lane values:

```text
Cross-Cutting Official Rails
Power and Grid
Compute and Chips
Water
Mobility Certification
Security and Standards
Critical Minerals
Climate
Agriculture and Bioeconomy
AI and Advanced Manufacturing
Space
Discovery Technologies
Finance and Human Futures
Local Systems
```

Source live access values:

```text
API
RSS Feed
Data Download
Docket Search
Filing System
Release Page
Report Series
Interactive Portal
Manual Page Check
```

Source coverage role values:

```text
Primary Data
Regulatory Change
Docket Evidence
Filing Evidence
Source Freshness
Local Conversion Evidence
Standards Evidence
Research Program Evidence
Funding Evidence
Company Claim
```

Source monitoring rule:

```text
If a source declares API, RSS Feed, Data Download, Docket Search, or Filing System access, attach the corresponding endpoint field before treating it as probe ready. The source monitor and source coverage matrix may expose health and freshness, but they do not update records or publish claims automatically.
```

## Topic

Purpose:

A public-facing category for signals, explainers, roadmaps, and data views.

Required fields:

```text
id
name
slug
summary
framework_layers
primary_constraints
```

Optional fields:

```text
description
related_topics
key_technologies
key_organizations
watch_questions
featured_sources
```

Example:

```yaml
id: topic-quantum
name: Quantum
slug: quantum
summary: "Quantum computing, networking, sensing, materials, cryogenics, and post-quantum security."
framework_layers:
  - Enabling Infrastructure
  - Frontier Domains
primary_constraints:
  - Compute
  - Manufacturing
  - Standards
  - Cybersecurity
watch_questions:
  - "Is progress in error correction translating into useful logical qubits?"
  - "Which systems need post-quantum migration now?"
```

## Organization

Purpose:

An entity that produces, funds, regulates, operates, studies, or is affected by signals.

Required fields:

```text
id
name
organization_type
website
primary_topics
```

Optional fields:

```text
country_or_region
description
roles
related_sources
related_projects
notes
```

Organization types:

```text
Company
Government Agency
Research Lab
University
Standards Body
International Organization
Investor
Nonprofit
Trade Association
Regulator
```

Example:

```yaml
id: org-example-fab
name: "Example Semiconductor Manufacturing Co."
organization_type: Company
website: "https://example.com"
primary_topics:
  - Chips and Compute
  - Advanced Manufacturing
roles:
  - operator
  - claimant
notes: "Track official claims separately from verified production capacity."
```

## Project

Purpose:

A specific initiative, facility, deployment, research program, infrastructure build, or mission.

Required fields:

```text
id
name
project_type
summary
primary_topic
status
organizations
```

Optional fields:

```text
location
start_date
target_date
funding
technologies
dependencies
constraints
related_signals
notes
```

Project statuses:

```text
Proposed
Funded
Permitting
Under Construction
Testing
Operational
Paused
Cancelled
Completed
Unknown
```

Example:

```yaml
id: project-example-evtol-route
name: "Example City eVTOL Pilot Corridor"
project_type: Pilot Program
summary: "A proposed air mobility corridor connecting an airport district with a downtown vertiport."
primary_topic: Mobility
status: Proposed
organizations:
  - org-example-airmobility
dependencies:
  - aircraft certification
  - vertiport infrastructure
  - airspace coordination
constraints:
  - Certification
  - Public Trust
  - Insurance
```

## Technology

Purpose:

A trackable technical capability or platform.

Required fields:

```text
id
name
summary
primary_topics
maturity_level
core_dependencies
core_constraints
```

Optional fields:

```text
description
related_technologies
key_organizations
example_projects
signals_to_watch
open_questions
```

Example:

```yaml
id: tech-lidar
name: LiDAR
summary: "Remote sensing technology that uses laser pulses to measure distance and create high-resolution spatial maps."
primary_topics:
  - Discovery Technologies
  - Mobility
maturity_level: Infrastructure
core_dependencies:
  - sensors
  - compute
  - mapping workflows
core_constraints:
  - Unit Economics
  - Data Quality
  - Weather
  - Interpretation
```

Technology profile guardrail:

```text
A technology record defines a capability, maturity framing, dependencies, constraints, and source anchors. It does not prove deployment readiness, commercial scale, local feasibility, or evidence-gap resolution.
```

Technology-to-signal links should be deterministic. At MVP, use shared source IDs or primary-topic overlap only, and label the relationship in the UI.

## Local System Profile

Purpose:

A structured profile of a place, sector, institution, or market as a receiving system for frontier signals.

Required fields:

```text
id
name
system_type
summary
geography
key_industries
core_constraints
current_equilibrium
```

Optional fields:

```text
energy_capacity
water_stress
transport_infrastructure
labor_availability
regulatory_environment
capital_flows
climate_exposure
critical_minerals
research_institutions
political_constraints
major_projects
source_ids
relevant_signals
likely_second_order_effects
actors_with_authority
missing_data
evidence_gap_ids
local_evidence_level
last_reviewed_date
```

System types:

```text
Place
Sector
Institution
Market
Supply Chain
Infrastructure System
```

Example:

```yaml
id: local-ontario-real-estate
name: Ontario Real Estate
system_type: Market
summary: "A housing and land market shaped by interest rates, migration, zoning, labor, construction costs, infrastructure, and regional employment patterns."
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
current_equilibrium: "Sensitive to interest rates, migration flows, local employment, municipal approvals, and household affordability."
actors_with_authority:
  - municipal governments
  - provincial government
  - lenders
  - developers
  - regulators
missing_data:
  - local inventory by submarket
  - permit timelines
  - infrastructure capacity by municipality
evidence_gap_ids:
  - gap-004
  - gap-005
local_evidence_level: Local Source Layer
last_reviewed_date: 2026-06-02
```

## Briefing

Purpose:

A recurring synthesis of signals across topics.

Required fields:

```text
id
title
slug
record_status
summary
captured_date
published_date
signal_ids
top_takeaways
constraint_watch
what_to_watch_next
```

Optional fields:

```text
time_period
primary_topics
dependency_shifts
local_system_notes
evidence_gap_ids
claim_scope
local_evidence_level
last_reviewed_date
editorial_notes
author
```

Example:

```yaml
id: briefing-stack-watch-001
title: "Stack Watch 001: Local constraints are where the future arrives"
slug: stack-watch-001-local-constraints
record_status: In Review
published_date: null
captured_date: 2026-05-27
summary: "An evidence-backed briefing draft showing how climate, critical minerals, chips, AI electricity demand, water, housing, and building permits converge into local constraint questions."
signal_ids:
  - signal-0001
top_takeaways:
  - "Official sources can support constraint maps, but local conclusions still need municipal, utility, facility, permitting, financing, and completion evidence."
constraint_watch:
  - Power
  - Water
  - Infrastructure
what_to_watch_next:
  - "Arizona utility planning, interconnection, tariff, and rate-case materials tied to semiconductor and AI infrastructure."
evidence_gap_ids:
  - gap-001
  - gap-002
claim_scope: Editorial Synthesis
local_evidence_level: General Source Layer
last_reviewed_date: 2026-06-02
```

## Evidence Gap

Purpose:

A structured missing-evidence record that explains why FTFN cannot yet make stronger claims.

Required fields:

```text
id
title
slug
status
priority
local_system
primary_topic
framework_layers
constraint_tags
question
why_it_matters
current_support
missing_evidence
likely_source_types
next_action
```

Optional fields:

```text
candidate_records
future_data_model_need
related_source_ids
related_signal_ids
related_local_system_ids
notes
```

Example:

```yaml
id: gap-001
title: "Arizona utility evidence for semiconductor and AI infrastructure power capacity"
slug: gap-001-arizona-utility-power-capacity
status: Source Added
priority: High
local_system: U.S. Southwest Chip Corridor
primary_topic: Energy
framework_layers:
  - Enabling Infrastructure
  - Human Systems
constraint_tags:
  - Power
  - Infrastructure
  - Regulation
  - Data Quality
question: "Which utility records show real power capacity for semiconductor and AI infrastructure?"
missing_evidence:
  - utility integrated resource plans
  - interconnection queues
  - tariff filings
next_action: "Use ACC eDocket and utility sources to identify specific dockets, filings, and rate cases before making site-level power claims."
```

Minimum evidence gap:

- has a stable ID,
- has a status and priority,
- names the affected local system or `Cross-system`,
- names the primary topic,
- names missing evidence,
- names the next action,
- does not use `Resolved` unless the missing evidence has been directly satisfied.

## Dependency Map

Purpose:

A structured qualitative map showing how signals, technologies, sources, local systems, constraints, and evidence gaps relate inside the dependency stack.

Required fields:

```text
id
title
slug
summary
map_type
record_status
primary_topic
framework_layers
constraint_tags
map_question
interpretation_boundary
nodes
links
what_this_map_supports
what_this_map_does_not_prove
next_records_needed
```

Optional fields:

```text
source_ids
signal_ids
technology_ids
local_system_ids
evidence_gap_ids
```

Map type values:

```text
Dependency Stack
Local Constraint Map
Technology Readiness Map
Evidence Gap Map
```

Node type values:

```text
Signal
Source
Technology
Local System
Evidence Gap
Topic
Constraint
```

Link type values:

```text
Depends On
Constrained By
Evidenced By
Limited By
Received By
Related Signal
Related Technology
Related Source
```

Confidence values:

```text
Supported
Partial
Missing Evidence
Watch
```

Example:

```yaml
id: dependency-map-local-constraints-where-the-future-arrives
title: "Local constraints are where the future arrives"
slug: local-constraints-where-the-future-arrives
summary: "A qualitative dependency map showing how compute, chips, power, water, housing, and permit signals become local outcomes only through source-backed receiving systems."
map_type: Local Constraint Map
record_status: In Review
primary_topic: Chips and Compute
framework_layers:
  - Enabling Infrastructure
  - Human Systems
constraint_tags:
  - Power
  - Water
  - Infrastructure
map_question: "Which dependencies convert frontier compute and chip signals into local outcomes, and where does the evidence still stop short?"
interpretation_boundary: "This map shows qualitative relationships among existing FTFN records. It does not prove local readiness, project viability, facility capacity, or completed outcomes."
nodes:
  - id: node-ai-compute-demand
    label: AI compute demand
    node_type: Signal
    record_id: signal-sample-009
    note: "Compute growth creates demand for power, cooling, grid interconnection, and local siting evidence."
links:
  - from: node-ai-compute-demand
    to: node-chip-corridor
    relationship: Received By
    confidence: Partial
    note: "AI compute and semiconductor signals matter locally only where power, water, land, and permitting systems can absorb them."
```

Dependency map guardrail:

```text
A dependency map is an evidence-aware interpretation surface. It does not prove causality, local readiness, project viability, resolved evidence gaps, or numeric 42/59 scores.
```

Dependency maps should begin as standalone JSON records. Later, FTFN may generate draft maps from explicit relationship fields once the content graph is large enough.

## MVP Data Format

Until a technical stack is chosen, store structured content in a format that can migrate cleanly.

Recommended MVP options:

- Markdown with frontmatter for editorial content.
- JSON or YAML for source, topic, and organization records.
- One record per file for human review and version control.

Avoid:

- hard-coded data inside components,
- unstructured long documents pretending to be a database,
- fields that cannot be validated later.

## Validation Rules

Minimum publishable signal:

- has a title,
- has a source URL,
- has a summary,
- has a primary topic,
- has a signal type,
- has a maturity level,
- has a time horizon,
- identifies dependencies,
- identifies constraints,
- has evidence quality,
- has verification status.
- has claim scope when the record contains interpretation,
- has local evidence level when local implications are present,
- links to evidence gap IDs when known gaps limit the claim.

Minimum source record:

- has a name,
- has a URL,
- has a source type,
- has a credibility level,
- has at least one primary topic.

Minimum local system profile:

- has a name,
- has a system type,
- has a summary,
- identifies geography or scope,
- identifies current equilibrium,
- identifies core constraints.
- identifies evidence gap IDs when known gaps limit interpretation,
- identifies local evidence level once source IDs are attached.

Minimum briefing:

- has a title,
- has a record status,
- has a summary,
- has a captured date,
- has referenced signal IDs,
- has evidence-aware top takeaways,
- names constraint watch items,
- names what to watch next,
- keeps `published_date` null unless the briefing is `Published`.
- links to evidence gap IDs when synthesis depends on unresolved conversion evidence,
- identifies claim scope and local evidence level.

Minimum evidence gap:

- has a stable `gap-###` ID,
- has a status and priority,
- names a primary topic,
- names missing evidence,
- names a next action,
- does not mark the gap resolved unless the evidence directly answers the question.

Minimum dependency map:

- has a stable ID,
- has a map type,
- has a clear map question,
- has an interpretation boundary,
- has at least one node and one link,
- uses only valid record IDs when `record_id` is present,
- uses qualitative confidence labels,
- states what the map supports and what it does not prove,
- names next records needed,
- does not add numeric 42/59 scoring.
