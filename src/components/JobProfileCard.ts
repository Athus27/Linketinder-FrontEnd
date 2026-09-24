import type { Job } from "../models/Job";
import "./JobProfileCard.css";

interface JobCardActions {
	onEdit: (jobId: string) => void;
	onDelete: (jobId: string) => void;
	onLike: (jobId: string) => void;
}

export function JobProfileCard(job: Job, actions: JobCardActions): HTMLElement {
	const article = document.createElement("article");
	article.classList.add("job-profile");

	const title = document.createElement("h2");
	title.textContent = job.title;

	const description = document.createElement("p");
	description.textContent = job.description;

	const skillsTitle = document.createElement("h3");
	skillsTitle.textContent = "Competências exigidas";

	const skillsContainer = document.createElement("div");
	skillsContainer.classList.add("job-skills");

	job.skills.forEach((skill) => {
		const skillTag = document.createElement("span");
		skillTag.classList.add("job-skill");
		skillTag.textContent = skill;
		skillsContainer.appendChild(skillTag);
	});

	const options = document.createElement("div");
	options.classList.add("job-options");

	const editButton = document.createElement("button");
	editButton.type = "button";
	editButton.classList.add("job-action");
	editButton.ariaLabel = `Editar ${job.title}`;
	editButton.innerHTML = '<img src="/assets/icons/edit.svg" alt="">';
	editButton.addEventListener("click", () => actions.onEdit(job.id));

	const deleteButton = document.createElement("button");
	deleteButton.type = "button";
	deleteButton.classList.add("job-action");
	deleteButton.ariaLabel = `Excluir ${job.title}`;
	deleteButton.innerHTML = '<img class="delete-icon" src="/assets/icons/delete.svg" alt="">';
	deleteButton.addEventListener("click", () => actions.onDelete(job.id));

	const likeButton = document.createElement("button");
	likeButton.type = "button";
	likeButton.classList.add("job-action");
	likeButton.ariaLabel = `Curtir ${job.title}`;
	likeButton.innerHTML = '<img src="/assets/icons/like.svg" alt="">';
	likeButton.addEventListener("click", () => actions.onLike(job.id));

	options.append(editButton, deleteButton, likeButton);
	article.append(title, description, skillsTitle, skillsContainer, options);

	return article;
}
