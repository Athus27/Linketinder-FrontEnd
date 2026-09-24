import { Header } from "./components/Header";
import { InfoSection } from "./components/InfoSection";
import { RegisterPage } from "./pages/RegisterPage";
import { CandidateFeedPage } from "./pages/CandidateFeedPage";
import { CompanyFeedPage } from "./pages/CompanyFeedPage";
import { JobFeedPage } from "./pages/JobFeedPage";
import { JobRegisterPage } from "./pages/JobRegisterPage";
import { CandidateLikePage } from "./pages/CandidateLikePage";
import { CompanyLikePage } from "./pages/CompanyLikePage";

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
			changePage(CompanyFeedPage());
		},
		onViewCandidates: (): void => {
			changePage(CandidateFeedPage());
		},
		onManageCandidates: (): void => {
			changePage(CandidateFeedPage(true));
		},
		onViewJobs: (): void => {
			changePage(JobFeedPage());
		},
		onCandidateLike: (): void => {
			changePage(CandidateLikePage());
		},
		onCompanyLike: (): void => {
			changePage(CompanyLikePage());
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

	routeContent.replaceChildren(newPage);
}
