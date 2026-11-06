import type {CreateCandidateInput} from "../types/EntityInputs";
import {CandidateService} from "../services/CandidateService";

export class CandidateController {
  private readonly candidateService: CandidateService;

  constructor(candidateService: CandidateService) {
    this.candidateService = candidateService;
  }

  async cadastrarCandidato(candidato:CreateCandidateInput):Promise<boolean>{
    try {
      const result = await this.candidateService.cadastrarCandidato(candidato);
      return result;
    } catch (error) {
      console.error("Erro ao cadastrar candidato:", error);
      return false;
    }
  }
}