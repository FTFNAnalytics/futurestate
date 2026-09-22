# Phase 208 — Reader navigation, search, and page performance

**State:** In progress — 2,475 shelf families cover the original collections/topic/local/pathway archives, complete Atlas relationships and graph rows, and briefing/signal related reading. All 458 briefings and 744 signals with map backlinks have complete bounded archives; direct briefing citations precede shared-ID maps. Original full narratives, source links, classifications and publication-scoped indexing remain. Source-membership and regression checks pass; three latest templates parse. Production/type/browser checks, rendered budgets and actual reader/assistive-technology trials remain. See the [September 15 reading continuation](../phase-208-reading-navigation-2026-09-15.md) and [earlier Atlas continuation](../phase-208-atlas-navigation-2026-09-15.md).

**September 14 implementation:** See the [current build report](../phase-205-216-build-2026-09-14.md) for concrete artifacts, validation and remaining exits. The original acceptance checklist below is not silently promoted by local implementation.
**Planning date:** September 9; updated September 14, 2026.  
**Current schedule:** [September 14 roadmap revision](../roadmap-next-phases-205-216-2026-09-14.md).  
**Priority:** P1.  
**Accountable roles:** Product/build lead; editorial lead.  
**Effort estimate:** 5–8 engineering/product days.  
**Dependencies:** 205 current-state contract; 206 content types.

## Outcome and reason

The reference now has an article-first renderer for 104 reader bindings, with machine records in secondary inspection views. Broader navigation still needs subject/question journeys, useful search and bounded shelves. The September 9 audit measured Policy and Standards at 3.74 MB and Research at 3.72 MB before compression; remeasure the current build rather than treating those as fresh readings.

## Starting points

- [index.astro](../../app/src/pages/reference/index.astro)
- [[...path].astro](../../app/src/pages/reference/[...path].astro)
- [RegistryDetail.astro](../../app/src/components/review/RegistryDetail.astro)
- [ReferenceArticle.astro](../../app/src/components/review/ReferenceArticle.astro)
- [RegistryHub.astro](../../app/src/components/review/RegistryHub.astro)
- [index.astro](../../app/src/pages/signals/index.astro)

## Work

1. Extend and verify the existing article-first template for topic, question, project and place journeys. Lead with an answer, date, evidence state, dependencies and exact support; preserve the 104 existing bindings rather than rebuilding the prose layer.
2. Move phase numbers, raw IDs, long null-field lists, and machine contracts into secondary inspection views. Preserve canonical identities and historic URLs.
3. Add search and filters across selected content types with useful empty states and shareable query state. Separate external developments from method notes in default results.
4. Paginate or progressively load large topic/research/signal/update lists; retain crawlable navigation and basic no-JavaScript reading.
5. Test five journeys: topic orientation, project stage, place constraints, claim verification, and recent changes. Measure largest pages and keyboard/mobile behavior.

## Acceptance

- [ ] Readers enter through content subjects and questions rather than needing to understand phase numbers.
- [ ] No more than 50 result cards initially render on large shelves; key reader HTML meets the roadmap budget or has a reviewed exception.
- [ ] Search results return the correct canonical record and content type; query/filter state can be revisited.
- [ ] All legacy links resolve, and canonical/sitemap checks remain valid after route changes.
- [ ] Five target readers test all five journeys; at least four complete each without assistance before release acceptance.

## Boundary and handoff

Do not replace the stack or add accounts merely to implement search. Do not render speculative answers to fill empty states.

Record completed work, exact changed artifacts, validation results, unresolved blockers, and the next action. Deliver working content or behavior as applicable, not another empty registry. Continue according to Phase 213's dependencies in the [Phase 205–216 roadmap](../roadmap-next-phases-205-216.md).
