import { test, expect, request as playwrightRequest } from '@playwright/test';
import type { APIRequestContext } from '@playwright/test';
import { TokenManager, ApiClient, logStep, randomTestCaseTitle } from '../../src/utils';
import { BASE_URL, USER_EMAIL, USER_PASSWORD } from '../../src/config/environment';
import { TestCaseResponseSchema } from '../../src/schemas';

const findByTitle = (body: unknown, title: string) => {
  const all = Array.isArray(body) ? body : [body];
  const found = all.find((tc: { title: string }) => tc.title === title);
  if (!found) throw new Error(`Test case with title "${title}" not found in response`);
  return found;
};

test.describe('Test Case API', () => {
  let apiClient: ApiClient;
  let apiContext: APIRequestContext;
  const createdIds: number[] = [];

  test.beforeAll(async () => {
    logStep('INFO: Create API context and log in test user');
    apiContext = await playwrightRequest.newContext({
      baseURL: BASE_URL,
      extraHTTPHeaders: { 'Content-Type': 'application/json' },
    });
    const tokenManager = new TokenManager(BASE_URL);
    await tokenManager.authenticate(apiContext, USER_EMAIL, USER_PASSWORD);
    apiClient = new ApiClient(apiContext, BASE_URL, tokenManager);
    logStep('PASS: User logged in, API client ready');
  });

  test.afterAll(async () => {
    logStep(`INFO: Delete ${createdIds.length} test case(s) created during tests`);
    await Promise.all(createdIds.map((id) => apiClient.delete(`/api/candidate/testcases/${id}`)));
    logStep('PASS: Test cases deleted');
    await apiContext.dispose();
  });

  test('Create test case with valid data', async () => {
    const title = randomTestCaseTitle();

    logStep('INFO: Submit new test case with title, description and two steps');
    const response = await apiClient.post('/api/candidate/testcases', {
      data: {
        title,
        description: 'API test description',
        expected_result: 'Should pass',
        test_steps: [{ id: 1, value: 'Step 1' }, { id: 2, value: 'Step 2' }],
        automated: false,
      },
    });
    logStep('PASS: Test case creation request completed');

    logStep('INFO: Verify test case is returned with correct data and schema');
    expect(response.status()).toBe(200);
    const testCase = findByTitle(await response.json(), title);
    expect(TestCaseResponseSchema.safeParse(testCase).success).toBe(true);
    expect(testCase.title).toBe(title);
    expect(testCase.test_steps).toHaveLength(2);
    createdIds.push(testCase.id);
    logStep('PASS: Test case created with correct title and steps');
  });

  test('Create test case without Title returns error', async () => {
    logStep('INFO: Submit test case with empty title field');
    const response = await apiClient.post('/api/candidate/testcases', {
      data: { title: '', expected_result: 'Fail', test_steps: [{ id: 1, value: 'Step' }], automated: false },
    });
    logStep('PASS: Request completed');

    logStep('INFO: Verify server rejects request with validation error');
    expect(response.status()).toBeGreaterThanOrEqual(400);
    logStep('PASS: Validation error returned for missing title');
  });

  test('Create test case without Expected Result returns error', async () => {
    logStep('INFO: Submit test case with empty expected result field');
    const response = await apiClient.post('/api/candidate/testcases', {
      data: { title: randomTestCaseTitle(), expected_result: '', test_steps: [{ id: 1, value: 'Step' }], automated: false },
    });
    logStep('PASS: Request completed');

    logStep('INFO: Verify server rejects request with validation error');
    expect(response.status()).toBeGreaterThanOrEqual(400);
    logStep('PASS: Validation error returned for missing expected result');
  });

  test('Create test case without Test Steps returns error', async () => {
    logStep('INFO: Submit test case with empty test steps array');
    const response = await apiClient.post('/api/candidate/testcases', {
      data: { title: randomTestCaseTitle(), expected_result: 'Expected', test_steps: [], automated: false },
    });
    logStep('PASS: Request completed');

    logStep('INFO: Verify server rejects request with validation error');
    expect(response.status()).toBeGreaterThanOrEqual(400);
    logStep('PASS: Validation error returned for missing test steps');
  });

  test('Create test case with Automated flag', async () => {
    const title = randomTestCaseTitle();

    logStep('INFO: Submit test case with automated flag set to true');
    const response = await apiClient.post('/api/candidate/testcases', {
      data: { title, expected_result: 'Automated', test_steps: [{ id: 1, value: 'Step' }], automated: true },
    });
    logStep('PASS: Test case creation request completed');

    logStep('INFO: Verify test case is saved with automated flag enabled');
    expect(response.status()).toBe(200);
    const testCase = findByTitle(await response.json(), title);
    expect(testCase.automated).toBe(true);
    createdIds.push(testCase.id);
    logStep('PASS: Test case created with automated flag set to true');
  });

  test('Create test case without auth returns unauthorized', async () => {
    logStep('INFO: Submit test case request without authorization header');
    const unauthContext = await playwrightRequest.newContext();
    const response = await unauthContext.post(`${BASE_URL}/api/candidate/testcases`, {
      data: { title: 'Fail', expected_result: 'Fail', test_steps: [{ id: 1, value: 'Step' }], automated: false },
    });
    logStep('PASS: Request completed');

    logStep('INFO: Verify server rejects unauthenticated request with 401');
    expect(response.status()).toBe(401);
    await unauthContext.dispose();
    logStep('PASS: Unauthenticated request rejected with 401');
  });
});
