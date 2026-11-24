import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import {execFileSync} from 'node:child_process';
import {readFile,writeFile} from 'node:fs/promises';
import {dirname,resolve,relative,isAbsolute,join} from 'node:path';
import {fileURLToPath} from 'node:url';

// Proves Git stores the actual evidence bytes, not an EOL-normalized substitute.
// Only a local diagnostic report is written; Git and source files are read-only.
const root=resolve(dirname(fileURLToPath(import.meta.url)),'../..');
const manifestPath=resolve(root,process.argv[2]??'');
const reportRoot=join(root,'outputs/release-checkpoints');
const reportRelative=relative(reportRoot,manifestPath);
assert(reportRelative&&!reportRelative.startsWith('..')&&!isAbsolute(reportRelative),'Supply the captured source-manifest.json under outputs/release-checkpoints.');
const manifest=JSON.parse(await readFile(manifestPath,'utf8'));
const git=(...args)=>execFileSync('git',args,{cwd:root,maxBuffer:32*1024*1024}).toString();
const split=value=>value.split('\0').filter(Boolean);
const index=new Map(split(git('ls-files','--stage','-z')).map(row=>{
  const [metadata,path]=row.split('\t');const [mode,oid,stage]=metadata.split(' ');
  assert.equal(stage,'0',`Unmerged index path: ${path}`);return[path,{mode,oid}];
}));
const changes=split(git('diff','--cached','--name-only','-z'));
const additions=['.gitattributes','app/scripts/verify-source-checkpoint.mjs','supabase/README.md','supabase/schemas/phase58_private_authority_loop.sql'];
const capturedPaths=new Set([...manifest.files.map(row=>row.path),...additions]);
const scope=path=>capturedPaths.has(path);
assert(changes.every(scope),'Staged changes include material outside the FTFN source scope.');
const protectedPath=path=>/(^|\/)(\.env(?:\.[^/]*)?|node_modules|dist|\.astro|private-data|\.sites-stage|\.sites-runtime|outputs)(\/|$)/i.test(path);
assert(changes.every(p=>!protectedPath(p)),'Staged changes include private/runtime files.');
const rows=[];
for(const row of manifest.files){
  const bytes=await readFile(join(root,row.path));
  assert.equal(createHash('sha256').update(bytes).digest('hex'),row.sha256,`Captured source changed: ${row.path}`);
  const oid=createHash('sha1').update(`blob ${bytes.length}\0`).update(bytes).digest('hex');
  assert.equal(index.get(row.path)?.oid,oid,`Git would not reproduce exact bytes: ${row.path}`);
  rows.push({path:row.path,git_blob:oid,sha256:createHash('sha256').update(bytes).digest('hex')});
}
for(const path of additions.filter(path=>!manifest.files.some(row=>row.path===path))){
  const bytes=await readFile(join(root,path));
  const oid=createHash('sha1').update(`blob ${bytes.length}\0`).update(bytes).digest('hex');
  assert.equal(index.get(path)?.oid,oid,`Missing checkpoint tooling: ${path}`);
  rows.push({path,git_blob:oid,sha256:createHash('sha256').update(bytes).digest('hex')});
}
const report={checked_at:new Date().toISOString(),base_commit:git('rev-parse','HEAD').trim(),
  source_candidate_digest:manifest.candidate_digest,source_candidate_receipt:manifest.candidate_receipt,
  exact_git_files:rows.length,staged_files:changes.length,files:rows,
  boundary:'Byte-preserving local checkpoint only; independent review and release remain separate.'};
await writeFile(join(dirname(manifestPath),'git-byte-verification.json'),JSON.stringify(report,null,2)+'\n');
console.log(`Git byte preservation verified for ${rows.length} source files; ${changes.length} staged files stay within the explicit FTFN scope.`);
