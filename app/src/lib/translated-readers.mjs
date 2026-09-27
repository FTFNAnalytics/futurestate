import {createHash} from 'node:crypto';
import translations from '../data/ai-reviewed-translations.json' with {type:'json'};
import readers from '../data/phase-204-reader-completion.json' with {type:'json'};
import editions from '../data/phase-202-accessible-multilingual-low-bandwidth-editions.json' with {type:'json'};
import policy from '../data/build-review-policy.json' with {type:'json'};

const hash=value=>createHash('sha256').update(JSON.stringify(value)).digest('hex');
// An old contract is provenance, not the translated source. Fail closed if the
// accepted English record, translated text or historical contract changes.
export function validateTranslatedReader(record, english, contract) {
  const {sha256,...body}=record;
  if(hash(body)!==sha256)throw Error(`Translation record drift: ${record.record_id}`);
  if(!english||english.record_id!==record.source_record_id||hash(english)!==record.source_record_sha256)throw Error(`Translation English source drift: ${record.record_id}`);
  if(!contract||contract.edition_contract_id!==record.record_id||hash(contract)!==record.historical_contract.record_sha256)throw Error(`Translation historical contract drift: ${record.record_id}`);
  if(!['fr-CA','es-419'].includes(record.locale)||!record.reviewer.startsWith('Codex (AI')||record.human_review_claimed!==false||record.source_retrieval_performed!==false||record.publication_authorized!==false)throw Error(`Translation review boundary invalid: ${record.record_id}`);
  if(record.evidence_cutoff!==english.inherited_as_of_date||record.source_authored_date!==english.authored_date||JSON.stringify(record.source_ids)!==JSON.stringify(english.source_ids)||record.sections.length!==english.sections.length)throw Error(`Translation source mapping invalid: ${record.record_id}`);
  return record;
}
if(translations.policy_id!==policy.policy_id||policy.human_review_required!==false)throw Error('Translation review policy mismatch');
export const translatedReaders=translations.records.map(record=>validateTranslatedReader(record,readers.records.find(r=>r.record_id===record.source_record_id),editions.edition_contracts.find(r=>r.edition_contract_id===record.record_id)));
export const translationForContract=id=>translatedReaders.find(r=>r.record_id===id)??null;
export function translationsForEnglish(id){
  const contract=editions.edition_contracts.find(r=>r.edition_contract_id===id);
  return contract&&!contract.is_translation?translatedReaders.filter(r=>r.topic_id===contract.topic_id):[];
}
