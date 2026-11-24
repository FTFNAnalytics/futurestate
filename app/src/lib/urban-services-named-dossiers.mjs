import dossiers from '../data/urban-services-named-dossiers.json' with {type:'json'};
export const urbanServicesDossiers=dossiers;
export const urbanServicesProjects=dossiers.records.filter(r=>r.kind==='Project');
export const urbanServicesPlaces=dossiers.records.filter(r=>r.kind==='Place');
export const urbanServicesSourcesFor=record=>dossiers.sources.filter(s=>[...record.sections,...record.timeline].some(part=>part.source_ids.includes(s.id)));
export const urbanServicesAcquisitionFor=id=>dossiers.records.find(r=>r.historical_acquisition.record_id===id);
export const urbanServicesAcquisitionPathsFor=record=>[record.historical_acquisition.route,`/reference/${record.kind==='Project'?'international-projects':'global-places-ii'}/${record.historical_acquisition.route.split('/').filter(Boolean).at(-1)}/`];
