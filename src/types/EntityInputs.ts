export interface CreateCandidateInput {
	name: string;
	cpf: string;
	age: number;
	description: string;
	email: string;
	state: string;
	cepCode: string;
	skills: string[];
}

export interface CreateCompanyInput {
	name: string;
	cnpj: string;
	description: string;
	email: string;
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