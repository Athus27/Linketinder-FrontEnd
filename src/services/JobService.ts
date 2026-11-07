import { Job } from "../models/Job";
import type { JobResponse } from "../types/JobResponse";
import type { CreateJobInput } from "../types/EntityInputs";
import type { JobRequest } from "../types/JobRequest";
import { sharedSessionService, SessionService } from "./SessionService";

export class JobService {
  private readonly url = `${import.meta.env.VITE_API_URL}/api/vagas`;

  constructor(private readonly session: SessionService = sharedSessionService) {}

  async getVagas(onlyMine = false): Promise<Job[]> {
    const dados = await this.session.request<JobResponse[]>(
      `${this.url}${onlyMine ? "?minhas=true" : ""}`,
    );
    return dados.map((dado) => {
      const job = new Job(dado.titulo, dado.descricao, String(dado.idEmpresa), dado.competencias);
      job.id = String(dado.id);
      return job;
    });
  }

  async cadastrarVaga(input: CreateJobInput): Promise<boolean> {
    const body: JobRequest = {
      titulo: input.title,
      descricao: input.description,
      localVaga: input.localVaga || "",
      competencias: input.skills,
    };
    const response = await this.session.requestResponse(this.url, {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    return response.status === 201;
  }
}
