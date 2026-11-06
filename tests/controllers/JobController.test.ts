import { describe, expect, it, vi } from "vitest";
import { JobController } from "../../src/controllers/JobController";
import { JobService } from "../../src/services/JobService";

describe("JobController", () => {
  it("retorna a lista fornecida pelo service", async () => {
    const service = new JobService();
    const lista = [];
    const consulta = vi.spyOn(service, "getVagas").mockResolvedValue(lista);
    const resultado = await new JobController(service).getVagas();
    expect(resultado).toBe(lista);
    expect(consulta).toHaveBeenCalledTimes(1);
  });

  it("propaga o erro do service", async () => {
    const service = new JobService();
    const erro = new Error("API indisponível");
    vi.spyOn(service, "getVagas").mockRejectedValue(erro);
    await expect(new JobController(service).getVagas()).rejects.toBe(erro);
  });
});
