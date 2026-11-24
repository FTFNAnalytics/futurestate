import {getShelfData} from '../../../lib/shelf-catalog';
import type {APIRoute} from 'astro';
export async function getStaticPaths(){const {shelves,asOfDate}=await getShelfData();return Object.entries(shelves).map(([kind,records])=>({params:{kind},props:{records,asOfDate}}));}
export const GET:APIRoute=({props})=>new Response(JSON.stringify({schema_version:'1.0',scope:'Shelf metadata; publication and evidence acceptance remain distinct',metadata_as_of_date:props.asOfDate,records:props.records}),{headers:{'Content-Type':'application/json; charset=utf-8'}});
