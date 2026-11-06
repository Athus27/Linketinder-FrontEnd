export interface CreateCandidateInput {
	name: string;
	surname: string;
	country: string;
	password: string;
	cpf: string;
  birthDate: string;
	description: string;
	email: string;
	state: string;
	cepCode: string;
	skills: string[];
}

export type UpdateCandidateInput = Omit<CreateCandidateInput, "surname" | "country" | "password">;

export interface CreateCompanyInput {
	name: string;
	cnpj: string;
	description: string;
	email: string;
	password: string;
	state: string;
	cepCode: string;
	country: string;
}

export interface CreateJobInput {
	companyId: string;
	title: string;
	description: string;
	skills: string[];
}
