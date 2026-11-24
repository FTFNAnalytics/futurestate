import dossiers from '../data/auckland-named-dossiers.json' with {type:'json'};
export const aucklandDossiers=dossiers;
export const aucklandProjects=dossiers.records.filter(r=>r.kind==='Project');
export const aucklandPlaces=dossiers.records.filter(r=>r.kind==='Place');
export const aucklandSourcesFor=record=>dossiers.sources.filter(s=>[...record.sections,...record.timeline].some(part=>part.source_ids.includes(s.id)));
export const aucklandAcquisitionFor=id=>dossiers.records.find(r=>r.historical_acquisition.record_id===id);
export const aucklandAcquisitionPathsFor=record=>[record.historical_acquisition.route,`/reference/${record.kind==='Project'?'international-projects':'global-places-ii'}/${record.historical_acquisition.route.split('/').filter(Boolean).at(-1)}/`];
