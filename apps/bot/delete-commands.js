const { REST, Routes } = require("discord.js");
const fs = require("node:fs");
const path = require("node:path");

const dotenv = require("dotenv");
dotenv.config();

const clientId = process.env.CLIENT_ID;
const guildId = process.env.GUILD_ID;
const token = process.env.DISCORD_TOKEN;

const commands = [];
// Grab all the command files from the commands directory you created earlier
const commandsPath = path.join(__dirname, "commands");
const commandFiles = fs
  .readdirSync(commandsPath)
  .filter((file) => file.endsWith(".js"));

// Grab the SlashCommandBuilder#toJSON() output of each command's data for deployment
for (const file of commandFiles) {
  const command = require(`./commands/${file}`);
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

    // // for global commands
    // rest
    //   .put(Routes.applicationCommands(clientId), { body: [] })
    //   .then(() => console.log("Successfully deleted all application commands."))
    //   .catch(console.error);

    // for guild-based commands
    rest
      .put(Routes.applicationGuildCommands(clientId, guildId), { body: [] })
      .then(() => console.log("Successfully deleted all guild commands."))
      .catch(console.error);
  } catch (error) {
    // And of course, make sure you catch and log any errors!
    console.error(error);
  }
})();
