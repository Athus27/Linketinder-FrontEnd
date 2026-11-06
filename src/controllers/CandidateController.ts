import type {CreateCandidateInput} from "../types/EntityInputs";
import {CandidateService} from "../services/CandidateService";
import type {Candidate} from "../models/Candidate";
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

  async getCandidatos():Promise<Candidate[]>{
    try {
      const candidatos = await this.candidateService.getCandidatos();
      return candidatos;
    } catch (error) {
      console.error("Erro ao buscar candidatos:", error);
      throw error;
    }
  }
}