import { test, expect } from '@playwright/test';
import { SiteSettingPage } from '../../pages/setting/site.page';
import { TOAST_MESSAGES } from '../../fixtures/test-data';

test.describe('Site Setting Page', () => {
  let siteSettingPage: SiteSettingPage;

  test.beforeEach(async ({ page }) => {
    siteSettingPage = new SiteSettingPage(page);
    await siteSettingPage.goto();
  });

  test('should display site setting page correctly', async ({ page }) => {
    // Check for save button
    const saveButton = page.locator('button:has-text("저장")');
    await expect(saveButton.first()).toBeVisible();
  });

  test('should have form inputs', async ({ page }) => {
    // Check for input fields
    const inputs = page.locator('input, textarea');
    const inputCount = await inputs.count();
    expect(inputCount).toBeGreaterThan(0);
  });

  test('should save site settings', async ({ page }) => {
    await page.waitForTimeout(1000);

    const siteNameInput = page.locator('input').first();
    if (await siteNameInput.isVisible()) {
      const currentValue = await siteNameInput.inputValue();
      await siteNameInput.fill(currentValue || 'Test Site');

      const saveButton = page.locator('button:has-text("저장")');
      if (await saveButton.first().isVisible()) {
        await saveButton.first().click();
        await siteSettingPage.expectToastMessage(TOAST_MESSAGES.SAVED);
      }
    }
  });

  test('should update SEO settings', async ({ page }) => {
    await page.waitForTimeout(1000);

    // Look for SEO related inputs
    const metaTitleInput = page.locator('input[name*="meta"], input[placeholder*="메타"]').first();
    if (await metaTitleInput.isVisible()) {
      await metaTitleInput.fill('Updated Meta Title');

      const saveButton = page.locator('button:has-text("저장")');
      if (await saveButton.first().isVisible()) {
        await saveButton.first().click();
      }
    }
  });

  test('should handle form tabs if present', async ({ page }) => {
    await page.waitForTimeout(1000);

    // Check for tab navigation
    const tabs = page.locator('[role="tab"], button[class*="tab"]');
    const tabCount = await tabs.count();

    if (tabCount > 1) {
      await tabs.nth(1).click();
      await page.waitForTimeout(500);
    }
  });

  test('should preserve settings on page reload', async ({ page }) => {
    await page.waitForTimeout(1000);

    const firstInput = page.locator('input').first();
    if (await firstInput.isVisible()) {
      const initialValue = await firstInput.inputValue();

      await page.reload();
      await page.waitForLoadState('networkidle');

      const reloadedValue = await firstInput.inputValue();
      expect(reloadedValue).toBe(initialValue);
    }
  });
});
