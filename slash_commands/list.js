const { SlashCommandBuilder } = require('@discordjs/builders');
const { EmbedBuilder, AttachmentBuilder } = require('discord.js');
const path = require('path');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('list')
    .setDescription('Muestra la lista de canciones en la fila.📜'),

  async execute(interaction, client) {
    await interaction.deferReply();

    try {
      const serverQueue = client.queue.get(interaction.guild.id);
      if (!serverQueue || serverQueue.songs.length === 0) {
        const embed = new EmbedBuilder().setColor('#FF0000').setDescription('No hay ninguna canción en la fila.🧨');
        return interaction.editReply({ embeds: [embed] });
      }

      const songList = serverQueue.songs.map((song, index) => `${index + 1}. ${song.title}`).join('\n');
      
      const imagePath = path.join(__dirname, '../assets/images/background3.png');
      const attachment = new AttachmentBuilder(imagePath, { name: 'background3.png' });
      
      const embed = new EmbedBuilder()
        .setColor('#0099ff')
        .setDescription(`**Lista de canciones:**\n${songList}`)
        .setThumbnail('attachment://background3.png');

      await interaction.editReply({ embeds: [embed], files: [attachment] });

    } catch (error) {
      console.error('Ocurrió un error:', error);
      const embed = new EmbedBuilder().setColor('#FF0000').setDescription('Ocurrió un error al ejecutar el comando.🧨');
      await interaction.editReply({ embeds: [embed] });
    }
  },
};
