import { describe, expect, it } from "vitest";
import { CandidateService } from "../../src/services/CandidateService";

const enabled = import.meta.env.VITE_RUN_API_INTEGRATION === "true";

describe.skipIf(!enabled)("CandidateService API integration (opt-in)", () => {
  it("recebe somente a projeção anônima permitida", async () => {
    const candidatos = await new CandidateService().getCandidatos();
    for (const candidato of candidatos) {
      expect(candidato.cpf).toBe("");
      expect(candidato.birthDate).toBe("");
      expect(candidato.cepCode).toBe("");
      expect(candidato.name).toMatch(/^Candidato #\d+$/);
      expect(candidato.email).toBe("");
    }
  });
});
