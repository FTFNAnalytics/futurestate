import dossiers from '../data/locality-dossiers.json' with {type:'json'};
import history from '../data/phase-178-systems-atlas-and-compendium-depth-expansion.json' with {type:'json'};
const originals=new Map(history.place_system_dossiers.map(r=>[r.place_system_dossier_id,r]));
const articles=new Map(dossiers.records.map(r=>[r.record_id,r]));
/** Current text belongs only to the exact historical dossier, never a comparison or similar name. */
export function localityDossierFor(record){
 const original=originals.get(record?.place_system_dossier_id);
 if(!original||record.route!==original.route||JSON.stringify(record)!==JSON.stringify(original))return null;
 return articles.get(original.place_system_dossier_id)??null;
}
export const localityDossiers=dossiers;
/** @param {(typeof dossiers.records)[number]} record */
export function localityConnections(record){
 return record.related_record_ids.map(id=>{
  const related=articles.get(id);
  if(!related||related.record_id===record.record_id)throw Error(`Invalid locality relationship: ${record.record_id}/${id}`);
  return related;
 });
}
