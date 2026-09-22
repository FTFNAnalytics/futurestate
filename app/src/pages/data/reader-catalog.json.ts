import type {APIRoute} from 'astro';
import {readerCatalog} from '../../lib/reader-catalog.mjs';
export const GET:APIRoute=()=>new Response(JSON.stringify({schema_version:'1.0',records:readerCatalog}),{headers:{'Content-Type':'application/json; charset=utf-8'}});
