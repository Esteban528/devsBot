// Sistema de bienvenida
const { EmbedBuilder, AttachmentBuilder } = require("discord.js");
const generateImage = require("../utils/canvas/welcomeImage");
const runGemini = require("../utils/ia/Gemini");

module.exports = async (client, member) => {

  const welcomeChannelId = "1244496193254461460";
  const generalChannel = "1241047932279586961";
  const channel = await client.channels.fetch(welcomeChannelId);
  const general = await client.channels.fetch(generalChannel);
  const welcomeMessage = await runGemini(`
    Alguien nuevo se ha unido, es el usuario <@${member.user.id}> aqui te dejo algunas indicaciones:
    DEBES MENCIONARLO SI O SI
    
    Canal de reglas: <#1241434406678171750>
    Canal de personalización de roles: <#1241585144800874598>

    Canal de aprender a programar: <#1244004658658410547> (Instrucciones: Leer la introducción, ver videos introductorios, empezar con el primer tramo en el que se verá Pseint y donde se recomienda dos cursos, en los cuales se debe elegir uno)

    Tambien puedes decir algo asi: Aprovecha los canales y recursos gratuitos es muy posible que te sirvan en un futuro.
    `)

  const buffer = await generateImage(member);
  const attachment = new AttachmentBuilder(buffer, {
    name: "generated-image.png",
  })

  const embed = new EmbedBuilder()
    .setTitle(`${member.user.displayName} te damos la bienvenida a la comunidad! 🐊`)
    .setColor('#0099ff')
    .setDescription(`
    Lee las <#1241434406678171750> e invita a tus amigos!
  `)
  .setImage("attachment://generated-image.png");

  channel.send({
    content: `<@${member.user.id}>`,
    embeds: [embed],
    files: [attachment]
  });
  general.send({
    content: welcomeMessage
  })
};
