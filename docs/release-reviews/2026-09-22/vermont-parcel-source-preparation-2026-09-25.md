# Vermont parcel identifiers — source preparation, September 25, 2026

This is the next acquisition step for `178-DOSSIER-004`, not a new place dossier, current legal-boundary determination or accepted portfolio count. It follows the [planning-context implementation](vermont-planning-followthrough-2026-09-25.md). The F-15EX validation running during this retrieval is a separate candidate; no parcel input was added to that build.

## Exact public-source result

The [Vermont Agency of Transportation public parcel layer](https://maps.vtrans.vermont.gov/arcgis/rest/services/ROW/Parcels/MapServer/8) exposes parcel and grand-list identifiers. A read-only `UPPER(OWNER1) LIKE '%GLOBALFOUNDRIES%'` query returned three features without a transfer-limit flag. The result is complete for that returned query, not proof of every corporate spelling, secondary owner, leased site or present campus component.

| Returned town name | Parcel ID (`PARCID`) | Grand-list SPAN | `YEAR` / `GLYEAR` |
| --- | --- | --- | --- |
| Williston | `04010.027000` | `759-241-11611` | 2025 / 2025 |
| Essex Town | `2002008000` | `207-067-13089` | 2024 / 2025 |
| Essex Junction | `1002008000` | `208-066-13088` | 2024 / 2025 |

The returned owner strings identify GlobalFoundries U.S. 2 LLC with spacing differences. All three `SOURCEDATE` values are `UNKNOWN` and all three `LOCAPROP` values are null. The description fields distinguish office buildings, land and buildings; they do not identify the relevant fab footprint. The layer metadata labels `GLYEAR` as Grand List Year but gives no descriptive interpretation for `YEAR`; do not silently turn that field into a survey, effective or current ownership date.

This adds precise identifiers, including a third municipality to investigate, without transferring all corporate property into the semiconductor project. No geometry, mailing-address or financial fields were requested. No parcel areas were summed, no current transaction inferred and no municipality/parcel automatically counted as an accepted place.

## Retained evidence

The [capture manifest](../../../outputs/source-acquisition/2026-09-25-vermont-parcel-query/capture.json) retains the exact URL, selected fields, HTTP status and timestamps:

- Layer metadata: HTTP 200 at 19:46:08.604 UTC, 27,860 bytes, SHA-256 `29ba69b46c099589f7a5420d34ac565d81075f64e8e05211ec08d2b5423c683b`.
- Corporate-owner query: HTTP 200 at 19:46:09.773 UTC, 2,959 bytes, SHA-256 `a6664fb2c6604f67b1a07940a518d1dbb493314060cd08bab5e7f99865e58b12`.

The web reader could inspect the layer's field definitions but could not open the query URL. An approved direct public request recovered both JSON responses with TLS verification intact. The local response and schema were inspected; this was not a browser-map or visual boundary review.

## What this enables next

Use the three exact identifiers to inspect the municipal assessor records and establish which parcels contain the named fab and associated project components. A later Williston source was subsequently obtained below; Essex Town and Essex Junction remain 2025 grand-list leads in this preparation. Preserve those source years separately. Obtain a source-located site/parcel crosswalk and separately inspect adopted planning decisions if those decisions are material to the dossier.

Williston's [own map guidance](https://www.town.williston.vt.us/index.asp?SEC=BAA180C9-E7C8-40EF-91F9-AC738664F273&Type=B_BASIC&mobile=false) warns that parcel layers are reference material, may not be current and are not survey/legal-description evidence; it directs discrepancies and current ownership questions to the assessor. The January 2025 solar-notice search result is only a lead: its PDF/site plan has not been inspected in this pass, and no proposed solar footprint or parcel-ID formatting equivalence is adopted from it.

This preparation is not yet a reader-facing application update. Current geographic notes, census admissions and all independent identity fields remain unchanged. No records request, outreach, fee, resumed UI automation or publication occurred.

## Subsequent 2026 Williston row verification

The indexed 2025 owner-list URL failed to download; the web reader confirmed HTTP 404. No PDF was obtained from that obsolete URL and its search excerpt was not adopted as a visually verified record. Following the town's current assessor page instead located the [2026 Grand List by Owner Name](https://willistonvt.govoffice3.com/vertical/Sites/%7BF506B13C-605B-4878-8062-87E5927E49F0%7D/uploads/Grand_List_2026_by_Owner_Name.pdf).

The 123-page PDF was retained with HTTP 200 at 19:49:54.428 UTC: 3,649,674 bytes, SHA-256 `136e779f62bfab69c3241e20d758de9efdfdfb2a916a90152e20dd678070717a`. Physical pages **1 and 43** were rendered and visually inspected in full. Page 1 identifies the town, 2026 list and column headings; page 43 contains the corporate row. Its parcel-ID parts are `04010` / `027000`, owner `GLOBALFOUNDRIES U S 2 LLC`, E911 number `326`, street `IBM ROAD`, SPAN `759-241-11611`. This supports an exact SPAN match to the 2025 state-layer Williston result and supplies a separately dated municipal address record. No tax/valuation figures or neighboring individual-owner records are imported into the dossier.

The [capture](../../../outputs/source-acquisition/2026-09-25-vermont-parcel-query/williston-2026-grand-list-by-owner.pdf.capture.json) and [visual inspection record](../../../outputs/source-acquisition/2026-09-25-vermont-parcel-query/williston-2026-inspection.json) preserve source identity and scope. This is not a full 123-page review or a survey. It does not locate the fab within the parcel, join every campus component to a municipality, resolve a sale or authorize a new accepted place. The source preparation is ready for a separate, bounded reader-facing integration after the current build is verified.

## Next implementation batch

The next local batch can extend the existing geographic follow-up mechanism; it does not need a new registry, map feature or review packet.

1. Add a separately dated parcel-identifier follow-up for the existing `178-DOSSIER-004` dossier. Preserve the entire September 22 note and September 25 planning follow-up unchanged. Retain the query filter, requested fields, source-year limitations, exact three SPANs and the separately verified 2026 Williston row.
2. Render the bounded finding on that dossier and only its three explicit related readings, `178-OVERLAY-02`, `178-OVERLAY-08` and `178-ESSAY-04`, through the established shared notice and index-card summary. Identify Essex Town as a corporate-property lead, not a proven fab municipality. Keep current assessor records for both Essex jurisdictions and the authoritative fab-to-parcel crosswalk as missing artifacts.
3. Add one dated change note and update the existing export/census research references. Leave canonical identities, accepted totals, historical dates, titles and all independent/owner decision fields untouched. Do not import tax figures, unrelated individual owners, geometry or mailing details.
4. Extend source and production checks for exact source hashes, field meanings, separate source years, the selected PDF pages and exact receipt-to-reader mapping. Negative checks should reject a guessed fab boundary, an unsupported present-ownership date, automatic municipality acceptance or transfer to an unrelated dossier.
5. Run focused checks first, then one serialized full changed-candidate sequence. Require terminal success, exact source recovery and refreshed version bindings before calling the batch complete. The preceding F-15EX pass cannot validate these later inputs.

This sequence is prepared work, not implementation already present in the current candidate. No additional source retrieval, outreach, map/browser interaction or release permission is implied by the plan.
