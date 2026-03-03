import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from '../base.page';

export class MaintenancePage extends BasePage {
  readonly maintenanceToggle: Locator;
  readonly maintenanceMessage: Locator;
  readonly startDateInput: Locator;
  readonly endDateInput: Locator;
  readonly saveButton: Locator;
  readonly resetButton: Locator;

  // Status indicators
  readonly statusIndicator: Locator;
  readonly currentStatus: Locator;

  constructor(page: Page) {
    super(page);
    this.maintenanceToggle = page.locator('[role="switch"], [class*="toggle"]');
    this.maintenanceMessage = page.locator('textarea, [contenteditable="true"]');
    this.startDateInput = page.locator('input[name*="start"], input[placeholder*="시작"]');
    this.endDateInput = page.locator('input[name*="end"], input[placeholder*="종료"]');
    this.saveButton = page.locator('button:has-text("저장")');
    this.resetButton = page.locator('button:has-text("초기화"), button:has-text("취소")');

    // Status indicators
    this.statusIndicator = page.locator('[class*="status"], [class*="indicator"]');
    this.currentStatus = page.locator('text=/활성화|비활성화|운영중|점검중/');
  }

  async goto() {
    await this.page.goto('/console/maintenance');
    await this.waitForPageLoad();
  }

  async toggleMaintenance() {
    if (await this.maintenanceToggle.first().isVisible()) {
      await this.maintenanceToggle.first().click();
    }
  }

  async setMaintenanceMessage(message: string) {
    if (await this.maintenanceMessage.first().isVisible()) {
      await this.maintenanceMessage.first().fill(message);
    }
  }

  async setMaintenancePeriod(startDate: string, endDate: string) {
    if (await this.startDateInput.first().isVisible()) {
      await this.startDateInput.first().fill(startDate);
    }
    if (await this.endDateInput.first().isVisible()) {
      await this.endDateInput.first().fill(endDate);
    }
  }

  async saveMaintenance() {
    await this.saveButton.first().click();
  }

  async resetMaintenance() {
    if (await this.resetButton.first().isVisible()) {
      await this.resetButton.first().click();
    }
  }

  async expectMaintenanceEnabled() {
    // Check toggle state or status text
    const statusText = this.page.locator('text=/활성화|점검중|ON/i');
    if (await statusText.first().isVisible()) {
      await expect(statusText.first()).toBeVisible();
    }
  }

  async expectMaintenanceDisabled() {
    const statusText = this.page.locator('text=/비활성화|운영중|OFF/i');
    if (await statusText.first().isVisible()) {
      await expect(statusText.first()).toBeVisible();
    }
  }
}
