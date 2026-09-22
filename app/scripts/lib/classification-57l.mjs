import {readFile} from 'node:fs/promises';
import {join} from 'node:path';
import {createHash} from 'node:crypto';
import pins from '../content-205-216/reference-attribution-57l-inputs.json' with {type:'json'};
import {signalReviews57l} from '../content-205-216/reference-attribution-57l-reviews.mjs';
import {verifyClassifiedInput} from './classification-review.mjs';

// Append a new dated tranche without rewriting the September 14 reviews.
export async function append57lClassifications(root,previous){
 const hash=s=>createHash('sha256').update(s).digest('hex');
 if(previous.length!==621||hash(JSON.stringify(previous))!==pins.previous_signal_records_hash)throw Error('Earlier signal classifications changed; preserve their dated review lineage');
 if(signalReviews57l.length!==29||new Set(signalReviews57l.map(r=>r.id)).size!==29)throw Error('Incomplete 57L signal review');
 const added=[];
 for(const review of signalReviews57l){
  const pin=pins.docs.find(p=>p.signal_file===review.source_file);
  if(!pin||previous.some(p=>p.id===review.id))throw Error('Unknown or duplicate 57L signal');
  const body=await readFile(join(root,'src/content/signals',review.source_file),'utf8');
  verifyClassifiedInput({id:review.id,body,excerpt:review.excerpt,expectedHash:pin.signal_sha256});
  const field=key=>body.match(new RegExp(`^${key}: "([^"]+)"`,'m'))?.[1];
  if(field('id')!==review.id)throw Error('57L signal identity mismatch');
  const prior=Object.fromEntries(['title','summary','evidence_quality','verification_status','signal_type','maturity_level','record_status','why_it_matters','claim_scope','local_evidence_level'].map(k=>[k,field(k)]));
  added.push({id:review.id,slug:field('slug'),source_file:review.source_file,source_sha256:pin.signal_sha256,action_date:pins.review_date,claim_review_complete:true,content_type:review.type,disposition:'Corrected current presentation; exclude from external-development feed',current_feed_eligible:false,reason:review.reason,prior,screening_basis:'Complete Phase 57L linked-signal review following confirmed research-document attribution defects',review_excerpt:review.excerpt,review_scope:'Individual headline, metadata and complete body classification with historical field, queue and playbook registries; not a fresh external verification or independent approval',reviewer:'Codex — editorial classification pass',reviewed_source_sha256:pin.signal_sha256,classification_review_date:pins.review_date,...(review.reopening_contract?{reopening_contract:review.reopening_contract}:{}),correction:{title:review.title,summary:review.summary,evidence_quality:'Internal FTFN record — not external outcome evidence',verification_status:'Editorial classification reviewed; external outcome not verified',signal_type:review.type,maturity_level:'Not an external maturity assessment',why_it_matters:review.reason,claim_scope:'Internal FTFN record',local_evidence_level:'Not local operating evidence'}});
 }
 return [...previous,...added];
}
