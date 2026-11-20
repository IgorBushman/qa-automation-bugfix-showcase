import { test, expect } from '@playwright/test';

test.describe('Production Web Application E2E Audit', () => {
  test('01. Zero uncaught runtime or console errors on main entry', async ({ page }) => {
    const runtimeErrors: string[] = [];

    page.on('pageerror', (err) => {
      runtimeErrors.push(`PageError: ${err.message}`);
    });

    page.on('console', (msg) => {
      if (msg.type() === 'error') {
        runtimeErrors.push(`ConsoleError: ${msg.text()}`);
      }
    });

    const response = await page.goto('/', { waitUntil: 'networkidle' });
    expect(response?.status()).toBeLessThan(400);
    expect(runtimeErrors, `Detected JS runtime errors:\n${runtimeErrors.join('\n')}`).toHaveLength(0);
  });

  test('02. No horizontal layout overflow on mobile & desktop viewports', async ({ page }) => {
    await page.goto('/', { waitUntil: 'domcontentloaded' });

    const hasHorizontalOverflow = await page.evaluate(() => {
      return document.documentElement.scrollWidth > document.documentElement.clientWidth;
    });

    expect(hasHorizontalOverflow, 'Horizontal scroll overflow detected').toBe(false);
  });

  test('03. Internal navigation links return valid HTTP status (< 400)', async ({ page, request }) => {
    await page.goto('/', { waitUntil: 'domcontentloaded' });

    const hrefs = await page.$$eval('a[href^="/"]', (anchors) =>
      Array.from(new Set(anchors.map((a) => a.getAttribute('href')).filter(Boolean)))
    );

    for (const href of hrefs.slice(0, 15)) {
      const res = await request.get(href!);
      expect(res.status(), `Broken internal route detected: ${href}`).toBeLessThan(400);
    }
  });

  test('04. API health and malformed payload resilience', async ({ request }) => {
    const res = await request.post('/api/health', {
      data: { invalidPayload: true },
      failOnStatusCode: false,
    });

    expect(res.status(), 'API crashed with 500 on malformed payload').not.toBe(500);
  });
});
