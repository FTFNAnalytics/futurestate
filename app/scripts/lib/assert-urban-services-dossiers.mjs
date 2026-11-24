import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
export const urbanServicesHash=value=>createHash('sha256').update(JSON.stringify(value)).digest('hex');
export function assertUrbanServicesDossiers(data,review){
  assert.equal(data.inspected_date,'2026-11-22');assert.equal(data.timezone,'America/Edmonton');
  assert.equal(data.review_policy,'OWNER-AUTHORIZED-AI-REVIEW-2026-09-25');
  assert.equal(review.policy_id,data.review_policy);assert.equal(review.review_date,data.inspected_date);
  assert.equal(data.independent_review,false);assert.equal(data.phase_60_identity_added,false);
  for(const key of ['independent_review','publication_authorized','launch_authorized','phase_216_complete'])assert.equal(review[key],false);
  assert.deepEqual(data.records.map(r=>r.record_id),["project-madrid-nuevo-norte","place-madrid-municipality","place-mexico-city"]);
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
    assert.equal(review.records.find(d=>d.record_id===r.record_id)?.sha256,urbanServicesHash(r),'Article changed after exact-version review');
  }
  const [project,madrid,mexico]=data.records;
  assert(project.scope.includes('counted once across its four planning areas'));
  assert(project.stage.includes('housing occupancy and future Metro service remain separate'));
  assert(madrid.scope.includes('not the wider Comunidad de Madrid'));
  assert(madrid.stage.includes('citywide outcomes remain separate'));
  assert(mexico.scope.includes('not the entire Valley of Mexico metropolitan region'));
  assert(mexico.stage.includes('official indexed text')&&mexico.stage.includes('no current citywide service'));
  assert.deepEqual(project.timeline.map(t=>t.date),['2020-03-25','2020-07-22','2026-01-29','2026-10-21']);
  assert.deepEqual(madrid.timeline.map(t=>t.date),['2026-06-22','2026-06-24','2026-07-02','2026-11-04']);
  assert.deepEqual(mexico.timeline.map(t=>t.date),['2024-11-27','2025-07-19','2026-04-15']);
  for(const [ri,si,phrase] of urbanServicesCriticalPhrases)assert(data.records[ri].sections[si].text.includes(phrase),`Missing bounded claim: ${phrase}`);
  const historicalIds=['191-PROJECT-007','192-PLACE-003','192-PLACE-018'];
  const historicalRoutes=['/review/global/projects/european-union-acquisition-2/','/review/global/places/european-union-place-acquisition/','/review/global/places/mexico-place-acquisition/'];
  data.records.forEach((r,i)=>{assert.equal(r.historical_acquisition.record_id,historicalIds[i]);assert.equal(r.historical_acquisition.route,historicalRoutes[i]);assert(r.historical_acquisition.decision.includes('historical'));});
  const source=id=>data.sources.find(s=>s.id===id);
  assert.equal(source('mnn-metro').publication_date,null);assert.equal(source('mnn-metro').event_date,'2026-10-16');assert.equal(source('mnn-metro').gazette_date,'2026-10-21');
  assert.equal(source('mnn-water').publication_date,null);
  assert.equal(source('madrid-buses').publication_date,'2026-11-04');
  assert.equal(source('cdmx-boundary').reference_period,'Marco Geoestadístico 2020');
  assert.equal(source('cdmx-cablebus').publication_date,'2024-11-27');
  assert.equal(source('cdmx-household').publication_date,'2025-07-19');
  assert.equal(source('cdmx-register').publication_date,'2026-04-15');assert.equal(source('cdmx-register').reference_period,'Fiscal year 2025');
  for(const s of data.sources){assert.equal(s.language,'Spanish');if(s.id.startsWith('cdmx-'))assert(s.inspection.includes('indexed')&&/502|cache miss|timed out/.test(s.inspection),'Indexed retrieval limit lost');}
  assert.equal(review.sources_sha256,urbanServicesHash(data.sources));assert.equal(review.edition_sha256,urbanServicesHash(data));
}
export const urbanServicesCriticalPhrases=[
  [
    0,
    0,
    "planning milestones, not a single completion date"
  ],
  [
    0,
    1,
    "184 are protected housing and 276 are to be municipally managed"
  ],
  [
    0,
    1,
    "those categories overlap and are not interchangeable"
  ],
  [
    0,
    1,
    "does not establish occupied homes"
  ],
  [
    0,
    2,
    "in 2027 as an objective"
  ],
  [
    0,
    2,
    "attributed commercial account"
  ],
  [
    0,
    3,
    "October 16, 2026 notice"
  ],
  [
    0,
    3,
    "October 21"
  ],
  [
    0,
    3,
    "Only that notice text was inspected here"
  ],
  [
    0,
    4,
    "does not prove those proposed works are now finished"
  ],
  [
    1,
    0,
    "rather than the larger autonomous community"
  ],
  [
    1,
    1,
    "completed four weeks of training"
  ],
  [
    1,
    1,
    "entry into the bus network scheduled for the next day"
  ],
  [
    1,
    1,
    "452 electric buses at that publication date"
  ],
  [
    1,
    2,
    "authority report rather than an independent tenant survey"
  ],
  [
    1,
    3,
    "closed on Mondays"
  ],
  [
    1,
    3,
    "does not establish that those seasonal spaces are available in November"
  ],
  [
    1,
    4,
    "below the excluded El Pardo dam"
  ],
  [
    1,
    4,
    "not a substitute for inspecting repeated water-quality"
  ],
  [
    2,
    0,
    "polygon files themselves were not inspected"
  ],
  [
    2,
    0,
    "limited to its indexed official description"
  ],
  [
    2,
    1,
    "Trips are not unique passengers"
  ],
  [
    2,
    1,
    "not a current daily-service check or a repeated reliability series"
  ],
  [
    2,
    2,
    "does not recommend the harvested water for drinking or preparing food"
  ],
  [
    2,
    2,
    "Linked manuals and evaluations were not inspected"
  ],
  [
    2,
    3,
    "intended coverage, not a count of completed systems"
  ],
  [
    2,
    3,
    "not guidance on current enrolment"
  ],
  [
    2,
    4,
    "attached register was not inspected"
  ],
  [
    2,
    4,
    "no personal beneficiary information is reproduced"
  ]
];
