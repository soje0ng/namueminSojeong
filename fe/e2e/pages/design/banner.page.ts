import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from '../base.page';

export class BannerPage extends BasePage {
  readonly createButton: Locator;
  readonly searchInput: Locator;
  readonly allCheckbox: Locator;
  readonly deleteButton: Locator;
  readonly listItems: Locator;
  readonly noDataMessage: Locator;
  readonly pagination: Locator;
  readonly totalCount: Locator;
  readonly bannerTypeSelect: Locator;

  // Form elements
  readonly titleInput: Locator;
  readonly linkInput: Locator;
  readonly imageUpload: Locator;
  readonly exposureToggle: Locator;
  readonly startDateInput: Locator;
  readonly endDateInput: Locator;
  readonly saveButton: Locator;
  readonly cancelButton: Locator;
  readonly editButton: Locator;
  readonly formDeleteButton: Locator;

  constructor(page: Page) {
    super(page);
    this.createButton = page.locator('button:has-text("배너 등록"), button:has-text("등록")');
    this.searchInput = page.locator('input[placeholder*="검색"]');
    this.allCheckbox = page.locator('input[type="checkbox"]').first();
    this.deleteButton = page.locator('button:has-text("삭제")').first();
    this.listItems = page.locator('[class*="cursor-pointer"][class*="rounded"]');
    this.noDataMessage = page.locator('text=데이터가 없습니다');
    this.pagination = page.locator('[class*="pagination"], nav');
    this.totalCount = page.locator('text=/\\d+.*개/');
    this.bannerTypeSelect = page.locator('[data-testid="banner-type-select"], button[role="combobox"]');

    // Form elements
    this.titleInput = page.locator('input[name*="title"], input[placeholder*="제목"], input[placeholder*="배너"]');
    this.linkInput = page.locator('input[name*="link"], input[placeholder*="URL"], input[placeholder*="링크"]');
    this.imageUpload = page.locator('input[type="file"]');
    this.exposureToggle = page.locator('[role="switch"], button[class*="toggle"]');
    this.startDateInput = page.locator('input[name*="start"], input[placeholder*="시작"]');
    this.endDateInput = page.locator('input[name*="end"], input[placeholder*="종료"]');
    this.saveButton = page.locator('button:has-text("저장"), button:has-text("등록")');
    this.cancelButton = page.locator('button:has-text("취소")');
    this.editButton = page.locator('button:has-text("수정")');
    this.formDeleteButton = page.locator('button:has-text("삭제")').last();
  }

  async goto() {
    await this.page.goto('/console/design/banner');
    await this.waitForPageLoad();
  }

  async clickCreateButton() {
    await this.createButton.first().click();
    await this.page.waitForLoadState('networkidle');
  }

  async fillBannerForm(title: string, linkUrl?: string) {
    await this.titleInput.first().fill(title);
    if (linkUrl) {
      const linkInput = this.page.locator('input[placeholder*="URL"], input[placeholder*="링크"], input[name*="link"]').first();
      if (await linkInput.isVisible()) {
        await linkInput.fill(linkUrl);
      }
    }
  }

  async saveBanner() {
    const saveBtn = this.page.locator('button:has-text("저장"), button:has-text("등록")').last();
    await saveBtn.click();
  }

  async clickListItem(index: number = 0) {
    await this.listItems.nth(index).click();
  }

  async getListItemCount(): Promise<number> {
    return this.listItems.count();
  }

  async searchBanners(keyword: string) {
    await this.searchInput.fill(keyword);
    await this.searchInput.press('Enter');
    await this.waitForPageLoad();
  }

  async selectAllBanners() {
    await this.allCheckbox.check();
  }

  async deleteSelectedBanners() {
    await this.deleteButton.click();
    await this.confirmAction();
  }

  async checkBannerItem(index: number) {
    const checkbox = this.listItems.nth(index).locator('input[type="checkbox"]');
    await checkbox.check();
  }

  async toggleExposure(index: number) {
    const toggle = this.listItems.nth(index).locator('[role="switch"], button[class*="toggle"]');
    await toggle.click();
  }

  async editBanner() {
    await this.editButton.click();
  }

  async cancelEdit() {
    await this.cancelButton.click();
  }

  async deleteBanner() {
    await this.formDeleteButton.click();
    await this.confirmAction();
  }

  async selectBannerType(typeName: string) {
    await this.bannerTypeSelect.first().click();
    await this.page.locator(`[role="option"]:has-text("${typeName}")`).click();
    await this.waitForPageLoad();
  }

  async expectBannerInList(title: string) {
    await expect(this.page.locator(`text=${title}`)).toBeVisible();
  }

  async expectEmptyList() {
    await expect(this.noDataMessage).toBeVisible();
  }

  async expectListHasItems() {
    const count = await this.getListItemCount();
    expect(count).toBeGreaterThan(0);
  }
}
