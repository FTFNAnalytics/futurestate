import dossiers from '../data/senegal-mobility-energy-named-dossiers.json' with {type:'json'};
export const senegalMobilityEnergyDossiers=dossiers;
export const senegalMobilityEnergyProjects=dossiers.records.filter(r=>r.kind==='Project');
export const senegalMobilityEnergyPlaces=dossiers.records.filter(r=>r.kind==='Place');
export const senegalMobilityEnergySourcesFor=record=>dossiers.sources.filter(s=>[...record.sections,...record.timeline].some(part=>part.source_ids.includes(s.id)));
