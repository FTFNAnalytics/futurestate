import dossiers from '../data/colombia-rail-named-dossiers.json' with {type:'json'};
export const colombiaRailDossiers=dossiers;
export const colombiaRailProjects=dossiers.records.filter(r=>r.kind==='Project');
export const colombiaRailPlaces=dossiers.records.filter(r=>r.kind==='Place');
export const colombiaRailSourcesFor=record=>dossiers.sources.filter(s=>[...record.sections,...record.timeline].some(part=>part.source_ids.includes(s.id)));
