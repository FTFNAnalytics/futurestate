import dossiers from '../data/port-cities-named-dossiers.json' with {type:'json'};
export const portCitiesDossiers=dossiers;
export const portCitiesProjects=dossiers.records.filter(r=>r.kind==='Project');
export const portCitiesPlaces=dossiers.records.filter(r=>r.kind==='Place');
export const portCitiesSourcesFor=record=>dossiers.sources.filter(s=>[...record.sections,...record.timeline].some(part=>part.source_ids.includes(s.id)));
export const portCitiesAcquisitionFor=id=>dossiers.records.find(r=>r.historical_acquisition.record_id===id);
export const portCitiesAcquisitionPathsFor=record=>[record.historical_acquisition.route,`/reference/${record.kind==='Project'?'international-projects':'global-places-ii'}/${record.historical_acquisition.route.split('/').filter(Boolean).at(-1)}/`];
