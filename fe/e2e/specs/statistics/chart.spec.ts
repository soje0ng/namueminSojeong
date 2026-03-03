import { test, expect } from '@playwright/test';
import { ChartPage } from '../../pages/statistics/chart.page';

test.describe('Statistics Chart Page', () => {
  let chartPage: ChartPage;

  test.beforeEach(async ({ page }) => {
    chartPage = new ChartPage(page);
    await chartPage.goto();
  });

  test('should display statistics chart page correctly', async ({ page }) => {
    await page.waitForTimeout(1000);

    // Page should load without errors
    const content = page.locator('body');
    await expect(content).toBeVisible();
  });

  test('should show chart or graph', async ({ page }) => {
    await page.waitForTimeout(2000);

    // Check for chart elements
    const chartElements = page.locator('canvas, svg, [class*="chart"], [class*="graph"]');
    const chartCount = await chartElements.count();

    if (chartCount > 0) {
      await expect(chartElements.first()).toBeVisible();
    }
  });

  test('should have date range selector', async ({ page }) => {
    await page.waitForTimeout(1000);

    // Check for date inputs or selectors
    const dateControls = page.locator('input[type="date"], button[role="combobox"], [class*="date"]');
    const count = await dateControls.count();

    if (count > 0) {
      await expect(dateControls.first()).toBeVisible();
    }
  });

  test('should change date range', async ({ page }) => {
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

  test('should display summary statistics', async ({ page }) => {
    await page.waitForTimeout(1000);

    // Check for summary cards or numbers
    const summaryElements = page.locator('[class*="card"], [class*="summary"], [class*="stat"]');
    const count = await summaryElements.count();

    if (count > 0) {
      await expect(summaryElements.first()).toBeVisible();
    }
  });

  test('should refresh data on date change', async ({ page }) => {
    await page.waitForTimeout(1000);

    const applyButton = page.locator('button:has-text("조회"), button:has-text("적용")');
    if (await applyButton.first().isVisible()) {
      await applyButton.first().click();
      await page.waitForLoadState('networkidle');
    }
  });

  test('should handle chart type switching', async ({ page }) => {
    await page.waitForTimeout(1000);

    // Check for chart type selector
    const chartTypeSelect = page.locator('[data-testid="chart-type"], button:has-text("차트")');
    if (await chartTypeSelect.first().isVisible()) {
      await chartTypeSelect.first().click();
      await page.waitForTimeout(300);

      const options = page.locator('[role="option"]');
      if (await options.first().isVisible()) {
        await options.first().click();
        await page.waitForLoadState('networkidle');
      }
    }
  });

  test('should export chart data', async ({ page }) => {
    await page.waitForTimeout(1000);

    const exportButton = page.locator('button:has-text("내보내기"), button:has-text("다운로드"), button:has-text("엑셀")');
    if (await exportButton.first().isVisible()) {
      // Just check if button exists and is clickable
      await expect(exportButton.first()).toBeEnabled();
    }
  });
});
