const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("pokemon")
    .setDescription("Get a Pokémon with a Pokédex-style entry")
    .addStringOption((option) =>
      option
        .setName("name")
        .setDescription("Name or ID of the Pokémon (leave empty for random)")
        .setRequired(false)
    ),

  async execute(interaction) {
    await interaction.deferReply(); // in case API is slow

    try {
      let query = interaction.options.getString("name");

      if (!query) {
        // There are ~1025 Pokémon as of August 2025, adjust if needed
        const randomId = Math.floor(Math.random() * 1025) + 1;
      }

      // Fetch Pokémon data
      const pokemonRes = await fetch(
        `https://pokeapi.co/api/v2/pokemon/${query.toLowerCase()}`
      );
      if (!pokemonRes.ok) throw new Error("Pokémon not found");
      const pokemonData = await pokemonRes.json();

      // Fetch species data (for flavor text entries)
      const speciesRes = await fetch(
        `https://pokeapi.co/api/v2/pokemon-species/${pokemonData.id}`
      );
      const speciesData = await speciesRes.json();

      // Pick an English flavor text
      const flavorTexts = speciesData.flavor_text_entries.filter(
        (entry) => entry.language.name === "en"
      );
      const flavorText =
        flavorTexts.length > 0
          ? flavorTexts[
              Math.floor(Math.random() * flavorTexts.length)
            ].flavor_text.replace(/\f/g, " ")
          : "No Pokédex entry available.";

      // Format types
      const types = pokemonData.types.map((t) => t.type.name).join(", ");

      // Build embed
      const embed = new EmbedBuilder()
        .setTitle(`#${pokemonData.id} - ${pokemonData.name.toUpperCase()}`)
        .setDescription(flavorText)
        .setThumbnail(pokemonData.sprites.front_default)
        .addFields(
          { name: "Type", value: types, inline: true },
          {
            name: "Height",
            value: `${pokemonData.height / 10} m`,
            inline: true,
          },
          {
            name: "Weight",
            value: `${pokemonData.weight / 10} kg`,
            inline: true,
          }
        )
        .setColor(0xff0000);

      await interaction.editReply({ embeds: [embed] });
    } catch (err) {
      console.error(err);
      await interaction.editReply("❌ Pokémon not found or API error.");
    }
  },
};
