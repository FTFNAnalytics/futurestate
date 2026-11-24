import {createHash} from 'node:crypto';
import data from '../data/nevada-project-comparison.json' with {type:'json'};
import review from '../data/nevada-project-comparison-review.json' with {type:'json'};
import nevada from '../data/nevada-named-dossiers.json' with {type:'json'};
import nevadaReview from '../data/nevada-named-dossier-reviews.json' with {type:'json'};
import atlas from '../data/phase-119-deep-project-place-atlas.json' with {type:'json'};
import portfolio from '../data/portfolio-eligibility-decisions.json' with {type:'json'};
import policy from '../data/build-review-policy.json' with {type:'json'};
import files from '../data/phase-61-project-conversion-registry.json' with {type:'json'};
import gates from '../data/phase-63-conversion-gate-calendar.json' with {type:'json'};
export const nevadaComparisonHash=value=>createHash('sha256').update(JSON.stringify(value)).digest('hex');
const requireTrue=(condition,message)=>{if(!condition)throw Error('Nevada comparison: '+message);};
const flags=['human_review_claimed','independent_review_claimed','fresh_external_source_check','operating_outcomes_admitted','publication_authorized','launch_authorized','phase_216_complete'];
const expectedRows=[
  {
    "dimension": "Location and project",
    "thacker": {
      "text": "Thacker Pass mine and processing chain in Humboldt County.",
      "source_ids": [
        "ndep-thacker"
      ]
    },
    "rhyolite": {
      "text": "Rhyolite Ridge lithium-boron project in Esmeralda County.",
      "source_ids": [
        "blm-rhyolite-rod"
      ]
    }
  },
  {
    "dimension": "Position in the retained issuer account",
    "thacker": {
      "text": "Major construction reported; completion and ramp-up remain targets.",
      "source_ids": [
        "lac-q3-2026"
      ]
    },
    "rhyolite": {
      "text": "Final investment decision TBA; partnering and refreshed economics remain conditions.",
      "source_ids": [
        "ioneer-q3-2026"
      ]
    }
  },
  {
    "dimension": "Next project-specific evidence",
    "thacker": {
      "text": "Completion and commissioning of named systems, then qualified output over a defined period.",
      "source_ids": []
    },
    "rhyolite": {
      "text": "A dated investment decision and binding commitments before treating preparatory work as plant delivery.",
      "source_ids": []
    }
  }
];
export function validateNevadaComparison(value,decision=review){
 requireTrue(value.schema_version==='1.0'&&decision.schema_version==='1.0'&&value.edition_id==='NEVADA-PROJECT-COMPARISON-2026-11-22'&&decision.review_id===value.edition_id,'edition identity');
 requireTrue(value.review_date==='2026-11-22'&&decision.review_date===value.review_date&&value.source_inspection_date==='2026-11-21'&&value.source_inspection_date===nevada.inspected_date,'distinct dates');
 requireTrue(policy.human_review_required===false&&decision.policy_id===policy.policy_id,'review authority');
 for(const field of flags)requireTrue(value[field]===false&&decision[field]===false,field);
 requireTrue(value.records.length===1&&decision.records.length===1&&decision.new_identity_count===0,'coverage/count');
 const r=value.records[0],pin=decision.records[0],a=atlas.projects.find(x=>x.atlas_project_id==='119-PROJECT-005'),p=portfolio.canonical.find(x=>x.record_id===a.canonical_id);
 requireTrue(r.record_id===a.atlas_project_id&&r.canonical_id===a.canonical_id&&r.route===a.routes.atlas&&r.prior_route===a.routes.prior_casebook,'route/identity');
 requireTrue(r.kind==='Context'&&r.eligible_count===0&&p.eligible_count===0&&r.new_identity_count===0&&r.governed_stage_changed===false&&r.series_admitted===false,'excluded comparison');
 requireTrue(r.retained_named_file_id==='61-PROJECT-NEVADA-LITHIUM'&&r.retained_gate_id==='63-GATE-NEVADA-LITHIUM'&&r.current_cycle_id===null&&r.next_check_date===null,'governed scope');
 const file=files.records.find(x=>x.file_id===r.retained_named_file_id),gate=gates.gate_records.find(x=>x.gate_id===r.retained_gate_id);
 requireTrue(nevadaComparisonHash(file)===decision.retained_file_sha256&&nevadaComparisonHash(gate)===decision.retained_gate_sha256&&gate.gate_mode==='Source Trigger'&&gate.next_check_date===null&&a.relationships.phase_60_cycle_ids.length===0,'retained independent gate');
 requireTrue(nevadaComparisonHash(nevada)===decision.retained_nevada_edition_sha256&&nevadaComparisonHash(nevadaReview)===decision.retained_nevada_review_sha256&&nevadaReview.edition_sha256===nevadaComparisonHash(nevada),'retained named dossiers and assessment');
 requireTrue(nevadaComparisonHash(value.sources)===nevadaComparisonHash(nevada.sources.slice(0,8))&&value.sources.length===8,'exact retained source subset');
 const sourceIds=value.sources.map(s=>s.id);
 requireTrue(r.sections.length===6&&r.sections.every(s=>s.heading.length>25&&s.text.length>380)&&r.next_artifacts.length===3&&r.next_artifacts.every(t=>t.length>90),'complete narrative');
 requireTrue(r.title.length>50&&r.answer.length>200&&r.scope.length>160&&nevadaComparisonHash(r.aliases)===nevadaComparisonHash(a.aliases),'substantive identity');
 requireTrue(nevadaComparisonHash(r.comparison_rows)===nevadaComparisonHash(expectedRows),'comparison values and citations');
 const cited=new Set([...r.sections.flatMap(s=>s.source_ids),...r.comparison_rows.flatMap(row=>[...row.thacker.source_ids,...row.rhyolite.source_ids])]);
 requireTrue(sourceIds.every(id=>cited.has(id))&&[...cited].every(id=>sourceIds.includes(id)),'source ownership/coverage');
 const routes=[...nevada.records.filter(x=>x.kind==='Project').map(x=>x.route),'/atlas/places/nevada-lithium-battery-materials-corridor/','/atlas/places/humboldt-county-nevada/'];
 requireTrue(nevadaComparisonHash(r.related.map(x=>x.route))===nevadaComparisonHash(routes),'separate child and regional links');
 const narrative=[r.scope,...r.sections.map(s=>s.text)].join(' ');
 for(const text of ['zero eligible projects','not completion certificates','final investment decision as TBA','not a fixed production-start date','does not update financing status','not a new court judgment or evidence of universal consent','source-triggered Phase 63 gate remain unchanged','no Phase 60 identity or dated appointment'])requireTrue(narrative.includes(text),'required boundary '+text);
 requireTrue(pin.record_id===r.record_id&&pin.atlas_record_sha256===nevadaComparisonHash(a)&&pin.portfolio_decision_sha256===nevadaComparisonHash(p),'retained identity hashes');
 requireTrue(pin.sha256===nevadaComparisonHash(r)&&pin.findings.length===4&&pin.findings.every(f=>f.length>100)&&pin.decision.includes('excluded Context'),'exact assessed comparison');
 requireTrue(nevadaComparisonHash(decision.historical_inputs_retained)===nevadaComparisonHash(review.historical_inputs_retained),'historical input pins');
 requireTrue(decision.edition_sha256===nevadaComparisonHash(value),'exact edition');
 return value;
}
validateNevadaComparison(data);
export const nevadaComparison=data;
export const nevadaComparisonReview=review;
export function nevadaComparisonFor(project){
 const r=data.records.find(r=>r.record_id===project?.atlas_project_id);if(!r)return null;
 requireTrue(nevadaComparisonHash(project)===review.records[0].atlas_record_sha256,'runtime project drift');return r;
}
export const nevadaComparisonForPriorRoute=route=>data.records.find(r=>r.prior_route===route)??null;
export function nevadaComparisonSources(record){
 requireTrue(data.records.includes(record),'unbound comparison');return data.sources;
}
