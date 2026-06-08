# Test Plan – QA Sandbox Application

## 1. Introduction

This test plan defines the testing strategy for the QA Sandbox application, covering the Login and New Test Case features. Testing will be performed by a single QA engineer over a two-day period, combining manual testing with UI and API automation using Playwright and TypeScript.

## 2. Objective

- Verify that Login and New Test Case features meet functional, validation, security, and usability requirements.
- Achieve a minimum pass rate of 90%.(Since this is a sandbox environment that is not being maintained regularly, issues are tolerable)
- Identify defects early through a combination of manual and automated testing.

## 3. Scope

### In Scope

- Login feature: functional flows, input validation, security, and usability.
- New Test Case feature: creation flow, field validation, and usability.
- UI automation (Playwright) for critical user journeys.
- API automation (Playwright APIRequestContext) for backend validation.

### Out of Scope

- Performance and load testing.
- Features not listed in the requirements (e.g., user registration, test case editing/deletion).

## 4. Environment

| Item | Details |
|------|---------|
| Application | QA Sandbox |
| Protocol | HTTPS |
| Browser | Chromium (primary), Firefox, WebKit via Playwright projects |
| OS | macOS |
| Tools | Playwright, TypeScript, Allure Reports |
| Test Data | Generated via basic JS utilities (no external libs) |
| Tester | 1 QA Engineer |
| Duration | 2 days |

## 5. Test Cases

### 5.1 UI Test Cases

#### Login Feature – Functional

| ID | Name | Test Steps | Expected Behavior |
|----|------|-----------|-------------------|
| UI-LF-001 | Login succeeds with valid credentials | 1. Navigate to /login. 2. Enter valid email. 3. Enter valid password. 4. Click Login button. | User is redirected to the dashboard page. |
| UI-LF-002 | Login fails with invalid credentials | 1. Navigate to /login. 2. Enter invalid email/password. 3. Click Login button. | Error message is displayed. User stays on login page. |
| UI-LF-003 | Remember me keeps user logged in | 1. Navigate to /login. 2. Enter valid credentials. 3. Enable Remember me toggle. 4. Click Login. 5. Close and reopen browser. 6. Navigate to app. | User remains logged in without re-entering credentials. |
| UI-LF-004 | Forgot Password link redirects correctly | 1. Navigate to /login. 2. Click Forgot Password link. | User is redirected to the forgot password page. |
| UI-LF-005 | Admin link navigates to admin login page | 1. Navigate to /login. 2. Click Admin link in top menu. | User is navigated to the admin login page. |
| UI-LF-006 | Login link stays on login page | 1. Navigate to /login. 2. Click Login link in top menu. | Page remains on /login or navigates to /login. |
| UI-LF-007 | Empty fields do not trigger backend call | 1. Navigate to /login. 2. Leave email and password empty. 3. Click Login button. | Frontend validation fires. No network request to backend is made. |

#### Login Feature – Validation

| ID | Name | Test Steps | Expected Behavior |
|----|------|-----------|-------------------|
| UI-LV-001 | Invalid email format shows error | 1. Navigate to /login. 2. Enter invalid email format (e.g., "notanemail"). 3. Attempt to submit. | Clear error message about invalid email format is shown. |
| UI-LV-002 | Empty password shows error | 1. Navigate to /login. 2. Enter valid email. 3. Leave password empty. 4. Click Login. | Error message indicating password is required is displayed. |
| UI-LV-003 | Invalid inputs show clear error messages | 1. Navigate to /login. 2. Enter invalid email and empty password. 3. Click Login. | Distinct error messages are displayed for each invalid field. |

#### Login Feature – Security

| ID | Name | Test Steps | Expected Behavior |
|----|------|-----------|-------------------|
| UI-LS-001 | Page loads over HTTPS | 1. Navigate to the login page. 2. Inspect the URL protocol. | URL begins with `https://`. |
| UI-LS-002 | Password field is masked | 1. Navigate to /login. 2. Inspect the password input field type. | Password input has `type="password"` and characters are masked. |

#### Login Feature – Usability

| ID | Name | Test Steps | Expected Behavior |
|----|------|-----------|-------------------|
| UI-LU-001 | Labels and placeholders are correct | 1. Navigate to /login. 2. Inspect email and password fields. | Fields display "Email" and "Password" as labels/placeholders. |
| UI-LU-002 | Remember me toggle is visible and usable | 1. Navigate to /login. 2. Locate Remember me toggle. 3. Toggle on and off. | Toggle is clearly visible, labeled, and responds to interaction. |

#### New Test Case Feature – Functional

| ID | Name | Test Steps | Expected Behavior |
|----|------|-----------|-------------------|
| UI-TC-001 | Create test case with all required fields | 1. Navigate to new test case page. 2. Fill Title, Expected Result, and at least one Test Step. 3. Click Submit. | Test case is saved and appears in the test case list. |
| UI-TC-002 | Create test case with optional description | 1. Navigate to new test case page. 2. Fill all required fields plus Description. 3. Click Submit. | Test case is saved with description included. |
| UI-TC-003 | Add multiple test steps | 1. Navigate to new test case page. 2. Fill required fields. 3. Click Add Test Step multiple times and fill each step. 4. Click Submit. | All test steps are saved in order. |
| UI-TC-004 | Mark test case as Automated | 1. Navigate to new test case page. 2. Fill required fields. 3. Toggle Automated switch on. 4. Click Submit. | Test case is saved with Automated flag enabled. |
| UI-TC-005 | Automated toggle defaults to off | 1. Navigate to new test case page. 2. Inspect Automated toggle. | Toggle is off by default. |
| UI-TC-006 | Back arrow returns to test case list | 1. Navigate to new test case page. 2. Click back arrow. | User is returned to the test case list / previous page. |

