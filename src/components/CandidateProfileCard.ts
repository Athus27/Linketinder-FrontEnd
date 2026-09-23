import type { Candidate } from "../models/Candidate";
import "./CandidateProfileCard.css";

interface CandidateCardActions {
	onDelete: (candidateId: string) => void;
}

export function CandidateProfileCard(candidate: Candidate, actions: CandidateCardActions): HTMLElement {
	const article = document.createElement("article");
	article.classList.add("candidate-profile");

	const name = document.createElement("h2");
	name.textContent = candidate.name;

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
	editButton.disabled = true;

	const editIcon = document.createElement("img");
	editIcon.src = "/assets/icons/edit.svg";
	editIcon.alt = "";

	editButton.appendChild(editIcon);

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

	optionsCandidate.append(editButton, deleteButton);

	candidate.skills.forEach((skill) => {
		const skillTag = document.createElement("span");
		skillTag.classList.add("candidate-skill");
		skillTag.textContent = skill;

		skillsContainer.appendChild(skillTag);
	});

	article.append(name, location, description, skillsTitle, skillsContainer, optionsCandidate);

	return article;
}
