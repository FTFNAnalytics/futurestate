import dossiers from '../data/istanbul-crossings-named-dossiers.json' with {type:'json'};
export const istanbulCrossingsDossiers=dossiers;
export const istanbulCrossingsProjects=dossiers.records.filter(r=>r.kind==='Project');
export const istanbulCrossingsPlaces=dossiers.records.filter(r=>r.kind==='Place');
export const istanbulCrossingsSourcesFor=record=>dossiers.sources.filter(s=>[...record.sections,...record.timeline].some(part=>part.source_ids.includes(s.id)));
