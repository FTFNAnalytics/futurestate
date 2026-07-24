# Review Checklists

This document turns the FTFN editorial method into operational checks for records before they become public material on `ftfn.io`.

Use these checklists when creating, reviewing, publishing, updating, or archiving records. They are meant to prevent the project from becoming a press-release mirror, a hype feed, or a pile of disconnected records.

## Universal Preflight

Apply this to every record type.

- The record has a stable `id`, `slug`, or equivalent identifier.
- Required fields match the content schema.
- Controlled vocabulary values match the taxonomy.
- Source IDs point to real source records.
- Public claims are supported by the cited source.
- Interpretation is separated from evidence.
- Company claims are labeled as interested-party claims when relevant.
- Local implications are omitted or supported by local-system evidence.
- Dates are present, accurate, and appropriate to the record status.
- Public-facing copy uses FTFN language and avoids inflated claims.
- Internal notes do not appear as public conclusions.
- `npm run validate:content` passes after relationship fields are changed.

## Reference Integrity Gate

Run this from `app/` before broad content expansion, after changing relationship fields, and before closing a content-heavy phase:

```text
npm run validate:content
```

The gate checks duplicate IDs, duplicate slugs, source references, evidence-gap references, briefing signal references, evidence-gap related-record references, local-system names on evidence gaps, dependency-map record references, dependency-map node references, dependency-map links, and basic publication guardrails.

## Signal Checklist

A signal can move toward publication when it passes these checks.

- The development is specific enough to summarize in one sentence.
- The source is reachable and the original URL is saved.
- The claimant is clear.
- The evidence quality label fits the source and claim.
- `verification_status` is `Reviewed` or `Verified Against Primary Source` before publication.
- `record_status` is not `Published` unless `published_date` is non-null.
- The maturity level is tied to the actual development, not the technology category as a whole.
- The time horizon is tied to likely decision impact, not excitement.
- The signal has 2-6 meaningful constraints.
- The dependency list names practical requirements, not vague aspirations.
- `why_it_matters` explains a system implication.
- Local implications are supported or written cautiously.
- `claim_scope` matches what the record actually claims.
- `local_evidence_level` honestly describes the evidence base for local interpretation.
- `evidence_gap_ids` are attached when unresolved gaps limit the claim.
- `last_reviewed_date` is present for reviewed records.
- The body answers what changed, why it matters, dependencies, constraints, and source context.
- Promotional words from a source are rewritten in neutral language.
- If the signal is based on a company announcement, it includes a caveat or independent context.

## Source Checklist

A source record should make the evidence layer transparent.

- The URL works and points to the original source, not a repost.
- `source_type` fits the producer.
- `credibility_level` fits how FTFN should use the source.
- `primary_topics` and `framework_layers` are accurate.
- `capture_priority` reflects editorial usefulness, not brand prominence.
- `known_limitations` names incentives, gaps, or interpretation risks.
- `last_checked_date` is current for the review batch.
- The source is not low-quality, spammy, AI-generated repost content, or unsupported hype.
- The source can produce actionable signals, context, or verification.

## Topic Checklist

Topic records should help readers navigate the future stack.

- The topic belongs to one or more valid framework layers.
- The summary is clear to a non-specialist reader.
- Primary constraints are specific and useful.
- Featured sources are real source records.
- Watch questions identify unresolved system questions.
- The topic page can route readers to signals, sources, organizations, or technologies.
- The topic does not become a catch-all for unrelated material.

## Organization Checklist

Organization records should explain institutional roles.

- The organization type is accurate.
- The summary distinguishes the organization's role: regulator, funder, operator, researcher, standard-setter, claimant, or market actor.
- Primary topics are supported by sources or known program roles.
- Source IDs point to records that actually involve the organization.
- The record does not imply endorsement.
- Company records do not convert company ambitions into verified deployment facts.

## Technology Checklist

Technology records should describe capabilities without flattening maturity.

- The technology has a clear definition.
- Maturity level is defensible for the technology profile.
- Dependencies are practical and concrete.
- Constraints reflect real blockers.
- Source IDs support the description or are left empty until sources exist.
- The record distinguishes a technology class from one vendor's implementation.
- The summary does not imply universal deployment from a narrow result.
- The profile does not imply deployment readiness, commercial scale, or local feasibility without signal and local-system evidence.
- Related signals are linked only through shared source IDs or primary-topic overlap.
- Related-signal labels explain whether the relationship comes from source overlap or topic match.

