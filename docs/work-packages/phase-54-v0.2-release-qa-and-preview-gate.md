# Phase 54 Work Package: v0.2 Release QA And Preview Gate

Status: complete locally on 2026-07-22; preview deployment explicitly deferred.

## Objective

Verify the complete v0.2 authority-loop build, repair confirmed release-quality defects, preserve a reproducible release contract, and stop before any unapproved deployment, DNS, or public-launch action.

## Deliverables

- [x] Run content-reference validation.
- [x] Run source-health validation.
- [x] Run Astro diagnostics and the production build.
- [x] Verify every Published record has current supporting-source checks.
- [x] Run desktop and mobile browser QA on core reader journeys.
- [x] Test the Published filter and publication-state behavior.
- [x] Repair the compact header touch targets.
- [x] Verify robots, sitemap, canonical, and noindex boundaries.
- [x] Verify the public update log and all three static exports.
- [x] Add a repeatable release assertion command.
- [x] Add a versioned v0.2 build manifest.
- [x] Prepare the v0.2 release-QA record.
- [x] Prepare the public-facing launch note and limitations statement.
- [x] Defer preview deployment because no approval was provided.

## Implementation

### Release contract

Added:

- `deployment/ftfn-v0.2-build.json`,
- `app/scripts/verify-release.mjs`,
- `npm run verify:release`.

The assertion checks expected counts, required outputs, the seven-entry update log, export schemas and private-field boundaries, the 12 Published-support source dates, exact sitemap membership, robots policy, canonical URLs, and Published/non-published indexing states.

### Source freshness

The Phase 54 preflight found one Published-support source with an older check date: the CMHC starts/completions/under-construction table directory. The official table directory was rechecked and the source record was refreshed to `2026-07-22`. No signal claim or publication state changed.

### Header accessibility repair

The brand and primary navigation previously rendered at roughly 20 to 21 pixels high. The global header styles now provide a minimum 44 × 44 target for every header link. Mobile spacing was tightened around those targets so the header remains compact without reducing the interactive area.

## Browser QA

Viewports:

- 1440 × 900,
- 390 × 844.

Core journeys:

- homepage,
- Signals index,
- Published signal detail,
- In Review signal detail,
- Method,
- Updates,
- Atlas,
- Source Monitor,
- Source Coverage,
- About.

All 20 route/viewport combinations passed the checked layout, semantic, alternative-text, heading, link, overflow, publication-state, and header-target assertions. The browser console produced no errors or warnings.

The Published filter returned exactly nine Published cards. The mobile Source Coverage table remained scrollable inside its own container without causing page-level overflow.

## Verification Result

```text
validate:content: passed
source:health: passed
Astro check: 0 errors, 0 warnings, 0 hints
build: 210 HTML pages
release assertions: passed
Published signals: 9
Published-support sources current: 12 of 12
browser QA: passed locally
preview QA: deferred pending explicit approval
```

## Acceptance Criteria

- [x] The current content graph validates.
- [x] Source endpoint metadata validates.
- [x] The static build generates 210 HTML pages.
- [x] The public update log contains seven entries.
- [x] The public exports contain 114 sources, 17 topics, and 9 Published signals.
- [x] All Published-support sources carry a current Phase 54 check date.
- [x] Sitemap membership exactly matches the Published signal export.
- [x] Published and non-published index states remain separated.
- [x] Built canonical and robots URLs use `https://ftfn.io`.
- [x] Core desktop/mobile journeys pass without a release blocker.
- [x] Header links meet the 44-pixel minimum target.
- [x] Preview deployment is either verified or explicitly deferred.
- [x] Public launch and DNS remain behind explicit approval.

## Known Limitations

- This is local browser QA, not post-deploy verification.
- Accessibility coverage is a focused DOM and responsive interaction pass, not a complete assistive-technology audit.
- The package remains `0.2.0-dev` until the preview/release decision.
- Static exports do not create a live API or self-updating backend.
- Twenty-three In Review signals, one Draft Sample, the briefing, dependency maps, and local constraint profiles remain outside the Published core.

## Next Step

Request an explicit decision on private preview deployment. If approved, deploy the exact v0.2 candidate, rerun the launch-critical checks on the preview URL, and then make separate decisions about the `0.2.0` version freeze, `ftfn.io`, and public launch.

Supabase activation remains a parallel private-authority-loop track and does not block previewing the verified static candidate.
