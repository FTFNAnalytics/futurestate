# Signal Repair Workflow

Date: 2026-07-21

This workflow defines how FTFN repairs broad `In Review` records into dated, source-backed signal records for v0.2.

## Goal

Turn general source frames into records that answer:

```text
What changed, when, according to which source, and what does that evidence actually prove?
```

## Repair States

Use these editorial states during repair:

| State | Meaning |
| --- | --- |
| Source Frame | Existing record explains a source or system but is not tied to a dated change. |
| Needs Source Recheck | Source is stale, review due, or not yet manually inspected. |
| Evidence Selected | A specific source item, table, docket, document, advisory, or update has been selected. |
| Repair Draft | Signal copy is being rewritten or split into a new dated record. |
| In Review | Signal is valid enough for the research shelf but not approved for publication. |
| Publication Candidate | Signal appears ready for final source/copy/caveat review. |
| Published | Signal passed publication review and has a publication date. |
| Needs Update | Published or reviewed signal is stale or superseded. |
| Archived | Record should no longer be treated as an active signal. |

## Step 1: Classify The Existing Record

For each `In Review` signal, decide whether it is:

- a dated update,
- a source frame,
- a local constraint map,
- a company-claim sample,
- a stale record,
- a candidate for splitting into multiple records.

Most current `In Review` records are source frames. That means the right move is usually to split out a new dated signal rather than force the old record to act like news.

## Step 2: Select Evidence

Before drafting, select one primary evidence item:

- official release,
- dataset release,
- docket document,
- filing,
- advisory,
- standard,
- report,
- local permit/application/provider record.

The evidence item must have:

- source ID,
- source URL,
- event or release date,
- checked date,
- evidence quality,
- claim boundary.

## Step 3: Decide Repair Type

Choose one:

| Repair Type | Use When | Result |
| --- | --- | --- |
| Refresh existing signal | Same source, same claim, current update supersedes older version. | Existing record gets revised and remains one signal. |
| Split into dated signal | Old record is a broad source frame and new evidence is a specific update. | New signal is created; old record may stay as In Review or move to Needs Follow-Up. |
| Convert to reference frame | Record is useful but not a signal. | Keep In Review or move content into source/topic/local-system context. |
| Archive/de-emphasize | Record relies on weak company claim or stale framing. | Move to Archived or keep Draft Sample out of authority surfaces. |

## Step 4: Draft The Claim

Use a narrow claim:

```text
[Source] [released/updated/filed/issued] [specific item] on [date], changing FTFN's evidence posture for [topic/system] by [bounded implication].
```

Avoid:

- "proves readiness",
- "confirms growth can be served",
- "shows deployment is imminent",
- "solves the constraint",
- "establishes market viability".

## Step 5: Set Metadata

Each repaired signal needs:

- `record_status`
- `published_date`
- `captured_date`
- `primary_topic`
- `framework_layers`
- `signal_type`
- `maturity_level`
- `time_horizon`
- `evidence_quality`
- `verification_status`
- `source_ids`
- `claim_scope`
- `local_evidence_level`
- `last_reviewed_date`
- `evidence_gap_ids` where relevant

Publication candidates should usually start as:

```text
record_status: "In Review"
verification_status: "Verified Against Primary Source"
published_date: null
```

Only final publication review should set:

```text
record_status: "Published"
published_date: YYYY-MM-DD
```

## Step 6: Write The Evidence Boundary

Every repaired signal must explicitly say:

- what the source supports,
- what the source does not prove,
- what additional evidence would change the conclusion,
- whether local interpretation is general, local-source-backed, specific-record-backed, or still missing.

## Step 7: Run The Gates

Before merging a repaired signal:

```text
npm.cmd run validate:content
npm.cmd run source:health
npm.cmd run check
npm.cmd run build
```

If only docs changed, validation/build can wait. If app content changed, run all gates.

## First v0.2 Repair Batch

| Existing Record | Repair Direction | Required Evidence |
| --- | --- | --- |
| NOAA ENSO signal | Refresh or split into July 2026 dated signal. | 9 July 2026 NOAA CPC ENSO Diagnostic Discussion. |
| CHIPS source-frame signal | Split into specific award/facility/program milestone. | CHIPS award announcement plus local/company/filing context if capacity claims are made. |
| FAA AAM signal | Split into specific FAA document/regulatory action. | FAA DRS/AAM document or certification action. |
| NHTSA AV signal | Split into specific safety/reporting update. | NHTSA SGO or official datasets/API update. |
| NASA Artemis signal | Split into specific mission/procurement/schedule/hardware update. | NASA Artemis/TechPort/NTRS/official mission source. |
| USDA plant genomics signal | Split into specific grant/research/data/program update. | USDA NIFA/NASS/APHIS or official research source. |
| AI-grid signal | Split into specific source update or regional grid evidence. | EIA, NERC, FERC, DOE, utility planning, or data-center filing evidence. |
| Arizona power signal | Split into named utility planning/docket record. | ACC eDocket, ACC IRP, ACC BTA, APS/SRP/TEP planning. |
| Arizona water signal | Split into named provider/governance/local record. | ADWR, CAP, Phoenix water, SRP water, or provider record. |
| Ontario permits/completions signal | Split into specific release/geography/municipal conversion record. | StatCan WDS, CMHC starts/completions, Toronto AIC, Toronto permits, Ontario tracker. |

## Publication Candidate Rule

A repaired signal becomes a publication candidate only when:

- it is dated,
- it is source-current,
- it has one narrow claim,
- it has clear evidence limits,
- related source records are current enough,
- it does not rely on a source category that the record itself says is insufficient.
