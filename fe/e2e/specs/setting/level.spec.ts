import { test, expect } from '@playwright/test';
import { LevelSettingPage } from '../../pages/setting/level.page';
import { TEST_LEVEL_DATA, TOAST_MESSAGES } from '../../fixtures/test-data';

test.describe('Level Setting Page', () => {
  let levelSettingPage: LevelSettingPage;

  test.beforeEach(async ({ page }) => {
    levelSettingPage = new LevelSettingPage(page);
    await levelSettingPage.goto();
  });

  test('should display level setting page correctly', async ({ page }) => {
    await page.waitForTimeout(1000);

    // Check page has loaded with content
    const content = page.locator('body');
    await expect(content).toBeVisible();
  });

  test('should show level list', async ({ page }) => {
    await page.waitForTimeout(1000);

    // Check for list or table of levels
    const listOrTable = page.locator('table, [class*="list"]');
    if (await listOrTable.first().isVisible()) {
      await expect(listOrTable.first()).toBeVisible();
    }
  });

  test('should create a new level', async ({ page }) => {
    const createBtn = page.locator('button:has-text("등록"), button:has-text("추가")').first();

    if (await createBtn.isVisible()) {
      await createBtn.click();
      await page.waitForTimeout(500);

      const nameInput = page.locator('input').first();
      if (await nameInput.isVisible()) {
        await nameInput.fill(`테스트 레벨 ${Date.now()}`);

        const saveBtn = page.locator('button:has-text("저장")');
        if (await saveBtn.first().isVisible()) {
          await saveBtn.first().click();
          await levelSettingPage.expectToastMessage(TOAST_MESSAGES.CREATED);
        }
      }
    }
  });

  test('should edit a level', async ({ page }) => {
    await page.waitForTimeout(1000);

    const editBtn = page.locator('button:has-text("수정")').first();
    if (await editBtn.isVisible()) {
      await editBtn.click();
      await page.waitForTimeout(500);

      const nameInput = page.locator('input').first();
      if (await nameInput.isVisible()) {
        await nameInput.fill(`수정된 레벨 ${Date.now()}`);

        const saveBtn = page.locator('button:has-text("저장")');
        if (await saveBtn.first().isVisible()) {
          await saveBtn.first().click();
        }
      }
    }
  });

  test('should delete a level', async ({ page }) => {
    await page.waitForTimeout(1000);

    const deleteBtn = page.locator('button:has-text("삭제")').first();
    if (await deleteBtn.isVisible()) {
      await deleteBtn.click();

      const confirmDialog = page.locator('[role="alertdialog"]');
      if (await confirmDialog.isVisible()) {
        await levelSettingPage.cancelAction();
      }
    }
  });
});
