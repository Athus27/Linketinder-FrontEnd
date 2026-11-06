import type { UserType } from "./UserType";

export interface LoginResponse {
	id: number | string;
	nome: string;
	tipo: UserType;
}
