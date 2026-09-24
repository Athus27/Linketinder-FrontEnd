import type { Candidate } from "../models/Candidate";
import "./CandidateProfileCard.css";

interface CandidateCardActions {
	onEdit: (candidateId: string) => void;
	onDelete: (candidateId: string) => void;
	onLike: (candidateId: string) => void;
}

export function CandidateProfileCard(candidate: Candidate, actions: CandidateCardActions, anonymous = false): HTMLElement {
	const article = document.createElement("article");
	article.classList.add("candidate-profile");

	const name = document.createElement("h2");
	name.textContent = anonymous ? "Perfil de candidato" : candidate.name;

	const location = document.createElement("p");
	location.textContent = `${candidate.state} • ${candidate.age} anos`;

	const description = document.createElement("p");
	description.textContent = candidate.description;

	const skillsTitle = document.createElement("h3");
	skillsTitle.textContent = "Competências";

	const skillsContainer = document.createElement("div");
	skillsContainer.classList.add("candidate-skills");

	//CRUD options
	const optionsCandidate = document.createElement("div");
	optionsCandidate.classList.add("candidate-options");

	const editButton = document.createElement("button");
	editButton.type = "button";
	editButton.classList.add("candidate-action");
	editButton.ariaLabel = `Editar ${candidate.name}`;

	const editIcon = document.createElement("img");
	editIcon.src = "/assets/icons/edit.svg";
	editIcon.alt = "";

	editButton.appendChild(editIcon);
	editButton.addEventListener("click", () => {
		actions.onEdit(candidate.id);
	});

	const deleteButton = document.createElement("button");
	deleteButton.type = "button";
	deleteButton.classList.add("candidate-action", "delete-candidate");
	deleteButton.ariaLabel = `Excluir ${candidate.name}`;

	const deleteIcon = document.createElement("img");
	deleteIcon.classList.add("delete-icon");
	deleteIcon.src = "/assets/icons/delete.svg";
	deleteIcon.alt = "";

	deleteButton.appendChild(deleteIcon);
	deleteButton.addEventListener("click", () => {
		actions.onDelete(candidate.id);
	});

	const likeButton = document.createElement("button");
	likeButton.type = "button";
	likeButton.classList.add("candidate-action");
	likeButton.ariaLabel = anonymous ? "Curtir candidato" : `Curtir ${candidate.name}`;

	const likeIcon = document.createElement("img");
	likeIcon.src = "/assets/icons/like.svg";
	likeIcon.alt = "";

	likeButton.appendChild(likeIcon);
	likeButton.addEventListener("click", () => {
		actions.onLike(candidate.id);
	});

	if (anonymous) {
		optionsCandidate.append(likeButton);
	} else {
		optionsCandidate.append(editButton, deleteButton, likeButton);
	}

	candidate.skills.forEach((skill) => {
		const skillTag = document.createElement("span");
		skillTag.classList.add("candidate-skill");
		skillTag.textContent = skill;

		skillsContainer.appendChild(skillTag);
	});

	article.append(name);

	if (!anonymous) {
		article.append(location);
	}

	article.append(description, skillsTitle, skillsContainer, optionsCandidate);

	return article;
}
