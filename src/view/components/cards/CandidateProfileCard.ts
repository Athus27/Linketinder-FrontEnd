import type { Candidate } from "../../../models/Candidate";
import { createCardActions } from "./actions/CardActions";
import "./CandidateProfileCard.css";

interface CandidateCardActions {
	onDelete?: (candidateId: string) => void;
	onLike?: (candidateId: string) => void;
}

export function CandidateProfileCard(
	candidate: Candidate,
	actions: CandidateCardActions,
	anonymous = true
): HTMLElement {
	const article = document.createElement("article");
	article.classList.add("candidate-profile");

	const name = document.createElement("h2");
	name.textContent = anonymous ? `Candidato #${candidate.id}` : candidate.name;

	const description = document.createElement("p");
	description.textContent = anonymous ? "" : candidate.description;

	const skillsTitle = document.createElement("h3");
	skillsTitle.textContent = "Competências";

	const skillsContainer = document.createElement("div");
	skillsContainer.classList.add("candidate-skills");

	const optionsCandidate = createCardActions({
		label: `Candidato #${candidate.id}`,
		className: "candidate-options",
		...(actions.onDelete ? { onDelete: () => actions.onDelete?.(candidate.id) } : {}),
		...(actions.onLike ? { onLike: () => actions.onLike?.(candidate.id) } : {}),
	});
	candidate.skills.forEach((skill) => {
		const skillTag = document.createElement("span");
		skillTag.classList.add("candidate-skill");
		skillTag.textContent = skill;

		skillsContainer.appendChild(skillTag);
	});

	article.append(name);

	const formation = document.createElement("p");
	formation.textContent = candidate.formation;
	article.append(formation);
	if (!anonymous) {
		const email = document.createElement("p");
		email.textContent = candidate.email;
		article.append(description, email);
	}
	article.append(skillsTitle, skillsContainer);
	if (optionsCandidate.childElementCount > 0) article.append(optionsCandidate);

	return article;
}
