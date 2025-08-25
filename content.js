function autoClickAndDownload() {
    const buttonSelector = 'input[value="Load More..."]';
    const rowSelector = 'table tr'; // Adjust if needed

    function clickButton() {
        const button = document.querySelector(buttonSelector);
        if (button) {
            console.log("Clicking Load More...");
            const currentCount = document.querySelectorAll(rowSelector).length;

            button.click();

            const interval = setInterval(() => {
                const newCount = document.querySelectorAll(rowSelector).length;
                if (newCount > currentCount) {
                    clearInterval(interval);
                    setTimeout(clickButton, 1500); // Continue clicking
                } else if (!document.querySelector(buttonSelector)) {
                    clearInterval(interval);
                    console.log("No more Load More button. Extracting data...");
                    extractAndDownloadCSV();
                }
            }, 1500);
        } else {
            console.log("No Load More button. Extracting data...");
            extractAndDownloadCSV();
        }
    }

    function extractAndDownloadCSV() {
        const rows = document.querySelectorAll('table tr');
        let csvContent = [];

        rows.forEach(row => {
            const cols = row.querySelectorAll('td, th');
            let rowData = [];
            cols.forEach(col => rowData.push(col.innerText.trim().replace(/\n/g, ' ')));
            if (rowData.length > 0) csvContent.push(rowData.join(","));
        });

        const csvBlob = new Blob([csvContent.join("\n")], { type: 'text/csv' });
        const url = URL.createObjectURL(csvBlob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'trademark_data.csv';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        console.log("CSV downloaded with " + csvContent.length + " rows.");
    }

    clickButton();
}

window.addEventListener('load', () => {
    setTimeout(autoClickAndDownload, 2000);
});
