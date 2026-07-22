# Information Architecture

This document defines the first product structure for FTFN.

The goal is to make the project navigable before building the website.

## IA Principles

- Lead with the thesis, then show real signals.
- Keep the first public experience editorial, not corporate.
- Let readers move from signal to system: source, topic, dependency, constraint, local implication.
- Support both scanning and deep research.
- Make MVP navigation smaller than the full ambition.
- Keep advanced data views possible without forcing them into the first release.

## MVP Navigation

Recommended MVP nav:

```text
Home
Signals
Atlas
Briefings
Method
About
```

Rationale:

- `Home` establishes the thesis and current activity.
- `Signals` is the daily/weekly intelligence stream.
- `Atlas` holds topic pages, source profiles, organization profiles, technologies, local system profiles, evidence gaps, and dependency maps.
- `Briefings` creates the publication rhythm.
- `Method` explains source posture, publication policy, correction/update rules, and the publication gate.
- `About` explains the thesis, project identity, and 42/59 framing.

## Full Future Navigation

Full future nav:

```text
Signals
Roadmaps
Atlas
Data
Briefings
About
```

Hold `Roadmaps` and `Data` until there is enough structured content to make them useful.

## Sitemap

```text
/
  Home

/signals
  Signal index
  /signals/[signal-slug]
    Signal detail

/atlas
  Atlas index
  /atlas/topics
    Topic index
  /atlas/topics/[topic-slug]
    Topic detail
  /atlas/sources
    Source index
  /atlas/sources/[source-slug]
    Source profile
  /atlas/organizations
    Organization index
  /atlas/organizations/[organization-slug]
    Organization profile
  /atlas/technologies
    Technology index
  /atlas/technologies/[technology-slug]
    Technology profile
  /atlas/local-systems
    Local system index
  /atlas/local-systems/[local-system-slug]
    Local system profile
  /atlas/evidence-gaps
    Evidence gap index
  /atlas/evidence-gaps/[evidence-gap-slug]
    Evidence gap profile
  /atlas/dependency-maps
    Dependency map index
  /atlas/dependency-maps/[dependency-map-slug]
    Dependency map detail

/briefings
  Briefing index
  /briefings/[briefing-slug]
    Briefing detail

/method
  Method and publication policy
  Source transparency
  Correction/update policy

/roadmaps
  Roadmap index
  /roadmaps/[roadmap-slug]
    Roadmap detail

/data
  Data index
  /data/sources
  /data/signals
  /data/topics
  /data/local-systems

/about
  About FTFN
  42/59 framing
  Project thesis
  Link to Method
```

## Page Types

### Home

Purpose:

Establish the identity, show current signals, and route readers into the project.

Required modules:

- thesis hero,
- latest signals,
- dependency stack introduction,
- topic pillar grid,
- constraint watch,
- dependency-map entry point,
- featured briefing,
- featured local system or roadmap,
- source/editorial transparency link.

MVP notes:

- The homepage should not be a generic landing page.
- It should feel like a publication already in motion.

### Signal Index

Purpose:

Let readers scan developments across the future-state system.

Required modules:

- signal list,
- topic filters,
- framework layer filters,
- signal type filters,
- maturity filters,
- time horizon filters,
- constraint filters,
- source credibility indicator,
- search.

MVP notes:

- Start with simple filtering.
- Advanced search can wait.

### Signal Detail

Purpose:

Explain one development as a structured signal.

Required modules:

- title and summary,
- what changed,
- why it matters,
- source citation,
- source type and evidence quality,
- signal type,
- maturity level,
- time horizon,
- dependency stack,
- constraint watch,
- related topics,
- related organizations,
- local implications,
- editorial notes or uncertainty note.

MVP notes:

- `local_implications` may be brief at launch.
- Use clear labels to avoid turning every signal into a full report.

### Atlas Index

Purpose:

Give readers a structured map of the FTFN universe.

Required modules:

- topic pillar grid,
- key technologies,
- key sources,
- local systems,
- organizations,
- evidence gaps,
- featured dependency maps.

MVP notes:

- Dependency maps should be introduced as qualitative relationship records, not as scored graphs.
- The Atlas landing page can show current map counts and selection-rule context while map volume is low.

### Dependency Map Index

Purpose:

Let readers scan qualitative maps before entering a detail page.

Required modules:

- total map count,
- counts by map type,
- counts by topic,
- counts by status,
- selection-rule note,
- all-map card grid,
- grouped map lists by type and topic.

MVP notes:

- Keep the index static until map volume justifies filtering.
- Do not use the index as a scorecard.
- Do not imply that grouped maps resolve evidence gaps or prove local readiness.

### Dependency Map Detail

Purpose:

Show a qualitative relationship map across records without implying automated inference or numeric scoring.

Required modules:

- map question,
- interpretation boundary,
- compact structure summary,
- selection-rule check,
- linked-record-type counts,
- confidence mix,
- nodes,
- qualitative links,
- confidence labels,
- what the map supports,
- what the map does not prove,
- next records needed,
- related signals, sources, technologies, local systems, and evidence gaps.

MVP notes:

- Keep maps as structured editorial records.
- Avoid graph visuals until relationship data is stable.
- Do not add numeric 42/59 scoring in the MVP map surface.

### Topic Index

Purpose:

List public topic pillars.

Required modules:

- pillar cards,
- short descriptions,
- framework layer mappings,
- latest signal counts,
- constraint tags.

### Topic Detail

Purpose:

Explain a domain and collect related signals, sources, technologies, organizations, and constraints.

