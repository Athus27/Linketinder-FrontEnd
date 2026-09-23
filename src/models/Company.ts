import { Job } from "./Job";
import { User } from "./User";

export class Company extends User {
	cnpj: string;
	country: string;


	constructor(
		name: string,
		cnpj: string,
		description: string,
		email: string,
		state: string,
		cepCode: string,
		country: string
	) {
		super(name, description, email, state, cepCode);
		
        this.cnpj = cnpj;
		this.country = country;
	}
}
