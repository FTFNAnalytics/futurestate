# FTFN v0.2 Build Summary

Date: 2026-07-23

## Executive State

FTFN is a locally and post-deploy verified static release candidate. The v0.2 content, public trust surfaces, data exports, indexing policy, release checks, and deferred Phase 52 authority-layer work are complete. An owner-only Sites deployment now exists, the current development branch is not yet on the public GitHub repository, and no production DNS change has been made.

| Area | Current State |
| --- | --- |
| Product | Working Astro + TypeScript static site |
| Package | `ftfn-app` `0.2.0-dev` |
| Current branch | `codex/phase51-content` |
| Preserved Phase 52B checkpoint | `35f26f4` (`feat: complete phase 52b authority layer`) |
| GitHub remote | `https://github.com/FTFNAnalytics/futurestate.git` |
| Remote alignment | the current branch remains unpushed to public GitHub; the exact hosting checkpoint was pushed only to the private Sites source repository |
| Release state | owner-only hosted preview verified; public release deferred |
| Canonical domain | `https://ftfn.io` |
| Hosting | OpenAI Sites owner-only deployment at `https://ftfn-analytics.jbumstead.chatgpt.site` |
| Public launch | not approved and not performed |

Phase 55C preserves the completed release package locally and follows Project Baccara into conditional county and proposed air-permit records. It repairs the existing signal rather than adding another one and does not authorize a push, preview, DNS change, public launch, or additional Published promotion.

Phase 55D adds a minimal static hosting adapter, deploys the exact 218-page package to an owner-only Sites URL, and passes hosted checks on core reader routes, canonical and indexing metadata, robots, sitemap, and the 120-record source export. It does not authorize public access, `ftfn.io` attachment, or Hostinger DNS changes.

Phase 55E expands the candidate to 227 pages, 128 public sources, and 36 signals. It rechecks all 17 aging source rails, reviews 15 additional private candidates, repairs seven broad records into dated evidence updates, adds one bounded storage-funding signal, and keeps the publication count at nine. Sites version 3 now serves the exact committed Phase 55E state under the existing owner-only policy.

Phase 55F applies the full publication gate to those eight records. Seven specific, source-backed records move to `Published`; the Joby certification-test record remains `In Review` because the selected milestone is still an interested-party claim without independent FAA confirmation. The route count remains 227 while the public export grows to 16 signals and the update log grows to eight entries. Sites version 4 now serves the exact Phase 55F checkpoint under the unchanged owner-only policy.

Phase 55G converts two Project Baccara authority gaps into official records: Maricopa County's formal meeting summary records a 4-1 approval, and MCAQD lists final Permit `P0013417` as active and effective June 30, 2026. The existing signal remains `In Review` because the executed MCP, condition compliance, service, construction, testing, occupancy, and operating evidence remain open. The package now contains 229 pages, 130 sources, and nine updates; Sites version 5 serves the exact Phase 55G commit under the unchanged owner-only policy.

## Build Inventory

The current release contract is recorded in `deployment/ftfn-v0.2-build.json`.

| Measure | v0.1.1 checkpoint | v0.2 candidate | Change |
| --- | ---: | ---: | ---: |
| Generated HTML pages | 182 | 229 | +47 |
| Sources | 102 | 130 | +28 |
| Signals | 18 | 36 | +18 |
| Published signals | 3 | 16 | +13 |
| In Review signals | 14 | 20 | +6 |
| Draft Sample signals | 1 | 0 | -1 |
| Topics | 17 | 17 | 0 |
| Public update entries | 0 | 9 | +9 |
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

- 130 structured source records with authority, freshness, access, monitoring, and review metadata,
- 36 bounded signal records with explicit claim and evidence limits,
- 16 Published signals backed by 30 sources checked on or after 2026-07-22,
- named Arizona and Ontario conversion trails that stop at the last verified stage,
- a public nine-entry update and correction log,
- a private update queue and documented signal-repair workflow,
- a pre-Supabase public/private data contract,
- a local-only 150-record source-candidate registry across 15 evidence profiles,
- 60 reviewed private candidates: 58 retained as `Candidate`, one promoted to `Active Source Record`, one rejected, and 90 left for later gap-led review,
- improved Source Monitor review-state grouping and per-source next actions,
- Strong, Developing, and Weak Source Coverage summaries with lane-specific next actions; after the Phase 55A recheck, all 14 public coverage lanes classify as Strong.

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

Phase 55A then reran the same command set after refreshing the CISA Cybersecurity Advisories, NIST NVD API, and EIA Grid Monitor source records. The result remained 210 pages, 114 public sources, and 33 signals. Source Monitor now reports two Review Due, 17 Watch Soon, and 95 Current records; both overdue records are unassigned source-maintenance items rather than publication blockers.

Phase 55B added three official records and two bounded `In Review` signals: the White House post-quantum migration order, OMB implementation guidance, and the Arizona Corporation Commission's Project Baccara certificate decision. It also rechecked the Toronto permit-status, Ontario housing-supply, and ACC eDocket rails. The current result is 215 pages, 117 public sources, and 35 signals. Source Monitor now reports zero Review Due, 17 Watch Soon, and 100 Current records; Source Coverage remains 14 Strong, zero Developing, and zero Weak lanes.

