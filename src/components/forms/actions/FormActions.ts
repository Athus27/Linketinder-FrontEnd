export function createEditFormActions(
	onCancel: () => void,
	className: string
): HTMLDivElement {
	const container = document.createElement("div");
	container.classList.add(className);

	const saveButton = document.createElement("button");
	saveButton.type = "submit";
	saveButton.textContent = "Salvar";

	const cancelButton = document.createElement("button");
	cancelButton.type = "button";
	cancelButton.textContent = "Cancelar";
	cancelButton.addEventListener("click", onCancel);

	container.append(saveButton, cancelButton);
	return container;
}
