const { EmbedBuilder, AttachmentBuilder } = require("discord.js");
const generateImage = require("../utils/canvas/welcomeImage");
const runGemini = require("../utils/ia/Gemini");

const WELCOME_CHANNEL_ID = "1244496193254461460";
const GENERAL_CHANNEL_ID = "1241047932279586961";
const RULES_CHANNEL_ID = "1241434406678171750";
const ROLE_CHANNEL_ID = "1241585144800874598";
const PROGRAMMING_CHANNEL_ID = "1244004658658410547";

module.exports = async (client, member) => {
  const welcomeChannel = await client.channels.fetch(WELCOME_CHANNEL_ID);

  const welcomeMessage = await runGemini(`
    Alguien nuevo se ha unido, es el usuario <@${member.user.id}> aqui te dejo algunas indicaciones:
    DEBES MENCIONARLO SI O SI
    
    Canal de reglas: <#${RULES_CHANNEL_ID}>
    Canal de personalización de roles: <#${ROLE_CHANNEL_ID}>

    Canal de aprender a programar: <#${PROGRAMMING_CHANNEL_ID}> (Instrucciones: Leer la introducción, ver videos introductorios, empezar con el primer tramo en el que se verá Pseint y donde se recomienda dos cursos, en los cuales se debe elegir uno)

    Tambien puedes decir algo asi: Aprovecha los canales y recursos gratuitos es muy posible que te sirvan en un futuro.
    Máximo 50 caracteres.
    `);

  const buffer = await generateImage(member);
  const attachment = new AttachmentBuilder(buffer, {
    name: "generated-image.png",
  });

  const embed = new EmbedBuilder()
    .setTitle(`${member.user.displayName} te damos la bienvenida a la comunidad! 🐊`)
    .setColor('#0099ff')
    .setImage("attachment://generated-image.png");

  welcomeChannel.send({
    content: `<@${member.user.id}> ${welcomeMessage}`,
    embeds: [embed],
    files: [attachment],
  });
};
