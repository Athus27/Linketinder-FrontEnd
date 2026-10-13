import type { Candidate } from "../../models/Candidate";
import { createCardActions } from "./actions/CardActions";
import "./CandidateProfileCard.css";

interface CandidateCardActions {
	onEdit: (candidateId: string) => void;
	onDelete: (candidateId: string) => void;
	onLike: (candidateId: string) => void;
}

export function CandidateProfileCard(
	candidate: Candidate,
	actions: CandidateCardActions,
	anonymous = false
): HTMLElement {
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

	let optionsCandidate: HTMLDivElement;

	if (anonymous) {
		optionsCandidate = createCardActions({
			label: "candidato",
			className: "candidate-options",
			onLike: () => actions.onLike(candidate.id)
		});
	} else {
		optionsCandidate = createCardActions({
			label: candidate.name,
			className: "candidate-options",
			onEdit: () => actions.onEdit(candidate.id),
			onDelete: () => actions.onDelete(candidate.id),
			onLike: () => actions.onLike(candidate.id)
		});
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
		article.append(optionsCandidate);
	}

	article.append(description, skillsTitle, skillsContainer, optionsCandidate);

	return article;
}
