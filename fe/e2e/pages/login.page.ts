import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from './base.page';
import { TEST_CREDENTIALS, ROUTES } from '../fixtures/test-data';

export class LoginPage extends BasePage {
  readonly emailInput: Locator;
  readonly passwordInput: Locator;
  readonly loginButton: Locator;
  readonly userPageLink: Locator;
  readonly pageTitle: Locator;
  readonly emailError: Locator;
  readonly passwordError: Locator;

  constructor(page: Page) {
    super(page);
    this.emailInput = page.locator('input[name="m_email"]');
    this.passwordInput = page.locator('input[name="m_password"]');
    this.loginButton = page.locator('button[type="submit"]');
    this.userPageLink = page.locator('a:has-text("사용자화면 바로가기")');
    this.pageTitle = page.locator('h1');
    this.emailError = page.locator('input[name="m_email"] ~ p, input[name="m_email"] + div p');
    this.passwordError = page.locator('input[name="m_password"] ~ p, #m_password ~ p');
  }

  async goto() {
    await this.page.goto(ROUTES.login);
    await this.waitForPageLoad();
  }

  async login(email: string = TEST_CREDENTIALS.admin.email, password: string = TEST_CREDENTIALS.admin.password) {
    await this.emailInput.clear();
    await this.emailInput.fill(email);
    await this.passwordInput.clear();
    await this.passwordInput.fill(password);
    await this.loginButton.click();
  }

  async loginAndWaitForRedirect() {
    await this.login();
    await this.page.waitForURL(/\/console\/main/, { timeout: 30000 });
  }

  async expectPageTitle(title: string) {
    await expect(this.pageTitle).toHaveText(title);
  }

  async expectLoginFormVisible() {
    await expect(this.emailInput).toBeVisible();
    await expect(this.passwordInput).toBeVisible();
    await expect(this.loginButton).toBeVisible();
  }

  async expectRedirectToMain() {
    await this.page.waitForURL(/\/console\/main/, { timeout: 30000 });
    expect(this.page.url()).toContain('/console/main');
  }

  async expectEmailError(message: string) {
    // Find the error message that follows the email input
    const errorLocator = this.page.locator('text=' + message).first();
    await expect(errorLocator).toBeVisible();
  }

  async expectPasswordError(message: string) {
    const errorLocator = this.page.locator('text=' + message).first();
    await expect(errorLocator).toBeVisible();
  }

  async clearInputs() {
    await this.emailInput.clear();
    await this.passwordInput.clear();
  }

  async getEmailInputValue(): Promise<string> {
    return this.emailInput.inputValue();
  }

  async getPasswordInputValue(): Promise<string> {
    return this.passwordInput.inputValue();
  }

  async isLoggedIn(): Promise<boolean> {
    const authData = await this.page.evaluate(() => {
      return localStorage.getItem('likeweb-auth-storage');
    });
    return authData !== null && authData !== '';
  }

  async logout() {
    await this.page.evaluate(() => {
      localStorage.removeItem('likeweb-auth-storage');
    });
    await this.goto();
  }
}
