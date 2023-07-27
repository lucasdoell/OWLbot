// Extraction types and functions for the schedule data

type Match = {
  date: string;
  team1: string;
  team2: string;
  time: string;
};

type WeekMatches = {
  week: string;
  matches: Match[];
};

function getFirstChunk(str: string): string {
  const chunks = str.split(/\nWeek \d+\n/);
  let firstChunk = chunks[0];
  // Remove ENCORE lines
  firstChunk = firstChunk.replace(/ENCORE: .*/g, "");
  return firstChunk;
}

function getWeekNumber(str: string): number {
  const weekRegex = /(WEEK|Week) (\d+)/;
  const match = str.match(weekRegex);
  if (match && match[2]) {
    return parseInt(match[2], 10);
  } else {
    throw new Error("No week number found in string");
  }
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
  const teamRegex = /(?<=(\n))([A-Z0-9]{3})(?=(\n|$))/g;
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

function getWeekMatches(schedule: string, weekNumber): string {
  const matches = formatMatches(schedule);

  const weekMatches: WeekMatches = {
    week: `Week ${weekNumber}`,
    matches: matches,
  };

  return JSON.stringify(weekMatches, null, 2);
}

export function extractData(data: string) {
  // const weekNum = getWeekNumber(data);
  const schedule = getFirstChunk(data);
  // console.log(getWeekMatches(schedule, weekNum));
  // return getWeekMatches(schedule, weekNum);
}

// Extraction types and functions for the roster data
import { teams } from "./consts";
import { load } from "cheerio";

interface PlayerInfo {
  id: string;
  number: string;
  name: string;
  position: string;
  joinDate: string;
}

interface TeamInfo {
  teamName: string;
  players: PlayerInfo[];
}

export function parseTeamName(input: string): string | undefined {
  const lowerInput = input.toLowerCase();

  // Check if input matches a team name exactly
  const exactMatch = teams.find(
    (team) => team.name.toLowerCase() === lowerInput
  );
  if (exactMatch) {
    return exactMatch.name;
  }

  // Check if input matches a team abbreviation exactly
  const abbreviationMatch = teams.find(
    (team) => team.abbreviation.toLowerCase() === lowerInput
  );
  if (abbreviationMatch) {
    return abbreviationMatch.name;
  }

  // Check if input matches any team aliases
  const aliasMatch = teams.find((team) =>
    team.aliases.some((alias) => alias.toLowerCase() === lowerInput)
  );
  if (aliasMatch) {
    return aliasMatch.name;
  }

  // No match found
  return undefined;
}

export function getTeamURL(teamName: string): string | undefined {
  const lowerTeamName = teamName.toLowerCase();
  const team = teams.find(
    (team) =>
      team.name.toLowerCase() === lowerTeamName ||
      team.abbreviation.toLowerCase() === lowerTeamName ||
      team.aliases.some((alias) => alias.toLowerCase() === lowerTeamName)
  );
  return team?.url;
}

export function extractRoster(
  html: string,
  teamName: string
): TeamInfo | undefined {
  const $ = load(html);

  const players: PlayerInfo[] = [];

  const rosterTable = $(
    "table.wikitable.wikitable-striped.roster-card"
  ).first();

  if (!rosterTable.length) {
    return undefined; // Return undefined if no table is found
  }

  const rows = rosterTable.find("tr.Player");

  rows.each((_, row) => {
    const id = $(row).find("td.ID a").attr("href")?.split("/").pop() || "";
    const number = $(row)
      .find("td.Number")
      .text()
      .trim()
      .replace("Number:", "")
      .trim();
    const name = $(row)
      .find("td.Name")
      .text()
      .trim()
      .replace(/[\(\)]/g, "");
    const position = $(row)
      .find("td.Position")
      .text()
      .trim()
      .replace("Position:", "")
      .trim();
    const joinDateRaw = $(row)
      .find("td.Date")
      .text()
      .trim()
      .replace("Join Date:", "");

    const joinDateMatch = joinDateRaw.match(/\d{4}-\d{2}-\d{2}/);
    const joinDate = joinDateMatch ? joinDateMatch[0] : "";

    const playerInfo: PlayerInfo = {
      id,
      number,
      name,
      position,
      joinDate,
    };

    players.push(playerInfo);
  });

  const teamInfo: TeamInfo = {
    teamName,
    players,
  };

  return teamInfo;
}
