import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
export const southernAfricaHash=value=>createHash('sha256').update(JSON.stringify(value)).digest('hex');
export function assertSouthernAfricaDossiers(data,review){
  assert.equal(data.inspected_date,'2026-11-21');assert.equal(data.timezone,'America/Edmonton');
  assert.equal(data.review_policy,'OWNER-AUTHORIZED-AI-REVIEW-2026-09-25');
  assert.equal(review.policy_id,data.review_policy);assert.equal(review.review_date,data.inspected_date);
  assert.equal(data.independent_review,false);assert.equal(data.phase_60_identity_added,false);
  for(const key of ['independent_review','publication_authorized','launch_authorized','phase_216_complete'])assert.equal(review[key],false);
  assert.deepEqual(data.records.map(r=>r.record_id),['project-lesotho-highlands-phase-two','place-mokhotlong-district','place-cape-town-municipality']);
  assert.deepEqual(data.records.map(r=>r.kind),['Project','Place','Place']);
  assert.equal(new Set(data.records.map(r=>r.route)).size,3);
  assert.equal(data.sources.length,12);const ids=new Set(data.sources.map(s=>s.id));assert.equal(ids.size,12);
  for(const s of data.sources){
    assert.equal(new URL(s.url).protocol,'https:');assert(s.publisher&&s.role&&s.locator&&s.inspection&&s.boundary);
    assert(Object.hasOwn(s,'publication_date'));
    for(const [key,date] of Object.entries(s).filter(([k])=>k.endsWith('_date')))if(date!==null){
      assert(/^\d{4}-\d{2}-\d{2}$/.test(date));assert.equal(new Date(`${date}T00:00:00Z`).toISOString().slice(0,10),date);
      // An announced effective date may be future; an inspection/publication/event may not.
      if(key!=='effective_date')assert(date<=data.inspected_date);
    }
    if(s.publication_period){assert(/^\d{4}-\d{2}$/.test(s.publication_period));assert(s.publication_period<=data.inspected_date.slice(0,7));assert.equal(s.publication_date,null);assert(s.period_basis);}
    if(s.index_url)assert.equal(new URL(s.index_url).protocol,'https:');
  }
  for(const r of data.records){
    assert.equal(r.identity_decision.eligible_count,1);assert(r.identity_decision.rationale.length>150);
    assert.equal(r.sections.length,6);assert.equal(new Set(r.sections.map(s=>s.heading)).size,6);
    assert(r.sections.map(s=>s.text).join(' ').split(/\s+/).length>=450);
    for(const s of r.sections){assert(s.heading&&s.text.length>200);assert(s.source_ids.every(id=>ids.has(id)));if(!s.source_ids.length)assert.equal(s.claim_type,'Editorial evidence test');}
    assert(r.timeline.length>=3);let previous='';
    for(const item of r.timeline){assert(/^\d{4}(-\d{2}){0,2}$/.test(item.date));assert(item.date<=data.inspected_date&&item.date>=previous);previous=item.date;assert(item.event&&item.source_ids.length&&item.source_ids.every(id=>ids.has(id)));}
    assert(r.next_artifacts.length>=3);assert(r.related.every(link=>/^\/atlas\/[a-z0-9/-]+\/$/.test(link.route)));
    assert.equal(review.records.find(d=>d.record_id===r.record_id)?.sha256,southernAfricaHash(r),'Article changed after exact-version review');
  }
  const [project,district,city]=data.records;
  assert(project.scope.includes('counted once')&&project.stage.startsWith('Under construction'));
  assert(district.scope.includes('not only Mokhotlong town')&&district.timeline[0].date==='2016');
  assert(city.scope.includes('not the same geography')&&city.answer.includes('December 1 start'));
  const restrictions=data.sources.find(s=>s.id==='cape-town-november');
  assert.equal(restrictions.publication_date,'2026-11-16');assert.equal(restrictions.effective_date,'2026-12-01');
  assert(restrictions.effective_date>data.inspected_date);assert(city.sections[2].text.includes('not yet in force'));
  assert.equal(data.sources.find(s=>s.id==='lesotho-census-2016').reference_period,'2016');
  assert.equal(review.sources_sha256,southernAfricaHash(data.sources));assert.equal(review.edition_sha256,southernAfricaHash(data));
}
