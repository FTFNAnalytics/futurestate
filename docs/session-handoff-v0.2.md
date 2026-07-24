# FTFN v0.2 Session Handoff Plan

Date: 2026-07-24

Use this document to restart FTFN in a new Codex session without reconstructing the project from chat history.

## Handoff Snapshot

```text
Latest completed work: Phase 55S authority sprint, batch one of three
Current branch: codex/phase51-content
Preserved Phase 52B checkpoint: 35f26f4
Git state: branch remains unpushed to public GitHub; exact hosted checkpoint exists in the private Sites source repository
Package: 0.2.0-dev
Build: 434 generated site pages
Content: 225 sources, 72 signals, 17 topics, 4 research collections / 55 research documents
Publication: 45 Published signals, 27 In Review signals, 2 Published briefings, 3 In Review briefings, 3 Published dependency maps
Trust/data: 20 update entries, 6 Phase 55Q gap decisions, 6 reader pathways across 7 Atlas surfaces, 3 versioned JSON exports, verified 26-file, 11-file, 19-file, and 11-file research archives
Private authority layer: 150 candidates, 15 profiles, 102 Candidate, 41 Active Source Record, 4 Watchlist Only, 2 Blocked, 1 Rejected, 0 Needs Triage
Deployment: Phase 55S batch one validated locally; prior owner-only checkpoint is Sites version 15 from 9d9643fd at https://ftfn-analytics.jbumstead.chatgpt.site
Domain: ftfn.io is ready; production DNS is unchanged
Source health: 139 Manual Review, 86 Probe Ready; 14 Strong coverage lanes
Next phase: deploy Phase 55S batch one owner-only, then process the second 30-record sub-batch; Phase 55H, Phase 55R, and Arizona wastewater remain dated inserts
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
2. Confirm `git log --oneline --decorate -20` still has `35f26f4` in the current history and inspect the newer Phase 55A-55Q commits.
3. Compare the current branch with `origin/main` and confirm which remote branches exist.
4. Read the v0.2 manifest and confirm package/count expectations still match the repository.
5. Review any current documentation or content diff before committing it.
6. Run `git diff --check`.
7. Confirm `private-data/source-candidates.json` remains ignored and run `npm.cmd run validate:candidates` from `app/`.
8. If app or content files changed after Phase 54, rerun the complete release command set before any preview.

## Phase 55 External Execution Sequence - Private Preview Complete

The approved preview sequence is complete:

1. Confirmed the Phase 52B checkpoint and Phase 55A-55C authority work in local history.
2. Built and revalidated the original 218-page candidate; Phases 55E-55J advanced it to 261 pages and 153 sources, Phase 55K advanced it to 321 pages and 176 sources, Phase 55L advanced it to 345 pages and 183 sources, and Phase 55N advanced it to 380 pages, 189 sources, and three research collections with 47 document records.
3. Created a private Sites source repository without pushing the branch to public GitHub.
4. Added the minimal static Sites packaging adapter and deployed the reviewed checkpoint.
5. Kept the preview owner-only and did not attach `ftfn.io`.
6. Passed hosted route, canonical, indexing, update-log, robots, sitemap, and export checks.
7. Recorded the provider, URL, checkpoint, packaging boundary, and QA result in the Phase 55D work package.
8. Stopped before package freeze, public access, custom-domain attachment, or Hostinger DNS changes.
9. Refreshed the owner-only deployment to Sites version 5 from exact commit `ddeea6ab3213d7e9367c6564a9b8d31395ba7675` after the Phase 55G authority conversion.
10. Refreshed the owner-only deployment to Sites version 6 from exact commit `f2fe94ae95a2f702104b995c2a0a01776c00f3aa` after the Phase 55H pre-decision authority repair.
11. Completed the Phase 55I content and candidate pass and refreshed the exact source commit `8ce2feba82a3ade2266e2d74788c003bca28a26f` as owner-only Sites version 7.
12. Completed the Phase 55J publication gate, added OMB M-26-04, promoted all nine reviewed signals, and refreshed exact source commit `03d8d5db755c4f6ee0761a479ef0b9b3f0ff5d37` as owner-only Sites version 8.
13. Completed the Phase 55K research layer with 23 reviewed documents, 22 local captures, one official-link record, five `In Review` synthesis signals, one briefing, one dependency map, and a verified 26-file archive.
14. Deployed exact source commit `37f3ca6956d752642989f04486d13ff0c4555813` as owner-only Sites version 9 without changing access or DNS.
15. Completed Phase 55L with eight stage-bounded implementation trails, seven new source profiles, seven new `In Review` signals, one repaired USAspending signal, one briefing, an expanded dependency map, and a verified 11-file archive.
16. Deployed exact source commit `d1300d5503244c52541ac597163af9f991594294` as owner-only Sites version 10 with one allowed owner, no groups, and no access or DNS change.
17. Completed Phase 55N with a 16-record outcome and local-conversion collection, six sources, six new `In Review` signals, two briefings, four organizations, integrated trail and dossier repairs, and a verified 19-file archive.
18. Deployed exact source commit `c14551c7fad7e0ba6aac0e9e9ce03e5ad6189575` as owner-only Sites version 11 with one allowed owner, no groups, and no access or DNS change.
19. Completed Phase 55M with fourteen record-level publication decisions: thirteen promotions and one scheduled-trial hold. The verified contract now contains 38 Published, 25 In Review, 16 updates, and 66 current Published-support sources without adding routes.
20. Deployed exact source commit `c1038783998234025ec2af65dae495272a263cc1` as owner-only Sites version 12 with one allowed owner, no groups, and no access or DNS change.
21. Completed Phase 55O: two briefings Published, three briefings held, three dependency maps repaired and Published, 17 updates, and a passing 380-page release contract.
22. Deployed exact source commit `b4f5f63ff33c72ec9ce58191b981904ad9fed4ad` as owner-only Sites version 13 with one allowed owner, no groups, and no access or DNS change.
23. Completed Phase 55P: six structured reader pathways now deepen five priority topic pages and both local-system pages, connect 30 distinct Published signals to the Published synthesis and research layers, preserve eight explicit evidence gaps, and add the eighteenth update without adding routes.
24. Deployed exact source commit `8b43caeb7db1debefab3292ed1913ce8bd2b557e` as owner-only Sites version 14 with one allowed owner, no groups, and no access, custom-domain, or DNS change.
25. Completed Phase 55Q locally: six structured gap decisions, five named official sources, four bounded Published signals, dossier and pathway repairs, 19 updates, and a passing 389-page release contract.
26. Preserved the Toronto Phase 55H task for August 1 and added the Arizona wastewater acceptance and operation recheck for September 22.
27. Deployed exact source commit `9d9643fd2d46a03f7148b90971d50d10d24baa97` as owner-only Sites version 15 with one allowed owner, no groups, and no access, custom-domain, or DNS change.

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

The latest completed work is Phase 55S authority-sprint batch one. The current candidate should be 0.2.0-dev on codex/phase51-content with 225 sources, 72 signals, 45 Published signals, 27 In Review signals, two Published briefings, three In Review briefings, three Published dependency maps, six Phase 55Q gap decisions, six reader pathways across seven existing Atlas surfaces, 20 public updates, three JSON exports, 434 generated site pages, four research collections, 55 research documents, and verified 26-file, 11-file, 19-file, and 11-file download archives. Confirm the current owner-only Sites version and source commit from the deployment manifest; the branch remains unpushed to public GitHub, and the pending custom-domain entries do not route because DNS has not been changed.

The private authority layer contains 150 local-only candidates across 15 profiles: 102 Candidate, 41 Active Source Record, four Watchlist Only, two Blocked, one Rejected, and zero Needs Triage. Confirm the registry remains Git-ignored, run npm.cmd run validate:candidates, and do not copy candidate IDs, private notes, registry structure, or non-promoted candidate contents into public Git, app content, exports, issues, or build artifacts.

Preserve the owner-only preview and stop before changing access or attaching a domain. Phase 55S batch one is complete; process the second 30-record sub-batch with emphasis on finance and human systems, critical minerals, grid and compute, and remaining local authority rails. Treat the August 1 Toronto task, August 10 DARPA Lift task, and September 22 Arizona wastewater task as bounded inserts rather than pauses. Do not collapse governance, award, obligation, oversight, software, construction, procurement, draft-standard, test, acceptance, operation, or scale stages. Do not change Hostinger DNS, freeze 0.2.0, launch publicly, or activate public database behavior without separate explicit approval. Preserve all Google Workspace DNS records if domain work is approved.
```
