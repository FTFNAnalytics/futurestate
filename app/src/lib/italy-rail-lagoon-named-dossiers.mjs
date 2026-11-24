import dossiers from '../data/italy-rail-lagoon-named-dossiers.json' with {type:'json'};
export const italyRailLagoonDossiers=dossiers;
export const italyRailLagoonProjects=dossiers.records.filter(r=>r.kind==='Project');
export const italyRailLagoonPlaces=dossiers.records.filter(r=>r.kind==='Place');
export const italyRailLagoonSourcesFor=record=>dossiers.sources.filter(s=>[...record.sections,...record.timeline].some(part=>part.source_ids.includes(s.id)));

