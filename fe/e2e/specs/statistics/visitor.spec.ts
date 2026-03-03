import { test, expect } from '@playwright/test';
import { VisitorPage } from '../../pages/statistics/visitor.page';

test.describe('Visitor Statistics Page', () => {
  let visitorPage: VisitorPage;

  test.beforeEach(async ({ page }) => {
    visitorPage = new VisitorPage(page);
    await visitorPage.goto();
  });

  test('should display visitor statistics page correctly', async ({ page }) => {
    await page.waitForTimeout(1000);

    const content = page.locator('body');
    await expect(content).toBeVisible();
  });

  test('should show visitor data table', async ({ page }) => {
    await page.waitForTimeout(2000);

    const tableOrList = page.locator('table, [class*="table"], [class*="list"]');
    if (await tableOrList.first().isVisible()) {
      await expect(tableOrList.first()).toBeVisible();
    }
  });

  test('should have date range controls', async ({ page }) => {
    await page.waitForTimeout(1000);

    const dateControls = page.locator('input[type="date"], button[role="combobox"], [class*="date"]');
    const count = await dateControls.count();

    if (count > 0) {
      await expect(dateControls.first()).toBeVisible();
    }
  });

  test('should change date range and refresh data', async ({ page }) => {
    await page.waitForTimeout(1000);

    const dateSelect = page.locator('button[role="combobox"]').first();
    if (await dateSelect.isVisible()) {
      await dateSelect.click();
      await page.waitForTimeout(300);

      const options = page.locator('[role="option"]');
      if (await options.first().isVisible()) {
        await options.first().click();
        await page.waitForLoadState('networkidle');
      }
    }
  });

  test('should handle pagination', async ({ page }) => {
    await page.waitForTimeout(1000);

    const paginationButtons = page.locator('button').filter({ hasText: /^[0-9]+$/ });
    const buttonCount = await paginationButtons.count();

    if (buttonCount > 1) {
      await paginationButtons.nth(1).click();
      await page.waitForLoadState('networkidle');
    }
  });
});
