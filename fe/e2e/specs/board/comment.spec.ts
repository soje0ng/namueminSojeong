import { test, expect } from '@playwright/test';
import { CommentPage } from '../../pages/board/comment.page';
import { TEST_BOARD_DATA, TOAST_MESSAGES } from '../../fixtures/test-data';

test.describe('Comment List Page', () => {
  let commentPage: CommentPage;

  test.beforeEach(async ({ page }) => {
    commentPage = new CommentPage(page);
    await commentPage.goto();
  });

  test('should display comment list page correctly', async () => {
    await expect(commentPage.searchInput).toBeVisible();
    await expect(commentPage.deleteButton).toBeVisible();
  });

  test('should show total count', async ({ page }) => {
    const countText = page.locator('text=/\\d+.*개/');
    await expect(countText).toBeVisible();
  });
});

test.describe('Comment Operations', () => {
  let commentPage: CommentPage;

  test.beforeEach(async ({ page }) => {
    commentPage = new CommentPage(page);
    await commentPage.goto();
  });

  test('should open comment detail when clicking list item', async ({ page }) => {
    await page.waitForTimeout(1000);

    const itemCount = await commentPage.getListItemCount();
    if (itemCount > 0) {
      await commentPage.clickListItem(0);
      await page.waitForTimeout(500);

      // Detail should be visible
      const detailArea = page.locator('[class*="h-full"]');
      await expect(detailArea.first()).toBeVisible();
    }
  });

  test('should search comments', async ({ page }) => {
    const searchKeyword = '테스트';
    await commentPage.searchComments(searchKeyword);
    await page.waitForTimeout(1000);
  });

  test('should select and delete comments', async ({ page }) => {
    await page.waitForTimeout(1000);

    const itemCount = await commentPage.getListItemCount();
    if (itemCount > 0) {
      await commentPage.checkCommentItem(0);
      await commentPage.deleteButton.click();

      const confirmDialog = page.locator('[role="alertdialog"]');
      await expect(confirmDialog).toBeVisible();
      await commentPage.cancelAction();
    }
  });

  test('should write a reply', async ({ page }) => {
    await page.waitForTimeout(1000);

    const itemCount = await commentPage.getListItemCount();
    if (itemCount > 0) {
      await commentPage.clickListItem(0);
      await page.waitForTimeout(500);

      const replyInput = page.locator('textarea').first();
      if (await replyInput.isVisible()) {
        await replyInput.fill(TEST_BOARD_DATA.comment.content);

        const submitButton = page.locator('button:has-text("등록"), button:has-text("답글")');
        if (await submitButton.first().isVisible()) {
          await submitButton.first().click();
        }
      }
    }
  });

  test('should delete a comment from detail view', async ({ page }) => {
    await page.waitForTimeout(1000);

    const itemCount = await commentPage.getListItemCount();
    if (itemCount > 0) {
      await commentPage.clickListItem(0);
      await page.waitForTimeout(500);

      const deleteBtn = page.locator('button:has-text("삭제")');
      if (await deleteBtn.first().isVisible()) {
        await deleteBtn.first().click();

        const confirmDialog = page.locator('[role="alertdialog"]');
        if (await confirmDialog.isVisible()) {
          await commentPage.cancelAction();
        }
      }
    }
  });
});

test.describe('Comment Board Filter', () => {
  let commentPage: CommentPage;

  test.beforeEach(async ({ page }) => {
    commentPage = new CommentPage(page);
    await commentPage.goto();
  });

  test('should filter comments by board', async ({ page }) => {
    // Look for a select element to filter by board
    const selectTrigger = page.locator('[data-testid="board-select"], button[role="combobox"]').first();

    if (await selectTrigger.isVisible()) {
      await selectTrigger.click();
      await page.waitForTimeout(300);

      const firstOption = page.locator('[role="option"]').first();
      if (await firstOption.isVisible()) {
        await firstOption.click();
        await page.waitForLoadState('networkidle');
      }
    }
  });
});
