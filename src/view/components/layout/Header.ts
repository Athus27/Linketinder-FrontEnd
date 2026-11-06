import "./Header.css";

interface HeaderActions {
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
	onMenuToggle: (isOpen: boolean) => void;
}

export function Header(actions: HeaderActions): HTMLElement {
	const section = document.createElement("section");
	section.classList.add("header");
	section.innerHTML = `
	<div class="header-row">
		<h1>Linketinder</h1>
		<button id="menu-open-button"><img src="../../public/assets/icons/menu.svg" alt="Menu" /></button>
	</div>
	<div class="header-options" hidden>
		<button id="menu-view-company-button"><img class="icon" src="../../public/assets/icons/company.svg" alt="Menu" />Menu da Empresa</button>
		<button id="menu-view-candidate-button"><img class="icon" src="../../public/assets/icons/candidate.svg" alt="Menu" />Menu do Candidato</button>
		<button id="menu-view-competence-graph-button"><img class="icon" src="../../public/assets/icons/competence.svg" alt="Menu" />Grafico de Competencias</button>
		
	</div>
	<div id="company-submenu" class="header-row submenu" hidden>
		<button id="create-company-button">Cadastrar empresa</button>
		<button id="view-companies-button">Visualizar empresas</button>
		<button id="create-job-button">Cadastrar vaga</button>
		<button id="manage-jobs-button">Gerenciar vagas</button>
		<button id="view-candidates-button">Visualizar candidatos</button>
		<button id="company-like-button">Curtir candidato</button>

		</div>

		<div id="candidate-submenu" class="header-row submenu" hidden>
			<button id="create-candidate-button">Cadastrar candidato</button>
			<button id="manage-candidates-button">Gerenciar candidatos</button>
			<button id="candidate-feed-button">Visualizar vagas</button>
			<button id="candidate-like-button">Curtir vaga</button>
		</div>

	`;

	const menuOpenButton = section.querySelector<HTMLButtonElement>("#menu-open-button");

	const headerOptions = section.querySelector<HTMLElement>(".header-options");

	const companyButton = section.querySelector<HTMLButtonElement>("#menu-view-company-button");
	const companySubmenu = section.querySelector<HTMLElement>("#company-submenu");
	const createCompanyButton = section.querySelector<HTMLButtonElement>("#create-company-button");
	const createJobButton = section.querySelector<HTMLButtonElement>("#create-job-button");
	const manageJobsButton = section.querySelector<HTMLButtonElement>("#manage-jobs-button");
	const viewCompaniesButton = section.querySelector<HTMLButtonElement>("#view-companies-button");
	const viewCandidatesButton = section.querySelector<HTMLButtonElement>("#view-candidates-button");
	const viewCompetenceGraphButton = section.querySelector<HTMLButtonElement>("#menu-view-competence-graph-button");	
	const companyLikeButton = section.querySelector<HTMLButtonElement>("#company-like-button");

	const candidateButton = section.querySelector<HTMLButtonElement>("#menu-view-candidate-button");
	const candidateSubmenu = section.querySelector<HTMLElement>("#candidate-submenu");
	const createCandidateButton = section.querySelector<HTMLButtonElement>("#create-candidate-button");
	const manageCandidatesButton = section.querySelector<HTMLButtonElement>("#manage-candidates-button");
	const viewJobsButton = section.querySelector<HTMLButtonElement>("#candidate-feed-button");
	const candidateLikeButton = section.querySelector<HTMLButtonElement>("#candidate-like-button");

	function closeSubmenus(): void {
		if (!companyButton || !candidateButton) return;
		if (!companySubmenu || !candidateSubmenu) return;

		companySubmenu.hidden = true;
		candidateSubmenu.hidden = true;

		companyButton.setAttribute("aria-expanded", "false");
		candidateButton.setAttribute("aria-expanded", "false");
	}

	function toggleSubmenu(button: HTMLButtonElement, submenu: HTMLElement, otherButton: HTMLButtonElement, otherSubmenu: HTMLElement): void {
		const shouldOpen = submenu.hidden;

		submenu.hidden = !shouldOpen;
		button.setAttribute("aria-expanded", String(shouldOpen));

		otherSubmenu.hidden = true;
		otherButton.setAttribute("aria-expanded", "false");
	}

	if (menuOpenButton && headerOptions && companyButton && candidateButton && companySubmenu && candidateSubmenu) {
		// src/components/Header.ts
		menuOpenButton.addEventListener("click", () => {
			const isOpening = headerOptions.hasAttribute("hidden");

			headerOptions.hidden = !isOpening;

			closeSubmenus();

			actions.onMenuToggle(isOpening);
		});

		companyButton.addEventListener("click", () => {
			toggleSubmenu(companyButton, companySubmenu, candidateButton, candidateSubmenu);
		});

		candidateButton.addEventListener("click", () => {
			toggleSubmenu(candidateButton, candidateSubmenu, companyButton, companySubmenu);
		});
	}

	createCandidateButton?.addEventListener("click", () => {
		actions.onCreateCandidate();
	});

	manageCandidatesButton?.addEventListener("click", () => {
		actions.onManageCandidates();
	});

	createCompanyButton?.addEventListener("click", () => {
		actions.onCreateCompany();
	});

	createJobButton?.addEventListener("click", () => {
		actions.onCreateJob();
	});

	manageJobsButton?.addEventListener("click", () => {
		actions.onViewJobs();
	});

	viewCompaniesButton?.addEventListener("click", () => {
		actions.onViewCompanies();
	});

	viewCandidatesButton?.addEventListener("click", () => {
		actions.onViewCandidates();
	});

	viewJobsButton?.addEventListener("click", () => {
		actions.onViewJobs();
	});

	viewCompetenceGraphButton?.addEventListener("click", () => {
		actions.onViewCompetenceGraph();
	});

	companyLikeButton?.addEventListener("click", () => {
		actions.onCompanyLike();
	});

	candidateLikeButton?.addEventListener("click", () => {
		actions.onCandidateLike();
	});

	return section;
}
