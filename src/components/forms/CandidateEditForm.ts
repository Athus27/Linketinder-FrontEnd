import type { Candidate } from "../../models/Candidate";
import type { CreateCandidateInput } from "../../types/EntityInputs";
import "./CandidateEditForm.css";

interface CandidateEditFormActions {
	onSave: (data: CreateCandidateInput) => void;
	onCancel: () => void;
}

function createInputField(candidateId: string, labelText: string, name: string, value: string, type = "text"): HTMLDivElement {
	const field = document.createElement("div");
	field.classList.add("form-field");

	const label = document.createElement("label");
	const input = document.createElement("input");

	const inputId = `edit-${candidateId}-${name}`;

	label.htmlFor = inputId;
	label.textContent = labelText;

	input.id = inputId;
	input.name = name;
	input.type = type;
	input.value = value;
	input.required = true;

	field.append(label, input);

	return field;
}

function createTextareaField(candidateId: string, labelText: string, name: string, value: string): HTMLDivElement {
	const field = document.createElement("div");
	field.classList.add("form-field");

	const label = document.createElement("label");
	const textarea = document.createElement("textarea");

	const textareaId = `edit-${candidateId}-${name}`;

	label.htmlFor = textareaId;
	label.textContent = labelText;

	textarea.id = textareaId;
	textarea.name = name;
	textarea.value = value;
	textarea.required = true;

	field.append(label, textarea);
	return field;
}

export function CandidateEditForm(candidate: Candidate, actions: CandidateEditFormActions): HTMLFormElement {
	const form = document.createElement("form");
	form.classList.add("candidate-edit-form");

	const title = document.createElement("h2");
	title.textContent = `Editar ${candidate.name}`;

	form.append(
		title,
		createInputField(candidate.id, "Nome", "name", candidate.name),
		createInputField(candidate.id, "E-mail", "email", candidate.email, "email"),
		createInputField(candidate.id, "Estado", "state", candidate.state),
		createInputField(candidate.id, "CEP", "cepCode", candidate.cepCode),
		createInputField(candidate.id, "CPF", "cpf", candidate.cpf),
		createInputField(candidate.id, "Idade", "age", String(candidate.age), "number"),
		createInputField(candidate.id, "Competências separadas por vírgula", "skills", candidate.skills.join(", ")),
		createTextareaField(candidate.id, "Descrição", "description", candidate.description)
	);

	const actionsContainer = document.createElement("div");
	actionsContainer.classList.add("candidate-edit-actions");

	const saveButton = document.createElement("button");
	saveButton.type = "submit";
	saveButton.textContent = "Salvar";

	const cancelButton = document.createElement("button");
	cancelButton.type = "button";
	cancelButton.textContent = "Cancelar";

	cancelButton.addEventListener("click", actions.onCancel);

	actionsContainer.append(saveButton, cancelButton);
	form.append(actionsContainer);

	form.addEventListener("submit", (event) => {
		event.preventDefault();

		const formData = new FormData(form);

		const skills = String(formData.get("skills") ?? "")
			.split(",")
			.map((skill) => skill.trim())
			.filter(Boolean);

		actions.onSave({
			name: String(formData.get("name") ?? ""),
			email: String(formData.get("email") ?? ""),
			state: String(formData.get("state") ?? ""),
			cepCode: String(formData.get("cepCode") ?? ""),
			cpf: String(formData.get("cpf") ?? ""),
			age: Number(formData.get("age")),
			description: String(formData.get("description") ?? ""),
			skills
		});
	});

	return form;
}
