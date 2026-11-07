import { afterEach, describe, expect, it, vi } from "vitest";
import { RecruiterService } from "../../src/services/RecruiterService";
import { SessionService } from "../../src/services/SessionService";

afterEach(() => vi.unstubAllGlobals());

describe("RecruiterService", () => {
  it("envia o contrato de criação sem idEmpresa confiável e não expõe segredos", async () => {
    const session = new SessionService();
    session.establish("company-token", { id: "4", name: "Empresa", type: "company", companyId: "4" });
    const fetchMock = vi.fn().mockResolvedValue(new Response(JSON.stringify({
      id: 8, nome: "Recrutador", email: "r@example.test", area: "Tech",
      descricao: "Descrição", idEmpresa: 4, ativo: true,
    }), { status: 201 }));
    vi.stubGlobal("fetch", fetchMock);

    const result = await new RecruiterService(session).criar({
      name: "Recrutador", email: "r@example.test", area: "Tech",
      description: "Descrição", cpf: "00000000000", birthDate: "1990-01-01", password: "Senha123",
    });

    expect(result).toMatchObject({ id: 8, idEmpresa: 4 });
    const body = JSON.parse(fetchMock.mock.calls[0][1].body);
    expect(body).not.toHaveProperty("idEmpresa");
    expect(body).toMatchObject({ nome: "Recrutador", dataNascimento: "1990-01-01", senha: "Senha123" });
    expect(result).not.toHaveProperty("cpf");
  });

  it("envia DELETE e preserva status HTTP", async () => {
    const session = new SessionService();
    session.establish("company-token", { id: "4", name: "Empresa", type: "company", companyId: "4" });
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue(new Response(null, { status: 204 })));
    await expect(new RecruiterService(session).desativar(8)).resolves.toBe(true);
  });

  it("aplica a mesma allowlist na criação e listagem", async () => {
    const session = new SessionService();
    session.establish("company-token", { id: "4", name: "Empresa", type: "company", companyId: "4" });
    const payload = {
      id: 8, nome: "Recrutador", email: "r@example.test", area: "Tech",
      descricao: "Descrição", idEmpresa: 4, ativo: true,
      cpf: "never", dataNascimento: "never", senha: "never", hash: "never",
    };
    const fetchMock = vi.fn().mockResolvedValue(new Response(JSON.stringify([payload]), { status: 200 }));
    vi.stubGlobal("fetch", fetchMock);
    const result = await new RecruiterService(session).listar();
    expect(result).toEqual([{
      id: 8, nome: "Recrutador", email: "r@example.test", area: "Tech",
      descricao: "Descrição", idEmpresa: 4, ativo: true,
    }]);
    expect(result[0]).not.toHaveProperty("cpf");
    expect(result[0]).not.toHaveProperty("hash");
  });
});
