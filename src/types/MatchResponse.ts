export interface MatchResponse {
  idCandidato: number;
  idVaga: number;
  dataMatch: string | null;
  candidato?: { nome?: string; sobrenome?: string; email?: string; descricao?: string };
  empresa?: { id: number; nome?: string; email?: string };
}
