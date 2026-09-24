import { app } from "../main";
import "../components/LikeForm.css";

function createSelect(labelText: string, name: string): HTMLSelectElement {
	const select = document.createElement("select");
	select.id = `company-like-${name}`;
	select.name = name;
	select.required = true;

	const placeholder = document.createElement("option");
	placeholder.value = "";
	placeholder.textContent = `Selecione ${labelText.toLowerCase()}`;
	placeholder.disabled = true;
	placeholder.selected = true;
	select.appendChild(placeholder);

	return select;
}

function createField(labelText: string, select: HTMLSelectElement): HTMLDivElement {
	const field = document.createElement("div");
	field.classList.add("form-field");
	const label = document.createElement("label");
	label.htmlFor = select.id;
	label.textContent = labelText;
	field.append(label, select);
	return field;
}

export function CompanyLikePage(selectedCandidateId?: string): HTMLElement {
	const form = document.createElement("form");
	form.classList.add("like-form");

	const title = document.createElement("h2");
	title.textContent = "Curtir um candidato";

	const message = document.createElement("p");
	message.classList.add("like-form-message");
	message.setAttribute("aria-live", "polite");

	const companies = app.getCompanies();
	const candidates = app.getCandidates();
	const jobs = app.getJobs();

	if (companies.length === 0 || candidates.length === 0 || jobs.length === 0) {
		message.textContent = "Cadastre ao menos uma empresa, uma vaga e um candidato antes de curtir.";
		form.append(title, message);
		return form;
	}

	const companySelect = createSelect("uma empresa", "companyId");
	const jobSelect = createSelect("uma vaga", "jobId");
	const candidateSelect = createSelect("um candidato", "candidateId");
	jobSelect.disabled = true;

	companies.forEach((company) => companySelect.add(new Option(company.name, company.id)));
	candidates.forEach((candidate) => {
		const option = new Option(candidate.name, candidate.id);
		option.selected = candidate.id === selectedCandidateId;
		candidateSelect.add(option);
	});

	companySelect.addEventListener("change", () => {
		jobSelect.replaceChildren();
		const placeholder = new Option("Selecione uma vaga", "", true, true);
		placeholder.disabled = true;
		jobSelect.add(placeholder);

		const companyJobs = jobs.filter((job) => job.companyId === companySelect.value);
		companyJobs.forEach((job) => jobSelect.add(new Option(job.title, job.id)));
		jobSelect.disabled = companyJobs.length === 0;
		message.textContent = companyJobs.length === 0 ? "Essa empresa ainda não possui vagas." : "";
	});

	const submitButton = document.createElement("button");
	submitButton.type = "submit";
	submitButton.textContent = "Curtir candidato";

	form.append(
		title,
		createField("Empresa", companySelect),
		createField("Vaga da empresa", jobSelect),
		createField("Candidato", candidateSelect),
		submitButton,
		message
	);

	form.addEventListener("submit", (event) => {
		event.preventDefault();
		const formData = new FormData(form);
		const result = app.companyLikeCandidate(
			String(formData.get("companyId")),
			String(formData.get("jobId")),
			String(formData.get("candidateId"))
		);

		if (result.status === "match") message.textContent = "Deu match!";
		else if (result.status === "already-liked") message.textContent = "Essa empresa já curtiu o candidato para esta vaga.";
		else if (result.status === "invalid-job") message.textContent = "A vaga selecionada não pertence a essa empresa.";
		else if (result.status === "liked") message.textContent = "Candidato curtido com sucesso.";
		else message.textContent = "Empresa, vaga ou candidato não encontrado.";
	});

	return form;
}
