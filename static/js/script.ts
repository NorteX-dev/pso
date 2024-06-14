import { Swarm } from "./swarm.js";

export type FunctionType = "Ackleys" | "Booths" | "Three-Hump";

let MAGIC_SWITCH = true;

type SwarmData = { epoch: number; currentBest: number; globalBest: number; bestX: number; bestY: number };

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

	let collectedData: Array<SwarmData> = [];

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
			showAlert("Please select a function.", "error");
			throw new Error("Please select a function.");
		}

		if (running) {
			showAlert("The algorithm is running. Please wait.", "error");
			throw new Error("The algorithm is running. Please wait.");
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
				showAlert("Please save the information first.", "error");
				throw new Error("Please save the information first.");
			}

			if (running) {
				showAlert("The algorithm is running. Please wait.", "error");
				throw new Error("The algorithm is running. Please wait.");
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

				collectedData.push({
					epoch: i + 1,
					currentBest: swarm.oldSolutions[i],
					globalBest: swarm.bestSolutions[i],
					bestX: swarm.bestPositions[i].x,
					bestY: swarm.bestPositions[i].y,
				});

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

	function showAlert(message: string | null, type: string) {
		const existingAlert = document.querySelector(".alert-container");
		if (existingAlert) existingAlert.remove();

		const alertContainer = document.createElement("div");
		alertContainer.className = "alert-container";

		const alertBox = document.createElement("div");
		alertBox.className = `alert alert-${type} p-4 rounded shadow-lg max-w-md`;
		alertBox.textContent = message;

		alertContainer.appendChild(alertBox);
		document.body.appendChild(alertContainer);

		setTimeout(() => {
			alertBox.style.opacity = "0";
			setTimeout(() => alertContainer.remove(), 500);
		}, 3000);
	}

	function exportToCsv(data: any[], decimalPlaces: number) {
		const csvRows = [];
		const headers = Object.keys(data[0]);
		csvRows.push(headers.join(","));

		for (const row of data) {
			if (row.globalBest === 0) {
				continue;
			}

			const values = headers.map((header) => {
				let value = row[header];
				if (header === "globalBest" || header === "currentBest" || header === "bestX" || header === "bestY") {
					value = parseFloat(value).toFixed(decimalPlaces);
				}
				const escaped = ("" + value).replace(/"/g, '\\"');
				return `"${escaped}"`;
			});
			csvRows.push(values.join(","));
		}

		const csvString = csvRows.join("\n");
		const blob = new Blob([csvString], { type: "text/csv" });
		const url = URL.createObjectURL(blob);

		const link = document.createElement("a");
		link.href = url;

		const fileNameInput = document.getElementById("file-name") as HTMLInputElement;
		const fileName = fileNameInput.value || "data";
		link.download = `${fileName}.csv`;

		document.body.appendChild(link);
		link.click();

		document.body.removeChild(link);
	}

	document.getElementById("export-csv")!.addEventListener("click", () => {
		if (!selectedFunction || collectedData.length === 0) {
			showAlert("No data to export.", "error");
			throw new Error("No data to export.");
		}

		if (running) {
			showAlert("The algorithm is running. Please wait.", "error");
			throw new Error("The algorithm is running. Please wait.");
		}

		try {
			exportToCsv(collectedData, 20);
			showAlert("Data exported successfully.", "success");
		} catch (error) {
			showAlert("An error occurred while exporting the data.", "error");
		}

		collectedData = [];
	});
});
