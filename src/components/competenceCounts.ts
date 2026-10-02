import type { Job } from '../models/Job';
import type { Candidate } from '../models/Candidate';

export function countCompetences(job: Pick<Job, 'skills'>, candidates: Pick<Candidate, 'skills'>[]): { labels: string[]; data: number[] } {
    const labels = [...new Set(job.skills)];
    const data = labels.map((skill) => candidates.filter((candidate) => candidate.skills.includes(skill)).length);
    return { labels, data };
}
