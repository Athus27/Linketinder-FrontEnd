import type { UserType } from "./UserType";

export interface LoginResponse {
	token: string;
	id: number;
	nome: string;
	tipo: UserType;
	idEmpresa?: number;
}
