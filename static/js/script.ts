import { Swarm } from "./swarm.js";

export type FunctionType = "Ackleys" | "Booths" | "Three-Hump";

let MAGIC_SWITCH = true;

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
			alert("Please select a function.");
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
Application Delay: ${delay}ms
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

	function updateStats(currentBest: number, globalBest: number, bestX: number, bestY: number, epoch: number) {
		document.getElementById("result-content")!.textContent = globalBest.toFixed(20);

		const statsPre: HTMLPreElement = document.getElementById("stats-content") as HTMLPreElement;

		statsPre.textContent = `Current epoch: ${epoch}
Current best: ${currentBest.toFixed(20)}
Best position X: ${bestX.toFixed(20)}
Best position Y: ${bestY.toFixed(20)}`;
	}

	function updateLogs(logs: string) {
		document.getElementById("logs-content")!.textContent = logs;
	}

	document.getElementById("calculate")!.addEventListener("click", async () => {
		async function calculate() {
			if (!saved) {
				alert("Please save the information first.");
				throw new Error("Please save the information first.");
			}

			if (running) {
				alert("The algorithm is already running.");
				throw new Error("The algorithm is already running.");
			}

			running = true;
			statusText.textContent = "Running...";
			statusText.style.color = "green";

			const swarm = new Swarm(
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

			let logs = "";

			for (let i = 0; i < swarm.bestSolutions.length; i++) {
				await new Promise((resolve) => setTimeout(resolve, delay));

				updateStats(swarm.bestSolutions[i], swarm.oldSolutions[i], swarm.bestPositions[i].x, swarm.bestPositions[i].y, i + 1);
				logs = swarm.logs[i] + "\n" + logs;
				updateLogs(logs);

				if (i === swarm.bestPositions.length - 1) {
					updateStats(swarm.bestSolutions[i], swarm.bestSolutions[i], swarm.bestPositions[i].x, swarm.bestPositions[i].y, i + 1);
				}
			}

			running = false;
			statusText.textContent = "Idle";
			statusText.style.color = "orange";

			if (MAGIC_SWITCH && swarm.bestSolutions.length === 1 && swarm.bestSolutions[0] === swarm.optimum) {
				await calculate();
			}
		}
		await calculate();
	});
});
