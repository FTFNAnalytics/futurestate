import dossiers from '../data/ruhr-water-city-named-dossiers.json' with {type:'json'};
export const ruhrWaterCityDossiers=dossiers;
export const ruhrWaterCityProjects=dossiers.records.filter(r=>r.kind==='Project');
export const ruhrWaterCityPlaces=dossiers.records.filter(r=>r.kind==='Place');
export const ruhrWaterCitySourcesFor=record=>dossiers.sources.filter(s=>[...record.sections,...record.timeline].some(part=>part.source_ids.includes(s.id)));
