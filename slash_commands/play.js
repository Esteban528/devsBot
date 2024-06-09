const { SlashCommandBuilder } = require('@discordjs/builders');
const { joinVoiceChannel, createAudioPlayer, createAudioResource, AudioPlayerStatus, VoiceConnectionStatus, entersState } = require('@discordjs/voice');
const ytdl = require('ytdl-core');
const { EmbedBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('play')
    .setDescription('Reproduce música desde un enlace de YouTube.🔊')
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
          .setTitle(`¡Reproduciendo ahora!`)
          .setDescription(`[${song.title}](${song.url})`) 
          .setFooter(`**Duración:** ${song.duration}  <a:_:1243291310148816986>`)
          .setThumbnail(song.thumbnail);
        return interaction.editReply({ embeds: [embed] });
      }

      const queueContruct = {
        voiceChannel: voiceChannel,
        connection: null,
        songs: [],
        audioPlayer: createAudioPlayer(),
      };

      client.queue.set(interaction.guild.id, queueContruct);
      queueContruct.songs.push(song);

      const playSong = async (guild, song) => {
        const serverQueue = client.queue.get(guild.id);

        if (!song) {
          serverQueue.connection.destroy();
          client.queue.delete(guild.id);
          return;
        }

        let stream;
        try {
          stream = ytdl(song.url, { filter: 'audioonly' });
        } catch (error) {
          console.error('Error al obtener el stream de YouTube:', error);
          const embed = new EmbedBuilder().setColor('#FF0000').setDescription('Error al obtener el stream de YouTube.🧨');
          await interaction.editReply({ embeds: [embed] });
          return;
        }

        const resource = createAudioResource(stream);

        serverQueue.audioPlayer.play(resource);

        serverQueue.audioPlayer.once(AudioPlayerStatus.Idle, () => {
          serverQueue.songs.shift();
          playSong(guild, serverQueue.songs[0]);
        });

        serverQueue.audioPlayer.on('error', error => {
          console.error('Error en el AudioPlayer:', error);
          serverQueue.songs.shift();
          playSong(guild, serverQueue.songs[0]);
        });
      };

      const connection = joinVoiceChannel({
        channelId: voiceChannel.id,
        guildId: interaction.guild.id,
        adapterCreator: interaction.guild.voiceAdapterCreator,
      });

      queueContruct.connection = connection;
      connection.subscribe(queueContruct.audioPlayer);

      connection.on(VoiceConnectionStatus.Disconnected, async () => {
        try {
          await Promise.race([
            entersState(connection, VoiceConnectionStatus.Signalling, 5_000),
            entersState(connection, VoiceConnectionStatus.Connecting, 5_000),
          ]);
        } catch (error) {
          client.queue.delete(interaction.guild.id);
          connection.destroy();
        }
      });

      playSong(interaction.guild, queueContruct.songs[0]);

      const embed = new EmbedBuilder()
        .setColor('#0099ff')
        .setTitle(`¡Reproduciendo ahora!`)
        .setDescription(`[${song.title}](${song.url})\n**Duración:** ${song.duration}  <a:_:1243291310148816986>`) 
        .setThumbnail(song.thumbnail);
      await interaction.editReply({ embeds: [embed] });

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
