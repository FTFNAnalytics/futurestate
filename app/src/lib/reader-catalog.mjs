import readers from '../data/phase-204-reader-completion.json' with {type:'json'};
import current from '../data/phase-205-216-current-editorial.json' with {type:'json'};
import aggregate from '../data/v1-public-reference-edition.json' with {type:'json'};
// The older reader pack uses exact record bindings; routes are the preserved canonical map.
import monographs from '../data/phase-200-cross-system-constraint-monographs.json' with {type:'json'};
import editions from '../data/phase-202-accessible-multilingual-low-bandwidth-editions.json' with {type:'json'};
import report from '../data/phase-203-state-of-future-systems-2026.json' with {type:'json'};
import {translatedReaders} from './translated-readers.mjs';
import montanaDossiers from '../data/montana-project-dossiers.json' with {type:'json'};
import localityDossiers from '../data/locality-dossiers.json' with {type:'json'};
import {nevadaDossiers} from './nevada-named-dossiers.mjs';
import {europeDossiers} from './europe-named-dossiers.mjs';
import {southernAfricaDossiers} from './southern-africa-named-dossiers.mjs';
import {southAsiaDossiers} from './south-asia-named-dossiers.mjs';
import {chileDossiers} from './chile-named-dossiers.mjs';
import {brazilDossiers} from './brazil-named-dossiers.mjs';
import {northSeaDossiers} from './north-sea-named-dossiers.mjs';
import {stockholmDossiers} from './stockholm-named-dossiers.mjs';
import {aucklandDossiers} from './auckland-named-dossiers.mjs';
import {tuasDossiers} from './tuas-named-dossiers.mjs';
import {portCitiesDossiers} from './port-cities-named-dossiers.mjs';
import {urbanServicesDossiers} from './urban-services-named-dossiers.mjs';
import {nordicCitiesDossiers} from './nordic-cities-named-dossiers.mjs';
import {swissRailCityDossiers} from './swiss-rail-city-named-dossiers.mjs';
import {kenyaCorridorDossiers} from './kenya-corridor-named-dossiers.mjs';
import {gautengMetroDossiers} from './gauteng-metro-named-dossiers.mjs';
import {malaysiaMetroDossiers} from './malaysia-metro-named-dossiers.mjs';
import {colombiaRailDossiers} from './colombia-rail-named-dossiers.mjs';
import {moroccoCorridorDossiers} from './morocco-corridor-named-dossiers.mjs';
import {portugalWaterCitiesDossiers} from './portugal-water-cities-named-dossiers.mjs';
import {italyRailLagoonDossiers} from './italy-rail-lagoon-named-dossiers.mjs';
import {austriaHousingCitiesDossiers} from './austria-housing-cities-named-dossiers.mjs';
import {ruhrWaterCityDossiers} from './ruhr-water-city-named-dossiers.mjs';
import {koreaEnergyCitiesDossiers} from './korea-energy-cities-named-dossiers.mjs';
import {istanbulCrossingsDossiers} from './istanbul-crossings-named-dossiers.mjs';
import {finlandMetroCitiesDossiers} from './finland-metro-cities-named-dossiers.mjs';
import {andesMetroCityDossiers} from './andes-metro-city-named-dossiers.mjs';
import {czechMetroCitiesDossiers} from './czech-metro-cities-named-dossiers.mjs';
import {indonesiaRailCityDossiers} from './indonesia-rail-city-named-dossiers.mjs';
import {senegalMobilityEnergyDossiers} from './senegal-mobility-energy-named-dossiers.mjs';
import {kigaliCityDossiers} from './kigali-city-named-dossiers.mjs';
import {canonicalProjectRefreshes,projectRefreshCatalogKind} from './canonical-project-refreshes.mjs';
import {canonicalAnnualBindings} from './canonical-annual-reader-bindings.mjs';
import {canonicalPlaceReadings} from './canonical-place-readings.mjs';
import {canonicalRegionalReadings} from './canonical-regional-readings.mjs';
import {nevadaComparison} from './nevada-project-comparison.mjs';
import {selectedArticleReviewFor,selectedReviewDate,selectedReviewStatus} from './selected-article-reviews.mjs';
import {annualCaseReviewForId, annualReviewDate, annualCaseOverview, annualCaseTitle} from './annual-case-reviews.mjs';
import {annualAiPresentation,annualAiReviewFor,annualAiReviewStatus,annualAiAvailableDate} from './annual-ai-reviews.mjs';
const paths=new Map();
const editionModes=new Map(editions.edition_contracts.map(r=>[r.edition_contract_id,r.edition_mode]));
const visit=value=>{
  if(!value||typeof value!=='object')return;
  if(Array.isArray(value))return value.forEach(visit);
  const id=Object.entries(value).find(([k,v])=>k.endsWith('_id')&&typeof v==='string')?.[1];
  if(id&&value.route)paths.set(id,aggregate.canonical_route_map[value.route]??value.route);
  Object.values(value).forEach(visit);
};
[monographs,editions,report].forEach(visit);
export const readerCatalog=[
  ...canonicalPlaceReadings.records.map(r=>({id:r.record_id,title:r.title,summary:r.answer,kind:r.kind,route:r.route,date:canonicalPlaceReadings.review_date,status:canonicalPlaceReadings.review_state,identity_names:[r.record_id,r.canonical_id,r.scope,...r.aliases]})),
  ...canonicalRegionalReadings.records.map(r=>({id:r.record_id,title:r.title,summary:r.answer,kind:r.kind,route:r.route,date:canonicalRegionalReadings.review_date,status:canonicalRegionalReadings.review_state,identity_names:[r.record_id,r.canonical_id,r.scope,...r.aliases]})),
  ...nevadaComparison.records.map(r=>({id:r.record_id,title:r.title,summary:r.answer,kind:r.kind,route:r.route,date:nevadaComparison.review_date,status:nevadaComparison.review_state,identity_names:[r.record_id,r.canonical_id,r.scope,...r.aliases]})),
  ...canonicalAnnualBindings.records.map(r=>{const article=readers.records.find(a=>a.record_id===r.article_record_id),view=annualAiPresentation(article,{route:r.article_route});return {id:r.atlas_record_id,title:view.title,summary:view.overview,kind:r.eligible_count===1?'Project':'Context',route:r.target_route,date:canonicalAnnualBindings.integration_date,status:'Exact dated annual reading integrated; no new source inspection',identity_names:[r.canonical_id,r.scope]};}),
  ...canonicalProjectRefreshes.records.map(r=>({id:r.record_id,title:r.title,summary:r.answer,kind:projectRefreshCatalogKind(r),route:r.route,date:canonicalProjectRefreshes.review_date,status:canonicalProjectRefreshes.review_state,identity_names:[r.canonical_id,r.scope,...r.aliases]})),
  ...nevadaDossiers.records.map(r=>({id:r.record_id,title:r.title,summary:r.answer,kind:r.kind,route:r.route,date:nevadaDossiers.inspected_date,status:nevadaDossiers.review_state,identity_names:[r.record_id,r.scope,...r.aliases]})),
  ...europeDossiers.records.map(r=>({id:r.record_id,title:r.title,summary:r.answer,kind:r.kind,route:r.route,date:europeDossiers.inspected_date,status:europeDossiers.review_state,identity_names:[r.record_id,r.scope,...r.aliases]})),
  ...southernAfricaDossiers.records.map(r=>({id:r.record_id,title:r.title,summary:r.answer,kind:r.kind,route:r.route,date:southernAfricaDossiers.inspected_date,status:southernAfricaDossiers.review_state,identity_names:[r.record_id,r.scope,...r.aliases]})),
  ...southAsiaDossiers.records.map(r=>({id:r.record_id,title:r.title,summary:r.answer,kind:r.kind,route:r.route,date:southAsiaDossiers.inspected_date,status:southAsiaDossiers.review_state,identity_names:[r.record_id,r.scope,...r.aliases]})),
  ...chileDossiers.records.map(r=>({id:r.record_id,title:r.title,summary:r.answer,kind:r.kind,route:r.route,date:chileDossiers.inspected_date,status:chileDossiers.review_state,identity_names:[r.record_id,r.scope,...r.aliases]})),
  ...brazilDossiers.records.map(r=>({id:r.record_id,title:r.title,summary:r.answer,kind:r.kind,route:r.route,date:brazilDossiers.inspected_date,status:brazilDossiers.review_state,identity_names:[r.record_id,r.scope,...r.aliases]})),
  ...northSeaDossiers.records.map(r=>({id:r.record_id,title:r.title,summary:r.answer,kind:r.kind,route:r.route,date:northSeaDossiers.inspected_date,status:northSeaDossiers.review_state,identity_names:[r.record_id,r.scope,...r.aliases]})),
  ...stockholmDossiers.records.map(r=>({id:r.record_id,title:r.title,summary:r.answer,kind:r.kind,route:r.route,date:stockholmDossiers.inspected_date,status:stockholmDossiers.review_state,identity_names:[r.record_id,r.scope,...r.aliases]})),
  ...aucklandDossiers.records.map(r=>({id:r.record_id,title:r.title,summary:r.answer,kind:r.kind,route:r.route,date:aucklandDossiers.inspected_date,status:aucklandDossiers.review_state,identity_names:[r.record_id,r.scope,...r.aliases]})),
  ...tuasDossiers.records.map(r=>({id:r.record_id,title:r.title,summary:r.answer,kind:r.kind,route:r.route,date:tuasDossiers.inspected_date,status:tuasDossiers.review_state,identity_names:[r.record_id,r.scope,...r.aliases]})),
  ...portCitiesDossiers.records.map(r=>({id:r.record_id,title:r.title,summary:r.answer,kind:r.kind,route:r.route,date:portCitiesDossiers.inspected_date,status:portCitiesDossiers.review_state,identity_names:[r.record_id,r.scope,...r.aliases]})),
  ...urbanServicesDossiers.records.map(r=>({id:r.record_id,title:r.title,summary:r.answer,kind:r.kind,route:r.route,date:urbanServicesDossiers.inspected_date,status:urbanServicesDossiers.review_state,identity_names:[r.record_id,r.scope,...r.aliases]})),
  ...nordicCitiesDossiers.records.map(r=>({id:r.record_id,title:r.title,summary:r.answer,kind:r.kind,route:r.route,date:nordicCitiesDossiers.inspected_date,status:nordicCitiesDossiers.review_state,identity_names:[r.record_id,r.scope,...r.aliases]})),
  ...swissRailCityDossiers.records.map(r=>({id:r.record_id,title:r.title,summary:r.answer,kind:r.kind,route:r.route,date:swissRailCityDossiers.inspected_date,status:swissRailCityDossiers.review_state,identity_names:[r.record_id,r.scope,...r.aliases]})),
  ...kenyaCorridorDossiers.records.map(r=>({id:r.record_id,title:r.title,summary:r.answer,kind:r.kind,route:r.route,date:kenyaCorridorDossiers.inspected_date,status:kenyaCorridorDossiers.review_state,identity_names:[r.record_id,r.scope,...r.aliases]})),
  ...gautengMetroDossiers.records.map(r=>({id:r.record_id,title:r.title,summary:r.answer,kind:r.kind,route:r.route,date:gautengMetroDossiers.inspected_date,status:gautengMetroDossiers.review_state,identity_names:[r.record_id,r.scope,...r.aliases]})),
  ...malaysiaMetroDossiers.records.map(r=>({id:r.record_id,title:r.title,summary:r.answer,kind:r.kind,route:r.route,date:malaysiaMetroDossiers.inspected_date,status:malaysiaMetroDossiers.review_state,identity_names:[r.record_id,r.scope,...r.aliases]})),
  ...colombiaRailDossiers.records.map(r=>({id:r.record_id,title:r.title,summary:r.answer,kind:r.kind,route:r.route,date:colombiaRailDossiers.inspected_date,status:colombiaRailDossiers.review_state,identity_names:[r.record_id,r.scope,...r.aliases]})),
  ...moroccoCorridorDossiers.records.map(r=>({id:r.record_id,title:r.title,summary:r.answer,kind:r.kind,route:r.route,date:moroccoCorridorDossiers.inspected_date,status:moroccoCorridorDossiers.review_state,identity_names:[r.record_id,r.scope,...r.aliases]})),
  ...portugalWaterCitiesDossiers.records.map(r=>({id:r.record_id,title:r.title,summary:r.answer,kind:r.kind,route:r.route,date:portugalWaterCitiesDossiers.inspected_date,status:portugalWaterCitiesDossiers.review_state,identity_names:[r.record_id,r.scope,...r.aliases]})),
  ...italyRailLagoonDossiers.records.map(r=>({id:r.record_id,title:r.title,summary:r.answer,kind:r.kind,route:r.route,date:italyRailLagoonDossiers.inspected_date,status:italyRailLagoonDossiers.review_state,identity_names:[r.record_id,r.scope,...r.aliases]})),
  ...austriaHousingCitiesDossiers.records.map(r=>({id:r.record_id,title:r.title,summary:r.answer,kind:r.kind,route:r.route,date:austriaHousingCitiesDossiers.inspected_date,status:austriaHousingCitiesDossiers.review_state,identity_names:[r.record_id,r.scope,...r.aliases]})),
  ...ruhrWaterCityDossiers.records.map(r=>({id:r.record_id,title:r.title,summary:r.answer,kind:r.kind,route:r.route,date:ruhrWaterCityDossiers.inspected_date,status:ruhrWaterCityDossiers.review_state,identity_names:[r.record_id,r.scope,...r.aliases]})),
  ...koreaEnergyCitiesDossiers.records.map(r=>({id:r.record_id,title:r.title,summary:r.answer,kind:r.kind,route:r.route,date:koreaEnergyCitiesDossiers.inspected_date,status:koreaEnergyCitiesDossiers.review_state,identity_names:[r.record_id,r.scope,...r.aliases]})),
  ...istanbulCrossingsDossiers.records.map(r=>({id:r.record_id,title:r.title,summary:r.answer,kind:r.kind,route:r.route,date:istanbulCrossingsDossiers.inspected_date,status:istanbulCrossingsDossiers.review_state,identity_names:[r.record_id,r.scope,...r.aliases]})),
  ...finlandMetroCitiesDossiers.records.map(r=>({id:r.record_id,title:r.title,summary:r.answer,kind:r.kind,route:r.route,date:finlandMetroCitiesDossiers.inspected_date,status:finlandMetroCitiesDossiers.review_state,identity_names:[r.record_id,r.scope,...r.aliases]})),
  ...andesMetroCityDossiers.records.map(r=>({id:r.record_id,title:r.title,summary:r.answer,kind:r.kind,route:r.route,date:andesMetroCityDossiers.inspected_date,status:andesMetroCityDossiers.review_state,identity_names:[r.record_id,r.scope,...r.aliases]})),
  ...czechMetroCitiesDossiers.records.map(r=>({id:r.record_id,title:r.title,summary:r.answer,kind:r.kind,route:r.route,date:czechMetroCitiesDossiers.inspected_date,status:czechMetroCitiesDossiers.review_state,identity_names:[r.record_id,r.scope,...r.aliases]})),
  ...indonesiaRailCityDossiers.records.map(r=>({id:r.record_id,title:r.title,summary:r.answer,kind:r.kind,route:r.route,date:indonesiaRailCityDossiers.inspected_date,status:indonesiaRailCityDossiers.review_state,identity_names:[r.record_id,r.scope,...r.aliases]})),
  ...senegalMobilityEnergyDossiers.records.map(r=>({id:r.record_id,title:r.title,summary:r.answer,kind:r.kind,route:r.route,date:senegalMobilityEnergyDossiers.inspected_date,status:senegalMobilityEnergyDossiers.review_state,identity_names:[r.record_id,r.scope,...r.aliases]})),
  ...kigaliCityDossiers.records.map(r=>({id:r.record_id,title:r.title,summary:r.answer,kind:r.kind,route:r.route,date:kigaliCityDossiers.inspected_date,status:kigaliCityDossiers.review_state,identity_names:[r.record_id,r.scope,...r.aliases]})),
  ...montanaDossiers.records.map(r=>({id:r.record_id,title:r.title,summary:r.answer,kind:'Project',route:r.route,date:r.authored_date,status:r.review_state,identity_names:['Montana',r.record_id,r.source_name,r.source_identity.legal_name,r.source_identity.uei]})),
  ...translatedReaders.map(r=>({id:r.record_id,title:r.title,summary:r.overview,kind:'Translation',route:r.route,date:r.integration_date,status:r.review_state,language:r.locale,language_names:[r.ui.language,r.locale==='fr-CA'?'Canadian French':'Latin American Spanish']})),
  ...localityDossiers.records.map(r=>({id:r.record_id,title:r.title,summary:r.answer,kind:'Place',route:r.route,date:r.ai_review_date,status:r.review_state,identity_names:[r.record_id,r.scope,...r.aliases]})),
  ...current.records.map(r=>({id:r.record_id,title:r.title,summary:r.answer,kind:r.kind,route:r.route,date:selectedArticleReviewFor(r,{route:r.route})?selectedReviewDate:r.updated_date??r.authored_date,status:selectedArticleReviewFor(r,{route:r.route})?selectedReviewStatus:r.review_status,...(r.identity_evidence?{identity_names:[r.identity_evidence.candidate_name,...r.identity_evidence.aliases,...(r.identity_evidence.identifier?[r.identity_evidence.identifier]:[])]}:{})})),
  ...readers.records.map(r=>{const route=paths.get(r.record_id),ai=annualAiReviewFor(r,{route});return {id:r.record_id,title:annualCaseTitle(r,{route}),summary:annualCaseOverview(r,{route}),kind:editionModes.get(r.record_id)==='Low-bandwidth HTML edition'?'Compact':r.record_id.startsWith('202-')?'Plain English':r.record_id.startsWith('200-')?'Essay':'Report',route,date:ai?annualAiAvailableDate(ai.decision.record_id):annualCaseReviewForId(r.record_id)?annualReviewDate(annualCaseReviewForId(r.record_id)):r.authored_date,status:ai?annualAiReviewStatus:r.review_status};}),
];
if(readerCatalog.some(r=>!r.route||!r.route.startsWith('/')))throw new Error('Reader catalog has an unresolved route');
export {searchReaders} from './reader-search.mjs';
