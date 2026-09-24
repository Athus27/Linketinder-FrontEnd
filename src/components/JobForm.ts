import { app } from "../main";
import type { Company } from "../models/Company";
import { Job } from "../models/Job";
import { updateInfoCounters } from "./InfoSection";
import { createSkillsInput } from "./UserForm";
import "./JobForm.css";

function createInput(labelText: string, name: string): HTMLDivElement {
	const field = document.createElement("div");
	field.classList.add("form-field");

	const label = document.createElement("label");
	label.htmlFor = `job-${name}`;
	label.textContent = labelText;

	const input = document.createElement("input");
	input.id = `job-${name}`;
	input.name = name;
	input.required = true;

	field.append(label, input);

	return field;
}

function createCompanySelect(companies: Company[]): HTMLDivElement {
	const field = document.createElement("div");
	field.classList.add("form-field");

	const label = document.createElement("label");
	label.htmlFor = "job-company";
	label.textContent = "Empresa";

	const select = document.createElement("select");
	select.id = "job-company";
	select.name = "companyId";
	select.required = true;

	const placeholder = document.createElement("option");
	placeholder.value = "";
	placeholder.textContent = "Selecione uma empresa";
	placeholder.disabled = true;
	placeholder.selected = true;

	select.appendChild(placeholder);

	companies.forEach((company) => {
		const option = document.createElement("option");
		option.value = company.id;
		option.textContent = company.name;
		select.appendChild(option);
	});

	field.append(label, select);

	return field;
}

export function JobForm(companies: Company[]): HTMLFormElement {
	const form = document.createElement("form");
	form.classList.add("job-form");

	const title = document.createElement("h2");
	title.textContent = "Cadastro de vaga";

	const descriptionField = document.createElement("div");
	descriptionField.classList.add("form-field");

	const descriptionLabel = document.createElement("label");
	descriptionLabel.htmlFor = "job-description";
	descriptionLabel.textContent = "Descrição";

	const description = document.createElement("textarea");
	description.id = "job-description";
	description.name = "description";
	description.required = true;

	descriptionField.append(descriptionLabel, description);

	const submitButton = document.createElement("button");
	submitButton.type = "submit";
	submitButton.textContent = "Cadastrar vaga";

	form.append(
		title,
		createCompanySelect(companies),
		createInput("Título", "title"),
		descriptionField,
		createSkillsInput(),
		submitButton
	);

	form.addEventListener("submit", (event) => {
		event.preventDefault();

		const formData = new FormData(form);
		const job = new Job(
			String(formData.get("title") ?? ""),
			String(formData.get("description") ?? ""),
			String(formData.get("companyId") ?? ""),
			formData.getAll("skills").map(String)
		);

		if (!app.addJob(job)) {
			window.alert("A empresa selecionada não existe.");
			return;
		}

		updateInfoCounters();
		window.alert("Vaga cadastrada com sucesso!");
		form.replaceWith(JobForm(companies));
	});

	return form;
}
