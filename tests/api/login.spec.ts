import { test, expect } from '@playwright/test';
import { logStep } from '../../src/utils';
import { BASE_URL, USER_EMAIL, USER_PASSWORD } from '../../src/config/environment';
import { LoginResponseSchema } from '../../src/schemas';

test.describe('Login API', () => {
  test('Login with valid credentials returns success', async ({ request }) => {
    logStep('INFO: Log in user with valid email and password');
    const response = await request.post(`${BASE_URL}/api/candidate/login`, {
      data: { email: USER_EMAIL, password: USER_PASSWORD },
    });
    logStep('PASS: Login request completed');

    logStep('INFO: Verify response returns 200 with a valid token');
    expect(response.status()).toBe(200);
    const body = await response.json();
    expect(LoginResponseSchema.safeParse(body).success).toBe(true);
    expect(body.token).toBeTruthy();
    logStep('PASS: Token received and response schema valid');
  });

  test('Login with invalid credentials returns error', async ({ request }) => {
    logStep('INFO: Attempt login with wrong password');
    const response = await request.post(`${BASE_URL}/api/candidate/login`, {
      data: { email: USER_EMAIL, password: 'WrongPassword123!' },
    });
    logStep('PASS: Login request completed');

    logStep('INFO: Verify response returns 400 with an authorization error');
    expect(response.status()).toBe(400);
    const body = await response.json();
    expect(body.email).toContain('is not authorized or wrong email/password combination');
    logStep('PASS: Authorization error message returned');
  });

  test('Login with missing email returns validation error', async ({ request }) => {
    logStep('INFO: Attempt login with empty email field');
    const response = await request.post(`${BASE_URL}/api/candidate/login`, {
      data: { email: '', password: USER_PASSWORD },
    });
    logStep('PASS: Login request completed');

    logStep('INFO: Verify response returns a validation error for email');
    expect(response.status()).toBeGreaterThanOrEqual(400);
    const body = await response.json();
    expect(body.email).toBeDefined();
    logStep('PASS: Email validation error returned');
  });

  test('Login with missing password returns validation error', async ({ request }) => {
    logStep('INFO: Attempt login with empty password field');
    const response = await request.post(`${BASE_URL}/api/candidate/login`, {
      data: { email: USER_EMAIL, password: '' },
    });
    logStep('PASS: Login request completed');

    logStep('INFO: Verify response returns a validation error for password');
    expect(response.status()).toBeGreaterThanOrEqual(400);
    const body = await response.json();
    expect(body.password ?? body.email).toBeDefined();
    logStep('PASS: Password validation error returned');
  });

  test('Login with invalid email format returns validation error', async ({ request }) => {
    logStep('INFO: Attempt login with malformed email address');
    const response = await request.post(`${BASE_URL}/api/candidate/login`, {
      data: { email: 'not-an-email', password: USER_PASSWORD },
    });
    logStep('PASS: Login request completed');

    logStep('INFO: Verify response returns a validation error for email format');
    expect(response.status()).toBeGreaterThanOrEqual(400);
    const body = await response.json();
    expect(body.email).toBeDefined();
    logStep('PASS: Email format validation error returned');
  });
});
