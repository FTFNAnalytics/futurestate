import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
export const istanbulCrossingsHash=value=>createHash('sha256').update(JSON.stringify(value)).digest('hex');
export function assertIstanbulCrossingsDossiers(data,review){
  assert.equal(data.inspected_date,'2026-11-22');assert.equal(data.timezone,'America/Edmonton');
  assert.equal(data.review_policy,'OWNER-AUTHORIZED-AI-REVIEW-2026-09-25');
  assert.equal(review.policy_id,data.review_policy);assert.equal(review.review_date,data.inspected_date);
  assert.equal(data.independent_review,false);assert.equal(data.phase_60_identity_added,false);
  for(const key of ['independent_review','publication_authorized','launch_authorized','phase_216_complete'])assert.equal(review[key],false);
  assert.deepEqual(data.records.map(r=>r.record_id),["project-marmaray","project-eurasia-tunnel","place-istanbul"],'Exact record_id boundary changed');
  assert.deepEqual(data.records.map(r=>r.kind),['Project','Project','Place']);
  assert.equal(new Set(data.records.map(r=>r.route)).size,3);
  assert.equal(data.sources.length,18);const ids=new Set(data.sources.map(s=>s.id));assert.equal(ids.size,18);
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
    assert.equal(review.records.find(d=>d.record_id===r.record_id)?.sha256,istanbulCrossingsHash(r),'Article changed after exact-version review');
  }
  assert.deepEqual(data.records.map(r=>r.scope),["One Halkalı–Gebze railway corridor, including the original cross-strait section and subsequent suburban improvements. Gebze extends into Kocaeli; stations, trainsets and the proposed northern railway are not additional counted projects here.","One 14.6-kilometre Kazlıçeşme–Göztepe road project, including the 5.4-kilometre tunnel-and-connections portion and 9.2 kilometres of approaches. Decks, approaches and the separate Marmaray railway do not create additional identities.","One Istanbul metropolitan municipal territory. Districts, service facilities and individual water, childcare or screening examples are not additional counted identities; the wider regional catchment and Marmaray's Gebze end are not absorbed into this place."],'Exact scope boundary changed');
  assert.deepEqual(data.records.map(r=>r.stage),["Official records date the original crossing to October 29, 2013 and the suburban improvement's completion to March 13, 2019. Current ministry and parliamentary accounts report use, while future northern relief, design capacity and fare entitlements remain different evidence objects.","The operator chronology records completion and first vehicle in 2016; its February 2026 HTML announcement summarizes 2025 traffic. Contract structure, modeled benefits, payment rules and described emergency systems are not interchangeable with audited current outcomes.","The inspected record includes a reported water-tunnel opening, national rental-housing applications and published municipal service arrangements. Indexed source access is explicit; design capacity, application eligibility and structural screening are not universal delivered outcomes."],'Exact stage boundary changed');
  assert.deepEqual(data.records.map(r=>r.route),["/atlas/projects/marmaray/","/atlas/projects/eurasia-tunnel/","/atlas/places/istanbul/"],'Exact route boundary changed');
  assert.deepEqual(data.records.map(r=>r.aliases),[["Marmaray","Halkalı–Gebze railway","Gebze Halkali suburban railway","Marmaray rail crossing"],["Eurasia Tunnel","Avrasya Tüneli","Istanbul Strait Road Tube Crossing","Avrasya road crossing"],["Istanbul","İstanbul","Istanbul Metropolitan Municipality","İstanbul Büyükşehir Belediyesi"]],'Exact aliases boundary changed');
  assert.deepEqual(data.records.map(r=>r.timeline),[[{"date":"2013-10-29","event":"AYGM dates completion of the original Kazlıçeşme–Ayrılık Çeşmesi crossing.","source_ids":["marmaray-crossing"]},{"date":"2019-03-13","event":"AYGM dates completion of the Gebze–Halkalı suburban improvement.","source_ids":["marmaray-extension"]},{"date":"2026-02-24","event":"The ministry announced preliminary financing for a separate northern railway, with tender preparation continuing.","source_ids":["marmaray-northern-plan"]},{"date":"2026-09-30","event":"Cutoff for the cumulative Marmaray use later reported at the parliamentary hearing.","source_ids":["marmaray-parliament"]},{"date":"2026-10-06","event":"Peak-day passenger use identified in the ministry's October 29 anniversary account.","source_ids":["marmaray-anniversary"]},{"date":"2026-11-04","event":"Parliament published the operator chief's account; the ridership cutoff remained September 30.","source_ids":["marmaray-parliament"]}],[{"date":"2008-06","event":"Operator chronology records the award of the project contract.","source_ids":["eurasia-chronology"]},{"date":"2011-02","event":"The chronology records the kickoff ceremony; the implementation contract is listed in the same year.","source_ids":["eurasia-chronology"]},{"date":"2013","event":"The chronology lists financial close and the start of the contract period.","source_ids":["eurasia-chronology"]},{"date":"2016","event":"Completion, launch and the first vehicle are listed at year precision.","source_ids":["eurasia-chronology"]},{"date":"2026-02-01","event":"The operator published an HTML summary of its 2025 performance report.","source_ids":["eurasia-2025-summary"]}],[{"date":"2024","event":"The later municipal water-tunnel account reports completion of excavation.","source_ids":["istanbul-water"]},{"date":"2025","event":"The water account reports pipe installation completed by the end of the year.","source_ids":["istanbul-water"]},{"date":"2026-04","event":"The same account dates the start of testing to April.","source_ids":["istanbul-water"]},{"date":"2026-09-11","event":"Publication of the municipal water-tunnel opening report; this is not assigned as the ceremony date.","source_ids":["istanbul-water"]},{"date":"2026-09-14","event":"TOKİ's later account dates the start of rental-housing applications.","source_ids":["istanbul-rental"]},{"date":"2026-09-25","event":"Applications closed, derived from the September 26 report's explicit statement that closure was the previous day.","source_ids":["istanbul-rental"]}]],'Exact timeline boundary changed');
  assert.deepEqual(data.records.map(r=>r.sections.map(s=>s.source_ids)),[[["marmaray-crossing","marmaray-extension","marmaray-anniversary"],["marmaray-extension"],["marmaray-anniversary","marmaray-parliament"],["marmaray-northern-plan"],["marmaray-fare-access"],[]],[["eurasia-route","eurasia-chronology"],["eurasia-contract"],["eurasia-operation"],["eurasia-2025-summary"],["eurasia-payment"],[]],[["istanbul-water"],["istanbul-rental"],["istanbul-childcare"],["istanbul-metro-access"],["istanbul-screening","istanbul-screening-boundary"],[]]],'Claim-to-source bindings changed');
  for(const r of data.records)assert(!Object.hasOwn(r,'historical_acquisition'),'New Istanbul-group identity must not reuse a historical country docket');
  for(const [ri,si,phrase] of istanbulCrossingsCriticalPhrases)assert(data.records[ri].sections[si].text.includes(phrase),'Missing bounded claim: '+phrase);
  assert.deepEqual(data.sources,[{"id":"marmaray-crossing","title":"Marmaray original crossing project","publisher":"Ministry of Transport and Infrastructure — AYGM","role":"Original crossing boundary and completion record","url":"https://aygm.uab.gov.tr/projeler/marmaray/","publication_date":null,"language":"Turkish","interpretation_note":"Turkish text interpreted and self-reviewed by Codex under the owner-authorized AI policy; no independent language review claimed.","locator":"Project location, current status and completion table","access_mode":"HTML body","inspection":"Specified official HTML body or segment inspected on 2026-11-22; linked files, forms, maps, videos and live services were not tested","boundary":"The 2013 date belongs to the original Kazlıçeşme–Ayrılık Çeşmesi crossing, not completion of the full surface corridor.","completion_date":"2013-10-29"},{"id":"marmaray-extension","title":"Gebze–Halkalı suburban railway improvement","publisher":"Ministry of Transport and Infrastructure — AYGM","role":"Extension scope and design description","url":"https://aygm.uab.gov.tr/projeler/gebze-halkali-banliyo-hatlarinin-iyilestirilmesi/","publication_date":null,"language":"Turkish","interpretation_note":"Turkish text interpreted and self-reviewed by Codex under the owner-authorized AI policy; no independent language review claimed.","locator":"Extension, track allocation, capacity and completion paragraphs","access_mode":"HTML body","inspection":"Specified official HTML body or segment inspected on 2026-11-22; linked files, forms, maps, videos and live services were not tested","boundary":"Design capacity is not measured ridership. Gebze is in Kocaeli; the railway extends beyond Istanbul municipality.","completion_date":"2019-03-13"},{"id":"marmaray-anniversary","title":"Thirteen years and 1.6 billion passengers","publisher":"Ministry of Transport and Infrastructure","role":"Dated cumulative and peak-day operator account","url":"https://www.uab.gov.tr/haberler/13-yilda-1-6-milyar-yolcu/","publication_date":"2026-10-29","language":"Turkish","interpretation_note":"Turkish text interpreted and self-reviewed by Codex under the owner-authorized AI policy; no independent language review claimed.","locator":"Route, station count, cumulative use and October 6 record paragraphs","access_mode":"HTML body","inspection":"Specified official HTML body or segment inspected on 2026-11-22; linked files, forms, maps, videos and live services were not tested","boundary":"Rounded cumulative total and single-day peak are not a reliability series. Conflicting daily-service totals and premature first-ten-month period are excluded.","peak_day_date":"2026-10-06"},{"id":"marmaray-parliament","title":"TCDD Taşımacılık public-enterprise committee hearing","publisher":"Grand National Assembly of Türkiye — TBMM","role":"Parliamentary report of operator management statements","url":"https://tbmm.gov.tr/Haber/tbmm-kit-komisyonunda-tcdd-tasimaci-20261104212933","publication_date":"2026-11-04","language":"Turkish","interpretation_note":"Turkish text interpreted and self-reviewed by Codex under the owner-authorized AI policy; no independent language review claimed.","locator":"Marmaray cumulative passage paragraph within the 2023/2024 accounts hearing","access_mode":"HTML body","inspection":"Specified official HTML body or segment inspected on 2026-11-22; linked files, forms, maps, videos and live services were not tested","boundary":"1.636 billion is through September 30, 2026, not the hearing date; national and high-speed totals are excluded. Reporting testimony is not independent performance verification.","reporting_end_date":"2026-09-30"},{"id":"marmaray-northern-plan","title":"Northern railway preliminary financing announcement","publisher":"Ministry of Transport and Infrastructure","role":"Separate future railway context","url":"https://www.uab.gov.tr/haberler/tuerkiye-nin-en-bueyuek-dis-finansmanli-demiryolu-projesi/","publication_date":"2026-02-24","language":"Turkish","interpretation_note":"Turkish text interpreted and self-reviewed by Codex under the owner-authorized AI policy; no independent language review claimed.","locator":"Preliminary understanding, tender preparation, route and expected relief paragraphs","access_mode":"HTML body","inspection":"Specified official HTML body or segment inspected on 2026-11-22; linked files, forms, maps, videos and live services were not tested","boundary":"Six-institution preliminary financing and intended airport connection are not an operating bypass or observed Marmaray capacity gain.","planning_period":"2026"},{"id":"marmaray-fare-access","title":"Disability identity card — question seven","publisher":"Ministry of Family and Social Services","role":"Published passenger entitlement description","url":"https://aile.gov.tr/sss/engelli-ve-yasli-hizmetleri-genel-mudurlugu/engelliler-icin-kimlik-karti/q-0007/","publication_date":null,"language":"Turkish","interpretation_note":"Turkish text interpreted and self-reviewed by Codex under the owner-authorized AI policy; no independent language review claimed.","locator":"Question seven, urban transport and qualifying companion bullets only","access_mode":"HTML body","inspection":"Specified official HTML body or segment inspected on 2026-11-22; linked files, forms, maps, videos and live services were not tested","boundary":"A fare entitlement is not a guarantee of working lifts or an individualized eligibility determination."},{"id":"eurasia-route","title":"About the Eurasia Tunnel","publisher":"ATAŞ / Eurasia Tunnel","role":"Operator route and concession overview","url":"https://www.avrasyatuneli.com/en/corporate/what/about","publication_date":null,"language":"English","interpretation_note":"Official English text assessed by Codex under the owner-authorized AI policy; no independent subject or language review claimed.","locator":"14.6 km route, tunnel/connections, approaches and operator responsibilities","access_mode":"HTML body","inspection":"Specified official HTML body or segment inspected on 2026-11-22; linked files, forms, maps, videos and live services were not tested","boundary":"The 5.4 km portion includes tunnel and connections; it is not the whole route or Marmaray. Promotional traffic benefits are not independently accepted results."},{"id":"eurasia-chronology","title":"Eurasia Tunnel chronology","publisher":"ATAŞ / Eurasia Tunnel","role":"Historical project sequence","url":"https://www.avrasyatuneli.com/en/corporate/what/chronology","publication_date":null,"language":"English","interpretation_note":"Official English text assessed by Codex under the owner-authorized AI policy; no independent subject or language review claimed.","locator":"June 2008 award through 2016 completion and first vehicle","access_mode":"HTML body","inspection":"Specified official HTML body or segment inspected on 2026-11-22; linked files, forms, maps, videos and live services were not tested","boundary":"Year-level milestones retain year precision; the chronology does not establish current maintenance performance.","award_period":"2008-06","kickoff_period":"2011-02","completion_period":"2016"},{"id":"eurasia-contract","title":"Eurasia Tunnel project masthead","publisher":"ATAŞ / Eurasia Tunnel","role":"Published investment and contract structure","url":"https://www.avrasyatuneli.com/en/corporate/what/masthead","publication_date":null,"language":"English","interpretation_note":"Official English text assessed by Codex under the owner-authorized AI policy; no independent subject or language review claimed.","locator":"Project company, investment split and contract-period table","access_mode":"HTML body","inspection":"Specified official HTML body or segment inspected on 2026-11-22; linked files, forms, maps, videos and live services were not tested","boundary":"Historical investment and contract structure are not current profit, total public fiscal exposure or a newly signed financing agreement."},{"id":"eurasia-operation","title":"Eurasia Tunnel operation","publisher":"ATAŞ / Eurasia Tunnel","role":"Described operating systems and emergency arrangements","url":"https://www.avrasyatuneli.com/en/corporate/how/operation","publication_date":null,"language":"English","interpretation_note":"Official English text assessed by Codex under the owner-authorized AI policy; no independent subject or language review claimed.","locator":"Detection, backup power, communications and emergency-response paragraphs","access_mode":"HTML body","inspection":"Specified official HTML body or segment inspected on 2026-11-22; linked files, forms, maps, videos and live services were not tested","boundary":"Installed/described systems and response promises are not independently measured availability, actual incident latency or safety certification."},{"id":"eurasia-2025-summary","title":"2025 performance-index report announcement","publisher":"ATAŞ / Eurasia Tunnel","role":"Dated HTML summary of operator performance claims","url":"https://www.avrasyatuneli.com/haberler-ve-duyurular/detay/avrasya-tunelinin-2025-yili-performans-endeks-raporu-yayimlandi","publication_date":"2026-02-01","language":"Turkish","interpretation_note":"Turkish text interpreted and self-reviewed by Codex under the owner-authorized AI policy; no independent language review claimed.","locator":"Announcement text only; linked performance report not inspected","access_mode":"HTML body","inspection":"Specified official HTML body or segment inspected on 2026-11-22; linked files, forms, maps, videos and live services were not tested","boundary":"77,000 daily passages is the operator's 2025 average. Nine-year unit vehicles and claimed economic value are not unique users or audited profit.","reporting_period":"2025"},{"id":"eurasia-payment","title":"Eurasia Tunnel payment options","publisher":"ATAŞ / Eurasia Tunnel","role":"Published access and payment-system description","url":"https://www.avrasyatuneli.com/en/tolls/","publication_date":null,"language":"English","interpretation_note":"Official English text assessed by Codex under the owner-authorized AI policy; no independent subject or language review claimed.","locator":"Free-flow payment and vehicle-class bullets; no payment transaction","access_mode":"HTML body","inspection":"Specified official HTML body or segment inspected on 2026-11-22; linked files, forms, maps, videos and live services were not tested","boundary":"Motorcycles have a separate class; payment facilities do not authorize every vehicle. No plate query, account access or payment was submitted."},{"id":"istanbul-water","title":"İSKİ water tunnel enters service","publisher":"Istanbul Metropolitan Municipality — İstanbul Senin Haber","role":"Dated municipal commissioning account","url":"https://istanbulseninhaber.ibb.istanbul/haber-detay/iski-tuneli-istanbullular-icin-hizmette","publication_date":"2026-09-11","language":"Turkish","interpretation_note":"Turkish text interpreted and self-reviewed by Codex under the owner-authorized AI policy; no independent language review claimed.","locator":"Indexed article covering opening, design capacity and construction/test sequence","access_mode":"Official indexed text","inspection":"Specified official indexed text inspected on 2026-11-22 after direct retrieval timed out; full live page, linked files, forms and services were not tested","boundary":"Publication is not assigned as ceremony date. Design throughput is not delivered volume; water-balance PDF and city-wide loss claims are not independently verified.","excavation_completion_period":"2024","pipe_completion_period":"2025","testing_start_period":"2026-04"},{"id":"istanbul-rental","title":"Istanbul rental-social-housing applications close","publisher":"TOKİ","role":"National housing agency's application-stage account","url":"https://www.toki.gov.tr/haber/istanbul-kiralik-sosyal-konut-projesinin-basvurulari-tamamlandi","publication_date":"2026-09-26","language":"Turkish","interpretation_note":"Turkish text interpreted and self-reviewed by Codex under the owner-authorized AI policy; no independent language review claimed.","locator":"Application closure, 1,071-home scope and later lottery/delivery paragraphs","access_mode":"HTML body","inspection":"Specified official HTML body or segment inspected on 2026-11-22; linked files, forms, maps, videos and live services were not tested","boundary":"National TOKİ provision is not municipal ownership; applications and forecast October allocations are not occupied homes.","application_start_date":"2026-09-14","application_end_date":"2026-09-25"},{"id":"istanbul-childcare","title":"Yuvamız İstanbul frequently asked questions","publisher":"Istanbul Metropolitan Municipality — Yuvamız İstanbul","role":"Published childcare service and admission rules","url":"https://yuvamiz.ibb.istanbul/sikca-sorulan-sorular","publication_date":null,"language":"Turkish","interpretation_note":"Turkish text interpreted and self-reviewed by Codex under the owner-authorized AI policy; no independent language review claimed.","locator":"Indexed pre-application questions 3, 5, 6, 8, 9 and fee-category answer","access_mode":"Official indexed text","inspection":"Specified official indexed text inspected on 2026-11-22 after direct retrieval timed out; full live page, linked files, forms and services were not tested","boundary":"Full-day service, ranked admission and conditional specialist assessment are not universal availability; no family application was made."},{"id":"istanbul-metro-access","title":"Metro İstanbul accessibility services","publisher":"Metro İstanbul","role":"Operator's physical-access provision description","url":"https://www.metro.istanbul/Home/Sayfa?q=eri%C5%9Filebilirlik-hizmetleri","publication_date":null,"language":"Turkish","interpretation_note":"Turkish text interpreted and self-reviewed by Codex under the owner-authorized AI policy; no independent language review claimed.","locator":"Indexed introduction and lift, ramp, guidance and tactile-surface paragraphs","access_mode":"Official indexed text","inspection":"Specified official indexed text inspected on 2026-11-22 after direct retrieval timed out; full live page, linked files, forms and services were not tested","boundary":"Metro İstanbul's network description is not a Marmaray station audit or live equipment-availability measurement."},{"id":"istanbul-screening","title":"Building rapid-screening frequently asked questions","publisher":"Istanbul Metropolitan Municipality — Bina Tespiti","role":"Scope and method of municipal structural screening","url":"https://binatespiti.ibb.istanbul/sikcasorulansorular/","publication_date":null,"language":"Turkish","interpretation_note":"Turkish text interpreted and self-reviewed by Codex under the owner-authorized AI policy; no independent language review claimed.","locator":"Indexed scope, method, application and out-of-scope-building answers","access_mode":"Official indexed text","inspection":"Specified official indexed text inspected on 2026-11-22 after direct retrieval timed out; full live page, linked files, forms and services were not tested","boundary":"Address-based risk ranking has building-type limits; screening does not establish that any particular building is safe."},{"id":"istanbul-screening-boundary","title":"Building screening application information","publisher":"Istanbul Metropolitan Municipality — Bina Tespit","role":"Published distinction between screening and detailed statutory assessment","url":"https://binatespitiformu.ibb.gov.tr/basvuru/","publication_date":null,"language":"Turkish","interpretation_note":"Turkish text interpreted and self-reviewed by Codex under the owner-authorized AI policy; no independent language review claimed.","locator":"Indexed explanatory notice on high-risk results and detailed assessment only","access_mode":"Official indexed text","inspection":"Specified official indexed text inspected on 2026-11-22 after direct retrieval timed out; full live page, linked files, forms and services were not tested","boundary":"No form was submitted or private result retrieved. A screening result is not a replacement for the specified detailed assessment or entitlement decision."}],'Exact source identity, language, access scope and dates must remain intact');
  assert.equal(review.sources_sha256,istanbulCrossingsHash(data.sources));assert.equal(review.edition_sha256,istanbulCrossingsHash(data));
}
export const istanbulCrossingsCriticalPhrases=[
  [
    0,
    0,
    "Gebze end reaches Kocaeli"
  ],
  [
    0,
    1,
    "design figure, not observed daily use"
  ],
  [
    0,
    2,
    "later publication therefore has an earlier reporting cutoff"
  ],
  [
    0,
    2,
    "Conflicting daily-service totals within the anniversary release are omitted"
  ],
  [
    0,
    3,
    "expected benefit, not demonstrated capacity already released"
  ],
  [
    0,
    4,
    "not the condition of a particular journey"
  ],
  [
    1,
    0,
    "5.4-kilometre portion combines the twin-deck tunnel and connection tunnels"
  ],
  [
    1,
    1,
    "not a fresh financing announcement"
  ],
  [
    1,
    2,
    "not adopted as a guarantee"
  ],
  [
    1,
    3,
    "linked performance report and its models were not"
  ],
  [
    1,
    3,
    "claimed economic value is not audited profit"
  ],
  [
    1,
    4,
    "not permission for every vehicle to enter"
  ],
  [
    2,
    0,
    "Design throughput is not measured household delivery"
  ],
  [
    2,
    0,
    "official indexed text"
  ],
  [
    2,
    1,
    "not evidence that the homes were occupied"
  ],
  [
    2,
    1,
    "does not turn it into municipal ownership"
  ],
  [
    2,
    2,
    "not identical support everywhere"
  ],
  [
    2,
    3,
    "must remain distinct from Marmaray"
  ],
  [
    2,
    4,
    "Rapid screening is not a building-safety certificate"
  ],
  [
    2,
    4,
    "No address was submitted"
  ]
];
