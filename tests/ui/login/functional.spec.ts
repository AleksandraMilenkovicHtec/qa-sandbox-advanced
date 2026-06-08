import { test, expect } from '../../fixtures';
import { logStep, analyzeHar, HAR_DIR } from '../../../src/utils';
import { USER_EMAIL, USER_PASSWORD } from '../../../src/config/environment';
import path from 'path';

const HAR_PATH = path.join(HAR_DIR, 'login-functional.har');

test.describe('Login - Functional', () => {
  test.use({
    storageState: { cookies: [], origins: [] },
    context: async ({ browser }, use) => {
      const context = await browser.newContext({
        recordHar: { path: HAR_PATH, urlFilter: /api/ },
        recordVideo: { dir: 'test-results/videos' },
        storageState: { cookies: [], origins: [] },
      });
      await use(context);
      await context.close();
    },
    page: async ({ context }, use) => {
      const page = await context.newPage();
      await use(page);
    },
  });

  test.beforeEach(async ({ loginPage }) => { await loginPage.navigate(); });
  test.afterAll(() => { analyzeHar(HAR_PATH); });

  test('Login succeeds with valid credentials', async ({ page, loginPage }) => {
    logStep('INFO: Log in with valid email and password');
    await loginPage.login(USER_EMAIL, USER_PASSWORD);
    logStep('PASS: Login form submitted');

    logStep('INFO: Verify user is redirected to the dashboard');
    await page.waitForURL('**/dashboard');
    expect(page.url()).toContain('/dashboard');
    logStep('PASS: User redirected to dashboard');
  });

  test('Login fails with invalid credentials', async ({ page, loginPage }) => {
    logStep('INFO: Attempt login with wrong email and password');
    await loginPage.login('wrong@email.com', 'wrongpassword');
    logStep('PASS: Login form submitted');

    logStep('INFO: Verify error message appears and user stays on login page');
    await expect(loginPage.errorMessage).toBeVisible();
    expect(page.url()).toContain('/login');
    logStep('PASS: Error message displayed, user remains on login page');
  });

  test('Remember me persists session', async ({ page, loginPage }) => {
    logStep('INFO: Enable the Remember me toggle before logging in');
    await loginPage.toggleRememberMe();
    logStep('PASS: Remember me toggle enabled');

    logStep('INFO: Log in with valid credentials');
    await loginPage.login(USER_EMAIL, USER_PASSWORD);
    await page.waitForURL('**/dashboard');
    logStep('PASS: User logged in and on dashboard');

    logStep('INFO: Verify session tokens are persisted in localStorage');
    const storage = await page.evaluate(() => ({
      token: localStorage.getItem('jwtSandboxToken'),
      remember: localStorage.getItem('remember_me'),
    }));
    expect(storage.token).toBeTruthy();
    expect(storage.remember).toBe('true');
    logStep('PASS: Session token and remember me flag stored in localStorage');
  });

  test('Forgot Password link redirects correctly', async ({ page, loginPage }) => {
    logStep('INFO: Click the Forgot Password link on the login page');
    await loginPage.forgotPasswordLink.click();
    logStep('PASS: Forgot Password link clicked');

    logStep('INFO: Verify user is redirected to the forgot password page');
    await page.waitForURL('**/forgot-password');
    expect(page.url()).toContain('/forgot-password');
    logStep('PASS: User redirected to forgot password page');
  });

  test('Admin link navigates to admin login', async ({ page, loginPage }) => {
    logStep('INFO: Click the Admin link in the top navigation');
    await loginPage.adminLink.click();
    logStep('PASS: Admin link clicked');

    logStep('INFO: Verify user is redirected to the admin login page');
    await page.waitForURL('**/admin-login');
    expect(page.url()).toContain('/admin-login');
    logStep('PASS: User redirected to admin login page');
  });

  test('Login link stays on login page', async ({ page, loginPage }) => {
    logStep('INFO: Click the Login link in the top navigation');
    await loginPage.loginLink.click();
    logStep('PASS: Login link clicked');

    logStep('INFO: Verify URL remains on the login page');
    expect(page.url()).toContain('/login');
    logStep('PASS: User remains on login page');
  });

  test('Empty fields do not trigger backend call', async ({ page, loginPage }) => {
    let apiCalled = false;

    logStep('INFO: Intercept outgoing API requests to detect backend calls');
    await page.route('**/api/**', (route) => { apiCalled = true; return route.continue(); });
    logStep('PASS: Network interception set up');

    logStep('INFO: Click the login button without filling any fields');
    await loginPage.loginButton.click();
    logStep('PASS: Login button clicked');

    logStep('INFO: Verify frontend validation errors appear without calling the backend');
    await expect(loginPage.emailError).toBeVisible();
    await expect(loginPage.passwordError).toBeVisible();
    expect(apiCalled).toBe(false);
    logStep('PASS: Validation errors shown, no backend request made');
  });
});
