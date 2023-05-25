import puppeteer from "puppeteer-core";
import chrome from "chrome-aws-lambda";
import express from "express";
import cron from "node-cron";
import fs from "fs";
import { warning, success, error, info, teams } from "./consts";
import {
  extractData,
  extractRoster,
  getTeamURL,
  parseTeamName,
} from "./extract";
import axios from "axios";

const app = express();
const port = 8080;

const cacheFilePath = "cache.json";

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.listen(port, () => {
  console.log(success(`OWLbot server listening on port ${port}`));
});

// Run a cron job every day to update the schedule
cron.schedule("0 0 * * *", async () => {
  console.log(info("Running cron job..."));
  await cacheSchedule();
});

app.get("/api/schedule", async (req, res) => {
  const schedule = await getSchedule();
  res.send(schedule);
});

app.get("/api/schedule/cache", async (req, res) => {
  const schedule = await getScheduleFromCache();
  res.send(schedule);
});

app.get("/api/roster", async (req, res) => {
  if (req.query.team === undefined) {
    res.send("Please specify a team.");
  }
  const team = decodeURI(req.query.team as string);
  const roster = await getRoster(team);
  if (roster === undefined) {
    res.send("Could not find the team you are looking for.");
  }
  res.send(roster);
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

async function getScheduleFromCache() {
  if (fs.existsSync(cacheFilePath)) {
    const schedule = fs.readFileSync(cacheFilePath, "utf8");
    console.log(info("Successfully retrieved schedule from cache"));
    return schedule;
  } else {
    console.log(warning("Cache file not found, creating new cache..."));
    await cacheSchedule();
    const schedule = fs.readFileSync(cacheFilePath, "utf8");
    return schedule;
  }
}

async function cacheSchedule() {
  console.log(info("Caching schedule..."));
  const schedule = await getSchedule();
  fs.writeFileSync(cacheFilePath, schedule);
  console.log(success("Successfully cached schedule"));
}

async function getRoster(team: string) {
  const teamName = parseTeamName(team);
  if (teamName === undefined) {
    console.log(error("Invalid team name: %s", team));
    return undefined;
  }

  const teamURL = getTeamURL(teamName);

  console.log(info(`Accessing roster for ${teamName}...`));

  const document = await axios.get(
    `https://liquipedia.net/overwatch/${teamURL}`
  );

  return extractRoster(document.data, teamName);
}
