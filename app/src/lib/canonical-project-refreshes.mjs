import {validateWaymoRefresh,waymoRefreshContract} from './canonical-waymo-refresh.mjs';
import {createHash} from 'node:crypto';
import {validateManufacturingRefreshes,manufacturingRefreshContracts} from './canonical-manufacturing-refreshes.mjs';
import data from '../data/canonical-project-refreshes.json' with {type:'json'};
import history from '../data/canonical-project-refresh-history.json' with {type:'json'};
import review from '../data/canonical-project-refresh-reviews.json' with {type:'json'};
import atlas from '../data/phase-119-deep-project-place-atlas.json' with {type:'json'};
import portfolio from '../data/portfolio-eligibility-decisions.json' with {type:'json'};
import operations from '../data/phase-207-current-operations.json' with {type:'json'};
import manateeHistory from '../data/phase-56j-evidence-value-continuation.json' with {type:'json'};
import gatewayHistory from '../data/phase-56c-entity-dossiers.json' with {type:'json'};
import aircraftDossiers from '../data/phase-56e-second-cohort-dossiers.json' with {type:'json'};
import aircraftAnnual from '../data/phase-56h-acquisition-and-deepening.json' with {type:'json'};
import aircraftFollowups from '../data/phase-56k-exact-record-continuation.json' with {type:'json'};
export const projectRefreshHash=value=>createHash('sha256').update(JSON.stringify(value)).digest('hex');
const requireTrue=(condition,message)=>{if(!condition)throw Error('Canonical project refresh: '+message);};
function validateF15Refresh(value,decision){
 requireTrue(value.schema_version==='1.0'&&value.review_date==='2026-11-22'&&decision.review_date===value.review_date,'schema/date');
 requireTrue(decision.policy_id==='OWNER-AUTHORIZED-AI-REVIEW-2026-09-25'&&decision.review_id==='CANONICAL-PROJECT-REFRESH-2026-11-22-F15EX','policy/identity');
 for(const field of ['human_review_claimed','independent_review_claimed','operating_outcomes_admitted','publication_authorized','launch_authorized','phase_216_complete'])requireTrue(decision[field]===false,field);
 requireTrue(decision.new_identity_count===0&&value.records.length===1&&decision.records.length===1,'count');
 const r=value.records[0],pin=decision.records[0];
 requireTrue(r.record_id==='119-PROJECT-016'&&r.canonical_id==='casebook-f15ex-production-delivery'&&r.kind==='Project'&&r.route==='/atlas/projects/f15ex-production-delivery/','exact route/identity');
 requireTrue(r.new_identity_count===0&&r.governed_stage_changed===false&&r.series_admitted===false&&r.retained_pilot_id==='160-PILOT-003','admission/count');
 requireTrue(r.sections.length===6&&r.timeline.length===5&&value.sources.length===4&&value.access_limits.length===3,'complete account');
 const sourceIds=['af-rebound','wing-ex16','af-lot7','boeing-lot7'];requireTrue(JSON.stringify(value.sources.map(s=>s.id))===JSON.stringify(sourceIds),'sources');
 requireTrue(value.sources.every(s=>s.inspection_date===value.review_date&&s.url.startsWith('https://')&&s.locator&&s.boundary&&s.access),'source metadata');
 requireTrue(value.sources[0].article_date==='2025-12-15'&&value.sources[0].posting_date==='2025-12-16','recovery dates');
 requireTrue(value.sources[1].publication_date==='2026-02-17'&&value.sources[1].event_date==='2025-12-11'&&value.sources[1].access.includes('video not viewed'),'arrival dates/access');
 requireTrue(value.sources[2].article_date==='2026-09-29'&&value.sources[2].posting_date==='2026-09-30'&&value.sources[3].publication_date==='2026-09-29','award dates');
 for(const part of [...r.sections,...r.timeline])requireTrue(part.source_ids.every(id=>sourceIds.includes(id)),'citation');
 requireTrue(JSON.stringify(r.timeline.map(t=>t.date))===JSON.stringify(['2025-08-04','2025-08-19','2025-11-16','2025-12-11','2026-09-29']),'event dates');
 requireTrue(r.sections[2].text.includes('editorial inference, not an issuer correction')&&r.sections[3].text.includes('target rate')&&r.sections[5].text.includes('documented zero from a missing month'),'measurement boundaries');
 const identity=atlas.projects.find(x=>x.atlas_project_id===r.record_id),eligibility=portfolio.canonical.find(x=>x.record_id===r.canonical_id);
 requireTrue(identity&&eligibility&&eligibility.eligible_count===1&&identity.routes.atlas===r.route&&eligibility.route===r.route,'retained identity');
 requireTrue(pin.record_id===r.record_id&&pin.atlas_record_sha256===projectRefreshHash(identity)&&pin.portfolio_decision_sha256===projectRefreshHash(eligibility),'retained identity hash');
 requireTrue(decision.pilot_sha256===projectRefreshHash(operations.pilot_reviews.filter(x=>x.entity_id===r.record_id))&&decision.pilot_followups_sha256===projectRefreshHash(operations.pilot_research_followups.filter(x=>x.entity_id===r.record_id)),'retained pilot decisions');
 requireTrue(pin.sha256===projectRefreshHash(r)&&decision.edition_sha256===projectRefreshHash(value),'exact reviewed text');
 return value;
}

