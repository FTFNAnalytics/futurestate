import type { APIRoute } from 'astro';
import {currentGapReviewLedger} from '../../lib/current-gap-reviews.mjs';
export const GET: APIRoute=()=>new Response(JSON.stringify(currentGapReviewLedger),{headers:{'Content-Type':'application/json; charset=utf-8'}});
