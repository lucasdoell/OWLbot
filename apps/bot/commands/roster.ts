import axios from "axios";
import { SlashCommandBuilder, EmbedBuilder } from "discord.js";

module.exports = {
  data: new SlashCommandBuilder()
    .setName("roster")
    .setDescription("Gets the roster for a given team")
    .addStringOption((option) =>
      option
        .setName("team")
        .setDescription("The team to get the roster for")
        .setRequired(true)
    ),
  async execute(interaction) {
    const data = await axios.get(
      `https://owl-api.lux.dev/api/roster?team=${interaction.options.getString(
        "team"
      )}`
    );

    if (data.data.error) {
      await interaction.reply({
        content: data.data.error,
        ephemeral: true,
      });
      return;
    }

    const urlSafeTeamName = data.data.teamName.replace(/ /g, "_");
    const embed = new EmbedBuilder()
      .setColor(0x009dcf)
      .setTitle(`${data.data.teamName} Roster`)
      .setURL(`https://liquipedia.net/overwatch/${urlSafeTeamName}`)
      .addFields(
        data.data.players.map((player) => {
          return {
            name: `${player.id}`,
            value: `${player.name} • ${player.position}, joined on ${player.joinDate}`,
          };
        })
      )
      .setAuthor({
        name: "OWL Bot",
        url: "https://lux.dev",
      })
      .setFooter({
        text: "Written by lux#5470 @lux_fps",
        iconURL: "https://avatars.githubusercontent.com/u/55987186",
      })
      .setTimestamp();

    await interaction.reply({ embeds: [embed] });
  },
};
