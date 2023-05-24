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

cron.schedule("* * * * *", () => {
  console.log(info("Test cron job"));
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

    console.log(success("Successfully accessed /api/schedule"));
    return extractData(document);
  } catch (err) {
    console.log(error("Error accessing /api/schedule"));
    console.log(error(err));
  }
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
  return await page.content();
}

type Match = {
  date: string;
  team1: string;
  team2: string;
  time: string;
};

function getFirstChunk(str: string): string {
  const chunks = str.split("\nWeek 5\n");
  let firstChunk = chunks[0];
  // Remove ENCORE lines
  firstChunk = firstChunk.replace(/ENCORE: .*/g, "");
  return firstChunk;
}

function extractMatches(str: string, regex: RegExp): string[] {
  const matches = Array.from(str.matchAll(regex));
  return matches.map((match) => match[0]);
}

function extractDates(str: string): string[] {
  const dateRegex = /\w{3}, \w{3} \d{2}/g;
  return extractMatches(str, dateRegex);
}

function extractTimes(str: string): string[] {
  const timeRegex = /\d{1,2}:\d{2} (PM|AM)/g;
  return extractMatches(str, timeRegex);
}

function extractTeams(str: string): string[] {
  const teamRegex = /(?<=(\n))([A-Z0-9]{3})(?=(\n))/g;
  return extractMatches(str, teamRegex);
}

function formatMatches(schedule: string): Match[] {
  const matches = schedule.split(/(?=\w{3}, \w{3} \d{2}\n)/g);
  const formattedMatches: Match[] = [];

  for (const match of matches) {
    const date = extractDates(match);
    const time = extractTimes(match);
    const teams = extractTeams(match);

    for (let i = 0, j = 0; i < time.length; i++, j += 2) {
      formattedMatches.push({
        date: date[i],
        team1: teams[j],
        team2: teams[j + 1],
        time: time[i],
      });
    }
  }

  return formattedMatches;
}

function printMatches(matches: Match[]): void {
  for (const match of matches) {
    console.log(
      `${match.date}\n${match.team1} vs. ${match.team2}\n${match.time}`
    );
  }
}

function extractData(data: string) {
  const schedule = getFirstChunk(data);
  const matches = formatMatches(schedule);
  printMatches(matches);
}
