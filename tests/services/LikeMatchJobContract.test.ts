import { afterEach, describe, expect, it, vi } from "vitest";
import { LikeService } from "../../src/services/LikeService";
import { MatchService } from "../../src/services/MatchService";
import { JobService } from "../../src/services/JobService";
import { SessionService } from "../../src/services/SessionService";

afterEach(() => vi.unstubAllGlobals());

describe("contratos de curtida, match e vaga", () => {
  it("deriva o ator da sessão e envia payload mínimo de curtida", async () => {
    const session = new SessionService();
    session.establish("candidate-token", { id: "9", name: "Candidato", type: "candidate" });
    const fetchMock = vi.fn().mockResolvedValue(new Response(JSON.stringify({
      sucesso: true, jaCurtiu: false, deuMatch: false,
    }), { status: 200 }));
    vi.stubGlobal("fetch", fetchMock);
    await expect(new LikeService(session).curtir(12, 999)).resolves.toEqual({
      sucesso: true, jaCurtiu: false, deuMatch: false,
    });
    expect(JSON.parse(fetchMock.mock.calls[0][1].body)).toEqual({ idVaga: 12 });
  });

  it("envia candidato somente para papel empresarial/recrutador", async () => {
    const session = new SessionService();
    session.establish("recruiter-token", { id: "8", name: "Recrutador", type: "recruiter", companyId: "4" });
    const fetchMock = vi.fn().mockResolvedValue(new Response(JSON.stringify({
      sucesso: true, jaCurtiu: true, deuMatch: false,
    }), { status: 200 }));
    vi.stubGlobal("fetch", fetchMock);
    await expect(new LikeService(session).curtir(12, 9)).resolves.toEqual({
      sucesso: true, jaCurtiu: true, deuMatch: false,
    });
    expect(JSON.parse(fetchMock.mock.calls[0][1].body)).toEqual({ idVaga: 12, idCandidato: 9 });
  });

  it("preserva repetição e match somente conforme a resposta do servidor", async () => {
    const session = new SessionService();
    session.establish("candidate-token", { id: "9", name: "Candidato", type: "candidate" });
    const fetchMock = vi.fn().mockResolvedValue(new Response(JSON.stringify({
      sucesso: true, jaCurtiu: true, deuMatch: true,
    }), { status: 200 }));
    vi.stubGlobal("fetch", fetchMock);
    await expect(new LikeService(session).curtir(12)).resolves.toEqual({
      sucesso: true, jaCurtiu: true, deuMatch: true,
    });
  });

  it("rejeita resposta JSON de curtida incompleta ou inválida", async () => {
    const session = new SessionService();
    session.establish("candidate-token", { id: "9", name: "Candidato", type: "candidate" });
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue(new Response(
      JSON.stringify({ sucesso: true, jaCurtiu: "false", deuMatch: false }), { status: 200 },
    )));
    await expect(new LikeService(session).curtir(12)).rejects.toThrow("Resposta de curtida inválida");
  });

  it("cria vaga sem aceitar empresa no corpo e normaliza matches ISO", async () => {
    const session = new SessionService();
    session.establish("company-token", { id: "4", name: "Empresa", type: "company", companyId: "4" });
    const fetchMock = vi.fn()
      .mockResolvedValueOnce(new Response(null, { status: 201 }))
      .mockResolvedValueOnce(new Response(JSON.stringify([{
        idCandidato: 9, idVaga: 12, dataMatch: "2026-01-01T00:00:00Z",
        cpf: "never", senha: "never",
        empresa: { id: 4, nome: "Empresa", email: "empresa@example.test", cnpj: "never" },
      }]), { status: 200 }));
    vi.stubGlobal("fetch", fetchMock);
    await expect(new JobService(session).cadastrarVaga({
      companyId: "999", title: "Dev", description: "Descrição", localVaga: "Remoto", skills: ["TS"],
    })).resolves.toBe(true);
    expect(JSON.parse(fetchMock.mock.calls[0][1].body)).toEqual({
      titulo: "Dev", descricao: "Descrição", localVaga: "Remoto", competencias: ["TS"],
    });
    await expect(new MatchService(session).listar()).resolves.toEqual([{
      idCandidato: 9,
      idVaga: 12,
      dataMatch: "2026-01-01T00:00:00.000Z",
      empresa: { id: 4, nome: "Empresa", email: "empresa@example.test" },
    }]);
  });

  it("preserva dataMatch nula e rejeita data inválida sem inventar data", async () => {
    const session = new SessionService();
    session.establish("company-token", { id: "4", name: "Empresa", type: "company", companyId: "4" });
    const fetchMock = vi.fn()
      .mockResolvedValueOnce(new Response(JSON.stringify([{
        idCandidato: 9, idVaga: 12, dataMatch: null,
        candidato: { nome: "Candidato", cpf: "never", senha: "never" },
      }]), { status: 200 }));
    vi.stubGlobal("fetch", fetchMock);
    await expect(new MatchService(session).listar()).resolves.toEqual([{
      idCandidato: 9,
      idVaga: 12,
      dataMatch: null,
      candidato: { nome: "Candidato" },
    }]);

    vi.stubGlobal("fetch", vi.fn().mockResolvedValue(new Response(JSON.stringify([{
      idCandidato: 9, idVaga: 12, dataMatch: "not-a-date",
    }]), { status: 200 })));
    await expect(new MatchService(session).listar()).rejects.toThrow("Data de match inválida");
  });
});