Phase 55C found no qualifying public-agency PQC migration plan or PQC-specific FAR proposal, so that lane remains a monitor. It instead added Maricopa County's official `MCP250007` agenda and conditions, an official MCAQD notice proposing Permit `P0013417`, and contemporaneous KJZZ vote corroboration. The existing Project Baccara signal was repaired without increasing the signal or Published counts. The current result is 218 pages, 120 public sources, and 35 signals. Source Monitor reports zero Review Due, 17 Watch Soon, and 103 Current records; Source Coverage remains 14 Strong, zero Developing, and zero Weak lanes.

Phase 55E rechecked all 17 Watch Soon records, corrected four active-source canonical URLs, reviewed 15 additional private candidates, added eight dated source records, repaired seven existing signals, and added one new DOE storage prize signal. The local result is 227 pages, 128 public sources, and 36 signals. Source Monitor now reports zero Review Due, zero Watch Soon, and 128 Current records; Source Coverage remains 14 Strong, zero Developing, and zero Weak lanes.

Phase 55F promoted seven of the eight Phase 55E records after a separate source, copy, citation, caveat, metadata, and correction-path review. It held the Joby record because the FAA context source does not independently confirm the company-described milestone. The source, signal, topic, and page counts are unchanged; the publication state is now 16 Published and 20 In Review, with eight public updates.

Phase 55G added the official County action and signed final MCAQD air permit to the existing Project Baccara trail. The content result is 229 pages, 130 public sources, 36 signals, and nine updates. Source Monitor reports zero Review Due, zero Watch Soon, and 130 Current records; Source Coverage remains 14 Strong, zero Developing, and zero Weak lanes. Both primary Baccara lanes advanced, so the fallback federal post-quantum search was not opened.

Verified results:

- 229 generated HTML pages,
- exact exports for 130 sources, 17 topics, and 16 Published signals,
- all 16 Published signal routes included in the sitemap,
- all non-published signal routes excluded from the sitemap,
- correct canonical, robots, and publication-state indexing boundaries,
- ten core journeys checked at `1440x900` and `390x844`,
- compact header brand and navigation targets repaired to a 44-pixel minimum,
- no checked layout, semantic, indexing, or browser-console release blocker.
- exactly 150 unique private candidates, 10 in each of 15 profiles, with active-source duplication permitted only for the one record explicitly marked `Active Source Record`,
- no private candidate IDs or registry-path references in generated output.
- focused desktop/mobile checks on Source Monitor and Source Coverage, with no document overflow or browser-console warning/error.

The local and Phase 55G deployment evidence is in `docs/release-qa-v0.2.md`; the initial hosted evidence is in `docs/work-packages/phase-55d-owner-only-sites-preview.md`. The owner-only preview is current at Sites version 5 from commit `ddeea6ab3213d7e9367c6564a9b8d31395ba7675`. The `ftfn.io` and `www.ftfn.io` domain entries remain pending DNS validation and do not route to the Site.

## Repository And Deployment State

The local release work is preserved on `codex/phase51-content`. The branch remains ahead of `origin/main`; verify the exact HEAD and ahead count before any external action.

The hosting checkpoint is preserved in the private Sites source repository while the public GitHub branch remains unsynchronized. GitHub push, pull-request review, merge, public access, and custom-domain attachment remain separate decisions. Do not deploy an older `origin/main` checkout: it stops at the Phase 50B baseline.

The domain `ftfn.io` is available for the project. DNS was observed on 2026-07-22 to remain outside Cloudflare, with Google Workspace mail records active. Before any nameserver or DNS change, inventory and preserve every mail and verification record. Hosting-provider selection remains an explicit Phase 55 decision: Cloudflare Pages is the documented default, but another static host may be chosen if avoiding a nameserver migration is more important.

## Known Limitations

- Twenty signals remain `In Review`; the former Joby Draft Sample is now a bounded company-claim record in review and is the explicit hold from Phase 55F.
- The briefing, dependency maps, and local-system profiles remain prelaunch or research material.
- The local dossiers do not prove corridor-wide readiness, project completion, capacity sufficiency, occupancy, or workforce outcomes.
- The Project Baccara record now includes an official 4-1 County action and active final air permit; the fully executed MCP, condition compliance, service, construction, testing, occupancy, and operation remain unverified.
- Public JSON files are static exports, not a live API.
- There is no private database, automated ingestion, scheduled monitoring, analytics, newsletter capture, account system, or numeric 42/59 scoring.
- The private candidate registry is an ignored local file, so it requires private workspace or encrypted backup outside public Git.
- The optional bulk link audit was blocked by uniform outbound Node network failures in this execution environment; representative official rails were spot-checked, and each remaining URL must still be opened during human triage.
- The local browser pass is focused release QA, not a complete WCAG or assistive-technology audit.

## Readiness Verdict

The product build now has a verified owner-only hosted preview and remains non-public. A later launch would still require three operational gates:

1. decide whether to synchronize the verified branch to public GitHub,
2. freeze the release as `0.2.0`,
3. approve public access and execute the production-domain launch while preserving email DNS.

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

Expected output: 229 HTML pages and a passing v0.2 release assertion.
