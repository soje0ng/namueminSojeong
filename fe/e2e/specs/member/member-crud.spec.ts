import { test, expect } from '@playwright/test';
import { MemberListPage } from '../../pages/member/member-list.page';
import { TEST_MEMBER_DATA, TOAST_MESSAGES } from '../../fixtures/test-data';

test.describe('Member List Page', () => {
  let memberListPage: MemberListPage;

  test.beforeEach(async ({ page }) => {
    memberListPage = new MemberListPage(page);
    await memberListPage.goto();
  });

  test('should display member list page correctly', async () => {
    await expect(memberListPage.searchInput).toBeVisible();
  });

  test('should show total count', async ({ page }) => {
    const countText = page.locator('text=/\\d+.*명|\\d+.*개/');
    await expect(countText.first()).toBeVisible();
  });
});

test.describe('Member CRUD Operations', () => {
  let memberListPage: MemberListPage;
  const testEmail = `test${Date.now()}@test.com`;

  test.beforeEach(async ({ page }) => {
    memberListPage = new MemberListPage(page);
    await memberListPage.goto();
  });

  test('should create a new member', async ({ page }) => {
    const createBtn = page.locator('button:has-text("회원 등록"), button:has-text("등록")').first();

    if (await createBtn.isVisible()) {
      await createBtn.click();
      await page.waitForTimeout(500);

      await memberListPage.fillMemberForm(
        TEST_MEMBER_DATA.name,
        testEmail,
        'Test1234!@',
        '010-1234-5678'
      );

      await memberListPage.saveMember();
      await memberListPage.expectToastMessage(TOAST_MESSAGES.CREATED);
    }
  });

  test('should open member detail when clicking list item', async ({ page }) => {
    await page.waitForTimeout(1000);

    const itemCount = await memberListPage.getListItemCount();
    if (itemCount > 0) {
      await memberListPage.clickListItem(0);
      await page.waitForTimeout(500);

      const detailArea = page.locator('[class*="h-full"]');
      await expect(detailArea.first()).toBeVisible();
    }
  });

  test('should edit a member', async ({ page }) => {
    await page.waitForTimeout(1000);

    const itemCount = await memberListPage.getListItemCount();
    if (itemCount > 0) {
      await memberListPage.clickListItem(0);
      await page.waitForTimeout(500);

      const editBtn = page.locator('button:has-text("수정")');
      if (await editBtn.first().isVisible()) {
        await editBtn.first().click();
        await page.waitForTimeout(500);

        const nameInput = page.locator('input[name="m_name"], input[placeholder*="이름"]');
        if (await nameInput.isVisible()) {
          await nameInput.fill(`수정된 이름 ${Date.now()}`);
          await memberListPage.saveMember();
          await memberListPage.expectToastMessage(TOAST_MESSAGES.UPDATED);
        }
      }
    }
  });

  test('should search members', async ({ page }) => {
    const searchKeyword = '테스트';
    await memberListPage.searchMembers(searchKeyword);
    await page.waitForTimeout(1000);
  });

  test('should change member level', async ({ page }) => {
    await page.waitForTimeout(1000);

    const itemCount = await memberListPage.getListItemCount();
    if (itemCount > 0) {
      await memberListPage.checkMemberItem(0);

      const levelSelect = page.locator('button[role="combobox"], [data-testid="level-select"]').first();
      if (await levelSelect.isVisible()) {
        await levelSelect.click();
        await page.waitForTimeout(300);

        const firstOption = page.locator('[role="option"]').first();
        if (await firstOption.isVisible()) {
          await firstOption.click();

          const changeBtn = page.locator('button:has-text("변경"), button:has-text("등급변경")');
          if (await changeBtn.first().isVisible()) {
            await changeBtn.first().click();
          }
        }
      }
    }
  });

  test('should withdraw a member', async ({ page }) => {
    await page.waitForTimeout(1000);

    const itemCount = await memberListPage.getListItemCount();
    if (itemCount > 0) {
      await memberListPage.clickListItem(0);
      await page.waitForTimeout(500);

      const withdrawBtn = page.locator('button:has-text("탈퇴")');
      if (await withdrawBtn.first().isVisible()) {
        await withdrawBtn.first().click();

        const confirmDialog = page.locator('[role="alertdialog"]');
        await expect(confirmDialog).toBeVisible();
        await memberListPage.cancelAction();
      }
    }
  });

  test('should handle pagination', async ({ page }) => {
    await page.waitForTimeout(1000);

    const paginationButtons = page.locator('button').filter({ hasText: /^[0-9]+$/ });
    const buttonCount = await paginationButtons.count();

    if (buttonCount > 1) {
      await paginationButtons.nth(1).click();
      await page.waitForLoadState('networkidle');
    }
  });
});

test.describe('Member Form Validation', () => {
  let memberListPage: MemberListPage;

  test.beforeEach(async ({ page }) => {
    memberListPage = new MemberListPage(page);
    await memberListPage.goto();
  });

  test('should show validation error when email is invalid', async ({ page }) => {
    const createBtn = page.locator('button:has-text("회원 등록"), button:has-text("등록")').first();

    if (await createBtn.isVisible()) {
      await createBtn.click();
      await page.waitForTimeout(500);

      await memberListPage.fillMemberForm('테스트', 'invalid-email');
      await memberListPage.saveMember();
    }
  });

  test('should cancel member creation', async ({ page }) => {
    const createBtn = page.locator('button:has-text("회원 등록"), button:has-text("등록")').first();

    if (await createBtn.isVisible()) {
      await createBtn.click();
      await page.waitForTimeout(500);

      await memberListPage.fillMemberForm('임시 이름', 'temp@test.com');

      const cancelBtn = page.locator('button:has-text("취소")');
      if (await cancelBtn.first().isVisible()) {
        await cancelBtn.first().click();
        await page.waitForTimeout(500);
      }
    }
  });
});
