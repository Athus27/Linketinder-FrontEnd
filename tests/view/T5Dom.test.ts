// @vitest-environment happy-dom
import { beforeEach, describe, expect, it, vi } from "vitest";
import { Header } from "../../src/view/components/layout/Header";
import { CandidateProfileCard } from "../../src/view/components/cards/CandidateProfileCard";
import { RecruiterManagementPage } from "../../src/view/pages/RecruiterManagementPage";
import { MatchesPage } from "../../src/view/pages/MatchesPage";
import { CompanyLikePage } from "../../src/view/pages/CompanyLikePage";
import { CandidateLikePage } from "../../src/view/pages/CandidateLikePage";
import { JobForm } from "../../src/view/components/forms/JobForm";
import { Candidate } from "../../src/models/Candidate";
import { ApiError, SessionService, sharedSessionService } from "../../src/services/SessionService";
import { renderAll } from "../../src/renderAll";
import { CandidateFeedPage } from "../../src/view/pages/CandidateFeedPage";

const actions = {
  onCreateCandidate: vi.fn(), onCreateCompany: vi.fn(), onCreateJob: vi.fn(),
  onViewCandidates: vi.fn(), onManageCandidates: vi.fn(), onViewCompanies: vi.fn(),
  onViewJobs: vi.fn(), onViewCompetenceGraph: vi.fn(), onCandidateLike: vi.fn(),
  onCompanyLike: vi.fn(), onManageRecruiters: vi.fn(), onMatches: vi.fn(),
  onMenuToggle: vi.fn(), onLogin: vi.fn(), onLogout: vi.fn(),
};

beforeEach(() => {
  sharedSessionService.clear();
  vi.clearAllMocks();
});

