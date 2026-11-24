import dossiers from '../data/southern-africa-named-dossiers.json' with {type:'json'};
export const southernAfricaDossiers=dossiers;
export const southernAfricaProjects=dossiers.records.filter(r=>r.kind==='Project');
export const southernAfricaPlaces=dossiers.records.filter(r=>r.kind==='Place');
export const southernAfricaSourcesFor=record=>dossiers.sources.filter(s=>[...record.sections,...record.timeline].some(part=>part.source_ids.includes(s.id)));
