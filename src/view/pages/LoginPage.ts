import { LoginController } from "../../controllers/LoginController";
import { LoginService } from "../../services/LoginService";
import type { AuthenticatedUser } from "../../types/UserType";
import "../components/forms/UserForm.css";

export function LoginPage(onAuthenticated: (user: AuthenticatedUser) => void): HTMLElement {
	const section = document.createElement("section");
	section.className = "register-page";
	const form = document.createElement("form");
	form.className = "user-form login-form";

	const title = document.createElement("h2");
	title.textContent = "Entrar no Linketinder";

	const emailLabel = document.createElement("label");
	emailLabel.htmlFor = "login-email";
	emailLabel.textContent = "E-mail";
	const email = document.createElement("input");
	email.id = "login-email";
	email.name = "email";
	email.type = "email";
	email.autocomplete = "username";
	email.required = true;

	const passwordLabel = document.createElement("label");
	passwordLabel.htmlFor = "login-password";
	passwordLabel.textContent = "Senha";
	const password = document.createElement("input");
	password.id = "login-password";
	password.name = "password";
	password.type = "password";
	password.autocomplete = "current-password";
	password.required = true;

	const submit = document.createElement("button");
	submit.type = "submit";
	submit.textContent = "Entrar";
	form.append(title, emailLabel, email, passwordLabel, password, submit);

	form.addEventListener("submit", async (event) => {
		event.preventDefault();
		submit.disabled = true;
		try {
			const user = await new LoginController(new LoginService()).login(email.value, password.value);
			if (!user) {
				window.alert("E-mail ou senha inválidos.");
				return;
			}
			form.reset();
			onAuthenticated(user);
		} catch {
			window.alert("Não foi possível entrar. Verifique se a API está disponível.");
		} finally {
			submit.disabled = false;
		}
	});

	section.appendChild(form);
	return section;
}
