// Pausa la musica y se va
const { SlashCommandBuilder } = require('@discordjs/builders');
const { getVoiceConnection } = require('@discordjs/voice');
const { leaveVoiceChannel } = require('@discordjs/voice');
const { AttachmentBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('stop')
    .setDescription('Detiene la reproducción de música y sale del canal de voz'),

  async execute(interaction) {
    await interaction.deferReply();

    try {
      const voiceChannel = interaction.member.voice.channel;
      if (!voiceChannel) {
        return interaction.editReply('¡Debes estar en un canal de voz para usar este comando!');
      }

      const connection = getVoiceConnection(voiceChannel.guild.id);
      if (connection) {
        connection.destroy();
      }

      await interaction.editReply({
        content: '!Musica Terminada¡ Devs.bot salió del canal de voz :paz:',
        files: [new AttachmentBuilder('./assets/images/background2.webp', { name: 'background.png' })],
      });
    } catch (error) {
      console.error('Ocurrió un error:', error);
      await interaction.editReply('Ocurrió un error al ejecutar el comando.');
    }
  },
};
