import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
export const ruhrWaterCityHash=value=>createHash('sha256').update(JSON.stringify(value)).digest('hex');
export function assertRuhrWaterCityDossiers(data,review){
  assert.equal(data.inspected_date,'2026-11-22');assert.equal(data.timezone,'America/Edmonton');
  assert.equal(data.review_policy,'OWNER-AUTHORIZED-AI-REVIEW-2026-09-25');
  assert.equal(review.policy_id,data.review_policy);assert.equal(review.review_date,data.inspected_date);
  assert.equal(data.independent_review,false);assert.equal(data.phase_60_identity_added,false);
  for(const key of ['independent_review','publication_authorized','launch_authorized','phase_216_complete'])assert.equal(review[key],false);
  assert.deepEqual(data.records.map(r=>r.record_id),["project-emscher-sewer","project-phoenix-see","place-dortmund"],'Exact record_id boundary changed');
  assert.deepEqual(data.records.map(r=>r.kind),['Project','Project','Place']);
  assert.equal(new Set(data.records.map(r=>r.route)).size,3);
  assert.equal(data.sources.length,16);const ids=new Set(data.sources.map(s=>s.id));assert.equal(ids.size,16);
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
    assert.equal(review.records.find(d=>d.record_id===r.record_id)?.sha256,ruhrWaterCityHash(r),'Article changed after exact-version review');
  }
  assert.deepEqual(data.records.map(r=>r.scope),["One named sewer system from Dortmund-Deusen to the Emscher mouth, including its three pumping stations. The wider Emscher restoration programme, tributary projects and PHOENIX See are outside this counted identity.","One lake and associated public-space redevelopment at the former Phoenix Ost steelworks in Dortmund-Hörde. Individual building plots, Phoenix West, the wider Emscher restoration programme and Dortmund municipality remain separate identities.","One municipality of Dortmund. Statistical subdistricts, individual housing sites, mapped stream catchments and the wider Ruhr region are not additional counted places. AKE and PHOENIX See retain their separate project boundaries."],'Exact scope boundary changed');
  assert.deepEqual(data.records.map(r=>r.stage),["The operator records phased sewer operation from 2018 and full-system operation by the end of 2021. Subsequent river monitoring shows improvements and remaining chemical and oxygen constraints, not complete ecological recovery or independently verified AKE-only outcomes.","The lake opened to the public in May 2011 and has continuing water and public-space management. The published environmental summary concerns 2021; October 2026 path renewal has a first-quarter 2027 target, not an observed completion.","Dated municipal accounts describe housing conditions, intermediate heat planning, initial flood-map coverage and installed waste equipment. Reporting years, future models and observed provision remain separate; no composite city ranking or universal service guarantee is admitted."],'Exact stage boundary changed');
  assert.deepEqual(data.records.map(r=>r.route),["/atlas/projects/emscher-sewer/","/atlas/projects/phoenix-see/","/atlas/places/dortmund/"],'Exact route boundary changed');
  assert.deepEqual(data.records.map(r=>r.aliases),[["AKE","Emscher sewer","Abwasserkanal Emscher","Emscher main sewer"],["Phoenix lake","Phoenix-See","Phönixsee","PHOENIX See Hörde"],["Stadt Dortmund","Dortmund municipality","City of Dortmund","Dortmund municipal systems"]],'Exact aliases boundary changed');
  assert.deepEqual(data.records.map(r=>r.timeline),[[{"date":"2009-09-11","event":"Groundbreaking for the named sewer, as dated in the operator's 2024 retrospective.","source_ids":["ake-delivery"]},{"date":"2018","event":"Initial Dortmund-to-Bottrop sewer sections and the Gelsenkirchen pump entered operation.","source_ids":["ake-delivery"]},{"date":"2021-04-23","event":"The operator reported first functional tests at Oberhausen, including six of ten pumps.","source_ids":["ake-tests"]},{"date":"2024-09-09","event":"The operator's retrospective records full-system operation by the end of 2021.","source_ids":["ake-delivery"]}],[{"date":"2001","event":"Steelmaking ended at Phoenix Ost, the lake's redevelopment site.","source_ids":["phoenix-history"]},{"date":"2005","event":"Groundbreaking began the lake redevelopment.","source_ids":["phoenix-history"]},{"date":"2010-10-01","event":"Filling of the new lake began.","source_ids":["phoenix-history"]},{"date":"2011-05","event":"The lake opened to the public after filling was completed.","source_ids":["phoenix-history"]}],[{"date":"2026-03-03","event":"The city reported a completed energy-use plan and intermediate heat-planning results.","source_ids":["dortmund-heat"]},{"date":"2026-08-28","event":"Initial detailed river-flood maps were announced for the Marksbach and Heisterbach catchments.","source_ids":["dortmund-flood"]},{"date":"2026-09-02","event":"The municipal housing summary reported conditions in 2025.","source_ids":["dortmund-housing"]},{"date":"2026-10-09","event":"The city news article reported 92 installed sensor-equipped waste bins.","source_ids":["dortmund-waste"]}]],'Exact timeline boundary changed');
  assert.deepEqual(data.records.map(r=>r.sections.map(s=>s.source_ids)),[[["ake-design"],["ake-delivery"],["ake-tests"],["ake-pump"],["ake-monitoring"],[]],[["phoenix-history"],["phoenix-water"],["phoenix-access"],["phoenix-path"],["phoenix-dialogue"],[]],[["dortmund-housing"],["dortmund-neighbourhoods"],["dortmund-heat","dortmund-heat-map"],["dortmund-flood"],["dortmund-waste"],[]]],'Claim-to-source bindings changed');
  for(const r of data.records)assert(!Object.hasOwn(r,'historical_acquisition'),'New Ruhr identity must not reuse a historical country docket');
  for(const [ri,si,phrase] of ruhrWaterCityCriticalPhrases)assert(data.records[ri].sections[si].text.includes(phrase),'Missing bounded claim: '+phrase);
  assert.deepEqual(data.sources,[{"id":"ake-design","title":"Emscher conversion and sewer design","publisher":"Emschergenossenschaft","role":"Operator's technical overview","url":"https://www.eglv.de/emscher/der-umbau/","publication_date":null,"language":"German","interpretation_note":"German text interpreted and self-reviewed by Codex under the owner-authorized AI policy; no independent language review claimed.","locator":"AKE technical data, alignment, depth and redundancy sections","access_mode":"HTML body","inspection":"Specified official HTML body inspected on 2026-11-22; linked files, maps, films, forms and live services were not tested","boundary":"The 51 km route differs from total pipe length. A century is a design life, not observed operation."},{"id":"ake-delivery","title":"Fifteen years after the AKE groundbreaking","publisher":"Emschergenossenschaft","role":"Dated retrospective of phased delivery","url":"https://www.eglv.de/medien/vor-15-jahren-erster-spatenstich-fuer-den-abwasserkanal-emscher/","publication_date":"2024-09-09","language":"German","interpretation_note":"German text interpreted and self-reviewed by Codex under the owner-authorized AI policy; no independent language review claimed.","locator":"Groundbreaking, phased operation and pump completion paragraphs","access_mode":"HTML body","inspection":"Specified official HTML body inspected on 2026-11-22; linked files, maps, films, forms and live services were not tested","boundary":"Sewer operation and an end to untreated discharges do not establish full river ecological recovery.","groundbreaking_date":"2009-09-11","full_operation_period":"2021-end"},{"id":"ake-tests","title":"First functional tests at Oberhausen","publisher":"Emschergenossenschaft","role":"Contemporaneous component-testing account","url":"https://www.eglv.de/medien/pumpwerk-oberhausen-besteht-erste-funktionstests/","publication_date":"2021-04-23","language":"German","interpretation_note":"German text interpreted and self-reviewed by Codex under the owner-authorized AI policy; no independent language review claimed.","locator":"Test setup, six pumps and remaining commissioning paragraphs","access_mode":"HTML body","inspection":"Specified official HTML body inspected on 2026-11-22; linked files, maps, films, forms and live services were not tested","boundary":"Six tested pumps are not ten commissioned pumps or acceptance of the entire system.","test_period":"2021-04","then_commissioning_target_period":"2021-08"},{"id":"ake-pump","title":"Gelsenkirchen pumping station","publisher":"Emschergenossenschaft","role":"Component and public-space account","url":"https://www.eglv.de/en/emscher-lippe/stadt-und-regionalentwicklung/gemeinsam-emscher-lippe/faszination-transformation/leuchtturmprojekte/gelsenkirchen-pumpwerk/","publication_date":null,"language":"German","interpretation_note":"German text interpreted and self-reviewed by Codex under the owner-authorized AI policy; no independent language review claimed.","locator":"Pumping function, completion and visitor-space paragraphs; inconsistent capacity table excluded","access_mode":"HTML body","inspection":"Specified official HTML body inspected on 2026-11-22; linked files, maps, films, forms and live services were not tested","boundary":"German body despite the /en/ path. September 2019 completion differs from first operation in 2018; visitor provision is not live accessibility verification.","displayed_date":"2021-05-20","reported_completion_period":"2019-09"},{"id":"ake-monitoring","title":"Monitoring after the end of untreated Emscher discharges","publisher":"Emschergenossenschaft","role":"Dated river-quality interpretation","url":"https://www.eglv.de/medien/messwerte-zeigen-schwarze-emscher-ist-geschichte/","publication_date":"2026-01-05","language":"German","interpretation_note":"German text interpreted and self-reviewed by Codex under the owner-authorized AI policy; no independent language review claimed.","locator":"Monitoring, oxygen and remaining chemical-status limits","access_mode":"HTML body","inspection":"Specified official HTML body inspected on 2026-11-22; linked files, maps, films, forms and live services were not tested","boundary":"Whole-river monitoring is related context, not a comparable AKE-only outcome series. Mine-water cessation and further treatment are separate interventions.","monitoring_start_period":"2022","mine_water_cessation_period":"2023-03","oxygen_reporting_period":"2024","deusen_treatment_event_period":"2025-04"},{"id":"phoenix-history","title":"Creation of PHOENIX See","publisher":"Stadt Dortmund – Stadtentwässerung","role":"Municipal project history","url":"https://www.dortmund.de/themen/freizeit-und-kultur/parks-seen-und-zoo/phoenix-see/entstehungsgeschichte/","publication_date":null,"language":"German","interpretation_note":"German text interpreted and self-reviewed by Codex under the owner-authorized AI policy; no independent language review claimed.","locator":"Industrial closure, development, filling, opening and dimensions","access_mode":"HTML body","inspection":"Specified official HTML body inspected on 2026-11-22; linked files, maps, films, forms and live services were not tested","boundary":"The lake is about 24 ha within a larger redevelopment area. Normal volume and additional flood storage are distinct.","steel_closure_period":"2001","groundbreaking_period":"2005","filling_start_date":"2010-10-01","public_opening_period":"2011-05"},{"id":"phoenix-water","title":"PHOENIX See nature and water management","publisher":"Stadt Dortmund – Stadtentwässerung","role":"Municipal environmental and maintenance account","url":"https://www.dortmund.de/themen/freizeit-und-kultur/parks-seen-und-zoo/phoenix-see/natur-und-umwelt/","publication_date":null,"language":"German","interpretation_note":"German text interpreted and self-reviewed by Codex under the owner-authorized AI policy; no independent language review claimed.","locator":"Water quality, phosphate removal, Emscher flood storage and operating responsibilities","access_mode":"HTML body","inspection":"Specified official HTML body inspected on 2026-11-22; linked files, maps, films, forms and live services were not tested","boundary":"Displayed water-quality summary concerns 2021, not a 2026 sample. Extreme-flow diversion is not continuous ordinary river supply.","water_quality_reporting_period":"2021"},{"id":"phoenix-access","title":"PHOENIX See for everyone","publisher":"Stadt Dortmund – Stadtentwässerung","role":"Published accessibility provisions","url":"https://www.dortmund.de/themen/freizeit-und-kultur/parks-seen-und-zoo/phoenix-see/phoenix-see-fuer-alle/","publication_date":null,"language":"German","interpretation_note":"German text interpreted and self-reviewed by Codex under the owner-authorized AI policy; no independent language review claimed.","locator":"Accessible entrances, toilets, tactile model and sailing provision","access_mode":"HTML body","inspection":"Specified official HTML body inspected on 2026-11-22; linked files, maps, films, forms and live services were not tested","boundary":"Listed facilities and seasonal availability are not a live path or toilet inspection; linked plan and film were not tested."},{"id":"phoenix-path","title":"South-shore path renewal","publisher":"Stadt Dortmund – Pressestelle","role":"Dated maintenance notice","url":"https://www.dortmund.de/newsroom/presse-mitteilungen/stadt-setzt-sanierung-des-fusswegs-um-den-phoenix-see-fort-arbeiten-am-suedufer-beginnen.html","publication_date":"2026-10-08","language":"German","interpretation_note":"German text interpreted and self-reviewed by Codex under the owner-authorized AI policy; no independent language review claimed.","locator":"Two work stages, temporary arrangements and target completion","access_mode":"HTML body","inspection":"Specified official HTML body inspected on 2026-11-22; linked files, maps, films, forms and live services were not tested","boundary":"The notice gives October 7 as the start while published October 8. First-quarter 2027 completion remains a target.","announced_start_date":"2026-10-07","completion_target_period":"2027-Q1"},{"id":"phoenix-dialogue","title":"PHOENIX See residents' dialogue","publisher":"Stadt Dortmund – Stadtentwässerung","role":"Historical participation account","url":"https://www.dortmund.de/themen/freizeit-und-kultur/parks-seen-und-zoo/phoenix-see/buerger-innendialog/","publication_date":null,"language":"German","interpretation_note":"German text interpreted and self-reviewed by Codex under the owner-authorized AI policy; no independent language review claimed.","locator":"Dialogue entries from December 2018 through August 2021; linked minutes and films excluded","access_mode":"HTML body","inspection":"Specified official HTML body inspected on 2026-11-22; linked files, maps, films, forms and live services were not tested","boundary":"Historical meetings and proposed responses are not proof that every issue was resolved or that this is the current meeting schedule.","first_dialogue_date":"2018-12-06","latest_listed_dialogue_date":"2021-08-19"},{"id":"dortmund-housing","title":"Dortmund housing market remains under pressure","publisher":"Stadt Dortmund – Amt für Wohnen","role":"Dated municipal housing-market summary","url":"https://www.dortmund.de/newsroom/presse-mitteilungen/dortmunder-wohnungsmarkt-bleibt-unter-druck.html","publication_date":"2026-09-02","language":"German","interpretation_note":"German text interpreted and self-reviewed by Codex under the owner-authorized AI policy; no independent language review claimed.","locator":"2025 completions, funding, restricted stock and household-access paragraphs","access_mode":"HTML body","inspection":"Specified official HTML body inspected on 2026-11-22; linked files, maps, films, forms and live services were not tested","boundary":"2026 publication reports 2025. Funding approvals for construction or modernization are not completed new homes.","reporting_period":"2025"},{"id":"dortmund-neighbourhoods","title":"Municipal and small-area housing monitoring","publisher":"Stadt Dortmund – Amt für Wohnen","role":"Published monitoring method","url":"https://www.dortmund.de/themen/wohnen/wohnungsmarktbeobachtung/","publication_date":null,"language":"German","interpretation_note":"German text interpreted and self-reviewed by Codex under the owner-authorized AI policy; no independent language review claimed.","locator":"Municipal, small-area and regional methods; contact directory and linked reports excluded","access_mode":"HTML body","inspection":"Specified official HTML body inspected on 2026-11-22; linked files, maps, films, forms and live services were not tested","boundary":"170 statistical subdistricts are monitoring units, not new counted places; small-area reporting is not a live household assessment."},{"id":"dortmund-heat","title":"Energy-use plan and heat-transition intermediate results","publisher":"Stadt Dortmund – Pressestelle","role":"Dated modelling and planning-stage notice","url":"https://www.dortmund.de/newsroom/presse-mitteilungen/naechster-schritt-zur-waermewende-energienutzungsplan-bringt-vorteile-fuer-buergerinnen-und-buerger-verwaltung-und-wirtschaft.html","publication_date":"2026-03-03","language":"German","interpretation_note":"German text interpreted and self-reviewed by Codex under the owner-authorized AI policy; no independent language review claimed.","locator":"ENP completion, simulated network share and pilot selection; individual heating recommendations excluded","access_mode":"HTML body","inspection":"Specified official HTML body inspected on 2026-11-22; linked files, maps, films, forms and live services were not tested","boundary":"A simulated future share and an energy-use plan do not establish connected heat demand or final heat-plan adoption.","then_heat_plan_target_period":"2026-summer"},{"id":"dortmund-heat-map","title":"Dortmund heat-transition information","publisher":"Stadt Dortmund – Umweltamt","role":"Published status and map limitations","url":"https://www.dortmund.de/themen/umwelt-nachhaltigkeit-und-klimaschutz/klimaschutz-und-erneuerbare-energien/waermewende-fuer-dortmund/","publication_date":null,"language":"German","interpretation_note":"German text interpreted and self-reviewed by Codex under the owner-authorized AI policy; no independent language review claimed.","locator":"Intermediate-results and interactive-map explanation only; stale legal FAQs, linked plans and address service excluded","access_mode":"HTML body","inspection":"Specified official HTML body inspected on 2026-11-22; linked files, maps, films, forms and live services were not tested","boundary":"The page warns of outdated legal information. Only model/map limitations are used; no legal advice or address-specific connection finding."},{"id":"dortmund-flood","title":"First detailed municipal river-flood maps","publisher":"Stadt Dortmund – Stadtentwässerung","role":"Dated mapping-scope announcement","url":"https://www.dortmund.de/newsroom/presse-mitteilungen/neue-digitale-karten-zeigen-wassertiefen-und-stroemungen-bei-hochwasser-in-dortmund.html","publication_date":"2026-08-28","language":"German","interpretation_note":"German text interpreted and self-reviewed by Codex under the owner-authorized AI policy; no independent language review claimed.","locator":"Initial catchments, fluvial/pluvial distinction and staged survey coverage","access_mode":"HTML body","inspection":"Specified official HTML body inspected on 2026-11-22; linked files, maps, films, forms and live services were not tested","boundary":"Initial Marksbach and Heisterbach coverage is not city-wide coverage; simulations are not observed flooding or property-specific safety determinations."},{"id":"dortmund-waste","title":"Fill-level sensors for 92 park waste bins","publisher":"Stadt Dortmund","role":"Dated installed-equipment and operating-workflow account","url":"https://www.dortmund.de/newsroom/nachrichten-dortmund.de/fuellstand-im-blick-dortmund-stellt-92-smarte-muelltonnen-auf.html","publication_date":"2026-10-09","language":"German","interpretation_note":"German text interpreted and self-reviewed by Codex under the owner-authorized AI policy; no independent language review claimed.","locator":"Installed equipment, routing workflow and operator training; supplier saving claim excluded","access_mode":"HTML body","inspection":"Specified official HTML body inspected on 2026-11-22; linked files, maps, films, forms and live services were not tested","boundary":"Installed sensors do not establish measured route savings, emissions reductions or cleaner parks. October 9 is this article's date, not the separate October 7 press entry."}],'Exact source identity, language, access scope and dates must remain intact');
  assert.equal(review.sources_sha256,ruhrWaterCityHash(data.sources));assert.equal(review.edition_sha256,ruhrWaterCityHash(data));
}
export const ruhrWaterCityCriticalPhrases=[
  [
    0,
    0,
    "design life is not an observed service record"
  ],
  [
    0,
    1,
    "not the entire regional restoration programme"
  ],
  [
    0,
    2,
    "not full-system acceptance"
  ],
  [
    0,
    3,
    "distinct from the retrospective's first-operation milestone in 2018"
  ],
  [
    0,
    3,
    "capacity table contains inconsistent units"
  ],
  [
    0,
    4,
    "cannot all be assigned to AKE alone"
  ],
  [
    0,
    4,
    "much of the river still lacks good chemical status"
  ],
  [
    1,
    0,
    "the two areas should not be treated as identical"
  ],
  [
    1,
    1,
    "not continuous ordinary river supply"
  ],
  [
    1,
    1,
    "not a fresh 2026 water-quality result"
  ],
  [
    1,
    2,
    "Listed provision is not verified availability"
  ],
  [
    1,
    3,
    "First-quarter 2027 completion remains a target"
  ],
  [
    1,
    4,
    "do not demonstrate that every complaint was resolved"
  ],
  [
    2,
    0,
    "Funding approvals are not completed new homes"
  ],
  [
    2,
    0,
    "register corrections"
  ],
  [
    2,
    1,
    "three- to four-year cycle, not continuously"
  ],
  [
    2,
    2,
    "not a measured connected share"
  ],
  [
    2,
    2,
    "forecast does not establish final adoption"
  ],
  [
    2,
    3,
    "not full city-wide coverage"
  ],
  [
    2,
    4,
    "Installed equipment is not measured service improvement"
  ],
  [
    2,
    4,
    "not a Dortmund operating result"
  ]
];
