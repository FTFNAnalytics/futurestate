# Forty Two Fifty Nine Prompt Library

This library contains reusable prompts for building and operating Forty Two Fifty Nine. Use these prompts as starting points, then tailor them to the specific task.

## Current Next Prompt

- [Phase 07 Starter Prompt: Homepage Narrative and Visual Design](prompts/phase-07-homepage-narrative-and-visual-design.md)

## 1. Project Continuity Prompt

Use this at the start of a new working session.

```text
We are building Forty Two Fifty Nine, a future-state intelligence platform.

Core thesis:
42 is possibility.
59 is urgency.
The future is not a list of inventions. It is a stack of dependencies.

The project tracks frontier technologies, enabling infrastructure, planetary conditions, resource foundations, and human systems. It summarizes and contextualizes signals from companies, agencies, labs, research organizations, and credible reporting.

Start by reading README.md, docs/master-roadmap.md, docs/prompt-library.md, and any decision log. Then inspect the current repo state. Continue from the roadmap rather than restarting the strategy.
```

## 2. Roadmap Update Prompt

Use this after a work session or major decision.

```text
Update the Forty Two Fifty Nine roadmap based on the work completed in this session.

Requirements:
- Mark completed items accurately.
- Add any new decisions to the decision log.
- Add new tasks that emerged.
- Remove or rewrite stale assumptions.
- Keep the roadmap practical and sequenced.
- Preserve the core thesis and master framework.

Do not make broad rewrites unless the underlying strategy changed.
```

## 3. Information Architecture Prompt

Use this when designing the sitemap and content structure.

```text
Design the information architecture for Forty Two Fifty Nine.

The site must support:
- signals,
- topic pages,
- roadmaps,
- source profiles,
- organization profiles,
- dependency maps,
- briefings,
- data views.

Use this navigation as a starting point:
Signals, Roadmaps, Atlas, Data, Briefings, About.

Use these topic pillars:
Mobility, Aviation, Space, Energy, Climate, Critical Minerals, Chips and Compute, AI for Science, Quantum, Advanced Manufacturing, Agriculture and Bioeconomy, Discovery Technologies, Water, Cybersecurity, Policy and Standards, Finance and Risk, Human Futures.

Produce:
- sitemap,
- page types,
- page modules,
- required fields,
- MVP scope,
- later expansion scope.
```

## 4. Signal Schema Prompt

Use this to refine the content model.

```text
Create or refine the signal schema for Forty Two Fifty Nine.

A signal is a structured summary of a press release, research result, launch, regulation, accident, funding round, climate update, company milestone, report, dataset, or market shift.

Required fields should include:
title, source, source_type, source_url, published_date, captured_date, pillar, framework_layer, technology, organization, location, signal_type, maturity_level, time_horizon, summary, why_it_matters, dependencies, constraints, evidence_quality, verification_status, editorial_notes.

Produce:
- field definitions,
- allowed values,
- validation rules,
- sample JSON,
- sample Markdown/frontmatter,
- MVP versus later fields.
```

## 5. Source Research Prompt

Use this to identify sources for one pillar.

```text
Build a source list for the [PILLAR] pillar of Forty Two Fifty Nine.

Prioritize:
- official company press rooms,
- government agencies,
- research labs,
- universities,
- standards bodies,
- credible trade publications,
- high-quality datasets.

For each source, provide:
- name,
- URL,
- source type,
- topic relevance,
- whether RSS or structured feeds are available,
- expected update frequency,
- credibility notes,
- capture priority.

Avoid low-quality blogs, repost sites, and sources that mostly amplify hype without original evidence.
```

## 6. Signal Brief Writing Prompt

Use this to turn one source item into a structured brief.

```text
Write a Forty Two Fifty Nine signal brief from the source below.

Source URL:
[URL]

Requirements:
- Summarize; do not quote extensively.
- Identify who is making the claim.
- Explain what changed.
- Explain why it matters.
- Place it on the maturity ladder.
- Identify dependencies.
- Identify constraints or blockers.
- Assign a realistic time horizon.
- Include source link.
- Avoid hype language.
- Be curious, skeptical, urgent, and clear.

Output format:
Title
What Changed
Why It Matters
Maturity
Dependency Stack
Constraint Watch
Time Horizon
Source
Editorial Notes
```

