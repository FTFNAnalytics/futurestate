# FTFN v0.2 Build Summary

Date: 2026-07-22

## Executive State

FTFN is a locally verified static release candidate. The v0.2 content, public trust surfaces, data exports, indexing policy, release checks, and deferred Phase 52 authority-layer work are complete. The project is not yet deployed, the current development branch is not yet on GitHub, and no production DNS change has been made.

| Area | Current State |
| --- | --- |
| Product | Working Astro + TypeScript static site |
| Package | `ftfn-app` `0.2.0-dev` |
| Current branch | `codex/phase51-content` |
| Current commit | `8395e94` (`feat: complete phase 54 release qa`) |
| GitHub remote | `https://github.com/FTFNAnalytics/futurestate.git` |
| Remote alignment | local HEAD is six commits ahead of `origin/main`; the current branch has not been pushed |
| Release state | local release candidate; preview deferred |
| Canonical domain | `https://ftfn.io` |
| Hosting | no hosting project or preview deployment configured |
| Public launch | not approved and not performed |

This handoff-document update is uncommitted until it is reviewed and explicitly committed.

## Build Inventory

The current release contract is recorded in `deployment/ftfn-v0.2-build.json`.

| Measure | v0.1.1 checkpoint | v0.2 candidate | Change |
| --- | ---: | ---: | ---: |
| Generated HTML pages | 182 | 210 | +28 |
| Sources | 102 | 114 | +12 |
| Signals | 18 | 33 | +15 |
| Published signals | 3 | 9 | +6 |
| In Review signals | 14 | 23 | +9 |
| Draft Sample signals | 1 | 1 | 0 |
| Topics | 17 | 17 | 0 |
| Public update entries | 0 | 7 | +7 |
| Versioned JSON exports | 0 | 3 | +3 |

Additional current records:

- 10 organizations,
- 5 technologies,
- 2 local systems,
- 10 evidence gaps,
- 2 dependency maps,
- 1 briefing in review.

## What Is Built

The public application includes:

- a narrative homepage using real project records,
- Published-first signal index and signal detail pages,
- Atlas indexes and details for topics, sources, organizations, technologies, local systems, evidence gaps, and dependency maps,
- two named local-system evidence dossiers,
- Source Monitor and Source Coverage surfaces,
- Method, publication-policy, updates/corrections, About, and briefing surfaces,
- versioned JSON exports for sources, topics, and Published signals,
- generated `robots.txt` and `sitemap.xml`,
- canonical metadata for `https://ftfn.io`,
- `noindex, follow` boundaries for non-published signals and briefings.

The editorial and authority layer includes:

- 114 structured source records with authority, freshness, access, monitoring, and review metadata,
- 33 bounded signal records with explicit claim and evidence limits,
- nine Published signals backed by 12 sources checked on 2026-07-22,
- named Arizona and Ontario conversion trails that stop at the last verified stage,
- a public seven-entry update and correction log,
- a private update queue and documented signal-repair workflow,
- a pre-Supabase public/private data contract,
- a local-only 150-record source-candidate registry across 15 evidence profiles,
- a completed first triage pass on 30 candidates, with 120 retained for later gap-led review,
- improved Source Monitor review-state grouping and per-source next actions,
- Strong, Developing, and Weak Source Coverage summaries with lane-specific next actions.

The private registry lives in Git-ignored `private-data/` because the current repository is public. No candidate was added to the public source library, exports, or static output. The tracked workflow and promotion gate are documented in `docs/private-source-candidate-registry.md`.

## Verification Evidence

Phase 54 passed the complete local release gate on 2026-07-22:

```text
npm.cmd run validate:content   passed
npm.cmd run validate:candidates passed
npm.cmd run source:health      passed
npm.cmd run check              passed
npm.cmd run build              passed
npm.cmd run verify:release     passed
```

Verified results:

- 210 generated HTML pages,
- exact exports for 114 sources, 17 topics, and nine Published signals,
- all nine Published signal routes included in the sitemap,
- all non-published signal routes excluded from the sitemap,
- correct canonical, robots, and publication-state indexing boundaries,
- ten core journeys checked at `1440x900` and `390x844`,
- compact header brand and navigation targets repaired to a 44-pixel minimum,
- no checked layout, semantic, indexing, or browser-console release blocker.
- exactly 150 unique private candidates, 10 in each of 15 profiles, with no exact name or URL collision against the 114 active sources,
- no private candidate IDs or registry-path references in generated output.
- focused desktop/mobile checks on Source Monitor and Source Coverage, with no document overflow or browser-console warning/error.

The detailed evidence is in `docs/release-qa-v0.2.md`. Preview and production behavior have not been verified because there is no deployment.

## Repository And Deployment State

The local release work is preserved on `codex/phase51-content`. It contains six commits not present on `origin/main`, spanning the pre-Supabase contract, Phases 51A-51C, Phase 53, and Phase 54.

The next repository action is to review and commit this handoff package, push the branch to GitHub, and merge it through an intentional review path. Do not deploy an older `origin/main` checkout: it stops at the Phase 50B baseline.

The domain `ftfn.io` is available for the project. DNS was observed on 2026-07-22 to remain outside Cloudflare, with Google Workspace mail records active. Before any nameserver or DNS change, inventory and preserve every mail and verification record. Hosting-provider selection remains an explicit Phase 55 decision: Cloudflare Pages is the documented default, but another static host may be chosen if avoiding a nameserver migration is more important.

## Known Limitations

- Twenty-three signals remain `In Review`; one company-claim example remains a `Draft Sample`.
- The briefing, dependency maps, and local-system profiles remain prelaunch or research material.
- The local dossiers do not prove corridor-wide readiness, project completion, capacity sufficiency, occupancy, or workforce outcomes.
- Public JSON files are static exports, not a live API.
- There is no private database, automated ingestion, scheduled monitoring, analytics, newsletter capture, account system, or numeric 42/59 scoring.
- The private candidate registry is an ignored local file, so it requires private workspace or encrypted backup outside public Git.
- The optional bulk link audit was blocked by uniform outbound Node network failures in this execution environment; representative official rails were spot-checked, and each remaining URL must still be opened during human triage.
- The local browser pass is focused release QA, not a complete WCAG or assistive-technology audit.

## Readiness Verdict

The product build is ready for an unchanged private preview. It is not yet ready to be called a completed public launch because four operational gates remain:

1. synchronize the verified branch to GitHub,
2. deploy and verify an unchanged preview,
3. freeze the release as `0.2.0`,
4. approve and execute the production domain launch while preserving email DNS.

Supabase can begin in parallel as a private authority-loop backend, but it must not block the static preview or bypass Git and human publication review.

## Reproduce The Candidate

From `app/` on Windows:

```powershell
npm.cmd run validate:content
npm.cmd run validate:candidates
npm.cmd run source:health
npm.cmd run check
npm.cmd run build
npm.cmd run verify:release
```

Expected output: 210 HTML pages and a passing v0.2 release assertion.
