import puppeteer from "puppeteer-core";
import chrome from "chrome-aws-lambda";
import express from "express";
import cron from "node-cron";
import { warning, success, error, info } from "./consts";
import { extractData } from "./extract";

const app = express();
const port = 8080;

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.listen(port, () => {
  console.log(success(`OWLbot server listening on port ${port}`));
});

// Run a cron job every day to update the schedule
cron.schedule("0 0 * * *", () => {
  console.log(info("Running cron job..."));
});

app.get("/api/schedule", async (req, res) => {
  const schedule = await getSchedule();
  res.send(schedule);
});

async function getSchedule() {
  let document: string;
  try {
    console.log(warning("Accessing /api/schedule..."));

    document = await fetchPage("https://overwatchleague.com/en-us/schedule");

    console.log(success("Successfully accessed /api/schedule"));
  } catch (err) {
    console.log(error("Error accessing /api/schedule"));
    console.log(error(err));
    document = "error";
  }

  return extractData(document);
}

async function fetchPage(url: string) {
  const options = {
    args: chrome.args,
    executablePath: "/usr/bin/google-chrome",
  };

  const browser = await puppeteer.launch(options);
  const page = await browser.newPage();
  await page.emulateTimezone("America/New_York");
  await page.setRequestInterception(true);

  page.on("request", (req) => {
    if (
      req.resourceType() == "stylesheet" ||
      req.resourceType() == "font" ||
      req.resourceType() == "image"
    ) {
      req.abort();
    } else {
      req.continue();
    }
  });

  await page.goto(url, { waitUntil: "networkidle2", timeout: 50000 });
  const extractedText = await page.$eval("*", (el: any) => el.innerText);
  return extractedText;
}
