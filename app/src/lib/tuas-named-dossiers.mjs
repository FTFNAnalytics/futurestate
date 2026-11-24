import dossiers from '../data/tuas-named-dossiers.json' with {type:'json'};
export const tuasDossiers=dossiers;
export const tuasProjects=dossiers.records.filter(r=>r.kind==='Project');
export const tuasPlaces=dossiers.records.filter(r=>r.kind==='Place');
export const tuasSourcesFor=record=>dossiers.sources.filter(s=>[...record.sections,...record.timeline].some(part=>part.source_ids.includes(s.id)));
export const tuasAcquisitionFor=id=>dossiers.records.find(r=>r.historical_acquisition.record_id===id);
export const tuasAcquisitionPathsFor=record=>[record.historical_acquisition.route,`/reference/${record.kind==='Project'?'international-projects':'global-places-ii'}/${record.historical_acquisition.route.split('/').filter(Boolean).at(-1)}/`];
