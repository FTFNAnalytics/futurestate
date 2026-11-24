import dossiers from '../data/kigali-city-named-dossiers.json' with {type:'json'};
export const kigaliCityDossiers=dossiers;
export const kigaliCityPlaces=dossiers.records.filter(r=>r.kind==='Place');
export const kigaliCitySourcesFor=record=>dossiers.sources.filter(s=>[...record.sections,...record.timeline].some(part=>part.source_ids.includes(s.id)));
