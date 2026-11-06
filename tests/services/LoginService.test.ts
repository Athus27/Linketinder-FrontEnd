import { afterEach, describe, expect, it, vi } from "vitest";
import { LoginService } from "../../src/services/LoginService";

afterEach(() => { vi.unstubAllGlobals(); vi.unstubAllEnvs(); });

describe("LoginService", () => {
  it("envia credenciais e converte o perfil retornado pela API", async () => {
    vi.stubEnv("VITE_API_URL", "http://localhost:8080");
    const fetchSimulado = vi.fn().mockResolvedValue(new Response(
      JSON.stringify({ token: "opaque-token", id: 7, nome: "Athus", tipo: "candidate" }),
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

  it.each([
    ["token ausente", { id: 7, nome: "Athus", tipo: "candidate" }],
    ["token não textual", { token: 7, id: 7, nome: "Athus", tipo: "candidate" }],
    ["nome vazio", { token: "t", id: 7, nome: " ", tipo: "candidate" }],
    ["nome não textual", { token: "t", id: 7, nome: 7, tipo: "candidate" }],
    ["id zero", { token: "t", id: 0, nome: "Athus", tipo: "candidate" }],
    ["id negativo", { token: "t", id: -1, nome: "Athus", tipo: "candidate" }],
    ["id fracionário", { token: "t", id: 1.5, nome: "Athus", tipo: "candidate" }],
    ["id textual", { token: "t", id: "7", nome: "Athus", tipo: "candidate" }],
    ["id NaN", { token: "t", id: Number.NaN, nome: "Athus", tipo: "candidate" }],
    ["role inválida", { token: "t", id: 7, nome: "Athus", tipo: "admin" }],
    ["empresa sem empresa", { token: "t", id: 7, nome: "Athus", tipo: "company" }],
    ["recrutador com empresa nula", { token: "t", id: 7, nome: "Athus", tipo: "recruiter", idEmpresa: null }],
    ["empresa com empresa textual", { token: "t", id: 7, nome: "Athus", tipo: "company", idEmpresa: "4" }],
    ["empresa com empresa zero", { token: "t", id: 7, nome: "Athus", tipo: "company", idEmpresa: 0 }],
  ])("rejeita contrato inválido: %s", async (_label, payload) => {
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue(new Response(JSON.stringify(payload), { status: 200 })));
    await expect(new LoginService().login("x@example.test", "Senha123")).rejects.toThrow("Resposta de login inválida");
  });

  it("não transforma idEmpresa indevido em companyId de candidato", async () => {
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue(new Response(JSON.stringify({
      token: "t", id: 7, nome: "Athus", tipo: "candidate", idEmpresa: 4,
    }), { status: 200 })));
    await expect(new LoginService().login("x@example.test", "Senha123"))
      .resolves.toEqual({ id: "7", name: "Athus", type: "candidate" });
  });
});
