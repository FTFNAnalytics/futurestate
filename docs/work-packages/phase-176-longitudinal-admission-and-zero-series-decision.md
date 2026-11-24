# Phase 176 work package — Longitudinal Admission and Zero-Series Decision

- **State:** Preparation complete locally — evidence and owner outcomes held
- **Prepared:** 2026-09-01
- **Target window:** 2026-10-12 through 2026-10-18; may operate earlier under the governed review sequence
- **Local asset:** `app/src/data/phase-176-longitudinal-admission-and-zero-series-decision.json`

## Objective

Prepare the complete governed decision on whether FTFN can admit any of three named longitudinal pilots while preserving an honest, separately owner-gated zero-series public boundary. The build creates no observation, compatibility result, admission, trend, comparison, or owner outcome.

## Delivered contract

| Measure | Count |
| --- | ---: |
| complete prepared packets | 4 |
| pilot-admission packets | 3 |
| compatibility-test decisions | 18 |
| terminal compatibility-test decisions | 0 |
| six-row provenance tables | 3 |
| provenance rows | 18 |
| pilot-admission decisions | 3 |
| admitted series | 0 |
| observations transferred | 0 |
| separate zero-series owner dispositions | 1 |
| terminal zero-series owner dispositions | 0 |
| review HTML routes | 5 |
| detail routes | 4 |
| JSON exports | 1 |

Each pilot packet binds its exact Phase 160 matrix ID, Phase 169 adjudication-packet ID, record digests, entity identity, legacy-panel identity, and unchanged series-definition digest. The declared legacy observation count is retained only as upstream inventory; no value is copied into Phase 176.

The prepared review surface is `/review/v1oct/longitudinal-decisions/`, with one detail route for each pilot and one for the zero-series disposition. The declared export is `/data/phase-176-longitudinal-admission-and-zero-series-decision.json`. Route availability does not supply a compatibility, admission, or owner outcome.

## Compatibility and provenance

The 18 decision cells preserve the six inherited compatibility dimensions for each pilot:

1. identity;
2. period;
3. measure;
4. denominator;
5. revision lineage; and
6. dual review.

Every cell has an inherited state and reason, allowed dispositions, a decisive next action, and null compatibility outcome, date, receipt, reviewers, and rationale.

Each pilot also has a six-row provenance table covering identity, denominator, period, method, revision policy, and missingness. When the bound records do not supply a governed value or policy, the field is null and the exact evidence still required is stated. Missing, unavailable, suppressed, revised, and incompatible values are never replaced by zero.

## Admission sequence

```text
six terminal compatibility decisions
        ↓
one pilot admission, rejection, or carry receipt
        ↓
admit values only if every test passes under dual control

if no pilot qualifies
        ↓
one separate owner receipt accepting, declining, or carrying
the disclosed zero-series public boundary
```

The pilot-admission decisions are governed evidence-review decisions. The zero-series public-boundary disposition is the only Phase 176 item counted as an owner-controlled action.

## Count semantics

- Phase 176 has 18 compatibility-test decisions plus three pilot-admission decisions: **21 governed evidence-review decisions**.
- Its zero-series public-boundary disposition is **one separate owner action**.
- Combined with Phase 175, the owner-controlled backlog is **36 + 1 = 37**.
- The 21 governed evidence-review decisions are reported separately and never inflate that owner backlog.

## Public method note

The prepared method note explains why incompatible observations are not pooled:

- a shared label does not prove stable identity;
- period, measure, method, and denominator changes require compatibility or a visible break;
- revision lineage and dual review must bind the exact proposed observation set;
- missing or incompatible data is not zero; and
- a public zero-series statement requires its own dated owner receipt if no pilot qualifies.

## Schema

The schema-1.0 local registry exposes:

- `immutable_baseline_bindings`
- `digest_contract`
- `upstream_file_bindings`
- `routes`
- `counts`
- `counting_contract`
- `compatibility_dimension_contract`
- `provenance_dimension_contract`
- `pilot_admission_packets`
- `zero_series_owner_disposition`
- `public_method_note`
- `publication_state`
- `next_action`
- `public_html_routes`
- `public_json_exports`

## Acceptance

- Exactly three pilots carry six unique compatibility-decision identities each.
- The hub plus four detail routes are unique and the public export inventory contains exactly one path.
- Phase 160 and 169 series-definition and boundary digests match exactly.
- Every compatibility, admission, publication, and zero-series outcome remains null.
- No observation transfers before all six tests pass and a valid pilot receipt exists.
- Revision breaks, method changes, denominator changes, and missingness remain visible.
- The zero-series disposition remains separate from Phase 175 and v1 promotion.
- The immutable Phase 156, 164, and 172 receipt IDs and artifact digests remain unchanged.

## Remaining gates

Preparation is complete and is not calendar-gated. The 18 tests still require dated dual-control review, each pilot still requires its own terminal admission/rejection/carry receipt, and the zero-series public boundary still requires a separate owner receipt if no pilot is admitted. Publication and repository authority remain separate.
