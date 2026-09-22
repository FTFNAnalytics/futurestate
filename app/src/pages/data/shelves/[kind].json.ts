import {getShelfCatalog} from '../../../lib/shelf-catalog';
import type {APIRoute} from 'astro';
export async function getStaticPaths(){return Object.entries(await getShelfCatalog()).map(([kind,records])=>({params:{kind},props:{records}}));}
export const GET:APIRoute=({props})=>new Response(JSON.stringify({schema_version:'1.0',scope:'Shelf metadata; publication and evidence acceptance remain distinct',records:props.records}),{headers:{'Content-Type':'application/json; charset=utf-8'}});
