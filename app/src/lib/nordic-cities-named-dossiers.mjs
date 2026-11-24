import dossiers from '../data/nordic-cities-named-dossiers.json' with {type:'json'};
export const nordicCitiesDossiers=dossiers;
export const nordicCitiesProjects=dossiers.records.filter(r=>r.kind==='Project');
export const nordicCitiesPlaces=dossiers.records.filter(r=>r.kind==='Place');
export const nordicCitiesSourcesFor=record=>dossiers.sources.filter(s=>[...record.sections,...record.timeline].some(part=>part.source_ids.includes(s.id)));
export const nordicCitiesAcquisitionFor=id=>dossiers.records.find(r=>r.historical_acquisition?.record_id===id);
export const nordicCitiesAcquisitionPathsFor=record=>record.historical_acquisition?[record.historical_acquisition.route,`/reference/${record.kind==='Project'?'international-projects':'global-places-ii'}/${record.historical_acquisition.route.split('/').filter(Boolean).at(-1)}/`]:[];
