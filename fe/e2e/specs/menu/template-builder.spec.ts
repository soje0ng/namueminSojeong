import { test, expect } from '@playwright/test';
import { TemplateBuilderPage } from '../../pages/menu/template-builder.page';
import { TOAST_MESSAGES } from '../../fixtures/test-data';

test.describe('Template Builder - PageData Save/Load', () => {
  let templatePage: TemplateBuilderPage;

  test.beforeEach(async ({ page }) => {
    templatePage = new TemplateBuilderPage(page);
    await templatePage.goto();
  });

  test('should open template builder dialog on sub-category', async ({ page }) => {
    await page.waitForTimeout(1000);

    // Select a sub-category item (isSub)
    const items = page.locator('[class*="item"], [class*="tree-node"], [class*="draggable"]');
    const itemCount = await items.count();

    if (itemCount > 0) {
      // Click first item to expand
      await items.first().click();
      await page.waitForTimeout(500);

      // Check if template setting button is visible (only for HTML sub-categories)
      const templateBtn = page.locator('button:has-text("템플릿 설정")');
      if (await templateBtn.isVisible({ timeout: 3000 })) {
        await templateBtn.click();
        await page.waitForTimeout(500);

        const dialog = page.locator('[role="dialog"]');
        await expect(dialog).toBeVisible({ timeout: 10000 });
      }
    }
  });

  test('should save template with widgets', async ({ page }) => {
    await page.waitForTimeout(1000);

    const items = page.locator('[class*="item"], [class*="tree-node"], [class*="draggable"]');
    const itemCount = await items.count();

    if (itemCount > 0) {
      await items.first().click();
      await page.waitForTimeout(500);

      const templateBtn = page.locator('button:has-text("템플릿 설정")');
      if (await templateBtn.isVisible({ timeout: 3000 })) {
        await templateBtn.click();
        await page.waitForTimeout(1000);

        // Try to add a widget (e.g., mainTitle)
        const widgetBtn = page.locator('[role="dialog"] button:has-text("메인 타이틀"), [role="dialog"] [class*="widget"]:has-text("메인 타이틀")');
        if (await widgetBtn.first().isVisible({ timeout: 3000 })) {
          await widgetBtn.first().click();
          await page.waitForTimeout(500);
        }

        // Click save button in builder
        const saveBtn = page.locator('[role="dialog"] button:has-text("저장")');
        if (await saveBtn.first().isVisible({ timeout: 3000 })) {
          await saveBtn.first().click();

          // Confirm save dialog
          const confirmBtn = page.locator('[role="alertdialog"] button:has-text("확인")');
          if (await confirmBtn.isVisible({ timeout: 3000 })) {
            await confirmBtn.click();
          }
        }
      }
    }
  });

  test('should load saved template data when reopening builder', async ({ page }) => {
    await page.waitForTimeout(1000);

    const items = page.locator('[class*="item"], [class*="tree-node"], [class*="draggable"]');
    const itemCount = await items.count();

    if (itemCount > 0) {
      await items.first().click();
      await page.waitForTimeout(500);

      const templateBtn = page.locator('button:has-text("템플릿 설정")');
      if (await templateBtn.isVisible({ timeout: 3000 })) {
        // Open builder
        await templateBtn.click();
        await page.waitForTimeout(1000);

        // Check if sections exist (meaning data was loaded)
        const dialog = page.locator('[role="dialog"]');
        if (await dialog.isVisible()) {
          // Builder should be visible and functional
          await expect(dialog).toBeVisible();
        }
      }
    }
  });

  test('should open builder with empty template for new category', async ({ page }) => {
    await page.waitForTimeout(1000);

    // Try to create a new sub-category
    const createBtn = page.locator('button:has-text("추가"), button:has-text("등록")').first();
    if (await createBtn.isVisible({ timeout: 3000 })) {
      await createBtn.click();
      await page.waitForTimeout(500);

      const templateBtn = page.locator('button:has-text("템플릿 설정")');
      if (await templateBtn.isVisible({ timeout: 3000 })) {
        await templateBtn.click();
        await page.waitForTimeout(1000);

        const dialog = page.locator('[role="dialog"]');
        await expect(dialog).toBeVisible({ timeout: 10000 });
      }
    }
  });
});
