import {createHash} from 'node:crypto';
import realized from '../data/phase-56l-realized-outcome-continuation.json' with {type:'json'};
import commitments from '../data/phase-56i-remaining-rails-first-pass.json' with {type:'json'};
import operations from '../data/phase-207-current-operations.json' with {type:'json'};
const hash=value=>createHash('sha256').update(JSON.stringify(value)).digest('hex');
const requireTrue=(ok,message)=>{if(!ok)throw Error('Canonical manufacturing refresh: '+message);};
export const manufacturingRefreshContracts=[
  {
    "id": "119-PROJECT-018",
    "canonical": "casebook-current-applications-capacity",
    "route": "/atlas/projects/current-applications-capacity/",
    "count": 1,
    "dates": [
      "2010-10-26",
      "2011-01-24",
      "2026-01-13"
    ],
    "sources": [
      "current-mep",
      "current-capital",
      "current-capabilities",
      "current-team",
      "current-workforce",
      "current-osha"
    ]
  },
  {
    "id": "119-PROJECT-019",
    "canonical": "casebook-island-components-capacity",
    "route": "/atlas/projects/island-components-capacity/",
    "count": 1,
    "dates": [
      "2021-11-17",
      "2024-07-17"
    ],
    "sources": [
      "island-mep",
      "island-acquisition",
      "island-capabilities",
      "island-certifications"
    ]
  },
  {
    "id": "119-PROJECT-020",
    "canonical": "casebook-monaghan-medical-capacity",
    "route": "/atlas/projects/monaghan-medical-capacity/",
    "count": 1,
    "dates": [
      "2020-11-05",
      "2024-02-27",
      "2025-01-14",
      "2026-09-28"
    ],
    "sources": [
      "monaghan-mep",
      "monaghan-opening",
      "monaghan-iso",
      "monaghan-profile",
      "monaghan-shipments",
      "monaghan-fda-method"
    ]
  }
];
const inputPins={
  "realized": "23177f5695df866cae1514390fa06e52bbd6f4ca6d5f710d06a3e3196af16364",
  "monaghan_commitment": "c4604845a85b7655efa4526af2a15a22c02c0f63365dd15f072a661a0e10f8b9",
  "backlog_reviews": "f465593a46501c7b392ef49510d22da3759a22bb67cfb9d0c87e7ffe47661a6f",
  "backlog_decisions": "a01b9f97fd4dbd6a0201a384bbf9e01ccd20d90d1bb59923b5ab4749d4c70ca1"
};
const backlogIds=['182-BACKLOG-009','182-BACKLOG-013','182-BACKLOG-017','182-BACKLOG-018','182-BACKLOG-019'];
export function validateManufacturingRefreshes(value,decision){
 const inputs={
  realized:realized.acquisitions,
  monaghan_commitment:commitments.acquisitions.find(x=>x.entity_id==='manufacturer-monaghan-medical-plattsburgh-ny'),
  backlog_reviews:operations.backlog_reviews.filter(r=>backlogIds.includes(r.backlog_item_id)).map(({backlog_item_id,review_id,checked_date,route,sha256})=>({backlog_item_id,review_id,checked_date,route,sha256})),
  backlog_decisions:operations.backlog_adjudications.filter(r=>backlogIds.includes(r.backlog_item_id))
 };
 requireTrue(hash(decision.retained_manufacturing_inputs)===hash(inputPins),'retained input pins');
 for(const [k,v]of Object.entries(inputs))requireTrue(hash(v)===inputPins[k],'historical '+k);
 const [current,island,monaghan]=value.records.slice(8,11),source=id=>value.sources.find(s=>s.id===id);
 const expectedDecisions=[['182-BACKLOG-009','182-BACKLOG-013','182-BACKLOG-017'],['182-BACKLOG-009','182-BACKLOG-013','182-BACKLOG-018'],['182-BACKLOG-009','182-BACKLOG-013','182-BACKLOG-019']];
 for(const [index,r] of [current,island,monaghan].entries()){
  requireTrue(r.counting_note.includes('same one eligible')&&r.decision_boundary.includes('no governed Phase 61–64 conversion file')&&r.decision_boundary.includes('September 25 comparison decisions remain unchanged'),'identity/governance');
  requireTrue(r.retained_research.length===(index===2?5:4),'historical notice count');
  const first=r.retained_research[0],old=inputs.realized[index];
  requireTrue(first.id===old.acquisition_id&&first.checked_date===old.checked_date&&first.status===old.current_closure_status&&first.route===r.related[0].route,'realized record identity/date/status');
  const notices=r.retained_research.slice(index===2?2:1);
  for(const [i,item]of notices.entries()){
   const id=expectedDecisions[index][i],d=inputs.backlog_decisions.find(d=>d.backlog_item_id===id),b=inputs.backlog_reviews.find(b=>b.backlog_item_id===id);
   requireTrue(item.id===d.decision_id&&item.checked_date===d.decision_date&&item.status===d.disposition&&item.route===b.route&&item.text===d.rationale+' This new account does not reverse that decision.','retained manufacturing decision');
  }
 }
 requireTrue(current.retained_research[0].text.includes('not another production observation'),'reread not repeat');
 requireTrue(island.retained_research[0].text.includes('25 pre-IDA FTEs, 33 reported current FTEs')&&island.retained_research[0].text.includes('47052302A')&&island.retained_research[0].text.includes('not proof of completed spending')&&island.retained_research[0].text.includes('not newly inspected'),'Island historical employment');
 requireTrue(monaghan.retained_research[0].text.includes('0902-18-05')&&monaghan.retained_research[0].text.includes('91 current versus 68 pre-IDA FTEs')&&monaghan.retained_research[0].text.includes('construction complete in 2021')&&monaghan.retained_research[0].text.includes('not newly inspected'),'Monaghan historical project');
 const commitment=monaghan.retained_research[1],ci=inputs.monaghan_commitment;
 requireTrue(commitment.id===ci.acquisition_id&&commitment.checked_date===ci.checked_date&&commitment.status===ci.current_closure_status&&commitment.route===monaghan.related[0].route&&commitment.text.includes('commitments, not certified execution or issued credits')&&commitment.text.includes('not newly inspected'),'separate commitment');
 requireTrue(current.sections[0].text.includes('2.5x multiplier does not exactly match 105 ÷ 40 = 2.625')&&current.sections[0].text.includes('not a source correction or a causal estimate')&&current.sections[0].text.includes('neither dates the intervention'),'Current arithmetic and dates');
 requireTrue(current.sections[1].text.includes('Black - Cancelled/Declined')&&current.sections[1].text.includes('Zero grant disbursement is not zero private investment')&&current.sections[1].text.includes('neither a cancellation date nor a reason'),'grant boundary');
 requireTrue(current.sections[2].text.includes('neither supplies time spent on the observed line')&&current.sections[2].text.includes('accepted output over successive periods'),'capabilities not outcomes');
 requireTrue(current.sections[3].text.includes('whole-company headcount would mix scopes')&&current.sections[3].text.includes('does not identify a reporting period'),'workforce denominator');
 requireTrue(current.sections[4].text.includes('2010')&&current.sections[4].text.includes('2011')&&current.sections[4].text.includes('not current safety')&&current.sections[4].text.includes('historical case'),'enforcement dates');
 requireTrue(current.sections[5].text.includes('Keep missing periods missing'),'Current missingness');
 requireTrue(island.sections[0].text.includes('75 to 120 units')&&island.sections[0].text.includes('717 to 156 pieces')&&island.sections[0].text.includes('not an independent recurring series')&&island.sections[0].text.includes('does not identify the start and end'),'Island intervention scope');
 requireTrue(island.sections[1].text.includes('60% increase')&&island.sections[1].text.includes('78.2% reduction')&&island.sections[1].text.includes('not additive productivity gains')&&island.sections[1].text.includes('cannot establish a lower defect rate'),'Island arithmetic and quality');
 requireTrue(island.sections[2].text.includes('do not date a relocation')&&island.sections[2].text.includes('Acquisition benefits remain a hypothesis'),'facility/parent continuity');
 requireTrue(island.sections[3].text.includes('older cached representation')&&island.sections[3].text.includes('not inspected in this continuation')&&island.sections[3].text.includes('every listed certification applies to Hauppauge'),'certificate scope');
 requireTrue(island.sections[4].text.includes('not a fresh inspection')&&island.sections[5].text.includes('missing observation is not zero output'),'Island historical and missingness');
 requireTrue(monaghan.sections[0].text.includes('50% output increase')&&monaghan.sections[0].text.includes('30% time reduction')&&monaghan.sections[0].text.includes('cannot be multiplied into a combined gain'),'Monaghan unlike measures');
 requireTrue(monaghan.sections[1].text.includes('10 million units shipped annually')&&monaghan.sections[1].text.includes('does not specify the reporting year')&&monaghan.sections[1].text.includes('not an audited annual series')&&monaghan.sections[1].text.includes('not ten million unique patients'),'shipment attribution and population');
 requireTrue(monaghan.sections[2].text.includes('different dated milestones')&&monaghan.sections[2].text.includes('separate later ESD commitment'),'opening versus administrative completion');
 requireTrue(monaghan.sections[3].text.includes('must not override the dated announcement or be assigned to 2026'),'undated profile');
 requireTrue(monaghan.sections[4].text.includes('No fresh count or zero-event finding')&&monaghan.sections[4].text.includes('passive reports alone cannot establish incidence or causation')&&monaghan.sections[4].text.includes('headline does not supply those matches'),'FDA not a rate');
 requireTrue(monaghan.sections[5].text.includes('Clinical outcomes need a product-specific study and patient denominator'),'patient evidence');
 requireTrue(current.access_limits.length===0&&island.access_limits.length===0&&monaghan.access_limits.length===1,'scoped retrieval limits');
 requireTrue(monaghan.access_limits[0].url==='https://www.accessdata.fda.gov/scripts/cdrh/cfdocs/cfTPLC/tplc.cfm?ID=82&manufacturer=MONAGHAN+MEDICAL+CORPORATION&min_report_year=2017&pmndecision=SUBSTANTIALLY+EQUIVALENT'&&monaghan.access_limits[0].inspection_date===value.review_date&&monaghan.access_limits[0].result.includes('Cache miss')&&monaghan.access_limits[0].result.includes('No alternate query was substituted'),'exact FDA failure');
 requireTrue(source('current-mep').created_date==='2026-01-13'&&!source('current-mep').event_date&&source('island-mep').created_date==='2024-07-17'&&source('monaghan-mep').created_date==='2025-01-14','page dates not events');
 requireTrue(source('current-osha').opened_date==='2010-10-26'&&source('current-osha').closed_date==='2011-01-24'&&!source('current-capital').publication_date&&!source('current-capital').effective_date&&!source('current-workforce').reporting_date,'historical/unknown dates');
 requireTrue(source('island-acquisition').announcement_date==='2021-11-17'&&!source('island-certifications').expiry_date&&!source('island-certifications').issue_date,'acquisition/certification dates');
 requireTrue(source('monaghan-opening').announcement_date==='2020-11-05'&&source('monaghan-iso').announcement_date==='2024-02-27'&&source('monaghan-shipments').publication_date==='2026-09-28'&&!source('monaghan-shipments').reporting_end_date&&!source('monaghan-profile').publication_date,'Monaghan date roles');
 requireTrue(hash(value.sources.slice(42,58).map(s=>s.url))===hash(["https://www.nist.gov/mep/successstories/2024/lean-tools-provide-lead-time-reduction","https://regionalcouncils.ny.gov/cfa/project/51146","https://www.currentapps.com/","https://www.currentapps.com/team","https://jcida.com/strategic-advantages/largest-employers/","https://www.osha.gov/ords/imis/establishment.inspection_detail?id=314347824","https://www.nist.gov/mep/successstories/2024/success-lean-process-implementation","https://islandcomponents.com/resource-library/g-w-lisk-company-acquires-island-components-group/","https://islandcomponents.com/capabilities-2/","https://islandcomponents.com/about/certifications/","https://www.nist.gov/mep/successstories/2024/lean-implementation-thrives-monaghan-medical","https://www.monaghanmed.com/monaghan-medical-corporation-opens-new-state-of-the-art-manufacturing-facility-in-plattsburgh-new-york/","https://www.monaghanmed.com/iso-14001-certification/","https://www.monaghanmed.com/about/","https://www.clintoncountyida.com/news-and-media/recent-news/p/item/69793/monaghan-medical-corporation-manufactures-deep-breaths-and-peace-of-mind-in-plattsburgh","https://www.fda.gov/medical-devices/mandatory-reporting-requirements-manufacturers-importers-and-device-user-facilities/about-manufacturer-and-user-facility-device-experience-maude-database"]),'exact sources');
 requireTrue(value.sources.slice(42,58).every(s=>s.access==='HTML text inspected'),'actual access medium');
 requireTrue(source('island-certifications').boundary.includes('older cached representation')&&source('monaghan-fda-method').role==='Reporting-system methodology'&&source('monaghan-shipments').role==='County-hosted profile quoting the operator','source role distinctions');
}