const contracts=[
 {id:'119-PROJECT-016',canonical:'casebook-f15ex-production-delivery',route:'/atlas/projects/f15ex-production-delivery/',count:1,dates:['2025-08-04','2025-08-19','2025-11-16','2025-12-11','2026-09-29'],sources:['af-rebound','wing-ex16','af-lot7','boeing-lot7']},
 {id:'119-PROJECT-006',canonical:'casebook-gsa-pqc-adoption',route:'/atlas/projects/gsa-pqc-adoption/',count:0,dates:['2025-06','2026-08-12','2026-08-24','2026-09-22'],sources:['gsa-guide','gsa-acquisition','gsa-identity']},
 {id:'119-PROJECT-007',canonical:'casebook-nist-aria-assurance',route:'/atlas/projects/nist-aria-assurance/',count:1,dates:['2024-05','2025-09-30','2025-11-13'],sources:['aria-publication','aria-program','aria-report']},
 {id:'119-PROJECT-010',canonical:'casebook-moss-landing-battery-safety',route:'/atlas/projects/moss-landing-battery-safety/',count:1,dates:['2025-01-16','2025-07-17','2026-09-08','2026-09-18','2026-11-06','2026-11-12'],sources:['moss-epa-overview','moss-epa-timeline','moss-epa-september','moss-epa-final-phase','moss-vistra-q3','moss-vistra-updates']},
 {id:'119-PROJECT-009',canonical:'casebook-manatee-battery-storage',route:'/atlas/projects/manatee-battery-storage/',count:1,dates:['2021-01-28','2021-12-13','2026-04','2026-10-23','2026-11-09'],sources:['manatee-construction','manatee-commissioning','manatee-owner-overview','manatee-plan-2026','manatee-eia-index','manatee-smith-context']},
 {id:'119-PROJECT-011',canonical:'casebook-gateway-battery-storage',route:'/atlas/projects/gateway-battery-storage/',count:1,dates:['2020-08-19','2024-05-15','2024-11','2025-06-02','2025-07','2025-08-29','2025-11-20','2025-11-24'],sources:['gateway-commissioning','gateway-owner-fleet','gateway-epa-order','gateway-epa-profile','gateway-cpuc-index','gateway-cpuc-audit','gateway-owner-response','gateway-contract-resolution']},
 {id:"119-PROJECT-015",canonical:"casebook-f35-production-readiness",route:"/atlas/projects/f35-production-readiness/",count:1,dates:["2024-03","2025-05","2025-09-03","2026-01-07","2026-06-11","2026-09-27","2026-11-09"],sources:["f35-gao-production-2024","f35-gao-deliveries-2025","f35-gao-delivery-followup","f35-company-2025","f35-company-q3-2026","f35-gao-sustainment-2026","f35-gao-parts-2026"]},
 {id:"119-PROJECT-017",canonical:"casebook-kc46-readiness",route:"/atlas/projects/kc46-readiness/",count:1,dates:["2026-06-03","2026-06-10","2026-10-13","2026-10-27"],sources:["kc46-gao-report","kc46-gao-followup","kc46-rvs-testing","kc46-preliminary-q3","kc46-final-q3"]}
,...manufacturingRefreshContracts,waymoRefreshContract];
export function projectRefreshSources(record,edition=data){
 const ids=new Set([...record.sections,...record.timeline].flatMap(p=>p.source_ids));
 return edition.sources.filter(s=>ids.has(s.id));
}
export function projectRefreshAccessLimits(record,edition=data){
 return record.record_id==='119-PROJECT-016'?edition.access_limits:(record.access_limits??[]);
}
export function validateProjectRefreshes(value,decision=review){
 requireTrue(projectRefreshHash(history)==='45ea7c13befe5da6695c8a791ca31957410a55519165c8ebf652f0c33549edf5'&&decision.retained_history_sha256===projectRefreshHash(history),'retained history');
 const retained=history.editions[0],previous=history.editions[1],preceding=history.editions[2],latest=history.editions[3],six=history.editions[4],eight=history.editions[5],eleven=history.editions[6];
 requireTrue(projectRefreshHash({schema_version:history.schema_version,editions:history.editions.slice(0,6)})==='73a8ad5195be181e8948c832d86ac2da00a9ed7212d5171ed75cb3df050564d9','preceding six snapshots unchanged');
 requireTrue(projectRefreshHash(eleven.data)==='8f44a55c1aa3469da6bb5bd624fe1bbabd8735a0152ecc0e1e9e97ce569fdb8a'&&projectRefreshHash(eleven.review)==='e8d55c4f5239f8a7acdcf8643d24f1c648644b8de6c7d3aecd9741ccfb057561','preceding eleven-account snapshot');
 requireTrue(projectRefreshHash({...value,records:value.records.slice(0,11),sources:value.sources.slice(0,58)})===projectRefreshHash(eleven.data),'preceding eleven accounts unchanged');
 requireTrue(projectRefreshHash(decision.records.slice(0,11))===projectRefreshHash(eleven.review.records),'preceding eleven review decisions unchanged');
 requireTrue(projectRefreshHash({schema_version:history.schema_version,editions:history.editions.slice(0,5)})==='69a5788892051427d41f3aeda75b8402e64b1bb14b2764f468d4e657365be06e','preceding five snapshots unchanged');
 requireTrue(projectRefreshHash(eight.data)==='c6843bca4ebdd8392fbaecd07630294b4c2569e9956091b016338f2cf7479346'&&projectRefreshHash(eight.review)==='039f5dce3d5c442302aea57baee691303c52462d23c1d19a7a345a75ea02ded4','preceding eight-account snapshot');
 requireTrue(projectRefreshHash({schema_version:history.schema_version,editions:history.editions.slice(0,4)})==='347b8682204f09b3ebb4c0c16b7dbdd5cea4d30aae21b9e2e67ed35793ee087d','preceding four snapshots unchanged');
 requireTrue(projectRefreshHash(six.data)==='6bc1bf402a86d2eed04d99f745315a51018aea14ac68db872cd2e98a69faa908'&&projectRefreshHash(six.review)==='a85e5fcc2db36ce24df6a772b8881269179d280be9f955a9506ee42bb8b17de3','preceding six-account snapshot');
 requireTrue(projectRefreshHash({schema_version:history.schema_version,editions:history.editions.slice(0,3)})==='99e0ab2eb95211c0c39cc120776b61fedf20935f31402dc88dd2c324088708e7','preceding three snapshots unchanged');
 requireTrue(projectRefreshHash(latest.data)==='43f3c593c59edaead76939296b4d38e7eb40a475411c92c4033989041efe8c30'&&projectRefreshHash(latest.review)==='09a0604fa45f3355117aed56a3454ae843693289008f3bc72cb24f9105dfacf3','preceding five-account snapshot');
 requireTrue(projectRefreshHash({schema_version:history.schema_version,editions:history.editions.slice(0,2)})==='5aa6db0d982cc65147fbfd1c91adfd245b38bdec83323c4c53c822f385b4c8a2','preceding history unchanged');
 requireTrue(projectRefreshHash(preceding.data)==='67c1cdeb07a515d0e71b7d9ea1900ee17c07974dfcc0bcbb495cbc5ef11fe27c'&&projectRefreshHash(preceding.review)==='05d66feaef8bab624305f25d0c2e0a41c3bb413b278a439c0b32ec8f8a35d6e7','preceding four-account snapshot');
 requireTrue(projectRefreshHash({schema_version:history.schema_version,editions:history.editions.slice(0,1)})==='9646fcd2d3a18b1b101d02cb868c51a356b89ade7dc34ae2b1a9ba3436cc6ab7','initial history unchanged');
 requireTrue(projectRefreshHash(previous.data)==='083c64255b2afad9ec4c094942d3ada5dc9aa1c519ab4b2045f960098b2f6dea'&&projectRefreshHash(previous.review)==='d688c12bcabd9465fcf402b88105642193308f3c2b9dcc391ba9f2a7630e3442','preceding research snapshot');
 requireTrue(decision.prior_research_edition_sha256===projectRefreshHash(eleven.data)&&decision.prior_research_review_sha256===projectRefreshHash(eleven.review),'preceding research pins');
 requireTrue(projectRefreshHash({...value,records:value.records.slice(0,3),sources:value.sources.slice(0,10)})===projectRefreshHash(previous.data),'preceding three accounts unchanged');
 requireTrue(projectRefreshHash(decision.records.slice(0,3))===projectRefreshHash(previous.review.records),'preceding review decisions unchanged');
 requireTrue(projectRefreshHash({...value,records:value.records.slice(0,4),sources:value.sources.slice(0,16)})===projectRefreshHash(preceding.data),'preceding four accounts unchanged');
 requireTrue(projectRefreshHash(decision.records.slice(0,4))===projectRefreshHash(preceding.review.records),'preceding four review decisions unchanged');
 requireTrue(projectRefreshHash({...value,records:value.records.slice(0,5),sources:value.sources.slice(0,22)})===projectRefreshHash(latest.data),'preceding five accounts unchanged');
 requireTrue(projectRefreshHash(decision.records.slice(0,5))===projectRefreshHash(latest.review.records),'preceding five review decisions unchanged');
 requireTrue(projectRefreshHash({...value,records:value.records.slice(0,6),sources:value.sources.slice(0,30)})===projectRefreshHash(six.data),'preceding six accounts unchanged');
 requireTrue(projectRefreshHash(decision.records.slice(0,6))===projectRefreshHash(six.review.records),'preceding six review decisions unchanged');
 requireTrue(projectRefreshHash({...value,records:value.records.slice(0,8),sources:value.sources.slice(0,42)})===projectRefreshHash(eight.data),'preceding eight accounts unchanged');
 requireTrue(projectRefreshHash(decision.records.slice(0,8))===projectRefreshHash(eight.review.records),'preceding eight review decisions unchanged');
 validateF15Refresh({...value,records:value.records.slice(0,1),sources:value.sources.slice(0,4)},retained.review);
 requireTrue(decision.review_id==='CANONICAL-PROJECT-REFRESH-2026-11-22-WAYMO'&&decision.policy_id===retained.review.policy_id&&decision.review_date===value.review_date,'review identity/date/policy');
 for(const field of ['human_review_claimed','independent_review_claimed','operating_outcomes_admitted','publication_authorized','launch_authorized','phase_216_complete'])requireTrue(decision[field]===false,field);
 requireTrue(decision.new_identity_count===0&&value.records.length===12&&decision.records.length===12&&value.sources.length===65,'edition scope');
 requireTrue(projectRefreshHash(value.sources.map(s=>s.id))===projectRefreshHash(contracts.flatMap(c=>c.sources)),'source order/identity');
 requireTrue(value.sources.every(s=>s.inspection_date===value.review_date&&s.url.startsWith('https://')&&s.locator&&s.boundary&&s.access),'source metadata');
 for(let i=0;i<contracts.length;i++){
  const c=contracts[i],r=value.records[i],pin=decision.records[i];
  requireTrue(r.record_id===c.id&&r.canonical_id===c.canonical&&r.route===c.route&&r.kind==='Project','exact identity/route');
  requireTrue(r.new_identity_count===0&&r.governed_stage_changed===false&&r.series_admitted===false,'retained admissions');
  requireTrue(r.sections.length===6&&r.next_artifacts.length===3&&projectRefreshHash(r.timeline.map(t=>t.date))===projectRefreshHash(c.dates),'complete narrative/date precision');
  for(const part of [...r.sections,...r.timeline])requireTrue(part.source_ids.every(id=>c.sources.includes(id)),'account-specific citation');
  requireTrue(projectRefreshHash(projectRefreshSources(r,value).map(s=>s.id))===projectRefreshHash(c.sources),'all scoped sources used');
  const identity=atlas.projects.find(x=>x.atlas_project_id===r.record_id),eligibility=portfolio.canonical.find(x=>x.record_id===r.canonical_id);
  requireTrue(identity&&eligibility&&identity.routes.atlas===r.route&&eligibility.route===r.route&&eligibility.eligible_count===c.count,'retained count and identity');
  requireTrue(pin.record_id===r.record_id&&pin.atlas_record_sha256===projectRefreshHash(identity)&&pin.portfolio_decision_sha256===projectRefreshHash(eligibility)&&pin.sha256===projectRefreshHash(r),'exact review and input pins');
  if(i>0)requireTrue(r.retained_pilot_id===null&&r.decision_boundary&&r.counting_note,'no borrowed measurement pilot');
 }
 const [g,a]=value.records.slice(1),source=id=>value.sources.find(s=>s.id===id);
 requireTrue(g.counting_note.includes('zero eligible projects')&&g.sections[2].text.includes('as beginning')&&g.decision_boundary.includes('does not establish that such artifacts do not exist'),'GSA context boundary');
 requireTrue(a.sections[2].text.includes('Higher reported scores indicate less validity')&&a.sections[3].text.includes('Not every application')&&a.sections[3].text.includes('subset')&&a.counting_note.includes('same single eligible ARIA 0.1 pilot'),'ARIA measurement and count boundaries');
 requireTrue(source('gsa-guide').publication_date==='2025-06'&&source('gsa-acquisition').updated_date==='2026-09-22'&&source('gsa-identity').publication_date==='2026-08-24'&&source('gsa-identity').event_date==='2026-08-12','GSA dates');
 requireTrue(source('aria-publication').publication_date==='2025-11-13'&&source('aria-report').publication_date==='2025-11'&&source('aria-report').editorial_approval_date==='2025-09-30'&&!source('aria-program').publication_date,'ARIA dates');
 for(const id of ['gsa-guide','aria-report'])requireTrue(source(id).access==='PDF text inspected; page-image inspection not completed','PDF access scope');
 requireTrue(decision.pilot_sha256===retained.review.pilot_sha256&&decision.pilot_followups_sha256===retained.review.pilot_followups_sha256,'retained pilot review pins');

 const m=value.records[3];
 requireTrue(m.scope.includes('Elkhorn')&&m.counting_note.includes('one eligible project')&&m.decision_boundary.includes('no governed Phase 61–64 conversion file')&&m.decision_boundary.includes('CPUC audit items'),'Moss Landing identity/governance');
 requireTrue(m.sections[0].text.includes('300 MW and 100 MW batteries will not return')&&m.sections[0].text.includes('350 MW facility as still under evaluation'),'component-specific operating status');
 requireTrue(m.sections[2].text.includes('not connected to the grid')&&m.sections[2].text.includes('September incident as unknown'),'separate incident/charge boundaries');
 requireTrue(m.sections[3].text.includes('mid-2027')&&m.sections[3].text.includes('That is a forecast')&&m.sections[3].text.includes('has begun'),'cleanup forecast and progress');
 requireTrue(m.sections[4].text.includes('nickel slightly above')&&m.sections[4].text.includes('not independently confirmed here')&&m.sections[4].text.includes('HTTP 403'),'adverse evidence and attribution');
 requireTrue(m.sections[5].text.includes('its own fire investigation')&&m.sections[5].text.includes('distinct September incident'),'investigation scope');
 requireTrue(source('moss-vistra-q3').reporting_end_date==='2026-09-30'&&source('moss-vistra-q3').signature_date==='2026-11-06'&&!source('moss-vistra-q3').publication_date&&!source('moss-vistra-q3').filing_date,'filing-date precision');
 requireTrue(source('moss-vistra-updates').latest_entry_date==='2026-11-12'&&source('moss-vistra-updates').sampling_update_date==='2026-09-29','issuer-entry dates');
 requireTrue(source('moss-epa-final-phase').publication_date==='2026-09-08'&&source('moss-epa-september').event_date==='2026-09-18'&&source('moss-epa-september').updated_date==='2026-10-20'&&source('moss-epa-overview').updated_date==='2026-11-05'&&source('moss-epa-timeline').updated_date==='2026-10-21','EPA dates');
 requireTrue(m.access_limits.length===2&&m.access_limits.every(l=>l.inspection_date===value.review_date&&l.url.startsWith('https://')&&l.result),'scoped access limits');
 requireTrue(m.access_limits[0].url.endsWith('0001692819-26-000025-index.html')&&m.access_limits[0].result.includes('not represented as a verified EDGAR acceptance timestamp')&&m.access_limits[1].url==='https://www.readymontereycounty.org/emergency/2025-moss-landing-vistra-power-plant-fire'&&m.access_limits[1].result.includes('HTTP 403'),'exact retrieval limits');


 const n=value.records[4],earlier=manateeHistory.acquisitions.find(r=>r.acquisition_id==='acquisition-56j-manatee-eia923-plant-operation'),saved=n.retained_evidence;
 requireTrue(projectRefreshHash(earlier)==='e08ab30e657dfccf243e64eea377fd0835ffba48a4b6d872444a6da630426bb3'&&decision.retained_manatee_acquisition_sha256===projectRefreshHash(earlier),'retained Manatee monthly acquisition');
 requireTrue(saved&&saved.acquisition_id===earlier.acquisition_id&&saved.checked_date===earlier.checked_date&&saved.entity_id===earlier.entity_id&&saved.record_status===earlier.record_status&&saved.closure_status===earlier.current_closure_status&&saved.reporting_period==='January–May 2026'&&saved.route===n.related[0].route,'retained evidence identity/date/status');
 requireTrue(saved.statement.includes('not a new workbook inspection')&&saved.statement.includes('Partially Closed')&&saved.statement.includes('interval dispatch and availability remained unresolved'),'retained evidence scope');
 requireTrue(n.scope.includes('adjacent solar facility')&&n.scope.includes('related but distinct')&&n.decision_boundary.includes('no governed Phase 61–64 conversion file')&&n.decision_boundary.includes('neither downgrades it to no evidence nor upgrades it to interval availability')&&n.counting_note.includes('same one eligible project'),'Manatee identity and governance');
 requireTrue(n.sections[0].text.includes('409 MW / 900 MWh')&&n.sections[0].text.includes('about 2.20 hours')&&n.sections[0].text.includes('nameplate arithmetic, not a measured discharge test'),'power/energy arithmetic boundary');
 requireTrue(n.sections[1].text.includes('winter-peaking units')&&n.sections[1].text.includes('not proof that both units were permanently retired'),'retirement forecast qualification');
 requireTrue(n.sections[2].text.includes('fleet snapshot')&&n.sections[2].text.includes('not Manatee\'s available power'),'fleet and asset separation');
 requireTrue(n.sections[3].text.includes('ZIP workbook was not newly extracted')&&n.sections[3].text.includes('does not add June–August observations'),'release-index scope');
 requireTrue(n.sections[4].text.includes('separate Lansing Smith')&&n.sections[4].text.includes('400 MW and 1,600 MWh')&&n.sections[4].text.includes('neither expands Manatee nor establishes a global league table'),'different asset and metric');
 requireTrue(n.sections[5].text.includes('missing interval separate from a documented zero')&&n.sections[5].text.includes('not a finding that those records do not exist'),'measurement uncertainty');
 requireTrue(source('manatee-construction').publication_date==='2021-01-28'&&source('manatee-commissioning').publication_date==='2021-12-13'&&!source('manatee-owner-overview').publication_date&&source('manatee-plan-2026').publication_date==='2026-04'&&source('manatee-eia-index').monthly_release_date==='2026-10-23'&&source('manatee-eia-index').data_period==='2026-08'&&source('manatee-smith-context').publication_date==='2026-11-09','Manatee exact source dates');
 requireTrue(source('manatee-plan-2026').access==='PDF text inspected; page-image inspection not completed'&&source('manatee-plan-2026').boundary.includes('denied and not retried')&&source('manatee-eia-index').access==='HTML index inspected; linked ZIP workbook not newly extracted','Manatee access scope');
 requireTrue(n.access_limits.length===1&&n.access_limits[0].inspection_date===value.review_date&&n.access_limits[0].url==='https://www.floridapsc.com/pscfiles/library/filings/2025/03321-2025/03321-2025.pdf'&&n.access_limits[0].result.includes('timed out'),'Manatee staff-response retrieval');

 const w=value.records[5],rail=manateeHistory.open_rails.find(r=>r.entity_id==='eia-plant-63834'),dossier=gatewayHistory.dossiers.find(r=>r.entity_id==='eia-plant-63834'),open=w.retained_open_rail;
 requireTrue(projectRefreshHash(rail)==='14e217188ca5f2967c7749380158a779551c603147a75843950dff8a474e0128'&&decision.retained_gateway_open_rail_sha256===projectRefreshHash(rail),'retained Gateway open rail');
 requireTrue(projectRefreshHash(dossier)==='185815ba6b69a077a6a423339d7a0a6f8f02b01c0cc19464ecb050ca89648e89'&&decision.retained_gateway_dossier_sha256===projectRefreshHash(dossier),'retained Gateway partial-return dossier');
 requireTrue(open&&open.coverage_id===rail.coverage_id&&open.entity_id===rail.entity_id&&open.captured_date===manateeHistory.captured_date&&open.closure_status===rail.current_closure_status&&open.selected_record===rail.selected_record&&open.route===w.related[0].route,'retained open question identity/date/status');
 requireTrue(open.statement.includes('not a new queue inspection')&&open.statement.includes('partial-return')&&open.statement.includes('not a new queue inspection, a finding of zero operation or a full-restoration decision'),'retained Gateway observation scope');
 requireTrue(w.scope.includes('Gateway Generating Station in Antioch is a different facility')&&w.counting_note.includes('same one eligible project')&&w.decision_boundary.includes('no governed Phase 61–64 conversion file')&&w.decision_boundary.includes('partial return is not erased and full restoration is not admitted'),'Gateway identity/governance');
 requireTrue(w.sections[0].text.includes('230 MW operating')&&w.sections[0].text.includes('November 2024 portfolio snapshot')&&w.sections[0].text.includes('not two batteries'),'Gateway commissioning versus snapshot');
 requireTrue(w.sections[1].text.includes('partly back online')&&w.sections[1].text.includes('fire-affected building remained offline')&&w.sections[1].text.includes('not a current full-capacity availability series'),'Gateway partial return');
 requireTrue(w.sections[2].text.includes('not their completion')&&w.sections[2].text.includes('cannot establish that closeout records do not exist'),'Gateway cleanup and retrieval boundaries');
 requireTrue(w.sections[3].text.includes('fourteen closed and two remaining')&&w.sections[3].text.includes('introductory end-October target')&&w.sections[3].text.includes('Finding 1 a December 31, 2025 target')&&w.sections[3].text.includes('Finding 7 an October 24 target')&&w.sections[3].text.includes('operator claims and plans, not independent regulator acceptance'),'Gateway owner discrepancy and attribution');
 requireTrue(w.sections[4].text.includes('June 1, 2027')&&w.sections[4].text.includes('August 1, 2027')&&w.sections[4].text.includes('Neither date is an observed restart'),'Gateway future contract dates');
 requireTrue(w.sections[5].text.includes('A missing interval is not a documented zero')&&w.sections[5].text.includes('not a claim that agencies or the operator have published nothing further'),'Gateway missingness and bounded review');
 requireTrue(source('gateway-commissioning').publication_date==='2020-08-19'&&source('gateway-commissioning').access.includes('video not viewed')&&source('gateway-owner-fleet').snapshot_date==='2024-11'&&!source('gateway-owner-fleet').publication_date,'Gateway commissioning and snapshot dates');
 requireTrue(source('gateway-epa-order').header_date==='2025-07-06'&&source('gateway-epa-order').dateline_date==='2025-07-07'&&source('gateway-epa-order').updated_date==='2025-09-25'&&!source('gateway-epa-order').publication_date&&!source('gateway-epa-profile').publication_date&&!source('gateway-cpuc-index').publication_date,'Gateway EPA and catalog date precision');
 requireTrue(source('gateway-cpuc-audit').letter_date==='2025-08-29'&&source('gateway-cpuc-audit').audit_start_date==='2025-06-02'&&source('gateway-cpuc-audit').audit_end_date==='2025-06-05','Gateway audit dates');
 requireTrue(source('gateway-owner-response').claimed_compliance_date==='2025-09-09'&&source('gateway-owner-response').finding_1_target_date==='2025-12-31'&&source('gateway-owner-response').finding_7_target_date==='2025-10-24'&&!source('gateway-owner-response').publication_date&&!source('gateway-owner-response').issuance_date&&source('gateway-owner-response').role==='Operator response, not regulator acceptance','Gateway response dates and authority');
 requireTrue(source('gateway-contract-resolution').url==='https://docs.cpuc.ca.gov/PublishedDocs/Published/G000/M588/K329/588329444.PDF'&&source('gateway-contract-resolution').adoption_date==='2025-11-20'&&source('gateway-contract-resolution').issuance_date==='2025-11-24'&&source('gateway-contract-resolution').expected_delivery_date==='2027-06-01'&&source('gateway-contract-resolution').delivery_deadline_date==='2027-08-01','Gateway final resolution and dates');
 for(const id of ['gateway-cpuc-audit','gateway-owner-response','gateway-contract-resolution'])requireTrue(source(id).access==='PDF text inspected; page-image inspection not completed','Gateway PDF scope');
 requireTrue(w.access_limits.length===1&&w.access_limits[0].inspection_date===value.review_date&&w.access_limits[0].url==='https://cumulis.epa.gov/supercpad/CurSites/cadminrecord.cfm?colid=67825&doc=Y&id=0926558'&&w.access_limits[0].result.includes('no document rows')&&w.access_limits[0].result.includes('not evidence of nonexistence'),'Gateway collection access limit');

 const aircraftBacklog=operations.backlog_reviews.find(r=>r.backlog_item_id==='182-BACKLOG-023');
 const aircraftInputs={
  f35_dossier:aircraftDossiers.dossiers.find(r=>r.entity_id==='manufacturer-lockheed-f35-fort-worth'),
  kc46_dossier:aircraftDossiers.dossiers.find(r=>r.entity_id==='manufacturer-boeing-kc46-everett'),
  f35_annual:aircraftAnnual.acquisitions.find(r=>r.acquisition_id==='acquisition-56h-f35-delivery-capability-denominator'),
  kc46_denominator:aircraftAnnual.acquisitions.find(r=>r.acquisition_id==='acquisition-56h-kc46-current-program-denominator-2026'),
  f35_continuation:aircraftFollowups.acquisitions.find(r=>r.acquisition_id==='acquisition-56k-f35-monthly-acceptance-capability-status'),
  kc46_plan:manateeHistory.acquisitions.find(r=>r.acquisition_id==='acquisition-56j-kc46-readiness-plan'),
  kc46_delivery_checks:operations.backlog_artifact_checks.filter(r=>['207-CHECK-AIRCRAFT-KC46-100TH','207-CHECK-AIRCRAFT-KC46-105TH'].includes(r.check_id)),
  aircraft_backlog:{review_id:aircraftBacklog.review_id,checked_date:aircraftBacklog.checked_date,sha256:aircraftBacklog.sha256},
  aircraft_adjudication:operations.backlog_adjudications.find(r=>r.backlog_item_id==='182-BACKLOG-023')
 };
 const aircraftPins={"f35_dossier":"75c31fc6e8800197676b52cebbde7462a4a6e8aeedb2b1d59d1d33be15e03bc6","kc46_dossier":"62c5486db290288e41dfb00c90067f5512b632965915667d01e4e89c319da381","f35_annual":"336ed3a8731dcd17ab4d59bb5a61a235093a04ad858353f4b40ee85e3c887e2c","kc46_denominator":"ca663de762b2fd9b91f47f79b2408b919bd402bf358450cebd4ccae090f707d9","f35_continuation":"73bd7351533845cf47cd4019f51da656d7395d712c7ffbc3087164f0ba5d8fc4","kc46_plan":"f8892b38671ca797c171844c0673679549aec57a3935e237b9ac473f3096d922","kc46_delivery_checks":"950dadf91c6e442ca4a27f33f0c7627a0811b959344b9279041256adb1aae825","aircraft_backlog":"d8539e4b00444e3c75de9e5c147a6e48ab592d3fc741e579938681f108324780","aircraft_adjudication":"df2902562dbb23ab0a7ed00adecab57f40b36999606dd9e094cd35d526fa4c36"};
 requireTrue(projectRefreshHash(decision.retained_aircraft_inputs)===projectRefreshHash(aircraftPins),'aircraft retained input pins');
 for(const [key,input]of Object.entries(aircraftInputs))requireTrue(projectRefreshHash(input)===aircraftPins[key],'aircraft historical input '+key);
 const [fighter,tanker]=value.records.slice(6);
 for(const [r,count]of [[fighter,2],[tanker,4]]){
  requireTrue(r.retained_research.length===count&&r.counting_note.includes('same one eligible')&&r.decision_boundary.includes('no governed Phase 61–64 conversion file')&&r.decision_boundary.includes('September 25 rejection'),'aircraft count/governance/history');
  const last=r.retained_research.at(-1),decisionInput=aircraftInputs.aircraft_adjudication;
  requireTrue(last.id===decisionInput.decision_id&&last.checked_date===decisionInput.decision_date&&last.status===decisionInput.disposition&&last.route===aircraftBacklog.route&&last.text.includes('do not reverse that decision'),'retained aircraft comparison adjudication');
  requireTrue(r.related.some(x=>x.route===aircraftBacklog.route),'retained comparison link');
 }
 for(const [r,input]of [[fighter,aircraftInputs.f35_continuation],[tanker,aircraftInputs.kc46_plan]]){
  const saved=r.retained_research[0];requireTrue(saved.id===input.acquisition_id&&saved.checked_date===input.checked_date&&saved.status===input.current_closure_status&&saved.route===r.related[0].route,'aircraft earlier acquisition');
 }
 requireTrue(fighter.retained_research[0].text.includes('not a new July inspection')&&tanker.retained_research[0].text.includes('targets, not measured gains'),'retained aircraft finding boundaries');
 for(let i=0;i<2;i++){const saved=tanker.retained_research[i+1],check=aircraftInputs.kc46_delivery_checks[i];requireTrue(saved.id===check.check_id&&saved.checked_date===aircraftBacklog.checked_date&&saved.status==='Retained historical observation'&&saved.route===aircraftBacklog.route&&saved.text.includes('not freshly inspected today'),'retained delivery review');}
 requireTrue(tanker.retained_research[1].text.includes('December 2, 2025')&&tanker.retained_research[1].text.includes('published December 4')&&tanker.retained_research[2].text.includes('April 13, 2026')&&tanker.retained_research[2].text.includes('April 3 arrival')&&tanker.retained_research[2].text.includes('not 130 aircraft'),'retained delivery event and publication dates');
 requireTrue(fighter.scope.includes('Global program totals, the US operating fleet and Fort Worth line evidence have different populations'),'F-35 geographic and program scope');
 requireTrue(fighter.sections[0].text.includes('191 deliveries in calendar 2025')&&fighter.sections[0].text.includes('43 in the quarter ended September 27, 2026')&&fighter.sections[0].text.includes('1,387 production aircraft')&&fighter.sections[0].text.includes('not a measured monthly line rate'),'F-35 delivery periods');
 requireTrue(fighter.sections[1].text.includes('110 aircraft delivered in 2024')&&fighter.sections[1].text.includes('238 days')&&fighter.sections[1].text.includes('80 deliveries')&&fighter.sections[1].text.includes('74 due in earlier years')&&fighter.sections[1].text.includes('passage of September is not completion evidence'),'F-35 due/delivered and follow-up dates');
 requireTrue(fighter.sections[2].text.includes('174 such acceptances by May 2025')&&fighter.sections[2].text.includes('claims TR-3 completion')&&fighter.sections[2].text.includes('not an aircraft-by-aircraft receiving-authority acceptance ledger'),'F-35 capability attribution');
 requireTrue(fighter.sections[3].text.includes('67% in fiscal 2021 to 44% in fiscal 2025')&&fighter.sections[3].text.includes('38% to 25%')&&fighter.sections[3].text.includes('not the percentages of delivered aircraft that were defective'),'F-35 readiness denominator');
 requireTrue(fighter.sections[4].text.includes('not a finding that $31 billion of parts is missing')&&fighter.sections[4].text.includes('as of March 2026')&&fighter.sections[4].text.includes('all four Open'),'F-35 parts/loss/status distinction');
 requireTrue(fighter.sections[5].text.includes('A missing month is not zero output')&&fighter.sections[5].text.includes('global total cannot be silently assigned to one line'),'F-35 non-inference');
 requireTrue(tanker.scope.includes('KC-135 observations are context')&&tanker.sections[0].text.includes('Seven is part of fifteen')&&tanker.sections[0].text.includes('not a fresh count of US Air Force aircraft'),'KC-46 program and nested period scope');
 requireTrue(tanker.sections[1].text.includes('earlier observations retain their original inspection dates')&&tanker.sections[1].text.includes('does not invalidate the saved milestones'),'KC-46 failed access does not erase history');
 requireTrue(tanker.sections[2].text.includes('does not reconstruct them')&&tanker.sections[2].text.includes('they cannot all be reassigned to the newer aircraft'),'KC-46 public report and mixed fleet boundary');
 requireTrue(tanker.sections[3].text.includes('not final certification, completed fleet retrofit')&&tanker.sections[3].text.includes('modified test aircraft'),'KC-46 test-stage boundary');
 requireTrue(tanker.sections[4].text.includes('nongeneralizable sample')&&tanker.sections[4].text.includes('four Open actions')&&tanker.sections[4].text.includes('same audit, not independent confirmations'),'KC-46 study scope and implementation');
 requireTrue(tanker.sections[5].text.includes('Missing observations must not become zero availability'),'KC-46 missingness');
 requireTrue(fighter.access_limits.length===0&&tanker.access_limits.length===3&&tanker.access_limits.every(l=>l.inspection_date===value.review_date&&l.result.includes('HTTP 403')),'aircraft current access limits');
 requireTrue(projectRefreshHash(tanker.access_limits.map(l=>l.url))===projectRefreshHash([...aircraftInputs.kc46_delivery_checks.map(c=>c.url),aircraftInputs.kc46_plan.checked_source_url]),'exact failed aircraft URLs');
 requireTrue(source('f35-gao-production-2024').publication_date==='2024-05-16'&&source('f35-gao-production-2024').milestone_date==='2024-03'&&source('f35-gao-deliveries-2025').publication_date==='2025-09-03'&&source('f35-gao-deliveries-2025').capability_snapshot_date==='2025-05'&&source('f35-gao-delivery-followup').comment_date==='2026-07','F-35 audit date precision');
 requireTrue(source('f35-company-2025').publication_date==='2026-01-07'&&source('f35-company-q3-2026').reporting_end_date==='2026-09-27'&&source('f35-company-q3-2026').signature_date==='2026-10-22'&&!source('f35-company-q3-2026').filing_date&&!source('f35-company-q3-2026').publication_date,'F-35 issuer dates');
 requireTrue(source('f35-gao-sustainment-2026').publication_date==='2026-06-11'&&source('f35-gao-parts-2026').publication_date==='2026-11-09'&&source('f35-gao-parts-2026').loss_status_date==='2026-03','F-35 observation versus publication');
 requireTrue(source('kc46-gao-report').publication_date==='2026-06-10'&&source('kc46-gao-report').audit_end_date==='2026-05'&&source('kc46-gao-followup').publication_date==='2026-06-10'&&source('kc46-rvs-testing').publication_date==='2026-06-03','KC-46 report and test dates');
 requireTrue(source('kc46-preliminary-q3').publication_date==='2026-10-13'&&source('kc46-final-q3').publication_date==='2026-10-27'&&source('kc46-preliminary-q3').reporting_end_date==='2026-09-30'&&source('kc46-final-q3').reporting_end_date==='2026-09-30','KC-46 preliminary/final dates');
 requireTrue(source('f35-gao-deliveries-2025').artifact_id===source('f35-gao-delivery-followup').artifact_id&&source('f35-gao-deliveries-2025').artifact_id==='GAO-25-107632'&&source('kc46-gao-report').artifact_id===source('kc46-gao-followup').artifact_id&&source('kc46-gao-report').artifact_id==='GAO-26-109154','same-report alternate presentations');
 requireTrue(value.sources.slice(30,42).every(s=>s.access==='HTML text inspected'),'aircraft actual inspection medium');
 requireTrue(projectRefreshHash(value.sources.slice(30,42).map(s=>s.url))===projectRefreshHash(["https://www.gao.gov/products/gao-24-106909","https://files.gao.gov/reports/GAO-25-107632/index.html","https://www.gao.gov/products/gao-25-107632","https://www.f35.com/f35/news-and-features/F35_Breaks_Delivery_Record_Continues_Combat_Success_in_2025.html","https://www.sec.gov/Archives/edgar/data/936468/000162828026066928/lmt-20260927.htm","https://www.gao.gov/products/gao-26-108113","https://www.gao.gov/products/gao-27-108713","https://files.gao.gov/reports/GAO-26-109154/index.html","https://www.gao.gov/products/gao-26-109154","https://www.boeing.com/features/2026/06/boeing-s-kc-46-program-completes-first-phase-of-remote-vision-system","https://investors.boeing.com/investors/news/press-release-details/2026/Boeing-Announces-Third-Quarter-Deliveries/default.aspx","https://investors.boeing.com/investors/news/press-release-details/2026/Boeing-Reports-Third-Quarter-Results/default.aspx"]),'aircraft exact sources');

 validateManufacturingRefreshes(value,decision);
 validateWaymoRefresh(value,decision);
 requireTrue(decision.edition_sha256===projectRefreshHash(value),'exact edition');
 return value;
}
export const canonicalProjectRefreshHistory=history;

validateProjectRefreshes(data);
export const canonicalProjectRefreshes=data;
export const canonicalProjectRefreshReview=review;
// Presentation category follows the retained eligibility decision; assessed records stay exact.
export function projectRefreshCatalogKind(record){
 requireTrue(data.records.includes(record),'unbound catalog classification');
 const decision=portfolio.canonical.find(p=>p.record_id===record.canonical_id&&p.route===record.route);
 requireTrue(decision,'missing catalog eligibility');
 return decision.eligible_count===0?'Context':record.kind;
}
export function projectRefreshFor(project){
 const record=data.records.find(r=>r.record_id===project?.atlas_project_id);if(!record)return null;
 requireTrue(projectRefreshHash(project)===review.records.find(r=>r.record_id===record.record_id)?.atlas_record_sha256,'runtime identity drift');
 return record;
}
