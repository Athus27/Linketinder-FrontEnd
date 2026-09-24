// src/components/InfoSection.ts
import "./InfoSection.css";
import { app } from "../main";

export function InfoSection(): HTMLElement {
	const section = document.createElement("section");
	section.classList.add("info-section");

	const title = document.createElement("h2");
	title.textContent = "Info";

	const companyCounter = document.createElement("div");
	companyCounter.id = "company-count";

	const candidateCounter = document.createElement("div");
	candidateCounter.id = "candidate-count";

	const jobCounter = document.createElement("div");
	jobCounter.id = "job-count";

	section.append(title, companyCounter, candidateCounter, jobCounter);

	// Preenche os valores iniciais depois que a seção entrar no DOM
	queueMicrotask(updateInfoCounters);

	return section;
}

export function updateInfoCounters(): void {
	const companyCounter = document.querySelector("#company-count");
	const candidateCounter = document.querySelector("#candidate-count");
	const jobCounter = document.querySelector("#job-count");

	if (companyCounter) {
		companyCounter.textContent =
			`Empresas cadastradas: ${app.getCompanies().length}`;
	}

	if (candidateCounter) {
		candidateCounter.textContent =
			`Candidatos cadastrados: ${app.getCandidates().length}`;
	}

	if (jobCounter) {
		jobCounter.textContent =
			`Vagas cadastradas: ${app.getJobs().length}`;
	}
}
