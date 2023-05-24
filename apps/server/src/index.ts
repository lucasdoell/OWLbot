import puppeteer from "puppeteer-core";
import chrome from "chrome-aws-lambda";
import express from "express";
import cron from "node-cron";
import { warning, success, error, info } from "./consts";

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
  try {
    console.log(warning("Accessing /api/schedule..."));

    const document = await fetchPage(
      "https://overwatchleague.com/en-us/schedule"
    );

    return document;
  } catch (err) {
    console.log(error("Error accessing /api/schedule"));
    console.log(error(err));
  }
  console.log(success("Successfully accessed /api/schedule"));
}

async function fetchPage(url: string) {
  const options = {
    args: chrome.args,
    executablePath: "/usr/bin/google-chrome",
  };

  const browser = await puppeteer.launch(options);
  const page = await browser.newPage();
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
  return await page.content();
}

// function extractData(data: string) {
//   const dom = new JSDOM(data);
//   const document = dom.window.document;

//   let week = document.querySelector(
//     ".schedule-boardstyles__Title-j4x5cc-4.iglKJd"
//   );

//   let schedule: HTMLElement[] = Array.from(
//     document.querySelectorAll(
//       ".schedule-boardstyles__ContainerCards-j4x5cc-8.jcvNlt"
//     )
//   );

//   const matchDayRegex =
//     /\b(?:MON|TUE|WED|THU|FRI|SAT|SUN), (?:JAN|FEB|MAR|APR|MAY|JUN|JUL|AUG|SEP|OCT|NOV|DEC) d{1,2}\b/;

//   const matchTimeRegex = /\b(?:\d{1,2}:\d{2} [AP]M|Final)\b/;

//   // For each item in schedule, get the match day and time
//   const matches: string[] = [];
//   for (let i = 0; i < schedule.length; i++) {
//     matches.push(schedule[i].children[0].textContent!);
//   }

//   console.log(matches);
// }
