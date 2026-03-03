import { Page, expect } from '@playwright/test';

export async function waitForLoadingComplete(page: Page) {
  const loadingIndicator = page.locator('[data-testid="loading"]');
  await loadingIndicator.waitFor({ state: 'hidden', timeout: 30000 }).catch(() => {
    // Loading indicator might not appear for fast operations
  });
}

export async function waitForTableData(page: Page, timeout = 10000) {
  const tableBody = page.locator('tbody');
  await tableBody.waitFor({ state: 'visible', timeout });
  const rows = page.locator('tbody tr');
  await expect(rows.first()).toBeVisible({ timeout });
}

export async function waitForApiCall(page: Page, urlPattern: string | RegExp) {
  return page.waitForResponse(
    response => {
      const url = response.url();
      if (typeof urlPattern === 'string') {
        return url.includes(urlPattern) && response.status() === 200;
      }
      return urlPattern.test(url) && response.status() === 200;
    },
    { timeout: 30000 }
  );
}

export async function waitForToast(page: Page, message?: string, timeout = 10000) {
  const toast = page.locator('[data-sonner-toast]');
  await toast.waitFor({ state: 'visible', timeout });
  if (message) {
    await expect(toast).toContainText(message, { timeout });
  }
  return toast;
}

export async function waitForModalOpen(page: Page, timeout = 10000) {
  const modal = page.locator('[role="dialog"]');
  await modal.waitFor({ state: 'visible', timeout });
  return modal;
}

export async function waitForModalClose(page: Page, timeout = 10000) {
  const modal = page.locator('[role="dialog"]');
  await modal.waitFor({ state: 'hidden', timeout });
}

export async function waitForConfirmDialog(page: Page, timeout = 5000) {
  const confirmDialog = page.locator('[role="alertdialog"]');
  await confirmDialog.waitFor({ state: 'visible', timeout });
  return confirmDialog;
}

export async function waitForUrl(page: Page, urlPattern: string | RegExp, timeout = 10000) {
  await page.waitForURL(urlPattern, { timeout });
}

export async function waitForNetworkIdle(page: Page, timeout = 30000) {
  await page.waitForLoadState('networkidle', { timeout });
}

export async function retryAction<T>(
  action: () => Promise<T>,
  maxRetries = 3,
  delayMs = 1000
): Promise<T> {
  let lastError: Error | undefined;
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await action();
    } catch (error) {
      lastError = error as Error;
      if (i < maxRetries - 1) {
        await new Promise(resolve => setTimeout(resolve, delayMs));
      }
    }
  }
  throw lastError;
}
