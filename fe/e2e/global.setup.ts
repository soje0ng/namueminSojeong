import { test as setup, expect } from '@playwright/test';
import { TEST_CREDENTIALS } from './fixtures/test-data';

const authFile = 'e2e/.auth/admin.json';

setup('authenticate as admin', async ({ page }) => {
  // Navigate to login page
  await page.goto('/console');
  await page.waitForLoadState('networkidle');

  // Fill in login credentials
  await page.locator('input[name="m_email"]').fill(TEST_CREDENTIALS.admin.email);
  await page.locator('input[name="m_password"]').fill(TEST_CREDENTIALS.admin.password);

  // Click login button
  await page.locator('button[type="submit"]').click();

  // Wait for redirect to main page
  await page.waitForURL(/\/console\/main/, { timeout: 30000 });

  // Verify we're logged in by checking the URL
  expect(page.url()).toContain('/console/main');

  // Save storage state (includes localStorage with auth token)
  await page.context().storageState({ path: authFile });
});
