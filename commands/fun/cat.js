const { SlashCommandBuilder } = require("discord.js");
const fetch = require("node-fetch");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("cat")
    .setDescription("Sends a random cat picture 🐱"),

  async execute(interaction) {
    await interaction.deferReply(); // so bot doesn’t time out if API is slow

    try {
      const res = await fetch("https://api.thecatapi.com/v1/images/search");
      const data = await res.json();

      if (!data.length || !data[0].url) {
        return interaction.editReply(
          "😿 Could not fetch a cat picture right now."
        );
      }

      await interaction.editReply(data[0].url);
    } catch (error) {
      console.error(error);
      await interaction.editReply(
        "❌ Something went wrong fetching the cat picture."
      );
    }
  },
};
