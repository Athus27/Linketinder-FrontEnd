import { Job } from "../models/Job";
import type { JobResponse } from "../types/JobResponse";

export class JobService {
  private readonly url = `${import.meta.env.VITE_API_URL}/api/vagas`;

  async getVagas(): Promise<Job[]> {
    const response = await fetch(this.url);
    if (!response.ok) {
      throw new Error(`Erro ao buscar vagas: HTTP ${response.status}`);
    }
    const dados: JobResponse[] = await response.json();
    return dados.map((dado) => {
      const job = new Job(dado.titulo, dado.descricao, String(dado.idEmpresa), dado.competencias);
      job.id = String(dado.id);
      return job;
    });
  }
}
