# Assisted reader checks — September 22, 2026

Method: agent-operated Codex in-app browser against the local static output at `http://127.0.0.1:4321/`. No participants, independent reviewer or screen reader took part. The development server timed out; the static fallback was read-only and was not a hosted deployment.

Revised candidate: `fd7833535e0f79c982d49dbb9de3e1c13915f1b3823a7ab42f6c9e71e9460eb5`. Full validation finished at 22:17:04 UTC. Checks ran during and after its deterministic rebuild; the tested article and catalog exports were unchanged by receipt embedding.

| Check | Observed result | Boundary |
| --- | --- | --- |
| Topic orientation | Explore search for Quantum, type Topic, returned the intended edition; its lead separated error-correction results from commercial applications and displayed citations | Assisted navigation, not measured reader comprehension |
| Named project | Toronto + Project returned one dossier, including when searching from catalog page 4; card and article both displayed September 22 | Article retained September 21 evidence dates, permit-query limits and the unresolved 35/14 versus 35/17-storey discrepancy |
| Place constraints | South Australia + Place reached the account separating generation, local network services and customer cohorts | No participant explanation or place-score acceptance tested |
| Claim verification | Signals linked to the classification archive and the 24-test Amtrak record; its corrected presentation identified FTFN adapter tests and retained its feed hold | One sampled corrected claim; not clearance of linked historical material |
| Recent changes | The update search found `208-READER-RECONCILIATION-2026-09-22`; the detail listed the six revised records and affected routes | No new evidence admission, source gate or approval inferred |
| Empty search | A unique nonexistent query produced a no-match message with recovery guidance | No network-failure simulation |
| Clear filters | Keyboard Select All / Backspace cleared the query; All types and Search restored 40 of 137 matches | The automation's empty-string fill did not clear the input; keyboard clearing was observed to work, so no application defect was established |
| Crawlable pagination | Page 4 opened its own URL and displayed 17 entries | Other pagination and no-JavaScript contracts covered by production checks, not a fresh disabled-JavaScript browser run |
| Export consistency | Built `current-editorial.json` deeply equaled the source data | Exact export check, not independent source verification |

Earlier baseline checks established working keyboard skip-link focus on `main-content`, a 16-pixel body font, and 320-pixel Toronto reflow with document width 320. These were not repeated as a full revised-candidate accessibility audit. Browser zoom shortcuts did not demonstrably change magnification: **200% remains untested**, as do assistive-technology behavior, all-route focus contrast and the five-reader threshold.

The homepage HTML shrank from 132,685 to 39,169 bytes (about 70%). It previews six of 178 dependency maps and retains the full archive. The favicon is present. These sizes measure HTML, not total transfer size, loading time or Core Web Vitals.

No critical defect was established in these bounded journeys; this does not establish that the release has no critical accessibility defects. Record actual independent findings using the [reader session sheet](<C:/Users/justi/OneDrive/Documents/NextGen Transportation/docs/release-reviews/2026-09-22/reader-session-sheet.md>).

## Later continuation: observed focus defect and repair

The preceding paragraph describes the earlier journey checks only. A subsequent focused check found a real defect on `/reference/explore/1/`: keyboard Tab from Content type to Search produced `:focus-visible`, but the button's inherited white text color also made its three-pixel outline white on the white panel. The calculated contrast was 1:1. Input/select boundaries used `#d9ddd6`, about 1.38:1 against the white panel.

The shared stylesheet now gives focus an explicit `#084d46` outline, three pixels wide and four pixels offset. Form boundaries use `#5b625f`. Source regressions check the shared selectors and contrast against all three intended panel/surface backgrounds, including negative fixtures for the observed failures.

Browser retest around 22:52–22:53 UTC used the regenerated local output for candidate `75e753c4886b5768b0b8b8400020f7ffa60c462807c1be7d6cd4403fbb865b91` while its complete validation sequence continued. Tab from Content type reached Search; computed `:focus-visible` was true, with `rgb(8, 77, 70) solid 3px` and four-pixel offset. The screenshot visibly showed the ring. Both fields displayed the new border color. Calculated focus contrast against the white panel is about 9.72:1; border contrast is about 6.26:1 against the panel and 6.03:1 against the field surface. These are color calculations, not a whole-page accessibility certification.

The tested stylesheet was `/_astro/BaseLayout.A-W7na4h.css`, SHA-256 `521307103f61c1160b99fead128d5a2e80bccb33f6a6abd2f3ce7bd786298bc3`. After full validation exited 0 at 23:03:07 UTC, a fresh file hash confirmed the final output has those identical stylesheet bytes. This binds the observed styling without pretending the later receipt-only rebuild was a second participant or browser session.

The same browser pass confirmed the Hornsdale catalog card's September 22 revision and new evidence limitation. On `/method/editorial-review/`, all three latest September 22 pilot summaries and their target anchors were present, along with the explicit feature hold and three preserved September 14 extraction disclosures. Clicking the Hornsdale detail link changed the fragment to `#211-HORNSDALE-ACCESS-2026-09-22` and scrolled that receipt to the viewport top.

This resolves the observed search-control focus/boundary defect and verifies the bounded pilot navigation. It does not supply a participant, independent acceptance, all-route focus audit, screen-reader run or demonstrated 200% enlargement. The five-reader matrix remains empty.
