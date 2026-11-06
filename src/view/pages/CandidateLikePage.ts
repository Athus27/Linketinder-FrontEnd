import "../components/forms/LikeForm.css";
import { JobService } from "../../services/JobService";
import { LikeService } from "../../services/LikeService";
import { ApiError, sharedSessionService } from "../../services/SessionService";

export function CandidateLikePage(
  selectedJobId?: string,
  jobsService: JobService = new JobService(),
  likesService: LikeService = new LikeService(),
): HTMLElement {
  const form = document.createElement("form");
  form.className = "like-form";
  const title = document.createElement("h2");
  title.textContent = "Curtir uma vaga";
  const select = document.createElement("select");
  select.name = "jobId";
  select.required = true;
  const label = document.createElement("label");
  label.textContent = "Vaga";
  label.appendChild(select);
  const message = document.createElement("p");
  message.className = "like-form-message";
  message.setAttribute("aria-live", "polite");
  const submit = document.createElement("button");
  submit.type = "submit";
  submit.textContent = "Curtir vaga";
  submit.disabled = true;
  message.textContent = "Carregando vagas...";
  form.append(title, label, submit, message);
  if (sharedSessionService.getUser()?.type !== "candidate") {
    message.textContent = "Apenas candidatos podem curtir vagas.";
    submit.disabled = true;
    return form;
  }

  void jobsService.getVagas().then((jobs) => {
    select.replaceChildren();
    jobs.forEach((job) => {
      const option = document.createElement("option");
      option.value = job.id;
      option.textContent = job.title;
      option.selected = job.id === selectedJobId;
      select.appendChild(option);
    });
    if (!jobs.length) message.textContent = "Nenhuma vaga disponível.";
    submit.disabled = !jobs.length;
    if (jobs.length) message.textContent = "";
  }).catch(() => { message.textContent = "Não foi possível carregar as vagas."; });

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    submit.disabled = true;
    void likesService.curtir(select.value).then((result) => {
      message.textContent = result.deuMatch ? "Deu match!" :
        result.jaCurtiu ? "Você já curtiu esta vaga." :
          result.sucesso ? "Vaga curtida com sucesso." : "Não foi possível curtir a vaga.";
    }).catch((error: unknown) => {
      message.textContent = error instanceof ApiError && error.status === 401
        ? "Sua sessão expirou. Entre novamente." : "Não foi possível curtir a vaga.";
    }).finally(() => { submit.disabled = false; });
  });
  return form;
}
