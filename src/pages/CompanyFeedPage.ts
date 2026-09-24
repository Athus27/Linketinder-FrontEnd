import { app } from "../main";
import { CompanyProfileCard } from "../components/CompanyProfileCard";
import "./CompanyFeedPage.css";

export function CompanyFeedPage(): HTMLElement {
	const section = document.createElement("section");
	section.classList.add("company-feed-page");

	const title = document.createElement("h1");
	title.textContent = "Empresas disponíveis";

	const feed = document.createElement("div");
	feed.classList.add("company-feed");

	const companies = app.getCompanies();

	if (companies.length === 0) {
		const emptyMessage = document.createElement("p");
		emptyMessage.classList.add("company-feed-empty");
		emptyMessage.textContent = "Nenhuma empresa cadastrada.";

		feed.appendChild(emptyMessage);
	} else {
		companies.forEach((company) => {
			feed.appendChild(CompanyProfileCard(company));
		});
	}

	section.append(title, feed);

	return section;
}
