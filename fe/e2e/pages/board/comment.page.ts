import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from '../base.page';

export class CommentPage extends BasePage {
  readonly searchInput: Locator;
  readonly searchButton: Locator;
  readonly allCheckbox: Locator;
  readonly deleteButton: Locator;
  readonly listItems: Locator;
  readonly noDataMessage: Locator;
  readonly pagination: Locator;
  readonly totalCount: Locator;
  readonly boardSelect: Locator;

  // Detail panel
  readonly commentContent: Locator;
  readonly replyInput: Locator;
  readonly replyButton: Locator;
  readonly editButton: Locator;
  readonly detailDeleteButton: Locator;

  constructor(page: Page) {
    super(page);
    this.searchInput = page.locator('input[placeholder*="검색"]');
    this.searchButton = page.locator('button[type="button"]').filter({ has: page.locator('svg') });
    this.allCheckbox = page.locator('input[type="checkbox"]').first();
    this.deleteButton = page.locator('button:has-text("삭제")').first();
    this.listItems = page.locator('[class*="cursor-pointer"][class*="rounded"]');
    this.noDataMessage = page.locator('text=데이터가 없습니다');
    this.pagination = page.locator('[class*="pagination"], nav');
    this.totalCount = page.locator('text=/\\d+.*개/');
    this.boardSelect = page.locator('[data-testid="board-select"]');

    // Detail panel
    this.commentContent = page.locator('[class*="detail"] p, [class*="content"]');
    this.replyInput = page.locator('textarea[placeholder*="답글"], textarea[placeholder*="댓글"]');
    this.replyButton = page.locator('button:has-text("답글 등록"), button:has-text("등록")');
    this.editButton = page.locator('button:has-text("수정")');
    this.detailDeleteButton = page.locator('button:has-text("삭제")').last();
  }

  async goto() {
    await this.page.goto('/console/board/comment');
    await this.waitForPageLoad();
  }

  async selectBoard(boardName: string) {
    await this.boardSelect.click();
    await this.page.locator(`[role="option"]:has-text("${boardName}")`).click();
    await this.waitForPageLoad();
  }

  async clickListItem(index: number = 0) {
    await this.listItems.nth(index).click();
  }

  async getListItemCount(): Promise<number> {
    return this.listItems.count();
  }

  async searchComments(keyword: string) {
    await this.searchInput.fill(keyword);
    await this.searchInput.press('Enter');
    await this.waitForPageLoad();
  }

  async selectAllComments() {
    await this.allCheckbox.check();
  }

  async deleteSelectedComments() {
    await this.deleteButton.click();
    await this.confirmAction();
  }

  async checkCommentItem(index: number) {
    const checkbox = this.listItems.nth(index).locator('input[type="checkbox"]');
    await checkbox.check();
  }

  async writeReply(content: string) {
    await this.replyInput.fill(content);
    await this.replyButton.click();
  }

  async editComment() {
    await this.editButton.click();
  }

  async deleteComment() {
    await this.detailDeleteButton.click();
    await this.confirmAction();
  }

  async expectCommentInList(content: string) {
    await expect(this.page.locator(`text=${content}`)).toBeVisible();
  }

  async expectEmptyList() {
    await expect(this.noDataMessage).toBeVisible();
  }

  async expectListHasItems() {
    const count = await this.getListItemCount();
    expect(count).toBeGreaterThan(0);
  }
}
