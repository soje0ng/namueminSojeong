import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from '../base.page';

export class PolicySettingPage extends BasePage {
  readonly policyTabs: Locator;
  readonly contentEditor: Locator;
  readonly saveButton: Locator;
  readonly resetButton: Locator;

  // Policy type specific
  readonly termsTab: Locator;
  readonly privacyTab: Locator;
  readonly marketingTab: Locator;

  constructor(page: Page) {
    super(page);
    this.policyTabs = page.locator('[role="tab"], button[class*="tab"]');
    this.contentEditor = page.locator('[contenteditable="true"], textarea, .editor');
    this.saveButton = page.locator('button:has-text("저장")');
    this.resetButton = page.locator('button:has-text("초기화"), button:has-text("취소")');

    // Policy type specific
    this.termsTab = page.locator('button:has-text("이용약관"), [role="tab"]:has-text("이용약관")');
    this.privacyTab = page.locator('button:has-text("개인정보"), [role="tab"]:has-text("개인정보")');
    this.marketingTab = page.locator('button:has-text("마케팅"), [role="tab"]:has-text("마케팅")');
  }

  async goto() {
    await this.page.goto('/console/setting/policy');
    await this.waitForPageLoad();
  }

  async selectTermsTab() {
    if (await this.termsTab.first().isVisible()) {
      await this.termsTab.first().click();
      await this.page.waitForLoadState('networkidle');
    }
  }

  async selectPrivacyTab() {
    if (await this.privacyTab.first().isVisible()) {
      await this.privacyTab.first().click();
      await this.page.waitForLoadState('networkidle');
    }
  }

  async selectMarketingTab() {
    if (await this.marketingTab.first().isVisible()) {
      await this.marketingTab.first().click();
      await this.page.waitForLoadState('networkidle');
    }
  }

  async fillPolicyContent(content: string) {
    const editor = this.page.locator('[contenteditable="true"]').first();
    if (await editor.isVisible()) {
      await editor.click();
      await editor.fill(content);
    } else {
      const textarea = this.page.locator('textarea').first();
      if (await textarea.isVisible()) {
        await textarea.fill(content);
      }
    }
  }

  async savePolicy() {
    await this.saveButton.first().click();
  }

  async resetPolicy() {
    if (await this.resetButton.first().isVisible()) {
      await this.resetButton.first().click();
    }
  }

  async expectPolicySaved() {
    await this.expectToastMessage('저장');
  }
}
