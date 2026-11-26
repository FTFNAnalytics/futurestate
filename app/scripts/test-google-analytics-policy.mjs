import assert from 'node:assert/strict';
import {assertOnlyApprovedAnalyticsScripts as check} from './lib/assert-approved-analytics.mjs';

const pair = `<script async src="https://www.googletagmanager.com/gtag/js?id=G-8DR04KSE6W"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'G-8DR04KSE6W');
</script>`;
const page = `<html><head>${pair}</head><body><article>Static reader</article></body></html>`;
check(page);
const mutations = [
  page.replace('www.googletagmanager.com','unapproved.example'),
  page.replaceAll('G-8DR04KSE6W','G-WRONG'),
  page.replace('G-8DR04KSE6W\');', 'G-8DR04 KSE6W\');'),
  page.replace(' async ', ' '),
  page.replace('<script>','<script type="module">'),
  page.replace('</head>', '<script src="https://unapproved.example/code.js"></script></head>'),
  page.replace('</body>', '<script>alert(1)</script></body>'),
  page.replace('</head>', `${pair}</head>`),
  page.replace("gtag('js', new Date());", "gtag('js', new Date());\nfetch('/extra-request');"),
  `<html><head></head><body>${pair}</body></html>`,
  '<html><head></head><body>Untagged</body></html>',
];
for (const [index, mutated] of mutations.entries()) assert.throws(()=>check(mutated), `Reject mutation ${index+1}`);
console.log(`Analytics script policy passed: exact approved pair accepted; ${mutations.length} unauthorized/missing/duplicate mutations rejected.`);
