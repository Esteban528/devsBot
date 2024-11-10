const { SlashCommandBuilder } = require('discord.js');
const fetchProgrammingArticles = require('../events/fetchProgrammingArticles'); 

module.exports = {
  data: new SlashCommandBuilder()
    .setName('news')
    .setDescription('📰 Obtiene artículos de programación.')
    .setDefaultMemberPermissions(8), 
    
  async execute(interaction) {
    const articlesMessage = await fetchProgrammingArticles(); 
    await interaction.reply(articlesMessage); 
  },
};

