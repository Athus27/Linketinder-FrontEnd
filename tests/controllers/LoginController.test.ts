import { describe, expect, it, vi } from "vitest";
import { LoginController } from "../../src/controllers/LoginController";
import { LoginService } from "../../src/services/LoginService";

describe("LoginController", () => {
  it("encaminha as credenciais e retorna o usuário autenticado", async () => {
    const service = new LoginService();
    const usuario = { id: "7", name: "Athus", type: "candidate" as const };
    const login = vi.spyOn(service, "login").mockResolvedValue(usuario);
    const controller = new LoginController(service);

    await expect(controller.login("athus@example.com", "senha123")).resolves.toBe(usuario);
    expect(login).toHaveBeenCalledExactlyOnceWith("athus@example.com", "senha123");
  });
});
