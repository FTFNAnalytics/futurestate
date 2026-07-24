# Dependency Map Format

This document defines the first qualitative dependency-map format for FTFN.

Dependency maps are the first structured expression of the thesis:

```text
The future is not a list of inventions.
It is a stack of dependencies.
```

## Purpose

A dependency map helps FTFN show how a signal, technology, local system, source, or evidence gap relates to the broader stack.

It should answer:

- What is the central question?
- Which records or concepts belong in the map?
- Which relationships are supported, partial, missing evidence, or watch-only?
- What can the map support?
- What does the map not prove?
- Which records are needed next?

## Phase 25 Decision

Dependency maps should begin as standalone JSON records.

They may link to existing records, but they should not be generated automatically yet.

Rationale:

- FTFN does not yet have enough content volume to infer relationships responsibly.
- A standalone record forces the editor to state the map question and interpretation boundary.
- Qualitative relationship labels keep the map useful without false precision.
- Existing record IDs still let the map participate in the Atlas and validation gate.

Future growth path:

- Generate draft maps from explicit relationship fields once the content graph is larger.
- Add visual graph rendering only after the underlying record model is stable.
- Add qualitative 42/59 labels before considering numeric scoring.

## Record Format

Dependency maps live in:

```text
app/src/content/dependency-maps/
```

Format:

```text
JSON
```

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

Optional but recommended relationship fields:

```text
source_ids
signal_ids
technology_ids
local_system_ids
evidence_gap_ids
```

## Map Types

Allowed MVP values:

```text
Dependency Stack
Local Constraint Map
Technology Readiness Map
Evidence Gap Map
```

## Node Types

Allowed MVP values:

```text
Signal
Source
Technology
Local System
Evidence Gap
Topic
Constraint
```

Each node should include:

```text
id
label
node_type
record_id
note
```

`record_id` is optional only when the node is a concept rather than an existing record.

## Link Types

Allowed MVP values:

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

Each link should include:

```text
from
to
relationship
confidence
note
```

## Confidence Labels

Allowed MVP values:

```text
Supported
Partial
Missing Evidence
Watch
```

Use them this way:

- `Supported`: current records directly support the relationship at the level claimed.
- `Partial`: current records support context, but not the stronger interpretation readers may expect.
- `Missing Evidence`: the relationship is plausible or important, but a named evidence gap blocks stronger claims.
- `Watch`: the relationship is worth monitoring, but current evidence is too early or indirect.

## Relationship Rules

Dependency-map relationships must be explicit.

Allowed support:

- direct record IDs,
- source IDs,
- evidence gap IDs,
- technology IDs,
- local system IDs,
- topic IDs,
- qualitative editorial notes that name the evidence boundary.

Do not use:

- hidden relationships from prose,
- inferred causality,
- implied project readiness,
- implied local outcomes,
- numeric 42/59 scoring,
- unsourced company ambition as a supported dependency.

## Reader-Journey Backlinks

Phase 26 makes dependency maps discoverable from related record pages.

Allowed backlink rules:

- Signal detail pages may show maps when `signal_ids` includes the signal ID.
- Source detail pages may show maps when `source_ids` includes the source ID.
- Technology detail pages may show maps when `technology_ids` includes the technology ID.
- Local system detail pages may show maps when `local_system_ids` includes the local system ID.
- Evidence gap detail pages may show maps when `evidence_gap_ids` includes the evidence gap ID.
- Topic detail pages may show maps when the map `primary_topic` matches the topic name.
- Briefing detail pages may show maps when the map shares explicit signal IDs or evidence gap IDs with the briefing.

Backlink labels must explain why the map appears.

Disallowed backlink rules:

- prose matching,
- keyword matching,
- title matching,
- implied causality,
- hidden editorial assumptions.

## Map Selection Rules

Phase 27 adds selection rules so dependency maps are created because they clarify the stack, not because FTFN needs more objects.

A new dependency map should exist only when it meets all of these gates:

- It has a clear map question that cannot be answered well by a single signal page.
- It uses at least three existing records across at least three record types.
- It can name a real dependency, constraint, or conversion problem.
- It can state what the map does not prove.
- It can link to at least one source, signal, technology, local system, or evidence gap through explicit IDs.
- It adds a reader journey that existing pages do not already provide.
- It can name next records needed in actionable terms.

