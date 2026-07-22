# FTFN v0.2 Session Handoff Plan

Date: 2026-07-22

Use this document to restart FTFN in a new Codex session without reconstructing the project from chat history.

## Handoff Snapshot

```text
Latest completed work: Phase 55A local checkpoint and bounded authority refresh
Current branch: codex/phase51-content
Preserved Phase 52B checkpoint: 35f26f4
Git state: branch remains local and unpushed; verify exact HEAD and ahead count
Package: 0.2.0-dev
Build: 210 pages
Content: 114 sources, 33 signals, 17 topics
Publication: 9 Published, 23 In Review, 1 Draft Sample
Trust/data: 7 update entries, 3 versioned JSON exports
Private authority layer: 150 candidates, 15 profiles, 44 Candidate, 1 Rejected, 105 Needs Triage
Deployment: none
Domain: ftfn.io is ready; production DNS is unchanged
Next phase: continue Phase 55 content-authority work; external synchronization and preview remain deferred
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
2. Confirm `git log --oneline --decorate -10` still has `35f26f4` in the current history and inspect any newer local Phase 55A commit.
3. Compare the current branch with `origin/main` and confirm which remote branches exist.
4. Read the v0.2 manifest and confirm package/count expectations still match the repository.
5. Review any current documentation or content diff before committing it.
6. Run `git diff --check`.
7. Confirm `private-data/source-candidates.json` remains ignored and run `npm.cmd run validate:candidates` from `app/`.
8. If app or content files changed after Phase 54, rerun the complete release command set before any preview.

## Phase 55 Execution Sequence

Proceed in this order:

1. Confirm the Phase 52B checkpoint and Phase 55A authority-refresh commits are present locally.
2. Authenticate GitHub through a browser or approved credential helper; never paste passwords, tokens, recovery codes, or private keys into chat.
3. Push `codex/phase51-content` to `FTFNAnalytics/futurestate`.
4. Review the branch against `main`, then merge through a pull request or another explicit reviewed path.
5. Select the static host. Cloudflare Pages remains the documented default; use another static host if retaining the current external DNS is the better operational choice.
6. Configure a non-production preview from the exact reviewed commit with app root `app`, build command `npm run build`, and output directory `dist`. If the preview must be confidential, enable access protection; an unlinked preview URL is not automatically private.
7. Do not attach `ftfn.io` during preview setup.
8. Run the manifest's launch-critical route, asset, canonical, indexing, update-log, and export checks against the preview URL.
9. Record the preview URL, deployed commit, provider, build result, and post-deploy QA result in a Phase 55 work package.
10. Stop for an explicit release decision before changing the package version, DNS, or public visibility.

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

The latest completed work is Phase 55A. The current candidate should be 0.2.0-dev on codex/phase51-content at or after the preserved Phase 52B checkpoint 35f26f4, with 114 sources, 33 signals, nine Published signals, seven public updates, three JSON exports, and 210 pages. The branch remains local and unpushed, and no preview or production deployment exists.

Phase 52B is complete and Phase 55A reviewed 15 more records: the local-only private registry contains exactly 150 candidates across 15 profiles, with 44 at Candidate, one Rejected, and 105 still needing triage. Confirm it remains Git-ignored, run npm.cmd run validate:candidates, and do not copy candidate contents into public Git, app content, exports, issues, or build artifacts.

Proceed with the next bounded Phase 55 content pass while keeping the project non-public: replace the retired Toronto active-permits rail, deepen named Arizona facility evidence, and select a bounded post-quantum migration or procurement record. Report before pushing, merging, connecting a host, or deploying. Do not change ftfn.io DNS, freeze 0.2.0, launch publicly, or activate public database behavior without separate explicit approval. Preserve all Google Workspace DNS records if a later domain migration is approved.
```
