var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { Swarm } from "./swarm.js";
import { exportToCsv, showAlert, wait } from "./util.js";
import { mobileMenuInit } from "./mobile.js";
// GLOBAL STATE VARIABLES
let running = false;
let saved = false;
let selectedFunction;
let inertia;
let cognitive;
let social;
let optimum;
let particles;
let epochs;
let delay;
let precision;
let collectedData = [];
/*--------------------*/
/*   HTML INTERFACES  */
/*--------------------*/
const assignGlobalVars = () => {
    const inertiaField = document.querySelector("#inertia");
    const cognitiveField = document.querySelector("#cognitive");
    const socialField = document.querySelector("#social");
    const optimumField = document.querySelector("#optimum");
    const particlesCountField = document.querySelector("#particles");
    const epochsCountField = document.querySelector("#epochs");
    const delayField = document.querySelector("#delay");
    const filterPrecisionField = document.querySelector("#precision");
    inertia = parseFloat(inertiaField.value);
    cognitive = parseFloat(cognitiveField.value);
    social = parseFloat(socialField.value);
    optimum = parseFloat(optimumField.value);
    particles = parseFloat(particlesCountField.value);
    epochs = parseFloat(epochsCountField.value);
    delay = parseFloat(delayField.value);
    precision = parseFloat(filterPrecisionField.value);
};
const setStatusText = (type) => {
    const statusText = document.querySelector("#status-text"); // Text displaying "Idle" or "Running..."
    if (type === "Idle") {
        statusText.textContent = "Idle";
        statusText.style.color = "orange";
    }
    else if (type === "Running") {
        statusText.textContent = "Running...";
        statusText.style.color = "green";
    }
};
const addFunctionBtnsClickHandlers = () => {
    const allFunctionButtons = document.querySelectorAll(".function-button");
    allFunctionButtons.forEach((button) => {
        button.addEventListener("click", () => {
            if (button.id === "ackley")
                selectedFunction = "Ackleys";
            else if (button.id === "booth")
                selectedFunction = "Booths";
            else if (button.id === "three-hump")
                selectedFunction = "Three-Hump";
            allFunctionButtons.forEach((btn) => btn.classList.remove("selected-function"));
            button.classList.add("selected-function");
        });
    });
};
const updateSavedInfo = () => {
    const savedInfoContent = document.querySelector("#saved-info-content"); // "Saved Information" top-right container
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
const updateStats = (currentBest, globalBest, bestX, bestY, epoch) => {
    document.getElementById("result-content").textContent = globalBest.toFixed(20);
    const statsPre = document.querySelector("#stats-content");
    statsPre.textContent = `Current epoch: ${epoch}
Current best: ${currentBest.toFixed(20)}
Best position X: ${bestX.toFixed(20)}
Best position Y: ${bestY.toFixed(20)}`;
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
// Handles the "Calculate" button click
const onCalculate = () => __awaiter(void 0, void 0, void 0, function* () {
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
        yield wait(delay);
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
    console.log(swarm.bestSolutions);
    running = false;
    setStatusText("Idle");
    if (swarm.bestSolutions.length === 1 && swarm.bestSolutions[0] === swarm.optimum && 1 /*magicswitch*/) {
        yield onCalculate();
    }
});
// Handles the "Export to CSV" button click
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
    }
    catch (error) {
        showAlert("An error occurred while exporting the data.", "error");
    }
    collectedData = [];
};
const run = () => {
    mobileMenuInit();
    setStatusText("Idle");
    addFunctionBtnsClickHandlers();
    document.getElementById("save-info").addEventListener("click", onSave);
    document.getElementById("calculate").addEventListener("click", onCalculate);
    document.getElementById("export-csv").addEventListener("click", onExportCsv);
};
document.addEventListener("DOMContentLoaded", run);