## 7. Dependency Map Prompt

Use this for a technology, sector, or project.

```text
Create a dependency map for [TECHNOLOGY OR DOMAIN] in the Forty Two Fifty Nine framework.

Show what must be true for this domain to scale.

Consider:
- energy,
- materials,
- chips and compute,
- water,
- manufacturing,
- regulation,
- certification,
- capital,
- insurance,
- cybersecurity,
- labor,
- public trust,
- climate,
- geopolitics,
- unit economics,
- standards.

Output:
- one-sentence thesis,
- dependency list,
- primary bottlenecks,
- second-order effects,
- maturity assessment,
- 2-5 year outlook,
- 5-15 year outlook,
- signals to monitor.
```

## 8. Local System Profile Prompt

Use this to understand how frontier signals affect a specific place, sector, institution, or market.

```text
Create a local system profile for [PLACE, SECTOR, OR INSTITUTION] using the Forty Two Fifty Nine framework.

Analyze the receiving system:
- key industries,
- energy capacity,
- water stress,
- transport infrastructure,
- labor availability,
- regulatory environment,
- capital flows,
- climate exposure,
- critical minerals or material dependencies,
- research institutions,
- political constraints,
- major projects,
- existing bottlenecks.

Then explain how frontier signals might be transduced through this system.

Output:
- system overview,
- current equilibrium,
- key constraints,
- relevant signals to monitor,
- actors with authority to respond,
- likely second-order effects,
- possible new equilibria,
- uncertainty and missing data.
```

## 9. Signal-to-System Impact Prompt

Use this when a signal needs local or sector-specific interpretation.

```text
Analyze this signal in the context of [RECEIVING SYSTEM].

Signal:
[SIGNAL OR SOURCE]

Receiving system:
[PLACE, SECTOR, ORGANIZATION, OR MARKET]

Use this model:
Signal + Receiving System + Constraint Map

Answer:
- What changed?
- What does this signal mean in this specific context?
- Which constraints tighten or loosen?
- Which actors can respond?
- What decisions become available?
- What second-order effects are plausible?
- What new local equilibrium might emerge?
- What information is missing?

Avoid assuming that a global signal has the same meaning everywhere.
```

## 10. Topic Page Prompt

Use this when creating a topic landing page.

```text
Create a topic page for [TOPIC] in Forty Two Fifty Nine.

The page should include:
- plain-language overview,
- why it matters to the future-state framework,
- current maturity,
- dependency stack,
- key constraints,
- major organizations,
- important datasets,
- recent signals,
- open questions,
- watchlist.

Voice:
curious, skeptical, urgent, imaginative, not hype-driven.
```

## 11. Homepage Copy Prompt

Use this when drafting or revising homepage copy.

```text
Write homepage copy for Forty Two Fifty Nine.

Brand thesis:
42 is possibility.
59 is urgency.
Civilization is a choice.
The future is not a list of inventions. It is a stack of dependencies.

The homepage should quickly communicate:
- what the project is,
- why it matters,
- what readers can explore,
- how signals, roadmaps, atlas pages, data, and briefings fit together.

Do not sound like generic SaaS marketing.
Do not over-explain the Hitchhiker's reference.
Balance wonder and warning.
```

## 12. Brand System Prompt

Use this to build visual and verbal identity.

```text
Develop the brand system for Forty Two Fifty Nine.

The identity should express:
- possibility and urgency,
- future under constraint,
- intelligence and narrative,
- serious but not lifeless,
- editorial rather than corporate,
- systems thinking without becoming cold.

Produce:
- tagline options,
- voice principles,
- typography direction,
- color direction,
- logo/wordmark concepts,
- homepage art direction,
- UI mood,
- examples of words to use and avoid.
```

