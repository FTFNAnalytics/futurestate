import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
export const gautengMetroHash=value=>createHash('sha256').update(JSON.stringify(value)).digest('hex');
export function assertGautengMetroDossiers(data,review){
  assert.equal(data.inspected_date,'2026-11-22');assert.equal(data.timezone,'America/Edmonton');
  assert.equal(data.review_policy,'OWNER-AUTHORIZED-AI-REVIEW-2026-09-25');
  assert.equal(review.policy_id,data.review_policy);assert.equal(review.review_date,data.inspected_date);
  assert.equal(data.independent_review,false);assert.equal(data.phase_60_identity_added,false);
  for(const key of ['independent_review','publication_authorized','launch_authorized','phase_216_complete'])assert.equal(review[key],false);
  assert.deepEqual(data.records.map(r=>r.record_id),["project-gautrain","place-johannesburg","place-tshwane"]);
  assert.deepEqual(data.records.map(r=>r.kind),['Project','Place','Place']);
  assert.equal(new Set(data.records.map(r=>r.route)).size,3);
  assert.equal(data.sources.length,17);const ids=new Set(data.sources.map(s=>s.id));assert.equal(ids.size,17);
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
    assert.equal(review.records.find(d=>d.record_id===r.record_id)?.sha256,gautengMetroHash(r),'Article changed after exact-version review');
  }
  const [rail,joburg,tshwane]=data.records;
  assert(rail.scope.includes('approximately 80-kilometre Gautrain Rapid Rail Link'));
  assert(joburg.scope.includes('seven municipal regions'));
  assert(tshwane.scope.includes('not Pretoria alone'));
  assert(rail.stage.includes('No current concession determination or recurring-performance admission'));
  assert(joburg.stage.includes('not verified outcomes'));
  assert(tshwane.stage.includes('official indexed text'));
  assert.deepEqual(data.records.map(r=>r.timeline.map(t=>t.date)),[["2010-06-02","2010-06-08","2011-08-02","2012-06-07","2016-11","2026-07-29"],["2025-06-10","2026-09-01","2026-10-28","2026-10-30"],["2026-11-02","2026-11-04","2026-11-06","2026-11-21"]]);
  assert(joburg.timeline[3].event.includes('exact handover day not separately specified'));
  assert(tshwane.timeline[1].event.includes('previous night'));
  for(const r of data.records)assert(!Object.hasOwn(r,'historical_acquisition'),'New Gauteng identity must not reuse a historical country docket');
  for(const [ri,si,phrase] of gautengMetroCriticalPhrases)assert(data.records[ri].sections[si].text.includes(phrase),'Missing bounded claim: '+phrase);
  assert.deepEqual(data.records.map(r=>r.sections.map(s=>s.source_ids)),[[["gautrain-stages","gautrain-opening"],["gautrain-permit","gautrain-opening"],["gautrain-finance"],["gautrain-finance"],["gautrain-station-service"],[]],[["joburg-scope"],["joburg-brt","joburg-event-buses"],["joburg-electric-trial"],["joburg-electricity"],["joburg-housing"],[]],[["tshwane-regions"],["tshwane-buses"],["tshwane-power-water","tshwane-pumping-restart"],["tshwane-reservoirs"],["tshwane-digital"],[]]],'Claim-to-source bindings changed');
  assert.deepEqual(data.records.map(r=>r.timeline.map(s=>s.source_ids)),[[["gautrain-permit"],["gautrain-opening"],["gautrain-stages"],["gautrain-stages"],["gautrain-finance"],["gautrain-station-service"]],[["joburg-brt"],["joburg-electric-trial"],["joburg-event-buses"],["joburg-housing"]],[["tshwane-power-water"],["tshwane-pumping-restart"],["tshwane-digital"],["tshwane-reservoirs"]]],'Chronology-to-source bindings changed');
  const source=id=>data.sources.find(s=>s.id===id);
  for(const [id,date] of [["gautrain-stages",null],["gautrain-opening","2010-06-09"],["gautrain-permit","2010-06-03"],["gautrain-finance",null],["gautrain-station-service","2026-07-29"],["joburg-scope",null],["joburg-brt","2025-06-10"],["joburg-event-buses","2026-10-28"],["joburg-electric-trial","2026-09-01"],["joburg-electricity",null],["joburg-housing","2026-10-30"],["tshwane-regions",null],["tshwane-buses",null],["tshwane-power-water","2026-11-03"],["tshwane-pumping-restart","2026-11-04"],["tshwane-reservoirs","2026-11-21"],["tshwane-digital","2026-11-06"]])assert.equal(source(id).publication_date,date);
  assert.equal(source('gautrain-opening').event_date,'2010-06-08');
  assert.equal(source('gautrain-permit').event_date,'2010-06-02');
  assert.equal(source('gautrain-permit').anticipated_service_date,'2010-06-07');
  assert.equal(source('gautrain-finance').reference_period,"Historical case study including a November 2016 preparation grant; publication day not supplied");
  assert.equal(source('gautrain-station-service').scheduled_event_date,'2026-07-29');
  assert.equal(source('gautrain-station-service').event_date,undefined);
  assert.equal(source('joburg-event-buses').scheduled_event_date,'2026-10-31');
  assert.equal(source('joburg-event-buses').event_date,undefined);
  assert.equal(source('joburg-electric-trial').planned_duration,'30–60 days');
  assert.equal(source('joburg-electric-trial').event_date,undefined);
  assert.equal(source('joburg-housing').event_date,undefined);
  assert.equal(source('tshwane-power-water').event_date,'2026-11-02');
  assert.equal(source('tshwane-pumping-restart').event_date,undefined);
  assert.equal(source('tshwane-pumping-restart').event_period,"Previous night as described in the November 4 archive excerpt");
  assert.equal(source('tshwane-digital').scheduled_start_date,'2026-11-06');
  assert.equal(source('tshwane-digital').scheduled_end_date,'2026-11-08');
  assert.equal(source('tshwane-digital').event_date,undefined);
  for(const [id,mode,url] of [["gautrain-stages","HTML body","https://www.bombela.com/our-track-record/"],["gautrain-opening","HTML body","https://www.gov.za/news/media-statements/gautrain-new-era-public-transport-09-jun-2010"],["gautrain-permit","HTML body","https://www.gov.za/news/media-statements/gautrain-set-boost-economic-development-03-jun-2010"],["gautrain-finance","HTML body","https://www.dbsa.org/case-studies/gma-gautrain-phase-1-expansion"],["gautrain-station-service","HTML body","https://www.gov.za/news/media-advisories/gauteng-mec-diale-tlabela-launch-gautrains-innovative-sandton-smart-licensing"],["joburg-scope","HTML body","https://joburg.org.za/departments_/Pages/City%20directorates%20including%20departmental%20sub-directorates/development%20planning/Overview-and-departmental-structure.aspx"],["joburg-brt","HTML body","https://joburg.org.za/media_/Newsroom/Pages/2025-News-Articles/City-of-Joburg-expands-Rea-Vaya-BRT-network-with-Phase-1C-rollout.aspx"],["joburg-event-buses","HTML body","https://joburg.org.za/media_/Newsroom/Pages/2026-News-Articles/Rea-Vaya-ready-to-transport-fans-to-the-Soweto-Derby-for-R30-only.aspx"],["joburg-electric-trial","HTML body","https://joburg.org.za/media_/Newsroom/Pages/2026-News-Articles/City-puts-electric-buses-to-the-test-in-drive-towards-greener-public-transport.aspx"],["joburg-electricity","HTML body","https://joburg.org.za/services_/electricity/Pages/contacting-City-Power.aspx"],["joburg-housing","HTML body","https://joburg.org.za/media_/Newsroom/Pages/2026-News-Articles/After-15-year-wait-48-jubilant-families-receive-houses.aspx"],["tshwane-regions","Official indexed text","https://www.tshwane.gov.za/?page_id=8940"],["tshwane-buses","Official indexed text","https://www.tshwane.gov.za/?page_id=2269"],["tshwane-power-water","Official indexed text","https://www.tshwane.gov.za/?p=107135"],["tshwane-pumping-restart","Official indexed text","https://www.tshwane.gov.za/?m=20261104"],["tshwane-reservoirs","Official indexed text","https://www.tshwane.gov.za/?p=108473"],["tshwane-digital","Official indexed text","https://www.tshwane.gov.za/?p=107547"]]){
    const s=source(id);assert.equal(s.access_mode,mode);assert.equal(s.url,url);
    assert.equal(s.language,'English');assert(s.inspection.includes('2026-11-22'));
    if(mode==='HTML body')assert(s.inspection.includes('HTML text')&&s.inspection.includes('dynamic feeds were not inspected'));
    else {assert(s.inspection.includes('Official indexed text')&&s.inspection.includes('direct page retrieval failed'));assert(s.retrieval_limit?.length>20);assert(s.inspection.includes('No full live-page'));}
  }
  assert.equal(data.sources.filter(s=>s.access_mode==='HTML body').length,11);
  assert.equal(data.sources.filter(s=>s.access_mode==='Official indexed text').length,6);
  assert.equal(review.sources_sha256,gautengMetroHash(data.sources));assert.equal(review.edition_sha256,gautengMetroHash(data));
}
export const gautengMetroCriticalPhrases=[
  [
    0,
    0,
    "stages of one project, not three counted railways"
  ],
  [
    0,
    1,
    "forecast should not replace the recorded event"
  ],
  [
    0,
    1,
    "not an observed service day or a continuing safety record"
  ],
  [
    0,
    2,
    "network-dependency question rather than evidence of a specific failed connection"
  ],
  [
    0,
    3,
    "not delivered coaches or the current concession position"
  ],
  [
    0,
    3,
    "earlier-period language must remain historical"
  ],
  [
    0,
    4,
    "not a post-event opening record"
  ],
  [
    0,
    4,
    "does not add rail capacity"
  ],
  [
    1,
    0,
    "seven municipal regions"
  ],
  [
    1,
    0,
    "whole Gauteng economy"
  ],
  [
    1,
    1,
    "one concerns programme delivery, the other a dated service plan"
  ],
  [
    1,
    1,
    "R30 refers to a ticketing card"
  ],
  [
    1,
    1,
    "not automatically the journey fare"
  ],
  [
    1,
    2,
    "trial plan, not completed findings or fleet-wide electrification"
  ],
  [
    1,
    2,
    "independent evaluation already delivered"
  ],
  [
    1,
    3,
    "areas supplied directly by Eskom"
  ],
  [
    1,
    3,
    "municipal boundary"
  ],
  [
    1,
    4,
    "48 houses"
  ],
  [
    1,
    4,
    "not the citywide housing backlog"
  ],
  [
    1,
    4,
    "does not separately establish the exact handover day"
  ],
  [
    2,
    0,
    "one municipal place, not seven independent cities"
  ],
  [
    2,
    0,
    "official indexed text because direct page retrieval failed"
  ],
  [
    2,
    1,
    "not proof of a through-fare"
  ],
  [
    2,
    1,
    "no live booking, fare transaction or passenger journey was tested"
  ],
  [
    2,
    2,
    "restarting the pump does not immediately refill depleted reservoirs"
  ],
  [
    2,
    2,
    "full restart notice's affected-area list was not directly inspected"
  ],
  [
    2,
    3,
    "dated local condition, not a live assessment"
  ],
  [
    2,
    3,
    "automatically be attributed to the earlier Mapleton incident"
  ],
  [
    2,
    4,
    "earlier October completion target had been missed"
  ],
  [
    2,
    4,
    "a schedule, not evidence that the work finished successfully"
  ]
];
