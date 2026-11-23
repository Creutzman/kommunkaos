import { test, expect } from '@playwright/test';
import { readFileSync } from 'node:fs';

const original = readFileSync(new URL('../fixtures/mvp-0.1.html', import.meta.url), 'utf8');
const setRange = async (page, selector, value) => {
  await page.locator(selector).evaluate((input, next) => {
    const setter = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value').set;
    setter.call(input, next);
    input.dispatchEvent(new Event('input', { bubbles: true }));
    input.dispatchEvent(new Event('change', { bubbles: true }));
  }, String(value));
};

test('four-year flow, visible text and layout match the original; replay resets', async ({ page, context }, testInfo) => {
  const errors = [];
  page.on('pageerror', error => errors.push(error.message));
  page.on('response', response => { if (response.status() >= 400) errors.push(`${response.status()} ${response.url()}`); });
  const baseline = await context.newPage();
  await baseline.route('**/original.html', route => route.fulfill({ contentType: 'text/html', body: original }));
  for (const tab of [page, baseline]) await tab.addInitScript(() => { Math.random = () => .25; });
  await page.goto('./');
  await baseline.goto('http://127.0.0.1:4173/original.html');
  const compare = async () => {
    await expect(page.locator('main')).toHaveText(await baseline.locator('main').innerText(), { useInnerText: true });
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
    const layout = tab => tab.locator('main h1, .stats, section, section label, section input, section button, .meter').evaluateAll(nodes =>
      nodes.filter(node => node.getClientRects().length).map(node => {
        const box = node.getBoundingClientRect();
        return [node.tagName, box.x + scrollX, box.y + scrollY, box.width, box.height];
      }));
    expect(await layout(page)).toEqual(await layout(baseline));
  };
  await compare();
  await page.screenshot({ path: testInfo.outputPath('budget.png'), fullPage: true });
  for (let year = 0; year < 4; year++) {
    for (const tab of [page, baseline]) {
      await setRange(tab, '#tax', year === 0 ? 1.5 : -1);
      await setRange(tab, tab === page ? '#area-0' : '[data-i="0"]', -100);
    }
    await compare();
    for (const tab of [page, baseline]) await tab.getByRole('button', { name: 'Fastställ budgeten →' }).click();
    await compare();
    for (const tab of [page, baseline]) await tab.locator('.choice').nth(year % 3).click();
    await compare();
    if (year === 3) await page.screenshot({ path: testInfo.outputPath('summary.png'), fullPage: true });
    for (const tab of [page, baseline]) await tab.getByRole('button', { name: year === 3 ? 'Visa valresultatet →' : 'Nästa budgetår →' }).click();
    await compare();
  }
  await expect(page.getByRole('button', { name: 'Spela igen' })).toBeVisible();
  for (const tab of [page, baseline]) await tab.getByRole('button', { name: 'Spela igen' }).click();
  await compare();
  await expect(page.getByLabel('Skattejustering')).toHaveValue('0');
  expect(errors).toEqual([]);
});

test('keyboard adjusts labeled budget controls', async ({ page }) => {
  await page.goto('./');
  const tax = page.getByLabel('Skattejustering');
  await tax.focus();
  await page.keyboard.press('ArrowRight');
  await expect(tax).toHaveValue('0.1');
  await expect(page.locator('.stats')).toContainText('0,1 kr');
});
