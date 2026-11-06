import { LoginService } from "../services/LoginService";
import type { AuthenticatedUser } from "../types/UserType";

export class LoginController {
  constructor(private readonly loginService: LoginService) {}

  async login(email: string, senha: string): Promise<AuthenticatedUser | null> {
    return this.loginService.login(email, senha);
  }
}
