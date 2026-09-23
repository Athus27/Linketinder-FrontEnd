import { Header } from "./components/Header";
import { RegisterPage } from "./pages/RegisterPage";
import { CandidateFeedPage } from "./pages/CandidateFeedPage";

export function renderAll(): void {
	const app = document.getElementById("app");

	if (!app) {
		throw new Error("Elemento #app não encontrado.");
	}

	const pageContent = document.createElement("main");
	pageContent.id = "page-content";

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
		onViewCandidates: (): void => {
			changePage(CandidateFeedPage());
		}
	};

	const header = Header(headerActions);

	app.replaceChildren(header, pageContent);

	// Nenhum formulário fica selecionado inicialmente.
	changePage(RegisterPage());
}

export function changePage(newPage: HTMLElement): void {
	const pageContent = document.getElementById("page-content");

	if (!pageContent) {
		throw new Error("Elemento #page-content não encontrado.");
	}

	pageContent.replaceChildren(newPage);
}
