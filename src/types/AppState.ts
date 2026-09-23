import type { Candidate } from "../models/Candidate";
import type { Company } from "../models/Company";
import type { Job } from "../models/Job";

export interface AppState {
	candidates: Candidate[];
	companies: Company[];
	jobs: Job[];
}
