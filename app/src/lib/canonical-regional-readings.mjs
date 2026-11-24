import {createHash} from 'node:crypto';
import data from '../data/canonical-regional-readings.json' with {type:'json'};
import review from '../data/canonical-regional-reading-reviews.json' with {type:'json'};
import atlas from '../data/phase-119-deep-project-place-atlas.json' with {type:'json'};
import portfolio from '../data/portfolio-eligibility-decisions.json' with {type:'json'};
import policy from '../data/build-review-policy.json' with {type:'json'};
import nevada from '../data/nevada-named-dossiers.json' with {type:'json'};
import refresh from '../data/canonical-project-refreshes.json' with {type:'json'};
import annual from '../data/phase-204-reader-completion.json' with {type:'json'};
import {annualAiPresentation,annualAiReviewFor} from './annual-ai-reviews.mjs';
export const regionalReadingHash=value=>createHash('sha256').update(JSON.stringify(value)).digest('hex');
const requireTrue=(condition,message)=>{if(!condition)throw Error('Canonical regional reading: '+message);};
const annualRecord=annual.records.find(r=>r.record_id==='203-CASE-13');
const annualOptions={route:'/reference/state-of-future-systems/case-victoria-big-battery/'};
const annualView=annualAiPresentation(annualRecord,annualOptions),annualAi=annualAiReviewFor(annualRecord,annualOptions);
const contracts=[
  {
    "id": "119-PLACE-002",
    "route": "/atlas/places/nevada-lithium-battery-materials-corridor/",
    "source_ids": [
      "blm-rhyolite-rod",
      "census-humboldt-nv",
      "doe-rhyolite-scope",
      "doe-thacker-scope",
      "fws-tiehms-rule",
      "hrw-thacker-rights",
      "humboldt-planning",
      "humboldt-rural-guide",
      "ioneer-q3-2026",
      "lac-q3-2026",
      "ndep-thacker"
    ],
    "related": [
      "/atlas/projects/nevada-lithium-to-qualified-material/",
      "/atlas/projects/nevada/thacker-pass/",
      "/atlas/projects/nevada/rhyolite-ridge/",
      "/atlas/places/humboldt-county-nevada/"
    ],
    "required": [
      "not a continuous permit area",
      "TBA",
      "issuer targets",
      "not a current financing determination",
      "Humboldt county baseline applies to Humboldt alone"
    ]
  },
  {
    "id": "119-PLACE-006",
    "route": "/atlas/places/california-autonomous-mobility/",
    "source_ids": [
      "waymo-approval",
      "waymo-dmv",
      "waymo-freeway-report",
      "waymo-quarterly",
      "waymo-recall",
      "waymo-release",
      "waymo-safety"
    ],
    "related": [
      "/atlas/projects/waymo-california-service/"
    ],
    "required": [
      "not establish statewide service coverage",
      "secondary warning",
      "did not extract the ZIP",
      "does not recompute the CSVs",
      "cannot determine current final-remedy completion"
    ]
  },
  {
    "id": "119-PLACE-013",
    "route": "/atlas/places/victoria-grid-storage/",
    "source_ids": [
      "source-56e-vbb-aemo-operational-2021",
      "source-56e-vbb-aemo-registration-2021",
      "source-56e-vbb-esv-fire-findings-2021",
      "source-56e-vbb-esv-investigations"
    ],
    "related": [
      "/atlas/projects/victoria-big-battery/",
      "/reference/state-of-future-systems/case-victoria-big-battery/"
    ],
    "required": [
      "September 22–23, 2026",
      "up to 250 MW",
      "not an exact registration day",
      "conditional no-objection",
      "not a continuing safety audit"
    ]
  },
  {
    "id": "119-PLACE-014",
    "route": "/atlas/places/florida-utility-storage/",
    "source_ids": [
      "manatee-commissioning",
      "manatee-construction",
      "manatee-eia-index",
      "manatee-owner-overview",
      "manatee-plan-2026",
      "manatee-smith-context"
    ],
    "related": [
      "/atlas/projects/manatee-battery-storage/"
    ],
    "required": [
      "not a census of every Florida utility",
      "winter-peaking",
      "not every Florida utility",
      "400 MW and 1,600 MWh",
      "adds no fresh plant rows"
    ]
  },
  {
    "id": "119-PLACE-015",
    "route": "/atlas/places/california-battery-safety/",
    "source_ids": [
      "gateway-commissioning",
      "gateway-contract-resolution",
      "gateway-cpuc-audit",
      "gateway-cpuc-index",
      "gateway-epa-order",
      "gateway-epa-profile",
      "gateway-owner-fleet",
      "gateway-owner-response",
      "moss-epa-final-phase",
      "moss-epa-overview",
      "moss-epa-september",
      "moss-epa-timeline",
      "moss-vistra-q3",
      "moss-vistra-updates"
    ],
    "related": [
      "/atlas/projects/moss-landing-battery-safety/",
      "/atlas/projects/gateway-battery-storage/"
    ],
    "required": [
      "two",
      "not Gateway Energy Storage",
      "September cause as unknown",
      "Neither is full completion",
      "not regulator acceptance",
      "Two selected incidents are not a statewide denominator"
    ]
  }
];
const flags=['human_review_claimed','independent_review_claimed','fresh_external_source_check','publication_authorized','launch_authorized','phase_216_complete','operating_outcomes_admitted'];
const retainedSources=()=>[
 ...nevada.sources.map(s=>({id:s.id,collection:'nevada',retained:s})),
 ...refresh.sources.filter(s=>/^(waymo-|manatee-|moss-|gateway-)/.test(s.id)).map(s=>({id:s.id,collection:'project_refresh',retained:s})),
 ...annualView.review.source_checks.map(s=>({id:s.source_id,collection:'annual_victoria',retained:s}))
];
function narrativeFor(pin){
 if(pin.collection==='nevada')return nevada.records.find(r=>r.record_id===pin.record_id);
 if(pin.collection==='project_refresh')return refresh.records.find(r=>r.record_id===pin.record_id);
 if(pin.record_id!=='203-CASE-13')return null;
 if(pin.collection==='annual_original')return annualRecord;
 if(pin.collection==='annual_correction')return annualView.review;
 if(pin.collection==='annual_ai')return annualAi?.decision;
 return null;
}
export function validateRegionalReadings(value,decision=review){
 requireTrue(value.schema_version==='1.0'&&decision.schema_version==='1.0','schema');
 requireTrue(value.edition_id==='CANONICAL-REGIONAL-READINGS-2026-11-22'&&decision.review_id===value.edition_id,'identity');
 requireTrue(value.review_date==='2026-11-22'&&decision.review_date===value.review_date,'date');
 requireTrue(policy.human_review_required===false&&decision.policy_id===policy.policy_id,'authority');
 for(const k of flags)requireTrue(value[k]===false&&decision[k]===false,k);
 requireTrue(value.new_identity_count===0&&decision.new_identity_count===0,'new count');
 requireTrue(value.records.length===5&&decision.records.length===5&&value.sources.length===42,'coverage');
 requireTrue(regionalReadingHash(value.sources)===regionalReadingHash(retainedSources()),'exact retained source inputs');
 requireTrue(new Set(value.sources.map(s=>s.id)).size===42,'source identity');
 requireTrue(regionalReadingHash(decision.historical_inputs_retained)===regionalReadingHash(review.historical_inputs_retained),'historical pins');
 requireTrue(regionalReadingHash(decision.retained_narratives)===regionalReadingHash(review.retained_narratives),'narrative pins');
 for(const pin of decision.retained_narratives)requireTrue(narrativeFor(pin)&&regionalReadingHash(narrativeFor(pin))===pin.sha256,'retained narrative drift '+pin.record_id);
 for(let i=0;i<contracts.length;i++){
  const c=contracts[i],r=value.records[i],d=decision.records[i],a=atlas.places.find(p=>p.atlas_place_id===c.id),p=portfolio.canonical.find(p=>p.route===c.route);
  requireTrue(r.record_id===c.id&&d.record_id===c.id&&r.canonical_id===a.canonical_id&&r.route===c.route&&r.route===a.routes.atlas,'exact identity');
  requireTrue(r.kind==='Place'&&r.eligible_count===1&&p.eligible_count===1&&r.new_identity_count===0,'eligible scope');
  for(const k of ['place_stage_established','project_stage_changed','operating_outcomes_admitted'])requireTrue(r[k]===false,k);
  requireTrue(r.current_cycle_id===null&&r.receipt_ids.length===0&&r.next_check_date===null&&a.relationships.phase_60_cycle_ids.length===0,'no invented gate or appointment');
  requireTrue(r.prior_route===a.routes.prior_profile&&regionalReadingHash(r.aliases)===regionalReadingHash(a.aliases),'retained route/aliases');
  requireTrue(d.atlas_record_sha256===regionalReadingHash(a)&&d.portfolio_decision_sha256===regionalReadingHash(p),'historical scope drift');
  requireTrue(r.title.length>35&&r.answer.length>150&&r.scope.length>140&&r.next_artifacts.length===3&&r.next_artifacts.every(x=>x.length>60),'substantive scope');
  requireTrue(r.sections.length===6&&new Set(r.sections.map(s=>s.heading)).size===6,'complete narrative');
  for(const s of r.sections)requireTrue(s.text.length>350&&['Scope and interpretation','Retained evidence','Interpretation'].includes(s.type)&&s.source_ids.length===new Set(s.source_ids).size,'section');
  requireTrue(regionalReadingHash([...new Set(r.sections.flatMap(s=>s.source_ids))].sort())===regionalReadingHash(c.source_ids),'source ownership/coverage');
  requireTrue(regionalReadingHash(r.related.map(l=>l.route))===regionalReadingHash(c.related),'related scope');
  const text=[r.scope,...r.sections.flatMap(s=>[s.heading,s.text])].join(' ');
  for(const fragment of c.required)requireTrue(text.includes(fragment),'retained boundary '+fragment);
  requireTrue(d.sha256===regionalReadingHash(r)&&d.findings.length===3&&d.findings.every(f=>f.length>90)&&d.decision.includes('production acceptance remains pending'),'assessed version');
 }
 requireTrue(decision.edition_sha256===regionalReadingHash(value),'exact edition');
 return value;
}
validateRegionalReadings(data);
export const canonicalRegionalReadings=data;
export const canonicalRegionalReview=review;
export function regionalReadingFor(place){
 const r=data.records.find(r=>r.record_id===place?.atlas_place_id);if(!r)return null;
 requireTrue(regionalReadingHash(place)===review.records.find(d=>d.record_id===r.record_id).atlas_record_sha256,'runtime place drift');return r;
}
export function regionalReadingForPriorRoute(route){return data.records.find(r=>r.prior_route===route)??null;}
const annualTitles={
 'source-56e-vbb-esv-fire-findings-2021':'ESV statement of technical findings',
 'source-56e-vbb-esv-investigations':'ESV electrical incident investigations index',
 'source-56e-vbb-aemo-registration-2021':'AEMO October 2021 system update',
 'source-56e-vbb-aemo-operational-2021':'AEMO December 2021 reserve-service announcement'
};
export function regionalReadingSources(record){
 requireTrue(data.records.includes(record),'unbound reading');
 const ids=new Set(record.sections.flatMap(s=>s.source_ids));
 return data.sources.filter(s=>ids.has(s.id)).map(source=>{
  const s=source.retained,isAnnual=source.collection==='annual_victoria';
  return {id:source.id,title:s.title??annualTitles[source.id],url:s.url,
   provenance:source.collection==='nevada'?'Retained Nevada dossier inspection':isAnnual?'Retained September annual-case correction':'Retained named-project inspection',
   publisher:s.publisher??(source.id.includes('-esv-')?'Energy Safe Victoria':'AEMO'),
   role:s.role??'Official source checked in the retained annual-case review',
   inspected_date:s.inspection_date??s.retained_checked_date??nevada.inspected_date,
   locator:s.locator,access:s.access??s.inspection,boundary:s.boundary??s.finding,
   dates:Object.entries(s).filter(([key,value])=>value&&(/date$/.test(key)||['period_end','data_period'].includes(key))&&!['inspection_date','retained_checked_date'].includes(key)).map(([key,value])=>({label:key.replaceAll('_',' '),value:String(value)}))
  };
 });
}
