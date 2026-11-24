import dossiers from '../data/brazil-named-dossiers.json' with {type:'json'};
export const brazilDossiers=dossiers;
export const brazilProjects=dossiers.records.filter(r=>r.kind==='Project');
export const brazilPlaces=dossiers.records.filter(r=>r.kind==='Place');
export const brazilSourcesFor=record=>dossiers.sources.filter(s=>[...record.sections,...record.timeline].some(part=>part.source_ids.includes(s.id)));
export const brazilAcquisitionFor=id=>dossiers.records.find(r=>r.historical_acquisition.record_id===id);
export const brazilAcquisitionPathsFor=record=>[record.historical_acquisition.route,`/reference/${record.kind==='Project'?'international-projects':'global-places-ii'}/${record.historical_acquisition.route.split('/').filter(Boolean).at(-1)}/`];
