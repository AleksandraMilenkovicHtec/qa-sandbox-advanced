import type { APIRequestContext, APIResponse } from '@playwright/test';
import type { TokenManager } from './token-manager';

interface RequestOptions {
  readonly data?: unknown;
  readonly headers?: Record<string, string>;
}

export class ApiClient {
  constructor(
    private readonly request: APIRequestContext,
    private readonly baseUrl: string,
    private readonly tokenManager: TokenManager
  ) {}

  async get(path: string, options?: RequestOptions): Promise<APIResponse> {
    return this.request.get(`${this.baseUrl}${path}`, {
      headers: { ...this.tokenManager.getAuthHeaders(), ...options?.headers },
    });
  }

  async post(path: string, options?: RequestOptions): Promise<APIResponse> {
    return this.request.post(`${this.baseUrl}${path}`, {
      data: options?.data,
      headers: { ...this.tokenManager.getAuthHeaders(), ...options?.headers },
    });
  }

  async delete(path: string): Promise<APIResponse> {
    return this.request.delete(`${this.baseUrl}${path}`, {
      headers: this.tokenManager.getAuthHeaders(),
    });
  }
}
