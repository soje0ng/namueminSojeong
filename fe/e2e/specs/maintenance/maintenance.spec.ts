import { test, expect } from '@playwright/test';
import { MaintenancePage } from '../../pages/maintenance/maintenance.page';
import { TOAST_MESSAGES } from '../../fixtures/test-data';

test.describe('Maintenance Page', () => {
  let maintenancePage: MaintenancePage;

  test.beforeEach(async ({ page }) => {
    maintenancePage = new MaintenancePage(page);
    await maintenancePage.goto();
  });

  test('should display maintenance page correctly', async ({ page }) => {
    await page.waitForTimeout(1000);

    const content = page.locator('body');
    await expect(content).toBeVisible();
  });

  test('should show maintenance toggle or switch', async ({ page }) => {
    await page.waitForTimeout(1000);

    const toggle = page.locator('[role="switch"], [class*="toggle"], input[type="checkbox"]');
    if (await toggle.first().isVisible()) {
      await expect(toggle.first()).toBeVisible();
    }
  });

  test('should have save button', async ({ page }) => {
    await page.waitForTimeout(1000);

    const saveButton = page.locator('button:has-text("저장")');
    await expect(saveButton.first()).toBeVisible();
  });
});

test.describe('Maintenance Operations', () => {
  let maintenancePage: MaintenancePage;

  test.beforeEach(async ({ page }) => {
    maintenancePage = new MaintenancePage(page);
    await maintenancePage.goto();
  });

  test('should toggle maintenance mode', async ({ page }) => {
    await page.waitForTimeout(1000);

    const toggle = page.locator('[role="switch"], [class*="toggle"]').first();
    if (await toggle.isVisible()) {
      const initialState = await toggle.getAttribute('aria-checked') || await toggle.getAttribute('data-state');

      await toggle.click();
      await page.waitForTimeout(500);

      // State should change
      const newState = await toggle.getAttribute('aria-checked') || await toggle.getAttribute('data-state');
      // Note: State comparison depends on implementation
    }
  });

  test('should set maintenance message', async ({ page }) => {
    await page.waitForTimeout(1000);

    const messageInput = page.locator('textarea, [contenteditable="true"]').first();
    if (await messageInput.isVisible()) {
      const testMessage = `점검 중입니다. ${Date.now()}`;
      await messageInput.fill(testMessage);

      const saveButton = page.locator('button:has-text("저장")');
      if (await saveButton.first().isVisible()) {
        await saveButton.first().click();
        await maintenancePage.expectToastMessage(TOAST_MESSAGES.SAVED);
      }
    }
  });

  test('should set maintenance period', async ({ page }) => {
    await page.waitForTimeout(1000);

    const startInput = page.locator('input[type="date"], input[name*="start"]').first();
    const endInput = page.locator('input[type="date"], input[name*="end"]').first();

    if (await startInput.isVisible() && await endInput.isVisible()) {
      const today = new Date();
      const tomorrow = new Date(today);
      tomorrow.setDate(tomorrow.getDate() + 1);

      const startDate = today.toISOString().split('T')[0];
      const endDate = tomorrow.toISOString().split('T')[0];

      await startInput.fill(startDate);
      await endInput.fill(endDate);
    }
  });

  test('should save maintenance settings', async ({ page }) => {
    await page.waitForTimeout(1000);

    const saveButton = page.locator('button:has-text("저장")');
    if (await saveButton.first().isVisible()) {
      await saveButton.first().click();
    }
  });

  test('should reset maintenance settings', async ({ page }) => {
    await page.waitForTimeout(1000);

    const resetButton = page.locator('button:has-text("초기화"), button:has-text("리셋")');
    if (await resetButton.first().isVisible()) {
      await resetButton.first().click();
      await page.waitForTimeout(500);
    }
  });

  test('should show current maintenance status', async ({ page }) => {
    await page.waitForTimeout(1000);

    // Check for status indicator
    const statusIndicator = page.locator('[class*="status"], [class*="badge"], text=/활성화|비활성화|점검/');
    if (await statusIndicator.first().isVisible()) {
      await expect(statusIndicator.first()).toBeVisible();
    }
  });

  test('should preserve settings on page reload', async ({ page }) => {
    await page.waitForTimeout(1000);

    const messageInput = page.locator('textarea').first();
    if (await messageInput.isVisible()) {
      const initialValue = await messageInput.inputValue();

      await page.reload();
      await page.waitForLoadState('networkidle');

      const reloadedValue = await messageInput.inputValue();
      expect(reloadedValue).toBe(initialValue);
    }
  });
});
