import dossiers from '../data/portugal-water-cities-named-dossiers.json' with {type:'json'};
export const portugalWaterCitiesDossiers=dossiers;
export const portugalWaterCitiesProjects=dossiers.records.filter(r=>r.kind==='Project');
export const portugalWaterCitiesPlaces=dossiers.records.filter(r=>r.kind==='Place');
export const portugalWaterCitiesSourcesFor=record=>dossiers.sources.filter(s=>[...record.sections,...record.timeline].some(part=>part.source_ids.includes(s.id)));
