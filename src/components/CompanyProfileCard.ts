import type { Company } from "../models/Company";
import "./CompanyProfileCard.css";

export function CompanyProfileCard(company: Company): HTMLElement {
	const article = document.createElement("article");
	article.classList.add("company-profile");

	const name = document.createElement("h2");
	name.textContent = company.name;

	const location = document.createElement("p");
	location.textContent = `${company.state} • ${company.country}`;

	const description = document.createElement("p");
	description.textContent = company.description;

	article.append(name, location, description);

	return article;
}
