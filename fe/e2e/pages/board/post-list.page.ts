import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from '../base.page';

export class PostListPage extends BasePage {
  readonly createButton: Locator;
  readonly searchInput: Locator;
  readonly searchButton: Locator;
  readonly allCheckbox: Locator;
  readonly deleteButton: Locator;
  readonly moveButton: Locator;
  readonly moveSelectBox: Locator;
  readonly listItems: Locator;
  readonly noDataMessage: Locator;
  readonly pagination: Locator;
  readonly totalCount: Locator;
  readonly boardGroupSelect: Locator;

  // Form elements (right panel)
  readonly titleInput: Locator;
  readonly contentEditor: Locator;
  readonly saveButton: Locator;
  readonly cancelButton: Locator;
  readonly editButton: Locator;
  readonly formDeleteButton: Locator;

  constructor(page: Page, category: string = 'notice') {
    super(page);
    this.createButton = page.locator('button:has-text("게시글 등록")');
    this.searchInput = page.locator('input[placeholder*="검색"]');
    this.searchButton = page.locator('button[type="button"]:has(svg)').filter({ has: page.locator('svg') });
    this.allCheckbox = page.locator('input[type="checkbox"]').first();
    this.deleteButton = page.locator('button:has-text("삭제")').first();
    this.moveButton = page.locator('button:has-text("이동")');
    this.moveSelectBox = page.locator('[data-testid="move-select"]');
    this.listItems = page.locator('[class*="cursor-pointer"][class*="rounded"]').filter({ hasText: /등록일자|작성자/ });
    this.noDataMessage = page.locator('text=데이터가 없습니다');
    this.pagination = page.locator('[class*="pagination"], nav');
    this.totalCount = page.locator('text=/\\d+.*개/');
    this.boardGroupSelect = page.locator('[data-testid="board-group-select"]');

    // Form elements
    this.titleInput = page.locator('input[name="b_title"], input[placeholder*="제목"]');
    this.contentEditor = page.locator('[contenteditable="true"], .lexical-editor, textarea');
    this.saveButton = page.locator('button:has-text("저장"), button:has-text("등록")');
    this.cancelButton = page.locator('button:has-text("취소")');
    this.editButton = page.locator('button:has-text("수정")');
    this.formDeleteButton = page.locator('button:has-text("삭제")').last();
  }

  async goto(category: string = 'notice') {
    await this.page.goto(`/console/board/post?category=${category}`);
    await this.waitForPageLoad();
  }

  async clickCreateButton() {
    await this.createButton.click();
    await this.page.waitForLoadState('networkidle');
  }

  async fillPostForm(title: string, content?: string) {
    await this.titleInput.fill(title);
    if (content) {
      // Try multiple content editor selectors
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
  }

  async savePost() {
    // Look for save button in the form area
    const saveBtn = this.page.locator('button:has-text("저장"), button:has-text("등록")').last();
    await saveBtn.click();
  }

  async clickListItem(index: number = 0) {
    const items = this.listItems;
    await items.nth(index).click();
  }

  async getListItemCount(): Promise<number> {
    return this.listItems.count();
  }

  async searchPosts(keyword: string) {
    await this.searchInput.fill(keyword);
    await this.searchInput.press('Enter');
    await this.waitForPageLoad();
  }

  async selectAllPosts() {
    await this.allCheckbox.check();
  }

  async deleteSelectedPosts() {
    await this.deleteButton.click();
    await this.confirmAction();
  }

  async checkPostItem(index: number) {
    const checkbox = this.listItems.nth(index).locator('input[type="checkbox"]');
    await checkbox.check();
  }

  async toggleNotice(index: number) {
    const toggle = this.listItems.nth(index).locator('[class*="toggle"], button[role="switch"]');
    await toggle.click();
  }

  async expectPostInList(title: string) {
    await expect(this.page.locator(`text=${title}`)).toBeVisible();
  }

  async expectPostNotInList(title: string) {
    await expect(this.page.locator(`text=${title}`)).not.toBeVisible();
  }

  async expectEmptyList() {
    await expect(this.noDataMessage).toBeVisible();
  }

  async expectListHasItems() {
    const count = await this.getListItemCount();
    expect(count).toBeGreaterThan(0);
  }

  async goToPage(pageNum: number) {
    await this.page.locator(`button:has-text("${pageNum}")`).click();
    await this.waitForPageLoad();
  }

  async getTotalCount(): Promise<number> {
    const text = await this.totalCount.textContent();
    const match = text?.match(/(\d+)/);
    return match ? parseInt(match[1], 10) : 0;
  }

  async editPost() {
    await this.editButton.click();
  }

  async cancelEdit() {
    await this.cancelButton.click();
  }

  async deleteCurrentPost() {
    await this.formDeleteButton.click();
    await this.confirmAction();
  }
}
