# Prompts Used During Framework Development

## Test Generation

**1.**
Following the rules.md file create a playwright framework with UI and API tests written in typescript.
Keep the structure clean.
Follow the rules file and best coding practices of both playwright and typescript.
Using playwright mcp server create tests following the test cases in test plan, but utilize logger such as PIno to log in accordance with best practices.
For api tests, in before all, log in, save bearer token and use it for logging in the rest of the cases so you don't have to log in for each tests separately.
Also, for UI tests that include test cases, log in via api in before all and then just work on the page.

---

**2.**
Use credentials in the env. file for logging in

---

**3.**
UI tests are failing because authentication via api in before method is not working, the problem is that local storage demands
email
jwtSandboxRefreshToken
jwtSandboxToken
remember_me
so we need to extract all those from response and feed into local storage

---

**4.**
From tests results observe error context of failed tests and fix them

---

**5.**
Include method that deletes created data after tests are done in both ui and api tests, save endpoint paths as constants in a separate page and call them and improve setup to support possible multiple environments

---

**6.**
Centralize authentication: Save the authenticated storageState to a file (auth.json) once and reuse it across all suites instead of repeating loginViaApi in every beforeEach.

Use fixtures for page objects: Convert page objects like NewTestCasePage into fixtures so they're automatically available in tests.

Parallelize cleanup: In teardown functions like deleteAllTestCases, delete test cases in parallel using Promise.all instead of sequentially. And don't use api to fetch all test cases, instead when creating test case via ui, capture the response api returns and extract test case id, then delete only the test cases with those ids.

Consistent logging: Wrap log calls in helper functions (logStep, logSuccess)
Use test.step: Break down flows into named steps for better trace readability in Playwright reports.


---

**7.**
Use recordHar in beforeAll to capture a suite-level HAR (suite.har) covering all tests.
After closing each context, call a utility function analyzeHar(path: string) that parses the HAR JSON and flags anomalies:
- Requests longer than 2000ms
- Payloads larger than 1MB
- Error status codes (>=400)
Keep analyzeHar in a separate har-utils.ts file for reuse.
Inline assertions for critical endpoints (login, test case creation) should enforce performance budgets directly in the test.
Follow best practices: modular utilities, separation of functional vs performance checks, and CI/CD integration readiness.

---

**8.**
Put har files in reports/har folder, remove inline performance budget checks and include the logic in CI/CD flow.
HAR files can vary depending on the browser/tool. Instead of assuming entry.response.content.size always exists, validate or default to 0 if missing.

---

**9.**
Follow the directions in rules.md file and improve code readability.
Separate test groups into individual files.
Remove comments everywhere.
Improve code alignment and spacing in accordance with the coding standards.
Improve logging by logging when the steps start and finish like this:

```
logStep("INFO: Create user");
RegisterResponse userActual = AdminUsersAPI.createUser(accessToken, request);
logStep("PASS: User is created " + userActual.getResult().getIdentityId());
```

Remove all unnecessary files and methods, simplify logic where possible.
Remove separate endpoints files, use endpoint path directly.

---

**10.**
Refactor cleanup for UI tests so that instead of api, the test after finishes clicks delete on the test case that was created and then removes it. Through UI.

---

**11.**
Improve log step descriptions to be descriptive of the action, for example instead of:
`logStep('INFO: Send POST /api/candidate/login with empty email')`
write:
`Send request to login user with empty email`

---

**12.**
Improve the script so CI/CD flow generates allure reports file from results after completion.

---

**13.**
Write detailed readme file with instructions on what is needed to run this project and how to run tests.

---

**14.**
Deploy report to GitHub Actions, also add parallel execution.

---

**15.**
There are two more requirements we need to cover:
- The report contains a video recording of test execution.
- Create a pipeline YAML file for nightly build/execution of test suite.

---

**16.**
Video should be published after the first run regardless of results.
