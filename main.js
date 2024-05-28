const FN_NAME_MAP = {
	ackley: "Ackley",
	booth: "Booth",
	threeHump: "Three-Hump Camel",
};

class Application {
	mode = "";

	inertia = 0.5;
	cognComp = 1.0;
	socialComp = 2.0;
	optimum = 0.0;
	particles = 30;
	epochs = 100;
	filterPrecision = 0;

	f_inertia = document.getElementById("inertia");
	f_cognComp = document.getElementById("cogn-comp");
	f_socialComp = document.getElementById("social-comp");
	f_optimum = document.getElementById("optimum");
	f_particles = document.getElementById("particles");
	f_epochs = document.getElementById("epochs");
	f_filterPrecision = document.getElementById("filter-precision");

	s_inertiaStat = document.getElementById("inertia-stat");
	s_cognStat = document.getElementById("cogn-stat");
	s_socialStat = document.getElementById("social-stat");
	s_optimumStat = document.getElementById("optimum-stat");
	s_filterStat = document.getElementById("filter-stat");

	constructor() {}

	update() {
		document.getElementById("currentModeText").textContent =
			`Current Mode: ${FN_NAME_MAP[this.mode]} Function`;

		if (this.mode) {
			document.getElementById("app").classList.remove("hidden");
		}

		this.f_inertia.value = this.inertia;
		this.f_cognComp.value = this.cognComp;
		this.f_socialComp.value = this.socialComp;
		this.f_optimum.value = this.optimum;
		this.f_particles.value = this.particles;
		this.f_epochs.value = this.epochs;
		this.f_filterPrecision.value = this.filterPrecision;

		this.s_inertiaStat.textContent = this.inertia.toString();
		this.s_cognStat.textContent = this.cognComp.toString();
		this.s_socialStat.textContent = this.socialComp.toString();
		this.s_optimumStat.textContent = this.optimum.toString();
		this.s_filterStat.textContent = this.filterPrecision.toString();
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
