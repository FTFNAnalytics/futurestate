import {projectBriefing,projectResearchDocument} from "./reference-attribution.mjs";
import {getCollection} from 'astro:content';
import ledger from '../data/phase-206-editorial-classification.json';
import operations from '../data/phase-207-current-operations.json';
import {createShelfData} from './shelf-data.mjs';
export interface ShelfRecord {id:string;title:string;summary:string;route:string;date:string;searchText?:string;filters:Record<string,string[]>;facts?:{label:string;value:string}[];}
interface ShelfData {shelves:Record<string,ShelfRecord[]>;labels:Record<string,string>;sourceRows:any[];asOfDate:string;}
let cached:Promise<ShelfData>|undefined;
export function getShelfData():Promise<ShelfData>{
  return cached??= (async()=>{
    const [signals,documents,collections,sources,topics,organizations,technologies,localSystems,dependencyMaps,updates,readerPathways,briefings,evidenceGaps]=await Promise.all([
      getCollection('signals'),getCollection('researchDocuments').then(records => records.map(projectResearchDocument)),getCollection('researchCollections'),getCollection('sources'),getCollection('topics'),getCollection('organizations'),getCollection('technologies'),getCollection('localSystems'),getCollection('dependencyMaps'),getCollection('updates'),getCollection('readerPathways'),getCollection('briefings').then(records => records.map(projectBriefing)),getCollection('evidenceGaps')
    ]);
    const raw=(rows:any[])=>rows.map(r=>r.data);
    return createShelfData({signals:raw(signals),documents:raw(documents),collections:raw(collections),sources:raw(sources),topics:raw(topics),organizations:raw(organizations),technologies:raw(technologies),localSystems:raw(localSystems),dependencyMaps:raw(dependencyMaps),updates:raw(updates),readerPathways:raw(readerPathways),briefings:raw(briefings),evidenceGaps:raw(evidenceGaps)},ledger,operations);
  })();
}
export async function getShelfCatalog(){return (await getShelfData()).shelves;}
