# Phase 216 conditional Reference Beta release execution

Recorded November 23, 2026 locally. Machine execution timestamps are UTC.

## Owner authority and current hold

The owner explicitly approved the conditional plan in [the release/rollback report](phase-216-release-rollback-checks-2026-11-23.md). The additive [owner decision](phase-216-owner-approval-2026-11-23.json) records that actual instruction. Earlier statements that no release approval exists are historical, not the current authority state.

The approved scope is **FTFN Reference Beta**, not full v1, measurement admission or a completed operating month. Public launch remains held until every applicable condition passes. No DNS or audience change has occurred at this checkpoint.

The application candidate remains `39ba66d3b6168c2507f16e0bd0d07c014e6f8c3d7a30719844bb90071d1e33c7`, with retained receipt `204-FULL-LOCAL-VALIDATION-2026-11-23-09d54992be87`. The exact original application and reviewed translation bytes are preserved.

## Validation and formatting reconciliation

The complete earlier validation and eleven-check recovery rehearsal remain dated history. A staged `git diff --check` then exposed EOF blank lines and Markdown hard-break spaces that an unstaged-only check had missed. The first formatting attempt changed hash-bound inputs. Two new runs correctly failed:

- `outputs/validation/2026-11-24T05-40-42.556Z-4JgV96`: translation-text SHA-256 mismatch; no replacement full receipt.
- `outputs/validation/2026-11-24T05-43-01.382Z-y0Mgkd`: a later dossier's exact historical Italy-input pin rejected the formatting change; no replacement full receipt.

All eight affected review texts and all sixteen affected application files were restored byte-for-byte, using the staged originals or the verified recovery archive. No evidence, review hash, historical fixture or verifier assertion was rewritten. Thirty-one unbound report files retain formatting-only cleanup; Markdown hard breaks use backslashes. `.gitattributes` explicitly permits only the pre-existing EOF blank lines on the twenty-four exact-byte files; other whitespace checks remain enabled. The staged whitespace check passed under those documented file-specific rules.

The complete rerun is `outputs/validation/2026-11-24T05-52-36.202Z-X7Iiru`: `current:generate` exited 0 and `current:validate` exited 0, finishing **2026-11-24T06:20:17.771Z**. It includes the complete candidate/content/source-metadata sequence, current regressions, Phase 58–61/67 and immutable Phase 145–172 checks, both production builds, post-build checks and full release verification. The unchanged candidate reused its valid immutable receipt rather than overwriting it. Supplementary Phase 62–66 assertions also all exited 0 in `outputs/validation/2026-11-24T06-21-02.980Z-QyL217`, finishing at 06:21:07.463Z. These are actual terminal results, not an in-progress log.

The full PR comparison also includes forty-five earlier unmerged content commits. Its raw whitespace scan flagged preserved CRLF, valid Markdown hard breaks, frozen link transcripts and five historical/template input files. `.gitattributes` now documents CRLF support, Markdown syntax, the exact frozen transcript family and those five specific inputs. The full `origin/main...HEAD` and working-tree whitespace checks pass under that explicit format policy. No application/evidence bytes or functional/historical assertions changed to make that happen.

## Browser and saved-evidence checks

AI-led local browser checks observed keyboard skip-link focus, readable mobile and 1280-pixel desktop layouts without horizontal overflow, Hanford catalog search, all 34 translation entries, Spanish/French water readings, preserved September cutoffs with November context, the current Arizona receipt, a rendered 21-receipt JSON export and a 404 for a deliberately missing route. No human-study or independent-review observation is claimed.

The browser's file-save helper timed out and reset its automation session. Direct navigation to the JSON export subsequently rendered the expected data. Download-manager saving remains unverified; it is not being relabelled as a pass. Temporary viewport overrides were reset. The separate final loopback HTTP check passed eight exact-byte responses, including the current JSON, ZIP download, robots and sitemap, plus the expected missing-route 404 (`outputs/phase216-approved-release-2026-11-23/local-http-check.json`). Hosted, signed-out, TLS and rollback browser checks remain separate.

Saved-receipt reconciliation first on November 23 and then at 06:17:20 UTC (November 24 in America/Edmonton) found thirteen dated primary identities and 21 current-ledger receipts, with four separate Toronto receipts. No genuinely due operation remains for either date. DARPA's retained September baseline appointment is not a new routine recheck under the owner's standing instruction. Next: the two independent November 25 Amtrak/NNSA gates, November 29 Toronto, December 2 Loudoun and the separately scheduled December 21 follow-ups. This is not a new source inspection or cycle closure.

## Repository and private hosting preparation

Release branch: `codex/phase216-release` in `FTFNAnalytics/futurestate`. Repository inspection found no Actions workflows or webhooks, no configured Pages deployment, no active required checks and no main-branch protection to bypass. Unrelated root outputs and working folders are excluded from staging. The final staged-byte comparison passed for all 10,288 scoped files at 06:25:15 UTC; the bounded private-key/token-literal scan returned zero findings. This is not a claim of comprehensive personal-data detection.

