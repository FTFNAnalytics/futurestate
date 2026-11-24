import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
export const kenyaCorridorHash=value=>createHash('sha256').update(JSON.stringify(value)).digest('hex');
export function assertKenyaCorridorDossiers(data,review){
  assert.equal(data.inspected_date,'2026-11-22');assert.equal(data.timezone,'America/Edmonton');
  assert.equal(data.review_policy,'OWNER-AUTHORIZED-AI-REVIEW-2026-09-25');
  assert.equal(review.policy_id,data.review_policy);assert.equal(review.review_date,data.inspected_date);
  assert.equal(data.independent_review,false);assert.equal(data.phase_60_identity_added,false);
  for(const key of ['independent_review','publication_authorized','launch_authorized','phase_216_complete'])assert.equal(review[key],false);
  assert.deepEqual(data.records.map(r=>r.record_id),["project-mombasa-nairobi-sgr","place-nairobi-city-county","place-mombasa-county"]);
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
    assert(r.sections.map(s=>s.text).join(' ').split(/\s+/).length>=450);
    for(const s of r.sections){assert(s.heading&&s.text.length>200);assert(s.source_ids.every(id=>ids.has(id)));if(!s.source_ids.length)assert.equal(s.claim_type,'Editorial evidence test');}
    assert(r.timeline.length>=3);let previous='';
    for(const item of r.timeline){validPeriod(item.date);assert(item.date<=data.inspected_date&&item.date>=previous);previous=item.date;assert(item.event&&item.source_ids.length&&item.source_ids.every(id=>ids.has(id)));}
    assert(r.next_artifacts.length>=3);assert(r.related.every(link=>/^\/atlas\/[a-z0-9/-]+\/$/.test(link.route)));
    assert.equal(review.records.find(d=>d.record_id===r.record_id)?.sha256,kenyaCorridorHash(r),'Article changed after exact-version review');
  }
  const [rail,nairobi,mombasa]=data.records;
  assert(rail.scope.includes('472-kilometre Mombasa–Nairobi Phase 1'));
  assert(nairobi.scope.includes('County 047'));
  assert(mombasa.scope.includes('island and mainland'));
  assert(rail.stage.includes('No independent safety, financial-return or recurring Phase 1 performance admission'));
  assert(nairobi.stage.includes('No operating NMRTS network'));
  assert(mombasa.stage.includes('No station opening'));
  assert.deepEqual(data.records.map(r=>r.timeline.map(t=>t.date)),[["2017-05-31","2018-01-01","2020-11-10","2025-06-10","2026-10-29"],["2013","2025-09-04","2025-10-27","2026-07-22"],["2017-05-31","2023","2025-03-18","2026-10-19"]]);
  assert(nairobi.timeline[2].event.includes('exact opening day is not supplied'));
  assert(mombasa.timeline[1].event.includes('not an asserted publication or adoption day'));
  for(const r of data.records)assert(!Object.hasOwn(r,'historical_acquisition'),'New Kenyan identity must not reuse another jurisdiction docket');
  for(const [ri,si,phrase] of kenyaCorridorCriticalPhrases)assert(data.records[ri].sections[si].text.includes(phrase),`Missing bounded claim: ${phrase}`);
  assert.deepEqual(data.records.map(r=>r.sections.map(s=>s.source_ids)),[[["sgr-opening"],["sgr-passenger"],["sgr-vehicles"],["sgr-transit-shed"],["sgr-anniversary"],[]],[["nairobi-identity"],["nairobi-transit"],["nairobi-neighbourhoods"],["nairobi-meals"],["nairobi-jericho"],[]],[["mombasa-plan"],["mombasa-transport"],["mombasa-stations"],["mombasa-water-service"],["mombasa-water-repair"],[]]],'Claim-to-source bindings changed');
  assert.deepEqual(data.records.map(r=>r.timeline.map(s=>s.source_ids)),[[["sgr-opening"],["sgr-opening"],["sgr-transit-shed"],["sgr-anniversary"],["sgr-vehicles"]],[["nairobi-identity"],["nairobi-neighbourhoods","nairobi-meals"],["nairobi-jericho"],["nairobi-transit"]],[["sgr-opening"],["mombasa-plan"],["mombasa-water-repair"],["mombasa-stations"]]],'Chronology-to-source bindings changed');
  const source=id=>data.sources.find(s=>s.id===id);
  for(const [id,date] of [["sgr-opening","2024-05-27"],["sgr-passenger",null],["sgr-vehicles","2026-11-02"],["sgr-transit-shed",null],["sgr-anniversary","2025-06-13"],["nairobi-identity",null],["nairobi-transit","2026-07-22"],["nairobi-neighbourhoods","2025-09-04"],["nairobi-meals","2025-09-04"],["nairobi-jericho","2025-10-27"],["mombasa-plan",null],["mombasa-transport",null],["mombasa-stations","2026-10-19"],["mombasa-water-service",null],["mombasa-water-repair","2025-03-18"]])assert.equal(source(id).publication_date,date);
  assert.equal(source('sgr-opening').event_date,'2017-05-31');
  assert.equal(source('sgr-opening').commercial_start_date,'2018-01-01');
  assert.equal(source('sgr-vehicles').event_date,'2026-10-29');
  assert.equal(source('sgr-transit-shed').event_date,'2020-11-10');
  assert.equal(source('sgr-anniversary').event_date,'2025-06-10');
  assert.equal(source('nairobi-transit').event_date,'2026-07-22');
  assert.equal(source('nairobi-jericho').event_date,undefined);
  assert.equal(source('nairobi-meals').reference_period,'Two-year cumulative delivery described in the September 2025 account');
  assert.equal(source('mombasa-plan').reference_period,'2023–2027 plan; administrative context references 2022');
  assert.equal(source('mombasa-plan').media_type,'PDF');
  assert.equal(source('mombasa-stations').forecast_period,'End of November 2026');
  assert.equal(source('mombasa-water-repair').event_date,undefined);
  assert.equal(data.sources.filter(s=>s.media_type==='PDF').length,1);
  for(const s of data.sources){
    assert.equal(s.language,'English');assert(s.inspection.includes('2026-11-22'));
    if(s.media_type==='PDF'){assert(s.inspection.includes('complete printed pages 1 and 4'));assert(s.inspection.includes('visual rendering was not performed'));assert(s.inspection.includes('denied by network permissions'));}
    else assert(s.inspection.includes('HTML')&&s.inspection.includes('dynamic feeds were not inspected'));
  }
  assert.equal(review.sources_sha256,kenyaCorridorHash(data.sources));assert.equal(review.edition_sha256,kenyaCorridorHash(data));
}
export const kenyaCorridorCriticalPhrases=[
  [
    0,
    0,
    "not two projects"
  ],
  [
    0,
    0,
    "Phase 2A and remains outside"
  ],
  [
    0,
    1,
    "not a record of trains actually run or observed punctuality"
  ],
  [
    0,
    2,
    "21 vehicles"
  ],
  [
    0,
    2,
    "700 vehicles per month"
  ],
  [
    0,
    2,
    "the monthly target is not achieved volume"
  ],
  [
    0,
    3,
    "stated capacity, not measured throughput"
  ],
  [
    0,
    4,
    "not a Phase 1-only annual series or a count of unique people"
  ],
  [
    1,
    0,
    "not every settlement whose residents commute"
  ],
  [
    1,
    1,
    "not an operating underground railway"
  ],
  [
    1,
    1,
    "ahead of groundbreaking"
  ],
  [
    1,
    2,
    "Other named sites still had works underway"
  ],
  [
    1,
    2,
    "every KISIP II site is complete"
  ],
  [
    1,
    3,
    "not 50 million different learners"
  ],
  [
    1,
    3,
    "does not provide a comparison design establishing those effects"
  ],
  [
    1,
    4,
    "not 85 operating hubs"
  ],
  [
    1,
    4,
    "does not establish sustained employment gains"
  ],
  [
    2,
    0,
    "six sub-counties"
  ],
  [
    2,
    0,
    "the plan period"
  ],
  [
    2,
    1,
    "international and national shipping regulation"
  ],
  [
    2,
    2,
    "52 percent"
  ],
  [
    2,
    2,
    "38 percent"
  ],
  [
    2,
    2,
    "not a combined completion rate"
  ],
  [
    2,
    2,
    "not an opening record"
  ],
  [
    2,
    3,
    "do not establish that water reaches every connected home continuously"
  ],
  [
    2,
    4,
    "historical notice, not evidence of present conditions"
  ],
  [
    2,
    4,
    "not observed restoration time"
  ]
];
