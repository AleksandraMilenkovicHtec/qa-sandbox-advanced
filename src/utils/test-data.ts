export const randomString = (length = 8): string =>
  Math.random().toString(36).substring(2, 2 + length);

export const randomTestCaseTitle = (): string => `TC-${randomString(6)}`;
