import type { APIRoute } from 'astro';
import edition from '../../data/phase-204-reader-completion.json';
export const GET: APIRoute = () => new Response(JSON.stringify(edition), {headers:{'Content-Type':'application/json; charset=utf-8'}});
