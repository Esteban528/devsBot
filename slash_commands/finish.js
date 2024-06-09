const { SlashCommandBuilder } = require('@discordjs/builders');
const { getVoiceConnection } = require('@discordjs/voice');
const { EmbedBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('finish')
    .setDescription('Desconecta el bot del canal de voz.⏹️'),

  async execute(interaction, client) {
    await interaction.deferReply();

    try {
      const voiceChannel = interaction.member.voice.channel;
      if (!voiceChannel) {
        const embed = new EmbedBuilder().setColor('#FF0000').setDescription('¡Debes estar en un canal de voz para usar este comando!🧨');
        return interaction.editReply({ embeds: [embed] });
      }

      const connection = getVoiceConnection(interaction.guild.id);
      if (!connection) {
        const embed = new EmbedBuilder().setColor('#FF0000').setDescription('El bot no está conectado a ningún canal de voz.🧨');
        return interaction.editReply({ embeds: [embed] });
      }

      client.queue.delete(interaction.guild.id);
      connection.destroy();

      const embed = new EmbedBuilder()
        .setColor('#0099ff')
        .setTitle('¡El bot salió del Chat de Voz!')
        .setDescription('Música terminada... <a:_:1243291300216963243>') 
        .setThumbnail('attachment://background2.png');

      await interaction.editReply({ embeds: [embed], files: [{ attachment: './assets/images/background2.png', name: 'background2.png' }] });

    } catch (error) {
      console.error('Ocurrió un error:', error);
      const embed = new EmbedBuilder().setColor('#FF0000').setDescription('Ocurrió un error al ejecutar el comando.🧨');
      await interaction.editReply({ embeds: [embed] });
    }
  },
};
