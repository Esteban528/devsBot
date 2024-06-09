// Hace un mensaje como si fuera Twitter
const { ChatInputCommandInteraction, SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const canvafy = require('canvafy');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('tweet')
        .setDescription('Este comando permite hacer un tweet.💬')
        .addStringOption(option => option
            .setName('texto')
            .setDescription('Escribe el texto que quieras que salga en el tweet.💬')
            .setMaxLength(1000)
            .setMinLength(1)
            .setRequired(true)),

    /**
     * 
     * @param { ChatInputCommandInteraction } interaction
     * @param { Client } client
     */

    async execute(interaction, client) {
        try {
            const user = interaction.user;
            const comment = interaction.options.getString('texto');
            const userAvatar = user.displayAvatarURL({ forceStatic: true, size: 1024, extension: 'png' });

            const tweet = await new canvafy.Tweet()
            .setTheme('dark')
            .setUser({ displayName: `${user.globalName}`, username: `${user.username}`})
            .setVerified(true)
            .setComment(`${comment}`)
            .setAvatar(`${userAvatar}`)
            .build();

            interaction.reply({
                files: [{
                    attachment: tweet,
                    name: `tweet-${user}.png`
                }]
            });
        } catch (error) {
            if (error instanceof DiscordAPIError && error.code === 10062) {
                console.log('La interacción ha expirado o no es válida.');
            } else {
                console.error('Ocurrió un error inesperado:', error);
            }
        }
    },
};
