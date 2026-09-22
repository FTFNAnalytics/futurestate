import readers from '../data/phase-204-reader-completion.json' with {type:'json'};
import current from '../data/phase-205-216-current-editorial.json' with {type:'json'};
import aggregate from '../data/v1-public-reference-edition.json' with {type:'json'};
// The older reader pack uses exact record bindings; routes are the preserved canonical map.
import monographs from '../data/phase-200-cross-system-constraint-monographs.json' with {type:'json'};
import editions from '../data/phase-202-accessible-multilingual-low-bandwidth-editions.json' with {type:'json'};
import report from '../data/phase-203-state-of-future-systems-2026.json' with {type:'json'};
const paths=new Map();
const editionModes=new Map(editions.edition_contracts.map(r=>[r.edition_contract_id,r.edition_mode]));
const visit=value=>{
  if(!value||typeof value!=='object')return;
  if(Array.isArray(value))return value.forEach(visit);
  const id=Object.entries(value).find(([k,v])=>k.endsWith('_id')&&typeof v==='string')?.[1];
  if(id&&value.route)paths.set(id,aggregate.canonical_route_map[value.route]??value.route);
  Object.values(value).forEach(visit);
};
[monographs,editions,report].forEach(visit);
export const readerCatalog=[
  ...current.records.map(r=>({id:r.record_id,title:r.title,summary:r.answer,kind:r.kind,route:r.route,date:r.updated_date??r.authored_date,status:r.review_status,...(r.identity_evidence?{identity_names:[r.identity_evidence.candidate_name,...r.identity_evidence.aliases,...(r.identity_evidence.identifier?[r.identity_evidence.identifier]:[])]}:{})})),
  ...readers.records.map(r=>({id:r.record_id,title:r.title,summary:r.overview,kind:editionModes.get(r.record_id)==='Low-bandwidth HTML edition'?'Compact':r.record_id.startsWith('202-')?'Plain English':r.record_id.startsWith('200-')?'Essay':'Report',route:paths.get(r.record_id),date:r.authored_date,status:r.review_status})),
];
if(readerCatalog.some(r=>!r.route||!r.route.startsWith('/')))throw new Error('Reader catalog has an unresolved route');
export {searchReaders} from './reader-search.mjs';
