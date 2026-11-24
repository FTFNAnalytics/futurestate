import dossiers from '../data/czech-metro-cities-named-dossiers.json' with {type:'json'};
export const czechMetroCitiesDossiers=dossiers;
export const czechMetroCitiesProjects=dossiers.records.filter(r=>r.kind==='Project');
export const czechMetroCitiesPlaces=dossiers.records.filter(r=>r.kind==='Place');
export const czechMetroCitiesSourcesFor=record=>dossiers.sources.filter(s=>[...record.sections,...record.timeline].some(part=>part.source_ids.includes(s.id)));
