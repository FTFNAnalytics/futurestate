# Phase 173 work package — September Closeout and October Opening Ledger

**State:** Build complete locally — live September closeout remains open  
**Prepared cutoff:** 2026-09-01, America/Edmonton  
**Operating boundary:** Calendar work completes only after the real September 27 desk close and all due companion rechecks

## Objective

Create the append-only operating foundation for October without rewriting the September 1 Phase 172 snapshot.

The reusable machinery and complete carryover inventory are delivered now. Acceleration does not make a future source check, desk decision, owner disposition, publication action, or receipt lawful before its actual trigger.

## Delivered build

- `app/src/data/phase-173-september-closeout-october-opening-ledger.json` is the canonical 129-record carryover ledger.
- `app/scripts/lib/phase173-live-projection.mjs` derives live state at any supplied cutoff instead of copying September 1 counts forward.
- `app/scripts/lib/phase173-operators.mjs` supplies pure, idempotent evidence-gate and weekly-closure preflight operators bound to canonical gate and weekly-cycle ledgers.
- `app/scripts/build-phase173-174-control-plane.mjs` creates the Phase 173 and 174 control-plane assets from named upstream registries.
- `app/scripts/assert-phase173-174-control-plane.mjs` enforces the inventory, cutoff, identity, future-state, and intake boundaries.

The September 1 projection contains 84 calendar-controlled records and 45 owner/publication-controlled records. One calendar record is terminal, 83 are future, 40 are owner-held, five are publication-held, and none is silently overdue.

## Exact inventory

| Record class | Count | September 1 state |
| --- | ---: | --- |
| Phase 60 evidence gates | 8 | One terminal; seven future |
| Companion rechecks | 3 | Starlink, Shuttle Landing Facility, and DARPA; all retained as distinct identities |
| Independent Phase 61 project-file rechecks | 1 | Toronto 24 254930 remains future |
| Desk windows | 68 | Four same-cutoff sets of seventeen |
| Weekly edition decisions | 4 | Future; publication result and receipt null |
| Authority dockets | 12 | Owner-held |
| Requirement dockets | 18 | Owner-held |
| Mission dockets | 6 | Owner-held behind requirement sequencing |
| Longitudinal compatibility packets | 3 | Owner-held; eighteen tests remain unperformed |
| Separate zero-series disposition | 1 | Owner-held and excluded from the 36-docket count |
| Publication controls | 5 | Repository, hosting, DNS, launch, and promotion remain Held |

The 36-docket count is always 12 authority + 18 requirement + 6 mission. The separate zero-series disposition produces a combined owner-controlled backlog of 37 only when that broader count is explicitly requested.

## DARPA reconciliation

`173-CARRY-DARPA-2026-09-23` binds the September 23 companion recheck to `60-CYCLE-DARPA-RESULTS` and preserves the August 23 terminal receipt. It has a null future outcome and receipt, adds zero Cycle 001 identities, and can append only a dated correction or bounded No Material Change result after a real check.

## Deliverables

- One canonical carryover ledger for every September evidence gate, companion recheck, desk window, edition decision, owner docket, longitudinal decision, and publication hold.
- A cutoff-aware live-state projection that derives counts from dated records rather than fixed September 1 constants.
- A generalized evidence-gate operator that locks operation/cycle identity, lawful date, exact official-source inventory, propagation targets, candidate digest, dated receipt, and Git-state separation.
- A generalized weekly-closure operator that preserves each September edition's exact due-operation set, freezes the source cutoff, requires all seventeen canonical desk/window pairs and every due operation to be terminal, includes both input sets in its digest, and issues publication or no-publication receipts.
- A reconciled September 23 DARPA companion-recheck state across the calendar and control plane.
- Explicit count semantics: 36 authority/requirement/mission dockets plus one separate zero-series owner disposition.

## Acceptance

- Phase 156, 164, and 172 digests remain unchanged.
- No terminal September record is silently reopened or omitted.
- Every nonterminal record has an exact next action and date or owner trigger.
- Operators are idempotent and refuse future dates, duplicate receipts, mixed identities, and mismatched digests.
- Old snapshot assertions still pass; new live assertions accept lawful later progress.

The local Phase 173–174 assertion covers those requirements directly. Full application build and publication verification remain responsibilities of the integrated October release.

## Boundary

This phase repairs the operating machinery. It creates no later September or October evidence outcome, owner decision, Git release, hosted deployment, or v1 promotion.
