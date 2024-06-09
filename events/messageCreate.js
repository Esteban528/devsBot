
const triggerResponses = [
  { trigger: "pene", response: "Por qué dices *pene* acaso no puedes pensar en otra cosa?", filter: true },
  { trigger: "tu mama", response: "es una camioneta", filter: false },
  { trigger: "tio", response: "Tu tio te viola!", filter: false },
  { trigger: "hola", response: "Hola, que tal!!", filter: false },
]

// Mensajes Random
module.exports = async (client, message) => {

  if (message.author.bot) return; // si el autor del message es el bot, no vuleva a reponder
  message.content.slice(1).split(' ')[0] // el contenido del mensaje menos 1 carácter
  const messageText = message.content;

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


  /* if(message.content === "pene") message.reply( "comes" )
  if(message.content === "que") message.reply( "so" )
  if(message.content === "13") message.reply( "agarremela que se me tuerce" )
  if(message.content === "hola") message.reply( "tu nariz entre mis bolas" )
  if(message.content === "tu mama") message.reply( "Es una camioneta" )
  if(message.content === "tu tio") message.reply( "te viola" )
  if(message.content === "melo") message.reply( "me lo agarras" ) 
  if(message.content === "verde") message.reply( "agachate y me lo muerdes" )  */

};
