export class Job {
	id: string;
	title: string;
	description: string;
	companyId: string;
	skills: string[];

	constructor(title: string, description: string, companyId: string, skills: string[]) {
		this.id = crypto.randomUUID();
		this.title = title;
		this.description = description;
		this.companyId = companyId;
		this.skills = skills;
	}

	public getSkills(): string[] {
		return this.skills;
	}
}
