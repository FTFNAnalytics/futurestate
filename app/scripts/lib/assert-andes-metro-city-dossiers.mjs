import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
export const andesMetroCityHash=value=>createHash('sha256').update(JSON.stringify(value)).digest('hex');
export function assertAndesMetroCityDossiers(data,review){
  assert.equal(data.inspected_date,'2026-11-22');assert.equal(data.timezone,'America/Edmonton');
  assert.equal(data.review_policy,'OWNER-AUTHORIZED-AI-REVIEW-2026-09-25');
  assert.equal(review.policy_id,data.review_policy);assert.equal(review.review_date,data.inspected_date);
  assert.equal(data.independent_review,false);assert.equal(data.phase_60_identity_added,false);
  for(const key of ['independent_review','publication_authorized','launch_authorized','phase_216_complete'])assert.equal(review[key],false);
  assert.deepEqual(data.records.map(r=>r.record_id),["project-quito-metro-line-1","project-lima-callao-line-2","place-quito-metropolitan-district"],'Exact record_id boundary changed');
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
    assert.equal(review.records.find(d=>d.record_id===r.record_id)?.sha256,andesMetroCityHash(r),'Article changed after exact-version review');
  }
  assert.deepEqual(data.records.map(r=>r.scope),["One original Quitumbe–Labrador metro line. Its stations and operating subsystems are components, not additional projects; the proposed La Ofelia extension is future context and is not counted as operating infrastructure or a separate addition here.","One integrated Line 2 and contracted Line 4 branch project: 27 km plus an 8 km branch. The five-station Etapa 1A is the operating subset; later stages, individual stations and the wider future Line 4 are not additional counted projects here.","One Distrito Metropolitano de Quito, including its urban and rural parish context, not the whole province of Pichincha or a wider water catchment. Illustrative canals, treatment proposals, childcare centres and neighbourhood works do not create additional counted identities."],'Exact scope boundary changed');
  assert.deepEqual(data.records.map(r=>r.stage),["Commercial operation began December 1, 2023. September 2026 totals and the October service-page update describe an operating line; survey scores, reference frequencies and financing support for an extension do not establish uninterrupted service or extension delivery.","Etapa 1A opened December 21, 2023. A July 2026 report records completion of Line 2 tunnel excavation, while the August regulator account still describes installation and future operating forecasts. Card requirements and a November personalization-restoration notice concern access, not full-corridor opening.","Dated municipal accounts report a bounded canal repair, childcare-place allocations, property regularization and local works, alongside water investments at mixed planning and procurement stages. These are not universal service delivery, independently audited results or one combined city-performance score."],'Exact stage boundary changed');
  assert.deepEqual(data.records.map(r=>r.route),["/atlas/projects/quito-metro-line-1/","/atlas/projects/lima-callao-line-2/","/atlas/places/quito-metropolitan-district/"],'Exact route boundary changed');
  assert.deepEqual(data.records.map(r=>r.aliases),[["Quito Metro","Metro de Quito","Primera Línea del Metro de Quito","Quito Metro Line 1"],["Lima Metro Line 2","Línea 2 del Metro de Lima y Callao","Metro de Lima Línea 2","Line 2 and Line 4 branch"],["Quito","Distrito Metropolitano de Quito","Quito Metropolitan District","DMQ"]],'Exact aliases boundary changed');
  assert.deepEqual(data.records.map(r=>r.timeline),[[{"date":"2023-12-01","event":"Commercial operation began, as reported in the municipality's December 5 account.","source_ids":["quito-metro-opening"]},{"date":"2025-02","event":"Owner explained rail-defect precautions and planned corrective work; the page displays two February header dates.","source_ids":["quito-metro-maintenance"]},{"date":"2026-04","event":"A 434-user survey and service interruptions occurred during the month described in the May release.","source_ids":["quito-metro-april"]},{"date":"2026-05-11","event":"Municipality described CAF support for four proposed stations toward La Ofelia.","source_ids":["quito-metro-extension"]},{"date":"2026-05-14","event":"Municipality published January–April trips, survey results and the maintenance account.","source_ids":["quito-metro-april"]},{"date":"2026-09-30","event":"Cutoff for the homepage's cumulative trip total.","source_ids":["quito-metro-september"]},{"date":"2026-10-07","event":"Service page records its information review, retaining August reference frequencies.","source_ids":["quito-metro-service"]}],[{"date":"2023-12-21","event":"The concessionaire dates the start of Etapa 1A operation to this day.","source_ids":["lima-project"]},{"date":"2026-06-30","event":"Card-access notice bears this publication date; its current wording refers retrospectively to July 8.","source_ids":["lima-card-access"]},{"date":"2026-07-02","event":"Concessionaire reported completion of the 27 km Line 2 tunnel excavation.","source_ids":["lima-tunnel-completion"]},{"date":"2026-07-08","event":"Transport-card validation requirement took effect under the published notice.","source_ids":["lima-card-access"]},{"date":"2026-08-04","event":"Ositrán reported separate construction progress and future operation forecasts for later stages.","source_ids":["lima-regulator-progress"]},{"date":"2026-08-26","event":"Congress news centre described a visit to operating, testing and maintenance facilities.","source_ids":["lima-parliament-visit"]},{"date":"2026-11-18","event":"Concessionaire announced restoration of card-personalization service at ticket offices.","source_ids":["lima-card-restored"]}],[{"date":"2026-01-23","event":"Municipality presented a mixed-stage water, sanitation and drainage investment portfolio.","source_ids":["quito-water-portfolio"]},{"date":"2026-02-27","event":"Municipality published its account of forty-three works in Calderón and Llano Chico; the exact ceremony date is not assigned.","source_ids":["quito-rural-works"]},{"date":"2026-05-02","event":"EPMAPS completed the described 42-metre Pita canal repair, according to the May 4 report.","source_ids":["quito-pita-repair"]},{"date":"2026-07-15","event":"Municipality reported allocation of 524 educational-continuity places.","source_ids":["quito-childcare-transition"]},{"date":"2026-11-18","event":"Municipal regularization account reported an aggregate title count over a little more than three years.","source_ids":["quito-property-regularization"]}]],'Exact timeline boundary changed');
  assert.deepEqual(data.records.map(r=>r.sections.map(s=>s.source_ids)),[[["quito-metro-opening","quito-metro-service"],["quito-metro-september","quito-metro-april"],["quito-metro-maintenance","quito-metro-april"],["quito-metro-extension"],["quito-metro-service"],[]],[["lima-project"],["lima-tunnel-completion","lima-regulator-progress"],["lima-card-access","lima-card-restored"],["lima-accessibility"],["lima-parliament-visit","lima-regulator-progress"],[]],[["quito-pita-repair"],["quito-water-portfolio"],["quito-childcare-transition"],["quito-property-regularization"],["quito-rural-works"],[]]],'Claim-to-source bindings changed');
  for(const r of data.records)assert(!Object.hasOwn(r,'historical_acquisition'),'New Andes-group identity must not reuse a historical country docket');
  for(const [ri,si,phrase] of andesMetroCityCriticalPhrases)assert(data.records[ri].sections[si].text.includes(phrase),'Missing bounded claim: '+phrase);
  assert.deepEqual(data.sources,[{"id":"quito-metro-opening","title":"Quito Metro reports the start of commercial operation","publisher":"Municipality of Quito — Quito Informa","role":"Dated retrospective opening account","url":"https://quitoinforma.quito.gob.ec/2023/12/05/metro-de-quito-inicio-operaciones-de-acuerdo-con-el-cronograma-ofrecido/","publication_date":"2023-12-05","language":"Spanish","interpretation_note":"Spanish text interpreted and self-reviewed by Codex under the owner-authorized AI policy; no independent language or subject review claimed.","locator":"Indexed report of the December 1 opening and fifteen stations","access_mode":"Official indexed text","inspection":"Specified official indexed text inspected on 2026-11-22 after direct retrieval failed; the full live page, linked files, forms and services were not tested","boundary":"Direct retrieval timed out. The opening account is not a current fleet-availability, payment or service-reliability audit.","opening_date":"2023-12-01"},{"id":"quito-metro-service","title":"Quito Metro hours and stations","publisher":"Empresa Pública Metropolitana Metro de Quito","role":"Published route and reference service","url":"https://metrodequito.gob.ec/horarios-estaciones/","publication_date":null,"language":"Spanish","interpretation_note":"Spanish text interpreted and self-reviewed by Codex under the owner-authorized AI policy; no independent language or subject review claimed.","locator":"Route list, weekday hours, reference frequencies and update note","access_mode":"HTML body","inspection":"Specified official HTML body or segment inspected on 2026-11-22; linked files, forms, maps, videos and live services were not tested","boundary":"Reference frequencies come from an August bulletin, not observed November headways. Linked PDFs, interactive station selector and live services were not tested.","information_updated_date":"2026-10-07","frequency_reference_period":"2026-08"},{"id":"quito-metro-september","title":"Quito Metro September figures","publisher":"Empresa Pública Metropolitana Metro de Quito","role":"Homepage's reporting-period totals","url":"https://metrodequito.gob.ec/","publication_date":null,"language":"Spanish","interpretation_note":"Spanish text interpreted and self-reviewed by Codex under the owner-authorized AI policy; no independent language or subject review claimed.","locator":"Metro en cifras: cumulative and September trip totals only","access_mode":"HTML body","inspection":"Specified official HTML body or segment inspected on 2026-11-22; linked files, forms, maps, videos and live services were not tested","boundary":"Trips are not distinct people. Zero-valued peak-day/station widgets were excluded; underlying statistical bulletin was not inspected.","reporting_period":"2026-09","cumulative_cutoff_date":"2026-09-30"},{"id":"quito-metro-april","title":"Quito Metro ridership, survey and April interruptions","publisher":"Municipality of Quito — Quito Informa","role":"Municipal summary of operating and survey evidence","url":"https://www.quitoinforma.gob.ec/2026/05/14/metro-de-quito-supera-los-144-millones-de-viajes-y-alcanza-alta-calificacion-ciudadana/","publication_date":"2026-05-14","language":"Spanish","interpretation_note":"Spanish text interpreted and self-reviewed by Codex under the owner-authorized AI policy; no independent language or subject review claimed.","locator":"January–April trips, 434-user survey and April communications/wheel-maintenance paragraphs","access_mode":"HTML body","inspection":"Specified official HTML body or segment inspected on 2026-11-22; linked files, forms, maps, videos and live services were not tested","boundary":"Survey ratings are not an equipment-availability or independent safety audit. The underlying survey instrument and outage-duration records were not inspected.","survey_period":"2026-04","cumulative_cutoff_date":"2026-04-30"},{"id":"quito-metro-maintenance","title":"Quito Metro maintenance explanation","publisher":"Empresa Pública Metropolitana Metro de Quito","role":"Historical maintenance and corrective-work account","url":"https://metrodequito.gob.ec/todos-los-mantenimientos/","publication_date":null,"language":"Spanish","interpretation_note":"Spanish text interpreted and self-reviewed by Codex under the owner-authorized AI policy; no independent language or subject review claimed.","locator":"Article body on rail defects, speed restriction, corrective procurement and planned repair; header displays February 11 and 12","access_mode":"HTML body","inspection":"Specified official HTML body or segment inspected on 2026-11-22; linked files, forms, maps, videos and live services were not tested","boundary":"The two header dates are not assigned unverified publication/update roles. Planned February repair and testing are not a completion receipt; historical defects are not presumed still unresolved.","publication_period":"2025-02","period_basis":"Both displayed header dates fall in February 2025; the extracted page does not label their separate roles.","defect_detection_period":"2024-10"},{"id":"quito-metro-extension","title":"CAF backing for the proposed La Ofelia extension","publisher":"Municipality of Quito — Quito Informa","role":"Dated financing and extension-planning account","url":"https://www.quitoinforma.gob.ec/2026/05/11/caf-ratifica-respaldo-financiero-para-la-ampliacion-del-metro-de-quito-hasta-la-ofelia/","publication_date":"2026-05-11","language":"Spanish","interpretation_note":"Spanish text interpreted and self-reviewed by Codex under the owner-authorized AI policy; no independent language or subject review claimed.","locator":"USD 80 million support and four proposed stations","access_mode":"HTML body","inspection":"Specified official HTML body or segment inspected on 2026-11-22; linked files, forms, maps, videos and live services were not tested","boundary":"Reported credit approval is not disbursement, works acceptance or passenger service. The page's inconsistent three-years-and-five-months duration is excluded; projected travel times remain forecasts."},{"id":"lima-project","title":"Line 2 and Line 4 branch project","publisher":"Sociedad Concesionaria Metro de Lima Línea 2","role":"Named contract scope and staged operation","url":"https://metrolima2.com/proyecto/","publication_date":null,"language":"Spanish","interpretation_note":"Spanish text interpreted and self-reviewed by Codex under the owner-authorized AI policy; no independent language or subject review claimed.","locator":"Project scope and Etapa 1A opening paragraphs","access_mode":"HTML body","inspection":"Specified official HTML body or segment inspected on 2026-11-22; linked files, forms, maps, videos and live services were not tested","boundary":"The 35 km contract includes the 27 km Line 2 and 8 km branch, not the whole future Line 4. Investment commitment excludes IGV and is not final expenditure; design automation and projected demand are not current service outcomes.","first_stage_opening_date":"2023-12-21"},{"id":"lima-card-access","title":"Transport card required for Line 2 access","publisher":"Sociedad Concesionaria Metro de Lima Línea 2 / ATU","role":"Published card and fare distinction","url":"https://www.metrolima2.com/2026/06/30/a-partir-del-8-de-julio-necesitaras-tu-tarjeta-para-viajar-en-la-linea-2/","publication_date":"2026-06-30","language":"Spanish","interpretation_note":"Spanish text interpreted and self-reviewed by Codex under the owner-authorized AI policy; no independent language or subject review claimed.","locator":"Indexed card requirement, S/7.50 purchase and no-recharge paragraphs","access_mode":"Official indexed text","inspection":"Specified official indexed text inspected on 2026-11-22 after direct retrieval failed; the full live page, linked files, forms and services were not tested","boundary":"Direct retrieval timed out. The page's retrospective effective-date wording may have been updated; no new publication date is invented. Cumulative ridership is excluded; card purchase is not a journey fare.","effective_date":"2026-07-08"},{"id":"lima-tunnel-completion","title":"Delia completes Line 2 tunnel excavation","publisher":"Sociedad Concesionaria Metro de Lima Línea 2","role":"Dated construction milestone","url":"https://metrolima2.com/2026/07/02/tuneladora-delia-culmino-la-excavacion-del-tunel-de-la-linea-2/","publication_date":"2026-07-02","language":"Spanish","interpretation_note":"Spanish text interpreted and self-reviewed by Codex under the owner-authorized AI policy; no independent language or subject review claimed.","locator":"Excavation completion and methods paragraphs only","access_mode":"HTML body","inspection":"Specified official HTML body or segment inspected on 2026-11-22; linked files, forms, maps, videos and live services were not tested","boundary":"Completed excavation is not railway commissioning or all stations opening. Undated/general project-page excavation wording does not override this dated report; cumulative passenger totals are not used."},{"id":"lima-regulator-progress","title":"Ositrán reports stage-specific construction progress","publisher":"Ositrán","role":"Regulator's construction and forecast account","url":"https://www.gob.pe/institucion/ositran/noticias/1426048-linea-2-del-metro-etapas-1b-y-2-superan-el-90-de-avance-en-su-construccion","publication_date":"2026-08-04","language":"Spanish","interpretation_note":"Spanish text interpreted and self-reviewed by Codex under the owner-authorized AI policy; no independent language or subject review claimed.","locator":"Official indexed release: stage 1B/2/branch progress and remaining systems","access_mode":"Official indexed text","inspection":"Specified official indexed text inspected on 2026-11-22 after direct retrieval failed; the full live page, linked files, forms and services were not tested","boundary":"Direct retrieval returned HTTP 418. Percentages concern separate construction scopes, not service coverage. The 2029/2030 operating dates are forecasts in this dated release, not completion commitments or new inspections.","stage_1b_forecast_period":"2029","stage_2_forecast_period":"2030-10"},{"id":"lima-accessibility","title":"Metro Accesible","publisher":"Sociedad Concesionaria Metro de Lima Línea 2","role":"Operator's physical-access and assistance description","url":"https://metrolima2.com/metro-accesible/","publication_date":null,"language":"Spanish","interpretation_note":"Spanish text interpreted and self-reviewed by Codex under the owner-authorized AI policy; no independent language or subject review claimed.","locator":"Accessible-route equipment list, assistance and route-status contact guidance","access_mode":"HTML body","inspection":"Specified official HTML body or segment inspected on 2026-11-22; linked files, forms, maps, videos and live services were not tested","boundary":"Described lifts, tactile surfaces and assistance do not establish live equipment availability. No phone call, station inspection, form or personalized travel assessment was performed."},{"id":"lima-parliament-visit","title":"Congress visit to the operating first stage","publisher":"Congress of Peru — News Centre","role":"Dated account of a parliamentary site visit","url":"https://comunicaciones.congreso.gob.pe/noticias/presidente-del-congreso-verifica-funcionamiento-y-avances-de-la-etapa-1a-de-la-linea-2-del-metro-de-lima-y-callao/","publication_date":"2026-08-26","language":"Spanish","interpretation_note":"Spanish text interpreted and self-reviewed by Codex under the owner-authorized AI policy; no independent language or subject review claimed.","locator":"Visit, testing/maintenance and public-private coordination paragraphs","access_mode":"HTML body","inspection":"Specified official HTML body or segment inspected on 2026-11-22; linked files, forms, maps, videos and live services were not tested","boundary":"Political testimony about delay causes and benefits is not an independent causal evaluation, acceptance certificate or new opening decision."},{"id":"lima-card-restored","title":"Card personalization service restored","publisher":"Sociedad Concesionaria Metro de Lima Línea 2","role":"Dated restoration notice for one administrative service","url":"https://metrolima2.com/2026/11/18/servicio-de-personalizacion-de-tarjetas-restablecido/","publication_date":"2026-11-18","language":"Spanish","interpretation_note":"Spanish text interpreted and self-reviewed by Codex under the owner-authorized AI policy; no independent language or subject review claimed.","locator":"Official indexed date and short ticket-office restoration notice","access_mode":"Official indexed text","inspection":"Specified official indexed text inspected on 2026-11-22 after direct retrieval failed; the full live page, linked files, forms and services were not tested","boundary":"Direct retrieval timed out. Restoration of card personalization does not prove uninterrupted train service, exact outage duration or current performance of every station."},{"id":"quito-water-portfolio","title":"Nine water and sanitation projects presented to investors","publisher":"Municipality of Quito — Quito Informa / EPMAPS","role":"Dated investment portfolio with mixed delivery stages","url":"https://www.quitoinforma.gob.ec/2026/01/23/nueve-proyectos-estrategicos-de-agua-y-saneamiento-se-expusieron-ante-inversionistas-globales/","publication_date":"2026-01-23","language":"Spanish","interpretation_note":"Spanish text interpreted and self-reviewed by Codex under the owner-authorized AI policy; no independent language or subject review claimed.","locator":"Portfolio introduction and distinctions among studies, procurement and works","access_mode":"HTML body","inspection":"Specified official HTML body or segment inspected on 2026-11-22; linked files, forms, maps, videos and live services were not tested","boundary":"A roughly USD 100 million portfolio is not committed financing or delivered treatment. Coverage figures and projected beneficiaries are not adopted as measured continuity or water-quality outcomes."},{"id":"quito-pita-repair","title":"Pita canal section repaired for Puengasí supply","publisher":"Municipality of Quito — Quito Informa / EPMAPS","role":"Dated completion account for bounded maintenance","url":"https://www.quitoinforma.gob.ec/2026/05/04/trabajos-de-reparacion-en-un-tramo-del-canal-pita-aseguran-el-suministro-de-agua-a-la-planta-de-puengasi/","publication_date":"2026-05-04","language":"Spanish","interpretation_note":"Spanish text interpreted and self-reviewed by Codex under the owner-authorized AI policy; no independent language or subject review claimed.","locator":"May 2 completion, 42-metre scope and progressive refill","access_mode":"HTML body","inspection":"Specified official HTML body or segment inspected on 2026-11-22; linked files, forms, maps, videos and live services were not tested","boundary":"The reported repair supplies raw water to one plant; it is not a city-wide uninterrupted household supply or drinking-water quality measurement.","repair_completion_date":"2026-05-02"},{"id":"quito-childcare-transition","title":"524 Quito Wawas places assigned for educational continuity","publisher":"Municipality of Quito — Quito Informa","role":"Municipal allocation and priority account","url":"https://quitoinforma.quito.gob.ec/2026/07/15/nuevo-record-de-continuidad-educativa-524-ninas-y-ninos-de-quito-wawas-pasan-a-los-cemei/","publication_date":"2026-07-15","language":"Spanish","interpretation_note":"Spanish text interpreted and self-reviewed by Codex under the owner-authorized AI policy; no independent language or subject review claimed.","locator":"Official indexed 524-place allocation and proximity/vulnerability criteria","access_mode":"Official indexed text","inspection":"Specified official indexed text inspected on 2026-11-22 after direct retrieval failed; the full live page, linked files, forms and services were not tested","boundary":"Direct retrieval timed out. Assigned places do not establish actual attendance, universal entitlement or a longitudinal educational outcome; ambiguous wider centre totals were excluded."},{"id":"quito-property-regularization","title":"Property regularization and individual title in Quito","publisher":"Municipality of Quito — Quito Informa","role":"Municipal explanation and aggregate title count","url":"https://quitoinforma.quito.gob.ec/2026/11/18/veronica-andino-30-anos-de-espera-para-convertir-un-sueno-en-un-titulo-de-propiedad/","publication_date":"2026-11-18","language":"Spanish","interpretation_note":"Spanish text interpreted and self-reviewed by Codex under the owner-authorized AI policy; no independent language or subject review claimed.","locator":"Regularization mechanism and final aggregate paragraph; no private record query","access_mode":"HTML body","inspection":"Specified official HTML body or segment inspected on 2026-11-22; linked files, forms, maps, videos and live services were not tested","boundary":"Municipal claims of 9,574 titles are not independently audited registries or new-house counts. Individual titles, utility connections and safe housing remain separate; no personal legal assessment is made."},{"id":"quito-rural-works","title":"Forty-three works in Calderón and Llano Chico","publisher":"Municipality of Quito — Quito Informa","role":"Reported handover of local streets and shared facilities","url":"https://www.quitoinforma.gob.ec/2026/02/27/nuevas-calles-parques-y-casas-comunales-43-obras-marcan-un-cambio-la-ruralidad-de-quito/","publication_date":"2026-02-27","language":"Spanish","interpretation_note":"Spanish text interpreted and self-reviewed by Codex under the owner-authorized AI policy; no independent language or subject review claimed.","locator":"Introductory handover account and local examples; cost table not used","access_mode":"HTML body","inspection":"Specified official HTML body or segment inspected on 2026-11-22; linked files, forms, maps, videos and live services were not tested","boundary":"Publication is not assigned as the handover ceremony's exact date. Forty-three works are not forty-three extra counted projects; tabular cost formatting is inconsistent and not summed or treated as audited spending."}],'Exact source identity, language, access scope and dates must remain intact');
  assert.equal(review.sources_sha256,andesMetroCityHash(data.sources));assert.equal(review.edition_sha256,andesMetroCityHash(data));
}
export const andesMetroCityCriticalPhrases=[
  [
    0,
    0,
    "without adding proposed northern stations"
  ],
  [
    0,
    1,
    "journeys, not distinct people"
  ],
  [
    0,
    1,
    "not measured lift availability or an independent safety audit"
  ],
  [
    0,
    2,
    "not a repair-completion receipt, nor evidence that the defect remains unresolved"
  ],
  [
    0,
    2,
    "does not measure their duration"
  ],
  [
    0,
    3,
    "not disbursement, accepted construction or passenger operation"
  ],
  [
    0,
    3,
    "inconsistent description of elapsed operating years"
  ],
  [
    0,
    4,
    "not observed November headways"
  ],
  [
    1,
    0,
    "not two fully operating lines"
  ],
  [
    1,
    0,
    "excludes IGV and is not final audited expenditure"
  ],
  [
    1,
    1,
    "not acceptance of the complete railway"
  ],
  [
    1,
    1,
    "forecasts in that dated release"
  ],
  [
    1,
    2,
    "not the price of each trip"
  ],
  [
    1,
    2,
    "one administrative function, not uninterrupted train operation"
  ],
  [
    1,
    3,
    "installed equipment is not the same as its live availability"
  ],
  [
    1,
    3,
    "No call or station inspection was performed"
  ],
  [
    1,
    4,
    "not an independent causal evaluation"
  ],
  [
    1,
    4,
    "not an acceptance certificate"
  ],
  [
    2,
    0,
    "not a measurement of uninterrupted household supply"
  ],
  [
    2,
    1,
    "cannot all be described as completed infrastructure"
  ],
  [
    2,
    1,
    "prove that every item has secured financing"
  ],
  [
    2,
    2,
    "Assigned places are not confirmed attendance"
  ],
  [
    2,
    2,
    "after direct retrieval timed out"
  ],
  [
    2,
    3,
    "not an independently audited register or a count of newly built homes"
  ],
  [
    2,
    4,
    "not forty-three additional portfolio projects"
  ],
  [
    2,
    4,
    "not summed into an audited expenditure total"
  ]
];
