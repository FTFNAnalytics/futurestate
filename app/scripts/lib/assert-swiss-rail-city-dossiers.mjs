import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
export const swissRailCityHash=value=>createHash('sha256').update(JSON.stringify(value)).digest('hex');
export function assertSwissRailCityDossiers(data,review){
  assert.equal(data.inspected_date,'2026-11-22');assert.equal(data.timezone,'America/Edmonton');
  assert.equal(data.review_policy,'OWNER-AUTHORIZED-AI-REVIEW-2026-09-25');
  assert.equal(review.policy_id,data.review_policy);assert.equal(review.review_date,data.inspected_date);
  assert.equal(data.independent_review,false);assert.equal(data.phase_60_identity_added,false);
  for(const key of ['independent_review','publication_authorized','launch_authorized','phase_216_complete'])assert.equal(review[key],false);
  assert.deepEqual(data.records.map(r=>r.record_id),["project-gotthard-base-tunnel","project-ceneri-base-tunnel","place-zurich-municipality"]);
  assert.deepEqual(data.records.map(r=>r.kind),['Project','Project','Place']);
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
    assert.equal(review.records.find(d=>d.record_id===r.record_id)?.sha256,swissRailCityHash(r),'Article changed after exact-version review');
  }
  const [gotthard,ceneri,zurich]=data.records;
  assert(gotthard.scope.includes('counted once across its two tubes'));
  assert(ceneri.scope.includes('counted once across its two tubes'));
  assert(zurich.scope.includes('not Canton Zürich, Winterthur'));
  assert(gotthard.stage.includes('No blanket risk or freight-outcome admission'));
  assert(ceneri.stage.includes('Regional approach works and recurring performance remain separate'));
  assert(zurich.stage.includes('no current discounted-fare, occupied-housing or citywide outcome admission'));
  assert.deepEqual(gotthard.timeline.map(t=>t.date),['2016-06-01','2016-12','2023-08-10','2024-09-02','2026-05-11']);
  assert.deepEqual(ceneri.timeline.map(t=>t.date),['2020-09-04','2020-12-01','2020-12-13','2021-03-22']);
  assert(ceneri.timeline[2].event.includes('Scheduled')&&ceneri.timeline[2].event.includes('not a same-day observation'));
  assert.deepEqual(zurich.timeline.map(t=>t.date),['2025-01-22','2025-09-28','2026-06-09','2026-09']);
  for(const r of data.records)assert(!Object.hasOwn(r,'historical_acquisition'),'New Swiss identity must not reuse a historical jurisdiction docket');
  for(const [ri,si,phrase] of swissRailCityCriticalPhrases)assert(data.records[ri].sections[si].text.includes(phrase),`Missing bounded claim: ${phrase}`);
  const sectionSources=[[["gotthard-nrla"],["gotthard-return","gotthard-detectors"],["gotthard-response"],["gotthard-detectors"],["gotthard-freight"],[]],[["ceneri-opening","gotthard-nrla"],["ceneri-permit","gotthard-nrla"],["ceneri-approach"],["ceneri-etcs"],["ceneri-clearance"],[]],[["zurich-boundary"],["zurich-fares"],["zurich-josef"],["zurich-water"],["zurich-water-data"],[]]];
  assert.deepEqual(data.records.map(r=>r.sections.map(s=>s.source_ids)),sectionSources,'Claim-to-source bindings changed');
  const source=id=>data.sources.find(s=>s.id===id);
  const sourceDates=[["gotthard-nrla","2025-06-11"],["gotthard-return","2023-08-16"],["gotthard-response","2025-09-11"],["gotthard-detectors","2026-05-12"],["gotthard-freight","2025-11-19"],["ceneri-opening","2020-09-04"],["ceneri-permit","2020-12-01"],["ceneri-approach","2021-03-24"],["ceneri-etcs","2025-07-29"],["ceneri-clearance","2025-05-20"],["zurich-boundary",null],["zurich-fares",null],["zurich-josef",null],["zurich-water",null],["zurich-water-data","2025-01-28"]];
  for(const [id,date] of sourceDates)assert.equal(source(id).publication_date,date);
  assert.equal(source('gotthard-return').updated_date,'2024-09-02');
  assert.equal(source('gotthard-detectors').event_date,'2026-05-11');
  assert.equal(source('gotthard-detectors').event_period,'Night of May 10–11, 2026');
  assert.equal(source('gotthard-freight').reference_period,'Calendar year 2024');
  assert(source('gotthard-response').boundary.includes('not direct inspection'));
  assert.equal(source('ceneri-permit').scheduled_date,'2020-12-13');
  assert.equal(source('ceneri-approach').event_date,'2021-03-22');
  assert.equal(source('zurich-boundary').updated_date,'2026-11-19');
  assert.equal(source('zurich-fares').publication_period,'2026-09');
  assert(source('zurich-fares').period_basis.includes('official URL'));
  assert.equal(source('zurich-fares').event_date,'2025-09-28');
  assert.equal(source('zurich-josef').event_date,'2025-01-22');
  assert.equal(source('zurich-water-data').updated_date,'2026-06-09');
  assert.equal(source('zurich-water-data').reference_period,'Annual resources for 2023–2025');
  assert.deepEqual(['German','Italian','English'].map(lang=>data.sources.filter(s=>s.language===lang).length),[8,2,5]);
  for(const s of data.sources)assert(s.inspection.includes('HTML')&&s.inspection.includes('2026-11-22')&&s.inspection.includes('dynamic feeds were not inspected'));
  assert.equal(review.sources_sha256,swissRailCityHash(data.sources));assert.equal(review.edition_sha256,swissRailCityHash(data));
}
export const swissRailCityCriticalPhrases=[
  [
    0,
    0,
    "not as the whole programme or as separate projects for each tube"
  ],
  [
    0,
    1,
    "does not mean every technical restriction had disappeared"
  ],
  [
    0,
    2,
    "operator's account of the regulatory response, not direct review"
  ],
  [
    0,
    3,
    "detectors cannot prevent derailments"
  ],
  [
    0,
    3,
    "does not supply a repeated before-and-after incident study"
  ],
  [
    0,
    4,
    "corridor-wide results, not Gotthard-only performance"
  ],
  [
    0,
    4,
    "down 2.6 percentage points from 2022"
  ],
  [
    1,
    0,
    "distinct project from the longer Gotthard tunnel"
  ],
  [
    1,
    1,
    "permission for scheduled passenger and freight operation"
  ],
  [
    1,
    1,
    "without treating the September ceremony as the start of the final timetable"
  ],
  [
    1,
    2,
    "March 22"
  ],
  [
    1,
    2,
    "final April 5 timetable was still future"
  ],
  [
    1,
    2,
    "not a second Ceneri completion"
  ],
  [
    1,
    3,
    "not a Ceneri-specific reliability series"
  ],
  [
    1,
    4,
    "programme-level capability, not a count of freight trains"
  ],
  [
    2,
    0,
    "not the polygon files"
  ],
  [
    2,
    1,
    "not a current discounted fare"
  ],
  [
    2,
    1,
    "no earlier than spring 2028 if accepted"
  ],
  [
    2,
    2,
    "already completed energy centre"
  ],
  [
    2,
    2,
    "not occupied homes or an open pool"
  ],
  [
    2,
    2,
    "from 2035 at the earliest"
  ],
  [
    2,
    3,
    "part of the demand of 67 additional municipalities"
  ],
  [
    2,
    3,
    "not a verified total of work completed in the current year"
  ],
  [
    2,
    4,
    "not necessarily zero concentration"
  ],
  [
    2,
    4,
    "no CSV analysis or compliance conclusion is claimed"
  ]
];
