import { UserType } from "./../types/UserType";
import { InfoSection } from "../components/InfoSection";
import { createUserForm } from "../components/UserForm";
import "./RegisterPage.css";

export function RegisterPage(type?: UserType): HTMLElement {
	const section = document.createElement("section");
	section.classList.add("register-page");

	section.appendChild(InfoSection());

	const divForms = document.createElement("div");
	divForms.classList.add("forms-container");

	// divForms.appendChild(createUserForm(type));
	if (type) {
		divForms.appendChild(createUserForm(type));
	}
	else{
		section.innerHTML=``;
	}
	section.appendChild(divForms);

	return section;
}
