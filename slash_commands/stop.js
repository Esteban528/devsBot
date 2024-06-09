const { SlashCommandBuilder } = require('@discordjs/builders');
const { EmbedBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('stop')
    .setDescription('Pausa la música sin desconectar el bot.▶️'),

  async execute(interaction, client) {
    await interaction.deferReply();

    try {
      const voiceChannel = interaction.member.voice.channel;
      if (!voiceChannel) {
        const embed = new EmbedBuilder().setColor('#FF0000').setDescription('¡Debes estar en un canal de voz para usar este comando!🧨');
        return interaction.editReply({ embeds: [embed] });
      }

      const serverQueue = client.queue.get(interaction.guild.id);
      if (!serverQueue || !serverQueue.audioPlayer) {
        const embed = new EmbedBuilder().setColor('#FF0000').setDescription('No hay ninguna canción reproduciéndose.🧨');
        return interaction.editReply({ embeds: [embed] });
      }

      serverQueue.audioPlayer.pause();

      const embed = new EmbedBuilder()
        .setColor('#0099ff')
        .setDescription('La música ha sido pausada.');
      await interaction.editReply({ embeds: [embed] });

    } catch (error) {
      console.error('Ocurrió un error:', error);
      const embed = new EmbedBuilder().setColor('#FF0000').setDescription('Ocurrió un error al ejecutar el comando.🧨');
      await interaction.editReply({ embeds: [embed] });
    }
  },
};
