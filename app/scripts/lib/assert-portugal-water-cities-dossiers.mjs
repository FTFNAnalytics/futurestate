import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
export const portugalWaterCitiesHash=value=>createHash('sha256').update(JSON.stringify(value)).digest('hex');
export function assertPortugalWaterCitiesDossiers(data,review){
  assert.equal(data.inspected_date,'2026-11-22');assert.equal(data.timezone,'America/Edmonton');
  assert.equal(data.review_policy,'OWNER-AUTHORIZED-AI-REVIEW-2026-09-25');
  assert.equal(review.policy_id,data.review_policy);assert.equal(review.review_date,data.inspected_date);
  assert.equal(data.independent_review,false);assert.equal(data.phase_60_identity_added,false);
  for(const key of ['independent_review','publication_authorized','launch_authorized','phase_216_complete'])assert.equal(review[key],false);
  assert.deepEqual(data.records.map(r=>r.record_id),["project-alqueva-multipurpose","place-lisbon","place-porto"]);
  assert.deepEqual(data.records.map(r=>r.kind),['Project','Place','Place']);
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
    assert(r.sections.map(s=>s.text).join(' ').split(/\s+/).length>=500);
    for(const s of r.sections){assert(s.heading&&s.text.length>200);assert(s.source_ids.every(id=>ids.has(id)));if(!s.source_ids.length)assert.equal(s.claim_type,'Editorial evidence test');}
    assert(r.timeline.length>=3);let previous='';
    for(const item of r.timeline){validPeriod(item.date);assert(item.date<=data.inspected_date&&item.date>=previous);previous=item.date;assert(item.event&&item.source_ids.length&&item.source_ids.every(id=>ids.has(id)));}
    assert(r.next_artifacts.length>=3);assert(r.related.every(link=>/^\/atlas\/[a-z0-9/-]+\/$/.test(link.route)));
    assert.equal(review.records.find(d=>d.record_id===r.record_id)?.sha256,portugalWaterCitiesHash(r),'Article changed after exact-version review');
  }
  assert.deepEqual(data.records.map(r=>r.scope),["One Empreendimento de Fins Múltiplos de Alqueva managed by EDIA, including its connected water-distribution system and component expansion decisions. Individual reservoirs, irrigation blocks, pumping groups and self-consumption plants are not additional counted projects. Separately promoted solar schemes sharing the Alqueva name are not automatically part of these delivery claims.","Município de Lisboa, counted as one place across its twenty-four freguesias. Excludes the wider Lisbon metropolitan area and surrounding municipalities. Parish-level programmes and individual drainage structures are components of the city account, not additional place identities.","Concelho do Porto, counted as one municipality across seven parish-level units, including three unions of parishes. Excludes the wider metropolitan area, Vila Nova de Gaia and the northern-region reach of Porto Energy Hub. Former parishes and local interventions add no separate place identities."],'Exact scope boundary changed');
  assert.deepEqual(data.records.map(r=>r.stage),["Operating water-system context and dated government allocation, pricing and component-investment accounts inspected. Announced ceilings, procurement and expenditure authorization are not blanket acceptance of every expansion or measured environmental outcomes.","Municipal identity, drainage design and chronology, delegation decisions and ongoing programme descriptions inspected. Excavation milestones, approved funding and future commitments do not establish full-system commissioning or measured city-wide outcomes.","Municipal identity, installed drainage descriptions, utility-reported figures and an energy-advice service inspected. Design capacities, recognition and programme aims are not blanket city-wide performance acceptance."],'Exact stage boundary changed');
  assert.deepEqual(data.records.map(r=>r.route),["/atlas/projects/alqueva-multipurpose/","/atlas/places/lisbon/","/atlas/places/porto/"],'Exact route boundary changed');
  assert.deepEqual(data.records.map(r=>r.aliases),[["Empreendimento de Fins Múltiplos de Alqueva","EFMA","Alqueva multipurpose project","Aproveitamento Hidroagrícola de Alqueva"],["Lisboa","Município de Lisboa","Lisbon municipality","Concelho de Lisboa"],["Oporto","Município do Porto","Porto municipality","Concelho do Porto"]],'Exact aliases boundary changed');
  assert.deepEqual(data.records.map(r=>r.timeline),[[{"date":"2023-12-10","event":"Government announces procurement for four pumping-station self-consumption solar units.","source_ids":["alqueva-solar"]},{"date":"2024-03-18","event":"Government authorizes Vidigueira phase-two and Álamos pumping expenditure, separately describing Cuba-Este as operating.","source_ids":["alqueva-expansion"]},{"date":"2025-02-17","event":"Government reports national-interest recognition of the hydro-agricultural scheme.","source_ids":["alqueva-scope"]},{"date":"2026-01-16","event":"Government announces a conditional revised annual water-use framework and governance requirements.","source_ids":["alqueva-allocation"]},{"date":"2026-02-13","event":"Government explains contracted-water pricing and separate additional-volume tiers.","source_ids":["alqueva-tariffs"]}],[{"date":"2012","event":"Municipal page identifies the administrative reorganization that established the twenty-four-parish map.","source_ids":["lisbon-identity"]},{"date":"2025-07","event":"Drainage chronology labels Monsanto–Santa Apolónia excavation completion in July, separate from the later content-entry timestamp.","source_ids":["lisbon-drainage-plan"]},{"date":"2026-07-29","event":"Executive announces renewed parish responsibilities and funding proposals.","source_ids":["lisbon-delegation"]},{"date":"2026-09-08","event":"Updated article records assembly approval of the July delegation contracts.","source_ids":["lisbon-delegation"]},{"date":"2026-09-09","event":"Executive announces separate maintenance and digital investments, with its cooperation contracts still subject to assembly approval.","source_ids":["lisbon-maintenance-digital"]},{"date":"2026-09-19","event":"City describes ongoing heat, mobility and reuse programmes at Cidade do Zero.","source_ids":["lisbon-climate-programmes"]}],[{"date":"2009","event":"Asprela retrospective identifies the first pilot stream-restoration phase.","source_ids":["porto-asprela"]},{"date":"2013","event":"Municipal page dates the reorganization producing the current seven parish-level units.","source_ids":["porto-identity"]},{"date":"2015","event":"Asprela account dates the Quinta das Lamas daylighting phase.","source_ids":["porto-asprela"]},{"date":"2022","event":"Asprela account dates the park phase and its three retention basins.","source_ids":["porto-asprela"]},{"date":"2025","event":"Municipal rain-garden record dates the Rua Santos Pousada intervention, without an exact day.","source_ids":["porto-rain-garden"]},{"date":"2026-10-27","event":"Municipal climate account publishes utility-reported indicators; the recognition event was October 8.","source_ids":["porto-water-performance"]}]],'Exact timeline boundary changed');
  assert.deepEqual(data.records.map(r=>r.sections.map(s=>s.source_ids)),[[["alqueva-scope"],["alqueva-allocation"],["alqueva-tariffs"],["alqueva-solar"],["alqueva-expansion"],[]],[["lisbon-identity"],["lisbon-drainage-plan","lisbon-drainage-tunnels"],["lisbon-delegation"],["lisbon-maintenance-digital"],["lisbon-climate-programmes"],[]],[["porto-identity"],["porto-water-performance"],["porto-asprela"],["porto-rain-garden"],["porto-energy-hub"],[]]],'Claim-to-source bindings changed');
  for(const r of data.records)assert(!Object.hasOwn(r,'historical_acquisition'),'New Portugal identity must not reuse a historical country docket');
  for(const [ri,si,phrase] of portugalWaterCitiesCriticalPhrases)assert(data.records[ri].sections[si].text.includes(phrase),'Missing bounded claim: '+phrase);
  assert.deepEqual(data.sources,[{"id":"alqueva-scope","title":"Alqueva classified as nationally significant","publisher":"Government of Portugal","role":"Dated government account of scheme recognition","url":"https://portugal.gov.pt/gc24/comunicacao/noticias/governo-classifica-alqueva-como-obra-de-interesse-nacional","publication_date":"2025-02-17","language":"Portuguese","interpretation_note":"Portuguese source interpreted into English by Codex under the owner-authorized AI policy; no independent language review claimed.","locator":"Scheme, EDIA management and Guadiana–Sado context","access_mode":"HTML body","inspection":"Relevant official HTML text inspected on 2026-11-22; linked legal instruments, files, images, live services and dynamic feeds were not inspected","boundary":"The government account is not inspection of the underlying legal instrument. Its approximate area is not a complete current operating inventory or proof of regional economic effects."},{"id":"alqueva-allocation","title":"Revised Alqueva water-management framework","publisher":"Government of Portugal","role":"Dated water-allocation and governance announcement","url":"https://portugal.gov.pt/pt/gc25/comunicacao/comunicados/governo-reforca-gestao-do-alqueva-para-garantir-agua-proteger-guadiana-e-responder-as-alteracoes-climaticas","publication_date":"2026-01-16","language":"Portuguese","interpretation_note":"Portuguese source interpreted into English by Codex under the owner-authorized AI policy; no independent language review claimed.","locator":"Annual maxima, hydrological conditions, urban reserve and reporting obligations","access_mode":"HTML body","inspection":"Relevant official HTML text inspected on 2026-11-22; linked legal instruments, files, images, live services and dynamic feeds were not inspected","boundary":"Announced maxima are not water actually delivered. Contract-revision proposals, weekly reporting and environmental monitoring commitments are not proof of completed implementation."},{"id":"alqueva-tariffs","title":"Contracted water and additional-volume pricing","publisher":"Government of Portugal","role":"Dated tariff-framework explanation","url":"https://portugal.gov.pt/pt/gc25/comunicacao/comunicados/governo-mantem-preco-da-agua-do-alqueva-e-garante-mais-agua-para-a-agricultura","publication_date":"2026-02-13","language":"Portuguese","interpretation_note":"Portuguese source interpreted into English by Codex under the owner-authorized AI policy; no independent language review claimed.","locator":"Contracted volumes, additional-use tiers and removal of introductory concession","access_mode":"HTML body","inspection":"Relevant official HTML text inspected on 2026-11-22; linked legal instruments, files, images, live services and dynamic feeds were not inspected","boundary":"Unchanged contracted-water price does not mean every use keeps the same charge. The announcement is not a customer bill, current quotation or inspection of the underlying tariff instrument."},{"id":"alqueva-solar","title":"Procurement for four pumping-station solar units","publisher":"Government of Portugal","role":"Dated procurement and energy-design announcement","url":"https://portugal.gov.pt/gc23/comunicacao/comunicados/45m-maior-projeto-fotovoltaico-flutuante-da-europa","publication_date":"2023-12-10","language":"Portuguese","interpretation_note":"Portuguese source interpreted into English by Codex under the owner-authorized AI policy; no independent language review claimed.","locator":"Four self-consumption units, planned 52 MWp and estimated annual production","access_mode":"HTML body","inspection":"Relevant official HTML text inspected on 2026-11-22; linked legal instruments, files, images, live services and dynamic feeds were not inspected","boundary":"The 52 MWp, 90 GWh/year and avoided-emission estimates describe the proposed group, not accepted capacity or measured output. Existing plants and other Alqueva solar projects must not be conflated."},{"id":"alqueva-expansion","title":"Vidigueira phase two and Álamos pumping investment","publisher":"Government of Portugal","role":"Dated expenditure-authorization and component-stage account","url":"https://portugal.gov.pt/gc23/comunicacao/comunicados/programa-nacional-de-regadios-autorizado-investimento-de-mais-de-137-m-no-circuito-hidraulico-da-vidigueira","publication_date":"2024-03-18","language":"Portuguese","interpretation_note":"Portuguese source interpreted into English by Codex under the owner-authorized AI policy; no independent language review claimed.","locator":"Second-phase Vidigueira investment, Álamos groups 3/4 and Cuba-Este operating status","access_mode":"HTML body","inspection":"Relevant official HTML text inspected on 2026-11-22; linked legal instruments, files, images, live services and dynamic feeds were not inspected","boundary":"Authorized spending and future pumping capacity are distinct from the explicitly operating Cuba-Este solar component. No subsequent handover of the proposed works is established."},{"id":"lisbon-identity","title":"Lisbon's parishes and delegated responsibilities","publisher":"Câmara Municipal de Lisboa","role":"Municipal identity and governance explanation","url":"https://www.lisboa.pt/municipio/freguesias","publication_date":null,"language":"Portuguese","interpretation_note":"Portuguese source interpreted into English by Codex under the owner-authorized AI policy; no independent language review claimed.","locator":"Twenty-four parishes and the 2012 administrative reorganization","access_mode":"HTML body","inspection":"Relevant official HTML text inspected on 2026-11-22; linked legal instruments, files, images, live services and dynamic feeds were not inspected","boundary":"The 2021–2025 delegation discussion is historical context, not evidence that those contracts remain unchanged. Parishes are parts of one municipality, not separately counted cities."},{"id":"lisbon-drainage-plan","title":"Lisbon drainage plan and chronology","publisher":"Câmara Municipal de Lisboa","role":"Municipal design explanation and retrospective chronology","url":"https://planodrenagem.lisboa.pt/sobre-o-plano","publication_date":null,"language":"Portuguese","interpretation_note":"Portuguese source interpreted into English by Codex under the owner-authorized AI policy; no independent language review claimed.","locator":"Basin transfers, first-flush treatment, reuse and labelled chronology dates","access_mode":"HTML body","inspection":"Relevant official HTML text inspected on 2026-11-22; linked legal instruments, files, images, live services and dynamic feeds were not inspected","boundary":"Chronology event headings differ from their content-entry timestamps. The July 2025 excavation milestone is not full-system commissioning; planned reuse and pollution-control benefits are not measured results.","excavation_event_period":"2025-07"},{"id":"lisbon-drainage-tunnels","title":"Drainage tunnels and estimated excavation date","publisher":"Câmara Municipal de Lisboa","role":"Municipal tunnel-design and schedule explanation","url":"https://planodrenagem.lisboa.pt/tuneis","publication_date":null,"language":"Portuguese","interpretation_note":"Portuguese source interpreted into English by Codex under the owner-authorized AI policy; no independent language review claimed.","locator":"Monsanto–Santa Apolónia and Chelas–Beato description and estimated dates","access_mode":"HTML body","inspection":"Relevant official HTML text inspected on 2026-11-22; linked legal instruments, files, images, live services and dynamic feeds were not inspected","boundary":"November 2026 is an estimate for Chelas–Beato excavation, not a completion receipt. The July 31, 2025 timestamp belongs to the estimate entry, not the whole page's publication date.","estimate_entry_date":"2025-07-31","estimated_excavation_end_period":"2026-11"},{"id":"lisbon-delegation","title":"Parish delegation and the later assembly approval","publisher":"Câmara Municipal de Lisboa","role":"Dated delegation announcement with explicit update","url":"https://www.lisboa.pt/cidade-informa/noticias/detalhe/lisboa-renova-delegacao-de-competencias-nas-freguesias-e-transfere-13-meur","publication_date":"2026-07-29","language":"Portuguese","interpretation_note":"Portuguese source interpreted into English by Codex under the owner-authorized AI policy; no independent language review claimed.","locator":"Three responsibility areas, pending works and September 8 update","access_mode":"HTML body","inspection":"Relevant official HTML text inspected on 2026-11-22; linked legal instruments, files, images, live services and dynamic feeds were not inspected","boundary":"The update records assembly approval of these contracts, not completion of works or approval of the separate September 9 proposals. Earlier monitoring and the extension horizon remain distinct.","updated_date":"2026-09-08","assembly_approval_date":"2026-09-08","monitoring_cutoff_period":"2025-11","extension_end_period":"2027"},{"id":"lisbon-maintenance-digital","title":"Street maintenance and digital renewal proposals","publisher":"Câmara Municipal de Lisboa","role":"Dated executive investment and cooperation account","url":"https://www.lisboa.pt/cidade-informa/noticias/detalhe/investimento-no-espaco-publico-e-modernizacao-digital-supera-21-meur","publication_date":"2026-09-09","language":"Portuguese","interpretation_note":"Portuguese source interpreted into English by Codex under the owner-authorized AI policy; no independent language review claimed.","locator":"Pedestrian surfaces, street furniture, parish cleaning and three-year digital programme","access_mode":"HTML body","inspection":"Relevant official HTML text inspected on 2026-11-22; linked legal instruments, files, images, live services and dynamic feeds were not inspected","boundary":"Executive approval is not delivered improvement. The separate parish cooperation contracts still require assembly approval in this account; the previous day's update cannot supply it."},{"id":"lisbon-climate-programmes","title":"Local climate and mobility programmes at Cidade do Zero","publisher":"Câmara Municipal de Lisboa","role":"Dated account of ongoing programmes and priorities","url":"https://www.lisboa.pt/cidade-informa/noticias/detalhe/cidade-do-zero-pensa-uma-cidade-verdadeiramente-sustentavel","publication_date":"2026-09-19","language":"Portuguese","interpretation_note":"Portuguese source interpreted into English by Codex under the owner-authorized AI policy; no independent language review claimed.","locator":"School shade, climate refuges, water reuse and monitoring platform","access_mode":"HTML body","inspection":"Relevant official HTML text inspected on 2026-11-22; linked legal instruments, files, images, live services and dynamic feeds were not inspected","boundary":"Programme descriptions and an announced monitoring platform are not measured cooling, avoided emissions or a tested service. No live heat alert or present-day refuge availability is asserted."},{"id":"porto-identity","title":"Porto's parishes","publisher":"Câmara Municipal do Porto","role":"Municipal identity description","url":"https://www.cm-porto.pt/municipio/freguesias","publication_date":null,"language":"Portuguese","interpretation_note":"Portuguese source interpreted into English by Codex under the owner-authorized AI policy; no independent language review claimed.","locator":"Seven parish-level units, including three unions after the 2013 reorganization","access_mode":"HTML body","inspection":"Relevant official HTML text inspected on 2026-11-22; linked legal instruments, files, images, live services and dynamic feeds were not inspected","boundary":"The municipality is not the wider metropolitan area or the northern region. Constituent and former parishes do not add place identities; contacts and opening hours are not tested."},{"id":"porto-water-performance","title":"Municipal utility climate account","publisher":"Porto Climate Pact / Águas e Energia do Porto","role":"Dated municipal account of utility-reported indicators","url":"https://pactoparaoclima.porto.pt/aguas-e-energia-do-porto-reconhecida-a-nivel-internacional-pela-resposta-aos-desafios-climaticos/","publication_date":"2026-10-27","language":"Portuguese","interpretation_note":"Portuguese source interpreted into English by Codex under the owner-authorized AI policy; no independent language review claimed.","locator":"2016/2025 non-revenue water, company energy and Freixo reuse scope","access_mode":"HTML body","inspection":"Relevant official HTML text inspected on 2026-11-22; linked legal instruments, files, images, live services and dynamic feeds were not inspected","boundary":"Utility-reported figures and an award do not provide a complete independently inspected operating series. Company renewable-energy share is not city-wide generation, and up to 1,000 m³/day is not observed daily reuse.","recognition_event_date":"2026-10-08","comparison_start_period":"2016","reporting_period":"2025"},{"id":"porto-asprela","title":"Ribeira da Asprela restoration","publisher":"Porto municipal Nature Based Solutions platform / Águas e Energia do Porto","role":"Municipal phased-intervention account","url":"https://naturebasedsolutions.porto.pt/nbs/ribeira-da-asprela/","publication_date":null,"language":"Portuguese","interpretation_note":"Portuguese source interpreted into English by Codex under the owner-authorized AI policy; no independent language review claimed.","locator":"2009/2015/2022 phases, retention basins and results panel","access_mode":"HTML body","inspection":"Relevant official HTML text inspected on 2026-11-22; linked legal instruments, files, images, live services and dynamic feeds were not inspected","boundary":"Intervention years are not publication dates. Retention capacity is not a measured series of avoided floods; displayed cost subtotals are not reconciled into a new total.","latest_intervention_period":"2022"},{"id":"porto-rain-garden","title":"Rua Santos Pousada rain gardens","publisher":"Porto municipal Nature Based Solutions platform / Águas e Energia do Porto","role":"Municipal installed-drainage description","url":"https://naturebasedsolutions.porto.pt/nbs/jardins-de-chuva-da-rua-santos-pousada/","publication_date":null,"language":"Portuguese","interpretation_note":"Portuguese source interpreted into English by Codex under the owner-authorized AI policy; no independent language review claimed.","locator":"2025 street intervention, runoff collection and controlled drainage","access_mode":"HTML body","inspection":"Relevant official HTML text inspected on 2026-11-22; linked legal instruments, files, images, live services and dynamic feeds were not inspected","boundary":"The installed feature and stated mechanism do not prove prevention of every flood or a measured city-wide reduction. The results panel refers to regulatory design events.","intervention_period":"2025"},{"id":"porto-energy-hub","title":"Porto Energy Hub","publisher":"AdEPorto — Porto Energy Agency","role":"Project coordinator's service and geographical description","url":"https://adeporto.eu/pt/projetos/porto-energy-hub/","publication_date":null,"language":"Portuguese","interpretation_note":"Portuguese source interpreted into English by Codex under the owner-authorized AI policy; no independent language review claimed.","locator":"Northern-region reach, integrated advice and intended users","access_mode":"HTML body","inspection":"Relevant official HTML text inspected on 2026-11-22; linked legal instruments, files, images, live services and dynamic feeds were not inspected","boundary":"The service description is not a completed retrofit, verified household saving or grant guarantee. Regional reach does not enlarge the counted Porto municipality; no appointment or application was made."}],'Exact source identity, language, access scope and dates must remain intact');
  assert.equal(review.sources_sha256,portugalWaterCitiesHash(data.sources));assert.equal(review.edition_sha256,portugalWaterCitiesHash(data));
}
export const portugalWaterCitiesCriticalPhrases=[
  [
    0,
    0,
    "not a new city boundary"
  ],
  [
    0,
    0,
    "does not certify the condition of every asset"
  ],
  [
    0,
    1,
    "announced ceilings, not volumes actually delivered"
  ],
  [
    0,
    1,
    "subject to hydrological conditions"
  ],
  [
    0,
    2,
    "not a promise that every user’s total bill stays unchanged"
  ],
  [
    0,
    2,
    "removes the introductory reduced tariff"
  ],
  [
    0,
    3,
    "not accepted capacity or measured generation"
  ],
  [
    0,
    3,
    "must not be combined into this four-unit delivery claim"
  ],
  [
    0,
    4,
    "does not establish that the newly funded works are complete"
  ],
  [
    1,
    0,
    "historical context"
  ],
  [
    1,
    1,
    "not full-system commissioning"
  ],
  [
    1,
    1,
    "not a completion receipt"
  ],
  [
    1,
    2,
    "September 8 update explicitly records assembly approval"
  ],
  [
    1,
    2,
    "rather than prove that the backlog disappeared"
  ],
  [
    1,
    3,
    "previous day’s approval concerned different contracts"
  ],
  [
    1,
    3,
    "not already verified improvements"
  ],
  [
    1,
    4,
    "not a tested service or a measured reduction"
  ],
  [
    2,
    0,
    "service geography rather than a change to the city boundary"
  ],
  [
    2,
    1,
    "not city-wide renewable generation"
  ],
  [
    2,
    1,
    "not a measured daily delivery series"
  ],
  [
    2,
    2,
    "not a measured history of floods avoided"
  ],
  [
    2,
    3,
    "not proof that every extreme storm is contained"
  ],
  [
    2,
    4,
    "not itself a completed retrofit"
  ],
  [
    2,
    4,
    "regional programme’s reach separate"
  ]
];
