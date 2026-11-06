import { describe, it, expect, vi, afterEach } from "vitest";
import { CandidateService } from "../../src/services/CandidateService";
afterEach(() => {
  vi.unstubAllGlobals();
});

describe("CandidateService", () => {
  it("retorna true quando a API responde com status 201", async () => {
    //given
    const candidateService = new CandidateService();
    const candidato = {
      name: "John Doe",
      cpf: "12345678901",
      birthDate: "1990-01-01",
      description: "Descrição do candidato",
      email: "teste@emial.com",
      state: "SP",
      cepCode: "12345678",
      skills: ["JavaScript", "TypeScript"],
    };
    const fetchSimulado = vi.fn();
    fetchSimulado.mockResolvedValue(new Response(null, { status: 201 }));
    vi.stubGlobal("fetch", fetchSimulado);

    //when
    const result = await candidateService.cadastrarCandidato(candidato);

    //then
    expect(result).toBe(true);

  })
})
