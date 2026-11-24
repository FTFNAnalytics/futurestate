import assert from 'node:assert/strict';
import {writeGeneratedText} from './lib/write-generated-text.mjs';
const writes=[];
const writeFile=async(...args)=>{writes.push(args);};
assert.equal(await writeGeneratedText('same.txt','same\n',{readFile:async()=>Buffer.from('same\n'),writeFile}),false);
assert.equal(writes.length,0);
assert.equal(await writeGeneratedText('changed.txt','new\n',{readFile:async()=>Buffer.from('old\n'),writeFile}),true);
assert.deepEqual(writes.pop(),['changed.txt','new\n','utf8']);
assert.equal(await writeGeneratedText('newline.txt','line\n',{readFile:async()=>Buffer.from('line\r\n'),writeFile}),true);
assert.deepEqual(writes.pop(),['newline.txt','line\n','utf8']);
assert.equal(await writeGeneratedText('missing.txt','new\n',{readFile:async()=>{throw Object.assign(new Error('missing'),{code:'ENOENT'});},writeFile}),true);
assert.deepEqual(writes.pop(),['missing.txt','new\n','utf8']);
for(const code of ['EACCES','EPERM','UNKNOWN']){
 const failure=Object.assign(new Error(code),{code});
 await assert.rejects(writeGeneratedText('unreadable.txt','new\n',{readFile:async()=>{throw failure;},writeFile}),error=>error===failure);
 await assert.rejects(writeGeneratedText('unwritable.txt','new\n',{readFile:async()=>Buffer.from('old\n'),writeFile:async()=>{throw failure;}}),error=>error===failure);
}
assert.equal(writes.length,0);
console.log('Generated-text checks passed: exact bytes skip writes; changed/missing content writes; newline differences are retained; access and I/O failures propagate. No filesystem mutation in these tests.');
