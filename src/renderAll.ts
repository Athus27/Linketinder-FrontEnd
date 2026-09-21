import { Header } from "./components/Header";
import { CandidateRegisterPage } from "./pages/CandidateRegisterPage";

export function renderAll(): void {
	const app = document.getElementById("app");

	if (!app) {
		throw new Error("Elemento #app não encontrado.");
	}

	app.replaceChildren(
		Header(),
		CandidateRegisterPage()
	);
}