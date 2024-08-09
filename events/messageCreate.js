const CommandHandler = require('../slash_commands/ia.js');

const prefix = ".";
const triggerResponses = [
  // { trigger: "pene", response: "Por qué dices *pene* acaso no puedes pensar en otra cosa?", filter: true },
  // { trigger: "tu mama", response: "es una camioneta", filter: false },
  // { trigger: "hola", response: "Hola, que tal!!", filter: false },
]

// Mensajes Random
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
