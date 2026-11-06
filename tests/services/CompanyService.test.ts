import { afterEach, describe, expect, it, vi } from "vitest";
import { CompanyService } from "../../src/services/CompanyService";
import { Company } from "../../src/models/Company";

afterEach(() => { vi.unstubAllGlobals(); vi.unstubAllEnvs(); });

describe("CompanyService", () => {
  it("converte a resposta da API preservando os IDs", async () => {
    vi.stubEnv("VITE_API_URL", "http://localhost:8080");
    const fetchSimulado = vi.fn().mockResolvedValue(new Response(JSON.stringify([{ id: 7, nome: "Empresa teste", cnpj: "123", descricao: "Descrição", email: "teste@example.com", pais: "Brasil", cep: "12345" }]), { status: 200 }));
    vi.stubGlobal("fetch", fetchSimulado);
    const service = new CompanyService();

    const resultado = await service.getEmpresas();

    expect(fetchSimulado).toHaveBeenCalledExactlyOnceWith("http://localhost:8080/api/empresas");
    expect(resultado).toHaveLength(1);
    expect(resultado[0]).toBeInstanceOf(Company);
    expect(resultado[0]).toMatchObject({ id: "7", name: "Empresa teste", cnpj: "123", description: "Descrição", email: "teste@example.com", country: "Brasil", state: "", cepCode: "12345" });
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
});
