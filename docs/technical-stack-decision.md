# Technical Stack Decision

This document records the FTFN MVP stack decision.

## Recommendation

Use:

```text
Astro + TypeScript + Astro content collections + Markdown/MDX + JSON/YAML data records
```

MVP posture:

```text
static-first, content-first, validation-first
```

Growth path:

```text
Astro content collections
  -> generated static publication
  -> static search and filtering
  -> remote loaders or CMS
  -> database-backed ingestion and editorial review
```

## Why This Fits FTFN

FTFN is currently:

- editorial,
- content-heavy,
- structured-record-heavy,
- source-sensitive,
- taxonomy-driven,
- mostly static at MVP,
- likely to need stronger data infrastructure later.

Astro is the best fit for this stage because it is designed for content-heavy static sites, supports local content collections, validates collection data with schemas, and keeps client-side JavaScript low unless interactivity is explicitly needed.

Official docs checked:

- Astro content collections can use local Markdown, MDX, Markdoc, YAML, TOML, or JSON files and support schemas for validation and TypeScript types: [Astro Content Collections](https://docs.astro.build/en/guides/content-collections/)
- Astro islands keep most pages static while hydrating only the components that need browser-side interactivity: [Astro Islands](https://docs.astro.build/en/concepts/islands/)
- Next.js supports MDX and static export, but the MVP does not yet need the heavier app-framework surface: [Next.js MDX](https://nextjs.org/docs/app/guides/mdx), [Next.js Static Exports](https://nextjs.org/docs/14/pages/building-your-application/deploying/static-exports)

## Compared Options

### Option 1: Static HTML/CSS/JS

Summary:

Build a plain static site without a framework.

Pros:

- very simple,
- fast,
- low dependency footprint,
- easy to host.

Cons:

- weak structured content support,
- manual routing,
- manual validation,
- hard to scale relationships between signals, topics, sources, and local systems,
- likely to become brittle quickly.

Verdict:

Too limited for FTFN's structured content model.

### Option 2: Next.js Or Similar App Framework

Summary:

Use a full React application framework.

Pros:

- strong ecosystem,
- good long-term app path,
- supports MDX,
- supports static generation and dynamic features,
- strong fit if FTFN quickly needs accounts, dashboards, server actions, or complex search.

Cons:

- more application machinery than MVP requires,
- MDX/content modeling needs more custom setup,
- greater risk of building app complexity before the editorial system is proven,
- static export has constraints that must be managed.

Verdict:

Strong future option, but not the best MVP default.

### Option 3: Astro Or Similar Content-First Framework

Summary:

Use a content-first static framework with structured content collections.

Pros:

- strong fit for publication-style sites,
- local content collections support structured records,
- schema validation is built into the content workflow,
- Markdown/MDX support fits editorial work,
- low JavaScript by default,
- interactive islands can be added only where needed,
- static output keeps hosting simple,
- remote loaders and server features leave a future growth path.

Cons:

- less app-native than Next.js for complex dashboards or logged-in features,
- some advanced relationship modeling will still require careful schema design,
- future ingestion/admin workflows may eventually outgrow local files.

Verdict:

Best MVP fit.

### Option 4: Headless CMS First

Summary:

Start with a hosted CMS for editorial entry.

Pros:

- editor-friendly,
- can support review workflows,
- good for teams,
- avoids manual file editing later.

Cons:

- premature operational complexity,
- schema may change frequently at this stage,
- vendor and migration choices arrive too early,
- may obscure the underlying data model while it is still being tested.

Verdict:

Do not start here. Consider after the content model stabilizes and multiple contributors exist.

### Option 5: Local Markdown/MDX Plus Structured YAML/JSON

Summary:

Use local files as the content database.

Pros:

- version-controlled,
- transparent,
- easy to review,
- easy to migrate,
- fits current sample records,
- supports editorial and structured content side by side.

Cons:

- no native editorial UI,
- relationships require validation discipline,
- bulk updates can become awkward,
- ingestion will need tooling later.

Verdict:

Use this as the MVP content storage model inside Astro content collections.

### Option 6: Database-Backed Approach

Summary:

Use Postgres, SQLite, or another database from the start.

Pros:

- strong querying,
- easier relational modeling,
- better for ingestion and dashboards,
- stronger path to APIs and admin tools.

Cons:

- premature for current stage,
- increases setup and deployment complexity,
- forces schema decisions before seed content is proven,
- slower for editorial iteration.

Verdict:

Defer. Plan for migration later.

## Final MVP Stack

```text
Framework: Astro
Language: TypeScript
Content: Astro content collections
Editorial body: Markdown or MDX
Structured data: JSON or YAML, loaded through Astro collections
Validation: Astro content schemas with Zod
Styling: CSS custom properties and component-scoped CSS at first
Interactivity: minimal Astro islands only when needed
Search/filtering: static/generated first, advanced later
Database: none for MVP
CMS: none for MVP
```

## Growth Path

### Stage 1: Static Publication

- local content files,
- schema validation,
- generated pages,
- simple filters,
- manual editorial workflow.

### Stage 2: Structured Intelligence Site

- richer relationship views,
- static search,
- generated indexes,
- topic and source profiles,
- briefings,
- local system pages.

### Stage 3: Capture And Review Workflow

- source monitoring scripts,
- draft signal generation,
- duplicate checks,
- editorial review queue,
- remote loaders or imported JSON.

### Stage 4: Database And Admin Layer

- database-backed records,
- authenticated admin,
- source freshness tracking,
- public datasets,
- API or exports,
- alerts and watchlists.

## Tradeoffs

### Editorial Workflow

Astro with local files is less friendly than a CMS for nontechnical editors, but it is better for early model iteration. Every record is version-controlled and visible.

### Structured Records

Astro content collections fit FTFN's need for structured signals, sources, topics, technologies, briefings, and local system profiles.

### Validation

Astro content schemas with Zod are a strong fit for controlled vocabularies and draft/published validation.

### Filtering

MVP filtering can be generated from content collection metadata. Advanced filtering can come later.

### Search

Search should start as simple client-side or static-index search. Do not build a database search engine until the content corpus justifies it.

### Hosting

Static output keeps hosting simple and cheap.

### Future Migration

Local records should use stable IDs and explicit relationships so they can migrate to a database later.

## Decisions

- Use Astro for MVP.
- Use TypeScript.
- Use Astro content collections.
- Use Markdown/MDX for editorial-heavy records.
- Use JSON or YAML for structured data-heavy records.
- Do not start with a CMS.
- Do not start with a database.
- Convert sample records into seed content after the Astro scaffold exists.

## References Checked

- [Astro Content Collections](https://docs.astro.build/en/guides/content-collections/)
- [Astro Islands Architecture](https://docs.astro.build/en/concepts/islands/)
- [Next.js MDX Guide](https://nextjs.org/docs/app/guides/mdx)
- [Next.js Static Exports](https://nextjs.org/docs/14/pages/building-your-application/deploying/static-exports)