Prefer a new map when:

- a reviewed signal and a technology profile share a source,
- a local system profile and evidence gaps expose a conversion problem,
- a briefing synthesis needs a structured map for its evidence boundary,
- a technology has clear standards, certification, infrastructure, or migration dependencies.

Do not create a map when:

- the map would mostly restate one record,
- the relationships depend on prose inference,
- the map would imply local readiness or project viability without local evidence,
- the map would need numeric 42/59 scoring to feel useful,
- the map exists only to increase content volume.

## Atlas Index Surface

Phase 28 hardens the dependency-map Atlas index.

The index should help readers scan maps by:

- total map count,
- map type,
- primary topic,
- record status,
- linked evidence gaps,
- grouped map lists.

The public index should also include a short selection-rule note:

```text
Maps exist when one record is not enough.
```

Index grouping is not a scoring system. It does not rank maps, resolve evidence gaps, imply local readiness, or create numeric 42/59 outputs.

For MVP, keep the dependency-map index static unless map volume makes filtering necessary. Client-side filtering or generated filtered pages should be reconsidered only after the collection grows beyond the current small prototype set.

## Discovery Surfaces

Phase 29 makes dependency maps visible from higher-traffic public routes.

MVP discovery surfaces:

- homepage dependency-map band,
- Atlas landing dependency-map entry section,
- dependency-map index,
- deterministic backlinks from related record detail pages.

Discovery rules:

- Use existing dependency-map records only.
- Link to maps through explicit `slug` values.
- Show record status and map type where space allows.
- Reuse selection-rule language when introducing maps.
- Do not imply that homepage or Atlas placement means a map is published, scored, complete, or generated.

## Detail Page Surface

Phase 30 adds a compact summary layer to dependency-map detail pages.

Detail pages should show:

- map question,
- interpretation boundary,
- scoring boundary,
- node count,
- link count,
- record-node count,
- concept-node count,
- selection-rule check,
- linked record type counts,
- confidence mix,
- full nodes,
- full qualitative relationships,
- what the map supports,
- what it does not prove,
- next records needed,
- evidence trail.

The summary layer is a readability aid, not a rating. It must not rank maps, resolve evidence gaps, imply local readiness, or create numeric 42/59 outputs.

## Prototype

Phase 25 adds one prototype:

```text
Local constraints are where the future arrives
```

It uses existing records only and shows how compute, chips, power, water, housing, and permit signals meet local receiving systems.

The prototype is useful because it shows how dependency maps can expose the conversion layer between information and outcomes without claiming that any local outcome is proven.

Phase 27 adds one second prototype:

```text
Post-quantum standards are not migration
```

It uses existing records only and shows how NIST PQC standards, post-quantum cryptography technology, and the institution-level migration evidence gap relate.

The prototype is useful because it separates standards progress from operational migration evidence.

## Review Checklist

Before a dependency map becomes public-ready:

- The map has a clear question.
- The interpretation boundary says what the map does not prove.
- Every record ID validates.
- Every link points to nodes inside the map.
- Confidence labels match the source base.
- Missing evidence is attached to evidence-gap records where possible.
- The map does not imply a local conclusion without local evidence.
- The map does not use numeric 42/59 scoring.
- Next records needed are actionable.

## Expansion Gate

Phase 31 tested the reader path from homepage to Atlas landing to dependency-map index to both current map detail pages. It also checked representative backlinks from signals, sources, technologies, local systems, evidence gaps, topics, and briefings.

Result:

- the current dependency-map journey works,
- backlinks are coherent,
- the current two-map layer is useful enough to keep,
- a third map is not yet justified by the current content base.

Expansion rule:

Do not create the next dependency map just to fill the map index. Create one only when a source-backed content batch supplies:

- a clear map question,
- multiple validated record types,
- explicit record IDs,
- a real dependency, conversion, or receiving-system problem,
- visible evidence limits,
- actionable next-record needs.

Until then, dependency-map work should pause while source-backed content expansion resumes.

## Future Feature Path

Dependency maps may later become:

- a visual Atlas view,
- a briefing module,
- a topic-page module,
- a technology-profile module,
- an evidence-gap triage surface,
- a qualitative 42/59 label system,
- a database-backed relationship graph.

For now, they are structured editorial records.
