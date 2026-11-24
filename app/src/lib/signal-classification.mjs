import ledger from '../data/phase-206-editorial-classification.json' with {type:'json'};
import {projectGoldenMarsSignalData} from './golden-mars-signal-review.mjs';
// An isolated ledger enables correction/withdrawal/reapplication tests without changing history.
export function createSignalProjection(records){
  const byId=new Map(structuredClone(records).map(r=>[r.id,r]));
  const classification=id=>byId.get(id)??null;
  const eligible=signal=>signal.data.record_status==='Published'&&(classification(signal.data.id)?.current_feed_eligible??true);
  /**
   * @template {{data:{id:string}}} T
   * @param {T} signal
   * @returns {T & {data:T['data'] & {editorial_classification?:string,current_feed_eligible?:boolean,classification_note?:string}}}
   */
  function project(signal){const data=projectGoldenMarsSignalData(signal.data);const decision=classification(data.id);if(!decision)return data===signal.data?signal:{...signal,data};return {...signal,data:{...data,...(decision.correction??{}),editorial_classification:decision.content_type,current_feed_eligible:decision.current_feed_eligible,classification_note:decision.reason}};}
  return {classification,eligible,project};
}
const current=createSignalProjection(ledger.records);
export const signalClassification=current.classification;
export const isCurrentFeedEligible=current.eligible;
export const projectSignal=current.project;
