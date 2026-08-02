# Phase 56P: Action-Level Priority Recommendation Decomposition

Date: 2026-08-01
Status: In progress

## Goal

Convert the strongest Phase 56O agency portfolios into stable action-level records. Publish only actions explicitly named in the four prioritized official letters, and keep local action keys, GAO database identities, priority designation, implementation, closure, operating outcomes, and realized benefits distinct.

## Selected batch

| Agency | Official letter | Named actions |
|---|---|---:|
| DOE | GAO-26-109001 | 5 |
| HHS | GAO-26-108997 | 4 |
| DOT | GAO-26-109050 | 8 |
| VA | GAO-26-108978 | 5 |

GSA, OSTP, NTIA, and the government-wide benefit model remain contextual Phase 56O records. The HHS hospital-control tracker record remains In Review until the official tracker changes.

## Required boundaries

- FTFN action keys are stable local references, not GAO Recommendations Database numbers.
- The four letters name selected examples; they are not complete action inventories for the agency portfolios.
- Open priority designation does not prove a lack of progress, implementation, closure, or operating outcome.
- Recommendation action, agency response, implementation evidence, closure state, service quality, readiness, safety, savings, and causation remain separate.
- Different agency portfolios do not support rankings or comparable rates.
- The Phase 56F evidence ledger remains one Closed, twenty-one Partially Closed, and two Open.
- Public access, DNS, package freeze, and public GitHub remain out of scope.

## Deliverables

- `app/src/data/phase-56p-action-recommendation-ledger.json`
- `app/src/data/phase-56p-publication-review.json`
- `app/src/content/research-collections/agency-priority-recommendation-action-ledger-2026.json`
- `app/src/content/briefings/briefing-research-watch-020-action-level-priority-recommendations.mdx`
- four full-report source profiles
- twenty-two research documents and Published signals
- `/downloads/agency-priority-recommendation-action-ledger-2026.zip`
- integrated entity ledgers, reader pathways, topics, organizations, and comparison map

## Acceptance criteria

- Twenty-two exact letter-named actions receive stable local identities, status periods, limitations, and continuation rules.
- No local key is rendered as an official GAO recommendation number.
- The inherited HHS tracker hold and four contextual Phase 56O records remain explicit.
- The twenty-five-file archive passes manifest and checksum validation.
- Content validation, source health, Astro diagnostics, production build, Phase 56K through Phase 56P assertions, release assertions, sitemap membership, exports, and private-registry exclusion pass.
- The exact prepared runtime is saved and deployed as a new owner-only Sites version with no groups or external visitors.
