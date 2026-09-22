import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import {execFileSync} from 'node:child_process';
import {readFile, writeFile, mkdir, mkdtemp, lstat, copyFile} from 'node:fs/promises';
import {tmpdir} from 'node:os';
import {dirname, join, relative, resolve, isAbsolute} from 'node:path';
import {fileURLToPath} from 'node:url';
import {computeV1refCandidateDigest} from './lib/v1ref-candidate-digest.mjs';

// Local-only source capture. This never stages, commits, pushes or deploys.
const root=resolve(dirname(fileURLToPath(import.meta.url)), '../..');
const git=(...args)=>execFileSync('git',args,{cwd:root,maxBuffer:32*1024*1024}).toString();
const split=value=>value.split('\0').filter(Boolean);
const hash=bytes=>createHash('sha256').update(bytes).digest('hex');
const inside=(parent,path)=>{const p=relative(parent,path);return p!==''&&!p.startsWith('..')&&!isAbsolute(p);};
const scope=path=>['README.md','.gitignore','.gitattributes'].includes(path)||['app/','docs/','deployment/','supabase/'].some(prefix=>path.startsWith(prefix));
const protectedPath=path=>/(^|\/)(\.env(?:\.[^/]*)?|node_modules|dist|\.astro|private-data|\.sites-stage|\.sites-runtime|outputs)(\/|$)/i.test(path);
const head=git('rev-parse','HEAD').trim();
assert.equal(git('diff','--cached','--name-only').trim(),'','Existing staged changes require separate reconciliation.');
assert.equal(git('ls-files','--unmerged').trim(),'','Resolve unmerged paths first.');
assert.equal(git('diff','--name-only','--diff-filter=DR').trim(),'','Deleted or renamed tracked paths require explicit review.');
const tracked=split(git('ls-files','-z'));
const untracked=split(git('ls-files','--others','--exclude-standard','-z'));
const changed=split(git('diff','--name-only','-z'));
const sourceFiles=[...new Set([...tracked,...untracked].filter(scope))].sort();
assert(sourceFiles.every(path=>!protectedPath(path)),'Source scope includes a protected local/runtime path.');
const candidate=await computeV1refCandidateDigest({appRoot:join(root,'app')});
const aggregate=JSON.parse(await readFile(join(root,'app/src/data/v1-public-reference-edition.json'),'utf8'));
assert.equal(candidate.digest,aggregate.local_validation_receipt.artifact_digest,'Candidate changed since its successful receipt.');
const sourceSet=new Set(sourceFiles);
for(const entry of candidate.artifact_paths){
  const path=entry.replace(/#normalized$/,'');
  const absolute=path.startsWith('docs/')?resolve(root,path):resolve(root,'app',path);
  const sourcePath=relative(root,absolute).replaceAll('\\','/');
  assert(sourceSet.has(sourcePath),`Missing candidate source: ${sourcePath}`);
}

const rows=[],findings=[];
const secretPatterns=[/-----BEGIN (?:RSA |EC |OPENSSH )?PRIVATE KEY-----/,/\bgh[pousr]_[A-Za-z0-9]{30,}\b/,/\bart_v1_[a-zA-Z0-9]{25,}\b/,/\bAKIA[0-9A-Z]{16}\b/,/\bsk-(?:proj-)?[a-zA-Z0-9_-]{32,}\b/];
for(const path of sourceFiles){
  const absolute=resolve(root,path);
  assert(inside(root,absolute),`Path escapes source root: ${path}`);
  assert((await lstat(absolute)).isFile(),`Non-regular source entry: ${path}`);
  const bytes=await readFile(absolute);
  if(/\.(?:md|json|mjs|js|ts|astro|css|txt|yaml|yml|toml)$/.test(path)&&secretPatterns.some(p=>p.test(bytes.toString('utf8'))))findings.push(path);
  rows.push({path,bytes:bytes.length,sha256:hash(bytes)});
}
assert.equal(findings.length,0,`Potential credential material requires review in: ${findings.join(', ')}`);
const parent=join(root,'outputs/release-checkpoints');
await mkdir(parent,{recursive:true});
const reportDirectory=await mkdtemp(join(parent,new Date().toISOString().replaceAll(':','-')+'-'));
const scratch=await mkdtemp(join(tmpdir(),'ftfn-source-reproduction-'));
for(const row of rows){
  const destination=resolve(scratch,row.path);
  assert(inside(scratch,destination),'Snapshot destination escaped scratch root.');
  await mkdir(dirname(destination),{recursive:true});
  await copyFile(join(root,row.path),destination);
  assert.equal(hash(await readFile(destination)),row.sha256,`Source changed during copy: ${row.path}`);
}
const copiedCandidate=await computeV1refCandidateDigest({appRoot:join(scratch,'app')});
assert.equal(copiedCandidate.digest,candidate.digest,'Copied candidate differs.');
const stagePaths=[...new Set([...changed,...untracked].filter(scope))].sort();
const excludedChanges=[...new Set([...changed,...untracked].filter(path=>!scope(path)))].sort();
const manifest={schema_version:'1.0',captured_at:new Date().toISOString(),source_root:root,head,
  candidate_receipt:aggregate.local_validation_receipt.receipt_id,candidate_digest:candidate.digest,
  source_manifest_digest:hash(JSON.stringify(rows)),source_file_count:rows.length,
  bytes:rows.reduce((sum,row)=>sum+row.bytes,0),scratch_directory:scratch,stage_paths:stagePaths,
  excluded_changes:excludedChanges,files:rows,git_commit:null,
  scope:'Local source checkpoint and scratch copy only; no external release or review acceptance.'};
await writeFile(join(reportDirectory,'source-manifest.json'),JSON.stringify(manifest,null,2)+'\n');
await writeFile(join(reportDirectory,'stage-paths.nul'),stagePaths.join('\0')+'\0');
console.log(JSON.stringify({report_directory:reportDirectory,scratch_directory:scratch,source_files:rows.length,
  changed_source_files:stagePaths.length,excluded_changes:excludedChanges.length,bytes:manifest.bytes,
  candidate_digest:candidate.digest,source_manifest_digest:manifest.source_manifest_digest},null,2));
