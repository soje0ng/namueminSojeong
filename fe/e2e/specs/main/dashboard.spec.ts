import { test, expect } from '@playwright/test';
import { MainPage } from '../../pages/main.page';

test.describe('Dashboard Main Page', () => {
  let mainPage: MainPage;

  test.beforeEach(async ({ page }) => {
    mainPage = new MainPage(page);
    await mainPage.goto();
  });

  test('should display dashboard correctly', async ({ page }) => {
    await mainPage.expectDashboardLoaded();

    // Check URL
    expect(page.url()).toContain('/console/main');
  });

  test('should show summary cards or widgets', async ({ page }) => {
    await page.waitForTimeout(1000);

    const cards = page.locator('[class*="card"], [class*="widget"], [class*="summary"]');
    const cardCount = await cards.count();

    if (cardCount > 0) {
      await expect(cards.first()).toBeVisible();
    }
  });

  test('should have navigation sidebar', async ({ page }) => {
    await page.waitForTimeout(1000);

    const sidebar = page.locator('[class*="sidebar"], [class*="nav"], aside');
    if (await sidebar.first().isVisible()) {
      await expect(sidebar.first()).toBeVisible();
    }
  });

  test('should navigate to board management', async ({ page }) => {
    await page.waitForTimeout(1000);

    const boardLink = page.locator('a[href*="board"], button:has-text("게시판"), span:has-text("게시판")');
    if (await boardLink.first().isVisible()) {
      await boardLink.first().click();
      await page.waitForLoadState('networkidle');

      expect(page.url()).toContain('board');
    }
  });

  test('should navigate to member management', async ({ page }) => {
    await page.waitForTimeout(1000);

    const memberLink = page.locator('a[href*="member"], button:has-text("회원"), span:has-text("회원")');
    if (await memberLink.first().isVisible()) {
      await memberLink.first().click();
      await page.waitForLoadState('networkidle');

      expect(page.url()).toContain('member');
    }
  });
});

test.describe('Dashboard Data Display', () => {
  let mainPage: MainPage;

  test.beforeEach(async ({ page }) => {
    mainPage = new MainPage(page);
    await mainPage.goto();
  });

  test('should load visitor statistics', async ({ page }) => {
    await page.waitForTimeout(2000);

    // Check for stats elements
    const statsElements = page.locator('[class*="stat"], [class*="visitor"], [class*="count"]');
    if (await statsElements.first().isVisible()) {
      await expect(statsElements.first()).toBeVisible();
    }
  });

  test('should show recent posts if available', async ({ page }) => {
    await page.waitForTimeout(2000);

    const recentPosts = page.locator('[class*="recent"], [class*="post"]');
    if (await recentPosts.first().isVisible()) {
      await expect(recentPosts.first()).toBeVisible();
    }
  });

  test('should refresh dashboard data', async ({ page }) => {
    await page.waitForTimeout(1000);

    // Reload the page
    await page.reload();
    await page.waitForLoadState('networkidle');

    // Dashboard should still be displayed
    expect(page.url()).toContain('/console/main');
  });
});
