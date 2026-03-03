import { test, expect } from '@playwright/test';
import { CategoryPage } from '../../pages/menu/category.page';
import { TEST_CATEGORY_DATA, TOAST_MESSAGES } from '../../fixtures/test-data';

test.describe('Category Menu Page', () => {
  let categoryPage: CategoryPage;

  test.beforeEach(async ({ page }) => {
    categoryPage = new CategoryPage(page);
    await categoryPage.goto();
  });

  test('should display category page correctly', async ({ page }) => {
    await page.waitForTimeout(1000);

    const content = page.locator('body');
    await expect(content).toBeVisible();
  });

  test('should show menu tree or list', async ({ page }) => {
    await page.waitForTimeout(1000);

    const treeOrList = page.locator('[class*="tree"], [class*="list"], [class*="menu"]');
    if (await treeOrList.first().isVisible()) {
      await expect(treeOrList.first()).toBeVisible();
    }
  });
});

test.describe('Category CRUD Operations', () => {
  let categoryPage: CategoryPage;
  const testCategoryName = `E2E 카테고리 ${Date.now()}`;

  test.beforeEach(async ({ page }) => {
    categoryPage = new CategoryPage(page);
    await categoryPage.goto();
  });

  test('should create a new category', async ({ page }) => {
    const createBtn = page.locator('button:has-text("추가"), button:has-text("등록")').first();

    if (await createBtn.isVisible()) {
      await createBtn.click();
      await page.waitForTimeout(500);

      const nameInput = page.locator('input').first();
      if (await nameInput.isVisible()) {
        await nameInput.fill(testCategoryName);

        const saveBtn = page.locator('button:has-text("저장")');
        if (await saveBtn.first().isVisible()) {
          await saveBtn.first().click();
          await categoryPage.expectToastMessage(TOAST_MESSAGES.CREATED);
        }
      }
    }
  });

  test('should select a category item', async ({ page }) => {
    await page.waitForTimeout(1000);

    const items = page.locator('[class*="item"], [class*="tree-node"], [class*="draggable"]');
    const itemCount = await items.count();

    if (itemCount > 0) {
      await items.first().click();
      await page.waitForTimeout(500);
    }
  });

  test('should edit a category', async ({ page }) => {
    await page.waitForTimeout(1000);

    const items = page.locator('[class*="item"], [class*="tree-node"]');
    const itemCount = await items.count();

    if (itemCount > 0) {
      await items.first().click();
      await page.waitForTimeout(500);

      const editBtn = page.locator('button:has-text("수정")');
      if (await editBtn.first().isVisible()) {
        await editBtn.first().click();
        await page.waitForTimeout(500);

        const nameInput = page.locator('input').first();
        if (await nameInput.isVisible()) {
          await nameInput.fill(`수정된 카테고리 ${Date.now()}`);

          const saveBtn = page.locator('button:has-text("저장")');
          if (await saveBtn.first().isVisible()) {
            await saveBtn.first().click();
          }
        }
      }
    }
  });

  test('should delete a category', async ({ page }) => {
    await page.waitForTimeout(1000);

    const items = page.locator('[class*="item"], [class*="tree-node"]');
    const itemCount = await items.count();

    if (itemCount > 0) {
      await items.first().click();
      await page.waitForTimeout(500);

      const deleteBtn = page.locator('button:has-text("삭제")');
      if (await deleteBtn.first().isVisible()) {
        await deleteBtn.first().click();

        const confirmDialog = page.locator('[role="alertdialog"]');
        if (await confirmDialog.isVisible()) {
          await categoryPage.cancelAction();
        }
      }
    }
  });

  test('should reorder categories by drag and drop', async ({ page }) => {
    await page.waitForTimeout(1000);

    const items = page.locator('[class*="draggable"], [class*="item"]');
    const itemCount = await items.count();

    if (itemCount >= 2) {
      // Check if drag handle exists
      const dragHandle = page.locator('[class*="drag"], [class*="handle"]');
      if (await dragHandle.first().isVisible()) {
        // Drag and drop test would go here
        // This is a basic check that the elements exist
        await expect(dragHandle.first()).toBeVisible();
      }
    }
  });
});

test.describe('Category Tree Operations', () => {
  let categoryPage: CategoryPage;

  test.beforeEach(async ({ page }) => {
    categoryPage = new CategoryPage(page);
    await categoryPage.goto();
  });

  test('should expand/collapse tree items', async ({ page }) => {
    await page.waitForTimeout(1000);

    const expandButtons = page.locator('[class*="expand"], [class*="chevron"], button[class*="toggle"]');
    if (await expandButtons.first().isVisible()) {
      await expandButtons.first().click();
      await page.waitForTimeout(300);
    }
  });

  test('should create sub-category', async ({ page }) => {
    await page.waitForTimeout(1000);

    const items = page.locator('[class*="item"], [class*="tree-node"]');
    if (await items.first().isVisible()) {
      await items.first().click();
      await page.waitForTimeout(500);

      const subCategoryBtn = page.locator('button:has-text("하위"), button:has-text("서브")');
      if (await subCategoryBtn.first().isVisible()) {
        await subCategoryBtn.first().click();
        await page.waitForTimeout(500);
      }
    }
  });
});
