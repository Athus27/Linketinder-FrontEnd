export abstract class User {
	id: string;
	name: string;
	description: string;
	email: string;
	state: string;
	cepCode: string;
	

	constructor(
		name: string,
		description: string,
		email: string,
		state: string,
		cepCode: string
	) {
		this.id = crypto.randomUUID(); //crypt 
		this.name = name;
		this.description = description;
		this.email = email;
		this.state = state;
		this.cepCode = cepCode;
	}
}