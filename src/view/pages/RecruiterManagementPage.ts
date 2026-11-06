import { RecruiterService } from "../../services/RecruiterService";
import { ApiError, sharedSessionService } from "../../services/SessionService";
import type { CreateRecruiterInput, RecruiterResponse } from "../../types/RecruiterResponse";

export function RecruiterManagementPage(service: RecruiterService = new RecruiterService()): HTMLElement {
  const section = document.createElement("section");
  section.className = "recruiter-management-page";
  const title = document.createElement("h1");
  title.textContent = "Gestão de recrutadores";
  const form = document.createElement("form");
  const fields: Record<keyof CreateRecruiterInput, HTMLInputElement | HTMLTextAreaElement> = {
    name: input("Nome", "text", 120), area: input("Área", "text", 100), description: textarea("Descrição", 2000),
    email: input("E-mail", "email"), cpf: input("CPF"), birthDate: input("Nascimento", "date"),
    password: input("Senha", "password"),
  };
  Object.entries(fields).forEach(([name, element]) => {
    element.name = name;
    element.className = "form-control";
    const label = document.createElement("label");
    label.className = "form-field";
    label.textContent = name === "birthDate" ? "Nascimento" : element.getAttribute("aria-label") ?? name;
    label.appendChild(element);
    form.appendChild(label);
  });
  const submit = document.createElement("button");
  submit.type = "submit";
  submit.textContent = "Criar recrutador";
  const status = document.createElement("p");
  status.setAttribute("aria-live", "polite");
  const list = document.createElement("div");
  list.className = "recruiter-list";
  form.append(submit, status);
  section.append(title, form, list);
  if (sharedSessionService.getUser()?.type !== "company") {
    form.hidden = true;
    list.textContent = "Apenas empresas podem gerenciar recrutadores.";
    return section;
  }

  const render = (items: RecruiterResponse[]): void => {
    list.replaceChildren();
    if (!items.length) { list.textContent = "Nenhum recrutador cadastrado."; return; }
    items.forEach((item) => {
      const card = document.createElement("article");
      const text = document.createElement("p");
      text.textContent = `${item.nome} - ${item.email} - ${item.area} - ${item.descricao} - ${item.ativo ? "Ativo" : "Inativo"}`;
      card.appendChild(text);
      if (item.ativo) {
        const deactivate = document.createElement("button");
        deactivate.type = "button";
        deactivate.textContent = "Desativar";
        deactivate.addEventListener("click", () => {
          if (!window.confirm("Desativar este recrutador?")) return;
          void service.desativar(item.id).then((deactivated) => {
            if (!deactivated) throw new Error("Desativação não confirmada");
            return load();
          }).catch(() => { status.textContent = "Não foi possível desativar."; });
        });
        card.appendChild(deactivate);
      }
      list.appendChild(card);
    });
  };
  const load = async (): Promise<void> => {
    list.textContent = "Carregando recrutadores...";
    try { render(await service.listar()); }
    catch { list.textContent = "Não foi possível carregar recrutadores."; }
  };
  form.addEventListener("submit", (event) => {
    event.preventDefault();
    submit.disabled = true;
    const inputData = Object.fromEntries(
      (Object.keys(fields) as Array<keyof CreateRecruiterInput>).map((key) => [key, fields[key].value]),
    ) as unknown as CreateRecruiterInput;
    void service.criar(inputData).then(() => {
      status.textContent = "Recrutador criado com sucesso.";
      form.reset();
      fields.cpf.value = "";
      fields.password.value = "";
      return load();
    }).catch((error: unknown) => {
      status.textContent = error instanceof ApiError && error.status === 409
        ? "E-mail ou CPF já cadastrado." : "Não foi possível criar o recrutador.";
    }).finally(() => { submit.disabled = false; });
  });
  void load();
  return section;
}

function input(label: string, type = "text", maxLength?: number): HTMLInputElement {
  const element = document.createElement("input");
  element.type = type;
  element.setAttribute("aria-label", label);
  element.required = true;
  if (maxLength) element.maxLength = maxLength;
  if (type === "password") element.minLength = 8;
  return element;
}
function textarea(label: string, maxLength?: number): HTMLTextAreaElement {
  const element = document.createElement("textarea");
  element.setAttribute("aria-label", label);
  element.required = true;
  if (maxLength) element.maxLength = maxLength;
  return element;
}
