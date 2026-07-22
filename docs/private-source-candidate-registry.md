# Private Source-Candidate Registry

Date: 2026-07-22

## Purpose

The Phase 52 registry is a private discovery and triage layer for future FTFN evidence work. It contains 150 source candidates that may become useful after a human selects a bounded record and verifies what that record can and cannot prove.

The registry is not part of the public source library. A candidate does not count as an active source, support a public claim, or appear in a public export merely because it is listed here.

## Privacy Boundary

The working registry lives at:

```text
private-data/source-candidates.json
```

`private-data/` is ignored by Git because the current project repository is public. The production build and `verify:release` also check that candidate IDs and the private registry path do not leak into generated output.

Only this contract, the validator, and the workflow are tracked publicly. Do not move the registry into `app/src/content`, commit it, attach it to a public issue, or include its contents in a public build artifact.

Because ignored files are not protected by Git history, preserve the working registry through the existing private workspace backup or a separate encrypted/private backup before moving machines.

## Current Inventory

| Measure | Current |
| --- | ---: |
| Target | 150 |
| Candidate records | 150 |
| Evidence profiles | 15 |
| Candidates per profile | 10 |
| Reviewed | 45 |
| Candidate | 44 |
| Rejected | 1 |
| Needs triage | 105 |
| Publicly promoted by this phase | 0 |

The profiles cover cross-cutting official rails, power and grid, compute and chips, water, mobility, security, critical minerals, climate, agriculture, AI and advanced manufacturing, space, discovery data, finance and human futures, Arizona local systems, and Ontario local systems.

## Record Contract

Every candidate has:

- a stable private candidate ID,
- source name, owner, jurisdiction, and URL,
- discovery source and discovery date,
- source type, access type, and key requirement,
- provisional credibility and priority,
- an evidence profile,
- a bounded statement of what the source can prove,
- a concrete human next action,
- a candidate status and optional triage date.

Each profile separately defines topic pillars, public watch lanes, evidence limits, likely signal use, and local-system relevance. Those profile-level limits apply to every candidate in the profile.

## Validation

From `app/`:

```powershell
npm.cmd run validate:candidates
```

The validator requires exactly 150 unique candidates, 10 records in each of the 15 expected profiles, valid controlled values, complete workflow fields, and no exact name or URL collision with the active public source library.

Optional live-link audit:

```powershell
npm.cmd run audit:candidate-links
```

The live audit is a diagnostic, not a promotion gate. Some official portals reject automated requests, require browser sessions, or fail behind restricted network environments. A human must still open and assess a candidate before promotion.

## Review States

- `Needs Triage`: discovered and structured, but not yet given a complete first human pass.
- `Candidate`: first-pass triage completed; still private and not claim-supporting.
- `On Hold`: potentially useful, but blocked by access, duplication, instability, scope, or unclear evidence value.
- `Rejected`: unsuitable for the active source library; retain the reason so the same weak rail is not repeatedly rediscovered.
- `Promoted`: converted into a separate public source record after the full promotion gate passes.

## Promotion Gate

A candidate may become an active public source only when a human reviewer:

1. opens the live source and confirms ownership, URL, access, and cadence;
2. selects a specific dated item, dataset, docket, filing, decision, or stable monitoring rail;
3. records exactly what it proves and what it cannot prove;
4. checks for duplication against the active source library;
5. assigns the correct public topic, watch lane, authority, cadence, and review metadata;
6. adds the new public source through the normal content schema;
7. runs content, source-health, Astro, build, and release verification;
8. publishes only through the existing human-reviewed Git workflow.

Promotion never moves private notes wholesale into public content. The public source record must contain only reviewed fields appropriate for publication.

## Operating Rhythm

Review candidates in small, gap-led batches. Prefer five to ten candidates tied to a current evidence gap, local dossier question, stale public source, or weak coverage lane. Do not promote a batch merely to increase the public source count.

The target is a maintained discovery shelf, not 150 automatic additions. Phase 52 held the active public library at 114 sources while giving later editorial cycles enough structured options to improve authority selectively. Phase 55A reviewed 15 additional records without promoting any of them publicly. Phase 55B brought the public library to 117 through separate, bounded official-source research; no private candidate was promoted, and the detailed triage note remains in Git-ignored `private-data/`.
