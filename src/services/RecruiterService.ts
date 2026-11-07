import type { CreateRecruiterInput, RecruiterResponse } from "../types/RecruiterResponse";
import { sharedSessionService, SessionService, ApiError } from "./SessionService";

function positiveId(value: number | string, field: string): number {
  const id = Number(value);
  if (!Number.isSafeInteger(id) || id <= 0) throw new Error(`${field} inválido`);
  return id;
}

export class RecruiterService {
  private readonly url = `${import.meta.env.VITE_API_URL}/api/recrutadores`;

  constructor(private readonly session: SessionService = sharedSessionService) {}

  async listar(): Promise<RecruiterResponse[]> {
    const data = await this.session.request<RecruiterResponse[]>(this.url);
    return data.map((item) => this.toPublicRecruiter(item));
  }

  async criar(input: CreateRecruiterInput): Promise<RecruiterResponse> {
    const data = await this.session.request<RecruiterResponse>(this.url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        nome: input.name,
        area: input.area,
        descricao: input.description,
        email: input.email,
        cpf: input.cpf,
        dataNascimento: input.birthDate,
        senha: input.password,
      }),
    }, 201);
    if (!data || !data.id || !data.idEmpresa) throw new ApiError(500, "Resposta de recrutador inválida");
    return this.toPublicRecruiter(data);
  }

  async desativar(id: number | string): Promise<boolean> {
    const response = await this.session.requestResponse(`${this.url}/${positiveId(id, "id")}`, {
      method: "DELETE",
    });
    return response.status === 204;
  }

  private toPublicRecruiter(item: RecruiterResponse): RecruiterResponse {
    return {
      id: positiveId(item.id, "id"),
      nome: item.nome,
      email: item.email,
      area: item.area,
      descricao: item.descricao,
      idEmpresa: positiveId(item.idEmpresa, "idEmpresa"),
      ativo: item.ativo,
    };
  }
}
