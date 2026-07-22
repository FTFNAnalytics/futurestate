# Content Scaffold Plan

This document defines the first FTFN content/data scaffold.

This document was created before the app existed. Phase 04 has now created the first `app/` scaffold, so this document should be treated as the storage and validation plan behind that implementation.

## Scaffold Principles

- One record per file where possible.
- Stable IDs from the beginning.
- Human-readable slugs.
- Explicit references between records.
- Draft records allowed, but published records must pass stricter validation.
- Editorial text and structured data should live together only when that helps the writer.
- Do not hard-code sample data inside components.

## Recommended Repository Structure

```text
/
  README.md
  docs/
    ...
  app/
    astro project lives here after Phase 04
```

When the Astro app is scaffolded:

```text
app/
  astro.config.mjs
  package.json
  tsconfig.json
  src/
    content.config.ts
    content/
      signals/
        signal-sample-001.mdx
      briefings/
        briefing-sample-001.mdx
      topics/
        climate.json
      sources/
        source-noaa-cpc-enso.json
      organizations/
        org-example.json
      technologies/
        lidar.json
      local-systems/
        local-ontario-real-estate.mdx
      dependency-maps/
        local-constraints-where-the-future-arrives.json
    pages/
      index.astro
      signals/
        index.astro
        [slug].astro
      atlas/
        index.astro
        topics/
          index.astro
          [slug].astro
        sources/
          index.astro
          [slug].astro
        local-systems/
          index.astro
          [slug].astro
      briefings/
        index.astro
        [slug].astro
      about/
        index.astro
    components/
      layout/
      signals/
      atlas/
      navigation/
      ui/
    styles/
      global.css
      tokens.css
```

## Content Storage Decisions

### Signals

Format:

```text
MDX
```

Reason:

Signals need structured metadata plus an optional editorial body.

File pattern:

```text
app/src/content/signals/[signal-id-or-slug].mdx
```

Frontmatter should hold:

- id,
- title,
- slug,
- record_status,
- summary,
- source_ids,
- published_date,
- captured_date,
- primary_topic,
- framework_layers,
- signal_type,
- maturity_level,
- time_horizon,
- evidence_quality,
- verification_status,
- dependencies,
- constraints,
- receiving_systems,
- local_implications,
- editorial_notes.

Body should hold:

- What changed,
- Why it matters,
- Dependency stack,
- Constraint watch,
- Local implications,
- What to watch next.

### Sources

Format:

```text
JSON
```

Reason:

Source records are structured and do not need rich editorial body content at MVP.

File pattern:

```text
app/src/content/sources/[source-id].json
```

### Topics

Format:

```text
JSON
```

Reason:

Topic records are mostly structured, with page copy generated from fields at MVP.

File pattern:

```text
app/src/content/topics/[topic-slug].json
```

Later:

Move rich topic essays to MDX if topic pages need deeper editorial copy.

### Organizations

Format:

```text
JSON
```

Reason:

Organization profiles begin as structured reference records.

File pattern:

```text
app/src/content/organizations/[organization-id].json
```

### Technologies

Format:

```text
JSON
```

Reason:

Technology profiles begin as structured reference records.

File pattern:

```text
app/src/content/technologies/[technology-id].json
```

Later:

Move high-priority technology profiles to MDX if they need explainer content.

### Local System Profiles

Format:

```text
MDX
```

Reason:

Local system profiles need structured metadata plus narrative explanation, uncertainty notes, and interpretation.

File pattern:

```text
app/src/content/local-systems/[local-system-id].mdx
```

### Briefings

Format:

```text
MDX
```

Reason:

Briefings are editorial synthesis documents with structured references to signals.

File pattern:

```text
app/src/content/briefings/[briefing-slug].mdx
```

### Dependency Maps

Format:

```text
JSON
```

Reason:

Dependency maps are structured relationship records. They need node and link validation more than rich prose at MVP.

File pattern:

```text
app/src/content/dependency-maps/[dependency-map-slug].json
```

Later:

Move selected maps to MDX or database-backed records only if they need long-form interpretation, graph rendering, or generated relationship views.

## Seed Content Decision

Decision:

Do not convert sample records into seed files during this documentation-only Phase 03.

Convert them in Phase 04 after the Astro project and content collections exist.

Reason:

The sample records should become real files only once schemas exist to validate them. That keeps the first implementation step small and reversible.

Phase 04 update:

The Phase 02 sample sources, topics, signals, and local system profiles have now been converted into seed files under `app/src/content/`. The next step is installed-dependency validation with Astro content collections.

## Required Collections

Phase 04 should define these collections:

```text
signals
sources
topics
organizations
technologies
localSystems
briefings
evidenceGaps
dependencyMaps
```

Later collections:

