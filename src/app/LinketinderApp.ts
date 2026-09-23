import { Candidate } from "../models/Candidate";
import { Company } from "../models/Company";
import { Job } from "../models/Job";

export class LinketinderApp {
	private candidates: Candidate[] = [];
	private companies: Company[] = [];
	private jobs: Job[] = [];

	private load<T>(key: string): T[] {
		const data = localStorage.getItem(key);
		if (data) {
			return JSON.parse(data) as T[];
		}
		console.log(`não encontrou dados para a chave: ${key}`);
		return [];
	}

	private save<T>(key: string, data: T[]): void {
		localStorage.setItem(key, JSON.stringify(data));
	}

	constructor() {
		this.candidates = this.load<Candidate>("candidates");
		this.companies = this.load<Company>("companies");
		this.jobs = this.load<Job>("jobs");
	}

	public addCandidate(candidate: Candidate): void {
		this.candidates.push(candidate);
		this.save("candidates", this.candidates);
	}

	public removeCandidate(candidateId: string): boolean {
		const candidateIndex = this.candidates.findIndex((candidate) => candidate.id === candidateId);

		if (candidateIndex === -1) {
			return false;
		}

		this.candidates.splice(candidateIndex, 1);
		this.save("candidates", this.candidates);

		return true;
	}

	public addCompany(company: Company): void {
		this.companies.push(company);
		this.save("companies", this.companies);
	}

	public addJob(job: Job): void {
		this.jobs.push(job);
		this.save("jobs", this.jobs);
	}

	public getCandidates(): Candidate[] {
		return this.candidates;
	}

	public getCompanies(): Company[] {
		return this.companies;
	}

	public getJobs(): Job[] {
		return this.jobs;
	}
}
