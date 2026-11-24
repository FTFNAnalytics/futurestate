import dossiers from '../data/kenya-corridor-named-dossiers.json' with {type:'json'};
export const kenyaCorridorDossiers=dossiers;
export const kenyaCorridorProjects=dossiers.records.filter(r=>r.kind==='Project');
export const kenyaCorridorPlaces=dossiers.records.filter(r=>r.kind==='Place');
export const kenyaCorridorSourcesFor=record=>dossiers.sources.filter(s=>[...record.sections,...record.timeline].some(part=>part.source_ids.includes(s.id)));
