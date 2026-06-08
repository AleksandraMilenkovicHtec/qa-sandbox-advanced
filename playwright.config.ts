import { defineConfig, devices } from '@playwright/test';
import dotenv from 'dotenv';
import path from 'path';

const ENV = process.env.TEST_ENV ?? 'staging';
const envFile = ENV === 'staging' ? '.env' : `.env.${ENV}`;
dotenv.config({ path: path.resolve(__dirname, envFile) });

const AUTH_FILE = 'playwright/.auth/auth.json';

export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: [
    ['list'],
    ['allure-playwright', { resultsDir: 'reports/allure-results' }],
  ],
  use: {
    baseURL: process.env.BASE_URL,
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
  },
  projects: [
    {
      name: 'auth-setup',
      testDir: './tests/setup',
      testMatch: /auth\.setup\.ts/,
    },
    {
      name: 'ui-chromium',
      testDir: './tests/ui',
      dependencies: ['auth-setup'],
      use: {
        ...devices['Desktop Chrome'],
        storageState: AUTH_FILE,
      },
    },
    {
      name: 'ui-firefox',
      testDir: './tests/ui',
      dependencies: ['auth-setup'],
      use: {
        ...devices['Desktop Firefox'],
        storageState: AUTH_FILE,
      },
    },
    {
      name: 'ui-webkit',
      testDir: './tests/ui',
      dependencies: ['auth-setup'],
      use: {
        ...devices['Desktop Safari'],
        storageState: AUTH_FILE,
      },
    },
    {
      name: 'api',
      testDir: './tests/api',
      use: { extraHTTPHeaders: { 'Content-Type': 'application/json' } },
    },
  ],
});
