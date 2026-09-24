// src/pages/CandidateFeedPage.ts
import { app } from "../main";
import { CandidateProfileCard } from "../components/CandidateProfileCard";
import { CandidateEditForm } from "../components/CandidateEditForm";
import { updateInfoCounters } from "../components/InfoSection";
import "./CandidateFeedPage.css";
import { CompanyLikePage } from "./CompanyLikePage";
import { changePage } from "../renderAll";

export function CandidateFeedPage(managementMode = false): HTMLElement {
	const section = document.createElement("section");
	section.classList.add("candidate-feed-page");

	const title = document.createElement("h1");
	title.textContent = managementMode ? "Gerenciar candidatos" : "Candidatos disponíveis";

	const feed = document.createElement("div");
	feed.classList.add("candidate-feed");

	let editingCandidateId: string | null = null;

	// controla listagem e edição de candidatos
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
			if (managementMode && candidate.id === editingCandidateId) {
				const editForm = CandidateEditForm(candidate, {
					onSave: (data) => {
						const updated = app.updateCandidate(candidate.id, data);

						if (!updated) {
							window.alert("Candidato não encontrado.");
							return;
						}

						editingCandidateId = null;
						renderCandidates();
					},

					onCancel: () => {
						editingCandidateId = null;
						renderCandidates();
					}
				});

				feed.appendChild(editForm);
				return;
			}

			const card = CandidateProfileCard(candidate, {
				onEdit: (candidateId) => {
					editingCandidateId = candidateId;
					renderCandidates();
				},

					onDelete: (candidateId) => {
					const shouldDelete = window.confirm(`Deseja excluir ${candidate.name}?`);

					if (!shouldDelete) return;

						app.removeCandidate(candidateId);
						updateInfoCounters();
						renderCandidates();
					},

					onLike: (candidateId) => {
						changePage(CompanyLikePage(candidateId));
					}
			}, !managementMode);

			feed.appendChild(card);
		});
	}

	renderCandidates();

	section.append(title, feed);

	return section;
}
