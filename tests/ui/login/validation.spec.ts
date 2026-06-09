import { test, expect } from '../../fixtures';
import { logStep } from '../../../src/utils';
import { USER_EMAIL } from '../../../src/config/environment';

test.describe('Login - Validation', () => {
  test.use({ storageState: { cookies: [], origins: [] } });

  test.beforeEach(async ({ loginPage }) => { await loginPage.navigate(); });

  test('Invalid email format shows error', async ({ loginPage }) => {
    logStep('INFO: Attempt login with a non-email string in the email field');
    await loginPage.login('notanemail', 'somepass');
    logStep('PASS: Login form submitted');

    logStep('INFO: Verify an error message appears for the invalid email format');
    await expect(loginPage.errorMessage).toBeVisible();
    logStep('PASS: Error message displayed for invalid email format');
  });

  test('Empty password shows validation error', async ({ loginPage }) => {
    logStep('INFO: Fill in email and leave the password field empty');
    await loginPage.emailInput.fill(USER_EMAIL);
    await loginPage.loginButton.click();
    logStep('PASS: Form submitted with empty password');

    logStep('INFO: Verify password required error appears');
    await expect(loginPage.passwordError).toBeVisible();
    logStep('PASS: Password required validation error displayed');
  });

  test('Empty form shows all validation errors', async ({ loginPage }) => {
    logStep('INFO: Submit the login form without filling any fields');
    await loginPage.loginButton.click();
    logStep('PASS: Empty form submitted');

    logStep('INFO: Verify both email and password required errors appear');
    await expect(loginPage.emailError).toBeVisible();
    await expect(loginPage.passwordError).toBeVisible();
    logStep('PASS: Required field errors displayed for both email and password');
  });
});
