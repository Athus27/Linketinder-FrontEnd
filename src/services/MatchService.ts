import type { MatchResponse } from "../types/MatchResponse";
import { sharedSessionService, SessionService } from "./SessionService";

function positiveId(value: number, field: string): number {
  if (!Number.isSafeInteger(value) || value <= 0) throw new Error(`${field} inválido`);
  return value;
}

export class MatchService {
  private readonly url = `${import.meta.env.VITE_API_URL}/api/matches`;

  constructor(private readonly session: SessionService = sharedSessionService) {}

  async listar(): Promise<MatchResponse[]> {
    const data = await this.session.request<MatchResponse[]>(this.url, {}, 200);
    return data.map((match) => ({
      idCandidato: positiveId(match.idCandidato, "idCandidato"),
      idVaga: positiveId(match.idVaga, "idVaga"),
      dataMatch: this.toIsoDate(match.dataMatch),
      ...(match.candidato ? {
        candidato: {
          ...(match.candidato.nome ? { nome: match.candidato.nome } : {}),
          ...(match.candidato.sobrenome ? { sobrenome: match.candidato.sobrenome } : {}),
          ...(match.candidato.email ? { email: match.candidato.email } : {}),
          ...(match.candidato.descricao ? { descricao: match.candidato.descricao } : {}),
        },
      } : {}),
      ...(match.empresa ? {
        empresa: {
          id: positiveId(match.empresa.id, "idEmpresa"),
          ...(match.empresa.nome ? { nome: match.empresa.nome } : {}),
          ...(match.empresa.email ? { email: match.empresa.email } : {}),
        },
      } : {}),
    }));
  }

  private toIsoDate(value: string | null): string | null {
    if (value === null) return null;
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) throw new Error("Data de match inválida");
    return date.toISOString();
  }
}
