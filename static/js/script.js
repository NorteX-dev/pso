var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { SwarmAlgorithm } from "./swarm.js";
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
            throw new Error("Please select a function.");
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
    document.getElementById("calculate").addEventListener("click", () => __awaiter(void 0, void 0, void 0, function* () {
        if (!saved) {
            throw new Error("Please save the information first.");
        }
        if (running) {
            throw new Error("The algorithm is already running.");
        }
        running = true;
        statusText.textContent = "Running...";
        statusText.style.color = "green";
        const swarm = new SwarmAlgorithm(selectedFunction /*functionType*/, particles /*particles*/, epochs /*epochs*/, inertia /*inertia*/, cognitive /*cognitive*/, social /*social*/, 0 /*beginRange*/, 10 /*endRange*/, optimum /*optimum*/, precision /*filterPrecision*/);
        swarm.run();
        // w javie tu new Thread
        let logs = "";
        for (let i = 0; i < swarm.bestSolutions.length; i++) {
            yield new Promise((resolve) => setTimeout(resolve, delay));
            document.getElementById("result-content").textContent = swarm.bestSolutions[i].toFixed(10);
            // document.getElementById("pso_global_best_solution_text").textContent = swarm.oldSolutions[i];
            // document.getElementById("pso_x_value_text").textContent = swarm.bestPositions[i].x;
            // document.getElementById("pso_y_value_text").textContent = swarm.bestPositions[i].y;
            logs = swarm.logs[i] + "\n" + logs;
            document.getElementById("logs-content").textContent = logs;
            // document.getElementById("pso_current_epoch_number_text").textContent = i.toString();
            // if (i === this.bestPositions.length - 1) document.getElementById("pso_global_best_solution_text").textContent = swarm.bestSolutions[i];
        }
        running = false;
        statusText.textContent = "Idle";
        statusText.style.color = "orange";
        console.log(swarm);
        // document.getElementById("pso_current_best_solution_text").textContent = "";
    }));
});
