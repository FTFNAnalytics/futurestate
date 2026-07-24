# Editorial Method

This document defines how FTFN turns frontier information into publishable future-state intelligence for `ftfn.io`.

FTFN should be useful because it does more than repeat announcements. It should identify claims, locate evidence, map dependencies, name constraints, and explain what could change in real systems.

## Core Standard

Every publishable signal should answer:

- What happened?
- Who is making the claim?
- What evidence supports it?
- What is interpretation rather than evidence?
- Where does it sit on the maturity ladder?
- What does it depend on?
- What could block, slow, distort, or localize the outcome?
- Which source should a reader inspect first?
- What should be watched next?

The operating rule:

```text
Summarize the claim.
Identify the claimant.
Separate evidence from interpretation.
Locate the maturity level.
Name the dependency stack.
Name the constraints.
Connect the signal to receiving systems when justified.
Link the original source.
```

## Editorial Posture

FTFN should be:

- curious, not breathless,
- skeptical, not cynical,
- urgent, not apocalyptic,
- imaginative, not naive,
- source-led, not hype-led,
- systems-oriented, not invention-list-oriented.

## Source Transparency Posture

FTFN should show readers what kind of source they are looking at.

Source records and signal pages should make clear:

- whether the source is official data, research, a company claim, credible reporting, market analysis, or commentary,
- whether the source is primary or interpretive,
- what incentives the source may have,
- what limitations matter,
- whether a stronger source is needed before publication.

At MVP, source transparency can live in three places:

- source profiles in the Atlas,
- signal pages through source cards and evidence labels,
- the About page through a public editorial method section.

## Evidence Treatment Rules

### Government Data and Primary Institutional Sources

Use for:

- official statistics,
- regulations,
- certification status,
- climate forecasts,
- agency programs,
- public funding and standards.

Treatment:

- Treat as strong evidence for what the institution says, publishes, or requires.
- Do not treat official data as self-interpreting.
- Add context before drawing local, market, or operational conclusions.

### Research Findings

Use for:

- scientific results,
- technical feasibility,
- methods,
- measured performance,
- early-stage breakthroughs.

Treatment:

- Distinguish lab result from deployment.
- Note whether the result is peer-reviewed, preprint, conference, or institution summary.
- Do not convert technical possibility into near-term adoption without deployment evidence.

### Company Claims

Use for:

- product announcements,
- pilots,
- partnerships,
- facility plans,
- flight campaigns,
- funding,
- customer claims.

Treatment:

- Treat as interested-party evidence.
- Name the company as the claimant.
- Avoid adopting promotional wording.
- Do not treat announced capacity as operational capacity.
- Do not treat demonstrations as certified deployment.
- Seek regulatory, customer, facility, financial, or third-party confirmation before publication.

### Credible Reporting

Use for:

- context,
- investigation,
- local impacts,
- independent confirmation,
- market interpretation,
- disputes or externalities.

Treatment:

- Prefer reporting with named sources, documents, data, or on-the-ground evidence.
- Use reporting to supplement primary sources, not replace them when primary sources are available.
- Mark uncertainty if the report depends on unnamed sources or estimates.

### Speculative Claims

Use for:

- scenario analysis,
- theoretical possibilities,
- long-range essays,
- emerging ideas worth watching.

Treatment:

- Keep speculation out of ordinary signal claims unless clearly labeled.
- Use `Speculative` time horizon when timing depends on unresolved breakthroughs.
- Do not publish speculative claims as signals unless the claim itself is newsworthy and properly framed.

## Publishability Criteria

### Draft Sample

Purpose:

Test schema, layout, and editorial shape.

Allowed:

- broad summaries,
- placeholder body copy,
- unreviewed verification status,
- nullable published date.

Not allowed:

- treating the record as public editorial output,
- using it in launch material as a verified article,
- presenting it as a current news brief without review.

### Draft

Purpose:

Capture a real candidate record for editorial development.

Requirements:

- source exists and is reachable,
- claim is specific,
- core taxonomy is assigned,
- dependencies and constraints are drafted,
- uncertainty is noted.

### In Review

Purpose:

Prepare a record for publication.

Requirements:

- source has been checked,
- original source URL is correct,
- evidence quality is assigned,
- source limitations are clear,
- summary avoids promotional language,
- maturity level is defensible,
- dependencies and constraints are meaningful,
- local implications are either supported or omitted.

### Published

Purpose:

Public editorial record.

Requirements:

- `record_status: Published`,
- non-null `published_date`,
- verification status is `Reviewed` or `Verified Against Primary Source`,
- source is credible enough for the claim being made,
- summary names the claim without overstating it,
- body includes useful interpretation,
- unsupported local implications are not presented as fact,
- source link is visible to the reader.

### Needs Update

Purpose:

Public record that has become stale, incomplete, challenged, or superseded.

Use when:

- source corrected or changed its claim,
- newer data shifts interpretation,
- project status changed,
- publication date is old for a fast-moving topic,
- a stronger source contradicts the original framing.

### Archived

Purpose:

Preserve old records that should no longer appear as current intelligence.

Use when:

- source is withdrawn,
- claim failed or became irrelevant,
- duplicate record replaced it,
- content is no longer useful for readers.

## Minimum Evidence Requirements for Published Signals

A published signal must have:

- at least one source record,
- a working original source URL,
- a specific claim or development,
- a defensible evidence quality label,
- a verification status of `Reviewed` or better,
- a maturity level tied to the specific development,
- a time horizon tied to the likely decision impact,
- 2-6 meaningful constraints,
- clear dependency language,
- no unsupported local conclusion.

For company-claim signals, add at least one of:

- regulatory source,
- customer or partner source,
- facility or permitting evidence,
- credible reporting,
- financial filing,
- direct caveat that the claim remains unverified.

## Local Interpretation Rule

Local implications require local context.

Before FTFN makes a strong local claim, it should pair the frontier source with at least one local system source such as:

- utility data,
- water authority records,
- municipal plans,
- permitting records,
- regional economic data,
- labor market data,
- local reporting,
- climate or hazard data.

Without that support, use cautious language:

```text
May affect...
Could change...
Worth watching for...
Requires local verification...
```

## Correction and Update Posture

FTFN should be willing to revise.

If a source changes, a project fails, a claim is withdrawn, or a better interpretation emerges, the record should move to `Needs Update`, `Archived`, or a corrected version.

Future implementation should add visible update notes before public launch.
