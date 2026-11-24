# Essex municipal parcel sources — September 25, 2026

This is read-only follow-on preparation acquired while the [Vermont parcel candidate](vermont-parcel-followthrough-2026-09-25.md) was frozen for full validation. These workbooks are **not** inputs to that running candidate. They supply exact 2026 municipal identifier checks, not a fab-to-parcel crosswalk, a current-title determination or accepted portfolio entities.

## Official source and period

The [municipal Grand List index](https://www.essexvt.gov/304/Grand-List) links the [Town of Essex 2026 Grand List](https://www.essexvt.gov/DocumentCenter/View/17370/TOWN-OF-ESSEX-2026-GRAND-LIST) and [City of Essex Junction 2026 Grand List](https://www.essexvt.gov/DocumentCenter/View/17374/CITY-OF-ESSEX-JUNCTION-2026-GRAND-LIST). The index says ownership names reflect April 1 of the grand-list year and that the official grand list is filed in the municipal clerk's office. Accordingly, the owner-name period used here is **April 1, 2026**, not the retrieval date or proof of title today. No final-grievance status is inferred from search snippets or a different assessing-page revision.

Public HTTPS GETs, with TLS verification intact, retained the original HTML and both original XLSX files unchanged. All returned HTTP 200. The web text viewer could not display the XLSX sources; this was not treated as proof that the source files were unavailable. Capture details are in [capture.json](../../../outputs/source-acquisition/2026-09-25-essex-grandlists/capture.json).

| Retained file | Retrieval time, UTC | Bytes | SHA-256 |
| --- | --- | ---: | --- |
| `grand-list-index.html` | 2026-09-25 20:31:08.853 | 110,367 | `0f3082f86fe829814c5fb5b1c0c6e19f465da13419d55fc66878cbf99f21a524` |
| `essex-town-2026-grand-list.xlsx` | 2026-09-25 20:31:09.358 | 393,605 | `582dfa1fbade93c6b2fa0f4ea3f0131ec1c3742abb77381ae7afa21de4f09c21` |
| `essex-junction-2026-grand-list.xlsx` | 2026-09-25 20:31:09.575 | 298,499 | `8edac3380e238fade8a42f1afa5a999a6434e31e4f70cbd814a7e470935612a8` |

## Exact inspected records

Both files have a `Sheet1`. The inspected headers are `A1:H1`: PARCEL ID, OWNER NAME 1, OWNER NAME 2, E911 #, E911 # SUFFIX, E911 STREET, TAX MAP #, SPAN #. The narrow identity projection excludes the attention-contact field in column C and the category/assessment fields in columns I–J. No personal attention contact, tax figure or unrelated owner is needed for the application.

| Municipal source | Exact row | Parcel ID (A) | Corporate owner (B) | E911 # / suffix / street (D–F) | Tax-map string (G) | SPAN (H) |
| --- | --- | --- | --- | --- | --- | --- |
| Town of Essex | `Sheet1!A1598:H1598` | `2002008000` | `GLOBALFOUNDRIES US 2 LLC` | `1000` / `1` / `RIVER ST` | `2002008000.` | `207-067-13089` |
| City of Essex Junction | `Sheet1!A1225:H1225` | `1002008000` | `GLOBALFOUNDRIES US 2 LLC` | `1000` / `1` / `RIVER ST` | `1002008000.` | `208-066-13088` |

The two SPANs and parcel IDs match the separately retained state-query records described in the [earlier preparation](vermont-parcel-source-preparation-2026-09-25.md). This is a cross-source identifier match, not proof that all fields or periods in those sources are equivalent. The state query's GLYEAR 2025 and uninterpreted YEAR 2024 are not replaced with 2026. Williston's separate 2026 row remains separate as well.

The Essex records have the same address fields but **different municipality, parcel and SPAN identifiers**. Do not merge them by address, treat Essex Town as another spelling of Essex Junction, or infer that the semiconductor fab occupies both parcels. Preserve the underlying tax-map strings' trailing periods; the source formatting does not show those periods in the rendered cells. That presentation difference is not an identity change.

## Read-only and visual checks

Bundled Artifact Tool imported the workbooks for exact values/formulas and range renders. The inspected A–H rows contain literal values and no formulas. No recalculation, source worksheet edits or workbook export was performed. The original file hashes were checked again afterward and remained exact.

The complete header and target-row renders for both sources were visually inspected. [row-inspection.json](../../../outputs/source-acquisition/2026-09-25-essex-grandlists/row-inspection.json), recorded at 20:36:32.291 UTC, retains the exact read-only observations and render pins. The original scoped source evidence contains column C; the application projection and this report deliberately omit its attention-contact value.

| Source-derived render | Range | SHA-256 |
| --- | --- | --- |
| `town-header.png` | `Sheet1!A1:H1` | `a2035547ab894c7a6d19b332dc0dc95a8c10ab6d567f79ffa6c53faaf61afe38` |
| `town-row.png` | `Sheet1!A1598:H1598` | `2295599213b879fc533ff15bad0c0db75e9dd1f0a6c1dbd78fa306d026be9df2` |
| `junction-header.png` | `Sheet1!A1:H1` | `6d00ace8c1f338945032bba3662627ad0a345c7ede4bcbd5c317a6428c32d7f3` |
| `junction-row.png` | `Sheet1!A1225:H1225` | `22a524ae7875bbdd38028c1ba77e20e41faf2a23747f62ef76ab3f2e82cc3f4d` |

## Next bounded implementation

After the frozen Vermont candidate has a terminal result and exact recovery, add a separately dated municipal follow-up to the same four explicitly related readings and geographic export. Retain both prior follow-ups byte-for-byte. Pin the original source files, exact sheet/cell ranges and April 1 owner-name period. Show the two municipal rows separately; do not overwrite the state query or imply geometry. Regression fixtures should reject transferred years, collapsed municipality/parcel IDs, wrong cells or hashes, imported contact/financial fields and invented title, fab-boundary, campus-completeness or acceptance claims.

This evidence can resolve the narrow request for 2026 Essex municipal parcel-identifier records. An authoritative fab/building-to-parcel crosswalk, legally useful boundaries and any present-title claim still require their own evidence. The bounded search did not obtain such a crosswalk; that does not prove it does not exist. Older lists, draft planning minutes and news/search snippets were not adopted as substitute geography or title evidence.

No canonical place, counting decision, independent review, accepted entity, reader result, language approval, measurement admission or release authority is added. The full six-stage goal remains open. No browser/desktop automation, outreach, fee, push, deployment or publishing was performed.
