const { SlashCommandBuilder } = require('discord.js');
const runGemini = require("../utils/ia/Gemini.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName('ia')
    .setDescription('🤖 Habla con ChatIA.')
    .addStringOption(option => 
      option.setName('prompt')
        .setDescription('🤖 Pregúntale cualquier cosa.')
        .setRequired(true)),

  async execute(interaction) {
    const prompt = interaction.options.getString('prompt');
    await interaction.deferReply(); // Defer the reply to avoid timeouts
    
    try {
      const result = await runGemini(prompt);
      const responses = splitString(result);
      for (const response of responses) {
        await interaction.followUp({ content: response, ephemeral: true });
      }
    } catch (error) {
      console.error("Error ejecutando runGemini:", error);

      // Manejo específico del error de GoogleGenerativeAI
      if (error.message.includes('SAFETY')) {
        await interaction.followUp({ content: "La respuesta fue bloqueada por políticas de seguridad.", ephemeral: true });
      } else {
        await interaction.followUp({ content: "Ocurrió un error al ejecutar el comando.", ephemeral: true });
      }
    }
  }
};

function splitString(inputString) {
  const maxLength = 2000;

  if (inputString.length > maxLength) {
    const part1 = inputString.slice(0, maxLength);
    const part2 = inputString.slice(maxLength);
    return [part1, part2];
  } else {
    return [inputString];
  }
}
