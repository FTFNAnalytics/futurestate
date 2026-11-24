# Phase 213 — Accessible reading and language editions

**State:** Accessibility foundations and English reading presentation implemented; rendered, editorial, language and assistive-technology acceptance pending. See the [September 15 reading continuation](../phase-213-reading-editions-2026-09-15.md) for reciprocal format links, original citations, section navigation, exact-source context and preserved historical cutoffs.  

**September 14 implementation:** See the [current build report](../phase-205-216-build-2026-09-14.md) for concrete artifacts, validation and remaining exits. The original acceptance checklist below is not silently promoted by local implementation.
**Planning date:** September 9; updated September 14, 2026.  
**Current schedule:** [September 14 roadmap revision](../roadmap-next-phases-205-216-2026-09-14.md).  
**Priority:** P1 before release.  
**Accountable roles:** Accessibility lead; editorial lead; language/subject reviewers where applicable.  
**Effort estimate:** 3–5 engineering days and 3–5 editorial/reviewer days; translation effort separately scoped.  
**Dependencies:** 208 stable reading templates; reviewed 209/212 content.

## Outcome and reason

Historical Phase 202 retains its 68 contracts without changing its original edition fields. The current reader pack adds seventeen plain-English and seventeen low-bandwidth drafts with an article-first template. Their full current build and accessibility acceptance remain pending; French/Spanish remain held. Neither drafted prose nor shared structure establishes accessible reading.

## Starting points

- [phase-202-accessible-multilingual-low-bandwidth-editions.json](../../app/src/data/phase-202-accessible-multilingual-low-bandwidth-editions.json)
- [phase-204-reader-completion.json](../../app/src/data/phase-204-reader-completion.json)
- [BaseLayout.astro](../../app/src/components/layout/BaseLayout.astro)
- [global.css](../../app/src/styles/global.css)
- [review-checklists.md](../review-checklists.md)

## Work

1. Implement skip navigation, visible keyboard focus, logical headings, descriptive links, table semantics, robust wrapping, and text alternatives as needed.
2. Edit and validate the existing 34 plain-language/low-bandwidth English drafts, beginning with three representative topics, then every topic selected for release. Keep the compact view free of expanded machine records and verify actual generated pages.
3. Test desktop/mobile, keyboard-only use, 200% zoom and narrow reflow, contrast, screen-reader reading order, citations, and data tables.
4. Keep low-bandwidth initial HTML/CSS under the proposed 100 KB transfer budget without required JavaScript, or record a justified exception.
5. If French/Spanish enter scope, produce real text, set correct language metadata, preserve citations, and obtain separate language and subject review. Otherwise maintain explicit holds and scope the English release separately.

## Acceptance

- [ ] Every release-selected topic has rendered plain-language and low-bandwidth content, not a specification.
- [ ] No unresolved critical accessibility defects in tested release routes; findings identify test method, date, route, and resolution.
- [ ] Keyboard and assistive-technology readers can complete the five priority journeys.
- [ ] No translation is labeled approved without the required actual reviewers and receipts.
- [ ] The scope statement names tested routes and methods and does not claim comprehensive certification from automated structure checks.

## Boundary and handoff

Do not use an AI-generated approval or a machine translation as human review. Historical Phase 202 contracts remain historical; new editions use dated current-state records.

Record completed work, exact changed artifacts, validation results, unresolved blockers, and the next action. Deliver working content or behavior as applicable, not another empty registry. Continue according to Phase 215's dependencies in the [Phase 205–216 roadmap](../roadmap-next-phases-205-216.md).
