import dossiers from '../data/south-asia-named-dossiers.json' with {type:'json'};
export const southAsiaDossiers=dossiers;
export const southAsiaProjects=dossiers.records.filter(r=>r.kind==='Project');
export const southAsiaPlaces=dossiers.records.filter(r=>r.kind==='Place');
export const southAsiaSourcesFor=record=>dossiers.sources.filter(s=>[...record.sections,...record.timeline].some(part=>part.source_ids.includes(s.id)));
