import { User } from "./User";

export class Candidate extends User {
	skills: string[];
	cpf: string;
	age: number;

	constructor(
		name: string,
		cpf: string,
		age: number,
		description: string,
		email: string,
		state: string,
		cepCode: string,
		skills: string[]
	) {
		super(name, description, email, state, cepCode);
		this.skills = skills;
		this.cpf = cpf;
        this.age = age;
	}
}
