import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
export const aucklandHash=value=>createHash('sha256').update(JSON.stringify(value)).digest('hex');
export function assertAucklandDossiers(data,review){
  assert.equal(data.inspected_date,'2026-11-22');assert.equal(data.timezone,'America/Edmonton');
  assert.equal(data.review_policy,'OWNER-AUTHORIZED-AI-REVIEW-2026-09-25');
  assert.equal(review.policy_id,data.review_policy);assert.equal(review.review_date,data.inspected_date);
  assert.equal(data.independent_review,false);assert.equal(data.phase_60_identity_added,false);
  for(const key of ['independent_review','publication_authorized','launch_authorized','phase_216_complete'])assert.equal(review[key],false);
  assert.deepEqual(data.records.map(r=>r.record_id),['project-auckland-city-rail-link','project-central-interceptor','place-auckland-council-area']);
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
    assert(r.sections.map(s=>s.text).join(' ').split(/\s+/).length>=450);
    for(const s of r.sections){assert(s.heading&&s.text.length>200);assert(s.source_ids.every(id=>ids.has(id)));if(!s.source_ids.length)assert.equal(s.claim_type,'Editorial evidence test');}
    assert(r.timeline.length>=3);let previous='';
    for(const item of r.timeline){validPeriod(item.date);assert(item.date<=data.inspected_date&&item.date>=previous);previous=item.date;assert(item.event&&item.source_ids.length&&item.source_ids.every(id=>ids.has(id)));}
    assert(r.next_artifacts.length>=3);assert(r.related.every(link=>/^\/atlas\/[a-z0-9/-]+\/$/.test(link.route)));
    assert.equal(review.records.find(d=>d.record_id===r.record_id)?.sha256,aucklandHash(r),'Article changed after exact-version review');
  }
  const [rail,sewer,place]=data.records;
  assert(rail.scope.includes('counted once across its tunnels')&&rail.scope.includes('whole Auckland rail network'));
  assert(rail.stage.includes('Passenger service began September 13, 2026')&&rail.stage.includes('without admitting a long-run comparable outcome series'));
  assert(sewer.scope.includes('dependencies, not additional counted projects'));
  assert(sewer.stage.includes('Full-tunnel operation reported July 20, 2026'));
  assert(place.scope.includes('unitary-authority area')&&place.scope.includes('not only the central city'));
  assert.equal(rail.timeline[0].date,'2026-06-30');assert.equal(rail.timeline[1].date,'2026-09-11');assert.equal(rail.timeline[2].date,'2026-09-13');
  assert.equal(sewer.timeline[0].date,'2025-02');assert.equal(sewer.timeline[1].date,'2025-12');assert.equal(sewer.timeline[2].date,'2026-07-20');
  assert(rail.sections[2].text.includes('528,007')&&rail.sections[2].text.includes('HOP and payment-card data')&&rail.sections[2].text.includes('not unique people or tunnel-only journeys'));
  assert(rail.sections[2].text.includes('early Waitematā fire')&&rail.sections[2].text.includes('base Sunday service resumed'));
  assert(rail.sections[3].text.includes('506,083')&&rail.sections[3].text.includes('1,034,090')&&rail.sections[3].text.includes('September 13–26'));
  assert(rail.sections[4].text.includes('names gifted through the Mana Whenua Forum'));
  assert(sewer.sections[0].text.includes('top-level status still reads Construction')&&sewer.sections[0].text.includes('dated July commissioning account'));
  assert(sewer.sections[2].text.includes('741,000 cubic metres')&&sewer.sections[2].text.includes('by July 1, 2026')&&sewer.sections[2].text.includes('operator estimate')&&sewer.sections[2].text.includes('storage capacity of 299,000 cubic metres.'));
  assert(sewer.sections[3].text.includes('6,000 litres per second')&&sewer.sections[3].text.includes('future design figure'));
  assert(sewer.sections[4].text.includes('November 13 for Avondale and early 2027 for Motions')&&sewer.sections[4].text.includes('do not establish awarded contracts'));
  assert(place.sections[1].text.includes('11,052 submissions')&&place.sections[1].text.includes('rather than a representative satisfaction measure'));
  assert(place.sections[2].text.includes('wastewater role from Auckland Council’s stormwater responsibility'));
  assert(place.sections[3].text.includes('more than 250 properties')&&place.sections[3].text.includes('not an observed count'));
  assert(place.sections[4].text.includes('17 million visits')&&place.sections[4].text.includes('not 17 million distinct residents or a library-only total'));
  const historicalIds=['191-PROJECT-028','191-PROJECT-029','192-PLACE-014'];
  const historicalRoutes=['/review/global/projects/new-zealand-acquisition-1/','/review/global/projects/new-zealand-acquisition-2/','/review/global/places/new-zealand-place-acquisition/'];
  data.records.forEach((r,i)=>{assert.equal(r.historical_acquisition.record_id,historicalIds[i]);assert.equal(r.historical_acquisition.route,historicalRoutes[i]);assert(r.historical_acquisition.decision.includes('historical'));});
  const source=id=>data.sources.find(s=>s.id===id);
  assert.equal(source('crl-overview').publication_date,null);
  assert.equal(source('crl-opening').event_date,'2026-09-11');assert.equal(source('crl-opening').publication_date,'2026-09-11');
  assert.equal(source('crl-week-one').publication_date,'2026-09-21');assert.equal(source('crl-week-one').reference_period,'September 13–19, 2026');
  assert.equal(source('crl-week-two').publication_date,'2026-09-30');assert.equal(source('crl-week-two').reference_period,'September 13–26, 2026');
  assert.equal(source('crl-closeout').event_date,'2026-06-30');assert.equal(source('crl-closeout').publication_date,'2026-10-02');
  assert.equal(source('ci-sites').publication_date,'2026-04-16');assert.equal(source('ci-live').publication_date,'2026-07-20');
  assert.equal(source('ci-live').reference_period,'Southern operation in early 2025 through July 1, 2026; full tunnel reported operational July 20');
  assert.equal(source('ci-herne-bay').publication_date,'2026-11-09');assert.equal(source('ci-western-catchments').publication_date,'2026-11-04');
  assert.equal(source('auckland-local-plans').publication_date,'2026-11-09');assert.equal(source('auckland-flood-works').publication_date,'2026-10-28');
  assert.equal(source('auckland-annual-services').publication_date,'2026-09-30');assert.equal(source('auckland-annual-services').reference_period,'2025/2026 financial-year service summary');
  assert.equal(review.sources_sha256,aucklandHash(data.sources));assert.equal(review.edition_sha256,aucklandHash(data));
}
