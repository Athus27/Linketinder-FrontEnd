import type { Job } from "../../models/Job";
import { JobProfileCard } from "../components/cards/JobProfileCard";
import "./JobFeedPage.css";

export function JobFeedPage(
  buscarVagas: () => Promise<Job[]>,
  _remoteManagement = true,
  onLike?: (id: string) => void,
): HTMLElement {
  const section = document.createElement("section");
  section.className = "job-feed-page";
  const title = document.createElement("h1");
  title.textContent = "Vagas disponíveis";
  if (!onLike) {
    const limitation = document.createElement("p");
    limitation.textContent = "Edição e exclusão de vagas não estão disponíveis nesta etapa.";
    section.appendChild(limitation);
  }
  const feed = document.createElement("div");
  feed.className = "job-feed";
  section.append(title, feed);
  feed.textContent = "Carregando vagas...";
  void buscarVagas().then((jobs) => {
    feed.replaceChildren();
    if (!jobs.length) {
      feed.textContent = "Nenhuma vaga cadastrada.";
      return;
    }
    jobs.forEach((job) => feed.appendChild(JobProfileCard(job, {
      onEdit: () => { /* edição fora do escopo da T5 */ },
      onDelete: () => { /* exclusão fora do escopo da T5 */ },
      onLike: (id) => onLike?.(id),
    }, onLike ? "like" : "none")));
  }).catch(() => { feed.textContent = "Não foi possível carregar as vagas. Tente novamente."; });
  return section;
}
