export const mobileMenuInit = () => {
    const toggleButton = document.querySelector('[data-collapse-toggle="mobile-menu"]');
    const menu = document.querySelector("#mobile-menu");
    menu.style.display = "none";
    toggleButton.addEventListener("click", () => {
        menu.style.display = menu.style.display === "none" ? "block" : "none";
    });
};
