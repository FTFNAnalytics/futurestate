import dossiers from '../data/stockholm-named-dossiers.json' with {type:'json'};
export const stockholmDossiers=dossiers;
export const stockholmProjects=dossiers.records.filter(r=>r.kind==='Project');
export const stockholmPlaces=dossiers.records.filter(r=>r.kind==='Place');
export const stockholmSourcesFor=record=>dossiers.sources.filter(s=>[...record.sections,...record.timeline].some(part=>part.source_ids.includes(s.id)));
export const stockholmAcquisitionFor=id=>dossiers.records.find(r=>r.historical_acquisition.record_id===id);
export const stockholmAcquisitionPathsFor=record=>[record.historical_acquisition.route,`/reference/${record.kind==='Project'?'international-projects':'global-places-ii'}/${record.historical_acquisition.route.split('/').filter(Boolean).at(-1)}/`];
