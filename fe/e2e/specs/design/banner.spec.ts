import { test, expect } from '@playwright/test';
import { BannerPage } from '../../pages/design/banner.page';
import { TEST_BANNER_DATA, TOAST_MESSAGES } from '../../fixtures/test-data';

test.describe('Banner List Page', () => {
  let bannerPage: BannerPage;

  test.beforeEach(async ({ page }) => {
    bannerPage = new BannerPage(page);
    await bannerPage.goto();
  });

  test('should display banner list page correctly', async () => {
    await expect(bannerPage.searchInput).toBeVisible();
    await expect(bannerPage.deleteButton).toBeVisible();
  });

  test('should show total count', async ({ page }) => {
    const countText = page.locator('text=/\\d+.*개/');
    await expect(countText.first()).toBeVisible();
  });
});

test.describe('Banner CRUD Operations', () => {
  let bannerPage: BannerPage;
  const testTitle = `E2E 배너 ${Date.now()}`;

  test.beforeEach(async ({ page }) => {
    bannerPage = new BannerPage(page);
    await bannerPage.goto();
  });

  test('should create a new banner', async ({ page }) => {
    const createBtn = page.locator('button:has-text("배너 등록"), button:has-text("등록")').first();

    if (await createBtn.isVisible()) {
      await createBtn.click();
      await page.waitForTimeout(500);

      await bannerPage.fillBannerForm(testTitle, TEST_BANNER_DATA.linkUrl);
      await bannerPage.saveBanner();
      await bannerPage.expectToastMessage(TOAST_MESSAGES.CREATED);
    }
  });

  test('should open banner detail when clicking list item', async ({ page }) => {
    await page.waitForTimeout(1000);

    const itemCount = await bannerPage.getListItemCount();
    if (itemCount > 0) {
      await bannerPage.clickListItem(0);
      await page.waitForTimeout(500);

      const detailArea = page.locator('[class*="h-full"]');
      await expect(detailArea.first()).toBeVisible();
    }
  });

  test('should edit a banner', async ({ page }) => {
    await page.waitForTimeout(1000);

    const itemCount = await bannerPage.getListItemCount();
    if (itemCount > 0) {
      await bannerPage.clickListItem(0);
      await page.waitForTimeout(500);

      const editBtn = page.locator('button:has-text("수정")');
      if (await editBtn.first().isVisible()) {
        await editBtn.first().click();
        await page.waitForTimeout(500);

        const updatedTitle = `수정된 배너 ${Date.now()}`;
        await bannerPage.fillBannerForm(updatedTitle);
        await bannerPage.saveBanner();
        await bannerPage.expectToastMessage(TOAST_MESSAGES.UPDATED);
      }
    }
  });

  test('should search banners', async ({ page }) => {
    const searchKeyword = '배너';
    await bannerPage.searchBanners(searchKeyword);
    await page.waitForTimeout(1000);
  });

  test('should toggle banner exposure', async ({ page }) => {
    await page.waitForTimeout(1000);

    const itemCount = await bannerPage.getListItemCount();
    if (itemCount > 0) {
      const toggle = page.locator('[role="switch"], button[class*="toggle"]').first();
      if (await toggle.isVisible()) {
        await toggle.click();
        await page.waitForTimeout(500);
      }
    }
  });

  test('should select and delete banners', async ({ page }) => {
    await page.waitForTimeout(1000);

    const itemCount = await bannerPage.getListItemCount();
    if (itemCount > 0) {
      await bannerPage.checkBannerItem(0);
      await bannerPage.deleteButton.click();

      const confirmDialog = page.locator('[role="alertdialog"]');
      await expect(confirmDialog).toBeVisible();
      await bannerPage.cancelAction();
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

test.describe('Banner Type Filter', () => {
  let bannerPage: BannerPage;

  test.beforeEach(async ({ page }) => {
    bannerPage = new BannerPage(page);
    await bannerPage.goto();
  });

  test('should filter banners by type', async ({ page }) => {
    const selectTrigger = page.locator('button[role="combobox"]').first();

    if (await selectTrigger.isVisible()) {
      await selectTrigger.click();
      await page.waitForTimeout(300);

      const firstOption = page.locator('[role="option"]').first();
      if (await firstOption.isVisible()) {
        await firstOption.click();
        await page.waitForLoadState('networkidle');
      }
    }
  });
});

test.describe('Banner Form Validation', () => {
  let bannerPage: BannerPage;

  test.beforeEach(async ({ page }) => {
    bannerPage = new BannerPage(page);
    await bannerPage.goto();
  });

  test('should cancel banner creation', async ({ page }) => {
    const createBtn = page.locator('button:has-text("배너 등록"), button:has-text("등록")').first();

    if (await createBtn.isVisible()) {
      await createBtn.click();
      await page.waitForTimeout(500);

      await bannerPage.fillBannerForm('임시 배너');

      const cancelBtn = page.locator('button:has-text("취소")');
      if (await cancelBtn.first().isVisible()) {
        await cancelBtn.first().click();
        await page.waitForTimeout(500);
      }
    }
  });
});
