import {createHash} from 'node:crypto';
import files from '../data/phase-61-project-conversion-registry.json' with {type:'json'};
import events from '../data/phase-62-conversion-event-ledgers.json' with {type:'json'};
import gates from '../data/phase-63-conversion-gate-calendar.json' with {type:'json'};
import matrix from '../data/phase-64-conversion-stage-matrix.json' with {type:'json'};
import atlas from '../data/phase-119-deep-project-place-atlas.json' with {type:'json'};
const hash=value=>createHash('sha256').update(JSON.stringify(value)).digest('hex');
const requireTrue=(ok,message)=>{if(!ok)throw Error('Canonical Waymo refresh: '+message);};
export const waymoRefreshContract={
  "id": "119-PROJECT-008",
  "canonical": "casebook-waymo-california-service",
  "route": "/atlas/projects/waymo-california-service/",
  "count": 1,
  "dates": [
    "2026-05-11",
    "2026-08-14",
    "2026-10-02",
    "2026-11-17",
    "2026-11-18"
  ],
  "sources": [
    "waymo-approval",
    "waymo-quarterly",
    "waymo-dmv",
    "waymo-safety",
    "waymo-release",
    "waymo-recall",
    "waymo-freeway-report"
  ]
};
const pins={
  "file": "11db4d6c69586f8e3b66ab55db6675358e106426ec0422722316802fb390b4ac",
  "events": "c0b57744bc31002d05d140b7cbd37a3103d65e230ff9a928c9d83424ed7b9f65",
  "gate": "7142eaf893027db9d1eb491213c55e60350de94ceef4acd7dcf847ec8068cce2",
  "matrix": "335344c12096aa28e7b5e2913cfe04dbca9050f9c97a08b96def4180a66b5b12"
};
export function validateWaymoRefresh(value,decision){
 const id='61-ADOPTION-WAYMO-CALIFORNIA',inputs={
  file:files.records.find(x=>x.file_id===id),
  events:events.events.filter(x=>x.file_id===id),
  gate:gates.gate_records.find(x=>x.file_id===id),
  matrix:matrix.file_rows.find(x=>x.file_id===id)
 };
 requireTrue(hash(decision.retained_waymo_inputs)===hash(pins),'retained governed input pins');
 for(const [k,v]of Object.entries(inputs))requireTrue(hash(v)===pins[k],'historical '+k);
 const r=value.records[11],source=id=>value.sources.find(s=>s.id===id),a=atlas.projects.find(x=>x.atlas_project_id===r.record_id);
 requireTrue(r.counting_note.includes('same one eligible')&&r.scope.includes('California is not the entire international Waymo fleet'),'identity and scope');
 requireTrue(r.decision_boundary.includes('Tier A')&&r.decision_boundary.includes('retains its governed Phase 61–64 conversion file')&&r.decision_boundary.includes('no bound Phase 60 cycle identity')&&!r.decision_boundary.includes('no governed'),'governed file, not new gate');
 requireTrue(r.retained_research.length===1,'historical notice');
 const old=r.retained_research[0];
 requireTrue(old.id===a.atlas_project_id&&old.checked_date===a.last_reviewed_date&&old.status===a.update_status&&old.route===a.routes.prior_casebook&&old.text.includes('without claiming that no public data exists')&&old.text.includes('historical inputs remain unchanged'),'historical date/status/scope');
 const required=[
  ['August 14','January filing, May supplement and August effective date','undated','Do not infer unrestricted freeway operation'],
  ['first three quarters of 2026','confidentiality redactions','content type was unsupported','not extracted by another route','not proof of an individual filing'],
  ['271.3 million','67.098 million','82.421 million','not paid rides, occupied miles or California-only totals','surface streets','not independently reproduced here','cannot settle freeway readiness'],
  ['October 2','CSV3 and CSV4','CSV1 and CSV2 unchanged','30270-13817','not a zero-injury finding','states and counties','newly calculated California rate'],
  ['May 11','April 20','does not establish today','secondary warning, not a verified order','statewide all-roads shutdown','Do not merge the flooding recall'],
  ['missing, withheld and documented-zero','compatible geography, time, vehicle/software version and exposure','not independent replication, formal series admission']
 ];
 for(let i=0;i<6;i++)for(const token of required[i])requireTrue(r.sections[i].text.includes(token),'section '+i+' boundary '+token);
 requireTrue(r.answer.includes('reported November freeway restriction')&&r.answer.includes('exact primary instrument remains unresolved'),'lead warning');
 requireTrue(r.timeline.at(-1).event.includes('publication date, not a verified order date'),'syndication is not order date');
 requireTrue(source('waymo-approval').publication_date==='2026-08-14'&&source('waymo-approval').effective_date==='2026-08-14'&&source('waymo-approval').original_filing_date==='2026-01-28'&&source('waymo-approval').supplement_filing_date==='2026-05-15','approval date roles');
 requireTrue(source('waymo-quarterly').updated_date==='2026-11-17'&&source('waymo-quarterly').reporting_start_date==='2026-07-01'&&source('waymo-quarterly').reporting_end_date==='2026-09-30'&&!source('waymo-quarterly').submission_date,'reporting dates');
 requireTrue(!source('waymo-dmv').publication_date&&!source('waymo-dmv').effective_date&&source('waymo-dmv').access==='HTML text inspected; map images not inspected','undated ODD not a map inspection');
 requireTrue(source('waymo-safety').data_end_date==='2026-06'&&source('waymo-safety').role==='Operator-authored retrospective analysis'&&source('waymo-safety').access==='HTML text inspected; linked CSVs not extracted','operator dataset scope');
 requireTrue(source('waymo-release').publication_date==='2026-10-02'&&source('waymo-release').preceding_release_date==='2026-09-24'&&source('waymo-release').data_end_date==='2026-06'&&source('waymo-release').sgo_release_date==='2026-08-17','revision date roles');
 requireTrue(source('waymo-recall').letter_date==='2026-05-11'&&source('waymo-recall').manufacturer_report_date==='2026-05-01'&&source('waymo-recall').interim_update_date==='2026-04-20'&&!source('waymo-recall').final_remedy_date,'recall is not completion');
 requireTrue(source('waymo-freeway-report').syndication_date==='2026-11-18'&&!source('waymo-freeway-report').effective_date&&source('waymo-freeway-report').role==='Secondary reported warning'&&source('waymo-freeway-report').boundary.includes('not primary-source verification'),'secondary authority and dates');
 for(const id of ['waymo-approval','waymo-release','waymo-recall','waymo-freeway-report'])requireTrue(source(id).access==='PDF text inspected; page-image inspection not completed','PDF inspection scope');
 requireTrue(source('waymo-quarterly').access==='HTML index inspected; linked ZIP archive not extracted','archive inspection scope');
 requireTrue(hash(value.sources.slice(58).map(s=>s.url))===hash(["https://www.cpuc.ca.gov/-/media/cpuc-website/divisions/consumer-protection-and-enforcement-division/documents/tlab/av-programs/waymo-al-4-disposition-letter-20260814.pdf","https://www.cpuc.ca.gov/regulatory-services/licensing/transportation-licensing-and-analysis-branch/autonomous-vehicle-programs/quarterly-reporting","https://www.dmv.ca.gov/portal/vehicle-industry-services/autonomous-vehicles/autonomous-vehicle-testing-permit-holders/waymo-approved-areas-of-operation-for-driverless-testing-and-deployment/","https://waymo.com/safety/impact/","https://storage.googleapis.com/waymo-uploads/files/documents/safety/safety-impact-data/Waymo_Safety_Impact_Data_Hub_Release_Notes_20261002.pdf","https://static.nhtsa.gov/odi/rcl/2026/RCAK-26E026-9973.pdf","https://techxplore.com/news/2026-11-waymo-driverless-taxi-freeways-california.pdf"]),'exact source URLs');
 requireTrue(r.access_limits.length===1&&r.access_limits[0].url==="https://www.cpuc.ca.gov/-/media/cpuc-website/divisions/consumer-protection-and-enforcement-division/documents/tlab/av-programs/waymo-deployment-2026q3.zip"&&r.access_limits[0].inspection_date===value.review_date&&r.access_limits[0].result.includes('unsupported application/x-zip-compressed'),'exact archive limit');
}
