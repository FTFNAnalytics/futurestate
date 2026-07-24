# Taxonomy

This document defines the controlled vocabulary for Forty Two Fifty Nine. It should keep the project consistent as signals, sources, topic pages, data models, and briefings grow.

## Master Framework

Every signal should be interpreted through at least one of the five master framework layers.

### Planetary Conditions

Question:

```text
What is the planet making easier or harder?
```

Scope:

- climate systems,
- ENSO,
- oceans,
- water,
- drought,
- flood,
- heat,
- wildfire,
- food security,
- habitability,
- migration.

### Resource Foundations

Question:

```text
Can we physically source the future?
```

Scope:

- geology,
- critical minerals,
- mining,
- refining,
- recycling,
- battery materials,
- rare earths,
- semiconductor materials,
- industrial water,
- land use,
- supply-chain chokepoints.

### Enabling Infrastructure

Question:

```text
Can the future be powered, computed, secured, manufactured, and financed?
```

Scope:

- energy and grid,
- chips and semiconductor manufacturing,
- data centers,
- AI infrastructure,
- quantum systems,
- communications,
- satellites,
- 6G,
- cybersecurity,
- advanced manufacturing,
- standards and certification,
- finance and insurance.

### Frontier Domains

Question:

```text
What new capabilities are emerging?
```

Scope:

- autonomous vehicles,
- drones,
- eVTOL,
- aviation,
- shipping and logistics,
- robotics,
- space travel,
- lunar infrastructure,
- LiDAR archaeology,
- underwater exploration,
- agriculture genetics,
- bioinformatics,
- synthetic biology,
- AI for chemistry and materials science.

### Human Systems

Question:

```text
Will people, institutions, and markets absorb the change?
```

Scope:

- policy,
- labor,
- education,
- public trust,
- safety,
- ethics,
- accessibility,
- geopolitics,
- defense and dual-use technology,
- urban/rural divides,
- inequality,
- cultural acceptance.

## Topic Pillars

Topic pillars are public-facing categories.

MVP pillars:

```text
Mobility
Aviation
Space
Energy
Climate
Critical Minerals
Chips and Compute
AI for Science
Quantum
Advanced Manufacturing
Agriculture and Bioeconomy
Discovery Technologies
Water
Cybersecurity
Policy and Standards
Finance and Risk
Human Futures
```

Relationship rule:

- A signal must have one primary topic pillar.
- A signal may have secondary topic pillars.
- A topic pillar may map to more than one framework layer.

Examples:

- A new lithium mine: primary pillar `Critical Minerals`; layers `Resource Foundations`, `Human Systems`, possibly `Planetary Conditions`.
- A robotaxi expansion: primary pillar `Mobility`; layers `Frontier Domains`, `Enabling Infrastructure`, `Human Systems`.
- A nuclear power project: primary pillar `Energy`; layers `Enabling Infrastructure`, `Human Systems`, possibly `Resource Foundations`.

## Signal Types

Signal types describe what kind of development occurred.

MVP values:

```text
Breakthrough
Deployment
Regulation
Funding
Partnership
Failure
Accident
Cost Shift
Supply Chain Shift
Climate Signal
Market Signal
Research Result
Policy Signal
Security Signal
Forecast
```

Rules:

- A signal must have one primary signal type.
- Add secondary types only when needed.
- Do not use `Breakthrough` unless the evidence supports the claim.
- Use `Company Claim` as evidence quality, not signal type.

## Maturity Levels

Maturity levels describe how real or deployable a capability is.

MVP values:

```text
Theory
Lab Result
Prototype
Field Trial
Pilot Program
Early Commercial
Scaling
Infrastructure
Commodity
Decline or Failure
```

Rules:

- Maturity should describe the specific signal, not the whole sector.
- A company announcement can be `Prototype` even if the sector has `Early Commercial` examples elsewhere.
- If a capability is speculative, do not promote it to `Theory` unless it has a coherent technical basis.

## Time Horizons

Time horizons classify when the signal is likely to matter.

MVP values:

```text
Now
2-5 Years
5-15 Years
15+ Years
Speculative
```

