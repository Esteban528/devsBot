const Discord = require("discord.js");

module.exports = {
	data: new Discord.SlashCommandBuilder()
		.setName("say")
		.setDescription("👥 El bot dirá lo que tu desees.")
		.addStringOption((option) =>
			option
				.setName("mensaje")
				.setDescription("👥 Mensaje que repetira el bot.")
				.setMinLength(3)
				.setMaxLength(100)
				.setRequired(true),
		),
	execute: async (interaction) => {
		const text = interaction.options.getString("mensaje");

		interaction.reply(text).catch(console.error);
	},
};
