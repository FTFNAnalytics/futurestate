# Phase 215 — Hosted release candidate and review

**State:** Held — local review packet prepared; no deployment or independent hosted review.  

**September 14 implementation:** See the [current build report](../phase-205-216-build-2026-09-14.md) for concrete artifacts, validation and remaining exits. The original acceptance checklist below is not silently promoted by local implementation.
**Planning date:** September 9, 2026.  
**Priority:** P1 release gate.  
**Accountable roles:** Release owner; build maintainer; independent reviewers.  
**Effort estimate:** 2–4 release-engineering days plus reviewer turnaround.  
**Dependencies:** All applicable 205–214 exits; exact release scope.

## Outcome and reason

Existing Sites version 79 is verified but predates the current local build. A local pass does not establish the deployed candidate's behavior.

## Starting points

- [hosting.json](../../app/.openai/hosting.json)
- [ftfn-v0.2-build.json](../../deployment/ftfn-v0.2-build.json)
- [prepare-sites-package.mjs](../../app/scripts/prepare-sites-package.mjs)
- [ftfn-domain-dns-handoff.md](../ftfn-domain-dns-handoff.md)
- [publication-policy.md](../publication-policy.md)

## Work

1. Prepare the complete scoped candidate, known-limitations list, correction history, current validation results, dependency disposition, reviewer packet, and rollback target.
2. Reconcile packaging with the current Sites contract; bind the exact source commit, lockfile, build output, archive, and saved version. Preserve the existing project identity.
3. Resolve the actual publication audience and obtain any required deployment/access approval only when the candidate is ready to inspect.
4. After authorized deployment, verify terminal status and the exact hosted source, routes, canonical URLs, robots/sitemap, exports, downloads, social metadata, redirects/404, and access behavior.
5. Run representative browser/mobile/keyboard tests and independent editorial/subject review. Exercise rollback and record findings against the exact candidate.

## Acceptance

- [ ] One unambiguous source-to-deployment chain exists; no claim that historical version 79 contains new work.
- [ ] Zero missing internal targets and no unresolved critical defects on the selected candidate.
- [ ] Canonical origin and indexing match actual domain/access decisions; social assets and data links work on the hosted audience.
- [ ] Required independent reviews are genuine, attributable, and dispositioned; changed candidate content triggers appropriate re-review.
- [ ] Owner receives a concrete release packet with remaining holds and verified rollback.

## Boundary and handoff

This work package authorizes no deployment, Git push, domain/access change, or external reviewer contact by itself. Preserve the existing live version until a replacement is authorized and verified.

Record completed work, exact changed artifacts, validation results, unresolved blockers, and the next action. Deliver working content or behavior as applicable, not another empty registry. Continue according to Phase 216's dependencies in the [Phase 205–216 roadmap](../roadmap-next-phases-205-216.md).
