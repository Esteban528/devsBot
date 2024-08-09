const { SlashCommandBuilder } = require('@discordjs/builders');
const { EmbedBuilder } = require('discord.js');
const discord = require('discord.js');
const QuickChart = require('quickchart-js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('statistics')
        .setDescription('📊 Muestra las estadisticas de miembros en el servidor.'),
    async execute(interaction) {
        const guild = interaction.guild;
        const totalMembers = guild.memberCount;
        const botMembers = guild.members.cache.filter(member => member.user.bot).size;
        const humanMembers = totalMembers - botMembers;
        const last24Hours = guild.members.cache.filter(member => Date.now() - member.joinedTimestamp < 24 * 60 * 60 * 1000).size;
        const last7Days = guild.members.cache.filter(member => Date.now() - member.joinedTimestamp < 7 * 24 * 60 * 60 * 1000).size;
       


        const chart = new QuickChart();
        chart
            .setConfig({
                type: 'bar',
                data: {
                    labels: ['Total', 'Miembros', 'Bots', '24h', '7 dias'],
                    datasets: [{
                        label: 'Member Count',
                        data: [totalMembers, humanMembers, botMembers, last24Hours, last7Days],
                        backgroundColor: ['#36a2eb', '#ffce56', '#ff6384', '#cc65fe', '#66ff99']
                    }]
                },
                options: {
                    plugins: {
                        title: {
                            display: true,
                            text: `Miembros del servidor ${guild.name}`
                        }
                    }
                },



            
            })

            .setWidth(500)
            .setHeight(300)
            .setBackgroundColor('#151515');
           


        const chartUrl = await chart.getShortUrl();

        const embed = new EmbedBuilder()

            .setTitle(`📘 │ INFORMACIÓN`)
            .setColor('#0099ff')
            .setDescription(`🧾 Total: **${totalMembers}**\n👥 Miembros: **${humanMembers}**\n🗣️ Bots: **${botMembers}**\n📋 Ultimas 24h: **${last24Hours}**\n📊 Ultimos 7 dias: **${last7Days}**`)
            .setImage(chartUrl);

        await interaction.reply({ embeds: [embed] });
    },
};