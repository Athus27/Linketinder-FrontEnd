import { UserType } from "./../types/UserType";
import { createUserForm } from "../components/UserForm";
import "./RegisterPage.css";

export function RegisterPage(type?: UserType): HTMLElement {
	const section = document.createElement("section");
	section.classList.add("register-page");

	const divForms = document.createElement("div");
	divForms.classList.add("forms-container");

	if (type) {
		divForms.appendChild(createUserForm(type));
	}

	section.appendChild(divForms);

	return section;
}
