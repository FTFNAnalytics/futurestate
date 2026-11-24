import {readFile,writeFile} from 'node:fs/promises';
// Avoid needless rewrites of exact outputs. Only a missing file permits creation;
// access, I/O and write failures still propagate and fail the generating command.
export async function writeGeneratedText(path,text,io={readFile,writeFile}){
  try{
    const existing=await io.readFile(path);
    if(existing.equals(Buffer.from(text,'utf8')))return false;
  }catch(error){if(error.code!=='ENOENT')throw error;}
  await io.writeFile(path,text,'utf8');
  return true;
}
