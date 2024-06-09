const { SlashCommandBuilder } = require('@discordjs/builders');
const { EmbedBuilder } = require('discord.js');
const ytdl = require('ytdl-core');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('add')
    .setDescription('Añade música a la lista de reproducción desde un enlace de YouTube.🔊')
    .addStringOption(option => option.setName('url').setDescription('La URL del video de YouTube.🔊').setRequired(true)),

  async execute(interaction, client) {
    await interaction.deferReply();

    try {
      const url = interaction.options.getString('url');
      if (!ytdl.validateURL(url)) {
        const embed = new EmbedBuilder().setColor('#FF0000').setDescription('Por favor, proporciona una URL válida de YouTube.🧨');
        return interaction.editReply({ embeds: [embed] });
      }

      const voiceChannel = interaction.member.voice.channel;
      if (!voiceChannel) {
        const embed = new EmbedBuilder().setColor('#FF0000').setDescription('¡Debes estar en un canal de voz para usar este comando!🧨');
        return interaction.editReply({ embeds: [embed] });
      }

      const songInfo = await ytdl.getInfo(url);
      const song = {
        title: songInfo.videoDetails.title,
        url: songInfo.videoDetails.video_url,
        duration: formatDuration(songInfo.videoDetails.lengthSeconds),
        thumbnail: songInfo.videoDetails.thumbnails[0].url
      };

      let serverQueue = client.queue.get(interaction.guild.id);

      if (serverQueue) {
        serverQueue.songs.push(song);
        const embed = new EmbedBuilder()
          .setColor('#0099ff')
          .setTitle(`Añadido a la lista de reproducción:`)
          .setDescription(`[${song.title}](${song.url})\n**Duración:** ${song.duration}`)
          .setThumbnail(song.thumbnail);
        return interaction.editReply({ embeds: [embed] });
      } else {
        const embed = new EmbedBuilder().setColor('#FF0000').setDescription('No hay una lista de reproducción activa. Usa /play para iniciar una.🧨');
        return interaction.editReply({ embeds: [embed] });
      }

    } catch (error) {
      console.error('Ocurrió un error:', error);
      const embed = new EmbedBuilder().setColor('#FF0000').setDescription('Ocurrió un error al ejecutar el comando.🧨');
      await interaction.editReply({ embeds: [embed] });
    }
  },
};

function formatDuration(seconds) {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
}
