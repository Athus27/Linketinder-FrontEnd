import type { AuthenticatedUser, UserType } from "../types/UserType";
import type { LoginResponse } from "../types/LoginResponse";

export class LoginService {
  private readonly url = `${import.meta.env.VITE_API_URL}/api/auth/login`;

  async login(email: string, senha: string): Promise<AuthenticatedUser | null> {
    const response = await fetch(this.url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, senha }),
    });

    if (response.status === 401) return null;
    if (!response.ok) throw new Error(`Erro ao entrar: HTTP ${response.status}`);

    const dados = await response.json() as LoginResponse;
    const tipo = dados.tipo as UserType;
    if (!dados.id || !dados.nome || !["candidate", "company"].includes(tipo)) {
      throw new Error("Resposta de login inválida");
    }

    return { id: String(dados.id), name: dados.nome, type: tipo };
  }
}
