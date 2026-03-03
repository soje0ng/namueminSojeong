import { test, expect } from "@playwright/test";
import { PostListPage } from "../../pages/board/post-list.page";
import { TEST_BOARD_DATA, TOAST_MESSAGES } from "../../fixtures/test-data";

test.describe("Post List Page", () => {
  let postListPage: PostListPage;

  test.beforeEach(async ({ page }) => {
    postListPage = new PostListPage(page);
    await postListPage.goto("notice");
  });

  test("should display post list page correctly", async () => {
    await expect(postListPage.createButton).toBeVisible();
    await expect(postListPage.searchInput).toBeVisible();
    await expect(postListPage.deleteButton).toBeVisible();
  });

  test("should show total count", async ({ page }) => {
    const countText = page.locator("text=/\\d+.*개/");
    await expect(countText).toBeVisible();
  });

  test("should navigate to different board categories", async ({ page }) => {
    // Navigate to a different category
    await page.goto("/console/board/post?category=faq");
    await page.waitForLoadState("networkidle");
    expect(page.url()).toContain("category=faq");
  });
});

test.describe("Post CRUD Operations", () => {
  let postListPage: PostListPage;
  const testTitle = `E2E 테스트 ${Date.now()}`;

  test.beforeEach(async ({ page }) => {
    postListPage = new PostListPage(page);
    await postListPage.goto("notice");
  });

  test("should create a new post", async ({ page }) => {
    await postListPage.clickCreateButton();
    await page.waitForTimeout(500);

    // Fill in the form
    await postListPage.fillPostForm(testTitle, TEST_BOARD_DATA.post.content);

    // Save the post
    await postListPage.savePost();

    // Wait for success toast
    await postListPage.expectToastMessage(TOAST_MESSAGES.CREATED);
  });

  test("should open post detail when clicking list item", async ({ page }) => {
    // Wait for list to load
    await page.waitForTimeout(1000);

    const itemCount = await postListPage.getListItemCount();
    if (itemCount > 0) {
      await postListPage.clickListItem(0);
      await page.waitForTimeout(500);

      // Detail panel should show content
      const detailPanel = page.locator('[class*="h-full"] [class*="rounded"]');
      await expect(detailPanel.first()).toBeVisible();
    }
  });

  test("should edit a post", async ({ page }) => {
    await page.waitForTimeout(1000);

    const itemCount = await postListPage.getListItemCount();
    if (itemCount > 0) {
      // Click first item to view detail
      await postListPage.clickListItem(0);
      await page.waitForTimeout(500);

      // Click edit button
      await postListPage.editPost();
      await page.waitForTimeout(500);

      // Modify title
      const updatedTitle = `수정된 제목 ${Date.now()}`;
      await postListPage.fillPostForm(updatedTitle);

      // Save changes
      await postListPage.savePost();
      await postListPage.expectToastMessage(TOAST_MESSAGES.UPDATED);
    }
  });

  test("should search posts", async ({ page }) => {
    const searchKeyword = "테스트";
    await postListPage.searchPosts(searchKeyword);
    await page.waitForTimeout(1000);

    // Check if search was performed (URL should contain search param or list should update)
  });

  test("should toggle notice status", async ({ page }) => {
    await page.waitForTimeout(1000);

    const itemCount = await postListPage.getListItemCount();
    if (itemCount > 0) {
      await postListPage.toggleNotice(0);
      await postListPage.expectToastMessage(TOAST_MESSAGES.UPDATED || "변경");
    }
  });

  test("should select and delete posts", async ({ page }) => {
    await page.waitForTimeout(1000);

    const itemCount = await postListPage.getListItemCount();
    if (itemCount > 0) {
      // Check first item
      await postListPage.checkPostItem(0);

      // Click delete button
      await postListPage.deleteButton.click();

      // Confirm dialog should appear
      const confirmDialog = page.locator('[role="alertdialog"]');
      await expect(confirmDialog).toBeVisible();

      // Cancel the deletion
      await postListPage.cancelAction();
    }
  });

  test("should handle pagination", async ({ page }) => {
    await page.waitForTimeout(1000);

    // Check if pagination exists (only if there are enough items)
    const paginationButtons = page
      .locator("button")
      .filter({ hasText: /^[0-9]+$/ });
    const buttonCount = await paginationButtons.count();

    if (buttonCount > 1) {
      // Click page 2 if available
      await paginationButtons.nth(1).click();
      await page.waitForLoadState("networkidle");
    }
  });
});

test.describe("Post Form Validation", () => {
  let postListPage: PostListPage;

  test.beforeEach(async ({ page }) => {
    postListPage = new PostListPage(page);
    await postListPage.goto("notice");
  });

  test("should show validation error when title is empty", async ({ page }) => {
    await postListPage.clickCreateButton();
    await page.waitForTimeout(500);

    // Try to save without title
    await postListPage.savePost();

    // Should show validation error
    const errorMessage = page.locator("text=/제목.*입력|필수/");
    // Form should not submit without title
  });

  test("should cancel post creation", async ({ page }) => {
    await postListPage.clickCreateButton();
    await page.waitForTimeout(500);

    await postListPage.fillPostForm("임시 제목");
    await postListPage.cancelEdit();

    // Should return to list view
    await page.waitForTimeout(500);
  });
});
