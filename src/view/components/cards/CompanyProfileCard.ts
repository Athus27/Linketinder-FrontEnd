import type { Company } from "../../../models/Company";
import "./CompanyProfileCard.css";

export function CompanyProfileCard(company: Company, matched = false): HTMLElement {
	const article = document.createElement("article");
	article.classList.add("company-profile");

	const name = document.createElement("h2");
	name.textContent = matched ? company.name : "Empresa";

	const description = document.createElement("p");
	description.textContent = matched ? company.description : "";
	const email = document.createElement("p");
	email.textContent = matched ? company.email : "";

	article.append(name);
	if (matched) article.append(description, email);

	return article;
}
