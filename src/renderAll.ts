import { Header } from "./view/components/layout/Header";
import { InfoSection } from "./view/components/layout/InfoSection";
import { RegisterPage } from "./view/pages/RegisterPage";
import { CandidateFeedPage } from "./view/pages/CandidateFeedPage";
import { CompanyFeedPage } from "./view/pages/CompanyFeedPage";
import { JobFeedPage } from "./view/pages/JobFeedPage";
import { JobRegisterPage } from "./view/pages/JobRegisterPage";
import { CandidateLikePage } from "./view/pages/CandidateLikePage";
import { CompanyLikePage } from "./view/pages/CompanyLikePage";
import { GraphSkillsPage } from "./view/pages/GraphSkillsPage";
import { LoginPage } from "./view/pages/LoginPage";
import { RecruiterManagementPage } from "./view/pages/RecruiterManagementPage";
import { MatchesPage } from "./view/pages/MatchesPage";
import { CandidateService } from "./services/CandidateService";
import { CompanyService } from "./services/CompanyService";
import { JobService } from "./services/JobService";
import { sharedSessionService } from "./services/SessionService";
import { destroyCompetenceGraphs } from "./view/components/charts/CompetenceGraph";
import { updateInfoCounters } from "./view/components/layout/InfoSection";
import type { AuthenticatedUser } from "./types/UserType";

export function renderAll(): void {
  const app = document.getElementById("app");
  if (!app) throw new Error("Elemento #app não encontrado.");
  const pageContent = document.createElement("main");
  pageContent.id = "page-content";
  const routeContent = document.createElement("div");
  routeContent.id = "route-content";
  pageContent.append(InfoSection(), routeContent);
  let currentUser: AuthenticatedUser | null = sharedSessionService.getUser();

  const showLogin = (): void => {
    currentUser = null;
    app.replaceChildren(createHeader(), pageContent);
    pageContent.hidden = false;
    changePage(LoginPage(showAuthenticatedHome, (type) => changePage(RegisterPage(type))));
  };
  const showAuthenticatedHome = (user: AuthenticatedUser): void => {
    currentUser = user;
    app.replaceChildren(createHeader(), pageContent);
    pageContent.hidden = false;
    if (user.type === "candidate") changePage(JobFeedPage(() => new JobService().getVagas(), true, (id) => changePage(CandidateLikePage(id))));
    else changePage(user.type === "recruiter"
      ? JobFeedPage(() => new JobService().getVagas(true))
      : CompanyFeedPage(() => new CompanyService().getEmpresas()));
  };
  sharedSessionService.setUnauthorizedCallback(showLogin);
  const actions = {
    onMenuToggle: (open: boolean) => { pageContent.hidden = !open; },
    onLogin: showLogin,
    onLogout: () => {
      void sharedSessionService.logout(import.meta.env.VITE_API_URL)
        .catch(() => { window.alert("A revogação da sessão não foi confirmada."); })
        .finally(showLogin);
    },
    onCreateCandidate: () => changePage(RegisterPage("candidate")),
    onCreateCompany: () => changePage(RegisterPage("company")),
    onCreateJob: () => { if (currentUser?.type === "company") changePage(JobRegisterPage()); },
    onViewCompanies: () => changePage(CompanyFeedPage(() => new CompanyService().getEmpresas())),
    onViewCandidates: () => {
      if (!currentUser) return;
      changePage(CandidateFeedPage(() => new CandidateService().getCandidatos(), currentUser?.type === "candidate", true, (id) => new CandidateService().excluirCandidato(id), () => {
        void updateInfoCounters();
        showLogin();
      }));
    },
    onManageCandidates: () => {
      if (currentUser?.type !== "candidate") return;
      changePage(CandidateFeedPage(() => new CandidateService().getCandidatos(), true, true, (id) => new CandidateService().excluirCandidato(id), () => {
        void updateInfoCounters();
        showLogin();
      }));
    },
    onViewJobs: () => {
      if (!currentUser) return;
      const mine = currentUser.type === "company" || currentUser.type === "recruiter";
      changePage(JobFeedPage(() => new JobService().getVagas(mine), true, currentUser.type === "candidate" ? (id) => changePage(CandidateLikePage(id)) : undefined));
    },
    onCandidateLike: () => changePage(CandidateLikePage()),
    onCompanyLike: () => {
      if (currentUser?.type === "company" || currentUser?.type === "recruiter") changePage(CompanyLikePage());
    },
    onManageRecruiters: () => currentUser?.type === "company" && changePage(RecruiterManagementPage()),
    onMatches: () => changePage(MatchesPage()),
    onViewCompetenceGraph: () => {
      if (currentUser?.type !== "company" && currentUser?.type !== "recruiter") return;
      changePage(GraphSkillsPage(
        () => new JobService().getVagas(true),
        () => new CandidateService().getCandidatos(),
      ));
    },
  };
  const createHeader = (): HTMLElement => Header(actions, currentUser);
  app.replaceChildren(createHeader(), pageContent);
  pageContent.hidden = false;
  changePage(LoginPage(showAuthenticatedHome, (type) => changePage(RegisterPage(type))));
}

export function changePage(page: HTMLElement): void {
  const route = document.getElementById("route-content");
  if (!route) throw new Error("Elemento #route-content não encontrado.");
  destroyCompetenceGraphs(route);
  route.replaceChildren(page);
}
