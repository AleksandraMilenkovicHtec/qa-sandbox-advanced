import { test, expect } from '../../fixtures';
import { logStep, randomTestCaseTitle, analyzeHar, HAR_DIR } from '../../../src/utils';
import path from 'path';
import fs from 'fs';

const HAR_PATH = path.join(HAR_DIR, 'test-case-functional.har');

test.describe('Test Case - Functional', () => {
  let createdTitle: string | null = null;

  test.use({
    context: async ({ browser, storageState }, use) => {
      const context = await browser.newContext({
        recordHar: { path: HAR_PATH, urlFilter: /api/ },
        recordVideo: { dir: 'test-results/videos', size: { width: 1280, height: 720 } },
        storageState: storageState as string,
      });
      await use(context);
      await context.close();
    },
    page: async ({ context }, use, testInfo) => {
      const page = await context.newPage();
      await use(page);
      const videoPath = await page.video()?.path();
      if (videoPath && fs.existsSync(videoPath)) {
        await testInfo.attach('video', { path: videoPath, contentType: 'video/webm' });
      }
    },
  });

  test('Create test case with required fields', async ({ page, newTestCasePage }) => {
    createdTitle = randomTestCaseTitle();

    logStep('INFO: Open the new test case form');
    await page.goto('/new-testcase');
    logStep('PASS: New test case form loaded');

    logStep('INFO: Fill in the title, expected result and one test step');
    await newTestCasePage.fillRequiredFields(createdTitle, 'Expected result', 'Step 1');
    logStep('PASS: Required fields filled');

    logStep('INFO: Submit the form to create the test case');
    await newTestCasePage.submit();
    await page.waitForURL('**/testcases');
    logStep('PASS: Form submitted successfully');

    logStep('INFO: Verify the new test case appears in the test case list');
    await expect(page.getByText(createdTitle).first()).toBeVisible();
    logStep('PASS: Test case visible in the list');
  });

  test('Create test case with optional description', async ({ page, newTestCasePage }) => {
    createdTitle = randomTestCaseTitle();

    logStep('INFO: Open the new test case form');
    await page.goto('/new-testcase');
    logStep('PASS: New test case form loaded');

    logStep('INFO: Fill in all fields including the optional description');
    await newTestCasePage.fillAllFields(createdTitle, 'A test description', 'Expected', 'Step 1');
    logStep('PASS: All fields filled');

    logStep('INFO: Submit the form to create the test case');
    await newTestCasePage.submit();
    await page.waitForURL('**/testcases');
    logStep('PASS: Form submitted successfully');

    logStep('INFO: Verify the new test case appears in the test case list');
    await expect(page.getByText(createdTitle).first()).toBeVisible();
    logStep('PASS: Test case with description visible in the list');
  });

  test('Add multiple test steps', async ({ page, newTestCasePage }) => {
    createdTitle = randomTestCaseTitle();

    logStep('INFO: Open the new test case form');
    await page.goto('/new-testcase');
    logStep('PASS: New test case form loaded');

    logStep('INFO: Fill required fields and add three test steps');
    await newTestCasePage.titleInput.fill(createdTitle);
    await newTestCasePage.expectedResultInput.fill('Expected result');
    await newTestCasePage.testStepInput.fill('Step 1');
    await newTestCasePage.addTestStep('Step 2');
    await newTestCasePage.addTestStep('Step 3');
    logStep('PASS: Three test steps added');

    logStep('INFO: Submit the form to create the test case');
    await newTestCasePage.submit();
    await page.waitForURL('**/testcases');
    logStep('PASS: Form submitted successfully');

    logStep('INFO: Verify the new test case appears in the test case list');
    await expect(page.getByText(createdTitle).first()).toBeVisible();
    logStep('PASS: Test case with multiple steps visible in the list');
  });

  test('Mark test case as Automated', async ({ page, newTestCasePage }) => {
    createdTitle = randomTestCaseTitle();

    logStep('INFO: Open the new test case form');
    await page.goto('/new-testcase');
    logStep('PASS: New test case form loaded');

    logStep('INFO: Fill required fields and enable the Automated toggle');
    await newTestCasePage.fillRequiredFields(createdTitle, 'Expected', 'Step 1');
    await newTestCasePage.toggleAutomated();
    logStep('PASS: Required fields filled and Automated toggle enabled');

    logStep('INFO: Submit the form to create the test case');
    await newTestCasePage.submit();
    await page.waitForURL('**/testcases');
    logStep('PASS: Form submitted successfully');

    logStep('INFO: Verify the automated test case appears in the test case list');
    await expect(page.getByText(createdTitle).first()).toBeVisible();
    logStep('PASS: Automated test case visible in the list');
  });

  test('Automated toggle defaults to off', async ({ page, newTestCasePage }) => {
    logStep('INFO: Open the new test case form');
    await page.goto('/new-testcase');
    logStep('PASS: New test case form loaded');

    logStep('INFO: Check the default state of the Automated toggle');
    await expect(newTestCasePage.automatedInput).not.toBeChecked();
    logStep('PASS: Automated toggle is off by default');
  });

  test('Back arrow returns to test case list', async ({ page, newTestCasePage }) => {
    logStep('INFO: Open the new test case form');
    await page.goto('/new-testcase');
    logStep('PASS: New test case form loaded');

    logStep('INFO: Click the back arrow to navigate away from the form');
    await newTestCasePage.backArrow.click();
    await page.waitForURL('**/testcases');
    logStep('PASS: User returned to the test case list');
  });

  test.afterEach(async ({ testCasesListPage }) => {
    if (createdTitle) {
      logStep(`INFO: Delete test case "${createdTitle}" created during the test`);
      await testCasesListPage.deleteTestCaseByTitle(createdTitle);
      logStep(`PASS: Test case "${createdTitle}" deleted`);
      createdTitle = null;
    }
  });

  test.afterAll(() => { analyzeHar(HAR_PATH); });
});
