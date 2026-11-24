import {readdir, readFile} from 'node:fs/promises';
import {dirname, resolve, join} from 'node:path';
import {fileURLToPath} from 'node:url';
import {sourceCurrencyReport} from '../src/lib/source-currency.mjs';

const appRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const sourceRoot = join(appRoot, 'src/content/sources');
const date = new Intl.DateTimeFormat('en-CA', {timeZone:'America/Edmonton', year:'numeric', month:'2-digit', day:'2-digit'}).format(new Date());
const policy = JSON.parse(await readFile(join(appRoot, 'src/data/source-monitoring-policy.json'), 'utf8'));
const sources = await Promise.all((await readdir(sourceRoot)).filter(file => file.endsWith('.json')).sort().map(async file => JSON.parse(await readFile(join(sourceRoot,file), 'utf8'))));
console.log(JSON.stringify(sourceCurrencyReport(sources, policy, date), null, 2));
