import type { Page } from '@playwright/test';

export class TestCasesListPage {
  constructor(private readonly page: Page) {}

  async deleteTestCaseByTitle(title: string) {
    await this.page.goto('/testcases');
    await this.page.getByText(title).first().click();
    await this.page.waitForURL('**/edit-testcase/**');
    await this.page.getByRole('button').filter({ hasText: /^$/ }).click();
    await this.page.getByText('Remove', { exact: true }).click();
    await this.page.waitForURL('**/testcases');
  }
}
