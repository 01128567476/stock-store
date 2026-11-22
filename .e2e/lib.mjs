import puppeteer from 'puppeteer-core';

export const CHROME = 'C:/Program Files/Google/Chrome/Application/chrome.exe';
export const BASE = 'http://127.0.0.1:5199/#';
export const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

export async function pageIn(browser) {
  const page = await browser.newPage();
  await page.setViewport({ width: 1366, height: 1000 });
  await page.setDefaultTimeout(10000);
  page._errors = [];
  page.on('console', (m) => { if (m.type() === 'error') page._errors.push(m.text()); });
  page.on('pageerror', (e) => page._errors.push('PAGEERROR: ' + e.message));
  page.on('dialog', async (d) => { try { await d.accept(); } catch {} });
  return page;
}

export async function setup() {
  const browser = await puppeteer.launch({
    executablePath: CHROME,
    headless: true,
    args: ['--disable-gpu', '--window-size=1366,1000'],
  });
  const page = await pageIn(browser);
  return { browser, page };
}

export const makeOk = (results) => (name, cond, extra = '') => {
  results.push({ name, pass: !!cond, extra: String(extra ?? '') });
  console.log(`${cond ? 'PASS' : 'FAIL'} | ${name}${extra ? ' | ' + extra : ''}`);
};

export const exists = (page, sel) => page.$(sel).then(Boolean);
export const count = (page, sel) => page.$$eval(sel, (els) => els.length).catch(() => -1);
export const txt = (page, sel) => page.$eval(sel, (el) => el.innerText.trim()).catch(() => null);
export const attr = (page, sel, a) => page.$eval(sel, (el, a) => el.getAttribute(a), a).catch(() => null);
export const hash = (page) => page.evaluate(() => location.hash);

// Navigates to the app root first (so there is a real origin), then forces English
export async function ensureEnglish(page) {
  await page.goto(BASE + '/', { waitUntil: 'domcontentloaded' });
  await page.waitForFunction(() => !document.querySelector('.splash'), { timeout: 8000 }).catch(() => {});
  await page.evaluate(() => localStorage.setItem('mv-lang', 'en'));
  await page.reload({ waitUntil: 'domcontentloaded' });
  await page.waitForFunction(() => !document.querySelector('.splash'), { timeout: 8000 }).catch(() => {});
  await sleep(500);
}

export async function go(page, route, wait = 700) {
  if (!page.url().startsWith('http')) {
    await page.goto(BASE + '/', { waitUntil: 'domcontentloaded' });
    await page.waitForFunction(() => !document.querySelector('.splash'), { timeout: 8000 }).catch(() => {});
  }
  await page.evaluate((h) => { location.hash = h; }, route);
  await sleep(wait);
}

export async function smartClick(page, sel) {
  const el = await page.$(sel);
  if (!el) throw new Error('element not found: ' + sel);
  try { await el.click(); } catch { await page.evaluate((e) => e.click(), el); }
}

export async function clickNth(page, sel, n) {
  const els = await page.$$(sel);
  if (!els || !els[n]) throw new Error(`no element ${sel}[${n}]`);
  try { await els[n].click(); } catch { await page.evaluate((e) => e.click(), els[n]); }
}

export async function clickByText(page, sel, needle) {
  return page.evaluate(({ sel, needle }) => {
    const el = [...document.querySelectorAll(sel)].find((e) => e.textContent.includes(needle));
    if (!el) return false;
    el.click();
    return true;
  }, { sel, needle });
}

export async function type(page, sel, value) {
  const el = await page.$(sel);
  if (!el) throw new Error('input not found: ' + sel);
  await page.evaluate((e) => { e.value = ''; }, el);
  await el.type(value, { delay: 8 });
}

// Deterministic alternative to type() for inputs that re-render while typing
// (React controlled inputs bound to URL params): set the value natively and
// fire a single input event.
export async function setInput(page, sel, value, nth = 0) {
  await page.evaluate(({ sel, value, nth }) => {
    const el = [...document.querySelectorAll(sel)][nth];
    if (!el) throw new Error('input not found: ' + sel);
    const setter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value').set;
    setter.call(el, value);
    el.dispatchEvent(new Event('input', { bubbles: true }));
  }, { sel, value, nth });
}

export async function selectNth(page, sel, n, value) {
  await page.evaluate(({ sel, n, value }) => {
    const el = document.querySelectorAll(sel)[n];
    if (!el) throw new Error(`no element ${sel}[${n}]`);
    const setter = Object.getOwnPropertyDescriptor(window.HTMLSelectElement.prototype, 'value').set;
    setter.call(el, value);
    el.dispatchEvent(new Event('change', { bubbles: true }));
  }, { sel, n, value });
}

export const lsGet = (page, key) => page.evaluate((k) => localStorage.getItem(k), key);
export const txtAll = (page, sel) => page.$$eval(sel, (els) => els.map((e) => e.innerText.trim())).catch(() => null);