## 13. Technical Stack Prompt

Use this before scaffolding the app.

```text
Recommend a technical stack for Forty Two Fifty Nine.

Project needs:
- editorial publishing,
- structured signals,
- topic pages,
- source database,
- filtering/search,
- future ingestion workflows,
- strong design,
- easy local editing during MVP,
- ability to grow into a data platform.

Compare:
- static-first approach,
- Next.js or similar app framework,
- headless CMS,
- local Markdown/MDX,
- database-backed approach.

Recommend an MVP stack and a growth path. Include tradeoffs and migration risks.
```

## 14. Frontend Build Prompt

Use this when starting the web app.

```text
Build the frontend MVP for Forty Two Fifty Nine.

Start from the roadmap and content model.

Required pages:
- homepage,
- signal index,
- signal detail page,
- topic index,
- topic detail page,
- about page.

Required features:
- responsive design,
- topic filtering,
- clear citation links,
- maturity labels,
- constraint tags,
- dependency stack display.

Design direction:
editorial, systems-oriented, restrained, luminous, serious but alive.

Do not build a generic landing page. The first screen should establish the publication and immediately point into real content.
```

## 15. Data Model Prompt

Use this when creating the database or content collections.

```text
Design the data model for Forty Two Fifty Nine.

Entities:
- Signal
- Source
- Organization
- Topic
- Technology
- Project
- Local System
- Material
- Policy
- Briefing

Model relationships:
- signals belong to topics,
- signals cite sources,
- organizations produce signals,
- technologies depend on materials, infrastructure, policies, and constraints,
- projects involve organizations and technologies,
- signals can affect receiving systems through local constraints.

Produce:
- entity definitions,
- fields,
- relationships,
- indexes,
- sample records,
- MVP subset,
- later expansion path.
```

## 16. Editorial Review Prompt

Use this before publishing a signal or report.

```text
Review this Forty Two Fifty Nine draft for publication.

Check:
- accuracy,
- source quality,
- hype language,
- missing dependencies,
- missing constraints,
- unclear maturity level,
- unsupported claims,
- citation quality,
- copyright risk,
- tone alignment.

Return:
- required fixes,
- suggested improvements,
- final publish readiness status.
```

## 17. Weekly Briefing Prompt

Use this to assemble a recurring briefing.

```text
Create a weekly Forty Two Fifty Nine briefing from the selected signals.

The briefing should answer:
- what changed this week,
- which signals matter most,
- which dependencies moved,
- which constraints tightened,
- which stories are noise,
- what to watch next.

Organize by:
- top signals,
- dependency shifts,
- constraint watch,
- domain updates,
- open questions.

Keep the voice clear, skeptical, and alive.
```

## 18. 42/59 Index Prompt

Use this when prototyping the branded index.

```text
Evaluate whether [SIGNAL OR DOMAIN] should receive a qualitative 42/59 Index label.

42 dimension:
- transformative potential,
- scale of possible impact,
- enabling effect across other domains,
- novelty,
- plausibility.

59 dimension:
- urgency,
- fragility,
- constraint pressure,
- time sensitivity,
- systemic risk.

Output:
- 42 assessment,
- 59 assessment,
- one-line index label,
- rationale,
- uncertainty,
- warning against false precision if evidence is thin.
```

## 19. Red-Team Prompt

Use this periodically to challenge the project.

```text
Red-team Forty Two Fifty Nine.

Look for:
- missing domains,
- overhyped assumptions,
- weak source categories,
- undercovered constraints,
- taxonomy problems,
- editorial blind spots,
- product complexity risk,
- data-model weaknesses,
- audience confusion,
- narrative drift.

Return:
- top risks,
- recommended corrections,
- additions to the roadmap,
- questions that must be answered before launch.
```

## 20. Decision Prompt

Use this when a strategic or technical choice needs to be made.

```text
Help decide [DECISION] for Forty Two Fifty Nine.

Context:
[CONTEXT]

Evaluate options using:
- alignment with the thesis,
- MVP speed,
- long-term maintainability,
- editorial quality,
- data quality,
- design quality,
- migration risk,
- cost,
- complexity.

Return:
- recommendation,
- rationale,
- tradeoffs,
- decision log entry.
```

