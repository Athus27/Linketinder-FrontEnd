import { afterEach, describe, expect, it, vi } from "vitest";
import { CompanyService } from "../../src/services/CompanyService";
import { Company } from "../../src/models/Company";

afterEach(() => { vi.unstubAllGlobals(); vi.unstubAllEnvs(); });

describe("CompanyService", () => {
  it("converte a resposta da API preservando os IDs", async () => {
    vi.stubEnv("VITE_API_URL", "http://localhost:8080");
    const fetchSimulado = vi.fn().mockResolvedValue(new Response(JSON.stringify([{ id: 7 }]), { status: 200 }));
    vi.stubGlobal("fetch", fetchSimulado);
    const service = new CompanyService();

    const resultado = await service.getEmpresas();

    expect(fetchSimulado).toHaveBeenCalledExactlyOnceWith("http://localhost:8080/api/empresas");
    expect(resultado).toHaveLength(1);
    expect(resultado[0]).toBeInstanceOf(Company);
    expect(resultado[0]).toMatchObject({ id: "7", name: "Empresa #7", cnpj: "", description: "", email: "" });
  });

  it("retorna lista vazia quando a API retorna array vazio", async () => {
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue(new Response("[]", { status: 200 })));
    expect(await new CompanyService().getEmpresas()).toEqual([]);
  });

  it("propaga falha HTTP", async () => {
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue(new Response(null, { status: 500 })));
    await expect(new CompanyService().getEmpresas()).rejects.toThrow("HTTP 500");
  });

  it("propaga falha de conexão", async () => {
    const erro = new TypeError("Falha de conexão");
    vi.stubGlobal("fetch", vi.fn().mockRejectedValue(erro));
    await expect(new CompanyService().getEmpresas()).rejects.toBe(erro);
  });

  it("envia o cadastro da empresa para a API, incluindo a senha", async () => {
    vi.stubEnv("VITE_API_URL", "http://localhost:8080");
    const fetchSimulado = vi.fn().mockResolvedValue(new Response(null, { status: 201 }));
    vi.stubGlobal("fetch", fetchSimulado);
    const service = new CompanyService();

    const cadastrada = await service.cadastrarEmpresa({
      name: "Tapetes Bolinho",
      cnpj: "12.345.678/0001-00",
      description: "Tapetes personalizados",
      email: "contato@example.com",
      password: "senha123",
      state: "SP",
      cepCode: "01020-000",
      country: "Brasil",
    });

    expect(cadastrada).toBe(true);
    expect(fetchSimulado).toHaveBeenCalledExactlyOnceWith(
      "http://localhost:8080/api/empresas",
      expect.objectContaining({
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nome: "Tapetes Bolinho",
          cnpj: "12.345.678/0001-00",
          descricao: "Tapetes personalizados",
          email: "contato@example.com",
          senha: "senha123",
          pais: "Brasil",
          cep: "01020-000",
        }),
      }),
    );
  });

  it("retorna false se a API rejeitar o cadastro da empresa", async () => {
    vi.stubEnv("VITE_API_URL", "http://localhost:8080");
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue(new Response(null, { status: 409 })));

    await expect(new CompanyService().cadastrarEmpresa({} as never)).rejects.toMatchObject({ status: 409 });
  });
});
