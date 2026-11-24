import dossiers from '../data/austria-housing-cities-named-dossiers.json' with {type:'json'};
export const austriaHousingCitiesDossiers=dossiers;
export const austriaHousingCitiesProjects=dossiers.records.filter(r=>r.kind==='Project');
export const austriaHousingCitiesPlaces=dossiers.records.filter(r=>r.kind==='Place');
export const austriaHousingCitiesSourcesFor=record=>dossiers.sources.filter(s=>[...record.sections,...record.timeline].some(part=>part.source_ids.includes(s.id)));