## 21. Phase 03 Starter Prompt

Use this to move from documentation and sample records into the technical stack decision and first content scaffold.

```text
Start Phase 03 for FTFN.

Read:
- README.md
- docs/documentation-map.md
- docs/master-roadmap.md
- docs/decision-log.md
- docs/taxonomy.md
- docs/content-model.md
- docs/source-strategy.md
- docs/information-architecture.md
- docs/sample-records.md
- docs/work-packages/phase-02-information-architecture-and-sample-records.md

Create:
- docs/work-packages/phase-03-technical-stack-and-content-scaffold.md
- docs/technical-stack-decision.md
- docs/content-scaffold-plan.md

Phase 03 goal:
Choose the MVP technical stack and define the first content/data scaffold without building the full website yet.

Include:
1. Compare viable MVP stack options:
   - static-first site,
   - Next.js or similar app framework,
   - Astro or similar content-first framework,
   - headless CMS,
   - local Markdown/MDX plus structured YAML/JSON,
   - database-backed approach.
2. Recommend one MVP stack and one growth path.
3. Explain tradeoffs around editorial workflow, structured records, validation, filtering, search, hosting, and future database migration.
4. Decide the MVP content storage format for:
   - signals,
   - sources,
   - topics,
   - organizations,
   - technologies,
   - local system profiles,
   - briefings.
5. Propose a repository folder structure for content and app code.
6. Decide whether sample records should become seed content files in this phase.
7. Define validation requirements for the first scaffold.
8. Identify which fields should be public at MVP versus internal-only.
9. Update README.md, docs/master-roadmap.md, and docs/decision-log.md with any decisions.

Do not build the full website yet.
Do not install dependencies unless the stack decision explicitly calls for it and the user approves.
Focus on making the next implementation step obvious, small, and reversible.

Preserve:
- the FTFN shorthand,
- the 42/59 framing,
- the thesis: “The future is not a list of inventions. It is a stack of dependencies.”
```

## 22. Phase 04 Starter Prompt

Use this to move from the technical decision into the first app scaffold and seed content.

```text
Start Phase 04 for FTFN.

Read:
- README.md
- docs/documentation-map.md
- docs/master-roadmap.md
- docs/decision-log.md
- docs/taxonomy.md
- docs/content-model.md
- docs/information-architecture.md
- docs/sample-records.md
- docs/technical-stack-decision.md
- docs/content-scaffold-plan.md
- docs/work-packages/phase-03-technical-stack-and-content-scaffold.md

Create:
- docs/work-packages/phase-04-app-scaffold-and-seed-content.md

Phase 04 goal:
Scaffold the Astro + TypeScript app, configure content collections and validation, and convert the Phase 02 sample records into seed content files.

Implementation scope:
1. Scaffold the Astro app in app/.
2. Configure TypeScript.
3. Configure Astro content collections in app/src/content.config.ts.
4. Create content directories for:
   - signals,
   - sources,
   - topics,
   - organizations,
   - technologies,
   - local-systems,
   - briefings.
5. Convert sample source records into JSON seed files.
6. Convert sample topic records into JSON seed files.
7. Convert sample signal records into MDX seed files.
8. Convert sample local system profiles into MDX seed files.
9. Add minimal page skeletons for:
   - homepage,
   - signal index,
   - signal detail,
   - topic index,
   - topic detail,
   - about.
10. Add a minimal global style and design token file, but do not complete the visual design.
11. Run validation/build if dependencies are available.
12. Update README.md, docs/master-roadmap.md, and docs/decision-log.md.

Important:
- Ask for approval before installing dependencies or running network-dependent package installation.
- Do not build the full visual website yet.
- Keep the implementation small and reversible.
- Preserve the FTFN shorthand, 42/59 framing, and the thesis: “The future is not a list of inventions. It is a stack of dependencies.”
```
