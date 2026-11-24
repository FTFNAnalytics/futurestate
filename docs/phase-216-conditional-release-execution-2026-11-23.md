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

Release branch: `codex/phase216-release` in `FTFNAnalytics/futurestate`. Repository inspection found no Actions workflows or webhooks, no configured Pages deployment, no active required checks and no main-branch protection to bypass. Unrelated root outputs and working folders are excluded from staging. The exact staged-byte comparison and bounded credential-literal scan passed before the formatting reconciliation; both must be rerun against the final staged state.

Commit `0adfb00a57b4d32a8391e6bf4ce19e9caabca622` was pushed and verified against the remote release branch. [PR #2](https://github.com/FTFNAnalytics/futurestate/pull/2) is open; its inspected state is draft, MERGEABLE/CLEAN, with no status checks reported. The final documentation/format-policy/manifest follow-up and merge remain pending at this checkpoint.

Existing Sites project: `appgprj_6a614e1092d08191bf65779fc35df959`, owner-only. Saved version 80 and its source `8e1a06156fc1968915e497d84189bb022355afd0` are the rollback baseline. A first isolated checkout failed on Windows path length; it is preserved, not treated as a successful open. A fresh checkout with repository-local `core.longpaths=true` opened cleanly. No global filesystem or security setting changed.

The old static client folder was moved recoverably to `outputs/phase216-approved-release-2026-11-23/sites-version80-client-backup`. A source-helper package from the earlier validated output was pushed under Sites source commit `65874105e2c014f71a38ae425edb9fb9f8c0b437`; automatic publication was explicitly disabled. That archive has 22,262 regular files (22,259 static assets), 212,121,352 bytes and SHA-256 `19bbf09c983911b8d891c6215438d56b55fa7f26c905a50b68b7568f087c5ecf`. Complete membership and eight representative extracted-byte checks passed.

**That first package is superseded before deployment.** Comparison with the final rebuild correctly failed: the rerun crossed Edmonton midnight and 4,095 rendered files differ; inspected examples advance checked-date ages by one day and the displayed as-of date to November 24. The final build retains 22,259 files and 1,167,056,089 bytes; its complete manifest hashes to `5a9f57900adf0aaa89a3ebb5fe822568177c0512c3b18aa81c48b13858ee6446`. Final-byte synchronization and repackaging are in progress, with the original archive retained. No saved version or deployment has been created from the superseded package. Private deployment, hosted rollback and reapplication remain pending.

## Hostinger connection blocker

The configured Hostinger MCP server is enabled but not signed in. Two ordinary login attempts failed before opening a consent page with an OAuth metadata response-decoding error. Between attempts the official protected-resource metadata endpoint returned HTTP 200 and valid JSON; that justified one bounded retry, not an authentication bypass. Plugin discovery exposed Hostinger Mail, which is not DNS authority and was not used for this task.

The owner needs to restore a working Hostinger connection for the account managing `ftfn.io`; no password or token should be pasted into chat. Until then, authoritative zone capture, transfer status, website-only DNS cutover, apex/www TLS and public launch remain unverified and held. No nameserver, email, DNS record or Site access setting was changed.

## Remaining release contract

Complete and record the terminal validation, exact source/output lineage, scoped GitHub publication, private hosted candidate checks, version-80 rollback/reapplication, source-cutoff reconciliation, authoritative DNS/transfer checks and canonical-domain/access checks. Preserve the named Beta scope and visibly retained historical/research limits. Launch only after all applicable conditions pass. Start thirty real operating days only at the actual public-launch time; Phase 216 and full-v1 promotion remain separate and open.
