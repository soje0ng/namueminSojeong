import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from '../base.page';

export class WithdrawnMemberPage extends BasePage {
  readonly searchInput: Locator;
  readonly searchButton: Locator;
  readonly listItems: Locator;
  readonly noDataMessage: Locator;
  readonly pagination: Locator;
  readonly totalCount: Locator;

  // Detail panel
  readonly memberEmail: Locator;
  readonly withdrawnDate: Locator;

  constructor(page: Page) {
    super(page);
    this.searchInput = page.locator('input[placeholder*="검색"]');
    this.searchButton = page.locator('button[type="button"]').filter({ has: page.locator('svg') });
    this.listItems = page.locator('[class*="cursor-pointer"][class*="rounded"]');
    this.noDataMessage = page.locator('text=데이터가 없습니다');
    this.pagination = page.locator('[class*="pagination"], nav');
    this.totalCount = page.locator('text=/\\d+.*명|\\d+.*개/');

    // Detail panel
    this.memberEmail = page.locator('[class*="email"], text=@');
    this.withdrawnDate = page.locator('[class*="date"]');
  }

  async goto() {
    await this.page.goto('/console/member/withdrawn');
    await this.waitForPageLoad();
  }

  async clickListItem(index: number = 0) {
    await this.listItems.nth(index).click();
  }

  async getListItemCount(): Promise<number> {
    return this.listItems.count();
  }

  async searchWithdrawnMembers(keyword: string) {
    await this.searchInput.fill(keyword);
    await this.searchInput.press('Enter');
    await this.waitForPageLoad();
  }

  async expectMemberInList(email: string) {
    await expect(this.page.locator(`text=${email}`)).toBeVisible();
  }

  async expectEmptyList() {
    await expect(this.noDataMessage).toBeVisible();
  }

  async expectListHasItems() {
    const count = await this.getListItemCount();
    expect(count).toBeGreaterThan(0);
  }
}
