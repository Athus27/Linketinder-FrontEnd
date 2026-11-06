import {afterEach, describe, expect, it, vi} from "vitest";
import { Candidate } from "../../src/models/Candidate";
import type { CandidateResponse } from "../../src/types/CandidateResponse";
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
      surname: "Silva",
      country: "Brasil",
      password: "123456",
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
        body: JSON.stringify({
          nome: candidato.name,
          sobrenome: candidato.surname,
          dataNascimento: "01/01/1990",
          cpf: candidato.cpf,
          descricao: candidato.description,
          email: candidato.email,
          pais: candidato.country,
          cep: candidato.cepCode,
          senha: candidato.password,
          competencias: candidato.skills,
        }),
      },
    );
  });

  it("retorna false quando a API responde com erro", async () => {
    //given
    const candidateService = new CandidateService();
    const candidato = {
      name: "John Doe",
      surname: "Silva",
      country: "Brasil",
      password: "123456",
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

  it("converte a lista da API em instâncias de Candidate preservando os dados e o ID", async () => {
    // given
    const candidateService = new CandidateService();
    const candidatos: CandidateResponse[] = [{
      id: 42,
      nome: "John Doe",
      cpf: "12345678901",
      dataNascimento: "1990-01-01",
      descricao: "Descrição do candidato",
      email: "teste@email.com",
      cep: "12345678",
      competencias: ["Groovy", "TypeScript"],
    }];
    const fetchSimulado = vi.fn().mockResolvedValue(
      new Response(JSON.stringify(candidatos), { status: 200 })
    );
    vi.stubGlobal("fetch", fetchSimulado);

    // when
    const result = await candidateService.getCandidatos();

    // then
    expect(result).toHaveLength(1);
    expect(result[0]).toBeInstanceOf(Candidate);
    expect(result[0]).toMatchObject({
      id: "42",
      name: "John Doe",
      cpf: "12345678901",
      birthDate: "1990-01-01",
      description: "Descrição do candidato",
      email: "teste@email.com",
      state: "",
      cepCode: "12345678",
      skills: ["Groovy", "TypeScript"],
    });
    expect(result[0].getSkills()).toEqual(["Groovy", "TypeScript"]);
    expect(fetchSimulado).toHaveBeenCalledExactlyOnceWith(candidateService.url);
  });

  it("retorna lista vazia quando a API não possui candidatos", async () => {
    // given
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue(new Response("[]", { status: 200 })));
    const service = new CandidateService();

    // when
    const result = await service.getCandidatos();

    // then
    expect(result).toEqual([]);
  });

  it("rejeita a consulta quando a API responde com erro HTTP", async () => {
    // given
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue(
      new Response('{"erro":"Erro interno"}', { status: 500 })
    ));
    const service = new CandidateService();

    // when / then
    await expect(service.getCandidatos()).rejects.toThrow("Erro ao buscar candidatos: HTTP 500");
  });
});
