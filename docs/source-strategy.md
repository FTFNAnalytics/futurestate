# Source Strategy

This document defines how Forty Two Fifty Nine selects, evaluates, categorizes, and monitors sources.

The project should summarize and contextualize sources. It should not mirror press releases or amplify unsupported hype.

## Source Principles

- Prefer primary sources.
- Separate claims from evidence.
- Treat company announcements as interested-party claims.
- Treat official data as authoritative but still requiring interpretation.
- Use credible reporting to add context, not to replace primary sources when primary sources are available.
- Preserve source URLs, dates, and capture notes.
- Avoid long quotations.
- Link clearly.
- Mark uncertainty.

## Preferred Source Categories

### Tier 1: Official Data and Primary Institutional Sources

Examples:

- government agencies,
- regulators,
- statistical agencies,
- space agencies,
- weather and climate agencies,
- standards bodies,
- official datasets,
- regulatory filings.

Use for:

- data,
- rules,
- forecasts,
- certification status,
- official program updates,
- policy changes.

Limitations:

- Can be slow.
- Can require domain interpretation.
- May omit private-sector context.

### Tier 2: Research and Technical Sources

Examples:

- peer-reviewed journals,
- universities,
- national labs,
- research institutes,
- conference proceedings,
- technical reports.

Use for:

- scientific results,
- technical context,
- early-stage breakthroughs,
- validation of methods.

Limitations:

- May not imply near-term deployment.
- May be narrow.
- May require expert interpretation.

### Tier 3: Company and Organization Primary Sources

Examples:

- company press rooms,
- investor updates,
- product pages,
- mission updates,
- project pages,
- partnership announcements.

Use for:

- announcements,
- deployments,
- partnerships,
- funding,
- product claims,
- operational milestones.

Limitations:

- Incentivized.
- Selective.
- Often promotional.
- May blur pilot, prototype, and commercial status.

### Tier 4: Credible Reporting and Trade Publications

Examples:

- domain-specialist publications,
- high-quality newspapers,
- technical analysts,
- sector-specific reporting.

Use for:

- context,
- independent verification,
- market interpretation,
- controversy,
- local implications,
- second-order effects.

Limitations:

- May depend on unnamed sources.
- May use framing that needs checking.
- May simplify technical details.

### Tier 5: Commentary, Forecasts, and Market Narratives

Examples:

- think tanks,
- investor commentary,
- consultancy reports,
- expert blogs,
- podcasts,
- public talks.

Use for:

- hypotheses,
- scenario analysis,
- expert perspectives,
- open questions.

Limitations:

- Not usually evidence by itself.
- May be agenda-driven.
- Can create narrative momentum without operational proof.

## Credibility Levels

Use these levels in source records.

```text
Tier 1: Official data or primary institutional source
Tier 2: Research or technical source
Tier 3: Primary interested-party source
Tier 4: Credible independent reporting
Tier 5: Commentary or scenario source
Do Not Use: Low-quality, repost, spam, or unsupported hype source
```

Credibility is contextual. A company can be Tier 3 for its own announcement but not independent evidence of market impact.

## Source Evaluation Checklist

Before adding a source, ask:

- Who produced it?
- What incentives do they have?
- Is this a primary source, interpretation, or repost?
- Does it provide dates?
- Does it link to data or evidence?
- Does it distinguish pilot, prototype, and commercial deployment?
- Does it make claims that can be verified?
- Is it relevant to one of the project pillars?
- Does it help explain dependencies or constraints?
- Is there a better primary source?

## Capture Priority

High priority:

- official agencies and regulators,
- official datasets,
- company press rooms for key frontier sectors,
- national labs and major research organizations,
- standards bodies,
- sources that frequently produce actionable signals.

Medium priority:

- credible trade reporting,
- university research offices,
- think tanks with strong sourcing,
- local/regional sources for key local system profiles.

Low priority:

- commentary-only sources,
- low-frequency sources,
- broad tech-news aggregators,
- sources that rarely add original evidence.

Do not use:

- content farms,
- repost-only sites,
- unsourced hype blogs,
- sources with no clear authorship or dates,
- AI-generated repost pages.

## Monitoring Methods

MVP monitoring:

- manually curated source list,
- manual weekly review,
- saved source URLs,
- simple source records,
- manual signal creation,
- generated source freshness monitor from source metadata.

Later monitoring:

- RSS where available,
- email alerts,
- press-room checks,
- official dataset updates,
- API ingestion,
- duplicate detection,
- source freshness tracking,
- editorial review queue.

## Generated Source Monitor

Phase 37 adds a generated source monitor at:

```text
/atlas/source-monitor/
```

The monitor uses existing source record fields to identify which sources are current, which should be watched soon, and which are due for manual review:

- `last_checked_date`
- `update_frequency`
- `capture_priority`
- `credibility_level`
- `primary_topics`

The monitor does not fetch URLs, rewrite records, or publish automatically. It is a review surface for source freshness and authority. Before a source supports a new public claim, use the monitor to decide whether the source should be rechecked.

## Source Record Requirements

Minimum record:

```text
name
url
source_type
credibility_level
primary_topics
capture_priority
notes
```

Preferred record:

```text
name
url
rss_url
api_url
source_type
credibility_level
primary_topics
framework_layers
country_or_region
update_frequency
capture_priority
known_limitations
last_checked_date
notes
```

## Priority Source Areas for MVP

Start with sources in these areas:

- climate and ENSO,
- energy and grid,
- critical minerals,
- semiconductor manufacturing,
- autonomous mobility,
- drones and eVTOL,
- space systems,
- quantum and post-quantum security,
- AI for science,
- agriculture and bioeconomy,
- water,
- policy and standards.

## Editorial Use Rules

When writing from a source:

- summarize instead of copying,
- name who is making the claim,
- distinguish evidence from interpretation,
- identify maturity level,
- identify dependencies,
- identify constraints,
- link to the original,
- add uncertainty when needed.

Do not:

- paste long press-release passages,
- accept "breakthrough" language without evidence,
- turn a financing announcement into proof of deployment,
- treat a pilot as scaled adoption,
- treat global relevance as local relevance without local analysis.

## Local System Sources

Local system profiles need different sources than global technology coverage.

Useful categories:

- local utility data,
- water authorities,
- municipal planning documents,
- regional economic development agencies,
- labor market data,
- permitting records,
- infrastructure plans,
- local news with original reporting,
- Indigenous government and community sources where relevant,
- regional climate and hazard data.

Rule:

When a signal has local implications, pair the frontier source with local system sources before drawing strong conclusions.
