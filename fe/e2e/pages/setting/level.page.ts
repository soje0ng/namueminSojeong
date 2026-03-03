import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from '../base.page';

export class LevelSettingPage extends BasePage {
  readonly createButton: Locator;
  readonly listItems: Locator;
  readonly noDataMessage: Locator;
  readonly saveButton: Locator;

  // Form elements
  readonly levelNameInput: Locator;
  readonly levelValueInput: Locator;
  readonly levelIconUpload: Locator;
  readonly editButton: Locator;
  readonly deleteButton: Locator;

  constructor(page: Page) {
    super(page);
    this.createButton = page.locator('button:has-text("레벨 등록"), button:has-text("등록"), button:has-text("추가")');
    this.listItems = page.locator('[class*="cursor-pointer"][class*="rounded"], tr, [class*="item"]');
    this.noDataMessage = page.locator('text=데이터가 없습니다');
    this.saveButton = page.locator('button:has-text("저장")');

    // Form elements
    this.levelNameInput = page.locator('input[name*="name"], input[placeholder*="레벨명"], input[placeholder*="이름"]');
    this.levelValueInput = page.locator('input[name*="level"], input[name*="value"], input[type="number"]');
    this.levelIconUpload = page.locator('input[type="file"]');
    this.editButton = page.locator('button:has-text("수정")');
    this.deleteButton = page.locator('button:has-text("삭제")');
  }

  async goto() {
    await this.page.goto('/console/setting/level');
    await this.waitForPageLoad();
  }

  async clickCreateButton() {
    await this.createButton.first().click();
    await this.page.waitForLoadState('networkidle');
  }

  async fillLevelForm(name: string, levelValue?: number) {
    if (await this.levelNameInput.first().isVisible()) {
      await this.levelNameInput.first().fill(name);
    }
    if (levelValue !== undefined && await this.levelValueInput.first().isVisible()) {
      await this.levelValueInput.first().fill(levelValue.toString());
    }
  }

  async saveLevel() {
    await this.saveButton.first().click();
  }

  async clickListItem(index: number = 0) {
    const items = this.page.locator('[class*="cursor-pointer"], tr').filter({ hasNotText: /^$/ });
    await items.nth(index).click();
  }

  async getListItemCount(): Promise<number> {
    const items = this.page.locator('[class*="cursor-pointer"], tr').filter({ hasNotText: /^$/ });
    return items.count();
  }

  async editLevel() {
    await this.editButton.first().click();
  }

  async deleteLevel() {
    await this.deleteButton.first().click();
    await this.confirmAction();
  }

  async expectLevelInList(name: string) {
    await expect(this.page.locator(`text=${name}`)).toBeVisible();
  }

  async expectEmptyList() {
    await expect(this.noDataMessage).toBeVisible();
  }
}
