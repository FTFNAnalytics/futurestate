import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
export const colombiaRailHash=value=>createHash('sha256').update(JSON.stringify(value)).digest('hex');
export function assertColombiaRailDossiers(data,review){
  assert.equal(data.inspected_date,'2026-11-22');assert.equal(data.timezone,'America/Edmonton');
  assert.equal(data.review_policy,'OWNER-AUTHORIZED-AI-REVIEW-2026-09-25');
  assert.equal(review.policy_id,data.review_policy);assert.equal(review.review_date,data.inspected_date);
  assert.equal(data.independent_review,false);assert.equal(data.phase_60_identity_added,false);
  for(const key of ['independent_review','publication_authorized','launch_authorized','phase_216_complete'])assert.equal(review[key],false);
  assert.deepEqual(data.records.map(r=>r.record_id),["project-bogota-metro-line-1","project-medellin-metro-railway","place-bogota"]);
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
    assert.equal(review.records.find(d=>d.record_id===r.record_id)?.sha256,colombiaRailHash(r),'Article changed after exact-version review');
  }
  assert.deepEqual(data.records.map(r=>r.scope),["The initial elevated Line 1 alignment from Bosa to Caracas at Calle 72, counted once. Stations, trains, construction sections and parks are components, not additional project identities. Excludes Line 2 and the proposed Calle 100 extension.","The connected original heavy-rail network of Lines A and B, including the southern Line A extension, counted as one project. Cableways, buses, the Ayacucho tram and Metro de la 80 are separate systems or projects, not additional delivery within this identity.","Bogotá Distrito Capital, counted as one place across its twenty localities. Excludes the surrounding Cundinamarca municipalities, including Soacha; regional survey and water-service coverage do not enlarge the counted city. Localities and care centres are not separately counted places."]);
  assert.deepEqual(data.records.map(r=>r.stage),["Construction and a towed rolling test documented in 2026. No commercial-service acceptance or recurring operating outcome is admitted.","Commercial opening documented in 1995 and 1996; current operator inventories and dated maintenance/payment accounts inspected. The planned 2027 fleet expansion is not accepted operating capacity.","Dated municipal service and construction-management accounts inspected. Survey geography, participation counts and planned interruptions are not city-wide outcome acceptance."]);
  assert.deepEqual(data.records.map(r=>r.route),["/atlas/projects/bogota-metro-line-1/","/atlas/projects/medellin-metro-railway/","/atlas/places/bogota/"]);
  assert.deepEqual(data.records.map(r=>r.aliases),[["Bogotá Metro Line 1","Bogota Metro Line 1","Primera Línea del Metro de Bogotá","PLMB","Línea 1 Metro Bogotá"],["Metro de Medellín Lines A and B","Medellin Metro railway","Línea A Medellín","Línea B Medellín","Valle de Aburrá metro railway"],["Bogotá Distrito Capital","Bogota DC","Bogotá D.C.","Bogota capital district"]]);
  assert.deepEqual(data.records.map(r=>r.timeline),[[{"date":"2026-02-19","event":"City design account describes the initial alignment and a separate extension proposal.","source_ids":["bogota-design"]},{"date":"2026-04-08","event":"City reports the ninth train’s arrival; its full-fleet timetable remains a forecast.","source_ids":["bogota-connections"]},{"date":"2026-05-22","event":"Train two undergoes a towed rolling test on the viaduct.","source_ids":["bogota-rolling-test"]},{"date":"2026-11-08","event":"NQS/Calle Octava Sur bridge structural continuity completed, according to the later city account.","source_ids":["bogota-progress"]},{"date":"2026-11-15","event":"City reports twenty kilometres of viaduct and twelve of installed track, distinct from October’s overall execution measure.","source_ids":["bogota-progress"]}],[{"date":"1979-05-31","event":"Metro enterprise created, according to the operator’s retrospective.","source_ids":["medellin-history"]},{"date":"1995-11-30","event":"First commercial section opened between Niquía and Poblado.","source_ids":["medellin-history"]},{"date":"1996-02-29","event":"Line B commercial start dated in the operator’s line table.","source_ids":["medellin-b"]},{"date":"2012-09-17","event":"Southern extension opened to Sabaneta and La Estrella, according to the retrospective.","source_ids":["medellin-history"]},{"date":"2026-06-26","event":"Operator reports retaining-structure work underway between Sabaneta and Itagüí, not completed acceptance.","source_ids":["medellin-river"]},{"date":"2026-07-08","event":"Fleet bulletin describes manufacturing progress and future operating introduction.","source_ids":["medellin-fleet"]},{"date":"2026-11-11","event":"Operator announces the initial bank-card payment rollout on Lines A and B.","source_ids":["medellin-payments"]}],[{"date":"2026-03-10","event":"City explains the survey geography and November 2025–February 2026 fieldwork; this is not a result-table release.","source_ids":["bogota-survey"]},{"date":"2026-11-03","event":"Utility notice publishes planned Tibitoc-related restrictions beginning the next day.","source_ids":["bogota-water-work"]},{"date":"2026-11-13","event":"City publishes financial-education and subsidy-stage figures with a November 9 cutoff.","source_ids":["bogota-housing-learning"]},{"date":"2026-11-14","event":"Traffic notice publishes a November 14–17 overnight closure plan, not observed compliance.","source_ids":["bogota-street-work"]},{"date":"2026-11-15","event":"City reports El Dorado care-centre relocation and a projected service expansion; no exact relocation day is stated.","source_ids":["bogota-care"]}]],"Chronology dates, bounded events and exact source bindings must remain intact");
  assert.deepEqual(data.records.map(r=>r.sections.map(s=>s.source_ids)),[[["bogota-design"],["bogota-progress"],["bogota-rolling-test"],["bogota-connections"],["bogota-parks"],[]],[["medellin-history","medellin-b"],["medellin-a","medellin-b"],["medellin-fleet"],["medellin-river"],["medellin-payments"],[]],[["bogota-survey"],["bogota-street-work"],["bogota-care"],["bogota-housing-learning"],["bogota-water-work"],[]]],"Claim-to-source bindings changed");
  for(const r of data.records)assert(!Object.hasOwn(r,'historical_acquisition'),'New Colombia identity must not reuse a historical country docket');
  for(const [ri,si,phrase] of colombiaRailCriticalPhrases)assert(data.records[ri].sections[si].text.includes(phrase),'Missing bounded claim: '+phrase);
  const dates=s=>Object.fromEntries(Object.entries(s).filter(([k])=>k.endsWith('_date')||k.endsWith('_period')));
  assert.deepEqual(data.sources.map(dates),[{"publication_date":"2026-02-19"},{"publication_date":"2026-11-15","reporting_period":"2026-10","event_date":"2026-11-08"},{"publication_date":"2026-05-22","event_date":"2026-05-22"},{"publication_date":"2026-04-08"},{"publication_date":"2026-11-08"},{"publication_date":null},{"publication_date":null},{"publication_date":null,"event_date":"1996-02-29"},{"publication_date":"2026-07-08","expected_operation_period":"2027"},{"publication_date":"2026-06-26"},{"publication_date":"2026-11-11","effective_date":"2026-11-11"},{"publication_date":"2026-03-10","fieldwork_start_period":"2025-11","fieldwork_end_period":"2026-02"},{"publication_date":"2026-11-15","reporting_period":"2026-10"},{"publication_date":"2026-11-13","reporting_cutoff_date":"2026-11-09"},{"publication_date":"2026-11-03","scheduled_start_date":"2026-11-04"},{"publication_date":"2026-11-14","scheduled_start_date":"2026-11-14","scheduled_end_date":"2026-11-17"}],"Inspection, publication, event, reporting and planned dates remain separate");
  const expectedSources=[["bogota-design","https://bogota.gov.co/mi-ciudad/movilidad/beneficios-y-datos-clave-de-la-linea-1-del-metro-de-bogota","Design and projected benefits are not measured service. The Calle 100 extension and Line 2 are outside this counted alignment.","Route, stations, access buildings and extension paragraphs","Owner design description relayed by the city","Bogotá municipal portal / Empresa Metro de Bogotá"],["bogota-progress","https://bogota.gov.co/mi-ciudad/movilidad/2026-11/linea-1-metro-de-bogota-ya-tiene-20-kilometros-de-viaducto-construidos","October overall execution and November component lengths have different dates and denominators; neither is operating acceptance.","Viaduct, rail installation, October progress and NQS bridge paragraphs","Dated construction account","Bogotá municipal portal / Mayor's office"],["bogota-rolling-test","https://bogota.gov.co/mi-ciudad/movilidad/inician-pruebas-de-trenes-del-metro-de-bogota-sobre-el-viaducto","This was a towed rolling test. Energized and automatic operation were prospective; quoted equipment capabilities are not passenger-service acceptance.","Opening paragraphs describing train two and auxiliary vehicles","Dated technical-test account","Bogotá municipal portal / Mayor's office"],["bogota-connections","https://bogota.gov.co/mi-ciudad/movilidad/ya-se-encuentra-en-colombia-noveno-tren-linea-1-del-metro-bogota-2026","Eight direct and two proximity connections are distinguished here. Other summaries say ten direct; this discrepancy is not resolved by asserting ten equivalent interchanges. The October fleet-delivery expectation is not completion.","Arrival paragraph and sixteen-station interchange description","Delivery and design account","Bogotá municipal portal / Empresa Metro de Bogotá"],["bogota-parks","https://bogota.gov.co/mi-ciudad/movilidad/2026-11/linea-1-metro-bogota-11-parques-renovados-en-las-areas-de-influencia","The body describes future renewal despite the URL wording. No park handover or underlying concession instrument was inspected.","Planned improvements and concession intervention-area paragraphs","Public-realm intervention description","Bogotá municipal portal / Empresa Metro de Bogotá"],["medellin-history","https://www.metrodemedellin.gov.co/quienes-somos/historia/","An undated retrospective supplies event dates; its inspection date is not a publication date. Later modes are not folded into the original railway identity.","Creation, first commercial service and southern extension chronology","Operator retrospective","Metro de Medellín"],["medellin-a","https://www.metrodemedellin.gov.co/usuarios/sistema-integrado/linea-a","Station facilities describe provision, not current lift availability. The dynamic line-status widget was not resolved or treated as service evidence.","La Estrella–Niquía introduction and station-access descriptions","Operator line and station inventory","Metro de Medellín"],["medellin-b","https://www.metrodemedellin.gov.co/usuarios/sistema-integrado/linea-b","The introduction lists seven stations while the table says six; no reconciled combined total is asserted. The railway body, not the erroneous tram/cable SEO title, defines the subject.","San Javier–San Antonio introduction and general-information table","Operator line and station inventory","Metro de Medellín"],["medellin-fleet","https://www.metrodemedellin.gov.co/al-dia/noticias/asi-avanza-el-ensamblaje-de-los-13-trenes-nuevos-que-tendra-el-metro-de-medellin","Thirty percent is project progress, not accepted train availability. The 2027 operation and capacity improvements are forecasts.","Bulletin 2260: carbody shipment, prototype and local assembly","Operator manufacturing progress bulletin","Metro de Medellín"],["medellin-river","https://www.metrodemedellin.gov.co/al-dia/noticias/el-metro-avanza-en-obras-civiles-en-el-rio-medellin-para-proteger-la-infraestructura-ferrea-y-mitigar-riesgos","Work was underway in this account; its first-half completion expectation is not a completion receipt. The text does not quantify avoided failures or independently attribute climate effects.","Bulletin 2257: Sabaneta–Itagüí retaining structures and erosion","Operator maintenance bulletin","Metro de Medellín"],["medellin-payments","https://www.metrodemedellin.gov.co/al-dia/noticias/llegan-los-pagos-abiertos-al-metro-de-medellin-ahora-es-posible-viajar-pagando-con-tarjetas-bancarias","Initial A/B rollout is not network-wide deployment or proof of transaction success. Personalized Cívica benefits are not automatically promised for bank cards.","Bulletin 2284: start date, initial validator scope and Cívica relationship","Dated fare-system rollout notice","Metro de Medellín"],["bogota-survey","https://bogota.gov.co/mi-ciudad/planeacion/que-es-la-encuesta-multiproposito-que-se-realiza-en-bogota","The explanatory page is not a released result table or microdata analysis. Bogotá, the twenty-one external municipalities and their sampling domains remain distinct.","Completed fieldwork period, localities and Cundinamarca coverage","Survey geography and purpose account","Bogotá municipal portal / Secretaría Distrital de Planeación"],["bogota-care","https://bogota.gov.co/mi-ciudad/gestion-publica/2026-11/bogota-fortalece-servicios-supercade-con-manzana-del-cuidado-el-dorado","The relocation is reported, without an exact relocation day. Twenty additional services and equipment remain planned; service encounters are not unique beneficiaries.","Relocation, October inventory and projected additional services","Service relocation and planned expansion account","Bogotá municipal portal / Secretaría General"],["bogota-housing-learning","https://bogota.gov.co/mi-ciudad/habitat/2026-11/coordinadoras-de-las-manzanas-del-cuidado-se-certifican-en-bogota","People, certified participants and households have different denominators. Assigned subsidy is not completed housing occupancy; programme totals do not establish causal effect.","Course scope, November 9 participation and subsidy-stage figures","Programme participation account","Bogotá municipal portal / Secretaría Distrital del Hábitat"],["bogota-water-work","https://bogota.gov.co/mi-ciudad/habitat/2026-11/cortes-de-agua-en-municipios-de-cundinamarca-el-4-de-noviembre-de-2026","The scheduled interruption is historical, not current advice or a completion/quality receipt. Utility service areas extend beyond Bogotá.","Valve work and differentiated service-area restrictions","Advance utility work notice","Bogotá municipal portal / Empresa de Acueducto y Alcantarillado de Bogotá"],["bogota-street-work","https://bogota.gov.co/mi-ciudad/movilidad/2026-11/movilidad-bogota-cierre-autopista-sur-calle-8-sur-av-primero-de-mayo","The authorised plan is not observed compliance or present routing advice. Linked maps were not visually inspected.","Closure window, bus diversions, moved stops and pedestrian provision","Advance traffic-management notice","Bogotá municipal portal / Secretaría Distrital de Movilidad"]];
  for(const [id,url,boundary,locator,role,publisher] of expectedSources){
    const s=data.sources.find(s=>s.id===id);assert(s);assert.equal(s.url,url);assert.equal(s.boundary,boundary);assert.equal(s.locator,locator);assert.equal(s.role,role);assert.equal(s.publisher,publisher);
    assert.equal(s.language,'Spanish');assert.equal(s.access_mode,'HTML body');
    assert.equal(s.inspection,"Relevant official HTML text inspected on 2026-11-22; linked files, images, live services and dynamic feeds were not inspected");
    assert.equal(s.interpretation_note,"Spanish source interpreted into English by Codex under the owner-authorized AI policy; no independent language review claimed.");
  }
  assert.equal(review.sources_sha256,colombiaRailHash(data.sources));assert.equal(review.edition_sha256,colombiaRailHash(data));
}
export const colombiaRailCriticalPhrases=[
  [
    0,
    0,
    "outside this article’s counted alignment"
  ],
  [
    0,
    0,
    "projections"
  ],
  [
    0,
    1,
    "different measures, not interchangeable estimates of readiness"
  ],
  [
    0,
    1,
    "not an independent commissioning certificate"
  ],
  [
    0,
    2,
    "towed rolling test, not an energized automatic passenger journey"
  ],
  [
    0,
    3,
    "eight direct TransMilenio connections and two proximity connections"
  ],
  [
    0,
    3,
    "expecting the whole fleet later in the year"
  ],
  [
    0,
    4,
    "does not record eleven finished parks"
  ],
  [
    1,
    0,
    "as one identity"
  ],
  [
    1,
    1,
    "Listed facilities are not live availability reports"
  ],
  [
    1,
    1,
    "no reconciled network total is inferred"
  ],
  [
    1,
    2,
    "not the proportion of new trains available for passengers"
  ],
  [
    1,
    2,
    "projected for 2027"
  ],
  [
    1,
    3,
    "not a completed handover"
  ],
  [
    1,
    3,
    "no measured reduction in failures"
  ],
  [
    1,
    4,
    "initially through one enabled validator at each access"
  ],
  [
    1,
    4,
    "No payment transaction was tested"
  ],
  [
    2,
    0,
    "not a results release"
  ],
  [
    2,
    1,
    "not an observed record of compliance"
  ],
  [
    2,
    2,
    "projecting twenty additional services"
  ],
  [
    2,
    2,
    "different measures"
  ],
  [
    2,
    3,
    "not interchangeable denominators"
  ],
  [
    2,
    3,
    "An assigned subsidy is not occupied housing"
  ],
  [
    2,
    4,
    "not a post-work restoration record or a current water-quality assurance"
  ]
];
