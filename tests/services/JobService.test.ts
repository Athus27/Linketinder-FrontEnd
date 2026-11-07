import { afterEach, describe, expect, it, vi } from "vitest";
import { JobService } from "../../src/services/JobService";
import { Job } from "../../src/models/Job";

afterEach(() => { vi.unstubAllGlobals(); vi.unstubAllEnvs(); });

describe("JobService", () => {
  it("converte a resposta da API preservando os IDs", async () => {
    vi.stubEnv("VITE_API_URL", "http://localhost:8080");
    const fetchSimulado = vi.fn().mockResolvedValue(new Response(JSON.stringify([{ id: 9, idEmpresa: 7, titulo: "Dev", descricao: "Descrição", competencias: ["Groovy"] }]), { status: 200 }));
    vi.stubGlobal("fetch", fetchSimulado);
    const service = new JobService();

    const resultado = await service.getVagas();

    expect(fetchSimulado).toHaveBeenCalledExactlyOnceWith("http://localhost:8080/api/vagas");
    expect(resultado).toHaveLength(1);
    expect(resultado[0]).toBeInstanceOf(Job);
    expect(resultado[0]).toMatchObject({ id: "9", companyId: "7", title: "Dev", description: "Descrição", skills: ["Groovy"] });
  });

  it("retorna lista vazia quando a API retorna array vazio", async () => {
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue(new Response("[]", { status: 200 })));
    expect(await new JobService().getVagas()).toEqual([]);
  });

  it("propaga falha HTTP", async () => {
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue(new Response(null, { status: 500 })));
    await expect(new JobService().getVagas()).rejects.toThrow("HTTP 500");
  });

  it("propaga falha de conexão", async () => {
    const erro = new TypeError("Falha de conexão");
    vi.stubGlobal("fetch", vi.fn().mockRejectedValue(erro));
    await expect(new JobService().getVagas()).rejects.toBe(erro);
  });
});
