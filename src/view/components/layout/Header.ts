import "./Header.css";
import type { AuthenticatedUser } from "../../../types/UserType";

export interface HeaderActions {
  onCreateCandidate: () => void;
  onCreateCompany: () => void;
  onCreateJob: () => void;
  onViewCandidates: () => void;
  onManageCandidates: () => void;
  onViewCompanies: () => void;
  onViewJobs: () => void;
  onViewCompetenceGraph: () => void;
  onCandidateLike: () => void;
  onCompanyLike: () => void;
  onManageRecruiters: () => void;
  onMatches: () => void;
  onMenuToggle: (isOpen: boolean) => void;
  onLogin: () => void;
  onLogout: () => void;
}

export function Header(actions: HeaderActions, user: AuthenticatedUser | null = null): HTMLElement {
  const section = document.createElement("section");
  section.className = "header";
  section.innerHTML = `
    <div class="header-row">
      <h1>Linketinder</h1>
      <div class="header-account">
        <span id="account-label"></span>
        <button id="login-button" type="button">Entrar</button>
        <button id="logout-button" type="button" hidden>Sair</button>
      </div>
      <button id="menu-open-button" type="button" aria-expanded="false"><img src="/assets/icons/menu.svg" alt="Abrir menu">Menu</button>
    </div>
    <div class="header-options" hidden>
      <button id="menu-view-company-button" type="button" aria-expanded="false"><img src="/assets/icons/company.svg" alt="Empresa">Menu da Empresa</button>
      <button id="menu-view-candidate-button" type="button" aria-expanded="false"><img src="/assets/icons/candidate.svg" alt="Candidato">Menu do Candidato</button>
      <button id="menu-view-recruiter-button" type="button">Menu do Recrutador</button>
      <button id="menu-view-competence-graph-button" type="button"><img src="/assets/icons/competence.svg" alt="Competências">Gráfico de Competências</button>
    </div>
    <div id="company-submenu" class="header-row submenu" hidden>
      <button id="create-job-button" type="button">Cadastrar vaga</button>
      <button id="manage-jobs-button" type="button">Gerenciar vagas</button>
      <button id="view-companies-button" type="button">Visualizar empresas</button>
      <button id="view-candidates-button" type="button">Visualizar candidatos</button>
      <button id="company-like-button" type="button">Curtir candidato</button>
      <button id="company-matches-button" type="button">Matches</button>
      <button id="manage-recruiters-button" type="button">Gestão de recrutadores</button>
    </div>
    <div id="candidate-submenu" class="header-row submenu" hidden>
      <button id="candidate-feed-button" type="button">Visualizar vagas</button>
      <button id="candidate-like-button" type="button">Curtir vaga</button>
      <button id="candidate-matches-button" type="button">Matches</button>
      <button id="manage-candidates-button" type="button">Meu perfil</button>
    </div>
    <div id="recruiter-submenu" class="header-row submenu" hidden>
      <button id="recruiter-jobs-button" type="button">Vagas da própria empresa</button>
      <button id="recruiter-candidates-button" type="button">Candidatos</button>
      <button id="recruiter-like-button" type="button">Curtir candidato</button>
      <button id="recruiter-matches-button" type="button">Matches</button>
    </div>`;

  const userLabel = section.querySelector<HTMLElement>("#account-label");
  const login = section.querySelector<HTMLButtonElement>("#login-button");
  const logout = section.querySelector<HTMLButtonElement>("#logout-button");
  const options = section.querySelector<HTMLElement>(".header-options");
  const companyMenu = section.querySelector<HTMLButtonElement>("#menu-view-company-button");
  const candidateMenu = section.querySelector<HTMLButtonElement>("#menu-view-candidate-button");
  const recruiterMenu = section.querySelector<HTMLButtonElement>("#menu-view-recruiter-button");
  const companySubmenu = section.querySelector<HTMLElement>("#company-submenu");
  const candidateSubmenu = section.querySelector<HTMLElement>("#candidate-submenu");
  const recruiterSubmenu = section.querySelector<HTMLElement>("#recruiter-submenu");

  userLabel!.textContent = user
    ? `Conta: ${user.name} (${user.type === "candidate" ? "Candidato" : user.type === "company" ? "Empresa" : "Recrutador"})`
    : "Nao conectado";
  login!.hidden = Boolean(user);
  logout!.hidden = !user;
  companyMenu!.hidden = user?.type !== "company";
  candidateMenu!.hidden = user?.type !== "candidate";
  recruiterMenu!.hidden = user?.type !== "recruiter";

  const closeMenus = (): void => {
    companySubmenu!.hidden = true;
    candidateSubmenu!.hidden = true;
    recruiterSubmenu!.hidden = true;
  };
  const toggle = (target: HTMLElement): void => {
    const opening = target.hidden;
    closeMenus();
    target.hidden = !opening;
  };

  section.querySelector("#menu-open-button")?.addEventListener("click", () => {
    const opening = Boolean(options!.hidden);
    options!.hidden = !opening;
    section.querySelector("#menu-open-button")?.setAttribute("aria-expanded", String(opening));
    if (!opening) closeMenus();
    actions.onMenuToggle(opening);
  });
  companyMenu!.addEventListener("click", () => { toggle(companySubmenu!); companyMenu!.setAttribute("aria-expanded", String(!companySubmenu!.hidden)); });
  candidateMenu!.addEventListener("click", () => { toggle(candidateSubmenu!); candidateMenu!.setAttribute("aria-expanded", String(!candidateSubmenu!.hidden)); });
  recruiterMenu!.addEventListener("click", () => { toggle(recruiterSubmenu!); recruiterMenu!.setAttribute("aria-expanded", String(!recruiterSubmenu!.hidden)); });
  login!.addEventListener("click", actions.onLogin);
  logout!.addEventListener("click", actions.onLogout);

  section.querySelector("#create-job-button")?.addEventListener("click", actions.onCreateJob);
  section.querySelector("#manage-jobs-button")?.addEventListener("click", actions.onViewJobs);
  section.querySelector("#view-companies-button")?.addEventListener("click", actions.onViewCompanies);
  section.querySelector("#view-candidates-button")?.addEventListener("click", actions.onViewCandidates);
  section.querySelector("#company-like-button")?.addEventListener("click", actions.onCompanyLike);
  section.querySelector("#company-matches-button")?.addEventListener("click", actions.onMatches);
  section.querySelector("#manage-recruiters-button")?.addEventListener("click", actions.onManageRecruiters);
  section.querySelector("#candidate-feed-button")?.addEventListener("click", actions.onViewJobs);
  section.querySelector("#candidate-like-button")?.addEventListener("click", actions.onCandidateLike);
  section.querySelector("#candidate-matches-button")?.addEventListener("click", actions.onMatches);
  section.querySelector("#manage-candidates-button")?.addEventListener("click", actions.onManageCandidates);
  section.querySelector("#recruiter-jobs-button")?.addEventListener("click", actions.onViewJobs);
  section.querySelector("#recruiter-candidates-button")?.addEventListener("click", actions.onViewCandidates);
  section.querySelector("#recruiter-like-button")?.addEventListener("click", actions.onCompanyLike);
  section.querySelector("#recruiter-matches-button")?.addEventListener("click", actions.onMatches);
  section.querySelector("#menu-view-competence-graph-button")?.addEventListener("click", actions.onViewCompetenceGraph);
  return section;
}
