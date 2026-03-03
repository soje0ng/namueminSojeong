import { Page } from '@playwright/test';
import { TEST_CREDENTIALS } from '../fixtures/test-data';

export async function loginAsAdmin(page: Page) {
  await page.goto('/console');
  await page.waitForLoadState('networkidle');

  const emailInput = page.locator('input[name="m_email"]');
  const passwordInput = page.locator('input[name="m_password"]');
  const loginButton = page.locator('button[type="submit"]');

  await emailInput.fill(TEST_CREDENTIALS.admin.email);
  await passwordInput.fill(TEST_CREDENTIALS.admin.password);
  await loginButton.click();

  await page.waitForURL(/\/console\/main/, { timeout: 30000 });
}

export async function logout(page: Page) {
  // Clear localStorage and navigate to login
  await page.evaluate(() => {
    localStorage.removeItem('likeweb-auth-storage');
  });
  await page.goto('/console');
}

export async function isLoggedIn(page: Page): Promise<boolean> {
  const authData = await page.evaluate(() => {
    return localStorage.getItem('likeweb-auth-storage');
  });
  return authData !== null && authData !== '';
}

export async function getAuthToken(page: Page): Promise<string | null> {
  const authData = await page.evaluate(() => {
    const data = localStorage.getItem('likeweb-auth-storage');
    if (!data) return null;
    try {
      // Note: The actual token is encrypted, so we just check existence
      return data;
    } catch {
      return null;
    }
  });
  return authData;
}
