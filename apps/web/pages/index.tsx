import { Button, buttonVariants } from "@/components/ui/Button";
import Head from "next/head";
import Image from "next/image";
import Link from "next/link";

export default function Web() {
  return (
    <main>
      <Head>
        <title>OWL Bot</title>
        <meta name="description" content="Overwatch League Bot" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Image
        src="/owlbot.png"
        alt="OWL Bot"
        width={800}
        height={800}
        className="mx-auto h-72 w-auto"
      />

      <h1 className="text-center text-4xl font-extrabold pt-10">OWL Bot</h1>
      <h2 className="text-center text-xl font-bold pt-5">
        An easy way to see the Overwatch League schedule and team rosters.
      </h2>

      <div className="flex justify-center pt-6">
        <Button variant="outline" asChild>
          <Link href="/">How It Works</Link>
        </Button>
        <div className="p-1" />
        <Button asChild className="dark:bg-white dark:text-black">
          <Link href="/invite">Add The Bot</Link>
        </Button>
      </div>

      <section className="max-w-4xl mx-auto pt-8">
        <h2 className="text-2xl py-4 font-bold">Commands</h2>
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
      </section>
    </main>
  );
}
