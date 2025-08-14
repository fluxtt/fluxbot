const { SlashCommandBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("announce")
    .setDescription("Send a message to the announcements channel.")
    .addStringOption((option) =>
      option
        .setName("message")
        .setDescription("The message to send.")
        .setRequired(true)
    ),

  async execute(interaction) {
    const targetChannelId = "1081303266438172706";
    const message = interaction.options.getString("message");

    try {
      const targetChannel = await interaction.client.channels.fetch(
        targetChannelId
      );
      if (!targetChannel) {
        return interaction.reply({
          content: "❌ Could not find the target channel.",
          ephemeral: true,
        });
      }

      await targetChannel.send(message);
      await interaction.reply({
        content: "✅ Message sent to announcements channel!",
        ephemeral: true,
      });
    } catch (error) {
      console.error(error);
      await interaction.reply({
        content: "❌ Failed to send the message.",
        ephemeral: true,
      });
    }
  },
};
