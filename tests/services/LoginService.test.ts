import { afterEach, describe, expect, it, vi } from "vitest";
import { LoginService } from "../../src/services/LoginService";

afterEach(() => { vi.unstubAllGlobals(); vi.unstubAllEnvs(); });

describe("LoginService", () => {
  it("envia credenciais e converte o perfil retornado pela API", async () => {
    vi.stubEnv("VITE_API_URL", "http://localhost:8080");
    const fetchSimulado = vi.fn().mockResolvedValue(new Response(
      JSON.stringify({ id: 7, nome: "Athus", tipo: "candidate" }),
      { status: 200 },
    ));
    vi.stubGlobal("fetch", fetchSimulado);

    const usuario = await new LoginService().login("athus@example.com", "senha123");

    expect(fetchSimulado).toHaveBeenCalledExactlyOnceWith(
      "http://localhost:8080/api/auth/login",
      expect.objectContaining({
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: "athus@example.com", senha: "senha123" }),
      }),
    );
    expect(usuario).toEqual({ id: "7", name: "Athus", type: "candidate" });
  });

  it("retorna null para credenciais recusadas", async () => {
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue(new Response(null, { status: 401 })));
    await expect(new LoginService().login("wrong@example.com", "senha")).resolves.toBeNull();
  });

  it("propaga falhas HTTP diferentes de credenciais inválidas", async () => {
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue(new Response(null, { status: 500 })));
    await expect(new LoginService().login("athus@example.com", "senha")).rejects.toThrow("HTTP 500");
  });
});
