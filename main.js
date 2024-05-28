const FN_NAME_MAP = {
	ackley: "Ackley",
	booth: "Booth",
	threeHump: "Three-Hump Camel",
};

class Application {
	mode = "";

	constructor() {}

	update() {
		document.getElementById("currentModeText").textContent =
			`Current Mode: ${FN_NAME_MAP[this.mode]} Function`;
	}
}

export const app = new Application();

const ackleyBtn = document.getElementById("ackley-btn");
const boothBtn = document.getElementById("booth-btn");
const threeHumpBtn = document.getElementById("three-hump-btn");

ackleyBtn.addEventListener("click", () => {
	app.mode = "ackley";
	app.update();
});
boothBtn.addEventListener("click", () => {
	app.mode = "booth";
	app.update();
});
threeHumpBtn.addEventListener("click", () => {
	app.mode = "threeHump";
	app.update();
});
