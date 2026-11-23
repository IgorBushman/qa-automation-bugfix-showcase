import { test, expect } from '@playwright/test';

const PORTFOLIO_URL = 'https://igorbushman.github.io/';
const PAGE_TITLE = 'Igor Bushmakin — QA Automation & Web Bug-Fix Engineer';

test.describe('Portfolio', () => {
  test('page title matches the portfolio heading', async ({ page }) => {
    const response = await page.goto(PORTFOLIO_URL, { waitUntil: 'domcontentloaded' });

    expect(response?.status()).toBeLessThan(400);
    await expect(page).toHaveTitle(PAGE_TITLE);
  });
});
