import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from '../base.page';

export class TemplateBuilderPage extends BasePage {
  readonly templateSettingButton: Locator;
  readonly builderDialog: Locator;
  readonly builderSidebar: Locator;
  readonly builderSaveButton: Locator;
  readonly builderSections: Locator;

  constructor(page: Page) {
    super(page);
    this.templateSettingButton = page.locator('button:has-text("템플릿 설정")');
    this.builderDialog = page.locator('[role="dialog"]');
    this.builderSidebar = page.locator('[class*="sidebar"], [class*="widget-list"], [class*="Sidebar"]');
    this.builderSaveButton = page.locator('[role="dialog"] button:has-text("저장")');
    this.builderSections = page.locator('[role="dialog"] [class*="section"], [role="dialog"] [data-section]');
  }

  async goto() {
    await this.page.goto('/console/menu/category');
    await this.waitForPageLoad();
  }

  async gotoSubCategory(lang: string, detailId: number) {
    await this.page.goto(`/console/menu/category?lang=${lang}&detail=${detailId}&isSub=1`);
    await this.waitForPageLoad();
  }

  async openTemplateBuilder() {
    await this.templateSettingButton.click();
    await this.builderDialog.waitFor({ state: 'visible', timeout: 10000 });
  }

  async isBuilderOpen(): Promise<boolean> {
    return this.builderDialog.isVisible();
  }

  async clickBuilderSave() {
    await this.builderSaveButton.click();
  }

  async getSectionCount(): Promise<number> {
    return this.builderSections.count();
  }

  async addWidgetByName(widgetName: string) {
    const widgetButton = this.page.locator(`[role="dialog"] button:has-text("${widgetName}"), [role="dialog"] [class*="widget"]:has-text("${widgetName}")`);
    if (await widgetButton.first().isVisible({ timeout: 5000 })) {
      await widgetButton.first().click();
      await this.page.waitForTimeout(500);
    }
  }

  async closeBuilder() {
    const closeButton = this.page.locator('[role="dialog"] button[class*="close"], [role="dialog"] button:has-text("닫기")');
    if (await closeButton.first().isVisible()) {
      await closeButton.first().click();
    }
  }
}
