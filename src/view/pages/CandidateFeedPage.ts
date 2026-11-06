import {app} from "../../main";
import {CandidateProfileCard} from "../components/cards/CandidateProfileCard";
import {CandidateEditForm} from "../components/forms/CandidateEditForm";
import {updateInfoCounters} from "../components/layout/InfoSection";
import "./CandidateFeedPage.css";
import {CompanyLikePage} from "./CompanyLikePage";
import {changePage} from "../../renderAll";

import type {Candidate} from "../../models/Candidate";

export function CandidateFeedPage(
  buscarCandidatos: () => Promise<Candidate[]>,
  managementMode = false,
  remoteManagement = false,
  excluirCandidato?: (candidateId: string) => Promise<boolean>
): HTMLElement {
  const section = document.createElement("section");
  section.classList.add("candidate-feed-page");

  const title = document.createElement("h1");
  title.textContent = managementMode ? "Gerenciar candidatos" : "Candidatos disponíveis";

  const feed = document.createElement("div");
  feed.classList.add("candidate-feed");

  let editingCandidateId: string | null = null;

  // controla listagem e edição de candidatos
  async function renderCandidates(): Promise<void> {
    feed.replaceChildren();

    const candidates = await buscarCandidatos()

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
          if (remoteManagement) {
            window.alert("A edição de candidatos da API ainda não está integrada.");
            return;
          }
          editingCandidateId = candidateId;
          renderCandidates();
        },

        onDelete: (candidateId) => {
          const shouldDelete = window.confirm(`Deseja excluir ${candidate.name}?`);

          if (!shouldDelete) return;

          if (remoteManagement) {
            if (!excluirCandidato) {
              window.alert("A exclusão de candidatos da API ainda não está integrada.");
              return;
            }

            void excluirCandidato(candidateId).then((deleted) => {
              if (!deleted) {
                window.alert("Não foi possível excluir o candidato. Tente novamente.");
                return;
              }

              return renderCandidates();
            }).catch((error) => {
              console.error("Candidato excluído, mas não foi possível atualizar a lista:", error);
              feed.textContent = "Candidato excluído, mas não foi possível atualizar a lista.";
            });
            return;
          }

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
