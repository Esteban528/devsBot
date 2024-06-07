// Mensajes Random
module.exports =  async (client, message) => {

  if(message.author.bot) return; // si el autor del message es el bot, no vuleva a reponder
  const args = message.content.slice(1).split(' ')[0] // el contenido del mensaje menos 1 carácter

  if(message.content === "pene") message.reply( "comes" )
  if(message.content === "que") message.reply( "so" )
  if(message.content === "13") message.reply( "agarremela que se me tuerce" )
  if(message.content === "hola") message.reply( "tu nariz entre mis bolas" )
  if(message.content === "tu mama") message.reply( "Es una camioneta" )
  if(message.content === "tu tio") message.reply( "te viola" )
  if(message.content === "melo") message.reply( "me lo agarras" ) 

};
