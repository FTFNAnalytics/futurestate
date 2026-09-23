import type {APIRoute} from 'astro';
import reviews from '../../data/annual-case-reviews.json';
export const GET: APIRoute = () => new Response(JSON.stringify(reviews, null, 2), {headers:{'Content-Type':'application/json; charset=utf-8'}});
