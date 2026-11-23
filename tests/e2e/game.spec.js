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

test('four-year rules, events and results match the original; replay resets', async ({ page, context }, testInfo) => {
  const errors = [];
  page.on('pageerror', error => errors.push(error.message));
  page.on('response', response => { if (response.status() >= 400) errors.push(`${response.status()} ${response.url()}`); });
  const baseline = await context.newPage();
  await baseline.route('**/original.html', route => route.fulfill({ contentType: 'text/html', body: original }));
  for (const tab of [page, baseline]) await tab.addInitScript(() => { Math.random = () => .25; });
  await page.goto('./');
  await baseline.goto('http://127.0.0.1:4173/original.html');
  const compare = async () => {
    expect(await page.locator('.stat b').allTextContents()).toEqual(await baseline.locator('.stat b').allTextContents());
    const phase = await page.locator('section[data-phase]').getAttribute('data-phase');
    const reference = baseline.locator(phase === 'budget' ? '#budget' : phase === 'event' ? '#event' : '#result');
    await expect(page.locator('section[data-phase] h2')).toHaveText(await reference.locator('h2').innerText());
    if (phase === 'budget') {
      expect(await page.locator('input').evaluateAll(nodes => nodes.map(n => [n.min, n.max, n.step, n.value])))
        .toEqual(await baseline.locator('input').evaluateAll(nodes => nodes.map(n => [n.min, n.max, n.step, n.value])));
    } else {
      expect(await page.locator('section[data-phase] > p').allTextContents()).toEqual(await reference.locator(':scope > p').allTextContents());
      expect(await page.locator('.choice').allTextContents()).toEqual(await baseline.locator('.choice:visible').allTextContents());
      expect(await page.locator('#groups label').allTextContents()).toEqual(await baseline.locator('#groups label:visible').allTextContents());
    }
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  };
  await compare();
  await page.screenshot({ path: testInfo.outputPath('budget.png'), fullPage: true });
  for (let year = 0; year < 4; year++) {
    for (const tab of [page, baseline]) {
      await setRange(tab, '#tax', year === 0 ? 1.5 : -1);
      await setRange(tab, tab === page ? '#area-0' : '[data-i="0"]', -100);
    }
    await compare();
    for (const tab of [page, baseline]) await tab.getByRole('button', { name: /Fastställ budgeten/ }).click();
    await compare();
    await expect(page.locator('#event h2')).toBeFocused();
    if (year === 0) await page.screenshot({ path: testInfo.outputPath('event.png'), fullPage: true });
    for (const tab of [page, baseline]) await tab.locator('.choice').nth(year % 3).click();
    await compare();
    if (year === 3) await page.screenshot({ path: testInfo.outputPath('summary.png'), fullPage: true });
    for (const tab of [page, baseline]) await tab.getByRole('button', { name: year === 3 ? /Visa valresultatet/ : /Nästa budgetår/ }).click();
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


test('Gunnar reacts to the budget, event, annual result and election', async ({ page }) => {
  await page.addInitScript(() => { Math.random = () => 0; });
  await page.goto('./');
  const speech = page.locator('.speech');
  await expect(speech).toContainText('Vi går back');
  await setRange(page, '#tax', 3);
  await expect(speech).toContainText('Budget i balans');
  await page.getByRole('button', { name: 'Fastställ budgeten' }).click();
  await expect(speech).toContainText('Det här stod inte i budgeten');
  await page.getByRole('button', { name: 'Renovera nu', exact: true }).click();
  await expect(speech).toContainText('Budget i balans');
  await page.getByRole('button', { name: 'Nästa budgetår' }).click();
  await expect(speech).toContainText('Vi går back');
  for (let year = 1; year < 4; year++) {
    await setRange(page, '#area-0', 200);
    await setRange(page, '#area-1', 200);
    await page.getByRole('button', { name: 'Fastställ budgeten' }).click();
    await page.locator('.choice').first().click();
    await expect(speech).toContainText('Minus i bokslutet');
    await page.getByRole('button', { name: year === 3 ? 'Visa valresultatet' : 'Nästa budgetår' }).click();
  }
  await expect(page.locator('#result h2')).toContainText('Du blev omvald');
  await expect(speech).toContainText('Fyra år till');
  await page.getByRole('button', { name: 'Spela igen' }).click();
  await expect(speech).toContainText('Vi går back');
});

test('small screens and reduced motion retain readable, usable controls', async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 700 });
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('./');
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  await expect(page.getByRole('img', { name: /Illustrerat Lagomköping/ })).toBeVisible();
  await expect(page.getByRole('img', { name: /Gunnar Siffrén/ })).toBeVisible();
  for (const control of await page.getByRole('slider').all()) {
    const box = await control.boundingBox();
    expect(box.width).toBeGreaterThan(180);
    expect(box.height).toBeGreaterThanOrEqual(44);
  }
  expect(await page.locator('.game-panel').evaluate(el => getComputedStyle(el).animationName)).toBe('none');
  await page.getByLabel('Skattejustering').focus();
  await page.keyboard.press('ArrowRight');
  await expect(page.getByLabel('Skattejustering')).toHaveValue('0.1');
});
