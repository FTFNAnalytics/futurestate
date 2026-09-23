# First source-pinned portfolio census — September 22, 2026

The [machine-readable census](<C:/Users/justi/OneDrive/Documents/NextGen Transportation/docs/release-reviews/2026-09-22/portfolio-census.json>) reconciles explicit project/place identifiers across the listed local registries. It preserves each input's SHA-256, canonical/Atlas identity, aliases, evidence sources, dossier memberships, current article versions and next artifact. It is **not yet a complete accepted-portfolio total**, a new external source check, or an identity/admission decision.

## Findings that change the next work

| Category | Records | Treatment |
| --- | ---: | --- |
| Canonical project identities | 24 | Phase 116/119 identities; repeated biographies, chronicles, cases and global anchors do not create additional projects |
| Canonical place identities | 15 | Phase 116/119 identities; repeated ledgers and dossiers are joined by explicit identifiers |
| Additional editorial project candidates | 2 | ITER and JT-60SA have source-bound identity proposals, but no canonical admission or independent identity decision |
| Additional editorial place candidates | 2 | Saint-Paul-lès-Durance and Naka have source-bound identity proposals; municipality, campus and device remain separate |
| Montana source-project baseline | 32 | Source project IDs are distinct within this cohort; parent/child relationships, dossier eligibility and overlap with the aggregate Montana casebook still need review |
| Phase 178 named place dossiers | 10 | Roseville, Genesee County, Malta, Burlington, Canton, Baytown, Easton, Beaverton, Camas and Yakima Basin need canonical scope/alias reconciliation |
| Phase 185 jurisdiction orientations | 18 | Named national-jurisdiction evidence orientations; not automatically equivalent to accepted place dossiers |
| Phase 191/192 acquisition dockets | 53 | Original null identities remain intact; four now have separately identified editorial candidate overlays |
| Phase 197 target contracts | 48 | Unnamed research targets; none counted as an entity |

These rows are **not additive**. In particular, one aggregate program and its constituent source projects cannot be counted under an unstated rule. Neither page counts nor the 24/15 canonical totals establish accepted full-v1 attainment. The accepted-project/place totals and gaps against 100/70 are deliberately null until this reconciliation and the applicable acceptance decisions occur.

Phase 186 adds repeated Atlas project references, authority contexts and a signal context, not 34 independently established new projects. The broader root-JSON array scan is retained as discovery evidence; it is not an exhaustive semantic census of every nested or prose-mentioned entity. Inactive schema arrays and repeated version/quarter records must not inflate counts.

## Next substantive batch

1. Reconcile the 32 Montana source project IDs against the aggregate program casebook and repeated version/quarter registries. Preserve the source's approved-proposal boundary: no row demonstrates construction, accepted service, adoption or outcomes. Determine the applicable entity-counting rule and independent review before admitting dossiers.
2. Review the ten Phase 178 named places against canonical aliases and their exact geographic units. Keep each associated manufacturing/water project distinct from its municipality or basin; source context alone is not a place-wide outcome.
3. Resolve the four current editorial identity proposals through actual review. Their source references and independent-decision fields are preserved in the census; no proposed canonical IDs are silently installed.
4. Disposition the jurisdiction orientations and remaining discovery matches, then compute a final coverage total and source-acquisition queue. This first pass does not claim those steps are complete.

## Translation and edition scope

The 34 French/Spanish contracts—17 per language—still have null translated content and approval receipts. They require actual translation plus human language/subject review. English presentation variants do not fulfill them.

The broader annual report contract has 17 topic chapters, 12 cross-system findings, 24 named cases and five appendices. Its historical structural inventory is not acceptance of those texts, and the selected four-case field report does not replace it.

## Reproduction and boundaries

From the workspace root:

```powershell
node app/scripts/build-portfolio-census.mjs
node app/scripts/assert-portfolio-census.mjs
node app/scripts/build-portfolio-census.mjs --check
```

All three commands passed. The checks reject duplicate explicit identifiers, project-to-place joins and name-based implicit merges; they preserve unknown acceptance totals, null candidate admissions and untranslated contracts. The freshness check reproduces the exact report and input hashes. No source registry, receipt, promotion gate, public route or review approval is changed by the census tool. This local audit does not require a new published-candidate receipt; source checkpoint verification still checks that the validated candidate digest is unchanged.
