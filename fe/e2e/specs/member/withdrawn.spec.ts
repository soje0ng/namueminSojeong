import { test, expect } from '@playwright/test';
import { WithdrawnMemberPage } from '../../pages/member/withdrawn.page';

test.describe('Withdrawn Member List Page', () => {
  let withdrawnPage: WithdrawnMemberPage;

  test.beforeEach(async ({ page }) => {
    withdrawnPage = new WithdrawnMemberPage(page);
    await withdrawnPage.goto();
  });

  test('should display withdrawn member list page correctly', async () => {
    await expect(withdrawnPage.searchInput).toBeVisible();
  });

  test('should show total count', async ({ page }) => {
    const countText = page.locator('text=/\\d+.*명|\\d+.*개/');
    await expect(countText.first()).toBeVisible();
  });

  test('should open withdrawn member detail when clicking list item', async ({ page }) => {
    await page.waitForTimeout(1000);

    const itemCount = await withdrawnPage.getListItemCount();
    if (itemCount > 0) {
      await withdrawnPage.clickListItem(0);
      await page.waitForTimeout(500);

      const detailArea = page.locator('[class*="h-full"]');
      await expect(detailArea.first()).toBeVisible();
    }
  });

  test('should search withdrawn members', async ({ page }) => {
    const searchKeyword = 'test';
    await withdrawnPage.searchWithdrawnMembers(searchKeyword);
    await page.waitForTimeout(1000);
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
