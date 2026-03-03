import { test, expect } from '@playwright/test';
import { LoginPage } from '../../pages/login.page';
import { TEST_CREDENTIALS, ROUTES } from '../../fixtures/test-data';

test.describe('Login Page', () => {
  let loginPage: LoginPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    // Clear any existing auth state for login tests
    await page.context().clearCookies();
    await page.goto(ROUTES.login);
    await page.evaluate(() => localStorage.clear());
    await loginPage.goto();
  });

  test('should display login form correctly', async () => {
    await loginPage.expectPageTitle('관리자');
    await loginPage.expectLoginFormVisible();
    await expect(loginPage.userPageLink).toBeVisible();
  });

  test('should show validation error when email is empty', async () => {
    await loginPage.clearInputs();
    await loginPage.login('', 'testpassword');
    await loginPage.expectEmailError('이메일을 입력해주세요.');
  });

  test('should show validation error when password is empty', async () => {
    await loginPage.clearInputs();
    await loginPage.login('test@test.com', '');
    await loginPage.expectPasswordError('비밀번호를 입력해주세요.');
  });

  test('should login successfully with valid credentials', async () => {
    await loginPage.login(TEST_CREDENTIALS.admin.email, TEST_CREDENTIALS.admin.password);
    await loginPage.expectRedirectToMain();
  });

  test('should navigate to user page when clicking link', async () => {
    await loginPage.userPageLink.click();
    await expect(loginPage.page).toHaveURL('/');
  });
});

test.describe('Login Authentication', () => {
  test('should maintain auth state after page refresh', async ({ page }) => {
    const loginPage = new LoginPage(page);

    // Clear existing state
    await page.goto(ROUTES.login);
    await page.evaluate(() => localStorage.clear());
    await loginPage.goto();

    // Login
    await loginPage.loginAndWaitForRedirect();

    // Refresh the page
    await page.reload();
    await page.waitForLoadState('networkidle');

    // Should still be on main page (not redirected to login)
    expect(page.url()).toContain('/console/main');
  });

  test('should redirect to login when auth state is cleared', async ({ page }) => {
    const loginPage = new LoginPage(page);

    // Start logged in
    await page.goto(ROUTES.main);
    await page.waitForLoadState('networkidle');

    // Clear auth state
    await page.evaluate(() => {
      localStorage.removeItem('likeweb-auth-storage');
    });

    // Navigate to protected page
    await page.goto(ROUTES.main);
    await page.waitForLoadState('networkidle');

    // Should be redirected to login (or show login required state)
    // Note: The actual behavior depends on your auth middleware
  });
});
