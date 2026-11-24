import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
export const austriaHousingCitiesHash=value=>createHash('sha256').update(JSON.stringify(value)).digest('hex');
export function assertAustriaHousingCitiesDossiers(data,review){
  assert.equal(data.inspected_date,'2026-11-22');assert.equal(data.timezone,'America/Edmonton');
  assert.equal(data.review_policy,'OWNER-AUTHORIZED-AI-REVIEW-2026-09-25');
  assert.equal(review.policy_id,data.review_policy);assert.equal(review.review_date,data.inspected_date);
  assert.equal(data.independent_review,false);assert.equal(data.phase_60_identity_added,false);
  for(const key of ['independent_review','publication_authorized','launch_authorized','phase_216_complete'])assert.equal(review[key],false);
  assert.deepEqual(data.records.map(r=>r.record_id),["project-seestadt-aspern","place-vienna","place-graz"],'Exact record_id boundary changed');
  assert.deepEqual(data.records.map(r=>r.kind),['Project','Place','Place']);
  assert.equal(new Set(data.records.map(r=>r.route)).size,3);
  assert.equal(data.sources.length,15);const ids=new Set(data.sources.map(s=>s.id));assert.equal(ids.size,15);
  const validPeriod=date=>{assert(/^\d{4}(-\d{2}){0,2}$/.test(date));const full=date.length===4?`${date}-01-01`:date.length===7?`${date}-01`:date;assert.equal(new Date(`${full}T00:00:00Z`).toISOString().slice(0,10),full);};
  for(const s of data.sources){
    assert.equal(new URL(s.url).protocol,'https:');assert(s.publisher&&s.role&&s.locator&&s.inspection&&s.boundary&&s.language&&s.interpretation_note);
    assert(Object.hasOwn(s,'publication_date'));
    for(const [key,date] of Object.entries(s).filter(([k])=>k.endsWith('_date')))if(date!==null){assert.equal(date.length,10);validPeriod(date);if(key!=='effective_date')assert(date<=data.inspected_date);}
    if(s.publication_period){validPeriod(s.publication_period);assert(s.publication_period.length<=7);assert(s.publication_period<=data.inspected_date);assert.equal(s.publication_date,null);assert(s.period_basis);}
  }
  for(const r of data.records){
    assert.equal(r.identity_decision.eligible_count,1);assert(r.identity_decision.rationale.length>150);
    assert.equal(r.sections.length,6);assert.equal(new Set(r.sections.map(s=>s.heading)).size,6);
    assert(r.sections.map(s=>s.text).join(' ').split(/\s+/).length>=500);
    for(const s of r.sections){assert(s.heading&&s.text.length>200);assert(s.source_ids.every(id=>ids.has(id)));if(!s.source_ids.length)assert.equal(s.claim_type,'Editorial evidence test');}
    assert(r.timeline.length>=3);let previous='';
    for(const item of r.timeline){validPeriod(item.date);assert(item.date<=data.inspected_date&&item.date>=previous);previous=item.date;assert(item.event&&item.source_ids.length&&item.source_ids.every(id=>ids.has(id)));}
    assert(r.next_artifacts.length>=3);assert(r.related.every(link=>/^\/atlas\/[a-z0-9/-]+\/$/.test(link.route)));
    assert.equal(review.records.find(d=>d.record_id===r.record_id)?.sha256,austriaHousingCitiesHash(r),'Article changed after exact-version review');
  }
  assert.deepEqual(data.records.map(r=>r.scope),["One phased urban-development programme on the former Aspern airfield within Vienna. Housing plots, schools, parks and collective-housing groups are components, not additional counted projects. The wider Donaustadt district and Vienna municipality are separate territorial scopes.","One Vienna municipal place. Municipal housing estates and individual water works illustrate its service systems, not additional counted places or projects in this group. Alpine water catchments and the wider metropolitan region are dependencies outside this territorial identity.","One municipality of Graz. Its housing services and municipal-group energy programme are local-system evidence; the treatment plant in Gössendorf also serves surrounding municipalities. Neither the regional wastewater catchment nor all House Graz organizational assets define extra counted places."],'Exact scope boundary changed');
  assert.deepEqual(data.records.map(r=>r.stage),["Occupied housing and established education services coexist with continuing development and future school and energy proposals. Developer descriptions establish bounded provision and objectives, not final district completion or independently measured social and climate outcomes.","Municipal housing stock and allocation procedures, an August renovation programme and March/November water-service notices are documented. Programme totals, completed works, future commissioning and individual access remain distinct; no composite city score or universal service guarantee.","Municipal housing procedures, occupied Puntigam homes and a dated sales-suspension reference are documented. Wastewater expansion and solar programme targets remain distinct from operating capacity and measured outcomes; no composite place score or regional capacity assigned solely to municipal residents."],'Exact stage boundary changed');
  assert.deepEqual(data.records.map(r=>r.route),["/atlas/projects/seestadt-aspern/","/atlas/places/vienna/","/atlas/places/graz/"],'Exact route boundary changed');
  assert.deepEqual(data.records.map(r=>r.aliases),[["aspern Seestadt","Seestadt Wien","Aspern urban development","aspern Die Seestadt Wiens"],["Wien","City of Vienna","Vienna municipality","Stadt Wien"],["Stadt Graz","Graz municipality","City of Graz","Landeshauptstadt Graz"]],'Exact aliases boundary changed');
  assert.deepEqual(data.records.map(r=>r.timeline),[[{"date":"2014","event":"The developer dates the first pioneer residents, including collective-housing groups, to autumn 2014.","source_ids":["aspern-groups"]},{"date":"2015","event":"The education account dates the first campus's provision to 2015.","source_ids":["aspern-education"]},{"date":"2017","event":"The education account records the addition of the Bundesgymnasium in 2017.","source_ids":["aspern-education"]},{"date":"2021","event":"The second named education campus and two additional collective-housing projects are recorded for 2021.","source_ids":["aspern-education","aspern-groups"]}],[{"date":"2022-03","event":"The November 2026 fourth-main notice identifies March 2022 as the start of its construction period.","source_ids":["vienna-main"]},{"date":"2026-03-05","event":"The city reports seasonal aqueduct maintenance and the use of alternative supplies during shutdown.","source_ids":["vienna-maintenance"]},{"date":"2026-08-12","event":"Wiener Wohnen publishes active and completed renovation programme figures.","source_ids":["vienna-renewal"]},{"date":"2026-11-15","event":"The fourth-main notice reports flushing and analysis before release, with December commissioning still prospective.","source_ids":["vienna-main"]}],[{"date":"2015-06-18","event":"The municipal property page cites the council decision suspending apartment-sales guidelines.","source_ids":["graz-retention"]},{"date":"2024-03","event":"Holding Graz reports environmental-assessment approval of the wastewater expansion in March 2024.","source_ids":["graz-wastewater"]},{"date":"2025-12-23","event":"The solar interim report separates 21 completed arrays from fourteen approaching completion.","source_ids":["graz-solar"]},{"date":"2026-04-24","event":"The city reports twenty Puntigam apartments occupied earlier in April and describes their shared amenities.","source_ids":["graz-puntigam"]}]],'Exact timeline boundary changed');
  assert.deepEqual(data.records.map(r=>r.sections.map(s=>s.source_ids)),[[["aspern-vision"],["aspern-groups"],["aspern-education"],["aspern-climate"],["aspern-responsibility"],[]],[["vienna-stock"],["vienna-access"],["vienna-renewal"],["vienna-maintenance"],["vienna-main"],[]],[["graz-allocation"],["graz-puntigam"],["graz-retention"],["graz-wastewater"],["graz-solar"],[]]],'Claim-to-source bindings changed');
  for(const r of data.records)assert(!Object.hasOwn(r,'historical_acquisition'),'New Austrian identity must not reuse a historical country docket');
  for(const [ri,si,phrase] of austriaHousingCitiesCriticalPhrases)assert(data.records[ri].sections[si].text.includes(phrase),'Missing bounded claim: '+phrase);
  assert.deepEqual(data.sources,[{"id":"aspern-vision","title":"Vision for aspern Seestadt","publisher":"Wien 3420 aspern Development AG","role":"Developer's development scope","url":"https://www.aspern-seestadt.at/de/seestadt/vision","publication_date":null,"language":"German","interpretation_note":"German text interpreted and self-reviewed by Codex under the owner-authorized AI policy; no independent language review claimed.","locator":"Vision, multifunctional district and staged-development sections","access_mode":"HTML body","inspection":"Specified official HTML body inspected on 2026-11-22; linked files, forms, maps and live services were not tested","boundary":"2030s population and employment/training figures are development aims, not current occupancy."},{"id":"aspern-groups","title":"Collective housing in Seestadt","publisher":"Wien 3420 aspern Development AG","role":"Developer's housing-form and occupancy account","url":"https://www.aspern-seestadt.at/de/leben/wohnen/baugruppen","publication_date":null,"language":"German","interpretation_note":"German text interpreted and self-reviewed by Codex under the owner-authorized AI policy; no independent language review claimed.","locator":"Definition, pioneer occupancy and implemented groups through Am Seebogen; detailed linked project pages excluded","access_mode":"HTML body","inspection":"Specified official HTML body inspected on 2026-11-22; linked files, forms, maps and live services were not tested","boundary":"First occupancy and completed groups do not establish universal affordability or measured participation.","first_occupancy_period":"2014-autumn"},{"id":"aspern-education","title":"Education in Seestadt","publisher":"Wien 3420 aspern Development AG","role":"Local education provision and staged expansion","url":"https://www.aspern-seestadt.at/de/leben/bildung","publication_date":null,"language":"German","interpretation_note":"German text interpreted and self-reviewed by Codex under the owner-authorized AI policy; no independent language review claimed.","locator":"Introductory schools, library and youth-service sections through the headline figures; linked provider directory excluded","access_mode":"HTML body","inspection":"Specified official HTML body inspected on 2026-11-22; linked files, forms, maps and live services were not tested","boundary":"Existing schools and library are distinct from future school capacity. The 7,500 figure belongs to the planned vocational school.","vocational_school_target_period":"2028"},{"id":"aspern-climate","title":"Sustainability and climate in Seestadt","publisher":"Wien 3420 aspern Development AG","role":"Developer's landscape, building and material-management account","url":"https://www.aspern-seestadt.at/de/seestadt/qualitaeten/nachhaltigkeit-und-klima","publication_date":null,"language":"German","interpretation_note":"German text interpreted and self-reviewed by Codex under the owner-authorized AI policy; no independent language review claimed.","locator":"Green space, buildings, land use and circular-construction sections","access_mode":"HTML body","inspection":"Specified official HTML body inspected on 2026-11-22; linked files, forms, maps and live services were not tested","boundary":"Planted trees need time to shade; standards and research are not measured district-wide outcomes. Future thermal networks remain prospective."},{"id":"aspern-responsibility","title":"Seestadt contact responsibilities","publisher":"Wien 3420 aspern Development AG","role":"Published division of development and neighbourhood roles","url":"https://www.aspern-seestadt.at/de/serviceseiten/kontakt","publication_date":null,"language":"German","interpretation_note":"German text interpreted and self-reviewed by Codex under the owner-authorized AI policy; no independent language review claimed.","locator":"Developer, neighbourhood-management and construction-ombuds sections","access_mode":"HTML body","inspection":"Specified official HTML body inspected on 2026-11-22; linked files, forms, maps and live services were not tested","boundary":"Contact roles do not transfer planning authority or establish response performance. No message or form was submitted."},{"id":"vienna-stock","title":"The municipal housing estate","publisher":"Stadt Wien – Wiener Wohnen","role":"Municipal landlord's stock and service inventory","url":"https://www.wienerwohnen.at/info/der-gemeindebau.html","publication_date":null,"language":"German","interpretation_note":"German text interpreted and self-reviewed by Codex under the owner-authorized AI policy; no independent language review claimed.","locator":"Stock figures and estate-service inventory; video and linked topics excluded","access_mode":"HTML body","inspection":"Specified official HTML body inspected on 2026-11-22; linked files, forms, maps and live services were not tested","boundary":"Undated rounded stock figures are not a same-date city census, vacancy count or accessibility audit."},{"id":"vienna-access","title":"Renting a municipal apartment","publisher":"Stadt Wien – Wiener Wohnen","role":"Landlord's explanation of the allocation pathway","url":"https://www.wienerwohnen.at/etwas-mieten/wohnung-mieten.html","publication_date":null,"language":"German","interpretation_note":"German text interpreted and self-reviewed by Codex under the owner-authorized AI policy; no independent language review claimed.","locator":"Housing advice, ticket, search, viewing and contract steps","access_mode":"HTML body","inspection":"Specified official HTML body inspected on 2026-11-22; linked files, forms, maps and live services were not tested","boundary":"This is a service overview, not individual eligibility advice or a guarantee of allocation. Linked criteria and application services were not tested."},{"id":"vienna-renewal","title":"Municipal housing renovation update","publisher":"Stadt Wien – Wiener Wohnen","role":"Dated housing-renewal programme account","url":"https://www.wienerwohnen.at/aktuelles/neuigkeiten/neues-aus-dem-gemeindebau/2026-sanierungsupdate.html","publication_date":"2026-08-12","language":"German","interpretation_note":"German text interpreted and self-reviewed by Codex under the owner-authorized AI policy; no independent language review claimed.","locator":"Programme totals, selection criteria and completed-renovation paragraph; detailed building examples not used","access_mode":"HTML body","inspection":"Specified official HTML body inspected on 2026-11-22; linked files, forms, maps and live services were not tested","boundary":"Active programme investment and completed renovation counts are separate. Promotional comfort claims are not measured household savings."},{"id":"vienna-maintenance","title":"Spring maintenance of the high-spring aqueducts","publisher":"Stadt Wien – Wiener Wasser","role":"Dated water-service maintenance explanation","url":"https://presse.wien.gv.at/kategoriennavigation/-/asset_publisher/zraFORwNk9Zp/content/2026-03-05-fruehjahrsputz-in-den-hochquellenleitungen-sichert-unsere-versorgung-mit-hochquellwasser-aus-den-alpen?inheritRedirect=false&redirect=https%3A%2F%2Fpresse.wien.gv.at%3A443%2Fkategoriennavigation%3Fp_p_id%3D101_INSTANCE_zraFORwNk9Zp%26p_p_lifecycle%3D0%26p_p_state%3Dnormal%26p_p_mode%3Dview%26p_p_col_id%3Dcolumn-2%26p_p_col_count%3D1","publication_date":"2026-03-05","language":"German","interpretation_note":"German text interpreted and self-reviewed by Codex under the owner-authorized AI policy; no independent language review claimed.","locator":"Maintenance, alternating shutdown, reservoir preparation and backup supply paragraphs","access_mode":"HTML body","inspection":"Specified official HTML body inspected on 2026-11-22; linked files, forms, maps and live services were not tested","boundary":"Reported continuity arrangements are not a universal outage guarantee or a completed renovation of all pressure crossings."},{"id":"vienna-main","title":"Fourth water main nearing commissioning","publisher":"Stadt Wien – Wiener Wasser","role":"Dated construction and commissioning-stage notice","url":"https://presse.wien.gv.at/kategoriennavigation/-/asset_publisher/zraFORwNk9Zp/content/2026-11-15-czernohorszky-schlagader-fuers-wiener-wasser-im-sueden-wiens-fertiggestellt?inheritRedirect=false&redirect=https%3A%2F%2Fpresse.wien.gv.at%3A443%2Fkategoriennavigation%3Fp_p_id%3D101_INSTANCE_zraFORwNk9Zp%26p_p_lifecycle%3D0%26p_p_state%3Dnormal%26p_p_mode%3Dview%26p_p_col_id%3Dcolumn-2%26p_p_col_count%3D1","publication_date":"2026-11-15","language":"German","interpretation_note":"German text interpreted and self-reviewed by Codex under the owner-authorized AI policy; no independent language review claimed.","locator":"Connection endpoints, installed length, flushing, release condition and remaining surface works","access_mode":"HTML body","inspection":"Specified official HTML body inspected on 2026-11-22; linked files, forms, maps and live services were not tested","boundary":"The completion headline does not establish operational acceptance. December commissioning and June 2027 surface completion were prospective.","construction_start_period":"2022-03","commissioning_target_period":"2026-12","surface_completion_target_period":"2027-06"},{"id":"graz-allocation","title":"Applying for a municipal apartment","publisher":"Stadt Graz – Wohnen Graz","role":"Municipal allocation-service explanation","url":"https://www.graz.at/cms/beitrag/10273051/7763343/","publication_date":null,"language":"German","interpretation_note":"German text interpreted and self-reviewed by Codex under the owner-authorized AI policy; no independent language review claimed.","locator":"Application, documentation, review and emergency-assessment sections","access_mode":"HTML body","inspection":"Specified official HTML body inspected on 2026-11-22; linked files, forms, maps and live services were not tested","boundary":"Application review and registration are not an immediate offer; individual eligibility depends on current rules and circumstances."},{"id":"graz-puntigam","title":"New municipal homes occupied in Puntigam","publisher":"Stadt Graz","role":"Dated municipal housing delivery announcement","url":"https://www.graz.at/cms/beitrag/10463427/8114224/Neue_Gemeindewohnungen_in_Puntigam_uebergeben.html","publication_date":"2026-04-24","language":"German","interpretation_note":"German text interpreted and self-reviewed by Codex under the owner-authorized AI policy; no independent language review claimed.","locator":"Official article body only; reader comments excluded","access_mode":"HTML body","inspection":"Specified official HTML body inspected on 2026-11-22; linked files, forms, maps and live services were not tested","boundary":"Twenty occupied homes and installed amenities do not establish city-wide housing sufficiency or measured energy performance.","occupancy_event_period":"2026-04-early"},{"id":"graz-retention","title":"Municipal apartment sales suspended","publisher":"Stadt Graz – Immobilien Graz","role":"Published municipal asset-retention account","url":"https://www.immobilien.graz.at/cms/beitrag/10177505/4134856/Gemeindewohnungen_Verkauf.html","publication_date":null,"language":"German","interpretation_note":"German text interpreted and self-reviewed by Codex under the owner-authorized AI policy; no independent language review claimed.","locator":"Sales-suspension paragraph and dated council reference","access_mode":"HTML body","inspection":"Specified official HTML body inspected on 2026-11-22; linked files, forms, maps and live services were not tested","boundary":"The referenced 2015 decision is distinct from the page header's 2026 date; linked underlying instrument not inspected.","council_decision_date":"2015-06-18","displayed_header_date":"2026-04-21"},{"id":"graz-wastewater","title":"Graz wastewater plant and expansion","publisher":"Holding Graz","role":"Operator's regional treatment and expansion account","url":"https://www.holding-graz.at/de/wasser/klaeranlage-der-stadt-graz/","publication_date":null,"language":"German","interpretation_note":"German text interpreted and self-reviewed by Codex under the owner-authorized AI policy; no independent language review claimed.","locator":"Plant, extension and FAQ sections through future modular provision; linked 2024 folder excluded","access_mode":"HTML body","inspection":"Specified official HTML body inspected on 2026-11-22; linked files, forms, maps and live services were not tested","boundary":"Population equivalents include industrial load, not municipal residents. Expansion and future treatment stages are not accepted current capacity.","reported_approval_period":"2024-03","reported_construction_start_period":"2025","commissioning_target_period":"2029","self_supply_measurement_period":"2024-04"},{"id":"graz-solar","title":"Photovoltaic masterplan interim account","publisher":"Holding Graz","role":"Dated municipal-group solar programme report","url":"https://www.holding-graz.at/de/pv-masterplan-erfolgreiche-zwischenbilanz/","publication_date":"2025-12-23","language":"German","interpretation_note":"German text interpreted and self-reviewed by Codex under the owner-authorized AI policy; no independent language review claimed.","locator":"Programme scope, completed and pending arrays, suitable roofs and future airport project","access_mode":"HTML body","inspection":"Specified official HTML body inspected on 2026-11-22; linked files, forms, maps and live services were not tested","boundary":"Completed and near-complete capacity must not be combined as fully operating. House Graz demand is not all electricity consumed in the city.","target_period":"2030"}],'Exact source identity, language, access scope and dates must remain intact');
  assert.equal(review.sources_sha256,austriaHousingCitiesHash(data.sources));assert.equal(review.edition_sha256,austriaHousingCitiesHash(data));
}
export const austriaHousingCitiesCriticalPhrases=[
  [
    0,
    0,
    "future development aims, not current occupancy"
  ],
  [
    0,
    1,
    "participation is not proof of affordability for every household"
  ],
  [
    0,
    2,
    "2028 start is a target, not observed opening"
  ],
  [
    0,
    2,
    "must not be added to current provision"
  ],
  [
    0,
    3,
    "Design provisions are not measured district-wide cooling or energy savings"
  ],
  [
    0,
    4,
    "not a response-time guarantee or a transfer of statutory planning authority"
  ],
  [
    1,
    0,
    "not a current vacancy count or a city-wide housing census"
  ],
  [
    1,
    1,
    "A ticket is not an immediate housing offer"
  ],
  [
    1,
    2,
    "Active investment is not completed expenditure"
  ],
  [
    1,
    3,
    "not a guarantee against every outage"
  ],
  [
    1,
    4,
    "December commissioning remains prospective"
  ],
  [
    1,
    4,
    "release is required before household supply begins"
  ],
  [
    2,
    0,
    "Registration is not an immediate offer"
  ],
  [
    2,
    1,
    "not evidence that city-wide need has been met"
  ],
  [
    2,
    2,
    "2026 header is not the date of that council decision"
  ],
  [
    2,
    3,
    "they are not a resident count"
  ],
  [
    2,
    3,
    "not proof that a fourth treatment stage is already operating"
  ],
  [
    2,
    4,
    "not all electricity used across the city"
  ],
  [
    2,
    4,
    "not fully operating generation"
  ]
];
