# NNSA capacity source: local PDF visual follow-through

Actual inspection date: September 24, 2026, America/Edmonton. This is an assisted source check, not independent acceptance or a new cycle decision.

## Result

The retained DOE/EIS-0573 Volume 1 PDF is available locally. Physical pages 1 and 2 were both opened as rendered images and visually inspected in full. The cover and cover sheet are legible, with no clipping or overlap obstructing the administrative text reviewed. Matching text was read directly from the PDF using pypdf with UTF-8 output. The PDF contains 259 physical pages; only the two relevant pages were inspected.

This resolves the **Volume 1 cover/cover-sheet visual-access limitation** in the [earlier September 24 operation report](../../phase-207-nnsa-capacity-recheck-2026-09-24.md). A subsequent successful direct retrieval and local rendering in this same follow-through also resolves the separate hearing-poster image limitation, as recorded below. Earlier failed web-image and download attempts remain historical observations, not reasons to describe the now-inspected pages as unavailable.

Neither source PDF was edited or re-exported. Existing Volume 1 renders were inspected and the newly captured poster was rendered locally; no browser or desktop automation was resumed. No application input or original receipt was changed while full validation was running.

## Located observations

| Physical PDF page | Visible evidence | Bounded interpretation |
| --- | --- | --- |
| 1 | DOE/EIS-0573; April 2026; Draft; Volume 1; Programmatic Environmental Impact Statement; DOE/NNSA attribution | Confirms the retained document's identity, date and draft environmental-review status |
| 2 | Cover Sheet heading, responsible agency/title/location, Abstract, Public and Tribal Involvement, and April 2026 footer | Describes the proposed action's environmental assessment and prospective final-PEIS/Record-of-Decision process; not an operating-capacity acceptance instrument |

The complete relevant pages, including their headings, contact box and footer, were visible. The contact details were not used. No signature verification, legal-compliance determination, full-document review, technical production-method assessment, accepted-capacity finding or current-output estimate was performed.

The cover sheet's approximate document-length wording is not substituted for the independently observed 259-page PDF count. Its prospective administrative language describes this April draft; it is not proof of agency status after that date. It cannot prove that a separate final or acceptance record does not exist.

## Hearing-poster access recovery

The [official hearing-poster document endpoint](https://www.energy.gov/documents/doeeis-0573-public-hearing-timeline-poster-may-2026) returned its PDF directly: HTTP 200, 262,480 bytes. The successful request used normal TLS verification and followed the official endpoint's redirects. This replaces neither the saved failed attempts nor their earlier receipt.

The single-page poster was rendered with bundled Poppler at a 2,400-pixel maximum dimension and inspected in full at original image detail. The title, timeline positions, date labels, lower commitment panel and agency footer were legible. Its April 17–July 16, 2026 draft-review interval and May 2026 public-hearing label are distinct; the right-hand final-PEIS/Record-of-Decision position is marked early 2027. The draft-review position's present-tense marker belongs to the poster, not the September inspection date.

These are a published administrative timeline and stated commitments, not proof that a milestone occurred, a current delivery forecast, a legal finding or accepted operating capacity. No technical process detail was extracted. The original receipt's decision remains unchanged.

## Exact local evidence

Original source URL: [DOE Volume 1 draft PDF](https://www.energy.gov/sites/default/files/2026-04/draft-eis-0573-plutonium-pit-production-vol-1-2026-04.pdf).

Local artifact directory: `outputs/source-acquisition/2026-09-24-nnsa-accepted-capacity/`, relative to the workspace root. The first three files existed before this follow-through and were hashed again during inspection. The final two were acquired/rendered during it.

| File | Bytes | SHA-256 |
| --- | ---: | --- |
| `draft-eis-0573-volume-1.pdf` | 5,846,264 | `6f1371df82df3bdfbb9f369f8e11bcb4c8e9129cfd3a77dd4911cc81188a9178` |
| `page-001.png` | 681,953 | `837d372fdd7918888571c1a55100211696d1ccbfcac3b90b81d056d3f6b24b40` |
| `page-002.png` | 460,704 | `ad79d0d18d3a51cae97fbf8f33ee5b4611c5ffec1a13c95803926d648b8e2f72` |
| `hearing-timeline-poster.pdf` | 262,480 | `2ff6c444955bac17be6cf2cb46c2e8acfbb0b8508fcd0610cbb4dd5d9c45403b` |
| `hearing-timeline-poster.png` | 555,313 | `7c89dd5c2d8bc75463bcb1737e26363cc5504de60cece4b2642bf45d24260e73` |

The renderer's earlier fallback-font warnings did not obscure the observed administrative content. This is a visual readability check of the actual images, not a claim of pixel-identical rendering on other systems. Read-only pypdf extraction and the rendered images agree on the identity, date and draft status.

## Gate and implementation boundary

This evidence belongs with `60-CYCLE-NNSA-ACCEPTED-CAPACITY`, `58-QUEUE-NNSA-ACCEPTED-CAPACITY` and `67-RETURN-010`. It changes neither a cycle decision nor the signal's In Review state. It supplies no human reviewer, accepted operating configuration, qualified-output ledger, measurement series or release authority. GAO-baseline and recurring-rate decisions remain distinct.

Do not mutate a historical receipt to imply that this visual inspection occurred during its earlier failed request. A subsequent reader-facing integration must identify this as a later assisted inspection, preserve the earlier receipt and its failed-access history, and undergo changed-candidate validation if application inputs change. Both local visual gaps are now resolved for these exact bytes; independent review and the required capacity artifact are not. This documentation-only follow-through requires local link/hash checks, not a competing production build.

The full six-stage acceptance requirements in the [current execution plan](../../next-build-execution-plan-2026-09-24.md) remain open. The immediate useful result is a verified source locator and removal of one known inspection gap, not capacity admission or whole-corpus approval.
