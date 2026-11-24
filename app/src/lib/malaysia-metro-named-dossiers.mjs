import dossiers from '../data/malaysia-metro-named-dossiers.json' with {type:'json'};
export const malaysiaMetroDossiers=dossiers;
export const malaysiaMetroProjects=dossiers.records.filter(r=>r.kind==='Project');
export const malaysiaMetroPlaces=dossiers.records.filter(r=>r.kind==='Place');
export const malaysiaMetroSourcesFor=record=>dossiers.sources.filter(s=>[...record.sections,...record.timeline].some(part=>part.source_ids.includes(s.id)));
