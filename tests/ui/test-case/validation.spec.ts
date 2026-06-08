import { test, expect } from '../../fixtures';
import { logStep, TokenManager, randomTestCaseTitle } from '../../../src/utils';
import { BASE_URL, USER_EMAIL, USER_PASSWORD } from '../../../src/config/environment';

test.describe('Test Case - Validation', () => {
  test.beforeEach(async ({ page }) => { await page.goto('/new-testcase'); });

  test('Submit with empty Title shows error', async ({ page, newTestCasePage }) => {
    logStep('INFO: Fill expected result and test step, leave the title empty');
    await newTestCasePage.expectedResultInput.fill('Expected');
    await newTestCasePage.testStepInput.fill('Step 1');
    logStep('PASS: Fields filled without title');

    logStep('INFO: Submit the form with no title entered');
    await newTestCasePage.submit();
    logStep('PASS: Form submitted');

    logStep('INFO: Verify a validation error is shown for the missing title');
    await expect(page.getByText(/title/i)).toBeVisible();
    expect(page.url()).toContain('/new-testcase');
    logStep('PASS: Title required error displayed, form not submitted');
  });

  test('Submit with empty Expected Result shows error', async ({ page, newTestCasePage }) => {
    logStep('INFO: Fill title and test step, leave expected result empty');
    await newTestCasePage.titleInput.fill('A title');
    await newTestCasePage.testStepInput.fill('Step 1');
    logStep('PASS: Fields filled without expected result');

    logStep('INFO: Submit the form with no expected result entered');
    await newTestCasePage.submit();
    logStep('PASS: Form submitted');

    logStep('INFO: Verify a validation error is shown for the missing expected result');
    await expect(page.getByText(/expected result/i)).toBeVisible();
    expect(page.url()).toContain('/new-testcase');
    logStep('PASS: Expected result required error displayed, form not submitted');
  });

  test('Submit with no test steps shows error', async ({ page, newTestCasePage }) => {
    logStep('INFO: Fill title and expected result, leave test steps empty');
    await newTestCasePage.titleInput.fill('A title');
    await newTestCasePage.expectedResultInput.fill('Expected');
    logStep('PASS: Fields filled without any test steps');

    logStep('INFO: Submit the form with no test steps added');
    await newTestCasePage.submit();
    logStep('PASS: Form submitted');

    logStep('INFO: Verify a validation error is shown for the missing test steps');
    await expect(page.getByText('There must be at least one test step')).toBeVisible();
    expect(page.url()).toContain('/new-testcase');
    logStep('PASS: Test step required error displayed, form not submitted');
  });

  test('Multiple test steps preserved in order', async ({ page, newTestCasePage, testCasesListPage, request }) => {
    const title = randomTestCaseTitle();

    logStep('INFO: Fill required fields and add three steps in a specific order');
    await newTestCasePage.titleInput.fill(title);
    await newTestCasePage.expectedResultInput.fill('Expected');
    await newTestCasePage.testStepInput.fill('First step');
    await newTestCasePage.addTestStep('Second step');
    await newTestCasePage.addTestStep('Third step');
    logStep('PASS: Three steps added in order');

    logStep('INFO: Submit the form to save the test case');
    await newTestCasePage.submit();
    await page.waitForURL('**/testcases');
    logStep('PASS: Test case saved');

    logStep('INFO: Fetch the saved test case from the API and check step order');
    const tokenManager = new TokenManager(BASE_URL);
    const token = await tokenManager.authenticate(request, USER_EMAIL, USER_PASSWORD);
    const apiResponse = await request.get(`${BASE_URL}/api/candidate/testcases`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const testCases = await apiResponse.json();
    const createdTc = testCases.find((tc: { title: string }) => tc.title === title);
    expect(createdTc.test_steps[0].value).toBe('First step');
    expect(createdTc.test_steps[1].value).toBe('Second step');
    expect(createdTc.test_steps[2].value).toBe('Third step');
    logStep('PASS: Test steps returned in the same order they were entered');

    logStep(`INFO: Delete test case "${title}" via the edit page`);
    await testCasesListPage.deleteTestCaseByTitle(title);
    logStep(`PASS: Test case "${title}" deleted`);
  });
});
