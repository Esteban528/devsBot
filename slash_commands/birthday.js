const { EmbedBuilder, SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
    .setName("birthday")
    .setDescription("Celebra tu cumpleaños🎉")
    .addUserOption(option => 
        option.setName('user')
            .setDescription('Menciona a alguien para desearle feliz cumpleaños🎉')
            .setRequired(true)), // Agregar la opción de mencionar a alguien para su cumpleaños

    async execute(interaction, client) {
        const personaMencionada = interaction.options.getUser('user'); 

        if (personaMencionada) {
            // Construir la tarjeta de cumpleaños
            const tarjeta = new EmbedBuilder()
                .setColor('#0099ff') 
                .setTitle(`¡Feliz Cumpleaños, ${personaMencionada.username}! 🎉🎂`) // Usar el nombre de la persona mencionada
                .setDescription(`Que tengas un excelente día y de celebración.`)
                .setImage('https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQpapHeGOGN1CKQ09yGFQgvsaVg9VVEPDgxFA&s') // URL de una imagen de cumpleaños
                .setFooter({ text:'¡Disfruta tu día especial!🎉' }); 

            // Enviar la tarjeta como un mensaje
            interaction.reply({ embeds: [tarjeta] });
        } else {

            // Si no se proporciona una persona válida, responder con un mensaje de error
            const embed = new EmbedBuilder().setColor('#FF0000').setDescription('¡Debes mencionar a alguien para desearle feliz cumpleaños!');
            interaction.reply({ embeds: [embed] });
        }
    },
}; 
