import dossiers from '../data/gauteng-metro-named-dossiers.json' with {type:'json'};
export const gautengMetroDossiers=dossiers;
export const gautengMetroProjects=dossiers.records.filter(r=>r.kind==='Project');
export const gautengMetroPlaces=dossiers.records.filter(r=>r.kind==='Place');
export const gautengMetroSourcesFor=record=>dossiers.sources.filter(s=>[...record.sections,...record.timeline].some(part=>part.source_ids.includes(s.id)));
