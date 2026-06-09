import { test, expect } from '../../fixtures';
import { logStep } from '../../../src/utils';

test.describe('Login - Security', () => {
  test.use({ storageState: { cookies: [], origins: [] } });

  test.beforeEach(async ({ loginPage }) => { await loginPage.navigate(); });

  test('Page loads over HTTPS', async ({ page }) => {
    logStep('INFO: Read the current page URL and check the protocol');
    expect(page.url()).toMatch(/^https:\/\//);
    logStep('PASS: Page URL uses HTTPS protocol');
  });

  test('Password field is masked', async ({ loginPage }) => {
    logStep('INFO: Read the type attribute of the password input field');
    await expect(loginPage.passwordInput).toHaveAttribute('type', 'password');
    logStep('PASS: Password input type is "password", characters are masked');
  });
});
