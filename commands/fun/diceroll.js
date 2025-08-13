const { SlashCommandBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("diceroll")
    .setDescription("Rolls a dice. Default is 6 sides if not specified.")
    .addIntegerOption((option) =>
      option
        .setName("sides")
        .setDescription("Number of sides on the dice (default: 6)")
        .setMinValue(2)
        .setMaxValue(1000)
        .setRequired(false)
    ),
  async execute(interaction) {
    const sides = interaction.options.getInteger("sides") || 6;
    const result = Math.floor(Math.random() * sides) + 1;
    await interaction.reply(`🎲 You rolled a **${result}** (1-${sides})`);
  },
};
