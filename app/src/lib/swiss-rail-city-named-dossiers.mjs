import dossiers from '../data/swiss-rail-city-named-dossiers.json' with {type:'json'};
export const swissRailCityDossiers=dossiers;
export const swissRailCityProjects=dossiers.records.filter(r=>r.kind==='Project');
export const swissRailCityPlaces=dossiers.records.filter(r=>r.kind==='Place');
export const swissRailCitySourcesFor=record=>dossiers.sources.filter(s=>[...record.sections,...record.timeline].some(part=>part.source_ids.includes(s.id)));
