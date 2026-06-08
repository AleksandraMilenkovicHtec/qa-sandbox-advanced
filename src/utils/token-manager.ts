import type { APIRequestContext } from '@playwright/test';
import { logStep } from './logger';

interface LoginResponse {
  readonly success: boolean;
  readonly token: string;
  readonly refreshToken: string;
}

export interface StorageState {
  readonly jwtSandboxToken: string;
  readonly jwtSandboxRefreshToken: string;
  readonly email: string;
  readonly remember_me: string;
}

export class TokenManager {
  private token = '';
  private refreshToken = '';
  private email = '';
  private readonly baseUrl: string;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  async authenticate(request: APIRequestContext, email: string, password: string): Promise<string> {
    logStep(`INFO: Send login request for user ${email}`);
    const response = await request.post(`${this.baseUrl}/api/candidate/login`, {
      data: { email, password },
    });

    if (!response.ok()) {
      throw new Error(`Login failed with status ${response.status()}`);
    }

    const data: LoginResponse = await response.json();
    this.token = data.token;
    this.refreshToken = data.refreshToken;
    this.email = email;
    logStep('PASS: Login successful, token stored');
    return this.token;
  }

  getToken(): string {
    if (!this.token) throw new Error('No token. Call authenticate() first.');
    return this.token;
  }

  getAuthHeaders(): Record<string, string> {
    return { Authorization: `Bearer ${this.getToken()}` };
  }

  getStorageState(): StorageState {
    return {
      jwtSandboxToken: this.token,
      jwtSandboxRefreshToken: this.refreshToken,
      email: this.email,
      remember_me: 'true',
    };
  }
}