```text
projects
materials
policies
datasets
roadmaps
```

## Validation Requirements

Current app validation commands from `app/`:

```text
npm run validate:content
npm run check
npm run build
```

`npm run validate:content` is the Phase 22 reference-integrity gate. It complements Astro schema validation by checking cross-record IDs and publication guardrails.

### Shared Rules

- IDs must be unique.
- Slugs must be URL-safe.
- Controlled vocabulary values must match the taxonomy.
- References should point to valid record IDs.
- Arrays should not be empty when they represent required meaning.
- Public records must not have `verification_status: Unreviewed`.
- Broad content expansion should not proceed if `npm run validate:content` fails.

### Signal Validation

Draft sample signal:

- may have `published_date: null`,
- may have `verification_status: Unreviewed`,
- must have required taxonomy fields,
- must cite at least one source.

Published signal:

- must have `record_status: Published`,
- must have `published_date`,
- must have `verification_status: Reviewed` or `Verified Against Primary Source`,
- must have at least one source,
- must have summary, why_it_matters, dependencies, and constraints,
- must not rely on `Company Claim` without an editorial caveat.

### Source Validation

Source:

- must have URL,
- must have source_type,
- must have credibility_level,
- must have at least one primary topic,
- should have known limitations.

### Topic Validation

Topic:

- must match a public topic pillar,
- must include framework layers,
- must include primary constraints,
- should include watch questions.

### Local System Validation

Local system profile:

- must have geography or scope,
- must have system_type,
- must define current_equilibrium,
- must include core constraints,
- should include missing_data,
- should include source_ids before public launch.

### Briefing Validation

Briefing:

- must include published_date when published,
- must reference at least one signal,
- must include top_takeaways,
- must include constraint_watch,
- must include what_to_watch_next.

### Dependency Map Validation

Dependency map:

- must have a stable ID and slug,
- must use a supported map type,
- must include a map question and interpretation boundary,
- must include at least one node and one link,
- must use valid record IDs when a node references a record,
- must use valid source, signal, technology, local system, and evidence gap IDs,
- must ensure every link points to node IDs inside the same map,
- must use qualitative confidence labels,
- must not contain numeric 42/59 scoring.

## Public Versus Internal Fields

### Public At MVP

Signals:

- title,
- summary,
- published_date,
- primary_topic,
- framework_layers,
- signal_type,
- maturity_level,
- time_horizon,
- source links,
- evidence quality,
- why it matters,
- dependencies,
- constraints,
- local implications when available.

Sources:

- name,
- URL,
- source_type,
- credibility_level,
- primary_topics,
- known limitations.

Topics:

- name,
- summary,
- framework_layers,
- primary_constraints,
- watch_questions,
- latest signals.

Local systems:

- name,
- summary,
- geography,
- key industries,
- core constraints,
- current equilibrium,
- missing data note.

Briefings:

- title,
- date,
- summary,
- top takeaways,
- top signals,
- constraint watch,
- what to watch next.

Dependency maps:

- title,
- summary,
- map type,
- record status,
- primary topic,
- framework layers,
- constraint tags,
- map question,
- interpretation boundary,
- nodes,
- links,
- qualitative confidence labels,
- evidence limits,
- next records needed.

### Internal-Only At MVP

Signals:

- editorial_notes,
- record_status unless needed for draft preview,
- verification workflow notes,
- last_reviewed_date,
- unresolved source concerns.

Sources:

- capture_priority,
- last_checked_date,
- internal notes.

Local systems:

- incomplete actor mapping,
- speculative second-order effects,
- weakly sourced local implications.

## Phase 04 Implementation Order

Status: complete. Later phases have validated the scaffold through Astro checks, static builds, and the Phase 22 reference-integrity gate.

1. Scaffold Astro app in `app/`. Status: complete.
2. Add TypeScript. Status: complete.
3. Add content collections. Status: complete.
4. Define Zod schemas. Status: complete.
5. Add content folders. Status: complete.
6. Convert sample source records. Status: complete.
7. Convert sample topic records. Status: complete.
8. Convert sample signal records. Status: complete.
9. Convert local system profiles. Status: complete.
10. Add minimal generated pages. Status: complete.
11. Run validation/build. Status: complete.

## Risks

- Too many collections too early could slow implementation.
- Relationship validation can become complex before the first site exists.
- MDX can tempt over-designed editorial pages before simple signal pages work.
- Local system profiles may appear more authoritative than their sourcing supports.
- Dependency maps may appear more causal or complete than the evidence supports.

Mitigation:

- Start with simple generated pages.
- Keep public labels clear.
- Keep local system profiles cautious.
- Validate enough to catch mistakes, not enough to block learning.
- Keep dependency maps qualitative until FTFN has enough records for scoring or generated graph views.
