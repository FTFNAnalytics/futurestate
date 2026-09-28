import type {APIRoute} from 'astro';
import policy from '../../data/build-review-policy.json';
import adjudications from '../../data/owner-authorized-adjudications.json';
import portfolio from '../../data/portfolio-eligibility-decisions.json';
import montanaDossiers from '../../data/montana-project-dossiers.json';
import translations from '../../data/ai-reviewed-translations.json';
import localityDossiers from '../../data/locality-dossiers.json';
import selectedArticleReviews from '../../data/selected-article-ai-reviews.json';
export const GET:APIRoute=()=>new Response(JSON.stringify({policy,adjudications,portfolio,montana_dossiers:montanaDossiers,translations,locality_dossiers:localityDossiers,selected_article_reviews:selectedArticleReviews}),{headers:{'Content-Type':'application/json; charset=utf-8'}});
