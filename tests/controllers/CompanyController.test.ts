import { describe, expect, it, vi } from "vitest";
import { CompanyController } from "../../src/controllers/CompanyController";
import { CompanyService } from "../../src/services/CompanyService";

describe("CompanyController", () => {
  it("retorna a lista fornecida pelo service", async () => {
    const service = new CompanyService();
    const lista = [];
    const consulta = vi.spyOn(service, "getEmpresas").mockResolvedValue(lista);
    const resultado = await new CompanyController(service).getEmpresas();
    expect(resultado).toBe(lista);
    expect(consulta).toHaveBeenCalledTimes(1);
  });

  it("propaga o erro do service", async () => {
    const service = new CompanyService();
    const erro = new Error("API indisponível");
    vi.spyOn(service, "getEmpresas").mockRejectedValue(erro);
    await expect(new CompanyController(service).getEmpresas()).rejects.toBe(erro);
  });
});
