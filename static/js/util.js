var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
export const appendLog = (log) => {
    document.getElementById("logs-content").textContent = log + "\n" + document.getElementById("logs-content").textContent;
};
export function wait(ms) {
    return __awaiter(this, void 0, void 0, function* () {
        yield new Promise((resolve) => setTimeout(resolve, ms));
    });
}
export const showAlert = (message, type) => {
    const existingAlert = document.querySelector(".alert-container");
    if (existingAlert)
        existingAlert.remove();
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
};
export const exportToCsv = (data, decimalPlaces) => {
    const csvRows = [];
    const headers = Object.keys(data[0]);
    csvRows.push(headers.join(","));
    for (const row of data) {
        if (row.globalBest === 0) {
            continue;
        }
        const values = headers.map((header) => {
            let value = row[header];
            if (["globalBest", "currentBest", "bestX", "bestY"].includes(header)) {
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
    const fileNameInput = document.getElementById("file-name");
    const fileName = fileNameInput.value || "data";
    link.download = `${fileName}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
};
