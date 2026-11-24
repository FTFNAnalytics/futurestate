import type{APIRoute}from'astro';
import data from '../../data/phase-206-editorial-classification.json';
export const GET:APIRoute=()=>new Response(JSON.stringify(data),{headers:{'Content-Type':'application/json; charset=utf-8'}});
