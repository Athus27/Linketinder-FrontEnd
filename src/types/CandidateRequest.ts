export interface CandidateRequest {
  nome: string;
  sobrenome: string;
  dataNascimento: string;
  cpf: string;
  descricao: string;
  email: string;
  pais: string;
  cep: string;
  senha: string;
  competencias: string[];
  formacao?: string;
}