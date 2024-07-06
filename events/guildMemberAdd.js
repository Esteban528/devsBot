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
    .setTitle(`${member.user.displayName} te damos la bienvenida a la comunidad! 🐊`)
    .setColor('#0099ff')
    .setDescription(`
    Me alegro que estés aqui, espero que te sirva de algo.
    Sino quieres ser castigado lee <#1241434406678171750>
    Para personalizar tu perfil y adquirir roles ve a <#1241585144800874598>

    Si quieres aprender a programar o adentrarte en este mundo puedes ir a <#1244004658658410547>

    Aprovecha los canales y recursos gratuitos es muy posible que te sirvan en un futuro.
  `)
  .setImage("attachment://generated-image.png");

  channel.send({
    content: `<@${member.user.id}>`,
    embeds: [embed],
    files: [attachment]
  });
};