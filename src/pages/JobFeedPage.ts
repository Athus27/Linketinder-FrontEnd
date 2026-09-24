import { app } from "../main";
import { updateInfoCounters } from "../components/InfoSection";
import { JobEditForm } from "../components/JobEditForm";
import { JobProfileCard } from "../components/JobProfileCard";
import "./JobFeedPage.css";
import { CandidateLikePage } from "./CandidateLikePage";
import { changePage } from "../renderAll";

export function JobFeedPage(): HTMLElement {
	const section = document.createElement("section");
	section.classList.add("job-feed-page");

	const title = document.createElement("h1");
	title.textContent = "Vagas disponíveis";

	const feed = document.createElement("div");
	feed.classList.add("job-feed");

	let editingJobId: string | null = null;

	function renderJobs(): void {
		feed.replaceChildren();
		const jobs = app.getJobs();

		if (jobs.length === 0) {
			const emptyMessage = document.createElement("p");
			emptyMessage.classList.add("job-feed-empty");
			emptyMessage.textContent = "Nenhuma vaga cadastrada.";
			feed.appendChild(emptyMessage);
			return;
		}

		jobs.forEach((job) => {
			if (job.id === editingJobId) {
				feed.appendChild(JobEditForm(job, {
					onSave: (data) => {
						if (!app.updateJob(job.id, data)) return;
						editingJobId = null;
						renderJobs();
					},
					onCancel: () => {
						editingJobId = null;
						renderJobs();
					}
				}));
				return;
			}

			feed.appendChild(JobProfileCard(job, {
				onEdit: (jobId) => {
					editingJobId = jobId;
					renderJobs();
				},
				onDelete: (jobId) => {
					if (!window.confirm(`Deseja excluir ${job.title}?`)) return;
					app.removeJob(jobId);
					updateInfoCounters();
					renderJobs();
				},
				onLike: (jobId) => {
					changePage(CandidateLikePage(jobId));
				}
			}));
		});
	}

	renderJobs();

	section.append(title, feed);

	return section;
}
