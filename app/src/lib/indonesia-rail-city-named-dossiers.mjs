import dossiers from '../data/indonesia-rail-city-named-dossiers.json' with {type:'json'};
export const indonesiaRailCityDossiers=dossiers;
export const indonesiaRailCityProjects=dossiers.records.filter(r=>r.kind==='Project');
export const indonesiaRailCityPlaces=dossiers.records.filter(r=>r.kind==='Place');
export const indonesiaRailCitySourcesFor=record=>dossiers.sources.filter(s=>[...record.sections,...record.timeline].some(part=>part.source_ids.includes(s.id)));
