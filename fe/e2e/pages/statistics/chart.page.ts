import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from '../base.page';

export class ChartPage extends BasePage {
  readonly dateRangeSelect: Locator;
  readonly startDateInput: Locator;
  readonly endDateInput: Locator;
  readonly applyButton: Locator;
  readonly chart: Locator;
  readonly chartTypeSelect: Locator;
  readonly exportButton: Locator;

  // Summary cards
  readonly summaryCards: Locator;
  readonly totalVisitors: Locator;
  readonly totalPageViews: Locator;

  constructor(page: Page) {
    super(page);
    this.dateRangeSelect = page.locator('button[role="combobox"], [data-testid="date-range"]');
    this.startDateInput = page.locator('input[name*="start"], input[placeholder*="시작"]');
    this.endDateInput = page.locator('input[name*="end"], input[placeholder*="종료"]');
    this.applyButton = page.locator('button:has-text("조회"), button:has-text("적용")');
    this.chart = page.locator('canvas, svg[class*="chart"], [class*="chart"]');
    this.chartTypeSelect = page.locator('[data-testid="chart-type"], button[role="combobox"]');
    this.exportButton = page.locator('button:has-text("내보내기"), button:has-text("다운로드")');

    // Summary cards
    this.summaryCards = page.locator('[class*="card"], [class*="summary"]');
    this.totalVisitors = page.locator('text=/방문자|visitors/i');
    this.totalPageViews = page.locator('text=/페이지뷰|page.*views/i');
  }

  async goto() {
    await this.page.goto('/console/statistics/chart');
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

  async selectChartType(type: string) {
    if (await this.chartTypeSelect.first().isVisible()) {
      await this.chartTypeSelect.first().click();
      await this.page.locator(`[role="option"]:has-text("${type}")`).click();
      await this.waitForPageLoad();
    }
  }

  async exportChart() {
    if (await this.exportButton.first().isVisible()) {
      await this.exportButton.first().click();
    }
  }

  async expectChartVisible() {
    await expect(this.chart.first()).toBeVisible();
  }

  async expectSummaryCardsVisible() {
    await expect(this.summaryCards.first()).toBeVisible();
  }
}
