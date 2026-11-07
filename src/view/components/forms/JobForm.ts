import { JobService } from "../../../services/JobService";
import { createSkillsInput } from "./UserForm";
import { updateInfoCounters } from "../layout/InfoSection";
import "./JobForm.css";

export function JobForm(jobService: JobService = new JobService()): HTMLFormElement {
  const form = document.createElement("form");
  form.className = "job-form";
  const title = document.createElement("h2");
  title.textContent = "Cadastro de vaga";
  const titleInput = document.createElement("input");
  titleInput.name = "title";
  titleInput.required = true;
  const titleLabel = document.createElement("label");
  titleLabel.textContent = "Título";
  titleLabel.appendChild(titleInput);
  const description = document.createElement("textarea");
  description.name = "description";
  description.required = true;
  const descriptionLabel = document.createElement("label");
  descriptionLabel.textContent = "Descrição";
  descriptionLabel.appendChild(description);
  const location = document.createElement("input");
  location.name = "localVaga";
  location.required = true;
  const locationLabel = document.createElement("label");
  locationLabel.textContent = "Local";
  locationLabel.appendChild(location);
  const submit = document.createElement("button");
  submit.type = "submit";
  submit.textContent = "Cadastrar vaga";
  const message = document.createElement("p");
  message.setAttribute("aria-live", "polite");
  form.append(title, titleLabel, descriptionLabel, locationLabel, createSkillsInput(), submit, message);
  form.addEventListener("submit", (event) => {
    event.preventDefault();
    submit.disabled = true;
    const data = new FormData(form);
    void jobService.cadastrarVaga({
      title: String(data.get("title") ?? ""),
      description: String(data.get("description") ?? ""),
      localVaga: String(data.get("localVaga") ?? ""),
      skills: data.getAll("skills").map(String),
    }).then((created) => {
      if (!created) throw new Error("Cadastro de vaga não confirmado");
      message.textContent = "Vaga cadastrada com sucesso.";
      form.reset();
      void updateInfoCounters();
    }).catch(() => { message.textContent = "Não foi possível cadastrar a vaga."; })
      .finally(() => { submit.disabled = false; });
  });
  return form;
}
