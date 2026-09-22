import ledger from '../data/phase-206-reference-attribution.json' with {type:'json'};
import {projectArtifactLabel} from './source-artifact-labels.mjs';

const allowed = {
  research_document: new Set(['title','summary','publisher','document_type','capture_status','local_capture_path','key_findings','why_it_matters','ftfn_relevance','evidence_limits']),
  briefing: new Set(['title','summary','claim_scope','local_evidence_level','top_takeaways'])
};
export function createReferenceAttribution(records) {
  const byId = new Map();
  for (const input of records) {
    const record = structuredClone(input);
    if (byId.has(record.id)) throw new Error(`Duplicate attribution identity: ${record.id}`);
    if (!allowed[record.record_kind] || !record.correction || !Object.keys(record.correction).length) throw new Error(`Invalid attribution kind/correction: ${record.id}`);
    for (const [key,value] of Object.entries(record.correction)) {
      if (!allowed[record.record_kind].has(key)) throw new Error(`Attribution cannot override ${key}: ${record.id}`);
      const list = ['key_findings','ftfn_relevance','evidence_limits','top_takeaways'].includes(key);
      if (list ? !Array.isArray(value)||!value.length||value.some(v=>typeof v!=='string'||!v.trim()) : typeof value!=='string'||!value.trim()) throw new Error(`Invalid attribution field ${key}: ${record.id}`);
    }
    if (!/^\d{4}-\d{2}-\d{2}$/.test(record.review_date)||!/^[a-f0-9]{64}$/.test(record.reviewed_source_sha256)) throw new Error(`Missing dated input pin: ${record.id}`);
    byId.set(record.id,record);
  }
  return {
    review(id) { const value=byId.get(id);return value?structuredClone(value):undefined; },
    /**
     * @template {{data:{id:string}}} T
     * @param {T} entry
     * @param {'research_document'|'briefing'} kind
     * @returns {T & {data:T['data'] & {editorial_attribution?:typeof ledger.records[number]}}}
     */
    project(entry,kind) {
      const review=byId.get(entry.data.id);
      if (!review) return entry;
      if (review.record_kind!==kind) throw new Error(`Attribution kind mismatch: ${entry.data.id}`);
      return {...entry,data:{...entry.data,...structuredClone(review.correction),editorial_attribution:structuredClone(review)}};
    }
  };
}
const projection=createReferenceAttribution(ledger.records);
export const referenceAttribution=id=>projection.review(id);
export const referenceAttributionUpdateFor=id=>ledger.tranches?.find(t=>t.record_ids.includes(id))?.update_id ?? (projection.review(id)?'update-2026-09-14-reference-attribution-57y':null);
/** @template {{data:{id:string}}} T @param {T} entry */
export const projectResearchDocument=entry=>projectArtifactLabel(projection.project(entry,'research_document'));
/** @template {{data:{id:string}}} T @param {T} entry */
export const projectBriefing=entry=>projection.project(entry,'briefing');
export function attributionLinkText(data) {
  const review=data.editorial_attribution;
  if (!review) throw new Error(`Current link file needs attribution review: ${data.id}`);
  return [
    `Title: ${data.title}`,`Record author: ${data.publisher}`,`Record type: ${data.document_type}`,
    `FTFN record ID: ${data.id}`,`Historical record state: ${data.record_status}`,
    `Attribution reviewed: ${review.review_date}`,`Reviewed source SHA-256: ${review.reviewed_source_sha256}`,
    'This is an FTFN-authored link record, not a capture of the linked external document.',
    `Contextual source URL (not refreshed by classification): ${data.official_url}`,
    '',data.summary,'',...data.key_findings.map(v=>`- ${v}`),'',...data.evidence_limits.map(v=>`Boundary: ${v}`),
    '',`Prior title: ${review.prior.title}`,`Inherited publisher label (not authorship): ${review.inherited_publisher_label}`,
    `Historical link file: ${review.historical_download.path}`,
    `Historical link SHA-256: ${review.historical_download.sha256}`,
    `Canonical record: /research/documents/${data.slug}/`,'',
  ].join('\n');
}
