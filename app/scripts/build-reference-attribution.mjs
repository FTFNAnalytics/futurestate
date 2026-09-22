import {readFile,writeFile,mkdir} from 'node:fs/promises';
import {createHash} from 'node:crypto';
import {fileURLToPath} from 'node:url';
import {join,resolve} from 'node:path';
import reviews, {attributionTranches} from './content-205-216/reference-attribution-inputs.mjs';
const root=fileURLToPath(new URL('../',import.meta.url));
const hash=value=>createHash('sha256').update(value).digest('hex');
const records=[],documents=new Map();
// Validate the entire reviewed input before emitting derived projections. Never
// reset a review pin or let changed source text inherit an old classification.
for(const review of reviews.records){
  const path=resolve(root,'src/content',review.source_file);
  if(!path.startsWith(resolve(root,'src/content')+'/')&&!path.startsWith(resolve(root,'src/content')+'\\'))throw Error('Invalid input path');
  const raw=await readFile(path,'utf8');
  if(hash(raw)!==review.reviewed_source_sha256)throw Error(`Attribution review is stale: ${review.id}`);
  let prior;
  if(review.record_kind==='research_document'){
    const data=JSON.parse(raw);
    if(data.id!==review.id)throw Error(`Attribution identity mismatch: ${review.id}`);
    if(data.local_capture_path!==review.historical_download.path||hash(await readFile(join(root,'public',data.local_capture_path),'utf8'))!==review.historical_download.sha256)throw Error(`Historical download changed: ${review.id}`);
    prior=Object.fromEntries(Object.keys(review.correction).map(key=>[key,data[key]]));
    documents.set(data.id,data);
  }else if(review.record_kind==='briefing'){
    if(!raw.includes(`id: "${review.id}"`))throw Error('Briefing identity mismatch');
    prior=Object.fromEntries(Object.keys(review.correction).map(key=>{
      const scalar=raw.match(new RegExp(`^${key}: "([^\\n]*)"`,'m'))?.[1];
      if(scalar!==undefined)return [key,scalar];
      const block=raw.match(new RegExp(`^${key}:\\r?\\n((?:  - [^\\n]+\\r?\\n)+)`,'m'))?.[1];
      if(!block)throw Error(`Missing prior briefing field ${key}`);
      return [key,[...block.matchAll(/  - "(.*)"/g)].map(match=>match[1])];
    }));
  }else throw Error(`Unknown attribution kind ${review.record_kind}`);
  records.push({...review,prior});
}
if(new Set(records.map(r=>r.id)).size!==records.length)throw Error('Duplicate review identity');
await writeFile(join(root,'src/data/phase-206-reference-attribution.json'),JSON.stringify({...reviews,records},null,2)+'\n');
const {createReferenceAttribution,attributionLinkText}=await import('../src/lib/reference-attribution.mjs');
const projection=createReferenceAttribution(records);
for(const[id,data]of documents){
  const current=projection.project({data},'research_document').data;
  const date=current.editorial_attribution.review_date;
  const directory=join(root,`public/downloads/editorial-attribution-${date}`);
  const expected=`/downloads/editorial-attribution-${date}/${id}.txt`;
  if(current.local_capture_path!==expected)throw Error(`Unexpected current link destination: ${id}`);
  await mkdir(directory,{recursive:true});
  await writeFile(join(directory,`${id}.txt`),attributionLinkText(current));
}
// The earlier correction is an immutable dated input. Only derive the new tranche.
for(const tranche of attributionTranches.filter(t=>t.key==='57x')){
 const update={id:tranche.update_id,effective_date:tranche.reviews.as_of_date,entry_type:'Correction',title:'63 more research records and Research Watch 054 now distinguish FTFN authorship',summary:'The Phase 57X collection contains 54 FTFN method/test records and nine historical dockets, not agency-authored technical reports. Corrected headlines, claims, metadata and link downloads preserve the original identities, August 10 dates, source links, publication states and archive.',affected_record_ids:tranche.reviews.records.map(r=>r.id),related_paths:[`/research/${tranche.collection_slug}/`,`/briefings/${tranche.briefing_slug}/`,...tranche.reviews.records.filter(r=>r.record_kind==='research_document').map(r=>`/research/documents/${r.id.replace(/^research-doc-/,'')}/`),'/data/research.json','/data/shelves/documents.json'],evidence_note:'Attribution review only. The historical account reports 1,593 synthetic cases; those tests were not rerun. Real audits, production vulnerabilities, appeals, reader migrations, operating outcomes and evidence absence are not established. Later official-source decisions remain separate.',receipt_id:'206-ATTRIBUTION-57X-2026-09-15',receipt_type:'Correction',materiality:'Correction',publication_effect:'Current authorship and claim wording corrected; historical publication states and source dates unchanged. Independent review, production validation and release remain held.',work_package:'docs/work-packages/phase-206-editorial-classification-and-claim-integrity.md'};
 await writeFile(join(root,`src/content/updates/${tranche.update_id.replace(/^update-/,'')}.json`),JSON.stringify(update,null,2)+'\n');
}
console.log(`${documents.size} research documents and ${records.length-documents.size} briefing attribution reviews projected; original records/downloads preserved. No external refresh or release approval.`);
