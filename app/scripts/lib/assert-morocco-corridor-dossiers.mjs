import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
export const moroccoCorridorHash=value=>createHash('sha256').update(JSON.stringify(value)).digest('hex');
export function assertMoroccoCorridorDossiers(data,review){
  assert.equal(data.inspected_date,'2026-11-22');assert.equal(data.timezone,'America/Edmonton');
  assert.equal(data.review_policy,'OWNER-AUTHORIZED-AI-REVIEW-2026-09-25');
  assert.equal(review.policy_id,data.review_policy);assert.equal(review.review_date,data.inspected_date);
  assert.equal(data.independent_review,false);assert.equal(data.phase_60_identity_added,false);
  for(const key of ['independent_review','publication_authorized','launch_authorized','phase_216_complete'])assert.equal(review[key],false);
  assert.deepEqual(data.records.map(r=>r.record_id),["project-al-boraq-tangier-kenitra","place-tangier","place-casablanca"]);
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
    assert.equal(review.records.find(d=>d.record_id===r.record_id)?.sha256,moroccoCorridorHash(r),'Article changed after exact-version review');
  }
  assert.deepEqual(data.records.map(r=>r.scope),["The initial Tangier–Kénitra high-speed railway and its Al Boraq through-service interface to Rabat and Casablanca, counted as one project. Excludes the later Kénitra–Marrakech extension and its fleet order. Stations and trainsets are components, not additional identities.","Commune de Tanger, counted as one place across Tanger-Médina, Bni Makada, Souani and Mghogha. Excludes Tangier-Assilah prefecture, the Tanger-Tétouan-Al Hoceïma region and the wider Tanger Med port system. Arrondissements are components of the commune.","Commune de Casablanca, counted as one place with sixteen arrondissements. Excludes the wider Casablanca-Settat region and metropolitan transport or utility catchments. Arrondissements, companies and individual transport lines are not additional place identities."],'Exact scope boundary changed');
  assert.deepEqual(data.records.map(r=>r.stage),["November 2018 inauguration and subsequent passenger operation documented. Later expansion orders and construction plans remain separate from accepted capacity and recurring reliability.","Historical municipal identity and dated terminal, parking and public-space accounts inspected. Announced rules and works are not current compliance or city-wide outcome acceptance.","Dated council, operating-transport, service-transition and climate-preparation accounts inspected. Planned results and equipment do not establish completed implementation or a city-wide outcome."],'Exact stage boundary changed');
  assert.deepEqual(data.records.map(r=>r.route),["/atlas/projects/al-boraq-tangier-kenitra/","/atlas/places/tangier/","/atlas/places/casablanca/"],'Exact route boundary changed');
  assert.deepEqual(data.records.map(r=>r.aliases),[["Al Boraq","Al-Boraq","Tanger–Kénitra LGV","Tangier Kenitra high-speed railway","Ligne à grande vitesse Tanger Kénitra"],["Tanger","Commune de Tanger","Tangier Commune","طنجة"],["Commune de Casablanca","Casablanca Commune","الدار البيضاء"]],'Exact aliases boundary changed');
  assert.deepEqual(data.records.map(r=>r.timeline),[[{"date":"2018-11-15","event":"Supplier dates the inauguration; this is not assigned as the exact commercial-service start.","source_ids":["al-boraq-inauguration"]},{"date":"2025-03-28","event":"Supplier announces the eighteen-train Horizon order for later expansion.","source_ids":["al-boraq-horizon-order"]},{"date":"2025-04-25","event":"Government page publishes an operating-service retrospective and future capacity plans; its MAP dispatch is April 24.","source_ids":["al-boraq-network-plan"]},{"date":"2025-09-02","event":"ONCF's announced Casablanca works and staged service arrangements are relayed by the government portal.","source_ids":["al-boraq-casablanca-works"]}],[{"date":"2002","event":"Municipal historical page places the unified-city commune's establishment in this year, without an exact day.","source_ids":["tangier-identity"]},{"date":"2019-11-01","event":"Coach-terminal account retrospectively dates the opening at Hararine.","source_ids":["tangier-coach-terminal"]},{"date":"2022-12-27","event":"Municipality publishes terminal use through December 26, not a full-year total.","source_ids":["tangier-coach-terminal"]},{"date":"2023-06-12","event":"Municipality reports the start of Rahrah-site works with a six-month expectation.","source_ids":["tangier-rahrah"]},{"date":"2025-07-04","event":"Parking notice announces a July 9 start for the delegated paid-parking areas.","source_ids":["tangier-parking"]},{"date":"2025-07-09","event":"Announced effective date for the parking provisions, not an observed compliance finding.","source_ids":["tangier-parking"]}],[{"date":"2021-11-03","event":"Council account records an allocation to the commune's sixteen arrondissements.","source_ids":["casablanca-arrondissements"]},{"date":"2024-02-19","event":"Casa Transport announces integrated tests for T3 and T4.","source_ids":["casablanca-tram-tests"]},{"date":"2024-10-10","event":"Operator confirms T3/T4 are in service; publication is not assigned as their exact opening day.","source_ids":["casablanca-tram-operation"]},{"date":"2026-07-03","event":"Climate-plan preparation launched, according to the later municipal article.","source_ids":["casablanca-climate-plan"]},{"date":"2026-07-04","event":"Municipality acknowledges uneven service during the cleanliness-contract transition.","source_ids":["casablanca-cleanliness"]},{"date":"2026-07-20","event":"Municipality publishes climate-planning progress and a prospective September results window.","source_ids":["casablanca-climate-plan"]}]],'Exact timeline boundary changed');
  assert.deepEqual(data.records.map(r=>r.sections.map(s=>s.source_ids)),[[["al-boraq-afd"],["al-boraq-inauguration"],["al-boraq-network-plan"],["al-boraq-horizon-order"],["al-boraq-casablanca-works"],[]],[["tangier-identity"],["tangier-functions"],["tangier-coach-terminal"],["tangier-parking"],["tangier-rahrah"],[]],[["casablanca-arrondissements"],["casablanca-companies"],["casablanca-tram-tests","casablanca-tram-operation"],["casablanca-cleanliness"],["casablanca-climate-plan"],[]]],'Claim-to-source bindings changed');
  for(const r of data.records)assert(!Object.hasOwn(r,'historical_acquisition'),'New Morocco identity must not reuse a historical country docket');
  for(const [ri,si,phrase] of moroccoCorridorCriticalPhrases)assert(data.records[ri].sections[si].text.includes(phrase),'Missing bounded claim: '+phrase);
  assert.deepEqual(data.sources,[{"id":"al-boraq-afd","title":"La LGV entre Tanger et Kénitra","publisher":"Agence française de développement","role":"Funder project record","url":"https://www.afd.fr/fr/projets/la-ligne-ferroviaire-grande-vitesse-lgv-entre-tanger-et-kenitra","publication_date":null,"language":"French","interpretation_note":"French source interpreted into English by Codex under the owner-authorized AI policy; no independent language review claimed.","locator":"Route, conventional-network connection and reported 2025 traffic","access_mode":"HTML body","inspection":"Relevant official HTML text inspected on 2026-11-22; linked files, images, live services and dynamic feeds were not inspected","boundary":"Financier dates and En cours status are not the railway opening state. Whole-network traffic is not Al Boraq traffic; length descriptions differ from the supplier's first-section account.","reporting_period":"2025"},{"id":"al-boraq-inauguration","title":"Tangier–Casablanca high-speed line inauguration","publisher":"Alstom","role":"Supplier inauguration and equipment account","url":"https://www.alstom.com/press-releases-news/2018/11/alstom-heart-tangier-casablanca-high-speed-lines-inauguration-morocco","publication_date":"2018-11-15","language":"English","interpretation_note":"English source assessed by Codex under the owner-authorized AI policy; no independent review claimed.","locator":"Inauguration, twelve trainsets, signalling and accessibility paragraphs","access_mode":"HTML body","inspection":"Relevant official HTML text inspected on 2026-11-22; linked files, images, live services and dynamic feeds were not inspected","boundary":"Inauguration is not an exact commercial-service start date. Supplier equipment claims do not establish independent acceptance or recurring reliability.","event_date":"2018-11-15"},{"id":"al-boraq-network-plan","title":"Al Boraq and the developing rail network","publisher":"Morocco national portal / MAP","role":"Government account of operating service and future network plans","url":"https://maroc.ma/en/news/al-boraq-first-high-speed-train-africa-symbol-performance-sustainable-commitment","publication_date":"2025-04-25","language":"English","interpretation_note":"English source assessed by Codex under the owner-authorized AI policy; no independent review claimed.","locator":"November 2018 launch and proposed redistribution of network capacity","access_mode":"HTML body","inspection":"Relevant official HTML text inspected on 2026-11-22; linked files, images, live services and dynamic feeds were not inspected","boundary":"The MAP dispatch is April 24 and page publication April 25. Future capacity release and broad economic/environmental claims are not measured local outcomes. The 2024 ridership figure is not used to construct a reconciled series.","dispatch_date":"2025-04-24"},{"id":"al-boraq-horizon-order","title":"Eighteen Avelia Horizon trains ordered","publisher":"Alstom","role":"Supplier contract announcement","url":"https://www.alstom.com/press-releases-news/2025/3/alstom-will-supply-18-avelia-horizon-trains-moroccos-high-speed-rail-expansion","publication_date":"2025-03-28","language":"English","interpretation_note":"English source assessed by Codex under the owner-authorized AI policy; no independent review claimed.","locator":"Contract, French Treasury financing and future Marrakech service paragraphs","access_mode":"HTML body","inspection":"Relevant official HTML text inspected on 2026-11-22; linked files, images, live services and dynamic feeds were not inspected","boundary":"The order and supplier performance projections do not establish delivery, acceptance or realized savings. It belongs to later expansion, not delivered capacity within the original corridor."},{"id":"al-boraq-casablanca-works","title":"Kénitra–Marrakech works at Casablanca","publisher":"Morocco national portal / ONCF statement via MAP","role":"Dated construction and service-management announcement","url":"https://maroc.ma/fr/actualites/projet-de-la-lgv-kenitra-marrakech-loncf-entame-de-grands-travaux-dinfrastructure-casablanca","publication_date":"2025-09-02","language":"French","interpretation_note":"French source interpreted into English by Codex under the owner-authorized AI policy; no independent language review claimed.","locator":"Mohammedia–Nouaceur works, staged service plans and passenger assistance","access_mode":"HTML body","inspection":"Relevant official HTML text inspected on 2026-11-22; linked files, images, live services and dynamic feeds were not inspected","boundary":"The September 2025–end 2027 construction window and service arrangements are announced plans, not completion or observed continuity. Later extension works do not enlarge the original counted project.","scheduled_start_period":"2025-09","scheduled_end_period":"2027","assistance_start_date":"2025-09-08","first_phase_date":"2025-09-15"},{"id":"tangier-identity","title":"Tangier Commune historical identity page","publisher":"Commune de Tanger","role":"Municipal identity description","url":"https://fr.tanger.ma/tangier-town/","publication_date":null,"language":"Arabic","interpretation_note":"Arabic source interpreted into English by Codex under the owner-authorized AI policy; no independent language review claimed.","locator":"Opening historical identity and four-arrondissement paragraphs","access_mode":"HTML body","inspection":"Relevant official HTML text inspected on 2026-11-22; linked files, images, live services and dynamic feeds were not inspected","boundary":"The page is labelled old and its substantive body is Arabic despite the French subdomain. The cited prefecture population is not a commune count; officeholders are not treated as current."},{"id":"tangier-functions","title":"Fonctions de la commune","publisher":"Commune de Tanger","role":"Municipal explanation of responsibilities","url":"https://fr.tanger.ma/community-functions/","publication_date":null,"language":"French","interpretation_note":"French source interpreted into English by Codex under the owner-authorized AI policy; no independent language review claimed.","locator":"Own, shared and transferred responsibilities and action programme","access_mode":"HTML body","inspection":"Relevant official HTML text inspected on 2026-11-22; linked files, images, live services and dynamic feeds were not inspected","boundary":"This explanatory HTML page is not inspection of the underlying organic-law instrument. Listed responsibilities and planning requirements do not establish delivered service."},{"id":"tangier-coach-terminal","title":"Coach terminal use through December 26, 2022","publisher":"Commune de Tanger","role":"Dated terminal opening and traffic account","url":"https://tanger.ma/news/%D8%A7%D9%84%D8%B1%D9%82%D9%85-%D8%A7%D9%84%D8%A3%D9%81%D8%B6%D9%84-%D9%85%D9%86%D8%B0-%D8%A7%D9%81%D8%AA%D8%AA%D8%A7%D8%AD%D9%87%D8%A7-%D9%82%D8%A8%D9%84-3-%D8%B3%D9%86%D9%88%D8%A7%D8%AA-%D8%A7/","publication_date":"2022-12-27","language":"Arabic","interpretation_note":"Arabic source interpreted into English by Codex under the owner-authorized AI policy; no independent language review claimed.","locator":"Hararine location, November 2019 opening and 2022 cutoff","access_mode":"HTML body","inspection":"Relevant official HTML text inspected on 2026-11-22; linked files, images, live services and dynamic feeds were not inspected","boundary":"The 2022 count stops December 26. Opening-period and pandemic-year totals are not a comparable annual series or proof of reduced congestion.","opening_date":"2019-11-01","reporting_start_date":"2022-01-01","reporting_cutoff_date":"2022-12-26"},{"id":"tangier-parking","title":"Announcement of the parking decision rollout","publisher":"Commune de Tanger","role":"Dated parking implementation notice","url":"https://tanger.ma/news/%D8%AC%D9%85%D8%A7%D8%B9%D8%A9-%D8%B7%D9%86%D8%AC%D8%A9-%D8%AA%D8%B9%D9%84%D9%86-%D8%A7%D9%84%D8%B4%D8%B1%D9%88%D8%B9-%D9%81%D9%8A-%D8%AA%D8%B7%D8%A8%D9%8A%D9%82-%D8%A7%D9%84%D9%82%D8%B1%D8%A7%D8%B1/","publication_date":"2025-07-04","language":"Arabic","interpretation_note":"Arabic source interpreted into English by Codex under the owner-authorized AI policy; no independent language review claimed.","locator":"July 9 start, delegated paid-parking scope and accessibility provisions","access_mode":"HTML body","inspection":"Relevant official HTML text inspected on 2026-11-22; linked files, images, live services and dynamic feeds were not inspected","boundary":"The notice concerns delegated paid-parking areas, not every space in the city. It is not the underlying decision, observed compliance or a current tariff check.","effective_date":"2025-07-09"},{"id":"tangier-rahrah","title":"Réhabilitation du lac Rahrah","publisher":"Commune de Tanger","role":"Municipal works-launch account","url":"https://fr.tanger.ma/news/rehabilitation-du-lac-rahrah-toutes-les-etudes-et-les-conceptions-du-projet-ont-ete-realisees-par-la-commune/","publication_date":"2023-06-12","language":"French","interpretation_note":"French source interpreted into English by Codex under the owner-authorized AI policy; no independent language review claimed.","locator":"Works launch, municipal design and six-month expectation","access_mode":"HTML body","inspection":"Relevant official HTML text inspected on 2026-11-22; linked files, images, live services and dynamic feeds were not inspected","boundary":"The account reports work starting around the site. Its six-month expectation is not a completion receipt or a measured ecological improvement.","event_date":"2023-06-12"},{"id":"casablanca-arrondissements","title":"Allocation to Casablanca's sixteen arrondissements","publisher":"Commune de Casablanca","role":"Dated council allocation account","url":"https://www.casablancacity.ma/fr/actualite/1074/le-conseil-de-la-commune-de-casablanca-approuve-la-dotation-financiere-accordee-aux-arrondissements","publication_date":"2021-11-03","language":"French","interpretation_note":"French source interpreted into English by Codex under the owner-authorized AI policy; no independent language review claimed.","locator":"Council decision and sixteen-arrondissement scope","access_mode":"HTML body","inspection":"Relevant official HTML text inspected on 2026-11-22; linked files, images, live services and dynamic feeds were not inspected","boundary":"The allocation decision is not actual expenditure or a current budget. Arrondissements are components of one commune; the surrounding region is not the counted place.","event_date":"2021-11-03"},{"id":"casablanca-companies","title":"Sociétés de développement local","publisher":"Commune de Casablanca","role":"Municipal service-responsibility explanation","url":"https://www.casablancacity.ma/fr/article/243/societes-de-developpement-local","publication_date":null,"language":"French","interpretation_note":"French source interpreted into English by Codex under the owner-authorized AI policy; no independent language review claimed.","locator":"Casa Transport, Casa Aménagement and Casa Baïa roles","access_mode":"HTML body","inspection":"Relevant official HTML text inspected on 2026-11-22; linked files, images, live services and dynamic feeds were not inspected","boundary":"An undated role description is not a performance audit. The inconsistent overall company count and current officeholder claims are not used."},{"id":"casablanca-tram-tests","title":"Essais d'ensemble des lignes T3 et T4","publisher":"Commune de Casablanca / Casa Transport","role":"Dated system-test announcement","url":"https://www.casablancacity.ma/fr/actualite/1701/communique-de-presse-demarrage-des-essais-densemble-des-lignes-t3-et-t4-du-tramway-de-casablanca","publication_date":"2024-02-19","language":"French","interpretation_note":"French source interpreted into English by Codex under the owner-authorized AI policy; no independent language review claimed.","locator":"Integrated tests, compatibility with T1/T2 and recovery from disruption","access_mode":"HTML body","inspection":"Relevant official HTML text inspected on 2026-11-22; linked files, images, live services and dynamic feeds were not inspected","boundary":"Test objectives are not acceptance results. The later operator account supplies operating-stage evidence separately.","event_date":"2024-02-19"},{"id":"casablanca-tram-operation","title":"Mise en service des lignes T3 et T4","publisher":"RATP Dev","role":"Operator service-introduction account","url":"https://www.ratpdev.com/fr/lancement-reussi-des-deux-nouvelles-lignes-de-tramway-t3-et-t4-par-ratp-dev-a-casablanca/","publication_date":"2024-10-10","language":"French","interpretation_note":"French source interpreted into English by Codex under the owner-authorized AI policy; no independent language review claimed.","locator":"Operating introduction, interchanges and forecast 2025 use","access_mode":"HTML body","inspection":"Relevant official HTML text inspected on 2026-11-22; linked files, images, live services and dynamic feeds were not inspected","boundary":"Publication is not an exact opening day. The 2025 use estimate remains a forecast. Conflicting combined and line-specific lengths are not reconciled into an asserted network total.","forecast_period":"2025"},{"id":"casablanca-cleanliness","title":"New cleanliness contracts and the service transition","publisher":"Commune de Casablanca","role":"Dated service-shortfall and transition account","url":"https://www.casablancacity.ma/fr/actualite/2051/deploiement-des-nouveaux-contrats-de-gestion-deleguee-de-la-proprete-une-transition-en-cours","publication_date":"2026-07-04","language":"French","interpretation_note":"French source interpreted into English by Codex under the owner-authorized AI policy; no independent language review claimed.","locator":"Acknowledged service gaps, daily follow-up and planned equipment","access_mode":"HTML body","inspection":"Relevant official HTML text inspected on 2026-11-22; linked files, images, live services and dynamic feeds were not inspected","boundary":"The July account acknowledges uneven service. Planned equipment and monitoring do not establish that the transition subsequently met its standards."},{"id":"casablanca-climate-plan","title":"Élaboration du Plan Climat Casablanca","publisher":"Commune de Casablanca","role":"Dated planning-process launch account","url":"https://www.casablancacity.ma/fr/actualite/2058/la-commune-de-casablanca-lance-lelaboration-du-plan-climat-casablanca-avec-lappui-de-la-banque-mondiale","publication_date":"2026-07-20","language":"French","interpretation_note":"French source interpreted into English by Codex under the owner-authorized AI policy; no independent language review claimed.","locator":"July 3 launch, diagnostics and prospective intermediate results","access_mode":"HTML body","inspection":"Relevant official HTML text inspected on 2026-11-22; linked files, images, live services and dynamic feeds were not inspected","boundary":"The article launches preparation, not an adopted climate strategy. The September result forecast is not a retrieved deliverable or proof of nonpublication.","event_date":"2026-07-03","expected_results_period":"2026-09"}],'Exact source identity, language, access scope and dates must remain intact');
  assert.equal(review.sources_sha256,moroccoCorridorHash(data.sources));assert.equal(review.edition_sha256,moroccoCorridorHash(data));
}
export const moroccoCorridorCriticalPhrases=[
  [
    0,
    0,
    "different denominator"
  ],
  [
    0,
    0,
    "not a measure of punctuality"
  ],
  [
    0,
    1,
    "distinct from an exact public commercial-service start"
  ],
  [
    0,
    1,
    "not a recurring record of accessible journeys"
  ],
  [
    0,
    2,
    "intended to release existing tracks"
  ],
  [
    0,
    2,
    "not treated as measured effects"
  ],
  [
    0,
    3,
    "outside the original counted corridor"
  ],
  [
    0,
    3,
    "rather than an increase already available"
  ],
  [
    0,
    4,
    "not observed continuity or completed works"
  ],
  [
    1,
    0,
    "refers to Tangier-Assilah prefecture"
  ],
  [
    1,
    0,
    "labelled old"
  ],
  [
    1,
    1,
    "not a performance audit"
  ],
  [
    1,
    2,
    "through December 26, not the entire calendar year"
  ],
  [
    1,
    2,
    "intended to ease central bus congestion"
  ],
  [
    1,
    3,
    "within paid-parking areas under delegated management"
  ],
  [
    1,
    3,
    "rather than observed compliance or a current tariff"
  ],
  [
    1,
    4,
    "an expectation, not evidence"
  ],
  [
    2,
    0,
    "not sixteen separate place dossiers"
  ],
  [
    2,
    0,
    "does not show what was subsequently spent"
  ],
  [
    2,
    1,
    "not interchangeable measures"
  ],
  [
    2,
    2,
    "remains a forecast"
  ],
  [
    2,
    2,
    "two records show different stages"
  ],
  [
    2,
    3,
    "does not establish that the shortfalls were resolved"
  ],
  [
    2,
    4,
    "preparation, not adoption"
  ],
  [
    2,
    4,
    "neither a retrieved deliverable nor proof"
  ]
];
