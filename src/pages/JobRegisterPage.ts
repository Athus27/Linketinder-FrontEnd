import { app } from "../main";
import { JobForm } from "../components/JobForm";
import "./JobRegisterPage.css";

export function JobRegisterPage(): HTMLElement {
	const section = document.createElement("section");
	section.classList.add("job-register-page");

	const companies = app.getCompanies();

	if (companies.length === 0) {
		const message = document.createElement("p");
		message.classList.add("job-register-empty");
		message.textContent = "Cadastre uma empresa antes de criar uma vaga.";
		section.appendChild(message);
		return section;
	}

	section.appendChild(JobForm(companies));

	return section;
}
