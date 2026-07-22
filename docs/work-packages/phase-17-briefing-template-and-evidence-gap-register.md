# Phase 17 Work Package: Briefing Template and Evidence Gap Register

## Goal

Turn the first evidence-backed briefing into a repeatable editorial workflow and create an evidence gap register that converts missing evidence into future source, signal, local-system, and data-model work.

## Scope

- Confirm Phase 16 as the latest completed phase.
- Extract a reusable briefing template from `Stack Watch 001`.
- Create an evidence gap register for local conversion evidence.
- Map gaps to likely source types, future records, and possible schema fields.
- Update documentation links and review rules.
- Avoid adding new content volume, sources, signals, dependencies, automation, ingestion, or app features.
- Run app validation only if app files change.

## Deliverables

- `docs/briefing-template.md`
- `docs/evidence-gap-register.md`
- Updated `docs/review-checklists.md`
- Updated `docs/content-model.md`
- Updated `docs/documentation-map.md`
- Updated `README.md`
- Updated `docs/master-roadmap.md`
- Updated `docs/decision-log.md`
- Updated `docs/content-expansion-plan.md`
- Updated `docs/session-brief.md`

## Implementation Notes

- The briefing template defines when to write a briefing, how to structure frontmatter, how to structure the body, and which evidence boundaries must be explicit.
- The evidence gap register starts with 10 gaps from Stack Watch 001 and the current local system profiles.
- The content model briefing section now reflects the active app schema by including `record_status` and `captured_date`.
- The briefing checklist now requires missing evidence to be added to the evidence gap register.
- No app files were changed in Phase 17.

## Validation

No app validation was required because Phase 17 changed documentation only.

Latest app baseline remains:

```text
npm run check: passing
npm run build: passing
static pages generated: 63
```

## Acceptance Criteria

- Phase 17 work package exists.
- Briefing template exists.
- Evidence gap register exists.
- Evidence gaps map to future source, signal, local-system, and schema work.
- Review checklist and content model docs reflect briefing workflow lessons.
- README, roadmap, decision log, content expansion plan, documentation map, and session brief are updated.
- No new unsupported claims are added.
- No records are promoted to `Published`.
- Roadmap identifies the next phase.

## Next Phase

Phase 18 should add the first priority source batch from the evidence gap register, focused on local conversion evidence rather than broad content volume.
