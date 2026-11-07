import { MatchService } from "../../services/MatchService";

export function MatchesPage(service: MatchService = new MatchService()): HTMLElement {
  const section = document.createElement("section");
  const title = document.createElement("h1");
  title.textContent = "Matches";
  const list = document.createElement("div");
  list.textContent = "Carregando matches...";
  section.append(title, list);
  void service.listar().then((matches) => {
    list.replaceChildren();
    if (!matches.length) { list.textContent = "Nenhum match encontrado."; return; }
    matches.forEach((match) => {
      const item = document.createElement("article");
      const date = match.dataMatch ? new Date(match.dataMatch).toISOString() : "Data não registrada";
      const contact = match.candidato?.nome
        ? `${match.candidato.nome}${match.candidato.email ? ` - ${match.candidato.email}` : ""}`
        : match.empresa?.nome ? `${match.empresa.nome}${match.empresa.email ? ` - ${match.empresa.email}` : ""}` : "Contato liberado";
      item.textContent = `${contact} | Vaga #${match.idVaga} | ${date}`;
      list.appendChild(item);
    });
  }).catch(() => { list.textContent = "Não foi possível carregar os matches."; });
  return section;
}
