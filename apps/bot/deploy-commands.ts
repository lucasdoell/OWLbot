import { REST, Routes } from "discord.js";
import fs from "node:fs";
import path from "node:path";

const dotenv = require("dotenv");
dotenv.config();

const clientId = process.env.CLIENT_ID as string;
const guildId = process.env.GUILD_ID as string;
const token = process.env.DISCORD_TOKEN as string;

const commands: string[] = [];
// Grab all the command files from the commands directory you created earlier
const commandsPath = path.join(__dirname, "dist");
const commandFiles = fs
  .readdirSync(commandsPath)
  .filter((file) => file.endsWith(".js"));

// Grab the SlashCommandBuilder#toJSON() output of each command's data for deployment
for (const file of commandFiles) {
  const command = require(`./dist/${file}`);
  commands.push(command.data.toJSON());
}

// Construct and prepare an instance of the REST module
const rest = new REST({ version: "10" }).setToken(token);

// and deploy your commands!
(async () => {
  try {
    console.log(
      `Started refreshing ${commands.length} application (/) commands.`
    );

    // The put method is used to fully refresh all global commands with the current set
    await rest.put(Routes.applicationCommands(clientId), { body: commands });

    // The put method is used to fully refresh all commands in the guild with the current set
    // await rest.put(
    //   Routes.applicationGuildCommands(clientId, guildId),
    //   { body: commands }
    // );

    console.log(
      `Successfully reloaded ${commands.length} application (/) commands.`
    );
  } catch (error) {
    // And of course, make sure you catch and log any errors!
    console.error(error);
  }
})();
