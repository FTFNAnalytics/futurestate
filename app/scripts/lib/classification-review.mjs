import {createHash} from 'node:crypto';

// A retained excerpt alone cannot validate a review when other claims have changed.
export function verifyClassifiedInput({id,body,excerpt,expectedHash}) {
  if(!/^[a-f0-9]{64}$/.test(expectedHash??''))throw new Error(`Missing reviewed-input hash: ${id}`);
  if(createHash('sha256').update(body).digest('hex')!==expectedHash)throw new Error(`Reviewed input changed; individual re-review required: ${id}`);
  if(excerpt&&!body.includes(excerpt))throw new Error(`Review excerpt changed: ${id}`);
}

// A mixed research docket may retain real dated source reviews. This projection
// cannot alter the receipts, historical publication state, dates or feed hold.
export function retainDocketSourceReviews({review,correction,receipts,body,reviewDate}) {
  const fields=['evidence_quality','verification_status','claim_scope','local_evidence_level'];
  const overrides=review.presentation_overrides;
  if(!/^\d{4}-\d{2}-\d{2}$/.test(reviewDate??'')||review.type!=='Research docket'||!review.review_scope||!correction||!overrides||
    Object.keys(overrides).length!==fields.length||fields.some(k=>typeof overrides[k]!=='string'||!overrides[k].trim()))throw new Error(`Invalid mixed-docket presentation: ${review.id}`);
  const references=review.retained_source_reviews;
  if(!Array.isArray(references)||!references.length||new Set(references.map(r=>r.receipt_id)).size!==references.length)throw new Error(`Missing or duplicate retained source receipts: ${review.id}`);
  const retained=references.map(ref=>{
    const matches=receipts.filter(r=>r.receipt_id===ref.receipt_id),receipt=matches[0];
    if(matches.length!==1||!receipt||!body.includes(ref.receipt_id)||!receipt.affected_record_ids?.includes(review.id)||
      !/^\d{4}-\d{2}-\d{2}$/.test(receipt.decision_date)||receipt.decision_date>reviewDate||
      !/^\d{4}-\d{2}-\d{2}$/.test(receipt.source_checked_date)||receipt.source_checked_date>receipt.decision_date||
      createHash('sha256').update(JSON.stringify(receipt)).digest('hex')!==ref.record_sha256)throw new Error(`Retained source receipt changed or unbound: ${ref.receipt_id}`);
    return {...ref,source_registry:'phase-58-change-receipts.json',decision_date:receipt.decision_date,source_checked_date:receipt.source_checked_date,decision_status:receipt.decision_status,review_boundary:'Retained dated source review; not refreshed by classification'};
  });
  return {correction:{...correction,...overrides},retained_source_reviews:retained};
}
