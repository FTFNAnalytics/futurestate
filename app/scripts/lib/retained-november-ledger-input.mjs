import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
const retainedPath='src/data/phase-60-current-decisions.json';
const retainedSha256='3d39efa26c08b1964c13f212849569e00504ac2b191ccc256b5ad9fcab634b63';
const hash=text=>createHash('sha256').update(text).digest('hex');
// Only the exact reviewed November 21 whole-ledger pin is projected. Every
// other input remains a byte-for-byte check; original review files never change.
export function retainedNovemberLedgerInput(pin,raw){
 if(pin.path!==retainedPath||pin.sha256!==retainedSha256)return raw;
 const ledger=JSON.parse(raw),receipts=ledger.receipts.filter(r=>r.decision_date<='2026-11-21');
 assert.equal(receipts.length,21,'Exact assessed ledger cohort required');
 const retained=JSON.stringify({...ledger,as_of_date:'2026-11-21',receipts},null,2)+'\n';
 assert.equal(hash(retained),retainedSha256,'Earlier receipt or ledger metadata changed');
 return retained;
}
