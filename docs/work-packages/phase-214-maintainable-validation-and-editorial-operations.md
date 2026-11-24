# Phase 214 — Maintainable validation and editorial operations

**Approved September 15 repair:** [Dependency repair, strict type fixes and logged full validation](../phase-214-build-repair-2026-09-15.md). The user approved repair/audit/retry; the patched dependency audit is clean and type checking passes. Consult the linked report for the full production/release sequence's final outcome and actual logs. The old approval blocker below is historical; independent acceptance and hosted rollback remain separate requirements.

**State:** Current commands, pinned-input classification checks and projection-level correction/withdrawal/reapplication regression implemented; security, full propagation and hosted rollback remain. See the [latest continuation](../phase-206-classification-progress-2026-09-14.md).

**September 15 continuation:** [Reading and receipt checks](../phase-213-reading-editions-2026-09-15.md) add pure identity fixtures and prepare production checks for paired English formats, compact byte budgets, exact control assignments, separate companion receipts and the complete paginated update archive. Source checks are not production acceptance; the existing build/access approval remains outstanding.

**September 14 implementation:** See the [current build report](../phase-205-216-build-2026-09-14.md) for concrete artifacts, validation and remaining exits. The original acceptance checklist below is not silently promoted by local implementation.
**Planning date:** September 9, 2026.  
**Priority:** P2.  
**Accountable roles:** Build maintainer; evidence editor.  
**Effort estimate:** 4–6 engineering days and 1–2 editorial days.  
**Dependencies:** 205 projection; 207 first real cycle; changes from 208–213.

## Outcome and reason

344 npm scripts and 461 top-level module scripts create a large maintenance surface. Real currency, link, and user-task checks need a reliable place in the release workflow.

## Starting points

- [package.json](../../app/package.json)
- [verify-release.mjs](../../app/scripts/verify-release.mjs)
- [source-health-report.mjs](../../app/scripts/source-health-report.mjs)
- [v1ref-candidate-digest.mjs](../../app/scripts/lib/v1ref-candidate-digest.mjs)
- [source-monitoring-plan.md](../source-monitoring-plan.md)

## Work

1. Expose a small stable set of documented commands for current validation, source currency, content generation, build, and release verification; retain historical aliases.
2. Reuse shared schema, identity, count, route, and evidence-transition validators instead of duplicating each new phase. Keep independent expected behavior where it protects against generator errors.
3. Separate endpoint-metadata checks from actual retrieval/currency reports. Add whole-output path checking and targeted semantic/editorial checks.
4. Profile the fresh build baseline and largest routes; reduce repeated work only where measured. Preserve no-JavaScript static output and reproducibility.
5. Rehearse a correction through source, current decision, page, search, export, update, and rollback. Define weekly editorial owners, escalation, and evidence retry rules.

## Acceptance

- [ ] A documented current command sequence reproduces the release without manual count edits.
- [ ] Historical snapshots still pass their own regressions; legitimate authorized current changes pass separate transition tests.
- [ ] The independent 16-target link regression and actual currency status are visible in release reporting.
- [ ] A correction and rollback rehearsal produces consistent reader/export states with dated provenance.
- [ ] Any new scheduled automation requires explicit creation authorization; the plan itself does not create background jobs.

## Boundary and handoff

Refactor incrementally. Do not delete historical commands or weaken meaningful tests merely to reduce script counts.

Record completed work, exact changed artifacts, validation results, unresolved blockers, and the next action. Deliver working content or behavior as applicable, not another empty registry. Continue according to Phase 215's dependencies in the [Phase 205–216 roadmap](../roadmap-next-phases-205-216.md).
