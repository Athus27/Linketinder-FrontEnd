import { JobForm } from "../components/forms/JobForm";
import { sharedSessionService } from "../../services/SessionService";

export function JobRegisterPage(): HTMLElement {
  const section = document.createElement("section");
  section.className = "job-register-page";
  if (sharedSessionService.getUser()?.type !== "company") {
    section.textContent = "Apenas empresas podem cadastrar vagas.";
    return section;
  }
  section.appendChild(JobForm());
  return section;
}
