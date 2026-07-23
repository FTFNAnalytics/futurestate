# FTFN v0.2 Session Handoff Plan

Date: 2026-07-23

Use this document to restart FTFN in a new Codex session without reconstructing the project from chat history.

## Handoff Snapshot

```text
Latest completed work: Phase 55I remaining-candidate review and content expansion
Current branch: codex/phase51-content
Preserved Phase 52B checkpoint: 35f26f4
Git state: branch remains unpushed to public GitHub; exact hosted checkpoint exists in the private Sites source repository
Package: 0.2.0-dev
Build: 260 pages
Content: 152 sources, 45 signals, 17 topics
Publication: 16 Published, 29 In Review, 0 Draft Sample
Trust/data: 11 update entries, 3 versioned JSON exports
Private authority layer: 150 candidates, 15 profiles, 132 Candidate, 11 Active Source Record, 4 Watchlist Only, 2 Blocked, 1 Rejected, 0 Needs Triage
Deployment: owner-only Sites version 7 at https://ftfn-analytics.jbumstead.chatgpt.site
Domain: ftfn.io is ready; production DNS is unchanged
Source health: 0 Review Due, 0 Watch Soon, 152 Current; 14 Strong coverage lanes
Next phase: Phase 55J publication-readiness review, then the dated Phase 55H Council recheck; public-domain work remains separate
```

## Read First

Use this short order:

1. `docs/build-summary-v0.2.md`
2. `docs/roadmap-v0.2.md`
3. `deployment/ftfn-v0.2-build.json`
4. `docs/release-qa-v0.2.md`
5. `docs/private-source-candidate-registry.md`
6. `docs/launch-package.md`
7. `docs/supabase-activation-plan.md`
8. `docs/session-brief.md` only if deeper project history is needed

## First Ten Minutes Of The New Session

The new session should verify rather than assume:

1. Run `git status --short --branch`.
2. Confirm `git log --oneline --decorate -20` still has `35f26f4` in the current history and inspect the newer Phase 55A-55I commits.
3. Compare the current branch with `origin/main` and confirm which remote branches exist.
4. Read the v0.2 manifest and confirm package/count expectations still match the repository.
5. Review any current documentation or content diff before committing it.
6. Run `git diff --check`.
7. Confirm `private-data/source-candidates.json` remains ignored and run `npm.cmd run validate:candidates` from `app/`.
8. If app or content files changed after Phase 54, rerun the complete release command set before any preview.

## Phase 55 External Execution Sequence - Private Preview Complete

The approved preview sequence is complete:

1. Confirmed the Phase 52B checkpoint and Phase 55A-55C authority work in local history.
2. Built and revalidated the original 218-page candidate; Phase 55E expanded the package to 227 pages, Phase 55F expanded the Published membership, Phase 55G advanced the package to 229 pages and 130 sources, and Phase 55I locally advanced it to 260 pages and 152 sources.
3. Created a private Sites source repository without pushing the branch to public GitHub.
4. Added the minimal static Sites packaging adapter and deployed the reviewed checkpoint.
5. Kept the preview owner-only and did not attach `ftfn.io`.
6. Passed hosted route, canonical, indexing, update-log, robots, sitemap, and export checks.
7. Recorded the provider, URL, checkpoint, packaging boundary, and QA result in the Phase 55D work package.
8. Stopped before package freeze, public access, custom-domain attachment, or Hostinger DNS changes.
9. Refreshed the owner-only deployment to Sites version 5 from exact commit `ddeea6ab3213d7e9367c6564a9b8d31395ba7675` after the Phase 55G authority conversion.
10. Refreshed the owner-only deployment to Sites version 6 from exact commit `f2fe94ae95a2f702104b995c2a0a01776c00f3aa` after the Phase 55H pre-decision authority repair.
11. Completed the Phase 55I content and candidate pass and refreshed the exact source commit `8ce2feba82a3ade2266e2d74788c003bca28a26f` as owner-only Sites version 7.

## Required Stop Points

External actions remain separate approvals:

- GitHub push or pull-request creation,
- hosting-provider connection and preview deployment,
- merge to `main`,
- package freeze from `0.2.0-dev` to `0.2.0`,
- nameserver or DNS changes,
- public launch,
- analytics or newsletter collection,
- Supabase production-project activation.

Do not combine these into a single implied authorization. In particular, a passing preview does not authorize DNS changes.

## Domain And Email Guardrail

The domain is ready, but Google Workspace mail records are active. Before any production DNS action:

- export or inventory the complete current DNS zone,
- preserve Google MX and SPF records,
- preserve any DKIM, DMARC, domain-verification, and other TXT records that exist,
- decide whether to retain the current nameservers or migrate them,
- verify mail before and after the change,
- keep a rollback record of the prior values.

## Parallel Supabase Track

Supabase is ready to begin as a private authority-loop backend because the public/private contract is already defined. It is not required for the static preview or initial public site.

When activated:

- use Supabase Auth and RLS for private workflow data,
- begin with the private source-candidate registry and review queue,
- keep public publishing human-reviewed and Git-backed,
- do not let database triggers, functions, or webhooks publish claims directly.

## Ready-To-Paste Restart Prompt

```text
Continue the FTFN project from the current v0.2 handoff in this workspace.

Read, in order:
1. docs/build-summary-v0.2.md
2. docs/roadmap-v0.2.md
3. docs/session-handoff-v0.2.md
4. deployment/ftfn-v0.2-build.json
5. docs/release-qa-v0.2.md
6. docs/launch-package.md

Then verify the actual Git status, current commit, branch relationship to origin/main, package version, and release-manifest counts. Do not rely on the documents if the repository disagrees.

The latest completed work is the Phase 55I remaining-candidate review and content expansion. The current candidate should be 0.2.0-dev on codex/phase51-content at or after commit 8ce2feba82a3ade2266e2d74788c003bca28a26f, with 152 sources, 45 signals, 16 Published signals, 29 In Review signals, 11 public updates, three JSON exports, and 260 pages. Sites version 7 serves that exact commit at the owner-only URL https://ftfn-analytics.jbumstead.chatgpt.site; the branch remains unpushed to public GitHub, and the pending custom-domain entries do not route because DNS has not been changed.

Phase 55I completed the first-pass review of all 150 local-only private candidates across 15 profiles: 132 Candidate, 11 Active Source Record, four Watchlist Only, two Blocked, one Rejected, and zero Needs Triage. Confirm the registry remains Git-ignored, run npm.cmd run validate:candidates, and do not copy candidate IDs, private notes, registry structure, or non-promoted candidate contents into public Git, app content, exports, issues, or build artifacts.

Preserve the owner-only preview and stop before changing access or attaching a domain. Run a separate Phase 55J publication-readiness review on the nine Phase 55I signals; promotion is optional and record-by-record. Phase 55H records Toronto application 24 254930's July 29-31 Council date, the wind-study, land-exchange, and laneway conditions that precede bill enactment; complete the same-item recheck after the meeting. Do not change Hostinger DNS, freeze 0.2.0, launch publicly, or activate public database behavior without separate explicit approval. Preserve all Google Workspace DNS records if domain work is approved.
```
