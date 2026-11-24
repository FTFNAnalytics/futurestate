import dossiers from '../data/morocco-corridor-named-dossiers.json' with {type:'json'};
export const moroccoCorridorDossiers=dossiers;
export const moroccoCorridorProjects=dossiers.records.filter(r=>r.kind==='Project');
export const moroccoCorridorPlaces=dossiers.records.filter(r=>r.kind==='Place');
export const moroccoCorridorSourcesFor=record=>dossiers.sources.filter(s=>[...record.sections,...record.timeline].some(part=>part.source_ids.includes(s.id)));
