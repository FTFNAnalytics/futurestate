# Briefing Template

This document defines the reusable FTFN briefing format that came out of `Stack Watch 001`.

Briefings should synthesize reviewed signals into a readable systems view. They should not become generic essays, unsupported forecasts, or a way to promote weak signals into stronger conclusions.

## When To Use This Template

Use this template when:

- at least 5-8 related signals are `In Review` or `Published`,
- the briefing can identify a real dependency or constraint pattern,
- the evidence base is strong enough to support synthesis,
- evidence limits can be stated clearly,
- the result helps plan future source, signal, local-system, or data-model work.

Do not use this template when:

- most referenced signals are still `Draft Sample`,
- the argument depends on a company claim without independent context,
- the briefing would imply local readiness, project viability, or completed outcomes without local evidence,
- the goal is only to publish more volume.

## Editorial Standard

Every briefing must answer:

- What pattern is visible across the referenced signals?
- Which signals support that pattern?
- What does the evidence prove?
- What does the evidence not prove?
- Which dependencies and constraints recur?
- Which receiving systems matter?
- What evidence is missing before stronger conclusions are allowed?
- What should FTFN watch next?

## Status Rules

- `Draft Sample`: structural placeholder or test briefing.
- `Draft`: editorial draft that may include incomplete argumentation.
- `In Review`: evidence-backed synthesis using reviewed signals, but not final publication.
- `Published`: final public briefing with source and claim review complete.
- `Needs Update`: published briefing with stale context or new contradictory evidence.
- `Archived`: preserved for history, not current intelligence.

Keep the first few real briefings in `In Review` until FTFN has a formal publication gate.

## Signal Selection Rules

Prefer referenced signals that:

- are `In Review` or `Published`,
- have official, primary institutional, peer-reviewed, regulatory, or credible analysis support,
- expose dependencies or constraints,
- connect to a receiving system,
- include evidence limits.

Avoid using signals that:

- are still `Draft Sample`,
- depend mainly on company claims,
- lack source IDs,
- contain broad local implications without local evidence,
- are not specific enough to support synthesis.

## Frontmatter Template

Use this structure for briefing MDX files:

```yaml
---
id: "briefing-stack-watch-002"
title: "Stack Watch 002: [pattern]"
slug: "stack-watch-002-[pattern]"
record_status: "Draft"
summary: "[One or two sentences describing the pattern and evidence base.]"
published_date: null
captured_date: 2026-05-28
signal_ids:
  - "signal-id-001"
  - "signal-id-002"
top_takeaways:
  - "[Evidence-aware takeaway.]"
  - "[Dependency or constraint pattern.]"
  - "[What remains unresolved.]"
constraint_watch:
  - "Power"
  - "Water"
  - "Data Quality"
what_to_watch_next:
  - "[Specific future source, signal, local-system update, or data need.]"
---
```

## Body Template

Use these sections unless the briefing has a strong reason to differ.

```md
## Editorial State

State whether the briefing is Draft, In Review, or Published. Explain what the status means and whether the underlying signals are reviewed or published.

## The Pattern

Describe the systems pattern visible across the referenced signals. Keep the claim narrow enough that the evidence can support it.

## What The Reviewed Signals Support

Walk through the signal groups and explain what each supports. Separate evidence from interpretation.

## What The Briefing Does Not Claim

Name the boundaries. This is where FTFN prevents synthesis from becoming overreach.

## Receiving-System Questions

List the local, institutional, market, or infrastructure questions that decide whether the signal becomes an outcome.

## Evidence Gaps

Identify the evidence gaps that should enter the evidence gap register.

## Editorial Use

Explain what future work this briefing should trigger: source records, signal records, local-system updates, data-model changes, or a follow-up briefing.
```

## Required Evidence Boundaries

Every briefing should include at least one explicit statement of what the evidence does not prove.

Examples:

- State-level electricity data does not prove site-level power availability.
- Water agency context does not prove facility-level water adequacy.
- Housing targets do not prove completions.
- Building permits are construction intentions, not completed supply.
- Federal program pages do not prove local industrial capacity.
- Company demonstrations do not prove certified commercial deployment.

## Briefing Review Checklist

Before moving a briefing to `In Review`, confirm:

- all referenced signal IDs exist,
- most or all referenced signals are `In Review` or `Published`,
- the top takeaways are supported by the referenced signals,
- the constraint watch list matches the signal evidence,
- unsupported local conclusions are excluded,
- missing evidence is listed or added to the evidence gap register,
- what-to-watch-next items can become future records or checks,
- the briefing body distinguishes evidence, interpretation, and limits.

Before moving a briefing to `Published`, confirm:

- referenced signals pass final publication review,
- source links are visible through signal or source pages,
- no draft-only assumption remains,
- all local claims have local evidence,
- publication date is set,
- any evidence gaps are either resolved or publicly caveated.

## Relationship To The Evidence Gap Register

Briefings should create evidence gaps, not hide them. When a briefing identifies missing conversion evidence, add or update an entry in `docs/evidence-gap-register.md`.

Each briefing should leave behind a short work trail:

```text
Signal pattern -> evidence limit -> evidence gap -> next source or record action
```

This keeps FTFN evidence-led as the project grows.
