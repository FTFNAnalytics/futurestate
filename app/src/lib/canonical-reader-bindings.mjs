import {createHash} from 'node:crypto';
import data from '../data/canonical-reader-bindings.json' with {type:'json'};
import initial from '../data/canonical-reader-bindings-initial-2026-11-22.json' with {type:'json'};
import atlas from '../data/phase-119-deep-project-place-atlas.json' with {type:'json'};
import portfolio from '../data/portfolio-eligibility-decisions.json' with {type:'json'};
import editorial from '../data/phase-205-216-current-editorial.json' with {type:'json'};
import {selectedArticleReviews,selectedReviewDate,selectedArticlePresentation,validateSelectedArticleReview} from './selected-article-reviews.mjs';
export const canonicalReaderHash=value=>createHash('sha256').update(JSON.stringify(value)).digest('hex');
const mappings=[
 ['Project','119-PROJECT-002','casebook-toronto-24-254930','191-PROJECT-001','toronto-24-254930',6],
 ['Project','119-PROJECT-012','casebook-hornsdale-power-reserve','191-PROJECT-003','hornsdale-power-reserve',6],
 ['Project','119-PROJECT-013','casebook-victoria-big-battery','191-PROJECT-004','victoria-big-battery',6],
 ['Project','119-PROJECT-014','casebook-dalrymple-grid-battery','191-PROJECT-005','dalrymple-grid-battery',6],
 ['Place','119-PLACE-004','local-ontario-real-estate','192-PLACE-001','ontario-real-estate',7],
 ['Place','119-PLACE-012','local-south-australia-grid-storage','192-PLACE-002','south-australia-grid-storage',6],
];
const expectedRelations=[{"from":"119-PROJECT-014","to":"119-PLACE-012","label":"South Australia system context; not a statewide battery result"},{"from":"119-PLACE-012","to":"119-PROJECT-014","label":"Dalrymple's separate local-network account"},{"from":"119-PLACE-012","to":"119-PROJECT-012","label":"Hornsdale's separate service and reporting record"},{"from":"119-PLACE-004","to":"119-PROJECT-002","label":"Toronto application 24 254930; a separate project decision"},{"from":"119-PROJECT-002","to":"119-PLACE-004","label":"Ontario housing context; not a project approval"}];
const requireTrue=(condition,message)=>{if(!condition)throw Error('Canonical reader binding: '+message);};
export function validateCanonicalReaderBindings(value,{atlasRegistry=atlas,portfolioRegistry=portfolio,editorialRegistry=editorial,reviews=selectedArticleReviews}={}){
 requireTrue(value.schema_version==='1.0'&&value.policy_id==='OWNER-AUTHORIZED-AI-REVIEW-2026-09-25'&&value.review_date==='2026-11-22','policy/date');
 requireTrue(value.review_id==='CANONICAL-READER-BINDINGS-2026-11-22'&&value.reviewer===data.reviewer&&value.decision===data.decision&&value.boundary===data.boundary,'review scope');
 for(const key of ['human_review_claimed','fresh_external_source_check','operating_outcomes_admitted','publication_authorized','launch_authorized','phase_216_complete'])requireTrue(value[key]===false,key);
 requireTrue(value.new_identity_count===0,'identity inflation');
 requireTrue(value.revision===2&&JSON.stringify(value.prior_revision)===JSON.stringify(data.prior_revision),'revision');
 requireTrue(JSON.stringify(value.records?.slice(0,3))===JSON.stringify(initial.records),'initial decisions changed');
 requireTrue(JSON.stringify(value.related_readings)===JSON.stringify(expectedRelations),'related scopes');
 requireTrue(Array.isArray(value.records)&&value.records.length===mappings.length,'record coverage');
 requireTrue(JSON.stringify(value.historical_inputs_retained)===JSON.stringify(data.historical_inputs_retained),'historical pins');
 for(const [kind,atlasId,canonicalId,articleId,slug,sectionCount] of mappings){
  const matches=value.records.filter(r=>r.atlas_record_id===atlasId);requireTrue(matches.length===1,'duplicate/missing binding');
  const group=kind==='Project'?'projects':'places',idKey=kind==='Project'?'atlas_project_id':'atlas_place_id',referenceGroup=kind==='Project'?'international-projects':'global-places-ii';
  const r=matches[0],project=atlasRegistry[group].find(p=>p[idKey]===atlasId),decision=portfolioRegistry.canonical.find(p=>p.record_id===canonicalId);
  const article=editorialRegistry.records.find(a=>a.record_id===articleId),review=reviews.find(x=>x.record_id===articleId);
  requireTrue(project&&decision&&article&&review,'missing exact input');
  requireTrue(article.kind===kind&&decision.kind===kind,'project/place boundary');
  requireTrue(r.binding_id==='CANONICAL-READER-'+atlasId&&r.canonical_id===canonicalId&&r.article_record_id===articleId,'identity');
  requireTrue(r.target_route==='/atlas/'+group+'/'+slug+'/'&&r.target_route===project.routes.atlas&&r.target_route===decision.route,'target route');
  requireTrue(r.article_route==='/reference/'+referenceGroup+'/'+slug+'/'&&r.article_route===article.route&&r.article_route===review.route&&r.article_route!==r.target_route,'original route');
  requireTrue(r.article_title===article.title&&r.article_sha256===canonicalReaderHash(article)&&r.article_review_sha256===review.sha256,'article/review hash');
  validateSelectedArticleReview(review,article);
  requireTrue(r.atlas_record_sha256===canonicalReaderHash(project)&&r.portfolio_decision_sha256===canonicalReaderHash(decision)&&decision.eligible_count===1,'Atlas/eligibility input');
  const view=selectedArticlePresentation(article,{route:article.route});
  requireTrue(view.review===review&&r.presentation_sha256===canonicalReaderHash(view.article),'exact authorised presentation');
  requireTrue(r.original_review_date===selectedReviewDate&&r.section_count===sectionCount&&article.sections.length===sectionCount&&r.nested_paragraph_count===article.sections.reduce((n,s)=>n+(s.paragraphs?.length??0),0),'dates/complete text');
  const original=data.records.find(x=>x.binding_id===r.binding_id);
  for(const key of ['decision','findings','current_status_boundary','historical_atlas_handling'])requireTrue(JSON.stringify(r[key])===JSON.stringify(original[key]),'changed editorial decision');
 }
 return value;
}
validateCanonicalReaderBindings(data);
export const canonicalReaderBindings=data;
export const canonicalReaderIntegrationDate=data.review_date;
function canonicalReaderForEntity(project,idKey){
 const binding=data.records.find(r=>r.atlas_record_id===project?.[idKey]);
 if(!binding)return null;
 requireTrue(canonicalReaderHash(project)===binding.atlas_record_sha256,'changed runtime Atlas input');
 return {binding,article:editorial.records.find(a=>a.record_id===binding.article_record_id)};
}
export const canonicalReaderForProject=project=>canonicalReaderForEntity(project,'atlas_project_id');
export const canonicalReaderForPlace=place=>canonicalReaderForEntity(place,'atlas_place_id');
export function canonicalReaderLinksFor(bindingId){
 const from=data.records.find(r=>r.binding_id===bindingId);if(!from)return [];
 return data.related_readings.filter(r=>r.from===from.atlas_record_id).map(link=>{
  const target=data.records.find(r=>r.atlas_record_id===link.to);
  requireTrue(target&&target.binding_id!==bindingId,'invalid related reading');
  return {label:link.label,route:target.target_route,title:target.article_title};
 });
}
// The selected-review API stays route-exact. Only this separately reviewed mapping
// can reuse its presentation on a second, explicitly named route.
export function canonicalReaderPresentation(article,{route}={}){
 const binding=data.records.find(r=>r.article_record_id===article?.record_id&&r.target_route===route);
 if(!binding)return null;
 requireTrue(canonicalReaderHash(article)===binding.article_sha256,'changed runtime article');
 const presentation=selectedArticlePresentation(article,{route:binding.article_route});
 requireTrue(presentation.review?.sha256===binding.article_review_sha256&&canonicalReaderHash(presentation.article)===binding.presentation_sha256,'runtime presentation drift');
 return {binding,presentation};
}
