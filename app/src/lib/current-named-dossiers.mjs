import historical from '../data/portfolio-eligibility-decisions.json' with {type:'json'};
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
// Cohorts are additive. Each retained cohort keeps its own exact review and historical totals.
export const namedDossierCohorts=[nevadaDossiers,europeDossiers,southernAfricaDossiers,southAsiaDossiers,chileDossiers,brazilDossiers,northSeaDossiers,stockholmDossiers,aucklandDossiers,tuasDossiers,portCitiesDossiers,urbanServicesDossiers,nordicCitiesDossiers,swissRailCityDossiers,kenyaCorridorDossiers,gautengMetroDossiers,malaysiaMetroDossiers,colombiaRailDossiers,moroccoCorridorDossiers,portugalWaterCitiesDossiers,italyRailLagoonDossiers,austriaHousingCitiesDossiers,ruhrWaterCityDossiers,koreaEnergyCitiesDossiers,istanbulCrossingsDossiers,finlandMetroCitiesDossiers,andesMetroCityDossiers,czechMetroCitiesDossiers,indonesiaRailCityDossiers,senegalMobilityEnergyDossiers,kigaliCityDossiers];
export const namedDossierAdditions=namedDossierCohorts.flatMap(c=>c.records);
const count=kind=>namedDossierAdditions.filter(r=>r.kind===kind).reduce((sum,r)=>sum+r.identity_decision.eligible_count,0);
const addedProjects=count('Project'),addedPlaces=count('Place');
const eligibleProjects=historical.summary.eligible_project_candidates+addedProjects;
const eligiblePlaces=historical.summary.eligible_place_candidates+addedPlaces;
export const currentPortfolioSummary={
  historical_decision_date:historical.decision_date,
  current_review_date:namedDossierCohorts.map(c=>c.inspected_date).sort().at(-1)??historical.decision_date,
  historical_projects:historical.summary.eligible_project_candidates,
  historical_places:historical.summary.eligible_place_candidates,
  added_projects:addedProjects,added_places:addedPlaces,
  eligible_projects:eligibleProjects,eligible_places:eligiblePlaces,
  projects_needed:historical.summary.target_projects-eligibleProjects,
  places_needed:historical.summary.target_places-eligiblePlaces,
  boundary:'Eligible distinct identities, not a certification that every historical dossier is content-complete. No blanket operating-outcome admission, production acceptance or launch is implied.'
};
