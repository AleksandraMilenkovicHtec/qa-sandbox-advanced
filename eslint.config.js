import tseslint from '@typescript-eslint/eslint-plugin';
import tsparser from '@typescript-eslint/parser';
import playwright from 'eslint-plugin-playwright';

export default [
  {
    ignores: ['node_modules/', 'dist/', 'reports/', 'playwright/.auth/'],
  },
  {
    files: ['src/**/*.ts', 'tests/**/*.ts', 'scripts/**/*.ts'],
    languageOptions: {
      parser: tsparser,
      parserOptions: {
        project: './tsconfig.json',
        tsconfigRootDir: import.meta.dirname,
      },
    },
    plugins: {
      '@typescript-eslint': tseslint,
      playwright,
    },
    rules: {
      '@typescript-eslint/no-explicit-any': 'error',
      '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
      '@typescript-eslint/consistent-type-imports': ['error', { prefer: 'type-imports' }],
      '@typescript-eslint/no-non-null-assertion': 'warn',
      '@typescript-eslint/explicit-function-return-type': 'off',

      'playwright/no-wait-for-timeout': 'error',
      'playwright/no-force-option': 'warn',
      'playwright/no-skipped-test': 'warn',
      'playwright/valid-expect': 'error',
      'playwright/missing-playwright-await': 'error',
      'playwright/no-conditional-in-test': 'warn',

      'no-console': 'error',
      'prefer-const': 'error',
      'no-var': 'error',
    },
  },
];
