import { Page, Locator, expect } from '@playwright/test';

export abstract class BasePage {
  readonly page: Page;
  readonly loadingIndicator: Locator;
  readonly toastMessage: Locator;
  readonly confirmPopup: Locator;
  readonly confirmButton: Locator;
  readonly cancelButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.loadingIndicator = page.locator('[data-testid="loading"]');
    this.toastMessage = page.locator('[data-sonner-toast]');
    this.confirmPopup = page.locator('[role="alertdialog"]');
    this.confirmButton = page.locator('[role="alertdialog"] button:has-text("확인")');
    this.cancelButton = page.locator('[role="alertdialog"] button:has-text("취소")');
  }

  abstract goto(): Promise<void>;

  async waitForPageLoad() {
    await this.page.waitForLoadState('networkidle');
  }

  async waitForApiResponse(urlPattern: string | RegExp) {
    return this.page.waitForResponse(
      response => {
        const url = response.url();
        if (typeof urlPattern === 'string') {
          return url.includes(urlPattern);
        }
        return urlPattern.test(url);
      },
      { timeout: 30000 }
    );
  }

  async expectToastMessage(message: string) {
    await expect(this.toastMessage).toContainText(message, { timeout: 10000 });
  }

  async confirmAction() {
    await this.confirmButton.click();
  }

  async cancelAction() {
    await this.cancelButton.click();
  }

  async selectFromDropdown(trigger: Locator, optionText: string) {
    await trigger.click();
    await this.page.locator(`[role="option"]:has-text("${optionText}")`).click();
  }

  async fillInput(selector: string, value: string) {
    const input = this.page.locator(selector);
    await input.clear();
    await input.fill(value);
  }

  async checkTableHasData() {
    const tableRows = this.page.locator('tbody tr');
    const count = await tableRows.count();
    return count > 0;
  }

  async getTableRowCount(): Promise<number> {
    const tableRows = this.page.locator('tbody tr');
    return tableRows.count();
  }

  async clickTableRow(index: number) {
    const row = this.page.locator(`tbody tr:nth-child(${index + 1})`);
    await row.click();
  }

  async clickButton(text: string) {
    await this.page.locator(`button:has-text("${text}")`).click();
  }

  async clickLink(text: string) {
    await this.page.locator(`a:has-text("${text}")`).click();
  }

  async waitForNavigation(urlPattern?: string | RegExp) {
    if (urlPattern) {
      await this.page.waitForURL(urlPattern);
    } else {
      await this.page.waitForLoadState('networkidle');
    }
  }

  async takeScreenshot(name: string) {
    await this.page.screenshot({ path: `playwright-report/screenshots/${name}.png` });
  }
}
