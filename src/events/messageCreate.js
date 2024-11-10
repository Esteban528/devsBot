const CommandHandler = require('../commands/commandHandler.js');

const prefix = ".";
const triggerResponses = [
  { trigger: "necesito ayuda", response: "¿Necesitas ayuda? Puedes preguntar en <#1242296914452545597>", filter: false },
]

module.exports = async (client, message) => {

  if (message.author.bot) return; // si el autor del message es el bot, no vuleva a reponder
  message.content.slice(1).split(' ')[0] // el contenido del mensaje menos 1 carácter
  const messageText = message.content;

  if (messageText[0] == prefix) {
    const command = messageText.split(" ");
    CommandHandler.execute(command[0].split(".")[1], message);
    return;
  }

  triggerResponses.forEach(({ trigger, response, filter }) => {
    if (filter) {
      if (messageText === trigger) {
        message.reply(response);
      }
    } else {
      if (messageText.toLowerCase().includes(trigger)) {
        message.reply(response);
      }
    }
  })

};
