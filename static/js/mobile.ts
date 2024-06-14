export const mobileMenuInit = () => {
	const toggleButton = document.querySelector<HTMLButtonElement>('[data-collapse-toggle="mobile-menu"]')!;
	const menu = document.querySelector<HTMLDivElement>("#mobile-menu")!;

	menu.style.display = "none";
	toggleButton.addEventListener("click", () => {
		menu.style.display = menu.style.display === "none" ? "block" : "none";
	});
};
