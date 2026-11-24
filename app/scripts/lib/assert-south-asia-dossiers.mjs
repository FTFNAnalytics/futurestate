import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
export const southAsiaHash=value=>createHash('sha256').update(JSON.stringify(value)).digest('hex');
export function assertSouthAsiaDossiers(data,review){
  assert.equal(data.inspected_date,'2026-11-21');assert.equal(data.timezone,'America/Edmonton');
  assert.equal(data.review_policy,'OWNER-AUTHORIZED-AI-REVIEW-2026-09-25');
  assert.equal(review.policy_id,data.review_policy);assert.equal(review.review_date,data.inspected_date);
  assert.equal(data.independent_review,false);assert.equal(data.phase_60_identity_added,false);
  for(const key of ['independent_review','publication_authorized','launch_authorized','phase_216_complete'])assert.equal(review[key],false);
  assert.deepEqual(data.records.map(r=>r.record_id),['project-mumbai-metro-line-three','project-dhaka-mrt-line-six','place-greater-mumbai']);
  assert.deepEqual(data.records.map(r=>r.kind),['Project','Project','Place']);
  assert.equal(new Set(data.records.map(r=>r.route)).size,3);
  assert.equal(data.sources.length,9);const ids=new Set(data.sources.map(s=>s.id));assert.equal(ids.size,9);
  const validPeriod=date=>{assert(/^\d{4}(-\d{2}){0,2}$/.test(date));const full=date.length===4?`${date}-01-01`:date.length===7?`${date}-01`:date;assert.equal(new Date(`${full}T00:00:00Z`).toISOString().slice(0,10),full);};
  for(const s of data.sources){
    assert.equal(new URL(s.url).protocol,'https:');assert(s.publisher&&s.role&&s.locator&&s.inspection&&s.boundary);
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
    assert.equal(review.records.find(d=>d.record_id===r.record_id)?.sha256,southAsiaHash(r),'Article changed after exact-version review');
  }
  const [mumbai,dhaka,city]=data.records;
  assert(mumbai.scope.includes('counted once')&&mumbai.stage.startsWith('Operating line reported'));
  assert(dhaka.scope.includes('does not certify')&&dhaka.stage.includes('remain unverified'));
  assert(city.scope.includes('not the whole Mumbai Metropolitan Region')&&city.timeline[0].date==='2019');
  assert.equal(data.sources.find(s=>s.id==='dhaka-road-study-35').publication_period,'2025-02');
  assert.equal(data.sources.find(s=>s.id==='dhaka-road-study-35').reference_period,'January 2022–June 2024');
  assert.equal(data.sources.find(s=>s.id==='dhaka-household-conference').event_date,'2026-01-26');
  assert.equal(data.sources.find(s=>s.id==='dhaka-household-conference').publication_date,'2026-03-03');
  assert.equal(data.sources.find(s=>s.id==='dhaka-jica-visit').publication_date,'2026-07-21');
  assert.equal(data.sources.find(s=>s.id==='mumbai-climate-summary').publication_period,'2022');
  assert.equal(data.sources.find(s=>s.id==='mumbai-budget-circular').document_date,'2025-09-24');
  assert.equal(review.sources_sha256,southAsiaHash(data.sources));assert.equal(review.edition_sha256,southAsiaHash(data));
}
