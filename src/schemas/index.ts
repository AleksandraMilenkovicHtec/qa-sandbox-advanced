import { z } from 'zod';

export const LoginResponseSchema = z.object({
  success: z.boolean(),
  token: z.string(),
  refreshToken: z.string(),
});

export const TestCaseResponseSchema = z.object({
  id: z.number(),
  candidate_id: z.number(),
  title: z.string(),
  expected_result: z.string(),
  description: z.string().nullable(),
  automated: z.boolean(),
  candidate_scenario_id: z.number(),
  test_steps: z.array(z.object({ id: z.number(), testcase_id: z.number(), value: z.string() })),
});
