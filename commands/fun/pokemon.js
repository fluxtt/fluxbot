const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");

const MAX_ID = 1025;

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
      const input = interaction.options.getString("name");

      // Decide the query: explicit name/id or random id
      let idOrName;
      if (!input) {
        idOrName = String(Math.floor(Math.random() * MAX_ID) + 1);
      } else if (/^\d+$/.test(input.trim())) {
        idOrName = String(parseInt(input.trim(), 10));
      } else {
        idOrName = input.trim().toLowerCase();
      }

      // Fetch Pokémon core data
      const pRes = await fetch(`https://pokeapi.co/api/v2/pokemon/${idOrName}`);
      if (!pRes.ok) throw new Error("not_found");
      const p = await pRes.json();

      // Species for flavor text
      const sRes = await fetch(
        `https://pokeapi.co/api/v2/pokemon-species/${p.id}`
      );
      if (!sRes.ok) throw new Error("species_not_found");
      const s = await sRes.json();

      // English Pokédex flavor text (cleaned)
      const en = s.flavor_text_entries.filter((e) => e.language.name === "en");
      const flavor = (
        en.length
          ? en[Math.floor(Math.random() * en.length)].flavor_text
          : "No Pokédex entry available."
      )
        .replace(/\f/g, " ")
        .replace(/\s+/g, " ")
        .trim();

      // Prefer official artwork, fallback to front sprite
      const art =
        p.sprites?.other?.["official-artwork"]?.front_default ||
        p.sprites?.front_default ||
        null;

      // Types, height/weight
      const types = p.types
        .map((t) => t.type.name[0].toUpperCase() + t.type.name.slice(1))
        .join(", ");
      const heightM = (p.height / 10).toFixed(1);
      const weightKg = (p.weight / 10).toFixed(1);

      const embed = new EmbedBuilder()
        .setTitle(`#${p.id} — ${p.name.toUpperCase()}`)
        .setDescription(flavor)
        .addFields(
          { name: "Type", value: types || "Unknown", inline: true },
          { name: "Height", value: `${heightM} m`, inline: true },
          { name: "Weight", value: `${weightKg} kg`, inline: true }
        )
        .setColor(0xe3350d);

      if (art) embed.setThumbnail(art);

      await interaction.editReply({ embeds: [embed] });
    } catch (err) {
      console.error(err);
      const msg =
        err.message === "not_found"
          ? "❌ Pokémon not found. Try a different name/ID."
          : "❌ PokéAPI error. Try again in a bit.";
      await interaction.editReply(msg);
    }
  },
};
