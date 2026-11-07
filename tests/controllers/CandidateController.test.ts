import { describe, it, expect, vi } from "vitest";
import { CandidateController } from "../../src/controllers/CandidateController";
import { CandidateService } from "../../src/services/CandidateService";

describe("CandidateController", () => {
  it("retorna a lista recebida do service", async () => {
    // given
    const service = new CandidateService();
    const consulta = vi.spyOn(service, "getCandidatos")
      .mockResolvedValue([]);
    const controller = new CandidateController(service);

    // when
    const resultado = await controller.getCandidatos();

    // then
    expect(resultado).toEqual([]);
    expect(consulta).toHaveBeenCalledTimes(1);
  });
});