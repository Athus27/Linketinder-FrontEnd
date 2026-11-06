import "../components/forms/LikeForm.css";
import { JobService } from "../../services/JobService";
import { CandidateService } from "../../services/CandidateService";
import { LikeService } from "../../services/LikeService";
import { sharedSessionService } from "../../services/SessionService";

export function CompanyLikePage(
  selectedCandidateId?: string,
  jobsService: JobService = new JobService(),
  candidatesService: CandidateService = new CandidateService(),
  likesService: LikeService = new LikeService(),
): HTMLElement {
  const form = document.createElement("form");
  form.className = "like-form";
  const title = document.createElement("h2");
  title.textContent = "Curtir um candidato";
  const job = document.createElement("select");
  job.name = "jobId";
  const candidate = document.createElement("select");
  candidate.name = "candidateId";
  const message = document.createElement("p");
  message.className = "like-form-message";
  message.setAttribute("aria-live", "polite");
  const submit = document.createElement("button");
  submit.type = "submit";
  submit.textContent = "Curtir candidato";
  const jobLabel = document.createElement("label");
  jobLabel.textContent = "Vaga da empresa";
  jobLabel.appendChild(job);
  const candidateLabel = document.createElement("label");
  candidateLabel.textContent = "Candidato";
  candidateLabel.appendChild(candidate);
  job.required = true;
  candidate.required = true;
  submit.disabled = true;
  message.textContent = "Carregando vagas e candidatos...";
  form.append(title, jobLabel, candidateLabel, submit, message);
  const role = sharedSessionService.getUser()?.type;
  if (role !== "company" && role !== "recruiter") {
    message.textContent = "Apenas empresa ou recrutador pode curtir candidatos.";
    submit.disabled = true;
    return form;
  }

  Promise.all([jobsService.getVagas(true), candidatesService.getCandidatos()]).then(([jobs, candidates]) => {
    jobs.forEach((item) => {
      const option = document.createElement("option");
      option.value = item.id;
      option.textContent = item.title;
      job.appendChild(option);
    });
    candidates.forEach((item) => {
      const option = document.createElement("option");
      option.value = item.id;
      option.textContent = "Perfil de candidato";
      option.textContent = `Candidato #${item.id}`;
      option.selected = item.id === selectedCandidateId;
      candidate.appendChild(option);
    });
    submit.disabled = !jobs.length || !candidates.length;
    if (!jobs.length || !candidates.length) message.textContent = "Nenhuma vaga ou candidato disponível.";
    else message.textContent = "";
  }).catch(() => { message.textContent = "Não foi possível carregar os dados."; });

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    submit.disabled = true;
    void likesService.curtir(job.value, candidate.value).then((result) => {
      message.textContent = result.deuMatch ? "Deu match!" :
        result.jaCurtiu ? "A empresa já curtiu este candidato para esta vaga." :
          result.sucesso ? "Candidato curtido com sucesso." : "Não foi possível curtir o candidato.";
    }).catch(() => { message.textContent = "Não foi possível curtir o candidato."; })
      .finally(() => { submit.disabled = false; });
  });
  return form;
}
