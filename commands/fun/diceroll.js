const { SlashCommandBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("diceroll")
    .setDescription("Rolls a dice with a specified number of sides.")
    .addIntegerOption((option) =>
      option
        .setName("sides")
        .setDescription("Number of sides on the dice")
        .setMinValue(2)
        .setMaxValue(1000)
        .setRequired(true)
    ),
  async execute(interaction) {
    const sides = interaction.options.getInteger("sides");
    const result = Math.floor(Math.random() * sides) + 1;
    await interaction.reply(`🎲 You rolled a **${result}** (1-${sides})`);
  },
};
