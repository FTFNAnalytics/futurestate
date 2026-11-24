import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
export const portCitiesHash=value=>createHash('sha256').update(JSON.stringify(value)).digest('hex');
export function assertPortCitiesDossiers(data,review){
  assert.equal(data.inspected_date,'2026-11-22');assert.equal(data.timezone,'America/Edmonton');
  assert.equal(data.review_policy,'OWNER-AUTHORIZED-AI-REVIEW-2026-09-25');
  assert.equal(review.policy_id,data.review_policy);assert.equal(review.review_date,data.inspected_date);
  assert.equal(data.independent_review,false);assert.equal(data.phase_60_identity_added,false);
  for(const key of ['independent_review','publication_authorized','launch_authorized','phase_216_complete'])assert.equal(review[key],false);
  assert.deepEqual(data.records.map(r=>r.record_id),["project-busan-new-port","place-busan-metropolitan-city","place-hamburg-city-state"]);
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
    assert.equal(review.records.find(d=>d.record_id===r.record_id)?.sha256,portCitiesHash(r),'Article changed after exact-version review');
  }
  const [port,busan,hamburg]=data.records;
  assert(port.scope.includes('spanning Gangseo-gu in Busan and Jinhae-gu in Changwon')&&port.scope.includes('counted once rather than once per terminal'));
  assert(port.stage.includes('dated Terminal 7 opening')&&port.stage.includes('comparable outcome-series admission remain separate'));
  assert(busan.scope.includes('One Busan Metropolitan City administrative area')&&busan.scope.includes('also extends into Changwon'));
  assert(busan.stage.includes('no uniform citywide outcome'));
  assert(hamburg.scope.includes('municipality and city-state')&&hamburg.scope.includes('not the wider Hamburg metropolitan region'));
  assert(hamburg.stage.includes('no citywide outcome-series admission'));
  assert.deepEqual(port.timeline.map(t=>t.date),['1995','2023-10-27','2024-04-05']);
  assert.deepEqual(busan.timeline.map(t=>t.date),['2023-09','2024-09','2025-07-05','2026-02-10','2026-09-08']);
  assert.deepEqual(hamburg.timeline.map(t=>t.date),['2022','2025-02-25','2026-04-23','2026-05','2026-09-01']);
  assert(hamburg.timeline[0].event.includes('autumn'));
  for(const [recordIndex,sectionIndex,phrase] of portCitiesCriticalPhrases)assert(data.records[recordIndex].sections[sectionIndex].text.includes(phrase),`Missing bounded claim: ${phrase}`);
  const historicalIds=['191-PROJECT-022','192-PLACE-011','192-PLACE-005'];
  const historicalRoutes=['/review/global/projects/south-korea-acquisition-1/','/review/global/places/south-korea-place-acquisition/','/review/global/places/germany-place-acquisition/'];
  data.records.forEach((r,i)=>{assert.equal(r.historical_acquisition.record_id,historicalIds[i]);assert.equal(r.historical_acquisition.route,historicalRoutes[i]);assert(r.historical_acquisition.decision.includes('historical'));});
  const source=id=>data.sources.find(s=>s.id===id);
  assert.equal(source('busan-port-demo').publication_date,'2023-10-30');assert.equal(source('busan-port-demo').event_date,'2023-10-27');
  assert.equal(source('busan-port-opening').publication_date,null);assert.equal(source('busan-port-opening').event_date,'2024-04-05');assert.equal(source('busan-port-opening').language,'Korean');
  assert.equal(source('busan-districts').publication_date,null);assert(source('busan-districts').boundary.includes('December 31, 2024')&&source('busan-districts').boundary.includes('June 30, 2022'));
  assert.equal(source('busan-tabara').publication_date,null);
  assert.equal(source('busan-expressway').publication_date,'2026-02-10');assert.equal(source('busan-expressway').event_date,'2026-02-10');
  assert.equal(source('busan-parks').publication_date,'2026-09-08');
  assert.equal(source('hamburg-adaptation').publication_date,null);assert.equal(source('hamburg-adaptation').event_date,'2025-02-25');
  assert.equal(source('hamburg-u5').publication_date,null);
  assert.equal(source('hamburg-water-cargo').publication_date,'2026-04-23');assert.equal(source('hamburg-water-cargo').event_date,'2026-04-23');
  assert.equal(source('hamburg-summer').publication_date,'2026-09-01');assert.equal(source('hamburg-summer').reference_period,'Meteorological summer 2026');
  for(const id of ['hamburg-adaptation','hamburg-u5','hamburg-water-cargo','hamburg-summer'])assert.equal(source(id).language,'German');
  assert.equal(review.sources_sha256,portCitiesHash(data.sources));assert.equal(review.edition_sha256,portCitiesHash(data));
}
export const portCitiesCriticalPhrases=[
  [
    0,
    0,
    "across the boundary in Changwon's Jinhae district"
  ],
  [
    0,
    0,
    "beginning in 1995 and extending into the 2030s"
  ],
  [
    0,
    1,
    "October 30, 2023 completion account describes a demonstration scheduled for October 27"
  ],
  [
    0,
    1,
    "remotely controlled berth cranes"
  ],
  [
    0,
    1,
    "not an absence of workers"
  ],
  [
    0,
    1,
    "anticipated safety and productivity benefits"
  ],
  [
    0,
    2,
    "dated April 5, 2024"
  ],
  [
    0,
    2,
    "avoids declaring the entire New Port programme finished"
  ],
  [
    0,
    3,
    "do not quantify whole-chain emissions"
  ],
  [
    0,
    4,
    "airport as conditional on its opening"
  ],
  [
    1,
    0,
    "fifteen autonomous districts and one county"
  ],
  [
    1,
    1,
    "not proof that every household already reaches"
  ],
  [
    1,
    2,
    "September 2023 pilot"
  ],
  [
    1,
    2,
    "September 2024 city-led rollout"
  ],
  [
    1,
    2,
    "July 5, 2025 extension"
  ],
  [
    1,
    2,
    "rather than an all-city replacement"
  ],
  [
    1,
    3,
    "February 10, 2026 as service entry after a ceremony the previous day"
  ],
  [
    1,
    3,
    "outer ring as still incomplete"
  ],
  [
    1,
    3,
    "42 to 11 minutes is not a measured post-opening journey series"
  ],
  [
    1,
    4,
    "expected attendance is a planning figure, not a count"
  ],
  [
    2,
    0,
    "rather than the larger metropolitan region"
  ],
  [
    2,
    1,
    "February 25, 2025"
  ],
  [
    2,
    1,
    "Strategy adoption gives the work a policy basis"
  ],
  [
    2,
    2,
    "autumn 2022"
  ],
  [
    2,
    2,
    "planned trial between Sengelmannstrasse and City Nord in 2027"
  ],
  [
    2,
    2,
    "prospective first passenger service there in 2029"
  ],
  [
    2,
    2,
    "May 2026 preferred-route decision"
  ],
  [
    2,
    3,
    "April 23, 2026"
  ],
  [
    2,
    3,
    "HVO100 fuel; this is not a zero-emission whole transport chain"
  ],
  [
    2,
    4,
    "eleven days above 30 degrees Celsius at the airport station"
  ],
  [
    2,
    4,
    "not a uniform measure of heat exposure"
  ],
  [
    2,
    4,
    "supplement to official measurements"
  ]
];
