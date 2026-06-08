import { test as base } from '@playwright/test';
import { LoginPage } from '../src/pages/login-page';
import { NewTestCasePage } from '../src/pages/new-test-case-page';
import { TestCasesListPage } from '../src/pages/test-cases-list-page';

interface PageFixtures {
  loginPage: LoginPage;
  newTestCasePage: NewTestCasePage;
  testCasesListPage: TestCasesListPage;
}

export const test = base.extend<PageFixtures>({
  loginPage: async ({ page }, use) => { await use(new LoginPage(page)); },
  newTestCasePage: async ({ page }, use) => { await use(new NewTestCasePage(page)); },
  testCasesListPage: async ({ page }, use) => { await use(new TestCasesListPage(page)); },
});

export { expect } from '@playwright/test';