Commit `0adfb00a57b4d32a8391e6bf4ce19e9caabca622` and the validation/format-policy follow-up `515c0db7bf22f8824602469d4c4f6c4f57aabdea` were pushed and verified. [PR #2](https://github.com/FTFNAnalytics/futurestate/pull/2) was updated with the actual passing results, marked ready and merged after its CLEAN/MERGEABLE state and absence of required checks were inspected. The returned merge commit is `8ffa1673dc94b8127e06452e9325991f58ddfb3b`. A fresh fetch verified that exact `origin/main` commit and matching release-source tree. No protection or check was bypassed. The later status documentation is additive; the candidate is unchanged.

Existing Sites project: `appgprj_6a614e1092d08191bf65779fc35df959`, owner-only. Saved version 80 and its source `8e1a06156fc1968915e497d84189bb022355afd0` are the rollback baseline. A first isolated checkout failed on Windows path length; it is preserved, not treated as a successful open. A fresh checkout with repository-local `core.longpaths=true` opened cleanly. No global filesystem or security setting changed.

The old static client folder was moved recoverably to `outputs/phase216-approved-release-2026-11-23/sites-version80-client-backup`. A source-helper package from the earlier validated output was pushed under Sites source commit `65874105e2c014f71a38ae425edb9fb9f8c0b437`; automatic publication was explicitly disabled. That archive has 22,262 regular files (22,259 static assets), 212,121,352 bytes and SHA-256 `19bbf09c983911b8d891c6215438d56b55fa7f26c905a50b68b7568f087c5ecf`. Complete membership and eight representative extracted-byte checks passed.

**That first package was superseded before deployment.** Comparison with the final rebuild correctly failed: the rerun crossed Edmonton midnight and 4,095 rendered files differ. Every difference was verified as the displayed date/checked-age increment; all 22,259 static files were hash-checked and the 4,095 changed files synchronized. No source inspection or evidence date was rewritten. The final build retains 22,259 files and 1,167,056,089 bytes; its compact-JSON manifest digest is `5a9f57900adf0aaa89a3ebb5fe822568177c0512c3b18aa81c48b13858ee6446`. The pretty-printed manifest file separately hashes to `f6ebdab5cb8c123a2f597568b47fedd4a04e7c4000eb0db0ee9d95228520b871`. An initial archive assertion mixed those two serializations; it was corrected to the originating manifest algorithm without changing any file entry or build byte.

The supported helper successfully pushed final Sites source `7fb5f36948df55233f476d4d070ae5d9647054dc` and produced `outputs/phase216-approved-release-2026-11-23/phase216-reference-beta-final-sites.tar`: 212,122,357 archive bytes, SHA-256 `4b33aac4d54878956277d10175baf9fdd8e13a20aae064387748f04ac01babae`, 22,262 regular entries. Complete membership, eight extracted static samples and both unchanged Worker files passed at 06:32:59.881Z in `final-archive-check.json`. Source-only provenance binds the GitHub merge, approved candidate, lockfile and final output. Automatic publication remained disabled during source synchronization.

## Private deployment rejected: hosting capacity

After confirming the existing owner-only audience, the native private-save/deploy operation rejected the final archive with `INVALID_ARGUMENT / invalid_archive`: **Sites limits expanded archives to 256 MiB**. The complete validated static output is 1,167,056,089 bytes (about 1.09 GiB), already over the limit before Worker metadata. The smaller compressed upload size does not satisfy the expanded-file limit. No new saved-version or deployment ID was returned. A fresh Site read still showed latest saved version 80, active, with one owner and no groups or external visitors. Public access and DNS were not changed.

The build is not inflated by a stray dependency folder: `browse/` accounts for 402,477,507 bytes, `data/` 402,431,694, downloads 107,828,616, and the remaining authored routes/assets about 254 MB. The package already contains only configured output and Worker/hosting metadata. Removing downloads alone would not solve the limit. These are release-bound content/routes and exports, not authorized disposable clutter; no content was silently removed and no quota bypass was attempted.

Hosted candidate/browser checks, version-80 rollback and candidate reapplication cannot be accepted without a successful private deployment. Do not retry the identical oversized archive. The next decision is either an explicitly approved compatible hosting destination for the complete build (recommended), or a separately approved size-reduction/runtime redesign with fresh candidate validation and unchanged evidence boundaries. Existing hosting capacity and cost must be checked before any new service or resource is authorized. This decision is separate from the already-given conditional launch approval.

## Hostinger connection blocker

The configured Hostinger MCP server is enabled but not signed in. Two ordinary login attempts failed before opening a consent page with an OAuth metadata response-decoding error. Between attempts the official protected-resource metadata endpoint returned HTTP 200 and valid JSON; that justified one bounded retry, not an authentication bypass. Plugin discovery exposed Hostinger Mail, which is not DNS authority and was not used for this task.

The owner needs to restore a working Hostinger connection for the account managing `ftfn.io`; no password or token should be pasted into chat. Until then, authoritative zone capture, transfer status, website-only DNS cutover, apex/www TLS and public launch remain unverified and held. No nameserver, email, DNS record or Site access setting was changed.

## Remaining release contract

Local validation, source/output/archive lineage, scoped GitHub publication and saved-receipt reconciliation passed. Remaining gates are a supported hosting-capacity decision and successful private deployment; hosted browser/access/download checks; actual version-80 rollback and candidate reapplication (or an explicitly revised equivalent recovery contract if the hosting destination changes); a working Hostinger connection; authoritative DNS/transfer inspection; website-only cutover and apex/www TLS/redirect checks. Public launch is held, not complete. Preserve the named Beta scope and historical/research limits. Start thirty real operating days only at the actual public-launch time; Phase 216 and full-v1 promotion remain separate and open.
