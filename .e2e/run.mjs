import { setup, pageIn, makeOk, ensureEnglish } from './lib.mjs';
import t1 from './t1_home_shop.mjs';
import t2 from './t2_buy_flow.mjs';
import t3 from './t3_admin_cat.mjs';
import t4 from './t4_admin_products.mjs';

// Suite selection: `node .e2e/run.mjs t1 t4` runs only those suites.
const only = process.argv.slice(2).filter((a) => !a.startsWith('-'));
const all = [
  ['t1_home_shop', t1, false],
  ['t2_buy_flow', t2, true],
  ['t3_admin_cat', t3, true],
  ['t4_admin_products', t4, true],
];
const suites = only.length ? all.filter(([n]) => only.some((o) => n.startsWith(o))) : all;

const { browser } = await setup();
let totalPass = 0;
let totalFail = 0;
const crashed = [];

for (const [name, fn, forceEn] of suites) {
  console.log(`\n===== ${name} =====`);
  const page = await pageIn(browser);
  if (forceEn) await ensureEnglish(page);
  const results = [];
  const ok = makeOk(results);
  try {
    await fn({ page, results, ok });
  } catch (e) {
    ok(`${name} CRASHED`, false, (e && e.message) || String(e));
    crashed.push(name);
  }
  const pass = results.filter((r) => r.pass).length;
  const fail = results.length - pass;
  totalPass += pass;
  totalFail += fail;
  console.log(`----- ${name}: ${pass} passed, ${fail} failed`);
  await page.close();
}

await browser.close();

console.log(`\n================ E2E SUMMARY ================`);
console.log(`TOTAL: ${totalPass + totalFail} | PASS: ${totalPass} | FAIL: ${totalFail}`);
if (crashed.length) console.log(`CRASHED SUITES: ${crashed.join(', ')}`);
console.log('=============================================');
process.exit(totalFail ? 1 : 0);