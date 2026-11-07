import { UserType } from "../../../types/UserType";
import { CandidateController } from "../../../controllers/CandidateController";
import { CandidateService } from "../../../services/CandidateService";
import { CompanyController } from "../../../controllers/CompanyController";
import { CompanyService } from "../../../services/CompanyService";
import { updateInfoCounters } from "../layout/InfoSection";
import "./fields/FormFields.css";
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
		form.append(createInput("Sobrenome", "surname"), createInput("País", "country"));
		const passwordField = createInput("Senha", "password", "password");
		const passwordInput = passwordField.querySelector("input")!;
		passwordInput.minLength = 6;
		passwordInput.autocomplete = "new-password";
		form.appendChild(passwordField);
		form.appendChild(createSkillsInput());
		form.append(createInput("CPF", "cpf"), createInput("Data de nascimento", "birthDate", "date"));
	} else {
		form.append(createInput("CNPJ", "cnpj"), createInput("País", "country"));
		const passwordField = createInput("Senha", "password", "password");
		const passwordInput = passwordField.querySelector("input")!;
		passwordInput.minLength = 6;
		passwordInput.autocomplete = "new-password";
		form.appendChild(passwordField);
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

	form.addEventListener("submit", async (event) => {
		event.preventDefault();

		const formData = new FormData(form);

		const name = String(formData.get("name") ?? "");
		const description = String(formData.get("description") ?? "");
		const email = String(formData.get("email") ?? "");
		const state = String(formData.get("state") ?? "");
		const cepCode = String(formData.get("cepCode") ?? "");

		if (type === "candidate") {
			submitButton.disabled = true;
			try {
				const controller = new CandidateController(new CandidateService());
				const cadastrado = await controller.cadastrarCandidato({
					name,
					surname: String(formData.get("surname") ?? ""),
					country: String(formData.get("country") ?? ""),
					password: String(formData.get("password") ?? ""),
					cpf: String(formData.get("cpf") ?? ""),
					birthDate: String(formData.get("birthDate") ?? ""),
					description,
					email,
					state,
					cepCode,
					skills: formData.getAll("skills").map(String),
				});
				if (!cadastrado) {
					window.alert("Não foi possível cadastrar o candidato. Confira os dados e tente novamente.");
					return;
				}
			} finally {
				submitButton.disabled = false;
			}
		} else {
			submitButton.disabled = true;
			try {
				const controller = new CompanyController(new CompanyService());
				const cadastrada = await controller.cadastrarEmpresa({
					name,
					cnpj: String(formData.get("cnpj") ?? ""),
					description,
					email,
					password: String(formData.get("password") ?? ""),
					state,
					cepCode,
					country: String(formData.get("country") ?? ""),
				});
				if (!cadastrada) {
					window.alert("Não foi possível cadastrar a empresa. Confira os dados e tente novamente.");
					return;
				}
			} catch {
				window.alert("Não foi possível conectar à API para cadastrar a empresa.");
				return;
			} finally {
				submitButton.disabled = false;
			}
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
