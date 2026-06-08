import type { Locator, Page } from '@playwright/test';

export class NewTestCasePage {
  readonly titleInput: Locator;
  readonly descriptionInput: Locator;
  readonly expectedResultInput: Locator;
  readonly testStepInput: Locator;
  readonly addTestStepButton: Locator;
  readonly automatedToggle: Locator;
  readonly automatedInput: Locator;
  readonly submitButton: Locator;
  readonly backArrow: Locator;

  constructor(private readonly page: Page) {
    this.titleInput = page.getByRole('textbox', { name: 'Title' });
    this.descriptionInput = page.getByRole('textbox', { name: 'Description' });
    this.expectedResultInput = page.getByRole('textbox', { name: 'Expected Result' });
    this.testStepInput = page.getByRole('textbox', { name: 'Test step' });
    this.addTestStepButton = page.getByText('Add Test Step');
    this.automatedToggle = page.locator('label.switch');
    this.automatedInput = page.getByRole('switch');
    this.submitButton = page.getByRole('button', { name: 'Submit' });
    this.backArrow = page.getByRole('link', { name: /New Test Case/ });
  }

  async fillRequiredFields(title: string, expectedResult: string, testStep: string) {
    await this.titleInput.fill(title);
    await this.expectedResultInput.fill(expectedResult);
    await this.testStepInput.fill(testStep);
  }

  async fillAllFields(title: string, description: string, expectedResult: string, testStep: string) {
    await this.titleInput.fill(title);
    await this.descriptionInput.fill(description);
    await this.expectedResultInput.fill(expectedResult);
    await this.testStepInput.fill(testStep);
  }

  async addTestStep(value: string) {
    await this.addTestStepButton.click();
    await this.page.getByRole('textbox', { name: 'Test step' }).last().fill(value);
  }

  async toggleAutomated() {
    await this.automatedToggle.click();
  }

  async submit() {
    await this.submitButton.click();
  }
}
