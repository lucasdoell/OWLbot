import puppeteer from "puppeteer-core";
// import { JSDOM } from "jsdom";
import chrome from "chrome-aws-lambda";
import chalk from "chalk";
import express from "express";

const app = express();
const port = 8080;

// Output colors
const warning = chalk.yellow;
const success = chalk.greenBright;
const error = chalk.redBright;

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.listen(port, () => {
  console.log(success(`OWLbot server listening on port ${port}`));
});

app.get("/api/schedule", async (req, res) => {
  console.log(warning("Accessing /api/schedule..."));

  const document = await fetchPage(
    "https://overwatchleague.com/en-us/schedule"
  );

  // const data = extractData(document);

  // res.send(`Schedule: ${data}`);
  res.send(document);
});

async function fetchPage(url: string) {
  const options = {
    args: chrome.args,
    // args: ["--no-sandbox", "--disable-setuid-sandbox"],
    executablePath: "/usr/bin/google-chrome",
  };

  const browser = await puppeteer.launch(options);
  const page = await browser.newPage();
  await page.goto(url, { waitUntil: "networkidle0" });
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
