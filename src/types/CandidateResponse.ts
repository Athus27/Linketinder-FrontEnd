export interface CandidateResponse {
  id: number;
  competencias: string[];
  formacao: string;
  nome?: string;
  sobrenome?: string;
  email?: string;
  descricao?: string;
}

export interface LegacyCandidateResponse extends CandidateResponse {
  cpf?: string;
  dataNascimento?: string;
  cep?: string;
}