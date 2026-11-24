import {createHash} from 'node:crypto';
import translations from '../data/ai-reviewed-translations.json' with {type:'json'};
import readers from '../data/phase-204-reader-completion.json' with {type:'json'};
import editions from '../data/phase-202-accessible-multilingual-low-bandwidth-editions.json' with {type:'json'};
import policy from '../data/build-review-policy.json' with {type:'json'};

const hash=value=>createHash('sha256').update(JSON.stringify(value)).digest('hex');
const validDate=value=>typeof value==='string'&&/^\d{4}-\d{2}-\d{2}$/.test(value)&&Number.isFinite(new Date(value+'T00:00:00Z').valueOf())&&new Date(value+'T00:00:00Z').toISOString().slice(0,10)===value;
// An old contract is provenance, not the translated source. Fail closed if the
// accepted English record, translated text or historical contract changes.
export function validateTranslatedReader(record, english, contract) {
  const {sha256,...body}=record;
  if(hash(body)!==sha256)throw Error(`Translation record drift: ${record.record_id}`);
  if(!english||english.record_id!==record.source_record_id||hash(english)!==record.source_record_sha256)throw Error(`Translation English source drift: ${record.record_id}`);
  if(!contract||contract.edition_contract_id!==record.record_id||hash(contract)!==record.historical_contract.record_sha256)throw Error(`Translation historical contract drift: ${record.record_id}`);
  if(![`/reference/accessible-editions/${contract.slug}/`,contract.route.replace('/review/v1reference/','/reference/')].includes(record.historical_contract.route))throw Error(`Translation historical contract route drift: ${record.record_id}`);
  if(!['fr-CA','es-419'].includes(record.locale)||!record.reviewer.startsWith('Codex (AI')||record.human_review_claimed!==false||record.source_retrieval_performed!==false||record.publication_authorized!==false)throw Error(`Translation review boundary invalid: ${record.record_id}`);
  if(![record.evidence_cutoff,record.source_authored_date,record.ai_review_date,record.integration_date].every(validDate)||record.evidence_cutoff>record.source_authored_date||record.source_authored_date>record.ai_review_date||record.ai_review_date>record.integration_date)throw Error(`Translation chronology invalid: ${record.record_id}`);
  if(record.evidence_cutoff!==english.inherited_as_of_date||record.source_authored_date!==english.authored_date||JSON.stringify(record.source_ids)!==JSON.stringify(english.source_ids)||record.sections.length!==english.sections.length)throw Error(`Translation source mapping invalid: ${record.record_id}`);
  return record;
}
if(translations.policy_id!==policy.policy_id||policy.human_review_required!==false)throw Error('Translation review policy mismatch');
export const translatedReaders=translations.records.map(record=>validateTranslatedReader(record,readers.records.find(r=>r.record_id===record.source_record_id),editions.edition_contracts.find(r=>r.edition_contract_id===record.record_id)));
export const translationIntegrationDate=translatedReaders.map(r=>r.integration_date).sort().at(-1);
// Navigation correction is additive; pinned translations and assessment dates remain exact.
export function translationHistoricalContractRoute(record){
  const contract=editions.edition_contracts.find(r=>r.edition_contract_id===record.record_id);
  if(!contract)throw Error(`Missing translation contract route: ${record.record_id}`);
  return `/reference/accessible-editions/${contract.slug}/`;
}
export const translationContractNavigation=translatedReaders.filter(r=>r.historical_contract.route!==translationHistoricalContractRoute(r)).map(r=>({record_id:r.record_id,recorded_route:r.historical_contract.route,canonical_route:translationHistoricalContractRoute(r),corrected_date:'2026-11-23',boundary:'Navigation correction only; original translated text, assessment, integration and evidence dates are unchanged.'}));
export const translationForContract=id=>translatedReaders.find(r=>r.record_id===id)??null;
export function translationsForEnglish(id){
  const contract=editions.edition_contracts.find(r=>r.edition_contract_id===id);
  return contract&&!contract.is_translation?translatedReaders.filter(r=>r.topic_id===contract.topic_id):[];
}
