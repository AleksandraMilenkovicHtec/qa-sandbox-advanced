import { test, expect } from '../../fixtures';
import { logStep } from '../../../src/utils';

test.describe('Login - Usability', () => {
  test.use({ storageState: { cookies: [], origins: [] } });

  test.beforeEach(async ({ loginPage }) => { await loginPage.navigate(); });

  test('Labels and placeholders are correct', async ({ loginPage }) => {
    logStep('INFO: Read the placeholder text of the email input field');
    await expect(loginPage.emailInput).toHaveAttribute('placeholder', 'Email');
    logStep('PASS: Email field placeholder shows "Email"');

    logStep('INFO: Read the placeholder text of the password input field');
    await expect(loginPage.passwordInput).toHaveAttribute('placeholder', 'Password');
    logStep('PASS: Password field placeholder shows "Password"');
  });

  test('Remember me toggle is visible and interactive', async ({ loginPage }) => {
    logStep('INFO: Check the Remember me toggle is visible on the page');
    await expect(loginPage.rememberMeToggle).toBeVisible();
    logStep('PASS: Remember me toggle is visible');

    logStep('INFO: Click the toggle to enable Remember me');
    await loginPage.toggleRememberMe();
    await expect(loginPage.rememberMeInput).toBeChecked();
    logStep('PASS: Toggle is checked after clicking');

    logStep('INFO: Click the toggle again to disable Remember me');
    await loginPage.toggleRememberMe();
    await expect(loginPage.rememberMeInput).not.toBeChecked();
    logStep('PASS: Toggle is unchecked after clicking again');
  });
});
