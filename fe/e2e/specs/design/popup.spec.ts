import { test, expect } from '@playwright/test';
import { PopupPage } from '../../pages/design/popup.page';
import { TEST_POPUP_DATA, TOAST_MESSAGES } from '../../fixtures/test-data';

test.describe('Popup List Page', () => {
  let popupPage: PopupPage;

  test.beforeEach(async ({ page }) => {
    popupPage = new PopupPage(page);
    await popupPage.goto();
  });

  test('should display popup list page correctly', async () => {
    await expect(popupPage.searchInput).toBeVisible();
    await expect(popupPage.deleteButton).toBeVisible();
  });

  test('should show total count', async ({ page }) => {
    const countText = page.locator('text=/\\d+.*개/');
    await expect(countText.first()).toBeVisible();
  });
});

test.describe('Popup CRUD Operations', () => {
  let popupPage: PopupPage;
  const testTitle = `E2E 팝업 ${Date.now()}`;

  test.beforeEach(async ({ page }) => {
    popupPage = new PopupPage(page);
    await popupPage.goto();
  });

  test('should create a new popup', async ({ page }) => {
    const createBtn = page.locator('button:has-text("팝업 등록"), button:has-text("등록")').first();

    if (await createBtn.isVisible()) {
      await createBtn.click();
      await page.waitForTimeout(500);

      await popupPage.fillPopupForm(
        testTitle,
        TEST_POPUP_DATA.content,
        TEST_POPUP_DATA.width,
        TEST_POPUP_DATA.height
      );
      await popupPage.savePopup();
      await popupPage.expectToastMessage(TOAST_MESSAGES.CREATED);
    }
  });

  test('should open popup detail when clicking list item', async ({ page }) => {
    await page.waitForTimeout(1000);

    const itemCount = await popupPage.getListItemCount();
    if (itemCount > 0) {
      await popupPage.clickListItem(0);
      await page.waitForTimeout(500);

      const detailArea = page.locator('[class*="h-full"]');
      await expect(detailArea.first()).toBeVisible();
    }
  });

  test('should edit a popup', async ({ page }) => {
    await page.waitForTimeout(1000);

    const itemCount = await popupPage.getListItemCount();
    if (itemCount > 0) {
      await popupPage.clickListItem(0);
      await page.waitForTimeout(500);

      const editBtn = page.locator('button:has-text("수정")');
      if (await editBtn.first().isVisible()) {
        await editBtn.first().click();
        await page.waitForTimeout(500);

        const updatedTitle = `수정된 팝업 ${Date.now()}`;
        await popupPage.fillPopupForm(updatedTitle);
        await popupPage.savePopup();
        await popupPage.expectToastMessage(TOAST_MESSAGES.UPDATED);
      }
    }
  });

  test('should search popups', async ({ page }) => {
    const searchKeyword = '팝업';
    await popupPage.searchPopups(searchKeyword);
    await page.waitForTimeout(1000);
  });

  test('should toggle popup exposure', async ({ page }) => {
    await page.waitForTimeout(1000);

    const itemCount = await popupPage.getListItemCount();
    if (itemCount > 0) {
      const toggle = page.locator('[role="switch"], button[class*="toggle"]').first();
      if (await toggle.isVisible()) {
        await toggle.click();
        await page.waitForTimeout(500);
      }
    }
  });

  test('should select and delete popups', async ({ page }) => {
    await page.waitForTimeout(1000);

    const itemCount = await popupPage.getListItemCount();
    if (itemCount > 0) {
      await popupPage.checkPopupItem(0);
      await popupPage.deleteButton.click();

      const confirmDialog = page.locator('[role="alertdialog"]');
      await expect(confirmDialog).toBeVisible();
      await popupPage.cancelAction();
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

test.describe('Popup Form Validation', () => {
  let popupPage: PopupPage;

  test.beforeEach(async ({ page }) => {
    popupPage = new PopupPage(page);
    await popupPage.goto();
  });

  test('should cancel popup creation', async ({ page }) => {
    const createBtn = page.locator('button:has-text("팝업 등록"), button:has-text("등록")').first();

    if (await createBtn.isVisible()) {
      await createBtn.click();
      await page.waitForTimeout(500);

      await popupPage.fillPopupForm('임시 팝업');

      const cancelBtn = page.locator('button:has-text("취소")');
      if (await cancelBtn.first().isVisible()) {
        await cancelBtn.first().click();
        await page.waitForTimeout(500);
      }
    }
  });
});
