// src/pages/CandidateFeedPage.ts
import { app } from "../main";
import { CandidateProfileCard } from "../components/CandidateProfileCard";
import "./CandidateFeedPage.css";

export function CandidateFeedPage(): HTMLElement {
	const section = document.createElement("section");
	section.classList.add("candidate-feed-page");

	const title = document.createElement("h1");
	title.textContent = "Candidatos disponíveis";

	const feed = document.createElement("div");
	feed.classList.add("candidate-feed");

	function renderCandidates(): void {
		feed.replaceChildren();

		const candidates = app.getCandidates();

		if (candidates.length === 0) {
			const emptyMessage = document.createElement("p");
			emptyMessage.classList.add("candidate-feed-empty");
			emptyMessage.textContent = "Nenhum candidato cadastrado.";

			feed.appendChild(emptyMessage);
			return;
		}

		candidates.forEach((candidate) => {
			const card = CandidateProfileCard(candidate, {
				onDelete: (candidateId) => {
					const shouldDelete = window.confirm(`Deseja excluir ${candidate.name}?`);

					if (!shouldDelete) return;

					app.removeCandidate(candidateId);
					renderCandidates();
				}
			});

			feed.appendChild(card);
		});
	}

	renderCandidates();

	section.append(title, feed);

	return section;
}