describe("T5 telas protegidas", () => {
  it("mostra somente o menu do papel autenticado e não oferece recrutador público", () => {
    const header = Header(actions, { id: "1", name: "Empresa", type: "company", companyId: "2" });
    expect(header.querySelector("#menu-view-company-button")?.hidden).toBe(false);
    expect(header.querySelector("#menu-view-candidate-button")?.hidden).toBe(true);
    expect(header.querySelector("#menu-view-recruiter-button")?.hidden).toBe(true);
    expect(header.textContent).not.toContain("Cadastrar recrutador");
  });

  it("não expõe PII nem interpreta HTML em card anônimo", () => {
    const candidate = new Candidate("<script>alert(1)</script>", "111", "", "<b>privado</b>", "private@example.test", "SP", "000", ["TS"], "");
    const card = CandidateProfileCard(candidate, { onEdit: vi.fn(), onDelete: vi.fn(), onLike: vi.fn() }, true);
    expect(card.textContent).toContain("Candidato #");
    expect(card.textContent).not.toContain("private@example.test");
    expect(card.querySelector("script")).toBeNull();
    expect(card.innerHTML).not.toContain("privado");
  });

  it("preserva alias, formação e contato somente no estado autorizado", () => {
    const candidate = new Candidate("Nome privado", "111", "", "Descrição <b>privada</b>", "pessoa@example.test", "SP", "000", ["TS"], "Tecnologia");
    candidate.id = "42";
    const anonymous = CandidateProfileCard(candidate, { onLike: vi.fn() });
    expect(anonymous.textContent).toContain("Candidato #42");
    expect(anonymous.textContent).toContain("TS");
    expect(anonymous.textContent).toContain("Tecnologia");
    expect(anonymous.textContent).not.toContain("pessoa@example.test");
    const matched = CandidateProfileCard(candidate, {}, false);
    expect(matched.textContent).toContain("Nome privado");
    expect(matched.textContent).toContain("Tecnologia");
    expect(matched.textContent).toContain("pessoa@example.test");
    expect(matched.innerHTML).not.toContain("<b>");
  });

  it("liga a ação do card ao candidato correto e não exibe ação noop", () => {
    const onLike = vi.fn();
    const candidate = new Candidate("Nome", "", "", "", "", "", "", []);
    candidate.id = "77";
    const card = CandidateProfileCard(candidate, { onLike });
    card.querySelector<HTMLButtonElement>("button")?.click();
    expect(onLike).toHaveBeenCalledWith("77");
    expect(card.querySelectorAll("button")).toHaveLength(1);
  });

  it("pré-seleciona candidato, usa pseudônimo e envia curtida sem ator", async () => {
    sharedSessionService.establish("token", { id: "1", name: "Empresa", type: "company", companyId: "2" });
    const like = vi.fn().mockResolvedValue({ sucesso: true, jaCurtiu: false, deuMatch: true });
    const page = CompanyLikePage("77",
      { getVagas: vi.fn().mockResolvedValue([{ id: "9", title: "Vaga", description: "", companyId: "2", skills: [] }]) } as never,
      { getCandidatos: vi.fn().mockResolvedValue([{ id: "77", name: "PII", description: "", email: "x", skills: [] }]) } as never,
      { curtir: like } as never);
    await Promise.resolve();
    await Promise.resolve();
    await Promise.resolve();
    await new Promise((resolve) => setTimeout(resolve, 0));
    const candidate = page.querySelector<HTMLSelectElement>('[name="candidateId"]')!;
    expect(candidate.selectedOptions[0]?.textContent).toBe("Candidato #77");
    page.dispatchEvent(new Event("submit", { bubbles: true, cancelable: true }));
    await Promise.resolve();
    await Promise.resolve();
    expect(like).toHaveBeenCalledWith("9", "77");
    expect(page.textContent).toContain("Deu match!");
  });

  it("mantém botão de curtida de vaga desabilitado durante carga e usa feedback idempotente", async () => {
    sharedSessionService.establish("token", { id: "1", name: "Candidato", type: "candidate" });
    let resolveJobs!: (jobs: unknown[]) => void;
    const jobsPromise = new Promise<unknown[]>((resolve) => { resolveJobs = resolve; });
    const like = vi.fn().mockResolvedValue({ sucesso: true, jaCurtiu: true, deuMatch: false });
    const page = CandidateLikePage(undefined, { getVagas: vi.fn().mockReturnValue(jobsPromise) } as never, { curtir: like } as never);
    const button = page.querySelector<HTMLButtonElement>("button")!;
    expect(button.disabled).toBe(true);
    resolveJobs([{ id: "9", title: "Vaga", description: "", companyId: "2", skills: [] }]);
    await Promise.resolve();
    await Promise.resolve();
    await Promise.resolve();
    page.dispatchEvent(new Event("submit", { bubbles: true, cancelable: true }));
    await Promise.resolve();
    expect(like).toHaveBeenCalledWith("9");
    expect(page.textContent).toContain("já curtiu");
  });

  it("não faz requisição de gestão quando o ator é recrutador", () => {
    sharedSessionService.establish("token", { id: "1", name: "Recrutador", type: "recruiter", companyId: "2" });
    const service = { listar: vi.fn(), criar: vi.fn(), desativar: vi.fn() } as never;
    const page = RecruiterManagementPage(service);
    expect(page.textContent).toContain("Apenas empresas");
    expect(service.listar).not.toHaveBeenCalled();
  });

  it("trata 409 pelo status público, limpa CPF/senha e explicita estado ativo", async () => {
    sharedSessionService.establish("token", { id: "2", name: "Empresa", type: "company", companyId: "2" });
    const service = {
      listar: vi.fn().mockResolvedValue([{ id: 3, nome: "R", email: "r@example.test", area: "TI", descricao: "D", idEmpresa: 2, ativo: true }]),
      criar: vi.fn().mockRejectedValue(new ApiError(409, "Cadastro já existente")),
      desativar: vi.fn(),
    } as never;
    const page = RecruiterManagementPage(service);
    await Promise.resolve();
    expect(page.textContent).toContain("Ativo");
    const form = page.querySelector("form")!;
    (form.querySelector('[name="cpf"]') as HTMLInputElement).value = "sintetico";
    (form.querySelector('[name="password"]') as HTMLInputElement).value = "Senha123";
    form.dispatchEvent(new Event("submit", { bubbles: true, cancelable: true }));
    await Promise.resolve();
    await Promise.resolve();
    expect(page.textContent).toContain("E-mail ou CPF já cadastrado.");
    expect((form.querySelector('[name="cpf"]') as HTMLInputElement).value).toBe("sintetico");
    expect((form.querySelector('[name="password"]') as HTMLInputElement).minLength).toBe(8);
  });

  it("atualiza a lista para Inativo após desativação confirmada", async () => {
    sharedSessionService.establish("token", { id: "2", name: "Empresa", type: "company", companyId: "2" });
    const active = { id: 3, nome: "R", email: "r@example.test", area: "TI", descricao: "D", idEmpresa: 2, ativo: true };
    const inactive = { ...active, ativo: false };
    const service = {
      listar: vi.fn().mockResolvedValueOnce([active]).mockResolvedValueOnce([inactive]),
      criar: vi.fn(), desativar: vi.fn().mockResolvedValue(true),
    } as never;
    const page = RecruiterManagementPage(service);
    await Promise.resolve();
    window.confirm = vi.fn().mockReturnValue(true);
    page.querySelector("button[type='button']")?.dispatchEvent(new Event("click"));
    await Promise.resolve();
    await Promise.resolve();
    expect(page.textContent).toContain("Inativo");
    expect(service.desativar).toHaveBeenCalledWith(3);
  });

  it("não anuncia vaga criada quando a API retorna false", async () => {
    const form = JobForm({ cadastrarVaga: vi.fn().mockResolvedValue(false) } as never);
    const title = form.querySelector('[name="title"]') as HTMLInputElement;
    const description = form.querySelector('[name="description"]') as HTMLTextAreaElement;
    const location = form.querySelector('[name="localVaga"]') as HTMLInputElement;
    title.value = "Vaga"; description.value = "Descrição"; location.value = "Remoto";
    form.dispatchEvent(new Event("submit", { bubbles: true, cancelable: true }));
    await Promise.resolve();
    expect(form.textContent).not.toContain("cadastrada com sucesso");
  });

  it("não invalida o token novo quando uma requisição antiga retorna 401", async () => {
    const session = new SessionService();
    const callbacks = vi.fn();
    session.setUnauthorizedCallback(callbacks);
    session.establish("A", { id: "1", name: "A", type: "candidate" });
    let resolve!: (response: Response) => void;
    vi.stubGlobal("fetch", vi.fn().mockReturnValue(new Promise<Response>((r) => { resolve = r; })));
    const request = session.requestResponse("/protected");
    session.establish("B", { id: "2", name: "B", type: "candidate" });
    resolve(new Response(null, { status: 401 }));
    await expect(request).rejects.toBeInstanceOf(ApiError);
    expect(session.getToken()).toBe("B");
    expect(callbacks).not.toHaveBeenCalled();
    vi.unstubAllGlobals();
  });

  it("limpa UI de sessão mesmo quando logout falha na rede", async () => {
    const session = new SessionService();
    session.establish("token", { id: "1", name: "Pessoa", type: "candidate" });
    vi.stubGlobal("fetch", vi.fn().mockRejectedValue(new Error("rede indisponível")));
    await expect(session.logout("http://api.test")).rejects.toThrow("rede indisponível");
    expect(session.getUser()).toBeNull();
    expect(session.getToken()).toBeNull();
    vi.unstubAllGlobals();
  });

  it("renderiza match sem converter data nula em epoch", async () => {
    const page = MatchesPage({ listar: vi.fn().mockResolvedValue([{ idCandidato: 1, idVaga: 2, dataMatch: null }]) } as never);
    await Promise.resolve();
    await Promise.resolve();
    expect(page.textContent).toContain("Data não registrada");
    expect(page.textContent).not.toContain("1970");
  });

  it("integra menu do recrutador, feed de candidatos e curtida do alvo correto", async () => {
    sharedSessionService.establish("recruiter-token", {
      id: "8", name: "Recrutador", type: "recruiter", companyId: "2",
    });
    document.body.innerHTML = '<div id="app"></div>';
    const likedRequest = vi.fn();
    vi.stubGlobal("fetch", vi.fn(async (input: RequestInfo | URL, init?: RequestInit) => {
      const url = new URL(String(input), "http://localhost:8080");
      if (url.pathname === "/api/candidatos") {
        return new Response(JSON.stringify([{ id: 77, competencias: ["TS"], formacao: "" }]), { status: 200 });
      }
      if (url.pathname === "/api/empresas") {
        return new Response(JSON.stringify([]), { status: 200 });
      }
      if (url.pathname === "/api/vagas") {
        return new Response(JSON.stringify([{ id: 9, idEmpresa: 2, titulo: "Vaga", descricao: "D", competencias: ["TS"] }]), { status: 200 });
      }
      if (url.pathname === "/api/curtidas") {
        likedRequest(input, init);
        return new Response(JSON.stringify({ sucesso: true, jaCurtiu: false, deuMatch: true }), { status: 200 });
      }
      return new Response("[]", { status: 200 });
    }));

    renderAll();
    document.querySelector<HTMLButtonElement>("#menu-open-button")?.click();
    document.querySelector<HTMLButtonElement>("#menu-view-recruiter-button")?.click();
    document.querySelector<HTMLButtonElement>("#recruiter-candidates-button")?.click();
    await new Promise((resolve) => setTimeout(resolve, 0));
    await new Promise((resolve) => setTimeout(resolve, 0));
    expect(document.querySelector("#route-content")?.textContent).toContain("Candidato #77");
    expect(document.querySelector("#route-content")?.textContent).toContain("TS");

    document.querySelector<HTMLButtonElement>("#route-content .candidate-options button")?.click();
    await new Promise((resolve) => setTimeout(resolve, 0));
    await new Promise((resolve) => setTimeout(resolve, 0));
    const candidateSelect = document.querySelector<HTMLSelectElement>('[name="candidateId"]');
    expect(candidateSelect?.value).toBe("77");
    document.querySelector<HTMLFormElement>("#route-content form")?.dispatchEvent(
      new Event("submit", { bubbles: true, cancelable: true }),
    );
    await new Promise((resolve) => setTimeout(resolve, 0));
    expect(likedRequest).toHaveBeenCalled();
    const [, request] = likedRequest.mock.calls[0] as [string, RequestInit];
    expect(JSON.parse(String(request.body))).toEqual({ idVaga: 9, idCandidato: 77 });
    vi.unstubAllGlobals();
  });

  it("mostra contato apenas quando o DTO traz contato autorizado e mantém curtida", async () => {
    const candidate = new Candidate("Nome autorizado", "", "", "Descrição", "nome@example.test", "", "", ["TS"], "Formação");
    candidate.id = "10";
    const page = CandidateFeedPage(() => Promise.resolve([candidate]), false);
    await new Promise((resolve) => setTimeout(resolve, 0));
    expect(page.textContent).toContain("Nome autorizado");
    expect(page.textContent).toContain("nome@example.test");
    expect(page.textContent).not.toContain("CPF");
    expect(page.textContent).not.toContain("nascimento");
    expect(page.querySelectorAll("button")).toHaveLength(1);
  });
});
