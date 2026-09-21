export function CandidateRegisterPage(): HTMLElement {
	const section = document.createElement("section");
	section.classList.add("candidate-register-page");

	const title = document.createElement("h1");
	title.textContent = "Cadastro de candidato";

	section.appendChild(title);

	return section;
}