import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
export const koreaEnergyCitiesHash=value=>createHash('sha256').update(JSON.stringify(value)).digest('hex');
export function assertKoreaEnergyCitiesDossiers(data,review){
  assert.equal(data.inspected_date,'2026-11-22');assert.equal(data.timezone,'America/Edmonton');
  assert.equal(data.review_policy,'OWNER-AUTHORIZED-AI-REVIEW-2026-09-25');
  assert.equal(review.policy_id,data.review_policy);assert.equal(review.review_date,data.inspected_date);
  assert.equal(data.independent_review,false);assert.equal(data.phase_60_identity_added,false);
  for(const key of ['independent_review','publication_authorized','launch_authorized','phase_216_complete'])assert.equal(review[key],false);
  assert.deepEqual(data.records.map(r=>r.record_id),["project-sihwa-tidal-power","place-seoul","place-incheon"],'Exact record_id boundary changed');
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
    assert.equal(review.records.find(d=>d.record_id===r.record_id)?.sha256,koreaEnergyCitiesHash(r),'Article changed after exact-version review');
  }
  assert.deepEqual(data.records.map(r=>r.scope),["One named tidal generating plant at Sihwa Lake, including its turbines and sluice structures. The wider reclamation programme, lake catchment, visitor centre and other K-water generation assets are not additional counted projects.","One Seoul metropolitan municipality. The wider capital region, neighbouring Incheon, individual districts, housing-renewal areas and the Seongsu demonstration are not additional counted places or projects in this account.","One Incheon Metropolitan City territory including its counties and islands. Districts, island service areas, individual ships, housing allocations and the wider Seoul capital region are not additional counted identities in this account."],'Exact scope boundary changed');
  assert.deepEqual(data.records.map(r=>r.stage),["K-water dates commercial operation to August 3, 2011 and construction completion to November 14 that year. Later Korean reporting supplies generation context, but legacy estimates, company-category totals and environmental claims are not a single independently accepted asset-performance series.","Current official descriptions include household water services and transport coverage, a reported consumption survey, housing-process milestones and a future hydrothermal supply agreement. These are not interchangeable evidence of completed housing, measured heat savings or universal service access.","Official 2026 accounts record a revised district structure, a working island-water office, housing applications and an operating hospital ship, alongside separate ferry-policy announcements. Announced eligibility changes and planned care integration are not verified universal service or measured household outcomes."],'Exact stage boundary changed');
  assert.deepEqual(data.records.map(r=>r.route),["/atlas/projects/sihwa-tidal-power/","/atlas/places/seoul/","/atlas/places/incheon/"],'Exact route boundary changed');
  assert.deepEqual(data.records.map(r=>r.aliases),[["Sihwa tidal power","Siwha tidal plant","시화호 조력발전소","Sihwa Lake power station"],["Seoul","서울특별시","Seoul Metropolitan Government","Seoul municipality"],["Incheon","인천광역시","Incheon Metropolitan City","Incheon municipal systems"]],'Exact aliases boundary changed');
  assert.deepEqual(data.records.map(r=>r.timeline),[[{"date":"1994-01","event":"The legacy operator chronology records completion of the embankment.","source_ids":["sihwa-design"]},{"date":"2000-12","event":"The lake plan changed from freshwater to seawater use, according to the operator's chronology.","source_ids":["sihwa-design"]},{"date":"2004-12-31","event":"The later operator history dates the start of plant construction.","source_ids":["sihwa-operation"]},{"date":"2011-08-03","event":"K-water dates commercial operation to this day, separately from construction completion.","source_ids":["sihwa-operation"]},{"date":"2011-11-14","event":"K-water records construction completion after the commercial-operation milestone.","source_ids":["sihwa-operation"]}],[{"date":"2026-03-04","event":"The city announced its hydrothermal supply agreement for Seongsu K-PROJECT; the English page followed March 10.","source_ids":["seoul-heat"]},{"date":"2026-03-10","event":"Extended household water-inspection hours were announced to start; publication followed March 11.","source_ids":["seoul-water-service"]},{"date":"2026-09-21","event":"The city held the housing-policy review event later published in its October 2 English account.","source_ids":["seoul-housing"]},{"date":"2026-10-01","event":"The Climate Card page identifies this as the effective date for its described short-term coverage.","source_ids":["seoul-climate-card"]},{"date":"2026-11-20","event":"The English page published the 2026 Arisu survey account carrying a separate November 6 dateline.","source_ids":["seoul-water-survey"]}],[{"date":"2026-01-09","event":"The Yeongjong Ongjin water office began work, before its January 16 opening ceremony.","source_ids":["incheon-water"]},{"date":"2026-01-26","event":"The city and ministry visited the operating hospital ship and island care services.","source_ids":["incheon-hospital-ship"]},{"date":"2026-05-17","event":"The city reported 1,275 applications for a 300-home purchased-rental programme.","source_ids":["incheon-housing-applications"]},{"date":"2026-07-01","event":"The revised two-county, nine-district structure began, reported the following day.","source_ids":["incheon-districts"]},{"date":"2026-07-21","event":"The city announced withdrawal of out-of-city visitor ferry support from July 25, retaining other categories.","source_ids":["incheon-ferry-visitors"]},{"date":"2026-09-17","event":"The city announced an island-worker support extension with intended September 21 effect.","source_ids":["incheon-ferry-workers"]}]],'Exact timeline boundary changed');
  assert.deepEqual(data.records.map(r=>r.sections.map(s=>s.source_ids)),[[["sihwa-design"],["sihwa-operation"],["sihwa-water"],["sihwa-design","sihwa-output"],["sihwa-visitor"],[]],[["seoul-water-service"],["seoul-water-survey"],["seoul-housing"],["seoul-heat"],["seoul-climate-card"],[]],[["incheon-districts"],["incheon-water"],["incheon-housing-rules","incheon-housing-applications"],["incheon-ferry-visitors","incheon-ferry-workers"],["incheon-hospital-ship"],[]]],'Claim-to-source bindings changed');
  for(const r of data.records)assert(!Object.hasOwn(r,'historical_acquisition'),'New Korean identity must not reuse a historical country docket');
  for(const [ri,si,phrase] of koreaEnergyCitiesCriticalPhrases)assert(data.records[ri].sections[si].text.includes(phrase),'Missing bounded claim: '+phrase);
  assert.deepEqual(data.sources,[{"id":"sihwa-design","title":"Legacy Sihwa tidal project overview","publisher":"K-water","role":"Historical engineering and project rationale","url":"https://www.kwater.or.kr/eng/busi/project03Page.do?s_mid=1192","publication_date":null,"language":"English","interpretation_note":"Official English text assessed by Codex under the owner-authorized AI policy; no independent subject or language review claimed.","locator":"Project outline and development chronology","access_mode":"HTML body","inspection":"Specified official HTML body or segment inspected on 2026-11-22; linked files, forms, maps, videos and live services were not tested","boundary":"552.7 GWh is a legacy overview estimate, not measured 2025 output; the old completion table is not current commissioning evidence.","embankment_completion_period":"1994-01","seawater_policy_change_period":"2000-12","project_decision_period":"2002-12"},{"id":"sihwa-operation","title":"K-water tidal generation history","publisher":"K-water","role":"Historical construction and commercial-operation dates","url":"https://www.kwater.or.kr/eng/busi/rene07Page.do?s_mid=1186","publication_date":null,"language":"English","interpretation_note":"Official English text assessed by Codex under the owner-authorized AI policy; no independent subject or language review claimed.","locator":"Sihwa subsection only; wider 2017 statistics excluded","access_mode":"HTML body","inspection":"Specified official HTML body or segment inspected on 2026-11-22; linked files, forms, maps, videos and live services were not tested","boundary":"Commercial operation and construction completion are different milestones. The inconsistent 26 MW unit entry and freshwater wording are not used.","commercial_operation_date":"2011-08-03","construction_start_date":"2004-12-31","construction_completion_date":"2011-11-14"},{"id":"sihwa-water","title":"Clean energy and Sihwa tidal generation","publisher":"K-water","role":"Korean facility and water-circulation overview","url":"https://www.kwater.or.kr/busi/water03/cleanInfoPage.do?s_mid=28","publication_date":null,"language":"Korean","interpretation_note":"Korean text interpreted and self-reviewed by Codex under the owner-authorized AI policy; no independent language review claimed.","locator":"Tidal generation paragraph and dated facility inventory","access_mode":"HTML body","inspection":"Specified official HTML body or segment inspected on 2026-11-22; linked files, forms, maps, videos and live services were not tested","boundary":"Operator attributes water-quality improvement to circulation; this is not an independently analysed ecological series. Inventory basis is not publication date.","facility_inventory_period":"2025-12"},{"id":"sihwa-output","title":"Generation by energy type","publisher":"K-water","role":"Annual operator generation table","url":"https://m.kwater.or.kr/water/sub09/carb01Page.do?s_mid=2131","publication_date":null,"language":"Korean","interpretation_note":"Korean text interpreted and self-reviewed by Codex under the owner-authorized AI policy; no independent language review claimed.","locator":"2020–2025 generation table, tidal category and GWh unit","access_mode":"HTML body","inspection":"Specified official HTML body or segment inspected on 2026-11-22; linked files, forms, maps, videos and live services were not tested","boundary":"The table is the operator's tidal category, not an explicitly named plant row or an availability series; shares refer to K-water's mix.","reporting_period":"2020–2025"},{"id":"sihwa-visitor","title":"Sihwa tidal culture centre visitor information","publisher":"K-water","role":"Published visitor facilities and access arrangements","url":"https://www.kwater.or.kr/cust/sub02/sub02/sub04/promotion2Page.do?s_mid=1055","publication_date":null,"language":"Korean","interpretation_note":"Korean text interpreted and self-reviewed by Codex under the owner-authorized AI policy; no independent language review claimed.","locator":"Centre, observatory, access, loans and floor-by-floor exhibition descriptions","access_mode":"HTML body","inspection":"Specified official HTML body or segment inspected on 2026-11-22; linked files, forms, maps, videos and live services were not tested","boundary":"Hours differ by facility; third-floor history hall is described as future provision, not an already open exhibit."},{"id":"seoul-water-service","title":"Extended Arisu household water inspections","publisher":"Seoul Metropolitan Government","role":"Dated service announcement","url":"https://english.seoul.go.kr/arisu-water-quality-inspections-now-available-at-night-and-on-public-holidays-with-just-a-call-or-click/","publication_date":"2026-03-11","language":"English","interpretation_note":"Official English text assessed by Codex under the owner-authorized AI policy; no independent subject or language review claimed.","locator":"Extended hours, five parameters and reservation/service workflow","access_mode":"HTML body","inspection":"Specified official HTML body or segment inspected on 2026-11-22; linked files, forms, maps, videos and live services were not tested","boundary":"The five-parameter check is not comprehensive contaminant certification; May contactless collection was a plan in this March release.","announced_service_start_date":"2026-03-10"},{"id":"seoul-water-survey","title":"Seoul reports 2026 Arisu consumption survey","publisher":"Seoul Metropolitan Government","role":"Published survey summary","url":"https://english.seoul.go.kr/three-in-four-seoul-residents-drink-arisu-tap-water-with-the-share-rising-for-the-second-consecutive-year/","publication_date":"2026-11-20","language":"English","interpretation_note":"Official English text assessed by Codex under the owner-authorized AI policy; no independent subject or language review claimed.","locator":"Survey findings, expanded consumption definition and fountain preferences","access_mode":"HTML body","inspection":"Specified official HTML body or segment inspected on 2026-11-22; linked files, forms, maps, videos and live services were not tested","boundary":"Reported consumption is not direct water-quality testing or a demonstrated causal effect of inspections; November 6 dateline differs from page publication.","press_dateline_date":"2026-11-06","reporting_period":"2026"},{"id":"seoul-housing","title":"Housing policy review and renewal milestones","publisher":"Seoul Metropolitan Government","role":"Dated municipal account of housing stages","url":"https://english.seoul.go.kr/mayor-oh-answers-with-facts-and-numbers-about-housing-policy-214-sintong-projects-completed-area-designation-168-moa-town-projects-established-associations/","publication_date":"2026-10-02","language":"English","interpretation_note":"Official English text assessed by Codex under the owner-authorized AI policy; no independent subject or language review claimed.","locator":"Headline, event date and renewal-stage paragraphs","access_mode":"HTML body","inspection":"Specified official HTML body or segment inspected on 2026-11-22; linked files, forms, maps, videos and live services were not tested","boundary":"Area designation and associations are not completed homes. Conflicting start/completion wording for 310,000 units is excluded.","event_date":"2026-09-21","press_dateline_date":"2026-09-23"},{"id":"seoul-heat","title":"Hydrothermal agreement for Seongsu K-PROJECT","publisher":"Seoul Metropolitan Government","role":"Public-private heat-source agreement announcement","url":"https://english.seoul.go.kr/smg-to-introduce-hydrothermal-energy-at-seongsu-dong-k-project-reducing-heating-and-cooling-energy-use-by-31/","publication_date":"2026-03-10","language":"English","interpretation_note":"Official English text assessed by Codex under the owner-authorized AI policy; no independent subject or language review claimed.","locator":"Agreement, raw-water infrastructure, projected savings and delivery schedule","access_mode":"HTML body","inspection":"Specified official HTML body or segment inspected on 2026-11-22; linked files, forms, maps, videos and live services were not tested","boundary":"31% is expected energy saving, not a measured operating result; the later supply target is not current service.","announcement_date":"2026-03-04","supply_target_period":"after 2028-02"},{"id":"seoul-climate-card","title":"Climate Card short-term service coverage","publisher":"Seoul Metropolitan Government","role":"Published transport product and coverage description","url":"https://english.seoul.go.kr/policy/transportation/climate-card/","publication_date":null,"language":"English","interpretation_note":"Official English text assessed by Codex under the owner-authorized AI policy; no independent subject or language review claimed.","locator":"Discontinuation notice and short-term coverage paragraphs, not the full station table","access_mode":"HTML body","inspection":"Specified official HTML body or segment inspected on 2026-11-22; linked files, forms, maps, videos and live services were not tested","boundary":"Short-term coverage differs from the resident Climate Pass. Airport alighting exception is not permission to board there; scheduled launch is not observed launch.","recharge_end_date":"2026-08-31","effective_date":"2026-10-01"},{"id":"incheon-districts","title":"Incheon launches revised district structure","publisher":"Incheon Metropolitan City","role":"Dated administrative reorganization account","url":"https://www.incheon.go.kr/mayor_9/MA05010000/view?curPage=42&repSeq=DOM_0000000015062218","publication_date":"2026-07-02","language":"Korean","interpretation_note":"Korean text interpreted and self-reviewed by Codex under the owner-authorized AI policy; no independent language review claimed.","locator":"Two counties and nine districts and July 1 launch paragraphs","access_mode":"HTML body","inspection":"Specified official HTML body or segment inspected on 2026-11-22; linked files, forms, maps, videos and live services were not tested","boundary":"The reorganization is not a measured improvement in services; subdivisions do not add metropolitan place identities.","effective_date":"2026-07-01"},{"id":"incheon-water","title":"Yeongjong Ongjin water office opening ceremony","publisher":"Incheon Metropolitan City Waterworks Headquarters","role":"Dated island-service organization account","url":"https://www.incheon.go.kr/IC010205/view?repDt=2026-01-16&repSeq=DOM_0000000013958819","publication_date":"2026-01-16","language":"Korean","interpretation_note":"Korean text interpreted and self-reviewed by Codex under the owner-authorized AI policy; no independent language review claimed.","locator":"Business start, ceremony and consolidation of four bodies","access_mode":"HTML body","inspection":"Specified official HTML body or segment inspected on 2026-11-22; linked files, forms, maps, videos and live services were not tested","boundary":"January 9 work start differs from January 16 ceremony; faster emergency response is expected, not a measured result.","work_start_date":"2026-01-09","ceremony_date":"2026-01-16"},{"id":"incheon-housing-rules","title":"Purchased rental housing programme for 2026","publisher":"Incheon Metropolitan City housing portal","role":"Programme scope and conditions","url":"https://www.incheon.go.kr/housing/hou060102","publication_date":null,"language":"Korean","interpretation_note":"Korean text interpreted and self-reviewed by Codex under the owner-authorized AI policy; no independent language review claimed.","locator":"Purchased-rental definition, 2026 scope, charges and staged process","access_mode":"HTML body","inspection":"Specified official HTML body or segment inspected on 2026-11-22; linked files, forms, maps, videos and live services were not tested","boundary":"Separate from the jeonse-rental scheme. Deposit and management charges are additional; Ganghwa and Ongjin are outside this supply area.","page_updated_date":"2026-04-20","programme_period":"2026"},{"id":"incheon-housing-applications","title":"Purchased rental housing applications close","publisher":"Incheon Metropolitan City","role":"Dated application-stage result","url":"https://www.incheon.go.kr/IC010205/view?repDt=2026-05-17&repSeq=DOM_0000000014711405","publication_date":"2026-05-17","language":"Korean","interpretation_note":"Korean text interpreted and self-reviewed by Codex under the owner-authorized AI policy; no independent language review claimed.","locator":"Application count, 300-home scope and future screening/contract steps","access_mode":"HTML body","inspection":"Specified official HTML body or segment inspected on 2026-11-22; linked files, forms, maps, videos and live services were not tested","boundary":"1,275 applications are not occupied homes; August results and contracts are future steps in this May account.","application_start_date":"2026-05-11","application_end_date":"2026-05-15"},{"id":"incheon-ferry-visitors","title":"Visitor ferry fare support withdrawal announcement","publisher":"Incheon Metropolitan City","role":"Dated passenger-category funding decision","url":"https://www.incheon.go.kr/mayor_9/MA05010000/view?curPage=59&repSeq=DOM_0000000015178277","publication_date":"2026-07-21","language":"Korean","interpretation_note":"Korean text interpreted and self-reviewed by Codex under the owner-authorized AI policy; no independent language review claimed.","locator":"July 25 announcement, budget rationale and retained categories","access_mode":"HTML body","inspection":"Specified official HTML body or segment inspected on 2026-11-22; linked files, forms, maps, videos and live services were not tested","boundary":"Ends the out-of-city visitor subsidy, not ferries or every supported category; the article is an announcement, not independently observed implementation.","announced_effective_date":"2026-07-25"},{"id":"incheon-ferry-workers","title":"Island worker ferry support extension announcement","publisher":"Incheon Metropolitan City","role":"Dated targeted eligibility expansion","url":"https://www.incheon.go.kr/mayor_8/MA040101/view?curPage=2&repSeq=DOM_0000000015549761","publication_date":"2026-09-17","language":"Korean","interpretation_note":"Korean text interpreted and self-reviewed by Codex under the owner-authorized AI policy; no independent language review claimed.","locator":"Named worker categories and September 21 intended promulgation/effect","access_mode":"HTML body","inspection":"Specified official HTML body or segment inspected on 2026-11-22; linked files, forms, maps, videos and live services were not tested","boundary":"The older route's navigation/footer is not article date or current officeholder evidence. Underlying rule was not inspected; no blanket visitor restoration inferred.","announced_effective_date":"2026-09-21"},{"id":"incheon-hospital-ship","title":"Island care readiness visit aboard Healthy Ongjin","publisher":"Incheon Metropolitan City","role":"Dated operating-service and preparation account","url":"https://www.incheon.go.kr/IC010205/view?curPage=152&repSeq=DOM_0000000014032662","publication_date":"2026-01-26","language":"Korean","interpretation_note":"Korean text interpreted and self-reviewed by Codex under the owner-authorized AI policy; no independent language review claimed.","locator":"Operating ship, April 2025 placement, Jawol visit and staffing/weather issues","access_mode":"HTML body","inspection":"Specified official HTML body or segment inspected on 2026-11-22; linked files, forms, maps, videos and live services were not tested","boundary":"Operating vessel is not all-weather availability or a health-outcome series; preparation for integrated care is not completed city-wide implementation.","visit_date":"2026-01-26","vessel_placement_period":"2025-04"}],'Exact source identity, language, access scope and dates must remain intact');
  assert.equal(review.sources_sha256,koreaEnergyCitiesHash(data.sources));assert.equal(review.edition_sha256,koreaEnergyCitiesHash(data));
}
export const koreaEnergyCitiesCriticalPhrases=[
  [
    0,
    0,
    "capacity describes equipment, not energy delivered"
  ],
  [
    0,
    1,
    "generating commercially and finishing construction are different milestones"
  ],
  [
    0,
    2,
    "not an independently analysed ecological outcome series"
  ],
  [
    0,
    3,
    "older figure is not a measured 2025 result"
  ],
  [
    0,
    3,
    "company energy-type category, not an explicitly named plant row"
  ],
  [
    0,
    4,
    "third-floor history hall is described as future provision"
  ],
  [
    1,
    0,
    "five-parameter visit is not comprehensive contaminant certification"
  ],
  [
    1,
    1,
    "Survey responses are not water-quality measurements"
  ],
  [
    1,
    2,
    "process milestones, not completed homes"
  ],
  [
    1,
    3,
    "expected saving, not a measured operating result"
  ],
  [
    1,
    3,
    "supply target after February 2028"
  ],
  [
    1,
    4,
    "not boarding there"
  ],
  [
    1,
    4,
    "not itself an observed launch record"
  ],
  [
    2,
    0,
    "two counties and nine districts"
  ],
  [
    2,
    1,
    "not an observed response-time series"
  ],
  [
    2,
    2,
    "excludes deposit and management charges"
  ],
  [
    2,
    2,
    "Applications are not occupied homes"
  ],
  [
    2,
    3,
    "not an announcement that ferry services would stop"
  ],
  [
    2,
    3,
    "not restoration of the general visitor subsidy"
  ],
  [
    2,
    4,
    "not an all-weather service guarantee"
  ]
];
