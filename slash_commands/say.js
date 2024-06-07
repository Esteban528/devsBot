// El Bot habla por ti
const Discord = require("discord.js");

// Mensaje repitiendo
module.exports = {
    // datos del comando
    data : new Discord. SlashCommandBuilder()
      .setName("say")
      .setDescription("El bot dirá lo que tu desees.")
      .addStringOption ((option) =>
        option
          .setName("mensaje")
          .setDescription("Mensaje que repetira el bot.")
          .setMinLength(5)
          .setMaxLength(100)
          .setRequired(true)
    ),
    // ejecución del comando
    execute: async (interaction) => {
        // Obtener texto
        const text = interaction.options.getString("mensaje");

        // respondemos a la interacción
        interaction.reply(text).catch(console.error);
    },
};

