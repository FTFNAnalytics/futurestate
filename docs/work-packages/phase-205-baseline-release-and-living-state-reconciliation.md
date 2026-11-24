# Phase 205 — Baseline, release, and living-state reconciliation

**State:** Source-level current checks pass; full production/type validation remains blocked by the dependency/access issue, with repair/audit approval unanswered. No current full validation receipt exists. Security, independent acceptance and external release gates remain open.

**September 14 implementation:** See the [current build report](../phase-205-216-build-2026-09-14.md) for concrete artifacts, validation and remaining exits. The original acceptance checklist below is not silently promoted by local implementation.
**Planning date:** September 9; updated September 14, 2026.  
**Current schedule:** [September 14 roadmap revision](../roadmap-next-phases-205-216-2026-09-14.md).  
**Priority:** P1.  
**Accountable roles:** Build maintainer; editorial owner.  
**Effort estimate:** 3–5 engineering days, plus review.  
**Dependencies:** September 9 audit; no new evidence return required.

## Outcome and reason

The working tree, September 1 receipt, current manifest, and previously inspected hosted version 79 describe different states. The September 10 additions provide a dated current-evidence projection and 104 reader bindings with 92 distinct drafts. Targeted assertions pass; full current validation is still pending. Finish and harden these additions instead of recreating the projection or treating historical certification as current.

## Starting points

- [ftfn-v0.2-build.json](../../deployment/ftfn-v0.2-build.json)
- [v1ref-candidate-digest.mjs](../../app/scripts/lib/v1ref-candidate-digest.mjs)
- [v1-public-reference-edition.json](../../app/src/data/v1-public-reference-edition.json)
- [assert-phase189-196-content.mjs](../../app/scripts/assert-phase189-196-content.mjs)
- [phase-60-current-decisions.json](../../app/src/data/phase-60-current-decisions.json)
- [phase-204-reader-completion.json](../../app/src/data/phase-204-reader-completion.json)

## Work

1. Capture HEAD, the intended FTFN delta, dependency lock, corpus counts, artifact hashes, and fresh validation date. Exclude unrelated Fawcett work; preserve all existing user changes.
2. Create a concise current-status record that links the historical snapshot, current working candidate, and hosted source separately. Correct misleading current-document pointers without rewriting immutable receipts.
3. Finish and validate the existing dated current-state projection over the preserved baseline. Verify the four September 10 receipts, exact record/source joins, dates, authority boundaries, exports and affected routes; reject malformed, unauthorized or predated events. Bind the reader extension and receipt propagation to a fresh full build/validation archive.
4. Resolve the 16 missing generated link targets reported by the audit, preferably with correct canonical mappings or preserved historical aliases. Add whole-output link checking to release acceptance.
5. Review the public Astro/Sharp advisories against actual image/build and runtime use; complete a full dependency review by an approved method. Test a compatible upgrade and retain a rollback point if required.

## Acceptance

- [ ] Current counts and validation date reconcile without modifying the September 1 receipt.
- [ ] A representative authorized later decision can appear in current views while the historical view remains unchanged; malformed, unauthorized, or predated events fail.
- [ ] Zero missing internal page/asset targets in generated output; historical updates still resolve.
- [ ] No unresolved critical security exposure in the selected release; documented applicability and complete validation after any upgrade.
- [ ] Local validation is distinct from Git publication, deployment, domain, access, and owner promotion.

## Boundary and handoff

Do not regenerate phase content merely to synchronize counts. Do not weaken immutable snapshot tests to make a current-state mutation pass.

Record completed work, exact changed artifacts, validation results, unresolved blockers, and the next action. Deliver working content or behavior as applicable, not another empty registry. Continue according to Phase 206's dependencies in the [Phase 205–216 roadmap](../roadmap-next-phases-205-216.md).
