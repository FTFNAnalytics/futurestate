import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
export const nordicCitiesHash=value=>createHash('sha256').update(JSON.stringify(value)).digest('hex');
export function assertNordicCitiesDossiers(data,review){
  assert.equal(data.inspected_date,'2026-11-22');assert.equal(data.timezone,'America/Edmonton');
  assert.equal(data.review_policy,'OWNER-AUTHORIZED-AI-REVIEW-2026-09-25');
  assert.equal(review.policy_id,data.review_policy);assert.equal(review.review_date,data.inspected_date);
  assert.equal(data.independent_review,false);assert.equal(data.phase_60_identity_added,false);
  for(const key of ['independent_review','publication_authorized','launch_authorized','phase_216_complete'])assert.equal(review[key],false);
  assert.deepEqual(data.records.map(r=>r.record_id),["project-m3-cityringen","place-copenhagen-municipality","place-helsinki-municipality"]);
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
    assert.equal(review.records.find(d=>d.record_id===r.record_id)?.sha256,nordicCitiesHash(r),'Article changed after exact-version review');
  }
  const [project,copenhagen,helsinki]=data.records;
  assert(project.scope.includes('counted once as the ring railway'));
  assert(project.stage.includes('future contract transition')&&project.stage.includes('M3-only reliability'));
  assert(copenhagen.scope.includes('not Greater Copenhagen, Frederiksberg municipality'));
  assert(copenhagen.stage.includes('no citywide outcome or carbon-neutrality admission'));
  assert(helsinki.scope.includes('not the wider metropolitan region'));
  assert(helsinki.stage.includes('no blanket citywide reliability'));
  assert.deepEqual(project.timeline.map(t=>t.date),['2019-09-29','2024-09-12','2026-02-27','2026-10-13']);
  assert.deepEqual(copenhagen.timeline.map(t=>t.date),['2011','2025-09-18','2026-05-12']);
  assert.deepEqual(helsinki.timeline.map(t=>t.date),['2018-12-05','2024-08-12','2025-04-01','2026-04-29']);
  for(const [ri,si,phrase] of nordicCitiesCriticalPhrases)assert(data.records[ri].sections[si].text.includes(phrase),`Missing bounded claim: ${phrase}`);
  assert.equal(project.historical_acquisition.record_id,'191-PROJECT-006');
  assert.equal(project.historical_acquisition.route,'/review/global/projects/european-union-acquisition-1/');
  assert(project.historical_acquisition.decision.includes('historical'));
  for(const r of [copenhagen,helsinki])assert(!Object.hasOwn(r,'historical_acquisition'),'New municipality must not reuse a historical country docket');
  const source=id=>data.sources.find(s=>s.id===id);
  for(const [id,date] of [['m3-opening','2019-09-29'],['m3-anniversary','2024-09-12'],['m3-january','2026-02-27'],['m3-contract','2026-10-13'],['cph-heat','2026-05-12'],['hel-heat','2025-05-30'],['hel-water','2026-04-29'],['hel-oodi','2023-11-30']])assert.equal(source(id).publication_date,date);
  for(const id of ['m3-frederiksberg','cph-government','cph-climate','cph-mobility','cph-cloudburst','hel-government','hel-tram'])assert.equal(source(id).publication_date,null);
  for(const [id,date] of [['m3-opening','2019-09-29'],['cph-climate','2025-09-18'],['hel-tram','2024-08-12'],['hel-heat','2025-04-01'],['hel-oodi','2018-12-05']])assert.equal(source(id).event_date,date);
  assert.equal(source('m3-january').reference_period,'January 2026');
  assert.equal(source('hel-water').reference_period,'Calendar year 2025');
  assert.equal(data.sources.filter(s=>s.language==='Danish').length,6);
  assert.equal(source('hel-water').language,'English abstract; Finnish metadata');
  for(const s of data.sources)assert(s.inspection.includes('HTML')&&s.inspection.includes('2026-11-22')&&s.inspection.includes('dynamic service feeds were not inspected'));
  assert.equal(review.sources_sha256,nordicCitiesHash(data.sources));assert.equal(review.edition_sha256,nordicCitiesHash(data));
}
export const nordicCitiesCriticalPhrases=[
  [
    0,
    0,
    "not, however, a substitute for a safety authorization"
  ],
  [
    0,
    1,
    "operator’s September 2024 retrospective"
  ],
  [
    0,
    2,
    "lift inventory is not evidence that all lifts were available"
  ],
  [
    0,
    2,
    "Departures and service-status widgets were not verified"
  ],
  [
    0,
    3,
    "M3/M4 together"
  ],
  [
    0,
    3,
    "not M3-only results or counts of unique people"
  ],
  [
    0,
    3,
    "cannot simply be assigned to Cityringen"
  ],
  [
    0,
    4,
    "start in September 2027"
  ],
  [
    0,
    4,
    "handover is still future"
  ],
  [
    1,
    0,
    "different responsible bodies and geographic coverage"
  ],
  [
    1,
    1,
    "replace the earlier KBH2025 plan"
  ],
  [
    1,
    1,
    "adoption does not establish delivery or carbon neutrality"
  ],
  [
    1,
    1,
    "full plans and meeting materials were not inspected"
  ],
  [
    1,
    2,
    "not a measured modal share"
  ],
  [
    1,
    3,
    "eight municipalities"
  ],
  [
    1,
    3,
    "cannot be counted as Copenhagen-only coverage"
  ],
  [
    1,
    4,
    "intended capacity, not commissioned output"
  ],
  [
    1,
    4,
    "dated construction account"
  ],
  [
    2,
    0,
    "regional responsibilities"
  ],
  [
    2,
    1,
    "does not verify today’s timetable"
  ],
  [
    2,
    2,
    "not proof that the city or utility is already carbon neutral"
  ],
  [
    2,
    2,
    "price forecasts are not used as current savings"
  ],
  [
    2,
    2,
    "not assessed against later applicable requirements"
  ],
  [
    2,
    3,
    "not a Helsinki-only volume"
  ],
  [
    2,
    3,
    "full technical tables and permits were not inspected"
  ],
  [
    2,
    4,
    "not a current booking check or an independent evaluation"
  ]
];
