import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
export const italyRailLagoonHash=value=>createHash('sha256').update(JSON.stringify(value)).digest('hex');
export function assertItalyRailLagoonDossiers(data,review){
  assert.equal(data.inspected_date,'2026-11-22');assert.equal(data.timezone,'America/Edmonton');
  assert.equal(data.review_policy,'OWNER-AUTHORIZED-AI-REVIEW-2026-09-25');
  assert.equal(review.policy_id,data.review_policy);assert.equal(review.review_date,data.inspected_date);
  assert.equal(data.independent_review,false);assert.equal(data.phase_60_identity_added,false);
  for(const key of ['independent_review','publication_authorized','launch_authorized','phase_216_complete'])assert.equal(review[key],false);
  assert.deepEqual(data.records.map(r=>r.record_id),["project-mose","project-milan-m4","place-venice"]);
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
    assert(r.sections.map(s=>s.text).join(' ').split(/\s+/).length>=500);
    for(const s of r.sections){assert(s.heading&&s.text.length>200);assert(s.source_ids.every(id=>ids.has(id)));if(!s.source_ids.length)assert.equal(s.claim_type,'Editorial evidence test');}
    assert(r.timeline.length>=3);let previous='';
    for(const item of r.timeline){validPeriod(item.date);assert(item.date<=data.inspected_date&&item.date>=previous);previous=item.date;assert(item.event&&item.source_ids.length&&item.source_ids.every(id=>ids.has(id)));}
    assert(r.next_artifacts.length>=3);assert(r.related.every(link=>/^\/atlas\/[a-z0-9/-]+\/$/.test(link.route)));
    assert.equal(review.records.find(d=>d.record_id===r.record_id)?.sha256,italyRailLagoonHash(r),'Article changed after exact-version review');
  }
  assert.deepEqual(data.records.map(r=>r.scope),["One MOSE system comprising four barriers at the Lido, Malamocco and Chioggia inlets. Its 78 installed gates and reserve components are not separate projects. Local flood defences, the wider lagoon-restoration programme and Venice municipality remain distinct identities and evidence scopes.","One Milan M4 railway between Linate Aeroporto and San Cristoforo, including its station-access interfaces. Other metro lines, ATM's wider operating territory and extensions beyond these termini are excluded from the counted identity. Individual stations and bridges are not additional projects.","One Comune di Venezia across six municipalità, including the historic city, islands and mainland districts. Excludes the wider metropolitan city and the entire lagoon as a territorial identity. Its districts, waste-service areas and local infrastructure schemes are not additional counted places."],'Exact scope boundary changed');
  assert.deepEqual(data.records.map(r=>r.stage),["Physical system descriptions, a dated funding allocation, institutional responsibilities and official operating entries inspected. Recorded closures are not blanket final completion, verified avoided-damage estimates or admission of a comparable outcome series.","ATM's 2024 retrospective records full-line operation. Later concessionaire notices describe financing, a built pedestrian/cycle connection and heritage programming; they are not a complete reliability, accessibility-availability or realized-benefit series.","Municipal identity and service descriptions inspected, with a September waste-share display and dated fire-water and bus decisions. Existing operations, approvals, proposed additions and local service limitations remain distinct; no composite place score or city-wide outcome admission."],'Exact stage boundary changed');
  assert.deepEqual(data.records.map(r=>r.route),["/atlas/projects/mose/","/atlas/projects/milan-m4/","/atlas/places/venice/"],'Exact route boundary changed');
  assert.deepEqual(data.records.map(r=>r.aliases),[["MOSE Venezia","Modulo Sperimentale Elettromeccanico","Venice flood barriers","Sistema MOSE"],["Milano M4","Linea Blu Milano","Linea 4 Milano","San Cristoforo–Linate metro"],["Venezia","Comune di Venezia","Venice municipality","Venezia municipality"]],'Exact aliases boundary changed');
  assert.deepEqual(data.records.map(r=>r.timeline),[[{"date":"2020-10","event":"Municipal measurement account starts its sea/lagoon extrema record from MOSE operation.","source_ids":["mose-measurement"]},{"date":"2024-09-30","event":"Allocation act distinguishes completion resources from management and extraordinary maintenance; publication follows October 28.","source_ids":["mose-financing"]},{"date":"2026-02-13","event":"Ministry announces full operation of the lagoon authority, including MOSE management responsibilities.","source_ids":["mose-authority"]},{"date":"2026-11-22","event":"Authority records a morning closure and separately schedules an evening lift.","source_ids":["mose-operations"]}],[{"date":"2024-10","event":"ATM's annual summary records full-line operation between Linate and San Cristoforo.","source_ids":["m4-operation"]},{"date":"2024-12-02","event":"Concessionaire announces a signed refinancing facility with a maximum €398 million amount.","source_ids":["m4-financing"]},{"date":"2026-09-07","event":"M4 announces a public programme connecting construction research, talks and site visits.","source_ids":["m4-heritage"]},{"date":"2026-10-08","event":"Concessionaire describes the built San Cristoforo connection and advertises an October 14 visit.","source_ids":["m4-bridge"]}],[{"date":"2026-09","event":"Veritas displays separate September collection shares for the centre/islands service area and whole municipality.","source_ids":["venice-waste"]},{"date":"2026-09-21","event":"Municipal walkway page is updated while retaining its older map label and seasonal operating description.","source_ids":["venice-walkways"]},{"date":"2026-10-29","event":"Executive approves Castello fire-water feasibility design, enabling the next design stage.","source_ids":["venice-fire-water"]},{"date":"2026-11-07","event":"City reports the five-methane-bus funding decision and distinguishes island operation from the mainland programme.","source_ids":["venice-buses"]}]],'Exact timeline boundary changed');
  assert.deepEqual(data.records.map(r=>r.sections.map(s=>s.source_ids)),[[["mose-design"],["mose-gates"],["mose-financing","mose-authority"],["mose-operations"],["mose-measurement"],[]],[["m4-operation"],["m4-access"],["m4-financing"],["m4-bridge"],["m4-heritage"],[]],[["venice-identity"],["venice-walkways"],["venice-waste"],["venice-fire-water"],["venice-buses"],[]]],'Claim-to-source bindings changed');
  for(const r of data.records)assert(!Object.hasOwn(r,'historical_acquisition'),'New Italian identity must not reuse a historical country docket');
  for(const [ri,si,phrase] of italyRailLagoonCriticalPhrases)assert(data.records[ri].sections[si].text.includes(phrase),'Missing bounded claim: '+phrase);
  assert.deepEqual(data.sources,[{"id":"mose-design","title":"MOSE system configuration","publisher":"Consorzio Venezia Nuova","role":"Project concessionaire's engineering description","url":"https://mosevenezia.eu/progetto/","publication_date":null,"language":"Italian","interpretation_note":"Italian source interpreted into English by Codex under the owner-authorized AI policy; no independent language review claimed.","locator":"Localizzazione, Configurazione and Funzionamento","access_mode":"HTML body","inspection":"Relevant official HTML text inspected on 2026-11-22; linked files, maps, images, underlying instruments and live services were not tested","boundary":"Four barriers at three inlets form one project. Design objectives and navigation-lock descriptions are not a blanket operating or ecological performance guarantee."},{"id":"mose-gates","title":"The movable gates","publisher":"Consorzio Venezia Nuova","role":"Component and maintenance-relevant engineering description","url":"https://mosevenezia.eu/paratoie/","publication_date":null,"language":"Italian","interpretation_note":"Italian source interpreted into English by Codex under the owner-authorized AI policy; no independent language review claimed.","locator":"Come funzionano and 78 installed gates plus eight reserves","access_mode":"HTML body","inspection":"Relevant official HTML text inspected on 2026-11-22; linked files, maps, images, underlying instruments and live services were not tested","boundary":"Installed and reserve gates are different inventories. Corrosion protection and instrumentation describe engineering provisions, not current condition of every component."},{"id":"mose-financing","title":"MOSE completion and extraordinary-maintenance allocation","publisher":"Italian Ministry of Infrastructure and Transport","role":"Published administrative allocation record","url":"https://trasparenza.mit.gov.it/archivio38_sovvenzioni-e-vantaggi-economici_0_115741_48_1.html","publication_date":"2024-10-28","language":"Italian","interpretation_note":"Italian source interpreted into English by Codex under the owner-authorized AI policy; no independent language review claimed.","locator":"Act 39444, September 30, 2024; chapter 7200 plans 06 and 07","access_mode":"HTML body","inspection":"Relevant official HTML text inspected on 2026-11-22; linked files, maps, images, underlying instruments and live services were not tested","boundary":"The allocation record separates completion funds from management and extraordinary maintenance. It is not actual expenditure or inspection of the attached decree.","act_date":"2024-09-30","financial_period":"2024"},{"id":"mose-authority","title":"Lagoon authority becomes fully operational","publisher":"Italian Ministry of Infrastructure and Transport","role":"Dated institutional responsibility announcement","url":"https://mit.gov.it/comunicazione/news/venezia-salvini-firma-il-decreto","publication_date":"2026-02-13","language":"Italian","interpretation_note":"Italian source interpreted into English by Codex under the owner-authorized AI policy; no independent language review claimed.","locator":"Authority constitution and MOSE management and maintenance functions","access_mode":"HTML body","inspection":"Relevant official HTML text inspected on 2026-11-22; linked files, maps, images, underlying instruments and live services were not tested","boundary":"The institution's operational status is not final completion or certification of the barrier system. The underlying decree was not inspected."},{"id":"mose-operations","title":"MOSE operating log","publisher":"Autorità per la Laguna di Venezia","role":"Authority's dated operating entries and duration definition","url":"https://www.autoritalaguna.it/operativita-m-o-s-e/","publication_date":null,"language":"Italian","interpretation_note":"Italian source interpreted into English by Codex under the owner-authorized AI policy; no independent language review claimed.","locator":"Current-event/status rows, season 2026/2027 entries and duration footnote; not a full audit of older tables","access_mode":"HTML body","inspection":"Official current-event rows, 2026/2027 table and duration footnote inspected on 2026-11-22. Older seasonal tables, linked files and live control were not audited","boundary":"The morning November 22 closure is recorded separately from a planned evening lift. Manoeuvre duration differs from hydraulic duration; no prospective event is treated as completed.","updated_date":"2026-11-22","completed_event_date":"2026-11-22","scheduled_event_date":"2026-11-22","page_metadata_date":"2026-10-20"},{"id":"mose-measurement","title":"Sea and lagoon maxima since MOSE operation began","publisher":"Comune di Venezia / Centro Maree","role":"Municipal measurement-scope and validation notice","url":"https://www.comune.venezia.it/it/content/massimi-significativi-registrati-mare-e-laguna","publication_date":null,"language":"Italian","interpretation_note":"Italian source interpreted into English by Codex under the owner-authorized AI policy; no independent language review claimed.","locator":"Introductory methodology, ZMPS datum, provisional thresholds and 2024 validation caveat","access_mode":"HTML body","inspection":"Relevant official HTML text inspected on 2026-11-22; linked files, maps, images, underlying instruments and live services were not tested","boundary":"The method describes maxima during gate closures, not an untreated counterfactual. Linked annual tables were not inspected; the page retains a construction-stage statement and unvalidated 2024 values.","updated_date":"2026-11-22","series_start_period":"2020-10"},{"id":"m4-operation","title":"ATM's 2024 operating profile","publisher":"ATM Group","role":"Operator's retrospective annual HTML summary","url":"https://risultati.atm.it/2024/it/profilo","publication_date":null,"language":"Italian","interpretation_note":"Italian source interpreted into English by Codex under the owner-authorized AI policy; no independent language review claimed.","locator":"Eventi significativi 2024 / Italia / Estensione dei servizi, October entry","access_mode":"HTML body","inspection":"Relevant official HTML text inspected on 2026-11-22; linked files, maps, images, underlying instruments and live services were not tested","boundary":"October 2024 is the stated operating milestone, not an invented exact day. Fleet size and advertised travel time are not trains simultaneously running or a reliability series.","reporting_period":"2024","opening_event_period":"2024-10"},{"id":"m4-access","title":"M4 passenger-service and interchange information","publisher":"ATM","role":"Operator's line and accessibility description","url":"https://www.atm.it/it/AtmNews/AtmInforma/Pagine/M4informazionisulserviziopasseggeribis.aspx?c=print","publication_date":null,"language":"Italian","interpretation_note":"Italian source interpreted into English by Codex under the owner-authorized AI policy; no independent language review claimed.","locator":"Route, interchanges, lifts, separate accessibility path and ticket-gate sections","access_mode":"HTML body","inspection":"Relevant official HTML text inspected on 2026-11-22; linked files, maps, images, underlying instruments and live services were not tested","boundary":"Installed lifts and a real-time-information link do not establish availability of every lift at inspection. No journey, payment, app or live accessibility test was performed."},{"id":"m4-financing","title":"Signed green refinancing for Linea M4","publisher":"SPV Linea M4 S.p.A.","role":"Concessionaire's transaction announcement","url":"https://www.metro4milano.it/sottoscritta-loperazione-di-rifinanziamento-green/","publication_date":"2024-12-02","language":"Italian","interpretation_note":"Italian source interpreted into English by Codex under the owner-authorized AI policy; no independent language review claimed.","locator":"Nine-lender maximum amount, ownership context and stated financing effects","access_mode":"HTML body","inspection":"Relevant official HTML text inspected on 2026-11-22; linked files, maps, images, underlying instruments and live services were not tested","boundary":"The maximum facility is not total project cost or actual drawdown. Stated debt and concession-charge benefits are not an independently recalculated savings series."},{"id":"m4-bridge","title":"San Cristoforo bridge in the Linea Blu heritage programme","publisher":"SPV Linea M4 S.p.A.","role":"Dated description of the built station-access connection","url":"https://www.metro4milano.it/la-storia-di-milano-lungo-la-linea-blu-conclusione/","publication_date":"2026-10-08","language":"Italian","interpretation_note":"Italian source interpreted into English by Codex under the owner-authorized AI policy; no independent language review claimed.","locator":"Built cycle/pedestrian bridge and October 14 visit announcement","access_mode":"HTML body","inspection":"Relevant official HTML text inspected on 2026-11-22; linked files, maps, images, underlying instruments and live services were not tested","boundary":"The notice supports the described connection, not a bridge load-test certificate, measured use or proof that the advertised visit occurred.","scheduled_visit_date":"2026-10-14"},{"id":"m4-heritage","title":"Construction research and the Linea Blu heritage programme","publisher":"SPV Linea M4 S.p.A.","role":"Dated account of research collaboration and public programme","url":"https://www.metro4milano.it/la-storia-di-milano-lungo-la-linea-blu/","publication_date":"2026-09-07","language":"Italian","interpretation_note":"Italian source interpreted into English by Codex under the owner-authorized AI policy; no independent language review claimed.","locator":"M4, heritage authority, municipality and university collaboration; talks then visits","access_mode":"HTML body","inspection":"Relevant official HTML text inspected on 2026-11-22; linked files, maps, images, underlying instruments and live services were not tested","boundary":"The programme is not an archaeological clearance, final construction certificate or measured participation outcome. Linked event materials were not inspected."},{"id":"venice-identity","title":"Venice's six municipal districts","publisher":"Comune di Venezia","role":"Municipal identity and decentralization description","url":"https://www.comune.venezia.it/it/content/municipalit%C3%83","publication_date":null,"language":"Italian","interpretation_note":"Italian source interpreted into English by Codex under the owner-authorized AI policy; no independent language review claimed.","locator":"Six municipalità and their place within the Comune","access_mode":"HTML body","inspection":"Relevant official HTML text inspected on 2026-11-22; linked files, maps, images, underlying instruments and live services were not tested","boundary":"Municipal districts are subdivisions, not six separately counted places. The municipality is not the whole lagoon or metropolitan city.","updated_date":"2022-08-29"},{"id":"venice-walkways","title":"Raised pedestrian routes","publisher":"Comune di Venezia / Centro Maree","role":"Local adaptation-service description","url":"https://www.comune.venezia.it/it/content/percorsi-su-passerelle","publication_date":null,"language":"Italian","interpretation_note":"Italian source interpreted into English by Codex under the owner-authorized AI policy; no independent language review claimed.","locator":"Italian pedestrian-plan description, seasonal window and displayed map label","access_mode":"HTML body","inspection":"Relevant official HTML text inspected on 2026-11-22; linked files, maps, images, underlying instruments and live services were not tested","boundary":"The seasonal plan is not a live safe-route assurance. The page still labels its map 2019–20; linked maps and route deployment were not inspected.","updated_date":"2026-09-21","displayed_map_period":"2019-2020"},{"id":"venice-waste","title":"Waste collection in Venice's historic centre and islands","publisher":"Veritas","role":"Utility service description and dated collection-share display","url":"https://www.gruppoveritas.it/comune/venezia-centro-e-isole/domestica-non-domestica/rifiuti/la-raccolta-dei-rifiuti-venezia","publication_date":null,"language":"Italian","interpretation_note":"Italian source interpreted into English by Codex under the owner-authorized AI policy; no independent language review claimed.","locator":"Centre/islands heading, September 2026 percentages and two collection modes","access_mode":"HTML body","inspection":"Relevant official HTML text inspected on 2026-11-22; linked files, maps, images, underlying instruments and live services were not tested","boundary":"Area and whole-municipality collection percentages have different scopes. Separate collection is not a verified final-recycling yield or annual result; no address-specific service query was submitted.","reporting_period":"2026-09"},{"id":"venice-fire-water","title":"Castello fire-water extension feasibility approval","publisher":"Comune di Venezia","role":"Dated municipal project-stage announcement","url":"https://live.comune.venezia.it/index.php/it/2026/10/si-amplia-la-rete-antincendio-castello-arrivo-ventotto-idranti-oltre-due-chilometri-di","publication_date":"2026-10-29","language":"Italian","interpretation_note":"Italian source interpreted into English by Codex under the owner-authorized AI policy; no independent language review claimed.","locator":"Approved feasibility design, proposed works, existing network and next design stage","access_mode":"HTML body","inspection":"Relevant official HTML text inspected on 2026-11-22; linked files, maps, images, underlying instruments and live services were not tested","boundary":"The 28 hydrants and new pumping works are proposed additions, not installed assets. Existing city/Burano inventory does not prove coverage of every street.","approval_date":"2026-10-29"},{"id":"venice-buses","title":"ACTV fleet renewal and separate island/mainland programmes","publisher":"Comune di Venezia","role":"Dated municipal funding and fleet-stage account","url":"https://live.comune.venezia.it/it/2026/11/trasporto-pubblico-la-flotta-actv-si-rinnova-arrivo-cinque-nuovi-autobus-metano","publication_date":"2026-11-07","language":"Italian","interpretation_note":"Italian source interpreted into English by Codex under the owner-authorized AI policy; no independent language review claimed.","locator":"Five methane-bus funding decision, thirty operating island e-buses and mainland programme","access_mode":"HTML body","inspection":"Relevant official HTML text inspected on 2026-11-22; linked files, maps, images, underlying instruments and live services were not tested","boundary":"Approval, purchase and operation are separate stages. The mainland programme is not proof all 136 vehicles are in service or that measured emissions benefits have occurred."}],'Exact source identity, language, access scope and dates must remain intact');
  assert.equal(review.sources_sha256,italyRailLagoonHash(data.sources));assert.equal(review.edition_sha256,italyRailLagoonHash(data));
}
export const italyRailLagoonCriticalPhrases=[
  [
    0,
    0,
    "not a promise of uninterrupted passage"
  ],
  [
    0,
    1,
    "does not establish the present condition of every gate"
  ],
  [
    0,
    1,
    "difference between installed equipment and spares"
  ],
  [
    0,
    2,
    "allocation categories, not actual expenditure totals"
  ],
  [
    0,
    2,
    "Institutional activation is not final completion"
  ],
  [
    0,
    3,
    "a scheduled event is not a completed closure"
  ],
  [
    0,
    3,
    "hydraulic effect lasts approximately twenty-five minutes less"
  ],
  [
    0,
    4,
    "2024 values remain under validation"
  ],
  [
    0,
    4,
    "not an untreated counterfactual"
  ],
  [
    1,
    0,
    "not the number of trains running simultaneously"
  ],
  [
    1,
    0,
    "not a measured reliability distribution"
  ],
  [
    1,
    1,
    "Installed equipment is not continuous availability"
  ],
  [
    1,
    1,
    "neither the app nor a real passenger journey was tested"
  ],
  [
    1,
    2,
    "not total construction cost or actual borrowing drawn"
  ],
  [
    1,
    2,
    "independently establish the size of savings ultimately realized"
  ],
  [
    1,
    3,
    "not a completion certificate or proof the visit took place"
  ],
  [
    1,
    4,
    "not an archaeological clearance or final works acceptance"
  ],
  [
    2,
    0,
    "subdivisions, not six separate cities"
  ],
  [
    2,
    1,
    "not a live safe-route guarantee"
  ],
  [
    2,
    1,
    "still labels its map 2019–20"
  ],
  [
    2,
    2,
    "different geographical scopes"
  ],
  [
    2,
    2,
    "not final recycling yield or a completed annual result"
  ],
  [
    2,
    3,
    "proposed additions, not twenty-eight newly operating hydrants"
  ],
  [
    2,
    4,
    "must not be collapsed into one completed fleet"
  ],
  [
    2,
    4,
    "not a measured city-wide result"
  ]
];

