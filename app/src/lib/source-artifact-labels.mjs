import labels from '../data/source-artifact-labels.json' with {type:'json'};

/** @param {typeof labels.records[number]} review */
export const artifactLabelMetadata=review=>({...structuredClone(review),review_date:labels.review_date,update_id:labels.update_id,source_check:structuredClone(labels.source_checks.find(c=>c.id===review.source_check_id)),boundary:labels.boundary,independent_review_complete:false,publication_authorized:false,evidence_decision_created:false});

// This narrow projection changes an artifact-type label, not record authorship,
// evidence content, publication state, dates or the preserved download.
export function createArtifactLabelProjection(records) {
  const byId=new Map();
  for(const input of records){
    const r=structuredClone(input);
    if(byId.has(r.id))throw Error(`Duplicate artifact-label identity: ${r.id}`);
    if(!/^[a-f0-9]{64}$/.test(r.source_sha256)||r.original_document_type!=='Technical Report'||!['Company webpage','Local Government Record'].includes(r.current_document_type)||!labels.source_checks.some(c=>c.id===r.source_check_id&&c.url===r.official_url&&c.source_kind===r.current_document_type))throw Error(`Invalid artifact-label review: ${r.id}`);
    byId.set(r.id,r);
  }
  return {
    /** @template {{data:{id:string}}} T @param {T} entry
     * @returns {T & {data:T['data'] & {source_artifact_label?:ReturnType<typeof artifactLabelMetadata>}}} */
    project(entry){
      const r=byId.get(entry.data.id);if(!r)return entry;
      const data=entry.data;
      if(data.editorial_attribution)throw Error(`Resolve overlapping authorship and type reviews explicitly: ${r.id}`);
      if(data.official_url!==r.official_url||data.publisher!==r.publisher||data.local_capture_path!==r.historical_download.path)throw Error(`Artifact-label identity drift: ${r.id}`);
      if(data.source_artifact_label&&JSON.stringify(data.source_artifact_label)!==JSON.stringify(artifactLabelMetadata(r)))throw Error(`Artifact-label review metadata drift: ${r.id}`);
      const expected=data.source_artifact_label?r.current_document_type:r.original_document_type;
      if(data.document_type!==expected)throw Error(`Artifact-label input type drift: ${r.id}`);
      return {...entry,data:{...data,document_type:r.current_document_type,source_artifact_label:artifactLabelMetadata(r)}};
    }
  };
}
const projection=createArtifactLabelProjection(labels.records);
/** @template {{data:{id:string}}} T @param {T} entry */
export const projectArtifactLabel=entry=>projection.project(entry);
export const artifactLabelSourceCheck=id=>labels.source_checks.find(r=>r.id===id);
export const artifactLabelReviewDate=labels.review_date;
export const artifactLabelUpdateId=labels.update_id;
