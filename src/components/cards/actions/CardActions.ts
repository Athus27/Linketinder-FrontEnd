import "./CardActions.css";

interface CardActionsOptions {
	label: string;
	onEdit?: () => void;
	onDelete?: () => void;
	onLike?: () => void;
	className?: string;
}

export function createCardActions(options: CardActionsOptions): HTMLDivElement {
	const containerOptions = document.createElement("div");
	containerOptions.classList.add(options.className || "card-actions");

	if (options.onEdit) {
		const editButton = document.createElement("button");
		editButton.type = "button";
		editButton.classList.add("card-action");
		editButton.ariaLabel = `Editar ${options.label}`;

		const editIcon = createIcon("/assets/icons/edit.svg", "editar");
		editButton.appendChild(editIcon);

		editButton.addEventListener("click", options.onEdit);

        containerOptions.appendChild(editButton)
	}

	if (options.onDelete) {
        const deleteButton = document.createElement("button");
		deleteButton.type = "button";
		deleteButton.classList.add("card-action", "card-action--delete");
		deleteButton.ariaLabel = `Deletar ${options.label}`;

		const deleteIcon = createIcon("/assets/icons/delete.svg", "deletar");
		deleteButton.appendChild(deleteIcon);

		deleteButton.addEventListener("click", options.onDelete);

        containerOptions.appendChild(deleteButton)
	}

	if (options.onLike) {
        const likeButton = document.createElement("button");
		likeButton.type = "button";
		likeButton.classList.add("card-action");
		likeButton.ariaLabel = `Curtir ${options.label}`;

		const likeIcon = createIcon("/assets/icons/like.svg", "curtir");
		likeButton.appendChild(likeIcon);

		likeButton.addEventListener("click", options.onLike);

        containerOptions.appendChild(likeButton)
	}

    return containerOptions
}

function createIcon(src: string, alt: string): HTMLElement {
	const newIcon = document.createElement("img");
	newIcon.src = src;
	newIcon.alt = alt;

	return newIcon;
}
