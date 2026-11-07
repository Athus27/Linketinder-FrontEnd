import type { AuthenticatedUser, UserType } from "../types/UserType";
import type { LoginResponse } from "../types/LoginResponse";
import { sharedSessionService, SessionService, ApiError } from "./SessionService";

export class LoginService {
  private readonly url = `${import.meta.env.VITE_API_URL}/api/auth/login`;

  constructor(private readonly session: SessionService = sharedSessionService) {}

  async login(email: string, senha: string): Promise<AuthenticatedUser | null> {
    const response = await fetch(this.url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, senha }),
    });
    if (response.status === 401) {
      this.session.clear();
      return null;
    }
    if (!response.ok) throw new ApiError(response.status, `Erro ao entrar: HTTP ${response.status}`);

    const dados = await response.json() as LoginResponse | null;
    if (!dados || typeof dados !== "object") throw new Error("Resposta de login inválida");
    const tipo = dados.tipo;
    const validType = ["candidate", "company", "recruiter"].includes(tipo);
    const validId = typeof dados.id === "number" && Number.isSafeInteger(dados.id) && dados.id > 0;
    const validToken = typeof dados.token === "string" && dados.token.trim().length > 0;
    const validName = typeof dados.nome === "string" && dados.nome.trim().length > 0;
    const validCompanyId = typeof dados.idEmpresa === "number" &&
      Number.isSafeInteger(dados.idEmpresa) && dados.idEmpresa > 0;
    const requiresCompany = tipo === "company" || tipo === "recruiter";
    if (!validToken || !validId || !validName || !validType ||
      (requiresCompany && !validCompanyId)) {
      throw new Error("Resposta de login inválida");
    }
    const user: AuthenticatedUser = {
      id: String(dados.id),
      name: dados.nome,
      type: tipo,
      ...(requiresCompany ? { companyId: String(dados.idEmpresa) } : {}),
    };
    this.session.establish(dados.token, user);
    return user;
  }
}
