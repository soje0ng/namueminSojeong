import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from '../base.page';

export class SiteSettingPage extends BasePage {
  readonly siteNameInput: Locator;
  readonly siteDescInput: Locator;
  readonly siteUrlInput: Locator;
  readonly logoUpload: Locator;
  readonly faviconUpload: Locator;
  readonly saveButton: Locator;
  readonly resetButton: Locator;

  // SEO settings
  readonly metaTitleInput: Locator;
  readonly metaDescInput: Locator;
  readonly metaKeywordsInput: Locator;

  // Social settings
  readonly ogImageUpload: Locator;

  constructor(page: Page) {
    super(page);
    this.siteNameInput = page.locator('input[name*="name"], input[placeholder*="사이트명"]');
    this.siteDescInput = page.locator('textarea[name*="desc"], textarea[placeholder*="설명"]');
    this.siteUrlInput = page.locator('input[name*="url"], input[placeholder*="URL"]');
    this.logoUpload = page.locator('input[type="file"]').first();
    this.faviconUpload = page.locator('input[type="file"]').nth(1);
    this.saveButton = page.locator('button:has-text("저장")');
    this.resetButton = page.locator('button:has-text("초기화"), button:has-text("취소")');

    // SEO settings
    this.metaTitleInput = page.locator('input[name*="meta_title"], input[placeholder*="메타 제목"]');
    this.metaDescInput = page.locator('textarea[name*="meta_desc"], textarea[placeholder*="메타 설명"]');
    this.metaKeywordsInput = page.locator('input[name*="keywords"], input[placeholder*="키워드"]');

    // Social settings
    this.ogImageUpload = page.locator('input[type="file"]').last();
  }

  async goto() {
    await this.page.goto('/console/setting/site');
    await this.waitForPageLoad();
  }

  async fillSiteSettings(siteName: string, siteDesc?: string) {
    if (await this.siteNameInput.first().isVisible()) {
      await this.siteNameInput.first().fill(siteName);
    }
    if (siteDesc) {
      const descInput = this.page.locator('textarea').first();
      if (await descInput.isVisible()) {
        await descInput.fill(siteDesc);
      }
    }
  }

  async saveSiteSettings() {
    await this.saveButton.first().click();
  }

  async resetSettings() {
    await this.resetButton.first().click();
  }

  async fillSeoSettings(metaTitle: string, metaDesc?: string, keywords?: string) {
    if (await this.metaTitleInput.first().isVisible()) {
      await this.metaTitleInput.first().fill(metaTitle);
    }
    if (metaDesc && await this.metaDescInput.first().isVisible()) {
      await this.metaDescInput.first().fill(metaDesc);
    }
    if (keywords && await this.metaKeywordsInput.first().isVisible()) {
      await this.metaKeywordsInput.first().fill(keywords);
    }
  }

  async expectSettingsSaved() {
    await this.expectToastMessage('저장');
  }
}
