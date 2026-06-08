import { test, expect } from '../../fixtures';
import { logStep } from '../../../src/utils';

test.describe('Test Case - Usability', () => {
  test.beforeEach(async ({ page }) => { await page.goto('/new-testcase'); });

  test('Enter key does not accidentally submit form', async ({ page, newTestCasePage }) => {
    logStep('INFO: Type a title in the title field');
    await newTestCasePage.titleInput.fill('Only title');
    logStep('PASS: Title entered');

    logStep('INFO: Press Enter while the title field is focused');
    await newTestCasePage.titleInput.press('Enter');
    logStep('PASS: Enter key pressed');

    logStep('INFO: Verify the form was not submitted and the page did not change');
    expect(page.url()).toContain('/new-testcase');
    logStep('PASS: Form not submitted, user stays on the new test case page');
  });

  test('Fields have correct placeholders', async ({ newTestCasePage }) => {
    logStep('INFO: Read the placeholder text of the title field');
    await expect(newTestCasePage.titleInput).toHaveAttribute('placeholder', 'Title');
    logStep('PASS: Title field placeholder shows "Title"');

    logStep('INFO: Read the placeholder text of the description field');
    await expect(newTestCasePage.descriptionInput).toHaveAttribute('placeholder', 'Description');
    logStep('PASS: Description field placeholder shows "Description"');

    logStep('INFO: Read the placeholder text of the expected result field');
    await expect(newTestCasePage.expectedResultInput).toHaveAttribute('placeholder', 'Expected Result');
    logStep('PASS: Expected result field placeholder shows "Expected Result"');

    logStep('INFO: Read the placeholder text of the test step field');
    await expect(newTestCasePage.testStepInput).toHaveAttribute('placeholder', 'Test step');
    logStep('PASS: Test step field placeholder shows "Test step"');
  });
});
