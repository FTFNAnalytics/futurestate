import {readFile,readdir} from 'node:fs/promises';
import {createHash} from 'node:crypto';
import {fileURLToPath} from 'node:url';
import {join} from 'node:path';
import dispositions from './content-205-216/reference-attribution-screen-dispositions.json' with {type:'json'};
import {attributionScreenDisposition} from './lib/attribution-screen-disposition.mjs';

// Read-only triage, never a classification, approval, exclusion or source check.
// Terms such as "fixtures" also describe real manufacturing equipment. Entire
// collections need review when a defect is confirmed; non-matches are not cleared.
const root=fileURLToPath(new URL('../',import.meta.url));
const hash=s=>createHash('sha256').update(s).digest('hex');
const ledgerRaw=await readFile(join(root,'src/data/phase-206-reference-attribution.json'),'utf8');
const ledger=JSON.parse(ledgerRaw),reviewed=new Set(ledger.records.map(r=>r.id));
const rule='synthetic|fixture|harness|rehearsal|non-coercive|intake|field.{0,8}mapping|reopening|workflow';
const pattern=new RegExp(rule,'i'),candidates=[];let unreviewed=0,total=0;
for(const file of (await readdir(join(root,'src/content/research-documents'))).filter(f=>f.endsWith('.json')).sort()){
 const source_file=`research-documents/${file}`,raw=await readFile(join(root,'src/content',source_file),'utf8'),d=JSON.parse(raw);total++;
 if(reviewed.has(d.id))continue;unreviewed++;
 const fields={title:d.title,summary:d.summary,key_findings:d.key_findings};
 const matched_fields=Object.entries(fields).filter(([,value])=>pattern.test(Array.isArray(value)?value.join(' '):value??'')).map(([key])=>key);
 if(!matched_fields.length)continue;
 candidates.push({id:d.id,source_file,source_sha256:hash(raw),collection_id:d.collection_id,title:d.title,publisher:d.publisher,record_status:d.record_status,matched_fields,screen_state:'Candidate only — individual attribution review required'});
}
const collections=[...new Set(candidates.map(r=>r.collection_id))].map(collection_id=>({collection_id,screen_matches:candidates.filter(r=>r.collection_id===collection_id).length}));
for(const c of candidates){const decision=attributionScreenDisposition(c,dispositions.records,ledger.as_of_date);if(decision){c.screen_disposition=decision;c.screen_state='Narrow screen match reviewed — not full attribution or claim clearance';}}
console.log(JSON.stringify({schema_version:'1.1',report_kind:'Read-only lexical triage of unreviewed research documents',basis_ledger_sha256:hash(ledgerRaw),total_documents:total,reviewed_documents:total-unreviewed,unreviewed_documents:unreviewed,matched_documents:candidates.length,matched_with_narrow_disposition:candidates.filter(c=>c.screen_disposition).length,unresolved_screen_matches:candidates.filter(c=>!c.screen_disposition).length,screen_rule:rule,screened_fields:['title','summary','key_findings'],boundary:'Matches are review candidates, not verdicts. Non-matches and narrowly dispositioned matches are not fully cleared. No content, status, feed, approval or launch scope changes. Briefings are not screened by this report. Changed input text does not inherit an old disposition.',collections,candidates},null,2));
