import type { APIRoute } from 'astro';
import { currentEvidenceLedger } from '../../lib/current-evidence.mjs';
export const GET: APIRoute = () => new Response(JSON.stringify(currentEvidenceLedger), {headers:{'Content-Type':'application/json; charset=utf-8'}});
