import dossiers from '../data/chile-named-dossiers.json' with {type:'json'};
export const chileDossiers=dossiers;
export const chileProjects=dossiers.records.filter(r=>r.kind==='Project');
export const chilePlaces=dossiers.records.filter(r=>r.kind==='Place');
export const chileSourcesFor=record=>dossiers.sources.filter(s=>[...record.sections,...record.timeline].some(part=>part.source_ids.includes(s.id)));
export const chileAcquisitionFor=id=>dossiers.records.find(r=>r.historical_acquisition.record_id===id);
export const chileAcquisitionPathsFor=record=>[record.historical_acquisition.route,`/reference/${record.kind==='Project'?'international-projects':'global-places-ii'}/${record.historical_acquisition.route.split('/').filter(Boolean).at(-1)}/`];
