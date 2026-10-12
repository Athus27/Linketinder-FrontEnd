import type { Job } from "../../models/Job";
import type { CreateJobInput } from "../../types/EntityInputs";
import { createEditFormActions } from "./actions/FormActions";
import "./JobEditForm.css";

interface JobEditFormActions {
	onSave: (data: CreateJobInput) => void;
	onCancel: () => void;
}

export function JobEditForm(job: Job, actions: JobEditFormActions): HTMLFormElement {
	const form = document.createElement("form");
	form.classList.add("job-edit-form");

	const heading = document.createElement("h2");
	heading.textContent = `Editar ${job.title}`;

	const title = document.createElement("input");
	title.name = "title";
	title.value = job.title;
	title.required = true;

	const description = document.createElement("textarea");
	description.name = "description";
	description.value = job.description;
	description.required = true;

	const skills = document.createElement("input");
	skills.name = "skills";
	skills.value = job.skills.join(", ");
	skills.required = true;

	const buttons = createEditFormActions(actions.onCancel, "job-edit-actions");

	form.append(heading, title, description, skills, buttons);

	form.addEventListener("submit", (event) => {
		event.preventDefault();
		const formData = new FormData(form);

		actions.onSave({
			companyId: job.companyId,
			title: String(formData.get("title") ?? ""),
			description: String(formData.get("description") ?? ""),
			skills: String(formData.get("skills") ?? "")
				.split(",")
				.map((skill) => skill.trim())
				.filter(Boolean)
		});
	});

	return form;
}
