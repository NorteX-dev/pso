import { SwarmAlgorithm } from "./swarm.js";

export type FunctionType = "Ackleys" | "Booths" | "Three-Hump";

let MAGIC_NO_0_SWITCH = true;

document.addEventListener("DOMContentLoaded", () => {
	const statusText = document.getElementById("status-text")!;
	statusText.textContent = "Idle";
	statusText.style.color = "orange";

	const toggleButton = document.querySelector('[data-collapse-toggle="mobile-menu"]')!;
	const menu: HTMLDivElement = document.querySelector("#mobile-menu")!;

	menu.style.display = "none";
	toggleButton.addEventListener("click", () => {
		menu.style.display = menu.style.display === "none" ? "block" : "none";
	});

	let running: boolean = false;
	let saved: boolean = false;
	let selectedFunction: FunctionType;
	let inertia: number;
	let cognitive: number;
	let social: number;
	let optimum: number;
	let particles: number;
	let epochs: number;
	let delay: number;
	let precision: number;

	document.getElementById("ackley")!.addEventListener("click", () => {
		selectedFunction = "Ackleys";
	});
	document.getElementById("booth")!.addEventListener("click", () => {
		selectedFunction = "Booths";
	});
	document.getElementById("three-hump")!.addEventListener("click", () => {
		selectedFunction = "Three-Hump";
	});

	document.getElementById("save-info")!.addEventListener("click", () => {
		if (!selectedFunction) {
			throw new Error("Please select a function.");
		}

		inertia = parseFloat((<HTMLInputElement>document.getElementById("inertia"))!.value);
		cognitive = parseFloat((<HTMLInputElement>document.getElementById("cognitive"))!.value);
		social = parseFloat((<HTMLInputElement>document.getElementById("social"))!.value);
		optimum = parseFloat((<HTMLInputElement>document.getElementById("optimum"))!.value);
		particles = parseFloat((<HTMLInputElement>document.getElementById("particles"))!.value);
		epochs = parseFloat((<HTMLInputElement>document.getElementById("epochs"))!.value);
		delay = parseFloat((<HTMLInputElement>document.getElementById("delay"))!.value);
		precision = parseFloat((<HTMLInputElement>document.getElementById("precision"))!.value);

		document.getElementById("saved-info-content")!.textContent = `Selected Function: ${selectedFunction}
Inertia: ${inertia}
Cognitive Component: ${cognitive}
Social Component: ${social}
Optimum Goal: ${optimum}
Particles Amount: ${particles}
Number of Epochs: ${epochs}
Application Delay: ${delay}
Filter Precision: ${precision}`;

		saved = true;
	});

	const functionButtons = document.querySelectorAll(".function-button");
	functionButtons.forEach((button) => {
		button.addEventListener("click", () => {
			functionButtons.forEach((btn) => btn.classList.remove("selected-function"));
			button.classList.add("selected-function");
		});
	});

	document.getElementById("calculate")!.addEventListener("click", async () => {
		async function calculate() {
			if (!saved) {
				throw new Error("Please save the information first.");
			}

			if (running) {
				throw new Error("The algorithm is already running.");
			}

			running = true;
			statusText.textContent = "Running...";
			statusText.style.color = "green";

			const swarm = new SwarmAlgorithm(
				selectedFunction /*functionType*/,
				particles /*particles*/,
				epochs /*epochs*/,
				inertia /*inertia*/,
				cognitive /*cognitive*/,
				social /*social*/,
				0 /*beginRange*/,
				10 /*endRange*/,
				optimum /*optimum*/,
				precision /*filterPrecision*/,
			);
			swarm.run();

			// w javie tu new Thread
			let logs = "";

			for (let i = 0; i < swarm.bestSolutions.length; i++) {
				await new Promise((resolve) => setTimeout(resolve, delay));

				document.getElementById("result-content")!.textContent = swarm.bestSolutions[i].toFixed(20);
				// document.getElementById("pso_global_best_solution_text").textContent = swarm.oldSolutions[i];
				// document.getElementById("pso_x_value_text").textContent = swarm.bestPositions[i].x;
				// document.getElementById("pso_y_value_text").textContent = swarm.bestPositions[i].y;
				logs = swarm.logs[i] + "\n" + logs;
				document.getElementById("logs-content")!.textContent = logs;
				// document.getElementById("pso_current_epoch_number_text").textContent = i.toString();

				// if (i === this.bestPositions.length - 1) document.getElementById("pso_global_best_solution_text").textContent = swarm.bestSolutions[i];
			}

			running = false;
			statusText.textContent = "Idle";
			statusText.style.color = "orange";
			console.log(swarm);

			if (MAGIC_NO_0_SWITCH && swarm.bestSolutions.length === 1 && swarm.bestSolutions[0] === 0) {
				await calculate();
			}
		}
		calculate();
	});
});
