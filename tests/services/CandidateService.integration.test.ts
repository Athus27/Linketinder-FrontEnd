import { it } from "vitest";
import { CandidateService } from "../../src/services/CandidateService";

it("mostra os candidatos retornados pelo backend real", async () => {
  const service = new CandidateService();
  const candidatos = await service.getCandidatos();

  console.log(JSON.stringify(candidatos, null, 2));
});
