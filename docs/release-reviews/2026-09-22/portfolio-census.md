# Source-pinned portfolio census — September 22, 2026

The [machine-readable census](<C:/Users/justi/OneDrive/Documents/NextGen Transportation/docs/release-reviews/2026-09-22/portfolio-census.json>) reconciles explicit project/place identifiers across the listed local registries. It preserves each input's SHA-256, canonical/Atlas identity, aliases, evidence sources, dossier memberships, current article versions and next artifact. The second pass adds a retained Montana CSV reconciliation and ten dated primary-source location notes. It is **not yet a complete accepted-portfolio total** or an identity/admission decision.

## Findings that change the next work

| Category | Records | Treatment |
| --- | ---: | --- |
| Canonical project identities | 24 | Phase 116/119 identities; repeated biographies, chronicles, cases and global anchors do not create additional projects |
| Canonical place identities | 15 | Phase 116/119 identities; repeated ledgers and dossiers are joined by explicit identifiers |
| Additional editorial project candidates | 2 | ITER and JT-60SA have source-bound identity proposals, but no canonical admission or independent identity decision |
| Additional editorial place candidates | 2 | Saint-Paul-lès-Durance and Naka have source-bound identity proposals; municipality, campus and device remain separate |
| Montana source-project baseline | 32 | Exact IDs reconcile across 768 registry rows and the retained official CSV; aggregate/child counting and dossier eligibility remain unapproved |
| Phase 178 named place dossiers | 10 | Nine primary HTML sources checked; dated geographic/source-period notes added. Exact geographic registration and independent acceptance remain open |
| Phase 185 jurisdiction orientations | 18 | Seventeen national and one supranational (EU) orientations; exact joins to 72 authority rails verified, but place-coverage eligibility is not approved |
| Phase 191/192 acquisition dockets | 53 | Original null identities remain intact; four now have separately identified editorial candidate overlays |
| Phase 197 target contracts | 48 | Unnamed research targets; none counted as an entity |

These rows are **not additive**. In particular, one aggregate program and its constituent source projects cannot be counted under an unstated rule. Neither page counts nor the 24/15 canonical totals establish accepted full-v1 attainment. The accepted-project/place totals and gaps against 100/70 are deliberately null until this reconciliation and the applicable acceptance decisions occur.

Phase 186 adds repeated Atlas project references, authority contexts and a signal context, not 34 independently established new projects. The broader root-JSON array scan is retained as discovery evidence; it is not an exhaustive semantic census of every nested or prose-mentioned entity. Inactive schema arrays and repeated version/quarter records must not inflate counts.

## Montana source and repeated-row reconciliation

The [retained official project CSV](<C:/Users/justi/OneDrive/Documents/NextGen Transportation/docs/release-reviews/2026-09-22/evidence/fp_deployment_projects-1.5.26.csv>) is byte-identical to the September 22 capture from [Montana's project dataset](https://doa.mt.gov/_docs/connectmt/fp_deployment_projects-1.5.26.csv): 12,807 bytes, SHA-256 `5339c206b44c6d7c6196869d5945318ce05a1046fa772ac3e4f2f2839fbe98d2`. Read-only spreadsheet import found 32 rows, 23 columns and nineteen distinct UEIs. The [analysis record](<C:/Users/justi/OneDrive/Documents/NextGen Transportation/docs/release-reviews/2026-09-22/evidence/montana-csv-reconciliation.json>) retains exact source row numbers, original names, estimated dates and the two checked funding fields.

All project IDs, UEIs, BEAD-support values and subgrantee-match values agree with Phase 57G. Five names differ only by outer whitespace or an en dash versus ASCII hyphen; both forms are retained. Numeric fields were checked for nonempty numeric content before conversion, so a missing value could not pass as zero. No location-level or CAI file was acquired in this pass. Estimated dates remain estimates, not new award or performance events.

The registry join covers 32 Phase 57G project rows, 32 Phase 57H version rows, 32 Phase 57I intake envelopes, 32 Phase 57J rejected test envelopes, 416 Phase 57K compatibility cells and 224 Phase 57K requirement checks. These **768 rows map to 32 project IDs**, not 768 projects. The reporting rails are two LEO and thirty terrestrial records. Current project-quarter, service, adoption and acceptance fields remain null; control/test rows do not create observations.

The existing `119-PROJECT-023` / `casebook-montana-bead-completed-quarter` is retained as shared program context. The proposed counting rule assesses distinct source projects separately for substantive dossier eligibility and never sums an aggregate and its children without an explicit decision. The actual counting decision, individual admissions and accepted totals remain null.

## Place source reconciliation

The [dated place findings](<C:/Users/justi/OneDrive/Documents/NextGen Transportation/app/src/data/place-identity-reviews.json>) and [implementation report](<C:/Users/justi/OneDrive/Documents/NextGen Transportation/docs/release-reviews/2026-09-22/portfolio-identity-review.md>) distinguish manufacturing sites, locality labels, Genesee County and the Yakima basin. GlobalFoundries' Burlington source label and Essex Junction address now have an explicit reader-facing clarification; the whole campus boundary is not inferred. The archival January 2025 proposals and August 2026 forecast do not become current outcome observations. Original Phase 178 bytes, IDs and routes are retained.

## Next substantive batch

1. Resolve the proposed Montana parent/child counting rule and individual dossier eligibility. The exact source/repeated-row join is complete for the listed layers, but no row demonstrates construction, accepted service, adoption or outcomes.
2. Acquire the specific missing geographic artifacts listed in the ten source notes, then obtain canonical identity/eligibility review. A site address or county/basin label alone does not establish a municipal boundary or a place-wide outcome.
3. Resolve the four current editorial identity proposals through actual review. Their source references and independent-decision fields are preserved in the census; no proposed canonical IDs are silently installed.
4. Disposition the jurisdiction orientations and remaining discovery matches, then compute a final coverage total and source-acquisition queue. This first pass does not claim those steps are complete.

## Translation and edition scope

The 34 French/Spanish contracts—17 per language—still have null translated content and approval receipts. They require actual translation plus human language/subject review. English presentation variants do not fulfill them.

The broader annual report contract has 17 topic chapters, 12 cross-system findings, 24 named cases and five appendices. **All 58 already have September 10 reader drafts**, each retaining the September 1 evidence cutoff and an independent-subject-review-pending state. The census now binds every annual record to that draft's ID, exact payload hash, source IDs and review status. The work is substantive assessment and correction of existing drafts, not writing 58 absent documents. This inventory is not a complete claim review; separate source-context notices must also be considered during that review. The selected four-case field report does not replace this annual package.

## Reproduction and boundaries

From the workspace root:

```powershell
node app/scripts/build-portfolio-census.mjs
node app/scripts/assert-portfolio-census.mjs
node app/scripts/build-portfolio-census.mjs --check
```

All three commands passed for the expanded report. Negative fixtures reject missing/duplicate project rows, changed UEIs/amounts, missing numeric values, unknown IDs and unexpected admitted observations. Existing checks reject project-to-place and name-based implicit merges and preserve unknown acceptance totals, null admissions and untranslated contracts. The freshness check reproduces the census from pinned source files and the retained CSV-analysis record; it is not a new network acquisition or a rerun of the spreadsheet import.

The CSV analysis used the bundled spreadsheet runtime and `Workbook.fromCSV`, with a compact source-range inspection and exact keyed comparisons. It did not edit or export a workbook. The source CSV is preserved unchanged, including its BOM/header and source names. The census itself remains a local audit; the separate reader-facing place changes require their own full candidate validation. Do not reuse the earlier candidate's receipt for those changes.
