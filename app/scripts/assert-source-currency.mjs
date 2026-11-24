import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import {readFileSync, readdirSync} from 'node:fs';
import {dirname, resolve, join} from 'node:path';
import {fileURLToPath} from 'node:url';
import {calendarDay, assertSourceMonitoringPolicy, sourceCurrencyReport} from '../src/lib/source-currency.mjs';

const appRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const read = file => JSON.parse(readFileSync(join(appRoot,file),'utf8'));
const policy = read('src/data/source-monitoring-policy.json');
const sourceRoot = join(appRoot,'src/content/sources');
const sources = readdirSync(sourceRoot).filter(file=>file.endsWith('.json')).sort().map(file=>JSON.parse(readFileSync(join(sourceRoot,file),'utf8')));
const before = JSON.stringify(sources);
const policyBefore = JSON.stringify(policy);
assertSourceMonitoringPolicy(policy,sources);
assert.equal(policy.records.length,24);
const incomplete = sources.filter(source=>source.review_cadence_days == null && !source.source_owner).map(source=>source.id).sort();
assert.deepEqual(policy.records.map(record=>record.source_id).sort(),incomplete);
const currentDate = new Intl.DateTimeFormat('en-CA',{timeZone:'America/Edmonton',year:'numeric',month:'2-digit',day:'2-digit'}).format(new Date());
const report = sourceCurrencyReport(sources,policy,currentDate);
assert.equal(report.raw_counts.sources,sources.length);
assert.equal(report.raw_counts.missing_metadata,24);
assert.equal(report.counts.missing_metadata,0);
assert.equal(report.policy_resolutions.length,24);
assert.equal(report.counts.sources,report.counts.overdue+report.counts.missing_metadata+report.counts.within_declared_cadence);
assert.equal(report.raw_counts.sources,report.raw_counts.overdue+report.raw_counts.missing_metadata+report.raw_counts.within_declared_cadence);
assert.equal(report.changes_evidence_dates,false);
assert.equal(report.changes_gate_appointments,false);
assert.equal(report.network_retrieval_performed,false);
for(const row of report.policy_resolutions) {
  const original=sources.find(source=>source.id===row.id);
  assert.equal(row.last_checked_date,original.last_checked_date);
  assert.equal(row.baseline.status,'Missing valid currency metadata');
  assert.equal(row.baseline.review_cadence_days,null);
  assert.equal(row.baseline.owner,null);
  assert.equal(row.policy_effective_date,'2026-11-22');
}
const earlier=sourceCurrencyReport(sources,policy,'2026-11-21');
assert.equal(earlier.policy_active,false);
assert.equal(earlier.policy_resolutions.length,0);
assert.deepEqual(earlier.counts,earlier.raw_counts);
assert.equal(JSON.stringify(sources),before);
assert.equal(JSON.stringify(policy),policyBefore);

const hash=value=>createHash('sha256').update(JSON.stringify(value)).digest('hex');
const fixture={id:'fixture-source',last_checked_date:'2024-02-01'};
const fixturePolicy={...structuredClone(policy),effective_date:'2024-01-01',records:[{source_id:fixture.id,input_sha256:hash(fixture),source_owner:'Fixture publisher',review_cadence_days:28,rationale:'Boundary fixture only'}]};
const fixtureReport=(date,source=fixture,p=fixturePolicy)=>sourceCurrencyReport([source],p,date);
assert.equal(fixtureReport('2024-02-29').policy_resolutions[0].status,'Within declared cadence');
assert.equal(fixtureReport('2024-03-01').policy_resolutions[0].status,'Cadence overdue');
assert.equal(fixtureReport('2024-03-01').policy_resolutions[0].metadata_due_date,'2024-02-29');
assert.equal(fixtureReport('2024-01-31').policy_resolutions[0].status,'Missing valid currency metadata');
assert.equal(fixtureReport('2024-01-31').policy_resolutions[0].reasons[0],'Inspection date is in the future');
for(const date of ['2026-02-29','2024-02-30','2026-13-01','2026-11-00','2026-1-01','2026-11-22T00:00:00Z','',null,20261122]) {
  assert.equal(calendarDay(date),null);
  assert.throws(()=>fixtureReport(date),/calendar date/);
}
assert.notEqual(calendarDay('2024-02-29'),null);
assert.throws(()=>fixtureReport('2024-03-01',{...fixture,last_checked_date:'2024-02-02'}),/Stale/);
assert.throws(()=>sourceCurrencyReport([fixture,fixture],fixturePolicy,'2024-03-01'),/Duplicate/);
const invalidDate={...fixture,last_checked_date:'2024-02-30'};
const invalidDatePolicy=structuredClone(fixturePolicy);
invalidDatePolicy.records[0].input_sha256=hash(invalidDate);
assert.equal(fixtureReport('2024-03-01',invalidDate,invalidDatePolicy).policy_resolutions[0].status,'Missing valid currency metadata');
let rejected=0;
const mutations=[
  p=>{p.schema_version='2';},
  p=>{p.effective_date='2024-02-30';},
  p=>{p.reviewer='';},
  p=>{p.authority='';},
  p=>{p.review_responsibility='';},
  p=>{p.source_owner_meaning='';},
  p=>{p.boundary='';},
  p=>{p.records=[];},
  p=>{p.records.push({...p.records[0]});},
  p=>{p.records[0].source_id='missing-source';},
  p=>{p.records[0].input_sha256='0'.repeat(64);},
  p=>{p.records[0].source_owner=' ';},
  p=>{p.records[0].rationale='';},
  p=>{p.records[0].last_checked_date='2024-03-01';},
  p=>{p.records[0].next_review_date='2024-03-01';},
  ...[0,-1,0.5,'30',null,Infinity,3651].map(value=>p=>{p.records[0].review_cadence_days=value;}),
  ...['network_retrieval_performed','changes_evidence_dates','changes_gate_appointments','creates_automation','publication_authorized'].map(field=>p=>{p[field]=true;}),
];
for(const mutate of mutations){const p=structuredClone(fixturePolicy);mutate(p);assert.throws(()=>fixtureReport('2024-03-01',fixture,p));rejected++;}
for(const extra of [{source_owner:'Retained owner'},{review_cadence_days:30}]) {
  const changed={...fixture,...extra},p=structuredClone(fixturePolicy);
  p.records[0].input_sha256=hash(changed);
  assert.throws(()=>fixtureReport('2024-03-01',changed,p),/only fill missing/);
  rejected++;
}
for(const cadence of [0,-3,1.2,'30',null,3651]) {
  const additional={id:'unoverridden-source',last_checked_date:'2024-02-01',source_owner:'Retained publisher',review_cadence_days:cadence};
  const result=sourceCurrencyReport([fixture,additional],fixturePolicy,'2024-03-01');
  assert.equal(result.records.find(row=>row.id===additional.id).status,'Missing valid currency metadata');
}
const missingOwner={id:'missing-owner',last_checked_date:'2024-02-01',review_cadence_days:28};
assert.equal(sourceCurrencyReport([fixture,missingOwner],fixturePolicy,'2024-03-01').records.find(row=>row.id===missingOwner.id).status,'Missing valid currency metadata');
console.log(`Source-currency assertions passed: 24 pinned metadata resolutions; original dates intact; ${sources.length} profiles; ${rejected} invalid policies rejected plus calendar, future-date, stale-input, owner and cadence fixtures. No endpoint or claim-currency acceptance.`);

