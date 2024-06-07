// Sistema de bienvenida
const { EmbedBuilder, AttachmentBuilder } = require("discord.js");
const generateImage = require("../utils/canvas/welcomeImage")

module.exports = async (client, member) => {

  const welcomeChannelId = "1244496193254461460";
  const channel = await client.channels.fetch(welcomeChannelId);

  const buffer = await generateImage(member);
  const attachment = new AttachmentBuilder(buffer, {
    name: "generated-image.png",
  })

  const embed = new EmbedBuilder()
    .setTitle(`${member.user.displayName} bienvenido/a a la comunidad! 🐊`)
    .setColor('#0099ff')
    .setDescription(`
    Nos alegramos que estés aqui, date una vuelta por <#1241434406678171750> y <#1241585144800874598>
  `)
  .setImage("attachment://generated-image.png");

  channel.send({
    content: `<@${member.user.id}>`,
    embeds: [embed],
    files: [attachment]
  });
};