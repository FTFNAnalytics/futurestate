# Phase 216 — generated-output cleanup and full local validation

**Recorded:** November 23, 2026 locally. Machine timestamps below are UTC.\
**Outcome:** Approved generated-output cleanup and full local validation completed successfully. Phase 216 and Evidence Cycle 001 remain open; no external release occurred.

## Authority and cleanup

The user explicitly approved generated-output cleanup and full local validation. Command-scoped approval allowed the ordinary build sequence to run under the normal account. No manual OneDrive ACL change was needed or made. This does not grant continuing authority to change security settings or bypass a future restriction.

The cleanup target was resolved and checked before execution: only the generated, Gitignored `app/dist` directory, with no tracked files or symlinks. It contained 4,201 files / 85,092,038 bytes of partial prior output. Astro replaced that output and rebuilt it through the normal configured destination. The removed generated output is reproducible from retained sources; no source, evidence receipt, historical fixture, Git history or unrelated directory was deleted. No alternate-output workaround was used.

Validation explicitly selected the existing bundled Node 24.22.3. System Node, dependencies, package manifest, lockfile and Astro configuration were unchanged during this cleanup/validation work. The preceding [approved dependency repair](phase-216-dependency-repair-2026-11-23.md) and its audit remain separately dated history; no new install or security audit is claimed here.

## Terminal validation results

The final [logged run](../outputs/validation/2026-11-24T03-50-20.670Z-fz5s29/results.json) records:

| Command | Started UTC | Finished UTC | Exit |
| --- | --- | --- | --- |
| `current:generate` | 2026-11-24 03:50:20.673 | 2026-11-24 03:50:57.912 | 0 |
| `current:validate` | 2026-11-24 03:50:57.914 | 2026-11-24 04:14:22.142 | 0 |

Both processes are terminal, not merely passing intermediate commands. The full sequence passed candidate/content checks, source-health metadata, current regressions, included historical assertions, production build, post-build checks, full release verification, receipt creation, the receipt-bearing rebuild and the final release/manifest verification. Immutable Phase 145–172 assertions passed. The [supplementary Phase 62–66 run](../outputs/validation/2026-11-24T04-14-51.484Z-rfoaY8/results.json) also passed all five commands, finishing at 04:14:54.128 UTC. Together the logged checks cover the required Phase 58–67 assertions.

The whole-site production inventory is **16,892 HTML pages excluding downloads, 161 top-level JSON exports, 425 updates and 833 canonical source records**. These are distinct from the bounded Phase 181–204 acceptance contract: 24 phases, 1,048 records, 3,216 routes, 25 exports and 24 updates.

### Exact local validation receipt

- State: **Passed**.
- Receipt: `204-FULL-LOCAL-VALIDATION-2026-11-23-09d54992be87`.
- Receipt timestamp: `2026-11-24T04:04:27.295Z`; local validated date `2026-11-23`.
- Candidate SHA-256: `39ba66d3b6168c2507f16e0bd0d07c014e6f8c3d7a30719844bb90071d1e33c7`.
- Artifact-manifest SHA-256: `b9aa1d681ed35b95e845b0321a8d38ed13132d4bab9eeb867cb79addf8a91683`.
- Bound artifacts: **4,020**; receipt checks: **29**.
- [Immutable receipt archive](../app/src/data/phase-204-receipts/204-FULL-LOCAL-VALIDATION-2026-11-23-09d54992be87.json).

The receipt was created before the final receipt-bearing rebuild. The successful terminal result above, not the receipt timestamp alone, establishes that the entire run finished. Independent recomputation matched the current candidate and manifest; the archived receipt exactly matches the aggregate receipt. Git diff whitespace checks passed. This report and the coordinator handoff are outside the candidate manifest; adding this record does not silently create a different validated candidate.

## Repairs required by production validation

