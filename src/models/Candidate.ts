import {User} from "./User";

export class Candidate extends User {
	skills: string[];
	cpf: string;
  birthDate: string;
  formation: string;

	constructor(
		name: string,
		cpf: string,
		birthDate: string,
		description: string,
		email: string,
		state: string,
		cepCode: string,
		skills: string[],
		formation = ""
	) {
		super(name, description, email, state, cepCode);
		this.skills = skills;
		this.cpf = cpf;
		this.birthDate = birthDate;
		this.formation = formation;
	}

	public getSkills(): string[] {
		return this.skills;
	}

  public getAge():number{
    const difference = Date.now() - new Date(this.birthDate).getTime()
    return Math.floor(difference / (1000 * 60 * 60 * 24 * 365.25))
  }
}
