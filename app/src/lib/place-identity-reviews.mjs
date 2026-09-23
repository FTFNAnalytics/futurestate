import reviews from '../data/place-identity-reviews.json' with {type:'json'};
import history from '../data/phase-178-systems-atlas-and-compendium-depth-expansion.json' with {type:'json'};

const byId = new Map(reviews.records.map(r => [r.record_id, r]));
const recordId = r => r?.place_system_dossier_id ?? r?.comparison_overlay_id ?? r?.interpretive_essay_id;
const originals = new Map([...history.place_system_dossiers, ...history.comparison_overlays, ...history.interpretive_essays]
  .map(r => [recordId(r), r]));

// Exact historical ID and route only. Similar names and arbitrary dossier_ids
// do not transfer an identity finding to another place or project.
/** @param {any} record @returns {typeof reviews.records} */
export function placeIdentityNotes(record) {
  const original = originals.get(recordId(record));
  if (!original || record.route !== original.route) return [];
  return (original.dossier_ids ?? [recordId(original)]).map(id => byId.get(id)).filter(Boolean);
}
export function placeIdentityTitle(record) {
  return placeIdentityNotes(record).find(r => r.record_id === recordId(record))?.current_title ?? null;
}
export const placeIdentityReview = reviews;