Rules:

- Use `Now` for deployed, operational, regulatory, market, or climate signals that already affect decisions.
- Use `Speculative` when timing is highly uncertain or depends on unresolved scientific or engineering breakthroughs.
- Time horizon should be justified in the editorial notes when not obvious.

## Constraint Tags

Constraint tags identify what could block, slow, or shape outcomes.

MVP values:

```text
Power
Materials
Water
Compute
Manufacturing
Regulation
Certification
Capital
Insurance
Cybersecurity
Labor
Public Trust
Climate
Geopolitics
Unit Economics
Supply Chain
Standards
Land Use
Infrastructure
Permitting
Data Quality
Safety
Weather
Interpretation
```

Rules:

- Use constraints only when they materially affect interpretation.
- Avoid tagging every signal with every possible constraint.
- Prefer 2-6 constraint tags per signal for MVP.
- Use `Infrastructure` when the constraint is broad capacity or system readiness rather than a narrower issue such as power, water, land use, or permitting.

## Source Types

MVP values:

```text
Government Agency
Company Press Room
Research Lab
University
Standards Body
International Organization
Dataset
Peer-Reviewed Journal
Trade Publication
Credible Reporting
Market Data Provider
NGO or Think Tank
Investor Material
```

Rules:

- Source type is not the same as credibility.
- A company press release can be useful but should be treated as a claim by an interested party.
- Official data can still require interpretation.

## Evidence Quality

MVP values:

```text
Official Data
Primary Source
Peer-Reviewed Research
Regulatory Filing
Audited or Verified Data
Credible Reporting
Credible Analysis
Company Claim
Expert Commentary
Unverified Claim
Speculative Claim
```

Rules:

- Evidence quality should be visible in editorial review even if it is not shown prominently to readers at MVP.
- Do not collapse company claims and independent evidence.
- If evidence quality is weak, the summary should say so plainly.

## Verification Status

MVP values:

```text
Unreviewed
Reviewed
Needs Follow-Up
Verified Against Primary Source
Disputed
Withdrawn or Corrected
```

Rules:

- Drafts begin as `Unreviewed`.
- Published signals should be at least `Reviewed`.
- Use `Needs Follow-Up` for important claims with incomplete evidence.

## Relationship Rules

### Signal to Source

- Every signal must cite at least one source.
- A signal may cite multiple sources.
- The source record should preserve the original URL and capture date.

### Signal to Topic

- Every signal must have one primary topic.
- Secondary topics are optional.

### Signal to Framework Layer

- Every signal must map to at least one framework layer.
- Signals with local implications often map to both a technical layer and a human or planetary layer.

### Signal to Organization

- A signal may involve one or more organizations.
- Distinguish between claimant, regulator, funder, operator, and affected organization when possible.

### Signal to Local System

- A signal may affect one or more receiving systems.
- Local system relationships should include a short explanation of why the signal matters there.

### Topic to Technology

- A topic can contain many technologies.
- A technology can belong to multiple topics.

### Project to Organization

- A project can involve operators, funders, regulators, suppliers, and research partners.

### Technology to Constraint

- Technologies should be linked to recurring dependency and constraint patterns.
- Avoid assuming that a constraint is global when it is local.

### Dependency Map Relationships

Dependency maps use qualitative relationships between nodes.

MVP node types:

```text
Signal
Source
Technology
Local System
Evidence Gap
Topic
Constraint
```

MVP link types:

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

MVP confidence labels:

```text
Supported
Partial
Missing Evidence
Watch
```

Rules:

- Dependency-map links must be explicit.
- Do not infer relationships from prose.
- Use `Missing Evidence` when a relationship depends on an active evidence gap.
- Use `Watch` when the relationship is plausible or important but not yet supported enough for a stronger label.
- Do not use numeric 42/59 scoring until the scoring method is separately defined and tested.

## Naming Rules

- Use title case for public pillar names.
- Use singular nouns for entity types: Signal, Source, Topic, Organization.
- Prefer plain-language labels over insider jargon.
- Keep theoretical language in docs unless it is being intentionally surfaced in an essay or feature.
