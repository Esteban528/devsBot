const { EmbedBuilder, SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
    .setName("cumpleaños")
    .setDescription("Celebra tu cumpleaños🎉"),


async execute(interaction, client) {
        
        // Construir la tarjeta de cumpleaños
        const tarjeta = new EmbedBuilder()
            .setColor('#0099ff') // Color dorado
            .setTitle(`¡Feliz Cumpleaños, ${interaction.user.username}! 🎉🎂`)
            .setDescription(`Que tengas un exelente dia y de celebración.`)
            .setImage('https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQpapHeGOGN1CKQ09yGFQgvsaVg9VVEPDgxFA&s') // URL de una imagen  cumpleaños
            .setFooter({ text:'¡Disfruta tu día especial!' }); 

        // Enviar la tarjeta como un mensaje
        interaction.reply({ embeds: [tarjeta] });
    },
};
