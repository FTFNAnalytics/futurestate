import dossiers from '../data/korea-energy-cities-named-dossiers.json' with {type:'json'};
export const koreaEnergyCitiesDossiers=dossiers;
export const koreaEnergyCitiesProjects=dossiers.records.filter(r=>r.kind==='Project');
export const koreaEnergyCitiesPlaces=dossiers.records.filter(r=>r.kind==='Place');
export const koreaEnergyCitiesSourcesFor=record=>dossiers.sources.filter(s=>[...record.sections,...record.timeline].some(part=>part.source_ids.includes(s.id)));
