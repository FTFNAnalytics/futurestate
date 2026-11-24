import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import vm from 'node:vm';
import ts from 'typescript';
import {searchReaders} from '../src/lib/reader-search.mjs';
const source=await readFile(new URL('../src/pages/reference/explore/[page].astro',import.meta.url),'utf8');
const inline=source.match(/<script>([\s\S]*?)<\/script>/)[1].replace(/import \{searchReaders\} from '[^']+';/,'');
const compiled=ts.transpileModule(inline,{compilerOptions:{target:ts.ScriptTarget.ES2022,module:ts.ModuleKind.None}}).outputText;
const flush=()=>new Promise(resolve=>setImmediate(resolve));
const record=(title,language='en')=>({title,summary:title+' summary',route:'/reading/'+encodeURIComponent(title)+'/',kind:'Report',language,date:'2026-09-27',status:'AI reviewed'});
const records=[record('Quantum edition'),record('Toronto application')];
function harness(){
  const fields={q:{value:''},kind:{value:''}},handlers={},events={},requests=[],urls=[];
  const form={elements:{namedItem:name=>fields[name]},addEventListener:(event,fn)=>handlers[event]=fn};
  const node=tag=>({tag,textContent:'',children:[],append(...children){this.children.push(...children);},replaceChildren(...children){this.children=children;},addEventListener(event,fn){this[event]=fn;}});
  const result=node('div'),status=node('p'),more=node('button');
  const location={pathname:'/reference/explore/1/',search:''};
  const context={document:{querySelector:selector=>({'#reader-search':form,'#reader-results':result,'#reader-status':status,'#more-results':more}[selector]),createElement:node},window:{addEventListener:(event,fn)=>events[event]=fn},location,history:{pushState:(_a,_b,url)=>urls.push(url)},URLSearchParams,FormData:class {constructor(){return Object.entries(fields).map(([name,input])=>[name,input.value]);}},searchReaders,fetch:url=>new Promise((resolve,reject)=>requests.push({url,resolve,reject}))};
  vm.runInNewContext(compiled,context);
  return {fields,result,status,more,requests,urls,events,location,submit(query,kind=''){fields.q.value=query;fields.kind.value=kind;handlers.submit({preventDefault(){}});},titles(){return result.children.map(c=>c.children[0].children[0].textContent);},success(index,data=records){requests[index].resolve({ok:true,json:async()=>({records:data})});return flush();}};
}
for(const stale of ['success','network-error','http-error','json-error']){
  const h=harness();h.submit('quantum');h.submit('Toronto');assert.equal(h.requests.length,2);assert.equal(h.more.disabled,true);
  await h.success(1);assert.deepEqual(h.titles(),['Toronto application']);const status=h.status.textContent;
  if(stale==='success')await h.success(0,[record('Quantum stale edition')]);
  else if(stale==='network-error'){h.requests[0].reject(new Error('Older request failed'));await flush();}
  else {h.requests[0].resolve({ok:stale!=='http-error',json:async()=>{throw Error('Older JSON failed');}});await flush();}
  assert.deepEqual(h.titles(),['Toronto application']);assert.equal(h.status.textContent,status);assert.equal(h.fields.q.value,'Toronto');assert.match(h.urls.at(-1),/q=Toronto/);assert.equal(h.more.disabled,false);
  h.submit('quantum');await flush();assert.deepEqual(h.titles(),['Quantum edition'],'Stale response must not replace the cached catalog');assert.equal(h.requests.length,2);
}
{
  const h=harness();let resolveJson;
  h.submit('quantum');h.requests[0].resolve({ok:true,json:()=>new Promise(resolve=>resolveJson=resolve)});await flush();
  h.submit('Toronto');await h.success(1);resolveJson({records:[record('Quantum stale JSON')]});await flush();
  assert.deepEqual(h.titles(),['Toronto application'],'Guard must also cover response-body completion');
}
{
  const h=harness();h.submit('quantum');h.requests[0].reject(new Error('Current failure'));await flush();
  assert.match(h.status.textContent,/Use the numbered pages/);assert.equal(h.more.disabled,false);
  h.submit('Toronto');await h.success(1);assert.deepEqual(h.titles(),['Toronto application']);
  h.submit('absent words');await flush();assert.equal(h.result.children.length,0);assert.match(h.status.textContent,/No matching reader editions/);assert.equal(h.more.hidden,true);
}
{
  const h=harness();h.submit('');await h.success(0,Array.from({length:81},(_,i)=>record('Lecture '+i,i===0?'fr-CA':'en')));
  assert.equal(h.result.children.length,40);assert.equal(h.more.hidden,false);assert.equal(h.result.children[0].children[0].children[0].lang,'fr-CA');
  h.more.click();assert.equal(h.result.children.length,80);h.more.click();assert.equal(h.result.children.length,81);assert.equal(h.more.hidden,true);
  h.location.search='?q=Lecture+5&kind=Report';h.events.popstate();await flush();assert.equal(h.fields.q.value,'Lecture 5');assert.equal(h.requests.length,1);assert(h.titles().every(t=>t.includes('5')));
}
assert.match(source,/<noscript>/);assert.match(source,/Reader catalog pages/);
console.log('Reader-search regressions passed against the actual inline script: stale success, network/HTTP/JSON errors and delayed JSON cannot overwrite the latest results, status or cache; retry, empty results, history restore, language metadata and 40/80/81 pagination retained. Node VM tests only; no browser or human observations.');
