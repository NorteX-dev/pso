import { Swarm } from "./swarm.js";
import { exportToCsv, showAlert, wait } from "./util";
import { mobileMenuInit } from "./mobile";

export type FunctionType = "Ackleys" | "Booths" | "Three-Hump";

// TYPES
type SwarmData = { epoch: number; currentBest: number; globalBest: number; bestX: number; bestY: number };

// GLOBAL STATE VARIABLES
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

/*--------------------*/
/*   HTML INTERFACES  */
/*--------------------*/

const assignGlobalVars = () => {
	const inertiaField = document.querySelector<HTMLInputElement>("#inertia")!;
	const cognitiveField = document.querySelector<HTMLInputElement>("#cognitive")!;
	const socialField = document.querySelector<HTMLInputElement>("#social")!;
	const optimumField = document.querySelector<HTMLInputElement>("#optimum")!;
	const particlesCountField = document.querySelector<HTMLInputElement>("#particles")!;
	const epochsCountField = document.querySelector<HTMLInputElement>("#epochs")!;
	const delayField = document.querySelector<HTMLInputElement>("#delay")!;
	const filterPrecisionField = document.querySelector<HTMLInputElement>("#precision")!;

	inertia = parseFloat(inertiaField.value);
	cognitive = parseFloat(cognitiveField.value);
	social = parseFloat(socialField.value);
	optimum = parseFloat(optimumField.value);
	particles = parseFloat(particlesCountField.value);
	epochs = parseFloat(epochsCountField.value);
	delay = parseFloat(delayField.value);
	precision = parseFloat(filterPrecisionField.value);
};

const setStatusText = (type: "Idle" | "Running") => {
	const statusText = document.querySelector<HTMLParagraphElement>("#status-text")!; // Text displaying "Idle" or "Running..."

	if (type === "Idle") {
		statusText.textContent = "Idle";
		statusText.style.color = "orange";
	} else if (type === "Running") {
		statusText.textContent = "Running...";
		statusText.style.color = "green";
	}
};

const addFunctionBtnsClickHandlers = () => {
	const allFunctionButtons = document.querySelectorAll(".function-button");

	allFunctionButtons.forEach((button) => {
		button.addEventListener("click", () => {
			if (button.id === "ackley") selectedFunction = "Ackleys";
			else if (button.id === "booth") selectedFunction = "Booths";
			else if (button.id === "three-hump") selectedFunction = "Three-Hump";

			allFunctionButtons.forEach((btn) => btn.classList.remove("selected-function"));
			button.classList.add("selected-function");
		});
	});
};

const updateSavedInfo = () => {
	const savedInfoContent = document.querySelector<HTMLPreElement>("#saved-info-content")!; // "Saved Information" top-right container

	savedInfoContent.textContent = `Selected Function: ${selectedFunction}
Inertia: ${inertia}
Cognitive Component: ${cognitive}
Social Component: ${social}
Optimum Goal: ${optimum}
Particles Amount: ${particles}
Number of Epochs: ${epochs}
Application Delay: ${delay}ms
Filter Precision: ${precision}`;
};

/*--------------------*/
/*      HANDLERS      */
/*--------------------*/

// Handles the "Save Information" button click
const onSave = () => {
	if (!selectedFunction) {
		showAlert("Please select a function.", "error");
		throw new Error("Please select a function.");
	}

	if (running) {
		showAlert("The algorithm is running. Please wait.", "error");
		throw new Error("The algorithm is running. Please wait.");
	}

	assignGlobalVars();
	updateSavedInfo();

	saved = true;
};

const updateStats = (currentBest: number, globalBest: number, bestX: number, bestY: number, epoch: number) => {
	document.getElementById("result-content")!.textContent = globalBest.toFixed(20);

	const statsPre = document.querySelector<HTMLPreElement>("#stats-content")!;

	statsPre.textContent = `Current epoch: ${epoch}
Current best: ${currentBest.toFixed(20)}
Best position X: ${bestX.toFixed(20)}
Best position Y: ${bestY.toFixed(20)}`;
};

const calculate = async () => {
	if (!saved) {
		showAlert("Please save the information first.", "error");
		throw new Error("Please save the information first.");
	}

	if (running) {
		showAlert("The algorithm is running. Please wait.", "error");
		throw new Error("The algorithm is running. Please wait.");
	}

	running = true;
	setStatusText("Running");

	const swarm = new Swarm({
		functionType: selectedFunction,
		particles: particles,
		epochs: epochs,
		inertia: inertia,
		cognitive: cognitive,
		social: social,
		beginRange: 0,
		endRange: 10,
		optimum: optimum,
		filterPrecision: precision,
	});
	swarm.run();

	for (let i = 0; i < swarm.bestSolutions.length; i++) {
		await wait(delay);

		updateStats(swarm.bestSolutions[i], swarm.oldSolutions[i], swarm.bestPositions[i].x, swarm.bestPositions[i].y, i + 1);

		collectedData.push({
			epoch: i + 1,
			currentBest: swarm.oldSolutions[i],
			globalBest: swarm.bestSolutions[i],
			bestX: swarm.bestPositions[i].x,
			bestY: swarm.bestPositions[i].y,
		});

		// if last in the array
		if (i === swarm.bestPositions.length - 1) {
			updateStats(swarm.bestSolutions[i], swarm.bestSolutions[i], swarm.bestPositions[i].x, swarm.bestPositions[i].y, i + 1);
		}
	}

	running = false;
	setStatusText("Idle");

	if (swarm.bestSolutions.length === 1 && swarm.bestSolutions[0] === swarm.optimum && 1 /*magicswitch*/) {
		await calculate();
	}
};

const onExportCsv = () => {
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
};

const run = () => {
	mobileMenuInit();
	setStatusText("Idle");
	addFunctionBtnsClickHandlers();
	document.getElementById("save-info")!.addEventListener("click", onSave);
	document.getElementById("calculate")!.addEventListener("click", calculate);
	document.getElementById("export-csv")!.addEventListener("click", onExportCsv);
};

document.addEventListener("DOMContentLoaded", run);
