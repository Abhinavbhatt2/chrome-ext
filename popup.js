document.getElementById("scrapeBtn").addEventListener("click", async () => {
  const resultDiv = document.getElementById("result");
  resultDiv.innerHTML = "Scraping in progress...";

  try {
    const response = await fetch("http://localhost:3000/scrape");
    const data = await response.json();

    if (data && data.length > 0) {
      resultDiv.innerHTML = "<h4>Results:</h4><ul>" +
        data.map(item => `<li>${item}</li>`).join('') +
        "</ul>";
    } else {
      resultDiv.innerHTML = "No data found.";
    }
  } catch (error) {
    resultDiv.innerHTML = "Error: " + error.message;
  }
});
