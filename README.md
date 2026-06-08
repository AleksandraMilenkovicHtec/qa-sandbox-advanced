# QA Sandbox Advanced — Playwright Automation Framework

End-to-end and API test automation framework for the [QA Sandbox](https://qa-sandbox.ni.htec.rs) application, built with Playwright and TypeScript.

---

## Table of Contents

- [Prerequisites](#prerequisites)
- [Project Structure](#project-structure)
- [Setup](#setup)
- [Environment Configuration](#environment-configuration)
- [Running Tests](#running-tests)
- [Reports](#reports)
- [HAR Performance Analysis](#har-performance-analysis)
- [CI/CD](#cicd)

---

## Prerequisites

Before running the project, ensure the following are installed on your machine:

| Tool | Version | Notes |
|------|---------|-------|
| [Node.js](https://nodejs.org) | 18 LTS or higher | Required to run the framework |
| [npm](https://www.npmjs.com) | Included with Node.js | Used for dependency management |
| [Java](https://adoptium.net) | 11 or higher | Required by the Allure CLI to generate HTML reports |
| [Allure CLI](https://allurereport.org/docs/install) | Latest | Required locally to open and generate reports |

### Install Allure CLI

```bash
npm install -g allure-commandline
```

> Verify the installation with `allure --version`.

---

## Project Structure

```
qa-sandbox-advanced/
├── .github/workflows/        # GitHub Actions CI/CD pipeline
├── docs/                     # Test plan and project guidelines
├── reports/
│   ├── allure-results/       # Raw Allure test results (generated at runtime)
│   ├── allure-report/        # Generated Allure HTML report
│   └── har/                  # HAR files captured during UI test runs
├── scripts/
│   └── analyze-har.ts        # CI performance analysis script
├── src/
│   ├── config/
│   │   └── environment.ts    # Environment variable loader
│   ├── pages/                # Page Object Models (POM)
│   │   ├── login-page.ts
│   │   ├── new-test-case-page.ts
│   │   └── test-cases-list-page.ts
│   ├── schemas/              # Zod response validation schemas
│   └── utils/
│       ├── api-client.ts     # Authenticated API request wrapper
│       ├── har-utils.ts      # HAR file analysis utilities
│       ├── logger.ts         # Pino logger with logStep helper
│       ├── test-data.ts      # Random test data generators
│       └── token-manager.ts  # API authentication and token storage
├── tests/
│   ├── api/                  # API test suites
│   │   ├── login.spec.ts
│   │   └── test-cases.spec.ts
│   ├── setup/
│   │   └── auth.setup.ts     # Authentication setup (runs before UI tests)
│   ├── ui/
│   │   ├── login/            # Login UI tests (functional, validation, security, usability)
│   │   └── test-case/        # Test Case UI tests (functional, validation, usability)
│   └── fixtures.ts           # Custom Playwright fixtures (page objects)
├── .env                      # Local environment variables (not committed)
├── .env.example              # Environment variable template
├── playwright.config.ts      # Playwright configuration
└── tsconfig.json             # TypeScript configuration
```

---

## Setup

### 1. Clone the repository

```bash
git clone https://github.com/AleksandraMilenkovicHtec/qa-sandbox-advanced.git
cd qa-sandbox-advanced
```

### 2. Install dependencies

```bash
npm install
```

### 3. Install Playwright browsers

```bash
npx playwright install --with-deps
```

### 4. Configure environment variables

Copy the example file and fill in the values:

```bash
cp .env.example .env
```

Open `.env` and set:

```env
BASE_URL=https://qa-sandbox.ni.htec.rs
USER_EMAIL=<your-email>
USER_PASSWORD=<your-password>
```

> The `.env` file is git-ignored and must never be committed.

---

## Environment Configuration

The framework supports multiple environments controlled by the `TEST_ENV` variable:

| `TEST_ENV` value | File loaded |
|-----------------|------------|
| `staging` (default) | `.env` |
| `dev` | `.env.dev` |
| `production` | `.env.production` |

Each environment file must contain `BASE_URL`, `USER_EMAIL`, and `USER_PASSWORD`.

---

## Running Tests

### Run all tests (all browsers + API)

```bash
npm test
```

### Run UI tests on Chromium only

```bash
npm run test:ui
```

### Run API tests only

```bash
npm run test:api
```

### Run tests against a specific environment

```bash
npm run test:staging      # default
npm run test:dev
npm run test:production
```

### Run a specific test file

```bash
npx playwright test tests/ui/login/functional.spec.ts
```

### Run tests matching a name pattern

```bash
npx playwright test --grep "Login succeeds"
```

### Run tests in headed mode (visible browser)

```bash
npx playwright test --headed
```

### Run tests in UI mode (interactive Playwright UI)

```bash
npx playwright test --ui
```

### Run tests on a specific browser

```bash
npx playwright test --project=ui-chromium
npx playwright test --project=ui-firefox
npx playwright test --project=ui-webkit
npx playwright test --project=api
```

---

## Reports

### Allure HTML Report

After running tests, raw results are written to `reports/allure-results/`. To generate and open the HTML report:

```bash
# Generate the HTML report from raw results
npm run allure:generate

# Open the report in your browser
npm run allure:open
```

> Java 11+ must be installed for the Allure CLI to work.

The generated report is saved to `reports/allure-report/`.

### Playwright Built-in Report

Playwright also generates a basic HTML report. To view it after a run:

```bash
npx playwright show-report
```

---

## HAR Performance Analysis

UI test suites record API traffic to HAR files in `reports/har/` during execution. After tests complete, run the analysis script to flag performance anomalies:

```bash
npm run analyze:har
```

The script checks each HAR file for:

- Requests exceeding **2000ms**
- Response payloads exceeding **1MB**
- HTTP error responses (**status >= 400**)

It exits with code `1` if any anomalies are found, which fails the CI pipeline step.

---

## CI/CD

Tests run automatically on every push and pull request to `main` and `master` via GitHub Actions.

The pipeline:

1. Installs Node.js dependencies and Playwright browsers
2. Runs the full test suite
3. Runs the HAR performance analysis
4. Generates the Allure HTML report
5. Uploads the following artifacts (retained for 30 days):
   - `allure-report` — full HTML report, downloadable and openable directly
   - `test-artifacts` — raw Allure results and HAR files for debugging

### Required GitHub Secrets

Set the following secrets in your repository under **Settings → Secrets and variables → Actions**:

| Secret | Description |
|--------|-------------|
| `BASE_URL` | Application base URL |
| `USER_EMAIL` | Test user email |
| `USER_PASSWORD` | Test user password |