Required modules:

- overview,
- why it matters,
- framework layer mapping,
- maturity overview,
- dependency stack,
- key constraints,
- key sources,
- key organizations,
- key technologies,
- latest signals,
- watch questions,
- related topics.

### Source Profile

Purpose:

Explain where information comes from and how FTFN treats it.

Required modules:

- source name,
- URL,
- source type,
- credibility level,
- primary topics,
- update frequency,
- capture priority,
- known limitations,
- related signals.

### Organization Profile

Purpose:

Track organizations that produce, fund, regulate, operate, or are affected by future-state signals.

Required modules:

- organization summary,
- organization type,
- roles,
- primary topics,
- related sources,
- related projects,
- related signals,
- evidence caveats.

### Technology Profile

Purpose:

Explain a technology across topics and constraints.

Required modules:

- plain-language overview,
- maturity level,
- dependency stack,
- core constraints,
- key organizations,
- relevant projects,
- related signals,
- watch questions.

### Local System Profile

Purpose:

Show how signals are transduced through local constraints.

Required modules:

- system overview,
- geography or scope,
- current equilibrium,
- key industries,
- core constraints,
- energy, water, labor, infrastructure, regulation, capital, and climate notes,
- actors with authority,
- relevant signals,
- likely second-order effects,
- missing data.

MVP notes:

- Local system profiles may begin as internal analysis pages.
- If public at MVP, use careful uncertainty language.

### Briefing Index

Purpose:

Collect recurring editorial syntheses.

Required modules:

- briefing list,
- date,
- summary,
- topics covered,
- top constraints,
- signal count.

### Briefing Detail

Purpose:

Summarize a week, month, or theme across multiple signals.

Required modules:

- title,
- summary,
- top takeaways,
- top signals,
- dependency shifts,
- constraint watch,
- local system notes,
- what to watch next.

### Roadmap Detail

Purpose:

Show how a domain may move from theory to deployment.

Required modules:

- domain overview,
- maturity ladder,
- key milestones,
- dependencies,
- constraints,
- active signals,
- time horizons,
- open questions.

MVP notes:

- Roadmaps can wait until enough signals exist.

### Data Index

Purpose:

Expose structured datasets when the project has enough records.

Required modules:

- dataset list,
- field descriptions,
- download/export links,
- update cadence,
- source notes.

MVP notes:

- Hold until the data is useful.

### Method

Purpose:

Explain how FTFN treats evidence, source incentives, launch candidates, correction/update work, and publication approval.

Required modules:

- publication states,
- source transparency posture,
- correction/update policy,
- launch gate,
- AI and automation boundary,
- link to source Atlas,
- link to current signal states.

MVP notes:

- Keep the Method page compact.
- Do not turn it into a legal page.
- Treat it as trust infrastructure for the first public launch.

### About

Purpose:

Explain what FTFN is, why it exists, and how the 42/59 framing works.

Required modules:

- thesis,
- 42/59 framing,
- project identity,
- link to Method and publication policy,
- contact or contribution note when available.

## Reader Journeys

### Journey 1: Scan What Changed

Reader goal:

Understand the most important signals this week.

Path:

```text
Home -> Latest Signals -> Signal Detail -> Related Topic
```

Success:

The reader understands what changed, why it matters, and what constraints shape it.

### Journey 2: Research A Domain

Reader goal:

Understand an area like quantum, aviation, critical minerals, or climate.

Path:

```text
Atlas -> Topic Detail -> Key Sources -> Related Signals -> Dependency Stack
```

Success:

The reader sees the domain as a system, not a list of headlines.

### Journey 3: Interpret A Signal Locally

Reader goal:

Understand what a global signal means for a place, sector, or market.

Path:

```text
Signal Detail -> Local Implications -> Local System Profile
```

Success:

The reader sees how constraints change local meaning.

### Journey 4: Verify A Claim

Reader goal:

Check where a claim came from.

Path:

```text
Signal Detail -> Source Profile -> Original Source URL
```

Success:

The reader can distinguish evidence, interpretation, and interested-party claims.

### Journey 5: Follow A Briefing

Reader goal:

Get a periodic synthesis of frontier change.

Path:

```text
Briefings -> Briefing Detail -> Top Signals -> Topics
```

Success:

The reader understands the week through dependencies and constraints.

### Journey 6: Follow The Dependency Stack

Reader goal:

Understand how signals, technologies, sources, local systems, and evidence gaps connect.

Path:

```text
Home -> Atlas -> Dependency Maps -> Dependency Map Detail -> Related Records
```

Success:

The reader sees the stack of dependencies without mistaking the map for a score, a prediction, or proof of local readiness.

## MVP Filtering Dimensions

Start with:

- topic,
- framework layer,
- signal type,
- maturity level,
- time horizon,
- constraint,
- source credibility.

Later:

- geography,
- organization,
- project,
- technology,
- local system,
- evidence quality,
- verification status.

## Content Relationship Model

```text
Source -> Signal -> Topic
                 -> Framework Layer
                 -> Technology
                 -> Organization
                 -> Project
                 -> Constraint
                 -> Local System

Briefing -> Signals
Topic -> Sources, Technologies, Organizations, Signals
Local System -> Signals, Constraints, Projects, Actors
```

## Technical Stack Implications

The stack should support:

- structured content records,
- Markdown or MDX body content,
- frontmatter validation,
- page generation from records,
- filtering by controlled vocabularies,
- relationship links between records,
- easy manual editing,
- later migration to a database.

This points toward a static-first or hybrid app with structured content collections for MVP.
