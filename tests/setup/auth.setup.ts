import { test as setup } from '@playwright/test';
import { TokenManager, logStep } from '../../src/utils';
import { BASE_URL, USER_EMAIL, USER_PASSWORD } from '../../src/config/environment';

const AUTH_FILE = 'playwright/.auth/auth.json';

setup('authenticate', async ({ page, request }) => {
  logStep('INFO: Send login request to obtain auth token');
  const tokenManager = new TokenManager(BASE_URL);
  await tokenManager.authenticate(request, USER_EMAIL, USER_PASSWORD);
  const state = tokenManager.getStorageState();

  logStep('INFO: Write auth tokens to browser localStorage');
  await page.goto('/login');
  await page.evaluate((s) => {
    localStorage.setItem('jwtSandboxToken', s.jwtSandboxToken);
    localStorage.setItem('jwtSandboxRefreshToken', s.jwtSandboxRefreshToken);
    localStorage.setItem('email', s.email);
    localStorage.setItem('remember_me', s.remember_me);
  }, state);

  await page.goto('/dashboard');
  await page.waitForURL('**/dashboard');
  logStep('PASS: Auth tokens stored, storage state saved to file');

  await page.context().storageState({ path: AUTH_FILE });
});