## Local System Checklist

Local system profiles are where global signals meet local constraints.

- The geography, sector, institution, market, or infrastructure system is clearly scoped.
- The current equilibrium is described before future claims are made.
- Core constraints are local, not merely generic.
- Actors with authority are named by type or institution.
- Missing data is explicit.
- Source IDs include local evidence before strong local claims are made.
- `evidence_gap_ids` are attached for known missing evidence.
- `local_evidence_level` matches the strongest local source layer available.
- `last_reviewed_date` is present after a profile hardening or evidence-integration pass.
- Likely second-order effects are framed as possibilities unless evidence supports stronger language.
- The profile explains how signals may be transduced into local outcomes.

## Briefing Checklist

Briefings should synthesize signals rather than list them.

- Referenced signals exist.
- Published briefings rely primarily on reviewed or published signals.
- Draft briefings that use draft samples are clearly labeled.
- Top takeaways are interpretive but evidence-aware.
- Constraint watch items are specific.
- What-to-watch-next items can become future signals or source checks.
- The briefing has a clear date and cadence context.
- The briefing does not elevate unsupported claims from one signal into broader conclusions.
- The briefing states what the evidence does not prove.
- Missing evidence is added to or checked against the evidence gap register.
- `evidence_gap_ids` identify unresolved gaps that shape the synthesis.
- `claim_scope` is set to `Editorial Synthesis` unless the briefing is a different defined format.
- `local_evidence_level` does not imply project-level evidence unless the briefing cites project-level records.
- What-to-watch-next items map to future source, signal, local-system, or data-model work.

## Evidence Gap Checklist

Evidence gaps should make missing evidence actionable.

- The gap has a stable `gap-###` ID.
- The status matches the evidence state.
- The priority reflects how much the gap blocks interpretation.
- The affected local system or `Cross-system` scope is clear.
- The primary topic and constraints match the missing evidence.
- The question is specific enough to guide source acquisition.
- Missing evidence is listed as concrete record types, not vague uncertainty.
- The next action names a source, signal, local-system update, or data-model step.
- Related source, signal, and local system IDs point to real records.
- A gap is not marked `Resolved` unless the missing evidence directly answers the question.

## Dependency Map Checklist

Dependency maps should show relationships without pretending FTFN can infer full causality.

- The map has a clear question.
- The map type fits the question.
- The map passes the selection rules in `docs/dependency-map-format.md`.
- The interpretation boundary says what the map does not prove.
- Every linked source, signal, technology, local system, and evidence gap ID points to a real record.
- Every node ID is stable inside the map.
- Every node with a `record_id` points to a real record of the matching node type.
- Every link `from` and `to` value points to a node inside the same map.
- Link labels are qualitative and explicit.
- Confidence labels are honest: `Supported`, `Partial`, `Missing Evidence`, or `Watch`.
- Missing evidence is linked to evidence-gap records where possible.
- Company or interested-party claims are not treated as supported relationships without independent context.
- The map does not imply local readiness, project viability, deployment scale, or completed outcomes without local evidence.
- The map does not add numeric 42/59 scoring.
- The map names next records needed in actionable terms.

## Publication Readiness Triage

Use this before final publication review.

- A launch candidate is still not `Published`.
- The source URL has been rechecked during the current launch pass.
- The source checked date is current enough for the claim.
- The record is specific enough to be useful without pretending to prove more than it proves.
- Any stale source-date issue is moved to `Needs Update` or `Needs Follow-Up`.
- Company-claim records remain draft or clearly caveated unless supported by official, local, customer, or independent evidence.
- Local-system records and local signals do not claim outcomes without local evidence.
- A candidate set is small enough to review carefully.
- The candidate set supports the FTFN thesis rather than merely filling topic coverage.
- The record's public page shows enough evidence, caveat, and source context for a reader to understand its status.

## Final Publication Check

Before marking any record as `Published`, confirm:

- Required fields validate.
- Source links are visible on the public page or directly connected through the Atlas.
- Source checked dates are current to the launch pass.
- Publication policy and correction/update posture are visible on the public Method page.
- The record can be understood without private notes.
- The record's confidence level is honest.
- The record does not claim local outcomes without local evidence.
- The record fits the FTFN thesis: it shows dependencies, constraints, choices, or consequences.
- A correction/update path exists for the record after launch.
