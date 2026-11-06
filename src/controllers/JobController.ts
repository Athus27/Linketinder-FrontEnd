import type { Job } from "../models/Job";
import { JobService } from "../services/JobService";

export class JobController {
  constructor(private readonly jobService: JobService) {}

  async getVagas(): Promise<Job[]> {
    return this.jobService.getVagas();
  }
}
