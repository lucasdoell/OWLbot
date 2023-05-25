import axios from "axios";
import { SlashCommandBuilder, EmbedBuilder } from "discord.js";

module.exports = {
  data: new SlashCommandBuilder()
    .setName("schedule")
    .setDescription("Returns the schedule for the current week"),
  async execute(interaction) {
    const data = await axios.get("https://owl-api.lux.dev/api/schedule/cache");
    const embed = new EmbedBuilder()
      .setColor(0x009dcf)
      .setTitle("Schedule")
      .setURL("https://lux.dev")
      .addFields(
        data.data.matches.map((match) => {
          return {
            name: `${match.team1} vs ${match.team2}`,
            value: `${match.time} on ${match.date}`,
            inline: true,
          };
        })
      )
      .setAuthor({
        name: "OWL Bot",
        url: "https://lux.dev",
      })
      .setDescription(
        "The schedule for the current week. All times are in EST."
      )
      .setFooter({
        text: "Written by lux#5470",
        iconURL: "https://avatars.githubusercontent.com/u/55987186",
      })
      .setTimestamp();

    await interaction.reply({ embeds: [embed] });
  },
};
