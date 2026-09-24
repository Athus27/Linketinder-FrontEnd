import { UserType } from './../types/UserType';
import { app } from "../main";
import { Candidate } from "../models/Candidate";
import { Company } from "../models/Company";
import { updateInfoCounters } from "./InfoSection";
import "./UserForm.css";



function createInput(labelText: string, name: string, type = "text"): HTMLDivElement {
	const field = document.createElement("div");
	field.classList.add("form-field");

	const label = document.createElement("label");
	label.htmlFor = name;
	label.textContent = labelText;

	const input = document.createElement("input");
	input.id = name;
	input.name = name;
	input.type = type;
	input.placeholder = `Digite seu ${labelText.toLowerCase()}`;
	input.required = true;

	field.append(label, input);

	return field;
}

export function createUserForm(type: UserType): HTMLFormElement {
	const form = document.createElement("form");
	form.classList.add("user-form", `${type}-form`);
	form.dataset.userType = type;

	const title = document.createElement("h2");
	title.textContent = type === "candidate" ? "Cadastro de candidato" : "Cadastro de empresa";

	form.append(
		title,
		createInput("Nome", "name"),
		createInput("E-mail", "email", "email"),
		createInput("Estado", "state"),
		createInput("CEP", "cepCode")
	);

	if (type !== "company") {
		form.appendChild(createSkillsInput());
		form.append(createInput("CPF", "cpf"), createInput("Idade", "age", "number"));
	} else {
		form.append(createInput("CNPJ", "cnpj"), createInput("País", "country"));
	}

	const descriptionField = document.createElement("div");
	descriptionField.classList.add("form-field");

	const descriptionLabel = document.createElement("label");
	descriptionLabel.htmlFor = "description";
	descriptionLabel.textContent = "Descrição";
	descriptionLabel.style.resize = "none";

	const description = document.createElement("textarea");
	description.style.resize = "none";
	description.id = "description";
	description.name = "description";
	description.required = true;

	descriptionField.append(descriptionLabel, description);
	form.appendChild(descriptionField);

	const submitButton = document.createElement("button");
	submitButton.type = "submit";
	submitButton.textContent = "Cadastrar";

	form.appendChild(submitButton);

	form.addEventListener("submit", (event) => {
		event.preventDefault();

		const formData = new FormData(form);

		const name = String(formData.get("name") ?? "");
		const description = String(formData.get("description") ?? "");
		const email = String(formData.get("email") ?? "");
		const state = String(formData.get("state") ?? "");
		const cepCode = String(formData.get("cepCode") ?? "");

		if (type === "candidate") {
			const candidate = new Candidate(
				name,
				String(formData.get("cpf") ?? ""),
				Number(formData.get("age")),
				description,
				email,
				state,
				cepCode,
				formData.getAll("skills").map(String)
			);

			app.addCandidate(candidate);
		} else {
			const company = new Company(
				name,
				String(formData.get("cnpj") ?? ""),
				description,
				email,
				state,
				cepCode,
				String(formData.get("country") ?? "")
			);

			app.addCompany(company);
		}

		updateInfoCounters();
		form.reset();
		window.alert(`${type === "candidate" ? "Candidato" : "Empresa"} cadastrado com sucesso!`);
	});

	return form;
}

/**
 * Cria um campo de entrada para adicionar competências (skills) com a funcionalidade de adicionar e remover tags.
 *
 */
export function createSkillsInput(): HTMLDivElement {
	const field = document.createElement("div");
	field.classList.add("form-field");

	const label = document.createElement("label");
	label.htmlFor = "skills-input";
	label.textContent = "Competências";

	const input = document.createElement("input");
	input.id = "skills-input";
	input.type = "text";
	input.placeholder = "Digite uma competência e pressione Enter";

	const tagsContainer = document.createElement("div");
	tagsContainer.classList.add("skills-tags");

	//Array de comps
	const skills: string[] = [];

	function renderSkills(): void {
		tagsContainer.replaceChildren();

		skills.forEach((skill, index) => {
			const tag = document.createElement("span");
			tag.classList.add("skill-tag");
			tag.textContent = skill;

			const removeButton = document.createElement("button");
			removeButton.classList.add("remove-skill");
			removeButton.type = "button";
			removeButton.textContent = "×";

			removeButton.addEventListener("click", () => {
				skills.splice(index, 1);
				renderSkills();
			});

			// Permite recuperar as competências com FormData.getAll("skills")
			const hiddenInput = document.createElement("input");
			hiddenInput.type = "hidden";
			hiddenInput.name = "skills";
			hiddenInput.value = skill;

			tag.appendChild(removeButton);
			tagsContainer.append(tag, hiddenInput);
		});
	}

	input.addEventListener("keydown", (event) => {
		if (event.key !== "Enter") return;

		event.preventDefault();

		const skill = input.value.trim();

		if (!skill || skills.includes(skill)) return;

		skills.push(skill);
		input.value = "";

		renderSkills();
	});

	field.append(label, input, tagsContainer);

	return field;
}
