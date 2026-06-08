import type { Locator, Page } from '@playwright/test';

export class LoginPage {
  readonly emailInput: Locator;
  readonly passwordInput: Locator;
  readonly loginButton: Locator;
  readonly rememberMeToggle: Locator;
  readonly rememberMeInput: Locator;
  readonly forgotPasswordLink: Locator;
  readonly adminLink: Locator;
  readonly loginLink: Locator;
  readonly errorMessage: Locator;
  readonly emailError: Locator;
  readonly passwordError: Locator;

  constructor(private readonly page: Page) {
    this.emailInput = page.getByRole('textbox', { name: 'Email' });
    this.passwordInput = page.getByRole('textbox', { name: 'Password' });
    this.loginButton = page.getByRole('button', { name: 'Login' });
    this.rememberMeToggle = page.locator('label.switch');
    this.rememberMeInput = page.getByRole('switch');
    this.forgotPasswordLink = page.getByRole('link', { name: 'Forgot Password' });
    this.adminLink = page.getByRole('link', { name: 'Admin' });
    this.loginLink = page.getByRole('link', { name: 'Login' });
    this.errorMessage = page.getByText('is not authorized or wrong email/password combination');
    this.emailError = page.getByText('Email is required');
    this.passwordError = page.getByText('Password is required');
  }

  async navigate() {
    await this.page.goto('/login');
  }

  async login(email: string, password: string) {
    await this.emailInput.fill(email);
    await this.passwordInput.fill(password);
    await this.loginButton.click();
  }

  async toggleRememberMe() {
    await this.rememberMeToggle.click();
  }
}
