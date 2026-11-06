import {afterEach, describe, expect, it, vi} from "vitest";
import {CandidateService} from "../../src/services/CandidateService";

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
    fetchSimulado.mockResolvedValue(new Response(null, {status: 201}));
    vi.stubGlobal("fetch", fetchSimulado);

    //when
    const result = await candidateService.cadastrarCandidato(candidato);

    //then
    expect(result).toBe(true);
    expect(fetchSimulado).toHaveBeenCalledWith(
      candidateService.url,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(candidato),
      },
    );
  });

  it("retorna false quando a API responde com erro", async () => {
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
    fetchSimulado.mockResolvedValue(new Response(null, {status: 400}));
    vi.stubGlobal("fetch", fetchSimulado);

    //when
    const result = await candidateService.cadastrarCandidato(candidato);

    //then
    expect(result).toBe(false);
  });

  it("retorna lista de candidatos", async () => {
    //given
    const candidateService = new CandidateService();
    const candidatos = [
      {
        name: "John Doe",
        cpf: "12345678901",
      },
    ];
    const fetchSimulado = vi.fn();
    fetchSimulado.mockResolvedValue(
      new Response(JSON.stringify(candidatos), {
        status: 200,
        headers: {
          "Content-Type": "application/json",
        },
      }),
    );
    vi.stubGlobal("fetch", fetchSimulado);

    //when
    const result = await candidateService.getCandidatos();
    console.log(result);
    //then
    expect(result).toEqual(candidatos);
    expect(fetchSimulado).toHaveBeenCalledWith(
      candidateService.url,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      },
    );
  });
});
