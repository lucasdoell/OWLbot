import Head from "next/head";

export default function Page({}) {
  return (
    <main className="max-w-4xl mx-auto">
      <Head>
        <title>How It Works | OWL Bot</title>
        <meta name="description" content="Overwatch League Bot" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <h2 className="text-2xl">How It Works</h2>
      <p className="pt-2">
        OWL Bot is a Discord bot that provides information about the Overwatch
        League. It is built with Discord.js. It uses a custom API that I built
        with Express and TypeScript. The API and bot are hosted on Railway,
        while the website is hosted on Vercel.
      </p>
      <p className="pt-2">
        The API is quite complicated to implement. The Overwatch League website
        is a Next.js website using server-side rendering, which makes it quite
        hard to scrape with traditional web scraping methodologies. Instead of
        scraping the HTML provided upon initial request, I used Puppeteer to
        scrape the rendered HTML. This allows me to get the data that I need
        from the website, and then I can send it to the Discord bot.
      </p>
      <h2 className="text-2xl py-4">Commands</h2>
      <code className="rounded bg-gray-800 p-1">schedule</code>
      <p className="pt-2">
        The <code className="rounded bg-gray-800 p-1">schedule</code> command
        shows the current week&apos;s schedule. It shows the matches for each
        day and the starting time in EST.
      </p>

      <div className="py-4" />

      <code className="rounded bg-gray-800 p-1">roster [team]</code>
      <p className="pt-2">
        The <code className="rounded bg-gray-800 p-1">roster</code> command
        shows the roster for the specified team. It shows the player&apos;s
        names, role, and the date that they joined the team.
      </p>
    </main>
  );
}
