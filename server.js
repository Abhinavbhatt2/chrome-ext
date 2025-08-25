const express = require("express");
const puppeteer = require("puppeteer");

const app = express();
const PORT = 3000;

app.get("/scrape", async (req, res) => {
  try {
    const browser = await puppeteer.launch({
      headless: true,
      args: ["--no-sandbox", "--disable-setuid-sandbox"]
    });
    const page = await browser.newPage();
    await page.goto("https://tmrsearch.ipindia.gov.in/tmrpublicsearch/", { waitUntil: "networkidle2" });

    // Perform search for keyword and class
    await page.type("#TextBox1", "sty"); // Adjust selector for keyword
    await page.type("#TextBox2", "25"); // Adjust selector for class
    await page.click("#ContentPlaceHolder1_BtnSearch"); // Click search
    await page.waitForSelector("#ContentPlaceHolder1_LnkShowNext100");

    // Keep clicking "Load More" until no more
    let loadMoreVisible = true;
    while (loadMoreVisible) {
      try {
        await page.click("#ContentPlaceHolder1_LnkShowNext100");
        await page.waitForTimeout(2000);
      } catch {
        loadMoreVisible = false;
      }
    }

    // Extract company names
    const companies = await page.evaluate(() => {
      const rows = document.querySelectorAll("table tr td:nth-child(2)");
      return Array.from(rows).map(el => el.innerText.trim()).filter(Boolean);
    });

    await browser.close();
    res.json(companies);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
