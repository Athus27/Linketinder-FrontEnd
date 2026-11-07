import type { Company } from "../../models/Company";
import { CompanyProfileCard } from "../components/cards/CompanyProfileCard";
import "./CompanyFeedPage.css";

export function CompanyFeedPage(buscarEmpresas: () => Promise<Company[]>): HTMLElement {
	const section = document.createElement("section");
	section.classList.add("company-feed-page");

	const title = document.createElement("h1");
	title.textContent = "Empresas disponíveis";

	const feed = document.createElement("div");
	feed.classList.add("company-feed");

  async function renderCompanies(): Promise<void> {
    feed.textContent = "Carregando empresas...";
    try {
      const companies = await buscarEmpresas();
      feed.replaceChildren();
      if (companies.length === 0) {
        const emptyMessage = document.createElement("p");
        emptyMessage.classList.add("company-feed-empty");
        emptyMessage.textContent = "Nenhuma empresa cadastrada.";
        feed.appendChild(emptyMessage);
        return;
      }
      companies.forEach((company) => feed.appendChild(CompanyProfileCard(company)));
    } catch (error) {
      feed.textContent = "Não foi possível carregar as empresas. Tente novamente.";
    }
  }

  void renderCompanies();

	section.append(title, feed);

	return section;
}
