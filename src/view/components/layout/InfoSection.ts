// src/components/InfoSection.ts
import "./InfoSection.css";
import { CompanyService } from "../../../services/CompanyService";
import { CandidateService } from "../../../services/CandidateService";
import { JobService } from "../../../services/JobService";

const companyService = new CompanyService();
const candidateService = new CandidateService();
const jobService = new JobService();
let latestUpdate = 0;

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

export async function updateInfoCounters(): Promise<void> {
 const update = ++latestUpdate;
 const counters = [
  { element: document.querySelector("#company-count"), label: "Empresas cadastradas", load: () => companyService.getEmpresas() },
  { element: document.querySelector("#candidate-count"), label: "Candidatos cadastrados", load: () => candidateService.getCandidatos() },
  { element: document.querySelector("#job-count"), label: "Vagas cadastradas", load: () => jobService.getVagas() },
 ];
 await Promise.all(counters.map(async ({ element, label, load }) => {
  if (!element) return;
  element.textContent = `${label}: carregando...`;
  try {
   const records = await load();
   if (update === latestUpdate) element.textContent = `${label}: ${records.length}`;
  } catch {
   if (update === latestUpdate) element.textContent = `${label}: indisponível`;
  }
 }));
}
