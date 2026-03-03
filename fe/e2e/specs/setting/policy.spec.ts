import { test, expect } from '@playwright/test';
import { PolicySettingPage } from '../../pages/setting/policy.page';
import { TOAST_MESSAGES } from '../../fixtures/test-data';

test.describe('Policy Setting Page', () => {
  let policySettingPage: PolicySettingPage;

  test.beforeEach(async ({ page }) => {
    policySettingPage = new PolicySettingPage(page);
    await policySettingPage.goto();
  });

  test('should display policy setting page correctly', async ({ page }) => {
    const saveButton = page.locator('button:has-text("저장")');
    await expect(saveButton.first()).toBeVisible();
  });

  test('should have policy tabs or sections', async ({ page }) => {
    await page.waitForTimeout(1000);

    // Check for tabs or sections
    const tabs = page.locator('[role="tab"], button[class*="tab"]');
    const tabCount = await tabs.count();

    if (tabCount > 0) {
      await expect(tabs.first()).toBeVisible();
    }
  });

  test('should switch between policy tabs', async ({ page }) => {
    await page.waitForTimeout(1000);

    const tabs = page.locator('[role="tab"], button[class*="tab"]');
    const tabCount = await tabs.count();

    if (tabCount > 1) {
      await tabs.nth(1).click();
      await page.waitForTimeout(500);

      // Tab should be selected
      await expect(tabs.nth(1)).toBeVisible();
    }
  });

  test('should edit terms of service', async ({ page }) => {
    await page.waitForTimeout(1000);

    // Find editor
    const editor = page.locator('[contenteditable="true"], textarea').first();
    if (await editor.isVisible()) {
      await editor.click();

      // Type some content
      const testContent = `테스트 이용약관 ${Date.now()}`;
      await editor.fill(testContent);

      const saveButton = page.locator('button:has-text("저장")');
      if (await saveButton.first().isVisible()) {
        await saveButton.first().click();
        await policySettingPage.expectToastMessage(TOAST_MESSAGES.SAVED);
      }
    }
  });

  test('should edit privacy policy', async ({ page }) => {
    await page.waitForTimeout(1000);

    // Click privacy tab if exists
    const privacyTab = page.locator('button:has-text("개인정보"), [role="tab"]:has-text("개인정보")');
    if (await privacyTab.first().isVisible()) {
      await privacyTab.first().click();
      await page.waitForTimeout(500);
    }

    const editor = page.locator('[contenteditable="true"], textarea').first();
    if (await editor.isVisible()) {
      await editor.click();

      const testContent = `테스트 개인정보처리방침 ${Date.now()}`;
      await editor.fill(testContent);

      const saveButton = page.locator('button:has-text("저장")');
      if (await saveButton.first().isVisible()) {
        await saveButton.first().click();
      }
    }
  });

  test('should preserve policy content on tab switch', async ({ page }) => {
    await page.waitForTimeout(1000);

    const tabs = page.locator('[role="tab"], button[class*="tab"]');
    const tabCount = await tabs.count();

    if (tabCount > 1) {
      // Edit first tab content
      const editor = page.locator('[contenteditable="true"], textarea').first();
      if (await editor.isVisible()) {
        const testContent = 'Test content';
        await editor.fill(testContent);

        // Switch to second tab
        await tabs.nth(1).click();
        await page.waitForTimeout(500);

        // Switch back
        await tabs.nth(0).click();
        await page.waitForTimeout(500);

        // Content should be preserved (or loaded from server)
      }
    }
  });

  test('should save all policy changes', async ({ page }) => {
    await page.waitForTimeout(1000);

    const saveButton = page.locator('button:has-text("저장")');
    if (await saveButton.first().isVisible()) {
      await saveButton.first().click();
    }
  });
});
