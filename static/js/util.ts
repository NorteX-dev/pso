export const appendLog = (log: string) => {
	document.getElementById("logs-content")!.textContent += log;
};

export async function wait(ms: number) {
	await new Promise((resolve) => setTimeout(resolve, ms));
}

export const showAlert = (message: string | null, type: string) => {
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
};

export const exportToCsv = (data: any[], decimalPlaces: number) => {
	const csvRows = [];
	const headers = Object.keys(data[0]);
	csvRows.push(headers.join(","));

	for (const row of data) {
		if (row.globalBest === 0) {
			continue;
		}

		const values = headers.map((header) => {
			let value = row[header];
			const columnsToBeParsedAsFloats = ["globalBest", "currentBest", "bestX", "bestY"];
			if (columnsToBeParsedAsFloats.includes(header)) {
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
};
