import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from '../base.page';

export class PopupPage extends BasePage {
  readonly createButton: Locator;
  readonly searchInput: Locator;
  readonly allCheckbox: Locator;
  readonly deleteButton: Locator;
  readonly listItems: Locator;
  readonly noDataMessage: Locator;
  readonly pagination: Locator;
  readonly totalCount: Locator;

  // Form elements
  readonly titleInput: Locator;
  readonly contentEditor: Locator;
  readonly widthInput: Locator;
  readonly heightInput: Locator;
  readonly positionXInput: Locator;
  readonly positionYInput: Locator;
  readonly exposureToggle: Locator;
  readonly startDateInput: Locator;
  readonly endDateInput: Locator;
  readonly saveButton: Locator;
  readonly cancelButton: Locator;
  readonly editButton: Locator;
  readonly formDeleteButton: Locator;

  constructor(page: Page) {
    super(page);
    this.createButton = page.locator('button:has-text("팝업 등록"), button:has-text("등록")');
    this.searchInput = page.locator('input[placeholder*="검색"]');
    this.allCheckbox = page.locator('input[type="checkbox"]').first();
    this.deleteButton = page.locator('button:has-text("삭제")').first();
    this.listItems = page.locator('[class*="cursor-pointer"][class*="rounded"]');
    this.noDataMessage = page.locator('text=데이터가 없습니다');
    this.pagination = page.locator('[class*="pagination"], nav');
    this.totalCount = page.locator('text=/\\d+.*개/');

    // Form elements
    this.titleInput = page.locator('input[name*="title"], input[placeholder*="제목"], input[placeholder*="팝업"]');
    this.contentEditor = page.locator('[contenteditable="true"], textarea');
    this.widthInput = page.locator('input[name*="width"], input[placeholder*="가로"], input[placeholder*="너비"]');
    this.heightInput = page.locator('input[name*="height"], input[placeholder*="세로"], input[placeholder*="높이"]');
    this.positionXInput = page.locator('input[name*="x"], input[name*="left"]');
    this.positionYInput = page.locator('input[name*="y"], input[name*="top"]');
    this.exposureToggle = page.locator('[role="switch"], button[class*="toggle"]');
    this.startDateInput = page.locator('input[name*="start"], input[placeholder*="시작"]');
    this.endDateInput = page.locator('input[name*="end"], input[placeholder*="종료"]');
    this.saveButton = page.locator('button:has-text("저장"), button:has-text("등록")');
    this.cancelButton = page.locator('button:has-text("취소")');
    this.editButton = page.locator('button:has-text("수정")');
    this.formDeleteButton = page.locator('button:has-text("삭제")').last();
  }

  async goto() {
    await this.page.goto('/console/design/popup');
    await this.waitForPageLoad();
  }

  async clickCreateButton() {
    await this.createButton.first().click();
    await this.page.waitForLoadState('networkidle');
  }

  async fillPopupForm(title: string, content?: string, width?: number, height?: number) {
    await this.titleInput.first().fill(title);

    if (content) {
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

    if (width) {
      const widthInput = this.page.locator('input[name*="width"], input[placeholder*="가로"]').first();
      if (await widthInput.isVisible()) {
        await widthInput.fill(width.toString());
      }
    }

    if (height) {
      const heightInput = this.page.locator('input[name*="height"], input[placeholder*="세로"]').first();
      if (await heightInput.isVisible()) {
        await heightInput.fill(height.toString());
      }
    }
  }

  async savePopup() {
    const saveBtn = this.page.locator('button:has-text("저장"), button:has-text("등록")').last();
    await saveBtn.click();
  }

  async clickListItem(index: number = 0) {
    await this.listItems.nth(index).click();
  }

  async getListItemCount(): Promise<number> {
    return this.listItems.count();
  }

  async searchPopups(keyword: string) {
    await this.searchInput.fill(keyword);
    await this.searchInput.press('Enter');
    await this.waitForPageLoad();
  }

  async selectAllPopups() {
    await this.allCheckbox.check();
  }

  async deleteSelectedPopups() {
    await this.deleteButton.click();
    await this.confirmAction();
  }

  async checkPopupItem(index: number) {
    const checkbox = this.listItems.nth(index).locator('input[type="checkbox"]');
    await checkbox.check();
  }

  async toggleExposure(index: number) {
    const toggle = this.listItems.nth(index).locator('[role="switch"], button[class*="toggle"]');
    await toggle.click();
  }

  async editPopup() {
    await this.editButton.click();
  }

  async cancelEdit() {
    await this.cancelButton.click();
  }

  async deletePopup() {
    await this.formDeleteButton.click();
    await this.confirmAction();
  }

  async expectPopupInList(title: string) {
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
