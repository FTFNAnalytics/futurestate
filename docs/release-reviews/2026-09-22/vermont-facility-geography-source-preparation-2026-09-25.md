# Vermont facility geography: bounded source preparation

September 25, 2026. This research was conducted alongside the frozen Essex municipal candidate's validation. It is not yet an application change, canonical identity decision, accepted place or resolved fab boundary. It follows the [municipal identifier integration](essex-municipal-followthrough-2026-09-25.md) without rewriting its retained original records.

## Acquisition and inspection

The official Vermont DEC [hazardous-waste permitting index](https://dec.vermont.gov/waste-management/hazardous-waste/hazardous-waste-permitting) links the modified GlobalFoundries permit and [section index](https://dec.vermont.gov/waste-management/hazardous-waste/hazardous-waste-permitting/global-foundries-permit). The first Node requests failed certificate validation; the web text reader also returned 403 for those initial URLs. Those failed attempts are preserved, not interpreted as document contents. A separate request using Node's system trust store returned HTTP 200 with TLS verification enabled. The permitted public retrieval used no account, fee or outreach. The planning packet's original `.org` URL redirected to the city's `.gov` domain and returned HTTP 200; a later text-reader request to that final URL failed internally, without invalidating the retained body.

All original bodies, retrieval times, requested/final URLs, bytes and SHA-256 values are retained under `outputs/source-acquisition/2026-09-25-vermont-facility-permit/`. The generated `visual-inspection.json` pins four original PDFs and nine complete inspected page renders. Sources were not edited or re-exported. Read-only text extraction located relevant pages; complete-page visual inspection, using the PDF skill, checked their headings, labels and limitations. This is not a review of every page in the four documents. A first render invocation used the wrong executable directory and failed; the installed Poppler `Library/bin` executable succeeded. Some original fonts produced substitution warnings; relevant inspected text and legends were legible. No PDF repair or whole-document layout certification is claimed.

| Retained source | Bytes / physical pages | Complete pages visually checked | SHA-256 |
| --- | --- | --- | --- |
| `system-ca-attempt/gf-permit-modified-20240903.pdf` | 441,712 / 19 | 1-2 (cover and printed 1 of 18) | `ddcafd3d8699a491182666197e00e062d12f1218e2f54a3f3216ec244a6e1404` |
| `attachments/section-2-facility-description.pdf` | 402,518 / 9 | 1-2 (printed 2-1 and 2-2) | `2be611b0ec1be086a48d52ff10d0e96e1b71efe54fae41b577190d71f68d4ea8` |
| `attachments/appendix-b-facility-description-figures.pdf` | 6,749,792 / 28 | 13 (Figure B6) | `b7834680eba46b712dc57b6006d437f84fd7d7e97ca405c915b4cd43718bab4d` |
| `planning-packet/essex-junction-planning-packet-20250306.pdf` | 8,277,409 / 56 | 5, 7, 11, 13 | `a4bbc441830b36e4b25f12f4a224956bd1374d9345ec88f3d31b291d354e221b` |

Planning page 6 was also rendered, but is not claimed as visually inspected. Discovery-only text on other pages does not extend the visual-review scope. Unneeded personal contact, detailed waste operations and electrical-infrastructure particulars are not proposed for application projection.

## Supported distinctions

The [modified permit](https://dec.vermont.gov/sites/dec/files/wmp/HazWaste/Documents/Permits/Global%20Foundries/GF%20Permit%2C%20Modified%2009032024.pdf) has a September 3, 2024 signed cover. Printed page 1 identifies EPA ID `VTR000524868`, the 1000 River Street facility, a November 18, 2019-November 17, 2029 permit period, and manufacturing/waste-storage findings. These establish the document's facility and stated permit period, not present compliance, current land title or a parcel-level fab footprint.

[Section 2](https://dec.vermont.gov/sites/dec/files/wmp/HazWaste/Documents/Permits/Global%20Foundries/Section%202%20-%20Facility%20Description.pdf), section 2.2, describes historical property on both sides of the Winooski River: manufacturing land west in the Town of Essex and then-Village of Essex Junction, and non-manufacturing buildings east in Williston. Its approximate 729/237/492-acre figures remain source-reported historical descriptions, not accepted current areas or new portfolio entities. Inspected body pages are undated. PDF metadata dates do not establish an authoritative as-of date; the attachment must not inherit the modified permit's 2024 date by association. Section 2.3 points to Figure B6 for major-building geography.

[Appendix B](https://dec.vermont.gov/sites/dec/files/wmp/HazWaste/Documents/Permits/Global%20Foundries/Appendix%20B%20-%20Facility%20Description%20Figures.pdf), physical page 13, contains the complete Figure B6 topographical sheet and building legend. The sheet labels several manufacturing buildings and manufacturing support, but has no verified link to the retained 2026 municipal parcel IDs or SPANs. Preserve historical terminology and map provenance. Neither a filename date nor visual proximity establishes a modern municipal or fab boundary. The other 27 pages were not visually reviewed.

The [March 6, 2025 planning packet](https://www.essexjunction.org/fileadmin/files/Planning_Commission/Meetings/PC_Packet_20250306.pdf) includes a January 29 notice for the proposed 3 MW Essex C Parking Lot Solar project. Physical page 7 uses parcel ID `2002008000` with an Essex Junction location. Page 11 is a preliminary layout expressly not for construction; page 13 is a draft resource map dated October 8, 2024 with an Essex Town heading. Its 26.6-acre study-area label is not the notice's roughly 11-acre array or 228-acre parcel. The map's north arrow, US-feet scale, legends, source footer and qualification notes were inspected. These different labels and extents need reconciliation, not silent normalization. No approval, construction, operation or accepted solar-project identity follows.

## Unresolved reconciliation

The retained 2026 municipal rows separately list Town of Essex parcel `2002008000` and City of Essex Junction parcel `1002008000`, with distinct SPANs and an April 1 owner-name period. The 2025 notice and its differently labeled maps do not authorize changing those original values or choosing which source is wrong. They also do not establish a relationship between the proposed solar footprint and a current fab footprint. Do not conflate this proposal with another solar capacity or a battery project found during discovery.

Required next evidence remains a dated authoritative building/fab-to-parcel crosswalk, accompanied by reconciliation of the notice's parcel/location claim and the maps' municipality labels. A current survey, assessment-linked plan or equally authoritative exact crosswalk would be useful; no such record has yet been verified here. Historical river-side geography is not a substitute. Independent identity/eligibility review and the portfolio counting decision remain separate.

## Next bounded implementation

After the running municipal candidate has terminal validation and source recovery, add one separately dated geographic follow-up to the same four assigned Vermont readings. Project only supported historical geography, located source references and the unresolved municipal/parcel discrepancy. Preserve all preceding geographic payloads and source periods. Do not copy contact, assessment, electrical or waste-unit details; do not create a new entity, accepted boundary, present-title claim or operating-stage advancement.

Add negative fixtures for transferred attachment dates, flattened Town/City identity, erased discrepancy, mismatched physical/printed page numbers, conflated study/array/parcel extents and invented current fab or approval findings. Check exact production placement and exports, then validate and recover the changed candidate. This is a source-supported correction batch, not a substitute for the owner's actual review coordination or any of the six-stage acceptance gates.

No browser/desktop automation was resumed; no push, deployment, publication or new scheduled task occurred. The full goal remains active and its scope unchanged.
