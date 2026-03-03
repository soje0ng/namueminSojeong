import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from '../base.page';

export class MemberListPage extends BasePage {
  readonly createButton: Locator;
  readonly searchInput: Locator;
  readonly searchButton: Locator;
  readonly allCheckbox: Locator;
  readonly deleteButton: Locator;
  readonly levelChangeButton: Locator;
  readonly levelSelect: Locator;
  readonly listItems: Locator;
  readonly noDataMessage: Locator;
  readonly pagination: Locator;
  readonly totalCount: Locator;

  // Form elements (right panel)
  readonly nameInput: Locator;
  readonly emailInput: Locator;
  readonly passwordInput: Locator;
  readonly phoneInput: Locator;
  readonly saveButton: Locator;
  readonly cancelButton: Locator;
  readonly editButton: Locator;
  readonly withdrawButton: Locator;

  constructor(page: Page) {
    super(page);
    this.createButton = page.locator('button:has-text("회원 등록"), button:has-text("등록")');
    this.searchInput = page.locator('input[placeholder*="검색"]');
    this.searchButton = page.locator('button[type="button"]').filter({ has: page.locator('svg') });
    this.allCheckbox = page.locator('input[type="checkbox"]').first();
    this.deleteButton = page.locator('button:has-text("삭제")').first();
    this.levelChangeButton = page.locator('button:has-text("등급변경"), button:has-text("변경")');
    this.levelSelect = page.locator('[data-testid="level-select"], button[role="combobox"]');
    this.listItems = page.locator('[class*="cursor-pointer"][class*="rounded"]');
    this.noDataMessage = page.locator('text=데이터가 없습니다');
    this.pagination = page.locator('[class*="pagination"], nav');
    this.totalCount = page.locator('text=/\\d+.*명|\\d+.*개/');

    // Form elements
    this.nameInput = page.locator('input[name="m_name"], input[placeholder*="이름"]');
    this.emailInput = page.locator('input[name="m_email"], input[placeholder*="이메일"], input[type="email"]');
    this.passwordInput = page.locator('input[name="m_password"], input[type="password"]');
    this.phoneInput = page.locator('input[name="m_phone"], input[placeholder*="연락처"], input[placeholder*="전화"]');
    this.saveButton = page.locator('button:has-text("저장"), button:has-text("등록")');
    this.cancelButton = page.locator('button:has-text("취소")');
    this.editButton = page.locator('button:has-text("수정")');
    this.withdrawButton = page.locator('button:has-text("탈퇴")');
  }

  async goto() {
    await this.page.goto('/console/member');
    await this.waitForPageLoad();
  }

  async clickCreateButton() {
    await this.createButton.click();
    await this.page.waitForLoadState('networkidle');
  }

  async fillMemberForm(name: string, email: string, password?: string, phone?: string) {
    await this.nameInput.fill(name);
    await this.emailInput.fill(email);
    if (password) {
      await this.passwordInput.fill(password);
    }
    if (phone) {
      await this.phoneInput.fill(phone);
    }
  }

  async saveMember() {
    const saveBtn = this.page.locator('button:has-text("저장"), button:has-text("등록")').last();
    await saveBtn.click();
  }

  async clickListItem(index: number = 0) {
    await this.listItems.nth(index).click();
  }

  async getListItemCount(): Promise<number> {
    return this.listItems.count();
  }

  async searchMembers(keyword: string) {
    await this.searchInput.fill(keyword);
    await this.searchInput.press('Enter');
    await this.waitForPageLoad();
  }

  async selectAllMembers() {
    await this.allCheckbox.check();
  }

  async checkMemberItem(index: number) {
    const checkbox = this.listItems.nth(index).locator('input[type="checkbox"]');
    await checkbox.check();
  }

  async changeMemberLevel(levelName: string) {
    await this.levelSelect.first().click();
    await this.page.locator(`[role="option"]:has-text("${levelName}")`).click();
    await this.levelChangeButton.click();
  }

  async withdrawMember() {
    await this.withdrawButton.click();
    await this.confirmAction();
  }

  async editMember() {
    await this.editButton.click();
  }

  async cancelEdit() {
    await this.cancelButton.click();
  }

  async expectMemberInList(name: string) {
    await expect(this.page.locator(`text=${name}`)).toBeVisible();
  }

  async expectMemberNotInList(name: string) {
    await expect(this.page.locator(`text=${name}`)).not.toBeVisible();
  }

  async expectEmptyList() {
    await expect(this.noDataMessage).toBeVisible();
  }

  async expectListHasItems() {
    const count = await this.getListItemCount();
    expect(count).toBeGreaterThan(0);
  }
}
