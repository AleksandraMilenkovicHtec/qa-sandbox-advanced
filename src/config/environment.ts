import dotenv from 'dotenv';
import path from 'path';

type Environment = 'dev' | 'staging' | 'production';

const ENV = (process.env.TEST_ENV as Environment) ?? 'staging';
const envFile = ENV === 'staging' ? '.env' : `.env.${ENV}`;
dotenv.config({ path: path.resolve(process.cwd(), envFile) });

export const BASE_URL = process.env.BASE_URL!;
export const USER_EMAIL = process.env.USER_EMAIL!;
export const USER_PASSWORD = process.env.USER_PASSWORD!;
