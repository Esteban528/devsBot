const { SlashCommandBuilder } = require("discord.js")
const Discord = require("discord.js")

module.exports = {
    data: new SlashCommandBuilder()
    .setName('announcement')
    .setDescription("📢 Usa el sistema de anuncios."),
    cooldown: 3000,
      
    async execute(interaction, Client) {

        let canal = Client.channels.cache.get('1241980004913643552')

    if (!interaction.member.permissions.has(Discord.PermissionFlagsBits.Administrator)) return interaction.reply({content: `❌ **¡Tienes que ser administrador para mandar anuncios!**`}).then(() => {
            setTimeout(() => {
                interaction.deleteReply()
            }, 11000)
        })

            let modal = new Discord.ModalBuilder()
            .setCustomId('modal')
            .setTitle('Anuncio');
      
            let desc = new Discord.TextInputBuilder()
            .setCustomId('descripcion')
            .setLabel("Descripción del mensaje")
            .setStyle(Discord.TextInputStyle.Paragraph)
            .setPlaceholder('Introduzca la descripción del anuncio.')

            const descripcion = new Discord.ActionRowBuilder().addComponents(desc);

            modal.addComponents(descripcion);
          
            await interaction.showModal(modal);

            const modalInteraction = await interaction.awaitModalSubmit({ filter: i => i.user.id === interaction.user.id, time: 1200000_000 })

            const descs = modalInteraction.fields.getTextInputValue('descripcion')
            
            let embed = new Discord.EmbedBuilder()
                .setColor('#0099ff') 
                .setTitle(`📢 | ANUNCIO | Run Devs Community`)
                .setFooter({ text: `Run Devs Community© - Todos los derechos reservados` })
                .setTimestamp()
                .setDescription(`${descs}`)
                .setImage('https://cdn.discordapp.com/attachments/1248493745465200670/1269115360251220083/standard.gif?ex=66b38088&is=66b22f08&hm=2d51ec5d805acd009c597a558ef0a0fdc00dcf991999631378e09c56fcb2a794&')
                .addFields([
                    { name: `Anuncio por:`, value: `${interaction.member}`, inline: true },
                ]);

                canal.send({ content: `||@everyone||`, embeds: [embed] }).then((msg) => {
                    msg.react(`✅`);
                    msg.react(`❌`);
                  });

                await modalInteraction.deferUpdate()
    }
}