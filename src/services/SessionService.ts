import type { SessionState } from "../types/SessionState";
import type { AuthenticatedUser } from "../types/UserType";

export class ApiError extends Error {
  constructor(
    public readonly status: number,
    message: string,
    public readonly code = "HTTP_ERROR",
  ) {
    super(message);
    this.name = "ApiError";
  }
}

export class SessionService {
  private state: SessionState = { token: null, user: null };
  private unauthorizedCallback: (() => void) | undefined;

  getState(): SessionState {
    return { ...this.state };
  }

  getToken(): string | null {
    return this.state.token;
  }

  getUser(): AuthenticatedUser | null {
    return this.state.user;
  }

  setUnauthorizedCallback(callback: (() => void) | undefined): void {
    this.unauthorizedCallback = callback;
  }

  establish(token: string, user: AuthenticatedUser): void {
    if (!token.trim()) throw new Error("Token de sessão inválido");
    this.state = { token, user };
  }

  clear(): void {
    this.state = { token: null, user: null };
  }

  async request<T>(url: string, init: RequestInit = {}, expectedStatus?: number): Promise<T> {
    const response = await this.requestResponse(url, init);
    if (expectedStatus !== undefined && response.status !== expectedStatus) {
      throw new ApiError(response.status, `HTTP ${response.status}`);
    }
    if (response.status === 204) return undefined as T;
    return await response.json() as T;
  }

  async requestResponse(url: string, init: RequestInit = {}): Promise<Response> {
    const requestToken = this.state.token;
    const requestInit: RequestInit = { ...init };
    if (this.state.token) {
      const headers = new Headers(init.headers);
      headers.set("Authorization", `Bearer ${this.state.token}`);
      requestInit.headers = headers;
    }
    const response = requestToken || Object.keys(init).length > 0
      ? await fetch(url, requestInit)
      : await fetch(url);
    if (response.status === 401 && this.state.token === requestToken) {
      this.clear();
      this.unauthorizedCallback?.();
    }
    if (!response.ok) throw await this.toApiError(response);
    return response;
  }

  async logout(baseUrl: string): Promise<void> {
    const token = this.state.token;
    try {
      if (token) {
        const response = await fetch(`${baseUrl}/api/auth/logout`, {
          method: "POST",
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!response.ok && response.status !== 401) {
          throw await this.toApiError(response);
        }
      }
    } finally {
      this.clear();
    }
  }

  private async toApiError(response: Response): Promise<ApiError> {
    let message = `HTTP ${response.status}`;
    let code = "HTTP_ERROR";
    try {
      const body = await response.json() as { erro?: string; codigo?: string };
      if (body.erro) message = body.erro;
      if (body.codigo) code = body.codigo;
    } catch {
      // Responses without the public error DTO still expose their status.
    }
    return new ApiError(response.status, message, code);
  }
}

export const sharedSessionService = new SessionService();
