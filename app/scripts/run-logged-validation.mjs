import {spawn} from 'node:child_process';
import {createWriteStream} from 'node:fs';
import {mkdir, mkdtemp, readFile, writeFile} from 'node:fs/promises';
import {dirname, join, resolve} from 'node:path';
import {fileURLToPath} from 'node:url';
import {finished} from 'node:stream/promises';

const root=resolve(dirname(fileURLToPath(import.meta.url)),'..');
const scripts=process.argv.slice(2);
const pkg=JSON.parse(await readFile(join(root,'package.json'),'utf8'));
if(!scripts.length||scripts.some(s=>!Object.hasOwn(pkg.scripts,s)||s==='validation:logged'))throw new Error('Supply one or more existing npm script names, excluding validation:logged.');
const npmCli=process.env.npm_execpath;
if(!npmCli)throw new Error('Run through npm run validation:logged -- <script names>.');
const parent=join(root,'../outputs/validation');
await mkdir(parent,{recursive:true});
const directory=await mkdtemp(join(parent,new Date().toISOString().replaceAll(':','-')+'-'));
const results=[];
console.log(`Validation logs: ${directory}`);
for(const [index,script] of scripts.entries()){
  const log=join(directory,`${index+1}-${script.replaceAll(':','-')}.log`);
  const stream=createWriteStream(log,{flags:'wx'});
  const started=new Date();
  console.log(`Starting npm run ${script}`);
  const child=spawn(process.execPath,[npmCli,'run',script],{cwd:root,env:process.env,shell:false,windowsHide:true,stdio:['ignore','pipe','pipe']});
  let tail='',failure=null;
  stream.on('error',error=>{failure=error;child.kill();});
  for(const output of [child.stdout,child.stderr]){
    output.pipe(stream,{end:false});
    output.on('data',chunk=>{tail=(tail+chunk.toString()).slice(-4000);});
  }
  const progress=setInterval(()=>console.log(`${script}: ${Math.round((Date.now()-started.getTime())/1000)}s; ${tail.replace(/\x1b\[[0-9;]*m/g,'').trim().split(/\r?\n/).at(-1)?.slice(0,200)??'running'}`),30000);
  const code=await new Promise(resolveCode=>{
    child.on('error',error=>{failure=error;});
    child.on('close',value=>resolveCode(value??1));
  });
  clearInterval(progress);stream.end();await finished(stream);
  const result={script,started_at:started.toISOString(),finished_at:new Date().toISOString(),exit_code:code,log,error:failure?.message??null};
  results.push(result);
  await writeFile(join(directory,'results.json'),JSON.stringify({scope:'Local command execution only; not editorial approval, publication or deployment',results},null,2)+'\n');
  console.log(`${script}: exit ${code}; ${log}`);
  if(code!==0||failure){console.error(tail);process.exitCode=1;break;}
}
