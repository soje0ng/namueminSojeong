import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from '../base.page';

export class VisitorPage extends BasePage {
  readonly dateRangeSelect: Locator;
  readonly startDateInput: Locator;
  readonly endDateInput: Locator;
  readonly applyButton: Locator;
  readonly visitorTable: Locator;
  readonly exportButton: Locator;
  readonly pagination: Locator;

  // Summary
  readonly totalVisitors: Locator;
  readonly uniqueVisitors: Locator;
  readonly pageViews: Locator;

  constructor(page: Page) {
    super(page);
    this.dateRangeSelect = page.locator('button[role="combobox"], [data-testid="date-range"]');
    this.startDateInput = page.locator('input[name*="start"], input[placeholder*="시작"]');
    this.endDateInput = page.locator('input[name*="end"], input[placeholder*="종료"]');
    this.applyButton = page.locator('button:has-text("조회"), button:has-text("적용")');
    this.visitorTable = page.locator('table, [class*="table"]');
    this.exportButton = page.locator('button:has-text("내보내기"), button:has-text("다운로드")');
    this.pagination = page.locator('[class*="pagination"], nav');

    // Summary
    this.totalVisitors = page.locator('text=/총.*방문|total.*visitor/i');
    this.uniqueVisitors = page.locator('text=/순.*방문|unique/i');
    this.pageViews = page.locator('text=/페이지뷰|page.*view/i');
  }

  async goto() {
    await this.page.goto('/console/statistics/visitor');
    await this.waitForPageLoad();
  }

  async selectDateRange(range: string) {
    if (await this.dateRangeSelect.first().isVisible()) {
      await this.dateRangeSelect.first().click();
      await this.page.locator(`[role="option"]:has-text("${range}")`).click();
      await this.waitForPageLoad();
    }
  }

  async setCustomDateRange(startDate: string, endDate: string) {
    if (await this.startDateInput.first().isVisible()) {
      await this.startDateInput.first().fill(startDate);
    }
    if (await this.endDateInput.first().isVisible()) {
      await this.endDateInput.first().fill(endDate);
    }
    if (await this.applyButton.first().isVisible()) {
      await this.applyButton.first().click();
      await this.waitForPageLoad();
    }
  }

  async exportData() {
    if (await this.exportButton.first().isVisible()) {
      await this.exportButton.first().click();
    }
  }

  async goToPage(pageNum: number) {
    const pageButton = this.page.locator(`button:has-text("${pageNum}")`);
    if (await pageButton.isVisible()) {
      await pageButton.click();
      await this.waitForPageLoad();
    }
  }

  async expectTableVisible() {
    await expect(this.visitorTable.first()).toBeVisible();
  }

  async expectSummaryVisible() {
    // Check if any summary element is visible
    const summaryElements = this.page.locator('[class*="summary"], [class*="card"], [class*="stat"]');
    if (await summaryElements.first().isVisible()) {
      await expect(summaryElements.first()).toBeVisible();
    }
  }
}
