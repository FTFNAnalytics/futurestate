import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
export const czechMetroCitiesHash=value=>createHash('sha256').update(JSON.stringify(value)).digest('hex');
export function assertCzechMetroCitiesDossiers(data,review){
  assert.equal(data.inspected_date,'2026-11-22');assert.equal(data.timezone,'America/Edmonton');
  assert.equal(data.review_policy,'OWNER-AUTHORIZED-AI-REVIEW-2026-09-25');
  assert.equal(review.policy_id,data.review_policy);assert.equal(review.review_date,data.inspected_date);
  assert.equal(data.independent_review,false);assert.equal(data.phase_60_identity_added,false);
  for(const key of ['independent_review','publication_authorized','launch_authorized','phase_216_complete'])assert.equal(review[key],false);
  assert.deepEqual(data.records.map(r=>r.record_id),["project-prague-metro-d","place-prague","place-brno"],'Exact record_id boundary changed');
  assert.deepEqual(data.records.map(r=>r.kind),['Project','Place','Place']);
  assert.equal(new Set(data.records.map(r=>r.route)).size,3);
  assert.equal(data.sources.length,19);const ids=new Set(data.sources.map(s=>s.id));assert.equal(ids.size,19);
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
    assert.equal(review.records.find(d=>d.record_id===r.record_id)?.sha256,czechMetroCitiesHash(r),'Article changed after exact-version review');
  }
  assert.deepEqual(data.records.map(r=>r.scope),["One Metro D railway project across the defined I.D1, I.D2 and I.D3 stages, not the existing metro network. Individual stations, construction lots, monitoring contracts and adjacent development do not create extra counted projects; proposed branches beyond this scope are not admitted here.","One capital-city municipality of Prague, not the surrounding Central Bohemian region or the entire Prague Integrated Transport catchment. Prague 5 childcare and Nové Dvory illustrate services within the city; neither adds another place or project identity here.","One statutory city of Brno, not the whole South Moravian region, river basin or utility catchment. Named heat sources, river stages, depots and district housing offices are service examples within the place account, not additional counted projects or municipalities."],'Exact scope boundary changed');
  assert.deepEqual(data.records.map(r=>r.stage),["The first section has been under construction since April 2022; the next section began work in June 2026. The June account forecasts Pankrác–Nové Dvory operation in the second half of 2032. November traffic notices describe upcoming restrictions, not completed works or passenger opening.","November wastewater information distinguishes the July transfer between treatment lines. Housing and childcare pages describe access arrangements, while Nové Dvory design work and the October tram start concern future provision. These are not universal service coverage or a combined municipal performance score.","October's heat-source presentation reports earlier trial operation; November's river account retains contractor selection and preparation stages. Municipal housing access is district-managed, while transport reports describe delivered maintenance equipment and winter preparation rather than observed winter-wide reliability."],'Exact stage boundary changed');
  assert.deepEqual(data.records.map(r=>r.route),["/atlas/projects/prague-metro-d/","/atlas/places/prague/","/atlas/places/brno/"],'Exact route boundary changed');
  assert.deepEqual(data.records.map(r=>r.aliases),[["Prague Metro D","Praha metro D","Metro I.D","Ryšánka–Nové Dvory metro"],["Prague","Praha","Hlavní město Praha","Prague municipality"],["Brno","Statutární město Brno","Brno municipality","City of Brno"]],'Exact aliases boundary changed');
  assert.deepEqual(data.records.map(r=>r.timeline),[[{"date":"2022-04","event":"Construction began on Pankrác–Olbrachtova, as recalled in the June 2026 account.","source_ids":["prague-d-june-cs"]},{"date":"2026-04-07","event":"DPP reported signing the next-section construction contract.","source_ids":["prague-d-contract"]},{"date":"2026-06-19","event":"Ceremony marked the next section; the release says initial works began that week.","source_ids":["prague-d-june-cs","prague-d-june-en"]},{"date":"2026-08-31","event":"Council approved Nusle and Ryšánka as replacements for working station names.","source_ids":["prague-d-names"]},{"date":"2026-09","event":"The rolling progress page reports access-tunnel excavation and associated monitoring starting at Nové Dvory.","source_ids":["prague-d-monitoring"]},{"date":"2026-11-10","event":"DPP published future traffic arrangements and distinguished passage completion from opening.","source_ids":["prague-d-access"]}],[{"date":"2022-09","event":"The Nové Dvory account dates approval of the area planning study to this month.","source_ids":["prague-nove-dvory"]},{"date":"2025","event":"PDS reports signing key design and project-management contracts for Project 1.","source_ids":["prague-nove-dvory"]},{"date":"2026-07-01","event":"PVK's table identifies a limit change associated with the old-line shutdown and transfer to the new line.","source_ids":["prague-wastewater"]},{"date":"2026-10-07","event":"DPP marked the start of the Libuš–Nové Dvory tram construction.","source_ids":["prague-tram-extension"]},{"date":"2026-11-09","event":"PVK updated the wastewater quality table, retaining different reporting periods for the two lines.","source_ids":["prague-wastewater"]}],[{"date":"2026-01-01","event":"The municipal housing page dates the common application form's introduction to this day.","source_ids":["brno-housing"]},{"date":"2026-04-24","event":"The heat company described steam-to-hot-water network reconstruction in named streets.","source_ids":["brno-heat-network"]},{"date":"2026-05-06","event":"DPMB reported completion of the Medlánky lathe and wash-line investments.","source_ids":["brno-tram-maintenance"]},{"date":"2026-10-01","event":"The heat company presented Brno-sever and reported the preceding heating season's trial results.","source_ids":["brno-biomass"]},{"date":"2026-10-14","event":"The city reported a grant decision for Trnitá flood-protection stages, with contractor selection continuing.","source_ids":["brno-flood-grant"]},{"date":"2026-11-03","event":"DPMB described preparations for the coming winter.","source_ids":["brno-winter-preparation"]},{"date":"2026-11-05","event":"The city described preparation, tree measures and future main works along the rivers.","source_ids":["brno-flood-preparation"]}]],'Exact timeline boundary changed');
  assert.deepEqual(data.records.map(r=>r.sections.map(s=>s.source_ids)),[[["prague-d-structure","prague-d-names"],["prague-d-contract","prague-d-june-cs"],["prague-d-june-cs","prague-d-june-en"],["prague-d-monitoring"],["prague-d-access"],[]],[["prague-wastewater"],["prague-housing-agency"],["prague-childcare"],["prague-nove-dvory"],["prague-tram-extension"],[]],[["brno-biomass"],["brno-heat-network"],["brno-flood-grant","brno-flood-preparation"],["brno-housing"],["brno-tram-maintenance","brno-winter-preparation"],[]]],'Claim-to-source bindings changed');
  for(const r of data.records)assert(!Object.hasOwn(r,'historical_acquisition'),'New Czech-group identity must not reuse a historical country docket');
  for(const [ri,si,phrase] of czechMetroCitiesCriticalPhrases)assert(data.records[ri].sections[si].text.includes(phrase),'Missing bounded claim: '+phrase);
  assert.deepEqual(data.sources,[{"id":"prague-d-structure","title":"Metro D project stages","publisher":"Prague Public Transit Company (DPP)","role":"Named railway scope and staged delivery","url":"https://www.dpp.cz/metro-d/popis-projektu/cleneni-projektu","publication_date":null,"language":"Czech","interpretation_note":"Czech text interpreted and self-reviewed by Codex under the owner-authorized AI policy; no independent language or subject review claimed.","locator":"I.D1, I.D2 and I.D3 stage descriptions","access_mode":"HTML body","inspection":"Specified official HTML body or segment inspected on 2026-11-22; linked files, forms, maps, videos and live services were not tested","boundary":"The page retains earlier working station names. Staging possibilities are not construction completion or passenger operation; components are not extra counted projects."},{"id":"prague-d-contract","title":"Contract signed for the next Metro D section","publisher":"DPP","role":"Dated contract-signing account","url":"https://www.dpp.cz/spolecnost/pro-media/tiskove-zpravy/detail/278_3289-dalsi-usek-metra-d-olbrachtova-nove-dvory-postavi-sdruzeni-vedene-spolecnosti-subterra-dpp-podepsal-smlouvu-se-zhotovitelem","publication_date":"2026-04-07","language":"Czech","interpretation_note":"Czech text interpreted and self-reviewed by Codex under the owner-authorized AI policy; no independent language or subject review claimed.","locator":"Signing, tender price and expected construction start","access_mode":"HTML body","inspection":"Specified official HTML body or segment inspected on 2026-11-22; linked files, forms, maps, videos and live services were not tested","boundary":"CZK 29.99 billion excludes VAT and covers the specified contract, not final whole-line expenditure. DPP's account of court/procurement decisions is not a separate legal review; underlying decisions and contract were not inspected."},{"id":"prague-d-june-cs","title":"Construction starts on the next Metro D section","publisher":"DPP","role":"Czech construction-start and forecast account","url":"https://www.dpp.cz/spolecnost/pro-media/tiskove-zpravy/detail/278_3368-zacala-stavba-dalsiho-useku-metra-d-od-stanice-olbrachtova-na-nove-dvory","publication_date":"2026-06-19","language":"Czech","interpretation_note":"Czech text interpreted and self-reviewed by Codex under the owner-authorized AI policy; no independent language or subject review claimed.","locator":"Opening paragraphs, five-station operating subset and separate future stations","access_mode":"HTML body","inspection":"Specified official HTML body or segment inspected on 2026-11-22; linked files, forms, maps, videos and live services were not tested","boundary":"June 19 is the ceremony; initial work began that week, without an exact day assigned here. The Czech version excludes transport/control systems from one technology-scope statement while the English version includes them. The contract itself was not inspected. Second-half 2032 operation remains a forecast.","first_section_start_period":"2022-04","opening_forecast_period":"2032","forecast_qualifier":"Second half of 2032 for Pankrác–Nové Dvory in this release"},{"id":"prague-d-june-en","title":"Construction begins on Metro D — English version","publisher":"DPP","role":"English counterpart checked for scope fidelity","url":"https://www.dpp.cz/en/company/for-media/press-news/detail/580_3371-construction-begins-on-the-next-section-of-metro-line-d-from-olbrachtova-station-to-nove-dvory","publication_date":"2026-06-19","language":"English","interpretation_note":"Official English text assessed by Codex under the owner-authorized AI policy; no independent language or subject review claimed.","locator":"English opening and technology-scope paragraphs","access_mode":"HTML body","inspection":"Specified official HTML body or segment inspected on 2026-11-22; linked files, forms, maps, videos and live services were not tested","boundary":"Its inclusion of transport/control systems conflicts with the Czech version's exclusion. This comparison does not settle the actual contractual procurement boundary; no translation is silently treated as a contract."},{"id":"prague-d-names","title":"Prague approves future Metro D station names","publisher":"Prague Integrated Transport (PID / ROPID)","role":"Dated station-name decision account","url":"https://pid.cz/praha-rozhodla-o-budoucich-nazvech-stanic-linky-metra-d/","publication_date":"2026-08-31","language":"Czech","interpretation_note":"Czech text interpreted and self-reviewed by Codex under the owner-authorized AI policy; no independent language or subject review claimed.","locator":"Publication/update line and council decision on Nusle and Ryšánka","access_mode":"HTML body","inspection":"Specified official HTML body or segment inspected on 2026-11-22; linked files, forms, maps, videos and live services were not tested","boundary":"Names replace earlier working labels, not railway identities. The final name of the station provisionally called Depo Písnice remained deferred in this decision; renaming is not opening.","decision_date":"2026-08-31"},{"id":"prague-d-monitoring","title":"Ryšánka–Nové Dvory works and geotechnical monitoring","publisher":"DPP","role":"Dated-period progress within a rolling project page","url":"https://www.dpp.cz/metro-d/realizace/usek-rysanka-nove-dvory","publication_date":null,"language":"Czech","interpretation_note":"Czech text interpreted and self-reviewed by Codex under the owner-authorized AI policy; no independent language or subject review claimed.","locator":"Geotechnical monitoring paragraphs: September access excavation and phased building surveys","access_mode":"HTML body","inspection":"Specified official HTML body or segment inspected on 2026-11-22; linked files, forms, maps, videos and live services were not tested","boundary":"The September milestone and planned later surveys retain their own periods. Described daily monitoring is not an independent no-damage finding or completed installation of every instrument; private addresses are not republished.","reported_excavation_start_period":"2026-09"},{"id":"prague-d-access","title":"November traffic arrangements around Metro D works","publisher":"DPP","role":"Dated future street-access and work coordination notice","url":"https://www.dpp.cz/spolecnost/pro-media/tiskove-zpravy/detail/278_3513-vyznamna-dopravni-opatreni-v-praze-4-souvisejici-se-stavbou-metra-d-a-dalsimi-navaznymi-projekty","publication_date":"2026-11-10","language":"Czech","interpretation_note":"Czech text interpreted and self-reviewed by Codex under the owner-authorized AI policy; no independent language or subject review claimed.","locator":"Sulická closure, bus diversions, January temporary links and Pankrác passage paragraphs","access_mode":"HTML body","inspection":"Specified official HTML body or segment inspected on 2026-11-22; linked files, forms, maps, videos and live services were not tested","boundary":"The November 25, 2026–June 30, 2027 Sulická closure and December/January milestones were future at inspection. Civil completion of the Pankrác passage is not its full public opening. A quoted six-station ambition does not revise the five-station contract scope; no live journey was tested.","closure_start_forecast_period":"2026-11","temporary_links_forecast_period":"2027-01"},{"id":"prague-wastewater","title":"Prague wastewater systems and published quality tables","publisher":"Prague Water Supply and Sewerage (PVK)","role":"Operator's treatment-line and reporting-basis account","url":"https://www.pvk.cz/vse-o-vode/odpadni-voda/","publication_date":null,"language":"Czech","interpretation_note":"Czech text interpreted and self-reviewed by Codex under the owner-authorized AI policy; no independent language or subject review claimed.","locator":"November 9 update; SVL June and NVL October tables; July 1 limit-change note; treatment descriptions","access_mode":"HTML body","inspection":"Specified official HTML body or segment inspected on 2026-11-22; linked files, forms, maps, videos and live services were not tested","boundary":"June SVL and October NVL data have different periods and operating scopes. Monthly values, cumulative averages and annual-average limits are not interchangeable. The older generic preparation sentence does not override the dated shutdown/transfer note; no independent full-year compliance conclusion is made.","information_updated_date":"2026-11-09","limit_change_date":"2026-07-01","old_line_reporting_period":"2026-06","new_line_reporting_period":"2026-10"},{"id":"prague-housing-agency","title":"Municipal rental agency — seeking a home","publisher":"Prague Municipal Rental Agency","role":"Published referral and tenancy-support arrangements","url":"https://najemniagentura.praha.eu/chci-bydlet/","publication_date":null,"language":"Czech","interpretation_note":"Czech text interpreted and self-reviewed by Codex under the owner-authorized AI policy; no independent language or subject review claimed.","locator":"Referral, available capacity, tenancy and support paragraphs","access_mode":"HTML body","inspection":"Specified official HTML body or segment inspected on 2026-11-22; linked files, forms, maps, videos and live services were not tested","boundary":"The agency does not accept direct applications and referrals depend on capacity. A standard one-year renewable tenancy is not a guaranteed offer, waiting time or indefinite tenancy. No application, personal assessment or tenancy document was submitted."},{"id":"prague-childcare","title":"Prague 5 children's groups","publisher":"Prague 5 municipal district","role":"District-level early-care provision","url":"https://www.praha5.cz/potrebuji-zaridit/socialni-sluzby-podpora-obcanu/detske-skupiny/","publication_date":null,"language":"Czech","interpretation_note":"Czech text interpreted and self-reviewed by Codex under the owner-authorized AI policy; no independent language or subject review claimed.","locator":"Three groups, age bands, capacities and 2026/27 application link","access_mode":"HTML body","inspection":"Specified official HTML body or segment inspected on 2026-11-22; linked files, forms, maps, videos and live services were not tested","boundary":"The introduction's broad age range does not erase group-specific bands. Capacities of 22, 22 and 10 are not vacancies or a city-wide total; no application or live availability check occurred.","application_year":"2026/2027"},{"id":"prague-nove-dvory","title":"Nové Dvory Project 1","publisher":"Prague Development Company (PDS)","role":"Municipal mixed-use planning and metro interface","url":"https://pdspraha.eu/nove-dvory-projekt-1/","publication_date":null,"language":"Czech","interpretation_note":"Czech text interpreted and self-reviewed by Codex under the owner-authorized AI policy; no independent language or subject review claimed.","locator":"Project purpose and September 2022 / 2025 / 2026 chronology","access_mode":"HTML body","inspection":"Specified official HTML body or segment inspected on 2026-11-22; linked files, forms, maps, videos and live services were not tested","boundary":"The requested project URL redirected to this official page. Planning, design contracts and metro interfaces are not occupied housing or completed premises; renders and linked videos were not evaluated.","planning_study_approval_period":"2022-09","design_contracts_period":"2025","preparation_period":"2026"},{"id":"prague-tram-extension","title":"Libuš–Nové Dvory tram construction begins","publisher":"DPP","role":"Dated tram, water-main and metro coordination account","url":"https://www.dpp.cz/spolecnost/pro-media/tiskove-zpravy/detail/278_3478-prazska-tramvajova-sit-se-rozroste-o-dalsi-novou-trat-libus-nove-dvory","publication_date":"2026-10-07","language":"Czech","interpretation_note":"Czech text interpreted and self-reviewed by Codex under the owner-authorized AI policy; no independent language or subject review claimed.","locator":"Ceremony, 1.8 km route, water-main diversions and staged accessible interchange","access_mode":"HTML body","inspection":"Specified official HTML body or segment inspected on 2026-11-22; linked files, forms, maps, videos and live services were not tested","boundary":"Late-2028 trial operation is a forecast. Foundations for a metro connection are not an open accessible interchange; the passage is planned to open with the future station. No additional project identity is counted in the municipal article.","ceremony_date":"2026-10-07","trial_operation_forecast_period":"2028"},{"id":"brno-biomass","title":"Brno-sever modernized biomass heat and power source","publisher":"Teplárny Brno","role":"Operator's trial-operation results and future output account","url":"https://www.teplarny.cz/cs/tiskova-zprava-teplarny-brno-predstavily-modernizovany-zdroj-brno-sever-biomasa-snizi-spotrebu-plynu-i-emise","publication_date":"2026-10-01","language":"Czech","interpretation_note":"Czech text interpreted and self-reviewed by Codex under the owner-authorized AI policy; no independent language or subject review claimed.","locator":"October presentation; 2025/26 trial hours and gas-comparison savings; biomass rail supply","access_mode":"HTML body","inspection":"Specified official HTML body or segment inspected on 2026-11-22; linked files, forms, maps, videos and live services were not tested","boundary":"The presentation is not assigned as the first day of operation. About 15,000 tonnes of CO2 avoided is an operator comparison with gas during trial operation, not independently verified lifecycle neutrality; up to 38,000 tonnes annually is a projection at full use.","construction_start_period":"2023-05","first_biomass_train_period":"2025-10","trial_reporting_season":"2025/2026"},{"id":"brno-heat-network","title":"Brno district-heating network modernization","publisher":"Teplárny Brno","role":"Dated steam-to-hot-water network work account","url":"https://www.teplarny.cz/cs/modernizujeme-teplarenskou-sit-v-brne","publication_date":"2026-04-24","language":"Czech","interpretation_note":"Czech text interpreted and self-reviewed by Codex under the owner-authorized AI policy; no independent language or subject review claimed.","locator":"Named street works and intended reduction of losses and costs","access_mode":"HTML body","inspection":"Specified official HTML body or segment inspected on 2026-11-22; linked files, forms, maps, videos and live services were not tested","boundary":"Planned efficiency improvements are not measured whole-network savings, universal household bill reductions or confirmation of every street's completion. Production and distribution assets have separate delivery records."},{"id":"brno-flood-grant","title":"Trnitá flood-protection grant decision","publisher":"City of Brno — Voda v Brně","role":"Dated funding and procurement-stage account","url":"https://voda.brno.cz/na-stavbu-protipovodnovych-opatreni-na-trnite-ziskalo-mesto-evropskou-dotaci-v-plne-vysi/","publication_date":"2026-10-14","language":"Czech","interpretation_note":"Czech text interpreted and self-reviewed by Codex under the owner-authorized AI policy; no independent language or subject review claimed.","locator":"Grant amount and continuing contractor selection","access_mode":"HTML body","inspection":"Specified official HTML body or segment inspected on 2026-11-22; linked files, forms, maps, videos and live services were not tested","boundary":"The reported CZK 1.815 billion grant decision is not disbursement, accepted construction or proof that every neighbourhood is protected. Expected first-quarter 2027 selection remains a forecast.","contractor_selection_forecast_period":"2027"},{"id":"brno-flood-preparation","title":"Preparation begins along the Svratka and Svitava","publisher":"City of Brno — Voda v Brně","role":"Dated flood-stage and ecological-work preparation","url":"https://voda.brno.cz/zacinaji-pripravne-prace-na-brehu-svratky-a-svitavy-realizace-protipovodnovych-opatreni-se-blizi/","publication_date":"2026-11-05","language":"Czech","interpretation_note":"Czech text interpreted and self-reviewed by Codex under the owner-authorized AI policy; no independent language or subject review claimed.","locator":"Completed Poříčí versus proposed IX–XI stages; tree and river-space measures","access_mode":"HTML body","inspection":"Specified official HTML body or segment inspected on 2026-11-22; linked files, forms, maps, videos and live services were not tested","boundary":"Planned clearance, transplanting and replacement planting are not verified completion or tree-survival results. Proposed hundred-year-flow protection is not elimination of flood risk; the Svratka design qualifier excludes the reservoir's effect.","main_works_forecast_period":"2027"},{"id":"brno-housing","title":"Ordinary municipal rental housing in Brno","publisher":"City of Brno — Bydlení Brno","role":"Published application and district-selection arrangements","url":"https://bydleni.brno.cz/bezne-byty/","publication_date":null,"language":"Czech","interpretation_note":"Czech text interpreted and self-reviewed by Codex under the owner-authorized AI policy; no independent language or subject review claimed.","locator":"Official indexed municipal page: common form, district criteria and submission channels","access_mode":"Official indexed text","inspection":"Specified official indexed text inspected on 2026-11-22 after direct retrieval failed; the full live page, linked files, forms and services were not tested","boundary":"Direct retrieval timed out. The common form does not create common selection criteria, vacancies in every district or a guaranteed tenancy. Linked regulations and application forms were not inspected or submitted; no individual eligibility determination is made.","common_form_effective_date":"2026-01-01"},{"id":"brno-tram-maintenance","title":"Medlánky tram-maintenance investments","publisher":"Brno Public Transport Company (DPMB)","role":"Dated equipment completion and maintenance mechanism","url":"https://www.dpmb.cz/servis-tramvaji-v-medlankach-se-zrychli-dpmb-poridil-unikatni-mobilni-soustruh-nerezovou-mycku","publication_date":"2026-05-06","language":"Czech","interpretation_note":"Czech text interpreted and self-reviewed by Codex under the owner-authorized AI policy; no independent language or subject review claimed.","locator":"Mobile wheel lathe, wash line and reported CZK 61 million investment","access_mode":"HTML body","inspection":"Specified official HTML body or segment inspected on 2026-11-22; linked files, forms, maps, videos and live services were not tested","boundary":"Installed equipment and intended shorter service time are not measured fleet-wide uptime or demonstrated journey reliability. Reported investment is not a city-wide transport budget."},{"id":"brno-winter-preparation","title":"Brno public transport prepares for winter","publisher":"DPMB","role":"Dated preparation and operating-method account","url":"https://www.dpmb.cz/dpmb-se-pripravuje-na-zimu-proveruje-techniku-vytapeni-vozu-pripravuje-servisni-vozy","publication_date":"2026-11-03","language":"Czech","interpretation_note":"Czech text interpreted and self-reviewed by Codex under the owner-authorized AI policy; no independent language or subject review claimed.","locator":"Vehicle heating, ice prevention and switch-maintenance paragraphs","access_mode":"HTML body","inspection":"Specified official HTML body or segment inspected on 2026-11-22; linked files, forms, maps, videos and live services were not tested","boundary":"Preparation is not observed performance over the coming winter. Described intervention methods do not establish that every departure or accessible journey will run; no live route or vehicle was tested."}],'Exact source identity, language, access scope and dates must remain intact');
  assert.equal(review.sources_sha256,czechMetroCitiesHash(data.sources));assert.equal(review.edition_sha256,czechMetroCitiesHash(data));
}
export const czechMetroCitiesCriticalPhrases=[
  [
    0,
    0,
    "stages of one railway"
  ],
  [
    0,
    0,
    "Depo Písnice remained deferred"
  ],
  [
    0,
    1,
    "not final expenditure for all of Metro D"
  ],
  [
    0,
    1,
    "second half of 2032"
  ],
  [
    0,
    2,
    "Czech release excludes transport and control systems"
  ],
  [
    0,
    2,
    "English release includes them"
  ],
  [
    0,
    2,
    "cannot settle the contractual boundary"
  ],
  [
    0,
    3,
    "not an independent finding that no damage has occurred"
  ],
  [
    0,
    4,
    "future arrangements at the November 22 inspection"
  ],
  [
    0,
    4,
    "completion of a Pankrác passage section from full public opening"
  ],
  [
    1,
    0,
    "do not describe identical months or unchanged treatment scopes"
  ],
  [
    1,
    0,
    "limits assessed on an annual-average basis"
  ],
  [
    1,
    1,
    "does not accept direct applications"
  ],
  [
    1,
    1,
    "Referral is not a guaranteed offer"
  ],
  [
    1,
    2,
    "not a count of vacancies or a city-wide childcare entitlement"
  ],
  [
    1,
    3,
    "not occupied housing or completed public premises"
  ],
  [
    1,
    4,
    "late-2028 trial-operation date is a forecast"
  ],
  [
    1,
    4,
    "intended to open with the station"
  ],
  [
    2,
    0,
    "not an already measured annual result"
  ],
  [
    2,
    0,
    "not an independent lifecycle assessment"
  ],
  [
    2,
    1,
    "does not quantify realized whole-network savings"
  ],
  [
    2,
    2,
    "A grant decision is not accepted construction"
  ],
  [
    2,
    2,
    "a planting plan is not tree survival"
  ],
  [
    2,
    3,
    "registration is not an offer"
  ],
  [
    2,
    3,
    "after direct retrieval timed out"
  ],
  [
    2,
    4,
    "not a measured guarantee that every trip will run"
  ]
];
