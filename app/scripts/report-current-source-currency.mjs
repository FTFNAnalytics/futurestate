import {readdir,readFile} from 'node:fs/promises';
import {dirname,resolve,join} from 'node:path';import {fileURLToPath}from'node:url';
const root=resolve(dirname(fileURLToPath(import.meta.url)),'../src/content/sources');
const date=new Intl.DateTimeFormat('en-CA',{timeZone:'America/Edmonton',year:'numeric',month:'2-digit',day:'2-digit'}).format(new Date());
const records=[];
for(const file of await readdir(root)){if(!file.endsWith('.json'))continue;const r=JSON.parse(await readFile(join(root,file),'utf8'));const days=Math.floor((Date.parse(date)-Date.parse(r.last_checked_date))/86400000);records.push({id:r.id,last_checked_date:r.last_checked_date,review_cadence_days:r.review_cadence_days??null,owner:r.source_owner??null,elapsed_days:Number.isFinite(days)?days:null,status:!Number.isFinite(days)||!Number.isInteger(r.review_cadence_days)?'Missing valid currency metadata':days>r.review_cadence_days?'Cadence overdue':'Within declared cadence'});}
console.log(JSON.stringify({as_of_date:date,scope:'Metadata cadence only. No network retrieval, source refresh or factual validity is inferred.',counts:{sources:records.length,overdue:records.filter(r=>r.status==='Cadence overdue').length,missing_metadata:records.filter(r=>r.status==='Missing valid currency metadata').length},records:records.filter(r=>r.status!=='Within declared cadence')},null,2));
