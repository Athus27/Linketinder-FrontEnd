import { app } from "../main";
import "../components/LikeForm.css";

function createSelectField(
	labelText: string,
	name: string,
	options: Array<{ id: string; label: string }>,
	selectedId?: string
): HTMLDivElement {
	const field = document.createElement("div");
	field.classList.add("form-field");

	const label = document.createElement("label");
	label.htmlFor = `candidate-like-${name}`;
	label.textContent = labelText;

	const select = document.createElement("select");
	select.id = `candidate-like-${name}`;
	select.name = name;
	select.required = true;

	const placeholder = document.createElement("option");
	placeholder.value = "";
	placeholder.textContent = `Selecione ${labelText.toLowerCase()}`;
	placeholder.disabled = true;
	placeholder.selected = !selectedId;
	select.appendChild(placeholder);

	options.forEach((item) => {
		const option = document.createElement("option");
		option.value = item.id;
		option.textContent = item.label;
		option.selected = item.id === selectedId;
		select.appendChild(option);
	});

	field.append(label, select);
	return field;
}

export function CandidateLikePage(selectedJobId?: string): HTMLElement {
	const form = document.createElement("form");
	form.classList.add("like-form");

	const title = document.createElement("h2");
	title.textContent = "Curtir uma vaga";

	const message = document.createElement("p");
	message.classList.add("like-form-message");
	message.setAttribute("aria-live", "polite");

	const candidates = app.getCandidates();
	const jobs = app.getJobs();

	if (candidates.length === 0 || jobs.length === 0) {
		message.textContent = "Cadastre ao menos um candidato e uma vaga antes de curtir.";
		form.append(title, message);
		return form;
	}

	const submitButton = document.createElement("button");
	submitButton.type = "submit";
	submitButton.textContent = "Curtir vaga";

	form.append(
		title,
		createSelectField("Candidato", "candidateId", candidates.map((candidate) => ({ id: candidate.id, label: candidate.name }))),
		createSelectField("Vaga", "jobId", jobs.map((job) => ({ id: job.id, label: job.title })), selectedJobId),
		submitButton,
		message
	);

	form.addEventListener("submit", (event) => {
		event.preventDefault();
		const formData = new FormData(form);
		const result = app.candidateLikeJob(String(formData.get("candidateId")), String(formData.get("jobId")));

		if (result.status === "match") message.textContent = "Deu match!";
		else if (result.status === "already-liked") message.textContent = "Esse candidato já curtiu esta vaga.";
		else if (result.status === "liked") message.textContent = "Vaga curtida com sucesso.";
		else message.textContent = "Candidato ou vaga não encontrado.";
	});

	return form;
}
