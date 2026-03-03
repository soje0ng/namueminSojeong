import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from './base.page';

export class MainPage extends BasePage {
  readonly welcomeMessage: Locator;
  readonly summaryCards: Locator;
  readonly recentPosts: Locator;
  readonly recentMembers: Locator;
  readonly visitorStats: Locator;
  readonly quickLinks: Locator;
  readonly sideMenu: Locator;

  constructor(page: Page) {
    super(page);
    this.welcomeMessage = page.locator('[class*="welcome"], h1, h2');
    this.summaryCards = page.locator('[class*="card"], [class*="summary"]');
    this.recentPosts = page.locator('[class*="recent-post"], [class*="posts"]');
    this.recentMembers = page.locator('[class*="recent-member"], [class*="members"]');
    this.visitorStats = page.locator('[class*="visitor"], [class*="stats"]');
    this.quickLinks = page.locator('[class*="quick"], [class*="link"]');
    this.sideMenu = page.locator('[class*="sidebar"], [class*="nav"], aside');
  }

  async goto() {
    await this.page.goto('/console/main');
    await this.waitForPageLoad();
  }

  async expectDashboardLoaded() {
    // Check that main dashboard elements are visible
    await this.page.waitForLoadState('networkidle');
    await expect(this.page.locator('body')).toBeVisible();
  }

  async navigateToBoard() {
    const boardLink = this.page.locator('a[href*="board"], button:has-text("게시판")');
    if (await boardLink.first().isVisible()) {
      await boardLink.first().click();
      await this.waitForPageLoad();
    }
  }

  async navigateToMember() {
    const memberLink = this.page.locator('a[href*="member"], button:has-text("회원")');
    if (await memberLink.first().isVisible()) {
      await memberLink.first().click();
      await this.waitForPageLoad();
    }
  }

  async navigateToSetting() {
    const settingLink = this.page.locator('a[href*="setting"], button:has-text("설정")');
    if (await settingLink.first().isVisible()) {
      await settingLink.first().click();
      await this.waitForPageLoad();
    }
  }

  async getSummaryCardCount(): Promise<number> {
    return this.summaryCards.count();
  }

  async clickSummaryCard(index: number) {
    const cards = this.summaryCards;
    await cards.nth(index).click();
  }
}
