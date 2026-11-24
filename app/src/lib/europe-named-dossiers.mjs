import dossiers from '../data/europe-named-dossiers.json' with {type:'json'};
export const europeDossiers=dossiers;
export const europeProjects=dossiers.records.filter(r=>r.kind==='Project');
export const europePlaces=dossiers.records.filter(r=>r.kind==='Place');
export const europeSourcesFor=record=>dossiers.sources.filter(s=>[...record.sections,...record.timeline].some(part=>part.source_ids.includes(s.id)));
