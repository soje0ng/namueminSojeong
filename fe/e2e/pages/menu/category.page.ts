import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from '../base.page';

export class CategoryPage extends BasePage {
  readonly createButton: Locator;
  readonly treeView: Locator;
  readonly treeItems: Locator;
  readonly expandButtons: Locator;
  readonly saveButton: Locator;
  readonly deleteButton: Locator;

  // Form elements
  readonly nameInput: Locator;
  readonly urlInput: Locator;
  readonly visibilityToggle: Locator;
  readonly orderInput: Locator;

  constructor(page: Page) {
    super(page);
    this.createButton = page.locator('button:has-text("메뉴 추가"), button:has-text("카테고리 추가"), button:has-text("등록")');
    this.treeView = page.locator('[class*="tree"], [class*="menu-list"]');
    this.treeItems = page.locator('[class*="tree-item"], [class*="menu-item"], [class*="draggable"]');
    this.expandButtons = page.locator('[class*="expand"], [class*="toggle"]');
    this.saveButton = page.locator('button:has-text("저장")');
    this.deleteButton = page.locator('button:has-text("삭제")');

    // Form elements
    this.nameInput = page.locator('input[name*="name"], input[placeholder*="메뉴명"], input[placeholder*="이름"]');
    this.urlInput = page.locator('input[name*="url"], input[placeholder*="URL"], input[placeholder*="링크"]');
    this.visibilityToggle = page.locator('[role="switch"], [class*="toggle"]');
    this.orderInput = page.locator('input[name*="order"], input[type="number"]');
  }

  async goto() {
    await this.page.goto('/console/menu/category');
    await this.waitForPageLoad();
  }

  async clickCreateButton() {
    await this.createButton.first().click();
    await this.page.waitForLoadState('networkidle');
  }

  async fillCategoryForm(name: string, url?: string) {
    if (await this.nameInput.first().isVisible()) {
      await this.nameInput.first().fill(name);
    }
    if (url && await this.urlInput.first().isVisible()) {
      await this.urlInput.first().fill(url);
    }
  }

  async saveCategory() {
    await this.saveButton.first().click();
  }

  async clickTreeItem(index: number = 0) {
    await this.treeItems.nth(index).click();
  }

  async getTreeItemCount(): Promise<number> {
    return this.treeItems.count();
  }

  async expandTreeItem(index: number) {
    await this.expandButtons.nth(index).click();
  }

  async toggleVisibility() {
    if (await this.visibilityToggle.first().isVisible()) {
      await this.visibilityToggle.first().click();
    }
  }

  async deleteCategory() {
    await this.deleteButton.first().click();
    await this.confirmAction();
  }

  async expectCategoryInTree(name: string) {
    await expect(this.page.locator(`text=${name}`)).toBeVisible();
  }

  async expectEmptyTree() {
    const count = await this.getTreeItemCount();
    expect(count).toBe(0);
  }
}
