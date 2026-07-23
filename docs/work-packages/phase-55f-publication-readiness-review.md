# Phase 55F Publication-Readiness Review

Date: 2026-07-23

Status: complete

## Objective

Apply the full FTFN publication gate to the eight Phase 55E records. Promote only records that can stand on their own as specific, source-backed public intelligence with visible evidence limits and a correction path.

This is an editorial consolidation pass. It does not authorize public access, a package freeze, custom-domain attachment, Hostinger DNS changes, or public launch.

## Result

Seven records moved from `In Review` to `Published`. One company-claim record remains `In Review`.

| Record | Decision | Public role | Boundary retained |
| --- | --- | --- | --- |
| `signal-sample-009` | Published | Dated IEA electricity-demand and grid-bottleneck analysis | The 17% figure is aggregate data-centre growth, not AI-only demand, a local forecast, or proof of utility capacity. |
| `signal-sample-005` | Published | Current NHTSA crash-reporting rule and data-quality watch | Report counts are incomplete, non-normalized, and unsuitable for simple manufacturer safety rankings. |
| `signal-sample-003` | Published | Definitive CHIPS materials-discovery funding agreement | Up to $500 million in program funding is not a qualified material, commercial product, fab, or production result. |
| `signal-sample-006` | Published | Dated Artemis III hardware-integration milestone | Stacking and component progress are not integrated readiness, schedule proof, launch, or mission success. |
| `signal-sample-008` | Published | Named USDA plant-breeding award portfolio | Awards and research directions are not successful traits, field performance, yield, commercialization, or adoption. |
| `signal-statcan-building-permits-construction-intentions-signal` | Published | Specific May 2026 Canadian and Toronto permit-intentions release | Permit value and authorized units are not starts, completions, affordability, occupancy, or delivery. |
| `signal-doe-storage-step-prize-production-readiness` | Published | Dated federal storage-manufacturing prize launch | Competition design and a $500,000 purse are not a winner, production capacity, validation, or deployment. |
| `signal-sample-010` | In Review | Company-described FAA-conforming aircraft milestone | The selected FAA page supplies program context, not independent confirmation of Joby's aircraft-status and first-flight claims. |

The publication set is now 16 records. Twenty records remain `In Review`; there are no Draft Sample records.

## Gate Findings

The seven promoted records passed the following checks:

- the development is specific and dated;
- the source is official or, for the IEA record, clearly labeled credible analysis;
- source links and checked dates are current to the review;
- evidence quality and verification status match the claim;
- evidence is separated from interpretation;
- local consequences are omitted or explicitly conditional where local evidence is absent;
- funding, award, hardware, permit, and prize records do not claim later conversion stages;
- publication dates and correction-path editorial notes are present;
- each record fits the FTFN dependency, constraint, or consequence thesis.

The Joby record failed the independent-support portion of the gate. Joby's announcement remains interested-party evidence, and the selected FAA source does not independently confirm the aircraft's conforming status, first flight, Type Inspection Authorization status, regulator-flown testing, or certification outcome.

## Source Recheck

All 30 unique sources supporting the 16 Published records were checked on or after 2026-07-22.

The Phase 55F pass refreshed three older support rails:

- NASA's Artemis overview continues to describe Artemis III as a 2027 low-Earth-orbit demonstration and Artemis IV as the early-2028 lunar-landing target.
- USDA NIFA's plant-breeding, genetics, and genomics program page remains available and continues to frame program support rather than project outcomes.
- CMHC's Housing Market Information Portal remains available as supporting context and still requires specific tables plus local evidence for delivery claims.

## Public-Surface Changes

- the Published export grows from nine to 16 records;
- the seven promoted detail routes switch to `index, follow`;
- the seven promoted routes enter `sitemap.xml`;
- the Joby route remains `noindex, follow` and outside the sitemap and Published export;
- the public update log grows from seven to eight entries.

## Owner-Only Deployment Result

The exact validated Phase 55F checkpoint was saved and deployed as Sites version 4 from commit `48a6f0379741b5d908ecf94c7765dcab27502ea0`.

- deployment status: succeeded;
- URL: `https://ftfn-analytics.jbumstead.chatgpt.site`;
- access: custom policy with one allowed owner and no groups;
- public GitHub branch: unchanged;
- `ftfn.io` and `www.ftfn.io`: pending validation only, with no DNS change and no active routing;
- package version: remains `0.2.0-dev`.

## Acceptance Criteria

- [x] Review all eight Phase 55E records against the publication policy.
- [x] Record an explicit publish-or-hold decision for every record.
- [x] Preserve the evidence boundary on every promoted record.
- [x] Keep the company-claim record outside the Published export.
- [x] Add the public Phase 55F update entry.
- [x] Update the release manifest and repeatable verification contract.
- [x] Run candidate validation, content validation, source health, Astro checks, production build, and release assertions.
- [x] Refresh and verify the existing owner-only Sites preview without changing access or DNS.

## Next Content Lane

Phase 55G should be a bounded follow-through pass driven by the clearest open conversion records:

1. recheck Toronto application `24 254930` after the 29-31 July 2026 Council window for adoption and by-law evidence;
2. follow Project Baccara for the executed county record, final MCAQD permit, and later construction or operating evidence;
3. monitor for the first named federal-agency post-quantum implementation plan, procurement action, proposed FAR rule, or NIST pilot result.

Do not fill the next phase from source volume alone. Select the first lane that produces a named record and stop at the last verified stage.
