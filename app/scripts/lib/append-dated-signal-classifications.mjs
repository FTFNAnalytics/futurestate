import {readFile} from 'node:fs/promises';
import {createHash} from 'node:crypto';
import {join} from 'node:path';
import {verifyClassifiedInput} from './classification-review.mjs';

// Appends reviewed internal accounts only. This helper never classifies by a
// keyword, source organization or phase prefix, and cannot change old decisions.
export async function appendDatedSignalClassifications({root,previous,pins,reviews,screeningBasis,reviewScope}){
 const hash=s=>createHash('sha256').update(s).digest('hex');
 if(previous.length!==pins.previous_signal_count||hash(JSON.stringify(previous))!==pins.previous_signal_records_hash)throw Error('Earlier signal classifications changed; separate dated review required');
 if(!/^\d{4}-\d{2}-\d{2}$/.test(pins.review_date)||!screeningBasis||!reviewScope)throw Error('Missing dated review scope');
 // Older tranches have one signal per document; acquisition syntheses can
 // share a signal across several documents. Explicit signal pins count actual
 // signal identities rather than manufacturing one decision per document.
 const signalPins=pins.signal_pins??pins.docs.map(p=>({...p,signal_id:p.id.replace('research-doc-','signal-')}));
 if(!Array.isArray(signalPins)||reviews.length!==signalPins.length||new Set(signalPins.map(p=>p.signal_id)).size!==signalPins.length||new Set(signalPins.map(p=>p.signal_file)).size!==signalPins.length||new Set(reviews.map(r=>r.id)).size!==reviews.length)throw Error('Incomplete or duplicate appended signal reviews');
 const added=[];
 for(const review of reviews){
  const pin=signalPins.find(p=>p.signal_file===review.source_file);
  if(!pin||previous.some(p=>p.id===review.id)||!['FTFN analysis','Research docket','FTFN method/test note'].includes(review.type))throw Error('Unknown, duplicate or non-internal signal review');
  if(review.reviewed_source_sha256!==pin.signal_sha256||review.id!==pin.signal_id||review.source_file!==review.id+'.mdx')throw Error('Appended signal pin or identity mismatch');
  const raw=await readFile(join(root,'src/content/signals',review.source_file),'utf8');
  verifyClassifiedInput({id:review.id,body:raw,excerpt:review.excerpt,expectedHash:pin.signal_sha256});
  const captured=raw.match(/^captured_date: "?(\d{4}-\d{2}-\d{2})"?\r?$/m)?.[1];
  if(!captured||pins.review_date<captured)throw Error('Attribution review cannot predate the source record');
  if(['title','summary','reason','excerpt'].some(k=>typeof review[k]!=='string'||!review[k].trim()))throw Error('Incomplete authored signal correction');
  const field=key=>{const value=raw.match(new RegExp(`^${key}: ("(?:[^"\\\\]|\\\\.)*")$`,'m'))?.[1];if(!value)throw Error(`Missing quoted signal field: ${review.id}/${key}`);return JSON.parse(value);};
  if(field('id')!==review.id)throw Error('Appended signal identity mismatch');
  const prior=Object.fromEntries(['title','summary','evidence_quality','verification_status','signal_type','maturity_level','record_status','why_it_matters','claim_scope','local_evidence_level'].map(k=>[k,field(k)]));
  const extra={};
  if(review.receiving_systems!==undefined){
   if(!Array.isArray(review.receiving_systems)||!review.receiving_systems.length||review.receiving_systems.some(s=>typeof s!=='string'||!s.trim()))throw Error('Invalid receiving-system correction');
   const block=raw.match(/^receiving_systems:\r?\n((?:  - "[^\r\n]+"\r?\n)+)/m)?.[1];
   if(!block)throw Error('Missing original receiving systems');
   prior.receiving_systems=[...block.matchAll(/  - (".*")/g)].map(m=>JSON.parse(m[1]));
   extra.receiving_systems=[...review.receiving_systems];
  }
  added.push({id:review.id,slug:field('slug'),source_file:review.source_file,source_sha256:pin.signal_sha256,action_date:pins.review_date,claim_review_complete:true,content_type:review.type,disposition:'Corrected current presentation; exclude from external-development feed',current_feed_eligible:false,reason:review.reason,prior,screening_basis:screeningBasis,review_excerpt:review.excerpt,review_scope:reviewScope,reviewer:'Codex — editorial classification pass',reviewed_source_sha256:pin.signal_sha256,classification_review_date:pins.review_date,correction:{title:review.title,summary:review.summary,evidence_quality:'Internal FTFN record — not external outcome evidence',verification_status:'Editorial classification reviewed; external outcome not verified',signal_type:review.type,maturity_level:'Not an external maturity assessment',why_it_matters:review.reason,claim_scope:'Internal FTFN record',local_evidence_level:'Not local operating evidence',...extra}});
 }
 return [...previous,...added];
}
