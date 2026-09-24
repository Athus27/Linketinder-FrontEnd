import { Candidate } from "../models/Candidate";
import type { CreateCandidateInput, CreateJobInput } from "../types/EntityInputs";
import { Company } from "../models/Company";
import { Job } from "../models/Job";
import type { Like, LikeResult } from "../models/Like";

export class LinketinderApp {
	private candidates: Candidate[] = [];
	private companies: Company[] = [];
	private jobs: Job[] = [];
	private likes: Like[] = [];

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
		this.likes = this.load<Like>("likes");
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
		this.likes = this.likes.filter((like) => like.candidateId !== candidateId);
		this.save("likes", this.likes);

		return true;
	}

	public updateCandidate(candidateId: string, data: CreateCandidateInput): boolean {
		const candidate = this.candidates.find((currentCandidate) => currentCandidate.id === candidateId);

		if (!candidate) {
			return false;
		}

		Object.assign(candidate, data);
		this.save("candidates", this.candidates);

		return true;
	}

	public addCompany(company: Company): void {
		this.companies.push(company);
		this.save("companies", this.companies);
	}

	public addJob(job: Job): boolean {
		const companyExists = this.companies.some((company) => company.id === job.companyId);

		if (!companyExists) {
			return false;
		}

		this.jobs.push(job);
		this.save("jobs", this.jobs);

		return true;
	}

	public removeJob(jobId: string): boolean {
		const jobIndex = this.jobs.findIndex((job) => job.id === jobId);

		if (jobIndex === -1) return false;

		this.jobs.splice(jobIndex, 1);
		this.save("jobs", this.jobs);
		this.likes = this.likes.filter((like) => like.jobId !== jobId);
		this.save("likes", this.likes);

		return true;
	}

	public updateJob(jobId: string, data: CreateJobInput): boolean {
		const job = this.jobs.find((currentJob) => currentJob.id === jobId);
		const companyExists = this.companies.some((company) => company.id === data.companyId);

		if (!job || !companyExists) return false;

		Object.assign(job, data);
		this.save("jobs", this.jobs);

		return true;
	}

	public candidateLikeJob(candidateId: string, jobId: string): LikeResult {
		const candidateExists = this.candidates.some((candidate) => candidate.id === candidateId);
		const job = this.jobs.find((currentJob) => currentJob.id === jobId);

		if (!candidateExists || !job) return { status: "not-found" };

		const like = this.findLike(candidateId, jobId) ?? this.createLike(candidateId, job.id, job.companyId);

		if (like.candidateLiked) {
			return { status: like.companyLiked ? "match" : "already-liked", like };
		}

		like.candidateLiked = true;
		this.save("likes", this.likes);

		return { status: like.companyLiked ? "match" : "liked", like };
	}

	public companyLikeCandidate(companyId: string, jobId: string, candidateId: string): LikeResult {
		const companyExists = this.companies.some((company) => company.id === companyId);
		const candidateExists = this.candidates.some((candidate) => candidate.id === candidateId);
		const job = this.jobs.find((currentJob) => currentJob.id === jobId);

		if (!companyExists || !candidateExists || !job) return { status: "not-found" };
		if (job.companyId !== companyId) return { status: "invalid-job" };

		const like = this.findLike(candidateId, jobId) ?? this.createLike(candidateId, job.id, companyId);

		if (like.companyLiked) {
			return { status: like.candidateLiked ? "match" : "already-liked", like };
		}

		like.companyLiked = true;
		this.save("likes", this.likes);

		return { status: like.candidateLiked ? "match" : "liked", like };
	}

	private findLike(candidateId: string, jobId: string): Like | undefined {
		return this.likes.find((like) => like.candidateId === candidateId && like.jobId === jobId);
	}

	private createLike(candidateId: string, jobId: string, companyId: string): Like {
		const like: Like = {
			id: crypto.randomUUID(),
			candidateId,
			companyId,
			jobId,
			candidateLiked: false,
			companyLiked: false
		};

		this.likes.push(like);
		return like;
	}

	public getLikes(): Like[] {
		return this.likes;
	}

	public getMatches(): Like[] {
		return this.likes.filter((like) => like.candidateLiked && like.companyLiked);
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
