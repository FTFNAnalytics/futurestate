import dossiers from '../data/north-sea-named-dossiers.json' with {type:'json'};
export const northSeaDossiers=dossiers;
export const northSeaProjects=dossiers.records.filter(r=>r.kind==='Project');
export const northSeaPlaces=dossiers.records.filter(r=>r.kind==='Place');
export const northSeaSourcesFor=record=>dossiers.sources.filter(s=>[...record.sections,...record.timeline].some(part=>part.source_ids.includes(s.id)));
export const northSeaAcquisitionFor=id=>dossiers.records.find(r=>r.historical_acquisition.record_id===id);
export const northSeaAcquisitionPathsFor=record=>[record.historical_acquisition.route,`/reference/${record.kind==='Project'?'international-projects':'global-places-ii'}/${record.historical_acquisition.route.split('/').filter(Boolean).at(-1)}/`];
