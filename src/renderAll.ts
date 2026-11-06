import { Header } from "./view/components/layout/Header";
import { InfoSection } from "./view/components/layout/InfoSection";
import { RegisterPage } from "./view/pages/RegisterPage";
import { CandidateFeedPage } from "./view/pages/CandidateFeedPage";
import { CompanyFeedPage } from "./view/pages/CompanyFeedPage";
import { JobFeedPage } from "./view/pages/JobFeedPage";
import { JobRegisterPage } from "./view/pages/JobRegisterPage";
import { CandidateLikePage } from "./view/pages/CandidateLikePage";
import { CompanyLikePage } from "./view/pages/CompanyLikePage";
import { destroyCompetenceGraphs } from "./view/components/charts/CompetenceGraph";
import { GraphSkillsPage } from "./view/pages/GraphSkillsPage";
import { CandidateController } from "./controllers/CandidateController";
import { CandidateService } from "./services/CandidateService";
import { CompanyController } from "./controllers/CompanyController";
import { CompanyService } from "./services/CompanyService";
import { JobController } from "./controllers/JobController";
import { JobService } from "./services/JobService";

export function renderAll(): void {
	const app = document.getElementById("app");

	if (!app) {
		throw new Error("Elemento #app não encontrado.");
	}

	const pageContent = document.createElement("main");
	pageContent.id = "page-content";

	const routeContent = document.createElement("div");
	routeContent.id = "route-content";

	pageContent.append(InfoSection(), routeContent);

	// A aplicação começa c/ o conteúdo oculto.
	pageContent.hidden = true;

	const candidateController = new CandidateController(new CandidateService());
    const companyController = new CompanyController(new CompanyService());
    const jobController = new JobController(new JobService());

	const headerActions = {
		onMenuToggle: (isOpen: boolean): void => {
			// Menu aberto mostra a página e menu fechado esconde.
			pageContent.hidden = !isOpen;
		},

		onCreateCandidate: (): void => {
			changePage(RegisterPage("candidate"));
		},

		onCreateCompany: (): void => {
			changePage(RegisterPage("company"));
		},
		onCreateJob: (): void => {
			changePage(JobRegisterPage());
		},
		onViewCompanies: (): void => {
			changePage(CompanyFeedPage(() => companyController.getEmpresas()));
		},
		onViewCandidates: (): void => {
			changePage(CandidateFeedPage(() => candidateController.getCandidatos()));
		},
		onManageCandidates: (): void => {
			changePage(CandidateFeedPage(() => candidateController.getCandidatos(), true, true));
		},
		onViewJobs: (): void => {
			changePage(JobFeedPage(() => jobController.getVagas()));
		},
		onCandidateLike: (): void => {
			changePage(CandidateLikePage());
		},
		onCompanyLike: (): void => {
			changePage(CompanyLikePage());
		},
		onViewCompetenceGraph: (): void => {
			changePage(GraphSkillsPage());
		}
	};

	const header = Header(headerActions);

	app.replaceChildren(header, pageContent);

	// Nenhum formulário fica selecionado inicialmente.
	changePage(RegisterPage());
}

export function changePage(newPage: HTMLElement): void {
	const routeContent = document.getElementById("route-content");

	if (!routeContent) {
		throw new Error("Elemento #route-content não encontrado.");
	}

	destroyCompetenceGraphs(routeContent);
	routeContent.replaceChildren(newPage);
}
