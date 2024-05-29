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
let MAGIC_SWITCH = true;
document.addEventListener("DOMContentLoaded", () => {
    const statusText = document.getElementById("status-text");
    statusText.textContent = "Idle";
    statusText.style.color = "orange";
    const toggleButton = document.querySelector('[data-collapse-toggle="mobile-menu"]');
    const menu = document.querySelector("#mobile-menu");
    menu.style.display = "none";
    toggleButton.addEventListener("click", () => {
        menu.style.display = menu.style.display === "none" ? "block" : "none";
    });
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
    document.getElementById("ackley").addEventListener("click", () => {
        selectedFunction = "Ackleys";
    });
    document.getElementById("booth").addEventListener("click", () => {
        selectedFunction = "Booths";
    });
    document.getElementById("three-hump").addEventListener("click", () => {
        selectedFunction = "Three-Hump";
    });
    document.getElementById("save-info").addEventListener("click", () => {
        if (!selectedFunction) {
            showAlert("Please select a function.", "error");
            throw new Error("Please select a function.");
        }
        if (running) {
            showAlert("The algorithm is running. Please wait.", "error");
            throw new Error("The algorithm is running. Please wait.");
        }
        inertia = parseFloat(document.getElementById("inertia").value);
        cognitive = parseFloat(document.getElementById("cognitive").value);
        social = parseFloat(document.getElementById("social").value);
        optimum = parseFloat(document.getElementById("optimum").value);
        particles = parseFloat(document.getElementById("particles").value);
        epochs = parseFloat(document.getElementById("epochs").value);
        delay = parseFloat(document.getElementById("delay").value);
        precision = parseFloat(document.getElementById("precision").value);
        document.getElementById("saved-info-content").textContent = `Selected Function: ${selectedFunction}
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
    function updateStats(currentBest, globalBest, bestX, bestY, epoch) {
        document.getElementById("result-content").textContent = globalBest.toFixed(20);
        const statsPre = document.getElementById("stats-content");
        statsPre.textContent = `Current epoch: ${epoch}
Current best: ${currentBest.toFixed(20)}
Best position X: ${bestX.toFixed(20)}
Best position Y: ${bestY.toFixed(20)}`;
    }
    function updateLogs(logs) {
        document.getElementById("logs-content").textContent = logs;
    }
    document.getElementById("calculate").addEventListener("click", () => __awaiter(void 0, void 0, void 0, function* () {
        function calculate() {
            return __awaiter(this, void 0, void 0, function* () {
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
                const swarm = new Swarm(selectedFunction /*functionType*/, particles /*particles*/, epochs /*epochs*/, inertia /*inertia*/, cognitive /*cognitive*/, social /*social*/, 0 /*beginRange*/, 10 /*endRange*/, optimum /*optimum*/, precision /*filterPrecision*/);
                swarm.run();
                let logs = "";
                for (let i = 0; i < swarm.bestSolutions.length; i++) {
                    yield new Promise((resolve) => setTimeout(resolve, delay));
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
                    yield calculate();
                }
            });
        }
        yield calculate();
    }));
    function showAlert(message, type) {
        // Remove existing alert if present
        const existingAlert = document.querySelector('.alert-container');
        if (existingAlert)
            existingAlert.remove();
        const alertContainer = document.createElement('div');
        alertContainer.className = 'alert-container';
        const alertBox = document.createElement('div');
        alertBox.className = `alert alert-${type} p-4 rounded shadow-lg max-w-md`;
        alertBox.textContent = message;
        alertContainer.appendChild(alertBox);
        document.body.appendChild(alertContainer);
        setTimeout(() => {
            alertBox.style.opacity = '0';
            setTimeout(() => alertContainer.remove(), 500);
        }, 3000);
    }
});
