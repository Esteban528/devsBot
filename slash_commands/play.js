const { SlashCommandBuilder } = require('@discordjs/builders');
const { joinVoiceChannel, createAudioPlayer, createAudioResource, AudioPlayerStatus } = require('@discordjs/voice');
const ytdl = require('ytdl-core');
const { AttachmentBuilder, EmbedBuilder, ButtonBuilder, ActionRowBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('play')
    .setDescription('Reproduce música desde un enlace de YouTube')
    .addStringOption(option => option.setName('url').setDescription('La URL del video de YouTube').setRequired(true)),
  
  async execute(interaction) {
    await interaction.deferReply();

    try {
      const url = interaction.options.getString('url');
      if (!ytdl.validateURL(url)) {
        return interaction.editReply('Por favor, proporciona una URL válida de YouTube.');
      }

      const voiceChannel = interaction.member.voice.channel;
      if (!voiceChannel) {
        return interaction.editReply('¡Debes estar en un canal de voz para usar este comando!');
      }

      const connection = joinVoiceChannel({
        channelId: voiceChannel.id,
        guildId: interaction.guild.id,
        adapterCreator: interaction.guild.voiceAdapterCreator,
      });

      const player = createAudioPlayer();
      const stream = ytdl(url, { filter: 'audioonly' });
      const resource = createAudioResource(stream);
      player.play(resource);
      connection.subscribe(player);

      const info = await ytdl.getInfo(url);
      const buffer = await ytdl.getBasicInfo(url);
      const attachment = new AttachmentBuilder(buffer.videoDetails.thumbnail.thumbnails[0].url, { name: 'thumbnail.png' });
      const thumbnailUrl = `attachment://thumbnail.png`;

      const embed = new EmbedBuilder()
        .setColor('#0099ff')
        .setAuthor({ name: interaction.client.user.username, iconURL: interaction.client.user.displayAvatarURL() })
        .setTitle(`¡Reproduciendo! ${info.videoDetails.title}`)
        .setDescription(`Duración: ${info.videoDetails.lengthSeconds}s`)
        .setThumbnail(thumbnailUrl);

      await interaction.editReply({ embeds: [embed], files: [attachment] });
    } catch (error) {
      console.error('Ocurrió un error:', error);
      await interaction.editReply('Ocurrió un error al ejecutar el comando.');
    }
  },
};

