import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
export const tuasHash=value=>createHash('sha256').update(JSON.stringify(value)).digest('hex');
export function assertTuasDossiers(data,review){
  assert.equal(data.inspected_date,'2026-11-22');assert.equal(data.timezone,'America/Edmonton');
  assert.equal(data.review_policy,'OWNER-AUTHORIZED-AI-REVIEW-2026-09-25');
  assert.equal(review.policy_id,data.review_policy);assert.equal(review.review_date,data.inspected_date);
  assert.equal(data.independent_review,false);assert.equal(data.phase_60_identity_added,false);
  for(const key of ['independent_review','publication_authorized','launch_authorized','phase_216_complete'])assert.equal(review[key],false);
  assert.deepEqual(data.records.map(r=>r.record_id),['project-tuas-port','project-tuas-nexus','place-singapore-west-region']);
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
    assert.equal(review.records.find(d=>d.record_id===r.record_id)?.sha256,tuasHash(r),'Article changed after exact-version review');
  }
  const [port,nexus,place]=data.records;
  assert(port.scope.includes('counted once across its four phases')&&port.scope.includes('Other Singapore terminals'));
  assert(port.stage.includes('Partly operational')&&port.stage.includes('comparable outcome-series admission remain separate'));
  assert(nexus.scope.includes('wider DTSS network are not additional counted projects'));
  assert(nexus.stage.includes('water operation forecast for 2027')&&nexus.stage.includes('no integrated operating-performance admission'));
  assert(place.scope.includes('not a municipality or the whole country')&&place.scope.includes('URA-defined West Region'));
  assert.equal(port.timeline[0].date,'2021-12');assert.equal(port.timeline[1].date,'2022-09-01');
  assert.equal(port.timeline[3].date,'2026-11-10');assert.equal(port.timeline[4].date,'2026-11-20');
  assert.equal(nexus.timeline[0].date,'2013');assert.equal(nexus.timeline[1].date,'2020-05');assert.equal(nexus.timeline[2].date,'2021-08');
  assert(port.sections[0].text.includes('65-million-TEU annual capacity')&&port.sections[0].text.includes('2040s, rather than the port’s present throughput'));
  assert(port.sections[1].text.includes('14 operating berths in Phase 1 as of that account, not as a fresh November 22 census'));
  assert(port.sections[1].text.includes('PSA can then build the terminal'));
  assert(port.sections[2].text.includes('25 million TEUs handled on August 6')&&port.sections[2].text.includes('September 2022 as the start'));
  assert(port.sections[2].text.includes('not one year’s throughput or a measure of spare capacity'));
  assert(port.sections[3].text.includes('progressive operation from 2028')&&port.sections[3].text.includes('Neither the berth total nor the fleet plan becomes an operating inventory'));
  assert(nexus.sections[0].text.includes('old forecast for completion in 2025–26 should remain history'));
  assert(nexus.sections[1].text.includes('650,000-cubic-metre daily treatment module')&&nexus.sections[1].text.includes('150,000 cubic metres per day'));
  assert(nexus.sections[1].text.includes('design rates, not measured daily output'));
  assert(nexus.sections[2].text.includes('5,800-tonne-per-day incineration figure describes the wider design, not the initial phase'));
  assert(nexus.sections[3].text.includes('98-kilometre scheme includes deep tunnels and link sewers')&&nexus.sections[3].text.includes('does not establish that the whole collection and treatment chain was commissioned'));
  assert(nexus.sections[4].text.includes('40 tonnes of combined food waste and sludge daily')&&nexus.sections[4].text.includes('pilot evidence at another site, not Tuas throughput'));
  assert(place.sections[1].text.includes('December 1, 2025')&&place.sections[1].text.includes('does not, by itself, establish construction funding'));
  assert(place.sections[2].text.includes('2027 to 2029')&&place.sections[2].text.includes('60,000 additional households')&&place.sections[2].text.includes('not observed ridership or mode share'));
  assert(place.sections[3].text.includes('39-hectare')&&place.sections[3].text.includes('37 submissions')&&place.sections[3].text.includes('not an awarded construction scheme'));
  assert(place.sections[4].text.includes('2045 net-zero ambition')&&place.sections[4].text.includes('2035 target of at least 85 percent')&&place.sections[4].text.includes('district-specific future targets, not current regional performance'));
  const historicalIds=['191-PROJECT-024','191-PROJECT-025','192-PLACE-012'];
  const historicalRoutes=['/review/global/projects/singapore-acquisition-1/','/review/global/projects/singapore-acquisition-2/','/review/global/places/singapore-place-acquisition/'];
  data.records.forEach((r,i)=>{assert.equal(r.historical_acquisition.record_id,historicalIds[i]);assert.equal(r.historical_acquisition.route,historicalRoutes[i]);assert(r.historical_acquisition.decision.includes('historical'));});
  const source=id=>data.sources.find(s=>s.id===id);
  assert.equal(source('tuas-port-overview').publication_date,null);
  for(const [id,date] of [['tuas-reclamation','2026-11-10'],['tuas-phase-two','2026-11-20'],['tuas-technology','2026-11-20'],['tuas-tunnels','2023-08-21']]){
    assert.equal(source(id).publication_date,date);assert.equal(source(id).event_date,date);
  }
  assert.equal(source('tuas-volume').publication_date,'2026-08-06');assert.equal(source('tuas-volume').reference_period,'September 2022 through the August 6, 2026 announcement');
  assert.equal(source('tuas-water').publication_date,null);assert.equal(source('tuas-water').page_update_date,'2026-03-03');
  assert.equal(source('tuas-waste').publication_date,null);assert.equal(source('tuas-waste').page_update_date,'2025-03-04');
  assert.equal(source('tuas-planning-history').reference_period,'FY2021 account in the 2021/2022 report');
  assert.equal(source('tuas-food-pilot').reference_period,'Content labelled updated as at May 2026');
  assert.equal(source('west-region').page_update_date,'2026-05-07');
  assert.equal(source('west-gazette').publication_date,'2025-12-01');assert.equal(source('west-gazette').effective_date,'2025-12-01');
  for(const id of ['west-connections','west-green','west-economy']){assert.equal(source(id).publication_date,null);assert.equal(source(id).page_update_date,'2026-06-02');}
  assert.equal(review.sources_sha256,tuasHash(data.sources));assert.equal(review.edition_sha256,tuasHash(data));
}
