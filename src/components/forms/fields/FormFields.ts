import "./FormFields.css";

export function createEditInputField(idPrefix: string, labelText: string, name: string, value: string, type = "text"): HTMLDivElement {
	const field = document.createElement("div");
	field.classList.add("form-field");

	const label = document.createElement("label");
	const input = document.createElement("input");

	const inputId = `edit-${idPrefix}-${name}`;

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

export function createEditTextareaField(idPrefix: string, labelText: string, name: string, value: string): HTMLDivElement {
	const field = document.createElement("div");
	field.classList.add("form-field");

	const label = document.createElement("label");
	const textarea = document.createElement("textarea");

	const textareaId = `edit-${idPrefix}-${name}`;

	label.htmlFor = textareaId;
	label.textContent = labelText;

	textarea.id = textareaId;
	textarea.name = name;
	textarea.value = value;
	textarea.required = true;

	field.append(label, textarea);
	return field;
}