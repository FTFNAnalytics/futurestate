import dossiers from '../data/finland-metro-cities-named-dossiers.json' with {type:'json'};
export const finlandMetroCitiesDossiers=dossiers;
export const finlandMetroCitiesProjects=dossiers.records.filter(r=>r.kind==='Project');
export const finlandMetroCitiesPlaces=dossiers.records.filter(r=>r.kind==='Place');
export const finlandMetroCitiesSourcesFor=record=>dossiers.sources.filter(s=>[...record.sections,...record.timeline].some(part=>part.source_ids.includes(s.id)));