1. **Translated links:** HTML source-link checks now compare parsed URL attributes, correctly handling valid query-string escaping while rejecting changed URLs, profiles and languages. Sixteen historical contract routes resolve through an additive canonical-navigation layer. The complete translation inventory, text, review dates and historical contracts retain their exact prior bytes; corrected navigation is separately exported and tested.
2. **Independent receipt contexts:** The editorial-desk export now includes the saved NNSA accepted-capacity receipt as related context; the evidence-queue export includes the saved SLF companion likewise. Neither is inserted into an unrelated owned row. Desk and queue remain eight and ten rows respectively, and cycle identity count remains thirteen. Regression fixtures reject absent, changed-date and wrong-owner receipt placement.
3. **Bounded navigation:** Dependency-graph and linked-map previews are smaller while complete static archives remain available. The previously oversized comparison-map page is 195,269 bytes; the Outcomes Watch briefing is 170,105 bytes. Existing 200,000-byte budgets were not relaxed.
4. **Canonical sitemap checks:** Nevada source-inspection dates no longer overwrite later content revisions. Nine older dossier verifiers now require the actual canonical target and exact modification date, and exclude legacy aliases from the sitemap. Negative fixtures reject wrong dates, missing entries, wrong canonical links and indexed aliases.
5. **Projects directory:** Expanded project entries use compact, exactly-once linked titles instead of duplicating full cards. All 46 expanded project links, cohort headings and review boundaries remain; detailed narratives are unchanged. The overview has 30 cards and is 52,043 bytes, within the unchanged limits.

All 34 translated pages passed production verification, each below 64,000 bytes. The requested eight October readings remain integrated within those 34; they were not rewritten or counted again.

## Preserved evidence and failure history

The complete Phase 60 current ledger, Phase 61 registry, separate Toronto operations, separate Phase 55Q Arizona reviews, raw translation inventory and selected-article review data retain their pre-run SHA-256 hashes. Package manifest, lockfile and Astro configuration also retain their pre-run hashes. The coordinator handoff receives only a new leading checkpoint; its preceding text is retained.

No new official-source inspection, source publication date, evidence decision, appointment, operating admission or cycle identity was created. Twenty-one current-ledger receipts still project thirteen primary identities; Toronto and Phase 55Q Arizona remain separate. Source-health checks here concern metadata, not live endpoint verification. No stopped browser automation or human usability/accessibility review was resumed or claimed.

Earlier failed attempts remain in the logs:

| Run directory under outputs/validation | Recorded failure and disposition |
| --- | --- |
| `2026-11-24T02-52-25.531Z-zkrubQ` | Parsed HTML source URLs were compared as raw escaped strings; verifier repaired. |
| `2026-11-24T03-14-28.289Z-Y2O2FS` | A temporary edit of retained translation navigation fields violated the historical whole-file pin. Those edits were fully reverted; the final repair is additive. |
| `2026-11-24T03-17-30.363Z-K0kyE5` | Nevada sitemap dates failed exact revision checks; date projection repaired. |
| `2026-11-24T03-34-53.907Z-sbzfAE` | Projects overview exceeded its card limit; compact directory implemented without relaxing the limit. |

Separate diagnostic runs isolated missing related-receipt contexts, oversized previews and obsolete alias expectations. They are diagnostics, not substitutes for the final full run. Earlier failures are superseded by the successful rerun, not erased.

## Remaining Phase 216 boundaries and next action

The deployment manifest says **Local build validated; editorial and release acceptance held**. Owner acceptance, GitHub publication authority, hosted-deployment authority and public-launch authority remain false; v1 promotion remains Held and Phase 216 completion remains false.

Next work is the applicable release-scope and recoverability/rollback acceptance, an exact dated owner launch decision bound to the candidate and destination, then actual authorized release and thirty real operating days. Any remaining mandatory gate must pass or the release must stay Held; an explicit scope revision cannot be inferred from cleanup approval. Evidence Cycle 001 requires its own completion audit and is not closed by this technical run.

Saved independent evidence appointments remain unchanged: November 25 Amtrak named-asset reliability and NNSA recurring qualified output, November 29 Toronto, December 2 Loudoun policy, and the separate December 21 operations. Reconcile newer saved receipts before any later work.

No commit, push, deployment, public launch, new dependency installation, ACL/security change or new external research occurred in this cleanup/validation turn.