#### New Test Case Feature – Validation

| ID | Name | Test Steps | Expected Behavior |
|----|------|-----------|-------------------|
| UI-TV-001 | Submit with empty Title shows error | 1. Navigate to new test case page. 2. Leave Title empty. 3. Fill other required fields. 4. Click Submit. | Error message for Title field is displayed. Form is not submitted. |
| UI-TV-002 | Submit with empty Expected Result shows error | 1. Navigate to new test case page. 2. Fill Title and Test Steps. 3. Leave Expected Result empty. 4. Click Submit. | Error message for Expected Result field is displayed. |
| UI-TV-003 | Submit with no test steps shows error | 1. Navigate to new test case page. 2. Fill Title and Expected Result. 3. Do not add any test step. 4. Click Submit. | Error message indicating at least one test step is required. |
| UI-TV-004 | Multiple test steps are preserved in order | 1. Add 3 test steps in specific order. 2. Submit the form. 3. Open the saved test case. | Steps appear in the same order they were entered. |

#### New Test Case Feature – Usability

| ID | Name | Test Steps | Expected Behavior |
|----|------|-----------|-------------------|
| UI-TU-001 | Enter key does not accidentally submit form | 1. Navigate to new test case page. 2. Fill only Title. 3. Press Enter. | Form is not submitted. No error or submission occurs until all required fields are valid. |
| UI-TU-002 | Fields have correct placeholders | 1. Navigate to new test case page. 2. Inspect all input fields. | Placeholders read "Title", "Description", "Expected Result", "Test step". |

---

### 5.2 API Test Cases

#### Login API

| ID | Name | Test Steps | Expected Behavior |
|----|------|-----------|-------------------|
| API-L-001 | Login with valid credentials returns success | 1. Send POST to login endpoint with valid email and password. | Response status 200. Body contains auth token/session. |
| API-L-002 | Login with invalid credentials returns error | 1. Send POST to login endpoint with wrong password. | Response status 401. Body contains error message. |
| API-L-003 | Login with missing email returns validation error | 1. Send POST to login endpoint with empty email field. | Response status 400/422. Body contains validation error for email. |
| API-L-004 | Login with missing password returns validation error | 1. Send POST to login endpoint with empty password field. | Response status 400/422. Body contains validation error for password. |
| API-L-005 | Login with invalid email format returns validation error | 1. Send POST to login endpoint with malformed email. | Response status 400/422. Body contains email format error. |

#### New Test Case API

| ID | Name | Test Steps | Expected Behavior |
|----|------|-----------|-------------------|
| API-TC-001 | Create test case with valid data | 1. Authenticate. 2. Send POST to create test case endpoint with Title, Expected Result, and Test Steps. | Response status 201. Body contains created test case with all fields. |
| API-TC-002 | Create test case without Title returns error | 1. Authenticate. 2. Send POST without Title field. | Response status 400/422. Validation error for Title. |
| API-TC-003 | Create test case without Expected Result returns error | 1. Authenticate. 2. Send POST without Expected Result. | Response status 400/422. Validation error for Expected Result. |
| API-TC-004 | Create test case without Test Steps returns error | 1. Authenticate. 2. Send POST with empty test steps array. | Response status 400/422. Validation error for Test Steps. |
| API-TC-005 | Create test case with Automated flag | 1. Authenticate. 2. Send POST with all required fields and `automated: true`. | Response status 201. Body reflects `automated: true`. |
| API-TC-006 | Create test case without auth returns unauthorized | 1. Send POST to create test case endpoint without auth token. | Response status 401. Unauthorized error message. |

---

## 6. Deliverables

- Test plan document.
- Automated UI test scripts (Playwright + TypeScript) in `tests/ui/`.
- Automated API test scripts (Playwright + TypeScript) in `tests/api/`.
- Allure HTML test report in `reports/allure-report/`.
- Defect reports for any issues found during manual or automated testing.

## 7. Risks

| Risk | Impact | Mitigation |
|------|--------|------------|
| Single tester bottleneck | Delays if tester is unavailable | Prioritize critical test cases; automate repeatable scenarios first. |
| Environment instability | Blocked testing | Confirm environment availability before test execution; use retries in automation. |
| Incomplete requirements | Missing coverage | Clarify ambiguous requirements before test execution begins. |
| Tight 2-day schedule | Insufficient coverage | Focus on high-priority functional tests first; defer low-risk usability tests if needed. |
| Flaky automated tests | False failures affecting pass rate | Use stable locators, proper waits, and test isolation. |

## 8. Pass/Fail Criteria

- Minimum pass rate: **90%** of all executed test cases must pass.
- All Critical and High severity defects must be resolved or documented with a workaround.
- No blockers remaining in Login or New Test Case features.

## 9. Approval

| Role | Name | Signature | Date |
|------|------|-----------|------|
| QA Engineer | Aleksandra Milenkovic | | |
| Project Manager | | | |
| Product Owner | | | |
