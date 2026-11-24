import dossiers from '../data/andes-metro-city-named-dossiers.json' with {type:'json'};
export const andesMetroCityDossiers=dossiers;
export const andesMetroCityProjects=dossiers.records.filter(r=>r.kind==='Project');
export const andesMetroCityPlaces=dossiers.records.filter(r=>r.kind==='Place');
export const andesMetroCitySourcesFor=record=>dossiers.sources.filter(s=>[...record.sections,...record.timeline].some(part=>part.source_ids.includes(s.id)));
