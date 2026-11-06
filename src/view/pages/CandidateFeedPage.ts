import { CandidateProfileCard } from "../components/cards/CandidateProfileCard";
import type { Candidate } from "../../models/Candidate";
import { sharedSessionService } from "../../services/SessionService";
import { CompanyLikePage } from "./CompanyLikePage";
import { changePage } from "../../renderAll";
import "./CandidateFeedPage.css";

export function CandidateFeedPage(
  buscarCandidatos: () => Promise<Candidate[]>,
  ownProfile = false,
  _remoteManagement = true,
  excluirCandidato?: (id: string) => Promise<boolean>,
  onOwnProfileDeleted?: () => void,
): HTMLElement {
  const section = document.createElement("section");
  section.className = "candidate-feed-page";
  const title = document.createElement("h1");
  title.textContent = ownProfile ? "Meu perfil" : "Candidatos disponíveis";
  const feed = document.createElement("div");
  feed.className = "candidate-feed";
  section.append(title, feed);
  feed.textContent = "Carregando candidatos...";
  void buscarCandidatos().then((candidates) => {
    const ownId = sharedSessionService.getUser()?.id;
    const visible = ownProfile ? candidates.filter((candidate) => candidate.id === ownId) : candidates;
    feed.replaceChildren();
    if (!visible.length) {
      feed.textContent = ownProfile ? "Perfil não encontrado." : "Nenhum candidato cadastrado.";
      return;
    }
    visible.forEach((candidate) => {
      const contactAllowed = Boolean(candidate.name && candidate.email);
      feed.appendChild(CandidateProfileCard(candidate, {
      ...(ownProfile ? {
        onDelete: (id: string) => {
        if (!excluirCandidato || !window.confirm("Deseja excluir seu perfil?")) return;
        void excluirCandidato(id).then((deleted) => {
          if (!deleted) throw new Error("Exclusão não confirmada");
          sharedSessionService.clear();
          feed.textContent = "Perfil excluído.";
          onOwnProfileDeleted?.();
        }).catch(() => { feed.textContent = "Não foi possível excluir o perfil."; });
        },
      } : {}),
      ...(!ownProfile ? { onLike: (id: string) => changePage(CompanyLikePage(id)) } : {}),
      }, ownProfile ? false : !contactAllowed));
    });
  }).catch(() => { feed.textContent = "Não foi possível carregar os candidatos."; });
  return section;
}
