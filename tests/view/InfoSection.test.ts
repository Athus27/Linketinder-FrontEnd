import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { updateInfoCounters } from "../../src/view/components/layout/InfoSection";
import { CompanyService } from "../../src/services/CompanyService";
import { CandidateService } from "../../src/services/CandidateService";
import { JobService } from "../../src/services/JobService";

describe("InfoSection com dados da API", () => {
  let elements: Record<string, { textContent: string }>;

  beforeEach(() => {
    elements = Object.fromEntries(["#company-count", "#candidate-count", "#job-count"].map(id => [id, { textContent: "" }]));
    vi.stubGlobal("document", { querySelector: (id: string) => elements[id] });
    vi.spyOn(CompanyService.prototype, "getEmpresas").mockResolvedValue([{}, {}] as never);
    vi.spyOn(CandidateService.prototype, "getCandidatos").mockResolvedValue([{}, {}, {}] as never);
    vi.spyOn(JobService.prototype, "getVagas").mockResolvedValue([]);
  });

  afterEach(() => { vi.restoreAllMocks(); vi.unstubAllGlobals(); });

  it("exibe as contagens retornadas pelo backend, incluindo zero", async () => {
    await updateInfoCounters();
    expect(elements["#company-count"].textContent).toBe("Empresas cadastradas: 2");
    expect(elements["#candidate-count"].textContent).toBe("Candidatos cadastrados: 3");
    expect(elements["#job-count"].textContent).toBe("Vagas cadastradas: 0");
  });

  it("não apresenta falha da API como contagem zero e mantém os outros contadores", async () => {
    vi.mocked(CandidateService.prototype.getCandidatos).mockRejectedValue(new Error("offline"));
    await updateInfoCounters();
    expect(elements["#candidate-count"].textContent).toBe("Candidatos cadastrados: indisponível");
    expect(elements["#company-count"].textContent).toBe("Empresas cadastradas: 2");
  });
});
