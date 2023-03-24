import { NextApiRequest, NextApiResponse } from "next";
import { JSDOM } from "jsdom";
import chrome from "chrome-aws-lambda";
import puppeteer from "puppeteer-core";

async function fetchPage(url: string) {
  const options =
    // eslint-disable-next-line turbo/no-undeclared-env-vars
    process.env.NODE_ENV === "production"
      ? {
          args: chrome.args,
          executablePath: await chrome.executablePath,
          headless: chrome.headless,
        }
      : {
          args: [],
          executablePath:
            process.platform === "win32"
              ? "C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe"
              : process.platform === "linux"
              ? "/usr/bin/google-chrome"
              : "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
        };

  const browser = await puppeteer.launch(options);
  const page = await browser.newPage();
  await page.goto(url, { waitUntil: "networkidle0" });
  return await page.content();
}

function extractData(data: string) {
  const dom = new JSDOM(data);
  const document = dom.window.document;

  let week = document.querySelector(
    ".schedule-boardstyles__Title-j4x5cc-4.iglKJd"
  );

  let schedule: HTMLElement[] = Array.from(
    document.querySelectorAll(
      ".schedule-boardstyles__ContainerCards-j4x5cc-8.jcvNlt"
    )
  );

  const matchDayRegex =
    /\b(?:MON|TUE|WED|THU|FRI|SAT|SUN), (?:JAN|FEB|MAR|APR|MAY|JUN|JUL|AUG|SEP|OCT|NOV|DEC) d{1,2}\b/;

  const matchTimeRegex = /\b(?:\d{1,2}:\d{2} [AP]M|Final)\b/;

  // For each item in schedule, get the match day and time
  const matches: string[] = [];
  for (let i = 0; i < schedule.length; i++) {
    matches.push(schedule[i].children[i].children[0].textContent!);
  }

  // const matchDay = schedule.map((item) => {
  //   const matchInfo = item.children[2].textContent!;

  //   console.log(matchInfo);
  // });

  // Get the third child of the schedule card
  // const match = schedule[0].children[2].textContent!;

  console.log(matches);
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const document = await fetchPage(
    "https://overwatchleague.com/en-us/schedule"
  );

  // console.log(document);

  const data = extractData(document);

  // console.log(data);

  res.status(200).json({ name: "John Doe" });
}
