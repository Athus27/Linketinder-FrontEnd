export interface RecruiterResponse {
  id: number;
  nome: string;
  email: string;
  area: string;
  descricao: string;
  idEmpresa: number;
  ativo: boolean;
}

export interface CreateRecruiterInput {
  name: string;
  email: string;
  area: string;
  description: string;
  cpf: string;
  birthDate: string;
  password: string;
}
