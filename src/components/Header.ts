export function Header(): HTMLElement {
	const section = document.createElement("section");
	section.classList.add("Header");
	section.textContent = "Header teste";

	return section;
}
