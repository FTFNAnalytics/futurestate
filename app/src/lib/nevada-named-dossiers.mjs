import dossiers from '../data/nevada-named-dossiers.json' with {type:'json'};
import historical from '../data/portfolio-eligibility-decisions.json' with {type:'json'};
export const nevadaDossiers=dossiers;
export const nevadaProjects=dossiers.records.filter(r=>r.kind==='Project');
export const nevadaPlaces=dossiers.records.filter(r=>r.kind==='Place');
export const nevadaSourcesFor=record=>dossiers.sources.filter(s=>record.sections.some(section=>section.source_ids.includes(s.id)));
const addedProjects=nevadaProjects.reduce((n,r)=>n+r.identity_decision.eligible_count,0);
const addedPlaces=nevadaPlaces.reduce((n,r)=>n+r.identity_decision.eligible_count,0);
const eligibleProjects=historical.summary.eligible_project_candidates+addedProjects;
const eligiblePlaces=historical.summary.eligible_place_candidates+addedPlaces;
export const currentPortfolioSummary={
  historical_decision_date:historical.decision_date,
  current_review_date:dossiers.inspected_date,
  historical_projects:historical.summary.eligible_project_candidates,
  historical_places:historical.summary.eligible_place_candidates,
  added_projects:addedProjects,
  added_places:addedPlaces,
  eligible_projects:eligibleProjects,
  eligible_places:eligiblePlaces,
  projects_needed:historical.summary.target_projects-eligibleProjects,
  places_needed:historical.summary.target_places-eligiblePlaces,
  boundary:'Eligible distinct identities, not a certification that every historical dossier is content-complete. No operating outcome, production acceptance or launch is implied.'
};
