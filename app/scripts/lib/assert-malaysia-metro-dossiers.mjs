import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
export const malaysiaMetroHash=value=>createHash('sha256').update(JSON.stringify(value)).digest('hex');
export function assertMalaysiaMetroDossiers(data,review){
  assert.equal(data.inspected_date,'2026-11-22');assert.equal(data.timezone,'America/Edmonton');
  assert.equal(data.review_policy,'OWNER-AUTHORIZED-AI-REVIEW-2026-09-25');
  assert.equal(review.policy_id,data.review_policy);assert.equal(review.review_date,data.inspected_date);
  assert.equal(data.independent_review,false);assert.equal(data.phase_60_identity_added,false);
  for(const key of ['independent_review','publication_authorized','launch_authorized','phase_216_complete'])assert.equal(review[key],false);
  assert.deepEqual(data.records.map(r=>r.record_id),["project-mrt-putrajaya-line","place-kuala-lumpur","place-putrajaya"]);
  assert.deepEqual(data.records.map(r=>r.kind),['Project','Place','Place']);
  assert.equal(new Set(data.records.map(r=>r.route)).size,3);
  assert.equal(data.sources.length,14);const ids=new Set(data.sources.map(s=>s.id));assert.equal(ids.size,14);
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
    assert.equal(review.records.find(d=>d.record_id===r.record_id)?.sha256,malaysiaMetroHash(r),'Article changed after exact-version review');
  }
  assert.deepEqual(data.records.map(r=>r.scope),["One 57.7-kilometre MRT line from Kwasa Damansara to Putrajaya Sentral, including its staged opening. It crosses a regional corridor; it is not confined to either Kuala Lumpur or Putrajaya. Future stations and other MRT lines are not additional delivered components or counted identities here.","The Federal Territory of Kuala Lumpur administered by DBKL, counted as one municipal place. Excludes Greater Kuala Lumpur, the whole Klang Valley and Putrajaya; regional railway and highway service areas do not redefine this boundary.","The Federal Territory of Putrajaya, counted as one place, not twenty separate precincts or the whole Kuala Lumpur urban region. The regional MRT line and the lake catchment are connected systems rather than alternative municipal boundaries."]);
  assert.deepEqual(data.records.map(r=>r.stage),["Passenger opening documented in 2022 and 2023; technical capabilities described. No comparable recurring-performance series admitted.","Municipal functions and adopted strategic-plan status described; future targets and operating responsibilities remain separate from verified outcomes.","Historical territorial development and rail opening documented; water-system functions and municipal responsibilities described. Archived bus plans are not current service verification."]);
  assert.deepEqual(data.records.map(r=>r.timeline.map(t=>t.date)),[["2014","2015-10","2016-09-15","2022-06-16","2023-03-16"],["1972-02-01","2005","2023-10-19","2023-11-23"],["1993-06","1995-02","2001-02-01","2023-01-01","2023-03-16"]]);
  for(const r of data.records)assert(!Object.hasOwn(r,'historical_acquisition'),'New Malaysia identity must not reuse a historical country docket');
  for(const [ri,si,phrase] of malaysiaMetroCriticalPhrases)assert(data.records[ri].sections[si].text.includes(phrase),'Missing bounded claim: '+phrase);
  assert.deepEqual(data.records.map(r=>r.sections.map(s=>s.source_ids)),[[["mrt-scope"],["mrt-first-opening"],["mrt-full-opening"],["mrt-technical"],["mrt-technical"],[]],[["kl-scope"],["kl-plan-hierarchy","kl-plan-status"],["kl-plan-goals"],["kl-transport-roles"],["kl-command"],[]],[["putrajaya-history"],["putrajaya-water"],["mrt-full-opening"],["putrajaya-bus"],["putrajaya-functions"],[]]],'Claim-to-source bindings changed');
  assert.deepEqual(data.records.map(r=>r.timeline.map(s=>s.source_ids)),[[["mrt-scope"],["mrt-scope"],["mrt-scope"],["mrt-first-opening"],["mrt-full-opening"]],[["kl-scope"],["kl-command"],["kl-plan-status"],["kl-plan-status"]],[["putrajaya-history"],["putrajaya-history"],["putrajaya-history"],["putrajaya-bus"],["mrt-full-opening"]]],'Chronology-to-source bindings changed');
  assert(data.records[2].timeline[3].event.includes('Scheduled')&&data.records[2].timeline[3].event.includes('not a post-event'));
  assert(data.records[1].timeline[2].event.includes('underlying instrument not inspected'));
  const dates=s=>Object.fromEntries(Object.entries(s).filter(([k])=>k.endsWith('_date')));
  assert.deepEqual(data.sources.map(dates),[{"publication_date":null},{"publication_date":null,"event_date":"2022-06-16"},{"publication_date":null,"event_date":"2023-03-16"},{"publication_date":null},{"publication_date":null,"event_date":"1972-02-01"},{"publication_date":null},{"publication_date":null,"gazette_date":"2023-10-19","effective_date":"2023-11-23"},{"publication_date":null},{"publication_date":null},{"publication_date":null},{"publication_date":"2014-05-09","event_date":"2001-02-01"},{"publication_date":null},{"publication_date":null,"notice_start_date":"2022-12-29","notice_end_date":"2023-03-31","scheduled_event_date":"2023-01-01"},{"publication_date":null}],'Publication, notice, scheduled and event dates must remain separate');
  const expectedSources=[["mrt-scope","https://www.mymrt.com.my/ms/awam/laluan-putrajaya/","Malay","HTML body","Retains some prospective wording. Corridor population is not ridership, and five future stations are not operating stations. The English project URL timed out twice."],["mrt-first-opening","https://www.mymrt.com.my/events/mrt-putrajaya-line-phase-one-opened-to-the-public/","English","HTML body","Historical opening and connection configuration; not a current timetable or fare promise."],["mrt-full-opening","https://www.mymrt.com.my/events/yab-prime-minister-launches-mrt-putrajaya-line/","English","HTML body","Actual event date is explicit; exact publication day is not. Opening promotion is historical."],["mrt-technical","https://www.mymrt.com.my/projects/putrajaya-line/technical-information/","English","HTML body","Design and equipment descriptions are not availability measurements or independent safety acceptance. Some construction language is prospective."],["kl-scope","https://www.dbkl.gov.my/info-korporat/latar-belakang","Malay","HTML body","Use municipal remit and historical city-status date, not undated officeholder claims or blank indicator widgets."],["kl-plan-hierarchy","https://ppkl.dbkl.gov.my/en/ppkl2040/","English","HTML body","Explains planning levels; not an exact parcel permission, current local-plan instrument or legal advice."],["kl-plan-status","https://perpustakaankualalumpur.dbkl.gov.my/en/publication-2/","English","Official indexed text","Synopsis reports dates; the underlying gazette was not inspected. Portal stage-completion labels do not replace the distinct dates."],["kl-plan-goals","https://ppkl.dbkl.gov.my/en/pskl2040/","English","HTML body","2040 targets remain targets. Website clock and page-update labels are not plan issuance dates; animated zero counters are not substantive counts."],["kl-transport-roles","https://klccc.dbkl.gov.my/organization-chart/","English","Official indexed text","Describes responsibilities, not proof of completed facilities or each bus run."],["kl-command","https://klccc.dbkl.gov.my/","English","Official indexed text","Indexed service description is not a live camera inspection. Inconsistent road-length figures are not reused."],["putrajaya-history","https://blog.ppj.gov.my/2014/05/background-of-putrajaya.html?m=1","English","HTML body","Historical account published in 2014, not a new 2026 territorial decision or direct inspection of constitutional instruments."],["putrajaya-water","https://www.ppj.gov.my/en/second-page/tasik-dan-wetland","English","HTML body","Describes system design and functions, not a dated water-quality or flood-protection outcome series."],["putrajaya-bus","https://www.ppj.gov.my/second-page/makluman-3?slugs=makluman-perkhidmatan-bas-nadiputra","Malay","HTML body","The displayed window is not an exact publication timestamp. The January start is announced prospectively; historical fares/hours are not current journey advice."],["putrajaya-functions","https://www.ppj.gov.my/en/second-page/ringkasan-fungsi-jabatan?code=106","Malay","HTML body","English navigation surrounds Malay substantive text. Assigned responsibilities do not prove application uptime or independently measured smart-city outcomes."]];
  for(const [id,url,language,mode,boundary] of expectedSources){
    const s=data.sources.find(s=>s.id===id);assert(s);assert.equal(s.url,url);assert.equal(s.language,language);assert.equal(s.access_mode,mode);assert.equal(s.boundary,boundary);
    assert(s.inspection.includes('2026-11-22'));
    if(mode==='HTML body')assert(s.inspection.includes('HTML text')&&s.inspection.includes('dynamic feeds were not inspected'));
    else {assert(s.inspection.includes('Official indexed text')&&s.inspection.includes('direct page retrieval failed'));assert(s.retrieval_limit?.length>20);assert(s.inspection.includes('No full live-page'));}
    if(language==='Malay')assert(s.interpretation_note.includes('Malay source interpreted into English by Codex')&&s.interpretation_note.includes('no independent language review'));
  }
  assert.equal(data.sources.filter(s=>s.access_mode==='HTML body').length,11);
  assert.equal(data.sources.filter(s=>s.access_mode==='Official indexed text').length,3);
  assert.equal(data.sources.filter(s=>s.language==='Malay').length,4);
  assert.equal(review.sources_sha256,malaysiaMetroHash(data.sources));assert.equal(review.edition_sha256,malaysiaMetroHash(data));
}
export const malaysiaMetroCriticalPhrases=[
  [
    0,
    0,
    "five stations planned for future use"
  ],
  [
    0,
    0,
    "not a count of passengers carried"
  ],
  [
    0,
    1,
    "historical, not a guarantee"
  ],
  [
    0,
    2,
    "post-event opening account rather than a forecast"
  ],
  [
    0,
    2,
    "not a continuing fare offer"
  ],
  [
    0,
    3,
    "provision, not continuous availability"
  ],
  [
    0,
    4,
    "does not establish uninterrupted passenger operation"
  ],
  [
    1,
    0,
    "Regional commuting and rail services extend beyond it"
  ],
  [
    1,
    1,
    "separate dates, reported by a synopsis"
  ],
  [
    1,
    1,
    "not permission for a particular parcel"
  ],
  [
    1,
    2,
    "targets for 2040, not present achievements"
  ],
  [
    1,
    3,
    "Direct retrieval of that page failed"
  ],
  [
    1,
    4,
    "toll-road concessionaires’ own systems"
  ],
  [
    1,
    4,
    "differing road-length figures are not used"
  ],
  [
    2,
    0,
    "internal parts of one place"
  ],
  [
    2,
    1,
    "not a dated water-quality result"
  ],
  [
    2,
    2,
    "not complete access to every precinct"
  ],
  [
    2,
    3,
    "not turn the announcement into a current timetable"
  ],
  [
    2,
    4,
    "in Malay even on the English-navigation page"
  ],
  [
    2,
    4,
    "responsibilities, not evidence of application uptime"
  ]
];
