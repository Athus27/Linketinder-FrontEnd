import type { LikeRequest } from "../types/LikeRequest";
import type { LikeResponse } from "../types/LikeResponse";
import { ApiError, SessionService, sharedSessionService } from "./SessionService";

function positiveId(value: number | string, field: string): number {
  const id = Number(value);
  if (!Number.isSafeInteger(id) || id <= 0) throw new Error(`${field} inválido`);
  return id;
}

export class LikeService {
  private readonly url = `${import.meta.env.VITE_API_URL}/api/curtidas`;

  constructor(private readonly session: SessionService = sharedSessionService) {}

  async curtir(idVaga: number | string, idCandidato?: number | string): Promise<LikeResponse> {
    const user = this.session.getUser();
    if (!user) throw new ApiError(401, "Login necessário", "UNAUTHENTICATED");
    const body: LikeRequest = { idVaga: positiveId(idVaga, "idVaga") };
    if (user.type === "company" || user.type === "recruiter") {
      if (idCandidato === undefined) throw new Error("idCandidato obrigatório");
      body.idCandidato = positiveId(idCandidato, "idCandidato");
    } else if (user.type !== "candidate") {
      throw new ApiError(403, "Papel não permitido", "FORBIDDEN");
    }
    const response = await this.session.request<LikeResponse>(this.url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    }, 200);
    if (
      typeof response?.sucesso !== "boolean" ||
      typeof response.jaCurtiu !== "boolean" ||
      typeof response.deuMatch !== "boolean"
    ) {
      throw new Error("Resposta de curtida inválida");
    }
    return {
      sucesso: response.sucesso,
      jaCurtiu: response.jaCurtiu,
      deuMatch: response.deuMatch,
    };
  }
}
