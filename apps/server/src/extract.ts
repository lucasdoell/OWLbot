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

// function getWeekNumber(str: string): number {
//   const weekRegex = /Week (\d+)/;
//   const match = str.match(weekRegex);
//   if (match && match[1]) {
//     return parseInt(match[1], 10);
//   } else {
//     throw new Error("No week number found in string");
//   }
// }

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

function getWeekMatches(schedule: string): string {
  // const weekNumber = getWeekNumber(schedule);
  const matches = formatMatches(schedule);

  const weekMatches: WeekMatches = {
    // week: `Week ${weekNumber}`,
    week: "Week 5",
    matches: matches,
  };

  return JSON.stringify(weekMatches, null, 2);
}

export function extractData(data: string) {
  const schedule = getFirstChunk(data);
  console.log(getWeekMatches(schedule));
  return getWeekMatches(schedule);
}
