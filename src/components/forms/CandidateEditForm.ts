import type { Candidate } from "../../models/Candidate";
import type { CreateCandidateInput } from "../../types/EntityInputs";
import { createEditInputField, createEditTextareaField } from "./fields/FormFields";
import { createEditFormActions } from "./actions/FormActions";

import "./CandidateEditForm.css";

interface CandidateEditFormActions {
	onSave: (data: CreateCandidateInput) => void;
	onCancel: () => void;
}

export function CandidateEditForm(candidate: Candidate, actions: CandidateEditFormActions): HTMLFormElement {
	const form = document.createElement("form");
	form.classList.add("candidate-edit-form");

	const title = document.createElement("h2");
	title.textContent = `Editar ${candidate.name}`;

	form.append(
		title,
		createEditInputField(candidate.id, "Nome", "name", candidate.name),
		createEditInputField(candidate.id, "E-mail", "email", candidate.email, "email"),
		createEditInputField(candidate.id, "Estado", "state", candidate.state),
		createEditInputField(candidate.id, "CEP", "cepCode", candidate.cepCode),
		createEditInputField(candidate.id, "CPF", "cpf", candidate.cpf),
		createEditInputField(candidate.id, "Idade", "age", String(candidate.age), "number"),
		createEditInputField(candidate.id, "Competências separadas por vírgula", "skills", candidate.skills.join(", ")),
		createEditTextareaField(candidate.id, "Descrição", "description", candidate.description)
	);

	form.append(createEditFormActions(actions.onCancel, "candidate-edit-actions"));

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
